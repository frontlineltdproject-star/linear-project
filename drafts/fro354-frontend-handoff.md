# FRO-354 — frontend handoff (push gate)

## Proposed publication

- Repository: `Frontline-Forwarding/frontline-forwarding` (remote `github` in `C:/ffx/fro354`, verified URL)
- Branch: `mock/fro-354-customs-storage-entry-details` (absent on the remote, checked 2026-10-27)
- Base: `main` 5c51030680c9d45b3827a7e19b8320c19aa5ed9a (re-fetched before the gate, unchanged)
- One commit: `feat(FRO-354): prepare Customs Storage Entry details UI`
- Push: `git push github mock/fro-354-customs-storage-entry-details:mock/fro-354-customs-storage-entry-details`
- No PR, merge or deployment.

## Diff

`drafts/fro354-frontend-preparation.patch` — 15 added files, +3,469, all under
`frontline-forwarding-client/src/features/customs-storage/details/`, nothing
modified or deleted elsewhere. SHA-256 e7fe3050…82ebcf.

| File | Lines |
| -- | -- |
| README.md | ownership, controller duties, activation dependencies |
| types.ts | view models |
| customs-storage-details-rules.ts (+ test) | money, coverage, validation, one editor, Change Order options |
| localization/customs-storage-details-labels.ts (+ test) | EN/EL |
| components/customs-storage-details-layout.tsx | header, return context, banner, tabs, page states |
| components/order-relationship-card.tsx | facts, Change Order picker, rejection |
| components/change-order-dialog.tsx | confirmation with warehouse warning |
| components/entry-details-card.tsx | read / edit of ten fields, Created by, warehouse notice |
| components/related-invoices-card.tsx, related-export-card.tsx | read-only invoices and Export |
| components/discard-changes-dialog.tsx | Back to Order with a changed draft |
| components/customs-storage-details-ui-parts.tsx | local copies of FRO-353 parts + EditButton / EditActions |
| components/customs-storage-details-ui.test.tsx | component tests |

## Verification (Node 24.13; 22.13 not installed)

- Rule tests Red 14/14 on stubs, then Green 14/14.
- Focused `src/features/customs-storage`: 3 files, 41/41.
- Full `vitest run`: 45 files, 243/243.
- `npm run build`: exit 0 (`src/routeTree.gen.ts` rewritten by the build, restored).
- `tsc --noEmit`: only the 2 baseline TS2352 in `delivery-note-service.test.ts`.
- `prettier --check src/features/customs-storage`: clean. `git diff --check`: clean.
- Secret scan: no hits (one "token" in a type comment about the version).
- Browser (temporary harness, deleted; copy in the session scratchpad): one-editor hint, validation + focus on the first invalid field, draft kept across tabs and EL, save → read-only + focus Edit + toast, Change Order reasons (current, covered here, other, Open), chosen Order kept in the field, dialog warning only for another warehouse, Escape closes dialog and keeps the editor, confirm → subtitle, tab count, Unknown/Missing, warehouse notice, permit kept, toast, Back link unchanged; rejected / stale + Refresh / failed keep the draft; Back to Order without changes leaves, with changes asks (Keep editing keeps); view-only no Edit; loading, load error + Retry, not found, denied, created toast, no invoices, mixed currency, 2 of 3 Export; Greek at 400px no page overflow, invoice table scrolls; arrow/End tab keys; console clean.
- Fix found in the browser: Greek "Καθαρισμός ημερομηνίας" squeezed the MRN date picker at 400px; the row now wraps. FRO-353's branch has the same pattern (not changed here).

## Enforcement evidence

`gh api …/rulesets` → 403 (plan), `…/rules/branches/<branch>` → 403, `…/branches/main/protection` → 404. Same gap as FRO-350/352/353: nothing on GitHub restricts this identity to mock branches. Account permissions: push true, maintain true, admin false.

## Backend dependencies (activation)

FRO-319 reads (entry, Order search with eligibility, creator), edit with version, Change Order, authorities; FRO-356 regime/admission; FRO-321 invoices; FRO-317 Export; route and entry points (FRO-354 route, FRO-355 Open, FRO-353 landing, FRO-358 Print/list).
