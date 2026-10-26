# FRO-316 frontend preparation (step 4e) — agreed plan

Status: plan agreed 2026-10-26. The implementation model checkpoint is pending. No implementation, branch, commit or push yet.

## Decisions

- Q1: step 4e is authorized: an isolated local clone, building and checks there, then the full diff shown. Branch creation and push only after a separate yes.
- Q2: follow the `mock/` pattern (FRO-326/348): controlled, unconnected components for the whole page plus a DEV-only local review page with fixtures. The live Shipment page is unchanged.
- Q3: base `main` `5c51030`; branch `mock/fro-316-shipment-details-ui`; no Linear status change.
- Q4: the branch-protection gap is accepted (rulesets 403, no `main` protection). Push only with the explicit same-name refspec; reconfirm at the push gate.
- P1: one review and one commit after all slices (like the other `mock/` branches). Checks are reported per slice.

## Setup

- Clone: scratchpad `ff316`, remote `github` → `Frontline-Forwarding/frontline-forwarding`, detached at `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`. `core.longpaths` was needed on Windows.
- Playbook: HEAD 5c51030, policy committed, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. The first `start` failed on Windows encoding; a UTF-8 run succeeded on the same snapshot.

## Scope

- Only `frontline-forwarding-client/`: new `src/features/shipments/components/details/` and `dev/fro316/`.
- Untouched: route `$shipmentId.tsx`, `shipment-detail.tsx`, GraphQL documents, generated files, backend, dependencies, CI and shared primitives (`tabs.tsx`, `modal.tsx`, `combobox.tsx`, to avoid conflicts with FRO-326). Tab keyboard navigation goes in a local wrapper.
- Props are UI interfaces, not wire contracts. No fetching and no persistence; capabilities come from the caller.

## Slices

1. Foundation: view models, EN/EL labels, helpers (FRO-299 measurement display, counts, status steps).
2. Overview: status card, details/purpose cards with Edit, Final handover, Notes.
3. Orders and collis: Purchase orders table, Shipment packages, participation editor.
4. Packing: Optional repacking editor and Review repacking.
5. History & activity, Documents slot, Available actions, delivery-note reconciliation step.
6. Prepared page composition, DEV-only review entry `dev/fro316/`, README with owner tickets.

## Validation

`npm run test`, `npm run build`, `npx tsc --noEmit` (pre-existing failures reported), Prettier on changed files, `git diff --check`. Retained tests for consequential behaviour, written first. Browser: local dev server on 127.0.0.1, `/dev/fro316/`, desktop and about 400px, EN/EL, all 10 scenarios, loading/empty/error, view-only, failed saves, packing → Ready → Dispatch, participation, reconciliation, keyboard and focus.

## Related

The FRO-341 session is implementing its own plan (live create page, with repacking removed) and has recorded local mock branch commits. Its branch cannot merge before FRO-316 is live, and FRO-316 is now prepared-only. The recommendation to switch FRO-341 to the prepared pattern is not yet raised in that session.
