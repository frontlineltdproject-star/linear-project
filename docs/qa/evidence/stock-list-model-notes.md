Read-only Stock List backend QA — 9 November 2026

Baseline: authenticated main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, supplied by the parent, at `C:/Users/Giorgos/AppData/Local/Temp/frontline-audit-20261109-6aa2595/Frontline-Forwarding-frontline-forwarding-6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Expected behavior: [saved FLOW-SL](<../flows/stock-list-selection-printing.md>). No network revalidation was performed in this subtask.

**Result:** one confirmed stale-measurement defect and one transport-selection mismatch against the saved contract. The Java harness reproduced both with stand-ins. A related measurement fallback observation and a template newline concern remain explicitly bounded below. No source fix, Git, production/portal/database action, Linear write, frontend audit or planning-file change occurred.

**B1 — pre-stock declared edits print the original measurement snapshot.**

- Trigger: create a colli with declared gross/net 10/8 kg and dimensions 10×20×30 cm; before warehouse confirmation, change its current declared values to 20/18 kg and 40×50×60 cm, then print that Order.
- Expected: with no warehouse-confirmed measurement, print current declared 20/18 kg and 40×50×60 cm.
- Isolated actual: the unchanged factory outputs 10/8 kg and `Wooden box | 10 x 20 x 30 cm`. Two observation checks reproduce the weights and packing separately.
- Cause: [StockListPdfModelFactory.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/StockListPdfModelFactory.java#L100>) lines 100–109 selects the latest record from **all** measurements without filtering its source. Lines 84–97 prefer that record's nonnull weights; lines 128–137 prefer its dimensions. A DECLARED history snapshot is treated as though it were a warehouse measurement.
- Supported production path: [PurchaseOrdersApiService.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java#L502>) lines 502–511 creates the DECLARED snapshot. Lines 889–929, particularly 923, update an existing pre-stock colli without updating that snapshot. [HandlingUnitRepository.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/HandlingUnitRepository.java#L145>) lines 145–172 writes the current declared fields. [PurchaseOrderOutputAssembler.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderOutputAssembler.java#L604>) lines 604–634 supplies both the current declared values and all measurement history to the print factory.
- Outgoing consequence: stale weights affect Order totals; stale dimensions affect Packing Info. Those values are already wrong in the model supplied to the renderer. No database write or cache mutation occurs in this read path; frontend cache behavior was not tested.
- Passing controls: removing only the old snapshot prints current 20/18 and 40×50×60; adding a later full warehouse confirmation correctly prints that confirmed measurement. Neither control alters production source.

**B2 — an older dispatched leg overrides a newer associated ready leg.**

- Trigger: an Order has an older ARRIVED Shipment, dispatched 2 November with CMR-OLD, plus a newer READY_FOR_DISPATCH Shipment created 8 November with CMR-NEW and no dispatch timestamp. Both participations belong to the Order; neither is REMOVED.
- Expected under the saved “most recent associated Shipment leg” contract: CMR-NEW. If that newer leg has no number, blank.
- Isolated actual: CMR-OLD in both cases. Two observation checks cover the saved-new-number and missing-new-number cases.
- Cause: [ShipmentRepository.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/shipments/ShipmentRepository.java#L101>) lines 101–114, particularly 112, orders by `DISPATCHED_AT DESC NULLS LAST, CREATED_AT DESC, ID DESC`. Every previously dispatched leg outranks an undispatched newer leg. [StockListPdfService.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/StockListPdfService.java#L39>) lines 39–42 copies that selected Shipment's number directly into the model.
- The newer leg can legitimately hold a reference before dispatch: source `docs/workflows/shipment-lifecycle.md` lines 514–528 documents optional creation references and pre-dispatch save/replace/clear, preserving READY_FOR_DISPATCH status. This is not an Order-owned AWB requirement or the canceled FRO-310 proposal.
- Outgoing consequence: renderer input identifies the previous transport instead of the latest associated leg. There is no mutation of Orders, Shipments or their references.
- Passing controls: the newer ready leg alone prints trimmed CMR-NEW; after both have dispatch dates, the newer dispatch wins; cancelled Shipments, removed participation and another Order's participation are excluded; timestamp ties use descending ID.
- Evidence boundary: the **exact repository method** executed on a small generic fluent-query stand-in, followed by the exact service and factory. Predicate/order evaluation uses fixture maps. This demonstrates the constructed ordering's effect; it is not jOOQ/SQL/PostgreSQL execution. Parent should retain the saved contract when deciding whether to promote this finding; if the intended rule is instead “latest dispatched leg,” that would require an explicit contract clarification.

**Related observation — later dimensions-only confirmation discards an older confirmed weight.**

The same factory chooses one latest record for every measurement field. With current declared 20/18, earlier confirmed 30/25, and a later confirmation containing only dimensions, actual model weights return to 20/18. One observation records this, without elevating it to a separate confirmed defect. The existing Shipment measurement resolver deliberately finds the latest confirmed record **having the relevant value**: [HandlingUnitMeasurementRepository.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/HandlingUnitMeasurementRepository.java#L64>) lines 64–106 and [ResolvedHandlingUnitMeasurement.java](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/ResolvedHandlingUnitMeasurement.java#L9>) lines 9–45. FRO-299 documents that rule for Shipment consumers, so its application to this PDF should be reconciled by the parent against FRO-279 rather than silently expanding scope. The two confirmed measurements represent different warehouse stays; actual constraints permit at most one record per colli/stay/source.

**Template handoff — external-note newlines lack a preserving consumer.**

[stock-list.html](<https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/frontline-forwarding-app/src/main/resources/templates/stock-list.html#L209>) line 209 uses plain escaped `th:text`. The factory retains embedded newlines (executed control), but template CSS has no `white-space: pre-line/pre-wrap` or equivalent line-break markup for the cell. The only white-space declarations are nowrap for ID/numeric cells (lines 114–119). Expected: two short notes lines remain two lines; source indicates normal whitespace collapse. This subtask did **not** render HTML or PDF, so final visual/text-layout confirmation belongs to the parent. Use short `Alpha\nBeta` notes so wrapping cannot masquerade as preserved newlines.

Static template checks confirm all 20 cells match the record fields in fixed order, escaped text rather than `th:utext`, A4 landscape, repeat-header rule, timestamp, page counters and footer declarations. They do not prove renderer behavior, pagination or legibility.

**Reader/consumer trace and working controls.**

| Area | Source trace | Executed coverage / limit |
| --- | --- | --- |
| Selection guard | StockListPdfService lines 31–65 | Rejects null/empty, duplicate, null member, nonpositive IDs and 101 IDs before lookup; accepts 100 distinct mixed-status Orders. |
| Authorization / whole request | PurchaseOrdersApiService 302–309, 2023–2028; PurchaseOrderAuthorizationService 21–35 | Exact lookup/auth methods; missing/unauthorized member causes no Shipment lookup or render; staff still needs view authority; supplier participant allowed; actor-company/unrestricted assembler scope forwarded. User/role/persistence adapters are stand-ins; HTTP/security filter chain not executed. |
| Current membership | PurchaseOrderOutputAssembler 255–259; HandlingUnitMembershipRepository 52–56 | Read-only trace confirms active membership by Order and valid-until null. Full assembler/repository not executed. Factory assumes that scoped DTO list; no false finding for arbitrary mismatched DTO membership. |
| Colli facts / DG | Assembler 593–641; factory 45–49, 68–77 | Nonterminal count and totals; terminal DG excluded; current DG without class included; zero colli Order remains one row. |
| Weights / volumes / packing | Factory 69–75, 84–139 | Independent net fallback, four stored volume sums, absent vs recorded zero, grouped identical packing, no retired PCS. Partial-dimension DTO is a robustness control, not a claim that the database permits partial dimension tuples. |
| Location | Assembler 246–254, 333–334; PurchaseOrderWarehouseStayRepository 59–63; PurchaseOrderWarehouseStay active/arrived methods; factory 57–59, 142–153 | Current stay; marked last-known LOCATION UNKNOWN; missing location blank/explicit as appropriate. Order-level custody contract retained; FRO-362 Backlog not required. |
| Notes / fixed row | Assembler 331–332, 468–473; factory 33–41, 61–80 | External Notes exclusively, including null/empty; internal note sentinel never enters model; saved names/references; descending internal number and print-time format. |
| Response | StockListPdfService 44–49; PurchaseOrdersRestApi 139–154; PdfRenderService 26–42 | Exact service passes fixed template/name and model to capture-only renderer; render failure propagates. REST inline bytes and real renderer only inspected. No actual PDF-byte correctness claimed. |

**Execution and reproducibility.**

Run from any working directory (defaults pin the supplied source and JDK17):

```powershell
python 'stock-list-model-qa.py'
```

Explicit equivalent:

```powershell
python 'stock-list-model-qa.py' 'C:/Users/Giorgos/AppData/Local/Temp/frontline-audit-20261109-6aa2595/Frontline-Forwarding-frontline-forwarding-6aa259553cd9c86a8aaa157902088aa9a6bca83e' 'C:/Program Files/Java/jdk-17/bin/java.exe'
```

The script then executes:

```powershell
& 'C:/Program Files/Java/jdk-17/bin/java.exe' '-Dfile.encoding=UTF-8' 'StockListModelQa.java'
```

Final run: **exit 0; 74 Java checks: 69 controls and 5 reproduced observations; 7 static template checks.** Observation passes mean the described behavior reproduced, not that the product is correct. Counts are checks/assertions, not 74 JUnit test methods. The dimensions-only item is included among the five observations but is not a third promoted backend finding.

Files created, all uniquely named under the allowed harness parent:

- [stock-list-model-qa.py](<stock-list-model-qa.py>) — extraction/test source.
- StockListModelQa.java (isolated execution artifact; summarized in stock-list-verification.json) — generated exact-body harness and stand-ins.
- [stock-list-model-qa-results.json](<stock-list-model-qa-results.json>) — complete stdout/stderr, counts, source SHA-256 manifest, extraction signatures/lines/hashes and limitations.
- [stock-list-model-notes.md](<stock-list-model-notes.md>) — this handoff.

No business executable statements are rewritten in the extracted factory/service/auth/lookup/repository bodies. Adapters remove framework annotations, nest declarations and explicitly supply Lombok's constructor. DTO getters, repositories, current-user/role adapters and renderer are stand-ins. Query stand-ins evaluate equality, IN, null/distinct, limit and ordering without imposing a custom “latest Shipment” selection rule.

Existing test patterns inspected: StockListPdfModelFactoryTests (3 tests), StockListPdfServiceTests (3), PurchaseOrdersStockListPdfRestApiTests (3), StockListPdfRenderTests (1), and PurchaseOrderOutputAssemblerTests (2): **12 existing tests inspected, 0 existing Gradle/JUnit tests executed**. Existing factory tests lack a changed-current-declaration versus initial-DECLARED-history case. Existing service tests stub the latest Shipment, so do not test repository ordering. Existing renderer test has long single-line notes, no explicit newline assertion.

**Limits.** Java17 is available; the project requests Java25. Normal Gradle was not run: no Java25 found in inspected JDK locations, and dependency/build bootstrapping would violate this subtask's no-network and named-files-only boundary. Cached client harness dependencies do not establish backend runtime support. Exact extraction runs directly from the pinned archive. No real SQL, transaction/rollback/locking/concurrency, role assignments, DB data, deployed revision, browser or real PDF rendering was verified. Mocks are not deployed/DB evidence. The parent already read root/client/app and shared workflow/testing policies; its playbook loader failed because this archive has no Git metadata, so no successful loader fingerprint is claimed. The Java process blocks network/file writes and prints the expected JDK17 SecurityManager deprecation warning. No timers were used. Parent owns planning/scenarios/report integration, Git synchronization and the rendered PDF review.
