# Stock List filters / grouping / preferences — bounded read-only QA

Source: authenticated main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, supplied by parent. Archive root: `C:/Users/Giorgos/AppData/Local/Temp/frontline-audit-20261109-6aa2595/Frontline-Forwarding-frontline-forwarding-6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Harness: `shipment-crash-audit`.

Result: **13/13 passing** in one file: **6 controls + 7 defect observations**, covering five finding categories (F3 has two distinct async cases; F5 covers both list modes). Passing observations assert the existing defect; they are not fix verification. Final execution: exit 0, Vitest 4.1.6, duration 26.30s. No React warnings or unhandled errors in final output.

Only this named test and this named report were authored. No source/config, planning/Git, Linear, portal, DB or network writes/requests. All 562 original client source files independently matched archive SHA-256 hashes, zero mismatches. Parent owns planning flow/scenarios, report integration and Git sync.

## Findings

All findings concern current implemented behavior. No deployed incident, live count, real DB mutation, or PDF result is asserted.

### F1 — Clearing Client unexpectedly clears Vessel (P2)

- Trigger: select Client 1 and its Vessel 1001, optionally keep another text filter; set **Client company → All**.
- Expected under independent AND-control semantics: remove only the client restriction. The vessel is valid with no client restriction and remains selected.
- Actual: Vessel also becomes All; route clears both URL fields and sends `clientCompanyId: null, vesselId: null`. Other search text survives. This broadens the result beyond the intended vessel; previously selected Order IDs are not changed by this operation.
- Cause: [table:608](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table.tsx#L608>)–619 treats the empty client value as an incompatible company ID. The check `companyIds.includes(String(value ?? ''))` is false for All. [route:263](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L263>)–277 sends the cleared vessel and resets pages.
- Runnable evidence: [test:166](<stock-list-filters-qa.test.tsx#L166>). UI selects All and asserts visible Vessel=All plus exact outgoing filter values.
- Working control: [test:157](<stock-list-filters-qa.test.tsx#L157>) proves selecting a genuinely incompatible second client clears the old vessel correctly. The unwanted behavior is specifically removing the client restriction, not that compatibility rule.

### F2 — Company dropdowns stop at the first 100 records (P2)

- Trigger: an authorized client/supplier is beyond the first 100 company results; a vessel belongs only to such a client. Open its dropdown and search the exact known name.
- Expected: reach any authorized option, by complete option loading or server search/paging.
- Actual: the real UI shows No results and performs no subsequent company request. Synthetic fixture includes an Order displaying client/supplier/vessel 101 while those three dropdown searches cannot find them.
- Outgoing/cached consequence: form-options cache holds only page zero's `content`; there is no total-page selection or continuation, and no `clientCompanyId`/`supplierCompanyId`/`vesselId` can be selected from the missing option. General list search may be a workaround; this is not total inability to find the Order.
- Sources: [form-options query:399](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/graphql/purchase-orders.graphql#L399>)–432 fixes both company requests at size 100, no page variable or totals. [service:506](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/services/purchase-order-service.ts#L506>)–521 executes those documents once; [route:224](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L224>)–255 constructs filters from returned content; [Combobox:93](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/components/ui/combobox.tsx#L93>)–102 searches only supplied options. [CompaniesApiService:63](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/companies/service/CompaniesApiService.java#L63>)–101 uses page-zero default and actual offset/limit.
- Runnable evidence: [test:174](<stock-list-filters-qa.test.tsx#L174>) exercises actual service, route and all three dropdowns, checks generated GraphQL documents and request counts. 101 is invented test data, not the company's real record count.

### F3 — Preference hydration overwrites newer user intent (P2)

Two separately reproduced triggers; ordinary cold load and correctly queued submitted saves work.

**F3a: late grouping-save response erases an unsent drag.**

1. Change grouping None → Vessel; keep that save response pending while the group query resolves.
2. Drag Vessel before Status.
3. Resolve the earlier grouping-save response before the drag's real 400ms debounce expires.

Expected: keep the newly dragged column order and eventually persist it. Actual: the preference effect restores the older column order, overwrites localStorage, and cancels the drag's pending save. Captured transport contains only the old grouping save. Query cache retains that older column configuration. Evidence: [test:230](<stock-list-filters-qa.test.tsx#L230>) uses deferred response promises; fake timers control only the source's actual 400ms debounce.

Sources: [table:219](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table.tsx#L219>)–250 unconditionally rehydrates columns on preference object changes; [table:252](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table.tsx#L252>)–279 writes localStorage/debounces and cancels saves; [table:670](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table.tsx#L670>)–685 saves a grouping snapshot immediately. [preference hook:23](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/preferences/hooks/use-table-preference.ts#L23>)–42 only knows configurations already submitted, not the newer drag still waiting in the table.

**F3b: an older in-flight preference read overrides a completed grouping save.**

1. With cached grouping None, begin a preference refetch and defer its old None result.
2. Select Vessel; let its preference save complete and verify both UI/cache are Vessel.
3. Resolve the older read with None.

Expected: the completed newer change remains authoritative. Actual: cache and grouping selector revert to None with no second save; the table changes to ungrouped presentation. This is cache/UI rollback evidence, not proof that the database was reverted. The test explicitly refetches; normal stale-query remount/focus is a possible real trigger (production query staleTime is 30,000ms).

Sources: [preference hook:10](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/preferences/hooks/use-table-preference.ts#L10>)–14 and 23–42 do not cancel/protect the read when writing cache; [route:216](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L216>)–220 adopts every returned preference grouping. [query client:3](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/lib/query/query-client.ts#L3>)–8 supplies the production stale time. Evidence: [test:251](<stock-list-filters-qa.test.tsx#L251>).

Controls: [test:196](<stock-list-filters-qa.test.tsx#L196>) cold deferred load restores grouping, custom column order and optional Owner reference without saving. [test:212](<stock-list-filters-qa.test.tsx#L212>) verifies serialized submitted grouping mutations ignore the earlier response and cache only the latest.

### F4 — Flags drag position cannot survive server normalization (P2)

- Trigger: drag Flags before Status and let the preference save complete.
- Expected: the chosen position survives save/reopen.
- Actual isolated UI result: outgoing configuration contains Flags in the new position; a server-policy-shaped response omits `flags`; cache loses it, and client normalization appends it after every known saved column. Flags visibly jumps to the last displayed column, and localStorage is rewritten accordingly.
- Sources: [client core columns:1](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table-state.ts#L1>)–10 includes Flags; [client normalization:194](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table-state.ts#L194>)–213 appends missing known columns. [server policy:12](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/preferences/PurchaseOrderTablePreferencePolicy.java#L12>)–41 omits Flags from both allowed lists; its normalization at 59–70 filters unrecognized IDs. [preference API:49](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/preferences/service/UserTablePreferencesApiService.java#L49>)–63 normalizes before saving; 66–72 normalizes on output.
- Runnable evidence: [test:287](<stock-list-filters-qa.test.tsx#L287>) extracts the actual Java allowlist and injects only the matching response shape into the real UI/hooks. **Java/Spring and persistence were not executed.** This is a source-proven contract mismatch plus UI execution against a bounded response adapter.
- Working control: [test:271](<stock-list-filters-qa.test.tsx#L271>) ordinary Vessel drag saves and reopens correctly with a faithful echo response. This does not claim Flags persistence works.

### F5 — Shrinking results strand a later page and hide navigation (P2)

- Trigger: on page 2 of a 21-result list/group at size 20, another change reduces matching results to 20; a refresh returns page index 1, zero content, totalPages 1.
- Expected: recover to the remaining page or keep a reachable Previous control.
- Actual: the page remains 1, renders No results, and hides both Previous and Next. The total still indicates records exist. Reproduced in ungrouped list and a vessel group.
- Outgoing/cached consequence: requests continue to use page 1; query cache contains `{page:1,totalPages:1,content:[]}`. No mutation is sent. Changing sort resets the page to zero and shows records again (working recovery control).
- Sources: [route:195](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L195>) and [route:295](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L295>)–303 preserve group page; [table:1066](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table.tsx#L1066>)–1071 hides pagination when totalPages≤1. Ungrouped equivalent: [route:169](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L169>) and [route:438](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src/routes/secured/purchase-orders/index.tsx#L438>)–443. [list API:204](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L204>)–223 preserves positive requested page and computes count/offset independently; no upper-page clamp.
- Runnable evidence: [test:303](<stock-list-filters-qa.test.tsx#L303>) runs both modes using a synthetic API response matching that source contract. No real concurrent record edit or database query was performed.

## Checked working behavior / negative findings

| Check | Evidence and limit |
| --- | --- |
| Compound visible controls survive UI changes | Test 128 preserves statuses, client, supplier, vessel, warehouse, readiness days, created date and explicit false urgent/active values alongside mixed-case text in actual list and group service payloads. Filter change resets pages. |
| Per-group pages are independent | Test 140 advances A while retaining B's page, preserves search/urgent in requests, and resets group pages on sort. |
| Case-insensitive contains inside dropdown | Test 157 finds mixed-case substring in a supplied company option; unrelated option excluded. |
| Cold async preferences | Test 196 restores grouping, saved custom order and optional column without writing. |
| Two submitted grouping changes | Test 212 demonstrates serial saves and latest submitted response protection. |
| Ordinary persisted drag/reopen | Test 271 covers table DOM order, mutation, Query cache and reopening. |
| Backend combines implemented filters | Read-only trace: PurchaseOrderRepository 471–549 chains conditions with AND, statuses use IN; search 605–644 uses containsIgnoreCase over supported fields. List 136, count 150 and groups 162 share that builder and participant scope. No SQL/DB execution claim. |
| Ready-in-days + selected status | Source adds EXPECTED_READINESS/date bounds by AND (492–496), so contradictory status controls can validly return no matches. No ignored-status bug claimed. |

## Form-options authority trace — no missing-CREATE-authority defect found

The actual `warehouses` resolver is **PurchaseOrdersGraphQlApi**, not `managedWarehouses` in the management API.

| Read | Actual guard/effect | Source |
| --- | --- | --- |
| Order list/group | PURCHASE_ORDER_VIEW plus participant scope for restricted users | PurchaseOrdersApiService 202–217, 231–236 |
| Clients/suppliers | COMPANY_VIEW; nonstaff companyScope is the actor's own company, not an unrestricted catalogue | CompaniesApiService 63–80; AuthorizationService 37–40 and 57–62 |
| warehouses(activeOnly:true) | PURCHASE_ORDER_VIEW; does not require CREATE or WAREHOUSE_VIEW | [resolver:80](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/PurchaseOrdersGraphQlApi.java#L80>)–81; [service:335](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L335>)–338 |
| Countries | No additional authority check in listCountries service | [locations:19](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/locations/service/LocationsApiService.java#L19>)–22 |
| Table preferences | currentUser and own user ID; no creation authority | UserTablePreferencesApiService 21–30, 60–65 |

[UserRole:84](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/users/UserRole.java#L84>)–96 grants COMPANY_VIEW and PURCHASE_ORDER_VIEW to client/supplier managers/operators and agent operators. Therefore none of those current viewer roles lacks an authority demanded by these specific options reads. Partner company options may be empty or narrower because of genuine company scoping; no bypass or broader partner access is assumed.

If an options request fails, `Promise.all` rejects and route 385–400 shows an error while withholding the table despite a successful list read. That is the actual coupling, but current role guards do **not** establish the suggested permission failure. No fabricated partner-denial test or permission regression is reported. Warehouse-management guards are a separate API and do not apply to this query.

## FRO-254 coverage gaps — separate from the five implemented-behavior findings

Parent supplied current FRO-254/269/279 contracts and confirmed no clear replacement of FRO-254's per-column controls. FRO-269's PO model replacement alone is not evidence that those controls were rescinded.

Current table 934–1047 provides one broad search plus status/client/vessel/supplier/warehouse/readiness/created/urgent/activity controls. Showing optional columns does not create independent filters. For example, MSG, Owner reference and Supplier reference all feed the one backend OR-search (Repository 621–624); they cannot be independently entered and combined as separate AND text controls. These are visible contract-coverage questions, **not a newly proven regression from a tested prior build**. Current filtering input has no dedicated fields for them (PurchaseOrderFilterInput 6–21).

Do not automatically restore every old Stock-column control: some fields were retired or moved under the PO/colli model. Per-column reconciliation remains separate from F1–F5. No future supplier-invoice-presence filter, retired PCS, new Order AWB, or other model change is counted here.

## Reproduction / verification commands

Run from the harness directory:

```powershell
Set-Location -LiteralPath 'shipment-crash-audit'
node node_modules/vitest/vitest.mjs run stock-list-filters-qa.test.tsx --configLoader runner --no-cache --reporter verbose
```

Single category example (same test file, no broad suite):

```powershell
node node_modules/vitest/vitest.mjs run stock-list-filters-qa.test.tsx --configLoader runner --no-cache --reporter verbose -t 'OBSERVATION F3'
```

Only the full 13-test command was used for the final verification; the single-category command is provided for reuse.

Independent read-only source comparison command used:

```powershell
$auditSource='https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-client/src'
$auditHarness='src'
$auditPaths=@(rg --files $auditSource)
$auditMismatch=@(foreach($sourceFile in $auditPaths) {
  $relative=$sourceFile.Substring($auditSource.Length+1)
  $target=Join-Path $auditHarness $relative
  if(!(Test-Path -LiteralPath $target) -or (Get-FileHash -LiteralPath $sourceFile).Hash -ne (Get-FileHash -LiteralPath $target).Hash) { $relative }
})
[PSCustomObject]@{OriginalFiles=$auditPaths.Count; Mismatches=$auditMismatch.Count; Paths=$auditMismatch} | ConvertTo-Json -Compress
```

Observed: `{"OriginalFiles":562,"Mismatches":0,"Paths":[]}`.

## Evidence limits

- The source playbook loader failed because the archive has no Git metadata (`noGit`), as recorded by parent. Root/client/app and workflow/testing policies were read directly by parent; no successful loader snapshot/fingerprint is claimed.
- This is source inspection and isolated jsdom execution, with actual route component/table/controls/services/Query hooks. Router URL navigation uses an in-memory adapter; GraphQL responses use invented fixtures. fetch/XHR are blocked, with zero fetch calls asserted after every case.
- Deferred promises order async responses. Fake timers are limited to the implemented 400ms preference debounce. Test Query retry is off, cache is seeded where appropriate, and notifications use microtasks. Production Query uses retry 1/staleTime 30 seconds; explicit refetch models an in-flight stale read without sleeping.
- Final run is clean; earlier runs had test-selector/timing assertion mistakes that were corrected only in this named test file.
- No browser/layout, authentication session, GraphQL server, Java/Spring/jOOQ, PostgreSQL, deployed-equivalence or real persistence verification. Exact general SQL text-search behavior is source-traced only.
- No PDF model/service, printed content, Start shipment metadata, broad unrelated suite or production behavior was tested. Parent's separate PDF findings remain outside this report.
