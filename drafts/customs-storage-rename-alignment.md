# Customs Storage Entry rename + alignment — FRO-319 / FRO-353 / FRO-354 / FRO-355

Baselines (updatedAt): FRO-319 2026-10-27T07:29:42.875Z · FRO-353 2026-10-20T11:10:48.779Z · FRO-354 2026-10-20T11:10:52.133Z · FRO-355 2026-10-20T11:10:55.413Z.
Each ticket is saved with one atomic patch (specific edits first, then the global renames). Labels, status, relations, attachments unchanged.

## Global renames (all four, applied last)

| Before | After | Tickets |
| -- | -- | -- |
| An Entry Note / an Entry Note | A / a Customs Storage Entry | 319 (An), 353, 355 (an) |
| Entry Notes | Customs Storage Entries | 319, 353, 354 |
| Entry Note | Customs Storage Entry | all |
| Note number / note number (incl. "has a **note number**" → "has an **entry number**") | Entry number | 319, 353 |
| Note date & time / note date & time, Note date (register col. 5) | Entry date & time / Entry date | 319, 353 |
| Note-owned / note-owned | Entry-owned / entry-owned | 319 |

Titles: "Customs Storage Entry — entity & business rules" · "Customs Storage Entry — Creation page UI" · "Customs Storage Entry — Details page UI" · "Order Details — Create or open Customs Storage Entry from Available actions". Greek labels (Δελτίο Εισόδου, Δημιουργία / Άνοιγμα Δελτίου Εισόδου) unchanged.

## FRO-319

1. After the intro sentence add: In Greek the record keeps the document name **Δελτίο Εισόδου**; the portal section is **Customs Storage / Τελωνειακή Αποθήκευση**. "Customs Warehousing" is not used: in the code it names Τελωνειακή Αποταμίευση.
2. "Screen, Excel and print output belong to the separate register/list ticket." → "… belong to FRO-358."
3. Out of scope "(separate register/list ticket)" → "(FRO-358)".

## FRO-353

1. Blocked-by paragraph: "Design may proceed for settled cases; the preview does not resolve depositor mapping, requiredness/number allocation, partial/conflicting relationships or other structural questions." → "Design may proceed; the structural rules are settled in FRO-319."
2. Entry point "**Customs Warehousing → Create Entry Note**" → "**Customs Storage → Create Customs Storage Entry**".
3. Order search: only Orders eligible under FRO-319 (not cancelled, Τελωνειακή Αποθήκευση, storage admission at a supporting warehouse, not owned/covered) can be selected; ineligible matches stay visible, not selectable, with their reason (wrong regime, not yet admitted, cancelled, already owned/covered — naming the existing entry and its owning Order).
4. "Text revision only — 20 October 2026" paragraph → "**Preview status:** the existing previews are historical reference only. They need a ChatGPT sign-in and predate split coverage, Order eligibility, warehouse prefill, unknown weight and the currency rule; this description is the contract."
5. Order relationship card: gross weight shows **Unknown** when FRO-319 reports it unknown; missing Invoicing company or Supplier shows a blank value with a **Missing** marker.
6. Depositor paragraph: "working assumption … pending business confirmation" → "Depositor is the Order's **Invoicing company**, with that company's ΑΦΜ; keep Operational Client distinct. A missing depositor or Supplier never blocks creation."
7. Fields: Note number → Entry number "Generated on successful creation, read-only; …"; Note date & time → "Entry date & time — Required; defaults to the current time (Europe/Athens); editable. Distinct from entry MRN date and printing date."
8. Warehouse operator rows: permit "Prefilled from the admitting warehouse's Τελωνειακή Αποθήκευση licence when exactly one exists, otherwise blank; editable."; operator name "Prefilled from the admitting warehouse's operator company; editable."; ΑΦΜ "Prefilled from that company's ΑΦΜ; editable."; address "Prefilled from the admitting warehouse's address; editable; full-width." (fixed 20GR000001WV00002 / Μ.Ε.Π.Ε. / 998712350 / Piraeus values removed).
9. "Use controlled reference defaults … confirm current legal values before implementation." → "Warehouse values prefill when an Order is selected; changing the draft Order re-prefills only the warehouse fields the operator has not edited. Saved values stay on the entry (FRO-319)."
10. "Requiredness and numbering follow the final structural contract" → "… follow FRO-319".
11. Invoice table: add row "Currency | Invoice-owned currency." before Net value.
12. "Do not present unavailable amounts, incomplete invoice data or unresolved currency handling as a known zero." → "When any matching invoice is not in EUR, show no totals or Statistical VAT and explain **Mixed or non-EUR currency**. Do not present unavailable amounts or incomplete invoice data as a known zero."
13. Remove "The preview explains partial/conflicting cases without deciding FRO-319's unresolved save policy."
14. Create disabled: "no valid Order, a directly owned or inherited current note for that admission, loading/failed Order lookup, or a pending submission" → "no eligible Order selected, loading/failed Order lookup, or a pending submission".
15. Scope boundary: list, active register and recipient copies → FRO-358; attachments, cancellation/reissue, backend outside; Exit/Transfer not planned; the deferred-scope attachment is historical and superseded by FRO-358. Remove "Review draft pending user approval; no status change to Ready is requested."
16. AC1 + "Only eligible Orders can be selected and ineligible ones show their reason." AC4 → "Entry number and fixed Transport Company stay read-only; entry date & time is required with the default; warehouse fields prefill from the admitting warehouse." AC6 + "mixed or non-EUR currency shows no totals".

## FRO-354

1. "Text revision only — 20 October 2026" paragraph → same Preview status wording as FRO-353 (details preview).
2. Order relationship: "unknown gross weight and missing depositor/Supplier follow FRO-353's display."
3. Invoice tab: "Totals follow FRO-319's EUR rule: mixed or non-EUR currency shows no totals."
4. Order relationship → Edit (both places): only Orders eligible under FRO-319's creation rules can be selected; ineligible matches show their reason. AC3 likewise.
5. "Unresolved partial/conflicting relationships … unresolved save/correction policy." → "Change Order follows FRO-319: the new owner must pass the creation checks; entry-owned fields and the number stay unchanged."
6. Printing bullet → "**Print** (EL: **Εκτύπωση**) in the page header opens FRO-358's five recipient-copy choices; FRO-358 owns the outputs. The list, attachments, cancellation/reissue and backend implementation remain outside this ticket."
7. "Cancellation/reissue controls wait for FRO-319's agreed workflow" → "No cancellation, reissue or deletion control (FRO-319)".
8. Remove the old "**Preview status:** pending user review …" paragraph. AC7 → adds Print → FRO-358; drops "Unresolved correction policy".

## FRO-355

1. No-current-entry row: Create only for an Order eligible under FRO-319 (not cancelled, Τελωνειακή Αποθήκευση, storage admission at a supporting warehouse).
2. New row **Ineligible Order**: card shows Create disabled with the reason (not under Customs Storage, not yet admitted to a supporting warehouse, cancelled); EL reasons follow the page's translations.
3. AC3 → "Missing invoices/Export alone do not disable valid creation. Create is usable only for Orders eligible under FRO-319; ineligible Orders show the disabled card with its reason. No Supplier prerequisite is copied from the Supplier Invoice shortcut."
4. "Text revision only — 20 October 2026" paragraph → "**Preview status:** the FRO-326 preview and the action preview below are historical reference only. They need a ChatGPT sign-in and do not show inherited coverage, eligibility or the renamed labels; this description is the contract."
