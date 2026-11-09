**Customs Storage Entry creation and editing** must preserve the operator's selected Order, intended changes and reviewed version, and distinguish an uncertain result from a confirmed failure. Correct the existing Create, Details and Change Order behavior without changing the entry's business rules.

**Order = purchase order = stock-list item. Customs Storage Entry = Δελτίο Εισόδου.**

## Problems to fix

| Finding | Reproduction and current result |
| --- | --- |
| QA-CSE-01 | Open Create from A, select B and enter manual values. The original A lookup fails and recovers; selection returns to A while B's manual values remain. The next request targets A. |
| QA-CSE-02 | Begin editing at version 3; another operator saves version 4. Background refresh makes Save use version 4 while sending an untouched old value. Change Order confirmation also adopts the refreshed version. |
| QA-CSE-03 | Enter more text during a delayed save, or Cancel and open a new editor. The earlier success closes the current editor and discards that later work. |
| QA-CSE-04 | Lose a Create response and its recovery lookup, or lose a Details/Change Order response. The page claims nothing was saved/changed and offers further work without resolving the outcome. |
| QA-CSE-05 | Create returns a saved identity, then navigation rejects asynchronously. The form loses saved-record recovery and can enable Create again. |
| QA-CSE-06 | Follow an internal link with unsaved Create or Details input. No leave confirmation appears; returning loses the draft. |
| QA-CSE-09 | Preselection transport failure appears as missing/inaccessible Order. Selected-Order draft failure leaves blank facts and disabled Create without an error or Retry. |

These were reproduced against isolated current-source UI boundaries. The evidence establishes faulty state and requests, not production overwrites or duplicate persisted entries.

## Acceptance criteria

1. **Stable selection:** initial preselection must not retake ownership after an explicit operator choice. Recovery or refresh of A cannot replace selected B, its facts or its submitted Order ID. Ignore obsolete responses. Preserve manually edited fields and the existing rule that only untouched warehouse fields receive prefill when the operator deliberately changes Order.
2. **Recoverable lookup errors:** distinguish transport failure from confirmed missing/denied results. Show a visible error and Retry for both preselection and selected-Order draft reads. Retain the selection and manual values; unavailable required facts keep Create disabled. Retry reads the relevant Order only and must not restore an obsolete selection. Preserve the existing combined message for genuinely missing/inaccessible preselection.
3. **Reviewed edit baseline:** capture entry identity, values and version when editing starts. Send only the operator's intended field changes against that version; omitted fields stay omitted and intentional clearing remains explicit. Background refresh cannot replace the baseline or version, including while Change Order confirmation is open. A stale result keeps the draft/target and requires review of the latest record before another save; Refresh must not silently convert untouched old values into edits.
4. **Pending-save protection:** keep a stable submitted snapshot and prevent duplicate submission. While a write is pending, disable inputs, Order changes, Cancel/Escape dismissal and starting another editor. Associate completion with that operation/editor only; an obsolete response must never clear another draft or overwrite newer saved state. Known rejection restores editing with the draft intact; confirmed success completes only the matching operation.
5. **Truthful uncertain results:** timeout, lost response and unclassified write failure must show that the outcome is unconfirmed, never that nothing was saved/changed. Retain original Order/entry identity, submitted values, target and reviewed version. Offer **Check saved state**; block a fresh independent write while reconciliation is failed or inconclusive. Do not automatically repeat Create, Update or Change Order.
6. **Canonical reconciliation:** check creation against the original submitted Order and saved edits/moves against the same entry. Show the current saved record/coverage, offer an authorized Open action when available and identify conflicting values or ownership. Failed/incomplete reads remain unconfirmed. A successful no-entry lookup may offer an explicit Create retry for the original Order and captured values under existing eligibility/uniqueness checks; describe it as no entry currently found, not proof of rollback. Update/Change Order retries retain the captured payload and version; a newer record requires explicit review before a new correction. Never silently substitute a newer version or claim authorship from matching values. A retry is an explicit action, not automatic replay or an exactly-once guarantee.
7. **Saved navigation recovery:** retain the acknowledged entry ID, number and return context before navigating. Handle immediate and asynchronous navigation failures, show that creation succeeded, and offer **Open saved entry**. Retrying performs navigation only; Create remains unavailable for that completed attempt. Failed navigation must not clear a later draft or lose a recovered saved destination.
8. **Leaving with work:** protect dirty Create and Details/Change Order drafts through sidebar links, other internal links, browser history and the existing Back/Cancel actions. Ask before discarding; Keep editing preserves the complete draft and selection. Retain native unload protection. Departure does not cancel an in-flight request and must not be presented as proof that nothing was saved. Pending/uncertain operation state must not be silently reset into a fresh write.
9. **Preservation:** retain staff authorities, existing field validation, Athens date/time rules, eligibility and coverage checks, numbering, uniqueness, audit and server version enforcement. Preserve normal confirmed-rejection behavior, tabs/language draft retention and existing components. Provide all changed feedback/actions in EN/EL with keyboard access and usable narrow layouts. No automatic changes to Orders, invoices or Export.
10. **Regression coverage:** convert retained defect observations into correct-outcome tests and retain working controls. Cover real query refresh, failed/recovered lookups, stale saves, delayed responses, cancelled/obsolete editor callbacks, uncertain Create/Update/Change Order with failed/conflicting reads, actual internal navigation and rejected navigation Promises. Check exact payloads, action counts and unchanged unrelated fields; verify stale-write refusal and persistence in an isolated backend/database environment.

## Decisions and scope

- One correction owns draft and operation-result handling across the existing Create, Details and Change Order pages, so the same outcome has consistent behavior.
- Pending writes lock the current editor rather than accepting input that may be discarded. Reviewed versions remain explicit; background freshness is not operator review.
- Recovery uses existing authorized reads and honest uncertainty. This ticket does not assume a request-ID replay API, exactly-once execution or proof of authorship from a matching record.
- **FRO-319, FRO-353 and FRO-354 are references only:** do not reopen them, expand their scope or make them prerequisites.

Out of scope: warehouse-warning/coverage-banner/stock-shortcut corrections owned by the separate Order-relationships correction; pending Customs Storage list/menu, active-register screen, Excel, printing and recipient copies; Export and VAT stamping; new business fields, numbering policy, schema/migration, global recovery service, general autosave or cross-session draft storage. Reuse the current UI components and layout.

## Context for agents

Reviewed source: main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed-build equivalence remains unverified.

- Client prefix `frontline-forwarding-client/src/features/customs-storage/`: `create/components/customs-storage-create-page.tsx` owns preselection, draft reads, Create reconciliation and navigation; `details/components/customs-storage-details-page.tsx` owns editor lifetime, refreshed versions and Update/Change Order results; `details/customs-storage-details-mapping.ts` builds the changed-field payload.
- `hooks/use-customs-storage.ts`, `services/customs-storage-service.ts`, `graphql/documents.ts` and `customs-storage-errors.ts` provide the current cache, reads, mutations and failure classification. Reads: `customsStorageEntry`, `customsStorageEntryDraft`, `customsStorageEntryByPurchaseOrderId`, `purchaseOrderById`; writes: `createCustomsStorageEntry`, `updateCustomsStorageEntry`, `changeCustomsStorageEntryOrder`.
- Backend `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customsstorage/CustomsStorageEntryEditingService.java` checks the supplied version under lock. That protection cannot detect a newer version silently substituted by the client. Preserve partial-update, no-op, audit and transaction behavior; creation uniqueness is not a request replay contract.
- Internal router navigation does not trigger native beforeunload. Trace the integrated hosts and asynchronous callbacks, not only synchronous test doubles. Keep a submitted attempt separate from current query data and any later editor.

Retained observations establish the defect baseline, not fix verification. Full browser, authenticated transport and real database transaction/concurrency checks remain outstanding; no separate backend defect was confirmed by the extracted-source controls.

## Post-deployment verification

Read existing records, recordings and isolated test results only; submit no production writes. Missing evidence remains Unverified.

| Criterion | Read-only check |
| --- | --- |
| 1 | Inspect A-to-B failure/recovery recordings and captured payloads; compare selected ID, facts, manual values and untouched prefill. |
| 2 | Inspect initial/selected lookup error and Retry cases, including late A responses after B selection; compare retained input and Create availability. |
| 3 | Compare edit/confirmation baseline, submitted version and changed-field payload before/after background refresh; inspect stale rejection and preserved concurrent values. |
| 4 | Review delayed success/rejection and obsolete-callback recordings; verify disabled controls, one write and preservation of the correct editor. |
| 5 | Review uncertain Create/Update/Change Order feedback, retained snapshots, Check saved state and absence of automatic/fresh writes. |
| 6 | Inspect successful, failed, absent and conflicting reconciliation cases; compare canonical record/coverage, stated certainty and action counts. |
| 7 | Inspect confirmed creation plus synchronous/asynchronous navigation failure; repeated Open retries must keep the same identity and issue no writes. |
| 8 | Review internal-link/history/Back/Cancel/unload recordings and Keep editing behavior, including pending/uncertain attempts. |
| 9 | Review authority, validation, numbering, uniqueness, audit, version, unchanged related-record and EN/EL/accessibility results. |
| 10 | Match integrated regression and isolated database evidence to the deployed source revision, including stored values and write counts. |

**Reference:** [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319) · [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353) · [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354) — references only · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings and evidence](https://github.com/frontlineltdproject-star/linear-project/blob/ececdaa/docs/qa/runs/2026-11-09-customs-storage-entry.md).
