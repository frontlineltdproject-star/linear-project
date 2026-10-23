**Allow authorized operators to edit a saved Shipment before dispatch**, keeping participation, packing, delivery notes and readiness consistent.

**Order = Purchase Order = stock-list item; colli = permanently identified handling unit.** Shipment readiness is an explicit confirmation of completed physical packing, distinct from a saved plan and permission to depart.

## Scope and ownership

This ticket owns pre-dispatch route/membership editing, dependent-record reconciliation and material-change readiness invalidation. It blocks FRO-316, which owns editing presentation using FRO-326's style and FRO-341's selection controls. No UI implementation, preview or production branch belongs here.

| Owner | Contract consumed |
| -- | -- |
| FRO-325 | Creation, reservations/splits, packing, transport documents, readiness and lifecycle commands. Related, with no blocking relation in either direction; integrated behavior requires compatible contracts. |
| FRO-339 | Complete planned geography and current warehouse compatibility. |
| FRO-345 | Append-only operation/status history, source correlation and retry identity. |
| FRO-292 / existing attachments | Independent Notes and file contracts, permissions and lifecycle. |
| FRO-357 / existing delivery-note workflow | Greek Frontline-origin eligibility and fiscal safeguards. Reuse FRO-303's draft-consistency conventions without extending its Order correction scope. |
| FRO-316 / FRO-341 | Saved editing / shared Order-colli selection presentation. FRO-344 owns adaptation of arrived-source lookup to saved membership. |

## Editable information and readiness

Operations require PREPARING or READY_FOR_DISPATCH and the applicable authorization.

| Information | Type / rule | Effect when Ready |
| -- | -- | -- |
| Origin/destination country and city | Reference IDs; all four complete and compatible under FRO-339. | Changed save → PREPARING. |
| Origin warehouse | Warehouse reference; every retained Order/colli must be valid at the proposed origin. | Changed save → PREPARING. |
| Purpose and destination | Existing purpose and compatible warehouse/agent references; direct-vessel destination remains derived from participating Orders. | Changed save → PREPARING. |
| Mode | ROAD / AIR / SEA; resolve the mode-derived document explicitly. | Changed save → PREPARING. |
| Participation | Final set of permanent colli IDs with current Order attribution and explicit applicable split decisions. | Changed save → PREPARING. |
| Packing | FRO-325 load units, assignments and recorded packing values. | Ordinary changed save → PREPARING; explicit confirmation follows FRO-325. |
| Transport-document number | FRO-325 assignment/replacement/clearing, normalization, uniqueness and mode rules. | Valid number-only change retains readiness. |
| Internal/External Notes and attachments | Owning contracts and permissions. | Retain readiness. |
| Identity, Created at/by, recorded history | Protected; not general edit inputs. | Unchanged. |
| Status and actual departure/arrival/handover facts | Authorized lifecycle operations only. | No generic setter. |

A material save in PREPARING remains PREPARING. Opening/cancelling an editor, a rejected operation and a canonically unchanged save produce no change event or readiness invalidation. Serialization order alone is not a membership change. Any permitted save containing a material change invalidates readiness atomically, including associated document reconciliation.

Preserve earlier confirmations as history. Dispatch requires renewed FRO-325 confirmation of the current valid plan. A saved membership/route change does not attest physical packing, unpacking or movement.

Reject operational editing in DISPATCHED, ARRIVED (including historical arrivals), CANCELLED and LOCATION_UNKNOWN. Notes/files retain their separate lifecycle permissions. Their readiness exception does not bypass their validation.

## Route and operation boundaries

Validate the complete proposed route, purpose-specific destination, same-vessel rules, current warehouse geography and exact retained participation. Missing/incompatible geography must be corrected explicitly; never infer it or move goods to make a plan valid.

Mode changes require explicit replacement, clearing or confirmation of a valid mode-compatible document reference. Do not silently reinterpret an old number. An absent number is allowed before dispatch under FRO-325.

Route and membership remain separate operations. Membership payloads cannot change route or submitted packing. Keep at least one eligible colli after every save. If changing origin and replacing cargo has no valid intermediate save, reject with an actionable explanation; use the existing deliberate cancellation/new-creation workflows. Never cancel or create a Shipment automatically.

## Membership, splits and releases

| Case | Required outcome |
| -- | -- |
| New additions | Apply current creation eligibility, origin/purpose checks, terminal-state exclusions and allocation guards. Upcoming READY/EXPECTED_READINESS selections remain whole; preserve existing expected-date rules for new additions. |
| Retained selections | Recognize this Shipment's own reservations, including stocked PREPARED_FOR_SHIPMENT Orders. Revalidate current stock/location, identity and allocation consistency without treating own reservations as foreign conflicts. |
| Retained upcoming Order whose expected date passed | The elapsed date alone does not evict it or block unrelated valid edits. Readiness still requires stock confirmation under FRO-325. |
| New partial IN_STOCK selection | Require the existing explicit split reason and conditional remark; create the participating child atomically using existing inheritance/lineage rules. |
| Partial reduction of a stocked reserved Order | Permit an explicit reviewed split despite PREPARED_FOR_SHIPMENT. Retained selected collis become the participating child; release the nonselected remainder. Preserve permanent identities, inherited data and direct-parent/root lineage. |
| Unchanged existing child or whole selection | Do not split it again. A later genuine partial reduction requires a new explicit split decision; no automatic merging. |
| Whole removal | Release the current reservation. Stocked PREPARED_FOR_SHIPMENT Orders return to IN_STOCK; upcoming READY/EXPECTED_READINESS retain their current readiness facts. Use current stock facts, not the status at original reservation. |

Recheck the complete proposed selection under lock. Persist splits, current attribution, reservations/releases, packing reconciliation, affected drafts, audit and readiness together. No observable release-before-split interval may allow another Shipment to take retained cargo. Upcoming Orders cannot use the stocked-reservation split exception.

Keep source stays and stock-confirmation facts intact; removal is not arrival, cancellation or departure. Preserve immutable historical participation/content and loading-time attribution. Close superseded current allocation with an explicit pre-dispatch removal meaning and create fresh current records when goods are re-added or reattributed to a new child. Do not overwrite earlier journeys or reuse ARRIVED/CANCELLED to describe an edit.

Preserve valid packing assignments for retained colli identities; remove assignments for removed collis. Added collis travel individually until explicitly packed. Reject an arrangement leaving empty/invalid load units and identify them: the operator must first remove/unpack those units through FRO-325, then retry membership. Preserve prior confirmed arrangements and historical load-unit references; this reconciliation alone records no physical unpacking.

## Delivery-note reconciliation

A delivery note (δελτίο αποστολής) must not describe obsolete goods or movement. Evaluate actual affected documents and proposed snapshots, including target company-group conflicts. Unrelated documents must not blanket-block an edit.

| Affected state | Handling |
| -- | -- |
| No current notes | Do not prepare notes merely because a Shipment changed. |
| Wholly unsubmitted DRAFT with no fiscal identity/payload | Reconcile atomically as below, with delivery-note edit/create authority in addition to SHIPMENT_EDIT. |
| ISSUED, SUBMISSION_PENDING, SUBMISSION_FAILED or CANCELLATION_PENDING | Reject affected edits until the existing authorized fiscal reconciliation resolves the conflict. Preserve allocated number, payload and uncertain outcomes; never overwrite, automatically cancel or reissue. |
| CANCELLED | Preserve unchanged as history. Evaluate any current replacement draft independently. |

### Goods and company groups

For a Shipment with existing eligible drafts, update only affected lines/groups from final exact participation. Preserve unaffected line quantities/weights and snapshots; use existing validated goods calculations for additions and changed selections. A split must replace the affected attribution with the resulting child/remaining participation without duplicating cargo or importing unrelated family collis.

Group by Invoice company with existing vessel compatibility. Recalculate affected total collis and gross weight from their final lines and maintain sequential line numbering. Reuse eligible target drafts; create a missing required group only within this reconciliation and under FRO-357 eligibility. Remove an emptied wholly unsubmitted draft, retaining its audit evidence.

Preserve existing target recipient snapshots and operator-entered movement details. New groups require validated recipient details and explicitly resolved movement values; missing data, incompatible vessels or conflicting values reject the whole save. Do not select between conflicting values silently. Historical cancelled/submitted snapshots remain unchanged.

### Route and entered values

| Shipment change | Reconciliation scope |
| -- | -- |
| Origin warehouse/geography | Re-evaluate fiscal eligibility and affected loading address/movement details. |
| Destination geography, purpose or recipient destination | Review affected destination address/movement details; Shipment purpose is not an automatic mapping to the fiscal movement-purpose code. |
| Membership or child attribution | Reconcile goods/company/vessel grouping; refresh client-based destination-address choices without replacing saved address values. |
| Mode or document reference | Check affected movement/reference values; do not infer vehicle or overwrite the independently entered related-document field. |
| Packing grouping, Notes/files or unrelated fields | Preserve fiscal snapshots under their owning contracts; no blanket refresh or block. |

Require explicit confirmation or correction of affected operator-entered draft values and save the resolution atomically with the route edit. Preserve unaffected values. Country/city or a changed reference is not enough to invent a full address. FRO-316 owns integration into its existing edit/review flow. If a caller cannot supply required resolution, reject the edit with affected-document/field feedback.

If an otherwise valid origin change makes the Shipment ineligible under FRO-357, allow explicit removal of existing wholly unsubmitted drafts within the same authorized transaction, preserving audit evidence and creating no replacements. Missing removal confirmation rejects the edit. Submitted/protected documents retain the state rules above. Becoming eligible does not itself create notes.

Lock/version-check documents with the Shipment edit and coordinate with preparation, draft edits, Invoice company correction, issuance and cancellation. A concurrent fiscal action must not submit stale data or permit partial reconciliation. These edits allocate no fiscal number and call no AADE submission/cancellation operation.

## Read contracts and UI integration

Return canonical route/document values, exact current Order/colli membership, current and loading-time attribution, child/root lineage, saved packing, status, versions and totals independently of overpacks. Preserve FRO-325 totals, FRO-295 PCS retirement and FRO-297 distinct DG-colli rules; do not fabricate missing measurements or historical snapshots.

FRO-316's membership modal reuses FRO-341 selection and Partial selections, prefilled with exact saved membership. Provide eligible additions beyond current participants and authorized exclusion reasons. Adapt arrived-source lookup for saved editing: preserve historical carried identities, resolve current attribution, include own retained selections, reject foreign reservations and deduplicate globally by permanent colli ID. Reuse FRO-323 lookup foundations without treating its creation-only eligibility as sufficient for editing.

Opening, source switching and Cancel do not mutate persistence. Return actionable per-Order/colli/load-unit/document errors so the UI retains drafts on failure and refreshes authoritative values after success. The membership editor neither creates another Shipment nor extends FRO-343's inline Create new Order shortcut.

## Authorization, concurrency and history

Use shared services for GraphQL, REST and MCP. Require SHIPMENT_EDIT and existing Frontline/system-admin identity; preserve existing read authorization. Document adjustments/removal additionally require existing delivery-note authority. Do not grant partner access or bypass protected fields through alternate adapters.

Expose expected/current versions for new edit contracts and check all affected records consistently with dispatch, cancellation, stock confirmation, warehouse changes and fiscal operations. A material edit makes an old review stale. Notes/comments/files do not constitute material-plan changes; stale writes must still not overwrite newer data.

Use FRO-345's stable request identity and committed-outcome contract. The same authorized request returns the same result without duplicate splits, reservations, document changes or history; a reused identity with different input conflicts. Recheck authorization before returning a prior outcome. Never replay stale intent over newer state.

Persist one logical successful operation with actor/time, before/after facts, affected identities, source links and any actual Ready → Preparing transition. Preserve readable historical facts after removal, split or reference renaming. Failure of any business/history/document write rolls back the complete command.

## Persistence and release

Add new migrations for route, content, participation and load-unit guards, including pre-dispatch release/re-addition semantics. Permit only agreed edits in both pre-dispatch states. Preserve identity, fiscal and post-dispatch protection; do not rewrite executed baseline migrations.

Preserve existing records, lineage, movement history and missing historical facts; no reset, deletion of historical evidence or invented backfill. Only explicitly authorized unsubmitted-draft removals above are permitted by these operations.

Update API/client contracts and curated documentation; regenerate references from their sources. FRO-344/FRO-325 target 0.0.7 while FRO-316/FRO-341 target 0.0.9: coordinate activation with compatible supported callers and the existing UI owners. Do not enable paths lacking required split/fiscal resolution or strand callers; no milestone/relation change is implied.

## Acceptance criteria

1. Authorized operators can edit the specified fields in both pre-dispatch states; unauthorized and later-state operations fail without changes. Identity and lifecycle facts remain protected.
2. Material saves atomically invalidate Ready; no-op/cancel/failure and valid nonmaterial changes preserve readiness. Stale reviews cannot reconfirm an edited plan.
3. Complete route/mode/document validation applies. Impossible separate origin/cargo changes return the agreed limitation without automatic cancellation, creation or movement.
4. Reads/prefill/search support exact identities, existing children, own/foreign reservations and arrived sources. Retained overdue upcoming cargo remains selectable; new additions and readiness retain their stricter rules.
5. Explicit stocked-reservation partial reduction creates the correct participating child and releases the remainder exactly once. Whole removal restores current stock/readiness state; upcoming partials fail.
6. Removal/re-addition preserves immutable lineage and history. Packing reconciliation preserves retained assignments and physical history, rejects empty units actionably and adds cargo individually.
7. Eligible draft reconciliation updates affected goods/groups/totals atomically, preserves unrelated facts and entered values, and rejects missing/conflicting data or insufficient document authority.
8. Route-dependent draft values require explicit resolution; ineligible-origin draft removal requires explicit confirmation. Protected fiscal states and cancelled history remain intact; no automatic issuance/cancellation occurs.
9. Concurrent edits, dispatch, stock/fiscal operations, retries and failures cannot produce stale overwrites, duplicate effects or partial history. Canonical reads resolve uncertain outcomes.
10. Existing creation, lifecycle, Notes/files, totals and historical records retain their owning contracts; compatible consumers and controlled-environment verification precede activation.

## Decisions

| Decision | Reason |
| -- | -- |
| Atomically reconcile unsubmitted drafts | Allow correction without stale documents or lost operator values. |
| Explicit partial reduction of stocked reserved Orders | Retain exact selected cargo through traceable child participation. |
| Separate route/membership operations | Preserve the existing UI scope; impossible combined changes use deliberate cancellation/new creation. |
| Retain overdue upcoming reservations | Elapsed estimates do not undo existing allocation; physical readiness still requires stock. |
| Explicit resolution of affected draft route values | Preserve operator intent without guessing addresses or movement details. |
| Explicit unsubmitted-draft removal on lost eligibility | Avoid obsolete drafts while retaining fiscal/audit evidence and preventing ineligible replacements. |

## Context for agents

Live repository evidence: Frontline-Forwarding/frontline-forwarding, main 38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e.

Java paths below are under frontline-forwarding-app/src/main/java/com/frontline/forwarding/.

| Source | Implementation context |
| -- | -- |
| web/shipments/service/ShipmentsApiService.java | Creation owns child/reservation effects; partial creation requires IN_STOCK. Cancellation restores stocked reserved Orders; do not reuse creation blindly for edits. |
| domain/shipments/Shipment.java; ShipmentAuthorizationService.java | Domain version exists; internal identity plus SHIPMENT_EDIT authorization. |
| frontline-forwarding-app/src/main/resources/graphql/shipments.graphqls | No general edit command/current Shipment version exposure; extend contracts explicitly. |
| frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql | Route identity and content guards; participation/content closing currently recognizes ARRIVED/CANCELLED, requiring new removal semantics. |
| web/deliverynotes/service/DeliveryNotesApiService.java | Preparation skips existing company notes; re-running it does not reconcile draft goods. |
| web/deliverynotes/service/DeliveryNoteDraftSourceService.java; domain/deliverynotes/DeliveryNoteDraftPlanner.java | Current Order-based goods source, company/vessel grouping and totals; use final exact participation for editing. |
| docs/workflows/shipment-lifecycle.md; docs/workflows/delivery-note.md | Stock/reservation history, fiscal snapshots, entered addresses, permissions and uncertain outcomes. |

## Post-deployment verification

Use authorized read-only records and controlled-environment test evidence. Never edit, dispatch, split, delete or issue production records to verify this ticket.

| AC | Read-only check |
| -- | -- |
| 1 | Inspect deployed contracts and permission/state test results; compare saved records for successful and rejected edits. |
| 2 | Read status/operation/confirmation history for material, no-op and failed-save fixtures; compare plan versions and stale-review rejection evidence. |
| 3 | Compare saved route/document facts with route-validation fixtures and rejected combined-origin cases; confirm no movement/cancellation/creation effects. |
| 4 | Read membership/candidate responses for own/foreign reservations, existing children, arrived sources and overdue upcoming fixtures; check deduplicated identities/totals. |
| 5 | Compare saved parent/child membership, reservations and Order/stay statuses with explicit reduction/removal evidence; review retry and upcoming-partial rejection tests. |
| 6 | Read prior/current participation, content and packing history after remove/re-add fixtures; verify earlier attribution and physical events remain intact. |
| 7 | Read deliveryNotesByShipmentId or GET /api/v1/shipments/{shipmentId}/delivery-notes; compare final lines/groups/totals and retained entered values with reconciliation tests/audit. |
| 8 | Inspect route-resolution/removal confirmation audit and protected-state rejection evidence; compare retained fiscal identities, cancelled snapshots and absence of fiscal calls. |
| 9 | Review controlled concurrency/failure/replay results and persisted operation IDs; read canonical versions/outcomes to confirm atomic, duplicate-free effects. |
| 10 | Review migration/rollout evidence and owning-contract regression results; inspect compatible FRO-316 integration when delivered. |

**Out of scope:** UI/preview implementation, production branches, combined route/membership editing, post-dispatch corrections/reopening, new Shipment statuses beyond FRO-325, direct colli-master measurements, family merging, historical rewriting, automatic fiscal cancellation/issuance and replacing Notes/file ownership.

**Reference:** FRO-316/FRO-341 presentation; FRO-325 preparation/lifecycle; FRO-339 geography; FRO-345 history; FRO-292 Notes; FRO-357 fiscal eligibility; repository sources above.
