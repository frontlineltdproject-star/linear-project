**Supplier Invoice creation** must keep the selected Order, creation attempt, documents and saved result together across delayed responses and navigation. Order = purchase order = stock-list item.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-SI-01 — replacement during creation | Submit invoice A with a file, delay its response, leave and open creation from another Order. Choose Discard and start, then select B's file without submitting B. A's late success sends B's file to A's saved invoice. Replacing an unknown attempt can also forget its recovery context and allow another creation. |
| QA-SI-02 — cancelled lookup | Open creation from Order A with its lookup delayed. Cancel, open from Order B and type invoice facts. A's late lookup changes the selected Order to A while B's facts and origin remain. |
| QA-SI-03 — failed return | Create successfully, then make Return to Order navigation fail. The confirmed result and saved ID disappear, and an actionable Create form returns. |

Evidence: four isolated frontend observations reproduce these requests/state changes. Navigation, server and storage were mocked; live wrong-owner persistence or a duplicate invoice was not demonstrated.

## Acceptance criteria

1. **Unresolved creation:** preserve the original request identity, submitted payload, Order and file context while pending or unknown. Leaving, reopening or choosing Discard and start must not forget or replace that attempt or permit a new creation before its outcome is resolved.
2. **File ownership:** bind every queued file and upload/retry to its own creation attempt and returned invoice ID. A late response must never upload another draft's files or replace that draft's state. Reconcile uncertain uploads using the same owner/file identity; retain successful uploads and pending bytes without duplicate creation/upload.
3. **Late lookups:** responses from a cancelled or superseded form cannot change a newer draft's selected Order, derived context, entered facts or files. Explicit selection in the current draft remains authoritative.
4. **Failed return:** retain confirmed invoice ID, actual invoiced Order, originating Order and document outcomes when navigation fails. Keep an actionable result/recovery view and allow navigation retry without repeating creation. Preserve the existing deliberate-leave warning for remaining local files; Start another invoice remains an explicit action after unresolved work is handled.
5. **Preservation controls:** known rejection retains editable facts/files; cancelling an unsubmitted draft creates/uploads nothing; explicit new creation after resolved work still works. Preserve permission, eligibility, duplicate and validation rules, and refresh the actual invoiced Order rather than merely the origin.
6. **Verification:** cover all three cases with controlled delays/failures, including pending and unknown replacement, real route departure/re-entry in an isolated browser, successful navigation and same-file retries. Verify stored attachment ownership and bytes in an isolated integration run; convert observation assertions into expected-behavior regression checks.

## Decisions and scope

Group these creation-state defects because they share the creation controller and draft lifecycle; verify every case separately. Reuse the existing Create and Order entry designs. No new invoice workflow, permission, attachment API, cross-entity upload repair or changes to unrelated Order/Shipment tickets.

## Context for agents

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; not proof of the deployed version.

Under `frontline-forwarding-client/src/features/supplier-invoices/`:
- `components/supplier-invoice-create-page.tsx`: replacement resets shared state; late creation reads its current file queue; selection tokens survive only within one instance; finish clears state before return navigation succeeds.
- `create/create-draft.ts`: shared draft, request, file and saved-result state.
- `services/supplier-invoice-service.ts`: `createSupplierInvoice` and invoice-owned `POST /api/v1/supplier-invoices/{id}/attachments`, carrying `clientFileKey`.

Affected consumers: standalone/Create-from-Order entry, result/recovery, attachment uploads and actual/origin Order refresh. Preserve FRO-321's server ownership and replay protections; this ticket repairs client coordination. QA scenarios: SI-010/012/013/014/026/027.

## Post-deployment verification

Read-only checks using existing records and isolated evidence; submit no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Inspect pending/unknown replacement recordings and request logs for retained original identity and no new creation before reconciliation. |
| 2 | Compare captured file keys/bytes and persisted attachment owners across the two drafts and retry controls. |
| 3 | Inspect the cancelled-lookup recording: the current selected Order and entered facts remain unchanged. |
| 4 | Inspect failed-return evidence for the saved result/ID and a navigation-only retry. |
| 5 | Review rejection, pre-submit Cancel, fresh-creation and correct-Order refresh controls. |
| 6 | Review isolated browser/integration results and their build SHA against the deployed build. |

**Reference:** [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321) · [FRO-347](https://linear.app/front-line-ltd/issue/FRO-347) · [FRO-349](https://linear.app/front-line-ltd/issue/FRO-349) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings](https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/runs/2026-11-09-supplier-invoice.md) · [Creation evidence](https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/evidence/supplier-invoice-create-qa.test.tsx).
