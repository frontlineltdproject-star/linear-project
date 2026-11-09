import type { ReactNode } from 'react'
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails, savedOrder } from './src/features/purchase-orders/components/details/test-support'
import { usePurchaseOrder } from './src/features/purchase-orders/hooks/use-purchase-orders'
import { OrderStatusCard } from './src/features/purchase-orders/components/details/order-status-card'
import { OrderCustomsStorageCard } from './src/features/customs-storage/order-card/order-customs-storage-card'
import { OrderDraftsProvider } from './src/features/purchase-orders/components/details/order-drafts'
import { customsStorageKeys } from './src/features/customs-storage/hooks/use-customs-storage'

const mock = vi.hoisted(() => ({ get: vi.fn(), orderCard: vi.fn(), execute: vi.fn(), canView: true }))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params }: { children: ReactNode; to: string; params?: Record<string,string> }) => <a href={Object.entries(params??{}).reduce((p,[k,v])=>p.replace('$'+k,v),to)}>{children}</a>,
  useBlocker: () => ({ status: 'idle' }),
}))
vi.mock('#/features/auth/hooks/use-has-authority', () => ({ useHasAuthority: () => mock.canView }))
vi.mock('#/features/purchase-orders/services/purchase-order-service', () => ({ PurchaseOrderService: { get: mock.get } }))
vi.mock('#/features/customs-storage/services/customs-storage-service', () => ({ CustomsStorageService: { orderCard: mock.orderCard } }))
vi.mock('#/lib/graphql', () => ({ GraphQLExecutor: { execute: mock.execute } }))

function Host() {
  const read=usePurchaseOrder('42')
  if (!read.data) return <p>Loading Order</p>
  return <OrderDraftsProvider><p data-testid="order-status">{read.data.status}</p><OrderStatusCard purchaseOrder={read.data}/><OrderCustomsStorageCard purchaseOrder={read.data}/></OrderDraftsProvider>
}
function cardRead(eligible: boolean) {
  return { id:42, internalNumber:'PO-0042', customsStorageEntry:null, customsStorageEntryCreation:{eligible,reason:eligible?null:'NOT_ADMITTED',order:null,entry:null} }
}
function readyOrder() {
  return savedOrder({status:'READY',pickupInGreece:true,customsRegime:'CUSTOMS_STORAGE',currentWarehouseStay:{id:7,state:'EXPECTED',warehouse:{id:1,code:'ATH',name:'Synthetic Athens warehouse'}},handlingUnits:[{id:101,trackingCode:'SYNTHETIC-101',terminalDisposition:null,declaredLengthCm:40,declaredWidthCm:30,declaredHeightCm:20,declaredGrossWeightKg:12,declaredNetWeightKg:11}]})
}
beforeEach(()=>{
  vi.clearAllMocks(); mock.canView=true
  vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Network forbidden')}))
  vi.stubGlobal('XMLHttpRequest',class{constructor(){throw new Error('Network forbidden')}})
})
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals()})

describe('CSE Order shortcut freshness: observations and controls',()=>{
  it('observation: actual stock confirmation refreshes the Order but leaves Entry Create disabled until separate CSE invalidation',async()=>{
    let admitted=false
    const before=readyOrder()
    mock.get.mockImplementation(async()=>admitted?savedOrder({...before,status:'IN_STOCK',version:8}):before)
    mock.orderCard.mockImplementation(async()=>cardRead(admitted))
    mock.execute.mockImplementation(async()=>{admitted=true;return {id:42,status:'IN_STOCK'}})
    const view=renderDetails(<Host/>)
    await screen.findByText('The Order has not been admitted to a Customs Storage warehouse yet.')
    const label='Record arrival and set PO in stock'
    fireEvent.click(screen.getByRole('button',{name:label}))
    fireEvent.change(screen.getByLabelText(/Storage position/),{target:{value:'SYNTHETIC-A-01'}})
    fireEvent.click(screen.getByRole('button',{name:label}))
    fireEvent.click(screen.getByRole('button',{name:'Confirm stock entry'}))
    await waitFor(()=>expect(screen.getByTestId('order-status').textContent).toBe('IN_STOCK'))
    expect(mock.execute).toHaveBeenCalledTimes(1)
    expect(mock.get.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(mock.orderCard).toHaveBeenCalledTimes(1)
    expect((screen.getByRole('button',{name:'Create Customs Storage Entry'}) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('The Order has not been admitted to a Customs Storage warehouse yet.')).toBeTruthy()
    // Control: data is available; the existing CSE hook displays it after its own invalidation.
    await act(async()=>{await view.queryClient.invalidateQueries({queryKey:customsStorageKeys.all})})
    expect(await screen.findByRole('link',{name:'Create Customs Storage Entry'})).toBeTruthy()
    expect(mock.orderCard).toHaveBeenCalledTimes(2)
  })

  it('control: no view authority renders no card and makes no entry request',()=>{
    mock.canView=false
    const view=renderDetails(<OrderCustomsStorageCard purchaseOrder={readyOrder()}/>)
    expect(view.container.textContent).toBe('')
    expect(mock.orderCard).not.toHaveBeenCalled()
  })

  it('control: inherited existing entry takes precedence over a cancelled reason',async()=>{
    mock.orderCard.mockResolvedValue({...cardRead(false),customsStorageEntry:{entry:{id:7,entryNumber:1042},owningOrder:{id:40,stockId:'PO-0040'},access:'INHERITED'},customsStorageEntryCreation:{eligible:false,reason:'CANCELLED',order:null,entry:null}})
    renderDetails(<OrderCustomsStorageCard purchaseOrder={savedOrder({status:'CANCELLED'})}/>)
    expect(await screen.findByRole('link',{name:'Open Customs Storage Entry'})).toBeTruthy()
    expect(screen.getByRole('link',{name:'PO-0040'})).toBeTruthy()
    expect(screen.queryByText('This Order is cancelled.')).toBeNull()
  })
})
