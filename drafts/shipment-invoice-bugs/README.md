# Shipment Invoice: two approved correction groups, full drafts for review

The user accepted the two groups on 9 November 2026 and requested complete drafts focused on current implemented behavior, with existing issues as references only. **Grouping is approved; final descriptions, proposed metadata and Linear creation remain under review.** No Linear issue was created or edited.

## Proposed titles and metadata

Both: **Front Line LTD (FRO) · Backlog**. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or documents. Related references only; no blocks, blockedBy or duplicate relation. No dependency between the two correction groups was established.

| Draft / proposed title | Priority | Complete proposed label set | Related references only | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Shipment Invoice — correct creation, replacement and saved-action recovery](01-creation-replacement-and-recovery.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, Shipment | FRO-244, FRO-363, FRO-366 | QA-SHI-01, QA-SHI-04, QA-SHI-07, QA-SHI-08 |
| [D2 — Shipment Invoice — preserve goods, totals and review after source changes](02-goods-totals-review-and-history.md) | High | Story, Bug, Pending_Review, Flow QA, Integration, Shipment | FRO-244, FRO-363, FRO-366, FRO-301 | QA-SHI-02, QA-SHI-03, QA-SHI-05, QA-SHI-06 |

Both High priorities follow the accepted grouping: D1 risks incorrect replacement data and another independent creation attempt; D2 risks lost displayed history and finalization with stale review. This is a severity assessment, not a measured production incident rate.

Current label/status catalogues were fetched. Every proposed label exists and is active. Story is the single Type; D1 has Frontend and D2 Integration as its single Area. D2 spans shared backend evaluation/finalization and client identity/rendering consumers; Integration does not imply a new external service. There is currently no Shipment Invoice-specific label; use existing Shipment without creating another label. Reuse Flow QA (`06ea4564-06f3-40c4-b546-404049f66151`). No Ready/Todo promotion.

The numbered files contain complete standalone proposed Linear descriptions. This index contains planning metadata and review notes outside the descriptions.

## Consumer trace and ownership

| Consumer / current behavior and source | Required outcome | Owner |
| --- | --- | --- |
| Details editor defaults, actions and host prefill restore original untouched values | Keep prepared replacement date/cleared references and later operator edits in UI and payload | D1 / 1 |
| Create host request ref and form error handling replace uncertain attempt identity | Preserve original request/payload and recover its actual saved record | D1 / 2–3 |
| Router guards, reload/remount and late callbacks can lose attempt ownership | Retain a recoverable original attempt through permitted departures and isolate late results | D1 / 4 |
| Details mapping/reconciliation converts DISCARDED into Draft and loses destination | Respect terminal state and complete/retry return to Shipment | D1 / 5 |
| Host navigation callbacks discard Promises | Surface actual asynchronous failure and retry only saved navigation | D1 / 6 |
| Existing create/replacement/replay/version/capability contracts | Preserve guards, current replayed lifecycle, number and one-live-replacement behavior | D1 / 7–8 |
| Frozen outputs retain fields/position while client mapping requires live row ID | Render terminal lines from invoice/position and frozen values | D2 / 1 |
| Shared selection helper matches only the former Order | Preserve stable eligible rows under current Order without selecting new goods | D2 / 2 |
| Shared evaluation includes offered-ineligible amount/currency | Aggregate eligible rows only across evaluation, draft Details and Shipment card | D2 / 3 |
| Evaluation fingerprint omits allocation coverage; review/finalize compares that hash | Deterministic coverage-aware acknowledgement and stale-finalization refusal, including existing drafts | D2 / 4–5 |
| Allocation, Order correction and Shipment membership services | Consume their existing result/identity while preserving write ownership and guard rules | D2 / 6–7; FRO-301 reference |

The two groups keep compatible boundaries: D1 retains the correct current replacement selection provided by existing prefill; D2 owns selection correctness after source changes. Preserving an eligible selection does not preserve an acknowledgement of older allocation coverage. Neither group rewrites historical invoice contents, changes numbering policy or absorbs Export/VAT work.

## Finding and acceptance coverage

| Finding | Draft / principal criteria |
| --- | --- |
| QA-SHI-01: original defaults overwrite replacement values | D1 / 1 |
| QA-SHI-02: null live source ID hides frozen history | D2 / 1 |
| QA-SHI-03: changed coverage retains review | D2 / 4–5 |
| QA-SHI-04: unknown creation becomes another request | D1 / 2–4 |
| QA-SHI-05: unavailable row remains in active total | D2 / 3 |
| QA-SHI-06: eligible regrouped row loses selection | D2 / 2 |
| QA-SHI-07: reconciled discard shown as Draft | D1 / 5 |
| QA-SHI-08: asynchronous navigation bypasses recovery | D1 / 6 |

All 15 acceptance criteria have matching read-only post-deployment checks. Separate regression coverage remains required for each finding, including preserved controls and real isolated persistence/browser boundaries.

## References, evidence and limits

- Fresh full FRO-244, FRO-363, FRO-366 and FRO-301 are Done and unchanged; FRO-244/363/366 comments are empty. They are requirement references only, with no description/status edits or blocking ownership. FRO-371 remains Backlog for global list/menu and is excluded. Future printing/PDF/discounts and broader allocation/backfill are excluded.
- Current Shipment Invoice + Bug search returned only unrelated Supplier Invoice/Order corrections; all 13 current FRO Bug issues were also checked. Prior grouping review read plausible related scopes fully. No duplicate owner was found; repeat before any eventual creation. Existing FRO-373/375/376/378/379/382/384/385 scope remains unchanged.
- Mandatory planning pull succeeded; authenticated gh and production main confirmed `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Re-read relevant create/replay, replacement/reconciliation, selection, frozen output/schema, evaluation and fingerprint consumers from the pinned authenticated archive. A read-only subagent independently checked G2 source identities, totals and review compatibility. No production source change.
- Existing API shapes support both groups: original Create is replayable with its original actor/payload; a frozen API line exposes position but not internal line ID; allocation location/version is already available to backend evaluation. No invented recovery lookup, replacement source ID or allocation endpoint.
- Prior retained evidence: 70 existing frontend tests; 35 new integrated UI checks (25 controls, 10 observations); 80 backend controls plus four observations. Passing observations reproduce defects. No new application tests were run for drafting. Node24.13/Vitest4.1.6/jsdom cached dependencies and JDK17 extraction/stand-ins are not a full Java25/Spring/PostgreSQL or deployed-browser run. No duplicate production record, real rollback/concurrency result or deployed equivalence is claimed.
- Reuse existing Create/Details components and EN/EL contracts; canvas/preview skipped because presentation is already owned and no redesign is needed. Production UI branch is outside authorization. No new vocabulary or qualifying ADR. Only planning artifacts are written and synchronized.
- Workflow status: preflight and accepted grouping complete; consumer trace/spec check and full drafts complete; Linear write awaits explicit approval of full text/metadata; no production implementation/deployment. [Flow](../../docs/qa/flows/shipment-invoice.md), [scenarios](../../docs/qa/scenarios/shipment-invoice.md), [review report](../../docs/qa/runs/2026-11-09-shipment-invoice.md).
