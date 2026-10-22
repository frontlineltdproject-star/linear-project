import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useLabels, useLocale } from '#/app/providers/labels-provider'
import { Can, hasAuthority } from '#/features/auth/components/can'
import { useCurrentUserProfile } from '#/features/auth/hooks/use-current-user-profile'
import { UserAuthority } from '#/features/auth/types'
import { Badge, StatusPill } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ErrorMessage } from '#/components/feedback/error-message'
import { FieldErrors, useAppForm } from '#/components/form'
import {
  fieldValidators,
  maxLength,
  required,
} from '#/components/form/validators'
import { FormField, Textarea } from '#/components/ui/input'
import { Modal } from '#/components/ui/modal'
import { useToast } from '#/components/ui/toast'
import { formatDateTime } from '#/lib/date'
import {
  useCreateDeliveryNotes,
  useCancelDeliveryNote,
  useDeliveryNotes,
  useIssueDeliveryNote,
  useUpdateDeliveryNoteDraft,
} from '../hooks/use-delivery-notes'
import {
  DeliveryNoteService,
  type DeliveryNote,
} from '../services/delivery-note-service'
import { DeliveryNoteMovementPurpose } from '../types'
import {
  canPreviewDeliveryNotePdf,
  shouldAutoPrepareDeliveryNotes,
  shouldShowDeliveryNoteDraftForm,
  validateMovementStart,
} from './delivery-note-form-validation'

export function DeliveryNotesCard({ shipmentId }: { shipmentId: string }) {
  const text = useLabels().deliveryNotesText
  const { toast } = useToast()
  const profile = useCurrentUserProfile()
  const query = useDeliveryNotes(shipmentId)
  const create = useCreateDeliveryNotes(shipmentId)
  const attemptedPreparation = useRef(false)
  const canCreate = hasAuthority(
    profile.data,
    UserAuthority.DELIVERY_NOTE_CREATE,
  )

  useEffect(() => {
    if (
      !shouldAutoPrepareDeliveryNotes({
        loaded: query.isSuccess && profile.isSuccess,
        noteCount: query.data?.length ?? 0,
        canCreate,
        attempted: attemptedPreparation.current,
      })
    ) {
      return
    }
    attemptedPreparation.current = true
    create.mutate(undefined, {
      onSuccess: () => toast({ title: text.prepared, tone: 'success' }),
    })
  }, [
    canCreate,
    create,
    profile.isSuccess,
    query.data?.length,
    query.isSuccess,
    text.prepared,
    toast,
  ])

  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <div>
        <div>
          <h3 className="font-semibold">{text.title}</h3>
          <p className="text-xs text-fg-muted">{text.description}</p>
        </div>
      </div>
      {query.isPending ? (
        <p className="mt-4 text-sm text-fg-muted">{text.loading}</p>
      ) : null}
      {query.isError ? (
        <div className="mt-4">
          <ErrorMessage message={(query.error as Error).message} />
        </div>
      ) : null}
      {create.isError ? (
        <div className="mt-4 space-y-3">
          <ErrorMessage message={(create.error as Error).message} />
          <Can authority={UserAuthority.DELIVERY_NOTE_CREATE}>
            <Button
              variant="secondary"
              onClick={() => {
                attemptedPreparation.current = true
                create.mutate(undefined, {
                  onSuccess: () =>
                    toast({ title: text.prepared, tone: 'success' }),
                })
              }}
            >
              {text.retry}
            </Button>
          </Can>
        </div>
      ) : null}
      {create.isPending ? (
        <p className="mt-4 text-sm text-fg-muted">{text.preparing}</p>
      ) : null}
      {query.data?.length ? (
        <DeliveryNoteDraftEditor
          key={query.data
            .map((note) => `${String(note.id)}-${String(note.version)}`)
            .join(':')}
          notes={query.data}
        />
      ) : null}
      {query.data?.length === 0 && !canCreate && !create.isPending ? (
        <p className="mt-4 rounded-md bg-surface-2 p-3 text-sm text-fg-muted">
          {text.empty}
        </p>
      ) : null}
    </section>
  )
}

function DeliveryNoteDraftEditor({ notes }: { notes: Array<DeliveryNote> }) {
  const labels = useLabels()
  const text = labels.deliveryNotesText
  const { toast } = useToast()
  const first = notes[0]
  const update = useUpdateDeliveryNoteDraft(String(first.shipmentId))
  const issue = useIssueDeliveryNote(String(first.shipmentId))
  const cancel = useCancelDeliveryNote(String(first.shipmentId))
  const movementStart = toLocalMovementStart(
    first.movementStartAt == null ? null : String(first.movementStartAt),
  )
  const [movementError, setMovementError] = useState('')
  const [previewingNoteId, setPreviewingNoteId] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState('')
  const [hasSavedDraft, setHasSavedDraft] = useState(
    notes.every((note) => note.movementStartAt != null),
  )
  const issuanceStarted = useRef(false)
  const [issuanceLocked, setIssuanceLocked] = useState(false)
  const [noteToIssue, setNoteToIssue] = useState<DeliveryNote | null>(null)
  const [noteToCancel, setNoteToCancel] = useState<DeliveryNote | null>(null)
  const editable = shouldShowDeliveryNoteDraftForm(
    notes.map((note) => note.status),
  )
  const form = useAppForm({
    defaultValues: {
      issuePlace: first.issuePlace,
      movementStartDate: movementStart.date,
      movementStartTime: movementStart.time,
      vehicleNumber: first.vehicleNumber ?? '',
      movementPurpose:
        (first.movementPurpose as DeliveryNoteMovementPurpose | null) ??
        DeliveryNoteMovementPurpose.SUPPLY_OF_SHIPS_AND_AIRCRAFT,
      otherMovementPurposeTitle: first.otherMovementPurposeTitle ?? '',
      loadingStreet: first.loadingAddress.street,
      loadingNumber: first.loadingAddress.number,
      loadingPostalCode: first.loadingAddress.postalCode,
      loadingCity: first.loadingAddress.city,
      destinationStreet: first.destinationAddress?.street ?? '',
      destinationNumber: first.destinationAddress?.number ?? '',
      destinationPostalCode: first.destinationAddress?.postalCode ?? '',
      destinationCity: first.destinationAddress?.city ?? '',
      notes: first.notes ?? '',
      relatedDocumentNumber: first.relatedDocumentNumber ?? '',
    },
    onSubmit: ({ value }) => {
      if (issuanceStarted.current) return
      const movement = validateMovementStart(
        value.movementStartDate,
        value.movementStartTime,
        text.movementPairRequired,
      )
      if (movement.error) {
        setMovementError(movement.error)
        return
      }
      setMovementError('')
      update.mutate(
        {
          shipmentId: String(first.shipmentId),
          deliveryNotes: notes.map((note) => ({
            deliveryNoteId: String(note.id),
            version: String(note.version),
          })),
          issuePlace: value.issuePlace,
          movementStartAt: movement.value ?? '',
          vehicleNumber: value.vehicleNumber,
          movementPurpose: value.movementPurpose,
          otherMovementPurposeTitle: value.otherMovementPurposeTitle,
          loadingStreet: value.loadingStreet,
          loadingNumber: value.loadingNumber,
          loadingPostalCode: value.loadingPostalCode,
          loadingCity: value.loadingCity,
          destinationStreet: value.destinationStreet,
          destinationNumber: value.destinationNumber,
          destinationPostalCode: value.destinationPostalCode,
          destinationCity: value.destinationCity,
          notes: value.notes,
          relatedDocumentNumber: value.relatedDocumentNumber,
        },
        {
          onSuccess: () => {
            form.reset(value)
            setHasSavedDraft(true)
            toast({ title: text.saved, tone: 'success' })
          },
        },
      )
    },
  })
  const requiredValidators = (label: string, maximum?: number) =>
    maximum
      ? fieldValidators(
          required(labels.validation.required),
          maxLength(
            maximum,
            `${label} ${text.maximumCharacters.replace('{max}', String(maximum))}`,
          ),
        )
      : fieldValidators(required(labels.validation.required))
  const optionalValidators = (label: string, maximum: number) =>
    fieldValidators(
      maxLength(
        maximum,
        `${label} ${text.maximumCharacters.replace('{max}', String(maximum))}`,
      ),
    )
  const confirmIssuance = () => {
    if (!noteToIssue || issuanceStarted.current) return
    const noteId = String(noteToIssue.id)
    issuanceStarted.current = true
    setIssuanceLocked(true)
    setNoteToIssue(null)
    issue.mutate(
      {
        deliveryNoteId: noteId,
        version: String(noteToIssue.version),
      },
      {
        onSuccess: () =>
          toast({
            title: text.issued,
            tone: 'success',
          }),
        onError: () => {
          issuanceStarted.current = false
          setIssuanceLocked(false)
        },
      },
    )
  }
  const confirmCancellation = () => {
    if (!noteToCancel || cancel.isPending) return
    const noteId = String(noteToCancel.id)
    const version = String(noteToCancel.version)
    setNoteToCancel(null)
    cancel.mutate(
      { deliveryNoteId: noteId, version },
      {
        onSuccess: (result) => {
          toast({
            title: text.cancelled,
            tone: 'success',
          })
          if (!result.replacementPrepared) {
            toast({
              title: text.replacementDraftFailed,
              tone: 'warning',
            })
          }
        },
        onError: () =>
          toast({
            title: text.cancelFailed,
            tone: 'danger',
          }),
      },
    )
  }
  const previewDeliveryNote = (note: DeliveryNote) => {
    const noteId = String(note.id)
    setPreviewError('')
    setPreviewingNoteId(noteId)
    DeliveryNoteService.previewPdf(String(note.shipmentId), noteId)
      .catch(() => setPreviewError(text.pdfPreviewFailed))
      .finally(() => setPreviewingNoteId(null))
  }

  return (
    <div className="mt-4 space-y-3">
      <form.Subscribe selector={(state) => state.isDirty}>
        {(isDirty) =>
          notes.map((note) => {
            const noteId = String(note.id)
            const canUseDraftActions = canPreviewDeliveryNotePdf({
              hasSavedDraft,
              isDirty,
              isSaving: update.isPending,
              isPreviewing: previewingNoteId !== null,
            })
            return (
              <DeliveryNoteSummary
                key={noteId}
                note={note}
                previewing={previewingNoteId === noteId}
                issuing={
                  issue.isPending && issue.variables?.deliveryNoteId === noteId
                }
                cancelling={
                  cancel.isPending &&
                  cancel.variables?.deliveryNoteId === noteId
                }
                draftActionsEnabled={canUseDraftActions}
                issueDisabled={
                  !canUseDraftActions || issue.isPending || issuanceLocked
                }
                onPreview={() => previewDeliveryNote(note)}
                onIssue={() => {
                  if (issuanceStarted.current) return
                  setNoteToIssue(note)
                }}
                onCancel={() => setNoteToCancel(note)}
              />
            )
          })
        }
      </form.Subscribe>
      {editable ? (
        <section className="rounded-md border border-border p-4">
          <h4 className="font-semibold">{text.commonDetails}</h4>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setMovementError('')
              form.handleSubmit()
            }}
          >
            <form.AppForm>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <form.AppField
                  name="issuePlace"
                  validators={requiredValidators(text.issuePlace, 255)}
                >
                  {(field) => (
                    <field.TextField
                      label={text.issuePlace}
                      required
                      disabled={!editable}
                      maxLength={255}
                    />
                  )}
                </form.AppField>
                <div className="grid gap-3 sm:grid-cols-2">
                  <form.AppField
                    name="movementStartDate"
                    validators={requiredValidators(text.movementDate)}
                  >
                    {(field) => (
                      <field.DateField
                        label={text.movementDate}
                        required
                        disabled={!editable}
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="movementStartTime"
                    validators={requiredValidators(text.movementTime)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.movementTime}
                        required
                        type="time"
                        disabled={!editable}
                      />
                    )}
                  </form.AppField>
                </div>
                <form.AppField
                  name="vehicleNumber"
                  validators={requiredValidators(text.vehicleNumber, 100)}
                >
                  {(field) => (
                    <field.TextField
                      label={text.vehicleNumber}
                      required
                      disabled={!editable}
                      maxLength={100}
                    />
                  )}
                </form.AppField>
                <form.AppField
                  name="movementPurpose"
                  validators={requiredValidators(text.movementPurpose)}
                >
                  {(field) => (
                    <field.SelectField
                      label={text.movementPurpose}
                      required
                      disabled={!editable}
                      placeholder={text.selectMovementPurpose}
                      options={Object.values(DeliveryNoteMovementPurpose).map(
                        (purpose) => ({
                          value: purpose,
                          label: text.movementPurposeLabels[purpose] ?? purpose,
                        }),
                      )}
                    />
                  )}
                </form.AppField>
                <form.Subscribe
                  selector={(state) => state.values.movementPurpose}
                >
                  {(movementPurpose) =>
                    movementPurpose ===
                    DeliveryNoteMovementPurpose.OTHER_MOVEMENTS ? (
                      <form.AppField
                        name="otherMovementPurposeTitle"
                        validators={requiredValidators(
                          text.otherMovementPurposeTitle,
                          100,
                        )}
                      >
                        {(field) => (
                          <field.TextField
                            label={text.otherMovementPurposeTitle}
                            required
                            disabled={!editable}
                            maxLength={100}
                          />
                        )}
                      </form.AppField>
                    ) : null
                  }
                </form.Subscribe>
                <fieldset className="grid gap-3 rounded-md border border-border p-3 sm:col-span-2 sm:grid-cols-4">
                  <legend className="px-1 text-sm font-medium">
                    {text.loadingAddress}
                  </legend>
                  <form.AppField
                    name="loadingStreet"
                    validators={requiredValidators(text.street, 255)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.street}
                        required
                        disabled={!editable}
                        maxLength={255}
                        fieldClassName="sm:col-span-2"
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="loadingNumber"
                    validators={requiredValidators(text.streetNumber, 40)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.streetNumber}
                        required
                        disabled={!editable}
                        maxLength={40}
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="loadingPostalCode"
                    validators={requiredValidators(text.postalCode, 40)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.postalCode}
                        required
                        disabled={!editable}
                        maxLength={40}
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="loadingCity"
                    validators={requiredValidators(text.city, 255)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.city}
                        required
                        disabled={!editable}
                        maxLength={255}
                        fieldClassName="sm:col-span-2"
                      />
                    )}
                  </form.AppField>
                </fieldset>
                <fieldset className="grid gap-3 rounded-md border border-border p-3 sm:col-span-2 sm:grid-cols-4">
                  <legend className="px-1 text-sm font-medium">
                    {text.destinationAddress}
                  </legend>
                  <form.AppField
                    name="destinationStreet"
                    validators={requiredValidators(text.street, 255)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.street}
                        required
                        disabled={!editable}
                        maxLength={255}
                        fieldClassName="sm:col-span-2"
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="destinationNumber"
                    validators={requiredValidators(text.streetNumber, 40)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.streetNumber}
                        required
                        disabled={!editable}
                        maxLength={40}
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="destinationPostalCode"
                    validators={requiredValidators(text.postalCode, 40)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.postalCode}
                        required
                        disabled={!editable}
                        maxLength={40}
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="destinationCity"
                    validators={requiredValidators(text.city, 255)}
                  >
                    {(field) => (
                      <field.TextField
                        label={text.city}
                        required
                        disabled={!editable}
                        maxLength={255}
                        fieldClassName="sm:col-span-2"
                      />
                    )}
                  </form.AppField>
                </fieldset>
                <form.AppField
                  name="relatedDocumentNumber"
                  validators={optionalValidators(text.relatedDocument, 255)}
                >
                  {(field) => (
                    <field.TextField
                      label={text.relatedDocument}
                      disabled={!editable}
                      maxLength={255}
                    />
                  )}
                </form.AppField>
                <form.AppField
                  name="notes"
                  validators={optionalValidators(text.notes, 2000)}
                >
                  {(field) => (
                    <FormField label={text.notes}>
                      <Textarea
                        disabled={!editable}
                        maxLength={2000}
                        value={field.state.value}
                        invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                      <FieldErrors meta={field.state.meta} />
                    </FormField>
                  )}
                </form.AppField>
              </div>
              {movementError ? (
                <div className="mt-3">
                  <ErrorMessage message={movementError} />
                </div>
              ) : null}
              {update.isError ? (
                <div className="mt-3">
                  <ErrorMessage message={(update.error as Error).message} />
                </div>
              ) : null}
              <div className="mt-4">
                {editable && !issuanceLocked ? (
                  <Can authority={UserAuthority.DELIVERY_NOTE_CREATE}>
                    <form.SubmitButton loading={update.isPending}>
                      {update.isPending ? text.saving : text.save}
                    </form.SubmitButton>
                  </Can>
                ) : null}
              </div>
            </form.AppForm>
          </form>
        </section>
      ) : null}
      {previewError ? <ErrorMessage message={previewError} /> : null}
      {issue.isError ? (
        <ErrorMessage message={(issue.error as Error).message} />
      ) : null}
      {cancel.isError ? (
        <ErrorMessage message={(cancel.error as Error).message} />
      ) : null}
      <Modal
        open={noteToIssue != null}
        onClose={() => setNoteToIssue(null)}
        title={text.issueDeliveryNote}
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNoteToIssue(null)}
            >
              {labels.close}
            </Button>
            <Button type="button" onClick={confirmIssuance}>
              {text.issueDeliveryNote}
            </Button>
          </>
        }
      >
        <p>{text.issueConfirm}</p>
        {noteToIssue ? (
          <p className="mt-2 font-medium text-fg">
            {noteToIssue.recipient.name}
          </p>
        ) : null}
      </Modal>
      <Modal
        open={noteToCancel != null}
        onClose={() => setNoteToCancel(null)}
        title={text.cancelDeliveryNote}
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNoteToCancel(null)}
            >
              {labels.close}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={confirmCancellation}
            >
              {text.cancelDeliveryNote}
            </Button>
          </>
        }
      >
        <p>{text.cancelConfirm}</p>
        {noteToCancel ? (
          <p className="mt-2 font-medium text-fg">
            {noteToCancel.recipient.name}
          </p>
        ) : null}
      </Modal>
    </div>
  )
}

function DeliveryNoteSummary({
  note,
  previewing,
  issuing,
  cancelling,
  draftActionsEnabled,
  issueDisabled,
  onPreview,
  onIssue,
  onCancel,
}: {
  note: DeliveryNote
  previewing: boolean
  issuing: boolean
  cancelling: boolean
  draftActionsEnabled: boolean
  issueDisabled: boolean
  onPreview: () => void
  onIssue: () => void
  onCancel: () => void
}) {
  const text = useLabels().deliveryNotesText
  const { locale } = useLocale()
  const hasFiscalDetails = [
    'ISSUED',
    'CANCELLATION_PENDING',
    'CANCELLED',
  ].includes(note.status)
  return (
    <article className="rounded-md border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">{note.recipient.name}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
            <Badge tone="neutral">
              {text.series} {note.series}
            </Badge>
            <span>
              {note.fiscalNumber == null
                ? text.numberOnIssue
                : `${text.numberPrefix} ${String(note.fiscalNumber)}`}
            </span>
            <span aria-hidden>·</span>
            <span>
              {note.totalCollis}{' '}
              {note.totalCollis === 1 ? text.colli : text.collis}
            </span>
            <span aria-hidden>·</span>
            <span>{note.totalGrossWeightKg} kg</span>
          </div>
        </div>
        <StatusPill
          className="self-start"
          tone={
            note.status === 'SUBMISSION_FAILED'
              ? 'danger'
              : note.status === 'DRAFT'
                ? 'warning'
                : 'info'
          }
        >
          {text.statusLabels[note.status] ?? note.status}
        </StatusPill>
      </div>
      {note.status === 'DRAFT' ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="secondary"
            loading={previewing}
            disabled={!draftActionsEnabled}
            title={!draftActionsEnabled ? text.saveBeforePreview : undefined}
            onClick={onPreview}
          >
            {previewing ? text.previewingPdf : text.previewPdf}
          </Button>
          <Can authority={UserAuthority.DELIVERY_NOTE_ISSUE}>
            <Button
              type="button"
              loading={issuing}
              disabled={issueDisabled}
              title={
                !draftActionsEnabled
                  ? text.saveBeforePreview
                  : text.issueDeliveryNote
              }
              onClick={onIssue}
            >
              {issuing ? text.issuing : text.issueDeliveryNote}
            </Button>
          </Can>
        </div>
      ) : null}
      {note.status === 'SUBMISSION_FAILED' ? (
        <div className="mt-4 border-t border-border pt-4">
          <h5 className="text-sm font-semibold">
            {text.submissionFailureDetails}
          </h5>
          {note.submissionError ? (
            <div className="mt-2">
              <ErrorMessage message={note.submissionError} />
            </div>
          ) : null}
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              loading={previewing}
              onClick={onPreview}
            >
              {previewing ? text.previewingPdf : text.previewPdf}
            </Button>
          </div>
        </div>
      ) : null}
      {hasFiscalDetails ? (
        <div className="mt-4 border-t border-border pt-4">
          <h5 className="text-sm font-semibold">{text.fiscalDetails}</h5>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {note.issuedAt != null ? (
              <div>
                <dt className="text-xs text-fg-muted">{text.issuedAt}</dt>
                <dd className="mt-0.5 font-medium">
                  <time dateTime={String(note.issuedAt)}>
                    {formatDateTime(String(note.issuedAt), locale)}
                  </time>
                </dd>
              </div>
            ) : null}
            {note.mark ? (
              <div>
                <dt className="text-xs text-fg-muted">{text.mark}</dt>
                <dd className="mt-0.5 break-all font-mono font-medium">
                  {note.mark}
                </dd>
              </div>
            ) : null}
            {note.uid ? (
              <div>
                <dt className="text-xs text-fg-muted">{text.uid}</dt>
                <dd className="mt-0.5 break-all font-mono text-xs font-medium">
                  {note.uid}
                </dd>
              </div>
            ) : null}
            {note.cancellationMark ? (
              <div>
                <dt className="text-xs text-fg-muted">
                  {text.cancellationMark}
                </dt>
                <dd className="mt-0.5 break-all font-mono font-medium">
                  {note.cancellationMark}
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              loading={previewing}
              onClick={onPreview}
            >
              {previewing ? text.previewingPdf : text.previewPdf}
            </Button>
            {note.qrUrl ? (
              <a
                className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border-strong bg-surface px-3.5 text-sm font-semibold text-fg transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                href={note.qrUrl}
                target="_blank"
                rel="noreferrer"
              >
                {text.openAadeQr}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : null}
            {note.status === 'ISSUED' ? (
              <Can authority={UserAuthority.DELIVERY_NOTE_CANCEL}>
                <Button
                  type="button"
                  variant="danger"
                  loading={cancelling}
                  disabled={cancelling}
                  onClick={onCancel}
                >
                  {cancelling ? text.cancelling : text.cancelDeliveryNote}
                </Button>
              </Can>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  )
}

export function toLocalMovementStart(value: string | null | undefined) {
  if (!value) return { date: '', time: '' }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { date: '', time: '' }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  const [localDate, localTime] = local.toISOString().slice(0, 16).split('T')
  return { date: localDate, time: localTime }
}

