Defines **supplier invoice-row allocation** for an Order (purchase order / stock-list item). Staff can record what the supplier invoiced even when the supplier gives no breakdown by colli (physical handling unit). Following a split, the office must be able to identify which values travelled, which remained and which still need confirmation.

## Row and allocation

| Fact | Rule |
| --- | --- |
| Commercial row | Retain source Order and row identity, line order, description, optional HS code, positive whole quantity, unit (PC, SET or PKT), non-negative line amount and three-letter currency. |
| Known colli | Assign the whole row to one identified colli. A colli may carry several rows. When that colli moves to a child Order, its rows follow it with their original source references. |
| Colli unknown | Save the full row on its Order. Staff can later identify its colli or confirm that the goods are in a specified group while the exact colli remains unknown. |
| Allocation unit | Use the whole row for this version. Revisit quantity/value allocation across several collis if the office encounters an actual case. |
| Editing | Authorized staff can update allocation during packing, including during open Shipment participation. Preserve the existing stage and participation restrictions on editing commercial fields. |

## Partial shipments and reconciliation

1. Derive known travelling rows from the participating collis. Offer relevant unresolved rows from the split Order family separately. Retain the original row identity throughout. A family relationship alone is insufficient evidence to assign a row to a child.
2. Staff may confirm during packing that the whole row’s goods are in the selected group. Record the group of collis supporting the confirmation. Attribute the row to the travelling child, exclude it from the remainder’s candidates and make it eligible for the Shipment Invoice. A row still awaiting confirmation contributes no value to that document. Dispatch records the actual departure.
3. On a later leg, the row follows its entire confirmed group. If the group splits again, require fresh confirmation before including the row on the onward subset’s invoice. Until then its possible location stays within the last confirmed group. Keep previously excluded sibling branches excluded.
4. Reconcile the original rows separately in each source currency. For each split return **confirmed travelling**, **confirmed remaining** and **awaiting allocation** subtotals. Count each source row once. Confirming a side moves the whole amount into that subtotal. For example, EUR 60 travelling + EUR 30 remaining + EUR 10 unresolved reconciles to EUR 100. Confirming the EUR 10 travelled gives EUR 70 travelling and EUR 30 remaining. Show USD or other currencies separately.
5. Unresolved rows stay available for later investigation. A Shipment may dispatch when its ordinary dispatch requirements are met. On cancellation before departure, the child Order returns to stock with the confirmed group or specific colli assignment retained.

## Changes, corrections and removal

| Event | Required behavior |
| --- | --- |
| Packing changes before invoice finalization | Adding other collis or repacking the original group together preserves its confirmation. If a confirmed member is removed, require fresh confirmation before finalizing a draft that includes the row. |
| Removal after invoice finalization, before dispatch | Allow removal when staff confirm the row’s goods remain in the departing collis and the frozen document still describes the goods, packing and weight accurately. If the removal would invalidate a finalized invoice, require its cancellation first under the Shipment Invoice rules. |
| Warehouse evidence contradicts a confirmation | Retain the original confirmation, record the corrected allocation, actor and reason, and identify affected Shipment Invoices for review. Correct an inaccurate finalized invoice through cancellation and linked replacement. |
| Staff remove a colli record | Staff manually reassign rows they wish to keep. Warn if rows remain attached; confirmed removal deletes those attached rows. Staff identify any duplicate colli themselves. Preserve finalized document history. |

## Scope and decisions

- FRO-301 owns the allocation operations, source identity, split eligibility, confirmation history and per-currency reconciliation reads. Apply the same rules to all exposed write paths. Concurrent or repeated confirmations must preserve one allocation of each whole source row for the split.
- Order Creation and Order Details own presentation. Staff can add a known row directly on its colli in the **Collis** tab, and add a **Colli unknown** row on the Order’s **Invoice rows** tab for later assignment. The Order overview must expose known and unknown rows for reconciliation.
- Shipment Invoice consumes eligible rows. Its existing overlap warning for two documents on the same Shipment still applies. Multiple documents do not multiply the source goods or their value in split reconciliation.
- Existing-row migration is deferred. Suggestion for separate review: preserve each existing row’s Order, quantity, amount and currency and mark the colli unknown pending confirmation. This ticket specifies no backfill.
- UI implementation, previews, PDF generation and automatic duplicate detection are outside this structural ticket.

## Context for agents

Production baseline: main `5774931b9869247f0247013111a452552403f456`. The existing Order row is stored in `freight_purchase_order_invoice_row`. In `frontline-forwarding-app`, both `ShipmentsApiService.java` and `PurchaseOrdersApiService.java` call `PurchaseOrderInvoiceRowRepository.copyTo` during child creation. That method creates child rows with the parent’s full quantities and values. Trace both split paths and their callers when implementing allocation. Use stable colli and source-row references. See `docs/workflows/purchase-order-colli-journey.md` for Order edit locks, split lineage and cancellation behavior.

## Acceptance criteria and post-deployment verification

Use read-only fixture records and controlled test results.

| Acceptance criterion | Verification |
| --- | --- |
| Staff can save an unknown row, assign it later and hold several whole rows on one colli. Allocation during packing preserves commercial edit restrictions. | Read the row and its source identity before and after fixture assignment; compare quantity, currency and amount. Inspect open-participation edit tests. |
| Known rows follow their collis. Unknown rows need confirmation for a partial Shipment Invoice; confirmed rows follow only the supported branch through further splits. | Compare candidates and source IDs for the travelling child, remainder and onward subset before and after confirmation. |
| Every currency reconciles independently across the three subtotals. Unresolved rows can remain at dispatch. | Read a mixed-currency split fixture and compare each subtotal to its original rows. Check duplicate/concurrent confirmation and dispatch test results. |
| Packing changes, cancellation and contradictory evidence preserve traceable allocations and accurate finalized documents. | Read fixtures for a group addition, member removal, cancelled trip and warehouse correction. Compare confirmation history, affected documents and cancellation/replacement links. |
| Manual reassignment and colli removal affect only the intended rows. | Review duplicate-record fixtures and removal tests with and without attached rows; compare surviving source IDs and amounts. |

**Reference:** FRO-287 (Order invoice rows), FRO-244 (Shipment Invoice), FRO-335 / FRO-326 (Order UI).
