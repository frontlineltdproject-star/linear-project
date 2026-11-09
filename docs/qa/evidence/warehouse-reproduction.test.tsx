import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LabelsProvider } from '#/app/providers/labels-provider'
import { GraphQLExecutor } from '#/lib/graphql'
import { ShipmentService } from '#/features/shipments/services/shipment-service'
import { shipmentKeys } from '#/features/shipments/hooks/use-shipments'
import { candidate, candidateUnit } from '#/features/shipments/components/creation/shipment-creation-fixtures.test-utils'
import { composerOptions } from '#/features/shipments/components/details/shipment-read-fixtures.test-utils'
import { Route } from '#/routes/secured/shipments/new'

vi.mock('@tanstack/react-router', async (original) => ({
  ...(await original<object>()),
  useNavigate: () => vi.fn(),
  createFileRoute: () => (options: object) => ({
    options,
    useSearch: () => ({ originWarehouseId: '31', purchaseOrderId: '7' }),
    useNavigate: () => vi.fn(),
  }),
}))
vi.mock('#/components/ui/toast', () => ({ useToast: () => ({ toast: vi.fn() }) }))
vi.mock('#/features/locations/hooks/use-locations', () => ({
  useCountries: () => ({ data: [{ id: '1', name: 'GREECE' }, { id: '2', name: 'NETHERLANDS' }] }),
  useCities: () => ({ data: [{ id: '11', name: 'ATHENS', countryId: '1' }] }),
}))

const page = (content: unknown[] = []) => ({ page: 0, size: 100, totalElements: content.length, totalPages: 1, content })
let resolveNew: (value: ReturnType<typeof page>) => void
let pendingNew: Promise<ReturnType<typeof page>>
let fetchMock: ReturnType<typeof vi.fn>
let executeMock: ReturnType<typeof vi.spyOn>
let client: QueryClient

beforeEach(() => {
  pendingNew = new Promise((resolve) => { resolveNew = resolve })
  fetchMock = vi.fn(() => { throw new Error('Network forbidden by audit') })
  vi.stubGlobal('fetch', fetchMock)
  executeMock = vi.spyOn(GraphQLExecutor, 'execute').mockImplementation(async () => { throw new Error('Unexpected GraphQL by audit') })
  vi.spyOn(ShipmentService, 'options').mockResolvedValue({
    ...composerOptions,
    warehouses: composerOptions.warehouses.map(w => ({ ...w, city: { id: 11, name: 'Athens' } })),
  })
  vi.spyOn(ShipmentService, 'candidates').mockImplementation(async (origin) => origin === '31' ? page([candidate(7, [candidateUnit(71), candidateUnit(72)])]) : pendingNew as never)
  vi.spyOn(ShipmentService, 'arrivedSources').mockResolvedValue(page() as never)
  vi.spyOn(ShipmentService, 'destinationWarehouses').mockResolvedValue([])
  vi.spyOn(ShipmentService, 'historicalCandidates').mockResolvedValue(page() as never)
  client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 30_000 } } })
})
afterEach(() => {
  cleanup()
  client.clear()
  expect(fetchMock).not.toHaveBeenCalled()
  expect(executeMock).not.toHaveBeenCalled()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

async function open() {
  const Page = Route.options.component as () => React.ReactNode
  render(<QueryClientProvider client={client}><LabelsProvider><Page /></LabelsProvider></QueryClientProvider>)
  await screen.findByRole('textbox', { name: 'Internal Notes' })
}
function picker(label: string) { return screen.getByText(label, { selector: 'label' }).parentElement!.querySelector('button')! }
function pick(label: string, option: RegExp) {
  fireEvent.click(picker(label))
  fireEvent.click(screen.getByRole('option', { name: option }))
}

describe('read-only source audit: real new route + controller + form, services stubbed', () => {
  it('uncached origin switch unmounts form and restores original seed, losing notes', async () => {
    await open()
    fireEvent.change(screen.getByRole('textbox', { name: 'Internal Notes' }), { target: { value: 'KEEP THIS DRAFT' } })
    pick('Origin warehouse', /PIR/)
    await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Internal Notes' })).toBeNull())
    expect(ShipmentService.candidates).toHaveBeenCalledWith('33', '')
    await act(async () => resolveNew(page()))
    await screen.findByRole('textbox', { name: 'Internal Notes' })
    expect((screen.getByRole('textbox', { name: 'Internal Notes' }) as HTMLInputElement).value).toBe('')
    expect(picker('Origin warehouse').textContent).toContain('ATH')
    console.log('OBSERVED: uncached 31->33: form disappears; response restores origin 31 and erases edited note')
  })
  it('country change clearing origin leaves seeded route loading with candidate query disabled', async () => {
    await open()
    pick('Origin country', /NETHERLANDS/)
    await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Internal Notes' })).toBeNull())
    const disabled = client.getQueryCache().find({ queryKey: shipmentKeys.candidates('', '') })
    expect(disabled?.state.status).toBe('pending')
    expect(disabled?.state.fetchStatus).toBe('idle')
    expect(ShipmentService.candidates).not.toHaveBeenCalledWith('', '')
    console.log('OBSERVED: cleared origin: ready false, no form, empty-origin query pending/idle with no request')
  })
  it('cached origin switch is a control: no unmount and notes survive', async () => {
    client.setQueryData(shipmentKeys.candidates('33', ''), page())
    await open()
    fireEvent.change(screen.getByRole('textbox', { name: 'Internal Notes' }), { target: { value: 'KEEP THIS DRAFT' } })
    pick('Origin warehouse', /PIR/)
    await waitFor(() => expect(picker('Origin warehouse').textContent).toContain('PIR'))
    expect((screen.getByRole('textbox', { name: 'Internal Notes' }) as HTMLInputElement).value).toBe('KEEP THIS DRAFT')
    console.log('CONTROL: cached 31->33 retains origin 33 and edited note')
  })
})
