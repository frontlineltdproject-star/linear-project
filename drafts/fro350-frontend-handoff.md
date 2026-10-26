# FRO-350 — frontend preparation handoff (step 4e)

Status: **published** as `mock/fro-350-export-create`, commit `ea00f108c9b9a1c41e67b85abc8e419e3bbfb328` (approved 2026-10-26; remote verified 1 ahead / 0 behind main, 16 added files).

## Baseline and provenance

- Isolated clone `C:/ffx/fro350`, remote `github` → `https://github.com/Frontline-Forwarding/frontline-forwarding.git`, detached at **5c51030680c9d45b3827a7e19b8320c19aa5ed9a**; `main` re-fetched before the audit and unchanged.
- Playbook: HEAD 5c51030, policy committed, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Planning and implementation model checkpoints confirmed by the user.
- Full diff: session scratchpad `fro350-frontend-preparation.patch` (not committed: production source) (16 added files, +3,207, 3,303 lines, SHA-256 6fe6e01efea7988b686122f10e0b2b7918520adbb745445131cd587c40b33939).

## Files (all new, all under `frontline-forwarding-client/src/features/exports/`)

| File | Lines | Purpose |
| -- | -- | -- |
| `README.md` | 96 | Components, controller responsibilities, blocking dependencies (FRO-317/321/319, authorities, attachments, entry buttons) |
| `types.ts` | 126 | UI view models and enums (Export type, Customs status, invoice type) |
| `export-create-rules.ts` / `.test.ts` | 127 / 239 | MRN normalise/format, MRN/EAD date windows, Greek ≥1 invoice, first-error tab/field, Connected Orders, VAT required, auto-select, Athens today |
| `localization/export-create-labels.ts` / `.test.ts` | 341 / 27 | EN/EL copy, placeholder parity, `fillLabel` |
| `components/export-create-layout.tsx` | 150 | TopBar + actions, four tabs with counts and roving keys, feedback/result slots |
| `components/export-ui-parts.tsx` | 311 | Card heading, read-only field, record link, `SearchPicker`, `focusExportField`, `exportErrorMessage` |
| `components/export-shipment-card.tsx` | 86 | Shipment relationship |
| `components/export-scope-card.tsx` | 284 | Export scope states, rows, preview |
| `components/export-details-card.tsx` | 211 | Export details + Customs status block |
| `components/export-invoices-card.tsx` | 248 | Supplier invoices + Connected Orders |
| `components/export-vat-protocol-card.tsx` | 43 | VAT protocol states |
| `components/export-documents-card.tsx` | 131 | Staged documents + shared list |
| `components/export-create-outcomes.tsx` | 163 | Result, feedback, replace/discard dialogs |
| `components/export-create-ui.test.tsx` | 624 | Component behaviour tests |

No route, service, GraphQL document, generated file, authority, dependency, shared `components/ui` or backend change.

## Verification (Node 24.13.0 / npm local; repository requires 22.13.0)

| Check | Result |
| -- | -- |
| TDD Red | `export-create-rules.test.ts` against stubs: 12 behavioural failures, then Green |
| `npx vitest run src/features/exports` | 3 files, 35 tests passed |
| `npx vitest run --maxWorkers=2` | 45 files, 237 tests passed |
| `npm run build` | passed |
| `npx tsc --noEmit` | only the 2 pre-existing TS2352 errors in `delivery-note-service.test.ts` |
| `npx prettier --check src/features/exports` | clean |
| `git diff --check` | clean |
| Secret scan of new files | none |

Browser (temporary harness, real components and production theme, Vite dev on 127.0.0.1:8352, fictional fixtures; harness removed from the checkout and kept in the session scratchpad):

- Auto-selected sole candidate; Preview invoices expands without changing selection.
- Create with empty MRN/date → summary, Overview, focus on MRN; Awaiting IE599 enables EAD date, indicator step 2; back to Awaiting EAD clears/disables it.
- Calendars: future days disabled for MRN date; EAD days before the MRN date disabled.
- Invoices: three rows with Direct/Ancestor sources; removing the Υ.Δ. invoices switches VAT to Not required; picker shows 11 of 15 matches disabled with reasons; Paperwork only badge on an added invoice; keyboard Remove moves focus to the next row.
- Replace dialog on Shipment change after edits; Keep current selection keeps SHP-DEMO-101.
- Successful create shows the result (EXP-2050, Awaiting IE599).
- Loading (status + Create disabled), error (Retry), no participating Orders; mixed Shipment 104: existing / two foreign / blocked with message and "Several Exports…".
- Greek at 400px: no page overflow on any tab, no clipped controls. **Fixed during the check:** Greek tab labels wrapped to four lines; tabs now stay on one line and the tab row scrolls.
- Console: no errors. Fixture checks prove frontend behaviour only.

Housekeeping: the dev server regenerated `src/routeTree.gen.ts` (ordering only); the server was stopped and the file restored. Final status: only the new `src/features/exports/` folder is untracked; nothing else changed.

## Push gate (approved and completed)

- Branch: `mock/fro-350-export-create` (does not exist on the remote) from 5c51030; one commit `feat(FRO-350): prepare export create UI`.
- Command: `git push github mock/fro-350-export-create:mock/fro-350-export-create` (explicit refspec; no force).
- Enforcement evidence: `GET /rulesets` → 403 (plan does not support rulesets); `main` has no branch protection (404); account permissions push=true, maintain=true, admin=false. The write restriction to `mock/*` is policy only, not enforced — same gap the user accepted for FRO-316/341.
- Backend dependencies: FRO-317 (Export contracts, authorities, attachments), FRO-321 (Supplier Invoice), FRO-319 (Entry Note), follow-up entry-button tickets.
