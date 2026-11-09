**Supplier Invoice Details** must retain unresolved operations, keep cancellation tied to the invoice the operator reviewed, and preserve later typing when an earlier save completes.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-SI-04 — cancellation recovery | Confirm cancellation and lose its response. Close the dialog through Cancel: Check original attempt and navigation protection disappear, and a correction request becomes possible without checking the outcome. Pending cancellation also lacks navigation/unload protection. |
| QA-SI-05 — unreviewed cancellation | Open confirmation at version 3/net 100.00. Another operator changes net to 900.00/version 4; background refresh receives it. Confirm sends version 4 without renewed review. |
| QA-SI-06 — later typing | Save invoice number SENT, then type LATER into the still-enabled field while saving. Original success closes the editor and loses LATER. The same loss occurs when Check original attempt confirms the earlier save. |

Amounts/versions are synthetic examples. Isolated frontend tests demonstrate lost state and outgoing requests; no live cancellation or backend guard bypass was performed.

## Acceptance criteria

1. **Cancellation recovery:** retain the unresolved cancellation and access to Check original attempt until an authoritative result is obtained. Cancel, close, Escape and dialog dismissal must not silently reset pending/unknown to idle. Failed checks keep recovery available; closing the window does not undo a sent request.
2. **Conflicting actions and navigation:** while cancellation is pending/unknown, prevent a new correction or cancellation attempt until reconciliation. Apply existing in-app navigation and unload protection. Any permitted dismissal/leave path must not falsely present the outcome as resolved; returning must reconcile before further mutations.
3. **Reviewed cancellation:** capture the version reviewed when confirmation opens. A refresh must either invalidate confirmation and require renewed review, or retain that version for server conflict rejection. Never silently adopt a newer version. After a conflict, require fresh review; if cancellation becomes ineligible, disable confirmation and retain server checks.
4. **Later typing:** either prevent incompatible editing during pending/unknown correction, or preserve accepted later typing as unsaved work when the original save/check succeeds. Save only the originally submitted payload; never silently discard or automatically submit later changes.
5. **Preservation controls:** keep one card editor, ordinary correction's captured version, submitted-fact comparison during unknown-result recovery, and known-rejection draft retention. Preserve permission, Export/event and cancelled-record guards. Failed/stale requests must leave saved facts and successful activity unchanged.
6. **Verification:** exercise all cases with controlled response loss, delayed saves and background refresh. Cover every dialog dismissal path, real isolated-browser navigation, cancellation success/rejection/check failure, and unrelated-writer recovery. Confirm actual stale refusal and saved/audit outcomes in isolated backend tests.

## Decisions and scope

Group the three Details interaction defects, retaining separate checks for each. Existing editing and confirmation components remain the presentation contract. No new cancellation eligibility, reactivation, exemption progression or general concurrency API. The agreed full-Order-split exception and its specification wording are outside this fix.

## Context for agents

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed behavior remains unverified.

- `frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx`: dirty/busy state omits pending cancellation; dialog close clears unknown; confirm uses current invoice.version; save/checkSave close the editor despite later input.
- Adjacent `supplier-invoice-confirmation.tsx`: shared dismissal and recovery controls.
- `frontline-forwarding-client/src/features/supplier-invoices/services/supplier-invoice-service.ts`: `correctSupplierInvoice` and `cancelSupplierInvoice(id, expectedVersion)`.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/supplierinvoices/SupplierInvoiceService.java`: version, authorization and lifecycle checks; correction/cancellation and activity are transactional.

Affected consumers: Details cards, confirmation/recovery, navigation guards, canonical invoice and Order refresh. Ordinary correction-version protection already works and must remain. QA scenarios: SI-016/017/018/020.

## Post-deployment verification

Read-only checks using existing records and isolated evidence; submit no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Inspect lost-response/dismissal recordings and failed-check results for retained recovery. |
| 2 | Inspect action availability and browser navigation evidence while cancellation is pending/unknown. |
| 3 | Compare reviewed and submitted versions in refresh/conflict recordings; inspect stale refusal and ineligible-state controls. |
| 4 | Compare original request, saved value and later draft in delayed-save and Check original attempt evidence. |
| 5 | Review controls and canonical record/activity snapshots for preserved protections and no rejected-write effects. |
| 6 | Match isolated frontend/browser/backend results and their build SHA to the deployed build. |

**Reference:** [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321) · [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings](https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/runs/2026-11-09-supplier-invoice.md) · [Details evidence](https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/evidence/supplier-invoice-details-qa.test.tsx).
