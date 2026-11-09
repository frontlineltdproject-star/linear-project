**VAT stamping confirmations** must use reviewed information, keep the submitted date stable and preserve the newest displayed invoice progress. Apply this to dispatch, stamped return and onward sending in Supplier Invoice Details and Export bulk actions.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-VAT-03 — bulk selection | Select A/B, then refresh after another operator advances A's stage. A remains selected and is submitted although it is hidden or disabled in the previous stage. |
| QA-VAT-04 — unreviewed version | Open an individual confirmation at version 3; refresh to version 4 with changed invoice facts. Confirm silently sends version 4 without renewed review. |
| QA-VAT-05 — pending date | Submit 5 November, then select 6 November while saving. The earlier success closes the dialog and loses the newer choice. |
| QA-VAT-09 — older displayed progress | Leave during bulk dispatch, return to a newer record showing stamped return, then receive the old dispatch response. The return date disappears from the screen and progress moves backwards. |

Dates/versions are synthetic examples. Tests prove UI and request behavior; persisted overwrite or database rollback was not demonstrated.

## Acceptance criteria

1. **Reviewed individual state:** retain the invoice/version reviewed when confirmation opens. Refresh must not silently replace that version. Keep it for server conflict rejection or require explicit renewed review; preserve the entered date on conflict and recheck current eligibility.
2. **Pending input:** capture the event, invoice(s), Export, date and applicable reviewed version at submission. Disable the date picker and incompatible changes while pending, retaining duplicate-submit and dismissal locks. Completion must not discard later accepted work or reset another action.
3. **Eligible bulk selection:** reconcile every stage's selection after canonical refresh. Remove newly ineligible IDs, update visible counts/checkboxes and explain changes, including in an open confirmation. Preserve unaffected choices/date for review and validate again before submission; no hidden/disabled selected ID or empty request. Once submitted, preserve the original attempt rather than retargeting it.
4. **Current progress:** an older bulk response must not replace newer loaded invoice dates/statuses, including after navigation and return. Use a canonical reread where freshness cannot be established. Protect any newer dialog and update affected stage tables/counts consistently.
5. **Preservation:** retain independent selections, partial per-invoice outcomes and unchanged rejected/unselected invoices. Preserve staff authority, positive IE599, type/stage/date/version checks, same-date replay without another event, protected recorded dates, protocol and Customs state. Sending leaves the invoice Exempted.
6. **Scope coordination:** use the same reviewed/submitted facts as the companion uncertain-attempt recovery ticket. Keep original attempt data available to recovery; normal selection pruning must not delete its submitted invoice IDs. Preserve FRO-379/385's separate correction/cancellation/Customs ownership.
7. **Verification:** cover all three events on both entry points, real calendar interaction, same-stage and stage-changing refresh, stale confirmation, partial results and delayed response after navigation. Verify saved invoice/activity outcomes and replay guards in isolated backend tests.

## Decisions and scope

One ticket owns reviewed confirmation → submission → successful displayed result. Reuse existing controls; disable pending date edits instead of accepting unsendable changes. Uncertain-result messages, persistence across dismissal and original-attempt reconciliation belong to the companion recovery ticket. No new bulk-version API, event correction policy, history rewrite or Shipment Invoice work.

## Context for agents

Baseline main: 6aa259553cd9c86a8aaa157902088aa9a6bca83e.

- Client `src/features/supplier-invoices/components/supplier-invoice-export.tsx:242–254,328–339` reads live version and allows pending date changes.
- Client `src/features/exports/details/components/export-detail-page.tsx:250–256,504–565` prunes only after selected saves and unconditionally writes response data to shared cache; adjacent stamping dialog leaves DatePicker enabled.
- App `src/main/java/com/frontline/forwarding/domain/exports/ExportStampingService.java` shares invoice event guards across recordSupplierInvoiceStampingEvent and recordExportStampingEvents. Events update invoice-owned facts; Export version alone does not establish their freshness. SupplierInvoiceRepository persists date/status/version and activity.

## Post-deployment verification

Read-only inspection of isolated evidence and existing records; no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Compare reviewed/submitted versions and conflict recordings for every individual event. |
| 2 | Inspect calendar/control states and original payloads during delayed completion. |
| 3 | Compare refreshed stage rows, selection notices/counts and outgoing bulk IDs. |
| 4 | Inspect navigation/interleaving evidence and canonical snapshots for retained newer return/sending facts. |
| 5 | Review partial-result, permission, chronology, replay and unchanged-record/activity controls. |
| 6 | Compare the confirmation snapshot with recovery evidence; verify submitted IDs survive pruning. |
| 7 | Match isolated UI/browser/backend results and their SHA to the deployed build. |

**Reference:** [FRO-317](https://linear.app/front-line-ltd/issue/FRO-317) · [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321) · [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348) · [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352) · [FRO-379](https://linear.app/front-line-ltd/issue/FRO-379) · [FRO-385](https://linear.app/front-line-ltd/issue/FRO-385) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [Individual evidence](https://github.com/frontlineltdproject-star/linear-project/blob/08bdf90/docs/qa/evidence/vat-single-qa.test.tsx) · [Bulk evidence](https://github.com/frontlineltdproject-star/linear-project/blob/08bdf90/docs/qa/evidence/vat-bulk-qa.test.tsx).
