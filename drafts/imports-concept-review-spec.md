**Explore the Import Customs Declaration concept with employees through interactive previews.** Use FRO-359 as the current business contract, test whether the creation and daily-work experience is understandable, and identify the related information employees need before defining implementation tickets.

This is concept/design review only. Deliver previews and findings, not production UI, backend integration or a mock branch.

## Review scope

| Area | What employees review |
| -- | -- |
| Creation | Shipment-first selection, all eligible collis initially selected and grouped by Order, manually selected existing-Company Shipper, and saving before submission. Prioritize the ordinary full-clearance case; partial clearance is a secondary scenario. |
| Details and daily work | Import-owned facts, current customs stage, next permitted action, confirmed history and optional files. Keep inspection distinct from rejection and payment distinct from Άδεια receipt. |
| Related context | Explore Shipment transport document, packing/measurements, Client and Vessel information as candidates. Employees decide what is useful, how much belongs together and what can be opened on demand. This is not approval for new editable copies or new calculations. |
| Alternative layouts | Compare two or three directions using existing portal patterns; make their trade-offs explicit. Carry the selected direction forward for refinement. |
| Open coverage question | Demonstrate whole-colli selection as provisional. Ask whether clearing part of a colli's contents is necessary; do not imply FRO-359's open question is resolved by a prototype. |

## Preview implementation

- Build a self-contained static `index.html` with inline CSS and browser-side JavaScript. Use fictional fixture data only; no live clients, vessels, customs references, prices or personal data.
- Before design, read the live portal DESIGN.md, theme.css, relevant screens and UI components through authenticated GitHub CLI. Map preview elements to component names/source paths; mirror the actual tokens and patterns. Identify unfamiliar compositions with visible **New component** markers and explain their purpose.
- Show a persistent **Concept preview — sample data; changes are not saved** notice. Interactions simulate navigation, selection, confirmation and validation in memory, with reset. No backend, production API calls, real uploads, payments or customs submissions.
- Follow FRO-359's accepted lifecycle, editing locks, coverage and authorization boundaries. Business-rule changes suggested during review remain proposals until separately agreed and reconciled with that ticket.
- Include EN/EL, usable desktop and approximately 400px layouts, and visible scenario/state controls. Loading, empty and error states must also be reachable by URL. Use numbered business-rule markers with a plain-language explanation panel.
- Use existing relevant screens as context, clearly distinguishing the new concept from functionality already implemented. Do not create a production-repository branch or commit prototype files to that repository.

## Review and sharing

1. Review the initial directions locally and choose one for employee feedback.
2. Publish only the selected self-contained prototype to a new dedicated `fro-<ticket-id>-<hex6>` Cloudflare Pages project, after verifying Pages-scoped credentials. Existing company Cloudflare resources remain unchanged. Record the project name and stable project URL.
3. Verify the shared link opens signed out; check all scenarios/states in EN/EL and narrow/desktop layouts, with no console errors or failed requests. Clearly report an unpublished/local-only preview if sharing prerequisites are unavailable.
4. The user shares the link with employees. Do not send messages or invitations on their behalf under this ticket.
5. Record feedback by scenario: observation, requested change, reason, decision and unresolved question. Separate presentation preferences, business-rule changes and missing read/API support. Iterate the chosen direction and recheck affected states.

## Completion criteria

- Two or three comparable directions and their trade-offs were reviewed, with a selected direction recorded.
- A working fixture-only preview covers creation, details and daily customs actions, with ordinary full clearance prominent and partial/inspection/no-payment scenarios available.
- A verified employee-accessible URL and its Pages project name are recorded. Local-only work is not reported as completed sharing.
- Employee feedback identifies required related fields, prioritization, unclear terminology/actions and remaining questions; the user confirms the recorded feedback represents the review.
- Any proposed change to FRO-359 is listed for separate approval; no structural ticket is silently rewritten.
- Findings identify subsequent UI implementation scope and any missing data contracts. The preview is not labeled developer-ready or approved for implementation merely because employees reviewed it.

## Decisions and boundaries

| Decision | Reason |
| -- | -- |
| Standalone prototype with fixtures | Allows interaction and feedback before implementation exists. |
| Live portal styling/component mapping | Tests a concept that fits the portal and exposes genuinely new elements. |
| Related-field selection remains exploratory | Employees need to identify the information required for daily work. |
| FRO-359 remains the business contract | A visual change must not silently change customs rules. |
| No production implementation or mock branch | The current deliverable is concept validation, not developer handoff. |

Out of scope: production frontend/backend implementation, production API/database writes, mock branch/PR/merge, real file processing, real customs/payment operations, implementing the deferred Shipment Import/Export category, and authorizing implementation tickets automatically. No changes to existing Cloudflare resources; eventual preview deletion requires a separate instruction.

## Context for agents

- FRO-359 owns Import identity, Shipment/colli relationships, lifecycle, Shipper, editing/cancellation and safeguards. It remains Backlog/Pending_Review/Business_Input with whole-colli applicability unresolved.
- Live design sources: `frontline-forwarding-client/DESIGN.md`, `frontline-forwarding-client/src/styles/theme.css`, touched Shipment/create/details sources and `src/components/ui/`; read current sources before drawing, not archived snapshots or memory.
- Read-only baseline checked: main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`. Screen analogues under the client: `src/features/shipments/components/shipment-composer.tsx`, `shipment-detail.tsx`, `shipment-table.tsx`; app frame under `src/components/layout/`; files under `src/features/attachments/components/attachment-panel.tsx`. Existing layouts are context, not authority to restore superseded workflows. Translate Tailwind theme directives into equivalent ordinary CSS for the no-build preview; do not inline the unprocessed stylesheet. Details-local Card/Facts helpers are not shared catalogue components.
- This task introduces no additional production business rule. Consumer tracing is limited to identifying ownership and any read-contract gaps exposed by proposed related fields; report those gaps without silently implementing them.
- UI screens/components are preview references. The self-contained HTML mirrors their styling; it is not a React implementation or proof of working backend integration.
- Follow the planning repository's preview isolation and scoped-token rules. Publishing access is a prerequisite to a shared URL, not evidence provided by a local preview.

## Preview verification

Open the prototype and verify scenario links, state controls, reset, fixture selection, simulated confirmations, EN/EL labels and responsive layouts. Confirm actions match FRO-359 and remain temporary. Inspect network requests to confirm no production connection or data transmission. Open the published project URL signed out and check console/network logs. These checks concern the prototype only; no production verification is authorized.

**Reference:** FRO-359 (Import Customs Declaration — entity & business rules); live portal design sources listed above; planning AGENTS.md preview workflow.
