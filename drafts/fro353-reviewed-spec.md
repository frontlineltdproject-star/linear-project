**As a customs operator I want to create a Customs Storage Entry (Δελτίο Εισόδου) for one admitted Order** so that its storage admission is recorded with the entry's own customs facts, while parties, quantities, invoices and Export are read from their owning records.

**Order = purchase order = stock-list item; colli = handling unit.** This ticket owns the creation page only. Every business rule — eligibility, coverage, numbering, derived values, validation, access, audit — belongs to [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319); the page consumes it and never re-implements it. The saved-record page is [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354), the Order Details shortcut is [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355), and the entries list, register and prints are [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358). Supplier Invoice ([FRO-321](https://linear.app/front-line-ltd/issue/FRO-321)) and Export ([FRO-317](https://linear.app/front-line-ltd/issue/FRO-317)) are planned entities; existing Order invoice rows are not Supplier Invoices.

## Entry points and access

| Entry | Behavior |
| -- | -- |
| **Order Details → Create Customs Storage Entry** ([FRO-355](https://linear.app/front-line-ltd/issue/FRO-355)) | Opens this page with that Order's record ID preselected and the Order as return context. The header shows **Back to Order {Stock ID} / Επιστροφή στην παραγγελία {Stock ID}**. |
| **Direct route** (later the [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358) list button) | Opens with no Order selected. This ticket owns the page route only; the menu entry and list button belong to FRO-358. Until FRO-358 ships, the page is reached from FRO-355. |

* Users without Customs Storage Entry create authority see an access-denied page: **You do not have permission to create Customs Storage Entries. / Δεν έχετε δικαίωμα δημιουργίας Δελτίων Εισόδου.** Partner users (client, supplier, agent) never reach the page and never see entries, eligibility or reasons.
* Opening the page creates nothing.

**Preselected Order** — the page runs the normal selection flow for it:

| Preselected Order | Page shows |
| -- | -- |
| Eligible | Selected; derived values and warehouse prefill load. |
| Ineligible | Its Stock ID in the search field, **not selected**, with **Order {Stock ID} cannot be selected. / Η παραγγελία {Stock ID} δεν μπορεί να επιλεγεί.** and the reason from the table below. Create stays disabled. |
| Already owned or covered | As ineligible, with the existing entry number, its owning Order and an **Open / Άνοιγμα** link to that entry's FRO-354 page. |
| Not found or not accessible | **The Order you came from was not found or you cannot open it. Search for an Order. / Η παραγγελία από την οποία ήρθατε δεν βρέθηκε ή δεν έχετε πρόσβαση. Αναζητήστε παραγγελία.** and an empty search. It never falls back to a different Order. |

## Page structure

Title **Create Customs Storage Entry / Δημιουργία Δελτίου Εισόδου**, subtitle **Record the storage admission of one Order under Customs Storage. / Καταχωρίστε την παραλαβή μίας παραγγελίας σε Τελωνειακή Αποθήκευση.** One outer card holds three tabs in this order; Overview opens first:

| Tab | Contents |
| -- | -- |
| **Overview / Επισκόπηση** | Card **Order relationship**, then card **Customs Storage Entry details** with three sub-cards: **Entry details → Goods and transport → Warehouse operator**. |
| **Related Supplier Invoices ({n}) / Σχετικά τιμολόγια προμηθευτών ({n})** | Read-only invoice table; n = matching invoices, 0 with no Order. |
| **Related Export / Σχετική εξαγωγή** | Read-only Export facts. |

**Cancel** and **Create Customs Storage Entry** sit right-aligned in a row below the outer card. There is no Additional details tab, Notes field, entry status, Active/Finalized selector, entry type field or duplicate quantity input.

## Order relationship

**Order search** (required): one search field. It uses the existing Order search text — Stock ID, message number, owner reference, supplier reference, vessel name and colli tracking code — through FRO-319's **Order search for entry creation**, which returns each match with its creation eligibility. Client name, Supplier name and invoice number are not searched. Each result shows Stock ID, Order status pill, Client and Supplier.

Eligible matches can be selected with mouse or keyboard (Arrow keys, Enter, Escape). Ineligible matches stay listed, cannot be selected, and show the first failing reason from FRO-319, in this order:

| Reason | EN | EL |
| -- | -- | -- |
| Cancelled | This Order is cancelled. | Η παραγγελία είναι ακυρωμένη. |
| Not Customs Storage (incl. Greece = No) | The Order's customs regime is not Customs Storage. | Το τελωνειακό καθεστώς της παραγγελίας δεν είναι Τελωνειακή Αποθήκευση. |
| Not admitted | The Order has not been admitted to a Customs Storage warehouse yet. | Η παραγγελία δεν έχει παραληφθεί ακόμη σε αποθήκη Τελωνειακής Αποθήκευσης. |
| Admitted under another Order | Goods were admitted under Order {Stock ID}. Create the entry from that Order. | Τα εμπορεύματα παραλήφθηκαν με την παραγγελία {Stock ID}. Δημιουργήστε το δελτίο από εκείνη την παραγγελία. |
| Already owned or covered | Already covered by Customs Storage Entry {entry number} (Order {Stock ID}). + **Open** | Καλύπτεται ήδη από το Δελτίο Εισόδου {entry number} (παραγγελία {Stock ID}). + **Άνοιγμα** |

{Stock ID} links to that Order's Details; **Open** goes to the entry's FRO-354 page. The page never selects another Order automatically.

Search states: loading (**Loading… / Φόρτωση…**), no matches (**No Orders match your search. / Καμία παραγγελία δεν ταιριάζει με την αναζήτηση.**), failure (**Could not search Orders. / Δεν ήταν δυνατή η αναζήτηση παραγγελιών.** + **Retry / Επανάληψη**). Typing never changes the selected Order; closing the list restores the selected Stock ID. Stale responses for an earlier query are ignored.

**Derived, read-only** (shown once an Order is selected; otherwise **Select an Order to see its admission and parties.**):

| Field | Source and display |
| -- | -- |
| **Stock ID** | Link to the Order's Details. |
| **Admitting warehouse · admission** | Warehouse code and name · admission date and time (Europe/Athens) of the first storage admission. |
| **Admitted collis** | Count of the original admission, including collis later moved to covered children. |
| **Gross weight** | kg, 2 decimals. **Unknown / Άγνωστο** marker when FRO-319 reports it unknown; never a partial total. |
| **Depositor (Invoicing company) / Αποθέτης (εταιρεία τιμολόγησης)** and **Depositor ΑΦΜ** | The Order's Invoicing company. When missing: blank with a **Missing / Λείπει** marker. |
| **Operational Client** | The Order's Client, separate from the depositor. |
| **Supplier** and **Supplier ΑΦΜ** | When missing: blank with a **Missing / Λείπει** marker. |

Missing depositor, Supplier, invoices or Export never block creation. Changing the selected Order refreshes all derived values, invoices and Export, and keeps the entry-owned values the operator entered (see warehouse prefill below).

## Customs Storage Entry details

| Sub-card | Field | Control and rules |
| -- | -- | -- |
| **Entry details** | Entry number | Read-only placeholder **Assigned on creation / Αποδίδεται κατά τη δημιουργία**; the number is allocated by FRO-319 on success. |
| | Entry date & time (required) | Date picker + time input. Defaults to now (Europe/Athens). Not later than now. |
| | Entry MRN (optional) | Text, ≤ 500 characters, no format rule. |
| | Entry MRN date (optional) | Date picker. Not later than today. |
| | Tariff classification code / δασμολογική κλάση (optional) | 1–10 digits; leading zeros kept. Hint **Digits only, up to 10 / Μόνο ψηφία, έως 10**. |
| **Goods and transport** | Goods description for printed copies (optional) | Full-width multiline text, ≤ 2,000 characters. |
| | Transport means / number — Μεταφορικό μέσο / αριθμός (optional) | Text, ≤ 500 characters. |
| | Transport Company | Read-only **FRONT LINE Forwarding & Agency LTD**. |
| **Warehouse operator** | Permit number (optional) | Prefilled with the admitting warehouse's Τελωνειακή Αποθήκευση licence reference when it has exactly one. Otherwise blank with **No single Customs Storage licence on {warehouse}; enter the permit number. / Η {warehouse} δεν έχει μία μόνο άδεια Τελωνειακής Αποθήκευσης· συμπληρώστε τον αριθμό άδειας.** |
| | Operator name, Operator ΑΦΜ (optional) | Prefilled from the warehouse's operator company and its ΑΦΜ. |
| | Warehouse address (optional) | Full-width. Prefilled as **Street Number, Postal code City**, skipping blank parts. |

Prefilled fields show **Prefilled from {warehouse}. You can change it. / Συμπληρώθηκε από {warehouse}. Μπορείτε να το αλλάξετε.** All four stay editable. When the operator changes the draft Order, only the warehouse fields they have not edited are prefilled again. Text limits are enforced by the field.

**Validation messages** (shown under the field; the page also checks them, FRO-319 enforces them):

| Rule | EN | EL |
| -- | -- | -- |
| Date or time empty | Enter the entry date and time. | Συμπληρώστε την ημερομηνία και ώρα του δελτίου. |
| Date-time in the future | The entry date and time cannot be later than now. | Η ημερομηνία και ώρα του δελτίου δεν μπορεί να είναι μεταγενέστερη από τώρα. |
| MRN date in the future | The Entry MRN date cannot be later than today. | Η ημερομηνία MRN του δελτίου δεν μπορεί να είναι μεταγενέστερη της σημερινής. |
| Tariff code | Use digits only, up to 10. | Χρησιμοποιήστε μόνο ψηφία, έως 10. |

On a failed check the page opens Overview, shows **Fix the highlighted fields. / Διορθώστε τα επισημασμένα πεδία.** and focuses the first invalid field.

## Related Supplier Invoices

Active (not cancelled) Supplier Invoices of the selected Order with type **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)**, read-only, from FRO-319. Zero, one or many; no cap. Subtitle: **Active invoices of type Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) on the selected Order.**

| Column | Display |
| -- | -- |
| Invoice ID | Link to the Supplier Invoice's Details (FRO-348). |
| Invoice number, Invoice date, Supplier, Invoice type | Invoice facts. |
| Currency | The invoice's currency code. |
| Net value | 2 decimals, in the invoice's currency, right-aligned. |
| Actual VAT | The invoice's VAT (0.00 for this type), in its currency. |
| **Statistical VAT (hypothetical, 24%) / Στατιστικός ΦΠΑ (υποθετικός, 24%)** | 24% × that row's net value, rounded half-up to 2 decimals, in the invoice's currency. Shown for every row. |

* **Totals** row in the table footer, only when every row is EUR: total net value, total actual VAT and total Statistical VAT (24% × total net value, rounded once) under their columns. Example: **€803.62 → €192.87**, actual VAT **€0.00**.
* When any row is not EUR: no Totals row and **Mixed or non-EUR currency: totals and total Statistical VAT are not shown. / Μικτό ή μη ευρώ νόμισμα: τα σύνολα και ο συνολικός στατιστικός ΦΠΑ δεν εμφανίζονται.**
* Note under the table: **Statistical VAT is reporting information only. It is not VAT charged or payable.**
* No Order: **Select an Order to see its invoices.** No matching invoices: **This Order has no matching invoices yet. You can still create the entry.**
* Header, rows and footer share one column grid and scroll horizontally inside the card on narrow screens.

## Related Export

The one Export holding the matching invoices, read-only, from FRO-319: **Export** (link to FRO-352), **Export MRN**, **Export MRN date**, **Customs status** pill **Awaiting EAD / Awaiting IE599 / Completed** (EL **Αναμονή EAD / Αναμονή IE599 / Ολοκληρώθηκε**). Caption: **Read from the Export. Change it on the Export page.** Blank values show **—**.

| Case | Display |
| -- | -- |
| No Order | Select an Order to see its Export. |
| No matching invoices | No matching invoices, so no Export. / Δεν υπάρχουν αντίστοιχα τιμολόγια, άρα ούτε εξαγωγή. |
| No matching invoice in an Export | None of the matching invoices is in an Export yet. |
| Some invoices in the Export | The Export's facts plus **{n} of {m} invoices are in this Export. / {n} από {m} τιμολόγια βρίσκονται σε αυτή την εξαγωγή.** |

There is no conflicting-Export state (FRO-317 keeps one entry's invoices in one Export), no Export picker, IE599 field or Customs action on this page.

## Actions and outcomes

* **Create** is disabled with no eligible Order selected, while the Order or its derived data is loading, and while a submission is pending (label **Creating… / Δημιουργία…**).
* **Cancel:** with no input, leaves at once; with a changed Order or any entered value, opens **Discard this entry? / Απόρριψη του δελτίου;** with **Keep editing / Συνέχεια επεξεργασίας** and **Discard / Απόρριψη**. Keep editing, Escape or the backdrop keep the draft and return focus to Cancel. Discard leaves without saving. Destination: the originating Order when opened from Order Details, otherwise the previous page, or the Orders list when there is none.
* Leaving the page by other navigation with unsaved input shows the browser's leave-page warning.
* The draft (Order, entered values, prefill edits) survives tab and language changes and every failed submission.

| Outcome | Behavior |
| -- | -- |
| **Created** | Opens the new entry's FRO-354 page with toast **Customs Storage Entry {number} created. / Το Δελτίο Εισόδου {number} δημιουργήθηκε.** From Order Details, that page keeps **Back to Order {Stock ID}**. |
| **Validation or eligibility rejected by the server** | Draft kept; field errors on their fields, eligibility reason on the Order card. Nothing created. |
| **Created first by someone else** | **Customs Storage Entry {number} was created for this Order by someone else. Your values are kept.** + **Open**. No overwrite, no second entry. |
| **Failed** | **The entry could not be created. Nothing was saved. Your values are kept. / Δεν ήταν δυνατή η δημιουργία του δελτίου. Δεν αποθηκεύτηκε τίποτα. Οι τιμές σας διατηρούνται.** |
| **Response lost** | **We could not confirm whether the entry was created. Checking the Order…** The page looks up the Order's current entry before Create is enabled again: if one exists it opens it; if not, **No entry was created. You can try again.** |

## Acceptance criteria

1. From Order Details the page opens with that Order preselected and Back to Order; the direct route opens with no Order. Ineligible, covered, not-found and denied preselections behave as in the preselection table; nothing is created on open.
2. Users without create authority get the access-denied page; partner users cannot reach the page or any eligibility data.
3. Order search matches Stock ID, message number, references, vessel and colli code; ineligible matches are listed, cannot be selected, and show the first reason in the agreed order in EN/EL, with Open for covered Orders.
4. Three tabs, two Overview cards and three sub-cards appear in the agreed order; no Notes, status, entry type or Additional details element exists.
5. Selecting an Order shows admitting warehouse and admission, admitted collis, gross weight (Unknown when unknown), depositor, Client and Supplier (Missing markers when absent). Changing the Order refreshes derived data and keeps entered values.
6. Entry date & time defaults to now and rejects future values; MRN date rejects future dates; tariff code accepts 1–10 digits with leading zeros; text limits hold. Errors appear on the field and focus moves to the first one.
7. Permit, operator name, ΑΦΜ and address prefill from the admitting warehouse; permit is blank with the hint when the warehouse has no single Customs Storage licence; fields edited by the operator are not overwritten when the Order changes.
8. The invoice table lists only active Αποθήκη Αποθήκευσης invoices of the Order, with per-row amounts and Statistical VAT in the invoice currency; the Totals footer appears only when all are EUR and matches €803.62 → €192.87; mixed currency shows the message and no totals; zero-invoice and four-invoice Orders work.
9. The Export tab shows the Export facts and status from the one Export, the "n of m" note for partial assignment, and the three empty explanations.
10. Create disabled/pending rules, Cancel with and without input, leave-page warning, and draft retention across tabs, language and failures work.
11. Created, server-rejected, created-by-someone-else, failed and lost-response outcomes behave as specified; no second entry is ever created by retrying.
12. EN/EL strings are complete; keyboard use works for tabs (arrow keys), search list and dialog; at 400px nothing overflows the page and the invoice table scrolls inside its card.

## Decisions

| Decision | Reason |
| -- | -- |
| Search uses the existing Order search fields, with eligibility per match from a new FRO-319 search read | Production search does not match Client, Supplier or invoice; one shared eligibility check keeps the page and the server in agreement. |
| FRO-355's reason table and order, plus "already covered" with Open | One wording across the shortcut and the page; the operator can reach the existing entry. |
| Ineligible or covered preselection is shown but not selected | Never creates an entry for an Order other than the one the operator chose. |
| Cancel goes back to the originating Order, else the previous page or the Orders list | Matches FRO-355's return context; no list page exists before FRO-358. |
| Page route only; menu and list button stay with FRO-358 | Avoids two owners for Customs Storage navigation. |
| Admitting warehouse and admission shown | The operator sees where the prefilled permit, operator and address come from. |
| Permit hint when there is no single licence | A blank field alone does not say why it is blank. |
| Entry date-time ≤ now, MRN date ≤ today, tariff 1–10 digits, text 500 / goods 2,000 | Same no-future-date rule as Export dates; TARIC codes have at most 10 digits. Added to FRO-319. |
| Per-row amounts and Statistical VAT in the invoice's currency; totals only all-EUR | Rows stay informative without currency conversion; the register uses only the EUR total. |
| No conflicting-Export state; partial shows "n of m" | FRO-317 prevents conflicts; late invoices are the real case. |
| Lost response checks the Order's entry before retry | Prevents a duplicate entry and a false failure. |

## Out of scope

Entity, numbering and validation rules and the search/eligibility reads ([FRO-319](https://linear.app/front-line-ltd/issue/FRO-319)); the saved-record page and Change Order ([FRO-354](https://linear.app/front-line-ltd/issue/FRO-354)); the Order Details card ([FRO-355](https://linear.app/front-line-ltd/issue/FRO-355)); the Customs Storage menu entry, entries list, register and prints ([FRO-358](https://linear.app/front-line-ltd/issue/FRO-358)); attachments; entry cancellation or reissue; Exit/Transfer entries; editing invoices or Exports; search by Client, Supplier or invoice number.

## Context for agents

Live repository `Frontline-Forwarding/frontline-forwarding`, reviewed through authenticated `gh` at main **5c51030680c9d45b3827a7e19b8320c19aa5ed9a** on 27 October 2026. Customs Storage Entry, Supplier Invoice, Export, their authorities and reads do not exist yet; [FRO-356](https://linear.app/front-line-ltd/issue/FRO-356) (regime, warehouse licences, storage admission) is on unmerged branch `chriskazakos/fro-356-order-customs-regime`.

| Source | Implementation context |
| -- | -- |
| `frontline-forwarding-app/.../domain/purchaseorders/PurchaseOrderRepository.java` — `searchCondition` | Order search text matches `internal_number`, `message_number`, owner/supplier reference, vessel name and current colli `tracking_code`. FRO-319's search read reuses it and adds eligibility. |
| `docs/reference/database.md` — `freight_warehouse` | Address = `street`, `street_number`, `postal_code`, `city_id` (all nullable); `operator_company_id` required; ΑΦΜ is `company.vat_number`. |
| FRO-356 branch — `docs/workflows/order-customs-regime.md` | `CUSTOMS_STORAGE`, `freight_warehouse_customs_licence(_regime)`; licences per warehouse, so a warehouse can have none or several. |
| `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css` | Design authority: semantic tokens, teal = action only, mono for IDs/dates/money, sentence case, compact density. |
| `src/features/shipments/components/delivery-notes-card.tsx` | Existing pattern for date + time: `DatePicker` with `Input type="time"`. |
| `src/features/auth/types.ts` | `UserAuthority` pattern; Customs Storage Entry authorities are added by FRO-319. |

**Component map** (all from `src/components/ui/` unless marked):

| Element | Component |
| -- | -- |
| Page title, Back to Order | `components/layout/top-bar.tsx` (`TopBar`) |
| Outer card, cards, sub-cards | `Card`, `CardHeader`, `CardTitle`, `CardBody` |
| Tabs | `Tabs`, `TabList`, `Tab`, `TabPanel` |
| Read-only values, text fields | `Input`, `Textarea`, `FormField`, `Label` |
| Entry date & time, MRN date | `DatePicker` + `Input type="time"` |
| Order status pill, Customs status, markers | `StatusPill`, `Badge` |
| Reason, mixed-currency, partial, error banners | `Alert` |
| Invoice table | `Table`, `THead`, `TBody`, `TR`, `TH`, `TD` |
| Discard dialog | `Modal` |
| Loading / empty | `Spinner`, `EmptyState`, `components/feedback/*` |
| Buttons, links | `Button` |
| **New composition:** Order search list with eligibility reasons | `Input` + popover list, following the SearchPicker of `mock/fro-350-export-create` (`export-ui-parts.tsx`); no catalogue component lists disabled options with reasons. |
| **New composition:** Totals footer row | `table.tsx` has no footer part; one `tfoot` row on the same column grid. |

**Prepared frontend branch:** `mock/fro-353-customs-storage-entry-create` (when published) holds unmounted components on UI view models under `frontline-forwarding-client/src/features/customs-storage/create/`, with a README listing the FRO-319 reads it waits for. A local static preview built from the production tokens is in the planning repository (`previews/fro353`); it is not published, and this description is the contract. The ChatGPT-hosted preview attached earlier needs a sign-in, predates these rules and is historical reference only.

Gotcha: FRO-358 has no milestone while this ticket is 0.0.11, so the page has no menu entry until FRO-358 ships.

## Post-deployment verification (read-only)

| Criteria | Check |
| -- | -- |
| 1, 2 | Open the page from a seeded eligible Order's Details, from an ineligible one, from a covered child, and by direct route; as a staff user without create authority and as a partner test user. Do not submit. |
| 3 | Search seeded Orders by Stock ID, vessel and colli code; compare listed reasons and their order in EN and EL with FRO-319's eligibility read. |
| 4, 5, 7 | Select seeded Orders with and without weight, depositor, Supplier and a single licence; compare displayed values and prefill with the Order, warehouse and company records. |
| 6, 10 | Enter a future date-time, a future MRN date and a non-digit tariff code; check messages and focus. Switch tabs and language; press Cancel and Keep editing. Never press Create in production. |
| 8, 9 | Compare invoice rows, per-row Statistical VAT, Totals (all-EUR fixture €803.62 → €192.87), the mixed-currency fixture and Export facts with their owning records. |
| 11 | Review staging test evidence for created, rejected, concurrent, failed and lost-response outcomes. |
| 12 | Check EN/EL, keyboard use and a 400px viewport. |

**Reference:** [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319) (rules — blocks this) · [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355) (Order Details card — blocked by this) · [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354) (details page) · [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358) (list and menu) · [FRO-350](https://linear.app/front-line-ltd/issue/FRO-350) (search picker pattern) · [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352) (saved-record style) · [FRO-248](https://linear.app/front-line-ltd/issue/FRO-248) historical.
