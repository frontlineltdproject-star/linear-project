# Flow QA consolidation proposal — 9 November 2026

Proposal only. No Linear changes authorized or performed. Current full issues FRO-373–395 and navigation owners were fetched during this review. All 23 Flow QA issues are Backlog, with no blocking relations in their returned relation sets. Production main remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

## Grouping principle

Group by entity and a coherent operator workflow. Similar symptoms across entities do not prove a shared root cause. Retain independent acceptance criteria and evidence limits for every original finding. Grouping reduces board items, not implementation work.

## Proposed 16 QA work items

| Proposed scope | Current issues | Agreed additions |
| --- | --- | --- |
| Shipment forms and arrival access | FRO-373 | bugs.md #8: Overview Record arrival opens existing form in dialog; retain Available actions and guards. #7 already covered. |
| Order colli editing and validation | FRO-374 | #4: reported dimensions/gross/net cannot be edited after local row Save; no final Create pressed; cause unverified. |
| Order/Shipment reviewed saves and comment retries | FRO-375 | None |
| Shipment packing data and journey history | FRO-376 | None |
| Creation upload 401 investigation and repair | FRO-377 | #5 already covered |
| Supplier Invoice creation, correction and cancellation reliability | FRO-378 + FRO-379 + FRO-380 | None; retain separate backend vessel-identity/audit checks |
| Delivery Note draft editing and lifecycle recovery | FRO-381 + FRO-382 | None; preserve replacement, pending submission and cancellation evidence boundaries |
| Delivery Note XML/PDF movement-time consistency | FRO-383 | None |
| Export creation and Details reliability | FRO-384 + FRO-385 | None; VAT remains separate |
| Shipment Invoice creation/replacement/recovery and layout | FRO-386 | #9: standard entity-page width/alignment, existing card sequence/behavior |
| Shipment Invoice goods, totals, review and physical packing | FRO-387 | #10: automatic final shipping packages and weight from selected goods; manual values when accurate calculation is unavailable |
| Print ΥΔ selection and attempt handling | FRO-388 | None |
| VAT stamping confirmations and uncertain-attempt recovery | FRO-389 + FRO-390 | None; individual and bulk paths remain explicit |
| Customs Storage Entry creation/editing and Order relationships | FRO-391 + FRO-392 | None; new Order customs-requiredness rule remains separate |
| Stock List controls and complete Shipment handoff | FRO-393 + FRO-394 | None; FRO-373 retains later origin-change/draft ownership |
| Stock List PDF data and readability | FRO-395 | None |

All 23 original IDs occur exactly once in this mapping. Six merged groups remove seven active work items. Ten existing issues remain distinct (four gain the agreed additions).

## Three separate new scopes

1. **Order customs regime can be unknown at creation (#1).** Require a recorded regime and verified receiving-warehouse compatibility before stock confirmation/storage admission. Unknown is not Free circulation and must not imply compatibility. Reconcile FRO-356/335 and affected consumers when drafting; no blanket mock backfill or schema/API design inferred here.
2. **Readiness follow-up after successful automatic request (#6).** Initial request is automatic. Manual Request readiness date requires successful initial automatic sending, not mere scheduled-record existence. Preserve no-second-pending reminder and unchanged authorization, review and other eligibility rules. Reconcile FRO-328; no email sends authorized.
3. **Supplier Invoice searchable list and menu (#2 gap).** Main-menu list, row-to-Details navigation and authorized Create. Separate discoverability work from existing operation-reliability fixes.

Existing navigation owners remain FRO-368 (Exports), FRO-371 (Shipment Invoices), FRO-358 (Customs Storage), FRO-361 (Delivery Notes). Retain their complete non-navigation scope. Delivery Note creation remains within Shipment. These four are not part of the 23-ticket QA baseline.

**Counts:** 23 QA issues -> 16 QA work items; add three separate scopes -> 19. Including the four existing navigation tickets, this review touches 23 future active items versus 27 existing QA-plus-navigation items, while adding the newly agreed requirements. It is not a total-board count.

## Accepted decisions and drafting gates

- #3 readiness-controls redesign is deferred; no work item now.
- #10 uses final shipping packages, not original colli count; when accurate selected-goods attribution/weight is unavailable, allow manual values. Do not guess proportions or double-count shared packages. Exact calculation, missing-data display, manual override lifecycle, draft recalculation and finalization behavior require detailed reconciliation before a complete ticket can be approved.
- FRO-380 currently explicitly says keep its backend correction separate. Merging it is a proposed organizational change requiring user acceptance; it does not establish shared code with frontend fixes. Likewise remove obsolete companion-ticket exclusions when preparing approved consolidated descriptions.
- FRO-386/387 remain separate: combining eight findings plus layout and new physical calculations would obscure independent acceptance. Keep fiscal time serialization, PDF rendering, upload diagnosis and packing history separately verifiable.
- Keep a per-finding coverage map when drafting, including acceptance and read-only post-deployment checks. Preserve evidence strength: reported failures, isolated reproductions and unverified database/deployment claims must not be conflated.
- Reuse existing IDs where suitable; no survivor choice, cancellation, duplicate marking, label/priority/status or relation change approved yet. Retired tickets must retain their history and point to a verified replacement; do not delete them. Reconcile relations and preserve attachments when executing approved changes.
- Approval of this grouping is not approval to write full descriptions or close merged tickets. Show complete revised descriptions and metadata first. No production changes.
