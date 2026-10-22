**As an** operator **I want** per-colli **Notes** removed **so that** package contents and handling information use their dedicated fields.

**Order = purchase order = stock-list item. Colli = handling unit.**

## Scope

| Area | Requirement |
| -- | -- |
| Forms and views | Remove per-colli Notes from Create Order, standalone Edit Order and every other colli surface. Remove obsolete labels, form state, hydration, defaults, validation and payload values. |
| Copying | **Add identical** must neither copy nor recreate Notes. Preserve the independent copy behavior of retained colli fields. |
| Active contracts | Retire Notes from handling-unit create/update inputs, outputs, server validation, mapping and persistence across GraphQL, REST and supported MCP consumers. Remove client selections and regenerate affected contracts. No supported path may persist or return per-colli Notes. |
| Storage and fixtures | Remove `handling_unit.notes` through the normal migration process and remove obsolete mock Notes values and fixtures. The system contains mock data only; no historical-value preservation or reconciliation is required. |
| Presentation ownership | [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) owns Create Order presentation; [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) owns Order Details presentation. Consume this removal in those designs; no additional screen or preview is required. |

Coordinate server schema and client operations so released clients no longer request or submit the retired field. Keep generated references and relevant tests synchronized.

## Retained information

* **Colli Description** remains the package-contents field, with its existing contract.
* Packaging condition and handling requirements use [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297)'s flags and dedicated DG fields. Its optional **UN / DG details** text remains available under that ticket's rules.
* Preserve **Order Internal/External Notes**, Shipment Notes, delivery-note Notes and unrelated comments/remarks. Preserve Order Notes in stock-list printing and delivery-note Notes in delivery-note printing.
* Do not copy removed Notes into Description, any other Notes field or DG details, or infer flags from them.
* Preserve colli identities, memberships, measurements, lifecycle, authorities, company scope, reservation restrictions and existing audit history.

## Acceptance criteria

1. No per-colli Notes control or value appears on Create, Edit or Details screens, including EN/EL. Adding, copying and editing collis neither carries a hidden Notes value nor recreates the field.
2. Active create/update/read contracts and persistence contain no per-colli Notes. Current client operations succeed without it; obsolete requests cannot persist it. GraphQL, REST and supported MCP consumers use the updated shared contracts.
3. Migration and fixtures remove the obsolete mock field/values without transferring text or deriving other data. Retained colli and Order data survives the migration.
4. Description, FRO-297 flags/DG details, independent Notes scopes, printing and existing authorization/lifecycle restrictions retain their behavior. Failed saves do not alter saved retained fields.

Validate migration, create/update/copy behavior, obsolete requests, failures and permission restrictions in a safe test environment.

## Decisions

* Retire the field completely so removal covers hidden writes, reads and copying as well as the visible editor.
* Discard obsolete mock values without conversion; dedicated fields retain their own meanings.
* Reuse FRO-335/FRO-326 for presentation and FRO-297 for handling information.

## Out of scope

Additional UI design; changes to Description or independent Notes fields; new flags/DG rules; changes to stock-list or delivery-note content beyond removing any per-colli Notes dependency.

## Context for agents

Sources in `Frontline-Forwarding/frontline-forwarding`:

* `docs/reference/database.md` — `handling_unit.notes` is separate from `handling_unit.set_description` and `purchase_order.notes`.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — handling-unit input/update/output contracts.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/HandlingUnitRepository.java` — Notes persistence on create/update.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java` and `PurchaseOrderOutputAssembler.java` — validation and output mapping. Shared Java inputs also serve REST and MCP creation; schema-only removal is insufficient.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx`, `services/purchase-order-service.ts` and `graphql/purchase-orders.graphql` — paths relative to that feature; form state/hydration, Add identical, payload mapping and read selections.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/StockListPdfModelFactory.java` — stock-list Notes come from the Order.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/DeliveryNotePdfModelFactory.java` — delivery-note Notes belong to the document.

## Post-deployment verification

Use authorized existing records and read-only inspection. Report missing examples as not verified; mutation and migration behavior rely on safe-environment test evidence.

| AC | Read-only check |
| -- | -- |
| 1 | Open Create/Edit/Details in EN/EL and inspect colli controls. Review released add/copy/edit tests and client payload mappings for absence of Notes. Do not submit changes. |
| 2 | Inspect the released schema/contracts and read an existing Order/handling unit through authorized GraphQL/REST and supported MCP reads. Confirm absence of per-colli Notes; review create/update and obsolete-request tests. |
| 3 | Inspect migration/fixture test results and compare retained fields against the test baseline; confirm no text conversion or inferred flags. |
| 4 | Compare saved Description, handling information and independent Notes with the UI/API and existing stock-list/delivery-note PDFs. Review failure, authorization and lifecycle regression results. |

**Reference:** [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297) · [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) · [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326).
