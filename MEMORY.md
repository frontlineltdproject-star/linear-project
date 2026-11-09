# Linear — ticket creation and editing memory

### 2026-11-09 — Next flow recommendation and parallel review boundary

- After creating FRO-384/385, user requested the next review and flagged another active chat. Read the latest task in “Check production review progress” (01a1c024-28a1-7942-b662-f252b699586b): user explicitly assigned Shipment Invoice mapping/review there, with Export/Customs/VAT paperwork excluded. Delivery Note review there already produced FRO-381–383. No message or instruction was sent to that chat.
- Recommend this chat next review VAT-exemption paperwork: Υ.Δ. protocol/printing → record dispatch for stamping → stamped return → paperwork sent to recipient, through individual Supplier Invoice and Export bulk actions. This is a recommendation, not user approval to start the next audit or a completed map. Keep Shipment Invoice work with the other chat.
- Fresh full FRO-317/321/348/352 read Done. Production main authenticated through gh remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Reviewed current Export workflow, ExportYdService and ExportStampingService; verified corresponding Details entry points. Printing is read-only and allowed before Customs completion; stamping requires positive IE599/Completed. Customs completion does not itself exempt invoices; sending stamped paperwork retains Exempted status.
- Proposed coverage: PDF selection/grouping/template/protocol and saved-data fidelity; individual-versus-bulk consistency; per-invoice partial results, date/eligibility checks, retries/concurrency and recovery; independent membership, Customs and history preservation. Map expected flow first, then isolate bugs and assess overlap with existing QA tickets before proposing new tickets.
- Mandatory planning pull succeeded. No new findings, application runs, Linear writes, production mutations, UI preview/branch, new vocabulary or ADR. Record only this recommendation and preserve the parallel Shipment Invoice files plus unrelated draft/patch/.wrangler work during synchronization.

### 2026-11-09 — Two Export Flow QA tickets approved, created and verified

- User approved both complete drafts and explicitly requested creating them with proposed priorities and labels, including Flow QA. D1 → FRO-384 (creation/drafts/pending creation/files); D2 → FRO-385 (Details edits/reviewed versions/confirmation recovery). Both High. Full URLs, unchanged descriptions and finding ownership are in [the package index](drafts/export-bugs/README.md).
- Both FRO Backlog, Story + Bug + Pending_Review + Flow QA + Frontend + export. Exact related sets: FRO-384 to FRO-317/350; FRO-385 to FRO-317/352. No blocking/duplicate relations, project, assignee, milestone, parent, cycle, due date, estimate, attachments or documents. Existing active Flow QA reused; no readiness promotion.
- Mandatory planning pull succeeded. Authenticated gh retry outside the restricted network verified source main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Full FRO-317/350/352 re-read unchanged; status/label catalogues refreshed. Complete creation/Details duplicate searches returned 75/79 results with no matching new bug issue.
- Re-read both saved issues; descriptions match the approved files after only table/list/link Markdown presentation normalization. Titles, priorities, full labels, team/status, exact related sets and unset optional metadata all verified. Approved files still match bf9a95b; all six findings and 14 acceptance criteria preserved.
- Updated package, catalogue and report with created-ticket tracking. No production source/portal/database changes, previews, branches or new application test runs. Existing requirement descriptions/statuses untouched; new related links only. Preserve unrelated FRO-326/352/353 patch/.wrangler work during planning synchronization.

### 2026-11-09 — Two Export groups accepted; complete drafts prepared

- User accepted G1 creation/drafts/pending submission/files and G2 Details edits/reviewed versions/confirmation recovery, requesting complete drafts before Linear creation. Prepared two standalone descriptions plus metadata/coverage/consumer index in [drafts/export-bugs/](drafts/export-bugs/README.md). Grouping is approved; final text, metadata and Linear writes await review. No Linear changes.
- Proposed both High, FRO Backlog, Story + Bug + Pending_Review + Flow QA + Frontend + export. D1 related FRO-317/350; D2 related FRO-317/352. No blockers, project, assignee, milestone, parent, cycle, due date, estimate, attachments or documents. Current statuses and labels fetched and verified; reuse active Flow QA.
- Planning pull succeeded; authenticated gh and production main rechecked unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Full current FRO-317/350/352 re-read Done; relevant source consumers re-traced. Export + Bug search returned only existing Supplier Invoice scopes; no expansion of those tickets. Repeat duplicate search before eventual creation.
- All six findings assigned once; each has separate acceptance coverage and all 14 criteria map to read-only post-deployment checks. Saved descriptions/source links checked. Evidence remains isolated UI and extracted guards; full portal/browser/storage/backend execution and deployed equivalence are unverified. No application tests rerun for drafting.
- Updated catalogue and report with accepted groups/draft links. Existing presentation reused, no canvas/preview or production branch. No source/portal/database changes, new vocabulary or ADR. Preserve concurrent Delivery Note work and unrelated FRO-326/352/353 patches/.wrangler during planning sync.

### 2026-11-09 — Two Export bug groups proposed after example review

- User reviewed all six Export findings through simple examples, then requested grouping without too many tickets. Proposed G1 creation/drafts/pending submission/files (QA-EX-01/02/03) and G2 saved Details editing/reviewed versions/confirmation recovery (04/05/06). Full scope and rationale in [the review report](docs/qa/runs/2026-11-09-export-to-customs-completion.md#accepted-ticket-grouping--created-tickets). At this stage user agreement was pending; later acceptance and full drafts are recorded above.
- Each finding retains its reproduction and acceptance checks. G2 includes Details, invoice membership, EAD/IE599 and cancellation where affected; G1 spans draft → attempt → result → upload recovery. Grouping is by a coherent operation lifecycle, not a claim of one root cause/fix or an effort estimate. No blocking dependency established. Proposed requirement links: G1 FRO-317/350, G2 FRO-317/352.
- Planning pull succeeded. Current full FRO-317/350/352 descriptions re-read unchanged, Done; authenticated production main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Export + Bug search returned only Supplier Invoice scopes. Full FRO-378/379 re-read; preserve their existing entity boundaries, do not expand them. Flow QA label verified active for eventual reuse.
- Existing presentation contracts reused; no new UI design/preview or production branch. Detailed VAT printing/stamping, pending list/Entry links and the ruled-out family-aggregation interpretation stay excluded. No new source changes, application execution, vocabulary or ADR; evidence limits remain unchanged. Updated report/catalogue only; preserve unrelated drafts/patches/.wrangler when synchronizing.

### 2026-11-09 — Export creation to Customs completion mapped and reviewed

- User approved this next flow, explicitly map first then investigate. Saved [FLOW-EX](docs/qa/flows/export-to-customs-completion.md) and [28 scenarios](docs/qa/scenarios/export-to-customs-completion.md) before defect testing; [report](docs/qa/runs/2026-11-09-export-to-customs-completion.md) records six isolated UI findings. Detailed Υ.Δ. printing/stamping stays next pass; protocol allocation and preserving invoice VAT events are current boundary checks.
- Current full FRO-317/350/352/321/319 read Done; FRO-368/370 Backlog exclusions retained, FRO-303 Todo not assumed delivered. Four core issue comment lists were empty. Fresh Export + Bug search returned only Supplier Invoice scopes FRO-379/380. No Linear edits or new ticket groups/drafts yet.
- QA-EX-01: in-app navigation loses creation drafts, unknown-attempt recovery and failed-upload bytes. 02: pending creation can be discarded with a false “Nothing has been saved” claim, while late success still uploads original bytes. 03: file edits during submission upload removed bytes and strand newly staged files. 04: Details/membership/customs/cancellation use refreshed unreviewed versions; unchanged membership draft can remove another writer's newly added invoice. 05: pending saves erase later typing, removals or replacement editors. 06: unknown Customs/cancellation outcomes become definite “Nothing changed” failures; closing/retrying loses original context without reconciliation.
- Parent independently ran 136 existing frontend tests, 6 creation observations/controls and 15 Details observations/controls, all passing as baseline/defect observations, not fix verification. Added 16 passing extracted-Java Customs/cancel guard controls; stand-ins, no Java25/Spring/PostgreSQL transaction or authorization execution. All 562 original client files matched pinned source. All full portal scenarios remain Not run; no duplicate persisted event or deployment-equivalence claim.
- Important ruled-out suspicion: full FRO-319 explicitly derives Entry invoices/Export from its owning Order and prohibits family aggregation on inherited access. Per-child divergent Export observation was based on an incorrect expectation, not a defect. Corrected flow/scenario and excluded the finding; removed its temporary planning evidence. No business clarification needed; existing requirement is explicit.
- Planning pull succeeded. Authenticated production main checked again at finish and remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Source loader failed on archive without .git; direct policies read, no fingerprint claimed. No production source/portal/database changes, preview, branch or Linear write. Existing vocabulary sufficient; no ADR.
- Next: explain the six findings with simple examples, then agree compact groups and review drafts before Linear creation; reuse Flow QA when approved. Preserve unrelated FRO-326 drafts/patches, FRO-352/353 patches, .wrangler and concurrently appearing Delivery Note QA files during planning synchronization.

### 2026-11-09 — Next review recommendation: Export and linked VAT-exemption paperwork

- After Supplier Invoice tickets were created, user asked which flow to review next. Recommend Export creation → EAD receipt → positive IE599/Customs Completed, followed by linked Υ.Δ. protocol/printing and invoice-owned dispatch for stamping → stamped return → paperwork sent to recipient. This connects the already-reviewed Shipment and Supplier Invoice flows; it is a recommendation, not an approved new audit or completed flow map.
- Suggested two review passes within this connected flow: first creation/grouping/eligible invoice membership/MRN/documents/Customs transitions and guarded edits/cancellation; then protocol, Υ.Δ. output and individual/bulk stamping/recovery. Map expected behavior before defect testing; distinguish Customs completion from invoice exemption and keep physical cargo separate from paperwork-only invoice links. FRO-319 is a storage-relationship boundary for the future review, not a completed audit here.
- Current full FRO-317/350/352 read Done; FRO-368 remains Backlog for Export list/search/menu. Existing route-only navigation must be distinguished from that pending work. Production main rechecked at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; read export-customs-declaration workflow, current Create route/service, ExportEditingService customs transitions and ExportStampingService invoice/bulk guards. Older ticket Context-for-agents absence claims are historical, not current main.
- Scope recommendation only: no new bug findings, application runs, Linear changes, production mutations, previews or source changes. Planning pull succeeded; preserve unrelated local draft/patch/.wrangler changes when synchronizing this note.

### 2026-11-09 — Three Supplier Invoice Flow QA tickets approved, created and verified

- User approved the complete three drafts and explicitly requested creating them with the proposed priorities and labels, including Flow QA. D1 → FRO-378 (creation ownership/recovery, High); D2 → FRO-379 (Details editing/cancellation, High); D3 → FRO-380 (vessel identity/activity, Medium). All seven findings retain their approved owners. URLs and full saved metadata are in [the package index](drafts/supplier-invoice-bugs/README.md).
- All FRO Backlog with Story + Bug + Pending_Review + Flow QA + supplier invoice. D1 also Frontend + Order; D2 Frontend; D3 Backend. Exact related sets: D1 FRO-321/347/349, D2/D3 FRO-321/348. No blockers/duplicates, assignee/project/milestone/parent/cycle/due date/estimate or attachments/documents. Existing Flow QA label reused; no new label or readiness promotion.
- Planning pull succeeded; authenticated gh source SHA remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Four current requirement descriptions re-read unchanged. Label/status catalogues refreshed. Three complete-page title searches (83/80/78 results) found no exact matches; inspected Supplier Invoice candidates were existing requirements with different scopes.
- Re-read every saved issue and matched its complete description after only Markdown/issue-chip normalization; titles, priorities, full labels, Backlog/team, exact related sets and unset optional fields all verified. Approved description files remain unchanged. No existing requirement description/status edits; related links added from new tickets.
- Updated package and QA catalogue/report with created-ticket tracking. No production source, portal/database or application test changes. SI-Q01 wording alignment remains a separate reviewed FRO-321 edit, outside these bugs. Preserve unrelated FRO-326 and other local patches/.wrangler during planning synchronization.

### 2026-11-09 — Three Supplier Invoice groups accepted; complete drafts prepared

- User accepted G1 creation, G2 Details editing/cancellation, G3 vessel identity/history and requested drafts before Linear creation. Prepared three complete standalone descriptions plus metadata/coverage index in drafts/supplier-invoice-bugs/. Grouping is approved; final text, metadata and Linear writes await review. No Linear changes.
- Proposed all FRO Backlog, Story + Bug + Pending_Review + Flow QA + supplier invoice. D1 additionally Frontend + Order; D2 Frontend; D3 Backend. Proposed High D1/D2 and Medium D3. Related only: D1 FRO-321/347/349; D2/D3 FRO-321/348. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or blocking relations. Current status/label catalogues fetched and checked.
- Fresh planning pull, authenticated gh and production main SHA check succeeded; baseline remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Current full FRO-321/347/348/349 descriptions re-read unchanged. Bug/supplier invoice search returned only FRO-375's different Order/Shipment scope. Source consumers/operations re-traced for the drafts.
- Every finding has its own reproduction/acceptance coverage; evidence limits and read-only post-deployment checks are explicit. D1 requires isolated stored-file ownership checks, D2 real navigation plus backend stale-refusal evidence, D3 database-backed identity/audit verification. No new application execution, source fixes, previews, branches or portal/database writes. Existing UI contracts reused.
- SI-Q01 remains the accepted full-split exception; separate reviewed FRO-321 wording alignment is pending, outside these bug drafts. No new vocabulary or ADR. Updated QA catalogue/grouping report; preserve unrelated FRO-326/other draft patches and .wrangler during planning sync.
- Draft verification: three saved descriptions matched prepared text; all seven findings assigned once; all 16 acceptance criteria map to read-only checks; ten source paths and 36 links validated. Proposed full label sets and FRO Backlog checked against fresh metadata. No application tests rerun for drafting.

### 2026-11-09 — Three Supplier Invoice bug groups proposed after example review

- User reviewed all seven findings through simple examples, then requested grouping without excessive tickets. Proposed G1 creation (QA-SI-01/02/03), G2 saved Details editing/cancellation (04/05/06), G3 vessel identity/history (07). Full boundaries and rationale are in [the review report](docs/qa/runs/2026-11-09-supplier-invoice.md#accepted-ticket-grouping--created-tickets). At this stage grouping awaited user agreement; the later acceptance and drafts are recorded above. No metadata approval or Linear writes.
- G1 covers unresolved replacement, wrong-owner files, late Order lookup and lost saved confirmation. G2 covers pending/unknown cancellation recovery, reviewed-version preservation and later typing. G3 covers ignored same-name vessel corrections and omitted activity. All seven retain separate verification cases. Proposed implementation order G1, G2, G3; no automatic addition to existing Order/Shipment tickets.
- Planning pull succeeded; production main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Current full FRO-321/347/348/349 descriptions match the reviewed versions. Fresh Supplier Invoice/same-name searches found no exact bug duplicate; FRO-375 re-read and retains its Order/Shipment scope. Future approved issues can reuse Flow QA.
- SI-Q01 remains an accepted split exception, not a bug; FRO-321 wording alignment needs a separate reviewed edit, not a new bug ticket. Existing presentation contracts reused; no canvas/preview, production branch, product changes or new application test runs. No new vocabulary or ADR. Preserve unrelated local draft/patch/.wrangler changes during planning synchronization.

### 2026-11-09 — Supplier Invoice flow mapped and first bug review completed

- User approved Supplier Invoice capture/correction/cancellation as the next flow, explicitly asking to map expected behavior first and then check bugs. Saved [FLOW-SI](docs/qa/flows/supplier-invoice.md) before independent investigations, expanded to [28 scenarios](docs/qa/scenarios/supplier-invoice.md), and recorded [seven findings with evidence](docs/qa/runs/2026-11-09-supplier-invoice.md). Full Export assignment/exemption progression remains the later flow; existing guards are boundary checks here.
- Current full FRO-321/347/348/349/356 read (Done) and FRO-318 (Backlog). Source main reverified through authenticated gh at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Historical “not implemented” context in UI tickets is distinguished from current source. No Linear or production-source/portal/database changes.
- QA-SI-01: replacing pending/unknown creation loses recovery; late success can upload replacement-draft bytes against the old invoice. QA-SI-02: cancelled-page lookup changes the newer draft's selected Order. QA-SI-03: failed return navigation erases confirmed creation. QA-SI-04: closing unknown cancellation clears its recovery/guards; pending cancellation lacks navigation protection. QA-SI-05: cancellation adopts a refreshed unreviewed version. QA-SI-06: save/reconciliation completion discards later typing. QA-SI-07: same-name vessel references compare equal, skipping a correction or its activity detail.
- Parent independently ran 71 existing frontend tests, 4 creation observations and 9 Details observations/controls; all passed as baseline/defect observations, not fix verification. Seven extracted-Java checks passed for the vessel comparison; no full backend/database run. All 562 original client files matched pinned source. Full portal scenarios remain Not run; no deployed-version claim. Policy loader failed on archive without .git; direct instructions/policies read, no successful loader fingerprint claimed.
- User accepted SI-Q01: full explicit split may cancel the parent while its Supplier Invoice remains active, preserving invoice identity/facts/files/history and flagging explicit reassignment. Existing reassignment guards remain; no automatic invoice move/copy/cancellation. This deliberate source behavior is not an eighth bug. FRO-321's blanket cancellation wording needs separate reviewed alignment; no issue edit yet. No ADR needed for this clarification of existing behavior.
- Added the already-agreed Supplier Invoice meaning to CONTEXT.md. New evidence scripts are offline, synthetic and bounded; no actual backend file placement or cancellation bypass claimed. Ordinary correction-version and unrelated-writer recovery controls ruled out suspected extra defects. Fresh Bug/supplier-invoice search found only FRO-375's different Order/Shipment scope.
- Seven findings do not imply seven tickets: review examples/grouping before drafting and approval. Future approved bug issues can reuse Flow QA. Preserve unrelated FRO-326 drafts, other patch files and .wrangler during planning synchronization.

### 2026-11-09 — Five Flow QA bug tickets approved, created and verified

- User approved the complete five drafts and explicitly requested creating them plus a shared identifying label. Created reusable FRO team label Flow QA (`06ea4564-06f3-40c4-b546-404049f66151`): bugs identified while reviewing regular business flows against agreed requirements. No equivalent label existed in the fresh catalogue.
- D1 → FRO-373 (Shipment unfinished work); D2 → FRO-374 (Order colli crash/validation); D3 → FRO-375 (stale overwrites/comment retries); D4 → FRO-376 (packing weights/history); D5 → FRO-377 (upload 401 diagnosis/fix, with two explicit contract clarifications). Full URLs and complete metadata are in [the approved package index](drafts/order-to-arrival-bugs/README.md). All 13 findings retain their approved owners.
- All FRO Backlog, Story + Bug + Pending_Review + Flow QA; D1/D2/D3 Frontend, D4 Backend, D5 Integration. Approved entity labels and exact related owner sets retained; no blockers. High D1/D3/D5, Medium D2/D4. No assignee/project/milestone/parent/cycle/due date/estimate or attachments/documents. No readiness promotion.
- Planning pull succeeded. Production main remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; ten linked owner descriptions freshly read unchanged. Five complete-page duplicate title searches found no exact matching title. Current labels/status fetched before writes.
- Re-read all five saved issues and matched every approved description after normalizing only Linear Markdown/issue-chip rendering. Verified titles, team, Backlog, priorities, full label sets, exact related sets, empty blocking/duplicate relations and unset optional metadata. New Flow QA label re-read and present on all five. Existing issue descriptions/statuses were not edited; related links were added from the new issues.
- Updated the draft index and QA catalogue with created-ticket tracking; approved description files unchanged. No production source/portal/database changes, previews, branches or application test runs. Upload root cause and historical journey runtime verification remain developer investigation work. Preserve unrelated FRO-326 and other local draft changes when syncing this planning update.

### 2026-11-09 — Five bug groups accepted; complete ticket drafts prepared

- After reviewing simple examples one by one, user explicitly accepted five groups and requested complete drafts for review before Linear creation. This supersedes the earlier nine-ticket proposal; approval covers the grouping and local drafting, not the final descriptions/metadata or a Linear write.
- Drafts in drafts/order-to-arrival-bugs/: D1 Shipment unfinished work (QA-OS-01/07/08); D2 Order colli forms/stock panel (09/11); D3 safe saves and retries (05/06/10); D4 packing data/history (12/13); D5 upload 401 investigation/fix (02), retaining contract clarifications 03/04. README contains full finding coverage and metadata; each numbered .md contains the complete proposed description.
- Proposed all FRO Backlog, Story + Bug + Pending_Review, no project/assignee/parent/milestone. D1/D2/D3 Area Frontend, D4 Backend, D5 Integration. Entity labels and related owner tickets specified in draft index; no blockers. Proposed High D1/D3/D5, Medium D2/D4. Metadata was fetched fresh; labels respect one Type/Area. No Linear changes.
- Planning pull succeeded; production main rechecked unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e through authenticated gh. Current full FRO-316/325/326/335/336/341/342/344/345/346 descriptions remain Done and unchanged. Fresh draft/packing/retry/401/colli duplicate searches found no exact open duplicate. Keep source findings distinct from deployed evidence.
- Drafts preserve existing contracts and include reproductions, acceptance criteria, scope/decisions, implementation sources and read-only post-deployment checks. No new design/preview or production branch. No application tests rerun for documentation-only drafting; prior evidence remains explicitly bounded. Historical-journey runtime verification and real upload cause remain open. D5 explicitly requires resolving the no-file-context contract rather than guessing it; other issue wording edits need separate review.
- Updated the QA index/report to point to the accepted five groups while retaining the original nine-group proposal as history. No new glossary or ADR decision. Preserve unrelated FRO-326 files, other draft patches and .wrangler during synchronization.
- Draft validation: five saved descriptions matched prepared text; all 13 findings assigned once; labels/related owners verified; 19 local links and eight explicit source paths checked. Independent review tightened omitted net/notes scope, refusal evidence without a backend exception, and upload success on both entity paths. Read-only checks map every acceptance criterion. Descriptions remain pending user review.

### 2026-11-09 — Order-to-arrival second pass and proposed bug grouping

- User requested continued independent bug review of this flow, then a decision on ticket grouping. Re-pulled planning main successfully; authenticated production main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Current core Linear descriptions re-read unchanged; FRO-362 remains Backlog. No production/portal/database/email/fiscal writes or Linear changes.
- Added docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md and nine regression scenarios OS-027–035 (35 total). All full scenarios remain Not run. Added two component reproduction files and a portable extracted-Java evidence script; no production fixes.
- Nine additional findings QA-OS-05–13: stale Shipment packing confirmation; comment retry identity rotates after version refresh; sibling Notes typing lost on save; arrival draft lost on tab changes; stock-entry crash after a new colli appears; Order retry review adopts an unreviewed version; invalid colli measurements pass local validation; omitted net weight cleared with gross; retained-unit edits alter earlier journey type/label context. Eight have isolated runtime evidence. Historical journey mismatch is supported by writes/reads/SQL guards, with database execution pending.
- Parent independently reran 9 Order + 7 Shipment tests, all passed as defect observations/controls; portable Java script passed five behavior checks plus network guard. Client source remains unchanged from the pinned archive. Full backend integration/deployed journey remain unexecuted. Nullable-header-clearing suspect ruled out by independent-card payload tests; no new core dispatch/arrival/cancellation defect inferred from untested paths.
- Proposed nine tickets G1–G9 in the second-pass report: separate origin, Order stale review, Shipment stale review, stock-panel crash, numeric validation, comment retry and upload investigation; group Notes/arrival local drafts together and net/history backend packing preservation together. This is a proposal, not an approved grouping or full ticket draft. QA-OS-03/04 remain explicit contract-reconciliation items beside upload, not established 401 causes. Full drafts and approval required before Linear writes.
- Searched current shipment/readiness/stale/upload/colli issues for duplicates. FRO-278 Done concerns a different old composer loop; FRO-365 Backlog already owns irrelevant AWAITING_IMPORT readiness actions. No exact open duplicate found for the proposed scopes. Preserve unrelated FRO-326 files, other patches and .wrangler when committing this review.

### 2026-11-09 — Order-to-arrival flow catalogue and first bug investigation

- User approved starting with Order creation → readiness → stock → Shipment preparation/dispatch/arrival and investigating `C:/Users/Giorgos/Desktop/Front Line/bugs.md` warehouse-change and upload reports. User confirmed Railway currently contains mock data, nothing official, and the changed field was Origin warehouse. Email/AADE settings remain unverified; this does not authorize portal mutations.
- Added central catalogue at `docs/qa/README.md`, normal flow, 25 additional scenarios (26 total), dated evidence/run ledger and two offline reproduction harnesses. Scenarios have setup/actions/expected outcomes, requirement owners, test priorities and separate execution records. All full portal scenarios remain Not run; no claim of end-to-end verification.
- Fresh production main through gh: `6aa259553cd9c86a8aaa157902088aa9a6bca83e` (source version 0.0.13), unchanged on final check. Deployed versions not independently confirmed. Current FRO-335/326/336/346/328/342/341/325/344/345/316/323/356 read Done; FRO-362 remains Backlog and is excluded from delivered partial-selection expectations. Production policy loader failed on archive lacking Git metadata; direct policy reads used, no successful loader fingerprint claimed.
- QA-OS-01: demonstrated seeded Shipment draft defect. Uncached origin candidate query makes route unmount the form, then cached initialDraft restores original origin and loses notes. Clearing origin can leave disabled query pending and page loading indefinitely. Three isolated actual-route/controller/form observation tests passed, including cached-query control; 562 copied client source files matched archive. 54 existing relevant tests passed but miss composed refetch boundary; two act warnings. User's Origin confirmation matches trigger; no literal JS exception/deployed reproduction established.
- QA-OS-02: exact upload 401 UI and Create blocking reproduced with injected context-PUT/upload-POST failures; same bearer helper used for REST and GraphQL. Actual server cause unresolved. Need failed request method/URL and matching backend exception/config evidence; storage/error-dispatch masking and endpoint divergence remain hypotheses. Staging refusal does not itself create an Order. Source-based retry/atomicity evidence distinguished from reload/new-draft risk.
- Recorded stale FRO-336 post-create-upload wording versus staged FRO-335/342, and FRO-335's mandatory no-file context versus current nullable context, as distinct specification/implementation discrepancies. No ticket changes. FRO-316 explicitly places arrival in Available actions, so note #8 is not established as a violation of that contract.
- Validation: local Markdown/evidence links, 26 scenario ledger entries, 25 pinned source paths/line anchors and whitespace checked. Node24.13 upload harness and three warehouse reproductions rerun by parent. Full frontend build/backend suites not run; Java11 available versus required25. No portal/database/email/fiscal writes or production-source changes. No Linear writes or frontend branch. Preserve unrelated FRO-326 drafts/patches and other untracked files when committing this task's planning artifacts.

### 2026-11-06 — Repacking entity change deferred

- User has not observed a need to follow the same intact pallet/box across multiple transport legs and accepted retaining the existing Shipment-scoped load-unit model. Revisit persistent packaging/composite-colli structure if an actual operational case emerges. No new ticket or change to FRO-362 authorized or needed for this decision.

### 2026-11-06 — Repacking as parent colli discussion

- User asks whether a repack should become a new colli pointing to its contents. Read main 5774931 ShipmentLoadUnit, ShipmentLoadUnitContent and repository through gh. Load units already have identity, Shipment owner, type, label, dimensions and weights; content links original colli IDs to an optional load-unit ID. Counts treat an overpack as one transport piece while retaining contained colli identities.
- Current FRO-325 (In Progress) adds saved versus confirmed packing and historical arrangements, supports mixed-Order overpacks and one overpack per colli. FRO-323 (Todo) takes historical colli identities into onward selection without carrying the earlier packing arrangement. These planned contracts are distinct from verified main implementation.
- Open discovery question: is persistent identification of an intact pallet/box across warehouse stays and later Shipments required? That would justify investigating a durable packaging entity or composite handling unit; no architecture decision or ticket modification approved. Keep FRO-362 scope separate pending a decision.

### 2026-11-06 — FRO-362 approved, created and verified

- Created FRO-362, Order & Shipment — independent colli custody and movements, after explicit approval of the complete draft and metadata. https://linear.app/front-line-ltd/issue/FRO-362/order-and-shipment-independent-colli-custody-and-movements
- Re-read saved issue and verified description exactly against drafts/independent-colli-movements.md after normalizing Linear issue chips. Verified Backlog; complete labels Epic, Backend, Order, Shipment, Pending_Review; no project, milestone, assignee or attachments. All 14 approved related issues present, no blocking relations.
- Existing ticket descriptions/statuses were not edited. UI, preview and mock-branch work skipped as requested. Structural implementation and later deployment verification remain developer work. ADR 0005 and Q1-Q8 decisions are captured in this planning repository.

### 2026-11-06 — Independent colli movement Q8 and complete draft

- Q8 accepted mixed physical summaries, colli-aware stock filters, matching versus overall counts, one ungrouped row per Order and distinct overall Order counts across warehouse groups.
- Complete proposed structural draft prepared in drafts/independent-colli-movements.md. Proposed title: Order & Shipment — independent colli custody and movements. Proposed Backlog with Epic, Backend, Order, Shipment and Pending_Review; related links only to the named consumer owners. No Linear write pending review of the complete text.
- Consumer trace includes Order grouping/status filters, singular custody reads, StockListPdfService/ModelFactory's one-warehouse/document assumptions and DeliveryNoteDraftSourceService's all-Order-colli expansion. Draft includes compatibility/activation and evidence-based migration requirements; actual historical coverage, source/destination storage layout and supported mixed-summary API implementation must be verified by the developer. Existing children are mock data and retain identities/history per Q4.

### 2026-11-06 — Independent colli movement Q7 accepted

- Partial reservation before receipt is allowed for identified collis, using shared Order supplier readiness and their expected warehouse. Only selected collis are reserved. Shipment readiness and dispatch require every selected colli to be stock-confirmed at the origin; unreceived siblings do not block departure.
- Read current PurchaseOrderRepository grouping/filtering through gh. Order-level status, inactive classification and warehouse grouping need colli-aware summary/filter contracts. Next discussion concerns mixed physical summaries and warehouse-filtered totals. No Linear change.

### 2026-11-06 — Independent colli movement Q6 accepted

- User accepted separate Orders for batches requiring separate Customs Storage Entries, even when their customs regime matches. Preserve actual admission coverage; no implicit addition of later goods to a prior Entry. Updated ADR 0005. No Linear change.
- Next business decision is partial reservation before stock confirmation. Current FRO-325 (In Progress, updated 2026-11-06) and main 5774931 require whole upcoming Orders. Shared supplier readiness remains accepted; partial planning needs its own explicit rule.

### 2026-11-06 — Independent colli movement Q5 accepted

- Keep customs regime and registration/ΑΛΚ shared across the whole Order. Deliberately separate Orders when different customs arrangements are required. User considers mixed customs arrangements an extreme edge case and will revisit if necessary. Recorded in ADR 0005.
- Re-read FRO-319: it fixes Customs Storage Entry coverage at first qualifying stock admission, one owning Order, and derives matching invoices through that Order. Separate initial admissions under one Order still need an explicit boundary; no assumption that later collis can be appended to an existing admission. No Linear changes.

### 2026-11-06 — Independent colli movements structural scope accepted

- User accepted Q1 complete movement scope: separate arrivals, warehouse custody and outgoing Shipments within one Order without automatic child creation for movement. Q2 accepted shared Order supplier readiness for this version. UI canvas, preview and mock branch explicitly skipped. Workflow remains at interactive business decisions and consumer tracing before a complete draft and Linear approval.
- Recorded architectural direction in docs/adr/0005-independent-colli-movements-within-one-order.md and supplier-readiness vocabulary in CONTEXT.md. Schema, migration and document coverage remain unsettled.
- Main remains 5774931. FRO-325 and FRO-344 are In Progress with whole-Order reservations, automatic child creation and Order-level readiness guards. FRO-323 consumes those rules; FRO-302 Backlog still requests child creation. Live services also restrict colli edits when any Order participation is open. New scope needs coordinated consumer requirements and ownership; no linked issue changed.

### 2026-11-05 — Import entity label

- Created the FRO team label `import` in the same blue as `export` and added it to FRO-359 and FRO-360. Re-read both issues and verified their complete label sets, descriptions, attachments, statuses and relations against the pre-edit reads.

### 2026-11-03 — FRO-360 unfinished progress line fixed

- User requested a grey line between unfinished stages. Found the connector used undefined --border-strong; this preview defines --border2 (#d7dce3). Replaced the missing token in the stepper so future connectors and node outlines render light grey on desktop/mobile; reached connectors stay teal.
- Verified CSS token references resolve and rebuilt the standalone HTML. Local presentation fix only; no Linear or production change.

### 2026-11-03 — FRO-360 expanded Shipment copy simplified

- Removed the three requested explanatory texts and their Greek equivalents from More Shipment information in the Export-style preview. Removed DEMO-201/DEMO-202 under the Client name; clarified that these are fixture Order numbers, not invoicing companies. Client name, Vessel, physical status, packing and totals remain.
- Text-only local preview adjustment; no business-rule, Linear or production changes. Exact removal checks, JavaScript syntax and rebuild passed.

### 2026-11-03 — FRO-360 status controls and connected progress track

- User requested transition buttons in FRO-352's location and a connected line coloured through the current stage. Local Export-style Import now has a read-only status field on the left and existing transition actions on the right, above the numbered track; mobile wraps actions below and stacks the connected track vertically.
- Track reaches the active status; optional payment remains visibly skipped when not required. Existing action rules reused unchanged. Syntax/build and 18 EN/EL scenario render checks passed, including action placement markup and progress extent. Browser visual review remains pending. No Linear/production/deployment changes.

### 2026-11-03 — FRO-360 customs status bar

- User requested the FRO-352 bar presentation. Current FRO-352 status contract and local preview checked. Added a non-clickable five-stage numbered indicator inside Import details; inspection is shown under the result stage, payment is conditional and explicitly Not required when bypassed. Cancelled records have no progression bar. Existing confirmation actions and rules unchanged.
- EN/EL render assertions cover draft, result, both inspections, no-payment, paid, completed and cancelled; build/syntax passed. Visual review remains pending with user. No production/Linear/deployment changes.

### 2026-11-03 — FRO-360 Shipment context flattened

- User requested expanded Shipment context inside the existing Shipment relationship card, without a nested card or repeated collapsed fields. Updated the Export-style local preview: disclosure retained; Client, Vessel, physical status, packing and weight appear inline. Shipment number and document type/number appear only in the always-visible row.
- Presentation-only adjustment; no business-rule, Linear, production or deployment change. Build/syntax and EN/EL markup checks verify one relationship card and no duplicated transport document. Browser visual review remains with the user.

### 2026-11-03 — FRO-360 revised around Export UI pattern

- User approved the recommendation to follow FRO-350/352 rather than keep A–C unchanged. Default local preview now has horizontal page tabs; Overview has Shipment relationship then Import details with embedded customs status/actions and event dates. Additional Shipment context is expandable; creation uses stacked relationship/details/coverage sections. Earlier concepts remain in the reviewer selector.
- Import-specific rules preserved; no approval of final field set or production implementation implied. Live main still 5c51030; production tabs.tsx read through gh. Mapping and README updated.
- Standalone render/ordering, 80 language/scenario/tab combinations and advanced creation rendering passed with a DOM stub; syntax/build passed. Browser visual/interaction verification remains pending. User can refresh the same local index.html. No Linear write, public deployment or production/mock branch.

### 2026-11-03 — FRO-360 local preview files prepared; browser review pending

- User authorized local previews only, no production implementation/mock branch. Three fixture-only concepts and creation/lifecycle scenarios saved in previews/fro360, with live-source component mapping and EN/EL controls. No direction approved yet.
- Self-contained index.html built; JavaScript syntax check passed. Browser verification remains pending: Computer Use halted due to inability to determine Chrome URL, and localhost server attempts timed out. Do not describe the localhost link as verified. Added direct-file support (skip history.replaceState on file protocol) and README so index.html can open without a server.
- No production/Cloudflare changes or Linear write. Employee feedback and whole-colli applicability remain pending. Planning artifacts committed separately from unrelated drafts.

### 2026-11-03 — FRO-360 concept-review ticket created and verified

- User explicitly approved writing the displayed concept-review ticket and linking359. Mandatory pull/duplicate search succeeded. Created FRO-360 https://linear.app/front-line-ltd/issue/FRO-360/import-customs-declaration-concept-previews-and-employee-feedback at2026-11-03T09:51:15.386Z.
- Independent full read matches approved drafts/imports-concept-review-spec.md after issue-chip/link/list normalization. Verified Backlog; Pending_Review/Frontend/Spike; Pre-releases0.0.x; assignee/milestone/parent unset, no priority; empty attachments/documents and no blocking links. Sole related issue359; reverse read of359 confirms360 added alongside its five existing relations.
- Scope remains previews and employee feedback only, no production implementation/mock branch. No preview built/published, no Cloudflare mutation, no message sent to employees, no Ready promotion. Pages publishing access still unverified (scoped token absent in environment at drafting). Planning receipt synchronized; unrelated files preserved.

### 2026-11-03 — Imports concept-review ticket drafted; no implementation authorized

- User requests a separate concept-review ticket linked to FRO-359, for previews and employee feedback only; explicitly excludes production implementation and mock branch. Asked how preview will be implemented. Reused accepted creation/details/status exploration scope; styling/directions and detailed related fields remain future review decisions.
- Planning pull succeeded; current359 fetched unchanged with whole-colli question open. Duplicate Import search found no concept-review ticket. Draft at drafts/imports-concept-review-spec.md; proposed FRO/Backlog, Spike/Frontend/Pending_Review, Pre-releases0.0.x, relatedTo359 only, no assignee/milestone/priority/blockers. Full text/write approval still required.
- Proposed implementation follows embedded workflow: standalone HTML/CSS/JS fixture prototype, live portal design-source/component mapping, 2–3 directions then selected direction, EN/EL/states/notes/new-component markers, local review and isolated Pages publication. No production branch/API/database or real submissions; user shares preview, no messages sent by agent.
- Node24.13/npm11.6 available. CLOUDFLARE_API_TOKEN and account ID absent from current process environment; no claim that Pages publishing auth is verified, no Cloudflare mutation. Actual preview work not started; publish prerequisites must be checked then. Canvas unavailable fallback can use hand-written static page per workflow.
- Applied frontline-linear-issues and grilling scope guidance; no new domain term/ADR. Only planning draft/checkpoint written; no Linear change. Preserve unrelated files and synchronize task records.

### 2026-11-03 — FRO-359 Imports structural ticket created and verified

- User approved the complete displayed draft and metadata with ok. Mandatory planning pull and duplicate search succeeded. Created FRO-359: https://linear.app/front-line-ltd/issue/FRO-359/import-customs-declaration-entity-and-business-rules at2026-11-03T09:38:30.949Z.
- Independent full read matches drafts/imports-structural-spec.md exactly after Linear's issue-chip, link-angle and numbered-list whitespace normalization. Verified Backlog; all five labels Shipment/Business_Input/Pending_Review/Backend/Story; Pre-releases 0.0.x; related317/325/344/322/356; no blockers/blocks, attachments or documents. No Ready promotion or linked-description edits.
- Whole-colli/sub-colli applicability remains the explicit business confirmation before Ready. UI/preview/production branch and FRO-322 category work remain excluded/deferred. No production changes. Planning records synchronized; unrelated local files preserved.

### 2026-11-03 — Imports full structural review draft prepared; write approval pending

- User authorized moving on to draft. Applied frontline-linear-issues (project workflow takes precedence for gh and linked-source reads); source/consumer check consolidated, live main still5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Current labels/status/project and duplicate search verified. Optional agent-context endpoint previously unavailable; ordinary Linear reads work.
- Complete proposed body: drafts/imports-structural-spec.md. Metadata: Import Customs Declaration — entity & business rules; FRO/Backlog; Story, Backend, Shipment, Pending_Review, Business_Input; Pre-releases 0.0.x, no milestone/assignee/priority/parent. relatedTo317/325/344/322/356, no blockers/attachments. No import label creation. All are proposals pending full-text approval.
- Draft includes accepted lifecycle, manual Shipper, coverage/exclusion, editing/cancellation matrix, historical participation, shared files/staff access, atomicity/audit, Shipment guards, deferred scopes and AC/read-only checks. Whole-colli assumption explicitly provisional with department confirmation required before Ready. No draft approval is Ready authorization.
- Review trace/source evidence and metadata recorded in drafts/imports-structural-review.md. UI/preview/production branch skipped by scope; no new ADR earned beyond vocabulary already recorded. No Linear write. Full draft to be shown in chat; wait for explicit write approval. Planning files synchronized separately, preserving unrelated local changes.

### 2026-11-03 — Imports historical participation preserved; rejection deferred

- Q29 accepted: use recorded colli participation in the linked Shipment. Later movement, Order split or terminal physical disposition does not erase Import coverage, automatically change customs status or alone make historically participating goods ineligible. Preserve permanent identities and Shipment attribution.
- Q30: user explicitly defers actual customs rejection to later work. Inspection is not rejection. Do not add a Rejected status, rejection/resubmission flow, or portray a rejection as inspection/positive result/completion. Out-of-scope rejection handling is distinct from accepted inspection branches and pre-submission portal-record cancellation.
- Whole-colli coverage remains provisional pending department confirmation about clearing part of a colli's contents. Can expose this in a draft; do not claim Ready while dependent coverage assumptions remain unresolved.
- Remaining work: consolidate standalone structural draft, complete consumer/consistency check and current board metadata, load frontline-linear-issues before writing ticket text, show full draft for explicit Linear approval. UI/preview/production branch excluded. No Linear writes. Planning pull succeeded; synchronize this checkpoint only.

### 2026-11-03 — Imports parent eligibility, Shipment safeguards and rollout accepted

- Q26 accepted: any non-cancelled Shipment may receive an Import, including arrived Shipments for already-underway procedures; staff identify the relevant movement. No automatic geography-based customs classification and no dependency on future Import/Export category. User confirms FRO-322 is the appropriate owner for that Shipment category, but explicitly defers its work until current Shipment implementation completes. Do not edit FRO-322 or add category scope here.
- Q27 accepted: block Shipment cancellation while any non-cancelled Import exists; block removing a covered colli from Shipment until explicitly removed from its pre-submission Import (submitted coverage locked); Shipment additions never auto-expand saved Import coverage; repacking/later Order splits preserve covered colli identities. Integrate guard with FRO-344 planned membership operations, no linked-ticket rewrite authorized.
- Q28 accepted: new entity, fixtures and manual creation including already-underway procedures; exclude bulk migration/automatic reconstruction from historical spreadsheets, files or retired fields. No real-data deletion authorized.
- Remaining interview: whole-colli/sub-colli boundary needs department confirmation; actual rejection/withdrawal and later terminal goods need explicit handling/scope; clarify any event chronology or record-correction gaps before complete draft. Step 3 trace continues. No Linear, UI or production writes; synchronize planning checkpoint only.

### 2026-11-03 — Imports normal-case clarification and consumer trace checkpoint

- Q25 accepted: non-cancelled coverage exclusion is per Shipment + colli, not lifetime colli identity. User confirms normal full-clearance case should remain Shipment-first with all eligible collis preselected and no extra partial mode. User describes partial clearance as rare; do not treat the supplied frequency as measured production data.
- Clarified and user acknowledged direct Import links to Shipment + selected collis, derived connected Orders through Shipment attribution, unlike Export's selected Supplier Invoices/paperwork scope. No separately maintained Order coverage list.
- User asks next step. Consolidated read-only main trace and current linked contracts in drafts/imports-structural-review.md. Fresh FRO-322 remains Backlog/unresolved category, FRO-325 packing/participation planned, FRO-344 owns planned membership editing absent on main. Proposed cancellation/removal safeguards, eligibility and rollout still need user decisions.
- Step 1 ongoing, step 3 trace started; no UI/preview/production branch or Linear writes. Planning pull succeeded; synchronize these task records only, preserving unrelated local work.

### 2026-11-03 — Imports colli preselection and non-cancelled coverage exclusion accepted

- User explicitly approves preselecting all eligible collis on the selected Shipment, grouped by Order for selection convenience. Exclude collis already covered by another non-cancelled Import for later partial declarations. Do not broaden this to excluded warehousing-placement procedures or invent repeat-clearance exceptions.
- A saved pre-submission Import is non-cancelled too: proposed operational consequence is that its saved coverage excludes those collis from other Imports until removed before submission or the draft record is cancelled. Unsaved suggestions must not claim coverage. Explain and confirm this draft distinction next; exclusion's scope across different Shipments also needs clarification before final persistence constraint.
- Server-side atomic eligibility/concurrency validation, stable submitted coverage through Order splits, parent Shipment cancellation/content changes and minimum submission coverage require consumer tracing before final draft. Do not claim implementation or finalized constraints yet.
- Step 1 ongoing; no Linear/production changes. Planning pull succeeded; synchronize this checkpoint only, preserving unrelated local work.

### 2026-11-03 — Imports clearance-only scope and incomplete drafts accepted

- Q23 accepted: initial Import entity covers the clearance workflow already agreed; warehousing-placement declarations are outside this first ticket. Shipment remains the required parent; no independent manually maintained Import-to-Order relationship is introduced.
- Q24 accepted: Shipment required on creation; covered-colli selection may remain empty while Awaiting submission; at least one explicitly selected eligible colli from that Shipment required at submission. Whole-Order selection selects its participating collis, without a second saved Order coverage list. No physical split/unpacking/regime change is implied.
- User asks to clarify creation: Shipment first, potentially preselect all its Orders, editable for partial clearance. Explain intended flow as Shipment selection -> goods grouped by Order -> proposed preselection of all eligible collis -> deselection of Orders or individual collis for partial clearance; review at submission. Automatic preselection is a proposal, not yet accepted. Previously declared goods eligibility/overlap rules remain unresolved; never silently preselect all Shipment goods for a later partial declaration.
- Step 1 ongoing; UI layout remains deferred. Planning checkpoint only; no Linear/production writes. Preserve unrelated local work.

### 2026-11-03 — Imports editing matrix accepted

- Q22 accepted in full: Shipment fixed from creation; Shipper editable before submission and locked at submission; MRN/date entered at submission, editable until positive customs result (including inspection stages), locked afterward; covered collis editable before submission and locked at submission; files upload/download throughout, removal only before positive result; confirmed events/dates changed only through confirmation operations, not ordinary edits.
- Positive-result lock applies equally to payment-required and no-payment cases. Pre-submission-only cancellation from Q21 remains unchanged. Do not import Export's late invoice additions into physical colli coverage.
- Next unresolved coverage questions: whether a warehousing-placement declaration is itself an Import record before successive clearance declarations (affects legitimate repeated coverage), and minimum coverage required for pre-submission records. Whole-colli granularity is still provisional pending department confirmation on sub-colli clearance. No blanket overlap/uniqueness rule for covered goods has been approved.
- Step 1 continues; no Linear or production changes. Planning pull succeeded; synchronize this checkpoint only and preserve unrelated local work.

### 2026-11-03 — Imports access/cancellation accepted; editing comparison requested

- Q20 accepted: Frontline operators/managers view, create, edit permitted fields and confirm milestones; managers/system administrators cancel eligible records; external clients/suppliers/agents cannot access Imports or their files.
- Q21 accepted: portal-record cancellation only before submission, with reason/actor/time, preserved record/files/history, no hard deletion/reactivation. Post-submission cancellation and actual customs withdrawal require separate rules.
- Q22 not accepted: user asks to follow FRO-317. Fresh FRO-317 unchanged2026-10-27T10:45:42.148Z: Shipment/fiscal scope/Shipper fixed from creation; MRN/date editable Awaiting EAD then locked; invoices add/remove initially then add-only even Completed; files removal initially only; events/dates never ordinary edits. Import has pre-submission creation and physical declaration coverage, so no exact one-to-one copy.
- Next proposal for user review: Shipment fixed from creation; retain already-agreed Import Shipper editable pre-submission/locked at submission; MRN/date editable after submission until positive customs result then locked (including no-payment path), inspection stages remain before that lock; covered collis editable pre-submission then locked rather than copying Export late invoice additions; files removable before positive result only, upload/download afterward. All these newly proposed rules remain pending, especially coverage and lock-point mapping. No change to accepted pre-submission cancellation or receipt-based completion.
- Step 1 continues; no Linear/production edits. Planning checkpoint only; preserve unrelated local files.

### 2026-11-03 — Import Shipper required at submission and locked afterward

- Q18 accepted: Shipper may be blank at Awaiting submission; an existing Company selection is required to confirm submission, including initial recording of an already-submitted procedure.
- Q19 accepted: ordinary Shipper changes allowed before submission, locked afterward. Later changes require a separately specified audited correction operation; that operation is not silently included in this ticket.
- Fresh FRO-317 access/cancellation contract read, unchanged2026-10-27T10:45:42.148Z, as reference for next decisions. Import role access, record cancellation versus customs withdrawal, editing of other identity/coverage fields and parent Shipment protections remain unresolved. Do not copy Export's Awaiting EAD cancellation boundary to Import without agreement.
- Step 1 ongoing; no Linear writes, UI or production changes. Planning pull succeeded; task checkpoint only, unrelated files preserved.

### 2026-11-03 — Import Shipper manual Company selection accepted

- Q17: user confirms no derivation rule; manually assign Shipper from existing Companies. Record a Company reference, not a separate free-text company name; no automatic Supplier/Client/Export-rule derivation. Added Import Shipper glossary entry without changing Export Shipper semantics.
- Requiredness before submission, post-submission correction/locking, identity-field editing and cancellation rules remain undecided. Do not infer required VAT number, fiscal classification, new-company creation or Company master-data editing from this choice.
- Step 1 remains open. No Linear writes, UI or production changes. Planning pull succeeded; synchronize task records only and preserve unrelated local files.

### 2026-11-03 — Imports submission rules accepted; Shipper requested

- User accepted Q13: internal Import ID at creation; MRN/MRN date blank before submission and required to confirm submission; trimmed uppercase MRN, 18 alphanumeric characters, unique across Imports including cancelled records, no future MRN date. Submission advances to Awaiting customs result.
- Q14 accepted: allow recording already-underway procedures, including completed ones when required evidence is known, through explicit dated milestone confirmations rather than unexplained status selection/fabricated events. Q15 accepted: Import-owned uploads optional; an upload alone never confirms a lifecycle event.
- User requests Shipper in the same way as Export. Refreshed FRO-317 unchanged2026-10-27T10:45:42.148Z: Export Shipper is derived from Invoicing company for Greek-company Exports and Supplier for foreign-company Exports; Shipper VAT number is derived from that Company. Import does not yet have an agreed equivalent fiscal classification/derivation. Inclusion accepted; source company, selection/derivation, requiredness and VAT-reference inclusion remain unresolved. Do not silently copy Export fiscal rules or redefine the Export glossary term.
- User explicitly defers duty/tax amounts, payment reference, Άδεια reference and customs notes: keep these as future candidates, not fields in this initial ticket. Detailed related Shipment fields remain deferred to UI consultation.
- Step 1 continues; no Linear or production changes. Planning pull succeeded; synchronize this checkpoint only, preserving unrelated local files. No new glossary/ADR until Import Shipper meaning is resolved.

### 2026-11-03 — Imports payment branching and completion receipt accepted

- Q11 accepted: when recording a positive customs result, staff explicitly confirm Payment required or No payment required. Missing amount/receipt never implies no payment. Payment-required cases enter Awaiting payment, then Awaiting Άδεια Τελωνισθέντων Εμπορευμάτων after payment confirmation; no-payment cases enter Awaiting document directly, without a fabricated payment event.
- Q12 accepted: receipt of Άδεια Τελωνισθέντων Εμπορευμάτων is the completion point; confirm receipt date, authenticated actor and recording time. Issuance alone and payment alone do not complete the Import. This replaces the earlier generic/payment-receipt completion milestone. Attachment requirement remains undecided.
- Refreshed FRO-317 (updated2026-10-27T10:45:42.148Z): Export ID, MRN/date validation and event-confirmation pattern are reference contracts only; Import-specific adoption still needs decisions. Next interview frontier: submission identity/evidence, initial entry of already-progressed declarations, files, and additional declaration-owned data. Permissions/corrections/cancellation, eligibility/coverage and consumer trace still need resolution before draft.
- Planning pull succeeded; no Linear or production changes. Step 1 in progress; preserve unrelated local files. No new glossary/ADR required for these lifecycle decisions.

### 2026-11-03 — Imports completion document identified

- User consulted the department: Άδεια Τελωνισθέντων Εμπορευμάτων is issued when import customs processing completes; where duties/taxes are paid, issuance follows payment. Added this office-confirmed term to CONTEXT.md, distinguishing it from a payment receipt. This is user-supplied workflow evidence, not independently verified legal advice.
- User proposes replacing Awaiting receipt with Awaiting Άδεια Τελωνισθέντων Εμπορευμάτων and using that document as the completion milestone for payable and non-payable cases. Proposed next-round rule: positive result plus explicitly confirmed payment required -> Awaiting payment; confirmed payment -> Awaiting document; positive result plus explicitly confirmed no payment required -> Awaiting document; confirmed document receipt -> Completed. Missing payment information must not imply exemption/no payment. Exact no-payment confirmation and issued-versus-received completion evidence still need acceptance.
- Payment fact remains separate from document/completion evidence. Do not fabricate a payment event for a no-payment case or automatically mark completion on payment. Attachment/reference requirements are not decided.
- Q10 accepted: defer exact related-field selection, grouping and totals to employee consultation in the future UI ticket, checking and assigning missing read support then. Keep relationships and source ownership in this structural ticket.
- Step 1 ongoing, no Linear writes or production changes; synchronize planning files only and preserve unrelated local work.

### 2026-11-03 — Imports inspection FSM accepted; related-field selection deferred

- Q6 accepted: Awaiting customs result branches to Awaiting payment on positive result, Awaiting documentary inspection or Awaiting physical inspection on the corresponding referral. Inspections are separate, not concurrent. After inspection, return to Awaiting customs result when the result is pending, or advance to Awaiting payment when positive result is confirmed. Inspection completion alone is not positive-result evidence; referral is not automatically a rejection.
- Q7 accepted as proposed: provisional whole-colli declaration coverage with whole-Order selection convenience; department confirmation that sub-colli clearance is unnecessary remains outstanding. The user's ok does not supply that operational evidence.
- Q8 accepted: this ticket records declarations, coverage and customs events; it does not automatically split Orders or change their regime. Actual customs-transition behavior needs separate agreed ownership/rules.
- Q9 clarification: user asks whether the open zero-payment question means duty/tax exemption and which evidence signals completion. Explain it includes any supported case with no payment required; no exemption eligibility, completion evidence or bypass rule has been established. Await department evidence rather than inventing a payment/receipt event.
- Q10 scope correction: user wants employee consultation and exact related fields deferred to the later UI ticket. Do not treat the earlier suggested field table, aggregation, totals or multiplicity presentation as approved requirements. Preserve separate data ownership and the Shipment reference; future UI work must verify its read needs and assign any missing backend/API support. This is not a commitment that existing reads already provide every future field.
- Step 1 remains open; no Linear writes, UI, preview or production changes. Planning checkpoint only; preserve unrelated local work.

### 2026-11-03 — Imports first decisions and inspection branch proposal

- User accepted one Import per declaration, including pre-submission preparation with internal identity and no required pre-submission MRN; each belongs to one Shipment and a Shipment may have several. Successive partial clearances use another declaration. Added resolved Import definition to CONTEXT.md.
- Corrected exceptional regime to Τελωνειακή Αποταμίευση. User thinks coverage should use collis but is unsure whether Orders or collis are split; this is not confirmation that sub-colli clearance never occurs or authorization for automatic Order splits/regime transitions.
- User accepted separate payment and receipt milestones/five main stages. Zero-payment cases remain unanswered. User prefers exploring documentary/physical inspection as branches of the same FSM after awaiting result; inspection concurrency/sequencing, completion transitions and actual rejection remain unresolved. Do not label an inspection referral as a confirmed rejection automatically.
- Required read-only related context supplied by user: Shipment AWB/CMR/B/L, dimensions/weight of transport packing, Client and Vessel when present. Exact aggregation, multiplicity and Shipment-wide versus declaration-covered scope remain decisions. Fresh FRO-299/FRO-300 define planned per-colli measurement reads and individual/load-unit distinctions, not a current customs contract.
- Live main remains 5c51030680c9d45b3827a7e19b8320c19aa5ed9a with no Import/Export customs entities. FRO-356 regime branch 78b6d9ffd501ee643d966b4b1e9952676c69a671 is five commits ahead/unmerged; whole-Order regimes and shipment-preparation splits are not a partial-customs-clearance implementation. Existing AWAITING_IMPORT is warehouse intake, unrelated to customs status.
- Step 1 remains open; UI/preview/production branch excluded. No Linear writes or changes to FRO-317/322/356; no ADR yet. Planning checkpoint synchronized separately from unrelated local work.

### 2026-11-03 — Imports structural entity: interview started

- User requests a new Imports customs entity patterned on FRO-317, structural specification only: no UI, preview or production branch. Planning pull succeeded; authenticated gh and Linear access verified. Grilling/domain-modeling loaded; relevant workflow lessons read. Preserve unrelated FRO-326/352/353 local changes.
- User describes ordinary one-procedure-per-Shipment use, with a reported rare partial-clearance case leaving remainder under a storage regime; proposes allowing multiple Imports per Shipment. Exact regime (Αποθήκευση versus Αποταμίευση), declaration/MRN granularity and goods coverage remain unresolved. Do not infer them from Export invoice grouping.
- Proposed operational stages: not submitted; submitted/awaiting result; positive result/awaiting payment; paid/awaiting receipt; receipt received/completed. Physical or documentary inspection can intervene after submission. Payment versus receipt separation, zero-payment cases, evidence, timestamps and exception handling are not settled. User wants related Shipment/Order information retrieved read-only rather than copied; exact retrieval scope remains open.
- Fresh FRO-317 confirms one Shipment to several Exports, mandatory MRN at creation, event-derived Awaiting EAD/Awaiting IE599/Completed and separately owned invoice membership. No Export change authorized. FRO-356 separates whole-Order regime corrections from formal customs transitions; FRO-319 storage admission/register is a separate contract. FRO-322 remains Backlog with unresolved movement category/Import rules; do not silently absorb it. Search for import found no dedicated Import customs entity ticket. Optional Linear get_agent_context endpoint unavailable; normal reads work.
- Workflow: step 1 in progress; 2/2b/4e skipped by scope; spec trace/draft/write approval pending. No Linear writes, new resolved glossary definition or ADR yet. Recommendations require user acceptance.

### 2026-10-27 — FRO-354 previous UI linked in the description

- User asked whether the older UI was linked as a historical reference; it was only an attachment plus a plain sentence. User approved the FRO-353-style link. Baseline 10:43:46.316Z unchanged. Saved 10:45:24Z: Context for agents sentence replaced by "**Previous UI (historical reference only):** [Customs Storage Entry details — earlier preview (ChatGPT-hosted)](…fro-353-entry-note-details…?highlights=off)", needs sign-in, description is the contract. Labels re-passed (Ready).
- Save auto-added related FRO-321/347/356/317/350; removed (10:45:42Z). Final: Todo, entry note/Ready/Frontend/Story, relations as before, 2 attachments (old one still titled "Entry Note details"). The preceding sentence also ends "this description is the contract" (minor repetition, left as is).

### 2026-10-27 — FRO-354 approved for development (Ready)

- User approved moving FRO-354. Baseline 10:42:54.726Z unchanged. Saved 10:43:46Z: Pending_Review removed, Ready added, status Todo; description, attachments, milestone and relations unchanged (re-read: entry note/Frontend/Story/Ready, blocks FRO-355, blockedBy FRO-319, related 353/352/358/348/326).
- Workflow status: steps 0–4, 4e and 5 done; step 2b only local (previews/fro354, launch fro354-preview, port 8364; no Cloudflare token); step 6 waits for deployment.
- Optional follow-up: same MRN-date wrap fix on mock/fro-353 (needs approval).

### 2026-10-27 — FRO-354 branch link saved

- User approved drafts/fro354-branch-link-edit.md. Baseline unchanged (10:18:15.474Z). Saved 10:42:41Z: Context for agents branch line now links mock/fro-354-customs-storage-entry-details (base 5c51030, head 7f65b41, 15 files) with activation needs; link attachment "Prepared frontend branch — mock/fro-354-customs-storage-entry-details" added; labels re-passed.
- Save auto-added related FRO-356/347/321/350/317; removed (10:42:54Z). Final: Todo, entry note/Pending_Review/Frontend/Story, 0.0.11, blocks FRO-355, blockedBy FRO-319, related 353/352/358/348/326, 2 attachments (old one still titled "Entry Note details"). Linear turned the new FRO-353/FRO-319 mentions in that paragraph into plain links (cosmetic).
- Still open: FRO-354 Ready approval (Pending_Review); optional MRN-date wrap fix on mock/fro-353.

### 2026-10-27 — FRO-354 branch link edit drafted

- User asked to draft the FRO-354 edit linking the pushed branch. Baseline 10:18:15.474Z unchanged. Draft drafts/fro354-branch-link-edit.md: Context for agents branch line → link, base 5c51030, head 7f65b41, 15 files, activation needs; link attachment "Prepared frontend branch — mock/fro-354-customs-storage-entry-details"; labels re-passed; remove auto-added relations after save. Awaiting approval; no Linear write.

### 2026-10-27 — FRO-354 mock branch pushed and verified

- User approved creating mock/fro-354-customs-storage-entry-details from 5c51030 as one commit with the explicit refspec, and accepted the branch-protection gap for this branch. Re-verified first: main 5c51030, branch absent, diff hash unchanged (e7fe3050…).
- Commit 7f65b41c60453672290757e17e5e44ce53c4819c "feat(FRO-354): prepare Customs Storage Entry details UI" (15 added files under frontline-forwarding-client/src/features/customs-storage/details/, +3,469), identity giwrgoskakepakis, no hooks. Committed diff byte-identical to the audited patch.
- Pushed with git push github mock/fro-354-customs-storage-entry-details:mock/fro-354-customs-storage-entry-details. Remote head 7f65b41 = local; 1 ahead / 0 behind main; 15 files, all added, none outside the folder; remote diff hash equals the audited one; no PR. No merge or deployment. Branch owned by this session for FRO-354. URL https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-354-customs-storage-entry-details
- Next (needs approval): add the branch link to FRO-354 in Linear (Context for agents "(when published)" → head 7f65b41 + link attachment); possibly the same MRN-date wrap fix on mock/fro-353.

### 2026-10-27 — FRO-354 frontend prepared and verified; push gate pending

- User confirmed both model checkpoints and agreed drafts/fro354-frontend-plan.md. C:/ffx/fro354 detached at main 5c51030 (re-fetched, unchanged); node_modules junction to fro353.
- 15 new files only under frontline-forwarding-client/src/features/customs-storage/details/ (+3,469): types, rules (+test), labels (+test), layout, Order card with Change Order, dialog, entry card read/edit, invoices, Export, discard dialog, ui-parts (local FRO-353 copies + EditButton/EditActions), component tests, README. No shared file changed.
- Rule tests Red 14/14 on stubs, Green 14/14; focused 41/41; full 243/243; build OK (routeTree.gen.ts restored); tsc only 2 baseline TS2352; prettier, diff check, secret scan clean.
- Browser harness (deleted; copy in scratchpad fro354-harness, port 8365 freed): all scenarios incl. Change Order, rejected/stale/failed, discard, page states, EN/EL, 400px, keys, console clean. Fix: MRN date Clear button wraps at 400px in Greek (FRO-353 branch has the same issue, unchanged).
- Diff drafts/fro354-frontend-preparation.patch (SHA-256 e7fe3050…82ebcf); handoff drafts/fro354-frontend-handoff.md. Rulesets 403, main protection 404 (same gap). Remote branch absent. Awaiting approval to create mock/fro-354-customs-storage-entry-details, commit and push.

### 2026-10-27 — FRO-354 step 4e started; plan at the model checkpoint

- User asked to prepare mock/fro-354-customs-storage-entry-details from main, client UI folder only, diff and checks before any push. Worktree C:/ffx/fro354 (of the fro353 clone, remote github) detached at main 5c51030. npm ci failed (package-lock out of sync with package.json; repo uses pnpm); node_modules is a junction to C:/ffx/fro353 (same package files as main), lock untouched. Node 24.13 (22.13 not installed).
- Playbook FRO-354: HEAD 5c51030, committed, SHA-256 b1a66b22…7dc. First load failed (Windows charmap on "→"); PYTHONIOENCODING=utf-8 fixed it.
- Plan drafts/fro354-frontend-plan.md (3 slices under src/features/customs-storage/details/, local copies of FRO-353 parts). Waiting for the playbook's planning/implementation model checkpoints and plan agreement.

### 2026-10-27 — FRO-354 rewrite saved

- User approved the draft with metadata unchanged and removal of auto-added related links. Baseline 07:53:37.719Z unchanged. Saved drafts/fro354-reviewed-spec.md 10:18:04Z, labels re-passed (entry note/Pending_Review/Frontend/Story).
- Save auto-added related FRO-350/321/317/347; removed (10:18:15Z). Final: Todo, 0.0.11, blocks FRO-355, blockedBy FRO-319, related 353/352/358/348/326, 1 attachment (title still "Entry Note details"). Linear rendered many plain links as issue chips, incl. a self-mention of FRO-354 in the entry-points table (cosmetic).
- Next (needs approval at the push gate): step 4e mock/fro-354-customs-storage-entry-details from main 5c51030, client-only under src/features/customs-storage/details/.

### 2026-10-27 — FRO-354 workflow review started, round 1 pending

- User: FRO-354 (Customs Storage Entry — Details page UI) was not created through the workflow; review gaps, rebuild the UI from the production design system, mock branch client-UI-folder only (as other mock branches). Pull up to date.
- Baseline: Todo, entry note/Pending_Review/Frontend/Story, 0.0.11, updatedAt 2026-10-27T07:53:37.719Z, no comments, blocks FRO-355, blockedBy FRO-319, related 353/352/358/348/326, 1 attachment (ChatGPT preview, historical). Main 5c51030. Wrangler unauthenticated → local preview only.
- Findings and Q1–Q12: drafts/fro354-review.md. No Linear write.

### 2026-10-27 — FRO-354 round 1 accepted; preview verified; full draft at the gate

- User accepted Q1–Q12 as recommended: FRO-353 search fields/reasons; extra reasons Current Order of this entry / Covered by this entry; one editor at a time; Change Order keeps warehouse values with dialog warning + post-save review notice when warehouse differs; simple confirm dialog text; covered-child banner + Back to child; title by number, subtitle Order · date, no active badge; Created by caption (needs FRO-319 read to return creator — listed as dependency, no FRO-319 edit); Print place reserved, FRO-358 adds it (view authority); all ten entry-owned fields editable with FRO-353 rules; FRO-352 failed/stale/leave behavior; branch from main, self-contained src/features/customs-storage/details/ with copies of FRO-353 parts.
- Preview previews/fro354 (FRO-353 base.css, launch fro354-preview port 8364, scratchpad build). Verified: one-editor hint, tariff validation + focus, draft kept across EL/tabs, save → read-only + focus Edit, Change Order reasons and warehouse warning, refresh + notice + Unknown weight, stale banner + Escape, Back to Order discard dialog, all page states, EN/EL toast, 375px no overflow. Not deployed (no Cloudflare token).
- Draft drafts/fro354-reviewed-spec.md (full rewrite). Metadata unchanged; remove auto-added related links after save. Awaiting approval; no Linear write.

### 2026-10-27 — FRO-353 previous UI linked in the description

- User asked for the older FRO-353 UI as an explicit link, not only the attachment. Baseline 09:42:44.258Z unchanged. Saved 09:49:25Z: Context for agents sentence replaced by "**Previous UI (historical reference only):** [Create Customs Storage Entry — earlier preview (ChatGPT-hosted)](…fro-353-entry-note-create…?scenario=blank&highlights=off)", needs sign-in, description is the contract. Labels re-passed (Ready).
- Save auto-added related FRO-348/356/317/321; removed (09:49:35Z). Final: Todo, Ready, relations as before, 3 attachments (old attachment title still "Entry Note creation — no Order selected"; rename needs delete + re-add or a manual edit).

### 2026-10-27 — FRO-353 approved for development (Ready)

- User asked to move FRO-353. Baseline 09:37:35.257Z unchanged. Saved 09:42:44Z: Pending_Review removed, Ready added, status Todo; description, attachments, milestone unchanged. Older UI already referenced (ChatGPT preview attachment + "historical reference only" sentence in Context for agents), so no edit.
- Workflow status: steps 0–4, 4e and 5 done; step 2b only local (previews/fro353, launch config fro353-preview, port 8353; no Cloudflare token); step 6 waits for deployment.

### 2026-10-27 — FRO-353 branch link saved

- User approved drafts/fro353-branch-link-edit.md. Baseline unchanged (08:56:57.044Z). Saved 09:37:24Z: Context for agents branch line now links mock/fro-353-customs-storage-entry-create (base 5c51030, head 4c5a3eb, 14 files) with activation needs; link attachment "Prepared frontend branch — mock/fro-353-customs-storage-entry-create" added; labels re-passed.
- Save auto-added related FRO-317/356/321/348; removed (09:37:35Z). Final: Todo, entry note/Pending_Review/Frontend/Story, 0.0.11, blocks FRO-355, blockedBy FRO-319, related 350/352/248/358/326/354, 3 attachments. Linear rendered the first FRO-319 mention in that paragraph as a plain link (cosmetic).
- Still open: FRO-354 alignment; FRO-353 Ready approval; planning-repo commit/push blocked.

### 2026-10-27 — FRO-353 mock branch pushed and verified

- User approved creating mock/fro-353-customs-storage-entry-create from 5c51030 as one commit with the explicit refspec, and accepted the branch-protection gap for this branch. Re-verified first: main 5c51030, branch absent, diff hash unchanged (9e7e596d…).
- Commit 4c5a3eb1cf99147736b9c54e56a2da29fa58d480 "feat(FRO-353): prepare Customs Storage Entry create UI" (14 added files under frontline-forwarding-client/src/features/customs-storage/create/, +3,102), identity giwrgoskakepakis, no hooks. Committed diff byte-identical to the audited patch.
- Pushed with git push github mock/fro-353-customs-storage-entry-create:mock/fro-353-customs-storage-entry-create (gh credential helper). Remote head 4c5a3eb = local; 1 ahead / 0 behind main; 14 files, all added, none outside the folder; remote diff hash equals the audited one. No PR, merge or deployment. URL https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-353-customs-storage-entry-create
- Next (needs approval): add the branch link to FRO-353 in Linear (Context for agents "(when published)" → head 4c5a3eb + link attachment); FRO-354 alignment. Planning-repo commit/push still blocked.

### 2026-10-27 — FRO-353 frontend prepared and verified; push gate pending

- User confirmed both model checkpoints and agreed drafts/fro353-frontend-plan.md (three slices uncommitted, full diff at the end). Playbook FRO-353: HEAD 5c51030, policy committed, SHA-256 b1a66b22…7dc.
- C:/ffx/fro353 detached at main 5c51030 (re-fetched, unchanged). 14 new files only under frontline-forwarding-client/src/features/customs-storage/create/ (rules, types, labels, layout, Order card, entry card, invoices, Export, outcomes, ui-parts with local FRO-350 copies, README, 3 test files). Uses PurchaseOrderStatusPill; no shared file changed.
- Rule tests Red 20/22 on stubs, Green 22/22; focused 44/44; full 246/246; build OK (routeTree.gen.ts restored); tsc only 2 baseline TS2352; prettier, diff check, secret scan clean. Component tests written alongside the components.
- Browser harness (deleted; copy in scratchpad fro353-harness): all scenarios, EN/EL, 400px, light/dark, keyboard, no console errors on clean load. Fix: invoice number nowrap. Artefacts: rAF paused in unfocused pane; createRoot error from harness HMR.
- Diff drafts/fro353-frontend-preparation.patch (3,186 lines, SHA-256 9e7e596d…); handoff drafts/fro353-frontend-handoff.md. Rulesets 403, main protection 404 (same enforcement gap as FRO-350/352). Remote branch absent. Awaiting approval to create mock/fro-353-customs-storage-entry-create, commit and push.

### 2026-10-27 — FRO-353 rewrite and FRO-319 patch saved

- User approved both drafts, Pending_Review on FRO-353 and removal of auto-added related links. Baselines unchanged (FRO-353 08:31:02.173Z, FRO-319 08:31:00.211Z).
- FRO-353 saved 08:56:32Z = drafts/fro353-reviewed-spec.md (sha256 7e7e7d39…), labels entry note/Pending_Review/Frontend/Story. Save auto-added related FRO-321/356/348/317; removed (08:56:57Z). Final: Todo, 0.0.11, blocks FRO-355, blockedBy FRO-319, related 350/352/248/358/326/354, 2 attachments unchanged (titles still "Entry Note"). Linear turned some plain mentions (FRO-348, FRO-352, FRO-355, FRO-358) into chips — cosmetic.
- FRO-319 patch (drafts/fro319-search-validation-patch.md) saved 08:56:44Z: date-time ≤ now, MRN date ≤ today, tariff 1–10 digits, text limits, per-invoice currency, "No entry total" wording, Order search for entry creation. Relations unchanged; Todo, Ready.
- Next (each needs approval): step 4e mock/fro-353-customs-storage-entry-create (client-only under src/features/customs-storage/create/, unmounted, from main); FRO-354 alignment (admitting warehouse, per-row currency, n-of-m Export note, search fields/reasons). Planning-repo commit/push still blocked by the classifier.

### 2026-10-27 — FRO-353 preview verified; rewrite and FRO-319 patch drafted

- Preview previews/fro353 (base.css from fro352 = production tokens at 5c51030; build.py; launch.json fro353-preview, port 8353). One direction (structure already agreed). Verified: search reasons/order + Open, keyboard, preselect ineligible/covered/not-found, denied, lookup error/Retry, prefill + permit hint, Unknown/Missing markers, €803.62/0.00/192.87 footer, mixed-currency message, 2 of 3 Export note, validation + focus, draft retention across tabs/EL, discard modal/Escape, created/duplicate/fail/lost-response outcomes, EN/EL at 400px no overflow (table scrolls). Not deployed (no Cloudflare token).
- Drafts: drafts/fro353-reviewed-spec.md (full rewrite; component map; branch mock/fro-353-customs-storage-entry-create under src/features/customs-storage/create/) and drafts/fro319-search-validation-patch.md (date/MRN date limits, tariff 1–10 digits, text limits, per-invoice currency, Order search read). Proposed metadata: add Pending_Review; remove auto-added related links after save. Awaiting approval; no Linear write.

### 2026-10-27 — FRO-353 review: round 1 accepted

- User: FRO-353 (Customs Storage Entry — Creation page UI) was not created through the workflow; review gaps, rebuild the UI from the production design system, mock branch client-UI-folder only. Pull up to date. Baseline: Todo, entry note/Frontend/Story (no workflow label), 0.0.11, updatedAt 2026-10-27T08:31:02.173Z, no comments, blocks FRO-355, blockedBy FRO-319, related 350/352/248/358/326/354, 2 attachments (deferred-list upload, ChatGPT preview). Main 5c51030. Findings: drafts/fro353-review.md.
- Grounded: purchaseOrders search matches Stock ID, message number, owner/supplier reference, vessel name, colli tracking code only (no Client/Supplier/invoice); warehouse address = street/street_number/postal_code/city (nullable); delivery-notes-card pairs DatePicker + Input type=time.
- Accepted Q1–Q12 as recommended: existing search fields + per-match eligibility via new FRO-319 search read (FRO-319 patch); FRO-355 reason table/order incl. admitted under another Order and covered (entry + Open); ineligible/covered preselection shown unselected with reason, not-found/denied → message + empty; Cancel confirm only with input, back to Order / previous page / Orders list, leave-page warning; FRO-353 owns only the route, nav/list button FRO-358 (0.0.11 reachable only via FRO-355); no create authority → access denied; Admitting warehouse · admission date-time shown; permit hint when no single licence, address "Street Number, Postal code City"; entry date-time ≤ now, MRN date ≤ today, tariff ≤10 digits, text 500 / goods 2,000 (FRO-319 patch); per-row amounts in invoice currency incl. Statistical VAT, totals hidden unless all EUR; no conflicting Export, partial "{n} of {m}"; concurrent duplicate → existing entry + Open, lost response → check current entry before retry.
- Commit/push of drafts/fro353-review.md blocked by the auto-mode classifier.

### 2026-10-27 — FRO-319 split wording and FRO-353 post-create landing saved

- User approved drafts/fro355-followup-patches.md. Baselines unchanged. FRO-319 Split coverage first row now "(today only Shipment-preparation partial selection; manual splits happen before stock)" + "Any future post-admission split follows the same rule", 08:31:00Z. FRO-353 new Actions and states bullet: success opens the new entry's FRO-354 page; from Order Details it carries return context and shows Back to Order {Stock ID} / Επιστροφή στην παραγγελία {Stock ID}, 08:31:02Z.
- Re-read: no auto-added relations on either; labels/status unchanged (FRO-319 Ready, FRO-353 entry note/Frontend/Story).
- User chose to leave mock/fro-326-order-details-ui as it is for now (OrderDocumentAction still says Entry Note, no entry number/reasons). FRO-355 0.0.11 vs FRO-326 0.0.5 milestone gap still undecided.

### 2026-10-27 — FRO-355 rewrite and FRO-319 eligibility patch saved

- User approved both drafts ("ok"). Baselines unchanged (FRO-355 07:53:59.772Z, FRO-319 08:07:00.210Z). Saved FRO-355 full description = drafts/fro355-reviewed-spec.md (sha256 f7ef4b54…) with labels re-passed, 08:20:17Z; FRO-319 two-insert patch = drafts/fro319-eligibility-read-patch.md, 08:20:19Z.
- FRO-355 save auto-added related FRO-356/FRO-358; removed (08:20:31Z). Final: Todo, entry note/Order/Pending_Review/Frontend/Story, 0.0.11, blocks FRO-326, blockedBy FRO-319/353/354, related FRO-349, 1 attachment (title still "Entry Note action preview"). FRO-319: Todo, Ready labels, relations unchanged.
- Follow-ups (not started, each needs approval): rename labels and add entry number/reason table in mock/fro-326-order-details-ui OrderDocumentAction; FRO-353 could state its own post-create landing; FRO-319 Split coverage row still says "manual or during Shipment preparation" although repo allows manual splits only before stock; milestone gap FRO-355 0.0.11 → FRO-326 0.0.5 for release planning.

### 2026-10-27 — FRO-355 round 1 answered; full draft shown

- User accepted Q2–Q9 as recommended. Q1 rejected: FRO-326 is UI-only and, by policy, blocked by every structural Order ticket, so FRO-355 keeps blocking FRO-326; no FRO-326 edit. Milestone gap (0.0.5 vs 0.0.11) flagged in Context only.
- Draft drafts/fro355-reviewed-spec.md: card-state precedence table (no view authority → no card; loading; error+Retry; Open wins incl. cancelled covered child; no create authority → no card; Create; disabled with reasons cancelled → not Customs Storage → not admitted → admitted under another Order), EN/EL strings, entry number + Owning Order link, post-create landing on FRO-354 with Back to Order, server eligibility read, Decisions, Context (main 5c51030, mock/fro-326 OrderDocumentAction), read-only verification. Metadata unchanged.
- Q4 needs FRO-319 patch drafts/fro319-eligibility-read-patch.md (post-admission child never eligible on its own; eligibility read with ordered reason codes). New EL strings beyond Q8: Αριθμός δελτίου, Επιστροφή στην παραγγελία {Stock ID}.
- Awaiting exact-text approval for both writes.

### 2026-10-27 — FRO-355 workflow review started, round 1 pending

- User: FRO-355 (Order Details — Create or open Customs Storage Entry) was not created through the workflow; review for gaps. No new UI (FRO-326 hosts the card; FRO-353/354 own the target pages); no production branch. Canvas/preview/step 4e skipped. Pull: up to date.
- Baseline: Todo, labels entry note/Order/Pending_Review/Frontend/Story, 0.0.11, Pre-releases 0.0.x, updatedAt 2026-10-27T07:53:59.772Z, no comments, blocks FRO-326, blockedBy FRO-319/353/354, related FRO-349, 1 attachment (ChatGPT-hosted "Entry Note action preview", historical). Main 5c51030; FRO-356 still on unmerged chriskazakos/fro-356-order-customs-regime (5 ahead).
- Grounded: mock/fro-326-order-details-ui already has OrderDocumentAction (kind 'entry', states loading/error/denied/create/open/disabled, denied hides the card, "Owning Order" caption) with "Entry Note" labels. Shipment-preparation partial split creates an IN_STOCK child with preserved stock time (purchase-order-colli-journey.md); manual splits only in PENDING/EXPECTED_READINESS/READY. PURCHASE_ORDER_VIEW gives partners participant-scoped Order reads.
- Gaps raised (Q1–Q9): FRO-355 0.0.11 blocks FRO-326 0.0.5 (dependency direction/milestone); post-admission split child when the ancestor has no entry yet; state precedence (Open beats ineligible, e.g. cancelled covered child); eligibility-with-reason read not listed in FRO-319 retrieval; permission presentation incl. partners; post-create destination (FRO-353 silent too); owning-Order/entry number on the card; EN/EL reason strings; house-style rewrite (no Decisions/Context, stale 3820e89, preview narration). Side observation: FRO-319 says manual splits can follow admission; repo allows manual splits only before stock.
- No Linear write. Awaiting round 1 answers.

### 2026-10-27 — FRO-319 approved for development (Ready)

- User approved FRO-319 for the developer. Saved 08:07:00Z: status Todo, labels entry note/Backend/Story/Ready (Pending_Review removed via removeLabels/addLabels); description, milestone 0.0.11 and relations unchanged.
- Starting entry number: user will specify it in a later version as the project progresses; the ticket's "supplied by the business before release" wording already covers this, so no text change.
- Build gate: FRO-356 (blocker) is still Todo/Pending_Review and its code is on unmerged branch chriskazakos/fro-356-order-customs-regime.

### 2026-10-27 — Customs Storage Entry rename batch 2 saved (FRO-321/317/326/347/348/352)

- User approved drafts/customs-storage-rename-batch2.md, text only, no branch changes. Baselines matched. Saved replace_all patches 08:00:24–08:00:36Z: 61 visible mentions renamed (FRO-321 15, FRO-317 7, FRO-326 9, FRO-347 10, FRO-348 13, FRO-352 7), incl. "an/An Entry Note" → "a/A Customs Storage Entry". FRO-326 re-check: 0 "Entry Note", 9 "Customs Storage Entry". Titles, labels, status, attachments unchanged.
- Linear auto-added related links on save: FRO-317 +347/+356/+303, FRO-347 +317, FRO-348 +303, FRO-352 +319. Removed with removeRelatedTo (user-approved); re-read confirms all six match the recorded baselines. FRO-321 and FRO-326 had no additions.
- Still saying "Entry Note": workspace label "entry note"; mock branches mock/fro-326-order-details-ui, mock/fro-348-supplier-invoice-details, mock/fro-352-export-details (UI strings, incl. FRO-352 picker reason and FRO-326 Available actions card); attachment titles on FRO-353/354/355. Branch updates need separate approval.

### 2026-10-27 — Customs Storage Entry rename + alignment saved (FRO-319/353/354/355)

- User approved drafts/customs-storage-rename-alignment.md. Saved as atomic patches 07:52–07:54Z: titles now "Customs Storage Entry — entity & business rules / — Creation page UI / — Details page UI" and "Order Details — Create or open Customs Storage Entry from Available actions"; Entry Note(s) → Customs Storage Entr(y/ies) throughout; FRO-319 and FRO-353 also note number/date → entry number/date, note-owned → entry-owned. Greek labels unchanged.
- Alignment: FRO-353 eligible-only Order search with reasons, required entry date default now, warehouse-prefilled permit/operator (re-prefill only untouched fields on draft Order change), Unknown weight / Missing depositor-Supplier markers, Currency column + EUR rule, Create disabled without eligible Order, scope → FRO-358; FRO-354 same display rules, eligible-only Change Order, Print (Εκτύπωση) → FRO-358, no cancel/reissue/delete; FRO-355 Create only for eligible Orders + Ineligible Order row (EN reasons; EL per page translations), AC3 updated. Old "Text revision only" paragraphs replaced by Preview status (ChatGPT previews historical).
- Small follow-up patches in the same approval: FRO-319 "Note date & time" / "Note total" leftovers → Entry; FRO-355 "an Customs" → "a Customs". Generic lower-case "note" wording (and FRO-354 "note number") left as shorthand.
- Verified: labels/status unchanged, relations unchanged (FRO-358 links came from its creation). Attachment titles still say "Entry Note" (not renamed).
- Not renamed (follow-up): FRO-321, FRO-317, FRO-326, FRO-347, FRO-348, FRO-352 and the mock/fro-326 + mock/fro-348 branch labels.

### 2026-10-27 — FRO-358 created; entity renamed Customs Storage Entry

- User decided (option A) to rename the portal entity: section **Customs Storage / Τελωνειακή Αποθήκευση**, record **Customs Storage Entry**, Greek label stays **Δελτίο Εισόδου**. "Customs Warehousing" rejected because the FRO-356 code uses CUSTOMS_WAREHOUSING for Αποταμίευση (CUSTOMS_STORAGE = Αποθήκευση). CONTEXT.md updated.
- Created FRO-358 "Customs Storage — entries list, active register output & recipient copies (UI)" from drafts/customs-storage-list-register-spec.md, 2026-10-27T07:46:35Z: Backlog, Frontend/Story/Pending_Review/entry note, Pre-releases 0.0.x, no milestone, blockedBy FRO-319, related FRO-353/354/248 (verified; no extra relations). Decisions: five recipient-copy choices on FRO-248 templates; all invoices printed; prints from current data, nothing stored; register as landscape PDF + .xlsx (18 columns, "Ελλείψεις" sheet); list with Active cases only filter, no status badge; staff-only; screens EN/EL, prints Greek; design round (canvas + Pages preview) required before implementation. Repo: OpenHTML PDF service exists (delivery notes), no Excel library.
- Next (needs approval): rename sweep "Entry Note" → "Customs Storage Entry" in FRO-319/353/354/355 combined with FRO-319's alignment changes for FRO-353/354/355 (eligible-Order search, warehouse-prefilled permit/operator, unknown weight/missing depositor/currency display, Print button on FRO-354 for FRO-358).

### 2026-10-27 — FRO-319 reviewed, rewritten and saved

- User: FRO-319 (Entry Note entity) was not created through the workflow; review for gaps, no UI (FRO-353/354 own presentation), no production branch. Canvas/preview/4e skipped. Baseline: Todo, Backend/Story, 0.0.11, updatedAt 2026-10-26T15:01:43.918Z, no comments. Main 5c51030; FRO-356 lives on unmerged branch chriskazakos/fro-356-order-customs-regime (defines storage admission, CUSTOMS_STORAGE, warehouse licences, expects FRO-319 regime-correction check).
- Decisions (Q1–Q21 accepted): note tied to the Order's first storage admission at an Αποθήκευση warehouse; admitted collis = non-terminal collis then; creation requires non-cancelled Αποθήκευση Order already admitted, not owned/covered; regime change away from Αποθήκευση rejected while owned/covered; gross weight = warehouse-confirmed admission weights, unknown if any missing; totals/statistical VAT only when all matching invoices are EUR; cancelled invoices excluded; depositor = Invoicing company + ΑΦΜ (confirmed), missing → flagged blank; number on successful creation, start value before release; note date-time required, default Athens now, = register date; permit/operator/address prefilled from admitting warehouse then note-owned; later transfers create no new note; pre-admission splits independent; coverage derived from admission + split records (ADR 0004); active until all active matching invoices are in one Export with MRN (user notes they always end up in the same Export — FRO-317 enforces it); Change Order revalidates, keeps note-owned fields; staff-only, new view/create-edit authorities; no delete; owning Order cannot be cancelled. Exit/Transfer dropped entirely (user found none in the current database; no ticket).
- Self-filled rules shown at the gate and approved with "ok": permit prefill only when exactly one Αποθήκευση licence; missing Supplier flagged like depositor; only owning Order cancellation blocked; register rows carry flags.
- Saved drafts/fro319-reviewed-spec.md (sha256 1885a478…) 2026-10-27T07:29:42.875Z: Backlog, labels entry note/Pending_Review/Backend/Story, 0.0.11, relations unchanged (no auto-additions). Linear rendered issue chips as plain Markdown links (cosmetic).
- CONTEXT.md: Entry Note, Storage admission, Admission coverage, Statistical VAT. ADR 0004 written.
- Next (each needs its own approval): new ticket "Customs Warehousing — notes list, active register output & recipient copies (UI)" (Backlog, Pending_Review, no milestone); alignment edits to FRO-353/354/355 per FRO-319's "Required changes" table.

### 2026-10-26 — FRO-352 previous UI marked as historical reference

- User asked to add the older UI as a historical reference; approved the draft. Pull: up to date. Baseline 14:58:49.364Z unchanged. Context for agents sentence replaced with "**Previous UI (historical reference only):** [Export details preview (ChatGPT-hosted)](…)" (sign-in required, predates the spec; this description wins). Saved 15:01:30Z, labels re-passed.
- Re-adding the same URL with title "Previous FRO-352 UI (historical reference)" did not rename or duplicate the attachment: Linear kept "Export details — read-only UI preview". Renaming would need delete + re-add (pending user choice). Auto-added related FRO-319 removed; final relations = original set, updatedAt 15:01:43.906Z.

### 2026-10-26 — FRO-352 branch link added in Linear

- User approved the drafted edit (drafts/fro352-branch-link-edit.md), confirmed again after the exact text was shown in chat. Baseline unchanged (14:17:47.621Z). Patched Context for agents: FRO-350 branch row no longer "(when published)"; new "Prepared frontend branch" paragraph (base 5c51030, head dc8d3a9, activation needs); Gotchas "FRO-347/FRO-350". Added link attachment "Prepared frontend branch — mock/fro-352-export-details"; old ChatGPT preview attachment kept. Labels re-passed.
- Save auto-added related FRO-319; removed only that. Final re-read: Todo, labels export/Pending_Review/Frontend/Story, blockedBy FRO-317, related 350/348/354/353/347/321, 2 attachments, updatedAt 2026-10-26T14:58:49.364Z. Linear rendered some untouched mentions as plain links (FRO-317 in the attachments row, FRO-347 and FRO-319 in Gotchas) — cosmetic.

### 2026-10-26 — FRO-352 mock branch pushed and verified

- User approved creating mock/fro-352-export-details from 5c51030 with one commit per slice and pushing with the explicit refspec, and accepted the branch-protection gap for this branch.
- Commits rebuilt from the approved slice snapshots: 3fac97b shell/rules/labels, 82dda0c Overview, 46ac13a invoices, dc8d3a9 VAT/documents/cancel. Committed diff byte-identical to the reviewed patch (SHA-256 2be5a20d…); 72/72 focused tests at the head; no hooks; identity giwrgoskakepakis.
- Pushed with git push github mock/fro-352-export-details:mock/fro-352-export-details. Remote head dc8d3a9 = local; 4 ahead / 0 behind main 5c51030; 24 files, none outside exports/details/; remote diff byte-identical to the reviewed patch; no PR. Handoff: drafts/fro352-frontend-handoff.md. URL https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-352-export-details
- Next (needs approval): add a branch link/Context line to FRO-352 in Linear. Planning-repo pushes still blocked; the user pushes them.

### 2026-10-26 — FRO-352 all four slices verified; branch approval pending

- User approved slice 3 (keep uncommitted). Slice 4: protocol card + Print ΥΔ dialog, stamping (3 stages, per-stage selection, arrows), stamping dialog, documents card + remove dialog, cancel dialog; YdTemplate/YdDocument/PendingUpload types; labels; README controller duties. Red: 18/18 failed on stubs; Green 71/71, plus a stampingMinimumDate rule test added after the code (72 focused).
- Final checks on Node 24.13: full suite 48 files / 274 tests pass; npm run build passes; tsc only the 2 baseline TS2352 (delivery-note-service.test.ts 134/138); prettier on the folder and git diff --check pass. Build regenerated routeTree.gen.ts (254/254 route-order churn) — restored, excluded.
- Browser check via a temporary harness (.fro352-harness in the clone with its own vite config; copy in session scratchpad; deleted; launch.json entry removed): details edit/used MRN/focus, customs dialog, invoices add with reasons and save, protocol, stamping dialog, print grouping (2 documents), uploads (valid/empty/type), remove dialog, cancel flow → read-only, viewer role without buttons, EN/EL, 400px no overflow on 4 fixtures × 4 tabs × 2 languages, no console errors. Script-only artefacts (programmatic focus in an unfocused window) noted, not bugs.
- Final diff: 24 new files under frontline-forwarding-client/src/features/exports/details/, 5676 insertions, nothing outside; C:/ffx/fro352-final.patch SHA-256 2be5a20d4d6a6c4e530c44eeaa8a13626d5b06a469d07dbf447bd21156be3a16. main still 5c51030; remote mock/fro-352-export-details absent; rulesets 403, main protection 404 (enforcement gap). Awaiting explicit approval to create/commit/push.

### 2026-10-26 — FRO-352 slice 3 prepared, uncommitted

- User approved slice 2 (keep uncommitted). Slice 3 (invoices tab): invoices card (Edit add/remove at EAD, Add invoice add-only after, locked saved rows, New/Paperwork only badges, picker reasons, Escape order, focus moves), Connected Orders card, local SearchPicker in ui-parts, InvoiceUnavailableReason/InvoiceSearchResult types, labels, README. Red: 9/9 failed on stubs; Green: 53/53 focused tests (one test assertion corrected: it queried the still-open picker list, not the table). Prettier, diff --check pass; tsc only the 2 baseline TS2352. Cumulative slices 1–3: 17 new files, 3792 insertions; diff at C:/ffx/fro352-slices-1-3.patch.

### 2026-10-26 — FRO-352 slice 2 prepared, uncommitted

- User approved slice 1 (keep uncommitted). Slice 2 (Overview) added 4 components (shipment card, identity card with Edit/Save/Cancel, customs block, customs dialog), one test file and labels/README updates. Red: 14/14 component tests failed on render-nothing stubs; Green: 44/44 focused tests. Prettier, diff --check pass; tsc only the 2 baseline TS2352. Cumulative slices 1–2: 14 new files, 2724 insertions, diff at C:/ffx/fro352-slices-1-2.patch (kept out of the planning repo).
- Planning-repo pushes were blocked by the permission classifier (data exfiltration) after slice 1; drafts/fro352-slice1.patch stays untracked; memory commits are local until the user pushes or allows it.

### 2026-10-26 — FRO-352 slice 1 prepared, uncommitted

- User agreed the plan and confirmed the implementation-model checkpoint; asked for slice-by-slice review. Deps: npm install --package-lock=false (lockfile untouched), Node 24.13.
- Slice 1 in C:/ffx/fro352 (detached main 5c51030, uncommitted, 9 new files under src/features/exports/details/, 1580 insertions): types, export-detail-rules (+test), labels (+test), layout (+test), ui-parts, README. Red: 19/21 rule tests failed on a stub (2 passed trivially against all-false capabilities). Green: 30/30 focused tests. Layout tests written with the component, not Red-first. Prettier, git diff --check and README links pass; tsc shows only the baseline TS2352 casts, now at delivery-note-service.test.ts 134/138. Full suite/build deferred to the end, as planned. Diff in drafts/fro352-slice1.patch. Awaiting slice 1 review.

### 2026-10-26 — FRO-352 step 4e plan drafted

- Isolated clone C:/ffx/fro352 detached at main 5c51030. Playbook loaded for FRO-352: HEAD 5c51030, policy committed, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. User confirmed the planning-model checkpoint.
- mock/fro-350-export-create is now published (16 files under src/features/exports/, incl. components/export-details-card.tsx). FRO-352 plan keeps every file under src/features/exports/details/ (no shared paths) with local copies of FRO-350's ReadOnlyField/SearchPicker/CardHeading/RecordLink, flagged in the README for de-duplication.
- Plan in drafts/fro352-frontend-plan.md: 4 slices (shell/rules/labels; Overview; Invoices; VAT/Documents/Cancellation), TDD for pure rules, temporary uncommitted browser harness. TopBar title is a plain string, so the Customs/Cancelled pills go in its actions slot. Local Node 24.13 (22.13 not installed). Awaiting plan agreement, then the implementation-model checkpoint. No code, branch or commit yet.

### 2026-10-26 — FRO-352 reviewed, rewritten and saved; FRO-317 IE599 patch saved

- User: FRO-352 (Export details page UI) was not created through the workflow; review gaps, rebuild the UI from the production design system, and follow the other mock branches (client UI folder only). Pull succeeded. Baseline: Todo, Pending_Review/Frontend/Story/export, 0.0.10, updatedAt 2026-10-20T11:10:41.828Z, blockedBy FRO-317, related 350/348/354/353/347/321, 1 attachment (ChatGPT-hosted preview, 401 signed out), no comments. Main 5c51030. Parallel FRO-350 session active.
- Findings in drafts/fro352-review.md: conflicts with saved FRO-317/321 (no adds at Completed, no cancel, Δ΄ template, missing MRN/EAD/stamping date rules, type matrix, Shipment ID naming, file rules) and gaps (entry points, Cancelled view, foreign Invoicing company, confirmed-by display, print output, house-style sections).
- User accepted Q1–Q12 as recommended: full rewrite; Add invoice at IE599 and Completed; Cancel Export (managers/system admins, Awaiting EAD, reason ≤1,000) + read-only Cancelled view; templates Αερολιμένας / Α΄ / Γ΄, one server PDF per Invoicing company + Supplier (≤5), inline like delivery note; all date rules shown; IE599 ≤ today via FRO-317 patch; FRO-350 inline invoice editing; FRO-350 columns minus Source, keep Paperwork only; Entry Note storage invoice removable at EAD; Invoicing company field on foreign Exports only; Confirmed by / Cancelled by captions; mock/fro-352-export-details, unmounted, under src/features/exports/details/ (no files shared with FRO-350); one design direction, local preview.
- CONTEXT.md: added Informative List and Paperwork only invoice.
- Preview previews/fro352 (base.css from fro350, app.js, build.py), served locally (launch.json fro352-preview, port 8360). Verified: details edit validation, customs dialogs and locks, add-only invoices, picker reasons, Greek minimum, stamping (dates per invoice), print grouping, upload validation, remove confirm, cancel flow, viewer role, EN/EL, 400px no overflow on all fixtures/tabs, no console errors. Not deployed (no Cloudflare token).
- User approved writing drafts/fro352-reviewed-spec.md and the FRO-317 patch (drafts/fro317-ie599-today-patch.md). Baselines unchanged before saving. FRO-352 saved 14:17:23Z with labels re-passed; FRO-317 patch saved 14:17:25Z (fields row, lifecycle bullet, AC 11, Decisions row). Auto-added related removed: FRO-319 from FRO-352; FRO-347/356/303 from FRO-317. Final: both Todo, labels unchanged, relations equal to baselines, attachments unchanged. Linear rendered "FRO-347/350" as a FRO-347 chip + "/350" (cosmetic).
- Next: step 4e mock/fro-352-export-details (client-only, unmounted, from main) needs preparation, verification and a separate push approval. Follow-ups unchanged: Exports list, Shipment Details Export section, prints; FRO-317 stamping table still names "Record stamped return" (FRO-321 says "Record stamped papers returned"), cosmetic.

### 2026-10-26 — FRO-350 previous UI reference added; attachment rename pending

- User approved drafts/fro350-previous-ui-edit.md (edits 1 and 2). Baseline 14:10:14.754Z unchanged.
- Edit 1 saved once (idempotent anchor): Context for agents now has "Previous UI (historical reference only)" linking the ChatGPT-hosted preview (401 signed out) and marking the FRO-317 previews and retained-requirements document historical. Save re-added related FRO-319/FRO-321; removed. Verified 14:16:04.923Z: Ready/Todo, relations original set, 8 attachments.
- Edit 2 not done: re-adding the link with a new title does not rename it, and the connector has no attachment-update tool. Options asked: remove and re-add the link with the new title, rename it in Linear by hand, or keep the old title.

### 2026-10-26 — FRO-350 marked Ready

- User instructed replacing Pending_Review with Ready, status Todo, everything else unchanged. Baseline 14:07:56.093Z unchanged before writing.
- Re-read (updatedAt 2026-10-26T14:10:14.754Z): labels export/Ready/Frontend/Story; Todo; description unchanged; 8 attachments; blockedBy FRO-317; related 348/347/353/352/341/316. No relation side effects.
- Still open (not started): Cloudflare Pages preview (no token); follow-up tickets for the Exports list page, the Shipment Details Create Export button and the prints; FRO-352 alignment with FRO-317. FRO-321 is still Pending_Review.

### 2026-10-26 — FRO-350 branch link saved

- User approved edits 1-3 (drafts/fro350-branch-link-edit.md). Baseline unchanged (13:36:02.589Z) before writing.
- Saved: Context for agents "Prepared frontend branch" paragraph (mock/fro-350-export-create, base 5c51030, head ea00f10); link attachment "Prepared frontend branch — mock/fro-350-export-create"; wording "The attached ChatGPT-hosted creation preview" replaces Linear's chatgpt.site auto-link.
- Incident: the first save's response (and several reads) were stale, so I retried the text patch; the retry duplicated the branch paragraph. Removed the duplicate (approved text restored). Each description save re-added related FRO-319/FRO-321; removed after the last save.
- Final verified (updatedAt 2026-10-26T14:07:56.093Z): one branch paragraph, new wording, 8 attachments (7 original + branch link), labels export/Pending_Review/Frontend/Story, Todo, blockedBy FRO-317, related 348/347/353/352/341/316. Cosmetic: the two FRO-317 mentions in the preview sentence now render as Markdown links.

### 2026-10-26 — FRO-350 mock branch published

- User approved creating, committing and pushing, and accepted the ruleset enforcement gap. Re-verified before writing: main still 5c51030, branch absent on the remote, diff hash unchanged (6fe6e01e...).
- Created mock/fro-350-export-create from 5c51030; one commit ea00f108c9b9a1c41e67b85abc8e419e3bbfb328 "feat(FRO-350): prepare export create UI" (16 added files under frontline-forwarding-client/src/features/exports/, +3,207), byte-identical to the audited diff. Pushed via gh credentials with the explicit same-name refspec.
- Remote verified: head ea00f10 matches local; 1 ahead / 0 behind main; 16 files, all added, none outside src/features/exports/; remote diff hash equals the audited one. No PR, merge, deployment or Linear change.
- URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-350-export-create. Later changes go as new reviewed commits on this branch; each push needs fresh approval. Linking the branch in FRO-350 (Context for agents + link attachment) needs a separate approved edit.

### 2026-10-26 — FRO-350 frontend prepared and verified; push gate pending

- User confirmed the implementation-model checkpoint. Built all four slices uncommitted in C:/ffx/fro350 at main 5c51030: 16 new files only under frontline-forwarding-client/src/features/exports/ (+3,207). TDD Red for the rules (12 behavioural failures) then Green.
- Checks: exports 35/35, full suite 237/237, build OK, tsc only the 2 baseline errors, Prettier and diff-check clean, no secrets. Node 24.13 (22.13 required).
- Browser check through a temporary harness (removed; copy in the session scratchpad): all scenarios pass, EN/EL, 1280px and 400px, no console errors. Fix during the check: Greek tab labels wrapped; tabs now nowrap with a scrolling row.
- A leftover Vite dev process kept rewriting src/routeTree.gen.ts; stopped it (the session's own server on 8352) and restored the file.
- Full diff kept in the session scratchpad only (fro350-frontend-preparation.patch, SHA-256 6fe6e01e...): auto mode refused committing production source to this repo. Handoff drafts/fro350-frontend-handoff.md. Rulesets 403, no protection on main, push=true admin=false. Awaiting approval to create mock/fro-350-export-create, commit and push.

### 2026-10-26 — FRO-350 step 4e started; planning checkpoint pending

- User authorized step 4e: prepare mock/fro-350-export-create from main in an isolated copy, verify, and show the full diff before any branch, commit or push.
- Isolated clone C:/ffx/fro350 detached at main 5c51030 (re-fetched, unchanged). Production playbook loaded: HEAD 5c51030, policy committed, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc (needed PYTHONUTF8=1 on Windows).
- Plan in drafts/fro350-frontend-plan.md: new files only under frontline-forwarding-client/src/features/exports/, unmounted, 4 slices, TDD for pure rules, temporary uncommitted browser harness. User confirmed the planning-model checkpoint and agreed the plan: build all four slices uncommitted, show the full diff once at the end. Implementation-model checkpoint pending. No code, branch or commit yet.

### 2026-10-26 — FRO-317 EAD "not later than today" patch saved

- User approved the drafted patch (drafts/fro317-ead-today-patch.md). Baseline unchanged (13:06:28.810Z). Applied 4 replacements (fields row, Confirm EAD receipt, initial status, AC 11) and the new Decisions row; saved 13:37:38Z.
- Save auto-added related FRO-303/FRO-356/FRO-347; removed only those (13:37:49Z). Final: Todo, labels entry note/export/Integration/Story/Ready, blocks 350/352, blockedBy 321, original 13 related, 8 attachments, all unchanged.
- Cosmetic Linear normalization: two FRO-321 mentions (Decisions "Matches FRO-321's rollout" and AC 16) now render as Markdown links instead of issue chips. Text unchanged; not fixed.
- FRO-350 and FRO-317 now agree on the EAD date window (MRN date to today). Remaining: step 4e mock/fro-350-export-create.

### 2026-10-26 — FRO-350 approved rewrite saved; FRO-317 EAD patch drafted

- User approved writing drafts/fro350-reviewed-spec.md with the listed metadata and cleanup. Baseline unchanged (2026-10-20T11:10:38.464Z) before saving. Saved 13:35:49Z: labels Pending_Review/Frontend/Story/export re-passed, Todo, 0.0.10, Pre-releases 0.0.x, all 7 attachments unchanged.
- Save auto-added related FRO-319/FRO-321; removed only those (13:36:02Z). Final relations: blockedBy FRO-317; related 348/347/353/352/341/316 (original set).
- Linear normalization: the bare text "chatgpt.site" in Context for agents became a link to http://chatgpt.site (cosmetic; meaning unchanged). Not fixed.
- FRO-317 EAD "not later than today" patch drafted in drafts/fro317-ead-today-patch.md (4 replacements + one Decisions row); FRO-317 baseline 13:06:28.810Z. Awaiting approval; no FRO-317 write.
- Next: step 4e mock/fro-350-export-create (client-only, unmounted, from main 5c51030) needs preparation, verification and a separate push approval.

### 2026-10-26 — FRO-350 review started; round 1 pending

- User: FRO-350 (Export creation page) was not created through the workflow; review gaps, rebuild the UI from the production design system, and follow the other mock branches (client UI folder only). Planning pull succeeded. Baseline: Todo, Pending_Review/Frontend/Story/export, 0.0.10, updatedAt 2026-10-20T11:10:38.464Z, blockedBy FRO-317, related 348/347/353/352/341/316, 7 attachments, no comments. Live main 5c51030.
- Findings in drafts/fro350-review.md: patch-stack text; agreed chatgpt.site preview returns 401; misaligned with saved FRO-317 (MRN rules, EAD >= MRN date, Greek >=1 invoice, type matrix, Entry Note shared Export, full blocking list, Company-record grouping); "Free Zone" fixture; production identifier is shipmentNumber and search is number/transport doc; entry points unowned; post-create, duplicate, cancel, invoice-table columns, picker eligibility and access undefined.
- Read-only production clone at C:/ffx/fro350 (short path; scratchpad path too long for git on Windows). Cloudflare token not set.
- Round 1 (Q1-Q12) asked; recommendations are not decisions. No Linear writes, no preview, no branch.
- User accepted all Q1-Q12 as recommended: full rewrite; align to FRO-317; EAD date not after today (needs a one-line FRO-317 patch, separate approval); fixture storage invoice; Shipment number search excluding CANCELLED; entry buttons are follow-ups; result + Open Export + post-create uploads with Retry, unknown-outcome check; duplicate -> Open existing; Cancel/unload guard; invoice columns with Source and Paperwork only badge; picker reasons; preview local + mock/fro-350-export-create (client-only, unmounted, src/features/exports/).
- Preview rebuilt from production tokens: previews/fro350 (base.css from fro316, app.js, build.py). Single direction (design already agreed). Verified locally: search, auto-select, preview toggle, invoices/VAT/Orders, picker reasons, validation focus, replace/cancel modals, outcomes, loading/empty/error, EN/EL, 400px no overflow, no console errors. Not deployed (no Cloudflare token). .claude/launch.json added for the local server.
- Full draft drafts/fro350-reviewed-spec.md shown for approval. No Linear write yet.

### 2026-10-26 — FRO-317 marked Ready; EAD/MRN rule pending text approval

- User instructed the status/label change: removed Pending_Review, added Ready; status stays Todo (the Ready target). Re-read: labels entry note/export/Integration/Story/Ready, relations unchanged, updatedAt 2026-10-26T13:04:08.805Z.
- User decisions: starting protocol number will be specified later (the ticket already says it is supplied before release). EAD receipt confirmation date cannot be earlier than the MRN date; the user approved the four-place patch and it is saved (fields row, Confirm EAD receipt, initial Awaiting IE599 creation, AC 11). The patch re-added related FRO-303/FRO-347/FRO-356; removed again. Re-read: Ready/Todo, relations as approved, updatedAt 2026-10-26T13:06:28.810Z. Linear dropped the closing bold after the FRO-319 mention (cosmetic). FRO-350/352 should show the MRN date as the EAD minimum in the alignment edits.
- User asked what storage invoices are; explained (Αποθήκη Αποθήκευσης type for Τελωνειακή Αποθήκευση Orders). User then confirmed storage invoices are allowed in Foreign invoicing company Exports; the saved matrix already says Allowed, so no ticket change. All FRO-317 business questions from this review are settled.

### 2026-10-26 — FRO-317 approved description saved and verified

- User approved the exact draft (drafts/fro317-reviewed-spec.md) with the listed metadata. Target re-read unchanged (2026-10-23T09:57:41.333Z) before saving. Full description replaced; labels re-passed (entry note/export/Pending_Review/Integration/Story); blockedBy FRO-321 added (replaces the former related FRO-321 link).
- Save auto-added related FRO-303/FRO-347/FRO-356 from mentions; removed only those. Final re-read: Todo, same labels, 0.0.10, Pre-releases 0.0.x, all 8 attachments, blocks FRO-350/352, blockedBy FRO-321, original 13 other related links. Linear split the bold around the FRO-319 mention in "Entry Note shared Export (FRO-319):" (cosmetic). Final updatedAt 2026-10-26T12:58:43.839Z.
- Follow-ups (not started, need separate approval): align FRO-352 (cancel action for managers at Awaiting EAD, Add invoice at Completed, Γ΄ instead of Δ΄ Piraeus template, invoice type matrix) and FRO-350 (type matrix, Free Zone fixture wording); new tickets for the Exports list page, the Shipment Details Create Export action, and the Informative List / Proof of delivery / Pending invoices prints. Starting protocol number is still a release prerequisite. EAD date vs MRN date ordering was not decided.
- No UI, preview or production branch; canvas/preview/step 4e skipped (presentation owned by FRO-350/352).

### 2026-10-26 — FRO-317 workflow review started; round 1 pending

- User asked for a full workflow review of FRO-317 (Export Customs Declaration entity), originally written without the workflow. No UI work: presentation stays with FRO-350/FRO-352; canvas/preview/step 4e skipped; no production branch.
- Baseline: FRO-317 Todo, labels entry note/export/Pending_Review/Integration/Story, milestone 0.0.10, project Pre-releases 0.0.x, updatedAt 2026-10-23T09:57:41.333Z, no comments, 8 attachments, blocks FRO-350/352, no blockers, 14 related. Live main now 5c51030 (ticket cites 3820e89).
- Facts found: FRO-241 is Canceled (FRO-317 still depends on it; FRO-321 now owns invoices, non-UD = Not required, Supplier derived from Order). Vessel has only id/name; Client link via client_vessel. GREEK vat_number unique in DB, FOREIGN not; vat_number nullable. Attachment owner check allows only Order/Shipment. Shipment statuses PREPARING/DISPATCHED/ARRIVED/CANCELLED/LOCATION_UNKNOWN; cancel only in PREPARING. FRO-319 requires one shared Export for a note's storage invoices. FRO-316 excludes Export grouping, so the Shipment "Create Export" entry point and an Exports list have no owner. Order mrn column is retired by FRO-329.
- Round 1 questions (Q1–Q12) sent.
- User accepted Q1, Q3–Q12 as recommended: align to FRO-321/FRO-319 (FRO-321 blocker, type names, Not required, Supplier from Order, shared Export per Entry Note); foreign procedure requires GREEK Supplier; any non-CANCELLED Shipment, no Shipment cancel while an Export exists; minimal cancellation at Awaiting EAD only (reason, audit, frees invoices/group, keeps protocol and MRN reserved); eligible additions allowed at Completed with audit, no removals; group by Company record, missing ΑΦΜ or duplicate FOREIGN VAT blocks; Export permissions on the Shipment pattern, staff only, operators+managers confirm EAD/IE599; server integer ID; MRN 18 alphanumeric uppercase, unique incl. cancelled, date not in future; any Vessel as Delivered vessel; new records/fixtures only, starting protocol number is a release prerequisite. Q2 needs clarification (invoice type vs Export type). Added Export, Export type and Shipper to CONTEXT.md. Round 2 sent; no Linear write.
- User accepted the Q2 matrix (Greek: UD + storage; Foreign: storage + Greek Supplier-Foreign Recipient; historical fourth type never) and Q13-Q17: FRO-241 ΥΔ files (Airport / Α΄ / Γ΄ Τελωνείο Πειραιά); Informative List / Proof of delivery / Pending invoices prints, Exports list and Shipment Create Export action are out of scope follow-ups; FRO-317 defines retrieval by ID/MRN/Shipment/invoice/status; cancellation by managers + system admins, cancelled Exports readable; FRO-350/352 aligned separately after FRO-317 is saved. Full draft: drafts/fro317-reviewed-spec.md, shown for exact-text approval. Proposed metadata: keep all labels/status/milestone/attachments; add blockedBy FRO-321 (replaces related FRO-321).

### 2026-10-26 — FRO-341 branch link and workflow lesson added

- User approved the drafted edits. FRO-341: one Context for agents bullet appended (prepared branch mock/fro-341-create-shipment-layout, base 5c51030, head 1093f0f, unmounted creation components, README activation boundary); link attachment "Prepared frontend branch — mock/fro-341-create-shipment-layout" added. FRO-339 bullet kept (release/0.0.2 still 2 ahead of main).
- Re-read verified: Todo, labels Shipment/Edited/Pending_Review/Frontend/Story, 0.0.9, attachments = branch link + historical preview, blockedBy 9 and related 7 as before. The save re-added related FRO-295 from the existing mention; removed that addition only. Linear's round-trip unbolded the "):" after three heading mentions (Geography rules, From arrived shipments, Create new order); a restore patch was normalized back, cosmetic only. updatedAt 2026-10-26T12:22:19.456Z.
- WORKFLOW_LEARNINGS: added "Build the UI branch from main even when its backend sits on a release branch".

### 2026-10-26 — FRO-341 revision 2 mock branch published from main

- Revision 2 (R1–R7) followed AGENTS.md step 4e: base main 5c51030, unmounted preparation components only, live page unchanged. All four slices approved after review; slice 4 browser check fixed a long-file-name overflow in Documents.
- User deleted the old revision 1 remote branch (70a75af on release/0.0.2; still kept locally as backup/fro-341-release-0.0.2 and in the bundle) and reconfirmed the ruleset enforcement gap (rulesets still 403 on this plan; push=true, admin=false).
- Created mock/fro-341-create-shipment-layout from 5c51030 with four commits, each the approved cumulative snapshot: 6895fc4 shell/rules/review gate, 537094c Overview cards, 675f4cb Orders and collis, 1093f0f Documents and Creation review. Pushed with the explicit same-name refspec.
- Remote verified: head 1093f0fd6450ba33d0442bcb9d087ef8b2d05dcd matches local; 4 ahead / 0 behind main; 17 added files, all under frontline-forwarding-client/src/features/shipments/components/creation/. Checks: Prettier clean, 75 creation tests (full suite 277/277), tsc 0 new errors, build OK. No PR, merge, deployment or Linear change.
- URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-341-create-shipment-layout. Later modifications go as new reviewed commits on this branch; each push needs fresh approval.

### 2026-10-26 — FRO-316 branch and previous-UI links added

- User approved four edits. Context for agents: the stale Cloudflare line replaced with the prepared branch (mock/fro-316-shipment-details-ui, 2078b6e) and local review instructions; new "Previous UI" line linking the hosted chatgpt.site preview as historical reference only. Bold around "Measurement rule (FRO-299)" restored.
- Link attachments added: "Prepared frontend branch — mock/fro-316-shipment-details-ui" and "Previous FRO-316 UI (historical reference)"; the 22 Sep screenshot kept. Auto-added related FRO-297 removed. Ready, Todo, Chris, 0.0.9 unchanged; updatedAt 11:53:30Z.

### 2026-10-26 — FRO-316 mock branch published

- User approved branch, commit and push, and reconfirmed the protection gap. mock/fro-316-shipment-details-ui created from 5c51030; commit 2078b6e (27 added client files, byte-identical to the reviewed patch); pushed with the explicit same-name refspec.
- Remote verified: head 2078b6e, ahead 1 / behind 0, 27 files, 7,270 additions, 0 deletions, all under frontline-forwarding-client/. No PR, merge, deployment or Linear change.

### 2026-10-26 — FRO-316 frontend preparation verified; push gate pending

- User authorized step 4e (Q1–Q4): mock/ pattern, live page unchanged, base main 5c51030, branch mock/fro-316-shipment-details-ui, protection gap accepted; P1 one commit. Planning and implementation model checkpoints confirmed.
- Six slices implemented in an isolated clone: 27 new client files (details components, labels, DEV-only review page). 257 tests pass (55 new, Red first), build passes, typecheck only the 2 pre-existing errors, Prettier/diff-check clean. Browser: 200 sweep checks plus flows clean; fixes for focus return, 400px Greek footers and geography labels.
- Handoff drafts/fro316-frontend-handoff.md; full patch drafts/fro316-frontend-preparation.patch. No branch, commit or push yet; awaiting explicit approval.

### 2026-10-26 — FRO-316 set Ready; FRO-325 consumer additions saved

- User approved FRO-316 → Ready: labels Shipment/Edited/Frontend/Story/Ready, Todo; description unchanged at that step.
- FRO-325 targeted review (drafts/fro325-consumer-review.md). Accepted Q1–Q5: targeted edit; live Order display data + root Order on the participation read; readiness/dispatch blocker lists (AC13); omitted load-unit net weight/notes kept; label (≤100, unique per Shipment) and weight rules stated in FRO-325 and added to FRO-316's editor validation.
- Approved and saved: FRO-325 description from drafts/fro325-consumer-additions.md (updatedAt 09:44:29Z; labels, Todo, 0.0.7 and both attachments unchanged). FRO-316 one-sentence patch in the Validation bullet (09:44:37Z; still Ready). Auto-added related links removed (FRO-325: 295/297/339; FRO-316: 297). Final relations match the original sets.
- Side effect: re-saving FRO-316 dropped the bold closing marker after "Measurement rule (FRO-299)"; the text is unchanged. Not fixed.
- Still open: FRO-341 "Preparing" → "Preparing for dispatch"; FRO-316 preview publication (skipped by the user).

### 2026-10-26 — FRO-316 approved rewrite saved and verified

- User approved the complete displayed draft, metadata changes, attachment removal and relation cleanup. Pre-write read: description unchanged, but updatedAt had moved to 09:00:03Z because the FRO-341 session made FRO-316 block FRO-341 (this replaced the related link). Kept it, since it matches FRO-341's accepted decision 4.
- Saved drafts/fro316-reviewed-spec.md. Title "Shipment Details — Page Redesign"; labels Shipment/Edited/Frontend/Story/Pending_Review (Ready removed until the user approves it for Chris). Todo, Chris, no priority, Pre-releases 0.0.x / 0.0.9 unchanged.
- Removed attachments: the uploaded "Revised Shipment detail proposal" HTML, fro-316-09642d.pages.dev and fro-315-4aadaf.pages.dev. Kept the 22 Sep screenshot. The save auto-added related FRO-297; removed it. Final updatedAt 2026-10-26T09:29:05.789Z. Relations: blockedBy 345/299/344/300/339/324/325/292; blocks 341; related 350/343/342/240/320/309/315/307/326/323/317.
- Re-read matched the approved text after Linear normalization (issue tags, <url> links, escaped brackets).
- Pending: publish the preview to Pages fro-316-<hex6> (needs CLOUDFLARE_API_TOKEN), then attach it and replace the placeholder in Context for agents. FRO-325 edit for Order display metadata/root number. FRO-341 label alignment. Planning repo pushed on the user's explicit instruction (4c5b995); these memory entries are committed separately, leaving the FRO-326 session's uncommitted MEMORY.md edits untouched.

### 2026-10-26 — FRO-316 review started; round 1 pending

- User: FRO-316 was not created through the workflow; review gaps and rebuild the UI from the production design system. Planning pull succeeded. Read the full description (278 lines; updatedAt 2026-10-21T12:33:27.612Z; Todo, Ready/Shipment, Chris, 0.0.9, 8 blockers, 12 related, 4 attachments, no comments). Live main 5c51030; release/0.0.2 09394e5 (FRO-339).
- Findings in drafts/fro316-review.md: patch-stack text with preview narration; History & activity tab missing (FRO-345); Order metadata (owner ref/client/vessel/supplier/root number) not on the Shipment read and unowned; FRO-299 measurement rule not applied; DG count and Final handover would be dropped; packing Save vs Confirm flow; blocking reasons; FRO-344 delivery-note reconciliation; historical ARRIVED delivery-note ineligibility; heading/stepper/PREPARING-label conflicts with FRO-341/FRO-326; stale attachments (fro-316-09642d now serves a FRO-315 page).
- Round 1 (Q1–Q10) asked; recommendations are not decisions. Cloudflare still unauthenticated (no Pages token). No Linear writes, no preview yet, no production branch.
- User accepted all ten recommendations (Q10 typed "pl", then confirmed "ok"). Preview built from production tokens in previews/fro316/ and verified locally; Pages deploy blocked (no token). Full draft drafts/fro316-reviewed-spec.md awaiting approval. Follow-ups: FRO-325 must add Order display metadata + root number to its participation read; FRO-341 label "Preparing" → "Preparing for dispatch". No Linear writes yet.

### 2026-10-26 — FRO-341 step 4e: four UI slices approved; push gate pending

- User authorized step 4e ("Go ahead"), completed both production-playbook model checkpoints and accepted plan D1–D6 (drafts/fro341-frontend-plan.md). Isolated clone in the session scratchpad, remote `github`, detached at release/0.0.2 09394e5218927b54a9fd72f62f98298c0199b46e. Playbook loaded: committed policy b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- Slices 1–4 each reviewed and approved: page shell + review modal (tabs keyboard opt-in), Overview cards (combined destination hubs, deep-link origin prefill, vessel rule), Orders and Collis (collapsible rows, compact partial rows), Creation review content (4 counters, route facts, checks, allocation). 5 client files, +1208/−1422 ignoring whitespace; no backend/GraphQL/generated/dependency changes.
- Verification: 208/208 tests (intermittent 5 s timeouts under full-suite load also seen on the base); build passes; only pre-existing tsc (2) and Prettier (5) issues; browser checks against a local fixture API (EN/EL, desktop/400px). The npm ci lock mismatch, Node 24 vs 22.13, and Windows CRLF were handled locally without tracked changes.
- Final audit: base unchanged, no remote/local 341 branch, all paths client-only, no untracked/secret/debug content, cumulative slice patches rebuild the tree byte-identically. Enforcement gap: account push=true admin=false; rulesets unavailable (403, plan); no branch protection on main or release/0.0.2. Git uses Credential Manager (account unverified), so the proposed push uses gh credentials. Patches are kept in the scratchpad only (production source).
- Pending: explicit approval to create mock/fro-341-create-shipment-layout with 4 commits and push via an explicit refspec. No Linear status change.
- User chose "commit locally, do not push". Created local branch mock/fro-341-create-shipment-layout from 09394e52 in the scratchpad clone: 83783e6 shell/review modal, 5a857d8 Overview cards, 9f07f1f Orders and Collis, 70a75af review summary (head 70a75af32cc5ef60b555717fc12d3c0a852d1faa). Each commit's diff matches its approved snapshot byte-for-byte; the final commit passes 208/208 tests and builds; no upstream; no remote branch. Push still needs a separate explicit approval (and acceptance of the enforcement gap). The clone is in the session scratchpad (temporary), so push or export the commits (git bundle/format-patch) before the scratchpad is cleaned.
- Exported the 4 commits as a Git bundle (user request), outside the scratchpad and the planning repo, not committed: Downloads/FrontLine backup 14-09-2026/Generated files/FRO-341/fro-341-create-shipment-layout.bundle (23,605 bytes, SHA-256 660b284dbfbf00cbcd4695370edc0a6e2eb93272363be2638cf15b62a951e3db). It requires base 09394e52 and carries refs/heads/mock/fro-341-create-shipment-layout -> 70a75af; `git bundle verify` passed.
- User instructed "push the branch" (accepting the enforcement gap after the gate) and said modifications will follow. Pushed with the explicit refspec via gh credentials (frontlineltdproject-star): new remote branch mock/fro-341-create-shipment-layout at 70a75af32cc5ef60b555717fc12d3c0a852d1faa, 4 ahead / 0 behind release/0.0.2 09394e52, 5 client files. Re-fetched remote head matches local; the remote diff equals the approved snapshot byte-for-byte; main 5c51030 and release/0.0.2 unchanged; no PR; no Linear change. URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-341-create-shipment-layout. Later modifications: new commits on this same agent-created branch, each diff reviewed and approved, and every push needs a fresh explicit approval (no force-push).

### 2026-10-26 — FRO-341 approved rewrite saved and verified

- User skipped the Cloudflare step and asked to link the old UI in the ticket as a historical reference. Spec check and full draft in drafts/fro341-reviewed-spec.md; the user approved it with the listed metadata changes and cleanup of automatic relations.
- Pre-write baseline unchanged (08:15:29.875Z). Saved 09:00:03Z: labels Shipment/Edited/Pending_Review/Frontend/Story, blockedBy FRO-316 (the related link became the blocker). The save automatically added related FRO-295 (from a mention); it was removed, final updatedAt 09:00:21.347Z. Re-read: description matches after Linear normalization; Todo, 0.0.9, project, no assignee/priority and the single chatgpt.site attachment unchanged; the 8 original blockers and 7 remaining related links kept.
- Not done: no Ready promotion; FRO-316 field-mapping label alignment ("Country of origin" vs the production "Origin country") is a possible separate edit. Local commits 22b43e2/4c1746e plus this record are unpushed because auto-mode refused pushing production-derived preview files; awaiting the user's decision.

### 2026-10-26 — FRO-341 round 1 settled; preview rebuilt locally

- User accepted all eight round-1 recommendations: full standalone rewrite; drop Declared pcs; deep-link origin prefill; blockedBy FRO-316; plain Notes textareas; warehouses with no city never offered; production components/TopBar with preview-only annotations; Cloudflare Pages preview.
- Asked whether the canvas-design skill was used: it was skipped at first, then tried; it only makes abstract art, so the canvas was hand-written from the live tokens/components. Component map and verification are in drafts/fro341-review.md; source is previews/fro341/.
- Preview verified locally (desktop, 400px, EN/EL, all states and key flows). Cloudflare deploy is blocked: no CLOUDFLARE_API_TOKEN. Push of the preview source (production-derived labels/tokens) was refused by the auto-mode check; committed locally only. The ticket draft, spec check and Linear write are still pending; no Linear changes yet.

### 2026-10-26 — FRO-341 review started; round 1 pending

- User: FRO-341 was not created through the workflow; review gaps and rebuild the UI from the production design system. Planning pull succeeded. Read the full FRO-341 description (318 lines; updatedAt 08:15:29.875Z; Todo, Shipment/Pending_Review/Frontend/Story, 0.0.9, 8 blockers, 8 related, one chatgpt.site attachment, no comments). Live main is 5c51030; the ticket cites the stale 3820e89.
- Facts: FRO-339 is Done but exists only on release/0.0.2 (09394e5218), which already has the composer geography selectors and the city-based warehouse policy. PCS is retired (FRO-295), so the "Declared pcs" counter is invalid. Production creation still supports optional repacking. The shipment status enum has no READY_FOR_DISPATCH. The preview link returns 401 behind a ChatGPT sign-in.
- Findings are in drafts/fro341-review.md. Round 1 asked: rewrite scope, PCS counter, deep-link origin, repacking timing/blocker, Notes interaction, warehouses without a city, heading/annotations under DESIGN.md, Pages preview token. No Linear writes, no preview deploy (wrangler unauthenticated), no production branch.

### 2026-10-26 — FRO-300 reviewed, rewritten and verified

- Mandatory planning pull succeeded. Read full FRO-300 (updatedAt 2026-10-20T11:10:31.791Z; Todo, Ready/Shipment, Chris, No priority, 0.0.9, blocks 316, related 325/299, no attachments/comments), FRO-316, FRO-341, FRO-325, FRO-299. Live source main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a via gh.
- User: ticket was not created through the workflow; no new UI (FRO-316/FRO-341 own presentation); no production branch. Canvas/preview and step 4e skipped.
- Findings in drafts/fro300-review.md: "unpacked" collides with the colli Unpacked flag; measurement source (declared vs warehouse-confirmed) unspecified; Shipment read lacks per-colli measurements/description, so Details review needs a read extension with an owner; row content/order and child/root display undefined; missing exactly-once invariant, saved-vs-reviewed consistency, out-of-scope, decisions, context and verification sections. FRO-299 still describes retired wizard steps (flagged only).
- Round 1 (Q1–Q5) asked; recommendations are not decisions. No Linear writes. Preserve unrelated FRO-326 local changes.
- Round 2 (Q6–Q9) accepted: FRO-299 owns the Shipment measurement read (consistent with the concurrent FRO-299 session's unsaved draft); FRO-300 consumes it, adds blockedBy FRO-299; latest confirmed measurement at any warehouse, per-value, declared fallback with marker; labels Ready/Shipment/Frontend/Story/Edited; title "Shipment Details — list individual collis in Review repacking". Decisions messaged to the FRO-299 session. Glossary term Individual colli added. Full draft drafts/fro300-reviewed-spec.md awaiting approval. Commit/push was blocked by the auto-mode permission check; changes staged only.
- Approved and saved 2026-10-26: FRO-300 updated (08:15:14Z) from drafts/fro300-reviewed-spec.md with new title, labels Shipment/Edited/Ready/Frontend/Story, blockedBy FRO-299. Re-read matched after normalization; removed only auto-added related FRO-297/FRO-341 and re-read. Final relations: blocks 316, blockedBy 299, related 325 (related 299 became the blocking link). Todo/Chris/no priority/0.0.9/no attachments unchanged. FRO-299 still Pending_Review, so the blocker is not yet Ready.
- Follow-ups noted, not done: FRO-316 Review repacking text still says "permanent ID/name"/"recorded dimensions" and should reference FRO-299/FRO-300's resolved values (separate reviewed edit). Root/parent Order reference is not on the Shipment read; FRO-316's Colli allocation must source it.

### 2026-10-23 — FRO-320 approved replacement saved and verified

- User approved the complete displayed draft with "ok". Required pull succeeded; current320 baseline unchanged. Saved drafts/fro320-reviewed-spec.md with Ready/Shipment labels.
- Independent read matched approved text after Linear mention/link/image normalization. Removed only auto-added related339/344 to preserve the approved relation set and re-read. Title, Todo, labels, Chris, priority/project/milestone0.0.8, all original relations and both attachments preserved.
- Receipt updated in drafts/fro320-review.md. No UI/preview, production branch/code/database change or deployment verification. Synchronize only this memory entry/review receipt; preserve unrelated local work.

### 2026-10-23 — FRO-320 decisions settled; replacement awaiting approval

- User accepted Q2 consistent human-facing Warehouse transfer wording across Shipment consumers/existing records and Q3 clear proven-invalid destination, explain and require reselection while preserving unrelated draft facts. Earlier coordinated316/341 activation decision retained. No new glossary term/ADR required.
- Mandatory pull succeeded; fresh full320 unchanged at2026-10-20T11:10:16.059Z; live source remains5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Applied ticket-writing skill; full standalone replacement drafts/fro320-reviewed-spec.md and before/after/consumer record drafts/fro320-review.md prepared.
- Draft covers both kind/operator pairs,339 geography, stale selection versus lookup failure, global display naming/internal contract preservation, reserved Order stock outcome,324 historical preservation,344 ownership, coordinated release and AC-mapped read-only verification. Historical screenshot/preview retained as references; no new UI/preview/production branch or production write.
- Pending exact full-text approval before Linear write. Preserve title, Todo, Ready/Shipment, Chris, priority/project/milestone, all relations and both attachments; no metadata changes authorized. Synchronize only320 planning changes and this entry, preserving unrelated work.

### 2026-10-23 — FRO-320 review; naming and invalid-selection decisions pending

- Mandatory planning pull succeeded; authenticated live gh source pinned5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Read full320/comments (none),316/341/339/324/344 and current team labels/statuses.320 remains Todo, Ready/Shipment, Chris, milestone0.0.8, blocks341, original related issues and two attachments unchanged. Linear shared agent-context endpoint unavailable; direct reads work.
- Grilling/domain-modeling applied with skill-required read-only backend trace. Findings and consumer matrix in drafts/fro320-review.md: stale UI prescriptions contradict341; explicit active kind/operator/geography eligibility; retained invalid destination after origin changes; naming scope across list/details; stock-confirmation reserved Order outcome PREPARED_FOR_SHIPMENT versus stay IN_STOCK;324 already-stocked history preservation; release timing and verification gaps.
- User accepted Q1 coordinated activation with compatible316/341 (milestone0.0.9), preparation permitted earlier, no milestone change. Q2 naming scope and Q3 clear-versus-retain-invalid destination remain pending. Recommendations are not decisions. No full replacement or Linear write approved.
- Canvas/preview skipped because316/341 own presentation; production branch expressly prohibited. No UI/source/database/deployment changes or new glossary/ADR. Remote production guidance read; no local production playbook snapshot claimed. Preserve unrelated planning modifications and synchronize only this checkpoint/review.

### 2026-10-23 — FRO-324 approved replacement saved and verified

- User approved the complete displayed draft with "ok". Mandatory planning pull succeeded; fresh324 baseline unchanged at13:06:53.395Z. Saved exact drafts/fro324-reviewed-spec.md and re-passed Pending_Review/Backend/Story/Shipment.
- Independent read matched approved text after Linear mention/link/list normalization. Removed only auto-added related342/345 to preserve the explicitly approved relation set, then independently re-read again.
- Final updatedAt2026-10-23T14:20:09.829Z. Verified all other returned metadata unchanged: title, Todo, labels, priority, assignments, project/milestone0.0.8, original blocks316/341 and related320/323/343/339/325, no blockers, four attachments and no documents. No Ready promotion or linked-ticket description changes.
- Verification receipt in drafts/fro324-review.md. Historical-upload contract reconciliation remains an activation prerequisite. No UI/preview/production branch/code/database action or deployment verification; no new glossary/ADR. Synchronize only324 receipt/checkpoint and preserve unrelated local work.

### 2026-10-23 — FRO-324 interview complete; full replacement awaiting approval

- User accepted Q6: Europe/Athens calendar for comparison/future dates; preserve native date-only values and original timestamp precision. All six decisions settled. Mandatory planning pull succeeded; full324/342 and current labels/statuses refreshed, target unchanged at13:06:53.395Z. Live main remains5c51030680c9d45b3827a7e19b8320c19aa5ed9a.
- Applied frontline-linear-issues. Complete standalone draft drafts/fro324-reviewed-spec.md covers accepted stock/expectation/matching/date/upload/fiscal decisions, exact provenance/completion, shared adapters/readers, stable retry/result recovery, migration and compatible-consumer activation, AC-mapped read-only verification. Before/after comparison stays in drafts/fro324-review.md and chat, outside description.
- Description-only proposal preserves title, Todo, Pending_Review/Backend/Story/Shipment, project/milestone0.0.8, priority/assignment/other metadata, original relations and four attachments. No Ready promotion; no linked-ticket changes.342 current exclusion/concurrent draft must be reconciled before activating324 historical upload integration; Q4 here is explicit but not permission to edit342.
- Pending approval of full displayed replacement before any Linear write. No new glossary/ADR; no UI/preview/production branch/code/database action or deployment verification. Synchronize only324 draft/review/checkpoint, preserving unrelated local changes.

### 2026-10-23 — FRO-342 / FRO-335 approved descriptions saved and verified

- User approved both complete displayed descriptions with "ok". Mandatory pull succeeded; fresh target baselines unchanged. Saved exact drafts/fro342-reviewed-spec.md and drafts/fro335-upload-reconciled-spec.md with their complete existing label sets.
- Independent re-read matched both complete descriptions after Linear mention/link/list normalization.342 save auto-added related326; removed only that automatic addition under approved metadata preservation and re-read. Final metadata comparison: no differences except updatedAt, including labels/status/milestones/relations/attachments/documents and all other returned fields.342 updated14:14:28.671Z,335 updated14:14:09.889Z;335 retains its one preview attachment.
- No Ready promotion,341 edit, preview change, production branch/code/database/deployment action. Planning receipt updated. New shared324 planning note proposes historical integration under324; do not silently change these approved342/335 descriptions. Historical ownership and341 wording remain cross-ticket reconciliation before implementation.
- Commit/push only this memory entry and342 review receipt; preserve unrelated local work.

### 2026-10-23 — FRO-324 first five decisions accepted; date calendar pending

- User accepted Q1–Q5: allow stock confirmation with unknown historical arrival date; reuse matching opening EXPECTED stay and reject mismatched warehouse; reject conflicting known matched-arrival dates;324 integrates342 pending uploads atomically; no retroactive fiscal preparation/issuance under this feature. No Linear-write or linked-ticket-edit approval inferred.
- Planning pull succeeded; current324 and342 unchanged at13:06:53.395Z/13:51:31.724Z; live main5c51030680c9d45b3827a7e19b8320c19aa5ed9a unchanged. Updated drafts/fro324-review.md.342 current description and concurrent draft exclude historical uploads; preserve explicit324 decision and reconcile ownership before integration, without changing the other task's files.
- Pending Q6: explicit calendar/timezone for date-only versus exact timestamp comparison and future-date checks. Source shows UTC Clock bean, direct OffsetDateTime.now in Shipment service, browser-local detail formatting, native date-only helper and no warehouse timezone; no authoritative business timezone established. Propose Europe/Athens office calendar with original timestamps preserved and no invented exact time; user must choose against warehouse-local semantics.
- No Linear/UI/preview/production branch/code/database changes or new glossary/ADR. Full replacement awaits remaining date decision and full-text approval. Synchronize only324 review and this entry; preserve unrelated working changes.

### 2026-10-23 — FRO-342 / FRO-335 decisions accepted; complete drafts prepared

- User accepted Q2 historical ARRIVED creation uploads excluded, Q3 prepare targeted335 reconciliation, Q4 stable upload retry and creation-attempt/context recovery guarantees. Earlier Q1 makes342 a backend implementation specification. These decisions do not authorize Linear writes or production implementation.
- Mandatory pull succeeded; fresh342/335/341 unchanged, source main5c51030680c9d45b3827a7e19b8320c19aa5ed9a unchanged. Drafts: drafts/fro342-reviewed-spec.md and drafts/fro335-upload-reconciled-spec.md. Review/before-after/preservation receipt in drafts/fro342-review.md.
- FRO-342 covers atomic association, corrected versus unknown/replayed attempts, one record per context including no-file creation, lost upload recovery, expiry-independent result recovery, compatible legacy callers and GraphQL/REST/MCP integration. FRO-335 consumes those contracts and reconciles cancellation/acceptance/verification and existing preview simulation requirements; all unrelated main business sections verified unchanged after mention normalization.
- No Linear mutation; preserve full metadata/relations/attachments on eventual approved writes.341 historical wording requires targeted reconciliation; only proposed follow-up wording recorded, no full341 replacement prepared. No new UI/preview/production branch; no glossary/ADR. Complete drafts awaiting review and explicit write approval.
- Commit/push only these draft/review files and this memory entry; preserve unrelated326/330 changes.

### 2026-10-23 — FRO-324 evidence review; first interview round pending

- Mandatory planning pull succeeded; live gh authentication/source and Linear reads verified. Current324 updated2026-10-23T13:06:53.395Z, Todo, Pending_Review/Backend/Story/Shipment, milestone0.0.8, blocks316/341 and related320/323/343/339/325; four attachments preserved. No Linear write. Read current linked contracts, comments (none), labels/statuses; production consumer checks pinned5c51030680c9d45b3827a7e19b8320c19aa5ed9a.
- Review in drafts/fro324-review.md: unknown-arrival stock confirmation/last-known location; initial EXPECTED stay reuse; immutable existing-arrival provenance; explicit closed historical participation; null/date-safe reads, chronology and operation retry;342 historical-upload exclusion conflicts with341; fiscal preparation boundary; compatible-consumer release timing and stale prescriptive UI text.
- Grilling/domain-modeling applied with focused delegated read-only evidence. Pending Q1 unknown-date stock confirmation, Q2 mismatched opening expectation, Q3 conflicting matched-arrival dates, Q4 historical pending-upload integration, Q5 historical fiscal preparation. Recommendations remain proposals.342 review also has historical-upload ownership pending; reconcile the same decision rather than independently approve contradictory contracts.
- Canvas/preview skipped because316/341 own presentation; production branch prohibited. No production checkout/code/database changes or deployment check. Remote production guidance read; local playbook snapshot/fingerprint not claimed. No glossary/ADR decision yet. Synchronize only324 review and this checkpoint, preserving unrelated local work.

### 2026-10-23 — FRO-342 independent workflow review; clarification pending

- Planning pull succeeded and live GitHub/Linear read access verified. Reviewed current342 (updated13:51:31.724Z),335/341/316/326/325/324 and board metadata; production source through gh, creation trace at5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Linear agent-context endpoint unavailable. No Linear mutation.
- Confirmed335 post-create upload/recovery contract contradicts342 atomic staged association;335 milestone0.0.5 precedes3420.0.8.341 historical ARRIVED promises pending attachments whereas342 excludes that operation. Saved Details316/326 can retain ordinary attachment behavior; no new UI/preview needed, production branch excluded by user.
- Review record drafts/fro342-review.md covers source trace, upload lost-response retry, context/attempt closure and corrected retries, no-file/result recovery, adapter parity, pending persistence constraints and exact validation. Existing atomicity, permissions, inheritance and cleanup protections are substantially covered; preserve them.
- User accepted Q1:342 should be a backend implementation specification, while this chat remains planning-only. Pending Q2 historical exclusion versus inclusion, Q3 permission to prepare targeted335 reconciliation, Q4 explicit upload/creation recovery guarantees. Recommendations are not decisions. No complete replacement or Linear approval yet; no glossary/ADR.
- Synchronize only this review and this memory entry; preserve unrelated326/330 work and existing local memory changes.

### 2026-10-23 — FRO-342 expanded to Order and Shipment creation uploads

- User explicitly authorized extending FRO-342 to both Orders and Shipments. Planning pull succeeded; current attachment and Order creation contracts checked read-only through gh at production main fb8d5d534281da0c9eac5773e34ef2438588cb72. No new business-rule choices or glossary/ADR changes; reuse the existing upload safeguards for both entities.
- Saved title Order & Shipment — structural support for file uploads during creation; added Order label and blocks FRO-335, preserving existing blocks FRO-341 and related FRO-325/FRO-316. Expanded creator/entity/context ownership, Order permissions, atomic child/state/audit association, recovery, cleanup and verification. Remains structural design/specification only; no production/UI/preview/code/branch/deployment work.
- Independent read verified complete description after Linear formatting normalization, all original labels plus Order, Todo/Pending_Review, priority/project/milestone and other metadata. Final updatedAt 2026-10-23T13:51:31.724Z. FRO-335 description is byte-for-byte unchanged; reciprocal blockedBy FRO-342 confirmed.
- FRO-335 needs a targeted follow-up text reconciliation: existing create-first/upload-after, partial saved-Order upload recovery, frontend-only uncertainty/no backend idempotency, cancellation-without-writes, relevant acceptance/verification and browser-local-only preview statements conflict with staged uploads/atomic creation. User asked for advice, not that rewrite; no FRO-335 text or preview changes. Preserve its carefully developed layout, fields, initial-readiness/customs/colli/invoice/notes rules. Full saved specification and review receipt under workspace Generated files/FRO-342/Drafts and notes/.

### 2026-10-23 — FRO-325 full-grill revision saved and verified

- User approved the complete revised description with οκ. Planning pull succeeded; fresh pre-write issue matched the reviewed baseline. Saved exact drafts/fro325-reviewed-spec.md with all four existing labels.
- Independent read matched approved text after Linear formatting normalization. Removed only three automatic save-added related links (FRO-339/295/297) to preserve approved relations. Final independent read at 2026-10-23T13:09:14.726Z confirms exact description and every returned metadata field except expected updatedAt, including original relations and both attachments. Todo/Pending_Review preserved.
- Full grill, specification reconciliation, approved write and ticket verification complete. No UI, preview, production branch/code/database write or deployment; implementation/post-deployment verification remains future work. Planning records synchronized separately; unrelated local changes preserved.

### 2026-10-23 — FRO-325 full grill resolved; revised description awaiting approval

- User accepted Q3: explicit confirmation establishes attested physical packing in affected colli journeys; creation-time/ordinary saved plans do not assert physical work. Q1/Q2 remain accepted: physically completed Ready and direct atomic changed reconfirmation. No further business-decision frontier found.
- Revised complete drafts/fro325-reviewed-spec.md reconciles commands, lifecycle, physical history and legacy provenance, AC/read-only verification, plus factual FRO-345 structural-history ownership. drafts/fro325-full-grill.md records coverage/consumer outcomes. Existing labels/status/relations/attachments and other metadata must remain unchanged; no Linear write before fresh full-text approval.
- Planning pull succeeded; fresh FRO-325 remains at 2026-10-23T12:30:06.313Z. Production main advanced to 38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e (FRO-307 address sources); inspected relevant delta from prior reviewed commit, with no change to packing/readiness rules. Source reference refreshed. No production writes, UI, preview or branch. No new glossary/ADR; preserve unrelated local changes.

### 2026-10-23 — FRO-325 grill round 1 accepted; physical history question pending

- User accepted Ready as attestation of completed physical packing and atomic explicit reconfirmation of a changed arrangement; ordinary changed Save still invalidates readiness. Recorded vocabulary in CONTEXT.md and decisions in drafts/fro325-full-grill.md.
- Round 2 asks whether confirmation establishes physical colli arrangement/history while creation/ordinary saves remain plans; recommend yes, preserving previous physical facts and linking effects without duplicates. Exact event design remains implementation work. FRO-345 history contract and live journey semantics ground the question; do not invent physical occurrence times from confirmation time.
- Planning pull succeeded. Fresh FRO-325 remains unchanged at 2026-10-23T12:30:06.313Z; FRO-345 read current. No Linear/approved-draft/UI/production changes. Full revised text still requires approval. No ADR warranted. Preserve unrelated working changes.

### 2026-10-23 — FRO-325 full grill reopened; two concrete decisions pending

- User requested full grill, narrowed it to concrete omissions only, and resumed with Astra. Planning pull succeeded; refreshed full325/comments and316/344/345; live gh main remains3820e89e8caa341261e2d48bcb282d93e1bb1d03. Saved325 remains unchanged at2026-10-23T12:30:06.313Z. Same task playbook provenance retained; no new production snapshot/source/branch changes.
- Coverage/checklist and pending questions in drafts/fro325-full-grill.md. Q1 asks whether Ready attests physically completed packing or only an approved plan; recommend completed arrangement. Q2 asks whether explicit reviewed confirmation of changed packing can atomically retain Ready; recommend yes, while ordinary Save invalidates. Both await answers; preserve earlier accepted stock/document/activation decisions.
- Found factual ownership error in saved325:345 is structural history persistence/APIs, not presentation;316 owns UI. Other checked branches already covered, including optional weights, global document uniqueness including cancelled Shipments, cancellation rollback, no-op/concurrency/permissions, geography/PCS/DG. Do not reopen them without a new contradiction.
- No Linear or approved-draft edits; any revision requires fresh full-text approval. UI/canvas/preview/production branch excluded. No new resolved vocabulary/ADR. Synchronize only this entry and grill record; preserve unrelated326/330 local work.

### 2026-10-23 — FRO-325 approved revision saved and verified

- User approved the complete displayed draft with ok. Mandatory planning pull succeeded; fresh full issue remained unchanged at2026-10-20T11:09:51.244Z. Saved exact drafts/fro325-reviewed-spec.md and re-passed all four existing labels.
- Independent read confirmed the complete description after Linear mention/link/list normalization. Save auto-added related295/297/339; removed only those save-induced additions under approved metadata-preservation scope. Second independent read confirms exact original relations, labels, title/status/priority/project/milestone, both attachments and all other returned metadata. Final updatedAt2026-10-23T12:30:06.313Z; no Ready promotion.
- Review record marked saved. No UI/preview changes, production branch/code/database writes, deployment or implementation tests. No new glossary/ADR. Synchronize only this entry and325 review record; preserve unrelated326/330 local work.

### 2026-10-23 — FRO-325 source review and accepted decisions; revised draft pending approval

- Mandatory planning pull succeeded. Refetched full FRO-325, comments (none), current FRO labels/statuses and linked 316/341/344/295/297/339/303/322 contracts. FRO-165 is archived email-tagging; Shipment Details owner is FRO-316. Target remains Todo, Pending_Review/Backend/Epic/Shipment, unassigned, no priority, milestone0.0.7, original relations and two attachments unchanged.
- Read live production through authenticated gh at3820e89e8caa341261e2d48bcb282d93e1bb1d03. Playbook committed policy fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc; same-snapshot UTF-8 resume recovered Windows display encoding. Optional Linear shared context endpoint unavailable; direct reads worked.
- User accepted coordinated activation with compatible consumers (UI milestones0.0.9), stock confirmation for every participating Order before Ready, and explicit pre-dispatch number clearing without readiness loss while dispatch remains blocked. Fiscal draft-reconciliation question withdrawn after source confirmed grouping-only edits preserve its HU-weight/membership source. No automatic fiscal reconciliation scope added.
- Findings: PCS-preservation wording conflicts with295 retirement; Ready DG count needs297 coordination; consume339 current geography validation; load-unit deletion/mutation must preserve referenced LOADED history; no-op, expected-version/concurrent-command/retry contracts need specificity; migration guards/adapters/authorities/rollout need coverage. Review and consumer table: drafts/fro325-review.md. Full standalone proposal: drafts/fro325-reviewed-spec.md.
- Canvas/preview/UI branch skipped: presentation owned by316/341; user prohibits production branch. No Linear write, production source/database write, branch, deployment or post-deployment test. No glossary/ADR change. Await complete draft approval under AGENTS4c; retain exact metadata/relations/attachments. Preserve unrelated326/330 local work. Synchronize only this entry and two325 drafts.

### 2026-10-23 — FRO-348 approved historical UI footer saved and verified

- User approved the exact historical-reference addition. Mandatory planning pull succeeded; fetched full current348, appended only the approved italic footer via patch and retained complete labels. Footer links original Details version20/20October2026 at https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site/baseline-v20.html and states current specification/selectedA take precedence.
- Independent read verified previous description plus exact footer after Markdown URL normalization. Save auto-added related303; removed only that save-induced relation under approved metadata-preservation scope. Second independent read confirms exact description and all returned metadata/labels/relations/attachment unchanged; updatedAt2026-10-23T12:22:47.749Z. No other Linear, Site or production changes.
- Synchronized saved-description draft and marked complete historical-reference proposal approved. Reference-only scope; no business-rule/design change or new glossary/ADR. Planning records synchronized separately, preserving unrelated326/330 changes.

### 2026-10-23 — FRO-348 historical-reference footer prepared for approval

- User requested the original UI as a historical reference at the end of348. Mandatory planning pull succeeded; full current target read unchanged at2026-10-23T11:23:44.164Z. Original version20 preview was verified to match20October source b6311c7 dist/index.html after line-ending normalization; preserved at /baseline-v20.html on the existing private Site.
- Prepared complete description-only append proposal in drafts/fro348-historical-reference-proposal.md, preserving all current content and metadata/relations/attachment. Footer identifies original version20/20October2026 as historical only, current specification/selectedA take precedence. Reference-only change: no product behavior, consumer tracing or new design work. Ticket-writing skill loaded; no Linear/Site/production mutation. Await exact-footer approval under AGENTS4c, then append/re-read/verify and synchronize saved draft.

### 2026-10-23 — FRO-348 reviewed partial UI branch pushed by explicit exception

- User explicitly authorized pushing the reviewed FRO348 partial UI branch despite known protection, integration and baseline-check limitations, with no PR or deployment. This overrides those publication gates for this exact push only; no protection/permission changes. Prior conditional request superseded by this clear scoped authorization.
- Mandatory planning pull succeeded. Resumed same committed3820e89 playbook fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Before push verified clean local mock/fro-348-supplier-invoice-details at68d19009dd21c188449412bff7e7eaf44cf9b2d1, correct github remote, parent/main3820e89e8caa341261e2d48bcb282d93e1bb1d03 unchanged, exact approved patch match, no active hooks and remote branch absent.
- Executed exact same-name refspec: git push github mock/fro-348-supplier-invoice-details:mock/fro-348-supplier-invoice-details. Push succeeded. Fetched branch and independently confirmed remote head68d19009dd21c188449412bff7e7eaf44cf9b2d1 and complete remote diff exactly equals approved9file1239insertion patch. Whitespace PASS; local tree clean and main unchanged. No source changes or repeated app checks; existing175-test/build evidence and inherited limitations remain as reviewed.
- Branch https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-348-supplier-invoice-details . Updated handoff with remote verification and scoped exception. No PR/merge/deployment/Cloudflare/Linear mutation. Working invoice integration/controller/access/recovery/files remain incomplete; initial-focus documentation minor retained. Planning records synchronized separately; preserve unrelated326/330 work.

### 2026-10-23 — FRO-348 push prerequisite check blocked

- User requested the next step after approved local commit. Mandatory planning pull succeeded. Resumed same committed3820e89 policy/fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Local mock/fro-348-supplier-invoice-details clean at68d19009dd21c188449412bff7e7eaf44cf9b2d1; exact reviewed patch match; remote branch absent; main remains3820e89e8caa341261e2d48bcb282d93e1bb1d03.
- Current GitHub permissions maintain/pushtrue adminfalse. Main protected=false, protection.enabled=false, enforcement off. Ruleset listing including parents and effective mock-branch rules return403 with GitHub plan-upgrade message. Required restricted write enforcement cannot be verified. No permissions/protections changed; no production push/PR/deployment/Linear action.
- AGENTS.md4e blocks publication pending protection configuration/verification or an explicit user revision; other tickets' exceptions do not transfer. Partial integration and inherited required-check limitations remain as disclosed in the handoff. Deferred exact command: git push github mock/fro-348-supplier-invoice-details:mock/fro-348-supplier-invoice-details. Not executed; retain local branch. Planning records synchronized separately, preserving unrelated work.

### 2026-10-23 — FRO-348 reviewed local branch and commit created; no push

- User explicitly approved proposed local branch mock/fro-348-supplier-invoice-details and committing the exact reviewed nine-file diff, without pushing. Mandatory planning pull succeeded. Resumed existing committed policy snapshot at3820e89, SHA256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc; prior checkpoints preserved.
- Before mutation verified detached clean tracked baseline/main3820e89e8caa341261e2d48bcb282d93e1bb1d03, correct github remote, empty index, unused branch locally/remotely and no active hooks. Working patch and staged diff each matched approved patch byte-for-byte, SHA256 f1a49e01f76b81f17ae863727a9ce9d66fb17393128ca08efe14a04aa68568b6.
- Created approved local branch and commit68d19009dd21c188449412bff7e7eaf44cf9b2d1 — feat(FRO-348): prepare supplier invoice details UI. Verified parent/base, exact9frontendfiles1239insertions, committed patch match, clean working tree, empty index and no upstream. No production push/PR/deployment/Linear mutation. No source changes or repeated app tests; prior175-test/build evidence applies to identical reviewed contents.
- Updated drafts/fro348-frontend-handoff.md with local ownership/commit. Partial unconnected presentation, missing invoice/regime/API/authority/attempt/file/controller integration, inherited install/type/format failures and initial-editor-focus documentation minor remain. Push deferred; no other ticket's publication exception transfers. Planning records synchronized separately; unrelated326/330 work preserved.

### 2026-10-23 — FRO-348 partial frontend prepared; verified diff remains branchless

- User approved plan/native execution and separately completed implementation-model checkpoint. Mandatory planning pull succeeded. Resumed FRO348 committed policy at3820e89e8caa341261e2d48bcb282d93e1bb1d03, SHA256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Isolated fro348-frontend remains detached with nine new untracked frontend files; index empty, no local branch refs, production commits/pushes/PR/deployment/Linear writes.
- Prepared actual comfortable Card/TopBar/Tabs grids, controlled one-editor surfaces, saved VAT progression/dates, named guarded confirmation/outcome presentation, relationship states and saved-file download rows, typed EN/EL copy/tests/README. Partial unconnected presentation only; no real route/controller/validation/search/navigation guards/API/authority/domain computation. FRO321 entity/access/atomic correction/cancellation/events/attempt/files and FRO356 regime remain required; later317/319 integrations staged. FRO347 unmerged README overlaps and needs reconciliation when combining.
- Complete patch drafts/fro348-frontend-preparation.patch:9files1239insertions, SHA256 f1a49e01f76b81f17ae863727a9ce9d66fb17393128ca08efe14a04aa68568b6. Full handoff drafts/fro348-frontend-handoff.md; screenshots/logs/measurements in drafts/fro348-frontend-evidence/. Apply/whitespace/reverse checks PASS; manifest/lock/generated route unchanged, original route checkout line endings restored.
- Watched12behavioral assertions fail before implementation, then12/12focused PASS. Supplied-capability revocation reproduced/fixed. Final full41files175tests PASS and build1.94s PASS after reviewed modal fix. New-file Prettier PASS. Existing npmci manifest/lock mismatch,269formatfiles and two TS2352 delivery-note test casts77/81 retained; local npm install --package-lock=false used, Node22.13.0. No codegen/lint applicable.
- Actual-component browser fixtures verified1440/1100/400 EN/EL, exact external text retention through tabs/language, saved separation, keyboard tabs, cancellation/unknown/date outcomes and real DatePicker nested Escape, lookup/file states/actions and view-only/cancelled presentation. Important fresh-review finding reproduced with longGreek feedback400x400: clipped532px dialog, fixed feature-local maxheight/scroll; bounded368px panel and footer keyboardfocus verified. Fullsuite rerun green. Temporary fixture HMR produced createRoot warning; fresh page/cancel journey0consoleerrors/warnings. Viewport reset, temporary tabs closed/server stopped.
- Fresh review: no Critical; one Important fixed as above. Deferred minor: feature README should explicitly state initial editor-focus ownership for eventual controller (dismissal restoration verified). Rulings retain local ledger/manual bookkeeping, preserve inherited failures, and keep partial/integration/publication gates explicit. Main refreshed unchanged; FRO348 reread unchanged at2026-10-23T11:23:44.164Z. No new glossary/ADR. Planning records only synchronized; preserve unrelated326/330 work. User must review actual diff before any production branch/commit/push; publication remains blocked pending working integration, required checks and enforced restrictions.

### 2026-10-23 — FRO-347 reviewed frontend branch pushed by explicit exception

- User explicitly authorized pushing the reviewed FRO-347 branch despite existing main-branch issues and protection limitations, with no unrelated fixes or PR. This overrides those publication gates for this exact push only; no permissions/protections changed. Prior conditional authorization is superseded for this scoped push.
- Planning pull succeeded. Prepush verified clean local mock/fro-347-supplier-invoice-create at ac539a93f3e3884b70de5e57dfc83563aa2346db, parent/main3820e89e8caa341261e2d48bcb282d93e1bb1d03 unchanged, verified github remote, destination branch absent, no active hooks, and exact approved patch match. No source changes or repeat tests/build; existing171-test/build evidence and disclosed baseline/integration limits remain.
- Executed git push github mock/fro-347-supplier-invoice-create:mock/fro-347-supplier-invoice-create successfully. Fetched published branch; remote head equals approved localcommit, remote main unchanged, full remote diff exactly matches reviewed seven-file/1015insertions patch; whitespace and clean-tree checks pass.
- Branch URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-347-supplier-invoice-create . Updated drafts/fro347-frontend-handoff.md. No PR/merge/deployment/Linear/backend/unrelated-code changes. Working integration remains incomplete; exception does not authorize additional commits or future pushes. Preserve unrelated326/330 planning changes; synchronize only FRO347 records under the planning-repository rule.

### 2026-10-23 — FRO-348 isolated preparation authorized; plan awaiting agreement

- User explicitly authorized frontend preparation in an isolated local checkout and a verified diff/dependency report before production branch creation, commits or pushes. Mandatory planning pull succeeded. Created clean detached checkout at C:/Users/Giorgos/.codex/visualizations/2026/10/23/01a1683e-7796-7b71-a01e-27e0158a7080/fro348-frontend, verified github remote and main3820e89e8caa341261e2d48bcb282d93e1bb1d03. No production branch, commit, push, source edit or dependency installation.
- Initial playbook output failed Windows encoding; reported and recovered with UTF-8 resume of the existing FRO-348 snapshot. Policy committed at3820e89, fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Preserve this snapshot/checkpoints on continuation. User explicitly completed planning-model checkpoint; implementation-model checkpoint remains pending.
- Refreshed FRO348/321/356/347 and current FRO348 comments (none). FRO348 unchanged at2026-10-23T11:23:44.164Z, Todo/full labels/relations/attachment retained; no Linear write. Shared field-notes endpoint unavailable (tool-not-found). Current production code confirms no new invoice entity/API/authority/regime/attempt/file owner; existing PO invoice rows and Order/Shipment AttachmentPanel cannot substitute.
- Plan docs/superpowers/plans/2026-10-23-fro348-frontend-preparation.md proposes three partial presentation slices with actual Card/TopBar/Tabs/Modal/feedback/token mapping, controlled editor/confirmation/outcome slots, supplied relationship and saved-file states, EN/EL/browser checks, full diff and dependency handoff. Full form/controller, type picker extension, navigation/unload and real recovery/integration remain explicit obligations. Nine new frontend files proposed, no shared primitive/API/backend changes. No new glossary/ADR.
- Await plan agreement (including partial preparation boundary), execution choice and separate implementation-model checkpoint before product-code changes. Recommend native execution with a fresh final review. No prior FRO347/326 checkpoint or publication exception transfers to348. Preserve unrelated planning modifications; synchronize only this plan and memory entry.

### 2026-10-23 — FRO-347 conditional push not executed; other checks still fail

- User authorized pushing only if protections are the sole issue. Rechecked local mock/fro-347-supplier-invoice-create at ac539a93f3e3884b70de5e57dfc83563aa2346db: clean tree, main3820e89 unchanged, target branch still absent remotely; rulesets still403. Planning pull succeeded.
- Fresh npx --no-install tsc --noEmit fails with the same two TS2352 casts in delivery-note-service.test.ts77/81. Read-only manifest/lock comparison confirms existing mismatch (Floating UI, GraphQL/codegen, clsx, tailwind-merge, prettier root entries absent). Existing formatting and integration limits remain as documented; no fixes or repeated broader checks authorized.
- Protections are not the sole blocker, so the conditional authorization does not permit this push. No push/PR/Linear/source changes. Any later push despite these other blockers requires explicit acceptance; do not treat this message as unconditional permission or transfer another ticket's exception. Retain local checkpoint under existing push deferral; preserve unrelated changes.

### 2026-10-23 — FRO-347 reviewed local branch and commit created; no push

- User explicitly approved local branch creation and committing the reviewed FRO-347 diff, while deferring push. Planning pull succeeded; resumed committed policy snapshot at3820e89, SHA256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc; prior checkpoints preserved.
- Production main refreshed unchanged at3820e89e8caa341261e2d48bcb282d93e1bb1d03; branch name absent locally/remotely; index empty; no active local hooks. Seven working files and staged diff each matched approved patch byte-for-byte, SHA25634621bb5f156cdc14fd3fce339b3c13a46bc9945a97e780615f6213642b06e16.
- Created local mock/fro-347-supplier-invoice-create in the isolated fro347-frontend checkout. Commit ac539a93f3e3884b70de5e57dfc83563aa2346db — feat(FRO-347): prepare supplier invoice create UI. Exact seven frontend paths/1015insertions; postcommit verified correct branch, parentbase, approvedpatchmatch, cleanworkingtree, no upstream and whitespacechecks. No source changes or repeated tests/build; prior171-test/build evidence applies to identical reviewed content.
- Updated drafts/fro347-frontend-handoff.md with local commit ownership/status. Partial unconnected scope, missing entity/API/authority/recovery/regime/controller contracts, baseline dependency/type/format limits, required branch enforcement and deferred coverage minor remain. No Linear, PR, backend or deployment action. No push to any repository this turn; planning checkpoint retained locally under explicit push deferral. Preserve unrelated326/330 changes.

### 2026-10-23 — FRO-348 approved revision saved and verified

- User explicitly approved writing the exact reviewed revision while keeping metadata unchanged. Mandatory planning pull succeeded. Read the current full issue before saving the approved description from drafts/fro348-details-page-review.md, retaining the complete label set.
- Independent re-read matches the approved description after Linear's formatting normalization only. Linear automatically added FRO-303 as related from a mention; removed only that save-induced relation under the user's metadata-preservation instruction, then independently re-read again. Final metadata matches the before snapshot: title, Todo, supplier invoice/Pending_Review/Frontend/Story labels, priority, project/milestone, exact blockers/related issues, existing preview attachment and other returned metadata unchanged. Explicit read confirms unassigned, no delegate/estimate/parent/cycle/due date.
- Verified saved issue https://linear.app/front-line-ltd/issue/FRO-348/supplier-invoice-details-page-ui at updatedAt 2026-10-23T11:23:44.164Z. Description includes selected A and all approved guarded editing, cancellation and draft/recovery decisions. No Ready promotion, production code/database write, UI branch or publication authorization. Preserve unrelated FRO-326/FRO-330 changes; synchronize this entry only.

### 2026-10-23 — FRO-347 partial frontend prepared; verified diff, integration/publication blocked

- User approved native plan execution and explicitly completed the separate implementation-model checkpoint. Planning pull succeeded; current FRO-347 re-read unchanged at 2026-10-23T10:40:30.688Z, Todo with supplier invoice/Pending_Review/Frontend/Story, relations and attachment retained. No Linear writes.
- Resumed policy snapshot committed at production main3820e89e8caa341261e2d48bcb282d93e1bb1d03, fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Isolated fro347-frontend remains detached/branchless, with only seven new frontend files under supplier-invoices. No production commits/pushes/PR/deployment.
- Prepared actual Card/TopBar/Tabs comfortable layout, controlled labelled-field slots, localized document queue and unknown/confirmed result presentation. Caller owns source values, exact decimals, bytes and operations. No form controller, route, auth/service/wire model/backend implementation. Complete patch drafts/fro347-frontend-preparation.patch:7files1015insertions, SHA25634621bb5f156cdc14fd3fce339b3c13a46bc9945a97e780615f6213642b06e16. Full handoff drafts/fro347-frontend-handoff.md; five screenshots in drafts/fro347-evidence/.
- Verified eight behavioral RED assertions before implementation, then focused8/8 and final full41files171tests PASS; build PASS2.71s; seven-file Prettier/whitespace/reverse-apply checks PASS. Node22.13.0. npmci fails existing manifest/lock mismatch; local npm install --package-lock=false preserved both. Only existing two TS2352 casts at delivery-note-service.test.ts77/81; stable committed-base formatting270files (initial concurrent-build count269 corrected). No codegen/lint applicable.
- Local actual-component browser harness outside production diff verified desktop/1100/400, EN/EL, exact-text/tab/locale retention, field order, long Greek/nooverflow, suppliedloading/error/empty and unknown/saved/partial-file presentation, keyboardfocus and fixture callbackkeys/owner. Final fresh console0errors/warnings. Temporary tabs closed/viewport reset; no live portal/database action.
- Fresh independent review: no Critical/Important findings within approved partial scope. Deferred minor: composed retained-File-byte/saved-owner regression test would strengthen existing separate assertions. Real persistence/recovery/authorization and navigation remain excluded, not claimed verified. Rulings preserve user-required uncommitted branchless handoff; excluded mechanisms remain blocked to avoid data-loss/duplicate/access risk.
- FRO321 entity/authority/exact transport/create/attempt/file ownership/recovery and FRO356 explicit regime remain absent. Search Supplier/Client semantics and scoped reference options need delivered contracts; later FRO319 note integration remains staged. Actual useAppForm/controller/draft guards/source lookup/upload recovery/FRO349 navigation remain unimplemented. Main refreshed unchanged; maintain/pushtrue adminfalse, rulesets403 means branch restriction unverified. Proposed mock/fro-347-supplier-invoice-create NOT created; no publication approval requested while blockers remain. FRO326's exception does not transfer.
- Planning evidence/memory/plan only synchronized; preserve unrelated326/330/348 work. No glossary/ADR change. Next: resolve dependency/controller and publication prerequisites, then review the actual final diff at the separate branch/commit/push gate.

### 2026-10-23 — FRO-348 selected A published; full ticket draft awaiting approval

- User selected A — Comfortable cards. Planning pull succeeded; target re-read unchanged at 2026-10-20T11:09:43.582Z. Refreshed FRO-321/347/326/319/317/356 and current labels/statuses. FRO-347 now has approved comfortable design/new specification; consume it rather than its previous pending-review snapshot. Production main remains 3820e89e8caa341261e2d48bcb282d93e1bb1d03.
- Promoted A to existing owner-private Site root; preserved canvas comparison and previous preview at baseline-v20.html, with original source content unchanged apart from Git line-ending normalization. Added selected desktop direction-a.jpg and Greek 400px greek-mobile-review.jpg. Matched current Greek initial-status wording, one-column Entry Note width, saved-status separation and correction consequence/focus behavior.
- Verified selected-root initialization, both inline script syntax checks, baseline preservation, guarded Order correction review and dependent save with saved VAT unchanged until success, retained ID, post-save focus and clean fresh console; selected desktop and Greek 400px artboards captured with no page overflow. Earlier unchanged interaction/state checks remain applicable. Prototype only; no claim of delivered entity/API/backend/portal functionality.
- Site source ee0417735336cd39f672e287dafa1b2def2a319e committed/pushed and packaged through source helper. Native private deployment appgdep_6adb3d8047648191a4b1394133152016 succeeded, saved version appgprj_6ad0ae445fdc81919d8996215708f533~appgver_a73d5e484a4881918dd44b83226db313. Root https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site ; identity/audience retained. No credentials persisted.
- Complete standalone replacement description: drafts/fro348-details-page-review.md. Includes accepted full guarded card editing/atomic Order-dependent correction, cancellation, drafts/warnings/recovery, staged integration, source lookups, event chronology/guards, exact validation, staff-only documents/access, source preservation, acceptance and read-only verification. Independent builder check found no material unanswered decision. Proposed write preserves title, Todo, full supplier invoice/Pending_Review/Frontend/Story labels, unassigned state, priority, project/milestone 0.0.6, exact relations and existing attachment.
- Show full draft, metadata and before/after/consumer review in chat, then await exact-text approval before any Linear mutation. A selection is design approval only; no Ready promotion. Production repository remains read-only; no branch or deployment verification. No new glossary term/ADR. Preserve unrelated FRO-326/FRO-330 changes; synchronize only this task's planning files and memory entry.

### 2026-10-23 — FRO-347 step 4e preparation authorized; presentation plan awaiting agreement

- User explicitly authorized preparing frontend/UI changes and checking dependencies, with verified diff/blockers before creating or pushing a branch. No production commit/push/PR/deployment authorized. Planning pull succeeded; current saved issue reread unchanged at 2026-10-23T10:40:30.688Z.
- Created clean isolated detached checkout at C:/Users/Giorgos/.codex/visualizations/2026/10/23/01a16833-e860-7a01-98a1-e7bbe7859984/fro347-frontend, verified github=https://github.com/Frontline-Forwarding/frontline-forwarding.git, fetched main3820e89e8caa341261e2d48bcb282d93e1bb1d03. No branch refs or application changes. Native worktree tool is bound to this planning repository; separate production checkout preserves existing work.
- Loaded FRO-347 playbook successfully (UTF-8), committed policy at3820e89, SHA256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Preserve snapshot with resume. User explicitly completed planning-model checkpoint; plan agreement/execution choice and separate implementation-model checkpoint remain pending.
- Current-source dependency audit confirms absent invoice entity/API/authority/route, explicit Order regime, Entry Note and invoice file ownership/recovery. PO search omits Supplier/Client names; paged first-100 filtering is insufficient. PO money uses GraphQL Float/Number and cannot supply exact invoice decimal transport. Country currency reference and authorized company vessels exist, but invoice scope access is not supplied. Existing attachment panel requires persisted PO/Shipment owner and wrong fallback permission for a new owner.
- gh identity has maintain/push, admin=false. Rulesets API403 says plan upgrade required; required restricted write enforcement remains unverified. Publication blocked, local preparation allowed. No permission/protection changes; no exception from FRO-326 transfers here.
- Wrote docs/superpowers/plans/2026-10-23-fro347-frontend-preparation.md: recommended native preparation of controlled layout, Documents queue presentation, unknown/saved result panels, EN/EL and meaningful UI tests/docs. All future production diff paths client-only. No invented contracts/domain computations/routes/auth/generated files or shipped fixtures. Actual app integration stays blocked and acceptance incomplete. Source tree still clean; no dependency installation, source edits or tests/build executed yet. Intent inventory returned no intent-enabled packages before install. No documented Version/Sync command found; use existing dependency preparation and conditional codegen after checkpoints.
- Await plan agreement; then separate implementation-model Continue before execution. Preserve unrelated FRO-326/FRO-330 changes and synchronize only this plan/checkpoint. No Linear/Site change, new vocabulary or ADR.

### 2026-10-23 — FRO-348 design alternatives published; direction choice pending

- User explicitly accepted guarded cancellation on Details and retained drafts across tabs/language with navigation/unload warnings and failure/unknown-outcome recovery. All three initial interview decisions are accepted; user requested the design alternatives.
- Planning pull succeeded; FRO-348 re-read unchanged at 2026-10-20T11:09:43.582Z. Production main still 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Corrected earlier review note: actual AppShell has horizontal desktop navigation and mobile drawer; preserve that source pattern.
- Reused owner-only Site appgprj_6ad0ae445fdc81919d8996215708f533. Added one self-contained dist/canvas.html; existing index.html and other source unchanged. Canvas compares current preview with A comfortable saved-value cards (recommended, closest to FRO-326) and B compact plain Facts. Both use live light theme/density/controls and same business rules, EN/EL, New component markers, business notes/component map and fixture switches. New entity/API remains unimplemented; all mutations are browser-local demonstrations.
- Browser QA covered desktop/400px, Greek wrapping without page overflow, draft retention across tabs/language, dirty navigation, failed/unknown saves, disabled storage-option focus/Enter/Escape, exact maximum money, guarded cancellation preserving values, date lower/upper bounds, dispatch/return/onward sending and original-attempt resolution, view-only controls, Not required, loading/error/retry/empty/missing/denied and Entry lookup recovery. Fresh QA tab had zero error/warning logs; 11 local page/style/script/font requests returned 200. JavaScript syntax passed. This is prototype verification, not backend or portal-deployment verification.
- Site source helper committed/pushed exact source 282c6ce530464148a71f795aef4306e8cc7dcc06 and packaged it. Native private deployment appgdep_6adb3a0d95d48191ac444fa524febc68 succeeded; saved version appgprj_6ad0ae445fdc81919d8996215708f533~appgver_e5468571bf308191b37e54a93a5cc6a4. Existing identity/audience retained. Comparison URL: https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site/canvas.html . Original preview remains at root. Hosted browser access may require owner sign-in; native publication succeeded and local QA passed.
- Review: drafts/fro348-review-findings.md. Screenshot in visualization workspace: fro348-comparison.jpg. Await A/B selection or design edits, then refine selected preview, reconcile standalone ticket and obtain exact-text approval before Linear write. No Linear mutation, production source/branch/database changes, real migration or ADR/glossary changes. Synchronize only this task's planning changes; preserve unrelated local FRO-326/FRO-330 work. Concurrent FRO-347 review is now completed separately; refresh that current issue before drafting FRO-348, rather than reuse its earlier pending-review snapshot.

### 2026-10-23 — FRO-347 previous Create-page reference corrected

- User explicitly requested replacing the historical-preview reference with their previous Create-page UI. Planning pull succeeded; fetched current complete issue and applied only the exact reference replacement. Updated link label: Previous Create-page UI (version 28); URL: https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site/baseline-v28.html . The updated Create preview remains alongside it.
- Independent reread confirms the complete description equals the prior saved description with only that link/label replacement; labels, Todo, relations and attachment preserved. Saved updatedAt: 2026-10-23T10:40:30.688Z. Updated the local draft to match. Reference-only correction needs no business consumer trace or new canvas. No Site/production/linked-ticket changes. Preserve unrelated local changes.

### 2026-10-23 — FRO-347 approved revision saved and verified

- User explicitly approved writing the complete displayed revision. Planning pull succeeded; refreshed full target was unchanged since review. Saved drafts/fro347-create-page-review.md as the description and re-passed all four existing labels.
- Independent reread confirms the approved description after Linear issue-mention/link/list-format normalization. Title, Todo, supplier invoice/Pending_Review/Frontend/Story, unassigned state, priority, project/milestone 0.0.6, complete relations and preview attachment remain unchanged. No automatic relation additions occurred. Saved updatedAt: 2026-10-23T10:34:18.919Z.
- Review/edit is complete. The selected comfortable private preview remains published as version 30; no new Site changes this turn. No Ready promotion, linked-ticket edits, production code/branch/database writes or production-deployment verification. Backend and later integration dependencies remain explicit. Planning synchronization includes only this completion entry; unrelated FRO-326/FRO-330 working changes are preserved.

### 2026-10-23 — FRO-347 comfortable preview published; complete ticket draft awaiting approval

- User accepted Q3/Q4: explicit standalone saved-result screen and Start another invoice; confirm dirty Cancel; preserve in-app drafts/file bytes with unload warning, without durable/reload-resilient storage. User selected A — Comfortable after the current/A/B comparison and live component mapping. Earlier Q2 fixed-status/no-progress/no-event-dates decision remains accepted.
- Planning pull succeeded; live main remains 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Refreshed FRO-347 remains unchanged at 2026-10-20T11:09:39.558Z, Todo, supplier invoice/Pending_Review/Frontend/Story, unassigned, milestone 0.0.6, existing attachment and relations preserved. No Linear mutation.
- Same owner-private Site appgprj_6ad097ec3e688191b589d484c63f22dc published successfully: comparison v29 at source dd6c16dd041fbd11309b151bf4b25977d9346445; selected main preview v30 at 1454cc26f029638b4c2ea59d6aa5cac28868ac0c. URL https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site ; comparison /design-review.html. Audience remains owner-only custom, policy revision 1, no external visitors. Credential values were not saved.
- Prototype uses production typography/tokens/control/card styles, agreed card/field order, fixed initial VAT status, exact decimal strings, normalized duplicates, independent optional vessel, note-availability states, file queue, explicit results and recovery demonstrations. It is fictional browser-local data and not production integration. Root uses selected A; baseline-v28.html retains prior screen. Source is in this chat visualization workspace. New compositions and source mapping are documented on the canvas.
- Verification: syntax/whitespace and static link/asset checks; desktop/Greek 400px rendering; unavailable-type focus/Enter/Escape; trimmed cancelled duplicate; exact maximum amount retained through tabs; storage Order confirmation/blank company/unavailable note; saved and partial/unknown recovery; same-owner file retry; dirty Cancel keep/discard; rejection URL. Fresh standalone candidate and final static comparison console checks had no errors/warnings. Browser iframe wrappers caused an instrumentation MutationObserver error; replaced comparison embeds with captured artboards and interactive links. Local QA server uses 127.0.0.1:8767; stop the owned server when ending work.
- Independent reviewer found Order-results Escape reopening, calendar Escape losing edits and rejected-state URL initialization. All corrected and browser paths rechecked. Review found no material standalone-spec contradiction. Complete proposed description saved at drafts/fro347-create-page-review.md; exact-text approval required before Linear write. Preserve current metadata/relations; no Ready promotion. No production code/branch/database changes or deployment verification. No new vocabulary or qualifying ADR. Preserve unrelated FRO-326/FRO-330 working changes.

### 2026-10-23 — FRO-348 review; editing accepted, remaining decisions pending

- Planning pull succeeded; fetched full current FRO-348, empty comments, FRO labels/statuses and live FRO-321/347/326/317/352/356/319. FRO-348 remains Todo, supplier invoice/Pending_Review/Frontend/Story, milestone 0.0.6, original attachment/relations; no Linear mutation.
- User explicitly substitutes ChatGPT Sites for Cloudflare Pages. Existing private owner-only Site appgprj_6ad0ae445fdc81919d8996215708f533, version 20, source b6311c73de903f4666a99672391ee00e20b41f17 retrieved in this chat's visualization workspace; original URL/audience preserved. Local baseline inspected; no Site edit/publication. No credentials persisted.
- Authenticated gh source reads confirm production main 3820e89e8caa341261e2d48bcb282d93e1bb1d03 and missing Supplier Invoice entity/API/route/attachment owner. Current Order invoice rows, partner access and Order/Shipment files are distinct. FRO-321 supplies proposed contracts and staged 0.0.6 basic / later Export and Entry Note delivery.
- User accepted Q1: full guarded card editing of Order and applicable invoice facts, one active editor, atomic dependent Order/type/value/vessel correction. Q2 guarded cancellation UI ownership and Q3 draft/navigation/unknown-save recovery presentation remain unanswered. Recommendations are not decisions.
- Review and component map: drafts/fro348-review-findings.md. Gaps include scope/edit contradiction, missing staged integration states, event date boundaries, prototype view-only/cancelled action holes, Number precision/duplicate normalization/vessel validation, retry/concurrency, unsupported note replacement simulation and stale styling/revision narration. Live design requires sentence-case labels/20px title/shared controls/AppShell; saved-value/progress/type-tooltip compositions must be marked honestly.
- Interactive step 1 remains open; no canvas alternatives built, selected design, full replacement ticket, Linear approval/write, production branch/code/database changes or deployment verification. Preserve unrelated local FRO-326/FRO-330 changes; synchronize only this review's notes.

### 2026-10-23 — FRO-347 workflow review; first UI decisions pending

- Mandatory planning pull succeeded. Read current FRO-347 (2026-10-20T11:09:39.558Z), empty comments, current FRO labels/statuses and linked FRO-321/335/348/349 contracts. Preserve Todo, supplier invoice/Pending_Review/Frontend/Story, milestone 0.0.6, attachment and relations; no Linear changes.
- Live production authenticated gh reads confirm main 3820e89e8caa341261e2d48bcb282d93e1bb1d03. New Supplier Invoice has no implemented entity/route/API/attachment owner. Existing Order invoice rows and Order/Shipment attachments are separate; consume FRO-321 dependency contracts rather than fabricate integration.
- Current FRO-321 fixes ordinary UD creation at Not started with no event dates, staged basic capture before Export/Entry Note integrations, exact decimals/date/duplicate/vessel validation and original-attempt/upload recovery. FRO-349 now consumes these and assigns shared recovery presentation to FRO-347. FRO-347 still contradicts these rules and cites older styling/revision history.
- User explicitly selected existing private ChatGPT Site instead of Cloudflare Pages, overriding the Pages requirement for this task after whoami showed broad OAuth rather than required Pages-only credentials. Reuse appgprj_6ad097ec3e688191b589d484c63f22dc, version 28, owner-only custom audience, existing URL. Source opened in this chat's visualization workspace at 3655072f6c26ae5c1de4d95223c9638021a710cb; no Site edits/publication. Do not persist credentials.
- User accepted Q2: retain VAT exemption card with read-only initial status; remove progress and all event-date controls. Q3 standalone result/dirty Cancel and Q4 in-app draft retention/unload warning remain pending. Earlier entity and FRO-349 decisions are not reopened. Next: complete interactive decisions, component mapping/current plus 2 alternatives, selected prototype/QA, complete standalone ticket draft and exact-text approval before Linear write.
- Preview source confirms automatic Order vessel copying, untrimmed duplicate comparison and Number conversion of money; these require alignment with FRO-321. Native Select cannot supply focusable disabled-option tooltip; identify a composed/extended existing combobox/tooltip. Pre-create file staging and recovery are new compositions. Local browser preview server not yet operational; no visual QA claimed. Production remains read-only; no branch or deployment verification. Preserve unrelated FRO-326/FRO-330 working changes.

### 2026-10-23 — FRO-349 approved revision saved and verified

- User approved the complete renewed draft with "ok". Mandatory planning pull succeeded; refreshed target remained unchanged before writing. Saved exactly the approved description and re-passed all five labels.
- Independent reread confirms description matches approved text after Linear mention/Markdown normalization; title, Todo, labels, project/milestone 0.0.6, priority, assignment and attachments preserved. Save auto-added relatedTo FRO-335/317/319/356; removed only these additions to restore the approved unchanged relation set. Final reread verifies original blockers/blocks/related issues and full description preserved.
- FRO-347 alignment remains separate and required before functional handoff; release-milestone mismatch remains flagged. No FRO-347 description change, new UI/preview, production branch/code/database write or deployment verification. Planning synchronization includes only this entry and preserves unrelated FRO-326 working changes.

### 2026-10-23 — FRO-349 renewed review after approved FRO-321 update

- Mandatory pull succeeded. Refetched full FRO-349/321/347/326/335, FRO-349 comments (none), current team statuses/labels. FRO-349 remains unchanged at 2026-10-20T11:09:46.986Z, Todo, milestone 0.0.6, five existing labels, no Linear mutation. FRO-321 now updated 2026-10-23T09:48:14.353Z; FRO-347 remains its older 20 October specification. Live production main reverified via authenticated gh at 3820e89e8caa341261e2d48bcb282d93e1bb1d03; prior inspected source evidence still applies.
- New material gaps: FRO-349 delegates status/date validation to FRO-347, whose editable advanced initial statuses and event dates contradict FRO-321 ordinary Not started/no-event creation. Consume staged basic 0.0.6 capture without waiting for later Export/Entry Note integration; distinguish integration unavailable from confirmed note absence. Consume FRO-321's original-attempt recovery/concurrency contract, trimmed case-sensitive duplicate key and staff-only indirect access; preserve optional Invoice company and no automatic Invoice vessel copying.
- Earlier five user decisions remain applicable: resume draft/files on return; explicit post-result return to origin; optional Invoice company; preserve blocking graph while flagging 0.0.6 -> 0.0.5 mismatch; shared recovery presentation owned by FRO-347. Do not repeat those questions or treat the previous unapproved draft as saved. Existing standalone-card, dirty Order draft, origin-versus-selected ID, exact presence refresh and verification gaps remain.
- User accepted scope: finish FRO-349 against approved FRO-321 and track FRO-347 alignment separately. Complete revised description prepared in chat for exact-text approval; no write yet. Require aligned shared form before functional handoff, ordinary initial statuses/blank event dates, phased integration states, full selection/vessel revalidation, FRO-321-backed recovery, prior navigation decisions and read-only acceptance checks. No linked-ticket edits authorized. No new glossary/ADR, UI, preview, production branch/code/database writes. Preserve unrelated FRO-326 working changes; sync only this review entry.

### 2026-10-23 — FRO-321 approved description saved and verified

- User approved the complete displayed draft with "ok". Planning pull succeeded; re-read target unchanged before saving drafts/fro321-supplier-invoice-rules.md. Re-passed full supplier invoice/Pending_Review labels.
- Independently re-read saved description: full content matches approved text after Linear issue-mention and Markdown/bold normalization. Verified title, Todo, labels, assignment, priority, project/milestone 0.0.6 and all three attachments unchanged.
- Description save automatically added relatedTo FRO-303/FRO-318. Removed only those additions to restore the expressly approved unchanged relation set; removal succeeded. Final reread confirms exact original relations. Final updatedAt 2026-10-23T09:48:14.353Z.
- FRO-321 write complete. FRO-347 advanced-creation/recovery alignment and FRO-317 non-UD Not required alignment remain separately scoped follow-up work; neither ticket changed. No UI/preview, production branch/code/database writes or deployment verification.
- Planning synchronization stages only this entry, preserving unrelated local FRO-326/FRO-330 changes.

### 2026-10-23 — FRO-321 decisions settled; full replacement draft awaiting approval

- User accepted Q5-Q11 in full: required nonfuture Invoice date; optional authorized Client-associated Invoice vessel, no automatic copying; missing Invoice company allowed for capture. Nonnegative exact money with two decimals and maximum 99,999,999,999,999,999.99, no silent rounding/conversion. Trim outer invoice-number whitespace and retain case-sensitive Supplier/number uniqueness including cancelled records.
- Accepted physical-event dates no later than Athens today; dispatch >= Invoice date, return >= dispatch, sending >= return; expiration >= Invoice date. Positive IE599 required at confirmation, not an invented physical-date lower bound. Compatible saved corrections only, preserve history/membership, consume FRO-303 without expanding Client/header edits. Resolve unknown creation outcomes; keep saved invoices on upload failure and retry failed files against same owner. Block Order cancellation while active invoices remain; no cascade, retained cancelled-invoice historical link.
- Earlier Q1-Q4 decisions remain: ordinary UD creation Not started; audited historical entry deferred; staged 0.0.6 capture/later integrations; new records/fixtures only; guarded invoice cancellation and no ordinary deletion/reactivation.
- Planning pull succeeded; re-read target unchanged and confirmed live main 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Applied frontline-linear-issues house style under project workflow precedence. Full standalone draft: drafts/fro321-supplier-invoice-rules.md. Spec/consumer check covers UI, Order corrections/cancellation/presence/splits, attachments/access, Export and Entry Note/report integration; all ownership explicit.
- Proposal preserves title, Todo, supplier invoice/Pending_Review, priority/project/milestone, assignment, existing relations and all three attachments. No promotion or added labels. Full text shown in chat for exact-text approval before any Linear write. FRO-347 advanced-create controls/recovery and FRO-317 Not required wording need separately scoped alignment; no linked edits authorized/performed.
- Canvas/preview skipped; existing UI owners retained. No production branch, code or database writes, no deployment verification. No new glossary term/ADR. Only own draft/memory staged; unrelated FRO-326/FRO-330 local changes preserved.

### 2026-10-23 — FRO-321 rollout and cancellation decisions accepted

- User accepted Q2-Q4: staged basic invoice delivery with later Export/Entry Note integrations; new records/fixtures only, no real legacy import; cancellation only for unassigned invoices without recorded stamping/sending events, retaining identity/files/history/duplicate protection, with no ordinary hard deletion or reactivation. Q1 remains ordinary UD creation at Not started, advanced historical entry separately audited. These decisions are not approval to write an unseen ticket.
- Planning pull succeeded; current FRO-321 unchanged (updated 2026-10-20T11:09:35.982Z). No Linear/UI/production changes. Existing skill and live-source findings retained.
- Next interview frontier: invoice date/vessel requiredness and vessel eligibility; monetary sign/precision/bounds; exact-number duplicate normalization; physical-event chronology; saved type/Order correction guards and existing company-correction ownership; post-create upload failure/unknown-result recovery; parent Order cancellation consistency. Recommendations will be shown in chat and remain unapproved.
- Preserve existing presentation owners FRO-347/348, separate linked-ticket approvals and metadata. No glossary change or ADR. Only this entry is staged; unrelated local memory/drafts remain untouched.

### 2026-10-23 — FRO-321 review; first decision round in progress

- Planning pull succeeded; live production gh access verified at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Applied embedded workflow with grilling/domain-modeling; fact-lookup subagent inspected backend read-only. Read current FRO-321/347/348/317/319/356/248/318/303/337, target comments (none), team labels/statuses. Shared Linear context tool unavailable; direct issue reads succeeded.
- FRO-321 currently Todo, supplier invoice/Pending_Review, milestone 0.0.6, three historical attachments. No Linear mutations. UI remains FRO-347/348; canvas/preview skipped and production branch explicitly excluded.
- Confirmed gaps: advanced creation needs completed Export membership but FRO-317 locks ordinary additions at Completed; 0.0.6 invoice delivery depends on Export 0.0.10 and Entry Note 0.0.11; FRO-317 retains obsolete non-UD Exempted status; FRO-321 register ownership references cancelled FRO-248 although FRO-319 now owns data contract. FRO-318 consumes cancellation/reassignment but invoice cancellation/reactivation rules are absent.
- User accepted Q1: ordinary creation starts Not started; advanced historical entry belongs to a separate audited reconciliation flow. FRO-347 requires separately reviewed alignment; no linked edit authorized. Q2 staged delivery versus integrated release, Q3 fixture-only versus real migration, and Q4 guarded cancellation versus deferred/broader lifecycle remain unanswered.
- Additional review work: required invoice date/vessel and eligibility, money precision/sign/bounds, event-date chronology, exact duplicate normalization, safe retries and separate attachment outcomes, explicit stale-save checks, staff-only access across reverse references/downloads, ordinary type-change guards versus recorded history. Do not present proposals as decisions.
- Live Order header edits stop at IN_STOCK and Client is preserved by update validator. Reuse FRO-303 for later Invoice company corrections; no generic Client correction exists. Attachment uploads are separate and require saved owners. Existing Order invoice rows/customs values and split-copy semantics are independent and must be preserved. FRO-348 removed Shipment/split presentation; FRO-317 owns Delivered vessel (FRO-321 still calls it Shipment-owned).
- Review/interview remains open. No complete replacement draft or write approval yet. No glossary change or ADR warranted. Preserve unrelated existing FRO-326/FRO-330 memory and draft changes; commit only this session's memory addition.

### 2026-10-23 — FRO-349 review decisions settled; revision awaiting approval

- Planning pull succeeded. Reviewed live FRO-349, FRO-326/335/347/321/318, target comments (none), and current team statuses/labels. FRO-349 remains Todo, milestone 0.0.6, supplier invoice/Order/Pending_Review/Frontend/Story, no attachments. Blocks FRO-326; blocked by FRO-321/FRO-347. No Linear write.
- Live gh source review at main 3820e89e8caa341261e2d48bcb282d93e1bb1d03 confirms no Supplier Invoice creation route/schema/authority; billing is fixture-only and Order invoice rows are separate. Existing attachments support Order/Shipment ownership. Dependency delivery must supply the real contracts; no fabricated route or permission.
- User accepted: Back/return resumes invoice draft/files; explicit new creation protects an existing draft. After saved result/upload outcomes, explicitly return to originating Order, identifying the actual selected Order when different. Missing Invoice company adds no eligibility restriction. Preserve FRO-349 -> FRO-326 dependency and flag 0.0.6 -> 0.0.5 scheduling mismatch without milestone changes. FRO-347 owns shared partial/unknown recovery; FRO-349 requires/tests it, with any FRO-347 edit separately reviewed.
- Revision must align action placement with current FRO-326 standalone card, consume its dirty-draft navigation guard, initialize full FRO-347 Order/type/note flow, preserve distinct origin/selected Order contexts, avoid resetting explicit reselection, distinguish rejected/unknown/persisted-with-upload-failure outcomes, and expand source/verification sections. No new design/preview; presentation remains FRO-326/FRO-347 with FRO-335 shared Documents patterns. No production branch or writes authorized/performed. No new glossary or ADR needed.
- Complete proposed FRO-349 description prepared in chat; exact-text approval pending. Metadata preserved, including Todo + Pending_Review; scheduling conflict and FRO-347 shared recovery contract remain dependency concerns. Linear agent-context tool advertised but unavailable; review used direct issues and live code. Existing unrelated FRO-326 working changes preserved.

### 2026-10-22 — FRO-335 planning checkpoint accepted; plan prepared

- User explicitly confirmed Continue with planning. Wrote docs/superpowers/plans/2026-10-22-fro335-ui-review.md using writing-plans. It separates production-based canvas selection, existing private Site update/QA/publication, exact-ticket approval/save, and conditional real frontend handoff. Native execution recommended; execution-method/plan agreement and separate implementation-model checkpoint remain pending.
- Plan preserves all four accepted decisions and existing Site privacy/identity, uses actual current comfortable density as baseline with compact alternative, identifies genuinely new compositions, and keeps all behavior/visual verification scoped. Full frontend integration remains blocked on absent dependency contracts; branch publication also blocked on unverified required ruleset enforcement. No production source edits, branch, Site edits/publication or Linear write yet.

### 2026-10-22 — FRO-335 first behavior decisions accepted; planning checkpoint pending

- User chose Q1: require each pending colli addition to Save or Cancel before Create (overriding the initial recommendation). Q2: allow removing every draft colli including the last. Q3: stay on saved-Order upload-result view with retry/explicit Continue to Details. Q4: frontend-only Result unknown recovery for ambiguous create/upload results; preserve draft/files and check records before retry, no new backend idempotency dependency.
- Further live FRO-329/334/295/294/332 reads confirm dependency-owned retirement/current-form delivery. Current main still lacks initial-state, Unit price, split Notes, Pickup, regime/capabilities and new flags; agent validation remains active. Full working FRO-335 integration cannot be claimed from a frontend-only branch today. Prototype may simulate target; real branch cannot manufacture inputs, drop values or use create-then-transition workaround.
- Updated drafts/fro335-review-findings.md with decisions and integration boundary. Planning model checkpoint requested using the production playbook's explicit pause; awaiting Continue. No implementation plan, Site edits/publication, Linear writes or production branch/source changes yet. Prior branch ruleset publication constraint remains unresolved.

### 2026-10-22 — FRO-335 review and Sites/branch scope; first decision round pending

- User requests full workflow review and production-design-system UI alignment. Explicitly replaced Cloudflare Pages with ChatGPT Sites and requested continuing to frontend/UI branch work. Preserve final ticket and verified-diff approval gates; no PR/merge authorized.
- Planning pull succeeded. Current FRO-335 unchanged at 2026-10-21T11:48:51.896Z, Todo, Order/Pending_Review/Frontend/Story, milestone 0.0.5, one preview attachment, no comments. Read live FRO-326/333/336/356/297/337/292, current labels/statuses and source. No Linear edits.
- Production checkout HEAD 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Initial playbook output encoding failed; UTF-8 resume successfully preserved snapshot: committed, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Separate production planning/implementation model checkpoints remain pending. Isolated temp checkout remains detached and application source unchanged.
- Existing private FRO-335 Site appgprj_6acca09bd25081918eda0fa6bb3b5936, version 23, source f013e38d5c33371a836599090b94786f3f57cd11 retrieved into this chat's visualization workspace. No Site edit/publication. Preserve audience and current URL. No credentials recorded.
- Review evidence/component mapping and remaining work are in drafts/fro335-review-findings.md. Confirmed obsolete unresolved Pickup/default language, resolved no-default regime rule, conflicting seven-step success presentation, old-preview styling versus live components, incomplete verification sections, pending colli/Create ambiguity, last-row removal contradiction and create/upload uncertain-result recovery gap. Backend create/upload are not idempotent; do not promise duplicate-safe retry through UI disable alone.
- Q1–Q3 asked via clickable options, no answers yet: recommend validate/include all visible colli rows on Create; allow final unsaved colli removal; retain saved-Order upload-result view for retry or explicit continue. Recommendations are not decisions. Uncertain retry/backend ownership remains to discuss. No new glossary term or ADR.
- GitHub push permission is true, but rulesets endpoint returned HTTP 403 (plan upgrade required). Required branch-restriction enforcement cannot be verified; publication blocked under step 4e pending resolution. Do not alter repository settings or treat generic branch request as approval of an unseen diff. Review/design/local preparation may continue.

### 2026-10-22 — FRO-292 approved description saved and verified

- User approved the complete displayed draft with "ok". Pulled planning repository successfully, read unchanged target, saved drafts/fro292-internal-external-notes.md to FRO-292, then independently re-read the saved issue.
- Verified complete approved description after Linear Markdown/link/issue-mention normalization, unchanged title, Todo, complete Ready/Shipment/Order label set, Chris assignment, priority, project/milestone 0.0.3, attachments and exact relations. Saved updatedAt: 2026-10-22T09:11:01.742Z. No linked-ticket edits or status promotion.
- Review/edit complete. All agreed backend, visibility, PDF, split, lifecycle, migration and safe-update requirements are in the ticket. UI remains owned by the four redesigns; customer-page presentation is separate future work. No new UI/preview, production branch, production changes or deployment verification.

### 2026-10-22 — FRO-292 decisions settled; complete revised draft awaiting approval

- User replied "ok" to the remaining customer boundary: deliver customer API filtering now; customer-page placement is separate future work. All earlier accepted decisions remain in force.
- Pulled planning repository (up to date), re-read unchanged FRO-292 and refreshed live production SHA/schema evidence through gh: 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Prepared complete standalone draft at drafts/fro292-internal-external-notes.md, covering visibility, lifecycle, atomic creation, independent partial updates/clears, stale-edit protection and legacy compatibility, migration, both split paths, PDF output, UI ownership, acceptance and read-only verification.
- Draft proposal preserves existing title, Todo, Ready/Shipment/Order, Chris, priority, project/milestone and exact relations/attachments. No label additions or Ready transition. Full text must be approved before any Linear save; the user's "ok" settled the open behavior question and did not approve an unseen full description.
- Canvas/preview skipped because all presentation is owned by FRO-335/FRO-326/FRO-341/FRO-316. No production branch or production changes. No new glossary vocabulary or qualifying ADR. Review preparation complete; Linear write and saved-issue verification pending approval.

### 2026-10-22 — FRO-292 review and decisions; customer UI boundary pending

- Planning pull succeeded. Read current FRO-292 (updated 2026-10-20T11:09:11.339Z), comments (none), FRO-335/FRO-326/FRO-316/FRO-341/FRO-344 and current labels/statuses. Shared Linear notes endpoint returned tool-not-found; direct reads worked. Current target: Todo, Ready/Shipment/Order, Chris, No priority, Pre-releases 0.0.x milestone 0.0.3, no attachments; blocks all four redesigns, related FRO-344. No Linear changes.
- Live production source traced read-only through gh at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Order notes appear in summary/detail and StockListPdfModelFactory; both manual and Shipment partial-selection splits copy parent notes. Shipment currently has no entity notes field/create parameter/update operation and is internal-only. Supplier/agent readers exist for Orders. Existing Order header update allows PENDING/EXPECTED_READINESS/READY/IN_STOCK; omission/null clears notes, and its freshly read server version does not protect against stale browser drafts. Existing Order notes limit is 2,000; blank normalizes to null. HEADER_UPDATED currently carries no note text; MCP Order summary omits notes.
- User accepted backend/storage/create-update contracts in 0.0.3, with presentation delivered by the four existing redesigns (Order 0.0.5; Shipment 0.0.9). No new canvas/preview or production branch. FRO-292 should reference creation ownership as well as details and remove obsolete claims that linked specifications still require a single Notes field.
- User accepted: all already-authorized partner Order readers receive External Notes only; Internal Notes restricted to authorized Frontline/system users; no new Shipment access. Stock-list PDF prints External Notes only, with no Internal fallback. Both split paths copy both fields once into independent child values. Preserve current Order edit guards; allow authorized Shipment notes-only edits in all statuses without readiness/movement/history changes. Each field uses the 2,000-character plain-text/blank normalization rule, internal line breaks preserved, independent clearing, and no silent stale overwrite. Preserve existing notes as Internal Notes and start External Notes empty, including when current data is demo data.
- Still pending Q2: customer API visibility now with customer-page placement deferred to separate future work (recommended), versus requiring customer UI in this ticket. Do not infer approval from unanswered question. Full revised description and Linear-write approval remain pending. Need explicit create atomicity, omitted-field preservation versus clear, stale-edit protection, shared adapter filtering including summaries/audit/PDF, legacy notes compatibility and criterion-specific read-only post-deployment checks in final draft. Separate mutation tests from production read-only verification.
- No new glossary term or qualifying ADR. Production repository was inspected remotely for this planning review, not modified or run as a local implementation task. No deployment verification claimed.

### 2026-10-22 — FRO-334 approved description saved and verified

- User approved the complete proposed description with "ok". Pulled planning repository successfully, re-read unchanged FRO-334, saved drafts/fro334-collection-agent-removal.md, and re-read the saved issue.
- Full description matches the approved text after Linear Markdown/link/issue-mention normalization. Verified unchanged title, Todo, complete Order/Pending_Review/Backend/Story labels, assignment, priority, project/milestone 0.0.3, attachments and exact relations. No Ready promotion or linked-ticket edits.
- Saved updatedAt: 2026-10-22T08:55:21.038Z. Ticket review/edit complete. No new UI/preview, production branch, production changes or deployment verification.

### 2026-10-22 — FRO-334 review decisions settled; revised draft awaiting approval

- Planning pull succeeded. Read current FRO-334, comments (none), linked FRO-335/FRO-326/FRO-333/FRO-329/FRO-290, current labels/statuses and live production source through gh at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Linear shared-notes endpoint returned tool-not-found; direct reads succeeded.
- User accepted retiring access granted solely by Order Collection agent, preserving independent authorization; mock-only assignment cleanup without archive/reassignment or real legacy deletion; minimal current Create/Edit/Details integration with backend in 0.0.3 rather than waiting for redesigns in 0.0.5.
- Confirmed participant scope exists in both PurchaseOrderAuthorizationService and PurchaseOrderRepository; downstream effects include list totals/groups, scoped lineage, colli current-membership tracking, Order attachments and stock-list PDF authorization. Preserve independent Shipment access and partner mutation restrictions. Greece remains separately stored/defaulted; remove only its agent dependency.
- Prepared complete standalone draft at drafts/fro334-collection-agent-removal.md with both split paths, cross-adapter/generated-client removal, compatibility, consumer ownership and read-only verification matrix. Full draft requires approval before any Linear write.
- Current target unchanged at 2026-10-20T11:09:00.972Z: Todo, Order/Pending_Review/Backend/Story, unassigned, No priority, Pre-releases 0.0.x / 0.0.3, no attachments; blocks FRO-335/FRO-326, related FRO-290/FRO-333/FRO-329. Preserve metadata; no Ready promotion proposed.
- Canvas/preview skipped because linked redesign contracts suffice. Production branch excluded by user; no production changes or deployment verification. Existing vocabulary suffices; no new glossary term or qualifying architectural trade-off identified. Review occurred from the planning workspace via remote source reads, not a production checkout/playbook execution.

Extracted 2026-10-21 from `FrontLine backup 14-09-2026/Linear/MEMORY.md` in the previous workspace. Source history runs through 2026-10-20. This is a curated handoff for a standalone Linear project, not a live board export. The original memory is preserved.

Scope: Linear issues, ticket-writing/review workflow, requirements, decisions and unresolved questions. Preview implementation logs, deployment commands, credentials, source commits, local servers, PDF production and unrelated email/data-processing work are omitted. This file is self-contained; the original folder's documents and preview source files have not been copied.

## Working principles

- The board is the handoff. A developer must be able to build from the ticket without conversation context. Treat ambiguity, gaps and contradictions as defects.
- Never invent domain facts, dropdown values, status rules, permissions, template contents or schema. Distinguish confirmed decisions, proposals, implementation evidence and unresolved questions.
- When local notes contradict the current request, resolve the conflict before drafting dependent requirements. An inherited open thread is not an approved decision.
- Fetch the current issue before editing. Compare its description and updated time with memory: colleagues sometimes edit silently without comments. Do not repeat findings already fixed.
- Deletions are decisions. Do not restore deliberately removed scope or re-raise accepted residuals after a user closes a review.
- Preserve Greek domain terms with an English gloss where useful. Rough Greek brain-dumps are normal input.
- Historical participants include Dimitris Kakep/Kakepakis and Grigoris Lamprou as ticket authors, and Chris as a developer/assignee. These historical names do not establish the current chat user's identity or authorize assigning an issue.
- July's Linear-only mandate restricted context to the folder, Linear, conversation and memory. Later sessions explicitly authorized production/repository reads. For this dedicated project, start with Linear and its local context; use outside implementation sources when the current request authorizes them. Never mistake an old repository snapshot for current deployed behavior.

## Ticket workflow and house style

- Existing-ticket edits must produce a complete standalone final specification. Keep ticket revision history, previous-version defects, superseded proposals and review-process narration out of the description. Put any required before/after comparison in chat only. Retain real migration/historical-data requirements and necessary implementation context; remove repetition without losing agreed behavior.

1. Read the target issue, linked dependencies, relevant decisions and current board metadata. Search for an existing feature ticket before creating another.
2. Clarify the business behavior and ownership. For interactive grilling, the recorded preference is Greek clickable choices with the recommended option first, labelled “(Προτείνεται)”. Do not turn a simple authorized edit into an unnecessary discovery workshop.
3. Where UI is in scope, resolve the design and keep it consistent with the ticket. Use the current production portal as the reference when inspection is authorized; the old portal design document was misleading. UI work is not mandatory when the user explicitly requests ticket text only.
4. Check the specification: ownership, relationships, requiredness, validation, lifecycle, permissions, migration/history, concurrency, failure states and cross-ticket dependencies as applicable. Do not assume that a new UI needs no backend work without evidence.
5. Prepare the complete reviewable draft before any approval required by the applicable workflow. Historical new-ticket sessions used full-body approval, then created the issue. Existing explicit authorization to make an edit remains valid; do not ask again for the same action.
6. Apply the approved change, re-read the full saved description and verify metadata, relations and attachments. Record decisions and remaining uncertainty in memory.

The mandatory end-to-end ticket workflow is embedded in AGENTS.md. Follow it directly; loading the external frontline-ticket-flow skill is no longer required. Continue to load its required supporting skills, including frontline-linear-issues for issue structure. Historical session entries below describe the workflow used at the time.

- Entity-spec archetype: “Defines the **Entity**…” → typed Fields tables → child entities named after actual actions/buttons → Dropdown menus with real option lists → list actions. FRO-238 and FRO-240 were the original examples.
- Feature tickets should explain the outcome and behavior rather than force an entity template. Include acceptance criteria, decisions, relevant context for agents and post-deployment verification where useful.
- Feature tickets own data and behavior; redesign tickets own the complete screen presentation. Link a redesign to the existing feature requirement instead of duplicating ownership.
- Blocking relations concern delivered functionality, not the ability to make fictional UI designs. Backend work may proceed independently where the ticket says so.
- Group related field removals instead of automatically creating a ticket for every field.
- Avoid process-only “validate with person X” Reference footers that the user repeatedly removed. Retain useful references to actual external sources.
- Template storage/format/content is a standing accepted residual in older printing reviews. Do not proactively reopen it unless the developer or user asks.

## Safe Linear editing and board conventions

- Prefer targeted description changes over wholesale replacements. Read the entire result: adding a new decision row can leave an older contradictory row above it.
- Preserve existing title, labels, state, priority, assignee, project, relations and attachments unless the requested change includes them. Some save operations can replace a label set; fetch and preserve the complete set.
- Verify dependency direction. “A blocks B” must not accidentally become “B blocks A”.
- Linear normalizes links, bullets and spacing. Verify semantic content after normalization. If inline screenshot markup disappears, verify an explicit attachment retains the approved evidence.
- Preserve existing embedded templates and attachment identities. Older sessions found signed embed URLs needed careful handling on resend; do not blindly rewrite or remove them.
- Historical review convention: Backlog + `Pending_Review` = drafted; Todo + `Ready` = approved. `Edited` denotes changes after review; `Business_Input` denotes missing business answers. A Ready label alone does not prove a complete specification.
- Label conventions varied: some waves used only `Pending_Review`; later tickets also used Story/Epic, Frontend/Backend and domain labels. Follow the explicit request and current board, not a blanket historical rule.
- The old FRO-5…FRO-227 epic/story board and its Portal Rebuild/Helper Rebuild milestone structure were archived in June. Old board-reference documents and saved project IDs are stale. October creation sessions found no available Portal Rebuild project and created team-level FRO issues without a project. Recheck live metadata rather than reusing stale IDs.
- Do not infer today's statuses from this file. The source records issues through at least FRO-356, not only the early FRO-229…254 wave.

## Issue map

These are contextual descriptions, not guaranteed current titles or states. Fetch by identifier before working.

| Issues | Role / remembered scope |
| --- | --- |
| FRO-229–234 | Companies and company subtypes; invoicing companies exist for every client, with per-vessel narrowing where applicable. |
| FRO-235–237 | Users, Authorities, Audit Log. Early Ready/Done stubs were not necessarily complete specs. |
| FRO-238 / FRO-240 | Original Order / Shipment entity specs. Order = purchase order = stock-list item in historical vocabulary. |
| FRO-241 | Original VAT Exclude Item/supplier-invoice requirements; later invoice and Export tickets refine ownership. |
| FRO-242 / FRO-243 | Reminder functionality / Admin functionality. |
| FRO-244 | Historical Invoice List; its identity must not be used to infer Front Line-issued client-invoice rules. |
| FRO-246 / FRO-247 | Entry Notes / Delivery Notes in the earlier board. Check newer customs-note specs before reusing old terminology. |
| FRO-248 / FRO-319 | Customs notes and later structural Entry-note requirements; FRO-319 is the structural owner for current admission-note behavior. |
| FRO-249 / FRO-250 / FRO-253 / FRO-254 | Packaging Logic / Sentry–Linear integration / Tagging / Stock List table filtering. Historical drafts or incomplete scopes require fresh reads. |
| FRO-292 | Independent Internal Notes and External Notes for each Order and Shipment. |
| FRO-310 | Historical AWB-on-Order proposal; do not duplicate Shipment's existing transport-document field. |
| FRO-311 / FRO-312 | Historical VAT bulk edit / VAT Exemption Protocol. Reconcile with later Export ownership before reuse. |
| FRO-313 / FRO-314 | Order view actions redesign / move Correct PO status. FRO-314 blocked FRO-313; later FRO-326 overlaps presentation. |
| FRO-315 / FRO-317 | Canceled embedded Shipment-customs approach / selected separate Export Customs Declaration specification. |
| FRO-316 | Shipment details redesign and physical Order/package presentation. |
| FRO-318 | Show supplier-invoice presence on each Order; historical relations to FRO-241, FRO-238 and FRO-317. |
| FRO-320 | Warehouse-transfer simplification. |
| FRO-321 | Supplier-invoice structural behavior, including Order-first type eligibility and Entry-note lookup. |
| FRO-323 | Select available collis from arrived Shipments when creating a Shipment. |
| FRO-324 | Record an already-arrived warehouse Shipment without fabricating unknown dates. |
| FRO-325 | Separate Shipment creation, optional repacking and dispatch; final integration blocked by FRO-316. |
| FRO-326 / FRO-335 / FRO-336 | Order details redesign / Order creation UI / initial readiness-state behavior. |
| FRO-329 | Order field cleanup, subsequently revised to retain conditional ΑΛΚ under FRO-356. |
| FRO-339 / FRO-341 | Required Shipment origin/destination country and city / Shipment creation redesign. |
| FRO-342 / FRO-343 | Related creation work: Documents/tab integration / inline Order creation. Read live bodies for exact boundaries. |
| FRO-347 / FRO-348 | Supplier Invoice creation / details UI. |
| FRO-350 / FRO-352 | Export creation / details UI. |
| FRO-353 / FRO-354 / FRO-355 | Entry-note creation / details / Order entry point and covered-child access. |
| FRO-356 | Separate Order customs regime from physical warehouse and warehouse licences. |
| BRA-1 / BRA-4 | Historical Knowledge Chatbot / Braintrust prompt optimization ideas; inspect live tickets before continuing. |

## Current decision summaries to preserve

### Ownership: physical movement, customs and invoicing

- Shipment represents physical movement and its collis/packages, transport mode/document and physical destination. Export Customs Declaration is separate, with one Shipment and one legal client/AFM per Export; a Shipment can have multiple Exports.
- FRO-315 was canceled in favor of FRO-317 on 2026-09-24. The older FRO-312 standalone Protocol model is contradicted by later discovery; do not revive it without reconciliation.
- Export has distinct physical customs scope and explicitly declared invoice scope. Split remainder goods may travel and be declared under a later MRN while their original supplier invoice remains declared once in an earlier Export. Do not automatically duplicate invoices or Informative List rows.
- Export owns export MRN/date and protocol reference. Entry note owns entry MRN/date. Supplier invoice owns invoice facts. Keep these similarly named fields separate.
- The recorded FRO-317 protocol rule assigns a unique globally ascending number on successful creation, with Athens creation date; values are read-only and retained through edits. Allocation must handle retries atomically and never reuse numbers. Starting value and historical reconciliation remain open. Protocol is an internal reference, not evidence of a statutory gapless register.
- Client is the commercial group; Invoice-to/invoicing company is the legal company. Logistics may confirm/correct Order invoicing company from the physical supplier invoice. Unknown-company exceptions and cross-record reconciliation need explicit rules, not invented values.
- Delivery Notes use Shipment collis and warehouse-measured physical data, grouped by Order invoicing company; do not require Logistics to work through VAT-item package data.
- **2026-10-20 clarification:** Front Line-issued final client invoices follow the Client's invoicing instructions. Their recipients/allocation must not be automatically finalized from Shipment/Order supplier-invoice companies. Manual checking against invoicing instructions is mandatory; whether selection must always be fully manual, allocation mechanisms and approval roles remain undecided. This is distinct from supplier invoices and does not redefine FRO-244.

### Order customs regime and supplier invoices (19–20 October)

- FRO-356: one explicit regime per applicable Order, restricted to the warehouse's permitted regimes: Ελεύθερη Κυκλοφορία / Τελωνειακή Αποθήκευση / Τελωνειακή Αποταμίευση. Warehouse licences are background data, not the Order's regime.
- Greece = No clears/disables regime and ΑΛΚ; Greece = Yes requires an explicit supported regime. ΑΛΚ is optional for Αποταμίευση, may be added later, preserves leading zeros, and is digits-only text up to 50 characters. Do not invent automatic numbering or uniqueness. ΚΤΑ identifies legacy Αποθήκευση, not a generic VAT flag.
- FRO-356 blocks FRO-326/FRO-335 and was added as a blocker to FRO-319/FRO-321/FRO-347/FRO-348. FRO-321 also blocks FRO-347/FRO-348. Verify live relations before changing them.
- Selecting a Τελωνειακή Αποθήκευση Order automatically selects and locks storage invoice type, even before its Entry note exists. Other regimes have no invented automatic type mapping.
- Invoice references Order; current Entry note resolves through Order and its verified admission history. No copied invoice-owned note pointer or invoice resave is required after late note creation or valid lookup refresh.
- A non-storage Order still shows the storage type as unavailable. Latest decision: hover/focus explanation, no persistent helper paragraph or extra Open Order link. Disabled selection must not change the draft. This supersedes the earlier inline-helper/link design.
- Viewing saved invoices never converts facts. Compatible Order/type corrections are explicit, atomic and audited; recorded stamping/dispatch/return history requires reconciliation. Historical fourth invoice type retains its protected boundary.
- Missing Entry note is non-blocking; stale/error/denied lookups and draft preservation require explicit handling. Lookup refresh does not itself authorize note cancellation, reissue or replacement.

### Entry notes and split Orders (20 October)

- FRO-319 owns the structural rule; FRO-321/FRO-353/FRO-354/FRO-355 consume it.
- Original admission Order owns one note. Qualifying children/descendants carrying its admitted goods resolve that same note through verified admission/split history. A shared family root, pre-admission split or equal MRN alone does not establish coverage.
- No duplicated note, copied MRN, duplicate register row, automatic invoice reassignment or family-wide invoice aggregation.
- Note quantity reflects original admitted scope: a 10-colli admission later split into 4 shipped and 6 remaining still shows 10. “Active” describes declaration paperwork, derived from absence of the invoice-resolved Export MRN, not remaining physical stock.
- Notes 7025 and 7110 belong to unrelated Orders; shared entry MRN is not proof of split inheritance.
- Entry-note tariff classification is note-owned, digits-only, preserves leading zeros and remains through Change Order. Invoice facts remain read-only and corrected at their source. Keep goods-description text separately where printing needs it.
- General list includes active and finalized notes; active-register printing selects currently active notes, one row per note. Earlier “MRN date within month” proposals were superseded. Exact legacy register/statistical-VAT/legal-default details must be confirmed where still tentative.
- FRO-353/FRO-354 tabs: Overview / Related Supplier Invoices (N) / Related Export; Greek: Σχετικά τιμολόγια προμηθευτών / Σχετική εξαγωγή.
- Split-inheritance ticket text was updated and verified on 20 October; its corresponding UI work remained pending. Do not claim existing previews demonstrate inheritance.

### Stamping and invoice status

- Positive IE599 enables eligible stamping actions; it does not itself set invoice exemption status.
- The 24 September continuity correction removed the previously proposed direct Not started → Exempted shortcut. Record actual dispatch first, then stamped return, with actor/time for each; a return cannot precede dispatch. Partial actions affect only selected invoices. Unrecorded historical dispatch needs audited reconciliation.
- Export-level VAT paperwork sent date is the later forwarding of the stamped packet, distinct from dispatch for stamping.
- Later FRO-347 work uses Not Required for non-Υ.Δ. cases and editable Με ΦΠΑ status with required associated dates. Read current FRO-321/FRO-347/FRO-348 before restating the complete enum or edit contract; do not reuse the early Pending/Under process/Exempted model blindly.

### Orders, Shipments and redesign dependencies

- FRO-292: each Order/Shipment has independent Internal Notes and External Notes. Staff see both; customers receive only External Notes. Existing notes migrate to Internal Notes, external starts empty. Customer placement was unresolved. FRO-292 blocks FRO-326/FRO-316.
- FRO-326 Order details uses inline Edit/Save/Cancel; status/progress and derived current warehouse remain read-only in the remembered UI contract. “Expected Readiness Date” belongs in Order details. An earlier request mistakenly removed the journey bar; the correction restored it and removed preview controls instead.
- FRO-335/FRO-336: validate the whole creation draft before readiness review. Received Readiness Date uses date-context review and optional remark up to 1,000 characters; Ready uses explicit confirmation; Awaiting creates directly. Cancel/Escape retains the draft. Submit state and remark atomically, not through post-create transitions. Ready with zero collis was explicitly allowed.
- FRO-339 requires origin/destination country and city at Shipment creation, before purpose. Reuse location references and validate city-country correspondence; retain unknown legacy data. Broader UI structure belongs to the separate redesign.
- FRO-323 arrived-source shortcut selects only currently eligible goods at the new origin, shows exclusions, deduplicates by permanent colli identity, and leaves source history intact.
- FRO-324 historical arrival applies to warehouse destinations, permits genuinely unknown occurrence details without fabricated dates, links existing intake without repeating stock effects, and rejects contradictory movement/reservations. Whole Orders only; no automatic historical split.
- FRO-325 separates creation from optional inline repacking and dispatch. Creation establishes membership before packing confirmation; optional early transport-document entry does not remove dispatch requirements. Creation review and logistics packing review have different responsibilities.
- FRO-341 includes Overview, Orders and Collis, and Documents work; Create shipment sits outside/below the tabbed card. Arrived-source selection uses checkboxes and far-right expandable contents; Order collis start collapsed.

## Open questions and accepted residuals

- FRO-356: warehouse inventory/licences, defaults, regime correction rules and document effects, transfers/no-current-warehouse, duplication/child inheritance and licence validity need confirmation before Ready. Later admission-note inheritance decisions do not automatically settle regime inheritance.
- Front Line-issued client-invoice workflow: detailed invoicing instructions, allocation across recipients and approval roles are not yet specified.
- Customs-note cancellation/reissue/replacement remains deferred; do not introduce it merely because current-note lookup refreshes.
- Old FRO-254 filter questions, BRA-1 scope and older printing/admin gaps are historical leads only. Fetch current issues before re-raising them.
- Historical attachment-owner expansion was flagged as a shared prerequisite. Recheck current schema/tickets and the superseded Protocol model before creating a new task for it.
- The proposed separate VAT_EXCLUDE_STATUS_REVERT authority was explicitly dropped; do not recreate it from an old to-do.
- User explicitly declined reporting the old FRO-238 Split Colli mismatch in the FRO-313/314 review; retain it as an accepted residual rather than reopening it unprompted.
- Current work must not inherit obsolete “pending approval” notes when later entries record approval and creation. Resolve chronology and fetch the live issue.

## Session log

### 2026-10-22 — FRO-337 approved, saved and verified

- User approved the complete draft with "ok". Saved drafts/fro337-revised-spec.md to FRO-337, including stale-save rejection/draft retention, exact monetary transport and numeric(19,2) limits, collection semantics, both split paths, consumer preservation, rollout compatibility and verification.
- Re-read saved issue at updatedAt 2026-10-22T08:26:39.994Z. Description matches approved text after Linear formatting/mention normalization. Verified unchanged title, Todo, complete Order/Pending_Review/Backend/Story label set, assignment, No priority, Pre-releases 0.0.x / 0.0.3, empty attachments and relations (blocks FRO-335/FRO-326; no blockers or related issues).
- Only FRO-337 changed. No UI, preview, production branch or production writes. Ticket review/edit complete; implementation and post-deployment verification remain future work.

### 2026-10-22 — FRO-337 decisions accepted; full draft awaiting approval

- User accepted Q1: reject stale invoice-row saves, retain the draft and require refresh/review before resubmission; FRO-337 owns the protection. Accepted Q2: retain numeric(19,2) capacity for price/product, maximum 99,999,999,999,999,999.99 inclusive, with exact end-to-end monetary representation.
- Re-read FRO-337 unchanged at 2026-10-20T11:09:08.340Z. Prepared complete standalone specification in drafts/fro337-revised-spec.md, retaining existing scope and adding collection semantics, both split paths, preservation rules, exact transport/bounds, concurrency, Context for agents and read-only verification mapping. Complete draft must be approved before Linear write.
- Preserve current title, Todo, Order/Pending_Review/Backend/Story, project/milestone, assignment/priority, empty attachments and existing blocking relations. No new UI, preview, production branch or Linear mutation. No new vocabulary or qualifying architectural decision requires CONTEXT.md or an ADR.

### 2026-10-22 — FRO-337 review; first decision round pending

- Pulled planning repository successfully. Read current FRO-337, FRO-335/FRO-326, target comments (none), team labels/statuses and live production sources through gh at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Linear shared-notes tool was advertised but returned Tool not found; direct issue reads worked.
- FRO-337 remains Todo, Order/Pending_Review/Backend/Story, Pre-releases 0.0.x milestone 0.0.3, no attachments, blocks FRO-335/FRO-326 (both milestone 0.0.5). Baseline: drafts/fro337-review-source.md. No Linear changes.
- Existing specification already covers two-decimal unit prices, server calculation, mock-only rollout, copy behavior and standalone-form compatibility. No new UI/preview needed; existing redesigns own presentation. Production branch explicitly excluded by user.
- Confirmed gaps: GraphQL money uses Float and existing client submits Number(totalAmount), requiring exact input/output transport for claimed decimal accuracy; total_amount is numeric(19,2), but price/product bounds unspecified; full invoice collection replacement distinguishes omitted/null (unchanged) from [] (clear), validates identities and deletes omitted rows. Current update reads/locks server version but accepts no client expected version, so it does not detect an old browser draft saved after another completed update.
- Consumer trace: explicit pre-arrival Order split and partial-Shipment child creation both call PurchaseOrderInvoiceRowRepository.copyTo; preserve full-row copying and fresh child IDs, add unit price with no apportionment. StockListPdfModelFactory, DeliveryNoteDraftSourceService/DeliveryNoteLineFactory and AadeDeliveryNoteXmlBuilder do not consume these row monetary values; preserve those outputs and independent customs/header values.
- Pending recommendations, not decisions: retain current numeric(19,2) total capacity and enforce price/product bounds with exact end-to-end representation; reject stale invoice-collection saves and retain drafts for refresh/review. Need explicit update-collection semantics, copy-path criteria, Context for agents and concrete read-only verification in eventual draft. Existing mock-only decision is retained; no historical reconciliation or nullable-price mode proposed. No new glossary term or ADR resolved.

### 2026-10-22 — Ticket workflow embedded in AGENTS.md

- User requested the full frontline-ticket-flow skill content inside AGENTS.md, making execution of the workflow mandatory instead of requiring invocation of that external skill.
- Embedded the complete current local source, including metadata, steps, gates, reference tables and examples. Retained supporting-skill requirements and the existing project rules for interactive reviews, reused redesign ownership and standalone final specifications.
- Clarified precedence for historical workspace paths, planning-repository synchronization, read-only production-repository access, before/after comparisons outside ticket descriptions and equivalent tools.
- Pulled the planning repository successfully before editing. User reviewed the differences and explicitly approved committing and pushing both files on 2026-10-22. No Linear issues or production resources changed.

### 2026-10-21 — FRO-303 renewed independent review; clarification round pending

- User requested a fresh frontline-ticket-flow review of the saved FRO-303. Re-read current issue/comments, FRO-357, FRO-326/FRO-335, FRO-321/FRO-317 and newly revised FRO-307; live gh main remains 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Applied current flow, grilling and domain-modeling; no canvas/preview because existing redesign ownership suffices.
- Current FRO-303 description is the previously approved specification. Status is now Todo (changed externally since our save); complete labels remain Order/Pending_Review/Backend/Story, Chris, Pre-releases 0.0.x / 0.0.1, No priority, no attachments, related FRO-247/FRO-326/FRO-357, no blockers. Preserve current metadata. Baseline saved at drafts/fro303-renewed-review-source.md.
- Independent code recheck found no issuance replanning conflict: submission builds from stored note snapshot. Existing atomicity/version/no-op/retry requirements are material and already present; exact locking/idempotency mechanics are implementation choices, not new business questions.
- Material clarification candidates: (1) release accessibility: FRO-303 is milestone 0.0.1 while FRO-326/FRO-335 are 0.0.5; current Details/Edit route is fully hidden in later statuses, so correction must integrate into existing controls without waiting for redesign; (2) FRO-321 requires derived parties on every linked invoice and validation against Export/Entry-note relationships, while FRO-317 prohibits silent saved fiscal-scope changes; FRO-303 currently only says those document rewrites are out of scope, missing the compatibility guard/derived-data distinction; (3) ineligible-origin DRAFT reconciliation is undefined and current cancellation accepts only ISSUED, potentially a dead end. Existing confirmed mock-only rollout context may avoid adding an unnecessary new reconciliation UI/workflow; real documents remain protected.
- Editorial/integration clarifications after decisions: reference FRO-357 explicitly and require shared eligibility before/together with correction release; align FRO-307 transport/address snapshot preservation; explicitly scope non-clearing to the new correction without accidentally changing early creation requiredness; specify expected Order version and target company in the new narrow contract. No new endpoint name or authority invented.
- Recommendations are not accepted decisions yet. No Linear edits, status/label changes, UI implementation or production access performed. Existing vocabulary and ADR remain valid; no new term resolved.


### 2026-10-21 — FRO-329 approved, saved and verified

- User approved the complete proposal with “ok”. Saved drafts/fro329-field-cleanup.md to FRO-329 and re-read it; description matches approved text after Linear mention/Markdown/whitespace normalization.
- Verified unchanged title, Todo, complete Order + Ready + Backend + Story labels, unassigned, Pre-releases 0.0.x / 0.0.2, No priority, preview attachment and exact blocking/related relations. No linked-ticket changes.
- Final specification resolves mock-only data cleanup and standalone Edit grouping, names both real split paths, preserves DN validation/authorization/inheritance, lists persistence/API/client coverage and separates read-only production verification from safe-environment mutation tests. No new UI/preview, production changes or deployment verification performed.

### 2026-10-21 — FRO-329 full proposal prepared; write approval pending

- Prepared drafts/fro329-field-cleanup.md using frontline-linear-issues. Complete standalone description incorporates accepted mock cleanup and reused Edit grouping, explicit retained DN validation/state permissions and both split paths, concrete persistence/API/client coverage, FRO-356 ownership and read-only verification matrix. No duplicate-Order operation was found; do not introduce one.
- Preserving title, Todo, complete Order/Ready/Backend/Story labels, unassigned, project/milestone, priority, original blockers/relations and one preview attachment. Re-read target unchanged at 2026-10-20T11:08:48.406Z. No linked-ticket or Linear changes authorised/performed.
- Existing glossary already resolves Order/colli; DN Import/Export definitions added from current agreed ticket contracts. No architectural trade-off warrants an ADR. Full proposed ticket and before/after comparison are being presented for approval.

### 2026-10-21 — FRO-329 first-round decisions accepted

- Q1 accepted: mock-only cleanup of obsolete Order route/MRN/monetary values, without reassignment; real legacy import/reconciliation excluded and no real-data deletion authorised. Preserve retained fields and history.
- Q2 accepted: keep standalone Edit route and existing behavior; reuse FRO-335 retained DN/customs grouping, removing Route & customs. Textual integration only; no new UI canvas/preview.
- Live repository main is 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Both manual and shipment-preparation split paths currently copy documents/customs values; preserve DN inheritance while removing obsolete copies and deferring regime/ALK semantics to FRO-356. Draft/spec check next; no Linear writes.

### 2026-10-21 — FRO-329 review started; first decision round pending

- Read current FRO-329, FRO-326, FRO-335, FRO-356 and FRO-332 plus FRO-329 comments (none), live team statuses and labels. FRO-329 is Todo, Order + Ready + Backend + Story, Pre-releases 0.0.x / 0.0.2, No priority; blocks FRO-335/FRO-326, has one preview attachment. No Linear changes.
- Applied current frontline-ticket-flow and local grilling/domain-modeling skills. GitHub read-only preflight succeeded outside the network sandbox as frontlineltdproject-star. Live implementation investigation ongoing.
- Canvas/preview skipped: reuse existing redesign contracts. FRO-326 owns Details and FRO-335 owns Create; both exclude retirement/redesign of the standalone Edit route, leaving FRO-329's retained-field placement unresolved.
- Q1 recommends applying the already-established mock-only context to the obsolete FRO-329 values without transfer or real legacy deletion. Q2 recommends preserving standalone Edit with retained-field grouping reused from FRO-335. Both remain proposals awaiting answers, not decisions.
- Review baseline saved in drafts/fro329-review-source.md. Existing Order/colli vocabulary is already in CONTEXT.md; no new term or ADR resolved yet.

### 2026-10-21 — FRO-339 approved, saved and verified

- User approved the complete proposed description with ok. Saved FRO-339 from drafts/fro339-shipment-geography.md and re-read it; complete text matches after Linear mention/link/format normalization.
- Verified unchanged title, Todo status, full Shipment/Pending_Review/Backend/Story labels, unassigned, No priority, Pre-releases 0.0.x / 0.0.2, empty attachments/documents and original relations: blocks FRO-316/FRO-341, related FRO-324/FRO-344. No Ready promotion or linked-ticket edits.
- Saved specification includes accepted explicit completion of incomplete pre-dispatch geography and preservation/revalidation after warehouse location changes, plus historical exceptions, cross-adapter contracts, structural/UI ownership and verification matrix.
- No new UI, production writes or post-deployment verification. Ticket review/edit complete; implementation and deployed verification remain future work.

### 2026-10-21 — FRO-339 decisions accepted; full draft awaiting approval

- Q1 accepted: existing incomplete pre-dispatch Shipments need explicit geography completion through FRO-344 before route save/readiness confirmation/dispatch; reads preserve missing data and unrelated authorized Notes/files remain usable.
- Q2 conditionally accepted, then verified premise against live FreightWarehouse and company-and-warehouse-addresses workflow: warehouse cityId is an optional editable reference, country derives from city. Preserve saved Shipment geography after warehouse location edits; reject incompatible route save/readiness confirmation/dispatch until explicit resolution. No historical rewrite.
- Loaded frontline-linear-issues and prepared complete standalone drafts/fro339-shipment-geography.md, with shared GraphQL/REST/MCP validation/read coverage, geography-first origin/destination rules, historical normalization, warehouse-unknown rejection, concurrency checks and read-only verification matrix. Current target re-fetched unchanged (2026-10-20T11:08:51.503Z).
- Metadata/relations remain unchanged; full draft and before/after comparison presented for write approval. No Linear or production writes, new UI or deployment verification. No additional glossary term or qualifying ADR needed.

### 2026-10-21 — FRO-339 review; first decision round pending

- Retrieved full FRO-339, FRO-316/FRO-341, FRO-324/FRO-344, current team labels/statuses and FRO-339 comments (none). FRO-339 remains Todo, Shipment/Pending_Review/Backend/Story, Pre-releases 0.0.x / 0.0.2, no priority or attachments; blocks FRO-316/FRO-341, related FRO-324/FRO-344. No Linear writes.
- Used current frontline-ticket-flow and local grilling/domain-modeling skill files; live gh auth/repository access verified. Read-only repository research delegated as required by grilling. Canvas/preview skipped because existing FRO-316/FRO-341 own presentation.
- Findings: stale wizard placement/progression instructions; FRO-341 owns explicit origin warehouse filtering/reset and physical-handover geography versus agent office/vessel identity, which should be reflected in FRO-339 structural rules. FRO-344 already owns pre-dispatch edits and readiness invalidation. GraphQL/REST/MCP creation share ShipmentCreateInput and validation; FRO-339 needs cross-adapter contract coverage and verification. Existing warehouse city is nullable/editable and country derives from city.
- First decision round asks how incomplete existing pre-dispatch Shipments proceed and how later warehouse-location changes affect saved Shipment geography and pre-dispatch revalidation. Recommendations are unapproved. Preserve existing historical-arrival exceptions; no guessed backfill. Added already-established Shipment destination geography definition to CONTEXT.md and verified; no ADR yet.
- Full draft and before/after comparison await decisions, then frontline-linear-issues writing step and explicit Linear-write approval. Deployment verification not performed.

### 2026-10-21 — FRO-356 approved, saved and verified

- User approved the complete draft with ok. Saved the description from drafts/fro356-customs-regime.md and re-read FRO-356; full text matches after Linear mention/bold/whitespace normalization.
- Verified unchanged title, Todo state, complete Order/Pending_Review/Backend/Story labels, unassigned, Pre-releases 0.0.x / 0.0.2, No priority, empty attachments/documents and all original relations (six blockers and two related issues). No Ready promotion.
- All 15 agreed decisions are in the saved standalone specification. CONTEXT.md and ADR 0003 retain registration-coverage terminology and rationale. FRO-326 still needs its own reviewed integration clarification for late ALK-only editing; no linked issue was edited.
- No new UI/preview, production change or post-deployment verification. Ticket edit complete; implementation and deployed verification remain future work.


### 2026-10-21 — FRO-356 complete draft awaiting write approval

- Full standalone proposal saved to drafts/fro356-customs-regime.md: all 15 accepted decisions; operation-specific warehouse validation; shared ALK registration coverage; late ALK-only editor access; document/state guards; atomic confirmation, concurrency and audit; mock-only rollout; legacy KTA/Bonded retirement; acceptance/read-only verification matrix.
- FRO-356 re-fetched unchanged (updated 20 October 11:08:45Z), unassigned, Todo, Order/Pending_Review/Backend/Story, Pre-releases 0.0.x / 0.0.2, no priority or attachments. Proposed description-only update preserves all metadata and six blockers/two related issues. No Ready promotion or linked-ticket write proposed.
- Spec check complete; FRO-326's existing editor requires ALK-only integration clarification under its own reviewed change, without a new design. Full FRO-356 draft and before/after summary presented for approval. No Linear write yet.


### 2026-10-21 — FRO-356 final-round decisions accepted; drafting

- Q13: compatible Greece-to-No / departure-from-Apotamiefsi corrections show clearing consequences and require confirmation, then save atomically. Reject document/shared-registration inconsistencies; Cancel preserves saved facts.
- Q14: saved regime correction validates Opening warehouse before first storage admission and actual occupied warehouse while IN_STOCK. Unknown validation source blocks customs correction, not otherwise-valid unrelated saves; no Opening fallback after admission.
- Q15: reuse FRO-326 shared Edit/Save/Cancel, enabling only ALK when ordinary editing is unavailable; show covered-Order impact before atomic save. Matching FRO-326 integration clarification is required, but no new design/preview.
- All 15 answers accepted. Preparing standalone FRO-356 proposal under frontline-linear-issues; preserve all current metadata/relations. Main verified at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Added registration-coverage vocabulary and ADR 0003 for shared current ALK versus independent copies. No Linear write approved or performed.


### 2026-10-21 — FRO-356 fourth-round decisions accepted

- Q10: late ALK entry/correction updates current values for all Orders with verified coverage by the same registration, preserving audit/history and issued document contents; no family-wide update without coverage.
- Q11: narrowly scoped authorised/audited ALK entry/correction is available in every non-cancelled stage, including transit and completion. This does not unlock regime/Greece editing.
- Q12: validate Opening warehouse at creation and receiving warehouse for storage admission/transfer. Reject unsupported storage admission without changing regime. Ordinary departures and non-storage destinations do not need regime capability; preserve customs facts in transit.
- Remaining: explicit clearing and validation source for ordinary saved corrections before arrival; check ALK-only editing integration with FRO-326. No Linear changes.


### 2026-10-21 — FRO-356 third-round decisions accepted

- Q7: both manual and Shipment-preparation splits retain the parent regime for the same goods; splitting does not change the parent regime.
- Q8: the same registration covers split goods; retain original ALK for children with verified coverage, not merely common family membership. No generated replacement reference.
- Q9: ordinary regime/Greece corrections retain PENDING/EXPECTED_READINESS/READY/IN_STOCK availability and document-compatibility guards. Later ALK entry is a separate permission/operation question, not permission to unlock regime correction.
- Remaining: late ALK propagation across covered goods, ALK editing stages, warehouse validation during transfer/no-current-stay states and explicit clearing semantics. No Linear changes.


### 2026-10-21 — FRO-356 second-round decisions accepted

- Q4: physical movement preserves recorded regime and ALK through dispatch, transit and missing location; no warehouse-derived automatic change.
- Q5: this delivery supports compatible error corrections only. Reject conflicting ordinary corrections without rewriting invoices, Entry Notes or Export history; actual customs-transition workflow remains separate.
- Q6: duplication for new goods copies neither customs regime nor ALK. Greece = Yes requires fresh explicit regime selection; ALK starts blank.
- Split inheritance, lifecycle availability of correction/later ALK entry, validation warehouse per operation and explicit saved-value clearing remain unresolved. No Linear writes; existing UI owners reused.


### 2026-10-21 — FRO-356 live-code findings and round 2 pending

- Live PurchaseOrderWarehouseStay.active excludes only DEPARTED/LOCATION_UNKNOWN: currentWarehouseStay may be EXPECTED/AWAITING_IMPORT, not physical presence. Create requires active Opening warehouse and creates EXPECTED stay; header update preserves Opening warehouse. Location unknown has no current stay.
- PurchaseOrdersApiService generic header update permits PENDING/EXPECTED_READINESS/READY/IN_STOCK only. PurchaseOrderAuthorizationService enforces PURCHASE_ORDER_EDIT plus internal Frontline/system-admin boundary. Existing HEADER_UPDATED has empty audit details; explicit before/after customs audit requires new implementation.
- Manual split uses copyAsPendingDraft and creates PENDING child; shipment-preparation split creates IN_STOCK child retaining arrival/position. Both paths need the new customs inheritance contract. Existing duplication implementation was not established.
- Round 2 pending: movements preserve customs facts; compatible correction-only scope versus actual customs transitions; duplicate fresh selection/blank ALK. Recommendations are not decisions. Later rounds must resolve validation warehouse per operation, later ALK entry, saved clearing and split inheritance.


### 2026-10-21 — FRO-356 first-round decisions accepted

- Q1: explicit customs-regime selection for Greece = Yes, including a warehouse with only one supported regime; no automatic default.
- Q2: mock-data rollout only; real legacy import/reconciliation is separate. Remove the operational migration project from this delivery without authorising deletion of real legacy data.
- Q3: warehouse licences are reference data only; supported regimes maintained explicitly. No automatic expiry/suspension enforcement in this delivery.
- Next: warehouse validation across lifecycle/movements, saved correction/document boundaries, and split/duplicate inheritance. No Linear writes.


### 2026-10-21 — FRO-356 review started; first decision round pending

- Retrieved current FRO-356, FRO-335/FRO-326, FRO-321/FRO-319, FRO-356 comments (none), and live team statuses/labels. FRO-356 is Todo, Pending_Review + Backend + Story + Order, Pre-releases 0.0.x / 0.0.2, no priority or attachments. Existing blockers and related tickets remain unchanged.
- Loaded frontline-ticket-flow and local grilling/domain-modeling skills; verified live gh access as frontlineltdproject-star outside the network sandbox. Repository investigation delegated under grilling instructions, read-only.
- FRO-335/FRO-326 already own customs-field presentation; canvas and preview skipped. No new UI or Linear writes.
- Initial findings: defaulting question contradicts explicit-selection acceptance wording; saved-regime changes, transfer/no-current-warehouse validation, split/duplicate inheritance and licence lifecycle remain unresolved. FRO-321 already rejects incompatible ordinary regime corrections without silently rewriting saved invoices; FRO-319 admission inheritance must be preserved.
- Round 1 asks explicit selection versus defaults, mock-data versus real operational migration scope, and reference-only licences versus expiry/suspension enforcement. Recommendations remain unapproved. Added already-established customs vocabulary to CONTEXT.md; no ADR earned yet.


### 2026-10-21 — FRO-307 approved description saved; relation cleanup blocked

- User approved complete draft with ok. Saved approved description and re-read; exact normalized text matches drafts/fro307-address-selection.md (Linear converted issue references to mentions).
- Verified preserved title, Todo, Ready + Shipment labels, Chris, Pre-releases 0.0.x / 0.0.1, No priority, empty attachments/documents. Existing blockedBy FRO-306 and related FRO-247 remain.
- Linear automatically added relatedTo FRO-316/FRO-341/FRO-357 from description mentions. Attempted removal solely to restore approved unchanged relations; automatic approval review rejected it as outside description-only authorization. No workaround attempted. Added relations remain; explicit user approval requested for cleanup.
- No new UI/preview, production changes or deployment verification. Ticket content is saved and verified; only relation restoration remains pending approval.


### 2026-10-21 — FRO-307 decisions settled; complete draft awaiting approval

- Q13 accepted: destination starts blank even when only one eligible location exists; explicit selection/manual entry required. Saved drafts retain recorded destination. Loading default remains actual origin warehouse.
- Completed specification check and prepared drafts/fro307-address-selection.md. Consolidates Client-scoped destination union, explicit association creation/linking, everyday-operator permission, partial/manual completion, duplicate reuse and unchanged saved snapshots/fiscal guards. No new UI/preview; FRO-316/FRO-341 retain visual ownership.
- Re-fetched current FRO-307: updated 2026-10-20T11:08:25.055Z, Todo, Ready + Shipment, Chris, Pre-releases 0.0.x / 0.0.1, No priority, blocked by FRO-306, related FRO-247, no attachments/documents. Proposed description-only edit preserves metadata and relations.
- Live code revision rechecked: 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Full draft shown in chat for the mandatory write gate. No Linear change or post-deployment verification performed. No unresolved business question; user may amend/reject the draft.


### 2026-10-21 — FRO-307 Client-location association creation accepted

- Q11 accepted: Destination + automatically associates a new location with the sole represented Client; for multi-Client Shipments, operator explicitly selects one or more represented Clients. The association makes it reusable by authorized Frontline operators for those Clients.
- Q12 accepted: allow linking an existing warehouse/company address to those Clients instead of duplicating address data, or creating a standalone saved address. Only explicitly Client-associated locations appear as destination options; invoice-company association alone is insufficient.
- Retain ordinary Frontline operator creation permission and shared draft destination. Creating the location/association is separate from saving Delivery Note edits. Q7's deferred maintenance concerns later editing/removal, not this approved creation/linking operation.
- Remaining question: initial destination selection/default. Preparing standalone ticket under frontline-linear-issues after the decision. No Linear writes or new UI.


### 2026-10-21 — FRO-307 Client-scoped destination choices accepted

- User approved destination dropdown derived from distinct Clients of the Shipment's participating Orders: one Client shows its associated delivery locations; multiple Clients show their labelled union, with a shared location once. One selected physical destination applies to all current Delivery Note drafts, independent of invoice-company grouping.
- Supersedes global/unrelated-client destination choices and the unaccepted invoice-company scoping proposal. Do not infer the Client set from vessel ownership or a nonexistent Shipment Client field.
- Company-scoped recipient fiscal details remain separate; choosing a physical destination does not change recipient/invoice company or Shipment route identity.
- Open: how + associates new destinations with represented Clients, how warehouse/company addresses enter the Client-associated list, destination default. No new UI/preview or Linear edits.


### 2026-10-21 — FRO-307 destination scope reopened

- Q7 accepted: reusable-address editing/removal outside FRO-307. Q8 accepted: reuse same name plus identical four address parts after case/outer-space normalization; same name with different details allowed.
- User accepted sharing between everyday Frontline operators (Q9), then challenged the global destination list: wants relevant choices rather than every company's address. Thus cross-client scope remains open despite earlier Q9 wording.
- Per-invoicing-company destinations were proposed but not accepted. User is considering Client-associated destination options instead, retaining the shared Shipment destination. Do not treat Client scoping, company scoping, per-note destinations, or destination-warehouse auto-default as decided. Q10/Q11 are open.
- Investigating whether Shipments can contain multiple Clients before recommending scope resolution. No Linear edits.


### 2026-10-21 — FRO-307 partial addresses and everyday-user creation accepted

- Q3 accepted after explaining address source: allow selecting partial addresses and completing them only for the Shipment's notes; manual entry remains available; require complete valid address values at save.
- Q6 accepted: everyday Frontline operators may create reusable addresses through +, using existing DELIVERY_NOTE_CREATE and internal-user boundary; system administrators included, partners/customers excluded. Enforce server-side and hide + when unauthorized. This does not grant warehouse/company edit rights.
- Added resolved saved-address/source terminology to CONTEXT.md. No qualifying architectural trade-off requires an ADR.
- Remaining decisions: saved-address maintenance scope, duplicates, sharing scope. No Linear changes or new UI.


### 2026-10-21 — FRO-307 first-round decisions; Q3 clarification pending

- User accepted shared address updates across all current Shipment Delivery Note drafts, retaining atomic save and existing all-DRAFT guard (Q1).
- Source record changes must not automatically refresh saved drafts; explicit selection/reselection copies values, preserving submitted snapshots (Q2: no to automatic changes).
- New drafts use the actual origin warehouse address rather than a fixed Piraeus default; unknown parts remain unknown and existing drafts remain unchanged (Q4).
- A reusable address explicitly saved through + survives abandonment of surrounding Delivery Note edits; cancelling its creation dialog saves nothing (Q5).
- Q3 remains unanswered: explain that source means the selected warehouse, company or reusable saved-address record. Partial-address selection and manual completion policy is not yet approved. Saved-address maintenance/permissions remain open. No Linear writes.


### 2026-10-21 — FRO-307 review resumed; Shipment UI ownership confirmed

- User confirmed FRO-307 is the target. Correct visual owners are FRO-316/FRO-341; no new UI, canvas or preview is authorized/needed for this review. This resolves the preceding wrong-ticket pause.
- Current FRO-316 places Issue Delivery Notes in Available actions and preserves common movement/address fields. FRO-341 owns Shipment creation; it does not specify delivery-note address capture. Neither currently links FRO-307.
- Live workflow evidence: delivery-note addresses are edited once for all current drafts atomically; source addresses may be partial; saved note snapshots do not refresh on source changes. FRO-307's per-note wording and source-refresh sentence need reconciliation. New-draft loading currently has a fixed Piraeus default.
- Business questions pending: shared versus individual address changes, snapshot timing, incomplete/manual address policy, loading default, and saved-address governance/permissions. Recommendations remain proposals. No Linear changes.


### 2026-10-21 — FRO-307 request identified as wrong ticket

- Retrieved current FRO-307, FRO-306, FRO-247, FRO-357 and the referenced FRO-335/FRO-326, plus current board statuses and labels. GitHub read-only preflight succeeded outside the network sandbox.
- FRO-307 concerns Delivery Note address dropdowns; FRO-335/FRO-326 concern Order creation/details and contain no matching address contract. User confirmed they meant a different ticket. Correct identifier is pending; stop FRO-307 review.
- No Linear changes, draft, canvas or preview produced. No new vocabulary or architectural decision resolved.


### 2026-10-21 — FRO-288 approved, saved and verified

- User approved the complete proposal with ok. Saved standalone description: multi-client Vessel relationships, bidirectional Order creation selection, sole-Client auto-selection, compatible-value retention, safe association maintenance, server validation and preserved identities/historical Orders.
- Re-read saved description and verified it matches the approved draft after Linear mention/bullet normalization. Preserved title, In Progress, unassigned, complete Order + Ready labels, Pre-releases 0.0.x / 0.0.1, No priority, empty attachments/documents and no original relations. Removed automatically added FRO-335/FRO-326/FRO-273 related relations to preserve the approved metadata; references remain in the description.
- Draft retained at drafts/fro288-client-from-vessel.md and relationship vocabulary in CONTEXT.md. No new UI/preview, production changes or deployment verification. Implementation and read-only post-deployment verification remain future work.

### 2026-10-21 — FRO-288 all business rounds accepted; drafting

- Q4 accepted: FRO-288 owns multi-client vessel data/API/backend support and safe association maintenance, alongside Order selection/filtering/validation. Removing one Client association must not delete the shared vessel or affect other Clients. Reuse existing presentation; no new UI design.
- Q5 accepted: preserve existing vessel IDs/Client links during migration; no automatic same-name vessel merging. Later association changes govern new selections, never rewrite saved Orders or their recorded Client/Vessel.
- Q1-Q3 remain accepted: bidirectional creation selection; auto-select sole eligible Client; retain valid dependent selections and clear incompatible ones; saved Client/Vessel remain immutable.
- Spec check and complete standalone draft in progress under frontline-linear-issues. Preserve current FRO-288 metadata. No Linear write approved or performed; no production changes or deployment verification.

### 2026-10-21 — FRO-288 first-round decisions accepted

- Q1 accepted: support both Client-first and Vessel-first selection during Order creation; preserve saved Order Client/Vessel immutability and the existing no-vessel case for Clients without vessels.
- Q2 accepted: automatically select the sole eligible Client; with multiple eligible Clients retain an already eligible selection, otherwise require explicit choice.
- Q3 accepted after concrete explanation: retain valid selections, clear only incompatible dependent Client/Vessel/Invoice company selections, preserve unrelated draft inputs. Never submit stale combinations.
- Further live evidence: VesselRepository.replaceCompanyVessels currently deletes removed vessel records, so shared-vessel support must address master-data maintenance as well as selection and server validation. Invoice associations are distinct client/vessel billing relationships, not evidence of vessel membership.
- Remaining decisions: ownership of multi-client relationship and master-data changes; preserving existing identities/associations and historical Orders when associations change. No Linear writes or new UI. Full draft and write approval remain pending.

### 2026-10-21 — FRO-288 review; selection decisions pending

- User confirmed a vessel can belong to multiple Clients; selecting a vessel must restrict Client choices to its associated Clients. Recorded relationship vocabulary in CONTEXT.md.
- Read current FRO-288, FRO-335/FRO-326, FRO-231/FRO-264/FRO-273, comments (none), current statuses and labels. FRO-288 is In Progress, unassigned, Order + Ready, Pre-releases 0.0.x / 0.0.1, no priority, attachments or relations. No Linear writes.
- Loaded frontline-ticket-flow and local grilling/domain-modeling skills. Live gh access verified as frontlineltdproject-star. Live schema currently stores one vessel.company_id and validator enforces that single Client; multi-client behavior needs data/API/backend support, not wording alone. Detailed evidence lookup delegated under grilling instructions.
- FRO-335 currently describes Client-first vessel filtering; FRO-326 keeps saved Client/Vessel immutable. Canvas and preview skipped: reuse existing presentation. FRO-273 owns existing client-wide or selected-vessel invoice-assignment eligibility, distinct from multiple Clients.
- First-round decisions pending: support both selection orders on Create; single eligible Client automatic selection versus manual; dependent selection retention/clearing. Further scope/reference-data implications must be resolved before full draft and explicit write gate. No ADR yet; no implementation or deployment verification.

### 2026-10-21 — FRO-289 approved, saved and verified

- User approved the full draft with ok. Saved the standalone description to FRO-289: Create Order only, independent supplier persistence, existing manager/admin company-create boundary, required contact validation, retained Order draft, safe repeat-save contract and unchanged same-name/contact policy.
- Re-read saved issue and verified description equals approved text after Linear formatting/mention normalization. Preserved title, In Progress, Chris, Ready + Order labels, Pre-releases 0.0.x / 0.0.1, No priority, empty attachments and original related FRO-242/FRO-320 with no blockers. Removed automatically added FRO-335/FRO-326 relations; their description references remain.
- No new UI/preview, production change or deployment verification. Existing preview reference retained. Implementation and read-only post-deployment checks remain developer/future verification work.

### 2026-10-21 — FRO-289 duplicate policy accepted; drafting

- Q4 accepted: retain existing allowance for distinct suppliers sharing name/contact values; no new matching, warning, merging or name-uniqueness policy. Prevent repeat saves and handle uncertain network outcomes without blind re-creation.
- Current GraphQL createCompany has no idempotency contract; safe retries need explicit backend support, not merely a disabled button. Company has a Greek VAT uniqueness constraint but the five-field shortcut supplies no VAT, and names/contact values are not unique.
- Draft will preserve existing auth redirects rather than promise cross-session draft persistence; ordinary validation/network failures retain drafts. Current company mutation invalidates company data, so PO supplier options must be refreshed explicitly and returned ID retained even outside the loaded page.
- Business questions settled. Complete standalone draft and before/after summary being prepared under frontline-linear-issues. No Linear writes approved or performed. Canvas/preview remain skipped.

### 2026-10-21 — FRO-289 first-round decisions accepted

- Q1: inline supplier creation is limited to Create Order; no new entry point on saved Order editing.
- Q2: successful supplier creation persists independently and remains in the shared supplier list if the Order is later canceled or fails. Only selection belongs to the unsaved Order draft.
- Q3: preserve COMPANY_CREATE authorization and current manager/system-admin boundary; do not extend ordinary Frontline operator permissions. Align the user story accordingly.
- Added resolved Supplier and Supplier main contact vocabulary to CONTEXT.md. No ADR warranted for reuse of existing ownership/permissions. Duplicate handling and ambiguous-result retries remain under review before the next question round. No Linear changes.

### 2026-10-21 — FRO-289 review started; first decision round pending

- Read current FRO-289, FRO-335, FRO-326, FRO-242, FRO-232, FRO-289 comments (none), and live team statuses/labels. FRO-289 is In Progress, Chris, Ready + Order, Pre-releases 0.0.x / 0.0.1, no priority or attachments; related to FRO-242/FRO-320, no blocking relations.
- Loaded frontline-ticket-flow and local grilling/domain-modeling skills. Verified live gh access as frontlineltdproject-star. No duplicate canvas/preview: user directs reuse of FRO-335/FRO-326. Current FRO-289 contains an older supplier-modal preview; redesign descriptions do not explicitly reference this inline supplier feature. No preview changed or deleted.
- First-round proposals await answers: Create Order only versus existing Order editing too; independently saved supplier survives canceled/failed Order creation; preserve existing company-create permission boundary versus extend operator capability. None accepted yet.
- Live code research confirms supplier creation already saves mandatory main-contact values on the company and requires COMPANY_CREATE; ordinary Frontline operators can create Orders but lack that authority. Current ticket persona and hidden-button rule therefore need explicit alignment.
- Further review areas: exact validation, retry/ambiguous success and duplicate handling, shared-list refresh, no premature reminder, affected contracts and read-only verification. No Linear or production changes; no new resolved vocabulary or ADR yet.

### 2026-10-21 — FRO-294 approved, saved and verified

- User approved the complete proposed description with ok. Saved FRO-294: https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli . Complete retirement includes persistence, active contracts, hidden form/payload/copy values and mock-data cleanup without conversion. FRO-335/FRO-326 retain presentation ownership; FRO-297 retains handling flags/DG ownership.
- Re-read saved issue and compared the description with the approved local draft after normalizing Linear issue mentions, link syntax and line endings: matched. Verified unchanged title, In Progress, Chris, complete Order + Ready label set, Pre-releases 0.0.x / 0.0.1, No priority, empty attachments/documents and exact relations: blocks FRO-335/FRO-326, related FRO-297.
- Vocabulary and local draft retained. No new UI/preview or production changes; implementation and post-deployment verification remain future work.

### 2026-10-21 — FRO-294 decisions settled; complete draft pending approval

- User accepted complete retirement of per-colli Notes and confirmed mock data. Remove storage/active contracts, form state, payloads, selections, copying and validation; discard obsolete mock values without moving text into Description/Order Notes/DG fields or inferring flags.
- Live repository check confirmed shared Java inputs serve REST/MCP creation, repository create/update persist Notes, client Add identical copies it, and GraphQL reads request it. Stock-list printing uses Order Notes and delivery-note printing uses document Notes; preserve both.
- Vocabulary recorded in CONTEXT.md. No ADR warranted for this mock-data field cleanup. Canvas/preview skipped: FRO-335/FRO-326 own existing presentation contracts.
- Complete standalone proposal saved in drafts/fro294-remove-colli-notes.md. Preserve current title, In Progress, Chris, Ready + Order labels, project/milestone, No priority, empty attachments and existing blocker/related directions. No Linear changes. Full proposal requires explicit write approval; implementation and deployment verification remain future work.

### 2026-10-21 — FRO-294 review, first decision round pending

- Retrieved current FRO-294, FRO-335, FRO-326, FRO-297, FRO-294 comments (none), team labels and statuses. FRO-294 remains In Progress, Chris, Ready + Order, Pre-releases 0.0.x / 0.0.1, No priority, no attachments; blocks FRO-335/FRO-326 and related to FRO-297. No Linear writes.
- Applied current frontline-ticket-flow and installed grilling/domain-modeling skills. Verified live gh access as frontlineltdproject-star. UI ownership remains FRO-335/FRO-326; canvas and preview skipped.
- Live database/API references and client form/service confirm colli Notes is separate from Description and Order Notes, remains exposed in inputs/outputs, hydrated/serialized, and copied by Add identical. Merely removing its textarea leaves active behavior.
- Review gaps: active-contract retirement versus UI-only omission, existing-data treatment, hidden payload/copy consumers, and concrete acceptance/read-only verification. FRO-297 already prohibits inferring flags from notes and separately owns UN / DG details.
- First-round recommendations pending: fully retire per-colli Notes; apply the previously confirmed mock-only context to discard obsolete mock notes without moving them into Description, Order Notes or DG fields. These are proposals, not accepted FRO-294 decisions. No new vocabulary resolved or ADR earned yet.


### 2026-10-21 — FRO-357 created and FRO-303 updated; saved content verified

- User approved both complete proposals with ok. Created FRO-357, Delivery notes — restrict preparation & issuance to Frontline-operated Greek origins: https://linear.app/front-line-ltd/issue/FRO-357/delivery-notes-restrict-preparation-and-issuance-to-frontline-operated . Backlog; Shipment + Pending_Review + Backend + Story; Pre-releases 0.0.x; unassigned, no milestone, No priority; no attachments; related FRO-247/FRO-303; no blockers. Scope is accepted Greek Frontline origin eligibility, shared backend enforcement and existing-consumer/automatic-preparation gating, no new UI.
- Updated FRO-303 title to Order — change Invoice company after Shipment inclusion and saved approved standalone specification. Backlog; Order + Pending_Review + Backend + Story; preserved Chris, Pre-releases 0.0.x, milestone 0.0.1, No priority and empty attachments. Related FRO-247/FRO-326/FRO-357; no blockers. https://linear.app/front-line-ltd/issue/FRO-303/order-change-invoice-company-after-shipment-inclusion .
- Re-read both saved descriptions and compared with approved local drafts after normalizing Linear issue mentions, Markdown links, bullets and whitespace: both matched. Verified complete label sets, metadata, attachments and relations. Linear automatically added a FRO-335 relation from its description mention; removed that unapproved relation and re-read FRO-303 to confirm the exact approved relation set and unchanged content.
- Both remain Backlog/Pending_Review, with no Ready/Todo promotion. No UI/canvas/preview, code, production or Cloudflare changes. No deployment verification performed. Existing FRO-247/FRO-326/FRO-335 descriptions were not edited.
- Local drafts retained in drafts/ and accepted fiscal-document trade-off in docs/adr/0002-protect-fiscal-documents-during-order-company-correction.md. Vocabulary recorded in CONTEXT.md.


### 2026-10-21 — FRO-303 and delivery-note eligibility complete drafts prepared

- User requested the separate delivery-note eligibility ticket using frontline-ticket-flow and continuation of FRO-303; explicitly no UI for the new ticket. Previous business rounds are settled. Canvas/preview skipped for both; new ticket has only existing-consumer gating, no new UI design.
- Refreshed FRO-303, labels/statuses, duplicate search, current project and live main 3820e89e8caa341261e2d48bcb282d93e1bb1d03. FRO-303 remains unchanged: original title, Backlog, Chris, Order label, Pre-releases 0.0.x / 0.0.1, no priority/attachments/relations. No matching origin-eligibility ticket found.
- Drafts saved at drafts/fro303-invoice-company.md and drafts/delivery-note-origin-eligibility.md. Full proposals to be shown before write approval. Proposed FRO-303 title clarifies Invoice company; preserve existing assignment/project/milestone/priority, add Story/Backend/Pending_Review alongside Order and related links to new ticket/FRO-326/FRO-247. New draft: Backlog, Story/Backend/Shipment/Pending_Review, same project, no milestone/assignee/priority; related FRO-303/FRO-247. No Ready/Todo promotion proposed.
- Spec check: all invoice-company write paths must share document guards; only affected unsubmitted draft lines move, retaining their recorded goods quantities/weights; totals are sums of retained lines. Existing target transport data is retained, conflicting movement details reject atomically; required existing delivery-note authority cannot be bypassed. Ineligible-origin draft conflicts require reconciliation and cannot create a new ineligible note.
- New ticket enforces Greek Frontline-origin preparation/new-issuance boundary through backend and existing consumers, including automatic preparation and cancellation replacement. Historical read/PDF/cancellation/reconciliation is preserved without new ineligible submission. It does not introduce a new lifecycle-state rule.
- Added docs/adr/0002-protect-fiscal-documents-during-order-company-correction.md for accepted fiscal-snapshot protection/atomic-draft-regrouping trade-off. Glossary already records accepted terms. Local files verified; no production or Linear writes, no deployment verification.


### 2026-10-21 — FRO-303 historical-document checks accepted

- User accepted checking actual delivery notes covering the selected Order across its Shipment history. Foreign/ineligible Shipments with no note create no restriction; existing issued/in-flight notes still require reconciliation even if created for an ineligible departure. Never silently ignore or alter them.
- Separate eligibility ticket remains only a proposal. User asked what eligibility it would cover: whether a Shipment may have Front Line delivery notes prepared/issued, using the accepted Frontline-operated Greek origin rule and preventing automatic draft preparation on ineligible Shipments.
- Do not create a separate ticket until scope is accepted and its full draft passes the skill write gate. No Linear changes.


### 2026-10-21 — FRO-303 delivery-note origin boundary accepted

- User confirmed all departures from Frontline-operated Greek warehouses qualify for delivery notes, regardless of Shipment purpose/destination (including vessel or warehouse, not airport/export only). Associated-agent warehouses in Greece do not qualify.
- Origin warehouse is the source of eligibility, not Order Greece/customs regime, destination country or a presumed Export ShipmentPurpose. Live model: Shipment.originWarehouseId -> warehouse operator/kind/city -> country; no Export purpose or country ISO field. Use authoritative country identity, not an invented ISO field/name heuristic.
- Current code allows DN creation without the origin guard, and delivery-notes-card auto-prepares when no notes exist and the user can create. The workflow documentation's PREPARING selection restriction is not enforced by the inspected creation methods. Eligibility must be enforced server-side and consumed by UI/automatic preparation.
- Remaining decisions: actual historical notes and erroneous notes on ineligible legs; ownership of eligibility correction separate from FRO-303. No Linear changes.


### 2026-10-21 — FRO-303 round 2: draft handling accepted; delivery-note eligibility corrected

- User accepted atomic company correction plus affected draft regrouping: remove Order from old draft, recalculate totals, remove emptied draft, add/create target-company draft, preserve unrelated Orders and transport details; reject entirely for missing fiscal details or incompatible vessels.
- User accepted protecting affected SUBMISSION_PENDING, SUBMISSION_FAILED and CANCELLATION_PENDING notes, and blocking when the target company already has an issued note on the same Shipment. Unrelated companies' notes must not block.
- User did NOT accept the proposed all-history rule. Clarified the business model: Front Line issues delivery notes ONLY for Shipments leaving its Greek warehouses. Hub-to-hub typically means third-country transfers such as China to Korea, without delivery notes. Common export flow is Greek warehouse to airport for export.
- Do not infer export-only eligibility or ban all network transfers from those examples. Need resolve Greek-origin domestic/interwarehouse/vessel cases, meaning of our warehouses, and handling of pre-existing notes on ineligible legs. Current eligibility gap needs an explicit owner and must not silently broaden FRO-303 or edit other tickets.
- Earlier FRO-303 decisions remain accepted. No Linear writes, UI creation or production changes.


### 2026-10-21 — FRO-303 round 1 accepted

- User accepted all four recommendations: reuse FRO-326 shared Edit/Save/Cancel with only Invoice company unlocked in newly eligible later states; a narrowly scoped audited operation replaces the comment's dedicated-button proposal.
- Allow PREPARED_FOR_SHIPMENT, SHIPPED, AWAITING_IMPORT, ARRIVED_AT_DESTINATION and LOCATION_UNKNOWN; exclude CANCELLED. Preserve PURCHASE_ORDER_EDIT plus Frontline/system identity restrictions and document guards.
- Allow filling an empty company or selecting an eligible replacement; prohibit clearing through this correction. Preserve Client/Vessel eligibility. Change only the selected Order, never parent/children.
- Block correction while an uncancelled issued delivery note covers the Order; require explicit cancellation/reconciliation first. Never automatically cancel or rewrite issued documents.
- Round 2 remains open: automatic draft regrouping versus blocking, pending/failed submissions and target-company issued notes, historical-Shipment scope. Current preparation creates missing pairs without rebuilding existing drafts, and cancellation automatically attempts replacement; a blanket draft block would create a correction dead end.
- No Linear changes. Canvas/preview remain skipped. No ADR yet: downstream correction trade-offs are still being resolved.


### 2026-10-21 — FRO-303 review started; business decisions pending

- Read current FRO-303, its Chris comment dated 20 October, current FRO-326/FRO-335 contracts and live board statuses/labels. FRO-303 is Backlog, assigned to Chris, label Order, Pre-releases 0.0.x / 0.0.1, no priority, attachments or relations. Its description only requests Invoice company editing after Shipment inclusion.
- Chris's comment records prior agreement on a dedicated audited Change invoice company action and selected-Order-only changes; lifecycle eligibility and delivery-note treatment remain explicitly open. Treat developer leanings as proposals, not user decisions.
- Current FRO-326 already supplies the Invoice company dropdown and shared Edit/Save/Cancel, but retains state/reservation restrictions. Reconcile its editor with the dedicated-action comment before drafting. FRO-335 covers creation, not post-Shipment correction. User requests no duplicate UI; canvas/preview skipped using existing redesign ownership.
- Live gh access verified as frontlineltdproject-star. Delivery-note workflow confirms grouping by Shipment/invoice company, recipient snapshots fixed at draft creation, immutable issued content and cancellation/replacement semantics. This is application behavior evidence, not a legal determination.
- Review must settle allowed stages/roles, dedicated action versus existing editor, clearing, delivery-note effects and concurrency/audit before a standalone spec. No Linear write or production change made. Grilling and domain-modeling local skills loaded; first decision round pending. No new vocabulary or ADR accepted yet.


### 2026-10-21 — FRO-295 approved, saved and verified

- User approved updating FRO-295 after reviewing the complete draft and the FRO-316/FRO-341 ownership clarification. Saved the standalone final description: full PCS retirement, mock-data removal, preserved physical/invoice quantities, stock-list formatting and read-only verification.
- Re-read and verified the saved description against approved text after Linear formatting normalization. Preserved title, In Progress status, Chris assignment, Ready + Order labels, Pre-releases 0.0.x project, 0.0.1 milestone, No priority, empty attachments and original relations (blocks FRO-335/FRO-326; related FRO-287). Removed automatically added FRO-316/FRO-341 relations to preserve the approved metadata; references remain in the description.
- Only FRO-295 was edited. FRO-341's existing Declared pcs wording still needs alignment under its own reviewed edit. No UI/preview work, production changes or post-deployment verification performed.

### 2026-10-21 — FRO-295 Shipment UI ownership clarification

- User identified FRO-316 as existing Shipment redesign ownership. Read current FRO-316 and its creation counterpart FRO-341. FRO-316 already specifies Review repacking metrics Optional load units, Individual collis and Transport pieces, with no double-counting; reuse this presentation rather than prescribing a separate design in FRO-295.
- Found a current cross-ticket contradiction: FRO-341 Creation review explicitly includes Declared pcs in its top counters, counter rules and verification. It must consume FRO-295's approved retirement of PCS; FRO-316 alone does not remove this creation requirement.
- Proposed FRO-295 ownership wording: remove PCS and its aggregate across Shipment contracts/consumers, with packing-review presentation owned by FRO-316 and creation presentation by FRO-341; retain physical-count meanings. No additional UI canvas/preview. No Linear changes; prior full draft needs revised ownership wording before write approval. Any FRO-341 edit requires its own complete reviewed proposal and approval.

### 2026-10-21 — FRO-295 decisions settled; full draft awaiting approval

- Q1: user approved PCS removal from all active contracts, not just UI. Remove persisted field, inputs/outputs, defaults, payload/copy values, PCS validation, printed PCS and Declared pcs aggregate; regenerate affected contracts and fixtures.
- Q2: user confirmed only mock data exists, so no historical PCS preservation/reconciliation requirement. Remove obsolete PCS from mock data; do not infer or create extra collis or invoice quantities from it.
- Q3: preserve physical colli/load-unit/Transport pieces counts, stock-list and delivery-note quantities, invoice-row quantity/unit, weights and volumes with their existing meanings.
- Vocabulary added to CONTEXT.md. No ADR warranted for this field cleanup. Canvas/preview skipped: FRO-335/FRO-326 own Order presentation. Full standalone draft prepared in chat; Linear write still requires explicit approval. Existing metadata and relations stay unchanged.

### 2026-10-21 — FRO-295 review, first decision round pending

- Read current FRO-295, FRO-335, FRO-326, FRO-287, current board labels/statuses and FRO-295 comments (none). FRO-295 remains In Progress, Chris, Ready + Order, Pre-releases 0.0.x / 0.0.1; blocks FRO-335/FRO-326, related to FRO-287, no attachments. No Linear changes.
- Applied frontline-ticket-flow with installed grilling/domain-modeling skills. Existing redesigns own Order presentation; no duplicate canvas or preview is needed. Live repository access verified through gh as frontlineltdproject-star.
- Current code has nullable per-colli PCS, frontend default 1 and payload mapping. Shipment composer separately shows Declared pcs (sum of PCS) and Transport pieces (individual collis plus load units). Stock-list packing lines consume PCS; physical colli counts and weight/volume must not be reinterpreted.
- Review gaps: active-contract retirement versus UI-only omission; legacy PCS preservation/deletion; hidden defaults and all API consumers; precise counts retained; regenerated stock-list behavior and verification. Recommendations remain proposals until answered. Full draft and any Linear write approval are pending.

### 2026-10-21 — FRO-297 approved, saved and verified

- User approved the complete condensed final specification. Updated FRO-297 description and re-read it; semantic text matches the approved draft after Linear's Markdown/link normalization.
- Verified title, In Progress state, Chris assignment, Pre-releases 0.0.x project, 0.0.1 milestone, No priority, complete Order + Ready label set, blockers FRO-335/FRO-326, related FRO-294 and empty attachment set were preserved. Removed Linear's automatically added FRO-268 related relation to retain the approved metadata; its description reference remains.
- Saved requirements include independent flags, optional DG class/details with 200-character text limit, explicit false clearing server-side, nonterminal Order DG badges, immutable dispatch-time DG classification and Unavailable for pre-feature dispatched shipments. FRO-335/FRO-326 retain UI ownership.
- AGENTS.md requires interactive skill-driven reviews and standalone final ticket descriptions without prior-version commentary. Implementation and post-deployment verification remain future developer work; no production modifications or deployment verification were performed.

### 2026-10-21 — Final-specification rule for existing tickets

- User requested complete, correct final ticket descriptions without explanations of what was wrong in prior versions. Added this rule to the existing AGENTS.md (the project's instruction file), including keeping review comparisons outside the ticket body.
- Condensed FRO-297 draft to remove ticket-history/process commentary and repetition while retaining all six agreed decisions, migration, implementation references and verification. Revised draft remains pending explicit write approval; no Linear mutation made.

### 2026-10-21 — FRO-297 historical-data decision and draft

- User approved Q6: show Unavailable for shipments dispatched before this feature; do not reconstruct a dispatch-time count from current flags or backfill zero.
- All six grilling answers are settled. Proceed to complete reviewable draft: DG details optional/max 200; DG=false clears class/details server-side; Order DG aggregate excludes terminal current members; snapshot classification atomically at dispatch; legacy dispatched shipments show Unavailable. No Linear write approved yet.
- Preserve existing title, In Progress state, Ready + Order labels, Chris assignment, project/milestone, priority and relations. FRO-335/FRO-326 own presentation; FRO-297 owns data/validation/aggregation and required wiring. No duplicate UI or preview.

### 2026-10-21 — FRO-297 grilling round 2 decisions

- User set UN / DG details maximum length to 200 characters, replacing the proposed 1,000. Optional supplier wording is retained; overlength input must not be silently truncated.
- User answered No to old shipment DG counts changing after later colli corrections. Capture DG classification/count at dispatch; preparing shipments use current saved flags. Historical migration treatment remains unresolved.
- Live shipment lifecycle and GraphQL schema confirm dispatch records transport document/time and immutable participating identities; no dedicated DG-count/snapshot contract currently exists. Existing dispatched records cannot be asserted to have accurate dispatch-time DG classification without evidence.

### 2026-10-21 — FRO-297 grilling round 1 decisions

- User answered Q1 Yes: DG may be saved while Class of DG and UN / DG details are unknown; both fields remain optional.
- User answered Q2 Yes: saving DG=false clears both conditional fields atomically, enforced server-side; Cancel restores saved values. This replaces the current flag-OR-class normalization for an explicit false.
- User answered Q3 No to retaining the badge for terminal-only DG: Order DG aggregate uses current nonterminal collis. Terminal rows retain their DG facts for inspection/history.
- Round 2 pending: DG text maximum length and live-versus-historical shipment count semantics. Live validator currently caps handling-unit Notes at 1,000 characters; a matching limit for the new dedicated DG text is a proposal, not an existing field constraint.

### 2026-10-21 — Interactive ticket-flow correction

- User explicitly requested the actual interactive frontline-ticket-flow grilling workflow, including numbered question rounds with recommendations, waiting for answers, and live GitHub fact lookup through gh. A review report does not replace that interview.
- Updated AGENTS.md to apply the skill to reviews as well as creation/editing and to make the interactive workflow explicit. Continue FRO-297 at step 1; prior recommendations remain unapproved. No new UI is needed because FRO-335/FRO-326 own presentation.

### 2026-10-21 — FRO-297 review, awaiting business decisions

- Read current FRO-297, FRO-335, FRO-326, FRO-268 and FRO-294, FRO-297 comments (none), current labels/statuses, and live GitHub sources. FRO-297 is In Progress, assigned to Chris, labels Ready + Order; blocks FRO-335 and FRO-326. No Linear changes made.
- User requested review through frontline-ticket-flow and no duplicate UI. Existing redesign tickets own presentation; canvas and preview skipped. FRO-297 should own flag persistence, validation, aggregation and integration contracts.
- Confirmed existing dangerous_goods boolean and nullable dangerous_class; other flags and dedicated DG text are new. Current validator derives DG from true flag OR non-null class, so false with stale class re-enables DG. Current Order summary/detail aggregate includes terminal current members. Existing DG=true with no class is valid. Preserve existing DG data and edit/authorization/shipment-reservation guards.
- Gaps: DG requiredness/text limit; server clearing behavior; terminal inclusion in Order DG aggregate; precise distinct-colli shipment count and historical-versus-current classification; migration/defaults; split/repack identity preservation; API/read contracts and verification. Remove unsupported claim that all shipment counts are zero.
- Pending interview: whether class/details stay optional, terminal inclusion policy, and historical shipment count semantics. Recommendations are proposals, not decisions. Full revised draft and write approval remain pending under the skill.
- Created CONTEXT.md with already-established Order/purchase-order/stock-list terminology, colli identity and Damaged Packing distinction. No ADR earned.

### 2026-10-22 — Mandatory planning-repository synchronization

- User requires a successful GitHub pull before any Linear ticket work, and committing/pushing repository changes after completing ticket creation, modification or any other repository file changes.
- Updated AGENTS.md with the pull/push requirements and replaced its previous prohibition on pushing this planning folder. Production repository access remains read-only. Synchronization uses the configured planning-repository upstream.

### 2026-10-22 — Consumer tracing and workflow learnings

- User approved consumer tracing for changes to business behavior: investigate relevant readers and callers, show supported outcomes and ownership in an impact table, and carry agreed requirements into the final ticket. This applies without a UI design round and does not authorize scope expansion.
- Updated AGENTS.md step 3 and the session-recording instructions; created WORKFLOW_LEARNINGS.md with maintenance rules and an entry format, initially without lessons. Ticket history, vocabulary and architectural decisions retain their existing homes.
- Existing historical entries remain intact. Verification result labels and extraction of older lessons were outside this change; no Linear or production-repository changes were made.

### 2026-10-22 — Eight workflow lessons extracted

- User approved adding all eight proposed lessons to WORKFLOW_LEARNINGS.md: five active reminders and three corrections already incorporated into AGENTS.md. Entries retain the original 2026-10-21 evidence dates and link to their supporting session records and authoritative workflow sections.
- Existing MEMORY.md history remains intact; no entries were moved or rewritten. No AGENTS.md, Linear or production changes were made.

## Maintaining this file

Record reusable process lessons in WORKFLOW_LEARNINGS.md. Keep ticket
history and approved business decisions here; existing historical
entries remain intact.

Keep durable ticket decisions, issue IDs, dependency ownership and unresolved questions. Date material changes, identify superseded rules, and distinguish ticket changes from unimplemented proposals. Fetch current design/attachment links from Linear when needed. Do not append deployment logs, credentials or lengthy preview test histories here.










### 2026-10-22 — FRO-333 review; first clarification round pending

- Pulled planning repository successfully; read current FRO-333, FRO-335, FRO-326 and FRO-334 plus current statuses. Production source accessed read-only through authenticated gh. Linear shared agent-context endpoint returned tool-not-found; issue reads succeeded.
- User confirmed Pickup is optional and may remain unset. Yes, No and unset must remain distinguishable; no automatic No default is approved. Clearing an existing value and exact omitted-versus-null update semantics still need resolution.
- Review findings: requiredness/default, existing-data treatment and copy rules were already explicitly unresolved. FRO-333 description names only FRO-326 although live blockers correctly include FRO-335. FRO-333 milestone 0.0.3 precedes both redesigns at 0.0.5; existing-form delivery ownership is unresolved. Current Todo plus Pending_Review differs from project draft convention; metadata was preserved.
- Live lifecycle has both manual PENDING-child splitting and Shipment-preparation IN_STOCK-child splitting. Both need explicit Pickup inheritance, including unset. Existing mutation authorization/state/reservation guards must be retained unless separately decided. Nullable update must distinguish omitted (preserve) from explicit clearing rather than copy the existing Greece boolean behavior.
- Pending first-round answers: mock-only rollout versus real existing unknown Orders; minimal existing-form integration in 0.0.3 versus release with redesigns. Later clarification: clearability and copying/inheritance. Recommendations are not decisions.
- Canvas/preview skipped because FRO-335/FRO-326 own presentation; no new design need established. Production branch explicitly excluded. No Linear writes or production changes. Review and clarification remain in progress; no implementation/deployment verification claimed.

### 2026-10-22 — FRO-333 rollout and current-page integration agreed

- User confirmed affected existing data is mock data; real legacy import/reconciliation is outside this delivery. No real-data deletion is authorized.
- User approved making Pickup visible and usable on current Create/Edit/Details pages when backend support is delivered, without waiting for FRO-335/FRO-326. Reuse existing controls and agreed labels; later redesigns consume the same behavior. No new design/preview or production branch.
- Optional Pickup with unset distinct from No remains agreed. Pending second-round decisions: allow clearing a saved choice to unset; inherit the parent's value including unset once in both actual split paths, with independent later edits. These recommendations are not yet decisions.
- No Linear changes made; complete revised draft remains pending clarification and approval.
- Q4 subsequently accepted: authorized editors may clear a saved Yes/No back to unset. Unrelated edits preserve the saved value. Q5 split inheritance remains pending.

### 2026-10-22 — FRO-333 decisions settled; revised draft pending approval

- User accepted copying Pickup once, including unset, to children in both manual and Shipment-preparation splits; later parent/child edits remain independent.
- Complete proposed description saved in drafts/fro333-pickup-responsibility.md. Covers optional/clearable nullable value, omitted-field preservation, current-page integration with backend delivery, mock-only introduction, both split paths, existing guards and consumer ownership, acceptance and read-only verification.
- Added resolved Pickup vocabulary to CONTEXT.md. No ADR warranted. Target issue re-read unchanged; proposed edit preserves title, Todo, all four labels, project/milestone, existing relations and attachments. No Ready promotion proposed.
- No Linear write made. Full draft must be approved before writing. No new UI preview or production branch; deployment verification not performed.

### 2026-10-22 — FRO-333 approved description saved and verified

- User approved the complete proposed description. Saved drafts/fro333-pickup-responsibility.md to FRO-333 and re-read the issue; full description matches after Linear link/format normalization.
- Verified unchanged title, Todo status, complete labels (Order, Pending_Review, Backend, Story), assignee, priority, project, milestone 0.0.3, attachments and relations. Blocks FRO-335/FRO-326; related to FRO-329/FRO-334. No Ready promotion or comment added.
- Approved specification includes optional and clearable Pickup, distinct unset/No, omission-preserving updates, mock-only introduction, current-page integration with backend, and one-time independent inheritance for both split paths.
- Linear updatedAt: 2026-10-22T08:45:38.306Z. No production code/branch or preview changes; deployment verification remains future implementation work.

### 2026-10-22 — FRO-332 review; first clarification round pending

- Pulled planning repository successfully; fetched current FRO-332, FRO-335, FRO-326 and directly related FRO-329, FRO-332 comments (none), and current team statuses. Production source inspected read-only through authenticated gh at main 3820e89e8caa341261e2d48bcb282d93e1bb1d03.
- FRO-332 is Todo, labels Order + Pending_Review + Backend + Story, milestone 0.0.3, No priority, no attachments; blocks FRO-335/FRO-326 and relates to FRO-329. Its body names only FRO-326; both redesigns target 0.0.5. Preserve metadata unless separately approved.
- Required grilling/domain-modeling applied; interview remains open. User accepted Q1: affected data is mock/test only; real-data import/reconciliation is outside this delivery. User asked why current-page integration matters; explained that current forms still send the retiring colli field. Narrowed Q2 to removing the current Create/Edit input, hidden state and payload with the backend; adding a current Details display is not a prerequisite to this removal. Q2 remains pending. No new vocabulary or ADR earned.
- Confirmed both optional text fields already exist: Order deliveryNoteImport and colli importDeliveryNote. Removing only the input leaves form state, payloads, GraphQL selections, shared REST/GraphQL/MCP create DTOs, persistence and colli read contracts active. Specify full retirement versus legacy read-only/deprecation and coordinate supported callers.
- Concrete preservation risks: Order updates normalize omitted/null/blank DN Import to null; removing a colli input/payload while its existing update path remains also writes null into the legacy colli column during unrelated colli edits. The proposed transition must protect canonical references and any unresolved legacy evidence; exact omitted-versus-explicit-clear semantics remain undecided.
- Both manual and Shipment-preparation splits copy the Order document header; later edits are independent. Existing database split-header validation also checks the copied Order Import DN. Preserve these actual paths, colli identity, terminal memberships, attachment inheritance and split atomicity. No family-wide synchronization or inferred arrival is justified.
- Stock-list PDFs and generated Shipment Delivery Note lines do not consume either import-reference field; their transport/related-document numbers are separate. Preserve those outputs and avoid extending them. Current client Details does not display the DN references, although the Create/Edit form contains them; delivery ownership needs an explicit outcome.
- Existing migration rules already prohibit arbitrary conflict resolution and family-wide backfill. Remaining gaps include data population, exact normalization/equality for reconciliation if needed, active versus legacy read contracts, rollout compatibility, explicit split cases, safe-environment boundary/failure coverage, and criterion-specific read-only verification.
- Follow-up round pending: Q2 coordinated removal in current forms versus release with redesigns; Q3 full retirement of colli storage/input/output and obsolete mock values versus a retained historical read-only field; Q4 omitted canonical DN preserves its value while explicit blank/null clears versus retaining current omission-clears behavior. Recommendations remain proposals. Mock-only scope makes the existing real-data reconciliation machinery unnecessary for this delivery, subject to the explicit retirement decision.
- Canvas and preview skipped because FRO-335/FRO-326 own presentation. Production branch explicitly excluded by user. No Linear, production code, database, branch or preview changes; no deployment verification claimed. Full revised ticket and any Linear write require later approval under AGENTS.md after clarification.

### 2026-10-22 — FRO-332 decisions settled; complete revised draft pending approval

- User accepted Q2 and explicitly required mentioning current-form delivery in the issue: remove the duplicate colli input, hidden form value/defaults and payload with the backend change, without waiting for FRO-335/FRO-326. Retain the existing Order input; no new current Details display is required by this removal.
- User accepted Q3: fully retire colli storage and supported API inputs/outputs; remove obsolete mock values while preserving the existing Order DN Import. No real-data migration, archive or reconciliation is included, and no legacy read-only colli field remains.
- Explained Q4 using live validator and client mapping at main 3820e89e8caa341261e2d48bcb282d93e1bb1d03: current full form resends DN Import, but backend omission is normalized to null. User then accepted preserving DN Import on omission and clearing only on explicit null/blank; retain trimming and max 255. This is a targeted update-contract change, not a claim that every current form edit loses data.
- Complete standalone draft: drafts/fro332-import-dn-consolidation.md. Includes all four decisions, supported REST/GraphQL/MCP consumers, current-form integration, both split paths/nested descendants and independent later edits, preservation of outputs/history/guards, acceptance criteria and read-only verification matrix. Existing vocabulary suffices; no ADR earned.
- Re-fetched FRO-332 unchanged at updatedAt 2026-10-20T11:08:57.551Z. Proposed description-only update preserves title, Todo, all four labels, assignment, priority, project/milestone, blockers/relations and attachments. No Ready promotion proposed.
- Full draft requires explicit approval before any Linear write. Canvas/preview and production branch remain excluded. No production implementation or deployment verification performed.

### 2026-10-22 — FRO-332 approved description saved and verified

- User approved the complete proposed description with "write it". Saved drafts/fro332-import-dn-consolidation.md to FRO-332 and re-read the complete issue. Description matches the approved draft after Linear's automatic issue-link and bold-format normalization.
- Verified unchanged title, Todo status, complete labels (Order, Pending_Review, Backend, Story), unassigned state, No priority, Pre-releases 0.0.x project, milestone 0.0.3, parent/cycle/estimate/due date, empty attachments/documents and relations. Still blocks FRO-335/FRO-326 and relates to FRO-329; no Ready promotion or comment added.
- Saved specification explicitly requires current Create/Edit input/hidden-state/payload removal with backend delivery, full duplicate storage/input/output retirement, mock-only cleanup preserving existing Order DN Import, and omission-preserving/explicit-clear DN Import updates. Both split paths and nested children, document preservation, acceptance criteria and read-only verification are included.
- Linear updatedAt: 2026-10-22T09:04:39.098Z. No production code, database, branch, UI preview or deployment changes; implementation and post-deployment verification remain future work.

### 2026-10-22 — FRO-346 review; rollout agreed, reminder ownership pending

- Planning git pull --ff-only succeeded. Read current FRO-346, FRO-326/FRO-335/FRO-328, FRO-346 comments (none), current statuses/labels and live production code through authenticated gh. Shared Linear notes endpoint returned tool-not-found; direct issue reads worked.
- FRO-346 is Todo, Order/Pending_Review/Backend/Story, No priority, Pre-releases 0.0.x milestone 0.0.4; blocks FRO-326 (0.0.5), no other relations or attachments. No Linear mutations.
- User accepted Q1: backend contract first; enable combined interaction with FRO-326, preserving separate current actions meanwhile. Canvas/preview skipped: FRO-326 already specifies shared Details/status editing and FRO-335 is the shared visual reference. Production branch explicitly excluded.
- Current update and correction use the same internal identity plus PURCHASE_ORDER_EDIT guard. Header editing additionally permits IN_STOCK; readiness correction permits only PENDING/EXPECTED_READINESS/READY and no open Shipment. Preserve ordinary-only eligibility separately. Current update includes handlingUnits/invoiceRows; new Details intent must not accidentally overwrite independent drafts or readinessRemark. Current API has no expected browser version; locked server version alone does not detect stale drafts.
- Correction accepts a non-null LocalDate for EXPECTED_READINESS with no future-only rule; PENDING clears readiness date/remark, READY preserves them. Do not borrow future-only supplier-response validation. Normal forward journey effects remain distinct from correction.
- Material consumer gap: ReadinessReminderDeliveryService sends reminder recipient/date snapshots without checking current Supplier/status/date; PublicReadinessResponseService validates status/date but not changed Supplier. FRO-328 explicitly excludes scheduled reminders and supplier responses. Scheduler deduplicates missing-date reminders per Order and confirmation reminders per Order/date, not Supplier. Q2 pending: recommend separate linked prerequisite for obsolete queued messages/response links with coordinated FRO-346 release; alternative ownership within FRO-346. No scope expansion approved.
- Draft improvements after clarification: explicit expected-version contract, narrow field intent and ordinary-only IN_STOCK preservation, precise date validation, safe retry/no-op auditing, named consumer outcomes, standalone Context for agents/Decisions and read-only post-deployment checks separated from mutation tests. Existing spec already covers atomicity, confirmation, cancellation, reason, audit and stale-review intent; do not present these as wholly missing.
- Review/interview remains in progress. No new vocabulary/ADR resolved; no UI, code, production database, preview or production branch changes; no implementation/deployment verification claimed.

### 2026-10-22 — FRO-346/FRO-326 comparison and Edit-page retirement decision

- Re-pulled planning repository and re-read full current FRO-346 (updated 2026-10-20T11:09:18.022Z) and FRO-326 (updated 2026-10-21T11:48:51.840Z). Shared Details/readiness correction behavior is aligned: single card editor, conditional confirmation/reason/date, atomic save, independent other drafts, guards and audit.
- User explicitly agreed to remove the separate Edit page. Both saved tickets currently exclude retirement: FRO-326 says retiring the route/migrating unlisted capabilities is follow-up scope, and FRO-346 lists standalone Edit-route retirement as out of scope. Neither ticket has been modified. Proposed ownership remains FRO-326 for page/navigation retirement and retained editing capability coverage, FRO-346 for combined save and explicit coordination. Old URL redirection is a recommendation, not separately confirmed behavior.
- Clarify same-page editing versus a whole-page Save: FRO-326 gives Notes, Collis and Invoice rows independent saves; FRO-346 correctly combines only Details fields/readiness correction. Preserve this boundary and referenced feature contracts; no broadened business editability or new UI required.
- Reminder ownership question withdrawn from this review after user challenged scope: the pre-existing code concern is not introduced by FRO-346, deployed activation is unverified, and no separate ticket/prerequisite is approved. Preserve existing reminder behavior. Repository config disables Resend by default, scheduling follows its enabled setting unless overridden; do not claim automatic reminders are running in production.
- Recommended FRO-346 cleanup: reference final FRO-326 field contract explicitly, clarify retained API consumers versus retired UI route, replace obsolete supersession narrative with final ownership, retain backend-first rollout and clarify draft/version protection without reminder scope expansion. Any writes require complete reviewed drafts and approval. No Linear writes, new UI, production changes or branches.

### 2026-10-22 — FRO-326 retirement draft; Linear write blocked pending exact-text approval

- User requested updating FRO-326 before continuing FRO-346. Loaded frontline-linear-issues, pulled planning repo, re-read target and inspected live Edit route/Details link through gh.
- Prepared four targeted description changes: replace retirement deferral with single-page editing/navigation/old-URL redirect and retained-capability checks; remove retirement exclusion; add acceptance/read-only verification row; add live route source. Preserve creation shared form, separate card drafts/saves, permissions, field removals, existing backend consumers and backend-first rollout. Metadata/relations/11 attachments unchanged; FRO-346 untouched.
- Linear save was rejected by automatic approval review: full revised ticket and exact-text approval had not been provided. No write succeeded. Full proposed ticket saved at drafts/fro326-edit-page-retirement.md and opened for review. Must obtain exact draft approval before retry; do not bypass rejection.

### 2026-10-22 — FRO-326 Edit-page retirement approved, saved and verified

- User approved the complete draft with OK. Applied the four approved description patches to FRO-326 only; saved updatedAt 2026-10-22T10:01:07.485Z.
- Re-read saved issue. Complete description matches approved draft after normalizing Linear issue-mention markup and line endings. Verified unchanged title, Todo, complete Order/Pending_Review/Frontend/Story labels, priority, assignment, project/milestone, documents, exact relations and all 11 attachment identities/titles/unsigned URLs.
- FRO-326 now owns separate Edit-page retirement, navigation replacement, old-URL redirection and retained editing capability checks while preserving independent card saves, backend consumers and creation form. Earlier backend rollout retains the old editing path until Details is ready.
- FRO-346 remains unchanged and its review is the next work. No new UI, preview, production branch, code or database changes; no implementation/deployment verification claimed.

### 2026-10-22 — FRO-346 clarification complete; full revised draft pending approval

- User accepted Q1: manual EXPECTED_READINESS corrections allow past/today/future calendar dates; retain existing correction semantics. Accepted Q2: reject stale ordinary-only and combined saves entirely, retaining drafts and requiring refresh/review.
- Refreshed planning pull and current FRO-346/FRO-326. FRO-346 remains unchanged at 2026-10-20T11:09:18.022Z, Todo, Order/Pending_Review/Backend/Story, 0.0.4, No priority, no attachments, blocks FRO-326 only. FRO-326 approved retirement update is current.
- Prepared drafts/fro346-revised-spec.md: explicit final field/card boundaries, IN_STOCK ordinary-only preservation, expected draft version, correction date/remark rules, atomicity/audit, backend-first rollout and FRO-326 page-retirement ownership. Reminder behavior preserved; no new prerequisite or scope expansion. No new UI, preview or production branch. Existing vocabulary sufficient; no ADR warranted.
- Full draft is being shown in chat for exact-text approval. No Linear writes; all metadata/relations to be preserved. Verification is specification/source review, not implementation or deployed verification.

### 2026-10-22 — FRO-346 approved description saved and verified

- User approved the complete revised specification with ok. Saved drafts/fro346-revised-spec.md to FRO-346; updatedAt 2026-10-22T10:07:58.799Z.
- Re-read independently and verified complete description against approved draft after normalizing Linear issue mentions, bold-marker placement, link formatting and line endings. Verified unchanged title, Todo, complete Order/Pending_Review/Backend/Story labels, assignment, No priority, Pre-releases 0.0.x / 0.0.4, empty attachments/documents and exact relations (blocks FRO-326 only).
- Final specification includes confirmed past/today/future manual correction dates, stale-save rejection with retained drafts, final Details/card boundaries, ordinary IN_STOCK editing preservation, atomic audit and backend-first rollout coordinated with FRO-326's Edit-page retirement. Existing reminder behavior retained.
- FRO-346 review/edit complete. No Ready promotion, new UI/preview, production branch, code or database change. Implementation and post-deployment verification remain future work.

### 2026-10-22 — FRO-336 review; rollout agreed, compatibility decisions pending

- Planning git pull --ff-only succeeded; current FRO-336/FRO-335/FRO-326, target comments (none), team statuses and production sources read. Live main: 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Shared Linear notes endpoint returned tool-not-found; issue reads worked.
- FRO-336 remains Todo, Order/Pending_Review/Backend/Story, No priority, milestone 0.0.4, no attachments/documents, blocks FRO-335. Both redesigns target 0.0.5. No Linear mutations.
- User accepted Q1: backend first; selector with FRO-335. Canvas/preview skipped because linked redesigns own presentation; production branch explicitly excluded. Review uses remote gh source reads from planning workspace, not production implementation/playbook execution.
- Confirmed contradiction: FRO-336 permits date entry to select EXPECTED_READINESS; FRO-335 explicitly requires state selection first and forbids automatic state changes. Recommend aligning FRO-336 to final FRO-335 interaction.
- Current shared transactional creation always writes PENDING, even with date/remark. All REST/GraphQL/MCP adapters call the same service/create DTO. Date has no past/today/future restriction; remark is optional, trimmed, max 1000. New contract needs exact omitted/null/explicit-state and date/remark matrix, and generated contract synchronization.
- Q2 pending: recommend coordinating current caller mapping with backend (date -> explicit EXPECTED_READINESS, no date -> PENDING), versus temporary legacy PENDING-with-date compatibility. This intentionally changes old dated creation behavior and is not yet approved.
- Q3 pending: recommend preserving optional PENDING remarks for existing/API callers while FRO-335 omits them, versus rejecting them on every surface. Q4 pending: recommend explicit authorized READY API selection constitutes confirmation, with UI dialog owned by FRO-335, versus separate API confirmation flag. Recommendations are not decisions.
- Preserve internal/create authority for all initial states (later transitions use edit authority), EXPECTED warehouse stay without invented arrival, direct registration transition to selected state and transactional registration/activity/colli history. Specify concrete readiness events alongside REGISTERED; no fictitious preceding Order transitions.
- READY with zero collis is already agreed. Existing edit supports adding collis to READY; confirmInStock requires nonempty movable collis, storage position and complete warehouse measurements. recordWarehouseArrival separately permits empty collis; do not broaden this ticket to prohibit it. Existing readiness scheduler selects PENDING/no date or eligible EXPECTED date and excludes READY; preserve scheduling rather than imply all later emails are disabled. Deployment activation unverified.
- Review should sharpen safe-test coverage and criterion-specific read-only post-deployment checks, preserve separate attachment upload outcomes from FRO-335, and remove supersession/revision narrative in any final draft. No new vocabulary or ADR earned. Full revised draft and explicit approval are required before any Linear write; no implementation or deployment verification performed.

### 2026-10-22 — FRO-336 compatibility settled; complete draft pending approval

- User accepted Q2: map current Create date to explicit EXPECTED_READINESS, no date to PENDING with backend rollout. Accepted Q3: optional PENDING remarks remain supported for existing/API callers while redesigned Awaiting omits them. Accepted Q4: authorized explicit READY request constitutes API confirmation; no separate flag, FRO-335 retains its single UI confirmation.
- Re-pulled planning repository and re-read FRO-336, unchanged at 2026-10-20T11:09:14.811Z. Loaded frontline-linear-issues for writing. Prepared complete standalone draft: drafts/fro336-initial-readiness.md.
- Draft covers state/date/remark matrix, omission/null defaults, coordinated backend-first rollout, direct registration and colli events, empty Ready versus stock confirmation, create authorization, separate attachment outcomes, preservation rules, acceptance criteria and read-only verification. Aligns date-selection wording with FRO-335 and removes supersession narrative.
- Proposed description-only update preserves title, Todo, Order/Pending_Review/Backend/Story, project/milestone, priority, assignment, relations and attachments. No Ready promotion. Full text is shown for approval; no Linear write yet.
- Canvas/preview and production branch remain excluded. No new vocabulary or qualifying ADR; no production implementation or deployed verification performed.

### 2026-10-22 — FRO-336 approved description saved and verified

- User approved the complete draft with ok. Saved drafts/fro336-initial-readiness.md to FRO-336 and independently re-read the issue; full description matches after normalizing Linear mention/link/bold formatting and line endings.
- Linear auto-added a related-to FRO-326 relation from the description. Removed that unintended addition to preserve the approved relation set, then re-read: all metadata matches the pre-save issue, including Todo, full Order/Pending_Review/Backend/Story labels, milestone 0.0.4, priority, assignment, attachments/documents and relations (blocks FRO-335 only). Final updatedAt 2026-10-22T10:19:04.176Z.
- Approved backend-first rollout, current date-to-Received mapping, optional existing/API Awaiting remarks and explicit READY API confirmation are now in the saved specification, with precise history, stock preservation and verification requirements.
- No Ready promotion, production branch, UI, preview, production code or database changes. Specification review/edit complete; implementation and post-deployment verification remain future work.

### 2026-10-22 — FRO-328 source review; clarification round pending

- Planning pull succeeded and was refreshed before this record. Read full current FRO-328, comments (none), FRO-326/FRO-335/FRO-313 and current team labels/statuses. Shared Linear notes endpoint returned tool-not-found; issue reads worked. Live production source inspected read-only through authenticated gh at 3820e89e8caa341261e2d48bcb282d93e1bb1d03; focused research delegated as required by grilling. No Linear changes.
- Target unchanged at updatedAt 2026-10-20T11:09:21.509Z: Todo, Pending_Review/Frontend/Story/Order/Ready, No priority, Pre-releases 0.0.x / 0.0.4, no attachments; blocks FRO-326 and relates to FRO-335/FRO-313. FRO-326/FRO-335 are 0.0.5; FRO-313 is Canceled. Preserve metadata unless separately authorized.
- Clear conflict: target selects intent by date presence and describes one replaced action; current FRO-326 requires two synchronized persistent buttons (Order status and Available actions), Request only PENDING/no date, Confirm only EXPECTED_READINESS/date, neither for inconsistent combinations/READY/later. Existing manual eligibility also requires weekday, confirmation date window, no pending reminder, and an existing scheduled missing-date reminder for manual Request (existence, not successful delivery). FRO-335 excludes readiness emails on unsaved creation.
- Existing ASK_READINESS_DATE/CONFIRM_READINESS types and English HTML/text templates are verified. REST, GraphQL and MCP single-Order send operations call ReadinessReminderCommandService.sendManual and queue immediately; no prepare/preview contract. Current client readiness-reminder-action.tsx sends immediately. No bulk readiness endpoint found in the reviewed API surface; do not create speculative bulk scope.
- ReadinessReminderRepository stores intent/date/recipient/actor/state, not subject/body/template version. DeliveryService fetches Order number, issues the real response token and renders during delivery. A reviewed-content contract must preserve approved semantic content through queue/delivery and distinguish the generated delivery link. Preview must not invoke token issuer, create a reminder/outbox or revoke existing links. Send must recheck status/date/eligibility/authority and changed Supplier/main contact; stale review cannot silently authorize different recipients/content.
- Pending-reminder uniqueness and provider outbox idempotency do not prevent a repeated manual request after SENT/FAILED. Explicit Send retry/idempotency and truthful queued/sent/failure outcomes need precise acceptance coverage. Current history output does not expose subject/body/template version; do not claim it can prove exact sent content. Keep mutation tests separate from read-only post-deployment verification.
- First-round recommendations remain unapproved: backend contract in 0.0.4 with portal activation/review through FRO-326 in 0.0.5; read-only recipient/subject/body review instead of adding composition/recipient overrides; consistent prepare/confirm requirement for all manual callers with coordinated compatibility, while scheduled reminders and supplier responses retain existing behavior. Resolve these before preparing the complete standalone revised ticket and obtaining exact-text Linear-write approval.
- Canvas/preview skipped because FRO-326 owns presentation and FRO-335 supplies the shared style/creation boundary. Production branch explicitly excluded. Existing Order/Supplier vocabulary suffices; no new glossary term or qualifying ADR. Review/interview remains in progress; no production implementation or deployment verification performed.

### 2026-10-22 — FRO-328 decisions settled; full revised draft pending approval

- User accepted Q1 backend-first 0.0.4 with reviewed portal activation through FRO-326 in 0.0.5; Q2 recipient/subject/body read-only; Q3 prepare plus explicit confirmation for every manual REST/GraphQL/MCP caller, leaving scheduled reminders exempt. Final activation coordinates caller migration; the earlier backend rollout preserves the current interaction, and no direct-send bypass remains enabled after activation.
- Re-pulled planning repository, loaded frontline-linear-issues, re-read current FRO-328/FRO-326/FRO-335 and refreshed authenticated gh source HEAD, unchanged at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Checked delivery/repository/token-issuer implementation for review-content fidelity, retry and preview side effects.
- Prepared complete standalone draft at drafts/fro328-reviewed-readiness-emails.md. It aligns status/date eligibility and persistent-button ownership with FRO-326, names verified existing types/guards, defines preparation binding and explicit confirmation across all manual adapters, stale-context rejection, accepted-confirmation idempotency, atomic queueing, preserved reviewed content and manual pre-delivery stale checks. Real response tokens are generated only for delivery; previews never replace existing tokens. Legacy queued work, scheduled reminders and supplier responses retain existing behavior. Includes source context, acceptance coverage and read-only verification with unavailable evidence reported honestly.
- Proposed description-only update preserves existing literal title, Todo, complete Pending_Review/Frontend/Story/Order/Ready label set, unassigned state, No priority, Pre-releases 0.0.x / 0.0.4, parent/cycle/estimate/due date, empty attachments/documents and exact relations (blocks FRO-326, related FRO-335/FRO-313). Target updatedAt remains 2026-10-20T11:09:21.509Z. No linked-ticket edits or Ready promotion.
- Full proposed text and before/after comparison are being shown for exact-text approval; user decision answers do not authorize saving an unseen draft. No Linear write yet. Canvas/preview and production branch remain excluded. Existing glossary suffices and no qualifying ADR is needed. Review drafting verified; implementation and deployment verification remain future work.

### 2026-10-22 — FRO-328 approved description saved and verified

- User approved the complete displayed draft with "write it". Planning git pull --ff-only succeeded; current FRO-328 was unchanged before saving. Saved drafts/fro328-reviewed-readiness-emails.md with the complete existing label set, then independently re-read the issue.
- Complete description matches the approved draft after Linear issue-mention/link/bold/line-ending normalization. Verified unchanged title, Todo, all Order/Pending_Review/Ready/Frontend/Story labels, unassigned state, priority, project/milestone 0.0.4, parent/cycle/estimate/due date, empty attachments/documents and exact relations (blocks FRO-326; related FRO-335/FRO-313). No status promotion, linked-ticket edits or relation cleanup needed.
- Linear updatedAt: 2026-10-22T10:30:49.499Z. Final specification includes all three accepted decisions, lifecycle/date eligibility, preparation/confirmation across every manual adapter, read-only review, stale-context/content protection, repeat-confirmation idempotency, atomic queueing, delivery/history guarantees, staged rollout and preserved scheduled/response/legacy behavior.
- Ticket review/edit complete. No UI/canvas/preview, production branch, production code or database changes. Implementation and post-deployment verification remain future work.

### FRO-335 design comparison — 2026-10-22
- User approved the implementation plan and implementation model checkpoint, with inline implementation and review before handoff.
- Built local source-based comparison in the existing Site checkout: dist/design-review.html, design-system.css, design-review.js, component-map.md. Existing published index remains unchanged.
- A uses current comfortable tokens; B uses compact tokens. Current-production General-tab reference is explicitly a static illustration with fictional fixtures.
- Verified HTTP 200, node --check, browser rendering, EN/EL switching, and no horizontal overflow at 400px for A and B; browser warning/error log empty. Full interactive prototype QA remains pending.
- Local comparison: http://127.0.0.1:8335/design-review.html. Screenshot in visualization root: fro335-design-comparison.png. Local server retained for user selection.
- Awaiting required design selection; no Linear write, Site deployment, production edit or branch publication occurred. Existing dependency/enforcement blockers remain.

### 2026-10-22 — FRO-335 comfortable preview published; ticket draft awaiting approval
- User chose A, current production comfortable density. Replaced ten accumulated prototype style blocks with portal-preview.css and separated review tooling/result simulation in preview-review.js. Preserved existing private Site identity/audience.
- Implemented confirmed pending-row Save/Cancel gate, final-row removal, partial upload result retention/retry and unknown-response record-check recovery. Tightened all-or-none dimensions, gross/net constraints, DG 200-character limit and exact two-decimal numeric(19,2) pricing validation. Corrected stale row errors/scenario reset and raw invalid numeric input after independent review.
- Ten Node behavior regressions demonstrated prior failures and now pass; inline scripts evaluated by the harness and external JS syntax checked. Browser checks passed for pending gate/focus, final removal, readiness review Cancel/draft retention, loading/empty/error, partial/unknown creation/upload recovery and same-ID retry. EN/EL at desktop and 400px; no page horizontal overflow on checked narrow overview/colli views. Browser error/warning log empty. File chooser/download/remove and file retention through tabs/locale verified with fictional local file. These are prototype checks, not production validation.
- Published private Site version 24 for behavior, then version 25 adding screenshots. Final source 178911e7ab83711a15d671517643efbb4f268873, deployment appgdep_6ad9f224ca78819181ac50ed082741e4 succeeded; same https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site. Hosted page verified after existing ChatGPT sign-in. Screenshots /comfortable-desktop.png and /comfortable-greek-mobile.png, comparison /design-review.html.
- Prepared full standalone draft drafts/fro335-reviewed-create-order.md using frontline-linear-issues. Current FRO-335 still unchanged at 2026-10-21T11:48:51.896Z; Todo, Order/Pending_Review/Frontend/Story, project/milestone and attachment/relations preserved. Current board labels/statuses refreshed. No Linear write before exact-text approval.
- Live main refreshed unchanged: 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Missing target API contracts still block full integration. Rulesets recheck still HTTP403 (plan upgrade/public repository requirement); AGENTS requires verified enforcement, so production branch publication blocked. No production code/branch/commit/push, PR or merge occurred. Planning/implementation model gates accepted; remaining exact ticket/verified branch gates not waived.

### 2026-10-22 — Read-only structural review of pre-releases 0.0.1–0.0.4

- User requested major structural conflicts only and explicitly instructed not to grill. Reviewed all 18 current milestone issues, their relations/comments, project/milestone descriptions, and relevant later UI/operational owners. No interview, design, Linear changes or production writes.
- Planning pull succeeded. Authenticated gh read-only source checks confirmed main 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Linear shared-notes endpoint was unavailable; direct issue reads worked. FRO-306 is Done; its dependency is not an outstanding blocker.
- Main findings are release sequencing/activation gaps, not an incompatible core domain model: FRO-339 requires geography at creation/dispatch in 0.0.2 but owns no UI, delegates correction to FRO-344 (0.0.7), and selectors/display to FRO-341/FRO-316 (0.0.9). Current Shipment input/composer lack those references. Activating strict guards before usable capture/correction can block creation or progression.
- FRO-356 requires explicit regime selection in 0.0.2 without a default while controls are assigned to FRO-335/FRO-326 (0.0.5); current form still has legacy KTA/Bonded fields. An explicit current-form integration or staged activation contract is missing. FRO-303 similarly targets 0.0.1 but references the 0.0.5 Details editor; current Details hides Edit in its additional eligible states and the current edit route is restricted to early states/no active Shipment.
- FRO-303/FRO-307 rely on the shared delivery-note origin rule owned by FRO-357, which is Backlog with no project milestone and only related-to links. The prerequisite needs explicit scheduling/coordination; FRO-306 is already complete.
- No major contradiction found among 0.0.3 field ownership/copy rules or 0.0.4 readiness contracts. FRO-292 and FRO-336/FRO-346/FRO-328 explicitly define backend-first delivery and later presentation/activation; that intentional staging is not itself a conflict. Findings are recommendations, not approved scope or metadata changes. No new vocabulary or ADR.

### 2026-10-22 — FRO-335 approved revision saved
- User approved "Write this revision to Linear". Displayed the complete exact description and metadata, then saved description plus full existing labels. Re-read independently: updatedAt 2026-10-22T11:27:57.835Z; description matches approved text after Linear mention/link/list/escape normalization. Title, Todo, all four labels, project/milestone, complete relations and original preview attachment unchanged.
- No Ready promotion, comment, relation mutation or production branch. Preview version 25 and ticket revision complete. Production branch remains blocked by missing dependency contracts and required ruleset enforcement (403); final branch-diff approval also remains necessary.
- Hosted Site opened successfully using existing ChatGPT sign-in. Authentication provider emitted Turnstile diagnostic warning/error logs during sign-in; the Site's local application QA had no warning/error logs. Do not claim a completely silent authentication flow. Owned localhost server stopped after hosted handoff.

### 2026-10-22 — FRO-335 actual React UI prepared for diff review
- User explicitly requested Sites layout implemented with production React components, tested, diff shown before branch. Prior model checkpoints retained. Refreshed main unchanged at 3820e89e8caa341261e2d48bcb282d93e1bb1d03; production remote github verified; detached isolated clone C:/Users/Giorgos/AppData/Local/Temp/fro335-production-review.
- Implemented new creation/ component group with TanStack Form and actual UI primitives; backward-compatible accessible label hooks for Combobox/DatePicker and named Modal. Current Create route/services/Edit/Details remain active unchanged pending dependency contracts. No fake persistence, backend/API/generated-contract/dependency/infra changes. Clear adapter boundary documented in component README.
- Meaningful initial six-test RED, then 13 passing component tests. Independent reviewer found quantity truncation and stale queued-upload authority; both corrected with regression/browser RED→GREEN evidence. Final suite 40 files/176 tests passed, production build passed, all changed files Prettier clean, diff whitespace and reverse-patch checks passed. EN/EL desktop1440/400 browser component scenarios include pending gate/focus, raw input, notes retention, Ready cancel, files, one Create across upload retries, unknown reconciliation and navigation recovery.
- Baseline limitations: npm ci cannot install mismatched package/lock. Local npm install --package-lock=false used, with no manifest edits. Global format check fails on 266 untouched files; tsc fails only on two unchanged unsafe test casts in delivery-note-service.test.ts:77,81. Node24.13 satisfies engine>=22.13; preferred22.13 not used. Temporary harness produced a createRoot HMR warning, excluded from delivered code; no claim of production integration.
- Full review: drafts/fro335-react-implementation-review.md. Complete 16-file patch in visualization root fro335-react-ui.diff; SHA256 17f2ee26d49d830fb0f5d7e8d0c72859f33af1eb9ae65428fb97d6a105a0264e. Actual React screenshots fro335-react-desktop.png and fro335-react-greek-mobile.png there. Diff opened in Codex. Temporary harness removed and generated route-order churn excluded.
- All production changes UNCOMMITTED; no branch created, no production push/PR/deployment. Awaiting actual diff review; full route integration, baseline failures and enforcement prerequisite remain unresolved. No Linear mutation in this implementation turn.

### 2026-10-22 — FRO-335 approved local branch and commit; publication blocked

User explicitly approved the complete React UI diff and requested branch creation, commit and push, preserving the current Create route, with no merge or deployment. Created the previously absent branch `mock/fro-335-create-order` in `C:/Users/Giorgos/AppData/Local/Temp/fro335-production-review`, owned by this session for FRO-335. Base `3820e89e8caa341261e2d48bcb282d93e1bb1d03`; local commit `34c354d5676340385c50668b1ed3dbbea9986104` (`feat(FRO-335): prepare order creation UI with production components`). All 16 approved paths committed; working tree clean. Current Create route unchanged. Approved patch SHA-256 remains `17f2ee26d49d830fb0f5d7e8d0c72859f33af1eb9ae65428fb97d6a105a0264e`; reverse-apply check passed after commit. No source changes since approved test/build/browser evidence.

Fetched github/main again: base unchanged. GitHub identity frontlineltdproject-star authenticated; github remote verified; remote branch name absent before creation. Rulesets endpoint again returns HTTP403 requiring GitHub Pro/public repository. Planning AGENTS explicitly blocks publication without enforced branch restrictions and with failed required checks. Existing baseline type, global format and clean-install failures remain as documented in drafts/fro335-react-implementation-review.md. User's request approved publication but did not explicitly waive those prerequisites. Production push withheld; local branch and commit retained. No PR, merge, deployment, Linear edit or repository-settings change. Need administrator enforcement and required-check resolution, or an explicit user exception to those publication requirements. A retry must reuse this recorded session-created branch and explicit same-name refspec, never create another branch or force-push.

### 2026-10-22 — FRO-335 branch published under explicit exception

User explicitly authorized an exception to the ruleset enforcement and failed baseline-check publication requirements and requested pushing the existing branch only, with no merge or deployment. Verified clean working tree, approved reverse-patch check and unchanged 16-file frontend diff. Pushed `mock/fro-335-create-order` using `git push github mock/fro-335-create-order:mock/fro-335-create-order` to Frontline-Forwarding/frontline-forwarding. Fetch after push confirmed remote head equals local `34c354d5676340385c50668b1ed3dbbea9986104`; base `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. Remote diff whitespace check passed; approved UI slice and existing Create route unchanged. Branch: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-335-create-order . No PR, merge, deployment, settings change or Linear write. Previously documented test/build passes and baseline type/format/clean-install limitations remain; exception did not resolve those failures or backend adapter dependencies. Full route activation remains future work.

### 2026-10-22 — FRO-335 archived preview linked discreetly

User requested the pre-chat preview accessible through a subtle note at the end of the ticket. Verified Sites version23 (19 October) is source f013e38d5c33371a836599090b94786f3f57cd11; its old deployment returns the current canonical URL rather than an immutable archived URL. Used Sites skill to preserve original v23 HTML/CSS/JS byte-for-byte at dist/archive/v23/original.html plus original assets, with a separate archive wrapper carrying a reference-only/superseded notice and current-preview link. Published archive-only source d555700a1324f8e862ca7f28d38619f7dc391971 to existing owner-private Site; deployment appgdep_6ada1c348d48819192df1d9a27e2a636 succeeded. Current preview files unchanged. Hosted archive wrapper and original form visibly loaded in browser. A MutationObserver error was captured on the earlier local frame load; no archive source uses MutationObserver. Do not claim zero browser errors or change original historical behavior to fix an unattributed diagnostic.

Appended only the authorized italic archived-preview link at the end of FRO-335, using the ticket-writing skill. Re-read saved issue updatedAt2026-10-22T14:23:51.676Z: description equals original plus footer after Markdown URL normalization; title/status/all labels/attachments/project/milestone/relations/assignment/priority unchanged. Archive URL https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site/archive/v23/ . Reference-only edit: no product behavior/requirements change, so no new grilling, canvas or consumer trace. Production React branch, current route and portal untouched; only the separate preview Site published. Synced local approved-description draft with footer.

### 2026-10-22 — FRO-326 workflow review and local UI preparation

- User requested full issue review and production-design-system UI alignment. Planning pull succeeded; target refreshed at updatedAt 2026-10-22T10:19:04.185Z with metadata/attachments unchanged. Current labels/statuses and empty comments checked. Shared Linear notes unavailable (tool-not-found); issue reads work.
- Live production gh access verified at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Read actual theme, design, screen, frame and shared components. FRO-326 prototype CSS conflicts with shared labels/control dimensions/tokens; current FRO-335 explicitly adopts comfortable production styling.
- Cloudflare preflight found broad OAuth rather than Pages-only token. User explicitly authorized continuing review/local UI and deferring publishing. No Cloudflare mutation.
- Focused research under grilling identified stale Pickup unresolved wording, missing later-stage Invoice company and ALK editor integration, incompatible legacy Bonded presentation, and missing combined-correction contract. User accepted Q1 restricted shared editing and Q4 one correction per session. Q2 current Pickup/regime alignment and Q3 navigation discard confirmation remain pending.
- Review and component mapping: drafts/fro326-review-and-ui-preparation.md. Live Tabs unmount inactive panels; final implementation must hoist drafts to preserve tab/language switching. Full interview/design comparison and standalone ticket draft remain pending. No Linear edit, UI artifact yet, production write/branch, hosted change or deployment verification. Existing vocabulary sufficient; no ADR earned.

### 2026-10-22 — FRO-326 local design comparison ready for selection

- User accepted Q2 current Pickup/customs-indicator contracts and Q3 discard confirmation on leaving Details; explicitly asked to continue local comparison. Planning pull succeeded. Added previews/fro326-comparison/index.html, a self-contained static comparison with source-based current Overview illustration and A four-column/B two-column stacked-card directions at comfortable density. No production React integration claimed.
- Read additional live status-pill, lineage badge and Combobox sources at pinned main 3820e89. Comparison mirrors semantic colours, 12px labels, 40px controls, 8px control corners/12px cards. Named fonts use system fallback when unavailable; no remote assets. Restricted edit chooser is explicitly marked as a new composition. Overview and Available actions are comparison scope; other tabs remain labelled references pending selected-direction preview.
- Browser checks: draft retained across tab switch and EN/EL; ALK restricted mode exposed one editable input and preserved its value through language switch; discard confirmation appears; Pickup set/clear retained; loading/unavailable/error/Retry checked. A and B Greek 400px pages had no document horizontal overflow. Browser warning/error log empty. Inline JS node --check passed. These are prototype checks, not production validation.
- Local server outside sandbox: python PID 36124, 127.0.0.1:8327, serving only previews/fro326-comparison. Sandbox server on 8326 was unreachable from app browser and is not the handoff URL. IAB comparison left open. Screenshot: C:/Users/Giorgos/.codex/visualizations/2026/10/22/01a163f5-80c0-7fb3-8999-7cad88dd874f/fro326-local-comparison.png.
- Awaiting A/B selection. Full preview/spec reconciliation and exact-text ticket approval remain future steps. No Linear mutation, hosted publishing, production code/branch or deployment. Cloudflare publishing remains deferred.

### 2026-10-22 — FRO-326 direction A and full local draft

- User selected A and requested full local preview plus complete revised ticket before any Linear update. Publishing remains deferred; no Linear or production mutations authorized/performed.
- Added full.html/full.js/preview.css and component-map.md under previews/fro326-comparison. Six tabs, EN/EL, responsive stacked cards, independent local drafts, restricted one-correction chooser, email preparation/pending simulation, colli and exact invoice arithmetic demonstrations, attachments and Entry Note lookup fixtures. All operations are fictional/local. Production frame, real entity pickers, bundled production fonts and backend transactions remain implementation requirements, not verified prototype integrations.
- Prepared drafts/fro326-revised-spec.md as complete standalone description; preserved existing title, status, labels, project/milestone, relations and 11 attachments. Current target read remained updatedAt 2026-10-22T10:19:04.185Z. Production main remained 3820e89e8caa341261e2d48bcb282d93e1bb1d03.
- Reconciled current Pickup/customs, later-stage Invoice company/ALK, child Owner-reference lock, open-Shipment restrictions, dependency activation, dirty navigation, and read-only postdeployment checks. No additional domain vocabulary or architectural decision needed.
- Checks: node syntax and git diff whitespace pass. Browser exercised DG conditional clearing, exact 0.10 x 3 = 0.30 and invalid precision, failed invoice save retention/retry, inherited Entry Note, email prepare/Send-to-pending shared feedback, restricted correction field locks and leave confirmation. EN/EL mobile overview measured 400px viewport with 385px document width; no page overflow. Browser warning/error log empty. Screenshots saved in task visualization directory. Server on 127.0.0.1:8327; prototype local state resets on reload. No server transaction, delivery, permission or concurrency guarantees tested.
- Full draft awaits exact-text user approval before any Linear write. Cloudflare and production branch publication remain deferred.

### 2026-10-23 — FRO-326 local presentation revision

- User disliked the persistent disabled-readiness explanation, status rendering and expanded collis. Selected compact table rows with a clean two-column expansion. Prepared local revision with contextual reasons, larger rounded-md status, active flag badges, inline dimension inputs, two-column Description/Package and separate optional DG group. No business-rule changes. Status/help styling awaits visual acceptance before final draft reconciliation.
- Planning pull succeeded. Refreshed FRO-326 read and live production DESIGN/theme/StatusPill/Badge/Table through gh. Exact production light-tone values used. Current Linear remained untouched; publishing deferred.
- Node syntax and git diff whitespace pass. Browser inspected desktop status/help and expanded colli edit; DG-off hides conditional fields, Cancel restores saved data. Console warning/error log empty. Screenshots saved as fro326-status-revision.png and fro326-collis-revision.png in task visualization directory. This round did not revalidate full backend or mobile behavior.

### 2026-10-23 — FRO-326 accepted presentation reconciled into full draft

- User said to move on after reviewing revised local preview; treated as acceptance of presentation, not authorization to write Linear or publish.
- Updated full standalone draft with contextual disabled-action explanations, prominent production status badge beside lifecycle action, compact colli rows/active flag badges, two-column expanded fields and separate conditional DG group. Narrow screens require single-column expansion in production. No eligibility, permission, storage or transaction changes.
- Refreshed target: updatedAt 2026-10-22T10:19:04.185Z, Todo, labels Order/Pending_Review/Frontend/Story, 11 attachments. No intervening target change. Complete revised text is pending explicit write approval; preserve metadata/relations/attachments. Cloudflare and production publication remain deferred.

### 2026-10-23 — FRO-326 approved description saved and verified

- User approved the complete revised draft with “ok”. Applied only the approved description and re-passed all existing labels.
- Re-read Linear updatedAt 2026-10-23T06:26:49.637Z. Description matches approved text after normalizing Linear issue mentions, URL formatting and ordered-list indentation. All metadata and relations preserved; all 11 attachment identities/titles/URLs preserved (only expiring signatures refreshed). Status Todo; labels Order, Pending_Review, Frontend, Story unchanged.
- No Cloudflare/site publish, production branch or production writes. Local preview remains at http://127.0.0.1:8327/full.html. Post-deployment verification is pending actual implementation/deployment.

### 2026-10-23 — FRO-326 isolated frontend checkout prepared

- User explicitly authorized frontend preparation in an isolated checkout; no branch creation/push or publishing until diff review. This permits local frontend source edits only; backend/production services remain read-only.
- Planning pull succeeded; refreshed full FRO-326. gh auth/access verified, production main 3820e89e8caa341261e2d48bcb282d93e1bb1d03. No attached reusable worktree. Native worktree tool targets planning repo, so initialized independent checkout at C:/Users/Giorgos/.codex/visualizations/2026/10/22/01a163f5-80c0-7fb3-8999-7cad88dd874f/fro326-frontend, remote github=https://github.com/Frontline-Forwarding/frontline-forwarding.git, fetched main, checked out detached FETCH_HEAD. No local branch created.
- Read root/client AGENTS and playbook/issue-tracker/domain instructions. Initial policy loader failed on Windows charmap output; recovered with PYTHONIOENCODING=utf-8. Successful policy snapshot: committed, HEAD 3820e89e8caa341261e2d48bcb282d93e1bb1d03, SHA256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Resume this snapshot for continuation.
- Production playbook workflow explicitly requires a planning model checkpoint and a separate implementation model checkpoint. Awaiting explicit continue for planning checkpoint. No implementation plan or frontend edits made yet. No production-repository commit, branch, push or publish. Next: after checkpoint, inspect current domain/UI/contracts, prepare coherent frontend-only plan and dependency limits, then separate implementation checkpoint and local verification/diff.

### 2026-10-23 — FRO-326 implementation plan prepared

- User explicitly completed planning model checkpoint; publishing remains deferred. Resumed committed policy snapshot at 3820e89 with fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- Refreshed current issue and comments (empty), inspected current route/detail/actions, Tabs lifecycle, form/service/GraphQL contracts, reminder service/component, shared Card/Table/Popover/StatusPill, and domain/authorization/attachment/Shipment docs. Current API lacks major target contracts: two Notes, nullable Pickup responsibility, explicit regime, restricted correction operations, invoice unit price/versioning and prepared email review; Supplier Invoice/Entry Note routes absent.
- Saved docs/superpowers/plans/2026-10-23-fro326-frontend.md. Proposes supported-now layout/state ownership, read-only compact colli table, contextual help/status work, then owner-dependent integration. Preserve standalone Edit and current functionality until parity; no synthetic API or fake runtime fixtures. This is frontend preparation, not full issue completion.
- Runtime Node24.13.0/npm11.6.2 discovered. Required Intent list succeeded with no intent-enabled packages before dependencies installed; rerun after install. No app test/build/dependency installation or frontend implementation performed in this planning turn.
- Awaiting plan agreement and separate implementation-model checkpoint. Detached production checkout remains clean, no branch/commit/push/PR. Planning-only files synchronized separately per project rules.

### 2026-10-23 — FRO-326 supported frontend implementation prepared

- User approved the plan and implementation checkpoint, explicitly deferring publication and requesting the complete diff before production branch creation/push. Planning pull succeeded; resumed committed production policy at 3820e89, fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- Implemented supported Overview/status/help, compact read-only collis with independent expansion, retained action drafts, discard guard, pending input/duplicate reminder safeguards and EN/EL labels using production primitives. Existing Edit, permissions, attachment provenance and payloads preserved. Full target still awaits linked APIs; see drafts/fro326-frontend-handoff.md.
- Complete 12-file frontend patch (including four new files): drafts/fro326-frontend-preparation.patch. Reverse-apply validation passed; generated route drift restored, backend/schema/manifests/lock unchanged. Production checkout remains detached and uncommitted, no branch/push/PR/deployment/Cloudflare/Linear mutation this turn.
- Final suite40 files/169 tests passed; build passed; changed-file format and whitespace checks passed. Baseline limitations: npm ci manifest/lock mismatch (local no-lock install), two untouched delivery-note test casts prevent typecheck,261 unrelated format failures. Runtime Node24.13.0/npm11.6.2. Independent reviewer pending-input loss fixed with regression; potential help-tab persistence not reproduced; hover/focus click regression separately fixed.
- Actual application fixture preview http://127.0.0.1:8341/secured/purchase-orders/42, fixture API8340, external harness in visualization root/fro326-fixture. Desktop/400px EN/EL, query states, editor/reader, attachment, stock cancellation, draft retention, failed/pending command checks completed. No live backend guarantees verified. Local-only config disables TanStack dev plugins after checks to avoid generated-file drift; production config untouched. Servers need restarting after shutdown.
- Screenshots fro326-app-collis-desktop.png and fro326-app-overview.png in visualization root. Supported-now implementation ready for diff review, not full FRO-326 completion or publication approval. Planning artifacts synchronized separately under project rules.

### 2026-10-23 — FRO-326 heading subtitle removed

- User requested removing Client · Vessel below the Order number in the top card. Removed that paragraph from the local React detail component; verified the running8341 preview shows Order number and badges without the subtitle. Presentation-only change; no domain rule/API/permission change, so no further consumer trace needed. Earlier design choices remain applicable.
- Updated complete frontend patch and validated reverse application. Changed-file Prettier and git diff whitespace passed; previous169-test/build results predate this four-line JSX removal, suite not rerun for this presentation-only change. Screenshot fro326-heading-without-subtitle.png in visualization root. Production checkout still uncommitted/detached; publishing deferred; no Linear edit.

### 2026-10-23 — FRO-326 dependency and UI completion clarification

- User requested current FRO-292/linked-ticket review to distinguish preparable UI from genuine integration blockers; publishing remains deferred. Planning pull succeeded. Read32 current issues (FRO326 plus direct linked/supporting owners), current board statuses/labels and16 relevant comment threads. Production gh verification confirmed main3820e89 still matches detached base; source audit was read-only.
- Review saved at drafts/fro326-dependency-readiness-review.md with consumer/owner matrix, issue metadata snapshot and proposed corrected sequence. Existing plan was too restrictive: Notes and other settled React presentations can be prepared/tested independently; actual live integration remains blocked by owner contracts. Full local fixture composition is proposed, not approved or implemented this turn; fake fallbacks in the normal production adapter remain prohibited.
- FRO292 explicitly owns backend/migration/filtering/versioned notes-only update; FRO326 owns Notes card/editors. Next proposed UI slice includes both independent editors now; integrate when292 delivers. Never split legacy notes into invented external/internal values or send notes-only via current broad update.
- Safe-now omissions confirmed: Vessel/Greece/DN references/Urgent/current warehouse, tab/status/history/comment/reminder presentation and existing authorized lineage. Current source lacks two notes, nullable Pickup, explicit regime/coverage, atomic versioned Details save, restricted corrections, unit-price/revision and prepared-email contracts or target Supplier Invoice/Entry Note routes.
- Newly explicit ownership gap: colli update reconciles whole movable collection and full header without reviewed client revision; omitted rows can be cancelled. FRO297 flags do not establish generic safe row-save contract. Assign owner before live activation; no new ticket or scope change made.
- Milestone conflict: FRO3260.0.5 requires FRO3490.0.6 andFRO3550.0.11. Full scope retained; release sequencing needs alignment, not silent omission. FRO330 is downstream, not blocker. Canceled293/313/314 and stale298/old303 comment must not override current contracts. No new vocabulary/ADR; no Linear, production code, branch, preview or publishing change. Await user decision on proposed full-component preparation path.

### 2026-10-23 — FRO-326 full React UI preparation

- User approved full UI preparation now, Notes first, with missing-contract interactions limited to a clearly labelled local composition. Updated plan; earlier checkpoints remain valid. Publishing remains deferred.
- Added independent Internal/External Notes, Details/restricted review, editable colli/invoice rows, exact totals, shared email review, document action states and six-tab composition. Dev-only loopback entry at http://127.0.0.1:8341/dev/fro326/index.html uses fictional local callbacks and no API requests. The existing supported route remains separate, with retained commands plus missing supported read fields/tab order.
- Complete26-file patch (8 modified/18 new) refreshed and reverse-apply validated. Client-only; no backend/schema/generated/manifests/lock changes. Detached base3820e89 matches freshly fetched main; no production branch/commit/push/PR/Cloudflare/Linear mutation.
- Full suite45files181tests passed; build passed before final mobile-width/dev-HMR/type/doc adjustments. Final changed-file Prettier and typecheck run: only two pre-existing delivery-note casts remain. Full format reports262 unchanged files after generated route restore; dependency mismatch remains prior baseline. Dev fixture excluded from standard build.
- Independent final review five important findings fixed: stale operation eligibility, supplied field locks, explicit customs clearing, stale Details confirm, Escape in row inputs. Tests and browser checks recorded in handoff. Browser verified Notes retention, failure, navigation, customs review, compact/expanded collis, Greek400px, external-reader hiding and correction chooser. Dev HMR root disposal fixed; reload required for earlier duplicate-root session.
- Notes/UI preparation is no longer blocked by292. Live integration still requires292 and other owners; generic safe colli row-save ownership unresolved. Dev history/documents/lifecycle are local review compositions, not completed backend workflows. No claim FRO326 is fully implemented. User can review full UI and diff; publication gate remains closed.

### 2026-10-23 — FRO-326 approved-preview diff review

- User approved the full React preview, then requested diff review/scope explanation with publishing deferred. Planning pull succeeded; refreshed326 and principal owner tickets. gh main remains3820e89. Saved26-file patch reverse-check and tracked whitespace check passed; no code/test/build rerun or production edits.
- Review: drafts/fro326-diff-review.md. Branch contains existing-route improvements, reusable target editors, dev-only fixture composition, opt-in primitives/tests/docs. Full new UI is not yet connected to normal route. History/comments/attachments final assembly is frontend work using current APIs, not backend-blocked.
- Found three local corrections before handoff: current warehouse must show code/position; ALK validation must not block unrelated Invoice company correction; customs controls need draft applicability while preserving incompatible values for explicit resolution. These qualify prior broad preparation-complete wording. Approved visual direction stands; findings not fixed in this review.
- Backend blockers unchanged:292 Notes;346 atomicDetails;303/356 corrections/impacts;333/334Pickup;337invoice;328email;349/355documents and owners; colli safe row-save ownership unresolved. Release milestone conflict persists. No branch/commit/push to production, no publishing or Linear edit. Planning-only records synced.

### 2026-10-23 — FRO-326 three frontend findings fixed

All three findings were corrected locally after explicit user authorization. Warehouse display now uses code and storage position, with EN/EL Unpositioned and the existing no-stay fallback. ALK validation is scoped to affected applicable customs changes or ALK correction, so unrelated Invoice company/ordinary edits can reach authoritative review with legacy ALK unchanged. Inapplicable regime/ALK controls are disabled without erasing draft values; toggling back or returning from review preserves them. Real customs clearing still requires explicit review and the owning backend contract.

Regression tests reproduced six failures before the fixes; all12 focused tests then passed. Full suite45files188tests passed; production build passed (2.28s). Final changed-file Prettier and tracked whitespace checks passed. Typecheck reports only the two unchanged TS2352 delivery-note test casts at77/81. Generated route ordering drift restored. No dependency/schema/backend changes.

The refreshed26-file complete patch and four-file incremental fro326-three-fixes.patch both pass reverse-apply checks. No branch, production commit, push, Linear update or publishing occurred. User explicitly deferred pushing; planning records are saved locally without synchronization this turn.


### 2026-10-23 — FRO-326 local branch and reviewed commit created

User explicitly authorized local branch mock/fro-326-order-details-ui and committing the reviewed26-file diff, while deferring all pushes, PR creation and publishing. Verified the uncommitted patch matched the approved patch byte-for-byte before staging; index initially empty, no active local Git hooks. Created the exact branch at3820e89e8caa341261e2d48bcb282d93e1bb1d03 and committed only26 approved frontend files.

Commit:4f7f9f165bc4980990f9a577af01892aa7f76b77 — feat(FRO-326): prepare Order Details frontend and local review. Post-commit verified expected branch/base, clean checkout,26 frontend-only paths, no upstream, approved patch reverse-check. No implementation changes or repeated tests in this turn; prior188-test/build results apply to identical approved contents. Existing type/install/format limitations and backend blockers remain.

Resumed policy: committed at3820e89, fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Prior model checkpoints/approvals preserved. No remote push, PR, Cloudflare/deployment or Linear mutation. Planning records remain local because pushing is explicitly deferred.

### 2026-10-23 — FRO-326 push protection check blocked

- User requested protection verification and exact push for approval. Planning pull succeeded. Authenticated frontlineltdproject-star has maintain/push permissions, admin=false. Local branch mock/fro-326-order-details-ui is clean at4f7f9f165bc4980990f9a577af01892aa7f76b77. Remote main3820e89 unchanged; target branch absent remotely.
- GitHub main metadata: protected=false, protection.enabled=false, enforcement off. Ruleset listing including parents and effective rules for main/mock branch return403 with a plan-upgrade message. Classic protection endpoint404. Required branch-restricted identity and protection against updating other branches/force/deletion cannot be verified. Do not infer enforcement from branch naming/refspec. No account/repo/rules changes made.
- AGENTS.md4e blocks publication pending administrator configuration and verification of protections, or an explicit user revision to that requirement. Exact deferred command: git push github mock/fro-326-order-details-ui:mock/fro-326-order-details-ui. Not executed; approval is not requested while the protection gate fails. Existing baseline check limitations also remain before publication clearance. No push, PR, deployment or Linear changes. Planning records saved locally under push deferral.

### 2026-10-23 — FRO-326 reviewed branch pushed by explicit exception

- After disclosure of unprotected main, broad maintain access and unavailable rulesets, user explicitly instructed: Go ahead and push even as of now. This overrides the project protection gate for this specific push only; no repository protections or permissions were changed. PR/deployment remain deferred.
- Prepush verified clean branch mock/fro-326-order-details-ui at4f7f9f165bc4980990f9a577af01892aa7f76b77, approved patch match, destination github=https://github.com/Frontline-Forwarding/frontline-forwarding.git, target branch absent remotely and main3820e89 unchanged.
- Executed exact same-name refspec: git push github mock/fro-326-order-details-ui:mock/fro-326-order-details-ui. Push succeeded. Fetched remote branch and confirmed head4f7f9f165bc4980990f9a577af01892aa7f76b77. Main remains3820e89e8caa341261e2d48bcb282d93e1bb1d03. Remote diff contains only26 approved frontend files. No PR, deployment, Cloudflare or Linear mutation. Existing188-test/build evidence and baseline type/install/format limitations remain as reviewed; no code changes this turn.
- Branch URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-326-order-details-ui . Planning records retained locally; authorization was scoped to the frontend branch push.

### 2026-10-23 — FRO-330 deferred until FRO-326 base is merged

- User proposed extending the existing326 branch, with fallback to backlog/wait if risky. Chose the fallback to preserve the reviewed326 handoff and separate ticket scope. No frontend branch or source changes.
- Planning pull succeeded; refreshed full330/current FRO workflow. Status-only change Todo -> Backlog, user-authorized; re-passed all labels. Re-read confirms Backlog and exact preservation of description/title/labels/assignee/project/milestone/priority/relations/attachment. BlockedBy326 retained. No business rule/design change; consumer tracing/canvas not applicable.
- Resume330 from updated main after the relevant326 branch is merged; do not create a stacked branch or add330 to326. No deployment or new push. Planning memory remains local under existing scoped publication deferral.

### 2026-10-23 — FRO-345 review evidence complete; first interview round pending

- Mandatory planning pull succeeded; live gh auth/read verified at production main3820e89e8caa341261e2d48bcb282d93e1bb1d03. Full target/current comments (none), labels/statuses and linked316/341/325/344/326 read. Optional shared-agent-context endpoint unavailable; direct reads work. Target unchanged at2026-10-20T11:09:58.191Z, Todo, Pending_Review/Shipment, milestone0.0.7, No priority, no assignee returned/attachments/documents; original blocks316 and related325/344/326 preserved.
- FRO165 is archived email tagging;316 owns Shipment Details,341 creation. Canvas/preview skipped, no additional UI needed; production branch explicitly prohibited. Grilling/domain-modeling used and focused read-only research delegated under grilling. No production source/database writes, Linear mutations or deployment verification.
- Evidence and consumer impact in drafts/fro345-review.md: exact exception-event lookup/predecessor contract missing for316; canonical cancellation reason absent from current output; root creation/split command correlation; fresh per-invocation UUIDs do not provide caller retry identity; occurrence/recording chronology and incomplete legacy provenance; comment terminal/size/retry/plan-version boundaries; Notes operation scope and lifecycle-owner activation; concrete read-only verification/house metadata gaps.
- Await first-round decisions: recording/command order versus occurrence ordering; terminal-state comments; affected data population and evidence-only backfill scope; proposed existing Order 2000-character comment convention. Recommendations remain proposals; no final replacement ticket until answers, complete shown draft and explicit Linear approval. No glossary/ADR change. Preserve unrelated326 planning and memory changes; synchronize only this review and checkpoint.


### 2026-10-23 — FRO-345 first grill round accepted; Notes operation scope pending

- Planning pull succeeded. User accepted recording/command order with separate occurrence dates, authorized comments in all saved Shipment states including terminal states, and the existing 2,000-character Order comment limit. User confirmed current Shipment data is mock data. No data-reset/deletion authorization is inferred; historical-arrival support still follows FRO-324, while production legacy reconstruction is unnecessary for the confirmed population.
- Re-read FRO-345 unchanged at 2026-10-20T11:09:58.191Z and current FRO-292/FRO-324. FRO-292 permits all-status Shipment Notes edits, preserves readiness/movement, requires actor/time attribution and protects Internal Notes from broader audit outputs. It does not settle whether Notes edits belong in FRO-345's Recorded operations.
- Remaining Q5 proposes one Notes updated operation with changed field names, actor/time and protected audit references, no copied note text in the activity summary; combined saves remain one operation and comments a separate stream. Pending user decision. Review record updated; no final draft or Linear change yet. Preserve all metadata and unrelated planning work. No UI/preview/production branch, code or database change; no new vocabulary/ADR.


### 2026-10-23 — FRO-345 grill complete; full replacement draft awaiting approval

- User accepted Q5: successful Internal/External Notes edits appear once in Recorded operations, with changed field names, actor/time and protected audit references; no note text copied into summaries. Combined saves remain one operation; comments remain separate. All five interview decisions now settled.
- Mandatory pull succeeded. Refetched full FRO-345 and current FRO labels/statuses; target unchanged at 2026-10-20T11:09:58.191Z. Verified live production main unchanged at 3820e89e8caa341261e2d48bcb282d93e1bb1d03. No new glossary term or qualifying ADR.
- Complete standalone draft: drafts/fro345-reviewed-spec.md. Includes accepted ordering, terminal comments, 2,000-character limit, mock-data boundary and Notes activity; exact status-event/predecessor reads, canonical exception reasons, root/source correlation including child splits, atomic retry/outcome contracts, protected historical facts, integration ownership and acceptance-mapped read-only verification.
- Proposed Linear update is description-only: preserve title, Todo, Pending_Review/Shipment, assignment/priority, project/milestone, blocks316, related325/344/326, no blockers and empty attachments/documents. References to292/324 do not authorize new relations; preserve the reviewed set after any save-induced additions. No Ready promotion.
- Updated review with before/after comparison outside the proposed description. Checked all original operation categories/protections and five accepted decisions against final draft; pending complete-text approval before any Linear mutation. Canvas/preview and production branch skipped. No implementation/deployment test or production write. Synchronize only345 files and345 memory entries, preserving unrelated326/330 work.


### 2026-10-23 — FRO-345 approved revision saved and verified

- User approved the complete displayed draft with "ok". Mandatory planning pull succeeded; full fresh FRO-345 remained unchanged at 2026-10-20T11:09:58.191Z. Saved exact drafts/fro345-reviewed-spec.md content and re-passed both existing labels.
- Independent re-read matched the complete approved description after Linear issue-mention/link/list normalization. Save automatically added related FRO-324/FRO-292/FRO-341; removed only those additions under the explicit metadata-preservation approval and independently re-read again.
- Final verified description and metadata: unchanged title, Todo, Shipment/Pending_Review, unassigned, null delegate/estimate/parent/cycle/due date, No priority, Pre-releases 0.0.x / 0.0.7, blocks316, related325/344/326, no blockers, empty attachments/documents. UpdatedAt 2026-10-23T13:06:53.505Z. No Ready promotion or linked-ticket edits.
- Updated drafts/fro345-review.md with completed workflow and verification receipt. No production code/database write, UI/preview/branch or deployment action. No new glossary/ADR. Synchronize only this345 receipt and memory entry; preserve unrelated planning changes.



### 2026-10-23 — FRO-344 evidence review; first interview round pending

- Mandatory planning pull succeeded; live gh authentication/read verified. Production main advanced to 38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e; inspected current delivery-note changes and Shipment code/schema via gh. Full FRO-344/current board metadata and linked165/316/341/325/339/345/303/357/323 read; target has no comments and remains updated2026-10-20T11:09:54.879Z, Todo, Pending_Review/Shipment, milestone0.0.7. No Linear edits.
- Review at drafts/fro344-review.md includes consumer/owner trace. Gaps: unresolved draft fiscal reconciliation, reserved-Order partial-reduction conflict, separate route/membership sequencing dead end, immutable removal/re-add history and schema close guards, retained upcoming eligibility, release status, empty-overpack resolution, physical-history preservation, retries/version integration with345, origin fiscal eligibility and release timing.
- Grilling/domain-modeling applied; focused read-only research delegated per grilling. First round asks draft reconciliation, partial reduction, combined-origin limitation and overdue retained upcoming cargo. Recommendations are proposals, not accepted decisions; final replacement draft and approval gate remain pending.
- FRO165 is archived email tagging;316/341 own relevant UI. Canvas/preview skipped; production branch prohibited by user. No production code/database writes, deployment or new UI. No vocabulary/ADR resolved. Optional Linear agent-context endpoint unavailable; direct issue reads worked. Preserve unrelated326/330 local planning changes; synchronize only this review and checkpoint.


### 2026-10-23 — FRO-344 first decisions accepted; fiscal follow-up pending

- User accepted Q1–Q4: atomic affected draft-goods/group/totals reconciliation; explicit atomic partial reduction of stocked reserved Orders with retained goods in a participating child; separate route/membership editors and cancellation/new creation for impossible combined-origin changes; retained upcoming reservations survive elapsed expected dates while readiness still requires stock.
- Planning pull succeeded; current FRO-344 unchanged at2026-10-20T11:09:54.879Z; live main remains38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e. Updated drafts/fro344-review.md. No new vocabulary/ADR or Linear change.
- Pending Q5: explicitly review/correct affected draft route values and save atomically with route correction, using316 integration. Pending Q6: explicit removal of wholly unsubmitted drafts if a valid origin change becomes fiscal-ineligible, with audit and protected submitted history. These remain proposals, not approved requirements or permission for current record deletion. Complete replacement and Linear approval remain pending; no UI/production branch/code/database change.


### 2026-10-23 — FRO-344 all decisions accepted; complete replacement awaiting approval

- User accepted Q5/Q6: explicit review/correction of affected draft route values saved atomically with route edits; explicit removal of wholly unsubmitted drafts on lost origin eligibility, with retained audit and no replacement. Protected fiscal states remain unchanged. These specify future behavior, not production deletion authorization.
- Mandatory planning pull succeeded. Refetched full344 and current FRO statuses/labels; target unchanged at2026-10-20T11:09:54.879Z. Live main remains38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e. Applied frontline-linear-issues.
- Complete standalone draft: drafts/fro344-reviewed-spec.md. Reviewed all original boundaries/ownership and six decisions; covers exact partial/release semantics, fiscal reconciliation, source/packing/history consumers, version/retry integration, release timing and AC-mapped read-only verification. Before/after comparisons remain outside ticket text in drafts/fro344-review.md and chat.
- Description-only proposal preserves title, Todo, Pending_Review/Shipment, all other metadata/relations and empty attachments/documents; no Ready promotion. Await approval of complete displayed text before any Linear write. No UI/preview, production branch/code/database change or deployment verification; no new glossary/ADR. Synchronize only344 draft/review/checkpoint, preserving unrelated326/330 work.


### 2026-10-23 — FRO-344 approved replacement saved and verified

- User approved the complete displayed draft with "ok". Mandatory planning pull succeeded; full fresh344 remained unchanged at2026-10-20T11:09:54.879Z. Saved exact drafts/fro344-reviewed-spec.md content and re-passed Shipment/Pending_Review.
- Independent re-read matched the full description after Linear mention/link/list normalization. Save auto-added related297/303/295/357/323; removed only those additions under approved metadata preservation, then independently re-read again.
- Final metadata comparison has no changes: title, Todo, both labels, null assignment/delegate/estimate/parent/cycle/due date, No priority, project/milestone0.0.7, blocks316, related343/341/292/339/326/325/345, no blockers, empty attachments/documents. Final updatedAt2026-10-23T13:30:52.704Z. No Ready promotion or linked-ticket changes.
- Review receipt saved in drafts/fro344-review.md. No UI/preview, production branch/code/database write or deployment verification. No new glossary/ADR. Synchronize only344 receipt/checkpoint; preserve unrelated planning changes.

### 2026-10-23 — FRO-326 current React preview link added

- User explicitly requested adding the current preview link. Inserted current laptop-only URL http://127.0.0.1:8341/dev/fro326/index.html and pushed branch link under Preview and exclusions, with local-run source path and clear fixture/integration limitations. Hosted publication remains deferred. No product behavior change; consumer tracing/design round not applicable.
- Re-read verifies requested insertion after Linear link-angle normalization, all11 attachment identities/URLs preserved apart from refreshed signatures, all labels/status/title/project/milestone/priority/assignee/relations preserved. No branch/source/deployment changes. Planning records remain local under prior scoped push deferral.

### 2026-10-23 — FRO-326 shared React preview prepared; scoped token pending

- User authorized publishing the current React preview and updating326 with shared link, production deployment deferred. Planning pull succeeded. Wrangler4.152.0 whoami verifies Front Line account but broad OAuth permissions; no process/User/Machine CLOUDFLARE_API_TOKEN. User explicitly chose to configure Pages-only token, not waive the credential rule. No Cloudflare write or Linear update attempted pending credential.
- Built isolated hosting artifact outside production checkout at visualization root/fro326-shared-preview/dist using reviewed branch components and copied fixture entry. Removed DEV/loopback guard only in the external copy, renamed banner/title Shared React preview, retained fictional local effects; no normal app/backend/server/config/dependency edits. Production Git checkout remains clean. Standard branch dev-only exclusion remains unchanged.
- External Vite config uses existing dependencies/react/tailwind, explicit sources, no env/public files, no sourcemaps. Build passed; bundle audit no backend endpoint/config. Local Python default MIME initially served JS text/plain causing blank screen; corrected external preview server8354 MIME. Packaged preview default/loading/error and colli tab checked; console error log empty. Final favicon data URI avoids404. Hosted QA still pending after upload; no shared URL yet. Existing fixtures/ENEL/controls preserved.
- Deployment plan remains new fro-326-hex6 Pages project only, using scoped Pages Edit token, pages project list before create/deploy. Never touch existing Cloudflare objects. After upload verify actual shared URL/states/mobile/network then update326 narrowly and reread metadata. Token must never be recorded in repo/chat/logs. Resume with token from authorized environment (User variable may need importing into tool process); no further publishing approval needed once token available.

### 2026-10-23 — FRO-343 evidence review; first interview pending

- Mandatory planning pull succeeded; live gh authentication/source and Linear reads verified at main5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Full343/comments (none), current board labels/statuses and316/341/326/335/324/325/336/342 read. Target unchanged2026-10-20T11:10:12.558Z; Todo, Shipment/Pending_Review/Backend/Story, milestone0.0.8, blocks341, related322/324/325/344/316, no blockers/attachments/documents. No Linear mutation.
- Grilling/domain-modeling applied, with skill-required read-only delegated Order research. Review and consumer trace in drafts/fro343-review.md: save/abandonment, initial-state336 ownership, normal versus historical eligibility,342 creation context/attempt recovery and file isolation, exact return/readback, draft versus persisted reservation, ordinary reminder effects, audit correlation and activation timing. Current source creates PENDING; direct READY/EXPECTED_READINESS is planned336 behavior. Current two-days Shipment error is stale against today/future computation.
- Pending first decisions: independent Order save, both Preparing/Arrived coverage, reuse336 three-state contract, editable workflow-specific opening-warehouse defaults. Recommendations remain proposals. Return-selection and historical chronology details depend on these answers. Current324/342 historical-upload wording and pending324 review require reconciliation, not assumptions or edits here;336 upload wording is older than approved342/335.
- Canvas/preview skipped because341/335 own inline presentation and316/326 saved Details. Production branch explicitly excluded; no production code/database/deployment changes. No new glossary/ADR. Full replacement and any metadata changes require complete-text approval. Synchronize only343 review/checkpoint, preserving unrelated326/330 local changes. Optional Linear agent-context endpoint unavailable; direct issue reads succeeded.
- Final refresh:324 approved replacement is now saved (updated2026-10-23T14:20:09.829Z), establishing matching EXPECTED-stay reuse, mismatched opening rejection and historical342-upload integration. Consume that saved contract; reconcile remaining342/341 wording before activation. Concurrent planning commit included343 review; verify checkpoint separately.

### 2026-10-23 — FRO-343 first decisions accepted; return selection pending

- User accepted Q1–Q4: save each Order independently with its selected files; retain it on Shipment abandonment/failure with ordinary saved-Order rules; support Preparing and historical Arrived; reuse336/335 initial states without automatic stock/readiness; suggest editable origin/receiving opening warehouse when known.
- Mandatory pull succeeded. Refreshed343/324/342/336;343 unchanged2026-10-20T11:10:12.558Z and main remains5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Historical rules follow saved324; retries/atomic files follow342, with separate Order and Shipment contexts. No repeated approval requested for those settled contracts.
- Updated drafts/fro343-review.md. Q5 pending: automatically select complete eligible collis once on confirmed return; otherwise preserve saved identity with reason and require explicit later selection. Replays must not reselect deliberately removed goods; no draft reservation or freeze. Full replacement/Linear approval still pending. No glossary/ADR, UI/preview, production branch/code/database or Linear change. Preserve unrelated planning changes.

### 2026-10-23 — FRO-343 interview complete; full replacement awaiting approval

- User accepted Q5: auto-select whole eligible nonterminal set once on confirmed return; saved/not-selected for incomplete context/ineligibility/read failure; explicit later selection; replay never reverses deliberate deselection; draft selection has no reservation. All five decisions settled.
- Mandatory planning pull succeeded; full343 and current FRO labels/statuses refreshed.343 unchanged2026-10-20T11:10:12.558Z; main remains5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Applied frontline-linear-issues; complete draft at drafts/fro343-reviewed-spec.md, review/consumer/before-after checkpoint updated.
- Draft consumes336 initial states,342 separate creation/file/recovery contexts,325 normal participation and324 historical operation. Covers explicit save/abandonment, draft versus reservation, stable return identity, one-time selection, permissions/audit, compatible activation and AC-mapped read-only verification. No new glossary/ADR.
- Description-only proposal preserves full title/status/labels/assignment/priority/project/milestone/relations/empty attachments/documents; no Ready promotion. New mentions do not authorize relation additions; preserve approved relation set after save. Await complete-text approval before any Linear write. No UI/preview/production branch/code/database/deployment changes. Synchronize only343 files/checkpoint, preserving unrelated work.

### 2026-10-23 — FRO-343 approved replacement saved and verified

- User approved complete displayed text with ok. Planning pull succeeded; fresh343 unchanged2026-10-20T11:10:12.558Z. Saved approved drafts/fro343-reviewed-spec.md and all four existing labels.
- Independent re-read matched description after Linear mention/bold/link/list normalization. Save auto-added related336/335/342/326; removed only those additions under approved metadata preservation. Second independent read confirms full approved text and zero metadata differences, including original blocks341, related322/324/325/344/316, no blockers, all labels, Todo, milestone0.0.8 and empty attachments/documents. Final updatedAt2026-10-23T14:34:08.855Z.
- Receipt recorded in drafts/fro343-review.md. No Ready promotion, linked-ticket modification, UI/preview, production branch/code/database or deployment action. No new glossary/ADR. Synchronize only343 receipt/checkpoint, preserving unrelated work.

### 2026-10-23 — FRO-323 review and interview complete; replacement awaiting approval

- Mandatory planning pull succeeded; live gh/source and Linear reads verified at main5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Full323/comments(none), current labels/statuses and316/341/324/325/343 read. Target unchanged2026-10-23T13:30:52.471Z; preserve Todo, Shipment/Pending_Review/Backend/Story, milestone0.0.8, original blocks341/related320/316/325/324 and one preview attachment.
- Findings/consumer matrix in drafts/fro323-review.md; complete proposed replacement in drafts/fro323-reviewed-spec.md. Missing complete current-Order context outside source/pages, Order-wide allocation restrictions, earlier-review staleness protection, route/count distinction,324 historical closed/null facts, stale display prescriptions and coordinated activation addressed.
- User accepted Q1 renewed review on attribution/current-Order scope changes while retaining identities/unrelated draft; Q2 compatible341/structural activation without milestone changes; Q3 origin-availability counts with separate combined-route validation. No additional business frontier identified; full draft awaits explicit write approval. No Linear changes.
- Canvas/preview skipped because341 owns selection and316 saved Details; production branch explicitly excluded. No production writes or deployment tests. Remote production guidance read; no checkout-local loader/policy fingerprint claimed. Optional Linear agent-context unavailable. No new vocabulary/ADR. Synchronize only323 review/spec and this checkpoint; preserve unrelated326 memory/files.

### 2026-10-23 — FRO-323 approved replacement saved and verified

- User approved the complete displayed replacement with ok. Mandatory planning pull succeeded; fresh FRO-323 matched reviewed baseline2026-10-23T13:30:52.471Z. Saved drafts/fro323-reviewed-spec.md and all four existing labels.
- Independent re-read matches approved description after Linear issue-mention/link normalization. Every other returned metadata field is unchanged except expected updatedAt2026-10-23T14:59:26.642Z: title, Todo, labels, priority, project/milestone0.0.8, blocks341, related320/316/325/324, no blockers, one preview attachment and no documents. No automatic relation additions or cleanup needed.
- Receipt updated in drafts/fro323-review.md. No Ready promotion, linked-ticket edits, UI/preview changes, production branch/code/database writes or deployment. Planning records synchronized separately; preserve unrelated326 work.

### 2026-10-26 — FRO-299 reviewed, rewritten and verified

- Mandatory planning pull succeeded; gh verified at main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. FRO-299 was not produced by the workflow: it targeted the retired Create-shipment wizard steps (live headings `3. Optional repacking` / `5. Review shipment`), duplicated FRO-316's Optional repacking rows/labels, and had no owner for colli measurements on Shipment Details (`ShipmentContent` lacks them). Comments none.
- Decisions (Q1–Q14, all accepted): FRO-299 owns the colli measurement read contract (Shipment read + creation candidates, GraphQL/REST; MCP summary unchanged) and display requirements; FRO-316/FRO-341 own UI. Shown value = most recent WAREHOUSE_CONFIRMED measurement at any warehouse (covers split children whose measurements stay on the parent stay), else declared; dimensions and gross resolved independently; muted Declared / Δηλωμένο marker; `—` when absent; current values, no dispatch snapshot. Candidate declared fields and Declared gross counter keep declared meaning. Load-unit inputs get visible labels with units (existing EL strings). Net weight/notes inputs, gross > 0 validation and locale formatting out of scope.
- Canvas/preview skipped: FRO-316 preview already shows both outcomes. No production branch (user instruction). No new glossary term or ADR.
- User approved the full draft (drafts/fro299-reviewed-spec.md). Saved title "Shipment packing — show colli measurements and load-unit units", labels Pending_Review/Shipment/Backend/Story (Ready removed), added related FRO-325/FRO-341. Re-read verified: Todo, Chris, Pre-releases 0.0.x / 0.0.9, no priority, no attachments; blocks FRO-316; related FRO-300/FRO-325/FRO-341; no automatic relation additions. updatedAt 2026-10-26T08:07:41.772Z.
- Follow-ups (separate reviewed edits): FRO-316 ownership table should list FRO-299; FRO-300 should reference FRO-299's measurement fields; FRO-341 Creation review should consume the resolved values/markers.

### 2026-11-03 — Shipment purpose and delivery-note eligibility reopened for discovery

- User requests understanding current Shipment purpose before deciding when delivery-note drafting/issuance is allowed. Operational examples supplied: import collection from arrival location needs a note; a third-party land hub-to-hub transfer does not. Exact routes, issuing responsibility, and meaning of third-party remain unresolved; examples are not a complete eligibility rule.
- Read-only gh main confirmed 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. ShipmentPurpose has NETWORK_TRANSFER, THIRD_PARTY_TRANSFER, DELIVERY_TO_LAUNCH_STATION, DELIVERY_TO_VESSEL. Shipment purpose selects destination/arrival semantics; AADE DeliveryNoteMovementPurpose is separate. Workflow documents warehouse arrival AWAITING_IMPORT then separate IN_STOCK confirmation; external-agent transfer completes delivery rather than warehouse intake.
- Fresh FRO-357 remains Backlog/Pending_Review and restricts notes to Frontline-operated Greek origins independent of purpose. FRO-303 references that contract. Fresh FRO-322 remains Backlog/Pending_Review and owns deferred Import/Export category independent of purpose/status. User's import example may require revising the earlier eligibility boundary; no ticket or glossary rule superseded yet.
- Step 1 discovery ongoing; compare physical legs, warehouse custody, import/export category and document responsibility before deciding stage gates. No Linear or production changes; no UI design or branch requested. Linear issue reads succeeded; optional get_agent_context unavailable (tool not found). Preserve unrelated drafts.

### 2026-11-04 — FRO-244 structural discovery started

- User requests structural entity planning only: no UI, preview or production branch. Describes legacy vessel/Order selection, combined invoice rows, four invoice types, editable PACKING LIST subtitle, party text, date, packing/weight, computed full total and manual partial total (currencies default EUR), four print variants and 10–90% discount choices. CEO clarification: document accompanies one Shipment to declare goods value, independent of the Orders' invoicing companies. Name and whether to update FRO-244 remain decisions for the interview.
- Mandatory planning pull succeeded; gh authenticated production reads and Linear access verified. FRO-244 current Backlog/Pending_Review, assignee Chris; contains Shipment linkage, Client/Notes/Enable invoice/gapless-ID requirements and four embedded templates that must be resolved/preserved explicitly. No Linear writes.
- Read FRO-317/360/359: FRO-360 is the Import concept review; FRO-359 owns Import structure. Existing glossary distinguishes Orders, physical collis, transport pieces, Supplier Invoices and customs declarations. Do not conflate this document with client billing.
- Inspected all five user PDFs locally (text and rendered pages); no sample customer details copied into this repository. HS is a per-row column; partial variants omit unit/line prices but retain overall value; sample 4 reduces prices/totals by 10%. These samples do not establish multi-row HS, discount persistence, currency conversion or historical snapshot rules.
- Live-code discovery: Order invoice rows have no colli allocation; Shipment partial-selection child receives copies of all parent invoice rows unchanged. Must resolve how to represent only travelling goods before automatically deriving value. Same-vessel restriction is purpose-specific, so do not assume all Shipments have one vessel.
- First-round proposals, not decisions: update FRO-244 with retained UI requirements deferred; name Shipment Invoice; require one Shipment without fiscal-company grouping; clarify one/multiple documents and whole/selected goods; decide PDF backend scope. Later rounds must cover split quantities, snapshots, fields/defaults, currencies/rounding, partial value, discount, numbering, permissions/lifecycle, packing/weight and migration. No new term or ADR finalized.

### 2026-11-04 — Shipment Invoice first-round answers

- Accepted Q1: update FRO-244 as Shipment Invoice — entity & business rules, retaining templates and deferring UI requirements. Accepted Q2: exactly one required Shipment; explicitly includes import shipments, without grouping by Order invoicing company. Accepted Q5: entity/operations/calculations/read contracts only; backend PDF generation later. No Linear write approved yet.
- Q3: user wants freedom to print any variant; whether one Shipment may have multiple saved Invoice records remains unclear. Do not interpret print freedom as approved record cardinality.
- Q4: user explicitly reserves partial-shipment invoice-row allocation for separate work/FRO-301. Proposed (not approved) known colli assignment plus explicit unknown when suppliers provide no allocation, with family unknown rows offered alongside known rows. Do not treat unknown as physically present or automatically count/copy it into every child shipment. Whether one supplier line can span multiple collis also remains for that separate review.
- Fresh FRO-301 read: Backlog/Pending_Review/Order; blocks FRO-302; currently requires exactly one colli per row and no unassigned saved row. Its migration instruction flags unresolved mappings, but it provides no durable unknown-allocation workflow. Its narrative that rows stay behind conflicts with the reviewed main code copying all rows to shipment split children. FRO-301 needs its own review; no changes authorized in this session.
- Added accepted Shipment Invoice term to CONTEXT.md. Next round: clarify saved-record multiplicity and agree dependency treatment of unresolved allocation, without expanding this ticket to solve FRO-301. Any suggestions for unknown candidate handling remain proposals.

### 2026-11-04 — Shipment Invoice allocation boundary and finalization accepted

- Q6 accepted: FRO-301 owns allocation; FRO-244 consumes its eventual agreed rules, with partial-shipment handling unresolved until that work is settled. Continue other entity planning; no independent allocation solution or FRO-301 edit authorized.
- Q7 accepted: a Shipment may have multiple independently saved Shipment Invoices with their own fields, though user has no concrete use case yet. Full/partial and HS variants are representations of the same entry, never separate entities merely because the print choice differs.
- Q8 clarified current legacy behavior: rows are fetched live from the Order; the earlier saved-at-creation snapshot recommendation was not accepted as-is. Q9 accepted revised model: live source rows during preparation, explicit Finalize freezes document contents, and printing alone does not finalize. Correction/reopening rules, print eligibility for drafts and discount handling remain undecided.
- Mandatory pull succeeded; FRO-244 re-read unchanged (2026-09-28T16:40:27.399Z; Backlog/Pending_Review). No Linear writes. Next round addresses finalized corrections, discount ownership and mixed-currency calculation; later rounds still need field requirements, numbering, permissions, Shipment safeguards and rollout.

### 2026-11-04 — Shipment Invoice correction, currency and dynamic discount decisions

- Q10 accepted: finalized records remain unchanged; corrections cancel with a reason and create a linked replacement. Roles, draft cancellation and detailed safeguards still need decisions.
- Q12 accepted: first version requires selected invoice rows to share one currency; full-total currency derives from those rows. No mixed-currency conversion or arbitrary full-total currency relabeling. Partial-total currency/value rules remain to resolve.
- Q11/Q13: user explicitly retains current dynamic discount behavior. Finalization freezes base rows and undiscounted amounts, not the print-time discount choice. Discount changes displayed/printed amounts without modifying source Order rows or frozen base values. One finalized entry may therefore yield different discounted print totals. Full/partial and HS options also remain representations of one entry.
- Retaining print settings or generated PDFs belongs to the later printing ticket, explicitly deferred by the user. Do not promise exact reproduction of an earlier discounted print from the entity alone. Q13 overrides the earlier proposal to freeze discount at finalization.
- Pull succeeded; FRO-244 unchanged on fresh metadata read. No Linear write. Next: resolve Client/header and party fields, packing/weight scope, partial total and field requirements. Preserve existing templates and defer UI without silently dropping legacy requirements.

### 2026-11-04 — Shipment Invoice party fields and partial-total uncertainty

- Q14: user confirms FRO-244 is correct; Client was omitted from their initial description. Retain its Client selection and Shipper autofill behavior (Front Line details initially, selected client's invoice information on selection). Exact Client versus Invoice-to reference semantics still need reconciliation; do not silently rename or infer grouping by Order invoicing company.
- Q15 accepted: Shipper, Consignee, Agent and Notify are editable multiline document text, locked on finalization. Q16 accepted: packing/weight describe selected goods, manual entry available initially; automatic coverage rules remain dependent on allocation and shared packaging.
- Latest Q17 explicitly replaces the interrupted answer: user does not know why Partial invoice total is editable while Full is calculated. Do NOT record the earlier statement that only selected rows change as a decision. Purpose of manual partial total, currency relationship, and discount application remain unresolved; do not convert to a computed total or invent a reason.
- Planning pull succeeded; fresh FRO-244 metadata unchanged. No Linear edits. Propose retaining the known legacy manual field provisionally and marking its business semantics for office confirmation before Ready; that proposal is not yet accepted.

### 2026-11-04 — Shipment Invoice CEO clarification list

- Q18 accepted: partial total purpose remains open for CEO/office confirmation; provisionally retain legacy manual amount/currency, not a settled calculation. Confirm when/why it differs from full total and how discount applies before Ready.
- Q19 accepted: retain general multiline Notes, editable in preparation and frozen at finalization; printing inclusion belongs to the later print contract.
- Q20 corrected by user: legacy form has TWO checkboxes, Show sum table and Enable invoice. Both purposes are unknown. User requests grouping both with partial-total questions to ask CEO and return. No approval to remove either, infer default values, or replace Enable invoice with finalization/cancellation.
- CEO clarification should establish what each checkbox changes on screen/PDF or record behavior, defaults, whether choices are saved per entry or print-time, and interactions with full/partial, HS and discount. Request contrasting examples if available. Keep these as open business questions; no Linear edits or Ready promotion. Other structural discovery can resume independently.
- Planning pull succeeded; checkpoint only, no production changes. Existing unrelated draft changes preserved.

### 2026-11-05 — FRO-244 partial total and print controls clarified

- The user confirmed retaining the manually editable partial invoice total as in the legacy portal. Keep manual amount/currency (legacy default EUR) while preparing the entry, then freeze the base values at Finalize. This resolves the provisional field decision. The dynamic discount treatment of the manual amount on partial prints still needs a printing-contract decision.
- Show sum table controls PDF output: unchecked omits the final Total weight / Grand total value summary table. This describes footer visibility only. Default, persistence and any other effects were not established. Preserve this requirement for the future printing ticket.
- Office instruction for Enable invoice is to always leave it checked, consistent with the existing ticket's checked default. What unchecked does and whether any workflow depends on it remain unknown. No decision to remove it or equate it with Finalize/cancellation. Suggested handling pending review: assume enabled in the ordinary workflow and investigate the legacy unchecked path before implementing a user-facing toggle.
- Current FRO-244 read: Backlog/Pending_Review. Discovery continues; no Linear write. Next independent decision: when to allocate the continuous printed document number, given the accepted draft/finalized lifecycle and cancellation/replacement rules.

### 2026-11-05 — FRO-244 printed number assigned on finalization

- Q21 accepted after comparing delivery-note preparation and issuance: save the Shipment Invoice draft with its internal ID. Successful explicit Finalize assigns the next printed Shipment Invoice number and freezes base contents together. Saving, abandoning or previewing a draft consumes no printed number. A cancelled finalized record retains its number; a finalized replacement gets a new one.
- The comparison concerns timing only. No AADE integration or delivery-note numbering series was approved. Scope/reset of the Shipment Invoice sequence and the first number at cutover are still open. No starting number inferred from legacy PDF examples. No Linear write.

### 2026-11-05 — FRO-244 shared numbering sequence and starting value

- Q22 accepted: all finalized Shipment Invoices share one continuous printed-number sequence across Clients, import and export movements, all four invoice types and calendar years. Allocation occurs on Finalize under Q21.
- The legacy portal continues issuing numbers. The office will specify the first number for the new portal later at cutover. Keep this a required rollout input before first live finalization; do not infer it from a sample PDF or today's legacy counter. Historical import scope remains a separate decision. No Linear write.

### 2026-11-05 — FRO-244 rollout scope accepted

- Q23 accepted: FRO-244 covers only Shipment Invoices created in the new portal. Any need to migrate or retrieve legacy Shipment Invoices through the new portal is separate follow-up work. No migration ticket requested. Q22 continuity of numbering at cutover still applies; office supplies the first live number later.
- Discovery continues with access and lifecycle rules. No Linear write.

### 2026-11-05 — FRO-244 staff access accepted

- Q24 accepted: staff-only access. Front Line operators and managers may view Shipment Invoices, create and edit drafts, and finalize them. Cancelling a finalized Shipment Invoice requires a manager or system administrator and a recorded reason. Draft abandonment and the effect of linked invoices on Shipment cancellation remain separate decisions.

### 2026-11-05 — FRO-244 Shipment cancellation safeguard accepted

- Q25 accepted: before a Shipment can be cancelled, staff must explicitly discard every linked Shipment Invoice draft and cancel every linked finalized Shipment Invoice. Operators or managers can discard a draft; a manager or system administrator cancels a finalized invoice with a recorded reason. Cancelled finalized invoices keep their printed numbers and Shipment references. Once these prerequisites are met, ordinary Shipment cancellation rules still apply.

### 2026-11-05 — FRO-244 Shipment stage eligibility accepted

- Q26 accepted: staff may create and finalize a Shipment Invoice for any non-cancelled Shipment, including after departure or arrival. This supports late paperwork and replacement invoices. Apply the same Shipment eligibility to both actions alongside the ordinary invoice-specific guards and staff permissions.

### 2026-11-05 — FRO-244 whole-Order invoice-row selection accepted

- Q27 accepted for a whole Order travelling in the linked Shipment: selecting the Order includes all its invoice rows by default. During preparation staff can deselect individual rows. The undiscounted full invoice total sums only the included rows, under the agreed single-currency rule. Partial-shipment allocation remains separate FRO-301 work. Q27 does not decide whether selected rows may overlap across independently saved invoices or how later source-row additions affect an existing draft.

### 2026-11-05 — FRO-244 overlapping invoice rows accepted

- Q28 accepted: separate Shipment Invoices for the same Shipment may include the same source invoice row. Warn staff and identify the other invoice; the warning does not reserve the row or prevent inclusion. This applies to distinct saved documents; print variants still belong to the same entry. No Linear write.

### 2026-11-05 — FRO-244 changes to source rows during preparation

- Q29 accepted: the draft preserves the operator's row selection. Changes to selected source row quantities or prices flow through to draft values and the recalculated full total. Newly added eligible Order rows are offered for explicit selection. Removal of a selected source row requires staff to review the selection before finalization. Finalized base contents follow the previously agreed snapshot rule.

### 2026-11-05 — FRO-244 required Agent at finalization

- Q30: user added Agent to the required finalization fields. A draft may have a blank Agent; Finalize requires nonblank Agent text, alongside Shipment, Client, invoice type, date, Shipper, Consignee, packing details, total weight and at least one eligible selected row. Notify, Notes and subtitle may be blank. The manual partial total may be blank for a full invoice.

### 2026-11-05 — FRO-244 Client decision, structural draft and follow-up ideas

- Q31 accepted: derive the common commercial Client where present; on mixed-Client Shipments select a represented Client. Staff choose that Client’s invoicing company to prefill editable Shipper. Goods selection remains Shipment-wide. FRO-317 groups Exports by invoicing company (foreign procedure by invoicing company + Supplier); it does not define Shipment Invoice grouping.
- **Separate idea — one commercial Client per Shipment.** Consider enforcing at creation and membership edits; a single Client can still have several invoicing companies. Assess existing mixed-Client Shipments and dependent workflows before adopting. Proposal only; no new issue or change to Shipment rules authorized.
- **FRO-301 follow-up — explicit unknown colli allocation.** Suppliers may continue giving no row/package breakdown. Explore keeping a traceable unknown allocation, even for new rows; for partial shipments offer known rows for travelling collis and relevant unresolved Order-family rows separately, without double-counting full copies or guessing quantity. Review multi-colli supplier lines, splits, remainders and duplicate inclusion across siblings. Live FRO-301 currently requires exactly one colli per row, flags unresolved migration cases, and blocks FRO-302. No FRO-301 rewrite authorized.
- Other FRO-244 follow-ups: standalone create/list/edit and Shipment Create Invoice shortcut; printing including four output variants, dynamic discounts, rounding, manual partial total interactions, Show sum table, Enable invoice investigation and retention; optional automatic packing/weight once coverage is reliable; legacy retrieval/import only if needed. Cutover start number is an input to FRO-244, not a new ticket idea.
- Draft: drafts/fro244-shipment-invoice-structure.md. Four existing template uploads retained with unsigned URLs. Current FRO-244 metadata fetched; propose title/description only, no relation or label change. Complete draft pending user write approval. Source main 5774931b9869247f0247013111a452552403f456 checked via gh. No Linear or production changes.

### 2026-11-05 — FRO-244 approved and verified in Linear

- Applied the reviewed title and body from drafts/fro244-shipment-invoice-structure.md to FRO-244, Shipment Invoice — entity & business rules. Issue: https://linear.app/front-line-ltd/issue/FRO-244/shipment-invoice-entity-and-business-rules
- Re-read the saved description and checked it against the reviewed draft after Linear formatting normalization. All four PDF upload IDs, names, paths and sizes match. Linear automatically linked FRO-301 on save. Removed that automatic relation to restore the approved six relations and re-read at 2026-11-05T10:45:36.795Z. Confirmed body, original metadata, Backlog / Pending_Review, Chris and all relations. Structural planning handoff only. FRO-301 and the one-Client idea remain separate follow-ups.

### 2026-11-05 — FRO-301 whole-row allocation for now

- Q1: for now, treat a supplier invoice row as a whole for colli allocation. No quantity or value split across multiple collis in the first version. The user has not observed a real example; revisit if the office encounters one. This is a provisional product scope decision, not a claim that physical contents can never span collis. A colli may still contain several whole rows. The question concerned allocation, not physically splitting a colli or preventing partial Order shipments.
- Next decision: whether an entire row may be saved with its colli explicitly unknown and assigned later when identified. Unknown-row eligibility during a partial shipment is a later decision. Linear draft/edit pending.

### 2026-11-05 — FRO-301 explicit unknown allocation accepted

- Q2 accepted: staff can save a new whole supplier invoice row as Colli unknown when the package breakdown is unavailable. Keep its full quantity and value; staff can later assign the same row to the identified colli. Unknown is a normal ongoing business case. Added the term to CONTEXT.md.
- Still open: how a partial shipment exposes relevant unknown rows from the Order family, what evidence permits inclusion in a Shipment Invoice, and how to avoid duplicate quantities or values between sibling movements. No Linear edit.

### 2026-11-05 — FRO-301 unknown colli on a partial shipment

- Q3 accepted: offer relevant Colli unknown rows from the split Order family separately from rows assigned to participating collis. Include an unknown row in a partial Shipment Invoice only on explicit staff confirmation that the whole row's goods travelled on that Shipment. This confirmation leaves the colli unknown. An unconfirmed candidate contributes no quantity or value to the document.
- Next decision: whether a confirmed whole row is attributed to the travelling split child for subsequent sibling eligibility while preserving source identity and allowing later onward legs. Existing FRO-244 permits overlapping documents for the same Shipment with a warning. No Linear write.

### 2026-11-05 — FRO-301 confirmed row follows the travelling child

- Q4 accepted: explicit confirmation that a whole row travelled on a partial Shipment attributes it to the travelling child Order, preserves the original source reference and leaves the exact colli unknown. Exclude it from the remainder's candidates. It follows the travelling group on a later leg when that group travels together. A second partial split within that group is a separate case for Q5.

### 2026-11-05 — FRO-301 confirmation on a later partial split

- Q5 accepted: if a previously confirmed travelling group splits again and the row's exact colli remains unknown, require fresh staff confirmation for the onward subset before including its value on that Shipment Invoice. Until resolved, retain the row within the previously confirmed group. Earlier exclusions of sibling branches still apply. When the entire confirmed group moves together, Q4 applies.

### 2026-11-05 — FRO-301 confirmation during packing

- Q6 accepted: staff may confirm before departure that the goods on a whole invoice row are packed in the selected group of collis, while the precise colli remains unknown. The confirmation supports preparation of the accompanying Shipment Invoice. Actual departure remains a separate Shipment dispatch event. Handling later changes to the selected group is still open.

### 2026-11-05 — FRO-301 packing changes after group confirmation

- Q7 accepted for draft Shipment Invoices: removing a member of the previously confirmed group requires fresh staff confirmation that the row's goods are still travelling before finalizing a draft that includes the row. Adding other collis or repacking while all confirmed collis stay on the Shipment preserves the original confirmation and its original group. Handling an affected already-finalized invoice remains a separate decision.

### 2026-11-05 — FRO-301 pre-departure removal after invoice finalization

- Q8 accepted: if an invoice includes a row confirmed within collis A/B and staff want to remove B before dispatch, allow removal when staff confirm the goods are in A and the finalized document still describes the departing goods accurately, including its packing details and weight. The finalized document remains frozen. If removal would make it inaccurate, a manager or system administrator must cancel the affected invoice with a reason before removal. Staff can then issue a linked corrected replacement under FRO-244. Where whereabouts are still unknown, the confirmation needed for the first path is missing. No Linear edit authorized at this stage.

### 2026-11-05 — FRO-301 correcting a contradicted allocation

- Q9 accepted: when a warehouse finding contradicts an earlier group confirmation, retain the original confirmation and record who corrected the allocation and why. Identify affected Shipment Invoices for review. A finalized invoice that declared goods which stayed behind follows FRO-244 cancellation and linked replacement. The physical finding does not silently rewrite an issued document.

### 2026-11-05 — FRO-301 duplicate colli correction versus genuine removal

- Q10 clarified: preserve the supplier invoice row for a confirmed duplicate colli record. A whole row has at most one assigned colli. If it is already on the surviving record, deleting the other duplicate needs no row operation. If it is on the record selected for removal, preserve the same row by reassigning it to the confirmed surviving colli; the presence of a second colli record does not itself transfer the assignment. No duplicate row, quantity or value. This describes the intended result, not a new automatic duplicate-detection feature.
- Genuine removal of a colli with assigned goods and no surviving duplicate is a different scenario. Whether its row should be retained or removed is explicitly unresolved. Do not generalize the duplicate decision to real goods removals or to removal of a colli from one Shipment.

### 2026-11-05 — FRO-301 manual allocation correction and original removal rule

- Q10 resolved: employees identify duplicate colli records and manually reassign any rows they want to keep before removing the redundant record. No automatic comparison, duplicate detection, merge or row transfer. Keep the existing FRO-301 rule for removal of a colli record: if it still has assigned invoice rows, warn before removal; confirmed removal removes those attached rows with the colli. A row assigned elsewhere is unaffected. This is distinct from removing a colli from a Shipment or moving it to a child Order. Previously agreed finalized Shipment Invoice history/correction rules still apply. No Linear edit.

### 2026-11-05 — FRO-301 invoice row entry paths

- Q11 accepted: allow staff to enter a whole supplier row as Colli unknown on the Order's Invoice rows tab and assign it later. When the colli is known at entry, staff can add the row directly from that colli on the Collis tab. The Invoice rows tab therefore needs an entry path for unknown rows alongside the Order overview. No Linear write.

### 2026-11-05 — FRO-301 migration deferred

- Q12: defer migration decisions for invoice rows already saved in the new portal when FRO-301 goes live. Suggestion only: preserve each row and its Order, quantity, currency and value, and leave the colli unknown until confirmed. No migration or backfill rule approved. Carry this as a deferred note in the proposed rewrite, outside acceptance criteria. The accepted Colli unknown entry path for new rows stands. No Linear write.

### 2026-11-05 — FRO-301 structural ownership confirmed

- Q13 accepted: FRO-301 owns row allocation, source identity, partial Order splits, confirmation and correction rules, and the data/operations consumed by callers. Order UI tickets implement the agreed known/unknown entry paths. Verified Order Creation FRO-335 and Order Details FRO-326 both expose Collis and Invoice rows tabs. Their current descriptions do not constitute implementation of the revised allocation behavior. No edits to either UI ticket authorized. Skip canvas, preview and production branch for the structural FRO-301 rewrite.
- Remaining structural distinction: explicit allocation/confirmation during packing versus permission to edit the source row's commercial fields during shipment participation. Resolve this before drafting operation permissions.

### 2026-11-05 — FRO-301 allocation updates during packing

- Q14 accepted: staff may resolve or update physical allocation during packing while the Order has open Shipment participation, including changing Colli unknown to a confirmed specific colli. This is a separate allocation operation. Preserve existing commercial row edit restrictions, including quantity and value. Earlier audited-correction and finalized-document safeguards apply.

### 2026-11-05 — FRO-301 cancellation preserves packing attribution

- Q15 accepted: cancellation before departure retains the child Order and the row's confirmed physical allocation. A row confirmed only to its group remains Colli unknown within that child; a known assignment stays with its specific colli. Later movement or contrary information can be handled by correction. Cancellation is not evidence that the goods departed.

### 2026-11-05 — FRO-301 split reconciliation accepted

- Q16 accepted: distinguish confirmed travelling value, confirmed remaining value and value awaiting allocation. Count each source row once across the split, including unresolved rows. On confirmation move the whole row amount from awaiting allocation to the confirmed side. Preserve the original total for reconciliation with the supplier paperwork. Unknown exact colli can coexist with confirmed travelling group.

### 2026-11-05 — FRO-301 unresolved allocation at dispatch

- Q17 accepted: an unresolved invoice-row allocation does not itself block physical dispatch when ordinary Shipment dispatch requirements are met. Include only confirmed selected goods in the Shipment Invoice. Keep unresolved rows visible for later confirmation and count them once in reconciliation; dispatch alone supplies no evidence about which side contains their goods.

### 2026-11-05 — FRO-301 Q18 and structural draft for approval

- Q18 accepted: reconcile travelling, remaining and awaiting-allocation amounts separately per source currency. Draft synthesizes Q1–Q18 in drafts/fro301-invoice-row-allocation.md. New suggested title: Order invoice rows — colli allocation and partial shipments. Body/title only, preserve Backlog, Pending_Review/Order, existing blocks FRO-302 and relatedTo FRO-287, remaining metadata. No Linear write pending explicit approval of exact text. Both Shipment and Order child-creation services call copyTo on live main 5774931. Migration suggestion deferred. No UI or production branch.

### 2026-11-05 — FRO-301 approved structural rewrite saved and verified

- Applied the reviewed title and drafts/fro301-invoice-row-allocation.md to FRO-301. Verified the saved text against the draft after Linear formatting normalization. Linear automatically added related links to FRO-326, FRO-335 and FRO-244. Removed those additions under the approved metadata-preservation scope. Final re-read at 2026-11-05T11:31:05.994Z confirmed Backlog, complete label set Order/Pending_Review, unassigned, no project or attachments, blocks FRO-302 and related to FRO-287. Migration deferred. No implementation or deployment. https://linear.app/front-line-ltd/issue/FRO-301/order-invoice-rows-colli-allocation-and-partial-shipments

### 2026-11-05 — One commercial Client per Shipment discovery started

- User resumed the saved Shipment membership idea: all participating Orders share their commercial Client, with different invoicing companies allowed. Live main 5774931b9869247f0247013111a452552403f456 checked via gh: creation validates common vessel for DELIVERY_TO_VESSEL but has no equivalent Client equality check. The delivery-note workflow explicitly combines destination choices across participating Orders' Clients. FRO-240's singular Client entry is not a cross-Order eligibility rule. FRO-317 addresses fiscal grouping; FRO-244 supports choosing a represented Client on mixed Shipments. No verification of deployed release or live data population.
- First decision for discussion: scope across Shipment purposes, especially consolidated network transfers. Subsequent review must cover membership edits, existing mixed Shipments and downstream document behavior. No new Linear issue created or existing issue edited.

### 2026-11-05 — Shipment Client rule pending office input

- User will ask the office whether all Shipment purposes require one commercial Client, including a shared warehouse transfer. No rule adopted. Verified on production main 5774931: V18__shared_client_vessels.sql and database.md allow one vessel ID to be associated with multiple CLIENT companies (unique client/vessel pair). Orders record their own Client. Common vessel therefore does not establish a common Client; actual occurrence in operational data was not checked. Ask separately about same-vessel deliveries for different commercial Clients and shared transfers before defining scope.

### 2026-11-05 - Shipment membership and multi-origin Orders (discovery)

- Compared the proposed single commercial Order across partial Shipments with production main 5774931 via gh. Shipment content already identifies each colli and its Order at loading; the database separately limits each Order and each colli to one open movement. Confirmed in-stock partial selection puts the selected identities on a same-origin child and retains the balance on the parent.
- Open business question: should one commercial Order remain intact when different collis are simultaneously at different stages and origins (China and Korea to Japan)? This would require independent physical tracking and review of Order-level warehouse stays, status, documents and FRO-301 allocation. No decision or ticket change.

### 2026-11-05 - Agent stock lists and colli-level physical status (discovery)

- User tentatively expects one Order number across independently moving collis. In the observed third-country case the office first saw the goods already in stock on the agent stock list; paperwork identified different inbound AWBs for collis on the same Order. Transit was not monitored by the office.
- Reviewed current FRO-326 and production main 5774931. Distinguish confirmed receipt/custody from reconstructed movements, aggregate Order display from action eligibility, and supplier readiness promises before colli identities exist from confirmed readiness of particular goods. Whether recording a receipt should require an inbound Shipment and the necessary detail at receipt remain open. No ticket change.

### 2026-11-05 - Order-first workflow for uncommon splits (discussion)

- User emphasized that splits are uncommon and wants to preserve the familiar Order workflow. Discussed keeping normal Order-level actions and summarizing underlying collis, exposing affected groups when custody/status or action scope differs and inbound AWBs on demand. Distinguish real child Order lineage from separately moving collis. Exact reveal rule and first-receipt flow remain proposals.

### 2026-11-05 - Historical Shipment creation and colli identity (discussion)

- Re-read FRO-343 and FRO-324: inline Order and colli registration persists independently; the later Shipment save writes participation. AWB belongs to Shipment, historical arrival requires the complete eligible Order and stock confirmation is separate. Independent inbound movements for subsets would require revised historical eligibility, custody and stock confirmation, not a mandatory Shipment ID on colli creation. No rule change approved.

### 2026-11-05 - Indicative field impact for partial historical arrivals

- Reviewed main 5774931 database schema and current FRO-324. Proposed explicit stay-to-colli coverage, Order physical summary reads and historical subset validation. Current stay uniqueness is per Order; content already tracks colli, Shipment and Order at loading. Separate decisions for concurrent outgoing movements and readiness. No schema choice or scope approved.

### 2026-11-06 - Independent colli movement Q3-Q4 accepted

- Q3 accepted: staff may edit an eligible colli independently while siblings travel, subject to its own reservation/document safeguards and shared-field impact checks.
- Q4 accepted: retain existing child Orders; user confirms they are mock data. No automatic merge. Future movements use the new scope within their existing Order.
- Consumer trace identified current DeliveryNoteDraftSourceService expanding participating Orders to all active nonterminal collis. New scope must use Shipment contents. FRO-356 and PurchaseOrderCustomsService assume shared Order customs facts and one occupied warehouse. Customs coverage and separate admission rules require a business decision before the draft is complete.

### 2026-11-06 - FRO-360 and FRO-359 removed from pre-releases

- At the user's explicit request, cleared the Pre-releases 0.0.x project assignment on FRO-360 and FRO-359. Re-read both issues and verified no project, unchanged descriptions, titles, Backlog status, priorities, assignees, complete label sets, attachments and relations. No product behavior or production changes.


### 2026-11-06 - Milestone 0.0.12 alignment and child-Order impact review

- User requested alignment of FRO-244 and FRO-301 with FRO-362, then scheduling when ready; accepted grouping all three structural tickets in 0.0.12. No milestone or Linear mutation yet; exact drafts and Ready metadata remain to be reviewed.
- Cancellation of FRO-302 proposed but NOT approved. User asked whether FRO-362 removes child Orders generally and raised dependent-ticket impact. FRO-362 removes automatic movement-driven children only; existing children/history and deliberate separation remain. Live FRO-330 lineage display and FRO-319/355 inherited admission coverage still have valid consumers. FRO-325/344 automatic split behavior and FRO-341 partial-selection UI need coordinated adaptation; 325/344 now Done, 341 Todo. Do not interpret Done as deployment or silently rewrite completed tickets.
- Live main 5774931 confirmed via gh: both Shipment partial-child creation and deliberate Order splitting call invoice-row copyTo with full quantity/value. Alignment must preserve stable source rows and deliberate separation without duplicated commercial amounts. FRO-244 must consume exact Shipment colli coverage plus allocation. Pending FRO-302 disposition and consumer alignment scope before readiness.


### 2026-11-06 - FRO-301 and FRO-244 ready in 0.0.12; FRO-362 deferred

- Supersedes the earlier three-ticket milestone proposal. User explicitly approved FRO-301 and FRO-244 only for developer handoff under the existing child-Order model. Created Pre-releases 0.0.x milestone 0.0.12 (00ef3bb7-8240-41af-b187-3def86ea9a49), with allocation first and Shipment Invoice integration afterward. UI/printing remain separate; existing-row migration and first live invoice number remain activation/cutover inputs.
- Set both issues to Todo and replaced Pending_Review with Ready, preserving other labels (FRO-301: Order/Ready; FRO-244: Ready), descriptions, embedded templates, assignees, priorities, attachments and relations. Re-read verified project/milestone and unchanged fields. Chris remains assigned to FRO-244; FRO-301 remains unassigned.
- FRO-362 stays deferred in Backlog/Pending_Review with no project/milestone. FRO-302 remains unchanged, including its FRO-301 dependency. Verified both updatedAt values unchanged. No alignment to FRO-362, cancellation, production code or deployment performed.


### 2026-11-06 - Shipment Invoice create-page workflow started

- User requested a new UI ticket for the FRO-244 create page using AGENTS.md. Existing FRO-244/FRO-301 remain Ready in 0.0.12 under the child-Order model; FRO-362 stays deferred. Duplicate search found no dedicated Shipment Invoice create-page issue.
- Preflight: authenticated gh read succeeds and repository reports push permission; Linear read succeeds. Wrangler whoami reports broad OAuth, not the prescribed Pages-only token. User explicitly authorized continuing interview and local preview, deferring publication; approved HTML can be attached to the future ticket for others to download. No Cloudflare resource changes or production branch work authorized.
- Next: interactive create-page decisions, then component-mapped local HTML directions and full ticket approval. No new business decisions, issue creation or preview implementation yet.


### 2026-11-06 - Shipment Invoice create page Q1-Q3 accepted

- Q1: Create draft only; success opens the saved Shipment Invoice Details page, where review and finalization belong. The separate Details ticket is a delivery dependency; no finalization or printed-number allocation on the create page.
- Q2: No Orders or invoice rows initially selected. Explicit Order selection includes all its eligible rows, with individual deselection afterward, preserving FRO-244 ordering and currency rules.
- Q3: Show unresolved allocation rows separately. Physical allocation confirmation belongs to the Order allocation interface; refresh eligibility on the invoice create page to include subsequently confirmed rows. Track the allocation UI dependency explicitly; no silent allocation writes during invoice preparation.
- Live main 5774931 reconnaissance found no Shipment Invoice implementation or dedicated Shipment picker. Reuse portal Card/FormField/Textarea/DatePicker/Combobox/Table/Checkbox/Modal/Button primitives. Remote Shipment search and grouped row selection/totals require mapped compositions. No design file or Linear write yet.


### 2026-11-06 - Shipment Invoice create page Q4-Q6 accepted

- Q4: Invoice type defaults to Invoice and document date to today, both editable. PACKING LIST subtitle and EUR for the optional partial amount retain FRO-244 defaults. Packing details and weight remain blank for manual entry.
- Q5: Changing invoicing company replaces untouched Shipper prefill automatically. If Shipper text was edited, offer Replace with company details or Keep my text; never silently overwrite edits.
- Q6: Allow changing Shipment. If the form contains work, require confirmation; confirmed change clears goods, company selections, party text, packing, weight, partial amount and notes, then applies normal defaults for the new Shipment. Cancel preserves all work.
- Remaining UI decisions: mixed-currency selection behavior, unsaved-form exit and allocation-page return/refresh. Local layout options follow the interview. No Linear write.


### 2026-11-06 - Shipment Invoice create page Q7-Q9 accepted

- Q7: Keep mixed-currency row selections visible, flag conflicting currencies, suppress combined total and disable Create draft until one currency remains. No conversion or silent deselection.
- Q8: Cancel asks before discarding unsaved changes; return to originating Shipment, else previous page with Shipments-list fallback. Warn before closing/reloading a changed form.
- Q9: Open the relevant Order allocation interface in a new tab. Refresh eligible rows preserves document fields and still-eligible selection, flags selected rows that lost eligibility, and leaves newly eligible rows unselected.
- User requested the local HTML preview. Preparing two fixture-only directions using live portal components; canvas-design unavailable so using the AGENTS.md manual HTML fallback. Publication remains deferred; the eventual approved HTML is intended for a downloadable Linear attachment. No Linear write.


### 2026-11-06 - Shipment Invoice create local preview delivered

- Created previews/shipment-invoice-create/index.html as a self-contained, fixture-only HTML preview with A stacked cards (recommended) and B compact tabs; component-map.md records live component sources and approximations. EN/EL, seven scenarios, business notes, new-component markers and simulated draft/allocation flows included. No backend connection or persistent save.
- Headless Edge verified 56 combinations (two widths, two languages, two directions, seven states), without page errors, external requests or document overflow. Verified initially empty selection, mixed-currency blocking, field/selection preservation on refresh, newly eligible rows unselected and stale selected rows removed. Desktop and Greek mobile screenshots inspected.
- Local preview served on loopback port 8765 and opened in Codex. Awaiting layout feedback; no design approval, Linear write, Cloudflare publication or production branch change. The HTML can be downloaded and opened directly offline.

### 2026-11-06 - Shipment Invoice layout A approved; UI ticket draft prepared

- User approved A stacked cards and requested the UI ticket with downloadable HTML; explicitly requested AGENTS.md UI/mock-branch workflow. Local draft: drafts/fro244-create-page-ui.md. Proposed new child of FRO-244, Backlog/Pending_Review/Story/Frontend, Pre-releases 0.0.x milestone 0.0.12; no Linear write or Ready approval yet.
- Live FRO-244 and board metadata refreshed; no dedicated create-page duplicate found. Production main remains 5774931. Draft records FRO-244/FRO-301 backend dependencies plus separate Details and allocation UI delivery gaps. FRO-362 deferred and FRO-302 unchanged.
- Attachment plan after ticket approval: standalone HTML, component map and selected-A desktop/mobile screenshots as issue Resources. No Cloudflare publication required by user. Full final ticket approval precedes writing; UI implementation follows verified ticket write, then separate audited-diff approval before mock branch creation/push under AGENTS.md.

### 2026-11-06 - FRO-363 created with verified attachments; mock preparation checkpoint

- User approved the complete UI ticket and four attachments and requested continued mock preparation. Created FRO-363 Shipment Invoice — Create page UI (e98afc57-3fab-4eb5-a330-7c3b79ce617c), child of FRO-244, Pre-releases 0.0.x / 0.0.12, Backlog, Story/Frontend/Pending_Review, unassigned, no priority. Blocked by FRO-244/FRO-301. Re-read verified description against approved draft after normalizing Linear formatting, complete metadata and attachments. Removed automatically created related links to FRO-362/FRO-302 so relations match approved scope.
- Uploaded shipment-invoice-create.html, component-map.md, desktop.png and mobile.png to issue Resources. Downloaded all four and verified SHA-256 equality against source files. Ticket URL: https://linear.app/front-line-ltd/issue/FRO-363/shipment-invoice-create-page-ui.
- Created isolated detached worktree at C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b0de-d032-7e31-a043-531adf58aa3a/fro363-frontend from C:/ffx/fro350. github remote verified https://github.com/Frontline-Forwarding/frontline-forwarding.git. Base 5774931b9869247f0247013111a452552403f456. No application changes, branch, commit or push in production repository.
- Loaded production playbook via python -B .ai/load_guidelines.py start --issue FRO-363: committed policy SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc, HEAD 5774931. Root/client AGENTS read. Mandatory planning-model checkpoint now pending: remind user to check selected model, wait for explicit continuation before drafting implementation plan. Separate implementation checkpoint follows agreed plan. Resume same snapshot, do not rerun start.
- Publication blocker: gh api repos/Frontline-Forwarding/frontline-forwarding/rulesets returned HTTP 403, Upgrade to GitHub Pro or make this repository public to enable this feature. Mandatory ruleset enforcement cannot be verified; no permission/configuration changes performed. Local preparation is allowed but publication blocked under planning AGENTS.md step 4e until resolved. Backend and Details/allocation UI dependencies remain explicit.

### 2026-11-06 - FRO-363 planning checkpoint accepted; implementation plan ready

- User explicitly continued after the planning-model checkpoint. Resumed saved FRO-363 playbook, same base 5774931 and committed fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Full current ticket refreshed, no comments. No Linear mutations this turn.
- Inspected live frontend form/component catalogue, theme, localization, test/build configuration, and domain/authorization guidance. Current base has no Shipment Invoice API. Plan uses unmounted real portal components with UI-only presentation interfaces and isolated fixture callbacks, not invented production APIs or business calculations.
- Plan saved drafts/fro363-frontend-plan.md: three slices (fields/layout, goods/guards, browser verification/handoff); dependency order, exact files, component map, state/locale/viewport test coverage and activation boundary documented. No separate documented Base/Version/Sync workflow found. Dockerfile prescribes pnpm 11.1.3 frozen-lockfile installation; Node standard 22.13.0. Intent list succeeded, no enabled packages before install; repeat after installation.
- No application implementation, branch, commit or production push. Plan agreement and separate implementation-model checkpoint now pending. Ask user to review plan and check model suitability for implementation, then explicitly continue. Publication enforcement blocker remains unchanged.

### 2026-11-06 - Shipment Invoice edit-page workflow started

- User requested a separate UI ticket for FRO-244 editing while FRO-363 create-page work continues in another chat. Refreshed FRO-244/FRO-363 and searched current issues; no dedicated Shipment Invoice edit UI found in returned results.
- Planning pull and live gh/Linear read checks passed. Cloudflare uses broad OAuth; user explicitly approved a downloadable local HTML preview instead of hosted publication for this task.
- Interview pending: draft-edit-only versus combined Details/edit scope, saved draft Shipment reassignment, and save/exit behavior. No product decisions, Linear changes or production changes yet.


### 2026-11-06 - FRO-363 UI mock implemented and locally verified

- User accepted implementation checkpoint and authorized approved plan. Executed in detached main 5774931 worktree, using committed playbook fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. No production branch/commit/push. Fourteen new client feature files; unmounted real-component UI, test fixtures only, no backend/schema/auth/dependency changes.
- Frontend mock includes layout A, TanStack-owned document fields, ordered goods selection, eligibility refresh, company/Shipment/discard dialogs, async generation guards, host navigation blocker contract and saved-identity preservation on navigation error. Existing Select replaces shared Combobox in the new Shipment composition after keyboard failure reproduction; DatePicker direct formatting ensures dd-mm-yyyy. Full rationale and activation requirements in feature README and handoff.
- Red/Green tests and independent reviewer findings addressed; 23 feature tests, full 249 tests/46 files and build pass. 36 browser combinations (EN/EL,1440/400,9 states) plus key flows passed, zero page errors/external requests/overflow. Feature formatting passes. Whole-project type check still has two known delivery-note-test cast errors; whole-project formatting has pre-existing failures. No unrelated fixes.
- Handoff drafts/fro363-frontend-handoff.md, full patch drafts/fro363-frontend-preparation.patch, screenshots/logs drafts/fro363-frontend-evidence/. Temporary review harness moved outside production checkout to session root/fro363-review; local React preview at http://127.0.0.1:8766/ opened in Codex and smoke-tested after relocation.
- Base refreshed unchanged. Review patch contains only 14 new feature files. Production worktree remains detached/uncommitted. Publication blocked by mandatory ruleset enforcement 403 and non-clean required project checks; backend and Details/allocation UI remain activation dependencies. Linear unchanged during implementation; FRO-363 still Backlog/Pending_Review/Story/Frontend in 0.0.12 with four approved attachments.

### 2026-11-06 - Shipment Invoice Details/edit Q1-Q3 accepted

- User accepted combined Details with draft edit mode, providing FRO-363's successful-create destination and a read-only view of finalized invoices. Finalization belongs on Details; printing remains separate.
- Lock Shipment after draft creation. Correct a wrong Shipment by discarding the draft and creating another. This is a newly agreed UI restriction; check consistency with the backend contract during spec review.
- Explicit Save changes returns to Details. Cancel confirms discarding unsaved changes. Incomplete drafts remain saveable under FRO-244 draft rules; finalization is separate.
- Next interview round: finalization confirmation, draft discard, and cancellation/replacement UI ownership. No Linear write or preview implementation yet.


### 2026-11-06 - Shipment Invoice Details/edit Q4-Q6 accepted

- Finalize belongs on saved Details and opens a confirmation showing Shipment, Client/invoicing company, selected goods and total. Explain printed-number assignment and freezing. Missing requirements are actionable; save or cancel edits first.
- Include Discard draft with a confirmation identifying draft and Shipment, distinct from Cancel editing. Successful discard returns to Shipment Details.
- Include manager/system-administrator cancellation with required reason and retained number/frozen contents. Separate Create replacement starts a linked draft; inheritance and interaction details remain pending. Printing remains separate.
- Next interview: replacement inheritance, live-source refresh presentation, and concurrent edits. No Linear write or preview implementation.


### 2026-11-06 - Shipment Invoice Details/edit Q7-Q9 accepted

- Replacement keeps the locked Shipment, copies document fields/party text, defaults date to today and carries still-eligible row selections using current source values. Flag unavailable rows. Copy packing, weight and partial amount, highlighting these for review against corrected goods. No printed number until finalized; cancelled original unchanged.
- Refresh goods on draft opening and explicit Refresh goods. Preserve document input and eligible selections; show changed quantities/values and removed/ineligible selections; new eligible rows remain unselected. Affected selections require review before finalization.
- Concurrent edits/finalization/cancellation block overwriting the newer version. Preserve unsaved input for comparison/copying and offer reload. Backend conflict detection is an explicit dependency; finalized invoices cannot remain editable.
- Next interview: when replacement persists, explicit review acknowledgement, and navigation/dirty-exit behavior. No Linear write or preview implementation.


### 2026-11-06 - Shipment Invoice Details/edit Q10-Q12 accepted

- Create replacement on a cancelled invoice opens a prefilled unsaved form. Explicit Create draft persists it and opens replacement Details with a link to the original; cancelling the form creates nothing.
- A review panel groups affected goods and copied packing/weight/partial amount. Staff resolve unavailable selections, check values and Confirm reviewed. Incomplete work remains draft-saveable; finalization requires completed review. Further relevant changes require review again. Exact persistence/invalidation contract remains to be traced.
- Dirty edit exits/navigation require discard confirmation; close/reload uses browser warning. Cancel editing returns to saved Details. Show Shipment link and original/replacement links where applicable.
- Next: shared create/edit form protections, draft-save validation and Details layout. No Linear write or preview implementation.


### 2026-11-06 - FRO-363 final diff and scoped publication exceptions

- User accepted existing whole-project TypeScript/formatting failures and granted a one-time exception to the ruleset enforcement requirement for FRO-363 only. Ruleset enforcement remains unverified (GitHub HTTP 403); no global policy or permissions changed.
- Refreshed production main remains 5774931b9869247f0247013111a452552403f456. Proposed mock/fro-363-shipment-invoice-create name is available locally and remotely.
- Complete 14-file patch is unchanged and matches the detached worktree byte-for-byte; SHA-256 f2772624042ac3b3d9543917dbe6b2d7249a9ba27c17667b4238b41fc0a1ba1a. Final reverse-applicability/whitespace checks passed; 23 focused tests and feature formatting passed again.
- Final approval package: drafts/fro363-frontend-handoff.md and drafts/fro363-frontend-preparation.patch. Proposed commit: feat(FRO-363): add Shipment Invoice create UI mock. Exact push: git push github mock/fro-363-shipment-invoice-create:mock/fro-363-shipment-invoice-create.
- Await explicit approval to create, commit and push that exact production mock branch. No branch/commit/push/PR/deployment or Linear mutation performed. Activation still depends on FRO-244/FRO-301 and Details/allocation integration.

### 2026-11-06 - FRO-363 mock branch published and verified

- User explicitly approved creating, committing and pushing the exact final diff. This agent created mock/fro-363-shipment-invoice-create in Frontline-Forwarding/frontline-forwarding from base 5774931b9869247f0247013111a452552403f456; branch ownership is recorded here.
- Commit/head: 230a90581aa85e611737add554b2b3c6f5912e0e (feat(FRO-363): add Shipment Invoice create UI mock). Exactly 14 new UI feature files, 1,911 insertions; approved patch checksum and staged reverse-applicability verified. No code changes during publication.
- Exact same-name push succeeded. Fetch verified remote head equals local commit; remote diff contains only approved paths, worktree clean.
- Branch: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-363-shipment-invoice-create
- FRO-363-only check/ruleset exceptions remain scoped as approved. No PR, merge, deployment or Linear mutation. Activation depends on FRO-244/FRO-301 backend and Details/allocation integration. Full evidence: drafts/fro363-frontend-handoff.md.

### 2026-11-06 - FRO-363 published mock handoff added to Linear

- User explicitly requested adding the mock branch and handoff notes. Replaced the preparation paragraph in Design and developer handoff with published branch/commit/base, immutable feature README, handoff/evidence links, implementation scope, integration/guard requirements, verification results and the accepted ticket-only check/ruleset exceptions.
- Verified live remote head remains 230a90581aa85e611737add554b2b3c6f5912e0e. No business behavior or activation ownership changed; no new consumer trace or design round needed for this handoff-only update.
- Re-read FRO-363 at updatedAt 2026-11-06T14:32:36.621Z: description matches the intended replacement after Linear markup normalization; title, status, complete labels, priority, project, milestone, parent, assignee and relations unchanged. All four original attachments preserved by ID.
- Current baseline already included related FRO-302/FRO-362; preserved these existing relations without changing dependencies. Backlog / Pending_Review, Frontend, Story and milestone 0.0.12 remain unchanged.
- Ticket: https://linear.app/front-line-ltd/issue/FRO-363/shipment-invoice-create-page-ui

### 2026-11-06 - Shipment Invoice Details/edit local preview delivered

- User accepted Q13-Q15: reuse create form company/Shipper protections and goods behavior; preserve saved values on open; clear incompatible company on Client change. Incomplete drafts save, mixed currencies block save and suppress full total. Reuse approved stacked cards, with lifecycle identity/actions, review panel and correction links.
- Created previews/shipment-invoice-details/index.html, self-contained fixture-only HTML, plus component-map.md, README, source/build scripts, verification and screenshots. Live design/component baseline read through gh: 5774931b9869247f0247013111a452552403f456. Manual canvas fallback; approved stacked direction carried forward.
- Preview includes EN/EL, draft/read/edit, loading/empty/error, source review, mixed currency, overlap, incomplete draft, save failure, concurrent conflict, finalization, manager/admin cancellation and linked replacement simulation. Loopback preview at http://127.0.0.1:8766/?state=edit; downloadable HTML opens offline.
- Headless Edge verified 56 viewport/language/scenario combinations and lifecycle/input-retention interactions, zero page errors/external requests/document overflow. Desktop and Greek mobile screenshots inspected. Original/replacement navigation also verified. Preview is for design review; no ticket approval/write, hosted publication or production code change.
- Next: collect preview feedback, complete live consumer/spec trace and backend review/versioning/replacement contracts, then prepare full standalone ticket under frontline-linear-issues for approval. FRO-363 remains independently owned by the other chat.


### 2026-11-06 - Shipment Invoice Details/edit design approved; full ticket draft ready

- User approved local preview and requested specification check/full ticket for approval. Applied frontline-linear-issues writing skill. Refreshed FRO-244/FRO-301/FRO-363, duplicate search, live labels/statuses/milestone. FRO-363 now has unmounted mock 230a90581aa85e611737add554b2b3c6f5912e0e; read its integration guide/types via gh.
- Completed live main 5774931 consumer trace (drafts/fro244-details-edit-spec-check.md): Shipment Invoice API/persistence absent; allocation, review/version contracts and actual allocation UI navigation remain explicit activation dependencies. Delivery-note expected-version checks are precedent only; do not import its per-issuer numbering/AADE lifecycle. Preserve Shipment cancellation guard ownership in FRO-244.
- Corrected preview sample unit PCS to source PC and reran all 56 combinations and lifecycle checks successfully. No layout or approved behavior change.
- Full standalone draft: drafts/fro244-details-edit-ui.md; metadata/attachment scope: drafts/fro244-details-edit-ui-approval.json. Proposed title Shipment Invoice — Details & draft editing UI; new FRO-244 child, Backlog, Story/Frontend/Pending_Review, Pre-releases 0.0.x / 0.0.12, unassigned/no priority, blocked by FRO-244/FRO-301 and blocks FRO-363. Four resources: shipment-invoice-details.html, component-map.md, desktop.png, mobile.png.
- Await full ticket/metadata/relations/attachment approval. No Linear mutation, production implementation or branch publication. FRO-363 publication exceptions remain ticket-specific.


### 2026-11-06 - FRO-361 Details flow resumed

- User chose to continue existing FRO-361 instead of creating a duplicate UI ticket. Preserve list scope; focus on read-only Details and reuse attached Direction A / single Details tab. Editing remains in Shipment. No production implementation authorization or Linear write yet.
- Planning pull succeeded; refreshed full FRO-361, metadata, attachments and empty comments; related FRO-247 remains Done. Current FRO-361 is Backlog, Shipment/Pending_Review/Frontend/Story/delivery note, no project/milestone/assignee/parent, no priority. Existing three attachments retained.
- Read live production main 5774931 via gh. Consumer trace confirms existing deliveryNotesByShipmentId excludes CANCELLED; standalone and cross-Shipment reads remain FRO-361 work. New reads need Shipment reference/company display values. Existing Shipment card auto-prepares drafts and must not be mounted on read-only Details.
- PDF uses existing authenticated GET with note/Shipment identity check. SUBMISSION_PENDING has no PDF; other non-draft statuses allow it. Draft guard uses shared Shipment saved state (all sibling movementStartAt values present), plus dirty/saving/previewing guards; REST PDF does not itself enforce those UI guards. Existing authorization checks internal/system admin plus DELIVERY_NOTE_VIEW; additional Shipment record checks were not found in the inspected read/PDF services.
- Q2 pending: show disabled Preview PDF with explanation for unsaved movement details (recommended), versus hide until available. Preserve existing saved-state semantics rather than inventing a persisted field. Existing prototype needs this draft affordance clarified; default layout is unchanged. No new canvas/publication required while reusing the existing design.
- Next: resolve Q2, reconcile exact saved-state/access wording and present complete final ticket if changes are proposed; obtain approval before Linear write. Production repository remains read-only. Unrelated fro326/fro352/fro353 draft changes were preserved.

### 2026-11-06 - FRO-366 created and attachments verified

- User explicitly approved writing the full Details/edit ticket with proposed metadata, relations and all four resources. Created FRO-366 Shipment Invoice — Details & draft editing UI (7c8d72f1-9be2-44c3-9c42-51ccd8e7f32a), child of FRO-244, Backlog, Story/Frontend/Pending_Review, Pre-releases 0.0.x / 0.0.12, unassigned/no priority. Blocked by FRO-244 and FRO-301; blocks FRO-363; no relatedTo additions.
- Re-read confirms approved full description after normalizing Linear issue chips/table/bullet formatting, all metadata and relation directions. Four Resources: shipment-invoice-details.html, component-map.md, desktop.png, mobile.png. Downloaded each and verified SHA-256 equality with approved local source.
- Ticket: https://linear.app/front-line-ltd/issue/FRO-366/shipment-invoice-details-and-draft-editing-ui. Draft/approval files retained. No Ready promotion, production implementation, branch publication or deployment. Backend review/versioning contracts and allocation destination remain explicit activation dependencies.


### 2026-11-06 - FRO-361 draft PDF decision accepted

- User accepted disabled Preview PDF with explanation when saved movement details are missing; Open Shipment remains available. No new lifecycle behavior or editing on Details.
- Complete proposed description saved in drafts/fro361-details-review.md. Preserves list and existing requirements, makes single Details tab explicit, adds EN/EL disabled-draft message and verification, records existing PDF status/saved-state behavior and source read limitations. Existing three attachments remain unchanged; draft explicitly identifies prototype coverage limitation for this state.
- Await complete description approval before Linear update. Preserve all metadata and relations. No Ready promotion or production preparation/publication authorized. Existing shared Shipment saved-state guard is retained, not replaced with a selected-note-only check.

### 2026-11-06 - FRO-361 approved description saved; UI preparation started

- User explicitly approved writing the complete draft and continuing UI flow. Saved description from drafts/fro361-details-review.md. Re-read updatedAt 2026-11-06T15:01:57.477Z confirms exact text after newline normalization, all five labels, metadata, relations and all three attachment IDs/titles/assets unchanged. Status remains Backlog/Pending_Review; no Ready promotion.
- Isolated detached UI worktree: C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b157-f4aa-77b3-ab01-1dc2d0c938d7/fro361-frontend. Verified github remote on source C:/ffx/fro350; fetched main 5774931b9869247f0247013111a452552403f456. No application changes or branch creation.
- Playbook initial load failed on Git metadata permissions; elevated retry succeeded. Task snapshot FRO-361: committed policy SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Resume this snapshot; do not start again. Mandatory planning-model checkpoint now pending before implementation-plan drafting. User must check selected model and explicitly continue; do not ask or record model name. Implementation has a later separate checkpoint.
- UI focus remains read-only Details, existing Direction A, approved disabled-draft PDF explanation, EN/EL states. List requirements preserved in ticket. No backend modifications or production writes authorized. Branch create/commit/push requires later complete-diff approval.
- Publication blocker: gh rulesets API HTTP 403 (upgrade GitHub Pro or public repository). Required enforcement remains unverified; prior ticket exceptions do not apply. Local preparation can continue, publication cannot under current policy.
- Ticket: https://linear.app/front-line-ltd/issue/FRO-361/delivery-notes-list-details-page-read-only.

### 2026-11-06 - FRO-366 frontend preparation started; planning checkpoint pending

- User explicitly requested frontend UI mock under AGENTS.md, reusing FRO-363 components where appropriate. Refreshed full FRO-366, planning repo and production main; verified gh account frontlineltdproject-star with push access. Approved ticket/design remain unchanged.
- Native create_worktree request for fro366-frontend did not return and was terminated; Git showed no FRO-366 checkout from it. Used detached git worktree fallback at C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b135-c052-7083-9f9f-7973a67b9301/fro366-frontend from C:/ffx/fro350, verified github remote Frontline-Forwarding/frontline-forwarding. Base/HEAD 5774931b9869247f0247013111a452552403f456. Check for any delayed managed attachment before creating another checkout.
- Playbook start --issue FRO-366 saved a valid snapshot but failed printing Unicode through Windows charmap. Reported failure and resumed the same snapshot with PYTHONIOENCODING=utf-8 (no replacement/start rerun). Loaded committed policy fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Root/client AGENTS, issue-tracker and domain instructions read.
- Mandatory planning-model checkpoint now pending: remind user to check model suitability, wait for explicit continue before drafting plan. Separate implementation checkpoint follows plan agreement. Next: resume existing snapshot, read relevant domain docs/current comments, inspect FRO-363 reusable components and determine main-based reuse preparation; do not silently base branch on the create mock.
- Ruleset inspection again returned HTTP 403 (GitHub plan restriction); required write-identity enforcement unverified. Publication blocked. FRO-363 exceptions do not carry over. No source changes, implementation plan, dependency install, production branch/commit/push, PR or Linear changes.


### 2026-11-06 - FRO-361 implementation plan prepared

- User explicitly continued past planning-model checkpoint. Resumed committed playbook snapshot on main 5774931, same b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc fingerprint. Current FRO-361 unchanged since approved write, comments empty.
- Plan: drafts/fro361-frontend-plan.md. Three sequential slices: read-only Details composition, navigation/PDF guards, browser verification/handoff. Maps actual components, callback/model interfaces, files, meaningful tests and integration dependencies. Native execution recommended, pending plan agreement and separate implementation-model continuation.
- Plan scope is unmounted Details UI; list implementation remains in ticket, not in this preparation. Uses existing DeliveryNote type and shared saved-draft helper; no fabricated API, route activation, backend/auth/schema/dependency changes. Frontend README records activation boundaries.
- No application edits, branch or production commit/push. Ruleset 403 publication blocker persists. Planning artifacts only; full implementation checks have not run.

### 2026-11-06 — FRO-350 public static preview published

- User explicitly authorized the existing Cloudflare OAuth login for this preview, overriding the Pages-only token rule for this deployment only.
- Created new Pages project fro-350-e25548 and deployed the existing previews/fro350 build unchanged: https://fro-350-e25548.pages.dev/ (deployment 7c1e6cd6).
- Anonymous curl GET returned HTTP 200 without cookies or authorization. Public and local HTML SHA-256 both 3498cdb9880f0cf5eba570ef15a6880facf87af5f5392d0becc6fc2fd09f7008. Browser opened without login; default/loading/empty/error states rendered, Greek rendering checked at 400px without horizontal page overflow; captured console warning/error list empty. No dedicated browser network-log API was available.
- Wrangler 4.158.0 unexpectedly delegated pages project create into a Workers static-assets flow. Interrupted after asset upload, before any completed Worker deployment was reported; no claim of verified remote Worker cleanup. Used pinned Wrangler 4.45.0 for successful Pages create, inventory and deployment. Do not use unpinned Wrangler for this workflow without verifying behavior.
- No Linear description, attachments or metadata changed. Earlier file-attachment request was paused by the user in favor of publication; adding a ticket reference remains pending its review gate.

### 2026-11-06 — FRO-350 current public preview reference added

- User explicitly requested adding the public link and a clear instruction identifying which preview the developer should use. Added resource Current UI preview — public, no sign-in (FRO-350), https://fro-350-e25548.pages.dev/, plus Current UI preview — use this for implementation review paragraph immediately before the prepared branch in Context for agents.
- Re-read verified the exact description addition (only URL angle-bracket normalization), all original attachments, Todo and export/Ready/Frontend/Story labels. Removed only automatically added FRO-321/FRO-319 related links; original relations restored. Existing historical previews remain historical. No HTML or access-setting change; the earlier new Pages publication provided anonymous access.

### 2026-11-06 - FRO-361 Details UI implemented and locally verified

- User approved plan and implementation checkpoint, choosing native implementation in this chat. Prepared eight new feature files plus scoped LabelsProvider EN/EL additions in detached worktree under session 01a1b157-f4aa-77b3-ab01-1dc2d0c938d7/fro361-frontend. Base remains live main 5774931b9869247f0247013111a452552403f456. Playbook fingerprint unchanged: b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- Unmounted real-component Details: single tab; Document/Movement/Goods; stored per-note data; EN/EL; unavailable/loading/error; disabled shared-unsaved draft PDF explanation; status guards; duplicate-request protection; navigation and PDF callback boundary. No list implementation, route activation, backend/auth/schema/API/dependency/lockfile changes.
- Independent reviewer found one P2 same-note-refresh race; regression reproduced Red, changed action key to note/Shipment identity only, then Green. Final feature tests 20 pass; full suite Node22.13 maxWorkers=2: 246 pass/46 files; build passes; scoped format passes. First default-parallel Node24 suite timed out in three existing ShipmentComposer tests; final full rerun passes. Two existing delivery-note-service.test.ts type casts and 283-file whole-project formatting failures remain, explicitly reported.
- Browser: 48 EN/EL x1440/400 x12-state combinations plus PDF pending/error, late identity-change rejection, keyboard Shipment navigation and retry; zero errors/external/failed requests/overflow. Desktop/Greek-mobile screenshots visually inspected. Feature-local heading size override handles shared cn custom-size merging without modifying shared components.
- Full patch drafts/fro361-frontend-preparation.patch SHA256 8f185f8f4bb458bd12dd65605e0df19200129b972b74ea574a9614642cf8169b; reverse-applicability verified. Handoff drafts/fro361-frontend-handoff.md and evidence drafts/fro361-frontend-evidence/. Generated route-tree line-ending churn restored. Production diff contains exactly nine eligible files.
- Fixture review harness outside production checkout at session root/fro361-review, http://127.0.0.1:8771/. Restarted after verification for user review; no route-generator plugin in harness. UI depends on FRO-361 standalone authorized reads, shared saved-draft context and route/list integration before activation.
- No production branch/commit/push/PR/deployment; proposed mock/fro-361-delivery-note-details unused remotely. Publication blocked by required ruleset HTTP403 and existing project-check failures unless explicitly resolved/accepted for this ticket. Linear unchanged during implementation; existing Backlog/Pending_Review and three attachments preserved.

### 2026-11-06 - FRO-361 reviewed mock branch published

- User explicitly accepted existing whole-project type/format failures, granted a one-time FRO-361 exception for unverified ruleset enforcement, and authorized create/commit/push of mock/fro-361-delivery-note-details with the reviewed diff. Exceptions do not change global policy or other tickets.
- Refreshed main unchanged at 5774931b9869247f0247013111a452552403f456. Verified local/remote branch name unused, index empty, all nine current paths exactly match manifest, and complete current patch byte-matches reviewed SHA256 8f185f8f4bb458bd12dd65605e0df19200129b972b74ea574a9614642cf8169b. No application edits during publication.
- This agent created and owns mock/fro-361-delivery-note-details in Frontline-Forwarding/frontline-forwarding. Commit/head 551e2051b5f784dfdbbc814316e25a30807a3a18, feat(FRO-361): add read-only Delivery Note Details UI mock; nine files, 823 insertions. Explicit same-name push succeeded.
- Fetched remote branch; remote/local HEAD equal, full diff equal and changed paths exactly match approved manifest. Worktree clean. Prior verified 246 tests, build and 48 browser combinations apply to unchanged diff.
- Branch: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-361-delivery-note-details. No PR, merge, deployment or new Linear mutation. UI remains unmounted; authorized read API and list/route integration remain delivery dependencies.

### 2026-11-06 - FRO-363 marked Ready for development

- On explicit user instruction, changed FRO-363 from Backlog to Todo and replaced Pending_Review with Ready; retained Frontend and Story. Confirmed milestone 0.0.12.
- Re-read verified status, complete labels and milestone. Description, mock handoff, four attachments, assignee, priority, project, parent and relations unchanged, including existing blockers FRO-244/FRO-301/FRO-366. This is developer readiness, not operational activation or deployment.
- Metadata-only change: no business-rule trace or design round required. Ticket: https://linear.app/front-line-ltd/issue/FRO-363/shipment-invoice-create-page-ui

### 2026-11-06 - FRO-361 published UI handoff added to ticket

- On explicit user instruction, added the published mock/fro-361-delivery-note-details branch, immutable commit 551e2051b5f784dfdbbc814316e25a30807a3a18, base commit, component README and pinned verification evidence links to FRO-361.
- Handoff records delivered unmounted Details UI, remaining authorized reads/shared saved-draft context/callback wiring/list/routes, verification results, and the user-approved branch-only type/format and unverified-ruleset exceptions. No product behavior changed; no new design or consumer trace required.
- Re-read confirmed the exact additive description (apart from Linear link normalization), unchanged metadata and relations, all five labels, and all three attachments. Status remains Backlog with Pending_Review. No merge or deployment.

### 2026-11-06 - FRO-366 planning checkpoint accepted; implementation plan ready

- User explicitly continued planning. Resumed existing FRO-366 snapshot with UTF-8: HEAD 5774931, committed fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. No issue comments. Read domain guidance, package/Docker setup and published FRO-363 fields/goods/selection/guard/create controller.
- Plan saved drafts/fro366-frontend-plan.md: main-based detached preparation; import pinned 14 FRO-363 feature files as explicitly recorded uncommitted dependency, extend shared presentation compatibly, build separate saved-record/replacement controller, then lifecycle and browser/audit slices. Reuse must not reset saved fields or unlock Shipment. Backend totals/review/permissions/persistence remain callbacks, no fabricated production schema.
- Plan includes typed presentation boundaries, files, component map, meaningful tests, EN/EL desktop/mobile journeys, create regression coverage and provenance audit against main and FRO-363. Intent list before install reports no enabled packages; repeat after dependency install. No Base/Version/Sync workflow found; use Node 22.13.0 and pnpm 11.1.3 frozen lockfile per Dockerfile.
- Plan agreement and separate implementation-model checkpoint pending. No source changes, installs, application test runs, production branch/commit/push or Linear updates. Ruleset HTTP 403 remains publication blocker; FRO-363 exceptions do not apply.


### 2026-11-06 - FRO-361 marked Ready for development

- On explicit user instruction, moved FRO-361 from Backlog to Todo and replaced Pending_Review with Ready. Retained delivery note, Shipment, Frontend and Story.
- Re-read verified the status and complete labels; description, published UI handoff, all three attachments, priority, assignee, project, milestone, parent and relations were preserved.
- Metadata-only readiness change; no business-rule trace, canvas or preview changes required. No merge or deployment authorized or performed.

### 2026-11-06 — FRO-352 unchanged public preview published and linked

- User explicitly authorized existing Cloudflare OAuth login, unchanged HTML publication, anonymous-access verification and an explicit current-preview ticket reference. Built existing previews/fro352 without source changes; syntax check passed and fictional fixtures inspected.
- Pinned Wrangler 4.45.0 created Pages project fro-352-5a09a0 and deployed f1ce161d. Public URL: https://fro-352-5a09a0.pages.dev/ . Anonymous curl returned HTTP 200 without cookies/authorization. Local/public SHA-256 match: ceb63ae443d63132fd7ec35f10b19e186b73cb9fde4dc494b1046866ee63bfd3.
- Browser opened without sign-in; default, loading, error, notfound and denied states rendered. Greek default at 400px had no page-wide horizontal overflow. Captured warning/error console list empty; dedicated browser network-log API unavailable. No production or existing Cloudflare resource modified.
- Added Current UI preview — public, no sign-in (FRO-352) resource and explicit current-preview paragraph before the historical-preview paragraph. Re-read at 2026-11-06T15:47:45.186Z verified exact insertion (URL normalization only), original attachments, labels export/Pending_Review/Frontend/Story, Todo and all relations unchanged. Existing historical link retained. No business-rule change or Ready promotion.

### 2026-11-06 — AGENTS.md workflow update drafted from AGENTS-GREG.md

- Compared ~/Downloads/AGENTS-GREG.md (RoomPulse ticket procedure) with AGENTS.md. User approved adding all twelve "A" proposals and keeping the current file's ticket order, grill rounds, consumer tracing and no-revision-history rule ("keep B"). RoomPulse-only parts (Railway, design-system repo/Catalogue, check-mock, charts, BI shared parts, Codex exception, local repos/, DB, Sentry MCP) were left out.
- Added in AGENTS.new.md: branch/SHA-pinned reads; new-component agreement recorded in Decisions; canvas self-check; explicit no-login preview decision plus basic-auth lock (Pages Function + project secrets) for any preview with real data; deep link; numbered preview check; Change propagation section; three-layer ticket rule; optional session record and session comment; screenshot self-check and AC check in 4e; hand-rolled element audit with verdicts; re-run checks right before push; branch URL link attachment.
- Backup of the unchanged file: AGENTS.backup-2026-11-06.md. AGENTS.md itself unchanged; swap pending user approval.
- Swap approved by user: AGENTS.new.md replaced AGENTS.md (backup AGENTS.backup-2026-11-06.md retained).

### 2026-11-06 — FRO-353 and FRO-354 unchanged public previews published and linked

- User explicitly authorized both unchanged HTML publications using existing Cloudflare OAuth, anonymous checks and current-preview ticket links. Existing builders used with no source edits; both JavaScript syntax checks passed; fictional fixtures inspected. Wrangler pinned to 4.45.0.
- FRO-353: project fro-353-b41efe, deployment abeb0cc1, https://fro-353-b41efe.pages.dev/ . Anonymous HTTP 200; local/public SHA-256 d2d1f97cfd0b4d4298114b05a737f3ed87fb0551c866fc97c854396bb73aa64a.
- FRO-354: project fro-354-97f526, deployment 90be68dd, https://fro-354-97f526.pages.dev/ . Anonymous HTTP 200; local/public SHA-256 739ac96b2e424edcba242385b3090415ee254b15eecf2fb5322ee87cab86caf7.
- Both opened in browser without sign-in. Default, relevant loading/error/not-found/denied scenarios and Greek rendering checked; FRO-353 lookup loading/error verified by opening the picker. FRO-354 Greek at 400px had no page-wide overflow. Console warning/error lists empty; no dedicated browser network-log API available. Source/UI unchanged; no production or existing Cloudflare resource modified.
- Each issue has a Current UI preview resource and explicit implementation-review paragraph before the prepared branch. Replaced obsolete not-published sentence with source location. Original historical links retained. Preserved Todo, entry note/Ready/Frontend/Story, attachments and relations; removed only auto-added related links after saves (353: 317/321/356/348; 354: 356/347/317/350/321).

### 2026-11-06 - FRO-363 explicit HTML preview link

- At the user's request, added a prominent direct download link to the existing shipment-invoice-create.html attachment at the start of Design and developer handoff, with instructions to open locally and select layout A, language and scenario.
- Re-read confirmed the exact addition after link normalization; Ready/Todo, milestone 0.0.12, labels, relations and all four attachments preserved. No hosted preview was published.

### 2026-11-06 — FRO-363 attached interactive HTML published unchanged

- User requested publishing the interactive HTML like the preceding previews. Downloaded current shipment-invoice-create.html from Linear; it matches previews/shipment-invoice-create/index.html. Published those exact bytes using existing Cloudflare OAuth and pinned Wrangler 4.45.0 to new Pages project fro-363-72afd8, deployment caf44176: https://fro-363-72afd8.pages.dev/ .
- Anonymous HTTP 200 and byte equality verified: attachment/local/public SHA-256 24889121842a233517ba0b4b812df66b306fb10428a0d1b81195e7f2dfdab6a7. Browser opens without sign-in. Scenario selector checked for loading/empty/error/mixed/overlap/stale; loading/error/mixed disable Create. Greek layout at 400px has no page-wide horizontal overflow; console error/warning list empty. No dedicated network-log API available. HTML unchanged, including its offline banner and comparison layout B.
- Added public current-preview resource and explicit hosted-preview reference to FRO-363, retaining A approved/B comparison-only and download availability. Reworded local-only/no-hosted-preview sentences to distinguish the local download from its hosted copy. Verified expected description with refreshed upload signatures normalized, original four attachments, labels Ready/Frontend/Story, Todo and relations preserved. No production or existing Cloudflare resources modified.


### 2026-11-06 — FRO-366 frontend mock implemented and verified

- User approved the implementation plan and implementation-model checkpoint, choosing native work in this chat. All four preparation slices completed in detached session worktree fro366-frontend, main 5774931b9869247f0247013111a452552403f456; committed playbook fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc retained.
- Prepared 25 feature files: 12 unchanged pinned FRO-363 dependencies, 2 compatibility-preserving shared extensions and 11 new FRO-366 files. Reused field/goods/confirmation components and selection helpers; separate saved-record editor and lifecycle controller. Source stays unmounted and callback-driven; no backend/auth/API/schema/route/dependency changes.
- Implemented saved/frozen Details, locked-Shipment draft editing, reference/Shipper guards, refresh retention and selection warnings, revision-bound review acknowledgement, lifecycle confirmations, cancellation reason, unsaved replacement and correction links, dirty navigation, conflicts and uncertain-result reconciliation. Explicit pending mutation state prevents duplicate replacement after host-read invalidation.
- Independent reviewer found obsolete initial Retry and ready-to-error action issues; follow-up found mutation-result invalidation could permit unsafe retry. All reproduced Red, fixed Green; targeted reviewer confirmed no remaining actionable finding. Additional Shipper/review visibility and replacement heading regressions fixed. User asked about duration; explained expanded lifecycle scope and actual race fixes, then continued.
- Final full suite Node22.13 threads/maxWorkers2: 281 tests pass in 47 files, including 32 Details tests and all 23 create/selection tests. App and actual-feature review builds pass; scoped formatting and patch whitespace/reverse checks pass. Two baseline TS2352 errors remain in delivery-note-service.test.ts:134/138; final whole-project formatting fails in 285 files, no newly failing file against baseline. No cross-ticket waiver inferred.
- Final compiled React browser preview at http://127.0.0.1:8777/?state=draft (local only). 72 EN/EL x1440/400 x18-state combinations plus consequential journeys; zero page/console errors, failed/external requests or overflow. Earlier dev-server attempts had HMR/optimizer-aborted requests and were not reported as passing. Desktop/Greek-mobile screenshots inspected. Harness/fixture tooling remains outside production diff.
- Handoff drafts/fro366-frontend-handoff.md; full patch drafts/fro366-frontend-preparation.patch SHA256 b750990907e119fec3f3188de3cd13fe7bdb8f59ee6d6face26eb50980ef357c; manifest/logs/screenshots under drafts/fro366-frontend-evidence. Approved downloadable HTML remains previews/shipment-invoice-details/index.html and the four Linear resources are unchanged.
- Refetched main unchanged; proposed remote branch mock/fro-366-shipment-invoice-details unused. No production branch, commit, push, PR, deployment or Linear edit. Publication awaits actual-diff approval and resolution/explicit FRO-366 acceptance of baseline check failures and ruleset HTTP403 (GitHub plan restriction). FRO-244/FRO-301 integration and actual allocation/navigation targets remain activation dependencies. Planning artifacts synchronized separately.


### 2026-11-06 — FRO-366 reviewed mock branch published

- User replied “go ahead” after the full handoff and disclosed blockers. Treated as approval to create/commit/publish the exact reviewed FRO-366 mock with the disclosed existing check failures and unverified GitHub ruleset enforcement, scoped to this branch only; this interpretation was stated before acting. No broader exception, PR, merge, deployment or Linear write.
- Main refetched unchanged at 5774931b9869247f0247013111a452552403f456. Verified all 25 working/committed file hashes match approved manifest, empty index before staging, exact full diff and raw-element audit. Created own branch mock/fro-366-shipment-invoice-details and commit 0b185d6101e50a075263a184eceaf5555384db7e.
- Post-commit checks immediately before push: 281 tests/47 files pass, app build/scoped format/whitespace pass; two baseline type errors and 285 baseline formatting failures exactly unchanged. Ruleset API still 403; no permission changes. Pushed explicit same-name refspec only. Remote tracking ref needed explicit fetch due pilot's limited configuration; remote head and full 25-file diff verified against local.
- Branch https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-366-shipment-invoice-details . Publication audit and proposed Linear attachment in drafts/fro366-frontend-publication.md; logs saved under evidence. Linear attachment remains pending separate approval; existing ticket status/metadata/resources unchanged by this turn. FRO-244/FRO-301 and real navigation/allocation integration remain required before activation.

### 2026-11-06 — FRO-366 attached HTML published unchanged and linked

- User explicitly authorized unchanged publication of shipment-invoice-details.html with the existing Cloudflare OAuth login, anonymous verification and a current-preview ticket reference. Downloaded the current Linear attachment and confirmed it matches local previews/shipment-invoice-details/index.html.
- Wrangler 4.45.0 created Pages project fro-366-0a2f26 and deployed d4f4ba89. Public URL https://fro-366-0a2f26.pages.dev/ . Anonymous HTTP 200; attachment/local/public SHA-256 b1cfdb4b02403fe1862520066550999492b73aaade279d28218fc2f175ef8533. No source edits, production changes or existing Cloudflare-resource changes.
- Browser opened without sign-in. Checked default/edit/finalized/cancelled/replacement and loading/empty/error/conflict scenarios, respecting the unsaved-change confirmation when switching. Greek default at 400px has no page-wide horizontal overflow. Captured console warning/error list empty; dedicated network-log API unavailable. This verifies the static preview, not production behavior.
- Added current public preview resource and explicit hosted-preview paragraph in the design section, replacing no-hosted-preview-required wording. Re-read at 2026-11-06T16:27:52.439Z confirmed exact intended description after normalization, original four attachments, relations, Backlog and Pending_Review/Frontend/Story unchanged.


### 2026-11-06 — FRO-366 frontend branch resource added

- User explicitly approved adding “Frontend UI mock — FRO-366”. Added the published GitHub branch as a link attachment, ID 9f4ed1b7-b5c9-450e-822a-b542bef2e745.
- Fresh issue read showed five existing resources, including the public preview added elsewhere. Re-read confirms all five preserved (six total), exact approved link/title, unchanged description, Backlog/Pending_Review/Frontend/Story, priority, assignee, project/milestone, parent and relations. No behavior/spec change; consumer tracing/design/interview steps do not need repeating for this approved resource-only update.

### 2026-11-09 — Parallel Delivery Note flow mapped and initially reviewed

- This chat reviewed Delivery Notes separately from the active Export/Customs chat. Shipment participation/route/state are inputs; no Export, Customs or VAT-exemption audit performed here. Source main rechecked at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; full current FRO-247/307/361/357/283/284/285/308/344 read, and FRO-373 checked for overlap.
- Saved docs/qa/flows/delivery-note.md before reproduction tests, docs/qa/scenarios/delivery-note.md (24 scenarios), and docs/qa/runs/2026-11-09-delivery-note.md. Findings: QA-DN-01 draft loss on version refresh/delayed save; QA-DN-02 unusable replacement beside issued sibling; QA-DN-03 pending reconciliation has backend path but no UI action (existing FRO-284/285 ownership); QA-DN-04 XML/PDF timestamp formatting differs across offsets, including midnight. QA-DN-05 cancellation ambiguity reverting to ISSUED is a source-supported risk awaiting isolated backend reproduction and policy review.
- 37 targeted frontend checks passed: 32 existing plus 5 observation/control tests. All 562 scratch client source files match the fresh pinned archive. Two Java timestamp-expression observations passed. Node 24.13/Vitest 4.1.6 dependency reuse; Java 11 versus backend Java 25 prevents claiming full backend integration. Policy loader failed without Git metadata; direct instructions read, no loader fingerprint claimed. No live portal/database/AADE/email writes or full browser journey; deployment version unverified.
- No Linear changes, production source edits, new vocabulary/ADR or UI branch. Recommend reviewing replacement blockage first; no correction policy or ticket grouping approved. Preserve other chat's Export QA files and unrelated FRO-326/patch/.wrangler changes. Only Delivery Note evidence/report files and this memory entry belong to this task.

### 2026-11-09 — Delivery Note finding grouping proposed; minimize new tickets

- User reviewed all five finding examples and requested grouping, emphasizing few new tickets and reuse of recovery owners. Proposed two new bugs (QA-DN-01 unsaved movement details; QA-DN-04 XML/PDF timestamp consistency), reuse FRO-283 for QA-DN-02 replacement blockage plus QA-DN-05 cancellation uncertainty, and reuse FRO-284 for QA-DN-03 missing reconciliation UI. FRO-285 remains Phase B umbrella/reference, not duplicate ownership.
- Fresh full FRO-283/284/285/373 reads and Delivery Note search; production main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. FRO-283/284 remain Backlog Business_Input/Spike with unresolved decisions. Reuse does not approve implementation readiness, discard existing scope or settle those decisions. Cancellation remains source-supported risk pending backend reproduction. FRO-373's existing scope is preserved.
- Recorded proposed grouping in docs/qa/runs/2026-11-09-delivery-note.md. Grouping awaits user agreement; complete new/revised descriptions and explicit approval still precede any Linear write. No Linear change, source fix or new test execution.

### 2026-11-09 — Three Delivery Note correction drafts prepared for review

- User clarified the aim is fixing current implemented behavior, with unimplemented FRO-283/284 as references only, then approved three new correction groups and requested full drafts. This supersedes the earlier two-new/two-revised proposal. No Linear creation/edit or Ready promotion authorized/performed.
- Saved drafts/delivery-note-bugs/: D1 preserve movement drafts (QA-DN-01, two cases); D2 cancellation/replacement/pending-submission recovery (QA-DN-02/03/05); D3 consistent XML/PDF movement timestamps (QA-DN-04). README contains complete proposed metadata and consumer ownership. Proposed priorities High/High/Medium; FRO Backlog, Story/Bug/Pending_Review/Flow QA plus one Area and relevant entity tags. Every acceptance criterion has a read-only verification check.
- D2 uses the existing individual-draft operation for mixed-state replacement without weakening common all-DRAFT saves. Pending submission uses existing no-resend reconciliation. Cancellation uncertainty remains pending; authoritative confirmation is required, and no cancellation lookup is assumed to exist. Broader future FRO-283/284 policy/history work is excluded and not a blocker. D3 proposes existing PDF Europe/Athens movement semantics; no historical rewrite or issue-date policy expansion.
- Production main rechecked through gh at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Fresh full FRO-247/307/283/284, label/status catalogue and Delivery Note Bug search reviewed; FRO-373/376 have different scope. Prior evidence retained without rerunning application tests: 37 frontend checks and two expression observations. Cancellation/backend/database/browser/deployment limits remain explicit.
- Updated Delivery Note flow/scenarios/report ownership to the accepted correction grouping. Existing components/presentation reused; no canvas/preview, production branch, portal/database/AADE mutation, new vocabulary or ADR. Unrelated shared-checkout patch/.wrangler work preserved. Draft text/metadata remain under user review before any Linear write.

### 2026-11-09 — Delivery Note correction tickets FRO-381–FRO-383 created

- User explicitly approved creating all three reviewed tickets with proposed priorities and labels, keeping FRO-283/284 as references only. Created FRO-381 (preserve movement drafts, High/Frontend), FRO-382 (cancellation/replacement/pending-submission recovery, High/Integration), and FRO-383 (XML/PDF movement-time consistency, Medium/Backend).
- Re-read and verified complete descriptions, titles, priorities, label sets, FRO Backlog, related references and empty/unset ancillary metadata. All have Story, Bug, Pending_Review, Flow QA and delivery note; FRO-381/382 also Shipment. No Ready promotion, blocks/blockedBy/duplicate relation, assignee, project/milestone, parent, cycle, due date, estimate, attachments or documents.
- FRO-283/284 re-read: original descriptions and workflow metadata unchanged; only approved reciprocal related links to FRO-382/383 added. They are neither blockers nor implementation owners. Approved description files remain byte-equivalent to the reviewed commit; saved text matches after Linear presentation normalization only, including issue-chip bold boundaries.
- Fresh planning pull succeeded, source main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e, metadata catalogue and duplicate searches verified before creation. Updated drafts/delivery-note-bugs/README.md and QA report with links and verification receipts. No source fix, new tests, production branch, portal/database/AADE mutation or unrelated ticket edit. Unrelated shared-checkout work preserved.

### 2026-11-09 — Shipment Invoice mapped and reviewed with three parallel subagents

- User requested Shipment Invoice expected-flow mapping first, then parallel UI/backend investigation comparable to the other chat. Kept Export/Customs/VAT paperwork with that chat; allocation was checked only as an input/boundary. Current FRO-244/363/366/301 read as Done; FRO-371 remains Backlog. Future printing/PDF/discount and global-list absence are not bugs. Production main verified before and after at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; deployed revision unverified.
- Created docs/qa/flows/shipment-invoice.md and 31 scenarios before reproduction. Three agents covered initial creation, Details/lifecycle and backend rules. Parent traced shared consumers, inspected candidates and independently reran retained evidence. Report: docs/qa/runs/2026-11-09-shipment-invoice.md; three portable evidence files under docs/qa/evidence/.
- Eight isolated findings: QA-SHI-01 replacement defaults revert to original date/cleared parties; 02 frozen lines disappear in Details after live source ID becomes null; 03 allocation coverage changes retain stale review and permit finalization; 04 unknown create can acquire a second request identity after edit/remount; 05 offered-ineligible rows remain in draft total; 06 eligible row loses selection when regrouped under another Order; 07 reconciled DISCARDED displays Draft without completed return navigation; 08 async saved-navigation rejection bypasses recovery (Create locked; replacement still has Open saved record). Suggested High for 01–04, Medium for 05–08, not approved ticket metadata.
- Existing frontend 70/70 tests passed; new integrated UI evidence 35/35 (25 controls, 10 observations) passed in parent rerun. Backend parent rerun: 80 controls and 4 observations across two defects, executing actual extracted Java service/rules/evaluation/review/authorization/guard bodies with stand-ins. All 562 client source files match pinned archive. Node24.13/Vitest4.1.6/jsdom with cached dependencies; JDK17 available, not project Java25. No real SQL, rollback, concurrent transactions, deployed browser or HTTP permission execution claimed. Observations passing means defect reproduction. No duplicate production database invoices were observed.
- Reused presentation; no canvas/preview, source fix, production branch, portal/database/AADE/email write, Linear edit, new vocabulary or ADR. Findings require discussion before grouping/drafting tickets. Source policy loader failed on archive Git metadata; direct instructions/policies read. Planning artifacts only belong to this task; preserve other chat's VAT work and unrelated FRO-326/patch/.wrangler changes.

### 2026-11-09 — VAT-exemption paperwork mapped and reviewed

- User explicitly approved VAT-paperwork mapping first, then ticket/code review, separate from Shipment Invoice in the other chat. Fresh full FRO-317/321/348/352: Done, comments empty; FRO-379/385 checked for overlap. FRO-241 used only for supplied-form reference. Production main authenticated before/after unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; deployment revision unverified.
- Saved docs/qa/flows/vat-exemption-paperwork.md and 30 scenarios before reproduction. Three scoped agents covered Print ΥΔ, individual stamping and Export bulk events; parent reviewed/independently reran evidence and examined backend guards/grouping/forms. Report: docs/qa/runs/2026-11-09-vat-exemption-paperwork.md; three portable UI test files plus vat-paperwork-guards-qa.py retained.
- Nine consolidated findings: QA-VAT-01 newer print selection lost on pending success; 02 old PDF error contaminates reopened dialog/unlocks pending generation; 03 refresh retains stale print/bulk selection; 04 individual confirmation adopts unreviewed live version; 05 single/bulk pending date input lost; 06 bulk unknown outcome becomes Nothing changed and loses attempt on dismissal/navigation; 07 individual recovery lost on dismissal/stage remount/navigation boundary; 08 Check accepts another date as original attempt; 09 late bulk response overwrites newer cached progress. No persisted duplicate event/date overwrite or database rollback claimed.
- Parent reruns: print+single 70/70, bulk 31/31; existing relevant frontend 53/53 = 154. Retained backend script 40/40 controls twice using exact extracted Java methods with stand-ins. All 562 original client source files hash-match archive. Node24.13/Vitest4.1.6 cached dependencies; Java17 extraction, not full Java25/Spring/Postgres. No real SQL/rollback/locking/HTTP permissions/browser journey/current PDF-generation test. Three local supplied forms rendered/inspected; names/sizes match current embedded metadata, live attachment byte identity unverified because URLs returned HTML.
- Replay already-recorded versus Recorded count retained as clarification, not confirmed defect: FRO-352 explicitly requests aggregate copy. Conditional all-rejected/Completed-membership fixtures and leaf-only missing-record retry message were not promoted to separate bugs. Full 30 portal scenarios remain Not run; observation-test passes reproduce bugs.
- Reused existing UI contracts; no design preview, production changes, portal/database/AADE/email writes, Linear creation/edit, ticket grouping/priority decision or new vocabulary/ADR. Policy loader failed on archive Git metadata; direct policies read, no loader fingerprint. User should review findings one by one before agreeing a small ticket grouping; existing FRO-379/385 scope not silently expanded. Planning-only synchronization preserves parallel Shipment Invoice work and unrelated drafts/.wrangler changes.

### 2026-11-09 — Two Shipment Invoice correction groups proposed

- User reviewed all eight Shipment Invoice examples and requested as few correction tickets as possible, reusing existing ownership where appropriate. Proposed two new High correction groups: G1 creation/replacement/saved-action recovery (QA-SHI-01/04/07/08); G2 goods/totals/review/frozen history after source changes (QA-SHI-02/03/05/06). Every finding retains its separate reproduction/acceptance coverage. Grouping, final draft text and metadata await agreement; no Linear write.
- Fresh full FRO-244/363/366/301 remain Done and serve as requirement references; FRO-371 remains Backlog for global list/menu only. Parallel read-only overlap check found no exact correction owner: exact Shipment Invoice searches, broader recovery/allocation/frozen/fingerprint searches and all 13 current FRO Bug issues checked; plausible FRO-373/375/376/378/379/382/384/385 read fully. Existing Shipment/packing, Supplier Invoice, Delivery Note and Export scopes stay unchanged; future list/printing and broad allocation redesign are excluded. No blocker between the two groups established.
- Planning pull succeeded; gh auth and production main reverified unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Existing consumer trace and relevant selection/evaluation code reviewed; current status catalogue and Flow QA label confirmed. Updated docs/qa/runs/2026-11-09-shipment-invoice.md with proposed grouping/ownership and the QA catalogue. No new test run, production change, preview/branch, vocabulary or ADR. Prior isolated evidence and deployed/database/concurrency limitations remain unchanged. Preserve unrelated shared-checkout drafts/patches/.wrangler and other chat's VAT work.

### 2026-11-09 — Three VAT-paperwork correction groups proposed

- User reviewed all nine findings through simple examples and requested grouping without too many tickets. Proposed V1 Print ΥΔ selection/attempt isolation (QA-VAT-01/02 and print portion of 03, Medium); V2 stamping reviewed confirmations/date input/current progress (04/05/09 and bulk portion of 03, High); V3 single/bulk uncertain-attempt continuity and correct reconciliation (06/07/08, High). Grouping and priorities are recommendations awaiting agreement, not approved metadata or permission to create issues.
- QA-VAT-03 has two consumers with explicit non-overlapping ownership. V2 owns reviewed/submitted facts and normal pending input; V3 preserves/reconciles the same attempt on uncertainty. No unverified bulk-version API, new event correction, general refactor or blocking dependency. Every reproduction remains covered in later drafts. Shared fixes may be reused across existing tickets without broadening their scope.
- Fresh full FRO-317/321/348/352 remain Done with unchanged descriptions. FRO-379/385 remain Backlog and unchanged: invoice correction/cancellation and Export edits/Customs/cancellation. Current stamping/Print Bug searches returned FRO-384/385; full FRO-384 creation/files scope also excludes VAT printing/stamping. No exact VAT-specific correction owner found. Existing tickets should be related references, not silently expanded. Shipment Invoice grouping remains in the other chat.
- Planning pull succeeded; production main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Updated VAT report and QA catalogue with this proposal. No new tests or source fixes; earlier local evidence and backend/database/browser/PDF/deployment limits remain. No Linear writes, full ticket drafts, new vocabulary/ADR, preview or production branch. Preserve unrelated shared-checkout changes. Next step after agreement: prepare full drafts for review before creation.

### 2026-11-09 — Shipment Invoice groups approved; two full drafts prepared

- User accepted the two correction groups and requested complete drafts focused on current production behavior, keeping existing tickets as references only. Saved drafts/shipment-invoice-bugs/: D1 creation/replacement/saved-action recovery (QA-SHI-01/04/07/08), D2 goods/totals/review/frozen history (QA-SHI-02/03/05/06), plus metadata/consumer/coverage index. Both proposed High, FRO Backlog; Story/Bug/Pending_Review/Flow QA/Shipment plus Frontend for D1 or Integration for D2. Current catalogue has no Shipment Invoice-specific label; no new label proposed. No project/assignee/parent/milestone or blocking relations.
- D1 retains replacement prefill and later edits, original actor/payload-bound creation recovery through permitted navigation/reload/remount, terminal discard state and asynchronous saved-navigation retry. D2 uses invoice identity/line position for frozen rows, stable eligible selection across Orders, eligible-only amount/currency aggregation, deterministic allocation-aware review and stale-finalization refusal for existing drafts. Existing guards, frozen history, number policy and allocation-write ownership remain unchanged. All eight findings have one draft owner; all 15 criteria have matching read-only verification rows.
- Fresh full FRO-244/363/366/301 remain Done, FRO-371 Backlog list/menu only; FRO-244/363/366 comments empty. Current label/status catalogues and all 13 Bug issues plus Shipment Invoice search checked; no new matching owner. References are related-only and preserve existing description/status/scope. No Linear writes; full drafts and metadata await user review/approval before creation.
- Planning pull and gh authentication succeeded; main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Re-read relevant client/backend consumers; read-only backend subagent confirmed existing replay/line identity/review/total contracts. Existing components reused, canvas/preview skipped and production branch excluded. No new application tests/source fixes, vocabulary or ADR. Prior isolated evidence and all real database/concurrency/deployment limitations retained. Updated flow/scenarios/report/catalogue to accepted groups and draft links; synchronize only this task's files, preserving concurrent VAT drafts and unrelated FRO-326/patch/.wrangler work.

### 2026-11-09 — VAT-paperwork groups accepted; three full drafts prepared

- User accepted V1/V2/V3 and requested full drafts before Linear creation. Saved drafts/vat-paperwork-bugs/ with three standalone description files and metadata/consumer/coverage index. Proposed V1 Medium, V2/V3 High; all FRO Backlog with Story/Bug/Pending_Review/Flow QA/Frontend/export, plus supplier invoice on V2/V3. No project/assignee/parent/milestone, attachments or blocking relations; related requirement/overlap references only. No Linear writes.
- V1 owns print selections/attempts (QA-VAT-01/02/03-print); V2 reviewed individual versions, locked pending date input, eligible bulk selections and newer displayed progress (03-bulk/04/05/09); V3 single/bulk original-attempt recovery and matching event/date/Export (06/07/08). All nine findings have explicit owners and all 20 acceptance criteria have corresponding read-only post-deployment checks. Drafts propose pending-control locks using existing components. Matching saved state does not establish original actor/request attribution; absent/missing reads do not automatically prove non-application.
- Current FRO-317/321/348/352 remain Done and unchanged; FRO-379/385 Backlog and unchanged. Complete label/status catalogues verified, including active Flow QA. Current stamping/Print Bug searches show only already-scoped FRO-384/385; no exact VAT correction duplicate. Preserve their creation/correction/Customs/cancellation scopes, and keep Shipment Invoice with the parallel chat.
- Planning pull/gh authentication passed; main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Reread relevant UI/service/backend consumers, including same-date replay, public stampingExportId/activity and invoice-owned freshness. Updated flow/scenarios/report/catalogue to accepted groups and draft links. Documentation checks verified nine-finding coverage, 6+7+7 criteria/verification rows and local links. No new app tests, production changes, portal/database/AADE/email writes, preview/branch or vocabulary/ADR. Previous isolated evidence and browser/SQL/concurrency/PDF/deployment limits remain explicit.
- Complete draft text and metadata await user review before creation; no Ready/Todo promotion. Synchronize only VAT task changes, preserving the concurrent Shipment Invoice draft work and unrelated patches/.wrangler.

### 2026-11-09 — Shipment Invoice correction tickets FRO-386 and FRO-387 created

- User explicitly approved creating both reviewed tickets with proposed priorities/labels, including Flow QA, keeping existing issues as references only. Created FRO-386 (creation/replacement/saved-action recovery, High/Frontend) and FRO-387 (goods/totals/review after source changes, High/Integration). Both FRO Backlog with Story, Bug, Pending_Review, Flow QA and Shipment; no project, assignee, milestone, parent, cycle, due date, estimate, attachments or documents.
- Re-read both issues and verified complete approved descriptions after Linear Markdown/issue-chip presentation normalization, exact titles/priorities/full labels/status/team and related sets. FRO-386 related only to FRO-244/363/366; FRO-387 to FRO-244/363/366/301. No blocking or duplicate relationships. Approved description files remain unchanged from bec1234; all eight findings and 15 acceptance/verification pairs retained.
- Before/after full FRO-244/363/366/301 reads verify unchanged descriptions, titles, labels, status/priority, assignment/project/parent metadata, attachments and existing blocking relations. Only approved reciprocal related links to the new correction tickets were added. No reopening, readiness change or expansion of existing scopes.
- Planning pull, current label/status checks, duplicate search and production source SHA check succeeded; main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Updated draft index and QA flow/scenarios/report/catalogue with verified ticket links and receipt. No application tests/source fixes, production branch/deployment/portal/database mutations or new vocabulary/ADR. Synchronize only this task's planning changes and preserve other-chat/unrelated work.

### 2026-11-09 — VAT-paperwork correction tickets FRO-388–FRO-390 created

- User explicitly approved creation of the three reviewed drafts with their proposed priorities and labels, including Flow QA. Created FRO-388 (Print ΥΔ selections/attempts, Medium), FRO-389 (reviewed stamping confirmations/dates/current progress, High), and FRO-390 (uncertain stamping attempt recovery, High). All FRO Backlog with Story, Bug, Pending_Review, Flow QA, Frontend and export; FRO-389/390 also have supplier invoice. No project, assignee, milestone, parent, cycle, due date, estimate, attachments or documents; no readiness promotion.
- Full readbacks matched approved descriptions from aa8cc87 after only Linear Markdown/issue-chip presentation normalization. Verified exact titles/priorities/status/team, complete labels and related sets. FRO-388 relates to FRO-317/352; FRO-389/390 each relate to FRO-317/321/348/352/379/385. No blocking/duplicate relations. Three approved description files remain unchanged; all nine findings and 20 acceptance/verification pairs are retained.
- Before/after full reads verified existing requirement/correction descriptions and metadata unchanged. FRO-317/321/348/352 remain Done; FRO-379/385 remain Backlog. Approved reciprocal related links were added; attachment identities/titles/targets were preserved (Linear re-signed URL query parameters). Existing correction/cancellation/Customs scopes and the other chat's Shipment Invoice ownership remain separate.
- Mandatory planning pull, gh authentication, current labels/statuses and duplicate searches passed. Production main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Updated draft index and QA catalogue/flow/scenarios/report with created links and verification receipt. No new application tests, source fix, portal/database/AADE/email write, production branch, preview, vocabulary or ADR. All 30 full portal scenarios remain Not run and prior isolated evidence limits remain explicit. Synchronize only this task's planning records, preserving unrelated and concurrent work.

### 2026-11-09 — Customs Storage Entry mapped and reviewed

- User approved expected-flow mapping first, then parallel agents and backend checks; expressly excluded Export/VAT operations and pending FRO-358 list/register/print work. Saved docs/qa/flows/customs-storage-entry.md and 30 scenarios before defect testing; full report docs/qa/runs/2026-11-09-customs-storage-entry.md. Other chat is now reviewing Stock List selection/printing; its scope and files preserved.
- Fresh full FRO-319/353/354/355 Done with empty comments, FRO-358 Backlog, FRO-356 background read. Current Bug searches and full FRO-375 scope checked: no exact CSE correction owner identified; no Linear writes, grouping or new ticket priority/label approval. Existing sources' historical absent-entity text is not current implementation evidence.
- Ten isolated UI findings QA-CSE-01–10: recovered preselection retargets Order; latest-version baseline permits stale overwrite; delayed save loses later edits; uncertain create/edit/move outcomes falsely claim no changes; acknowledged creation loses saved-record recovery after async navigation failure; internal navigation loses dirty Create/Details drafts; pending target lookup bypasses warehouse warnings; return Order falsely presented as covered child after move; failed selected-Order reads hidden/misclassified; stock confirmation leaves entry shortcut stale/disabled. Existing backend uniqueness protects against same-owner duplicate persistence; a second request is not proof of duplicate records.
- Three focused agents covered Create, Details and backend; parent inspected source, challenged an unestablished inherited-recovery transition, tested actual stock form/shortcut integration and independently reran evidence. 115 existing UI tests passed; new combined 27/27 = 10 controls + 16 defect observations + one explicitly conditional case excluded from findings. Final backend harness 155 controls from 39 extracted source files passed, no separate backend defect confirmed. Actual User company/role guards included; earlier simplified 146-control exploration superseded, not added. Evidence retained under docs/qa/evidence/customs-storage-entry-*.
- Mandatory pull and authenticated gh source checks passed; main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Git-tree comparison: 1773/1774 archive files matched, unused gradlew.bat only mismatch; all application source used matched. Final scratch client562/562 unchanged. Playbook loader failed without archive .git; relevant policies read directly, no snapshot/fingerprint claimed. Node24.13/Vitest4.1.6/jsdom/cached dependencies; backend Java17 preview extraction/in-memory repository/admission/JSON stand-ins, networking blocked. Native Java25/Gradle/Testcontainers, real admission SQL/locks/rollback/concurrency, authenticated transport, visual browser and deployed revision remain unverified. All30 complete portal scenarios Not run. No production changes, integrations, branch, preview, new vocabulary or ADR. Commit/push only this task's planning/evidence records, preserving concurrent files and unrelated patches/.wrangler.

### 2026-11-09 — Stock List selection and printing mapped and reviewed

- User authorized checking later ticket changes, mapping the expected flow first and then code-based QA, separately from the other chat's Customs Storage Entry review. Saved docs/qa/flows/stock-list-selection-printing.md and 28 scenarios before reproductions; report docs/qa/runs/2026-11-09-stock-list-selection-printing.md; retained evidence indexed by docs/qa/evidence/stock-list-evidence.md. No ticket grouping, draft, priority/label decision or Linear write in this task.
- Full current FRO-279/254/269/292/294/295/297/238/256 plus later FRO-299 read. Core comments empty; later notes confidentiality, retired PCS and current nonterminal DG applied. FRO-310 Canceled, FRO-318/362 Backlog not treated as delivered requirements. FRO-254 surviving per-column/date control scope and partial later measurement fallback remain two separate clarification items.
- Eleven bounded findings QA-SL-01–11: clearing Client also clears compatible Vessel; first100 option truncation; late preference responses overwrite newer table intent; Flags missing from server preference allowlist; shrinking results strand later pages; checkbox-time eligibility remains stale; creation silently reduces selected IDs absent from first100 candidates; old DECLARED snapshot masks corrected measurements; previous dispatched transport outranks newer associated ready leg; printed notes collapse saved line breaks; valid long child Order ID overlaps Client. Expected Vessel preservation interprets FRO-254's independent controls; transport follows FRO-279's latest associated leg, not an invented latest-dispatched rule. Findings are not ticket counts.
- Three scoped agents reviewed selection, filters/preferences and backend model; parent inspected source and independently reran 16 selection and 13 filter cases plus backend extraction. Total63 frontend tests (30 existing +16 selection +13 filters +4 preview), all passed; observations assert current defects. Backend69 controls +5 observations +7 static checks passed, with one partial-measurement observation not promoted. Five local PDF fixtures/eight pages all visually inspected; six PDF checks passed, including both formatting defects. Synthetic 101-option/100-split/weight/transport examples are not live company counts or data.
- Mandatory planning pull succeeded. Authenticated production main rechecked unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; all562 original copied client sources unchanged. Cached Node24.13/Vitest4.1.6/jsdom; actual components with mocked transport/router boundaries. Backend Java17 exact bodies with DTO/query/authorization stand-ins, not Java25/Gradle/SQL/locks/real DB. Real OpenHTMLtoPDF1.0.10 with exact template CSS and escaped synthetic binding; no Thymeleaf/HTTP/deployed font equivalence. No live portal, database, email, AADE, production-source edit or branch. All28 full portal scenarios remain Not run. Source loader failed on archive noGit; direct policy reads recorded without successful fingerprint. No vocabulary/ADR change. Preserve other chat and unrelated patches; synchronize only these planning/evidence records.

### 2026-11-09 — Customs Storage Entry correction grouping proposed

- After discussing all ten findings individually, the user requested as few correction tickets as possible, with existing tickets as references only and FRO-358 excluded. Recommendation awaiting acceptance: two new correction tickets. A: protect drafts and recover creation/save outcomes, QA-CSE-01/02/03/04/05/06/09, High; B: correct Order relationship warnings, coverage and admission actions, QA-CSE-07/08/10, Medium. Each finding has one proposed owner; A owns reviewed versions and uncertain Change Order outcomes, B owns its warehouse warning/coverage display and the stock-confirmation shortcut refresh.
- Proposed labels on both: Story, Bug, Frontend, Pending_Review, Flow QA, entry note; B also Order. Reference-only sets: A FRO-319/353/354; B FRO-319/354/355. Existing issues are not reopened, expanded or made blockers. FRO-358 list/register/Excel/print/recipient copies, Export and VAT stamping stay excluded; no pending feature is folded into a correction. No backend-rule change or migration proposed.
- Mandatory pull succeeded. Fresh full FRO-319/353/354/355 reads remain Done; FRO-358 remains Backlog. Current Customs Storage search returned 75 results with no further page and no exact correction owner identified. Current label names/group membership verified. Authenticated gh read confirms main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; existing consumer trace and isolated evidence retained, no new application tests needed for grouping. Initial sandbox GitHub network failure resolved through authenticated read-only escalation. Other chat's Stock List records and unrelated changes preserved.
- This is a proposal, not approved ticket drafts or creation. No Linear writes, production changes, new UI design, preview, branch, vocabulary or ADR. Existing presentation contracts reused; next step is full correction drafts after the grouping is accepted. Synchronize this memory record only.

### 2026-11-09 — Stock List correction grouping proposed

- User discussed all eleven Stock List findings individually and requested grouping into fewer tickets. Recommended three groups, awaiting acceptance: (1) filters/pagination/saved settings, QA-SL-01–05, Medium; (2) current Start shipment eligibility and complete selected-Order handoff, QA-SL-06/07, High; (3) current/readable Stock List PDF, QA-SL-08–11, High. Every finding has exactly one proposed owner and retains its own acceptance/verification case; no umbrella or eleven individual tickets. Added the proposed mapping to the existing run report, not ticket drafts.
- Fresh Flow QA and Stock List searches completed with no further pages and no exact correction owner identified. Full current FRO-373/375/376 and FRO-254/279/292 fetched. FRO-373 owns origin-change/draft preservation, while the new Shipment group would own list eligibility and initial complete-set handoff; coordinate shared code without duplicate scope. FRO-375 Details/version/comments and FRO-376 load-unit mutation/history are separate. Two unresolved FRO-254 control-coverage and partial-measurement questions remain excluded. Other chat's Customs Storage Entry work remains separate.
- Mandatory planning pull and authenticated main check passed; source unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Existing evidence/consumer trace retained; no new tests required for planning only. No agreed ticket drafts/priorities/labels yet, no Linear writes, production changes, canvas, preview or branch. No vocabulary or ADR decision. Synchronize only this proposal record and run-report addition, preserving concurrent/unrelated work.

### 2026-11-09 — Customs Storage Entry grouping accepted; full correction drafts prepared

- User accepted the two correction tickets and requested complete drafts focused on current behavior, references only and FRO-358 excluded. Saved exact description bodies and metadata/consumer/coverage index in drafts/customs-storage-entry-bugs/. D1: protect drafts and recover creation/save outcomes, High, QA-CSE-01–06/09; D2: correct Order relationships, warehouse warnings and admission actions, Medium, QA-CSE-07/08/10. Draft text/creation pending review; no Linear write.
- Both proposed FRO Backlog with Story, Bug, Frontend, Pending_Review, Flow QA, entry note; D2 also Order. No project/assignee/milestone/parent/cycle/due date/estimate/attachments/documents. Related references only: D1 FRO-319/353/354, D2 FRO-319/354/355; no blocking relation or dependency between groups. FRO-358 scope excluded in descriptions without mentioning its identifier there, avoiding an automatic related link. Export/VAT and pending Invoice/Export links excluded; no existing issue reopened or expanded.
- D1 specifies stable selection, honest lookup retry, frozen reviewed baseline, locked pending editor, original-context reconciliation, acknowledged saved navigation and internal-route protection. Explicit retry uses existing reads/guards; no Customs Storage request-ID replay or exactly-once guarantee is invented. D2 specifies ready target warehouse facts, existing warnings/retained values, verified inherited coverage and server-derived shortcut refresh after stock confirmation. Shared Details ownership is explicit: D1 versions/results, D2 warehouse/coverage. All ten findings assigned once; all 16 criteria have read-only verification rows.
- Mandatory pull, gh auth/main, fresh full reference/Backlog exclusion reads, duplicate search and current label/status metadata verified. Production main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; relevant integrated source and backend version guard reread from the authenticated blob-verified archive. Prior evidence remains 115 existing UI, 27 isolated checks and 155 extracted backend controls, not new fix tests or deployed verification. Updated QA catalogue/flow/scenarios/report to link drafts without changing scenario execution states.
- Existing presentation contracts reused; canvas/preview/UI branch skipped for draft-only work. No application code/test execution, production/database/AADE/email writes, vocabulary, ADR or learning update. Reviewed saved bodies/reference sets/link targets/coverage; show both complete raw descriptions in chat before the AGENTS.md step-4c creation gate. Commit/push only this task's planning files; preserve other chat's Stock List work and unrelated patches.

### 2026-11-09 — Customs Storage Entry correction tickets FRO-391–FRO-392 created

- User explicitly approved creating both reviewed tickets with proposed priorities/labels, including Flow QA, keeping existing tickets as references only and FRO-358 excluded. Created FRO-391 (draft/create/save recovery, High) and FRO-392 (Order relationships/warehouse warnings/admission actions, Medium). Both FRO Backlog with Story, Bug, Frontend, Pending_Review, Flow QA and entry note; FRO-392 also Order. No project, assignee, milestone, parent, cycle, due date, estimate, attachments or documents; no Ready promotion.
- Full readbacks match approved descriptions from 296b99a after only Linear table/bullet/whitespace/bold/issue-chip presentation normalization. Verified exact titles, priorities, status/team, complete labels and reference sets; all ten findings and 16 acceptance/check pairs retained. Numbered description files unchanged. FRO-391 relates only to FRO-319/353/354; FRO-392 to FRO-319/354/355; no blocking or duplicate relationships.
- Before/after full reads verified reference descriptions, metadata, existing blocking relations and attachments unchanged except approved reciprocal related links. FRO-353 attachment URL queries re-signed; five attachment identities/titles/targets preserved. FRO-319/353/354/355 remain Done; FRO-358 remains unchanged Backlog, including relations, with no link from either correction. Export/VAT and the other chat's Stock List scope remain separate.
- Mandatory pull, gh auth/current main, fresh labels/statuses and duplicate search passed. Source remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Updated approved-draft index and QA catalogue/flow/scenarios/report with ticket links and verification receipt. No new product tests, source fix, production branch, preview, portal/database/AADE/email write, vocabulary or ADR. All 30 full portal scenarios remain Not run with prior isolated evidence limits. Commit/push only this task's records, preserving concurrent Stock List and unrelated changes.

### 2026-11-09 — Three Stock List correction drafts prepared for review

- User accepted the three Stock List groups and proposed Medium/High/High priorities, then requested complete drafts before creation. Saved drafts/stock-list-bugs/01-list-controls-and-settings.md (QA-SL-01–05, Medium), 02-shipment-selection-and-handoff.md (QA-SL-06/07, High), 03-pdf-values-and-formatting.md (QA-SL-08–11, High), with README metadata/coverage/consumer trace. All11 findings have exactly one owner; 17 acceptance criteria have matching post-deployment verification rows. Descriptions and metadata remain pending review; no Linear writes.
- Proposed team FRO/Backlog, no assignee/project/milestone/cycle/parent/estimate/due date/attachments/documents. All carry Story, Bug, Pending_Review, Flow QA, Order. S1/S2 Frontend; S2 also Shipment; S3 Backend. Current Type/Area groups are single-select and all labels active. Proposed related-only references: S1 FRO-254/279; S2 FRO-279/341/373; S3 FRO-279/292/295/297. No blockers, existing-ticket edits or readiness promotion.
- Fresh full requirement/reference issues fetched: FRO-254/279/292/295/297/341 Done; FRO-373 Backlog. Current Flow QA inventory found no exact Stock List correction owner. Authenticated gh main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e; relevant pinned source reread. Consumer tracing also checked shared form-options readers: Order forms and inline creation, Order invoice-row currencies, Shipment Invoice Create/Details currency options. S1 preserves these shared contracts if changed; no new Shipment Invoice review. Shipment latest-leg repository method is consumed by StockListPdfService; similarly named Order status-history lookup remains unrelated.
- Scope preserves FRO-373 origin-change/draft ownership, current eligibility/authorization, fixed PDF/source confidentiality, terminal exclusion, PCS removal and no-write reads. Broader FRO-254 column/date controls and cross-stay partial-confirmation fallback remain outside these drafts. Existing presentation reused; canvas/preview skipped, no production implementation/branch, vocabulary or ADR.
- Mandatory planning pull and current label/status checks passed. Draft validation verified unique finding ownership, 17 criterion/check pairs, all local links and pinned evidence targets, exact reference sets and allowed label combinations. Updated QA catalogue/flow/scenarios/report; all28 full portal scenarios remain Not run. No new application tests needed for draft-only work; prior isolated evidence and deployment/SQL/renderer limits retained. Synchronize only Stock List drafts and planning references, preserving other chat's Customs Storage Entry records and unrelated files.

### 2026-11-09 — Next substantial review recommendation: supplier readiness email and response

- User requested a major remaining flow without overlapping the other chat or pursuing cosmetic issues. Current snapshot/recent turn of Missing entities in UI (01a1bcaf-5410-7a03-8942-8d6d8a92da4a) shows Stock List correction drafts being completed; no reassignment or message sent. Existing Order-to-arrival OS-008 covers eligibility/preview boundaries and explicitly leaves confirmed sending, retries/provider results to separate evidence.
- Recommend the complete supplier readiness email loop: manual preparation/review/send and scheduled reminders, provider delivery and uncertain outcomes, supplier public response link/token, date/confirmation application and Order/history refresh. Focus on wrong recipient or reviewed date/content, duplicate/obsolete delivery, unsafe token reuse/cross-Order access, stale response overwrites and blocked recovery. These are review risks, not newly established findings. Ordinary Order lifecycle and Stock List printing/selection retain their existing owners.
- Fresh full FRO-242 and FRO-328 remain Done; authenticated main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Current workflow and integrated reminder/public-response sources confirm this is implemented. Supplier Yes confirms the stated expectation without marking the Order Ready; supplied/replacement dates use their own guarded updates. FRO-259 client reminders remain Backlog and are not this recommendation.
- Recommendation only: no new map, defect audit, tests, Linear changes or authorization to send emails/submit public responses. Next accepted review should map current tickets/code before isolated frontend/backend/provider-fixture checks. Mandatory planning pull completed; record and synchronize only this recommendation, preserving unrelated work.

### 2026-11-09 — Stock List correction tickets FRO-393–FRO-395 created and verified

- User approved the complete Stock List drafts and requested creation with the proposed priorities and labels, including Flow QA. Created FRO-393 (list controls/preferences, Medium, QA-SL-01–05), FRO-394 (current eligibility and complete Shipment handoff, High, QA-SL-06/07), FRO-395 (correct/readable PDF, High, QA-SL-08–11). All team FRO / Backlog, with Story, Bug, Pending_Review, Flow QA, Order; FRO-393/394 Frontend, FRO-394 also Shipment, FRO-395 Backend. No Ready promotion, assignee/project/milestone/cycle/parent/estimate/due date, attachments or documents.
- Independent full readbacks match the approved description files from bedf217 after only Linear table/list/URL/issue-chip normalization. Verified exact titles, priorities, complete labels, team/status and related-only references: FRO-393 → FRO-254/279; FRO-394 → FRO-279/341/373; FRO-395 → FRO-279/292/295/297. No blockers or duplicate relations. All eleven findings retain exactly one owner and 17 acceptance/verification pairs. Numbered description files unchanged; existing issue descriptions/statuses were not edited, and approved related links are reciprocal.
- Mandatory pull completed. Fresh metadata and complete Flow QA/Stock List searches found no exact duplicate before creation. Current full FRO-373 reread; authenticated production main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Existing presentation reused; no canvas/preview or production branch. Separate FRO-373, packing/history, Customs Storage Entry and Shipment Invoice scopes preserved; broader column/date controls and partial-confirmation fallback remain outside these tickets.
- Updated drafts/stock-list-bugs/README.md and creation-verification.md plus QA catalogue/flow/scenarios/report with issue links and ownership. No new product tests or production fixes/writes; all 28 full portal scenarios remain Not run with prior evidence limits. Commit/push only these planning records, preserving unrelated changes and the other chat's supplier-readiness recommendation.

### 2026-11-09 — bugs.md coverage checked before Flow QA consolidation

- User deferred the requested ticket-consolidation review until coverage against C:/Users/Giorgos/Desktop/Front Line/bugs.md is established. Read the ten observations and all scenario notes; fetched all 23 current Flow QA issues FRO-373–395 (all created today, Backlog) and the active label. No Linear changes or merge decisions.
- Direct coverage: #5 attachment 401 -> FRO-377 (root cause still unresolved); #7 origin-warehouse change -> FRO-373 (reset/freeze reproduced, literal deployed crash unverified).
- #2 navigation is outside Flow QA: current FRO-368 owns Export list/menu and FRO-371 Shipment Invoice list/menu, both Backlog. No explicit Supplier Invoice global-menu owner found; FRO-347 explicitly excludes new global navigation. Do not infer every missing entity is covered.
- Remaining observations have no explicit correction in the 23 tickets: #1 customs-regime selection/admission blockage; #3 separate readiness/date-provided fields; #4 editing an accepted draft colli; #6 disabled readiness request; #8 arrival on the main page; #9 narrower document creation cards; #10 automatic packing/count/weight.
- Current contracts qualify these gaps: FRO-356 requires an explicit warehouse-supported regime for Greece=Yes and blocks missing capabilities; a reported inability still needs diagnosis. FRO-335/336 specify initial status plus date, not the requested three controls. FRO-335 deliberately omits saved-row Edit mode and allows accepted rows to expand; inability to correct values must be distinguished from absence of a button. FRO-328 has manual-send eligibility beyond status, so disabled alone does not establish a bug. FRO-316 places dispatched arrival under Available actions. FRO-244/363/366 explicitly make packing/weight manual for selected goods; FRO-387 monetary totals do not cover automatic packing/weight. #9 says Delivery Note but is referenced from the Shipment Invoice scenario: target screen remains ambiguous.
- This is coverage verification, not a new deployed defect audit or acceptance of behavior changes. Scenario steps report successful flows as well as failures; no additional distinct defect inferred. Consolidation remains deferred; no canvas, preview, production branch, tests, emails, AADE calls, or product mutations. No vocabulary/ADR change.
- Planning pull succeeded; authenticated gh verified production main at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Existing process lessons on current owners and separating decisions from reports consulted. Preserve unrelated FRO-326 drafts/patches, FRO-352/353 patches and .wrangler when synchronizing this memory-only record.

### 2026-11-09 — bugs.md item 1 clarification, decision round

- User requested reviewing uncovered items individually before Flow QA consolidation. Item 1 only: current full FRO-356/335 reread; planning pull and gh access passed; production main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Grilling/domain-modeling loaded; bounded read-only source trace delegated under grilling instructions and key guards independently reread.
- User confirmed Greece=Yes must require customs regime at Order creation. User also confirmed no Opening warehouse had been selected when the message Choose the opening warehouse to see its regimes appeared. This reported creation hint is therefore expected prerequisite guidance, not evidence of a broken selected-warehouse lookup.
- Live creation-draft.ts warehouseRegimes matches selected ID against loaded options; no match gives the quoted choose-warehouse hint, whereas matched empty capabilities give a different no-supported-regime message. Opening warehouse exists as a selectable input. No deployed UI reproduction or warehouse data inspection performed.
- Live OrderCustomsRules.requireStorageAdmission rejects Greece=Yes plus null saved regime. Shipment warehouse-destination creation/route/membership consumers preserve this guard; nonwarehouse destinations are exempt. docs/workflows/order-customs-regime.md explicitly permits older Orders to retain null until corrected and notes older warehouses need confirmed capabilities configured. Neither older-data explanation is verified for PO-0000001.
- Recommendation pending user acceptance: keep FRO-356/335 unchanged and create no new bug ticket from item 1 as currently evidenced; select Opening warehouse before regime, and correct the missing saved regime before warehouse-bound Shipment creation. A demonstrated inability to select a supported regime or correct the saved Order would be a distinct investigation. Do not claim any record fixed. Other uncovered items and consolidation remain pending.
- Existing presentation reused; canvas/preview unnecessary for this no-change recommendation; no UI branch, production writes, Linear changes, tests, new vocabulary or ADR. Preserve unrelated working files. Record and synchronize this decision round only.

### 2026-11-09 — Item 1 corrected: mock warehouse capabilities block Order creation

- User clarified the real problem: Free circulation is unavailable across warehouse choices, and some warehouses offer no customs regimes at all, making required-regime Order creation impossible. This supersedes the prior no-ticket recommendation; the earlier unselected-warehouse hint did not describe the complete issue.
- Agreed requested outcome: all selectable mock warehouses must explicitly support FREE_CIRCULATION and expose it for selection. Preserve existing warehouse-specific CUSTOMS_STORAGE/CUSTOMS_WAREHOUSING capabilities. Greece=Yes still requires explicit regime selection; do not auto-select a regime, make it optional, or generalize this mock configuration into an unverified real-warehouse policy.
- Fresh production main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Read live data.sql: warehouse IDs 1/2/3 already receive FREE_CIRCULATION; their additional capabilities differ. docs/development/demo-data.md identifies this seed as local dev data, not proof of deployed mock database contents. Thus absent deployed values vs API/form-option/UI mapping remains undiagnosed. No shared-environment seed/reset was run.
- Item 1 now needs a bounded mock-environment configuration/integration correction, not a change to FRO-356 requiredness. Cover existing selectable mock warehouses as well as repeatable fixture setup; ensure stored capabilities, authorized warehouse/form-option reads and dropdown agree, and verify successful Order creation with an explicitly selected supported regime in an isolated/mock-approved test. Preserve existing records and additional capabilities; no blanket reset or guessed regime backfill for saved Orders.
- The separate PO-0000001 missing-regime admission report is not automatically solved by warehouse capability configuration; saved Order regime remains its own required fact. Existing storage admission guards remain intact.
- No complete ticket draft or Linear write approved/performed yet; defer ownership/grouping until uncovered items reviewed. No production source/database edits. Mandatory planning pull succeeded; synchronize this clarification only, preserving unrelated drafts and patches. No new glossary or ADR; no UI redesign/preview/branch needed for configuration consistency.

### 2026-11-09 — Item 1 business-rule decision accepted; item 2 navigation review

- User explicitly approved allowing Order creation when customs regime is unknown, requiring the regime and verified warehouse compatibility before stock confirmation or storage admission. This supersedes the earlier creation-required decision and mock-data-only classification. Do not invent a default regime or assume unknown warehouse capabilities are compatible. Greece=No remains outside applicable regime requirements. Record this as the agreed change for item 1; full consumer tracing and complete draft/approval remain required before any Linear edit. FRO-356 and FRO-335 are affected contracts; exact correction-ticket ownership is deferred until grouping. No blanket backfill or production data change authorized/performed.
- User requested moving to item 2 now. Fresh full reads: FRO-368 Export list/menu Backlog; FRO-371 Shipment Invoice list/menu Backlog; FRO-358 Customs Storage list/menu Backlog; FRO-361 Delivery Note list/menu Todo. Existing tickets already own these navigation entries. Current Supplier Invoice search found no explicit standalone list/menu owner.
- Live main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Read app-shell.tsx: desktop primary navigation and mobile Sidebar share sidebarItemCandidates; currently Dashboard, Purchase orders, Shipments, Warehouses, Users, Companies only. Navigation scope should account for both surfaces and existing access checks; no design proposed or implemented yet.
- Recommendation pending user decision: reuse existing navigation/list tickets, add only missing Supplier Invoice list/menu scope rather than duplicate generic Flow QA tickets. Clarify desired entity set before drafting. No Linear writes or production changes. Planning pull passed; synchronize only this memory entry, preserving unrelated files. No new vocabulary/ADR; design and ticket-writing gates remain pending.

### 2026-11-09 — Item 2 accepted; item 3 deferred

- User accepted item 2: all five discussed entities need main-menu access to searchable lists, rows opening existing Details, and creation where their workflows permit it. Reuse FRO-368 (Exports), FRO-371 (Shipment Invoices), FRO-358 (Customs Storage), FRO-361 (Delivery Notes); prepare missing Supplier Invoice list/menu scope later. Delivery Note creation remains in Shipment workflow. Preserve permissions and desktop/mobile navigation. This is scope approval, not approval of a complete ticket description or Linear write.
- User requested moving to item 3 and indicated no action is needed now. Treat separate Readiness / Readiness Date Provided / Expected Readiness Date controls as deferred redesign: retain current behavior; no new ticket or change for item 3 now. Do not interpret deferral as a claim that every readiness behavior is verified or as rejection of future redesign.
- Items 1/2 remain agreed changes awaiting complete draft/consumer checks and later consolidation; item 3 deferred. Next uncovered item is 4 (editing a saved draft colli). No Linear, production, vocabulary or ADR changes. Mandatory pull passed; synchronize this memory-only record and preserve unrelated files.

### 2026-11-09 — Item 4 coverage: accepted creation colli rows remain editable

- User wants to edit a colli after saving its local row, before creating the Order. Fresh FRO-335 full read (Done) specifies accepted rows collapse after Save, may expand independently, and deliberately has no separate saved-row Edit mode. FRO-374 (Backlog) covers stock-panel and measurement validation defects, not a missing edit-button feature.
- Live main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Read creation/creation-collis.tsx: row Save sets pending=false and expanded=false; it does not disable numeric inputs or flags. Clicking Colli N/chevron toggles expansion and exposes editable description/package/DG fields. All input callbacks patch the same local row values regardless of pending. Save/Cancel apply only to pending additions; accepted rows retain Remove. No backend write occurs for these local edits.
- Answer: requested editability is already covered by FRO-335 and present in current source; use direct fields and expand Colli N, without a separate Edit button or second row Save. Deployed UI equivalence has not been checked. If user's running page cannot edit these controls, investigate deployment/runtime mismatch rather than assume a new feature is required. No new ticket or UI change proposed on current evidence; no final user disposition assumed.
- Planning pull succeeded; no production writes, Linear changes, application tests, new vocabulary or ADR. Synchronize memory only; preserve unrelated working files. Items 1/2 accepted changes and item 3 deferral remain intact.

### 2026-11-09 — Item 4 reopened after user reports typing does not work

- User reports saved creation-colli fields accept no typing. Retract earlier operational confidence: source handlers alone do not establish working deployed editing. Item 4 remains a reported defect requiring reproduction, not cleared as no action.
- Applied systematic debugging. Fresh main SHA unchanged; read PurchaseOrderCreationForm parent, creation-draft mapping, shared Input and existing creation tests. Child changes feed form.setFieldValue(collis); creationValues uses current row values. Parent fieldset disables all controls while final creation is pending/unknown. No source rule intentionally locks accepted colli rows. This does not establish the user's actual cause.
- Existing creation test covers typing before Save then copying saved rows; it does not exercise typing after Save. No runtime reproduction performed in this turn. Requested affected fields, portal footer version, and whether final Create or only row Save was pressed. Await evidence; do not assume misuse, deployment mismatch or a specific root cause.
- Preserve desired behavior: modify accepted local collis before Order creation and submit revised values. FRO-335 owns the expected presentation; a correction owner/group awaits investigation. No Linear/production changes or application tests; planning pull succeeded. Synchronize this correction to memory only.
- Follow-up clarification for item 4: user did not press final Create; attempted editing dimensions, gross kg and net kg after row Save. Thus normal pending/unknown final-creation lock does not explain the reported sequence. Treat this as reported post-Save numeric editing failure with root cause/deployed build unverified; no extra Edit step is intended by the current design.

### 2026-11-09 — Item 4 accepted, item 5 covered, item 6 eligibility investigation

- User accepted item 4 as a bug to fix and item 5 as already covered (FRO-377); requested moving to disabled Request readiness date (#6). Preserve reported numeric post-row-Save failure; root cause remains unknown.
- Fresh full FRO-328 read and live main 6aa259553cd9c86a8aaa157902088aa9a6bca83e source read: ReadinessReminderCommandService currentActionEligibility requires PENDING/no date, an existing scheduled ASK_READINESS_DATE record, no pending reminder, and a weekday in Europe/Athens. The scheduled record need not have succeeded. Missing supplier/contact separately prevents preparation/send; do not equate it with a returned disabled reason. Authorization remains enforced.
- Read readiness-emails.tsx: header has an info control displaying unavailable reason; Available actions displays it directly. Button uses server eligibility and preparation-in-progress state. Failed/missing eligibility can also leave it disabled. No deployed Order response or reason inspected, so no exact cause or bug conclusion yet.
- Next question is the actual disabled reason for user's saved Awaiting Readiness Date Order. Explain initial scheduled-reminder prerequisite as an existing FRO-328 contract, not a newly accepted rule; decide rule change only after clarification. No emails/preparations/sends, portal mutations, application tests or Linear changes. Planning pull passed; synchronize memory only, preserving unrelated working files.

### 2026-11-09 — Item 6 accepted; item 8 Overview arrival action review

- User accepted #6: first readiness request is automatic; manual follow-up requires that first automatic request to have been successfully sent, not merely an existing scheduled record. Preserve no-second-pending reminder and other unchanged eligibility/authorization/review rules. This changes FRO-328's explicit existence-only prerequisite; complete drafting/consumer trace and Linear write approval remain later. No sending authorized/performed.
- User confirmed #7 already covered (FRO-373) and requested #8. Fresh full FRO-316 remains Done; production main 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Specification places dispatched arrival/final handover under Available actions and only Dispatch under Overview next-step actions. Current shipment-status-card.tsx lacks arrival action; shipment-actions-tab.tsx renders the purpose-specific arrival form only for DISPATCHED and recordArrival capability. ShipmentArrivalForm keeps existing purpose-specific handover and validation.
- Proposed direction pending user agreement: add Record arrival in Overview's status card for eligible dispatched Shipments, opening the existing purpose-specific form in a dialog; retain Available actions entry and existing guards, with consistent draft handling coordinated with FRO-373. Opening does not record arrival; explicit form confirmation still required. This is a UI contract change, not evidence that current placement violates FRO-316. No canvas or preview prepared while direction remains undecided; UI design/reconciliation gates remain applicable later.
- Mandatory pull succeeded. No Linear/production writes, tests, vocabulary or ADR changes. Synchronize memory only, preserving unrelated work.

### 2026-11-09 — Item 8 accepted; item 9 target-screen clarification

- User approved #8: eligible Dispatched Shipments show Record arrival in Overview's status card; open existing purpose-specific arrival/handover form in a dialog, retain Available actions entry, existing permissions/validation and explicit confirmation. Carry draft preservation consistently with FRO-373. Approval is direction/scope only; full UI reconciliation/design and ticket review remain before publication. No Linear or production change.
- User requested #9, narrower creation-page cards. Re-read bugs.md: numbered #9 names Delivery Note creation, while Shipment Invoice scenario cites #2/#9. Ask whether affected screen is Shipment Invoice, Delivery Note, or both before selecting source/design owners. No inferred target or layout decision yet.
- Planning pull passed. No application tests, vocabulary or ADR changes. Synchronize memory only and preserve unrelated files. Prior accepted #1/#2/#4/#6/#8 changes, #3 deferral and #5/#7 existing coverage remain intact; consolidation still deferred.

### 2026-11-09 — Item 9 confirmed: Shipment Invoice creation layout consistency

- User clarified #9 is Shipment Invoice creation, not Delivery Note, and explicitly requested the same layout as other entity pages, correcting narrower cards.
- Fresh full FRO-363 remains Done and owns stacked creation cards (Shipment, document details, parties, goods, packing/notes). Live main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. shipment-invoice-create-page.tsx renders ShipmentInvoiceCreateForm; components/shipment-invoice-create-form.tsx wraps all cards in mx-auto w-full max-w-5xl space-y-5 pb-6, imposing an extra width cap inside app-shell.tsx's shared max-w-[100rem] main area. This supports the reported narrower layout; no deployed visual comparison performed.
- Accepted direction: align Shipment Invoice creation page/card width and outer alignment with standard entity-page layout; retain existing card sequence, fields, behavior, validation and responsive EN/EL usability. No new components or unrelated redesign requested. Reuse existing portal layout/design contracts; no duplicate canvas/preview for this conformity correction. Final ticket ownership/grouping and exact text remain deferred; reconcile any conflicting existing preview at drafting, do not silently retain two specifications.
- No Linear or production changes. Planning pull passed; synchronize memory only, preserving unrelated files. No tests, vocabulary or ADR needed for this scope record. Item 10 remains next.

### 2026-11-09 — Item 9 accepted; item 10 automatic packing and weight requested

- User confirmed #9 and requested #10: calculate Shipment Invoice packing details and total weight automatically from goods selected for that invoice. This changes current manual-field contracts in FRO-244/363/366; fresh full reads all Done. Do not substitute whole-Shipment totals for selected goods.
- Live main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Read ShipmentInvoiceGoodsReader: eligible selected commercial rows resolve through InvoiceRowLocations to physical colli coverage; multiple rows may share a colli and confirmed groups can lack exact individual placement. Fresh FRO-301 preserves multiple rows per colli and confirmed-group allocation. An automatic physical count/weight cannot simply sum per-row or per-Order aggregates without double-counting or assigning unselected goods.
- Requested automation direction recorded; exact rules remain open: whether packing means original distinct collis or final shipment packages/load units after consolidation, and treatment of selected subsets sharing a physical package or lacking exact weights. Ask concrete examples before drafting calculations. Recommend explicit uncertainty/manual resolution rather than invented proportional weight; no user agreement on fallback yet.
- Pending downstream trace for eventual draft: creation, saved draft edits/review invalidation, replacements, finalization/frozen history and document consumers. No full spec/ticket write or root-cause claim; this is requested behavior change. No new UI design/preview or production branch now. Planning pull passed; synchronize memory only; preserve unrelated files.

### 2026-11-09 — Item 10 accepted; comprehensive grouping proposal prepared

- User accepted #10: calculate final shipping packages and weight from selected invoice goods; allow manual values where calculation cannot be accurate. This supersedes current manual-only contracts, not permission to guess proportional weights. Exact calculation/fallback/review/freeze details remain for draft reconciliation. User then requested grouping all agreed changes with Flow QA.
- Fresh full reads of all 23 Flow QA issues FRO-373–395 plus navigation owners. Main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Prepared drafts/flow-qa-consolidation-proposal.md: propose 16 QA work items by entity/workflow, absorbing #4 into 374, #8 into 373, #9 into 386, #10 into 387. #5/#7 already covered; #3 deferred.
- Proposed merges: 378/379/380; 381/382; 384/385; 389/390; 391/392; 393/394. All 23 original IDs mapped exactly once (programmatically checked). These organizational changes are proposals, not user decisions; explicitly acknowledge 380's existing separation instruction and reconcile companion exclusions only after approval.
- Keep three new scopes separate: #1 deferred customs requirement, #6 successful-first-automatic-send prerequisite, #2 Supplier Invoice list/menu. Reuse existing 368/371/358/361 navigation scopes. Counts: 23 QA ->16; plus3 new =19; with4 existing navigation owners =23 affected active items, compared with27 current QA+navigation items. No total-board claim or effort reduction implied.
- Full proposed map, reasons, scope boundaries, traceability and subsequent draft/write gates in the proposal. No Linear mutations, survivor IDs or closure decisions, tests, production edits, glossary or ADR. Planning pull passed; synchronize only proposal and memory, preserving unrelated working files. Await user acceptance of grouping before drafting consolidated descriptions.
### 2026-11-09 — Consolidated Flow QA review drafts prepared

- User accepted the 16-group QA plan plus three new scopes and requested complete drafts before any Linear change. Prepared drafts/flow-qa-consolidated/: 19 full descriptions, review/coverage/consumer map, exact current metadata and proposed survivor metadata, plus a combined reading copy.
- Fresh full reads FRO-373–395 and board labels/statuses; live production main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Original finding identifiers and acceptance sections retained under workflow subsections; obsolete internal separation wording reconciled. No Linear mutations or production writes.
- Proposed survivors: 378 absorbs379/380;381 absorbs382;384 absorbs385;389 absorbs390;391 absorbs392;393 absorbs394. Seven Duplicate retirements remain unapproved. Other QA IDs retained. Exact labels/priority/relation proposals in review index/metadata.json; preserve history and re-read before future writes.
- Added accepted #4 to374, #8 to373, #9 to386, #10 to387. New drafts cover #1 unknown customs before admission, #6 successful initial automatic request, #2 Supplier Invoice list/menu. Existing navigation owners368/371/358/361 remain unchanged; #3 deferred; #5/#7 covered.
- User explicitly accepted gross weight from final shipping packages and retaining manual values with mandatory renewed review when goods/packing changes. No proportional guesses or duplicate package weights. Proposed packing text/recalculate control and Supplier Invoice list presentation remain review choices.
- Live factual trace: Supplier Invoice has paginated invoice-number search API and existing filters; list UI missing. Readiness current predicate checks scheduled record only; success requires same Order ASK_READINESS_DATE/SCHEDULED with delivery_status SENT (provider ACCEPTED, not recipient read). Invoice packing text/weight already included in review/freeze; gross/net was not specified until this user decision.
- Draft review only: design gates remain for new list/arrival-dialog/automatic-value presentation; unchanged QA presentation and width correction reuse existing designs. Upload cause and existing QA-OS-03/04 contract questions remain explicit. No glossary/ADR warranted. Planning pull succeeded; commit/push review package and memory only, preserving unrelated dirty files.
- 2026-11-09 — User explicitly instructed “Go ahead without reviewing”, approving execution of the completed consolidation package and waiving another draft-review round. Updated 16 retained Flow QA tickets using the exact prepared descriptions/metadata; created FRO-396 unknown customs regime until stock admission, FRO-397 manual readiness follow-up after automatic SENT, FRO-398 Supplier Invoice main-menu searchable list. Marked379/380→378,382→381,385→384,390→389,392→391,394→393 Duplicate without changing their original descriptions. Verified all26 touched issues by full reread:19 Backlog,7 Duplicate, correct targets, approved labels/priorities/relations, no attachments lost, no assignee/project/parent changes or blockers. Linear normalized links/number-list spacing and one issue mention only. Reciprocal398→378 relation expected. Execution evidence: drafts/flow-qa-consolidated/APPLIED.json; README marks proposal applied. Pull and production SHA check succeeded, no intervening issue changes. No production writes, previews or branches. Initial state+duplicateOf call rejected by Linear; duplicateOf alone safely created the relation and Duplicate state. Planning synchronization required for these records; preserve unrelated dirty files.
