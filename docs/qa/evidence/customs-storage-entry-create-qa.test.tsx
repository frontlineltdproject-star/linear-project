import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { GraphQLExecutorError } from '#/lib/graphql/errors'
import { useLocale } from '#/app/providers/labels-provider'
import { createRootRoute, createRoute, createRouter, createMemoryHistory, RouterProvider, Link, Outlet } from '@tanstack/react-router'

// Actual controller, hooks, UI, labels and mappings; only network and routing are fixture boundaries.
const navigate = vi.hoisted(() => vi.fn())
const historyBack = vi.hoisted(() => vi.fn())
const routerHarness = vi.hoisted(() => ({ actual: false }))
vi.mock('@tanstack/react-router', async (original) => {
  const actual = await original<typeof import('@tanstack/react-router')>()
  return { ...actual,
    useNavigate: () => routerHarness.actual ? actual.useNavigate() : navigate,
    useRouter: () => routerHarness.actual ? actual.useRouter() : ({ history: { back: historyBack } }),
  }
})
const service = vi.hoisted(() => ({ orderCard: vi.fn(), draft: vi.fn(), searchOrders: vi.fn(), create: vi.fn(), byPurchaseOrder: vi.fn() }))
vi.mock('#/features/customs-storage/services/customs-storage-service', () => ({ CustomsStorageService: service }))
import { CustomsStorageCreatePage } from '#/features/customs-storage/create/components/customs-storage-create-page'
import { customsStorageKeys } from '#/features/customs-storage/hooks/use-customs-storage'

const eligible = { eligible: true, reason: null, order: null, entry: null }
const fixture = (id = 5) => ({
  eligibility: eligible,
  order: {
    id, stockId: `SYNTHETIC-${id}`, status: 'IN_STOCK',
    warehouse: { id, code: `SYN-${id}`, name: `Synthetic warehouse ${id}` },
    admittedAt: '2026-10-20T06:42:00Z', admittedCollis: 3, grossWeightKg: '12.50', grossWeightUnknown: false,
    depositor: { id: 7, name: 'Synthetic invoicing company', vatNumber: null }, depositorMissing: false,
    client: { id: 1, name: 'Synthetic client', vatNumber: null }, supplier: null, supplierMissing: true,
  },
  invoices: [], totals: null, export: null,
  prefill: { permitNumber: `SYN-PERMIT-${id}`, operatorName: `Synthetic operator ${id}`, operatorVatNumber: null, warehouseAddress: `Synthetic address ${id}` },
})
const card = () => ({ id: 5, internalNumber: 'SYNTHETIC-5', customsStorageEntry: null, customsStorageEntryCreation: eligible })
const deferred = <T,>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const createButton = () => screen.getByRole('button', { name: 'Create Customs Storage Entry' })
const page = () => renderDetails(<CustomsStorageCreatePage initialPurchaseOrderId="5" />)
const ready = async () => { await screen.findByDisplayValue('SYN-PERMIT-5'); await waitFor(() => expect(createButton()).toHaveProperty('disabled', false)) }
const failedText = 'The entry could not be created. Nothing was saved. Your values are kept.'
const candidate = (id: number) => ({ id, stockId: `SYNTHETIC-${id}`, status: 'IN_STOCK', clientName: 'Synthetic client', supplierName: null, eligibility: eligible })
function LocaleToggle() { const { setLocale } = useLocale(); return <button onClick={() => setLocale('el')}>QA Greek</button> }
let network: ReturnType<typeof vi.fn>
beforeEach(() => {
  routerHarness.actual = false
  navigate.mockReset(); historyBack.mockReset()
  Object.values(service).forEach((fn) => fn.mockReset())
  service.orderCard.mockResolvedValue(card()); service.draft.mockImplementation(async (id: string) => fixture(Number(id)))
  service.searchOrders.mockResolvedValue([])
  navigate.mockResolvedValue(undefined)
  network = vi.fn(() => { throw new Error('Real network forbidden in isolated CSE QA') })
  vi.stubGlobal('fetch', network)
  vi.stubGlobal('scrollTo', vi.fn())
  vi.stubGlobal('XMLHttpRequest', class { constructor() { network() } })
})
afterEach(() => { cleanup(); localStorage.clear(); expect(network).not.toHaveBeenCalled(); vi.unstubAllGlobals() })

describe('CSE create isolated controls and observations', () => {
  it('CONTROL: successful explicit create retains exact Order ID, manual fields and return context', async () => {
    service.create.mockResolvedValue({ id: 42, entryNumber: 1042 })
    page(); await ready()
    expect(service.create).not.toHaveBeenCalled()
    fireEvent.change(screen.getByRole('textbox', { name: /^Entry MRN ·/ }), { target: { value: 'SYN-MANUAL-MRN' } })
    fireEvent.click(createButton())
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: '/secured/customs-storage-entries/$entryNumber', params: { entryNumber: '1042' }, search: { returnOrderId: 5, returnStockId: 'SYNTHETIC-5' } }))
    expect(service.create).toHaveBeenCalledTimes(1)
    expect(service.create.mock.calls[0][0]).toMatchObject({ purchaseOrderId: 5, entryMrn: 'SYN-MANUAL-MRN', permitNumber: 'SYN-PERMIT-5' })
  })

  it('CONTROL: normal concurrent ALREADY_COVERED response identifies another entry and preserves draft', async () => {
    service.create.mockRejectedValue(new GraphQLExecutorError('covered', { cause: null, messages: ['covered'], classifications: ['BAD_REQUEST'], extensions: [{ code: 'ALREADY_COVERED', entryId: 43, entryNumber: 1043, purchaseOrderId: 5 }] }))
    page(); await ready()
    fireEvent.click(createButton())
    expect(await screen.findByText(/1043.*was created for this Order by someone else/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open' }).getAttribute('href')).toBe('/secured/customs-storage-entries/1043')
    expect(screen.getByDisplayValue('SYN-PERMIT-5')).toBeTruthy()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('OBSERVATION: failed lost-response lookup falsely says nothing saved and permits a second create', async () => {
    service.create.mockRejectedValue(new TypeError('Synthetic lost create response'))
    const lookup = deferred<null>(); service.byPurchaseOrder.mockReturnValue(lookup.promise)
    page(); await ready(); fireEvent.click(createButton())
    await waitFor(() => expect(service.byPurchaseOrder).toHaveBeenCalledWith('5'))
    expect(screen.getByRole('button', { name: 'Creating…' })).toHaveProperty('disabled', true)
    await act(async () => { lookup.reject(new TypeError('Synthetic lookup offline')); await Promise.resolve() })
    expect(await screen.findByText(failedText)).toBeTruthy()
    await waitFor(() => expect(createButton()).toHaveProperty('disabled', false))
    fireEvent.click(createButton())
    await waitFor(() => expect(service.create).toHaveBeenCalledTimes(2))
  })

  it('CONDITIONAL BRANCH ONLY (reachable transition unestablished): inherited lookup is reported as no entry created', async () => {
    service.create.mockRejectedValue(new TypeError('Synthetic lost response'))
    service.byPurchaseOrder.mockResolvedValue({ access: 'INHERITED', owningOrder: { id: 4, stockId: 'SYNTHETIC-4' }, entry: { id: 42, entryNumber: 1042 } })
    page(); await ready(); fireEvent.click(createButton())
    expect(await screen.findByText('No entry was created. You can try again.')).toBeTruthy()
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.queryByRole('link', { name: 'Open' })).toBeNull()
    await waitFor(() => expect(createButton()).toHaveProperty('disabled', false))
  })

  it('OBSERVATION: successful create followed by asynchronous navigation failure has no saved-record recovery and allows resubmission', async () => {
    service.create.mockResolvedValue({ id: 42, entryNumber: 1042 })
    const navigation = deferred<void>()
    // Harness observes the rejected promise so the test runner need not fail on an intentional unhandled rejection.
    // Production does not install a rejection handler or retain saved identity.
    void navigation.promise.catch(() => undefined)
    navigate.mockReturnValue(navigation.promise)
    page(); await ready()
    // After the acknowledged save, follow-up reads fail rather than unrealistically reporting eligible.
    service.orderCard.mockRejectedValue(new TypeError('Synthetic post-save read unavailable'))
    service.draft.mockRejectedValue(new TypeError('Synthetic post-save read unavailable'))
    fireEvent.click(createButton())
    await waitFor(() => expect(navigate).toHaveBeenCalledTimes(1))
    await act(async () => { navigation.reject(new Error('Synthetic async navigation failure')); await Promise.resolve() })
    expect(await screen.findByText('Customs Storage Entry 1042 created.')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Open' })).toBeNull()
    await waitFor(() => expect(createButton()).toHaveProperty('disabled', false))
    const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    fireEvent.click(createButton())
    await waitFor(() => expect(service.create).toHaveBeenCalledTimes(2))
  })

  it('CONTROL: actual beforeunload warns for a loaded dirty draft', async () => {
    page(); await ready()
    const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(await screen.findByRole('dialog', { name: 'Discard this entry?' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Keep editing' }))
    expect(screen.getByDisplayValue('SYN-PERMIT-5')).toBeTruthy()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('OBSERVATION: failed draft read silently shows select-an-Order, with no error or Retry', async () => {
    service.draft.mockRejectedValue(new TypeError('Synthetic failed admission data read'))
    page()
    await waitFor(() => expect(service.draft).toHaveBeenCalledWith('5'))
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveProperty('value', 'SYNTHETIC-5'))
    expect(await screen.findByText('Select an Order to see its admission and parties.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(createButton()).toHaveProperty('disabled', true)
  })

  it('OBSERVATION: transient preselection read error is presented as missing/inaccessible Order', async () => {
    service.orderCard.mockRejectedValue(new TypeError('Synthetic offline preselection'))
    page()
    expect(await screen.findByText('The Order you came from was not found or you cannot open it. Search for an Order.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
    expect(service.draft).not.toHaveBeenCalled()
  })

  it('CONTROL: switching Orders refreshes untouched prefill, keeps manual values across tabs and Greek locale', async () => {
    service.searchOrders.mockResolvedValue([candidate(6)])
    renderDetails(<><LocaleToggle /><CustomsStorageCreatePage initialPurchaseOrderId="5" /></>)
    await ready()
    fireEvent.change(screen.getByDisplayValue('SYN-PERMIT-5'), { target: { value: 'SYN-MANUAL-PERMIT' } })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'SYNTHETIC-6' } })
    fireEvent.click(await screen.findByRole('button', { name: /SYNTHETIC-6/ }))
    await screen.findByDisplayValue('Synthetic operator 6')
    expect(screen.getByDisplayValue('SYN-MANUAL-PERMIT')).toBeTruthy()
    expect(screen.getByDisplayValue('Synthetic address 6')).toBeTruthy()
    fireEvent.click(screen.getByRole('tab', { name: 'Related Supplier Invoices (0)' }))
    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }))
    fireEvent.click(screen.getByRole('button', { name: 'QA Greek' }))
    expect(screen.getByDisplayValue('SYN-MANUAL-PERMIT')).toBeTruthy()
    expect(screen.getByRole('combobox')).toHaveProperty('value', 'SYNTHETIC-6')
    expect(service.create).not.toHaveBeenCalled()
  })

  it('OBSERVATION: actual router internal navigation loses dirty draft without any leave warning', async () => {
    routerHarness.actual = true
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const beforeunload = vi.fn(); window.addEventListener('beforeunload', beforeunload)
    const root = createRootRoute({ component: () => <><Link to="/elsewhere">Synthetic sidebar destination</Link><Outlet /></> })
    const create = createRoute({ getParentRoute: () => root, path: '/create', component: () => <CustomsStorageCreatePage initialPurchaseOrderId="5" /> })
    const other = createRoute({ getParentRoute: () => root, path: '/elsewhere', component: () => <div>Synthetic other page</div> })
    const router = createRouter({ routeTree: root.addChildren([create, other]), history: createMemoryHistory({ initialEntries: ['/create'] }) })
    await router.load()
    renderDetails(<RouterProvider router={router} />)
    await ready()
    fireEvent.change(screen.getByDisplayValue('SYN-PERMIT-5'), { target: { value: 'SYN-UNSAVED-PERMIT' } })
    fireEvent.click(screen.getByRole('link', { name: 'Synthetic sidebar destination' }))
    expect(await screen.findByText('Synthetic other page')).toBeTruthy()
    expect(confirm).not.toHaveBeenCalled(); expect(beforeunload).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
    await act(async () => { await router.navigate({ to: '/create' }) })
    await ready()
    expect(screen.queryByDisplayValue('SYN-UNSAVED-PERMIT')).toBeNull()
    window.removeEventListener('beforeunload', beforeunload); confirm.mockRestore()
  })

  it('OBSERVATION: recovered background preselection read silently restores original Order after explicit replacement', async () => {
    service.searchOrders.mockResolvedValue([candidate(6)])
    service.create.mockResolvedValue({ id: 42, entryNumber: 1042 })
    const view = page(); await ready()
    fireEvent.change(screen.getByDisplayValue('SYN-PERMIT-5'), { target: { value: 'SYN-MANUAL-FOR-6' } })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'SYNTHETIC-6' } })
    fireEvent.click(await screen.findByRole('button', { name: /SYNTHETIC-6/ }))
    await screen.findByDisplayValue('Synthetic operator 6')
    // Control: a normal identical refetch does not retarget (React Query structural sharing).
    await act(async () => { await view.queryClient.refetchQueries({ queryKey: customsStorageKeys.orderCard('5') }) })
    expect(screen.getByRole('combobox')).toHaveProperty('value', 'SYNTHETIC-6')
    service.orderCard.mockRejectedValueOnce(new TypeError('Synthetic transient background error'))
    await act(async () => { await view.queryClient.refetchQueries({ queryKey: customsStorageKeys.orderCard('5') }) })
    await screen.findByText('The Order you came from was not found or you cannot open it. Search for an Order.')
    await act(async () => { await view.queryClient.refetchQueries({ queryKey: customsStorageKeys.orderCard('5') }) })
    await screen.findByDisplayValue('Synthetic operator 5')
    expect(screen.getByRole('combobox')).toHaveProperty('value', 'SYNTHETIC-5')
    expect(screen.getByDisplayValue('SYN-MANUAL-FOR-6')).toBeTruthy()
    await waitFor(() => expect(createButton()).toHaveProperty('disabled', false))
    fireEvent.click(createButton())
    await waitFor(() => expect(service.create).toHaveBeenCalled())
    expect(service.create.mock.calls[0][0]).toMatchObject({ purchaseOrderId: 5, permitNumber: 'SYN-MANUAL-FOR-6' })
  })
})
