# FRO-352 — frontend handoff (mock branch)

- Branch: `mock/fro-352-export-details` on `Frontline-Forwarding/frontline-forwarding` — https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-352-export-details
- Base: `main` 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Head: dc8d3a9171659a81843543a170c173c950494d33 (4 ahead, 0 behind).
- Pushed 2026-10-26 with `git push github mock/fro-352-export-details:mock/fro-352-export-details` after explicit user approval; the user accepted the branch-protection gap for this branch (rulesets API 403, `main` has no protection).

| Commit | Slice |
| -- | -- |
| 3fac97b | Shell, page-side rules (TDD), EN/EL labels, README |
| 82dda0c | Overview: Shipment card, Export details edit, Customs block and dialog |
| 46ac13a | Invoices tab: Informative List editing by stage, picker reasons, Connected Orders |
| dc8d3a9 | VAT tab (protocol, Print ΥΔ, stamping), Documents, Cancel Export |

Scope: 24 new files under `frontline-forwarding-client/src/features/exports/details/`, 5,676 insertions, no existing file changed. Unmounted components on UI view models; no route, service, GraphQL, authority, dependency or backend change. Shares no file with `mock/fro-350-export-create`; local copies of FRO-350's ui parts are flagged in the folder README for de-duplication.

Verification (Node 24.13; 22.13 not installed): focused 72/72; full suite 48 files / 274 tests; `npm run build` passes; `tsc` only the two baseline TS2352 casts in `delivery-note-service.test.ts` (134/138); prettier and `git diff --check` pass. The build's `routeTree.gen.ts` route-order churn was restored and is not in the branch. Temporary browser harness (removed): desktop and 400px, EN/EL, all tabs and fixtures, viewer role, no console errors. Remote diff verified byte-identical to the reviewed patch (SHA-256 2be5a20d4d6a6c4e530c44eeaa8a13626d5b06a469d07dbf447bd21156be3a16).

Blocked integration (owners): Export entity/operations, authorities, Export attachments and ΥΔ PDF endpoint (FRO-317); Supplier Invoice data and stamping events (FRO-321); Entry Note reason (FRO-319); route and entry links (integration / follow-ups).

No PR, merge, deployment or Linear change. A Linear link to this branch needs separate approval.
