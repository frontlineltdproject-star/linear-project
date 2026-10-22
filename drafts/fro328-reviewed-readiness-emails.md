**Separate manual supplier readiness emails into Request readiness date and Confirm readiness date**, with template-based preparation, read-only review and explicit Send before queueing.

**Order = purchase order = stock-list item.** Each operation concerns one saved Order. Asking the supplier to confirm a date does not confirm it locally or mark the Order Ready.

## Ownership and rollout

| Area | Delivery / ownership |
| -- | -- |
| Backend, milestone **0.0.4** | This ticket owns preparation, confirmation, templates/routing, validation, concurrency, queueing, retries and audit contracts across REST, GraphQL and MCP. Deliver the backend contract first. |
| Portal activation, milestone **0.0.5** | [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) owns the two-button presentation, shared review dialog, EN/EL controls and synchronized Order status / Available actions locations. Consume this ticket's contract; no separate UI design is required here. |
| Compatibility | Preserve the current interaction during the earlier backend rollout. Activate the reviewed-send requirement with FRO-326 only after all manual callers are coordinated. At activation, every enabled REST/GraphQL/MCP manual-send path requires preparation and explicit confirmation; no legacy direct-send bypass remains. An unmigrated caller receives an actionable rejection rather than silently queueing. |
| Creation | [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) supplies the shared visual reference. Unsaved Order creation exposes no readiness-email action and sends no email. |

## Intent and eligibility

| Action | Required saved state | Existing backend type | Message intent |
| -- | -- | -- | -- |
| **Request readiness date** | `PENDING` and `readinessDate = null`, plus existing manual eligibility | `ASK_READINESS_DATE` | Ask the supplier to provide a readiness date. Do not imply that a date was already supplied. |
| **Confirm readiness date** | `EXPECTED_READINESS` and a recorded `readinessDate`, plus existing manual eligibility | `CONFIRM_READINESS` | Include that exact calendar date and ask whether it remains correct. |

Date presence alone never overrides lifecycle or eligibility. A PENDING split child with an inherited date, an EXPECTED_READINESS Order without a date, and READY/later/exception states enable neither action. Do not repair these records through an email operation.

Preserve the existing manual eligibility rules:

* Require `PURCHASE_ORDER_EDIT`, the existing internal Frontline/system identity and Order authorization. Recheck authorization on preparation and Send; partner users cannot send or override recipients.
* Use the selected Supplier's existing main contact and existing contact validation. Missing Supplier or contact prevents preparation/Send with an actionable error; an eligibility response alone does not prove recipient validity.
* Allow no additional reminder while one for the Order is awaiting delivery, whether MANUAL or SCHEDULED. Preserve applicable existing reservation/command restrictions without adding unrelated lifecycle guards.
* Manual Request requires an existing SCHEDULED `ASK_READINESS_DATE` record. Its existence is the current prerequisite; do not add a requirement that it was successfully delivered.
* Manual sending uses weekdays in `Europe/Athens`. Confirmation opens two calendar days before readiness, moving a Saturday/Sunday opening back to Friday, and closes after the day following readiness. Public holidays are not included. Preserve these calculations and existing unavailable-reason codes.

Both buttons remain visible to authorized senders as specified in FRO-326, with each unavailable action disabled and explained. At READY, both explain that readiness-date emails are no longer applicable. View-only users have no mutation controls. Never substitute the shared **Email supplier about readiness** label or a status-switched single button. EN/EL interface labels must distinguish the two intents; preserve the existing English outgoing email language and date formatting.

## Manual preparation and confirmation contract

The following applies to every manual caller, including REST, GraphQL and MCP. API callers receive the same reviewable data and must explicitly confirm the prepared message; they do not require a graphical dialog.

| Step | Required behavior |
| -- | -- |
| **Prepare** | Validate the selected action against current state and eligibility, resolve the current Supplier/main contact, and generate the corresponding subject and HTML/plain-text body. Return the resolved recipient and reviewable content with a server-verifiable preparation reference tied to the actor, Order, intent, date and content/context. The reference is a new contract, not an existing field or endpoint. |
| **Review** | Show recipient, subject and body **read-only**. No recipient override, CC/BCC or content composition is introduced. Include the recorded date for confirmation. The preparation must be sufficient for the server to identify exactly what was reviewed; do not trust client-supplied replacement recipients or content. |
| **Cancel / close / read only** | Queue/send nothing; create no reminder, delivery attempt, successful-send history or readiness mutation. Preparation may maintain its own non-deliverable review state but must not reserve the reminder slot. |
| **Send** | Only a distinct explicit confirmation referencing that preparation may queue. Recheck current authorization, eligibility and reviewed context. Reject a missing, invalid, wrong-actor, wrong-Order or mismatched preparation without queueing. Clicking **Confirm readiness date** prepares a review; it is not Send authorization. |
| **Stale review** | A changed status, readiness date, Supplier/main contact, relevant Order reference, selected intent or template/content invalidates the old approval. Never silently substitute a different action, recipient or message. Require refreshed preparation and renewed review before a new Send. Newly lost authority or eligibility blocks queueing. |
| **Concurrent / repeated confirmation** | Accept a preparation for queueing at most once. Repeating an already accepted confirmation returns the same reminder/result without another reminder, outbox entry or provider send, even after that reminder becomes SENT or FAILED. Reusing a reference with different intent/context fails. A deliberate later reminder needs fresh preparation, renewed confirmation and current eligibility. |

Preparation must not issue a usable supplier-response token, revoke/replace an existing token, invoke the provider or create an outbox entry. Show a nonfunctional response-link placeholder. Generate the real protected link only for actual delivery under the existing token rules.

Publish the new operation/input/output contracts and update supported adapters, generated contracts and callers together. Exact operation names and storage mechanics are implementation choices; a boolean confirmation on the old Order-ID-only send call is insufficient to bind approval to reviewed content.

## Queueing, delivery and history

* Validate and atomically accept the approved preparation, create its MANUAL reminder and durable outbox message, and record the existing actor/type/target-date/recipient history. If queueing fails, none of those acceptance effects may be partially committed. Preserve the single-pending-reminder constraint across MANUAL and SCHEDULED requests.
* Preserve the reviewed recipient, subject, body and template/content identity through queueing and delivery. The generated response-link token is the only delivery-time substitution in the reviewed message. A later template edit must not silently change an accepted message.
* For these reviewed MANUAL messages, recheck the relevant Order status/date/Supplier/contact/reference and confirmation window before external delivery. Do not deliver a now-obsolete message or silently rewrite it. Record a truthful non-sent outcome, release its pending slot safely and require fresh preparation/review for a replacement. This check must not reject a reminder merely because its own pending record exists. Preserve existing weekday delivery timing.
* Preserve existing provider retry, idempotency and reconciliation safeguards. A retry of the same delivery uses the same accepted message and outbox identity. An uncertain provider outcome must remain held for reconciliation; never blindly create a replacement email. No new operator retry button or command is required.
* Successful queueing means **queued/pending**, not sent. Show SENT only from the actual delivery result; failures and suppressed obsolete messages must not appear successful. Preserve existing history and distinguish MANUAL from SCHEDULED. Opening/canceling a review adds no queued/sent entry. Refresh history and eligibility in both FRO-326 locations after accepted queueing or a changed delivery result.
* Sending either email leaves Order status, readiness date/remark, supplier confirmation, collis, warehouse custody and journey history unchanged. Existing email audit/history is the only intended business side effect. Supplier responses remain a separate existing workflow.

## Scope and decisions

| Decision | Reason |
| -- | -- |
| One ticket owns both email intents and their shared manual-send contract. | Keep intent selection, validation and delivery consistent. |
| Backend first; activate the portal interaction with FRO-326. | Reuse the agreed presentation and coordinate the manual callers without a duplicate UI. |
| Recipient, subject and body are read-only. | Preserve supplier-contact selection and template behavior without adding email composition. |
| Every manual channel prepares and explicitly confirms. | A direct REST/GraphQL/MCP call must not bypass the reviewed-send requirement after activation. |
| Existing scheduled reminders and supplier responses retain their behavior. | This change concerns manually initiated messages. Shared renderer/outbox changes must not alter automatic selection, timing, deduplication or response processing. |

Out of scope: a new page/canvas/preview, bulk emailing, recipient overrides, outgoing-email language selection, readiness-date entry/correction, supplier-response redesign, automatic-reminder policy changes, unrelated lifecycle changes and production branch creation. Preserve existing reminder/token/response records and pending legacy work; do not discard, relabel or resend history during rollout. Already queued legacy work retains its existing processing behavior; the reviewed contract applies to newly accepted manual messages after activation.

## Acceptance criteria and safe-environment verification

| ID | Observable result |
| -- | -- |
| AC1 | Eligible PENDING/no-date preparation produces ASK_READINESS_DATE request content; eligible EXPECTED_READINESS/date produces CONFIRM_READINESS content with the exact recorded calendar date. Test both subjects and HTML/plain-text bodies. |
| AC2 | Inconsistent state/date combinations, READY/later/exception states, initial-scheduled-record absence, pending reminders, weekday/window boundaries, missing Supplier/contact and denied authority cannot queue. Cover Athens midnight and weekend-adjusted opening boundaries. |
| AC3 | Preparation, repeated preview reads, Cancel and close create no reminder/outbox/attempt, provider call, readiness change or usable/revoked supplier-response token. Recipient, subject and body are read-only. |
| AC4 | Across REST, GraphQL and MCP, only explicit confirmation of a valid actor/Order-bound preparation queues. Missing/mismatched preparation and attempted recipient/content substitution fail. No enabled legacy direct-send bypass remains after activation. |
| AC5 | Status/date/Supplier/contact/reference/content changes during review require fresh preparation and renewed approval; eligibility/authority loss blocks Send. No partial queueing or silent substitution occurs. |
| AC6 | Double-clicks, concurrent confirmations and retries after a lost response or completed delivery create at most one reminder/outbox for that accepted preparation. A competing MANUAL/SCHEDULED queue cannot create a second pending reminder. |
| AC7 | Accepted recipient/content survives delayed delivery, template changes and provider retries. Only the protected delivery link is substituted. A reviewed MANUAL message made obsolete before delivery is not sent and is recorded accurately; uncertain provider outcomes retain reconciliation protection. |
| AC8 | Queue acceptance, sent, failed and obsolete-message outcomes are accurate; existing history remains intact. Both FRO-326 locations refresh consistently, with EN/EL labels, eligibility/disabled reasons and a shared review/Send flow. |
| AC9 | Neither manual email changes readiness/lifecycle/colli/custody data nor treats sending as supplier confirmation. Scheduled reminders, supplier responses and legacy queued work retain their specified existing behavior. |
| AC10 | The 0.0.4 backend rollout preserves the existing interaction. Activation with FRO-326 coordinates all manual callers and rejects unmigrated direct sends; FRO-335 creation exposes no readiness emails. |

Run sending, concurrency, state changes, token checks, failures and retries only in an isolated test environment with a test email provider. Capture evidence for each criterion; do not send production test emails or mutate production Orders.

## Context for agents

Affected systems: **frontline-forwarding-app** (domain, persistence, REST/GraphQL/MCP and email delivery) and **frontline-forwarding-client** (contract consumption through FRO-326). Sources: live `Frontline-Forwarding/frontline-forwarding`, inspected through authenticated `gh` at `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.

* **Storage:** `docs/reference/database.md` defines `freight_purchase_order.status`, `readiness_date`, `readiness_remark` and `supplier_company_id`; reminder tables are `freight_readiness_reminder`, `freight_readiness_reminder_outbox`, `freight_readiness_reminder_delivery_attempt`, `freight_readiness_response_token` and `freight_readiness_response`. Existing reminder storage has no subject/body/template-version snapshot; add the persistence needed for the reviewed-content and confirmation guarantees without rewriting historical records.
* **Domain:** under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/reminders/`, `ReadinessReminderCommandService.java` implements current manual eligibility/contact resolution; `ReadinessReminderTiming.java` defines Athens date rules; `ReadinessReminderRepository.java` atomically creates reminders/outbox records. `PurchaseOrderAuthorizationService.java` in the parent package defines internal edit authority. Eligibility/history reads do not queue.
* **Rendering/delivery:** the same reminders package contains `ReadinessReminderEmailRenderer.java`, `ReadinessReminderEmailDataRepository.java`, `ReadinessReminderDeliveryService.java` and `ReadinessResponseTokenIssuer.java`. Existing delivery loads the Order number, issues the token and renders during delivery; do not reuse this path for preview. Templates are `frontline-forwarding-app/src/main/resources/templates/email/readiness-reminder.html` and `.txt`; outgoing content currently uses English and UK long-date formatting.
* **Adapters:** `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/PurchaseOrdersRestApi.java`, `PurchaseOrdersGraphQlApi.java` and `PurchaseOrderMcpTools.java` currently route Order-ID-only manual sends to the shared service. REST uses `GET /api/v1/purchase-orders/{id}/readiness-reminder-eligibility`, `GET /api/v1/purchase-orders/{id}/readiness-reminders` and `POST /api/v1/purchase-orders/{id}/readiness-reminders`; GraphQL uses `sendPurchaseOrderReadinessReminder`; MCP uses `frontline_get_readiness_reminder_eligibility` and `frontline_send_readiness_reminder`. Keep all supported manual adapters aligned with the new contract. Synchronize API/schema references and generated clients through the repository's generation workflow.
* **History/duplicates:** `web/purchaseorders/output/ReadinessReminderOutput.java` currently exposes recipient/type/trigger/target/date/status metadata, not subject/body/template version. Do not claim existing history proves exact sent content. `src/main/resources/db/migration/V12__prevent_duplicate_pending_readiness_reminders.sql` protects pending reminders; provider idempotency uses the outbox identity. Neither alone deduplicates a repeated confirmed operation after completion.
* **Client:** under `frontline-forwarding-client/src/features/purchase-orders/`, `components/readiness-reminder-action.tsx`, `services/purchase-order-service.ts`, `hooks/use-purchase-orders.ts` and `localization/purchase-order-labels.ts` contain the current direct-send integration. FRO-326 owns its replacement presentation and consumes this backend contract.
* **Preservation references:** `docs/workflows/purchase-order-colli-journey.md`, `docs/architecture/authorization.md` and `PublicReadinessResponseService.java` describe automatic reminders, authorization and supplier responses. Shared implementation does not authorize changing those policies.

## Post-deployment verification

Production checks are read-only. Never press Send, post a response, alter an Order, invoke a write API/MCP tool or create a production test message. When a condition has no existing evidence, report it as unverified and use the isolated-test evidence.

| Criteria | Concrete read-only check |
| -- | -- |
| AC1-AC2 | Open existing saved Orders in the applicable states; compare saved status/date with the action, eligibility reason, recipient and prepared subject/body. Use the eligibility GET for the same Order. Inspect READY, later and inconsistent records if available without creating them. |
| AC3 | Open and close a review without Send; compare reminder-history GET responses before/after and inspect browser network calls for absence of send/queue requests. Consult isolated token/outbox/provider evidence for absence of hidden side effects. |
| AC4-AC6 | Inspect deployed REST/GraphQL/MCP contract definitions and recorded isolated-test evidence for preparation binding, stale rejection, all-or-none queueing and repeat/concurrent Send protection. Do not probe production write routes. |
| AC7 | Inspect existing authorized delivery/reconciliation evidence and captured isolated-test comparisons of reviewed versus delivered content and obsolete-message handling. Current history metadata alone is insufficient to prove content fidelity. |
| AC8 | Read existing reminder history and compare actual pending/sent/failed outcomes with the displayed labels. Open both FRO-326 action locations in EN/EL and confirm synchronized availability/review without sending. |
| AC9 | Compare existing email history/audit evidence with unchanged readiness/custody records; inspect existing automatic-reminder and supplier-response evidence and their isolated regression results. Do not trigger those workflows. |
| AC10 | Inspect deployed version/contract and rollout evidence. At activation, verify FRO-326 consumes preparation/confirmation and FRO-335 shows no creation-time readiness-email control. Use isolated compatibility results to verify direct-send rejection. |

**Reference:** live reminder implementation and workflow sources above; [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) for saved-Order presentation and [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) for the creation boundary.
