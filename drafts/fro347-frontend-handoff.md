# FRO-347 — verified frontend preparation

Prepared the approved **partial, unconnected React presentation**. FRO-347 is
not fully implemented, routed or ready for production. The reviewed diff is now
committed and pushed on the approved branch after explicit authorization; no PR,
deployment or Linear mutation occurred.

## Complete diff

- [Complete seven-file patch](fro347-frontend-preparation.patch): **1,015 added
  lines**, no existing production file changed.
- Patch SHA-256:
  `34621bb5f156cdc14fd3fce339b3c13a46bc9945a97e780615f6213642b06e16`.
- Repository: `Frontline-Forwarding/frontline-forwarding`.
- Base:
  `3820e89e8caa341261e2d48bcb282d93e1bb1d03` (`github/main`, refreshed after checks).
- Checkout:
  `C:/Users/Giorgos/.codex/visualizations/2026/10/23/01a16833-e860-7a01-98a1-e7bbe7859984/fro347-frontend`.
- Local branch, created under explicit approval:
  `mock/fro-347-supplier-invoice-create`.
- Local commit: `ac539a93f3e3884b70de5e57dfc83563aa2346db` —
  `feat(FRO-347): prepare supplier invoice create UI`.
- Published branch: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-347-supplier-invoice-create . No PR or deployment.

All paths below are under
`frontline-forwarding-client/src/features/supplier-invoices/`.

| File | Change |
| --- | --- |
| `components/supplier-invoice-create-layout.tsx` | Actual Card/TopBar/Tabs composition, locally completed keyboard tab focus, controlled labelled-field slots, approved field order, comfortable responsive spacing. |
| `components/supplier-invoice-document-queue.tsx` | Actual Card/Button/Alert/StatusPill presentation; selected File forwarding; stable row keys; optional applicable Download/Remove/Retry/Check callbacks; busy handling. No validation, byte storage or upload. |
| `components/supplier-invoice-creation-result.tsx` | Distinct supplied unknown/confirmed result; original-attempt check; confirmed ID and actual/originating Order labels; supplied document display and explicit next action. |
| `components/supplier-invoice-create-ui.test.tsx` | Seven behavior tests for layout, controlled text/file selection, locale/tab changes, keyboard focus, queue callbacks and result distinctions. |
| `localization/supplier-invoice-create-labels.ts` | Typed EN/EL presentation copy through existing locale provider. |
| `localization/supplier-invoice-create-labels.test.ts` | Complete nonempty matching locale keys and distinct Greek result/action copy. |
| `README.md` | Component mapping, controller responsibilities, unavailable contracts and verification limits. |

No route, navigation item, fixture service, backend file, authority, generated
contract, package manifest, lockfile, infrastructure or deployment file changed.
The temporary harness lives outside the production checkout. It renders the
actual components with sanitized field slots/callbacks; it is not a portal route.

## Verification

Runtime: Node **22.13.0**, npm 11.6.2. Native execution and both required model
checkpoints were explicitly approved. Resumed the existing policy snapshot:
committed state; HEAD as above; policy SHA-256
`b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`.

| Check | Observed result |
| --- | --- |
| `npm ci` before source changes | Fails: committed manifest/lock mismatch, including missing Floating UI, GraphQL/codegen and tailwind-merge entries. |
| `npm install --package-lock=false --no-audit --no-fund` | Local dependency preparation succeeds; manifest/lock unchanged. Exact locked reproducibility remains blocked. |
| `npx --yes @tanstack/intent@latest list` after install | Eight intent-enabled packages, 28 skills. No relevant React/Form presentation skill; this slice adds no router work. Two devtools-event-client variants reported. No dependency declarations changed. |
| Pre-change suite: `npm run test -- --maxWorkers=2` | **39 files / 163 tests pass**. Initial sandbox run failed before tests with EPERM cache renames; elevated rerun passed. |
| Behavioral Red: `npm run test -- src/features/supplier-invoices --maxWorkers=2` | **Eight expected assertion failures** against compiling empty component shells; no missing-module/compilation failure used as Red. |
| Focused Green, same command | **Two files / eight tests pass**. One test setup issue involving a detached container was corrected. |
| Final full suite: `npm run test -- --maxWorkers=2` | **41 files / 171 tests pass**, exit 0. |
| `npm run build` | Baseline and final build pass; final 2.71s. The unconnected components are separately compiled/exercised by tests and the Vite browser harness. |
| `npx prettier --check src/features/supplier-invoices` | All seven new files pass. |
| `npm run format:check` | Existing **270 files** fail at the unchanged committed base. Initial concurrent baseline build had temporarily regenerated route ordering, so its first format count was 269; final route file hash exactly matches HEAD and the stable count is 270. |
| `npx tsc --noEmit` | Only the same two baseline TS2352 casts in `src/features/shipments/services/delivery-note-service.test.ts:77,81`. No Supplier Invoice diagnostic. |
| Diff/whitespace audit | Only the seven intended untracked frontend files; tracked diff/index empty; new-file whitespace checks pass. Complete patch passes `git apply --check --reverse`. |
| Fresh main fetch | `github/main` remains `3820e89e8caa341261e2d48bcb282d93e1bb1d03`; no rebase required. |

No lint script exists. GraphQL documents did not change; codegen is not applicable.
Build-generated route ordering was restored to the original committed content.

## Browser evidence

Actual React components ran in a temporary local Vite harness, without a live
API, authentication or business-data connection. EN/EL and desktop/~400px were
checked. A 1100px viewport produces two columns; desktop produces four; 400px
produces one in the agreed reading order. Browser scrollbar reduces content
width by approximately 15px; content scroll width equals its viewport width.

- Exact invoice number `0010/B` and amount `99999999999999999.99` survive tab and
  language changes; no Number conversion is introduced.
- Arrow activation moves focus and selection, with one tab in the Tab sequence.
- Default, loading, error and empty content render through supplied slots. Busy
  document operations and form-action fixtures are disabled; tabs remain usable.
- Long Greek labels, invoice type, filename, failure text and upload status wrap
  at 400px without horizontal page overflow or hidden actions.
- Unknown creation exposes original-attempt checking only; no saved ID, Create
  or Start another action appears.
- Saved presentation keeps ID 42, actual Order FL-FIXTURE-002 and originating
  Order FL-FIXTURE-001 distinct. Failed Retry and unknown Check invoke different
  supplied callbacks with keys `f`/`u` and the retained fixture owner 42.
- Fresh final browser session reports **zero console errors/warnings**. An earlier
  harness-only hot update produced a duplicate-createRoot warning; a fresh
  session after setup correction was clean. No claim of live network integration.
- Agent-created browser tabs were closed and viewport override reset after QA.

| Evidence | Screenshot |
| --- | --- |
| Desktop EN Overview | [desktop-en.jpg](fro347-evidence/desktop-en.jpg) |
| Greek 400px Overview, full page | [mobile-el-overview.jpg](fro347-evidence/mobile-el-overview.jpg) |
| Greek 400px Documents | [mobile-el-documents.jpg](fro347-evidence/mobile-el-documents.jpg) |
| Greek unknown creation | [mobile-el-unknown.jpg](fro347-evidence/mobile-el-unknown.jpg) |
| Greek confirmed result and partial/unknown files | [mobile-el-saved.jpg](fro347-evidence/mobile-el-saved.jpg) |

## Blockers and remaining work

| Area | Finding / next dependency |
| --- | --- |
| FRO-321 | No Supplier Invoice entity, create/read operations, staff authority, exact decimal transport, original-attempt/retry/concurrency contract or invoice-owned file/reconciliation operations exist at this production base. |
| FRO-356 | Explicit Order regime/type eligibility remains unavailable. Do not infer it from Greece/ΚΤΑ/ΑΛΚ, amount, warehouse or note existence. |
| Source lookup | Current PO search does not search Supplier/Client names; list size is capped at 100. Reference data/vessel access must be compatible with invoice authority. |
| FRO-319 and later staged integration | Entry Note lookup is absent. Basic capture must work before this later integration and distinguish unavailable/loading/error/denied/confirmed absence. |
| FRO-347/FRO-349 controller | Actual form/useAppForm, validation, remote selector/unavailable reason, source refresh, draft/file-byte lifetime, navigation/unload guards, submission/upload recovery and correct selected-Order refresh remain unimplemented. Supplied slots/callbacks are not those mechanisms. |
| Reproducibility and repository checks | Manifest/lock mismatch, two existing type errors and 270 existing formatting findings need ownership/resolution or explicit acceptance before claiming a clean integration. |
| Required branch protections | Identity has maintain/push, admin=false. Ruleset read still returns HTTP 403, requiring a plan upgrade. Required restriction/enforcement cannot be verified. No protections changed; another ticket's exception does not authorize FRO-347 publication. |

Do not expose these components through a normal route or claim the ticket's
acceptance criteria complete until dependent contracts/controller work are
implemented and verified. Local branch creation and committing this exact reviewed diff were explicitly
approved on 23 October 2026. The user subsequently authorized pushing this commit
despite existing main-branch check failures and protection limitations. That
scoped push is complete and verified; no further code commit, PR or deployment
is authorized. The exception does not resolve the documented integration gaps.

## Independent review, rulings and deferred item

A fresh read-only reviewer inspected all seven files against the approved plan
and spec. **No Critical or Important findings** within presentation scope;
suitable as unconnected preparation, not integration/publication.

Rulings, in execution order:

1. Retain production slices uncommitted and branchless, using a full patch and
   local ledger instead of skill helpers that assume commits. This follows the
   explicit user instruction. Cost if wrong: the handoff has a patch rather than
   a commit history; no remote state has been changed.
2. The review set aside backend validation/authorization, source search and regime
   computation, actual draft navigation/unload retention, network idempotency/
   reconciliation, persistence/uploads, real owner binding and production
   readiness. Keep them blocked as agreed; browser geometry is covered above.
   Cost if wrong: integrating without those mechanisms could cause data loss,
   duplicate work or unauthorized access, so no working route/publication is
   offered on this preparation alone.

Deferred minor: the retained tests check selected filenames after tab/locale
changes and actual File identity at selection separately; they do not retrieve
the same bytes afterward in one composed regression test. Similarly, result and
row callback assertions are separate. A composed file-byte/saved-owner regression
test would strengthen coverage. Browser fixture callbacks corroborate row/owner
presentation, not actual backend binding. This is a coverage limitation, not an
observed production defect.

The preparation evidence was previously synchronized. This local-commit
checkpoint is recorded locally with pushing deferred under the user instruction.
No glossary term, ADR or Linear edit is needed here.


## Local commit checkpoint — 23 October 2026

The user explicitly approved creating the local branch and committing the reviewed
seven-file diff, with no push. Verified the unchanged base, branch-name availability,
empty index, no active hooks, and byte-for-byte patch equality before committing.
Created the branch from the recorded base and committed only the seven approved
frontend paths. Post-commit checks confirm the exact approved patch, parent base,
correct branch, clean tree and no upstream. The command reporting the absent
upstream returned 1 as expected; the commit itself succeeded. No source changes
or repeated test/build runs occurred; the existing 171-test/build evidence applies
to identical content. All integration, baseline-check and publication limitations
remain as documented above. No push to any repository was made in this checkpoint.


## Remote branch checkpoint — 23 October 2026

The user explicitly authorized pushing FRO-347 despite existing main-branch
issues and protection limitations, with no unrelated fixes or PR. Verified the
clean local branch, exact commit/base/remote, absent destination branch, no active
hooks and byte-for-byte equality with the approved seven-file patch. Executed:

```sh
git push github mock/fro-347-supplier-invoice-create:mock/fro-347-supplier-invoice-create
```

The push succeeded. Fetched the published branch and independently checked remote
refs: head `ac539a93f3e3884b70de5e57dfc83563aa2346db`, main unchanged at
`3820e89e8caa341261e2d48bcb282d93e1bb1d03`. Complete remote diff equals the
approved patch: seven frontend files, 1,015 insertions; whitespace check passes
and local tree remains clean. No source changes or new tests were introduced;
the prior 171-test/build evidence and disclosed baseline failures remain as
reviewed. No PR, merge, deployment, backend fix, Linear mutation or protection
change occurred. This exception covers this exact branch push only.
