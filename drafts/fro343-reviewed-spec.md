**Create an ordinary Order during Shipment creation** and return its permanent Order/colli identities to the draft, without requiring an Import/Export category.

**Order = purchase order = stock-list item; colli = handling unit.** Support Preparing and historical Arrived workflows. This ticket owns backend integration, authorized results, eligibility, independent persistence, retries and audit. FRO-341 owns the inline form and return presentation, reusing FRO-335.

## Order creation and persistence

Reuse the complete authorized Order creation model, reference data and validation, including compatible approved field changes. No reduced quick-add model or obsolete fixed form layout. Client, Opening warehouse and Owner reference remain required; Vessel follows the selected Client's existing requiredness rule. Validate server-side.

| Area | Contract |
| -- | -- |
| Save boundary | Completing Order creation commits the Order independently of the unsaved Shipment. Atomically save its creation-owned children, permanent colli identities, opening stay, selected attachments and history. |
| Visibility | The saved Order is an ordinary Stock list record and remains available through authorized Order reads, whether selected for the Shipment or not. |
| Abandonment | Abandoning or failing Shipment creation does not delete, cancel or undo the saved Order or its attachments. Ordinary saved-Order lifecycle and reminder eligibility remain applicable; inline creation adds no new reminder trigger. |
| Before confirmed creation | Cancelling an unsubmitted Order form creates no Order. Resolve an in-flight or uncertain submission before claiming cancellation means no Order exists. Pending-file abandonment follows FRO-342. |
| Independence | Failure of the Order transaction creates no partial Order effects. Failure of the later Shipment transaction creates no partial Shipment effects and leaves previously saved Orders intact. |

Use FRO-336's initial-readiness contract and FRO-335's validation/review:

| Initial state | Date rule |
| -- | -- |
| PENDING — Awaiting Readiness Date | Default; date absent. |
| EXPECTED_READINESS — Received Readiness Date | Date required; past, today and future accepted for Order creation. |
| READY — Ready at supplier | Date optional; explicit readiness confirmation through the shared creation flow. |

All three allow zero collis. Create directly in the selected state; do not chain creation and readiness mutations. Preserve FRO-336's registration history, optional remark rules and EXPECTED opening stay. Creation records no physical arrival, stock confirmation, reservation or dispatch. Declared measurements are not warehouse-confirmed measurements.

Suggest the Shipment origin as Opening warehouse for Preparing and its receiving warehouse for Arrived, only when known. Otherwise leave it blank. Keep the value editable and validate the selected active authorized warehouse. A suggestion or override never changes the Shipment route, proves stock/arrival or bypasses eligibility. Do not overwrite an operator-entered value when Shipment context changes.

## Eligibility and return selection

| Workflow | Required behavior |
| -- | -- |
| Preparing | Consume FRO-325's normal origin eligibility. READY or EXPECTED_READINESS requires a matching EXPECTED stay; expected readiness must be today or later for selection. IN_STOCK requires the matching stocked stay. PENDING, zero collis, incompatible warehouse, conflicting allocation and stale contents cannot be included. |
| Historical Arrived | Consume FRO-324's dedicated receiving-warehouse and historical-compatibility checks. Reuse a matching opening EXPECTED stay; reject a different opening warehouse. Require the whole current nonterminal colli set. Preserve existing-arrival matching, chronology and stock rules; do not use the outgoing-candidate query as a historical shortcut. |
| Physical history | Explicit initial-readiness registration remains a registration fact. Never backdate it or invent supplier readiness, source stock or movement to support historical arrival. Historical occurrence dates and recording times retain FRO-324's distinction. |

After confirmed Order creation, evaluate its current identities against the current Shipment context:

1. If eligible, automatically select its complete current nonterminal colli set **once**. Preserve all prior selections and applicable partial-selection decisions; deduplicate by permanent identity.
2. If route information needed for eligibility is missing, the Order is ineligible or the eligibility read fails, retain the created identity and expose **Order saved, not selected** with an actionable reason.
3. Later route/status changes or successful lookup retries must not silently select it. Require explicit selection through the existing controls.
4. Replaying the successful create result must not re-add goods the operator deliberately deselected.
5. Draft selection creates no reservation or Shipment participation and does not freeze Order editing.

Zero-colli Orders remain saved without invented packages. Return/readback must work independently of the current search text or result page. Expose the saved Order identity, permanent colli identities, actual saved state, eligibility outcome and affected-record reasons through authorized contracts; an unavailable read is not proof of failed creation.

Preserve Preparing's whole-Order rule for upcoming Orders and explicit partial-IN_STOCK child decisions. Historical selection remains whole-Order with no automatic split. At final Shipment submission, revalidate current permissions, warehouse, status, dates, colli membership, allocation and chronology. Reject stale/conflicting selections without silently reducing contents. FRO-325 owns atomic normal participation/splits/reservations; FRO-324 owns atomic historical arrival, completed participation and separate stock confirmation.

## Draft, files and recovery

Preserve Shipment geography/route, initial-status choice, purpose, mode, document, existing selections, partial decisions and pending files while the Order form is open and on return, cancellation or recoverable failure. Return to the same draft; do not reset it or reinterpret its values.

| Situation | Required outcome |
| -- | -- |
| Creation identity | Use a separate FRO-342 Order creation context and payload-bound attempt, including when no files are selected. Keep it distinct from the Shipment context and from every other intentionally created Order. |
| File ownership | Order files associate atomically with that Order; Shipment files remain in the Shipment context. Never move or copy files between them or copy Order attachments into the Shipment. Historical Shipment upload integration belongs to FRO-324 using FRO-342. |
| Confirmed rejection | Preserve correctable inputs/files and permit a corrected attempt under FRO-342. No partial business effects. |
| Unknown/in-flight result | Recover or replay the same attempt and contents. Do not infer rollback, accept changed contents for that attempt or create another context as a workaround. |
| Confirmed success/replay | Return the same Order and attachment result without duplicate children, audit or lifecycle effects. Close its context to new creation; a deliberately new Order needs a new context. |
| Readback/eligibility failure after success | Preserve confirmed saved identity and the Shipment draft; retry authorized reads. Do not create the Order again or claim it was rolled back. |
| Shipment failure/retry | Recover its own operation under FRO-325/FRO-324 and FRO-342 where applicable. Never repeat already successful Order creation. |

Retain successful-result recovery independently of temporary-file expiry under FRO-342. Authorization loss must not expose protected data or turn an unknown outcome into a reported failure. No general server-autosaved Shipment draft is introduced.

## Authorization and audit

Require Order-create authority and the selected Shipment workflow's authority independently, with existing organization/record scope. Initial-state selection uses FRO-336's creation authority; inline entry grants no permission for later edits, stock confirmation or movement. File operations and result reads retain their own current authorization.

Preserve canonical Order registration, colli identity/journey, attachment and subsequent Shipment effects. Record the actual actor/time and correlate creation attempts with their saved identities. Identify inline creation without fabricating a permanent Shipment ID before it exists. Successful later participation references the same Order/collis, or the explicitly created participating child under existing split rules. Replay adds no duplicate effects.

## Integration and UI ownership

This ticket blocks **FRO-341** for inline Order creation. FRO-341 owns entry, the complete FRO-335 form, draft preservation, saved/not-selected feedback, validation presentation and EN/EL. FRO-316/FRO-326 remain the saved Details owners.

Visual reference: [FRO-341 Shipment creation preview](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site/). Its fictional selected-colli demonstration is not evidence of production eligibility. Reconcile consumer behavior with this contract before activation; no additional UI layout or preview is required here.

Consume compatible FRO-336 initial-state, FRO-342 creation/recovery, FRO-325 normal Shipment and FRO-324 historical contracts. Align supported GraphQL, REST and MCP callers through shared services and document canonical creation, recovery and eligibility results. Preserve standalone Order creation and Shipment creation without inline Orders.

FRO-343 targets 0.0.8 and FRO-341 targets 0.0.9. Backend preparation may precede UI delivery; activate only with compatible consumers and dependencies. Reconcile older attachment wording in FRO-336 and historical-upload consumer wording with FRO-342/FRO-324 before integration. Milestone order does not prove availability.

FRO-322 retains Import/Export category, category-specific eligibility, shared AWB and category-list work. It is not a prerequisite and this capability has no Import-only restriction.

## Decisions

| Decision | Reason |
| -- | -- |
| Save Orders independently | Preserve ordinary identity and make abandonment/failure outcomes explicit. |
| Support Preparing and historical Arrived | Serve both workflows while retaining their distinct eligibility and transaction rules. |
| Reuse three initial-readiness states | Avoid duplicate lifecycle rules and implicit stock/readiness changes. |
| Suggest an editable workflow-specific warehouse | Reduce entry effort without treating a default as physical evidence. |
| Auto-select eligible contents once; later selection is explicit | Make creation useful without unexpected additions or undoing operator deselection. |

## Acceptance criteria

1. Both supported workflows create ordinary Orders without Import/Export prerequisites, using complete validation and independent permissions.
2. Each Order and its selected files/children/history commit atomically and remain saved and readable after Shipment abandonment or rejection.
3. Initial states, date/remark validation, zero collis and editable warehouse suggestions follow the specified contracts, with no invented physical effects.
4. Eligible complete contents are selected once; missing context, ineligibility or read failure yields saved/not-selected with a reason. Later changes/replays never silently select or reselect goods.
5. Existing draft values, selections, partial decisions and separate file contexts survive inline entry/return, cancellation and recoverable failures.
6. Preparing and historical eligibility remain distinct; final stale/allocation/chronology conflicts reject atomically without silently reducing contents or undoing saved Orders.
7. Duplicate submissions, response loss, corrected attempts, expired pending files and successful replay obey context recovery and produce no duplicate records, attachments or audit effects.
8. Draft selection does not reserve goods or freeze editing; saved participation and any split preserve permanent colli identities and established ownership.
9. Unauthorized create/read/file operations fail without leaking protected data or partial effects. Standalone creation remains compatible.
10. Shared adapters, workflow/API references, required persistence support, consumer reconciliation and coordinated activation are complete.

## Out of scope

UI/preview implementation; new Order entities/statuses; reduced quick-add forms; Import/Export or shared-AWB work; automatic stock confirmation or movement on Order creation; automatic deletion on abandonment; historical auto-splitting; copying Orders/files; general server-autosaved drafts; unrelated redesign or legacy-data reclassification.

## Context for agents

Production source inspected read-only through gh at main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. These are source findings, not proof of deployed dependency contracts.

App Java paths below are relative to frontline-forwarding-app/src/main/java/com/frontline/forwarding/.

| Source | Implementation context |
| -- | -- |
| web/purchaseorders/service/PurchaseOrdersApiService.java | Current transactional creation is PENDING with EXPECTED stay, children and history; consume FRO-336 for direct initial-state selection. Open participation restricts later colli/invoice edits. |
| web/purchaseorders/service/PurchaseOrderRequestValidator.java; domain/purchaseorders/PurchaseOrderAuthorizationService.java | Full field/reference validation and separate create/edit/internal-identity guards. |
| web/shipments/service/ShipmentsApiService.java | Origin eligibility, membership locks, atomic splits/reservations. Expected-readiness calculation accepts today/future; the two-days error wording is stale. |
| frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls; shipments.graphqls | Existing create/read contracts; caller attempt/context recovery and historical creation require dependency-owned extensions. Random per-invocation audit UUIDs are not caller retry identities. |
| frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form-validation.ts | Shared form validation to preserve with approved field changes. |
| docs/workflows/purchase-order-colli-journey.md; shipment-lifecycle.md; attachments.md | Stable identities, expected versus physical stays, selection/participation, reminder and attachment ownership behavior. |

## Post-deployment verification

Use authorized existing production records read-only. Exercise mutations, cancellation, retries, concurrency and failure injection only in nonproduction; inspect that evidence. Missing production examples remain unverified.

| AC | Read-only check |
| -- | -- |
| 1–3 | Read normally created inline Orders in Stock list/Details; compare state, opening stay, collis and attachments. Inspect validation/initial-state/abandonment test evidence. |
| 4–5 | Inspect return-selection, missing-route, failed-read, deliberate-deselection/replay and draft/file-retention tests for both workflows. |
| 6, 8 | Compare saved Shipment participation with original Order/colli identities and explicit split attribution. Inspect stale/allocation/chronology rollback and draft-no-reservation tests. |
| 7 | Inspect no-file/file context, response-loss, corrected-attempt, expiry and concurrent-replay tests; compare recovered identity and audit counts. |
| 9 | Inspect denied-authority and standalone regression evidence; use only authorized reads to compare visibility. |
| 10 | Inspect deployed schemas/reference documentation and release evidence for compatible FRO-335/FRO-341 consumers and dependency contracts. |

**Reference:** source paths above; FRO-336 initial readiness; FRO-342 creation/files/recovery; FRO-325 normal Shipments; FRO-324 historical arrivals; FRO-335/FRO-341 creation presentation; FRO-316/FRO-326 saved Details; FRO-322 category work.

