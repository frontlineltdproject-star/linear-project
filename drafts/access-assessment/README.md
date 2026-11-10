# Access assessment — Linear handoff

2026-11-10. Source: production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Repository evidence is not deployed verification.

## Created tickets

| Linear issue | Approved draft | Literal title |
| --- | --- | --- |
| [FRO-399](https://linear.app/front-line-ltd/issue/FRO-399/access-allow-operator-cancellations-and-restrict-warehouse-address) | [1](01-operational-permissions.md) | Access — allow operator cancellations and restrict warehouse-address editing |
| [FRO-400](https://linear.app/front-line-ltd/issue/FRO-400/users-protect-front-line-manager-administration-with-a-designated) | [2](02-manager-administration.md) | Users — protect Front Line Manager administration with a designated permission |
| [FRO-401](https://linear.app/front-line-ltd/issue/FRO-401/order-attachments-internalexternal-visibility-and-inherited-file) | [3](03-order-attachment-visibility.md) | Order attachments — Internal/External visibility and inherited-file access |

All three are in FRO Backlog with Story, Backend and Pending_Review labels. Each description includes frontend delivery. Priority, assignee, project, milestone and parent are unset. Verified related issues: FRO-399 to FRO-236 and FRO-306, FRO-400 to FRO-235, FRO-236 and FRO-243, and FRO-401 to FRO-342, FRO-326 and FRO-377.

## Impact and ownership

| Consumer / affected area | Current behavior and source | Required outcome | Owner |
| --- | --- | --- | --- |
| Role authorities/profile | UserRole.java omits four operator cancellations and includes warehouse editing | Add four cancellation permissions; remove only warehouse editing | Draft 1 |
| Cancellation services and UI controls | Per-record services/capabilities and authority-gated controls; full paths in draft | Extend eligible operator access; preserve state/reason/version/fiscal/recovery restrictions | Draft 1 permissions; existing workflow tickets retain lifecycle/recovery ownership |
| Warehouse API/routes/history/lookups | WarehousesApiService splits VIEW/EDIT; client guards permit operator edits | Deny operator update/direct edit route; preserve reads and operational address use | Draft 1 |
| User persistence/authentication/profile | Role-derived authority; no individual manager grant | Persist per-user grant; resolve current authority on requests | Draft 2 |
| User create/update and company deactivation | Generic manager-target edits and indirect account disabling | Protect target edits, delegation and last active holder atomically | Draft 2 |
| User form/role choices | Actor-insufficient role filtering | Permitted roles/actions only; ordinary managers cannot edit manager targets | Draft 2 |
| Order attachment persistence/list/download | No audience field; Order access permits all owned/inherited files | Internal default; External only within existing Order scope; no internal metadata leakage | Draft 3 |
| Staged Order creation files | Pending creator-private uploads finalized with creation | Preserve staging/recovery; atomically carry visibility | Draft 3; retain FRO-342 staging contract |
| Split/inherited files | Source IDs linked from child Orders | One source-owned visibility; child read-only; enforce on every retrieval | Draft 3 |
| Order attachment tab/shared panel | Shared Order/Shipment component | Two staff cards; External-only reader view; preserve Shipment behavior | Draft 3; coordinate existing Order presentation FRO-326 |
| Shipment/Supplier Invoice/Export files and generated PDFs | Other owners staff-only; generated documents separate | Preserve; no new external sharing | Draft 3 regression boundary |
| Upload reliability investigation | FRO-377 investigates upload 401, excludes permission redesign | Keep diagnosis separate; preserve successful-attempt/retry contracts | Existing FRO-377 |
| External tracking/history | Existing Order/colli timeline; full Shipment restricted | Preserve baseline; controlled historical-output verification before onboarding | Rollout verification, no new tracking feature |

## Existing issue overlap

Current searches covered permission, user, attachment, warehouse address and cancellation terms with pagination. Relevant existing issues were read. Existing authority/admin setup (FRO-235/236/243), warehouse address work (FRO-306) and staged-upload work (FRO-342) are completed baselines, not substitutes for these changes. FRO-377 is an active upload-reliability investigation, not audience design. Cancellation/recovery work including FRO-283/378/381/384/387 retains its own scope; no changes to those issues are proposed. This review found no inspected issue already owning the full new requirements.

## Review status

- Preflight, interview and source consumer tracing completed.
- Canvas/preview/UI branch skipped under the user's specification-only direction.
- Three full descriptions approved in chat, created in Linear and verified after saving.
- Runtime role tests, visual checks and deployed revision/assignments remain unverified. Each draft specifies isolated tests and read-only post-deployment checks.
- CEO bootstrap requires an explicitly identified account at rollout. No account identity is inferred here.
- Existing role names and external manager functionality remain; client/supplier operator initial use and agent deferral are onboarding choices, not role deletions.
