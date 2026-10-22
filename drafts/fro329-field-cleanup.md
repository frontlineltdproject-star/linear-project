Remove obsolete **Order route, MRN and monetary fields** while retaining **DN Import**, **DN Export** and unrelated Order behavior.

**Order = purchase order = stock-list item. Colli = individually identified handling unit.** Physical movement routing belongs to Shipments. FRO-356 owns explicit Customs regime, conditional ΑΛΚ (accounting registration reference), ΚΤΑ retirement and registration coverage.

## Fields to remove

| Order field | Existing contract | Required change |
| -- | -- | -- |
| Country / City of Origin | `originCountryId`, `originCityId` — reference identifiers | Retire Order-owned references. |
| Country / City of Destination | `destinationCountryId`, `destinationCityId` — reference identifiers | Retire Order-owned references. |
| MRN | `mrn` — String | Retire the independent Order field; preserve separately owned declaration/Entry Note MRNs. |
| Value excluding VAT | `valueExclVatAmount`, `valueExclVatCurrency` — amount/currency pair | Retire both values. |
| Value including VAT | `valueInclVatAmount`, `valueInclVatCurrency` — amount/currency pair | Retire both values. |
| Duties | `dutiesAmount`, `dutiesCurrency` — amount/currency pair | Retire both values. |

Remove these fields from active persistence, create/update/read contracts, summary/list and detail responses, validation, client selections, defaults, payloads and derived displays. Update affected filters, exports, integrations and calculations wherever they consume these Order fields. Remove obsolete fixtures and generated references; preserve shared country/city/currency reference data and other entities' uses.

Do not replace the removed monetary fields with invoice-row totals or transfer Order route/MRN values to another entity.

## Retained DN references

| Field | Type / format | Rules |
| -- | -- | -- |
| DN Import | Optional String, maximum 255 characters; `deliveryNoteImport` | Preserve independent Order value, existing trim/blank normalization and validation. FRO-332 owns consolidation of the duplicate colli reference. |
| DN Export | Optional String, maximum 255 characters; `deliveryNoteExport` | Preserve independent Order value and the same existing validation behavior. |

These are text references, not attachments or Shipment Delivery Note drafting/issuance commands. Preserve prefilled values and changes through the existing authorized save; unrelated saves must not erase either reference. Blank remains permitted.

Retain existing create/edit authorities and internal-user boundaries. Ordinary header editing retains the current **PENDING / EXPECTED_READINESS / READY / IN_STOCK** guards and existing record restrictions. FRO-356's late ΑΛΚ-only access does not unlock DN references or other header fields.

## Splits and related customs behavior

Both **manual Order split** and **automatic partial split during Shipment preparation** must stop copying removed route/MRN/monetary fields.

Preserve the existing initial copying of DN Import and DN Export to the child for the same goods; preserve the parent's values. Subsequent DN edits remain Order-specific, with no family-wide synchronization. FRO-332 governs the authoritative Import DN and its independently owned consolidation rules.

Preserve colli identities, lineage, invoice rows, attachments/provenance, notes, custody, transactions and lifecycle behavior. FRO-356 governs regime and verified ΑΛΚ coverage/inheritance; do not retain indiscriminate copying of the entire legacy customs/document object.

No new Order duplication operation is introduced. Any reuse of Order data for creation must exclude removed fields and respect the relevant field owner's contract.

## Presentation and delivery integration

| Surface | Contract |
| -- | -- |
| Create Order — FRO-335 | Reuse its existing Overview field sequence and layout: DN Import then DN Export in the main grid; Customs regime/conditional ΑΛΚ in its defined section. Remove Route & customs, obsolete controls, hidden defaults and payload values. |
| Order Details — FRO-326 | Remove removed-field displays/editors and the Route and readiness card. Preserve Expected Readiness Date in Order details, DN references and FRO-356-owned customs controls. Use the existing shared Edit/Save/Cancel presentation. |
| Standalone Edit Order | Keep the route, existing operations, field locks and saved-record behavior. Remove Route & customs. Reuse FRO-335's DN/customs grouping within the remaining form, populated from the saved Order; do not import creation-only actions, defaults or editable Opening warehouse behavior. |

Update tab navigation, validation summaries, first-error focus and submission mapping so no obsolete hidden validation blocks a save. Preserve EN/EL, keyboard access, narrow-screen usability, Cancel and failed-save draft retention.

**FRO-329 blocks FRO-326 and FRO-335 for final delivery.** Their design and unrelated implementation may proceed independently. Reuse their existing presentation contracts and previews; no new canvas, preview or placeholder card is required.

Coordinate API/client removal and FRO-356 integration before releasing the affected forms. Every supported consumer must use the updated contract; test older payloads/selections so unsupported fields fail clearly rather than cause partial writes. Removing a tab or omitting a field in a save must never erase retained DN, ΑΛΚ or regime data. This ticket does not require implementing FRO-356's customs rules itself.

## Data treatment and scope

This delivery uses **mock data**. Remove obsolete mock values with the retired fields and update seeds/fixtures. Do not archive or reassign those values into Shipments, invoices, notes or declarations. Preserve retained DN values and unrelated audit, movement, attachment and document history.

Real legacy import/reconciliation and deletion of real operational records are outside scope. FRO-332's colli-reference consolidation and FRO-356's regime/registration work remain separately owned.

| Reference | Boundary |
| -- | -- |
| FRO-286 / FRO-238 | Retire only the listed Order field contracts; preserve other functionality. Update current entity/reference documentation without rewriting historical tickets. |
| FRO-302 / FRO-309 | Preserve delivered split semantics; cover both existing split implementations. Broader overlap reconciliation is separate. |
| FRO-356 / FRO-293 / FRO-298 | FRO-356 owns explicit regime, retained conditional ΑΛΚ, legacy ΚΤΑ/Bonded retirement and consumer coordination. Do not infer regime from warehouse names or relabel separately owned records. |
| FRO-317 / FRO-319 / FRO-321 | Preserve independently owned Export/Entry Note MRNs, Supplier Invoice facts, values and customs workflows. |
| FRO-320 / FRO-325 | Preserve Shipment routes, custody and movement contracts; add no Shipment fields through this ticket. |
| FRO-332 / FRO-333 / FRO-334 | Import DN consolidation, Pickup responsibility and Collection agent removal remain separate changes. |

**Out of scope:** new fields or automatic reassignment to other entities; implementing customs-regime or document workflows; changing Shipment routing or issuance; removing Greece, warehouse relationships, Expected Readiness Date, notes, invoice rows, DN Import/Export or retained ΑΛΚ; standalone Edit retirement/redesign; unrelated field cleanup.

## Decisions

| Decision | Reason |
| -- | -- |
| Fully retire the listed Order fields | Hiding controls alone leaves active contracts and copy paths inconsistent. |
| Mock-only cleanup without reassignment | No historical reconciliation project is needed for obsolete mock values; real operational data is outside this delivery. |
| Reuse existing presentation on standalone Edit | Close the retained-field placement gap without a duplicate design or changing saved-record behavior. |
| Preserve independent DN references and existing split inheritance | Field cleanup must not alter document-reference ownership or split semantics. |
| Keep customs regime/ΑΛΚ under FRO-356 | One owner defines their validation, registration coverage and late-edit rules. |

## Acceptance criteria

1. Listed fields are absent from active Order persistence, supported create/update/read contracts, list/detail selections, validators, defaults, payloads and fixtures.
2. Create, Details and standalone Edit contain no obsolete fields/tab/card; DN references remain accessible in the agreed existing layouts and Expected Readiness Date remains.
3. DN references retain optional 255-character validation, normalization, independent values and existing permissions/state guards. Cancel, failures and unrelated saves do not erase saved values.
4. Both split paths preserve DN inheritance and parent values without copying removed fields; later DN edits do not synchronize across the family. Unrelated split behavior remains intact.
5. Retained ΑΛΚ/regime data survives this cleanup and unrelated saves; field-specific rules and registration coverage remain governed by FRO-356.
6. Updated consumers and deployment order are documented and tested, including obsolete input/query failures without partial changes.
7. Obsolete mock values are removed without reassignment; retained fields/history and independently owned Shipment/customs/invoice data remain intact.
8. EN/EL, keyboard/error focus, narrow layouts and safe-environment create/edit/split regression tests pass.

## Context for agents

Live repository checked through **gh on 21 October 2026**, main **3820e89e8caa341261e2d48bcb282d93e1bb1d03**.

Affected systems: **frontline-forwarding-app** Order domain/persistence, adapters, validation and split services; **frontline-forwarding-client** shared form, Details/list selections, service mapping and generated client contracts.

* `docs/reference/database.md` — `freight_purchase_order`: retire `origin_country_id`, `origin_city_id`, `destination_country_id`, `destination_city_id`, `mrn`, `value_excl_vat_amount`, `value_excl_vat_currency`, `value_incl_vat_amount`, `value_incl_vat_currency`, `duties_amount`, `duties_currency` and their obsolete constraints/indexes. Preserve `delivery_note_import`, `delivery_note_export`, `alk`, `pickup_in_greece` and unrelated relationships; ΚΤΑ retirement belongs to FRO-356.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — removed fields appear in create/update and summary/detail contracts; list consumers are in scope.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` — header-edit stage guards and manual split; the split currently copies complete document/customs values.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java` — automatic partial split also copies document/customs values.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java` — optional DN validation/normalization.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderAuthorizationService.java` — existing internal-user create/edit authority boundaries.
* REST Order list/customer-list/detail/create/update and MCP `frontline_create_purchase_order` share the affected contracts; update supported adapters, not only GraphQL.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx` and `purchase-order-detail.tsx` — shared form and current derived route presentation.
* `frontline-forwarding-client/src/routes/secured/purchase-orders/new.tsx` — creation route; no dedicated duplication operation was found in the reviewed creation/GraphQL/MCP contracts.

Regenerate generated references rather than hand-editing them. Preserve curated workflow/entity documentation.

## Post-deployment verification

All production checks are **read-only**. Review safe-environment mutation test evidence instead of submitting production writes.

| AC | Read-only check |
| -- | -- |
| 1, 6 | Inspect deployed schemas, Order list/detail responses, generated clients, migration and release evidence. Confirm removed inputs/outputs/storage and consumer compatibility; review obsolete-query/payload rejection tests. |
| 2, 8 | Open Create, Details and standalone Edit in EN/EL without submitting. Inspect retained field placement, absent tab/card, Expected Readiness Date, keyboard navigation and narrow layouts. |
| 3 | Read representative DN values and review safe-environment boundary, blank/normalization, authorized/denied-state, Cancel, failure and unrelated-save test evidence. |
| 4 | Inspect parent/child records from both tested split paths and subsequent independent DN edits; compare references, lineage, collis, attachments and custody. |
| 5 | Inspect retained customs data and review integration evidence with FRO-356, including unrelated saves and preservation of other field locks during ΑΛΚ-only editing. |
| 7 | Review fixture/migration evidence and compare retained fields, audit/movement/document history and separately owned Shipment/customs/invoice records. |

**Reference:** Repository sources above; FRO-326 and FRO-335 presentation contracts; FRO-356 customs ownership; FRO-332 DN consolidation.
