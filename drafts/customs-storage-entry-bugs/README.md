# Customs Storage Entry — correction tickets FRO-391 and FRO-392

The user reviewed the complete drafts and explicitly approved creating both tickets with the proposed priorities and labels, including Flow QA, on 9 November 2026. **Created and re-read as FRO-391 and FRO-392.** The numbered description files are unchanged from reviewed commit `296b99a`. Existing tickets remain references only and FRO-358 stays out of scope.

## Approved descriptions and saved metadata

Both: **Front Line LTD (FRO) · Backlog**. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or documents. Related references only; no blocks, blockedBy or duplicate relation, and no blocking dependency between the correction tickets. All metadata verified after creation.

| Approved description / title | Priority | Complete saved label set | Related references only | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Customs Storage Entry — protect drafts and recover creation/save outcomes](01-drafts-and-save-recovery.md) | High | Story, Bug, Frontend, Pending_Review, Flow QA, entry note | FRO-319, FRO-353, FRO-354 | QA-CSE-01, QA-CSE-02, QA-CSE-03, QA-CSE-04, QA-CSE-05, QA-CSE-06, QA-CSE-09 |
| [D2 — Customs Storage Entry — correct Order relationships, warehouse warnings and admission actions](02-order-relationships-and-admission-actions.md) | Medium | Story, Bug, Frontend, Pending_Review, Flow QA, entry note, Order | FRO-319, FRO-354, FRO-355 | QA-CSE-07, QA-CSE-08, QA-CSE-10 |

| Description | Created and verified issue | Priority / status |
| --- | --- | --- |
| D1 | [FRO-391 — draft and save recovery](https://linear.app/front-line-ltd/issue/FRO-391/customs-storage-entry-protect-drafts-and-recover-creationsave-outcomes) | High / Backlog |
| D2 | [FRO-392 — Order relationships and admission actions](https://linear.app/front-line-ltd/issue/FRO-392/customs-storage-entry-correct-order-relationships-warehouse-warnings) | Medium / Backlog |

Priority follows the accepted grouping: D1 can send the wrong owner/values or lose work; D2 gives incomplete warnings or incorrect relationship/action information. It is a severity assessment, not a measured production incident rate. Story is the single Type and Frontend the single Area. All listed labels and Backlog were freshly verified; no new labels or Ready/Todo promotion.

The two numbered files are the exact approved Linear description bodies. Full readbacks match after only Linear Markdown/issue-chip presentation normalization. Metadata, consumer ownership and verification receipts stay in this index, outside those bodies. FRO-358 is named only here and in the review: its list/menu, active-register/Excel/print and recipient copies are expressly excluded in both bodies without adding it to the related-reference set. No new Invoice/Export links from FRO-370 are included. D1 maps to FRO-391 and D2 to FRO-392 throughout the coverage tables.

## Consumer trace and ownership

| Consumer / current behavior and source | Required outcome | Owner |
| --- | --- | --- |
| Create controller re-applies initial preselection and hides selected-Order read errors | Preserve explicit choice/manual fields, truthful read errors and targeted Retry | D1 / 1–2 |
| Details controller/mapping compare draft with fresh query values/version | Keep the reviewed baseline and intended field delta; require review after conflict | D1 / 3 |
| Details pending inputs and closeEditor callback permit/erase later work | Lock pending editor, isolate operation completion and preserve rejected work | D1 / 4 |
| Create/Details failure classification and existing by-Order/entry reads | Original-context reconciliation, honest uncertainty and controlled explicit retry | D1 / 5–6 |
| Create navigation callback and native-only guards | Retain acknowledged saved identity; actual internal navigation protection | D1 / 7–8 |
| Existing backend creation/edit/coverage/number/audit guards | Preserve current rules; no replay endpoint, migration or backend defect invented | D1 / 9–10 and D2 / 5–6 |
| Details chosenDraft/otherWarehouse and confirmation dialog | Resolve target facts first, warn before move and retain post-move notice | D2 / 1–2 |
| Details unequal-ID coveredChild flag and by-Order access result | Separate return context from verified inherited coverage | D2 / 3 |
| Order command invalidates purchaseOrderKeys only; mounted card uses customsStorageKeys | Re-read server entry/eligibility after stock confirmation | D2 / 4 |
| Existing old/new owner, derived invoice/Export and covered-child reads | Preserve established refresh, identities, read ownership and authorization | D2 / 5 |
| Export, VAT stamping, FRO-358 and new Invoice/Export links | Unchanged and excluded | Existing/separate work |

D1 owns the reviewed entry version and pending/uncertain Change Order result. D2 owns target warehouse readiness, warehouse notices and displayed coverage. Their changes must compose on the same Details controller; neither ticket owns or repeats the other's findings, and no blocking relationship is proposed. A late or reconciled move must pass through D2's correct relationship refresh without weakening D1's original-attempt handling.

## Finding and acceptance coverage

| Finding | Draft / principal criteria |
| --- | --- |
| QA-CSE-01 — preselection retakes the selected Order | D1 / 1 |
| QA-CSE-02 — fresh version permits stale field overwrite | D1 / 3 |
| QA-CSE-03 — earlier success clears later editing | D1 / 4 |
| QA-CSE-04 — uncertain results claim nothing changed | D1 / 5–6 |
| QA-CSE-05 — acknowledged creation loses navigation recovery | D1 / 7 |
| QA-CSE-06 — internal navigation loses dirty draft | D1 / 8 |
| QA-CSE-07 — pending target bypasses warehouse warnings | D2 / 1–2 |
| QA-CSE-08 — independent return Order shown as covered child | D2 / 3 |
| QA-CSE-09 — selected-Order lookup failure hidden/misclassified | D1 / 2 |
| QA-CSE-10 — stock confirmation leaves shortcut stale | D2 / 4 |

All 16 acceptance criteria have individual read-only post-deployment verification rows. No complete portal scenario is promoted to Pass by drafting these corrections.

## Source, verification and limits

- Mandatory planning pull succeeded; authenticated gh main remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Fresh FRO-319/353/354/355 descriptions are identical to the reviewed references and remain Done; FRO-358 remains unchanged Backlog. Current search returned 75 results, no next page and no exact correction owner identified.
- Re-read relevant Create/Details controllers, mapping, service/GraphQL document definitions, query keys, Order shortcut, command invalidation, confirmation dialog and backend edit guard from the authenticated, blob-verified source archive at that unchanged SHA. No source changes or new product tests were needed for this drafting task.
- Retained baseline: [full findings](../../docs/qa/runs/2026-11-09-customs-storage-entry.md), [flow](../../docs/qa/flows/customs-storage-entry.md), [30 scenarios](../../docs/qa/scenarios/customs-storage-entry.md), [evidence guide](../../docs/qa/evidence/customs-storage-entry-evidence.md). Previously executed: 115 existing UI tests; 27 added UI checks (10 controls, 16 observations, one excluded conditional case); 155 extracted-source backend controls. These are not newly executed fix tests or proof of deployed correctness.
- No duplicate persisted entry, production overwrite or separate backend defect was demonstrated. Native Java25/Gradle/Testcontainers, real SQL/admission/locks/rollback/concurrency and deployed/authenticated browser behavior remain unverified. D1 does not assume the Shipment Invoice request-ID replay contract exists for Customs Storage Entry.
- Existing presentation contracts are reused; no new components or design directions are proposed. Canvas/preview are skipped and production branch work is excluded by the draft-only request and read-only boundary. No vocabulary/ADR or process-learning update is needed.
- Creation preflight repeated mandatory pull, authenticated main verification, current labels/statuses, full reference reads and a current Bug search; no exact existing correction owner found. No new application tests were needed for this approved-text creation task.

## Creation verification — 9 November 2026

- Full FRO-391/392 readbacks match the approved descriptions after normalizing table separators, bullet markers, whitespace/bold presentation and verified Linear issue chips/link wrappers. All ten findings and all 16 acceptance/check pairs remain present. No description rewrite was needed.
- Verified exact titles, High/Medium priorities, FRO Backlog, complete label sets including Flow QA, unset assignment/project/parent/milestone/cycle/date/estimate, and empty attachments/documents. No Ready promotion, blocking/duplicate relations or FRO-358 reference added.
- FRO-391 relates exactly to FRO-319/353/354. FRO-392 relates exactly to FRO-319/354/355. Before/after full reads show reference descriptions, titles, priorities, complete labels/statuses, assignment/project/parent metadata, attachments and existing blocking relations preserved. Only approved reciprocal related links were added. FRO-353's five attachment identities/titles/targets are unchanged; Linear re-signed URL query parameters.
- FRO-358 remains Backlog with identical description, metadata, attachments and relations; it has no relation to either correction. Existing requirement tickets remain Done. Export/VAT and other chat's Stock List scopes remain separate.
- Approved normalized-LF UTF-8 body SHA-256: D1 `45d1bf52af75d04a71340ed5180e2f9911b77299e8030d3954443c27491b9a97`; D2 `8922e5c9033bc387091145eee49a7564c02d839608b1830b5bd6a5cb5ab92c93`. Both files remain byte-equivalent to reviewed commit `296b99a` after newline normalization.
- Updated planning memory and QA links only. No production source, portal/database/AADE/email write, branch, preview, vocabulary or ADR. Synchronize only this task's records and preserve concurrent/unrelated work.
