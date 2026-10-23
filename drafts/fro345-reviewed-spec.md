**Define Shipment history and activity:** preserve actual lifecycle transitions, record successful Shipment operations once, and support internal comments with reliable provenance.

A **Shipment** represents one physical transport leg. **Order = Purchase Order = stock-list item.** A **colli** has a permanent physical identity.

## Scope and ownership

This ticket owns history/comment persistence, authorized contracts and integration with the owning business commands. It blocks [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316), which owns the **History & activity** tab: **Shipment activity** with **Status history** and **Recorded operations**, followed by a separate **Comments** card. Reuse FRO-326's presentation. No new UI, preview or production branch belongs here.

| Owner | Contract |
| -- | -- |
| FRO-345 | Operation/transition identity, provenance, correlation, history reads, comments and Notes-change activity integration. |
| FRO-325 | Creation, participation, packing, transport documents, readiness and lifecycle commands. |
| FRO-344 | Pre-dispatch editing, its append-only audit and readiness invalidation. |
| FRO-324 | Dedicated historical-arrival creation and actual-date precision. |
| FRO-292 | Internal/External Notes storage, updates, attribution and confidentiality. |
| FRO-316 / FRO-341 | Saved Details / creation presentation and client integration. |

Consume these contracts without introducing another lifecycle or duplicating their audit records. Coordination references do not add blocking relationships.

## Record contracts and chronology

| Record | Required facts |
| -- | -- |
| **Status event** | Stable event identity; Shipment identity; originating operation identity; actual previous/new status; authenticated recording actor and recording timestamp; actual occurrence fact and precision where known; applicable reason/remark. Creation has no previous status. |
| **Recorded operation** | Stable operation identity; Shipment identity; operation type; authenticated actor and recording timestamp; applicable occurrence facts; changed facts and affected Order/colli/load-unit identities; explicit references to related source audit events. |
| **Comment** | Stable identity; owning Shipment; authenticated author; server recording timestamp; plain-text content, maximum 2,000 characters. |

Order each stream **newest recorded first**, with an immutable, deterministic tie-breaker that preserves the Shipment's command sequence. Display actual occurrence separately. A backdated movement must not reorder the recorded transition chain.

Existing evidence without a recording timestamp sorts after entries with known recording timestamps, using a stable source identity. This placement does not establish historical chronology and must not create a synthetic recording date.

For newly recorded activity, actor and recording time come from the authenticated successful command. Preserve date-only occurrence evidence as a date, timestamps as timestamps and unknown facts as absent. Historical-entry operator/time describe who recorded the information and when; they do not identify the person or exact time of an unknown historical movement.

Link each status event to its originating operation. Showing that operation in both status history and recorded operations creates no duplicate persistence. Preserve original facts, display-name snapshots and stable references after later renaming, editing, participation removal or load-unit replacement.

## Status history

Record transitions only through their owning authorized commands.

| Transition | Required history |
| -- | -- |
| Normal creation → PREPARING | Initial state and creation operation; no invented prior state. |
| PREPARING → READY_FOR_DISPATCH | Explicit confirmation and the confirmed plan/version. |
| READY_FOR_DISPATCH → PREPARING | Material saved edit or changed packing under FRO-325/FRO-344, linked to that edit operation. |
| READY_FOR_DISPATCH → DISPATCHED | Actual dispatch and its movement effects. |
| DISPATCHED → ARRIVED | Arrival, including final handover where applicable. |
| PREPARING / READY_FOR_DISPATCH → CANCELLED | Cancellation, canonical reason/time and reservation/release effects. |
| DISPATCHED → LOCATION_UNKNOWN | Canonical reason/time and uncertainty effects. |
| Historical creation → ARRIVED | FRO-324's historical-entry provenance and actual known/unknown dates; no synthetic Preparing, Ready or Dispatch events. |

Preserve repeated Ready → Preparing → Ready cycles. Repeated confirmation of an unchanged already-confirmed plan creates no false transition or duplicate success.

Cancellation and location-unknown event reads expose the full canonical reason and known occurrence/recording facts. Preserve the underlying reason/timestamp fields; comments cannot replace or change them. When provenance is incomplete, return unknown values explicitly rather than substituting Created by or current time.

Provide the event reference associated with the current status and an authorized way to retrieve that exact event independently of the first history page. This supports FRO-316's **View history** action. Supply the actual preceding principal state only when the recorded transition chain establishes it; otherwise report it unavailable. Never derive it from a progress counter or assumed lifecycle path.

No generic status setter, reopening/correction action or additional Shipment status is introduced.

## Recorded operations

One successful command produces **one logical Shipment operation**, with its combined effects.

| Operation | Required detail |
| -- | -- |
| **Shipment created / historical arrival recorded** | Saved route, purpose, mode and participating identities; explicit child-split/reservation or historical-arrival links as applicable. |
| **Route / purpose / mode edited** | Relevant before/after facts, readable snapshots and stable references, including geography and warehouse/agent/vessel context. |
| **Participation edited** | Added/removed Orders and permanent collis, reservations/releases, child/root lineage and any explicitly created split references. Removal preserves historical attribution. |
| **Packing saved / changed** | Before/after saved arrangement, changed load units and assignments, permanent colli references and all-individual packing. Preserve previously referenced load-unit identities and facts. |
| **Readiness confirmed / invalidated** | Confirmed plan/version or the saved material change causing invalidation. A combined edit and invalidation remains one operation with a linked transition. |
| **Transport document assigned / replaced / cleared** | Mode-derived type and previous/new number or explicit absence, under FRO-325/FRO-344. |
| **Dispatch / arrival / cancellation / location unknown** | Relevant movement facts, reasons and affected identities. Arrival with handover is one operation; include recipient, received-by and proof references where recorded. |
| **Notes updated** | Which of Internal Notes / External Notes changed, actor and recording time; retain references to existing protected audit records. Do not copy note text into the activity summary. |

A combined save changing several fields remains one operation containing the relevant effects. Initial Notes supplied during creation belong to the creation operation, not a fabricated later Notes update. Preserve FRO-292's confidentiality and access controls for any underlying audit detail.

A root operation may link several source command IDs. Shipment creation and its child splits must remain one logical Shipment operation even when existing source events have different command IDs. Multi-Order/multi-colli dispatch likewise appears once with linked effects. Use explicit source links and Shipment attribution; never correlate by matching text, timestamp proximity or current membership.

Opening an editor/review, cancelling unsaved work, denied/failed/stale commands and semantically unchanged saves create no completed operation or transition. Preserve infrastructure/security logs for their own purposes.

Comments remain a separate stream. Detailed attachment and delivery-note lifecycle events remain outside this activity scope; retain their existing records, audit and UI locations.

## Comments

* Read comments using existing internal Shipment scope and SHIPMENT_VIEW. Adding requires internal identity, SHIPMENT_EDIT and record access, enforced server-side.
* Authorized users may add comments in **every saved Shipment status**, including DISPATCHED, ARRIVED, CANCELLED and LOCATION_UNKNOWN.
* Accept nonblank plain text up to **2,000 characters**, using the existing Order-comment length convention consistently across adapters and client validation. Reject empty/whitespace-only and over-limit input; preserve accepted content and line breaks without silent truncation. Render safely without interpreting HTML.
* Derive author and recording time server-side. The caller cannot impersonate another author or supply a historical comment timestamp.
* Adding a comment changes no status, readiness, route, membership, packing, Notes or movement facts. It must not invalidate a confirmed operational plan or an otherwise valid review solely because a comment was added.
* No client/partner visibility grant, comment editing/deletion, attachment support or conversion of generated operations into comments is introduced.

## Atomicity, concurrency and retries

Persist each operation, its transitions and explicit source-event links **in the same transaction as the successful owning command**. A history-write failure rolls back the business save; a business failure leaves no successful history.

Reuse FRO-344's append-only edit audit and the existing PO/colli records through linked records or a consistent projection, without creating competing copies. Preserve canonical lifecycle, reason, handover and journey records.

Provide a stable request identity for retriable writes, including comments, consistently through GraphQL, REST and MCP. A UUID newly generated for each server invocation is not sufficient.

* Replaying the same authorized request returns the existing operation/comment identity and outcome without repeating effects.
* Concurrent copies of the same request create at most one successful result.
* Reusing an identity with different input returns a conflict without mutation.
* After a lost response, callers can resolve the committed outcome and read current canonical state before deciding to retry.
* Separate intentional submissions may contain identical comment text; do not deduplicate by content.
* Recheck current authorization before returning a prior result. Share business-command version/locking rules with dispatch, cancellation and editing; no stale retry may overwrite newer state.

History is append-only. Later edits, removal of participation or reference changes must not erase or retarget earlier facts. No history deletion, child merging or fabricated movement is authorized.

## Read contracts and delivery

Expose Shipment-scoped status history, recorded operations, operation details/source links, exact status-event lookup, comments and add-comment through the relevant GraphQL/REST/MCP adapters using shared validation and authorization.

Use bounded pagination with documented defaults and maximums. Return deterministic continuation information; reading subsequent pages must not duplicate or skip existing entries when newer activity is appended. Keep timestamp ties stable. Distinguish an empty stream from unavailable/failed reads.

Enforce Shipment access on every list, detail, linked-event and replay lookup. A valid event ID from another Shipment must not expose that record through the requested Shipment. Internal Notes must not leak through broader history responses, errors or source links.

Deliver backend capture/contracts in this ticket's milestone; FRO-316/FRO-341 retain later presentation ownership. Coordinate capture with each owning command before enabling that command's new behavior. UI availability is not a prerequisite for recording history. Existing enabled callers must remain compatible and cannot bypass history or retry guarantees.

Update new migrations, source API contracts, generated references/client contracts and domain documentation together. Preserve existing permissions, Notes, attachments, delivery notes, Order activity and colli journeys.

## Existing mock data and historical facts

The existing Shipment population is **mock data**. A production legacy-history reconstruction project is outside scope. This ticket does not authorize deleting or resetting existing records.

Preserve existing canonical timestamps, reasons, handover facts and source audit records. Existing records without complete new history may expose only supported facts, with missing actor, recording time or previous state explicitly unknown. Do not fabricate a complete timeline from current status, packing or unrelated Order transitions. Canonical cancellation/location-unknown facts must remain accessible even when no complete transition stream exists.

New commands record complete prospective history. Provide nonproduction fixtures covering repeated readiness cycles, partial child creation, multiple Orders/collis, Notes updates, terminal comments, retries, and historical arrivals with known, date-only and unknown occurrence facts. Historical-arrival functionality remains governed by FRO-324 regardless of the current mock-data population.

## Decisions

| Decision | Reason |
| -- | -- |
| Newest recorded first; occurrence shown separately | Keep the audit sequence stable when movement facts are entered later or have incomplete precision. |
| Comments allowed in every saved Shipment status | Follow-up discussion must remain possible without reopening the operational workflow. |
| Comment maximum 2,000 characters | Match the existing Order convention and provide consistent validation. |
| Mock-data scope; no production legacy reconstruction | Match the confirmed population while preserving existing facts and historical-arrival support. |
| Notes updates appear once with changed field names, actor and time | Make changes discoverable while keeping text in its protected owning records. |
| Existing redesigns own presentation | Integrate with the agreed UI without introducing another design or frontend branch. |

## Acceptance criteria

1. Authorized internal users can read each Shipment's streams, operation details and exact status event with stable bounded pagination. Unauthorized and cross-Shipment access is denied.
2. Every successful initial-state/transition command atomically records its actual state facts and links to one operation. Repeated readiness cycles remain intact; no-op confirmation creates no duplicate.
3. Cancellation/location-unknown reads preserve full canonical reasons, known times and unknown provenance. Exact-event navigation works beyond the first page; preceding stage is supplied only with evidence.
4. Creation with child splits, multi-colli dispatch and combined edits produce one logical operation each with complete explicit effect links. Existing PO/colli and FRO-344 audits remain intact without duplicate logical activity.
5. Route, participation, packing and document changes retain their required before/after facts and identities. Notes updates show changed field names/actor/time without copied note text in activity summaries.
6. Comments work in every saved status, enforce authority, blank/2,000-character rules and safe full-text handling, and preserve operational state and review validity.
7. Denied, failed, stale, cancelled and unchanged work creates no successful history. Same-request retries/concurrent copies produce one result; conflicting identity reuse is rejected and intentional identical comments remain distinct.
8. Recording order is deterministic and separate from occurrence. Historical entries retain date precision/unknown facts, and later changes cannot alter prior snapshots or source attribution.
9. Existing mock records preserve canonical evidence without fabricated histories or deletion. Fixtures and published contracts cover all supported paths, and command activation cannot bypass capture.

Run mutation, rollback, concurrency, retries, pagination-under-append, authorization, text-boundary and historical cases in an isolated test environment.

## Context for agents

Live repository: Frontline-Forwarding/frontline-forwarding; checked main **3820e89e8caa341261e2d48bcb282d93e1bb1d03** on 23 October 2026. Refresh before implementation.

| Source | Implementation context |
| -- | -- |
| `docs/reference/database.md` and `frontline-forwarding-app/src/main/resources/db/migration/` | Shipment milestones/reasons; canonical cancellation_reason; per-PO/colli events and command references. No dedicated Shipment history/comment stream in the checked source. Existing colli occurred_at does not establish recording time. |
| `frontline-forwarding-app/src/main/resources/graphql/shipments.graphqls` | Current lifecycle inputs accept occurrence timestamps; no Shipment history/comment contract or caller retry identity. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/output/ShipmentOutput.java` | Current output exposes cancelledAt and locationUnknownReason/time, but omits cancellation reason. Explicitly map the canonical reason into history reads. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java` | Transactional lifecycle effects; fresh command UUIDs per invocation and separate child-split command IDs. Arrival owns handover; current handover confirmedAt is assigned arrival time and must not be mistaken for independent recording-time evidence. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/shipments/ShipmentAuthorizationService.java` | Internal identity plus existing SHIPMENT_VIEW/SHIPMENT_EDIT. Preserve record scope across adapters and linked reads. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` | Existing required-text, 2,000-character message convention and actor/time attribution; current addMessage does not establish retry safety. |
| `docs/workflows/shipment-lifecycle.md`; `docs/architecture/authorization.md` | Existing lifecycle/movement and authorization rules to preserve. |

Affected systems: frontline-forwarding-app persistence/services/API adapters, generated contracts consumed by frontline-forwarding-client and the listed domain documentation. Presentation remains with its owning tickets.

## Post-deployment verification

Production checks are read-only. Use existing records and isolated-test evidence; never submit a command or comment solely to verify this ticket. Missing evidence means unverified.

| Acceptance | Concrete read-only check |
| -- | -- |
| 1 | Read existing Shipment streams through the published adapters; follow page continuations and operation IDs. Compare with isolated-test evidence for denied/cross-Shipment reads and concurrent appends. |
| 2 | Read a fixture or existing Shipment with repeated readiness cycles; compare transition order, old/new states and operation links with its saved command evidence. Review rollback/no-op test results. |
| 3 | Retrieve a known cancelled/location-unknown event directly, including one outside the first page; compare full reason/time with canonical saved facts and inspect supported/unknown predecessor cases. When FRO-316 is delivered, open View history without mutation. |
| 4 | Read creation-with-split and multi-colli dispatch operations; compare their source links with existing child, PO and colli audit evidence and count one logical Shipment operation per command. |
| 5 | Inspect saved edit operations and Notes-updated entries; compare changed facts/identities with authorized before/after evidence and confirm summaries contain no note text. |
| 6 | Read saved comments and published length/access contracts; compare terminal-state, blank/limit, escaping and unchanged-plan/review evidence from isolated tests. Do not post comments in production. |
| 7 | Review saved request/outcome evidence and automated replay, concurrent, conflicting-key, failure and stale-command results; confirm one identity per successful request and no records for rejected work. |
| 8 | Read backdated and historical-arrival fixtures; compare recorded ordering, actual-date precision, unknown values and retained snapshot facts after previously tested edits. |
| 9 | Compare pre-change mock-record evidence with retained canonical facts; inspect fixture coverage, deployed migrations/contracts and command-integration test results. |

**Out of scope:** UI/preview work or production branches; external Shipment visibility; generic status changes or reopening; comment edit/delete; replacing Notes; comprehensive attachment/delivery-note activity; Order warehouse-stay/reminder-history cards; production legacy reconstruction; invented historical facts or deletion/reset of existing records.

**Reference:** [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316), [FRO-325](https://linear.app/front-line-ltd/issue/FRO-325), [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344), FRO-324, FRO-292 and FRO-326; repository sources above.
