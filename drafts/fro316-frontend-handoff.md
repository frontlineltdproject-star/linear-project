# FRO-316 frontend preparation — handoff (step 4e)

Status 2026-10-26: all six slices implemented and verified locally. No branch, commit or push yet; awaiting explicit approval.

## Setup

- Repository `Frontline-Forwarding/frontline-forwarding`; isolated clone in the session scratchpad (`ff316`, remote `github`), detached at base `5c51030680c9d45b3827a7e19b8320c19aa5ed9a` (`main`, unchanged at handoff).
- Playbook: HEAD 5c51030, policy committed, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- Node 24.13.0 / npm 11.6.2 (repo prefers 22.13.0). `npm ci` succeeded.

## Diff

27 added files, 7,270 lines, all under `frontline-forwarding-client/`: `dev/fro316/` (index.html, review.tsx), `src/features/shipments/components/details/` (21 source/test files and README), `src/features/shipments/localization/shipment-details-labels.ts` and its test. No modified files. Full patch: `drafts/fro316-frontend-preparation.patch` (reverse-apply check passes; no secrets found).

Not touched: route, `shipment-detail.tsx`, GraphQL documents, generated files, backend, dependencies, CI, shared UI primitives. The build's `routeTree.gen.ts` ordering drift was restored.

## Verification

- `npx vitest run`: 49 files, 257 tests passed (baseline 42/202; 55 new). New retained tests were written first and failed on behaviour before each slice (Red), then passed.
- `npx tsc --noEmit`: only the 2 pre-existing TS2352 casts in `delivery-note-service.test.ts`.
- `npm run build`: passed; the review page and prepared components are absent from `dist`.
- Prettier on all changed files: clean. `git diff --check`: clean.
- Browser (Vite dev on 127.0.0.1:3316, `/dev/fro316/index.html`): 200 automated checks (10 scenarios × 5 tabs × 400px/1280px × EN/EL) with no page-wide overflow and Greek rendered. Flows: plan packing → review (metrics) → Ready → Dispatch; Ready route change with destination-warehouse requirement, warning and delivery-note reconciliation; failed save keeps the draft; Escape closes editors; participation reason/remark validation and unavailable colli; view-only access; light/dark theme; 400px Greek modal footers wrap after a fix. Fresh load: no console errors, no API requests.
- Fixes found by validation: focus return to Edit/entry buttons after Escape/Cancel (requestAnimationFrame did not fire in a hidden tab; replaced by `useEditFocus`); modal footers overflowing at 400px in Greek (`ModalActions` wrapper); geography Greek labels missing on `main` (taken from `release/0.0.2`).

## Push gate evidence

- Branch `mock/fro-316-shipment-details-ui` does not exist; no other `fro-316` branch.
- Rulesets: HTTP 403 (plan limitation). `main` protection: 404 (none). CLI account permissions: push/maintain, not admin. Gap accepted by the user (Q4); reconfirm at the push gate.
- Push command: `git push github mock/fro-316-shipment-details-ui:mock/fro-316-shipment-details-ui`.

## Backend dependencies

FRO-325 (status, packing, readiness, document, dispatch, cancellation, Order display data, blockers), FRO-344 (editing, invalidation, reconciliation), FRO-339 (geography on main), FRO-345 (history, comments), FRO-292 (Notes), FRO-299 (measurements), FRO-324 (historical arrivals), FRO-297 (DG count). Until then the live page stays as it is.

## Known limitations

`Modal` has no accessible-name prop (dialogs are titled visually only); country/city/warehouse use `Select`; historical-arrival event titles are generic unless the controller supplies a summary.
