# Stock List tickets — creation verification, 9 November 2026

The user approved the three complete descriptions presented in chat and explicitly requested creation with the proposed priorities and labels, including Flow QA. Approved description files are retained unchanged from planning commit `bedf2170d18e1b9f81b9b89ca25e939ae3aab99e`.

| Ticket | Approved description | Priority | Labels | Related only |
| --- | --- | --- | --- | --- |
| [FRO-393](https://linear.app/front-line-ltd/issue/FRO-393/stock-list-correct-filters-pagination-and-saved-table-settings) | [List controls and settings](01-list-controls-and-settings.md) | Medium (3) | Story, Bug, Frontend, Pending_Review, Flow QA, Order | FRO-254, FRO-279 |
| [FRO-394](https://linear.app/front-line-ltd/issue/FRO-394/stock-list-shipment-keep-eligibility-current-and-preserve-selected) | [Shipment selection and handoff](02-shipment-selection-and-handoff.md) | High (2) | Story, Bug, Frontend, Pending_Review, Flow QA, Order, Shipment | FRO-279, FRO-341, FRO-373 |
| [FRO-395](https://linear.app/front-line-ltd/issue/FRO-395/stock-list-pdf-correct-current-values-and-preserve-readable-output) | [PDF values and formatting](03-pdf-values-and-formatting.md) | High (2) | Story, Bug, Backend, Pending_Review, Flow QA, Order | FRO-279, FRO-292, FRO-295, FRO-297 |

All three were created in team FRO / Front Line LTD, status Backlog. No assignee, project, milestone, parent, cycle, estimate or due date; no attachments or documents; no blocking, blocked-by or duplicate relations. Source and QA links remain in the descriptions. Approved related links are reciprocal; no existing issue description or workflow state was edited.

## Verified readback

Independent full get_issue reads confirmed each saved title, complete description, priority, status/team, complete label set, exact related-issue set and the absent metadata above. The descriptions match the approved files after only Linear presentation normalization: table separator lengths, list markers, angle-wrapped URLs and FRO-373 issue chips in FRO-394. No substantive description change or retry was required. All eleven findings retain one owner and all 17 acceptance criteria retain their verification rows.

Mandatory planning pull completed before ticket work. Authenticated GitHub CLI access verified production main still at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Fresh label/status reads confirmed the approved labels remain active with one Type and one Area per issue. Fresh complete Flow QA and Stock List searches found no exact existing correction ticket before creation; FRO-373's current full issue was reread to preserve its separate origin-change/draft scope.

This is a verified ticket handoff, not evidence of implemented fixes or deployed equivalence. All 28 full portal scenarios remain Not run. Existing isolated-test limitations and the two separate requirement questions remain recorded in the [run report](../../docs/qa/runs/2026-11-09-stock-list-selection-printing.md). No new product tests, portal/database changes, emails, production branches or deployments were performed. The approved numbered description files remain unchanged.
