# VAT-exemption paperwork — 9 November 2026

## Scope and provenance

User requested the expected flow first, then investigation using existing tickets and current code. [FLOW-VAT](../flows/vat-exemption-paperwork.md) and [30 scenarios](../scenarios/vat-exemption-paperwork.md) were saved before reproduction. Scope: Print ΥΔ, individual Supplier Invoice stamping events, and Export bulk dispatch/return/onward sending. Shipment Invoice belongs to the parallel chat and is excluded.

- Current full FRO-317/321/348/352 read: all Done; current comments empty. FRO-241 is only the historical supplied-form source. FRO-379/385 were read for overlap: Supplier Invoice correction/cancellation and Export editors/Customs/cancellation respectively, not automatic owners of this paperwork scope.
- Production main authenticated through gh before and after review: 6aa259553cd9c86a8aaa157902088aa9a6bca83e, source version 0.0.13. Deployment equivalence unverified. No production source, portal or database writes.
- Planning pull succeeded before work. Existing UI contracts reused; no new design, canvas, preview, production branch, Linear change or ticket draft. Findings await discussion and grouping.
- The archive has no Git metadata; the policy loader failed at git rev-parse. Root/client/app and relevant policy files were read directly. No successful policy-loader snapshot/fingerprint is claimed.
- Three focused agents investigated print UI, individual stamping and bulk stamping. Parent reviewed their evidence and source, reran all retained UI tests, investigated backend guards/grouping and inspected supplied forms. All 562 original client source files still SHA-256 match the pinned archive.

## Expected journey

1. Save eligible Υ.Δ. Supplier Invoices on an Export. The first successful qualifying inclusion allocates its protocol; printing never allocates one.
2. Print ΥΔ from saved selected invoices using one of the three supplied customs templates. Group by Invoicing company and Supplier, at most five invoices per document. Printing is available at each active Customs stage and changes no business facts.
3. Once positive IE599 exists, record dispatch for stamping: Not started → In progress.
4. Record stamped return: In progress → Exempted.
5. Record onward sending to the recipient: save the separate date and remain Exempted. This is not verified recipient receipt or goods delivery.
6. Individual and bulk actions write the same invoice-owned history. Respect invoice/dispatch/return date order and Athens today, preserve rejected/unselected items, and reconcile uncertain attempts before changing intent.

## Consumer trace

| Consumer / area | Current behavior and source | Required outcome | Owner |
| --- | --- | --- | --- |
| Print dialog and Export page | Independent print state, async grouping and PDF requests; P and D below | Intended selection/template, current membership, correctly scoped results/errors | FRO-317/352; QA-VAT-01–03 |
| Supplier Invoice stamping | Local date/outcome, live version and stage-keyed action; S and I | Reviewed version, stable pending input and recoverable original attempt | FRO-321/348; QA-VAT-04/05/07/08 |
| Export bulk actions / query cache | Local selections/dialog, generic failure and unconditional response cache write; P and B | Eligible selection, stable intent, truthful outcomes and no stale display rollback | FRO-317/321/352; QA-VAT-03/05/06/09 |
| Shared event service/repository | Export/invoice locks, per-item verdicts, version checks and invoice/audit writes | Preserve chronology, replay, eligibility, atomicity and canonical ownership | Existing backend contract; controls below, real DB verification pending |
| YD grouping/PDF | Selected saved invoices; Company+Supplier groups; current-value model/template | Read-only correct groups and supplied form filling | FRO-317; grouping controls; actual PDF rendering pending |
| REST/GraphQL/MCP, authorization, schema | Common services, staff/edit checks and event constraints | Preserve equivalent access, state and history safeguards | Existing owners; source-traced, HTTP/SQL not executed |
| Other flows | Shipment Invoice separate; correction/Customs QA already filed | Preserve boundaries; no duplicate ticket or silent scope expansion | Other chat, FRO-379/385 |

Source notation below, relative to frontline-forwarding-client/src/: **P** = features/exports/details/components/export-detail-page.tsx; **D** = same directory/export-detail-print-dialog.tsx; **B** = same directory/export-detail-stamping-dialog.tsx; **S** = features/supplier-invoices/components/supplier-invoice-export.tsx; **I** = same directory/supplier-invoice-detail-page.tsx. All references use the pinned commit above.

## Nine findings

These are findings, **not nine proposed tickets**. Common manifestations are consolidated; conditional or ambiguous observations are separated below. Runtime evidence is isolated rendered UI with synthetic service boundaries, not deployed persistence.

| ID | Finding | Simple office example | Scenarios |
| --- | --- | --- | --- |
| QA-VAT-01 | Pending print generation discards newer selection | Request invoice A, change selection to B while waiting; A's results replace the form | VAT-006 |
| QA-VAT-02 | Old PDF failure contaminates a new print dialog | Close a slow PDF attempt, start another; the old failure reports an error against the new work | VAT-006/007 |
| QA-VAT-03 | Refresh leaves stale/invisible selected invoices | An invoice is removed before Customs progression, or another operator advances its stamping stage; its selection survives | VAT-005/008/020/022/024 |
| QA-VAT-04 | Individual confirmation adopts an unseen invoice version | Open confirmation, another writer changes invoice facts; Confirm silently submits the newer version | VAT-015 |
| QA-VAT-05 | Pending stamping date remains editable and newer input disappears | Submit 5 November, select 6 November while waiting; the earlier response closes the dialog with 5 November | VAT-018/023 |
| QA-VAT-06 | Bulk uncertainty becomes “Nothing changed” and loses the original attempt | Connection loses the answer; staff can change date/selection or leave without checking what saved | VAT-021/023 |
| QA-VAT-07 | Individual uncertain-attempt recovery disappears | Close the warning or receive a stage-changing refresh; reopening no longer offers the original check | VAT-016/017/018 |
| QA-VAT-08 | Check original attempt accepts a different recorded date | Submit 5 November; a reread showing another writer's 6 November resolves the check as success | VAT-017/025 |
| QA-VAT-09 | Late bulk response replaces newer displayed progress | Returned papers are visible; an older dispatch response arrives and moves the UI back to awaiting return | VAT-023/030 |

### QA-VAT-01 — Print input accepted while the original grouping is pending

Rendered reproduction: select invoice 1/airport and Generate, then use enabled checkboxes/radios to select invoice 2/Piraeus C. Original success replaces the form with invoice 1's group; newer selection is lost. Open PDF combines invoice 1 from that result with the current Piraeus C template. A selection-only case clears to zero while pending and still receives invoice 1's result.

P:457–494 captures original grouping inputs, installs documents into current state and later reads current template; D:149–219 leaves inputs enabled. Result mode has no return-to-selection control. [Print evidence](../evidence/vat-print-qa.test.tsx), P1 and P1b. **Limit:** displayed invoice IDs match outgoing PDF IDs; no hidden different invoice, actual PDF or saved-data loss was observed. Template-only changes with the same invoice are not independently a defect.

### QA-VAT-02 — PDF error belongs to the wrong dialog session

Generate/open invoice 1, hold PDF response, close results and reopen for invoice 2. Reject old PDF: the fresh form claims generation failed although it has not generated anything. If invoice 2's generation is pending, the old PDF error also enables Cancel/Generate; a third attempt becomes possible and older grouping can replace its results.

P:199–200,487–498,964 stores/overlays a shared PDF error without attempt ownership; D:63–66,126–137 bases protection on that outcome. [Print evidence](../evidence/vat-print-qa.test.tsx), P2/P2b/P2c. Real controls were used throughout. Normal pending close protections work; this finding requires the late PDF failure path. Popup navigation is a stand-in, not a browser/PDF execution.

### QA-VAT-03 — Refresh does not reconcile selections

**Print:** at Awaiting EAD, select invoice 1, then refresh saved membership containing only invoice 2. Invoice 1's row disappears but the count stays one; Generate submits its invisible ID. Clearing/reselecting restores a usable request. P:453–469,932–958 passes current rows and persistent old IDs separately. Print test P3.

**Bulk:** select invoices 1/2; background refresh shows invoice 1 already advanced by another writer. The dialog/count still includes both and submits both. Dispatch/return hide the old row; sending leaves it checked and disabled. P:504–516 and stamping-card raw counts do not prune on a query read, only after specific successful writes. [Bulk evidence](../evidence/vat-bulk-qa.test.tsx), B2 for all three stages. Backend can reject or replay these IDs; no persistence eligibility bypass is claimed. Print membership removal is tested at the legally editable Awaiting EAD stage, not Completed.

### QA-VAT-04 — Individual confirmation sends the refreshed version without review

Open any individual event on version 3, choose a date, then refresh to version 4 with a changed invoice amount. Dialog content and chosen date remain unchanged; Confirm sends expectedVersion 4. S:242–254 reads live props and I:890 preserves the same-stage action instance. [Individual evidence](../evidence/vat-single-qa.test.tsx), parent unseen-version cases for all three events. The backend's real stale-version check works in extracted controls, but the client submits the new precondition automatically. No recorded-date overwrite or eligibility bypass is asserted.

### QA-VAT-05 — Both date pickers accept work during submission

Submit one date, open the real calendar and select a later valid date while waiting. Request still contains the original date; success closes the dialog and discards newer input. Unknown failure leaves the newer displayed date alongside the original attempt's result. The individual DatePicker has no textbox; this was calendar interaction, not synthetic typing.

S:328–339 and B:124–130 do not disable the picker; S:236–240 and P:554 close on success without detecting later input. Individual pending cases and bulk control/B3/B1-B3 cover all event types. Duplicate Confirm and normal pending Cancel/header/Escape/scrim are correctly blocked. No implicit second save of the new date is alleged.

### QA-VAT-06 — Bulk unknown outcome is treated as definite failure

After an uncertain response, UI says “The dates could not be recorded. Nothing changed. Your selection and date are kept.” Changing date permits an immediate different request without a reconciliation read. Cancel/reopen clears the date/context; table selection can then be changed. Real memory-router Back while pending/unknown unmounts the page; returning restores no attempt, date or selection.

P:555–565 collapses an upstream unknown classification to failed; P:834–840,975–985 resets/closes state. Local attempt state has no route/unload protection. Bulk B1/B5 and guard-boundary cases. Normal known rejection does retain the exact input. Native browser Back, AppShell/auth loaders and persisted duplicate events were not tested; memory-router lifecycle and outgoing arguments were.

### QA-VAT-07 — Individual recovery state has only the dialog/component lifetime

Unknown response correctly offers Check original attempt. Cancel/header/Escape/scrim closes it; reopening clears its warning/date and allows a different date without reading the original result. A query refresh advancing dispatch→return also remounts the keyed action and loses pending/unknown context. Navigation guard predicates ignore stamping input/pending/unknown state while correctly protecting ordinary card editing.

S:206,295–300,345–348; I:244,886–890. Individual dismissal, parent stage-refresh and guard cases. A missing recovery record additionally unmounts the parent page/action; preserved recovery is not available. The leaf-only “not saved” message for null/undefined is diagnostic, **not claimed as a stable full-page outcome**. No actual browser unload journey or background-tab click through a modal was used.

### QA-VAT-08 — Any date is accepted as proof of the original event

Submit 5 November, lose its answer, then Check. Synthetic reread reports the same stage's event on 6 November, representing another writer. The check closes and advances to the next action without distinguishing the original date. S:270–282 tests whether the field is present, not whether it matches the submitted intent. Individual different-date checks cover all stages and actual Details integration. Matching-date and thrown forbidden/transport-read controls work. This proves wrong reconciliation logic, not another writer actually executing on the database or incorrect actor attribution in saved history.

### QA-VAT-09 — Old bulk success overwrites a newer query cache

Hold a dispatch response, navigate away, then return to a newer canonical mock showing invoice 1 already returned stamped. Release the old dispatch response: return date disappears from the cache and invoice 1 moves back to Awaiting stamped return; no detail reread follows. The synthetic canonical source still contains the return date.

P:250–256 unconditionally installs a response in shared cache and excludes detail from invalidation; the old continuation calls it at P:538 after unmount. Bulk B6 executes the real memory router/page/query interleaving. A newer dialog is not closed by the old page's local state setter. This is stale display/cache replacement, **not a database rollback**.

## Working controls, qualifications and exclusions

- Existing relevant frontend tests: **53/53**, four files, exit 0, 30.69 s. Parent reran retained print+individual evidence: **70/70**, two files, exit 0, 70.61 s; bulk evidence **31/31**, exit 0, 47.44 s. Total frontend checks: **154**. These counts include current-behavior observations: passing reproduces the defects, not fixes them.
- Node 24.13.0 / Vitest 4.1.6 / jsdom, cached local dependencies rather than a clean lockfile installation. Runner config loader avoids denied temporary config writes under linked dependencies. Bulk memory-router cases emitted non-failing jsdom Window.scrollTo diagnostics. All tests assert blocked/unattempted network boundaries; original application files unchanged.
- Normal print/template requests, required inputs, pending duplicate/dismissal guards, known-failure retries, independent selections, eligible UI actions, date bounds, zero-VAT Υ.Δ. and mixed recorded/rejected handling passed their bounded controls.
- [Backend guards/grouping evidence](../evidence/vat-paperwork-guards-qa.py): **40/40** controls, exit 0. Executes 12 exact stamping and five exact grouping/validation method bodies with Java 17 and synthetic DTO/repository/clock/authorization stand-ins. Covers sequencing, required/future/minimum/Athens dates, same-date replay, different-date/stale-version refusal, active type/Export/status, mixed bulk results, deduplication, grouping/max-five, three stages/templates and no print writes. No new backend defect established in this bounded execution.
- Exact-method fingerprints: stamping 117670b910396c9fe94d364906ca61c0ef00cf05effa5a0d17d96e728bcc3a6f; YD 7d94c818a631321b20b7589a66a76f56b8367dc51bb7b9bc244a960958fbb633. These are evidence hashes, not policy-loader fingerprints.
- Source traces reviewed shared ExportStampingService, ExportYdService, SupplierInvoiceRepository, ExportDeclarationRepository locks, API adapters/authorization, schema constraints, PDF model/service/template and existing API tests. Real SQL, transaction rollback, row-lock concurrency, full Java 25/Spring/PostgreSQL, HTTP authorization and integration tests were **not executed**. Extracted authorization is a stand-in, not proof of permission enforcement.
- **Forms:** rendered and visually inspected page 1 of all three local supplied Redesign PDFs; compared fixed/blank fields and customs-office variants with current export-yd.html. Local names/byte lengths match FRO-241's embedded metadata; fetching current embedded URLs returned HTML, so current attachment byte identity is unverified. Historical static forms were not used as production code. No confirmed content discrepancy; actual current PDF rendering, long Greek values, pagination, fonts and responsive UI remain unverified.
- **Replay count clarification:** bulk B4 demonstrates RECORDED and ALREADY_RECORDED collapsed into “Recorded for {n} invoice(s).” FRO-352 explicitly requests that aggregate wording; server preserves separate outcomes. Retained as a transparency question, not a tenth confirmed bug or duplicate-event claim.
- **Conditional bulk fixtures:** empty selection after removing Completed membership and all-rejected response with unchanged eligible projection expose handler boundaries, but the exact legal backend transitions were not established. They are not additional production findings.
- No literal date typing, normal pending-modal dismissal, old callback closing a newly mounted dialog, hidden PDF invoice substitution, duplicate persisted event, protected-date overwrite or backend authorization bypass is claimed.

## Handoff and next step

All 30 complete portal scenarios remain **Not run**; the isolated evidence above supports specific portions only. Evidence reproductions and commands are retained in [the evidence guide](../evidence/README.md). No source fixes, new ticket metadata or grouping decisions are implied.

The user reviewed all nine findings through simple examples, accepted the three groups below and requested full drafts before Linear creation. [Complete drafts and metadata](../../../drafts/vat-paperwork-bugs/README.md) are ready for review; no Linear issues have been created or modified.

## Agreed grouping — draft text and metadata under review

| Group | Agreed ticket purpose | Finding ownership | Proposed priority |
| --- | --- | --- | --- |
| V1 | Print ΥΔ — preserve intended selection and isolate each print attempt | QA-VAT-01, QA-VAT-02 and the printing portion of QA-VAT-03 | Medium |
| V2 | VAT stamping — protect reviewed confirmations, date input and current progress | QA-VAT-04, QA-VAT-05, QA-VAT-09 and the bulk-stamping portion of QA-VAT-03 | High |
| V3 | VAT stamping — retain and correctly reconcile uncertain attempts | QA-VAT-06, QA-VAT-07 and QA-VAT-08 | High |

V1 owns the read-only Generate/Open PDF interaction: pending choices, current eligible print selection and correctly scoped late success/failure. It introduces no new form content, PDF redesign, template or exemption event.

V2 owns review and submission plus successful-response freshness: preserve the individually reviewed invoice version, keep single/bulk date input consistent with the submitted action, remove stale bulk selections visibly, and prevent old bulk success from replacing newer displayed invoice facts. Preserve server eligibility/replay/date/history protections; no new bulk-version API is assumed.

V3 owns pending/unknown attempt continuity and reconciliation on both individual and bulk screens: retain original invoice(s), action/date and reviewed context across dismissal/navigation/stage refresh; distinguish uncertain from rejected; check the original facts rather than any recorded date; preserve recovery after failed/missing reads; require review before a changed request. It does not authorize overwriting a different recorded event or claim duplicate persisted events were observed.

QA-VAT-03 appears in two rows because it has separate print and stamping consumers. Each manifestation has one owner: print selection in V1, stamping selection in V2. V2 owns the reviewed/submitted snapshot and normal pending input; V3 preserves and reconciles that same attempt if its outcome becomes uncertain. Shared implementation must be coordinated without duplicating requirements or inventing a blocking dependency.

Three groups keep printing independent and give uncertain-save recovery its own testable outcome across both entry points. All nine findings remain tracked; each concrete reproduction and its evidence limit must appear in the later drafts. No omnibus cross-entity refactor, forced ticket-per-bug split or Shipment Invoice scope is proposed.

Fresh full FRO-317/321/348/352 remain Done with unchanged descriptions. FRO-379/385 remain Backlog with unchanged scopes (Supplier Invoice correction/cancellation; Export editing/Customs/cancellation); FRO-385 explicitly excludes detailed VAT printing/stamping. Current Bug searches for stamping/Print returned FRO-384/385 only; FRO-384 is creation/files and excludes this scope. Recommend related references and reuse of shared fixes where applicable, without silently expanding existing tickets. No duplicate VAT-specific owner was found in these searches.

Production main rechecked unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Grouping and drafting add no source change or test run; earlier evidence and limits remain. Current statuses/labels verified; the draft package maps all nine findings to acceptance criteria and each criterion to read-only verification. Full text/metadata await review before creation. No Linear write, new vocabulary, ADR, canvas/preview or production branch.
