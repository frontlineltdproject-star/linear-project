Defines the **Export Customs Declaration (Export)**: one export customs declaration under a physical **Shipment**, with its own **MRN**, explicitly selected **Supplier Invoices**, **Customs status** and conditional **VAT Exemption Procedure**. Connected Orders are derived from the selected invoices; collis stay reachable through those Orders. A Shipment can have several Exports. Customs completion and invoice VAT exemption are separate workflows.

This ticket owns the entity, its relationships, validation, authorized operations, lifecycle, protocol allocation and audit. Presentation belongs to FRO-350 (creation page) and FRO-352 (details page). **Order = purchase order = stock-list item; colli = handling unit.** Supplier Invoice (FRO-321) is the current name of the former VAT item / VAT Exclude Item.

## Fields

Each Export has an **Export ID**: a server-generated positive integer, unique, immutable and ascending under concurrent creation. It is distinct from the MRN and the protocol number.

| Field | Type / format | Rule |
| -- | -- | -- |
| **Shipment** | Required Shipment reference | Parent physical movement. Owns collis, packing, participating Orders and the transport document (AWB / CMR / B/L). Fixed after creation. |
| **Invoicing company** | Required Company reference | Fiscal recipient, taken from the Order's Invoicing company (`invoiceCompanyId`), never from its Client. Fixed after creation. |
| **Supplier** | Company reference — required for Foreign invoicing company Exports | Grouping Supplier for the foreign procedure; blank for Greek invoicing company Exports. Fixed after creation. |
| **Export type** | Derived — **Greek invoicing company** / **Foreign invoicing company** | From the Invoicing company's `taxRegistration` (GREEK / FOREIGN). Read-only; never independently supplied or edited. |
| **Shipper (Αποστολέας)** | Derived Company reference | Invoicing company for a Greek invoicing company Export; Supplier for a Foreign invoicing company Export. Read-only. |
| **Shipper ΑΦΜ** | Derived String | `vatNumber` of the Shipper Company. Read-only; never filled from the foreign recipient's identifier. |
| **MRN** | Required String — 18 characters | Trim surrounding whitespace and store in upper case. Exactly 18 letters or digits. Unique across all Exports, including cancelled ones. |
| **MRN date** | Required date | No later than today in Europe/Athens. |
| **Delivered vessel** | Optional Vessel reference (single) | Any existing Vessel record. Export-owned: no inheritance, fallback or synchronization with Shipment, Order or Supplier Invoice vessels. |
| **Selected invoices (Informative List)** | Supplier Invoice references | The Export's saved invoice scope. Each invoice can belong to only one non-cancelled Export. |
| **Connected Orders** | Derived list of Order references | The actual Orders referenced by the selected invoices, each shown once. No separate saved Order or colli selection. |
| **Customs status** | Derived — **Awaiting EAD** / **Awaiting IE599** / **Completed** | Advances only through the confirmation events below. |
| **EAD receipt confirmation date** | date | Recorded by the EAD confirmation event, with actor and recording time. Distinct from MRN date and not earlier than it. |
| **Positive IE599 confirmation date** | date | Recorded by the positive-IE599 confirmation event, with actor and recording time. Not earlier than the EAD receipt confirmation date. |
| **Protocol number / date** | System-assigned unique ascending number / date (Europe/Athens) | Allocated only when a VAT Exemption Procedure is first required. Read-only. |
| **Record cancellation** | **Active** / **Cancelled**, with reason, actor and time | Independent of Customs status. See Cancellation. |
| **Files** | Export-owned attachments | Export documents (EAD, IE599, stamped ΥΔ and others). Optional; never confirm a customs or VAT event by themselves. |

**Delivered vessel**, **MRN / MRN date** and the selected invoices are Export-owned. The Supplier Invoice owns its invoice facts, type, Order, VAT exemption status and stamping/sending events (FRO-321); it holds no copies of MRN, transport document or protocol data.

## Fiscal scope and grouping

**Client** is the Order's operational customer (`clientCompanyId`); **Invoicing company** is the company invoiced (`invoiceCompanyId`). They may differ. Grouping, classification, recipient checks and Shipper always use the Invoicing company; Client is never a substitute.

**Grouping key:** Company records.

| Export type | Condition | One Export per |
| -- | -- | -- |
| **Greek invoicing company** | Invoicing company `taxRegistration = GREEK` | Shipment + Invoicing company |
| **Foreign invoicing company** | Invoicing company `taxRegistration = FOREIGN` and Supplier `taxRegistration = GREEK` | Shipment + Invoicing company + Supplier |
| **Mixed Shipment** | Both kinds present | Each group independently; never a third Mixed type |

* GREEK `vatNumber` is unique in the database, so one GREEK Company record equals one ΑΦΜ. Different Clients with the same Invoicing company share a group; the same Client with different Invoicing companies produces separate groups.
* Foreign groups keep the recipient–Supplier pair: different Suppliers produce separate groups, and different foreign recipients never merge because they share a Supplier.
* The Supplier is the Order's Supplier (FRO-321 derives the invoice Supplier from its Order).

**Blocking data problems:** preparation of the affected group stops with an actionable message naming the Order/Company when:

* the Order has no Invoicing company, or the Invoicing company or (foreign procedure) Supplier has no `vatNumber`;
* the Order has no Supplier in the foreign procedure;
* a FOREIGN Invoicing company shares the same trimmed, case-insensitive `vatNumber` with another FOREIGN Company record (possible duplicate, needs review);
* the Invoicing company is FOREIGN and the Supplier is FOREIGN (no supported procedure).

Never fall back to Client, default a classification, or infer it from country, address, VAT prefix or invoice type.

Saved Exports keep their Invoicing company and Supplier references. Later Company master-data changes never regroup, reclassify or reassign a saved Export.

## Invoice eligibility

An invoice may be selected only when all of these hold, rechecked on the server at every save:

* active (not cancelled) and not selected in another non-cancelled Export;
* its actual linked Order's Invoicing company is the Export's Invoicing company, and for Foreign invoicing company Exports that Order's Supplier is the Export's Supplier;
* its invoice type is allowed for the Export type:

| Invoice type (FRO-321) | Greek invoicing company | Foreign invoicing company |
| -- | -- | -- |
| **Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)** | Allowed | Not allowed |
| **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)** | Allowed | Allowed |
| **Greek Supplier – Foreign Recipient (MRN)** | Not allowed | Allowed |
| Historical **Foreign Supplier – Greek Recipient** | Not allowed | Not allowed |

* **Entry Note shared Export (FRO-319):** all Αποθήκη Αποθήκευσης invoices resolved by one Entry Note must be in the same Export. Reject a selection that would place them in different Exports.

A not-allowed invoice is shown with its reason and cannot be selected; it never changes the Export type. A different operational Client alone does not exclude an otherwise eligible invoice.

An eligible invoice whose Order has no collis in this Shipment may be selected as **paperwork only**: it adds its Order to Connected Orders but adds no physical Order or colli to the Shipment.

A later Shipment may carry remainder collis while the original invoice stays on an earlier Export; the invoice is never selected twice. Seeing an invoice or its Order in an Export does not mean its collis travelled in that Shipment or were declared individually under that MRN. Connected Orders never expand to every Shipment Order or to parent/child siblings.

## Shipment and creation

**Eligible Shipments:** any Shipment status except **CANCELLED**, any purpose. While a Shipment has a non-cancelled Export, Shipment cancellation is rejected with a message naming the Export(s).

**Shipment retrieval:** find authorized Shipments by Shipment ID or transport document number (AWB / CMR / B/L), case-insensitive partial matching. Document type/number stay Shipment-owned and read-only on the Export.

**Candidates:** selecting a Shipment groups its participating Orders (non-cancelled participations) by the grouping key and returns one candidate per group with suggested invoices. Candidates and suggestions are not saved records. A group that already has a non-cancelled Export returns that Export for opening instead of a new candidate. Shipment creation never creates Exports.

| Export type | Creation requires |
| -- | -- |
| **Greek invoicing company** | At least one selected eligible invoice. Some physical Orders may remain uninvoiced. |
| **Foreign invoicing company** | Participating physical collis for the group. Selected invoices are optional; the Informative List may be empty. |

Both **Create Export** entry points — from the Exports list (user selects a Shipment) and from a Shipment (Shipment preselected) — use these rules. Creating one Export leaves other Exports and the Shipment unchanged.

**One non-cancelled Export per group.** Repeated or concurrent creation for the same group returns the existing Export; it never creates a duplicate.

### Suggested invoice lookup

For each Order participating in the selected Shipment:

1. Retrieve invoices linked directly to that Order.
2. Follow its direct-parent chain to the root and retrieve invoices linked to each ancestor.
3. Deduplicate by Supplier Invoice ID, keeping every participating-Order / source-Order path.
4. Apply authorization and the eligibility rules above. Ineligible invoices are not selectable; invoices already in another Export show that Export's reference.

Do not traverse sibling branches or other descendants of the root. Use the Supplier Invoice's Order reference (FRO-321); the Order → invoices lookup is its reverse query, not a second stored list. Suggestions require operator review and do not prove that an ancestor invoice covers the shipped child's goods. For each suggestion return its actual linked Order, whether it is direct or ancestor-linked, and the participating Order(s) through which it was found.

Selecting an ancestor-linked invoice does not reassign it, add another Order reference or change Shipment participation. Connected Orders show the invoice's actual Order; the participating split child remains physical context only.

**Example:** Order 1 has Invoice A; child 1.1 has Invoice B; grandchild 1.1.1 participates in the Shipment; sibling 1.2 has Invoice C. Suggest eligible invoices on 1.1.1 plus A and B. Do not suggest C. Selecting A keeps its reference to Order 1.

The operator's final selection may differ from the suggestions, subject to eligibility. Operators can also add any eligible invoice found by searching invoice number, Supplier or Order.

## Customs lifecycle

| Customs status | EAD receipt confirmation date | Positive IE599 confirmation date | Next event |
| -- | -- | -- | -- |
| **Awaiting EAD** | Blank | Blank | **Confirm EAD receipt** → Awaiting IE599 |
| **Awaiting IE599** | Recorded | Blank | **Confirm positive IE599** → Completed |
| **Completed** | Recorded | Recorded | None |

* **Confirm EAD receipt:** the staff member enters the EAD receipt confirmation date and submits. Reject a date earlier than the MRN date. Record the date, authenticated actor and recording time atomically with the transition.
* **Confirm positive IE599:** only from Awaiting IE599. The staff member enters the Positive IE599 confirmation date and submits, which explicitly confirms a positive / confirmed-exit result. Reject a date earlier than the EAD receipt confirmation date. A non-positive or unverified IE599 cannot use this action.
* Neither event requires a reference field, checkbox or attachment.
* **Initial status at creation:** **Awaiting EAD** (default; both dates blank) or **Awaiting IE599** (EAD receipt confirmation date required, not earlier than the MRN date). Creating at Awaiting IE599 is one create-and-confirm operation that records the EAD event. Creation at Completed is rejected. Creation, initial state, EAD event and conditional protocol allocation commit together; a failed save records nothing.
* Reject missing dates, skipped or reversed transitions, duplicate confirmations and stale concurrent updates. Opening or cancelling a confirmation records nothing. Ordinary editing never changes status or confirmed dates.
* Customs transitions never change invoice VAT exemption status.

## Saved-Export editing

| Information / operation | Awaiting EAD | Awaiting IE599 | Completed |
| -- | -- | -- | -- |
| **Shipment, Invoicing company, Supplier, Export type, Shipper, Shipper ΑΦΜ** | Fixed | Fixed | Fixed |
| **MRN / MRN date** | Editable, with the same validation | Locked | Locked |
| **Delivered vessel** | Set / change / clear | Locked | Locked |
| **Selected invoices** | Add and remove; Greek Exports keep at least one | Add only | Add only |
| **Connected Orders** | Derived | Derived | Derived |
| **Customs status / confirmed dates** | Confirmation events only | Confirmation events only | No change |
| **Protocol number / date** | System-assigned | System-assigned | System-assigned |
| **Files** | Upload, download, remove | Upload, download; no removal | Upload, download; no removal |
| **Cancellation** | Allowed (see below) | Not available | Not available |

* Every save rechecks current Customs status, permissions, eligibility, uniqueness and concurrency on the server. Edits carry a precondition for the state the operator read; reject stale edits, keep the draft and ask the operator to refresh. Save only the fields owned by that edit and audit actor, time and before/after values.
* Cancelled, failed and no-op saves change nothing, including lifecycle and protocol.
* A successful invoice change updates the Informative List, Connected Orders and VAT procedure eligibility, and allocates a protocol if the change first makes the procedure required.
* An invoice added at Completed starts from its own current VAT exemption stage; because positive IE599 is already recorded, eligible Υ.Δ. invoices can then be sent for stamping.
* There is no ordinary change of Shipment or fiscal scope. Locked changes are not exposed through an override.
* Shipment changes never add or remove selected invoices.

## Cancellation

* Available only for an **active Export at Awaiting EAD** with no recorded customs events, for Frontline managers and system administrators.
* Requires a non-blank reason (Free text, up to 1,000 characters). Record reason, actor and time atomically with the cancellation; reject stale attempts.
* Effects: the Export becomes **Cancelled** and read-only. Its selected invoices become available for other Exports; the cancelled Export keeps its selection as read-only history. The group may get a new Export. The MRN stays reserved. An allocated protocol number stays with the cancelled Export and is never reused. Files are kept.
* There is no reactivation or hard deletion. Corrections after EAD confirmation (removing invoices, changing MRN, Delivered vessel or confirmed dates, cancelling later) need a separately specified audited correction procedure.
* Cancelled Exports remain readable from their Shipment and invoices, marked Cancelled.

## VAT Exemption Procedure

**Required** when at least one selected invoice has type **Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)**; otherwise **Not required**. Never derive it from VAT amount or labels. Other types have VAT exemption status **Not required** (FRO-321) and never enter stamping actions.

### Protocol

* Allocate only when a required procedure is first established: within a successful creation, or within the successful invoice save that first makes it required. Recompute eligibility on the server from the final saved selection.
* Assign the next number from one global ascending sequence and the allocation date in Europe/Athens.
* Retries and concurrency never allocate twice. Preparation, suggestions, UI selection changes and failed saves consume no number.
* Keep an allocated protocol and its history if eligibility later lapses; reuse it if the procedure becomes required again. Never reuse a number after cancellation.
* The sequence starts at a value the business supplies before release. No legacy protocol import or reconciliation.
* Preparation displays are provisional; nothing is reserved before a successful save.

### ΥΔ documents

* Generate from an explicit selection of saved selected Υ.Δ. invoices. This selection is separate from Export membership and from stamping selections.
* Within the Export, group by **Invoicing company + Supplier**, at most **five invoices per document**; create more documents as needed. Never combine Exports.
* Available at Awaiting EAD, Awaiting IE599 and Completed. Each generation is a snapshot of current saved data; regenerating is allowed.
* Templates: the three supplied ΥΔ files attached to FRO-241 — **Αερολιμένας Ελ. Βενιζέλος**, **Α΄ Τελωνείο Πειραιά**, **Γ΄ Τελωνείο Πειραιά**. Reuse their existing filling, including blank and fixed fields; print the protocol number/date in the existing protocol position. No new representative profiles or form redesign.
* Generating or printing never records dispatch, return or onward sending, and never changes invoice status, Customs status, protocol or membership. Uploading a stamped ΥΔ is optional.

### Stamping and onward sending — invoice-owned events

The Export provides bulk shortcuts over FRO-321's invoice-owned events; it has no Export stamping status or Export-level sending date.

| Invoice stage | Status | Bulk action |
| -- | -- | -- |
| Ready to send for stamping | Not started | **Record dispatch for stamping** — one dispatch date for the selected invoices → In progress |
| Awaiting stamped return | In progress with recorded dispatch | **Record stamped return** — one return date, not earlier than any selected invoice's dispatch → Exempted |
| Returned stamped | Exempted | **Record paperwork sent to recipient** — one sending date, not earlier than any selected invoice's return; only invoices without a recorded sending date. Status stays Exempted |

* Available only after Customs status is Completed with positive IE599, for authorized staff and selected Υ.Δ. invoices of this Export.
* Each action has its own selection with **Select all eligible** and **Clear selection**; selection is not Informative List membership and records nothing until confirmed.
* Apply each invoice's FRO-321 guards: stage, same Export, date ordering, dates not later than Athens today, actor/time audit, no duplicate events. Report per-invoice outcomes; rejected and unselected invoices are unchanged. A failed confirmation keeps the operator's selection and date.
* No Not started → Exempted shortcut; existing dates cannot be overwritten or cleared through ordinary actions.

## Access, retrieval and files

* New Export authorities for view, create, edit/confirm and cancel, following the existing `SHIPMENT_*` pattern. Exact authority names are an implementation contract.
* Frontline operators and managers may view, create, edit and confirm EAD / positive IE599 and stamping events. Cancellation: Frontline managers and system administrators. Partner users (client, supplier, agent) have no access, including through Order, Shipment or invoice reverse lookups, search, validation messages or downloads.
* Retrieval: by Export ID; by MRN; by Shipment; by Supplier Invoice (its Export, for FRO-348's Related Export); filter by Customs status, Export type and cancellation state.
* Files: extend attachment ownership to Export and reuse the shared validation, storage and authorized download (FRO-347 rules: PDF/JPG/JPEG/PNG/WebP/GIF/DOC/DOCX/XLS/XLSX/CSV/TXT, nonempty, filename 1–255 characters, up to 25 MB). Never attach Export files to the Shipment or an Order as a substitute.

## Data scope

New records and test fixtures only. No import or conversion of legacy declarations, protocol books or per-invoice dates. The retired Order `mrn` field (FRO-329) is not reused or copied; Export MRN is the declaration's MRN. Update fixtures/seeds for the new model.

## Decisions

| Decision | Reason |
| -- | -- |
| Group by Company record; GREEK ΑΦΜ is unique in the database | Gives a stable, verifiable key; duplicate foreign VAT numbers are flagged rather than silently merged. |
| Foreign procedure requires a GREEK Supplier; foreign + foreign blocks | No supported procedure exists for a foreign supplier selling to a foreign recipient. |
| Invoice type matrix per Export type | Prevents silent misclassification; the Export type follows the recipient, never the invoice. |
| Any non-cancelled Shipment; block Shipment cancellation while an Export exists | Declarations are often lodged before departure; an Export must not lose its parent. |
| Cancellation only at Awaiting EAD, managers and system admins | Fixes wrongly created Exports and releases their invoices, without touching confirmed customs history. |
| Additions allowed at Completed, removals not | Late invoices can still be stamped; confirmed declarations keep their history. |
| Any Vessel as Delivered vessel | One group can span several Clients. |
| MRN 18 alphanumeric, unique including cancelled; MRN date not in the future | Customs MRNs are unique; a reserved MRN cannot be reused by mistake. |
| Server integer Export ID | Same pattern as Supplier Invoice; separate from MRN and protocol. |
| New records only; starting protocol number supplied before release | Matches FRO-321's rollout; legacy reconciliation is separate work. |

## Out of scope

Page layouts (FRO-350 / FRO-352); the Exports list page and the **Create Export** action on Shipment Details (no current owner; follow-up UI tickets); Informative List, Proof of delivery and Pending invoices prints (follow-up); audited correction after EAD confirmation, later-stage cancellation, reactivation and deletion; physical repacking; ICIS submission/integration; Outlook/AI extraction; redesign of customs templates; legacy data import.

## Acceptance criteria

 1. One GREEK Invoicing company with three Orders/invoices produces one Export; two GREEK Invoicing companies produce two Exports on the same Shipment.
 2. One FOREIGN Invoicing company with three physical Orders and two GREEK Suppliers produces two candidates, including an uninvoiced Order; each saved Export's Connected Orders come only from its selected invoices.
 3. A Mixed Shipment (one Greek Order plus scenario 2) produces three independent Exports across four Orders; no Mixed type exists.
 4. Different Clients with the same Invoicing company share a group; the same Client with different Invoicing companies does not. Distinct foreign recipients sharing a Supplier stay separate.
 5. Missing Invoicing company / ΑΦΜ / Supplier, a duplicate FOREIGN VAT number, or FOREIGN Invoicing company + FOREIGN Supplier block the affected group with an actionable message and no fallback.
 6. The invoice type matrix is enforced on create and every save; a not-allowed invoice cannot be selected and the Export type never changes. Storage invoices of one Entry Note cannot be split across Exports.
 7. Export type, Shipper and Shipper ΑΦΜ are derived, read-only and consistent with the saved scope on creation and reopening.
 8. Repeat or concurrent creation for a group returns the existing non-cancelled Export.
 9. Split-child suggestions: Order 1.1.1 in the Shipment finds direct invoices and invoices on 1.1 and 1, not on sibling 1.2; results are deduplicated with source paths. Selecting ancestor Invoice A keeps its Order 1 reference.
10. MRN validation: trimmed, upper case, 18 alphanumeric characters, unique including cancelled Exports; MRN date required and not in the future.
11. Customs: creation at Awaiting EAD (both dates blank) or Awaiting IE599 (EAD date required, event recorded); Completed rejected. EAD and positive IE599 events record date, actor and time atomically; EAD not before MRN date; positive IE599 not before EAD; invalid, duplicate and stale events rejected; Customs changes never change invoice status.
12. The editing matrix is enforced on the server, including Add-only at Awaiting IE599 and Completed, locked MRN/Delivered vessel after EAD, and stale-edit rejection with the draft kept.
13. Cancellation at Awaiting EAD by a manager records reason/actor/time, frees invoices and the group, keeps the MRN reserved and any protocol unreused; it is rejected for operators and at later stages. A Shipment with a non-cancelled Export cannot be cancelled.
14. Protocol: never-required Exports get none; the first required state at creation or on a later save allocates once with its Athens date; retries/failures do not allocate; lapsed eligibility keeps and later reuses the number.
15. ΥΔ generation groups by Invoicing company + Supplier, at most five invoices per document, at all three Customs stages, using the three supplied templates, without changing any status, membership or protocol.
16. Bulk dispatch, return and onward-sending actions follow FRO-321's guards, only after positive IE599, and report per-invoice outcomes; invoice-level and Export actions share the same facts.
17. Partner users cannot read Exports or their files through any path; authorized retrieval by ID, MRN, Shipment and invoice works.
18. Export files upload/download under permissions; removal only at Awaiting EAD; invalid files are rejected per file.

## Context for agents

Live production repository `Frontline-Forwarding/frontline-forwarding`, reviewed through authenticated `gh` at **main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a** on 26 October 2026. Export, Supplier Invoice and Entry Note are planned entities; none exists at this baseline. Java paths are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Implementation context |
| -- | -- |
| `docs/reference/database.md` — `company` | `tax_registration` GREEK/FOREIGN is required; `vat_number` is nullable (32 chars); unique index only for GREEK VAT numbers. No country column. |
| `web/companies/service/CompaniesApiService.java` | Invoice companies require fiscal details with a nonblank VAT number; GREEK ones also a tax office. Supplier fiscal details are optional, so validate Supplier ΑΦΜ in the foreign procedure. Existing records' data completeness is not proven by this check. |
| `domain/purchaseorders/PurchaseOrderParties.java`; `freight_purchase_order` | Distinct `client_company_id`, `invoice_company_id` (nullable), `supplier_company_id` (nullable). The `mrn` column is retired by FRO-329. |
| `freight_shipment`; `docs/workflows/shipment-lifecycle.md`; `web/shipments/service/ShipmentsApiService.java` | Statuses PREPARING / DISPATCHED / ARRIVED / CANCELLED / LOCATION_UNKNOWN; cancellation only from PREPARING — add the Export guard there. Transport document type follows mode (CMR / AIR_WAYBILL / BILL_OF_LADING); number unique when present, blank until dispatch is allowed. |
| `freight_shipment_purchase_order`; `domain/shipments/ShipmentPurchaseOrderParticipation.java` | Participation rows with `close_reason` ARRIVED / CANCELLED; use non-cancelled participations for candidates. Partial selection creates a linked child Order that the Shipment follows. |
| `vessel`; `domain/vessels/Vessel.java`; migration `V18__shared_client_vessels.sql` | Vessel has only id and name; Client association lives in `client_vessel`. |
| `freight_attachment`; `web/attachments/service/AttachmentsApiService.java`; `docs/workflows/attachments.md` | Owner check allows exactly one of Order or Shipment; extend for Export. Upload is a separate operation against a saved owner. |
| `domain/users/UserAuthority.java`; `docs/architecture/authorization.md` | Existing authorities include `SHIPMENT_VIEW/CREATE/EDIT` and `DELIVERY_NOTE_CANCEL`; Shipment reads are Frontline/system-admin only. Add Export authorities and update the authorization doc and tests. |
| `docs/reference/graphql-api.md`, `rest-api.md`, `mcp-tools.md` | Define and regenerate Export contracts during implementation; do not assume existing endpoints. |

Gotchas: the Supplier Invoice's Supplier always comes from its Order (FRO-321), so invoice and Order Suppliers cannot conflict. Invoice cancellation (FRO-321) requires no Export assignment; Export cancellation is what releases it. FRO-319 reads the Export MRN to decide whether an Entry Note is active, so MRN edits at Awaiting EAD change the register. FRO-303 Invoicing company corrections must be rejected when they conflict with a saved Export's fiscal identity.

## Post-deployment verification

Read-only checks against seeded test records and controlled-environment test results. Never create, edit, cancel or confirm production records to verify this ticket.

| Criteria | Read-only check |
| -- | -- |
| 1–5 grouping | Open the seeded Greek, foreign and mixed Shipments in the creation flow without saving; compare candidates, Shipper and Shipper ΑΦΜ with the fixture expectations, including the blocked-data fixtures. |
| 6–9 invoices | Read saved fixture Exports; compare selected invoices, Connected Orders and suggestion source paths. Review test results for matrix, Entry Note and duplicate-creation rejections. |
| 10–12 MRN, customs, editing | Read fixture Exports at each Customs status; compare dates, actors and editable controls. Review server tests for invalid MRN, out-of-order events and stale edits. |
| 13 cancellation | Read a cancelled fixture Export and its Shipment; confirm reason/actor/time, released invoices and reserved MRN. Review tests for operator and later-stage rejection and Shipment cancel guard. |
| 14–16 protocol and VAT | Read fixture protocol numbers/dates and invoice event histories; review generated ΥΔ test output and allocation/retry tests. |
| 17–18 access and files | Call the Export read API as a partner test user and confirm denial; list fixture Export files and download one as staff. |

**Reference:** FRO-321 (Supplier Invoice), FRO-319 (Entry Note), FRO-356 (Order regime), FRO-303 (Invoicing company correction), FRO-329 (Order MRN retirement); presentation FRO-350 / FRO-352 / FRO-348; FRO-315 integrated approach remains canceled; [reviewed production source](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/5c51030680c9d45b3827a7e19b8320c19aa5ed9a).
