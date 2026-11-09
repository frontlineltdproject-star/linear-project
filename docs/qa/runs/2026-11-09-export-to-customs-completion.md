# Export creation to Customs completion — 9 November 2026

## Scope and provenance

User approved mapping the expected flow first, then investigating bugs independently using existing tickets and current production code. [FLOW-EX](../flows/export-to-customs-completion.md) and [28 scenarios](../scenarios/export-to-customs-completion.md) were saved before defect investigation. Scope ends at positive IE599/Customs Completed; detailed Υ.Δ. printing and invoice stamping are the next pass. Protocol allocation and unchanged VAT events remain boundary checks.

- Production repository: `Frontline-Forwarding/frontline-forwarding`, named branch `main`, freshly checked through authenticated `gh` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e` (source version 0.0.13). Deployment version not verified.
- Current full FRO-317/350/352/321/319 read; all Done. FRO-368 (Export list/menu) and FRO-370 (Entry links) remain Backlog. Their omissions are not new regressions. FRO-303 is Todo; its additional Order correction work is not treated as delivered. FRO-317/350/352/319 comments fetched: none. Older Context for agents absence statements are historical.
- Planning pull succeeded before work. Production access remains read-only: no source changes, portal/database writes, real uploads, emails or fiscal submissions. No Linear changes. Existing UI contracts reused; no canvas, preview or production branch.
- Pinned source archive has no Git metadata. The policy loader returned exit 1 (`git rev-parse --show-toplevel` failed); direct root/app instructions and applicable policies read. No successful loader snapshot/fingerprint claimed.
- Isolated frontend harness uses Node 24.13.0 / Vitest 4.1.6 and existing local dependencies, not a clean lockfile installation. All 562 original `src` files byte-matched the pinned archive during this review. Additional evidence tests are separate.
- Full Java 25/Spring/PostgreSQL integration and complete portal scenarios are not executed. Host Java is 11. Evidence below must distinguish source trace, extracted-method execution and mounted React execution.

## Consumers and expected outcomes

This is an audit ownership map, not an approved fix specification.

| Consumer / affected area | Current implementation source | Required outcome | Requirement owner / audit scope |
| --- | --- | --- | --- |
| Create selection, draft, unknown result and files | Client `features/exports/components/export-create-page.tsx`, hooks, mapping and service | Correct group/selection; preserve facts/files; reconcile original create and upload to its owner | FRO-350/317; current pass |
| Saved identity and invoice editors | Client `features/exports/details/components/export-detail-page.tsx`, identity/invoices cards | Save only reviewed facts/version, retain drafts on failure, refresh counts/connected Orders/protocol | FRO-352/317; current pass |
| Customs confirmation/cancellation UI | Same page and Customs/cancel dialogs | Protect reviewed state/date/reason; one sequential event and recover unresolved outcomes | FRO-352/317; current pass |
| Create and update services | Backend `domain/exports/ExportCreationService.java`, `ExportEditingService.java`, `ExportRules.java` | Atomic eligibility/uniqueness/date/version checks; permitted edits only, append audit | FRO-317; current pass |
| Entry invoice coverage | Backend `ExportInvoiceChecks`, `ExportPreparationService`, `ExportDeclarationRepository`, `domain/customsstorage` readers | One Entry's owning-Order invoice set cannot diverge across Exports; inherited access never aggregates child invoice sets | FRO-317/319; current pass boundary |
| Documents and access | `web/exports/service/ExportAttachmentsApiService.java`, `ExportAuthorizationService.java`, `UserRole.java` | Staff-only exact owner access; stage-dependent removal, replay-safe upload; no implied event | FRO-317/350/352; current pass |
| Parent Shipment / linked invoice / Order guards | `ExportGuard`, `ShipmentsApiService`, `SupplierInvoiceService`, `PurchaseOrdersApiService` | Protect active declarations from cancellation/incompatible relationship changes | FRO-317/321; source trace, further integration verification required |
| Protocol and invoice VAT events | Export creation/editing, locked counter, invoice-owned events | Allocate only on successful first Υ.Δ. selection; retain/reuse; Customs transitions do not stamp invoices | FRO-317/321; limited boundary check |
| Printing / stamping operations | `ExportYdService`, `ExportStampingService` | Detailed workflow review deferred | FRO-317/352; next pass |
| Export list/menu and Entry links | Separate pending tickets | Preserve pending ownership, do not duplicate as bugs | FRO-368/370 |

Source paths above are relative to `frontline-forwarding-client/src/` for client and `frontline-forwarding-app/src/main/java/com/frontline/forwarding/` for backend unless otherwise stated.

## Findings

Six findings demonstrated in the isolated frontend. They are **not six proposed tickets**. No deployed defect or duplicate persisted Customs event is claimed. All 28 full portal scenarios remain **Not run**.

| ID | Finding | Office consequence | Scenarios |
| --- | --- | --- | --- |
| QA-EX-01 | In-app navigation loses creation draft/recovery and pending files | Leaving via the menu bypasses the warning; failed-upload bytes can also be lost through Open Export | EX-007/008/023/027 |
| QA-EX-02 | Pending Create can be discarded as though nothing was saved | Staff leave believing creation was cancelled, while the original request can still complete and upload | EX-007 |
| QA-EX-03 | File edits during Create diverge from the submitted upload queue | Removed file uploads; newly added file remains stranded without upload/retry controls | EX-008 |
| QA-EX-04 | Editors/confirmations silently use a refreshed unreviewed version | Another writer's facts or invoice additions can be overwritten; Customs/cancellation approves unreviewed state | EX-015/016/018–021 |
| QA-EX-05 | Earlier save completion erases later edits | Typing, invoice removal or a replacement editor accepted during the request disappears | EX-015/016/023 |
| QA-EX-06 | Uncertain Customs/cancellation results say “Nothing changed” and lose recovery | Staff can dismiss or replace the original action without checking whether it saved | EX-018/019/022/023 |

### QA-EX-01 — Losing unfinished creation work through navigation

**Example:** enter MRN and select a PDF, then click Dashboard in the actual application shell. There is no warning; returning to Create has blank MRN and no file. The same departure after a lost Create response removes Check original attempt and permits a new request ID. After creation with failed upload, Open Export leaves without protecting the pending file; returning has no Retry.

**Expected:** protect browser-only work and the unresolved original operation, including failed uploads, across in-app departures (FRO-350). A browser reload warning alone is insufficient.

**Cause:** local draft/file/attempt state at `export-create-page.tsx:147–167`; its only navigation guard is `beforeunload` at 233–249. Open Export directly navigates at 477–481. No router blocker preserves that state.

**Evidence:** [Create tests](../evidence/export-create-qa.test.tsx), first, second and fourth cases, using the actual AppShell and TanStack memory router. Service persistence is mocked; a new request ID does **not** prove a duplicate Export—the backend still has group/MRN guards. In-app state loss is demonstrated.

### QA-EX-02 — Discarding a Create request that is already in progress

**Example:** select a PDF, click Create, then Cancel while the response is delayed. The dialog claims “Nothing has been saved.” Confirm Discard draft and leave. When the original request resolves, it still uploads the original PDF to the created Export, but its result is no longer shown on the replacement page.

**Expected:** preserve and resolve the in-flight creation; do not describe departure as a certain unsaved discard (FRO-350 original-attempt recovery).

**Cause:** `export-create-layout.tsx:55–63` leaves Cancel enabled during submission; page 575 and 701–707 permits departure, while asynchronous `send/created` continues at 416–426 / 398–404. `export-create-labels.ts:150–153` gives the incorrect certainty.

**Evidence:** third Create case. The old callback keeps its **original** files and does not overwrite the new page or take replacement files; the earlier Supplier Invoice wrong-owner bug does not reproduce here. This finding is the unresolved operation and misleading discard, not a wrong-owner upload or proof that backend cancellation was bypassed.

### QA-EX-03 — Removed file uploaded; new file stranded

**Example:** stage A.pdf and click Create. While waiting, remove A.pdf and select B.pdf. On success, the outgoing upload is A.pdf. The result shows B.pdf as Staged file without Retry, Remove or Choose files controls.

**Expected:** queued files and the submitted attempt must remain consistent, with retained files recoverable (FRO-350). Either prevent incompatible queue edits while submitting or preserve their intended ownership and outcome; the developer fix remains to be reviewed.

**Cause:** page `upload/created` at 380–404 reads files captured by the original render; document controls at 685–690 remain editable. The result receives current files at 562 but only failed files have a Retry action in `export-documents-card.tsx`.

**Evidence:** fifth Create case exercises actual controls and records the outgoing File object. Real storage placement is not tested; the client selecting removed bytes and stranding new bytes is demonstrated.

### QA-EX-04 — Saving against an unreviewed version

**Examples:**

- Open Details with no vessel and edit only MRN. Another writer adds a vessel; a background refresh arrives. Save submits the newer version together with the old `deliveredVesselId=null`, explicitly clearing the other writer's vessel.
- Open invoice Edit with invoices A/B and change nothing locally. Another writer adds C; refresh arrives. Save sends removal of C, although the editor never displayed it.
- Open EAD, IE599 or cancellation confirmation, then receive a refreshed record. Confirm sends that newer version without restarting the review.

**Expected:** retain the version and membership baseline actually reviewed; reject stale intent and preserve the draft for explicit reconciliation (FRO-317/352 and source ADR 0003).

**Cause:** `export-detail-page.tsx:97–117,218–222` state lacks a reviewed version. Details save reads live `record.version` at 308–312; invoice diff compares old draft against refreshed `view.invoices` at 408–426. Customs/cancellation also read live version at 351–355 / 649–652.

**Evidence:** first five [Details tests](../evidence/export-details-qa.test.tsx), actual mounted controls and real QueryClient refresh with synthetic service responses. Captured outgoing payloads are demonstrated. Backend `ExportEditingService.lockEditable:225–237` enforces only the supplied version, so replacing it with the current one defeats stale-intent detection; full database acceptance/data loss remains integration verification, not an observed portal result.

### QA-EX-05 — Newer typing disappears when an earlier save finishes

**Example:** change MRN to B and Save. Before completion, type C into the still-editable input. The response for B closes the editor; reopening shows B and C is gone. The same happens to an invoice removed after an earlier membership save began. Escape can close a pending editor, open a replacement, and the earlier response closes that new editor too.

**Expected:** retain unsent work accepted by the UI, or lock the relevant editing/replacement controls while the operation is unresolved (FRO-352 safe editor behavior).

**Cause:** identity and invoice controls remain active while saving (`export-detail-identity-card.tsx:113–122,170–245`; `export-detail-invoices-card.tsx:132–148,214–224,298–302`). Earlier success unconditionally clears current editor state at page 314–315 / 428–429.

**Evidence:** Details cases 6–8, deferred responses with actual input, Remove and Escape. Local draft loss is demonstrated; this is separate from another writer's stale-version overwrite.

### QA-EX-06 — Treating an unknown result as a definite failure

**Example:** confirm EAD, but lose the response. The screen says “Nothing changed.” Change the date and confirm again: the client sends a replacement write without reading the Export. Closing/reopening loses the original date/error. A lost cancellation response similarly permits Keep Export, then an empty replacement reason, without checking whether cancellation already happened.

**Expected:** distinguish a known rejection from a request that may have committed; retain original action/date/reason/version and reconcile saved state before offering a replacement action. Do not promise the Export remained unchanged.

**Cause:** `exportFailure` correctly returns unknown, but page 358–367 / 657–665 collapses it into failed. Dialogs only protect pending requests, and page 927 / 1009 clears context on close. `export-detail-labels.ts:84–85,221–222` supplies “Nothing changed.” Details/invoice-save error handlers also statically share the failed classification; runtime proof here covers Customs and cancellation only.

**Evidence:** Details cases 9–11. Pending dialogs themselves correctly block close/Escape (controls); the protection disappears once an unknown result is labelled failed. Mounted Details also lacks an unload guard in two controls, but whole-app Details navigation was not executed. Backend stage/version guards may reject repeat writes: no duplicate persisted event or cancellation is claimed.

### Verification and preserved controls

- **136 existing frontend tests passed**, 10 files (16 Create rules + 120 other Create/Details rules/mapping/error/component checks). Existing files include some printing/stamping assertions; running those does not complete the deferred VAT-flow audit. Initial combined run produced no completed result and was stopped; explicit-config reruns above passed.
- Parent independently ran **6 Create observations/controls**, exit 0 (14.09 s), and **15 Details observations/controls**, exit 0 (16.35 s). These tests characterize current defects; green does not mean fixed.
- **16 extracted-Java Customs/cancellation controls passed**, exit 0, via [the portable script](../evidence/export-customs-guards-qa.py). Actual `confirmEad`, `confirmIe599`, `cancel`, `lockEditable`, `checkEadDate` and `requireCurrent` method bodies run with DTO/repository/auth/clock stand-ins. Valid progression records one event each; stale/missing version, invalid chronology, repeats, post-EAD cancellation, invalid reason and cancelled Export writes reject before stand-in persistence. No real authorization, SQL, transaction or rollback proof.
- Same-page Create recovery replays the exact attempt; file retry preserves owner/key; failed navigation retains the result. Ordinary server conflict preserves a Details draft; tab changes retain it; editing blocks Customs; post-EAD capability flags hide prohibited edits/removal. These controls prevent treating every adjacent case as a bug.
- Evidence tests block native network and use only synthetic data. All original client source remained unchanged. English/jsdom behavior, not full EN/EL/responsive/browser/deployment acceptance.
- Current Bug + Export Linear search returned only FRO-379/380's Supplier Invoice scopes, no Export-specific bug owner. No issue was created or expanded.

## Source checks and limits

- Creation uses an actor/payload-bound request ID, locks the Shipment/group and MRN, validates selected invoices, and writes creation/EAD/protocol/activity transactionally. Active-group and active-invoice indexes provide additional uniqueness. This source trace is not an executed race/rollback test.
- EAD requires Awaiting EAD and MRN-date ≤ EAD-date ≤ Athens today. IE599 requires recorded EAD, is refused when already Completed, and enforces EAD-date ≤ IE599-date ≤ today. Both call the reviewed-version check before mutation. Neither updates invoice VAT fields.
- Cancellation requires the cancel authority, active Awaiting EAD, current version and a trimmed 1–1000-character reason. It releases active invoice membership while retaining Export/history/MRN/protocol. File removal requires active Awaiting EAD; upload permits active later stages, uses owner + client-file key replay and records file activity.
- Read/mutation services enforce staff identity and authority; attachment lookups bind both owner type and ID. Manager versus employee Export cancellation authority is explicit in `UserRole`. End-to-end authorization and object-store behavior still need integration verification.
- A suspected inclusion of removed Shipment participants was ruled out: `ShipmentPurchaseOrderParticipationRepository.findByShipmentId` filters `REMOVED`, and Export preparation additionally excludes `CANCELLED`. Ancestor traversal proceeds upward; connected Orders derive from selected invoices.
- Existing integration tests were inspected as context, not reported as executed. Normal-flow source guards do not prove the UI sends the correct reviewed version or that all related-Entry boundaries are enforced.
- **Ruled out after full requirement reconciliation:** an initial interpretation treated every covered child's invoices as part of the Entry. FRO-319 explicitly says opening from a covered child shows the owning Order's invoices/Export, never substitutes child invoices or aggregates the family; its derived invoice set is active storage invoices of the owning Order only. The source's per-Order Export guard is consistent with this. An isolated query/rule harness observed the per-Order behavior (17 assertions), but its proposed defect expectation was wrong. Excluded from the bug count; flow/scenario corrected before completion. This is not a new business decision or a request to change that behavior.

## Accepted ticket grouping — created tickets

All six findings were reviewed with the user through simple examples. The user accepted **two groups**, reviewed the full drafts and metadata, then explicitly approved creating both tickets. [The approved package](../../../drafts/export-bugs/README.md) contains the unchanged descriptions, saved metadata and finding-to-criterion coverage. G1 → [FRO-384](https://linear.app/front-line-ltd/issue/FRO-384/export-creation-protect-drafts-pending-creation-and-file-uploads); G2 → [FRO-385](https://linear.app/front-line-ltd/issue/FRO-385/export-details-protect-edits-reviewed-versions-and-confirmation). Both were created and re-read successfully.

| Group / approved title | Findings included | Complete outcome | Requirement links |
| --- | --- | --- | --- |
| G1 — Export creation: protect drafts, pending creation and file uploads | QA-EX-01, QA-EX-02, QA-EX-03 | Keep draft, submitted attempt, saved result and file queue consistent through departure, delayed replies, unknown outcomes and upload recovery. Never describe a pending creation as a certain unsaved discard; removed/replacement files must have consistent handling. | FRO-317, FRO-350 |
| G2 — Export Details: protect edits, reviewed versions and confirmation recovery | QA-EX-04, QA-EX-05, QA-EX-06 | Saved-record editors and EAD/IE599/cancellation confirmations retain the reviewed version and original intent, preserve later unsent edits, and resolve uncertain results before replacement writes. | FRO-317, FRO-352 |

**Why this size:** G1 is the full create → result → upload lifecycle, with six existing isolated observations/controls. Splitting its navigation, pending discard and mutable file queue would divide ownership of the same creation attempt. G2 is the saved-record operation lifecycle: review → edit/confirm → submit → success/rejection/unknown recovery, with 15 isolated observations/controls. Correct version capture, operation identity and response handling should be assessed together. This grouping does not claim one root cause, one code change or a particular effort estimate for either ticket.

Every finding keeps its own reproduction and acceptance checks. G2 must explicitly retain all four consumers of QA-EX-04 (Details, invoice membership, Customs and cancellation), both editor consumers of QA-EX-05, and both Customs/cancellation unknown-result cases of QA-EX-06. G1 keeps ordinary drafts, unresolved creation and failed-upload departures distinct. No finding is absorbed into a generic “fix Export” check.

G1/G2 are independently reviewable; no blocking relation is established. Existing server stage/permission/date/uniqueness checks remain preservation requirements. Proposed code focus is the Export frontend controllers and controls; source investigation does not justify changing Customs business rules or claiming duplicate persisted events. Detailed VAT printing/stamping, pending FRO-368/370 UI work, the ruled-out Entry interpretation and other entities remain outside these groups.

Current FRO-317/350/352 were re-read and remain Done with unchanged descriptions; production main remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Current Export + Bug search returned only Supplier Invoice scopes. FRO-378/379 were re-read: their approved scopes remain Supplier Invoice creation/Details, so do not expand them with Export defects. Their implementation patterns may be useful context, not assumed shared fixes or blocking dependencies. Current Flow QA label was verified active and can be reused. No Linear changes or application-test reruns were made for grouping.

Both approved issues are High, FRO Backlog and Story + Bug + Pending_Review + Flow QA + Frontend + export, with exactly the related requirement links above and no blockers. No project, assignee, milestone, parent, cycle, due date, estimate, attachments or documents. Metadata catalogues and current requirement descriptions were refreshed; source main remains unchanged. Complete descriptions, metadata and relations were verified after creation. All six findings retain separate acceptance checks, source/evidence limits and read-only post-deployment verification. Existing presentation contracts are reused; no preview, branch, production mutation or new application execution. Detailed VAT-exemption paperwork remains a separate pass.
