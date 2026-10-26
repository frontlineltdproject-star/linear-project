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
  FRO-300 (2026-10-26): mentions added related FRO-297/FRO-341, and adding
  blockedBy FRO-299 replaced the existing related FRO-299 link, because
  Linear keeps one relation per issue pair
  ([FRO-300 record](MEMORY.md#2026-10-26--fro-300-reviewed-rewritten-and-verified)).
- Action next time: Compare saved relations with the approved set. Report
  unexpected additions and resolve cleanup authorization before attempting
  another write. Include cleanup of automatic additions in the write
  approval request. When a draft keeps a related link and also adds a
  blocking link to the same issue, tell the user only the blocking link
  will remain.
  FRO-316/FRO-325 (2026-10-26): a description patch re-adds every mention
  as a related link again, and Linear's re-save can drop bold markers
  next to a mention. Re-check relations after every description save,
  including small patches.
  FRO-317 (2026-10-26): mentions added related FRO-303/FRO-347/FRO-356;
  removing them was included in the write approval and succeeded.
  FRO-317 EAD patch (2026-10-26): a five-edit patch re-added FRO-303/356/347
  and turned two FRO-321 issue chips into plain Markdown links. Expect
  mention rendering changes anywhere in the description, not only near
  the edited lines.
- Status: Active.

### 2026-10-26 — Parallel sessions share one planning checkout

- Problem: The FRO-299 and FRO-300 sessions ran at the same time in the
  same folder and their decisions overlapped. The FRO-299 commit included
  files the FRO-300 session had staged. Both sessions had drafted the same
  read-contract ownership.
- Evidence: commit `ce2cff9`;
  [FRO-300 record](MEMORY.md#2026-10-26--fro-300-reviewed-rewritten-and-verified).
- Action next time: At the start and before each decision round, check
  `git status`/`git log` and other active sessions for linked tickets.
  Coordinate overlapping ownership before asking the user to decide.
  Commit with explicit paths, and check what is already staged first.
  FRO-316 (2026-10-26): the FRO-341 session changed FRO-316's relations
  between the review read and the write. Re-read the target right before
  saving and compare updatedAt, description and relations with the baseline.
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

### 2026-10-26 — A preview link must open for the people who build from it

- Problem: FRO-341's only UI reference was a chatgpt.site preview that returns 401 behind a ChatGPT sign-in, so the developer and co-author could not open it.
- Evidence: [FRO-341 review](MEMORY.md#2026-10-26--fro-341-review-started-round-1-pending).
- Action next time: Open every preview link signed out before relying on it. When it is not publicly reachable, make the description and component map the contract and label the link as historical.
- Status: Active.

### 2026-10-26 — "Done" in Linear does not mean the code is on main

- Problem: FRO-339 was Done, but its geography contract existed only on `release/0.0.2`; `main` had no shipment country/city.
- Evidence: [FRO-341 review](MEMORY.md#2026-10-26--fro-341-review-started-round-1-pending).
- Action next time: For each dependency marked Done, check `main` and the release branches with `gh api .../compare` and cite the branch and commit that carry the contract.
- Status: Active.

### 2026-10-26 — A display requirement moved to a new screen may lose its data source

- Problem: FRO-299 asked to show colli measurements in the wizard, which received them from the creation candidate read. Its replacement screen (FRO-316 Shipment Details) reads `ShipmentContent`, which has no measurements; FRO-300 had the same unowned gap.
- Evidence: [FRO-299 review](MEMORY.md#2026-10-26--fro-299-reviewed-rewritten-and-verified).
- Action next time: When a UI requirement moves to a redesigned screen, check that screen's actual read contract for every displayed value and assign an owner for missing fields.
- Status: Active.

### 2026-10-26 — Build the UI branch from main even when its backend sits on a release branch

- Problem: FRO-341's first mock branch was based on `release/0.0.2` because FRO-339's geography existed only there. Compared with `main`, the branch then showed FRO-329/FRO-339 backend files, although the user wanted UI-only branches. The deviation from step 4e was not raised before the push.
- Evidence: [FRO-341 revision 2 mock branch](MEMORY.md#2026-10-26--fro-341-revision-2-mock-branch-published-from-main).
- Action next time: Base every mock branch on `main`. When a contract is missing there, build unmounted components on UI view models and record the dependency in the folder README's activation boundary, as FRO-316/335/341 do. Ask the user before implementing on any other base. Before the push gate, run `gh api .../compare/main...<branch>` and show the file list.
- Status: Active; reinforces [step 4e](AGENTS.md#4e-verified-frontendui-mock-branch--ask-before-creating-it).

### 2026-10-26 — Check the status of every ticket a spec depends on

- Problem: FRO-317 still named FRO-241 as its dependency for invoice types and statuses, but FRO-241 was Canceled and FRO-321 had replaced it with different rules (Not required instead of Exempted, Supplier taken from the Order).
- Evidence: [FRO-317 review](MEMORY.md#2026-10-26--fro-317-workflow-review-started-round-1-pending).
- Action next time: At the start of a review, fetch the status of every ticket the spec cites as a dependency or owner. For a Canceled or superseded one, find its replacement and compare the rules before asking questions.
- Status: Active.

### 2026-10-26 — Linear turns bare domain names into links

- Problem: In FRO-350, the plain text "chatgpt.site" was saved as a link to http://chatgpt.site, which points readers to an unrelated site.
- Evidence: [FRO-350 saved rewrite](MEMORY.md#2026-10-26--fro-350-approved-rewrite-saved-fro-317-ead-patch-drafted).
- Action next time: Before showing a draft for approval, replace bare domain names with plain words (for example "the ChatGPT-hosted preview") or a full URL in backticks.
  FRO-352 (2026-10-26): the shorthand "FRO-347/350" became a FRO-347 chip followed by plain "/350". Write every issue ID in full.
- Status: Active.

### 2026-10-26 — Stopping a dev-server task can leave Vite running on Windows

- Problem: After stopping the FRO-350 review server task, the Vite process kept running and its route watcher kept rewriting `src/routeTree.gen.ts`, so restoring the file did not stick and the first diff included a 508-line unrelated change.
- Evidence: [FRO-350 frontend record](MEMORY.md#2026-10-26--fro-350-frontend-prepared-and-verified-push-gate-pending).
- Action next time: After stopping a dev server, confirm the port is free (`Get-NetTCPConnection -LocalPort <port>`), then restore generated files and re-run `git status` before producing the audited diff.
- Status: Active.

### 2026-10-26 — Linear connector reads can be stale right after a write

- Problem: After a FRO-350 patch, the save response and several reads showed the previous version, so a retry applied the same insertion twice and duplicated a paragraph. Reads alternated between old and new `updatedAt` values.
- Evidence: [FRO-350 branch link record](MEMORY.md#2026-10-26--fro-350-branch-link-saved).
- Action next time: Never retry a description patch because a response looks unchanged. Re-read until `updatedAt` is newer than the baseline, and trust only the read with the newest `updatedAt`. Make retry patches idempotent (anchor on text that disappears once the edit applies).
- Status: Active.
