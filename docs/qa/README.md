# Front Line business flows and regression checks

This catalogue explains everyday work and provides repeatable checks of the portal. It connects office knowledge, agreed Linear requirements and the implementation. It is not a replacement for the owning ticket's specification.

## Start here

| Document | Purpose |
| --- | --- |
| [Order to Shipment arrival](flows/order-to-shipment-arrival.md) | Business purpose, preparation and the complete normal journey |
| [Order-to-arrival scenarios](scenarios/order-to-shipment-arrival.md) | Prioritized variations, failures and protections to verify |
| [First review and findings — 9 November 2026](runs/2026-11-09-order-to-arrival.md) | Evidence, findings, unresolved questions and execution status |
| [Second review and proposed ticket groups — 9 November 2026](runs/2026-11-09-order-to-arrival-second-pass.md) | Nine additional findings, independent reproductions, coverage and grouping proposal |
| [Five created bug tickets — FRO-373–FRO-377](../../drafts/order-to-arrival-bugs/README.md) | Approved descriptions, Linear links and finding-to-ticket mapping; all carry the Flow QA label |
| [Supplier Invoice flow](flows/supplier-invoice.md) | Expected Order-to-invoice capture, documents, corrections and guarded cancellation |
| [Supplier Invoice scenarios](scenarios/supplier-invoice.md) | 28 prioritized normal, failure, concurrency and ownership cases |
| [Supplier Invoice review — 9 November 2026](runs/2026-11-09-supplier-invoice.md) | Seven findings, isolated evidence, accepted full-split exception and three agreed ticket groups |
| [Three Supplier Invoice bug tickets — FRO-378–FRO-380](../../drafts/supplier-invoice-bugs/README.md) | Approved descriptions, Linear links and finding-to-ticket mapping for all seven findings; all carry Flow QA |
| [Export creation to Customs completion](flows/export-to-customs-completion.md) | Expected group/invoice selection, creation, documents, guarded edits, EAD and positive IE599 |
| [Export-to-Customs scenarios](scenarios/export-to-customs-completion.md) | 28 prioritized normal, failure, concurrency and ownership cases |
| [Export-to-Customs review — 9 November 2026](runs/2026-11-09-export-to-customs-completion.md) | Six isolated UI findings, evidence limits and two proposed ticket groups awaiting agreement; no tickets created |

Read the flow first. Run its normal journey, then the P0 scenarios, then P1. Use separate fixture copies for destructive or terminal branches so one test does not invalidate the next. An unsuccessful first step blocks dependent steps; it does not prove they fail independently.

## Sources and disagreements

- Office experience establishes the work people need to do and the cases worth prioritizing.
- Current, applicable Linear descriptions establish agreed requirements. Backlog changes are explicitly distinguished from delivered scope.
- Repository workflow documents, code and tests establish implementation evidence, which can itself contain defects or stale documentation.
- An execution establishes observed behavior only for its recorded build, environment, actor and fixture.

When sources conflict, record the conflict and its owner. Do not silently turn current code into a business requirement, or label a future feature's absence a regression. Requirements awaiting a business decision stay marked unresolved.

## Recording a run

Record date/time and timezone; frontend and backend version/commit; environment URL; role; fixture Order/Shipment/colli identities; scenario ID; exact actions; expected and actual results; evidence; outcome; and any finding/ticket link. Record build mismatch explicitly. Never put credentials, session tokens or private upload URLs in these documents.

Outcomes: **Pass**, **Fail**, **Blocked**, **Not run**. Reading a test file does not make its scenario Pass. A code defect or isolated reproduction belongs in findings with its evidence type; it does not imply the whole portal flow was executed.

Each finding distinguishes **user-reported**, **suspected from code**, **demonstrated in isolation**, or **observed in the deployed portal**. Link retest results after a fix instead of erasing the original evidence.

## Updating the catalogue

For a functionality change, identify affected flows and scenarios, revise their expected outcomes from the approved ticket, and add cases for new rules and failure paths. A button may affect eligibility, permissions, related records, retries and history, not just the click itself.

Keep stable scenario IDs. Record removals or replacements rather than recycling an ID. Each confirmed defect should acquire a regression case; automate stable high-value cases in the production repository through its separately authorized implementation workflow. Keep readable manual instructions for office review.

## Environment boundary

The user confirmed on 9 November 2026 that the Railway portal currently contains mock data, nothing official. Repository release documentation calls its Railway `production` environment UAT. Neither fact establishes that outbound email, AADE or other integrations are sandboxed.

This first review is a read-only production-source investigation and catalogue preparation. No portal writes, test emails or fiscal submissions are authorized by the catalogue itself. Execute mutation scenarios only in an explicitly authorized test environment with verified integration settings; use local fixtures and isolated test services for automated tests. Any background readiness-email scheduler must also be controlled before creating Orders for tests.

## Baseline

First source baseline: production repository `Frontline-Forwarding/frontline-forwarding`, `main`, commit `6aa259553cd9c86a8aaa157902088aa9a6bca83e` (build files: 0.0.13). This is a source baseline, not a verified deployed-version claim. The run document records current Linear reads and evidence.
