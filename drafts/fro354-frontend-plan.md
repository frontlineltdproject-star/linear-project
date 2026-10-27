# FRO-354 — step 4e frontend plan (mock/fro-354-customs-storage-entry-details)

Playbook: FRO-354, HEAD 5c51030, policy committed, SHA-256 b1a66b22…7dc (same policy as FRO-353). First load failed on a Windows console encoding error (`charmap` cannot encode `→`); reloaded with `PYTHONIOENCODING=utf-8`, exit 0. Base: `main` 5c51030 (fetched 2026-10-27). Isolated worktree `C:/ffx/fro354` (of the FRO-353 clone, remote `github` → Frontline-Forwarding/frontline-forwarding), detached at main.

## Scope and boundary

- New files only, all under `frontline-forwarding-client/src/features/customs-storage/details/`. No route, menu, service, GraphQL document, authority, generated file, dependency or shared-component change. Unmounted, like the FRO-350/352/353 branches.
- Controlled components on UI view models; the eventual controller (after FRO-319 contracts exist) owns fetching, edit drafts, version precondition, navigation and toasts. README records that boundary and the FRO-319 reads/operations it waits for.
- Built from main, so the FRO-353 parts it reuses (read-only field, record link, card heading, value marker, SearchPicker with reasons, invoice table with tfoot, Export card, Statistical VAT and validation rules, EN/EL labels) are local copies, flagged in the README for consolidation with `create/` once both branches merge. No file shared with another mock branch.
- Design authority: `DESIGN.md`, `theme.css`, `components/ui/*` (component map in the FRO-354 ticket). Semantic tokens only; strings through the labels file.

## Files

| File | Purpose |
| -- | -- |
| `types.ts` | View models: `SavedEntry` (number, owner, entry-owned values, createdBy/At), `EntryOrder` (admission, warehouse, collis, weight or unknown, parties), `ReturnContext` (Order, viaCoveredChild), `ChangeOrderResult` (eligibility incl. `CURRENT_ORDER` / `COVERED_BY_THIS_ENTRY`), `EditingCard`, `SaveFeedback` (validation / failed / stale / rejected), page state (loading / error / notFound / denied / ready), invoice and Export view models. |
| `customs-storage-details-rules.ts` (+ test) | Copies of FRO-353 money and validation rules (Statistical VAT half-up, EUR-only totals, date-time ≤ now / MRN date ≤ today in Europe/Athens, tariff 1–10 digits, limits); new: `changeOrderReason` (current owner and covered-by-this-entry first, then FRO-319 reason), `warehouseChanged`, `canStartEdit` (one editor at a time), `isEditDirty`, `entryTitleParts` (number, subtitle). |
| `localization/customs-storage-details-labels.ts` (+ test) | EN/EL strings from FRO-354 via `useLocale`; parity test. |
| `components/customs-storage-details-layout.tsx` | `TopBar` (title, subtitle, Back to Order), reserved header action slot (empty; FRO-358), covered-child `Alert`, outer `Card` with `Tabs` (arrow/Home/End), page states (loading, error + Retry, not found, denied). |
| `components/order-relationship-card.tsx` | Read-only facts with Unknown/Missing markers; Edit → Change Order SearchPicker with page-specific reasons, Save/Cancel, rejection message, warehouse review notice slot. |
| `components/change-order-dialog.tsx` | `Modal`: Change Order to {Stock ID}?, text, warehouse-differs warning, Cancel / Confirm change. |
| `components/entry-details-card.tsx` | Three sub-cards read-only by default; Edit → ten fields as controls (`DatePicker` + `Input type="time"`, etc.), Cancel/Save, Created by caption, warehouse notice. |
| `components/related-invoices-card.tsx`, `components/related-export-card.tsx` | Read-only tables/facts (copies adapted from FRO-353: owning-Order wording, no "select an Order" states). |
| `components/customs-storage-details-feedback.tsx` | Card feedback alerts (fix fields, failed, stale + Refresh) and discard `Modal`. |
| `components/customs-storage-details-ui-parts.tsx` | Local ReadOnlyField, RecordLink, CardHeading, ValueMarker, SearchPicker, EditActions (Edit with disabled hint, Cancel/Save), amount formatting. |
| `components/*.test.tsx` | Component behaviour tests (below). |
| `README.md` | Ownership, controller duties, activation dependencies (FRO-319 reads/edit/Change Order/created-by/authorities, FRO-321, FRO-317, FRO-356, FRO-355 return context, FRO-358 Print), verification commands. |

## Slices (built uncommitted; full diff shown once at the end, as for FRO-353)

1. **Rules, types, labels, README** — TDD: rule tests first, Red against stubs, then Green. Label parity test.
2. **Layout and Overview** — layout and page states, covered-child banner, Order relationship with Change Order and dialog, Entry details read/edit, ui-parts. Tests: tab keyboard, header with/without return context, banner, one-editor hint, picker reasons (current, covered here, other), dialog warning and Escape, edit fields, validation focus, Created by.
3. **Invoices, Export, feedback** — tables, Export card, failed/stale banners, discard dialog. Tests: totals vs mixed currency (€803.62 → €192.87), empty states, n of m, feedback, discard keep/discard.

## Verification

- `npm run test -- src/features/customs-storage`, full `npm run test`, `npm run build`, `npx tsc --noEmit` (baseline: 2 pre-existing TS2352 in delivery-note-service.test.ts), `npx prettier --check src/features/customs-storage`, `git diff --check`.
- Browser: temporary uncommitted harness (own Vite config, deleted afterwards) rendering the components with fixtures; every state in EN/EL at desktop and 400px, keyboard, console clean. Confirm the port is free afterwards and restore `src/routeTree.gen.ts` if regenerated.
- Audit: `git status`, `git diff --name-status 5c51030`, every new file read; nothing outside the folder; no secrets. Ruleset check via `gh` (FRO-353 had rulesets 403 / main protection 404 — expect the same gap).

## Acceptance (frontend slice of FRO-354)

The components render every state in the ticket (AC 1–11) from view models; server behaviour (reads, edit, Change Order, version checks, authorities, created-by) stays with FRO-319 and is listed as an activation dependency.
