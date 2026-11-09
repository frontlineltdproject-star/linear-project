import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PurchaseOrderService } from '#/features/purchase-orders/services/purchase-order-service'
import { SecurityService } from '#/lib/security'

function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r }); return {promise, resolve} }
describe('Stock list preview isolated service controls', () => {
 let preview: {location: {href: string}; close: ReturnType<typeof vi.fn>}
 beforeEach(() => {
  vi.useFakeTimers()
  preview = {location:{href:''},close:vi.fn()}
  vi.spyOn(window,'open').mockReturnValue(preview as unknown as Window)
  vi.spyOn(SecurityService,'getAuthorizationHeaders').mockReturnValue({Authorization:'Bearer synthetic-audit-token'})
  vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:synthetic-stock-list')
  vi.spyOn(URL,'revokeObjectURL').mockImplementation(() => {})
  vi.stubGlobal('fetch',vi.fn())
 })
 afterEach(() => {vi.clearAllTimers();vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks()})
 it('captures the exact submitted IDs before later array edits and previews only that result', async()=>{
  const response=deferred<Response>();vi.mocked(fetch).mockReturnValue(response.promise)
  const ids=['10','11'];const attempt=PurchaseOrderService.previewStockListPdf(ids);ids.splice(0,2,'12')
  const init=vi.mocked(fetch).mock.calls[0][1]!
  expect(JSON.parse(init.body as string)).toEqual({purchaseOrderIds:[10,11]})
  expect(init.headers).toMatchObject({Authorization:'Bearer synthetic-audit-token',Accept:'application/pdf'})
  response.resolve({ok:true,blob:async()=>new Blob(['%PDF-synthetic'])} as Response);await attempt
  expect(preview.location.href).toBe('blob:synthetic-stock-list');expect(ids).toEqual(['12'])
  vi.advanceTimersByTime(60000);expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:synthetic-stock-list')
 })
 it('known rejected request closes its blank preview and preserves error for caller', async()=>{
  vi.mocked(fetch).mockResolvedValue({ok:false,status:403,text:async()=> 'Synthetic scope denial'} as Response)
  await expect(PurchaseOrderService.previewStockListPdf(['10','11'])).rejects.toThrow('Synthetic scope denial')
  expect(preview.close).toHaveBeenCalledOnce();expect(URL.createObjectURL).not.toHaveBeenCalled()
 })
 it('network failure closes preview and a new explicit retry uses its selected IDs', async()=>{
  vi.mocked(fetch).mockRejectedValueOnce(new Error('Synthetic network failure'))
  await expect(PurchaseOrderService.previewStockListPdf(['10'])).rejects.toThrow('Synthetic network failure')
  expect(preview.close).toHaveBeenCalledOnce()
  vi.mocked(fetch).mockResolvedValueOnce({ok:true,blob:async()=>new Blob(['%PDF-synthetic'])} as Response)
  await PurchaseOrderService.previewStockListPdf(['10'])
  expect(fetch).toHaveBeenCalledTimes(2);expect(JSON.parse(vi.mocked(fetch).mock.calls[1][1]!.body as string).purchaseOrderIds).toEqual([10])
 })
 it('blocked initial window attempts an anchor fallback; real browser opening remains unverified', async()=>{
  vi.mocked(window.open).mockReturnValue(null)
  const click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{})
  vi.mocked(fetch).mockResolvedValue({ok:true,blob:async()=>new Blob(['%PDF-synthetic'])} as Response)
  await PurchaseOrderService.previewStockListPdf(['10'])
  expect(click).toHaveBeenCalledOnce();expect(URL.createObjectURL).toHaveBeenCalledOnce()
 })
})
