# Customs Storage Entry scenarios

Defined before defect testing on 9 November 2026 from [the expected flow](../flows/customs-storage-entry.md) and current FRO-319/353/354/355. P0 protects identity, authority or saved data; P1 covers other important behavior. Synthetic fixtures only for mutations. Export/VAT operations and FRO-358 UI/outputs excluded.

All complete portal scenarios initially **Not run**. Record isolated tests and source traces separately from end-to-end execution.

| ID | Priority | Given / action | Expected outcome |
| --- | --- | --- | --- |
| CSE-001 | P0 | Eligible admitted Order; prepare, create, open saved record and return | One entry/number, entered values and original Order context; card becomes Open |
| CSE-002 | P0 | Partner, no-view staff and view-only staff | No unauthorized read/action; view-only existing entry works without editing |
| CSE-003 | P0 | Loading, failed and unexpected Order-card lookup | No Create from failure; explicit loading/error/Retry |
| CSE-004 | P1 | Each ineligibility combination and no invoice/Supplier/Export | Correct first reason; optional related records do not block |
| CSE-005 | P0 | Parent admitted, later split child/grandchild; entry before/after split | Same inherited entry, actual owner and unchanged original admission totals |
| CSE-006 | P0 | Split before admission; later independent admissions | Independent eligibility/entries; no family-only inheritance |
| CSE-007 | P0 | Covered child re-admitted elsewhere or cancelled | Inherited entry still opens; no duplicate entry based on copied timestamps |
| CSE-008 | P1 | Preselected eligible/ineligible/covered/missing/denied Order | Correct exact-ID selection or notice, no substituted Order |
| CSE-009 | P1 | Search, quick query/selection changes and delayed responses | Current eligible result only; stale responses cannot retarget draft |
| CSE-010 | P1 | Manual values/prefill edits, switch Order, tabs and language | Agreed prefill confirmation/preservation; no silent lost manual work |
| CSE-011 | P1 | Required/future entry time, future MRN date, leading-zero tariff and text limits | Client/server validation agree; Athens date handling and trimmed/cleared text correct |
| CSE-012 | P0 | Double Create and concurrent create for same Order | One saved entry/number; other result identifies existing record without overwrite |
| CSE-013 | P0 | Lost Create response, delayed/failed lookup, retry, navigation/remount | Preserve original attempt/draft; do not assert failure or success without evidence |
| CSE-014 | P0 | Save succeeded but opening Details rejects asynchronously | Retain saved identity and retry navigation without creating again |
| CSE-015 | P1 | Unsaved draft, Back/Cancel/browser navigation and dismissal | Required discard protection; dismissal preserves draft |
| CSE-016 | P0 | Direct Details, inherited entry and inaccessible/missing/error response | Correct record/owner/return provenance; distinct read states |
| CSE-017 | P0 | Edit one card, tabs/language/refresh while dirty or saving | One editor; preserved input; pending controls cannot silently lose accepted edits |
| CSE-018 | P0 | Omitted, explicitly cleared, changed and unchanged entry values | Intended partial update only; unchanged save produces no new audit/version |
| CSE-019 | P0 | Another user edits or moves entry during local edit/confirmation | Submit reviewed version; refuse stale state and retain draft for review |
| CSE-020 | P0 | Unknown details-save or Change Order result; read/retry/reopen | Reconcile original attempt; no misleading no-change or success claim |
| CSE-021 | P0 | Change to current owner, covered child, covered other Order, invalid or eligible target | Server eligibility enforced; no unauthorized or partial move |
| CSE-022 | P0 | Confirm eligible Change Order to another warehouse | Number/owned values preserved; new derived facts; warning/review and refreshed old/new lookups |
| CSE-023 | P1 | Owner lacks depositor/Supplier or one admitted weight | Explicit missing/Unknown; no Client substitution or partial weight total |
| CSE-024 | P0 | Split/dispatch/terminal disposition after admission | Original admitted count/weight retained; inherited access never substitutes child invoices |
| CSE-025 | P1 | Zero/multiple active storage invoices, cancellation/type changes, EUR/non-EUR and rounding | Correct matching set, row currency, no empty total, total rounded once |
| CSE-026 | P1 | Entry reads changing invoice membership and linked Export facts | Current owner-only facts and coverage; source flows untouched |
| CSE-027 | P0 | No invoices, some/unassigned/all assigned, later invoice, cancelled invoice | Correct active-case rule independent of physical/Customs/VAT stages |
| CSE-028 | P0 | Regime/Greece change or last-colli termination with owned/covered entry | Correct owner/covered guards; refusal writes nothing |
| CSE-029 | P0 | Refused/create/edit/move/no-op operations and actor changes | Appropriate atomic audit, version and numbering; no history rewrite |
| CSE-030 | P1 | EN/EL, keyboard, date controls, narrow viewport and read-only tabs | Accessible controls, no clipped essential content; pending FRO-358 affordances excluded |

## Initial execution register

All 30 full portal journeys remain **Not run**. The [review](../runs/2026-11-09-customs-storage-entry.md) records isolated evidence for portions of them:

| Scenarios | Evidence / remaining boundary |
| --- | --- |
| 001, 003, 004, 008–010 | Existing UI controls, Create probes and actual stock-form/shortcut reproduction; backend eligibility controls use supplied admission resolutions. QA-CSE-01/09/10. |
| 002, 007, 016 | Existing card controls, actual domain roles/company predicates and direct/inherited lookup with fixture admissions; real authenticated sessions and temporal resolver remain unrun. QA-CSE-08. |
| 005, 006, 023, 024 | Temporal admission/measurement SQL source trace and fixture-derived facts; no real admission SQL/stock history execution. |
| 011, 018, 019 | Existing validation/mapping tests, actual-source backend fields/partial/no-op/stale checks and refreshed UI payload observations. QA-CSE-02. |
| 012, 029 | Sequential existing-entry refusal, audit map/version checks and source-only unique counter/transaction review; true concurrent create/induced rollback unrun. |
| 013–015, 017, 020 | Lost-response/deferred-save/async-navigation probes, real memory-router leave/remount, Cancel/Back controls. QA-CSE-03/04/05/06. No actual server timeout/write or native browser failure. |
| 021, 022 | Actual-source move guards and fixture persistence, rendered confirmation/warehouse timing and coverage-banner observations. QA-CSE-07/08. |
| 025–027 | Actual-source owner invoice filtering, rounding/currency and active-case controls with synthetic source repositories; excluded source operations are not executed. |
| 028 | Actual-source Order guards and caller source trace; complete Order transaction unrun. |
| 030 | Existing EN/EL/keyboard component tests and Create locale preservation; full native browser, responsive layout and visual checks unrun. |

Observation assertions reproduce defects; their passing result is not a scenario Pass. The injected inherited-lookup-during-Create branch has no established reachable sequence and is excluded from findings.

## Correction draft coverage

The accepted [two-ticket grouping and full drafts](../../../drafts/customs-storage-entry-bugs/README.md) assign every finding once: D1 owns QA-CSE-01–06/09 (10 acceptance/check pairs), D2 owns QA-CSE-07/08/10 (6 pairs). Both remain drafts awaiting approval, with existing tickets as references only and FRO-358/Export/VAT excluded. Drafting does not change any execution status above.
