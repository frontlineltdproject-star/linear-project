# Portal access assessment

Review opened: 2026-11-10. Working assessment, not an implementation specification or authorization to change access.

## Objective and evidence

Assess whether existing roles meet Front Line's needs, as clarified by the CEO. Preserve useful existing behavior; propose tickets only for agreed gaps. The earlier three-business-type proposal is a comparison point, not a decision to delete existing roles.

Source: `Frontline-Forwarding/frontline-forwarding`, branch `main`, commit `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, rechecked 2026-11-10. Source inspection establishes implementation, not deployed parity or a completed security audit. No test accounts were created and no application tests were run for this assessment. All deployed role scenarios remain **Not verified**.

User reports that the Railway Companies page has no Create button. This is consistent with missing COMPANY_CREATE, but does not establish the user's exact role. Browser inspection was stopped because the tool could not confidently identify the current URL.

Business-fit values:

- **Fits prior decision**: aligns with an explicit decision in this discussion; CEO validation may still be needed.
- **Change agreed in discussion**: desired difference recorded; not implemented or ticket-approved.
- **Decide**: no business decision yet. Recommendations are not decisions.
- **Verify**: more source or application evidence is required.
- **Deferred**: outside the current assessment scope.

Permission is not unconditional ability to execute an action: record scope, lifecycle, ownership and validation checks still apply. A role with every authority does not bypass every business rule.

## Existing roles

| Code used below | Existing role | Meaning for this assessment |
| --- | --- | --- |
| FO | FRONTLINE_OPERATOR | Internal operational user |
| FM | FRONTLINE_MANAGER | Internal operational user with company/user administration and additional cancellation rights |
| CO | CLIENT_OPERATOR | Client-company user |
| CM | CLIENT_MANAGER | Client-company user with scoped company/user administration |
| SO | SUPPLIER_COMPANY_OPERATOR | Supplier-company user |
| SM | SUPPLIER_COMPANY_MANAGER | Supplier-company user with scoped company/user administration |
| AG | AGENT_OPERATOR | Agent-company user; its Order-view authority currently yields no eligible Orders |
| SA | SYSTEM_ADMIN | Holds all defined authorities; separate from the proposed everyday business-administrator role |

Sources: [S1], [S2], [S3]. Order means the office's stock-list item, also called a purchase order.

## A. Internal staff matrix

| ID | Current capability | FO | FM | SA | Business fit / next decision | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| I01 | Operational record scope across customers | All customers, subject to workflow rules | Same | Same | **Fits prior decision**: retain cross-customer operator access (round 1). Coverage assignments remain routing metadata, not access restrictions. | [S2], [S3], [S4] |
| I02 | Create/edit Orders and work on Shipments | Yes | Yes | Yes | **Fits prior decision**: retain existing operational powers for all internal operators (round 2). | [S1], [S2], [S4] |
| I03 | View/create/edit Supplier Invoices | Yes | Yes | Yes | **Fits prior decision**: retain existing Supplier Invoice operational powers for all operators (round 2). | [S1], [S2] |
| I04 | View/create/edit Exports and Customs Storage Entries | Yes | Yes | Yes | **Fits prior decision**: retain existing Export/Customs Storage Entry operational powers for all operators (round 2). | [S1], [S2] |
| I05 | Create/issue Delivery Notes; create/edit/finalize Shipment Invoice drafts | Yes | Yes | Yes | **Fits prior decision**: retain existing Delivery Note and Shipment Invoice operational powers for all operators (round 2). | [S1], [S2] |
| I06 | Cancel issued Delivery Notes, Supplier Invoices, Exports and finalized Shipment Invoices | No | Yes, with each workflow's checks | Yes, with checks | **Change agreed in discussion**: allow operators these four cancellation capabilities; user reports routine operational need and manager approval would delay everyday work. Preserve existing workflow eligibility/validation and audit behavior; no general cancellation or deletion permission inferred. | [S1], [S2] |
| I07 | View shared companies/suppliers; create/edit them | View only | View/create/edit | View/create/edit | **Fits prior decision**: ordinary operators select existing records; business administrators maintain shared companies/suppliers. | [S1], [S3], [S5] |
| I08 | Maintain vessel records and company-vessel associations | No | Yes; vessel creation uses COMPANY_EDIT on the target client | Yes, with company/type rules | **Fits prior decision** for internal split. External client-manager vessel rights need separate review in E06. | [S1], [S2], [S5], [S7] |
| I09 | Deactivate/reactivate companies, including suppliers | No | Yes via COMPANY_EDIT and company active flag | Yes | **Fits prior decision** for internal split. **Verify** vessel deactivation separately: inspected Vessel record/schema have no active field or equivalent command. Do not equate dissociation with deactivation. | [S5], [S7], [S8] |
| I10 | View/create/edit ordinary user accounts, including status | No | Across companies, excluding system-admin targets and subject to role/company compatibility | Broad scope, still subject to role/company compatibility | **Fits prior decision**: managers create/edit/lock/disable ordinary internal operator accounts (round 2). External account administration remains **Decide**; administrator-account changes remain subject to I11. ACTIVE/LOCKED/DISABLED are saved through USER_EDIT; no separate disabling authority. | [S1], [S3], [S6], [S9] |
| I11 | Appoint another internal manager | No | Yes | Yes | **Change agreed in discussion**: reserve appointment/removal of business administrators to CEO/designated person. No separate CEO account type; exact implementation and protection of demotion/status changes still to specify. | [S3], [S6] |
| I12 | View warehouse maintenance/history and edit warehouse address | Yes | Yes | Yes | **Change agreed in discussion**: restrict warehouse-address editing to managers/system administrators. This changes the current operator permission; retain operator read/history access unless separately decided. The command does not change warehouse identity/type/activity. | [S1], [S2] |
| I13 | Read internal Order/Shipment notes | Yes within internal record access | Yes | Yes | **Fits prior decision**: retain staff-wide internal Order/Shipment note visibility (round 2). Future confidential invoice example is excluded. | [S2] |

## B. External users matrix

“Own” means the account's company, not all companies sharing a vessel. These are existing capabilities to assess, not approved requirements for a new client experience.

| ID | Current capability | CO | CM | SO | SM | AG | Business fit / next decision | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E01 | Read Orders | Company-participant scope | Same | Company-participant scope | Same | No eligible Orders under current party model | **Decide** whether this is the right scope and whether supplier/agent accounts are needed now. | [S2], [S4] |
| E02 | Create/edit Orders | No | No | No | No | No | **Decide** whether clients need requests or submissions beyond read-only tracking; do not equate a request with direct Order editing. | [S1], [S2], [S4] |
| E03 | Read internal Order notes | No | No | No | No | No | **Decide**; recommendation is to preserve staff-only notes. External notes are visible to authorized Order readers. | [S2] |
| E04 | Read Shipments, Supplier Invoices, Exports, Customs Storage Entries or Shipment Invoices | No | No | No | No | No | **Decide** client information needs. A client-safe status/document view may be different from exposing an internal record. | [S1], [S2] |
| E05 | Read company-maintenance records | Own | Own | Own | Own | Own | **Decide** actual fields needed; not a claim about every operational reference lookup. | [S1], [S3] |
| E06 | Edit company information, including active flag | No | Own, with field/association rules; may create vessels for own client company | No | Own, with field/association rules | No | **Decide** whether external self-maintenance, company deactivation and client vessel creation are wanted. Own-scoped users cannot rename shared vessels or associate another company's vessels. Supplier companies are not valid vessel-creation targets. | [S1], [S2], [S3], [S5], [S7] |
| E07 | Create a company | No | No | No | No | No | **Decide**; recommendation is to retain internal administration. | [S1] |
| E08 | View/create/edit users, including status | No | Own company, compatible non-system roles | No | Own company, compatible non-system roles | No | **Decide** whether clients/suppliers should administer their own users, including manager-role assignment and LOCKED/DISABLED status. | [S1], [S3], [S6], [S9] |
| E09 | Warehouse address maintenance | No | No | No | No | No | **Decide**; operational warehouse reference lookup is a different capability. | [S1], [S2] |
| E10 | Order files, history, exports/PDFs and field-level visibility | Requires detailed review | Requires detailed review | Requires detailed review | Requires detailed review | No Order-derived access per current policy | **Verify + Decide**: an allowed Order read is not approval to expose every associated file or field. Existing policy covers attachment inheritance and scoped lineage, but file categories/output surfaces need a focused walkthrough. | [S2] |

## C. Role structure and boundaries

| ID | Topic | Current situation | Discussion outcome / open assessment |
| --- | --- | --- | --- |
| R01 | Operator vs business administrator | FO and FM already exist | **Fits prior decision**: keep existing role names to minimize changes. Use Front Line Operator and Front Line Manager in the assessment; Business Administrator was discussion shorthand for manager, not a new role or rename. |
| R02 | CEO account | No CEO-specific role in the role enum | Agreed proposal: business administrator plus appointment/removal authority. Assess the separate authority as I11; do not grant SYSTEM_ADMIN solely because of job title. |
| R03 | One client type vs two | CO and CM have meaningfully different permissions | **Decide** after E06/E08. One initial client type could mean onboarding only CO; it need not mean deleting CM. |
| R04 | Supplier and agent roles | Implemented roles exist | **Decide** whether to use them in this release. Omission from initial proposal is not approval to remove or migrate them. |
| R05 | Technical system administrator | Existing SA holds all authorities; generic user create/update cannot assign SYSTEM_ADMIN because it matches no company type | Keep outside everyday business model. Actual provisioning/support arrangements and deployment verification remain open; no removal or account change authorized. |
| R06 | Future confidential invoice | User's example concerns a future feature | **Deferred** by explicit instruction. It does not justify adding department/file-access rules now. |
| R07 | Current user's role | Missing Companies Create button reported | **Verify** via authorized current-profile read or administrator confirmation; no role inferred. |

## Review rounds

1. Completed: I01 retain cross-customer operator access; I06 extend the four named cancellation capabilities to operators; I12 restrict warehouse-address editing to managers/system administrators. Business decisions only, not deployed changes.
2. Completed: retain I02-I05 operational powers and I13 staff-wide notes; managers create/edit/lock/disable ordinary internal operator accounts (I10). Keep existing role names (R01). External-account scope, manager-account protection details and vessel-deactivation verification remain open.
3. Client tasks, information and self-administration: E01-E10, R03.
4. Supplier/agent need and technical administration: R04-R05; then field/file and entry-point verification.
5. Present final fit/gap summary to CEO; search current Linear work and draft only agreed gaps. No Linear writes without reviewed approval.

## Verification and impact follow-up

| Area | Current source finding | Required outcome / ownership |
| --- | --- | --- |
| Role definitions and company scope | Role-derived authorities plus actor-company scope | Preserve unless a business decision changes them; assessment only, no implementation owner assigned yet. |
| User create/update and role selection | Managers can assign matching non-system roles | I11 gap needs a full trace of creation, promotion, demotion, status changes and API/UI consumers before a ticket. |
| Order lists/details/actions | Participant-filtered lists, authorized details, internal mutations | Verify with controlled accounts in an approved test environment; no live mutation testing. |
| Navigation and direct URLs | Companies/Create controls are permission-driven; hiding alone is not enforcement | Verify allowed navigation and denied direct API access separately. |
| Files, documents and cross-client references | Existing scoped mechanisms documented | Review relevant consumers once desired client outputs are settled; no full-security-audit claim. |
| Existing users and deployment | Actual assignments and deployed revision unknown | Confirm before any rollout or migration proposal. No blanket role conversion. |

Workflow position: preflight complete for source-led assessment; interactive discovery active. Canvas, preview, final specification and ticket steps are not yet reached. No UI change has been selected. Production branch work remains outside this planning scope. Memory is updated each round; deployed verification remains pending.

## Pinned sources

[S1]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/users/UserRole.java
[S2]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/architecture/authorization.md
[S3]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/access/AuthorizationService.java
[S4]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderAuthorizationService.java
[S5]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/companies/service/CompaniesApiService.java
[S6]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/users/service/UsersApiService.java
[S7]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/vessels/VesselService.java
[S8]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/vessels/Vessel.java
[S9]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/users/UserStatus.java
