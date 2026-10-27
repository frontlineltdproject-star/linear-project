# FRO-353 — frontend handoff (step 4e, published)

**Published:** `mock/fro-353-customs-storage-entry-create`, commit 4c5a3eb1cf99147736b9c54e56a2da29fa58d480 on base 5c51030; remote head verified, 1 ahead / 0 behind main, 14 added files only under the folder, remote diff byte-identical to the audited patch. https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-353-customs-storage-entry-create

- Playbook: FRO-353, HEAD 5c51030, policy committed, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc.
- Base: `main` 5c51030680c9d45b3827a7e19b8320c19aa5ed9a (re-fetched before the audit, unchanged). Isolated clone `C:/ffx/fro353`.
- Diff: 14 new files, all under `frontline-forwarding-client/src/features/customs-storage/create/`; nothing else changed. Full diff: `drafts/fro353-frontend-preparation.patch` (3,186 lines, SHA-256 9e7e596d77a32c669b57e15e689fd00ae80057e599af49c2e6bb3c6d7854875a).
- Pushed with `git push github mock/fro-353-customs-storage-entry-create:mock/fro-353-customs-storage-entry-create` after explicit approval; the user accepted the enforcement gap below.

## Checks (Node 24.13; repo asks 22.13, not installed)

| Check | Result |
| -- | -- |
| Rule tests Red first | 20/22 failed on stubs (2 matched the stub's neutral return), then 22/22 green |
| Focused `vitest run src/features/customs-storage` | 3 files, 44 tests pass |
| Full `vitest run` | 45 files, 246 tests pass |
| `npx tsc --noEmit` | Only the 2 baseline TS2352 in `delivery-note-service.test.ts` |
| `npm run build` | Passes; regenerated `src/routeTree.gen.ts` restored |
| Prettier, diff check, secret scan | Clean |

Component tests were written alongside the components, not Red-first.

## Browser check (temporary harness, deleted; copy in the session scratchpad)

Every scenario: Order search with eligible and ineligible results and reasons in FRO-319 order, Open for covered, arrow keys through all rows, Enter ignored on ineligible, Escape restores the selected Stock ID; loading, error + Retry; preselected eligible / ineligible / covered / not found; access denied; admission and parties with Unknown/Missing markers; prefill hints, permit hint with no single licence, edited prefill kept on Order change; €803.62 / 0.00 / 192.87 footer; mixed-currency alert without footer; "2 of 3" Export note; validation summary with focus on the first invalid field and Overview opened; Creating… state; created elsewhere + Open; failed; lost response → checking → not created; Cancel clean vs discard dialog (Keep editing / Escape return focus to Cancel, Discard leaves); draft kept across tabs and EN/EL; arrow-key tabs. EN and EL at 400px: no page overflow, invoice table scrolls inside its card. Light and dark themes. No console errors on a clean load.

Fix during the check: invoice numbers wrapped at the hyphen; cell now `whitespace-nowrap`.

Script-only artefacts (not bugs): `requestAnimationFrame` does not run while the pane is unfocused, so focus moves were checked with a timer stub; Cancel clicked by script was not focused, so focus return was checked after focusing it; one `createRoot` error came from hot-reloading the harness entry.

## Enforcement evidence

`gh api .../rulesets` → 403 (needs GitHub Pro); `.../branches/main/protection` → 404 (no protection). The account has push and maintain, not admin. No server-side rule restricts this identity to its own mock branches: the same gap accepted for the FRO-350/352 branches.

## Dependencies blocking integration

FRO-319 reads, create operation and authorities; FRO-356 (unmerged); FRO-321 invoices; FRO-317 Export; route, FRO-355 entry point, FRO-354 target, FRO-358 menu. Listed in the folder README.
