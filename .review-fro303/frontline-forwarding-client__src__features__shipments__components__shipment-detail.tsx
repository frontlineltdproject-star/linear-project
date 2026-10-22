import { useState, type ReactNode } from 'react'
import type { RequestDocument, Variables } from 'graphql-request'
import { Link } from '@tanstack/react-router'
import { Can } from '#/features/auth/components/can'
import { UserAuthority } from '#/features/auth/types'
import { Button } from '#/components/ui/button'
import { Input, Textarea } from '#/components/ui/input'
import { Select } from '#/components/ui/select'
import { ErrorMessage } from '#/components/feedback/error-message'
import { useToast } from '#/components/ui/toast'
import { GraphQLExecutor } from '#/lib/graphql'
import { enumLabel } from '#/features/purchase-orders/components/purchase-order-status-pill'
import { shipmentDocuments } from '../graphql/documents'
import { useShipmentCommand } from '../hooks/use-shipments'
import {
  ShipmentMode,
  ShipmentTransportDocumentType,
  transportDocumentLabel,
  transportDocumentTypeForMode,
  type Shipment,
} from '../types'
import { ShipmentStatusPill } from './shipment-table'
import { AttachmentPanel } from '#/features/attachments/components/attachment-panel'
import { DeliveryNotesCard } from './delivery-notes-card'

export function ShipmentDetail({ shipment }: { shipment: Shipment }) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">
                {shipment.shipmentNumber}
              </h2>
              <ShipmentStatusPill status={shipment.status} />
            </div>
            <p className="mt-1 text-sm text-fg-muted">
              {enumLabel(shipment.mode)} · {enumLabel(shipment.purpose)}
            </p>
          </div>
          <p className="text-sm">
            {shipment.originWarehouse.code} →{' '}
            {shipment.destinationWarehouse?.code ??
              shipment.destinationAgentCompany?.name ??
              (shipment.destinationKind === 'VESSEL'
                ? 'Direct delivery on board'
                : '—')}
          </p>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Transport and timing">
          <Facts
            items={[
              ['Status', enumLabel(shipment.status)],
              [
                'Document type',
                shipment.transportDocumentType
                  ? transportDocumentLabel(
                      shipment.transportDocumentType as ShipmentTransportDocumentType,
                    )
                  : null,
              ],
              ['Document number', shipment.transportDocumentNumber],
              ['Created', dateTime(shipment.createdAt)],
              ['Dispatched', dateTime(shipment.dispatchedAt)],
              ['Arrived', dateTime(shipment.arrivedAt)],
              ['Location unknown', shipment.locationUnknownReason],
            ]}
          />
        </Card>
        <Card title="Purchase orders">
          <div className="space-y-2">
            {shipment.purchaseOrders.map((participation) => (
              <Link
                key={String(participation.id)}
                to="/secured/purchase-orders/$purchaseOrderId"
                params={{
                  purchaseOrderId: String(participation.purchaseOrderId),
                }}
                className="block rounded-md border border-border p-3 font-semibold text-accent"
              >
                {participation.purchaseOrderInternalNumber}
              </Link>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Shipment packages">
        {shipment.looseContents.length > 0 ? (
          <div className="mb-4 rounded-md border border-border p-4">
            <h4 className="font-semibold">Individual collis</h4>
            <p className="mt-1 text-xs text-fg-subtle">
              These packages ship as they are, without an overpack.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {shipment.looseContents.map((content) => (
                <ShipmentContentLink
                  key={String(content.id)}
                  content={content}
                />
              ))}
            </div>
          </div>
        ) : null}
        {shipment.loadUnits.length > 0 ? (
          <div className="mb-3">
            <h4 className="font-semibold">Optional repacking</h4>
            <p className="mt-1 text-xs text-fg-subtle">
              Collis grouped into shipment pallets or cardboard boxes.
            </p>
          </div>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          {shipment.loadUnits.map((loadUnit) => (
            <div
              key={String(loadUnit.id)}
              className="rounded-md border border-border p-4"
            >
              <h4 className="font-semibold">
                {enumLabel(loadUnit.type)}{' '}
                {loadUnit.label ?? `#${loadUnit.sequenceNumber}`}
              </h4>
              <p className="mt-1 text-xs text-fg-subtle">
                {loadUnit.lengthCm} × {loadUnit.widthCm} × {loadUnit.heightCm}{' '}
                cm
              </p>
              <div className="mt-3 space-y-2">
                {loadUnit.contents.map((content) => (
                  <ShipmentContentLink
                    key={String(content.id)}
                    content={content}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <AttachmentPanel
        referenceType="shipments"
        referenceId={Number(shipment.id)}
      />
      <Can authority={UserAuthority.DELIVERY_NOTE_VIEW}>
        <DeliveryNotesCard shipmentId={String(shipment.id)} />
      </Can>
      {shipment.handover ? (
        <Card title="Final handover">
          <Facts
            items={[
              ['Recipient kind', enumLabel(shipment.handover.recipientKind)],
              ['Recipient', shipment.handover.recipientName],
              ['Received by', shipment.handover.receivedBy],
              ['Proof', shipment.handover.proofDocumentReference],
              ['Confirmed', dateTime(shipment.handover.confirmedAt)],
            ]}
          />
        </Card>
      ) : null}
      <Can authority={UserAuthority.SHIPMENT_EDIT}>
        <ShipmentActions shipment={shipment} />
      </Can>
    </div>
  )
}

function ShipmentContentLink({
  content,
}: {
  content: Shipment['looseContents'][number]
}) {
  return (
    <Link
      to="/secured/handling-units/$handlingUnitId"
      params={{ handlingUnitId: String(content.handlingUnitId) }}
      className="block rounded bg-surface-2 p-2 text-sm"
    >
      <span className="font-semibold text-accent">
        {content.handlingUnitTrackingCode}
      </span>{' '}
      · {content.purchaseOrderInternalNumber}
    </Link>
  )
}

function ShipmentActions({ shipment }: { shipment: Shipment }) {
  const requiredDocumentType = transportDocumentTypeForMode(
    shipment.mode as ShipmentMode,
  )
  const [documentNumber, setDocumentNumber] = useState('')
  const [reason, setReason] = useState('')
  const [recipientKind, setRecipientKind] = useState(() =>
    shipment.purpose === 'THIRD_PARTY_TRANSFER'
      ? 'AGENT'
      : shipment.purpose === 'DELIVERY_TO_LAUNCH_STATION'
        ? 'LAUNCH_STATION'
        : shipment.purpose === 'DELIVERY_TO_VESSEL'
          ? 'VESSEL'
          : 'PERSON',
  )
  const [recipientEntityId, setRecipientEntityId] = useState(() =>
    shipment.purpose === 'THIRD_PARTY_TRANSFER'
      ? String(shipment.destinationAgentCompany?.id ?? '')
      : '',
  )
  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [receivedBy, setReceivedBy] = useState('')
  const [proofReference, setProofReference] = useState('')
  const [error, setError] = useState('')
  const { toast } = useToast()
  type CommandDocument = { name: string; gql: RequestDocument }
  type CommandPayload = {
    document: CommandDocument
    variables: Variables
  }
  const mutation = useShipmentCommand<CommandPayload, unknown>(
    ({ document, variables }) =>
      GraphQLExecutor.execute<unknown>(document, variables),
  )

  async function run(
    document: CommandDocument,
    variables: Variables,
    success: string,
  ) {
    setError('')
    try {
      await mutation.mutateAsync({ document, variables })
      toast({ title: success, tone: 'success' })
    } catch (caught) {
      setError((caught as Error).message)
    }
  }

  return (
    <Card title="Available actions">
      {error ? <ErrorMessage message={error} /> : null}
      {shipment.status === 'PREPARING' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-md border border-border p-4">
            <h4 className="font-semibold">Dispatch shipment</h4>
            <div className="rounded-md bg-surface-2 px-3 py-2 text-sm">
              <span className="text-fg-muted">Transport document: </span>
              <strong>{transportDocumentLabel(requiredDocumentType)}</strong>
            </div>
            <Input
              placeholder="Document number"
              value={documentNumber}
              onChange={(event) => setDocumentNumber(event.target.value)}
            />
            <Button
              disabled={!documentNumber.trim()}
              onClick={() =>
                run(
                  shipmentDocuments.dispatch,
                  {
                    id: Number(shipment.id),
                    input: {
                      transportDocumentNumber: documentNumber,
                    },
                  },
                  'Shipment dispatched',
                )
              }
            >
              Dispatch
            </Button>
          </div>
          <div className="space-y-3 rounded-md border border-border p-4">
            <h4 className="font-semibold">Cancel before dispatch</h4>
            <Textarea
              placeholder="Cancellation reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <Button
              variant="danger"
              disabled={!reason.trim()}
              onClick={() =>
                run(
                  shipmentDocuments.cancel,
                  { id: Number(shipment.id), input: { reason } },
                  'Shipment cancelled',
                )
              }
            >
              Cancel shipment
            </Button>
          </div>
        </div>
      ) : null}
      {shipment.status === 'DISPATCHED' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-md border border-border p-4">
            <h4 className="font-semibold">Record arrival / final handover</h4>
            {shipment.purpose !== 'NETWORK_TRANSFER' ? (
              <>
                {[
                  'THIRD_PARTY_TRANSFER',
                  'DELIVERY_TO_LAUNCH_STATION',
                  'DELIVERY_TO_VESSEL',
                ].includes(shipment.purpose) ? (
                  <p className="text-sm text-fg-muted">
                    Recipient:{' '}
                    {shipment.purpose === 'THIRD_PARTY_TRANSFER'
                      ? shipment.destinationAgentCompany?.name
                      : enumLabel(recipientKind)}
                  </p>
                ) : (
                  <Select
                    value={recipientKind}
                    onChange={(event) => setRecipientKind(event.target.value)}
                  >
                    {['PERSON', 'OTHER', 'AGENT', 'COMPANY'].map((kind) => (
                      <option key={kind} value={kind}>
                        {enumLabel(kind)}
                      </option>
                    ))}
                  </Select>
                )}
                {shipment.purpose === 'THIRD_PARTY_TRANSFER' ? null : [
                    'AGENT',
                    'COMPANY',
                    'VESSEL',
                  ].includes(recipientKind) ? (
                  <Input
                    type="number"
                    min="1"
                    placeholder={`${enumLabel(recipientKind)} ID`}
                    value={recipientEntityId}
                    onChange={(event) =>
                      setRecipientEntityId(event.target.value)
                    }
                  />
                ) : (
                  <Input
                    placeholder="Recipient name"
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                  />
                )}
                <Input
                  placeholder="Recipient address"
                  value={recipientAddress}
                  onChange={(event) => setRecipientAddress(event.target.value)}
                />
                <Input
                  placeholder="Received by"
                  value={receivedBy}
                  onChange={(event) => setReceivedBy(event.target.value)}
                />
                <Input
                  placeholder="Proof document reference"
                  value={proofReference}
                  onChange={(event) => setProofReference(event.target.value)}
                />
              </>
            ) : (
              <p className="text-sm text-fg-muted">
                This warehouse transfer records arrival without a final
                handover.
              </p>
            )}
            <Button
              disabled={
                shipment.purpose !== 'NETWORK_TRANSFER' &&
                (!receivedBy.trim() ||
                  (['AGENT', 'COMPANY', 'VESSEL'].includes(recipientKind)
                    ? !recipientEntityId
                    : !recipientName.trim()))
              }
              onClick={() =>
                run(
                  shipmentDocuments.arrive,
                  {
                    id: Number(shipment.id),
                    input: {
                      handover:
                        shipment.purpose === 'NETWORK_TRANSFER'
                          ? null
                          : {
                              recipientKind,
                              agentCompanyId:
                                recipientKind === 'AGENT'
                                  ? Number(recipientEntityId)
                                  : null,
                              companyId:
                                recipientKind === 'COMPANY'
                                  ? Number(recipientEntityId)
                                  : null,
                              vesselId:
                                recipientKind === 'VESSEL'
                                  ? Number(recipientEntityId)
                                  : null,
                              recipientName: [
                                'AGENT',
                                'COMPANY',
                                'VESSEL',
                              ].includes(recipientKind)
                                ? null
                                : recipientName,
                              recipientAddress: recipientAddress.trim() || null,
                              receivedBy,
                              proofDocumentReference:
                                proofReference.trim() || null,
                            },
                    },
                  },
                  'Arrival recorded',
                )
              }
            >
              Record arrival
            </Button>
          </div>
          <div className="space-y-3 rounded-md border border-border p-4">
            <h4 className="font-semibold">Mark location unknown</h4>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <Button
              variant="danger"
              disabled={!reason.trim()}
              onClick={() =>
                run(
                  shipmentDocuments.locationUnknown,
                  { id: Number(shipment.id), input: { reason } },
                  'Shipment location marked unknown',
                )
              }
            >
              Mark unknown
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function Facts({ items }: { items: Array<[string, unknown]> }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs font-semibold uppercase text-fg-subtle">
            {label}
          </dt>
          <dd className="mt-1 text-sm">{value ? String(value) : '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

const dateTime = (value?: unknown) =>
  value ? new Date(String(value)).toLocaleString() : null

