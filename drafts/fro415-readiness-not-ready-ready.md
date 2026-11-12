**As an** office operator **I want** an Order's supplier readiness to show only as **Not ready** or **Ready** **so that** the status says whether the goods are ready, while the **Expected readiness date** alone shows whether the supplier has given a date.

**Order = purchase order = stock-list item. Colli = handling unit.** Today the Order has two "not ready" states, **Awaiting Readiness Date** (`PENDING`) and **Received Readiness Date** (`EXPECTED_READINESS`), which differ only in whether a date is known. They come from an earlier plan to show the Order as a linear status flow, which was dropped. This ticket merges them, for users, into one **Not ready** state.

## Readiness model

| Shown to users | Meaning | Expected readiness date |
| -- | -- | -- |
| **Not ready** (Μη έτοιμη) | The supplier has not confirmed the goods are ready. | Optional. Present = the supplier gave a date; absent = no date yet. |
| **Ready** (Έτοιμη) | The supplier confirmed readiness. | Optional, unchanged meaning and label. |

Later states (In Stock onwards) are unchanged.

Users never see or choose Awaiting Readiness Date or Received Readiness Date again. Every rule that behaved differently for those two states now decides by **whether an Expected readiness date exists**. How this is stored (merging the status values or keeping them internally) is the developer's choice, as long as the behaviour below holds across REST, GraphQL and MCP.

## Behaviour by date

| Area | Not ready, **no date** | Not ready, **with date** |
| -- | -- | -- |
| **Request readiness date** email (automatic and manual follow-up) | Eligible, under existing scheduling and follow-up rules | Not eligible |
| **Confirm readiness date** email | Not eligible | Eligible, under existing rules for the date |
| Supplier's public reply link | Supplying a date fills in **Expected readiness date**; the Order stays **Not ready**. Today-or-later rule for the supplier unchanged. | Existing confirmation behaviour unchanged |
| Shipment planning (upcoming Orders) | Cannot be selected. Reason text **"No readiness date yet"** (replaces "Still pending"; EL equivalent). | Selectable when the date is today or later; otherwise the existing **"Its readiness date has passed"** reason |
| Order list **Ready in N days** filter | Excluded | Included when the date falls in the window |
| Colli history | No event | **Expected readiness recorded** event on each nonterminal colli whenever a date is entered or changed |

A queued or prepared reminder whose Order no longer matches (date added, changed or cleared, or Order marked Ready) must not be sent, as today.

## Editing

* **Order details:** while **Not ready**, **Expected readiness date** and **Readiness remark** (optional, max 1,000 characters, existing trimming/blank rules) are ordinary editable fields in the Details edit. The date can be added, changed or cleared; clearing returns the Order to the "no date" behaviour above. Operators may enter past, today or future dates.
* The separate **Set readiness date** action is removed. The Order status card's next step for every **Not ready** Order is **Mark ready**.
* **Ready → Not ready** remains a readiness correction with its existing confirmation, reason, guards and audit. Readiness correction no longer offers Awaiting/Received as separate targets.
* Existing edit guards (statuses in which Orders, collis and invoice rows can be edited, open-Shipment restrictions, permissions) keep treating both former "not ready" states as **Not ready**.

## Creation

Applies to **Create Order** and to Order creation inside **Shipment creation**.

* The initial status choice offers **Not ready** (default) and **Ready**.
* **Expected readiness date** is always editable and optional in both.
* **Not ready** creates directly with no popup, with or without a date.
* **Ready** keeps its single confirmation popup with the optional readiness remark.
* Creating **Not ready** with a date produces the same date-based behaviour as a later date entry (including the colli event), recorded at registration.

## Display

* **Status badge and status filter:** one **Not ready** badge (one colour) and one **Not ready** filter option, in the Order list and everywhere the Order status is shown. The date stays visible in its own column/field.
* **EN/EL labels:** Not ready / **Μη έτοιμη**; Ready / **Έτοιμη** (existing).
* **Status history:** a past Awaiting → Received transition is displayed as **Readiness date recorded**, not as a status change. Other history is unchanged.

## Existing Orders

Current Orders are mock data. Every existing Awaiting or Received Order shows as **Not ready** with its date and remark unchanged. No date, remark, colli event or history entry is deleted.

## Decisions

| Decision | Reason |
| -- | -- |
| Two user-facing states; the date carries "date received" | The Order journey is not linear, so the extra state added no information beyond the date. |
| Keep every date-dependent rule, keyed on the date | Reminders, Shipment planning and filters already depend on it; office work stays the same. |
| Date and remark are ordinary Details fields while Not ready | No status decision is involved any more, so no separate action or popup. |
| No popup for Not ready creation; Ready keeps its confirmation | Only Ready changes how the Order is handled. |
| Operators may enter past dates; supplier link stays today-or-later | Matches today's correction rules; a passed date blocks planning and prompts follow-up. |
| Ready → Not ready stays a correction with a reason | Undoing a supplier confirmation must remain deliberate and audited. |
| Storage approach left to the developer | The ticket defines behaviour, not persistence. |

## Acceptance criteria

| ID | Check |
| -- | -- |
| AC1 | No screen, filter, badge, popup or API option offers Awaiting Readiness Date or Received Readiness Date; Not ready / Ready show in EN and EL. |
| AC2 | Create Order and Shipment-inline creation: Not ready with and without a date create directly; Ready shows one confirmation with optional remark. |
| AC3 | In Details, add, change and clear the date (past/today/future) and remark on a Not ready Order; no Set readiness date action; next step is Mark ready. |
| AC4 | Request readiness date is eligible only for Not ready without a date; Confirm readiness date only for Not ready with a date; stale queued reminders are not sent after a date change, clear or Ready. |
| AC5 | Supplier reply link fills the date and keeps the Order Not ready; past dates still rejected there. |
| AC6 | Shipment planning: Not ready without a date shows "No readiness date yet"; with a future/today date it is selectable; with a past date shows "Its readiness date has passed". |
| AC7 | Ready in N days filter returns Not ready Orders with a date in the window only; status filter has a single Not ready option. |
| AC8 | Entering or changing a date records Expected readiness recorded on each nonterminal colli; at creation too. |
| AC9 | Ready → Not ready works only through readiness correction with reason and audit. |
| AC10 | Existing mock Orders: former Awaiting/Received show as Not ready with dates/remarks intact; past transitions show as Readiness date recorded. |
| AC11 | Existing edit guards, customs correction, colli split/edit, stock confirmation and historical-arrival rules behave as before for Not ready Orders. |

## Out of scope

A "No readiness date" quick filter; changes to Shipment statuses or the Shipment status bar; the Create Order field layout (separate ticket); reminder email wording or schedule changes; new permissions.

## Affected systems

* `frontline-forwarding-app`: Order status/readiness rules, creation, readiness correction, reminders and public reply, Shipment selection eligibility, Order list filters, colli journey events, GraphQL/REST/MCP contracts and generated docs.
* `frontline-forwarding-client`: Create Order, Shipment-inline Order creation, Order details editor and status card, readiness correction, status badge, Order list filters, labels (EN/EL), Shipment selection reason texts.

## Context for agents

Live repository read through `gh` at `08e3555d8668d931e8df84b035dcf0bfb5e7b30d`. Java paths relative to `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

* `domain/purchaseorders/PurchaseOrderStatus.java`; `docs/workflows/purchase-order-colli-journey.md`: lifecycle, creation matrix, "only a PENDING PO can have its date recorded", reminder rules.
* `domain/purchaseorders/reminders/ReadinessReminderScheduleCandidateRepository.java`, `ReadinessReminderCommandService.java`, `ReadinessReminderPreparationService.java`, `PublicReadinessResponseService.java`: reminder eligibility and the reply link moving PENDING → EXPECTED_READINESS.
* `domain/shipments/ShipmentSelectionEligibilityRules.java`: `ORDER_PENDING` and `READINESS_DATE_PASSED`; `web/shipments/service/ShipmentReadinessPolicy.java`; `domain/shipments/HistoricalArrivalRules.java`.
* `domain/purchaseorders/PurchaseOrderRepository.java`: date recording, Ready-in-N-days filter and Shipment-eligible list filter keyed on EXPECTED_READINESS.
* `web/purchaseorders/service/PurchaseOrdersApiService.java`, `PurchaseOrderRequestValidator.java`, `input/PurchaseOrderCreateInput.java`, `input/PurchaseOrderReadinessCorrectionInput.java`, `PurchaseOrderCustomsService.java`: creation, correction and customs-correction status sets.
* `domain/purchaseorders/HandlingUnitJourneyEventType.java`: `EXPECTED_READINESS_RECORDED`.
* DB: `freight_purchase_order.readiness_date`, status check constraint and transition table (`docs/reference/database.md`); split headers require equal parent/child readiness date.
* Client: `features/purchase-orders/components/creation/*`, `details/order-details-card.tsx`, `details/order-status-card.tsx`, `details/order-collis-tab.tsx`, `purchase-order-status-pill.tsx`, `purchase-order-table.tsx`, `features/shipments/components/creation/shipment-inline-order.tsx`, `features/shipments/localization/shipment-selection-reasons.ts`, `app/providers/labels-provider.tsx`.
* The stock-list PDF does not print readiness status.

## Post-deployment verification

Read-only. Do not create, edit or advance production Orders, and do not trigger reminders.

| Criteria | Read-only check |
| -- | -- |
| AC1, AC7 | Open the Order list: status filter options and badges show only Not ready / Ready (EN and EL). |
| AC2 | Open Create Order and Shipment creation without submitting: status choice is Not ready / Ready and the date is enabled under Not ready. |
| AC3, AC9 | Open a Not ready Order's Details: next step is Mark ready, no Set readiness date; inspect the editor without saving. |
| AC4–AC6, AC8 | Review safe-environment test evidence for reminder eligibility, reply link, Shipment selection reasons and colli events; read reminder eligibility through a read-only query on existing Orders with and without a date. |
| AC10, AC11 | Read existing Orders formerly Awaiting/Received: Not ready with dates and history intact. Review regression evidence for edit guards and lifecycle rules. |

**Reference:** FRO-336 (initial readiness state) · FRO-335 (Create Order) · FRO-343 (Order inside Shipment creation) · FRO-346 (readiness correction) · FRO-326 (Order Details) · FRO-328 / FRO-397 (readiness emails) · [Production repository](<https://github.com/Frontline-Forwarding/frontline-forwarding>).
