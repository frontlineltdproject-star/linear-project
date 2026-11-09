**VAT stamping recovery** must retain an uncertain attempt and establish what happened before allowing conflicting work. Cover dispatch, stamped return and onward sending from both Supplier Invoice Details and Export bulk actions.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-VAT-06 — bulk false certainty | Lose a response for A/B dated 8 November. The UI says Nothing changed and allows 9 November without checking. Close/reopen or navigation loses the original selection/date context. |
| QA-VAT-07 — individual recovery lost | Lose an event response; Check original attempt appears. Dismiss/reopen or receive a stage-changing refresh: recovery disappears and a new action becomes available. Missing recovery data can unmount the page/action. |
| QA-VAT-08 — different date accepted | Submit 5 November, lose its response, then Check. A reread with 6 November closes recovery and advances the action without identifying the mismatch. |

These are isolated UI reproductions with synthetic responses. No duplicate persisted event, changed saved date or real database rollback was demonstrated.

## Acceptance criteria

1. **Truthful uncertainty:** distinguish confirmed rejection from missing/uncertain response. Do not say Nothing changed or not saved without authoritative evidence. Show the unresolved action and provide Check original attempt on both entry points; keep known-rejection input retention.
2. **Original intent:** retain Export, original invoice IDs, event, submitted date and applicable reviewed version independently of the current dialog/stage. No changed date, selection or conflicting replacement action while unresolved. Never substitute refreshed selections/version into an original retry.
3. **Recovery lifetime:** preserve recovery across Cancel, close, Escape, backdrop, reopening, stage changes and navigation. Keep existing pending dismissal locks. Protect in-app departure/unload; any allowed leave/return path must restore or reconcile before further mutations. Missing/denied/failed reads remain unresolved with recovery context available.
4. **Exact comparison:** check authoritative invoice/event, Export association and submitted date using existing reads/activity. A different date is a conflict to review, not success of the original attempt; display submitted versus saved facts. A matching recorded event may resolve the desired outcome as already recorded, but must not attribute it to this request/operator without evidence. Never overwrite or clear saved history to resolve the mismatch.
5. **Bulk reconciliation and retry:** resolve each original selected invoice separately; partial success must not become all-saved or all-failed. An absent event on one read does not prove an outstanding write failed. Any safe retry repeats the original intent under existing replay guards; a changed request requires resolved/reviewed outcomes. Keep unresolved items visible and refresh canonical invoice/Export progress without older-response regression.
6. **Preservation and ownership:** retain permissions, positive IE599, chronology, stage/version guards, same-date replay and atomic event/activity rules. No duplicate audit, protocol/membership/Customs change or extra exemption status. The companion confirmation ticket owns initial reviewed facts, normal pending input, eligible selections and successful-response freshness; this ticket retains/reconciles that attempt.
7. **Verification:** cover all events and both entry points through response loss, every dismissal path, actual isolated-browser departure/return, same/different-date rereads, another writer, missing/denied reads and mixed bulk outcomes. Verify unchanged retries and saved/audit outcomes with isolated backend evidence.

## Decisions and scope

One ticket owns uncertain-attempt continuity and reconciliation across both screens because both use the same invoice-owned events. Reuse existing confirmation/recovery controls. No unrestricted event-date correction, new exemption workflow, general concurrency platform or Shipment Invoice scope. FRO-379/385 retain their correction/cancellation/Customs scopes.

## Context for agents

Baseline main: 6aa259553cd9c86a8aaa157902088aa9a6bca83e.

- Client `src/features/exports/details/components/export-detail-page.tsx:555–565,834–840,975–985` collapses unknown to failed and discards dialog context. `src/features/exports/export-errors.ts` already distinguishes unknown.
- Client `src/features/supplier-invoices/components/supplier-invoice-export.tsx:270–282,295–300,345–348` accepts any event date and resets local recovery; adjacent Details page:244,886–890 omits stamping from navigation protection and keys the action by stage.
- App `src/main/java/com/frontline/forwarding/domain/exports/ExportStampingService.java` accepts same-Export/event/date replay without another write and refuses a different-date repeat. SupplierInvoiceOutput exposes stampingExportId and dates; SupplierInvoicesGraphQlApi exposes activity. Use existing authoritative facts; do not invent a request-status endpoint.

## Post-deployment verification

Read-only review of isolated evidence and existing records; no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Inspect lost-response versus known-rejection messages and Check availability on both screens. |
| 2 | Compare original payload with retained context and attempted replacement/retry controls. |
| 3 | Inspect dismissal/navigation/stage-change and failed/missing-read recordings for surviving recovery. |
| 4 | Compare submitted and saved event/Export/date and actor/activity evidence for accurate resolution. |
| 5 | Inspect per-invoice mixed outcomes and unchanged retry payloads, including delayed original completion. |
| 6 | Compare protected facts/activity and shared confirmation/recovery snapshots for preserved rules. |
| 7 | Match isolated UI/browser/backend results and their SHA to the deployed build. |

**Reference:** [FRO-317](https://linear.app/front-line-ltd/issue/FRO-317) · [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321) · [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348) · [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352) · [FRO-379](https://linear.app/front-line-ltd/issue/FRO-379) · [FRO-385](https://linear.app/front-line-ltd/issue/FRO-385) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [Individual evidence](https://github.com/frontlineltdproject-star/linear-project/blob/08bdf90/docs/qa/evidence/vat-single-qa.test.tsx) · [Bulk evidence](https://github.com/frontlineltdproject-star/linear-project/blob/08bdf90/docs/qa/evidence/vat-bulk-qa.test.tsx).
