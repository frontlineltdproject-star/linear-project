import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { DeliveryNotesCard } from '#/features/shipments/components/delivery-notes-card'
import { DeliveryNoteService } from '#/features/shipments/services/delivery-note-service'

// Observation tests: passing asserts the existing defect, not a fixed outcome.
// Real card, hooks, form, QueryClient, labels. Auth/service I/O are mocked.
vi.mock('#/features/auth/hooks/use-current-user-profile', () => ({
  useCurrentUserProfile: () => ({ isSuccess: true, data: { authorities: [
    'DELIVERY_NOTE_VIEW', 'DELIVERY_NOTE_CREATE', 'DELIVERY_NOTE_ISSUE', 'DELIVERY_NOTE_CANCEL',
  ] } }),
}))
const address = { street: 'Fixture street', number: '1', postalCode: '00001', city: 'Fixture city' }
function note(extra: Record<string, unknown> = {}) {
  return { id: 30, version: 1, shipmentId: 90, status: 'DRAFT', invoiceCompanyId: 2,
    series: 'QA', fiscalNumber: null, issuedAt: null, movementStartAt: '2026-11-10T10:00:00Z',
    vehicleNumber: 'SAVED', issuePlace: 'Piraeus', movementPurpose: 'SUPPLY_OF_SHIPS_AND_AIRCRAFT',
    otherMovementPurposeTitle: null, loadingAddress: address, destinationAddress: address,
    recipient: {name: 'Fixture A'}, notes: '', relatedDocumentNumber: '', totalCollis: 1,
    totalGrossWeightKg: 10, lines: [], ...extra } as any
}
let notes: any[]
let clients: any[] = []
let network: ReturnType<typeof vi.fn>
const key = ['shipments', '90', 'delivery-notes']
function deferred<T>() { let resolve!: (v:T)=>void; const promise=new Promise<T>(r=>resolve=r); return {promise,resolve} }
async function open() {
  const result = renderDetails(<DeliveryNotesCard shipmentId="90" />)
  clients.push(result.queryClient)
  await screen.findByText('Fixture A')
  return result
}
beforeEach(() => {
  localStorage.clear(); notes=[note()]
  network=vi.fn(()=>{throw new Error('QA: network forbidden')}); vi.stubGlobal('fetch',network)
  vi.spyOn(XMLHttpRequest.prototype,'open').mockImplementation(()=>{throw new Error('QA: XHR forbidden')})
  vi.spyOn(DeliveryNoteService,'list').mockImplementation(async()=>structuredClone(notes))
  vi.spyOn(DeliveryNoteService,'addressOptions').mockResolvedValue({loadingSources:[],destinationSources:[],representedClients:[]} as any)
  vi.spyOn(DeliveryNoteService,'update').mockRejectedValue(new Error('QA: unspecified save'))
  vi.spyOn(DeliveryNoteService,'create').mockRejectedValue(new Error('QA: unspecified prepare'))
  vi.spyOn(DeliveryNoteService,'issue').mockRejectedValue(new Error('QA: unspecified issue'))
  vi.spyOn(DeliveryNoteService,'cancelAndPrepareReplacement').mockRejectedValue(new Error('QA: unspecified cancel'))
  vi.spyOn(DeliveryNoteService,'previewPdf').mockResolvedValue(undefined)
})
afterEach(()=>{cleanup();clients.forEach(c=>c.clear());clients=[];expect(network).not.toHaveBeenCalled();vi.restoreAllMocks();vi.unstubAllGlobals()})
describe('Delivery Note isolated observations',()=>{
  it('DN-01: newer note version remounts the form and loses unsaved input',async()=>{
    const {queryClient}=await open()
    fireEvent.change(screen.getByDisplayValue('SAVED'),{target:{value:'LOCAL UNSAVED'}})
    expect(screen.getByDisplayValue('LOCAL UNSAVED')).toBeTruthy()
    notes=[note({version:2, vehicleNumber:'OTHER WRITER'})]
    await act(async()=>{await queryClient.invalidateQueries({queryKey:key})})
    await waitFor(()=>expect(screen.queryByDisplayValue('LOCAL UNSAVED')).toBeNull())
    expect(screen.getByDisplayValue('OTHER WRITER')).toBeTruthy()
    expect(DeliveryNoteService.update).not.toHaveBeenCalled()
  })
  it('control: identical-version refresh retains local input',async()=>{
    const {queryClient}=await open()
    fireEvent.change(screen.getByDisplayValue('SAVED'),{target:{value:'LOCAL UNSAVED'}})
    await act(async()=>{await queryClient.invalidateQueries({queryKey:key})})
    expect(screen.getByDisplayValue('LOCAL UNSAVED')).toBeTruthy()
  })
  it('DN-02: fresh replacement plus issued sibling has no edit/save and disabled issuance',async()=>{
    notes=[note({movementStartAt:null,vehicleNumber:null,destinationAddress:null}),note({id:31, status:'ISSUED',recipient:{name:'Fixture B'},fiscalNumber:8})]
    await open()
    expect(screen.queryByRole('textbox')).toBeNull()
    const buttons=screen.getAllByRole('button') as HTMLButtonElement[]
    const issue=buttons.find(b=>/Submit to|Issue delivery/i.test(b.textContent??''))
    expect(issue,buttons.map(b=>b.textContent).join('|')).toBeTruthy()
    expect(issue!.disabled).toBe(true)
    expect(buttons.some(b=>/Save Draft/i.test(b.textContent??''))).toBe(false)
  })
  it('DN-03: pending submission exposes no reconciliation action',async()=>{
    notes=[note({status:'SUBMISSION_PENDING',fiscalNumber:8})]
    await open()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(DeliveryNoteService.issue).not.toHaveBeenCalled()
  })
  it('DN-01: delayed successful save erases later typing accepted by the form',async()=>{
    const pending=deferred<any[]>()
    vi.mocked(DeliveryNoteService.update).mockImplementation(()=>pending.promise)
    await open()
    fireEvent.change(screen.getByDisplayValue('SAVED'),{target:{value:'SUBMITTED'}})
    const save=screen.getAllByRole('button').find(b=>/Save Draft/i.test(b.textContent??''))!
    expect(save).toBeTruthy(); fireEvent.click(save)
    await waitFor(()=>expect(DeliveryNoteService.update).toHaveBeenCalledTimes(1))
    const input=screen.getByDisplayValue('SUBMITTED') as HTMLInputElement
    expect(input.disabled).toBe(false)
    fireEvent.change(input,{target:{value:'LATER TYPING'}})
    notes=[note({version:2,vehicleNumber:'SUBMITTED'})]
    await act(async()=>{pending.resolve(notes)})
    await waitFor(()=>expect(screen.queryByDisplayValue('LATER TYPING')).toBeNull())
    expect(screen.getByDisplayValue('SUBMITTED')).toBeTruthy()
  })
})
