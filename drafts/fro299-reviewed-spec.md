**As an** operator packing a Shipment **I want** each colli's dimensions and gross weight beside its load-unit assignment, and every load-unit measurement field labelled with its unit, **so that** I can build pallets and boxes without guessing what fits or what a number means.

**Order = Purchase Order = stock-list item.** A **colli** (handling unit, `freight_handling_unit`) is one permanently identified physical package, shown by its tracking code. A **load unit** is a Shipment-scoped PALLET or CARDBOARD_BOX overpack.

## Scope and ownership

| Owner | Responsibility |
| -- | -- |
| **FRO-299** | The colli measurement read contract below (source selection, fields, adapters), and the display requirements that FRO-316 and FRO-341 consume. |
| [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316>) | All UI on Shipment Details: **Optional repacking** modal, **Review repacking**, FRO-300's **Individual collis** block and the Purchase orders card's **View collis**. Blocked by this ticket. |
| [FRO-341](<https://linear.app/front-line-ltd/issue/FRO-341>) | Shipment Creation UI, including per-colli rows in **Creation review**. |
| [FRO-325](<https://linear.app/front-line-ltd/issue/FRO-325>) | Participation, packing, readiness and dispatch operations and their read contract, which these fields extend. |
| [FRO-300](<https://linear.app/front-line-ltd/issue/FRO-300>) | Individual collis display requirement; consumes these fields. |

No new screen, component or preview is part of this ticket. The look is FRO-316's existing Optional repacking design.

## Colli measurement — source rule

Every colli has **declared** values on the colli record and may have **warehouse-confirmed** measurements recorded at stock confirmation (`freight_handling_unit_measurement`, source `WAREHOUSE_CONFIRMED`, one per warehouse stay).

| Value | Shown value | Source |
| -- | -- | -- |
| **Dimensions** (L × W × H) | The colli's most recent warehouse-confirmed measurement that has dimensions, by `measured_at`, at any warehouse. Otherwise its declared dimensions. Otherwise none. | **WAREHOUSE_CONFIRMED** / **DECLARED** / absent |
| **Gross weight** | The colli's most recent warehouse-confirmed measurement that has a gross weight, by `measured_at`, at any warehouse. Otherwise its declared gross weight. Otherwise none. | **WAREHOUSE_CONFIRMED** / **DECLARED** / absent |

* Dimensions and gross weight are resolved **independently**: a colli may show confirmed dimensions with a declared weight.
* The rule is not limited to the Shipment's origin stay. A split child Order gets its own stay record, while its collis' confirmed measurements remain on the parent's stay; they still apply.
* Values are always current. Nothing is snapshotted at dispatch, and packing never changes a colli's own measurements.

## Read contract

| Read | Added per colli | Rule |
| -- | -- | -- |
| Shipment read: GraphQL `shipmentById` / `shipments` (`Shipment`), REST `GET /api/v1/shipments` and `/{id}` — every participating colli, loose or inside a load unit, in every Shipment status | **Description** `String`, nullable · **Package type** existing `HandlingUnitPackageType` · **Length / Width / Height** `Int` cm, nullable · **Gross weight** `Float` kg, nullable · **Dimensions source** and **Gross weight source**: `WAREHOUSE_CONFIRMED` / `DECLARED`, null when the value is absent | Resolved by the source rule. Dimensions are all three or none. |
| Creation candidates: GraphQL `eligiblePurchaseOrdersForShipment`, REST `GET /api/v1/shipments/eligible-purchase-orders` (`ShipmentEligibleHandlingUnit`) | Resolved **Length / Width / Height**, **Gross weight** and both **source** fields | Same rule. The existing `lengthCm` / `widthCm` / `heightCm` / `grossWeightKg` / `netWeightKg` keep their declared meaning, so the **Declared gross** counter stays a declared-only total. |

* Read-only. Same authorization and record scope as the existing reads; no new access for partners or customers.
* Resolve measurements for a whole Shipment or candidate page in bounded queries, not one query per colli.
* Update GraphQL schema, REST/OpenAPI, generated client types and regenerated `docs/reference/`. The MCP Shipment summary returns tracking codes only and is unchanged.

## Display requirements (implemented by FRO-316 / FRO-341)

| Where | Requirement |
| -- | -- |
| **Optional repacking** — each colli row | Permanent tracking code, description, package type, **dimensions** and **gross weight** on the same row as its assignment select. The colli's own values, never the load unit's. |
| **Review repacking** — Colli allocation, FRO-300 Individual collis, **View collis**, FRO-341 **Creation review** per-colli rows | The same values, source markers and formatting as the repacking rows, so screens never disagree for the same colli. |
| **Source marker** | A **DECLARED** value is followed by a muted **Declared** / **Δηλωμένο**. A warehouse-confirmed value has no marker. An absent value shows **—** with no marker. |
| **Formatting** | One shared formatter: dimensions `120 × 80 × 100 cm`, weight `450 kg` (up to 2 decimals), absent **—**, never blank or zero. |
| **Load-unit fields** (Optional repacking) | Every input has a visible label above it that stays visible when filled: **Type**, **Label**, **Length cm**, **Width cm**, **Height cm**, **Gross kg** (EL: Μήκος cm, Πλάτος cm, Ύψος cm, Μικτό βάρος kg). No in-field suffix. Values are entered and stored in whole cm and kg; nothing is converted. |

Assigning collis to load units, validation, Review/Confirm flow and readiness are unchanged; this adds information only.

## Acceptance criteria

1. The Shipment read returns, for every participating colli in every status, its description, package type, resolved dimensions and gross weight, and a source for each, matching the source rule.
2. A colli with a warehouse-confirmed measurement shows those values with source **WAREHOUSE_CONFIRMED**, including a colli in a split child Order whose measurement was recorded on the parent's stay.
3. A colli whose latest confirmed measurement has weight only shows confirmed weight with declared dimensions (or **—** if none declared), each with its own source.
4. A colli with no confirmed measurement returns declared values with source **DECLARED**; with neither, values and sources are null.
5. The creation candidate read returns the same resolved values and sources for the same colli; its existing declared fields and the **Declared gross** total are unchanged.
6. In Optional repacking, every colli row shows dimensions and gross weight beside its select, with **Declared / Δηλωμένο** on declared values and **—** for absent values.
7. Review repacking, Individual collis, View collis and Creation review show identical values, markers and formatting for the same colli.
8. Every load-unit input shows its visible label with unit in EN and EL, and the label stays visible after typing; stored values equal the entered numbers.
9. Assignments, packing validation, Shipment status and saved packing are unchanged by viewing these values.
10. No measurement is written or changed by any read; unauthorized callers see nothing new.

## Decisions

| Decision | Reason |
| -- | -- |
| Requirement moved from the retired Create-shipment wizard to FRO-316's packing modal | Creation no longer has a repacking step (FRO-341 / FRO-325); FRO-316 owns repacking on Shipment Details in the same release. |
| FRO-299 owns the read contract; FRO-316 owns the UI | The Shipment read had no colli measurements; one owner serves FRO-316, FRO-300 and FRO-341. |
| Warehouse-confirmed first, declared as fallback, with a **Declared** marker | Pallets are built from physical sizes; goods not yet stock-confirmed still show useful values, clearly labelled. |
| Most recent confirmed measurement at any warehouse | Covers split child Orders and multi-leg journeys; packing never changes colli measurements. |
| Dimensions and gross weight resolved independently | A confirmed measurement may record only one of them. |
| Creation candidates use the same rule; declared fields kept | The same colli must read the same on creation and Details, while the Declared gross total keeps its meaning. |
| Visible labels with units, no suffix | Matches FRO-316's design and existing EN/EL strings; placeholder-only units disappeared on input. |

## Out of scope

* Net weight and notes inputs for load units (stored and in the API, not editable in the UI).
* Load-unit validation, including gross weight `> 0` (owned by FRO-316 / FRO-325).
* Locale-aware number formatting changes.
* Editing or recording colli measurements; snapshotting measurements at dispatch.
* MCP Shipment summary; the **Declared gross** counter; any new component, preview or layout change.

## Context for agents

Live repository **Frontline-Forwarding/frontline-forwarding**, read through `gh` on 26 October 2026 at main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`.

| Source | Fact |
| -- | -- |
| `frontline-forwarding-app/src/main/resources/graphql/shipments.graphqls` | `ShipmentContent` has only id, handling-unit id/tracking code, Order at loading, loadedAt, movementClosedAt. `ShipmentEligibleHandlingUnit` has declared lengthCm/widthCm/heightCm (Int), grossWeightKg/netWeightKg (Float), packageType. |
| `.../web/shipments/service/ShipmentsApiService.java` (`eligibleHandlingUnit`) | Candidate measurements come from `handlingUnit.declaredDimensions()` / `declaredWeight()`. Partial splits create a new child warehouse stay (`warehouseStayRepository.create`) without copying measurements. |
| `.../web/shipments/ShipmentsRestApi.java`, `ShipmentsGraphQlApi.java`, `output/ShipmentContentOutput.java`, `output/ShipmentMcpSummaryOutput.java` | REST and GraphQL share the output records; the MCP summary exposes tracking codes only. |
| `docs/reference/database.md` | `freight_handling_unit` declared dimensions (integer, all-or-none, > 0) and declared weight (numeric(12,2), gross > 0). `freight_handling_unit_measurement`: source DECLARED / WAREHOUSE_CONFIRMED (confirmed requires a stay), unique per colli + stay + source, dimensions all-or-none, at least dimensions or gross weight, `measured_at`. |
| `docs/workflows/purchase-order-colli-journey.md` | Stock confirmation requires exactly one confirmed measurement for every current nonterminal colli. |
| `graphql/purchase-orders.graphqls` | `HandlingUnitMeasurement` with `source` already exposed on Orders — usable for verification. |
| `frontline-forwarding-client/src/features/shipments/components/shipment-composer.tsx` | Today's wizard: load-unit inputs use placeholders only (`Length cm` …); `formatDimensions` / `formatWeight` produce `… cm`, `… kg` or **—**. Reference for formatting only; the wizard is retired by FRO-341. |
| `frontline-forwarding-client/src/app/providers/labels-provider.tsx` | Existing EL strings: Μήκος cm, Πλάτος cm, Ύψος cm, Μικτό βάρος kg, Μικτό βάρος; "Declared gross" → Δηλωμένο μικτό βάρος. |

**Gotcha:** do not overwrite the existing candidate `grossWeightKg` with the resolved value — the Declared gross counter sums it.

## Post-deployment verification

Read-only checks with an authorized internal account. No create, save or confirm actions.

| AC | Check |
| -- | -- |
| 1, 10 | Query `shipmentById` for a PREPARING and a DISPATCHED Shipment; every participating colli returns description, package type, resolved values and sources. |
| 2–4 | For three of those collis, read their Order's `HandlingUnitMeasurement` list; confirm the latest confirmed values and fallbacks match, including one colli in a split child Order. |
| 5 | Query `eligiblePurchaseOrdersForShipment`; resolved values equal the Shipment read for the same colli, and declared fields equal the colli's declared values. |
| 6–8 | Open a PREPARING Shipment's **Plan packing** in EN and EL, at desktop and ~400px; check rows, markers, **—** and load-unit labels; type a value and confirm the label stays. Cancel without saving. |
| 7 | Compare one colli across Optional repacking, Review repacking (Back, then Cancel), View collis and the Creation review screen without submitting. |
| 9 | Re-read the Shipment after cancelling; status and saved packing are unchanged. |

*Reference:* FRO-316 (Shipment Details UI and packing preview), FRO-325 (packing read contract), FRO-341 (Creation review), FRO-300 (Individual collis).
