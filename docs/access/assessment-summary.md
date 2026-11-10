# Portal access assessment — business handoff

Date: 2026-11-10. Objective: evaluate whether the existing roles cover Front Line's needs, then change only the agreed gaps.

This summary records decisions reached with the user during the assessment. It does not claim that the CEO separately approved every decision, that changes are implemented, or that deployed access has been verified. The CEO explicitly confirmed the need for internal files to support work currently filed on the company server.

Detailed source evidence and decisions: [role assessment matrix](role-assessment.md). Production source baseline: `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

## Overall conclusion

The existing role structure is largely suitable. Retain role names and existing functionality. Four areas require changes: operator cancellation permissions, warehouse-address edit permission, protected administration of Front Line Manager accounts, and internal/external Order attachments. These are four change areas, not a final ticket count.

## Agreed changes

| Area | Current implementation | Agreed outcome | Work needed before final tickets |
| --- | --- | --- | --- |
| Operator cancellations | The four listed cancellation permissions belong to managers/system administrators | Front Line Operators may cancel issued Delivery Notes, Supplier Invoices, Exports and finalized Shipment Invoices. Preserve each workflow's eligibility checks and audit behavior. | Trace role mapping, backend checks and UI controls for all four workflows; do not grant blanket delete/cancel rights. |
| Warehouse addresses | Operators can edit warehouse addresses | Restrict address editing to Front Line Managers/system administrators. Preserve operator reads/history and operational lookups. | Trace all maintenance entry points and API enforcement; keep this separate from editing a delivery destination. |
| Manager-account administration | Managers can assign other manager roles through generic user management | CEO/designated person holds an additional permission to appoint/remove Front Line Managers. CEO remains a Front Line Manager, not a new role. Ordinary managers administer ordinary operator/client/supplier accounts. | Specify initial grant/delegation and protection of existing manager accounts, including role/status/credential changes that could bypass the intended boundary; trace API/UI consumers and audit needs. Retain technical system-admin role separately. |
| Order file visibility | Authorized Order readers can list/download all active owned/inherited attachments; no per-file audience | Add Internal and External files as described below | Written backend/frontend contract prepared; no preview or UI implementation under the user's specification-only direction. |

## Order file contract agreed in the interview

- Scope: Order attachments. Shipment, Supplier Invoice and Export files retain existing staff-only access.
- Staff UI contract: two cards in the Attachments tab, following the Internal/External Notes pattern. External readers see External files only. No standalone preview or UI implementation is part of this planning task.
- Internal: available to all Front Line internal staff initially; hidden from external users. Narrower internal audiences are deferred.
- External: available to authorized client and supplier readers of the Order, never public or unrelated-company access.
- Both Front Line Operators and Managers may change visibility; record actor and time.
- New uploads default Internal; sharing is explicit.
- Existing uploads were confirmed by the user to be mock data: classify them Internal, keep the files, and explicitly share selected examples when needed. This is not authority to delete files or a policy for future real-data imports.
- One source-owned visibility value governs a file wherever it is inherited. Change it on the owning Order; inherited attachments remain read-only on child Orders. Visibility changes cannot recall downloaded copies.
- Existing upload/removal eligibility and ownership rules remain; final specifications must ensure audience checks cover all ways of obtaining file bytes and metadata.

## Retained roles and intended initial use

| Role | Assessment outcome |
| --- | --- |
| Front Line Operator | Retain cross-customer operational scope, existing operational abilities and staff-wide internal notes. Apply the cancellation extension and warehouse-address edit restriction above. |
| Front Line Manager | Retain shared company/supplier/vessel maintenance and ordinary internal-user administration. Also create/edit/lock/disable Client Operator and Supplier Operator accounts. Protect manager-account administration under the additional CEO/designated-person permission. |
| Client Operator | Use initially. Retain read-only company-participant Order access; internal notes hidden; new file audience rule applies. |
| Client Manager | Preserve role and functionality for later use. No deletion or automatic downgrade of existing accounts. |
| Supplier Operator | Use initially with existing read-only Order information, including client/invoicing-company identity, invoice-row prices/totals, external notes and tracking information. New file audience rule applies. |
| Supplier Manager | Preserve role and functionality for later use. No deletion or automatic downgrade of existing accounts. |
| Agent Operator | Defer onboarding; preserve role and functionality. |
| System Administrator | Retain as a separate technical role, outside everyday business account assignment. No account/provisioning changes authorized by this assessment. |

Client tracking already has a useful source baseline: Order -> Collis -> tracking-code timeline exposes journey/warehouse information and selected Shipment metadata, while the full Shipment page remains staff-only. Use it initially; no new client Shipment page is requested. Verify historical references and external output scope before onboarding.

## Deferred scope

- A Job/Case aggregate linking the records belonging to one overall job.
- Expense-accounting or other job-workflow features not established by the current source review.
- Historical migration from company-server folders or removal of those folders.
- Manager-only or department-specific internal-file audiences.
- New vessel-deactivation functionality; retain existing vessel maintenance.
- New client Shipment page and broader access to internal entities/documents.
- Client Manager, Supplier Manager and Agent onboarding as routine first-version accounts.
- The original example of a future confidential invoice as a separate feature.

Internal files are a necessary step toward replacing server filing. They do not by themselves provide a complete job workspace.

## Verification and implementation handoff

Consumer tracing and current Linear overlap review support three specification-only drafts in [the review package](../../drafts/access-assessment/README.md). The impact table there supersedes the preliminary work-needed column above. No canvas, preview or production UI branch is required for this handoff; eventual development still includes the specified frontend behavior.

The manager permission uses System Administrator bootstrap for the CEO, then delegation/revocation by current holders to other Front Line Managers, with last-active-holder protection. The user corrected an accidental selection of system-admin-only assignment. Protect all manager-target administrative changes and indirect disabling paths.

Internal/External scope was explicitly confirmed as Order-only after reconsidering a temporary all-entities proposal. Other attachment owners remain staff-only.

Outstanding: review the full drafts and metadata before Linear writes; implement and test in an isolated environment; verify deployment revision, actual account assignments and external tracking history before onboarding. The missing Create button alone does not identify the user's role. No production mutation tests or blanket role conversions are authorized.

No production code, portal data, account permissions or Linear issues were changed during this assessment. The planning documents were committed and synchronized separately.
