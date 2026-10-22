import { useRef, useState, type ReactNode } from 'react'
import type { RequestDocument, Variables } from 'graphql-request'
import { Link } from '@tanstack/react-router'
import { Can } from '#/features/auth/components/can'
import { UserAuthority } from '#/features/auth/types'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { FormField, Input, Textarea } from '#/components/ui/input'
import { Select } from '#/components/ui/select'
import { Modal } from '#/components/ui/modal'
import { useToast } from '#/components/ui/toast'
import { ErrorMessage } from '#/components/feedback/error-message'
import { DatePicker } from '#/components/ui/date-picker'
import { Tab, TabList, TabPanel, Tabs } from '#/components/ui/tabs'
import { GraphQLExecutor } from '#/lib/graphql'
import { formatIsoDate, parseIsoDate } from '#/lib/date'
import type { PurchaseOrder } from '../types'
import { purchaseOrderDocuments } from '../graphql/documents'
import { usePurchaseOrderCommand } from '../hooks/use-purchase-orders'
import { PurchaseOrderStatusPill } from './purchase-order-status-pill'
import { PurchaseOrderSplitLineageBadge } from './purchase-order-split-lineage-badge'
import { usePurchaseOrderLabels } from '../localization/purchase-order-labels'
import { AttachmentPanel } from '#/features/attachments/components/attachment-panel'
import { ReadinessReminderAction } from './readiness-reminder-action'

export function PurchaseOrderDetail({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrder
}) {
  const { text, enumLabel } = usePurchaseOrderLabels()
  const rootPurchaseOrder = purchaseOrder.rootPurchaseOrderId
    ? purchaseOrder.lineagePurchaseOrders.find(
        (candidate) =>
          String(candidate.id) === String(purchaseOrder.rootPurchaseOrderId),
      )
    : undefined
  const parentPurchaseOrder = purchaseOrder.lineagePurchaseOrders.find(
    (candidate) =>
      String(candidate.id) === String(purchaseOrder.parentPurchaseOrderId),
  )
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">
                {purchaseOrder.internalNumber}
              </h2>
              <PurchaseOrderStatusPill status={purchaseOrder.status} />
              {purchaseOrder.hasDangerousGoods ? (
                <Badge tone="danger">DG</Badge>
              ) : null}
              {purchaseOrder.hasBondedGoods ? (
                <Badge tone="warning">{text.bondedShort}</Badge>
              ) : null}
              <PurchaseOrderSplitLineageBadge
                tag={purchaseOrder.splitLineageTag}
              />
            </div>
            <p className="mt-1 text-sm text-fg-muted">
              {purchaseOrder.clientCompany.name}
              {purchaseOrder.vessel ? ` · ${purchaseOrder.vessel.name}` : ''}
            </p>
            {parentPurchaseOrder ? (
              <Link
                to="/secured/purchase-orders/$purchaseOrderId"
                params={{
                  purchaseOrderId: String(parentPurchaseOrder.id),
                }}
                className="mt-2 inline-flex text-sm font-semibold text-accent hover:text-accent-hover"
              >
                {text.parentPo}: {parentPurchaseOrder.internalNumber}
              </Link>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Can authority={UserAuthority.PURCHASE_ORDER_EDIT}>
              {['PENDING', 'EXPECTED_READINESS', 'READY', 'IN_STOCK'].includes(
                purchaseOrder.status,
              ) ? (
                <Link
                  to="/secured/purchase-orders/$purchaseOrderId/edit"
                  params={{ purchaseOrderId: String(purchaseOrder.id) }}
                  className="inline-flex h-10 items-center rounded-md border border-border-strong px-3.5 text-sm font-semibold"
                >
                  {text.editPurchaseOrder}
                </Link>
              ) : null}
            </Can>
            {purchaseOrder.activeShipment ? (
              <Can authority={UserAuthority.SHIPMENT_VIEW}>
                <Link
                  to="/secured/shipments/$shipmentId"
                  params={{
                    shipmentId: String(purchaseOrder.activeShipment.id),
                  }}
                  className="inline-flex h-10 items-center rounded-md bg-accent px-3.5 text-sm font-semibold text-fg-on-accent"
                >
                  {text.openShipment}{' '}
                  {purchaseOrder.activeShipment.shipmentNumber}
                </Link>
              </Can>
            ) : null}
            {purchaseOrder.status === 'IN_STOCK' ? (
              <Can authority={UserAuthority.SHIPMENT_CREATE}>
                <Link
                  to="/secured/shipments/new"
                  search={{
                    originWarehouseId: String(
                      purchaseOrder.currentWarehouseStay?.warehouse.id ?? '',
                    ),
                    purchaseOrderId: String(purchaseOrder.id),
                    purchaseOrderIds: '',
                  }}
                  className="inline-flex h-10 items-center rounded-md bg-accent px-3.5 text-sm font-semibold text-fg-on-accent"
                >
                  {text.startShipment}
                </Link>
              </Can>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <Tabs defaultValue="overview">
          <div className="overflow-x-auto">
            <TabList className="min-w-max">
              <Tab value="overview">{text.detailOverviewTab}</Tab>
              <Tab value="documents">{text.documentsTab}</Tab>
              <Tab value="collis">
                {text.collisTab} · {purchaseOrder.handlingUnits.length}
              </Tab>
              <Tab value="invoiceRows">
                {text.invoiceRowsTab} · {purchaseOrder.invoiceRows.length}
              </Tab>
              <Tab value="history">{text.historyTab}</Tab>
            </TabList>
          </div>

          <TabPanel value="overview">
            <div className="grid gap-5 lg:grid-cols-2">
              <Section title={text.overview}>
                <Facts
                  items={[
                    [text.client, purchaseOrder.clientCompany.name],
                    [text.supplier, purchaseOrder.supplierCompany?.name],
                    [text.invoiceCompany, purchaseOrder.invoiceCompany?.name],
                    [
                      text.collectionAgent,
                      purchaseOrder.collectionAgentCompany?.name,
                    ],
                    [text.ownerReference, purchaseOrder.ownerReference],
                    [text.supplierReference, purchaseOrder.supplierReference],
                    [text.messageNumber, purchaseOrder.messageNumber],
                    [
                      text.readiness,
                      purchaseOrder.readinessDate
                        ? String(purchaseOrder.readinessDate)
                        : undefined,
                    ],
                    [
                      text.route,
                      [
                        purchaseOrder.originCity?.name ??
                          purchaseOrder.originCountry?.name,
                        purchaseOrder.destinationCity?.name ??
                          purchaseOrder.destinationCountry?.name,
                      ]
                        .filter(Boolean)
                        .join(' → '),
                    ],
                    [text.notes, purchaseOrder.notes],
                  ]}
                />
              </Section>
              <Section title={text.splitLineage}>
                <Facts
                  items={[
                    [
                      text.rootPo,
                      rootPurchaseOrder ? (
                        <Link
                          to="/secured/purchase-orders/$purchaseOrderId"
                          params={{
                            purchaseOrderId: String(rootPurchaseOrder.id),
                          }}
                          className="font-semibold text-accent hover:text-accent-hover"
                        >
                          {rootPurchaseOrder.internalNumber}
                        </Link>
                      ) : null,
                    ],
                    [
                      text.parentPo,
                      parentPurchaseOrder ? (
                        <Link
                          to="/secured/purchase-orders/$purchaseOrderId"
                          params={{
                            purchaseOrderId: String(parentPurchaseOrder.id),
                          }}
                          className="font-semibold text-accent hover:text-accent-hover"
                        >
                          {parentPurchaseOrder.internalNumber}
                        </Link>
                      ) : null,
                    ],
                    [
                      text.childPurchaseOrders,
                      purchaseOrder.childPurchaseOrderIds.length
                        ? purchaseOrder.childPurchaseOrderIds.map(
                            (childPurchaseOrderId) => {
                              const child =
                                purchaseOrder.lineagePurchaseOrders.find(
                                  (candidate) =>
                                    String(candidate.id) ===
                                    String(childPurchaseOrderId),
                                )
                              return (
                                <Link
                                  key={String(childPurchaseOrderId)}
                                  to="/secured/purchase-orders/$purchaseOrderId"
                                  params={{
                                    purchaseOrderId:
                                      String(childPurchaseOrderId),
                                  }}
                                  className="mr-3 inline-flex font-semibold text-accent hover:text-accent-hover"
                                >
                                  {child?.internalNumber ??
                                    `#${String(childPurchaseOrderId)}`}
                                </Link>
                              )
                            },
                          )
                        : null,
                    ],
                    [
                      text.purchaseOrderFamily,
                      purchaseOrder.lineagePurchaseOrders.map((member) => (
                        <Link
                          key={String(member.id)}
                          to="/secured/purchase-orders/$purchaseOrderId"
                          params={{ purchaseOrderId: String(member.id) }}
                          className="mr-3 inline-flex font-semibold text-accent hover:text-accent-hover"
                        >
                          {member.internalNumber}
                        </Link>
                      )),
                    ],
                  ]}
                />
              </Section>
            </div>
          </TabPanel>

          <TabPanel value="documents">
            <AttachmentPanel
              referenceType="purchase-orders"
              referenceId={Number(purchaseOrder.id)}
            />
          </TabPanel>

          <TabPanel value="collis">
            <Section title={text.handlingUnits}>
              <div className="grid gap-3">
                {purchaseOrder.handlingUnits.map((unit) => (
                  <div
                    key={String(unit.id)}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-border p-4"
                  >
                    <div>
                      <Link
                        to="/secured/handling-units/$handlingUnitId"
                        params={{ handlingUnitId: String(unit.id) }}
                        className="font-semibold text-accent"
                      >
                        {unit.trackingCode}
                      </Link>
                      <p className="mt-1 text-sm text-fg-muted">
                        {unit.setDescription ?? text.noDescription} ·{' '}
                        {enumLabel(unit.packageType)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {unit.dangerousGoods ? (
                          <Badge tone="danger">DG</Badge>
                        ) : null}
                        {unit.bonded ? (
                          <Badge tone="warning">{text.bondedShort}</Badge>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>
                        {unit.declaredLengthCm ?? '—'} ×{' '}
                        {unit.declaredWidthCm ?? '—'} ×{' '}
                        {unit.declaredHeightCm ?? '—'} cm
                      </p>
                      <p className="text-fg-muted">
                        {unit.declaredGrossWeightKg ?? '—'} kg
                      </p>
                      {unit.terminalDisposition ? (
                        <p className="font-semibold text-danger-fg">
                          {enumLabel(unit.terminalDisposition.disposition)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </TabPanel>

          <TabPanel value="invoiceRows">
            <Section title={text.invoiceRows}>
              <InvoiceRowsTable purchaseOrder={purchaseOrder} />
            </Section>
          </TabPanel>

          <TabPanel value="history">
            <div className="space-y-5">
              <Section title={text.warehouseStays}>
                <Timeline
                  rows={purchaseOrder.warehouseStays.map((stay) => ({
                    id: String(stay.id),
                    title: `${stay.warehouse.code} · ${enumLabel(stay.state)}`,
                    detail: [
                      stay.storagePosition,
                      stay.arrivedAt
                        ? `${text.arrived} ${dateTime(String(stay.arrivedAt))}`
                        : null,
                      stay.stockedAt
                        ? `${text.stocked} ${dateTime(String(stay.stockedAt))}`
                        : null,
                      stay.departedAt
                        ? `${text.departed} ${dateTime(String(stay.departedAt))}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · '),
                  }))}
                />
              </Section>
              <div className="grid gap-5 lg:grid-cols-2">
                <Section title={text.statusHistory}>
                  <Timeline
                    rows={purchaseOrder.statusTransitions.map((transition) => ({
                      id: String(transition.id),
                      title: `${enumLabel(transition.fromStatus)} → ${enumLabel(transition.toStatus)}`,
                      detail: `${dateTime(String(transition.occurredAt))}${transition.reason ? ` · ${transition.reason}` : ''}`,
                    }))}
                  />
                </Section>
                <Section title={text.lineageActivity}>
                  <Timeline
                    rows={purchaseOrder.lineageActivities.map((activity) => ({
                      id: `${String(activity.purchaseOrderId)}-${String(activity.activityId)}`,
                      title: `${activity.purchaseOrderInternalNumber} · ${enumLabel(activity.activityType)}`,
                      detail: `${dateTime(String(activity.createdAt))}${activity.message ? ` · ${activity.message}` : ''}`,
                    }))}
                  />
                </Section>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </section>

      <Can authority={UserAuthority.PURCHASE_ORDER_EDIT}>
        <PurchaseOrderActions purchaseOrder={purchaseOrder} />
      </Can>
    </div>
  )
}

export function PurchaseOrderActions({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrder
}) {
  const { text, enumLabel } = usePurchaseOrderLabels()
  const movable = purchaseOrder.handlingUnits.filter(
    (unit) => !unit.terminalDisposition,
  )
  const { toast } = useToast()
  const [error, setError] = useState('')
  const [readinessDate, setReadinessDate] = useState('')
  const [remark, setRemark] = useState('')
  const [readyRemark, setReadyRemark] = useState('')
  const [correctedStatus, setCorrectedStatus] = useState('')
  const [correctionReadinessDate, setCorrectionReadinessDate] = useState('')
  const [correctionReason, setCorrectionReason] = useState('')
  const [storagePosition, setStoragePosition] = useState('')
  const [stockConfirmationOpen, setStockConfirmationOpen] = useState(false)
  const stockConfirmationSubmitting = useRef(false)
  const [splitIds, setSplitIds] = useState<Array<string>>([])
  const [reason, setReason] = useState('')
  const [terminalId, setTerminalId] = useState('')
  const [disposition, setDisposition] = useState('DAMAGED')
  const [message, setMessage] = useState('')
  const [measurements, setMeasurements] = useState(() =>
    Object.fromEntries(
      movable.map((unit) => [
        String(unit.id),
        {
          lengthCm: String(unit.declaredLengthCm ?? ''),
          widthCm: String(unit.declaredWidthCm ?? ''),
          heightCm: String(unit.declaredHeightCm ?? ''),
          grossWeightKg: String(unit.declaredGrossWeightKg ?? ''),
          netWeightKg: String(unit.declaredNetWeightKg ?? ''),
        },
      ]),
    ),
  )
  type CommandDocument = { name: string; gql: RequestDocument }
  type CommandPayload = {
    document: CommandDocument
    variables: Variables
  }
  const mutation = usePurchaseOrderCommand<CommandPayload, unknown>(
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
      return true
    } catch (caught) {
      setError((caught as Error).message)
      return false
    }
  }

  async function confirmStockEntry() {
    if (stockConfirmationSubmitting.current) return
    stockConfirmationSubmitting.current = true
    const succeeded = await run(
      purchaseOrderDocuments.confirmStock,
      {
        id: Number(purchaseOrder.id),
        input: {
          storagePosition,
          measurements: movable.map((unit) => {
            const values = measurements[String(unit.id)]
            return {
              handlingUnitId: Number(unit.id),
              lengthCm: Number(values.lengthCm),
              widthCm: Number(values.widthCm),
              heightCm: Number(values.heightCm),
              grossWeightKg: Number(values.grossWeightKg),
              netWeightKg: values.netWeightKg
                ? Number(values.netWeightKg)
                : null,
            }
          }),
        },
      },
      purchaseOrder.status === 'READY'
        ? text.arrivalAndStockRecorded
        : text.stockConfirmed,
    )
    stockConfirmationSubmitting.current = false
    if (succeeded) setStockConfirmationOpen(false)
  }

  function closeStockConfirmation() {
    if (!stockConfirmationSubmitting.current) {
      setStockConfirmationOpen(false)
    }
  }

  return (
    <Section title={text.availableActions}>
      {error ? <ErrorMessage message={error} /> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <ReadinessReminderAction
          purchaseOrderId={String(purchaseOrder.id)}
          status={purchaseOrder.status}
        />
        {['PENDING', 'EXPECTED_READINESS', 'READY'].includes(
          purchaseOrder.status,
        ) && !purchaseOrder.activeShipment ? (
          <ActionCard title={text.correctPoStatus}>
            <p className="text-sm text-fg-muted">
              {text.correctPoStatusDescription}
            </p>
            <FormField
              label={text.correctedStatus}
              htmlFor="corrected-po-status"
              required
            >
              <Select
                id="corrected-po-status"
                value={correctedStatus}
                onChange={(event) => {
                  setCorrectedStatus(event.target.value)
                  if (event.target.value !== 'EXPECTED_READINESS') {
                    setCorrectionReadinessDate('')
                  }
                }}
              >
                <option value="">{text.selectCorrectedStatus}</option>
                {['PENDING', 'EXPECTED_READINESS', 'READY']
                  .filter((status) => status !== purchaseOrder.status)
                  .map((status) => (
                    <option key={status} value={status}>
                      {enumLabel(status)}
                    </option>
                  ))}
              </Select>
            </FormField>
            {correctedStatus === 'EXPECTED_READINESS' ? (
              <FormField
                label={text.readinessDate}
                htmlFor="correction-readiness-date"
                required
              >
                <Input
                  id="correction-readiness-date"
                  type="date"
                  value={correctionReadinessDate}
                  onChange={(event) =>
                    setCorrectionReadinessDate(event.target.value)
                  }
                />
              </FormField>
            ) : null}
            <FormField
              label={text.correctionReason}
              htmlFor="status-correction-reason"
              required
            >
              <Textarea
                id="status-correction-reason"
                value={correctionReason}
                onChange={(event) => setCorrectionReason(event.target.value)}
              />
            </FormField>
            <Button
              type="button"
              loading={mutation.isPending}
              disabled={
                !correctedStatus ||
                !correctionReason.trim() ||
                (correctedStatus === 'EXPECTED_READINESS' &&
                  !correctionReadinessDate)
              }
              onClick={() =>
                run(
                  purchaseOrderDocuments.correctStatus,
                  {
                    id: Number(purchaseOrder.id),
                    input: {
                      status: correctedStatus,
                      readinessDate:
                        correctedStatus === 'EXPECTED_READINESS'
                          ? correctionReadinessDate
                          : null,
                      reason: correctionReason.trim(),
                    },
                  },
                  text.statusCorrected,
                )
              }
            >
              {text.correctPoStatus}
            </Button>
          </ActionCard>
        ) : null}
        {purchaseOrder.status === 'PENDING' ? (
          <ActionCard title={text.setReadiness}>
            <DatePicker
              value={parseIsoDate(readinessDate)}
              onChange={(date) => setReadinessDate(formatIsoDate(date))}
            />
            <Input
              placeholder={text.remark}
              value={remark}
              onChange={(event) => setRemark(event.target.value)}
            />
            <Button
              type="button"
              disabled={!readinessDate}
              onClick={() =>
                run(
                  purchaseOrderDocuments.readiness,
                  {
                    id: Number(purchaseOrder.id),
                    input: { readinessDate, remark: remark || null },
                  },
                  text.readinessRecorded,
                )
              }
            >
              {text.setReadiness}
            </Button>
          </ActionCard>
        ) : null}
        {purchaseOrder.status === 'EXPECTED_READINESS' ? (
          <ActionCard title={text.markReady}>
            <p className="text-sm text-fg-muted">{text.readyDescription}</p>
            <Input
              placeholder={text.remark}
              value={readyRemark}
              onChange={(event) => setReadyRemark(event.target.value)}
            />
            <Button
              type="button"
              onClick={() =>
                run(
                  purchaseOrderDocuments.ready,
                  {
                    id: Number(purchaseOrder.id),
                    input: { remark: readyRemark || null },
                  },
                  text.readyRecorded,
                )
              }
            >
              {text.markReady}
            </Button>
          </ActionCard>
        ) : null}
        {(purchaseOrder.status === 'READY' ||
          purchaseOrder.status === 'AWAITING_IMPORT') &&
        purchaseOrder.currentWarehouseStay ? (
          <div className="lg:col-span-2">
            <ActionCard
              title={
                purchaseOrder.status === 'READY'
                  ? text.recordArrivalAndSetInStock
                  : text.confirmStock
              }
            >
              <p className="text-sm text-fg-muted">
                {purchaseOrder.currentWarehouseStay.warehouse.name}
              </p>

              <div className="border-t border-border pt-4">
                <h5 className="mb-3 text-sm font-semibold text-fg-muted">
                  {text.finalColliMeasurements}
                </h5>
                <FormField
                  label={text.storagePosition}
                  htmlFor="stock-storage-position"
                  required
                  className="mb-4 max-w-xl"
                >
                  <Input
                    id="stock-storage-position"
                    value={storagePosition}
                    onChange={(event) => setStoragePosition(event.target.value)}
                  />
                </FormField>
                <div className="space-y-3">
                  {movable.map((unit) => {
                    const values = measurements[String(unit.id)]
                    return (
                      <div
                        key={String(unit.id)}
                        className="rounded-md bg-surface-2 p-4"
                      >
                        <p className="mb-3 text-sm font-semibold">
                          {unit.trackingCode}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                          {(
                            [
                              ['lengthCm', text.lengthCm, true],
                              ['widthCm', text.widthCm, true],
                              ['heightCm', text.heightCm, true],
                              ['grossWeightKg', text.grossKg, true],
                              ['netWeightKg', text.netKg, false],
                            ] as const
                          ).map(([field, label, required]) => {
                            const inputId = `measurement-${String(unit.id)}-${field}`
                            return (
                              <FormField
                                key={field}
                                label={label}
                                htmlFor={inputId}
                                required={required}
                              >
                                <Input
                                  id={inputId}
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={values?.[field] ?? ''}
                                  onChange={(event) =>
                                    setMeasurements((current) => ({
                                      ...current,
                                      [String(unit.id)]: {
                                        ...current[String(unit.id)],
                                        [field]: event.target.value,
                                      },
                                    }))
                                  }
                                />
                              </FormField>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {purchaseOrder.currentWarehouseStay.state === 'EXPECTED' ||
              purchaseOrder.currentWarehouseStay.state === 'AT_WAREHOUSE' ? (
                <Button
                  type="button"
                  disabled={
                    movable.length === 0 ||
                    !storagePosition ||
                    movable.some((unit) => {
                      const values = measurements[String(unit.id)]
                      return (
                        !values?.lengthCm ||
                        !values.widthCm ||
                        !values.heightCm ||
                        !values.grossWeightKg
                      )
                    })
                  }
                  onClick={() => setStockConfirmationOpen(true)}
                >
                  {purchaseOrder.status === 'READY'
                    ? text.recordArrivalAndSetInStock
                    : text.confirmStock}
                </Button>
              ) : null}
            </ActionCard>
          </div>
        ) : null}
        {['PENDING', 'EXPECTED_READINESS', 'READY'].includes(
          purchaseOrder.status,
        ) &&
        !purchaseOrder.activeShipment &&
        movable.length > 1 ? (
          <ActionCard title={text.splitSelected}>
            {movable.map((unit) => (
              <label key={String(unit.id)} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={splitIds.includes(String(unit.id))}
                  onChange={(event) =>
                    setSplitIds((current) =>
                      event.target.checked
                        ? [...current, String(unit.id)]
                        : current.filter((id) => id !== String(unit.id)),
                    )
                  }
                />
                {unit.trackingCode}
              </label>
            ))}
            <Input
              placeholder={text.operationalReason}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <Button
              type="button"
              disabled={!reason || splitIds.length === 0}
              onClick={() =>
                run(
                  purchaseOrderDocuments.split,
                  {
                    id: Number(purchaseOrder.id),
                    input: {
                      handlingUnitIds: splitIds.map(Number),
                      reason: 'OTHER',
                      remark: reason,
                    },
                  },
                  text.childPoCreated,
                )
              }
            >
              {text.splitCollis}
            </Button>
          </ActionCard>
        ) : null}
        {['PENDING', 'EXPECTED_READINESS', 'READY', 'IN_STOCK'].includes(
          purchaseOrder.status,
        ) &&
        !purchaseOrder.activeShipment &&
        movable.length ? (
          <ActionCard title={text.terminalDisposition}>
            <Select
              value={terminalId}
              onChange={(event) => setTerminalId(event.target.value)}
            >
              <option value="">{text.selectColli}</option>
              {movable.map((unit) => (
                <option key={String(unit.id)} value={String(unit.id)}>
                  {unit.trackingCode}
                </option>
              ))}
            </Select>
            <Select
              value={disposition}
              onChange={(event) => setDisposition(event.target.value)}
            >
              {[
                'DAMAGED',
                'UNCOLLECTABLE',
                'MISSING',
                'CANCELLED',
                'OTHER',
              ].map((value) => (
                <option key={value} value={value}>
                  {enumLabel(value)}
                </option>
              ))}
            </Select>
            <Input
              placeholder={text.reason}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <Button
              type="button"
              disabled={!terminalId || !reason}
              onClick={() =>
                run(
                  purchaseOrderDocuments.disposition,
                  {
                    purchaseOrderId: Number(purchaseOrder.id),
                    handlingUnitId: Number(terminalId),
                    input: { disposition, reason },
                  },
                  text.dispositionRecorded,
                )
              }
            >
              {text.recordDisposition}
            </Button>
          </ActionCard>
        ) : null}
        <ActionCard title={text.addActivityMessage}>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Button
            type="button"
            disabled={!message.trim()}
            onClick={() =>
              run(
                purchaseOrderDocuments.message,
                { id: Number(purchaseOrder.id), message },
                text.messageAdded,
              )
            }
          >
            {text.addMessage}
          </Button>
        </ActionCard>
      </div>
      <Modal
        open={stockConfirmationOpen}
        onClose={closeStockConfirmation}
        title={text.confirmInStockTitle}
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
              onClick={closeStockConfirmation}
            >
              {text.cancel}
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={mutation.isPending}
              onClick={confirmStockEntry}
            >
              {text.confirmStockEntry}
            </Button>
          </>
        }
      >
        <p>
          <span className="font-semibold text-fg">
            {purchaseOrder.internalNumber}
          </span>{' '}
          {text.confirmInStockWarning}
        </p>
      </Modal>
    </Section>
  )
}

function InvoiceRowsTable({ purchaseOrder }: { purchaseOrder: PurchaseOrder }) {
  const { text, enumLabel } = usePurchaseOrderLabels()
  if (!purchaseOrder.invoiceRows.length) {
    return <p className="text-sm text-fg-muted">{text.noInvoiceRows}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-fg-subtle">
            <th className="px-3 py-2">{text.lineNumber}</th>
            <th className="px-3 py-2">{text.description}</th>
            <th className="px-3 py-2">{text.hsCode}</th>
            <th className="px-3 py-2">{text.quantity}</th>
            <th className="px-3 py-2">{text.unit}</th>
            <th className="px-3 py-2 text-right">{text.totalValue}</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrder.invoiceRows.map((row) => (
            <tr
              key={String(row.id)}
              className="border-b border-border last:border-0"
            >
              <td className="px-3 py-3 text-fg-muted">{row.lineNumber}</td>
              <td className="px-3 py-3 font-medium">{row.description}</td>
              <td className="px-3 py-3">{row.hsCode || '—'}</td>
              <td className="px-3 py-3">{row.quantity}</td>
              <td className="px-3 py-3">{enumLabel(row.unit)}</td>
              <td className="px-3 py-3 text-right font-medium">
                {row.totalValue.amount ?? '—'} {row.totalValue.currency ?? ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function ActionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="space-y-3 rounded-md border border-border p-4">
      <h4 className="font-semibold">{title}</h4>
      {children}
    </div>
  )
}

function Facts({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            {label}
          </dt>
          <dd className="mt-1 text-sm">{value || '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

function Timeline({
  rows,
}: {
  rows: Array<{ id: string; title: string; detail: string }>
}) {
  if (!rows.length) return <p className="text-sm text-fg-muted">No records.</p>
  return (
    <ol className="space-y-3">
      {rows.map((row) => (
        <li key={row.id} className="border-l-2 border-accent pl-3">
          <p className="text-sm font-semibold">{row.title}</p>
          <p className="text-xs text-fg-muted">{row.detail}</p>
        </li>
      ))}
    </ol>
  )
}

const dateTime = (value: string) => new Date(value).toLocaleString()

