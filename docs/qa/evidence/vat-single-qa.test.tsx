import type { ReactNode } from 'react'
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { GraphQLExecutorError } from '#/lib/graphql'
import { UserAuthority } from '#/features/auth/types'
import { supplierInvoiceKeys } from './hooks/use-supplier-invoices'
import { SupplierInvoiceDetailPage } from './components/supplier-invoice-detail-page'
import { SupplierInvoiceStampingAction } from './components/supplier-invoice-export'
import type { SupplierInvoiceWithActivity } from './types'
import type { InvoiceExportSummary } from '#/features/exports/services/export-service'

// Read-only observation tests, pinned main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
// Actual page, hooks, QueryClient, stamping action, confirmation, Modal, DatePicker,
// validation and labels. Only auth/router and service I/O are substituted.
// A passing observation can demonstrate a defect; these are not fix assertions.
const state = vi.hoisted(() => ({ blocker: null as any, authorities: new Set<string>() }))
const service = vi.hoisted(() => ({
  get: vi.fn(), files: vi.fn(), currencies: vi.fn(), order: vi.fn(),
  clientVessels: vi.fn(), recordStamping: vi.fn(),
}))
const exportsService = vi.hoisted(() => ({ bySupplierInvoice: vi.fn() }))
const network = vi.hoisted(() => {
  const blocked = vi.fn(() => { throw new Error('VAT QA forbids all real network I/O') })
  globalThis.fetch = blocked as any
  globalThis.XMLHttpRequest = class { constructor() { blocked() } } as any
  globalThis.WebSocket = class { constructor() { blocked() } } as any
  return blocked
})
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params }: { children: ReactNode; to: string; params?: Record<string, string> }) => (
    <a href={Object.entries(params ?? {}).reduce((path, [key, value]) => path.replace(`$${key}`, value), to)}>{children}</a>
  ),
  useBlocker: (options: unknown) => { state.blocker = options; return { status: 'idle' } },
}))
vi.mock('#/features/auth/hooks/use-has-authority', () => ({
  useHasAuthority: (authority: string) => state.authorities.has(authority),
}))
vi.mock('./services/supplier-invoice-service', async (original) => ({
  ...await original<typeof import('./services/supplier-invoice-service')>(),
  SupplierInvoiceService: service,
}))
vi.mock('#/features/exports/services/export-service', async (original) => ({
  ...await original<typeof import('#/features/exports/services/export-service')>(),
  ExportService: exportsService,
}))

type Stage = 'dispatch' | 'return' | 'send'
const stages: Stage[] = ['dispatch', 'return', 'send']
const actionLabel = {
  dispatch: 'Record dispatch for stamping',
  return: 'Record stamped papers returned',
  send: 'Record paperwork sent to recipient',
}
const eventName = { dispatch: 'DISPATCH', return: 'RETURN', send: 'PAPERWORK_SENT' }
const dateField = { dispatch: 'stampingDispatchDate', return: 'stampingReturnDate', send: 'paperworkSentDate' } as const
const unknown = 'The outcome is unresolved. Check the original attempt before submitting again.'
const notApplied = 'The change was not saved. You can save it again.'
const clients: Array<ReturnType<typeof renderDetails>['queryClient']> = []
let saved: SupplierInvoiceWithActivity

function invoice(stage: Stage = 'dispatch', overrides: Partial<SupplierInvoiceWithActivity> = {}): SupplierInvoiceWithActivity {
  return {
    id: 42, version: 3, invoiceNumber: 'SYNTHETIC-VAT-42', invoiceDate: '2026-11-01', expirationDate: null,
    invoiceType: 'VAT_EXEMPTION_DOCUMENT', currency: 'EUR', netAmount: '100.00', vatAmount: '0.00',
    vatExemptionStatus: stage === 'dispatch' ? 'NOT_STARTED' : stage === 'return' ? 'IN_PROGRESS' : 'EXEMPTED',
    stampingDispatchDate: stage === 'dispatch' ? null : '2026-11-03',
    stampingReturnDate: stage === 'send' ? '2026-11-04' : null, paperworkSentDate: null,
    cancelled: false, cancellable: false, cancelledAt: null,
    createdAt: '2026-11-01T10:00:00Z', updatedAt: '2026-11-01T10:00:00Z',
    purchaseOrder: { id: 8, internalNumber: 'SYNTHETIC-PO-8', status: 'PENDING', pickupInGreece: true, customsRegime: 'FREE_CIRCULATION' },
    supplier: { id: 3, name: 'Synthetic supplier' }, client: { id: 2, name: 'Synthetic client' },
    invoiceCompany: null, vessel: null, allowedInvoiceTypes: ['VAT_EXEMPTION_DOCUMENT'], activity: [],
    ...overrides,
  } as SupplierInvoiceWithActivity
}
function recorded(stage: Stage, date = '2026-11-05') {
  return invoice(stage, {
    version: 4, [dateField[stage]]: date,
    vatExemptionStatus: stage === 'dispatch' ? 'IN_PROGRESS' : 'EXEMPTED',
  })
}
function summary(overrides: Record<string, unknown> = {}): InvoiceExportSummary {
  return { id: 41, cancelled: false, customsStatus: 'COMPLETED', exportType: 'GREEK_INVOICING_COMPANY',
    mrn: 'SYNTHETIC-MRN', mrnDate: '2026-11-02', shipment: { id: 5, shipmentNumber: 'SYNTHETIC-SH-5' },
    protocol: null, ...overrides } as InvoiceExportSummary
}
function rejection(classification: string) {
  return new GraphQLExecutorError(`Synthetic ${classification}`, {
    cause: null, messages: [`Synthetic ${classification}`], classifications: [classification], status: 200,
  })
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const button = (name: string) => screen.getByRole('button', { name, exact: true }) as HTMLButtonElement
// November's 42-cell calendar includes December 1-6; first matching numeral is November.
const dayButton = (day: number) => screen.getAllByRole('button', { name: String(day), exact: true })[0] as HTMLButtonElement
const dialog = () => within(screen.getByRole('dialog', { name: /Record/ }))
const confirm = () => fireEvent.click(dialog().getByRole('button', { name: 'Confirm', exact: true }))
async function open(stage: Stage) {
  fireEvent.click(await screen.findByRole('button', { name: actionLabel[stage], exact: true }))
  await screen.findByRole('dialog', { name: new RegExp(actionLabel[stage]) })
}
async function pick(day: number) {
  // Real calendar buttons, never DatePicker.onChange or confirm() callbacks.
  fireEvent.click(dialog().getByRole('button', { name: 'Choose date' }))
  await screen.findByText('November 2026')
  fireEvent.click(dayButton(day))
  await waitFor(() => expect(screen.queryByText('November 2026')).toBeNull())
}
function renderAction(stage: Stage) {
  const refresh = vi.fn().mockResolvedValue(invoice(stage))
  const onRecorded = vi.fn()
  const view = renderDetails(<SupplierInvoiceStampingAction invoice={invoice(stage)} stage={stage} export={summary()} refresh={refresh} onRecorded={onRecorded} />)
  clients.push(view.queryClient)
  return { ...view, refresh, onRecorded }
}
async function renderPage(stage: Stage = 'dispatch') {
  saved = invoice(stage)
  const view = renderDetails(<SupplierInvoiceDetailPage invoiceId="42" />)
  clients.push(view.queryClient)
  await screen.findByText('Supplier invoice · 42')
  return view
}
async function refetch(view: ReturnType<typeof renderDetails>, next: SupplierInvoiceWithActivity) {
  saved = next
  await act(async () => { await view.queryClient.refetchQueries({ queryKey: supplierInvoiceKeys.detail('42') }) })
  await waitFor(() => expect(view.queryClient.getQueryData(supplierInvoiceKeys.detail('42'))).toEqual(next))
  // Query observer notifications are asynchronous even after fetchQuery resolves.
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)) })
}
async function makeUnknown(stage: Stage) {
  service.recordStamping.mockRejectedValue(new Error('Synthetic lost response'))
  await open(stage)
  await pick(5)
  confirm()
  await screen.findByText(unknown)
}
function closeDialog(how: string) {
  if (how === 'Escape') fireEvent.keyDown(document, { key: 'Escape' })
  else if (how === 'scrim') {
    const panel = screen.getByRole('dialog', { name: /Record/ })
    fireEvent.click(panel.previousElementSibling!)
  } else fireEvent.click(dialog().getByRole('button', { name: how, exact: true }))
}
function guard() {
  // Deliberately inspecting the actual page's router options: not claiming browser navigation.
  return {
    route: state.blocker.shouldBlockFn({ current: { pathname: '/secured/supplier-invoices/42' }, next: { pathname: '/secured/supplier-invoices' } }),
    unload: state.blocker.enableBeforeUnload(),
  }
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-09T12:00:00Z'))
  network.mockClear()
  Object.values(service).forEach((mock) => mock.mockReset())
  exportsService.bySupplierInvoice.mockReset().mockResolvedValue([summary()])
  state.authorities = new Set([
    UserAuthority.SUPPLIER_INVOICE_VIEW, UserAuthority.SUPPLIER_INVOICE_EDIT,
    UserAuthority.EXPORT_VIEW, UserAuthority.EXPORT_EDIT,
  ])
  saved = invoice()
  service.get.mockImplementation(async () => saved)
  service.files.mockResolvedValue([])
  service.currencies.mockResolvedValue([{ code: 'EUR', name: 'Euro' }])
  service.order.mockResolvedValue(null)
  service.clientVessels.mockResolvedValue([])
})
afterEach(() => {
  cleanup()
  clients.splice(0).forEach((client) => client.clear())
  localStorage.clear()
  vi.useRealTimers()
  expect(network).not.toHaveBeenCalled()
})

describe('VAT single controls and real dialog interaction', () => {
  it.each(stages)('CONTROL %s sends the selected event/date/version and renders the mocked saved result', async (stage) => {
    service.recordStamping.mockImplementation(async () => { saved = recorded(stage); return saved })
    await renderPage(stage)
    await open(stage)
    await pick(5)
    confirm()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(service.recordStamping).toHaveBeenCalledExactlyOnceWith('42', { expectedVersion: '3', event: eventName[stage], date: '2026-11-05' })
    expect(within(screen.getByRole('region', { name: 'VAT exemption' })).getByText('05/11/2026')).toBeTruthy()
    if (stage === 'dispatch') expect(button(actionLabel.return)).toBeTruthy()
    if (stage === 'return') expect(button(actionLabel.send)).toBeTruthy()
    if (stage === 'send') expect(screen.queryByRole('button', { name: actionLabel.send })).toBeNull()
  })

  it.each(stages)('CONTROL %s requires date and disables out-of-range calendar choices', async (stage) => {
    renderAction(stage)
    await open(stage)
    confirm()
    expect(service.recordStamping).not.toHaveBeenCalled()
    expect(dialog().getByText(/date.*required|choose.*date|enter.*date/i)).toBeTruthy()
    fireEvent.click(dialog().getByRole('button', { name: 'Choose date' }))
    await screen.findByText('November 2026')
    expect(dayButton(10).disabled).toBe(true)
    expect(dayButton(5).disabled).toBe(false)
    if (stage !== 'dispatch') expect(dayButton(2).disabled).toBe(true)
    fireEvent.click(dayButton(10))
    expect(service.recordStamping).not.toHaveBeenCalled()
  })

  it.each(['BAD_REQUEST', 'CONFLICT', 'FORBIDDEN'])('CONTROL known %s rejection preserves date and disables repeat until date changes', async (classification) => {
    service.recordStamping.mockRejectedValue(rejection(classification))
    renderAction('dispatch')
    await open('dispatch'); await pick(5); confirm()
    await screen.findByText(`Synthetic ${classification}`)
    expect(dialog().getByRole('button', { name: 'Choose date' }).textContent).toBe('05/11/2026')
    expect((dialog().getByRole('button', { name: 'Confirm' }) as HTMLButtonElement).disabled).toBe(true)
    confirm()
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
    await pick(6)
    expect((dialog().getByRole('button', { name: 'Confirm' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it.each(stages)('OBSERVATION %s pending prevents close/duplicate confirm but permits a different calendar date', async (stage) => {
    const pending = deferred<SupplierInvoiceWithActivity>()
    service.recordStamping.mockReturnValue(pending.promise)
    renderAction(stage)
    await open(stage); await pick(5); confirm()
    expect((dialog().getByRole('button', { name: 'Cancel' }) as HTMLButtonElement).disabled).toBe(true)
    expect(dialog().queryByRole('button', { name: 'Close' })).toBeNull()
    closeDialog('Cancel'); closeDialog('Escape'); closeDialog('scrim'); confirm()
    expect(screen.getByRole('dialog', { name: /Record/ })).toBeTruthy()
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
    // DatePicker has no text input: literal pending date typing is not reachable.
    expect(dialog().queryByRole('textbox')).toBeNull()
    expect((dialog().getByRole('button', { name: 'Choose date' }) as HTMLButtonElement).disabled).toBe(false)
    await pick(6)
    expect(dialog().getByRole('button', { name: 'Choose date' }).textContent).toBe('06/11/2026')
    expect(service.recordStamping.mock.calls[0][1].date).toBe('2026-11-05')
    await act(async () => pending.reject(new Error('Synthetic lost response')))
    await screen.findByText(unknown)
    expect(dialog().getByRole('button', { name: 'Choose date' }).textContent).toBe('06/11/2026')
    expect(dialog().getByRole('button', { name: 'Check original attempt' })).toBeTruthy()
  })

  it('OBSERVATION delayed success closes the dialog despite a newer selected date', async () => {
    const pending = deferred<SupplierInvoiceWithActivity>()
    service.recordStamping.mockReturnValue(pending.promise)
    const view = renderAction('dispatch')
    await open('dispatch'); await pick(5); confirm(); await pick(6)
    await act(async () => pending.resolve(recorded('dispatch')))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(view.onRecorded).toHaveBeenCalledWith(recorded('dispatch'))
    expect(service.recordStamping.mock.calls[0][1].date).toBe('2026-11-05')
  })
})

describe('VAT single original attempt and refresh observations', () => {
  it.each(stages)('OBSERVATION parent %s sends unseen version 4 after opening on version 3', async (stage) => {
    const view = await renderPage(stage)
    await open(stage); await pick(5)
    const originalBody = screen.getByRole('dialog', { name: /Record/ }).textContent
    await refetch(view, invoice(stage, { version: 4, netAmount: '200.00' }))
    expect(screen.getByRole('dialog', { name: /Record/ }).textContent).toBe(originalBody)
    service.recordStamping.mockRejectedValue(rejection('BAD_REQUEST'))
    confirm()
    await screen.findByText('Synthetic BAD_REQUEST')
    expect(service.recordStamping).toHaveBeenCalledExactlyOnceWith('42', { expectedVersion: '4', event: eventName[stage], date: '2026-11-05' })
  })

  it.each(stages)('OBSERVATION %s Cancel/reopen forgets uncertain attempt and sends a changed date without checking', async (stage) => {
    const view = renderAction(stage)
    await makeUnknown(stage)
    closeDialog('Cancel')
    await open(stage)
    expect(screen.queryByText(unknown)).toBeNull()
    expect(dialog().getByRole('button', { name: 'Choose date' }).textContent).toBe('dd/mm/yyyy')
    await pick(6); confirm()
    await screen.findByText(unknown)
    expect(view.refresh).not.toHaveBeenCalled()
    expect(service.recordStamping.mock.calls.map((call) => call[1].date)).toEqual(['2026-11-05', '2026-11-06'])
  })

  it.each(['Close', 'Escape', 'scrim'])('OBSERVATION unknown %s dismissal also resets original-attempt recovery', async (how) => {
    renderAction('dispatch'); await makeUnknown('dispatch')
    closeDialog(how)
    expect(screen.queryByRole('dialog')).toBeNull()
    await open('dispatch')
    expect(dialog().queryByRole('button', { name: 'Check original attempt' })).toBeNull()
    expect((dialog().getByRole('button', { name: 'Confirm' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it.each(stages)('OBSERVATION %s Check accepts another writer event on a different date', async (stage) => {
    const view = renderAction(stage)
    await makeUnknown(stage)
    const unrelated = recorded(stage, '2026-11-06')
    view.refresh.mockResolvedValue(unrelated)
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(view.onRecorded).toHaveBeenCalledExactlyOnceWith(unrelated)
    expect(service.recordStamping.mock.calls[0][1].date).toBe('2026-11-05')
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
  })

  it('CONTROL Check accepts matching recorded date without resubmitting', async () => {
    const view = renderAction('dispatch'); await makeUnknown('dispatch')
    view.refresh.mockResolvedValue(recorded('dispatch'))
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await waitFor(() => expect(view.onRecorded).toHaveBeenCalledExactlyOnceWith(recorded('dispatch')))
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
  })

  it.each(['denied', 'transport'])('CONTROL %s recovery read preserves unknown and original displayed date', async (failure) => {
    const view = renderAction('dispatch'); await makeUnknown('dispatch')
    view.refresh.mockRejectedValue(failure === 'denied' ? rejection('FORBIDDEN') : new Error('Synthetic offline'))
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await screen.findByText(unknown)
    expect(dialog().getByRole('button', { name: 'Choose date' }).textContent).toBe('05/11/2026')
    expect(view.onRecorded).not.toHaveBeenCalled()
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
  })

  it.each([null, undefined])('OBSERVATION missing recovery read %s claims not saved and enables new submission', async (missing) => {
    const view = renderAction('dispatch'); await makeUnknown('dispatch')
    view.refresh.mockResolvedValue(missing)
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await screen.findByText(notApplied)
    expect((dialog().getByRole('button', { name: 'Confirm' }) as HTMLButtonElement).disabled).toBe(false)
    expect(view.onRecorded).not.toHaveBeenCalled()
  })

  it('CONTROL successful same-version read with no event permits an unchanged retry', async () => {
    const view = renderAction('dispatch'); await makeUnknown('dispatch')
    view.refresh.mockResolvedValue(invoice())
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await screen.findByText(notApplied)
    confirm(); await screen.findByText(unknown)
    expect(service.recordStamping.mock.calls[1][1]).toEqual(service.recordStamping.mock.calls[0][1])
  })
})

describe('VAT single Details integration, stage ownership and guards', () => {
  it('OBSERVATION parent Check accepts different-date event and moves to the next action', async () => {
    await renderPage(); await makeUnknown('dispatch')
    saved = recorded('dispatch', '2026-11-06')
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await screen.findByRole('button', { name: actionLabel.return, exact: true })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(within(screen.getByRole('region', { name: 'VAT exemption' })).getByText('06/11/2026')).toBeTruthy()
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
  })

  it('CONTROL parent forbidden recovery read keeps the loaded page and unknown dialog', async () => {
    await renderPage(); await makeUnknown('dispatch')
    service.get.mockRejectedValue(rejection('FORBIDDEN'))
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await screen.findByText(unknown)
    expect(screen.getByText('Supplier invoice · 42')).toBeTruthy()
    expect(dialog().getByRole('button', { name: 'Check original attempt' })).toBeTruthy()
  })

  it('OBSERVATION parent missing recovery read unmounts the uncertain stamping action', async () => {
    await renderPage(); await makeUnknown('dispatch')
    service.get.mockResolvedValue(null)
    fireEvent.click(dialog().getByRole('button', { name: 'Check original attempt' }))
    await screen.findByText('This supplier invoice does not exist.')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Check original attempt' })).toBeNull()
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
  })

  it.each(['unknown', 'pending'])('OBSERVATION parent stage refresh discards %s recovery for a different-date writer event', async (status) => {
    const view = await renderPage()
    const pending = deferred<SupplierInvoiceWithActivity>()
    if (status === 'unknown') await makeUnknown('dispatch')
    else {
      service.recordStamping.mockReturnValue(pending.promise)
      await open('dispatch'); await pick(5); confirm()
    }
    await refetch(view, recorded('dispatch', '2026-11-06'))
    await screen.findByRole('button', { name: actionLabel.return, exact: true })
    expect(screen.queryByRole('dialog')).toBeNull()
    if (status === 'pending') await act(async () => pending.reject(new Error('Synthetic lost original response')))
    expect(screen.queryByText(unknown)).toBeNull()
    expect(screen.queryByRole('button', { name: 'Check original attempt' })).toBeNull()
    await open('return')
    expect((dialog().getByRole('button', { name: 'Confirm' }) as HTMLButtonElement).disabled).toBe(false)
    expect(service.recordStamping).toHaveBeenCalledTimes(1)
  })

  it('CONTROL same-stage parent refresh retains uncertain date and Check control', async () => {
    const view = await renderPage(); await makeUnknown('dispatch')
    await refetch(view, invoice('dispatch', { version: 4, netAmount: '200.00' }))
    expect(screen.getByText(unknown)).toBeTruthy()
    expect(dialog().getByRole('button', { name: 'Choose date' }).textContent).toBe('05/11/2026')
    expect(dialog().getByRole('button', { name: 'Check original attempt' })).toBeTruthy()
  })

  it('OBSERVATION parent router/unload predicates ignore entered date, pending write and unknown outcome', async () => {
    await renderPage()
    const pending = deferred<SupplierInvoiceWithActivity>()
    service.recordStamping.mockReturnValue(pending.promise)
    await open('dispatch'); await pick(5)
    expect(guard()).toEqual({ route: false, unload: false })
    confirm()
    expect(guard()).toEqual({ route: false, unload: false })
    await act(async () => pending.reject(new Error('Synthetic lost response')))
    await screen.findByText(unknown)
    expect(guard()).toEqual({ route: false, unload: false })
  })

  it('CONTROL same parent enables route/unload predicates for an ordinary card editor', async () => {
    await renderPage()
    fireEvent.click(button('Edit Supplier invoice details'))
    expect(guard()).toEqual({ route: true, unload: true })
  })

  it('CONTROL missing positive IE599 disables dispatch entry', async () => {
    exportsService.bySupplierInvoice.mockResolvedValue([summary({ customsStatus: 'AWAITING_IE599' })])
    await renderPage()
    const start = await screen.findByRole('button', { name: actionLabel.dispatch, exact: true }) as HTMLButtonElement
    expect(start.disabled).toBe(true)
    fireEvent.click(start)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(service.recordStamping).not.toHaveBeenCalled()
  })

  it.each(['forbidden', 'missing', 'cancelled-export', 'no-edit-authority'])('CONTROL %s Export access supplies no stamping action', async (kind) => {
    if (kind === 'forbidden') exportsService.bySupplierInvoice.mockRejectedValue(rejection('FORBIDDEN'))
    if (kind === 'missing') exportsService.bySupplierInvoice.mockResolvedValue([])
    if (kind === 'cancelled-export') exportsService.bySupplierInvoice.mockResolvedValue([summary({ cancelled: true })])
    if (kind === 'no-edit-authority') state.authorities.delete(UserAuthority.EXPORT_EDIT)
    const view = await renderPage()
    await waitFor(() => expect(view.queryClient.isFetching()).toBe(0))
    expect(screen.queryByRole('button', { name: actionLabel.dispatch })).toBeNull()
    expect(service.recordStamping).not.toHaveBeenCalled()
  })

  it.each(['cancelled', 'wrong-type', 'sent'])('CONTROL %s invoice has no stamping entry', async (kind) => {
    const view = await renderPage()
    await screen.findByRole('button', { name: actionLabel.dispatch })
    await refetch(view, kind === 'cancelled' ? invoice('dispatch', { cancelled: true }) : kind === 'wrong-type'
      ? invoice('dispatch', { invoiceType: 'GREEK_SUPPLIER_FOREIGN_RECIPIENT', vatExemptionStatus: 'NOT_REQUIRED' })
      : recorded('send'))
    expect(stages.every((stage) => screen.queryByRole('button', { name: actionLabel[stage] }) === null)).toBe(true)
  })
})
