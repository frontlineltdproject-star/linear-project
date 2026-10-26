**As a** Frontline operator **I want** one Create Export page that finds a Shipment's Exports, lets me review the invoices and enter the declaration facts **so that** I create exactly one correct **Export Customs Declaration (Export)** per fiscal group.

FRO-317 owns the Export entity, grouping, eligibility, lifecycle, protocol and authorization rules. This ticket owns how the creation page presents and applies them. Terms: **Order = purchase order = stock-list item; colli = handling unit; Supplier Invoice** is the former VAT item (FRO-321).

## Entry and page

* Route: one creation page that accepts an optional **preselected Shipment**. Opened without one, it starts empty; opened with one, it runs the same lookup as a search selection.
* The **Create Export** buttons on the Exports list and on Shipment Details are not part of this ticket (follow-up tickets). Until they exist, the page is reachable only by its route.
* Access: users with the FRO-317 Export create authority (Frontline operators and managers). Others see the standard access-denied state; partner users never see the page, its search results or its messages.
* TopBar: title **Create Export / Δημιουργία εξαγωγής**, one-line description, actions **Cancel** (secondary) and **Create Export** (primary). Both actions are available from every tab.

Four tabs, in this order; **Overview** is active on entry.

| Tab | Contents |
| -- | -- |
| **Overview / Επισκόπηση** | Cards **Shipment relationship → Export scope → Export details**. |
| **Supplier Invoices & Orders (N) / Τιμολόγια προμηθευτών και παραγγελίες (N)** | Cards **Supplier invoices** (editable selection) and **Connected Orders** (derived, read-only). N = selected-invoice count. |
| **VAT Exemption Protocol / Πρωτόκολλο απαλλαγής ΦΠΑ** | Eligibility and provisional protocol fields. |
| **Documents (N) / Έγγραφα (N)** | Staged attachments. N = staged-file count. |

Switching tab or language keeps the whole draft: Shipment, scope, MRN/date, Delivered vessel, Customs status and EAD date, selected invoices, staged files and expanded previews. Tabs support Left/Right/Home/End keys, visible focus, and narrow layouts without page-wide horizontal scrolling.

## Overview

### Shipment relationship

| Field | Type / format | Rules |
| -- | -- | -- |
| **Search Shipment / Αναζήτηση αποστολής** | Search combobox | Placeholder **Search AWB, CMR, B/L or Shipment number…**. Matches **Shipment number** or **transport document number**, partial and case-insensitive. Results exclude **CANCELLED** Shipments. Each result shows document type/number prominently and Shipment number beneath; a Shipment without a document shows **Not recorded**. |
| **Shipment number / Αριθμός αποστολής** | Read-only, link | Fills on selection; links to Shipment Details. |
| **Document type / Τύπος εγγράφου** | Read-only | AWB / CMR / B/L from the Shipment, or **Not recorded**. |
| **Document number / Αριθμός εγγράφου** | Read-only | From the Shipment, or **Not recorded**. |

* Picker behaviour follows FRO-347: popup as wide as the field, overlays the form, scrolls, opens on focus/click, closes on outside click, focus leaving or **Escape**; Arrow Down moves into results.
* Typing or dismissing the search never changes the selected Shipment. Selecting a different Shipment runs a new lookup; if the invoice selection was edited, the replace confirmation (below) applies first.
* The three read-only fields share one desktop row and stack on narrow screens.

### Export scope

The lookup groups the Shipment's non-cancelled participating Orders into candidate Exports (FRO-317). It returns candidates and suggestions only; nothing is saved.

**Table columns:** **Export type → Shipper → Shipper ΑΦΜ → Suggested invoices → Action → Preview invoices**.

| Row state | Action column |
| -- | -- |
| Eligible, not selected | **Select / Επιλογή** (secondary button). |
| Eligible, selected | **Selected / Επιλεγμένο** (primary button, row highlighted). Pressing it again changes nothing. |
| Group already has an active Export | **Open existing Export** + its Export ID. No creation. |
| Blocked by data | **Blocked** pill, plus a full-width message row naming the Order and Company to correct. |

* **Blocked** reasons (FRO-317): Order without Invoicing company; Invoicing company without ΑΦΜ; foreign procedure Order without Supplier or Supplier without ΑΦΜ; FOREIGN Invoicing company sharing a VAT number with another FOREIGN Company; FOREIGN Invoicing company with FOREIGN Supplier. A missing ΑΦΜ cell shows **Missing value**; never the foreign recipient's identifier and never a Client fallback.
* Exactly one eligible candidate → selected automatically. Several → **Several Exports were found. Select the one to create.**
* Selecting a scope fills the derived Export details fields and replaces the invoice selection with that candidate's suggestions. Selection stays on Overview.
* **Preview invoices / Προεπισκόπηση τιμολογίων** (every row, collapsed initially, including an auto-selected row): a keyboard-operable toggle with chevron, `aria-expanded` / `aria-controls`, focus stays on it. Expanding shows a read-only **Suggested invoices** table directly below the row, spanning the table: **Invoice number**, **Supplier**, **Linked Order** (the invoice's actual Order, also for ancestor matches), both as links. Empty → **No invoices are suggested for this Export.** Expanding never selects a candidate or changes the draft. Expanded state is kept per Shipment and candidate; new candidates start collapsed.
* **Loading:** a centred spinner with an accessible status **Finding Exports for this Shipment**; the card keeps its previous height until results are ready; old rows are not shown and **Create Export** is disabled.
* **Empty:** **This Shipment has no participating Orders yet. Add Orders to the Shipment before preparing an Export.**
* **Error:** **Exports could not be loaded for this Shipment.** with **Retry**.
* Tables scroll inside their card on narrow screens.

### Export details

| Field | Type / format | Rules |
| -- | -- | -- |
| **Export type / Τύπος εξαγωγής** | Read-only — **Greek invoicing company / Ελληνική εταιρεία τιμολόγησης** · **Foreign invoicing company / Εταιρεία τιμολόγησης εξωτερικού** | From the selected scope. Blank before selection; cleared when the Shipment changes; unchanged by invoice edits. No Mixed type. |
| **Shipper / Αποστολέας** | Read-only Company name | Invoicing company (Greek) or Supplier (foreign), from the same Company as the scope row. |
| **Shipper ΑΦΜ / ΑΦΜ αποστολέα** | Read-only, mono | That Company's `vatNumber`. |
| **MRN** | String — 18 characters, required | Trimmed and shown in upper case. Exactly 18 letters or digits. Unique across all Exports including cancelled ones (server check). |
| **MRN date / Ημερομηνία MRN** | DatePicker, required | Not later than today (Europe/Athens). |
| **Delivered vessel / Πλοίο παράδοσης** | Combobox (all Vessels), optional single selection | Starts blank; can be set, changed or cleared. Export-owned: never filled from the Shipment, Order, invoice or scope. |

Desktop rows: **Export type → Shipper → Shipper ΑΦΜ**, then **MRN → MRN date → Delivered vessel**; the grid wraps on narrow screens. MRN, MRN date and Delivered vessel survive Shipment and scope changes and failed saves.

**Customs status block** (below the fields, FRO-348 VAT-status presentation):

* **Customs status / Κατάσταση τελωνείου** selector, semibold, max 400px wide: **Awaiting EAD / Αναμονή EAD** (default) or **Awaiting IE599 / Αναμονή IE599**. **Completed / Ολοκληρώθηκε** is never selectable at creation.
* Three-step indicator **Awaiting EAD → Awaiting IE599 → Completed**, numbered, teal for completed and current steps.
* Two equal date columns (28px column / 18px row gap; stacked on narrow screens):

| Status | **EAD receipt confirmation date / Ημερομηνία επιβεβαίωσης παραλαβής EAD** | **Positive IE599 confirmation date / Ημερομηνία επιβεβαίωσης θετικού IE599** |
| -- | -- | -- |
| **Awaiting EAD** | Blank, disabled, not submitted | Blank, disabled |
| **Awaiting IE599** | Required DatePicker: not earlier than the MRN date, not later than today (Europe/Athens) | Blank, disabled |

* With Awaiting IE599, a hint reads **Creating at Awaiting IE599 confirms EAD receipt in your name.** Create then records the EAD confirmation with the authenticated user and time (FRO-317). No reference field, checkbox or required attachment.
* Changing the draft back to Awaiting EAD clears the EAD date.

## Supplier Invoices & Orders

### Supplier invoices

The **Informative List**: the invoices this Export declares. Before a scope is selected: **Select an Export scope to see its invoices.**

| Column | Content |
| -- | -- |
| **Invoice number** | Link to the invoice. **Paperwork only / Μόνο έγγραφα** badge when the invoice's Order has no collis in this Shipment. |
| **Supplier** | The invoice's Supplier (from its Order). |
| **Linked Order** | Link to the invoice's actual Order. |
| **Invoice type** | FRO-321 type name. |
| **VAT exemption status** | The invoice's current status (FRO-321), e.g. **Not started** / **Not required**. |
| **Source** | **Direct · {participating Order}**, **Ancestor of {participating Order}**, or **Added** for a manual addition. |
| Remove | Icon button with label **Remove {invoice}**; focus moves to the next row's Remove or to Add invoice. |

* **Add invoice / Προσθήκη τιμολογίου**: search combobox (invoice number, Supplier or Order), same picker behaviour as the Shipment search. Every match is listed; ineligible ones are disabled with their reason:

| Reason | When (FRO-317) |
| -- | -- |
| **Already selected** | In this draft. |
| **In {Export ID}** | Selected in another non-cancelled Export. |
| **Cancelled invoice** | Invoice cancelled. |
| **Different Invoicing company** | Its Order's Invoicing company differs from the scope. |
| **Different Supplier** | Foreign scope; its Order's Supplier differs. |
| **Invoice type not allowed for this Export type** | Greek: Υ.Δ. and storage only. Foreign: storage and Greek Supplier – Foreign Recipient (MRN) only. |
| **Entry Note {number} storage invoices are in {Export ID}** | Would split one Entry Note's storage invoices across Exports (FRO-319). |

* Empty selection: Greek scope → **No invoices selected. A Greek invoicing company Export needs at least one invoice.**; foreign scope → **No invoices selected. A Foreign invoicing company Export can be created without invoices.**
* Adding or removing invoices immediately updates the tab count, Connected Orders and the VAT Exemption Protocol tab. It never changes Export type, Shipper or the scope.

### Connected Orders

Derived from the selected invoices; each Order once. Columns, aligned and evenly distributed: **Order** (link), **Supplier**, **Invoicing company**, **Vessel** (the Order's vessel, not invoice or Delivered vessel), **Selected invoices** (count). Missing values show **—**. No expansion, colli list, lineage or editing. Empty: **No connected Orders.** Scrolls inside the card on narrow screens.

## VAT Exemption Protocol

| State | Card content |
| -- | -- |
| No scope selected | **Select an Export scope first.** |
| No selected invoice of type **Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)** | Info alert **VAT exemption procedure is not required** and the reason. No protocol fields. |
| At least one Υ.Δ. invoice selected | Read-only **Protocol number · provisional** and **Protocol date · provisional**, both **Assigned on creation**. |

Nothing is reserved while preparing; the number and date are allocated only by a successful Create when the procedure is required (FRO-317). Stamping actions belong to the saved Export (FRO-352).

## Documents

The **Attachments** card follows FRO-347: **Choose files**, file rules (PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV or TXT · up to 25 MB · nonempty · filename 1–255 characters), staged rows with **Remove**. Files stay in the browser until the Export exists; they upload to it after creation.

## Create, outcomes and cancel

**Create Export** runs these checks in order and, on failure, shows **Fix the highlighted fields to create the Export.**, opens the tab of the first error and focuses its field:

| Check | Message | Tab / focus |
| -- | -- | -- |
| No Shipment | **Select a Shipment.** | Overview / search |
| No scope | **Select an Export scope.** | Overview / scope card |
| MRN missing / format / used | **Enter the MRN.** · **The MRN must be exactly 18 letters or digits.** · **This MRN is already used by {Export ID}.** | Overview / MRN |
| MRN date missing / future | **Enter the MRN date.** · **The MRN date cannot be later than today.** | Overview / MRN date |
| EAD date (Awaiting IE599) | **Enter the EAD receipt confirmation date.** · **…cannot be earlier than the MRN date.** · **…cannot be later than today.** | Overview / EAD date |
| Greek scope without invoices | **Select at least one invoice for a Greek invoicing company Export.** | Supplier Invoices & Orders / Add invoice |

The server rechecks everything (FRO-317); its field errors map to the same messages. While saving, the button reads **Creating…** and is disabled.

| Outcome | Page behaviour |
| -- | -- |
| **Created** | The form is replaced by a result: **Export {ID} created**, key facts (Shipment, Export type, MRN, Customs status, invoice count, protocol number or **None**) and **Open Export** (FRO-352). Staged files upload to the new Export; each shows **Uploaded** or **Upload failed** with **Retry**. Retrying uploads never creates another Export. |
| **Group already has an Export** (concurrent creation) | Warning **An Export already exists for this group: {ID}. Your draft is kept.** with **Open {ID}**. |
| **Outcome unknown** (network/timeout) | **We could not confirm whether the Export was created.** with **Check original attempt**; draft and files kept; no second Create until resolved. |
| **Failed** | **The Export could not be created. Nothing was saved and your draft is kept. Try again.** |

* **Replace confirmation:** after editing the invoice selection, choosing another scope or Shipment asks **Replace the edited invoice selection?** (**Replace selection** / **Keep current selection**). Keeping it changes nothing. Replacing resets only the scope and invoices; MRN, dates, vessel, Customs status and documents stay.
* **Cancel:** with any draft input, confirm **Discard this Export draft?** (**Discard draft** / **Keep editing**); leaving the page with a draft triggers the browser's unsaved-changes warning. Cancelling records nothing.

## Decisions

| Decision | Reason |
| -- | -- |
| FRO-317 is the authority; this page applies its rules as on-page checks and maps server errors | One rule set for UI and server. |
| Search by Shipment number or transport document; exclude cancelled Shipments | Matches the production search; cancelled Shipments cannot have Exports. |
| Entry buttons on the Exports list and Shipment Details are follow-ups | FRO-317 leaves both unowned; this ticket delivers the page and its preselection input. |
| After Create, show the result and open the saved Export; upload staged files then | Attachments need a saved owner; retries must not duplicate the Export. |
| Concurrent duplicate returns the existing Export with Open | FRO-317 returns the existing Export instead of creating a second one. |
| Ineligible invoices stay visible with a reason | Operators see why an invoice cannot be added instead of searching blind. |
| Source column and Paperwork only badge in Supplier invoices | Ancestor matches and paperwork-only invoices need review before declaring. |
| EAD receipt confirmation date not later than today | Same rule as the MRN date; a future confirmation is impossible. |

## Out of scope

Saved Export details, editing, cancellation and stamping (FRO-352); the Exports list page and both Create Export entry buttons; Informative List, Proof of delivery and Pending invoices prints; any backend, API or schema work (FRO-317 / FRO-321 / FRO-319); Shipment Details redesign (FRO-316).

## Acceptance criteria

1. Opening the route without a Shipment starts empty; with a preselected Shipment it fills the three Shipment fields and runs the lookup. Both paths behave the same afterwards.
2. Search finds the same Shipment by partial Shipment number and partial transport document number in any case; cancelled Shipments never appear; a Shipment without a document is findable by number and shows **Not recorded**. Typing or dismissing the search keeps the current selection.
3. One eligible candidate is auto-selected; several require a choice; a group with an active Export shows **Open existing Export**; each blocked reason shows **Blocked** and names the Order and Company. Grouping follows the Invoicing company, never the Client.
4. Loading keeps the card height, hides old rows, announces status and disables Create; empty and error states show their messages; **Retry** reruns the lookup.
5. Preview invoices starts collapsed on every row, expands below its row with Invoice number / Supplier / Linked Order, and never changes the selection or draft. Its state survives tab and language changes.
6. Export type, Shipper and Shipper ΑΦΜ fill from the selected scope, clear on Shipment change and ignore invoice edits.
7. MRN is shown in upper case and rejected unless it is 18 letters or digits and unused; MRN date cannot be in the future.
8. Delivered vessel is optional, selectable from all Vessels, clearable, and never filled automatically.
9. Customs status offers only Awaiting EAD and Awaiting IE599. Awaiting IE599 requires an EAD date between the MRN date and today; switching back clears it. The positive IE599 date is always disabled.
10. Supplier invoices show the seven columns, the Source and the Paperwork only badge. Add invoice lists ineligible matches disabled with the reasons in the table above.
11. Connected Orders list each Order of the selected invoices once with the five columns; removing an Order's last invoice removes it.
12. The VAT tab shows the three states; adding or removing a Υ.Δ. invoice switches between Not required and the provisional fields immediately. No protocol is consumed before Create.
13. Create shows the first error's tab and focuses its field; a Greek scope without invoices is blocked; a foreign scope without invoices is allowed.
14. Successful Create shows the result, uploads staged files with per-file Retry, and **Open Export** opens the saved Export. Duplicate, unknown and failed outcomes keep the draft and match the outcome table.
15. Replace and Cancel confirmations behave as described; keeping the selection or editing changes nothing.
16. All labels exist in EN and EL; the page works with keyboard only, shows visible focus, and has no page-wide horizontal scrolling at 400px.

## Context for agents

Production `Frontline-Forwarding/frontline-forwarding`, reviewed through `gh` at **main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a** (26 October 2026). The Export, Supplier Invoice and Entry Note contracts do not exist on main yet.

| Source | Implementation context |
| -- | -- |
| `frontline-forwarding-app/.../domain/shipments/ShipmentRepository.java` (`searchCondition`), `ShipmentFilter.java` | Search matches `shipment_number` or `transport_document_number` (contains, case-insensitive); `statuses` filter can exclude CANCELLED. |
| `docs/reference/database.md` — `freight_shipment` | `shipment_number` unique, generated; transport document type/number are null while PREPARING. |
| `frontline-forwarding-client/src/features/companies/graphql/list-vessels.graphql`; `web/vessels/VesselsGraphQlApi.java` | `vessels` returns all Vessels (id, name) for the Delivered vessel combobox. |
| `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css`, `src/components/ui/` | Card, Tabs, Table, Button, Input, Combobox, DatePicker, Select, Badge/StatusPill, Alert, Modal, Toast; TopBar in `src/components/layout/top-bar.tsx`. Use semantic tokens only. |
| `features/attachments/types.ts` | Attachments support Order/Shipment owners only; Export ownership comes from FRO-317. |
| Branches `mock/fro-347-supplier-invoice-create`, `mock/fro-348-supplier-invoice-details` | Picker, document queue and three-step status presentation reused here; not on main. |

The attached chatgpt.site creation preview requires a ChatGPT sign-in and the FRO-317 scenario previews and retained-requirements document predate the FRO-317 rewrite: historical references only. This description is the contract.

Gotchas: the production `Tab` component has no arrow-key navigation; add it locally as FRO-347 did. Visually hidden table headers need the scroll container to be the positioning context, or they cause page-wide overflow on narrow screens. Fixture data and the static preview are review aids, not runtime dependencies.

## Post-deployment verification

Read-only, against seeded test records. Never save an Export in production to verify.

| Criteria | Read-only check |
| -- | -- |
| 1–2 | Open the page empty and with a seeded Shipment preselected; search by part of its number and of its document number; confirm a seeded cancelled Shipment is absent. Do not press Create. |
| 3–6 | Open the seeded Greek, two-Greek, mixed (existing / foreign / blocked) and preparing Shipments; compare candidates, actions, blocked messages, previews and derived fields with the fixture expectations. |
| 7–9, 13 | Enter invalid MRN/dates and press Create on a test environment only; confirm messages and focus. In production, inspect field constraints without submitting. |
| 10–12 | Open the invoice tab for seeded scopes; compare columns, Source, Paperwork only, picker reasons, Connected Orders and VAT state. |
| 14 | Read a seeded created Export and its files through FRO-352; review the test results for duplicate, unknown and failed outcomes. |
| 15–16 | Check confirmations, EN/EL labels, keyboard navigation and 400px layout without saving. |

**Reference:** FRO-317 (entity and rules), FRO-321 (Supplier Invoice), FRO-319 (Entry Note), FRO-347 / FRO-348 (presentation patterns), FRO-352 (saved Export page).
