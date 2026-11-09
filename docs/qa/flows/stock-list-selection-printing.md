# Stock List selection and printing (FLOW-SL)

## Purpose and boundary

Find Orders, select a deliberate set, and generate the fixed Stock List PDF. Order = purchase order = stock-list item; colli = permanent physical handling unit. Start shipment shares the selection, but this review stops at its eligibility and handoff to the creation screen.

User authorized mapping first, then code-based bug investigation on 9 November 2026. The other chat, “Check production review progress”, currently owns Customs Storage Entry. Customs registers/recipient copies, VAT forms, Shipment Invoice, Delivery Note and full Shipment lifecycle remain outside this review.

## Source baseline and later changes

Production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, authenticated through gh at task start. This pins source, not the deployed build. Full current issue descriptions were read; core FRO-279/254/292/295/297 comments are empty.

| Source | Current state | Contract used here |
| --- | --- | --- |
| [FRO-279](https://linear.app/front-line-ltd/issue/FRO-279) | Done | Shared selection, 1–100 Orders, one PDF row per Order, fixed template, atomic authorization and print rules. |
| [FRO-254](https://linear.app/front-line-ltd/issue/FRO-254) | Done | Case-insensitive contains searches, AND across controls, dropdown-backed filters, persistent column order; screen layout does not change PDF layout. Its per-column controls must be compared with current list/API capabilities; do not silently replace this contract with current code. |
| [FRO-269](https://linear.app/front-line-ltd/issue/FRO-269) | Done | Current purchase-order routes and scoped summary reads replace the retired Stock model; validated URL search and Query-owned server state. Its original printing exclusion precedes FRO-279. |
| [FRO-292](https://linear.app/front-line-ltd/issue/FRO-292) | Done | PDF ID Details/Notes uses External Notes only, including empty; no fallback to Internal Notes, even for staff. |
| [FRO-294](https://linear.app/front-line-ltd/issue/FRO-294) | Done | Per-colli Notes retired; Order notes and printing retained under their own rules. |
| [FRO-295](https://linear.app/front-line-ltd/issue/FRO-295) | Done | Remove PCS from packing lines; keep package type, available dimensions and physical colli counts. No empty PCS segment. |
| [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297) | Done | DG derives from current nonterminal member collis, including DG without a class. Historical Shipment DG counts are a separate contract. |
| [FRO-299](https://linear.app/front-line-ltd/issue/FRO-299) | Done | Later per-field latest-nonempty confirmed measurement rule expressly covers Shipment readers. Its application to the PDF's partial later measurements is a recorded clarification, not an assumed extension. |
| [FRO-310](https://linear.app/front-line-ltd/issue/FRO-310) | Canceled | Do not require a new Order-owned AWB. FRO-279 uses the associated Shipment transport reference. |
| [FRO-318](https://linear.app/front-line-ltd/issue/FRO-318) | Backlog | Future supplier-invoice presence column/filter is not a delivered regression requirement. |
| [FRO-362](https://linear.app/front-line-ltd/issue/FRO-362) | Backlog | Future per-colli mixed custody/filtered subset output is not the current one-row-per-Order print contract. |

## Normal journey

| Step | Office action | Expected outcome |
| --- | --- | --- |
| 1 | Open Orders at /secured/purchase-orders | Only authorized records; loading, empty and failure states remain distinguishable. |
| 2 | Narrow the result using supported searches/filters; optionally group/sort | Controls combine correctly across the complete result set, counts and pages. Date and dropdown meaning follows the governing contract. |
| 3 | Tick Orders on one page, another page or another group | One distinct selection by Order ID; count includes selected records outside the currently visible page/filter. |
| 4 | Use a page/group header checkbox | Select/clear only that loaded page's rows, preserving other selected IDs; checked/unchecked/indeterminate state is accurate. |
| 5 | Change filters, grouping, sorting or column order | Selection persists within this list screen. Column preference survives reopening; leaving the list clears selection. |
| 6 | Review the toolbar | Print remains independent of shipment eligibility. Start shipment is available only for the complete eligible selection at one origin and with its required authority. |
| 7 | Choose Print stock list | Capture the intended 1–100 distinct IDs; generate an authenticated PDF. A failure is explained and allows a deliberate retry. |
| 8 | Inspect/save/print the preview | Exactly one row per selected authorized Order, internal number descending; fixed A4 landscape columns, repeating headers, timestamp, page numbers and company footer. |
| 9 | Clear selection or leave the list | Clear explicitly removes the set; returning from another screen starts with no selection. |

Printing changes no Order, colli, Shipment, reservation, customs or fiscal state. A missing/unauthorized ID rejects the complete PDF request; never silently print a permitted subset. Mixed statuses/warehouses are valid for printing.

## Printed columns and rules

| Columns | Required source or meaning |
| --- | --- |
| ID; Client; Vessel; MSG Number | Order internal number and saved relationships/reference. |
| Owner's Ref.; Supplier's Ref.; Supplier | Saved Order references and supplier name. |
| Collis | Current nonterminal member count; each physical colli counts once. Zero still produces an Order row. |
| Gross (kg); Net (kg) | Resolve each weight independently: latest warehouse value where present, otherwise declared; sum available values. No measurements prints blank, distinct from recorded zero. |
| Vol. Road; Vol. Sea; Vol. Air; Vol. Courier | Order-level sums over included collis under existing measurement rules. |
| Packing Info | Package type and available dimensions; group identical descriptions with quantity prefix. No retired per-colli PCS. |
| ID Details | External Notes only, escaped plain text and preserved line breaks; empty stays empty. |
| DG | DG if any included current nonterminal colli is dangerous; otherwise blank. |
| AWB / BL / CMR NR | Transport-document number from the most recent associated Shipment leg; unknown stays blank. |
| Hub; Pos. | Current warehouse/position; for LOCATION_UNKNOWN, last-known location clearly marked LOCATION UNKNOWN. |

Terminal collis remain in history but do not contribute to print aggregates. Missing values stay blank. Long names, packing and multiline External Notes must wrap without clipping/overlap on every page. Screen column visibility/reordering cannot change printed columns. KTA, ALK/MRN and origin country/city from the old reference PDF are not restored.

## Consumer trace and ownership

| Consumer | Rule to verify | Audit owner |
| --- | --- | --- |
| purchase-orders/index.tsx, purchase-order-table.tsx and table-state.ts | Query/filter/group/page state, persistent selection, current action eligibility and navigation reset | This Stock List review |
| purchase-order-selection-toolbar.tsx; purchase-order-service.ts | Immutable submitted IDs, preview lifecycle, failure/retry and shared Start shipment handoff | This Stock List review |
| PurchaseOrdersApiService/Repository, list queries and table preferences | Scoped complete filtering/group counts, truthful option coverage and preference persistence | This Stock List review, limited to list consumers |
| StockListPdfService/ModelFactory, PurchaseOrderOutputAssembler, ShipmentRepository | Request guards, exact rows, current colli facts, notes confidentiality, warehouse/transport mapping | This Stock List review, preserve underlying lifecycle |
| stock-list.html and PdfRenderService | Fixed layout, escaping, pagination and readable output | This Stock List review |
| Shipment creation and customs/invoice/document operations | Preserve existing behavior; no broad lifecycle re-review or production writes | Existing reviews / other chat |

Paths are relative to the current source archive's client src or app Java/resources directories. Findings must cite exact source lines and distinguish code inspection, isolated execution and deployed observation.

## Review checklist

0. Preflight: planning pull, gh source and Linear reads completed; other chat scope checked.
1. Requirements: later changes reconciled above; no new vocabulary or architectural decision.
2. Canvas / 2b preview: skipped; existing UI and approved fixed print template reused.
3. Spec/code trace: baseline saved before reproductions; review completed with 11 bounded findings and two separate requirement questions. See the run report.
4. Ticket: all eleven findings discussed; approved descriptions created and verified as [FRO-393–395](../../../drafts/stock-list-bugs/README.md), priorities Medium/High/High, all Backlog with Flow QA.
4e. UI branch: excluded; production repository is read-only.
5. Memory and planning records: flow, scenarios, report and retained evidence prepared for planning-repository synchronization only.
6. Verification: retained parent reruns and limitations; all 28 full portal scenarios remain Not run.

The source playbook loader failed because the authenticated archive has no Git metadata. Relevant policies are read directly; no successful loader snapshot/fingerprint is claimed. Use [scenarios](../scenarios/stock-list-selection-printing.md) and the [run report](../runs/2026-11-09-stock-list-selection-printing.md) for execution status. Findings describe current implementation problems; they do not change this expected normal journey.
