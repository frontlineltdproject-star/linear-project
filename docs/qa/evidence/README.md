# Offline reproduction evidence

These are investigation harnesses, not production code or installed portal tests. Baseline: `Frontline-Forwarding/frontline-forwarding` commit `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

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
