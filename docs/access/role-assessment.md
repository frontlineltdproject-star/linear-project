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
| I10 | View/create/edit ordinary user accounts, including status | No | Across companies, excluding system-admin targets and subject to role/company compatibility | Broad scope, still subject to role/company compatibility | **Fits prior decision**: managers create/edit/lock/disable ordinary internal operator accounts (round 2). Front Line Managers also create/edit/lock/disable client accounts (round 3), using Client Operator initially; supplier/agent account administration remains **Decide**, and internal administrator-account changes remain subject to I11. ACTIVE/LOCKED/DISABLED are saved through USER_EDIT; no separate disabling authority. | [S1], [S3], [S6], [S9] |
| I11 | Appoint another internal manager | No | Yes | Yes | **Change agreed in discussion**: reserve appointment/removal of business administrators to CEO/designated person. No separate CEO account type; exact implementation and protection of demotion/status changes still to specify. | [S3], [S6] |
| I12 | View warehouse maintenance/history and edit warehouse address | Yes | Yes | Yes | **Change agreed in discussion**: restrict warehouse-address editing to managers/system administrators. This changes the current operator permission; retain operator read/history access unless separately decided. The command does not change warehouse identity/type/activity. | [S1], [S2] |
| I13 | Read internal Order/Shipment notes | Yes within internal record access | Yes | Yes | **Fits prior decision**: retain staff-wide internal Order/Shipment note visibility (round 2). Future confidential invoice example is excluded. | [S2] |

## B. External users matrix

“Own” means the account's company, not all companies sharing a vessel. These are existing capabilities to assess, not approved requirements for a new client experience.

| ID | Current capability | CO | CM | SO | SM | AG | Business fit / next decision | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E01 | Read Orders | Company-participant scope | Same | Company-participant scope | Same | No eligible Orders under current party model | **Decide** whether this is the right scope and whether supplier/agent accounts are needed now. | [S2], [S4] |
| E02 | Create/edit Orders | No | No | No | No | No | **Fits prior decision** for clients: retain read-only Orders in the first version (round 3). Supplier/agent policy remains **Decide**; no new client submission/request feature approved. | [S1], [S2], [S4] |
| E03 | Read internal Order notes | No | No | No | No | No | **Fits prior decision** for clients (round 4): keep internal notes hidden. External notes remain visible to authorized Order readers. Supplier/agent business review remains open. | [S2] |
| E04 | Read Shipments, Supplier Invoices, Exports, Customs Storage Entries or Shipment Invoices | No | No | No | No | No | **Decide / Verify**: user finds client shipment tracking helpful if supported (round 4); conditional interest, not approval to expose whole Shipments or implement a new view. Trace existing Order progress/Shipment-derived fields before drafting a gap. PDF/document access is separate from full entity access. Other entity visibility remains open. | [S1], [S2] |
| E05 | Read company-maintenance records | Own | Own | Own | Own | Own | **Decide** actual fields needed; not a claim about every operational reference lookup. | [S1], [S3] |
| E06 | Edit company information, including active flag | No | Own, with field/association rules; may create vessels for own client company | No | Own, with field/association rules | No | Client decision (round 3): initially use Client Operator accounts without self-maintenance; preserve Client Manager functionality for possible future use. Existing Client Manager accounts must be assessed before any change. Supplier-manager policy remains **Decide**. Own-scoped users cannot rename shared vessels or associate another company's vessels. Supplier companies are not valid vessel-creation targets. | [S1], [S2], [S3], [S5], [S7] |
| E07 | Create a company | No | No | No | No | No | **Decide**; recommendation is to retain internal administration. | [S1] |
| E08 | View/create/edit users, including status | No | Own company, compatible non-system roles | No | Own company, compatible non-system roles | No | Client decision (round 3): Front Line Managers administer client accounts initially; retain existing Client Manager user-management functionality for future use. No existing-account downgrade authorized. Supplier self-administration and future activation policy remain **Decide**. | [S1], [S3], [S6], [S9] |
| E09 | Warehouse address maintenance | No | No | No | No | No | **Decide**; operational warehouse reference lookup is a different capability. | [S1], [S2] |
| E10 | Order files, history, exports/PDFs and field-level visibility | All active owned/inherited Order attachments within Order access | Same | Same | Same | No Order-derived access per current policy | **Change confirmed by CEO via user**: internal-file mechanism is essential to replace server-based case filing. Current Order attachments have no per-file audience rule. File ownership, internal audience, sharing/defaults, existing files and migration remain to define; see internal filing discovery below. Other document/entity visibility stays open. | [S2], [S10], [S11], [S12] |

## C. Role structure and boundaries

| ID | Topic | Current situation | Discussion outcome / open assessment |
| --- | --- | --- | --- |
| R01 | Operator vs business administrator | FO and FM already exist | **Fits prior decision**: keep existing role names to minimize changes. Use Front Line Operator and Front Line Manager in the assessment; Business Administrator was discussion shorthand for manager, not a new role or rename. |
| R02 | CEO account | No CEO-specific role in the role enum | Agreed proposal: business administrator plus appointment/removal authority. Assess the separate authority as I11; do not grant SYSTEM_ADMIN solely because of job title. |
| R03 | One client type vs two | CO and CM have meaningfully different permissions | **Fits prior decision** (round 3): initially use Client Operator; explicitly retain Client Manager functionality and its existing name for future use. No removal, disabling of functionality or migration/downgrade of existing accounts authorized. Front Line Managers administer client accounts; conditions for future Client Manager assignment remain open. |
| R04 | Supplier and agent roles | Implemented roles exist | **Decide** whether to use them in this release. Omission from initial proposal is not approval to remove or migrate them. |
| R05 | Technical system administrator | Existing SA holds all authorities; generic user create/update cannot assign SYSTEM_ADMIN because it matches no company type | Keep outside everyday business model. Actual provisioning/support arrangements and deployment verification remain open; no removal or account change authorized. |
| R06 | Future confidential invoice | User's example concerns a future feature | **Deferred** by explicit instruction. It does not justify adding department/file-access rules now. |
| R07 | Current user's role | Missing Companies Create button reported | **Verify** via authorized current-profile read or administrator confirmation; no role inferred. |

## Internal filing discovery — confirmed requirement, scope open

The CEO confirms internal files are essential. Staff currently keep a substantial workflow outside the portal in per-case folders at a central company-server filepath; the aim is to bring that work into the new portal. This supersedes the unresolved keep-all-uploads-visible option. It does not authorize server access, bulk migration, folder deletion or implementation.

Current source gap: Order attachment metadata has no per-file internal/client audience field. Listing/download rely on access to the Order, including files inherited through splits. Staff-only Shipment/Supplier Invoice/Export files already exist through owner-level permissions; they do not provide internal files inside a client-readable Order. No folder hierarchy is established by the inspected attachment model. [S10], [S11], [S12]

| Area | Agreed or current fact | Next decision / trace |
| --- | --- | --- |
| Business need | Internal files are essential; current scope is a step toward replacing server filing | Full job aggregation is explicitly deferred. Do not claim current file visibility changes alone replace the whole job workflow. |
| File owner | A case folder represents a job spanning potentially several business records | User defers a Job/Case aggregate linking those records to a later version. Keep current file work on existing entities; exact affected entities still to agree. Do not equate a job with one Order or Shipment. |
| Internal audience | All internal Front Line staff for the first version, hidden from external clients | Agreed by user. Manager-only/subset restrictions may be considered later; no new role or per-department model now. Existing technical system-admin authority remains outside the business-role redesign. |
| Shared-file actions | Both Front Line Operators and Managers may change Order-file visibility; record actor/time | Agreed. Existing upload/removal rules remain the baseline; sharing permissions must not bypass owner/inheritance rules. Revocation cannot recall downloaded copies. |
| New uploads and existing files | New Order uploads default to internal-only; user confirms existing uploads are mock data | No real historical client visibility needs preservation for this confirmed mock population. Proposed backfill: Internal, without deleting files; final classification pending. No authority to delete or apply this assumption to future real imports. |
| Splits/inheritance | Child Orders reference the original file | Agreed: one visibility value controlled on the owning Order, effective everywhere the file is inherited; inherited files remain read-only on child Orders. Enforce on listing/download and other exposure paths. |
| External audience and other consumers | External files retain existing authorized client and supplier readership within Order participation scope | Agreed: Internal hidden from both; External never means public or unrelated-company access. Trace metadata, filenames, previews/downloads, APIs and direct links to enforce this consistently. |
| Server replacement | Business objective confirmed | Future operating workflow and any historical migration are separate scope decisions; no filesystem access authorized. |

User example: importing a shipment for a client and storing its goods may involve a Shipment, multiple Orders and an import/customs procedure, together with agent/warehouse/duty/tax expenses and supplier invoices, packing lists and AWBs. This is a user-described job example, not verification that all those entities or expense functions are already implemented. User has seen imports and some exports, so do not extrapolate a universal job structure. Job/case vocabulary is captured in CONTEXT.md; implementation of the aggregate is explicitly deferred.

Agreed initial scope: add internal/external visibility to Order attachments; retain staff-only access for Shipment, Supplier Invoice and Export files. User chose two cards in the Attachments tab, analogous to Internal/External Notes. This is an approved layout direction, not a verified canvas or final UI contract; live components/tokens, empty/loading/error states, Greek layout and inaccessible-file metadata still need design/spec reconciliation.

Next interview: classify the confirmed mock uploads and settle whether supplier/agent accounts will be used initially. Inheritance and external-file audience are now agreed; no deletion or account changes authorized. No new case entity, expense accounting or historical server migration in current scope.

## Review rounds

1. Completed: I01 retain cross-customer operator access; I06 extend the four named cancellation capabilities to operators; I12 restrict warehouse-address editing to managers/system administrators. Business decisions only, not deployed changes.
2. Completed: retain I02-I05 operational powers and I13 staff-wide notes; managers create/edit/lock/disable ordinary internal operator accounts (I10). Keep existing role names (R01). External-account scope, manager-account protection details and vessel-deactivation verification remain open.
3. Partially completed: clients remain read-only for Orders; use Client Operator initially and preserve Client Manager functionality for future use; Front Line Managers administer client accounts. Still open: exact fields/documents/status information, external note/file visibility and supplier/agent policy.
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

[S10]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/attachments.md
[S11]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/attachments/Attachment.java
[S12]: https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/attachments/service/AttachmentsApiService.java