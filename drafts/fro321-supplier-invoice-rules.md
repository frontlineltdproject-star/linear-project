Defines the **Supplier Invoice**: one physical supplier invoice, its VAT treatment, linked Order, exemption progress and documents. One Order may have several Supplier Invoices; each invoice belongs to exactly one Order. **Order = purchase order = stock-list item; colli = handling unit.**

## Delivery and ownership

FRO-321 owns persistence, validation, authorized operations, relationships, invoice-owned events and attachment support. FRO-347 owns Create presentation, FRO-348 owns Details presentation, and FRO-349 owns the Create-from-Order entry point. Reuse those screens; no separate UI design or production branch is part of this specification.

| Delivery | Required outcome |
| -- | -- |
| **Initial invoice release — 0.0.6** | Basic creation, retrieval, correction, guarded cancellation and invoice-owned documents. Consume FRO-356's Order regime. New Υ.Δ. invoices start Not started. |
| **Export integration — with FRO-317** | Explicit Export membership, fiscal compatibility, protocol references and guarded dispatch/return/onward-sending events. FRO-317 currently targets 0.0.10; its implementation remains separately owned. |
| **Entry Note integration — with FRO-319** | Direct/inherited admission lookup and reverse invoice/report inputs. FRO-319 currently targets 0.0.11. |
| **Unavailable dependency** | Distinguish not-yet-available integration from loading, failure, denied access and confirmed absence. Do not fabricate records, return misleading empty results or allow actions whose guards cannot be checked. Missing/unavailable Entry Note does not block otherwise-valid basic capture. |

Existing historical previews/attachments are retained as reference material. Presentation follows the current FRO-347/FRO-348 contracts, aligned with the business rules below.

## Fields

**Supplier Invoice ID** is a server-generated positive integer: unique, immutable and ascending under concurrent creation. It is distinct from Invoice number and Stock ID and survives corrections and cancellation.

| Field | Type / format | Rule |
| -- | -- | -- |
| **Stock ID** | Required Order reference | One non-cancelled Order with Supplier, across lifecycle stages. Correctable subject to the saved-record guards below. |
| **Supplier** | Derived company reference | Current linked Order Supplier; no invoice override. |
| **Client** | Derived company reference | Current linked Order Client; no creation snapshot. Identifies the operational customer, not necessarily the invoice recipient. |
| **Invoicing company** | Derived optional company reference | Current linked Order Invoice company. Missing value permits basic invoice capture; remain blank without falling back to Client/Supplier. Export eligibility applies its own required fiscal-data checks. |
| **Invoice number** | Required String | Trim surrounding whitespace; reject blank. Preserve case, internal spaces, punctuation and leading zeros. |
| **Invoice date** | Required date | Cannot be later than today in Europe/Athens. |
| **Invoice expiration date** | Optional date | When applicable and supplied, cannot precede Invoice date. Inapplicable to storage invoices. |
| **Invoice type** | Required choice, conditionally derived | The three active types below. Order regime controls storage eligibility. |
| **Currency** | Required reference-data reference | One currency shared by net and VAT. Use existing currency reference data; EUR is not a restriction. |
| **Invoice net value / VAT value** | Required exact decimals | Each between 0 and 99,999,999,999,999,999.99 inclusive, with at most two decimal places. Blank is not zero. Type-dependent zero VAT applies. |
| **Invoice vessel** | Optional Vessel reference | When supplied, an authorized vessel associated with the linked Order's Client. No automatic copying or synchronization from Order, Shipment or Export vessel. |
| **VAT exemption status** | Not required / Not started / In progress / Exempted | Type determines applicability; recorded events determine saved Υ.Δ. progression. |
| **Stamping dispatch date** | Conditional date | Invoice-owned physical dispatch event, linked to its Export and actor/time audit. |
| **Stamping return date** | Conditional date | Invoice-owned physical return event; requires dispatch and cannot precede it. |
| **Stamped paperwork sent to recipient date** | Optional event date | Invoice-owned physical onward-sending event; requires recorded return and cannot precede it. No additional exemption status. |
| **Record cancellation** | Active / Cancelled | Independent of exemption progress; governed by cancellation rules below. |
| **Files** | Invoice-owned attachments | Scanned invoice and supporting documents, with separate authorized upload/download operations. |

Supplier, Client and Invoicing company remain derived from the Order, including on cancelled invoices. Cached values must stay consistent. Audit history can retain earlier values without becoming editable business fields.

Use exact decimal arithmetic and lossless request/response serialization. Reject negative, out-of-range or overprecision amounts; never clamp or silently round. Display monetary values with two decimals. Currency changes perform no conversion. These amounts do not aggregate from or synchronize with existing Order invoice rows or Order customs amounts.

## Order regime and invoice types

| Order / active type | Selection and treatment |
| -- | -- |
| **Τελωνειακή Αποθήκευση** | Automatically select and lock **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)**. VAT = 0; expiration blank/inapplicable; status Not required. A missing Entry Note does not change the type. |
| **Other regimes / Greece: No** | Staff select an applicable non-storage type. Storage type is unavailable. Do not invent an automatic mapping for Τελωνειακή Αποταμίευση. |
| **Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)** | Enter VAT; expiration optional; ordinary creation starts Not started. Zero VAT does not remove exemption applicability. |
| **Greek Supplier – Foreign Recipient (MRN)** | VAT = 0; expiration optional; status Not required. |
| **No Order / unresolved regime** | Do not guess a type. Retain the draft and distinguish loading/failure from a legitimate empty regime for Greece: No. |

Use the explicit regime from FRO-356, never warehouse name, ΚΤΑ, ΑΛΚ, VAT amount or note existence.

Selecting a zero-VAT type sets VAT to zero; storage also clears expiration. Switching away makes the applicable inputs available again without inventing previous values. Re-evaluate type, companies, vessel eligibility and note context when changing Order. Before discarding incompatible unsaved values, show the consequences and allow the operator to keep the prior selection. Preserve unrelated draft fields/files. Discard stale responses for a previously selected Order.

FRO-347/FRO-348 own the existing unavailable-storage-option presentation: visible but non-selectable, with hover/keyboard-focus reason, no persistent helper or extra Order link; click/Enter/Space cannot change the selection. These controls consume server eligibility, not an invoice-side regime override.

The historical **Foreign Supplier – Greek Recipient** type is unavailable for new selection. Any retained real historical records remain readable with their original type/data; no automatic conversion is authorized.

Invoice format, VAT Exception required?, goods description/HS code and entry MRN/date are not invoice-owned fields. Entry Note owns its goods classification and entry customs facts.

## Creation, correction and consistency

| Operation | Required behavior |
| -- | -- |
| **Create** | Validate the complete invoice and current Order/regime/company context server-side. Start active Υ.Δ. at Not started with all three event dates blank; start other active types at Not required. Reject advanced initial statuses or supplied event dates through ordinary creation. |
| **Duplicate check** | Reject the same Supplier plus the same case-sensitive normalized Invoice number, including cancelled invoices and excluding the edited invoice itself. Different Suppliers may use the same number. Client, Order and invoice year do not form part of this key. Identify the conflicting invoice only within authorized access. |
| **Correct invoice Order** | Use ordinary invoice Edit/Save. Validate the resulting type, companies, vessel, duplicate key, Entry Note and Export relationships. Save the compatible correction atomically, preserving invoice ID and auditing old/new Order and actor/time. Never silently reassign Export membership or rewrite recorded events. |
| **Correct invoice type or facts** | Enforce resulting type/value/date rules and linked-document consistency. Reject changes incompatible with saved Export membership or recorded stamping/sending history. Switching an eligible, unprogressed invoice into Υ.Δ. starts Not started; switching out derives Not required. Recorded history is never cleared to permit an ordinary change. |
| **Correct companies on Order** | Use existing authorized Order operations. FRO-303 owns later-stage Invoice company correction. Do not introduce a general Client correction or unlock other protected Order fields. Every supported company change must validate all linked invoices, including cancelled ones, duplicates, vessel compatibility and affected Entry Note/Export relationships. Reject the whole change on conflict. Supplier cannot be cleared while invoices are linked. |
| **Regime/Greece correction** | Consume FRO-356's permitted correction scope. Reject incompatible saved invoice type or admission/Export/event relationships; no silent conversion or bulk reconciliation. |
| **Read / navigate** | Never write dates, change status, reassign relationships, convert types or create missing records. |

Historical advanced-status entry, backward movement and correction of protected dates/events require a separately specified audited reconciliation flow. This ticket provides no unrestricted override or ordinary historical-entry path.

Recheck permissions, lifecycle, source relationships and duplicate constraints inside the save transaction. Invoice edits must carry a server-verifiable precondition for the state the operator read; a freshly loaded server version alone does not detect a stale draft. Reject stale/conflicting saves without overwriting newer data, retain the draft and require refresh/review.

Create, correction and event operations must prevent duplicate application under retries/concurrency. If a response is lost, resolve the original attempt's saved outcome before another creation; do not interpret transport failure as proof that no invoice exists. Reject changed or incompatible retries rather than silently applying a different payload. Successful changes and their actor/time audit commit together; failed operations leave no partial entity/relationship/event changes.

## Cancellation and Order protection

Ordinary cancellation is permitted only for an **active invoice with no Export assignment and no recorded dispatch, return or onward-sending events**. Recheck these conditions and authorization at confirmation time, including concurrent Export assignment or event recording.

Preserve invoice ID, normalized duplicate key, linked Order, files, values and audit history. Record cancellation and authenticated actor/time atomically. Cancellation does not mean goods delivery, customs completion or VAT exemption. No ordinary hard deletion or reactivation is available.

Block Order cancellation while active Supplier Invoices remain linked. Staff must explicitly cancel eligible invoices or validly reassign them first. Never cascade cancellation or move invoices automatically. Cancelled invoices may retain their historical link to a cancelled Order; do not reject reads because that Order is no longer selectable for new invoices. Protected cases require the separate reconciliation flow.

FRO-318 derives invoice presence from active invoices directly linked to each Order. Creation, cancellation and reassignment must make its source data current for both old and new Orders; cancelled invoices and parent/sibling invoices do not count for a child's direct presence.

## VAT exemption events — Export integration

Ordinary creation does not record historical exemption progress. Once the Export integration is available, saved Υ.Δ. invoices progress only through explicit confirmations.

| Current status | Confirmation | Required result |
| -- | -- | -- |
| **Not started** | Record dispatch for stamping | Require eligible explicit Export membership and positive IE599. Record dispatch date, Export association and actor/time; advance to In progress. |
| **In progress** | Record stamped papers returned | Require recorded dispatch on the same eligible Export. Record return date and actor/time; advance to Exempted. |
| **Exempted** | Record paperwork sent to recipient, when not already recorded | Require recorded return, same eligible Export and positive IE599. Record the separate sending date/event; remain Exempted. |
| **Not required** | None | No stamping/sending events for either active non-Υ.Δ. type. |

All confirmations require an authorized, active qualifying invoice, the correct current stage, valid association and applicable positive-IE599 guards. Positive IE599 alone never advances invoice status. Generation/printing/uploading documents does not confirm an event.

All physical-event dates must be no later than today in Europe/Athens. Dispatch must be on/after Invoice date; return on/after dispatch; onward sending on/after return. Positive IE599 must be recorded when the confirmation is submitted; its recording/confirmation date is not automatically a lower bound for the physical dispatch date.

Persist each event, date, Export association, resulting status and authenticated actor/recording timestamp atomically. Physical dates and recording timestamps are distinct. Reject missing/invalid dates, wrong type/stage, cancelled invoices, wrong Export, stale state, duplicate confirmation and ordinary overwrite/clearing of a recorded date. Failure preserves saved facts and entered values for correction; opening or cancelling a confirmation records nothing.

Invoice actions and FRO-317/FRO-352 Export bulk actions use the **same invoice-owned events**. Apply a common date only to eligible selected invoices satisfying each invoice's date ordering. Preserve rejected and unselected invoices; report actual per-invoice outcomes. Keep selection separate from Export membership. Retry/concurrency must not repeat successful events. Do not maintain a second Export-owned stamping status or onward-sending date.

Onward sending records sending the stamped papers to the recipient, not verified recipient receipt or physical goods delivery. Exempted remains the final exemption status.

FRO-348 owns the saved VAT exemption section, dates/progress and confirmation controls; non-Υ.Δ. records show only Not required. FRO-347's ordinary creation controls consume the fixed initial statuses and blank event dates above. No duplicate status field or new UI is introduced here.

## Relationships and downstream consumers

| Consumer / source owner | Contract |
| -- | -- |
| **Order** | Supplier Invoice stores the actual Order reference; reverse queries use that relationship. Order edits/splits never automatically move or duplicate invoices. |
| **Split lineage** | Preserve invoice ownership through both manual and Shipment-driven splits. Direct children derive from Order lineage; no editable child links. Lineage alone establishes neither invoice presence nor Export/Shipment participation. |
| **Entry Note — FRO-319** | Resolve the linked Order's directly owned or inherited admission note. A qualifying post-admission child shares the original note; a pre-admission split or common root alone is insufficient. Do not copy note fields or store a separate editable invoice-to-note pointer. |
| **Entry Note reverse query** | Use the note's owning Order and matching storage invoices under FRO-319. Do not aggregate every descendant invoice or substitute a child's invoice set. Resolve their shared explicit Export; expose inconsistent/partial relationships according to the owner's contract rather than choosing an arbitrary MRN. |
| **Export — FRO-317** | Export owns explicit invoice selection, fiscal scope, MRN/date, positive IE599, protocol and optional Delivered vessel. Resolve invoice membership through that selection; do not derive it from lineage or copy a second independently maintained membership. |
| **Shipment** | Owns physical movement and transport references such as AWB. Invoice membership does not establish which collis travelled or were declared. Do not infer a unique physical Shipment from the invoice's Order. Invoice Details presentation remains Related Export under FRO-348. |
| **Order invoice rows/customs values** | Independent models. Preserve existing rows, amounts, editing/copy behavior and outputs; do not populate Supplier Invoices from them or synchronize amounts automatically. |
| **Register/report — FRO-319** | Supplies matching invoice numbers, net values and currencies for the Entry Note register. FRO-319 owns active-case selection, statistical VAT, currency aggregation and report rules. FRO-248 is historical reference only. |

An Entry Note may precede or follow its invoices. Once its integration is available, late creation or an authorized ownership/coverage correction must refresh subsequent reads and affected open views without invoice resave. Keep denied/error/conflicting lookup distinct from confirmed absence; preserve drafts and ignore stale lookup results. Do not introduce note cancellation/replacement operations that FRO-319 defers.

For split shipments, an invoice remains selected once in its chosen Export even when goods travel in separate Shipments. Preserve FRO-317's explicit selection, ancestor-invoice suggestions and prior-assignment checks. Do not broaden the saved invoice scope from physical participation.

Protocol eligibility depends on selected Υ.Δ. type, regardless of VAT amount. A non-Υ.Δ. invoice remains Not required. FRO-317 owns protocol establishment/retention and fiscal compatibility; Supplier Invoice edits cannot bypass those rules.

## Authorization, files and retrieval

Enforce action authority and record access in every exposed adapter through shared server-side rules. Supplier Invoices and their files are staff-only; participant access to an Order must not grant partner access to invoice details, values, history or downloads. Apply the same boundary to reverse lookups, search, filters and related-record responses. Do not leak an inaccessible duplicate or relationship through validation messages.

Support authorized retrieval by immutable invoice ID, Order-to-invoice lookup, invoice search and filtering by type, all four exemption statuses and independent cancellation state. Screen columns/layout remain with the UI owners.

Extend attachment ownership to Supplier Invoice. Reuse shared file validation, storage and authorized download behavior, without attaching invoice files to an Order as a substitute. Files remain with the actual invoice after Order corrections and splits; no automatic Order-attachment inheritance applies.

FRO-347's selected-file contract accepts PDF/JPG/JPEG/PNG/WebP/GIF/DOC/DOCX/XLS/XLSX/CSV/TXT; files must be nonempty, filenames 1–255 characters and size within its 25 MB limit. Validate server-side as well as in the client. Preserve valid staged files alongside per-file errors.

| Save outcome | Required behavior |
| -- | -- |
| **Invoice rejected before persistence** | No invoice/events created; retain draft and staged files. |
| **Creation outcome unknown** | Resolve the original attempt before resubmission; retain draft/files and do not create another invoice speculatively. |
| **Invoice saved; uploads incomplete/failed** | Keep the invoice. Return its ID and per-file outcomes; retry failed uploads against that same owner without repeating creation or successful uploads. |
| **Saved Details** | FRO-348 displays authorized files/downloads; this specification does not add upload/removal controls to that screen. |

FRO-347 owns shared creation/recovery presentation; FRO-349 consumes it for Create-from-Order. Document uploads are separate from invoice creation and must not falsely report that a saved invoice was rolled back.

## Decisions and scope limits

| Decision | Reason |
| -- | -- |
| Ordinary Υ.Δ. creation starts Not started | Avoid an unusable requirement to join an already-completed Export during ordinary creation. Historical entry needs a separately defined audited path. |
| Stage basic capture before Export/Entry Note integration | Keep 0.0.6 useful without inventing later features or weakening their guards. |
| New records and fixtures only | Real legacy imports, status/date backfills, spreadsheet retirement and provenance reconciliation are separate work. Preserve real historical data. |
| Guarded cancellation; no ordinary deletion/reactivation | Preserve fiscal relationships, recorded events and duplicate protection. |
| Required invoice date, optional Client-associated vessel | Capture invoice identity while allowing invoices without a named vessel. |
| Exact nonnegative two-decimal money | Avoid precision loss, implicit conversion and credit-note behavior not specified here. |
| Trimmed, case-sensitive Supplier/number uniqueness | Remove accidental outer whitespace while preserving the agreed exact-number distinction. |
| Guard source corrections and reject stale writes | Keep companies, invoice eligibility and saved documents consistent without reopening protected Order fields. |
| Separate creation and upload outcomes | Recover partial failures without duplicate invoices or loss of staged documents. |

Update fixtures/seeds for the new model. Do not import or convert real legacy records, fan a former Export date out across invoices, or derive physical dates from status. Unknown historical facts remain unknown. Retain protected historical fourth-type data where present; it is not a new selectable type.

Out of scope: new UI/design/preview, production branch, Export/Entry Note implementation, register/print templates, real-data migration, credit notes, exchange conversion, general Client correction, unrestricted company/header editing, audited historical reconciliation, recipient-receipt verification, and ordinary invoice deletion/reactivation.

## Acceptance criteria

1. Valid ordinary creation produces one immutable invoice ID, normalized number and correct initial type/status, with no event dates. Missing required fields, advanced initial status/event dates, invalid currency/vessel, future invoice date or invalid expiration fail without partial creation.
2. Net/VAT values round-trip exactly through supported interfaces, including zero and the agreed upper boundary. Negative, excessive-precision and overflowing amounts fail without rounding; zero-VAT/storage rules are enforced.
3. Duplicate checking is case-sensitive after outer trimming and includes cancelled invoices. Concurrent creation, supplier corrections and retries cannot create duplicate keys or duplicate invoice/event application.
4. Regime/type derivation works before a note exists. Changing Order validates the resulting companies/vessel/type and preserves unrelated draft/files. Missing, unavailable, denied, failed and stale lookups remain distinct.
5. Compatible saved corrections preserve ID and audit old/new facts. Conflicts with Export/admission/events, invalid company changes and stale drafts reject atomically; FRO-303/FRO-356 boundaries remain intact.
6. Cancellation succeeds only for eligible unassigned, unprogressed invoices, preserving files/history/duplicate reservation. Order cancellation is blocked by active linked invoices. No cascade, ordinary deletion or reactivation occurs.
7. FRO-318's direct active-invoice source updates after creation/cancellation/reassignment. Splits do not move/copy Supplier Invoices or confer direct invoice presence on children.
8. Once Export integration ships, dispatch → return → onward sending obeys stage, same-Export, positive-IE599, date and access rules. Each event/status/audit is atomic; Exempted remains unchanged after onward sending. Individual and bulk actions share facts and preserve rejected/unselected invoices.
9. Once Entry Note integration ships, direct/inherited lookup and reverse scope follow admission coverage without copies or resaves. Late creation/authorized corrections refresh references; conflicting Export relationships never produce an arbitrary MRN.
10. Invoice fields/history/files are staff-only across direct and indirect readers. Partner Order access cannot expose them. Existing Order rows, customs values, split behavior and unrelated outputs remain unchanged.
11. Creation rejection, unknown response and saved-invoice/upload failure produce distinct outcomes. Recovery resolves the original attempt and retries files on the same invoice without repeating successful work.
12. Test both delivery stages with fixtures. No real legacy import/cleanup is required; real historical data is not deleted or converted. Linked UI contracts must consume these rules before their affected behavior is released.

## Context for agents

Live production repository reviewed through authenticated gh at **3820e89e8caa341261e2d48bcb282d93e1bb1d03**, confirmed 23 October 2026. This is source evidence, not confirmation of deployed functionality.

Paths below are relative to Frontline-Forwarding/frontline-forwarding; Java paths are under frontline-forwarding-app/src/main/java/com/frontline/forwarding/.

| Source | Implementation context |
| -- | -- |
| docs/reference/database.md | Order company references exist; Supplier Invoice, Export and Entry Note are not implemented entities at this baseline. Existing Order invoice rows are separate. Attachment owner constraint currently supports Order/Shipment. |
| web/purchaseorders/service/PurchaseOrdersApiService.java | Header edits stop at PENDING / EXPECTED_READINESS / READY / IN_STOCK. Existing server locking/version checks do not establish stale-browser protection. |
| web/purchaseorders/service/PurchaseOrderRequestValidator.java | Update preserves Client/Vessel; Invoice company is optional and validated against Client/Vessel assignment. New invoice monetary limits are an approved contract, not inherited automatically from Order customs money. |
| domain/purchaseorders/PurchaseOrderInvoiceRowRepository.java | Existing rows copy during splitting. Preserve them independently of invoice ownership. |
| web/shipments/service/ShipmentsApiService.java | Shipment-driven child creation is another split path to preserve. |
| domain/purchaseorders/PurchaseOrderAuthorizationService.java; docs/architecture/authorization.md | Participant-scoped Order reads exist; new staff-only invoice access must not inherit them. REST/GraphQL/MCP enforce common service rules. |
| web/attachments/service/AttachmentsApiService.java; docs/workflows/attachments.md | Upload is a separate operation against an existing owner. Existing Order split inheritance must not be applied automatically to Supplier Invoice files. |
| frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx | Currency choices use reference data; preview EUR is not a restriction. |
| docs/reference/graphql-api.md; docs/reference/rest-api.md; docs/reference/mcp-tools.md | Define and regenerate supported Supplier Invoice contracts during implementation; do not invent existing endpoints or permission names. |

FRO-321 supplies the backend contract consumed by FRO-347/FRO-348/FRO-349. FRO-356 supplies regime rules; FRO-303 supplies its scoped later Invoice company correction. FRO-317 and FRO-319 own their later integration behavior. Their UI and entity contracts must be reconciled to these agreed initial-status, Not required and ownership rules before integration release.

## Post-deployment verification

Use authorized read-only inspection and controlled-environment mutation-test evidence. Never create, edit, cancel or confirm production records merely to verify this ticket.

| Acceptance coverage | Read-only verification |
| -- | -- |
| 1–3: fields, amounts, duplicates | Read seeded invoices and validation/concurrency results. Compare exact monetary strings/decimals, normalization, immutable IDs, type/status/date combinations and duplicate rejection, including cancelled records. |
| 4–5: source lookup and corrections | Compare invoice/Order read results with saved audit and rejection fixtures. Inspect missing/unavailable/error states and stale-save tests; verify compatible correction and unchanged results after rejected changes. |
| 6–7: cancellation and splits | Read active/cancelled invoice fixtures, Order cancellation test outcomes and both split paths. Confirm retained history/files, direct presence, actual ownership and unchanged parent/child data. |
| 8: Export events | When integration is released, read saved invoice/Export event histories and compare individual/bulk outcomes. Review tests for date boundaries, IE599, same-Export, partial outcomes, retries and denied/stale attempts. |
| 9: Entry Notes | When integration is released, compare directly owned/covered-child references to the same original note and its authorized invoice/Export scope. Review late-creation/refresh and conflict fixtures without resaving invoices. |
| 10: access and preservation | Review authorized/denied response and download tests, including partner Order readers and reverse lookups. Compare existing Order rows/customs values/split outputs with baseline expectations. |
| 11: recovery | Inspect rejected, unknown-outcome and upload-failure test results. Read the resulting invoice and attachment IDs to confirm one invoice, retained successful files and no repeated events/uploads. |
| 12: rollout and presentation | Inspect fixture readiness and deployed contract availability; verify later integrations are identified as unavailable before release. Review FRO-347/FRO-348/FRO-349 alignment and EN/EL failure/eligibility messages without production writes. |

**Reference:** FRO-347 / FRO-348 / FRO-349; FRO-356; FRO-303; FRO-318; FRO-317; FRO-319; [reviewed production source](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/3820e89e8caa341261e2d48bcb282d93e1bb1d03). FRO-241 and FRO-248 remain historical references.
