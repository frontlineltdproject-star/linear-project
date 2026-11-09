**Export Details** must save only reviewed changes, preserve later unsent edits and retain Customs/cancellation recovery when the response is lost.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-EX-04 — unreviewed version | Open an editor, then receive another operator’s changes through refresh. Save uses the newer version with the old draft, potentially overwriting facts. An unchanged invoice editor can remove their newly added invoice. Open EAD/IE599/cancellation confirmations also silently use the newer version. |
| QA-EX-05 — later work erased | Save, then continue typing or removing invoices while pending. The earlier response closes the editor and loses later work. It can also close a replacement editor opened after Escape. |
| QA-EX-06 — unknown treated as failure | Lose an EAD/IE599 or cancellation response. The UI says “Nothing changed”; closing loses the original date/reason, and a changed retry is allowed without checking what happened. |

Isolated tests demonstrate outgoing requests and lost UI state. Actual persisted overwrites or duplicate Customs/cancellation events were not demonstrated.

## Acceptance criteria

1. **Reviewed version:** capture the version when Details, invoice membership, EAD, IE599 or cancellation review begins. Refresh must not silently substitute a newer version. Retain the reviewed version for conflict rejection or require explicit renewed review. Preserve drafts on rejection; recheck current eligibility before another submission.
2. **Invoice intent:** retain the membership baseline reviewed by the operator. Background additions must not become removals merely because they are absent from an older draft. An unchanged editor must not remove another operator’s invoice. Resolve conflicts through fresh review without automatically resubmitting the old selection against a newer version.
3. **Later edits:** either prevent incompatible changes while saving or retain accepted later typing/invoice changes as unsaved work. A response belongs to its original operation and must not close or reset a newer/replacement editor. Never silently submit later edits.
4. **Unknown outcome:** distinguish confirmed rejection from a lost/uncertain response. For EAD, IE599 and cancellation, retain the Export, action, submitted date/reason, reviewed version and payload. Do not show “Nothing changed” without a definitive rejection. Closing, Escape, reopening or navigation must not silently forget the unresolved operation.
5. **Reconciliation:** block conflicting replacement writes until the original outcome is checked. Failed reads retain uncertainty and recovery. Compare authoritative record/activity with the submitted operation; another operator’s similar change is not proof of this attempt’s success. Require explicit review before any changed date/reason/version is submitted.
6. **Preservation:** retain pending-dialog dismissal locks, one active card editor, ordinary conflict-draft retention and server permission/version/date/stage checks. Preserve post-EAD edit/removal/cancellation restrictions, invoice membership rules, protocol/history and unchanged invoice VAT events. Successful reconciliation refreshes Details and affected summaries.
7. **Verification:** cover every consumer in criterion 1, both editors in criterion 3, and EAD/IE599/cancellation unknown results. Use controlled refresh, delayed responses, dialog dismissal, actual isolated-browser navigation and unrelated-writer cases. Verify stale refusal, saved facts/membership and event history in isolated backend tests.

## Decisions and scope

One ticket owns saved-record review → edit/confirm → submit → recovery because the defects affect the same operation lifecycle. Reuse existing Details cards and confirmation components. No new Customs eligibility, cancellation policy, shared concurrency API, list/Entry navigation feature or detailed VAT printing/stamping workflow.

## Context for agents

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployment equivalence is unverified.

- `frontline-forwarding-client/src/features/exports/details/components/export-detail-page.tsx`: editors/dialogs omit reviewed-version capture; writes use current record.version; membership diffs use refreshed invoices; success clears editors; unknown Customs/cancel outcomes become failed and dismissal clears context.
- Adjacent `export-detail-identity-card.tsx`, `export-detail-invoices-card.tsx`, `export-detail-customs-dialog.tsx` and `export-detail-cancel-dialog.tsx`: edit controls and dismissal behavior. Pending confirmation dismissal is already blocked.
- `frontline-forwarding-client/src/features/exports/export-errors.ts` recognizes unknown outcomes; `services/export-service.ts` under the same feature forwards updateDetails, updateInvoices, confirmEad, confirmIe599 and cancel inputs.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/exports/ExportEditingService.java`: requires the supplied version to match current state; supplying an unreviewed newer version defeats the intended stale-review protection.

Affected consumers: Details fields, invoice membership/connected Orders, Customs/cancellation, summaries, protocol and activity. Order = purchase order = stock list item. Fifteen isolated UI observations/controls cover the baseline; extracted Java guard controls use stand-ins, not Spring/database execution. Full browser and persisted-outcome verification remain outstanding.

## Post-deployment verification

Read-only checks against recorded isolated results and the deployed build; submit no production writes. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Compare opened/reviewed/submitted versions for all five actions and inspect conflict retention. |
| 2 | Compare baseline, colleague addition, submitted delta and saved membership. |
| 3 | Compare original payload, later draft and replacement editor after delayed responses. |
| 4 | Inspect lost-response messages and retained date/reason/version across dismissal and navigation. |
| 5 | Inspect reconciliation reads, failed checks and unrelated-writer cases before replacement actions. |
| 6 | Review permission/stage controls and record, summary, protocol and activity snapshots. |
| 7 | Match frontend/browser/backend regression results and their build SHA to the deployed build. |

**Reference:** [FRO-317](https://linear.app/front-line-ltd/issue/FRO-317) · [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings](https://github.com/frontlineltdproject-star/linear-project/blob/40787d4/docs/qa/runs/2026-11-09-export-to-customs-completion.md) · [Details evidence](https://github.com/frontlineltdproject-star/linear-project/blob/40787d4/docs/qa/evidence/export-details-qa.test.tsx).
