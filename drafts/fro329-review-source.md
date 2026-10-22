# FRO-329 — review baseline

Read 2026-10-21; Linear updatedAt: 2026-10-20T11:08:48.406Z

Remove the listed **Order (purchase order / stock-list item)** route, MRN and monetary fields, retaining **DN Import** and **DN Export**. [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) separately owns the new **Customs regime** field, retained conditional **ΑΛΚ**, and replacement of **ΚΤΑ** and warehouse-name-based regime information.

Physical movement routes belong to Shipments. This ticket does not add fields to another entity. [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) explicitly defines the replacement Order customs-regime contract; the remaining removals below are unchanged.

## Fields to remove

| Order field | Existing input(s) | Required change |
| -- | -- | -- |
| **Country of Origin** | `originCountryId` | Remove from the active Order model and Create/Edit forms. |
| **City of Origin** | `originCityId` | Remove from the active Order model and Create/Edit forms. |
| **Country of Destination** | `destinationCountryId` | Remove from the active Order model and Create/Edit forms. |
| **City of Destination** | `destinationCityId` | Remove from the active Order model and Create/Edit forms. |
| **MRN** | `mrn` | Remove the independent Order-level field. Preserve MRNs owned by customs/declaration records. |
| **Value excluding VAT** | `valueExclVatAmount`, `valueExclVatCurrency` | Remove the Order-level amount and currency pair. |
| **Value including VAT** | `valueInclVatAmount`, `valueInclVatCurrency` | Remove the Order-level amount and currency pair. |
| **Duties** | `dutiesAmount`, `dutiesCurrency` | Remove the Order-level amount and currency pair. |

Remove their Order-level input/output, validation and derived display. Trace affected APIs, lists, search/filtering, printing/exports, integrations and calculations; update consumers rather than leaving hidden required fields or broken references.

Order duplication and child-Order creation must no longer copy this ticket's remaining removed fields. [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) separately owns Customs regime/ΑΛΚ inheritance; do not assume ΑΛΚ can be copied. Preserve unrelated commercial data, invoice rows, notes, colli identities, lineage, warehouse custody and lifecycle behavior.

## Fields to retain

| Field | Existing contract | Rules |
| -- | -- | -- |
| **DN Import** | `deliveryNoteImport` | Keep the existing optional Order-level text reference, 255-character limit, values, validation, permissions and editable-state rules. Coordinate with <issue id="a512b5dd-26c9-482e-ad8f-d7e00e9765b7" href="https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order">FRO-332</issue>, which keeps this Order field authoritative. |
| **DN Export** | `deliveryNoteExport` | Keep the existing optional Order-level text reference, 255-character limit, values, validation, permissions and editable-state rules. |

These are document references, not Shipment Delivery Note drafting or issuance. Do not alter Shipment document workflows. [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) separately introduces the Order Customs regime field and retains conditional ΑΛΚ; this cleanup does not implement that contract.

**ΑΛΚ is retained**, not removed: [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) makes it applicable only to **Τελωνειακή Αποταμίευση**, optional at creation and addable later. The **ΚΤΑ** boolean is retired through that ticket's explicit regime mapping, consumer compatibility and existing-data reconciliation.

## Customs regime coordination — <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>

[FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) supersedes this ticket’s removal of ΑΛΚ and owns replacement of ΚΤΑ with an explicit Order Customs regime.

The new field carries the regime previously communicated by ΚΤΑ and the regular / FREE ZONE / BONDED warehouse variants. Its values are **Ελεύθερη Κυκλοφορία / Τελωνειακή Αποθήκευση / Τελωνειακή Αποταμίευση**, restricted to the warehouse’s stored capabilities and licence data. ΑΛΚ remains a separate optional registration reference for Αποταμίευση; it is not replaced by the regime field.

Remove the standalone Route & customs tab, but retain access to DN Import, DN Export and the <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>-owned regime/conditional ΑΛΚ controls in the remaining form. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> and <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign">FRO-335</issue> own their redesigned presentation.

Coordinate rollout so neither this cleanup nor an unrelated Order save loses ΑΛΚ or legacy regime evidence. The remaining origin/destination, independent Order MRN and monetary-field removals are unchanged.

## UI and delivery dependencies

### Create/Edit Order

Remove the **Route & customs** tab from the shared Create/Edit form. Move **DN Import** and **DN Export** into the remaining form layout so both remain accessible and editable under existing guards. Coordinate the remaining-form **Customs regime** and conditional **ΑΛΚ** controls with [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>); retiring the tab must not remove them. Their exact placement belongs to the Edit-page design; no dedicated Edit-page ticket/preview has been identified in this specification yet.

Update tab navigation, validation summaries, error focus and submission payloads. Removing the tab must not remove either retained DN field or hide an unresolved validation failure.

### Order Details — <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue>

The visual result belongs in [FRO-326 — Order Details page redesign](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>), using its [current Order UI preview](<https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/>).

Remove the **Route and readiness** card and any presentation/editor for the removed fields. **Expected Readiness Date** remains in **Order details** with its existing meaning, value and workflow. Preserve DN Import and DN Export wherever otherwise specified.

**This ticket blocks** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue>. Preview design and unrelated work can proceed independently. Reference this ticket in the existing preview change annotation; no empty card or placeholder is needed. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> is the Details-page reference, not a substitute for the complete Edit-page design.

## Existing data — decision required before implementation

Agree how to retain/archive or dispose of existing values for every removed field before changing persistence. No deletion or automatic transfer to Shipments, invoices, customs notes or declarations is authorized by this specification.

An Order may participate in several movements and have several invoices/customs records. Do not infer a single target record. Any migration requires an explicitly approved mapping and conflict handling. Preserve DN Import/DN Export values and existing audit/movement/document history.

Document data treatment and deployment order for contracts and consumers before removal. [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) owns ΚΤΑ, ΑΛΚ and warehouse-variant reconciliation, preserving ΑΛΚ values and legacy regime evidence.

## Scope and coordination

| Reference | Relationship to this change |
| -- | -- |
| <issue id="6f02078a-1fdc-446f-a8e1-fc841b99ea67" href="https://linear.app/front-line-ltd/issue/FRO-286/expose-missing-po-route-delivery-note-and-customs-value-fields">FRO-286</issue> — completed additions | Supersede its Order route and customs-value field requirements listed above. Preserve DN Import/DN Export and unrelated completed functionality. Do not cancel or rewrite the historical ticket. |
| <issue id="76be6a78-8f6f-4231-9b60-fb73ce829c3f" href="https://linear.app/front-line-ltd/issue/FRO-238/order">FRO-238</issue> — Order definition | Supersede its definitions of the removed fields. Reconcile the current entity documentation when this ships. |
| <issue id="6addc957-25a9-4fdc-a7e0-1332ef9c6b06" href="https://linear.app/front-line-ltd/issue/FRO-302/order-keep-the-remaining-collis-on-the-original-po-when-partially">FRO-302</issue> **/** <issue id="e43448cf-af4c-4de6-9f1d-f55ba9aa52e1" href="https://linear.app/front-line-ltd/issue/FRO-309/refactor-partial-shipment-selection-into-child-purchase-orders">FRO-309</issue> — child Orders | Stop copying the removed fields. Preserve other split semantics; reconcile the deferred <issue id="6addc957-25a9-4fdc-a7e0-1332ef9c6b06" href="https://linear.app/front-line-ltd/issue/FRO-302/order-keep-the-remaining-collis-on-the-original-po-when-partially">FRO-302</issue> overlap with completed <issue id="e43448cf-af4c-4de6-9f1d-f55ba9aa52e1" href="https://linear.app/front-line-ltd/issue/FRO-309/refactor-partial-shipment-selection-into-child-purchase-orders">FRO-309</issue> separately. |
| <issue id="9e403ee2-6e5f-4b7b-a9f4-0b70cf41cb2d" href="https://linear.app/front-line-ltd/issue/FRO-293/order-colli-remove-bonded-checkbox-from-collis">FRO-293</issue> **/** <issue id="27416541-41e7-4d9d-b3a7-1be6aafdc957" href="https://linear.app/front-line-ltd/issue/FRO-298/decide-when-an-order-counts-as-bonded">FRO-298</issue> — customs tags | [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) owns replacement of Order KTA and warehouse-name inference with explicit Customs regime, including coordination of legacy Free Zone/Bonded consumers. Do not retain KTA, infer regime from warehouse names or automatically relabel separately owned records. The unrelated colli Bonded removal remains its own scope. |
| <issue id="a512b5dd-26c9-482e-ad8f-d7e00e9765b7" href="https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order">FRO-332</issue> — Import DN ownership | Preserve authoritative Order DN Import; do not reintroduce its duplicate colli reference. |
| <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-client-and-supplier-mrns-invoice-selection">FRO-317</issue> **/** <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/customs-warehousing-cleaned-up-version">FRO-319</issue> **/** <issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/vat-exemption-item-cleanup">FRO-321</issue> — customs/invoice models | Preserve their independently owned MRNs, invoice values and customs information. This ticket removes only the listed Order-owned fields and does not implement those deferred workflows. |
| <issue id="61b35d90-7317-4ba9-ac17-634e1c555451" href="https://linear.app/front-line-ltd/issue/FRO-320/correct-shipment-destinations-with-warehouse-transfer">FRO-320</issue> **/** <issue id="50008d48-390a-4aa9-a993-0efdaad50435" href="https://linear.app/front-line-ltd/issue/FRO-325/shipment-separate-creation-repacking-and-dispatch">FRO-325</issue> — Shipment routing | Preserve their existing route contracts and decisions. No independent Shipment country/city fields are added. |
| <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> — Details redesign | Blocked by this cleanup for its final presentation. |
| <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue> **/** <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> | Pickup responsibility and Collection agent removal remain separate changes, not additions to this cleanup. |

**Out of scope:** implementing [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>)'s new regime/conditional ΑΛΚ contract, new fields or automatic data reassignment to other entities; changing Shipment routes, document issuance or movement history; removing Order Greece, warehouse relationships, Expected Readiness Date, notes, invoice rows, DN Import or DN Export; unrelated Order-field cleanup.

## Acceptance criteria

1. Create/Edit Order no longer contains the Route & customs tab or submits any listed removed field.
2. DN Import and DN Export remain accessible in the remaining form, prefilled on Edit, and persist unchanged after unrelated saves.
3. Active Order contracts, validation and persistence no longer maintain the removed fields. Clients and downstream consumers remain compatible with the approved rollout.
4. Order Details has no removed-field display/editor or Route and readiness card; Expected Readiness Date remains.
5. Duplication/splitting does not restore removed fields; retained DN references follow existing agreed duplication semantics.
6. Existing values and histories are handled by the explicitly approved data plan; no guessed migration occurs.
7. [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) owns retirement of Order KTA, replacement by explicit Customs regime and reconciliation of legacy consumers. ΑΛΚ remains available only for Τελωνειακή Αποταμίευση and may be added later. This cleanup must not remove either retained ΑΛΚ or the new regime field.
8. Shipment routing, separately owned customs/invoice data, Order Greece, warehouse custody, notes, invoice rows and lifecycle operations retain their agreed behavior.
9. EN/EL, keyboard navigation/error focus, narrow-screen layouts and unrelated Order saves remain usable.

## Context for agents

Production source checked through `gh` on 12 October 2026:

* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx`, `TabPanel value="routeCustoms"`: four route selectors; MRN, ALK, DN Import, DN Export, KTA; value excluding VAT, value including VAT and Duties, each with amount/currency.
* The two DN controls use existing `deliveryNoteImport`/`deliveryNoteExport` and a 255-character limit.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-detail.tsx` currently derives Route from Order origin/destination references.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java` uses origin-warehouse/destination contracts; they are not four equivalent country/city selectors.

Trace the database and GraphQL/REST/MCP contracts, validation, calculations, authorization and duplicate/split paths before implementation. Update generated references and curated domain documentation. Do not infer destructive treatment or replacement field ownership from a removed UI tab.

## Post-deployment verification

* Inspect Create/Edit in EN/EL: Route & customs and removed inputs are absent; DN Import/Export remain accessible and prefilled.
* Inspect Details and deployed contracts for absence of this ticket's remaining removed fields and route card; Expected Readiness Date remains. Verify explicit Customs regime and conditional retained ΑΛΚ under [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>); review its ΚΤΑ replacement and existing-data evidence.
* Review migration evidence and compare retained DN values against the approved plan.
* In a safe test environment, verify creation, unrelated edits, DN saves, validation/error focus, duplication and child-Order creation without removed fields.
* Verify Shipment routes and independently owned invoice/customs data remain intact; test permissions and failure/rollback behavior.

**Reference:** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> preview; current production form; <issue id="6f02078a-1fdc-446f-a8e1-fc841b99ea67" href="https://linear.app/front-line-ltd/issue/FRO-286/expose-missing-po-route-delivery-note-and-customs-value-fields">FRO-286</issue>, <issue id="76be6a78-8f6f-4231-9b60-fb73ce829c3f" href="https://linear.app/front-line-ltd/issue/FRO-238/order">FRO-238</issue>, <issue id="6addc957-25a9-4fdc-a7e0-1332ef9c6b06" href="https://linear.app/front-line-ltd/issue/FRO-302/order-keep-the-remaining-collis-on-the-original-po-when-partially">FRO-302</issue>/<issue id="e43448cf-af4c-4de6-9f1d-f55ba9aa52e1" href="https://linear.app/front-line-ltd/issue/FRO-309/refactor-partial-shipment-selection-into-child-purchase-orders">FRO-309</issue>, <issue id="9e403ee2-6e5f-4b7b-a9f4-0b70cf41cb2d" href="https://linear.app/front-line-ltd/issue/FRO-293/order-colli-remove-bonded-checkbox-from-collis">FRO-293</issue>/<issue id="27416541-41e7-4d9d-b3a7-1be6aafdc957" href="https://linear.app/front-line-ltd/issue/FRO-298/decide-when-an-order-counts-as-bonded">FRO-298</issue>, <issue id="a512b5dd-26c9-482e-ad8f-d7e00e9765b7" href="https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order">FRO-332</issue>, <issue id="38aefa3f-4a0e-4de9-ad55-bbc24902f627" href="https://linear.app/front-line-ltd/issue/FRO-317/export-customs-declaration-client-and-supplier-mrns-invoice-selection">FRO-317</issue>/<issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/customs-warehousing-cleaned-up-version">FRO-319</issue>/<issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/vat-exemption-item-cleanup">FRO-321</issue> and <issue id="61b35d90-7317-4ba9-ac17-634e1c555451" href="https://linear.app/front-line-ltd/issue/FRO-320/correct-shipment-destinations-with-warehouse-transfer">FRO-320</issue>/<issue id="50008d48-390a-4aa9-a993-0efdaad50435" href="https://linear.app/front-line-ltd/issue/FRO-325/shipment-separate-creation-repacking-and-dispatch">FRO-325</issue>.
