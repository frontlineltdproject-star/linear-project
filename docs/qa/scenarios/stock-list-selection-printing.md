# Stock List scenarios (FLOW-SL)

Read [the expected flow](../flows/stock-list-selection-printing.md) first. Synthetic fixture numbers are test examples, not production counts. Full portal execution is distinct from isolated code tests.

| ID | Priority | Scenario | Expected check | Result |
| --- | --- | --- | --- | --- |
| SL-001 | P0 | Normal authorized selection → PDF | Select several Orders, preview and compare exact IDs/rows with fixed columns. | Not run |
| SL-002 | P0 | Cross-page and group selection | Retain earlier IDs and count while changing pages/groups; no duplicate rows. | Not run |
| SL-003 | P0 | Header checkbox scope | Select/clear the loaded group/page only; correct indeterminate state. | Not run |
| SL-004 | P1 | Filter/sort/group changes | Selected hidden Orders remain intentionally counted and printable. | Not run |
| SL-005 | P1 | Clear and leave/return | Explicit clear empties selection; route departure/return starts empty. | Not run |
| SL-006 | P1 | Column preferences | Drag/hide/reopen retains valid preferences; PDF columns stay fixed. | Not run |
| SL-007 | P0 | Search and compound filtering | Case-insensitive contains and AND across active controls over the complete result set. | Not run |
| SL-008 | P1 | Dropdown option coverage | Authorized Clients/Suppliers/Vessels/Warehouses remain reachable beyond initial option pages. | Not run |
| SL-009 | P1 | Dates, booleans and malformed URL | Validate filter values; distinguish empty from false; invalid inputs fail predictably. | Not run |
| SL-010 | P0 | Loading/empty/query failure | No invented empty result or authoritative partial group count; retain recoverable selection. | Not run |
| SL-011 | P0 | Printing limits | 1 and 100 distinct Orders accepted; empty/duplicate/over-limit IDs rejected predictably. | Not run |
| SL-012 | P0 | Changed selection during pending print | Original request prints original IDs; later selection survives; no mixed attempt. | Not run |
| SL-013 | P0 | PDF failure/retry/navigation | Popup blocked, network/authorization failure, late response and closed preview handled truthfully. | Not run |
| SL-014 | P0 | Partner permission and mixed request | Every selected Order authorized; one missing/unauthorized ID denies entire PDF; no Internal Notes. | Not run |
| SL-015 | P0 | Normal Shipment action eligibility | Only whole eligible selection at one origin with authority can start; mixed printing remains allowed. | Not run |
| SL-016 | P0 | Refreshed Shipment eligibility | Changed reservation/status/warehouse/readiness changes toolbar eligibility without stale handoff. | Not run |
| SL-017 | P0 | Handoff exact IDs | Start shipment receives complete current selection/origin; no eligible-subset shortcut. | Not run |
| SL-018 | P0 | Current membership and terminal goods | Print each selected Order once; include its current nonterminal goods only, including after split. | Not run |
| SL-019 | P0 | Zero collis/missing measurements | Zero-colli Order retained with blank measurements; missing and actual zero distinguished. | Not run |
| SL-020 | P0 | Weight and volume precedence | Mixed declared/warehouse measurements resolve independently and aggregate correctly. | Not run |
| SL-021 | P0 | Packing and retired PCS | Types/dimensions retained and identical descriptions grouped; no PCS or dangling placeholder. | Not run |
| SL-022 | P0 | External Notes confidentiality | Distinct Internal/External and empty External fixtures; only escaped External appears. | Not run |
| SL-023 | P0 | DG aggregation | DG without class counts; terminal-only DG and split-away DG do not. | Not run |
| SL-024 | P0 | Current and unknown warehouse | Hub/Position match the applicable stay; unknown clearly marked, no fabricated location. | Not run |
| SL-025 | P0 | Latest transport reference | Multiple legs/cancellation/missing references do not misattribute AWB/BL/CMR; unresolved meanings recorded. | Not run |
| SL-026 | P1 | PDF layout and languages | Long EN/EL names/notes/packing, empty values and multi-page output stay readable with headers/footer. | Not run |
| SL-027 | P1 | Parallel refresh/user change | Selection/query/cache handling does not retain unauthorized prior-user context or corrupt newer work. | Not run |
| SL-028 | P0 | Read-only generation | Generating/reading PDF changes no business record, movement, reservation or document state. | Not run |

Record environment/build, actor/scope, fixture identities, actions, expected/actual values and evidence before changing a result. Isolated observations belong in the run report and do not mark these full scenarios Pass. Customs Storage Entry and other entity reviews remain separate.

## Isolated evidence and future regression variations

The [9 November review](../runs/2026-11-09-stock-list-selection-printing.md) records 11 findings. All full scenarios above remain Not run; the retained tests execute bounded components/models/renderer fixtures only.

| Scenario | Add this variation when testing a correction | Finding |
| --- | --- | --- |
| SL-007/008 | Remove Client restriction while keeping a compatible Vessel | QA-SL-01 |
| SL-008 | Search an authorized client/supplier beyond first100 and its vessel | QA-SL-02 |
| SL-006/027 | Earlier grouping save settles during a newer drag; earlier read settles after newer save | QA-SL-03 |
| SL-006 | Reorder Flags, wait for server response, then reopen | QA-SL-04 |
| SL-009/010/027 | Page2 loses its last match; only page1 remains, in both grouping modes | QA-SL-05 |
| SL-015/016/027 | Selected/off-page Order changes eligibility, warehouse or date validity before Start shipment | QA-SL-06 |
| SL-017 | One of two requested Orders lies beyond candidate page1 or has become unavailable | QA-SL-07 |
| SL-020/021 | Edit declared values after original DECLARED snapshot but before stock confirmation | QA-SL-08 |
| SL-025 | Newer ready leg with saved/empty reference alongside older dispatched leg | QA-SL-09 |
| SL-022/026 | Several short External Notes lines that would fit side by side | QA-SL-10 |
| SL-026 | Valid long split child ID beside nonempty Client | QA-SL-11 |

Partial later warehouse measurements and the surviving FRO-254 per-column control requirements stay explicit clarification items in the report; do not convert them to settled acceptance criteria without resolving their scope.

The user accepted three correction groups: S1 owns QA-SL-01–05; S2 owns QA-SL-06/07; S3 owns QA-SL-08–11. [Complete ticket drafts](../../../drafts/stock-list-bugs/README.md) contain 17 acceptance/verification pairs and await review. This changes ticket ownership, not scenario execution status; all 28 remain Not run.
