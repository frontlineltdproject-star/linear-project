**As an office operator I want to create a Shipment from its route and exact selected collis on one tabbed page, with an optional transport-document number and a Creation review before saving**, so that preparation starts before repacking, readiness confirmation and dispatch. The same page also records an already-arrived warehouse shipment.

**Order = Purchase Order (`purchase_order`) = stock-list item.** A **colli** is a permanently identified handling unit. Creating a **Preparing** Shipment needs at least one eligible colli. Recording a historical **Arrived** Shipment needs at least one complete eligible Order. Repacking is not part of creation.

**UI reference:** this description and the **Component map** are the contract. Historical UI — an earlier static preview, superseded wherever it differs from this description: [Shipment creation preview (historical)](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site).

## Scope and dependencies

| Ticket | Owns | FRO-341 presents |
| -- | -- | -- |
| FRO-325 | Persistence, exact participation, atomic child splits and reservations, optional creation document number, READY_FOR_DISPATCH, packing, readiness, dispatch, authorization, API contracts | Creation fields, partial decisions, Creation review |
| FRO-339 | Shipment country/city storage, requiredness, city-based warehouse compatibility (on `release/0.0.2`) | The four geography selectors and filtered warehouse choices |
| FRO-324 | Historical Arrived operation, eligibility, stay matching, chronology | Status → Arrived, arrival dates, whole-Order selection, review |
| FRO-320 | **Warehouse transfer** naming over the NETWORK_TRANSFER contract | Purpose dropdown and combined destination-warehouse list |
| FRO-323 | Selection from arrived shipments: eligibility, current-membership resolution | **From arrived shipments** view |
| FRO-343 | Saving an Order during Shipment creation, eligibility after save | **Create new order** entry and return |
| FRO-342 | Pending uploads before creation, atomic association, cleanup, idempotency | **Documents** tab and file feedback |
| FRO-292 | Internal / External Notes storage, permissions, visibility | **Notes** card |
| FRO-316 | Shipment Details page, including repacking after creation | — (FRO-341 must not ship before repacking is live there) |

## Page structure

* Page title **Create shipment** in the production **TopBar** — no description, no heading card.
* One **Card** with the **Tabs** **Overview · Orders and Collis · Documents**. Overview is the default; `?tab=orders` and `?tab=documents` open those tabs directly.
* **Overview:** **Shipment details** → **Shipment purpose** → **Notes**.
* **Orders and Collis:** **Select purchase orders and collis** → **Partial selections**.
* **Documents:** **Attachments**.
* **Create shipment** (**Button** primary, size lg): below the tab card, right-aligned, available from every tab. It opens **Creation review**; it is the page's only primary action.
* No wizard, step numbers, Next/Back, subtitles or introduction paragraphs. Section headings carry no numeric prefixes.
* Every field value, selection, decision, note and pending file is kept when switching tabs, language or Status, and when opening or closing any modal.

**Entry from an Order:** the route keeps `originWarehouseId`, `purchaseOrderId` and `purchaseOrderIds`. A preselected origin warehouse fills **Origin country** and **Origin city** from that warehouse's city. This is the only case where a warehouse fills geography; the operator can still change them. The preselected Orders stay selected while they remain eligible at that origin.

## Shipment details

**Shipment status** subcard at the top:

| Field | Type / format | Rules |
| -- | -- | -- |
| **Status** | Dropdown — **Preparing** / **Arrived** | Required; default **Preparing**. **Arrived** starts FRO-324's historical operation; it is not a free status assignment. |
| Status indicator | Display only | Four steps: **Preparing → Ready for dispatch → Dispatched → Arrived**. The selected status is the current step (`aria-current="step"`). For Arrived, earlier steps show as not recorded. Steps are not controls. Shown once FRO-325 adds READY_FOR_DISPATCH. |

Below the subcard is a four-column grid (two columns at ≤1100px, one column on narrow screens):

| Row | Fields |
| -- | -- |
| 1 | **Origin country** · **Origin city** · **Destination country** · **Destination city** |
| 2 | **Origin warehouse** · **Mode** · **Document type** · **Document number** |
| 3 | **Date dispatched** · **Date arrived** |

| Field | Type / format | Preparing | Arrived |
| -- | -- | -- | -- |
| **Origin country** / **Destination country** | Dropdown (reference data) — `countries`; stores the ID | Required | Origin optional; destination required |
| **Origin city** / **Destination city** | Dropdown (reference data) — `cities(countryId)`; stores the ID | Required; disabled until its country is selected | Origin optional (known country with unknown city is valid); destination required |
| **Origin warehouse** | Dropdown — authorized active warehouses in the selected origin city | Required | Optional; if selected, its city must match the selected origin city |
| **Mode** | Dropdown — **Road** / **Air** / **Sea** | Required | Optional; blank means unknown (not a new mode value) |
| **Document type** | Derived, read-only | Road → **CMR**, Air → **Air Waybill (AWB)**, Sea → **Bill of Lading (B/L)** | **Transport reference** when mode is unknown |
| **Document number** | String, max 255 | Optional; blank is absent | Same |
| **Date dispatched** | date (date-only) | Visible, disabled, not submitted | Optional |
| **Date arrived** | date (date-only) | Visible, disabled, not submitted | Optional; not before Date dispatched; neither date in the future |

**Geography rules (FRO-339):**

* Changing a country clears its city.
* Warehouse choices are filtered by the selected city reference (`cityId`), not by text. Warehouses with no city on record are never offered.
* Selecting a warehouse never fills or overwrites geography, except on entry from an Order (above).
* Changing a city clears a selected warehouse that is no longer in that city.
* Clearing or changing the origin warehouse clears the colli selection and partial decisions. Other draft values are kept.
* With no match, the disabled selector shows **No matching warehouse in the selected destination city** (origin wording for the origin selector). The required warehouse stays unresolved and creation is blocked.
* The server rejects a city that is not in its country, and a warehouse outside the selected city. A rejection keeps the draft.

**Document number:** changing the mode updates Document type and the review label; it never converts or invents a number. A number already used by another Shipment shows an inline error and keeps the draft. A missing number does not block creation; dispatch requires one (FRO-325). Entering a number has no departure effect.

**Dates:** a blank date stays absent. It is never filled with today's date or the recording time, which remains system-derived and is not shown on this page.

## Shipment purpose

| Field | Type / format | Rules |
| -- | -- | -- |
| **Purpose** | Dropdown — **Warehouse transfer** / **Third-party agent** / **Direct delivery on board** / **Via agent or launch station** | Required. Internal values NETWORK_TRANSFER / THIRD_PARTY_TRANSFER / DELIVERY_TO_VESSEL / DELIVERY_TO_LAUNCH_STATION. Arrived allows only **Warehouse transfer** (dropdown disabled). |
| **Destination warehouse** (Warehouse transfer) | Dropdown — active Frontline hubs and associated-agent hubs in the selected destination city, excluding the origin warehouse | Required. Shows operator · code · name. Disabled until the destination city is selected or when none match. |
| **Destination details** (agent purposes) | Dropdown — existing authorized active agents | Required |
| **Destination details** (Direct delivery on board) | Derived, disabled | Shows the vessel shared by the selected Orders. If the selected Orders reference different vessels, an error is shown and creation is blocked. |

Changing Purpose clears the destination value only. Warehouse arrival still follows **AWAITING_IMPORT → stock confirmation → IN_STOCK** for both warehouse kinds.

## Notes

| Field | Type / format | Rules |
| -- | -- | -- |
| **Internal Notes** | Free text, multiline | Optional; plain text, empty by default |
| **External Notes** | Free text, multiline | Optional; plain text, empty by default |

The notes are submitted with creation through FRO-292's contract; there is no separate save. Nonempty notes appear in Creation review.

## Orders and Collis

### Select purchase orders and collis

**By purchase order** · **From arrived shipments** sub-tabs (Preparing only; Arrived shows only the Order list).

**By purchase order:**

* Search (**Search PO, vessel, reference, or tracking code**) plus **Create new order** (secondary button) beside it.
* Table columns: Select · PO / colli · Status · Client · Vessel · Selection. Each Order row shows its status pill and selected/total count.
* Each Order is collapsed by default. A chevron icon button at the far right of the row expands it: translated `aria-label` with the Order ID, `aria-expanded`, `aria-controls`. Expanding shows the colli rows (permanent ID, description, dimensions).
* Collapsing never clears a selection. Whole-Order selection works while collapsed. Expansion state survives tab and language changes.
* **Preparing eligibility (production):** Orders at the selected origin that are IN_STOCK, READY, or EXPECTED_READINESS with a readiness date of today or later. Only IN_STOCK Orders may be selected partly. Upcoming Orders are selected whole; their colli checkboxes are disabled with the reason.
* **Arrived:** Orders compatible with the receiving warehouse under FRO-324. Whole current nonterminal colli sets only; no splitting. Excluded or conflicting Orders show their reason (for example the reserving Shipment). Each Order shows **New arrival — AWAITING_IMPORT** or the matched existing stay with its date. Changing the receiving warehouse clears this selection and the match.
* Switching Preparing ↔ Arrived keeps separate selections; selections never cross between the two.

**From arrived shipments (FRO-323):**

* Search by Shipment number or CMR/AWB/B/L number. Only ARRIVED Shipments whose destination warehouse is the selected origin are listed, with paginated results.
* One shared header — Select · Shipment number · Route · Transport document type · Transport document number · Available collis — and one compact row per source. Shipment numbers use the muted teal text token. Missing values show **—**. Counts are per source, with no cross-source deduplication.
* The leading checkbox selects or removes all currently available identities of that source. It shows indeterminate for a partial selection and is disabled when none are available.
* A far-right chevron shows or hides the contents, collapsed by default. Contents are grouped by current Order (Order ID only). Each row shows Client, Vessel, the permanent colli ID, Selection and Availability (status or exclusion reason, no warehouse name).
* Only IN_STOCK, nonterminal, unallocated goods at the selected origin can be selected. Departed, other-warehouse, awaiting-stock-confirmation, reserved and terminal goods show why they are excluded.
* Selections from several sources and from By purchase order are combined and deduplicated by permanent colli ID, and can be removed from either view.
* Only the colli selection is copied — never the source route, purpose, mode, document, dates, handover, load units or old Order attribution. The source Shipment is not changed.
* Changing the origin clears the selection and reloads the sources. Loading, empty, zero-availability and error-with-**Retry** states are distinct; a lookup failure keeps the draft.

**Create new order (FRO-343):**

* Opens a large **Modal** containing FRO-335's Create Order card: all four tabs **Overview · Collis · Invoice rows · Documents** and its complete fields, with no separate heading card. Actions are **Cancel** / **Create**.
* **Create** returns to Orders and Collis with the new Order's eligible collis selected and the rest of the draft unchanged.
* **Cancel**, the close control or Escape add nothing.
* Repeated activation creates at most one Order. Orders with no eligible collis are shown with the reason; no packages are invented.

### Partial selections

Always visible.

| Selection state | Content |
| -- | -- |
| Nothing selected | **No partial selections to confirm.** |
| Only whole Orders | **Every selected PO is included in full. No child PO is needed.** |
| Arrived | Short whole-Order message; no decisions |
| IN_STOCK Order with some but not all eligible collis selected | One compact row per Order |

Each compact row contains:

* Order ID and remaining count, plus the remaining colli IDs (wrapping).
* **Reason** — Dropdown: **Operational separation** / **Uncollectable remainder** / **Other** (OPERATIONAL_SEPARATION / UNCOLLECTABLE_REMAINDER / OTHER); required.
* **Remark** — String; required and nonblank for **Other**.
* **Include remaining collis** — selects the rest and drops that decision.

With two or more partial Orders, **Apply one decision to all partial POs** copies a reason and remark to each Order; each can then be adjusted. Rows reflow on narrow screens without horizontal overflow. Decisions are kept while the Order stays partial and discarded when it no longer is. The child Order is created atomically at submission (FRO-325); unselected and terminal collis stay on the parent.

## Documents

The production **AttachmentPanel** (paperclip **Attachments** heading, **Choose documents or photos**, hint, dashed empty state), extended for files pending creation (FRO-342):

* PDF, images (JPG/JPEG, PNG, WebP, GIF), Word, Excel, CSV and TXT. Files must be nonempty, at most 25 MB each, with a filename of up to 255 characters. Production validation is authoritative.
* Pending row: filename, DOCUMENT/PHOTO kind, size, uploader/time, and the state **uploading** (progress), **ready** (**Pending** badge; download available) or **error** (message plus **Retry** for recoverable errors). **Remove** is available on every row. No storage URLs or paths are shown.
* Empty state: **No attachments uploaded.** Creation without files is supported.
* Creation is blocked while any file is uploading or failed.
* Files attach to the Shipment only on successful creation. A failure keeps valid pending files for retry, with no partial records.
* Attaching a file never sets the document number, geography, membership, status or readiness.

## Creation review

A **Modal** opened by **Create shipment**, built from the current draft. Opening it never creates anything. Invalid drafts can be reviewed.

| Area | Content |
| -- | -- |
| Outcome | **PREPARING** — creation reserves the selected collis and creates any child Orders, without confirming readiness or recording departure. **ARRIVED** — the whole Orders are linked to this arrival, and stock confirmation stays a separate step. |
| Counters | **Purchase orders** (participating Orders only) · **Collis shipping** (selected identities) · **Collis remaining** (unselected collis within participating Orders) · **Declared gross** (sum of selected collis' gross weight; missing weights are shown as a missing count, not zero) |
| **Route and commercial plan** | Origin country, Origin city, Origin warehouse, Destination country, Destination city, Destination warehouse / details, Purpose, Mode, the CMR / AWB / B/L number or **Not recorded**, nonempty notes. Arrived adds both dates; unknown values are shown as unknown. |
| **Validation** | Country and city references complete and compatible · Route and destination compatible · At least one colli selected · Every partial PO has a decision (Preparing) or dates in order and not in the future (Arrived) · Document number valid · Selected files ready |
| **Purchase-order allocation** | Per Order: ID, Client, Vessel, selected/total collis (Arrived: new arrival or matched stocked stay). Per colli: permanent ID, Description, Dimensions (cm), Gross weight (kg). |
| Child effect | For partial Orders: a warning naming how many in-stock child Orders and collis will be created, the remaining colli count per parent, and the reason/remark. Prospective children are not shown as saved records. |
| Files | Selected filenames with their state, and **Review selected files** (closes the review, opens Documents) |

* **Back to editing**, the close control, Escape or a backdrop click close the modal without changing the draft; focus returns to **Create shipment**. Focus stays inside the modal while it is open, and the body scrolls on narrow screens.
* **Confirm and create shipment** (Arrived: **Confirm and record arrival**) is enabled only when every validation check passes. It is disabled while saving to prevent duplicate submission.
* **Preparing** success: FRO-325's atomic creation returns PREPARING and opens Shipment Details for the new Shipment. It does not set READY_FOR_DISPATCH, mark Orders SHIPPED, close origin stays or dispatch.
* **Arrived** success: FRO-324's atomic operation; no readiness, source-stock or dispatch facts are invented.
* **Rejection:** the modal stays open with actionable errors linked to the affected field, file or colli. The full draft is kept, and stale eligibility is refreshed. Partial success is never reported.

## Component map

| Element | Production component |
| -- | -- |
| Page title | `TopBar` — `components/layout/top-bar.tsx` |
| Tabs and sub-tabs | `Tabs` / `TabList` / `Tab` / `TabPanel` — `components/ui/tabs.tsx`; add ArrowLeft/ArrowRight/Home/End with roving tabindex |
| Cards | `Card` / `CardHeader` / `CardTitle` / `CardBody` — `components/ui/card.tsx` |
| Status, Mode, Purpose, Reason | `Select` — `components/ui/select.tsx` via `components/form/select-field.tsx` |
| Countries, cities, warehouses, agents | `Combobox` — `components/ui/combobox.tsx` |
| Labels, hints, errors | `FormField` / `Label` — `components/ui/input.tsx` |
| Document type, Document number, search, remark | `Input` — `components/ui/input.tsx` |
| Dates | `DatePicker` — `components/ui/date-picker.tsx` via `components/form/date-field.tsx` |
| Notes | `Textarea` — `components/ui/input.tsx` |
| Tables, selection | `Table` / `THead` / `TR` / `TH` / `TD` — `components/ui/table.tsx`; `Checkbox` — `components/ui/choice.tsx` |
| Order status | Purchase-order status pill — `features/purchase-orders/components/purchase-order-status-pill` |
| Buttons | `Button` — `components/ui/button.tsx` |
| Attachments | `AttachmentPanel` — `features/attachments/components/attachment-panel.tsx`, extended for pending files |
| Review, Create Order overlay | `Modal` — `components/ui/modal.tsx`; `MetricCard` — `components/ui/card.tsx`; `Alert` — `components/ui/alert.tsx`; `Badge` — `components/ui/badge.tsx` |
| Loading, errors, success | `components/feedback/loading-placeholder.tsx`, `ErrorMessage`, `useToast` |
| New compositions | Status subcard with indicator; compact partial-selection row; arrived-shipment source table; pending-file rows — composed from the primitives above |

Use semantic tokens, the type scale (`text-title`, `text-subheading`, `text-body-sm`…) and density spacing from `src/styles/theme.css` / `DESIGN.md`; no hardcoded colors or pixel font sizes. Every label exists in EN and EL through the labels provider, with no fixed heights that clip Greek text. Desktop and ~400px are both usable without page-level horizontal scrolling.

## Decisions

| Decision | Reason |
| -- | -- |
| No **Declared pcs** counter | Per-colli PCS is retired (FRO-295); without repacking at creation, transport pieces equal Collis shipping. |
| Entry from an Order prefills origin geography from the preselected warehouse | Keeps the Order-page shortcut usable under geography-first selection; the operator can still change it. |
| Blocked by FRO-316 | Creation no longer offers repacking; Shipment Details must provide it first. |
| Notes are two plain text boxes | No saved record exists yet; no new component is needed. |
| Warehouses with no city are hidden | FRO-339's server rejects them; offering them would only produce an error. |
| Production components, TopBar, one primary action | DESIGN.md: semantic tokens, type scale, one teal primary action per view. |

## Out of scope

* Repacking, load units, readiness confirmation, dispatch and document updates after creation (FRO-316 / FRO-325).
* Backend contracts, persistence, authorization and migrations of FRO-292, FRO-320, FRO-323, FRO-324, FRO-325, FRO-339, FRO-342 and FRO-343.
* Shipment Details (FRO-316) and Order creation fields (FRO-335).
* An autosaved Shipment draft, or a file-retention period beyond FRO-342.

## Acceptance criteria

1. The page shows the TopBar title with no subtitle and the three tabs with Overview as default; `?tab=orders` opens Orders and Collis. Arrow/Home/End keys move between tabs. Draft values, selections, decisions, notes and files survive tab, language and Status changes.
2. Overview contains Shipment details (status subcard and the three grid rows above), Shipment purpose, then Notes. Orders and Collis contains the selection card, then Partial selections. There are no step numbers, Next/Back or repacking.
3. Opening from an Order with `originWarehouseId` prefills origin country/city and keeps the preselected Orders selected.
4. Cities and warehouses are disabled until their prerequisite is selected. Changing a country clears its city. Changing a city clears an incompatible warehouse, and changing the origin warehouse clears the selection. Warehouses with no city never appear. With no match, the no-matching message is shown and creation is blocked.
5. Road/Air/Sea show CMR/AWB/B/L. A blank document number allows creation; a duplicate or over-255-character number shows an inline error and keeps the draft.
6. The Purpose dropdown offers the four purposes (Arrived: Warehouse transfer only). Warehouse transfer lists both warehouse kinds in the destination city, excluding the origin. Direct delivery shows the derived vessel and blocks Orders with different vessels.
7. Upcoming Orders can only be selected whole. Partial IN_STOCK selections show compact rows; Reason is required and Other requires a remark. Bulk apply, Include remaining collis and the two empty messages behave as specified.
8. From arrived shipments lists only ARRIVED sources at the selected origin, copies only available colli selections, deduplicates across views, and shows excluded goods with their reason.
9. Create new order opens the full FRO-335 card in a modal. Create returns with the new Order's eligible collis selected; Cancel/Escape add nothing; repeated Create adds one Order.
10. Documents accepts the listed types up to 25 MB, shows uploading/ready/error/retry/remove, and blocks creation while a file is incomplete or failed.
11. The Creation review shows the four counters, Route and commercial plan, the validation checks, allocation, child effect and files. Confirm is disabled until valid. Escape or Back keeps the draft and returns focus.
12. Preparing creation returns PREPARING with exact participation and any child Orders, then opens Shipment Details. There are no readiness or departure effects, and duplicate submissions are prevented.
13. Arrived: the dates are enabled and optional, origin and mode may be unknown, only whole Orders can be selected, and the review shows ARRIVED with existing-stay matches. Saving uses FRO-324's operation.
14. Server rejection keeps the full draft and shows actionable errors.
15. EN/EL labels do not clip; desktop and ~400px are usable.

## Context for agents

* Current page: `frontline-forwarding-client/src/routes/secured/shipments/new.tsx` (search params `originWarehouseId`, `purchaseOrderId`, `purchaseOrderIds`; navigates to `/secured/shipments/$shipmentId` on success) and `src/features/shipments/components/shipment-composer.tsx` (five-step wizard with optional load units; replaced by this page).
* FRO-339 is on `release/0.0.2` (commit `09394e5218`), not yet on `main`. There, `ShipmentCreateInput` requires `originCountryId`, `originCityId`, `destinationCountryId`, `destinationCityId`, and `ShipmentGeographyPolicy` requires each warehouse's `cityId` to equal the shipment city ("complete its address before using it" when the city is missing). The composer on that branch already has the geography selectors and labels reused here.
* `ShipmentStatus` on `main`: PREPARING, DISPATCHED, ARRIVED, CANCELLED, LOCATION_UNKNOWN. READY_FOR_DISPATCH comes with FRO-325.
* `freight_shipment.transport_document_number` is `varchar(255)` with a unique partial index (`docs/reference/database.md`). The type is derived from the mode (`transportDocumentTypeForMode` in `src/features/shipments/types.ts`).
* Eligibility and the partial-split rule: `docs/workflows/shipment-lifecycle.md`. Attachment rules: `docs/workflows/attachments.md` (SHIPMENT_EDIT for upload/removal).
* Per-colli PCS was removed by FRO-295 (`main` 5c51030); the current review has no PCS.
* The production Greek labels are `shipmentComposerGreekText` in `src/app/providers/labels-provider.tsx`.
* `Tab` in `components/ui/tabs.tsx` has no arrow-key handling today.

## Post-deployment verification

Read-only checks on the deployed client; no submit or save in production.

1. Open `/secured/shipments/new`: TopBar title only; the tabs Overview · Orders and Collis · Documents; Overview active; `?tab=orders` opens Orders and Collis (AC 1–2).
2. Open `/secured/shipments/new?originWarehouseId=<id>&purchaseOrderIds=<id>` from an Order: origin country/city are prefilled and the Order is selected (AC 3).
3. Change origin country/city and destination city; confirm the cascading clears, warehouse filtering and no-match message. Compare the offered warehouses with the warehouse list's cities (AC 4, 6).
4. Switch Mode and read Document type (AC 5).
5. Select part of an IN_STOCK Order and inspect the Partial selections row and the disabled Confirm until a Reason is set (AC 7, 11). Close the review without confirming.
6. Open From arrived shipments and compare listed sources with ARRIVED Shipments to the selected origin in the Shipments list (AC 8).
7. Open Create new order and cancel; confirm nothing is added (AC 9).
8. Choose a file in Documents and remove it before creating (AC 10).
9. Switch Status to Arrived: dates enabled, purpose locked, whole-Order selection (AC 13).
10. Switch to EL and to ~400px width; check for clipping and overflow (AC 15).
11. For an already-created Shipment, read Shipment Details and the shipment GraphQL read: status PREPARING, no dispatch date, expected participating collis and child Orders (AC 12).

*Reference:* FRO-325 (structural contract); `Frontline-Forwarding/frontline-forwarding` `main` 5c51030 and `release/0.0.2` 09394e5218 — `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css`, `src/components/ui/*`, `src/features/shipments/*`, `docs/workflows/shipment-lifecycle.md`, `docs/workflows/attachments.md`.
