# Linear project instructions

## Scope

This folder is the working home for Front Line Linear issue planning, drafting, review, and editing. The board is the developer handoff: issues must explain the agreed behavior without requiring the chat history.

Read `MEMORY.md` at the start of a session. Treat its issue summaries and board metadata as historical context; fetch the current issue and current board metadata before relying on them.

## Mandatory GitHub synchronization

- Before any work related to a Linear issue or ticket, including reviewing, planning, drafting, creating or modifying one, **MUST run `git pull --ff-only` in this planning repository** to retrieve potential GitHub updates. Read the updated project instructions and context before proceeding. If the pull fails or requires conflict resolution, resolve it before continuing ticket work; do not discard local changes.
- After completing any ticket creation or modification, or any other file changes in this repository, **MUST commit the task's repository changes and run `git push`** to its configured upstream. This includes updates to `AGENTS.md`, `MEMORY.md`, `CONTEXT.md`, drafts and decision records. Record completed ticket work in `MEMORY.md` before committing. Verify that the push succeeded before reporting synchronization complete; if blocked, report the blocker explicitly. Preserve unrelated local changes and never force-push.
- These pull and push requirements apply to this planning repository. Production repository access remains read-only.

## Mandatory Linear workflow

**Whenever discussing a production-portal feature, change or bug, or reviewing, creating or editing a Linear issue, follow the complete embedded Front Line ticket workflow below. This applies to every issue review, creation or edit, including small edits and metadata changes. The workflow itself is mandatory; loading or invoking the external frontline-ticket-flow skill is not required.**

The full source content is embedded below, including its original metadata and reference examples. This file is the authoritative workflow for this project; it does not depend on the external skill file being present or readable. References within the embedded text to "this skill" mean this embedded workflow. Continue to load and apply the supporting skills it requires: grilling, domain-modeling, and frontline-linear-issues for ticket writing, with the stated fallback when applicable.

Run the workflow interactively, not just as a review report. Earlier recommendations are not decisions until the user accepts them. When presentation is already owned by linked redesign tickets and no additional UI change is needed, reuse those contracts and explicitly skip the canvas/preview steps; do not create a duplicate UI merely to run the flow.

**Project-specific rules take precedence over historical instructions in the embedded source:**

- Resolve every historical FrontLine/Linear/ path relative to this project root, including MEMORY.md, CONTEXT.md, docs/adr/ and board references. Verify other external paths before using them.
- Synchronize this planning repository under the GitHub synchronization rules above. The embedded warning against pushing the parent FrontLine folder does not prohibit pushing this dedicated planning repository.
- Production repository access remains read-only in this project. The embedded step 4e is retained in full for reference, but does not grant permission to modify or publish production-repository branches. A separate explicit user instruction must authorize that scope before step 4e can apply; its own preparation, verification and approval gates still apply.
- Keep all before/after comparisons in chat, outside the proposed final ticket description, as required by the working rules below.
- If an embedded instruction names a tool unavailable in this environment (such as AskUserQuestion or the Skill tool), use the available equivalent or ask in chat and wait for the required answer. Preserve every approval gate.
- Direct user instructions take precedence over this file and the embedded workflow.

## Working rules

- Fetch the full current issue before editing, and search for an existing issue before creating a duplicate.
- Ground domain and implementation facts in the sources required by the embedded workflow. Never invent fields, statuses, option values, permissions, or numbers. Distinguish confirmed decisions from proposals and open questions.
- Preserve existing content, labels, status, assignee, priority, project, relations, and attachments unless the authorized change includes them. Check dependency direction carefully.
- Prepare a complete, reviewable draft before any approval gate required by the embedded workflow. Keep approval scoped to the reviewed change.
- When editing an existing ticket, make its description a complete, standalone final specification. Include only the correct agreed requirements, necessary rationale, implementation context and verification. Do not include revision history, before/after commentary, accounts of what was wrong or missing in a previous ticket version, superseded proposals, or chat/review-process narration. Integrate corrections into the relevant sections and remove contradictions and repetition without losing agreed requirements. Any before/after comparison required for review belongs in chat outside the proposed description. Retain migration and historical-data rules when they govern product behavior; those are requirements, not ticket revision history.
- After writing, re-read the saved issue and verify its description and metadata, including the complete label set and attachments.
- Preserve Greek domain terms with an English gloss where useful, and answer in the user's language.
- Update `MEMORY.md` with material decisions, deliverables, and unresolved questions. Store resolved vocabulary in `CONTEXT.md` and qualifying architectural decisions in `docs/adr/`, created when needed.

## Workspace and access boundaries

This project root replaces the embedded workflow's historical `FrontLine/Linear/` path. Resolve `MEMORY.md`, `CONTEXT.md`, and `docs/adr/` relative to this folder. Other paths mentioned by the embedded workflow are external resources: verify that they exist instead of assuming they were copied into this project.

The live production repository is `Frontline-Forwarding/frontline-forwarding`. Old archives and local snapshots are historical background, not evidence of current behavior.

Follow this project's read-only production boundaries and the embedded workflow's narrowly scoped preview rules. Do not write to the production portal or its database. Synchronize this planning repository with GitHub as required above; never store credentials in it.

## Embedded Front Line ticket workflow — full source content

---
name: frontline-ticket-flow
description: Use when discussing a new feature, a change, or a bug for the Front Line production portal, or when creating/updating a Linear ticket for it (team FRO) — runs the design-first flow end to end: grill the request, ground every fact in the Frontline-Forwarding/frontline-forwarding repo, optional design canvas, shareable Cloudflare Pages preview, draft-first ticket in house style, verified frontend/UI branch handoff, post-deployment verification.
---

# Front Line — ticket flow (design-first)

Use this flow whenever the user wants to **discuss a feature** or **create / update a Linear ticket** for the production portal.

This skill decides **what goes in the ticket**. The `frontline-linear-issues` skill decides **how it reads** — invoke it for the writing step, never write the ticket text without it.

**This flow produces an approved ticket, a verified design preview when applicable, and a verified frontend/UI branch in `Frontline-Forwarding/frontline-forwarding` (step 4e).** Prepare and verify the frontend/UI changes first, then ask for explicit approval to create, commit and push the proposed branch; wait for a clear yes before any of those actions. Production, the portal database and backend code remain read-only. Publish only the throwaway Cloudflare Pages preview and the frontend/UI branch; merging and production deployment require a separate user instruction.

## How to run it

**Announce the flow and work the steps in order.** Open a todo list with one item per step (0 Preflight · 1 Grill · 2 Canvas · 2b Preview · 3 Spec check · 4 Ticket · 4e UI branch · 5 Memory · 6 Verify), mark each one as you go, and tell the user which step you are on. Skip a step only when its own rule says it does not apply (steps 2, 2b and 4e on a feature with no UI), and say out loud that you are skipping it and why.

**Three hard gates — the flow stops and waits at each:**

- **After step 1** — the grill is a conversation, not a monologue. Ask a round, wait for the answers, ask the next round.
- **Before step 4 writes anything** — the full ticket is shown in chat first, and nothing reaches Linear until the user says yes.
- **Before step 4e creates the branch** — show the proposed branch name, repository, complete frontend/UI diff and verification results; ask for approval to create, commit and push it, then wait for a clear yes.

## 0. Preflight — stop when an access is missing

Verify each access with a real operation, not with an assumption.

| Access | Verify with | Needed for |
| --- | --- | --- |
| Production code | `gh api repos/Frontline-Forwarding/frontline-forwarding/contents --jq '.[].name'` | every step — this is the source of truth |
| GitHub auth | `gh auth status` (expect account `frontlineltdproject-star`) | the above |
| GitHub branch access | `gh api repos/Frontline-Forwarding/frontline-forwarding --jq '{permissions: .permissions, default_branch: .default_branch}'`; confirm `permissions.push` is true, and check applicable branch rules before publishing | step 4e (UI features only); a read alone does not prove write access |
| Linear | one read call through the Linear MCP (`get_issue`) | steps 4–6 |
| Grilling | the `mattpocock-skills` plugin is installed — `grilling` **and** `domain-modeling` both answer | step 1 |
| Production UI | Read the live client `DESIGN.md`, `src/styles/theme.css`, touched screen/form, and its `src/components/ui/` components via `gh api` | step 2 (UI features only) |
| Canvas | nothing to install — step 2 writes the page by hand from the design tokens. `canvas-design` is for posters/PDFs and does **not** apply | step 2 (UI features only) |
| Cloudflare | `npx wrangler whoami` — expect the Front Line account and a **Pages-only** token | step 2b (UI features only) |

⚠️ **When one access is missing, stop and name it.** Do not run a partial flow.

**Repository access method is `gh`, never the GitHub connector.** The connector's GitHub App installation is scoped to repositories owned by `frontlineltdproject-star` and cannot read the collaborator-owned private repository. Use the locally authenticated GitHub CLI (`gh auth status`, then `gh api` or `gh repo view`) for every read from `Frontline-Forwarding/frontline-forwarding`. The CLI account now has branch write access to that repository (user update, 2026-10-21); verify it in preflight. Use `gh` and authenticated Git for the isolated implementation and branch push in step 4e.

- **Linear MCP needs OAuth** and cannot be authorised from a non-interactive session. If the read call fails, say so and ask the user to connect it (`/mcp` in an interactive terminal, or their Codex.ai connector settings), then continue offline: the draft still gets written in chat.
- **There is no Sentry MCP on this machine.** When a ticket comes from a Sentry issue, ask the user to paste the issue (title, culprit, stack frame, event count). The Sentry↔Linear integration is connected for filing, not for reading from here.
- **Never ground facts in `FrontLine/Production Portal Files/frontline-forwarding-main.zip`** — it is a stale snapshot. GitHub is the live copy.

## 1. Grill the request

**Run `grill-with-docs`.** That is the interview this flow is built on — a round of numbered questions, each with a recommended answer, then **wait for the answers**, then the next round.

**How to run it: call the Skill tool twice — `mattpocock-skills:grilling` (the interview) and `mattpocock-skills:domain-modeling` (the writing).** That is not a substitute; it is the whole of `grill-with-docs`, whose `SKILL.md` is one line saying exactly that. The wrapper itself carries `disable-model-invocation: true`, so **only the user can start it** by typing `/grill-with-docs` — an agent that tries to invoke it gets nothing. When the user does type it, let it run and pick the flow up afterwards.

Confirm both halves actually took effect. The two documented failures:

- *Questions arrive all at once, unnumbered, with no recommendations* → `grilling` did not load. Invoke it explicitly and restart the round.
- *Good interview, but no files written* → `domain-modeling` did not load, **or** the file-writing half silently skipped because this flow is an orchestration layer around it (a known, unfixed bug). Write the files yourself — see the verify rule below.

**The paper trail lives in `FrontLine/Linear/`.** Keep glossary and decision records here even when step 4e uses an isolated repository checkout; point `domain-modeling` at this folder:

| What resolved | Where it lands |
| --- | --- |
| A term — the company's own word for a thing | `FrontLine/Linear/CONTEXT.md`, inline, the moment it resolves |
| A decision that is hard to reverse, surprising without context, **and** a real trade-off | `FrontLine/Linear/docs/adr/` |
| Everything else decided | the conversation, and the ticket's **Decisions** section — nowhere else |

⚠️ **Verify the files afterwards.** Because this flow is an orchestration layer around the grilling skills, the file-writing half can silently skip. If `CONTEXT.md` did not change during the interview, or an ADR was earned and never appeared, write them yourself before moving on.

⚠️ **Do not clear the session between step 1 and step 4.** Most of what gets decided lives only in the conversation — the glossary is vocabulary, and most decisions never earn an ADR. The Linear ticket is this flow's spec, and it is written from the live conversation.

The **purchase order ≙ Order ≙ stock list item** mapping below is exactly what `CONTEXT.md` is for — put it there once and stop re-deriving it.

When the plugin is not installed, fall back to `superpowers:brainstorming`, keep the Decisions record by hand, and **say that the grill was a fallback** — do not claim a grilling session that did not happen. Install with:

```
Codex plugin marketplace add mattpocock/skills
Codex plugins install mattpocock-skills@mattpocock
```

Two standing rules on top of the interview:

1. **Look up each fact first. Ask only for the decisions.** Reading the repo is cheap; a wrong assumption gets built as-is.
2. **Record each decision and its reason.** That record becomes the ticket's **Decisions** section.

**Where to look — `Frontline-Forwarding/frontline-forwarding`:**

| Question | File |
| --- | --- |
| Does the field exist? type, nullable, default, FK? | `docs/reference/database.md` (generated from Flyway migrations) |
| API contract | `docs/reference/graphql-api.md` · `rest-api.md` · `openapi.yaml` |
| What actions exist, who may call them, what gets audited | `docs/reference/mcp-tools.md` · `docs/architecture/authorization.md` |
| Business lifecycle and states | `docs/workflows/purchase-order-colli-journey.md` · `shipment-lifecycle.md` · `delivery-note.md` · `attachments.md` |
| Real sample values, option lists | `docs/reference/demo-data.md` |
| How the screen is built today | `frontline-forwarding-client/src/…` · `frontline-forwarding-client/DESIGN.md` |
| House conventions of each app | root `AGENTS.md`, `frontline-forwarding-app/AGENTS.md`, `frontline-forwarding-client/AGENTS.md` |

Read a file with:

```bash
gh api repos/Frontline-Forwarding/frontline-forwarding/contents/docs/reference/database.md --jq '.content' | base64 -d
```

**Vocabulary gap — always resolve it.** The repo calls the stock-list item a **purchase order** (`purchase_order`); the board (FRO-238) calls it an **Order**, and the office calls it a stock list item. Same for colli / handling unit. State the mapping in the ticket so the dev and the board mean the same thing.

**Never invent** a dropdown option, an enum value, a status, or a field's meaning. Repo first; if it isn't there, **ask the user** — a question always beats a plausible fabrication.

**Numbers.** There is no live production database access from here. Every number in a ticket either cites its source file in the repo, or is a number the user supplied. Never estimate one.

## 2. Design canvas — only when the feature has a UI

- **Before writing the first design file, map every element of each direction to the live component catalogue and Screen Parts, with component names and source paths.** Confirm the mapping for the picked direction before implementation in step 4e. Static HTML previews mirror those components and tokens; the app implementation uses the real components.
- **Write the canvas yourself, as one HTML file.** There is no `design` skill on this machine — `canvas-design` makes posters, not screens — so build it from the tokens below. It is the same file step 2b deploys. **Recreate the touched screen from `frontline-forwarding-client/src`** with real values — never from memory.
- **Always source the UI from the live `Frontline-Forwarding/frontline-forwarding` repository through the authenticated GitHub CLI (`gh`), including when the user has collaborator/invited access rather than repository ownership.** Read `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css`, the touched screen/form, and its imported `src/components/ui/` components before drawing. Copy the actual tokens, typography, spacing, control styles, and layout from those files. The theme and components are authoritative when documentation differs. Do not use `FrontLine/Portal Code/Portal Design System.md`, the stale ZIP, memory, or the GitHub connector as the UI source. If `gh` access fails, stop and report the missing access instead of substituting an older design.
- Put **2 or 3 directions** beside the current screen. Each direction gets a note with its trade-off. At least one may try a fresh element, inside the current style.
- **Mark every element that is not an existing portal component** with a `New component` label — on the element, on the artboard, and in the direction's note with the reason for each one. The user must see at a glance which parts are new.
- **Bilingual check.** Every label exists in EN and EL; Greek strings run longer, so nothing may have a rigid height that clips them.
- The user edits and picks on the canvas. When they save an edit, read the artifact back, tell them what changed, and carry the change into the ticket.
- Tell the user plainly: **the canvas shows the look only. It is not the contract — the ticket description is.**
- Export the picked direction's screenshots for the ticket, and hand the picked direction to **step 2b**.

## 2b. Preview on Cloudflare Pages — the URL is what you send

The canvas lives in this chat; Grigoris and the dev do not. A Pages deploy turns the picked direction into **one link** that goes into the ticket, into Teams, into an email — and that opens on a phone.

**What gets deployed:** one self-contained `index.html` — the picked direction, exported to `<scratchpad>/preview/`. Inline the CSS. No build step, no React, no backend. This is a **static prototype**, not a running app: controls toggle states, nothing saves.

**It must carry all of this, or it is not worth the deploy:**

- **every state** — default, loading, empty, error — reachable from the URL (`?state=loading`) *and* from a visible switcher, so the reviewer cannot miss one;
- a **business-notes layer**: numbered markers on each element that carries a rule, and a panel that says in plain words what it means for the office and which rule sits behind it — taken straight from the step-1 decisions;
- the **`New component`** markers from step 2, still visible;
- the **EN / EL toggle**, so Greek label length is judged on the real strings;
- desktop **and** ~400px both usable.

⚠️ **Fixture data only.** Sample values come from `docs/reference/demo-data.md` or are invented outright. **Never** put a real client name, vessel name, price, MRN or reference on that page — a `pages.dev` URL is public to anyone who has it, and the link travels by email.

### Deploy

The Cloudflare MCP on this machine has **no Pages tool and no deploy tool** — it covers D1, KV, R2, Hyperdrive and *reading* Workers. Use `wrangler` (not installed globally; `npx` fetches it).

```bash
SUFFIX=$(openssl rand -hex 3)
NAME="fro-<ticket-id>-$SUFFIX"
npx wrangler pages project list
npx wrangler pages project create "$NAME" --production-branch=main
npx wrangler pages deploy "<scratchpad>/preview" --project-name="$NAME"
```

The link is `https://<NAME>.pages.dev` — for example `fro-251-a3f9b1.pages.dev`. The random suffix is the point: the name carries the ticket id so it is findable, and the suffix makes it unguessable.

**Check it before you hand it over.** Open the URL, read the console and the network log — the pass condition is **zero errors and zero failed requests** — open every state, and compare the default state with the direction the user picked. Do not say the preview is ready before all of that passes.

Iterate by re-running `pages deploy` on the same project. Each deploy also gets a `<hash>.<NAME>.pages.dev` URL; **send the project URL, not the per-deploy one**, so the link keeps working as you iterate.

### ⚠️ Cloudflare rules — this account runs the live company

Standing instruction from the user (2026-09-11): **change nothing that already exists in Cloudflare.** What is in the account today:

| Object | What it is |
| --- | --- |
| Worker `frontline-website` | the live marketing site — apex + www of `frontline-ltd.com` are its custom domains |
| Worker `frontline-portal-api` | the old portal's API |
| Workers `front-line-helper-proxy`, `-proxy-v2`, `-categorizer` | Helper proxy + the email auto-categorization worker |
| D1 `frontline-portal` | the old portal's database |
| KV `CATEG_KV` | the categorizer's store |
| R2 | not enabled on the account |
| Pages `front-line-helper` · `front-line-helper-outlook` · `frontline-portal` | **the only objects a Pages-scoped token can write to** — `frontline-portal` is git-connected and redeploys itself |

**This flow touches exactly one kind of object: a Pages project named `fro-<ticket-id>-<hex6>` that it created itself.** Everything else is read-only, and `wrangler pages project list` is the only inventory command it runs.

| Never | Why |
| --- | --- |
| `npx wrangler deploy` | that is **Workers** — it would overwrite one of the five above |
| any DNS, custom-domain, route or Zero Trust command | apex/www are Worker custom domains and the `cp` / `mail` / MX records are live company mail |
| `pages deploy` or `pages project delete` against `front-line-helper`, `front-line-helper-outlook` or `frontline-portal` | these three exist today and the token **can** overwrite them — match the name against `pages project list` before every deploy |
| any `delete` on a name that is not `fro-<ticket-id>-<hex6>` | |
| the MCP's `d1_database_delete`, `kv_namespace_delete`, `r2_bucket_delete`, or `d1_database_query` with a write statement | the old portal's data lives there |
| adding a binding, env var, secret or D1/KV/R2 attachment to anything existing | |

**Use a scoped token, not the account login.** `npx wrangler login` hands the session the whole account. A token limited to **Cloudflare Pages: Edit** cannot reach Workers, DNS, D1, KV or R2 even if something goes wrong — that is the real guardrail, not a promise in a file:

> Cloudflare dashboard → My Profile → API Tokens → Create Token → **Custom token** → Permissions: *Account · Cloudflare Pages · Edit* — and nothing else. Then set `CLOUDFLARE_API_TOKEN` in the environment (plus `CLOUDFLARE_ACCOUNT_ID` if the token sees more than one account) before the deploy.

Keep the token out of the repo and out of `FrontLine/` — that folder already holds plaintext key files and must never be pushed.

**Cleanup.** Record the project name in the ticket. When the feature ships, delete it — `npx wrangler pages project delete "$NAME"` — that project only, and only when the user says so.

## 3. Spec check after the design

A design round changes rules, not only pixels. A new control, a removed column, a new mode — each changes what the backend must compute. Before drafting the ticket, compare the design with the spec line by line.

1. List each design decision of the round: new control, new mode, removed element, changed rule, changed number.
2. For each one, find the sentence of the spec it changes: definitions, checks, constants, response shape, empty states, acceptance criteria.
3. **Write the backend rule for each decision that has none** — the exact computation, the data source with its table and columns from `database.md`, the scope (per order, per colli, per shipment, per company), and the edge case that makes the rule fail. An engineer must not have to guess a rule from a screenshot.
4. Re-check each number against its source.
5. Put the changes into the draft as **πριν / μετά** pairs (old text → new text) when you are editing an existing ticket.

⚠️ The canvas and the preview are the contract for the look. **The ticket description is the contract for the computation.** A design change that reaches the preview but not the description is a hidden spec change, and the dev builds the old rule.

## 4. Linear ticket — show it, then ask

Invoke **`frontline-linear-issues`** and follow it for archetype, voice, tables, typed fields and labels.

### 4a. Build it — what the ticket contains

- the problem and the context;
- **testable** acceptance criteria;
- an out-of-scope list;
- the affected systems (`frontline-forwarding-app` / `frontline-forwarding-client` / which tables / which GraphQL or REST operations);
- the **Decisions** with their reasons (from step 1);
- the canvas link, the screenshots, and the **preview URL with its Pages project name** (`https://fro-<id>-<hex6>.pages.dev`), when there was a design round — the project name is what lets anyone find and delete it later;
- **`## Context for agents`** — each fact with the repo file it came from, and each gotcha the work turned up;
- **`## Post-deployment verification`** — each acceptance criterion rewritten as one concrete **read-only** check an agent can run: a page to open, a value to compare, a read-only GraphQL/REST/MCP call. Never a write call.

**Board workflow:** a fresh draft carries the `Pending_Review` label (status Backlog); it flips to `Ready` (Todo) only when the user approves it for the dev.

### 4b. Show the whole ticket in chat

Print it exactly as it will land in Linear — no summary, no "here's the gist", no ellipsis:

| | |
| --- | --- |
| **Title** | the literal title |
| **Team / status** | FRO · Backlog (or the target status) |
| **Labels** | every label that will be set, including the ones already on the issue |
| **Relations** | `relatedTo` / `blockedBy` being added |
| **Description** | the **complete** Markdown body, in a fenced block so the user reads the raw source |

When editing an existing ticket, show **πριν / μετά** — the old text beside the new — and never silently drop a sentence the user wrote.

### 4c. Ask before writing — the gate

Ask with `AskUserQuestion`, and **wait**. The options:

1. **Write it to Linear** — create the new issue, or update FRO-xxx;
2. **Change something first** — take the edits, redraft, show it again, ask again;
3. **Don't write it** — leave it in chat; the user pastes it himself.

⚠️ **Nothing reaches Linear before a clear yes.** No `save_issue`, no comment, no label change, no status flip. Approval of the draft text is approval for *that* text only — a later edit needs a fresh yes. Approval to create an issue is not approval to flip it to `Ready`, and never rewrite someone else's ticket without being asked.

After the write: report the issue identifier and URL, and **re-read the issue to confirm the labels survived** (see the gotcha below).

### 4d. MCP gotchas (`save_issue`)

- `labels` **replace the whole set** — re-pass every existing label or a description-only edit silently drops them. Verify after saving.
- Relations (`blocks` / `blockedBy` / `relatedTo`) are append-only.
- `description` is Markdown with literal newlines, not escaped `\n`.
- `<linear-embed>` images and files survive a full-description round-trip. Strip `?signature=…` from the href when re-sending — Linear re-signs it.

## 4e. Verified frontend/UI mock branch — ask before creating it

Prepare this step for an approved UI ticket; branch creation, committing and publication require explicit user approval. Skip it for work with no frontend/UI changes, or when the user explicitly requests discussion/draft only. This step follows pre-publication checks, not the later production check in step 6.

**Entry gate:** the user has approved the design and final ticket, the Linear write has been re-read and confirmed, the spec check passes, and applicable preview checks pass. Resolve discrepancies before implementation. Ticket or design approval authorizes preparation and verification only, not branch creation, committing or pushing.

### Git write policy and repository enforcement

- This flow permits one new branch per ticket: `mock/<ticket-id>-<slug>`, for example `mock/fro-326-order-layout`. Keep the real Linear identifier in the name so Linear's configured GitHub integration can associate it with the ticket. The repository is **`Frontline-Forwarding/frontline-forwarding`**; Roompulse repository names in examples are not destinations for this flow.
- The agent may create and push only that new branch, which it created itself. Record the ticket, branch, base SHA and creation in session memory. Never push to `main`, `development`, `pilot/*` or any branch the agent did not create. On an existing-name collision, stop and resolve it with the user; do not adopt an existing branch or create additional branches for the ticket. A retry may use the same recorded agent-created branch, with approval covering that push.
- Use the dedicated pilot clone or an isolated worktree of it, with a remote named `github` verified to point to `github.com/Frontline-Forwarding/frontline-forwarding`. Use only an explicit same-name refspec: `git push github mock/<ticket-id>-<slug>:mock/<ticket-id>-<slug>`. Never use a bare `git push`, `--force`, `--force-with-lease`, or remote branch deletion. Push permission is limited to this flow; a push outside it requires new user approval.
- A PR is created only if separately requested and must remain a **draft**. Never mark a mock-branch PR ready, merge it, or deploy it through this flow.
- **GitHub ruleset enforcement is required before a push.** Inspect the effective repository rulesets using `gh` and verify that the agent's write identity is restricted to creating its allowed mock branches and cannot update protected or other people's branches, force-push or delete branches. The prose policy is not enforcement. Have a repository administrator configure and verify the necessary branch ruleset and restricted write identity if missing; do not silently alter repository-wide permissions or claim that a branch-name rule proves who created a branch. If the full restriction cannot be enforced with the available GitHub controls, report the gap and block publication until it is resolved. Record the enforcement evidence, not just the presence of a ruleset.

### Prepare, verify, approve, publish

1. **Refresh the pilot Base Branch.** Fetch `main` from the verified `github` remote and record the exact base SHA. Read root/client `AGENTS.md`, current package scripts and any documented Base Branch, Version and Sync workflow. Run the documented Sync for the current Version before preparing the mock branch. Do not invent a Sync command or version system: if the repository has no such workflow, report that and use its documented dependency/codegen preparation; generated preparation output is not automatically eligible for the UI diff. Preserve existing work. Prepare changes at a detached HEAD in the isolated checkout so branch creation still follows verification and explicit approval.
2. **Map components before the first implementation file.** Name the Catalogue Component and source path for every element in the picked direction, including the app's existing Screen Parts. Discover the actual catalogue, exports and import aliases from the live client. Use `@ui` if the app defines it; otherwise use its real alias/import paths. Reuse these real components, screen parts and theme tokens; do not hand-roll replacement controls or styles. Where the design needs a new composition, identify it explicitly and compose existing primitives within the approved design; resolve a missing primitive before implementing it.
3. **Implement only approved frontend/UI changes.** Every changed path must be inside `frontline-forwarding-client/`, and every change must serve presentation or UI interaction: components, layouts, styles using the design system, translations, UI assets and relevant tests. A client path alone is not sufficient. Exclude backend/domain computations, API or schema contract changes, generated API files, authorization changes, database/migration work, server code, infrastructure/CI/deployment configuration and dependency changes. Consume existing APIs and preserve behavior and existing screen features. Backend requirements stay in the ticket; identify blocked behavior and never ship fixtures or fabricated responses as a working integration. If existing contracts cannot support meaningful UI implementation and verification, report the dependency and block publication.
4. **Verify before creating the branch.** Run required frontend checks from current package scripts: applicable lint, type checking, tests and production build. Compare the implemented screen with the approved design and criteria in EN/EL, at desktop and approximately 400px, including default/loading/empty/error states and affected existing features. Use isolated test data; production remains read-only. Record commands and results. Failed or unavailable required checks block publication.
5. **Audit the complete diff.** Review `git diff --name-status <base-sha>`, `git diff <base-sha>` and all intended untracked files for both path and content compliance. Stage explicit eligible paths only. Exclude secrets, session files, standalone preview artifacts and unrelated edits. Fetch `main` again; if it advanced, refresh the base, rerun Sync/preparation and affected checks, and repeat the full audit before approval.
6. **Ask, then create and push.** Show the proposed `mock/<ticket-id>-<slug>` name, destination, exact push command, base SHA, complete audited UI diff, verification results, ruleset enforcement evidence and backend dependencies. Ask explicitly whether to create, commit and push this branch, and wait for a clear yes. If declined, retain local work without creating the branch. If the diff or destination changes, reverify and obtain fresh approval. Only after approval, create the new branch from the verified base, commit only audited UI changes, record branch ownership and push using the explicit refspec above. If there are no changes, report that instead of publishing an empty branch.
7. **Verify the remote handoff.** Fetch the published branch, confirm its head SHA matches the verified local commit, and review its entire diff against the recorded base to confirm only approved frontend/UI changes. Return its URL, name, base/head SHAs, changed-file summary, checks and backend dependencies. A push failure or remote mismatch means an incomplete handoff. Record evidence in step 5. Adding a link/comment to Linear still requires step 4c approval.

## 5. Record the session

Append a dated entry to **`FrontLine/Linear/MEMORY.md`** (Session log, newest first): what was discussed, the decisions, the deliverables, the open threads. Refine *How we think in these sessions* whenever the user corrects an approach, and keep *Board state* current. Facts and reasoning, not transcripts.

⚠️ Never push the `FrontLine` working folder to GitHub — its remote is dead and it holds plaintext API-key files. The nested repos (`Font Line Helper`, the marketing site) are pushed individually, and only when the user asks.

## 6. Post-deployment check

When the user says **"verify FRO-xxx"**: read that ticket's `Post-deployment verification` section, run each check, and report **pass or fail per check**. Then draft the verification report as the closing comment and post it only after the user approves the draft.

**"Done" means verified.** Production checks are read-only always: never press submit or save on `cp.frontline-ltd.com`, and never call a write tool against the portal.

## Workspace coordinates

| Thing | Value |
| --- | --- |
| Linear | `linear.app/front-line-ltd` · team **FRO** · workflow labels `Pending_Review` → `Ready` (+ `Edited`, `Business_Input`) |
| Production portal repo | `Frontline-Forwarding/frontline-forwarding` (private); verified frontend/UI branches via step 4e |
| Backend | `frontline-forwarding-app` — Spring Boot / Gradle, GraphQL + REST + MCP adapters, PostgreSQL + Flyway |
| Frontend | `frontline-forwarding-client` — React + TanStack + Vite, GraphQL codegen, Node 22.13.0 |
| Generated reference | `docs/reference/` — regenerated by CI, never hand-edited, so it always matches `main` |
| Design tokens | Live client `src/styles/theme.css`, `DESIGN.md`, touched screen/form and UI components, read through `gh` |
| Design previews | Cloudflare Pages, project `fro-<ticket-id>-<hex6>`, created and deleted by this flow — **nothing else in that account is ever written** |
| Old portal (being replaced) | `FrontLine/Portal Code/` — Cloudflare Workers + D1; background only |
| Live old portal | `cp.frontline-ltd.com` — **read-only, never submit or save** |
| Session memory | `FrontLine/Linear/MEMORY.md` (read at session start, update before it ends) |
| Glossary / decisions | `FrontLine/Linear/CONTEXT.md` + `FrontLine/Linear/docs/adr/` — written during step 1, created lazily |
| Board reference | `FrontLine/Linear/Linear Board Reference.md` — describes the **archived** board; background only |
| People | Dimitris Kakep (owner) · Grigoris Lamprou (co-author) · Chris (dev) |

Greek is normal input. Preserve Greek domain terms with a gloss — `δελτίο αποστολής (delivery note)` — and answer in the language the user wrote in.
