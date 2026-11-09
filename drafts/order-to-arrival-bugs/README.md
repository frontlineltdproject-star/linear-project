# Order-to-arrival: five agreed ticket groups

The user accepted these five groups, reviewed the complete descriptions and metadata, then explicitly approved creating all five on 9 November 2026. **Created and verified in Linear as FRO-373–FRO-377.** D1–D5 remain local identifiers mapping the approved description files to the saved issues.

This replaces the earlier nine-ticket proposal. Every finding is retained, including the two contract discrepancies attached to the upload investigation.

## Approved descriptions and metadata

All five: **Front Line LTD (FRO) · Backlog · Story · Bug · Pending_Review · Flow QA**. No project, milestone, assignee, parent, cycle, due date or estimate. Related links only; no blocking dependencies. The approved priorities and Areas below were saved unchanged. Bug and Flow QA are ungrouped labels; each issue has exactly one Type and one Area.

Flow QA is a reusable team label for bugs identified while reviewing regular business flows against agreed requirements. Created at the user's request, label ID `06ea4564-06f3-40c4-b546-404049f66151`, colour `#F2994A`; it supplements Bug and does not change readiness.

| Local draft | Created issue | Priority | Complete saved label set |
| --- | --- | --- | --- |
| D1 | [FRO-373](https://linear.app/front-line-ltd/issue/FRO-373/shipment-forms-preserve-unfinished-work-during-updates-and-tab-changes) | High | Flow QA, Shipment, Pending_Review, Frontend, Story, Bug |
| D2 | [FRO-374](https://linear.app/front-line-ltd/issue/FRO-374/order-colli-forms-prevent-stock-entry-crashes-and-reject-invalid) | Medium | Flow QA, Order, Pending_Review, Frontend, Story, Bug |
| D3 | [FRO-375](https://linear.app/front-line-ltd/issue/FRO-375/order-and-shipment-prevent-stale-overwrites-and-duplicate-comment) | High | Flow QA, Shipment, Order, Pending_Review, Frontend, Story, Bug |
| D4 | [FRO-376](https://linear.app/front-line-ltd/issue/FRO-376/shipment-packing-preserve-omitted-net-weight-and-historical-journey) | Medium | Flow QA, Shipment, Order, Pending_Review, Backend, Story, Bug |
| D5 | [FRO-377](https://linear.app/front-line-ltd/issue/FRO-377/order-and-shipment-creation-diagnose-and-resolve-attachment-upload-401) | High | Flow QA, Shipment, Order, Pending_Review, Integration, Story, Bug |

| Draft / title | Priority | Area / entity labels | Related issues | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Shipment forms — preserve unfinished work during updates and tab changes](01-shipment-draft-preservation.md) | High | Frontend, Shipment | FRO-316, FRO-341 | QA-OS-01, QA-OS-07, QA-OS-08 |
| [D2 — Order colli forms — prevent stock-entry crashes and reject invalid measurements](02-order-colli-entry.md) | Medium | Frontend, Order | FRO-326, FRO-335, FRO-336 | QA-OS-09, QA-OS-11 |
| [D3 — Order & Shipment — prevent stale overwrites and duplicate comment retries](03-safe-saves-and-retries.md) | High | Frontend, Order, Shipment | FRO-316, FRO-325, FRO-326, FRO-344, FRO-345, FRO-346 | QA-OS-05, QA-OS-06, QA-OS-10 |
| [D4 — Shipment packing — preserve omitted net weight and historical journey details](04-packing-data-and-history.md) | Medium | Backend, Shipment, Order | FRO-325, FRO-345 | QA-OS-12, QA-OS-13 |
| [D5 — Order & Shipment creation — diagnose and resolve attachment upload 401](05-creation-upload-401.md) | High | Integration, Order, Shipment | FRO-335, FRO-336, FRO-341, FRO-342 | QA-OS-02, QA-OS-03, QA-OS-04 |

Priority rationale: D1 interrupts creation and loses drafts; D3 risks saved-data overwrite; D5 addresses the reported attachment blocker but has an unconfirmed cause. D2/D4 are Medium pending deployment impact evidence. These are not runtime frequency estimates.

Each linked Markdown file is the **complete approved Linear description** used for creation. The files remain unchanged; Linear's equivalent Markdown rendering was normalized during verification. This index and investigation process narrative are not part of the issue descriptions.

## Consumer trace and ownership

| Area / current defect | Required outcome / owner | Preserved contract |
| --- | --- | --- |
| Origin candidate read remounts creation; Notes replaces sibling drafts; arrival state unmounts on tab change | D1 preserves the current valid draft across these boundaries | Existing cargo eligibility, per-card saves, permissions and lifecycle |
| Stock panel dereferences missing new-colli draft; shared validator accepts API-invalid values | D2 reconciles current collis and validates before submission | Existing numeric types, stock prerequisites and reservation guards |
| Order/packing reviews acquire newer versions; comment retry identity changes on refresh | D3 binds submissions to reviewed snapshots and retains unresolved comment identity | Server version/authorization checks; intentional identical-text comments remain distinct |
| Packing resolution loses omitted net; mutable unit fields change older journey context | D4 preserves omitted data and original event facts | Existing explicit-clear, physical-confirmation and historical-retirement rules |
| Upload staging returns reported 401 with unresolved backend cause | D5 diagnoses and fixes the actual failure, verifies end-to-end association/recovery | Existing identity/context boundaries, optional files and atomic creation |
| FRO-336 upload wording and FRO-335 no-file context mismatch | D5 records explicit contract resolution; owning-description edits separately reviewed | Neither discrepancy is promoted to a proved 401 cause |

D1 and D3 touch Shipment editing/controller code; coordinate implementation without expanding either ticket. D3 and D4 both affect packing verification but protect different rules. No new UI direction, preview or production-source branch is part of this ticket task.

## Evidence and remaining limits

- Production source through authenticated gh: main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, rechecked unchanged for drafting; source access also verified against the current named-branch Shipment controller.
- Full current descriptions re-read for FRO-316/325/326/335/336/341/342/344/345/346. All Done and unchanged from the review baseline. Done does not certify deployed behavior.
- Current Type/Area labels and FRO Backlog status fetched. Story/Frontend/Backend/Integration and all listed entity/workflow labels exist and are not retired.
- During drafting, duplicate searches covered draft (45), packing (41), retry (34), 401 (0), colli (75), each returned one complete page. Before creation, all five title searches returned complete pages (75/79/83/84/78 results), with no exact matching title; no exact open duplicate was identified. Ten related owner descriptions were re-read unchanged. Existing issue descriptions and statuses were not edited; related links were added from the new issues.
- [First-pass evidence](../../docs/qa/runs/2026-11-09-order-to-arrival.md); [second-pass evidence](../../docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md); [35-scenario catalogue](../../docs/qa/scenarios/order-to-shipment-arrival.md).
- Prior component/extracted-Java runs remain the evidence; drafting is not a new application test run. The historical journey read still needs database verification; the real upload 401 cause is still unknown. All full browser-flow scenarios remain Not run.
- D5 intentionally leaves the no-file-context contract choice as an explicit investigation deliverable. Its resolution must not be invented by an implementation agent.

## Review and publication

The user approved the complete drafts and requested creation plus a shared identifying label. All five were created with Flow QA, then re-read. Their titles, normalized descriptions, priorities, complete label sets, team, Backlog status and exact related-issue sets match the approved package. Optional metadata is unset, attachments/documents are empty, and there are no blocking or duplicate relations. Backlog/Pending_Review remains unchanged; creation approval does not mark the work Ready.

Production main was rechecked at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Label and status catalogues were fetched fresh; no equivalent flow-QA label existed. The new label was re-read successfully and is present on all five issues. Verification normalized only blank lines, list markers, table separators, URL angle brackets and Linear issue chips; no requirement text changed. No application test run or production mutation was part of creation.

No glossary or architecture decision is introduced by this grouping. Production source and portal remain read-only in this planning project.

## Draft validation receipt

- Five saved descriptions re-read and matched to the prepared text. All 13 finding IDs are assigned exactly once: eleven runtime findings/reports plus two explicit contract clarifications.
- Proposed labels validated against the current catalogue: one Type, one Area, no retired/group labels. Ten related owner issues freshly read; status and descriptions unchanged.
- Nineteen local links in the draft package and changed QA/new-memory material checked; all targets exist. Eight explicitly qualified source paths also checked against the unchanged pinned archive. Existing historical memory content was outside this link check.
- Independent review found no material corrections for the Order forms or safe-save drafts. Applied three backend/upload wording corrections: limit omission preservation to net/notes, allow refusals without backend exceptions, and require success evidence for both creation paths.
- Every acceptance criterion has a numbered read-only deployment check. No application execution or production mutation was performed as part of this documentation-only drafting.
