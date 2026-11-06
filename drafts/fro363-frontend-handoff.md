# FRO-363 frontend mock handoff — local preparation

[Linear ticket](https://linear.app/front-line-ltd/issue/FRO-363/shipment-invoice-create-page-ui) · [complete proposed diff](fro363-frontend-preparation.patch) · [desktop](fro363-frontend-evidence/react-desktop.png) · [Greek mobile](fro363-frontend-evidence/react-mobile-el.png)

## Result

Approved layout A implemented as real portal React components under frontline-forwarding-client/src/features/shipment-invoices/. Fourteen new files, no existing application files changed. Components, typed UI boundary, defaults, EN/EL text, identity-only selection helpers, consequential interaction tests and isolated fixtures are included. Feature remains unmounted: backend integration, real routes/permissions and production navigation are not fabricated.

Local preview: http://127.0.0.1:8766/ while the local review server runs. The temporary Vite/browser host lives outside the production checkout at ../fro363-review; no harness, standalone HTML, screenshots, generated contracts or dependencies are in the proposed diff. Shipment/order reference values and totals displayed by the review host are fixtures, not authoritative calculations.

## Base, scope and workflow

- Production repository: Frontline-Forwarding/frontline-forwarding; verified remote github.
- Detached base and refreshed main: 5774931b9869247f0247013111a452552403f456 (unchanged at final refresh).
- Worktree: C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b0de-d032-7e31-a043-531adf58aa3a/fro363-frontend.
- Committed playbook SHA-256: b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- Planning and implementation model checkpoints accepted. No production branch, commit, push, PR or deployment. Linear remains as approved: Backlog / Pending_Review, Frontend, Story, milestone 0.0.12; no status or description changes in this implementation turn.
- Proposed branch pending final approval: mock/fro-363-shipment-invoice-create. Exact push command: git push github mock/fro-363-shipment-invoice-create:mock/fro-363-shipment-invoice-create. Not executed.

## Behavior verified

Initial empty selection; preselected versus standalone Shipment; incomplete draft saving; manual document fields; common/mixed Client handling; incompatible company reset without filtering goods; edited Shipper keep/replace; confirmed Shipment change/reset; ordered group/row identity; unresolved allocation disabled; mixed currency blocks save without deselection; overlap permits save; refresh preserves fields and still-eligible rows, removes stale selections and offers new ones unselected; delayed evaluation cannot overwrite newer selection; failed refresh blocks further selection/save until retry; dirty cancel, host navigation callback and reload guard; pending submit duplicate-click protection; save errors retain inputs; saved identity persists if Details navigation fails and prevents resubmission.

The host must install registerNavigationGuard into its router for internal navigation/Back. beforeunload alone is not sufficient. A successful save bypasses the dirty guard only after a persisted identity is received. New source adapters must supply authorized values, eligible rows, evaluated totals and overlap references, and the real Details/allocation destinations.

## Verification evidence

Runtime: Node 22.13.0 through npx, pnpm 11.1.3 frozen-lockfile installation. Lockfiles/dependencies unchanged. TanStack Intent discovery after installation found no Form-specific skill; existing form sources and installed APIs were used. No separate Base/Version/Sync workflow exists in inspected project guidance.

| Check | Result |
| --- | --- |
| Initial behavior Red | Six failing form/selection assertions against stubs; four further form safeguard failures before controller implementation. |
| Review regressions | Failing tests reproduced refresh bypass, common-Client retry, navigation guard, saved-navigation error, Client refresh preservation, saved-success navigation and submit-during-confirmation. Fixed, then green. |
| Focused Vitest | 23 tests passed in 2 files. |
| Full npm run test | 249 tests passed across 46 files (baseline outside this feature: 226 tests /44 files). |
| npm run build | Pass; existing large-chunk advisory only. |
| TypeScript --noEmit | Blocked by two pre-existing TS2352 casts in delivery-note-service.test.ts at lines 134/138. No new feature errors remain. |
| Feature Prettier | Pass for all feature files. |
| Whole-project npm run format:check | Fails on existing project formatting; temporary harness removed before final run. No unrelated formatting changes made. |
| Whitespace/diff scope | New-file whitespace checks and tracked diff check clean; only 14 feature files remain untracked in production worktree. |
| Browser | Headless Edge, 36 combinations: EN/EL ×1440/400px ×9 scenarios. Zero page errors and external requests; no document overflow. |
| Browser journeys | Company text keep; keyboard Shipment choice; Escape/cancel; confirmed Shipment reset; mixed-currency block; simulated saved identity; stale eligibility refresh; failed save retains Notes. |
| Visual | Desktop and Greek mobile screenshots inspected; cards, fields and footer follow A. Table scroll stays within its container at 400px. |
| Independent review | Six concrete findings fixed; final targeted review found no remaining important issue in corrected lines. Review is not evidence of live backend integration. |

Full logs and screenshots are in fro363-frontend-evidence/. Production was not accessed or mutated by tests.

## Implementation rulings

- Use the existing Select for returned Shipment results plus an explicit search input/action. Browser verification showed shared Combobox did not commit keyboard selection. This preserves usable keyboard behavior without unrelated shared-component changes.
- Use the existing DatePicker directly with its format prop because DateField does not expose the required dd-mm-yyyy formatting. TanStack Form still owns all entered values.
- Selection helpers manipulate identities and display order only. Eligibility, allocation, monetary amounts and mixed-currency evaluation are supplied by the host; no backend computation was moved into this UI mock.
- Screens remain unmounted. AppShell is owned by the eventual host; no sidebar item or operational save entry point is activated. This is necessary because FRO-244/FRO-301 operations and future Details/allocation UI are not present on main.
- Preserve all production files unrelated to this task. Build-generated route-tree line-ending noise was restored after confirming no content diff. Temporary scripts and screenshots moved out of the production checkout.

## Final publication approval package — 2026-11-06

The user explicitly accepted the existing whole-project TypeScript and formatting failures and granted a one-time exception to the ruleset enforcement requirement for FRO-363. This does not change AGENTS.md or authorize other branches. Enforcement remains unverified: GitHub ruleset inspection returned HTTP 403 because the feature is unavailable for this private repository/account plan. No repository-wide permissions were changed.

- Destination: Frontline-Forwarding/frontline-forwarding, verified remote github.
- Refreshed main/base: 5774931b9869247f0247013111a452552403f456; unchanged.
- New branch: mock/fro-363-shipment-invoice-create. Local and remote name checks found no collision.
- Proposed commit: feat(FRO-363): add Shipment Invoice create UI mock
- Exact push: git push github mock/fro-363-shipment-invoice-create:mock/fro-363-shipment-invoice-create
- Complete diff: fro363-frontend-preparation.patch; 14 new feature files. Reconstructed working-tree patch matched the saved patch byte-for-byte.
- Patch SHA-256: f2772624042ac3b3d9543917dbe6b2d7249a9ba27c17667b4238b41fc0a1ba1a
- Final refresh: reverse patch applicability and whitespace checks passed. Focused Vitest rerun passed all 23 tests in 2 files; feature Prettier passed. Full-suite/build/browser evidence above remains applicable to the identical patch and base.

FRO-244/FRO-301 backend contracts and Details/allocation destinations are dependencies for operational activation. They do not block publication of this unmounted UI mock.

Final explicit approval to create, commit and push this exact branch is still required by AGENTS.md step 4e. No production branch, commit, push, PR or deployment has occurred. The completed ticket and four downloadable design attachments remain in Linear; no Linear mutation accompanies this approval package.
