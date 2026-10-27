Defines the **Entry Note (Δελτίο Εισόδου)**: its fields, eligibility, relationships, split coverage, corrections, active-case rule and active-register data. An Entry Note records one Order's **storage admission** under **Τελωνειακή Αποθήκευση** (customs storage) and reads its invoices and export declaration from their owning records.

This ticket owns persistence, validation, authorized operations, lookups, audit and register data. Presentation belongs to <issue id="9c0dee70-4bb0-4e72-8ee1-e3c58fab1bba" href="https://linear.app/front-line-ltd/issue/FRO-353/entry-note-creation-page-ui">FRO-353</issue> (creation page), <issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue> (details page) and <issue id="c9ace4d3-c2a3-4858-9b51-aa217a024772" href="https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions">FRO-355</issue> (Order Details shortcut). **Order = purchase order = stock-list item; colli = handling unit.** Supplier Invoice (<issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>) and Export Customs Declaration (<issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue>) are planned entities; existing Order invoice rows are not Supplier Invoices.

## Eligibility and storage admission

**Storage admission** is the stock confirmation of an Order at a warehouse, including arrival by network transfer (<issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>). An Entry Note belongs to the Order's **first** storage admission at a warehouse that supports Τελωνειακή Αποθήκευση. The **admitted collis** are the Order's non-terminal collis at that moment.

An Entry Note can be created only for an Order that:

* is not cancelled;
* has customs regime **Τελωνειακή Αποθήκευση** (<issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>);
* has had a storage admission at a warehouse supporting that regime;
* neither owns a note nor is covered by another note (see **Split coverage**).

Missing Supplier Invoices or Export never block creation. Later network transfers to another warehouse do not create a new note and do not change the admitted collis or the note's warehouse values.

## Split coverage

Each Entry Note has exactly one **owning Order**: the Order whose admission it records. **Admission coverage** is the owning Order plus every Order split from it, directly or through further splits, **after** that admission. Covered Orders resolve the same note.

| Case | Behavior |
| -- | -- |
| **Split after admission** (manual or during Shipment preparation) | The child and its descendants are covered. No new note, number, admission or copied MRN. Cancelling the preparing Shipment keeps the child covered. |
| **Split before admission** | Parent and child are independent. Each gets its own note when it is admitted. |
| **Note created after a split** | Coverage is resolved from the admission time and the split records; children and invoices need no resave. |
| **Not evidence of coverage** | A common family root, similar Stock ID, same physical Shipment or equal entry MRN. |
| **Opening from a covered child** | Shows the original owning Order, admitted totals, note fields, and the owning Order's invoices and Export. Never relinks the note, substitutes the child's invoices or aggregates the family. |

Coverage is computed from the admission and split records, not stored as a separate list (ADR 0004 in the planning repository). Lookups return the note, the owning Order and whether access is **direct** or **inherited**.

**Example:** 10 collis are admitted under one note. Shipment preparation moves 4 into a child and leaves 6 on the parent. Both Orders resolve the same note and its admitted count stays 10. A further split of the child is also covered. The original invoice stays on the parent and is declared once, in either Shipment's Export.

## Fields

Each Entry Note has a **note number**: a system-assigned integer, unique and ascending, allocated on successful creation and never reused. Retries and concurrent requests never allocate twice; failed saves consume no number. The starting value is supplied by the business before release.

**Note-owned**

| Field | Type / format | Rules |
| -- | -- | -- |
| **Order / Stock ID** | Required Order reference | Owning Order. Changed only through **Change Order** (see Corrections). |
| **Note date & time** | Required date-time | Defaults to the current time in Europe/Athens; editable. Distinct from entry MRN date and printing date. Used as the register date. |
| **Entry MRN** | Optional String | May stay blank until customs registration. No format or uniqueness rule. |
| **Entry MRN date** | Optional date | |
| **Tariff classification code (δασμολογική κλάση)** | Number (digits only), stored as text | Preserve leading zeros. Distinct from the goods description. |
| **Goods description** | Free text | Description for printed copies. The only free-text descriptive field; no separate Notes field. |
| **Μεταφορικό μέσο / αριθμός (transport means / number)** | Free text | |
| **Transport Company** | Fixed text | **FRONT LINE Forwarding & Agency LTD**; not editable. |
| **Αριθμός άδειας (permit number)** | String | Prefilled at creation from the admitting warehouse's Τελωνειακή Αποθήκευση licence reference when exactly one exists; otherwise blank. Editable. |
| **Warehouse operator name** | String | Prefilled from the admitting warehouse's operator company. Editable. |
| **Warehouse operator ΑΦΜ** | String | Prefilled from that company's ΑΦΜ (`vat_number`). Editable. |
| **Warehouse address** | String | Prefilled from the admitting warehouse's address. Editable. |

Prefilled values are saved on the note at creation. Later warehouse or company changes and Change Order do not rewrite them.

**Derived, read-only**

| Field | Type / format | Source and rules |
| -- | -- | -- |
| **Admitting warehouse / admission time** | Warehouse reference / date-time | The storage admission the note belongs to. |
| **Collis** | Int | Number of admitted collis, including those later moved to covered children or made terminal. Never reduced by splits or dispatch. |
| **Gross weight** | kg, 2 decimals | Sum of the warehouse-confirmed gross weight recorded at the admission for the admitted collis. When any admitted colli lacks it, the value is **unknown**, never a partial total. |
| **Depositor (Αποθέτης) / ΑΦΜ** | Company reference / String | The owning Order's **Invoicing company** and its ΑΦΜ. Operational Client is never a substitute. When the Order has no Invoicing company, the note is still valid; depositor is blank and flagged as missing. |
| **Operational Client** | Company reference | The owning Order's Client, shown separately from the depositor. |
| **Supplier / ΑΦΜ** | Company reference / String | The owning Order's Supplier and its ΑΦΜ; blank and flagged when missing. |
| **Supplier Invoices** | Derived list | Active (not cancelled) Supplier Invoices of the owning Order with type **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)**: number, date, Supplier, type, currency, net value, actual VAT (€0) and per-invoice Statistical VAT. Zero, one or many. |
| **Total net value** | Money, 2 decimals | Sum of the matching invoices' net values, only when every matching invoice is in **EUR**. Otherwise no total and a "mixed or non-EUR currency" flag. |
| **Statistical VAT (hypothetical, 24%)** | Money, 2 decimals | See **Statistical VAT**. |
| **Export / Export MRN / MRN date** | Export reference / String / date | The one Export containing the matching invoices (<issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue>). Blank while no matching invoice is in an Export. |
| **Customs status** | Export-owned — **Awaiting EAD** / **Awaiting IE599** / **Completed** | Read from that Export, with its labels (EL: **Αναμονή EAD** / **Αναμονή IE599** / **Ολοκληρώθηκε**). No note-owned status, IE599 flag or copy. |

The note has **no status field** and no Active/Finalized lifecycle; active cases are a query (below).

## Relationships

| Relationship | Contract |
| -- | -- |
| **Order** | The note stores its owning Order. Order lookups return a directly owned or inherited note, with provenance. |
| **Supplier Invoices** | Derived through the owning Order; no stored invoice list or invoice → note pointer. Creating a note makes it visible to existing invoices without resave; invoice creation, correction or cancellation refreshes the note's invoice set and totals. Invoice type follows the Order regime under <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>; never inferred from warehouse names, ΚΤΑ, ΑΛΚ or VAT. |
| **Export** | Through the matching invoices' explicit Export membership. <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue> rejects placing one note's matching invoices in different Exports. Creating or correcting a note never selects or moves an Export. Several notes may share one Export. |
| **Physical movement** | Parts of an admitted Order may leave in different Shipments while its invoice is declared once in one Export. Export paperwork does not show which collis travelled. No Shipment, AWB or multi-Export field on the note. |

Lookups distinguish **not found** from loading, failure and denied access; a failed or denied lookup is never reported as "no note".

## Active cases

A note is **active** unless it has at least one matching invoice and **all** of its active matching invoices are in the same Export that has an MRN. A note without invoices, or with an invoice not yet added to the Export (for example, an invoice created after the MRN), is active. Adding that invoice to the Export makes the note inactive again; no lock or warning flow.

Entry MRN, Customs status, IE599 and invoice VAT exemption do not affect this rule. Inactive notes remain readable. Active cases describe declaration paperwork, not remaining physical stock: covered children never add rows.

## Statistical VAT

**Statistical VAT (hypothetical, 24%)** is reporting information, not VAT charged or payable, and separate from the invoices' actual VAT (€0).

* **Per invoice:** 24% × that invoice's net value, rounded to 2 decimals, decimal half-up.
* **Note total:** 24% × total net value, rounded **once** to 2 decimals, decimal half-up. Never the sum of rounded per-invoice amounts; a cents difference is expected.
* No value when there are no matching invoices or the currency rule fails. A known zero net total gives zero.
* Never stored or edited on the note; recalculated when the Order, invoice set or net values change.

**Example:** total net value **€803.62** → Statistical VAT **€192.87**; actual VAT **€0.00**.

## Creation, corrections and protection

* **Create:** validate eligibility, coverage and uniqueness on the server, in the save transaction, including concurrent requests. A covered Order is rejected with the existing note and its owning Order identified, within the caller's access. Failed creation writes nothing.
* **Edit note-owned fields:** any time, with authorization. Entry or Export MRN presence is not a lock.
* **Change Order:** explicit confirmation required. The new owner must pass every creation check. Admitted collis, gross weight, parties, invoices and Export are recalculated from the new owner; note number and all note-owned fields stay unchanged. Lookups of the old and new owners and their covered children refresh atomically. Allowed after an Export MRN exists. Never changes an Order, invoice or Export as a side effect.
* **Invoice facts:** corrected on the Supplier Invoice under <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>; the note refreshes.
* **Regime correction:** reject changing an Order away from Τελωνειακή Αποθήκευση, or to Greece = No, while it owns or is covered by a note. This check joins <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>'s correction path.
* **Order cancellation:** rejected while the Order owns a note.
* **Deletion, cancellation and reissue of notes:** not available.
* **Concurrency:** edits carry a precondition for the version the operator read; stale saves are rejected and the draft kept.
* **Audit:** creation, field edits and Change Order record actor, time and before/after values atomically with the change. Failures write nothing.

## Access

Entry Notes are **staff-only**. Add authorities to view and to create/edit Entry Notes, following the existing `*_VIEW` / `*_CREATE` / `*_EDIT` pattern; exact names are an implementation contract. Frontline operators and managers receive them. Partner users (client, supplier, agent) have no access, including through Order, invoice or Export lookups, search, validation messages and register data.

Retrieval: by note number; by Order (direct or inherited); by Supplier Invoice; by Export; and the active-case list.

## Active register — data contract

Return **one row per active Entry Note**, regardless of entry month, with these 18 columns in order. Screen, Excel and print output belong to the separate register/list ticket.

| # | Heading | Source |
| -- | -- | -- |
| 1 | ΑΡΙΘ. ΛΟΓ. ΚΑΤΑΧΩΡ | Note number |
| 2 | ΑΡΙΘ. ΔΕΛΤΙΟΥ ΕΙΣΟΔΟΥ | Same note number |
| 3 | MRN ΔΕΛΤΙΟΥ | Entry MRN |
| 4 | ΧΕΙΡ. ΚΑΤΑΧ. ΔΕΛΤΙΟΥ | Note number padded to four digits |
| 5 | ΗΜΕΡ/ΝΙΑ | Note date |
| 6 | ΑΠΟΘΕΤΗΣ | Depositor (Invoicing company); blank and flagged when missing |
| 7 | Α.Φ.Μ. ΑΠΟΘΕΤΗ | Depositor ΑΦΜ |
| 8 | ΠΡΟΜΗΘΕΥΤΗΣ | Supplier |
| 9 | Α.Φ.Μ. ΠΡΟΜΗΘΕΥΤΗ | Supplier ΑΦΜ |
| 10 | ΠΕΡΙΓΡΑΦΗ ΕΜΠΟΡΕΥΜΑΤΩΝ | Tariff classification code (not the goods description) |
| 11 | ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΙΟΥ ΠΡΟΜΗΘΕΥΤΗ | All matching invoice numbers in one cell |
| 12 | ΚΟΛΑ | Admitted collis |
| 13 | ΧΙΛ/ΜΑ ΜΙΚΤΑ | Gross weight; blank when unknown |
| 14 | ΚΑΘΑΡΗ ΑΞΙΑ ΤΙΜΟΛΟΓΙΟΥ | Total net value; blank under the currency rule |
| 15 | ΠΟΣΟ Φ.Π.Α. | Note-total Statistical VAT |
| 16 | ΤΕΛΩΝΕΙΑΚΟ ΠΑΡΑΣΤΑΤΙΚΟ ΕΞΟΔΟΥ | Export MRN (blank on active rows) |
| 17 | ΗΜΕΡ/ΝΙΑ ΕΞΟΔΟΥ | Export MRN date (blank on active rows) |
| 18 | STATUS | **A** for every active row. Legacy register-format value only, not a note field. |

Each row also carries the flags for missing depositor/Supplier, unknown weight and the currency rule, so the output can explain blank cells.

## Required changes in linked presentation tickets

| Ticket | Required outcome |
| -- | -- |
| <issue id="9c0dee70-4bb0-4e72-8ee1-e3c58fab1bba" href="https://linear.app/front-line-ltd/issue/FRO-353/entry-note-creation-page-ui">FRO-353</issue> | Order search offers only eligible Orders and explains ineligible ones (wrong regime, not admitted, cancelled, already owned/covered). Note date & time required, defaulting to now. Permit and operator fields prefilled from the admitting warehouse, not fixed values. Unknown weight, missing depositor/Supplier and the currency rule shown explicitly. |
| <issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue> | Same display rules; Change Order search uses the creation eligibility. |
| <issue id="c9ace4d3-c2a3-4858-9b51-aa217a024772" href="https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions">FRO-355</issue> | **Create Entry Note** only for eligible Orders; **Open Entry Note** for owning and covered Orders. |

## Decisions

| Decision | Reason |
| -- | -- |
| Note tied to the Order's first storage admission at a Τελωνειακή Αποθήκευση warehouse | Gives a recorded event that fixes the admitted collis and separates pre- from post-admission splits. |
| Creation requires the Αποθήκευση regime and that admission | An Entry Note records goods already admitted under customs storage. |
| Coverage derived from admission time and split records | A note may be created after the split it must cover; a stored list could drift (ADR 0004). |
| Warehouse-confirmed admission weight; unknown if any is missing | Stock confirmation already records it; a partial total would misstate the register. |
| Totals only when all matching invoices are in EUR | Invoices may use any currency (<issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>); no conversion is specified. |
| Depositor = Order Invoicing company and its ΑΦΜ | Confirmed business mapping; operational Client is a different company. |
| Number on successful creation; starting value supplied before release | Same pattern as the Export protocol; no gaps from failed saves. |
| Warehouse values prefilled from the admitting warehouse, then note-owned | <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> records licences per warehouse; saved notes must not change when master data changes. |
| Active until every matching invoice is in an Export with MRN | Keeps late invoices visible as outstanding paperwork. |
| No status, deletion, cancellation or reissue | Active cases are derived; cancellation/reissue is deferred. |

## Out of scope

Exit (Εξόδου) and Transfer (Μεταβίβασης) notes: no current use was found and no requirements exist. Notes list, active-register screen/Excel/print output, recipient copies and preservation of printed values (separate register/list ticket). Note cancellation, reissue and number reuse. Historical workbook import, cleanup or number continuation. New UI or preview.

## Acceptance criteria

 1. Creation succeeds only for a non-cancelled Τελωνειακή Αποθήκευση Order with a storage admission at a supporting warehouse that neither owns nor is covered by a note; missing invoices/Export do not block. Concurrent duplicates are rejected.
 2. Children split after admission resolve the parent's note, including grandchildren and children created before the note; pre-admission splits get independent notes; root, Shipment or equal MRN never establish coverage.
 3. Admitted collis and gross weight come from the first qualifying admission, are unchanged by splits, dispatch or later transfers, and gross weight is unknown when any admitted colli lacks a warehouse-confirmed weight.
 4. Note number is unique, ascending, allocated once on success and never reused; note date & time is required and defaults to Athens now.
 5. Warehouse values prefill from the admitting warehouse and stay unchanged by later master-data changes and Change Order; Transport Company is fixed.
 6. Matching invoices are the owning Order's active Αποθήκη Αποθήκευσης invoices; cancelled and other types are excluded. Totals and Statistical VAT follow the EUR rule and rounding rules (€803.62 → €192.87).
 7. Depositor is the Order Invoicing company with its ΑΦΜ; a missing Invoicing company or Supplier leaves a flagged blank without blocking.
 8. Export MRN/date and Customs status come from the one Export holding the matching invoices; the note stores none of them.
 9. The active rule holds for: no invoices, invoices outside any Export, all invoices in an Export without MRN, all in an Export with MRN (inactive), and a later invoice not yet added (active again).
10. Change Order validates the new owner, recalculates derived values, keeps note-owned fields and number, refreshes old/new lookups atomically and changes no other record.
11. Regime change away from Αποθήκευση and cancellation of an owning Order are rejected; notes cannot be deleted.
12. Partner users cannot read notes or register data through any path; staff authorities control view and create/edit.
13. Creation, edits and Change Order are audited with before/after values; stale edits and failures write nothing.
14. The register returns one row per active note with the 18 columns, values and flags above.

## Context for agents

Live production repository `Frontline-Forwarding/frontline-forwarding`, reviewed through authenticated `gh` at **main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a** and branch `chriskazakos/fro-356-order-customs-regime` (5 commits ahead, not merged) on 27 October 2026. Entry Note, Supplier Invoice and Export do not exist yet.

| Source | Implementation context |
| -- | -- |
| `docs/reference/database.md` — `freight_purchase_order` | `invoice_company_id` and `supplier_company_id` are nullable; `client_company_id` required. Lineage columns `lineage_root/parent_purchase_order_id`. |
| `freight_purchase_order_split`, `freight_purchase_order_split_item`, `freight_handling_unit_po_membership` | Split records with `created_at`, per-colli parent/child memberships and `valid_from/valid_until`: the source for coverage and for tracing admitted collis into children. |
| `freight_purchase_order_warehouse_stay` | `stocked_at` and `warehouse_id` per Order stay: the admission event. Stock confirmation cannot be undone (`docs/workflows/purchase-order-colli-journey.md`). |
| `freight_handling_unit_measurement` | `WAREHOUSE_CONFIRMED` rows linked to `warehouse_stay_id` with `weight_gross`; stock confirmation requires a measurement per non-terminal colli. `freight_handling_unit.declared_weight_gross` is the declared value, not used here. |
| `freight_warehouse`, `company` | Warehouse address fields and `operator_company_id`; operator ΑΦΜ is `company.vat_number`. |
| FRO-356 branch — `docs/workflows/order-customs-regime.md` | `CUSTOMS_STORAGE` regime, `freight_warehouse_customs_regime`, `freight_warehouse_customs_licence(_regime)`, storage admission definition; its correction path expects the Entry Note compatibility check. |
| `docs/architecture/authorization.md` | Existing authorities follow `PURCHASE_ORDER_*`, `WAREHOUSE_*`, `DELIVERY_NOTE_*`; add Entry Note authorities and update docs/tests. |
| `docs/reference/graphql-api.md`, `rest-api.md`, `mcp-tools.md` | Define and regenerate Entry Note contracts during implementation. |

Gotchas: <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue> allows MRN edits at Awaiting EAD and invoice additions at every stage, so both change the active list. Invoice cancellation (<issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>) changes the matching set. The supplied example workbook (ΓΕΝΙΚΗ ΛΟΓΙΣΤΙΚΗ ΑΠΟΘΗΚΗΣ ΑΠΟΘΗΚΕΥΣΗΣ, sheet 2022-02) is evidence only: one note can list four invoices, several notes can share an Export MRN, and it has no Order/Stock ID column. It is not imported.

## Post-deployment verification

Read-only checks against seeded test records and controlled-environment test results. Never create, edit or correct production records to verify this ticket.

| Criteria | Read-only check |
| -- | -- |
| 1, 4, 11 | Read fixture notes and test results: eligible creation, rejection reasons for ineligible/covered Orders, concurrent-duplicate rejection, number sequence, date default, rejected regime change and Order cancellation. |
| 2 | Look up seeded parent, child, grandchild (post-admission), a pre-admission split and an unrelated Order; compare note IDs, owning Order and provenance. |
| 3, 5 | Compare a fixture note's collis/weight with its admission's colli memberships and confirmed measurements, including an unknown-weight fixture; compare warehouse values with the warehouse record at creation. |
| 6–8 | Compare invoice rows, totals, Statistical VAT (€803.62 → €192.87), currency flag, depositor/Supplier and Export facts with their owning records. |
| 9, 14 | Read the active list and register rows for the five active-rule fixtures; check 18 columns, values and flags. |
| 10, 13 | Read audit entries and test results for Change Order, field edits, stale saves and failures. |
| 12 | Call note and register reads as a partner test user and confirm denial; read as staff. |

**Reference:** <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> (regime, licences, admission — blocks this ticket); <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> (Supplier Invoice); <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue> (Export); presentation <issue id="9c0dee70-4bb0-4e72-8ee1-e3c58fab1bba" href="https://linear.app/front-line-ltd/issue/FRO-353/entry-note-creation-page-ui">FRO-353</issue> / <issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue> / <issue id="c9ace4d3-c2a3-4858-9b51-aa217a024772" href="https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions">FRO-355</issue>; <issue id="d46a5eda-1eec-40cd-845a-9fda311edd3b" href="https://linear.app/front-line-ltd/issue/FRO-248/customs-warehousing-deltia-telwneiakhs-apo8hkeyshs">FRO-248</issue> historical reference; [reviewed production source](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/5c51030680c9d45b3827a7e19b8320c19aa5ed9a).
