# Linear project instructions

## Scope

This folder is the working home for Front Line Linear issue planning, drafting, review, and editing. The board is the developer handoff: issues must explain the agreed behavior without requiring the chat history.

Read `MEMORY.md` at the start of a session. Treat its issue summaries and board metadata as historical context; fetch the current issue and current board metadata before relying on them.

## Mandatory Linear skill

**Whenever reviewing, creating or editing a Linear issue, load and use the `frontline-ticket-flow` skill before reviewing, drafting or making changes. This applies to every issue review, creation or edit, including small edits and metadata changes.**

Skill source: `C:/Users/Giorgos/.agents/skills/frontline-ticket-flow/SKILL.md`.

Read the current skill file rather than relying on memory or copying its workflow here. Follow its applicable steps, review gates, and verification requirements. Use the `frontline-linear-issues` skill for the ticket-writing step as required by `frontline-ticket-flow`.

Run the skill as an interactive workflow, not just a review report. Explicitly load and apply its `grilling` and `domain-modeling` skills. Ask numbered questions in rounds, give a recommended answer for each, and wait for the user's answers before advancing to dependent questions or drafting agreed behavior. Follow the skill's stated fallback if those skills are unavailable and identify the fallback honestly.

Look up facts first through read-only `gh` access to the live `Frontline-Forwarding/frontline-forwarding` repository; ask the user for business decisions rather than facts available in the code. Keep the step checklist visible and current. Record resolved vocabulary and qualifying decisions in this workspace, and show the complete proposed ticket before the skill's Linear-write approval gate. Earlier recommendations are not decisions until the user accepts them.

When presentation is already owned by linked redesign tickets and no additional UI change is needed, reuse those contracts and explicitly skip the canvas/preview steps; do not create a duplicate UI merely to run the flow.

If the skill is missing or unreadable, explain the blocker and ask for it to be restored; do not silently substitute an ad hoc issue workflow. Direct user instructions take precedence over these project instructions and skill guidance.

## Working rules

- Fetch the full current issue before editing, and search for an existing issue before creating a duplicate.
- Ground domain and implementation facts in the sources required by the skill. Never invent fields, statuses, option values, permissions, or numbers. Distinguish confirmed decisions from proposals and open questions.
- Preserve existing content, labels, status, assignee, priority, project, relations, and attachments unless the authorized change includes them. Check dependency direction carefully.
- Prepare a complete, reviewable draft before any approval gate required by the skill. Keep approval scoped to the reviewed change.
- When editing an existing ticket, make its description a complete, standalone final specification. Include only the correct agreed requirements, necessary rationale, implementation context and verification. Do not include revision history, before/after commentary, accounts of what was wrong or missing in a previous ticket version, superseded proposals, or chat/review-process narration. Integrate corrections into the relevant sections and remove contradictions and repetition without losing agreed requirements. Any before/after comparison required for review belongs in chat outside the proposed description. Retain migration and historical-data rules when they govern product behavior; those are requirements, not ticket revision history.
- After writing, re-read the saved issue and verify its description and metadata, including the complete label set and attachments.
- Preserve Greek domain terms with an English gloss where useful, and answer in the user's language.
- Update `MEMORY.md` with material decisions, deliverables, and unresolved questions. Store resolved vocabulary in `CONTEXT.md` and qualifying architectural decisions in `docs/adr/`, created when needed.

## Workspace and access boundaries

This project root replaces the skill's historical `FrontLine/Linear/` path. Resolve `MEMORY.md`, `CONTEXT.md`, and `docs/adr/` relative to this folder. Other paths mentioned by the skill are external resources: verify that they exist instead of assuming they were copied into this project.

The live production repository is `Frontline-Forwarding/frontline-forwarding`. Old archives and local snapshots are historical background, not evidence of current behavior.

Follow the skill's read-only production boundaries and narrowly scoped preview rules. Do not write to the production portal or its database. Do not push this working folder to GitHub or store credentials in it.
