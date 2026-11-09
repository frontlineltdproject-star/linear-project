# Offline reproduction evidence

These are investigation harnesses, not production code or installed portal tests. Baseline: `Frontline-Forwarding/frontline-forwarding` commit `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

## Export to Customs completion — QA-EX-01–06

See [FLOW-EX](../flows/export-to-customs-completion.md), [28 scenarios](../scenarios/export-to-customs-completion.md) and [the review report](../runs/2026-11-09-export-to-customs-completion.md). These observations reproduce current defects and controls; passing is not fix verification.

Use an isolated copy of the pinned client and the existing [audit Vitest configuration](warehouse-vitest.config.ts), saved as `vitest.config.ts`. Place:

- [export-create-qa.test.tsx](export-create-qa.test.tsx) at `src/features/exports/components/export-create-qa.test.tsx`.
- [export-details-qa.test.tsx](export-details-qa.test.tsx) at `src/features/exports/details/export-details-qa.test.tsx`.

Run each with `node node_modules/vitest/vitest.mjs run --config vitest.config.ts --configLoader runner <test-path>`. Parent independent runs: Create 6/6 (14.09 s), Details 15/15 (16.35 s), exit 0. Node 24.13.0 / Vitest 4.1.6; local dependencies, not a clean installation. All 562 original source files matched the archive. Create mounts actual AppShell/memory-router navigation and simplifies DatePicker only; Details mounts actual page/cards/query/dialog/date controls. Synthetic service responses and blocked network. No server persistence or deployed equivalence claim.

[export-customs-guards-qa.py](export-customs-guards-qa.py) accepts the pinned repository root as its required argument. It extracts the actual Java Customs/cancellation/version/date methods and runs 16 controls with Java 11 and DTO/repository/auth/clock/JSON stand-ins. Generated Java is temporary, network blocked, no downloads. Parent run exit 0: valid sequential events and rejection before stand-in persistence for invalid dates/versions/repeats/reasons/stages. No Spring/PostgreSQL/real authorization/transaction rollback execution.

The initial inherited-Entry suspicion was excluded after reconciling the full FRO-319 contract: invoices derive from the owning Order only, not every covered child. Its temporary observation harness is not retained as a bug regression. Detailed VAT printing/stamping remains a later review.

## Supplier Invoice review — QA-SI-01–07

See [the flow](../flows/supplier-invoice.md), [28 scenarios](../scenarios/supplier-invoice.md) and [review report](../runs/2026-11-09-supplier-invoice.md). These tests **observe the faulty behavior** and include controls; passing reproduces a finding rather than proving a fix.

Use an isolated copy of the pinned client with dependencies and the existing [audit Vitest configuration](warehouse-vitest.config.ts). Place:

- [supplier-invoice-create-qa.test.tsx](supplier-invoice-create-qa.test.tsx) at `src/features/supplier-invoices/components/supplier-invoice-create-qa.test.tsx`.
- [supplier-invoice-details-qa.test.tsx](supplier-invoice-details-qa.test.tsx) at `src/features/supplier-invoices/supplier-invoice-details-qa.test.tsx`.

From that client directory:

```text
node node_modules/vitest/vitest.mjs run --configLoader runner src/features/supplier-invoices/components/supplier-invoice-create-qa.test.tsx src/features/supplier-invoices/supplier-invoice-details-qa.test.tsx
```

Parent independently reran each file: creation 4/4 (9.56 s), Details 9/9 (13.13 s), both exit 0. Actual controllers/store/hooks/components run with mocked service/navigation/auth boundaries and blocked network. The creation test remounts pages to model leaving/reopening; real browser/router navigation is not exercised. Details tests inspect registered blocker predicates, not a browser unload dialog. Fixture server responses are synthetic.

All 562 original client source files matched the pinned archive; dependencies were reused locally (Node 24.13.0 / Vitest 4.1.6), not freshly installed from the lockfile. The nine existing Supplier Invoice test files separately passed 71/71 in 80.71 s. First sandbox baseline startup hit linked-cache EPERM; the escalated local rerun passed.

For QA-SI-07, run [supplier-invoice-backend-qa-repro.py](supplier-invoice-backend-qa-repro.py):

```text
python supplier-invoice-backend-qa-repro.py <absolute-pinned-repository-root>
```

Requires Python and Java 11 on PATH for this harness; generates Java in a cleaned temporary directory by default. Optional `--output-dir` retains generated evidence in an explicitly chosen directory. It extracts the unchanged comparison methods and no-op branch from SupplierInvoiceService, runs them with synthetic DTO/vessel lookup stand-ins and a persistence-continuation sentinel, and blocks network. Seven checks passed in the parent's independent run. It does not run Java 25/Spring, SQL, real authorization or transaction rollback. The separate source trace establishes schema reachability and what the real persistence branch writes.


## Origin change — QA-OS-01

Files: [test](warehouse-reproduction.test.tsx) and [Vitest configuration](warehouse-vitest.config.ts).

Use an isolated copy of the pinned `frontline-forwarding-client` with its dependencies. Place the test at that client's root and the configuration there as `vitest.config.ts`. The configuration resolves `#` to that copy's `src` and puts its Vite cache in `.audit-vite-cache`. Run:

```text
node node_modules/vitest/vitest.mjs run --config vitest.config.ts --configLoader runner warehouse-reproduction.test.tsx
```

This runs the actual route, controller and form with fixture service results and controlled query timing. Route search/navigation, location hooks and toast are mocked. Unexpected fetch and GraphQL calls fail; the test does not submit a Shipment. It uses repository test fixture helpers, not live records.

**The three tests assert observed faulty behavior and a control.** Passing means the defect is reproduced. They must be changed to assert the required behavior when turned into fix-regression tests; do not keep an assertion that notes are lost as a product acceptance test.

Observed at the baseline:

1. Uncached origin change unmounts the form; resolving the query restores the original origin and clears the entered note.
2. Country change clears the origin; the form remains absent with the empty-origin query pending/idle and disabled.
3. Cached second-origin candidates keep the form mounted and preserve the note (control).

Independent rerun: 3/3 passed, exit 0; Vitest 4.1.6, Node 24.13.0. All 562 copied client source files were byte-identical to the source archive. Available local dependencies were reused, so this was not a clean lockfile installation. No browser/deployment behavior is claimed by the jsdom run.

## Attachment 401 handling — QA-OS-02

File: [Node harness](repro-upload-401.mjs).

Run with Node 24.13.0 from the pinned production repository's root, passing the absolute path of this script:

```text
node <absolute-path-to-repro-upload-401.mjs>
```

The script reads the actual staging service/hook, security header helper, file-status presentation and Order Create guard. TypeScript is stripped in memory; imports and React hooks are replaced with local shims. Fetch is replaced with an in-memory function and uses a fictitious `.invalid` URL and a dummy token. The script makes no network calls or business writes.

Expected output: five JSON result rows (`open401`, `upload401`, `upload403`, `network`, `success`) and the final PASS line. Node also emits an experimental TypeScript-stripping warning.

Both 401 cases display the exact reported `Refused: Request refused (401)` label and block Create; removing the rejected file unblocks it. A fetch exception displays `Upload failed`; successful staging produces Ready. Both REST stages include the dummy bearer header.

This is a client-path demonstration, **not** a reproduction of the backend's reason for returning 401. It does not simulate the real React runtime, successful navigation, real authentication, object storage or servlet error dispatch. Calling its stubbed Create callback twice in the success case is not evidence of duplicate Orders.

## Related existing test run

The five unchanged Shipment client files listed in the run report produced 54 passing tests. Two React `act` warnings appeared in an existing form test. This subset did not catch the mounted-route refetch defect.

No source fix was made. Full frontend/backend suites and the complete deployed Order-to-arrival journey remain unexecuted.

## Second-pass Order and Shipment evidence — QA-OS-05–13

See [the second-pass report](../runs/2026-11-09-order-to-arrival-second-pass.md) for triggers, source references, limits and ticket-group proposals.

Copy [order-flow-audit.test.tsx](order-flow-audit.test.tsx) and [shipment-flow-audit.test.tsx](shipment-flow-audit.test.tsx) to the same isolated pinned client root used above. Reuse the existing [Vitest configuration](warehouse-vitest.config.ts) as vitest.config.ts. They use actual components, services and mappings with fixture data and blocked/mocked network boundaries. Run:

```text
node node_modules/vitest/vitest.mjs run --config vitest.config.ts --configLoader runner order-flow-audit.test.tsx shipment-flow-audit.test.tsx
```

Parent independent single-file runs: Order 9/9, Shipment 7/7, both exit 0. Node 24.13.0 / Vitest 4.1.6; existing local dependencies, not a clean lockfile install. The tests capture faulty payloads/state and controls; **passing reproduces defects, not fixes**. Actual backend persistence is mocked, including the comment recipient's ID-keyed replay.

For packing omission, [shipment-backend-repro.py](shipment-backend-repro.py) takes the pinned repository root and a Java 11 executable:

```text
python shipment-backend-repro.py <absolute-pinned-repository-root> <absolute-java-11-executable>
```

It extracts the exact production Java resolution statements and helpers into a temporary source-file test. DTO/ArgumentValue stand-ins provide getters; only Nullable type annotations are removed. It changes no production source. Python/Java networking is blocked. The generated Java file is temporary and cleaned up; no artifacts are written into the source checkout or this planning repository.

Parent reran the saved portable script: five weight behavior checks plus the active network guard passed, exit 0. It also checks the actual history write/read and SQL guard statements. **Those static assertions do not execute the historical journey or database.** Full Java 25/Spring/PostgreSQL integration remains pending. The source checksums printed by the script are evidence fingerprints, not a successful policy-loader fingerprint.

QA-OS-13 remains source-established pending integration; QA-OS-05–12 have the narrower runtime evidence described in the report. No browser/deployed-build or full-flow pass is claimed.

## VAT-exemption paperwork — QA-VAT-01–09

See [the VAT review](../runs/2026-11-09-vat-exemption-paperwork.md) for the nine findings, qualified observations, coverage and source references. Named main is 6aa259553cd9c86a8aaa157902088aa9a6bca83e. All 562 original client source files match that archive.

Use an isolated copy of that pinned client with dependencies, the # alias to src, jsdom and the existing repository test helpers. Place the retained files at these client-relative paths (relative imports depend on placement):

| Evidence file | Destination |
| --- | --- |
| [vat-print-qa.test.tsx](vat-print-qa.test.tsx) | src/features/exports/details/vat-print-qa.test.tsx |
| [vat-bulk-qa.test.tsx](vat-bulk-qa.test.tsx) | src/features/exports/details/vat-bulk-qa.test.tsx |
| [vat-single-qa.test.tsx](vat-single-qa.test.tsx) | src/features/supplier-invoices/vat-single-qa.test.tsx |

Run from that isolated client:

```text
node node_modules/vitest/vitest.mjs run src/features/exports/details/vat-print-qa.test.tsx src/features/supplier-invoices/vat-single-qa.test.tsx --configLoader runner --no-cache
node node_modules/vitest/vitest.mjs run src/features/exports/details/vat-bulk-qa.test.tsx --configLoader runner --no-cache
```

Parent reruns: 70/70 then 31/31, both exit 0. Existing export-detail-vat-docs, export-detail-rules, export-detail-mapping and supplier-invoice-export tests separately passed 53/53 (four files). Total 154 frontend checks. Node 24.13.0 / Vitest 4.1.6; cached dependencies, no clean lockfile installation. The runner loader avoids the default bundled-config temporary write under linked dependencies. Memory-router cases emit jsdom Window.scrollTo diagnostics, not test failures.

Actual production page/dialog/DatePicker/query components are mounted with synthetic services and blocked real fetch/XHR/WebSocket. Print popup/blob plumbing is mocked. Bulk navigation uses actual memory-router POP and remount; individual navigation tests inspect real guard predicates under a mocked router hook. Neither is a complete native-browser/authenticated journey. No callback-only reproduction is represented as a real click.

These are **observation and control tests, not fix-regression assertions**. Passing observations reproduce current defective behavior. B4 replay-count wording and conditional all-rejected/Completed-membership fixtures are explicitly qualified in the report, not additional confirmed bugs. Leaf-only missing-record recovery behavior is distinguished from actual Details unmounting.

[vat-paperwork-guards-qa.py](vat-paperwork-guards-qa.py) executes extracted actual stamping/grouping methods with Java 17:

```text
python vat-paperwork-guards-qa.py <absolute-pinned-repository-root> --java <absolute-java-17-executable>
```

Parent executed the retained script twice, 40/40 controls and exit 0 both times. It generates and cleans a temporary Java source file, extracts 12 stamping and five YD method bodies, prints their fingerprints and uses synthetic DTO/repository/clock/authorization stand-ins. Python/Java network is blocked. Default host Java 11 is insufficient for its record/switch syntax; the explicit Java 17 executable was used.

It does not run Spring, real authorization, SQL/transactions/row locks, PDF rendering or project Java 25. No complete persisted workflow, production deployment, real PDF content or backend concurrency pass is claimed. No production source fix, live event, email, AADE or database mutation was performed.
