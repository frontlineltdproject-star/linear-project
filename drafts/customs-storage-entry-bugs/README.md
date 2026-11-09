# Customs Storage Entry — two correction drafts

The user accepted the two-ticket grouping and requested complete drafts on 9 November 2026. **Drafts for review only; no Linear writes authorized or performed.** These descriptions correct the existing implementation. They do not commission pending Customs Storage outputs or reopen existing requirement tickets.

## Proposed metadata

Both: **Front Line LTD (FRO) · Backlog**. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or documents. Related references only; no blocks, blockedBy or duplicate relation, and no blocking dependency between the correction tickets. Creation and the exact descriptions still require approval.

| Draft / title | Priority | Complete label set | Related references only | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Customs Storage Entry — protect drafts and recover creation/save outcomes](01-drafts-and-save-recovery.md) | High | Story, Bug, Frontend, Pending_Review, Flow QA, entry note | FRO-319, FRO-353, FRO-354 | QA-CSE-01, QA-CSE-02, QA-CSE-03, QA-CSE-04, QA-CSE-05, QA-CSE-06, QA-CSE-09 |
| [D2 — Customs Storage Entry — correct Order relationships, warehouse warnings and admission actions](02-order-relationships-and-admission-actions.md) | Medium | Story, Bug, Frontend, Pending_Review, Flow QA, entry note, Order | FRO-319, FRO-354, FRO-355 | QA-CSE-07, QA-CSE-08, QA-CSE-10 |

Priority follows the accepted grouping: D1 can send the wrong owner/values or lose work; D2 gives incomplete warnings or incorrect relationship/action information. It is a severity assessment, not a measured production incident rate. Story is the single Type and Frontend the single Area. All listed labels and Backlog were freshly verified; no new labels or Ready/Todo promotion.

The two numbered files are the exact proposed Linear description bodies. Metadata, consumer ownership and review history stay in this index, outside those bodies. FRO-358 is named only here and in the review: its list/menu, active-register/Excel/print and recipient copies are expressly excluded in both bodies without adding it to the related-reference set. No new Invoice/Export links from FRO-370 are included.

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
- Save and verify these planning files, record the accepted grouping and pending draft approval in MEMORY.md, and commit/push only this task's changes. Preserve unrelated patches and other-chat work. Full descriptions are presented in chat; creation is a later explicit approval step.
