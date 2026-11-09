import type { ReactNode } from 'react'
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { GraphQLExecutorError } from '#/lib/graphql'
import { UserAuthority } from '#/features/auth/types'
import { SupplierInvoiceService } from './services/supplier-invoice-service'
import { SupplierInvoiceDetailPage } from './components/supplier-invoice-detail-page'
import { supplierInvoiceKeys } from './hooks/use-supplier-invoices'
import type { SupplierInvoiceOrder, SupplierInvoiceWithActivity } from './types'

// Actual saved Details page/layout/hooks, QueryClient, validation, labels and dialogs.
// Router/auth and service I/O are the only substituted boundaries.
const state = vi.hoisted(() => ({
  blocker: null as any,
  authorities: new Set<string>(),
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params }: { children: ReactNode; to: string; params?: Record<string, string> }) => (
    <a href={Object.entries(params ?? {}).reduce((path, [key, value]) => path.replace(`$${key}`, value), to)}>{children}</a>
  ),
  useBlocker: (options: unknown) => { state.blocker = options; return { status: 'idle' } },
}))
vi.mock('#/features/auth/hooks/use-has-authority', () => ({
  useHasAuthority: (authority: string) => state.authorities.has(authority),
}))

function invoice(overrides: Partial<SupplierInvoiceWithActivity> = {}): SupplierInvoiceWithActivity {
  return {
    id: 42, version: 3, invoiceNumber: 'AUDIT-0007', invoiceDate: '2026-11-01', expirationDate: null,
    invoiceType: 'VAT_EXEMPTION_DOCUMENT', currency: 'EUR', netAmount: '100.00', vatAmount: '24.00',
    vatExemptionStatus: 'NOT_STARTED', stampingDispatchDate: null, stampingReturnDate: null, paperworkSentDate: null,
    cancelled: false, cancellable: true, cancelledAt: null,
    createdAt: '2026-11-01T10:00:00Z', updatedAt: '2026-11-01T10:00:00Z',
    purchaseOrder: { id: 8, internalNumber: 'AUDIT-PO-8', status: 'PENDING', pickupInGreece: true, customsRegime: 'FREE_CIRCULATION' },
    supplier: { id: 3, name: 'Demo Supplier' }, client: { id: 2, name: 'Demo Client' }, invoiceCompany: null, vessel: null,
    allowedInvoiceTypes: ['VAT_EXEMPTION_DOCUMENT', 'GREEK_SUPPLIER_FOREIGN_RECIPIENT'], activity: [],
    ...overrides,
  } as SupplierInvoiceWithActivity
}
const order = {
  id: 8, internalNumber: 'AUDIT-PO-8', status: 'PENDING', pickupInGreece: true, customsRegime: 'FREE_CIRCULATION',
  clientCompany: { id: 2, name: 'Demo Client' }, supplierCompany: { id: 3, name: 'Demo Supplier' }, invoiceCompany: null,
  supplierInvoiceCreation: { allowed: true, reason: null, allowedInvoiceTypes: ['VAT_EXEMPTION_DOCUMENT', 'GREEK_SUPPLIER_FOREIGN_RECIPIENT'] },
} as SupplierInvoiceOrder

let saved: SupplierInvoiceWithActivity
let get: ReturnType<typeof vi.spyOn>
let correct: ReturnType<typeof vi.spyOn>
let cancel: ReturnType<typeof vi.spyOn>
let network: ReturnType<typeof vi.fn>
let clients: Array<ReturnType<typeof renderDetails>['queryClient']> = []
const unknown = 'The outcome is unresolved. Check the original attempt before submitting again.'
const button = (name: string) => screen.getByRole('button', { name, exact: true }) as HTMLButtonElement
const input = (name: string) => screen.getByLabelText(name) as HTMLInputElement
const editing = () => fireEvent.click(button('Edit Supplier invoice details'))
const changeNumber = (value: string) => fireEvent.change(input('Invoice number'), { target: { value } })
const card = () => within(screen.getByRole('region', { name: 'Supplier invoice details' }))
function savedNumber() {
  return card().getByText('Invoice number', { selector: 'dt' }).nextElementSibling?.textContent
}
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}
async function open() {
  const { queryClient } = renderDetails(<SupplierInvoiceDetailPage invoiceId="42" />)
  clients.push(queryClient)
  queryClient.setDefaultOptions({ queries: { retry: false, staleTime: 30_000, gcTime: Infinity } })
  await screen.findByText('Supplier invoice · 42')
  return queryClient
}
async function refresh(client: ReturnType<typeof renderDetails>['queryClient']) {
  await act(async () => { await client.invalidateQueries({ queryKey: supplierInvoiceKeys.detail('42') }) })
}
const navigation = {
  current: { pathname: '/secured/supplier-invoices/42' }, next: { pathname: '/secured/purchase-orders/8' },
}

beforeEach(() => {
  localStorage.clear()
  saved = invoice()
  state.authorities = new Set([UserAuthority.SUPPLIER_INVOICE_VIEW, UserAuthority.SUPPLIER_INVOICE_EDIT, UserAuthority.SUPPLIER_INVOICE_CANCEL])
  network = vi.fn(async () => { throw new Error('QA: network forbidden') })
  vi.stubGlobal('fetch', network)
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('QA: XHR forbidden') })
  vi.stubGlobal('WebSocket', class { constructor() { throw new Error('QA: WebSocket forbidden') } })
  get = vi.spyOn(SupplierInvoiceService, 'get').mockImplementation(async () => structuredClone(saved))
  correct = vi.spyOn(SupplierInvoiceService, 'correct').mockRejectedValue(new Error('QA: unspecified correction'))
  cancel = vi.spyOn(SupplierInvoiceService, 'cancel').mockRejectedValue(new Error('QA: unspecified cancellation'))
  vi.spyOn(SupplierInvoiceService, 'files').mockResolvedValue([])
  vi.spyOn(SupplierInvoiceService, 'order').mockResolvedValue(order)
  vi.spyOn(SupplierInvoiceService, 'clientVessels').mockResolvedValue([])
  vi.spyOn(SupplierInvoiceService, 'currencies').mockResolvedValue([{ code: 'EUR', name: 'Euro' }])
  vi.spyOn(SupplierInvoiceService, 'searchOrders').mockResolvedValue({ content: [], page: 0, totalPages: 0, totalElements: 0 })
})
afterEach(() => {
  cleanup()
  clients.forEach((client) => client.clear())
  clients = []
  expect(network).not.toHaveBeenCalled()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('supplier-invoice-details-qa — current-behavior observations, no source fixes', () => {
  it('SI-D1: closing unknown cancellation forgets recovery and unlocks a conflicting correction', async () => {
    cancel.mockRejectedValueOnce(new TypeError('Response lost; cancellation may have committed'))
    await open()
    fireEvent.click(button('Cancel invoice'))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    await screen.findByText(unknown)
    expect(state.blocker.enableBeforeUnload()).toBe(true)
    const getCount = get.mock.calls.length
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel', exact: true }))
    expect(screen.queryByText(unknown)).toBeNull()
    expect(state.blocker.enableBeforeUnload()).toBe(false)
    expect(state.blocker.shouldBlockFn(navigation)).toBe(false)
    expect(button('Edit Supplier invoice details').disabled).toBe(false)
    editing()
    changeNumber('NEW-INTENT-WHILE-CANCEL-UNKNOWN')
    fireEvent.click(button('Save'))
    await waitFor(() => expect(correct).toHaveBeenCalledTimes(1))
    expect(get).toHaveBeenCalledTimes(getCount)
    expect(correct.mock.calls[0][1]).toMatchObject({ expectedVersion: '3', invoiceNumber: 'NEW-INTENT-WHILE-CANCEL-UNKNOWN' })
    // No Check original attempt/read occurred before this new mutation.
  })

  it('SI-D1: pending cancellation has no unload or in-app navigation guard', async () => {
    const pending = deferred<SupplierInvoiceWithActivity>()
    cancel.mockImplementationOnce(() => pending.promise)
    await open()
    fireEvent.click(button('Cancel invoice'))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(cancel).toHaveBeenCalledTimes(1))
    expect(state.blocker.enableBeforeUnload()).toBe(false)
    expect(state.blocker.shouldBlockFn(navigation)).toBe(false)
    saved = invoice({ cancelled: true, cancellable: false, version: 4, cancelledAt: '2026-11-09T10:00:00Z' })
    await act(async () => { pending.resolve(saved) })
    await screen.findByText('Cancelled', { selector: 'span' })
  })

  it('SI-D2: an open cancellation silently adopts a newer version after an unseen financial correction', async () => {
    const client = await open()
    fireEvent.click(button('Cancel invoice'))
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).not.toContain('100.00')
    saved = invoice({ version: 4, netAmount: '900.00', vatAmount: '216.00' })
    await refresh(client)
    await screen.findByText('900.00')
    expect(dialog.textContent).not.toContain('900.00')
    cancel.mockImplementationOnce(async () => {
      saved = { ...saved, version: 5, cancelled: true, cancellable: false, cancelledAt: '2026-11-09T10:00:00Z' }
      return saved
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(cancel).toHaveBeenCalledWith('42', '4'))
    // Expected: preserve version 3 or require explicit review before replacing it.
    await screen.findByText('Cancelled', { selector: 'span' })
  })

  it('SI-D3: typing during a pending card save is accepted then silently discarded on success', async () => {
    const pending = deferred<SupplierInvoiceWithActivity>()
    correct.mockImplementationOnce(() => pending.promise)
    await open()
    editing()
    changeNumber('SENT')
    fireEvent.click(button('Save'))
    await waitFor(() => expect(correct).toHaveBeenCalledTimes(1))
    expect(button('Save').disabled).toBe(true)
    expect(input('Invoice number').disabled).toBe(false)
    expect(input('Invoice number').readOnly).toBe(false)
    changeNumber('LATER-UNSAVED-TYPING')
    expect(input('Invoice number').value).toBe('LATER-UNSAVED-TYPING')
    saved = invoice({ version: 4, invoiceNumber: 'SENT' })
    await act(async () => { pending.resolve(saved) })
    await waitFor(() => expect(screen.queryByLabelText('Invoice number')).toBeNull())
    expect(savedNumber()).toBe('SENT')
    editing()
    expect(input('Invoice number').value).toBe('SENT')
    expect(correct.mock.calls[0][1].invoiceNumber).toBe('SENT')
  })

  it('SI-D3: unknown correction accepts draft edits, then checking the original success erases them', async () => {
    correct.mockRejectedValueOnce(new TypeError('Response lost after commit'))
    await open()
    editing()
    changeNumber('SENT')
    fireEvent.click(button('Save'))
    await screen.findByText(unknown)
    changeNumber('UNSENT-AFTER-UNKNOWN')
    expect(input('Invoice number').value).toBe('UNSENT-AFTER-UNKNOWN')
    saved = invoice({ version: 4, invoiceNumber: 'SENT' })
    fireEvent.click(button('Check original attempt'))
    await waitFor(() => expect(screen.queryByLabelText('Invoice number')).toBeNull())
    expect(savedNumber()).toBe('SENT')
    expect(correct).toHaveBeenCalledTimes(1)
  })

  it('control: ordinary correction keeps its reviewed version during refresh and locks sibling card/cancellation', async () => {
    const client = await open()
    editing()
    changeNumber('MY-DRAFT')
    saved = invoice({ version: 4, invoiceNumber: 'COLLEAGUE', client: { id: 2, name: 'Demo Client refreshed' } })
    await refresh(client)
    await screen.findByText('Demo Client refreshed')
    expect(input('Invoice number').value).toBe('MY-DRAFT')
    expect(button('Edit Order relationship').disabled).toBe(true)
    expect(button('Cancel invoice').disabled).toBe(true)
    correct.mockRejectedValueOnce(new GraphQLExecutorError('Stale', {
      cause: null, messages: ['Stale'], classifications: ['CONFLICT'], status: 200,
    }))
    fireEvent.click(button('Save'))
    await waitFor(() => expect(correct).toHaveBeenCalledTimes(1))
    expect(correct.mock.calls[0][1]).toMatchObject({ invoiceNumber: 'MY-DRAFT', expectedVersion: '3' })
    await screen.findByRole('button', { name: 'Keep my changes' })
    expect(button('Save').disabled).toBe(true)
    expect(input('Invoice number').value).toBe('MY-DRAFT')
  })

  it('control: saved cancellability change disables an already open confirmation', async () => {
    const client = await open()
    fireEvent.click(button('Cancel invoice'))
    saved = invoice({ version: 4, cancellable: false })
    await refresh(client)
    const confirm = within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }) as HTMLButtonElement
    await waitFor(() => expect(confirm.disabled).toBe(true))
    fireEvent.click(confirm)
    expect(cancel).not.toHaveBeenCalled()
  })

  it('control: an unrelated writer changing the version does not establish original correction success', async () => {
    correct.mockRejectedValueOnce(new TypeError('Unknown response'))
    await open()
    editing()
    changeNumber('MY-UNKNOWN-ATTEMPT')
    fireEvent.click(button('Save'))
    await screen.findByText(unknown)
    saved = invoice({ version: 4, invoiceNumber: 'UNRELATED-WRITER', netAmount: '900.00' })
    fireEvent.click(button('Check original attempt'))
    await screen.findByRole('button', { name: 'Keep my changes' })
    expect(input('Invoice number').value).toBe('MY-UNKNOWN-ATTEMPT')
    expect(button('Save').disabled).toBe(true)
    expect(screen.getByText('Invoice number: UNRELATED-WRITER')).toBeTruthy()
    expect(correct).toHaveBeenCalledTimes(1)
    expect(state.blocker.enableBeforeUnload()).toBe(true)
  })

  it('control: tabs preserve a card draft and unresolved correction cannot use card Cancel', async () => {
    correct.mockRejectedValueOnce(new TypeError('Unknown response'))
    await open()
    editing()
    changeNumber('RETAINED')
    fireEvent.click(screen.getByRole('tab', { name: /Documents/ }))
    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }))
    expect(input('Invoice number').value).toBe('RETAINED')
    fireEvent.click(button('Save'))
    await screen.findByText(unknown)
    expect(button('Cancel').disabled).toBe(true)
    expect(button('Save').disabled).toBe(true)
    expect(state.blocker.enableBeforeUnload()).toBe(true)
  })
})
