# Order-to-arrival: five agreed ticket groups

The user accepted these five groups on 9 November 2026 after reviewing the individual examples. **Ticket descriptions and metadata below are drafts for review, not approved Linear writes. No Linear issues have been created.** D1–D5 are local review identifiers, not reserved Linear IDs.

This replaces the earlier nine-ticket proposal. Every finding is retained, including the two contract discrepancies attached to the upload investigation.

## Drafts and proposed metadata

All five: **Front Line LTD (FRO) · Backlog · Story · Bug · Pending_Review**. No project, milestone, assignee, parent, cycle, due date or estimate proposed. Related links only; no blocking dependencies. Priority and Area are proposals. Bug is an ungrouped label; each draft has exactly one Type and one Area.

| Draft / title | Priority | Area / entity labels | Related issues | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Shipment forms — preserve unfinished work during updates and tab changes](01-shipment-draft-preservation.md) | High | Frontend, Shipment | FRO-316, FRO-341 | QA-OS-01, QA-OS-07, QA-OS-08 |
| [D2 — Order colli forms — prevent stock-entry crashes and reject invalid measurements](02-order-colli-entry.md) | Medium | Frontend, Order | FRO-326, FRO-335, FRO-336 | QA-OS-09, QA-OS-11 |
| [D3 — Order & Shipment — prevent stale overwrites and duplicate comment retries](03-safe-saves-and-retries.md) | High | Frontend, Order, Shipment | FRO-316, FRO-325, FRO-326, FRO-344, FRO-345, FRO-346 | QA-OS-05, QA-OS-06, QA-OS-10 |
| [D4 — Shipment packing — preserve omitted net weight and historical journey details](04-packing-data-and-history.md) | Medium | Backend, Shipment, Order | FRO-325, FRO-345 | QA-OS-12, QA-OS-13 |
| [D5 — Order & Shipment creation — diagnose and resolve attachment upload 401](05-creation-upload-401.md) | High | Integration, Order, Shipment | FRO-335, FRO-336, FRO-341, FRO-342 | QA-OS-02, QA-OS-03, QA-OS-04 |

Priority rationale: D1 interrupts creation and loses drafts; D3 risks saved-data overwrite; D5 addresses the reported attachment blocker but has an unconfirmed cause. D2/D4 are Medium pending deployment impact evidence. These are not runtime frequency estimates.

Each linked Markdown file is the **complete proposed Linear description**. Use the literal title and complete label set above/common defaults; do not paste this index or investigation process narrative into the descriptions.

## Consumer trace and ownership

| Area / current defect | Required outcome / proposed owner | Preserved contract |
| --- | --- | --- |
| Origin candidate read remounts creation; Notes replaces sibling drafts; arrival state unmounts on tab change | D1 preserves the current valid draft across these boundaries | Existing cargo eligibility, per-card saves, permissions and lifecycle |
| Stock panel dereferences missing new-colli draft; shared validator accepts API-invalid values | D2 reconciles current collis and validates before submission | Existing numeric types, stock prerequisites and reservation guards |
| Order/packing reviews acquire newer versions; comment retry identity changes on refresh | D3 binds submissions to reviewed snapshots and retains unresolved comment identity | Server version/authorization checks; intentional identical-text comments remain distinct |
| Packing resolution loses omitted net; mutable unit fields change older journey context | D4 preserves omitted data and original event facts | Existing explicit-clear, physical-confirmation and historical-retirement rules |
| Upload staging returns reported 401 with unresolved backend cause | D5 diagnoses and fixes the actual failure, verifies end-to-end association/recovery | Existing identity/context boundaries, optional files and atomic creation |
| FRO-336 upload wording and FRO-335 no-file context mismatch | D5 records explicit contract resolution; owning-description edits separately reviewed | Neither discrepancy is promoted to a proved 401 cause |

D1 and D3 touch Shipment editing/controller code; coordinate implementation without expanding either ticket. D3 and D4 both affect packing verification but protect different rules. No new UI direction, preview or production-source branch is part of this drafting task.

## Evidence and remaining limits

- Production source through authenticated gh: main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, rechecked unchanged for drafting; source access also verified against the current named-branch Shipment controller.
- Full current descriptions re-read for FRO-316/325/326/335/336/341/342/344/345/346. All Done and unchanged from the review baseline. Done does not certify deployed behavior.
- Current Type/Area labels and FRO Backlog status fetched. Story/Frontend/Backend/Integration and all listed entity/workflow labels exist and are not retired.
- Fresh duplicate searches: draft (45), packing (41), retry (34), 401 (0), colli (75), each returned one complete page. No exact open duplicate identified. No issue edits were made.
- [First-pass evidence](../../docs/qa/runs/2026-11-09-order-to-arrival.md); [second-pass evidence](../../docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md); [35-scenario catalogue](../../docs/qa/scenarios/order-to-shipment-arrival.md).
- Prior component/extracted-Java runs remain the evidence; drafting is not a new application test run. The historical journey read still needs database verification; the real upload 401 cause is still unknown. All full browser-flow scenarios remain Not run.
- D5 intentionally exposes the unresolved no-file-context contract choice. Its resolution must not be invented by an implementation agent; draft review may decide it or leave it as an explicit investigation deliverable.

## Review and publication

Review all five descriptions and proposed metadata. Acceptance of the five-group structure does not authorize creating their text in Linear. After text approval, recheck duplicate/metadata/related-issue freshness, create only the approved descriptions and verify saved contents and complete metadata. Keep Backlog/Pending_Review unless a separate instruction changes readiness.

No glossary or architecture decision is introduced by this grouping. Production source and portal remain read-only in this planning project.

## Draft validation receipt

- Five saved descriptions re-read and matched to the prepared text. All 13 finding IDs are assigned exactly once: eleven runtime findings/reports plus two explicit contract clarifications.
- Proposed labels validated against the current catalogue: one Type, one Area, no retired/group labels. Ten related owner issues freshly read; status and descriptions unchanged.
- Nineteen local links in the draft package and changed QA/new-memory material checked; all targets exist. Eight explicitly qualified source paths also checked against the unchanged pinned archive. Existing historical memory content was outside this link check.
- Independent review found no material corrections for the Order forms or safe-save drafts. Applied three backend/upload wording corrections: limit omission preservation to net/notes, allow refusals without backend exceptions, and require success evidence for both creation paths.
- Every acceptance criterion has a numbered read-only deployment check. No application execution or production mutation was performed as part of this documentation-only drafting.
