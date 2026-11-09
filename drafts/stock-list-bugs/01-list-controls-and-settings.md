**Stock List** filtering, pagination and saved table settings must preserve the operator's choices and keep matching Orders reachable.

**Order = purchase order = stock-list item.**

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-SL-01 — Vessel cleared | Select a Client and its Vessel, then set Client to All. Vessel also becomes All although it remains compatible. |
| QA-SL-02 — missing options | An authorized Client/Supplier beyond the first 100 results, and a Vessel belonging only to an omitted Client, cannot be found by exact-name dropdown search. |
| QA-SL-03 — newer settings lost | An earlier grouping-save response cancels a newer column drag awaiting save. An older settings read can also revert a grouping already saved successfully. |
| QA-SL-04 — Flags position | Move Flags before Status. Server preference normalization omits Flags; the response makes it jump to the end. |
| QA-SL-05 — stranded page | View page 2 of 21 results at 20 per page. A refresh reduces matches to 20; page 2 stays empty and Previous/Next disappear. Applies to ordinary and grouped lists. |

Examples are synthetic. Isolated UI tests reproduce these behaviors; Flags uses a response derived from the inspected server allowlist. Actual database persistence and deployed behavior were not tested.

## Acceptance criteria

1. **Independent filters:** clearing Client preserves a selected compatible Vessel and other filters. Choosing a specific incompatible Client still clears its old Vessel. Preserve combined-filter semantics and the existing page reset when a filter changes.
2. **Complete option access:** search/pagination reaches authorized Clients, Suppliers and their Vessels beyond the initial batch. Do not treat an incomplete option page or failed read as proof that no match exists. Preserve company scope, identity-based selection and existing loading/error behavior.
3. **Newer preferences:** late reads or earlier save responses cannot replace newer local column/grouping choices or undo a later successful save. A newer drag awaiting its save must survive and be persisted, or retain visible failure feedback. Preserve cold-load restoration and protection for already-submitted queued saves.
4. **Flags persistence:** accept Flags in the saved column order and restore its chosen position after the response and reopening. Preserve other saved columns, optional visibility and grouping; do not reset existing users' settings.
5. **Page recovery:** when refreshed results remove the current page, move to a valid remaining page or retain usable navigation to it. Cover grouped and ordinary lists, including zero results. Correcting one group's page preserves unrelated groups, filters, sorting and selected Order IDs.
6. **Compatibility:** preserve permissions, EN/EL controls, explicit clearing, selection across list changes and its reset on leaving. Screen settings never alter the fixed PDF layout. If shared option reads change, preserve their contracts for Order forms, inline Order creation and currency consumers, including Shipment Invoice.

## Decisions and scope

These five fixes share the existing Stock List controls and preferences. Include the server preference-policy correction required for Flags. Reuse current controls; no new screen or component. Broader per-column/date-control requirements, new filters, cross-device preference conflict handling and business-record edits are outside scope.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed equivalence is unverified.

- Client `src/routes/secured/purchase-orders/index.tsx`, `features/purchase-orders/components/purchase-order-table.tsx` and `purchase-order-table-state.ts`: filters, column hydration/order and list/group pagination.
- Client `features/preferences/hooks/use-table-preference.ts`, `features/purchase-orders/graphql/purchase-orders.graphql` and `services/purchase-order-service.ts`: delayed preference results and first-page company options. `usePurchaseOrderFormOptions` is shared; preserve its other readers or isolate the list correction.
- App `domain/preferences/PurchaseOrderTablePreferencePolicy.java` and `web/preferences/service/UserTablePreferencesApiService.java`: Flags is absent from the accepted lists. `web/purchaseorders/service/PurchaseOrdersApiService.java` retains the requested page when totals shrink.

Paths are under client `src` or app `src/main/java/com/frontline/forwarding`. Convert the retained observation assertions into fix regressions.

## Post-deployment verification

Use read-only source/build inspection and isolated regression evidence; do not trigger production preference saves. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Inspect clear-Client and incompatible-Client recordings and their exact filter requests. |
| 2 | Review beyond-first-page client/supplier/vessel searches, failed reads and restricted-user results. |
| 3 | Review both delayed-response cases, retained newer saves and cold-load/queued-save controls. |
| 4 | Compare submitted, normalized and reloaded Flags positions; check existing saved settings survive. |
| 5 | Inspect grouped/ordinary page-shrink and empty-result cases, retained selections and independent group pages. |
| 6 | Match permission, EN/EL, selection, fixed-PDF and affected shared-reader results to the deployed revision. |

**Reference:** [FRO-254](https://linear.app/front-line-ltd/issue/FRO-254) · [FRO-279](https://linear.app/front-line-ltd/issue/FRO-279) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA evidence](https://github.com/frontlineltdproject-star/linear-project/blob/ccbcc002634500c5c369a5543767487c45e64df3/docs/qa/evidence/stock-list-filters-notes.md).
