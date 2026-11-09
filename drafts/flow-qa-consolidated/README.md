# Consolidated Flow QA drafts — review package

**Release assignment:** all 19 active issues are in milestone **0.0.14 (Flow QA)** of [Pre-releases 0.0.x](https://linear.app/front-line-ltd/project/pre-releases-00x-6f378d1fb37e), with **Ready** replacing Pending_Review. Verified 9 November 2026; statuses remain Backlog. The seven Duplicate sources are excluded.

**Applied to Linear on 9 November 2026**, following the user's instruction to proceed without review. The proposal below is retained as the approval baseline. Sixteen existing tickets were updated, seven sources marked Duplicate, and new FRO-396 (customs), FRO-397 (readiness follow-up), FRO-398 (Supplier Invoice list) created. All 19 active tickets are Backlog. Saved descriptions, complete labels, priorities, relations, duplicate targets and attachment preservation were verified; see [APPLIED.json](APPLIED.json). No production changes.

Prepared 9 November 2026. **19 complete description drafts; no Linear writes.** Grouping is accepted; descriptions, retained IDs, labels and retirement actions below remain proposals for review.

## Review map

| Draft | Proposed retained ID | Existing scope consolidated | Agreed additional scope |
| -- | -- | -- | -- |
| [Shipment forms — preserve drafts & expose Record arrival](373.md) | FRO-373 | FRO-373 | #8 Overview arrival; #7 already covered |
| [Order colli forms — edit saved creation rows & validate measurements](374.md) | FRO-374 | FRO-374 | #4 numeric editing after row Save |
| [Order & Shipment — prevent stale overwrites and duplicate comment retries](375.md) | FRO-375 | FRO-375 | — |
| [Shipment packing — preserve omitted net weight and historical journey details](376.md) | FRO-376 | FRO-376 | — |
| [Order & Shipment creation — diagnose and resolve attachment upload 401](377.md) | FRO-377 | FRO-377 | #5 upload refusal already covered |
| [Supplier Invoice — reliable creation, correction & cancellation](378.md) | FRO-378 | FRO-378, FRO-379, FRO-380 | — |
| [Delivery Notes — preserve drafts & recover lifecycle actions](381.md) | FRO-381 | FRO-381, FRO-382 | — |
| [Delivery Notes — keep movement dates and times consistent in XML and PDF](383.md) | FRO-383 | FRO-383 | — |
| [Export — preserve drafts, reviewed changes & operation recovery](384.md) | FRO-384 | FRO-384, FRO-385 | — |
| [Shipment Invoice — creation, replacement, recovery & consistent layout](386.md) | FRO-386 | FRO-386 | #9 standard page width |
| [Shipment Invoice — goods, totals, review & automatic packing](387.md) | FRO-387 | FRO-387 | #10 final-package count & gross weight |
| [Print ΥΔ — protect selections and print attempts](388.md) | FRO-388 | FRO-388 | — |
| [VAT stamping — reviewed confirmations & uncertain-attempt recovery](389.md) | FRO-389 | FRO-389, FRO-390 | — |
| [Customs Storage Entry — reliable drafts, recovery & Order relationships](391.md) | FRO-391 | FRO-391, FRO-392 | — |
| [Stock List — reliable controls & complete Shipment handoff](393.md) | FRO-393 | FRO-393, FRO-394 | — |
| [Stock List PDF — correct current values and preserve readable output](395.md) | FRO-395 | FRO-395 | — |
| [Unknown Order customs regime](17-order-customs.md) | New | — | #1 |
| [Readiness follow-up](18-readiness-follow-up.md) | New | — | #6 |
| [Supplier Invoice list/menu](19-supplier-invoice-list.md) | New | — | #2 missing entity |

The 23 QA tickets become 16 QA work items. Three new scopes bring this package to 19. Existing list/menu owners FRO-368 (Exports), FRO-371 (Shipment Invoices), FRO-358 (Customs Storage) and FRO-361 (Delivery Notes) remain separate and unchanged: 23 affected future items including those four, not a total-board count. Delivery Note creation stays within Shipment. Item #3 is deferred.

## Metadata proposed for review

All retained issues stay **Backlog**; retain no assignee/project/parent where currently absent. Keep all existing nonexclusive labels from merged sources. One Type = Story; one Area as listed. Keep Bug, Flow QA, Pending_Review and relevant entity labels. No new blocking dependency is proposed. Exact baseline and proposed label/relation sets are in [metadata.json](metadata.json).

| Retained ID | Priority | Area |
| -- | -- | -- |
| FRO-373 | High | Frontend |
| FRO-374 | Medium | Frontend |
| FRO-375 | High | Frontend |
| FRO-376 | Medium | Backend |
| FRO-377 | High | Integration |
| FRO-378 | High | Integration |
| FRO-381 | High | Integration |
| FRO-383 | Medium | Backend |
| FRO-384 | High | Frontend |
| FRO-386 | High | Frontend |
| FRO-387 | High | Integration |
| FRO-388 | Medium | Frontend |
| FRO-389 | High | Frontend |
| FRO-391 | High | Frontend |
| FRO-393 | High | Integration |
| FRO-395 | High | Backend |

Supplier Invoice merges frontend correction/recovery with backend identity/audit: Area becomes Integration. Delivery Notes also span frontend/backend lifecycle work. Stock List includes server preference normalization and complete handoff: Integration; priority High reflects the handoff source. Other priorities use the highest existing priority in each group.

New issues: Backlog, unassigned, no project/parent, no blocking relation. Proposed complete labels:
- Customs: Story, Integration, Improvement, Flow QA, Pending_Review, Order.
- Readiness: Story, Integration, Improvement, Flow QA, Pending_Review, Order.
- Supplier Invoice list: Story, Frontend, Feature, Flow QA, Pending_Review, supplier invoice.
Proposed priority: Medium for all three. Related references: customs FRO-335/356; readiness FRO-328; list FRO-321/347/348 and retained FRO-378.

## Proposed retirement and relation handling

After the retained descriptions have been approved, saved and verified, mark these source tickets Duplicate with the retained target: 379→378, 380→378, 382→381, 385→384, 390→389, 392→391, 394→393. Keep their descriptions and history; never delete them. This package authorizes no such writes.

Union related links onto each survivor, remapping retired targets to survivors and excluding self-links. Existing sources have no returned blocking relations or attachments. Re-read all affected issues immediately before any future write; concurrent changes must be reconciled, not overwritten. Preserve external inbound references by retaining retired issues and their destination links. Verify labels, relations, attachments and description after saving; account for automatic relations added by Linear mentions.

## Coverage of every original finding

Acceptance and deployment checks remain under named workflow subsections in merged descriptions. Numbered criteria restart per subsection; criterion numbers are interpreted within that subsection.

| Source | Findings / cases retained | Draft and subsection |
| -- | -- | -- |
| FRO-373 | 1. Origin change; 2. Independent Notes; 3. Arrival draft | [FRO-373](373.md) — Shipment forms |
| FRO-374 | 1. Stock-entry crash; 2. Misleading validation | [FRO-374](374.md) — Colli editing |
| FRO-375 | 1. Order retry; 2. Packing review; 3. Comment retry | [FRO-375](375.md) — Reviewed saves and retries |
| FRO-376 | 1. Hidden net weight; 2. Earlier loading context | [FRO-376](376.md) — Packing data and history |
| FRO-377 | 401 stage diagnosis; QA-OS-03/04 contract clarifications | [FRO-377](377.md) — Upload investigation |
| FRO-378 | QA-SI-01 — replacement during creation; QA-SI-02 — cancelled lookup; QA-SI-03 — failed return | [FRO-378](378.md) — Creation and files |
| FRO-379 | QA-SI-04 — cancellation recovery; QA-SI-05 — unreviewed cancellation; QA-SI-06 — later typing | [FRO-378](378.md) — Details and cancellation |
| FRO-380 | QA-SI-07 same-name vessel identity and activity | [FRO-378](378.md) — Vessel identity and activity |
| FRO-381 | QA-DN-01a — refreshed version; QA-DN-01b — delayed save | [FRO-381](381.md) — Movement drafts |
| FRO-382 | QA-DN-02 — blocked replacement; QA-DN-03 — inaccessible reconciliation; QA-DN-05 — uncertain cancellation | [FRO-381](381.md) — Cancellation, replacement and submission |
| FRO-383 | QA-DN-04 movement date/time serialization | [FRO-383](383.md) — Movement time |
| FRO-384 | QA-EX-01 — lost work; QA-EX-02 — misleading discard; QA-EX-03 — changing files during creation | [FRO-384](384.md) — Creation and files |
| FRO-385 | QA-EX-04 — unreviewed version; QA-EX-05 — later work erased; QA-EX-06 — unknown treated as failure | [FRO-384](384.md) — Details and Customs actions |
| FRO-386 | QA-SHI-01 — replacement defaults; QA-SHI-04 — uncertain creation; QA-SHI-07 — reconciled discard; QA-SHI-08 — saved navigation | [FRO-386](386.md) — Creation and recovery |
| FRO-387 | QA-SHI-02 — hidden frozen lines; QA-SHI-03 — stale review; QA-SHI-05 — unavailable value; QA-SHI-06 — selection lost on regrouping | [FRO-387](387.md) — Goods and packing |
| FRO-388 | QA-VAT-01 — newer selection lost; QA-VAT-02 — old PDF error; QA-VAT-03 — print selection | [FRO-388](388.md) — Printing |
| FRO-389 | QA-VAT-03 — bulk selection; QA-VAT-04 — unreviewed version; QA-VAT-05 — pending date; QA-VAT-09 — older displayed progress | [FRO-389](389.md) — Confirmations and progress |
| FRO-390 | QA-VAT-06 — bulk false certainty; QA-VAT-07 — individual recovery lost; QA-VAT-08 — different date accepted | [FRO-389](389.md) — Uncertain attempts |
| FRO-391 | QA-CSE-01; QA-CSE-02; QA-CSE-03; QA-CSE-04; QA-CSE-05; QA-CSE-06; QA-CSE-09 | [FRO-391](391.md) — Drafts and saved outcomes |
| FRO-392 | QA-CSE-07; QA-CSE-08; QA-CSE-10 | [FRO-391](391.md) — Order relationships and admission actions |
| FRO-393 | QA-SL-01 — Vessel cleared; QA-SL-02 — missing options; QA-SL-03 — newer settings lost; QA-SL-04 — Flags position; QA-SL-05 — stranded page | [FRO-393](393.md) — List controls and settings |
| FRO-394 | QA-SL-06 — stale eligibility; QA-SL-07 — silent subset | [FRO-393](393.md) — Shipment selection and handoff |
| FRO-395 | QA-SL-08 — old measurements; QA-SL-09 — old transport; QA-SL-10 — collapsed notes; QA-SL-11 — overlapping ID | [FRO-395](395.md) — PDF data and layout |

## Consumer impact and ownership

| Consumer / affected area | Current behavior and source | Required outcome | Owner |
| -- | -- | -- | -- |
| Order creation and shared customs validation | OrderCustomsRules.requireConsistent rejects null for Greece = Yes; creation-draft derives warehouse options | Allow unknown pre-admission registration; supplied regime still validated | New customs draft |
| Direct/historical stock and warehouse Shipment callers | requireStorageAdmission rejects null and checks receiving warehouse; existing early transfer guards | Keep admission/transfer protection, test every shared caller; no permissive null leak | New customs draft |
| Order Details/list, customs audit/shared registrations | order-customs-regime.md has missing-value display and guarded corrections | Preserve truthful missing state, correction availability and historical/shared rules | New customs draft |
| Readiness eligibility/preparation/send | CommandService uses existence of scheduled request | Require same-Order automatic ASK_READINESS_DATE delivery SENT at read and submit | New readiness draft |
| Automatic delivery/history | Repository records SENT on provider ACCEPTED | Preserve automatic scheduling/retry; no invented receipt/read requirement | New readiness draft |
| Supplier Invoice list query and navigation | Existing paginated API, no client list route; existing Create/Details | Invoice-number searchable menu list → Details/Create | New list draft |
| Shipment arrival | Existing form under Available actions; no Overview action | Same form, guards and draft through Overview dialog | FRO-373 |
| Local colli row and Create payload | Existing editing wiring; reported typing failure remains unexplained | Actual numeric edit after row Save, submitted current values | FRO-374 |
| Shipment Invoice creation shell | Extra max-w-5xl within shared max-w-[100rem] shell | Standard entity width; unchanged card behavior | FRO-386 |
| Invoice goods → final load units → physical totals | GoodsReader resolves allocations; existing manual packing text/weight | Distinct final-package count; attributable gross weight; manual fallback | FRO-387 |
| Invoice draft evaluation, fingerprint, replacement, finalization | Existing fields included in review; finalization freezes them | Current automatic/manual values reviewed together; stale review rejected | FRO-387 |
| Finalized/cancelled invoice reads and documents | Frozen fields and line positions already persisted | Preserve terminal values, including deleted live-row references | FRO-387 |
| Other 23-ticket QA consumers | Per-workflow Context for agents and original evidence retained in each draft | Preserve each original acceptance criterion and scope boundary | Respective consolidated draft |
| Other entity menu/list work | Existing FRO-368/371/358/361 scopes | Remain separately owned; no duplicate implementation | Existing four navigation owners |

Source revision remains main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Existing isolated QA evidence is not production reproduction or fix verification. No production records were changed or business actions exercised.

## Review decisions and remaining gates

- Gross weight and retaining manual values for renewed review after goods/packing changes are explicitly accepted.
- Proposed presentation details for review: automatic packing text states package count; explicit recalculation replaces manual input; Supplier Invoice list columns/default include active and cancelled records. These are draft choices, not prior user decisions.
- Scope references to Done design/entity tickets do not reopen them or silently change their descriptions. The new accepted customs/readiness/automatic-packing contracts take precedence for this implementation scope. Any separate reference-ticket wording edits require their own exact review.
- Upload diagnosis still contains its existing explicit contract questions (QA-OS-03/04). The 401 cause is unknown; consolidation does not resolve it.
- Existing component/layout reuse skips duplicate canvas/preview for the unchanged QA presentation and the width correction. Overview dialog placement, new Supplier Invoice list presentation and automatic/manual packing feedback still need focused design review before implementation; no preview or UI branch was produced.
- Workflow: preflight complete; grouping/primary behavior decisions accepted; source/spec consolidation complete to draft level; descriptions prepared for review; Linear write gate pending; production branch outside scope; memory/synchronization recorded.
- Full descriptions are in the linked files and [ALL-DRAFTS.md](ALL-DRAFTS.md). Review them in batches before approving any Linear write. This package is not approval to create, update, close or mark tickets duplicate.
