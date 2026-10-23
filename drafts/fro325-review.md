# FRO-325 review — 23 October 2026

Read-only review against live main `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. Linear target updated 20 October 2026, Todo, Pending_Review/Backend/Epic/Shipment, unassigned, no priority, Pre-releases 0.0.x / 0.0.7. Two existing attachments; blocks FRO-316/FRO-341, no blockers. Preserve all metadata/relations/attachments.

## Findings

1. **Conflicting quantity rule:** FRO-325 says preserve declared-piece calculations. Current FRO-295 explicitly retires per-colli PCS and its aggregate. Current composer still computes `unit.pcs` and displays Declared pcs; the revised contract must consume the retirement, preserving physical counts.
2. **Release integration gap:** existing Shipment Detail dispatches only from PREPARING and submits a required number; it has no readiness operation. FRO-325 targets 0.0.7; FRO-316/FRO-341 target 0.0.9. User accepted coordinated activation with compatible consumers; no silent auto-confirmation and no current-screen implementation added to this planning scope.
3. **Readiness preconditions incomplete:** creation accepts upcoming READY/EXPECTED_READINESS goods, while dispatch requires PREPARED_FOR_SHIPMENT and an IN_STOCK source stay. User accepted stock confirmation before READY_FOR_DISPATCH. Draft packing may be saved earlier. Consume FRO-339's existing geography/current-warehouse checks at confirmation/dispatch.
4. **Packing-history retention underspecified:** initial packed goods already have LOADED journey events (ShipmentsApiService:529–555). V1 journey load-unit FK is ON DELETE RESTRICT (:1601); LOADED requires a unit (:1637). Removal/replacement and overwriting load-unit fields need a historical identity/arrangement contract, preserving prior events and avoiding repeated loading/reservation effects.
5. **No-op/concurrency/retry contracts incomplete:** define comparison of normalized saved values/assignments, return canonical state/version, require expected version and coordinate new saves/confirmations with dispatch/cancel and FRO-344 edits. Cover stale, duplicate/uncertain-result retries and rollback explicitly. Existing server locks/versioned status updates alone do not protect a stale client draft.
6. **Document clearing undefined:** user accepted explicit pre-dispatch clearing; number-only edits retain readiness, absence blocks dispatch. Preserve uniqueness/mode rules; saved-number dispatch must not require another assignment or silently replace a different saved number.
7. **Consumer and migration coverage too generic:** adapt status/shape/transition/load-unit/content/document guards through new migrations, plus all supported adapters/status filters/generated client contracts. Specify SHIPMENT_EDIT/internal scope for new commands. FRO-297 defines live PREPARING DG count and dispatch snapshots; extend live count to READY_FOR_DISPATCH and preserve snapshot timing.

## Consumer impact

| Area | Verified current source | Outcome | Owner |
| -- | -- | -- | -- |
| Creation/reservations/children | ShipmentsApiService; shipments.graphqls; journey workflow | Preserve exact identities/atomic splits; optional creation document | FRO-325; FRO-341 UI |
| Packing/journeys | V1 guards/FKs; create service LOADED events | Mutable current packing with retained history and no repeated creation effects | FRO-325; FRO-316 UI |
| Readiness/dispatch/cancel | ShipmentRepository; service stock/stay checks; client detail | New explicit state/stock boundary, shared concurrency and compatible activation | FRO-325; FRO-316 UI |
| General edits/geography | Current FRO-344/FRO-339 contracts | Preserve explicit edits/invalidation/current warehouse validation | Linked owners |
| Physical/PCS/DG counts | Composer and shipments.graphqls; FRO-295/FRO-297 | Physical counts preserved; PCS retired; Ready live DG count, dispatch snapshot | FRO-325 integration; linked contracts |
| Delivery notes | DeliveryNoteDraftSourceService:46–77; DeliveryNotesApiService:55–64 | Grouping-only changes preserve current fiscal source and snapshots | Preserve here; route/membership reconciliation under FRO-344 |
| Authorization/APIs | ShipmentAuthorizationService:15–20; schema/adapters | Existing internal scope/authorities; new command/read/version coverage | FRO-325 |
| Existing records/rollout | DB lifecycle guards; client types/detail/composer/service | No guessed confirmation/backfill; compatible adapters and activation | FRO-325 coordinated consumers |

Fiscal Q2 was withdrawn after tracing: permitted grouping uses load-unit fields; fiscal goods derive from unchanged HU declared weights, PO identities and membership. No automatic draft reconciliation is needed for this scope. Do not blanket-block unrelated grouping because a note exists.

FRO-165 is actually the archived email-tagging issue. Current FRO-325 explicitly links FRO-316 as Shipment Details owner; reviewed FRO-316/FRO-341 accordingly. No new UI/canvas/preview or production branch.

## Proposed revision

Complete standalone draft: `drafts/fro325-reviewed-spec.md`. Retain title, status, labels, priority, assignment, project/milestone, all relations and both attachments. Decisions reflect three accepted answers; remaining technical clarifications make existing audit/atomicity/preservation requirements testable. No new glossary term or qualifying ADR.

Before/after review pairs: preserve declared PCS → consume PCS retirement; valid packing → complete stock-confirmed current plan; broad packing history → stable historical references/arrangements; unspecified number removal → explicit clearing; broad concurrency → expected-version/no-op/race/retry criteria; generic rollout → coordinated compatible activation.

Await full-text approval before any Linear description/metadata/comment write. Safe-environment implementation testing and post-deployment verification remain future work. No production mutation performed.

Playbook: committed policy at main above, fingerprint `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`. Windows encoding recovery used UTF-8 resume of the same saved task snapshot. Optional Linear shared-notes endpoint unavailable; direct issue reads succeeded.
