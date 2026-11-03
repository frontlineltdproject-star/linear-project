# Imports structural planning — open review

Interview in progress. No final ticket or Linear write approval. UI, preview and production branch excluded.

## Accepted coverage model

One Import per clearance declaration, linked to one Shipment and explicitly selected permanent colli identities. Connected Orders derive through Shipment attribution, not a separately maintained Order selection. Warehousing-placement declarations excluded. Whole-colli granularity is provisional pending department confirmation about sub-colli clearance.

Preselect all eligible collis. Saved coverage in another non-cancelled Import excludes the same Shipment + colli pair; completed records count. User accepted same-Shipment scope (Q25), not lifetime exclusion across future Shipments. An ordinary full-clearance case keeps all preselected goods; no separate partial mode is required. Unsaved suggestions do not claim coverage.

## Consumer trace

Read-only gh inspection of live main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`. Java paths below are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`. Existing tickets are planned contracts, not proof they are implemented on main.

| Area | Current source/behavior | Proposed outcome / status | Owner |
| --- | --- | --- | --- |
| Shipment cancellation | `web/shipments/service/ShipmentsApiService.cancel`: PREPARING only; locks Shipment and contents, releases allocations and closes movements | Block while a non-cancelled Import exists; proposal pending | New Import ticket proposed |
| Saved Shipment membership edits | No edit/remove command on main; live FRO-344 (updated 2026-10-23T14:45:12.666Z) plans membership replacement/removal, splits and preserved historical attribution | Prevent removal of covered goods unless first explicitly removed from a pre-submission Import; submitted coverage immutable; no automatic expansion for newly added goods. Pending agreement | New Import guard integrated with FRO-344; no linked-ticket edit authorized |
| Coverage and attribution | `domain/shipments/ShipmentLoadUnitContentRepository.findByShipmentId`, `web/shipments/service/ShipmentOutputAssembler.content`: stable colli ID and Order-at-loading, open and closed rows retained | Keep declaration coverage stable through later Order splits/movement; never recompute from an Order's current full colli set | New Import preservation requirement; final spec pending |
| Later movements | DB unique Shipment + colli and one open allocation per colli; arrival closes movement, permitting same colli on later Shipment | Same-Shipment uniqueness accepted Q25; do not ban future Imports globally | New Import coverage validation |
| Order split / terminal disposal | `web/purchaseorders/service/PurchaseOrdersApiService.split`, `correctPreStockHandlingUnits`, `recordTerminalDisposition`: stable identity, allocation guards, terminal history; parent can become CANCELLED/NO_MOVABLE_COLLIS | Preserve submitted customs history. Draft eligibility after later terminal disposition remains unresolved; no lifetime split/disposal ban authorized | New Import read/validation rules, exact eligibility pending |
| Shipment category | FRO-322 Backlog, updated 2026-10-13T09:01:46.421Z: Import/Export category and Import-specific movement rules unresolved | Do not silently require/implement this category; choose parent Shipment eligibility explicitly | FRO-322 retains movement-category scope |
| Packing and related UI data | FRO-325 exact participation independent of packing; FRO-299 planned colli measurement read; FRO-300 transport-piece display | Read-only source ownership retained. Exact fields/totals/display deferred by user to UI consultation. Repacking must not alter declaration membership | Existing owners; later UI ticket assigns any missing read support |

## Decisions accepted after trace (Q26–Q28)

- Any non-cancelled Shipment is eligible, including arrived Shipments. Staff identify the relevant import movement; no automatic geography-based eligibility or future category dependency.
- FRO-322 owns the Shipment Import/Export category. User defers its work until current Shipment implementation completes; no changes to FRO-322 authorized.
- Shipment cancellation blocked while a non-cancelled Import exists. Removing covered colli from Shipment blocked until explicitly removed from a pre-submission Import; submitted coverage locked. New Shipment goods never auto-expand Import coverage; repacking and Order splits preserve covered identities. The pending safeguards in the trace table above are now accepted; integration with FRO-344 belongs in the new ticket without silently editing that issue.
- New records, fixtures and manual already-underway recording only. No bulk historical import or reconstruction and no real-data deletion.

## Pending before final draft

- Department confirmation about whole-colli coverage remains outstanding. Actual customs rejection explicitly deferred by user (Q30); inspection is not rejection. Post-submission withdrawal/correction remains separately scoped.
- Q29 accepted: recorded Shipment participation governs coverage; later terminal disposition, movement or Order splitting neither erases coverage nor alone excludes historically participating collis. Preserve attribution across planned membership edits.
- Complete event chronology, duplicate/stale operation behavior, initial already-progressed recording, attachment policies and read-only acceptance checks using accepted decisions in MEMORY.md.
- Fetch current board metadata, apply frontline-linear-issues, show complete draft and obtain explicit write approval. No new UI or production branch.
