**Front Line Manager administration** requires an additional, individually assigned permission. The CEO remains a Front Line Manager; ordinary managers continue administering ordinary operational accounts.

## Permission contract

| Item | Type | Rule |
| --- | --- | --- |
| Manager-administration permission | Per-user grant | Independent of the user's role. Eligible business holders are Front Line Managers; do not give it automatically to every manager. |
| Initial holder | Explicit existing-account reference | A System Administrator assigns the first holder to the CEO through a controlled setup operation. Identify the account during rollout; never infer it from name or email. |
| Delegation | Authorized action | A current holder may grant/revoke this permission for another Front Line Manager. Preserve technical System Administrator authority. |
| Last active holder | Enforced invariant | After bootstrap, do not allow an administrative change to leave no holder able to sign in. Check the resulting account role, grant, lock/status and company activity atomically. |

Do not add a CEO role, rename roles, or repurpose company/vessel coverage as authorization.

## Protected operations

- Require the additional permission, or technical System Administrator authority, to create/promote a Front Line Manager or administer an existing manager account.
- Protect demotion, lock/disable, company reassignment, credentials/login identifiers and other administrative edits to a manager target. Ordinary managers cannot gain control through an alternative field, direct API request or a combined role/status update.
- Apply the same boundary to indirect changes that disable protected accounts, including deactivating their Front Line company. Preserve ordinary client/supplier company maintenance.
- Grant/revoke checks use current authority. A revoked grant stops authorizing subsequent requests; stale UI or an existing session cannot retain the privilege.
- Enforce last-holder protection across concurrent grant, account and relevant company changes. An authorized holder may step down only when another active eligible holder remains.
- Record grant/revoke and protected-account changes with actor, target, time and relevant before/after values. Never store passwords or password hashes in audit output.

## Ordinary administration and UI

Front Line Managers without the additional grant may create, edit, lock and disable ordinary Front Line Operator, Client Operator and Supplier Operator accounts within existing company/type rules. Client Manager, Supplier Manager and Agent functionality is retained; this ticket does not delete roles, downgrade accounts or broaden external managers' scope.

Reuse the current user list/form. Offer only roles and administrative actions the caller may assign or perform. Make protected manager accounts read-only to ordinary managers; enforce the same rule on direct routes and APIs. Authorized holders can manage the additional grant without it becoming an ordinary-manager-editable field. Keep technical System Administrator accounts and provisioning separate from the generic role selector.

## Decisions

| Decision | Reason |
| --- | --- |
| Individual grant instead of another role | Keep existing role names and distinguish the CEO/designated person's responsibility. |
| System-admin bootstrap, then holder delegation | Establish the first authorized person and support controlled handover. |
| Protect the whole manager-account administration path | A role-dropdown restriction alone cannot prevent takeover or disabling. |
| Preserve at least one active holder | Avoid administrative lockout, including concurrent changes. |

## Acceptance criteria

1. Existing Front Line Managers do not automatically receive the grant. Controlled bootstrap targets the explicitly selected CEO account without changing its role.
2. An authorized holder can grant/revoke for eligible manager targets. Ordinary managers, operators and external users cannot grant, self-grant or obtain the permission through generic user editing.
3. Ordinary managers cannot create/promote or administratively change manager accounts, including through credential, status, company or indirect Front Line-company changes. Authorized holders/system administrators can perform valid changes.
4. Last-holder checks reject direct and concurrent changes that would remove the final active eligible holder. The rejected change leaves accounts, grants and company state unchanged.
5. Backend enforcement, authenticated authorities, profile output, role choices and target actions agree. Revocation applies to subsequent requests from an existing session.
6. Ordinary operator/client/supplier account administration and existing technical/external-manager boundaries remain intact. Grant and protected-account audit records contain no secrets.

## Out of scope

New business roles, technical administrator provisioning redesign, external-manager onboarding policy, general identity-provider replacement and file visibility.

## Context for agents

Source baseline: `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

`docs/reference/database.md` and `V1__initial_schema.sql` define `public."user"` with `company_id`, `role`, `status`, `is_locked`, login identifiers and password hash; `company.active` affects sign-in eligibility. No independent per-user grant or general account-version/audit contract is established in the inspected flow. Add appropriate persistence and migrations; the implementation chooses new identifiers rather than treating proposed names as existing schema.

Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`, trace `domain/users/User.java`, `domain/users/UserAuthenticationFilter.java`, `domain/access/AuthorizationService.java` and `web/users/service/UsersApiService.java`. Authority currently comes directly from `user.role()`. Generic updates accept company, role, status, username, email, name and optional password. Extend effective permission resolution consistently rather than only changing the form.

Also trace company updates because company deactivation disables users. Preserve non-system access restrictions around System Administrator targets. The generic company/role matcher cannot assign SYSTEM_ADMIN today; bootstrap must not assume otherwise.

Client source: `frontline-forwarding-client/src/features/users/components/user-form.tsx` and user create/edit routes/services; current role options are not sufficiently filtered by actor. Extend API/profile contracts and document bootstrap, audit and last-holder behavior. Test using isolated accounts; no production privilege changes during verification.

## Post-deployment verification

| AC | Read-only check |
| --- | --- |
| 1–2 | Inspect approved bootstrap evidence, current grants/profiles and audit history; review isolated unauthorized assignment results. |
| 3 | Inspect permitted role choices and protected target presentation; review direct API and indirect company-change rejection tests. |
| 4 | Review concurrent last-holder tests and rollback evidence. Do not disable a live account to test the guard. |
| 5 | Compare profiles/UI with server policy; review isolated existing-session revocation tests. |
| 6 | Review ordinary-account regression tests, audit redaction checks and technical/external-manager scope results. |

**Reference:** [Production source](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e), user/account sources above.
