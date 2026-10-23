**As a** Front Line operator, **I want** to record a Shipment that already arrived at a warehouse **so that** goods discovered through an agent stock list retain their inbound transport history without fabricated movement facts.

**Order = Purchase Order = stock-list item.** A colli is one permanently identified physical handling unit.

## Scope and ownership

This ticket owns the dedicated historical-arrival operation, eligibility, persistence, existing-arrival linking, date precision, stock compatibility and authorized read/write contracts. It is not a generic initial-status setter.

| Owner | Responsibility |
| -- | -- |
| FRO-324 | Historical NETWORK_TRANSFER arrival at an authorized active Frontline warehouse or associated-agent hub; the integration rules below. |
| FRO-339 | Geography references, city-country validation and warehouse compatibility. |
| FRO-325 | Normal preparation, participation, packing, readiness and dispatch; preserve those rules. |
| FRO-345 | Status/operation history and provenance; integrate one historical creation operation. |
| FRO-342 | Generic pending-upload lifecycle; FRO-324 owns its integration into historical creation. |
| FRO-341 / FRO-316 | Creation / saved Details presentation and client integration. |

FRO-324 blocks completion of the relevant FRO-341/FRO-316 capabilities. No new layout, canvas or preview is required. Normal creation remains PREPARING by default. External-agent, launch-station and vessel handovers are excluded.

## Input and evidence contract

| Fact | Type / format | Rule |
| -- | -- | -- |
| Destination country / city | Reference IDs | Both required; select geography before receiving warehouse. |
| Receiving warehouse | Authorized active warehouse reference | Required, compatible with destination geography and existing warehouse/operator eligibility. |
| Origin country / city | Optional reference IDs | Retain known components. City alone resolves its country; explicitly conflicting country/city is rejected. |
| Origin warehouse | Optional warehouse reference | Requires compatible known origin country/city; must differ from destination. Unknown remains absent. |
| Mode | ROAD / AIR / SEA, optional | Unknown is absence, not another enum value. |
| Transport reference | Optional string | Known mode derives CMR / AWB / B/L. Unknown mode retains a generic reference without invented type. |
| Departure / arrival date | Optional date-only values | Actual movement evidence; preserve absence and precision. |
| Contents | Existing Order and permanent colli identities | At least one complete eligible Order with at least one nonterminal colli. |
| Pending files | Optional authorized upload references | Use FRO-342's lifecycle and the atomic integration below. |
| Recorded by / at | Server-derived actor / timestamp | Authenticated operator and successful recording time, separate from occurrence. |

Preserve canonical transport-number normalization, uniqueness across Shipments and search, including references with unknown type. Enforce uniqueness under concurrency; do not introduce a separate unchecked historical-reference field. Attachments never supply the canonical number automatically.

Missing origin geography, origin warehouse, mode, document or actual dates remain explicitly unknown in read contracts. Do not infer geography from Orders/current addresses or create placeholder locations. Normal creation still requires its complete route.

Geography narrows existing authorized choices. A warehouse without compatible city/country cannot be selected. Destination-geography changes clear an incompatible warehouse; receiving-warehouse changes invalidate dependent contents and arrival matches. Preserve unrelated draft facts. Server validation rejects mismatches rather than overwriting submitted geography.

## Dates and chronology

Use **Europe/Athens** consistently for this operation's calendar-date comparisons and future-date checks, independent of browser/server timezone.

* Store supplied dates as dates. Convert existing timestamp evidence to its Europe/Athens calendar day only for date comparison; preserve the original instant and precision.
* Departure must not follow arrival, and supplied actual dates must not exceed the current Europe/Athens date.
* A supplied arrival date must agree with every known matched-stay arrival day. Different known days cannot be combined into one historical Shipment, even when the supplied arrival date is blank.
* Different existing times on the same day are compatible with date-only evidence; they do not establish one exact Shipment arrival time. Never select an arbitrary timestamp or replace known evidence with midnight.
* Blank input does not erase known matched-arrival facts. Return those facts with their source and precision; distinguish a supplied date from evidence read from an existing stay. Do not fabricate a common exact timestamp.
* Check actual physical chronology, including known arrival, stock confirmation and subsequent movements. Unknown facts cannot override contradictory evidence. Date-only evidence does not establish within-day ordering.
* Recording an earlier occurrence may follow Order registration or later administrative entries. Append recording provenance without rewriting existing event order or pretending those administrative timestamps were physical movement.
* Inserting an earlier missing leg behind a subsequent physical movement is excluded.

## Eligibility and warehouse stays

Use a dedicated receiving-warehouse and historical-compatibility lookup, not the normal outgoing origin-stock query. Return exact eligible identities, matched stay/date, preserved stock status and actionable exclusion reasons before selection. Revalidate all evidence at save.

| Situation | Outcome |
| -- | -- |
| Newly registered Order, no recorded physical movement, matching opening EXPECTED stay | Reuse that stay for the historical arrival. Do not create a second active stay, source stock or readiness/dispatch events. |
| Opening EXPECTED stay at a different warehouse | Reject and identify the mismatch. No automatic reassignment, cancellation, departure or LOCATION_UNKNOWN event. |
| Existing compatible arrival awaiting stock confirmation | Link the exact stay and colli history without recording another physical arrival. |
| Existing compatible IN_STOCK arrival | Link it while preserving status, stock date, position, measurements and permanent identities. |
| Reservation by another preparing/ready Shipment | Reject with the authorized conflicting Shipment reference. Resolve through the reservation owner's existing actions. |
| Existing dispatched Shipment carrying this leg | Use that Shipment's existing arrival operation; reject duplicate historical creation. |
| Arrival already attributed to another Shipment, duplicate movement or ambiguous match | Reject; equal warehouse/date alone does not prove movement identity. |
| Conflicting physical warehouse, later movement or uncertain historical colli attribution | Reject with the affected records and reason. Never overwrite location/history. |

Select the whole current nonterminal colli set of each participating Order. Terminal collis remain on their Order for reference and are excluded. A terminal/ineligible Order or an Order without eligible collis cannot participate.

Partial arrivals require a separate Order created by the existing split operation where permitted. No historical auto-splitting or bypass of split restrictions is introduced. Current membership alone must not be treated as proof of older transport attribution after a split; reject uncertain attribution.

For linking, establish an unambiguous association among the Shipment, exact destination stay, Order and permanent colli identities. Provide a narrowly scoped audited provenance link that respects existing immutable facts. Do not replace a different inbound Shipment, rewrite a stay's warehouse/Order identity, or change existing arrival/stock/position facts.

A rejected or stale match preserves the draft and identifies affected records; never silently reduce contents or substitute a different stay.

## Atomic save and stock confirmation

Successful historical recording saves together:

1. One Shipment in ARRIVED, marked by explicit historical-entry provenance.
2. Exact participation and historical content identities, with established Order attribution and destination-stay links.
3. Completed historical movement with no active reservation/allocation, even when actual departure/arrival dates are unknown.
4. For a new arrival, the reused receiving stay in AT_WAREHOUSE and Order outcome AWAITING_IMPORT. An already-stocked linked arrival remains IN_STOCK.
5. One logical historical-entry operation and initial ARRIVED status event through FRO-345, with authenticated actor/time, supplied/missing facts and affected/source references.
6. Any selected valid permanent attachment associations.

Do not synthesize source stays, reservation/loading/departure times, supplier readiness, physical packing, intermediate Preparing/Ready/Dispatch transitions or historical DG classification from current values. Historical participation must be distinguishable from an open movement independently of absent occurrence timestamps.

**Stock confirmation remains a separate authorized operation.** A proven historical AT_WAREHOUSE arrival may be confirmed IN_STOCK while its actual arrival date remains unknown. Preserve existing measurement, position, stock-date and permission requirements; unknown arrival alone must not block confirmation or be replaced with stock-confirmation time. Closed historical participation must not make the Order reserved or PREPARED_FOR_SHIPMENT.

Known stock/location must remain readable when arrival date is unknown. Subsequent outgoing selection still requires normal stock/eligibility checks.

All historical-operation changes commit together or none persist on validation, authorization, chronology, uniqueness, storage-association, stale-state or concurrency failure. Independently saved Orders remain saved. This does not decide FRO-343's separately owned inline-Order save boundary.

## Optional files, fiscal documents and later use

**Files:** FRO-324 extends FRO-342's pending-upload mechanism into this historical transaction. Reuse its creator/entity/context scope, file validation, file-operation authority, private storage, cleanup and consumed-reference protections. Reject invalid/incomplete selected files without creating a partial Shipment or movement. Failure retains otherwise valid pending files within their context lifetime; success associates them once with the same historical Shipment and preserves upload actor/time.

Coordinate file removal/expiry and lost-response recovery with the complete historical operation. A create-first/upload-after sequence does not satisfy selected creation attachments. No-file creation and ordinary post-creation attachments remain supported. Reconcile the consuming FRO-342/FRO-341 contracts before activating this extension; their generic upload implementation does not itself establish historical integration.

**Fiscal documents:** historical entry creates no delivery note (δελτίο αποστολής), issues nothing and performs no fiscal submission. These historical records are ineligible for subsequent retroactive preparation/issuance under this feature, including when an origin is known. Return actionable ineligibility through the shared fiscal contracts; do not fail by dereferencing an unknown origin. Preserve existing fiscal history and ordinary attachments. Any historical fiscal workflow requires a separately specified operation.

**Later use:** a historical Shipment may supply arrived-source contents to FRO-323 once current goods satisfy its stock/location/availability rules. Its original attribution and completed movement remain unchanged after later splits or onward transport. The From arrived Shipments shortcut remains unavailable inside historical creation itself.

Operational route/document/packing correction or reopening of historical ARRIVED records is excluded. Notes, comments and ordinary attachments retain their owning contracts and permissions.

## Authorization, concurrency and reads

* Require internal Frontline/system identity, SHIPMENT_CREATE and the existing SHIPMENT_EDIT authority required for arrival effects. Preserve affected-record access checks; historical entry grants no partner access or general Order-edit capability.
* Apply one shared business contract across GraphQL, REST and MCP. Candidate/conflict reads must not expose unauthorized record details.
* Revalidate reviewed contents, memberships, terminal state, stays, provenance, warehouse eligibility and allocations inside the transaction. Coordinate with split, stock confirmation, reservation, dispatch, arrival and reference changes; stale review cannot overwrite newer state.
* Use a caller-stable creation-attempt identity and authorized result recovery. Same successful request/retry returns the same Shipment and effects; conflicting payload reuse is rejected. An uncertain response must be resolved without starting a duplicate operation. Different attempt IDs must still fail duplicate-movement checks.
* Return canonical saved state, exact identities, matched provenance, date precision/unknown values, recording metadata and actionable errors. Expose completed participation without requiring fabricated timestamps.
* Update Shipment detail/list/summary/search, MCP mapping, Order journey/participation/location readers and generated client contracts. Unknown mode/origin must not break unrelated list rows. Date sorting/filtering must distinguish unknown occurrence from recording time.
* Preserve stable historical content and source references after later membership or name changes. Do not infer historical packing quantities or dispatch DG snapshots from today's arrangement/classification; unavailable facts remain unavailable.

## Existing records and release

The existing Shipment population is mock data. Preserve known canonical facts and history; this ticket authorizes no deletion/reset, guessed backfill or relabelling ordinary arrivals as historical.

Add migrations for the dedicated historical shape and related guards without weakening ordinary creation/lifecycle invariants or rewriting executed migrations. Cover Shipment, participation/content, warehouse stays and journey/history constraints, including missing occurrence dates and immutable provenance.

Coordinate activation with compatible readers, FRO-339 geography, FRO-345 history, FRO-342 upload integration and FRO-341/FRO-316 consumers. Backend preparation may precede the redesign release; unsupported callers must not receive unreadable historical records. Keep milestone/status/relation changes outside this implementation specification.

## Decisions

| Decision | Reason |
| -- | -- |
| Allow stock confirmation with unknown historical arrival date | Physical stock confirmation must not depend on inventing arrival evidence. |
| Reuse a matching opening expectation; reject a different warehouse | Preserve one active stay without silently relocating goods or manufacturing history. |
| Reject conflicting known arrival days | One historical Shipment must not combine contradictory movement evidence. |
| Europe/Athens comparison calendar; preserve actual precision | Keep validation deterministic across users, browsers and servers. |
| Associate optional files atomically through FRO-342 | Match historical creation's selected-file contract without partial saved outcomes. |
| Exclude retroactive fiscal preparation/issuance | Historical transport recording does not authorize fiscal reconstruction. |
| Keep UI in FRO-341/FRO-316 | One presentation contract; no duplicate design implementation. |

## Acceptance criteria

1. Authorized dedicated historical creation produces ARRIVED for eligible NETWORK_TRANSFER goods without replaying normal lifecycle commands; ordinary PREPARING creation is unchanged.
2. Required destination geography/warehouse and optional historical origin/mode/reference/date combinations validate consistently across adapters; unknown facts remain absent.
3. Europe/Athens date/future checks handle date-only and exact evidence, midnight/DST boundaries, blank input and conflicting matched days without inventing or erasing timestamps.
4. Matching EXPECTED stays are reused; mismatched opening warehouses, ambiguous/duplicate provenance and incompatible contents fail without partial effects.
5. Existing arrived/IN_STOCK links preserve physical arrival, status, stock facts, position, measurements and permanent identities; no duplicate arrival is recorded.
6. New historical arrivals remain AWAITING_IMPORT until separate valid stock confirmation. Unknown arrival dates remain unknown through confirmation and location reads; closed historical content creates no reservation.
7. Full nonterminal Order contents are enforced. Reservation conflicts, terminal/ineligible goods, subsequent movement, uncertain attribution and invalid partial selection are rejected with actionable errors and retained drafts.
8. Duplicate/retried/concurrent or stale operations cannot create duplicate Shipments, history, stay links, attachments or allocations. Any failure rolls back the complete historical operation.
9. Optional files associate atomically under FRO-342's validation/authority/recovery rules; no-file creation and ordinary attachment operations remain compatible.
10. Lists, Details, Order journeys/location, GraphQL/REST/MCP and FRO-323 source reads retain unknown facts, exact identities and historical attribution without crashes or fabricated packing/DG evidence.
11. One FRO-345 historical creation operation/initial ARRIVED event records provenance without synthetic intermediate states. Recording chronology remains separate from occurrence.
12. Historical fiscal preparation/issuance and unauthorized correction/reopening are rejected; ordinary permitted Notes/comments/files and existing fiscal history remain intact.
13. Migration/contract/consumer checks preserve ordinary records and lifecycle rules; coordinated activation and FRO-341/FRO-316 EN/EL, keyboard, narrow-screen, lookup-error and draft-retention integration are verified.

Run mutation, failure-injection, race, permission and retry cases only in an isolated test environment.

## Context for agents

Production source inspected read-only through gh at main **5c51030680c9d45b3827a7e19b8320c19aa5ed9a**, 23 October 2026. This is repository evidence, not deployed-version verification.

Java paths below are relative to `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Implementation context |
| -- | -- |
| `docs/reference/database.md`; app `src/main/resources/db/migration/V1__initial_schema.sql` | Existing Shipment origin/mode and ARRIVED timestamps/document requirements, source-stay/loading constraints, active-stay/allocation uniqueness and immutable stay provenance need scoped historical support. |
| `web/shipments/service/ShipmentsApiService.java`; `ShipmentInputValidator.java` | Normal create requires mode/origin; dispatch and arrival enforce normal states/chronology. Per-invocation UUIDs alone are not caller retry identity. |
| `web/purchaseorders/service/PurchaseOrdersApiService.java` | New Orders create EXPECTED opening stays; inbound stock confirmation currently requires known arrival. Adapt only the dedicated historical compatibility. |
| `domain/purchaseorders/PurchaseOrderWarehouseStayRepository.java`; `domain/shipments/ShipmentPurchaseOrderParticipationRepository.java` | Active stays/open participation affect stock, reservation and onward eligibility; historical completion cannot rely on invented occurrence times. |
| `web/shipments/service/ShipmentOutputAssembler.java`; `web/purchaseorders/service/PurchaseOrderOutputAssembler.java` | Current mode/origin assumptions and arrivedAt-based location selection require historical-safe reads. |
| App `src/main/resources/graphql/shipments.graphqls`; Shipment REST/MCP adapters and output mappings | Current required mode/origin/loadedAt and timestamp-only shapes do not represent all historical facts. Update schemas, mappings and generated clients consistently. |
| `domain/shipments/ShipmentRepository.java` | Canonical transport-number uniqueness/search must also cover untyped historical references. |
| `web/deliverynotes/service/DeliveryNoteDraftSourceService.java`; `DeliveryNotesApiService.java` | Fiscal planning uses participation/current goods and origin lookup; enforce historical ineligibility explicitly. |
| `docs/workflows/attachments.md`; `web/attachments/service/AttachmentsApiService.java` | Existing attachments require permanent owners; use FRO-342's new pending lifecycle rather than this existing upload as an atomic-create substitute. |
| Client `src/lib/date.ts`; Shipment/Order detail formatting | Date-only helper preserves calendar values; existing browser-local timestamp display is not this operation's comparison rule. |

Affected persistence includes `freight_shipment`, `freight_shipment_purchase_order`, `freight_shipment_load_unit_content`, `freight_purchase_order_warehouse_stay`, stable colli membership and journey/activity/attachment records. Update curated Shipment/Order lifecycle and authorization guides; regenerate database/API/client references from their sources.

## UI references

Use [FRO-341's creation preview](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site/) and FRO-316's saved Details contract. Preserve their current Initial status, date-field, geography, review and draft behavior without reproducing unrelated preview differences.

Retain the attached A/B previews and screenshots as nonbinding historical design references: [A](https://fro-324-historical-arrival-preview.frontlineltdproject.chatgpt.site?direction=a), [B](https://fro-324-historical-arrival-preview.frontlineltdproject.chatgpt.site?direction=b). They do not prescribe a second implementation or override FRO-341.

## Post-deployment verification

Production verification is read-only. Use existing authorized records and isolated-test evidence; missing examples remain unverified.

| AC | Read-only check |
| -- | -- |
| 1–2 | Read historical and ordinary Shipment fixtures through supported adapters; compare state, destination, optional facts and unchanged normal validation evidence. |
| 3 | Compare stored occurrence values/precision with midnight, DST, blank-date, matched-stay and conflicting-day test evidence under Europe/Athens. |
| 4–5 | Inspect exact stay/provenance links and before/after stock/position/measurement evidence; verify one physical arrival and review mismatch/duplicate rejection results. |
| 6–7 | Read unknown-arrival fixtures before/after stock confirmation, current warehouse and allocation state; review whole-Order, terminal, partial, reservation and later-movement tests. |
| 8–9 | Review retry/result-recovery, competing-command, file-expiry/storage and rollback evidence; compare one saved Shipment and its exact attachment ownership/metadata. |
| 10 | Read list/detail, Order journey/location and arrived-source examples with missing facts and later splits; compare permanent identities and unavailable historical values. |
| 11 | Read FRO-345's operation/status streams and linked colli evidence; verify one historical entry, separate recording/occurrence facts and no fabricated transitions. |
| 12 | Review fiscal/correction permission and rejection evidence; inspect retained fiscal history and permitted Notes/comments/files without submitting changes. |
| 13 | Review migrations/generated contracts and rollout evidence. When the owning UI is available, inspect creation/Details in EN/EL and narrow/keyboard states without submitting production records. |

**Out of scope:** UI/preview implementation; generic status assignment; historical DISPATCHED/CANCELLED/LOCATION_UNKNOWN creation; external-agent/vessel handovers; earlier-leg insertion behind later physical movement; historical auto-splitting/repacking or correction; inline Order orchestration; import customs declarations; Case/merida, accounting and retroactive fiscal workflows.

**Reference:** sources above; FRO-339 geography, FRO-325 lifecycle, FRO-345 history, FRO-342 uploads, FRO-343 inline Orders, FRO-323 onward selection and FRO-341/FRO-316 presentation.
