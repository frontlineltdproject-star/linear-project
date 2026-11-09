/** Read-only QA evidence on main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
 * Real Details host, presentation, editor/actions, mapping, TanStack Query and form.
 * Only service/data, purchase-order options and router boundaries are mocked.
 * Synthetic fixtures; native fetch/XHR fail closed. Observation tests intentionally
 * assert observed defects, while controls assert required behavior. No production fix.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ShipmentInvoiceDetailsPage } from '#/features/shipment-invoices/details/shipment-invoice-details-page'
import { ShipmentInvoiceService } from '#/features/shipment-invoices/services/shipment-invoice-service'
import { shipmentInvoiceKeys } from '#/features/shipment-invoices/hooks/use-shipment-invoices'
import { todayInAthens } from '#/features/shipment-invoices/create/shipment-invoice-create-page'
import type { ShipmentInvoiceFieldsFragment, ShipmentInvoiceGoodsFieldsFragment, ShipmentInvoiceEvaluationFieldsFragment } from '#/graphql/generated/graphql'

const router = vi.hoisted(() => ({ navigate: vi.fn(), blocker: null as any }))
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => router.navigate,
  useRouter: () => ({ buildLocation: () => ({ href: '/synthetic/order' }) }),
  useBlocker: (options: any) => { router.blocker = options },
}))
vi.mock('#/features/purchase-orders/hooks/use-purchase-orders', () => ({
  usePurchaseOrderFormOptions: () => ({ data: { countries: [{ currencyCode: 'EUR' }] } }),
}))
vi.mock('#/features/shipment-invoices/services/shipment-invoice-service', () => ({
  ShipmentInvoiceService: {
    invoice: vi.fn(), goods: vi.fn(), evaluate: vi.fn(), save: vi.fn(),
    finalize: vi.fn(), discard: vi.fn(), cancel: vi.fn(),
    replacementPrefill: vi.fn(), createReplacement: vi.fn(),
  },
}))

const shipment = {
  id: 7, shipmentNumber: 'QA-SHIP-7', status: 'PREPARING' as const,
  originCountry: { id: 1, name: 'Fixture origin' }, originCity: null,
  destinationCountry: { id: 2, name: 'Fixture destination' }, destinationCity: null,
}
const evaluation = (fingerprint = 'review-1'): ShipmentInvoiceEvaluationFieldsFragment => ({
  fullTotal: { amount: '1200.00', currency: 'EUR' }, currencies: ['EUR'],
  mixedCurrency: false, unavailableInvoiceRowIds: [], deletedRowCount: 0,
  otherInvoices: [], missing: [], finalizable: true, fingerprint,
})
const goods = (): ShipmentInvoiceGoodsFieldsFragment => ({
  shipment,
  orders: [{ id: 40, internalNumber: 'QA-PO-40', client: { id: 2, name: 'QA Client' },
    supplier: { id: 3, name: 'QA Supplier' }, messageNumber: null,
    status: 'PREPARED_FOR_SHIPMENT', rows: [{ invoiceRowId: 100, purchaseOrderId: 40,
      sourcePurchaseOrderId: 40, sourceLineNumber: 1, lineNumber: 1,
      description: 'QA frozen valve', hsCode: '8481', quantity: 2, unit: 'PC',
      unitPrice: '600.00', lineAmount: { amount: '1200.00', currency: 'EUR' },
      allocationState: 'UNKNOWN', eligible: true, awaitingReason: null, otherInvoices: [],
    }],
  }],
  clients: [{ id: 2, name: 'QA Client', invoicingCompanies: [{ id: 9, name: 'QA Company', shipperText: 'QA COMPANY DEFAULT' }] }],
  defaultClientCompanyId: 2, defaultShipperText: 'QA DEFAULT',
})
function invoice(status: 'DRAFT' | 'FINALIZED' | 'CANCELLED' | 'DISCARDED' = 'DRAFT', version = 1): ShipmentInvoiceFieldsFragment {
  return {
    id: 3, status, version, invoiceNumber: status === 'FINALIZED' || status === 'CANCELLED' ? 1001 : null,
    shipment, client: { id: 2, name: 'QA Client' }, invoiceCompany: { id: 9, name: 'QA Company' },
    invoiceType: 'INVOICE', subtitle: 'PACKING LIST', documentDate: '2026-11-02',
    shipperText: 'QA saved shipper', consigneeText: 'QA consignee', agentText: 'QA agent', notifyText: null,
    packingDetails: 'QA saved packing', totalWeightKg: '12.500', partialTotalAmount: '100.00', partialTotalCurrency: 'EUR',
    notes: 'QA saved notes', fullTotal: { amount: '1200.00', currency: 'EUR' },
    lines: [{ position: 1, invoiceRowId: 100, purchaseOrderId: 40, orderReference: 'QA-PO-40',
      sourcePurchaseOrderId: 40, sourceLineNumber: 1, description: 'QA frozen valve', hsCode: '8481',
      quantity: 2, unit: 'PC', unitPrice: '600.00', lineAmount: { amount: '1200.00', currency: 'EUR' },
      available: true, issue: null, awaitingReason: null, otherInvoices: [] }],
    evaluation: status === 'DRAFT' ? evaluation() : null,
    review: status === 'DRAFT' ? { required: false, items: [], fingerprint: 'review-1', reviewedFingerprint: 'review-1' } : null,
    replaces: null, replacement: null, cancellationReason: status === 'CANCELLED' ? 'QA reason' : null,
    cancelledBy: null, cancelledAt: null, finalizedBy: null, finalizedAt: null,
    createdBy: { id: 1, name: 'QA Operator' }, createdAt: '2026-11-02T09:00:00Z', updatedBy: null, updatedAt: null,
    capabilities: { canEdit: status === 'DRAFT', canFinalize: status === 'DRAFT', canDiscard: status === 'DRAFT',
      canCancel: status === 'FINALIZED', canReplace: status === 'CANCELLED' },
  } as ShipmentInvoiceFieldsFragment
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const clients: QueryClient[] = []
let server: ShipmentInvoiceFieldsFragment
beforeEach(() => {
  vi.clearAllMocks()
  server = invoice()
  router.navigate.mockResolvedValue(undefined)
  vi.stubGlobal('fetch', vi.fn(() => { throw Error('QA native fetch blocked') }))
  vi.stubGlobal('XMLHttpRequest', class { constructor() { throw Error('QA native XHR blocked') } })
  vi.mocked(ShipmentInvoiceService.invoice).mockImplementation(async () => structuredClone(server))
  vi.mocked(ShipmentInvoiceService.goods).mockResolvedValue(goods())
  vi.mocked(ShipmentInvoiceService.evaluate).mockResolvedValue(evaluation())
  vi.mocked(ShipmentInvoiceService.save).mockImplementation(async (_id, input) => {
    server = { ...invoice('DRAFT', 2), ...input.fields, notes: input.fields.notes }
    return structuredClone(server)
  })
  vi.mocked(ShipmentInvoiceService.finalize).mockImplementation(async () => { server = invoice('FINALIZED', 2); return structuredClone(server) })
  vi.mocked(ShipmentInvoiceService.discard).mockImplementation(async () => { server = invoice('DISCARDED', 2); return structuredClone(server) })
  vi.mocked(ShipmentInvoiceService.cancel).mockImplementation(async (_id, _version, reason) => { server = { ...invoice('CANCELLED', 2), cancellationReason: reason }; return structuredClone(server) })
  vi.mocked(ShipmentInvoiceService.replacementPrefill).mockImplementation(async () => ({
    fields: { ...server, clientCompanyId: 2, invoiceCompanyId: 9 }, goods: goods(), invoiceRowIds: [100],
    unavailableRowIds: [], deletedRowCount: 0, clientCleared: false, invoiceCompanyCleared: false,
    evaluation: evaluation(),
  } as any))
  vi.mocked(ShipmentInvoiceService.createReplacement).mockImplementation(async () => ({ ...invoice('DRAFT'), id: 4, review: null, replaces: { id: 3, invoiceNumber: 1001, status: 'CANCELLED' } }))
})
afterEach(() => { cleanup(); clients.splice(0).forEach(client => client.clear()); vi.unstubAllGlobals() })
function mount(data = server) {
  server = data
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity, gcTime: Infinity } } })
  clients.push(client)
  client.setQueryData(shipmentInvoiceKeys.invoice('3'), structuredClone(data))
  const view = render(<QueryClientProvider client={client}><ShipmentInvoiceDetailsPage shipmentInvoiceId="3" /></QueryClientProvider>)
  return { client, ...view }
}
async function enabled(name: string) {
  await waitFor(() => expect((screen.getByRole('button', { name }) as HTMLButtonElement).disabled).toBe(false))
}
async function edit() {
  fireEvent.click(screen.getByRole('button', { name: 'Edit draft' }))
  await enabled('Save changes')
}
async function replace() {
  fireEvent.click(screen.getByRole('button', { name: 'Create replacement' }))
  await enabled('Create draft')
}

describe('Integrated Shipment Invoice Details controls and defect observations', () => {
  it('CONTROL SHI-011/014 saves original expected version and explicit review acknowledgement', async () => {
    mount(); await edit()
    expect((screen.getByLabelText('Shipper') as HTMLInputElement).value).toBe('QA saved shipper')
    expect(screen.queryByRole('button', { name: 'Choose Shipment' })).toBeNull()
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'QA changed notes' } })
    await enabled('Save changes')
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(ShipmentInvoiceService.save).toHaveBeenCalledWith('3', expect.objectContaining({
      expectedVersion: 1, reviewedFingerprint: 'review-1', invoiceRowIds: [100], fields: expect.objectContaining({ notes: 'QA changed notes' }),
    })))
    await screen.findByRole('button', { name: 'Edit draft' })
    expect(screen.getByText('QA changed notes')).toBeTruthy()
  })

  it('CONTROL SHI-012 background newer read retains local edit and blocks stale save', async () => {
    const { client } = mount(); await edit()
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'QA local work' } })
    await enabled('Save changes')
    act(() => client.setQueryData(shipmentInvoiceKeys.invoice('3'), { ...invoice('DRAFT', 2), notes: 'QA remote work' }))
    await screen.findByText(/changed elsewhere/)
    expect((screen.getByLabelText('Notes') as HTMLInputElement).value).toBe('QA local work')
    expect((screen.getByRole('button', { name: 'Save changes' }) as HTMLButtonElement).disabled).toBe(true)
    expect(ShipmentInvoiceService.save).not.toHaveBeenCalled()
  })

  it('CONTROL SHI-013 pending save blocks later typing, cancel and router navigation', async () => {
    const pending = deferred<ShipmentInvoiceFieldsFragment>()
    vi.mocked(ShipmentInvoiceService.save).mockReturnValue(pending.promise)
    mount(); await edit()
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'QA submitted' } })
    await enabled('Save changes'); fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'QA late edit' } })
    expect((screen.getByLabelText('Notes') as HTMLInputElement).value).toBe('QA submitted')
    expect((screen.getByRole('button', { name: 'Cancel editing' }) as HTMLButtonElement).disabled).toBe(true)
    expect(router.blocker.shouldBlockFn({ next: { pathname: '/away', search: {} } })).toBe(true)
    await act(async () => pending.resolve({ ...invoice('DRAFT', 2), notes: 'QA submitted' }))
    await screen.findByRole('button', { name: 'Edit draft' })
    expect(ShipmentInvoiceService.save).toHaveBeenCalledTimes(1)
  })

  it('CONTROL SHI-014 changed packing clears acknowledgement in saved API payload', async () => {
    mount(); await edit()
    vi.mocked(ShipmentInvoiceService.evaluate).mockResolvedValue(evaluation('review-2'))
    fireEvent.change(screen.getByLabelText('Packing details'), { target: { value: 'QA changed packing' } })
    await enabled('Save changes')
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(ShipmentInvoiceService.save).toHaveBeenCalledWith('3', expect.objectContaining({
      reviewedFingerprint: null, fields: expect.objectContaining({ packingDetails: 'QA changed packing' }),
    })))
  })

  it('CONTROL SHI-015 refresh retains text, removes unavailable row and keeps warning across another refresh', async () => {
    mount(); await edit()
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'QA keep me' } })
    await enabled('Save changes')
    const nextGoods = goods()
    nextGoods.orders[0].rows[0].eligible = false
    nextGoods.orders[0].rows[0].awaitingReason = 'GROUP_PARTLY_ON_SHIPMENT'
    vi.mocked(ShipmentInvoiceService.goods).mockResolvedValue(nextGoods)
    server = invoice()
    server.lines[0].available = false
    server.evaluation = { ...evaluation('review-2'), unavailableInvoiceRowIds: [100], missing: ['ROWS_AVAILABLE'], finalizable: false }
    vi.mocked(ShipmentInvoiceService.evaluate).mockResolvedValue({ ...evaluation('empty'), fullTotal: { amount: null, currency: null }, missing: ['ROWS'], finalizable: false })
    fireEvent.click(screen.getByRole('button', { name: 'Refresh goods' }))
    await enabled('Save changes')
    expect((screen.getByLabelText('Notes') as HTMLInputElement).value).toBe('QA keep me')
    expect(screen.getByText('40 / 100')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Refresh goods' }))
    await enabled('Save changes')
    expect(screen.getByText('40 / 100')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(ShipmentInvoiceService.save).toHaveBeenCalledWith('3', expect.objectContaining({ invoiceRowIds: [], fields: expect.objectContaining({ notes: 'QA keep me' }) })))
  })

  it('OBSERVED SHI-006/015 saved draft displays unavailable row and its backend-supplied active total', () => {
    const saved = invoice()
    saved.lines[0].available = false
    saved.lines[0].issue = 'AWAITING_ALLOCATION'
    saved.lines[0].awaitingReason = 'GROUP_PARTLY_ON_SHIPMENT'
    saved.evaluation = { ...evaluation('changed'), unavailableInvoiceRowIds: [100], missing: ['ROWS_AVAILABLE'], finalizable: false }
    mount(saved)
    expect(screen.getByText('QA frozen valve')).toBeTruthy()
    expect(screen.getByText('EUR 1,200.00')).toBeTruthy()
    expect(screen.getByText('A selected row is no longer eligible on the Shipment.')).toBeTruthy()
    // The mapped read-only table does not distinguish the unavailable row. Expected active
    // draft total excludes it. Backend arithmetic must be independently traced/reproduced.
  })

  it('CONTROL SHI-016/017 finalization sends saved version/fingerprint once and adopts number', async () => {
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Finalize' }))
    expect(screen.getByRole('dialog').textContent).toContain('QA frozen valve')
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await screen.findByRole('heading', { name: 'Shipment Invoice · 1001' })
    expect(ShipmentInvoiceService.finalize).toHaveBeenCalledExactlyOnceWith('3', 1, 'review-1')
    expect(screen.queryByRole('button', { name: 'Edit draft' })).toBeNull()
  })

  it('CONTROL SHI-019 lost finalize result blocks retry and reconciles frozen record', async () => {
    vi.mocked(ShipmentInvoiceService.finalize).mockImplementation(async () => { server = invoice('FINALIZED', 2); throw new TypeError('QA response lost') })
    mount(); fireEvent.click(screen.getByRole('button', { name: 'Finalize' })); fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await screen.findByText(/result is uncertain/)
    expect((screen.getByRole('button', { name: 'Finalize' }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Check saved state' }))
    await screen.findByText('Finalized')
    expect(ShipmentInvoiceService.finalize).toHaveBeenCalledTimes(1)
  })

  it.each(['FINALIZED', 'CANCELLED'] as const)('OBSERVED SHI-018 %s frozen row vanishes when source FK becomes null', (status) => {
    const saved = invoice('FINALIZED')
    const view = mount(saved)
    expect(screen.getByText('QA frozen valve')).toBeTruthy()
    view.unmount()
    const deleted = invoice(status)
    deleted.lines[0].invoiceRowId = null
    mount(deleted)
    expect(screen.queryByText('QA frozen valve')).toBeNull()
    expect(screen.queryByText('QA-PO-40')).toBeNull()
    expect(screen.getByText('EUR 1,200.00')).toBeTruthy()
    // Expected: frozen description/quantity/value remain visible, even after source deletion.
  })

  it('CONTROL SHI-020 discard waits for explicit confirm and opens Shipment', async () => {
    mount(); fireEvent.click(screen.getByRole('button', { name: 'Discard draft' }))
    expect(ShipmentInvoiceService.discard).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(router.navigate).toHaveBeenCalledWith({ to: '/secured/shipments/$shipmentId', params: { shipmentId: '7' } }))
    expect(ShipmentInvoiceService.discard).toHaveBeenCalledExactlyOnceWith('3', 1)
  })

  it('CONTROL SHI-021 cancellation needs trimmed reason and does not create replacement', async () => {
    mount(invoice('FINALIZED'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel invoice' }))
    expect((screen.getByRole('button', { name: 'Confirm' }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.change(screen.getByLabelText('Cancellation reason'), { target: { value: '  QA correction  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await screen.findByText('Cancelled')
    expect(ShipmentInvoiceService.cancel).toHaveBeenCalledExactlyOnceWith('3', 1, 'QA correction')
    expect(ShipmentInvoiceService.createReplacement).not.toHaveBeenCalled()
    expect(screen.getByText('QA frozen valve')).toBeTruthy()
  })

  it('CONTROL SHI-022 lost cancellation answer reconciles without repeat or automatic replacement', async () => {
    vi.mocked(ShipmentInvoiceService.cancel).mockImplementation(async () => { server = invoice('CANCELLED', 2); throw new TypeError('QA answer lost') })
    mount(invoice('FINALIZED')); fireEvent.click(screen.getByRole('button', { name: 'Cancel invoice' }))
    fireEvent.change(screen.getByLabelText('Cancellation reason'), { target: { value: 'QA reason' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await screen.findByText(/result is uncertain/)
    fireEvent.click(screen.getByRole('button', { name: 'Check saved state' }))
    await screen.findByText('Cancelled')
    expect(ShipmentInvoiceService.cancel).toHaveBeenCalledTimes(1)
    expect(ShipmentInvoiceService.createReplacement).not.toHaveBeenCalled()
  })

  it('OBSERVED SHI-020 discarded result after uncertain response is shown as Draft without completing return navigation', async () => {
    vi.mocked(ShipmentInvoiceService.discard).mockImplementation(async () => { server = invoice('DISCARDED', 2); throw new TypeError('QA answer lost') })
    mount(); fireEvent.click(screen.getByRole('button', { name: 'Discard draft' })); fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await screen.findByText(/result is uncertain/)
    fireEvent.click(screen.getByRole('button', { name: 'Check saved state' }))
    await waitFor(() => expect(screen.queryByText(/result is uncertain/)).toBeNull())
    expect(screen.getByText('Draft')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Discard draft' })).toBeNull()
    expect(router.navigate).not.toHaveBeenCalled()
    expect(ShipmentInvoiceService.discard).toHaveBeenCalledTimes(1)
    // Expected: distinguish terminal discarded state and recover the Shipment destination.
  })

  it('CONTROL SHI-023 replacement starts unsaved with copied fields; cancel creates nothing', async () => {
    mount(invoice('CANCELLED')); await replace()
    expect((screen.getByLabelText('Shipper') as HTMLInputElement).value).toBe('QA saved shipper')
    expect(ShipmentInvoiceService.createReplacement).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel editing' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Cancelled')).toBeTruthy()
    expect(ShipmentInvoiceService.createReplacement).not.toHaveBeenCalled()
  })

  it('OBSERVED SHI-023 replacement reset reverts Athens date and cleared references to original in display and create payload', async () => {
    const original = invoice('CANCELLED')
    const currentGoods = goods()
    currentGoods.clients = []
    currentGoods.defaultClientCompanyId = null
    vi.mocked(ShipmentInvoiceService.replacementPrefill).mockResolvedValue({
      fields: {
        clientCompanyId: null, invoiceCompanyId: null, invoiceType: 'INVOICE',
        documentDate: original.documentDate, subtitle: original.subtitle,
        shipperText: original.shipperText, consigneeText: original.consigneeText,
        agentText: original.agentText, notifyText: original.notifyText,
        packingDetails: original.packingDetails, totalWeightKg: original.totalWeightKg,
        partialTotalAmount: original.partialTotalAmount, partialTotalCurrency: original.partialTotalCurrency,
        notes: original.notes,
      },
      goods: currentGoods, invoiceRowIds: [100], unavailableRowIds: [], deletedRowCount: 0,
      clientCleared: true, invoiceCompanyCleared: true, evaluation: evaluation(),
    } as any)
    mount(original); await replace()
    expect(todayInAthens()).not.toBe('2026-11-02')
    expect(screen.getByRole('button', { name: 'Choose date' }).textContent).toBe('02-11-2026')
    expect((screen.getByLabelText('Commercial Client') as HTMLSelectElement).value).toBe('2')
    expect((screen.getByLabelText('Invoicing company') as HTMLSelectElement).value).toBe('9')
    expect(screen.getByText('The original Client is no longer on this Shipment; choose the Client again.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Create draft' }))
    await waitFor(() => expect(ShipmentInvoiceService.createReplacement).toHaveBeenCalledWith('3', expect.objectContaining({
      fields: expect.objectContaining({ documentDate: '2026-11-02', clientCompanyId: 2, invoiceCompanyId: 9 }),
      invoiceRowIds: [100], requestId: expect.any(String),
    })))
    // Expected todayInAthens(), clientCompanyId:null, invoiceCompanyId:null. The original
    // stays immutable; UI FormApi.update re-applies its defaultValues after reset(prefill).
  })

  it('OBSERVED SHI-025 async router failure is not reported after saved replacement', async () => {
    const rejection = Promise.reject(new Error('QA async navigation failed'))
    // Mark handled locally solely to keep test worker alive; host still receives rejection.
    void rejection.catch(() => {})
    router.navigate.mockReturnValue(rejection)
    mount(invoice('CANCELLED')); await replace()
    fireEvent.click(screen.getByRole('button', { name: 'Create draft' }))
    await waitFor(() => expect(router.navigate).toHaveBeenCalledWith({ to: '/secured/shipment-invoices/$shipmentInvoiceId', params: { shipmentInvoiceId: '4' } }))
    await screen.findByRole('button', { name: 'Open saved record' })
    expect(screen.queryByText('Saved successfully, but navigation failed.')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Open saved record' }))
    expect(ShipmentInvoiceService.createReplacement).toHaveBeenCalledTimes(1)
    expect(router.navigate).toHaveBeenCalledTimes(2)
    // Expected: actual rejected router promise reaches failure handling and visible message.
  })
})
