/**
 * Read-only Export PRINT YD QA against main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
 * Real page, dialogs, controls, hooks, mapping and providers. Only ExportService I/O
 * and browser PDF window/blob plumbing are synthetic. No callback prop invocation.
 * Observation assertions describe pinned behavior, including defects; not fixes.
 * Run only this file; see ../../../../vat-print-qa.md for handoff and limits.
 */
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { exportKeys } from '../hooks/use-exports'
import { ExportDetailPage } from './components/export-detail-page'
import type { ExportRecord } from '../services/export-service'

const service = vi.hoisted(() => ({
  get: vi.fn(), files: vi.fn(), vessels: vi.fn(), invoiceOptions: vi.fn(),
  updateDetails: vi.fn(), updateInvoices: vi.fn(), confirmEad: vi.fn(), confirmIe599: vi.fn(), cancel: vi.fn(),
  recordStamping: vi.fn(), ydDocuments: vi.fn(), ydPdf: vi.fn(), upload: vi.fn(), removeFile: vi.fn(), download: vi.fn(),
}))
vi.mock('../services/export-service', async (original) => ({
  ...await original<typeof import('../services/export-service')>(), ExportService: service,
}))

const flags = {
  canEditDetails: false, canAddInvoices: false, canRemoveInvoices: false, canConfirmEad: false,
  canConfirmIe599: false, canCancel: false, canRecordStamping: false, canUploadFiles: false,
  canRemoveFiles: false, canPrintYd: true,
}
const company = { id: 4, name: 'QA Synthetic Company', vatNumber: '099000101' }
const supplier = { id: 3, name: 'QA Synthetic Supplier' }
const templates = [
  ['ATHENS_AIRPORT', 'Αερολιμένας Ελ. Βενιζέλος'],
  ['PIRAEUS_A', 'Α΄ Τελωνείο Πειραιά'],
  ['PIRAEUS_C', 'Γ΄ Τελωνείο Πειραιά'],
] as const
const generateFailed = 'The ΥΔ documents could not be generated. Nothing changed.'
const openFailed = 'The ΥΔ PDF could not be opened. Try again.'
const writes = ['updateDetails', 'updateInvoices', 'confirmEad', 'confirmIe599', 'cancel', 'recordStamping', 'upload', 'removeFile'] as const
function invoice(id: number, overrides: Record<string, unknown> = {}) {
  return {
    id, invoiceNumber: `QA-SI-${id}`, invoiceDate: '2026-11-01', invoiceType: 'VAT_EXEMPTION_DOCUMENT',
    vatExemptionStatus: 'NOT_STARTED', stampingDispatchDate: null, stampingReturnDate: null, paperworkSentDate: null,
    cancelled: false, purchaseOrder: { id: 70 + id, internalNumber: `QA-PO-${70 + id}` },
    supplier, invoicingCompany: company, paperworkOnly: false, addedAt: '2026-11-01T10:00:00Z', ...overrides,
  }
}
function record(overrides: Record<string, unknown> = {}): ExportRecord {
  return {
    id: 41, exportType: 'GREEK_INVOICING_COMPANY', customsStatus: 'AWAITING_EAD',
    shipment: { id: 5, shipmentNumber: 'QA-SH-5', status: 'PREPARING', transportDocumentType: 'AIR_WAYBILL', transportDocumentNumber: 'QA-AWB' },
    invoicingCompany: company, supplier: null, shipper: company, mrn: '26GR0000000000000A', mrnDate: '2026-11-01',
    deliveredVessel: null, eadConfirmation: null, ie599Confirmation: null,
    protocol: { number: 1001, date: '2026-11-01' }, vatExemptionProcedureRequired: true,
    cancelled: false, cancellation: null, invoices: [invoice(1), invoice(2)],
    connectedOrders: [1, 2].map((id) => ({
      id: 70 + id, internalNumber: `QA-PO-${70 + id}`, supplier, invoicingCompany: company, vessel: null, invoiceCount: 1,
    })),
    capabilities: flags, version: 3, createdBy: { id: 1, name: 'QA Operator' },
    createdAt: '2026-11-01T09:00:00Z', updatedAt: '2026-11-01T09:00:00Z', ...overrides,
  } as unknown as ExportRecord
}
function groups(...ids: number[]) {
  return [{ invoicingCompany: company, supplier, invoiceIds: ids, invoiceNumbers: ids.map((id) => `QA-SI-${id}`) }]
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((ok, fail) => { resolve = ok; reject = fail })
  return { promise, resolve, reject }
}
let saved: ExportRecord
let clients: Array<ReturnType<typeof renderDetails>['queryClient']> = []
let network: ReturnType<typeof vi.fn>
let xhr: ReturnType<typeof vi.spyOn>
let socket: ReturnType<typeof vi.fn>
let popups: Array<{ location: { href: string }; close: ReturnType<typeof vi.fn> }>
let blobUrl: ReturnType<typeof vi.fn>
const originalCreate = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
const originalRevoke = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')
const dialog = () => screen.getByRole('dialog')
const inDialog = () => within(dialog())
const button = (name: string) => inDialog().getByRole('button', { name, exact: true }) as HTMLButtonElement
const checkbox = (id: number) => inDialog().getByRole('checkbox', { name: `Select QA-SI-${id}`, exact: true }) as HTMLInputElement
const radio = (index: number) => inDialog().getByRole('radio', { name: templates[index][1], exact: true }) as HTMLInputElement
const click = (name: string) => fireEvent.click(button(name))
const tab = (name: RegExp | string) => fireEvent.click(screen.getByRole('tab', { name }))
function select(ids = [1], template = 0) {
  for (const id of ids) fireEvent.click(checkbox(id))
  fireEvent.click(radio(template))
}
function closeResults() {
  // Both real header X and footer are named Close. Use the footer button.
  fireEvent.click(inDialog().getAllByRole('button', { name: 'Close', exact: true }).at(-1)!)
  expect(screen.queryByRole('dialog')).toBeNull()
}
function reopen() {
  fireEvent.click(screen.getByRole('button', { name: 'Print ΥΔ', exact: true }))
  expect(dialog()).toBeTruthy()
}
async function mount() {
  const result = renderDetails(<ExportDetailPage exportId="41" />)
  clients.push(result.queryClient)
  await screen.findByRole('tab', { name: 'Overview' })
  tab(/VAT Exemption Protocol/)
  return result
}
async function open() {
  const result = await mount()
  reopen()
  return result
}
async function ready(ids = [1], template = 0) {
  await open()
  select(ids, template)
  service.ydDocuments.mockResolvedValueOnce(groups(...ids))
  click('Generate ΥΔ')
  await inDialog().findByText('1 documents ready')
}
async function finish(pending: ReturnType<typeof deferred<ReturnType<typeof groups>>>, ids: number[]) {
  await act(async () => { pending.resolve(groups(...ids)) })
  await inDialog().findByText('1 documents ready')
}
async function reject(pending: ReturnType<typeof deferred<unknown>>) {
  await act(async () => { pending.reject(new TypeError('QA synthetic response failure')) })
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-09T12:00:00Z'))
  saved = record()
  popups = []
  Object.values(service).forEach((fn) => fn.mockReset())
  service.get.mockImplementation(async () => structuredClone(saved))
  service.files.mockResolvedValue([])
  service.vessels.mockResolvedValue([])
  service.invoiceOptions.mockResolvedValue({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 })
  writes.forEach((name) => service[name].mockRejectedValue(new Error('QA forbidden write')))
  service.ydDocuments.mockRejectedValue(new Error('QA unspecified grouping read'))
  service.ydPdf.mockResolvedValue(new Blob(['%PDF QA SYNTHETIC ONLY'], { type: 'application/pdf' }))
  network = vi.fn(async () => { throw new Error('QA fetch blocked') })
  vi.stubGlobal('fetch', network)
  xhr = vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('QA XHR blocked') })
  socket = vi.fn(function () { throw new Error('QA WebSocket blocked') })
  vi.stubGlobal('WebSocket', socket)
  vi.spyOn(window, 'open').mockImplementation(() => {
    const popup = { location: { href: '' }, close: vi.fn() }
    popups.push(popup)
    return popup as unknown as Window
  })
  blobUrl = vi.fn(() => `blob:qa-${popups.length}`)
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, writable: true, value: blobUrl })
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, writable: true, value: vi.fn() })
  // Avoid leaving the production 60s blob cleanup timer behind each isolated run.
  const nativeTimeout = window.setTimeout.bind(window)
  vi.spyOn(window, 'setTimeout').mockImplementation(((callback: TimerHandler, ms?: number, ...args: unknown[]) =>
    ms === 60_000 ? 0 : nativeTimeout(callback, ms, ...args)) as typeof window.setTimeout)
})
afterEach(() => {
  cleanup()
  clients.forEach((client) => client.clear())
  clients = []
  writes.forEach((name) => expect(service[name], `No ${name} from printing`).not.toHaveBeenCalled())
  expect(network).not.toHaveBeenCalled()
  expect(xhr).not.toHaveBeenCalled()
  expect(socket).not.toHaveBeenCalled()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  for (const [key, descriptor] of [['createObjectURL', originalCreate], ['revokeObjectURL', originalRevoke]] as const) {
    if (descriptor) Object.defineProperty(URL, key, descriptor)
    else Reflect.deleteProperty(URL, key)
  }
  vi.useRealTimers()
  localStorage.clear()
})

describe('VAT print QA — actual rendered controls, synthetic I/O, current-behavior observations', () => {
  it.each(templates)('C1 normal %s: request, displayed invoice list and PDF inputs agree without writes', async (key) => {
    const baseline = structuredClone(saved)
    await ready([1, 2], templates.findIndex(([value]) => value === key))
    expect(inDialog().getByText('2 invoice(s): QA-SI-1, QA-SI-2')).toBeTruthy()
    click('Open PDF')
    await waitFor(() => expect(popups[0].location.href).toBe('blob:qa-1'))
    expect(service.ydDocuments).toHaveBeenCalledExactlyOnceWith('41', key, ['1', '2'])
    expect(service.ydPdf).toHaveBeenCalledExactlyOnceWith('41', key, ['1', '2'])
    expect(saved).toEqual(baseline)
    expect(clients[0].getQueryData(exportKeys.detail('41'))).toEqual(baseline)
  })

  it('P1 delayed success replaces an accepted new invoice selection; PDF combines old invoice and new template', async () => {
    const pending = deferred<ReturnType<typeof groups>>()
    service.ydDocuments.mockReturnValueOnce(pending.promise)
    await open()
    select([1], 0)
    click('Generate ΥΔ')
    expect(service.ydDocuments).toHaveBeenCalledExactlyOnceWith('41', 'ATHENS_AIRPORT', ['1'])
    expect(checkbox(1).disabled).toBe(false)
    expect(radio(2).disabled).toBe(false)
    fireEvent.click(checkbox(1))
    fireEvent.click(checkbox(2))
    fireEvent.click(radio(2))
    expect(checkbox(1).checked).toBe(false)
    expect(checkbox(2).checked).toBe(true)
    expect(radio(2).checked).toBe(true)
    await finish(pending, [1])
    expect(inDialog().getByText('1 invoice(s): QA-SI-1')).toBeTruthy()
    expect(inDialog().queryByText(/QA-SI-2/)).toBeNull()
    expect(inDialog().queryByRole('checkbox')).toBeNull()
    expect(inDialog().queryByRole('radio')).toBeNull()
    expect(inDialog().queryByText(templates[2][1])).toBeNull() // Result omits template identity.
    click('Open PDF')
    await waitFor(() => expect(service.ydPdf).toHaveBeenCalledExactlyOnceWith('41', 'PIRAEUS_C', ['1']))
    closeResults()
    reopen()
    expect(checkbox(2).checked).toBe(false) // No route back to accepted replacement input.
    expect(radio(2).checked).toBe(false)
  })

  it('P1 selection-only change to none is accepted during pending; old selection becomes the result', async () => {
    const pending = deferred<ReturnType<typeof groups>>()
    service.ydDocuments.mockReturnValueOnce(pending.promise)
    await open()
    select([1])
    click('Generate ΥΔ')
    expect(button('Select all eligible').disabled).toBe(false)
    click('Select all eligible')
    expect(checkbox(2).checked).toBe(true)
    expect(button('Clear selection').disabled).toBe(false)
    click('Clear selection')
    expect(inDialog().getByText('0 selected')).toBeTruthy()
    await finish(pending, [1])
    expect(inDialog().getByText('1 invoice(s): QA-SI-1')).toBeTruthy()
    click('Open PDF')
    await waitFor(() => expect(service.ydPdf).toHaveBeenCalledExactlyOnceWith('41', 'ATHENS_AIRPORT', ['1']))
  })

  it('C2 template-only pending change keeps invoice coherence; not a standalone defect finding', async () => {
    const pending = deferred<ReturnType<typeof groups>>()
    service.ydDocuments.mockReturnValueOnce(pending.promise)
    await open()
    select([1], 0)
    click('Generate ΥΔ')
    fireEvent.click(radio(1))
    await finish(pending, [1])
    expect(inDialog().getByText('1 invoice(s): QA-SI-1')).toBeTruthy()
    click('Open PDF')
    await waitFor(() => expect(service.ydPdf).toHaveBeenCalledExactlyOnceWith('41', 'PIRAEUS_A', ['1']))
    expect(service.ydDocuments).toHaveBeenCalledExactlyOnceWith('41', 'ATHENS_AIRPORT', ['1'])
  })

  it('C3 delayed generation failure retains current selection/template and retry uses exactly those inputs', async () => {
    const pending = deferred<ReturnType<typeof groups>>()
    service.ydDocuments.mockReturnValueOnce(pending.promise)
    await open()
    select([1], 0)
    click('Generate ΥΔ')
    fireEvent.click(checkbox(1))
    fireEvent.click(checkbox(2))
    fireEvent.click(radio(2))
    await reject(pending)
    expect(inDialog().getByText(generateFailed)).toBeTruthy()
    expect(checkbox(2).checked).toBe(true)
    expect(checkbox(1).checked).toBe(false)
    expect(radio(2).checked).toBe(true)
    service.ydDocuments.mockResolvedValueOnce(groups(2))
    click('Generate ΥΔ')
    await inDialog().findByText('1 invoice(s): QA-SI-2')
    click('Open PDF')
    await waitFor(() => expect(service.ydPdf).toHaveBeenCalledExactlyOnceWith('41', 'PIRAEUS_C', ['2']))
    expect(service.ydDocuments.mock.calls).toEqual([
      ['41', 'ATHENS_AIRPORT', ['1']], ['41', 'PIRAEUS_C', ['2']],
    ])
  })

  it('C4 missing input and normal pending state block requests, duplicate generation, close, Escape and backdrop', async () => {
    const pending = deferred<ReturnType<typeof groups>>()
    service.ydDocuments.mockReturnValueOnce(pending.promise)
    await open()
    click('Generate ΥΔ')
    expect(inDialog().getByText('Select at least one invoice.')).toBeTruthy()
    expect(inDialog().getByText('Select a template.')).toBeTruthy()
    expect(service.ydDocuments).not.toHaveBeenCalled()
    fireEvent.click(checkbox(1))
    click('Generate ΥΔ')
    expect(service.ydDocuments).not.toHaveBeenCalled()
    fireEvent.click(radio(0))
    click('Generate ΥΔ')
    expect(button('Generate ΥΔ').disabled).toBe(true)
    expect(button('Cancel').disabled).toBe(true)
    expect(inDialog().queryByRole('button', { name: 'Close' })).toBeNull()
    click('Generate ΥΔ')
    click('Cancel')
    fireEvent.keyDown(dialog(), { key: 'Escape' })
    const scrim = dialog().previousElementSibling as HTMLElement
    expect(scrim.getAttribute('aria-hidden')).toBe('true')
    fireEvent.click(scrim)
    expect(dialog()).toBeTruthy()
    expect(service.ydDocuments).toHaveBeenCalledTimes(1)
    await finish(pending, [1])
  })

  it('C5 current PDF failure closes its popup, keeps result, and a successful retry clears its error', async () => {
    const pdf = deferred<Blob>()
    service.ydPdf.mockReturnValueOnce(pdf.promise)
    await ready([2], 1)
    click('Open PDF')
    expect(window.open).toHaveBeenCalledWith('', '_blank')
    expect(popups[0].location.href).toBe('')
    await reject(pdf)
    expect(popups[0].close).toHaveBeenCalledTimes(1)
    expect(inDialog().getByText(openFailed)).toBeTruthy()
    expect(inDialog().getByText('1 invoice(s): QA-SI-2')).toBeTruthy()
    click('Open PDF')
    await waitFor(() => expect(popups[1].location.href).toBe('blob:qa-2'))
    expect(inDialog().queryByText(openFailed)).toBeNull()
    expect(service.ydPdf.mock.calls).toEqual([
      ['41', 'PIRAEUS_A', ['2']], ['41', 'PIRAEUS_A', ['2']],
    ])
  })

  it('P2 an old PDF failure becomes a false generation failure in a fresh untouched dialog', async () => {
    const pdf = deferred<Blob>()
    service.ydPdf.mockReturnValueOnce(pdf.promise)
    await ready([1])
    click('Open PDF')
    closeResults() // Real result dialog permits dismissal while PDF is pending.
    reopen()
    select([2], 2)
    expect(inDialog().queryByText(generateFailed)).toBeNull()
    await reject(pdf)
    expect(inDialog().getByText(generateFailed)).toBeTruthy()
    expect(inDialog().queryByText(openFailed)).toBeNull()
    expect(service.ydDocuments).toHaveBeenCalledTimes(1) // No attempt in new dialog.
    expect(checkbox(2).checked).toBe(true)
    expect(radio(2).checked).toBe(true)
  })

  it('P2 old PDF failure unlocks pending generation; closing/reopening allows the old result to replace a newer result', async () => {
    const pdf = deferred<Blob>()
    const olderGeneration = deferred<ReturnType<typeof groups>>()
    const newerGeneration = deferred<ReturnType<typeof groups>>()
    service.ydPdf.mockReturnValueOnce(pdf.promise)
    await ready([1], 0)
    click('Open PDF')
    closeResults()
    reopen()
    select([2], 2)
    service.ydDocuments.mockReturnValueOnce(olderGeneration.promise)
    click('Generate ΥΔ')
    expect(button('Generate ΥΔ').disabled).toBe(true)
    expect(button('Cancel').disabled).toBe(true)
    await reject(pdf)
    expect(inDialog().getByText(generateFailed)).toBeTruthy()
    expect(button('Generate ΥΔ').disabled).toBe(false)
    expect(button('Cancel').disabled).toBe(false)
    click('Cancel')
    expect(screen.queryByRole('dialog')).toBeNull()
    reopen()
    select([1], 1)
    service.ydDocuments.mockReturnValueOnce(newerGeneration.promise)
    click('Generate ΥΔ')
    await finish(newerGeneration, [1])
    expect(inDialog().getByText('1 invoice(s): QA-SI-1')).toBeTruthy()
    await finish(olderGeneration, [2])
    expect(inDialog().getByText('1 invoice(s): QA-SI-2')).toBeTruthy()
    expect(inDialog().queryByText(/QA-SI-1/)).toBeNull()
    click('Open PDF')
    await waitFor(() => expect(service.ydPdf).toHaveBeenLastCalledWith('41', 'PIRAEUS_A', ['2']))
    expect(service.ydDocuments.mock.calls).toEqual([
      ['41', 'ATHENS_AIRPORT', ['1']], ['41', 'PIRAEUS_C', ['2']], ['41', 'PIRAEUS_A', ['1']],
    ])
  })

  it('P2 old PDF failure permits a second Generate click while the first grouping read is still pending', async () => {
    const pdf = deferred<Blob>()
    const first = deferred<ReturnType<typeof groups>>()
    const duplicate = deferred<ReturnType<typeof groups>>()
    service.ydPdf.mockReturnValueOnce(pdf.promise)
    await ready([1])
    click('Open PDF')
    closeResults()
    reopen()
    select([2], 2)
    service.ydDocuments.mockReturnValueOnce(first.promise).mockReturnValueOnce(duplicate.promise)
    click('Generate ΥΔ')
    await reject(pdf)
    click('Generate ΥΔ')
    expect(service.ydDocuments).toHaveBeenCalledTimes(3)
    expect(service.ydDocuments.mock.calls.slice(1)).toEqual([
      ['41', 'PIRAEUS_C', ['2']], ['41', 'PIRAEUS_C', ['2']],
    ])
    await finish(first, [2])
    await finish(duplicate, [2])
    // Read duplication only. No mutation/persisted duplication claim.
  })

  it('C6 late PDF success stays with its original popup/payload and does not replace the new form', async () => {
    const pdf = deferred<Blob>()
    service.ydPdf.mockReturnValueOnce(pdf.promise)
    await ready([1], 0)
    click('Open PDF')
    closeResults()
    reopen()
    select([2], 2)
    await act(async () => { pdf.resolve(new Blob(['%PDF QA OLD'])) })
    expect(popups[0].location.href).toBe('blob:qa-1')
    expect(service.ydPdf).toHaveBeenCalledExactlyOnceWith('41', 'ATHENS_AIRPORT', ['1'])
    expect(checkbox(2).checked).toBe(true)
    expect(radio(2).checked).toBe(true)
    expect(inDialog().queryByText(generateFailed)).toBeNull()
  })

  it('C7 saved membership supplies print even with an unsaved removal draft; print makes no membership write', async () => {
    saved = record({ capabilities: { ...flags, canAddInvoices: true, canRemoveInvoices: true } })
    const baseline = structuredClone(saved)
    await mount()
    tab(/Supplier Invoices & Orders/)
    fireEvent.click(screen.getByRole('button', { name: 'Edit', exact: true }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove QA-SI-1', exact: true }))
    expect(screen.queryByText('QA-SI-1')).toBeNull()
    tab(/VAT Exemption Protocol/)
    reopen()
    expect(checkbox(1).checked).toBe(false)
    select([1], 2)
    service.ydDocuments.mockResolvedValueOnce(groups(1))
    click('Generate ΥΔ')
    await inDialog().findByText('1 invoice(s): QA-SI-1')
    closeResults()
    tab(/Supplier Invoices & Orders/)
    expect(screen.queryByText('QA-SI-1')).toBeNull() // Unsaved removal still present.
    expect(screen.getByRole('button', { name: 'Save', exact: true })).toBeTruthy()
    expect(saved).toEqual(baseline)
    expect(clients[0].getQueryData(exportKeys.detail('41'))).toEqual(baseline)
  })

  it('C8 printing and stamping selections are independent, and non-YD saved invoice is absent from print', async () => {
    saved = record({
      customsStatus: 'COMPLETED', capabilities: { ...flags, canRecordStamping: true },
      invoices: [invoice(1), invoice(2), invoice(3, { invoiceType: 'STORAGE_ENTRY', vatExemptionStatus: 'NOT_REQUIRED' })],
    })
    await mount()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select QA-SI-2', exact: true }))
    reopen()
    expect(checkbox(2).checked).toBe(false)
    expect(inDialog().queryByText('QA-SI-3')).toBeNull()
    select([1])
    service.ydDocuments.mockResolvedValueOnce(groups(1))
    click('Generate ΥΔ')
    await inDialog().findByText('1 invoice(s): QA-SI-1')
    closeResults()
    expect((screen.getByRole('checkbox', { name: 'Select QA-SI-2', exact: true }) as HTMLInputElement).checked).toBe(true)
    expect((screen.getByRole('checkbox', { name: 'Select QA-SI-1', exact: true }) as HTMLInputElement).checked).toBe(false)
    expect(service.recordStamping).not.toHaveBeenCalled()
  })

  it.each(['AWAITING_EAD', 'AWAITING_IE599', 'COMPLETED'])('C9 print remains available at %s with capability, without a Customs/stamping write', async (stage) => {
    saved = record({ customsStatus: stage })
    await ready([1])
    expect(inDialog().getByText('1 invoice(s): QA-SI-1')).toBeTruthy()
    expect(saved.customsStatus).toBe(stage)
    expect(saved.protocol?.number).toBe(1001)
  })

  it('P3 saved-membership refresh removes the selected row but retains its invisible selected ID in Generate', async () => {
    const mounted = await open()
    select([1], 0)
    saved = record({ version: 4, invoices: [invoice(2)] })
    await act(async () => {
      await mounted.queryClient.invalidateQueries({ queryKey: exportKeys.detail('41') })
    })
    await waitFor(() => expect(inDialog().queryByRole('checkbox', { name: 'Select QA-SI-1', exact: true })).toBeNull())
    expect(checkbox(2).checked).toBe(false)
    expect(inDialog().getByText('1 selected')).toBeTruthy()
    click('Generate ΥΔ')
    await inDialog().findByText(generateFailed)
    expect(service.ydDocuments).toHaveBeenCalledExactlyOnceWith('41', 'ATHENS_AIRPORT', ['1'])
    // Mock refusal documents the UI recovery; server rejection/authorization is not executed.
    expect(inDialog().getByText('1 selected')).toBeTruthy()
    click('Clear selection')
    fireEvent.click(checkbox(2))
    service.ydDocuments.mockResolvedValueOnce(groups(2))
    click('Generate ΥΔ')
    await inDialog().findByText('1 invoice(s): QA-SI-2')
    expect(service.ydDocuments).toHaveBeenLastCalledWith('41', 'ATHENS_AIRPORT', ['2'])
  })

  it('C11 blocked popup plus PDF rejection gives the correct open error without attempting navigation', async () => {
    vi.mocked(window.open).mockReturnValueOnce(null)
    service.ydPdf.mockRejectedValueOnce(new Error('QA PDF rejected'))
    await ready([1], 2)
    click('Open PDF')
    await inDialog().findByText(openFailed)
    expect(blobUrl).not.toHaveBeenCalled()
    expect(service.ydPdf).toHaveBeenCalledExactlyOnceWith('41', 'PIRAEUS_C', ['1'])
    expect(inDialog().getByText('1 invoice(s): QA-SI-1')).toBeTruthy()
    // Blocked-popup successful current-tab navigation is outside jsdom coverage.
  })

  it.each(['view-only', 'cancelled', 'retained-protocol-no-YD'])('C10 %s capability response has no Print entry point', async (kind) => {
    saved = record({
      capabilities: { ...flags, canPrintYd: false }, cancelled: kind === 'cancelled',
      ...(kind === 'retained-protocol-no-YD' ? { invoices: [], vatExemptionProcedureRequired: false } : {}),
    })
    await mount()
    expect(screen.queryByRole('button', { name: 'Print ΥΔ', exact: true })).toBeNull()
    expect(service.ydDocuments).not.toHaveBeenCalled()
    expect(service.ydPdf).not.toHaveBeenCalled()
    // This verifies presentation of supplied flags, not server authorization.
  })
})
