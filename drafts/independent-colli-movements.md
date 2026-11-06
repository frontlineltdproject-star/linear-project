Defines **independent colli custody and movements within one Order**. Collis belonging to the same commercial Order can arrive separately, occupy different warehouses and travel on different Shipments. Ordinary operations may select the whole eligible Order; partial operations name the exact collis they affect.

**Order = purchase order = stock-list item. Colli = permanently identified handling unit.** Each Order and colli retains its permanent identity. Automatic child creation solely for partial physical movement ends when this model is activated.

## Fields and relationships

The following is the required logical contract. Implement persistence and read models consistently without duplicating independent sources of physical truth.

| Entity / field | Type | Required behavior |
| -- | -- | -- |
| Order commercial identity | Existing IDs and references | One Order retains its collis across separate movements. Existing child Orders retain their identities, lineage and history. |
| Order supplier readiness | Existing readiness state, date and remark | Shared across the Order. Retain supplier-readiness validation, correction and reminder rules. Physical progress of some collis must not overwrite the shared readiness evidence or reset their siblings. |
| Colli physical position and progress | Derived state, nullable stay/movement references | Resolve each colli from its actual custody, reservations, movements and terminal history. Distinguish expected presence, arrival, stock confirmation, transit, final handover and unknown location. |
| Warehouse stay coverage | Stay reference plus explicit colli identities | Record exactly which collis the stay covers. Arrival, stock, departure, position and uncertainty facts must be independently representable when collis diverge. Multiple current stays may belong to one Order; a colli has at most one current physical custody location. |
| Stay facts | Existing warehouse reference, state, occurrence dates, position and inbound Shipment reference | Keep expected/inbound location distinct from occupied custody. Separate records or coverage-level facts must support different stock dates and departures within an initially shared receipt. Preserve unknown historical dates. |
| Shipment contents | Existing Shipment, colli and Order-at-loading references | One Shipment selects exact collis. Different subsets of one Order can participate in concurrent Shipments. Each colli has at most one open movement allocation. Preserve loading-time attribution and closed history. |
| Shipment participation custody | Source/destination stay references scoped to participating collis | Support selected collis from several receipt stays at the same origin warehouse. Remove the assumption that one participating Order implies one source or destination stay. |
| Transport document | Existing Shipment-owned reference | AWB and other transport-document numbers belong to the carrying Shipment. Return relevant references through colli movement history. |
| Order physical summary | Derived state/warehouse groups with integer counts and colli references | Return the actual breakdown and a common state only when applicable. Expose mixed progress explicitly. Return matched-scope counts separately from overall Order counts. |

## Physical operations

| Operation | Required behavior |
| -- | -- |
| Initial registration / inline creation | Preserve FRO-343's independent Order save and permanent colli identities before Shipment save. Zero-colli Orders remain valid registrations and cannot supply Shipment contents. Initial registration alone records no physical arrival or stock confirmation. |
| Expected warehouse | Use the Order's opening expectation for initial planning. Any later correction of expected location must identify affected collis, validate reservations and record history. It cannot establish physical presence or move sibling collis. |
| Normal Shipment creation | Reserve the reviewed eligible identities only. Partial selection creates participation under their existing Order. Apply origin, route, purpose, vessel, authority and chronology checks to the actual selection. |
| Planning before receipt | Allow selected identified collis under the shared supplier-readiness rules and a matching expected origin. Preserve existing readiness-date eligibility. Unselected siblings remain independently available. |
| Arrival / historical arrival | Record or match the exact received identities and receiving stays. Adapt FRO-324's compatibility, occurrence-versus-recording-time and completed historical participation rules to subsets. Conflicting evidence rejects the operation. |
| Stock confirmation | Confirm only the selected received collis, with applicable measurements, position, dates and permissions. Arrival and stock confirmation remain distinct operations. |
| Shipment readiness / dispatch | Every selected colli must be stock-confirmed at the origin, correctly reserved and physically packed under FRO-325. Use the saved transport document and existing dispatch prerequisites. Unselected siblings cannot block departure merely because their physical stage differs. |
| Pre-dispatch membership edits | Atomically add/release exact identities, reconcile packing and dependent drafts, and invalidate readiness under FRO-344. A partial reduction creates no movement-driven child Order. |
| Cancellation | Release only this Shipment's allocations. Resolve each affected colli from its current custody/readiness facts. Other Shipments, sibling collis and recorded receipts remain independently valid. |
| Onward arrival, handover or lost location | Apply the established destination-specific operation to the participating collis only. Preserve last-known custody and history when location becomes unknown. |
| Colli editing / terminal disposition | Evaluate the affected colli's stage, allocation and document constraints. An open movement of a sibling cannot alone prohibit an otherwise eligible edit. Terminal goods remain traceable and are excluded from movement eligibility. |

Whole-Order actions resolve an explicit reviewed set and use the same subset operations. Revalidate that set under lock; stale membership or a conflicting reservation must reject rather than silently change the operation's scope. Apply the contract across GraphQL, REST and MCP. Successful retries return the same result without duplicate identities, receipts, reservations or history.

## Order summaries, filtering and output

Return per-colli physical facts alongside shared Order information. A single summary status cannot authorize an operation on all collis. Retain zero-colli readiness behavior and distinguish terminal goods from movable goods in counts.

Status and warehouse filters match the relevant collis. Multiple physical filters must match the same colli, rather than different siblings. A warehouse grouping may include the same Order in several groups; overall Order counts and the ordinary ungrouped list deduplicate by Order ID. Actual stock excludes expected and in-transit goods.

For an Order with one colli in stock in Osaka, one in stock in Seoul and one travelling to Osaka, return two in stock and one in transit overall. The Osaka stock scope contains one of the three collis. The stock-list PDF/export data must identify the represented subset, quantities, weights, warehouse/position and relevant Shipment documents. Avoid presenting one arbitrary warehouse or AWB as covering the complete Order. Scope summaries and counts to authorized records.

## Customs and document coverage

Customs regime and registration/ΑΛΚ remain shared across the Order under FRO-356. Validate affected receiving warehouses and all relevant occupied custody when correcting shared customs facts. Different customs arrangements, or batches requiring separate Customs Storage Entries, require deliberately separate Orders. Preserve FRO-319's actual admission coverage and invoice/Export safeguards; later receipt must not silently expand an earlier Entry. Support the necessary deliberate separation before the incompatible admission, with existing lineage, reservation and document protections.

Delivery-note goods and quantities must come from the Shipment's selected collis grouped by their Order. Each Shipment containing a subset must exclude sibling goods travelling elsewhere. Preserve issued documents and fiscal conflict/reconciliation rules.

Integrate FRO-301 allocation with one Order participating through several subsets. Known rows follow their colli; confirmed-group rows qualify only for supported goods under its allocation rules. Unknown allocations require the existing confirmation rules. Preserve source-row identity, whole-row allocation, correction audit and per-currency reconciliation. Physical movement alone must not copy the Order's full values into each Shipment. FRO-244 consumes eligible rows for its actual Shipment coverage and retains finalization safeguards.

Shared commercial-field edits retain their owning validation and document-impact rules. Evaluate impacts across affected Shipments and documents when more than one participation exists.

## Ownership and activation

This ticket owns the structural model, lifecycle adaptation, shared-service validation, summaries, filters, document data-source corrections and supported API contracts.

| Existing owner | Required integration |
| -- | -- |
| FRO-325 / FRO-344 | Apply subset custody, reservations, release and lifecycle rules to creation and membership editing. Retain packing/readiness and fiscal reconciliation contracts. |
| FRO-324 / FRO-343 / FRO-323 | Historical subset receipts, inline creation and onward selection use permanent identities and current colli eligibility. |
| FRO-301 / FRO-244 | Adapt allocation and invoice consumers to several subsets under one Order. |
| FRO-356 / FRO-319 / FRO-355 | Enforce shared customs facts, verified admission coverage and explicit separate-Order boundaries. |
| FRO-326 / FRO-316 / FRO-341 | Consume summaries, exact selection and action eligibility in separately delivered presentation work. |
| FRO-302 | Its automatic movement-child behavior conflicts with this model. Resolve that ticket's disposition during planning; this specification creates no such children after activation. |

Activate only when supported callers and affected document consumers use compatible contracts. Update generated API/reference documentation and provide a verified compatibility or coordinated migration path for old clients. Existing child Orders, identified by the business as mock data, retain their current identities and historical relationships. Populate custody coverage from supported historical evidence; ambiguous mappings require explicit resolution before activation. Migration must not invent shipment participation, occurrence dates or customs admission.

## Decisions and scope

* Complete physical movement scope avoids different inbound and outbound ownership rules.
* Shared supplier readiness and customs facts keep ordinary Order work familiar; explicit exceptions expose the affected collis.
* Independent edits allow staff to work with remaining goods while siblings travel.
* Preserve existing child Orders to retain coherent history.
* UI design/implementation, previews, mock branches, per-colli supplier-readiness workflows and mixed customs arrangements within one Order are outside this structural delivery. Separate Entries use separate Orders.

## Context for agents

Read-only source baseline checked through gh, main `5774931b9869247f0247013111a452552403f456`. Refresh implementation branches before coding. Linear completion does not establish deployment.

Backend paths below are within `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Implementation context |
| -- | -- |
| `docs/reference/database.md` | `freight_purchase_order_warehouse_stay` has Order-level current-stay uniqueness. `freight_shipment_purchase_order` has Order-level open-movement uniqueness and singular stay references. Contents already link Shipment and colli with per-colli open-allocation protection. |
| `web/shipments/service/ShipmentsApiService.java` | Creation locks whole Order memberships, splits partial stock selections and updates Order-wide custody/status through dispatch, cancellation and arrival. |
| `web/purchaseorders/service/PurchaseOrdersApiService.java` | Whole-Order receipt/stock/status guards and open-participation edit locks require subset handling. |
| `domain/purchaseorders/PurchaseOrderRepository.java`; `web/purchaseorders/service/PurchaseOrderOutputAssembler.java` | Status filtering, inactive classification, warehouse grouping and singular custody reads require mixed-progress support. |
| `web/purchaseorders/service/StockListPdfService.java`; `StockListPdfModelFactory.java` | Current output assumes one warehouse and document reference per Order and sums its current nonterminal collis. |
| `web/deliverynotes/service/DeliveryNoteDraftSourceService.java` | Expands each participating Order to all active nonterminal collis; replace with exact Shipment coverage. |
| `web/purchaseorders/service/PurchaseOrderCustomsService.java` | Shared corrections resolve one active stock stay; assess all relevant occupied custody. |
| `docs/workflows/purchase-order-colli-journey.md`; `docs/workflows/shipment-lifecycle.md` | Existing identity, history, permissions, destination and chronology rules. |

## Acceptance criteria and post-deployment verification

Use existing authorized fixtures and read-only API/document comparisons in production. Exercise mutations, retries, races and migration in a safe test environment.

| Acceptance criterion | Read-only verification |
| -- | -- |
| One Order receives two collis under different AWBs and warehouses; each stock confirmation affects its selected colli. | Read both Shipment contents, custody coverage, dates and Order summary. Compare untouched sibling records. |
| Separate subsets reserve and dispatch concurrently, including planning before receipt; the same colli cannot be allocated twice. | Inspect saved contents and allocation constraints plus competing-command test evidence. |
| Cancel, remove, dispatch, hand over or lose one subset without advancing/releasing another. | Compare per-colli journeys, reservations and last-known custody against operation fixtures. |
| Eligible sibling edits work while travelling/reserved goods remain protected. | Inspect allowed/denied edit tests and audit records for selected identities. |
| Warehouse/status filters, totals and output reflect actual matched goods and distinct Orders. | Query the Osaka/Seoul/transit fixture and compare list groups, overall counts and PDF data. |
| Shipment documents include only their covered goods/eligible invoice rows; customs coverage remains valid. | Compare document quantities and row identities to contents; inspect shared-customs and separate-Entry rejection tests. |
| Existing children/history survive conversion and migration ambiguity is explicit. | Compare IDs, lineage, history and documented migration reconciliation results. |
| All supported interfaces reject stale/unauthorized/conflicting writes atomically and recover retries. | Inspect schema contracts and concurrency/recovery tests; compare recovered IDs and event counts. |

Reference — production sources above; planning ADR 0005; FRO-325, FRO-344, FRO-324, FRO-343, FRO-323, FRO-301, FRO-244, FRO-356, FRO-319, FRO-355, FRO-326, FRO-316, FRO-341 and FRO-302.
