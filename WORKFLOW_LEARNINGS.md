# Workflow learnings

Reusable lessons from Front Line ticket planning, review and handoff.

## Use this file

Search for lessons relevant to the current task and read the matching
entries before ticket work.

Lessons describe process improvements. They are not evidence of current
product behavior, approved ticket scope or access permissions.
AGENTS.md remains the authoritative workflow.

## Maintain this file

- Add a lesson only after an observed problem, a verified improvement
  or an explicit user correction. Keep proposals in chat until approved.
- Record the date, problem, supporting evidence and concrete action for
  next time. Reference a local record or issue when useful.
- Update an existing lesson when the same problem recurs. Add new
  evidence rather than duplicating the instruction.
- Keep issue decisions and pending work in MEMORY.md, vocabulary in
  CONTEXT.md and qualifying architectural decisions in docs/adr/.
- Keep entries concise. Exclude transcripts, credentials and customer data.
- When a lesson becomes an approved permanent rule, update its
  authoritative workflow section and mark the lesson as incorporated,
  linking to that section. Preserve the evidence without maintaining
  a second copy of the rule.
- Mark superseded lessons explicitly and identify their replacement.
- Add nothing when a task produces no reusable lesson.

## Entry format

```markdown
### YYYY-MM-DD — Specific lesson title

- Problem or improvement:
- Evidence:
- Action next time:
- Status: Active / Incorporated into [workflow section](AGENTS.md#anchor) /
  Superseded by [replacement](#anchor)
```

## Lessons

### 2026-10-21 — Description changes can add Linear relations automatically

- Problem: Several description saves added relations from issue mentions.
  FRO-307 relation removal then failed automatic approval review under
  description-only authorization.
- Evidence: [FRO-307 saved-description and relation-cleanup record](MEMORY.md#2026-10-21--fro-307-approved-description-saved-relation-cleanup-blocked).
- Action next time: Compare saved relations with the approved set. Report
  unexpected additions and resolve cleanup authorization before attempting
  another write.
- Status: Active.

### 2026-10-21 — A linked redesign may arrive too late for the feature

- Problem: FRO-303 targeted an earlier milestone than its referenced
  redesign; the existing editor was unavailable in the stages needing
  correction.
- Evidence: [FRO-303 renewed review](MEMORY.md#2026-10-21--fro-303-renewed-independent-review-clarification-round-pending).
- Action next time: Check release timing and current entry-point
  availability before relying on another ticket's UI. Identify how the
  feature becomes usable in its intended release.
- Status: Active.

### 2026-10-21 — Confirm the data population before specifying migration

- Problem or improvement: FRO-356, FRO-329 and field-retirement reviews
  established mock-only cleanup while excluding deletion of real legacy data.
- Evidence: [FRO-356 rollout decision](MEMORY.md#2026-10-21--fro-356-first-round-decisions-accepted),
  [FRO-329 cleanup decision](MEMORY.md#2026-10-21--fro-329-first-round-decisions-accepted)
  and [FRO-295 field-retirement decisions](MEMORY.md#2026-10-21--fro-295-decisions-settled-full-draft-awaiting-approval).
- Action next time: Establish whether affected records are fixtures,
  operational data or future imports. Scope cleanup and historical
  preservation to the confirmed population.
- Status: Active.

### 2026-10-21 — Business examples do not define the complete eligibility rule

- Problem: The Greek-warehouse-to-airport example in FRO-303 could have
  led to an incorrect export-only restriction. Further clarification
  established the actual origin-based boundary.
- Evidence: [FRO-303 eligibility clarification](MEMORY.md#2026-10-21--fro-303-round-2-draft-handling-accepted-delivery-note-eligibility-corrected)
  and [accepted origin boundary](MEMORY.md#2026-10-21--fro-303-delivery-note-origin-boundary-accepted).
- Action next time: Separate examples from eligibility conditions. Ask
  about boundary cases before translating examples into restrictions.
- Status: Active.

### 2026-10-21 — Current values may not establish historical facts

- Problem: FRO-297 required dispatch-time DG classification. Current
  flags could not prove historical counts; the user selected Unavailable
  for older dispatched shipments.
- Evidence: [FRO-297 historical-data decision](MEMORY.md#2026-10-21--fro-297-historical-data-decision-and-draft).
- Action next time: Establish the required point in time and available
  evidence. Ask how missing historical information should behave; do not
  assume zero or reconstruct it from current values.
- Status: Active.

### 2026-10-21 — Removing a control does not retire its data contract

- Problem: Per-colli Notes remained in persistence, payloads, API reads
  and copying. PCS also had defaults, printing and Shipment aggregates;
  a linked creation ticket still required it.
- Evidence: [FRO-294 contract-retirement review](MEMORY.md#2026-10-21--fro-294-decisions-settled-complete-draft-pending-approval)
  and [FRO-295 Shipment UI ownership clarification](MEMORY.md#2026-10-21--fro-295-shipment-ui-ownership-clarification).
- Action next time: Apply the authoritative consumer-tracing procedure
  linked below.
- Status: Incorporated into [step 3: consumer tracing](AGENTS.md#trace-the-affected-business-rule).

### 2026-10-21 — The final ticket describes agreed behavior, not the editing history

- Problem: The user corrected FRO-297's draft to remove prior-version
  commentary and repetition while retaining decisions, migration
  requirements and verification.
- Evidence: [Final-specification correction](MEMORY.md#2026-10-21--final-specification-rule-for-existing-tickets).
- Action next time: Apply the standalone-final-specification rule in
  the authoritative section linked below.
- Status: Incorporated into [Working rules](AGENTS.md#working-rules).

### 2026-10-21 — A review report does not replace the interactive interview

- Problem: The user corrected the process: numbered questions,
  recommendations and answers were required before treating proposals
  as decisions.
- Evidence: [Interactive ticket-flow correction](MEMORY.md#2026-10-21--interactive-ticket-flow-correction).
- Action next time: Follow the authoritative interactive workflow
  and interview step linked below.
- Status: Incorporated into [Mandatory Linear workflow](AGENTS.md#mandatory-linear-workflow)
  and [step 1: Grill the request](AGENTS.md#1-grill-the-request).
