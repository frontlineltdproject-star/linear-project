**As a** Frontline operator **I want** one Export details page that shows a saved **Export Customs Declaration (Export)**, lets me correct it while that is still allowed, confirm its Customs events and run its VAT exemption paperwork **so that** each declaration is tracked from MRN to stamped invoices in one place.

FRO-317 owns the Export entity, editing matrix, lifecycle, cancellation, protocol, ΥΔ printing and authorization rules; FRO-321 owns the invoice-owned stamping events. This ticket owns how the saved-Export page presents and applies them. It uses FRO-350's layout and FRO-348's saved-value card editing. Terms: **Order = purchase order = stock-list item; colli = handling unit; Supplier Invoice** is the former VAT item; **Informative List** = the Export's saved invoices.

## Entry and page

* Route: one details page per Export ID. Reached from FRO-350's **Open Export** result and from FRO-348's **Related Export** link. The Exports list and a Shipment Details Export section are follow-up tickets.
* Access: users with the FRO-317 Export view authority (Frontline staff). Users without edit/confirm authority see every value and no mutation controls. Partner users never see the page; others get the standard access-denied state.
* TopBar: title **Export {ID} / Εξαγωγή {ID}**, a Customs status pill (**Awaiting EAD / Αναμονή EAD**, **Awaiting IE599 / Αναμονή IE599**, **Completed / Ολοκληρώθηκε**), a **Cancelled / Ακυρώθηκε** pill when cancelled, and a subtitle **{Shipment number} · {Export type} · MRN {MRN}**. Page action: **Cancel Export** only (see Cancellation). No page-level Create, Save or Edit.
* Page states: loading placeholder; load failure with **Retry**; **Export not found.**; access denied. No sample data is ever shown in their place.

Four tabs, in this order; **Overview** is active on entry.

| Tab | Contents |
| -- | -- |
| **Overview / Επισκόπηση** | Cards **Shipment relationship → Export details** (with the Customs status block). |
| **Supplier Invoices & Orders (N) / Τιμολόγια προμηθευτών και παραγγελίες (N)** | Cards **Supplier invoices** and **Connected Orders**. N = saved invoice count. |
| **VAT Exemption Protocol / Πρωτόκολλο απαλλαγής ΦΠΑ** | Cards **Protocol Details → VAT Exemption Procedure**. |
| **Documents (N) / Έγγραφα (N)** | Export-owned files. N = saved file count. |

Switching tab or language keeps every open edit draft, stamping selection and dialog input. Tabs support Left/Right/Home/End keys and visible focus; no page-wide horizontal scrolling at 400px; wide tables scroll inside their card.

**Saved values** use FRO-348's softly bordered light-grey read-only fields; a missing value shows **—**. Read-only fields have no required asterisks or placeholders. Dates show as dd/mm/yyyy.

## Overview

### Shipment relationship

| Field | Type / format | Rules |
| -- | -- | -- |
| **Shipment number / Αριθμός αποστολής** | Read-only, link | Links to Shipment Details. |
| **Document type / Τύπος εγγράφου** | Read-only | AWB / CMR / B/L from the Shipment, or **Not recorded**. |
| **Document number / Αριθμός εγγράφου** | Read-only | From the Shipment, or **Not recorded**. |

One desktop row, stacked on narrow screens. No Edit: transport facts stay Shipment-owned and the Shipment cannot change.

### Export details

| Field | Type / format | Rules |
| -- | -- | -- |
| **Export type / Τύπος εξαγωγής** | Read-only — **Greek invoicing company** / **Foreign invoicing company** | Saved fiscal identity; never edited. |
| **Shipper / Αποστολέας** | Read-only Company name | Invoicing company (Greek) or Supplier (foreign). |
| **Shipper ΑΦΜ / ΑΦΜ αποστολέα** | Read-only, mono | That Company's `vatNumber`. |
| **Invoicing company / Εταιρεία τιμολόγησης** | Read-only Company name — **Foreign invoicing company Exports only** | The foreign recipient. Not shown on Greek Exports, where it equals the Shipper. |
| **MRN** | String — 18 characters | Shown in upper case. |
| **MRN date / Ημερομηνία MRN** | date | |
| **Delivered vessel / Πλοίο παράδοσης** | Optional single Vessel reference | Export-owned; **—** when blank. Never filled from Shipment, Order or invoice vessels. |

Desktop rows: **Export type → Shipper → Shipper ΑΦΜ (→ Invoicing company)**, then **MRN → MRN date → Delivered vessel**; the grid wraps on narrow screens. Company master-data changes never change what this card shows for a saved Export.

**Edit (Awaiting EAD only).** A top-right **Edit / Επεξεργασία** button (FRO-348 per-card pattern) turns only **MRN**, **MRN date** and **Delivered vessel** into controls in their own grid cells, prefilled with the saved values, with **Cancel / Save** below:

| Control | Type | Validation (FRO-317; rechecked on the server) |
| -- | -- | -- |
| **MRN** | Input, required | Trimmed and upper-cased on blur. **Enter the MRN.** · **The MRN must be exactly 18 letters or digits.** · **This MRN is already used by {Export ID}.** (unique across all Exports, including cancelled ones). |
| **MRN date** | DatePicker, required | **Enter the MRN date.** · **The MRN date cannot be later than today.** (Europe/Athens) |
| **Delivered vessel** | Combobox (all Vessels), optional | Set, change or clear. |

* Save sends only these three fields and the version the operator read. Failed save: **Changes could not be saved. Nothing changed. Your edits are kept.** Stale save: **This Export changed since you opened it. Refresh to review the latest version. Your edits are kept.** with **Refresh**. Success returns the card to read-only and focuses **Edit**.
* **Cancel** or **Escape** discards the card draft and returns focus to **Edit**.
* At Awaiting IE599 and Completed there is no Edit; a neutral note says **MRN, MRN date and Delivered vessel are locked after EAD receipt is confirmed. Changes need an audited correction.**

### Customs status block

Below the fields, FRO-348 status presentation:

* Top row: read-only semibold **Customs status / Κατάσταση τελωνείου** field (max 400px) and, on the right, the primary confirmation action (20px gap; wraps below at full width on narrow screens).
* Three-step indicator **Awaiting EAD → Awaiting IE599 → Completed**; not clickable.
* Two equal date columns: **EAD receipt confirmation date** and **Positive IE599 confirmation date**, each with the caption **Confirmed by {user} · {date time}** once recorded. They are never editable.

| Saved status | Action | Dialog |
| -- | -- | -- |
| **Awaiting EAD** | **Confirm EAD receipt / Επιβεβαίωση παραλαβής EAD** | Required **EAD receipt confirmation date**: not earlier than the MRN date, not later than today. |
| **Awaiting IE599** | **Confirm positive IE599 / Επιβεβαίωση θετικού IE599** | Shows the EAD date read-only. Required **Positive IE599 confirmation date**: not earlier than the EAD date, not later than today. Text: **Confirm only a positive, verified IE599 (confirmed exit).** |
| **Completed** | None | — |

* Both dialogs: date only, **Confirm / Cancel**; no reference field, checkbox or required attachment. Text: **Confirming records the date in your name and moves the Export to the next Customs status.**
* Messages: **Enter the … date.** · **…cannot be earlier than the MRN date.** · **…cannot be earlier than the EAD receipt confirmation date.** · **…cannot be later than today.**
* While an Export details or invoice edit is open, the action is disabled with **Save or cancel the current edit before confirming a Customs event.**
* Failed confirmation keeps the dialog, the entered date and **The confirmation could not be recorded. Nothing changed. Your date is kept.** Confirm is disabled while submitting (no duplicate events).
* Success records date, user and time together (FRO-317), refreshes status, dates and caption, and immediately applies the new stage's locks. Cancel or Escape records nothing and returns focus to the action.
* Customs events never change invoice VAT exemption status, membership, protocol, MRN, vessel or documents.

## Supplier Invoices & Orders

### Supplier invoices

The **Informative List**, subtitle **The Informative List: invoices this Export declares.**

| Column | Content |
| -- | -- |
| **Invoice number** | Link to the invoice. **Paperwork only / Μόνο έγγραφα** badge when its Order has no collis in this Export's Shipment. |
| **Supplier** | The invoice's Supplier (from its Order). |
| **Linked Order** | Link to the invoice's actual Order. |
| **Invoice type** | FRO-321 type name. |
| **VAT exemption status** | Current invoice status: **Not started / In progress / Exempted / Not required**. |

Empty: **No invoices on this Export.** (possible only for Foreign invoicing company Exports).

**Editing** uses FRO-350's inline pattern inside this card, with **Cancel / Save** at the bottom of the card:

| Stage | Card button | In edit mode |
| -- | -- | -- |
| **Awaiting EAD** | **Edit** | **Add invoice** picker and a **Remove {invoice}** icon button on every row. |
| **Awaiting IE599**, **Completed** | **Add invoice** | **Add invoice** picker; saved rows show a lock and no Remove; newly added unsaved rows can be removed. Hint: **Saved invoices stay on this Export after EAD receipt. You can only add invoices.** |

* **Add invoice** search (invoice number, Supplier or Order) lists every match; unavailable ones are disabled with their reason: **Already on this Export** · **In {Export ID}** · **Cancelled invoice** · **Different Invoicing company** · **Different Supplier** (foreign) · **Invoice type not allowed for this Export type** (Greek: Υ.Δ. and storage; Foreign: storage and Greek Supplier – Foreign Recipient (MRN)) · **Entry Note {number} storage invoices are in {Export ID}**.
* New rows carry a **New** badge until saved. Remove moves focus to the next row's Remove, or to the picker.
* Removing one storage invoice of an Entry Note at Awaiting EAD is allowed; adding it to another Export later is blocked by the Entry Note reason.
* Save: a Greek Export with no invoices shows **Select at least one invoice for a Greek invoicing company Export.** and focuses the picker. Failed and stale saves use the Export details messages and keep the draft. Success updates the tab count, Connected Orders, VAT tab and stamping sections; if it first makes the VAT procedure required, the saved response carries the new protocol (FRO-317).
* An invoice added at Completed appears in **Ready for stamping** with its own current stage.
* No membership change creates an invoice-to-Order link or changes Shipment participation.

### Connected Orders

Derived, read-only: each saved invoice's actual Order once. Columns, evenly distributed: **Order** (link), **Supplier**, **Invoicing company**, **Vessel** (the Order's vessel), **Invoices** (count on this Export). Empty: **No connected Orders.** No expansion, colli list or editing. While the invoice card is in edit mode, this card follows the draft list.

## VAT Exemption Protocol

Two stacked cards (FRO-350 card border, padding, 20px gap).

### Protocol Details

| State | Content |
| -- | -- |
| At least one Υ.Δ. invoice on the Export | Read-only **Protocol number** and **Protocol date**, and the **Print ΥΔ** action. |
| No Υ.Δ. invoice, protocol allocated earlier | The retained protocol fields and **This protocol was assigned to an earlier invoice selection and stays with the Export.** No print. |
| No Υ.Δ. invoice, no protocol | Info alert **VAT exemption procedure is not required** + **No invoice on this Export is of type Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).** |

**Print ΥΔ / Εκτύπωση ΥΔ** — primary button with printer icon at the top right of Protocol Details. Shown to staff with edit authority, at all three Customs stages, when the Export has at least one Υ.Δ. invoice; hidden on cancelled Exports.

* Dialog: table of the Export's saved Υ.Δ. invoices (**Invoice number, Supplier, Invoicing company**) with checkboxes, **Select all eligible**, **Clear selection**, a count; required template: **Αερολιμένας Ελ. Βενιζέλος** / **Α΄ Τελωνείο Πειραιά** / **Γ΄ Τελωνείο Πειραιά**. Messages **Select at least one invoice.** · **Select a template.** Hint: **One document per Invoicing company and Supplier, up to five invoices each.**
* **Generate ΥΔ** produces one PDF per Invoicing company + Supplier group, at most five invoices each, from current saved data, rendered by the server and opened inline (same pattern as the delivery-note PDF). The dialog lists the documents with **Open PDF**.
* The print selection is separate from membership and stamping selections. Generating, printing or cancelling never records dispatch/return/sending and never changes status, membership or protocol. Regenerating is allowed.

### VAT Exemption Procedure

When no Υ.Δ. invoice is on the Export: the same Not required alert, no stages.

Otherwise three bordered sub-cards in this order, separated by small muted downward arrows (decorative, hidden from assistive technology): **Ready for stamping → Awaiting stamped return → Exempted invoices**. Each shows its heading, a count badge, a table and an empty message.

| Sub-card | Invoices (Υ.Δ. only) | Action | Date rule (every selected invoice, FRO-321) |
| -- | -- | -- | -- |
| **Ready for stamping / Έτοιμα για σφράγιση** | **Not started** | **Record dispatch for stamping** → In progress | Dispatch date not earlier than the invoice date, not later than today. |
| **Awaiting stamped return / Αναμονή επιστροφής σφραγισμένων** | **In progress** with a dispatch date | **Record stamped papers returned** → Exempted | Return date not earlier than the dispatch date, not later than today. |
| **Exempted invoices / Απαλλαγμένα τιμολόγια** | **Exempted** | **Record paperwork sent to recipient** (status stays Exempted) | Sending date not earlier than the return date, not later than today. Only invoices without a sending date are selectable. |

* Table columns: **Invoice number** (link), **Supplier**, **VAT exemption status**, **Stamping dispatch date**, **Stamping return date**; Exempted adds **Stamped paperwork sent to recipient date**. A checkbox column appears only when actions are available.
* Empty messages: **No invoices are waiting for dispatch.** · **No invoices are awaiting stamped return.** · **No invoice is exempted yet.**
* Actions appear only at **Completed**, for staff with edit authority, on active Exports. Before Completed a neutral note says **Stamping starts after positive IE599 is confirmed (Customs status Completed).** and the tables are read-only.
* Each sub-card has its own selection with **Select all eligible**, **Clear selection** and **{n} selected**; its action is disabled with no selection. Selecting never changes the Informative List. Selections survive tab and language changes and failed confirmations; invoices that are no longer eligible are pruned.
* Dialog: the action name as title, the selected invoices with the date each one is checked against, one required date (input minimum = the latest of those dates), **Confirm / Cancel**. Messages: **Enter the date.** · **The date cannot be later than today.** · **The date cannot be earlier than {date} ({invoice}).** Failure keeps selection and date: **The dates could not be recorded. Nothing changed. Your selection and date are kept.**
* Success applies the invoice-owned events (FRO-321) to the selected invoices only, shows **Recorded for {n} invoice(s).**, clears that selection and refreshes both this tab and the invoice table. The server reports per-invoice outcomes; rejected invoices stay unchanged. Customs status, protocol and membership never change. No Not started → Exempted shortcut.

## Documents

The **Attachments** card follows FRO-347's file rules: PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV or TXT · up to 25 MB per file · nonempty · filename 1–255 characters.

* Each saved file shows its name, size, **Uploaded by {user} · {date}** and **Download**. Empty: **No documents on this Export.**
* **Upload documents** (staff with edit authority, any stage, not cancelled): each file uploads to the Export separately with **Uploading…**; a rejected file shows its reason (**File type not supported.** · **The file is empty.** · **The file is larger than 25 MB.** · **The filename is longer than 255 characters.**) without blocking the others; a failed upload shows **Upload failed** with **Retry**. Only uploaded files count in N.
* **Remove**: Awaiting EAD only, after **Remove this document?** (**Remove / Keep document**). From Awaiting IE599 the Remove button is absent and a hint says **Saved documents are kept as evidence after EAD receipt. They cannot be removed.**
* Adding a document never confirms a Customs or stamping event.

## Cancellation

* **Cancel Export / Ακύρωση εξαγωγής** (secondary TopBar action) shows only to Frontline managers and system administrators, on an active Export at Awaiting EAD with no recorded Customs event.
* Dialog **Cancel this Export?** with text **The Export becomes read-only. Its invoices become available for other Exports. The MRN stays reserved and any protocol number is kept.**, a required **Reason** (free text, up to 1,000 characters, live counter), **Keep Export** and **Cancel Export** (danger). Empty reason: **Enter a reason.** Failed or stale cancellation keeps the reason and shows the error.
* A cancelled Export shows the **Cancelled** pill and a banner **This Export was cancelled** with the reason and **Cancelled by {user} · {date time}**. Everything is read-only: no Edit, Add invoice, Remove, Upload, Print ΥΔ, Customs or stamping controls. Values, the invoice list (as read-only history), protocol and **Download** stay available.

## Decisions

| Decision | Reason |
| -- | -- |
| FRO-317 / FRO-321 are the authority; the page applies their rules as on-page checks and maps server errors | One rule set for UI and server. |
| Add invoice at Awaiting IE599 and Completed; removal only at Awaiting EAD | FRO-317 editing matrix: late invoices can still be stamped; confirmed declarations keep their history. |
| Inline invoice editing (FRO-350 pattern) instead of a separate dialog | Creation and details pages behave the same way. |
| Invoice columns as FRO-350 without Source; Paperwork only badge kept | Source describes suggestions, which are not saved; Paperwork only stays meaningful on the saved Export. |
| Show **Invoicing company** on foreign Exports only | The foreign recipient is otherwise invisible; on Greek Exports it repeats the Shipper. |
| Show **Confirmed by / Cancelled by** captions, no history list | FRO-317 records actor and time; a full history view is not specified. |
| Cancel Export at Awaiting EAD for managers and system admins | Matches FRO-317 cancellation. |
| ΥΔ templates Αερολιμένας / Α΄ / Γ΄ Τελωνείο Πειραιά; one server PDF per group, opened inline | FRO-317 templates; same PDF pattern as the delivery note. |
| Stamping dates not later than today; dispatch not before the invoice date | FRO-321 event rules. |
| Positive IE599 date not later than today | Same rule as the EAD date (FRO-317). |

## Out of scope

The creation page (FRO-350); the Exports list page and an Export section or **Create Export** action on Shipment Details (follow-ups); audited correction after EAD confirmation, later-stage cancellation, reactivation and deletion; an audit-history view; Informative List, Proof of delivery and Pending invoices prints; ΥΔ template redesign; any backend, API or schema work (FRO-317 / FRO-321 / FRO-319).

## Acceptance criteria

1. The page opens by Export ID with four tabs and Overview first; loading, load error with Retry, not found and access denied show their states; partner users never reach it.
2. TopBar shows the title, Customs pill, Cancelled pill when cancelled, and the subtitle; there is no page-level Save or Edit.
3. Shipment relationship shows Shipment number (link), document type and number or **Not recorded**, with no edit control.
4. Export details show Export type, Shipper and Shipper ΑΦΜ for every Export, and Invoicing company only for foreign Exports.
5. At Awaiting EAD, Edit changes only MRN, MRN date and Delivered vessel with the listed validation; Cancel/Escape restore the saved values; failed and stale saves keep the draft; success returns to read-only. At later stages Edit is absent and the lock note shows.
6. Customs actions: EAD date between MRN date and today; positive IE599 date between EAD date and today; Completed has no action; actions are disabled during an open edit; failures keep the date; success records date, user and time and applies the next stage's locks; invoice statuses are unchanged.
7. Supplier invoices: Awaiting EAD allows add and remove; Awaiting IE599 and Completed allow add only, with saved rows locked; a Greek Export cannot be saved without invoices; unavailable invoices show their reasons; Paperwork only badges are correct.
8. Connected Orders list each Order of the invoices once with the five columns and follow the edit draft.
9. Protocol Details shows the three states; a protocol allocated by an invoice save appears after saving; a retained protocol stays when the procedure lapses.
10. Print ΥΔ appears at all three stages only when Υ.Δ. invoices exist and the user can edit; it requires at least one invoice and a template; it produces one PDF per Invoicing company + Supplier with at most five invoices; nothing else changes.
11. Stamping actions appear only at Completed; each sub-card has its own selection, Select all eligible and Clear; dates follow the per-invoice rules; failures keep selection and date; success moves only the selected invoices and refreshes both tabs.
12. Documents upload at every stage, reject invalid files individually, retry failed uploads, and allow Remove only at Awaiting EAD after confirmation.
13. Cancel Export shows only for managers/system admins at Awaiting EAD; requires a reason up to 1,000 characters; the cancelled Export is read-only with the banner, and downloads still work.
14. Users without edit authority see all values and no mutation controls.
15. All labels exist in EN and EL; keyboard-only use works, including dialog focus containment, Escape and focus return; no page-wide horizontal scrolling at 400px.

## Context for agents

Production `Frontline-Forwarding/frontline-forwarding`, reviewed through `gh` at **main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a** (26 October 2026). The Export, Supplier Invoice and Entry Note contracts do not exist on main yet.

| Source | Implementation context |
| -- | -- |
| `frontline-forwarding-client/src/routes/secured/shipments/$shipmentId.tsx` | Details-route pattern: `TopBar`, `DetailLoadingPlaceholder`, `ErrorMessage` (`src/components/feedback/`). Imports use the `#/` alias. |
| `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css`, `src/components/ui/` | Card, Tabs, Table, Button, Input, Combobox, DatePicker, Select, Badge/StatusPill, Alert, Modal, Toast, choice (checkbox/radio). Use semantic tokens only. |
| `docs/reference/database.md` — `freight_shipment` | `shipment_number` is the identifier; transport document type/number are null while PREPARING. |
| `features/companies/graphql/list-vessels.graphql` | `vessels` returns all Vessels for the Delivered vessel combobox. |
| `features/attachments/types.ts`, `docs/workflows/attachments.md` | Attachments support Order/Shipment owners only; Export ownership comes from FRO-317. Upload is a separate operation against a saved owner. |
| `docs/workflows/delivery-note.md` | Server-rendered Thymeleaf/OpenHTML PDFs returned inline: the pattern for ΥΔ output. |
| Branches `mock/fro-348-supplier-invoice-details`, `mock/fro-350-export-create` (when published) | Card editing, status block and invoice picker reused here; not on main. |

The ChatGPT-hosted preview attached to this issue requires a sign-in and predates this specification: historical reference only. The current static preview (fixture data) is in the planning repository under `previews/fro352`. This description is the contract.

Gotchas: the production `Tab` component has no arrow-key navigation; add it locally as FRO-347/350 do. FRO-319 reads the Export MRN to decide whether an Entry Note is active, so an MRN edit at Awaiting EAD changes the register. Keep the stamping selections, the print selection and the Informative List as three separate states.

## Post-deployment verification

Read-only, against seeded test records. Never edit, confirm, cancel, print-then-record or stamp a production Export to verify.

| Criteria | Read-only check |
| -- | -- |
| 1–4 | Open seeded Greek, foreign and cancelled Exports and a missing ID; compare header, tabs, Shipment and identity fields with the fixtures. |
| 5–6 | Open seeded Exports at each Customs stage; confirm Edit and the Customs action exist only where listed, without saving. Review the controlled-environment test results for validation, stale and failure paths. |
| 7–9 | Open the invoice tab at each stage; compare columns, badges, picker reasons and Connected Orders with the fixtures; read the protocol fields of a seeded Export with and without Υ.Δ. invoices. |
| 10 | On a test environment, generate ΥΔ for a seeded Export with more than five invoices of one group and two groups; compare the PDF count. In production, open the dialog without generating. |
| 11 | Read a seeded Completed Export's three sub-cards and compare stages and dates with its invoices on FRO-348. Review test results for date rules and failures. |
| 12–14 | List and download a seeded file as staff; check that Remove/Upload/Cancel Export appear only for the listed stages and roles. |
| 15 | Check EN/EL labels, keyboard navigation and the 400px layout without saving. |

**Reference:** FRO-317 (entity and rules), FRO-321 (Supplier Invoice events), FRO-319 (Entry Note), FRO-350 (creation page), FRO-348 / FRO-347 (presentation patterns).
