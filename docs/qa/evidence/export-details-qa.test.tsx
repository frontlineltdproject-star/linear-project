/**
 * Export Details QA, pinned main 6aa259553cd9c86a8aaa157902088aa9a6bca83e.
 * Actual page/cards/hooks/QueryClient/labels/Modal/DatePicker; only service I/O is mocked.
 * Assertions document CURRENT defective behavior, not desired regression expectations.
 * Synthetic data, fixed clock, fetch/XHR/WebSocket blocked. No backend or production E2E.
 * Reproduce from shipment-crash-audit:
 * node node_modules/vitest/vitest.mjs run --configLoader runner src/features/exports/details/export-details-qa.test.tsx
 * Finding/contract/source handoff is appended below after the focused run.
 */
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderDetails } from '#/features/purchase-orders/components/details/test-support'
import { GraphQLExecutorError } from '#/lib/graphql/errors'
import { exportKeys } from '../hooks/use-exports'
import { ExportDetailPage } from './components/export-detail-page'
import type { ExportRecord } from '../services/export-service'

const service = vi.hoisted(() => ({
  get: vi.fn(), files: vi.fn(), vessels: vi.fn(), invoiceOptions: vi.fn(),
  updateDetails: vi.fn(), updateInvoices: vi.fn(), confirmEad: vi.fn(), confirmIe599: vi.fn(), cancel: vi.fn(),
  recordStamping: vi.fn(), ydDocuments: vi.fn(), ydPdf: vi.fn(), upload: vi.fn(), removeFile: vi.fn(), download: vi.fn(),
}))
vi.mock('../services/export-service', async (original) => ({
  ...await original<typeof import('../services/export-service')>(), ExportService: service,
}))

const noFlags = {
  canEditDetails: false, canAddInvoices: false, canRemoveInvoices: false, canConfirmEad: false,
  canConfirmIe599: false, canCancel: false, canRecordStamping: false, canUploadFiles: false,
  canRemoveFiles: false, canPrintYd: false,
}
const editFlags = {
  ...noFlags, canEditDetails: true, canAddInvoices: true, canRemoveInvoices: true, canConfirmEad: true, canCancel: true,
}
const company = { id: 4, name: 'QA Greek Company', vatNumber: '099000101' }
const mrnA = '26GR0000000000000A'
const mrnB = '26GR0000000000000B'
const mrnC = '26GR0000000000000C'
function invoice(id: number) {
  return {
    id, invoiceNumber: `QA-SI-${id}`, invoiceDate: '2026-11-01', invoiceType: 'VAT_EXEMPTION_DOCUMENT',
    vatExemptionStatus: 'NOT_STARTED', stampingDispatchDate: null, stampingReturnDate: null, paperworkSentDate: null,
    cancelled: false, purchaseOrder: { id: 70 + id, internalNumber: `QA-PO-${70 + id}` },
    supplier: { id: 3, name: 'QA Supplier' }, invoicingCompany: company,
    paperworkOnly: false, addedAt: '2026-11-01T10:00:00Z',
  }
}
const event = (date: string) => ({ date, actor: { id: 1, name: 'QA Operator' }, recordedAt: `${date}T10:00:00Z` })
function record(overrides: Record<string, unknown> = {}): ExportRecord {
  return {
    id: 41, exportType: 'GREEK_INVOICING_COMPANY', customsStatus: 'AWAITING_EAD',
    shipment: { id: 5, shipmentNumber: 'QA-SH-5', status: 'PREPARING', transportDocumentType: 'AIR_WAYBILL', transportDocumentNumber: 'QA-AWB' },
    invoicingCompany: company, supplier: null, shipper: company, mrn: mrnA, mrnDate: '2026-11-01',
    deliveredVessel: null, eadConfirmation: null, ie599Confirmation: null,
    protocol: { number: 1001, date: '2026-11-01' }, vatExemptionProcedureRequired: true,
    cancelled: false, cancellation: null, invoices: [invoice(1), invoice(2)],
    connectedOrders: [1, 2].map((id) => ({
      id: 70 + id, internalNumber: `QA-PO-${70 + id}`, supplier: { id: 3, name: 'QA Supplier' },
      invoicingCompany: company, vessel: null, invoiceCount: 1,
    })),
    capabilities: editFlags, version: 3, createdBy: { id: 1, name: 'QA Operator' },
    createdAt: '2026-11-01T09:00:00Z', updatedAt: '2026-11-01T09:00:00Z', ...overrides,
  } as unknown as ExportRecord
}
function awaitingIe599() {
  return record({
    customsStatus: 'AWAITING_IE599', eadConfirmation: event('2026-11-05'),
    capabilities: { ...noFlags, canConfirmIe599: true, canAddInvoices: true },
  })
}
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}
function conflict() {
  return new GraphQLExecutorError('Stale', { cause: null, messages: ['Stale'], classifications: ['CONFLICT'], status: 200 })
}
let saved: ExportRecord
let clients: Array<ReturnType<typeof renderDetails>['queryClient']> = []
let network: ReturnType<typeof vi.fn>
const button = (name: string) => screen.getByRole('button', { name, exact: true }) as HTMLButtonElement
const mrnInput = () => screen.getByPlaceholderText('18 letters or digits') as HTMLInputElement
const setMrn = (value: string) => fireEvent.change(mrnInput(), { target: { value } })
const tab = (name: string | RegExp) => fireEvent.click(screen.getByRole('tab', { name }))
async function open() {
  const result = renderDetails(<ExportDetailPage exportId="41" />)
  clients.push(result.queryClient)
  await screen.findByRole('tab', { name: 'Overview' })
  return result.queryClient
}
async function refresh(client: ReturnType<typeof renderDetails>['queryClient']) {
  await act(async () => { await client.invalidateQueries({ queryKey: exportKeys.detail('41') }) })
  await waitFor(() => expect(client.getQueryData<ExportRecord>(exportKeys.detail('41'))?.version).toBe(saved.version))
  // This visible summary marker proves the observer has rendered the new result.
  await screen.findByText(new RegExp(saved.shipment.shipmentNumber), { selector: 'p' })
}
function markRefresh(next: ExportRecord) {
  return { ...next, shipment: { ...next.shipment, shipmentNumber: 'QA-REFRESHED-SH-5' } }
}
async function chooseDay(dialog: HTMLElement, day: number) {
  fireEvent.click(within(dialog).getByRole('button', { name: 'Choose date' }))
  const dayButton = (await screen.findAllByRole('button', { name: String(day), exact: true }))
    .find((element) => !(element as HTMLButtonElement).disabled)
  expect(dayButton).toBeTruthy()
  fireEvent.click(dayButton!)
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Choose date' }).textContent).toContain(`${String(day).padStart(2, '0')}/11/2026`))
}
async function customsDialog(kind: 'ead' | 'ie599') {
  fireEvent.click(button(kind === 'ead' ? 'Confirm EAD receipt' : 'Confirm positive IE599'))
  const dialog = screen.getByRole('dialog')
  await chooseDay(dialog, 9)
  return dialog
}
function cancelDialog(reason = 'QA deliberate cancellation') {
  fireEvent.click(button('Cancel Export'))
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText(/^Reason/), { target: { value: reason } })
  return dialog
}
const customsFailed = 'The confirmation could not be recorded. Nothing changed. Your date is kept.'
const cancelFailed = 'The Export could not be cancelled. Nothing changed. Your reason is kept.'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-09T12:00:00Z'))
  saved = record()
  Object.values(service).forEach((fn) => fn.mockReset())
  service.get.mockImplementation(async () => structuredClone(saved))
  service.files.mockResolvedValue([])
  service.vessels.mockResolvedValue([{ id: 9, name: 'QA Other Vessel' }])
  service.invoiceOptions.mockResolvedValue({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 })
  for (const method of ['updateDetails', 'updateInvoices', 'confirmEad', 'confirmIe599', 'cancel'] as const)
    service[method].mockRejectedValue(new Error('QA: unspecified mocked write'))
  network = vi.fn(async () => { throw new Error('QA: network blocked') })
  vi.stubGlobal('fetch', network)
  vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => { throw new Error('QA: XHR blocked') })
  vi.stubGlobal('WebSocket', class { constructor() { throw new Error('QA: WebSocket blocked') } })
})

/*
AUDIT HANDOFF — 2026-11-09 — QA observations only, no fixes
=========================================================
Baseline: main 6aa259553cd9c86a8aaa157902088aa9a6bca83e (parent verified).
Pinned root:
C:/Users/Giorgos/AppData/Local/Temp/frontline-audit-20261109-6aa2595/Frontline-Forwarding-frontline-forwarding-6aa259553cd9c86a8aaa157902088aa9a6bca83e

Source paths below are relative to that root; client paths abbreviated:
P = frontline-forwarding-client/src/features/exports/details/components/
E = frontline-forwarding-client/src/features/exports/
Planning requirements are the pre-investigation FLOW-EX and scenario catalogue
under docs/qa/{flows,scenarios}/export-to-customs-completion.md. FRO-317/352 own
saved Details behavior; FRO-350 is reused presentation, not audited creation.
No new business-rule decisions or questions were introduced.

EX-D1 [P1] A refresh replaces the reviewed version without replacing/reviewing intent
----------------------------------------------------------------------------------
Expected:
- FLOW-EX step 9 (flow line 29), cancellation invariant (line 40).
- Scenarios EX-015/018/019/020/021 (scenario lines 21,24-27).
- docs/workflows/export-customs-declaration.md:121-129: Customs sends the version
  the operator read; every write uses expectedVersion and stale writes are refused.
- frontline-forwarding-app/src/main/resources/graphql/exports.graphqls:100-123
  explicitly requires expectedVersion on Details, invoices, Customs and cancellation.
  This is contract inspection only, not a backend implementation audit.

Actual and trigger:
1. Open Details at version 3 with no vessel; edit only MRN to B. Another writer
   saves vessel 9 at version 4; background query refresh renders version 4.
   Save sends expectedVersion=4, MRN B, the old date and deliveredVesselId=null.
   This submits an explicit clearing of the other writer's vessel using that
   writer's current version. The fake response shows the resulting cleared UI.
2. Open invoice Edit at v3 with invoices 1,2 and make NO local membership edit.
   Another writer adds invoice 3 at v4; refresh. The draft still shows only 1,2.
   Save sends expectedVersion=4, addInvoiceIds=[], removeInvoiceIds=['3'].
   The newly added invoice is silently interpreted as an intentional removal.
3. Open EAD / positive IE599 / cancellation at v3. Refresh to v4 while the review
   remains open (an invoice addition or vessel change, still eligible).
   Confirmation sends v4 without restarting or explicitly reviewing the action.

Root and exact refs:
- P/export-detail-page.tsx:97-117,218-222: drafts/dialogs have no reviewed version.
- P/export-detail-page.tsx:263-274 and374-382: editor initialization captures values
  but not the version or saved membership baseline.
- P/export-detail-page.tsx:308-312: Details takes live record.version and all fields.
- P/export-detail-page.tsx:408-426: membership delta uses refreshed view.invoices
  and the refreshed record.version, rather than the reviewed selection baseline.
- P/export-detail-page.tsx:351-355 and649-652: both Customs commands and cancel
  also take live record.version.
- P/export-detail-page.tsx:716-723,907-909: dialog opening captures no version.
- E/services/export-service.ts:150-185 forwards those inputs without alteration.

Impact: normal version checking cannot detect stale intent once the client adopts
the current version. Newer facts/membership can be overwritten or removed, and
Customs/cancellation can approve a different record than the one reviewed.
Confidence: high for the UI/request defect. Tests 1-5 exercise actual page controls,
query invalidation and outbound inputs. The backend is mocked: persisted data loss,
real transaction acceptance, fiscal effects and external calls were NOT observed.
Tests with a mocked accepted response illustrate UI consequences, not backend proof.

EX-D2 [P2] A prior save completion discards edits accepted while it is pending
---------------------------------------------------------------------------
Expected: EX-015 (scenario line 21) protects newer typing from late responses;
EX-023 (line 29) protects drafts during work. The source page's declared behavior
at P/export-detail-page.tsx:166-170 also keeps open draft state above panels.

Actual:
1. Enter MRN B and Save. While request is deferred, the real input remains writable.
   Type MRN C. Resolve original B response: editor closes; reopen contains B,
   and C was never submitted.
2. With invoices 1,2,3, remove1 and Save. While pending, Remove2 remains active.
   Remove2 locally; response for the original remove1 restores2 and closes editor.
3. Start a Details save, press Escape (accepted while pending), open a replacement
   editor and type C. The first response closes that NEW editor and loses C.

Root and exact refs:
- P/export-detail-identity-card.tsx:170-226: MRN, DatePicker and vessel controls
  receive no saving guard;113-122 and242-245 permit Escape/Cancel during saving.
- P/export-detail-invoices-card.tsx:132-148,214-224,298-302: row removal and
  Cancel/Escape are likewise independent of saving; only Save has loading.
- P/export-detail-page.tsx:314-315,428-429: successful earlier requests
  unconditionally clear whichever editor is now present.
- P/export-detail-page.tsx:698-702,738-752 accepts local changes/cancellation
  while the request is pending.

Impact: silently lost unsent work, including a newly reopened draft. This finding
does not require a second server writer or claim an additional backend mutation.
Confidence: high, tests 6-8 use deferred promises and actual input/Remove/Escape.
Buttons changing to loading alone do not freeze the editable controls.

EX-D3 [P2] Unknown outcomes are reported as definite failures and forgotten/retried
-------------------------------------------------------------------------------
Expected:
- EX-018/019/022/023 (scenario lines24-25,28-29) preserve original uncertain
  action/date/reason/version and reconcile before a replacement operation.
- E/export-errors.ts:13-17,28,65-69 distinguishes unknown: request/answer may be
  lost after application, so reload before trying again. No new request-identity
  business rule is being introduced here.

Actual:
1. EAD or IE599 rejects with TypeError representing a dropped response. The UI
   says "Nothing changed". Choose a different date and Confirm: a second write
   uses the new date, with no intervening Export read. Cancel dismisses the
   failed dialog and removes its prior error/context.
2. Cancellation rejects with the same uncertain transport failure. The UI again
   says "Nothing changed". Keep Export closes it. Reopening has an empty reason;
   a different reason can be submitted without checking the original outcome.
3. The mounted Details tree does not prevent a synthetic beforeunload while a
   Customs/cancel promise is pending. Its dialog itself DOES block close/Escape.
   This is a bounded guard observation, not a whole-application navigation proof.

Root and exact refs:
- P/export-detail-page.tsx:94-117,218-222 has idle/pending/failed only.
- P/export-detail-page.tsx:358-367,657-665 collapses unknown into failed.
- P/export-detail-customs-dialog.tsx:55-74,93-105 and
  P/export-detail-cancel-dialog.tsx:31-55,66-81 lock only pending outcomes.
- P/export-detail-page.tsx:927 and1009 discards dialog state on close.
- E/details/localization/export-detail-labels.ts:84-85,221-222 asserts
  "Nothing changed" for those failures.
- No useBlocker or beforeunload registration exists in this Details tree or
  frontline-forwarding-client/src/routes/secured/exports/$exportId.tsx:1-11.
  Shared-shell/browser navigation was not mounted or tested.

Impact: misleading outcome, lost original context and replacement requests while
a prior outcome remains unknown. Server guards may refuse repeats; these tests do
NOT demonstrate duplicated Customs events, cancellation effects or authority bypass.
Confidence: high for failure presentation, draft dismissal and request behavior.
Tests9-11 cover unknown Customs/cancel; tests13-14 cover pending dialog/unload limits.
Details/invoice save catches also map unknown to failed (page316-335,431-445 and
label52-53), but that additional consumer is STATIC evidence only in this file.

Ruled-out suspects and preserved controls
----------------------------------------
- A server-returned CONFLICT without refresh retains the edited MRN and v3 request.
- A tab round trip retains the Details draft; an open editor disables Customs.
- While a Customs or cancellation request is pending, close button and Escape
  do not dismiss that dialog. This protection is lost when unknown becomes failed.
- With post-EAD capability flags, Details Edit and Cancel Export are absent,
  and saved invoices cannot be removed. No permission bypass is claimed.
- Unknown response itself is not classified as a known rejection by exportFailure;
  it is the Details controller/presentation that loses that distinction.
- Did not claim a top-bar/list absence (FRO-368) or Entry-link absence (FRO-370)
  is a delivered-scope bug. No business-rule question remains from this bounded work.

Execution and provenance
------------------------
Run from:
C:/Users/Giorgos/.codex/visualizations/2026/11/08/01a1bcaf-5410-7a03-8942-8d6d8a92da4a/shipment-crash-audit
Command:
node node_modules/vitest/vitest.mjs run --configLoader runner src/features/exports/details/export-details-qa.test.tsx
Observed: 15/15 passed, one file, exit0, duration20.29s; Node v24.13.0, Vitest4.1.6.
First focused run passed; no baseline or whole-suite rerun and no dependency fetch.
These are current-behavior observation assertions: passing confirms the described
bugs/controls; it does NOT mean product acceptance passed or any fix exists.
The actual page/cards/hooks/validation/labels/QueryClient/Modal/DatePicker were used.
Only ExportService I/O was substituted; native fetch/XHR/WebSocket are blocked,
fetch is asserted unused, and data/time are synthetic. Actual DatePicker clicks
select dates; it is not replaced with a plain test input.

Post-run comparison: all562 baseline client src files match the archive byte-for-byte
(zero mismatches). No source/config/package/existing-test changes. Only this new test
and its byte-identical planning evidence copy were authored:
docs/qa/evidence/export-details-qa.test.tsx
The planning copy is archival evidence; run the harness copy at the path above.

Limits:
- Not production end-to-end, no backend/database/auth/network integration execution.
- No creation/picker/files/printing/stamping/protocol allocation review or UI redesign.
- No proof of duplicate persisted events, actual data loss, irreversible transitions,
  or production deployment equivalence. Outbound faulty inputs and local draft loss
  are directly observed; backend consequences remain contract-based inferences.
- Query refresh is induced through real QueryClient invalidation with mocked reads;
  no real second browser or real server writer was used.
- English synthetic DOM evidence, no EL/responsive/browser navigation acceptance run.
- Parent's pinned-SHA/pull verification is reused. Playbook loader had already failed
  on archive lacking .git; it was not rerun and no policy fingerprint was fabricated.
  Relevant root/client AGENTS, domain policy, workflow/testing policy and source
  contracts were read directly. No Git mutations, Linear writes or fixes.
*/

afterEach(() => {
  cleanup()
  clients.forEach((client) => client.clear())
  clients = []
  expect(network).not.toHaveBeenCalled()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  localStorage.clear()
})

describe('export-details-qa — observed pinned frontend behavior, not production end-to-end', () => {
  it('EX-D1 details: stale draft uses refreshed version and sends an old vessel over the new one', async () => {
    const client = await open()
    fireEvent.click(button('Edit'))
    setMrn(mrnB)
    saved = markRefresh(record({ version: 4, deliveredVessel: { id: 9, name: 'QA Other Vessel' } }))
    await refresh(client)
    expect(mrnInput().value).toBe(mrnB)
    service.updateDetails.mockImplementationOnce(async (_id, input) => {
      expect(input.expectedVersion).toBe(saved.version) // A normal version check would not reject this.
      return { ...saved, ...input, version: 5, deliveredVessel: null }
    })
    fireEvent.click(button('Save'))
    await waitFor(() => expect(service.updateDetails).toHaveBeenCalledWith('41', {
      expectedVersion: 4, mrn: mrnB, mrnDate: '2026-11-01', deliveredVesselId: null,
    }))
    await waitFor(() => expect(screen.queryByPlaceholderText('18 letters or digits')).toBeNull())
    expect(screen.queryByText('QA Other Vessel')).toBeNull()
  })

  it('EX-D1 invoices: an unchanged draft removes another writers newly added invoice after refresh', async () => {
    const client = await open()
    tab(/Supplier Invoices & Orders/)
    fireEvent.click(button('Edit'))
    saved = markRefresh(record({ version: 4, invoices: [invoice(1), invoice(2), invoice(3)] }))
    await refresh(client)
    expect(screen.queryByText('QA-SI-3')).toBeNull() // New saved membership is hidden by the old draft.
    service.updateInvoices.mockResolvedValueOnce(record({ version: 5 }))
    fireEvent.click(button('Save')) // No local membership edit at all.
    await waitFor(() => expect(service.updateInvoices).toHaveBeenCalledWith('41', {
      expectedVersion: 4, addInvoiceIds: [], removeInvoiceIds: ['3'],
    }))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Save' })).toBeNull())
  })

  it.each(['ead', 'ie599'] as const)('EX-D1 %s: open Customs review adopts a newer version without renewed review', async (kind) => {
    if (kind === 'ie599') saved = awaitingIe599()
    const client = await open()
    const dialog = await customsDialog(kind)
    saved = markRefresh({ ...saved, version: 4, invoices: [...saved.invoices, invoice(3)] })
    await refresh(client)
    expect(dialog.textContent).not.toContain('QA-SI-3')
    const operation = kind === 'ead' ? service.confirmEad : service.confirmIe599
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm', exact: true }))
    await screen.findByText(customsFailed)
    expect(operation).toHaveBeenCalledWith('41', { expectedVersion: 4, date: '2026-11-09' })
  })

  it('EX-D1 cancellation: an open dialog adopts a refreshed version for unseen changed details', async () => {
    const client = await open()
    const dialog = cancelDialog()
    saved = markRefresh(record({ version: 4, deliveredVessel: { id: 9, name: 'QA Other Vessel' } }))
    await refresh(client)
    expect(dialog.textContent).not.toContain('QA Other Vessel')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel Export', exact: true }))
    await screen.findByText(cancelFailed)
    expect(service.cancel).toHaveBeenCalledWith('41', { expectedVersion: 4, reason: 'QA deliberate cancellation' })
  })

  it('EX-D2 details: typing after Save is accepted then erased by the earlier success', async () => {
    const pending = deferred<ExportRecord>()
    service.updateDetails.mockImplementationOnce(() => pending.promise)
    await open()
    fireEvent.click(button('Edit'))
    setMrn(mrnB)
    fireEvent.click(button('Save'))
    await waitFor(() => expect(service.updateDetails).toHaveBeenCalledTimes(1))
    expect(mrnInput().disabled).toBe(false)
    expect(mrnInput().readOnly).toBe(false)
    setMrn(mrnC)
    expect(mrnInput().value).toBe(mrnC)
    await act(async () => { pending.resolve(record({ mrn: mrnB, version: 4 })) })
    await waitFor(() => expect(screen.queryByPlaceholderText('18 letters or digits')).toBeNull())
    fireEvent.click(button('Edit'))
    expect(mrnInput().value).toBe(mrnB)
    expect(service.updateDetails.mock.calls[0][1].mrn).toBe(mrnB)
  })

  it('EX-D2 invoices: Remove remains live during Save and its later edit is discarded', async () => {
    saved = record({ invoices: [invoice(1), invoice(2), invoice(3)] })
    const pending = deferred<ExportRecord>()
    service.updateInvoices.mockImplementationOnce(() => pending.promise)
    await open()
    tab(/Supplier Invoices & Orders/)
    fireEvent.click(button('Edit'))
    fireEvent.click(button('Remove QA-SI-1'))
    fireEvent.click(button('Save'))
    await waitFor(() => expect(service.updateInvoices).toHaveBeenCalledTimes(1))
    expect(button('Remove QA-SI-2').disabled).toBe(false)
    fireEvent.click(button('Remove QA-SI-2'))
    expect(screen.queryByText('QA-SI-2')).toBeNull()
    await act(async () => { pending.resolve(record({ invoices: [invoice(2), invoice(3)], version: 4 })) })
    await screen.findByText('QA-SI-2')
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
    expect(service.updateInvoices.mock.calls[0][1].removeInvoiceIds).toEqual(['1'])
  })

  it('EX-D2 replacement draft: Escape during pending save permits reopening, then the old response erases it', async () => {
    const pending = deferred<ExportRecord>()
    service.updateDetails.mockImplementationOnce(() => pending.promise)
    await open()
    fireEvent.click(button('Edit'))
    setMrn(mrnB)
    fireEvent.click(button('Save'))
    await waitFor(() => expect(service.updateDetails).toHaveBeenCalledTimes(1))
    fireEvent.keyDown(mrnInput(), { key: 'Escape' })
    fireEvent.click(button('Edit'))
    setMrn(mrnC)
    expect(mrnInput().value).toBe(mrnC)
    await act(async () => { pending.resolve(record({ mrn: mrnB, version: 4 })) })
    await waitFor(() => expect(screen.queryByPlaceholderText('18 letters or digits')).toBeNull())
    fireEvent.click(button('Edit'))
    expect(mrnInput().value).toBe(mrnB)
  })

  it.each(['ead', 'ie599'] as const)('EX-D3 %s: lost response claims Nothing changed and permits a changed retry without reading', async (kind) => {
    if (kind === 'ie599') saved = awaitingIe599()
    const operation = kind === 'ead' ? service.confirmEad : service.confirmIe599
    operation.mockRejectedValue(new TypeError('Response lost; server may have committed'))
    await open()
    const dialog = await customsDialog(kind)
    const reads = service.get.mock.calls.length
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm', exact: true }))
    await screen.findByText(customsFailed)
    await chooseDay(dialog, 8)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm', exact: true }))
    await waitFor(() => expect(operation).toHaveBeenCalledTimes(2))
    await screen.findByText(customsFailed)
    expect(operation.mock.calls.map((call) => call[1])).toEqual([
      { expectedVersion: 3, date: '2026-11-09' }, { expectedVersion: 3, date: '2026-11-08' },
    ])
    expect(service.get).toHaveBeenCalledTimes(reads)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel', exact: true }))
    expect(screen.queryByRole('dialog')).toBeNull()
    const reopened = await customsDialog(kind)
    expect(within(reopened).queryByText(customsFailed)).toBeNull()
  })

  it('EX-D3 cancellation: lost response can be dismissed and replaced with a fresh reason without reading', async () => {
    service.cancel.mockRejectedValue(new TypeError('Response lost after possible cancellation'))
    await open()
    const dialog = cancelDialog('Original cancellation reason')
    const reads = service.get.mock.calls.length
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel Export', exact: true }))
    await screen.findByText(cancelFailed)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep Export' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(button('Cancel Export'))
    const replacement = screen.getByRole('dialog')
    expect((within(replacement).getByLabelText(/^Reason/) as HTMLTextAreaElement).value).toBe('')
    fireEvent.change(within(replacement).getByLabelText(/^Reason/), { target: { value: 'Replacement reason' } })
    fireEvent.click(within(replacement).getByRole('button', { name: 'Cancel Export', exact: true }))
    await screen.findByText(cancelFailed)
    expect(service.cancel.mock.calls.map((call) => call[1])).toEqual([
      { expectedVersion: 3, reason: 'Original cancellation reason' },
      { expectedVersion: 3, reason: 'Replacement reason' },
    ])
    expect(service.get).toHaveBeenCalledTimes(reads)
  })

  it('control: a genuine conflict keeps the details draft across tabs and blocks Customs while editing', async () => {
    service.updateDetails.mockRejectedValueOnce(conflict())
    await open()
    fireEvent.click(button('Edit'))
    setMrn(mrnB)
    expect(button('Confirm EAD receipt').disabled).toBe(true)
    tab(/Supplier Invoices & Orders/)
    tab('Overview')
    expect(mrnInput().value).toBe(mrnB)
    fireEvent.click(button('Save'))
    await screen.findByText(/This Export changed since you opened it/)
    expect(mrnInput().value).toBe(mrnB)
    expect(service.updateDetails.mock.calls[0][1].expectedVersion).toBe(3)
    fireEvent.click(button('Cancel'))
    expect(button('Confirm EAD receipt').disabled).toBe(false)
  })

  it.each(['customs', 'cancel'] as const)('control and EX-D3 guard limit: pending %s blocks dialog dismissal, but has no Details unload guard', async (kind) => {
    const pending = deferred<ExportRecord>()
    const operation = kind === 'customs' ? service.confirmEad : service.cancel
    operation.mockImplementationOnce(() => pending.promise)
    await open()
    const dialog = kind === 'customs' ? await customsDialog('ead') : cancelDialog()
    fireEvent.click(within(dialog).getByRole('button', { name: kind === 'customs' ? 'Confirm' : 'Cancel Export', exact: true }))
    await waitFor(() => expect(operation).toHaveBeenCalledTimes(1))
    const close = within(dialog).getByRole('button', { name: kind === 'customs' ? 'Cancel' : 'Keep Export', exact: true }) as HTMLButtonElement
    expect(close.disabled).toBe(true)
    fireEvent.click(close)
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.getByRole('dialog')).toBeTruthy()
    const unload = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(unload)
    expect(unload.defaultPrevented).toBe(false)
    // Scope is the mounted Details tree, not real browser or shared-shell navigation.
    await act(async () => { pending.resolve(record({ version: 4 })) })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('control: after EAD, details/cancellation are absent and saved invoice removal is locked', async () => {
    saved = awaitingIe599()
    await open()
    expect(screen.queryByRole('button', { name: 'Edit', exact: true })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel Export' })).toBeNull()
    expect(button('Confirm positive IE599')).toBeTruthy()
    tab(/Supplier Invoices & Orders/)
    fireEvent.click(button('Add invoice'))
    expect(screen.queryByRole('button', { name: /^Remove QA-SI/ })).toBeNull()
    expect(service.updateDetails).not.toHaveBeenCalled()
    expect(service.cancel).not.toHaveBeenCalled()
  })
})
