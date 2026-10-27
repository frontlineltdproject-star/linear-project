# FRO-353 — step 4e frontend plan (mock/fro-353-customs-storage-entry-create)

Playbook: FRO-353, HEAD 5c51030, policy committed, SHA-256 b1a66b22…7dc. Base: `main` 5c51030 (re-fetched 2026-10-27). Isolated clone `C:/ffx/fro353`, detached. Node 24.13 (22.13 not installed).

## Scope and boundary

- New files only, all under `frontline-forwarding-client/src/features/customs-storage/create/`. No route, menu, service, GraphQL document, authority, generated file, dependency or shared-component change. Unmounted, like the FRO-350/352 branches.
- Components are controlled and take UI view models; the eventual controller (after FRO-319 contracts exist) owns fetching, draft state and navigation. The README records that boundary and the FRO-319 reads it waits for.
- Local copies of FRO-350's `ReadOnlyField`, `RecordLink`, `CardHeading` and `SearchPicker` (extended with reason line + Open link), flagged in the README for later de-duplication, so no file is shared with another mock branch.
- Design authority: `DESIGN.md`, `theme.css`, `components/ui/*` (component map in the FRO-353 ticket). Semantic tokens only; strings through the labels file.

## Files

| File | Purpose |
| -- | -- |
| `types.ts` | View models: `OrderSearchResult` (eligibility + reason code), `SelectedOrder` (admission, parties, missing flags, weight or unknown), `WarehousePrefill`, `InvoiceRow` (amount strings + currency), `ExportSummary` (+ invoices in Export count), `EntryDraft`, `CreateOutcome`, tab ids. |
| `customs-storage-create-rules.ts` (+ test) | Exact decimal-string money (BigInt cents): per-row and total Statistical VAT half-up, totals only all-EUR; `validateEntryDraft` (date-time ≤ now and MRN date ≤ today in Europe/Athens, tariff 1–10 digits, 500/2,000 limits) with first-error field; `applyWarehousePrefill` (only untouched fields); `formatWarehouseAddress`; `exportCoverage` (n of m / none / no invoices); `isDraftDirty`; `canCreate`. |
| `localization/customs-storage-create-labels.ts` (+ test) | EN/EL strings from the ticket via `useLocale`; parity test. |
| `components/customs-storage-create-layout.tsx` | `TopBar` (title, subtitle, Back to Order), outer `Card` with `Tabs` (arrow-key roving focus), feedback slot, Cancel/Create row below the card; access-denied variant. |
| `components/order-relationship-card.tsx` | Search picker (eligible selectable; ineligible listed with reason, Open for covered), loading/empty/error+Retry, blocked/not-found preselection alerts, derived read-only facts with Unknown/Missing markers. |
| `components/entry-details-card.tsx` | Three sub-cards; `DatePicker` + `Input type="time"`, MRN, MRN date, tariff, goods `Textarea`, transport, fixed Transport Company, permit/operator/ΑΦΜ/address with prefill hints and field errors. |
| `components/related-invoices-card.tsx` | `Table` with per-row currency amounts, `tfoot` totals when all-EUR, mixed-currency `Alert`, empty states. |
| `components/related-export-card.tsx` | Export link, MRN, date, Customs status `StatusPill`, n-of-m `Alert`, empty states. |
| `components/customs-storage-create-outcomes.tsx` | Feedback banners (fix fields, failed, created by someone else + Open, lost response checking/no entry), discard `Modal`. |
| `components/customs-storage-ui-parts.tsx` | Local ReadOnlyField, RecordLink, CardHeading, SearchPicker, marker badge. |
| `components/*.test.tsx` | Component behaviour tests (below). |
| `README.md` | Ownership, controller duties, activation dependencies (FRO-319 reads/authorities, FRO-321, FRO-317, FRO-356), verification commands. |

## Slices (built uncommitted; full diff shown once at the end, as requested)

1. **Rules, types, labels, README** — TDD: rule tests written first and run Red against stubs, then Green. Label parity test.
2. **Layout + Overview** — layout, Order relationship, Entry details, ui-parts. Tests: tab order/keyboard, picker selection vs ineligible rows and Open, preselection alerts, markers, field errors and prefill hints.
3. **Invoices, Export, outcomes** — tables, Export card, banners, discard modal. Tests: totals vs mixed currency, €803.62 → €192.87, n-of-m, empty states, outcome banners, modal keep/discard.

## Verification

- `npm run test -- src/features/customs-storage`, full `npm run test`, `npm run build`, `npx tsc --noEmit` (baseline: 2 pre-existing TS2352 in delivery-note-service.test.ts), `npx prettier --check src/features/customs-storage`, `git diff --check`.
- Browser: temporary uncommitted harness (own Vite config, deleted afterwards) rendering the components with fixtures; check every state in EN/EL at desktop and 400px, keyboard, console clean. Confirm the dev port is free afterwards and restore `src/routeTree.gen.ts` if regenerated.
- Audit: `git status`, `git diff --name-status 5c51030`, every new file read; nothing outside the folder; no secrets.

## Acceptance (frontend slice of FRO-353)

The components render every state in the ticket (AC 1–12) from view models; server behaviour (eligibility, numbering, uniqueness, outcomes) stays with FRO-319 and is listed as an activation dependency.
