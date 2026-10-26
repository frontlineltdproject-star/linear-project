**Define the Shipment preparation foundation:** establish route and exact participation at creation, save optional repacking afterward, explicitly confirm readiness, and dispatch using the saved transport document.

A **Shipment** is one physical transport leg. A **colli** is one permanently identified handling unit. **Order = Purchase Order = stock-list item.** Participation exists independently of pallet/box grouping.

## Scope and ownership

This ticket owns persistence, business operations, lifecycle, validation, authorization, audit and API/read contracts. No UI implementation, new design, preview or production branch is included.

| Owner | Contract |
| -- | -- |
| FRO-325 | Creation, exact participation, reservations/child splits, packing/document commands, readiness and dispatch. |
| [FRO-341](https://linear.app/front-line-ltd/issue/FRO-341) | Creation UI and Creation review; blocked by this ticket. |
| [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316) | Details UI for repacking, document editing, readiness and lifecycle actions; blocked by this ticket. |
| [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344) | General pre-dispatch route/membership editing and its readiness invalidation. Related, with no blocking relation in either direction; integrated readiness behavior consumes this ticket's contracts. |
| [FRO-345](https://linear.app/front-line-ltd/issue/FRO-345) | History persistence and read/write contracts. Link this ticket's command effects to one logical operation; FRO-316 owns history presentation. |
| [FRO-339](https://linear.app/front-line-ltd/issue/FRO-339) | Shipment geography and current warehouse compatibility, including readiness/dispatch validation and incomplete existing records. |
| [FRO-295](https://linear.app/front-line-ltd/issue/FRO-295) / [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297) | PCS retirement / DG classification and dispatch snapshots. Consume these contracts without restoring retired calculations. |

Retain existing attachments and hosted previews. They do not prescribe UI implementation under this ticket. The creation presentation is [FRO-341's preview](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site/). The older [combined workflow preview](https://fro-316-fbc664.pages.dev/), Pages project `fro-316-fbc664`, and attached screenshot remain nonbinding historical references. This ticket does not change or publish either preview.

## Creation and participation

Normal creation requires at least one eligible colli and returns **PREPARING**. It establishes exact participation before optional repacking or readiness confirmation.

| Input | Type / format | Rule |
| -- | -- | -- |
| Route | Existing warehouse/agent references and derived vessel | Preserve origin, purpose-compatible destination and same-vessel rules. Consume FRO-339 geography/warehouse validation; this ticket adds no independent country/city fields. |
| Mode | ROAD / AIR / SEA | Preserve validation; derive document type from mode. |
| Purpose | NETWORK_TRANSFER / THIRD_PARTY_TRANSFER / DELIVERY_TO_LAUNCH_STATION / DELIVERY_TO_VESSEL | Preserve destination and handover compatibility. |
| Participation | Permanent colli IDs and participating Order identities | Exact nonterminal, eligible, unallocated identities. Preserve stock/readiness, origin and whole-Order allocation checks. |
| Partial selection | Existing split reason and optional remark | Preserve existing options and conditional remark validation. Only IN_STOCK Orders may split; upcoming READY/EXPECTED_READINESS Orders must be selected in full. |
| Packing | Zero or more shipment-scoped load units and assignments | Overpacks are optional. Valid creation-time packing is a saved plan; it does not establish readiness or assert completed physical packing. |
| Transport-document number | Optional String, maximum 255 characters | Missing is stored as absent. A supplied number must be nonblank and satisfy existing uniqueness/normalization rules. |
| Transport-document type | Derived enum | AIR → AIR_WAYBILL; ROAD → CMR; SEA → BILL_OF_LADING. Callers cannot select an incompatible type. |

Atomically persist route, optional document, participation, reservations and applicable child Orders. Failure leaves no partial Shipment, split, reservation or associated effects.

Partial IN_STOCK selection moves selected nonterminal collis into an explicit participating child; unselected and terminal collis remain on the parent. Selecting every eligible nonterminal colli uses the existing Order without a child. Preserve permanent identities, direct-parent/root lineage, inherited data and existing participating-Order effects. Stocked reserved Orders become PREPARED_FOR_SHIPMENT; upcoming Orders retain their readiness status until stock confirmation moves them to PREPARED_FOR_SHIPMENT. Preserve the participating colli-set freeze.

Creation does not record departure, mark Orders SHIPPED or close origin stays. Route/membership editing belongs to FRO-344. Packing commands cannot repeat child splits or creation reservations.

## Packing and readiness

| Operation | Preconditions and result |
| -- | -- |
| Read participation/packing | Return exact participating identities, current Order attribution, loading-time attribution, child/root lineage where applicable, Order display data, saved load units, individual collis, totals, readiness and dispatch blockers and current state/version (see **Participation and readiness read**). Distinguish the saved plan from the last confirmed physical arrangement and its confirmation. Available before confirmation. |
| Save packing | Allowed only in PREPARING/READY_FOR_DISPATCH. Atomically save a valid arrangement without implicitly confirming readiness. A changed save from Ready returns to PREPARING; an unchanged save retains Ready. |
| Confirm readiness | Allowed in PREPARING/READY_FOR_DISPATCH. Validate the complete submitted arrangement/current version and atomically save it with the operator's explicit attestation that physical packing is complete and matches it. Set or retain READY_FOR_DISPATCH. Explicitly confirming a changed arrangement while Ready does not require an intermediate Save or persisted PREPARING state. Works with overpacks or only individual collis. |
| Discard unsaved changes | No persistence operation; retain the last saved arrangement and readiness. |
| Locked states | Reject packing/readiness operations in DISPATCHED, ARRIVED, CANCELLED and LOCATION_UNKNOWN. |

Readiness requires **every participating Order to have completed stock confirmation**, be PREPARED_FOR_SHIPMENT, and have its source stay IN_STOCK at the Shipment origin. Upcoming cargo may be reserved and have draft packing saved, but cannot be confirmed Ready. Recheck eligibility, exact reservations, route/geography and warehouse compatibility under the owning contracts. A transport-document number is not required for readiness; it remains mandatory for dispatch.

**Ready attests completed physical preparation**, not merely an approved plan. All-individual packing is a valid completed arrangement. Saving a plan does not attest that warehouse staff executed it; explicit confirmation does. Preserve each successful confirmation's actor, time and arrangement/version.

Preserve PALLET/CARDBOARD_BOX, label, positive dimensions, optional gross/net weights and notes. Each overpack contains at least one participating colli; a colli belongs to at most one overpack. Mixed-Order overpacks remain supported. Every participating colli is accounted for once, either inside one load unit or individually. An unassigned colli remains participating and reserved. Reject foreign/duplicate assignments and invalid or empty load units atomically.

**Load-unit values:**

| Field | Rule |
| -- | -- |
| Label | Optional, up to 100 characters, unique within the Shipment. A duplicate label is rejected with an actionable error naming it. |
| Length / Width / Height | Whole centimetres greater than 0. |
| Gross weight | Optional; greater than 0 when supplied. |
| Net weight | Optional; only together with a gross weight, and 0 ≤ net ≤ gross. |
| Notes | Optional, up to 1,000 characters. |

A packing save or confirmation keeps a retained load unit's existing net weight and notes when the request omits them; they change only when explicitly supplied, and are cleared only when explicitly sent empty. Omitting them never erases stored values. They remain readable through the Shipment read.

Packing cannot change route, participation, Order attribution, colli-master measurements or identity. Compare canonical saved packing values and assignments to determine a change, including load-unit type, label, dimensions, weights and notes. Transport serialization order alone is not a change; a changed persisted sequence or other saved packing value is. Unchanged saves do not append a false change or invalidate readiness.

### Participation and readiness read

The Shipment read (GraphQL `shipmentById` / `shipments`, REST GET and the MCP Shipment read) returns, in every status and in one request without per-Order calls:

| Data | Content | Rule |
| -- | -- | -- |
| **Order display data** (per participating Order) | Internal number; Owner reference; Client (id, name); Vessel (id, name); Supplier (id, name); Root Order (id, internal number) | Live values read from the Order. Root Order is null when the Order is not a split child. Absent optional values are null. Loading-time attribution of collis stays as recorded; display data never changes which Order a colli is attributed to. |
| **Readiness blockers** | List of current reasons readiness cannot be confirmed, each with a stable code and the affected Order where relevant | Computed by the same checks as Confirm readiness: Order not stock-confirmed, not PREPARED_FOR_SHIPMENT or source stay not IN_STOCK at the origin; incomplete geography; warehouse not compatible with the selected city (FRO-339). Empty when readiness can be confirmed; empty outside PREPARING/READY_FOR_DISPATCH. |
| **Dispatch blockers** | List of current reasons dispatch is unavailable, same shape | The readiness checks plus: status is not READY_FOR_DISPATCH; transport-document number missing; other existing departure prerequisites. Empty when dispatch can be attempted. |

Blocker lists are informational. Every command still revalidates under its own transaction and returns actionable errors; a stale blocker list never authorizes an operation. Codes are stable and documented in the API references so consumers can translate them (EN/EL) without parsing messages.

### Packing history and physical journeys

Keep prior saved arrangements and referenced load-unit identities historically interpretable. Removing/replacing a current load unit or changing its fields must not delete a referenced unit, retarget prior journey events or make earlier packing facts appear to have changed. Preserve existing completed LOADED events and their provenance.

Creation-time packing and ordinary Save record the plan and successful operation only; neither asserts completed physical loading, repacking or unpacking. Intermediate saved plans never become physical journey facts merely because they were saved.

Explicit readiness confirmation atomically establishes the attested physical arrangement in the affected collis' journeys. Record first confirmed arrangements and subsequent changes from the last confirmed physical arrangement, including movement between overpacks and removal from an overpack to individual transport. Preserve previous facts and references; an unchanged physical arrangement must not produce duplicate physical effects. A new readiness confirmation after invalidation remains auditable even when the physical arrangement is unchanged.

Link packing changes, readiness confirmation and per-colli physical effects to one logical successful operation under FRO-345's history contracts. Direct reconfirmation while Ready records the changed arrangement/new confirmation without inventing a Ready → Preparing → Ready status cycle. Failed/stale operations and retries cannot leave partial or duplicate history.

Confirmation time records when the operator attested the arrangement, not a guessed exact time of warehouse handling. Retain known historical occurrence/recording facts and unknown provenance. For legacy records, use explicit recorded physical evidence where available; otherwise establish the first attested arrangement without inventing earlier packing or unpacking events. No separate historical packing-time input or new UI is required.

Implement the necessary journey persistence/read contract for these outcomes without overloading LOADED to mean unpacking. Packing and confirmation do not repeat reservations or splits and do not record departure.

## Totals and dependent records

| Consumer | Required result |
| -- | -- |
| Physical counts | Each overpack counts as one transport piece; each individual colli counts as one. Contained collis are not counted again as transport pieces. Preserve distinct physical colli and Order counts. |
| PCS | Apply FRO-295: no per-colli PCS or Declared pcs aggregate, hidden default or replacement quantity. |
| Weights/measurements | Preserve existing distinct meanings of colli measurements and entered load-unit weights, calculations and missing-value semantics. Repacking does not overwrite colli-master measurements. |
| Dangerous goods | Apply FRO-297's distinct participating DG-colli count in both PREPARING and READY_FOR_DISPATCH. Packing does not multiply the count. Successful dispatch atomically captures its immutable classification snapshot; preserve unavailable historical counts rather than guessing zero. |
| Delivery notes | Grouping-only packing/document/readiness operations preserve goods snapshots, colli quantities/weights, fiscal statuses and operator-entered values. They do not refresh/rebuild, issue, cancel or replace delivery notes. Route/membership reconciliation stays with its owning ticket. Preserve existing fiscal safeguards without blanket-blocking unrelated grouping changes. |
| Other workflows | Preserve attachments, Notes, stock confirmation, split lineage and post-dispatch movement behavior under their owners. |

## Transport-document operations

| Operation | Rule |
| -- | -- |
| Creation | Optional mode-compatible document number. |
| Assign/replace/clear | Authorized in PREPARING/READY_FOR_DISPATCH with the expected current version. Explicit clearing stores absence; omission in a partial update preserves the saved number. A supplied value must be nonblank, within 255 characters and valid under current global uniqueness rules. |
| Number-only change | Valid assignment, replacement or clearing retains readiness. Clearing blocks dispatch until a valid number is saved again. Preserve applicable dependent-document safeguards. |
| Read/search | Return canonical number and mode-derived type consistently; preserve Shipment/document-number search. Do not infer either from attachments. |
| Dispatch | Use the saved valid number; no second assignment is required. A legacy supplied number must not silently overwrite a different saved number or bypass explicit readiness. |
| Locked states | Reject operational document updates in DISPATCHED, ARRIVED, CANCELLED and LOCATION_UNKNOWN. No post-dispatch correction operation is added. |

Document changes neither dispatch nor close stays or mark Orders SHIPPED. Mode editing and explicit resolution of incompatible references belong to FRO-344; do not silently reinterpret an old number after a mode change.

## Lifecycle

Retain PREPARING, displayed as **Preparing for dispatch**, and introduce **READY_FOR_DISPATCH** as a Shipment status, not an Order status.

| Transition | Rule |
| -- | -- |
| Creation → PREPARING | Exact route/membership saved; confirmation pending. |
| PREPARING → READY_FOR_DISPATCH | Explicit attestation of completed physical packing matching the valid current arrangement, with stock-confirmed goods. |
| READY_FOR_DISPATCH → PREPARING | Ordinary Save of changed packing. FRO-344 extends invalidation to material route/geography, warehouse, purpose/destination, mode and participation changes. |
| READY_FOR_DISPATCH retained | Explicitly reviewed confirmation of a changed valid arrangement saves and reconfirms atomically, preserving previous confirmations. No intermediate PREPARING state is required. Unchanged saves/retries do not create false transitions. |
| READY_FOR_DISPATCH → DISPATCHED | Explicit dispatch; revalidate saved document, stock, route and all existing departure prerequisites. No direct dispatch from PREPARING. |
| PREPARING / READY_FOR_DISPATCH → CANCELLED | Preserve reservation release, movement closure and Order rollback. Retain child Orders and lineage; do not merge children back into parents. |
| DISPATCHED → ARRIVED / LOCATION_UNKNOWN | Preserve existing arrival, handover, custody and uncertainty rules. |

Dispatch applies departure effects once: close origin stays, mark participating Orders SHIPPED, create existing inbound warehouse effects where applicable, append movement audit and capture FRO-297's snapshot atomically. Packing/document saves and readiness confirmation apply none of these effects.

Post-dispatch route, participation, identity, packing and document protections remain intact. Notes/attachments retain their separate lifecycle permissions.

## Authorization, concurrency and contracts

* Reuse SHIPMENT_CREATE for creation and internal-identity plus SHIPMENT_EDIT for new packing, document and readiness commands; retain existing read/lifecycle authorities and record scope. No new login role or partner access to mixed Shipments is introduced.
* Expose current canonical state/version and require an expected version for new saves/confirmation. Share concurrency protection with dispatch, cancellation, FRO-344 edits and affected dependent records. A stale review cannot approve or overwrite a changed plan.
* Invalid, unauthorized, stale or losing concurrent operations leave all affected saved records unchanged. Repeated/no-op confirmations and retries cannot duplicate successful audit, reservations, splits, loading or departure effects. After an uncertain response, callers can read the canonical state/version to resolve the outcome safely.
* Audit successful changes and explicit confirmation with actor, occurrence/recording time as applicable and the confirmed plan/version. Preserve historical audit/journey facts.
* Extend relevant GraphQL, REST and MCP inputs, reads (including Order display data and blocker lists), status validation/filtering and generated client contracts consistently. Return canonical results and actionable validation/state/conflict errors.
* Add new migrations for status/shape constraints and transition, packing/content and document guards. Support both pre-dispatch states as specified without weakening post-dispatch identity/history protections. Do not rewrite executed baseline migrations.
* Update curated lifecycle/authorization documentation and regenerate database/API/client references with their owning sources, including the blocker codes.

## Existing records and release

Preserve existing contents, permanent identities, attribution, packing, document numbers, lineage, movement history and timestamps. Existing PREPARING Shipments remain PREPARING until explicitly confirmed; an existing overpack is not confirmation. Preserve DISPATCHED, ARRIVED, CANCELLED and LOCATION_UNKNOWN records. Do not invent historical confirmations, geography or DG snapshots.

FRO-339's incomplete-route and current warehouse-compatibility checks apply at readiness/dispatch; authorized explicit correction is owned by FRO-344. This ticket does not move Order geography into Shipments or guess missing route data.

**Coordinate activation with compatible consumers.** FRO-325 targets 0.0.7 while FRO-316/FRO-341 target 0.0.9. Backend preparation may precede UI release, but activation of the new readiness/dispatch flow requires compatible consumers and a documented rollout sequence. Existing callers must not be stranded or silently auto-confirmed. Before activation, verify creation, packing, document, confirmation, dispatch/cancel and status-read/filter integrations across supported adapters. Milestone/status/relation changes require separate authorization.

## Acceptance criteria

 1. Normal creation without overpacks returns PREPARING and atomically saves exact participation, reservations, optional document and applicable children; invalid/competing creation leaves no partial effects. Preserve full/upcoming and partial-IN_STOCK rules.
 2. Reads return all participation independently of packing, correct attribution/lineage, individual contents and canonical state/version. Each participating Order carries its internal number, Owner reference, Client, Vessel, Supplier and root Order (null when not a child) in the same request.
 3. Valid creation-time packing and ordinary saves record plans without completed physical-packing events, departure or implicit confirmation. Invalid/foreign/duplicate assignments, duplicate or over-long labels, invalid weights and empty load units roll back completely; no cargo is implicitly removed. Saves that omit net weight or notes keep the stored values.
 4. Readiness works with mixed or all-individual packing only after every participating Order is stock-confirmed at the origin, the complete current arrangement passes validation, and the operator explicitly attests completed physical packing matching it. Upcoming goods or incompatible/incomplete routes fail without changes.
 5. Ordinary Save of changed packing invalidates readiness; explicit reviewed confirmation may atomically save a changed valid arrangement and retain Ready with a new confirmation. Normalized unchanged saves, serialization-only reordering and discarded drafts retain readiness. Preserve prior confirmations; no artificial intermediate state is recorded.
 6. Document assignment/replacement/explicit clearing works in both pre-dispatch states with uniqueness, mode mapping and stale-write protection. Number-only edits retain readiness; absent documents prevent dispatch; reads/search remain consistent.
 7. Dispatch rejects PREPARING, invalid/missing documents, stale state and unmet stock/route prerequisites. Valid Ready dispatch applies departure and DG snapshot effects exactly once.
 8. Cancellation in either pre-dispatch state releases reservations and restores eligible Order state without merging children. Later-state packing/document/readiness operations fail; arrival/unknown-location behavior remains intact.
 9. Cross-command concurrency, duplicate confirmations, retries and failure injection cannot overwrite a newer plan, leave partial state or duplicate history/effects. Unauthorized/view-only/partner callers cannot invoke new operations.
10. Physical counts, measurements, fiscal/attachment/stock workflows and history are preserved. PCS stays retired; Ready DG counts and dispatched/historical DG semantics follow FRO-297.
11. New migrations/guards, adapter contracts, generated references and compatible-consumer rollout pass automated/nonproduction verification before coordinated activation. Existing records retain their agreed state/history.
12. Confirmation records the attested physical arrangement and changes in affected colli journeys, including first packing, overpack-to-overpack and overpack-to-individual changes. Saved intermediate plans do not create physical events. Preserve historical load-unit/journey facts and unknown legacy provenance; unchanged arrangements/retries do not duplicate physical effects. One logical operation links the confirmation and its effects, with attestation time distinguished from any known physical occurrence time.
13. The Shipment read returns readiness and dispatch blocker lists with stable documented codes and affected Orders. They match the outcome of the corresponding command for the same state: an empty readiness list means confirmation passes those checks, and each listed reason causes the command to fail with the same code. Outside the pre-dispatch states both lists are empty.

## Decisions

| Decision | Reason |
| -- | -- |
| Separate participation, optional packing, readiness and dispatch | Creation can reserve exact goods before logistics preparation without recording departure. |
| Require stock confirmation before Ready | Ready must not describe goods still expected from suppliers. Draft packing can be saved earlier. |
| Ready attests physically completed packing | An approved future plan must not describe goods as physically ready. All-individual transport remains valid. |
| Allow atomic explicit reconfirmation of changed packing while Ready | The operator reviews and attests the completed replacement arrangement without an artificial intermediate save/state; ordinary changed Save still invalidates readiness. |
| Record confirmed physical arrangements in colli journeys; keep saved plans separate | Trace first packing, repacking and unpacking truthfully without turning draft changes into physical events or duplicating history. |
| Allow explicit pre-dispatch document clearing without readiness loss | Correct an erroneous reference while retaining the confirmed goods/packing plan; dispatch still requires a valid number. |
| Coordinate activation with compatible consumers | Avoid breaking existing dispatch callers while UI integration is released later. |
| Reuse existing UI and related structural owners | Keep one owner for presentation, geography, editing, PCS retirement and DG snapshots. |
| Order display data on the participation read, as live Order values | Shipment Details (FRO-316) lists Owner reference, Client, Vessel, Supplier and the root Order per participating Order; this ticket already owns participation and lineage. The values describe the Order, so they are not snapshotted; colli attribution stays loading-time. |
| Readiness and dispatch blockers exposed on the read | Operators see why they cannot proceed before trying; the same checks back the commands, so the list and the result cannot disagree. |
| Omitted net weight and notes are kept | The Details editor captures only gross weight; a save must not silently erase stored values. |
| Load-unit label and weight rules stated explicitly | The database already enforces them; consumers need the same rules to validate before saving. |

## Coordination and out of scope

Preserve existing relations. FRO-323 owns arrived-source eligibility without a persisted Shipment hierarchy; FRO-324 owns historical already-arrived recording without forcing it through normal preparation; FRO-322 owns deferred Import/Export category and Import document rules; FRO-329 owns Order field cleanup. FRO-342/FRO-343 retain creation-upload/inline-Order ownership. FRO-345 owns history/comments persistence and APIs; FRO-316 owns their presentation. FRO-299 owns per-colli measurements on the Shipment read. These references do not import unresolved requirements or UI work here.

Out of scope: UI/layout/navigation/styling; independent geography fields; general route/membership editing; Import/Export category; inline Order creation; historical-arrival operation; new Order statuses; changes to post-dispatch movement; automatic fiscal reconciliation/issuance/cancellation; offers, accounting, Outlook posts and notifications; snapshotting Order display data. No production branch, deployment or production database write is part of this planning task.

## Context for agents

Live repository **Frontline-Forwarding/frontline-forwarding**, reviewed through authenticated gh on 26 October 2026 through main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`. This is source evidence, not deployed-version verification. Read current repository/app guidance before implementation.

| Source | Context |
| -- | -- |
| `frontline-forwarding-app/src/main/resources/graphql/shipments.graphqls` | Existing creation supports exact handlingUnitIds and empty loadUnits; dispatch currently requires a number. New packing/document/readiness operations and READY_FOR_DISPATCH are absent. `ShipmentParticipation` carries only purchaseOrderId, purchaseOrderInternalNumber, stay ids, reservedAt, movementClosedAt and closeReason; `ShipmentContent` carries colli id/code and loading attribution. `ShipmentLoadUnitInput`/`ShipmentLoadUnit` include grossWeightKg, netWeightKg and notes. |
| `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` | `PurchaseOrder` holds ownerReference, clientCompany, vessel, supplierCompany and rootPurchaseOrderId/parentPurchaseOrderId (ids only). Resolve display data in batch, not per Order. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java` | Shared transactional allocation/child-split, loading, stock, dispatch, cancellation and movement effects. Current creation emits LOADED for assigned overpacks; separate prospective plan saves from confirmed physical facts as specified here. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/shipments/ShipmentRepository.java`; `ShipmentAuthorizationService.java` in the same package | Current transition/version/search logic and internal Shipment authorities. |
| `frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql`; `docs/reference/database.md` | Status/transition/content/load-unit/document guards and journey load-unit references. `freight_shipment_load_unit`: label varchar(100) unique per Shipment, positive dimensions, weight check (gross > 0; net only with gross, 0 ≤ net ≤ gross), notes varchar(1000). Referenced units cannot simply be deleted; preserve history through new migrations. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/DeliveryNoteDraftSourceService.java`; `DeliveryNotesApiService.java` | Fiscal goods use Order membership and colli declared gross weights; preparation skips existing current company groups rather than rebuilding them. Packing-only grouping is distinct. |
| `frontline-forwarding-client/src/features/shipments/types.ts`, `components/shipment-composer.tsx`, `components/shipment-detail.tsx`, `services/shipment-service.ts` | Existing consumers lack readiness and currently dispatch from PREPARING with a supplied number; the composer edits only gross kg and always sends empty net weight and notes. Rollout integration is required. Source components are not new UI instructions. |
| `docs/workflows/shipment-lifecycle.md`, `purchase-order-colli-journey.md`, `delivery-note.md`, `attachments.md`; `docs/architecture/authorization.md` | Existing whole-Order movement, custody, immutable journeys, fiscal snapshots and access boundaries. LOADED denotes physical placement in an overpack; the current journey event model lacks an unpack/repack equivalent. Extend the contract to represent the agreed outcomes without fabricated physical facts. |

## Post-deployment verification

Use authorized read-only records created through normal operations. Mutation/negative/race cases run only in a safe test environment; inspect their recorded evidence after deployment. Missing production examples remain unverified.

| AC | Read-only verification |
| -- | -- |
| 1–2 | Read new PREPARING examples with whole/upcoming/partial selections; compare identities, children, reservations, lineage, optional number and absent departure. Compare each participating Order's display data and root Order with the Order read. Review rollback/competing-creation results. |
| 3–5 | Compare saved packing revisions, current state/version and unchanged membership. Inspect mixed/all-individual Ready examples and physical-completion attestation; check stock/origin/geography. Compare ordinary changed Save with direct changed reconfirmation and verify actual status history. Review invalid, unchanged, stale, duplicate-label, weight-rule, net-weight/notes-preservation and historical-load-reference cases. |
| 6 | Read assigned, replaced and cleared-number examples and search results. Confirm retained readiness where applicable; inspect uniqueness, mode and stale-update results. |
| 7–8 | Read dispatched/cancelled/arrived/unknown-location examples; compare document, stock transitions, warehouse effects, child lineage, immutable DG snapshot and history. Review rejected-state and exactly-once results. |
| 9 | Inspect permission and competing save/confirm/dispatch/cancel/retry evidence; verify failures preserved saved state and successful effects were not duplicated. |
| 10 | Compare physical counts and measurement fixtures; verify PCS absence, Ready live DG counts and historical snapshot availability. Inspect unchanged fiscal/attachment workflows. |
| 11 | Inspect migration/regeneration results and deployed adapter schemas/status filters; confirm compatible-consumer and coordinated-activation evidence. Read legacy examples without invented confirmations/geography/history. |
| 12 | Read colli journeys alongside saved plans and confirmation operations for first packing, repacking and return to individual transport. Verify only confirmed arrangements establish physical facts, prior references survive, timestamps retain provenance and unchanged/retried confirmations do not duplicate physical effects. |
| 13 | Read blocker lists for Shipments with an unconfirmed Order, incomplete geography, a missing document number and none of these; compare codes and affected Orders with the recorded command outcomes from the test environment. Confirm empty lists for dispatched and later Shipments. |

**Reference:** source paths above; FRO-316/FRO-341 presentation, FRO-344 editing, FRO-345 history contracts, FRO-339 geography, FRO-299 measurements, FRO-295 PCS retirement and FRO-297 DG snapshots.
