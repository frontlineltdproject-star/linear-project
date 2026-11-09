# Export: two agreed ticket groups

The user accepted these two groups, reviewed the complete descriptions and metadata, then explicitly approved creating both with the proposed priorities and labels, including Flow QA, on 9 November 2026. **Created and verified as FRO-384 and FRO-385.** D1/D2 map the unchanged approved description files to the saved issues.

## Approved descriptions and saved metadata

Both: **Front Line LTD (FRO) · Backlog**. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or documents. Related links only; no blocking dependency.

| Draft / approved title | Priority | Complete saved label set | Related issues | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Export creation — protect drafts, pending creation and file uploads](01-creation-drafts-and-uploads.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, export | FRO-317, FRO-350 | QA-EX-01, QA-EX-02, QA-EX-03 |
| [D2 — Export Details — protect edits, reviewed versions and confirmation recovery](02-details-editing-and-confirmation-recovery.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, export | FRO-317, FRO-352 | QA-EX-04, QA-EX-05, QA-EX-06 |

| Draft | Created issue | Priority / status |
| --- | --- | --- |
| D1 | [FRO-384 — creation, drafts and uploads](https://linear.app/front-line-ltd/issue/FRO-384/export-creation-protect-drafts-pending-creation-and-file-uploads) | High / Backlog |
| D2 | [FRO-385 — Details, reviewed versions and recovery](https://linear.app/front-line-ltd/issue/FRO-385/export-details-protect-edits-reviewed-versions-and-confirmation) | High / Backlog |

Priority rationale: D1 risks lost work and uploads inconsistent with accepted file choices. D2 risks unintended edits/removals, unreviewed confirmation and lost recovery. Both approved High priorities were saved unchanged; they are not measurements of deployed incidence.

Current status and label catalogues were fetched. Every approved label exists and is active; Story is the single Type and Frontend the single Area. Reused Flow QA (`06ea4564-06f3-40c4-b546-404049f66151`). No Ready/Todo promotion.

Each numbered file contains the complete approved Linear description used for creation and remains unchanged. This index holds planning information outside the descriptions.

## Consumer trace and ownership

| Consumer / current behavior and source | Required outcome | Owner |
| --- | --- | --- |
| Create controller local state and beforeunload-only guard; direct onward navigation loses state | Protect drafts, original attempt, saved result and unfinished uploads on in-app departure | D1, criteria 1–3/5; FRO-350/317 |
| Create layout permits pending Cancel; original callback continues after discard | Preserve/reconcile submitted operation and display truthful outcomes | D1, criteria 2–3 |
| Create documents controls mutate the queue while old upload closure holds original files | Freeze incompatible changes or implement accepted intent consistently; no stranded queue | D1, criteria 4–5 |
| Creation/attachment services enforce request replay, uniqueness and file-owner/key rules | Preserve those contracts; test actual isolated stored owner/content/retries | D1, criteria 6–7 |
| Details and invoice editors use current version and refreshed membership as baseline | Bind version/baseline to reviewed state; preserve colleague changes | D2, criteria 1–2; FRO-352/317 |
| Details/invoice success clears the current editor after a delayed reply | Keep accepted later input and replacement editor ownership | D2, criterion 3 |
| Customs/cancel dialogs use current version; unknown collapses to failed and close clears context | Preserve reviewed/submitted intent and reconcile uncertainty before conflicting writes | D2, criteria 1/4–5 |
| ExportEditingService strictly checks supplied version, dates, stage and permissions | Preserve guards; prove actual stale refusal and saved/audit outcomes in isolation | D2, criteria 6–7 |
| Connected Orders, summary/protocol/activity readers and invoice VAT state | Refresh successful outcomes; preserve history/protocol and independent VAT events | D2, criterion 6; existing FRO-317/352 rules |

Detailed source references are in the descriptions and [review report](../../docs/qa/runs/2026-11-09-export-to-customs-completion.md). The groups assign coherent operation lifecycles, not a single root cause or effort estimate.

## Coverage and boundaries

| Finding | Draft / principal acceptance criteria |
| --- | --- |
| QA-EX-01: draft, unknown attempt and failed-upload departure | D1 / 1, 2, 5 |
| QA-EX-02: pending discard and late result | D1 / 2, 3 |
| QA-EX-03: removed A uploads; accepted B stranded | D1 / 4, 5 |
| QA-EX-04: Details, membership, EAD/IE599 and cancellation use unreviewed version | D2 / 1, 2 |
| QA-EX-05: later typing, invoice edit and replacement editor erased | D2 / 3 |
| QA-EX-06: Customs/cancel unknown result and discarded recovery | D2 / 4, 5 |

Both drafts separately require preservation and regression verification. All seven criteria per draft map to read-only post-deployment checks.

- Reuse existing creation/Details presentation contracts; no new canvas/preview. Authorization covers ticket creation and planning records; no production branch or source changes.
- Existing Supplier Invoice tickets retain their entity boundaries. No expansion or new blocking dependency.
- Detailed VAT printing/stamping, pending list/Entry-link work and other entities remain outside this package.
- The Entry-family aggregation suspicion was ruled out by the owning-Order contract; it is not a defect or open business question.
- No new vocabulary or qualifying architectural decision.

## Evidence and review basis

- Mandatory planning pull succeeded. Authenticated gh account and production main were checked; source remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Relevant source consumers re-read from the authenticated pinned archive. No production mutation.
- Full current FRO-317/350/352 re-read, all Done with unchanged descriptions. Current labels/statuses fetched. Before creation, complete Export creation/Details searches returned 75/79 results, with no matching bug duplicate; Export candidates were existing requirements with different scopes.
- Prior evidence: 136 existing frontend tests, six creation observations/controls, 15 Details observations/controls and 16 extracted-Java guards. Passing observation tests establish baseline defects, not fixes.
- Frontend service/persistence calls are mocked; Java guards use stand-ins. Full browser, object-store, Spring/PostgreSQL and deployed-build equivalence remain unverified. All 28 full portal scenarios remain Not run.
- Created only the two approved issues and their related links. No existing requirement description/status edits, new application tests, source changes, previews, branches or portal/database mutations.
- [Flow](../../docs/qa/flows/export-to-customs-completion.md) · [Scenarios](../../docs/qa/scenarios/export-to-customs-completion.md) · [Evidence instructions](../../docs/qa/evidence/README.md).

## Verification receipt

Both saved issues were re-read. Complete descriptions match the approved files after only Markdown presentation normalization (table separator length, list markers and angle brackets around link targets). Titles, High priorities, FRO Backlog, full label sets, exact related sets, empty blocking/duplicate relations and unset optional metadata all match. No attachments/documents. All six findings retain their approved owners and all 14 acceptance criteria remain present.

The two description files still match approved commit `bf9a95b`. Source/evidence references and read-only post-deployment checks remain unchanged. This verifies ticket creation, not application fixes or deployment.
