import { Link } from '@tanstack/react-router'
import { StatusPill } from '#/components/ui/badge'
import { Table, TBody, TD, TH, THead, TR } from '#/components/ui/table'
import { enumLabel } from '#/features/purchase-orders/components/purchase-order-status-pill'
import type { ShipmentSummary } from '../types'

export function ShipmentStatusPill({ status }: { status: string }) {
  const tone =
    status === 'ARRIVED'
      ? 'success'
      : status === 'CANCELLED' || status === 'LOCATION_UNKNOWN'
        ? 'danger'
        : status === 'DISPATCHED'
          ? 'info'
          : 'neutral'
  return <StatusPill tone={tone}>{enumLabel(status)}</StatusPill>
}

export function ShipmentTable({
  shipments,
}: {
  shipments: Array<ShipmentSummary>
}) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Shipment</TH>
          <TH>Mode / purpose</TH>
          <TH>Route</TH>
          <TH>Status</TH>
          <TH>POs</TH>
          <TH>Collis</TH>
          <TH>Transport document</TH>
        </TR>
      </THead>
      <TBody>
        {shipments.map((shipment) => {
          const shipmentId = String(shipment.id)
          return (
            <TR key={shipmentId} interactive>
              <TD>
                <Link
                  to="/secured/shipments/$shipmentId"
                  params={{ shipmentId }}
                  className="font-semibold text-accent"
                >
                  {shipment.shipmentNumber}
                </Link>
              </TD>
              <TD>
                {enumLabel(shipment.mode)}
                <span className="block text-xs text-fg-subtle">
                  {enumLabel(shipment.purpose)}
                </span>
              </TD>
              <TD>
                {shipment.originWarehouse.code} →{' '}
                {shipment.destinationWarehouse?.code ??
                  shipment.destinationAgentCompany?.name ??
                  (shipment.destinationKind === 'VESSEL'
                    ? 'Direct delivery on board'
                    : '—')}
              </TD>
              <TD>
                <ShipmentStatusPill status={shipment.status} />
              </TD>
              <TD>{shipment.purchaseOrderCount}</TD>
              <TD>{shipment.handlingUnitCount}</TD>
              <TD>{shipment.transportDocumentNumber ?? '—'}</TD>
            </TR>
          )
        })}
      </TBody>
    </Table>
  )
}

