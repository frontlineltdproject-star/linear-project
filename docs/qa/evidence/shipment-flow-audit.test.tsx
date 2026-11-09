import { useState, type ReactNode } from 'react'
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LabelsProvider } from '#/app/providers/labels-provider'
import { GraphQLExecutor } from '#/lib/graphql'
import { GraphQLExecutorError } from '#/lib/graphql/errors'
import { ShipmentService } from '#/features/shipments/services/shipment-service'
import { useShipmentDetails } from '#/features/shipments/hooks/use-shipment-details'
import { shipmentKeys } from '#/features/shipments/hooks/use-shipments'
import { ShipmentDetailsPreparedPage } from '#/features/shipments/components/details/shipment-details-prepared-page'
import { ShipmentArrivalForm } from '#/features/shipments/components/details/shipment-arrival-form'
import { shipment, composerOptions, content } from '#/features/shipments/components/details/shipment-read-fixtures.test-utils'
import { packingLoadUnits, shipmentCapabilities, shipmentDetailsView, routeChangeOf, routeUpdateInput } from '#/features/shipments/components/details/shipment-details-mapping'
import { routeDraftFromView } from '#/features/shipments/components/details/shipment-details-drafts'
import type { ShipmentRead } from '#/features/shipments/components/details/shipment-details-mapping'
import type { ShipmentDetailsTab } from '#/features/shipments/components/details/shipment-details-types'

// Only auth/reference/network boundaries are substituted. Controller, mappings,
// QueryClient, page, modal, tabs and editors are the unmodified pinned source.
vi.mock('#/features/auth/hooks/use-current-user-profile', () => ({
  useCurrentUserProfile: () => ({ data: { authorities: ['SHIPMENT_EDIT'] } }),
}))
vi.mock('#/features/locations/hooks/use-locations', () => ({
  useCountries: () => ({ data: [] }), useCities: () => ({ data: [] }),
}))

let saved: ShipmentRead
let execute: ReturnType<typeof vi.spyOn>
let clients: QueryClient[] = []
let blockedFetch: ReturnType<typeof vi.fn>
type Variables = { id?: number; shipmentId?: number; input: Record<string, any> }
const calls = (name: string): Variables[] => execute.mock.calls
  .filter(([document]) => document.name === name).map(([, variables]) => variables)
const conflict = () => new GraphQLExecutorError('Stale', {
  cause: null, messages: ['Stale'], classifications: ['CONFLICT'],
  extensions: [{ classification: 'CONFLICT' }],
})
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}
function packed(version = 3, lengthCm = 120): ShipmentRead {
  return shipment({ version, looseContents: [], loadUnits: [{
    id: 50, sequenceNumber: 1, type: 'PALLET', label: 'Audit pallet',
    lengthCm, widthCm: 80, heightCm: 100, grossWeightKg: 30,
    netWeightKg: 20, notes: 'Keep dry', contents: [content(101, 10, 'PO-10')],
  }] })
}
function clientAndWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } })
  clients.push(client)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}><LabelsProvider>{children}</LabelsProvider></QueryClientProvider>
  )
  return { client, wrapper }
}
async function renderController() {
  const { client, wrapper } = clientAndWrapper()
  const hook = renderHook(() => useShipmentDetails('7', 'overview'), { wrapper })
  await waitFor(() => expect(hook.result.current.shipment).not.toBeNull())
  return { ...hook, client }
}
async function renderPage(initialTab: ShipmentDetailsTab = 'orders') {
  const { client, wrapper } = clientAndWrapper()
  function ConnectedPage() {
    const [tab, setTab] = useState<ShipmentDetailsTab>(initialTab)
    const details = useShipmentDetails('7', tab)
    if (!details.view || !details.capabilities || !details.shipment) return <p>Loading audit fixture</p>
    return <ShipmentDetailsPreparedPage
      view={details.view} capabilities={details.capabilities} options={details.options}
      history={details.history} candidates={details.candidates} candidatesState={details.candidatesState}
      tab={tab} onTabChange={setTab} commands={details.commands}
      slots={{ documents: <p>Attachment boundary omitted</p>, deliveryNotes: null,
        arrivalForm: <ShipmentArrivalForm shipment={{
          purpose: details.shipment.purpose,
          destinationAgentCompany: details.shipment.destinationAgentCompany,
          vessels: [{ id: '4', name: 'MV Demo' }],
        }} onArrive={details.arrive} /> }}
      orderHref={(id) => `/orders/${id}`} colliHref={(id) => `/collis/${id}`}
    />
  }
  render(<ConnectedPage />, { wrapper })
  await screen.findByRole('heading', { name: 'Shipment · SHP-7' })
  return { client }
}
function button(name: string) { return screen.getByRole('button', { name, exact: true }) }
function tab(name: string) { fireEvent.click(screen.getByRole('tab', { name, exact: true })) }

beforeEach(() => {
  localStorage.clear()
  saved = shipment()
  blockedFetch = vi.fn(async () => { throw new Error('AUDIT: network forbidden') })
  vi.stubGlobal('fetch', blockedFetch)
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('AUDIT: XHR forbidden') })
  vi.stubGlobal('WebSocket', class { constructor() { throw new Error('AUDIT: websocket forbidden') } })
  execute = vi.spyOn(GraphQLExecutor, 'execute').mockImplementation(async (document) => {
    throw new Error(`AUDIT: unexpected GraphQL boundary ${document.name}`)
  })
  vi.spyOn(ShipmentService, 'get').mockImplementation(async () => structuredClone(saved))
  vi.spyOn(ShipmentService, 'statusHistory').mockResolvedValue({ items: [], hasMore: false })
  vi.spyOn(ShipmentService, 'operations').mockResolvedValue({ items: [], hasMore: false })
  vi.spyOn(ShipmentService, 'comments').mockResolvedValue({ items: [], hasMore: false })
  vi.spyOn(ShipmentService, 'options').mockResolvedValue(composerOptions)
  vi.spyOn(ShipmentService, 'destinationWarehouses').mockResolvedValue([])
  vi.spyOn(ShipmentService, 'candidates').mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 } as any)
})
afterEach(() => {
  cleanup()
  clients.forEach((client) => client.clear())
  clients = []
  expect(blockedFetch).not.toHaveBeenCalled()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Pinned Shipment Details audit — observation assertions reproduce defects, not fixes', () => {
  it('F1: stale packing review adopts a refreshed version while keeping the old arrangement', async () => {
    saved = packed()
    const { client } = await renderPage()
    fireEvent.click(button('Edit packing'))
    fireEvent.click(button('Confirm packing'))
    expect(screen.getByRole('heading', { name: 'Review repacking' })).toBeTruthy()
    // Another editor saved a changed plan. This is equivalent to a query refetch.
    saved = packed(4, 200)
    await act(async () => { await client.invalidateQueries({ queryKey: shipmentKeys.detail('7') }) })
    expect(screen.getByRole('heading', { name: 'Review repacking' })).toBeTruthy()
    execute.mockResolvedValueOnce({ id: 7 })
    fireEvent.click(button('Confirm ready for dispatch'))
    await waitFor(() => expect(calls('confirmShipmentReadiness')).toHaveLength(1))
    const sent = calls('confirmShipmentReadiness')[0].input
    // Contract requires reviewed version 3 (or renewed review), not version 4.
    expect(sent.expectedVersion).toBe(4)
    expect(sent.loadUnits[0].lengthCm).toBe(120)
    expect(saved.loadUnits[0].lengthCm).toBe(200)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('F1: a rejected stale confirmation stays at Review and retry sends old packing at the new version', async () => {
    saved = packed()
    await renderPage()
    fireEvent.click(button('Edit packing'))
    fireEvent.click(button('Confirm packing'))
    saved = packed(4, 200)
    execute.mockRejectedValueOnce(conflict())
    fireEvent.click(button('Confirm ready for dispatch'))
    await screen.findByText('This shipment was changed elsewhere. It has been reloaded: review it and try again.')
    expect(screen.getByRole('heading', { name: 'Review repacking' })).toBeTruthy()
    execute.mockResolvedValueOnce({ id: 7 })
    fireEvent.click(button('Confirm ready for dispatch'))
    await waitFor(() => expect(calls('confirmShipmentReadiness')).toHaveLength(2))
    const [first, retry] = calls('confirmShipmentReadiness')
    expect(first.input.expectedVersion).toBe(3)
    expect(retry.input.expectedVersion).toBe(4)
    expect(retry.input.loadUnits).toEqual(first.input.loadUnits)
    expect(retry.input.requestId).not.toBe(first.input.requestId)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('F2: an unversioned comment retry gets a new request identity after a Shipment refresh', async () => {
    const { result, client } = await renderController()
    const committed = new Map<string, string>()
    let loseResponse = true
    // Minimal idempotent transport fixture: a committed comment survives a lost response.
    execute.mockImplementation(async (_document, variables: Variables) => {
      const { requestId, content } = variables.input
      if (!committed.has(requestId)) committed.set(requestId, content)
      if (loseResponse) { loseResponse = false; throw new Error('Response lost after commit') }
      return { id: 7 }
    })
    await act(async () => { expect(await result.current.commands.addComment('Driver notified')).toMatchObject({ ok: false }) })
    saved = shipment({ version: 4, internalNotes: 'Concurrent note change' })
    await act(async () => { await client.invalidateQueries({ queryKey: shipmentKeys.detail('7') }) })
    await waitFor(() => expect(result.current.shipment?.version).toBe(4))
    await act(async () => { expect(await result.current.commands.addComment('Driver notified')).toEqual({ ok: true }) })
    const [first, retry] = calls('addShipmentComment')
    expect(first.input).not.toHaveProperty('expectedVersion')
    expect(retry.input.content).toBe(first.input.content)
    expect(retry.input.requestId).not.toBe(first.input.requestId)
    expect([...committed.values()]).toEqual(['Driver notified', 'Driver notified'])
  })

  it('control: uncertain comment retry without a version refresh retains its identity', async () => {
    const { result } = await renderController()
    execute.mockRejectedValueOnce(new Error('Response lost')).mockResolvedValueOnce({ id: 7 })
    await act(async () => { await result.current.commands.addComment('Driver notified') })
    await act(async () => { await result.current.commands.addComment('Driver notified') })
    const [first, retry] = calls('addShipmentComment')
    expect(retry.input.requestId).toBe(first.input.requestId)
  })

  it('F3: completing one note save restores its old sibling-draft snapshot and loses later typing', async () => {
    await renderPage('overview')
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit', exact: true })[2])
    fireEvent.change(screen.getByLabelText('Internal Notes'), { target: { value: 'Internal draft' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit', exact: true }).at(-1)!)
    fireEvent.change(screen.getByLabelText('External Notes'), { target: { value: 'External before save' } })
    const pending = deferred<{ id: number }>()
    execute.mockImplementationOnce(() => pending.promise)
    fireEvent.click(screen.getAllByRole('button', { name: 'Save', exact: true })[0])
    fireEvent.change(screen.getByLabelText('External Notes'), { target: { value: 'External typed while internal saves' } })
    expect((screen.getByLabelText('External Notes') as HTMLTextAreaElement).value).toBe('External typed while internal saves')
    await act(async () => { pending.resolve({ id: 7 }) })
    await waitFor(() => expect(screen.queryByLabelText('Internal Notes')).toBeNull())
    expect((screen.getByLabelText('External Notes') as HTMLTextAreaElement).value).toBe('External before save')
  })

  it('F4: a tab round-trip discards a failed arrival handover draft and actionable error', async () => {
    saved = shipment({ status: 'DISPATCHED', purpose: 'DELIVERY_TO_LAUNCH_STATION', destinationKind: 'AGENT',
      destinationWarehouse: null, destinationAgentCompany: { id: 41, name: 'Demo Agent' } })
    await renderPage('actions')
    const labels = ['Recipient name', 'Recipient address', 'Received by', 'Proof document reference']
    for (const label of labels) fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value: label + ' audit value' } })
    execute.mockRejectedValueOnce(new Error('Arrival refused in audit'))
    fireEvent.click(button('Record arrival'))
    await waitFor(() => expect(calls('arriveShipment')).toHaveLength(1))
    await screen.findByText('The change could not be saved. Try again.')
    const submitted = calls('arriveShipment')[0].input.handover
    expect(submitted.recipientName).toContain('audit value')
    expect((screen.getAllByRole('textbox')[0] as HTMLInputElement).value).not.toBe('')
    tab('Overview')
    tab('Available actions')
    expect(screen.getAllByRole('textbox').slice(0, 4).map((input) => (input as HTMLInputElement).value)).toEqual(['', '', '', ''])
    expect(screen.queryByText('The change could not be saved. Try again.')).toBeNull()
  })

  it('controls: packing omits preserved values, number-only mapping is explicit, lifecycle guards match statuses', () => {
    const plan = { units: [{ id: '50', type: 'PALLET' as const, label: 'Audit', lengthCm: 120, widthCm: 80,
      heightCm: 100, grossWeightKg: 30, colliIds: ['101'] }] }
    const payload = packingLoadUnits(plan)[0]
    expect(payload).not.toHaveProperty('netWeightKg')
    expect(payload).not.toHaveProperty('notes')
    const read = shipment({ status: 'READY_FOR_DISPATCH' })
    const draft = routeDraftFromView(shipmentDetailsView(read, 'en'))
    expect(routeUpdateInput(routeChangeOf(read, { ...draft, documentNumber: '' }), null).transportDocumentNumber).toBeNull()
    expect(routeUpdateInput(routeChangeOf(read, { ...draft, mode: 'AIR', documentResolution: 'KEEP' }), null).transportDocumentNumber).toBe('CMR-1')
    for (const status of ['PREPARING', 'READY_FOR_DISPATCH', 'DISPATCHED', 'ARRIVED', 'CANCELLED', 'LOCATION_UNKNOWN'] as const) {
      const capabilities = shipmentCapabilities(shipment({ status }), true)
      expect(capabilities.cancel).toBe(['PREPARING', 'READY_FOR_DISPATCH'].includes(status))
      expect(capabilities.editPacking).toBe(['PREPARING', 'READY_FOR_DISPATCH'].includes(status))
      expect(capabilities.recordArrival).toBe(status === 'DISPATCHED')
      expect(capabilities.markLocationUnknown).toBe(status === 'DISPATCHED')
      expect(Object.values(shipmentCapabilities(shipment({ status }), false)).every((value) => !value)).toBe(true)
    }
  })
})
