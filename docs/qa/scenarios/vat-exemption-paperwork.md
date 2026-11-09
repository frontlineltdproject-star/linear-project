# VAT paperwork scenarios

Source: [FLOW-VAT](../flows/vat-exemption-paperwork.md), current FRO-317/321/348/352 and pinned production main. P0 protects facts/events/ownership; P1 covers routine presentation and recovery. Synthetic fixture values are examples, not production facts. All entries initially Not run; isolated observations do not mark full portal journeys Pass.

| ID | Priority | Scenario | Expected result | Full portal run |
| --- | --- | --- | --- | --- |
| VAT-001 | P0 | Υ.Δ. with positive/zero VAT; other types; no Υ.Δ. but retained protocol | Type controls applicability; printing/events do not allocate another protocol | Not run |
| VAT-002 | P0 | Print one invoice at Awaiting EAD, Awaiting IE599 and Completed | Correct read-only output at each active stage | Not run |
| VAT-003 | P0 | Print six or more invoices across Suppliers/companies | Maximum five per document; exact groups; no mixing Exports | Not run |
| VAT-004 | P1 | Generate each of the three templates with Greek/long/missing optional fields | Correct office, fixed/blank fields, readable non-clipped data and protocol | Not run |
| VAT-005 | P0 | Print nonmember, cancelled or non-Υ.Δ. invoice; invalid Export/template | Authoritative rejection; no data leak or mutation | Not run |
| VAT-006 | P0 | Change print selection/template during delayed generation | Result/PDF agrees with the accepted generation; no mixed request state | Not run |
| VAT-007 | P1 | Generate/open failure, blocked popup, close/reopen, retry | Truthful feedback, preserved relevant selection and correct document owner | Not run |
| VAT-008 | P1 | Change saved invoice/Export facts between generations | Regeneration uses saved data; no draft facts or unintended status change | Not run |
| VAT-009 | P0 | Individual dispatch from Not started after positive IE599 | Correct date/Export/status/actor/activity, exactly once | Not run |
| VAT-010 | P0 | Individual return then onward sending | Valid ordered events; Exempted preserved after sending | Not run |
| VAT-011 | P0 | Dispatch before IE599; physical dispatch date before IE599 but after invoice date | Block missing prerequisite; allow valid earlier physical date after prerequisite exists | Not run |
| VAT-012 | P0 | Missing/future/before-minimum dates, Athens day boundary | Shared chronology rules; no partial saved effects | Not run |
| VAT-013 | P0 | Wrong type/cancelled invoice/wrong or cancelled Export | No mutation; clear reason | Not run |
| VAT-014 | P0 | Same-event same-date retry; different-date repeat; duplicate click | No duplicate event/audit; ordinary dates not overwritten | Not run |
| VAT-015 | P0 | Single dialog open, background invoice refresh, then confirm | Reviewed intent/version preserved or explicit renewed review | Not run |
| VAT-016 | P0 | Individual response lost; close/reopen/tab/navigation/check | Original invoice/event/date context and recovery retained | Not run |
| VAT-017 | P0 | Individual recovery sees another actor's event or read error | No false attribution, failure certainty or replacement before reconciliation | Not run |
| VAT-018 | P0 | Date changes while single confirmation pending; delayed reply/new stage | Response cannot erase or falsely apply newer intent | Not run |
| VAT-019 | P0 | Bulk dispatch/return/send for two eligible invoices | Same canonical events as individual route; only selected invoices change | Not run |
| VAT-020 | P0 | Bulk mixed stages/dates, deleted membership and already-recorded items | Accurate per-invoice recorded/replayed/rejected outcomes; rejected/unselected unchanged | Not run |
| VAT-021 | P0 | Bulk response lost, selection/date changes, close/reopen and retry | Preserve original attempt; no false “nothing changed,” new payload or duplicate events | Not run |
| VAT-022 | P0 | Background refresh changes stage/membership while bulk dialog open | Eligibility/selection coherent; explicit intended target set | Not run |
| VAT-023 | P0 | Delayed bulk completion followed by another dialog/action | Completion belongs to original action; no erased newer dialog/selection | Not run |
| VAT-024 | P1 | Tabs/language changes, empty stage lists, one or all selected | Correct counts, separate selections and retained input | Not run |
| VAT-025 | P0 | Individual event versus Export bulk event concurrently | Lock/version/replay controls; exactly one event with accurate outcome | Not run |
| VAT-026 | P0 | Staff without authority / partner via UI and each API/PDF route | Server denies data/mutation appropriately | Not run |
| VAT-027 | P0 | Late Υ.Δ. invoice added to Completed Export | Its own stage; protocol reused and both views refresh | Not run |
| VAT-028 | P0 | Print/upload/events while checking Customs, membership, protocol and Orders | No unintended changes to those facts or physical Shipment participation | Not run |
| VAT-029 | P0 | Inject failure around event/audit persistence | Atomic rollback; truthful result; no partial event history | Not run |
| VAT-030 | P1 | Re-open saved invoice/Export and compare activity/dates/status | Same canonical facts and readable history in both entry points | Not run |

## Isolated evidence — 9 November 2026

The [review report](../runs/2026-11-09-vat-exemption-paperwork.md) maps QA-VAT-01–09 to these scenarios. Full portal status above is unchanged: mounted components, memory-router transitions and extracted Java methods do not execute a complete authenticated workflow.

- Print observations: VAT-005–008; bounded controls for eligibility, templates, stages and separation.
- Individual stamping: VAT-009–018, limited synthetic competing-writer state for VAT-025, UI permissions/eligibility for VAT-026.
- Bulk stamping: VAT-019–024/030, synthetic response preservation for VAT-028 and capability visibility for VAT-026.
- Backend extracted controls: date/stage/replay/version/per-item guards and selected Υ.Δ. grouping, max-five split and no printing writes. Stand-in authorization/repositories do not verify HTTP permissions, SQL, actual concurrency or rollback.
- Actual PDF rendering/long-value layout, native browser behavior, persisted history and deployment equivalence remain pending. Do not mark VAT-004/025/026/029 or any full flow passed from these isolated checks.

The audit report will link each finding to these stable IDs and record separately which isolated tests were executed, with their source/environment limitations.
