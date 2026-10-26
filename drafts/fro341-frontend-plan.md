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

---

# Revision 2 — rebuild from `main` as unconnected UI preparation (proposed 2026-10-26)

The user chose option 1 and asked that AGENTS.md be followed again. Step 4e builds from `main`, so the `release/0.0.2` base (D1 above) is withdrawn. Revision 1 work is retained locally as `backup/fro-341-release-0.0.2` and in Generated files/FRO-341/fro-341-create-shipment-layout.bundle. The remote branch `mock/fro-341-create-shipment-layout` must be deleted by the user before reuse; the agent may not delete remote branches.

- Base: `main` 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Playbook resumed with the same committed policy, b1a66b22…7dc.
- Pattern, as in mock/fro-335 and mock/fro-347: new components under `frontline-forwarding-client/src/features/shipments/components/creation/` that are **not mounted**. `routes/secured/shipments/new.tsx` and the existing composer stay unchanged and working. Types are UI drafts and view models, not API inputs. Data and operations are supplied through props/callbacks, with no fixtures, casts or new services. A README states the activation boundary and its dependency owners.
- Scope: the complete approved FRO-341 UI, including the parts the backend cannot support yet:
  - Status Preparing/Arrived with the indicator, and dispatch/arrival dates
  - the four geography selectors with city-filtered warehouses and deep-link prefill
  - mode, Document type and Document number
  - Purpose and destination
  - Notes
  - By purchase order (collapsible) and From arrived shipments
  - Create new order (entry plus modal slot)
  - Partial selections
  - Documents (pending files)
  - Creation review (counters, route, checks, allocation, child effect)
- No changes to shared `components/ui/*`; tab keyboard handling stays local to the feature, as in FRO-347. Only client files.

## Slices

1. Foundation: README (activation boundary), UI draft/view-model types, EN/EL labels, layout shell (TopBar, Card, three tabs with local keyboard navigation, page-level Create shipment, review modal shell), pure validation helper.
2. Overview: Shipment details (status subcard and indicator, geography, origin warehouse, mode, document, dates), Shipment purpose, Notes.
3. Orders and Collis: By purchase order (collapsible), From arrived shipments, Create new order entry/slot, Partial selections.
4. Documents and Creation review content.

Per slice: component tests, `npm run test`, `npm run build`, `npm run format:check`, `npx tsc --noEmit`, `git diff --check`; local-only browser harness outside the checkout mounting the components with fictional props (not committed); diff approval before commit.

## Decisions proposed

- R1 base `main`.
- R2 unmounted preparation; live page unchanged.
- R3 full scope including blocked areas.
- R4 labels follow the approved ticket text ("Warehouse transfer"; "Preparing" pending the FRO-316 follow-up).
- R5 Create new order is a modal host slot; the FRO-335 card is not on `main`.
- R6 no shared-primitive changes.
- R7 same branch name after the user deletes the old one.
