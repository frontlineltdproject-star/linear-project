# Order-to-arrival review — 9 November 2026

## Scope and provenance

User-approved first slice: Order creation → supplier readiness → stock → Shipment creation → packing/readiness → dispatch → arrival. Investigate the reported warehouse-change crash and attachment refusal along the way.

- Date: 9 November 2026, Europe/Athens.
- Source: `Frontline-Forwarding/frontline-forwarding`, `main`, `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; build files 0.0.13. Downloaded fresh with authenticated `gh`.
- Portal referenced by user: https://frontend-production-387f.up.railway.app. **Deployed frontend/backend versions were not independently verified.**
- User confirmed the portal currently contains mock data, nothing official. [Release documentation](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/development/releases.md#L1) describes the Railway environment named production as UAT. Email/AADE integration settings remain unverified.
- User report: `bugs.md` supplied from their Desktop, observations #1–10 and scenario notes. Those are historical user observations without a recorded role/build/request trace, not a new test execution.
- Planning repository synchronized before work. No portal/API/database mutation, outbound email, fiscal submission or production-source change was performed. No Linear ticket was written.
- Production policy loader failed because the downloaded archive has no Git metadata. Relevant policy files were read directly; **no successful loader snapshot or loader fingerprint is claimed**.
- Existing code tests and an isolated frontend copy were inspected. All **562 copied client source files matched the pinned archive byte-for-byte** before the reproduction rerun. The harness reused available local dependencies; it is not a clean lockfile installation or proof of the deployed bundle.

## Current ticket baseline

Read on 9 November 2026. These are current issue reads, not status assumptions from planning memory. Other linked owners are references, not a claim that every related ticket was audited.

| Ticket | Current status | Last updated (UTC) | Scope |
| --- | --- | --- | --- |
| [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign) | Done | 2026-11-05T19:39:05.876Z | Order Creation - Page Redesign |
| [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign) | Done | 2026-11-06T08:43:14.672Z | Order Details - Page Redesign |
| [FRO-336](https://linear.app/front-line-ltd/issue/FRO-336/order-select-initial-readiness-state-during-creation) | Done | 2026-11-05T17:21:03.784Z | Order — select initial readiness state during creation |
| [FRO-346](https://linear.app/front-line-ltd/issue/FRO-346/order-details-combine-details-editing-and-readiness-correction-in-one) | Done | 2026-11-05T17:21:05.185Z | Order Details — combine details editing and readiness correction in one atomic save |
| [FRO-328](https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and) | Done | 2026-11-05T17:21:06.439Z | Order - Split supplier readiness emails into 'Request readiness date' & 'Confirm readiness date' |
| [FRO-342](https://linear.app/front-line-ltd/issue/FRO-342/order-and-shipment-structural-support-for-file-uploads-during-creation) | Done | 2026-11-06T13:55:17.859Z | Order & Shipment — structural support for file uploads during creation |
| [FRO-341](https://linear.app/front-line-ltd/issue/FRO-341/shipment-creation-page-redesign) | Done | 2026-11-06T17:35:25.517Z | Shipment Creation — Page Redesign |
| [FRO-325](https://linear.app/front-line-ltd/issue/FRO-325/shipment-split-creation-repacking-and-dispatch) | Done | 2026-11-06T10:22:46.443Z | Shipment — Split creation, repacking & dispatch |
| [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344/shipment-details-editing-pre-dispatch-and-readiness-invalidation) | Done | 2026-11-06T10:22:48.071Z | Shipment Details — Editing pre-dispatch and readiness invalidation |
| [FRO-345](https://linear.app/front-line-ltd/issue/FRO-345/shipment-details-page-status-history-recorded-operations-and-comments) | Done | 2026-11-06T10:22:49.718Z | Shipment Details Page — status history, recorded operations and comments |
| [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316/shipment-details-page-redesign) | Done | 2026-11-06T17:35:26.925Z | Shipment Details — Page Redesign |
| [FRO-323](https://linear.app/front-line-ltd/issue/FRO-323/shipment-select-eligible-collis-from-arrived-shipments) | Done | 2026-11-06T13:55:19.520Z | Shipment — select eligible collis from arrived shipments |
| [FRO-356](https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location) | Done | 2026-11-06T15:55:25.717Z | Order & Warehouse — separate customs regime from physical location |
| [FRO-362](https://linear.app/front-line-ltd/issue/FRO-362/order-and-shipment-independent-colli-custody-and-movements) | Backlog | 2026-11-06T13:49:02.771Z | Order & Shipment — independent colli custody and movements |

## Evidence summary

| Check | Outcome | What it proves / does not prove |
| --- | --- | --- |
| Source/requirement trace | Completed for the first catalogue slice | Establishes expected flow, consumers and identified conflicts; not exhaustive code correctness. |
| Warehouse-change isolation | Three observation tests passed | Reproduces two faulty behaviors plus a cached-query control using actual route/controller/form. The assertions intentionally observe the defect; passing does **not** mean the feature is correct. |
| Existing relevant client tests | 54 passed across five files | Covers their assertions with local dependencies; two React act warnings occurred. These tests missed the composed route/refetch boundary. |
| Upload-error isolation | Five injected cases passed | Actual client service/hook/submit guard handles injected PUT 401, POST 401, POST 403, network rejection and success as recorded below. Does not establish why the real server returned 401. |
| Full browser journey OS-001–026 | Not run | Mutating execution and deployed integration checks remain outstanding. |
| Full frontend build/suite | Not run | Focused investigation only. |
| Backend suite | Not run | Available Java is 11; project requires Java 25. No full application/database/container test was set up. |
| Artifact checks | See final validation receipt below | Catalogue IDs, relative links, source references and whitespace checked separately from application behavior. |

The warehouse reproduction was independently rerun: `node node_modules/vitest/vitest.mjs run --config vitest.config.ts --configLoader runner warehouse-reproduction.test.tsx`, exit 0, 3/3 checks. Initial default config loading hit a sandbox write restriction in a linked dependency cache; runner loading completed without weakening the sandbox.

The five existing files were `use-shipment-creation.test.tsx`, `shipment-creation-rules.test.ts`, `shipment-creation-form.test.tsx`, `shipment-creation-mapping.test.ts`, and `shipment-creation-overview.test.tsx`. Their run was performed by the investigation agent; the parent reviewed the log and source equality, and independently reran the three new reproductions.

The upload reproducer was independently rerun with Node 24.13.0, exit 0. Node emitted its experimental TypeScript-stripping warning. All fetches were in-memory substitutes.

## Finding QA-OS-01 — seeded Shipment draft resets or remains loading after origin change

**Classification:** demonstrated frontend defect; high confidence. **Suggested priority:** high because it interrupts ordinary Shipment creation and loses unsaved input. No Linear priority/status has been assigned.

**Related scenario:** OS-010. **Contract:** FRO-341 preserves valid drafts, clears/re-evaluates incompatible selections and makes lookup loading/error states usable.

### Reproduction

1. Enter Shipment creation through Start shipment on an eligible stocked Order, so the URL seeds the original origin and Order.
2. Type an Internal Note.
3. Change Origin warehouse to another whose candidate query is not already cached.
4. While the new candidate read is pending, the form disappears.
5. Resolve the candidate read: the form returns with the **original** warehouse and the note lost.
6. Separate case: change Origin country so the selected origin warehouse clears. The form disappears and remains loading; the empty-origin candidate query is disabled and cannot supply the data the route waits for.
7. Control: preload the second warehouse's candidates, then make the same warehouse change. The form remains mounted and the edited note survives.

Fixture service responses, query timing and routing are mocked; the real copied route, hook, form and rendering/mapping code execute. Unexpected GraphQL/fetch requests are blocked. No Shipment is submitted.

### Cause and source evidence

| Source | Evidence |
| --- | --- |
| [Origin candidate readiness guard](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipment-creation.ts#L261) | `entryLoaded` depends on the original seeded origin but the current origin query's data/error. A later uncached query makes the whole page not ready again. |
| [Route mount guard](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/shipments/new.tsx#L68) | `!creation.ready` replaces the form with a loading placeholder, discarding its component-held draft. |
| [Original initial draft](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipment-creation.ts#L269) | The initial draft ref stays the original entry seed, which the route uses again on remount. |
| [Candidate query](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipments.ts#L64) | Query key changes with warehouse; a blank warehouse disables the query. |
| [Form initialization and draft reporting](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/creation/shipment-creation-form.tsx#L94) | New mount uses initial draft values; the original form-held notes and other edits are gone. |

**Required outcome for a fix/regression test:** changing origin or geography leaves the draft usable; lookup loading/errors affect the selection area without resetting unrelated edits; cleared origin remains selectable; initial URL preselection does not overwrite later user choices. Preserve correct invalidation of incompatible cargo.

**Incident correlation:** the user confirmed on 9 November that the changed field was **Origin warehouse**, matching this trigger. No JavaScript exception was reproduced. This proves a reset/freeze defect and a matching reported trigger; the deployed SHA/console trace would still be needed to establish a literal exception or conclusively attribute the deployed incident. Destination-only changes are not established by this reproducer.

Evidence: [test source](../evidence/warehouse-reproduction.test.tsx), [test configuration](../evidence/warehouse-vitest.config.ts), [rerun instructions](../evidence/README.md).

## Finding QA-OS-02 — attachment refusal localized; real 401 cause unresolved

**Classification:** user-reported failure; client response path demonstrated; server/root cause unresolved. **Related scenarios:** OS-005/006. **Contract:** FRO-342 with FRO-335/341.

The actual sequence is file selection → open private creation context (`PUT`) → upload file bytes (`POST`) → GraphQL creation only after selected files are ready. Selecting a file initiates staging before pressing Create.

| Injected case | Observed in isolation |
| --- | --- |
| Context PUT returns 401 | Exact label `Refused: Request refused (401)`; no upload POST; no Order create call. Removing the rejected file unblocks the guard. |
| Upload POST returns 401 | Same label; context exists but file is rejected; no Order create call. Removal unblocks the guard. |
| Upload POST returns 403 | Refused label with 403, distinguished from the reported 401. |
| Fetch rejects | `Upload failed`, different from the reported refusal. |
| Staging succeeds | Ready file and selected pending-upload ID; Create permitted. |

The harness invokes a stubbed Create callback, not a backend write. Its success-case second invocation after file removal is **not evidence of duplicate Orders**; successful navigation is outside this harness.

### Established source facts

- [REST service](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/creation-uploads/creation-upload-service.ts#L50) adds `SecurityService.getAuthorizationHeaders()`, just as the [GraphQL executor](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/lib/graphql/executor.ts#L20) does. There is no established missing-bearer-header bug in this source.
- [Staging hook](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/creation-uploads/use-staged-files.ts#L41) opens the context, uploads, and turns 4xx responses into rejected files.
- [Order create guard](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/creation/purchase-order-creation-form.tsx#L113) blocks submission for uploading, failed or rejected selected files. Thus the reported staging refusal does not itself create a partial Order.
- [File presentation](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/creation/creation-documents.tsx#L35) displays Refused and its message. Retry is exposed for failed files, not rejected files. REST 401 does not use GraphQL's sign-in handling.
- [Security configuration](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/system/config/SecurityConfig.java#L38) requires the user role for both REST `/api/**` and `/graphql`. Staging additionally requires appropriate creation/edit authority; ordinary authority refusal is not equivalent to authentication failure.
- [Order creation transaction](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L346) performs creation and attachment association within one transaction. Same request identity recovers a successful attempt. Reloading into a wholly new draft is not proven safe recovery of an earlier unknown outcome.

### Hypotheses to distinguish, not confirmed causes

1. **If PUT succeeded and upload POST failed:** inspect the first backend/storage exception. [Disabled storage](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/system/storage/DisabledSystemFileStorageService.java#L13) throws if storage is unconfigured. [Staging storage call](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/creationuploads/service/CreationContextsApiService.java#L128) can propagate storage exceptions. A secured error dispatch could mask such a failure as 401, but this has **not** been reproduced through a real servlet container.
2. **If the context PUT itself failed:** compare deployed REST and GraphQL destinations and redirects. [Environment configuration](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/app/config/env.ts#L1) allows different API-base and GraphQL URLs. No live routing difference has been established.
3. Missing/invalid token or changed user state remains possible. No expiry-based diagnosis is justified by the inspected token implementation.

**Next minimal evidence:** existing failed request method/URL and timestamp; response body/status and redirect chain; whether an Authorization header was present (never its value); whether the GraphQL create mutation was sent; deployed frontend/backend commits; corresponding first backend exception and storage enabled/disabled state. If no trace exists, reproduce only in an authorized test run. Review disabled-storage/error-dispatch behavior in a real isolated servlet test.

**Test gaps:** client document tests mock the upload service; storage-failure backend tests check the thrown root exception, not the final servlet error-dispatch response. Those tests cannot establish deployed authentication or correct error presentation.

Evidence: [offline upload reproducer](../evidence/repro-upload-401.mjs), [rerun instructions](../evidence/README.md).

## Specification discrepancies and other observations

| ID | Finding | Treatment |
| --- | --- | --- |
| QA-OS-03 | Current FRO-336 still contains a post-create-upload sentence, while FRO-335 and FRO-342 explicitly require pre-create staging/atomic association. Current code implements staging. | Catalogue follows the explicit attachment-owning contract. Stale ticket wording needs a separately reviewed correction; it is not the cause of a 401. |
| QA-OS-04 | FRO-335 says to use a creation context even without selected files. Current Order form reads `staged.contextId()`, which is null before any file/context was opened. It still supplies a requestId. | Established narrow contract deviation, not proof of duplicate creation or the reported upload failure. Resolve the requirement/implementation discrepancy with its owner; retain OS-006 recovery checks. |
| Note #1 | Greece=Yes needs an explicit regime supported by the warehouse; older mock Orders may have none and correctly fail storage admission. | Possible reference-data/setup blocker; inspect actual warehouse capabilities and Order data before calling it a validation bug. Do not infer that all observed cases are correct. |
| Note #6 | Request readiness date has scheduled-record, pending-delivery, contact and calendar prerequisites beyond Pending status. | Need the actual disabled reason/history; status alone cannot establish a bug. |
| Note #8 | Current FRO-316 explicitly defines the overview next step for Preparing and Ready, and places arrival under Available actions. Current source provides arrival there. | Current placement is supported by that contract; moving it to the overview is a possible usability change, not an established omission from that ticket. |
| FRO-362 | Independent per-colli movement is Backlog. | Do not fail current partial selection merely because it still creates a child Order. |

These are review findings, not approved changes to business requirements or automatically filed tickets.

## Execution ledger

All full portal scenarios remain **Not run**. The code evidence is attached to the indicated cases; do not convert it into a browser Pass.

| Scenario | Portal outcome | Evidence / next requirement |
| --- | --- | --- |
| OS-001 | Not run | Full normal journey pending authorized mutation execution and known deployed builds. |
| OS-002 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-003 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-004 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-005 | Not run | QA-OS-02: injected-client behavior verified; real request/server evidence pending. |
| OS-006 | Not run | QA-OS-02: injected-client behavior verified; real request/server evidence pending. |
| OS-007 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-008 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-009 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-010 | Not run | QA-OS-01: isolated defect reproduced; deployed incident correlation pending. |
| OS-011 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-012 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-013 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-014 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-015 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-016 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-017 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-018 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-019 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-020 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-021 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-022 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-023 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-024 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-025 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |
| OS-026 | Not run | Expected outcome recorded in scenario catalogue; execution evidence pending. |

## Next review

1. Office review of the normal journey and its warehouse-versus-final-delivery outcomes.
2. The user confirmed Origin warehouse for note #7; correlate the deployed build/symptom with the reproduced defect and obtain method/log evidence for note #5.
3. Agree the authorized mutation environment and verify outbound scheduler/email/AADE settings before running the full portal suite.
4. Run OS-001 and P0 variations; record actual builds/roles/fixtures and failures individually.
5. Prepare focused bug tickets from evidence. Show complete drafts for approval before any Linear write. Implement fixes and regression tests only under separately authorized production-repository scope.

## Artifact validation receipt

Local validation found five Markdown documents, 26 unique scenario IDs including the main journey, complete Not run execution-ledger entries, no broken relative document/evidence links, and 25 pinned production-source links with existing files and valid numeric line references. Both isolated reproducers were rerun successfully as described above. The source main SHA was rechecked and remains unchanged. Planning-file whitespace checks passed. These checks validate the artifacts and narrow reproductions, not the complete application.
