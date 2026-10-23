# FRO-320 workflow review — 2026-10-23

Status: interview complete; full replacement in fro320-reviewed-spec.md awaiting exact-text approval. No Linear write approved.

## Baseline

- Planning `git pull --ff-only` succeeded. Live source read through authenticated gh at `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`; this is repository evidence, not deployed-version verification.
- FRO-320 fetched in full: updated 2026-10-20T11:10:16.059Z; Todo; Ready, Shipment; Chris; no priority; Pre-releases 0.0.x / 0.0.8. Blocks FRO-341; existing related issues and both historical preview attachments must be preserved. No comments.
- Read current FRO-316/341, FRO-339/324/344, current team statuses/labels, glossary and relevant workflow learnings. Linear agent-context endpoint is unavailable; direct issue reads work.
- User excludes production branches and requests no new UI where 316/341 already own it. Canvas, preview and UI branch skipped. No production source/database writes. Production instructions read remotely; no local production checkout/playbook snapshot claimed.

## Findings and before/after review

1. **Conflicting presentation contract.** The introductory override delegates presentation to341, but the body/AC still prescribe expanded option cards, controls beneath options, no Destination details and a vessel explanation. Current341 instead prescribes a Purpose dropdown with adjacent Destination details, disabled derived-vessel presentation and no explanation sentence. Replace obsolete prescriptive text with final behavior and explicit316/341 ownership; retain historical attachments as non-authoritative references.
2. **Incomplete combined-list eligibility.** Both `FRONTLINE_HUB`/`FRONTLINE` and `ASSOCIATED_AGENT_HUB`/`ASSOCIATED_AGENT` are already accepted. Unifying selection must not merge warehouse categories, broaden permitted company types or remove server checks. Specify active warehouse and appropriate active operator, different origin, and339 compatible destination country/city. The current lookup filters warehouse activity only and does not select operator activity; server remains authoritative.
3. **Invalid retained destination.** Current composer origin changes clear contents/packing choices but not destination. Its dropdown excludes the new origin, while client route validation does not explicitly reject equality. Specify what happens when origin/geography/reference refresh invalidates the selection, and test failure/staleness as well as initial choice. Preserve owning contracts for dependent goods resets and unrelated fields.
4. **Incomplete naming consumer scope.** Composer contains literal purpose/guidance/validation text; Shipment list and Details use enum labels. Updating only creation literals can leave inconsistent labels. Decide the human-facing scope; retain `NETWORK_TRANSFER`, stored IDs, APIs, categories and historical facts.
5. **Stock statement needs operation boundaries.** Ordinary warehouse arrival makes the Order AWAITING_IMPORT and stay AT_WAREHOUSE. Confirmation makes the stay IN_STOCK, but the Order becomes IN_STOCK or PREPARED_FOR_SHIPMENT if an open reservation exists (`PurchaseOrdersApiService.java:952–1040`). The unconditional final IN_STOCK statement therefore omits an existing case. FRO324 historical linking explicitly preserves an already-stocked matched arrival;320 must not reset it or create a second stay. Pre-dispatch editing belongs to344, geography to339, historical entry to324.
6. **Release sequencing.** 320 targets0.0.8;316/341 target0.0.9. Preparation and feature activation need separate treatment so an incomplete old UI does not count as delivered behavior.
7. **Verification coverage.** Replace obsolete layout checks with owner integration checks; include both kinds, invalid operator/destination, stale lookup, origin/geography/purpose changes, adapter parity, historic preservation and read-only evidence for stock confirmation. No production mutation tests.

## Consumer impact

| Consumer / area | Current evidence | Proposed outcome | Owner |
| --- | --- | --- | --- |
| Creation/review | `shipment-composer.tsx`: subtype state110, origin reset229, purpose reset282, filter383, route validation1941, title1998 | Combined eligible choices and consistent terms; no subtype or independent layout | 320 rule;341 presentation |
| List and saved Details | `shipment-table.tsx:58`, `shipment-detail.tsx:44` use enumLabel | Naming scope pending; no record conversion | 320 terminology;316 Details layout |
| Warehouse reference lookup | `shipments.graphql:GetShipmentComposerOptions` activeOnly; no operator-active field | Align eligible choices with server and339 geography; reject stale submissions | 320 integration;339 geography |
| Route create adapters | Shared ShipmentsApiService route validation | Preserve purpose/reference/authority contracts and both existing kind/operator pairs | 320 preservation |
| Route edits / historical registration | Current344 and324 contracts | Consume combined warehouse concept without overriding edit or historical rules | 344 /324 |
| Normal arrival / stock | ShipmentsApiService and PurchaseOrdersApiService | Preserve distinct arrival and stock confirmation, stable identity/history | Existing lifecycle;320 regression |
| History/reference categories | Existing NETWORK_TRANSFER and two warehouse kinds | Preserve internal values and records; presentation label scope pending | 320 preservation |
| Release |320 milestone0.0.8 vs316/3410.0.9 | Coordinate activation with compatible consumers | 320 and316/341 |

Backend citation base: `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`. `web/shipments/service/ShipmentsApiService.java:966–997` checks active origin/destination, inequality and exact kind/operator pairs (operator activity986–991); arrival853–963 records separate stay/Order outcomes; dispatch583–665 creates the inbound stay. `web/shipments/service/ShipmentInputValidator.java:153–158` rejects final handover for network transfer. GraphQL/REST/MCP create adapters delegate to the shared service. `domain/warehouses/FreightWarehouseRepository.java:62–66` active lookup filters warehouse activity only. `web/purchaseorders/service/StockListPdfModelFactory.java:57–80,140–150` uses current/last-known stay and generic warehouse labels; no PDF computation change is needed. Existing create/edit/stock authorization remains unchanged. Current dispatch does not call route creation validation; this review does not expand320 into new dispatch-eligibility policy.

## Interview

- Q1 accepted: coordinate activation with compatible316/341; preparation can precede release. No milestone change authorized.
- Q2 accepted: consistent human-facing Warehouse transfer wording across Shipment consumers, including existing records, while retaining internal enum/category contracts.
- Q3 accepted: clear a destination proven invalid after origin/geography/refreshed reference changes, explain and require reselection; block submission and revalidate server-side, preserving unrelated draft facts. A failed lookup alone does not prove reference invalidity.

2026-10-23 continuation: mandatory pull succeeded; full current320 remains unchanged at2026-10-20T11:10:16.059Z and source HEAD remains5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Full replacement preserves all original business behavior with the documented reservation/historical qualifications, current UI ownership and three accepted decisions. Existing image retained as an unsigned historical image reference; both attachment objects retained. No metadata/relation changes proposed, including mentions of339/344. Exact-text approval is the next gate.

Recommendations are not decisions until accepted. Full standalone replacement and fresh exact-text approval are required before any Linear mutation. Existing metadata/relations/attachments remain unchanged. No new glossary term or qualifying ADR has been resolved.
