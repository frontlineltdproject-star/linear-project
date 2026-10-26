**As an** operator reviewing a Shipment's packing **I want** every individual colli listed beside the load units in **Review repacking** **so that** the review shows every transport piece, including mixed arrangements and shipments with no load units.

**Order = Purchase Order = stock-list item.** A **colli** (handling unit) is one permanently identified physical package, shown by its tracking code. A **load unit** is a Shipment-scoped PALLET or CARDBOARD_BOX overpack. An **individual colli** (Μεμονωμένο κόλι) is a participating colli that is not inside any load unit and travels as its own transport piece. It is not the colli flag **Unpacked**, which means the goods arrived without packaging.

## Scope and ownership

| Owner | Responsibility |
| -- | -- |
| **FRO-300** | The Individual collis display rule, row content, ordering and counts below. |
| [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316>) | All UI: the **Review repacking** step of the packing modal on Shipment Details. Blocked by this ticket. |
| [FRO-299](<https://linear.app/front-line-ltd/issue/FRO-299>) | The colli measurement read contract (description, package type, resolved dimensions/gross weight and their source) and the shared measurement formatting. This ticket consumes it and is blocked by it. |
| [FRO-325](<https://linear.app/front-line-ltd/issue/FRO-325>) | Packing validation, save, readiness confirmation and the packing read contract. |

This ticket adds no storage, API change, lifecycle transition or packing operation. Shipment creation ([FRO-341](<https://linear.app/front-line-ltd/issue/FRO-341>)) has no repacking step, so this requirement applies only to Review repacking on Shipment Details. No new design or preview: the look is FRO-316's existing Review repacking design.

## Individual collis block

Inside **Optional repacking plan** of **Review repacking**, show an **Individual collis** block (EL: **Μεμονωμένα κόλι**) alongside the PALLET / CARDBOARD_BOX cards whenever at least one participating colli has no load-unit assignment in the reviewed draft.

| Situation | Result |
| -- | -- |
| Mixed: load units and individual collis | Load-unit cards **and** the Individual collis block. |
| No load units | The block lists every participating colli. The all-individual message may remain, but it never replaces or hides the list. |
| Every colli assigned to a load unit | No block; **Individual collis** total is **0**. |

**Exactly once:** every participating colli appears exactly once in the review — inside one load-unit card or in the Individual collis block, never both, never neither. A colli whose assignment does not point to a load unit in the reviewed draft counts as individual.

### Row content

| Column | Type / format | Rule |
| -- | -- | -- |
| **Colli** | String | Permanent tracking code. |
| **Description** | Free text | Colli description; **No description** when absent. |
| **Order** | String | Participating Order number. For a split child Order, also its original/root reference, exactly as shown in **Colli allocation**. |
| **Dimensions** | `L × W × H cm` | FRO-299 resolved value and formatting. |
| **Gross weight** | `kg` | FRO-299 resolved value and formatting. |

**Measurement rule (from FRO-299):** each value is the colli's most recent warehouse-confirmed measurement at any warehouse; dimensions and gross weight are resolved independently. Otherwise the declared value, followed by a muted **Declared** / **Δηλωμένο** marker. Otherwise **—**, never blank or zero. Always the colli's own values, never the load unit's.

**Order of rows:** grouped by participating Order, in the same Order and colli order as **Colli allocation**.

### Counts

| Metric | Rule |
| -- | -- |
| **Individual collis** | Number of distinct rows in the Individual collis block. |
| **Optional load units** | Number of load units in the reviewed draft. |
| **Transport pieces** | Load units + individual collis. Collis inside a load unit are not counted again. |

## Draft, states and confirmation

* The block, load-unit contents and counts all come from the same draft the operator is reviewing. Any change after **Back to repacking** requires a fresh **Confirm packing** and a refreshed review (FRO-316).
* Review repacking exists only while the Shipment is **PREPARING** or **READY_FOR_DISPATCH**; FRO-325 locks packing in later states.
* Displaying the review saves nothing and changes no status. Only **Confirm ready for dispatch** invokes FRO-325's authorized save/readiness operation.
* After a successful confirmation, the saved Shipment packages list exactly the reviewed individual collis as loose contents and the reviewed load-unit contents; the saved display itself is unchanged.
* Colli allocation, Order attribution, assignments, validation and the existing review fields are unchanged.
* EN/EL labels, keyboard access and readable responsive layout follow FRO-316; Greek strings must not clip.

## Acceptance criteria

1. With a mixed arrangement, every participating colli without a load unit appears exactly once in the Individual collis block, and no colli appears both there and in a load-unit card.
2. With no load units, the block lists every participating colli; the all-individual message does not replace the list.
3. With every colli assigned, the block is absent and **Individual collis** shows **0**.
4. Each row shows tracking code, description (or **No description**), participating Order (with original/root reference for a split child), dimensions and gross weight.
5. A colli with a warehouse-confirmed measurement shows it without a marker; one with only declared values shows them with **Declared / Δηλωμένο**; a colli with neither shows **—**. Dimensions and weight may come from different sources. Values match the same colli in Colli allocation and Optional repacking.
6. Rows are grouped by Order in Colli allocation order.
7. **Individual collis** equals the row count; **Transport pieces** equals load units + individual collis.
8. Changing an assignment after Back to repacking and re-confirming refreshes the block and counts to the new draft.
9. Opening, leaving or cancelling the review changes no saved packing or status. After a successful Confirm ready for dispatch, the saved loose contents equal the reviewed individual collis.
10. EN and EL render without clipping at desktop and ~400px, and the block is reachable by keyboard.

## Decisions

| Decision | Reason |
| -- | -- |
| Use **Individual colli**, not "unpacked colli" | **Unpacked** is an existing colli flag (goods arrived without packaging); Individual collis is the portal's existing label. |
| Requirement lives in FRO-316's Review repacking, not the retired Create-shipment wizard | Creation no longer has a repacking step; packing review happens on Shipment Details. |
| Warehouse-confirmed measurements first, declared fallback with a marker | Pallets are built from physical sizes; goods not yet stock-confirmed still show clearly labelled values. |
| Most recent confirmed value at any warehouse, resolved per value | A split child Order gets its own warehouse stay while its confirmed measurements stay on the parent's; a confirmed measurement may hold dimensions or weight only. |
| FRO-299 owns the measurement read; FRO-300 consumes it | The Shipment read had no colli measurements; one owner serves the repacking rows, Colli allocation and this block. |
| Rows follow Colli allocation's grouping and order | The two lists in the same review must read the same way. |

## Out of scope

* A gross-weight subtotal for individual collis.
* Dangerous-goods or other colli flags on the rows (owned by [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297>)).
* Changes to how saved Shipment packages are displayed.
* Any read/API, storage or packing-operation change; Shipment creation; a new component, layout or preview.

## Context for agents

Live repository **Frontline-Forwarding/frontline-forwarding**, read through `gh` on 26 October 2026 at main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`.

| Source | Fact |
| -- | -- |
| `frontline-forwarding-client/src/features/shipments/components/shipment-composer.tsx` (`ShipmentReview`) | Retired wizard reference only. Individual collis = selected collis with no assignment; Transport pieces = individual collis + load units. Optional repacking plan shows only load-unit cards, or "No repacking selected. All {count} collis will ship individually." when there are none. Colli allocation rows show tracking code, description, dimensions, gross weight and Shipping form. |
| `frontline-forwarding-app/src/main/resources/graphql/shipments.graphqls` | `Shipment.looseContents` and `loadUnits.contents` (`ShipmentContent`) carry only colli id, tracking code and Order id/number at loading. Measurements and description arrive through FRO-299. No root/parent Order reference is on the Shipment read. |
| `frontline-forwarding-app/.../web/shipments/service/ShipmentsApiService.java` | Current creation candidates use declared measurements. Partial splits create a new child warehouse stay without copying measurements. |
| `docs/reference/database.md` (`freight_handling_unit_measurement`) | DECLARED / WAREHOUSE_CONFIRMED, one per colli + stay + source; a measurement needs dimensions or gross weight, not both. |
| `docs/workflows/purchase-order-colli-journey.md` | Colli flag **Unpacked** = "the goods arrive without packaging". |
| `frontline-forwarding-client/src/app/providers/labels-provider.tsx` | Existing EL: Individual collis → Μεμονωμένα κόλι; Transport pieces → Μονάδες μεταφοράς; Optional repacking plan → Πλάνο προαιρετικής ανασυσκευασίας. |

**Gotcha:** an assignment that no longer points to an existing load unit must render the colli as individual, or it disappears from the review.

## Post-deployment verification

Read-only, with an authorized internal account, on a PREPARING Shipment. Open **Plan packing**, use **Confirm packing** to reach Review repacking, then **Back to repacking** / **Cancel** — never **Confirm ready for dispatch**.

| AC | Check |
| -- | -- |
| 1, 4, 6, 7 | On a Shipment with saved load units and loose collis, compare the block's rows with the Shipment's loose contents and the Colli allocation list; check row content, order and counts. |
| 2 | On a Shipment with no load units, confirm every participating colli is listed alongside the all-individual message. |
| 3 | In the draft, assign every colli to a load unit, Confirm packing, and check the block is absent and the total is 0; then Cancel. |
| 5 | For three collis, read their Order's `HandlingUnitMeasurement` list and declared values; confirm the shown values and **Declared** markers match FRO-299's rule. |
| 8 | Change one assignment after Back to repacking, re-confirm the draft, check the refreshed block; then Cancel. |
| 9 | Re-read the Shipment after Cancel; saved packing and status are unchanged. Compare a READY_FOR_DISPATCH Shipment's saved loose contents with its packing as confirmed. |
| 10 | Repeat one review in EL and at ~400px; tab through the block. |

*Reference:* FRO-316 (Review repacking UI), FRO-299 (measurement read and formatting), FRO-325 (packing and readiness contracts).
