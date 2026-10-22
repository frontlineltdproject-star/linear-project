# Linear — ticket creation and editing memory

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

## Maintaining this file

Keep durable ticket decisions, issue IDs, dependency ownership and unresolved questions. Date material changes, identify superseded rules, and distinguish ticket changes from unimplemented proposals. Fetch current design/attachment links from Linear when needed. Do not append deployment logs, credentials or lengthy preview test histories here.









