**Customs Storage Entry Order relationships and actions** must reflect verified admission and coverage facts. Correct missing warehouse warnings, false covered-child messages and stale admission actions in the existing Details and Order screens.

**Order = purchase order = stock-list item. Customs Storage Entry = Δελτίο Εισόδου.**

## Problems to fix

| Finding | Reproduction and current result |
| --- | --- |
| QA-CSE-07 | Select an Order at a different warehouse and confirm Change Order before its warehouse read finishes. Both the confirmation warning and post-save warehouse review notice are missing. |
| QA-CSE-08 | Open from A and move the entry to independent B. A remains the return destination but is falsely described as a covered post-admission split child. |
| QA-CSE-10 | Confirm an otherwise eligible Order in stock. The Order refreshes to In stock while the independently cached entry shortcut still says Not admitted and disables Create. |

These were reproduced in isolated UI/integration tests. The false banner does not alter backend coverage; the stale shortcut is not evidence that admission failed.

## Acceptance criteria

1. **Ready target before confirmation:** Change Order must load the selected target's current eligibility/admitting warehouse before enabling confirmation. Loading, failed or incomplete target facts never mean same warehouse. Show loading or an error with Retry, retain the chosen Order and block confirmation until facts are available. Ignore results for a superseded target; if relevant target facts change while the dialog is open, require review of the updated confirmation.
2. **Warehouse warnings and preserved values:** when the target's admitting warehouse differs, the confirmation names the target and warehouse and explains that saved operator/address/permit values stay unchanged. After a confirmed or reconciled move, show the existing Warehouse operator review notice for the new warehouse until page reload. Keep entry number and all entry-owned values unchanged. Same-warehouse changes show no false difference warning; server rejection must not show a completed-move notice.
3. **Verified coverage banner:** determine covered-child status through the existing authorized by-Order coverage read, matching both the returned entry identity and inherited access. Different owner/return IDs, family root or text similarity are insufficient. Show the banner for a genuine covered child/grandchild only. Retain valid Back-to-Order context independently; after A-to-independent-B movement, Back to A remains without claiming A is covered. Recheck after owner changes. Failed/unresolved coverage reads must not assert coverage and must offer recovery without relinking anything.
4. **Fresh shortcut after stock confirmation:** successful stock confirmation refreshes the affected Order's Customs Storage entry/eligibility read, including when Available actions stays mounted. Render the server result: Open for an existing direct/inherited entry; Create for an eligible unowned Order with create authority; otherwise the existing disabled reason or authority state. Do not infer admission/coverage from In stock alone. During recheck or failure, show the appropriate loading/error/Retry state and no usable Create based on stale data.
5. **Preservation and ownership:** retain server eligibility ordering, admission/split coverage, current-entry precedence, authority checks and existing Create/Open destinations. Change Order continues to refresh owner-derived facts and existing old/new-owner lookups without changing Orders, invoices or Export. Reuse current components and EN/EL warning/feedback patterns with keyboard and narrow-screen support. Reviewed versions and pending/uncertain write recovery belong to the separate draft/save-recovery correction; compose these warnings and coverage refreshes with its confirmed outcomes.
6. **Regression coverage:** test delayed, failed, incomplete and out-of-order target reads; different/same-warehouse moves and rejection; unrelated return Orders versus real children/grandchildren; coverage-read failure and changed ownership; and successful stock confirmation through the actual form, mutation hook and mounted shortcut. Include failed refresh/Retry and existing direct/inherited entry controls. Assert target/entry IDs, warning timing, retained entry fields, server-derived actions and absence of unintended writes.

## Decisions and scope

- Return navigation and admission coverage are separate facts. Preserve the former without inventing the latter.
- Warehouse differences must be known before confirmation because Change Order deliberately retains entry-owned warehouse text.
- Stock confirmation refreshes the existing entry read; it does not introduce another client-side eligibility calculation.
- **FRO-319, FRO-354 and FRO-355 are references only:** do not reopen them, expand their scope or make them prerequisites.

Out of scope: draft/save-result recovery owned by the separate correction; pending Customs Storage list/menu, active-register screen, Excel, printing and recipient copies; new links from Invoice/Export screens; Export and VAT stamping; changes to admission, stock-confirmation, coverage, numbering or authorization rules; schema/migration, historical corrections or general Order cache redesign. Reuse the current UI components and layout.

## Context for agents

Reviewed source: main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed-build equivalence remains unverified.

- Client prefix `frontline-forwarding-client/src/features/customs-storage/`: `details/components/customs-storage-details-page.tsx` derives `otherWarehouse` from the asynchronously loaded target and currently treats unequal return/owner IDs as coverage. `details/components/change-order-dialog.tsx`, `details/components/order-relationship-card.tsx` and the Details layout consume those values.
- `services/customs-storage-service.ts` already exposes `customsStorageEntryDraft`, `customsStorageEntryByPurchaseOrderId` and the Order card read. Use server warehouse/eligibility and returned entry/access/owner facts; no new coverage endpoint is assumed.
- `order-card/order-customs-storage-card.tsx` uses `customsStorageKeys.orderCard`. `frontline-forwarding-client/src/features/purchase-orders/hooks/use-purchase-orders.ts` invalidates only `purchaseOrderKeys.all` on command success. `purchase-orders/components/details/order-details-page.tsx` keeps the Available actions tab mounted. Trace stock-confirmation success through both caches.
- Backend `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customsstorage/CustomsStorageEntryEditingService.java` retains entry values/number on Change Order and rechecks the target. Existing admission and coverage services remain authoritative. No backend data-rule change is required by these findings.

Retained tests demonstrate current UI behavior using synthetic service boundaries. Real deployed-browser, database and authenticated-session behavior remains unverified.

## Post-deployment verification

Read existing records, recordings and isolated test results only; submit no production writes. Missing evidence remains Unverified.

| Criterion | Read-only check |
| --- | --- |
| 1 | Inspect delayed/failed/retried and out-of-order target-read recordings; confirmation must remain blocked until the selected target's facts are ready and reviewed. |
| 2 | Compare different/same-warehouse confirmation and post-result recordings with saved number, operator/address/permit values and the new owner's warehouse; inspect rejection behavior. |
| 3 | Read seeded independent A/B and genuine covered child/grandchild lookups; compare entry identity/access with the banner and unchanged return destination, including failed lookup and post-move cases. |
| 4 | Inspect stock-confirmation recordings and read logs; compare the refreshed shortcut with the canonical eligibility/entry result and failed-refresh Retry behavior. |
| 5 | Review role, eligibility, coverage, existing-entry precedence, route, retained-field/related-record and EN/EL/accessibility results. |
| 6 | Match integrated regression evidence to the deployed source revision; verify IDs, call counts, warning timing and absence of unrelated mutations. |

**Reference:** [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319) · [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354) · [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355) — references only · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings and evidence](https://github.com/frontlineltdproject-star/linear-project/blob/ececdaa/docs/qa/runs/2026-11-09-customs-storage-entry.md).
