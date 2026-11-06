# Shipment Invoice Details/edit — specification check, 2026-11-06

User approved Q1–Q15 and the local stacked-card preview. Current FRO-244/FRO-301 remain Todo/Ready; FRO-363 is Backlog/Pending_Review, has an unmounted published mock, and explicitly requires a saved Details destination. No dedicated Shipment Invoice Details/edit duplicate found in current issue search. New ticket draft and attachment list await approval; no Linear mutation.

## Live consumer trace

Production main: 5774931b9869247f0247013111a452552403f456, read through gh. Java paths below are relative to frontline-forwarding-app/src/main/java/com/frontline/forwarding/.

| Consumer | Current behavior/source | Required outcome and owner |
| --- | --- | --- |
| Invoice entity/API | Live recursive tree, docs/reference/database.md and graphql-api.md have no Shipment Invoice contract | FRO-244 backend; Details/edit UI here. Do not invent operations or table names. |
| Source rows | domain/purchaseorders/PurchaseOrderInvoiceRowRepository.java; freight_purchase_order_invoice_row; ordered line_number,id; copyTo preserves full amounts/quantities | FRO-244 authoritative live/frozen reads; FRO-301 allocation; UI displays immutable source fields. |
| Partial child creation | web/shipments/service/ShipmentsApiService.java createInStockShippingChild calls copyTo | FRO-301 owns allocation eligibility, not this UI. |
| Membership/history | domain/shipments/ShipmentPurchaseOrderParticipationRepository.java findByShipmentId includes closed participation | Preserve invoice eligibility on departed/arrived Shipments; FRO-244 reads. |
| Company relationships | domain/purchaseorders/PurchaseOrderParties.java distinguishes clientCompanyId/invoiceCompanyId | FRO-244 supplies allowed references; UI guards company/party text. |
| Conflict precedent | domain/deliverynotes/DeliveryNoteRepository.java updateDraft matches id, DRAFT and expectedVersion; web/deliverynotes/service/DeliveryNotesApiService.java requires version | FRO-244 needs its own authoritative contract; UI must not borrow delivery-note schema/authority names. |
| Shipment cancellation | web/shipments/service/ShipmentsApiService.java cancel locks/version-checks and closes movement participation; invoice guard absent | Preserve existing checks; FRO-244 adds invoice resolution guard; UI only resolves invoice records. |
| Authorization | docs/architecture/authorization.md; domain/deliverynotes/DeliveryNoteAuthorizationService.java as precedent | FRO-244 owns staff/cancellation authorization; UI consumes capabilities. |
| Numbering | DeliveryNoteRepository fiscal sequence is per issuer/series | Not the Shipment Invoice global sequence; FRO-244 owns its independent contract. |
| Existing billing | client src/features/billing/services/billing-service.ts serves generic hardcoded fixtures | Unrelated; preserve and do not adopt as Shipment Invoice data source. |
| Create handoff | FRO-363 mock 230a90581aa85e611737add554b2b3c6f5912e0e; create/README.md and types.ts | onSaved(id) needs this Details UI; presentation props are not production APIs. No create-ticket rewrite. |
| Review and replacements | No current Shipment Invoice implementation | Agreed requirements, explicit FRO-244 backend integration blockers; browser-local review flags cannot enforce finalization. |

## Design/spec reconciliation

| Decision | Draft section / requirement |
| --- | --- |
| Q1–Q3 Details/edit, locked Shipment, explicit save | Intro, Fields and editing; FRO-363 destination and saved Shipment guard |
| Q4–Q6 confirmation, discard, cancellation/replacement | Lifecycle actions; permissions, reason and frozen contents |
| Q7–Q9 replacement current values, refresh, conflicts | Goods/review; Replacement prefill; Concurrency |
| Q10–Q12 unsaved replacement, explicit review, navigation | Lifecycle, review acknowledgement and dirty-exit handling |
| Q13–Q15 shared safeguards, incomplete/mixed rules, stacked design | Fields, Goods, Design |

No historical migration or recalculation added. Existing-row allocation migration and first live number remain dependency activation inputs. Actual review persistence/versioning and replacement contracts are not implemented and must be agreed before integration. Concrete allocation UI route remains unresolved. These are stated blockers, not fabricated settled API details.

Source unit is PC/SET/PKT. Corrected the preview fixture PCS to PC without layout or behavior changes, then reran all preview checks successfully. Sample currency options, identifiers, values and number remain fixture-only; production uses supplied reference data and authoritative results.

## Proposed write scope

New Story/Frontend/Pending_Review issue, Backlog, parent FRO-244, Pre-releases 0.0.x / 0.0.12, unassigned/no priority. Blocked by FRO-244 and FRO-301; blocks FRO-363 because its success destination depends on Details. No circular dependency: form reuse is coordination, not a reverse hard block. Four downloadable resources: HTML, component map, desktop and mobile screenshots. No production branch work authorized here. Existing FRO-363-only publication exceptions do not apply.
