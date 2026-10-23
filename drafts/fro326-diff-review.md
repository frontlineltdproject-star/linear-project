# FRO-326 — diff review and branch scope

Reviewed 23 October 2026 after the user approved the full React preview. Publishing remains deferred. This is a code/scope review, not approval to create a production branch or a claim of completed integration.

## Evidence

Planning pull succeeded. Current FRO-326 and eight principal owner issues were refreshed from Linear; target updatedAt remains 2026-10-23T06:26:49.637Z. Production main verified with authenticated gh remains 3820e89e8caa341261e2d48bcb282d93e1bb1d03. The saved26-file patch reverse-applies cleanly to the isolated checkout; tracked diff whitespace check passes. No production source changed in this review.

Inspected the route/controller, shared primitive diffs, Notes, Details validation/review, row save/operations, exact totals, reviewed email/document actions, page composition and dev callbacks/imports. Tests were not rerun for this read-only review. Previous evidence:45files181tests; production build before final mobile/dev-only changes; final typecheck has two existing delivery-note test casts. Existing lock mismatch and repository formatting drift remain unresolved. The prior successful suite is not proof of full specification coverage.

## Frontend findings to correct before handoff

1. **P2 — Current warehouse presentation omits the storage position.** purchase-order-detail.tsx:257 renders currentWarehouseStay.warehouse.name. FRO-326 requires warehouse.code · storagePosition, localized Unpositioned for null position, and missing-value fallback for no stay. Both fields already exist (history consumes them at421–423); this is a frontend correction, not a backend dependency.

2. **P2 — Unrelated locked ALK can block an Invoice company correction.** order-details-editor.tsx:108 validates the complete draft's ALK for every mode, including invoiceCompany, even though that mode submits only Invoice company and locks ALK. With a legacy nonconforming ALK, users cannot save a valid unrelated correction or fix the blocked field in that session. Scope client validation to affected/applicable fields; the authoritative adapter must still enforce owning rules. This also matters for unrelated ordinary changes to legacy values.

3. **P2 — Customs applicability is not reflected in the prepared controls.** order-details-editor.tsx:271–289 renders supplied regime/ALK fields and unlocks them in ordinary mode without considering draft Greece or regime. The dev composition supplies both fields unconditionally. Greece=No still offers regime/ALK editing, and a non-Αποταμίευση regime still offers ALK. The dev save subsequently clears them, with review text. Explicit clearing review is useful but does not replace conditional applicability. Make the inapplicable controls unavailable while retaining incompatible draft values for explicit resolution. This UI behavior can be prepared now; real warehouse capability/coverage validation remains FRO-356.

These findings qualify the earlier broad statement that UI preparation was complete. The approved visual direction stands. No redesign or new product decision is needed; fix the agreed behavior and add regression coverage before presenting the final handoff diff.

## What belongs in the frontend preparation branch

| Layer | Included in current26-file diff | Activation |
| --- | --- | --- |
| Existing Order route | Revised Overview/status display, removed header subtitle, added supported read fields, agreed tab order, compact read-only collis/expansion, contextual reminder help, retained command drafts/navigation guard | Connected to current existing APIs. Old Edit and current reminder command remain until replacement parity. |
| Reusable target components | Internal/External Notes, shared Details/restricted correction review, independent editable colli/invoice rows, exact decimal totals, shared prepared-email review, document action states, six-tab page | Component code prepared; new operations are not wired into the real Order route. |
| Local review composition | dev/fro326/index.html and review.tsx, fictional scenario/access/failure examples, local history/comments/document/lifecycle illustrations | DEV/loopback only. No production API calls. Refresh resets fixture state. No real uploads/email/document navigation. |
| Shared primitives | Optional Modal ariaLabel, TabPanel keepMounted, optional status-pill className | Opt-in; existing callers keep defaults. |
| Supporting delivery | Focused tests, EN/EL text, client implementation/dependency documentation | Included in branch review. |

Eight modified files and18 new files, all under frontline-forwarding-client. No backend/schema/migration/generated binding/manifest/lock changes. External fixture API/server configuration, planning repo records, static8327 prototype and screenshots are not production branch source. The large detail diff includes moving existing action rendering into a retained controller, not26 independent new business features.

Merging this preparation alone would NOT make the approved full preview the normal live page. That final assembly and real adapter integration remain FRO-326 work. History/comments/attachments already have contracts, so their final layout/assembly is remaining frontend work, not an external backend blocker.

## Actual integration blockers

| Area | Missing requirement / owner |
| --- | --- |
| Notes | FRO-292: separate fields, notes-only versioned save, server confidentiality, legacy migration, split/PDF rules. UI hiding does not enforce privacy. |
| Details / readiness | FRO-346: atomic permitted fields plus correction, authorization/version/conflict/audit. Keep old Edit until parity. |
| Restricted corrections / customs | FRO-303 and356: real eligibility, fiscal/regrouping/registration impacts, shared coverage and conflict resolution; FRO-333/334: nullable Pickup and collection-agent cleanup. |
| Colli editing | FRO-297 flags and294/295/332/356 coordinated retirements; an explicit owner/contract for safe independent row persistence is still needed. Current full-collection reconciliation can cancel omitted collis and lacks reviewed-version protection. |
| Invoice rows | FRO-337: persisted Unit price, exact transport/server total, version-safe update. Client arithmetic is only presentation/validation. |
| Readiness emails | FRO-328: prepared content/token, explicit idempotent confirmation, queue/delivery/audit. Current direct-send integration is preserved, not silently repurposed. |
| Supplier Invoice / Entry Note | FRO-349 after321/347; FRO-355 after319/353/354: actual entities, authorized lookups/coverage and destination pages. Local navigation callbacks are not delivered workflows. |
| Legacy field removal / Edit retirement | Coordinate owning cleanup contracts; retire old editing route only after full retained capability parity and integration checks. |

FRO-330 is downstream, not a prerequisite. Release sequencing remains unresolved: FRO-326 milestone0.0.5 requires3490.0.6 and3550.0.11. This is a planning/release gap, not permission to cut scope or alter metadata.

## Next step

Correct the local frontend findings, test the affected behavior and regenerate the exact diff. Then the branch can be considered as an explicitly incomplete frontend preparation handoff. Real API adapters can integrate feature by feature (Notes immediately after292); they need not wait for every unrelated dependency. Do not mark326 complete or retire old Edit on the strength of the prototype.

No branch creation, production commit/push, Linear update, Cloudflare action or deployment was performed. Planning records are synchronized separately under AGENTS.md.
