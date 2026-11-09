# Customs Storage Entry — reproducible isolated evidence

Source main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; [review and findings](../runs/2026-11-09-customs-storage-entry.md). Use an isolated copy of this pinned client, never a live portal/database. All fixtures are synthetic; no source fix is contained here.

## UI

Copy these files to the isolated client root, preserving their names:

- [Create tests](customs-storage-entry-create-qa.test.tsx)
- [Details tests](customs-storage-entry-details-qa.test.tsx)
- [Order shortcut tests](customs-storage-entry-card-qa.test.tsx)

Use the unchanged production `src/`, a jsdom Vitest configuration with `#` pointing to `src`, one worker and a scratch cache. The retained [configuration example](warehouse-vitest.config.ts) is suitable after resolving its source alias for the chosen copy. Dependencies were reused from an existing local installation, not freshly installed from the lockfile. Tested Node 24.13.0 / Vitest 4.1.6.

```text
node node_modules/vitest/vitest.mjs run --configLoader runner customs-storage-entry-create-qa.test.tsx customs-storage-entry-details-qa.test.tsx customs-storage-entry-card-qa.test.tsx --no-cache
```

Parent combined run used shorter scratch names (`cse-create-qa`, `cse-details-qa`, `cse-card-qa`) for the exact same files. **27/27 passed, exit 0**: Create 11 (4 controls, 6 observations, 1 conditional branch), Details 13 (4 controls, 9 observations), shortcut 3 (2 controls, 1 observation). This is **16 defect reproductions, 10 controls and one excluded conditional case**, not 27 passing product scenarios. Existing feature subset separately passed 115/115 in 12 files:

```text
node node_modules/vitest/vitest.mjs run --configLoader runner src/features/customs-storage --no-cache
```

Actual page/card/form components, mapping, localization and query hooks run. Services/GraphQL responses are synthetic boundaries. Two navigation tests use actual TanStack memory history/Link/RouterProvider; other navigation is mocked. Create async navigation failure uses an injected rejected Promise with a harness catch to observe it safely. Fresh-record tests wait for actual UI notification before Save. The stock shortcut test submits the actual stock form into a mocked GraphQL boundary, runs the production mutation's invalidation and observes actual QueryClient refetches. No stock movement was persisted.

Fetch/XHR are blocked. The real-router Details probe emitted three jsdom scrollTo notices, with navigation/remount assertions passing; no visual scroll/browser claim. Passing observation assertions explicitly reproduce faulty current behavior; convert them to correct-outcome regression assertions when implementing fixes.

The inherited-entry Create recovery test is labelled conditional: a supported initially-eligible-to-inherited transition was not established. Do not count it as a defect or production scenario.

## Backend

[Portable harness](customs-storage-entry-backend-qa.py) and [detailed source/limit notes](customs-storage-entry-backend-notes.md).

```text
python customs-storage-entry-backend-qa.py <absolute-pinned-repository-root> --java <absolute-java-17-executable> --scratch <isolated-output-directory>
```

Parent ran the final retained file: **155 control assertions, exit 0, zero separate backend defects confirmed**. It compiles 39 extracted production source files, preserving their business bodies. Package/import/framework annotations are removed; Lombok constructors are supplied; `getFirst()` becomes `get(0)`; Java 17 preview supports pattern switches. Actual User company predicates and role authority mappings are included, with mismatched staff-role/partner-company denial controls.

Repositories, admission resolutions, unrelated entity shapes, fixed clock and JSON serializer are fixture substitutes. Audit map construction is checked; real JSON encoding, JDBC/SQL, row locks, native transaction rollback and concurrency are not. Source manifest and output are written only to scratch. Python networking is disabled; Java connect/listen/accept is denied and a self-check confirms denial. The Java17 SecurityManager deprecation warning is expected.

Temporal admission/split/weight queries, schema constraints, transactional counter and authenticated HTTP/GraphQL paths were read separately. They were **not executed** by these controls. Java25/Gradle native suite was not run because the required runtime/dependencies were unavailable in the inspected environment. Full deployed-browser/SQL/native-auth journeys remain unverified.

No Export/VAT operation, FRO-358 output, production source edit, branch, deployment, portal/database write, email or AADE operation is part of this evidence.
