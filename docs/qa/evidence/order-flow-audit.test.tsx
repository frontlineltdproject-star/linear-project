import React, { Component, type ReactNode } from 'react'
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GraphQLInt } from 'graphql'
import { GraphQLExecutor } from '#/lib/graphql'
import { GraphQLExecutorError } from '#/lib/graphql/errors'
import { PurchaseOrderService, savedColliDraft, savedInvoiceRowDraft } from '#/features/purchase-orders/services/purchase-order-service'
import { formOptions, renderDetails, savedOrder } from '#/features/purchase-orders/components/details/test-support'
import { OrderStatusCard } from '#/features/purchase-orders/components/details/order-status-card'
import { OrderDetailsCard, detailsChanges, detailsDraftFrom } from '#/features/purchase-orders/components/details/order-details-card'
import { colliDraftErrors, newColliDraft } from '#/features/purchase-orders/components/details/order-collis-tab'
import { PurchaseOrderCreationForm } from '#/features/purchase-orders/components/creation/purchase-order-creation-form'
import type { PurchaseOrderFormOptions } from '#/features/purchase-orders/types'

// Audit-only observation tests: assertions describe the pinned defects, not desired behavior.
// No source/config/package changes. All outbound GraphQL/HTTP transports are mocked or blocked.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
  useBlocker: () => ({ status: 'idle' }),
}))
vi.mock('#/features/auth/hooks/use-has-authority', () => ({ useHasAuthority: () => true }))

let execute: ReturnType<typeof vi.spyOn>
let blockedFetch: ReturnType<typeof vi.fn>
beforeEach(() => {
  blockedFetch = vi.fn(() => { throw new Error('AUDIT: outbound fetch blocked') })
  vi.stubGlobal('fetch', blockedFetch)
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('AUDIT: outbound XHR blocked') })
  execute = vi.spyOn(GraphQLExecutor, 'execute').mockResolvedValue({ id: 42 })
  vi.spyOn(PurchaseOrderService, 'formOptions').mockResolvedValue(formOptions as never)
})
afterEach(() => {
  cleanup()
  expect(blockedFetch).not.toHaveBeenCalled()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const unit = (id: number) => ({
  id, trackingCode: `HU-${id}`, setDescription: 'Fictional box', terminalDisposition: null,
  declaredLengthCm: 40, declaredWidthCm: 30, declaredHeightCm: 20,
  declaredGrossWeightKg: 12, declaredNetWeightKg: 11,
  packageType: 'CARDBOARD_BOX', dangerousGoods: false, fragile: false, unpacked: false, damagedPacking: false,
})
const readyOrder = (units: ReturnType<typeof unit>[]) => savedOrder({
  status: 'READY', handlingUnits: units,
  currentWarehouseStay: { id: 7, state: 'EXPECTED', storagePosition: null, warehouse: { id: 1, code: 'ATH', name: 'Fictional hub' } },
})
class CaptureCrash extends Component<{ children: ReactNode; capture: (error: Error) => void }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error) { this.props.capture(error) }
  render() { return this.state.error ? <div role="alert">Captured render crash</div> : this.props.children }
}

describe('ORDER-FLOW audit: pinned main 6aa2595', () => {
  it.each([false, true])('OF-1 stock panel crashes when a saved colli appears after opening (initially populated=%s)', (populated) => {
    const capture = vi.fn()
    // Expected React error-boundary diagnostic is captured, not a silent unhandled test error.
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const existing = populated ? [unit(101)] : []
    const view = (units: ReturnType<typeof unit>[]) => (
      <CaptureCrash capture={capture}><OrderStatusCard purchaseOrder={readyOrder(units)} /></CaptureCrash>
    )
    const { rerenderDetails } = renderDetails(view(existing))
    fireEvent.click(screen.getByRole('button', { name: 'Record arrival and set PO in stock' }))
    fireEvent.change(screen.getByLabelText(/Storage position/), { target: { value: 'A-01' } })
    // Same component identity, matching a save/refetch on the same Order route.
    rerenderDetails(view([...existing, unit(102)]))
    expect(capture).toHaveBeenCalled()
    expect(capture.mock.calls[0][0]).toBeInstanceOf(TypeError)
    expect(capture.mock.calls[0][0].message).toMatch(/undefined.*lengthCm/)
    expect(screen.getByRole('alert').textContent).toBe('Captured render crash')
    expect(execute).not.toHaveBeenCalled()
  })

  it('OF-2 stale retry takes an unreviewed version and sends a concurrent header value backwards', async () => {
    execute.mockRejectedValueOnce(new GraphQLExecutorError('stale', { cause: null, classifications: ['CONFLICT'] }))
    const original = savedOrder({ supplierReference: 'SUP-original' })
    const card = (order: typeof original) => <OrderDetailsCard purchaseOrder={order} statusCard={null} />
    const { rerenderDetails } = renderDetails(card(original))
    fireEvent.click(screen.getByRole('button', { name: 'Edit order details' }))
    fireEvent.change(screen.getByLabelText('Message number'), { target: { value: 'MSG-operator' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))
    await screen.findByText(/This Order changed since you opened it/)
    expect(execute.mock.calls[0][1]).toMatchObject({ input: { expectedVersion: 7 } })
    // Refresh after conflict: another card's save advanced the Order to version 8.
    rerenderDetails(card(savedOrder({ version: 8, supplierReference: 'SUP-original' })))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('dialog').textContent).toContain('MSG-1 → MSG-operator')
    expect(screen.getByRole('dialog').textContent).not.toContain('SUP-concurrent')
    // Background refresh occurs while the version-8 review is open.
    rerenderDetails(card(savedOrder({ version: 9, supplierReference: 'SUP-concurrent' })))
    expect(screen.getByRole('dialog').textContent).not.toContain('SUP-concurrent')
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))
    await waitFor(() => expect(execute).toHaveBeenCalledTimes(2))
    expect(execute.mock.calls[1][1]).toMatchObject({
      input: { expectedVersion: 9, supplierReference: 'SUP-original', messageNumber: 'MSG-operator' },
    })
    await screen.findByRole('button', { name: 'Edit order details' })
  })

  it('control: before any stale rejection, Details retains the originally reviewed version', async () => {
    const card = (version: number) => <OrderDetailsCard purchaseOrder={savedOrder({ version })} statusCard={null} />
    const { rerenderDetails } = renderDetails(card(7))
    fireEvent.click(screen.getByRole('button', { name: 'Edit order details' }))
    fireEvent.change(screen.getByLabelText('Message number'), { target: { value: 'MSG-operator' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    rerenderDetails(card(9))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and save' }))
    await waitFor(() => expect(execute).toHaveBeenCalledTimes(1))
    expect(execute.mock.calls[0][1]).toMatchObject({ input: { expectedVersion: 7 } })
    await screen.findByRole('button', { name: 'Edit order details' })
  })

  it('OF-3 Create locally accepts and submits a fractional colli dimension that its GraphQL Int rejects', async () => {
    const onCreate = vi.fn((values, status, attempt) => PurchaseOrderService.create(values, status, attempt))
    renderDetails(<PurchaseOrderCreationForm
      options={formOptions as unknown as PurchaseOrderFormOptions}
      initialValues={{ clientCompanyId: '2', openingWarehouseId: '1', ownerReference: 'AUDIT', pickupInGreece: false }}
      canCreateSupplier={false} ordersListLink={<a href="#">Orders</a>}
      onCreate={onCreate} onCreated={vi.fn()} onCancel={vi.fn()}
    />)
    fireEvent.click(screen.getByRole('tab', { name: /Collis/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Add colli' }))
    fireEvent.change(screen.getByLabelText('Length cm Colli 1'), { target: { value: '1.5' } })
    fireEvent.change(screen.getByLabelText('Width cm Colli 1'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Height cm Colli 1'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Colli 1' }))
    expect(screen.queryByRole('button', { name: 'Save Colli 1' })).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(execute).toHaveBeenCalledTimes(1))
    const payload = execute.mock.calls[0][1] as any
    expect(payload.input.handlingUnits[0]).toMatchObject({ lengthCm: 1.5, widthCm: 2, heightCm: 3 })
    // Pinned SDL defines HandlingUnitInput.lengthCm as Int (lines 273-278).
    expect(() => GraphQLInt.parseValue(payload.input.handlingUnits[0].lengthCm)).toThrow(/non-integer/)
  })

  it.each([
    { lengthCm: '0', widthCm: '2', heightCm: '3' },
    { grossWeightKg: '0' },
  ])('OF-3 shared colli validator also accepts invalid zero measurements: %j', (invalid) => {
    expect(colliDraftErrors({ ...newColliDraft(), ...invalid }, (en) => en)).toEqual([])
  })

  it('control: valid optional measurements, positive integer dimensions and net zero remain accepted', () => {
    expect(colliDraftErrors(newColliDraft(), (en) => en)).toEqual([])
    expect(colliDraftErrors({ ...newColliDraft(), lengthCm: '1', widthCm: '2', heightCm: '3', grossWeightKg: '1.5', netWeightKg: '0' }, (en) => en)).toEqual([])
  })

  it('parent suspect ruled out: all independent row/header saves echo nullable saved header fields', async () => {
    const order = savedOrder({
      supplierReference: 'SUP-keep', messageNumber: 'MSG-keep', readinessRemark: 'Ready-keep',
      urgentInformation: 'Urgent-keep', deliveryNoteExport: 'DN-E-keep',
      invoiceCompany: { id: 9, name: 'Fictional invoice company' },
      handlingUnits: [unit(101), unit(102)],
      invoiceRows: [{ id: 11, lineNumber: 1, description: 'Fictional row', hsCode: 'HS', quantity: 2, unit: 'PC', unitPrice: '1.25', totalValue: { amount: '2.50', currency: 'EUR' } }],
    })
    const expected = { supplierCompanyId: 3, invoiceCompanyId: 9, supplierReference: 'SUP-keep', messageNumber: 'MSG-keep', readinessRemark: 'Ready-keep', urgentInformation: 'Urgent-keep', deliveryNoteExport: 'DN-E-keep' }
    await PurchaseOrderService.saveColli(order, { ...savedColliDraft(order.handlingUnits[0]), setDescription: 'Edited' })
    await PurchaseOrderService.removeColli(order, '102')
    await PurchaseOrderService.saveInvoiceRow(order, { ...savedInvoiceRowDraft(order.invoiceRows[0]), description: 'Edited' })
    await PurchaseOrderService.removeInvoiceRow(order, '11')
    await PurchaseOrderService.saveCard(order, detailsChanges(order, { ...detailsDraftFrom(order), urgent: true }, false))
    expect(execute).toHaveBeenCalledTimes(5)
    for (const [document, variables] of execute.mock.calls) {
      expect(document.name).toBe('updatePurchaseOrder')
      expect(variables.input).toMatchObject(expected)
      expect(variables.input).not.toHaveProperty('internalNotes')
      expect(variables.input).not.toHaveProperty('externalNotes')
    }
    expect(execute.mock.calls[0][1].input).not.toHaveProperty('invoiceRows')
    expect(execute.mock.calls[2][1].input).not.toHaveProperty('handlingUnits')
    expect(execute.mock.calls[4][1].input).not.toHaveProperty('handlingUnits')
    expect(execute.mock.calls[4][1].input).not.toHaveProperty('invoiceRows')
    await PurchaseOrderService.updateNotes(order, 'internalNotes', 'New internal note')
    expect(execute.mock.calls[5][0].name).toBe('updatePurchaseOrderNotes')
    expect(execute.mock.calls[5][1].input).toEqual({ expectedVersion: 7, internalNotes: 'New internal note' })
  })
})
