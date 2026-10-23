# FRO-324 review — 23 October 2026

Review checkpoint, not an approved replacement specification. Linear remains unchanged.

## Workflow

- 0 Preflight complete: planning git pull --ff-only succeeded; gh account frontlineltdproject-star and live production contents verified; full Linear issue, comments (none), labels and statuses read.
- 1 Grill: evidence gathered using grilling/domain-modeling; first decision round pending. Focused read-only research delegated per grilling.
- 2 Canvas / 2b Preview skipped: FRO-341 creation and FRO-316 Details already own presentation. No additional UI identified.
- 3 Spec check: impact trace below; open outcomes must be resolved before final specification.
- 4 Ticket: pending decisions, complete draft display and explicit approval. No Linear writes.
- 4e UI branch skipped by explicit user instruction; no production changes.
- 5 Memory: checkpoint recorded. No new resolved vocabulary or qualifying ADR.
- 6 Verify: source/board review only; no implementation/deployment verification claimed.

## Evidence and preservation

Target: FRO-324, Shipment Create Page — record an already-arrived warehouse shipment; updatedAt 2026-10-23T13:06:53.395Z; Todo; Pending_Review, Backend, Story, Shipment; No priority; Pre-releases 0.0.x / milestone 0.0.8. Blocks316/341; related320/323/343/339/325; no blockers. Four attachments (two A/B previews and two screenshots) and no documents. Preserve metadata and attachments unless separately authorized.

Fetched current316/341/339/345/343/325/342/323/303. Linked341 and316 own historical input/display contracts. 341 targets0.0.9 whereas324 targets0.0.8; backend preparation can precede activation, but compatible readers and creation UI must be coordinated. Existing345 explicitly confirms mock Shipment population; this does not authorize data deletion or remove future historical-arrival requirements.

Live production source read through gh, pinned for detailed consumer checks to main5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Repository evidence is not deployment evidence. Optional Linear get_agent_context returned tool-not-found; direct reads worked. Production root/app guidance was read remotely. Its local playbook loader requires a checkout and writes .git task snapshots; no production checkout was modified/run for this remote planning review, so no loaded-policy fingerprint is claimed.

Source paths below are relative to Frontline-Forwarding/frontline-forwarding; Java paths abbreviated from frontline-forwarding-app/src/main/java/com/frontline/forwarding/.

## Consumer impact and gaps

| Consumer / affected area | Current behavior and source | Required outcome / gap | Owner |
| -- | -- | -- | -- |
| Historical persistence | docs/reference/database.md and V1 baseline require Shipment origin/mode, ARRIVED dispatch/arrival/document; participation requires source stay; active allocations depend on null movement_closed_at. | Dedicated historical provenance and explicit completion must permit unknown occurrence facts without weakening normal lifecycle guards or inserting fake times/source stays. Ticket already recognizes much of this; extend all related constraints/readers explicitly. |324 with325 participation integration |
| Newly registered Order | web/purchaseorders/service/PurchaseOrdersApiService.create creates an EXPECTED opening stay; one active stay is enforced. | Define reuse of same-destination expectation and outcome when opening expectation names another warehouse. No fake departure/location-unknown merely to free active-stay uniqueness. |324; decision Q2 |
| Stock confirmation | PurchaseOrdersApiService.confirmInStock requires inbound AT_WAREHOUSE and nonnull arrivedAt. | Unknown historical arrival must not make stock confirmation permanently unavailable or cause it to fabricate arrival. Preserve explicit stock-confirmation date/measurements/authority. |324 compatibility; Q1 |
| Existing arrival linking | Warehouse-stay identity/inbound_shipment_id and known stock/arrival values are guarded against updates; destination matching currently requires inbound shipment identity. | Exact stay/colli provenance, no earlier different Shipment ownership or duplicate physical arrival; narrow audited link mechanism rather than ordinary overwrite. Missing supplied dates preserve known evidence. Define multiple matched-date consistency and same-date different precision. |324; Q3 |
| Candidate lookup/save | ShipmentsApiService eligiblePurchaseOrders uses outgoing origin/stock rules; create locks current membership and allocation. | Dedicated receiving-warehouse lookup, complete current nonterminal identity set, match/conflict reasons, authoritative revalidation of review evidence against stock/split/disposition/arrival/reservation races. Returned conflicts must not leak unauthorized references. |324 |
| Detail/list/API reads | web/shipments/service/ShipmentOutputAssembler requires an origin and calls mode().name(); graphql/shipments.graphqls makes mode/origin and loadedAt nonnull; MCP summary is separate. PurchaseOrderOutputAssembler.journeyShipment also dereferences mode; lastKnownWarehouseStay considers only stays with nonnull arrivedAt. | Schema/API/client nullability and date precision must work in lists, Details, MCP, Order journey/participation, summaries and filters, not only creation. A physically known warehouse must remain visible despite unknown arrival date. Unknown dates never sort/filter as recordedAt. No fabricated packing or dispatch DG snapshot from today's values. |324 structural;316/341 presentation;345 activity |
| Transport reference | domain/shipments/ShipmentRepository compares number across Shipments independently of type; canonical number supports search. | Untyped historical reference must retain same canonical uniqueness/search coverage and concurrent protection; no parallel unvalidated text field or invented mode/type. |324;325 existing document contract |
| Retry / operation history | ShipmentsApiService generates fresh UUIDs inside each create/arrival invocation;345 requires root operation correlation and stable retry identity. | Caller-stable attempt and canonical result recovery, reject changed-payload key reuse; one historical creation→ARRIVED event/operation, no synthetic lifecycle. Duplicate movement protection also needed across different attempt keys. |324 command integration;345 history |
| Pending uploads |341 historical section promises pending-file association;342 explicitly excludes historical-arrival integration and preserves PREPARING. | Ownership conflict: decide whether324 extends342 association atomically to historical effects or defer this capability explicitly. Preserve pending files on failure and avoid partial arrival/attachment success if enabled. |324/342 integration; Q4 |
| Inline Order |343 save boundary and historical workflow coverage remain unresolved. | Standalone saved Orders may be used;324 must not settle343's unresolved transaction/initial-state choices. Independently saved Orders surviving failure is distinct from inline behavior. |343;324 preserves boundary |
| Fiscal documents | web/deliverynotes/service/DeliveryNoteDraftSourceService derives goods from current membership without historical-state guard; DeliveryNotesApiService.originAddress assumes known origin.303 points to shared Greek Frontline origin eligibility. | Historical entry cannot implicitly generate fiscal documents. Resolve whether later preparation is excluded for these records or requires separately owned historical policy, and return actionable ineligibility rather than dereference unknown origin. |324 guard/integration + fiscal owner; Q5 |
| Subsequent selection |323 reads ARRIVED warehouse sources using historical identities and current IN_STOCK availability; source shortcut itself unavailable in historical mode. | A recorded historical Shipment can later be a source only under323's normal current-stock conditions; completed historical links must not count as reservations. Preserve stable attribution after later splits. |324 data compatibility;323 selection |
| Existing data / activation |345 confirms current data mock-only;324 older context predates live source. | Preserve known facts; no guessed data backfill/reset or classification of ordinary arrivals as historical. Add fixtures for all affected consumers; coordinate activation across milestone gap. |324 and linked contract owners |
| UI text |324 says341 supersedes old A/B references but still commands header dropdown/conditional date card;341 uses approach B with always-visible disabled Preparing dates. | Replace stale prescriptive UI text with one authoritative316/341 reference; preserve attached historical references as nonbinding. No new UI. |324 text cleanup |

## First decision round — recommendations only

1. Unknown arrival date and stock confirmation: allow normal authorized stock confirmation of a proven historical arrival while arrival date remains unknown; record only actual stock-confirmation facts. No invented arrival time.
2. Initial EXPECTED stay: reuse it when it matches destination; for a different opening warehouse reject with an actionable explanation in this version. Do not silently move/cancel the expectation or fabricate physical history. A more permissive audited reassignment would need explicit scope.
3. Multiple matched arrivals: reject a combined Shipment if known matched arrival dates contradict one shared arrival; preserve exact existing timestamps and compare date-only evidence using an explicitly defined calendar/timezone rule. Never silently choose a date or erase known precision. Exact comparison/timezone details remain to resolve.
4. Optional files: extend the historical command to consume342 pending-upload contracts atomically, with324 owning historical integration and342 owning generic upload lifecycle. This reconciles341's existing promise; no new UI.
5. Delivery notes: historical entry creates no fiscal note and does not offer later retroactive preparation/issuance under this feature. Preserve independent attachments/history; any historical fiscal operation needs its own explicit contract. Subject to decision and fiscal-owner reconciliation.

Do not treat these recommendations as accepted. After answers, resolve remaining dependent date/matching/eligibility questions, draft a standalone final ticket with complete metadata and acceptance-mapped read-only verification, show before/after outside its body, and request explicit Linear approval.
