**Stock List PDFs** must show the correct current measurements and associated transport reference, with readable External Notes and Order identifiers.

**Order = purchase order = stock-list item. Colli = permanently identified physical handling unit.**

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-SL-08 — old measurements | Before warehouse confirmation, change a colli from gross/net 10/8 kg and 10×20×30 cm to 20/18 kg and 40×50×60 cm. The print model still uses the original DECLARED history snapshot. |
| QA-SL-09 — old transport | An older ARRIVED Shipment has CMR-OLD; a newer associated READY_FOR_DISPATCH Shipment has CMR-NEW. The print model chooses CMR-OLD because dispatched legs sort first. It also borrows the old reference when the newer leg's reference is empty. |
| QA-SL-10 — collapsed notes | Save LINE_A, LINE_B and LINE_C on separate External Notes lines. The rendered PDF merges lines and wraps only to fit the column. |
| QA-SL-11 — overlapping ID | Print valid child number PO-0000001_100. Its unwrapped text extends into the adjacent Client column. |

Fixtures are synthetic. Exact backend bodies with stand-ins reproduced the data errors; actual template/OpenHTMLtoPDF rendering reproduced the two layout errors. Real SQL, full application PDF generation and deployed behavior remain unverified.

## Acceptance criteria

1. **Current declared measurements:** without a WAREHOUSE_CONFIRMED measurement, use current declared gross/net weights and dimensions. An original DECLARED history snapshot cannot override corrections. The example prints 20/18 kg and 40×50×60 cm. Genuine full warehouse-confirmed measurements retain precedence; fix the reader without rewriting stored measurements or history.
2. **Latest associated transport:** a newer associated undispatched leg takes precedence over an older dispatched/arrived leg. Print CMR-NEW in the example; if that newer leg has no number, print blank without borrowing an earlier reference. Preserve exclusion of cancelled Shipments and removed participation, Order scope and deterministic ordering in otherwise unchanged cases.
3. **External Notes:** preserve saved internal line breaks while allowing long lines to wrap within the cell. Render escaped plain text. Empty External Notes remain empty; never fall back to Internal Notes, including for staff-generated PDFs.
4. **Complete readable IDs:** render the full valid Order number, including long split-child suffixes, without clipping or overlap with Client or other cells. Preserve the identifier itself and the approved fixed column layout. Verify ordinary and long IDs beside long client names.
5. **Existing print contract:** preserve 1–100 distinct authorized Orders, whole-request rejection for a missing/unauthorized ID, one row per selected Order and descending internal-number order. Use current nonterminal collis for counts/totals/DG, retain zero-colli rows and missing-versus-zero behavior, package type/dimensions grouping without PCS, and current/last-known location rules. Printing changes no business record or history.
6. **Rendered output:** retain fixed A4 landscape columns, repeated branded/table headers, timestamp, page numbering and footer, independent of screen column preferences. Inspect every page of representative empty, long EN/EL, multiline, long-ID and multipage PDFs; pair rendered assertions with model/authorization regressions.

## Decisions and scope

Keep the approved template and existing print operation. Correct the original-DECLARED-snapshot defect and older-dispatched/newer-undispatched precedence. This ticket does not establish a new cross-stay fallback rule for partial warehouse measurements, change storage/history, restore PCS, redesign the document or alter Shipment lifecycle rules.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed equivalence is unverified.

- App `src/main/java/com/frontline/forwarding/web/purchaseorders/service/StockListPdfModelFactory.java`: chooses the latest record from all measurement sources. `PurchaseOrdersApiService.java` writes the original DECLARED snapshot; pre-stock edits update current fields. `PurchaseOrderOutputAssembler.java` supplies both.
- App `domain/shipments/ShipmentRepository.java:101–114`: dispatched-first ordering; `StockListPdfService.java` consumes the selected reference. Other similarly named repository methods concern different histories; avoid unrelated changes.
- App `src/main/resources/templates/stock-list.html`: normal whitespace collapses Notes and the first cell forces nowrap. Preserve escaped text and the rendering contract in `PdfRenderService.java`.

## Post-deployment verification

Inspect existing authorized records, generated samples and isolated test evidence without editing production fixtures. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Compare current declared values, original snapshot and model/PDF output; review full confirmed-measurement and no-write controls. |
| 2 | Compare the two-leg fixture's saved/empty newest reference with output; review cancelled/removed/other-Order exclusions. |
| 3 | Inspect short deliberate lines, long lines, escaped text and distinct/empty External Notes; confirm Internal Notes remain absent. |
| 4 | Inspect complete root/child IDs beside client text and verify glyphs do not overlap adjacent cells. |
| 5 | Review authorized mixed-status selections, rejected whole requests, current/terminal/zero-colli aggregates, PCS and location controls. |
| 6 | Inspect every page of representative PDFs and match renderer/font, backend tests and source revision to the deployed build. |

**Reference:** [FRO-279](https://linear.app/front-line-ltd/issue/FRO-279) · [FRO-292](https://linear.app/front-line-ltd/issue/FRO-292) · [FRO-295](https://linear.app/front-line-ltd/issue/FRO-295) · [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA evidence](https://github.com/frontlineltdproject-star/linear-project/blob/ccbcc002634500c5c369a5543767487c45e64df3/docs/qa/evidence/stock-list-evidence.md).
