# Supplier Invoice review — 9 November 2026

## Scope and provenance

User-approved scope: map the expected Supplier Invoice flow first, then review current tickets and code for bugs as with Order-to-arrival. [FLOW-SI](../flows/supplier-invoice.md) was saved before the independent defect investigations; [28 scenarios](../scenarios/supplier-invoice.md) cover the normal journey and boundary cases.

- Production repository `Frontline-Forwarding/frontline-forwarding`, branch `main`, commit `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, source version 0.0.13. Authenticated gh access and SHA rechecked at start; source archive came from this commit during the preceding review and is not an old business backup.
- Portal/backend deployment version was not verified. No production portal/API/database writes, emails, fiscal submissions or source changes. No Linear issue creation/edit.
- Planning repository pulled with --ff-only before work. Existing FRO-326 drafts, other patches and .wrangler are unrelated and preserved.
- Production policy loader attempted `start --issue supplier-invoice-flow-qa` and failed because the downloaded archive has no Git metadata. Root/app instructions, playbook recovery, domain and shared workflow/testing/documentation policies read directly. **No successful policy snapshot, policy state or SHA-256 loader fingerprint is claimed.**
- Frontend scratch copy: all 562 existing client source files match the pinned archive byte-for-byte. Additional observation tests do not alter product source. Local dependency reuse is not a clean lockfile install or proof of a deployed bundle.
- Runtime: Node v24.13.0 / Vitest 4.1.6. Repository requests Node 22.13+; Java 11 is available versus backend Java 25. No full backend/PostgreSQL integration suite or complete browser journey is claimed.
- Review reuses the existing UI contracts; no canvas/preview or production-source branch is needed. No new architecture decision; the existing Supplier Invoice meaning was added to the planning glossary.

## Current requirement baseline

Current full issue descriptions fetched 9 November 2026. Older “not implemented” Context for agents paragraphs refer to an earlier source revision; current main contains Supplier Invoice code.

| Ticket | Status | Last updated (UTC) | Scope |
| --- | --- | --- | --- |
| [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules) | Done | 2026-11-06T15:55:25.359Z | Supplier Invoice — entity, relationships & VAT exemption rules |
| [FRO-347](https://linear.app/front-line-ltd/issue/FRO-347/supplier-invoice-create-page-ui) | Done | 2026-11-06T15:55:25.605Z | Supplier Invoice — Create page UI |
| [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348/supplier-invoice-details-page-ui) | Done | 2026-11-06T15:55:20.681Z | Supplier Invoice — Details page UI |
| [FRO-349](https://linear.app/front-line-ltd/issue/FRO-349/order-details-create-supplier-invoice-from-order-details) | Done | 2026-11-05T22:43:30.559Z | Order Details — Create supplier invoice from Order Details |
| [FRO-356](https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location) | Done | 2026-11-06T15:55:25.717Z | Order & Warehouse — separate customs regime from physical location |
| [FRO-318](https://linear.app/front-line-ltd/issue/FRO-318/show-whether-each-order-has-a-supplier-invoice-in-the-database) | Backlog | 2026-10-24T10:49:53.478Z | Show whether each Order has a supplier invoice in the database |

FRO-318's separate presence indicator remains pending. Absence of that planned UI is not a newly discovered defect. Export/Customs Storage Entry owners are boundary references, not a claim of full downstream-flow audit.

## Verification and limits

| Check | Result | Interpretation |
| --- | --- | --- |
| Existing Supplier Invoice frontend tests | 71 tests / 9 files passed, 80.71 s | Actual run of existing creation/draft/details/service/export-presentation/localization tests; does not cover all scenarios. |
| Isolated dependency-cache startup | First sandbox run failed EPERM; escalated local rerun passed | Tooling access issue, not an application finding. |
| Source-copy integrity | 562/562 existing client files identical | Tests use the inspected source, with separately added evidence files. |
| New creation observation tests | Parent rerun 4/4 passed, 9.56 s | Actual controller/store/hooks with mocked service/navigation; passing reproduces QA-SI-01–03. |
| New Details observation/control tests | Parent rerun 9/9 passed, 13.13 s | Actual page with mocked service/router/auth; passing reproduces QA-SI-04–06 and verifies controls. |
| Extracted Java evidence | Parent rerun 7 checks passed | Actual comparison methods/branch with synthetic stand-ins; QA-SI-07, not full service/SQL execution. |
| Full portal scenarios SI-001–028 | Not run | Source/isolated evidence only. |
| Full backend integration/database tests | Not run | Available Java 11 does not meet Java 25 project requirement; extracted-rule observations must state their boundary. |

## Findings

### QA-SI-01 — A replacement draft can lose an unresolved creation and send its file to the old invoice

**Classification:** demonstrated in isolated frontend execution. **Contract:** FRO-347/349. **Scenarios:** SI-012/013/026.

Start invoice A with a file, submit, then leave and open creation from another Order. “Discard and start” resets even a pending/unknown attempt. If A's response arrives after draft B has files, A's completion reads B's queue and sends B's file to A's saved invoice. Separate reproduction shows an unknown attempt can simply be forgotten and a new request started. The replacement draft was never submitted in the wrong-owner-file case.

Root: [replacement handling](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-create-page.tsx#L205) and [unconditional reset](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-create-page.tsx#L543) allow replacement; [late completion and global queue read](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-create-page.tsx#L321) are not scoped to the originating draft/attempt. Expected: preserve/reconcile unresolved work and keep every upload tied to its own invoice attempt.

**Evidence:** two isolated actual-controller reproductions, parent rerun. Proven outgoing upload call contains the replacement File object/key and the old saved invoice ID. Real storage/database persistence was mocked; no live cross-invoice file placement was performed.

### QA-SI-02 — A late lookup from a cancelled page changes the newer draft's Order

**Classification:** demonstrated in isolated frontend execution. **Contract:** FRO-347/349. **Scenarios:** SI-010/027.

Open creation from A with its Order lookup delayed. Cancel and open creation from B, then type invoice facts. When A's lookup finishes, selected Order silently becomes A while B's origin and typed invoice facts remain.

Root: [selection token and global draft write](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-create-page.tsx#L174) guard only that mounted instance; [Cancel reset](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-create-page.tsx#L409) does not invalidate its pending callback. Expected: cancelled/unmounted draft work must not change a later selection.

**Evidence:** actual controller/query hook and store; mocked delayed lookup, no create/upload call. Parent rerun confirms wrong selection, not an actual wrong-Order invoice save.

### QA-SI-03 — Failed return navigation erases the confirmed saved-invoice result

**Classification:** demonstrated in isolated frontend execution. **Contract:** FRO-347/349. **Scenarios:** SI-014.

Create successfully, then choose Return to Order and inject failed navigation. The saved invoice ID, original attempt and result screen disappear; a fresh Create action returns. The saved invoice itself was not rolled back.

Root: [finish before navigation settles](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-create-page.tsx#L427) resets the store before awaiting/successfully completing navigation. Expected: retain confirmed success and recovery information if returning fails.

**Evidence:** actual controller with rejected navigation promise, independently rerun. Real router failure UI and any second server creation remain untested; no duplicate record is claimed from this test alone.

### QA-SI-04 — Closing an unresolved cancellation forgets the action and removes protection

**Classification:** demonstrated in isolated frontend execution. **Contract:** FRO-321/348. **Scenarios:** SI-018/020.

Confirm cancellation and lose its response. The dialog offers Check original attempt. Closing it through Cancel/close/Escape resets the outcome to idle; the tested Cancel path removes recovery and unload/navigation protection, then allows a new correction request without a result check. While cancellation is still pending, navigation/unload protection is also absent.

Root: [dirty guard excludes pending cancellation](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx#L244), [card busy state ignores cancellation](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx#L1054) and [dialog close resets unknown](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx#L1065). Expected: closing a dialog must not classify an uncertain server mutation as resolved.

**Evidence:** two actual-page observation tests, including registered blocker predicates. Parent rerun. Backend eligibility/version guards were not bypassed; the demonstrated issue is lost recovery and an inappropriate subsequent request.

### QA-SI-05 — Cancellation uses a newer unreviewed version after refresh

**Classification:** demonstrated in isolated frontend execution. **Contract:** FRO-321/348. **Scenarios:** SI-017/020.

Open Cancel invoice at version 3 with synthetic net 100.00. Another operator changes it to net 900.00/version 4 while the confirmation is open. Confirm submits version 4 without renewed review, so the server's stale-version guard cannot detect that intervening change.

Root: [open dialog captures no version](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx#L918) and [Confirm reads latest invoice.version](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx#L388). Expected: carry the reviewed precondition or require renewed review. The existing cancellation contract explicitly requires the read version.

**Evidence:** actual rendered refetch and outgoing cancel call, parent rerun. A control proves refreshed non-cancellable protection disables Confirm; no Export/event guard bypass is alleged. The amounts are synthetic fixtures, not production data.

### QA-SI-06 — Typing accepted during a save is discarded when the earlier save completes

**Classification:** demonstrated in isolated frontend execution. **Contract:** FRO-321/348. **Scenarios:** SI-016/018.

Change invoice number to SENT and press Save. While the slow save is pending, the still-enabled field accepts LATER. When the original SENT save succeeds, the editor closes and LATER disappears. The same loss occurs after an unknown response when checking the original attempt succeeds.

Root: [editable pending field](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx#L573) accepts later input, while [save completion](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx#L334) and checkSave close the entire editor. Expected: do not silently discard newly accepted draft input; prevent incompatible editing or preserve the later draft without submitting it automatically.

**Evidence:** two actual-page tests and parent rerun. The original SENT payload is correct; this is unsent local draft loss, not a claim that the server saved the later value.


### QA-SI-07 — Different vessels with the same name are treated as the same saved reference

**Classification:** exact extracted Java execution plus persistence/schema trace; full backend execution pending. **Contract:** FRO-321/348. **Scenario:** SI-028.

An active invoice points to vessel 101. Change it to another eligible vessel 102 with the same display name. The service compares names, decides nothing changed and returns the old vessel. If Invoice number also changes, all submitted facts proceed to persistence, but the activity omits the vessel correction.

Root: [name comparison](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/supplierinvoices/SupplierInvoiceService.java#L264), [early return and update](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/supplierinvoices/SupplierInvoiceService.java#L139) and [vessel FK write](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/supplierinvoices/SupplierInvoiceRepository.java#L238). Expected: reference identity determines whether a reference changed; display text alone cannot establish equality.

Reachability: [vessel schema](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql#L76) does not require unique names; [shared Client associations](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/db/migration/V18__shared_client_vessels.sql#L1) preserve IDs rather than merging names. [existing-vessel updates](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/vessels/VesselRepository.java#L137) permit distinct associated IDs to share a name.

**Evidence:** parent independently ran [the portable reproducer](../evidence/supplier-invoice-backend-qa-repro.py): seven checks passed, including two defect observations, no-op/different-name/clear controls, distinct fixture IDs and network guard. Exact methods/no-op branch are unchanged; DTO/vessel lookups and a persistence-continuation sentinel substitute for full service/database execution. Combined-change persistence is source-traced, not a runtime SQL result. Service SHA-256: `b5a09946d761a2376736af3d9be5510800caca85835a1cdf4e8c0a2b9bf45466`.

## Resolved business-rule clarification — SI-Q01

**User decision, 9 November 2026:** allow a full explicit split as an exception to the general Order-cancellation guard. If every remaining movable colli moves to a child, the original Order may become Cancelled while its Supplier Invoice remains active. Preserve invoice ID, facts, files, history and parent ownership; flag explicit permitted reassignment. No automatic invoice movement/copy/cancellation, and no waiver of existing reassignment protections.

This matches deliberate [workflow behavior](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/supplier-invoices.md#L162), [full-split cancellation](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L1626) and [existing integration test](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/test/java/com/frontline/forwarding/web/supplierinvoices/SupplierInvoiceOrderIntegrationApiTests.java#L145). The integration test was read, not run.

FRO-321's blanket “Block Order cancellation while active Supplier Invoices remain linked” needs this explicit exception in a separately reviewed wording update. Pending FRO-362 does not establish activation of its future model. **SI-Q01 is resolved and is not an eighth bug.** No existing Linear description was changed.

## Findings and scenario index

| Finding | Plain-language impact | Scenarios | Evidence |
| --- | --- | --- | --- |
| QA-SI-01 | Unresolved creation replaced; a late response can send a newer draft's file to the old invoice | SI-012/013/026 | 2 isolated controller observations |
| QA-SI-02 | A cancelled page's lookup changes the next draft's Order | SI-010/027 | 1 isolated controller observation |
| QA-SI-03 | Failed return loses the already-saved result | SI-014 | 1 isolated controller observation |
| QA-SI-04 | Closing an unknown cancellation loses recovery; pending navigation is unprotected | SI-018/020 | 2 isolated Details observations |
| QA-SI-05 | Cancel confirmation adopts a newer unreviewed version | SI-017/020 | 1 isolated Details observation and protected-state control |
| QA-SI-06 | Later typing disappears when an earlier correction finishes | SI-016/018 | 2 isolated Details observations |
| QA-SI-07 | Same-name vessel identity correction is ignored or omitted from activity | SI-028 | Extracted Java plus source trace |

Seven findings are covered by the three accepted groups below, now created and verified as FRO-378–FRO-380 with Flow QA. Before creation, the Bug + “supplier invoice” duplicate search returned only FRO-375, whose approved scope is Order/Shipment rather than these Supplier Invoice paths.

## Accepted ticket grouping — created tickets

**Publication update:** the user subsequently approved the complete descriptions, proposed priorities/labels and Linear creation. The three tickets are created and verified; current status and links are in [the approved package](../../../drafts/supplier-invoice-bugs/README.md).

After reviewing all seven examples individually, the user accepted these three groups on 9 November 2026. Each finding retains its own reproduction and acceptance checks. G1 → FRO-378 (High); G2 → FRO-379 (High); G3 → FRO-380 (Medium). All are Backlog with Story, Bug, Pending_Review, Flow QA and the approved Area/entity labels.

| Group | Accepted scope | Findings | Why together / implementation owner |
| --- | --- | --- | --- |
| G1 — Supplier Invoice creation: preserve the correct Order, files and saved result | Keep unresolved creation attempts protected; prevent replacement-draft files from targeting an earlier invoice; ignore lookups from cancelled forms; retain confirmed creation when return navigation fails. | QA-SI-01, QA-SI-02, QA-SI-03 | Shared creation controller and draft lifecycle; Frontend. Existing contracts: FRO-347/FRO-349, consuming FRO-321. |
| G2 — Supplier Invoice Details: protect edits and cancellation while requests are unresolved | Preserve pending/unknown cancellation protection and recovery after closing its dialog; keep cancellation tied to the reviewed version; preserve later typing when a save or original-attempt check completes. | QA-SI-04, QA-SI-05, QA-SI-06 | Saved Details operation handling, reviewed state and draft retention; Frontend. Existing contracts: FRO-348/FRO-321. |
| G3 — Supplier Invoice vessel correction: compare identity and record history | Save a change between different eligible same-name vessel records; include the vessel change in activity even when other facts change in the same save. | QA-SI-07 | Independent backend reference comparison and audit behavior; Backend. Existing contracts: FRO-321/FRO-348. |

G1's wrong-invoice upload risk remains prominent even though two related creation failures share its ticket. G2 groups work in one Details interaction area; this does not assert that all three symptoms have one root cause. G3 remains independently fixable and testable. Each grouped ticket needs every listed case verified before completion; grouping must not reduce coverage. Suggested implementation order: G1, G2, G3. Saved metadata was verified against the approved package.

Fresh grouping checks on 9 November 2026: production main remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; full current FRO-321/347/348/349 descriptions are unchanged from this review. Supplier Invoice and same-name searches found no exact new bug ticket; FRO-375 was re-read and remains scoped to Order/Shipment saves and comment retries. Proposed Supplier Invoice groups do not expand that existing ticket. Reuse Flow QA if the later drafts are approved for creation.

SI-Q01 remains the accepted full-split exception, outside these bug groups. Its FRO-321 wording alignment can be a separately reviewed edit to that existing specification; it does not require another bug ticket. Existing UI contracts cover the intended presentation, so no new canvas/preview or production branch is proposed. No source fix, Linear write or new test execution occurred during grouping.


## Consumer trace

| Consumer | Reviewed contract / boundary | Owner |
| --- | --- | --- |
| Order Details action and shared Create | Persisted Order preselection, draft protection, separate actual versus return Order | FRO-349/347; entry component in supplier-invoices/components/order-supplier-invoices.tsx |
| Creation controller/draft | Type/source validation, request identity, local files and confirmed/unknown result | FRO-347/321 |
| Saved Details/card corrections | Reviewed version, one editor, source relationships and uncertain outcome | FRO-348/321 |
| Invoice rules/repository/Order guard | Duplicates, exact money, source consistency, cancellation and atomic activity | FRO-321; regime owner FRO-356 |
| Files service and adapters | Staff view/edit checks, invoice FK ownership, active-invoice upload, stable client file key and same-owner downloads | FRO-321/347 |
| Active Export and admission links | Preserve existing correction/cancellation protection; distinguish unavailable/error/absence | Boundary with FRO-317/319; full progression deferred |
| Separate invoice-presence UI | Source relationship remains accurate; no pending indicator assumed delivered | FRO-318 Backlog |

## Controls and unresolved coverage

- File API source traces require staff identity plus view/edit authority, lock the invoice during upload/cancellation coordination, enforce invoice-owned download lookup and retain downloads after cancellation. Existing backend tests cover these cases but were **read, not executed**.
- Upload retry uses the same per-file key and existing saved metadata; the UI contract promises same-file retry, not arbitrary replacement under a reused key. No changed-bytes attack or normal-flow defect is asserted from that alone.
- Exact money, number normalization, no pre-save upload, ordinary initial exemption states and simple stale/version paths have existing frontend coverage. Backend transaction/locking guarantees require database execution before certification.
- No exhaustive-bug-free claim. Full authenticated browser flows, backend integration and actual file-storage HTTP behavior remain unverified.
- Details controls ruled out ordinary stale-correction and unrelated-writer false-success suspects: Save retains the captured version; recovery compares submitted facts rather than only a version increment. Refreshed non-cancellable state disables Confirm. These controls do not resolve the separately demonstrated cancellation-version and recovery-loss defects.
