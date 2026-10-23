# FRO-343 review — 23 October 2026

## Workflow checkpoint

- [x] 0 Preflight: planning pull succeeded; gh authentication/live repository read and Linear read succeeded. Optional Linear agent-context endpoint unavailable; direct issue reads work.
- [ ] 1 Grill: evidence gathered; first decision round pending.
- [x] 2 Canvas: skipped; FRO-341 owns inline form/return presentation, reusing FRO-335. FRO-316/326 own saved Details.
- [x] 2b Preview: skipped; no new presentation required by this review.
- [ ] 3 Spec check: initial consumer trace below; finalize after decisions.
- [ ] 4 Ticket: no replacement yet; complete draft and explicit approval required before writing.
- [x] 4e UI branch: excluded explicitly by user.
- [x] 5 Memory: review checkpoint recorded; no newly resolved vocabulary or ADR.
- [ ] 6 Verify: no Linear mutation or deployment; saved-ticket verification applies after approved write.

## Current issue

FRO-343, Shipment Create Page— create an Order during Shipment creation. Updated 2026-10-20T11:10:12.558Z. Todo; Shipment, Pending_Review, Backend, Story; no priority; Pre-releases 0.0.x / 0.0.8. No comments, attachments or documents. Blocks341; no blockers; related322/324/325/344/316. Preserve metadata unless explicitly approved otherwise. Description says Backlog until decisions resolve, conflicting with actual Todo; flag without changing it.

Read current316/341/326/335/324/325/336/342 and current team statuses/labels. FR0-326 interpreted as FRO-326. FRO341 is0.0.9 while343 is0.0.8; coordinated activation required, without moving milestones automatically.

## Evidence and gaps

Live production main: 5c51030680c9d45b3827a7e19b8320c19aa5ed9a, read through gh. Source evidence is not deployed-state verification.

1. Save/abandonment remains a genuine open decision: independent Order versus combined final Shipment transaction. Define confirmed success, confirmed rejection and unknown response separately. Cancelling a draft cannot imply deletion of a committed Order.
2. Current Order create is transactional PENDING creation, not selectable initial state. FRO336 supplies direct PENDING/EXPECTED_READINESS/READY creation; FRO335 consumes it. FRO343 must name that ownership rather than leave initial lifecycle unconstrained or chain create/transition calls.
3. Preparing permits IN_STOCK with matching stock stay, READY with EXPECTED stay, or EXPECTED_READINESS dated today/future with EXPECTED stay at origin. Current service's two-days error text is stale; computation has no future upper bound. Valid Order creation may still yield no selectable goods: PENDING, past expected date, zero collis or incompatible warehouse. Upcoming selections are whole-Order; only stocked partials may split.
4. Historical Arrived uses FRO324, not normal outgoing candidates or arbitrary initial Shipment status. Specify receiving-warehouse compatibility and whole nonterminal set; preserve separate stock confirmation and physical-event provenance. Current saved324 and342 have historical-upload wording requiring reconciliation; local324 pending review contains proposed/accepted changes but is not a saved replacement contract. Do not settle another chat's pending edits here.
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

## First decision round (recommendations, not accepted)

1. Save each completed Order independently; retain it and its attached files if Shipment is abandoned/rejected, with no automatic deletion. Later Shipment submission references saved identities.
2. Support both Preparing and historical Arrived, each consuming its dedicated existing/planned contract; activation waits for compatible dependencies.
3. Reuse FRO336/FRO335's three initial-state choices without implicit stock/readiness/arrival. Saved but ineligible Orders return with a reason. Initial historical registration must not invent past readiness evidence.
4. Suggest origin for Preparing and receiving warehouse for Arrived only when known, keep editable, and leave blank otherwise. Override never silently alters the Shipment route or proves eligibility.

Return auto-selection, incomplete route/readback recovery, historical readiness chronology and exact file-context orchestration will be resolved after prerequisites. Full ticket replacement and any metadata proposal require separate complete-text approval.
