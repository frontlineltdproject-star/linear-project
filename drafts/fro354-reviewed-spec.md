**As a customs operator I want one page that shows a saved Customs Storage Entry (Δελτίο Εισόδου) and lets me correct it** so that the entry's own customs facts stay right, while parties, quantities, invoices and Export keep coming from their owning records.

**Order = purchase order = stock-list item; colli = handling unit.** This ticket owns the saved-entry page only. Every business rule — eligibility, coverage, derived values, validation, Change Order, access, audit — belongs to [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319); the page consumes it and never re-implements it. Creation is [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353), the Order Details shortcut is [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355), and the entries list, register and prints are [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358). Supplier Invoice ([FRO-321](https://linear.app/front-line-ltd/issue/FRO-321)) and Export ([FRO-317](https://linear.app/front-line-ltd/issue/FRO-317)) are planned entities; existing Order invoice rows are not Supplier Invoices.

## Entry points and access

| Entry | Behavior |
| -- | -- |
| **Order Details → Open Customs Storage Entry** ([FRO-355](https://linear.app/front-line-ltd/issue/FRO-355)) from the owning Order | Opens the entry with that Order as return context. |
| **Order Details → Open** from a covered child (split after admission, including grandchildren) | Opens the **same** entry with the child as return context and the covered-child banner (below). |
| **Successful creation** ([FRO-353](https://linear.app/front-line-ltd/issue/FRO-353)) | Opens the new entry with toast **Customs Storage Entry {number} created. / Το Δελτίο Εισόδου {number} δημιουργήθηκε.**; from Order Details it keeps that Order as return context. |
| **Open** links on FRO-353 / FRO-354 search reasons, later the [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358) list | Opens the entry without return context. |

* Users with Customs Storage Entry view authority see the page. Users without edit authority see every value and no Edit controls. Users without view authority see **You do not have permission to view Customs Storage Entries. / Δεν έχετε δικαίωμα προβολής Δελτίων Εισόδου.** Partner users (client, supplier, agent) never reach the page.
* Opening the page is read-only and records no event.
* Page states: loading (skeleton); load failure **Could not load the entry. / Δεν ήταν δυνατή η φόρτωση του δελτίου.** + **Retry / Επανάληψη**; not found **Customs Storage Entry {number} was not found. / Το Δελτίο Εισόδου {number} δεν βρέθηκε.** A failed or denied read is never shown as "not found".

## Header

* Title **Customs Storage Entry {number} / Δελτίο Εισόδου {number}** (number as stored, not zero-padded). Subtitle **Order {Stock ID} · {entry date dd/mm/yyyy hh:mm}** with the owning Order.
* **Back to Order {Stock ID} / Επιστροφή στην παραγγελία {Stock ID}** only when the page was opened with return context; it goes to that Order (the child when opened from a child). Without return context there is no back link.
* No status, active-case badge, Create, Save or page-level Edit. The **Print / Εκτύπωση** action belongs to [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358), which adds it at the right of the header for users with view authority; this ticket leaves that place free.

**Covered-child banner** (info, above the tabs): **Opened from Order {child Stock ID}, which is covered by this entry (split after admission). The entry belongs to Order {owner Stock ID}. / Άνοιγμα από την παραγγελία {child}, που καλύπτεται από αυτό το δελτίο (διαχωρισμός μετά την παραλαβή). Το δελτίο ανήκει στην παραγγελία {owner}.** Every value on the page stays the owning Order's: original admitted collis and weight, parties, invoices and Export. Nothing is relinked, copied or aggregated from the family.

## Page structure

One outer card with three tabs in this order; Overview opens first. Same structure, labels and field order as [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353).

| Tab | Contents |
| -- | -- |
| **Overview / Επισκόπηση** | Card **Order relationship**, then card **Customs Storage Entry details** with three sub-cards: **Entry details → Goods and transport → Warehouse operator**. |
| **Related Supplier Invoices ({n}) / Σχετικά τιμολόγια προμηθευτών ({n})** | Read-only invoice table; n = matching invoices. |
| **Related Export / Σχετική εξαγωγή** | Read-only Export facts. |

Saved values use the softly bordered light-grey read-only fields of [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348) / [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352); a blank value shows **—**; dates dd/mm/yyyy. Read-only fields have no asterisks or placeholders. There is no Additional details tab, Notes field, entry status, entry type or attachments area.

## Order relationship

Read-only, same fields as FRO-353: **Stock ID** (link to Order Details), **Admitting warehouse · admission**, **Admitted collis** (original admission, including collis later moved to covered children), **Gross weight** (kg, 2 decimals; **Unknown / Άγνωστο** marker when FRO-319 reports it unknown), **Depositor (Invoicing company)** and **Depositor ΑΦΜ**, **Operational Client**, **Supplier** and **Supplier ΑΦΜ** (**Missing / Λείπει** marker when absent).

**Edit / Επεξεργασία** (top right, edit authority) opens **Change Order** inside the card:

* One search field, the same as FRO-353: existing Order search text (Stock ID, message number, owner and supplier reference, vessel name, colli tracking code) through FRO-319's **Order search for entry creation**. Client, Supplier and invoice number are not searched. Each result shows Stock ID, Order status pill, Client and Supplier.
* Eligible matches can be selected with mouse or keyboard (Arrow keys, Enter, Escape). Ineligible matches stay listed, cannot be selected and show one reason. Two reasons are specific to this page and come first:

| Reason | EN | EL |
| -- | -- | -- |
| The entry's current owning Order | Current Order of this entry | Τρέχουσα παραγγελία του δελτίου |
| An Order covered by this entry (split after its admission) | Covered by this entry (split after admission) | Καλύπτεται από αυτό το δελτίο (διαχωρισμός μετά την παραλαβή) |
| Every other reason | FRO-353's reason table and order (cancelled → not Customs Storage → not admitted → admitted under another Order → already covered by another entry + **Open**) | as FRO-353 |

* Search states as FRO-353: **Loading…**, **No Orders match your search.**, **Could not search Orders.** + **Retry**; stale responses are ignored. The chosen Order stays visible in the field; typing clears the choice.
* **Save** is enabled once an eligible Order is chosen and opens the dialog **Change Order to {Stock ID}? / Αλλαγή παραγγελίας σε {Stock ID};** with **Collis, weight, parties, invoices and Export will be read from Order {Stock ID}. The entry number and the entry's own fields stay the same. / Κόλα, βάρος, μέρη, τιμολόγια και εξαγωγή θα διαβάζονται από την παραγγελία {Stock ID}. Ο αριθμός και τα στοιχεία του δελτίου δεν αλλάζουν.** and **Cancel / Άκυρο** · **Confirm change / Επιβεβαίωση αλλαγής**. No impact breakdown or before/after comparison.
* When the chosen Order's admitting warehouse differs from the current one, the dialog adds a warning: **Order {Stock ID} was admitted at {warehouse}. The warehouse operator values on this entry are not changed. / Η παραγγελία {Stock ID} παραλήφθηκε στην {warehouse}. Τα στοιχεία διαχειριστή αποθήκης του δελτίου δεν αλλάζουν.**
* Cancel, Escape or the backdrop close the dialog without saving and return focus to Save.
* **Confirm change** sends the new Order and the version read (FRO-319 Change Order). On success the card returns to read-only, derived values, invoices, Export, tab count and subtitle refresh from the new owner, focus returns to **Edit**, and toast **Order changed to {Stock ID}. / Η παραγγελία άλλαξε σε {Stock ID}.** Entry number and entry-owned fields are unchanged.
* After a successful change to an Order admitted at a different warehouse, the **Warehouse operator** sub-card shows **The admitting warehouse is now {warehouse}. Warehouse operator values were kept; review them. / Η αποθήκη παραλαβής είναι πλέον η {warehouse}. Τα στοιχεία διαχειριστή αποθήκης διατηρήθηκαν· ελέγξτε τα.** until the page is reloaded.
* A server rejection (no longer eligible, already covered, denied) keeps the choice and shows the reason in the card. Return context is unchanged by a Change Order.

## Customs Storage Entry details

Read-only by default, in FRO-353's sub-card and field order. **Created by {user} · {date time} / Δημιουργήθηκε από {user} · {date time}** is shown as a caption under Entry details.

**Edit / Επεξεργασία** (top right, edit authority) turns all ten entry-owned fields into controls, prefilled with the saved values, with **Cancel / Save** at the bottom of the card:

| Sub-card | Field | Control and rules (as FRO-353) |
| -- | -- | -- |
| **Entry details** | Entry number | Always read-only. |
| | Entry date & time (required) | Date picker + time input; not later than now (Europe/Athens). |
| | Entry MRN | Text, ≤ 500, no format rule. |
| | Entry MRN date | Date picker; not later than today. |
| | Tariff classification code | 1–10 digits, leading zeros kept; hint **Digits only, up to 10 / Μόνο ψηφία, έως 10**. |
| **Goods and transport** | Goods description for printed copies | Full-width multiline, ≤ 2,000. |
| | Transport means / number | Text, ≤ 500. |
| | Transport Company | Always read-only **FRONT LINE Forwarding & Agency LTD**. |
| **Warehouse operator** | Permit number, Operator name, Operator ΑΦΜ, Warehouse address (full-width) | Text, ≤ 500 each. No "Prefilled from" hints on the saved page. |

* Validation messages are FRO-353's. On a failed check the card shows **Fix the highlighted fields. / Διορθώστε τα επισημασμένα πεδία.** and focuses the first invalid field.
* Save sends only these fields and the version read. Success: card back to read-only, focus on **Edit**, toast **Changes saved. / Οι αλλαγές αποθηκεύτηκαν.**
* Entry and Export MRN presence never lock editing; no lifecycle restriction exists.

## Editing rules (both cards)

* **One editor at a time.** While one card is in edit mode, the other card's **Edit** is disabled with **Save or cancel the current edit first. / Αποθηκεύστε ή ακυρώστε πρώτα την τρέχουσα επεξεργασία.**
* **Cancel** or **Escape** discards the card's draft and returns focus to its **Edit**.
* **Failed save:** **Changes could not be saved. Nothing changed. Your edits are kept. / Δεν ήταν δυνατή η αποθήκευση. Δεν άλλαξε τίποτα. Οι αλλαγές σας διατηρούνται.**
* **Stale save:** **This entry changed since you opened it. Refresh to review the latest version. Your edits are kept. / Το δελτίο άλλαξε από τότε που το ανοίξατε. Ανανεώστε για να δείτε την τελευταία έκδοση. Οι αλλαγές σας διατηρούνται.** + **Refresh / Ανανέωση**.
* An open draft survives tab and language changes and every rejected save.
* Leaving with an open, changed draft: **Back to Order** opens **Discard your changes? / Απόρριψη των αλλαγών;** — **Your unsaved changes will be lost.** — **Keep editing / Συνέχεια επεξεργασίας** · **Discard / Απόρριψη**; other navigation shows the browser's leave-page warning.
* Invoice and Export facts are corrected on their own pages ([FRO-348](https://linear.app/front-line-ltd/issue/FRO-348), [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352)); this page has no invoice or Export editor and never changes another record.

## Related Supplier Invoices

Same table as FRO-353, for the owning Order, read-only. Subtitle **Active invoices of type Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) on the owning Order.** Columns: Invoice ID (link to FRO-348), Invoice number, Invoice date, Supplier, Invoice type, Currency, Net value, Actual VAT, **Statistical VAT (hypothetical, 24%)** — amounts in each invoice's own currency; per row 24% × net, half-up, 2 decimals.

* **Totals** footer only when every row is EUR: total net, total actual VAT and total Statistical VAT (24% × total net, rounded once). Example **€803.62 → €192.87**, actual VAT **€0.00**.
* Not all EUR: no Totals row and **Mixed or non-EUR currency: totals and total Statistical VAT are not shown.**
* Note: **Statistical VAT is reporting information only. It is not VAT charged or payable.**
* No matching invoices: **This Order has no matching invoices yet. / Η παραγγελία δεν έχει ακόμη αντίστοιχα τιμολόγια.**
* The table scrolls horizontally inside its card on narrow screens.

## Related Export

Same as FRO-353: **Export** (link to FRO-352), **Export MRN**, **Export MRN date**, **Customs status** pill (**Awaiting EAD / Awaiting IE599 / Completed**), caption **Read from the Export. Change it on the Export page.** Cases: no matching invoices → **No matching invoices, so no Export.**; none in an Export → **None of the matching invoices is in an Export yet.**; partial → the Export's facts plus **{n} of {m} invoices are in this Export.** There is no conflicting-Export state, Export picker, IE599 field or Customs action.

## Acceptance criteria

1. From the owning Order, a covered child and successful creation the page opens the same entry with the right return context; from a child the banner names child and owner and all values are the owner's. Opening records nothing.
2. View authority shows the page; without edit authority no Edit control appears; without view authority the denied message shows; partners cannot reach it. Loading, load error with Retry and not found behave as specified.
3. The header shows title, subtitle and Back to Order only with return context; no status, active badge or page-level action; the Print place is left for FRO-358.
4. Three tabs, two Overview cards and three sub-cards appear in FRO-353's order with saved-value styling; no Notes, status, entry type or attachments.
5. Entry details Edit changes only the ten entry-owned fields with FRO-353's validation; entry number and Transport Company stay read-only; Created by is shown.
6. Change Order search uses the existing search fields; the current Order and Orders covered by this entry cannot be picked and show their reasons; other reasons follow FRO-353.
7. The confirmation names the chosen Order and warns when its admitting warehouse differs; Cancel/Escape changes nothing; success refreshes derived values, invoices, Export and subtitle, keeps entry number and entry-owned fields, and shows the warehouse review notice when the warehouse changed.
8. Only one card can be edited at a time; Cancel/Escape restore saved values; failed and stale saves keep the draft; drafts survive tab and language changes; leaving with a changed draft asks first.
9. Invoice rows, per-row Statistical VAT, the all-EUR Totals (€803.62 → €192.87), the mixed-currency message and the empty state match FRO-353.
10. The Export tab shows the one Export's facts and status, "n of m" for partial assignment and the two empty explanations; no editor.
11. EN/EL strings are complete; tabs (arrow keys), search list and dialogs work by keyboard with focus kept in the dialog; at 400px nothing overflows the page and the invoice table scrolls inside its card.

## Decisions

| Decision | Reason |
| -- | -- |
| Change Order uses FRO-353's search fields and reasons | Production search does not match Client, Supplier or invoice; one eligibility read keeps page and server in agreement. |
| "Current Order of this entry" and "Covered by this entry" reasons | FRO-319's generic "already covered" reason would point the operator to the entry they are on. |
| One card in edit mode at a time | Each save carries the entry version; a second open draft would always be rejected as stale. |
| Change Order keeps warehouse operator values, with a warning when the warehouse differs | FRO-319 keeps entry-owned values; the operator must see that they may no longer match. |
| Simple confirmation without impact breakdown | The derived values refresh on screen right after the change. |
| Covered-child banner, owner's values, Back to the child | The operator sees why a different Order's entry opened and returns where they started. |
| Title by entry number, subtitle Order · date, no active badge | Same as FRO-358's list (no status badge); active is a register query, not an entry field. |
| Created by caption from the FRO-319 audit | Operators can see who issued the entry without an audit-history view. |
| Print place reserved; FRO-358 adds the button | FRO-358 owns the copies and has no milestone yet; one owner for printing. |
| All ten entry-owned fields editable with FRO-353's rules | Same rules on creation and correction; FRO-319 allows edits at any time. |
| FRO-352's failed/stale messages and leave confirmation | Same saved-record behavior across Customs pages. |

## Out of scope

Entity, eligibility, Change Order and audit rules and the reads ([FRO-319](https://linear.app/front-line-ltd/issue/FRO-319)); the creation page ([FRO-353](https://linear.app/front-line-ltd/issue/FRO-353)); the Order Details card ([FRO-355](https://linear.app/front-line-ltd/issue/FRO-355)); Print, recipient copies, list, register and menu ([FRO-358](https://linear.app/front-line-ltd/issue/FRO-358)); audit-history view; attachments; entry cancellation, reissue or deletion; editing invoices or Exports; search by Client, Supplier or invoice number.

## Context for agents

Live repository `Frontline-Forwarding/frontline-forwarding`, reviewed through authenticated `gh` at main **5c51030680c9d45b3827a7e19b8320c19aa5ed9a** on 27 October 2026. Customs Storage Entry, Supplier Invoice, Export, their authorities and reads do not exist yet.

| Source | Implementation context |
| -- | -- |
| [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319) | Reads by entry and by Order (direct or inherited, with owning Order), eligibility and **Order search for entry creation**, edit with version precondition, Change Order, view and create/edit authorities. **Created by** needs the entry read to return the creating user and time from the audit record. |
| `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css` | Design authority: semantic tokens, teal = action only, mono for IDs/dates/money, sentence case, compact density. |
| `src/routes/secured/shipments/$shipmentId.tsx` | Details-route pattern: `TopBar`, `DetailLoadingPlaceholder`, `ErrorMessage` (`src/components/feedback/`); imports use the `#/` alias. |
| `src/features/shipments/components/delivery-notes-card.tsx` | `DatePicker` with `Input type="time"`. |
| `mock/fro-353-customs-storage-entry-create` (`src/features/customs-storage/create/`) | Order card, entry card, invoice table with totals footer, Export card, search picker and EN/EL labels this page reuses. |
| `mock/fro-352-export-details`, `mock/fro-348-supplier-invoice-details` | Saved-value fields and per-card Edit / Cancel / Save pattern. |

**Component map** (all from `src/components/ui/` unless marked):

| Element | Component |
| -- | -- |
| Title, subtitle, Back to Order | `components/layout/top-bar.tsx` (`TopBar`) |
| Outer card, cards, sub-cards | `Card`, `CardHeader`, `CardTitle`, `CardBody` |
| Tabs | `Tabs`, `TabList`, `Tab`, `TabPanel` (arrow keys added locally, as FRO-347/350/353) |
| Saved values, edit fields | `Input`, `Textarea`, `FormField`, `Label` |
| Entry date & time, MRN date | `DatePicker` + `Input type="time"` |
| Order status, Customs status, Unknown/Missing markers | `StatusPill`, `Badge` |
| Covered-child banner, warehouse notice, save errors | `Alert` |
| Invoice table | `Table`, `THead`, `TBody`, `TR`, `TH`, `TD` |
| Change Order confirmation, discard dialog | `Modal` |
| Loading, error, not found | `components/feedback/*`, `Spinner`, `EmptyState` |
| Edit, Save, Cancel, links | `Button` |
| **New composition:** Order search list with eligibility reasons | Same composition as FRO-353 (`Input` + popover list after FRO-350's SearchPicker); no catalogue component lists disabled options with reasons. |
| **New composition:** Totals footer row | Same `tfoot` row as FRO-353; `table.tsx` has no footer part. |

**Prepared frontend branch:** `mock/fro-354-customs-storage-entry-details` (when published) holds unmounted components on UI view models under `frontline-forwarding-client/src/features/customs-storage/details/`, built from main with its own copies of the FRO-353 parts and a README listing the FRO-319 reads it waits for and the parts to consolidate with `create/` once both are merged. A local static preview built from the production tokens is in the planning repository (`previews/fro354`); it is not published, and this description is the contract. The ChatGPT-hosted preview attached earlier needs a sign-in, predates these rules and is historical reference only.

Gotchas: FRO-358 has no milestone while this ticket is 0.0.11, so until FRO-358 ships the page has no Print and no list entry point. A post-admission split child keeps the parent's stock time; the page must never treat it as an owner (FRO-319).

## Post-deployment verification (read-only)

| Criteria | Check |
| -- | -- |
| 1, 3 | Open a seeded entry from its owning Order, a covered child and grandchild, and by direct link; compare entry ID, owner, values, banner and Back to Order. Do not edit. |
| 2 | Open as staff with view only, as staff without view authority and as a partner test user; open a missing entry number. |
| 4, 9, 10 | Compare every displayed field, invoice row, per-row Statistical VAT, Totals (€803.62 → €192.87), the mixed-currency fixture and Export facts with their owning records. |
| 5–8 | Open each Edit, enter invalid values, switch tab and language, press Cancel and Escape, open the Change Order dialog for an Order at another warehouse and press Cancel. Never press Save or Confirm in production; review staging evidence for saved edits, Change Order, failed and stale saves. |
| 11 | Check EN/EL, keyboard use and a 400px viewport. |

**Reference:** [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319) (rules — blocks this) · [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355) (Order Details card — blocked by this) · [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353) (creation page) · [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358) (Print, list) · [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352) / [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348) (saved-record style).
