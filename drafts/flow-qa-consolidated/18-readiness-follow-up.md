# Order — enable readiness-date follow-up after the automatic request is sent

**Request readiness date** is a follow-up action. The initial request is sent automatically; a manual follow-up becomes eligible only after successful sending of an automatic request for that Order.

## Eligibility

| Condition | Outcome |
| -- | -- |
| No successful automatic request | Manual follow-up unavailable; explain that the initial automatic request has not been sent successfully. |
| Automatic request pending, failed or obsolete | Does not satisfy the successful-send prerequisite. |
| Same Order has ASK_READINESS_DATE, trigger SCHEDULED, delivery status SENT | Initial-send prerequisite satisfied; evaluate remaining existing eligibility rules. |
| Another reminder is pending | Preserve the existing duplicate-pending block. |
| Order no longer awaits a readiness date | Preserve the current unavailable reason and appropriate readiness action. |

## Acceptance criteria

1. Use server evidence for the same Order, request type and automatic trigger. Scheduled-record existence or an outbox completion alone is insufficient.
2. **SENT** means the delivery provider accepted the request under the existing delivery contract; do not require or claim recipient receipt/read.
3. Apply the same predicate to eligibility reads, manual preparation and final send/confirmation. Recheck inside the existing protected write path so an outdated enabled button cannot bypass eligibility or create a second pending reminder.
4. Keep the initial automatic scheduling/delivery and retry behavior intact. Viewing the page or clicking an unavailable follow-up must not send an initial manual substitute.
5. Preserve Order status/date rules, Europe/Athens business-day restrictions, authorization, supplier-contact validation, review, recipient/content binding, pending-operation protection and existing confirmation-date behavior.
6. The existing readiness controls display the server's reason. After successful automatic sending, refreshing eligibility enables the follow-up only if all remaining conditions pass. A failure must not falsely enable it; loss of eligibility after review blocks submission and preserves useful feedback.
7. Verify absent automatic history, pending/failed/obsolete automatic records, successful SENT, wrong Order/type/manual trigger, pending follow-up, nonbusiness day, changed readiness/contact/version between review and confirm, concurrent requests and existing initial-delivery controls. Use a fake mail provider; send no real emails.

## Decisions and scope

Initial request remains automatic. A scheduled record is not proof it was sent. The request/date/ready redesign is deferred; reuse existing actions, confirmation and explanatory feedback.

## Context for agents

Baseline main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/reminders/`:

* `ReadinessReminderCommandService.java` currently checks `hasScheduledMissingDateReminder` for PENDING Orders without a date.
* `ReadinessReminderRepository.java` currently matches Order + ASK_READINESS_DATE + SCHEDULED without delivery status. Provider ACCEPTED records SENT and sent_at.
* `ReadinessReminderDeliveryStatus.java`: PENDING, SENT, FAILED, OBSOLETE. Outbox COMPLETED also occurs for failed/obsolete results.
* Follow `ReadinessReminderPreparationService.java`, confirmation and delivery callers so the predicate cannot differ between visible eligibility and submission.

Client: `src/features/purchase-orders/components/details/readiness-emails.tsx` consumes server eligibility and shows existing actions/reasons.

## Verification

Review isolated eligibility/preparation/send and concurrency results, plus UI reason/refresh cases against the deployed revision. Inspect existing history only for deployment checks; do not send production mail.

**Reference:** [Reviewed readiness emails](https://linear.app/front-line-ltd/issue/FRO-328) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e).
