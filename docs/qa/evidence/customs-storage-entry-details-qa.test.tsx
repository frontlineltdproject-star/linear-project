import React from 'react'
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { customsStorageKeys } from '#/features/customs-storage/hooks/use-customs-storage'
import { GraphQLExecutorError } from '#/lib/graphql/errors'
import type { CustomsStorageEntryRecord } from '#/features/customs-storage/services/customs-storage-service'
import { createRootRoute, createRoute, createRouter, createMemoryHistory, RouterProvider, Link, Outlet } from '@tanstack/react-router'

const navigate = vi.hoisted(() => vi.fn())
const routerHarness = vi.hoisted(() => ({ actual: false }))
const service = vi.hoisted(() => ({ entry: vi.fn(), update: vi.fn(), changeOrder: vi.fn(), searchOrders: vi.fn(), draft: vi.fn() }))
vi.mock('@tanstack/react-router', async (original) => {
  const actual = await original<typeof import('@tanstack/react-router')>()
  return { ...actual, useNavigate: () => routerHarness.actual ? actual.useNavigate() : navigate }
})
vi.mock('#/features/customs-storage/services/customs-storage-service', () => ({ CustomsStorageService: service }))
import { CustomsStorageDetailsPage } from '#/features/customs-storage/details/components/customs-storage-details-page'

// Synthetic data, actual page/cards/hooks/providers. Only service and navigation boundaries mocked.
const record: CustomsStorageEntryRecord = {
  id: 42, entryNumber: 1042, version: 3, entryAt: '2026-10-20T06:42:00Z',
  entryMrn: 'SYNTHETIC-MRN', entryMrnDate: null, tariffCode: '0084', goodsDescription: 'Synthetic machine parts',
  transportMeans: null, transportCompany: 'FRONT LINE Forwarding & Agency LTD.', permitNumber: 'SYNTHETIC-CS-1',
  operatorName: 'Synthetic operator', operatorVatNumber: '800000003', warehouseAddress: 'Synthetic street',
  owningOrder: { id: 5, stockId: 'SYN-0005', status: 'IN_STOCK', warehouse: { id: 2, code: 'SYN-A', name: 'Synthetic A' },
    admittedAt: '2026-10-20T06:00:00Z', admittedCollis: 3, grossWeightKg: '12.50', grossWeightUnknown: false,
    depositor: { id: 7, name: 'Synthetic invoicing', vatNumber: '800000002' }, depositorMissing: false,
    client: { id: 1, name: 'Synthetic client', vatNumber: null }, supplier: null, supplierMissing: true },
  invoices: [], totals: { netAmount: null, vatAmount: null, statisticalVat: null, currencyRuleFailed: false },
  export: null, active: true, createdBy: { id: 1, name: 'Synthetic staff' }, createdAt: '2026-10-20T07:00:00Z',
  updatedBy: { id: 1, name: 'Synthetic staff' }, updatedAt: '2026-10-20T07:00:00Z', capabilities: { canEdit: true },
}
const candidate = { id: 9, stockId: 'SYN-0009', status: 'IN_STOCK', clientName: 'Synthetic client', supplierName: null,
  eligibility: { eligible: true, reason: null, order: null, entry: null } }
const otherWarehouse = { id: 8, code: 'SYN-B', name: 'Synthetic B' }
const moved = { ...record, version: 4, owningOrder: { ...record.owningOrder, id: 9, stockId: 'SYN-0009', warehouse: otherWarehouse } }
function deferred<T>() { let resolve!: (value: T) => void; let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej }); return { promise, resolve, reject } }
const clients: ReturnType<typeof renderDetails>['queryClient'][] = []
beforeEach(() => {
  routerHarness.actual = false
  Object.values(service).forEach(fn => fn.mockReset()); navigate.mockReset()
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('REAL NETWORK FORBIDDEN') }))
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('REAL XHR FORBIDDEN') })
  service.entry.mockResolvedValue(record); service.searchOrders.mockResolvedValue([candidate])
  service.draft.mockResolvedValue({ order: { warehouse: otherWarehouse } })
})
afterEach(() => { cleanup(); clients.splice(0).forEach(client => client.clear()); localStorage.clear(); vi.unstubAllGlobals(); vi.restoreAllMocks() })
async function page(returnOrder: {id:string;stockId:string}|null=null) {
  const view = renderDetails(<CustomsStorageDetailsPage entryNumber="1042" returnOrder={returnOrder} />)
  clients.push(view.queryClient)
  await screen.findByRole('heading', { name: 'Customs Storage Entry 1042' }); return view
}
function editDetails() { fireEvent.click(screen.getAllByRole('button', {name:'Edit'})[1]) }
function changeGoods(value: string) { fireEvent.change(screen.getByRole('textbox', { name: /Goods description/ }), {target:{value}}) }
async function chooseOrder() {
  fireEvent.click(screen.getAllByRole('button', {name:'Edit'})[0])
  const search = screen.getByRole('combobox', {name:/Order/})
  fireEvent.change(search, {target:{value:'SYN-0009'}}); fireEvent.focus(search)
  fireEvent.click(await within(await screen.findByRole('listbox')).findByText('SYN-0009'))
}
async function openConfirmation() { fireEvent.click(screen.getByRole('button', {name:'Save'})); return await screen.findByRole('dialog') }
const failureText = 'Changes could not be saved. Nothing changed. Your edits are kept.'

describe('CSE Details isolated controls and defect observations', () => {
  it('CONTROL unchanged baseline sends only locally changed field, and explicit blank clears optional value', async () => {
    service.update.mockResolvedValue({...record,version:4,goodsDescription:null})
    await page(); editDetails(); changeGoods(''); fireEvent.click(screen.getByRole('button',{name:'Save'}))
    await screen.findByText('Changes saved.')
    expect(service.update).toHaveBeenCalledExactlyOnceWith('42',{expectedVersion:3,goodsDescription:null})
  })
  it('OBSERVATION background refetch advances version and reverts another editors field that this user never changed', async () => {
    const view=await page(); editDetails(); changeGoods('My synthetic correction')
    service.entry.mockResolvedValue({...record,version:4,operatorName:'Other operator correction',
      owningOrder:{...record.owningOrder,client:{...record.owningOrder.client,name:'Synthetic refreshed client'}}})
    await act(async()=>{ await view.queryClient.refetchQueries({queryKey:customsStorageKeys.entry('1042')}) })
    await screen.findByText('Synthetic refreshed client')
    // The new operator value is NOT shown in the open editable form.
    expect(screen.getByDisplayValue('Synthetic operator')).toBeTruthy()
    service.update.mockResolvedValue({...record,version:5,goodsDescription:'My synthetic correction'})
    fireEvent.click(screen.getByRole('button',{name:'Save'})); await screen.findByText('Changes saved.')
    expect(service.update).toHaveBeenCalledExactlyOnceWith('42',{
      expectedVersion:4,goodsDescription:'My synthetic correction',operatorName:'Synthetic operator',
    })
  })
  it('CONTROL stale rejection preserves draft and offers explicit Refresh', async () => {
    service.update.mockRejectedValue(new GraphQLExecutorError('stale',{cause:null,messages:['stale'],classifications:['CONFLICT']}))
    await page(); editDetails(); changeGoods('My synthetic correction'); fireEvent.click(screen.getByRole('button',{name:'Save'}))
    expect(await screen.findByText(/This entry changed since you opened it/)).toBeTruthy()
    expect(screen.getByDisplayValue('My synthetic correction')).toBeTruthy()
    expect(screen.getByRole('button',{name:'Refresh'})).toBeTruthy()
  })
  it('OBSERVATION edits typed while a save is pending disappear when the earlier payload succeeds', async () => {
    const pending=deferred<CustomsStorageEntryRecord>(); service.update.mockReturnValue(pending.promise)
    await page(); editDetails(); changeGoods('First submitted correction'); fireEvent.click(screen.getByRole('button',{name:'Save'}))
    const field=screen.getByRole('textbox',{name:/Goods description/}) as HTMLTextAreaElement
    expect(field.disabled).toBe(false)
    expect((screen.getByRole('button',{name:'Saving…'}) as HTMLButtonElement).disabled).toBe(true)
    changeGoods('Later unsaved correction'); expect(screen.getByDisplayValue('Later unsaved correction')).toBeTruthy()
    await act(async()=>pending.resolve({...record,version:4,goodsDescription:'First submitted correction'}))
    await screen.findByText('Changes saved.')
    expect(screen.queryByDisplayValue('Later unsaved correction')).toBeNull()
    expect(screen.getByText('First submitted correction')).toBeTruthy(); expect(service.update).toHaveBeenCalledTimes(1)
  })
  it('OBSERVATION cancel then start another edit during pending save loses the new draft on old success', async () => {
    const pending=deferred<CustomsStorageEntryRecord>(); service.update.mockReturnValue(pending.promise)
    await page(); editDetails(); changeGoods('First submitted correction'); fireEvent.click(screen.getByRole('button',{name:'Save'}))
    expect((screen.getByRole('button',{name:'Cancel'}) as HTMLButtonElement).disabled).toBe(false)
    fireEvent.click(screen.getByRole('button',{name:'Cancel'})); editDetails(); changeGoods('Second editor draft')
    await act(async()=>pending.resolve({...record,version:4,goodsDescription:'First submitted correction'}))
    await screen.findByText('Changes saved.'); expect(screen.queryByDisplayValue('Second editor draft')).toBeNull()
  })
  it('OBSERVATION unknown update outcome claims Nothing changed and performs no reconciliation read', async () => {
    service.update.mockImplementation(async()=>{
      service.entry.mockResolvedValue({...record,version:4,goodsDescription:'Committed correction'})
      throw new TypeError('Synthetic response lost after server commit')
    })
    await page(); editDetails(); changeGoods('Committed correction'); fireEvent.click(screen.getByRole('button',{name:'Save'}))
    expect(await screen.findByText(failureText)).toBeTruthy()
    expect(service.entry).toHaveBeenCalledTimes(1)
    expect(screen.getByDisplayValue('Committed correction')).toBeTruthy()
    expect(screen.queryByRole('button',{name:'Refresh'})).toBeNull()
  })
  it('OBSERVATION Change Order confirms while target warehouse is still loading and permanently misses review warning', async () => {
    const pending=deferred<any>(); service.draft.mockReturnValue(pending.promise); service.changeOrder.mockResolvedValue(moved)
    await page(); await chooseOrder(); await waitFor(()=>expect(service.draft).toHaveBeenCalledWith('9'))
    const dialog=await openConfirmation()
    expect(within(dialog).queryByText(/was admitted at/)).toBeNull()
    fireEvent.click(within(dialog).getByRole('button',{name:'Confirm change'}))
    await screen.findByText('Order changed to SYN-0009.')
    expect(screen.queryByText(/Warehouse operator values were kept/)).toBeNull()
    await act(async()=>pending.resolve({order:{warehouse:otherWarehouse}}))
    expect(screen.queryByText(/Warehouse operator values were kept/)).toBeNull()
    expect(service.changeOrder).toHaveBeenCalledExactlyOnceWith('42',{expectedVersion:3,purchaseOrderId:9})
  })
  it('CONTROL resolved target warehouse warns before and after Change Order and retains entry owned values', async () => {
    service.changeOrder.mockResolvedValue(moved); await page(); await chooseOrder()
    await waitFor(()=>expect(service.draft).toHaveBeenCalledWith('9'))
    const dialog=await openConfirmation()
    expect(await within(dialog).findByText(/was admitted at SYN-B/)).toBeTruthy()
    fireEvent.click(within(dialog).getByRole('button',{name:'Confirm change'}))
    expect(await screen.findByText(/Warehouse operator values were kept/)).toBeTruthy()
    expect(screen.getByRole('heading',{name:'Customs Storage Entry 1042'})).toBeTruthy()
    expect(screen.getByText('Synthetic operator')).toBeTruthy()
  })
  it('OBSERVATION Change Order modal silently advances expectedVersion after another user moves the entry', async () => {
    const view=await page(); await chooseOrder(); const dialog=await openConfirmation()
    service.entry.mockResolvedValue({...record,version:4,owningOrder:{...record.owningOrder,id:12,stockId:'SYN-0012'}})
    await act(async()=>view.queryClient.refetchQueries({queryKey:customsStorageKeys.entry('1042')}))
    await screen.findByText(/^Order SYN-0012/)
    service.changeOrder.mockResolvedValue({...moved,version:5})
    fireEvent.click(within(dialog).getByRole('button',{name:'Confirm change'})); await screen.findByText('Order changed to SYN-0009.')
    expect(service.changeOrder).toHaveBeenCalledExactlyOnceWith('42',{expectedVersion:4,purchaseOrderId:9})
  })
  it('OBSERVATION unknown Change Order outcome falsely says Nothing changed without resolving current owner', async () => {
    service.changeOrder.mockImplementation(async()=>{service.entry.mockResolvedValue(moved); throw new TypeError('Synthetic lost response')})
    await page(); await chooseOrder(); const dialog=await openConfirmation()
    fireEvent.click(within(dialog).getByRole('button',{name:'Confirm change'}))
    expect(await screen.findByText(failureText)).toBeTruthy(); expect(service.entry).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('combobox',{name:/Order/}).getAttribute('value')).toBe('SYN-0009')
  })
  it('OBSERVATION changing away from the originating owner falsely labels that former owner a covered child', async () => {
    service.changeOrder.mockResolvedValue(moved); await page({id:'5',stockId:'SYN-0005'})
    expect(screen.queryByText(/covered by this entry/)).toBeNull()
    await chooseOrder(); const dialog=await openConfirmation()
    fireEvent.click(within(dialog).getByRole('button',{name:'Confirm change'})); await screen.findByText('Order changed to SYN-0009.')
    expect(screen.getByText('Opened from Order SYN-0005, which is covered by this entry (split after admission). The entry belongs to Order SYN-0009.')).toBeTruthy()
    expect(screen.getByRole('link',{name:'Back to Order SYN-0005'})).toBeTruthy()
  })
  it('CONTROL dirty Back prompts and Keep editing preserves draft; Cancel restores saved value', async () => {
    await page({id:'5',stockId:'SYN-0005'}); editDetails(); changeGoods('Unsaved correction')
    fireEvent.click(screen.getByRole('link',{name:'Back to Order SYN-0005'}))
    const dialog=await screen.findByRole('dialog',{name:'Discard your changes?'})
    fireEvent.click(within(dialog).getByRole('button',{name:'Keep editing'}))
    expect(screen.getByDisplayValue('Unsaved correction')).toBeTruthy(); expect(navigate).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button',{name:'Cancel'})); expect(screen.getByText('Synthetic machine parts')).toBeTruthy()
  })
  it('OBSERVATION actual router internal navigation drops changed Details draft without leave protection', async () => {
    routerHarness.actual = true
    const confirm = vi.spyOn(window,'confirm').mockReturnValue(false)
    const beforeunload = vi.fn(); window.addEventListener('beforeunload',beforeunload)
    const root = createRootRoute({component:()=> <><Link to="/elsewhere">Synthetic sidebar destination</Link><Outlet /></>})
    const details = createRoute({getParentRoute:()=>root,path:'/details',component:()=> <CustomsStorageDetailsPage entryNumber="1042" returnOrder={{id:'5',stockId:'SYN-0005'}} />})
    const other = createRoute({getParentRoute:()=>root,path:'/elsewhere',component:()=> <div>Synthetic other page</div>})
    const router = createRouter({routeTree:root.addChildren([details,other]),history:createMemoryHistory({initialEntries:['/details']})})
    await router.load(); const view=renderDetails(<RouterProvider router={router}/>); clients.push(view.queryClient)
    await screen.findByRole('heading',{name:'Customs Storage Entry 1042'}); editDetails(); changeGoods('Unsaved SPA correction')
    fireEvent.click(screen.getByRole('link',{name:'Synthetic sidebar destination'}))
    expect(await screen.findByText('Synthetic other page')).toBeTruthy()
    expect(confirm).not.toHaveBeenCalled(); expect(beforeunload).not.toHaveBeenCalled(); expect(screen.queryByRole('dialog')).toBeNull()
    await act(async()=>router.navigate({to:'/details'}))
    await screen.findByRole('heading',{name:'Customs Storage Entry 1042'})
    expect(screen.queryByDisplayValue('Unsaved SPA correction')).toBeNull()
    expect(screen.getByText('Synthetic machine parts')).toBeTruthy()
    window.removeEventListener('beforeunload',beforeunload)
  })
})
