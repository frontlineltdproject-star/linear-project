**As an office operator I want one Edit session for Order details and an eligible readiness correction** so that permitted field changes and status correction save together without leaving Order Details.

**Order = purchase order = stock-list item.** Provide an authorized atomic save for the Order-details card. [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) owns its presentation and retirement of the separate Edit page.

## Interaction and save scope

| Step / area | Required behavior |
| -- | -- |
| Edit | Start one Details draft containing permitted ordinary fields and the nested Order status control. Use FRO-326's final field contract and its linked feature contracts, including their validation, immutable fields and intentional removals. |
| Independent drafts | Notes, Collis and Invoice rows keep their separate editors and saves. Details Save must not submit or overwrite their drafts or unrelated saved data. There is no whole-page Save. |
| Status | Offer only eligible alternatives among PENDING, EXPECTED_READINESS and READY, alongside the current readiness state. Otherwise display the actual current state read-only, including later/exception states, while permitting authorized ordinary edits. |
| Save: unchanged status | Save permitted ordinary changes without a correction dialog or reason. Selecting another status and returning to the original counts as unchanged; do not submit the abandoned correction reason/date. |
| Save: changed status | Before any persistence, show old → new status, all other proposed field changes and readiness-date/remark effects. Require Correction reason, distinct from an optional workflow Remark or Order Notes. |
| Conditional date | For EXPECTED_READINESS, require a valid calendar date. Prefill the saved date if present; otherwise leave blank. Past dates, today and future dates are permitted for manual correction. Never invent a date. |
| Confirm and save | Submit reviewed field changes and correction as one atomic operation; disable repeat submission while pending. |
| Cancel / Escape / close confirmation | Write nothing. Return to the editor with field, status, reason and date drafts retained for the session; restore focus. Rebuild the confirmation if proposed changes subsequently change. |
| Cancel editing | Discard only the Details/correction draft and restore saved values and focus. Preserve other card drafts. |
| Failure | Retain the draft with an actionable error. Changed server version, state, eligibility or reservation requires refreshed review before retry; never silently overwrite or apply a different correction. |

Use existing localized status labels without changing enum values. FRO-326 supplies EN/EL presentation, accessible errors/dialogs, focus handling and responsive layout. Normal forward actions, including Mark ready at supplier, remain separate from manual correction.

## Authorization and readiness rules

* Enforce the existing internal identity and PURCHASE_ORDER_EDIT requirements server-side. Preserve company access, ordinary-field validation, immutable fields and child-Order reference restrictions.
* Evaluate ordinary editing and correction eligibility separately. Ordinary-only saves retain their permitted states, including IN_STOCK when existing guards allow it. A readiness correction requires both current and target status to be PENDING, EXPECTED_READINESS or READY and no open Shipment participation.
* Do not apply the narrower correction-state restriction to every ordinary save, or allow a correction merely because ordinary Edit is available. Preserve existing reservation restrictions.
* Require a nonblank correction reason, maximum 1,000 characters.
* PENDING clears the saved readiness date and readiness remark; show both effects in confirmation.
* EXPECTED_READINESS uses the confirmed date and preserves the saved readiness remark. READY preserves the saved date and remark.
* The ordinary Details payload must not overwrite these correction effects or introduce unrestricted readiness-date/remark editing. Correction reason belongs to audit, not readiness remarks or Notes.
* Correction does not undo physical warehouse/colli journeys, Shipment participation or previous audit history. Preserve the separate forward commands and their established journey effects.
* Preserve existing Supplier-linked validation/synchronization and participant-based access after a Supplier change. This feature does not change reminder scheduling, delivery or supplier-response behavior.

## Atomic contract, concurrency and audit

The request identifies the Order, the expected Order version from the reviewed draft, permitted ordinary changes and an optional correction intent containing target status, reason and the conditional date. Expose the authoritative version needed by the editor. Implementation may extend an existing operation or introduce a dedicated command; do not require two separately committed browser calls.

Apply this stale-version protection to ordinary-only, correction-only and combined saves in the new Details flow. Against the same locked Order, compare the submitted version with the current version and recheck authorization, state, reservation and all field/correction validation. A lock using only a freshly read server version is insufficient to detect an outdated browser draft.

On mismatch, reject the entire request without data or audit writes. Retain the draft and require refresh/review before resubmission; do not silently replace its expected version or automatically overwrite newer values. Preserve independent card drafts during refresh.

Persist permitted fields, correction, required downstream database effects and applicable audit in one transaction: **all succeed together or none do**. Preserve coordination with concurrent Shipment reservation and other Order commands.

Example: Supplier A → Supplier B plus EXPECTED_READINESS → READY saves both or neither. Any authorization, validation, downstream, concurrency or persistence failure leaves saved fields, status, readiness date/remark and history unchanged.

Preserve header-change audit and correction transition/activity records with actual old/new status, reason, actor and timestamp. Correlate applicable records to the same save and record each event once. Do not fabricate a header-change event for correction-only saves or a correction event for unchanged status. Preserve previous records.

Return authoritative saved data and version. Refresh displayed fields, status, available actions, history and dependent displays after success without discarding unrelated drafts. Report success only after confirmed persistence.

## Ownership and rollout

**This ticket blocks FRO-326.** It owns the combined-save contract, validation, authorization, concurrency, atomic persistence and audit.

FRO-326 owns the single Details Edit button, nested status editor, Save-triggered confirmation, removal of the separate correction button, Edit-page retirement, navigation replacement and old-URL redirects. Its independent card editors remain independent.

Deliver the backend contract first; enable the combined interaction with FRO-326. Keep the existing separate editing/correction paths usable during the earlier rollout. Retire the separate Edit page only when FRO-326's retained-capability and integration requirements are met. Preserving backend operations needed by other consumers does not require retaining that page.

Reuse FRO-326's agreed UI. Progress-track/Step-counter presentation belongs to FRO-326. Do not add a separate UI design or broaden linked features' business rules.

## Decisions

| Decision | Reason |
| -- | -- |
| One atomic Details/readiness save | Prevent partially applied field/status changes. |
| Independent Notes, Collis and Invoice-row saves | Preserve FRO-326's card-level editing boundaries. |
| Allow past, present and future correction dates | Preserve manual correction semantics; do not import future-only supplier-response validation. |
| Reject stale drafts, retain inputs and require review | Prevent overwriting intervening changes in ordinary-only and combined saves. |
| Backend first; integrated editing and Edit-page retirement with FRO-326 | Keep current editing usable until its replacement is ready. |
| Preserve existing reminder behavior | Reminder mechanisms are not introduced by this editing change. |

## Acceptance criteria

1. Permitted ordinary fields and readiness status can be edited together. Ordinary-only, correction-only and combined saves work; status changed then restored needs no correction reason.
2. A changed status requires confirmation before any write, showing every proposed change, required reason and date/clearing effects. Blank/overlong reasons and missing/invalid required dates fail; valid past/today/future dates are accepted.
3. Confirmation cancellation preserves the complete draft without writes; editing cancellation discards only Details. Notes, Collis and Invoice rows remain independent.
4. Server authorization, immutable-field, child-reference, state and reservation guards hold. Ordinary IN_STOCK editing remains available when permitted; readiness correction is unavailable outside its three states.
5. Stale ordinary-only and combined saves reject all changes and audit, retain drafts and require renewed review. Concurrent reservation/state changes cannot bypass guards.
6. All field changes, correction effects, required downstream writes and audit commit together or roll back. Audit contains each applicable event once with correct provenance and correlation.
7. Success returns authoritative data/version and refreshes dependent displays. Failures retain drafts; repeat submissions are disabled while pending.
8. FRO-326 integration works in EN/EL, with keyboard/focus handling, view-only access and narrow layouts. Existing forward actions and required legacy API consumers retain behavior. Backend delivery alone does not remove the existing editor.

## Context for agents

Live sources inspected through authenticated gh on 22 October 2026:

* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` — separate update/correctStatus transactions; header editing includes IN_STOCK; correction states, reservation checks, date/remark effects and audit. Existing update also accepts colli/invoice-row changes: do not accidentally include those collections in Details Save.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderRepository.java` — Order locking and versioned persistence. Current server-side version use does not establish the version originally seen by the editor.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderAuthorizationService.java` — internal edit authority and participant-company viewing rules.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — existing update/correction contracts; add the concurrency/combined intent needed by the new flow without weakening existing consumers.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-detail.tsx` — existing Details/actions integration.
* `frontline-forwarding-client/src/routes/secured/purchase-orders/$purchaseOrderId.edit.tsx` — current separate editor; retirement and redirects belong to FRO-326.
* FRO-326 — final editable-field and independent-card contracts, linked domain ownership and integrated rollout.

**Affected systems:** Order-details client/API integration, Order service/repository, authorization, concurrency and audit.

**Out of scope:** new statuses; correction beyond the three readiness states; warehouse/Shipment undo; initial-state creation; broad field-editability changes; reminder scheduling/delivery/response changes; new UI design. Page/navigation retirement and progress presentation are owned by FRO-326.

## Verification

Run mutation tests in a safe test environment: all save modes, status restored to original, reason/date boundaries, cancellation, authorization/state/reservation denial, stale drafts after another completed save, concurrent reservation, forced downstream/audit rollback, independent-draft preservation and repeat-submit protection.

## Post-deployment verification

Production checks are read-only; do not submit saves, corrections or emails.

| Criteria | Read-only check |
| -- | -- |
| 1–3 | Open an authorized existing Order, inspect Details editing/confirmation and cancel without saving. Check proposed changes, reason/date controls and retained independent drafts; use test evidence for successful mutations/date validation. |
| 4 | Inspect editor availability on representative readiness and IN_STOCK Orders, a reserved Order and a view-only session. Use safe-environment evidence for rejected server requests. |
| 5 | Inspect deployed client/API version handling and safe-environment stale/concurrent-request test results; do not induce production conflicts. |
| 6 | Inspect existing combined, ordinary-only and correction-only saves and their audit, comparing resulting fields, correction date/remark effects and event provenance. Use test evidence for rollback. If examples do not exist, mark the check unavailable. |
| 7–8 | Inspect returned-version integration, displayed state/actions/history, EN/EL and narrow layouts. Check existing editor availability during backend-only rollout or FRO-326's integrated editor after release; use test evidence for failures and repeat submissions. |

**Reference:** [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) · [Production repository](https://github.com/Frontline-Forwarding/frontline-forwarding).
