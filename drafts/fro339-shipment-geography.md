**Record explicit origin and destination geography on each Shipment** so operators can identify its physical route independently of participating Orders and receiving-agent office addresses.

Normal planned creation requires all four country/city references for every purpose and mode. Historical arrival recording uses the dedicated exception below. Order = Purchase Order = stock-list item; colli = permanently identified handling unit.

## Fields and reference data

| Field | Type / format | Requiredness |
| -- | -- | -- |
| Country of origin | Country reference, `originCountryId` (Long) | Normal creation and pre-dispatch route validation; optional when unknown in historical recording. |
| City of origin | City reference, `originCityId` (Long) | Normal creation and pre-dispatch route validation; optional when unknown in historical recording. |
| Country of destination | Country reference, `destinationCountryId` (Long) | Normal creation, historical recording and pre-dispatch route validation. |
| City of destination | City reference, `destinationCityId` (Long) | Normal creation, historical recording and pre-dispatch route validation. |

Reuse existing Country/City reference data and `countries` / `cities(countryId)`. Store references, return IDs and display names, and preserve absent values as null. Persistence/read contracts must accommodate existing missing values and historical unknown origins; do not apply unconditional non-null constraints to all existing records.

Validate that supplied references exist and that each city belongs to its country. Do not create free-text or placeholder Unknown locations. Match references by identity, not display text.

For historical origin input:
* Both absent → origin geography unknown.
* Country supplied, city absent → retain the known country.
* City supplied, country absent → resolve and persist its country from reference data.
* Both supplied → reject a mismatch; never overwrite an explicitly conflicting country.

Normal creation requires explicit submission of all four references; historical normalization must not bypass that requirement.

## Operation rules

| Operation | Contract |
| -- | -- |
| Normal planned creation | Require complete compatible origin and destination geography for every existing purpose/mode. Preserve origin-warehouse and purpose-specific destination requirements. |
| Historical arrival — [FRO-324](https://linear.app/front-line-ltd/issue/FRO-324) | Require destination country/city and a compatible receiving warehouse. Origin geography and exact origin warehouse may remain unknown. Known geography does not require a known origin warehouse. |
| Existing record reads | Preserve missing geography without inferring it from Orders or warehouses. Return known and unknown components independently. |
| Pre-dispatch route save, readiness confirmation and dispatch | Require all four references and current warehouse compatibility, including for existing incomplete Shipments. Complete/correct the route explicitly through [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344); no guessed backfill. |
| Unrelated Notes/attachments | Missing geography alone does not block operations allowed by their existing contracts. |
| Dispatched, arrived or other operationally locked records | Preserve recorded geography and missing values. This ticket adds no correction/reopening operation. |

The historical exception is available only through FRO-324's dedicated authorized operation, not arbitrary creation with ARRIVED status. Preserve its eligibility, chronology, movement, existing-arrival linking and atomicity rules. Later historical geography completion/correction remains outside scope.

## Geography and warehouse compatibility

Geography describes the Shipment's physical departure and destination/handover. A receiving agent's registered office and a vessel's identity do not determine that geography.

| Reference | Rule |
| -- | -- |
| Origin warehouse | Match its city and that city's country to the selected origin city/country. |
| Receiving warehouse, where required by purpose | Match its city and that city's country to the selected destination city/country. |
| Warehouse with unknown city | Cannot establish compatibility; exclude it from matching choices and reject it on submit. Complete its address through existing warehouse maintenance before using it in a geography-validated route. |
| Receiving agent / vessel | Preserve existing authorized choices and purpose/derived-vessel rules. Do not filter agents by registered-office address or vessels by geography. |

For each applicable warehouse selector, select country → city → warehouse. The selections remain explicit: choosing a warehouse must not populate, overwrite or reinterpret geography. In historical recording, an optional origin warehouse can be selected only when compatible origin country/city are known.

Geography filters narrow existing eligibility. Retain authorization, active warehouse/operator, warehouse-kind and origin-exclusion rules. A destination warehouse is required only for the purposes/operations that already require one; agent/vessel destinations do not acquire an extra warehouse requirement.

The client contracts consumed by FRO-341 must support:
* City choices limited to the selected country; country changes clear the corresponding city.
* Warehouse choices disabled until corresponding geography is complete; no match leaves the required warehouse unresolved and blocks creation.
* Geography changes refreshing choices and clearing incompatible selected warehouses.
* Clearing/changing origin warehouse applying existing dependent Order/colli and partial-selection resets.
* Historical receiving-warehouse changes clearing dependent Order/colli selection and existing-arrival matches, followed by a fresh compatibility check.
* Unrelated draft facts retained across these changes, tabs, review and language changes; lookup/save failures preserve the draft.

For saved route edits, use FRO-344's complete-plan validation and explicit conflict resolution; do not silently discard saved participation or move goods.

## Later warehouse-address changes

Warehouse address maintenance must not rewrite saved Shipment geography, movement history or reference identities.

At route save, readiness confirmation and dispatch, validate the proposed/saved geography against the currently referenced warehouse locations. A changed or cleared warehouse city that makes the route incompatible blocks that operation with an actionable reason. Resolve the warehouse address or Shipment route explicitly through its authorized operation; do not silently synchronize them.

Perform authoritative checks as part of the operation so stale client data or concurrent warehouse changes cannot permit a mismatched save, confirmation or dispatch. Rejected operations leave Shipment state and related records unchanged.

FRO-344 owns route-edit authorization, audit, concurrency, dependent-document checks and material-change readiness invalidation. Reuse its contract; no second route editor or readiness mechanism is introduced. This ticket does not authorize rewriting issued delivery notes or historical routes.

## API and persistence contract

Apply the same requiredness and compatibility rules to GraphQL, REST and MCP creation through shared validation. Extend the dedicated FRO-324 historical operation and FRO-344 route operations with the corresponding rules; do not add a generic status bypass.

Persist accepted geography atomically with the Shipment and its related creation effects. Invalid/missing references, city-country mismatch, incompatible warehouse or authorization/concurrency failure must create no Shipment, split, reservation or other partial operation effect. Preserve owning operations' retry/idempotency and authorization rules.

Return geography IDs, names and nullable components consistently through `shipmentById` and corresponding REST/MCP Shipment detail/summary contracts. MCP has a separate summary mapping and must be updated explicitly. Preserve existing read permissions and record scope. Missing geography must remain readable without guessed display values.

Synchronize persistence, API schemas, mappings, client types and generated reference documentation. Provide field-specific validation feedback usable in English and Greek through the existing UI owners.

## UI ownership and dependencies

This is a structural ticket with no independent UI implementation or preview.

* [FRO-341 — Shipment Creation](https://linear.app/front-line-ltd/issue/FRO-341) owns selectors, labels, placement, draft feedback and Creation review.
* [FRO-316 — Shipment Details](https://linear.app/front-line-ltd/issue/FRO-316) owns saved geography display and the presentation of FRO-344 editing.
* FRO-339 blocks both FRO-341 and FRO-316. Design can proceed independently; released geography UI requires these contracts.

Use FRO-341's existing [Shipment creation preview](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site/) as a visual reference. Its annotations are review aids, not production requirements or evidence of deployed support. Reuse the owning tickets' current layouts and EN/EL behavior; no wizard or additional screen is required here.

## Decisions

| Decision | Reason |
| -- | -- |
| Reuse Country/City references. | Consistent route vocabulary and verifiable city-country relationships. |
| Require complete planned routes; permit unknown historical origin only through FRO-324. | Distinguishes a new operational plan from incomplete historical evidence. |
| Keep missing stored values without automatic backfill. | Orders and current warehouse addresses are not evidence of an unrecorded historical route. |
| Require explicit completion of incomplete pre-dispatch routes before route save, readiness confirmation or dispatch. | Existing records must not bypass the route requirements; unrelated Notes/files remain available. |
| Preserve Shipment geography after warehouse-address changes and revalidate before operational progression. | Avoids silently rewriting recorded facts while preventing incompatible planned movements. |
| Keep presentation in FRO-316/FRO-341 and editing lifecycle in FRO-344. | One owner for each contract without duplicate UI or readiness logic. |

## Acceptance criteria

1. Valid normal creation persists all four references and returns their IDs/names consistently through GraphQL, REST and MCP; every purpose/mode retains its existing destination rules.
2. Each creation adapter rejects missing/invalid references, city-country mismatches and incompatible/unknown-location warehouses without partial effects.
3. Historical recording supports unknown origin, country-only origin, city-resolved country and fully known compatible origin; explicit mismatches fail. Destination remains complete and warehouse-compatible. Normal creation cannot use these exceptions.
4. Existing missing values remain readable as absent. Existing incomplete pre-dispatch Shipments require explicit completion before route save, readiness confirmation or dispatch; unrelated permitted Notes/attachments remain usable.
5. Origin/destination warehouse choices and dependency resets follow the geography-first rules. Agent/vessel destinations retain their own rules without registered-address filtering.
6. A later warehouse-city change/clear does not rewrite Shipment geography. Incompatibility blocks route save, readiness confirmation and dispatch, including stale/concurrent cases, without partial state changes.
7. Authorized FRO-344 route corrections retain its audit, readiness and dependent-document safeguards. No post-dispatch or historical correction is introduced.
8. FRO-341/FRO-316 consume canonical IDs/names/unknown values and actionable EN/EL errors, preserving unrelated drafts and current presentation ownership.

## Context for agents

Live repository `Frontline-Forwarding/frontline-forwarding`, checked at `3820e89e8caa341261e2d48bcb282d93e1bb1d03` on 21 October 2026. This is source evidence, not deployed-version verification.

Backend Java paths below are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Implementation context |
| -- | -- |
| `domain/shipments/Shipment.java`; `web/shipments/input/ShipmentCreateInput.java`; `docs/reference/database.md` | Shipment model/input and `freight_shipment` currently lack the four references. Add compatible nullable persistence and operation-specific validation. |
| `domain/purchaseorders/PurchaseOrderRoute.java` | Uses the same four reference names; this does not authorize copying Order geography into Shipments. |
| `domain/locations/LocationRepository.java`; `docs/reference/database.md` | Country/city lookup exists; `city.country_id` identifies a city's country. |
| `domain/warehouses/FreightWarehouse.java`; `docs/workflows/company-and-warehouse-addresses.md` | Warehouse has nullable, editable `cityId`; country derives through city. Match `freight_warehouse.city_id` → `city.country_id`, not a nonexistent warehouse country field. |
| `web/shipments/ShipmentsGraphQlApi.java`, `ShipmentsRestApi.java`, `ShipmentMcpTools.java`; `web/shipments/service/ShipmentsApiService.java` | GraphQL creation, REST POST `/api/v1/shipments` and MCP `frontline_create_shipment` share creation service/validation. Current dispatch has no geography guard. |
| `web/shipments/output/ShipmentMcpSummaryOutput.java`; `ShipmentMcpTools.summary()` | MCP summary is mapped separately; extending another output does not update it. |
| `frontline-forwarding-app/src/main/resources/graphql/shipments.graphqls` and `locations.graphqls` | Shipment create/read and country/city lookup contracts. General route editing is future FRO-344 work, not an existing mutation. |
| `frontline-forwarding-client/src/features/shipments/components/shipment-composer.tsx` | Existing composer integration; FRO-341 owns replacement presentation. |

## Post-deployment verification

Use read-only checks and review automated/nonproduction evidence; never create or modify production Shipments for verification.

| AC | Read-only check |
| -- | -- |
| 1 | Read a post-release Shipment through GraphQL, REST and MCP; compare all four IDs/names and purpose-specific destination against its recorded route. Review all-purpose/mode creation test results. |
| 2 | Review negative-test results for each adapter: missing/nonexistent references, city-country mismatch, unknown/incompatible warehouse and no partial persistence. |
| 3 | Inspect historical fixture responses and test evidence for each origin combination, explicit mismatches, complete destination and rejection of incomplete normal creation. |
| 4 | Read legacy fixtures with missing values. Review results showing completion required for pre-dispatch progression while permitted Notes/files remain usable. |
| 5 | Open creation without submitting; inspect filtering, disabled/no-match states and draft resets. Review nonproduction historical-match reset and agent/vessel-route results. |
| 6 | Compare stored route/audit evidence before and after warehouse-city change/clear fixtures. Review blocked progression and concurrent-change tests; saved geography/history must remain unchanged. |
| 7 | Review FRO-344 correction/audit/readiness evidence and post-dispatch/historical rejection results. Confirm dependent fiscal-document safeguards remain enforced. |
| 8 | Open creation/details in EN/EL; compare saved names/unknown values with API results and check draft retention and actionable errors using nonproduction evidence. |

**Out of scope:** new UI/mockups/previews; new location reference data or warehouse-maintenance functionality; route filters; guessed historical backfill; post-dispatch/historical geography correction; independent editing/readiness mechanisms; changes to Order geography, customs or delivery-note fiscal rules.

**Reference:** repository sources above; FRO-324 historical recording; FRO-344 pre-dispatch editing; FRO-316/FRO-341 presentation.

