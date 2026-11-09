**Order and Shipment** saves must remain bound to the information the operator reviewed. Retrying an unresolved Shipment comment must not create another comment.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| 1. Order retry | Edit Message number at version 7; the first save receives a conflict. Refresh to version 8 and reopen confirmation. While it is open, another save changes Supplier reference at version 9 and a background refresh supplies it. Confirm: the request sends version 9 with the old Supplier reference, although that reversal was absent from the review. |
| 2. Packing review | Open a packing review with a 120 cm unit. Another operator saves 200 cm. After a background refresh, or a conflict followed by reload, the old review can submit 120 cm with the newer version and confirm readiness. |
| 3. Comment retry | A comment commits but its response is lost. Another Shipment edit advances its version; refresh, then retry the unchanged comment. The retry receives a different request ID, which the server treats as a separate comment. |

Evidence: QA-OS-05/06/10 reproduce outgoing requests using actual client code. Duplicate-comment behavior was simulated with an ID-keyed recipient. Backend overwrite/replay effects were traced, not executed against a running database.

## Acceptance criteria

1. **Order:** initial and renewed confirmations retain the exact reviewed version and intended changes. A refresh while review is open must invalidate/rebuild that review or submit its original version for server rejection; never substitute the newest version into old intent.
2. **Packing:** preserve the draft on conflict, but require renewed review before confirming changed canonical packing. Neither refresh-before-submit nor conflict/retry can overwrite a newer arrangement or attest an obsolete plan as Ready.
3. **Atomic refusal:** stale requests leave saved fields, packing, status and successful audit unchanged. Retain editable inputs and an actionable conflict. Preserve unrelated card drafts and existing server version/permission checks.
4. **Comments:** keep the same request identity and bound content until an uncertain attempt is resolved. An unrelated Shipment version change cannot turn that retry into a new operation. Same-ID replay returns the original comment; a deliberately new comment with identical text remains distinct.
5. Exercise each sequence with controlled refresh/lost responses and isolated backend verification. Include controls for the first Order save, retry without a version change, changed-content identity conflict and successful saves. Prevent repeat submission while pending.

## Decisions and scope

Group these submission-safety defects, with separate acceptance checks for each. Do not remove server conflict checks, deduplicate comments solely by text, introduce comments editing/deletion or change lifecycle/permission rules. This ticket does not add a new Order idempotency API.

## Context for agents

Reviewed production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. A source revision is not proof of the deployed version.

Affected consumers: client Details/review state, Order update, Shipment packing/readiness and comment replay contracts.
- `frontline-forwarding-client/src/features/purchase-orders/components/details/order-details-card.tsx`: conflict clears baseVersion; confirmation later falls back to current props instead of capturing the renewed review's version.
- `frontline-forwarding-client/src/features/shipments/hooks/use-shipment-details.ts`: commands use the latest query version; retry keys include version even for unversioned comments. `frontline-forwarding-client/src/features/shipments/components/details/shipment-packing-modal.tsx` retains its old draft/review.
- Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/`: `purchaseorders/service/PurchaseOrdersApiService.java` checks the submitted version under lock; `shipments/service/ShipmentsApiService.java` applies reviewed packing; `shipments/service/ShipmentHistoryApiService.java` replays a comment by request ID.

QA scenarios: **OS-027/028/032**. Preserve existing accepted-request recovery; a known conflict and an uncertain committed outcome are different cases.

## Post-deployment verification

| Criterion | Read-only check |
| --- | --- |
| 1 | Review OS-032's requests: renewed confirmation must not acquire an unreviewed version or Supplier reference reversal. |
| 2 | Review OS-027's refresh-before-submit and conflict/retry requests plus isolated saved-packing/readiness outcomes. |
| 3 | Compare rejection/rollback results with canonical record and audit snapshots; inspect retained-draft assertions. |
| 4 | Compare request/comment IDs in OS-028's lost-response replay and intentional identical-text cases. |
| 5 | Review first-save, no-refresh retry, changed-content conflict and pending-submit controls against the deployed build. |

These checks are read-only. Use existing records and isolated test evidence; do not submit live saves, uploads or lifecycle actions. Missing evidence remains Unverified.

**Reference:** [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316) · [FRO-325](https://linear.app/front-line-ltd/issue/FRO-325) · [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) · [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344) · [FRO-345](https://linear.app/front-line-ltd/issue/FRO-345) · [FRO-346](https://linear.app/front-line-ltd/issue/FRO-346) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA evidence](https://github.com/frontlineltdproject-star/linear-project/blob/4ec2ce7ce41b875695a5336612e92f4176ecc3dd/docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md).
