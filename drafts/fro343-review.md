# FRO-343 review — 23 October 2026

## Workflow checkpoint

- [x] 0 Preflight: planning pull succeeded; gh authentication/live repository read and Linear read succeeded. Optional Linear agent-context endpoint unavailable; direct issue reads work.
- [x] 1 Grill: Q1–Q5 accepted.
- [x] 2 Canvas: skipped; FRO-341 owns inline form/return presentation, reusing FRO-335. FRO-316/326 own saved Details.
- [x] 2b Preview: skipped; no new presentation required by this review.
- [x] 3 Spec check: consumer outcomes and owners reconciled in complete draft.
- [x] 4 Ticket: approved full replacement saved and independently verified.
- [x] 4e UI branch: excluded explicitly by user.
- [x] 5 Memory: review checkpoint recorded; no newly resolved vocabulary or ADR.
- [x] 6 Verify: approved text and full metadata/relations verified after save; no deployment performed.

## Current issue

FRO-343, Shipment Create Page— create an Order during Shipment creation. Updated 2026-10-20T11:10:12.558Z. Todo; Shipment, Pending_Review, Backend, Story; no priority; Pre-releases 0.0.x / 0.0.8. No comments, attachments or documents. Blocks341; no blockers; related322/324/325/344/316. Preserve metadata unless explicitly approved otherwise. Description says Backlog until decisions resolve, conflicting with actual Todo; flag without changing it.

Read current316/341/326/335/324/325/336/342 and current team statuses/labels. FR0-326 interpreted as FRO-326. FRO341 is0.0.9 while343 is0.0.8; coordinated activation required, without moving milestones automatically.

## Evidence and gaps

Live production main: 5c51030680c9d45b3827a7e19b8320c19aa5ed9a, read through gh. Source evidence is not deployed-state verification.

1. Save/abandonment remains a genuine open decision: independent Order versus combined final Shipment transaction. Define confirmed success, confirmed rejection and unknown response separately. Cancelling a draft cannot imply deletion of a committed Order.
2. Current Order create is transactional PENDING creation, not selectable initial state. FRO336 supplies direct PENDING/EXPECTED_READINESS/READY creation; FRO335 consumes it. FRO343 must name that ownership rather than leave initial lifecycle unconstrained or chain create/transition calls.
3. Preparing permits IN_STOCK with matching stock stay, READY with EXPECTED stay, or EXPECTED_READINESS dated today/future with EXPECTED stay at origin. Current service's two-days error text is stale; computation has no future upper bound. Valid Order creation may still yield no selectable goods: PENDING, past expected date, zero collis or incompatible warehouse. Upcoming selections are whole-Order; only stocked partials may split.
4. Historical Arrived uses FRO324, not normal outgoing candidates or arbitrary initial Shipment status. Specify receiving-warehouse compatibility and whole nonterminal set; preserve separate stock confirmation and physical-event provenance. FRO324 was refreshed after its concurrent approved save (updated2026-10-23T14:20:09.829Z): it now requires matching EXPECTED-stay reuse, rejects mismatched opening warehouses and owns historical integration of342 pending uploads.342/341 wording still requires reconciliation before activation; do not edit linked tickets here.
5. Retry guarantees need concrete context/attempt ownership. FRO342 now specifies one Order per creation context, payload-bound attempts, recovery after lost replies, and atomic selected-file association even for no-file contexts. Reuse those guarantees rather than create another retry scheme. Order context and Shipment context must not share ownership or pending files. FRO336 contains older post-create-upload wording inconsistent with newer342/335; identify reconciliation without editing336.
6. Exact return contract should retain created identity even when ineligible, expose supported reason/status, avoid dependence on current search/pagination, and revalidate on workflow/warehouse changes and final submission. No automatic unrelated selection or silently reduced whole-Order set.
7. Preserve complete Shipment draft and both file contexts, including after a saved Order succeeds but eligibility/readback fails. Authorization loss or read failure cannot be reported as Order rollback. Never recreate to recover a missing response.
8. Audit should identify inline origin and correlate separate successful Order creation and later Shipment participation without inventing a Shipment ID before persistence. Preserve canonical creation, readiness, colli and attachment effects; no repeat on replay.
9. State dependency activation and API/REST/MCP parity explicitly. Replace vague agreed-behavior acceptance criteria with concrete outcomes after interview, and map each to a read-only production check or inspected nonproduction evidence.
10. Independent saving also enables ordinary saved-Order consumers, including existing readiness-reminder scheduling; abandoning the Shipment must not imply suppressing those rules. Draft selection itself must not reserve goods or freeze Order edits: open persisted Shipment participation is the boundary that blocks colli/invoice editing. Source: PurchaseOrdersApiService.java, PurchaseOrderAuthorizationService.java and docs/workflows/purchase-order-colli-journey.md. Creation measurements remain DECLARED, not warehouse-confirmed measurements.

## Consumer impact

| Consumer / affected area | Current behavior and source | Required outcome / ownership |
| --- | --- | --- |
| Order create, Stock list, saved Details | App web/purchaseorders/service/PurchaseOrdersApiService.java creates PENDING with EXPECTED opening stay, children and history transactionally; FRO336 adds allowed initial states | Preserve permanent identities and normal validation;343 orchestrates,336 owns initial state; save decision pending |
| Preparing candidates and create | App web/shipments/service/ShipmentsApiService.java, eligiblePurchaseOrders/create/shipmentPlanningEligible; docs/workflows/shipment-lifecycle.md | Preserve normal origin/state/date/whole-Order/partial-stock rules;325 owns transaction/reservation,343 revalidates return |
| Historical Arrived | FRO324 dedicated operation; current shipments.graphqls has no historical creation input |324 owns historical eligibility/stay/movement;343 supports only agreed integration, no normal-candidate shortcut |
| Inline form and draft state | FRO341 Create Order inside Shipment creation; FRO335 full form |341 owns presentation and exact draft restoration;335/336 validation reused; preview's one-demo-colli selection is not production eligibility |
| Pending files / retries | FRO342 context/attempt and atomic association; FRO335 result recovery |Separate Order and Shipment contexts;343 orchestrates. Reconcile historical ownership before activation |
| GraphQL / REST / MCP and authorized reads | App purchase-orders.graphqls, shipments.graphqls and shared API services |343 must specify canonical outcomes and authorized identity/eligibility recovery consistently; no extra authority through inline entry |
| Audit / colli journey / history | Order creation and Shipment create services; FRO336/325 |Preserve canonical effects, correlation and replay-once semantics;343 owns integration correlation |
| Release / verification |3430.0.8,3410.0.9,3350.0.5;336/342 contracts not proven deployed |Coordinated activation; no substitute UI or metadata changes. Concrete acceptance/read-only verification after decisions |

Paths beginning App above are relative to frontline-forwarding-app/src/main/java/com/frontline/forwarding/, except GraphQL schemas in frontline-forwarding-app/src/main/resources/graphql/.

## First decision round — accepted by user

1. Save each completed Order independently; retain it and its attached files if Shipment is abandoned/rejected, with no automatic deletion. Later Shipment submission references saved identities.
2. Support both Preparing and historical Arrived, each consuming its dedicated existing/planned contract; activation waits for compatible dependencies.
3. Reuse FRO336/FRO335's three initial-state choices without implicit stock/readiness/arrival. Saved but ineligible Orders return with a reason. Initial historical registration must not invent past readiness evidence.
4. Suggest origin for Preparing and receiving warehouse for Arrived only when known, keep editable, and leave blank otherwise. Override never silently alters the Shipment route or proves eligibility.

Reasons: independent saving preserves ordinary Order identity and avoids rollback ambiguity; both workflows serve the requested entry point while retaining separate eligibility; shared initial-state contracts avoid duplicate lifecycle rules; editable warehouse suggestions reduce entry effort without manufacturing location evidence.

## Follow-up — Q5 accepted

Recommend automatically selecting the complete current nonterminal colli set once, on confirmed Order-create return, only after successful workflow-specific eligibility validation. Preserve prior selections and partial decisions. No reservations or Order editing locks until Shipment save. No silent subset when whole-Order rules fail.

If route context is insufficient, the Order is ineligible or eligibility lookup fails, retain its saved identity and explain saved-but-not-selected. Do not select automatically later when the route/status changes or a retry makes it eligible; require explicit selection through the existing controls. Replaying the create result must not re-add an Order/collis the operator deliberately deselected. A new intentional Order uses a fresh Order context; no retry can create another Order.

Q5 accepted by user. Recovery otherwise follows already-agreed342 contracts: uncertain creation is not failure, same-attempt recovery, separate Order/Shipment contexts and no duplicate effects. Historical occurrence/registration separation follows336/324; preserve explicit registration facts without backdating readiness or inventing physical movement. No new historical shortcut is proposed.

Refreshed343/324/342/336 after Q1–Q4.343 remains unchanged; production main remains5c51030680c9d45b3827a7e19b8320c19aa5ed9a.342 updated2026-10-23T14:20:09.844Z;324 updated2026-10-23T14:20:09.829Z. Full ticket replacement and any metadata proposal require separate complete-text approval. No Linear, UI or production changes; no glossary/ADR needed.

## Complete replacement prepared

All original protections and five accepted decisions reconciled in drafts/fro343-reviewed-spec.md. Before/after: unresolved save boundary → independent atomic Order save; unresolved lifecycle →336 three states; unspecified return → eligible whole set selected once with explicit later selection; generic retry →342 separate contexts/attempt recovery; vague acceptance →ten testable criteria and mapped read-only checks. No existing metadata or attachments removed. Historical investigation notes above are review history, not final ticket text.

Proposal changes description only; preserve title, Todo, Shipment/Pending_Review/Backend/Story, priority, assignment, project/milestone0.0.8, blocks341, related322/324/325/344/316, no blockers and empty attachments/documents. New dependency references do not authorize relation additions; preserve this exact relation set after save. No Ready promotion. Full text must be approved before Linear write. No new vocabulary/ADR, UI/preview or production branch.
## Approved save receipt

User approved the complete replacement with ok. Fresh343 was unchanged at2026-10-20T11:10:12.558Z. Saved exact approved draft and all four labels. Independent re-read matches after Linear issue-mention, bold-mention, link and whitespace normalization. Save auto-added related336/335/342/326; removed only those additions under approved metadata preservation. Second independent read confirms text match and zero metadata differences from baseline, including exact original relations and empty attachments/documents. Final updatedAt2026-10-23T14:34:08.855Z. No Ready promotion, linked-ticket edits or production/UI/branch changes.