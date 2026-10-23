# FRO-348 — proposed historical-reference addition

Title: Supplier Invoice — Details page UI
Status: Todo
Labels: supplier invoice, Pending_Review, Frontend, Story
All metadata, relations and attachments remain unchanged. Only the final italic historical-reference paragraph is added.

## Complete proposed description

**As a Front Line staff operator I want to view and correct a saved Supplier Invoice** so that its invoice facts, source relationships, documents and permitted confirmations remain consistent and auditable.

**Order = purchase order = stock-list item; colli = handling unit.** <issue id="935b288e-b368-4436-8796-42cfa81e9e63" href="https://linear.app/front-line-ltd/issue/FRO-348/supplier-invoice-details-page-ui">FRO-348</issue> owns Details presentation and its guarded interactions. [FRO-321](<https://linear.app/front-line-ltd/issue/FRO-321>) owns the new entity, persistence, validation, staff-only access, correction/cancellation/events, concurrency and invoice-owned files. Supplier Invoice is absent from the inspected production database/API; existing Order invoice rows are separate.

## Design and delivery

Use the selected **A — Comfortable cards**, aligned with current [FRO-347](<https://linear.app/front-line-ltd/issue/FRO-347>) and [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326>). Live theme/component code takes precedence over prototype CSS: Plus Jakarta Sans, 20px semibold page title, sentence-case 12px labels, reference typography for IDs/dates/money, standard 40px controls, 8px control corners, 12px cards, 16px dialogs and semantic colours. Teal denotes action/current progress; completed state uses the system success treatment.

* [Selected private Details preview](<https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site>)
* [Current preview, alternatives and component mapping](<https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site/canvas.html>)
* [Selected desktop artboard](<https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site/direction-a.jpg>)
* [Greek narrow-layout evidence](<https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site/greek-mobile-review.jpg>)
* [Previous Details-page preview](<https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site/baseline-v20.html>)

Site project: `appgprj_6ad0ae445fdc81919d8996215708f533`. Preserve its owner-private audience and URL. It uses fictional browser-local records; it does not prove delivered APIs, persistence, authorization or full navigation. Review controls, business-note markers and **New component** labels are annotations, not production UI. The canvas defines the look; this description and <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> define behavior.

| Delivery | Required outcome |
| -- | -- |
| **Initial release — 0.0.6** | Authorized retrieval, saved facts, compatible card corrections, guarded cancellation and invoice-owned document display/download. Consume <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>'s explicit Order regime. |
| **Export integration** | Related Export and guarded stamping/onward-sending actions consume <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue>/<issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> when delivered; <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue> currently targets 0.0.10. |
| **Entry Note integration** | Authorized direct/inherited admission lookup consumes <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules">FRO-319</issue> when delivered; it currently targets 0.0.11. |
| **Unavailable integration** | Show an explicit unavailable state, distinct from loading, failure, denied access, conflicting data and confirmed absence. Do not fabricate records, claim no link from an unavailable lookup or enable an action whose prerequisites cannot be checked. Basic invoice retrieval/correction must not wait for the later lookup integration. |

Keep existing status, labels and dependency/release metadata. Description/design approval does not promote the ticket to Ready. Later integrations must not block the agreed basic release or weaken their guards.

## Page structure

| Surface | Required presentation |
| -- | -- |
| **Heading** | White title card: **Supplier invoice · ID / Τιμολόγιο προμηθευτή · ID**. Display the immutable server-generated positive-integer ID, distinct from Invoice number and Stock ID. Show **Cancelled** independently when applicable; cancellation is not an exemption status. No create/save/edit action or duplicated VAT status in the heading. |
| **Shared card** | **Overview / Επισκόπηση → Related Export / Σχετική εξαγωγή → Documents / Έγγραφα**, with the saved-file count. Keep card drafts outside conditionally mounted panels. |
| **Overview** | Three stacked cards: **Order relationship → Supplier invoice details → VAT exemption**. Use 20px card padding, card gaps and panel inset; 16px padding on narrow screens. Saved values use lightly bordered neutral boxes and read-only semantics. |
| **Order relationship** | Four equal columns: **Stock ID → Client → Invoice company → Supplier**. Stock ID opens the authorized linked Order. Entry Note occupies one matching column below Stock ID. Top-right Edit corrects the invoice's Order relationship; it never edits the Order itself. |
| **Invoice details** | Four equal columns: **Invoice number → Invoice date → Invoice expiration date → Currency**; next row **Invoice type → Invoice vessel → Invoice net value → Invoice VAT value**. Use 28px column/18px row gaps; two columns at widths ≤1100px, one at ≤700px. Monetary fields retain equal widths. Top-right Edit opens the applicable invoice facts in their existing cells. |
| **VAT exemption** | One clearly labelled saved **VAT exemption status** field, maximum 400px on desktop, semibold value. For Υ.Δ., show the noninteractive three-step indicator below it, then the three recorded dates. Other active types show only **Not required / Δεν απαιτείται**, with no progress/dates/actions. Do not duplicate these fields in Invoice details. |
| **Record management** | A separate area beneath the Overview cards provides guarded **Cancel invoice / Ακύρωση τιμολογίου** and its retention/protection explanation. Keep this distinct from card Cancel and exemption progression. |

Use **Supplier Invoice / Τιμολόγιο προμηθευτή** and corresponding plural consistently; retain official invoice-type names. Provide EN/EL labels, errors and accessible names. Labels and long values must wrap without clipping; narrow-screen tabs remain reachable.

## Saved fields and ordinary corrections

| Field | Type / format | Saved/edit behavior |
| -- | -- | -- |
| **Stock ID** | Required Order reference | Display the actual linked Order. Correction selects an authorized non-cancelled Order with Supplier across lifecycle stages; another invoice on it does not make it unavailable. A cancelled invoice may retain a historical link to a cancelled Order for reading. |
| **Supplier / Client / Invoice company** | Derived company references | Always resolve from the current linked Order, including cancelled invoices. Invoice company is optional and remains blank when missing, without Client/Supplier fallback. No invoice-side override or creation snapshot. |
| **Invoice number** | Required String | Trim surrounding whitespace; reject blank. Preserve case, internal spaces, punctuation and leading zeros. |
| **Invoice date** | Required date | No later than today in Europe/Athens. Use the production DatePicker. |
| **Invoice expiration date** | Optional date | When applicable, cannot precede Invoice date. Storage type makes it blank/inapplicable. |
| **Invoice type** | Required conditional choice | Saved type remains unchanged on read. Use the three active types and regime rules below; preserve historical fourth-type records without conversion or new selection. |
| **Invoice vessel** | Optional Vessel reference | Select/clear an authorized vessel associated with the linked Order's Client. No copying, fallback or synchronization from Order, Shipment or Export vessel. |
| **Currency** | Required reference-data choice | Use delivered currency reference data. Net/VAT share the saved currency; changing currency performs no conversion. Fixture choices are not the production option list. |
| **Invoice net value / VAT value** | Required exact decimals | Each 0–99,999,999,999,999,999.99 inclusive, at most two decimal places; blank is not zero. Reject negative, overprecision or out-of-range values without rounding/clamping. Keep lossless draft/request/response values and display two decimals. |
| **VAT exemption status and event dates** | Saved status / conditional dates | Read-only in cards. Changes occur only through the guarded operations below; no unrestricted status/date editor. |

The duplicate key is **current Supplier + case-sensitive Invoice number after surrounding trim**, including cancelled invoices and excluding the invoice being edited. Order, Client and invoice year are not part of the key. Different Suppliers may use the same number. Identify a conflict only within authorized access.

**One card editor at a time.** For authorized active records, Edit prefills the saved values; show Cancel and one primary Save in that card. Lock other card mutation controls and event/cancellation actions until the editor is resolved. Cancel/Escape discards only that editor's draft and restores saved values/focus. Dropdown/calendar dismissal consumes its own Escape before card cancellation. Failed validation/save/conflict retains entered values and actionable errors; focus the relevant field or error summary. Do not replace successful saved values with an optimistic result before confirmation.

Saving carries <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>'s server-verifiable precondition for the record/context the operator read. Recheck authority, cancellation/lifecycle, source relationships, duplicate key, dates, amounts, vessel, type and Export/admission/event compatibility. Reject stale/conflicting updates atomically, retain the draft and require refresh/review; never silently overwrite newer data. Saved change and actor/time/old-new audit commit together under <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>. Repeated submission/retry must not apply the operation twice.

Cancelled records are readable with retained identity, values, links, documents and history; ordinary card editing, cancellation and forward event actions are unavailable. This screen adds no ordinary reactivation, deletion or audited historical reconciliation editor.

### Order, regime and type correction

Use the shared <issue id="e6c0559c-112a-48bc-b31a-c691cb53a81b" href="https://linear.app/front-line-ltd/issue/FRO-347/supplier-invoice-create-page-ui">FRO-347</issue> Order selection patterns: authorized, case-insensitive partial Stock ID/Supplier/Client search across the eligible collection, including pagination; keyboard selection and Escape/outside-click dismissal. Search alone never changes the saved or draft selection.

| Proposed Order/type | Required behavior |
| -- | -- |
| **Τελωνειακή Αποθήκευση** | Set/lock **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)**, VAT = 0, expiration blank/inapplicable, status Not required. Missing Entry Note never changes this rule. |
| **Other regimes / Greece = No** | Permit applicable **Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)** or **Greek Supplier – Foreign Recipient (MRN)**. Storage is unavailable. Do not invent automatic mapping for Τελωνειακή Αποταμίευση. |
| **Υ.Δ. without protected history** | VAT remains an entered exact value; zero VAT still requires the exemption workflow. Switching into Υ.Δ. starts Not started. |
| **MRN type without protected history** | VAT = 0; expiration optional; status Not required. |
| **Unresolved required context** | Do not guess an Order regime/type. Preserve the draft; distinguish loading/failure from legitimate empty regime for Greece = No. |

Use <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>'s explicit Order regime, never warehouse name, ΚΤΑ, ΑΛΚ, VAT amount or Entry Note existence. Company/regime corrections use their authorized owning operations; <issue id="8f8f4694-7676-46ec-950e-c766fba3c94e" href="https://linear.app/front-line-ltd/issue/FRO-303/order-change-invoice-company-after-shipment-inclusion">FRO-303</issue>/<issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> boundaries remain intact.

Changing the proposed Order re-evaluates companies, type, VAT, expiration, status, vessel eligibility and note context together. Show the proposed consequences and allow retaining the prior selection before discarding incompatible unsaved values. Preserve unrelated compatible values. Do not invent or restore discarded values when switching types back. Keep the saved VAT section visibly separate from proposed changes until Save succeeds.

The Order editor includes any dependent invoice correction needed to make the proposed relationship valid. Save the invoice Order link and compatible type/value/expiration/status/vessel changes in **one atomic invoice correction**, preserving invoice ID and auditing old/new facts. Cancel restores the saved relationship and dependent values. It does not save either Order or change company master data.

Reject ordinary changes incompatible with explicit Export membership, admission relationships or recorded dispatch/return/onward-sending events. Never clear events, silently reassign Export membership or convert a historical **Foreign Supplier – Greek Recipient** record to make Save succeed. Protected cases receive an actionable audited-reconciliation explanation, without a nonfunctional override button.

### Unavailable storage option

In a permitted non-storage type editor, keep **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)** visible, hoverable and keyboard-focusable with **aria-disabled**, but non-selectable. Use the shared combobox/floating primitives with the mapped extension; do not rely on a native disabled option to expose the reason.

* **EN:** Requires Τελωνειακή Αποθήκευση on the linked Order.
* **EL:** Απαιτεί καθεστώς Τελωνειακή Αποθήκευση στη συνδεδεμένη παραγγελία.

Show that tooltip only on hover/focus and associate it with the option for assistive technology. Click/Enter/Space must not change type, other draft values, saved facts or files. Support Arrow/Home/End navigation; Escape closes the dropdown and restores control focus without cancelling the card edit. Tab/outside-click dismiss normally. Keep long official names readable. No persistent eligibility paragraph, type-information panel or extra Open Order link beneath the field; retain Stock ID navigation. Server eligibility and saved-history protections remain authoritative.

## Entry Note and Related Export

| Area | Required behavior |
| -- | -- |
| **Current Entry Note** | For a storage Order, consume <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules">FRO-319</issue>'s authorized direct/inherited admission-aware lookup through the actual Order. Show the current link and preserve owning-Order/coverage provenance. A common root or split lineage alone is insufficient. Non-storage Orders show a blank/inapplicable field. |
| **Refresh and ownership** | Late note creation or owner-permitted relationship correction/invalidation refreshes affected views and subsequent reads without invoice resave. No separate invoice→note pointer, selector, copied HS code/entry MRN/date or new note cancellation/reissue/replacement operation. Preserve <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules">FRO-319</issue>'s reverse matching-invoice/shared-explicit-Export derivation. |
| **Lookup states** | Distinguish integration unavailable, loading, failure with Retry, access denied, conflicting admission/relationships and confirmed **No current Entry Note**. Retry/invalidation preserves card drafts and ignores stale results for a previous Order. Missing/unavailable note alone does not block an otherwise-valid basic save. |
| **Related Export** | Resolve only this invoice's explicit membership under <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue>. Show authorized **Export ID** link, **Export MRN**, **Export MRN date** and source-owned **Customs status**: Awaiting EAD / Awaiting IE599 / Completed; EL Αναμονή EAD / Αναμονή IE599 / Ολοκληρώθηκε. Corrections belong on Export. |
| **Export states** | Confirmed absence shows **No linked Export yet**; unavailable integration is distinct. Show dashes for unavailable fields, separate loading/error with Retry/denied/conflict states, and no broken or unauthorized links. Never choose an arbitrary Export when associations conflict. |

No Shipment AWB or direct split-child references appear on this page. Viewing/navigation never changes invoice membership, either Order, Entry Note or Export facts.

## VAT exemption and confirmations

The saved **VAT exemption** card is the only location for status, progress and invoice event dates. Υ.Δ. displays **Not started → In progress → Exempted**, including zero-VAT Υ.Δ. The progress indicator supplements the labelled current value and is not clickable. Both other active types show only Not required. Preserve readable historical fourth-type records without inventing a workflow or repairing them on read.

For Υ.Δ., display **Stamping dispatch date → Stamping return date → Stamped paperwork sent to recipient date** in three equal desktop columns with 28px column/18px row gaps, two columns at ≤1100px and one at ≤700px. Align saved-value boxes when labels wrap. Missing dates show the shared empty value. Dates remain read-only outside their confirmations.

| Saved stage | Action and confirmation | Required outcome |
| -- | -- | -- |
| **Not started** | **Record dispatch for stamping**, top-right on the current-status row. Request required dispatch date. | Authorized active Υ.Δ., eligible explicit Export membership and recorded positive IE599. Date on/after Invoice date. Record dispatch and advance to In progress. |
| **In progress** | **Mark as Exempted**, same placement. Open **Record stamped papers returned**; show dispatch read-only and request required return date. | Recorded dispatch on the same eligible Export; date on/after dispatch. Record return and advance to Exempted. |
| **Exempted**, onward date blank | **Record paperwork sent to recipient**, separately below the date row, aligned right/full width at narrow widths. Show return read-only and request required sending date. | Recorded return, same eligible Export and positive IE599; date on/after return. Record sending; remain Exempted. |

All physical-event dates are no later than **today in Europe/Athens**. Positive IE599 must be recorded when confirmation is submitted; its recording date is not automatically a lower bound for physical dispatch. Physical event date and authenticated recording timestamp are distinct.

Show unavailable prerequisites concisely. Before Export integration, no active stamping/sending controls. Before positive IE599, show dispatch disabled with its reason and an authorized Export link when available; do not claim Customs completion from a missing lookup. View-only staff and cancelled/ineligible records have no mutation controls. Unresolved edits block event submission.

Dialogs use Confirm/Cancel, required-date errors, keyboard focus containment, Escape and focus restoration. Opening/Cancel makes no change. Recheck current authority, active qualifying type/stage, same Export, positive IE599 as applicable, event ordering and concurrency server-side. Record invoice ID, physical date, Export association, resulting status and actor/recording time atomically under <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>. Prevent repeat submission, ordinary overwrite/clearing and duplicate events. Reject stale stages without overwriting completed work; retain entered date/error and refresh for review.

Successful confirmation refreshes actual persisted values. Onward sending changes only its event/date/audit; both stamping dates and Exempted remain intact. It records sending papers, not verified recipient receipt or physical goods delivery. Once recorded, omit the ordinary sending action and explain that correction requires audited reconciliation. No fourth progress step.

Invoice-level and <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue>/<issue id="60bfcd2b-a424-48d8-b695-17ae8d929205" href="https://linear.app/front-line-ltd/issue/FRO-352/export-customs-declaration-details-page-ui">FRO-352</issue> bulk controls consume the **same invoice-owned facts/history**. No second Export-owned stamping status/date is introduced. Preserve other invoices, Customs/protocol, membership and connected Orders; only actual confirmed outcomes refresh these views.

## Guarded cancellation

Offer **Cancel invoice** only to authorized staff for an active invoice with **no Export assignment and no recorded dispatch, return or onward-sending event**. Where ineligible, explain the protection; do not offer an ordinary override. Resolve active edits first. <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> must authoritatively establish eligibility; unavailable relationship information is not proof of no assignment.

Confirmation identifies the invoice and explains that **ID, normalized number/duplicate reservation, Order link, values, files and history are retained**. Cancel/Escape leaves it active and returns focus. Confirm rechecks authority, cancellation state and guards, including concurrent Export assignment/events; save cancellation and actor/time audit atomically. Failure/unknown outcome never implies successful cancellation.

After confirmed cancellation, show independent Cancelled identification and readable retained data/downloads without ordinary mutation controls. No hard deletion, ordinary reactivation, cascade Order cancellation, automatic invoice movement or source-record mutation. <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> owns Order protection while active invoices remain linked; this UI must not bypass it.

## Documents, drafts and recovery

**Documents** displays invoice-owned saved files, actual count, available metadata, empty/loading/error states and authorized **Download**, using the current shared attachment presentation. No chooser, staged-upload pills, Remove, upload guidance or Order-file substitution. Saved files remain with this invoice after correction/cancellation; do not apply Order split inheritance.

| Situation | Required behavior |
| -- | -- |
| **Tabs / EN–EL / lookup Retry** | Retain the active card draft, selections and entered confirmation values. Do not submit edits or overwrite the draft with refreshed derived/saved values. |
| **Leaving this invoice / linked-record visit** | Warn before discarding unsaved changes. Staying preserves them; deliberately leaving does not save them or mutate source records. Retain the in-app draft on a return when that workflow preserves it. |
| **Reload / tab close** | Register an unload warning where supported while unsaved or unresolved work would be lost. No durable/cross-device/reload-resilient draft service is introduced. |
| **Save/confirmation pending** | Keep original attempt and read-precondition context; disable repeated/conflicting mutations. UI disabling does not replace <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> retry/concurrency enforcement. |
| **Confirmed rejection** | Preserve saved facts and the entered draft/date; show field/summary errors and actionable correction or refresh/review. |
| **Stale/conflicting save** | Preserve newer saved data and the operator's draft separately. Require current-value review and valid preconditions before another save; no automatic replay of stale values. |
| **Unknown correction/cancellation/event outcome** | Preserve the original invoice/action/payload context and entered values. Show a distinct unresolved result; reconcile the original attempt before retry or changed-payload submission. Transport failure is not proof of rejection. Do not invent success or clear an event on uncertainty. |
| **Confirmed success** | Render authoritative saved results and audit-relevant facts. Preserve invoice ID; invalidate affected invoice/Order-link/current-note/Export and direct active-invoice-presence consumers as applicable. Reassignment refreshes both old and new Orders; cancellation refreshes the linked Order. Do not mark siblings/parents invoiced through lineage. |

Page load, tabs, language, read-only refresh, links, downloads, opening/cancelling dialogs and unsaved draft changes issue no invoice/source mutations. Never fall back to creation or fixtures when a production record is missing, denied or fails to load.

## Components and boundaries

| Area | Owner / implementation boundary |
| -- | -- |
| **Details page and interactions** | <issue id="935b288e-b368-4436-8796-42cfa81e9e63" href="https://linear.app/front-line-ltd/issue/FRO-348/supplier-invoice-details-page-ui">FRO-348</issue> in `frontline-forwarding-client`: selected card/grid presentation, guarded editors, cancellation/confirmation dialogs, recovery and saved document display. |
| **Entity and operations** | <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> in `frontline-forwarding-app`: persistence, validation, read/update/cancel/events, retry/preconditions, audit, staff-only authorization and invoice-owned files. It blocks working integration. Consume delivered names/contracts; invent no existing table, endpoint, authority or GraphQL operation. |
| **Regime and source corrections** | <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> supplies explicit regime; <issue id="8f8f4694-7676-46ec-950e-c766fba3c94e" href="https://linear.app/front-line-ltd/issue/FRO-303/order-change-invoice-company-after-shipment-inclusion">FRO-303</issue> supplies its scoped later Invoice company correction. Retain their protected Order/company boundaries. |
| **Other fiscal screens** | <issue id="e6c0559c-112a-48bc-b31a-c691cb53a81b" href="https://linear.app/front-line-ltd/issue/FRO-347/supplier-invoice-create-page-ui">FRO-347</issue> supplies shared Create terminology/selection patterns; <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue>/<issue id="60bfcd2b-a424-48d8-b695-17ae8d929205" href="https://linear.app/front-line-ltd/issue/FRO-352/export-customs-declaration-details-page-ui">FRO-352</issue> own Export facts/membership/bulk UI; <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules">FRO-319</issue>/<issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue> own Entry Note facts/presentation. Do not edit those tickets or add their screens here. |

Reuse the live `AppShell`/navigation, `Card`, `Tabs`, `FormField`, `Input`, `Combobox`, `Select`, `DatePicker`, floating/overlay primitives, `Button`, `Modal`, feedback and attachment screen parts. Map the selected artboard to actual exports/import paths before implementation. New compositions are **invoice saved-value cards**, **VAT progress**, **guarded cancellation**, **recovery** and the **focusable unavailable-type reason** extension. Existing attachment ownership cannot be reused unchanged for a new invoice owner. Prototype fixture/native controls are not a substitute for production components.

Direct route/data/action/file access is staff-only under <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>; participant access to an Order does not grant invoice access. Apply server record/company scope and action authority to direct and indirect readers, errors, links and downloads. Do not expose another record through a duplicate or relationship error. Handle missing/denied/error states without leaking cached inaccessible facts.

Preserve existing Order invoice rows, customs values, source correction guards, both manual/Shipment-driven split paths and unrelated outputs. No automatic copying/movement of Supplier Invoices/files through lineage. This is a new entity/fixture integration, not a real legacy import, backfill or conversion project. Protected real historical fourth-type data, where present, remains readable unchanged.

## Decisions

| Decision | Reason |
| -- | -- |
| Comfortable direction A with live production primitives | Match the accepted shared form/Order Details direction and keep saved versus editable values clear. |
| One guarded card editor; atomic dependent Order correction | Prevent independent drafts from overwriting derived invoice facts. |
| Guarded cancellation on Details | Provide the initial-release cancellation entry point while retaining fiscal identity, files and history. |
| Retained drafts, navigation warnings and explicit recovery | Prevent accidental loss and duplicate application after failed or uncertain responses. |
| Staged integration and source-owned relationships | Keep basic 0.0.6 usable without fabricating later customs records or weakening their guards. |
| Existing private ChatGPT Site | Preserve the review URL/audience; this task uses Sites instead of Cloudflare Pages. |

## Acceptance criteria

 1. Authorized staff open an existing invoice by immutable ID and see correct saved identity, independent cancellation state, derived companies and authorized Order navigation. Missing Invoice company remains blank. Cancelled historical links remain readable.
 2. Selected comfortable cards, heading, three tabs/cards, field order and date grid match production primitives in EN/EL, keyboard use, desktop and approximately 400px. Production contains no review annotations/fixture controls, duplicated status/dates or added Shipment/split presentation.
 3. Ordinary active-record editing covers the applicable invoice facts and one atomic Order/dependent correction, with one editor at a time. Cancel/failure leaves saved values intact; stale/conflicting edits retain drafts without overwriting newer data or protected history.
 4. Type/regime derivation, visible unavailable storage option/tooltip, optional Client-scoped vessel, currency, normalized duplicates and lossless monetary/date boundaries match <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>/<issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>. Read operations never convert saved or historical types; wrong/unauthorized/stale context rejects atomically.
 5. Entry Note uses direct/inherited admission lookup without copies/pointers/resave. Late creation/valid corrections refresh references; unavailable/loading/error/denied/conflict/confirmed absence remain distinct and stale results are ignored. Related Export resolves only explicit invoice membership and correct source-owned fields.
 6. Saved VAT status appears only in its card. Υ.Δ. has labelled current value, noninteractive three-step progress and three read-only dates; non-Υ.Δ. has only Not required. Unsaved edits do not change displayed saved progression.
 7. Dispatch, return and onward-sending confirmations enforce active qualifying type/stage, same Export, positive IE599 as applicable, invoice→dispatch→return→sending chronology and Athens today. Cancel records nothing; rejection/unknown outcomes retain values. Success/event/audit is atomic and individual/bulk controls share facts. Onward sending leaves Exempted and stamping dates unchanged.
 8. Cancellation succeeds only for an authorized active unassigned invoice with no events, including concurrency rechecks. Confirmed cancellation preserves identity, duplicate reservation, links, values/files/history and removes ordinary mutation controls. No cascade, deletion or ordinary reactivation.
 9. Documents shows only actual invoice-owned saved metadata/count/files and authorized Download, with empty/loading/error states and no upload/removal or Order fallback.
10. Drafts survive tabs/language/lookup retry and guarded in-app navigation; leaving/reload warns where supported. Pending, rejected, stale, unknown and confirmed outcomes are distinct; original attempts resolve before retry/changed replay. Confirmed corrections/cancellation refresh applicable old/new Order presence without lineage inference.
11. Basic release works with later integrations explicitly unavailable. Inaccessible prerequisites never become confirmed absence or enabled actions. Staff-only direct/indirect/file access and source/company scope are enforced; missing/denied/error pages never use production fixtures.
12. Existing Order rows/customs amounts, both split paths, lifecycle, source permissions, other invoices/Export/Entry Note facts and unrelated UI remain unchanged. No real-data migration or production mutation is performed for verification.

## Out of scope

Backend entity/database/API implementation owned by <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>; general Order/company editing or regime overrides; unrestricted/backward status/date editing; audited historical reconciliation; ordinary deletion/reactivation; invoice upload/removal UI; Export bulk actions/membership editing; Entry Note screens/registers/reissue; Shipment/split links; printing; list/Create redesigns; comments/history editor; durable draft storage; real legacy migration; new global navigation scope; production branch creation/publication or production deployment.

## Context for agents

Production `main` inspected and reverified through authenticated `gh` on 23 October 2026: `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. This is source evidence, not proof of deployed behavior. Paths are relative to `Frontline-Forwarding/frontline-forwarding`.

| Source | Relevant implementation fact |
| -- | -- |
| `frontline-forwarding-client/DESIGN.md`; client `src/styles/theme.css` | Authoritative typography, semantic tokens, density, corners and layering. Theme/component code takes precedence over old previews. |
| Client `src/components/layout/app-shell.tsx`; `src/components/ui/card.tsx`, `tabs.tsx`, `input.tsx`, `combobox.tsx`, `select.tsx`, `date-picker.tsx`, `modal.tsx`, feedback/floating primitives | Real frame/form components. AppShell has horizontal desktop navigation and mobile drawer. No dedicated Tooltip primitive is assumed; map the focusable unavailable-option extension. |
| Client `src/features/purchase-orders/components/purchase-order-detail.tsx` | Existing heading/Section/Facts and saved attachment usage; Order lifecycle/actions are not invoice operations. |
| `docs/reference/database.md`; `graphql-api.md`, `rest-api.md`, `mcp-tools.md` in that directory | Supplier Invoice/Export/Entry Note are not implemented at this baseline. Define supported contracts under their entity owners; existing Order invoice rows are independent. |
| Backend `web/purchaseorders/service/PurchaseOrdersApiService.java`; `PurchaseOrderRequestValidator.java` | Current Order header editing is lifecycle-limited; Client/Vessel updates are protected. Do not reuse it as an invoice correction API or unlock source fields. |
| Backend `domain/purchaseorders/PurchaseOrderInvoiceRowRepository.java`; `web/shipments/service/ShipmentsApiService.java` | Manual and Shipment-driven splits copy current Order invoice rows; that behavior does not establish new Supplier Invoice identity/ownership. |
| `docs/architecture/authorization.md`; backend `domain/purchaseorders/PurchaseOrderAuthorizationService.java` | Participant Order reads exist; new invoice access must remain staff-only through authoritative services. |
| `docs/workflows/attachments.md`; backend `web/attachments/service/AttachmentsApiService.java`; client `src/features/attachments/components/attachment-panel.tsx` | Current owners/authority are Order/Shipment. <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue> must supply invoice ownership/access; no endpoint/owner-string substitution. |
| Current <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>/<issue id="e6c0559c-112a-48bc-b31a-c691cb53a81b" href="https://linear.app/front-line-ltd/issue/FRO-347/supplier-invoice-create-page-ui">FRO-347</issue>/<issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue>/<issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>; <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-entity-and-business-rules">FRO-317</issue>/<issue id="60bfcd2b-a424-48d8-b695-17ae8d929205" href="https://linear.app/front-line-ltd/issue/FRO-352/export-customs-declaration-details-page-ui">FRO-352</issue>/<issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules">FRO-319</issue>/<issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue> | Consume agreed entity, design and staged integration contracts without treating their future features as implemented production behavior. |

## Post-deployment verification

Use authorized read-only inspection and controlled staging/test evidence. Never save, cancel, confirm events, upload or mutate production records merely to verify this ticket.

| Criteria | Concrete read-only check |
| -- | -- |
| 1–2 | Open seeded active/cancelled invoices and compare ID, companies, Stock ID target, missing-company presentation and independent cancellation badge. Compare selected artboard in EN/EL, desktop/400px, keyboard use, tabs and field/date order. |
| 3–4 | Inspect permitted unsaved editors without submitting; check one-editor behavior, prefilled facts and type tooltip/focus. Review controlled tests for atomic corrections, Cancel, exact money/date/duplicate/vessel validation, stale preconditions and protected history. Read saved audit/results to compare retained IDs and values. |
| 5 | Read authorized Order/admission and explicit Export membership results; compare displayed note/Export IDs, MRN/date/status and direct/inherited provenance. Inspect missing/unavailable/error/denied/conflict and late-creation/valid-correction fixtures without invoice resave. |
| 6–7 | Open saved Υ.Δ./non-Υ.Δ./historical fixtures at each stage; compare single status location, progress and dates. Review date-boundary, IE599/same-Export, stale/duplicate/denied, Cancel/failure and individual-versus-bulk test results; read invoice event/audit history for actual outcomes. |
| 8 | Read eligible/protected/cancelled fixtures and cancellation concurrency results. Compare retained ID/number/Order/value/file/history data, absent ordinary actions and direct active-invoice-presence results. No production cancellation is required. |
| 9 | Inspect invoice-owned files/count/metadata, authorized download and empty/loading/error states; confirm no upload/removal controls or Order-file fallback. Review denied direct-download tests. |
| 10 | Inspect draft/navigation/unload and rejected/stale/unknown-result test evidence. Read original-attempt and resulting invoice/event IDs to confirm no repeated application; compare old/new Order presence after controlled correction/cancellation. |
| 11–12 | Inspect initial-release integration-availability states and later integration fixtures. Review direct/indirect partner denials and scope tests; compare existing Order rows/customs/split/lifecycle and unrelated outputs against baseline. |

**Reference:** [FRO-321](<https://linear.app/front-line-ltd/issue/FRO-321>) · [FRO-347](<https://linear.app/front-line-ltd/issue/FRO-347>) · [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326>) · [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356>) · [FRO-317](<https://linear.app/front-line-ltd/issue/FRO-317>) · [FRO-352](<https://linear.app/front-line-ltd/issue/FRO-352>) · [FRO-319](<https://linear.app/front-line-ltd/issue/FRO-319>) · [FRO-354](<https://linear.app/front-line-ltd/issue/FRO-354>) · [Selected private preview](<https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site>).

*Historical UI reference: [Original Supplier Invoice Details UI — version 20, 20 October 2026](https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site/baseline-v20.html). Preserved for historical reference only; the current specification and selected A design take precedence.*

