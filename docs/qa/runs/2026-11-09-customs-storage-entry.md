# Customs Storage Entry review — 9 November 2026

## Scope and baseline

The user approved mapping expected behavior first, then parallel bug investigation and backend checks. [FLOW-CSE](../flows/customs-storage-entry.md) and [30 scenarios](../scenarios/customs-storage-entry.md) were saved before defect testing. Three focused agents covered Create, Details/Change Order and backend rules; parent inspected source, challenged candidate reachability, tested the Order shortcut and independently reran retained evidence.

Production source: Frontline-Forwarding/frontline-forwarding, named main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, authenticated gh. This is not a deployed-version claim. The reused archive was compared against the complete authenticated Git tree: 1,773 of 1,774 tracked files matched Git blobs; only the unused `frontline-forwarding-app/gradlew.bat` differed. All application sources and policies used here matched. Scratch client source integrity is checked separately after tests.

Current complete FRO-319/353/354/355 are Done; their comments were read and empty. FRO-356 was read as admission/regime background. FRO-358 remains Backlog: list/menu, register UI/Excel/printing and recipient copies are excluded. Export authoring, EAD/IE599 and VAT stamping remain excluded; entry reads consume their saved facts only. The other chat's latest scope is Stock List selection/printing. This review does not expand it or the earlier Order/Shipment corrections.

Mandatory planning pull and gh access succeeded. The repository policy loader was attempted and failed because the authenticated archive has no Git metadata; root/client/app and relevant policy files were read directly. No successful policy snapshot/fingerprint is claimed. Existing presentation contracts were reused; no canvas/preview or production UI branch. Existing vocabulary suffices; no ADR or new domain decision.

## Findings

All ten findings below are **demonstrated in isolated current-source UI tests**. No defect has been demonstrated against deployed production. Priority is a review severity assessment, not an incident rate or approved ticket metadata. Dates, names and quantities in tests are synthetic.

| ID | Severity | Trigger and result | Scenarios |
| --- | --- | --- | --- |
| QA-CSE-01 | High | Open Create from A, select B, then original A lookup fails and recovers: selection silently returns to A while manual text for B remains. Next Create sends A. | 009, 010 |
| QA-CSE-02 | High | Edit one field at v3; refresh supplies another user's v4 change. Save sends v4 with an untouched old field, reversing that change. Change Order confirmation also silently adopts v4. | 018, 019 |
| QA-CSE-03 | High | Type again while Details save is pending, or Cancel and start a new edit. The earlier success closes the current editor and discards later work. | 017 |
| QA-CSE-04 | High | Lost Create plus failed reconciliation, or lost Details/Change Order response: the UI says Nothing was saved/changed and permits further work without resolving the outcome. | 013, 020 |
| QA-CSE-05 | Medium | Create returns a saved identity, then async navigation fails: no saved-record Open/retry state, Create can re-enable and unload protection is removed. | 014 |
| QA-CSE-06 | High | Follow an internal app link with a dirty Create or Details draft: no leave warning, and remount loses the draft. | 015, 017 |
| QA-CSE-07 | Medium | Confirm Change Order before target warehouse facts load: both the different-warehouse confirmation warning and the post-save review notice are omitted. | 022 |
| QA-CSE-08 | Medium | Move an entry from the originating owner A to independent B: Details falsely describes A as a covered post-admission child. | 016, 022 |
| QA-CSE-09 | Medium | Preselection transport failure appears as missing/inaccessible Order; selected-Order draft failure leaves blank facts/disabled Create without error or Retry. | 008, 009 |
| QA-CSE-10 | Medium | Confirm an Order in stock: Order status refreshes, but the independently cached entry shortcut still says Not admitted and keeps Create disabled. | 001, 004 |

Finding IDs identify defects, not ten proposed tickets. At the initial review, grouping, priorities/labels and Linear writes had not been approved. Subsequent accepted grouping and draft status are recorded below.

### QA-CSE-01 — silent creation-owner change

`create/components/customs-storage-create-page.tsx:116–140` keeps the original preselected Order query active and reapplies its ID whenever query success/error/data changes. Actual QueryClient refetch tests choose B and enter manual permit text, then fail/recover A's lookup. The visible selected Order and untouched prefill revert to A; submitted payload contains A's ID with B's manual text. The original Order should remain return context, not retake the selection.

An identical successful refetch alone preserves B because React Query structurally shares unchanged data. The demonstrated trigger specifically includes failure then recovery. Create still requires an explicit click; no automatic record creation is claimed.

### QA-CSE-02 — reviewed version and changed-field baseline are replaced

`details/components/customs-storage-details-page.tsx:76–80,201–205,232–235` holds only draft values, while `details/customs-storage-details-mapping.ts:68–92` compares them with the latest query record and sends that record's version. A goods-description edit begun at v3, followed by v4 with a changed operator name, sends `{expectedVersion:4, goodsDescription:..., operatorName:<old value>}`. The operator never edited that name or reviewed the reversal. The Change Order path at `:274–277` likewise adopts a newer version while its confirmation is open.

Backend `CustomsStorageEntryEditingService.java:34–45,55–68` checks the supplied version under lock. That guard cannot identify a version substituted by the client. Tests demonstrate the actual outgoing payload; they do not execute a database overwrite. Controls cover changed-only updates on an unchanged baseline, explicit clearing and genuine stale rejection with retained draft/Refresh.

### QA-CSE-03 — earlier save consumes later editing

Details inputs remain editable and Cancel stays enabled while Save is disabled. `details/components/customs-storage-details-page.tsx:178–186,208–209,236–237` unconditionally clears whichever editor is current after the original request succeeds. Actual-control tests submit A, accept later text B, then resolve A; B disappears. A second test cancels the pending editor, opens another and types B; original A's success closes that new editor too. Only one update request was made: this is later-work loss, not clicking a disabled Save twice.

### QA-CSE-04 — uncertain outcomes are presented as known failure

Create catches a failed by-Order reconciliation at `create/components/customs-storage-create-page.tsx:317–333` as `failed`, then clears pending at `:311–312`. The label asserts Nothing was saved and Create re-enables. Details/Change Order catches at `details/components/customs-storage-details-page.tsx:239–252,287–314` flatten the error classifier's explicit `unknown` state into Nothing changed, with no canonical reread/reconciliation control.

Three observations cover failed creation recovery, unknown details edit and unknown owner move. Retain the original submitted facts and uncertainty until it is resolved; a failed read establishes neither non-application nor safe retry. Two create requests were observed in a fixture; no duplicate persisted entry was demonstrated, and backend owner uniqueness remains a protection. Simulated saved states are fixture boundaries, not executed server writes or proof of actor attribution.

### QA-CSE-05 — acknowledged save lacks navigation recovery

Create `openEntry` at `:220–231` sets leaving and discards the navigation promise. The saved ID/number is not retained as a recoverable result. Under an injected async navigation rejection and failed invalidation reads, the page stays open, has no Open/retry action, permits another create request and no longer prevents beforeunload. Acknowledged success should retain that identity and recover opening it. This is an injected Promise rejection, not an observed browser/router outage; duplicate persistence is not claimed.

### QA-CSE-06 — internal navigation bypasses dirty protection

Create `:198–207` and Details `:154–168` register `beforeunload`, which does not fire for TanStack internal links. Details protects its own Back action, and Create protects Cancel, but neither controller/route installs a router blocker. Production sidebar uses TanStack Link (`src/components/layout/app-shell.tsx:128–140`). Actual memory-router tests mount the real controllers, click real Links, leave and return: manual edits disappear with no confirmation or unload event. Positive controls prove Cancel/Keep editing, Details Back and native beforeunload handling work. Browser rendering/scrolling is not claimed by jsdom.

### QA-CSE-07 — warehouse warning is bypassed while facts load

Details `:137–150` uses a separate target draft read for its warehouse. `order-relationship-card.tsx:297–310` and `change-order-dialog.tsx:42–60` allow Save/Confirm from selection alone; pending warehouse data becomes no warning. The operation captures null `otherWarehouse` at `:272,282`; a late read never restores the post-save notice. The test confirms a move to a different warehouse before resolving that read. Saved operator/address/permit values correctly stay unchanged, making the missing review notice material. Ready-data control shows both warnings correctly. Failed lookup follows the same source path but was not separately executed.

### QA-CSE-08 — return context is mistaken for coverage

Details `:111–114` decides `coveredChild` solely from `returnOrder.id !== entry.owner.id`, and the layout at `:169–177` asserts split-after-admission coverage. Moving the entry to independent B correctly retains Back to A, but A is no longer covered by that entry. Actual move/DOM test proves the false statement. Backend coverage is not changed by the banner. Create from A, explicitly selecting B and keeping A as return context reaches the same condition by source trace; that variant was not separately executed.

### QA-CSE-09 — selected-Order read failures have no honest recovery state

Create `:116–118` treats every preselection error as not found/inaccessible. Selected-Order data derives at `:145–149` without rendering `draftRead.isError`; the page shows select-an-Order guidance, empty facts and disabled Create when its draft request fails. These are two actual-controller transport-failure tests. The agreed combination of actual missing and denied preselection is preserved; generic transport failure should not be classified as either. Search's own correct Retry is a separate state.

### QA-CSE-10 — stock confirmation does not refresh the entry shortcut

`purchase-orders/hooks/use-purchase-orders.ts:109–117` invalidates only `purchaseOrderKeys.all` after a successful Order command. Entry shortcut uses the separate `customsStorageKeys.orderCard` (`customs-storage/hooks/use-customs-storage.ts:45–56`) and reacts to no Order version/status change (`order-card/order-customs-storage-card.tsx:43–47`). The host keeps the Available actions tab mounted (`purchase-orders/components/details/order-details-page.tsx:140–143`).

Parent's integrated probe mounts the actual stock form, command hook, Order query and entry card. Confirm stock updates the synthetic canonical Order to IN_STOCK; actual invalidation refetches it, while entry lookup call count remains one and Create stays disabled/Not admitted. Invalidating the entry key then makes Create appear (control). No real stock admission was written. Existing FRO-375 is stale confirmations/comment retry, not shortcut cache freshness; its scope was read and preserved.

## Verification and limits

Parent verification completed:

| Check | Result | Meaning |
| --- | --- | --- |
| Existing Customs Storage client tests | 115/115, 12 files, exit 0 | Existing feature controls; 125.54 seconds |
| New mounted UI evidence, combined independent rerun | 27/27, three files, exit 0 | 10 controls, 16 defect observations, one conditional branch excluded from findings |
| Final backend actual-source harness, parent rerun | 155 controls, exit 0 | 39 extracted source files; no separate backend defect confirmed |
| Final scratch client source integrity | 562/562 identical to authenticated source | No production source patched to make probes pass; retained tests match tested copies |
| Source revision at completion | Main unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e | Deployed revision remains unknown |

Node 24.13.0 / Vitest 4.1.6 / jsdom; cached dependencies, not a clean lockfile installation. The real-router Details test emitted three jsdom scrollTo notices; its navigation/remount assertions passed. Backend uses Java 17 preview with declared extraction adaptations, in-memory repositories/admission resolutions and fixed clock; Python and Java networking are blocked. The final harness executes actual User company predicates as well as role authorities, including mismatched staff-role/partner-company denials. An earlier 146-control exploratory run used a simplified User; the final 155-control result supersedes it and is not added to the count.

Backend controls cover field validation/normalization, eligibility given admission resolutions, authorization, sequential duplicate refusal, partial/no-op/stale edits, Change Order, Order guards, audit assembly, owner-only related reads, amounts and active-case calculation. Temporal admission SQL, number allocation SQL, real locks/concurrency, transaction rollback and authenticated transport binding remain source-only. Java 25/Gradle dependencies were unavailable in the inspected environment; native build/JUnit/Testcontainers suites were not run. See [backend review notes](../evidence/customs-storage-entry-backend-notes.md).

Reproduction commands and adaptations are in the [evidence guide](../evidence/customs-storage-entry-evidence.md). The 30 complete portal scenarios remain **Not run end-to-end**. Tests establish named isolated boundaries only. No source fix, portal/database mutation, email/AADE operation, production branch, new Linear issue or deployed equivalence is implied.

A conditional Create test injects INHERITED coverage after an initially eligible selection. No supported transition establishing that sequence was found, so its branch behavior is **excluded from confirmed findings**. Speculation about changing historical admission weight/capability was also excluded where current supported mutation paths did not establish reachability.

## Consumer outcomes

| Area | Supported outcome / ownership |
| --- | --- |
| Create and Details draft/recovery | QA-CSE-01–09; entry corrections to discuss after review |
| Order shortcut after admission | QA-CSE-10; entry integration correction, no expansion of general Order mutation policy |
| Backend entry rules and guards | Actual-source controls plus source traces; no separate backend defect confirmed within executed checks |
| Admission SQL, counter/row locks, atomic rollback, authenticated HTTP/GraphQL | Source-reviewed, runtime integration unverified |
| Export/Customs/VAT writes, Stock List printing and FRO-358 work | Preserved, excluded, existing/separate owners |

Current Bug searches for Customs Storage and Entry returned existing neighboring corrections, not an exact entry correction owner. No duplicate or ownership change is inferred merely from similar recovery symptoms. Existing tickets remain unchanged.

## Accepted correction groups and drafts

After discussing all ten findings, the user accepted two correction tickets and requested full drafts: [D1 draft/save recovery](../../../drafts/customs-storage-entry-bugs/01-drafts-and-save-recovery.md), High, owns QA-CSE-01–06/09; [D2 Order relationships/admission actions](../../../drafts/customs-storage-entry-bugs/02-order-relationships-and-admission-actions.md), Medium, owns QA-CSE-07/08/10. The [draft index](../../../drafts/customs-storage-entry-bugs/README.md) records all metadata, consumer ownership and 16 acceptance/verification pairs. Draft text and creation remain pending approval. Existing tickets are references only, not reopened, expanded or blocking owners. FRO-358 list/register/Excel/print/recipient-copy work, Export and VAT stamping remain excluded. No Linear or production writes and no new fix-test result are implied.

## Source references

Unqualified `create/` and `details/` paths in findings are relative to `frontline-forwarding-client/src/features/customs-storage/`; `customs-storage/` and `purchase-orders/` paths are relative to `frontline-forwarding-client/src/features/`. Backend services are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customsstorage/`.

- [Pinned Create controller](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/customs-storage/create/components/customs-storage-create-page.tsx)
- [Pinned Details controller](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/customs-storage/details/components/customs-storage-details-page.tsx)
- [Pinned entry backend](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customsstorage)
- Requirements: [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319), [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353), [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354), [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355); excluded pending work: [FRO-358](https://linear.app/front-line-ltd/issue/FRO-358).
