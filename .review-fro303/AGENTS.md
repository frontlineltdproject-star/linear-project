# Agent Instructions

## Scope

These instructions apply from the repository root. More specific `AGENTS.md` files inside app directories take precedence for files under those directories.

## Start Every Task With the Local Playbook

Before analyzing, planning, reviewing, or implementing a new task, run from the
repository root:

```sh
python3 -B .ai/load_guidelines.py start --issue "<issue-id-or-task-slug>"
```

Use the actual Linear identifier or a short task slug for work without an issue.
Read the full output and report its Git HEAD, policy state, and SHA-256
fingerprint in the first progress update after loading and in the task handoff.
Run `start` once per new task. To continue the same task, including after context
compaction or in another assistant, retain that snapshot with:

```sh
python3 -B .ai/load_guidelines.py resume --issue "<issue-id-or-task-slug>"
```

Report load failures immediately. Follow [loader operation and recovery](docs/agents/playbook.md)
for missing or invalid snapshots; never silently replace the task's guidance.
Apply the loaded policies with current app-local guidance and relevant business
docs. Preserve prior decisions, completed model checkpoints, and approvals.
Developer instructions govern the task; surface conflicts instead of silently
weakening backend TDD, documentation, or business requirements.

## Business Context

Frontline Forwarding is building an internal and partner-facing management tool for FRONT LINE Forwarding & Agency LTD, client companies, suppliers, agents, and system administrators.

The external informative website is https://frontline-ltd.com/en/. Use it as the public reference for company positioning, service vocabulary, and domain context. The website describes FRONT LINE Forwarding & Agency LTD as operating in supply-chain logistics, including international transport, warehousing, customs brokerage, ship supplies, delivery on board, ship agency, cargo insurance, and legal support.

The product should support operational logistics workflows where Frontline staff, client-company users, supplier users, agent users, and system administrators coordinate or govern requests, shipments, customers, documentation, statuses, and communications.

## User Groups

The application has four primary user groups:

- Frontline internal users: operators and managers working for FRONT LINE Forwarding & Agency LTD.
- Client-company users: operators and managers working for client partners or customers. Client companies may be shipping companies with vessels or non-shipping commercial companies without vessels.
- Supplier-company users and agent users: operators and managers working for supplier or agent organizations that participate in assigned operational workflows.
- System administrators: users responsible for platform configuration, access control, system-level maintenance, and support.

Each user group can have different views, permissions, available actions, and data visibility. Role and organization boundaries are core product requirements, not UI-only concerns.

## Business Requirements

The management tool should be designed around these initial requirements:

- Serve Frontline internal operators/managers, client-company operators/managers, supplier/agent participants, and system administrators with role-appropriate access.
- Centralize operational data for forwarding, agency, warehousing, customs, delivery-on-board, and related shipment services.
- Make shipment/request status clear, auditable, and easy to update.
- Support customer and partner management without exposing data across unrelated organizations or unauthorized roles.
- Treat every operator action as business-sensitive; prefer explicit permissions, auditability, and predictable validation.
- Prioritize practical operational speed: users should be able to find records, update statuses, and act on pending work quickly.
- Keep terminology aligned with the logistics domain and the public company language unless product requirements define a better internal term.
- Design for future expansion into cargo tracking, offer requests, document handling, notifications, reporting, and integration with external logistics systems.
- Treat a handling unit (colli) as one permanently identified physical unit whose append-only journey is traceable from its initial PO through every warehouse stay, shipment, intermediary hub, and final handover.
- Apply operational status and shipment movement to the whole set of current nonterminal collis in a PO. When a shipment selects only a subset, move those selected handling-unit identities into an explicit child PO and make the shipment follow the child; leave unselected and terminal collis on the parent.
- Keep damaged, uncollectable, missing, or otherwise terminal collis as terminal members of their current PO for reference while excluding them from shipment eligibility.
- Model a shipment as one road, air, or sea transfer from one warehouse to one
  purpose-compatible warehouse, agent, or direct vessel destination, with one
  transport document. Direct delivery on board derives the common vessel from
  its participating POs and does not require a destination agent. Shipment
  pallets and cardboard boxes may repack collis from several complete POs.
- Preserve PO identity across intermediary warehouses by recording temporal warehouse stays. Unknown location must be distinct from delivery or cancellation and retain the complete last-known journey.

## Product Principles

- Optimize for accuracy and traceability over cosmetic shortcuts.
- Prefer clear workflows and explicit states over ambiguous free-form data.
- Avoid assuming a single transport mode; the company works across sea, air, and road transport.
- Avoid assuming all users are Frontline employees; client-company, supplier-company, agent, and system administrator users are first-class users with distinct access models.
- Keep sensitive business, customer, shipment, and authentication data protected by default.
- Treat authorization as backend-owned business logic. Role authorities define allowed actions, while record scope such as company access must be enforced server-side before data is returned or mutated.

## Repository Layout

- `frontline-forwarding-app/` - backend/service app.
- `frontline-forwarding-client/` - frontend React/TanStack app.
- `frontline-forwarding-engineering-playbook/` - shared engineering policies,
  task snapshot tooling, and tooling tests; no runtime application dependency.

## Working Rules

- Do not commit secrets, local environment files, dependency folders, or build output.
- Preserve existing app structure unless the task explicitly calls for a refactor.
- Before changing an app, read that app's local `AGENTS.md` and follow it.
- Use the package manager and build tools already present in the target app.
- Keep root-level files focused on repository coordination and shared business/product context; put app-specific guidance in the app directory.
- When implementing product features, map code decisions back to the business requirements above.
- If requirements are ambiguous, choose the safest operational behavior and document the assumption.

## Development Workflow

- Follow the loaded [analysis and slice workflow](frontline-forwarding-engineering-playbook/content/shared/workflow.md).
  Resolve requirements against current code and domain docs with the developer.
  Planning and implementation each have a separate mandatory model-check pause.
- Implement coherent slices. After each slice, review its complete diff, run
  proportionate validation and required documentation generation, and present
  the actual changes for approval before creating a local commit. Plan approval
  alone does not authorize commits. Apply this gate to review fixes too.
- Before issue lookup, branching, or authorized delivery transitions, read
  [Frontline issue delivery](docs/agents/issue-tracker.md) for the team, base
  selection, issue/title conventions, and verified status mappings.
- Before code exploration or domain design, follow [domain documentation](docs/agents/domain.md).
- Push, open PRs, and squash-merge only when explicitly requested under the
  [PR workflow](frontline-forwarding-engineering-playbook/content/shared/pull-requests.md).
  Verify current findings and include CodeRabbit review in authorized PR work.

## Documentation Workflow

- Apply the loaded [documentation policy](frontline-forwarding-engineering-playbook/content/shared/documentation.md)
  whenever business behavior, schema, fixtures, API contracts, or repository
  guidance change. Keep curated architecture/authorization/workflow documents
  and generated database, GraphQL, REST, MCP, and frontend contracts synchronized
  in the same slice as their source changes.
- Follow [documentation maintenance](docs/development/documentation.md) for
  generator commands, sanitized isolated databases, output ownership, and CI
  drift verification. Generated references are regenerated rather than edited
  by hand. Preserve the existing thorough documentation requirements.

## Verification

Run checks from the affected app directory when feasible:

- Frontend: `npm run test`, `npm run build`, and `npm run format:check` from `frontline-forwarding-client/`.
- Backend: `./gradlew build` from `frontline-forwarding-app/`.

If a check cannot be run, document why in the final response.
