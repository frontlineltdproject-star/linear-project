# FRO-350 — frontend preparation plan (step 4e)

## Baseline

- Repository `Frontline-Forwarding/frontline-forwarding`, isolated clone `C:/ffx/fro350`, remote `github`, detached at **main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a** (re-fetched 2026-10-26; unchanged).
- Playbook: `python -B .ai/load_guidelines.py start --issue FRO-350` → Git HEAD 5c51030, policy state **committed**, SHA-256 **b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc**. (Windows needed `PYTHONUTF8=1`; the first attempt failed on console encoding and loaded nothing.)
- No documented Version/Sync workflow for the client; preparation is `npm install` with the lockfile untouched (the FRO-347/348 READMEs record that `npm ci` fails on the committed lock mismatch). Local Node is 24.13; required 22.13 — results will be reported with that caveat unless a 22.13 runtime is available.
- Proposed branch (created only after approval): `mock/fro-350-export-create` from 5c51030.

## Pattern (same as mock/fro-347 and mock/fro-348)

New files only, under `frontline-forwarding-client/src/features/exports/`. Controlled, **unmounted** presentation components on UI view models; no route, menu entry, service, GraphQL document, generated file, authority, dependency or backend change. README records the activation boundary. Shared `src/components/ui` files are not modified (FRO-347's roving tab focus is added locally, as there).

## Component map

| Element | Catalogue component / source |
| -- | -- |
| Page title + Cancel / Create Export | `TopBar` (`components/layout/top-bar.tsx`), `Button` |
| Tabs (4) with arrow keys | `Tabs/TabList/Tab/TabPanel` (`components/ui/tabs.tsx`) + local roving focus (FRO-347 pattern) |
| Cards | `Card` (`components/ui/card.tsx`) |
| Shipment search, Add invoice | **New composition**: `Input` + popover list styled like FRO-347's picker (listbox, Escape/outside close, Arrow Down) |
| Read-only fields | `Label` + read-only `Input` |
| Export scope, invoices, Connected Orders, preview | `Table/THead/TBody/TR/TH/TD` (`components/ui/table.tsx`) inside a scroll wrapper with `relative` positioning |
| Select / Selected | `Button` secondary / primary |
| Blocked, Paperwork only, VAT status | `StatusPill` / `Badge` (`components/ui/badge.tsx`) |
| Loading / empty / error | `Spinner` (`components/ui/feedback.tsx`), `Alert` (`components/ui/alert.tsx`) |
| MRN | `Input` |
| MRN date, EAD date, IE599 date | `DatePicker` (`components/ui/date-picker.tsx`) |
| Delivered vessel | `Combobox` (`components/ui/combobox.tsx`) |
| Customs status | `Select` + **new composition** three-step indicator (FRO-348 VAT-status pattern) |
| Replace / discard confirmations | `Modal` (`components/ui/modal.tsx`) |
| Documents | **New composition** mirroring FRO-347's document queue (not importable: it lives only on mock/fro-347) |
| EN/EL copy | `LabelsProvider` / `useLocale` (`app/providers/labels-provider`) |

## Slices

| # | Outcome | Files (all new) | Tests / checks |
| -- | -- | -- | -- |
| 1 | View models, pure rules, labels, page shell | `types.ts`, `export-create-rules.ts` (MRN normalise/format, date windows, Greek ≥1 invoice, first-error tab/field, connected Orders, VAT required, auto-select), `localization/export-create-labels.ts`, `components/export-create-layout.tsx`, `README.md` | TDD unit tests for every rule (Red first); labels EN/EL key parity; layout keyboard tabs and counts |
| 2 | Overview tab | `export-shipment-card.tsx`, `export-scope-card.tsx`, `export-details-card.tsx` | Component tests: picker open/close, selection callbacks, scope row states, preview toggle never calls select, loading/empty/error, customs status → EAD field enabling |
| 3 | Invoices and VAT tabs | `export-invoices-card.tsx`, `export-connected-orders.tsx`, `export-vat-protocol.tsx` | Tests: columns, Source, Paperwork only, disabled reasons, Remove focus, VAT three states |
| 4 | Documents, outcomes, confirmations | `export-documents-card.tsx`, `export-create-result.tsx`, `export-confirmations.tsx` | Tests: staged files, uploaded/failed + Retry, unknown outcome, duplicate banner, replace/discard modals |

Each slice: focused tests, `npx tsc --noEmit` (2 known baseline TS2352 errors excluded), `npx prettier --check src/features/exports`, `git diff --check`; full `npm run test` and `npm run build` at the end.

## Browser validation

A temporary local harness (not committed) mounts the components with the preview fixtures through `vite` dev; scenarios: search → auto-select, several candidates, existing/blocked rows, preview toggle, invoice add/remove → VAT switch, validation focus per tab, outcomes, confirmations; EN/EL; 1280px and 400px; console clean. Fixture-based: proves frontend behaviour only.

## Gates

1. **Planning checkpoint (now):** confirm the selected model is appropriate for planning, and agree this plan.
2. **Implementation checkpoint:** confirm the model is appropriate for implementation before slice 1.
3. Each slice's diff is shown; nothing is committed without approval.
4. Before any push: full audited diff, `compare/main...` file list, ruleset evidence (rulesets were 403 on this plan; account push=true, admin=false), explicit approval.
