# FRO-326 — UI completion and integration readiness review

Reviewed 23 October 2026. This is a review and proposed implementation-plan correction, not a replacement Linear description or authorization to publish. Current issue descriptions, relations, metadata and relevant comments were read through Linear. Production main was verified through authenticated gh at `3820e89e8caa341261e2d48bcb282d93e1bb1d03`, unchanged from the detached implementation base. No production deployment or private feature-branch completion is inferred from board status.

## Conclusion

The previous plan unnecessarily deferred some React component preparation together with backend integration. FRO-292 explicitly gives FRO-326 ownership of the two Notes sections and independent editors. Its dependency blocks live integration, not preparation of the specified presentation. FRO-333 and other owners likewise allow visual work before their contracts ship.

Prepare the full agreed React interface now, starting with Notes, while keeping new-contract demonstrations in an explicitly local development/test composition. Reuse those same components for later integration. This is a proposed change to the earlier supported-only plan; it is not already approved. Production-facing components must not fabricate saved values, API operation names, authorization decisions or successful persistence. Existing working routes stay available until parity. Unsupported data must not be displayed as an authoritative empty/false value.

Three distinct completion states should be reported per feature: component prepared; connected to actual contracts; integration verified. A component demonstrated against fixtures is not a delivered business operation.

## Consumer and ownership matrix

| Consumer / area | Current behavior and source | Frontend work possible now | Actual integration prerequisite / owner |
| --- | --- | --- | --- |
| Overview and navigation | Existing Order read contains Vessel, Greece, currentWarehouseStay, DN references and Urgent fields; local preparation currently omits several. Order GraphQL output and detail component. | Complete saved-field display, agreed tab order, nested status placement, localized status labels, responsive layout, authorized lineage links. These are not backend-blocked. | FRO-326. Preserve actual missing values, scope, lifecycle commands and unsaved-navigation protection. |
| Notes | One legacy `notes` field; broad update, no independent field-presence or client revision contract. PurchaseOrderUpdateInput, validator/service, GraphQL schema. | Reusable Notes card with Internal/External sections, independent drafts/Edit/Save/Cancel, 2,000-character validation, multiline/empty states, EN/EL, focus and failure/conflict presentation. Demonstrate with fictional values outside the production data adapter. | FRO-292: two stored fields, authorized reads, omitted-versus-clear semantics, versioned notes-only save and canonical response. Do not map the old field to two values or use a broad update as a notes patch. |
| Notes downstream readers | Legacy notes copied by both split paths and used by StockListPdfModelFactory. Output assembler exposes current notes contract. | Frontend visibility states can be tested; no backend privacy guarantee can be supplied by hiding a textarea. | FRO-292: legacy text becomes Internal exactly; External starts empty, server-side exclusion externally, PDF uses External only, both split paths copy once. Creation and Shipment consumers remain owned by their named tickets. |
| Shared Details edit and readiness correction | Separate update/correctStatus calls; ordinary update includes collections and lacks reviewed client version. | Complete editor, permitted-field locks, draft/confirmation/cancel and conflict states using an explicit UI input/output boundary. Existing ordinary field controls are reusable. | FRO-346 versioned atomic ordinary/correction command. No sequential two-call simulation of one Save. Keep standalone Edit until full replacement passes. |
| Later Invoice company / ALK correction | Current broad update rejects later-stage header editing. No delivered narrow correction/impact integration. | Correction chooser, one correction per session, locked other fields, impact-review/error presentation with sample input. | FRO-303 document-conflict/regrouping operation; FRO-356 capability/registration-coverage/ALK operation. Real impact and eligibility must come from their contracts. |
| Pickup / explicit customs | Current data has pickupInGreece, ALK, KTA and legacy bonded; no separate nullable Pickup or explicit regime/capability model. | Final approved selectors, clear/unset behavior, conditional ALK, explicit removal confirmation and loading/error states. | FRO-333 nullable responsibility; FRO-356 regimes/capabilities/coverage and guarded clearing. Never derive them from Greece, warehouse names, KTA or bonded. |
| Retired Order/colli fields | Current validators, persistence and queries still contain route/Collection agent/PCS/colli notes/import reference. | Final target composition can omit obsolete display/control sections. Existing supported route should retain necessary compatibility until coordinated migration. | FRO-329/334 and FRO-294/295/332 own contract removal, caller compatibility and cleanup. Hiding a field does not retire it; do not drop required inputs or manufacture hidden defaults. |
| Colli row editing | Existing full Order update reconciles the complete submitted active-colli collection; omitted saved collis can become CANCELLED. No reviewed client-revision precondition. | Complete row editor, selection, Add/Add identical drafts, conditional flags/DG fields, terminal display and operation confirmation using reusable components. Existing split/terminal commands can retain their current integration. | FRO-297 new flags/details, FRO-294/295/332 retirements, FRO-356 bonded cleanup. Safe preservation/stale handling for independent row Save needs an explicit structural contract/owner decision; delivery of flags alone does not establish it. |
| Invoice-row editor | Quantity plus writable total; no Unit price, Float money transport, collection replacement and no reviewed client revision. | Nine-column editor, independent drafts, exact decimal preview, validation, Add/Remove and conflict presentation. No price inferred from saved total. | FRO-337 exact transport/server calculation, unit-price persistence and stale-save protection. Preserve other saved rows and their identities. |
| Readiness emails | Existing eligibility/history and direct manual send; no preparation reference/content-bound confirmation. | Both button locations, shared read-only review dialog, pending/error/stale states and focus behavior. Existing history can be restyled now. | FRO-328 prepare/review/explicit-confirm, refreshed eligibility/context, at-most-once confirmation. Do not put a cosmetic review in front of the legacy send and call it complete. |
| History/comments/documents | Existing histories, actor/provenance, comment command, reminder history and AttachmentPanel. | Complete three-card history layout, comments controls, reminder table, wrapping/sorting/empty/error states and existing attachment presentation. | FRO-326 using current contracts. Do not wait on Shipment-only FRO-345 or reinterpret comments as Internal Notes. Preserve attachment authority and inherited provenance. |
| Create supplier invoice | Target entity and create route not delivered on checked main. | Action-card rendering and authorized/ineligible/loading/error presentation, navigation callback with stable Order context in tests. | FRO-321 entity and FRO-347 creation page, then FRO-349 shortcut integration. No guessed URL or substitute Order invoice-row form. |
| Entry Note Create/Open | No delivered current-note lookup/coverage or target routes. | Card and mutually exclusive Create/Open/loading/error/denied/inherited presentation from explicit inputs. Unknown is not absence. | FRO-319 coverage/lookup/permissions, FRO-353 creation, FRO-354 details, FRO-355 shortcut. Preserve origin-child return context; never invent a route or assume no existing note. |
| Split relationships | Existing explicit root/parent/child/family identities and authorized records. | Complete FRO-326 relationship presentation using current data, with current record not self-linked. | FRO-330 tree/compact-unsplit enhancement is downstream: FRO-326 blocks FRO-330, not the reverse. Do not import its extra scope as a prerequisite. |

## Notes: exact next frontend work

1. Add a full-width Notes card in Overview between Order details and Split relationships.
2. Build separate Internal Notes and External Notes read/edit sections with independent drafts and controls. Maximum 2,000 characters each; plain text, preserved internal line breaks, empty dash, trim only new/edited input. Preserve the other draft through saves, cancellation, tabs and language changes.
3. Test permitted/read-only visibility, pending/error/conflict handling, explicit clearing, Cancel/Escape/focus restoration and navigation protection using fictional component inputs and callbacks. No fixture fallback in the real Order API adapter.
4. Integrate actual authorized values and the notes-only versioned operation when FRO-292 delivers it. Update generated bindings from the delivered schema; do not invent wire names now. Verify omitted fields, clear, stale rejection, independent canonical refresh and server confidentiality with safe-environment evidence.

Thus the Notes UI can be the next implementation slice. Persisted Notes integration is later, specifically after FRO-292—not after all unrelated dependencies. There is no delivery date promised by the current evidence.

## Gaps requiring explicit treatment

- **Release ordering:** FRO-326 targets0.0.5 but is blocked by FRO-349 at0.0.6 and FRO-355 at0.0.11. The current full specification cannot be called complete at0.0.5 while those required actions are missing. Keep full scope unless the user explicitly approves a split; align sequencing/milestones separately before release. No metadata changed in this review.
- **Colli save boundary:** new flag delivery alone does not make full-collection updates a safe independent row operation. Assign an explicit structural owner and specify preservation/concurrency semantics before enabling new live row saves. This review does not silently extend FRO-297 or create a ticket.
- **Unspecified wire contracts:** FRO-292/346/328 deliberately leave exact operation names or storage mechanics to implementation. UI boundaries can be prepared; production adapters cannot yet be finalized. Entry Note structural edge cases remain owned by FRO-319 and its target pages, not resolved by fixture examples.
- **Historical references:** FRO-293/313/314 are Canceled. Their original KTA/progress/separate-correction placement must not override newer FRO-356/346/326. FRO-298 remains Backlog with old KTA-based wording and is not a blocking link; flag it for a separately approved cleanup. FRO-303's20 October comment predates its21 October resolved description; do not reopen answered questions from that comment.
- **Readiness labels are not delivery evidence:** some dependencies remain Pending_Review; FRO-328 has both Ready and Pending_Review. Current main code and acceptance evidence, not labels alone, determine integration readiness. No dependency was treated as delivered because it is In Progress.

## Proposed completion sequence

**A. Finish presentation and local interactions now.** Close current-contract gaps first, then Notes, final Details/restricted editors, colli/invoice editors and action reviews. Use the actual production primitives and reusable React components. A separate explicitly labelled local review composition supplies only fictional inputs for missing capabilities; the normal adapter continues to use real existing contracts. Do not create fake production endpoints, route links, security decisions or save success.

**B. Integrate feature by feature as owners deliver.** Start Notes integration after FRO-292; other slices need not delay it. Require published schemas/generated bindings, exact permissions/eligibility/version/error responses and relevant safe-environment evidence. Preserve legacy paths until each replacement has parity. Dependencies do not grant permission to implement backend changes in this task.

**C. Verify full scope and show the complete diff.** Check each FRO-326 acceptance criterion against real integration, EN/EL, narrow layouts, failed/stale writes, retained drafts and navigation. Review all remaining baseline check failures. Only then consider final completion and old Edit-route retirement. Branch creation, commit/push and publishing still require the user's separate explicit approval.

This corrects the earlier plan's blanket wording “FRO-292 before independent editors”: it should say “FRO-292 before production read/save integration of independently prepared editors.” The same distinction applies to invoice controls, reviewed email and document action compositions. It does not authorize pretending these features work against today's backend.

## Source evidence

All paths below are in `Frontline-Forwarding/frontline-forwarding` at the verified main SHA:

- `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls`: current field/input shape, separate commands and missing target contracts.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/input/PurchaseOrderUpdateInput.java`: broad update inputs.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java`: current validation and header dependencies.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java`: ordinary-update guards, full collections, split/correction behavior.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderOutputAssembler.java`: existing read and history values.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/StockListPdfModelFactory.java`: legacy notes PDF source.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java`: partial-selection split copy.
- `frontline-forwarding-client/src/features/purchase-orders/services/purchase-order-service.ts`, `graphql/purchase-orders.graphql`, components `purchase-order-detail.tsx`, `purchase-order-form.tsx`, `readiness-reminder-action.tsx`: current queries, payloads, forms and command integration.
- `frontline-forwarding-client/src/routes/secured/`: existing route inventory; no delivered Supplier Invoice/Entry Note target route on checked main.

No new domain vocabulary or architectural decision was adopted, so no glossary/ADR change is needed. Existing approved design is reused; no new canvas or hosted preview was created. This turn changes planning documentation only, not production source or Linear.

## Current issue inventory

The following current metadata is a review snapshot, not proof of implementation.

| Issue | Status | Milestone | Labels |
| --- | --- | --- | --- |
| [FRO-292](https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes) | Todo | 0.0.3 | Shipment, Order, Ready |
| [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign) | Todo | 0.0.5 | Order, Pending_Review, Frontend, Story |
| [FRO-303](https://linear.app/front-line-ltd/issue/FRO-303/order-change-invoice-company-after-shipment-inclusion) | Todo | 0.0.1 | Order, Pending_Review, Backend, Story |
| [FRO-356](https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location) | Todo | 0.0.2 | Order, Pending_Review, Backend, Story |
| [FRO-346](https://linear.app/front-line-ltd/issue/FRO-346/order-details-combine-details-editing-and-readiness-correction-in-one) | Todo | 0.0.4 | Order, Pending_Review, Backend, Story |
| [FRO-333](https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no) | Todo | 0.0.3 | Order, Pending_Review, Backend, Story |
| [FRO-334](https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency) | Todo | 0.0.3 | Order, Pending_Review, Backend, Story |
| [FRO-337](https://linear.app/front-line-ltd/issue/FRO-337/order-invoice-rows-add-unit-price-and-calculate-read-only-total-value) | Todo | 0.0.3 | Order, Pending_Review, Backend, Story |
| [FRO-294](https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli) | In Progress | 0.0.1 | Order, Ready |
| [FRO-295](https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli) | In Progress | 0.0.1 | Order, Ready |
| [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po) | In Progress | 0.0.1 | Order, Ready |
| [FRO-332](https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order) | Todo | 0.0.3 | Order, Pending_Review, Backend, Story |
| [FRO-328](https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and) | Todo | 0.0.4 | Order, Pending_Review, Ready, Frontend, Story |
| [FRO-349](https://linear.app/front-line-ltd/issue/FRO-349/order-details-create-supplier-invoice-from-order-details) | Todo | 0.0.6 | supplier invoice, Order, Pending_Review, Frontend, Story |
| [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions) | Todo | 0.0.11 | entry note, Order, Pending_Review, Frontend, Story |
| [FRO-329](https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export) | Todo | 0.0.2 | Order, Ready, Backend, Story |
| [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules) | Todo | 0.0.6 | supplier invoice, Pending_Review |
| [FRO-347](https://linear.app/front-line-ltd/issue/FRO-347/supplier-invoice-create-page-ui) | Todo | 0.0.6 | supplier invoice, Pending_Review, Frontend, Story |
| [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348/supplier-invoice-details-page-ui) | Todo | 0.0.6 | supplier invoice, Pending_Review, Frontend, Story |
| [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules) | Todo | 0.0.11 | Backend, Story |
| [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353/entry-note-creation-page-ui) | Todo | 0.0.11 | entry note, Frontend, Story |
| [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui) | Todo | 0.0.11 | entry note, Pending_Review, Frontend, Story |
| [FRO-293](https://linear.app/front-line-ltd/issue/FRO-293/order-colli-remove-bonded-checkbox-from-collis) | Canceled | — | Ready, Order |
| [FRO-298](https://linear.app/front-line-ltd/issue/FRO-298/decide-when-an-order-counts-as-bonded) | Backlog | — | Business_Input, Pending_Review |
| [FRO-314](https://linear.app/front-line-ltd/issue/FRO-314/move-correct-po-status-to-the-edit-po-page-operations-tab) | Canceled | — | Ready |
| [FRO-313](https://linear.app/front-line-ltd/issue/FRO-313/view-po-page-ui-remake-available-actions) | Canceled | — | Ready |
| [FRO-330](https://linear.app/front-line-ltd/issue/FRO-330/order-details-visualize-split-relationships-and-compact-unsplit-state) | Todo | 0.0.5 | Order, Pending_Review, Frontend, Story |
| [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign) | Todo | 0.0.5 | Order, Pending_Review, Frontend, Story |
| [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316/shipment-details-page-redesign) | Todo | 0.0.9 | Ready, Shipment |
| [FRO-341](https://linear.app/front-line-ltd/issue/FRO-341/shipment-creation-page-redesign) | Todo | 0.0.9 | Shipment, Pending_Review, Frontend, Story |
| [FRO-344](https://linear.app/front-line-ltd/issue/FRO-344/shipment-details-editing-pre-dispatch-and-readiness-invalidation) | Todo | 0.0.7 | Pending_Review, Shipment |
| [FRO-345](https://linear.app/front-line-ltd/issue/FRO-345/shipment-details-page-status-history-recorded-operations-and-comments) | Todo | 0.0.7 | Pending_Review, Shipment |
