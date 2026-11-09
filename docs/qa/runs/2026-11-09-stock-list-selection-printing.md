# Stock List selection and printing — 9 November 2026

Expected [flow](../flows/stock-list-selection-printing.md) and [28 scenarios](../scenarios/stock-list-selection-printing.md) were saved before reproductions. This review found **11 bounded findings** in current behavior. The user accepted three correction groups and Medium/High/High priorities; [complete drafts](../../../drafts/stock-list-bugs/README.md) await review. No Linear write or production fix was made.

## Baseline and scope

- Authenticated production source: `Frontline-Forwarding/frontline-forwarding`, main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, version 0.0.13. This does not establish the deployed revision.
- Full current FRO-279/254/269/292/294/295/297/310/318/362/238/256 were read, plus FRO-299 while resolving measurement precedence. Core FRO-279/254/292/295/297 comments were empty. Later changes and current statuses are reconciled in the flow map.
- FRO-292 supersedes generic Notes with External Notes only; FRO-295 removes per-colli PCS from packing; FRO-297 uses current nonterminal DG. Canceled FRO-310 and Backlog FRO-318/362 are not delivered requirements. FRO-299's later per-field measurement contract expressly covers Shipment consumers; its extension to this PDF is not silently assumed.
- Scope: Orders list, filtering/grouping/preferences, shared selection, exact Start shipment handoff, PDF request/model/layout. The other chat owns Customs Storage Entry. Shipment Invoice, customs registers, VAT forms and full Shipment lifecycle are excluded.
- All fixtures are synthetic. No live portal, database, shipment creation, email or AADE action was performed. All 28 complete portal scenarios remain **Not run**.

## Findings to discuss

### QA-SL-01 — Clearing Client also clears a still-valid Vessel

Select Client A and Vessel A1, then set Client to **All**. The Vessel filter also becomes All; the next read sends both IDs as null. Under FRO-254's independent AND-control rule, removing one restriction should retain the other compatible restriction. Selecting a genuinely incompatible different client correctly clears its old vessel; that is a passing control.

The broadening can make the operator inspect/select unintended Orders. Existing selected IDs are not changed. Expected preservation is the interpretation of FRO-254 used here; no later explicit rule requiring this reset was found. Evidence: mounted real table/route/service, synthetic reads. Source: client `purchase-order-table.tsx:608`, route `index.tsx:263`. [Detailed evidence F1](../evidence/stock-list-filters-notes.md#f1--clearing-client-unexpectedly-clears-vessel-p2). Scenarios SL-007/008.

### QA-SL-02 — Some authorized filter options are unreachable

With 101 synthetic clients/suppliers, an Order for the 101st can be visible, but searching its exact client/supplier/vessel name in the dropdown gives no result. Form-options queries request only the first 100 companies; combobox search is local and never fetches another page. This is an option-coverage limit, not evidence of the company's actual record count or total inability to find the Order through general search.

Evidence: real generated query, service, route and controls with synthetic paginated reads. Source: `purchase-orders.graphql:399`, `purchase-order-service.ts:506`, route `index.tsx:224`; backend `CompaniesApiService.java:63`. [Detailed F2](../evidence/stock-list-filters-notes.md#f2--company-dropdowns-stop-at-the-first-100-records-p2). Scenario SL-008.

### QA-SL-03 — Late preference responses undo newer table changes

Two triggers share unguarded preference hydration. (a) Change grouping, then drag a column while that save is pending: the earlier response restores the old order and cancels the newer drag's unsent debounced save. (b) Start a preference refresh, successfully save a newer grouping, then receive the old read: the UI and Query cache revert to the older grouping. The second case does not prove a database rollback.

Cold preference loading, ordinary persisted drag and already-submitted queued saves pass controls. Evidence: actual table, preference hooks and Query cache with deferred response boundaries. Source: table `219–279`, preference hook `10–42`, route `216–220`. [Detailed F3](../evidence/stock-list-filters-notes.md#f3--preference-hydration-overwrites-newer-user-intent-p2). Scenarios SL-006/027.

### QA-SL-04 — The Flags column loses its saved position

Drag Flags earlier in the table. The frontend submits that order, but the backend's allowed-column list omits `flags`, so normalization drops it. The frontend appends the missing known column at the end when it receives the response; the chosen position is lost.

Evidence: inspected exact Java normalization and executed real UI against an adapter derived from its actual allowlist. Java persistence was not executed for this finding. Source: `PurchaseOrderTablePreferencePolicy.java:12–41,59–70`, client table-state `194–213`. [Detailed F4](../evidence/stock-list-filters-notes.md#f4--flags-drag-position-cannot-survive-server-normalization-p2). Scenario SL-006.

### QA-SL-05 — A shrinking result set strands the operator on an empty page

Open page 2 when 21 records match. Another change reduces the matches to 20. Refresh returns an empty second page with one total page; the UI keeps page 2 but hides Previous/Next. Reproduced for grouped and ordinary lists. Changing sort recovers page 1, but there is no direct pagination recovery.

Evidence: mounted list/query components with response shapes supported by the backend's positive-page/no-upper-clamp logic. No real concurrent edit was executed. Source: route `169,195,295–303,438–443`, table `1066–1071`, `PurchaseOrdersApiService.java:204–223`. [Detailed F5](../evidence/stock-list-filters-notes.md#f5--shrinking-results-strand-a-later-page-and-hide-navigation-p2). Scenarios SL-009/010/027.

### QA-SL-06 — Start shipment uses eligibility from when the box was ticked

Select two eligible Orders at one warehouse. Another operation reserves one; the refreshed row shows its new Shipment, but Start shipment still uses the old eligible selection. Similar observations cover a changed warehouse, no movable collis, unknown location, date rollover and an off-page cache refresh. The reverse also occurs: an Order becomes eligible but the action remains hidden until reticked.

Selected IDs should persist, while action eligibility must reflect the entire current set. The route stores checkbox-time warehouse eligibility separately from current Query data. Evidence does not show an invalid Shipment being saved. Source: route `141,316–334`, table-state `95–103,130–180`. [Detailed selection finding 1](../evidence/stock-list-selection-notes.md#finding-obs-sl-sel-1--current-rows-and-cached-eligibility-diverge). Scenarios SL-015/016/027.

### QA-SL-07 — Start shipment can silently drop selected Orders

Select two eligible Orders and follow Start shipment. The toolbar passes both IDs, but creation reads only the first 100 candidates at that warehouse. If one selected Order is on the next candidate page, the form silently initializes with only the other Order's collis. The same silent reduction occurs when one requested Order has since become unavailable.

The receiving screen must account for every requested ID, preserving eligible selections and explaining unavailable ones. Two selected IDs are sufficient to trigger the pagination defect; the PDF's 100-Order limit is unrelated. The real mapping produces a reduced would-be payload, but **no create request or persisted subset** was tested. Source: shipment service `83–97`, creation hook `109,260–278`, creation mapping `199–215,232–264`. [Detailed selection finding 2](../evidence/stock-list-selection-notes.md#finding-obs-sl-sel-2--complete-url-ids-can-become-an-unexplained-subset-draft). Scenario SL-017.

### QA-SL-08 — The PDF can print superseded declared measurements

Create a colli declared at 10/8 kg and 10×20×30 cm. Before warehouse confirmation, correct it to 20/18 kg and 40×50×60 cm. The print model still uses 10/8 and the old dimensions: it chooses the original DECLARED history record as though it were a warehouse measurement, masking the current declared values.

The actual create/edit path supports this state: creation writes a DECLARED snapshot; pre-stock edits update current fields without updating that history snapshot. Removing the snapshot in the fixture or adding a later full warehouse measurement gives the correct control result. Source: `StockListPdfModelFactory.java:84–137`, `PurchaseOrdersApiService.java:502–511,889–929`, `HandlingUnitRepository.java:145–172`. [Backend evidence](../evidence/stock-list-model-notes.md). Scenarios SL-020/021.

### QA-SL-09 — The PDF can identify a previous transport instead of the latest leg

An older arrived Shipment has CMR-OLD; a newer ready Shipment associated with the Order has CMR-NEW. The PDF model chooses CMR-OLD because the repository sorts every dispatched leg ahead of undispatched legs. It also prints CMR-OLD when the newer leg has no reference, instead of leaving the latest leg's reference blank.

This conflicts with FRO-279's **most recent associated Shipment leg** rule; there is no accepted “latest dispatched only” exception. Pre-dispatch reference entry is supported by the current lifecycle. Evidence: exact repository/service/factory bodies executed with a generic in-memory query adapter, **not real SQL**. Source: `ShipmentRepository.java:101–114`, `StockListPdfService.java:39–42`. [Backend evidence](../evidence/stock-list-model-notes.md). Scenario SL-025.

### QA-SL-10 — Printed External Notes lose deliberate line breaks

Save three short lines: LINE_A, LINE_B, LINE_C. In the rendered PDF, LINE_A and LINE_B sit on the same baseline; LINE_C wraps only because the cell is narrow. FRO-292 requires preserved line breaks. The model keeps them, but escaped `th:text` in normal HTML whitespace collapses them.

Evidence: exact production template/CSS rendered locally with OpenHTMLtoPDF 1.0.10; visual inspection and PDF word positions (A/B top 109.79, C 115.83). Source: `stock-list.html:209`, no newline-preserving CSS. [Synthetic PDF](../evidence/stock-list-pdf/multiline-notes.pdf) · [Image](../evidence/stock-list-pdf/multiline-notes.pdf-1.png). Scenarios SL-022/026.

### QA-SL-11 — A long valid split-Order number overlaps the Client column

The normal seven-digit root PO-0000001 fits. The valid synthetic child PO-0000001_100 overlaps Client because the first cell is fixed-width and forced to `white-space: nowrap`. The child text ends at x=60.02 points; Client starts at 57.90. This violates FRO-279's no-overlap rule. The suffix is a valid format fixture, not a claim that a live family has 100 children.

Evidence: actual template/renderer plus visual and glyph-box checks; ID generation traced to `V1__initial_schema.sql:274` and `PurchaseOrderRepository.java:307`. Source: `stock-list.html:114–119`. [Synthetic PDF](../evidence/stock-list-pdf/split-child-id.pdf) · [Image](../evidence/stock-list-pdf/split-child-id.pdf-1.png). Scenario SL-026.

## Requirement gaps and observations kept separate

1. **FRO-254 control coverage:** it still specifies per-column contains searches and partial textual dates. Current UI/API provide a general search, selected filters and date/range controls rather than all those column controls. Searches found no explicit replacement contract. Some examples refer to retired fields, so restoring them wholesale would be wrong. Reconcile the surviving fields and control ownership before drafting this as additional work; this is not silently counted as another reproduced bug.
2. **Partial later measurements:** a dimensions-only later confirmation makes this PDF fall back to declared weight instead of an older confirmed weight. Reproduced as a separate observation. FRO-299 explicitly resolves latest nonempty confirmed values independently for Shipment consumers; FRO-279's wording does not fully settle cross-record fallback for this PDF. Keep the observation and clarify ownership/expected fallback before promoting it. QA-SL-08's original DECLARED snapshot defect does not depend on this ambiguity.
3. **No missing-CREATE permission defect found:** current option reads were traced to their actual resolvers. Warehouse options use PURCHASE_ORDER_VIEW, and current partner viewer roles have COMPANY_VIEW. This does not establish every deployed user's assignments.

## Agreed correction groups — drafts awaiting review

After discussing all eleven findings individually, the user accepted **three tickets** with the priorities below and requested complete drafts. Each finding retains its own acceptance/verification case. Descriptions and proposed metadata await review; creation is not authorized yet.

| Agreed ticket group | Findings owned | Accepted priority | Reason for grouping |
| --- | --- | --- | --- |
| Stock List — correct filters, pagination and saved table settings | QA-SL-01 compatible Vessel cleared; 02 truncated options; 03 stale preference responses; 04 Flags order; 05 stranded page | Medium | Five bounded list-control/preference problems on the same screen, verified through the same table and saved settings. |
| Stock List → Shipment — keep eligibility current and preserve the complete selection | QA-SL-06 stale eligibility; 07 silent subset handoff | High | One selected set must remain correctly evaluated and fully accounted for from toolbar to creation draft. Missing intended cargo deserves separate tracking. |
| Stock List PDF — correct current values and preserve readable output | QA-SL-08 obsolete measurements; 09 previous transport; 10 note line breaks; 11 overlapping child ID | High | One fixed PDF output contract; wrong operational values drive priority, with two small layout defects verified in the same representative output set. |

Each of QA-SL-01–11 has exactly one draft owner. The [draft index](../../../drafts/stock-list-bugs/README.md) maps all eleven findings and 17 acceptance/verification pairs. No additional umbrella ticket is planned. The two requirement questions above remain outside these correction groups until their scope is resolved. The groups do not change current lifecycle/authority rules, broaden the audit into another entity or imply every case is verified in production.

Current Flow QA and Stock List searches found no exact existing correction owner. Full current FRO-373/375/376 were checked: FRO-373 owns creation origin-change/draft preservation, FRO-375 owns reviewed Details edits/comments, and FRO-376 owns load-unit omission/history. The proposed Shipment group owns Stock List eligibility and the initial complete-set handoff; coordinate its shared creation-hook code with FRO-373 without duplicating that ticket's draft/origin-change work. The proposed PDF group owns PDF readers/template, not load-unit packing mutation/history. FRO-254/279/292 remain current requirement references; their existing scopes are not rewritten by this proposal. Customs Storage Entry remains with the other chat.

Production main rechecked unchanged at 6aa259553cd9c86a8aaa157902088aa9a6bca83e. No new execution was needed for grouping; the bounded evidence below remains applicable. Existing presentation contracts are reused, so no new canvas, preview or production branch is part of this step. No Linear issue was created or modified.

## Verification receipt and limits

| Evidence | Result | Meaning |
| --- | --- | --- |
| Existing table-state and purchase-order-service suites | 30/30, two files | Existing targeted controls passed |
| New selection/handoff suite, parent rerun | 16/16: 7 controls + 9 observations | Actual components/Query plus mocked reads/router boundary |
| New filters/preferences suite, parent rerun | 13/13: 6 controls + 7 observations | Actual controls/hooks; Flags server response is a bounded adapter |
| New PDF preview suite | 4/4 controls | Exact IDs/auth header, failures/retry and popup fallback plumbing |
| Backend exact-source Java17 extraction, parent rerun | 69 controls + 5 observations; 7 static checks | Includes one unpromoted partial-measurement observation; these are assertions, not JUnit methods |
| Local PDF fixtures | Five PDFs, eight pages visually inspected; six PDF checks | Four controls + two formatting observations; exact template CSS/real renderer, synthetic binding |

Frontend total: **63/63** across five files; observation passes reproduce defects, not corrected behavior. Node24.13/Vitest4.1.6/jsdom with cached dependencies, not a clean lockfile install. Real fetch/XHR blocked in component suites. Preview transport uses synthetic responses; native popup behavior is unverified. All 562 copied original client files remained identical to the pinned archive.

Backend tests use actual extracted bodies with DTO/repository/authorization/query stand-ins; they do not execute Spring, real security filters, PostgreSQL, transactions, locks or the project's Java25/Gradle build. Twelve existing backend tests were inspected, not executed. Source playbook loader failed because the archive lacks Git metadata; relevant policies were read directly, without claiming a successful loader snapshot/fingerprint.

PDF fixtures bind escaped synthetic values into the exact template instead of executing Thymeleaf. Local DejaVuSans is registered as DeliveryNoteSans, matching the renderer's font-family choice; deployed font bytes/version are unverified. All generated pages were inspected, including multipage headers/footer, Greek text and a 2000-character note retained across two pages. A local copy matching the approved template attachment's name/size was viewed; no current attachment hash or pixel-perfect branding match is claimed.

Retained [evidence and replay instructions](../evidence/stock-list-evidence.md). Planning records only; no fixes, production branch or deployment. Review the findings with the user before agreeing ticket groups.
