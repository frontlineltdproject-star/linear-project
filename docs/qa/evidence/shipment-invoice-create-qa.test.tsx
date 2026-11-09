/**
 * Shipment Invoice creation audit evidence, main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
 * Real integrated CreatePage + CreateForm + mapping; only service/router/query-provider boundaries mocked.
 * All records are synthetic. fetch and XMLHttpRequest are blocked. No server or database is exercised.
 * Defect probes assert observed current behavior, so passing means reproduction, not acceptance.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ShipmentInvoiceCreatePage } from './src/features/shipment-invoices/create/shipment-invoice-create-page'
import { ShipmentInvoiceCreateForm } from './src/features/shipment-invoices/components/shipment-invoice-create-form'
import { goodsPresentation } from './src/features/shipment-invoices/shipment-invoice-mapping'
import type { ShipmentInvoiceGoodsFieldsFragment, ShipmentInvoiceEvaluationFieldsFragment } from './src/graphql/generated/graphql'

const boundary = vi.hoisted(() => ({
  create: vi.fn(), goods: vi.fn(), evaluate: vi.fn(), searchShipments: vi.fn(),
  navigate: vi.fn(), invalidateQueries: vi.fn(), blocker: null as any,
  router: { history: { back: vi.fn() }, buildLocation: vi.fn(() => ({ href: '/synthetic-allocation' })) },
}))
vi.mock('./src/features/shipment-invoices/services/shipment-invoice-service', () => ({ ShipmentInvoiceService: boundary }))
vi.mock('./src/features/purchase-orders/hooks/use-purchase-orders', () => ({ usePurchaseOrderFormOptions: () => ({ data: { countries: [{currencyCode: 'EUR'}, {currencyCode: 'USD'}] } }) }))
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  useNavigate: () => boundary.navigate,
  useRouter: () => boundary.router,
  useBlocker: (options: any) => { boundary.blocker = options },
}))
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<any>()), useQueryClient: () => ({ invalidateQueries: boundary.invalidateQueries }),
}))

const fixture = (): ShipmentInvoiceGoodsFieldsFragment => ({
  shipment: { id: 7, shipmentNumber: 'SYN-SH-7', status: 'PREPARING', originCity: null, originCountry: null, destinationCity: null, destinationCountry: null },
  clients: [{ id: 2, name: 'Synthetic client', invoicingCompanies: [{ id: 9, name: 'Synthetic company', shipperText: 'SYNTHETIC SHIPPER' }] }],
  defaultClientCompanyId: 2, defaultShipperText: 'SYNTHETIC DEFAULT',
  orders: [{ id: 40, internalNumber: 'SYN-PO-40', client: { id: 2, name: 'Synthetic client' }, supplier: null, messageNumber: null, status: 'PREPARED_FOR_SHIPMENT', rows: [
    { invoiceRowId: 100, purchaseOrderId: 40, sourcePurchaseOrderId: 40, sourceLineNumber: 1, lineNumber: 1, description: 'Synthetic valve', hsCode: null, quantity: 1, unit: 'PC', unitPrice: '10.00', lineAmount: { amount: '10.00', currency: 'EUR' }, allocationState: 'COLLI', eligible: true, awaitingReason: null, otherInvoices: [] },
    { invoiceRowId: 101, purchaseOrderId: 40, sourcePurchaseOrderId: 40, sourceLineNumber: 2, lineNumber: 2, description: 'Synthetic gasket', hsCode: null, quantity: 2, unit: 'PC', unitPrice: '5.00', lineAmount: { amount: '10.00', currency: 'EUR' }, allocationState: 'COLLI', eligible: true, awaitingReason: null, otherInvoices: [] },
    { invoiceRowId: 102, purchaseOrderId: 40, sourcePurchaseOrderId: 40, sourceLineNumber: 3, lineNumber: 3, description: 'Synthetic awaiting', hsCode: null, quantity: 1, unit: 'PC', unitPrice: '3.00', lineAmount: { amount: '3.00', currency: 'EUR' }, allocationState: 'UNKNOWN', eligible: false, awaitingReason: 'COLLI_UNKNOWN', otherInvoices: [] },
  ] }],
})
const evaluation = (overrides: Partial<ShipmentInvoiceEvaluationFieldsFragment> = {}): ShipmentInvoiceEvaluationFieldsFragment => ({
  fullTotal: { amount: '0.00', currency: 'EUR' }, currencies: ['EUR'], mixedCurrency: false,
  unavailableInvoiceRowIds: [], deletedRowCount: 0, otherInvoices: [], missing: ['ROWS'], finalizable: false, fingerprint: 'synthetic', ...overrides,
})
const button = () => screen.getByRole('button', {name: 'Create draft'}) as HTMLButtonElement
const ready = async () => waitFor(() => expect(button().disabled).toBe(false))
const notes = () => screen.getByLabelText('Notes') as HTMLTextAreaElement
const editNotes = (text: string) => fireEvent.change(notes(), { target: { value: text } })
const chooseRow = () => fireEvent.click(screen.getByLabelText('SYN-PO-40 Synthetic valve'))
const deferred = <T,>() => { let resolve!: (value: T) => void; let reject!: (reason: unknown) => void; const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }
let forbiddenFetch: ReturnType<typeof vi.fn>
let forbiddenXHR: ReturnType<typeof vi.fn>
beforeEach(() => {
  vi.clearAllMocks()
  boundary.create.mockReset().mockResolvedValue({id: 901})
  boundary.goods.mockReset().mockResolvedValue(fixture())
  boundary.evaluate.mockReset().mockImplementation(async (input: any) => evaluation({fullTotal: { amount: input.invoiceRowIds.length ? '10.00' : '0.00', currency: 'EUR' }}))
  boundary.searchShipments.mockReset().mockResolvedValue([{id: 7, shipmentNumber: 'SYN-SH-7', status: 'PREPARING'}])
  boundary.navigate.mockReset().mockResolvedValue(undefined)
  boundary.invalidateQueries.mockReset().mockResolvedValue(undefined)
  boundary.blocker = null
  forbiddenFetch = vi.fn(() => { throw new Error('Native fetch forbidden in read-only audit') })
  forbiddenXHR = vi.fn(function () { throw new Error('Native XHR forbidden in read-only audit') })
  vi.stubGlobal('fetch', forbiddenFetch)
  vi.stubGlobal('XMLHttpRequest', forbiddenXHR)
})
afterEach(() => {
  cleanup()
  expect(forbiddenFetch).not.toHaveBeenCalled()
  expect(forbiddenXHR).not.toHaveBeenCalled()
  vi.unstubAllGlobals()
})

describe('integrated creation controls', () => {
  it.each(['PREPARING', 'DISPATCHED', 'ARRIVED'] as const)('SHI-002 control: accepts non-cancelled Shipment %s', async (status) => {
    const goods = fixture(); goods.shipment.status = status
    boundary.goods.mockResolvedValue(goods)
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready()
    expect(boundary.goods).toHaveBeenCalledWith('7')
  })
  it('SHI-002 control: cancelled Shipment presentation cannot enable creation', async () => {
    const goods = fixture(); goods.shipment.status = 'CANCELLED'
    boundary.goods.mockResolvedValue(goods)
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await screen.findByRole('button', {name: 'Retry'})
    expect(button().disabled).toBe(true)
    expect(boundary.evaluate).not.toHaveBeenCalled()
  })
  it('SHI-003 control: company prefill keeps manually edited Shipper after explicit keep decision', async () => {
    const goods = fixture()
    goods.clients[0].invoicingCompanies.push({id:10, name:'Other synthetic company', shipperText:'SECOND SYNTHETIC SHIPPER'})
    boundary.goods.mockResolvedValue(goods)
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); await ready()
    fireEvent.change(screen.getByLabelText('Invoicing company'), {target:{value:'9'}})
    expect((screen.getByLabelText('Shipper') as HTMLTextAreaElement).value).toBe('SYNTHETIC SHIPPER')
    fireEvent.change(screen.getByLabelText('Shipper'), {target:{value:'Edited synthetic shipper'}})
    fireEvent.change(screen.getByLabelText('Invoicing company'), {target:{value:'10'}})
    fireEvent.click(screen.getByRole('button', {name:'Keep my text'}))
    fireEvent.click(button())
    await waitFor(() => expect(boundary.create).toHaveBeenCalledTimes(1))
    expect(boundary.create.mock.calls[0][0]).toMatchObject({invoiceRowIds:[100], fields:{invoiceCompanyId:10, shipperText:'Edited synthetic shipper'}})
  })
  it('SHI-006 control: selected overlap is displayed but does not prohibit an intentional new draft', async () => {
    boundary.evaluate.mockImplementation(async (input: any) => evaluation({
      fullTotal:{amount:input.invoiceRowIds.length ? '10.00':'0.00', currency:'EUR'},
      otherInvoices:[{invoiceRowId:100, invoices:[{id:88, invoiceNumber:12, status:'FINALIZED'}]}],
    }))
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); await ready()
    expect(screen.getByText(/No\. 12/)).toBeTruthy()
    fireEvent.click(button())
    await waitFor(() => expect(boundary.create).toHaveBeenCalledTimes(1))
    expect(boundary.create.mock.calls[0][0].invoiceRowIds).toEqual([100])
  })
  it('SHI-010 control: creates an incomplete unnumbered draft and opens returned identity', async () => {
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready()
    expect((screen.getByLabelText('Commercial Client') as HTMLSelectElement).value).toBe('2')
    fireEvent.click(button())
    await waitFor(() => expect(boundary.navigate).toHaveBeenCalledWith({to: '/secured/shipment-invoices/$shipmentInvoiceId', params: {shipmentInvoiceId: '901'}}))
    expect(boundary.create.mock.calls[0][0]).toMatchObject({ shipmentId: 7, invoiceRowIds: [], fields: { clientCompanyId: 2, invoiceCompanyId: null, packingDetails: null, totalWeightKg: null, consigneeText: null } })
    expect(boundary.create.mock.calls[0][0]).not.toHaveProperty('invoiceNumber')
  })
  it('SHI-008 control: pending create blocks duplicate click and router departure, then allows saved navigation', async () => {
    const pending = deferred<{id: number}>()
    boundary.create.mockReturnValueOnce(pending.promise)
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); editNotes('Pending synthetic facts'); fireEvent.click(button()); fireEvent.click(button())
    expect(boundary.create).toHaveBeenCalledTimes(1)
    expect(notes().closest('fieldset')?.disabled).toBe(true)
    expect(boundary.blocker.shouldBlockFn({next: {pathname: '/elsewhere', search: {}}})).toBe(true)
    await act(async () => { pending.resolve({id: 901}); await pending.promise })
    await waitFor(() => expect(boundary.navigate).toHaveBeenCalledTimes(1))
    expect(boundary.blocker.shouldBlockFn({next: {pathname: '/secured/shipment-invoices/901', search: {}}})).toBe(false)
  })
  it('SHI-010 control: unchanged payload after lost answer reuses original request identity', async () => {
    boundary.create.mockRejectedValueOnce(new TypeError('Synthetic transport lost answer')).mockResolvedValueOnce({id: 901})
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); await ready(); editNotes('original payload'); fireEvent.click(button())
    await screen.findByText('Draft was not saved. Your work is retained.')
    fireEvent.click(button())
    await waitFor(() => expect(boundary.navigate).toHaveBeenCalledTimes(1))
    const [first, retry] = boundary.create.mock.calls.map(([input]) => input)
    expect(retry).toEqual(first)
  })
  it('SHI-007 control: refresh keeps fields, removes unavailable selections, updates values, and leaves new rows unselected', async () => {
    const refreshed = fixture()
    refreshed.orders[0].rows[0].eligible = false; refreshed.orders[0].rows[0].awaitingReason = 'COLLI_UNKNOWN'
    refreshed.orders[0].rows[1].lineAmount.amount = '25.00'
    refreshed.orders[0].rows.push({...refreshed.orders[0].rows[1], invoiceRowId: 103, description: 'Synthetic new row'})
    boundary.goods.mockResolvedValueOnce(fixture()).mockResolvedValueOnce(refreshed)
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); await ready(); editNotes('Preserve me')
    fireEvent.click(screen.getByRole('button', {name: 'Refresh eligibility'})); await ready()
    expect(notes().value).toBe('Preserve me')
    expect(screen.getByText(/40 \/ 100/)).toBeTruthy()
    expect((screen.getByLabelText('SYN-PO-40 Synthetic new row') as HTMLInputElement).checked).toBe(false)
    expect(screen.getAllByText('25.00').length).toBe(2)
    fireEvent.click(button()); await waitFor(() => expect(boundary.create).toHaveBeenCalledTimes(1))
    expect(boundary.create.mock.calls[0][0].invoiceRowIds).toEqual([])
  })
  it('SHI-004/005 control: Order selection sends only eligible source row IDs in source order; awaiting remains disabled', async () => {
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready()
    const awaiting = screen.getByRole('checkbox', {name: /Synthetic awaiting/}) as HTMLInputElement
    expect(awaiting.disabled).toBe(true)
    fireEvent.click(screen.getByRole('checkbox', {name: 'SYN-PO-40'})); await ready(); fireEvent.click(button())
    await waitFor(() => expect(boundary.create).toHaveBeenCalledTimes(1))
    expect(boundary.create.mock.calls[0][0].invoiceRowIds).toEqual([100, 101])
  })
  it('SHI-009 control: a delayed old evaluation cannot replace a newer mixed-currency result', async () => {
    const old = deferred<ShipmentInvoiceEvaluationFieldsFragment>()
    boundary.evaluate.mockResolvedValueOnce(evaluation()).mockReturnValueOnce(old.promise).mockResolvedValueOnce(evaluation({mixedCurrency: true, currencies:['EUR', 'USD']}))
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); fireEvent.click(screen.getByLabelText('SYN-PO-40 Synthetic gasket'))
    await screen.findByText(/Selected rows use different currencies/)
    await act(async () => { old.resolve(evaluation({fullTotal: {amount:'9999', currency:'EUR'}})); await old.promise })
    expect(button().disabled).toBe(true)
    expect(screen.queryByText('EUR 9,999.00')).toBeNull()
  })
  it('SHI-007 control: a failed goods refresh does not turn stale selection into an empty valid result', async () => {
    boundary.goods.mockResolvedValueOnce(fixture()).mockRejectedValueOnce(new Error('Synthetic failed read')).mockResolvedValueOnce(fixture())
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); await ready(); editNotes('Retained')
    fireEvent.click(screen.getByRole('button', {name: 'Refresh eligibility'}))
    await screen.findByRole('button', {name: 'Retry'})
    expect(button().disabled).toBe(true)
    expect((screen.getByLabelText('SYN-PO-40 Synthetic valve') as HTMLInputElement).checked).toBe(true)
    expect((screen.getByLabelText('SYN-PO-40 Synthetic valve') as HTMLInputElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', {name: 'Retry'})); await ready()
    expect(notes().value).toBe('Retained')
  })
})

describe('creation defect observations', () => {
  it('SHI-007 observed: refresh drops a still-eligible row when its offering Order changes', async () => {
    const refreshed = fixture()
    const stableRow = refreshed.orders[0].rows.shift()!
    refreshed.orders.push({...refreshed.orders[0], id:41, internalNumber:'SYN-PO-41', rows:[{...stableRow, purchaseOrderId:41}]})
    boundary.goods.mockResolvedValueOnce(fixture()).mockResolvedValueOnce(refreshed)
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); await ready(); editNotes('Preserved facts')
    fireEvent.click(screen.getByRole('button', {name:'Refresh eligibility'})); await ready()
    // The response says ID 100 is still eligible. Only its current/offer group changed.
    expect(refreshed.orders[1].rows[0]).toMatchObject({invoiceRowId:100, eligible:true})
    expect((screen.getByLabelText('SYN-PO-41 Synthetic valve') as HTMLInputElement).checked).toBe(false)
    expect(screen.getByText(/40 \/ 100/)).toBeTruthy()
    expect(notes().value).toBe('Preserved facts')
    fireEvent.click(button())
    await waitFor(() => expect(boundary.create).toHaveBeenCalledTimes(1))
    expect(boundary.create.mock.calls[0][0].invoiceRowIds).toEqual([])
  })
  it('SHI-008/010 observed: after lost answer an unchanged incomplete form can leave without reconciliation and remount uses a new key', async () => {
    boundary.create.mockRejectedValueOnce(new TypeError('Synthetic lost answer')).mockResolvedValueOnce({id:902})
    const firstMount = render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); fireEvent.click(button())
    await screen.findByText('Draft was not saved. Your work is retained.')
    expect(boundary.blocker.shouldBlockFn({next:{pathname:'/elsewhere', search:{}}})).toBe(false)
    const original = boundary.create.mock.calls[0][0]
    firstMount.unmount()
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); fireEvent.click(button())
    await waitFor(() => expect(boundary.create).toHaveBeenCalledTimes(2))
    const retry = boundary.create.mock.calls[1][0]
    expect(retry.requestId).not.toBe(original.requestId)
    expect({...retry, requestId:original.requestId}).toEqual(original)
  })
  it('SHI-008/010 observed: lost answer followed by edit submits another create request instead of reconciling original', async () => {
    // A synthetic service callback stores the first request then loses its response.
    // This demonstrates issued request identity, not a real backend/database write.
    const syntheticSaved = new Map<string, {id:number; notes: string}>()
    boundary.create.mockImplementation(async (input: any) => {
      const existing = syntheticSaved.get(input.requestId)
      if (existing) return existing
      const saved = { id: 900 + syntheticSaved.size + 1, notes: input.fields.notes }
      syntheticSaved.set(input.requestId, saved)
      if (syntheticSaved.size === 1) throw new TypeError('Synthetic lost response after server accepted request')
      return saved
    })
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); chooseRow(); await ready(); editNotes('First attempt'); fireEvent.click(button())
    await screen.findByText('Draft was not saved. Your work is retained.')
    expect(notes().closest('fieldset')?.disabled).toBe(false)
    editNotes('Corrected facts after claimed failure'); fireEvent.click(button())
    await waitFor(() => expect(boundary.create).toHaveBeenCalledTimes(2))
    const [first, second] = boundary.create.mock.calls.map(([input]) => input)
    expect(second.requestId).not.toBe(first.requestId)
    expect(second.shipmentId).toBe(first.shipmentId)
    expect(second.invoiceRowIds).toEqual(first.invoiceRowIds)
    expect(syntheticSaved.size).toBe(2)
    expect([...syntheticSaved.values()].map(x => x.notes)).toEqual(['First attempt','Corrected facts after claimed failure'])
    await waitFor(() => expect(boundary.navigate).toHaveBeenCalledWith({to:'/secured/shipment-invoices/$shipmentInvoiceId', params:{shipmentInvoiceId:'902'}}))
  })
  it('SHI-010 observed: asynchronous navigation rejection leaves a saved form locked without identity/retry recovery', async () => {
    const navigation = deferred<void>()
    // Test observer handles the rejected promise to avoid an unrelated test-runner unhandled rejection.
    // The same promise is returned by the mocked router; the host does not await/handle it.
    const observedRejection = navigation.promise.catch((error: Error) => error.message)
    boundary.navigate.mockReturnValue(navigation.promise)
    render(<ShipmentInvoiceCreatePage initialShipmentId="7" />)
    await ready(); fireEvent.click(button())
    await waitFor(() => expect(boundary.navigate).toHaveBeenCalledTimes(1))
    await act(async () => { navigation.reject(new Error('Synthetic router rejection')); await observedRejection })
    expect(await observedRejection).toBe('Synthetic router rejection')
    expect(boundary.create).toHaveBeenCalledTimes(1)
    expect(button().disabled).toBe(true)
    expect(notes().closest('fieldset')?.disabled).toBe(true)
    expect(screen.queryByRole('button', {name:'Open saved draft'})).toBeNull()
    expect(screen.queryByText(/saved.*navigation/i)).toBeNull()
    expect(screen.queryByText(/901/)).toBeNull()
  })
  it('SHI-010 control: synchronous onSaved throw exposes existing form recovery, isolating the host mismatch', async () => {
    const onSaved = vi.fn(() => { throw new Error('Synchronous callback rejection') })
    render(<ShipmentInvoiceCreateForm available todayAthens="2026-11-09" initialShipmentId="7" currencies={['EUR']}
      onLoadShipment={async () => goodsPresentation(fixture(), 'en')}
      onEvaluateSelection={async () => ({totalDisplay:'EUR 0.00', mixed:false, overlaps:[]})}
      onSubmit={async () => '901'} onSaved={onSaved} onCancel={() => {}} />)
    await ready(); fireEvent.click(button())
    expect(await screen.findByRole('button', {name:'Open saved draft'})).toBeTruthy()
    expect(screen.getByText(/901/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', {name:'Open saved draft'}))
    expect(onSaved).toHaveBeenCalledTimes(2)
  })
})
