**Allow authorized staff to correct an Order's Invoice company after Shipment inclusion**, while keeping other protected fields and fiscal documents consistent.

**Order = purchase order = stock-list item; colli = handling unit.** This changes the selected Order only, without propagating to its parent or children.

## Eligibility and field contract

| Item | Rule |
| -- | -- |
| Additional eligible Order statuses | `PREPARED_FOR_SHIPMENT`, `SHIPPED`, `AWAITING_IMPORT`, `ARRIVED_AT_DESTINATION`, `LOCATION_UNKNOWN`. |
| Excluded status | `CANCELLED`. |
| Authorization | Existing `PURCHASE_ORDER_EDIT` plus Frontline/system identity and record scope. No partner access or new authority. |
| Invoice company | Entity ID, selected through the existing reference-data dropdown. Must be an active `INVOICE_COMPANY` assigned to the Order's current Client/Vessel. Allow filling an empty value or replacing a saved value; reject clearing. |
| Scope of change | Invoice company only. Preserve other header values, status/readiness, collis, stock/custody, Shipment participation and split lineage. |
| Earlier statuses | Preserve ordinary editing rules in `PENDING`, `EXPECTED_READINESS`, `READY`, `IN_STOCK`; enforce the same document-consistency guards whenever an existing write path changes Invoice company. |

## Delivery-note consistency

Delivery notes (δελτία αποστολής) are eligible only for departures from Frontline-operated warehouses in Greece, regardless of destination or Shipment purpose. Associated-agent and foreign origins are excluded. The separately linked **Delivery notes — restrict preparation & issuance to Frontline-operated Greek origins** ticket owns that shared eligibility rule.

Find actual notes covering this Order through `freight_delivery_note_line.purchase_order_id`, including earlier Shipment participations. Also check current notes for the proposed company on each affected Shipment. Do not restrict the search to the active Shipment or extend it to other Orders in the split family.

| Affected document state | Correction rule |
| -- | -- |
| No covering note | Allow correction subject to the Order rules. Do not prepare notes merely because the company changed. |
| `DRAFT` on an eligible Shipment | Regroup the affected draft lines atomically with the Order correction, as specified below. |
| `ISSUED` | Block until explicit cancellation/reconciliation has completed. Never automatically cancel or rewrite the note. |
| `SUBMISSION_PENDING`, `SUBMISSION_FAILED`, `CANCELLATION_PENDING` | Block pending reconciliation; retained fiscal number/payload or uncertain external outcome must remain protected. |
| `CANCELLED` | Retain unchanged as history. It does not itself block correction or trigger a replacement. |
| Proposed company already has an `ISSUED` or protected in-flight/failed note on the affected Shipment | Block; the Order cannot be appended to that document. |

An unrelated company's note does not block correction unless it actually covers this Order. Foreign/ineligible Shipments without notes impose no document restriction. An actual issued/in-flight note still blocks even if it was created for an ineligible origin. Existing drafts on an ineligible Shipment require explicit reconciliation; do not regroup them into newly created ineligible notes.

## Atomic draft regrouping

1. Recheck the Order, company eligibility, affected notes and versions inside the correction transaction. Require existing delivery-note creation/edit authority when the operation adjusts or creates drafts; Order-edit authority must not bypass document authorization.
2. Move only this Order's draft lines from the old-company draft to the selected-company draft in the same Shipment. Preserve the moved lines' Stock ID, colli quantity and gross weight; do not reconstruct historical goods from current family membership or later measurements.
3. Preserve other Orders' lines and recipient snapshots. Recalculate each affected draft's total collis as the sum of its line quantities and total gross weight as the sum of its line weights; keep sequential line numbering. Remove an old draft if no lines remain, only while it is an unsubmitted `DRAFT` with no fiscal identity.
4. Reuse an existing eligible target-company draft, or create one with the target company's validated fiscal details and the affected movement's entered transport details. Keep existing target-draft transport details. If source/target movement details conflict, reject with a clear reconciliation error instead of choosing or overwriting silently. Preserve issuer/series rules and reject incompatible vessel grouping or incomplete required fiscal details.
5. Persist the Order change, all draft changes and audit together. Any validation, authorization, stale-state or persistence failure rolls everything back. Coordinate with preparation, issuance and cancellation so concurrent commands cannot issue stale lines, duplicate drafts or partly apply the correction.

Cancellation currently attempts replacement preparation. A replacement `DRAFT` is handled by this same regrouping rule, so cancellation does not trap the Order behind a blanket draft restriction. Do not initiate AADE calls, issue notes, allocate fiscal numbers or automatically replace cancelled notes during company correction.

## Existing editor integration

Reuse [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326)'s Order details **Edit / Save / Cancel** and Invoice company selector. In the additional eligible statuses, unlock only this field through the narrowly scoped correction operation; reject injected changes to other protected fields server-side. No dedicated button, new screen, canvas or preview.

Save shows success only after persistence and refreshes authoritative Order/draft data. Failed or stale saves retain the draft and identify the blocking note/Shipment where authorized. Cancel/Escape restores saved values. Unchanged selection is a no-op and must not regroup notes or append a change event. Creation behavior remains owned by FRO-335 and existing contracts.

## Audit and acceptance criteria

Record one `INVOICE_COMPANY_CHANGED` Order activity for each committed correction, with actor, timestamp, previous/new company IDs and affected draft references. Retain traceability for draft movement/removal without deleting issued/cancelled document history. No status-transition or physical-movement event is generated.

1. An authorized operator can fill/replace the company in every additional eligible status; clearing, invalid assignments, unauthorized access and `CANCELLED` changes fail without writes.
2. Other protected fields, related Orders and physical/lifecycle data remain unchanged; all exposed correction paths enforce the same guards.
3. Existing covering notes and target-company conflicts produce the exact state-dependent behavior above, across current and earlier Shipments.
4. Eligible draft regrouping moves the Order exactly once, preserves line facts/other Orders/transport details, recalculates totals and removes only an emptied unsubmitted draft. Missing details, conflicts and incompatible vessels roll back everything.
5. Cancellation-created replacement drafts can be regrouped. Company-only correction with no affected draft creates no delivery note. Historical cancelled notes remain unchanged.
6. Concurrent correction/preparation/issuance/cancellation, repeated saves and failures cannot create partial results, stale fiscal submission or duplicate change events. The existing editor preserves drafts on failure and restores values on Cancel.

## Decisions

| Decision | Reason |
| -- | -- |
| Field-only correction in the existing editor | Correct invoicing data without reopening the protected Order header. |
| Selected Order only; valid nonempty replacement | Preserve split independence and usable document grouping. |
| Protect issued/in-flight documents; regroup unsubmitted drafts atomically | Preserve fiscal evidence while allowing correction without a draft dead end. |
| Check actual historical notes | Earlier fiscal documents remain relevant; a Shipment alone is not evidence that a note exists. |

## Affected systems and scope

**frontline-forwarding-app:** narrow authorized correction service and exposed adapters; Order activity; draft planning/persistence and concurrency guards. Existing whole-header update must not bypass consistency checks. **frontline-forwarding-client:** existing editor eligibility and save integration only.

Tables: `freight_purchase_order.invoice_company_id`, `client_invoicing_company`, `company`, `freight_shipment_purchase_order`, `freight_delivery_note`, `freight_delivery_note_line` and existing Order activity persistence. Preserve the unique current `(shipment_id, invoice_company_id)` document constraint. Add the correction contract through normal generated API/client processes; this ticket does not prescribe a fictitious existing endpoint.

Out of scope: other header edits after Shipment inclusion, company-assignment administration, family propagation, Supplier Invoice/Export/customs-document rewriting, Front Line client-invoice allocation, automatic fiscal cancellation/issuance and bulk cleanup of erroneous historical notes.

## Context for agents

Evidence: `Frontline-Forwarding/frontline-forwarding`, main `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.

- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` — whole-header editing currently stops at IN_STOCK; this exception must remain field-scoped.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderAuthorizationService.java` and `web/purchaseorders/service/PurchaseOrderRequestValidator.java` under that same Java root — existing authority/identity and Client/Vessel assignment validation; existing nullable input is not permission to clear through this correction.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/DeliveryNotesApiService.java`, `DeliveryNoteDraftSourceService.java` and `domain/deliverynotes/DeliveryNoteDraftPlanner.java` under the same Java root — preparation currently creates missing company groups without rebuilding existing drafts and reads current Order parties. A plain company update followed by preparation is insufficient.
- `docs/reference/database.md`, `docs/reference/graphql-api.md`, `docs/reference/rest-api.md`, `docs/architecture/authorization.md`, `docs/workflows/delivery-note.md` — schema, guards, snapshots and cancellation/replacement behavior. Regenerate reference documents from implementation; do not hand-edit generated files.
- `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-detail.tsx` and `purchase-order-form.tsx` — current whole-editor gate and existing company selector. FRO-326 owns shared presentation.

## Post-deployment verification

Use read-only queries and inspect controlled-environment test evidence for mutation outcomes; never perform correction/issuance/cancellation on production to verify this ticket.

1. Open Orders representing each additional eligible status and CANCELLED, under authorized/view-only identities; inspect field availability and compare `purchaseOrderById` saved values with recorded success/rejection cases.
2. Compare recorded before/after Order, family and Shipment data: only Invoice company changes; inspect the Order activity for actor/time/old-new companies and confirm no lifecycle event.
3. Read `deliveryNotesByShipmentId` or `GET /api/v1/shipments/{shipmentId}/delivery-notes` for current and earlier affected Shipments. Compare state, company and covering lines with the blocking/nonblocking test matrix, including ineligible-origin records.
4. Inspect saved draft results: moved Order appears once, other lines retain their values, totals equal line sums, transport details remain correct and only empty unsubmitted drafts disappear. Review rejection/rollback evidence for fiscal-detail, vessel and movement-detail conflicts.
5. Inspect the cancellation/replacement fixture and no-note fixture: correction handles the replacement draft, creates no unrelated note and preserves cancelled snapshots.
6. Review controlled concurrency/retry/failure results and inspect persisted data/audit for atomic outcomes and no duplicate events. Inspect EN/EL editor failure and Cancel behavior using existing presentation.

**Reference:** FRO-326; the linked Greek-origin delivery-note eligibility ticket; repository paths above.
