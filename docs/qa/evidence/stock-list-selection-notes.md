# Stock List selection and Start shipment — read-only QA

Date: 2026-11-09. Pinned authenticated source supplied by parent: main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Expected behavior: [FLOW-SL](<../flows/stock-list-selection-printing.md>). Scope is selection metadata, complete-set Start shipment handoff, and selection persistence/reset. No fixes.

**Result: two bounded findings, 16 passing observation/control tests (9 defect observations + 7 controls), 0 failed, 0 skipped.** Passing defect observations confirm the pinned behavior; they do not establish that the product is correct or fixed.

## Evidence and reproducibility

- [Only authored test file](<stock-list-selection-qa.test.tsx>).
- Final machine-readable test results (isolated execution artifact; summarized in stock-list-verification.json).
- Final command exited 0; Vitest 4.1.6; 1 test file; 16/16 tests; 26.87 seconds.
- The archive and the harness are separate. SHA-256 comparison found all 11 audited client source files byte-identical: the two routes, list table/state/toolbar, list hooks, creation hook/form/mapping, shipment query hooks, and shipment service.
- Mounted production components: PurchaseOrdersPage → PurchaseOrderTable + PurchaseOrderSelectionToolbar; NewShipmentPage → useShipmentCreation → ShipmentCreationForm. Real React Query handles in-memory cache/refetch updates. The shipment candidate service itself runs through a read-only GraphQL executor double, so outgoing candidate variables are observed.
- Router/history is a small deterministic boundary double; real route validators and page components execute. It changes search while retaining component identity and unmounts the list when navigating away. This is not full TanStack Router/browser-history verification.
- Fictional service read responses; profile and preference read hooks stubbed. Preference mutation is an inert local mock. Print ends at a mocked preview service, so only its exact ID arguments are checked.
- Every test asserts no fetch/XHR use and no GraphQL operation other than the allowlisted candidate read. No create action is invoked. The would-be creation payload is computed only with the real pure mapping helper.
- Date rollover fakes Date only. No sleep or timer advancement drives promise/query progress.

Run from the existing harness:

```powershell
Set-Location -LiteralPath 'shipment-crash-audit'
node node_modules/vitest/vitest.mjs run stock-list-selection-qa.test.tsx --configLoader runner --no-cache --reporter verbose --reporter json --outputFile.json stock-list-selection-qa.results.json
```

The initial run had two test-selector failures (warehouse text included position rather than warehouse name; page-header accessible name was longer than the test assumed). Only the owned test was corrected. A subsequent 16/16 run passed; the final run above also corrected the pagination fixture to honor the actual ascending internal-number sort. No application change was made.

## Finding OBS-SL-SEL-1 — current rows and cached eligibility diverge

**Trigger:** Tick fictional Orders 7 and 8 while both are IN_STOCK, have live collis, have no active Shipment, and share warehouse 31. Another valid operation reserves 7 on another Shipment. Refetch the mounted list so its current row shows PREPARED_FOR_SHIPMENT and SHP-FICTIONAL.

**Expected:** Keep the deliberate IDs selected, but determine Start shipment eligibility from current facts for the entire set. The set is now ineligible, so the old eligible link must not remain usable. Conversely, a selected Order corrected from PENDING to READY at an EXPECTED stay should become eligible after the refreshed read.

**Observed:** The query cache and displayed row update; checkbox 7 remains checked, count remains 2, and Start shipment still passes `{originWarehouseId:'31', purchaseOrderId:'', purchaseOrderIds:'7,8'}`. Calling the real eligibility helper with the fresh rows returns null. Unticking and reticking 7 updates its captured metadata and correctly hides Start shipment. The opposite direction is also reproduced: the PENDING→READY update remains blocked until reticked.

Other reproductions under the same root cause:

| Current-data change | Observed consequence |
| --- | --- |
| Last movable colli terminated; Order becomes CANCELLED / NO_MOVABLE_COLLIS, count 0 | Old enabled Start link persists. |
| Order and stay become LOCATION_UNKNOWN | Old enabled Start link persists. |
| Current stocked warehouse is now 33 while the other selection remains at 31 | Table shows WH-33; link still uses origin 31 and both IDs. This represents snapshots before/after the lifecycle, not a direct permitted warehouse edit. |
| EXPECTED_READINESS date 2026-11-09, selected on that day; local date moves to 2026-11-10 and list refreshes | Current helper returns null; captured link persists until reticked. No office-vs-browser timezone defect is claimed. |
| Selected 7 moves off-page; its cached page receives fresh reservation data while viewing selected 8 | Start still carries 7,8. Returning to page 0 displays the reservation but keeps stale action eligibility. |

**Cause and exact source:** [index.tsx:141](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L141>) stores selection separately from query data. Lines 316–330 capture `purchaseOrderSelection(row)` only in checkbox/page actions; [index.tsx:334](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L334>) computes shipment eligibility from that stored array. [table-state.ts:95](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table-state.ts#L95>) reduces current eligibility to the warehouse ID at capture time (95–103). [table-state.ts:137](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table-state.ts#L137>) checks only captured values (137–156), not current rows or dates. The date-sensitive rule is at [table-state.ts:159](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table-state.ts#L159>)–180. Page-select retains existing entries unchanged at lines 130–133; it does not refresh metadata.

**Data consequence:** In-memory Query data can be current while local action state stays stale. No domain write occurs at selection time. The outgoing link carries obsolete origin/eligibility; Print still passes the deliberate ID list independently. The resulting creation draft can shrink as described in Finding 2. This is not evidence of an invalid Shipment being saved.

**Runnable evidence:** [tests:201–275](<stock-list-selection-qa.test.tsx#L201>) contains seven mounted observations; [test:409](<stock-list-selection-qa.test.tsx#L409>) is the page-helper preservation/deduplication control.

**Supported fixture transitions:** [Shipment reservation at ShipmentsApiService.java:635](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java#L635>) changes stocked Orders to PREPARED_FOR_SHIPMENT. [PurchaseOrdersApiService.java:1728](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L1728>) changes the last-colli case to CANCELLED / NO_MOVABLE_COLLIS. [PurchaseOrdersApiService.java:1773](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L1773>) changes Order/stay to LOCATION_UNKNOWN. These sources ground valid response shapes; their mutations were not executed.

## Finding OBS-SL-SEL-2 — complete URL IDs can become an unexplained subset draft

**Trigger A:** Follow the stale link for selected 7,8 after 8 is reserved elsewhere. The current candidate response correctly contains only 7.

**Trigger B (independent of stale selection):** Select two currently eligible Orders 7 and 999 at warehouse 31. The origin has 101 eligible candidate Orders, sorted by internal number. Order 7 is in the first 100; PO-999 is on page 2. The fixture first page contains 100 rows sorted ascending, with totalElements=101 and totalPages=2.

**Expected:** The receiving screen must reconcile every requested ID. Preserve the complete eligible selection, and explicitly account for any Order that has become unavailable. A first page of an origin-wide candidate list is not proof that a requested ID is ineligible. Do not silently open a reduced draft.

**Observed:** The actual toolbar passes every selected ID, and the actual new route keeps those IDs. Nevertheless, the creation hook/form initializes `selectedColliIds:['71']`; Order 8 or 999 is absent from the form's available Orders, without an alert or missing-ID result. In trigger B, exactly one candidate request occurs: `originWarehouseId:31, search:null, page:0, size:100, sort:{field:'INTERNAL_NUMBER',direction:'ASC'}, shipmentId:null`. There is no second-page or per-requested-ID read.

**Cause and exact source:** [toolbar.tsx:55](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-selection-toolbar.tsx#L55>)–62 sends the full ID list. [new.tsx:51](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/shipments/new.tsx#L51>)–61 removes empty/duplicate IDs only. [use-shipment-creation.ts:109](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipment-creation.ts#L109>) fetches an origin-wide candidate list. [shipment-service.ts:83](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/services/shipment-service.ts#L83>)–97 fixes it to page 0 / size 100. [use-shipment-creation.ts:260](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/hooks/use-shipment-creation.ts#L260>)–278 initializes the draft once from available reads. [shipment-creation-mapping.ts:199](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/creation/shipment-creation-mapping.ts#L199>)–215 intersects those reads with requested IDs and returns only their collis, with no missing-ID information. Its comment explicitly says absent candidates are left out; the observation is not an inferred implementation accident.

The backend really supports candidate paging: [ShipmentsApiService.java:286](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java#L286>) computes safePage; lines 311–318 apply offset/size; lines 335–341 return totalElements/totalPages. No backend execution is claimed.

**Data consequence:** Original requested IDs remain in route search, but only the surviving colli identities enter form state. The real pure creation projection at [mapping.ts:232](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/shipments/components/creation/shipment-creation-mapping.ts#L232>)–264 then produces `handlingUnitIds:[71]` and `reviewedOrders:[{purchaseOrderId:7,selectionRevision:'rev-7'}]`. The omitted Order is absent from this projected request. This projection was asserted; no request to create a Shipment was sent and no persisted subset is claimed.

**Runnable evidence:** [test:370](<stock-list-selection-qa.test.tsx#L370>) proves the current ineligible omission and pure payload consequence. [test:390](<stock-list-selection-qa.test.tsx#L390>) proves omission of an eligible second-page Order with only two IDs selected. The 100-print limit is not the trigger.

## Checked working controls

| Control | Result and evidence |
| --- | --- |
| Initially mixed warehouse/ineligible set | Start hidden for the complete set; mocked Print receives exactly 7,8. Test 277. |
| Missing SHIPMENT_CREATE authority | Start hidden; Print still receives exactly 7. Test 286. UI authority boundary only. |
| Page header selection/clear | Correct unchecked/checked/indeterminate state; preserves off-page IDs; unique 7,8,9,10; clearing page 2 preserves 7,8. Test 294. |
| Same-list search/sort and clear | Search/sort navigation preserves selection; explicit Clear empties it. Test 315. Does not validate filter semantics. |
| Grouping and group header selection | Grouping switch preserves IDs; clearing warehouse-31 group preserves selected warehouse-33 Order 9; Print receives exactly 9. Test 326. |
| Complete eligible handoff and return | Link 8,7 becomes exact collis 71,81 in actual creation form; no subset when both candidates are present. Returning remounts list unchecked with no toolbar. Test 354. |
| Page helper | Keeps existing selected metadata and adds each new ID once. Test 409. Metadata retention also explains Finding 1. |

## Limitations and ownership

The playbook loader failed because the source is an archive without Git metadata (`noGit`); no successful loader snapshot/fingerprint is claimed. Parent reports root/client/app and shared workflow/testing policies were already read. This audit read the saved expected flow and existing harness patterns, and used local pinned source only.

No deployed build, real browser, real database, backend transaction/authorization execution, actual PDF/preview, real transport, production portal, Linear or network evidence. No PDF model/layout, general filters/preferences, or preview-service audit. No source/shared configuration/Git/planning/other-chat files were edited. Parent retains planning scenarios/report integration and Git synchronization.

Owned deliverables are only this report, `stock-list-selection-qa.test.tsx`, and `stock-list-selection-qa.results.json`, under the harness path shown above. No broad unrelated tests were rerun.
