**Shipment Invoice goods, totals and review** must follow current eligible source rows during preparation and preserve the declared frozen contents after finalization. Order means purchase order / stock-list item; colli means physical handling unit.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-SHI-02 — hidden frozen lines | A finalized/cancelled invoice returns complete frozen line values after its live source-row link becomes null. Details omits the line while retaining its value in the frozen total. |
| QA-SHI-03 — stale review | Review goods covering collis A/B, then correct allocation to A only while eligibility and commercial values remain unchanged. The fingerprint stays equal and finalization accepts the stored acknowledgement. |
| QA-SHI-05 — unavailable value | A saved draft contains eligible EUR10 and EUR20 rows. The EUR20 row becomes partly covered and unavailable; evaluation and the draft read still total EUR30, although finalization correctly refuses it. |
| QA-SHI-06 — selection lost on regrouping | The same eligible source row moves from participating Order A to Order B on the same Shipment. Refresh drops its selection and reports the old group entry as removed. |

UI observations and extracted backend methods reproduce these defects in isolation. The allocation/deletion database paths were traced; real SQL/concurrency and deployed-browser behavior remain unverified.

## Acceptance criteria

1. **Frozen history:** render every persisted frozen line of FINALIZED and CANCELLED invoices even when its live source-row link is null. Use document identity plus persisted line position for display identity; retain frozen ordering, source references, description, HS code, quantity/unit, prices/amounts and currency. Keep frozen document fields, total and printed number unchanged. Never reconstruct historical values from current source rows or invent a deleted source ID.
2. **Eligible selection identity:** reconcile refresh by stable source-row identity across the complete current eligible Shipment goods. Preserve a still-eligible selection when its current offering Order changes; show it under that Order without duplication or an unavailable warning caused only by regrouping. Preserve unaffected selection/order and document input. New rows remain unselected; genuinely unavailable selections retain the existing explicit removal/review behavior.
3. **Active totals:** calculate draft/evaluation totals and currency membership from currently eligible selected rows only. Exclude absent, deleted and offered-but-ineligible rows from monetary aggregation while retaining their unavailable/deleted warnings and finalization requirements. No eligible rows returns no full total; one eligible currency returns its sum; multiple eligible currencies remain a conflict with no combined total. Do not substitute the manual partial amount/currency or invent an empty EUR0 total. Apply consistently to evaluation, saved-draft reads, Details and Shipment-card totals.
4. **Allocation-aware review:** bind acknowledgement to relevant current allocation state/coverage as well as the existing selected identities, values, eligibility and checked packing/weight/partial fields. A coverage change must invalidate review even when the row remains eligible and its value is unchanged. Canonicalize coverage deterministically so the order of an unchanged set does not cause a false change. Preserving selection under criterion 2 must not preserve a stale acknowledgement.
5. **Finalization and existing drafts:** re-evaluate authoritative source/allocation state before finalization and reject a stale stored or submitted acknowledgement before freezing or allocating a number. Existing drafts whose stored fingerprint no longer matches the corrected calculation require renewed review; an attempted save with a stale acknowledgement must not mark them reviewed. Use the existing comparison/storage contract without rewriting finalized/cancelled history or blanket-clearing unrelated data.
6. **Preservation:** retain whole-row allocation, single-currency validation, unavailable-selection refusal, overlap warnings, staff permissions, expected versions, frozen records and number/replacement safeguards. Consume existing allocation results; do not add allocation writes to Shipment Invoice, alter Order commercial-edit/Shipment-membership rules or introduce quantity/value prorating. Reuse existing EN/EL goods, totals and review presentation.
7. **Verification:** cover each finding in isolated integrated UI/backend/database tests. Include frozen FK-null lines in both terminal states; a row moved between participating Orders; eligible EUR10 plus unavailable EUR20; unavailable rows in another currency; no eligible rows and mixed eligible currencies; same-eligibility coverage changes, deterministic coverage ordering, old stored fingerprints and stale finalization. Confirm unaffected controls and consumers retain their required behavior.

## Decisions and scope

One ticket owns goods consistency through source changes, review and frozen history. **FRO-244, FRO-363, FRO-366 and FRO-301 are references only, not prerequisites or implementation owners; preserve their descriptions and status.** The correction consumes the existing allocation contract and API shapes. Exclude allocation redesign/backfill, list/menu, printing/PDF/discounts, Export and VAT paperwork. Creation/replacement/discard/navigation recovery belongs to the separately agreed Shipment Invoice recovery ticket; no blocking dependency between the two correction groups is established.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed-build equivalence is unverified.

- Client prefix `frontline-forwarding-client/src/features/shipment-invoices/`: `shipment-invoice-mapping.ts` drops null live IDs in `linesAsOrders`; `create/selection.ts` reconciles only beneath the former Order. Follow their Create/Details consumers and the Shipment invoices card.
- Backend prefix `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`: `domain/shipmentinvoices/ShipmentInvoiceEvaluations.java` aggregates offered-ineligible values and omits allocation coverage from the fingerprint; `ShipmentInvoiceReview.java` compares the calculated/stored fingerprint; `ShipmentInvoiceService.java` shares evaluation across draft reads/save/finalize. `ShipmentInvoiceGoodsReader.java` already exposes current row locations server-side.
- `web/shipmentinvoices/service/ShipmentInvoiceOutputs.java` supplies frozen fields with `position` even when `invoiceRowId` is null. `V47__shipment_invoices.sql` preserves frozen columns and nulls the live FK on deletion. Use invoice ID plus position; the internal line ID is not currently exposed. `PurchaseOrdersApiService.java` permits row correction only outside open Shipment participation; preserve that restriction.

Relevant storage: `freight_shipment_invoice.reviewed_fingerprint`, `freight_shipment_invoice_line.position`, nullable `invoice_row_id`, frozen line columns and existing source-row allocation state/version. Existing fingerprint comparison can require renewed review for old drafts without a history rewrite. All exposed evaluation/read/save/finalize paths must share the corrected rules. No new endpoint is required by these findings.

## Post-deployment verification

Read existing records and isolated evidence only; do not change production source rows, allocation, invoices or review state. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Compare terminal API/UI lines, positions and frozen values after isolated source deletion; confirm unchanged total/number and both lifecycle states. |
| 2 | Inspect refresh recordings and submitted source IDs across regrouping, new candidates and real unavailability; check unaffected input/order. |
| 3 | Compare evaluation, saved-draft, Details and card totals/currencies across eligible, unavailable, empty and mixed fixtures. |
| 4 | Compare fingerprints/review state for coverage changes and equivalent coverage in a different order. |
| 5 | Inspect old/stale acknowledgement save/finalize results, renewed-review success and unchanged number/history on refusal. |
| 6 | Review allocation/edit/membership/permission/version/currency/overlap controls and EN/EL presentation. |
| 7 | Match integrated UI/backend/database regression evidence and its source SHA to the deployed build. |

**Reference:** [FRO-244](https://linear.app/front-line-ltd/issue/FRO-244) · [FRO-363](https://linear.app/front-line-ltd/issue/FRO-363) · [FRO-366](https://linear.app/front-line-ltd/issue/FRO-366) · [FRO-301](https://linear.app/front-line-ltd/issue/FRO-301) — references only · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings](https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/runs/2026-11-09-shipment-invoice.md) · [Details evidence](https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-details-qa.test.tsx) · [Create evidence](https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-create-qa.test.tsx) · [Backend evidence](https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-backend-qa.py).
