**Start shipment** must evaluate the complete current Stock List selection and account for every selected Order when opening Shipment creation.

**Order = purchase order = stock-list item. Colli = permanently identified physical handling unit.**

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-SL-06 — stale eligibility | Tick two eligible Orders at one origin. One is reserved elsewhere; the refreshed row shows the change, but Start shipment remains available. An Order becoming eligible can remain blocked until reticked. |
| QA-SL-07 — silent subset | Select two eligible Orders at an origin with 101 candidates. One lies beyond the first 100 fetched by creation and silently disappears from the draft. The same silent omission occurs when a requested Order becomes unavailable. |

Isolated tests execute the real list, creation components and payload mapping with synthetic reads. They demonstrate stale action state and a reduced draft/would-be request, not an invalid or incomplete Shipment saved in production.

## Acceptance criteria

1. **Current complete-set eligibility:** keep selected IDs, but recompute Start shipment availability from current status, reservation, warehouse/stay, nonterminal-colli count and date-sensitive readiness. Cover visible and off-page selections and transitions in both directions. Require shipment-create authority and one eligible origin for the entire set; revalidate before handoff and do not proceed on unresolved eligibility reads.
2. **Complete handoff:** preserve every requested eligible Order and its eligible collis at the selected origin, including Orders outside the first candidate page. Read every requested ID through an authorized candidate path; a partial candidate response cannot establish absence. Do not add unrequested Orders, duplicate collis or relax eligibility to preserve the selection.
3. **Explicit reconciliation:** if a requested Order is missing, inaccessible, reserved or otherwise ineligible, explain the unresolved/excluded selection without exposing unauthorized details. Do not silently continue with a reduced draft. Require the operator to resolve/review the changed set before proceeding to creation; unavailable goods stay unselected.
4. **Reliable loading:** failed/incomplete candidate reads keep the original requested IDs available for retry and are distinct from a confirmed exclusion. Late results cannot replace later deliberate draft choices with the original preselection. Coordinate existing origin-change/draft protection with FRO-373.
5. **Preservation:** printing remains independent of shipment eligibility. Keep shared checkbox/count behavior, selection across list pages/filters/groups and clearing on leaving. Preserve creation review, server authorization/revision checks and existing lifecycle rules. Opening, refreshing or reconciling this draft creates no Shipment, reservation or split.

## Decisions and scope

One ticket owns Stock List selection → eligibility → initial creation handoff. The existing creation page and feedback controls are reused. FRO-373 retains origin-change and unfinished-draft fixes; this ticket adds complete initial-selection reconciliation. No new shipment mode, eligibility rule, background reservation or broad lifecycle change.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed equivalence is unverified.

- Client `src/routes/secured/purchase-orders/index.tsx` and `features/purchase-orders/components/purchase-order-table-state.ts`: checkbox-time warehouse eligibility is stored separately from refreshed rows. `purchase-order-selection-toolbar.tsx` already passes all selected IDs.
- Client `src/routes/secured/shipments/new.tsx`, `features/shipments/hooks/use-shipment-creation.ts`, `services/shipment-service.ts` and `components/creation/shipment-creation-mapping.ts`: first-100 candidate read and intersection-only initialization silently omit requested IDs. The backend candidate read supports pagination.
- Preserve the existing server eligibility and reviewed-selection contracts; do not bypass them with arbitrary Order-detail data. Convert observation tests for stale/off-page/date changes, complete/missing handoffs and two-selected-among-101 into fix regressions.

## Post-deployment verification

Use read-only build/record inspection and isolated results. Do not create Shipments or change production reservations; missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Review refreshed/off-page reservation, warehouse, terminal-colli, unknown-location and date-rollover cases in both eligibility directions, plus authority controls. |
| 2 | Compare exact requested Order IDs, draft colli identities, review and captured payload for two selected Orders spanning candidate pages. |
| 3 | Inspect unavailable/missing/inaccessible cases and explicit reconciliation before continuation; verify no silent subset or disclosure. |
| 4 | Review delayed/failed reads, retry and later user-choice preservation together with the related origin-change regressions. |
| 5 | Check selection/printing controls and before/after domain snapshots proving handoff caused no writes; match results to the deployed revision. |

**Reference:** [FRO-279](https://linear.app/front-line-ltd/issue/FRO-279) · [FRO-341](https://linear.app/front-line-ltd/issue/FRO-341) · [FRO-373](https://linear.app/front-line-ltd/issue/FRO-373) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA evidence](https://github.com/frontlineltdproject-star/linear-project/blob/ccbcc002634500c5c369a5543767487c45e64df3/docs/qa/evidence/stock-list-selection-notes.md).
