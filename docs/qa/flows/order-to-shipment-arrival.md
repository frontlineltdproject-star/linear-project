# FLOW-OS — Order to Shipment arrival

**Purpose:** register goods, establish supplier readiness, receive and measure them, reserve them on one transport leg, confirm packing, dispatch and record arrival without losing identities, custody or history.

**Audience:** Front Line office and warehouse staff, developers and testers.

**Scope:** ordinary operational Shipments. The baseline uses a Warehouse transfer. Agent, vessel and launch-station handovers are explicit variants. Historical arrival entry, fiscal issuance, invoice processing and Export/customs procedures are separate flows; their guards remain relevant when existing linked records prevent changes.

**Review status:** first source-grounded catalogue for office review. Expected behavior is traced below; the complete browser journey has not yet been executed. See [scenario catalogue](../scenarios/order-to-shipment-arrival.md) and [run evidence](../runs/2026-11-09-order-to-arrival.md).

## Vocabulary

Order = purchase order = stock-list item. A colli is one physical handling unit with a permanent identity. A load unit is an optional Shipment pallet/box grouping, not a replacement colli. Transport pieces count load units plus collis travelling individually; grouped contents are not counted twice.

Supplier readiness means the supplier reports goods ready. Stock confirmation records warehouse custody and measurements. Shipment readiness confirms actual packing is complete. Dispatch records departure. Arrival at another warehouse is not final delivery and is not stock confirmation.

## Prepare a repeatable fixture

Use an authorized internal operator with Order create/edit and Shipment create/edit/view access. Prepare an authorized client, its eligible vessel if required, a supplier and valid opening warehouse A. Use eligible invoice-company reference data if selecting one. For the baseline, prepare another active eligible destination warehouse B, distinct from A, with valid country/city relationships.

The following are **invented test fixtures**, not company records: an Owner reference unique to the run; two individually identified cardboard-box collis, each 40 × 30 × 20 cm and 10 kg gross; storage position `QA-A-01`; a small nonempty `qa-attachment.txt`; and a transport reference unique to the run. Map A/B and the company choices to actual isolated fixture IDs before execution. Save the resulting permanent identities in the run log.

Use Greece = Yes and explicitly select a regime that A and B both support. Do not infer support from warehouse names. If reference data lacks those capabilities, record a setup blocker; do not change Greece to No merely to bypass validation. Greece = No is a separate scenario for goods to which it actually applies.

Control email scheduling/provider delivery before creating test Orders. Do not prepare or issue Delivery Notes, submit to AADE, or finalize fiscal documents as part of this baseline.

## Normal journey — OS-001

At every successful step, reopen or refresh the record and verify saved facts. Keep Order, colli and Shipment IDs for cross-checks. At every refusal or cancelled dialog, verify no lifecycle/custody/history change occurred.

| Step | Office action | Expected result and connected records |
| --- | --- | --- |
| 1. Register goods | Open New Order. Select valid client/vessel/supplier/opening warehouse, enter Owner reference, choose Greece/regime explicitly, add and save the two colli rows. Leave initial status Awaiting Readiness Date. Create without files for the baseline. | One Order in `PENDING`, date absent; opening stay `EXPECTED`; two permanent colli identities. Registration creates no warehouse arrival, stock, Shipment or email command. Separate scheduled emails remain subject to their own rules. |
| 2. File variation | On a separate draft, repeat creation with the small valid attachment. Use OS-005/006. | The file is staged privately before creation and attached atomically with the successful Order. An upload refusal must not be shown as successful Order creation. Retrying an unknown result must recover the original attempt rather than create duplicates. |
| 3. Record expected readiness | On the saved Order use Set expected readiness, enter a valid calendar date and optional remark, and confirm. | Order becomes `EXPECTED_READINESS`; date persists; nonterminal colli histories record the expectation. Goods are not yet in stock. Email preparation/sending is a separate action. |
| 4. Confirm supplier readiness | Use Mark ready at supplier and confirm that the active goods are ready. | Order becomes `READY`; colli histories record readiness. Opening stay remains expected. No collection or warehouse receipt is invented. |
| 5. Receive into stock | Use Record arrival and set PO in stock. Supply storage position and complete valid warehouse measurements for every nonterminal colli; review and confirm. | One atomic operation records first arrival and stock confirmation. Order becomes `IN_STOCK`, its stay becomes `IN_STOCK` at A, and measurements are warehouse-confirmed. Validation failure records neither arrival nor stock. |
| 6. Start transport | From this Order use Start shipment. Check that A and this Order are preselected. Select Warehouse transfer, destination B, Road and complete valid origin/destination country and city. Include both collis and review exact participation. | Creation draft only: no reservation or movement before Create. Optional document number may remain blank. Changing the origin must safely re-evaluate the selection (OS-010). |
| 7. Create Shipment | Confirm creation with the complete selection. | One `PREPARING` Shipment. Existing Order becomes `PREPARED_FOR_SHIPMENT`; source stay remains in stock at A. Both original colli IDs are reserved once. Full selection creates no child Order. No departure is recorded. |
| 8. Plan and confirm packing | Open Orders and collis. First use all-individual packing; inspect the packing review and explicitly confirm ready for dispatch. OS-015 separately tests an overpack. | `READY_FOR_DISPATCH`; confirmation records the actual arrangement, actor and time. Saving a packing plan alone must not establish readiness. Both collis remain present once. |
| 9. Record transport reference | Save a new unique CMR number. If testing the missing-number guard first, attempt Dispatch without one. | Without a saved number, Dispatch is blocked and custody stays unchanged. Saving only the number preserves readiness. ROAD derives CMR; AIR derives AWB; SEA derives B/L. A transport document is distinct from a fiscal Delivery Note. |
| 10. Depart | Review Dispatch, verify its saved document number, then confirm. | Shipment `DISPATCHED`; participating Order `SHIPPED`; source stay departed. A warehouse-transfer inbound stay is recorded for B. Dispatch time and colli journey events persist. Route/participation/packing become locked. |
| 11. Arrive at B | Open Available actions and use Record arrival. Warehouse transfer needs no final-handover recipient. | Shipment `ARRIVED`; Order `AWAITING_IMPORT`; destination stay is physically `AT_WAREHOUSE`; participation/content movements close as arrived. Same Order/colli identities, with one hub-arrival event per colli. No final-delivery outcome and no automatic stock confirmation. |
| 12. Verify receiving continuation | Open the Order from the arrived Shipment and inspect its current warehouse, available stock-confirmation action and colli journey. Optionally run OS-019 to confirm stock at B. | It can continue through receiving confirmation at B. That confirmation produces `IN_STOCK`, without recording the Shipment arrival again. A later transport leg can use the same identities after eligibility checks. |

## Destination branches

| Purpose | Before arrival | Arrival result |
| --- | --- | --- |
| Warehouse transfer (`NETWORK_TRANSFER`) | Eligible warehouse destination; regime compatible at planning and dispatch | No final handover. Shipment Arrived, Orders Awaiting import, then separate stock confirmation. |
| Third-party transfer (`THIRD_PARTY_TRANSFER`) | Active external destination agent | Handover to that same agent, with receiver details. Orders `ARRIVED_AT_DESTINATION`; completion records delivery, or delivery with exceptions where terminal members remain. |
| Direct delivery on board (`DELIVERY_TO_VESSEL`) | Participating Orders satisfy the common-vessel rules | Matching vessel handover and receiver details; Orders reach final destination. |
| Via launch station (`DELIVERY_TO_LAUNCH_STATION`) | Active external agent destination | Launch-station handover, required station/receiver details; Orders reach final destination. |

See OS-020 for rejected/missing handovers. Arrival cannot precede dispatch. `LOCATION_UNKNOWN` is not an arrival or successful delivery.

## Important alternatives

- An Order can start directly Received Readiness Date or Ready at supplier; it does not need artificial earlier transitions. Empty-colli creation is allowed, but stock confirmation requires actual nonterminal collis and measurements.
- Upcoming `READY` Orders and `EXPECTED_READINESS` Orders dated today or later can be planned in full. They retain their readiness state until warehouse stock confirmation; they cannot make the Shipment ready while unstocked.
- Current delivered partial selection of an `IN_STOCK` Order requires an explicit split decision: the selected original collis move to a participating child Order; the remainder stays on the parent. Upcoming partial selection is not allowed.
- FRO-362, independent colli custody/movement within one Order, is **Backlog** at this review. It is not the expected behavior for this release.
- Changed route, membership or saved packing invalidates readiness; unchanged saves and document-number-only/Notes/file changes do not. Exact command guards and existing linked-document protections still apply.
- Pre-dispatch cancellation releases reservations and keeps identity/history. A stocked reserved Order returns to `IN_STOCK`; an upcoming Order retains its readiness facts. Active Exports or Shipment Invoices may first require their separately owned resolution.

## Requirement and implementation trace

Links target the source baseline, not an unpinned moving branch. The run ledger records current ticket statuses and review limitations.

| Area / consumer | Expected contract / owner | Source inspected | Review outcome |
| --- | --- | --- | --- |
| Order creation and readiness | FRO-335 / FRO-336; existing Order journey | [Order workflow](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/purchase-order-colli-journey.md) | Preserve three initial states and normal forward transitions; OS-001/002. |
| Order Details, stock, editing | FRO-326 / FRO-346 | [Order command service](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L1326) | Trace arrival/stock atomicity and open-Shipment reservation effects; OS-007/009/012. |
| Customs eligibility | FRO-356 | [Regime rules](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/order-customs-regime.md) | Explicit selection, no warehouse-name inference; OS-003/026. |
| File creation / attachment ownership | FRO-342, consumed by FRO-335 / FRO-341 | [Attachment workflow](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/attachments.md#files-staged-during-creation) | Staging and atomic association; reported 401 under investigation; OS-005/006. |
| Shipment creation / selection | FRO-325 / FRO-341 / FRO-323 | [Shipment workflow](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/shipment-lifecycle.md#creation) | Exact identities, current availability and split decisions; OS-010–014. |
| Packing / dispatch blockers | FRO-325 / FRO-316 | [Shared readiness policy](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentReadinessPolicy.java) | Distinguish physical readiness from a saved plan and from dispatch eligibility; OS-015–018. |
| Route / participation edits | FRO-344 / FRO-316 | [Shipment edit rules](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/shipment-lifecycle.md#route-edit) | Readiness invalidation, atomic reservations and linked-document protection; OS-016/022. |
| Arrival, custody, identities and history | Existing Shipment lifecycle; FRO-316 / FRO-345 presentation/history | [Arrival command](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java#L2150) | Warehouse receipt and final handover have different results; OS-019/020/023. |
| Roles / partner visibility | Existing authorization contracts | [Authorization](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/architecture/authorization.md#purchase-orders-and-shipments) | Enforce in API as well as UI; OS-024. |

This review proposes no changed business rule. Cases not yet executable or conflicting sources stay identified in the run document rather than being treated as approved requirements.
