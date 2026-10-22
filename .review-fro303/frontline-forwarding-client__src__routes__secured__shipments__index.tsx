import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { TopBar } from '#/components/layout/top-bar'
import { Input } from '#/components/ui/input'
import { Select } from '#/components/ui/select'
import { Pagination } from '#/components/ui/navigation'
import { TableLoadingPlaceholder } from '#/components/feedback/loading-placeholder'
import { ErrorMessage } from '#/components/feedback/error-message'
import { Can } from '#/features/auth/components/can'
import { UserAuthority } from '#/features/auth/types'
import { ShipmentTable } from '#/features/shipments/components/shipment-table'
import { useShipments } from '#/features/shipments/hooks/use-shipments'
import {
  ShipmentMode,
  ShipmentSortField,
  ShipmentStatus,
  SortDirection,
} from '#/features/shipments/types'

type Search = {
  q: string
  status: string
  mode: string
  page: number
  sort: ShipmentSortField
  direction: SortDirection
}

export const Route = createFileRoute('/secured/shipments/')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === 'string' ? search.q : '',
    status: Object.values(ShipmentStatus).includes(
      search.status as ShipmentStatus,
    )
      ? String(search.status)
      : '',
    mode: Object.values(ShipmentMode).includes(search.mode as ShipmentMode)
      ? String(search.mode)
      : '',
    page: Math.max(0, Number(search.page) || 0),
    sort: Object.values(ShipmentSortField).includes(
      search.sort as ShipmentSortField,
    )
      ? (search.sort as ShipmentSortField)
      : ShipmentSortField.CREATED_AT,
    direction:
      search.direction === SortDirection.ASC
        ? SortDirection.ASC
        : SortDirection.DESC,
  }),
  component: ShipmentsPage,
})

function ShipmentsPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const query = useShipments({
    search: search.q,
    statuses: search.status ? [search.status as ShipmentStatus] : undefined,
    modes: search.mode ? [search.mode as ShipmentMode] : undefined,
    page: search.page,
    size: 20,
    sortField: search.sort,
    sortDirection: search.direction,
  })
  const update = (next: Partial<Search>) =>
    navigate({ search: (current) => ({ ...current, ...next }) })
  return (
    <>
      <TopBar
        title="Shipments"
        description="One physical transfer, one route, and one transport document."
        actions={
          <Can authority={UserAuthority.SHIPMENT_CREATE}>
            <Link
              to="/secured/shipments/new"
              search={{
                originWarehouseId: '',
                purchaseOrderId: '',
                purchaseOrderIds: '',
              }}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-fg-on-accent"
            >
              Create shipment
            </Link>
          </Can>
        }
      />
      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4">
        <Input
          placeholder="Search shipment or document"
          value={search.q}
          onChange={(event) => update({ q: event.target.value, page: 0 })}
        />
        <Select
          value={search.status}
          onChange={(event) => update({ status: event.target.value, page: 0 })}
        >
          <option value="">All statuses</option>
          {Object.values(ShipmentStatus).map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
        <Select
          value={search.mode}
          onChange={(event) => update({ mode: event.target.value, page: 0 })}
        >
          <option value="">All modes</option>
          {Object.values(ShipmentMode).map((mode) => (
            <option key={mode}>{mode}</option>
          ))}
        </Select>
        <Select
          value={`${search.sort}:${search.direction}`}
          onChange={(event) => {
            const [sort, direction] = event.target.value.split(':')
            update({
              sort: sort as ShipmentSortField,
              direction: direction as SortDirection,
            })
          }}
        >
          <option value="CREATED_AT:DESC">Newest first</option>
          <option value="SHIPMENT_NUMBER:ASC">Shipment number</option>
          <option value="STATUS:ASC">Status</option>
        </Select>
      </div>
      <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
        {query.isPending ? <TableLoadingPlaceholder columns={7} /> : null}
        {query.isError ? (
          <ErrorMessage message={(query.error as Error).message} />
        ) : null}
        {query.data ? <ShipmentTable shipments={query.data.content} /> : null}
      </section>
      {query.data ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-fg-muted">
            Showing {query.data.content.length} of{' '}
            {Number(query.data.totalElements)} shipments
          </p>
          {query.data.totalPages > 1 ? (
            <Pagination
              page={query.data.page + 1}
              pageCount={query.data.totalPages}
              onPageChange={(page) => update({ page: page - 1 })}
            />
          ) : null}
        </div>
      ) : null}
    </>
  )
}

