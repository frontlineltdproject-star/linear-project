# Stock List correction drafts

The user accepted three groups and priorities on 9 November 2026 and requested complete drafts before Linear creation. **Descriptions and proposed metadata await review. No Linear issue has been created.**

| Draft | Proposed title | Accepted priority | Proposed labels | Proposed related references |
| --- | --- | --- | --- | --- |
| S1 — [List controls and settings](01-list-controls-and-settings.md) | Stock List — correct filters, pagination and saved table settings | Medium (3) | Story, Bug, Frontend, Pending_Review, Flow QA, Order | FRO-254, FRO-279 |
| S2 — [Shipment selection and handoff](02-shipment-selection-and-handoff.md) | Stock List → Shipment — keep eligibility current and preserve selected Orders | High (2) | Story, Bug, Frontend, Pending_Review, Flow QA, Order, Shipment | FRO-279, FRO-341, FRO-373 |
| S3 — [PDF values and formatting](03-pdf-values-and-formatting.md) | Stock List PDF — correct current values and preserve readable output | High (2) | Story, Bug, Backend, Pending_Review, Flow QA, Order | FRO-279, FRO-292, FRO-295, FRO-297 |

Proposed team **FRO**, status **Backlog**. No assignee, project, milestone, cycle, parent, estimate, due date, attachments or documents proposed. No blocking/blocked-by/duplicate relations. Source/QA links remain in descriptions. Current metadata confirms Type and Area are single-select groups: each draft has one Type and one Area; the Frontend label on S1 does not exclude its necessary server preference-policy fix. Other labels are active and ungrouped. No readiness promotion or existing-ticket edits.

## Finding coverage

| Finding | Draft / principal criterion |
| --- | --- |
| QA-SL-01 — compatible Vessel cleared with Client | S1 / 1 |
| QA-SL-02 — first-page option truncation | S1 / 2 |
| QA-SL-03 — late save/read responses overwrite newer preferences | S1 / 3, both manifestations |
| QA-SL-04 — Flags omitted from saved order | S1 / 4 |
| QA-SL-05 — grouped/ordinary page shrink strands navigation | S1 / 5 |
| QA-SL-06 — stale selected-Order eligibility | S2 / 1 |
| QA-SL-07 — initial handoff silently omits requested Orders | S2 / 2–4 |
| QA-SL-08 — original DECLARED history masks corrected values | S3 / 1 |
| QA-SL-09 — older dispatched transport overrides newer leg | S3 / 2 |
| QA-SL-10 — note line breaks collapse | S3 / 3 |
| QA-SL-11 — long child ID overlaps Client | S3 / 4 |

All eleven findings have exactly one owner. S1 has six acceptance/verification pairs; S2 five; S3 six: **17 pairs**. Additional criteria preserve adjacent contracts rather than introducing new findings. References to FRO-373 coordinate shared creation code without duplicating its origin-change/draft-preservation scope. Load-unit mutation/history and the other chat's Customs Storage Entry/Shipment Invoice work remain separate.

## Consumer trace and ownership

Production source main remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Client paths below are under `frontline-forwarding-client/src`; app classes are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding` unless marked resources. Detailed source lines are in the linked [run report](../../docs/qa/runs/2026-11-09-stock-list-selection-printing.md) and evidence notes.

| Consumer / source | Current behavior | Required outcome | Owner |
| --- | --- | --- | --- |
| purchase-order-table.tsx Client handler, route filters | Client All clears compatible Vessel | Preserve other compatible restrictions and compound filters | S1 / 1 |
| purchase-orders.graphql, PurchaseOrderService.formOptions, Combobox | Loads first100 companies; searches only supplied options | Reach all authorized list-filter choices; truthful errors and unchanged scope | S1 / 2 |
| table preference hook and table hydration/debounce | Earlier read/save restores older settings and can cancel newer intent | Preserve later local/submitted choices and existing cold-load behavior | S1 / 3 |
| PurchaseOrderTablePreferencePolicy, UserTablePreferencesApiService | Normalization excludes Flags | Round-trip Flags position while retaining saved configuration | S1 / 4 |
| list/group Query pages, PurchaseOrdersApiService counts | Positive requested page remains past the last page; controls hide | Recover valid navigation without changing unrelated group/filter/selection state | S1 / 5 |
| usePurchaseOrderFormOptions readers | Also feeds Order Create/Details, inline Order creation, Order invoice-row currencies and Shipment Invoice Create/Details currencies | Preserve shared response/currency/loading contracts if helper changes; no new entity review | S1 / 6, preservation only |
| table selection metadata and toolbar | Checkbox-time eligibility persists after current rows change | Evaluate complete current set at action boundary, including off-page and date changes | S2 / 1 |
| shipment-service.ts candidate read, creation hook/entryDraft | Page0/size100 and intersection-only initialization omit requested IDs | Complete authorized resolution, explicit exclusions and stable retry/draft ownership | S2 / 2–4 |
| server candidate/creation guards and shared Print selection | Existing eligibility/revision/authorization checks; print independent | Preserve guards and no-write handoff | S2 / 5 |
| StockListPdfModelFactory; PurchaseOrdersApiService and assembler | Current fields coexist with initial DECLARED snapshot; factory treats both sources alike | Correct print reader; preserve genuine confirmations and stored history | S3 / 1 |
| ShipmentRepository.findLatestByPurchaseOrderId; StockListPdfService | Dispatched-first sorting overrides newer undispatched leg | Correct targeted precedence/reference and retain association exclusions | S3 / 2 |
| stock-list.html and PdfRenderService | Normal Notes whitespace and fixed nowrap ID | Preserve escaped multiline text and complete readable IDs within approved layout | S3 / 3–4,6 |
| Print request guards, assembler membership and aggregates | Authorized whole request and current nonterminal goods | Preserve limits, confidentiality, counts, locations, zero/absent values and no writes | S3 / 5 |

Reference lookup found only StockListPdfService calling the Shipment repository's latest-associated-leg method. A similarly named method in PurchaseOrderStatusTransitionRepository is unrelated and stays unchanged. Current shared-option readers were inspected at their call sites; Shipment Invoice consumes country currency codes there, so it needs compatibility protection rather than a second invoice audit.

## Decisions and preparation

- The three groups and Medium/High/High priorities are accepted. Complete descriptions, labels, Backlog state and reference-only related links are proposed for review.
- Current FRO-254/279/292/295/297/341 are Done; FRO-373 is Backlog. Full descriptions were fetched again. The recent Flow QA inventory has no exact Stock List correction owner; the earlier exhaustive Stock List search and FRO-375/376 scope checks remain applicable. No existing issue was modified.
- The broad surviving per-column/date-controls question and partial later-confirmation fallback question remain outside these drafts. S3 fixes the original DECLARED snapshot masking current values without deciding a new cross-stay partial-measurement rule.
- Existing screens/components and the approved PDF template are reused. Canvas/preview steps are skipped; production changes and branches are outside this planning task. Supporting ticket-writing/grilling/domain-modeling instructions were read; no new vocabulary or ADR is warranted.
- Mandatory planning pull, authenticated gh access, branch SHA, current label groups/statuses and duplicate checks passed. Relevant pinned current consumers were reread. Historical implementation notes in old requirement tickets do not override current source.
- No new application test run was necessary for drafting. Prior evidence remains 63 frontend tests, 69 backend controls plus five observations/seven static checks, and five PDFs/eight inspected pages/six PDF checks, with all limits retained. These are bounded local observations, not deployed verification. All 28 full portal scenarios remain Not run.
- Draft validation passed: all eleven findings have one owner; all 17 criteria have a matching verification row; 57 local links and the pinned evidence targets resolve; all 28 full scenarios remain Not run. Proposed labels are active with one Type and one Area each; issue-reference sets match the index. Synchronize only these drafts and their planning references, preserving other chat and unrelated files.

## Workflow status

0. Preflight complete. 1. Findings discussed; grouping/priorities accepted. 2/2b. Existing presentation reused, no canvas/preview. 3. Consumer trace reconciled above. 4. Three full drafts prepared for review; no Linear writes. 4e. No production branch authorized or prepared. 5. Memory/catalogue updated. 6. Draft validation passed; planning synchronization is recorded in Git history and the handoff receipt. No production pass claimed.
