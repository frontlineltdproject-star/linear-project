/**
 * Export Create controller QA, pinned main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
 * Expectations: FLOW-EX steps 6-7; EX-007/008/027; FRO-350 draft/result protections.
 * Actual Create page, queue, result, AppShell and TanStack memory router.
 * Synthetic auth/profile/lookup/create/upload responses; no backend or Details audit.
 * Destination routes are read-only fixture screens; returning remounts the real Create page.
 * Only DatePicker is simplified for deterministic ISO input, as in the existing test file.
 * BUG assertions characterize current behavior; green does not mean acceptance passed.
 */
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createMemoryHistory, createRootRoute, createRoute, createRouter,
  Link, Outlet, RouterProvider,
} from '@tanstack/react-router'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { AppShell } from '#/components/layout/app-shell'

vi.mock('#/features/auth/hooks/use-auth', () => ({
  useAuth: () => ({ signOut: vi.fn() }),
}))
vi.mock('#/features/auth/hooks/use-current-user-profile', () => ({
  useCurrentUserProfile: () => ({
    isLoading: false,
    data: { id: 1, name: 'QA Staff', email: 'qa@example.test', authorities: ['EXPORT_VIEW', 'EXPORT_CREATE'] },
  }),
}))
vi.mock('#/features/system/hooks/use-server-build-info', () => ({
  useServerBuildInfo: () => ({ data: undefined }),
}))
vi.mock('#/components/ui/date-picker', () => ({
  DatePicker: ({ value, onChange, disabled }: {
    value?: Date | null; onChange?: (date: Date) => void; disabled?: boolean
  }) => <input data-testid="qa-date" disabled={disabled}
    value={value ? `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}` : ''}
    onChange={event => {
      const [y,m,d] = event.target.value.split('-').map(Number)
      onChange?.(new Date(y,m-1,d))
    }} />,
}))
const service = vi.hoisted(() => ({
  candidates: vi.fn(), searchShipments: vi.fn(), invoiceOptions: vi.fn(),
  vessels: vi.fn(), create: vi.fn(), upload: vi.fn(),
}))
vi.mock('../services/export-service', async original => ({
  ...await original<typeof import('../services/export-service')>(),
  ExportService: service,
}))
import { ExportCreatePage } from './export-create-page'

const CREATE = '/secured/exports/new'
const shipment = {
  id: 5, shipmentNumber: 'SH-0005', status: 'PREPARING',
  transportDocumentType: 'AIR_WAYBILL', transportDocumentNumber: 'QA-AWB',
}
const company = { id: 4, name: 'Fictional invoice company', vatNumber: '099000101' }
const invoice = {
  id: 1, invoiceNumber: 'QA-SI-1', invoiceDate: '2026-10-01',
  invoiceType: 'VAT_EXEMPTION_DOCUMENT', vatExemptionStatus: 'NOT_STARTED',
  cancelled: false, purchaseOrder: { id: 71, internalNumber: 'QA-71' },
  supplier: { id: 3, name: 'Fictional supplier' }, invoicingCompany: company,
  vessel: null, paperworkOnly: false, unavailableReason: null, unavailableExportId: null,
}
const candidates = [{
  key: 'GREEK:4', state: 'ELIGIBLE', exportType: 'GREEK_INVOICING_COMPANY',
  existingExportId: null, invoicingCompany: company, supplier: null, shipper: company,
  blocks: [], participatingOrders: [{ id: 71, internalNumber: 'QA-71' }],
  suggestions: [{ source: 'DIRECT', foundThrough: [{ id: 71, internalNumber: 'QA-71' }], invoice }],
}]
function created(id = 41) {
  return {
    outcome: 'CREATED',
    export: {
      id, exportType: 'GREEK_INVOICING_COMPANY', customsStatus: 'AWAITING_EAD',
      shipment, mrn: '26GR0000000000000A', invoices: [{ id: 1 }],
      protocol: { number: 1001, date: '2026-11-09' },
    },
  }
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes,no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const clients: ReturnType<typeof renderDetails>['queryClient'][] = []
async function page() {
  const root = createRootRoute({ component: () => <AppShell><Outlet /></AppShell> })
  const destination = (title: string) => () => <section>
    <h1>{title}</h1>
    <Link to={CREATE}>Return to Create fixture</Link>
  </section>
  const create = createRoute({
    getParentRoute: () => root, path: CREATE,
    component: () => <ExportCreatePage initialShipmentId="5" />,
  })
  const dashboard = createRoute({
    getParentRoute: () => root, path: '/secured/dashboard',
    component: destination('Dashboard fixture'),
  })
  const shipmentRoute = createRoute({
    getParentRoute: () => root, path: '/secured/shipments/$shipmentId',
    component: destination('Shipment fixture'),
  })
  const exportRoute = createRoute({
    getParentRoute: () => root, path: '/secured/exports/$exportId',
    component: destination('Saved Export fixture'),
  })
  const router = createRouter({
    routeTree: root.addChildren([create,dashboard,shipmentRoute,exportRoute]),
    history: createMemoryHistory({ initialEntries: [CREATE] }),
    defaultPreload: false,
  })
  const rendered = renderDetails(<RouterProvider router={router} />)
  clients.push(rendered.queryClient)
  await screen.findByRole('button', { name: 'Selected' })
  return { ...rendered, router }
}
const mrn = () => screen.getByPlaceholderText(/MRN|18/i) as HTMLInputElement
function fill(value='26GR0000000000000A') {
  fireEvent.change(mrn(), { target: { value } })
  fireEvent.change(screen.getAllByTestId('qa-date')[0], { target: { value: '2025-01-02' } })
}
function choose(...files: File[]) {
  fireEvent.click(screen.getByRole('tab', { name: /Documents/ }))
  fireEvent.change(screen.getByLabelText('Choose files'), { target: { files } })
}
function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Create Export' }))
}
async function dashboard() {
  // Actual AppShell <Link>, not a fabricated callback or direct router.navigate.
  fireEvent.click(screen.getAllByRole('link', { name: 'Dashboard' })[0])
  await screen.findByRole('heading', { name: 'Dashboard fixture' })
}
async function returnToCreate() {
  fireEvent.click(screen.getByRole('link', { name: 'Return to Create fixture' }))
  await screen.findByRole('button', { name: 'Selected' })
}
function unloadIsProtected() {
  const event = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(event)
  return event.defaultPrevented
}
beforeEach(() => {
  Object.values(service).forEach(fn => fn.mockReset())
  service.candidates.mockResolvedValue({ shipment, candidates })
  service.searchShipments.mockResolvedValue({ content: [shipment], page: 0, totalPages: 1 })
  service.invoiceOptions.mockResolvedValue({ content: [], page: 0, totalPages: 0 })
  service.vessels.mockResolvedValue([])
  service.upload.mockResolvedValue({ id: 501 })
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('QA: real fetch blocked') }))
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('QA: real XHR blocked') })
  vi.spyOn(window, 'confirm').mockReturnValue(false)
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  clients.splice(0).forEach(client => client.clear())
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('export-create-qa: real navigation and original creation closures', () => {
  it('BUG: actual AppShell navigation silently loses dirty draft/files despite unload protection', async () => {
    const { router } = await page()
    fill()
    choose(new File(['original'], 'dirty.pdf'))
    expect(unloadIsProtected()).toBe(true)
    await dashboard()
    expect(router.state.location.pathname).toBe('/secured/dashboard')
    expect(window.confirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
    await returnToCreate()
    expect(mrn().value).toBe('')
    expect(screen.getByRole('tab', { name: 'Documents (0)' })).toBeTruthy()
    expect(service.create).not.toHaveBeenCalled()
    expect(service.upload).not.toHaveBeenCalled()
  })

  it('BUG: unknown attempt/files disappear through AppShell navigation and a new request is allowed', async () => {
    service.create.mockRejectedValueOnce(new TypeError('Simulated lost creation response'))
      .mockResolvedValueOnce(created(42))
    await page()
    fill()
    choose(new File(['unknown original'], 'unknown.pdf'))
    submit()
    await screen.findByRole('button', { name: 'Check original attempt' })
    // The result intentionally has no Cancel; its callback is not invoked artificially.
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Create Export' })).toBeNull()
    const original = service.create.mock.calls[0][0]
    expect(unloadIsProtected()).toBe(true)
    await dashboard()
    await returnToCreate()
    expect(screen.queryByRole('button', { name: 'Check original attempt' })).toBeNull()
    expect(screen.getByRole('tab', { name: 'Documents (0)' })).toBeTruthy()
    fill()
    submit()
    await screen.findByText('Export 42 created')
    expect(service.create).toHaveBeenCalledTimes(2)
    const replacement = service.create.mock.calls[1][0]
    expect(replacement.requestId).not.toBe(original.requestId)
    expect(service.upload).not.toHaveBeenCalled()
    expect(window.confirm).not.toHaveBeenCalled()
  })

  it('BUG: pending Cancel/discard leaves an unresolved create; late success still uploads original bytes', async () => {
    const pending = deferred<ReturnType<typeof created>>()
    service.create.mockReturnValueOnce(pending.promise)
    await page()
    fill()
    const originalFile = new File(['submitted'], 'submitted.pdf')
    choose(originalFile)
    submit()
    await waitFor(() => expect(service.create).toHaveBeenCalledTimes(1))
    expect((screen.getByRole('button', { name: /Creating/ }) as HTMLButtonElement).disabled).toBe(true)
    const cancel = screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement
    expect(cancel.disabled).toBe(false)
    fireEvent.click(cancel)
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Keep editing' }))
    expect(service.upload).not.toHaveBeenCalled()
    fireEvent.click(cancel)
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Discard draft' }))
    await screen.findByRole('heading', { name: 'Shipment fixture' })
    await returnToCreate()
    fill('26GR0000000000000B')
    const replacementFile = new File(['replacement'], 'replacement.pdf')
    choose(replacementFile)

    await act(async () => { pending.resolve(created(41)); await pending.promise })
    await waitFor(() => expect(service.upload).toHaveBeenCalledTimes(1))
    expect(service.upload.mock.calls[0].slice(0,2)).toEqual(['41',originalFile])
    expect(service.upload.mock.calls.some(call => call[1] === replacementFile)).toBe(false)
    expect(screen.queryByText('Export 41 created')).toBeNull()
    expect(screen.getByText('replacement.pdf')).toBeTruthy()
    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }))
    expect(mrn().value).toBe('26GR0000000000000B')
    // Control: old closure cannot take replacement files or overwrite this new page.
    expect(service.create).toHaveBeenCalledTimes(1)
  })

  it('BUG: result Open Export loses failed upload bytes without departure confirmation', async () => {
    service.create.mockResolvedValueOnce(created())
    service.upload.mockRejectedValueOnce(new TypeError('Simulated lost upload response'))
    await page()
    fill()
    choose(new File(['pending bytes'], 'retry-me.pdf'))
    submit()
    await screen.findByRole('button', { name: 'Retry' })
    expect(unloadIsProtected()).toBe(true)
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Open Export' }))
    await screen.findByRole('heading', { name: 'Saved Export fixture' })
    expect(window.confirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
    await returnToCreate()
    expect(screen.getByRole('tab', { name: 'Documents (0)' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
    expect(screen.queryByText('Export 41 created')).toBeNull()
    expect(service.create).toHaveBeenCalledTimes(1)
  })

  it('BUG: file controls during create upload removed bytes and strand newly staged bytes without retry', async () => {
    const pending = deferred<ReturnType<typeof created>>()
    service.create.mockReturnValueOnce(pending.promise)
    await page()
    fill()
    const removedFile = new File(['old bytes'], 'removed.pdf')
    const addedFile = new File(['new bytes'], 'added-during-create.pdf')
    choose(removedFile)
    submit()
    await waitFor(() => expect(service.create).toHaveBeenCalledTimes(1))
    const remove = screen.getByRole('button', { name: 'Remove' }) as HTMLButtonElement
    expect(remove.disabled).toBe(false)
    fireEvent.click(remove)
    expect(screen.queryByText('removed.pdf')).toBeNull()
    choose(addedFile)
    await act(async () => { pending.resolve(created()); await pending.promise })
    await screen.findByText('Export 41 created')
    await waitFor(() => expect(service.upload).toHaveBeenCalledTimes(1))
    expect(service.upload.mock.calls[0].slice(0,2)).toEqual(['41', removedFile])
    expect(service.upload.mock.calls.some(call => call[1] === addedFile)).toBe(false)
    expect(screen.getByText('added-during-create.pdf')).toBeTruthy()
    expect(screen.getByText('Staged file')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Choose files' })).toBeNull()
    expect(service.create).toHaveBeenCalledTimes(1)
  })

  it('CONTROL: staying on unknown replays the exact attempt; upload retry keeps owner/key; failed navigation keeps result', async () => {
    service.create.mockRejectedValueOnce(new TypeError('lost response'))
      .mockResolvedValueOnce(created())
    service.upload.mockRejectedValueOnce(new TypeError('lost upload'))
      .mockResolvedValueOnce({ id: 502 })
    const { router } = await page()
    fill()
    const file = new File(['retained'], 'retained.pdf')
    choose(file)
    submit()
    fireEvent.click(await screen.findByRole('button', { name: 'Check original attempt' }))
    await screen.findByRole('button', { name: 'Retry' })
    expect(service.create.mock.calls[1][0]).toEqual(service.create.mock.calls[0][0])
    expect(service.upload.mock.calls[0].slice(0,2)).toEqual(['41', file])
    const originalKey = service.upload.mock.calls[0][2]
    const failure = Promise.reject(new Error('Simulated router rejection'))
    void failure.catch(() => {}) // observe injection; page itself uses void navigate
    vi.spyOn(router, 'navigate').mockReturnValueOnce(failure)
    fireEvent.click(screen.getByRole('button', { name: 'Open Export' }))
    await act(async () => { await failure.catch(() => {}) })
    expect(screen.getByText('Export 41 created')).toBeTruthy()
    expect(screen.getByText('retained.pdf')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Create Export' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await screen.findByText('Uploaded')
    expect(service.upload.mock.calls[1]).toEqual(['41', file, originalKey])
    expect(service.create).toHaveBeenCalledTimes(2) // initial + exact recovery, not upload retry
  })
})
