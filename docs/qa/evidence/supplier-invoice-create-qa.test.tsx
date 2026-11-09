/**
 * Read-only QA evidence for main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
 * FRO-347: selection rule 8; documents; draft/result rows pending, unknown, saved.
 * FRO-349: AC4, AC6, AC8, AC9; return failure retains confirmed identity.
 *
 * Actual page, global draft store, Query hooks, result and queue are exercised.
 * Router navigation and SupplierInvoiceService are mocked; no server/storage/auth.
 * Assertions characterize current defects (passing means reproduced, not fixed).
 * Remount models leaving the Create route and opening Create from another Order.
 */
import type { ReactNode } from 'react'
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { resetDraft, supplierInvoiceDraftStore, updateDraft } from '../create/create-draft'
import type { SupplierInvoiceOrder } from '../types'

const navigate = vi.hoisted(() => vi.fn())
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => navigate,
}))
const service = vi.hoisted(() => ({
  searchOrders: vi.fn(), order: vi.fn(), clientVessels: vi.fn(),
  currencies: vi.fn(), create: vi.fn(), upload: vi.fn(), files: vi.fn(),
}))
vi.mock('../services/supplier-invoice-service', async (original) => ({
  ...await original<typeof import('../services/supplier-invoice-service')>(),
  SupplierInvoiceService: service,
}))
import { SupplierInvoiceCreatePage } from './supplier-invoice-create-page'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
function order(id: number): SupplierInvoiceOrder {
  return {
    id, internalNumber: `FL-00${id}`, status: 'PENDING',
    pickupInGreece: false, customsRegime: null,
    clientCompany: { id: 2, name: 'Fictional client' },
    supplierCompany: { id: 3, name: 'Fictional supplier' },
    invoiceCompany: null,
    supplierInvoiceCreation: {
      allowed: true, reason: null,
      allowedInvoiceTypes: ['VAT_EXEMPTION_DOCUMENT', 'GREEK_SUPPLIER_FOREIGN_RECIPIENT'],
    },
  } as SupplierInvoiceOrder
}
const savedInvoice = (id: number, orderId: number) => ({
  id, purchaseOrder: { id: orderId, internalNumber: `FL-00${orderId}` },
})
const clients: ReturnType<typeof renderDetails>['queryClient'][] = []
function mount(origin: string) {
  const rendered = renderDetails(<SupplierInvoiceCreatePage initialOrderId={origin} returnToOrder />)
  clients.push(rendered.queryClient)
  return rendered
}
async function ready(id: string) {
  await waitFor(() => expect(supplierInvoiceDraftStore.state.orderId).toBe(id))
  await waitFor(() => expect((screen.getByLabelText(/^Client\*?$/) as HTMLInputElement).value).toBe('Fictional client'))
}
function fillValid(number: string) {
  act(() => updateDraft(draft => ({
    ...draft, invoiceNumber: number, invoiceDate: '2026-11-01',
    currency: 'EUR', invoiceType: 'VAT_EXEMPTION_DOCUMENT',
    netAmount: '100.00', vatAmount: '24.00',
  })))
}
function chooseFile(file: File) {
  fireEvent.click(screen.getByRole('tab', { name: /Documents/ }))
  fireEvent.change(screen.getByLabelText(/^Choose files\*?$/), { target: { files: [file] } })
}
function create() {
  fireEvent.click(screen.getByRole('button', { name: 'Create supplier invoice' }))
}
function replace() {
  const dialog = screen.getByRole('dialog', { name: 'Replace the open draft?' })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Discard and start' }))
}
beforeEach(() => {
  resetDraft()
  navigate.mockReset().mockResolvedValue(undefined)
  Object.values(service).forEach(fn => fn.mockReset())
  service.order.mockImplementation(async (id: string) => order(Number(id)))
  service.searchOrders.mockResolvedValue({ content: [], page: 0, totalPages: 0, totalElements: 0 })
  service.clientVessels.mockResolvedValue([])
  service.currencies.mockResolvedValue([{ code: 'EUR', name: 'Euro' }])
  service.files.mockResolvedValue([])
  service.upload.mockResolvedValue({ id: 501 })
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('QA: real fetch blocked') }))
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('QA: real XHR blocked') })
})
afterEach(() => {
  cleanup()
  clients.splice(0).forEach(client => client.clear())
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('supplier-invoice-create-qa: controller generation and result retention', () => {
  it('BUG: a different origin can discard an unknown attempt and create anew without resolving it', async () => {
    service.create.mockRejectedValueOnce(new TypeError('Simulated lost response'))
      .mockResolvedValueOnce(savedInvoice(43, 9))
    const first = mount('8')
    await ready('8')
    fillValid('ORIGINAL-8')
    const originalFile = new File(['original bytes'], 'original.pdf')
    chooseFile(originalFile)
    create()
    await screen.findByRole('heading', { name: 'Creation outcome unknown' })
    const originalAttempt = supplierInvoiceDraftStore.state.attempt
    const originalRequestId = supplierInvoiceDraftStore.state.requestId
    expect(originalAttempt).toEqual(service.create.mock.calls[0][0])
    expect(supplierInvoiceDraftStore.state.files[0].file).toBe(originalFile)
    first.unmount()

    mount('9')
    replace()
    await ready('9')
    expect(supplierInvoiceDraftStore.state.phase).toBe('editing')
    expect(supplierInvoiceDraftStore.state.attempt).toBeNull()
    expect(supplierInvoiceDraftStore.state.files).toHaveLength(0)
    expect(supplierInvoiceDraftStore.state.requestId).not.toBe(originalRequestId)
    fillValid('NEW-9')
    create()
    await screen.findByRole('heading', { name: 'Supplier invoice created' })
    expect(service.create).toHaveBeenCalledTimes(2)
    expect(service.create.mock.calls[1][0]).not.toEqual(originalAttempt)
    expect(service.create.mock.calls[1][0].purchaseOrderId).toBe('9')
    expect(service.upload).not.toHaveBeenCalled()
  })

  it('BUG: late creation success for discarded draft 8 uploads replacement draft 9 file to invoice 42', async () => {
    const pending = deferred<ReturnType<typeof savedInvoice>>()
    service.create.mockReturnValueOnce(pending.promise)
    const first = mount('8')
    await ready('8')
    fillValid('ORIGINAL-8')
    const originalFile = new File(['original bytes'], 'original.pdf')
    chooseFile(originalFile)
    create()
    await waitFor(() => expect(supplierInvoiceDraftStore.state.phase).toBe('submitting'))
    expect(service.create).toHaveBeenCalledTimes(1)
    expect(service.upload).not.toHaveBeenCalled()
    first.unmount()

    mount('9')
    replace()
    await ready('9')
    fillValid('REPLACEMENT-9')
    const replacementFile = new File(['replacement bytes'], 'replacement.pdf')
    chooseFile(replacementFile)
    const replacementKey = supplierInvoiceDraftStore.state.files[0].key
    await act(async () => { pending.resolve(savedInvoice(42, 8)); await pending.promise })

    await screen.findByRole('heading', { name: 'Supplier invoice created' })
    await waitFor(() => expect(service.upload).toHaveBeenCalledExactlyOnceWith('42', replacementFile, replacementKey))
    expect(service.create).toHaveBeenCalledTimes(1) // draft 9 was never submitted
    expect(supplierInvoiceDraftStore.state.orderId).toBe('9')
    expect(supplierInvoiceDraftStore.state.invoiceNumber).toBe('REPLACEMENT-9')
    expect(supplierInvoiceDraftStore.state.saved).toMatchObject({ invoiceId: '42', orderId: '8' })
    expect(supplierInvoiceDraftStore.state.files[0]).toMatchObject({ file: replacementFile, outcome: 'uploaded' })
    expect(service.upload.mock.calls.some(call => call[1] === originalFile)).toBe(false)
  })

  it('BUG: an initial selection finishing after Cancel/unmount overwrites the newer origin selection', async () => {
    const pending = deferred<SupplierInvoiceOrder>()
    service.order.mockImplementation(async (id: string) => id === '8' ? pending.promise : order(Number(id)))
    const first = mount('8')
    await waitFor(() => expect(service.order).toHaveBeenCalledWith('8'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(navigate).toHaveBeenCalledWith({
      to: '/secured/purchase-orders/$purchaseOrderId', params: { purchaseOrderId: '8' },
    })
    first.unmount()
    mount('9')
    await ready('9')
    fillValid('INTENDED-FOR-9')
    const request9 = supplierInvoiceDraftStore.state.requestId

    await act(async () => { pending.resolve(order(8)); await pending.promise })
    await waitFor(() => expect(supplierInvoiceDraftStore.state.orderId).toBe('8'))
    expect(supplierInvoiceDraftStore.state.originOrderId).toBe('9')
    expect(supplierInvoiceDraftStore.state.requestId).toBe(request9)
    expect(supplierInvoiceDraftStore.state.invoiceNumber).toBe('INTENDED-FOR-9')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(service.create).not.toHaveBeenCalled()
    expect(service.upload).not.toHaveBeenCalled()
  })

  it('BUG: failed Return to Order erases confirmed invoice identity and exposes a fresh Create form', async () => {
    service.create.mockResolvedValueOnce(savedInvoice(42, 8))
    mount('8')
    await ready('8')
    fillValid('SAVED-8')
    create()
    await screen.findByRole('heading', { name: 'Supplier invoice created' })
    expect(supplierInvoiceDraftStore.state.saved).toMatchObject({ invoiceId: '42', orderId: '8' })
    const navigation = deferred<void>()
    // Observe injected rejection in the harness: production calls void navigate without a catch.
    const observedFailure = navigation.promise.catch(error => error)
    navigate.mockReturnValueOnce(navigation.promise)
    fireEvent.click(screen.getByRole('button', { name: 'Return to Order' }))
    expect(supplierInvoiceDraftStore.state.saved).toBeNull() // erased before navigation settles
    await act(async () => { navigation.reject(new Error('Simulated return navigation failure')); await observedFailure })
    expect(navigate).toHaveBeenCalledWith({
      to: '/secured/purchase-orders/$purchaseOrderId', params: { purchaseOrderId: '8' },
    })
    expect(supplierInvoiceDraftStore.state.phase).toBe('editing')
    expect(supplierInvoiceDraftStore.state.attempt).toBeNull()
    expect(supplierInvoiceDraftStore.state.originOrderId).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Supplier invoice created' })).toBeNull()
    expect((screen.getByRole('button', { name: 'Create supplier invoice' }) as HTMLButtonElement).disabled).toBe(false)
    expect(service.create).toHaveBeenCalledTimes(1)
  })
})
