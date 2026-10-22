**As an office operator I want to enter Quantity and Unit price on each Order invoice row** so that Total value is calculated automatically and cannot be edited independently.

**Order = purchase order = stock-list item.** Persist Unit price and make Quantity × Unit price the authoritative row total.

## Invoice-row fields

| Field | Type / format | Rule |
| -- | -- | -- |
| Description | Required String, max 1,000 characters | Preserve nonblank validation. |
| HS code | Optional String, max 100 characters | Preserve existing validation. |
| **Quantity** | Required positive Int | Editable whole number within the existing Int range. |
| **Unit** | Enum — PC / SET / PKT | Piece, set or package. Preserve values, defaults and translations. |
| **Unit price** | Required nonnegative decimal, up to 2 decimal places | Editable; zero is valid, blank is not zero. No new price default. |
| **Currency** | Required dropdown from existing currency reference data | One currency shared by the row's Unit price and Total value. Preserve options and currency validation. Changing currency performs no conversion. |
| **Total value** | Derived monetary amount, read-only | Quantity × Unit price. No independent input or override. |

Display Unit price and Total value with two decimal places. Recalculate the preview immediately for valid Quantity/Unit price changes. Incomplete or invalid inputs display **—**, never zero or a stale saved total; retain the draft and show validation before save.

## Exact calculation and limits

* Persist Unit price and currency; calculate and persist the authoritative Total value on the server for create/update. Use exact decimal arithmetic.
* Preserve exact monetary values throughout entry, client state, request/response serialization, calculation, persistence and reload. Binary floating-point conversion must not alter an accepted value. Extend applicable GraphQL, REST, MCP and client read/write contracts consistently, including generated types and output mappings.
* Unit price and calculated Total value must each be between **0 and 99,999,999,999,999,999.99**, inclusive. This retains the existing total column's `numeric(19,2)` capacity. Validate the product as well as the price before persistence; never clamp, truncate or silently round.
* Reject unsupported unit-price precision without changing the entered price. Positive whole-number Quantity multiplied by a price with at most two decimal places needs no additional fractional rounding.
* Currency-specific precision/rounding remains deferred. Apply the agreed two-decimal rule; introduce no conversion, tax or discount calculation.
* A client-supplied total must never determine the persisted result. Coordinate all callers with the Unit price contract; no active interface may retain an independent total-only write path.

## Saving, permissions and concurrency

Apply existing Order/invoice-row authorization and editable-state restrictions. Current header-editable states are **PENDING, EXPECTED_READINESS, READY and IN_STOCK**; an open Shipment participation prevents invoice-row changes. Recheck authorization, state and participation at save time.

Preserve the existing collection semantics:

| Submitted invoice rows | Result |
| -- | -- |
| Omitted or null on update | Leave existing rows unchanged. |
| Empty collection on update | Remove all invoice rows, subject to the same guards. |
| Nonempty collection on update | Replace the collection: preserve submitted existing IDs, create rows without IDs and remove omitted saved rows. |
| Omitted/null/empty on creation | Create an Order without invoice rows. |

Reject duplicate row IDs and IDs belonging to another Order; creation must not accept existing row IDs. Preserve ordering, Description, HS code, quantity/unit, existing change audit and unrelated Order fields. A per-row Save must retain unrelated saved rows when using the collection-replacement API.

**Reject stale invoice-row saves.** The save must carry a server-verifiable revision/precondition tied to the saved state on which the draft was based. Checking only a freshly loaded server version is insufficient. If that state changed, reject the operation without overwriting or deleting newer data. Keep the operator's draft, explain the conflict, and require refresh/review before resubmission; do not silently retry against the newer revision.

Persist accepted input changes, calculated totals, row additions/removals and associated audit atomically. Invalid input, stale preconditions, changed eligibility or other failures must leave no partial changes and must not report success. Keep empty invoice collections valid and preserve authorized Add/Remove behavior.

## Duplication, splitting and other consumers

* Existing Order duplication/copying retains each source row's Unit price, quantity, unit and currency, with a consistent calculated total and fresh row identities where required.
* Apply this to **both explicit pre-arrival Order splitting and partial-Shipment child-Order creation**. Preserve the existing full-row copy behavior and unchanged parent rows; do not allocate invoice quantities or amounts proportionally to moved collis.
* Calculation applies only to these Order invoice rows. Do not automatically aggregate into or synchronize separate customs/header amounts, duties or other rows' currencies.
* Preserve stock-list PDF and delivery-note/AADE output behavior; those consumers do not derive their values from these invoice-row amounts. This feature introduces no accounting invoice issuance.

## Mock-data rollout and compatibility

The affected existing invoice rows are mock data. Reset or regenerate affected mock rows during implementation to provide valid Quantity, Unit price and calculated Total value. Historical-total preservation and manual reconciliation are not required. This does not authorize deletion of real operational records.

Mock-data cleanup is a rollout operation; ordinary editing, duplication and splitting must preserve unrelated data.

Update active callers, standalone Create/Edit forms, read contracts and fixtures together with the new contract. FRO-337 must work in its **0.0.3** release without waiting for the **0.0.5** redesigns. No older form may retain an incompatible independently editable total.

## Ownership and dependencies

**Blocks [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) and [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335).**

| Owner | Responsibility |
| -- | -- |
| **FRO-337** | Unit price storage/contracts, exact calculation and transport, validation, invoice-row stale-save protection, copy paths, caller compatibility and mock-data rollout. Includes necessary integration into existing forms. |
| **FRO-326** | Saved-Order presentation and authorized invoice-row Add/Edit/Save/Cancel/Remove using this contract. |
| **FRO-335** | Unsaved Create Order inputs using this contract. |

Reuse the linked designs: Unit price is editable and Total value is read-only, with consistent EN/EL labels, accessible controls and usable narrow layouts. No separate UI design or preview is required.

## Decisions

| Decision | Reason |
| -- | -- |
| Two-decimal Unit price; read-only Quantity × Unit price total | One authoritative calculation with no independently contradictory total. |
| Retain existing monetary capacity and exact end-to-end values | Preserve storage bounds without precision loss or silent rounding. |
| Reject stale invoice-row saves and retain drafts | Prevent one operator's older collection from overwriting another operator's saved changes. |
| Defer currency-specific rounding and conversion | Keep this change within the agreed two-decimal pricing scope. |
| Regenerate/reset affected mock rows | Historical-total reconciliation is unnecessary for the confirmed mock-data population. |
| Preserve full-row copies in both split paths | Retain existing behavior without introducing invoice allocation rules. |

## Acceptance criteria

1. Create/Edit accepts the specified fields, shows a read-only live total and preserves draft values on invalid input or failed saves. Empty invoice collections and authorized Add/Remove remain supported.
2. Save/reload returns exact inputs and server-calculated totals through every applicable interface. Verify zero/fractional prices, quantities greater than one and high values that would lose cents through floating-point conversion.
3. Missing/negative/overprecision prices, invalid quantities/currencies and out-of-range prices or products are rejected atomically. Test each monetary boundary and product overflow separately.
4. Client-supplied totals cannot override calculation. Existing forms and active callers work with the new contract before the redesigns ship.
5. Omitted/null, empty and replacement collections follow the specified semantics. Per-row editing preserves unrelated rows; duplicate/foreign IDs are rejected.
6. Two editors reading the same state cannot silently overwrite one another: after the first saves, the second's stale save fails, keeps its draft and requires refresh/review. Rejected saves leave current data and audit unchanged.
7. Permission, editable-state and open-Shipment guards remain enforced at save time; failures roll back all associated changes.
8. Both split paths and existing duplication retain the complete pricing inputs and consistent totals with the required fresh identities, without allocating quantities or changing parent rows.
9. Mock fixtures satisfy the new contract. Independent customs/header values, stock-list PDF and delivery-note/AADE behavior remain unchanged.
10. Linked redesigns consume the same contract with EN/EL, accessible controls, readable totals and narrow-screen support.

Exercise mutation, rollback, concurrency, invalid-input and compatibility scenarios in an isolated test environment.

**Affected systems:** `frontline-forwarding-app` invoice-row persistence, validation, services and applicable API adapters; `frontline-forwarding-client` contracts, forms and detail display; `freight_purchase_order_invoice_row`; Order-copy and Shipment-child creation paths.

**Out of scope:** VAT/tax calculation, discounts, exchange conversion, currency-specific rounding, fractional quantities, accounting invoice issuance, changed invoice-unit options, new split allocation, historical-total reconciliation or a new UI design.

## Context for agents

Live repository baseline checked through `gh`: `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.

Paths below are relative to `Frontline-Forwarding/frontline-forwarding`; Java paths are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Relevant implementation fact |
| -- | -- |
| `docs/reference/database.md` | `freight_purchase_order_invoice_row` stores integer quantity, unit, `total_amount numeric(19,2)` and currency; add persisted Unit price. |
| `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` | Invoice-row input/output currently expose total but no price; money amounts use Float. Exact transport needs deliberate contract handling. |
| `web/purchaseorders/input/PurchaseOrderUpdateInput.java` | Current input has no client revision precondition. |
| `web/purchaseorders/service/PurchaseOrderRequestValidator.java` | Existing row/quantity/unit/text/currency validation. |
| `web/purchaseorders/service/PurchaseOrdersApiService.java` | Transactional create/update, state/participation guards, collection replacement, audit and explicit split. A server-loaded version does not identify an older browser draft. |
| `domain/purchaseorders/PurchaseOrderInvoiceRowRepository.java` | Row persistence and full-row `copyTo`; extend every copy with Unit price. |
| `web/shipments/service/ShipmentsApiService.java` | Partial-Shipment child creation also calls `copyTo`. |
| `web/purchaseorders/service/PurchaseOrderOutputAssembler.java` | Invoice-row output mapping must include Unit price. |
| `frontline-forwarding-client/src/features/purchase-orders/` | `services/purchase-order-service.ts` currently converts entered total with Number; `graphql/purchase-orders.graphql`, `components/purchase-order-form.tsx` and `components/purchase-order-detail.tsx` need consistent contract consumption. |
| `web/purchaseorders/service/StockListPdfModelFactory.java` | Stock-list output does not consume invoice-row monetary values. |

Consumer tracing also checked `DeliveryNoteDraftSourceService`, `DeliveryNoteLineFactory` and `AadeDeliveryNoteXmlBuilder`: preserve their independent delivery-note behavior.

## Post-deployment verification

Use authorized reads only; do not submit production changes.

| Coverage | Read-only check |
| -- | -- |
| Fields, exact values and limits | Open saved/regenerated fixture Orders; compare returned Quantity, Unit price, currency and Total value using exact multiplication. Include zero, fractional and boundary fixtures from the approved test dataset. |
| Interfaces and existing forms | Inspect authorized Order read responses and Create/Edit controls without saving; verify price availability, read-only total and consistent values after reload. Review deployed contract definitions for applicable interfaces. |
| Collection semantics and concurrency | Inspect isolated-test results for omitted/null/empty/replacement collections, ID validation and two-editor conflict handling; compare resulting saved rows/audit through read calls. |
| Validation and atomicity | Review isolated-test evidence for precision/range/product-overflow rejection, unauthorized/state/Shipment failures and rollback; confirm no partial rows or audit changes in the recorded results. |
| Copy paths | Read existing parent/child fixture Orders from both split paths and duplication tests; compare full pricing inputs, totals, ordering and identities. |
| Rollout and preservation | Inspect regenerated mock rows and existing stock-list/delivery-note outputs; compare independent customs/header values with recorded test expectations. |
| Presentation | Inspect available linked screens in EN/EL and narrow layouts without submitting changes. Record separately if the later redesign release is not yet deployed. |

**Reference:** [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) · [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) · [Production repository](https://github.com/Frontline-Forwarding/frontline-forwarding).
