# FRO-326 local frontend handoff — 23 October 2026

The approved supported-now implementation is prepared for diff review. Full FRO-326 remains incomplete until its dependent contracts are available. No production branch, commit, push, PR, deployment, Cloudflare change or Linear write was performed in this implementation turn.

## Review artifacts

- Complete 12-file diff, including four new files: [fro326-frontend-preparation.patch](fro326-frontend-preparation.patch). Reverse-apply validation against the working tree passed.
- Checkout: `C:/Users/Giorgos/.codex/visualizations/2026/10/22/01a163f5-80c0-7fb3-8999-7cad88dd874f/fro326-frontend`.
- Repository: `Frontline-Forwarding/frontline-forwarding`; detached HEAD and fetched main: `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.
- Committed policy fingerprint: `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`.
- Actual app with fictional fixtures: http://127.0.0.1:8341/secured/purchase-orders/42 . This differs from the full target static prototype at port8327. Local servers must be restarted after shutdown.
- Screenshots in the visualization directory: `fro326-app-collis-desktop.png` and `fro326-app-overview.png`.

## Implemented scope

Production Card/Table/Tabs/Popover/Modal primitives support the Overview grid, prominent page-local status badge, compact read-only colli measurements and independent two-column expansions. Trace links remain separate from expansion controls; terminal collis remain inspectable and excluded from stock entry. Missing values remain missing. Reminder unavailability uses contextual information instead of persistent explanatory text.

A single action controller retains drafts across tabs and language switches and resets them on Order identity changes. Navigation asks before discard; pending commands prevent discard and lock their inputs. Errors retain drafts and successful commands clear their own form. Split and disposition reasons are independent. Reminder pending state survives tab changes, preventing duplicate submission through unmounting. Existing permissions, standalone Edit, command payloads, attachments/provenance, route query states and stock confirmation remain intact.

Eight existing files and four new files change, all under `frontline-forwarding-client`: detail/controller and its tests, colli table, help composition, reminder and tests, status pill, translations, shared Tabs/Modal opt-in props and implementation documentation. No backend, API schema, generated sources, manifest or lockfile changes are included.

## Verification and limits

| Check | Result |
| --- | --- |
| Full Vitest suite | 40 files, 169 tests passed; final run 10:12:53 local, 30.79s |
| Production build | Passed, 6.82s |
| Changed-file Prettier | Passed for all 12 files |
| Diff whitespace / reverse patch check | Passed |
| Typecheck | Two existing TS2352 failures in untouched `delivery-note-service.test.ts`, lines77/81 |
| Repository format check | 261 pre-existing/unrelated files remain; baseline269 |
| Clean dependency installation | `npm ci` fails pre-existing manifest/lock mismatch; local verification used `npm install --package-lock=false --no-audit --no-fund` |

Node24.13.0/npm11.6.2 were available; repository guidance prefers Node22.13.0. The local installation cannot establish reproducible clean installation. Sandbox Vitest initially hit EPERM before tests; verification succeeded outside that restriction. No tracked dependency files changed. Generated route ordering drift from Vite was restored and excluded.

Browser checks used the actual application with an external localhost fixture API, fixture-only session and both API URLs explicitly pointed at it. Checked desktop and400px EN/EL, independent expansions, trace URLs, terminal records, reader/editor visibility, stock cancellation/active rows, inherited read-only attachment, empty/loading/error/not-found, help focus/hover/click/Escape, draft retention, navigation confirmation, and failed/pending commands. Final captured error log was empty; the existing route code-splitting warning was observed earlier. This does not verify live backend authorization, concurrency, idempotency, transactionality or actual touch hardware.

Temporary fixture configuration/data remain outside the production checkout at `../fro326-fixture`, API8340/app8341. After build and browser verification, the local-only Vite config filters TanStack development plugins to prevent rewriting the unchanged generated route tree; the app was visibly rechecked. Production Vite configuration is unchanged. The fixture harness is not delivered production code.

## Independent review and rulings

One independent final code review found that inputs edited during a pending command could be cleared by its response. Fixed with disabled fieldsets and a failing-then-passing regression. A possible popover remaining visible after tab changes was checked in the browser and did not reproduce. A separate reproduced hover/focus/click closing bug was fixed with an explicit show handler and regression. No actionable review finding remains deferred in this supported scope.

Reviewer-declined domains: browser geometry/focus were checked by the implementer; backend guarantees, live integration and absent dependent APIs remain unverified/out of scope. Existing type/format/install failures were checked separately. Two shared primitives gained optional props (`keepMounted`, `ariaLabel`) to preserve pending state and dialog accessibility; other callers retain previous behavior. Production commits required by generic execution guidance were deliberately deferred under the user's explicit instruction; the execution ledger remains local.

## Remaining contracts

FRO-346 owns atomic/versioned Details/readiness saves; FRO-303/356 restricted Invoice company/ALK corrections; FRO-333/334/356 explicit Pickup/customs; FRO-292 independently scoped Notes; FRO-337 invoice unit-price/versioned editing; FRO-294/295/297/332 final colli fields and inline mutations; FRO-328 prepared/idempotent email review; FRO-349/355 with FRO-353/354 Supplier Invoice/Entry Note routes. Existing Edit stays until parity. Current direct-send reminders and legacy bonded values are preserved without pretending to implement these future contracts.

Next gate: user reviews this complete diff and verification limitations. Branch creation, production commit/push and all publishing remain deferred. Planning repository synchronization is separate and required by its project instructions.

## Heading follow-up

The user requested removal of Client · Vessel from the top Order card. The subtitle paragraph was removed and the running React preview visibly verified; complete patch refreshed and reverse-apply checked. Prettier and diff checks pass. The full suite/build evidence above predates this four-line presentation-only removal; no domain or API behavior changed.
