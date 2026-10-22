**As an office operator I want Order Details to provide one consistent place to review and edit a saved Order**, with clear actions, preserved drafts and the production design system.

**Order = purchase order = stock-list item. Colli = individually identified handling unit.** Implement **direction A: stacked cards with a four-column wide-screen Details grid**. Preserve authorized existing capabilities and permanent record identities.

## Design and page structure

Use the live production `DESIGN.md`, `src/styles/theme.css` and shared components. Theme/component code takes precedence over prototype CSS. Use comfortable density, Plus Jakarta Sans, JetBrains Mono for references, sentence-case 12px field labels, 40px standard controls, 8px control corners, 12px cards and 16px dialogs. Use semantic colours and the established status palette; teal denotes action, not success. Reuse the application frame and navigation, with Purchase orders active. Do not introduce a separate global navigation system.

| Area | Required presentation |
| -- | -- |
| Heading | Order · ID left; conditional flags right, DG first and Parent Balance adjacent when applicable. Preserve Partial lineage. No duplicate status, Client/Vessel or main lifecycle action in the heading. Current customs indicators use the explicit regime, never retired Bonded flags. |
| Tabs | Overview · Collis · Invoice rows · History & activity · Documents · Available actions. Retain authorized content and access. |
| Overview | Order details → Notes → Split relationships. No Route and readiness card or empty replacement. |
| Order details | Top-right Edit; compact nested Order status, four-column main field grid, two-column Customs regime/ΑΛΚ section between full-width dividers, then Urgent and full-width Urgent information. Two columns at intermediate widths and one on phones; long Greek labels must not clip. |
| Order status | Neutral sub-card with label and current status; no progress bar, step counter or Next text. Two secondary readiness-email buttons in its header; at most one eligible main lifecycle action below. Wrap controls on narrow screens. |
| History & activity | Order activity → Comments → Reminder history, as separate cards. |
| Available actions | Four standalone cards: Request readiness date → Confirm readiness date → Create supplier invoice → Entry Note. No enclosing duplicate card, More actions menu, Other actions heading, Add comment or Colli shortcut. |

Reuse Card, FormField/Label, Input/Textarea, Select, searchable Combobox for authorized entity references, DatePicker, Button, Tabs, Badge/StatusPill, Modal and AttachmentPanel. New compositions are the restricted-correction chooser, shared Details/correction review, expanded colli rows and two-location readiness review; build them from existing primitives.

All labels, reasons, errors, accessible names and dialogs require EN/EL, keyboard access, visible focus and usable 375–400px layouts. Contain table scrolling inside its panel. Dialogs trap focus and return it to the opening control; Escape/Cancel never submits. Status requires text as well as colour. Preserve reduced-motion and theme support.

## Ownership and activation

| Owner | Contract consumed by this page |
| -- | -- |
| FRO-346 | Atomic ordinary Details changes plus eligible readiness correction; authorization, validation, draft version, concurrency and audit. |
| FRO-303 | Invoice company correction, additional lifecycle eligibility and delivery-note/document conflict and regrouping rules. |
| FRO-356 | Explicit customs regime, warehouse capabilities, conditional ΑΛΚ, shared registration coverage, clearing/impact confirmation and historical reconciliation. |
| FRO-333 / FRO-334 | Optional Pickup responsibility and removal of Order Collection agent/Greece validation dependency. |
| FRO-292 | Independent Internal/External Notes storage, permissions, migration and external visibility. |
| FRO-328 | Readiness email preparation, read-only review, explicit Send, eligibility, delivery, idempotency and audit. |
| FRO-329 / FRO-332 | Order route/MRN/monetary cleanup; retained Order DN references and duplicate colli reference retirement. |
| FRO-294 / FRO-295 / FRO-297 | Retired colli Notes/PCS; handling flags and optional DG detail contracts. |
| FRO-337 | Unit price, exact calculated total, precision, range, currency and invoice-row update contracts. |
| FRO-349 / FRO-355 | Supplier Invoice creation entry and direct/inherited Entry Note lookup and navigation. |
| FRO-316 / FRO-335 | Shared Shipment/Order visual structure, with production components and tokens authoritative. |
| FRO-330 | Separately owned split-relationship enhancement; retain this page's existing lineage contract until it is delivered. |

FRO-326 owns presentation, integration, card drafts and standalone Edit-page retirement. Linked tickets retain domain/API/migration ownership. Do not treat a preview as evidence that a dependency has shipped. Keep earlier editing paths active until the required Details editors and contracts are available; do not enable a partial replacement that removes a retained capability. No linked-ticket edits are included here.

## Details fields

| Field | Type / control | Required behavior |
| -- | -- | -- |
| Client, Vessel | Entity values, read-only | Preserve saved identities. |
| Current warehouse | Derived, read-only | Use `currentWarehouseStay.warehouse.code · storagePosition`; null position is Unpositioned / Χωρίς θέση, absent stay uses the existing missing-value fallback. Do not infer custody from destination/history or make warehouse editable. |
| Supplier | Dropdown, authorized company reference | Store ID; preserve existing optionality, validation and eligible references. |
| Invoice company | Dropdown, authorized assigned company | Preserve Client/Vessel assignment eligibility; consume FRO-303 for restricted corrections and conflicts. |
| Owner reference / Supplier reference / Message number | Existing String inputs | Preserve current requiredness and validation, including nonblank Owner reference. Owner reference is read-only on child Orders. |
| Expected readiness date | Date, read-only in field grid | Existing `readinessDate`; changes only through eligible readiness/correction workflows. |
| Greece / Ελλάδα | Boolean checkbox | Preserve `pickupInGreece`; never infer it from warehouse, Pickup or route. No Collection agent requirement. |
| Pickup / Παραλαβή | Optional nullable Boolean; Yes/No dropdown with clear/unset interaction | Yes means Front Line is responsible for supplier collection; No means it is not. Unset is not No. Omission preserves; explicit clear unsets. No lifecycle, collection-completion, routing or email effect. FRO-333 owns one-time copying on both split paths and subsequent independence. |
| DN Import / DN Export | Independent optional String inputs, max 255 each | Existing Order `deliveryNoteImport` / `deliveryNoteExport`; show once, absent as —. Not attachments or document-issuance commands. |
| Customs regime | Explicit saved value / authorized selector | FRO-356: Ελεύθερη Κυκλοφορία, Τελωνειακή Αποθήκευση, Τελωνειακή Αποταμίευση. No inferred/default choice. |
| ΑΛΚ | Optional digits-only String, max 50 | Preserve leading zeros; applicable only with Greece=Yes and Τελωνειακή Αποταμίευση. Blank is valid and may be entered later. |
| Urgent / Urgent information | Boolean / optional multiline String, max 1,000 | Separate fields; keep information visible and independent of the checkbox. No invented requiredness or automatic clearing. |
| Status, lineage | Derived/read-only except authorized readiness correction | No unrestricted lifecycle editing. |

Omit retired Order origin/destination country/city, MRN, Value excluding VAT, Value including VAT and Duties with their currency pairs, Collection agent, ΚΤΑ and derived route presentation. Do not submit them through hidden defaults. Preserve separately owned invoice/customs/Shipment data and linked cleanup/reconciliation rules; UI omission grants no deletion or reassignment authority.

## Editing, confirmation and drafts

Use one shared **Edit** on Order details. Server authority, identity/company scope, lifecycle, reservation and version checks remain authoritative. View-only users see permitted values without mutation controls.

| Editing mode | Scope |
| -- | -- |
| Ordinary Details | Existing PURCHASE_ORDER_EDIT rules in PENDING, EXPECTED_READINESS, READY and IN_STOCK, subject to reservation/open-Shipment restrictions. Change only permitted ordinary fields. |
| Readiness correction | Independently authorized correction among PENDING, EXPECTED_READINESS and READY under FRO-346; no later/exception state offered. Ordinary-only editors can still save ordinary fields. |
| Later Invoice company correction | FRO-303 additionally permits PREPARED_FOR_SHIPMENT, SHIPPED, AWAITING_IMPORT, ARRIVED_AT_DESTINATION and LOCATION_UNKNOWN. Unlock only Invoice company; require an active eligible assigned company, reject clearing. Not CANCELLED. |
| ΑΛΚ-only correction | FRO-356 permits its narrow operation in every non-cancelled stage where applicable. Unlock only ΑΛΚ and show authorized shared-registration impact. |
| Multiple restricted capabilities | Shared Edit offers one eligible correction per session. Do not combine Invoice company and ΑΛΚ into an undefined transaction or sequential partial saves. Other fields stay locked. |

**Save** is not unconditional merely because status is unchanged. Evaluate all applicable readiness, customs, fiscal and shared-coverage review triggers before writing. Show every proposed change and its applicable impact. Use the owning atomic contract; never orchestrate separately committed writes to simulate one save. If a combination lacks the required atomic contract, preserve the draft and require separate supported correction sessions before submission.

Readiness status changed from its saved value requires old → new confirmation, all ordinary changes, nonblank **Correction reason / Αιτιολογία διόρθωσης**, max 1,000, and a valid date when targeting EXPECTED_READINESS. Prefill a saved date; otherwise leave empty. Manual correction dates may be past, today or future under FRO-346. Returning the status to its original value removes the correction requirement, not other applicable review requirements. PENDING clears saved readiness date/remark; EXPECTED_READINESS uses the confirmed date and preserves remark; READY preserves date/remark. Reason belongs to audit, not Notes. Preserve physical journeys and correlate applicable audit events once to the same atomic save.

Invoice company correction changes the selected Order only. Show authorized blocking note/Shipment information; issued, in-flight or failed document conflicts block under FRO-303. Eligible unsubmitted drafts regroup atomically under required document authority. No-op does not regroup or audit. Do not rewrite issued documents or substitute Client for a missing Invoice company.

Customs rules follow FRO-356: validate against Opening warehouse before first admission and actual occupied custody after admission, not expected/inbound stays. Greece=No makes regime/ΑΛΚ inapplicable and empty. Greece=Yes requires a supported explicit regime. Capability unavailability blocks affected customs changes, not unrelated saves. Require explicit review before clearing ΑΛΚ, leaving Αποταμίευση or changing Greece to No; retain incompatible draft values until the user explicitly resolves them. Reject document/coverage conflicts. Shared ΑΛΚ updates apply atomically to verified registration coverage; ancestry or equal text alone does not establish coverage. Show covered Orders and effects before confirmation. Preserve genuine historical facts separately from current regime presentation.

Details, each Note, each colli and each invoice row have independent drafts and Save/Cancel. No whole-page Save. Tab/language changes retain drafts and expansion. Save failure retains inputs with actionable errors; stale state/version/authority/reservation requires refreshed review, never silent overwrite. Report success only after persistence and refresh authoritative fields, actions, counts and history without overwriting other drafts. Prevent repeat submission while pending.

Cancel editing/Escape discards only the relevant editor draft and restores saved values/focus. Cancel/close a confirmation writes nothing and returns to its editor retaining the proposed changes, reason/date and focus. Changing reviewed values invalidates the review. Navigating to another Order or leaving Details asks before discarding any open draft; browser unload uses the available browser confirmation. Staying preserves drafts. Never silently save on navigation.

Retire `/secured/purchase-orders/$purchaseOrderId/edit` only after every retained authorized capability has a destination here. Replace links with Details navigation and redirect old URLs to that Order's Details without rendering the old form or mutating. Preserve authentication, access and unavailable-record handling, creation's shared form and backend consumers.

## Lifecycle and readiness email

| Saved state | Main lifecycle action |
| -- | -- |
| PENDING | Set expected readiness: required date, optional remark; starts empty without a saved date. |
| EXPECTED_READINESS | Mark ready at supplier: confirm every active colli is ready; optional remark, max 1,000; no new date input. |
| READY | Record arrival and set PO in stock. |
| AWAITING_IMPORT | Confirm stock and measurements. |
| IN_STOCK | Start shipment. |
| PREPARED_FOR_SHIPMENT / SHIPPED | Open authorized linked Shipment when available. |
| Terminal/exception state without a next operation | No forward action. |

Display PENDING as **Awaiting Readiness Date / Αναμονή ημερομηνίας ετοιμότητας**, and EXPECTED_READINESS as **Received Readiness Date / Λήφθηκε ημερομηνία ετοιμότητας**; preserve enum values and the remaining localized state labels.

Preserve existing eligibility, reservation guards, command validation and irreversible confirmation. Stock entry retains the full-width measurements panel, storage position, all active-colli measurements, independent draft and review; no shortcut that skips validation. Set readiness transitions PENDING → EXPECTED_READINESS and records date/remark, actor/time. Mark ready transitions EXPECTED_READINESS → READY, preserves readiness date/remark and unrelated drafts, records actual transition/operation audit and READY_FOR_COLLECTION journeys for active nonterminal collis only. Neither action records collection or sends email. Cancel writes nothing; denied, failed or stale commands retain drafts. Recheck guards at submit and prevent duplicate execution.

Both readiness-email buttons appear in the Order status header and Available actions for authorized senders, sharing one eligibility state, review and command. Keep unavailable buttons visible with specific EN/EL reasons, including Ready/later states; view-only users have no send controls.

| Button | Enablement |
| -- | -- |
| Request readiness date | PENDING, no recorded date, authority and FRO-328 manual eligibility satisfied. |
| Confirm readiness date | EXPECTED_READINESS, recorded date, authority and FRO-328 manual eligibility satisfied. |

An inherited-date PENDING child and an EXPECTED_READINESS record without a date enable neither. Preserve scheduled-ASK prerequisite, pending-reminder exclusion and Athens weekday/window eligibility. Date alone never overrides lifecycle or server guards.

Prepare a **read-only recipient, subject and body review**, with no recipient/content overrides. Prepare/Cancel sends and queues nothing. Only explicit Send confirms the prepared context. Changed supplier/contact, status/date, authority or content requires renewed review. Accepted confirmation retries must not duplicate reminders. Show queued as pending, never sent; actual delivery yields sent/failed. Refresh both locations and reminder history; restore focus to the originating button. Send does not change readiness or confirm supplier readiness. Scheduled reminders and supplier responses remain under FRO-328.

## Notes, relationships and history

Internal and External Notes are independent optional plain text, max 2,000 each, with separate Edit/Save/Cancel. Trim surrounding whitespace on new/edited text, preserve internal line breaks, escape HTML and show — when empty. Explicit clear differs from omission; use version protection and ordinary Order editing guards. Internal Notes are staff-only and absent from all external client, supplier and agent responses; External Notes alone feed the stock-list PDF, with no Internal fallback. Do not synchronize Order and Shipment notes.

Split relationships show authorized root, direct parent, direct children and root-family records from `rootPurchaseOrderId`, `parentPurchaseOrderId`, `childPurchaseOrderIds` and `lineagePurchaseOrders`. Route by database ID, display internal number with existing ID fallback; never infer ancestry from suffixes or expose unauthorized records. Related links navigate to Details in the same tab subject to dirty-draft confirmation; mark current record without a self-link. Preserve missing/unsplit/nested-child behavior.

Order activity contains Warehouse stays → PO status history → Recorded operations. Preserve actual custody timestamps, storage position, transitions, actors, reasons and root-to-current source-Order provenance; no copied ancestor audit rows or future events presented as completed. Newest-first timestamped records use naturally wrapping `timestamp · actor — event/comment · reason/remark`; no truncation. Readiness-setting operations do not repeat the readiness date as trailing metadata.

Comments has top-right Add comment, a labelled multiline editor, nonblank validation, Add/Cancel, actual actor/time/provenance and existing permissions. Failure retains draft. Do not make comments internal-only or broaden access.

Reminder history shows Created (full localized time), Request (type and automatic/manual origin), Recipient (name/email) and actual Delivery status, newest first. Include loading/empty/error/refetch. Opening/cancelling preparation creates no history; queue success adds returned pending data. Preserve failed records and existing retry authority without inventing a new retry command.

## Collis

Default collapsed continuous rows share these headings: selection · Colli · Flags · Dimensions (cm) · Gross weight (kg) · Net weight (kg) · Actions. Vertically center headings. Identity/expand control and terminal notice stay in the Colli column. Description and Package type belong only in expansion. Multiple expansions and drafts are independent; selection is independent of flags/expansion. Terminal rows remain visible, expandable and unselectable.

Per-row Edit opens that expansion and unlocks only its permitted fields. Save applies that row; Cancel restores it. Preserve identity/history, other rows and drafts, authorized state/reservation checks, explicit prohibition of Add/Edit/Remove during open-Shipment participation, and authoritative refresh. Net weight is never derived from gross. Retain existing numeric validation, units and missing values.

| Field | Contract |
| -- | -- |
| Description | Existing free text, expanded. |
| Package type | Authorized enum: PALLET, WOODEN_BOX, FUMIGATED_WOODEN_BOX, SKELETON_WOODEN_BOX, FUMIGATED_SKELETON_WOODEN_BOX, SKELETON_METAL_BOX, CARDBOARD_BOX, METAL_BOX, METAL_CAN, BARREL, PLYWOOD_BOX, PLASTIC_BOX, FUMIGATED_PALLET, ENVELOPE, OTHER; existing localized labels. |
| Dimensions / gross / net | Existing declared numeric cm/kg fields, editable in summary; preserve optionality and validation. |
| DG / Fragile / Unpacked / Damaged Packing | Four independent booleans in summary only. Damaged Packing never means terminal DAMAGED. |
| Class of DG | Optional FRO-297 class 1–9 dropdown, expanded only when DG. |
| UN / DG details | Optional plain text, max 200; preserve wording/line breaks, reject overlength without truncation. Expanded only when DG. |

DG=false clears both conditional fields atomically despite stale input; Cancel restores saved fields. Keep DG controls aligned without fixed heights that clip Greek text. Saved Order DG reflects only current nonterminal member collis, never drafts, terminal-only DG or other split Orders. Preserve genuine recorded history; no legacy Bonded-derived current-regime indicator.

Add colli creates an independent draft: blank description/dimensions/weights, Cardboard box, false handling flags. Add identical is enabled only with eligible checked rows and creates one independent copy per selected saved colli; copy editable fields, not ID/tracking/custody/history/disposition/reservations. No chooser or automatic last-row copying. Unsaved additions are ineligible for operational selection; Save creates a fresh identity, Cancel removes only the draft.

Saved Remove uses existing correction semantics: retain identity/membership/history and record CANCELLED with standard reason `Removed during purchase order colli correction`, actor/time, terminal journey and activity audit. Retain the row for inspection, remove it from future operations and selection. Protect the last saved active/editable colli; terminal rows cannot be removed here. Unsaved removal has no audit. Refresh active count, selections, DG aggregate and arrival measurements without orphan drafts. Remove and explicit terminal disposition remain distinct operations.

Footer controls remain adjacent: Split collis · Record terminal colli disposition · Clear; reasons beneath, no numeric rule heading or visible selected count. Split requires authority, PENDING/EXPECTED_READINESS/READY, no open Shipment, at least two active collis, nonempty eligible selection and a separate nonblank operational reason using existing OTHER contract. Terminal disposition requires authority, ordinary editable state, no open Shipment and exactly one active selected colli; DAMAGED/UNCOLLECTABLE/MISSING/CANCELLED/OTHER plus nonblank reason, review and irreversible confirmation. No bulk terminal operation. Recheck eligibility on submit; Back retains draft, Cancel/Escape discards the operation draft, failures retain it.

Remove PCS, per-colli Notes and duplicate Import Delivery Note from summary, expansion, drafts and payloads under their owners. Remove empty Colli documentation. Preserve Description, Order Notes, invoice quantity/unit, weights, files and the actual Order's DN Import/Export. Never choose, concatenate or overwrite conflicting legacy references; consume FRO-332's reconciliation and provenance.

## Invoice rows and documents

Invoice table columns: Line number · Description · HS code · Quantity · Unit · Unit price · Currency · Total value · Actions. Line number is derived order, not editable identity. Maintain per-row Add/Edit/Save/Cancel/Remove, independent drafts, empty collection support and ordinary Order editing guards. Open-Shipment participation prohibits invoice-row mutations.

| Field | Contract |
| -- | -- |
| Description / HS code | Required nonblank String max 1,000 / optional String max 100. |
| Quantity / Unit | Required positive Int / PC, SET or PKT. |
| Unit price | Required nonnegative exact decimal, at most two fractional digits; blank is not zero, zero valid. |
| Currency | Authorized reference options shared by Unit price and Total; no conversion on change. |
| Total value | Read-only exact Quantity × Unit price, server-authoritative. Price and total each max 99,999,999,999,999,999.99 under FRO-337. Invalid/incomplete draft displays —, not stale total. Display two decimals; currency-specific rounding deferred. |

New row defaults: blank Description/HS/Unit price, Quantity 1, Unit PC and existing available currency default. No permanent identity before save. Preserve unrelated saved rows when underlying API replaces the collection, using expected revision to reject stale saves. Keep other row drafts separate from saved payloads. Preserve audit; no VAT, discounts or invoice issuance. FRO-337 owns mock-data reset/regeneration; this page introduces no additional cleanup.

Documents reuses AttachmentPanel: paperclip/Attachments heading, muted description, Choose documents or photos, existing supported-file/size help and neutral attachment area. Preserve actual files, metadata, download, inherited owning-Order provenance/read-only rules and upload/remove authority. Loading/error states must not replace existing files with a fictitious empty result. Keep successful uploads visible and failed work retryable under the existing contract; no production writes during verification.

## Supplier Invoice and Entry Note actions

Create supplier invoice follows FRO-349: independent invoice-create authority/company scope, non-cancelled Order and Supplier eligibility. Existing invoices do not disable it. Open the normal creation page in the same tab with stable current Order-ID preselection and return context; preserve normal explicit reselection, derived read-only parties, cancellation and failed drafts. No duplicate quick-create form; opening/cancelling creates nothing.

Entry Note follows FRO-355/FRO-319. Resolve direct and inherited admission coverage. With no applicable current note, authorized Create opens FRO-353 with exact Order preselection and return context. With a direct or inherited current note, authorized Open targets FRO-354, shows owning-Order provenance and retains the originating child's return context. Recorded Export MRN does not permit duplicate Create. Loading, failure, unknown or conflicting coverage never proves absence; show disabled/error/retry feedback. Missing invoices/Export alone does not disable otherwise valid creation. Enforce separate create/read authority; view-only users may Open a readable note. Refresh on return/concurrent change. Do not copy Supplier Invoice eligibility into Entry Note.

## Decisions

| Decision | Reason |
| -- | -- |
| Direction A, stacked cards and production comfortable components | Consistent with the current design system and Order creation; wide-screen scanning without miniature controls. |
| One Details page with independent card saves | Retire duplicate editing UI without losing capabilities or conflating unrelated drafts. |
| Shared Edit includes narrow later-stage corrections | Preserve FRO-303/FRO-356 capabilities when ordinary editing is unavailable. |
| One restricted correction per session | Existing owners do not define a combined Invoice-company/ΑΛΚ transaction. |
| Current Pickup/customs contracts | Avoid inferred No, stale Bonded meaning and unresolved wording for settled behavior. |
| Confirm leaving dirty Details | Prevent accidental loss while retaining drafts across tab/language changes. |

## Preview and exclusions

Selected local preview source: `previews/fro326-comparison/full.html` with its local assets in the planning repository. It uses fictional records and explicitly simulated outcomes. Publishing is deferred; there is no new hosted URL or Pages project. The existing hosted Order preview and attachments are retained as historical references, not evidence of the selected preview being deployed.

Local review controls expose EN/EL, lifecycle/access fixtures, default/loading/unavailable/error, save failure/stale outcomes and direct/inherited/failed Entry Note lookup. Numbered business notes and New component markers are preview-only. Never ship simulation controls, fake records or in-memory persistence as production integration. Supplier Invoice/Entry Note buttons remain design-only in the prototype; production must navigate as specified. Split/disposition review must not fabricate completed operations. The description governs computation and behavior; the selected design governs presentation within production component rules.

Out of scope: backend/schema/migrations owned by dependencies, new authorities, Shipment routing, scheduled reminder/supplier-response changes, accounting calculations beyond FRO-337, production code publication, merge/deployment and Cloudflare publishing. Preserve all unrelated fields, files, relationships, histories and separately owned fiscal/customs records.

## Acceptance criteria

1. All six tabs, card order, field placement, action locations and direction A styling work in EN/EL and desktop/375–400px layouts using shared components; no production preview tooling or obsolete route/progress UI.
2. Ordinary, correction-only and combined Details saves follow FRO-346; IN_STOCK ordinary editing remains available. Later Invoice company and ΑΛΚ modes lock unrelated fields, use one restricted correction per session and enforce their own review/conflict contracts.
3. Customs tests cover all three regimes, Greece=No, optional/late ΑΛΚ, leading zeros, actual-custody/Opening-warehouse rules, unavailable capabilities, shared coverage, destructive confirmations and unrelated-save preservation.
4. Pickup unset/Yes/No/clear/omission behave independently; retired fields and hidden submissions are absent; retained DN references remain independent and correctly attributed.
5. Drafts survive tabs/language and failed/stale saves; confirmations cancel without writes; independent drafts are preserved; navigation discard works; repeat submission and silent stale overwrite are prevented.
6. Lifecycle readiness/stock actions retain guards, full inputs, irreversible review and real audit effects. Both email locations use identical eligibility/review, no prepare/cancel queue, explicit idempotent confirmation, truthful pending/sent/failed and renewed stale review.
7. Notes limits, clear/omit/version rules, plain-text escaping and external exclusion of Internal Notes hold. Comments, actual history/provenance and reminder loading/empty/error states remain intact.
8. Colli expansion/selection/editing/add/copy/removal, all package values, numeric validation, optional DG fields/clearing/200 limit, nonterminal DG aggregate and terminal-history preservation work. Split/disposition retain exact eligibility and confirmation, with no bulk terminal operation.
9. Invoice-row exact arithmetic, zero/blank/precision/range handling, invalid-total marker, positive integer quantity, authorized currency and stale collection-preserving saves work; empty collections remain valid.
10. Attachment upload/download/removal, inherited provenance and permissions remain intact. Supplier Invoice and direct/inherited Entry Note navigation/eligibility/lookup failure and return refresh follow their owners.
11. All retained editor capabilities are available before old Edit-route retirement; direct old URLs redirect safely, without mutation/access bypass; creation and backend consumers remain usable.

Run mutation, concurrency, retry, cancellation, authorization, file and audit tests in a safe test environment. Local prototype checks do not verify server transactions or production readiness.

## Context for agents

Repository: `Frontline-Forwarding/frontline-forwarding`; reviewed main `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. Refresh sources before implementation.

| Source | Implementation context |
| -- | -- |
| `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css`, `src/components/ui/`, `src/app/providers/theme-provider.tsx` | Authoritative tokens, comfortable default, controls, status tones and accessible overlays. |
| Client `src/components/layout/app-shell.tsx` | Reuse actual frame/navigation; do not implement a prototype-specific replacement. |
| Client `src/features/purchase-orders/components/purchase-order-detail.tsx` | Existing overview, lineage, operations and ordinary edit-link guards; later corrections require explicit integration. |
| Client `src/routes/secured/purchase-orders/$purchaseOrderId.edit.tsx`, `purchase-order-form.tsx`, `purchase-order-form-validation.ts` | Reconcile retained standalone capabilities and validations before redirect; preserve creation. |
| Client `src/components/ui/tabs.tsx` | Inactive panels unmount. Hoist independent draft state above panels to preserve it. |
| Client `purchase-order-status-pill.tsx`, `purchase-order-split-lineage-badge.tsx`, `purchase-order-table.tsx` in the purchase-order component folder | Status/lineage tones and current-warehouse display; lineage is not lifecycle. |
| Client `readiness-reminder-action.tsx` | Existing reminder presentation; consume FRO-328 preparation/confirmation rather than preserving a direct-send bypass. |
| Client `src/features/attachments/components/attachment-panel.tsx` | Existing types, file help, metadata, inherited provenance and authority. |
| Client purchase-order `types.ts`, `graphql/documents.ts`, localization; server `src/main/resources/graphql/purchase-orders.graphqls` | Authoritative contracts/options. Resolve handwritten six-package client type against the 15-value backend enum; never drop supported values. |
| Server `src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` | Existing ordinary guards, lifecycle commands, colli correction/terminal audit, readiness correction and validation. |
| `docs/reference/database.md`, `graphql-api.md`, `rest-api.md`, `mcp-tools.md`; `docs/architecture/authorization.md`; `docs/workflows/purchase-order-colli-journey.md` | Recheck storage/API consumers, authority, custody, splits and transitions; linked contracts extend current code and must be delivered before activation. |

## Post-deployment verification

Production checks are read-only. Never submit Save, Send, Create, upload, removal, split, disposition or stock commands. Missing fixture/evidence means unverified, not pass.

| Acceptance | Concrete read-only check |
| -- | -- |
| 1 | Open an existing Order; inspect all six tabs, card order, EN/EL and narrow layout; confirm no review tooling, route card or progress counter. |
| 2–3 | Inspect eligible ordinary and later-stage Orders. Open/cancel editors only; verify field locks and saved regime/ΑΛΚ values. Never press Save to reach a review in production. Verify Save-triggered coverage/conflict/confirmation screens and transaction outcomes using approved staging evidence. |
| 4 | Read saved unset/Yes/No Pickup examples and separate DN values; inspect retired-field absence. Use staging evidence for clear/omit behavior. |
| 5 | In an authorized read-only inspection, open/cancel drafts and inspect navigation protection without saving. Review staging stale/concurrency/retry evidence. |
| 6 | Compare displayed status/date and available actions with authorized read-only API data; open/cancel email review, compare recipients/content and confirm no new reminder record. Inspect actual history; use staging evidence for commands/delivery. |
| 7 | Inspect staff/customer read responses using appropriately scoped sessions; Internal Notes must be absent externally. Compare saved notes/comments/history/provenance with authorized reads, without posting. |
| 8 | Expand active and terminal collis; compare saved flags, optional DG data, permanent IDs and aggregate badge to authorized reads. Inspect operation availability without submitting; use staging evidence for mutations. |
| 9 | Read invoice rows and independently compare quantity × unit price with stored/displayed totals; inspect read-only totals and use staging precision/range/concurrency evidence. |
| 10 | Inspect/download an existing permitted attachment and inherited provenance. Inspect Supplier Invoice/Entry Note target, direct/inherited lookup, preselection and Cancel/return without creating. |
| 11 | Open an authorized old Edit URL; confirm redirect to matching Details, access/missing-record handling and editor availability without submitting. |

**Reference:** live production sources above; FRO-303, FRO-346, FRO-356 and the dependency ownership table. Historical hosted reference: https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/ .
