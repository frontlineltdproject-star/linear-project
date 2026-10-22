Add **Pickup** to the **Order (purchase order / stock-list item)** to record whether Front Line is responsible for collecting the goods from the supplier.

## Field and behavior

| Field | Type / values | Rules |
| -- | -- | -- |
| **Pickup / Παραλαβή** | Optional nullable Boolean; Yes / No, with an unset state | Yes: Front Line is responsible for pickup from the supplier. No: Front Line is not responsible. Unset: responsibility has not been recorded; it does not mean No. |

New Orders start unset. Selection is optional; an authorized editor may change Yes/No or clear the value back to unset. Use the existing EN/EL Yes/No translations and show unset as **—**. Unset is absence of a recorded responsibility, not a third business responsibility option.

Persist the value independently per Order. It does not record completed collection and must not be derived from or replace **Greece / Pickup in Greece**, supplier, Collection agent, warehouse or Shipment route.

## Create, edit and read contracts

| Operation | Required behavior |
| -- | -- |
| Create | Omitted or explicitly unset Pickup remains unset; persist an explicit Yes or No without coercion. |
| Update | An omitted field preserves the saved value. An explicit clear sets it to unset. An explicit Yes/No replaces it. Preserve this distinction through every affected adapter and form mapping. |
| Read | Authorized Order detail and list read contracts preserve Yes, No and unset distinctly. Update affected REST, GraphQL and MCP representations and generated client types without widening record access or introducing a new list column. |
| Failure / cancel | A denied or failed save persists no partial change and does not report success. Retain the draft for correction/retry. Cancel restores the saved value. |

Use existing Order creation/edit authorities and Frontline/system-administrator identity restrictions. Preserve participant-scoped reads and existing lifecycle/reservation guards. Pickup editing follows the existing header-edit states: **PENDING, EXPECTED_READINESS, READY and IN_STOCK**, subject to those guards; this feature adds no later-stage editing exception.

Keep existing header-update auditing. Changing Pickup must not change readiness/status, record collection, create a Shipment, alter Greece, Collection agent, warehouse custody, Shipment routing, notes or email history, or send an email. Readiness, stock, Shipment and notification eligibility remain unchanged for Yes, No and unset.

## Split inheritance

Both supported child-Order creation paths copy the parent's Pickup value, including unset, at the time of the split:

* Manual Order split creating a **PENDING** child.
* Partial colli selection during Shipment preparation creating an **IN_STOCK** child.

The parent retains its value. Parent and child values are independent afterwards; later edits or clearing do not propagate in either direction. Descendants copy their immediate parent's current value. Preserve existing atomic split behavior, colli identities, lineage and lifecycle rules; a failed split must not leave a partial child or Pickup change.

## Current pages and redesign ownership

Deliver Pickup on the **current Create, standalone Edit and Details pages** with its backend support in milestone **0.0.3**. Reuse existing field controls and page styling: an optional Yes/No selector that supports clearing, and a labelled saved value on Details. Preserve unrelated inputs and saved values. Do not wait for the later redesigns.

| Owner | Responsibility |
| -- | -- |
| **FRO-333** | Persistence, authorized contracts, validation, unset/clear semantics, split inheritance, mock-data treatment and current-page integration. |
| [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) | Redesigned Create Order presentation, consuming this contract. |
| [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) | Redesigned Order Details and inline editing, consuming this contract. |
| [FRO-334](https://linear.app/front-line-ltd/issue/FRO-334) | Collection agent removal and its Greece validation dependency; no replacement dependency on Pickup. |

FRO-333 blocks **FRO-335 and FRO-326**. Their visual work can proceed independently; release integration must consume this contract. Reuse the [Create preview](https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site) and [Details preview](https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/) as design references. No new canvas or preview is required. Previews do not prove production implementation.

## Existing data and decisions

| Decision | Reason |
| -- | -- |
| Optional, initially unset and clearable | An unknown responsibility must not become an invented No. |
| Copy once on both split paths; independent thereafter | Carry the recorded responsibility into the child without coupling later edits. |
| Mock-data-only introduction | Existing affected records are mock data. Leave their new field unset unless a fixture explicitly specifies Yes/No. Real legacy import/reconciliation is separate; no real-data deletion is authorized. |
| Current pages ship with backend support | The field must be usable before the later page redesigns arrive. |

## Acceptance criteria

1. Create and reload Orders with Yes, No and unset through supported creation contracts; all values remain distinct and no selection is mandatory.
2. Change Yes to No and No to Yes, clear either to unset, and reload. Omitted-field updates preserve each saved state; unrelated edits do not invent or erase Pickup.
3. Current Create/Edit/Details use the same persisted value with EN/EL labels, an unset display and existing authorization/state/reservation restrictions. Failed saves retain drafts; Cancel writes nothing.
4. Both split paths copy Yes, No and unset correctly. Subsequent parent/child changes are independent; descendant splits use the immediate parent's current value. Split failure rolls back atomically.
5. Existing mock records are not automatically labelled No or inferred from other fields. Explicit fixture values are intentional; real legacy data is outside this change.
6. Existing read scopes, header audit and unrelated Order/lifecycle/Shipment/email behavior remain intact. Denied and invalid writes fail without partial persistence.
7. Affected persistence, REST/GraphQL/MCP contracts, client mappings and generated references agree on optionality and clearing. Existing callers omitting Pickup preserve it on update.

**Out of scope:** new duplication/import operations, real legacy reconciliation, changing Greece/Collection agent rules, new pickup scheduling/completion workflows, later-stage editing exceptions, new list filters/columns, Shipment fields and notifications, and a separate page redesign.

## Context for agents

Live repository reviewed through authenticated `gh` on **22 October 2026**: `Frontline-Forwarding/frontline-forwarding`.

* `docs/reference/database.md`: existing `freight_purchase_order.pickup_in_greece` is non-null with a true default and a Collection agent constraint. Do not reuse its field or default for optional responsibility.
* Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`: `web/purchaseorders/input/PurchaseOrderUpdateInput.java` and `web/purchaseorders/service/PurchaseOrderRequestValidator.java` currently treat null geography updates as preserve. The new clearable field requires an explicit distinction between omission and clearing.
* In the same Java root, `web/purchaseorders/service/PurchaseOrdersApiService.java` owns header updates and `copyAsPendingDraft`; `web/shipments/service/ShipmentsApiService.java` owns `copyAsInStockDraft`. Cover both copy paths.
* `domain/purchaseorders/PurchaseOrderAuthorizationService.java` under that root and `docs/architecture/authorization.md` define write identity/authorities and participant read scopes. Preserve them.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` and `web/purchaseorders/PurchaseOrderMcpTools.java` under the Java root are affected contract consumers. Inspect actual adapters; compact MCP summaries must not silently coerce unknown to No.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx` and `services/purchase-order-service.ts` in the same feature directory initialize/map form values. Keep responsibility separate from `pickupInGreece`; preserve standalone editing.
* `docs/workflows/purchase-order-colli-journey.md` describes the distinct manual and Shipment-preparation splits. Current inspected contracts contain no dedicated Order duplication operation.

Choose a distinct technical field name from the agreed model. Regenerate affected database/API/client reference documentation and update the relevant curated workflow documentation.

## Post-deployment verification

All production checks are read-only; mutation scenarios above run in an isolated test environment.

| Check | Read-only verification |
| -- | -- |
| Stored values and presentation | Open existing representative Yes, No and unset Orders; compare Details, editor initialization and authorized read responses. Check EN/EL and that unset is not displayed as No. |
| Optional creation and clearing | Inspect the blank Create form and existing editor controls without submitting; review test evidence for create, clear, omission-preservation, failed save and Cancel cases. |
| Split inheritance | Inspect prepared test parent/child records and test results for both split paths, all three stored states, independent edits, descendants and rollback. |
| Data treatment | Review migration/fixture changes and results for mock records; confirm no inferred No default or real legacy deletion. |
| Access and preservation | Review passing authorization, state/reservation, audit and unrelated-field/lifecycle/email regression results. Inspect permitted records and existing audit entries without changing them. |
| Contract consistency | Inspect deployed schema/reference output and adapter test results for nullable reads and distinct omitted/clear/Yes/No update semantics. |

**Reference:** User-approved Pickup decisions; production sources above; FRO-335/FRO-326 presentation contracts and FRO-334 Collection agent ownership.
