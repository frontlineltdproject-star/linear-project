# Shipment Invoice review — 9 November 2026

## Scope, baseline and expected flow

The expected [flow](../flows/shipment-invoice.md) and [31 scenarios](../scenarios/shipment-invoice.md) were written before defect reproduction. Current full FRO-244, FRO-363, FRO-366 and FRO-301 were read (Done); FRO-371 is Backlog. FRO-244/363/366 had no comments. Current ShipmentInvoice bug searches did not identify a matching correction owner. No Linear issue was created or changed.

Normal journey: choose a non-cancelled Shipment and eligible goods → save an unnumbered draft → edit and acknowledge the current goods/document checks → finalize once, freezing contents and assigning one number → optionally cancel with a reason → explicitly create an unnumbered linked replacement. Discard is a separate terminal draft action. Drafts and finalized invoices protect Shipment cancellation.

Source: `Frontline-Forwarding/frontline-forwarding`, **main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`**, verified through authenticated gh before work and again at 14:49 Europe/Athens. Deployed revision is unverified. The pinned archive was reused only after confirming this same current SHA; it is not the historical backup. Production remained read-only.

Three explicitly requested parallel subagents covered creation, Details/lifecycle and backend rules. The parent traced shared adapters/consumers, challenged candidates, inspected evidence and independently reran all retained new evidence. The other chat owns Export/Customs and VAT-exemption paperwork. Allocation was inspected only as Shipment Invoice input. FRO-371 list/menu and FRO-244 future printing/PDF/discount controls are outside implemented scope and are not findings.

## Execution and limits

| Evidence | Result | What it establishes |
| --- | --- | --- |
| Existing focused frontend suite, `src/features/shipment-invoices` | **70/70 tests, 7 files passed**, 71.00 seconds | Existing component, host, mapping, selection and card controls under the reused dependency environment |
| New integrated creation evidence | **18/18: 14 controls, 4 observations** | Real Create host/form/mapping; service/router/provider boundaries mocked |
| New integrated Details evidence | **17/17: 11 controls, 6 observations** | Real Details host/editor/actions/mapping/form/QueryClient; service/router/options boundaries mocked |
| Parent combined rerun of the two new UI files | **35/35 passed**, 30.98 seconds, exit 0 | Independently reproduced the submitted evidence; same tests, not 35 additional tests |
| Parent backend rerun | **80 controls + 4 observations passed**, exit 0 | Actual extracted Java service/rules/evaluation/review/authorization/guard logic and records, with explicit stand-ins |
| Scratch frontend source integrity | **562/562 files match pinned archive** | Production source was not patched to make probes pass |

Observation tests assert the defective current behavior: their passing means the defect reproduced, not that the product meets the requirement. The 10 UI observation cases and four backend observations support eight distinct findings below. Controls are deliberately retained beside the observations.

Frontend environment: Node 24.13, Vitest 4.1.6, jsdom; cached dependencies reused through a junction, not a fresh lockfile install. TanStack Form core/react 1.32.0 was checked against the pinned lockfile for the replacement finding. Native fetch/XHR are blocked by new probes. The initial default config-loader attempt failed before tests with EPERM writing dependency-cache files; `--configLoader runner` and a scratch cache resolved the harness issue. Existing tests emitted React act warnings; the 35-test parent evidence run had no test failures.

Backend environment: installed JDK17, while the application targets Java25. The portable harness flattens packages/imports, supplies constructor injection and changes `List.getFirst()` to `get(0)` for compatibility. Repositories, JSON serialization, DI, clock and selected external entities are stand-ins. A 37-source hash manifest is retained in scratch. Network is blocked. Java SecurityManager deprecation warnings are from the harness. These are actual method checks, **not** the project backend test suite, real PostgreSQL, SQL locking/rollback, simultaneous requests, HTTP/GraphQL enforcement or end-to-end execution.

No deployed browser journey, mobile/CSS/keyboard audit, live portal/database writes, integration submissions or production branch occurred. No deployment claim is made. The source policy loader was attempted and failed because the archive has no Git metadata; relevant instructions/policies were read directly, with no successful loader fingerprint claimed. Existing presentation is reused; no canvas/preview is needed for this audit. No new domain term or architectural decision was resolved.

## Findings

Priorities below are recommendations for review, not accepted ticket metadata. Every finding is **demonstrated in isolation**, with any additional source-only link stated explicitly.

### QA-SHI-01 — Replacement defaults revert to the cancelled invoice (High)

**Requirement:** FRO-366 replacement starts with today's Athens date and clears currently invalid Client/company references, while keeping copied manual document facts.

**Reproduction:** open a cancelled synthetic invoice dated 02-11-2026. Replacement prefill clears Client/company because they are unavailable. Start replacement on 09-11-2026 and wait until Create draft is enabled. The UI restores 02-11-2026 and the original IDs 2/9, despite displaying the warning to choose the cleared Client again. Create submits those old values as well. Backend validation can then reject invalid references; with otherwise valid parties the old date can be saved. A real server save was not performed.

**Cause:** `use-invoice-editor.ts:45` keeps the original record as form defaults. `use-invoice-actions.ts:197` resets to prefill/today, but a subsequent form update reapplies the original untouched defaults. The host correctly supplies today at `shipment-invoice-details-page.tsx:263`; the defect is after that mapping. Actual TanStack Form 1.32.0 reset/update behavior was inspected. The control verifies replacement preparation creates nothing and cancelling it leaves the original intact.

**Evidence/ownership:** Details observation SHI-023. Details form state and submitted payload; proposed correction owner, no existing correction ticket assigned.

### QA-SHI-02 — Frozen goods disappear after their source row is deleted (High)

**Requirement:** FRO-244/366 finalized and cancelled records retain frozen declared goods independently of later source changes.

**Reproduction:** a finalized or cancelled invoice still returns complete frozen line values but the live `invoiceRowId` is null after source deletion. Details omits the line while retaining its EUR1,200 total. Both states reproduced. Backend service checks preserve frozen data after simulated FK nulling, and the output mapper exposes those values.

**Cause:** `shipment-invoice-mapping.ts:324` skips every line without a live source-row ID. V47 migration line 98 explicitly uses `ON DELETE SET NULL`; backend `web/shipmentinvoices/service/ShipmentInvoiceOutputs.java:143–149` returns the frozen row despite this null. This is UI history loss, not demonstrated deletion of the frozen database record. Actual source-row deletion/SQL was not executed.

The Order correction path `PurchaseOrdersApiService.java:643–650,791–796` can delete omitted source rows, but refuses row changes while the Order has open Shipment participation. This finding concerns later permitted source correction/deletion, not an assertion that staff can delete rows during an active participation.

**Evidence/ownership:** Details SHI-018 (two observations), backend frozen controls. Frozen line mapping/render identity; proposed correction owner.

### QA-SHI-03 — Changed allocation coverage can retain an old review (High)

**Requirement:** FRO-366 explicitly requires renewed review after relevant allocation coverage changes, even when values and eligibility remain valid.

**Reproduction:** review a row covering collis 11 and 12. Confirm it to colli 11 only, increasing allocation version while retaining its price and Shipment eligibility. The calculated fingerprint is unchanged. The actual service finalizes using the old stored acknowledgement with no fresh fingerprint supplied.

**Cause:** `ShipmentInvoiceEvaluations.java:51–58` hashes goods values and an eligible Boolean but omits allocation coverage/version. `ShipmentInvoiceService.java:195–211` therefore accepts the old matching review. Eligibility changes, source-description edits, row ordering and packing changes are correctly detected by separate controls. This does not claim all source changes bypass review.

**Evidence/ownership:** backend SHI-B01, two observations; SHI-014/016. Backend review fingerprint and finalization validation; proposed correction owner. Evaluation and service bodies ran with coherent synthetic goods/location inputs, not an actual database allocation transaction.

### QA-SHI-04 — An uncertain creation can become a second request (High)

**Requirement:** recover an unresolved create without silently declaring it unsaved or starting another independent attempt; the existing request identity provides replay protection. FRO-363 requires retained identity/recovery, and the implemented ADR0006 request contract binds replay to actor and payload.

**Reproduction:** inject a lost answer to Create. The form says “Draft was not saved” and unlocks. Editing Notes then retrying sends a new request ID for the same Shipment/rows. With an otherwise pristine incomplete form, leaving is also allowed; remounting generates a new ID for the identical payload. An unchanged retry in the same mount correctly reuses the first ID.

**Cause:** Create host `useRequestId`, lines 32–38, stores one payload-keyed identity only in a ref. Form lines 260–264 classify every rejection as definite failure; the leave guard, lines 185–192, knows pending/dirty but no unresolved result. Backend accepts intentional same-Shipment overlap and has no way to relate two different request IDs as one attempt.

**Evidence/ownership:** creation SHI-008/010, two observations; backend replay/actor/payload controls and service source trace. Proven outgoing IDs/payloads; two committed database invoices were **not** observed. Initial Create uncertainty/recovery; proposed correction owner. This finding does not claim the Details replacement path has the same uncertainty defect.

### QA-SHI-05 — Ineligible selected rows remain in the draft total (Medium)

**Requirement:** FRO-366 excludes unavailable rows from active totals while identifying them for resolution.

**Reproduction:** a saved draft has EUR10 and EUR20 rows. The EUR20 row becomes partly covered by the Shipment and is unavailable. Backend evaluation and actual saved-draft view still return EUR30 instead of the eligible EUR10. An integrated Details fixture corroborates that the supplied inflated total is displayed, with a review warning. Finalization correctly refuses the unavailable row.

**Cause:** `ShipmentInvoiceEvaluations.java:38–47` records the unavailable ID but continues adding its amount and currency whenever the row is still offered. Service lines 387/403 exposes that total; Details uses it. The narrower case matters: an entirely missing row is skipped correctly.

**Evidence/ownership:** backend SHI-B02 (two observations), Details SHI-006/015. Backend evaluation/draft totals, then UI/card consumers; proposed correction owner. Do not weaken finalization refusal.

### QA-SHI-06 — Refresh drops a still-eligible row moved to another Order (Medium)

**Requirement:** FRO-363/366 preserve still-eligible selections through refresh, using current source values.

**Reproduction:** row ID100 remains eligible on the same Shipment but is now offered under Order41 instead of Order40. Refresh deselects it, reports `40 / 100` as removed and submits no selected rows. Document fields survive. This is warned removal, not silent removal.

**Cause:** `create/selection.ts:31–43` searches only beneath the previous Order rather than following the stable row identity. Source reachability: the same Shipment carries collis of participating parent/child Orders; allocation confirmation narrows a group to the child's colli. `InvoiceRowAllocations.java:106–113` moves the same row to its sole holder; `ShipmentInvoiceGoodsReader.java:136–147` offers it under that participating holder. That database sequence was traced, not executed.

**Evidence/ownership:** creation SHI-007 observation plus allocation/reader source trace. Shared selection reconciliation; proposed correction owner. Details shares the helper, but this exact UI refresh sequence was reproduced on Create only. Allocation itself is not assigned new scope.

### QA-SHI-07 — Reconciled discard is displayed as Draft (Medium)

**Requirement:** FRO-366 resolves uncertain operations against authoritative state and shows accurate lifecycle/navigation.

**Reproduction:** injected discard commits to the synthetic service, then loses its answer. Check saved state retrieves DISCARDED. The UI shows Draft, removes actions and does not complete return navigation to Shipment. It sends no second discard. The ordinary successful-discard control navigates correctly.

**Cause:** `shipment-invoice-mapping.ts:311` maps DISCARDED to Draft. `details/use-invoice-actions.ts:225–243` adopts the returned record without remembering the successful discard destination. Existing Shipment navigation remains available; the document is not actually restored to an editable draft.

**Evidence/ownership:** Details SHI-020. Lifecycle mapping and discard reconciliation; proposed correction owner.

### QA-SHI-08 — Async navigation failures bypass saved-record recovery (Medium)

**Requirement:** FRO-363/366 preserve returned identity and permit opening it after navigation failure without another create.

**Reproduction:** Create succeeds with ID901, then a mocked router Promise rejects. The form stays locked without the saved identity/Open saved draft recovery. A synchronous throw correctly reveals recovery. The same promise-discard pattern on replacement hides the failure message, **but Open saved record still works there** and does not recreate the replacement.

**Cause:** host callbacks use `void navigate(...)` (Create lines 152–156; Details lines 285–295), while the form/action layer catches only synchronous exceptions. The Create case drives the priority; the replacement variant is a smaller message defect. Draft persistence itself is not lost.

**Evidence/ownership:** creation SHI-010 and Details SHI-025 observations. Host/router action contract; proposed correction owner. These are injected Promise failures; no real browser/router failure was observed.

## Accepted correction grouping and full drafts for review

The user reviewed all eight findings through simple examples, accepted **two correction groups**, and requested full drafts focused on current behavior with existing issues as references only. Both High priorities are retained in the proposed metadata. The [complete draft package](../../../drafts/shipment-invoice-bugs/README.md) contains two standalone descriptions, metadata, ownership and verification coverage. Final descriptions/metadata and Linear creation remain under review.

| Agreed group / draft title | Findings and required correction | Requirement references |
| --- | --- | --- |
| G1 — Shipment Invoice: correct creation, replacement and saved-action recovery | **QA-SHI-01:** retain prepared replacement date/cleared references and operator edits. **04:** retain and reconcile the original uncertain creation attempt across edits/departure/remount before independent creation. **07:** recognize authoritative Discarded and complete return navigation. **08:** handle asynchronous navigation failure using saved identity, including the smaller replacement-message variant. | FRO-244, FRO-363, FRO-366 |
| G2 — Shipment Invoice: preserve goods, totals and review after source changes | **QA-SHI-02:** render frozen lines independently of live source-row existence. **03:** invalidate review when relevant allocation coverage changes and reject stale finalization. **05:** exclude unavailable row values from active totals while preserving warnings/refusal. **06:** retain still-eligible row selections under their current Order. | FRO-244, FRO-363, FRO-366; FRO-301 for the consumed allocation contract |

G1/D1 owns preparation and action-result recovery from creation through replacement/discard. G2/D2 owns selected goods across live source changes, review, totals and frozen history. These are coherent business scopes, not a claim that all four findings in a group share one root cause or one small patch. Every finding retains separate reproduction/acceptance coverage. The high-priority defects in each group justify High for the group; the individual Medium classifications remain recorded above. No technical blocking dependency between the two groups was established. Selection preservation in G2 must still invalidate review for relevant allocation changes, and G1 must use current valid replacement selections rather than restore old ones.

**Reuse check, 9 November:** fresh full FRO-244/363/366/301 reads remain Done; FRO-371 remains Backlog and concerns the global list/menu only. Exact Shipment Invoice and shipment-invoices searches, broader recovery/frozen/allocation/fingerprint searches, and the complete current 13-issue FRO Bug list found no existing owner of these eight corrections. Plausible current owners were read fully: FRO-373/375/376 own ordinary Shipment/packing behavior; FRO-378/379 own Supplier Invoice; FRO-382 owns Delivery Note/AADE; FRO-384/385 own Export. Their scope is preserved. FRO-303 is a Delivery Note company-regrouping change; legacy FRO-17/101 are general invoice feature work. None should absorb this correction scope merely because its title mentions recovery or invoices.

Reuse the Done tickets as **requirement references**, preserving their descriptions and status. FRO-371, future printing/PDF/discount work, broader allocation changes, Export and VAT paperwork are not dependencies or additional scope. No existing ticket is reopened or modified. Existing Create/Details presentation contracts cover these corrections; no new design preview or production branch is proposed.

The source baseline was reverified unchanged at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; creation/replay, replacement/reconciliation, frozen output/schema, selection/evaluation and review consumers were re-read for the drafts. Current full requirement issues, comments, label/status catalogues and duplicate searches were refreshed. No application tests were rerun for drafting; the recorded isolated evidence and all execution limits remain unchanged. Each finding has one agreed draft owner below. D1 has eight criteria and D2 seven, each with a matching read-only post-deployment check. No Linear or production change.

## Impact and preserved behavior

| Consumer / area | Current result and source | Required outcome | Owner |
| --- | --- | --- | --- |
| Replacement prefill/editor | Correct host prefill overwritten by original defaults | Retain current date and cleared references through display/submission | QA-SHI-01 → D1 |
| Frozen Details | Backend preserves frozen rows; mapping drops null live IDs | Render every frozen line with stable document identity | QA-SHI-02 → D2 |
| Review/finalize | Value changes detected, eligible coverage changes omitted | Bind review to relevant allocation state | QA-SHI-03 → D2 |
| Initial creation identity | Unchanged replay works; edit/remount changes unresolved request | Reconcile the first attempt before independent creation | QA-SHI-04 → D1 |
| Evaluation, draft Details/card totals | Offered-ineligible values remain in total | Exclude unavailable values, preserve warning/finalize refusal | QA-SHI-05 → D2 |
| Shared refresh selection | Same row regrouped under another Order is removed | Preserve eligible row identity and correct current grouping | QA-SHI-06 → D2 |
| Discard reconciliation | DISCARDED is mapped as Draft | Accurate terminal result and recovered destination | QA-SHI-07 → D1 |
| Saved navigation | Async Promise is ignored | Identity/retry recovery reaches real async failures | QA-SHI-08 → D1 |
| Numbering/authorization/guards | Passing method controls; SQL/callers inspected | Preserve current guards, request binding, frozen records and one-live replacement | Existing FRO-244/301/366 contracts; no new defect assigned |
| Export/VAT/printing/global list | Separate chat or future tickets | No scope expansion | Other chat; FRO-244 future printing; FRO-371 |

Backend controls cover role matrices, actor/payload replay binding, stale versions, incomplete/unreviewed finalization, repeat-finalize refusal before numbering, freeze payloads, cancellation authority/reason/state, replacement links/replay/slot reuse, Shipment cancellation guards and confirmed goods-removal commands. Executed service call order is Shipment → invoice → sorted source rows → counter. The real counter uses a row lock; V47 has unique number/live-replacement constraints. **No real rollback or concurrency pass is claimed.**

Existing frontend and new integrated controls also preserve pending-write locks, dirty/conflicting edits, checked packing invalidation, unavailable refresh warnings, stale evaluation exclusion, cancellation recovery and unsaved replacement cancellation. The documented all-goods-leave confirmation branch is not a newly found guard bug. Live Client/company reference-label names on frozen records remain an unpromoted contract question; frozen party text itself is retained.

## Scenario execution register

Every complete portal scenario remains **Not run end-to-end**. This table records only the supported lower-level outcomes. An isolated failure does not mean all variants of its scenario fail.

| Scenarios | Isolated evidence / outcome | Remaining boundary |
| --- | --- | --- |
| SHI-001 | Existing host/card controls pass; route/authority source traced | Actual route/browser access |
| SHI-002–005 | New UI/backend controls pass | Real allocation/SQL and all combinations |
| SHI-006–007 | Controls pass plus QA-SHI-05/06 fail | Real allocation change and card refresh |
| SHI-008–010 | Controls pass plus QA-SHI-04/08 fail | Real lost HTTP response/router failure |
| SHI-011–013 | Integrated save/version/conflict/pending controls pass | Concurrent users and browser lifecycle |
| SHI-014 | Review controls pass; QA-SHI-03 fail | Actual allocation transaction and acknowledgement race |
| SHI-015 | Refresh/warning control passes; QA-SHI-05 fail | All deletion/unavailability variants |
| SHI-016 | Required/version/review method controls pass; QA-SHI-03 fail | Endpoint integration |
| SHI-017 | Repeated finalization and call-order controls pass | PostgreSQL rollback/number counter contention |
| SHI-018 | Backend frozen controls pass; QA-SHI-02 fail | Actual FK deletion/history rendering in browser |
| SHI-019 | Integrated uncertain-finalize recovery passes | Real response loss and transaction |
| SHI-020 | Normal discard/replay controls pass; QA-SHI-07 fail | Real discard response loss |
| SHI-021–022 | Reason/role/state/cancel recovery controls pass | HTTP authorization and response loss |
| SHI-023 | Unsaved/cancel control passes; QA-SHI-01 fail | Actual replacement validation/persistence |
| SHI-024 | Backend replay/one-live/discard/link controls pass | Concurrent SQL unique constraint and rollback |
| SHI-025 | Existing recovery controls plus QA-SHI-08 fail | Real replacement lost response/navigation |
| SHI-026–027 | Guard method controls pass; caller locks/ownership traced | Real concurrent Shipment mutations |
| SHI-028 | Actual authorization methods pass; adapters derive actor from current user | REST/GraphQL HTTP execution |
| SHI-029 | Existing card controls pass; totals reader source traced | Deployed card refresh |
| SHI-030 | Existing failure controls pass; no new visual claim | EN/EL, keyboard, 400px/browser layout |
| SHI-031 | Source/current ticket scope checked | No runtime test required for scope classification |

## Retained evidence and reproduction

- [Creation UI evidence](../evidence/shipment-invoice-create-qa.test.tsx), SHA256 `fdcf98734a5869f08f145a315a38dd9c36e7224a3fe6dc1aebfc4597222da435` (one trailing blank line removed after the rerun; executable code unchanged).
- [Details UI evidence](../evidence/shipment-invoice-details-qa.test.tsx), SHA256 `ca50a356852d729148748cd013763f2c4f5b8272813239db1c04ec6cd4a83188`.
- [Backend actual-source harness](../evidence/shipment-invoice-backend-qa.py); invoke with pinned repository root and optional `--java` / `--scratch`.

The UI evidence imports `./src`; copy it to an isolated client root as `shi-create-qa.test.tsx` and `shi-details-qa.test.tsx`. Use the unmodified pinned client source, jsdom and `#` alias to `src`, a scratch-local cache and one test worker. Run:

```text
node node_modules/vitest/vitest.mjs run src/features/shipment-invoices --config vitest.config.ts --configLoader runner
node node_modules/vitest/vitest.mjs run shi-create-qa.test.tsx shi-details-qa.test.tsx --config vitest.config.ts --configLoader runner
python docs/qa/evidence/shipment-invoice-backend-qa.py <pinned-repository-root> --scratch <isolated-output-folder>
```

Production references below are pinned; line numbers in findings use these files and the shared prefix stated in their sections:

- [Frontend Shipment Invoice sources](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipment-invoices).
- [Backend Shipment Invoice sources](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/shipmentinvoices).
- [Backend outputs](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipmentinvoices/service/ShipmentInvoiceOutputs.java#L143), [V47 schema](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/db/migration/V47__shipment_invoices.sql#L98).
- [FRO-244](https://linear.app/front-line-ltd/issue/FRO-244), [FRO-363](https://linear.app/front-line-ltd/issue/FRO-363), [FRO-366](https://linear.app/front-line-ltd/issue/FRO-366), [FRO-301](https://linear.app/front-line-ltd/issue/FRO-301), [FRO-371](https://linear.app/front-line-ltd/issue/FRO-371).

All eight findings have been discussed and assigned to the two approved groups. Complete drafts are ready for review; final descriptions/metadata, correction implementation and Linear publication are not approved by this audit. Existing issue ownership and future-work boundaries remain preserved.
