Defines the **Shipment Invoice**, the document that accompanies a Shipment and declares the value of selected goods. Each invoice belongs to one Shipment. A Shipment may have several independently numbered invoices, including on import movements. Full, partial and HS-code prints are views of one entry.

## Fields

| Field | Type | Rule |
| --- | --- | --- |
| Internal ID / printed number | Unique record ID / continuous integer | Save a draft with its internal ID. Assign its printed number on successful Finalize. |
| Shipment | Required reference | Any non-cancelled Shipment, including after departure or arrival. Use its participating Orders as the goods source. Order means purchase order or stock-list item. |
| Client / Invoicing company | Company references | Use the common commercial Client automatically. If the Shipment represents several Clients, staff select one of them. Choose an invoicing company belonging to that Client. Its details populate Shipper. Eligible goods may span Clients and invoicing companies. |
| Invoice type / subtitle | Fixed choice / editable text | Invoice, Commercial Invoice, Pro-forma Invoice or Shipping Invoice. Subtitle defaults to PACKING LIST and may be cleared. |
| Document date | Date | Staff select the date. Display as dd-mm-yyyy. |
| Shipper / Consignee / Agent / Notify | Editable multiline text | Shipper initially contains Front Line’s details (FRONT LINE, 67, IROON POLYTECHNIOU, 185 36, PIRAEUS, GREECE). Choosing the invoicing company prefills its invoice details into Shipper. Staff can edit the resulting document text. |
| Packing details / total weight | Text / weight in kg | Staff record packages and weight for the goods selected on this invoice. Manual entry supports subsets and shared packaging. |
| Full invoice total | Calculated money | Sum the included row amounts in their common currency. Reject a mixed-currency selection. The calculated amount and currency are read-only. |
| Partial invoice total | Manual money | Staff enter the amount and choose the currency, initially EUR. May be blank for a full invoice. |
| Notes / Ins/Upd | Optional multiline text / creation and update timestamps | Notes are editable during preparation. Expose creation and last update for the list, with N/A when never updated. |

## Goods selection

For a whole participating Order, selecting it initially includes all its eligible invoice rows. Staff may select multiple Orders and deselect individual rows. Combine the selected rows in one ordered collection, with the most recently selected Order’s group above earlier groups. Preserve line order within each group and retain source Order and row identity. Each line supplies description, optional HS code, Order reference, quantity, unit, line amount and currency. HS codes stay on their respective lines.

A draft reads current values for its selected rows. Recalculate the full total when a selected row changes. Offer new eligible rows for explicit inclusion. If a selected row disappears, require staff to review the selection before finalizing. If another Shipment Invoice on this Shipment includes the same source row, identify that invoice in a warning and allow staff to proceed.

**Partial Order shipments depend on FRO-301.** Today a split child can carry full copies of the parent’s commercial rows even when only some collis (handling units) travel. Those copies cannot establish shipped quantities or values. Partial-Order eligibility and quantity allocation require an agreed FRO-301 contract before that path is ready. This ticket does not assign rows to collis.

## Lifecycle, access and numbering

1. **Prepare.** Front Line operators and managers may view, create, edit and discard drafts, and finalize invoices. Restrict access to staff, including direct reads and lookups by Shipment. A draft requires a Shipment. Saving, previewing or printing consumes no printed number.
2. **Finalize.** Require Client and its selected invoicing company, invoice type, date, Shipper, Consignee, Agent, packing details, total weight and at least one eligible selected row in one currency. Notify, Notes and subtitle are optional. Recheck Shipment eligibility and source selection. Freeze the document fields, party text, selected row identities and values, packing, weight and base totals together with number allocation. Later source changes cannot rewrite a finalized document.
3. **Allocate once.** Use one continuous ascending printed-number sequence across Clients, invoice types, movements and calendar years. Failed finalizations consume no number. Concurrent requests and retries must neither skip a number nor issue an invoice twice. The office will supply the first live number at cutover, before first finalization.
4. **Correct.** A manager or system administrator cancels a finalized invoice with a recorded reason. Retain its number, Shipment link and frozen contents. Create a linked replacement when correcting the document. The replacement receives its own number at finalization.
5. **Cancel a Shipment.** Require staff to discard every linked draft and cancel every linked finalized invoice first. Enforce this alongside the existing Shipment cancellation rules, including for concurrent invoice creation or finalization.

## Decisions and boundaries

| Decision | Reason |
| --- | --- |
| One Shipment per invoice, independent of the selected invoicing company | The document accompanies the physical movement. A single document may cover goods across companies. |
| Live draft, frozen base at finalization | Staff see source corrections during preparation and retain the values declared at issuance. |
| Manual packing, weight and partial amount | Selected goods may cover only part of the load. The office retains control of the separately declared partial value. |
| New-portal records only | Continue numbering at cutover. Historical retrieval or migration is separate work if needed. |

**Future UI.** Support standalone creation with Shipment selection and Create Invoice from a Shipment with that Shipment preselected. Preserve the list contract: Client name, Invoice type, Date, Consignee, Packing details, Total weight, Total value and Ins/Upd, all sortable. Retain insert, draft edit/type selection, draft discard, finalized cancellation and print actions under the lifecycle above. For Order selection retain Stock List ID, Client, Supplier, MSG Number, Country of Origin, Destination and Status as context. UI, previews and production branches are outside this structural ticket.

**Future printing.** Full prints include unit price and line value. Partial prints hide both and use the manual partial total. Each has a variant displaying per-line HS codes. Show sum table controls the final weight/value table. A dynamic discount of 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80% or 90% can change displayed and printed prices and totals while the base amounts remain frozen. The printing ticket owns PDF generation, unit-price derivation and rounding, discount treatment of the manual partial total, control persistence, and retention of settings or generated files. The office keeps Enable invoice checked. The effect of unchecking it is unresolved and must be established before specifying that control.

## Context for agents

Production main reviewed at `5774931b9869247f0247013111a452552403f456`. In `frontline-forwarding-app`, use `PurchaseOrderParties.java` for distinct Client and invoice-company references, `ShipmentPurchaseOrderParticipation.java` for Shipment membership, and `PurchaseOrderInvoiceRowRepository.java` for source line identity, quantity and money. `ShipmentsApiService.java` calls `copyTo` on partial-shipment child creation. Follow the Shipment cancellation path for the invoice guard. See `docs/reference/database.md`, `docs/workflows/purchase-order-colli-journey.md` and `docs/workflows/delivery-note.md`. Delivery-note issuance is a precedent for separate draft identity and printed numbering. Define Shipment Invoice persistence and authorized operations for preparation, eligibility, retrieval by ID/Shipment, finalization, discard, cancellation and replacement.

## Acceptance criteria and post-deployment verification

Use read-only fixture reads and controlled integration-test results.

| Acceptance criterion | Read-only check |
| --- | --- |
| One non-cancelled Shipment supports several invoices, including after arrival. Common and mixed Clients resolve correctly, and selecting a company prefills editable Shipper without filtering eligible goods. | Compare stored Shipment, Client, invoicing company, Shipper and available rows for single-Client, mixed-Client and arrived fixtures. |
| Whole-Order selection, deselection, overlap warnings, source edits, additions and removals follow Goods selection. Partial splits require supported allocation. | Compare selected source IDs, ordering, warnings and totals in controlled before/after fixtures. Review removal, mixed-currency and split cases. |
| Drafts are unnumbered. Finalize validates required fields, including Agent, freezes values and assigns exactly one number. | Read draft and finalized fixtures. Compare frozen values after a source edit. Review missing-field, concurrent, failed and repeated finalization tests across types and Clients. |
| Corrections retain the cancelled number and reason, and the replacement links back. Cancellation of a Shipment requires all its invoices to be resolved. | Read a cancelled/replacement pair and its Shipment. Inspect permission, discard and concurrent Shipment cancellation test results. |
| Staff-only access applies across operations. Print choices use the same entry and leave frozen base amounts intact. | Check staff and partner read results and compare stored base amounts with the contract fixtures for full and partial output. PDF appearance is verified in the printing ticket. |

**Template references**

<linear-embed node-type="file">{"href":"https://uploads.linear.app/80ed42b4-423d-4c1b-9de1-ac81bad4e49c/dc5884a6-ec2f-47b2-81bc-8b6d39b80033/8eaa0c11-675e-4000-bbc6-d2a29dbc3de8","name":"Partial Invoice (Blank).pdf","uploadId":"upload-1784030094518-vzixqi9","size":3064,"mimetype":"application/pdf","uploadState":"finished"}</linear-embed>

<linear-embed node-type="file">{"href":"https://uploads.linear.app/80ed42b4-423d-4c1b-9de1-ac81bad4e49c/41361694-ca24-4ce5-ab61-24be8272d1ce/fe1801ce-f8e4-4e7b-b186-0f1a6cec942d","name":"Partial Invoice with HS Code (Blank).pdf","uploadId":"upload-1784030094518-gtwzdfx","size":3099,"mimetype":"application/pdf","uploadState":"finished"}</linear-embed>

<linear-embed node-type="file">{"href":"https://uploads.linear.app/80ed42b4-423d-4c1b-9de1-ac81bad4e49c/839ef817-ea46-4df3-8e7a-809a8aa12512/49ee2af3-241c-4bd5-b64f-6c8c7edf0fce","name":"Full Invoice (Blank).pdf","uploadId":"upload-1784030094518-cjb4vlo","size":3134,"mimetype":"application/pdf","uploadState":"finished"}</linear-embed>

<linear-embed node-type="file">{"href":"https://uploads.linear.app/80ed42b4-423d-4c1b-9de1-ac81bad4e49c/1deb4cee-5e30-4293-8c3b-932d5f924c56/c6c57add-6197-4136-b683-5bcca82fbe00","name":"Full Invoice with HS Code (Blank).pdf","uploadId":"upload-1784030094518-zon5ra1","size":3172,"mimetype":"application/pdf","uploadState":"finished"}</linear-embed>

**Reference:** [Production source](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/5774931b9869247f0247013111a452552403f456)
