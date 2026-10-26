**As a** staff member handling a Shipment **I want** one Details page that shows the route, participating Orders, collis, packing, history and actions, and lets me complete pre-dispatch work **so that** I can prepare, confirm and dispatch a Shipment without opening each Order.

This is a **UI-only** ticket for the saved-Shipment page (`/secured/shipments/$shipmentId`). It owns layout, presentation, client integration, EN/EL labels and accessibility. Every field, read, rule, operation and permission comes from the structural tickets below; missing capabilities are added there, never invented here.

**Terms:** **Order** = purchase order = stock-list item (`purchase_order`). **Colli** = an individually identified handling unit. **Individual colli** = a participating colli that is not inside a load unit. **Load unit** = an optional pallet or cardboard box that groups collis (`ShipmentLoadUnit`). **Transport pieces** = load units + individual collis.

## Scope and ownership

| Owning ticket | Supplies | FRO-316 presents |
| -- | -- | -- |
| [FRO-325](https://linear.app/front-line-ltd/issue/FRO-325) | READY_FOR_DISPATCH status; packing read/save; readiness confirmation and invalidation; transport-document assign/replace/clear; dispatch from Ready with a saved number; pre-dispatch cancellation; participation read with Order attribution, child/root lineage and Order display metadata (Owner reference, Client, Vessel, Supplier, root Order number) | Status card, packing editor and review, document editing, Dispatch, Purchase orders table |
| [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344) | Pre-dispatch route, purpose/destination and participation editing; readiness invalidation; mode-change document resolution; delivery-note draft reconciliation; empty-load-unit and split rules | Per-card Edit, participation editor, warnings and reconciliation step |
| [FRO-339](https://linear.app/front-line-ltd/issue/FRO-339) | Origin/destination country and city reads; geography and warehouse-city validation; null for older Shipments | Geography fields and their editors |
| [FRO-345](https://linear.app/front-line-ltd/issue/FRO-345) | Status history with event lookup and full reasons; recorded operations; comments | History & activity tab, exception panel, View history |
| [FRO-292](https://linear.app/front-line-ltd/issue/FRO-292) | Internal and External Notes storage, reads, updates and permissions | Notes card and its two editors |
| [FRO-299](https://linear.app/front-line-ltd/issue/FRO-299) | Per-colli Description, Package type, dimensions, gross weight and their sources on the Shipment read | Measurements in View collis, packing editor and review |
| [FRO-300](https://linear.app/front-line-ltd/issue/FRO-300) | Individual collis list in Review repacking | Individual collis block |
| [FRO-324](https://linear.app/front-line-ltd/issue/FRO-324) | Historical-arrival records, unknown facts, date-only precision, recording metadata, delivery-note ineligibility | Historical display |
| [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297) | Shipment `dangerousGoodsCount` (null for Shipments dispatched before the snapshot) | Dangerous goods field |
| [FRO-320](https://linear.app/front-line-ltd/issue/FRO-320) / [FRO-307](https://linear.app/front-line-ltd/issue/FRO-307) | Warehouse transfer wording; delivery-note loading/destination address choices | Purpose label; Issue Delivery Notes |

FRO-341 (Shipment creation) depends on this page: creation no longer offers repacking.

## Page structure

* **Title:** production **TopBar** showing **Shipment · [Shipment number]** (EL **Αποστολή · […]**), with no separate heading card. The status is not repeated in the title.
* One **Card** holding **Tabs**, in this order: **Overview · Orders and collis · History & activity · Documents · Available actions** (EL **Επισκόπηση · Παραγγελίες και κόλι · Ιστορικό και δραστηριότητα · Έγγραφα · Διαθέσιμες ενέργειες**). Overview is the default. `?tab=overview|orders|history|documents|actions` opens a tab directly.
* Tabs support Arrow/Home/End keys and scroll horizontally on narrow screens. Switching tabs or language keeps every open draft and expanded row; drafts live above the tab panels.
* Use the production components and tokens (`DESIGN.md`, `src/styles/theme.css`): `TopBar`, `Tabs`, `Card`, `Select`/`Combobox`, `Input`, `Textarea`, `Table`, `Checkbox`, `Button`, `StatusPill`/`ShipmentStatusPill`, `Badge`, `Alert`, `Modal`, `MetricCard`, `AttachmentPanel`, loading placeholder, `ErrorMessage`, toast. One teal primary button per view. Every string goes through the labels provider in EN and EL.

## Overview

**Shipment details** card, top to bottom:

1. **Shipment status** sub-card.
   * The current status as `ShipmentStatusPill` (Preparing for dispatch neutral, Ready for dispatch neutral, Dispatched info, Arrived success, Cancelled and Location unknown danger).
   * Normal statuses show a read-only four-step indicator: **Preparing for dispatch → Ready for dispatch → Dispatched → Arrived** (EL **Προετοιμασία για αποστολή → Έτοιμη για αποστολή → Απεστάλη → Αφίχθηκε**). Earlier steps are completed, the current step is marked with `aria-current="step"`, later steps are muted. A historical arrival marks only Arrived and does not show the earlier steps as completed. On narrow screens the steps stack vertically.
   * **Cancelled** and **Location unknown** replace the steps with a danger `Alert` naming the status in text. It shows **Last confirmed stage: [status]** only when the status history proves it, and a **View history** button that opens History & activity at that event. No step counter, progress value or forward action.
   * **Next step** (SHIPMENT_EDIT only):
     * Preparing for dispatch: the text "Next step: plan the packing and confirm readiness in Orders and collis." with a link to that tab.
     * Ready for dispatch: the primary **Dispatch** button. It opens a confirmation `Modal` showing the document type and number. On success the status becomes Dispatched with the server's departure time.
     * When readiness or dispatch is blocked, a warning `Alert` lists every reason the server returns: an Order not stock-confirmed at the origin, incomplete geography, a missing document number. A blocked Dispatch is disabled and described by that list.
2. **Fields** (four columns on desktop, two on tablet, one on phone):

   | Field | Source | Display |
   | -- | -- | -- |
   | **Origin country** · **Origin city** · **Destination country** · **Destination city** | FRO-339 references | Name; **—** when null. Never inferred from Orders or warehouses. |
   | **Origin warehouse** | `originWarehouse` | Name; **—** when unknown |
   | **Mode** | `mode` (ROAD, AIR, SEA) | Road / Air / Sea; **—** when unknown |
   | **Document type** | Derived from mode: ROAD → **CMR**, AIR → **Air Waybill (AWB)**, SEA → **Bill of Lading (B/L)** | **—** when mode is unknown |
   | **Document number** | `transportDocumentNumber` | Monospace; **Not recorded** when empty. Labelled **Transport reference** when the mode is unknown. |
   | **Departure date** · **Arrival date** | Actual dispatch and arrival | Timestamp, or date only when only a date was recorded; **—** when unknown. Never the recording time. |
   | **Dangerous goods** | FRO-297 `dangerousGoodsCount` | The count; **Unavailable** when null |

3. **Record metadata**, a quieter line under the fields: **Created at · Created by**. For a historical arrival: **Recorded at · Recorded by**.

**Shipment purpose** card: **Purpose** (Warehouse transfer / Third-party agent / Direct delivery on board / Via agent or launch station) and **Destination details** (the destination warehouse, the agent or launch station, or the vessel derived from the participating Orders).

**Final handover** card, only when a handover exists: **Recipient kind · Recipient · Received by · Proof · Confirmed**.

**Notes** card with two sub-cards, **Internal Notes** and **External Notes**. Each shows multiline plain text (line breaks kept; **—** when empty) and has its own **Edit**. Editing opens a prefilled `Textarea` (2,000 characters, with a counter), **Save** and **Cancel**. Save updates only that field. Notes can be edited in every status by SHIPMENT_EDIT users and never change readiness.

### Editing before dispatch

* **Edit** (top right of Shipment details and Shipment purpose) appears only in Preparing for dispatch and Ready for dispatch, for SHIPMENT_EDIT users. Read-only values stay until Edit is opened. Each card has its own draft with Save and Cancel; there is no page-wide Save.
* **Shipment details** edits the four geography references, Origin warehouse, Mode and Document number. Document type is read-only. Choosing a country clears its city; warehouses are filtered by the selected city. If a Warehouse transfer's destination city changes, the editor also asks for a destination warehouse in the new city.
* Changing **Mode** when a number is saved requires a choice: keep the number as a valid document of the new type, replace it, or clear it.
* **Shipment purpose** edits Purpose and a compatible destination. A derived vessel stays read-only.
* **From Ready for dispatch:** saving a changed route, purpose, destination, mode, participation or packing first shows a warning ("Saving this change returns this Shipment to Preparing for dispatch. Readiness must be confirmed again.") with **Back** and **Save and return to Preparing**. Changing only the document number, Notes or attachments keeps readiness. An unchanged save or Cancel changes nothing.
* **Delivery-note drafts:** when the server reports draft values affected by a route change, the save shows a step listing each affected draft and value, with **Keep entered value** or **Update from the new route**. Removing drafts whose origin is no longer eligible needs explicit confirmation. Confirm stays disabled until every value has a choice. FRO-344 owns the rules.
* A failed, denied or stale save keeps the draft and shows the server's actionable error. Cancel or Escape discards only that card's draft and returns focus to its Edit button.

## Orders and collis

**Purchase orders in this Shipment** card. The header shows **[n] Orders · [n] collis**: distinct Orders with collis in this Shipment and distinct collis by identity. Pallets and boxes are not collis.

| Column | Display |
| -- | -- |
| **Order** | Linked Order number. A split child also shows **Split from [root Order number]**. |
| **Owner reference** | Text; **—** when absent |
| **Client** · **Vessel** · **Supplier** | Name; **—** when absent |
| **Collis in this Shipment** | Count, plus **View collis / Hide collis** (keyboard-operable, `aria-expanded`) |

* An Order included only for customs paperwork gets no row. Rows use loading-time attribution, not a later current Order.
* **View collis** lists each colli: linked **Colli** code, **Description** ("No description" when absent), **Package type**, **Dimensions** and **Gross weight**.
* **Measurement rule (FRO-299):** each value is the latest warehouse-confirmed measurement, otherwise the declared value followed by a muted **Declared / Δηλωμένο**, otherwise **—**. Formats: `120 × 80 × 100 cm`, `450 kg`. The same values and markers appear in View collis, the packing editor and the review.
* **Edit participation** (pre-dispatch, SHIPMENT_EDIT) opens a large `Modal` reusing FRO-341's selection controls and Partial selections, prefilled with the saved collis.
  * The operator can search eligible Orders at the same origin and select whole Orders or individual collis. The Shipment's own reservations stay selectable; collis reserved by other Shipments are not.
  * Partly selecting an in-stock Order needs a **Reason** (Operational separation / Uncollectable remainder / Other) and a **Remark** for Other. Existing child Orders show their lineage and are not asked again.
  * Save is rejected with an actionable message when no colli is selected or when removing collis would empty a load unit ("Unpack it in Plan packing first."). Added collis travel individually until packed.

**Shipment packages** card:

* **Individual collis** and each load unit appear as cards. Each card has a two-column **Colli / Order** list of links. A load-unit header shows its label, `L × W × H cm` and its colli count.
* Before any load unit exists, show "Repacks have not been made yet. Collis currently ship individually." The header says whether the packing is confirmed for dispatch or only saved.
* One entry point, pre-dispatch and SHIPMENT_EDIT only: **Plan packing**, or **Edit packing** once a plan is saved.

### Packing editor — `Modal` "Optional repacking"

* **Load units:** **Add load unit**. Each unit has **Type** (Pallet / Cardboard box), **Label**, **Length cm**, **Width cm**, **Height cm**, **Gross kg** and **Remove**. Labels are visible and persistent (FRO-299). Removing a unit returns its collis to Ship individually.
* **Colli assignments**, grouped by Order: colli code and description, package type, dimensions, gross weight and a select (**Ship individually (no overpack)** or one load unit). On narrow screens the rows scroll horizontally inside the modal only.
* **Validation:** dimensions are whole centimetres greater than 0; Gross kg is optional and greater than 0 when entered; every load unit has at least one colli; a colli is in at most one unit. Errors appear next to their field.
* **Footer:** **Cancel** · **Save packing** (secondary) · **Confirm packing** (primary).
  * **Save packing** saves the plan without confirming readiness. From Ready, a changed plan shows the return-to-Preparing warning first.
  * **Confirm packing** validates and opens Review repacking in the same modal without saving.
  * Cancel or Escape discards the draft and returns focus to the entry button.

### Review repacking (same modal)

* Metrics: **Optional load units**, **Individual collis**, **Transport pieces** (load units + individual collis; collis inside a unit are not counted again). No PCS.
* **Validation** checklist, including stock confirmation of every participating Order and complete geography. Blocking reasons are listed.
* **Colli allocation** table: Colli, Description, Order (with Split from for children), Dimensions, Gross weight, Shipping form.
* **Optional repacking plan:** load-unit cards with their contents, plus an **Individual collis / Μεμονωμένα κόλι** block whenever any colli is unassigned. The block lists each such colli once with Colli, Description, Order, Dimensions and Gross weight, and its row count equals the Individual collis metric. With no load units it lists every colli, together with the message "No repacking selected. All [n] collis will ship individually."
* **Footer:** **Back to repacking** keeps the draft. **Confirm ready for dispatch** saves the arrangement and confirms readiness in one FRO-325 operation; it is disabled while a blocker remains. On success the status becomes Ready for dispatch. A rejected, stale or failed confirmation changes nothing and keeps the draft with the error. Any later packing edit requires a fresh Confirm packing.

## History & activity

* **Shipment activity** card with **Status history** and **Recorded operations**, newest first. Each row shows the recorded time, actor, the event (for example "Preparing for dispatch → Cancelled") and the full reason or remark. The occurrence time is shown separately when it differs; unknown values stay unknown.
* The Location unknown and Cancelled reasons and times appear on their status events, not as fields in Shipment details. View history highlights the event.
* **Comments** card: the list, plus **Add comment** (plain text, up to 2,000 characters) for SHIPMENT_EDIT users in every status. No edit or delete.
* Empty and failed reads are shown differently.

## Documents

The existing **AttachmentPanel** for Shipments, including files attached at creation. Upload and remove need SHIPMENT_EDIT.

## Available actions

Standalone cards, stacked full width:

| Status | Cards |
| -- | -- |
| Preparing for dispatch / Ready for dispatch | **Cancel before dispatch** — Cancellation reason (required) and a danger **Cancel shipment** |
| Dispatched | **Record arrival / final handover** (existing purpose-specific form) · **Mark location unknown** (reason required) |
| Arrived / Cancelled / Location unknown | "No further lifecycle actions for this status." |

Then the **Issue Delivery Notes** card (EL **Έκδοση δελτίων αποστολής**): the existing delivery-note workflow with its permissions (DELIVERY_NOTE_VIEW/CREATE/ISSUE/CANCEL), FRO-307 loading and destination address choices, **Save Draft Delivery Notes**, PDF preview, issuance and cancellation. For a recorded historical arrival it shows "Delivery notes are not available for a recorded historical arrival." Packing, document, readiness and Notes actions never issue a delivery note or dispatch goods.

## States, access and language

* **Loading:** detail loading placeholder. **Error:** `ErrorMessage` with **Retry**. Empty lists show the empty message.
* **View-only users** see every value and no Edit, packing, participation, Dispatch, lifecycle, Notes, comment or upload control. The server re-checks every operation.
* EN/EL for every label, value, message and error. Greek strings wrap and never clip. No page-wide horizontal scroll at 375–400px; wide tables scroll inside their own container.

## Acceptance criteria

* The page title is **Shipment · [number]** in the TopBar, with no heading card. The tabs appear in the stated order with Overview as the default, support keyboard selection and keep drafts and expanded rows across tab and language switches.
* The status sub-card shows the correct pill and steps for each status: completed before, current marked, later muted. A historical arrival marks only Arrived. Cancelled and Location unknown show the exception alert with no steps or forward action. Last confirmed stage appears only with recorded evidence, and View history opens the matching event.
* In Preparing for dispatch the card points to Orders and collis. In Ready for dispatch it shows Dispatch as the only primary button. Every blocking reason returned by the server is listed, and a blocked Dispatch is disabled.
* Shipment details shows the four geography names, Origin warehouse, Mode, Document type, Document number, Departure date, Arrival date and Dangerous goods, each once. Missing values show **—**, an unknown mode shows Transport reference, and a null DG count shows Unavailable. Created at/by (or Recorded at/by) sit in the metadata line.
* Shipment purpose shows Purpose and Destination details with FRO-320 wording. Final handover appears only when a handover exists.
* Each Notes sub-card edits and saves independently in every status, keeps line breaks and shows **—** when empty. Save updates only that field, and readiness never changes.
* Edit appears only pre-dispatch for SHIPMENT_EDIT users. A material change from Ready warns and then returns to Preparing for dispatch. A document-number-only change keeps Ready. A mode change requires the keep/replace/clear choice. Affected delivery-note drafts require an explicit choice per value. Failed saves keep the draft.
* The Purchase orders table shows one row per participating Order with the six columns. Split children show their root Order. The counts are distinct Orders and collis. View collis shows FRO-299 values with the Declared marker and **—** for absent values.
* Edit participation is prefilled. It enforces reason and remark for partial in-stock selections, rejects empty participation and emptied load units, and refreshes the counts, packages and status after saving.
* Shipment packages shows Individual collis and each load unit as Colli / Order lists, with correct counts and one entry point.
* The packing editor validates as stated. Save packing saves without confirming readiness. Confirm packing opens the review without saving. Confirm ready for dispatch reaches Ready only after success. Cancel and Escape discard the draft and return focus.
* Review repacking shows the three metrics and the Individual collis block with matching counts. It lists every colli when there are no load units.
* History & activity shows Shipment activity and Comments as specified. Location unknown and cancellation reasons appear there and not in Shipment details.
* Documents keeps attachment behaviour. Available actions shows exactly the cards for each status. Issue Delivery Notes keeps the existing workflow and shows the ineligibility message for a historical arrival.
* View-only users see no operational controls. Loading, error with retry, and empty states render. EN/EL and a 375–400px width work with no page-wide overflow.
* FRO-316 adds no storage, API, migration, permission or business rule. Every save and transition calls the owning ticket's operation.

## Out of scope

* Any backend field, read, operation, validation, migration or permission. This includes the Order display metadata and root reference on the participation read (FRO-325), measurements (FRO-299), history and comments (FRO-345), Notes (FRO-292) and geography (FRO-339).
* Creating Orders from Details, historical correction or backfill, editing Status or actual dates directly, Delivered vessel, per-colli DG or handling flags, customs/Export declaration grouping, the customer-facing view, and changes to delivery-note fiscal rules or Order splitting.

## Decisions

| Decision | Reason |
| -- | -- |
| Tabs Overview · Orders and collis · History & activity · Documents · Available actions | Follows FRO-326's order, uses FRO-341's tab name, and adds the tab FRO-345 assigns to this page. |
| TopBar title "Shipment · [number]", no heading card | Production pattern and DESIGN.md; consistent with FRO-341. |
| Four-step status indicator; exception alert for Cancelled and Location unknown | Matches FRO-341 creation. Exceptions must not show a false progress position. |
| Status label "Preparing for dispatch" | FRO-325's display name; FRO-341 aligns to it. |
| Order display metadata comes from FRO-325's participation read | The Shipment read lacks it, and FRO-325 already owns participation with lineage; a UI ticket cannot add reads. |
| Dangerous goods stays in Shipment details; Final handover is its own Overview card | Keeps existing production information that the redesign would otherwise drop. |
| One packing entry point; Save packing separate from Confirm packing | FRO-325 has an ordinary save and a readiness confirmation; one entry avoids duplicate buttons. |
| Delivery-note draft reconciliation step inside the save flow | FRO-344 defines explicit resolution, and silent changes to fiscal drafts are not acceptable. |

## Context for agents

* Production main `5c51030`; FRO-339 geography is on `release/0.0.2` (`09394e5`). Route file: `frontline-forwarding-client/src/routes/secured/shipments/$shipmentId.tsx` (today `TopBar title="Shipment detail"`). Screen: `src/features/shipments/components/shipment-detail.tsx`. It has no tabs, uses local Card/Facts helpers and hardcoded English labels; `ShipmentActions` currently dispatches from PREPARING with a free-text number.
* `ShipmentStatus` on main: PREPARING, DISPATCHED, ARRIVED, CANCELLED, LOCATION_UNKNOWN; READY_FOR_DISPATCH comes from FRO-325. Mutations today: createShipment, dispatchShipment(transportDocumentNumber), arriveShipment, cancelShipment(reason), markShipmentLocationUnknown(reason). There are no update mutations.
* `GetShipment` (`features/shipments/graphql/shipments.graphql`) does not fetch geography, even on `release/0.0.2`. `ShipmentParticipation`/`ShipmentContent` carry only Order id/number, colli id/code and loading attribution. Owner reference, Client, Vessel, Supplier and `rootPurchaseOrderId` exist on `PurchaseOrder` only. Per-colli measurements arrive with FRO-299. Do not fetch Orders one by one.
* `ShipmentStatusPill` (`shipment-table.tsx`): ARRIVED success, CANCELLED/LOCATION_UNKNOWN danger, DISPATCHED info, otherwise neutral. No stepper component exists. Compose it from tokens, as FRO-341 does.
* Order Details tab pattern: `features/purchase-orders/components/purchase-order-detail.tsx` with `components/ui/tabs.tsx`. `TabPanel` unmounts inactive panels, so hoist drafts (including delivery-note input) above the tabs.
* `AttachmentPanel` (`features/attachments/components/attachment-panel.tsx`) guards upload/remove with SHIPMENT_EDIT. `DeliveryNotesCard` (`delivery-notes-card.tsx`) keeps its DELIVERY_NOTE_* guards.
* Greek labels for the composer already exist (`shipment-composer-labels.ts` and the labels provider). Reuse them: Optional repacking, Individual collis, Optional load units, Length cm, Gross kg, Dangerous goods, Unavailable, the geography labels.
* Preview: Cloudflare Pages project `fro-316-<hex6>` (link added when published). Source: planning repo `previews/fro316/`. Fixture data only; every operation in it is a browser-local simulation. "New component" outlines and numbered notes are preview-only annotations.

## Post-deployment verification

Read-only in production. Steps marked *test* run in a non-production environment with test data.

1. Open an existing dispatched Shipment. Check the TopBar title, tab order, default Overview, `?tab=` links and Arrow/Home/End keys.
2. Compare Shipment details with the Shipment read (GraphQL `shipmentById`): geography names, Origin warehouse, Mode, Document type/number, dates, Dangerous goods, Created at/by. Check that missing values show **—**, and **Unavailable** on an older Shipment.
3. Check the status pill and steps for a Dispatched and an Arrived Shipment, and the exception alert, Last confirmed stage and View history on a Location unknown or Cancelled Shipment.
4. Open Orders and collis. Compare the rows and counts with the participation read, a split child's root Order and View collis values (including Declared markers) with the FRO-299 fields. Compare Shipment packages with the saved load units.
5. Open History & activity, Documents and Available actions. Compare them with the FRO-345 reads, the attachment list and the status-specific cards. Check the historical-arrival delivery-note message on a historical Shipment.
6. Check a view-only user: no operational controls. Check EN/EL and a 400px width with no page overflow.
7. *Test:* in Preparing for dispatch — plan packing; Save packing; Confirm packing → review; Confirm ready for dispatch → Ready; Dispatch → Dispatched.
8. *Test:* from Ready — change only the document number (stays Ready); change the destination city (warning, reconciliation step when drafts exist, back to Preparing); change the mode (keep/replace/clear); edit participation (reason, emptied-unit rejection); force a failed save (draft kept).
9. *Test:* edit each Notes field in Preparing and in Dispatched; add a comment; cancel a Preparing Shipment with a reason; record arrival and mark location unknown on Dispatched Shipments.

**Reference:** `frontline-forwarding-client/src/features/shipments/components/shipment-detail.tsx`, `src/routes/secured/shipments/$shipmentId.tsx`, `frontline-forwarding-app/src/main/resources/graphql/shipments.graphqls`, `docs/workflows/shipment-lifecycle.md`, `frontline-forwarding-client/DESIGN.md`. ⚠️ **Blocked by** FRO-325, FRO-344, FRO-345, FRO-339, FRO-324, FRO-292, FRO-299, FRO-300.
