import { useState } from 'react'
import { useAppForm } from '#/components/form'
import { Button } from '#/components/ui/button'
import { FormField, Input, Textarea } from '#/components/ui/input'
import { Select } from '#/components/ui/select'
import { Checkbox } from '#/components/ui/choice'
import { Tab, TabList, TabPanel, Tabs } from '#/components/ui/tabs'
import { ErrorMessage } from '#/components/feedback/error-message'
import type { PurchaseOrder } from '../types'
import {
  HandlingUnitPackageType,
  type HandlingUnitFormValue,
  type PurchaseOrderFormOptions,
  type PurchaseOrderFormValues,
  PurchaseOrderInvoiceUnit,
  type PurchaseOrderInvoiceRowFormValue,
} from '../types'
import { usePurchaseOrderLabels } from '../localization/purchase-order-labels'
import {
  validatePurchaseOrderFormTabs,
  type PurchaseOrderFormTabErrors,
  type PurchaseOrderFormValidationError,
} from './purchase-order-form-validation'
import { eligibleInvoicingAssignments } from './purchase-order-invoice-options'

const emptyHandlingUnit = (): HandlingUnitFormValue => ({
  pcs: '1',
  setDescription: '',
  lengthCm: '',
  widthCm: '',
  heightCm: '',
  grossWeightKg: '',
  netWeightKg: '',
  volumeWeightRoadKg: '',
  volumeWeightSeaKg: '',
  volumeWeightAirKg: '',
  volumeWeightCourierKg: '',
  packageType: HandlingUnitPackageType.CARDBOARD_BOX,
  dangerousGoods: false,
  bonded: false,
  dangerousGoodsClass: '',
  importDeliveryNote: '',
  notes: '',
})

const emptyInvoiceRow = (
  currency: string,
): PurchaseOrderInvoiceRowFormValue => ({
  description: '',
  hsCode: '',
  quantity: '1',
  unit: PurchaseOrderInvoiceUnit.PC,
  totalAmount: '',
  currency,
})

const handlingUnitsEditable = (purchaseOrder?: PurchaseOrder | null) =>
  !purchaseOrder ||
  (['PENDING', 'EXPECTED_READINESS', 'READY', 'IN_STOCK'].includes(
    purchaseOrder.status,
  ) &&
    !purchaseOrder.activeShipment)

type PurchaseOrderFormTab = keyof PurchaseOrderFormTabErrors

export function PurchaseOrderForm({
  purchaseOrder,
  options,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  purchaseOrder?: PurchaseOrder | null
  options: PurchaseOrderFormOptions
  error?: string
  submitLabel: string
  onSubmit: (values: PurchaseOrderFormValues) => Promise<void> | void
  onCancel: () => void
}) {
  const { text, enumLabel } = usePurchaseOrderLabels()
  const [activeTab, setActiveTab] = useState<PurchaseOrderFormTab>('general')
  const [submissionAttempted, setSubmissionAttempted] = useState(false)
  const defaults: PurchaseOrderFormValues = {
    clientCompanyId: String(purchaseOrder?.clientCompany.id ?? ''),
    vesselId: String(purchaseOrder?.vessel?.id ?? ''),
    supplierCompanyId: String(purchaseOrder?.supplierCompany?.id ?? ''),
    invoiceCompanyId: String(purchaseOrder?.invoiceCompany?.id ?? ''),
    collectionAgentCompanyId: String(
      purchaseOrder?.collectionAgentCompany?.id ?? '',
    ),
    openingWarehouseId: String(
      purchaseOrder?.warehouseStays[0]?.warehouse.id ?? '',
    ),
    messageNumber: purchaseOrder?.messageNumber ?? '',
    ownerReference: purchaseOrder?.ownerReference ?? '',
    supplierReference: purchaseOrder?.supplierReference ?? '',
    urgent: purchaseOrder?.urgent ?? false,
    readinessDate: purchaseOrder?.readinessDate
      ? String(purchaseOrder.readinessDate)
      : '',
    readinessRemark: purchaseOrder?.readinessRemark ?? '',
    deliveryNoteImport: purchaseOrder?.deliveryNoteImport ?? '',
    deliveryNoteExport: purchaseOrder?.deliveryNoteExport ?? '',
    originCountryId: String(purchaseOrder?.originCountry?.id ?? ''),
    originCityId: String(purchaseOrder?.originCity?.id ?? ''),
    destinationCountryId: String(purchaseOrder?.destinationCountry?.id ?? ''),
    destinationCityId: String(purchaseOrder?.destinationCity?.id ?? ''),
    pickupInGreece: purchaseOrder?.pickupInGreece ?? true,
    mrn: purchaseOrder?.mrn ?? '',
    alk: purchaseOrder?.alk ?? '',
    kta: purchaseOrder?.kta ?? false,
    valueExclVatAmount: String(purchaseOrder?.valueExclVat?.amount ?? ''),
    valueExclVatCurrency: purchaseOrder?.valueExclVat?.currency ?? '',
    valueInclVatAmount: String(purchaseOrder?.valueInclVat?.amount ?? ''),
    valueInclVatCurrency: purchaseOrder?.valueInclVat?.currency ?? '',
    dutiesAmount: String(purchaseOrder?.duties?.amount ?? ''),
    dutiesCurrency: purchaseOrder?.duties?.currency ?? '',
    urgentInformation: purchaseOrder?.urgentInformation ?? '',
    notes: purchaseOrder?.notes ?? '',
    handlingUnits: handlingUnitsEditable(purchaseOrder)
      ? purchaseOrder
        ? purchaseOrder.handlingUnits
            .filter((unit) => !unit.terminalDisposition)
            .map((unit) => ({
              id: String(unit.id),
              pcs: String(unit.pcs ?? ''),
              setDescription: unit.setDescription ?? '',
              lengthCm: String(unit.declaredLengthCm ?? ''),
              widthCm: String(unit.declaredWidthCm ?? ''),
              heightCm: String(unit.declaredHeightCm ?? ''),
              grossWeightKg: String(unit.declaredGrossWeightKg ?? ''),
              netWeightKg: String(unit.declaredNetWeightKg ?? ''),
              volumeWeightRoadKg: String(unit.volumeWeightRoadKg ?? ''),
              volumeWeightSeaKg: String(unit.volumeWeightSeaKg ?? ''),
              volumeWeightAirKg: String(unit.volumeWeightAirKg ?? ''),
              volumeWeightCourierKg: String(unit.volumeWeightCourierKg ?? ''),
              packageType: unit.packageType as HandlingUnitPackageType,
              dangerousGoods: unit.dangerousGoods,
              bonded: unit.bonded,
              dangerousGoodsClass: unit.dangerousGoodsClass ?? '',
              importDeliveryNote: unit.importDeliveryNote ?? '',
              notes: unit.notes ?? '',
            }))
        : []
      : [],
    invoiceRows:
      purchaseOrder?.invoiceRows.map((row) => ({
        id: String(row.id),
        description: row.description,
        hsCode: row.hsCode ?? '',
        quantity: String(row.quantity),
        unit: row.unit as PurchaseOrderInvoiceUnit,
        totalAmount: String(row.totalValue.amount ?? ''),
        currency: row.totalValue.currency ?? '',
      })) ?? [],
  }
  const form = useAppForm({
    defaultValues: defaults,
    onSubmit: ({ value }) => onSubmit(value),
  })
  const cities = options.cities.map((city) => ({
    id: String(city.id),
    countryId: String(city.countryId),
    name: city.name,
  }))
  const currencyOptions = Array.from(
    new Map(
      options.countries.map((country) => [
        country.currencyCode,
        {
          value: country.currencyCode,
          label: `${country.currencyCode} · ${country.currencyName}`,
        },
      ]),
    ).values(),
  ).sort((left, right) => left.value.localeCompare(right.value))
  const validate = (values: PurchaseOrderFormValues) => {
    const client = options.clients.content.find(
      (company) => String(company.id) === values.clientCompanyId,
    )
    return validatePurchaseOrderFormTabs(
      values,
      Boolean(purchaseOrder),
      {
        vesselRequired: Boolean(client?.vessels.length),
        eligibleInvoiceCompanyIds: eligibleInvoicingAssignments(
          client?.invoicingAssignments ?? [],
          values.vesselId,
        ).map((assignment) => String(assignment.invoicingCompany.id)),
      },
      cities,
    )
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmissionAttempted(true)
        const errors = validate(form.state.values)
        const firstInvalidTab = (
          [
            'general',
            'routeCustoms',
            'operations',
            'collis',
            'invoiceRows',
          ] as const
        ).find((tab) => errors[tab].length)
        if (firstInvalidTab) {
          setActiveTab(firstInvalidTab)
          return
        }
        form.handleSubmit()
      }}
    >
      <form.AppForm>
        {error ? <ErrorMessage message={error} /> : null}
        <form.Subscribe selector={(state) => state.values}>
          {(values) => {
            const validationErrors = validate(values)
            const activeErrors = submissionAttempted
              ? validationErrors[activeTab]
              : []
            const client = options.clients.content.find(
              (company) => String(company.id) === values.clientCompanyId,
            )
            const invoiceAssignments = eligibleInvoicingAssignments(
              client?.invoicingAssignments ?? [],
              values.vesselId,
            )
            const originCities = cities.filter(
              (city) => city.countryId === values.originCountryId,
            )
            const destinationCities = cities.filter(
              (city) => city.countryId === values.destinationCountryId,
            )
            const colliCount = handlingUnitsEditable(purchaseOrder)
              ? values.handlingUnits.length
              : (purchaseOrder?.handlingUnits.length ?? 0)
            const invoiceRowsEditable = handlingUnitsEditable(purchaseOrder)
            const defaultInvoiceCurrency = currencyOptions.some(
              (option) => option.value === 'EUR',
            )
              ? 'EUR'
              : ''

            return (
              <>
                <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
                  <Tabs
                    value={activeTab}
                    defaultValue="general"
                    onValueChange={(value) =>
                      setActiveTab(value as PurchaseOrderFormTab)
                    }
                  >
                    <div className="overflow-x-auto">
                      <TabList className="min-w-max">
                        <Tab value="general">
                          <TabLabel
                            label={text.generalTab}
                            invalid={
                              submissionAttempted &&
                              validationErrors.general.length > 0
                            }
                            errorLabel={text.tabHasErrors}
                          />
                        </Tab>
                        <Tab value="routeCustoms">
                          <TabLabel
                            label={text.routeCustomsTab}
                            invalid={
                              submissionAttempted &&
                              validationErrors.routeCustoms.length > 0
                            }
                            errorLabel={text.tabHasErrors}
                          />
                        </Tab>
                        <Tab value="operations">
                          <TabLabel
                            label={text.operationsTab}
                            invalid={
                              submissionAttempted &&
                              validationErrors.operations.length > 0
                            }
                            errorLabel={text.tabHasErrors}
                          />
                        </Tab>
                        <Tab value="collis">
                          <span className="inline-flex items-center gap-2">
                            {text.collisTab}
                            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-fg-muted">
                              {colliCount}
                            </span>
                          </span>
                        </Tab>
                        <Tab value="invoiceRows">
                          <TabLabel
                            label={`${text.invoiceRowsTab} · ${values.invoiceRows.length}`}
                            invalid={
                              submissionAttempted &&
                              validationErrors.invoiceRows.length > 0
                            }
                            errorLabel={text.tabHasErrors}
                          />
                        </Tab>
                      </TabList>
                    </div>

                    {activeErrors.length ? (
                      <ValidationSummary
                        title={text.formValidationSummary}
                        errors={activeErrors}
                        labels={text}
                      />
                    ) : null}

                    <TabPanel value="general">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-base font-semibold">
                          {text.overview}
                        </h2>
                        {!purchaseOrder ? (
                          <p className="text-xs text-danger-fg">
                            {text.requiredFields}
                          </p>
                        ) : null}
                      </div>
                      <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                        {text.parties}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <form.AppField name="clientCompanyId">
                          {(field) => (
                            <field.SelectField
                              label={text.clientCompany}
                              required={!purchaseOrder}
                              disabled={Boolean(purchaseOrder)}
                              options={[
                                { label: text.selectClient, value: '' },
                                ...options.clients.content.map((company) => ({
                                  label: company.name,
                                  value: String(company.id),
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                        <form.AppField name="vesselId">
                          {(field) => (
                            <field.SelectField
                              label={text.vessel}
                              required={Boolean(client?.vessels.length)}
                              disabled={Boolean(purchaseOrder)}
                              options={[
                                { label: text.noVessel, value: '' },
                                ...(client?.vessels ?? []).map((vessel) => ({
                                  label: vessel.name,
                                  value: String(vessel.id),
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                        <form.AppField name="invoiceCompanyId">
                          {(field) => (
                            <field.SelectField
                              label={text.invoiceCompany}
                              options={[
                                { label: text.noInvoiceCompany, value: '' },
                                ...invoiceAssignments.map((assignment) => ({
                                  label: assignment.invoicingCompany.name,
                                  value: String(assignment.invoicingCompany.id),
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                        <form.AppField name="supplierCompanyId">
                          {(field) => (
                            <field.SelectField
                              label={text.supplierCompany}
                              options={[
                                { label: text.noSupplier, value: '' },
                                ...options.suppliers.content.map((company) => ({
                                  label: company.name,
                                  value: String(company.id),
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                        <div className="flex flex-col gap-3">
                          <form.AppField name="pickupInGreece">
                            {(field) => (
                              <field.CheckboxField
                                label={text.pickupInGreece}
                              />
                            )}
                          </form.AppField>
                          <form.AppField name="collectionAgentCompanyId">
                            {(field) => (
                              <field.SelectField
                                label={text.collectionAgent}
                                options={[
                                  { label: text.noCollectionAgent, value: '' },
                                  ...options.agents.content.map((company) => ({
                                    label: company.name,
                                    value: String(company.id),
                                  })),
                                ]}
                              />
                            )}
                          </form.AppField>
                        </div>
                        <form.AppField name="openingWarehouseId">
                          {(field) => (
                            <field.SelectField
                              label={text.openingWarehouse}
                              required={!purchaseOrder}
                              disabled={Boolean(purchaseOrder)}
                              options={[
                                { label: text.selectWarehouse, value: '' },
                                ...options.warehouses.map((warehouse) => ({
                                  label: `${warehouse.code} · ${warehouse.name}`,
                                  value: String(warehouse.id),
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                      </div>

                      <div className="mt-5 border-t border-border pt-4">
                        <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                          {text.referencesAndCustoms}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {(
                            [
                              ['ownerReference', text.ownerReference, true],
                              [
                                'supplierReference',
                                text.supplierReference,
                                false,
                              ],
                              ['messageNumber', text.messageNumber, false],
                            ] as const
                          ).map(([name, label, required]) => (
                            <form.AppField key={name} name={name}>
                              {(field) => (
                                <field.TextField
                                  label={label}
                                  required={required}
                                />
                              )}
                            </form.AppField>
                          ))}
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value="routeCustoms">
                      <h2 className="mb-3 text-base font-semibold">
                        {text.routeDetails}
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        <form.AppField name="originCountryId">
                          {(field) => (
                            <field.SelectField
                              label={text.originCountry}
                              searchable
                              onValueChange={(countryId) => {
                                const selectedCity = cities.find(
                                  (city) => city.id === values.originCityId,
                                )
                                if (
                                  selectedCity &&
                                  selectedCity.countryId !== countryId
                                ) {
                                  form.setFieldValue('originCityId', '')
                                }
                              }}
                              options={[
                                { label: text.noCountry, value: '' },
                                ...options.countries.map((country) => ({
                                  label: country.name,
                                  value: String(country.id),
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                        <form.AppField name="originCityId">
                          {(field) => (
                            <field.SelectField
                              label={text.originCity}
                              searchable
                              disabled={!values.originCountryId}
                              options={[
                                { label: text.noCity, value: '' },
                                ...originCities.map((city) => ({
                                  label: city.name,
                                  value: city.id,
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                        <form.AppField name="destinationCountryId">
                          {(field) => (
                            <field.SelectField
                              label={text.destinationCountry}
                              searchable
                              onValueChange={(countryId) => {
                                const selectedCity = cities.find(
                                  (city) =>
                                    city.id === values.destinationCityId,
                                )
                                if (
                                  selectedCity &&
                                  selectedCity.countryId !== countryId
                                ) {
                                  form.setFieldValue('destinationCityId', '')
                                }
                              }}
                              options={[
                                { label: text.noCountry, value: '' },
                                ...options.countries.map((country) => ({
                                  label: country.name,
                                  value: String(country.id),
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                        <form.AppField name="destinationCityId">
                          {(field) => (
                            <field.SelectField
                              label={text.destinationCity}
                              searchable
                              disabled={!values.destinationCountryId}
                              options={[
                                { label: text.noCity, value: '' },
                                ...destinationCities.map((city) => ({
                                  label: city.name,
                                  value: city.id,
                                })),
                              ]}
                            />
                          )}
                        </form.AppField>
                      </div>

                      <div className="mt-5 border-t border-border pt-4">
                        <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                          {text.customsDocuments}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <form.AppField name="mrn">
                            {(field) => <field.TextField label="MRN" />}
                          </form.AppField>
                          <form.AppField name="alk">
                            {(field) => <field.TextField label="ALK" />}
                          </form.AppField>
                          <form.AppField name="deliveryNoteImport">
                            {(field) => (
                              <field.TextField
                                label={text.deliveryNoteImport}
                                maxLength={255}
                              />
                            )}
                          </form.AppField>
                          <form.AppField name="deliveryNoteExport">
                            {(field) => (
                              <field.TextField
                                label={text.deliveryNoteExport}
                                maxLength={255}
                              />
                            )}
                          </form.AppField>
                        </div>
                        <div className="mt-4 rounded-md bg-surface-2 p-4">
                          <form.AppField name="kta">
                            {(field) => (
                              <field.CheckboxField label={text.kta} />
                            )}
                          </form.AppField>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-border pt-4">
                        <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                          {text.customsValues}
                        </h3>
                        <div className="grid gap-4 lg:grid-cols-3">
                          {(
                            [
                              [
                                'valueExclVatAmount',
                                'valueExclVatCurrency',
                                text.valueExclVat,
                              ],
                              [
                                'valueInclVatAmount',
                                'valueInclVatCurrency',
                                text.valueInclVat,
                              ],
                              ['dutiesAmount', 'dutiesCurrency', text.duties],
                            ] as const
                          ).map(([amountName, currencyName, label]) => (
                            <div
                              key={amountName}
                              className="rounded-md border border-border p-4"
                            >
                              <h4 className="mb-3 text-sm font-semibold">
                                {label}
                              </h4>
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <form.AppField name={amountName}>
                                  {(field) => (
                                    <field.TextField
                                      label={text.amount}
                                      type="number"
                                      min="0"
                                      step="0.01"
                                    />
                                  )}
                                </form.AppField>
                                <form.AppField name={currencyName}>
                                  {(field) => (
                                    <field.SelectField
                                      label={text.currency}
                                      searchable
                                      options={[
                                        { label: text.noCurrency, value: '' },
                                        ...currencyOptions,
                                      ]}
                                    />
                                  )}
                                </form.AppField>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value="operations">
                      <h2 className="mb-3 text-base font-semibold">
                        {text.operationalSettings}
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {!purchaseOrder ? (
                          <form.AppField name="readinessDate">
                            {(field) => (
                              <field.DateField label={text.readinessDate} />
                            )}
                          </form.AppField>
                        ) : null}
                        <form.AppField name="readinessRemark">
                          {(field) => (
                            <field.TextField label={text.readinessRemark} />
                          )}
                        </form.AppField>
                      </div>
                      <div className="mt-4 rounded-md bg-surface-2 p-4">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                          <form.AppField name="urgent">
                            {(field) => (
                              <field.CheckboxField label={text.urgent} />
                            )}
                          </form.AppField>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-border pt-4">
                        <h3 className="mb-3 text-sm font-semibold text-fg-muted">
                          {text.additionalInformation}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <form.AppField name="urgentInformation">
                            {(field) => (
                              <FormField label={text.urgentInformation}>
                                <Textarea
                                  rows={3}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(event) =>
                                    field.handleChange(event.target.value)
                                  }
                                />
                              </FormField>
                            )}
                          </form.AppField>
                          <form.AppField name="notes">
                            {(field) => (
                              <FormField label={text.notes}>
                                <Textarea
                                  rows={3}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(event) =>
                                    field.handleChange(event.target.value)
                                  }
                                />
                              </FormField>
                            )}
                          </form.AppField>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value="collis">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-base font-semibold">
                            {text.handlingUnits}
                          </h2>
                          <p className="text-sm text-fg-muted">
                            {handlingUnitsEditable(purchaseOrder)
                              ? text.handlingUnitsHint
                              : text.collisReadOnly}
                          </p>
                        </div>
                        {handlingUnitsEditable(purchaseOrder) ? (
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                form.setFieldValue('handlingUnits', [
                                  ...values.handlingUnits,
                                  emptyHandlingUnit(),
                                ])
                              }
                            >
                              {text.addColli}
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                form.setFieldValue('handlingUnits', [
                                  ...values.handlingUnits,
                                  {
                                    ...(values.handlingUnits.at(-1) ??
                                      emptyHandlingUnit()),
                                  },
                                ])
                              }
                            >
                              {text.addIdentical}
                            </Button>
                          </div>
                        ) : null}
                      </div>
                      {handlingUnitsEditable(purchaseOrder) ? (
                        <div className="space-y-4">
                          {values.handlingUnits.map((unit, index) => (
                            <HandlingUnitRow
                              key={unit.id ?? index}
                              index={index}
                              text={text}
                              enumLabel={enumLabel}
                              value={unit}
                              canRemove={values.handlingUnits.length > 1}
                              onChange={(next) =>
                                form.setFieldValue('handlingUnits', [
                                  ...values.handlingUnits.slice(0, index),
                                  next,
                                  ...values.handlingUnits.slice(index + 1),
                                ])
                              }
                              onRemove={() =>
                                form.setFieldValue(
                                  'handlingUnits',
                                  values.handlingUnits.filter(
                                    (_, row) => row !== index,
                                  ),
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : null}
                    </TabPanel>

                    <TabPanel value="invoiceRows">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-base font-semibold">
                            {text.invoiceRows}
                          </h2>
                          <p className="text-sm text-fg-muted">
                            {text.invoiceRowsHint}
                          </p>
                        </div>
                        {invoiceRowsEditable ? (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              form.setFieldValue('invoiceRows', [
                                ...values.invoiceRows,
                                emptyInvoiceRow(defaultInvoiceCurrency),
                              ])
                            }
                          >
                            {text.addInvoiceRow}
                          </Button>
                        ) : null}
                      </div>
                      <div className="space-y-4">
                        {values.invoiceRows.map((row, index) => (
                          <InvoiceRow
                            key={row.id ?? index}
                            index={index}
                            value={row}
                            currencyOptions={currencyOptions}
                            text={text}
                            enumLabel={enumLabel}
                            onChange={
                              invoiceRowsEditable
                                ? (next) =>
                                    form.setFieldValue('invoiceRows', [
                                      ...values.invoiceRows.slice(0, index),
                                      next,
                                      ...values.invoiceRows.slice(index + 1),
                                    ])
                                : undefined
                            }
                            onRemove={
                              invoiceRowsEditable
                                ? () =>
                                    form.setFieldValue(
                                      'invoiceRows',
                                      values.invoiceRows.filter(
                                        (_, rowIndex) => rowIndex !== index,
                                      ),
                                    )
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    </TabPanel>
                  </Tabs>
                </section>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={onCancel}>
                    {text.cancel}
                  </Button>
                  <Button type="submit">{submitLabel}</Button>
                </div>
              </>
            )
          }}
        </form.Subscribe>
      </form.AppForm>
    </form>
  )
}

function InvoiceRow({
  index,
  value,
  currencyOptions,
  onChange,
  onRemove,
  text,
  enumLabel,
}: {
  index: number
  value: PurchaseOrderInvoiceRowFormValue
  currencyOptions: Array<{ value: string; label: string }>
  onChange?: (value: PurchaseOrderInvoiceRowFormValue) => void
  onRemove?: () => void
  text: ReturnType<typeof usePurchaseOrderLabels>['text']
  enumLabel: ReturnType<typeof usePurchaseOrderLabels>['enumLabel']
}) {
  const set = (key: keyof PurchaseOrderInvoiceRowFormValue, next: string) =>
    onChange?.({ ...value, [key]: next })

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          {text.invoiceRow} {index + 1}
        </h3>
        {onRemove ? (
          <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
            {text.remove}
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <FormField label={text.description} required className="lg:col-span-4">
          <Input
            required
            disabled={!onChange}
            maxLength={1000}
            value={value.description}
            onChange={(event) => set('description', event.target.value)}
          />
        </FormField>
        <FormField label={text.hsCode} className="lg:col-span-2">
          <Input
            disabled={!onChange}
            maxLength={100}
            value={value.hsCode}
            onChange={(event) => set('hsCode', event.target.value)}
          />
        </FormField>
        <FormField label={text.quantity} required className="lg:col-span-2">
          <Input
            required
            disabled={!onChange}
            type="number"
            min="1"
            step="1"
            value={value.quantity}
            onChange={(event) => set('quantity', event.target.value)}
          />
        </FormField>
        <FormField label={text.unit} required className="lg:col-span-2">
          <Select
            required
            disabled={!onChange}
            value={value.unit}
            onChange={(event) => set('unit', event.target.value)}
          >
            {Object.values(PurchaseOrderInvoiceUnit).map((unit) => (
              <option key={unit} value={unit}>
                {enumLabel(unit)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label={text.totalValue} required className="lg:col-span-2">
          <Input
            required
            disabled={!onChange}
            type="number"
            min="0"
            step="0.01"
            value={value.totalAmount}
            onChange={(event) => set('totalAmount', event.target.value)}
          />
        </FormField>
        <FormField label={text.currency} required className="lg:col-span-3">
          <Select
            required
            disabled={!onChange}
            value={value.currency}
            onChange={(event) => set('currency', event.target.value)}
          >
            <option value="">{text.noCurrency}</option>
            {currencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
    </div>
  )
}

function TabLabel({
  label,
  invalid,
  errorLabel,
}: {
  label: string
  invalid: boolean
  errorLabel: string
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {label}
      {invalid ? (
        <span
          aria-label={errorLabel}
          title={errorLabel}
          className="inline-flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white"
        >
          !
        </span>
      ) : null}
    </span>
  )
}

function ValidationSummary({
  title,
  errors,
  labels,
}: {
  title: string
  errors: Array<PurchaseOrderFormValidationError>
  labels: ReturnType<typeof usePurchaseOrderLabels>['text']
}) {
  return (
    <div
      role="alert"
      className="mt-4 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger-fg"
    >
      <p className="font-semibold">{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {errors.map((validationError) => (
          <li key={validationError}>{labels[validationError]}</li>
        ))}
      </ul>
    </div>
  )
}

function HandlingUnitRow({
  index,
  value,
  canRemove,
  onChange,
  onRemove,
  text,
  enumLabel,
}: {
  index: number
  value: HandlingUnitFormValue
  canRemove: boolean
  onChange: (value: HandlingUnitFormValue) => void
  onRemove: () => void
  text: ReturnType<typeof usePurchaseOrderLabels>['text']
  enumLabel: ReturnType<typeof usePurchaseOrderLabels>['enumLabel']
}) {
  const set = (key: keyof HandlingUnitFormValue, next: string) =>
    onChange({ ...value, [key]: next })
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          {text.colli} {index + 1}
        </h3>
        {canRemove ? (
          <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
            {text.remove}
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <FormField label={text.description} className="lg:col-span-6">
          <Input
            value={value.setDescription}
            onChange={(event) => set('setDescription', event.target.value)}
          />
        </FormField>
        <FormField label={text.packageType} className="lg:col-span-4">
          <Select
            value={value.packageType}
            onChange={(event) => set('packageType', event.target.value)}
          >
            {Object.values(HandlingUnitPackageType).map((type) => (
              <option key={type} value={type}>
                {enumLabel(type)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label={text.pcs} className="lg:col-span-2">
          <Input
            type="number"
            min="1"
            value={value.pcs}
            onChange={(event) => set('pcs', event.target.value)}
          />
        </FormField>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="mb-3 text-sm font-semibold text-fg-muted">
          {text.measurements}
        </h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['lengthCm', text.lengthCm],
            ['widthCm', text.widthCm],
            ['heightCm', text.heightCm],
            ['grossWeightKg', text.grossKg],
            ['netWeightKg', text.netKg],
          ].map(([key, label]) => (
            <FormField key={key} label={label}>
              <Input
                type="number"
                min="0"
                value={String(value[key as keyof HandlingUnitFormValue] ?? '')}
                onChange={(event) =>
                  set(key as keyof HandlingUnitFormValue, event.target.value)
                }
              />
            </FormField>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-border pt-4 lg:grid-cols-2">
        <div className="rounded-md bg-surface-2 p-4">
          <h4 className="mb-3 text-sm font-semibold text-fg-muted">
            {text.handlingAttributes}
          </h4>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Checkbox
              checked={value.dangerousGoods}
              label={text.dangerousGoods}
              onChange={(event) =>
                onChange({
                  ...value,
                  dangerousGoods: event.target.checked,
                  dangerousGoodsClass: event.target.checked
                    ? value.dangerousGoodsClass
                    : '',
                })
              }
            />
            <Checkbox
              checked={value.bonded}
              label={text.bonded}
              onChange={(event) =>
                onChange({ ...value, bonded: event.target.checked })
              }
            />
          </div>
        </div>
        <div className="rounded-md bg-surface-2 p-4">
          <h4 className="mb-3 text-sm font-semibold text-fg-muted">
            {text.colliDocumentation}
          </h4>
          <FormField label={text.importDeliveryNote}>
            <Input
              value={value.importDeliveryNote}
              onChange={(event) =>
                set('importDeliveryNote', event.target.value)
              }
            />
          </FormField>
        </div>
      </div>

      <div className="mt-4">
        <FormField label={text.notes}>
          <Textarea
            rows={3}
            value={value.notes}
            onChange={(event) => set('notes', event.target.value)}
          />
        </FormField>
      </div>
    </div>
  )
}

