import React, { type ReactNode } from 'react'
import { readFileSync } from 'node:fs'
import { print } from 'graphql'
import { QueryClient, QueryClientProvider, notifyManager } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LabelsProvider } from '#/app/providers/labels-provider'
import { ToastProvider } from '#/components/ui/toast'
import { GraphQLExecutor } from '#/lib/graphql'
import { Route } from '#/routes/secured/purchase-orders/index'
import { PURCHASE_ORDER_TABLE_COLUMN_IDS, PURCHASE_ORDER_TABLE_COLUMN_ORDER_STORAGE_KEY } from '#/features/purchase-orders/components/purchase-order-table-state'
import { tablePreferenceQueryKey } from '#/features/preferences/hooks/use-table-preference'
import { UserTableKey } from '#/features/preferences/types'

// Read-only observations of main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
// Real route component, table, controls, services and Query hooks. Router location is an
// in-memory adapter; GraphQL is the ONLY data boundary replaced. No backend/DB/deployment claim.
const routing = vi.hoisted(() => ({ search: {} as any, listeners: new Set<() => void>() }))
vi.mock('@tanstack/react-router', async () => {
  const React = await import('react')
  return {
    Link: ({ children }: { children: ReactNode }) => <a href="#audit">{children}</a>,
    createFileRoute: () => (options: any) => ({
      options, fullPath: '/secured/purchase-orders',
      useSearch: () => React.useSyncExternalStore(
        (listener) => { routing.listeners.add(listener); return () => { routing.listeners.delete(listener) } },
        () => routing.search,
      ),
    }),
    useNavigate: () => ({ search }: any) => {
      routing.search = typeof search === 'function' ? search(routing.search) : search
      routing.listeners.forEach((listener) => listener())
      return Promise.resolve()
    },
  }
})
vi.mock('#/features/auth/hooks/use-current-user-profile', () => ({
  useCurrentUserProfile: () => ({ data: { authorities: ['PURCHASE_ORDER_VIEW', 'PURCHASE_ORDER_EDIT'] } }),
}))

const sourceRoot = 'C:/Users/Giorgos/AppData/Local/Temp/frontline-audit-20261109-6aa2595/Frontline-Forwarding-frontline-forwarding-6aa259553cd9c86a8aaa157902088aa9a6bca83e'
const javaPreferencePolicy = readFileSync(`${sourceRoot}/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/preferences/PurchaseOrderTablePreferencePolicy.java`, 'utf8')
// Extract only the actual allowlist. The response adapter below is NOT execution of Java.
const serverColumns = ['CORE_COLUMNS', 'OPTIONAL_COLUMNS'].flatMap((name) =>
  [...javaPreferencePolicy.match(new RegExp(`${name} = List.of\\(([\\s\\S]*?)\\);`))![1].matchAll(/"([^"]+)"/g)].map((m) => m[1]),
)
function preference(input: any = {}) {
  return { tableKey: UserTableKey.PURCHASE_ORDER_LIST, persisted: true, configurationVersion: 1,
    columnOrder: [...PURCHASE_ORDER_TABLE_COLUMN_IDS], visibleOptionalColumns: [], grouping: 'NONE', ...input }
}
function deferred<T = any>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}
const company = (id: number) => ({ id, name: `Fixture client ${String(id).padStart(3, '0')}`, type: 'CLIENT', active: true,
  vessels: [{ id: id + 1000, name: `Fixture vessel ${id}`, companyId: id }], invoicingAssignments: [] })
const supplier = (id: number) => ({ id, name: `Fixture supplier ${String(id).padStart(3, '0')}`, type: 'SUPPLIER_COMPANY' })
const row = (id = 1, extra: any = {}) => ({ id, internalNumber: `PO-${id}`, status: 'PENDING', active: true,
  clientCompany: company(1), supplierCompany: supplier(1), vessel: null, currentWarehouseStay: null,
  createdAt: '2026-11-01T12:00:00Z', updatedAt: '2026-11-01T12:00:00Z', createdBy: { name: 'Fixture user' },
  handlingUnitCount: 0, nonterminalHandlingUnitCount: 0, ...extra })
const page = (content: any[] = [row()], index = 0, pages = 1) => ({ content, page: index, size: 20, totalPages: pages, totalElements: pages > 1 ? 21 : content.length })
let execute: any, blockedFetch: any, queryClient: QueryClient
let options: any, listHandler: (variables: any) => any, groupsHandler: (variables: any) => any
let saveHandler: (variables: any) => any, readPreference: any
const calls = (name: string) => execute.mock.calls.filter(([document]: any) => document.name === name)
const lastVariables = (name: string) => calls(name).at(-1)?.[1]

beforeEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem('frontline.locale', 'en')
  routing.listeners.clear()
  routing.search = (Route.options.validateSearch as any)({})
  notifyManager.setScheduler(queueMicrotask)
  blockedFetch = vi.fn(() => { throw new Error('AUDIT: outbound fetch blocked') })
  vi.stubGlobal('fetch', blockedFetch)
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('AUDIT: outbound XHR blocked') })
  options = { clients: { content: [company(1), company(2)] }, suppliers: { content: [supplier(1), supplier(2)] },
    warehouses: [{ id: 9, code: 'FIX', name: 'Fixture warehouse' }], countries: [] }
  listHandler = (variables) => page([row()], variables.page)
  groupsHandler = () => []
  saveHandler = ({ input }) => preference(input)
  readPreference = preference()
  execute = vi.spyOn(GraphQLExecutor, 'execute').mockImplementation(async (document: any, variables: any) => {
    if (document.name in options) return options[document.name]
    if (document.name === 'purchaseOrders') return listHandler(variables)
    if (document.name === 'purchaseOrderGroups') return groupsHandler(variables)
    if (document.name === 'tablePreference') return readPreference
    if (document.name === 'saveTablePreference') return saveHandler(variables)
    throw new Error(`Unexpected GraphQL operation: ${document.name}`)
  })
})
afterEach(() => {
  cleanup()
  queryClient?.clear()
  expect(blockedFetch).not.toHaveBeenCalled()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  notifyManager.setScheduler((callback) => setTimeout(callback, 0))
})

async function mount(search = {}, saved = preference(), cached = true) {
  routing.search = (Route.options.validateSearch as any)(search)
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity, gcTime: Infinity }, mutations: { retry: false } } })
  if (cached) queryClient.setQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST), saved)
  const Page = Route.options.component as React.ComponentType
  const view = render(<QueryClientProvider client={queryClient}><LabelsProvider><ToastProvider><Page /></ToastProvider></LabelsProvider></QueryClientProvider>)
  await screen.findByRole('combobox', { name: 'Group purchase orders' })
  return view
}
async function pick(label: string, name: string) {
  const control = await screen.findByRole('combobox', { name: label, exact: true })
  await act(async () => { fireEvent.click(control) })
  const option = await within(screen.getByRole('listbox')).findByRole('option', { name, exact: true })
  await act(async () => { fireEvent.click(option) })
}
function columns() { return screen.getAllByRole('columnheader').map((header) => header.textContent) }
function drag(from: string, to: string) {
  const dataTransfer = { setData: vi.fn(), effectAllowed: '', dropEffect: '' }
  fireEvent.dragStart(screen.getByTitle(`Move column: ${from}`), { dataTransfer })
  fireEvent.drop(screen.getByRole('columnheader', { name: to, exact: true }), { dataTransfer })
}
async function flush() { await act(async () => { for (let i = 0; i < 15; i++) await Promise.resolve() }) }

describe('Stock List filters QA — controls and bounded defect observations', () => {
  it('CONTROL: compound filters survive UI search and dropdown changes in list and group requests', async () => {
    await mount({ statuses: 'PENDING,READY', client: '1', vessel: '1001', warehouse: '9', readyInDays: 5, created: '2026-11-01', urgent: false, active: false, page: 3 })
    fireEvent.change(screen.getByRole('searchbox', { name: 'Purchase order' }), { target: { value: 'pArT' } })
    await pick('Supplier company', 'Fixture supplier 002')
    const expected = { search: 'pArT', statuses: ['PENDING', 'READY'], clientCompanyId: 1, supplierCompanyId: 2,
      vesselId: 1001, warehouseId: 9, readyInDays: 5, createdDate: '2026-11-01', urgent: false, active: false }
    await waitFor(() => expect(lastVariables('purchaseOrders')).toMatchObject({ filter: expected, page: 0 }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Group purchase orders' }), { target: { value: 'VESSEL' } })
    await waitFor(() => expect(lastVariables('purchaseOrderGroups')).toMatchObject({ filter: expected, grouping: 'VESSEL' }))
    expect(routing.search.groupPages).toEqual({})
  })

  it('CONTROL: per-group pagination keeps another group page and compound filters; sort resets pages', async () => {
    groupsHandler = () => [{ key: '1001', groupId: 1001, label: 'Group A', totalElements: 21 }, { key: '1002', groupId: 1002, label: 'Group B', totalElements: 21 }]
    listHandler = (v) => page([row(v.filter.vesselId === 1001 ? 10 + v.page : 20 + v.page)], v.page, 2)
    await mount({ q: 'part', urgent: false, groupPages: { 'VESSEL:1002': 1 } }, preference({ grouping: 'VESSEL' }))
    const a = await screen.findByRole('region', { name: 'Group A' })
    await waitFor(() => expect(within(a).getByRole('link', { name: 'PO-10' })).toBeTruthy())
    fireEvent.click(within(a).getByRole('button', { name: 'Next page' }))
    await within(a).findByRole('link', { name: 'PO-11' })
    expect(routing.search.groupPages).toEqual({ 'VESSEL:1001': 1, 'VESSEL:1002': 1 })
    expect(calls('purchaseOrders').some(([, v]: any) => v.filter.vesselId === 1001 && v.page === 1 && v.filter.search === 'part' && v.filter.urgent === false)).toBe(true)
    expect(within(screen.getByRole('region', { name: 'Group B' })).getByRole('link', { name: 'PO-21' })).toBeTruthy()
    fireEvent.click(within(a).getByRole('button', { name: 'Created', exact: true }))
    await waitFor(() => expect(routing.search.groupPages).toEqual({}))
    await within(a).findByRole('link', { name: 'PO-10' })
    expect(lastVariables('purchaseOrders').sort).toEqual({ field: 'CREATED_AT', direction: 'ASC' })
  })

  it('CONTROL: dropdown text contains matching is case insensitive; incompatible client clears its vessel', async () => {
    await mount({ client: '1', vessel: '1001' })
    await act(async () => { fireEvent.click(screen.getByRole('combobox', { name: 'Client company', exact: true })) })
    fireEvent.change(within(screen.getByRole('listbox')).getByRole('textbox'), { target: { value: 'ClIeNt 002' } })
    expect(screen.queryByRole('option', { name: 'Fixture client 001' })).toBeNull()
    fireEvent.click(screen.getByRole('option', { name: 'Fixture client 002' }))
    await waitFor(() => expect(lastVariables('purchaseOrders').filter).toMatchObject({ clientCompanyId: 2, vesselId: null }))
  })

  it('OBSERVATION F1: clearing Client to All also drops an independently selected compatible Vessel', async () => {
    await mount({ client: '1', vessel: '1001', q: 'owner' })
    await pick('Client company', 'All')
    await waitFor(() => expect(lastVariables('purchaseOrders').filter).toMatchObject({ clientCompanyId: null, vesselId: null, search: 'owner' }))
    expect((await screen.findByRole('combobox', { name: 'Vessel', exact: true })).textContent).toContain('All')
    expect(routing.search.vessel).toBe('')
  })

  it('OBSERVATION F2: first-100 company options make later clients, vessels and suppliers unselectable', async () => {
    options.clients.content = Array.from({ length: 100 }, (_, i) => company(i + 1))
    options.suppliers.content = Array.from({ length: 100 }, (_, i) => supplier(i + 1))
    listHandler = () => page([row(101, { clientCompany: company(101), supplierCompany: supplier(101), vessel: company(101).vessels[0] })])
    await mount()
    expect(screen.getByRole('cell', { name: 'Fixture client 101' })).toBeTruthy()
    for (const [label, query] of [['Client company', 'client 101'], ['Supplier company', 'supplier 101'], ['Vessel', 'vessel 101']]) {
      await act(async () => { fireEvent.click(screen.getByRole('combobox', { name: label, exact: true })) })
      fireEvent.change(within(screen.getByRole('listbox')).getByRole('textbox'), { target: { value: query } })
      expect(within(screen.getByRole('listbox')).queryAllByRole('option')).toHaveLength(0)
      expect(within(screen.getByRole('listbox')).getByText('No results')).toBeTruthy()
      await act(async () => { fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' }) })
    }
    expect(calls('clients')).toHaveLength(1)
    expect(calls('suppliers')).toHaveLength(1)
    const document = print(calls('clients')[0][0].gql)
    expect(document).toContain('clients: companies(filter: {type: "CLIENT"}, size: 100)')
    expect(document).toContain('suppliers: companies(filter: {type: "SUPPLIER_COMPANY"}, size: 100)')
    expect(document).not.toContain('totalPages')
    expect(document).not.toContain('$')
  })

  it('CONTROL: cold late preference load restores grouping, columns and visibility without a save', async () => {
    const read = deferred()
    readPreference = read.promise
    groupsHandler = () => [{ key: '1001', groupId: 1001, label: 'Group A', totalElements: 1 }]
    const ready = mount({}, preference(), false)
    await flush()
    const order = ['purchaseOrder', 'vessel', ...PURCHASE_ORDER_TABLE_COLUMN_IDS.filter((id) => id !== 'purchaseOrder' && id !== 'vessel')]
    await act(async () => read.resolve(preference({ grouping: 'VESSEL', columnOrder: order, visibleOptionalColumns: ['ownerReference'] })))
    await ready
    await screen.findByRole('columnheader', { name: 'Owner reference', exact: true })
    expect(columns().slice(0, 3)).toEqual(['Purchase order', 'Vessel', 'Status'])
    expect((screen.getByRole('combobox', { name: 'Group purchase orders' }) as HTMLSelectElement).value).toBe('VESSEL')
    expect(calls('saveTablePreference')).toHaveLength(0)
    expect(lastVariables('purchaseOrderGroups').grouping).toBe('VESSEL')
  })

  it('CONTROL: two submitted grouping saves serialize and only the latest response enters cache', async () => {
    const first = deferred(), second = deferred()
    let saves = 0
    saveHandler = () => ++saves === 1 ? first.promise : second.promise
    await mount()
    fireEvent.change(screen.getByRole('combobox', { name: 'Group purchase orders' }), { target: { value: 'VESSEL' } })
    await screen.findByRole('combobox', { name: 'Group purchase orders' })
    fireEvent.change(screen.getByRole('combobox', { name: 'Group purchase orders' }), { target: { value: 'WAREHOUSE' } })
    await flush()
    expect(calls('saveTablePreference')).toHaveLength(1)
    await act(async () => first.resolve(preference({ grouping: 'VESSEL' })))
    await waitFor(() => expect(calls('saveTablePreference')).toHaveLength(2))
    expect((screen.getByRole('combobox', { name: 'Group purchase orders' }) as HTMLSelectElement).value).toBe('WAREHOUSE')
    expect((queryClient.getQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST)) as any).grouping).toBe('NONE')
    await act(async () => second.resolve(preference({ grouping: 'WAREHOUSE' })))
    await waitFor(() => expect((queryClient.getQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST)) as any).grouping).toBe('WAREHOUSE'))
  })

  it('OBSERVATION F3: late grouping save erases a later column drag before its 400ms debounce', async () => {
    const save = deferred()
    saveHandler = () => save.promise
    groupsHandler = () => [{ key: '1001', groupId: 1001, label: 'Group A', totalElements: 1 }]
    await mount()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    fireEvent.change(screen.getByRole('combobox', { name: 'Group purchase orders' }), { target: { value: 'VESSEL' } })
    await flush()
    expect(screen.getByRole('columnheader', { name: 'Vessel', exact: true })).toBeTruthy()
    drag('Vessel', 'Status')
    expect(columns().slice(0, 3)).toEqual(['Purchase order', 'Vessel', 'Status'])
    const groupingInput = lastVariables('saveTablePreference').input
    await act(async () => save.resolve(preference(groupingInput)))
    await flush()
    expect(columns().slice(0, 3)).toEqual(['Purchase order', 'Status', 'Flags'])
    expect(JSON.parse(localStorage.getItem(PURCHASE_ORDER_TABLE_COLUMN_ORDER_STORAGE_KEY)!)).toEqual(groupingInput.columnOrder)
    await act(async () => { await vi.advanceTimersByTimeAsync(450) })
    expect(calls('saveTablePreference')).toHaveLength(1)
    expect((queryClient.getQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST)) as any).columnOrder).toEqual(groupingInput.columnOrder)
  })

  it('OBSERVATION F3b: older in-flight preference read replaces successfully saved grouping', async () => {
    await mount()
    const oldRead = deferred()
    readPreference = oldRead.promise
    let refetch!: Promise<void>
    await act(async () => {
      refetch = queryClient.refetchQueries({ queryKey: tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST) })
      await Promise.resolve()
    })
    expect(calls('tablePreference')).toHaveLength(1)
    fireEvent.change(screen.getByRole('combobox', { name: 'Group purchase orders' }), { target: { value: 'VESSEL' } })
    await waitFor(() => expect((queryClient.getQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST)) as any).grouping).toBe('VESSEL'))
    expect((await screen.findByRole('combobox', { name: 'Group purchase orders' }) as HTMLSelectElement).value).toBe('VESSEL')
    expect(lastVariables('saveTablePreference').input.grouping).toBe('VESSEL')
    await act(async () => { oldRead.resolve(preference({ grouping: 'NONE' })); await refetch })
    expect((screen.getByRole('combobox', { name: 'Group purchase orders' }) as HTMLSelectElement).value).toBe('NONE')
    expect((queryClient.getQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST)) as any).grouping).toBe('NONE')
    expect(calls('saveTablePreference')).toHaveLength(1)
  })

  it('CONTROL: ordinary column drag persists and reopens in saved order', async () => {
    await mount()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    drag('Vessel', 'Status')
    await act(async () => { await vi.advanceTimersByTimeAsync(400) })
    await flush()
    expect(lastVariables('saveTablePreference').input.columnOrder.slice(0, 3)).toEqual(['purchaseOrder', 'vessel', 'status'])
    const saved = queryClient.getQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST))
    expect((saved as any).columnOrder.slice(0, 3)).toEqual(['purchaseOrder', 'vessel', 'status'])
    cleanup()
    queryClient.clear()
    vi.useRealTimers()
    await mount({}, saved as any)
    expect(columns().slice(0, 3)).toEqual(['Purchase order', 'Vessel', 'Status'])
  })

  it('OBSERVATION F4: Flags position is discarded by the server allowlist and moves to the end', async () => {
    expect(serverColumns).not.toContain('flags')
    // Faithful isolated response for this allowlist case, not a Java/Spring execution.
    saveHandler = ({ input }) => preference({ ...input, columnOrder: input.columnOrder.filter((id: string) => serverColumns.includes(id)) })
    await mount()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    drag('Flags', 'Status')
    expect(columns().slice(0, 3)).toEqual(['Purchase order', 'Flags', 'Status'])
    await act(async () => { await vi.advanceTimersByTimeAsync(400) })
    await flush()
    expect(lastVariables('saveTablePreference').input.columnOrder.slice(0, 3)).toEqual(['purchaseOrder', 'flags', 'status'])
    expect((queryClient.getQueryData(tablePreferenceQueryKey(UserTableKey.PURCHASE_ORDER_LIST)) as any).columnOrder).not.toContain('flags')
    expect(columns().at(-1)).toBe('Flags')
    expect(JSON.parse(localStorage.getItem(PURCHASE_ORDER_TABLE_COLUMN_ORDER_STORAGE_KEY)!).at(-1)).toBe('flags')
  })

  it.each([false, true])('OBSERVATION F5: shrinking to one page strands an empty page with no paging controls (grouped=%s)', async (grouped) => {
    let shrunk = false
    groupsHandler = () => [{ key: '1001', groupId: 1001, label: 'Group A', totalElements: shrunk ? 20 : 21 }]
    // API lines 204-223 preserve requested page, count all matches, and use offset page*size.
    // This fixture models that response contract; no claim that a real record was changed.
    listHandler = (v) => ({ content: shrunk && v.page === 1 ? [] : [row(v.page === 1 ? 21 : 1)],
      page: v.page, size: 20, totalElements: shrunk ? 20 : 21, totalPages: shrunk ? 1 : 2 })
    await mount({}, preference({ grouping: grouped ? 'VESSEL' : 'NONE' }))
    await screen.findByRole('link', { name: 'PO-1', exact: true })
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByRole('link', { name: 'PO-21', exact: true })
    shrunk = true
    await act(async () => { await queryClient.invalidateQueries({ queryKey: ['purchase-orders'] }) })
    expect(screen.getByText('No results')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Previous page' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull()
    expect(lastVariables('purchaseOrders').page).toBe(1)
    expect(grouped ? routing.search.groupPages['VESSEL:1001'] : routing.search.page).toBe(1)
    const visiblePages = queryClient.getQueryCache().getAll().filter((q) => q.queryKey[0] === 'purchase-orders' && (q.state.data as any)?.page === 1)
    expect(visiblePages.some((q) => (q.state.data as any).totalPages === 1 && (q.state.data as any).content.length === 0)).toBe(true)
    // Working recovery control: changing sort resets the relevant page to zero.
    fireEvent.click(screen.getByRole('button', { name: 'Created', exact: true }))
    await screen.findByRole('link', { name: 'PO-1', exact: true })
    expect(lastVariables('purchaseOrders').page).toBe(0)
  })
})
