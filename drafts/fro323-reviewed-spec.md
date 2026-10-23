**Select eligible collis from arrived Shipments during Preparing creation**, alongside direct Order selection, using one shared selection and the existing atomic creation model.

**Order = Purchase Order = stock-list item. Colli = permanently identified handling unit.** A source Shipment is historical evidence of carried goods, not the owner of their current availability. The new Shipment has its own route, purpose, mode, document and packing.

## Scope and ownership

| Owner | Responsibility |
| -- | -- |
| FRO-323 | Authorized source lookup, historical identities, current attribution, origin availability, complete current-Order selection context and stale-review detection for this shortcut. |
| FRO-325 | Exact participation, child-Order decisions, atomic creation/reservations, packing, readiness and lifecycle. Integrate stale-review validation into this shared creation boundary. |
| FRO-341 | Creation UI, source/direct selection, exclusions, partial decisions, renewed review, EN/EL and responsive behavior. |
| FRO-324 | Historical Arrived recording and completed historical participation, which this lookup can consume. |
| FRO-316 | Ordinary saved Shipment Details; no additional source-selection UI or blocker is introduced. |

No UI implementation, preview change or production branch is included. The shortcut is unavailable inside historical Arrived recording. No persisted parent-Shipment relationship, second allocation mechanism or new lifecycle status is introduced.

## Source lookup and read contract

| Data / capability | Type / rule |
| -- | -- |
| Origin | Required warehouse reference. Return only authorized ARRIVED warehouse-bound Shipments whose destination warehouse equals this origin. |
| Search and pagination | String search by Shipment number or transport-document number, including AWB/CMR/B/L or an untyped historical reference. Preserve trimmed, case-insensitive substring matching and deterministic pagination. All matching results remain reachable. |
| Historical summary | Shipment identifier, historical route, nullable document type/number and known actual arrival date/precision. Preserve missing values; never substitute recording time, current geography or an invented document type. |
| Historical contents | Distinct permanent colli IDs actually carried, including loose and repacked contents and closed movement records. Load units are not additional collis. Preserve loading-time Order attribution separately. |
| Current attribution | Current Order identifier and owner reference, Client and Vessel under existing authorization. Resolve from current membership, not loading-time ownership. |
| Origin availability | Boolean eligibility plus stable machine-readable exclusion information and readable reasons; current known location/state and authorized conflict references where applicable. Distinguish unknown facts and lookup failure from confirmed ineligibility. |
| Complete Order context | Complete current nonterminal membership, or equivalent complete paginated/batched context, sufficient to identify selected and remaining identities and full/partial selection for every affected current Order. Include goods outside the source without selecting them. |
| Counts | Available and total distinct colli counts over each complete historical source, independent of content pagination and cross-source deduplication. Do not present partial or unresolved results as authoritative complete counts. |

Historical sources created under FRO-324 are included once their current goods satisfy normal stock and eligibility rules. Unknown origin, mode or occurrence dates do not alone exclude an otherwise qualifying source. Completed historical participation is not an active reservation. Do not reconstruct missing historical identities by expanding an old Order into its current contents.

Resolve contents, current attribution, availability and Order context efficiently in batches; do not require a per-Order request waterfall or rely on the direct selector's first results page.

## Availability and combined selection

An available colli must currently belong to an **IN_STOCK** Order with an active **IN_STOCK** stay at the selected origin, be nonterminal and unallocated, and satisfy existing Order-wide creation restrictions. An active allocation affecting another current member of the same Order can exclude the Order; checking only the selected identity is insufficient.

Return actionable exclusions for departed goods, another warehouse, awaiting stock confirmation, reservations, terminal disposition and other existing restrictions. Preserve unknown location as unknown. When several restrictions apply, return consistent reason information without implying that resolving one necessarily restores eligibility. Protected references must not leak through reasons or counts.

**Available / total describes origin availability.** It does not change merely because goods are selected or because purpose/destination changes. Validate the combined selection's route compatibility separately. Direct delivery on board requires the existing single common non-null vessel across participating current Orders. A route conflict blocks creation, identifies the conflict and preserves selections for correction; no silent removal or vessel choice.

| Selection operation | Required result |
| -- | -- |
| Add from source or source Order-group | Add only its eligible historical identities, across its complete relevant contents rather than only a loaded page. |
| Add direct Orders / other sources | Union all selected permanent IDs. The same colli appears once in the global selection even when present in several sources. |
| Remove one colli | Remove it from the shared set and reflect that removal across every view. |
| Full/partial evaluation | Compare the union against each current Order's complete nonterminal set, not one source, search result or displayed page. Terminal collis remain on their Order and do not make selection partial. |
| Partial IN_STOCK Order | Require FRO-325's explicit valid child-Order decision. Do not silently include remaining goods. Explicit Include remaining collis uses current authorized eligible contents. |
| Union becomes complete | Use the existing Order without a child; remove obsolete partial decisions from the submission. |
| Search, pagination, expansion, language or source-tab change | Preserve selections and valid decisions; no automatic selection or reselection on refresh. |
| Origin cleared or changed | Clear dependent selections, partial decisions and packing assignments; reload origin-scoped sources and preserve unrelated draft fields. |

Direct upcoming-Order selection retains its existing eligibility and whole-Order rules. Choosing a source copies only identities: no route, purpose, mode, document, dates, handover, pallet or box arrangement.

## Review, authorization and failure handling

Selection is draft state and creates no reservation. Before confirmation, refresh current membership, complete Order scope and availability. Retain selected permanent IDs and unrelated draft data when facts change, flag affected goods, and require renewed review of changed attribution or full/partial child-Order outcomes. Never silently accept a different split or reassigned Order.

Protect the reviewed attribution and membership scope at server creation, not only changes occurring after the command starts. Use an explicit reviewed-state/version or equivalent concurrency contract. Recheck eligibility, route, authorization, reservations and partial decisions transactionally. Stale, invalid or losing concurrent operations create no partial Shipment, child split, allocation or associated effects and never silently reduce contents. Return affected colli/Order identities and safe actionable conflicts. FRO-325 remains the shared creation owner; no duplicate command path.

Reuse internal Frontline/system-administrator identity restrictions and existing SHIPMENT_VIEW protection for Shipment history, plus SHIPMENT_CREATE for creation eligibility/commands. Preserve record/organization checks; this does not grant partner access to mixed-Order Shipments. Recheck authorization on subsequent pages, refresh and submission.

Distinguish no source matches, zero availability, unresolved availability and lookup failure. A source error preserves the draft and independent direct-Order capability. Retained unresolved source selections cannot be treated as freshly validated; staff can retry or explicitly revise them.

Onward creation leaves source ARRIVED status, historical attribution, route, document, contents and movement facts unchanged. Existing packing, readiness, child lineage, stock confirmation and later movement behavior remain under their owners.

## UI reference and release

FRO-341's [creation preview](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site/) and current specification own the complete presentation. Returned arrival/location/previous-Order facts do not mandate extra visible fields: retain its agreed omitted arrival summary, previous-Order subtitles and warehouse subtitles.

Retain the [older source-selection preview](https://fro-323-996a85.pages.dev/) and existing attachment as nonbinding fictional-data references. Pages project: `fro-323-996a85`. No screenshots or new design are required.

Backend preparation may precede UI delivery. Activate the shortcut only with compatible FRO-341 and required FRO-325/FRO-324 contracts and verified integration. Preserve milestones; FRO-323 continues to block FRO-341. Do not assume milestone order proves dependency availability.

## Decisions

| Decision | Reason |
| -- | -- |
| Arrived sources to the selected origin; current eligibility | Supports consolidation without treating past presence as current stock. |
| Permanent identities and one shared selection | Preserves history through splits and prevents duplicate participation. |
| Complete current-Order context; explicit partial decisions | Prevents an incomplete source view from incorrectly appearing to select a whole Order. |
| Renew review after attribution or membership-scope changes | Staff must approve the actual participating Orders and child outcomes. |
| Origin-availability counts with separate route validation | Keeps stock availability meaningful without hiding cross-Order route conflicts. |
| Coordinated activation with existing redesign | Makes the capability usable without a duplicate UI. |

## Acceptance criteria

1. Authorized paginated search returns only qualifying arrived warehouse sources, including compatible FRO-324 historical records and nullable facts.
2. Historical identities include loose/repacked and closed participation without duplicates, current-Order expansion or fabricated history.
3. Availability and complete-source counts apply current stock, terminal and Order-wide allocation restrictions; unresolved/error results cannot grant eligibility.
4. Source/direct selections deduplicate globally; full/partial evaluation includes complete current nonterminal Order contents outside source/pages, with valid explicit split outcomes.
5. Origin counts remain distinct from combined-route validity; incompatible direct-vessel selections block creation without silent selection changes.
6. Draft navigation retains selection; origin reset clears dependent state. Changed attribution or membership scope requires renewed review, enforced server-side through creation.
7. Unauthorized, stale and conflicting creation leaves no partial effects and returns identifiable safe conflicts. Direct selection remains independently usable after source lookup failure.
8. Sources and unrelated lifecycle/packing behavior remain unchanged; historical creation itself has no shortcut.
9. Compatible UI/structural contracts, documented read/error/concurrency contracts and regression checks are present before activation.

## Out of scope

UI or hosted-preview implementation; historical Arrived selection; new Shipment hierarchy/statuses; Case/merida, accounting and Buy/Sell; changes to splitting policy, packing, readiness, dispatch or arrival; Shipment-details redesign; production repository branches.

## Context for agents

Production source inspected through authenticated gh at main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`, 23 October 2026. This is source evidence, not deployed verification. Load current repository guidance before implementation.

Backend paths below are relative to `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Relevant fact |
| -- | -- |
| `web/shipments/service/ShipmentsApiService.java` | Transactional creation resolves/locks all current memberships; checks Order-wide allocations, complete nonterminal selection, partial decisions and common-vessel constraints. Current within-command checks alone do not protect the earlier user-reviewed attribution. |
| `domain/shipments/ShipmentLoadUnitContentRepository.java`; `web/shipments/service/ShipmentOutputAssembler.java` | Historical source reads include closed content; active allocations filter movement closure. Detail attribution is loading-time ownership; loose and packed identities share the content model. |
| `domain/shipments/ShipmentRepository.java`; `ShipmentAuthorizationService.java` | Destination filtering, Shipment/document substring search and stable pagination; internal identity plus action authority. |
| `domain/purchaseorders/HandlingUnitMembershipRepository.java`; `PurchaseOrderWarehouseStayRepository.java` | Current membership and active stay resolution; unknown/departed stays are not available stock. |
| `frontline-forwarding-client/src/features/shipments/components/shipment-composer.tsx` | Full/partial calculations depend on candidate completeness; origin change resets selection/assignments/partial decisions. |
| `frontline-forwarding-client/src/features/shipments/services/shipment-service.ts`; `graphql/shipments.graphql` within that feature | Existing list helper omits destination filters; direct candidates request page 0, size 100. Existing reads do not provide this complete source/current-Order availability contract. |
| `docs/reference/database.md`; `docs/reference/graphql-api.md`; `docs/workflows/shipment-lifecycle.md`; `purchase-order-colli-journey.md` in that workflows directory | Content/loading attribution, current membership, stays, terminal records and established movement/selection invariants. |

Update owning API/schema and curated documentation and regenerate affected references/client contracts. Preserve compatible existing consumers; do not infer implementation from a preview.

## Post-deployment verification

Use authorized existing production records read-only; exercise writes, retries and concurrency only in nonproduction. Missing examples remain unverified.

| AC | Read-only check |
| -- | -- |
| 1–2 | Query source search/pages at an origin and compare returned identities with saved arrived history, including closed loose/repacked participation and historical records with unknown dates. |
| 3 | Compare complete-source counts and returned exclusions against current Order memberships, stays, terminal facts and reservations. |
| 4–5 | Inspect tests for cross-page/source union, outside-source remainder, terminal exclusion, explicit Include remaining and incompatible vessel selections; compare saved participation where normal operational examples exist. |
| 6–7 | Inspect stale reviewed-membership, refreshed partial scope, permission denial, conflict rollback and lookup-failure/draft-retention evidence. Verify the deployed reviewed-state and actionable-error contracts read-only. |
| 8 | Compare source history and resulting ordinary Shipment records; inspect regression evidence for direct upcoming selection, historical creation and existing lifecycle/packing. |
| 9 | Inspect deployed schemas/references and integration/release evidence for compatible FRO-341 and structural owners. UI checks belong to FRO-341. |

**Reference:** production sources above; FRO-325 creation integrity; FRO-324 historical arrivals; FRO-341 creation presentation; FRO-316 saved Details; retained source-selection preview.
