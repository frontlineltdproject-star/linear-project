**Front Line Operators** can perform routine cancellations while shared warehouse-address maintenance remains with Front Line Managers. Reuse existing workflows and controls.

## Required permissions

| Action | Front Line Operator | Front Line Manager / System Administrator |
| --- | --- | --- |
| Cancel an issued Delivery Note | Allow when eligible | Preserve |
| Cancel a Supplier Invoice | Allow when eligible | Preserve |
| Cancel an Export | Allow when eligible | Preserve |
| Cancel a finalized Shipment Invoice | Allow when eligible | Preserve |
| Read warehouse list, details and address history | Preserve | Preserve |
| Edit a warehouse address | Deny | Preserve |

Keep existing role names, company scope, external-role permissions and unrelated operational abilities. An action permission does not bypass lifecycle or ownership checks.

## Backend and frontend behavior

- Update effective operator permissions to include `DELIVERY_NOTE_CANCEL`, `SUPPLIER_INVOICE_CANCEL`, `EXPORT_CANCEL` and `SHIPMENT_INVOICE_CANCEL`, and exclude `WAREHOUSE_EDIT`. Retain `WAREHOUSE_VIEW`.
- Enforce the policy through all supported adapters and report it consistently in the authenticated profile and record capabilities.
- Show the existing cancellation controls to eligible operators. Preserve confirmation, reason fields, pending/error/recovery behavior and disabled-state explanations.
- Preserve Delivery Note Shipment/issuer scope, reviewed versions, fiscal state checks, AADE handling, retained history and replacement behavior.
- Preserve Supplier Invoice cancellation eligibility, VAT/active-Export restrictions and retained files; Export stage/reason/version checks; and Shipment Invoice finalized-state/reason/version checks, numbering and history.
- Remove warehouse Edit controls and deny the direct edit route for operators. Server-side address updates must also be refused. Preserve list/detail/history and operational warehouse lookups, delivery-address selection and copied document addresses.
- Attribute permitted actions to the authenticated operator. Preserve warehouse locking/version checks and before/after audit for permitted editors.

## Decisions

| Decision | Reason |
| --- | --- |
| Operators perform the four routine cancellations | Avoid requiring manager intervention for daily corrections. |
| Managers maintain shared warehouse addresses | Shared reference-data changes remain administrative work. |
| Reuse existing controls and role names | Change permissions without redesigning the workflows. |

## Acceptance criteria

1. An operator's current profile exposes the four cancellation authorities and no warehouse-edit authority. Manager/system-admin and external-role permissions remain unchanged.
2. In isolated tests, an operator successfully cancels one eligible record of each type. The existing state, scope, reason, stale-version and other eligibility failures still reject the action without partial effects.
3. Existing cancellation controls and record capabilities agree with backend authorization for operator, manager and external identities; direct requests cannot bypass restrictions.
4. Operators can read warehouse list/detail/history but cannot enter the edit route or update an address through any supported adapter. Managers/system administrators retain audited editing.
5. Successful cancellations retain their required records, fiscal identities and history and identify the acting operator. Unrelated workflows, address selection and document snapshots are unchanged.
6. Relevant backend/UI tests and authorization/workflow documentation reflect the policy. Update old permission expectations without weakening lifecycle or recovery checks.

## Out of scope

New cancellation choices, fiscal/recovery redesign, file visibility, manager-account delegation, new roles, vessel deactivation and new page layouts.

## Context for agents

Source baseline: `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; this is not deployed verification.

Backend Java paths are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`:

| Source | Implementation context |
| --- | --- |
| `domain/users/UserRole.java` | Existing role-derived authority sets; no role rename or existing-account migration needed. |
| `domain/deliverynotes/DeliveryNoteAuthorizationService.java`; `web/deliverynotes/service/DeliveryNoteCancellationService.java` | Authority/internal identity plus record, issuer and lifecycle checks. |
| `domain/supplierinvoices/SupplierInvoiceAuthorizationService.java`; `domain/supplierinvoices/SupplierInvoiceService.java` | Cancellation authority plus invoice/Export eligibility and audit. |
| `domain/exports/ExportAuthorizationService.java`; `domain/exports/ExportEditingService.java` | Authority and Awaiting EAD cancellation rules. |
| `domain/shipmentinvoices/ShipmentInvoiceAuthorizationService.java`; `domain/shipmentinvoices/ShipmentInvoiceService.java` | Finalized cancellation and capabilities. |
| `web/warehouses/service/WarehousesApiService.java` | Shared read/edit enforcement for REST, GraphQL and MCP. |

Frontend consumers under `frontline-forwarding-client/src/`: `features/shipments/components/delivery-notes-card.tsx`, `features/supplier-invoices/components/supplier-invoice-detail-page.tsx`, Export detail capability mapping/page, Shipment Invoice mapping/details, `features/warehouses/components/warehouse-detail.tsx`, `features/warehouses/guards.ts` and `routes/secured/warehouses/$warehouseId.edit.tsx`.

Existing role tests deny operator invoice/Export cancellations, and `WarehousesApiTests` expects successful operator editing. Change those expectations and add service-level positive/negative coverage. Update `docs/architecture/authorization.md` and `docs/workflows/company-and-warehouse-addresses.md`; regenerate references through repository tooling when required.

## Post-deployment verification

| AC | Read-only check |
| --- | --- |
| 1, 3 | Inspect authorized current profiles, record capabilities and displayed controls for controlled role accounts. |
| 2 | Review isolated test evidence for all four successful operator cancellations and preserved rejection cases; make no production cancellation or fiscal call. |
| 4 | Open warehouse read/history pages and inspect route/action visibility; review isolated direct-update rejection and manager-success evidence. |
| 5 | Read existing cancellation history and warehouse audit records; compare actor attribution and retained facts. |
| 6 | Review test results, documentation and deployed revision. Missing evidence remains unverified. |

**Reference:** [Production source](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e), paths above.
