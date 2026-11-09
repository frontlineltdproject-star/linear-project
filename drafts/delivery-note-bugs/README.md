# Delivery Note: three approved correction tickets

The user reviewed the complete descriptions and metadata, then explicitly approved creating all three with the proposed priorities and labels on 9 November 2026. **Created and verified in Linear as FRO-381–FRO-383.** D1–D3 remain local identifiers mapping the unchanged approved description files to their saved issues. FRO-283/284 remain references only; their unimplemented future scope does not own or block these corrections.

## Approved descriptions and saved metadata

All three: **Front Line LTD (FRO) · Backlog**. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or documents. Related links only; no blocking or duplicate relations. Creation approval did not mark them Ready.

| Local draft | Created issue | Priority | Saved Area |
| --- | --- | --- | --- |
| D1 | [FRO-381 — preserve unsaved movement details](https://linear.app/front-line-ltd/issue/FRO-381/delivery-note-drafts-preserve-unsaved-movement-details) | High | Frontend |
| D2 | [FRO-382 — cancellation, replacement and pending-submission recovery](https://linear.app/front-line-ltd/issue/FRO-382/delivery-notes-correct-cancellation-replacement-and-pending-submission) | High | Integration |
| D3 | [FRO-383 — consistent XML/PDF movement dates and times](https://linear.app/front-line-ltd/issue/FRO-383/delivery-notes-keep-movement-dates-and-times-consistent-in-xml-and-pdf) | Medium | Backend |

| Draft / saved title | Priority | Complete saved label set | Related issues | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Delivery Note drafts — preserve unsaved movement details](01-preserve-movement-drafts.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, delivery note, Shipment | FRO-247, FRO-307, FRO-373 | QA-DN-01, both cases |
| [D2 — Delivery Notes — correct cancellation, replacement and pending-submission recovery](02-cancellation-replacement-and-recovery.md) | High | Story, Bug, Pending_Review, Flow QA, Integration, delivery note, Shipment | FRO-247, FRO-307, FRO-283, FRO-284 | QA-DN-02, QA-DN-03, QA-DN-05 |
| [D3 — Delivery Notes — keep movement dates and times consistent in XML and PDF](03-consistent-movement-time.md) | Medium | Story, Bug, Pending_Review, Flow QA, Backend, delivery note | FRO-247, FRO-283, FRO-284 | QA-DN-04 |

D3 mentions FRO-283/284 only to state independence; these are saved as related references, as approved. No dependency was created. D2 uses Integration as its one Area because the correction crosses frontend, backend and AADE handling. D1 prioritizes reproduced data loss; D2 prioritizes blocked recovery and uncertain fiscal state. D3 remains Medium pending the full persistence/document reproduction. The approved priorities were saved unchanged; they are not measured production incidence.

Current FRO Backlog and all listed labels were fetched and verified; each saved issue has exactly one Type (Story) and one Area. Bug, Pending_Review, Flow QA and entity labels are ungrouped. Each numbered file contains the complete approved Linear description used for creation, without title/metadata wrappers. The three files remain unchanged.

## Consumer trace and ownership

| Consumer / current behavior and source | Required outcome | Owner |
| --- | --- | --- |
| Shared editor key/reset and query invalidation discard local input | Retain dirty input, bind completion to the submitted draft and require explicit stale-data resolution | D1; delivery-notes-card.tsx, use-delivery-notes.ts |
| Common all-DRAFT editor/save cannot complete replacement beside issued sibling | Use existing individual-draft contract for the replacement; preserve common-save checks and sibling fiscal facts | D2; card, delivery-note-service.ts, DeliveryNotesApiService |
| Pending submission service can reconcile, UI cannot invoke it | Authorized status-check action reaches existing pending path, with no resend or new number | D2; card and DeliveryNoteIssuanceService |
| Cancellation failures all restore ISSUED; local completion can fail after acceptance | Keep uncertainty pending, distinguish rejection and preserve/reuse authoritative confirmation | D2; cancellation service/lifecycle/repository and AADE adapter; no cancellation lookup assumed |
| UTC serialization, direct-offset XML and Athens PDF disagree | Convert the same saved movement instant to Europe/Athens for XML and PDF; verify persistence/rendering | D3; delivery-note-service.ts, XML builder, PDF model factory |
| Submitted XML, fiscal lookup identity, sibling/history records, permissions, versions | Preserve existing identity/evidence/guards; no bulk historical correction | All three, bounded by their acceptance criteria |
| Future cancellation choices/history redesign and failed-submission policy | Preserve separate future scope; no implementation dependency | FRO-283/284 references only |
| Export/Customs/VAT and general Shipment lifecycle | Preserve parallel review boundary; Shipment facts are inputs | Other chat; no expanded audit here |

## Decisions and evidence

- The user approved all three complete descriptions and metadata and explicitly requested creation. All three were created and re-read. Every finding has one correction owner and separate acceptance evidence. No change to existing ticket descriptions/statuses.
- Reuse current form/card/feedback components and the existing FRO-307 presentation contract. Canvas and preview steps skipped because no new visual design is proposed. UI branch skipped because authorization covers tickets only and production access remains read-only.
- Production main rechecked through authenticated gh at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Deployed build is unverified. Full current FRO-247/307/283/284 read; prior full FRO-373 read checked the distinct scope. Fresh Delivery Note Bug search found FRO-373/376 with different scopes; no exact duplicate identified.
- Existing evidence: 32 targeted frontend checks plus five observation/control tests; two timestamp-expression observations. No new application tests during drafting. Cancellation remains source-supported, and actual database/document/browser integration remains explicitly required.
- No new vocabulary or ADR; no production, portal, database, AADE or email mutation. Unrelated FRO-326/352/353 patch and .wrangler work is excluded.
- [Flow](../../docs/qa/flows/delivery-note.md) · [24 scenarios](../../docs/qa/scenarios/delivery-note.md) · [Report](../../docs/qa/runs/2026-11-09-delivery-note.md).

## Draft verification

- Verified all five findings are assigned exactly once; QA-DN-01 retains both reproductions.
- All 17 numbered acceptance criteria have corresponding read-only post-deployment checks.
- Checked source paths against the pinned production archive, evidence links against committed planning files, and local draft links. No credentials or signed download URLs included.
- Complete approved metadata is shown above. Draft verification makes no implementation/deployment claim.

## Creation verification receipt

- Re-read FRO-381/382/383 with explicit descriptions, complete metadata, relations and attachments. Approved titles, High/High/Medium priorities, label sets, FRO team, Backlog and related-issue sets all match.
- Descriptions match approved files after normalizing Linear Markdown presentation only: whitespace, list/table markers, URL angle brackets, issue chips and bold boundaries around an automatically converted issue mention. No requirement wording changed.
- No blocks, blockedBy or duplicateOf relations; assignee, project/milestone, parent, cycle, due date and estimate unset. Attachments/documents empty. No new labels or Ready promotion.
- Re-read FRO-283/284: descriptions, titles, statuses, priorities, labels, assignees and attachments unchanged. Only approved reciprocal related links from FRO-382/383 were added; neither reference is a blocker.
- Fresh planning pull and authenticated production-main check succeeded; main remains `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Fresh label/status catalogue, Delivery Note Bug search and three complete-page title searches found no exact duplicate before creation. No application test rerun, production change or fiscal action during ticket creation.
