**As an office operator I want to select an Order's initial readiness state when creating it** so that registration reflects what is already known, without repeating readiness actions after creation.

**Order = purchase order = stock-list item. Colli = handling unit.** Create directly in one of the three existing early states below. Initial readiness records knowledge about the goods, not completed collection or physical movement.

## Creation contract

| Input | Type | Rule |
| -- | -- | -- |
| Initial readiness state | Existing status enum: `PENDING`, `EXPECTED_READINESS`, `READY` | Only these values are accepted. Omitted or null defaults to PENDING. Reject other values. |
| Expected readiness date | Nullable calendar date | Apply the state matrix below. Preserve acceptance of past, today and future dates; do not impose a future-only rule or invent a date. |
| Readiness remark | Optional text, maximum 1,000 characters | Preserve existing trimming and blank-to-null normalization. Optional for every state at API level, including PENDING for existing callers. |

| Display label | Initial status | Date | Confirmation |
| -- | -- | -- | -- |
| **Awaiting Readiness Date** | `PENDING` | Must be absent/null; reject a supplied date. | No readiness confirmation. |
| **Received Readiness Date** | `EXPECTED_READINESS` | Required. | FRO-335 owns the Create-time date/remark review. |
| **Ready at supplier** | `READY` | Optional. | An authorized request explicitly selecting READY constitutes readiness confirmation at API level; no separate confirmation flag. FRO-335 requires its one confirmation dialog before submitting. |

Apply the same server rules to REST, GraphQL and MCP creation through the shared creation service. Defaulting the state must not silently drop a date or infer READY. Update request contracts, generated client contracts and API documentation together.

Preserve existing creation authorization: internal Frontline/system-admin eligibility, PURCHASE_ORDER_CREATE and applicable company, warehouse and field validation. Selecting an initial state must not require a subsequent edit command or bypass authorization. Later readiness transitions retain their own guards and permissions.

## Rollout and caller compatibility

Deliver the backend contract in **0.0.4**. The initial-state selector and redesigned reviews arrive with **FRO-335 in 0.0.5**; this ticket requires no new screen or selector in the current form.

Coordinate supported callers with the stricter backend contract:

* The current Create form sends explicit EXPECTED_READINESS when it contains a date, otherwise explicit PENDING. This mapping ships with the backend change and preserves the supplied date and optional remark.
* Update supported date-supplying REST/GraphQL/MCP integrations to pass an explicit permitted state. An omitted/null state with a date fails validation; do not retain contradictory PENDING-with-date creation or discard the date.
* Document and coordinate deployment of the caller mapping before enabling strict validation for those callers. No create-first-then-transition workaround.
* The current form and API callers may continue supplying optional PENDING remarks. FRO-335's redesigned Awaiting flow submits no readiness remark.
* Existing saved Orders are not migrated or reclassified. Ordinary editing, correction and later lifecycle commands remain separate.

## Atomic persistence and history

Create the Order, selected status, supplied date/remark, opening warehouse stay, colli identities/memberships, supplied measurements, invoice rows and required history in one transaction. Validation, authorization or persistence failure leaves no partial business records or history.

Preserve the opening stay as **EXPECTED**, with no arrival, stock-confirmation or departure timestamps.

| Record | Required result |
| -- | -- |
| Order status history | One direct registration transition from no previous state to the selected initial state, with the actual actor and registration time. Do not simulate earlier PENDING/EXPECTED transitions. |
| Order activity | Preserve creation activity and applicable invoice activity; record the selected initial state as a registration fact. |
| Supplied collis — all states | Preserve REGISTERED events, permanent identities, memberships and applicable declared measurements. |
| Supplied collis — EXPECTED_READINESS | Also record EXPECTED_READINESS_RECORDED using the supplied date and actual registration context. |
| Supplied collis — READY | Also record READY_FOR_COLLECTION at registration. An optional date does not justify fabricating a preceding expected-readiness transition/event. |
| No supplied collis | Record Order registration only; no invented colli identities or journey events. |

Creation itself records no pickup, warehouse arrival, stock entry, Shipment, dispatch, delivery or email. Preserve existing separately authorized/scheduled readiness-email behavior for saved Orders; this feature introduces no email trigger.

## Empty collis and later stock entry

All three initial states allow **zero collis**, subject to their date rules. Ready requires neither an existing expected date nor a readiness remark.

Collis may subsequently be added through the existing authorized editing workflow while the Order is Ready, then measured and confirmed into stock. Do not introduce per-colli readiness selection, repeat Order readiness confirmation solely because collis were added, or backdate their events to Order creation.

Preserve stock-confirmation requirements: at least one current nonterminal colli, storage position and complete valid warehouse-confirmed measurements for every current nonterminal colli. Empty Ready creation does not authorize empty stock confirmation. Preserve the separate warehouse-arrival command and other later lifecycle behavior.

## UI ownership and failure behavior

**This ticket blocks FRO-335.** FRO-335 owns the selector, conditional date control, EN/EL presentation, reviews and creation navigation; FRO-326 owns the shared Details presentation. No additional canvas or preview is required here.

In FRO-335, the operator selects Received or Ready before entering a date; date entry never changes the chosen state. Switching to Awaiting with an entered date requires its explicit clear-date confirmation; cancellation preserves the prior state/date and remaining draft.

Validate the full creation draft before review. Received shows its selected date and optional remark. Ready uses one review containing optional date context/remark and explicit readiness confirmation, without a second popup. Awaiting creates directly without a review or submitted remark. Preserve the 1,000-character limit, blank remarks, Cancel/Escape behavior and remark/draft retention on cancellation or failure.

Prevent repeated submission while pending and report success only after confirmed persistence. A failed creation preserves the complete draft and actionable errors. Do not present an uncertain network outcome as confirmed success or a confirmed rollback. FRO-335's attachment uploads occur against the successfully returned Order ID: upload failure does not roll back the created Order or justify creating it again.

After success, Details shows the returned actual state, date/remark and corresponding next eligible action; do not infer PENDING locally.

## Decisions

| Decision | Reason |
| -- | -- |
| Backend first; selector with FRO-335 | Respect the delivery sequence without duplicating the redesign. |
| Current caller maps supplied date to Received | Preserve entered information while meeting the new state/date contract. |
| Optional Awaiting remarks remain valid for existing/API callers | Preserve supported input while the redesigned UI deliberately omits it. |
| Explicit authorized READY request confirms readiness | Give all interfaces a consistent contract; the UI owns its human confirmation dialog. |
| Ready permits zero collis | Readiness may be known before packages are entered and measured. |

## Acceptance criteria

| ID | Safe-environment verification |
| -- | -- |
| AC1 | Exercise every allowed state across REST, GraphQL and MCP; verify omitted/null state defaults, invalid/later states, required/forbidden dates, and past/today/future calendar dates. |
| AC2 | Verify optional/blank/trimmed remarks and the 1,000-character boundary in every state; confirm redesigned Awaiting omits a remark while existing/API callers may supply one. |
| AC3 | Verify current-form date/no-date mapping and explicit READY API creation; default-plus-date fails without data loss or partial creation. |
| AC4 | Verify creation permissions, company/warehouse validation and rollback on failure; no chained readiness mutations or additional edit permission is required. |
| AC5 | For empty and nonempty creation in each state, compare returned fields, direct initial status history, activity, colli events and EXPECTED stay. Confirm absent movement/email effects. |
| AC6 | Add collis to an initially empty Ready Order through the authorized existing flow, then confirm stock with required measurements; empty/incomplete stock confirmation fails, without introducing another readiness confirmation. |
| AC7 | With FRO-335, verify EN/EL selection/date rules, full-draft validation, single Ready review, cancellation/failure retention, pending-submit protection and actual-state Details navigation. Failed attachment uploads retry against the same created Order. |
| AC8 | Verify existing Orders remain unchanged and later transitions, stock-entry guards, independent arrival and saved-Order reminder behavior retain their existing contracts. |

## Out of scope

New status enums; initial In Stock, Shipped, Delivered or exception states; historical movement import; reclassification of existing Orders; new email automation; redesign of correction, arrival or stock entry; a separate UI preview.

## Context for agents

Live repository inspected through gh at `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.

Backend Java paths below are relative to `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

* `web/purchaseorders/service/PurchaseOrdersApiService.java`: current transactional PENDING creation, expected stay, status/activity/REGISTERED events, readiness operations and stock-confirmation guards.
* `web/purchaseorders/service/PurchaseOrderRequestValidator.java`: creation accepts a date without temporal bounds; optional remark normalization and max 1,000.
* `web/purchaseorders/input/PurchaseOrderCreateInput.java`: shared create DTO currently has no initial-state selection.
* `web/purchaseorders/PurchaseOrdersRestApi.java`, `PurchaseOrdersGraphQlApi.java` and `PurchaseOrderMcpTools.java`: adapters delegate creation to the shared service.
* `domain/purchaseorders/PurchaseOrderAuthorizationService.java`: creation authority differs from later edit/readiness authority.
* `domain/purchaseorders/reminders/ReadinessReminderScheduleCandidateRepository.java`: saved-state/date eligibility; READY is excluded.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls`: creation schema.
* `docs/reference/database.md`: Order status/readiness fields, warehouse stays and colli journey persistence.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx` and `purchase-order-detail.tsx`: existing form, Ready editing and stock action/measurement guards.

## Post-deployment verification

Production checks are read-only. Use normally created records and existing audit/test evidence; do not create or advance production Orders for verification.

| Criteria | Read-only check |
| -- | -- |
| AC1–AC3 | Inspect deployed API contracts and safe-environment test results for the state/date/remark matrix and caller mapping. Read normally created examples in each state and compare their saved date/remark. |
| AC4 | Inspect authorization and rollback test evidence; compare creation actor and available actions for authorized read-only sessions. |
| AC5 | Read Order history, colli journeys and opening stay for examples created empty/nonempty in each state. Compare initial transition, event types/actor/time and absence of fabricated movement. |
| AC6 | Read an initially empty Ready Order subsequently populated and stocked through normal operations; compare colli registration and stock measurements/times. Review empty/incomplete stock rejection test evidence. |
| AC7 | Inspect deployed Create controls and Details without submitting; review safe-environment dialog, retention, duplicate-submit and attachment-retry evidence. Verify Details reflects the returned saved state. |
| AC8 | Compare existing Orders and representative later lifecycle/reminder test evidence. Do not trigger reminders or lifecycle commands in production. |

**Reference:** [FRO-335 — Order Creation](https://linear.app/front-line-ltd/issue/FRO-335) · [FRO-326 — Order Details](https://linear.app/front-line-ltd/issue/FRO-326) · [Production repository](https://github.com/Frontline-Forwarding/frontline-forwarding).
