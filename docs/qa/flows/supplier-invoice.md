# FLOW-SI — Supplier Invoice capture, correction and cancellation

**Purpose:** record a supplier's invoice against the correct saved Order, preserve its documents and identity, and allow only consistent, authorized corrections and cancellation.

**Scope:** Order Details entry point or standalone Supplier Invoice creation; selection, invoice facts, local document queue, creation/recovery, saved Details, corrections/reassignment and permitted cancellation. Export assignment and stamping/return/onward-sending progression are separate reviews; their existing protections are boundary cases here. No accounting invoice issuance or tax-law assessment.

**Vocabulary:** Order = purchase order = stock-list item. Supplier Invoice records a supplier's document and its relationship to one Order. It is distinct from the Order's invoice rows, a Shipment Invoice and an Export. Multiple Supplier Invoices can belong to one Order. Supplier, Client and Invoice company derive from that Order; the optional invoice vessel is a separate selection.

**Status:** expected flow mapped from current FRO-321/347/348/349 before defect investigation on 9 November 2026. These are acceptance expectations, not claims of a completed portal run. Source baseline: production main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Current tickets are Done; FRO-318's new presence indicator remains Backlog and is not an assumed delivered feature.

## Fixture and access

Use an authorized Front Line staff actor with the relevant Supplier Invoice create/view/edit/cancel and file authorities. A partner's ability to open an Order grants no invoice access. Use isolated synthetic Orders with a Supplier, appropriate explicit Greece/regime values and reference-data currency/vessel choices. Missing Invoice company is allowed for basic capture; no fallback to Client/Supplier. Do not infer customs regime from a warehouse name.

Use unique invented invoice numbers and small synthetic documents. Exercise both Orders sharing a Supplier and Orders with different Suppliers. Keep Order, invoice, request and attachment IDs in evidence. Full mutation scenarios need an authorized isolated environment; this source-review task does not mutate the production portal/database.

## Normal journey — SI-001

Reopen or re-read after successful writes in an isolated run. Inspect IDs, facts, links and recorded activity; a loading state or local confirmation is not persistence evidence.

| Step | Office action | Expected outcome | Requirement owner |
| --- | --- | --- | --- |
| 1 | Open a saved Order's Available actions. | Eligible staff see Create supplier invoice. A cancelled Order, missing Supplier or unresolved required regime produces the applicable restriction. Existing invoices do not prevent another distinct invoice. | FRO-321/349 |
| 2 | Open Create supplier invoice. | Shared form opens in the same tab with the exact persisted Order selected. Dirty Order edits are protected, never silently saved. Originating Order is retained separately for return. Nothing is created or uploaded. | FRO-349/347 |
| 3 | Inspect or explicitly change the selected Order. | Supplier, Client, optional Invoice company, regime/type, eligible vessels and current admission context refer to the same selected Order. Search alone changes nothing. Incompatible draft clearing requires confirmation; late responses cannot restore the prior selection. | FRO-321/347/356 |
| 4 | Choose the applicable invoice type. | Storage regime selects/locks Αποθήκη Αποθήκευσης (Δελτίο Εισόδου), VAT zero, no expiry, Not required. Other eligible Orders permit Υ.Δ. or MRN type; no guessed regime mapping. Υ.Δ. starts Not started even with zero VAT; MRN VAT is zero and status Not required. | FRO-321/347 |
| 5 | Enter invoice number/date, optional expiry/vessel, currency, net and VAT. | Required values and exact decimals are validated; Athens date/expiry ordering and Client-scoped vessel rules apply. Companies remain derived. No advanced exemption status or physical-event dates are entered. | FRO-321/347 |
| 6 | Select documents and move between Overview/Documents. | Valid bytes remain local; Download returns the selected file, Remove removes only the queued item. Validation errors preserve valid files. Tabs/language/ordinary return retain the draft. Nothing uploads yet. | FRO-347 |
| 7 | Submit once. | Server rechecks authority, current Order/context, type, dates, monetary values and Supplier+trimmed case-sensitive invoice-number uniqueness. One stable invoice ID and Created activity persist atomically. Repeat submission is prevented; rejection preserves the draft. | FRO-321/347 |
| 8 | Resolve the result and upload queued files. | Confirmed creation shows a result view and saved ID; uploads use that invoice as owner. Partial failure retains successful uploads and pending bytes. Unknown outcomes reconcile the original attempt; neither creation nor a successful upload is duplicated. | FRO-321/347 |
| 9 | Return explicitly to the originating Order, or start another invoice. | Result identifies the actual invoiced Order if selection changed. Correct linked consumers refresh. Remaining local files are protected before leaving; navigation failure cannot turn confirmed creation back into an unsaved form. | FRO-347/349 |
| 10 | Open the saved invoice. | Details show authoritative facts, derived parties, independent cancellation/exemption state, authorized related records and saved invoice-owned downloads. Reads, tabs and links write nothing. | FRO-321/348 |
| 11 | Edit one card and save a correction. | Other mutations are locked while editing. Complete reviewed facts and the reviewed version/context are submitted. Validation/conflict retains the draft; no silent overwrite. Cancel restores saved values without a write. | FRO-321/348 |
| 12 | If necessary, correct the linked Order. | Compatible relationship/type/value/date/vessel changes save as one invoice correction with the same invoice ID. Both old/new Order consumers refresh. No Order/master-data mutation, file movement or implicit Export reassignment. | FRO-321/348 |
| 13 | Cancel a mistaken, eligible invoice through confirmation. | Only an active invoice with no Export assignment and no dispatch/return/onward event may be cancelled. Recheck at confirmation; retain ID, number reservation, Order link, files, values and audit. Cancelled records remain readable, with ordinary mutation controls unavailable. | FRO-321/348 |

## Cross-cutting checks

- Invoice number: trim outside whitespace, preserve case/internal spaces/leading zeros. Same Supplier+number is reserved even by a cancelled invoice; a different Supplier may reuse the number.
- Amounts: 0 through 99,999,999,999,999,999.99 inclusive; at most two decimal places, exact serialization, blank differs from zero. Currency changes do not convert values.
- Invoice date: no later than today in Europe/Athens. Applicable expiry is on/after invoice date. Vessel is optional and must belong to the selected Order's Client.
- Documents: PDF/JPG/JPEG/PNG/WebP/GIF/DOC/DOCX/XLS/XLSX/CSV/TXT; nonempty, filename 1–255 characters, at most 25 MB per file (FRO-347). Verify implementation units rather than guessing decimal versus binary size at the boundary.
- Basic capture does not require a Customs Storage Entry/Export. Distinguish unavailable integration, loading, error, denied access and confirmed absence. Resolve an available admission reference through the Order; never copy it onto an invoice.
- Source company/regime changes must preserve linked-invoice consistency. Splits do not automatically move or duplicate invoices. Active invoices protect ordinary Order cancellation. **Accepted exception (9 November 2026):** a full explicit split may cancel the parent while retaining its active invoices and flagging explicit reassignment. Keep invoice ID, facts, files/history and existing reassignment guards; no automatic move/copy/cancellation. FRO-321 wording alignment is pending separate review; see SI-Q01 in the run log.
- Unknown outcomes differ from rejected writes. Preserve the original request/payload/context before reconciliation. Successful operations commit activity with state; failed operations leave no partial writes.
- Draft, tab/language, navigation and pending-operation protections apply to both creation and Details. Enforce permissions in the server as well as the UI.

## Sources and review boundaries

- [FRO-321 — entity and rules](https://linear.app/front-line-ltd/issue/FRO-321)
- [FRO-347 — shared Create](https://linear.app/front-line-ltd/issue/FRO-347)
- [FRO-348 — Details](https://linear.app/front-line-ltd/issue/FRO-348)
- [FRO-349 — Create from Order](https://linear.app/front-line-ltd/issue/FRO-349)
- [FRO-356 — explicit Order regime](https://linear.app/front-line-ltd/issue/FRO-356)
- [FRO-318 — separate pending presence indicator](https://linear.app/front-line-ltd/issue/FRO-318)
- [Pinned source workflow](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/supplier-invoices.md)
- [Scenarios](../scenarios/supplier-invoice.md) and [review evidence](../runs/2026-11-09-supplier-invoice.md) distinguish expected behavior, source evidence and actual execution.

The older Context for agents paragraphs in the UI tickets describe an earlier baseline without Supplier Invoices. Current main contains the feature. Treat those paragraphs as historical implementation context, not a present absence or a requirement to remove it. Conflicting current requirements remain open until resolved; do not invent business decisions.
