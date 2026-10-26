# FRO-341 frontend/UI implementation plan (step 4e) — proposal

Status: agreed 2026-10-26. The developer accepted the four slices and the recommended D1–D6: base `release/0.0.2`; remove repacking (no merge before FRO-316); omit blocked areas; keep the "Frontline network transfer" label; branch `mock/fro-341-create-shipment-layout` with no Linear status change; the enforcement gap is accepted for an explicit-refspec push, reconfirmed at the push gate. The implementation model checkpoint is pending. No implementation, branch, commit or push yet.

- Repository: `Frontline-Forwarding/frontline-forwarding`, isolated clone in the session scratchpad with remote `github`.
- Playbook: HEAD 5c51030680c9d45b3827a7e19b8320c19aa5ed9a; policy committed; SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- All changes are confined to `frontline-forwarding-client/`. No backend, GraphQL documents, generated files, dependencies, CI or deployment config.

## What existing contracts allow

| FRO-341 area | Contract on base | In this branch |
| -- | -- | -- |
| Tabs, TopBar, Create shipment → review modal, no wizard | Existing create mutation | Yes |
| Origin warehouse, Mode, Purpose + destination dropdown | Existing input | Yes |
| Country/city selectors and city-filtered warehouses | `release/0.0.2` only (FRO-339) | Only if the base is `release/0.0.2` (D1) |
| Deep-link geography prefill | Needs geography | With D1 = `release/0.0.2` |
| Partial selections compact rows, bulk apply, include remaining | Existing `partialSelections` | Yes |
| Collapsible Order rows with chevron | Presentation only | Yes |
| Review modal: counters, route plan, validation, allocation, child effect | Existing data | Yes |
| Document number at creation | FRO-325 (not in create input) | No; omitted |
| Status Preparing/Arrived, arrival dates | FRO-324 | No; omitted |
| Notes | FRO-292 | No; omitted |
| Documents tab (pending files) | FRO-342 | No; omitted |
| From arrived shipments | FRO-323 | No; omitted |
| Create new order | FRO-343 | No; omitted |
| Repacking removal | FRO-316 repacking in Details not live | See D2 |

## Slices

1. **Page shell.**
   - TopBar title only; route `?tab=overview|orders`.
   - Tabs Overview · Orders and Collis, with opt-in Arrow/Home/End navigation added to `components/ui/tabs.tsx` (existing callers unchanged).
   - Page-level Create shipment button opens the review in a `Modal`; wizard progress and Next/Back are removed. Draft state is kept across tabs and language.
2. **Overview cards.**
   - Shipment details: geography if D1, Origin warehouse, Mode as `Select`.
   - Shipment purpose: one Purpose `Select` plus a destination control. The combined destination-warehouse list replaces the subtype buttons; labels follow D4.
   - Production labels in EN and EL.
3. **Orders and Collis.**
   - Collapsible Order rows: far-right chevron, `aria-expanded`/`aria-controls`; collapsing keeps the selection.
   - Partial selections card is always visible: compact rows, Reason/Remark validation, bulk apply, include remaining, the two empty messages.
4. **Creation review modal.**
   - Counters per D2; Route and commercial plan; validation checks; allocation; child-effect warning.
   - Back/Escape keep the draft and return focus. Confirm calls the existing create mutation, is disabled until valid and while saving, and keeps the draft on error.

## Per-slice validation

- Update `shipment-composer.test.tsx` (15 tests) and the labels tests for intended behaviour changes. Add focused tests for tab keyboard navigation, partial-decision gating and review confirm gating.
- Commands from `frontline-forwarding-client/`:
  - `npm run test`, `npm run build`, `npm run format:check`, `git diff --check`.
  - The TypeScript check is reported separately; pre-existing failures are reported, not fixed.
- Install: `npm ci` (if it fails on the known lock mismatch, use `npm install --package-lock=false`, with no tracked file changes). Node 24 is available locally while the repo prefers 22.13; this will be reported.
- Browser: local `npm run dev` with intercepted GraphQL fixtures (no backend, no live data) at desktop and ~400px, EN/EL. Scenarios:
  - deep link from an Order
  - a partial selection that needs a decision
  - bulk apply
  - include remaining
  - review cancel/Escape
  - confirm success fixture and confirm error fixture
  - a vessel-mismatch block

## Decisions needed

- **D1 base:** `main` (default; no geography) or `release/0.0.2` (includes FRO-339/FRO-329).
- **D2 repacking:** remove optional load units as specified (the branch must not merge before FRO-316), or keep them temporarily.
- **D3 blocked areas:** omit entirely, or show disabled placeholders.
- **D4 purpose label:** keep "Frontline network transfer" until FRO-320 lands, or rename now.
- **D5 branch name:** `mock/fro-341-create-shipment-layout`; no Linear In Progress change.
- **D6 enforcement gap:** branch restriction rules are unavailable on this plan (rulesets 403, no `main` protection). Written acceptance is needed before a push.
