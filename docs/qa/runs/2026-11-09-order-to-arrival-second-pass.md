# Order-to-arrival review — second pass, 9 November 2026

## Scope, sources and limits

Continues [the first review](2026-11-09-order-to-arrival.md). The user requested independent investigation beyond their own observations, followed by a proposed grouping into developer tickets. Order = purchase order = stock-list item; colli = permanent handling unit.

Production source: `Frontline-Forwarding/frontline-forwarding`, `main`, **6aa259553cd9c86a8aaa157902088aa9a6bca83e**, source version 0.0.13. Authenticated gh access and the unchanged SHA were checked again. Current full Linear descriptions were re-read for FRO-335/326/336/346/328/342/341/325/344/345/316/356/362; their timestamps match the first-pass ledger. FRO-362 is still Backlog, so independent colli movement is not treated as delivered. Source version is not a verified Railway deployment version.

Planning pull succeeded before work. Production source, portal and database remained read-only. No email, fiscal submission, production fix/branch or Linear write. Existing designs/contracts were reused; no new UI design or preview was needed. The source archive still has no Git metadata; direct policy reads were used, with no successful policy-loader fingerprint claimed.

This bounded pass adds **nine findings: QA-OS-05–13**. Eight have isolated runtime evidence; QA-OS-13 has a supported write/read/SQL trace but no database execution. All full browser scenarios remain **Not run**. The upload's real 401 cause remains unresolved.

## Verification receipt

| Check | Result and scope |
| --- | --- |
| Order component evidence | Parent independently ran [order-flow-audit.test.tsx](../evidence/order-flow-audit.test.tsx): 9/9 passed, exit 0, 12.47s. Actual components/mappers; mocked transport and controlled prop refresh. |
| Shipment component evidence | Parent independently ran [shipment-flow-audit.test.tsx](../evidence/shipment-flow-audit.test.tsx): 7/7 passed, exit 0, 12.91s. Actual controller/page/forms/query client; mocked transport. |
| Packing weight evidence | Parent independently ran [shipment-backend-repro.py](../evidence/shipment-backend-repro.py): five extracted-Java behavior checks and one network-guard check passed, exit 0. Static history/schema assertions also passed. |
| Source integrity | All 562 harness client source files matched the pinned archive after agent runs; no production source edits. Existing local dependencies reused: Node 24.13.0, Vitest 4.1.6. |
| Controls | First Order save retains original version; normal no-refresh comment retry retains identity; saved nullable Order fields survive independent card saves; valid optional/integer measurements remain accepted. |
| Not executed | Deployed browser journey, real multi-user/backend transactions, full frontend suite/build, Java 25/Spring/PostgreSQL suite, email/storage/fiscal integration, complete route/membership reconciliation. Host Java 11 was used only for the extracted pure-Java test. |

**These are observation tests asserting faulty behavior plus controls. Passing reproduces the defects; it does not mean the product passes acceptance.** Convert them to desired-outcome regression assertions when fixing the production code. No new defect is inferred merely because an area was not tested.

## QA-OS-05 — stale packing review can overwrite a newer arrangement

**Priority proposal:** High. **Evidence:** demonstrated frontend requests; backend consequence source-traced. **Owners:** FRO-316/325/344. **Regression:** OS-027.

1. Open a packing review at Shipment version 3 with a 120 cm load unit.
2. Another operator saves 200 cm at version 4. Refresh the query before confirming, or receive a conflict and let the controller reload.
3. Confirm/retry from the still-open review.

The request sends the old **120 cm** arrangement with **expectedVersion 4** and `physicalPackingComplete: true`. After conflict the review stays open and retry gets the new version without renewed review. A stale arrangement can therefore overwrite a colleague's change and be attested Ready.

Expected: preserve the draft but bind confirmation to the reviewed version; a changed plan requires reconciliation/review. Never silently attach a new version to old intent. Both the refresh-before-submit and conflict/retry paths were reproduced. Actual database overwrite was not executed.

Cause: the modal captures the draft once without its base version; the command uses the latest query Shipment. Sources: [shipment-packing-modal.tsx:137](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/details/shipment-packing-modal.tsx#L137), [shipment-packing-modal.tsx:202](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/details/shipment-packing-modal.tsx#L202), [use-shipment-details.ts:149](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipment-details.ts#L149), [ShipmentsApiService.java:925](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java#L925). Other commands share the helper and deserve regression checks, but only packing is established here.

## QA-OS-06 — a refreshed Shipment version changes an uncertain comment's retry identity

**Priority proposal:** Medium. **Evidence:** demonstrated request identity and ID-keyed mock; backend semantics traced. **Owner:** FRO-345, frontend integration FRO-316. **Regression:** OS-028.

Submit a comment whose server response is lost, refresh after an unrelated Shipment change advances its version, then retry the same text. The two requests omit expectedVersion but have different requestIds. The test recipient records two comments; the no-refresh control reuses the ID.

The backend deliberately returns the original comment for the same request ID and creates a distinct comment for a different ID, even with identical text. Thus the changed identity can duplicate an append-only comment. A real database duplicate was not executed.

Expected: preserve the identity of an unresolved comment operation across unrelated Shipment refreshes; intentional later comments with the same text must remain distinct. The retry key always includes Shipment version although comments are unversioned. Sources: [use-shipment-details.ts:149](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipment-details.ts#L149), [use-shipment-details.ts:258](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipment-details.ts#L258), [use-request-ids.ts:9](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-request-ids.ts#L9), [ShipmentHistoryApiService.java:137](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentHistoryApiService.java#L137).

## QA-OS-07 — completing one Notes save erases newer typing in the other

**Priority proposal:** Medium. **Evidence:** demonstrated component state loss. **Owner:** FRO-316 independent Notes contract. **Regression:** OS-029.

Open Internal and External Notes. Start saving Internal Notes, then keep typing in External Notes while the request is pending. When the save completes, External Notes reverts to its earlier text. Only the internal mutation was sent.

Expected: a save affects only its card and preserves the latest sibling draft. The async callback merges into a captured old drafts object, then replaces the whole page draft state. This is local unsaved-text loss, not a demonstrated server overwrite. Sources: [shipment-notes-card.tsx:36](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/details/shipment-notes-card.tsx#L36), [shipment-overview-tab.tsx:81](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/details/shipment-overview-tab.tsx#L81), [shipment-details-prepared-page.tsx:101](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/details/shipment-details-prepared-page.tsx#L101).

## QA-OS-08 — tab navigation loses an arrival/handover draft

**Priority proposal:** Medium. **Evidence:** demonstrated component state loss. **Owner:** FRO-316 tab/draft preservation. **Regression:** OS-030.

On a dispatched launch-station Shipment, fill recipient name/address, Received by and proof reference. After an injected arrival refusal, values remain. Visit Overview, then return to Available actions: all four inputs and the error are gone. The same unmount path affects an unsubmitted draft.

Expected: switching tabs preserves open drafts, including final handover; failed work remains recoverable. Arrival keeps its data only in local component state while inactive TabPanels unmount. This finding is about draft retention, not incorrect arrival persistence. Sources: [shipment-arrival-form.tsx:35](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/details/shipment-arrival-form.tsx#L35), [shipment-details-prepared-page.tsx:191](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/details/shipment-details-prepared-page.tsx#L191), [tabs.tsx:137](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/components/ui/tabs.tsx#L137).

## QA-OS-09 — adding a colli crashes an already-open Order stock-entry panel

**Priority proposal:** Medium; raise if frequent in office use. **Evidence:** two component render exceptions. **Owners:** FRO-326/336. **Regression:** OS-031.

Open “Record arrival and set PO in stock” on a Ready Order and enter storage position. While it remains open, save a new colli on the Collis tab or receive that change through a refresh. Initially empty and already-populated Orders both throw `Cannot read properties of undefined (reading 'lengthCm')`.

Expected: preserve entered position/measurements, initialize the new colli's measurement draft and validate the complete current set. Ready Orders with no collis are allowed and must support later colli entry. No stock request is needed to trigger this exception.

The current colli list updates but the measurement map is initialized only on mount; the new ID is dereferenced unchecked. Overview stays mounted across tab navigation, and colli saving refreshes the Order. Sources: [order-status-card.tsx:361](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-status-card.tsx#L361), [order-status-card.tsx:471](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-status-card.tsx#L471), [order-details-page.tsx:107](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-details-page.tsx#L107), [order-collis-tab.tsx:271](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-collis-tab.tsx#L271). The test delivers a refreshed colli list to the same mounted component; it does not execute a real colli save.

## QA-OS-10 — Order retry confirmation can submit an unreviewed newer version

**Priority proposal:** High. **Evidence:** demonstrated frontend payload; backend version gate traced. **Owners:** FRO-346/326. **Regression:** OS-032.

1. Edit Message number at version 7; first save receives CONFLICT.
2. Refresh to version 8 and open a renewed confirmation.
3. While it is open, another change updates Supplier reference at version 9; refresh supplies it.
4. Confirm the existing review.

The dialog still shows only the reviewed Message change, but the request sends **expectedVersion 9** with the old Supplier reference. This can silently restore the previous Supplier reference without showing that change in the accepted review.

Expected: bind the renewed confirmation to version 8 or invalidate it when version 9 arrives. The first save before any conflict correctly retains version 7 (tested control); this finding specifically concerns the retry path.

Conflict clears `baseVersion`. Opening review does not capture a replacement version, so confirmation falls back to current props. Backend checks the supplied expectedVersion against the locked row and cannot identify this client-created stale intent. Sources: [order-details-card.tsx:599](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-details-card.tsx#L599), [order-details-card.tsx:614](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-details-card.tsx#L614), [order-details-card.tsx:635](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-details-card.tsx#L635), [PurchaseOrdersApiService.java:591](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L591). Database overwrite was not executed.

## QA-OS-11 — locally accepted colli measurements fail at the API

**Priority proposal:** Medium. **Evidence:** actual Create request plus GraphQL scalar rejection; backend zero-value checks traced. **Owners:** FRO-335/326. **Regression:** OS-033.

Create → Add colli → enter dimensions **1.5 × 2 × 3** → Save row → Create. The row is accepted/collapsed without an error and the actual service sends lengthCm 1.5, although the GraphQL field is Int. Scalar coercion rejects that exact captured value. The same validator also accepts zero dimensions and gross weight zero, which Java validation rejects.

Expected: all dimensions blank or three positive whole numbers; positive gross when supplied; net may be zero and cannot exceed gross. Reject invalid inputs at row Save and final submission while preserving valid optional measurements and decimal weights. No invalid server persistence is claimed.

Sources: [order-collis-tab.tsx:97](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/details/order-collis-tab.tsx#L97), [creation-collis.tsx:106](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/creation/creation-collis.tsx#L106), [purchase-order-service.ts:121](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/services/purchase-order-service.ts#L121), [purchase-orders.graphqls:273](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls#L273), [PurchaseOrderRequestValidator.java:378](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java#L378).

## QA-OS-12 — clearing gross weight silently clears omitted net weight

**Priority proposal:** Medium. **Evidence:** extracted production Java execution plus persistence/schema trace. **Owner:** FRO-325 omitted-field contract. **Regression:** OS-034.

A retained load unit has gross 80 kg and net 70 kg. Save otherwise valid packing with gross null and net omitted. The resolver turns net into null too; validation accepts both-null and persistence writes them. Both explicit omission and an absent ArgumentValue reproduced the loss.

Expected: omitted net remains 70; because that value requires gross, reject this save unless net is explicitly cleared as well. Gross 90 plus omitted net correctly preserves 70; explicitly clearing both remains valid. These controls passed. The normal packing UI omits net, so clearing visible gross can affect a hidden saved value.

The wrong fallback is `kept == null || gross == null ? null : savedNet(kept)`. Save and Confirm both use this plan. Sources: [ShipmentPackingPlan.java:116](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentPackingPlan.java#L116), [ShipmentInputValidator.java:320](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentInputValidator.java#L320), [ShipmentsApiService.java:1068](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java#L1068), [ShipmentLoadUnitRepository.java:95](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/shipments/ShipmentLoadUnitRepository.java#L95), [V1__initial_schema.sql:1519](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql#L1519).

The reproducer executes exact extracted resolution/helper/validator statements using getter-only DTO stand-ins. It is not a Spring, adapter or transaction test.

## QA-OS-13 — editing retained packaging changes earlier journey context

**Priority proposal:** Medium. **Evidence:** code-established write/read mismatch; database integration pending. **Owner:** FRO-325 packing history. **Regression:** OS-035.

Confirm a PALLET labelled PALLET-A, producing colli LOADED events referencing its ID. Save a changed plan retaining that ID but changing type/label to CARDBOARD_BOX / BOX-B. Reading the old LOADED event resolves the updated current load-unit row, so the event now describes the new packaging at the earlier physical confirmation time, before revised packing was confirmed.

Expected: prior physical journey context remains historically interpretable. A saved plan is not a newly completed physical repacking. Current operation before/after JSON does retain facts, but the separate colli-journey reader does not use those snapshots.

Only removed, referenced units are retired. Retained units are updated in place; the journey projection reads their current type/label. SQL permits current pre-dispatch unit edits and only freezes retired units. Sources: [ShipmentsApiService.java:1050](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java#L1050), [ShipmentsApiService.java:1068](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java#L1068), [ShipmentLoadUnitRepository.java:95](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/shipments/ShipmentLoadUnitRepository.java#L95), [PurchaseOrderOutputAssembler.java:756](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderOutputAssembler.java#L756), [V34__shipment_ready_for_dispatch.sql:201](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/db/migration/V34__shipment_ready_for_dispatch.sql#L201), [V38__shipment_load_unit_retire_ignores_removed_content.sql:7](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/db/migration/V38__shipment_load_unit_retire_ignores_removed_content.sql#L7).

This deterministic path is a strong finding, but the static assertions are not an executed historical journey. Developer verification must capture an event before/after a retained-unit edit and compare its historical context, alongside the already covered removed-unit retirement case.

## Consumer and coverage disposition

| Area | Current evidence / outcome | Required outcome / ownership |
| --- | --- | --- |
| Order create + colli editors | Shared validator accepts API-invalid values | QA-OS-11; preserve valid optional and decimal-weight cases |
| Order Details save + API | Retry can send current version with old fields; API checks the supplied version under lock | QA-OS-10; reviewed-version protection, no weaker server guard |
| Stock-entry draft + colli query refresh | New colli is missing from measurement map | QA-OS-09; initialize it without discarding existing draft |
| Order readiness and stock backend | Status, reservation, customs, measurement completeness, arrival-time and transactional paths inspected | Preserve existing rules; no additional defect established, runtime validation still outstanding |
| Shipment draft/controller + packing service | Latest version assigned to old review | QA-OS-05; protect review and physical attestation |
| Notes, tab navigation and arrival form | Local draft loss reproduced | QA-OS-07/08; preserve unrelated and inactive drafts |
| Comment retry + history service | Version changes retry key; fresh key inserts distinct comment | QA-OS-06; preserve unresolved attempt identity |
| Packing persistence + journey projection | Hidden net lost; earlier event context changes | QA-OS-12/13; preserve omitted data and historical facts |
| Dispatch/arrival/cancel/reservations | Inspected source and relevant existing tests; no new core transition defect established | Full isolated integration execution still needed; not a Pass |
| Delivery notes/fiscal reconciliation/integrations | Complete matrices not executed | Later bounded review; no speculative ticket in this set |

Ruled out: nullable Order-header fields are explicitly echoed by colli, invoice-row and Details saves; Notes has its own operation. The six-operation control preserved the questioned values and independent collection boundaries. No generic PATCH assumption is used.

Other controls: upcoming reservation/cancellation remains possible in the inspected states; stock confirmation selects PREPARED_FOR_SHIPMENT when reserved; packing Save does not itself append physical LOADED events; referenced removed units are retired; server same-ID comment replay is implemented. These source checks do not certify every concurrency case.

## Original ticket grouping — superseded by the accepted five groups

After the bug-by-bug explanation, the user accepted [five groups with complete drafts for review](../../../drafts/order-to-arrival-bugs/README.md). The nine-group table below records the original proposal only. It does not define the current ticket count. No Linear issues have been created.

The original proposal separated both stale-review fixes and grouped only the local draft-retention and backend packing-preservation defects. Its priorities were proposals, not Linear metadata writes.

| Group | Proposed scope | Findings | Priority proposal / reason |
| --- | --- | --- | --- |
| G1 | Shipment creation: preserve draft across origin/country changes | QA-OS-01 | High: core creation interruption; retain its two reproduced paths |
| G2 | Order Details: bind retry confirmation to reviewed version | QA-OS-10 | High: potential silent overwrite |
| G3 | Shipment packing: invalidate stale physical confirmation | QA-OS-05 | High: potential overwrite and obsolete readiness attestation |
| G4 | Order stock entry: handle collis added while panel is open | QA-OS-09 | Medium: distinct render crash and focused fix |
| G5 | Order colli forms: align numeric validation with API | QA-OS-11 | Medium: accepted local inputs fail final save |
| G6 | Shipment Details: preserve Notes and arrival drafts | QA-OS-07, QA-OS-08 | Medium: two bounded local-state fixes with separate acceptance cases |
| G7 | Shipment comments: preserve identity across uncertain retries | QA-OS-06 | Medium: duplicate append-only activity |
| G8 | Shipment packing: preserve omitted values and past journey facts | QA-OS-12, QA-OS-13 | Medium: same packing update/read consumers; separate checks for each defect |
| G9 | Creation uploads: diagnose and resolve reported 401 | QA-OS-02 | Investigation first: failure request/server evidence missing; no guessed auth fix |

Every runtime finding from both passes is assigned above. Keep QA-OS-03 (contradictory FRO-336 upload wording) and QA-OS-04 (no-file context contract mismatch) as explicit contract-reconciliation items alongside G9. They are **not proved causes of its 401**. Prefer reviewed corrections to the owning requirements; any implementation work arising from QA-OS-04 must be scoped after resolving the contract. Neither item is discarded.

Duplicate search: current FRO issues searched for shipment, readiness, stale, upload and colli, with all returned pages inspected. No open issue matching these exact defect scopes was identified. Read FRO-278 in full: it is a Done fix for the old ShipmentComposer subscription loop, a different cause from QA-OS-01. FRO-365 remains Backlog for inapplicable AWAITING_IMPORT readiness buttons; do not duplicate it. Backlog FRO-362/367 and other planned UI entities are not evidence of regressions.

The current five-group structure is agreed. The linked descriptions and metadata still await user review before any Linear write. No existing ticket was changed by the review or drafting work.

## Scenario ledger

New cases OS-027–035 are in [the scenario catalogue](../scenarios/order-to-shipment-arrival.md). Each remains **Not run end-to-end**; its finding records only the narrower evidence above. OS-001–026 keep their first-pass execution status. The catalogue now contains **35 scenarios**, not 35 completed tests.

Artifact validation: 27 local Markdown links and 56 pinned source-line links checked; no missing targets or out-of-range lines. Scenario and finding IDs are complete and unique. Parent verified all 562 client files and both committed test copies against the executed harness. Whitespace checks passed. Final gh read still returned the pinned main SHA.
