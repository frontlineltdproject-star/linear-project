# FRO-361 Details UI preparation

Prepared against Frontline-Forwarding/frontline-forwarding main **5774931b9869247f0247013111a452552403f456**. Live main rechecked unchanged. Work remains detached and uncommitted in:

C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b157-f4aa-77b3-ab01-1dc2d0c938d7/fro361-frontend

Playbook: committed **b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc**. Both model checkpoints and the implementation plan were accepted. Native execution completed with one independent review.

## Delivered

- Single Details tab, Document → Movement → Goods covered, actual portal components and semantic theme.
- Stored per-note identity, status, fiscal data, recipient/movement, goods and totals; no mutation hooks or automatic preparation.
- EN/EL; loading, unavailable/access-denied and error handling; English/Greek unsaved-draft PDF explanation.
- PDF guards for all six statuses, duplicate-request prevention, safe late completion on identity changes and pending-state preservation on same-note refresh.
- Open Shipment/back/retry callbacks with selected IDs. Host integration contract and backend dependencies in feature README.

Nine eligible files: one labels-provider update and eight new feature files. No routes, generated API, backend, authorization, schema, database, dependency, lockfile or shared-theme changes. The fixture harness is outside the production checkout.

## Verification

| Check | Result |
| -- | -- |
| Feature tests | **20 passed**, including Red→Green same-note refresh regression |
| Full suite, Node 22.13.0, maxWorkers=2 | **246 passed / 46 files** |
| Production Vite build, Node 22.13.0 | Passed; existing large-chunk warning |
| Browser, headless Edge | **48** combinations: 1440/400px × EN/EL × 12 states; plus PDF failure/pending/identity-switch, navigation by keyboard and retry |
| Browser errors/failed requests/external requests | **0 / 0 / 0** |
| Visual inspection | Desktop and Greek mobile screenshots checked; headings and action placement corrected to live tokens/approved layout |
| Scoped Prettier | Passed |
| Whole-project TypeScript | Two existing cast errors at delivery-note-service.test.ts:134 and :138; no new feature errors |
| Whole-project Prettier | Existing failures in 283 files; scoped files pass |
| Diff | Whitespace check and reverse applicability of complete patch passed; only eligible paths |

The first full run on the host Node24 with default parallelism timed out in three existing ShipmentComposer tests: allows selected collis to be placed in an optional load unit; requires a child-PO decision for a partial PO selection; applies one split reason and remark to multiple child POs. The rerun on project-standard Node22 with two workers passed. The full suite was rerun after the review correction and passed 246 tests. No test timeout thresholds or unrelated tests were changed.

Environment: package and pnpm-lock hashes matched the dependency source. A dependency junction was used; pnpm's run command automatically materialized locked packages in the shared dependency folder. Subsequent checks used direct Node entrypoints. Intent discovery succeeded with package-variant warnings; the discovered react-router skill file was unavailable. This implementation does not change routing. No tracked package/lockfile changes occurred.

## Review and decisions

Independent review found one P2: keying the action component by version/status/saved-state could reset the in-flight guard during a refresh of the same note. A regression test failed, the key was narrowed to Shipment/note identity, and focused/full tests passed. No other actionable findings were reported.

The shared Heading/cn composition loses its custom size class when combined with text-fg. Feature call sites explicitly reapply text-title/text-heading; no shared primitive was modified.

## Evidence and diff

- [Complete patch](fro361-frontend-preparation.patch)
- [Manifest](fro361-frontend-evidence/manifest.json)
- [Desktop](fro361-frontend-evidence/desktop.png)
- [Greek mobile](fro361-frontend-evidence/mobile-el.png)
- [Disabled draft PDF, Greek mobile](fro361-frontend-evidence/unsaved-mobile-el.png)
- [Browser result](fro361-frontend-evidence/verification.json)
- Full/focused tests, type/build/format logs and Red regression output are in the same evidence folder.

Patch SHA-256: **8f185f8f4bb458bd12dd65605e0df19200129b972b74ea574a9614642cf8169b**.

Local fixture review: http://127.0.0.1:8771/ (this machine only). State/language controls are under Design review. It demonstrates real components and simulated callbacks; it is not live portal integration.

## Remaining boundaries

The feature is unmounted. FRO-361 still needs authorized single-note reads including cancelled records, Shipment/company display data, shared draft-state context and real route integration. List/navigation/search implementation remains required by FRO-361 and outside this Details-focused preparation. Fixture checks cannot verify production authorization or PDF generation.

Publication is blocked by the required ruleset enforcement check (GitHub HTTP 403) and existing non-clean project type/format checks. No FRO-361 exceptions have been granted. No production branch, commit, push, PR, merge or deployment occurred; no further Linear write was made during implementation.

Proposed later branch: mock/fro-361-delivery-note-details (remote name was unused when checked). Proposed commit: feat(FRO-361): add read-only Delivery Note Details UI mock. Only after blockers are resolved and the final diff is explicitly approved may this branch be created, committed and pushed with the exact same-name refspec.

