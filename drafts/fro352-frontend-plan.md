# FRO-352 — frontend preparation plan (step 4e)

## Baseline

- Repository `Frontline-Forwarding/frontline-forwarding`, isolated clone `C:/ffx/fro352`, remote `github`, detached at **main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a** (fetched 2026-10-26).
- Playbook: `python -B .ai/load_guidelines.py start --issue FRO-352` (with `PYTHONUTF8=1`) → Git HEAD 5c51030, policy state **committed**, SHA-256 **b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc**. Planning-model checkpoint confirmed by the user.
- No documented Version/Sync workflow for the client. Preparation: `npm install --package-lock=false` (lockfile untouched; `npm ci` fails on the committed lock mismatch, as recorded by FRO-347/348/350). Local Node is 24.13.0; the required 22.13.0 is not installed, so results are reported with that caveat.
- Proposed branch, created only after approval: `mock/fro-352-export-details` from 5c51030.

## Pattern (same as mock/fro-347, -348 and -350)

New files only, under `frontline-forwarding-client/src/features/exports/details/`. These are controlled, **unmounted** presentation components on UI view models. The branch adds no route, menu entry, service, GraphQL document, generated file, authority, dependency or backend change, and modifies no existing file. Shared `src/components/ui` files are not modified. A README records the activation boundary.

**No shared files with FRO-350.** `mock/fro-350-export-create` owns `src/features/exports/{README.md, types.ts, components/*, localization/*}`, including `components/export-details-card.tsx`. Every FRO-352 path is under `exports/details/`, so the two branches cannot conflict. FRO-350's `SearchPicker`, `ReadOnlyField`, `CardHeading` and `RecordLink` exist only on its branch, so FRO-352 keeps small local equivalents in `details/components/export-detail-ui-parts.tsx`. The README lists them for de-duplication when both branches are integrated.

## Component map

| Element | Catalogue component / source |
| -- | -- |
| Title, subtitle, Customs pill, Cancelled pill, **Cancel Export** | `TopBar` (`components/layout/top-bar.tsx`: `title` and `description` are plain strings, so the pills go in its `actions` slot before Cancel Export; TopBar is not modified), `StatusPill` (`components/ui/badge.tsx`), `Button` |
| Loading / error / not found / denied | `DetailLoadingPlaceholder`, `ErrorMessage` (`components/feedback/`), `Alert` |
| Tabs (4) with arrow keys | `Tabs/TabList/Tab/TabPanel` (`components/ui/tabs.tsx`) + local roving focus (FRO-347/350 pattern) |
| Cards and sub-cards | `Card` (`components/ui/card.tsx`) |
| Saved values | **Local** `ReadOnlyField` (mirrors FRO-350/348: `bg-surface-2`, `—` when empty) |
| Shipment / Order / invoice links | **Local** `RecordLink` with a controller-supplied `RecordHref` |
| MRN | `Input` (`components/ui/input.tsx`) |
| MRN date, confirmation dates, stamping dates | `DatePicker` (`components/ui/date-picker.tsx`) |
| Delivered vessel | `Combobox` (`components/ui/combobox.tsx`) |
| Customs status block + three-step indicator | **New composition** (FRO-350/348 status pattern) |
| Supplier invoices, Connected Orders, stage tables, print list | `Table/THead/TBody/TR/TH/TD` (`components/ui/table.tsx`) in a `relative` scroll wrapper |
| Add invoice | **Local** `SearchPicker` (FRO-347/350 picker: listbox, Escape/outside close, Arrow Down, disabled reasons) |
| Paperwork only, New, VAT status, count badges | `Badge` / `StatusPill` |
| Stage checkboxes, print selection | `Checkbox` (`components/ui/choice.tsx`) |
| Template choice | `Radio` (`components/ui/choice.tsx`) |
| Customs, stamping, print, remove-document and cancel dialogs | `Modal` (`components/ui/modal.tsx`), FRO-348 confirmation layout |
| Cancel reason | `Textarea` (`components/ui/input.tsx`) |
| Stage arrows | `lucide-react` `ArrowDown`, `aria-hidden` |
| Documents | **New composition** mirroring FRO-347/350 document rows (not importable from main) |
| Toast after save / record | `useToast` (`components/ui/toast.tsx`) |
| EN/EL copy | `useLocale` (`app/providers/labels-provider`) |

## View model (types.ts)

`ExportDetailView` carries: id, customs (`awaiting-ead` / `awaiting-ie599` / `completed`), cancellation, Shipment (number, document type/number), Export type, Shipper, Shipper ΑΦΜ, foreign Invoicing company, MRN, MRN date, Delivered vessel, EAD/IE599 events (date, actor, recorded at), protocol, invoices (number, Supplier, Order, type, VAT status, invoice date, dispatch/return/sent dates, paperwork-only flag) and files. `ExportDetailPermissions` carries `canEdit` and `canCancel`; the controller derives them from future Export authorities (FRO-317).

## Slices

| # | Outcome | Files (all new, under `exports/details/`) | Tests / checks |
| -- | -- | -- | -- |
| 1 | View model, pure rules, labels, page shell | `README.md`, `types.ts`, `export-detail-rules.ts` (editing matrix per stage, MRN normalise/format/used, MRN/EAD/IE599 date windows, Greek ≥1 invoice, Connected Orders, VAT required/retained protocol, stage eligibility, per-invoice minimum dates, ΥΔ grouping ≤5, file validation), `localization/export-detail-labels.ts`, `components/export-detail-layout.tsx` (TopBar, pills, Cancel Export slot, page states, tabs), `components/export-detail-ui-parts.tsx` | TDD unit tests for every rule (Red first); EN/EL key and placeholder parity; layout: tab keys, counts, page states, Cancelled banner |
| 2 | Overview tab | `export-detail-shipment-card.tsx`, `export-detail-identity-card.tsx` (fields, foreign Invoicing company, Edit/Save/Cancel, lock note), `export-detail-customs-block.tsx`, `export-detail-customs-dialog.tsx` | Component tests: Edit only at Awaiting EAD, validation messages, Escape/focus return, failed/stale banners, customs action disabled during edit, dialog date limits, failure keeps date, Confirmed by captions |
| 3 | Invoices tab | `export-detail-invoices-card.tsx`, `export-detail-connected-orders.tsx` | Tests: columns, Paperwork only/New badges, Edit vs Add invoice by stage, locked saved rows, unavailable reasons, Greek minimum, Remove focus, Connected Orders follow the draft |
| 4 | VAT tab, Documents, Cancellation | `export-detail-protocol-card.tsx`, `export-detail-print-dialog.tsx`, `export-detail-stamping.tsx` (three sub-cards, selections, arrows), `export-detail-stamping-dialog.tsx`, `export-detail-documents-card.tsx`, `export-detail-cancel-dialog.tsx` | Tests: protocol three states, print visibility/selection/template/grouping output, stamping only at Completed, Select all/Clear per stage, per-invoice date errors, failure retention, documents upload rules/retry/remove-at-EAD, cancel reason required/1,000 limit, read-only cancelled view, no mutation controls without edit authority |

Each slice: focused tests, `npx tsc --noEmit` (excluding the 2 known baseline TS2352 errors in `delivery-note-service.test.ts` 77/81), `npx prettier --check src/features/exports/details`, `git diff --check`. At the end: full `npm run test` and `npm run build`. No GraphQL codegen or lint script applies (no GraphQL documents; no lint script in `package.json`).

## Browser validation

A temporary, uncommitted local harness mounts the components with the preview fixtures through `vite dev`. Scenarios:

- details edit, then the Customs confirmations and their locks;
- add-only invoices at Awaiting IE599 and Completed;
- stamping across the three stages and ΥΔ printing;
- uploads and document removal, Cancel Export and the cancelled view;
- the role without edit authority;
- loading, error, not found and denied states.

Each runs in EN and EL, at 1280px and 400px, with a clean console. The harness is fixture-based: it proves frontend behaviour only, not server rules or permissions.

## Documentation impact

Only `exports/details/README.md` (activation boundary, state ownership, dependency table, verification commands). No curated docs or generated references change, because no business rule is implemented in production code. FRO-317 owns the business-rule documentation when the backend lands.

## Dependencies blocking integration

| Capability | Missing source | Owner |
| -- | -- | -- |
| Export read, edit, confirm, cancel, protocol, stale checks | No Export entity or operations | FRO-317 |
| Supplier Invoice data, VAT status, stamping events | No Supplier Invoice entity | FRO-321 / FRO-317 |
| Entry Note shared-Export reason | No Entry Note entity | FRO-319 / FRO-317 |
| Export authorities | Not in `features/auth/types.ts` | FRO-317 |
| Export-owned attachments | Attachments support Order/Shipment only | FRO-317 |
| ΥΔ PDF rendering | No ΥΔ templates or endpoint | FRO-317 |
| Route and entry links (FRO-350 Open Export, FRO-348 Related Export) | Not mounted | Integration / follow-ups |

## Gates

1. Planning checkpoint: confirmed.
2. **Plan agreement (now).**
3. Implementation checkpoint: confirm the model is appropriate for implementation before slice 1.
4. Each slice's diff is shown. Nothing is committed without approval, and the user may ask for all four slices to be shown together at the end, as on FRO-350.
5. Before any push: full audited diff, `compare/main...` file list, ruleset evidence (account push=true, admin=false; rulesets returned 403 on FRO-347/348/350), then explicit approval.
