# Linear — ticket creation and editing memory

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
