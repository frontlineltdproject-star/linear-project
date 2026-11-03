# Imports structural planning — open review

Full review draft prepared in `imports-structural-spec.md`. No Linear write approval. UI, preview and production branch excluded. Whole-colli applicability remains an explicit business-input blocker before Ready.

## Accepted coverage model

One Import per clearance declaration, linked to one Shipment and explicitly selected permanent colli identities. Connected Orders derive through Shipment attribution, not a separately maintained Order selection. Warehousing-placement declarations excluded. Whole-colli granularity is provisional pending department confirmation about sub-colli clearance.

Preselect all eligible collis. Saved coverage in another non-cancelled Import excludes the same Shipment + colli pair; completed records count. User accepted same-Shipment scope (Q25), not lifetime exclusion across future Shipments. An ordinary full-clearance case keeps all preselected goods; no separate partial mode is required. Unsaved suggestions do not claim coverage.

## Consumer trace

Read-only gh inspection of live main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`. Java paths below are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`. Existing tickets are planned contracts, not proof they are implemented on main.

| Area | Current source/behavior | Proposed outcome / status | Owner |
| --- | --- | --- | --- |
| Shipment cancellation | `web/shipments/service/ShipmentsApiService.cancel`: PREPARING only; locks Shipment and contents, releases allocations and closes movements | Block while a non-cancelled Import exists; accepted Q27 | New Import ticket |
| Saved Shipment membership edits | No edit/remove command on main; live FRO-344 (updated 2026-10-23T14:45:12.666Z) plans membership replacement/removal, splits and preserved historical attribution | Prevent removal of covered goods unless first explicitly removed from a pre-submission Import; submitted coverage immutable; no automatic expansion for newly added goods. Accepted Q27 | New Import guard integrated with FRO-344; no linked-ticket edit authorized |
| Coverage and attribution | `domain/shipments/ShipmentLoadUnitContentRepository.findByShipmentId`, `web/shipments/service/ShipmentOutputAssembler.content`: stable colli ID and Order-at-loading, open and closed rows retained | Keep declaration coverage stable through later Order splits/movement; never recompute from an Order's current full colli set | New Import preservation requirement; final spec pending |
| Later movements | DB unique Shipment + colli and one open allocation per colli; arrival closes movement, permitting same colli on later Shipment | Same-Shipment uniqueness accepted Q25; do not ban future Imports globally | New Import coverage validation |
| Order split / terminal disposal | `web/purchaseorders/service/PurchaseOrdersApiService.split`, `correctPreStockHandlingUnits`, `recordTerminalDisposition`: stable identity, allocation guards, terminal history; parent can become CANCELLED/NO_MOVABLE_COLLIS | Preserve historical participation/coverage; subsequent disposition alone does not disqualify historical goods. Accepted Q29; no lifetime split/disposal ban | New Import read/validation rules |
| Shipment category | FRO-322 Backlog, updated 2026-10-13T09:01:46.421Z: Import/Export category and Import-specific movement rules unresolved | Any non-cancelled Shipment eligible; staff choose relevant movement; category explicitly deferred Q26 | FRO-322 retains movement-category scope |
| Packing and related UI data | FRO-325 exact participation independent of packing; FRO-299 planned colli measurement read; FRO-300 transport-piece display | Read-only source ownership retained. Exact fields/totals/display deferred by user to UI consultation. Repacking must not alter declaration membership | Existing owners; later UI ticket assigns any missing read support |

## Decisions accepted after trace (Q26–Q28)

- Any non-cancelled Shipment is eligible, including arrived Shipments. Staff identify the relevant import movement; no automatic geography-based eligibility or future category dependency.
- FRO-322 owns the Shipment Import/Export category. User defers its work until current Shipment implementation completes; no changes to FRO-322 authorized.
- Shipment cancellation blocked while a non-cancelled Import exists. Removing covered colli from Shipment blocked until explicitly removed from a pre-submission Import; submitted coverage locked. New Shipment goods never auto-expand Import coverage; repacking and Order splits preserve covered identities. The pending safeguards in the trace table above are now accepted; integration with FRO-344 belongs in the new ticket without silently editing that issue.
- New records, fixtures and manual already-underway recording only. No bulk historical import or reconstruction and no real-data deletion.

## Pending before final draft

- Department confirmation about whole-colli coverage remains outstanding. Actual customs rejection explicitly deferred by user (Q30); inspection is not rejection. Post-submission withdrawal/correction remains separately scoped.
- Q29 accepted: recorded Shipment participation governs coverage; later terminal disposition, movement or Order splitting neither erases coverage nor alone excludes historically participating collis. Preserve attribution across planned membership edits.
- Review draft incorporates chronology, duplicate/stale operation behavior, initial already-progressed recording, shared attachment policies and read-only acceptance checks. Full-text approval pending.

## Proposed Linear metadata (verified 3 November 2026)

- Title: Import Customs Declaration — entity & business rules.
- Team FRO; Backlog; labels Story, Backend, Shipment, Pending_Review, Business_Input. All available and non-retired; no import label exists, no label creation proposed.
- Project Pre-releases 0.0.x (P-FRO-1); no milestone, assignee, priority or parent proposed.
- relatedTo FRO-317, FRO-325, FRO-344, FRO-322, FRO-356. No blocking relations or attachments. These links are context/coordination, not permission to edit linked descriptions. Do not accidentally make deferred FRO-322 a blocker.
- Duplicate search for Import found no dedicated Import-customs entity ticket. Recheck before creation.
- Exact body is `imports-structural-spec.md`; show whole body in chat, ask to save as pending review. Re-read full saved description, labels, metadata and relations after approved write; no Ready promotion.

## Final source verification

Main rechecked unchanged at 5c51030. Attachments: exactly one saved owner, existing owner enum Order/Shipment only; add Import. Shared REST multipart, private storage, 25 × 1024 × 1024-byte limit, nonempty, normalized filename 1–255, documented extension allowlist. Sources `docs/workflows/attachments.md`, `AttachmentsApiService.java`, `AttachmentReferenceType.java`. Shipment authority + internal identity pattern verified in authorization docs/UserAuthority/ShipmentAuthorizationService; REST/GraphQL/MCP cancellation adapters delegate to the shared service. No existing Import endpoints/authorities claimed.
