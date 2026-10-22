# FRO-337 review baseline — 2026-10-22

Fetched updatedAt: 2026-10-20T11:09:08.340Z
Status: Todo
Labels: Order, Pending_Review, Backend, Story
Milestone: 0.0.3
Relations: blocks FRO-335 and FRO-326; no blockers/related issues.
Attachments: none. Comments: none.

**As an office operator I want to enter Quantity and Unit price on each Order invoice row** so that Total value is calculated automatically and cannot be edited independently.

**Order = purchase order = stock-list item.** Production invoice rows currently store Quantity, Unit and Total value, with no Unit price field. Add a persisted unit price and make Quantity × Unit price the source of the row total.

## Invoice-row fields

| Field | Type / format | Rule |
| -- | -- | -- |
| Description | Required String, max 1,000 characters | Preserve existing nonblank validation. |
| HS code | Optional String, max 100 characters | Preserve existing validation. |
| **Quantity** | Required positive Int | Editable; preserve positive-whole-number validation. |
| **Unit** | Existing enum — PC / SET / PKT | Describes what is priced: piece, set or package. Preserve existing values/defaults and translations. |
| **Unit price** | Required nonnegative decimal monetary amount, up to 2 decimal places | Editable. Store the entered price with the row's currency; zero is allowed, blank is not zero. |
| **Currency** | Required existing currency selector | One shared currency for unit price and total. Preserve existing options and currency validation; changing currency does not perform exchange conversion. |
| **Total value** | Derived monetary amount, read-only | Quantity × Unit price using exact decimal arithmetic. Unit price has up to 2 decimal places; display monetary values with 2 decimal places in the design. Currency-specific rounding policy is deferred. No independent input or override. |

Update the displayed total immediately when valid Quantity or Unit price changes. Incomplete/invalid inputs must not show a misleading saved total or silently use zero. Preserve the draft and show validation before save.

## Calculation and persistence

* Persist unit price and currency and calculate the authoritative Total value on the server for create/update; use decimal arithmetic, not binary floating-point calculations.
* The UI and server use the same Quantity × Unit price formula and two-decimal unit-price precision. With positive whole-number Quantity and a unit price of up to two decimals, multiplication introduces no further fractional precision. Reload must show the persisted inputs and server-calculated total.
* Extend applicable GraphQL, REST, MCP and client read/write contracts consistently. Do not trust a client-supplied total or allow an integration to override it independently.
* Apply existing Order/invoice-row authorization, editable-state and open-Shipment restrictions. Creating/updating a row's inputs and derived total is atomic.
* Preserve row identity, ordering, Description, HS code, invoice quantity/unit, existing change audit and unrelated Order fields.
* Order duplication and splitting retain the source row's unit price, quantity, unit and currency through the existing copy behavior, with fresh row identities where currently required. Do not invent quantity allocation or proportional splitting of invoice rows.
* Keep empty invoice collections valid and preserve existing Add/Remove behavior. No new price default is assumed.

## Existing mock rows and compatibility

**The user confirmed on 14 October 2026 that production currently contains mock data.** Historical-total preservation, migration-candidate calculations and manual reconciliation of old invoice totals are not required for this change.

Existing mock invoice rows may be reset or regenerated during implementation to use Quantity, Unit price and calculated Total value. This is a requirement for the implementation rollout, not an instruction to delete data during ticket editing.

* Coordinate callers that currently write Total value with the new Unit price contract. No active write path may continue independent total editing once the new contract applies.
* Preserve unrelated rows during ordinary editing; mock-data reset/regeneration belongs to the implementation rollout.

## Business decisions — 14 October 2026

* **Unit price uses up to 2 decimal places**, with two-decimal monetary presentation in the design.
* **Total value is read-only Quantity × Unit price.**
* **Currency-specific precision/rounding policy is deferred** and does not block UI design. This design decision does not approve additional currency conversion or numerical policies.
* **Legacy-total reconciliation is out of scope because the current data is mock data.** Reset or regenerate affected mock rows during implementation rather than preserving inconsistent historical totals.

## UI ownership and dependencies

**Blocks [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326>) and [FRO-335](<https://linear.app/front-line-ltd/issue/FRO-335>).**

This ticket owns the new field, calculation, validation, persistence, integrations and migration. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> owns saved-Order presentation/authorized invoice editing; <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/create-order-page-redesign">FRO-335</issue> owns the unsaved Create Order inputs. Their UI references must show Unit price and a read-only Total value and supersede any independently editable total requirements.

No separate UI preview is created here. The standalone production Create/Edit forms and other invoice-row consumers must also use the same contract during rollout; an older form must not retain an incompatible total-only write path.

## Acceptance criteria

1. Create/Edit invoice rows accept Quantity, Unit price, Unit and Currency; Total value is visible and read-only.
2. Valid input changes recalculate the preview; persisted totals equal server calculation after save/reload.
3. Quantity must be a positive whole number; unit price must be present and nonnegative; required currency and existing row validation remain enforced.
4. Missing/invalid inputs, overflow/unsupported precision, unauthorized updates and stale/failed saves do not create partial data or report success.
5. Unit price accepts up to two decimal places; reject unsupported precision without silently changing the entered price. Verify exact Quantity × Unit price for fractional and zero prices and quantities greater than one. The design displays monetary values with two decimals; currency-specific rounding remains deferred.
6. Existing mock rows can be reset/regenerated for the new calculated-total contract without historical-total reconciliation. Ordinary saves and split/duplication preserve unrelated rows and the specified copy behavior.
7. All active write interfaces enforce calculated totals; no client or independent total field can override them.
8. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue>/<issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/create-order-page-redesign">FRO-335</issue> provide consistent EN/EL labels, accessible controls, readable totals and narrow-screen layout.

**Affected systems:** Order invoice-row data/storage, create/update/read contracts and integrations, invoice-row validation/calculation, Create/Edit forms and Order Details.

**Out of scope:** VAT/tax calculation, discounts, exchange-rate conversion, fractional quantities, accounting invoice issuance, changing invoice-unit options, or new split-allocation rules.

## Implementation references

Production repository checked through `gh` on 12 October 2026:

* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — PurchaseOrderInvoiceRowInput and PurchaseOrderInvoiceRow currently expose quantity/unit/totalValue, without unit price.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java` — positive Int quantity, required Unit/Total value, nonnegative money and currency validation.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` — atomic invoice-row create/update, copied rows and audit.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx` and `purchase-order-detail.tsx` — current row editors/read-only table.

**Post-deployment verification:** inspect saved rows and regenerated mock fixtures read-only; compare quantity/unit price/currency and returned total. Run two-decimal precision, exact multiplication, invalid/unauthorized writes, rollback and caller-compatibility tests in a safe test environment.

**Reference:** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326>) · [FRO-335](<https://linear.app/front-line-ltd/issue/FRO-335>) · [Production repository](<https://github.com/Frontline-Forwarding/frontline-forwarding>).
