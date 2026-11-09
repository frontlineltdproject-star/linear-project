# Order — allow unknown customs regime until stock admission

**Order** registration must remain possible when its customs regime is not yet known. Require a recorded compatible regime before stock confirmation or storage admission. Order = purchase order = stock-list item.

## Rules

| Situation | Required behavior |
| -- | -- |
| Greece = Yes, registering an Order before admission | Customs regime may be absent. Unknown is not Free circulation and receives no inferred default. |
| Regime is supplied | Keep existing Greece/regime/ΑΛΚ consistency and applicable warehouse-capability validation. |
| Warehouse is missing or has no recorded regimes | Permit registration with regime unknown; explain why a verified selection is unavailable. Do not fabricate warehouse capabilities. |
| Stock confirmation or warehouse storage admission | Require the regime and verify compatibility with the actual receiving/admitting warehouse before any transition or storage write. |
| Creation also records historical admission or stock | Apply the admission requirement in the same operation; optional registration must not bypass it. |
| Greece = No | Preserve the existing non-applicable regime/ΑΛΚ rules. |

## Acceptance criteria

1. Create an otherwise valid Greece = Yes Order with no regime through each applicable pre-admission creation path. Persist absence explicitly and render **Regime not recorded** in existing readers. Never substitute a supported regime automatically.
2. Creation validation and server rules agree. A warehouse with an empty capability set does not strand ordinary registration; entering a regime still requires a validating warehouse and supported choice.
3. Before **Record arrival and set PO in stock**, reject missing/unsupported regimes atomically with an actionable explanation. Preserve the user's inputs and provide the existing authorized customs-correction route.
4. Preserve shared admission checks for warehouse-destination Shipments, their creation/change/dispatch/admission callers, and direct/historical stock-entry paths. Unknown registration is not permission to proceed through an operation that already commits to warehouse storage. Recheck the actual receiving warehouse; opening-warehouse compatibility alone is insufficient.
5. Support authorized completion of a previously unknown regime before admission. Keep current lifecycle, shared-registration, covered-Order and ΑΛΚ correction guards; an unrelated edit must not erase a recorded regime or alter a shared registration.
6. Keep the existing customs column, Details and activity consumers honest about missing values. No mass assignment, warehouse capability backfill, invented Free circulation support or historical-document/stay rewrite.
7. Test unknown registration with missing/empty/known capabilities; supplied compatible/incompatible regimes; Greece = No; completing an unknown regime; direct and historical stock entry; receiving-warehouse transfer checks; stale capability/version changes; permissions; and rollback with no successful audit on rejection.

## Decisions and scope

The business may register an Order before knowing its customs regime. The mandatory boundary is stock confirmation/storage admission, not registration. Preserve existing earlier warehouse-transfer safety checks rather than weakening them as an incidental consequence of nullable registration.

This work owns client/server requiredness and its lifecycle distinction. Customs Storage Entry draft/relationship repairs remain separately owned; creating a Customs Storage Entry is not a substitute for stock admission or a way to infer the regime.

## Context for agents

Production main baseline: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; not proof of deployed behavior.

* `docs/workflows/order-customs-regime.md` defines creation/correction, warehouse validation, shared registration, reads and audit.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customs/OrderCustomsRules.java`: `requireConsistent` currently rejects a null regime for Greece = Yes; `requireSupported` skips null; `requireStorageAdmission` explicitly rejects it and validates the receiving warehouse. Separate registration requiredness from admission requiredness without bypassing the remaining consistency checks.
* Trace all shared-rule callers, including `PurchaseOrdersApiService.java` and `ShipmentsApiService.java`, ordinary/historical/inline creation and stock transitions. The Shipment warehouse-destination guard is also invoked before admission; preserve it.
* Client `src/features/purchase-orders/components/creation/creation-draft.ts` derives choices from the opening warehouse. Existing Details already has an absent-regime display.
* Existing nullable data does not establish that all create/correction paths accept null. Verify API validation and shared-rule effects end to end.

## Verification

Use isolated UI/API/database cases for every criterion; verify saved null versus supplied values and atomic refusal at admission. Read-only deployment verification compares the shipped source and test evidence, existing missing-regime display and capability rules. Do not create Orders or confirm stock in production.

**Reference:** [Order customs contract](https://linear.app/front-line-ltd/issue/FRO-356) · [Order creation](https://linear.app/front-line-ltd/issue/FRO-335) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e).
