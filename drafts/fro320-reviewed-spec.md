**Warehouse transfer** lets operators select an eligible destination warehouse directly, without choosing its ownership subtype. Both existing warehouse kinds remain distinct in reference data and share the existing NETWORK_TRANSFER contract.

**Order** = purchase order = stock-list item. **Colli** = permanently identified handling unit.

## Scope and ownership

| Owner | Contract |
| -- | -- |
| FRO-320 | Warehouse-transfer terminology, combined destination eligibility and preservation of route, stock and internal contracts. |
| [FRO-341](https://linear.app/front-line-ltd/issue/FRO-341) | Creation/review presentation and client integration, including purpose/destination controls, draft feedback and EN/EL accessibility. |
| [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316) | Saved Details presentation and integration with authorized editing operations. |
| [FRO-339](https://linear.app/front-line-ltd/issue/FRO-339) | Country/city references, geography-first warehouse filtering and compatibility validation. |
| [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344) | Authorized pre-dispatch route editing, atomic validation and readiness invalidation. |
| [FRO-324](https://linear.app/front-line-ltd/issue/FRO-324) | Dedicated historical-arrival recording and existing-arrival linking. |

FRO-320 blocks completion/release of the relevant FRO-341 capability. Prepare the implementation independently, but coordinate activation with compatible FRO-341/FRO-316 consumers. Preserve unrelated screen features and the owning tickets' contracts.

No independent layout, new component, canvas or preview is required here. Use the current FRO-341/FRO-316 presentation contracts.

## Terminology and destination selection

| Element | Required behavior |
| -- | -- |
| Shipment purpose | Display **Warehouse transfer / Μεταφορά μεταξύ αποθηκών** for NETWORK_TRANSFER in creation, review, Shipment list, saved Details and other human-facing Shipment-purpose labels, guidance and relevant validation. Apply the same display mapping to existing records. |
| Warehouse subtype | No separate Frontline warehouse / Associated agent hub selection or Which network destination? prompt in the Shipment selection flow. Do not retain hidden subtype state that restricts choices. |
| Destination warehouse | Required **Dropdown (warehouse reference data)** for Warehouse transfer. Combine both eligible kinds in one list; retain operator name, warehouse code and warehouse name in option labels. |
| Geography | Consume FRO-339: compatible destination country/city must be selected before choosing a receiving warehouse. Geography narrows eligibility; choosing a warehouse must not overwrite geography. |
| Third-party / launch-station purposes | Preserve their existing authorized agent choices, required references, validation and handover rules. |
| Direct delivery on board | Destination vessel remains derived from participating Orders; preserve same-vessel validation and absence of a submitted warehouse/agent destination. Presentation follows FRO-341/FRO-316. |
| Purpose change | Clear incompatible warehouse/agent values and preserve unrelated draft facts. Historical Arrived creation remains Warehouse transfer only under FRO-324. |

Retain NETWORK_TRANSFER in storage, API/MCP payloads and internal events. Retain both warehouse kinds and operator categories, their identifiers, reference-data labels and operational distinctions. Renaming the Shipment purpose does not rename warehouse ownership categories or rewrite historical records.

## Eligibility and invalid selections

A selectable warehouse must satisfy all applicable rules:

* Active warehouse, different from a known origin warehouse.
* FRONTLINE_HUB operated by an active FRONTLINE company, or ASSOCIATED_AGENT_HUB operated by an active ASSOCIATED_AGENT company.
* Existing authorization and FRO-339 destination city/country compatibility. Unknown warehouse geography cannot establish compatibility.
* The owning operation's ordinary or historical requirements; FRO-324 alone permits an unknown historical origin.

Return enough eligibility information for the combined choices to exclude invalid destinations, including inactive or incompatible operators. An active-warehouse-only lookup is insufficient. Server-side validation remains authoritative.

When an origin/geography change or refreshed reference data proves the selected destination invalid, clear it, explain why and require reselection. Preserve unrelated draft fields and apply the owning tickets' existing dependent Order/colli, packing and historical-match resets. Do not automatically choose a replacement.

Loading, empty and failed lookups must not present an unverified destination as valid or allow submission. A lookup failure does not by itself prove that a stored reference is invalid; retain unrelated work and allow recovery. Once refreshed data establishes invalidity, apply the clearing rule above.

Revalidate destination eligibility at the owning create/edit/historical operation. Reject stale or invalid submissions without partial effects. Keep GraphQL, REST and MCP consistent through their shared authorized services; preserve their internal values and operation contracts.

## Arrival and stock — preserve

| Operation | Required outcome |
| -- | -- |
| Ordinary Warehouse transfer arrival | Preserve the inbound warehouse stay and permanent Order/colli identities. The stay becomes AT_WAREHOUSE; the Order becomes AWAITING_IMPORT. Arrival does not confirm stock or record final delivery handover. |
| Separate stock confirmation | Preserve existing permissions, position, measurement and arrival requirements. The stay becomes IN_STOCK. The Order becomes IN_STOCK, or PREPARED_FOR_SHIPMENT when an open shipment reservation exists. |
| Historical arrival recording/linking | Follow FRO-324. A matched arrival already confirmed in stock retains its stock facts; do not reset it or create a duplicate stay. Its explicit unknown-arrival-date exception remains owned by FRO-324. |
| Subsequent movement | Preserve existing selection/reservation, readiness, dispatch and handover rules. The combined destination list introduces no automatic stock confirmation or new lifecycle transition. |

Apply these preservation rules to both warehouse kinds. Keep warehouse history, audit/journey events, stock-list location calculations and existing document behavior intact.

## Acceptance criteria

1. Human-facing Shipment-purpose wording consistently uses Warehouse transfer in EN/EL, including existing records; internal NETWORK_TRANSFER values and warehouse categories remain unchanged.
2. One destination selection combines both eligible warehouse kinds without subtype state. It excludes inactive warehouses/operators, invalid kind/operator pairs, the known origin and geography-incompatible warehouses.
3. Origin/geography/purpose changes and refreshed eligibility clear incompatible destinations with an explanation and require valid reselection. Unrelated draft facts survive; loading/empty/error states cannot enable an invalid submission.
4. Authorized create/edit/historical consumers enforce the same applicable destination rules and reject stale/invalid submissions without partial effects. Existing permissions and adapter contracts remain intact.
5. Agent and direct-vessel routes retain their existing references, same-vessel rules and handover behavior. Historical Arrived remains restricted to FRO-324's operation.
6. Both warehouse kinds preserve ordinary arrival, separate stock confirmation and the open-reservation outcome. Historical already-stocked linking preserves existing facts without duplicate stays.
7. FRO-341/FRO-316 integrate the agreed behavior in their existing designs, including EN/EL, keyboard/narrow-screen usability and recoverable errors. Activation is coordinated with compatible consumers.

## Decisions

| Decision | Reason |
| -- | -- |
| One warehouse selection, retaining ownership categories | Operators do not need to choose an ownership subtype before choosing their operational destination. |
| Consistent human-facing naming, including existing records | Avoid different names for the same Shipment purpose without a data migration. |
| Clear a destination proven invalid; require explicit reselection | Prevent stale or impossible routes without silently substituting a destination. |
| Separate implementation preparation from coordinated activation | The behavior must be usable through compatible creation and Details consumers. |
| Preserve stock and historical-operation distinctions | A display/selection simplification must not change custody, reservations or recorded facts. |

**Out of scope:** independent UI design; new destination kinds; warehouse/company category migration; historical Shipment conversion; new permissions; new lifecycle, dispatch-revalidation or stock-confirmation policy; changes to agent eligibility, fiscal documents or stock-PDF calculations.

## Context for agents

Production source: Frontline-Forwarding/frontline-forwarding, inspected through gh at **5c51030680c9d45b3827a7e19b8320c19aa5ed9a** on 23 October 2026. This is repository evidence, not confirmation of the deployed version.

Client paths are under frontline-forwarding-client/src/; Java paths are under frontline-forwarding-app/src/main/java/com/frontline/forwarding/.

| Source | Relevant contract |
| -- | -- |
| features/shipments/components/shipment-composer.tsx | Subtype state, destination filtering, origin/purpose resets, review labels and route validation. |
| features/shipments/graphql/shipments.graphql | GetShipmentComposerOptions currently requests active warehouses but not operator activity; preserve unrelated agent lookup behavior. |
| app/providers/labels-provider.tsx; features/shipments/components/shipment-table.tsx; shipment-detail.tsx | Literal text and shared enum-label consumers must remain consistent. |
| web/shipments/service/ShipmentsApiService.java | Route validation966–997; warehouse arrival853–963; dispatch583–665. Preserve both kind/operator pairs and active-operator checks. |
| web/shipments/service/ShipmentInputValidator.java | Purpose-specific destination shape and prohibition on final handover for NETWORK_TRANSFER. |
| domain/warehouses/FreightWarehouseRepository.java | findActive filters warehouse activity; it does not alone establish destination eligibility. |
| web/purchaseorders/service/PurchaseOrdersApiService.java | confirmInStock952–1040 distinguishes stay stock status from the Order's open-reservation outcome. |
| web/purchaseorders/service/StockListPdfModelFactory.java | Current/last-known stay and warehouse code/name formatting remain unchanged. |
| docs/workflows/shipment-lifecycle.md; docs/workflows/purchase-order-colli-journey.md | Custody, movement, identity and stock workflows. |

Affected systems: client wording/selection integration and shared backend destination eligibility/validation where needed. Preserve existing persistence and API contracts; synchronize affected curated documentation and regenerate references only from changed source contracts.

## Post-deployment verification

| AC | Read-only check |
| -- | -- |
| 1 | Open creation, review, list and existing Shipment Details in EN/EL. Compare human-facing labels with the unchanged purpose value in read responses. |
| 2 | Inspect destination options against authorized warehouse/operator/geography reference data and review controlled-environment eligibility tests for both kinds and every exclusion. |
| 3 | Without saving, change draft origin/geography/purpose and inspect reselection feedback. Review stale-reference and loading/empty/error test evidence. |
| 4 | Review GraphQL/REST/MCP and owning-operation validation, permission, stale-input and no-partial-effect test results. Do not submit production mutations. |
| 5 | Inspect agent/direct-vessel and historical-Arrived draft states without saving; review preserved-route validation tests. |
| 6 | Read existing normal-arrival and stock-confirmation history for both kinds, including an open-reservation case, and historical already-stocked linking evidence. Compare Order status, stay state and stable identities. If suitable records are unavailable, report unverified. |
| 7 | Inspect the integrated FRO-341/FRO-316 screens at desktop/narrow widths in EN/EL and review keyboard/error-state evidence and coordinated-release verification. |

## Design references

Current presentation: [FRO-341 creation preview](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site/) and FRO-316's linked Details design.

Historical reference only: [Direction C preview](https://frontline-warehouse-transfer-c.frontlineltdproject.chatgpt.site). Retain the existing Direction C screenshot and preview attachments; they do not prescribe implementation.

![Historical Direction C screenshot](https://uploads.linear.app/80ed42b4-423d-4c1b-9de1-ac81bad4e49c/4f8472ec-2ab5-4bcf-887b-4d255471a009/ec751aae-9744-4ae9-93a6-1130ed409158)

**Reference:** repository sources above; FRO-341/FRO-316 presentation; FRO-339 geography; FRO-344 pre-dispatch editing; FRO-324 historical arrival.
