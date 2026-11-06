# FRO-366 verified frontend preparation

Published after the user’s go-ahead. See [publication record](fro366-frontend-publication.md) for the verified branch/head, post-commit checks and scoped acceptance of disclosed limitations. The preparation details below record the reviewed state before publication. No PR, route activation, backend change, deployment or Linear modification occurred.

## Scope and review artifacts

- [Full 25-file patch](fro366-frontend-preparation.patch), SHA-256 `b750990907e119fec3f3188de3cd13fe7bdb8f59ee6d6face26eb50980ef357c` (reverse-applicability checked against current worktree).
- [Exact file/provenance manifest](fro366-frontend-evidence/fro366-final-manifest.json).
- [Approved implementation plan](fro366-frontend-plan.md) and [ticket specification](fro244-details-edit-ui.md).
- [Desktop](fro366-frontend-evidence/desktop.png), [Greek mobile](fro366-frontend-evidence/mobile-el.png), [browser evidence](fro366-frontend-evidence/verification.json).
- Compiled local React preview: http://127.0.0.1:8777/?state=draft (this computer only). EN/EL and scenario controls are fixtures outside production source. Build/run harness is at the session root `fro366-review`; it uses existing frontend packages via a local junction. Temporary Playwright installation is at `fro366-browser`.
- The approved downloadable design HTML remains [index.html](../previews/shipment-invoice-details/index.html); it is separate from the real React implementation preview.

Production repository `Frontline-Forwarding/frontline-forwarding`; remote `github`; selected base `main` at `5774931b9869247f0247013111a452552403f456`. Refetch before handoff confirmed main unchanged. Isolated checkout: `C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b135-c052-7083-9f9f-7973a67b9301/fro366-frontend`.

Playbook: committed policy SHA-256 `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`. Planning/model and implementation/model checkpoints accepted. Native execution with one independent final reviewer. Both original review findings plus the follow-up mutation invalidation finding were reproduced with failing behavior tests, corrected and rechecked; reviewer confirmed no remaining actionable finding in the targeted fixes. Later replacement heading correction was tested and browser-verified.

## Delivered behavior

Saved Details and draft editing reuse FRO-363 fields, goods and confirmations. Saved values are not replaced by creation defaults. Frozen finalized/cancelled reads preserve supplied fields and selected values without edit/refresh controls. Document/party/goods/total/packing/notes cards are EN/EL responsive portal components.

Draft editing locks Shipment, preserves manual input across refresh, retains missing-row warnings, excludes unavailable rows and leaves new candidates unselected. Host-evaluated mixed currency blocks saving and suppresses a combined total. Incomplete drafts remain saveable. Explicit review acknowledgement carries the opaque source/document revision and is invalidated by relevant edits.

Finalization/discard/cancellation use separate confirmations and pending locks. Cancellation requires a reason. Replacement begins unsaved with todayAthens, copied fields, current eligible selection, a clear replacement heading and original link. Only explicit Create draft invokes persistence. Successful identities survive navigation failures. Conflicts preserve local work and require reload; uncertain mutations require reconciliation. Stale refresh/evaluation/retry results are ignored, and read transitions cannot silently make a pending mutation retryable.

## Dependency reconciliation

The full patch includes **12 unchanged FRO-363 files, 2 compatible shared extensions and 11 new FRO-366 files**. FRO-363 source is pinned to `230a90581aa85e611737add554b2b3c6f5912e0e`. No commit was cherry-picked and no other worktree was modified. Main does not yet contain those 14 dependency files. Prefer integrating FRO-363 first, then reconcile this patch to avoid duplicate delivery. Its published branch remains untouched.

The two shared extensions are document-fields (saved-reference labels / separate Notes) and goods (selected-only read mode / row identity). Existing create behavior stays default; all existing create tests passed. Action orchestration was separated into `details/use-invoice-actions.ts` for readability. There are no runtime fixture imports into operational feature code.

## Verification

Actual runtime Node 22.13.0; lockfile install pnpm 11.1.3. Intent discovery found seven packages, but no Form/component-local skill matched this unmounted UI work; no route/devtools scaffolding was added. Initial root-directory install failed for lack of package.json, then succeeded from client without changing dependencies/lockfile. Cached Node was used directly after npx/default-pool runs stalled; successful runs used Vitest threads with two workers.

| Check | Final result |
| --- | --- |
| Full client suite (`vitest run --maxWorkers=2 --pool=threads`) | **281 tests pass, 47 files**; includes 32 Details tests and 23 existing create/selection tests. Baseline with FRO-363 was 249 tests. |
| App Vite build | Pass; existing large-chunk warning remains. |
| Isolated actual-feature Vite build | Pass; compiled bundle used for browser checks. |
| TypeScript `tsc --noEmit` | Only the two baseline TS2352 errors in `src/features/shipments/services/delivery-note-service.test.ts:134` and `:138`; no FRO-366 errors. |
| Feature Prettier check | Pass. |
| Whole-project formatting | Existing failures remain; see full log. No waiver inferred from other tickets. |
| Whitespace / full patch | All 25 files checked; patch reverse-check passes. Generated route-tree line-ending churn restored; no route diff. |
| Browser | **72 EN/EL × 1440/400px × 18 scenarios**, zero console/page errors, failed requests, external requests or page overflow. |
| Browser journeys | Dirty cancel keep/discard; refresh retention; mixed save block; conflict copying/reload cancellation; finalization cancellation/confirmation; reason-required cancellation; replacement identity; create success to Details. |
| Documentation | Feature README links resolve; dependency, UI callback contracts, failure/retry/read rules and activation blockers documented. No schema/GraphQL changes, so no generation applicable. |

Development-server browser attempts were invalidated by HMR/optimizer-aborted requests; these were not counted as passing. The final run used a compiled static review bundle and network-idle navigation and passed with zero failures. Browser fixtures prove frontend behavior, not live authorization, allocations, totals, persisted review, number issuance or concurrency.

## Integration and publication gates

FRO-244/FRO-301 must supply authorized current/frozen reads, eligibility, exact totals, versioned mutations, persisted state-bound review and safe retries. Resolve the real allocation interface and navigation routes before activation. The feature is deliberately unmounted; no guessed APIs, authorities, routes or financial computations were added. The full interface and component map are in `frontline-forwarding-client/src/features/shipment-invoices/details/README.md`.

Proposed branch: **`mock/fro-366-shipment-invoice-details`**. Remote name is unused. Complete reviewed patch above must be explicitly approved before branch creation/commit/push. Proposed publication, only after approval and blockers are resolved/explicitly accepted for FRO-366:

```powershell
git switch -c mock/fro-366-shipment-invoice-details
git add -- <the 25 exact manifest paths>
git commit -m "feat(FRO-366): prepare shipment invoice details UI"
git push -u github HEAD:refs/heads/mock/fro-366-shipment-invoice-details
```

GitHub branch-rules read still returns HTTP 403: upgrade to GitHub Pro or make repository public. Required enforcement cannot be verified, so publication remains blocked absent a ticket-specific explicit exception or verified enforcement. Existing type/whole-project formatting failures also need resolution or explicit acceptance before publishing. Exceptions granted for other tickets do not apply. No PR or deployment is proposed.

Linear FRO-366 remains the approved Backlog/Pending_Review ticket with four resources; implementation preparation did not authorize metadata changes.

## File inventory

| Path below src/features/shipment-invoices | Provenance |
| --- | --- |
| `components/shipment-invoice-confirmations.tsx` | FRO-363 unchanged |
| `components/shipment-invoice-create-form.test.tsx` | FRO-363 unchanged |
| `components/shipment-invoice-create-form.tsx` | FRO-363 unchanged |
| `components/shipment-invoice-details.test.tsx` | new FRO-366 |
| `components/shipment-invoice-details.tsx` | new FRO-366 |
| `components/shipment-invoice-document-fields.tsx` | FRO-363 extended |
| `components/shipment-invoice-goods.tsx` | FRO-363 extended |
| `components/shipment-invoice-lifecycle-dialog.tsx` | new FRO-366 |
| `components/shipment-invoice-readonly.tsx` | new FRO-366 |
| `components/shipment-invoice-review.tsx` | new FRO-366 |
| `components/shipment-invoice-shipment-picker.tsx` | FRO-363 unchanged |
| `create/__fixtures__/shipment-invoice-create.ts` | FRO-363 unchanged |
| `create/defaults.ts` | FRO-363 unchanged |
| `create/labels.ts` | FRO-363 unchanged |
| `create/README.md` | FRO-363 unchanged |
| `create/selection.test.ts` | FRO-363 unchanged |
| `create/selection.ts` | FRO-363 unchanged |
| `create/types.ts` | FRO-363 unchanged |
| `create/use-draft-guards.ts` | FRO-363 unchanged |
| `details/__fixtures__/shipment-invoice-details.ts` | new FRO-366 |
| `details/labels.ts` | new FRO-366 |
| `details/README.md` | new FRO-366 |
| `details/types.ts` | new FRO-366 |
| `details/use-invoice-actions.ts` | new FRO-366 |
| `details/use-invoice-editor.ts` | new FRO-366 |
