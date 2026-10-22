**Provide independent Internal Notes and External Notes for each Order and Shipment**, with server-enforced visibility and safe creation and editing contracts.

**Order = purchase order = stock-list item.** Each record owns its own notes. Order and Shipment notes never synchronize or derive from one another.

## Fields

| Field | Type / format | Rules |
| -- | -- | -- |
| **Internal Notes / Εσωτερικές σημειώσεις** | Optional multiline plain text; maximum 2,000 characters | Readable only by authorized Frontline staff and system administrators. |
| **External Notes / Εξωτερικές σημειώσεις** | Optional multiline plain text; maximum 2,000 characters | Readable by authorized internal users and existing authorized external Order readers. Does not grant record access. |

For new or edited values, trim surrounding whitespace, normalize null/blank to empty, and preserve internal line breaks. Render text escaped, without interpreting HTML. Enforce limits server-side; reject invalid input without truncation or partial persistence.

## Authorization and lifecycle

| Record / action | Required behavior |
| -- | -- |
| **Order read** | Keep existing record scope and PURCHASE_ORDER_VIEW. Authorized Frontline/system users may read both fields. Authorized client, supplier and agent users receive External Notes only. Internal Notes content must be absent from their responses. |
| **Shipment read** | Keep SHIPMENT_VIEW and existing Frontline/system identity requirements. External Notes does not introduce partner Shipment access or expose a mixed-client Shipment through a participating Order. |
| **Order creation / editing** | Keep PURCHASE_ORDER_CREATE / PURCHASE_ORDER_EDIT, internal identity and existing guards. Saved notes are editable only in PENDING, EXPECTED_READINESS, READY and IN_STOCK. |
| **Shipment creation / editing** | Keep SHIPMENT_CREATE / SHIPMENT_EDIT and internal identity requirements. Authorized notes-only editing is allowed in every Shipment status, including after dispatch, arrival, cancellation or location unknown. |
| **View-only / external users** | Reading notes grants no editing permission. Enforce denial server-side. |

Notes-only changes preserve readiness, route, participation, packing, reservations, actual movement facts and lifecycle state. In particular, they do not invalidate READY_FOR_DISPATCH when that capability is delivered. Coordinate with FRO-344 without inheriting its operational-field restrictions for notes.

## Creation and independent updates

- Accept both optional fields in the authorized Order and Shipment creation contracts. Persist them atomically with the entity and its existing creation effects. Failure leaves no partial entity, notes or repeated split/reservation effects.
- Provide authorized notes-only updates without requiring a full header or lifecycle payload. An omitted field preserves its saved value; an explicitly supplied null/blank clears only that field. A combined two-field update succeeds or fails atomically.
- Save only the intended field or fields. Preserve the other notes value and all unrelated entity data. Return canonical saved values and the concurrency information needed by callers.
- Protect against stale client edits using an explicit version or equivalent comparison with the state the caller reviewed. Reject a conflicting stale write with actionable feedback and no partial effects; a server lock followed by a freshly read version alone is insufficient.
- Apply the same validation, record authorization and transaction rules through GraphQL, REST and MCP adapters. Extend existing create contracts and provide shared notes-update behavior rather than separate adapter-specific rules.
- Adapt existing single-Notes consumers and payloads during rollout so they cannot expose Internal Notes, clear an omitted field or overwrite a newer edit. If a legacy notes read alias remains, it is staff-only Internal Notes; it must not leak through partner summaries or detail responses. Any retained legacy write maps only to Internal Notes under the same guards and stale-edit protection. Reject unsupported or conflicting legacy/new payloads explicitly rather than ignoring them.

## Existing data and split Orders

Preserve every existing entity-level Notes value as **Internal Notes**, including its complete text and line breaks; initialize **External Notes** empty. This rule applies even when the current records are demo data. Do not reset, truncate, normalize or infer an external value from existing text during migration.

The checked Shipment model has no entity-level Notes field. Initialize both Shipment fields empty; if entity-level Shipment notes are introduced before implementation, preserve them as Internal Notes under the same rule. Do not migrate colli, load-unit, delivery-note, readiness-remark or activity-message notes.

Both **manual Order splits** and **Shipment partial-selection splits** copy both saved parent notes values once into child-owned fields as part of the existing atomic split. Later parent or child edits remain independent. Preserve permanent colli identities, lineage, existing split status rules, attachments and history; no family-wide synchronization or retroactive copying to existing children.

## Readers, documents and confidentiality

- Apply field visibility to every response that exposes notes, including Order summaries, details, nested references and legacy aliases. Filtering must happen server-side before serialization.
- The **stock-list PDF Notes position uses External Notes only**. Leave it empty when External Notes are empty; never fall back to Internal Notes, even for an internally requested PDF.
- Keep Internal Notes out of external-facing activity/history payloads, errors and document outputs. Do not copy their text into generally visible audit metadata. Preserve existing actor/time attribution for authorized changes without rewriting movement history.
- Existing consumers that do not expose entity notes, including the current Order MCP summary, need not gain note fields. Preserve child-object notes and unrelated document behavior.
- Customer API visibility is included now. Exact customer-page placement and presentation are separate future work and do not block this structural delivery.

## Delivery ownership

This ticket delivers storage, migration, shared authorization, create/update contracts, split behavior, response filtering and the stock-list PDF source change in **0.0.3**.

| Ticket | Presentation ownership |
| -- | -- |
| [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) | Order creation drafts and submission; milestone 0.0.5. |
| [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) | Order Details Notes card and independent editors; milestone 0.0.5. |
| [FRO-341](https://linear.app/front-line-ltd/issue/FRO-341) | Shipment creation drafts and submission; milestone 0.0.9. |
| [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316) | Shipment Details Notes card and independent editors; milestone 0.0.9. |

**FRO-292 blocks all four tickets for their Notes integration** and is not blocked by their completion. Preview design and unrelated page implementation may proceed beforehand.

Reuse their agreed Notes presentation: labelled Internal/External sections, multiline and empty display, EN/EL, narrow-screen support and independent draft handling. Creation remains local until entity creation; saved-record editors follow their existing Save / Cancel, failure-retention and focus rules. Their UI acceptance belongs to those tickets.

Visual references: [Order Details preview](https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/) · [Shipment Details preview](https://fro-316-shipment-preview.frontlineltdproject.chatgpt.site/). No additional UI design, preview or frontend implementation belongs to this ticket.

## Decisions

| Decision | Reason |
| -- | -- |
| Backend/contracts first; existing redesigns deliver UI later | Keep release ownership explicit and avoid duplicate presentation work. |
| All existing partner Order readers receive External Notes only; Shipment access stays internal | Protect internal information without expanding record access. |
| PDF uses External Notes with no fallback | Generated documents must not disclose internal text. |
| Copy both fields once on both split paths | Preserve relevant context while keeping each Order independent. |
| Preserve Order edit guards; allow Shipment notes-only edits in every status | Notes updates do not alter the operational plan or historical movement facts. |
| Preserve existing text as Internal Notes; External starts empty | Avoid data loss and accidental publication of legacy text. |

## Acceptance criteria

1. Each Order and Shipment independently persists both optional fields, with the stated text limits, normalization and plain-text behavior.
2. Authorized creation saves both fields atomically; invalid or denied creation has no partial effects.
3. Notes-only updates distinguish omission from explicit clearing, preserve unrelated data, and reject invalid, denied or conflicting stale writes atomically.
4. Internal users with view authority can read both; external Order readers receive only External Notes. Unauthorized records and partner Shipment reads remain denied across adapters.
5. Order editing follows the listed states and authorities. Shipment notes-only editing works in every status without readiness, movement or fiscal-document effects.
6. Existing notes retain their full content as Internal Notes and External starts empty. Child-object notes remain outside migration.
7. Both split paths take independent copies of both values; subsequent edits do not propagate across records.
8. Stock-list PDFs use External Notes only, including empty values. Internal content is absent from partner responses, aliases, broadly visible audit payloads and document outputs.
9. Existing callers and generated contracts are coordinated so rollout cannot silently lose notes or bypass filtering or stale-write protection. UI delivery remains with the four named redesign tickets.

Verify successful writes, explicit clearing, omitted fields, boundary lengths, multiline/blank input, permission/state denial, stale edits, split rollback and creation failure in an isolated test environment. UI Cancel/draft/error behavior is verified by the owning redesigns.

## Context for agents

Live repository checked through gh on **22 October 2026**, main commit **3820e89e8caa341261e2d48bcb282d93e1bb1d03**.

Paths below are in Frontline-Forwarding/frontline-forwarding:

| Source | Implementation context |
| -- | -- |
| docs/reference/database.md; frontline-forwarding-app/src/main/resources/db/migration/ | freight_purchase_order.notes is nullable varchar(2000); freight_shipment has no entity-level notes. Add migration-backed independent storage without changing child-note meaning. |
| frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java | Existing Order notes limit and blank normalization. Migration must preserve stored text rather than run input normalization over it. |
| frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java | Header edit guards, existing update/audit behavior and manual split copy. |
| frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java | Shipment creation and partial-selection child copy; integrate notes without repeating reservation or movement effects. |
| frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/input/PurchaseOrderUpdateInput.java | Existing notes input lacks field-presence and client-version semantics; adapt callers deliberately. |
| frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderOutputAssembler.java | Existing summary/detail notes and activity serialization require role-aware handling. |
| frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/StockListPdfModelFactory.java | Currently sources the PDF from Order notes; switch to External Notes only. |
| frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderAuthorizationService.java; domain/shipments/ShipmentAuthorizationService.java under the same Java package root | Preserve participant-scoped Order access and internal-only Shipment access. |
| frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls; shipments.graphqls in the same directory | createPurchaseOrder/updatePurchaseOrder expose legacy notes; createShipment lacks entity notes and there is no Shipment notes-update mutation. |
| docs/architecture/authorization.md | Shared GraphQL/REST/MCP authorization; external roles remain view-only. |

Affected systems: **frontline-forwarding-app**, persistence/migrations, Order/Shipment create/read/update adapters and stock-list PDF generation. Synchronize generated database/API/MCP references and frontend contracts with their sources. The existing client single-Notes bindings require rollout compatibility; the four redesigns own new controls and layout.

## Post-deployment verification

Use read-only checks against deployed records and the completed isolated-test evidence. Do not create or edit production data for verification.

| Criterion | Read-only check |
| -- | -- |
| 1–3 | Inspect published create/update schemas, limits and concurrency contracts; compare saved canonical values with existing test/deployment evidence for independent saves, clears, no-op/omitted fields and failure rollback. |
| 4 | Read the same permitted Order using authorized internal and external identities through applicable API adapters. Confirm Internal content is absent externally; inspect existing access-denial evidence for unrelated Orders and partner Shipment reads. |
| 5 | Compare saved notes-only changes and before/after record/audit evidence across allowed Order states and Shipment statuses, including readiness and movement fields. Confirm no lifecycle effects; review denial evidence for locked Order states. |
| 6 | Compare authorized pre-migration snapshots with migrated records. Confirm exact Internal text, empty External values and unchanged child-object notes. |
| 7 | Read parent/child records and split evidence for both split paths; confirm initial copies and independence after previously completed test edits. |
| 8 | Generate/read an authorized stock-list PDF for an existing record with distinct note values and one with empty External Notes; confirm only External text. Inspect partner summary/detail/alias and audit outputs for Internal leakage. |
| 9 | Inspect deployed adapter/generated contracts and rollout-test evidence; confirm legacy consumers cannot clear or expose notes unexpectedly. Verify the four linked tickets retain UI ownership. |

If suitable records, authorized identities or pre-change evidence are unavailable, report the affected check as unverified rather than fabricating a result.

**Out of scope:** new UI implementation or previews; customer-page design; new external Shipment access; child-object notes; rich text; synchronization between entities; changing lifecycle rules or historical movement facts.

**Reference:** FRO-335 · FRO-326 · FRO-341 · FRO-316 · FRO-344; repository sources above.

