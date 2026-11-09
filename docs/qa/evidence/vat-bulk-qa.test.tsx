/**
 * Read-only VAT bulk QA. Main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
 * Actual page/dialog/cards/DatePicker/Modal/QueryClient, synthetic service I/O only.
 * Tests assert CURRENT observations, including defects; passing is not acceptance.
 * No handler extraction, direct onConfirm calls, or clicks behind an open modal.
 * See adjacent vat-bulk-qa.md for evidence, provenance and limits.
 */
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Link, Outlet, RouterProvider } from '@tanstack/react-router'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { exportKeys } from '../hooks/use-exports'
import { ExportRequestRejected, exportFailure } from '../export-errors'
import { ExportDetailPage } from './components/export-detail-page'
import type { ExportRecord, ExportStampingResult } from '../services/export-service'
import type { StampingStage } from './types'

const service = vi.hoisted(() => ({
  get: vi.fn(), files: vi.fn(), vessels: vi.fn(), invoiceOptions: vi.fn(),
  updateDetails: vi.fn(), updateInvoices: vi.fn(), confirmEad: vi.fn(), confirmIe599: vi.fn(), cancel: vi.fn(),
  recordStamping: vi.fn(), ydDocuments: vi.fn(), ydPdf: vi.fn(), upload: vi.fn(), removeFile: vi.fn(), download: vi.fn(),
}))
vi.mock('../services/export-service', async (original) => ({
  ...await original<typeof import('../services/export-service')>(), ExportService: service,
}))

const stages = ['dispatch', 'return', 'send'] as const
const action = {
  dispatch: 'Record dispatch for stamping', return: 'Record stamped papers returned', send: 'Record paperwork sent to recipient',
}
const heading = { dispatch: 'Ready for stamping', return: 'Awaiting stamped return', send: 'Exempted invoices' }
const eventName = { dispatch: 'DISPATCH', return: 'RETURN', send: 'PAPERWORK_SENT' }
const failedCopy = 'The dates could not be recorded. Nothing changed. Your selection and date are kept.'
const company = { id: 4, name: 'QA Synthetic Company', vatNumber: '099000101' }
const flags = {
  canEditDetails: false, canAddInvoices: false, canRemoveInvoices: false, canConfirmEad: false,
  canConfirmIe599: false, canCancel: false, canRecordStamping: true, canUploadFiles: false,
  canRemoveFiles: false, canPrintYd: false,
}
function invoice(id: number, stage: StampingStage = 'dispatch', overrides: Record<string, unknown> = {}) {
  return {
    id, invoiceNumber: `QA-SI-${id}`, invoiceDate: '2026-11-01', invoiceType: 'VAT_EXEMPTION_DOCUMENT',
    vatExemptionStatus: stage === 'dispatch' ? 'NOT_STARTED' : stage === 'return' ? 'IN_PROGRESS' : 'EXEMPTED',
    stampingDispatchDate: stage === 'dispatch' ? null : '2026-11-05',
    stampingReturnDate: stage === 'send' ? '2026-11-06' : null, paperworkSentDate: null,
    cancelled: false, purchaseOrder: { id: 70 + id, internalNumber: `QA-PO-${70 + id}` },
    supplier: { id: 3, name: 'QA Synthetic Supplier' }, invoicingCompany: company,
    paperworkOnly: false, addedAt: '2026-11-01T10:00:00Z', ...overrides,
  }
}
const auditEvent = (date: string) => ({ date, actor: { id: 1, name: 'QA Operator' }, recordedAt: `${date}T10:00:00Z` })
function record(stage: StampingStage = 'dispatch', overrides: Record<string, unknown> = {}): ExportRecord {
  return {
    id: 41, exportType: 'GREEK_INVOICING_COMPANY', customsStatus: 'COMPLETED',
    shipment: { id: 5, shipmentNumber: 'QA-SH-5', status: 'PREPARING', transportDocumentType: 'AIR_WAYBILL', transportDocumentNumber: 'QA-AWB' },
    invoicingCompany: company, supplier: null, shipper: company, mrn: '26GR0000000000000A', mrnDate: '2026-11-01',
    deliveredVessel: null, eadConfirmation: auditEvent('2026-11-03'), ie599Confirmation: auditEvent('2026-11-07'),
    protocol: { number: 1001, date: '2026-11-01' }, vatExemptionProcedureRequired: true,
    cancelled: false, cancellation: null, invoices: [invoice(1, stage), invoice(2, stage), invoice(3, stage)],
    connectedOrders: [], capabilities: flags, version: 3, createdBy: { id: 1, name: 'QA Operator' },
    createdAt: '2026-11-01T09:00:00Z', updatedAt: '2026-11-01T09:00:00Z', ...overrides,
  } as unknown as ExportRecord
}
function changedInvoice(item: ExportRecord['invoices'][number], stage: StampingStage, date: string) {
  return {
    ...item,
    ...(stage === 'dispatch' ? { vatExemptionStatus: 'IN_PROGRESS', stampingDispatchDate: date }
      : stage === 'return' ? { vatExemptionStatus: 'EXEMPTED', stampingReturnDate: date }
        : { paperworkSentDate: date }),
  } as typeof item
}
function response(stage: StampingStage, ids = [1, 2], date = '2026-11-08'): ExportStampingResult {
  return {
    export: { ...saved, invoices: saved.invoices.map((i) => ids.includes(Number(i.id)) ? changedInvoice(i, stage, date) : i) },
    outcomes: ids.map((id) => ({ invoiceId: id, outcome: 'RECORDED', reason: null })),
  } as ExportStampingResult
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (value: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
let saved: ExportRecord
let clients: Array<ReturnType<typeof renderDetails>['queryClient']> = []
let fetchBlocked: ReturnType<typeof vi.fn>
let xhrBlocked: ReturnType<typeof vi.spyOn>
let socketBlocked: ReturnType<typeof vi.fn>
const button = (name: string, root?: HTMLElement) => (root ? within(root) : screen).getByRole('button', { name, exact: true }) as HTMLButtonElement
function section(stage: StampingStage) {
  return screen.getByRole('heading', { name: new RegExp(`^${heading[stage]}`) }).closest('section')!
}
function select(ids: number[]) {
  expect(screen.queryByRole('dialog')).toBeNull()
  for (const id of ids) fireEvent.click(screen.getByRole('checkbox', { name: `Select QA-SI-${id}`, exact: true }))
}
async function open(stage: StampingStage = 'dispatch') {
  const ui = renderDetails(<ExportDetailPage exportId="41" />)
  clients.push(ui.queryClient)
  await screen.findByRole('tab', { name: 'VAT Exemption Protocol' })
  fireEvent.click(screen.getByRole('tab', { name: 'VAT Exemption Protocol' }))
  expect(section(stage)).toBeTruthy()
  return ui
}
async function routedPage() {
  const path = '/secured/exports/$exportId'
  const root = createRootRoute({ component: () => <Outlet /> })
  const details = createRoute({
    getParentRoute: () => root, path,
    component: () => {
      const { exportId } = details.useParams()
      return <ExportDetailPage key={exportId} exportId={exportId} />
    },
  })
  const away = createRoute({
    getParentRoute: () => root, path: '/qa-away',
    component: () => <div><h1>QA away fixture</h1><Link to={path} params={{ exportId: '41' }}>QA return to Export</Link></div>,
  })
  const router = createRouter({
    routeTree: root.addChildren([details, away]),
    history: createMemoryHistory({ initialEntries: ['/qa-away', '/secured/exports/41'], initialIndex: 1 }),
    defaultPreload: false,
  })
  const ui = renderDetails(<RouterProvider router={router} />)
  clients.push(ui.queryClient)
  await screen.findByRole('tab', { name: 'VAT Exemption Protocol' })
  fireEvent.click(screen.getByRole('tab', { name: 'VAT Exemption Protocol' }))
  return { ...ui, router }
}
async function back(ui: Awaited<ReturnType<typeof routedPage>>) {
  // Memory-history POP models browser Back, which is outside the modal's focus/scrim lock.
  await act(async () => { ui.router.history.back() })
  await screen.findByRole('heading', { name: 'QA away fixture' })
  expect(screen.queryByRole('dialog')).toBeNull()
}
async function returnToDetails() {
  fireEvent.click(screen.getByRole('link', { name: 'QA return to Export' }))
  await screen.findByRole('tab', { name: 'VAT Exemption Protocol' })
  fireEvent.click(screen.getByRole('tab', { name: 'VAT Exemption Protocol' }))
}
async function chooseDay(dialog: HTMLElement, day: number) {
  const picker = button('Choose date', dialog)
  expect(picker.disabled).toBe(false)
  fireEvent.click(picker)
  const dayButton = (await screen.findAllByRole('button', { name: String(day), exact: true }))
    .find((element) => !(element as HTMLButtonElement).disabled)
  expect(dayButton).toBeTruthy()
  fireEvent.click(dayButton!)
  await waitFor(() => expect(picker.textContent).toContain(`${String(day).padStart(2, '0')}/11/2026`))
}
async function dialogFor(stage: StampingStage, day = 8) {
  fireEvent.click(button(action[stage]))
  const dialog = screen.getByRole('dialog', { name: action[stage] })
  if (day) await chooseDay(dialog, day)
  return dialog
}
async function refresh(client: ReturnType<typeof renderDetails>['queryClient']) {
  saved = { ...saved, version: saved.version + 1, shipment: { ...saved.shipment, shipmentNumber: `QA-REFRESH-${saved.version + 1}` } }
  await act(async () => { await client.invalidateQueries({ queryKey: exportKeys.detail('41') }) })
  await screen.findByText(new RegExp(saved.shipment.shipmentNumber))
}
function confirm(dialog: HTMLElement) { fireEvent.click(button('Confirm', dialog)) }

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-09T12:00:00Z'))
  saved = record()
  Object.values(service).forEach((fn) => fn.mockReset())
  for (const fn of Object.values(service)) fn.mockRejectedValue(new Error('QA unspecified service operation blocked'))
  service.get.mockImplementation(async () => structuredClone(saved))
  service.files.mockResolvedValue([])
  service.vessels.mockResolvedValue([])
  service.invoiceOptions.mockResolvedValue({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 })
  fetchBlocked = vi.fn(async () => { throw new Error('QA fetch blocked') })
  vi.stubGlobal('fetch', fetchBlocked)
  xhrBlocked = vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('QA XHR blocked') })
  socketBlocked = vi.fn()
  vi.stubGlobal('WebSocket', class { constructor() { socketBlocked(); throw new Error('QA WebSocket blocked') } })
})
afterEach(() => {
  cleanup()
  clients.forEach((client) => client.clear())
  clients = []
  expect(fetchBlocked).not.toHaveBeenCalled()
  expect(xhrBlocked).not.toHaveBeenCalled()
  expect(socketBlocked).not.toHaveBeenCalled()
  for (const name of ['updateDetails', 'updateInvoices', 'confirmEad', 'confirmIe599', 'cancel', 'ydDocuments', 'ydPdf', 'upload', 'removeFile', 'download'] as const)
    expect(service[name]).not.toHaveBeenCalled()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  localStorage.clear()
})

describe('VAT bulk mounted UI observations, synthetic service only', () => {
  it.each(stages)('control %s: sends exact selection/date and renders mocked canonical response, pruning successful selections', async (stage) => {
    saved = record(stage)
    service.recordStamping.mockResolvedValueOnce(response(stage))
    const ui = await open(stage)
    expect(button(action[stage]).disabled).toBe(true)
    select([1, 2])
    const dialog = await dialogFor(stage)
    expect(dialog.textContent).toContain('Selected invoices (2)')
    expect(dialog.textContent).not.toContain('QA-SI-3')
    confirm(dialog)
    await screen.findByText('Recorded for 2 invoice(s).')
    expect(service.recordStamping).toHaveBeenCalledExactlyOnceWith('41', { event: eventName[stage], date: '2026-11-08', invoiceIds: ['1', '2'] })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(within(section(stage)).getByText('0 selected')).toBeTruthy()
    const next = ui.queryClient.getQueryData<ExportRecord>(exportKeys.detail('41'))!
    expect(next.invoices[2]).toEqual(saved.invoices[2])
    expect(next.protocol).toEqual(saved.protocol)
    expect(next.customsStatus).toBe('COMPLETED')
    expect(next.invoices.map((i) => i.id)).toEqual(saved.invoices.map((i) => i.id))
    if (stage === 'send') {
      expect((screen.getByRole('checkbox', { name: 'Select QA-SI-1' }) as HTMLInputElement).disabled).toBe(true)
      expect(next.invoices[0].vatExemptionStatus).toBe('EXEMPTED')
    }
  })

  it('control: mixed partial results show rejection and keep the rejected eligible row selected', async () => {
    const result = response('dispatch', [1])
    result.outcomes.push({ invoiceId: 2, outcome: 'REJECTED', reason: 'STAMPING_DATE_BEFORE_INVOICE' })
    service.recordStamping.mockResolvedValueOnce(result)
    await open()
    select([1, 2])
    confirm(await dialogFor('dispatch'))
    await screen.findByText('Recorded for 1 invoice(s).')
    await screen.findByText('Not recorded for QA-SI-2: the date is earlier than its previous step.')
    expect(within(section('dispatch')).getByText('1 selected')).toBeTruthy()
    expect((screen.getByRole('checkbox', { name: 'Select QA-SI-2' }) as HTMLInputElement).checked).toBe(true)
    expect((screen.getByRole('checkbox', { name: 'Select QA-SI-3' }) as HTMLInputElement).checked).toBe(false)
  })

  it('B4: mixed RECORDED / ALREADY_RECORDED / REJECTED collapses replay into Recorded count', async () => {
    const result = response('dispatch', [1, 2])
    result.outcomes[1].outcome = 'ALREADY_RECORDED'
    result.outcomes.push({ invoiceId: 3, outcome: 'REJECTED', reason: 'STAMPING_STAGE' })
    service.recordStamping.mockResolvedValueOnce(result)
    await open()
    select([1, 2, 3])
    confirm(await dialogFor('dispatch'))
    await screen.findByText('Recorded for 2 invoice(s).')
    await screen.findByText('Not recorded for QA-SI-3: it is no longer at this step.')
    expect(screen.queryByText(/already recorded/i)).toBeNull()
  })

  it('B7: all-rejected result keeps selected rows but closes the dialog and discards the date', async () => {
    service.recordStamping.mockResolvedValueOnce({
      export: saved,
      outcomes: [1, 2].map((invoiceId) => ({ invoiceId, outcome: 'REJECTED', reason: 'STAMPING_STAGE' })),
    })
    await open()
    select([1, 2])
    confirm(await dialogFor('dispatch'))
    await screen.findByText('Recorded for 0 invoice(s).')
    await screen.findByText('Not recorded for QA-SI-1: it is no longer at this step.')
    await screen.findByText('Not recorded for QA-SI-2: it is no longer at this step.')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(within(section('dispatch')).getByText('2 selected')).toBeTruthy()
    const retry = await dialogFor('dispatch', 0)
    expect(button('Choose date', retry).textContent).toContain('dd/mm/yyyy')
    expect(screen.queryByText('Recorded for 0 invoice(s).')).toBeNull()
    confirm(retry)
    await screen.findByText('Enter the date.')
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
  })

  it('control: authoritative whole-request date rejection stays inline and keeps selection/date', async () => {
    service.recordStamping.mockRejectedValueOnce(new ExportRequestRejected('QA date refusal', 400, 'STAMPING_DATE_FUTURE'))
    await open()
    select([1, 2])
    const dialog = await dialogFor('dispatch')
    confirm(dialog)
    await screen.findByText('The date cannot be later than today.')
    expect(button('Choose date', dialog).textContent).toContain('08/11/2026')
    expect(dialog.textContent).toContain('Selected invoices (2)')
    expect(screen.queryByText(failedCopy)).toBeNull()
  })

  it.each(stages)('B1 %s: unknown response says Nothing changed and allows changed-date retry with no read', async (stage) => {
    saved = record(stage)
    const unknown = new TypeError('QA response lost; commit is unknown')
    expect(exportFailure(unknown).kind).toBe('unknown')
    service.recordStamping.mockRejectedValue(unknown)
    await open(stage)
    select([1, 2])
    const dialog = await dialogFor(stage)
    const reads = service.get.mock.calls.length
    confirm(dialog)
    await screen.findByText(failedCopy)
    expect(button('Choose date', dialog).textContent).toContain('08/11/2026')
    expect(dialog.textContent).toContain('Selected invoices (2)')
    await chooseDay(dialog, 9)
    confirm(dialog)
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(2))
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls.map((call) => call[1])).toEqual([
      { event: eventName[stage], date: '2026-11-08', invoiceIds: ['1', '2'] },
      { event: eventName[stage], date: '2026-11-09', invoiceIds: ['1', '2'] },
    ])
    expect(service.get).toHaveBeenCalledTimes(reads)
  })

  it('B1: after unknown, Cancel allows replacing the invoice set and loses date/context on reopening', async () => {
    service.recordStamping.mockRejectedValue(new TypeError('QA uncertain answer'))
    await open()
    select([1, 2])
    const dialog = await dialogFor('dispatch')
    confirm(dialog)
    await screen.findByText(failedCopy)
    const reads = service.get.mock.calls.length
    fireEvent.click(button('Cancel', dialog))
    expect(screen.queryByRole('dialog')).toBeNull()
    select([1, 3]) // toggles 1 off and 3 on, after the modal is actually dismissed
    const replacement = await dialogFor('dispatch', 0)
    expect(button('Choose date', replacement).textContent).toContain('dd/mm/yyyy')
    expect(within(replacement).queryByText(failedCopy)).toBeNull()
    expect(replacement.textContent).not.toContain('QA-SI-1')
    expect(replacement.textContent).toContain('QA-SI-3')
    await chooseDay(replacement, 9)
    confirm(replacement)
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls[1][1]).toEqual({ event: 'DISPATCH', date: '2026-11-09', invoiceIds: ['2', '3'] })
    expect(service.get).toHaveBeenCalledTimes(reads)
  })

  it.each(stages)('B2 %s: background stage advance is not pruned and still submits an ineligible selected invoice', async (stage) => {
    saved = record(stage)
    const ui = await open(stage)
    select([1, 2])
    const dialog = await dialogFor(stage)
    saved = { ...saved, invoices: saved.invoices.map((i) => Number(i.id) === 1 ? changedInvoice(i, stage, '2026-11-08') : i) }
    await refresh(ui.queryClient)
    expect(dialog.textContent).toContain('Selected invoices (2)')
    expect(dialog.textContent).toContain('QA-SI-1')
    confirm(dialog)
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls[0][1].invoiceIds).toEqual(['1', '2'])
    fireEvent.click(button('Cancel', dialog))
    expect(within(section(stage)).getByText('2 selected')).toBeTruthy()
    if (stage === 'send') {
      const old = within(section(stage)).getByRole('checkbox', { name: 'Select QA-SI-1' }) as HTMLInputElement
      expect(old.disabled).toBe(true)
      expect(old.checked).toBe(true)
    } else expect(within(section(stage)).queryByRole('checkbox', { name: 'Select QA-SI-1' })).toBeNull()
  })

  it('B2 boundary: absent membership shrinks review silently and permits an empty payload; external cause is not proven reachable', async () => {
    const ui = await open()
    select([1])
    const dialog = await dialogFor('dispatch')
    saved = { ...saved, invoices: saved.invoices.filter((i) => Number(i.id) !== 1) }
    await refresh(ui.queryClient)
    expect(dialog.textContent).toContain('Selected invoices (0)')
    expect(button('Confirm', dialog).disabled).toBe(false)
    confirm(dialog)
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls[0][1].invoiceIds).toEqual([])
    // Completed Export removal is normally forbidden: mock boundary, not a standalone reachable product bug.
  })

  it('B1/B2: unknown retry after canonical background advance retains the stale target IDs', async () => {
    service.recordStamping.mockRejectedValue(new TypeError('QA uncertain response'))
    const ui = await open()
    select([1, 2])
    const dialog = await dialogFor('dispatch')
    confirm(dialog)
    await screen.findByText(failedCopy)
    saved = { ...saved, invoices: saved.invoices.map((i) => Number(i.id) === 1 ? changedInvoice(i, 'dispatch', '2026-11-08') : i) }
    await refresh(ui.queryClient)
    await chooseDay(dialog, 9)
    confirm(dialog)
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(2))
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls[1][1]).toEqual({ event: 'DISPATCH', date: '2026-11-09', invoiceIds: ['1', '2'] })
  })

  it.each(stages)('control/B3 %s: pending close/Escape/scrim/reconfirm are blocked, but later date input is erased by success', async (stage) => {
    saved = record(stage)
    const pending = deferred<ExportStampingResult>()
    service.recordStamping.mockImplementationOnce(() => pending.promise)
    const ui = await open(stage)
    select([1, 2])
    const dialog = await dialogFor(stage)
    confirm(dialog)
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(1))
    expect(button('Confirm', dialog).disabled).toBe(true)
    expect(button('Cancel', dialog).disabled).toBe(true)
    expect(within(dialog).queryByRole('button', { name: 'Close', exact: true })).toBeNull()
    fireEvent.click(button('Cancel', dialog))
    confirm(dialog)
    fireEvent.keyDown(dialog, { key: 'Escape' })
    fireEvent.click(dialog.parentElement!.querySelector('[aria-hidden="true"]')!)
    expect(screen.getByRole('dialog')).toBe(dialog)
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
    await chooseDay(dialog, 9) // reachable enabled control inside the pending modal
    expect(service.recordStamping.mock.calls[0][1].date).toBe('2026-11-08')
    await act(async () => { pending.resolve(response(stage)) })
    await screen.findByText('Recorded for 2 invoice(s).')
    expect(screen.queryByRole('dialog')).toBeNull()
    const next = ui.queryClient.getQueryData<ExportRecord>(exportKeys.detail('41'))!
    const field = stage === 'dispatch' ? 'stampingDispatchDate' : stage === 'return' ? 'stampingReturnDate' : 'paperworkSentDate'
    expect(next.invoices[0][field]).toBe('2026-11-08')
  })

  it('B1/B3: late unknown applies failure to the newer date and retry sends that changed date', async () => {
    const pending = deferred<ExportStampingResult>()
    service.recordStamping.mockImplementationOnce(() => pending.promise)
    await open()
    select([1, 2])
    const dialog = await dialogFor('dispatch')
    confirm(dialog)
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(1))
    await chooseDay(dialog, 9)
    await act(async () => { pending.reject(new TypeError('QA lost result')) })
    await screen.findByText(failedCopy)
    expect(button('Choose date', dialog).textContent).toContain('09/11/2026')
    confirm(dialog)
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(2))
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls.map((call) => call[1].date)).toEqual(['2026-11-08', '2026-11-09'])
  })

  it('control: known rejection keeps exact input and same-date retry; empty date sends no request', async () => {
    service.recordStamping.mockRejectedValue(new ExportRequestRejected('QA refusal', 400, null))
    await open()
    select([1, 2])
    const dialog = await dialogFor('dispatch', 0)
    confirm(dialog)
    await screen.findByText('Enter the date.')
    expect(service.recordStamping).not.toHaveBeenCalled()
    await chooseDay(dialog, 8)
    confirm(dialog)
    await screen.findByText(failedCopy)
    expect(button('Choose date', dialog).textContent).toContain('08/11/2026')
    confirm(dialog)
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(2))
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls[0]).toEqual(service.recordStamping.mock.calls[1])
  })

  it.each(stages)('control %s: calendar enforces latest selected minimum and today', async (stage) => {
    saved = record(stage)
    const minimumField = stage === 'dispatch' ? 'invoiceDate' : stage === 'return' ? 'stampingDispatchDate' : 'stampingReturnDate'
    saved.invoices[1] = { ...saved.invoices[1], [minimumField]: '2026-11-07' }
    await open(stage)
    select([1, 2])
    const dialog = await dialogFor(stage, 0)
    fireEvent.click(button('Choose date', dialog))
    // November and adjacent December both contain a 6 in the six-week calendar.
    expect(screen.getAllByRole('button', { name: '6', exact: true }).every((b) => (b as HTMLButtonElement).disabled)).toBe(true)
    expect((screen.getByRole('button', { name: '10', exact: true }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: '7', exact: true }) as HTMLButtonElement).disabled).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: '7', exact: true }))
    confirm(dialog)
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls[0][1].date).toBe('2026-11-07')
  })

  it('control: selections are separate, survive tab changes, clear/select-all excludes already-sent rows', async () => {
    saved = record('dispatch', { invoices: [invoice(1), invoice(2, 'return'), invoice(3, 'send'), invoice(4, 'send', { paperworkSentDate: '2026-11-08' })] })
    await open()
    select([1, 2, 3])
    for (const stage of stages) expect(within(section(stage)).getByText('1 selected')).toBeTruthy()
    fireEvent.click(button('Clear selection', section('dispatch')))
    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }))
    fireEvent.click(screen.getByRole('tab', { name: 'VAT Exemption Protocol' }))
    expect(within(section('dispatch')).getByText('0 selected')).toBeTruthy()
    expect(within(section('return')).getByText('1 selected')).toBeTruthy()
    fireEvent.click(button('Select all eligible', section('send')))
    expect(within(section('send')).getByText('1 selected')).toBeTruthy()
    const sent = screen.getByRole('checkbox', { name: 'Select QA-SI-4' }) as HTMLInputElement
    expect(sent.disabled).toBe(true)
    expect(sent.checked).toBe(false)
    expect(service.recordStamping).not.toHaveBeenCalled()
  })

  it('control: server capability false hides bulk write entry points', async () => {
    saved = record('dispatch', { capabilities: { ...flags, canRecordStamping: false } })
    await open()
    for (const stage of stages) expect(screen.queryByRole('button', { name: action[stage] })).toBeNull()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(service.recordStamping).not.toHaveBeenCalled()
  })

  it('control: a dispatch date earlier than positive IE599 is selectable when after invoice date', async () => {
    await open()
    select([1, 2])
    confirm(await dialogFor('dispatch', 5))
    await screen.findByText(failedCopy)
    expect(service.recordStamping.mock.calls[0][1].date).toBe('2026-11-05')
    expect(saved.ie599Confirmation?.date).toBe('2026-11-07')
  })

  it.each(['pending', 'unknown'] as const)('B5 navigation: memory-router Back drops %s attempt and returning has no recovery state', async (state) => {
    const pending = deferred<ExportStampingResult>()
    service.recordStamping.mockImplementationOnce(() => pending.promise)
    const ui = await routedPage()
    select([1, 2])
    confirm(await dialogFor('dispatch'))
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(1))
    if (state === 'unknown') {
      await act(async () => { pending.reject(new TypeError('QA unknown')) })
      await screen.findByText(failedCopy)
    }
    await back(ui)
    await returnToDetails()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText(failedCopy)).toBeNull()
    expect(within(section('dispatch')).getByText('0 selected')).toBeTruthy()
    select([3])
    const newer = await dialogFor('dispatch', 9)
    if (state === 'pending') {
      await act(async () => { pending.resolve(response('dispatch')) })
      // A remounted route owns a different state setter: old callback does not close this dialog.
      expect(screen.getByRole('dialog')).toBe(newer)
      expect(button('Choose date', newer).textContent).toContain('09/11/2026')
      expect(newer.textContent).toContain('QA-SI-3')
      expect(screen.queryByText('Recorded for 2 invoice(s).')).toBeNull()
    }
  })

  it('B6 late callback: pending response overwrites a newer canonical read after route return', async () => {
    const pending = deferred<ExportStampingResult>()
    const oldResponse = response('dispatch')
    service.recordStamping.mockImplementationOnce(() => pending.promise)
    const ui = await routedPage()
    select([1, 2])
    confirm(await dialogFor('dispatch'))
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(1))
    await back(ui)
    // Synthetic timeline: original dispatch response is delayed; another actor returns 1.
    saved = { ...oldResponse.export, invoices: oldResponse.export.invoices.map((i) => Number(i.id) === 1 ? changedInvoice(i, 'return', '2026-11-09') : i) }
    await returnToDetails()
    await waitFor(() => expect(within(section('send')).getByRole('link', { name: 'QA-SI-1' })).toBeTruthy())
    expect(ui.queryClient.getQueryData<ExportRecord>(exportKeys.detail('41'))!.invoices[0].stampingReturnDate).toBe('2026-11-09')
    const reads = service.get.mock.calls.length
    await act(async () => { pending.resolve(oldResponse) })
    await waitFor(() => expect(within(section('return')).getByRole('link', { name: 'QA-SI-1' })).toBeTruthy())
    expect(within(section('send')).queryByRole('link', { name: 'QA-SI-1' })).toBeNull()
    expect(ui.queryClient.getQueryData<ExportRecord>(exportKeys.detail('41'))!.invoices[0].stampingReturnDate).toBeNull()
    expect(service.get).toHaveBeenCalledTimes(reads)
    expect(saved.invoices[0].stampingReturnDate).toBe('2026-11-09') // fake canonical store not mutated
  })

  it('guard boundary: pending and unknown have no mounted Details beforeunload protection; unmount loses recovery', async () => {
    const pending = deferred<ExportStampingResult>()
    service.recordStamping.mockImplementationOnce(() => pending.promise)
    const ui = await open()
    select([1, 2])
    confirm(await dialogFor('dispatch'))
    await waitFor(() => expect(service.recordStamping).toHaveBeenCalledTimes(1))
    const pendingUnload = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(pendingUnload)
    expect(pendingUnload.defaultPrevented).toBe(false)
    await act(async () => { pending.reject(new TypeError('QA lost answer')) })
    await screen.findByText(failedCopy)
    const unknownUnload = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(unknownUnload)
    expect(unknownUnload.defaultPrevented).toBe(false)
    ui.unmount() // lifecycle boundary only, not a real browser navigation assertion
    await open()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText(failedCopy)).toBeNull()
    expect(within(section('dispatch')).getByText('0 selected')).toBeTruthy()
  })
})
