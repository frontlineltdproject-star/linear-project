import React, { useSyncExternalStore } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LabelsProvider } from '#/app/providers/labels-provider'
import { ToastProvider } from '#/components/ui/toast'
import { GraphQLExecutor } from '#/lib/graphql'
import { PurchaseOrderService } from '#/features/purchase-orders/services/purchase-order-service'
import { purchaseOrderKeys } from '#/features/purchase-orders/hooks/use-purchase-orders'
import { type PurchaseOrderSummary } from '#/features/purchase-orders/types'
import { PurchaseOrderTableGrouping, UserTableKey } from '#/features/preferences/types'
import {
  PURCHASE_ORDER_TABLE_COLUMN_IDS, purchaseOrderSelection, shipmentActionSelection,
  shipmentSelectionWarehouseId, togglePurchaseOrderPageSelection,
} from '#/features/purchase-orders/components/purchase-order-table-state'
import { UserAuthority } from '#/features/auth/types'
import { ShipmentService } from '#/features/shipments/services/shipment-service'
import { candidate, candidateUnit } from '#/features/shipments/components/creation/shipment-creation-fixtures.test-utils'
import { composerOptions } from '#/features/shipments/components/details/shipment-read-fixtures.test-utils'
import { createShipmentInput, revisionsOf } from '#/features/shipments/components/creation/shipment-creation-mapping'
import { emptyShipmentCreationDraft } from '#/features/shipments/components/creation/shipment-creation-types'
import { Route as OrdersRoute } from '#/routes/secured/purchase-orders/index'
import { Route as NewShipmentRoute } from '#/routes/secured/shipments/new'

// Read-only observation suite for authenticated source main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
// Real list route, table, toolbar, query hooks, shipment route/hook/form and mapping helpers.
// Router/history is a deterministic boundary double; service reads use fictional response fixtures.
// Every unapproved transport is blocked. Nothing invokes creation or persists domain state.
// Observation assertions describe defects in the pinned source, not corrected behavior.
const runtime = vi.hoisted(() => {
  const listeners = new Set<() => void>()
  const routes: Record<string, any> = {}
  const state = {
    snapshot: { path: '/secured/purchase-orders/', search: {} as any },
    routes,
    listeners,
    profile: { authorities: [] as string[] },
    preference: {} as any,
    formProps: null as any,
    preferenceSave: vi.fn(async () => undefined),
    navigate: vi.fn(),
    subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener) },
    getSnapshot() { return state.snapshot },
  }
  return state
})

vi.mock('@tanstack/react-router', async () => {
  const React = await import('react')
  const read = () => React.useSyncExternalStore(runtime.subscribe, runtime.getSnapshot)
  return {
    createFileRoute: (path: string) => (options: any) => {
      runtime.routes[path] = options
      return { options, fullPath: path, useSearch: () => read().search, useNavigate: () => runtime.navigate }
    },
    useNavigate: () => runtime.navigate,
    useBlocker: () => ({ status: 'idle' }),
    Link: ({ to, search, params: _params, children, ...props }: any) => (
      <a {...props} href={`${to}${search ? `?${new URLSearchParams(search)}` : ''}`}
        data-search={JSON.stringify(search)}
        onClick={(event) => { event.preventDefault(); runtime.navigate({ to, search }) }}>
        {children}
      </a>
    ),
  }
})
vi.mock('#/features/auth/hooks/use-current-user-profile', () => ({
  useCurrentUserProfile: () => ({ data: runtime.profile }),
}))
vi.mock('#/features/preferences/hooks/use-table-preference', () => ({
  useTablePreference: () => ({ data: runtime.preference }),
  useSaveTablePreference: () => ({ mutateAsync: runtime.preferenceSave }),
}))
vi.mock('#/features/locations/hooks/use-locations', () => ({
  useCountries: () => ({ data: [{ id: 1, name: 'Fictional country' }] }),
  useCities: () => ({ data: [{ id: 11, countryId: 1, name: 'Origin city' }, { id: 12, countryId: 1, name: 'Destination city' }] }),
}))
vi.mock('#/features/shipments/components/creation/shipment-creation-form', async (importOriginal) => {
  const real = await importOriginal<typeof import('#/features/shipments/components/creation/shipment-creation-form')>()
  return {
    ...real,
    ShipmentCreationForm: (props: any) => {
      runtime.formProps = props
      return <real.ShipmentCreationForm {...props} />
    },
  }
})

const LIST = '/secured/purchase-orders/'
const CREATE = '/secured/shipments/new'
let client: QueryClient
let pages: Record<number, PurchaseOrderSummary[]>
let candidatePage: any
let blockedFetch: ReturnType<typeof vi.fn>
let blockedXhr: ReturnType<typeof vi.spyOn>
let execute: ReturnType<typeof vi.spyOn>
let preview: ReturnType<typeof vi.spyOn>

const warehouse = (id = 31) => ({ id, code: `WH-${id}`, name: `Fictional warehouse ${id}` })
function order(id: number, overrides: Record<string, unknown> = {}): PurchaseOrderSummary {
  return {
    id, internalNumber: `PO-${id}`, rootPurchaseOrderId: id, parentPurchaseOrderId: null,
    splitLineageTag: null, status: 'IN_STOCK', active: true, urgent: false, hasDangerousGoods: false,
    clientCompany: { id: 2, name: 'Fictional client', type: 'CLIENT' }, supplierCompany: null,
    vessel: null, invoiceCompany: null, ownerReference: `FICTIONAL-${id}`, supplierReference: null,
    messageNumber: null, readinessDate: null, readinessRemark: null, urgentInformation: null,
    activeShipment: null, handlingUnitCount: 1, nonterminalHandlingUnitCount: 1,
    currentWarehouseStay: { id: id + 100, state: 'IN_STOCK', storagePosition: null, warehouse: warehouse() },
    createdAt: '2026-11-01T08:00:00Z', updatedAt: '2026-11-01T08:00:00Z',
    ...overrides,
  } as unknown as PurchaseOrderSummary
}
function candidateAtOrigin(id: number) {
  const read = candidate(id, [candidateUnit(id * 10 + 1)])
  return { ...read, purchaseOrder: { ...read.purchaseOrder,
    currentWarehouseStay: { ...read.purchaseOrder.currentWarehouseStay!, warehouse: warehouse() } } }
}
function listPage(page = 0) {
  return { content: pages[page] ?? [], page, size: 20, totalPages: Object.keys(pages).length,
    totalElements: Object.values(pages).flat().length }
}
const shipmentPage = (ids: number[]) => ({ content: ids.map(candidateAtOrigin), page: 0, size: 100,
  totalPages: 1, totalElements: ids.length })
function navigate(args: any) {
  const path = args.to ?? runtime.snapshot.path
  const search = typeof args.search === 'function' ? args.search(runtime.snapshot.search) : args.search ?? {}
  runtime.snapshot = { path, search: runtime.routes[path]?.validateSearch?.(search) ?? search }
  for (const listener of runtime.listeners) listener()
  return Promise.resolve()
}
function AuditRouter() {
  const { path } = useSyncExternalStore(runtime.subscribe, runtime.getSnapshot)
  const Component = runtime.routes[path]?.component
  return Component ? <Component key={path} /> : <div>Other screen</div>
}
function mount() {
  return render(<QueryClientProvider client={client}><LabelsProvider><ToastProvider>
    <AuditRouter />
  </ToastProvider></LabelsProvider></QueryClientProvider>)
}
const checkbox = (id: number) => screen.getByRole('checkbox', { name: `Select purchase order: PO-${id}` }) as HTMLInputElement
const select = (id: number) => fireEvent.click(checkbox(id))
const start = () => screen.queryByRole('link', { name: 'Start shipment' })
const handoff = () => JSON.parse(start()!.getAttribute('data-search')!)
async function openList() { mount(); await screen.findByRole('checkbox', { name: `Select purchase order: PO-${pages[0][0].id}` }) }
async function refreshList() {
  await act(async () => { await client.invalidateQueries({ queryKey: purchaseOrderKeys.all }) })
  await waitFor(() => expect(client.isFetching({ queryKey: purchaseOrderKeys.all })).toBe(0))
}
async function openCreation() {
  fireEvent.click(start()!)
  await waitFor(() => expect(runtime.formProps).not.toBeNull())
  await waitFor(() => expect(client.isFetching()).toBe(0))
}
function selectedCount(count: number) { expect(screen.getByText(`${count} selected purchase orders`)).toBeTruthy() }

beforeEach(() => {
  // Fake Date only; promise/query scheduling and DOM waits retain real timers.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 10, 9, 12))
  window.localStorage.clear()
  window.localStorage.setItem('frontline.locale', 'en')
  runtime.snapshot = { path: LIST, search: (OrdersRoute.options.validateSearch as any)({}) }
  runtime.formProps = null
  runtime.profile = { authorities: [UserAuthority.SHIPMENT_CREATE, UserAuthority.PURCHASE_ORDER_EDIT] }
  runtime.preference = { tableKey: UserTableKey.PURCHASE_ORDER_LIST, configurationVersion: 1,
    persisted: true, columnOrder: [...PURCHASE_ORDER_TABLE_COLUMN_IDS],
    visibleOptionalColumns: ['activeShipment', 'collis'], grouping: PurchaseOrderTableGrouping.NONE }
  runtime.preferenceSave.mockClear()
  runtime.navigate.mockReset().mockImplementation(navigate)
  client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } } })
  pages = { 0: [order(7), order(8)] }
  candidatePage = shipmentPage([7, 8])
  blockedFetch = vi.fn(() => { throw new Error('AUDIT: outbound fetch blocked') })
  vi.stubGlobal('fetch', blockedFetch)
  blockedXhr = vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('AUDIT: outbound XHR blocked') })
  execute = vi.spyOn(GraphQLExecutor, 'execute').mockImplementation(async (document: any) => {
    if (document.name === 'eligiblePurchaseOrdersForShipment') return candidatePage
    throw new Error(`AUDIT: unexpected GraphQL operation ${document.name}`)
  })
  vi.spyOn(PurchaseOrderService, 'list').mockImplementation(async (params) => listPage(params.page))
  vi.spyOn(PurchaseOrderService, 'groups').mockResolvedValue([])
  vi.spyOn(PurchaseOrderService, 'formOptions').mockResolvedValue({ clients: { content: [] }, suppliers: { content: [] }, warehouses: [], countries: [] } as any)
  preview = vi.spyOn(PurchaseOrderService, 'previewStockListPdf').mockResolvedValue(undefined)
  vi.spyOn(ShipmentService, 'options').mockResolvedValue(composerOptions)
  vi.spyOn(ShipmentService, 'destinationWarehouses').mockResolvedValue([])
  vi.spyOn(ShipmentService, 'arrivedSources').mockResolvedValue({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 })
})
afterEach(() => {
  cleanup()
  client.clear()
  expect(blockedFetch).not.toHaveBeenCalled()
  expect(blockedXhr).not.toHaveBeenCalled()
  expect(execute.mock.calls.every(([document]: any) => document.name === 'eligiblePurchaseOrdersForShipment')).toBe(true)
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Stock List selection: current-row snapshots and route handoff', () => {
  it.each([
    ['reserved on another shipment', { status: 'PREPARED_FOR_SHIPMENT', activeShipment: { id: 900, shipmentNumber: 'SHP-FICTIONAL' } }],
    // Backend recordTerminalDisposition cancels the Order when its last movable colli terminates.
    ['last colli terminated', { status: 'CANCELLED', completionOutcome: 'NO_MOVABLE_COLLIS', nonterminalHandlingUnitCount: 0 }],
    ['location unknown', { status: 'LOCATION_UNKNOWN', currentWarehouseStay: { id: 107, state: 'LOCATION_UNKNOWN', warehouse: warehouse() } }],
  ])('OBS-SL-SEL-1 refreshed %s keeps stale Start shipment eligibility', async (_label, change) => {
    await openList(); select(7); select(8)
    const original = handoff()
    pages[0] = [order(7, change), order(8)]
    await refreshList()
    await waitFor(() => expect(client.getQueriesData<any>({ queryKey: ['purchase-orders', 'list'] })[0][1].content[0]).toMatchObject(change))
    expect(shipmentSelectionWarehouseId(pages[0][0])).toBeNull()
    expect(shipmentActionSelection(pages[0].map(purchaseOrderSelection))).toBeNull()
    expect(checkbox(7).checked).toBe(true)
    selectedCount(2)
    expect(handoff()).toEqual(original)
    expect(handoff()).toEqual({ originWarehouseId: '31', purchaseOrderId: '', purchaseOrderIds: '7,8' })
    // Reselecting the exact same current row repairs only the local captured metadata.
    select(7); select(7)
    expect(start()).toBeNull()
    selectedCount(2)
  })

  it('OBS-SL-SEL-1 a refreshed warehouse move leaves the original origin in the outgoing link', async () => {
    await openList(); select(7); select(8)
    pages[0] = [order(7, { currentWarehouseStay: { id: 207, state: 'IN_STOCK', warehouse: warehouse(33) } }), order(8)]
    await refreshList()
    await waitFor(() => expect(checkbox(7).closest('tr')!.textContent).toContain('WH-33'))
    expect(shipmentSelectionWarehouseId(pages[0][0])).toBe('33')
    expect(shipmentActionSelection(pages[0].map(purchaseOrderSelection))).toBeNull()
    expect(handoff()).toEqual({ originWarehouseId: '31', purchaseOrderId: '', purchaseOrderIds: '7,8' })
  })

  it('OBS-SL-SEL-1 a newly eligible refreshed Order stays blocked until reticked', async () => {
    pages[0] = [order(7, { status: 'PENDING', currentWarehouseStay: { id: 107, state: 'EXPECTED', warehouse: warehouse() } }), order(8)]
    await openList(); select(7); select(8)
    expect(start()).toBeNull()
    pages[0] = [order(7, { status: 'READY', currentWarehouseStay: { id: 107, state: 'EXPECTED', warehouse: warehouse() } }), order(8)]
    await refreshList()
    expect(shipmentActionSelection(pages[0].map(purchaseOrderSelection))?.purchaseOrderIds).toEqual(['7', '8'])
    expect(start()).toBeNull()
    selectedCount(2)
    select(7); select(7)
    expect(handoff().purchaseOrderIds).toBe('8,7')
  })

  it('OBS-SL-SEL-1 local calendar rollover keeps yesterday eligible after a real list refresh', async () => {
    pages[0] = [order(7, { status: 'EXPECTED_READINESS', readinessDate: '2026-11-09',
      currentWarehouseStay: { id: 107, state: 'EXPECTED', warehouse: warehouse() } })]
    await openList(); select(7)
    expect(shipmentSelectionWarehouseId(pages[0][0])).toBe('31')
    vi.setSystemTime(new Date(2026, 10, 10, 0, 1))
    await refreshList()
    expect(shipmentSelectionWarehouseId(pages[0][0])).toBeNull()
    expect(handoff().purchaseOrderIds).toBe('7')
    select(7); select(7)
    expect(start()).toBeNull()
  })

  it('OBS-SL-SEL-1 off-page selection ignores a fresh cached page and remains stale when returning', async () => {
    pages = { 0: [order(7)], 1: [order(8)] }
    await openList(); select(7)
    const pageZeroKey = client.getQueryCache().findAll({ queryKey: ['purchase-orders', 'list'] })[0].queryKey
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByRole('checkbox', { name: 'Select purchase order: PO-8' }); select(8)
    pages[0] = [order(7, { status: 'PREPARED_FOR_SHIPMENT', activeShipment: { id: 900, shipmentNumber: 'SHP-FICTIONAL' } })]
    act(() => client.setQueryData(pageZeroKey, listPage(0)))
    expect(client.getQueryData<any>(pageZeroKey).content[0].status).toBe('PREPARED_FOR_SHIPMENT')
    expect(handoff().purchaseOrderIds).toBe('7,8')
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    await screen.findByText('SHP-FICTIONAL')
    expect(checkbox(7).checked).toBe(true)
    selectedCount(2)
    expect(handoff().purchaseOrderIds).toBe('7,8')
  })

  it('control: mixed warehouses/ineligible selection keeps Print exact and hides Start rather than filtering IDs', async () => {
    pages[0] = [order(7), order(8, { status: 'PENDING', currentWarehouseStay: { state: 'EXPECTED', warehouse: warehouse(33) } })]
    await openList(); select(7); select(8)
    expect(start()).toBeNull()
    selectedCount(2)
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Print stock list' })))
    expect(preview).toHaveBeenCalledExactlyOnceWith(['7', '8'])
  })

  it('control: shipment authority gates Start while preserving the exact printable selection', async () => {
    runtime.profile = { authorities: [UserAuthority.PURCHASE_ORDER_EDIT] }
    await openList(); select(7)
    expect(start()).toBeNull()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Print stock list' })))
    expect(preview).toHaveBeenCalledExactlyOnceWith(['7'])
  })

  it('control: page select/clear and indeterminate state preserve distinct off-page IDs', async () => {
    pages = { 0: [order(7), order(8)], 1: [order(9), order(10)] }
    await openList(); select(7)
    const header = () => screen.getByRole('checkbox', { name: 'Select all purchase orders on this page' }) as HTMLInputElement
    expect(header().indeterminate).toBe(true)
    fireEvent.click(header())
    selectedCount(2); expect(header().checked).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByRole('checkbox', { name: 'Select purchase order: PO-9' })
    expect(header().checked).toBe(false); expect(header().indeterminate).toBe(false)
    fireEvent.click(header()); selectedCount(4)
    expect(handoff().purchaseOrderIds).toBe('7,8,9,10')
    fireEvent.click(header()); selectedCount(2)
    expect(handoff().purchaseOrderIds).toBe('7,8')
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    await screen.findByRole('checkbox', { name: 'Select purchase order: PO-7' })
    expect(header().checked).toBe(true)
    fireEvent.click(header())
    expect(screen.queryByRole('button', { name: 'Print stock list' })).toBeNull()
  })

  it('control: selection persists through same-route search/sort changes and explicit clear empties it', async () => {
    await openList(); select(7)
    await act(async () => runtime.navigate({ search: (search: any) => ({ ...search, q: 'Fictional', sort: 'INTERNAL_NUMBER', direction: 'ASC' }) }))
    await waitFor(() => expect(client.isFetching()).toBe(0))
    expect(checkbox(7).checked).toBe(true); selectedCount(1)
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }))
    expect(checkbox(7).checked).toBe(false)
    expect(start()).toBeNull()
    expect(screen.queryByRole('button', { name: 'Print stock list' })).toBeNull()
  })

  it('control: grouping preserves selection and group headers only change their own loaded rows', async () => {
    vi.mocked(PurchaseOrderService.groups).mockResolvedValue([
      { key: '31', groupId: 31, code: 'WH-31', label: 'Fictional warehouse 31', totalElements: 2 },
      { key: '33', groupId: 33, code: 'WH-33', label: 'Fictional warehouse 33', totalElements: 1 },
    ] as any)
    vi.mocked(PurchaseOrderService.list).mockImplementation(async (params) => params.warehouseId
      ? { ...listPage(0), content: params.warehouseId === '31' ? [order(7), order(8)]
        : [order(9, { currentWarehouseStay: { id: 109, state: 'IN_STOCK', warehouse: warehouse(33) } })],
        totalPages: 1, totalElements: params.warehouseId === '31' ? 2 : 1 }
      : listPage(params.page))
    await openList(); select(7)
    fireEvent.change(screen.getByRole('combobox', { name: 'Group purchase orders' }), { target: { value: 'WAREHOUSE' } })
    await screen.findByRole('checkbox', { name: 'Select purchase order: PO-9' })
    selectedCount(1); expect(checkbox(7).checked).toBe(true)
    const headers = screen.getAllByRole('checkbox', { name: 'Select all purchase orders on this page' }) as HTMLInputElement[]
    expect(headers[0].indeterminate).toBe(true)
    fireEvent.click(headers[0]); selectedCount(2)
    fireEvent.click(headers[1]); selectedCount(3)
    expect(start()).toBeNull()
    fireEvent.click(headers[0]); selectedCount(1)
    expect(handoff()).toEqual({ originWarehouseId: '33', purchaseOrderId: '', purchaseOrderIds: '9' })
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Print stock list' })))
    expect(preview).toHaveBeenCalledExactlyOnceWith(['9'])
    fireEvent.change(screen.getByRole('combobox', { name: 'Group purchase orders' }), { target: { value: 'NONE' } })
    await screen.findByRole('checkbox', { name: 'Select purchase order: PO-7' })
    selectedCount(1); expect(checkbox(7).checked).toBe(false)
  })

  it('control: exact eligible IDs reach actual shipment route/hook/form; returning remounts with no selection', async () => {
    await openList(); select(8); select(7)
    expect(handoff()).toEqual({ originWarehouseId: '31', purchaseOrderId: '', purchaseOrderIds: '8,7' })
    await openCreation()
    expect(runtime.snapshot.path).toBe(CREATE)
    expect(runtime.formProps.initialDraft).toEqual({ originCountryId: '1', originCityId: '11', originWarehouseId: '31', selectedColliIds: ['71', '81'] })
    expect(execute).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ name: 'eligiblePurchaseOrdersForShipment' }), {
      originWarehouseId: 31, search: null, page: 0, size: 100, sort: { field: 'INTERNAL_NUMBER', direction: 'ASC' }, shipmentId: null,
    })
    await act(async () => runtime.navigate({ to: LIST }))
    await screen.findByRole('checkbox', { name: 'Select purchase order: PO-7' })
    expect(checkbox(7).checked).toBe(false); expect(checkbox(8).checked).toBe(false)
    expect(start()).toBeNull()
    expect(screen.queryByRole('button', { name: 'Print stock list' })).toBeNull()
  })

  it('OBS-SL-SEL-2 exact link IDs silently become a subset when an Order ceases to be a candidate', async () => {
    await openList(); select(7); select(8)
    pages[0] = [order(7), order(8, { status: 'PREPARED_FOR_SHIPMENT', activeShipment: { id: 900, shipmentNumber: 'SHP-FICTIONAL' } })]
    await refreshList()
    await screen.findByText('SHP-FICTIONAL')
    candidatePage = shipmentPage([7])
    expect(handoff().purchaseOrderIds).toBe('7,8')
    await openCreation()
    expect(runtime.snapshot.search.purchaseOrderIds).toBe('7,8')
    expect(runtime.formProps.initialDraft.selectedColliIds).toEqual(['71'])
    expect(runtime.formProps.options.orders.map((row: any) => row.id)).toEqual(['7'])
    expect(screen.queryByRole('alert')).toBeNull()
    // Pure projection only, never onCreate: demonstrates omitted identity in the would-be request.
    const input = createShipmentInput({ ...emptyShipmentCreationDraft, ...runtime.formProps.initialDraft,
      destinationCountryId: '1', destinationCityId: '12', destinationWarehouseId: '33' },
    runtime.formProps.options.orders, revisionsOf(candidatePage.content))
    expect(input.handlingUnitIds).toEqual([71])
    expect(input.reviewedOrders).toEqual([{ purchaseOrderId: 7, selectionRevision: 'rev-7' }])
  })

  it('OBS-SL-SEL-2 an eligible requested Order beyond the first 100 candidates is silently omitted', async () => {
    pages[0] = [order(7), order(999)]
    const firstPageIds = Array.from({ length: 100 }, (_, index) => index + 1)
    candidatePage = { ...shipmentPage(firstPageIds), totalElements: 101, totalPages: 2 }
    // Respect the actual request's INTERNAL_NUMBER ASC order; PO-999 sorts after the complete first page.
    candidatePage.content.sort((a: any, b: any) => a.purchaseOrder.internalNumber.localeCompare(b.purchaseOrder.internalNumber))
    expect(candidatePage.content.every((row: any) => row.purchaseOrder.internalNumber.localeCompare('PO-999') < 0)).toBe(true)
    await openList(); select(7); select(999)
    expect(shipmentActionSelection(pages[0].map(purchaseOrderSelection))?.purchaseOrderIds).toEqual(['7', '999'])
    expect(handoff().purchaseOrderIds).toBe('7,999')
    await openCreation()
    expect(runtime.formProps.initialDraft.selectedColliIds).toEqual(['71'])
    expect(runtime.formProps.options.orders).toHaveLength(100)
    expect(runtime.formProps.options.orders.some((row: any) => row.id === '999')).toBe(false)
    expect(execute).toHaveBeenCalledTimes(1)
    expect(execute.mock.calls[0][1]).toMatchObject({ page: 0, size: 100 })
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('control: page helper never refreshes existing metadata and never duplicates an already selected ID', () => {
    const old = purchaseOrderSelection(order(7))
    const current = purchaseOrderSelection(order(7, { status: 'PREPARED_FOR_SHIPMENT', activeShipment: { id: 900 } }))
    const result = togglePurchaseOrderPageSelection([old], [current, purchaseOrderSelection(order(8))])
    expect(result).toEqual([old, purchaseOrderSelection(order(8))])
    expect(new Set(result.map((row) => row.id)).size).toBe(2)
    expect(shipmentActionSelection(result)?.purchaseOrderIds).toEqual(['7', '8'])
  })
})
