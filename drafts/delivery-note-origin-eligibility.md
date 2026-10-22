**Restrict Front Line delivery-note preparation and issuance to Shipments departing Frontline-operated warehouses in Greece.** Apply one backend-owned eligibility rule to existing actions and automatic preparation.

A delivery note (δελτίο αποστολής) is the company-specific movement document for that eligible departure. **Order = purchase order = stock-list item; colli = handling unit.** A Shipment or Export Customs Declaration does not itself establish eligibility.

## Eligibility contract

Evaluate the Shipment's physical origin through `freight_shipment.origin_warehouse_id` → `freight_warehouse`, its operator and `city_id` → `city.country_id`.

| Origin | Delivery-note eligibility |
| -- | -- |
| Frontline-operated `FRONTLINE_HUB` in Greece | Eligible, subject to existing authorization, lifecycle and document validation. |
| Frontline warehouse outside Greece | Ineligible. |
| `ASSOCIATED_AGENT_HUB`, including one in Greece | Ineligible. |
| Missing/unknown location, operator or unresolved origin | Do not assume eligibility; reject preparation/issuance with an actionable reason. |

Use the authoritative Frontline operator and Greece reference identities. Do not infer them from warehouse names, address text, a guessed numeric ID or a nonexistent country ISO field.

The rule is independent of destination and Shipment purpose. Greek Frontline warehouse → airport for export, → vessel and → another warehouse all qualify. China hub → Korea hub does not. `NETWORK_TRANSFER` is neither automatically eligible nor automatically excluded. Order Greece, Order customs regime, invoice-company nationality and presence of an Export are not substitutes for origin eligibility.

## Enforcement

1. Enforce eligibility in the shared services used by REST/GraphQL and any exposed preparation/issuance adapter, including direct calls. Preserve existing authorities and all other guards; qualifying origin is necessary, not blanket permission to issue.
2. Recheck current origin/operator/location when preparing drafts and before starting a new fiscal submission. Ineligible requests create no drafts, reserve no fiscal number and send nothing to AADE.
3. Existing consumers must use the same rule for action availability and automatic draft preparation, including list/bulk entry points, Shipment opening, retry/replacement preparation and FRO-303 draft creation. A blocked or unresolved eligibility check must never be treated as an empty note list that triggers creation.
4. An ineligible Shipment must remain usable for its normal logistics workflow without requiring a delivery note or its fiscal fields.
5. Retain existing documents and their authorized read/PDF access. Do not delete, rewrite or automatically cancel historical notes on newly ineligible origins. Keep controlled cancellation and reconciliation of already-submitted/uncertain documents available under their existing guards; those recovery operations must not start a new ineligible submission or replacement draft.

**No new UI:** no screen, component, layout, canvas, preview or screenshots. Consume eligibility through existing controls and error handling. Existing Shipment redesign tickets retain presentation ownership.

## Acceptance criteria

1. Every Frontline-operated Greek-origin departure is eligible across the existing purposes/destinations, subject to unchanged permissions and document validation.
2. Foreign Frontline origins, Greek/foreign associated-agent origins and unresolved origins cannot prepare or newly issue notes through any adapter.
3. Opening an ineligible Shipment, bulk actions, retries and cancellation replacement do not create drafts or contact AADE for a new submission. Eligibility failures leave document persistence and fiscal numbering unchanged.
4. Eligible Shipments retain per-invoice-company grouping and existing draft/issuance behavior. Ineligible Shipments retain ordinary logistics operations without a delivery-note requirement.
5. Historical documents remain readable and unchanged; existing authorized cancellation/reconciliation stays possible without creating a new ineligible document.

## Decisions

| Decision | Reason |
| -- | -- |
| Physical departure from a Frontline-operated Greek warehouse defines eligibility | Front Line issues these documents for those departures; a foreign hub transfer alone does not qualify. |
| All purposes/destinations; exclude associated-agent origins | Airport/export is the common example, not the sole qualifying movement. |
| Shared server rule plus existing-consumer gating | Hidden actions alone cannot prevent direct calls or automatic draft creation. |
| Preserve historical fiscal evidence | A new eligibility rule does not authorize deleting documents or losing recovery access. |

## Affected systems and scope

**frontline-forwarding-app:** delivery-note planning/preparation/issuance guards and read-only eligibility information for existing consumers. REST `POST /api/v1/shipments/{shipmentId}/delivery-notes` and `POST /api/v1/shipments/{shipmentId}/delivery-notes/{deliveryNoteId}/issue`; GraphQL `createDeliveryNotesForShipment` and `issueDeliveryNote`; any equivalent exposed adapters must share enforcement.

**frontline-forwarding-client:** existing delivery-note action/automatic-preparation gates only. Tables supplying eligibility: `freight_shipment.origin_warehouse_id`, `freight_warehouse.kind/operator_company_id/city_id`, `company`, `city.country_id`, `country`. Preserve existing `freight_delivery_note` and `freight_delivery_note_line` history.

Out of scope: redesigns/new UI, changing Shipment purposes, customs/Export eligibility, dispatch prerequisites, recipient grouping, AADE payload/numbering changes, bulk cleanup of erroneous historical documents and Invoice company correction itself (FRO-303).

## Context for agents

Evidence: `Frontline-Forwarding/frontline-forwarding`, main `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.

- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/shipments/Shipment.java`, `domain/warehouses/FreightWarehouse.java`, `FreightWarehouseKind.java`, `domain/locations/City.java` and `Country.java` under that Java root — origin, warehouse kind/operator and country relationship. Country has no ISO-code field; there is no Export ShipmentPurpose.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/DeliveryNotesApiService.java` and `DeliveryNoteDraftSourceService.java` — current preparation checks do not enforce the Greek-origin boundary. Put the rule in shared service behavior, not only one transport adapter.
- `frontline-forwarding-client/src/features/shipments/components/shipment-detail.tsx` and `delivery-notes-card.tsx` — existing card can automatically prepare notes when none exist and the user can create.
- `docs/reference/database.md`, `docs/reference/rest-api.md`, `docs/reference/graphql-api.md`, `docs/architecture/authorization.md`, `docs/workflows/delivery-note.md` — schema/contracts and existing safeguards. The workflow's PREPARING list-selection wording is not proof that the current creation service enforces a lifecycle restriction. Preserve/align lifecycle ownership separately; do not introduce a new state rule in this ticket. Regenerate generated references rather than editing them by hand.

## Post-deployment verification

Use authorized read-only queries and controlled-environment test evidence; do not prepare or issue production documents as verification.

1. Read `shipmentById` and warehouse reference/management queries for Greek Frontline, foreign Frontline, Greek associated-agent, foreign associated-agent and unresolved-origin fixtures. Compare returned/action eligibility with the origin table across existing purposes and destinations.
2. Review REST/GraphQL/direct-service rejection test results; read stored documents and fiscal-counter evidence to confirm ineligible preparation/issuance had no effects or new AADE submission.
3. Inspect existing consumers and captured network/test evidence for ineligible Shipment opening, bulk selection, retry and cancellation replacement: no automatic preparation/new submission occurs, and failure/loading is not interpreted as eligibility.
4. Read `deliveryNotesByShipmentId` or `GET /api/v1/shipments/{shipmentId}/delivery-notes` for eligible and ineligible fixtures: eligible grouping remains intact, and normal ineligible logistics operations have no delivery-note requirement.
5. Compare historical notes, fiscal identifiers and PDF evidence before/after rollout; confirm unchanged records and authorized read access. Inspect controlled recovery tests confirming cancellation/reconciliation remains available without new ineligible replacement.

**Reference:** [FRO-247](https://linear.app/front-line-ltd/issue/FRO-247); [FRO-303](https://linear.app/front-line-ltd/issue/FRO-303); repository paths above.
