# FRO-326 — complete proposed ticket

Title: Order Details - Page Redesign
Team: Front Line LTD
Status: Todo
Labels: Order, Pending_Review, Frontend, Story
Project: Pre-releases 0.0.x
Milestone: 0.0.5
Priority: No priority

Metadata, relations and all 11 attachments remain unchanged. No changes to FRO-346.

## Relations (unchanged)

blocks: FRO-330

blockedBy: FRO-356, FRO-355, FRO-349, FRO-346, FRO-337, FRO-334, FRO-333, FRO-332, FRO-294, FRO-295, FRO-297, FRO-329, FRO-328, FRO-292

relatedTo: FRO-354, FRO-319, FRO-353, FRO-321, FRO-347, FRO-293, FRO-298, FRO-314, FRO-316, FRO-313, FRO-303, FRO-348, FRO-345, FRO-344, FRO-341, FRO-335

duplicateOf: none

## Complete description

**As an office operator I want the Order Details page to follow the Shipment Details structure** so that information, editing and actions are easy to find.

**Order = purchase order = stock-list item.** Implement only **Stacked cards**, using [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316>) as the visual reference. This consolidated specification replaces the earlier appended requirements; historical alternatives and screenshots are references only.

**UI reference:** [Current private Order preview](<https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/>). The preview uses fictional data and simulated operations. This ticket's production requirements are authoritative; a missing or simplified preview operation must not remove existing functionality.

## Scope and dependencies

**[FRO-349](<https://linear.app/front-line-ltd/issue/FRO-349>) blocks** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue>: owns the Create supplier invoice entry action, authorized Order preselection, creation-page integration and return context, consuming <issue id="e6c0559c-112a-48bc-b31a-c691cb53a81b" href="https://linear.app/front-line-ltd/issue/FRO-347/supplier-invoice-create-page-ui">FRO-347</issue>/<issue id="63969ca1-fdf4-4da5-95c9-7f2c7f2b6314" href="https://linear.app/front-line-ltd/issue/FRO-321/supplier-invoice-entity-relationships-and-vat-exemption-rules">FRO-321</issue>. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> presents it as a standalone Create supplier invoice card directly in the Available actions tab. The current preview is explicitly design-only and does not perform that navigation or create an invoice.

**[FRO-346](<https://linear.app/front-line-ltd/issue/FRO-346>) blocks** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue>: owns the combined Details/readiness correction save, atomicity, authorization, concurrency and audit. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> integrates its shared Edit/status control and Save-triggered confirmation.

| Reference | Ownership / coordination |
| -- | -- |
| [FRO-313](<https://linear.app/front-line-ltd/issue/FRO-313/view-po-page-ui-remake-available-actions>) | Canceled as superseded, not delivered. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) owns the redesign. Retain exception and transition-history fallback rules. Its seven-step counter/progress-bar presentation, older menu, shortcut and correction placement are superseded by the compact <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign">FRO-335</issue>-style status area and <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue> shared editing. |
| [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316/shipment-details-page-redesign>) | Shipment Details structure and visual style reference. Preserve Order-specific fields, tabs and operations. |
| [FRO-292](<https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes>) **— blocks** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) | Owns Internal/External Notes storage, migration, editing authorization and staff/customer visibility. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) owns their presentation and card editing controls. |
| [FRO-328](<https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and>) **— blocks** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) | Owns readiness-email templates, routing, preparation, review, explicit Send, validation, failure/retry and audit behavior. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) owns their placement and two-button presentation. |
| [FRO-329](<https://linear.app/front-line-ltd/issue/FRO-329/order-remove-origin-and-destination-countrycity-fields>) **— blocks** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) | Owns removal of Order Route & customs fields: origin/destination country/city, MRN, Value excluding VAT, Value including VAT and Duties (including their currencies), affected contracts and existing-data treatment. DN Import and DN Export are retained. <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> separately owns explicit Customs regime, retained conditional ΑΛΚ and ΚΤΑ replacement. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) omits the removed fields, editors, derived route/card and route presentation, while preserving both DN references and presenting the resulting layout. |
| [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297>) **— blocks** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) | Owns the four colli handling flags, conditional DG detail fields and their domain/update contract. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) owns collapsed handling flags, conditional expanded fields and per-row editing on Order Details. |
| [FRO-337](<https://linear.app/front-line-ltd/issue/FRO-337>) **— blocks** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> | Owns Unit price storage/contracts, calculated Total value, validation, two-decimal unit-price precision, deferred currency-specific rounding and mock-data rollout. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> owns the existing nine-column invoice table and authorized per-row Add/Edit/Save/Cancel/Remove presentation. |
| [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295>) **— blocks** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) | Owns removal of per-colli PCS and associated piece-count presentation. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) omits PCS from colli summaries/details and annotates the removal in the preview. Invoice-row quantity/unit remains unchanged. |
| [FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294>) **— blocks** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) | Owns removal of per-colli Notes. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) omits that box and annotates its replacement by [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po>) condition flags. Colli Description and Order Notes remain unchanged. |
| [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332>) **— blocks** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) | Owns consolidation of Import Delivery Note on the existing Order field, removal of the duplicate colli input, affected contracts and existing-data reconciliation. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) owns Order Details presentation and the colli preview annotation. |
| [FRO-314](<https://linear.app/front-line-ltd/issue/FRO-314/move-correct-po-status-to-the-edit-po-page-operations-tab>) | Earlier separate-Edit-page correction placement is superseded for this page. It does not block [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>). Preserve the existing authorized correction command and business rules. |

| [FRO-333](<https://linear.app/front-line-ltd/issue/FRO-333>) **— blocks** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> | Owns Pickup responsibility storage, authorized contracts, requiredness/defaults, existing-data treatment and Order duplication/split rules. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> presents the independent Yes / No field. Unresolved rules remain in <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue>. |
| [FRO-334](<https://linear.app/front-line-ltd/issue/FRO-334>) **— blocks** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> | Owns Collection agent entity/contract removal, retirement of the Greece-dependent validation, existing-data treatment and downstream compatibility. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> removes its field and selector. Agent companies and Shipment agents remain outside this removal. |

Preview design and unrelated redesign work can proceed before dependent features are delivered. Do not alter dependency tickets as part of this implementation.

## Route & customs removal — <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export">FRO-329</issue>

Consume the remaining cleanup contract delivered by [FRO-329](<https://linear.app/front-line-ltd/issue/FRO-329>): omit the four Order origin/destination country/city fields, **MRN**, and Order **Value excluding VAT**, **Value including VAT** and **Duties**, including each amount/currency pair. Do not keep those removed fields as hidden editor fields, defaults or submitted payload values. Remove their derived route/card.

[FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) separately introduces **Customs regime**, retains conditional **ΑΛΚ**, and replaces **ΚΤΑ** and warehouse-name-based regime inference. Do not remove ΑΛΚ unconditionally. The explicit regime is the new source; <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> owns legacy consumer/tag coordination and existing-data reconciliation, without automatically renaming separately owned records.

Retain the existing **DN Import** and **DN Export** fields, their optional text/255-character contracts, independent values, card-level editing and missing-value presentation. **Expected Readiness Date**, Greece, Pickup responsibility, invoice rows, warehouse custody and unrelated fields remain governed by their existing tickets. Preserve MRNs, values and customs information independently owned by invoices, customs notes/declarations and Shipments. Do not copy removed Order values into those entities. The explicit Order Customs regime and conditional retained ΑΛΚ are defined by <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>.

<issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export">FRO-329</issue> owns active model/API/validation removal, existing-data treatment and removal of the standalone Create/Edit **Route & customs** tab, with retained DN references moved into the remaining form. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> owns only the corresponding **Order Details** presentation; it does not redesign that standalone form or implement migrations. Recheck duplication/split consumers and data-preservation requirements under <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export">FRO-329</issue> rather than silently dropping legacy data through an unrelated save.

## Page structure

| Area | Final structure |
| -- | -- |
| Application bar | Reuse [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316/shipment-details-page-redesign>)'s full-width Frontline console bar; **Purchase orders** is active. Keep the language toggle outside the shared bar. |
| Heading | **Order · ID** on the left; Order flags in a right-aligned group. **DG** appears first, with **Parent Balance** beside it when applicable. Client, Vessel, Status and Edit belong inside Order details. No main lifecycle action in the heading. |
| Tabs | **Overview · Collis · Invoice rows · History & activity · Documents · Available actions**. Retain existing content and authorized access. |
| Overview | **Order details → Notes → Split relationships**. Remove Route and readiness entirely; no empty placeholder. |
| Order details | Top-right Edit; preview change notes grouped above the nested **Order status**, then the main labelled field grid including **Greece** and **Pickup**, followed by **Urgent / Urgent information**. Show status only in the compact nested Order status area, matching <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign">FRO-335</issue>'s grey sub-card in view and edit modes; no progress bar, Step counter or Next text. No Collection agent field or empty placeholder. |
| History & activity | **Order activity → Comments → Reminder history**. Each is a separate card. |
| Available actions | Show **Request readiness date**, **Confirm readiness date**, **Create supplier invoice** and **Entry Note** as four standalone action cards directly in the tab panel, in that order. The Entry Note card shows **Create Entry Note** or **Open Entry Note** under <issue id="c9ace4d3-c2a3-4858-9b51-aa217a024772" href="https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions">FRO-355</issue>. Remove the redundant outer Available actions card and its repeated heading. Use the shared full-card styling (20px padding, 12px corners and 20px gaps), retaining each action heading, button, availability/disabled reason and responsive behavior. Place consolidated preview/change notes above the cards without a surrounding card. Request/Confirm also remain in Order status with synchronized behavior. No More actions dropdown, Other actions subheading, Add comment or Colli actions shortcut. |

Preserve all unrelated fields, invoice rows, attachments, separately owned invoice/customs data, retained references, warehouse relationships, colli identities, lineage and audit history. The explicit presentation exceptions are [FRO-329](<https://linear.app/front-line-ltd/issue/FRO-329/order-remove-origin-and-destination-countrycity-fields>)'s remaining Order route, MRN and monetary-field removal (including amount/currency pairs); <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> separately owns explicit Customs regime, retained conditional ΑΛΚ and ΚΤΑ replacement, [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli>)'s per-colli PCS removal, [FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli>)'s per-colli Notes removal, and [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>)'s removal of the duplicate colli Import Delivery Note input in favor of the existing Order-owned reference. These tickets own their data/contracts; UI omission must not silently lose existing data. Expected Readiness Date stays in Order details with its existing meaning and workflow. [FRO-334](<https://linear.app/front-line-ltd/issue/FRO-334>) also removes Order Collection agent and its Greece validation dependency; [FRO-333](<https://linear.app/front-line-ltd/issue/FRO-333>) adds independent Pickup responsibility. Their owners handle production contracts and existing data; do not reinterpret Greece or alter Agent companies/Shipment agents.

## Heading flags

Move the existing Order flags from beside the ID into the right side of the heading bar. Use one compact group with **DG** followed by **Parent Balance**; keep them adjacent and readable on narrow screens.

| Flag | Existing source / behavior |
| -- | -- |
| **DG** | Show once when `hasDangerousGoods` is true, using the existing danger badge and an EN/EL Dangerous goods accessible label. |
| **Parent Balance** | Show for the existing `splitLineageTag = BALANCE`, using the existing informational lineage badge. This is a lineage label, not an Order lifecycle status. |

Retain the existing conditional display, localization and other applicable Order flags, including Bonded and Partial; this placement change must not add flags to Orders that do not qualify or change their meaning. The preview displays DG and Parent Balance as illustrative flags on its root Order.

## Customs regime — <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>

Consume [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>)’s warehouse capabilities, Order regime and conditional ΑΛΚ contract.

Place **Customs regime** and **ΑΛΚ** together in a two-column middle section after the main Order details field grid, between two full-width horizontal dividers matching <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign">FRO-335</issue>. The second line separates customs from **Urgent / Urgent information**. Apply this grouping in saved and edit modes; stack the customs fields at the shared narrow-screen breakpoint. Preserve Current warehouse as read-only and retain the relative order of the remaining main fields. Keep the <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> dependency note beneath Order details, outside the field grid. Do not show “Select a warehouse first.” helper text.

| Field | Control / display | Rules |
| -- | -- | -- |
| **Current warehouse** | Existing derived, read-only display | Preserve custody semantics and existing missing-location presentation. |
| **Customs regime / Τελωνειακό καθεστώς** | Labelled saved value; selector during authorised editing | Greece = No displays a locked empty field; Greece = Yes displays the explicit saved regime and requires a warehouse-supported selection. Editing offers only options permitted by <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>’s warehouse/state rules. |
| **ΑΛΚ** | Labelled saved value; text input during authorised editing | Enabled only for Greece = Yes and Τελωνειακή Αποταμίευση. Blank is allowed and displays the existing missing-value marker. For other regimes, show an inapplicable disabled field without a submitted value. |

Use the existing shared Details Edit/Save/Cancel interaction. Failed saves retain the draft; Cancel restores saved values. Do not make Current warehouse editable or introduce a separate save operation.

**Greece = No:** Customs regime and ΑΛΚ are inapplicable, locked and empty; no required-regime error or stale customs value is submitted. Greece = Yes requires a warehouse-supported regime; ΑΛΚ remains optional for Αποταμίευση. Use <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>’s authorised/audited saved-record update and historical-conflict rules. This requirement does not infer Greece from the warehouse.

Do not infer a regime from warehouse names, ΚΤΑ, ΑΛΚ presence or invoice type. Historical conflicts must be resolved under <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>.

Update acceptance checks and read-only post-deployment verification for:

* All three saved regime values.
* Authorised regime/ΑΛΚ editing and later ΑΛΚ entry.
* Warehouse-restricted options and unavailable capability data.
* Blank versus inapplicable ΑΛΚ.
* Preservation on unrelated saves.
* <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>’s agreed regime-change and missing-current-warehouse rules.

Update the preview’s field grid and dependency annotations to distinguish <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> from <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export">FRO-329</issue>. Preview changes are a separate design step; this amendment does not claim they are published.

## Order details and editing

**Edit-card visual parity with** <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign">FRO-335</issue>: use the creation card's four-column field grid (`repeat(4,minmax(0,1fr))`), 28px column gaps and 18px row gaps; one column at 1100px and below. Labels are uppercase, 10px/600, `#838c9a`, with `.035em` letter spacing and 6px label/control gap. Inputs/selects use 13px type, 1.5 line height, 8px 9px padding, `1px solid #e3e6eb` and 7px radius. Match the 20px card padding/12px radius and 16px padding below 1100px. Use 15px checkboxes, 7px inline gap and 34px checkbox row height. Urgent follows the field grid below a divider (20px top margin, 18px top padding); Urgent information is a separate full-width field beneath it with a minimum 72px textarea. Scope this styling to the Details editor; preserve saved view presentation.

**Saved-Order differences:** Client, Vessel and Current warehouse retain immutable read-only controls, styled consistently with the creation selectors. Expected Readiness Date remains disabled/read-only in the field grid; approved readiness changes still use the workflow/<issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue> confirmation. Preserve the existing saved-Order field set, validation, reference restrictions, action placement and shared Save/Cancel behavior. Do not add creation-only editable warehouse/client/vessel inputs, requiredness/defaults or a readiness-remark editor merely for visual parity.

**List → Details → edit in place.** Order Details is the single page for editing an existing Order. This ticket owns retirement of the separate Edit Order page and its navigation.

* Replace links to the separate Edit page with navigation to the corresponding Order Details page; use its authorized card-level Edit controls.
* Redirect existing `/secured/purchase-orders/$purchaseOrderId/edit` URLs to the corresponding Order Details page without rendering the old edit form or performing a mutation. Preserve authentication, Order access checks and unavailable-record handling.
* Before retiring the old page, reconcile its editing capabilities with the final Details contracts and linked feature requirements. Every retained, authorized capability must remain available on Details in the appropriate card or existing workflow. Fields intentionally removed by linked tickets stay removed; retirement must not silently discard data, remove a retained capability or broaden field/state permissions. If a retained capability has no agreed destination, resolve that gap before retiring the page.
* The Order-details card saves permitted header fields and an optional readiness correction together through FRO-346. Notes, Collis and Invoice rows retain their independent drafts and Save/Cancel controls; there is no whole-page Save.
* Retire the separate page only when the required Details editors and their backend contracts are available. Preserve the existing editing path during the earlier backend rollout. Removing this page does not retire backend update/correction operations required by other consumers or remove the shared form used for Order creation.

**Decision:** use one Details page for reviewing and editing saved Orders, avoiding two supported pages for the same work while preserving the agreed card-level editing boundaries.

| Field / area | Type / control | Behavior |
| -- | -- | -- |
| Client, Vessel | Existing entity values | Labelled, read-only. |
| Current warehouse | Derived, read-only | Reuse the list's `currentWarehouseStay.warehouse.code · currentWarehouseStay.storagePosition`. Null position uses Unpositioned / Χωρίς θέση; absent stay uses the existing not-set fallback. Do not infer custody from shipment destination/history. |
| **Customs regime / Τελωνειακό καθεστώς** | Saved value / authorised selector | [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>): Greece = No locks/empties this field; Greece = Yes requires an explicit regime restricted by warehouse/state rules. |
| **ΑΛΚ** | Optional digits-only text, max 50 characters | [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>): enabled only for Greece = Yes and Τελωνειακή Αποταμίευση; blank permitted and addable later. |
| Supplier, Invoice company | Dropdown (authorized entity reference data) | Store IDs, not free-text names. Reuse option sources/missing-value choices and eligible Client/Vessel invoicing assignments. |
| **Greece / Ελλάδα** | Boolean checkbox | Existing `pickupInGreece` value. Place in the main field grid, not below it beside Urgent. Preserve the recorded value and existing meaning. After <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue>, Greece = No must not require a Collection agent. |
| **Pickup / Παραλαβή** | Yes / No dropdown; labelled saved value | <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue>: **Yes** means Front Line is responsible for collecting the goods from the supplier; **No** means it is not. This does not record completed collection. Keep independent of Greece, warehouse, readiness and Shipment route. |
| Expected Readiness Date | Date, read-only here | Existing `readinessDate`, normal missing-value fallback. Changes use the readiness/correction workflow. |
| Owner reference, Supplier reference, Message number | Existing String inputs | Preserve existing validation. |
| **Urgent / Επείγον** | Boolean checkbox | Existing `urgent` flag, editable through the card controls. |
| **Urgent information / Πληροφορίες επείγοντος** | Free text, multiline | Existing `urgentInformation`; independent from the Urgent checkbox. Keep visible without inventing a requiredness or clearing rule. |
| **DN Import / DN εισαγωγής** | Optional String, text input, max 255 characters | Existing Order-owned `deliveryNoteImport`, shown once in the main grid with **—** when absent. Use the card's Edit/Save/Cancel and existing authorized state/validation rules. [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332>) owns consolidation and legacy reconciliation; no duplicate colli field. |
| **DN Export / DN εξαγωγής** | Optional String, text input, max 255 characters | Existing Order-owned `deliveryNoteExport`, shown once alongside DN Import. Same card editing, authorization, Save/Cancel and missing-value behavior. Preserve it independently from DN Import. |
| Status | Read-only in view mode; eligible readiness dropdown in shared Edit | <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue> correction rules below; no unrestricted lifecycle editing. |
| Warehouse, lineage | Derived/read-only | Never directly changed through Details Save. No progress bar or step counter is displayed. |
| **Collection agent** | Removed | Absent from display, inline editor, draft defaults and field option sources. <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> owns removal from production contracts and the Greece validation dependency; no placeholder or replacement agent field. |

Use existing **PURCHASE_ORDER_EDIT**, identity, editable-state and reservation restrictions, plus server authorization. View mode displays saved values; only **Edit** unlocks permitted fields. **Save** submits permitted changed fields directly when status is unchanged; an eligible status change opens <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>'s confirmation and saves both together through its atomic authorized operation. Report success after persistence. Preserve unrelated data, notes, shipment relationships and readiness data except the explicitly approved correction effects. **Cancel/Escape** restores saved values, discards only this card's draft and restores focus. Keep drafts across tab/language changes; failures retain drafts with actionable errors.

**Pickup unresolved data rules:** <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue> owns mandatory selection/defaults, existing Orders with unknown responsibility, and Order duplication/child inheritance. Do not decide those rules in this redesign or infer Pickup from Greece or other fields. The preview starts with **—** and offers Yes / No; **—** means unset, not No and not a third responsibility choice. Production fallback/validation follows <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue>'s agreed contract. Changing Pickup must not trigger readiness/status changes, pickup completion, a Shipment or an email. <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> must permit unrelated edits with either Greece value without a hidden agent requirement.

## Order status and main action

Use **Order status / Κατάσταση παραγγελίας**, not Order journey. Match [FRO-335](<https://linear.app/front-line-ltd/issue/FRO-335>)'s compact grey status sub-card in both Details view and the shared Details editor: Order status label and status control on one line. Remove the progress bar, Step n / 7 counter, separator and Next/transition-helper text. View mode shows the saved state in a read-only control; Edit enables only <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>-eligible corrections. Keep the existing readiness-email and lifecycle actions, authorization and confirmation semantics. Display labels consistently:

| Existing status | EN label | EL label |
| -- | -- | -- |
| PENDING | Awaiting Readiness Date | Αναμονή ημερομηνίας ετοιμότητας |
| EXPECTED_READINESS | Received Readiness Date | Λήφθηκε ημερομηνία ετοιμότητας |

Keep enum values, actual transitions, exception handling and transition history unchanged. Show the authoritative current state, including later and exception states, in the read-only status control. Only an eligible shared Edit exposes the three readiness states under <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>. The removed seven-step bar/counter must not reappear after a correction or readiness action. Keep this area inside Overview, including for view-only users.

| Current state | Main action |
| -- | -- |
| PENDING | Set expected readiness |
| EXPECTED_READINESS | Mark ready at supplier |
| READY | Record arrival and set PO in stock |
| AWAITING_IMPORT | Confirm stock and measurements |
| IN_STOCK | Start shipment |
| PREPARED_FOR_SHIPMENT / SHIPPED | Open shipment when the linked Shipment is available and authorized |

Show at most one main lifecycle action in the nested status card. Preserve actual eligibility, reservation checks, disabled reasons and command semantics. Terminal/exception states without a next operation show no forward action. View-only users receive no mutation controls.

**Set expected readiness:** required date plus optional Remark. Start empty when no date exists; do not invent a date. Validate before submitting. Cancel/Escape/backdrop closes without mutation and restores focus. A successful operation records the date/remark, actor and time, transitions PENDING → EXPECTED_READINESS, and refreshes details, progress, next action and history. Failed submission retains the draft. Preserve unrelated fields and Notes drafts.

**Mark ready at supplier:** available only for an authorized editor while the current state is EXPECTED_READINESS (**Received Readiness Date**). Open a labelled form explaining **“Confirm that every active colli is ready for collection.”** Accept an **optional Remark**, maximum **1,000 characters**; no new readiness-date input or required remark. Only the explicit **Mark ready at supplier** submit runs the existing ready command.

On success, transition **EXPECTED_READINESS → READY**, show the saved **Ready** status in the compact status control, and refresh the main action to **Record arrival and set PO in stock**. Preserve the existing readiness date/remark, Order details, notes, colli values and unrelated open drafts. Append the actual old/new status, actor, time and submitted remark to PO status history; Recorded operations shows **Marked ready at supplier**. Preserve the production **READY_FOR_COLLECTION** journey event for each active non-terminal colli; do not invent events for terminal collis or overwrite history.

Cancel/Escape/backdrop closes without status/history changes and restores focus. Recheck current state and authorized command guards on submission. Failed, denied or stale commands retain the draft with an actionable error and do not report success. Prevent repeat submission after the Order has become READY. This action does not record collection, warehouse arrival, a Shipment or an email.

**Stock entry:** retain the existing full-width measurements panel inside Order status, required fields, independent draft, review and irreversible confirmation. Do not reduce it to a shortcut or change custody/lifecycle rules.

## Shared Details edit and readiness correction — [FRO-346](<https://linear.app/front-line-ltd/issue/FRO-346>)

Use the single **Edit** button on Order details for permitted ordinary fields and the status displayed in its nested Order status card. Remove the separate **Correct readiness status** button. The normal forward lifecycle action remains separate.

| Element / rule | Required behavior |
| -- | -- |
| Shared draft | Edit opens one Details draft; preserve independent Notes, Collis and Invoice-row drafts. |
| Status authority | Independently enforce existing correction authority/identity, current state and open-Shipment restrictions. Only eligible users can change status; ordinary authorized editors can still save permitted fields without correction authority. |
| Status control | In edit mode, offer current state plus permitted alternatives among PENDING, EXPECTED_READINESS and READY, using existing EN/EL labels. Ineligible status remains read-only; no later or exception state is offered. |
| Save, unchanged status | Normal authorized field save, without a correction dialog/reason. Changing status and returning to the original also counts as unchanged. |
| Save, changed status | Before any write, open confirmation showing old → new status, all other proposed field changes and applicable readiness-date/remark effects. Require **Correction reason / Αιτιολογία διόρθωσης**, nonblank, max 1,000 characters. |
| Conditional date | Require a valid readiness date when correcting to EXPECTED_READINESS. Prefill the saved date if present; otherwise leave empty. No unrestricted ordinary readiness-date editing or invented date. |
| Confirm and save | Submit approved field changes and correction through <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>'s atomic authorized save; prevent repeat submission while pending. All changes and audit succeed together or none do. Never orchestrate separately committed field-update and correction calls. |
| Cancel / Escape / close confirmation | Write/audit nothing. Return to the shared editor preserving ordinary fields, status, reason and date drafts for that session; restore focus. Rebuild review if proposals change. |
| Cancel editing | Discard only this Details/correction session, preserving unrelated card drafts; restore saved values and focus. |
| Failure / stale data | Retain drafts with actionable errors. Changed server state/version, authority or reservation requires refreshed review before retry; do not silently apply a different correction. |
| Effects and audit | PENDING clears saved readiness date and remark; EXPECTED_READINESS uses confirmed date and preserves saved remark; READY preserves date/remark. Correction reason is audit information, not Notes or a readiness remark. Preserve prior history and physical journeys; correlate ordinary-change and correction audits to the same save, each applicable event once. |

[FRO-346](<https://linear.app/front-line-ltd/issue/FRO-346>) owns atomicity, contracts, authorization, concurrency, validation and audit. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> owns the shared Edit/status presentation and Save-triggered confirmation. This supersedes the earlier separate-button/dialog placement and exclusion of correction from Details Save. Refresh authoritative fields, status/progress, actions and history after success. Existing standalone update/correction consumers remain supported during rollout.

## Create supplier invoice — <issue id="08a0fd34-33d7-46fd-9f5c-dc9173648750" href="https://linear.app/front-line-ltd/issue/FRO-349/order-details-create-supplier-invoice-from-order-details">FRO-349</issue>

Add **Create supplier invoice / Δημιουργία τιμολογίου προμηθευτή** as its own standalone action card directly in the Available actions tab, after the readiness actions. Use the shared action heading/button/availability-reason layout. Keep a separate blue <issue id="08a0fd34-33d7-46fd-9f5c-dc9173648750" href="https://linear.app/front-line-ltd/issue/FRO-349/order-details-create-supplier-invoice-from-order-details">FRO-349</issue> change note above the standalone action cards, without an outer card, after the <issue id="e7c54093-d15c-4d60-a442-3469b24c81a0" href="https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and">FRO-328</issue> note; no ticket labels inside the action card.

Production behavior and authorization follow [FRO-349](<https://linear.app/front-line-ltd/issue/FRO-349>): use the normal Supplier Invoice create page with the exact current Order preselected, independent invoice-create authority/company scope, non-cancelled Order and Supplier eligibility. Existing invoices do not by themselves disable this action. No duplicate creation form or quick-entry modal.

**Preview exception requested for design review:** the button must not navigate to a real or simulated Supplier Invoice create page, open a creation modal, submit data or fabricate successful creation/audit. It may show an inline, localized design-only message. This inert design behavior is not the production navigation contract. Preserve existing Order data, tabs, drafts and readiness actions.

## Supplier readiness actions — [FRO-328](<https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and>)

**Two synchronized locations:** show **Request readiness date** and **Confirm readiness date** as secondary outlined buttons in the **top-right header of Order status**, beside its title, and retain them in the **Available actions** tab. Both locations use the same authorization, eligibility, disabled reasons, draft preparation, review dialog and Send behavior; changing status/date/queue state refreshes both. No independent duplicate commands or email records. The lifecycle action remains in the status card's bottom action row. Manual correction is integrated into the Order details Edit session under <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>; no separate correction button remains.

Use the same EN/EL labels in both places. Header buttons wrap below the title on narrow screens without page overflow. Provide accessible disabled reasons and distinct helper IDs; Cancel/close restores focus to the button/location that opened the shared review. Opening from either location sends or queues nothing. View-only users receive no mutation controls in either location. Keep <issue id="e7c54093-d15c-4d60-a442-3469b24c81a0" href="https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and">FRO-328</issue> review annotations in the preview only; the compact status header does not require duplicate explanatory note blocks.

Both buttons remain visible at every Order status to users authorized to send reminders. Keep each inapplicable or temporarily unavailable action disabled with a specific EN/EL reason. **Do not hide the controls or leave the Available actions tab empty in READY or later states.** At **READY**, both readiness-email buttons remain visible and disabled, with **“The Order is already Ready; readiness-date emails are no longer applicable.”** and its EN/EL equivalent. Other unavailable states show the relevant lifecycle/eligibility reason; retain queueing and reservation reasons where applicable. The main stock-arrival action remains inside Order status, not duplicated here. Never restore the shared **Email supplier about readiness** action or a status-switched single button.

| Button | Enablement | Intent |
| -- | -- | -- |
| Request readiness date | PENDING, no recorded date, required authority and existing manual-reminder eligibility satisfied | Ask the supplier to provide a date. |
| Confirm readiness date | EXPECTED_READINESS, recorded date, required authority and existing manual-reminder eligibility satisfied | Ask the supplier whether that date remains correct. |

Date presence alone cannot override lifecycle, reservation or reminder eligibility. **Request** requires PENDING **and** no date; **Confirm** requires EXPECTED_READINESS **and** a date. A PENDING split child with an inherited date has neither action enabled; an EXPECTED_READINESS record without a date must not enable Request. READY/later/exception states enable neither. A queued reminder or a failed authorization/eligibility check must not be bypassed.

Use [FRO-328](<https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and>)'s corresponding template and review showing **recipients, subject and body**. Opening prepares a draft only; it neither sends nor queues. Only explicit **Send** starts delivery/queueing. Cancel/close queues nothing. If readiness data changes during review, refresh intent/template/date and require renewed review. Preserve recipient selection/validation, authorization, failed-send retry, supplier-response processing and audit/history. Sending either email leaves readiness unchanged; asking for confirmation is not supplier confirmation and does not mark the Order Ready. Scheduled automatic reminders retain their existing behavior.

## Notes — [FRO-292](<https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes>)

Place Notes between Order details and Split relationships. Stack **Internal Notes / Εσωτερικές σημειώσεις** and **External Notes / Εξωτερικές σημειώσεις**, each with independent top-right Edit, labelled multiline editor, Save and Cancel.

Prefill only the selected field; Save updates only it and preserves the other saved value and open draft. Retain drafts across tabs. Cancel/Escape discards only that draft and restores focus. Render escaped plain text with line breaks and — for empty values. Failures retain drafts; success follows persistence.

[FRO-292](<https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes>) owns entity-level storage, migration and authorization: existing Notes become Internal Notes; External Notes start empty; Internal Notes are staff-only and never appear in customer responses; External Notes are visible to authorized staff/customers. Do not synchronize Order and Shipment notes. Reuse Order editing authority and state guards for the controls; read-only staff can view permitted notes without editing.

## Split relationships

Card title: **Split relationships / Σχέσεις διαχωρισμών** (renamed from Split lineage). Relationship data and navigation behavior remain unchanged.

| Field | Source / meaning |
| -- | -- |
| Root PO | Existing root relationship, resolved against the authorized lineage records. |
| Parent PO | Direct parent only; no parent displays the normal missing-value marker. |
| Child purchase orders | Direct children only, not all descendants. Preserve the existing ID fallback when a child number is unavailable. |
| Purchase-order family | Authorized root-family records, including the root and descendants; preserve the current record's identity. |

Reuse `rootPurchaseOrderId`, `parentPurchaseOrderId`, `childPurchaseOrderIds` and `lineagePurchaseOrders`. Use database IDs for routing and internal numbers for display; never infer ancestry from a suffix. Do not invent inaccessible records or expose unauthorized family members.

**Links navigate to the related Order Details page in the same tab through the existing Order route. They do not open a modal or separate browser window.** The current record may be marked as current instead of linking to itself. Preserve existing authorization and missing-record behavior. Verify unsplit, root, child and nested-child Orders. No change to splitting, family ID allocation or lineage storage.

## Collis

Each colli is a **collapsed row by default**. A separate selection checkbox precedes the shared headings:

| Column | Type / format | Display |
| -- | -- | -- |
| **Colli** | String | Permanent tracking code and expand/collapse arrow. Tracking identity remains read-only. |
| **Flags** | Four independent booleans | DG · Fragile · Unpacked · Damaged Packing, shown in the collapsed summary. Keep together on one line where space permits; allow controlled wrapping/contained scrolling. |
| **Dimensions** | cm | Declared length × width × height; e.g. **120 × 80 × 95 cm**; — for missing data. |
| **Gross weight** | kg | Existing declared gross weight. |
| **Net weight** | kg | Existing declared net weight; — when absent. Never derive it from gross weight. |
| **Actions** | Buttons | Per-colli **Edit** and **Remove**; **Save / Cancel** replace Edit while that colli has a draft. |

Do not include Description or Package type in these summary columns. Show both as separately labelled fields in the expansion. Labels occur once in the shared header. **Vertically center all headings in the grey header with equal top/bottom padding**, and keep row values aligned. Retain DG/bonded indicators and terminal history. Put the terminal/non-selectable notice beneath the colli ID so it cannot shift flag/measurement columns. Terminal collis remain visible, unselectable for operations, and expandable for inspection.

**Expand/collapse:** summary and expansion form **one continuous colli card**, with a shared border/background and no gap or separate rounded inner card. Space separates different collis. Multiple rows expand independently. Expansion does not change selection, flags, eligibility or editing authority. Retain expansion/drafts across tab/language changes. Use labelled keyboard controls, expanded state and the revealed-content relationship. Narrow screens use contained table scrolling; expanded controls must remain usable without page overflow.

**Selection:** the existing row checkboxes serve **Add identical** and the footer operations. They are independent of expansion and handling flags. Preserve active/terminal selection eligibility.

### Per-colli editing

All values/flags initially show saved data and remain read-only. **Edit** unlocks only its colli and opens its expansion; other rows stay read-only.

| Editable field | Type / control | Placement |
| -- | -- | -- |
| Description | Existing free text | Expanded area. |
| Package type | Dropdown (existing package-type reference data) | Expanded area, separately labelled. Use the 15 values in the current authorized backend enum: PALLET, WOODEN_BOX, FUMIGATED_WOODEN_BOX, SKELETON_WOODEN_BOX, FUMIGATED_SKELETON_WOODEN_BOX, SKELETON_METAL_BOX, CARDBOARD_BOX, METAL_BOX, METAL_CAN, BARREL, PLYWOOD_BOX, PLASTIC_BOX, FUMIGATED_PALLET, ENVELOPE, OTHER; use existing localized labels. |
| Length / Width / Height | Existing numeric cm inputs | Dimensions in the summary while editing. |
| Gross / Net weight | Existing numeric kg inputs | Their summary columns while editing. Preserve authorized validation and optional/missing values. |
| Handling flags | <issue id="9060bbb8-7585-43fb-9bfe-a23ada180099" href="https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po">FRO-297</issue> booleans | Collapsed summary; editable only during this row's edit. |
| Class of DG / UN / DG details | <issue id="9060bbb8-7585-43fb-9bfe-a23ada180099" href="https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po">FRO-297</issue> dropdown / free text | Conditional expanded area. |

**Save** applies only that row's permitted changes through existing authorized persistence while preserving all other collis, identity, history and unrelated Order fields. **Cancel/Escape** discards only that row's draft and restores saved values/focus. Maintain independent simultaneous drafts. Failed/denied/stale saves retain drafts and show errors; no success before persistence. Recheck server authority, status and active-Shipment/reservation restrictions. The saved Order DG badge must not reflect unsaved checkbox drafts.

**Package contract check:** the backend GraphQL enum currently defines 15 values, while the handwritten client `HandlingUnitPackageType` exposes six. Resolve this client/API mismatch against the authoritative schema when wiring the selector; do not invent categories or lose supported saved values.

### Add colli, Add identical and Remove

Place **Add colli** and **Add identical** together at the top of the Collis card. Reuse the authorized Order/colli editing rules: editor authority, PENDING / EXPECTED_READINESS / READY / IN_STOCK, and no active Shipment, plus current server restrictions.

| Action | Required behavior |
| -- | -- |
| **Add colli** | Append a new independently editable row; blank Description/dimensions/weights, **Cardboard box** package default and unset handling flags. Preserve existing contract validation; do not restore removed PCS/Notes/Import Delivery Note fields. Open the expansion with Save/Cancel. |
| **Add identical** | **Disabled until at least one eligible row is selected using the existing checkboxes.** Duplicate each selected colli once, not the last row automatically. No additional chooser/dialog. Copy its editable description, package type, declared dimensions/weights and handling/DG fields into an independent new draft. |
| New colli identity | Use a fresh identity through the existing creation contract. Never reuse a source tracking code/database ID or copy terminal disposition, custody, movements, audit/lineage history or reservations. Creating a copy does not change its source. |
| **Save / Cancel** on an addition | Save persists only the new colli after validation; Cancel/Escape discards only that unsaved addition. Update the live row count. Unsaved additions cannot be selected for split/disposition. Existing selections and other drafts remain intact. |
| **Remove** | Per-row button for eligible saved active collis, using existing authorized Order/colli correction semantics. Preserve at least one saved active/editable colli; terminal rows cannot be removed through this editor. A successful saved-colli removal retains its permanent identity/current membership and records the backend's audited **CANCELLED terminal disposition**, excluding it from future movement. Retain it as a terminal historical row, visible for inspection and unselectable. Removing an unsaved addition only discards that local draft and creates no disposition or audit event. Keep unavailable controls disabled with an EN/EL reason. The preview's immediate row disappearance is illustrative; production must show the persisted result and preserve existing confirmation/validation requirements. |
| Refresh/cleanup | Update row count, saved DG aggregate, active selection, expansion, row drafts/errors and arrival-measurement rows. Clear removed IDs from selected actions; recheck their eligibility. No orphan drafts or deleted-source copies. |

Canceling an unsaved addition must not bypass the last-active protection. **Remove** and **Record terminal colli disposition** remain separate controls: saved-colli Remove uses the existing correction command, which records **CANCELLED** with its standard reason (**Removed during purchase order colli correction**), actor/time, terminal-disposition journey event and activity audit; the disposition action records the explicitly selected disposition/reason. Do not suppress those backend removal events, physically delete saved colli identities/history, or fabricate DAMAGED/custody changes. Current membership remains available for reference; the terminal disposition prevents further movement. Preserve referential/history protections and unrelated Order, Agent and Shipment data. After success, refresh terminal rows, active selections, DG aggregation and arrival-measurement eligibility from returned authoritative data; failures leave the saved colli unchanged.

### Handling flags and conditional DG fields — [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297>)

Show these four independent tickboxes in the **collapsed summary**, with no duplicate controls in the expansion:

| Flag | Type | Behavior |
| -- | -- | -- |
| **DG** | Tickbox | Dangerous goods; reveals Class of DG and UN / DG details in the expansion while ticked. |
| **Fragile** | Tickbox | Handle with care; no extra field. |
| **Unpacked** | Tickbox | Goods arrive without packaging; no extra field. |
| **Damaged Packing** | Tickbox | Packaging damage only; never sets terminal DAMAGED or changes selection/shipment eligibility. |

| DG field | Type / format | Behavior |
| -- | -- | -- |
| **Class of DG** | Dropdown — classes 1–9 from <issue id="9060bbb8-7585-43fb-9bfe-a23ada180099" href="https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po">FRO-297</issue> | Use the specified localized hazard classes. |
| **UN / DG details** | Free text | Preserve supplier wording, UN number, shipping name and packing group; do not reformat. |

Show both DG fields only while DG is ticked. Unticking clears both in that colli's draft; Cancel restores saved fields. A persisted class cannot remain when DG is false; other flags stay unchanged. The Order DG aggregate reflects saved data. **Align the two field borders with equal widths, top edges and compact heights**; the preview uses **72 px**, with usable scrolling for longer detail text and a stacked layout on narrow screens.

<issue id="9060bbb8-7585-43fb-9bfe-a23ada180099" href="https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po">FRO-297</issue> owns domain/storage/update rules; <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> owns the collapsed/expanded placement and Edit/Save/Cancel presentation. Read-only users inspect saved data without mutation. These requirements do not assert <issue id="9060bbb8-7585-43fb-9bfe-a23ada180099" href="https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po">FRO-297</issue> is delivered; use its authorized contract when available.

### Removed colli fields and retained Order reference

| Ticket | Order Details requirement |
| -- | -- |
| [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli>) **— PCS** | No per-colli PCS field in the summary or expanded area. Do not change gross/net weights, dimensions or invoice-row quantity/unit meaning. [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli>) owns stock-list packing-line and Shipment-review piece-count removal. |
| [FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli>) **— Notes** | No per-colli Notes box. Record condition through the [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po>) flags; preserve the colli Description and the Order's Internal/External Notes. |
| [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>) **— Import Delivery Note** | No per-colli `importDeliveryNote` input. Remove **Colli documentation** when that group is empty. Retain the existing Order-owned `deliveryNoteImport` reference once in Order details; this is an optional String, not an attachment or issuance command. |

Preserve Order Import/Export references, attachments, inherited document provenance and Shipment Delivery Note workflows. Use the Order-level reference for the actual Order, including a split child; do not synchronize a root family or infer ownership from suffixes.

[FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>) owns existing-data inventory, migration and reconciliation: do not discard conflicting legacy colli values, arbitrarily choose or concatenate a reference, or overwrite a nonmatching Order value. Preserve source attribution until reconciliation is complete. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) must consume the resulting authorized Order-owned contract; it introduces no migration or duplicate field.

Keep the selection controls at the bottom, separated by a subtle divider: **Split collis · Record terminal colli disposition · Clear**, with adjacent buttons in every selection state. Put blocked-action reasons below the buttons so they do not affect spacing. No numeric Rule 4 heading marker or visible selected count.

| Operation | Existing rules to preserve |
| -- | -- |
| Split collis | Editing authority; PENDING/EXPECTED_READINESS/READY; no open Shipment; at least two active collis and a nonempty eligible selection. Open selected IDs and a separate required operational reason, preserving the existing OTHER reason contract. |
| Terminal disposition | Editing authority; PENDING/EXPECTED_READINESS/READY/IN_STOCK; no open Shipment; exactly one selected active colli. Required DAMAGED/UNCOLLECTABLE/MISSING/CANCELLED/OTHER choice and separate required reason. Review/irreversible confirmation before submission. |

Reject whitespace-only reasons. Back preserves the appropriate draft; Cancel/Escape discards it and restores focus. Recheck selection and eligibility at submission. Reuse authorized commands, validation, lifecycle and errors; do not introduce a bulk terminal operation. Failed production submissions retain drafts without fabricating success.

## History & activity

Order the cards **Order activity → Comments → Reminder history**. Preserve existing authorized entries, lineage scope, source-Order provenance and audit identity; do not copy ancestor audit rows into the current Order.

**Order activity:** three stacked sub-cards:

| Sub-card | Contents |
| -- | -- |
| Warehouse stays | Existing stays with labelled storage position, expected arrival, arrival, stock confirmation and departure when recorded; — for absent values. |
| PO status history | Actual old → new transitions, reason, actor and timestamp, including corrections. Never show future transitions as completed history. |
| Recorded operations | Existing root-to-current operations, renamed from Root-to-current activity; preserve source Order identity. Readiness-setting rows show timestamp · actor — Expected readiness set plus remark, without a second trailing readiness date. |

Use newest-first ordering for timestamped records. In Comments and all three activity sub-cards, show **timestamp · actor — event/comment · reason/remark** as one inline record without forced metadata/content line breaks. Emphasize transitions/events; retain escaped full text and natural wrapping, with no truncation. Notes retain multiline display.

**Comments:** Add comment at the top-right opens a labelled multiline Comment input with Add comment and Cancel. Reject empty/whitespace-only text. Preserve existing authorized comment persistence and visibility; this does not make comments internal-only or grant additional access. New entries appear newest first with actor/time and split-order provenance. Cancel/Escape discards the draft and restores focus; failure retains the draft with an actionable error. No Add activity message control in Available actions.

**Reminder history:** reuse the existing authorized reminder-history data and functionality in its separate card.

| Column | Required content |
| -- | -- |
| Created | Full localized date/time, newest first. |
| Request | Request readiness date or Confirm readiness date, plus automatic/manual origin. |
| Recipient | Existing recipient name and email. |
| Delivery status | Existing pending, sent or failed status; never infer delivery from draft preparation or button clicks. |

Opening/canceling an email draft adds no queued/successful entry. After explicit Send succeeds in queueing, show the returned pending record; use actual delivery results for sent/failed and refresh eligibility accordingly. A failed queue request must not appear as successfully sent. Preserve existing failed entries and authorized retry behavior; do not add a new production retry command merely because the preview demonstrates one. Include loading, empty and error states with the existing retry/refetch behavior. Reading this card must not send an email. No numeric “5” heading marker or Demo state selector in the card.

## Documents

Match [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316/shipment-details-page-redesign>)'s AttachmentPanel presentation: paperclip/Attachments heading, muted description, top-right **Choose documents or photos**, supported-file/size helper and neutral dashed attachment area. Preserve existing files, inherited read-only provenance, downloads and permission guards; do not replace populated data with an empty mockup.

## Invoice rows — <issue id="2efcffbc-dd4f-4a30-a30d-12f3eb3cee9f" href="https://linear.app/front-line-ltd/issue/FRO-337/order-invoice-rows-add-unit-price-and-calculate-read-only-total-value">FRO-337</issue>

Use the existing reviewed **Invoice Rows** table presentation, with these nine columns in order: **Line number · Description · HS code · Quantity · Unit · Unit price · Currency · Total value · Actions**. Preserve the current card, grey header, neutral bordered/scrolling table, row padding, controls and Add invoice row placement. This text documents the current UI; it does not request a UI change.

| Field | Type / rule |
| -- | -- |
| Line number | Derived display order; not an editable identifier. Preserve saved row identity and existing ordering/renumbering rules. |
| Description | Required nonblank String, max 1,000 characters. |
| HS code | Optional String, max 100 characters. |
| Quantity | Required positive whole number; editable. |
| Unit | Existing PC / SET / PKT enum, with localized labels; editable. |
| Unit price | Required nonnegative decimal monetary amount, up to 2 decimal places; editable. Blank is not zero; zero is allowed. |
| Currency | Existing authorized currency reference options; shared by Unit price and Total value. Changing it performs no currency conversion. |
| Total value | **Read-only Quantity × Unit price**. Never an independent input or override. Production uses <issue id="2efcffbc-dd4f-4a30-a30d-12f3eb3cee9f" href="https://linear.app/front-line-ltd/issue/FRO-337/order-invoice-rows-add-unit-price-and-calculate-read-only-total-value">FRO-337</issue>'s two-decimal unit-price precision and authoritative server calculation; currency-specific rounding is deferred. |

**Saved-row editing:** per-row **Edit** opens a prefilled independent draft; **Save / Cancel** replace Edit for that row. Save persists only its permitted changes and refreshes the returned authoritative total. Preserve other invoice-row, Order-details, Notes and colli drafts. Cancel/Escape discards only that row's draft and restores focus. Save failure retains inputs and shows an actionable error; report success only after persistence.

**Add invoice row** appends an independent draft with blank Description/HS code/Unit price, Quantity 1, Unit PC and the existing available currency default. Assign no permanent identity before persistence. Save creates the row; Cancel discards the unsaved addition. **Remove** uses existing authorized invoice-row removal semantics; removing an unsaved addition only discards its draft. Keep empty invoice collections valid.

Reuse existing PURCHASE_ORDER_EDIT, identity/company scope, PENDING / EXPECTED_READINESS / READY / IN_STOCK editability and no-open-Shipment restrictions, plus current server validation. Show permitted read-only values without mutation controls to view-only users. Recheck guards on submission, retain drafts across tab/language changes, and preserve unrelated rows/fields and invoice-change audit.

[FRO-337](<https://linear.app/front-line-ltd/issue/FRO-337>) **blocks this ticket** and owns Unit price storage/contracts, server-calculated total, two-decimal unit-price precision, deferred currency-specific rounding and mock-data rollout. Consume that contract consistently; if the existing Order update replaces a complete invoice-row collection, preserve every unrelated saved row rather than treating a single-row Save as permission to drop the rest. Current production invoice rows are mock data and may be reset/regenerated during implementation; historical-total reconciliation is not required. Ordinary row saves must still preserve unrelated saved rows.

The design accepts Unit price with up to **2 decimal places** and displays monetary values with **2 decimal places**, using exact Quantity × Unit price. Currency-specific rounding is deferred and does not block UI design. Existing mock invoice rows may be reset/regenerated under <issue id="2efcffbc-dd4f-4a30-a30d-12f3eb3cee9f" href="https://linear.app/front-line-ltd/issue/FRO-337/order-invoice-rows-add-unit-price-and-calculate-read-only-total-value">FRO-337</issue>; no historical-total reconciliation is required. This ticket edit does not claim the hosted preview has been updated. Preserve invoice quantity/unit independently of colli PCS removal. No VAT, discounts, exchange conversion or accounting invoice issuance is introduced.

## Visual style and preview annotations

**Standalone Available actions cards (preview only):** apply the shared new-component styling to each of Request readiness date, Confirm readiness date, Create supplier invoice and Entry Note: `2px dashed rgba(27,158,138,.72)` with `linear-gradient(180deg,#f8fdfa 0,#fff 115px)`. Keep all change labels/notes above the standalone cards in an unboxed review-note area; add no duplicate labels inside the action cards. Production retains the neutral action-card structure and authorized behavior.

**Internal/External Notes:** saved note content areas use a white background (`#fff`), including the empty-value state; remove their grey fill. Remove the inner saved-note content borders as well. Preserve the outer note-card borders, spacing, independent edit controls and blue ticket-origin annotations. Other saved-field backgrounds are unchanged.

**Compact Order status reference —** <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign">FRO-335</issue>: neutral `#f8f9fb` background, `1px solid #e3e6eb` border, 8px radius, 16px padding and 20px bottom margin. Label is 14px/600; label/control gap is 16px. The flexible control has max-width 430px, `1px solid #e3e6eb`, 7px radius, 8px 9px padding and 13px type. Match in Details view and shared Edit, retaining read-only/authorized semantics. Wrap existing saved-Order actions on narrow screens without overflow; do not copy creation-only behavior or remove saved-Order actions.

Add a separate full-width blue <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue> **change** note after <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> and above Order status, describing the shared Edit/Save flow. This is a preview annotation, not proof of backend delivery.

Reuse [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316/shipment-details-page-redesign>)'s light style: page `#f8f9fb`, white cards, navy `#0a1f3d`, borders `#e3e6eb`, teal `#1b9e8a`, Plus Jakarta Sans, 20px card padding/spacing, 12px corners and matching subtle shadows. Heading: muted 20px Order and prominent 24px ID with 10px gap; use 18px/21px on narrow screens. Match 14px teal-underlined tabs, compact controls, tables, uppercase field labels and four-column desktop/two-column narrow-screen facts.

**Review annotations belong only to the preview**, not production components:

* Highlight Overview, Collis, History & activity and Available actions tabs using [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316/shipment-details-page-redesign>)'s dashed teal outline, pale background and rounded top corners. Preserve selected styling and solid keyboard-focus outlines.
* Highlight Order details, Notes, Split relationships, Collis, Order activity, Comments and Reminder history outer cards with `2px dashed rgba(27,158,138,.72)` and `linear-gradient(180deg,#f8fdfa 0,#fff 115px)`, plus top-right **Updated section / Ενημερωμένη ενότητα** and explanatory teal change text. Keep inner status/activity/notes cards neutral.
* Split relationships's teal change note describes grouping Root PO, Parent PO, direct child Orders and the purchase-order family. Remove the previous standalone Demo Order family/navigation explanation; related-Order links remain inactive in the simulation.
* Wrap **DG** and **Parent Balance** together in one shared preview-only new-component border: `2px dashed rgba(27,158,138,.72)`, pale `#f8fdfa` background, 8px corners, 6px vertical/8px horizontal padding and 8px between the flags. Preserve each badge's own color; this outline is not a production badge style.
* In Order details, put the teal <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> **change** note below the heading. Directly below it, stack four separate full-width, clickable blue ticket-origin notes in order <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-origin-and-destination-countrycity-fields">FRO-329</issue> **→** <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue> **→** <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> **→** [FRO-346](<https://linear.app/front-line-ltd/issue/FRO-346>), all **above Order status**. Never place these inside a field's value/label or the field grid, where they would disturb alignment.

  | Ticket | Indicative EN change note |
  | -- | -- |
  | [FRO-329](<https://linear.app/front-line-ltd/issue/FRO-329>) | Removed Order route fields, MRN, VAT-value/Duties amount-and-currency fields, and the Route and readiness card under <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export">FRO-329</issue>. <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> owns explicit Customs regime, retained conditional ΑΛΚ and ΚΤΑ replacement. DN Import, DN Export and Expected Readiness Date remain in Order details. Separately owned Shipment/customs/invoice data is unchanged. |
  | [FRO-333](<https://linear.app/front-line-ltd/issue/FRO-333>) | Front Line responsibility for supplier pickup; does not mean collection is complete. |
  | [FRO-334](<https://linear.app/front-line-ltd/issue/FRO-334>) | Collection agent is removed from Order details and editing. Greece no longer requires a Collection agent; Pickup responsibility remains independent. |

  Use EN/EL equivalents, the shared blue note style, and no numeric rule marker. These describe the reviewed design, not proof of backend delivery.
* Use blue ticket-origin notes for [FRO-292](<https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes>) inside each Notes sub-card. For [FRO-328](<https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and>), use one consolidated note above the standalone action cards in the Available actions tab, after its <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> note and before all standalone action cards; remove per-action ticket labels. Keep action-specific availability reasons by their controls. Note styling remains `#eef3fb` background, `#405d85` text, `#6f8fbd` left border and `#36567f` emphasis/link.
* Notes sub-cards: white background, 1px `#e3e6eb` border, 8px corners, 16px padding and 14px top spacing.
* Inside each expanded colli, stack four separate blue ticket-origin notes in this order: [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po>) **→** [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli>) **→** [FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli>) **→** [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>). Use the same style as the other ticket-origin notes, EN/EL equivalents, and the wording below. Keep the notes and controls inside the colli's shared border without a second new-component outline.

  | Note | Indicative EN text |
  | -- | -- |
  | [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po>) | Independent handling and packaging flags. Damaged Packing does not mark the colli as terminally damaged. |
  | [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli>) | The PCS field is removed from each colli. Invoice-row quantities and units remain unchanged. |
  | [FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli>) | The Notes field is removed from each colli. Condition is recorded with the [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po>) flags; the colli Description and Order Notes remain unchanged. |
  | [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>) | The per-colli Import Delivery Note field and empty Colli documentation section are removed. The reference remains on the Order; attachments and Shipment documents are unchanged. |

  These notes are review annotations, not production fields or evidence that the underlying tickets have shipped.
* Hide the old layout/state/status/access controls strip and current-production reference. Keep only Stacked cards. Historical images are not active alternatives.

All production labels, reasons, dialogs, states and accessible names require EN/EL equivalents, keyboard access and usable 375px layouts without page overflow.

## Preview behavior versus production

The preview now simulates both **Set expected readiness** and **Mark ready at supplier** end to end, updating status/progress, next action and history. DN Import/DN Export edits use the same card draft. These are design demonstrations; production must use the existing authorized persistence and audit contracts, not the in-memory implementation.

The existing hosted preview is illustrative: edits, comments, readiness, corrections and email queues use demo data/in-memory state; no production command or real email is submitted. Email delivery/failure controls are explicitly simulations. Draft opening/canceling has no simulated sending side effect. Colli forms validate/review requests without fabricating completed splits or dispositions. Related-Order links are inactive in the simulation: no navigation, modal or toast. Production links use normal Order Details navigation.

Do not implement preview-only simulation controls, annotations, fake records or hidden demo URL options in production. Production uses actual relationships, authorized operations, validation and returned results.

## Acceptance criteria and verification

| Area | Required verification |
| -- | -- |
| Customs regime / ΑΛΚ | Greece = No locks/empties both fields without a regime-required error or stale submission; Greece = Yes requires one of the three warehouse-supported regimes. All three explicit regimes, conditional optional ΑΛΚ, later entry, restricted options, unavailable capability data, authorised editing, draft/Cancel/failure retention and unchanged values on unrelated saves. Use <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>’s agreed regime-change and missing-current-warehouse rules. |
| Structure | Only Stacked cards; final Overview/History card order; correct tabs; no obsolete route card, duplicate status, More actions, Other actions or colli shortcut. |
| Heading flags | Right-aligned adjacent DG/Parent Balance, correct conditional data and localization, retained other flags, no duplication beside the ID, and usable narrow-screen wrapping. |
| Status/main action | <issue id="a923db24-07d7-4b3c-9c85-df4f4217298a" href="https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign">FRO-335</issue>-style grey sub-card in view and edit mode; same-line Order status label/control; no progress bar, Step counter or Next text. Saved/read-only later and exception states, <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>-eligible editing, at most one eligible main lifecycle action, preserved readiness-email actions and view-only behavior. |
| Standalone Edit-page retirement | Order Details provides every retained, authorized editing capability in its agreed card or workflow. Existing Edit links lead to Details; old `/secured/purchase-orders/$purchaseOrderId/edit` URLs redirect to the same Order's Details without an old form, mutation or access bypass. Creation remains usable, removed fields stay removed, and Notes/Collis/Invoice rows retain independent saves. Verify permissions, unavailable records, direct URLs and navigation in a safe test environment; after deployment, inspect links, redirection and editor availability read-only without saving. |
| Details/Notes editing | Main-grid Greece/Pickup and DN Import/DN Export (separate optional references, max 255 characters each), editable Urgent and Urgent information, no Collection agent display/selector/hidden required field. Pickup Yes/No semantics independent of Greece and lifecycle; unknown initial state not silently No. Independent drafts, Save/Cancel/Escape, authorization/reservation checks, persistence failures and preservation of unrelated values. |
| Invoice rows | Nine-column table; saved-row read-only display and independent Edit/Save/Cancel; Add/Remove with empty collection support; required positive Int Quantity, PC/SET/PKT Unit, nonnegative Unit price and shared Currency. Total is calculated/read-only, server-authoritative under <issue id="2efcffbc-dd4f-4a30-a30d-12f3eb3cee9f" href="https://linear.app/front-line-ltd/issue/FRO-337/order-invoice-rows-add-unit-price-and-calculate-read-only-total-value">FRO-337</issue>, with no independent override/conversion. Verify drafts/failure handling, authorization/status/reservation guards, unchanged unrelated rows, audit and mock fixtures with two-decimal unit prices and calculated totals. |
| Colli add/copy/remove | Blank Cardboard-box defaults; Add identical disabled without selection, one fresh independent copy per selected eligible colli, no chooser and no automatic last-row copying. Fresh identity, retained editable values/flags, no copied custody/terminal/history. Save/Cancel additions, row counts, protected terminal/last-active removals, stale selections, DG aggregate and arrival measurements. Verify saved Remove retains identity/membership and a visible unselectable CANCELLED row with standard reason, actor/time, journey/activity audit; unsaved Remove/Cancel creates no audit. Test invalid/denied/failed mutations and multiple simultaneous drafts. |
| Dependency annotations (preview only) | <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> note followed by separate <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-origin-and-destination-countrycity-fields">FRO-329</issue> → <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue> → <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> notes above status, outside the grid. EN/EL, working ticket links, aligned fields, and no preview labels copied into production. |
| Readiness/correction | Required date/reason rules, functional Mark ready submit with optional max-1,000-character remark, EXPECTED_READINESS → READY, reflected in the compact saved-status control, preserved readiness date/remark and unrelated drafts, next stock-arrival action, actual transition/operation/journey audit, no duplicate submission, old/new correction confirmation, no mutation on cancel, errors preserve drafts, guards are rechecked, date/remark semantics and append-only history; corrected state updates the saved-status control/actions without restoring a bar/counter. |
| Readiness email | Both authorized buttons present in the top-right Order status header and Available actions, synchronized across statuses/date/queue changes, matching enablement and disabled reasons, shared email review/Send behavior, focus return to the originating location, distinct accessible helper IDs and mobile wrapping, including READY with explicit disabled reasons and no empty Available actions tab, precise enablement/disabled reasons, Pending inherited-date split child and Expected-without-date cases (both disabled), template review without queueing, explicit Send, stale-data renewed review, canceled/failed requests and accurate history. |
| Lineage | Actual root/direct parent/direct children/family values, missing values/records, unsplit/root/child/nested-child cases, authorized same-tab navigation to Order Details without a pop-up. |
| Collis | Shared Colli / Flags / Dimensions / Gross weight / Net weight / Actions headers, vertically centered in the grey bar. Description/Package type only in the expansion. Default collapse, continuous border, independent selection/expansion, terminal notice beneath ID, compact aligned DG fields, no duplicate flags, DG clearing and saved aggregate. Per-row Edit gating, independent Save/Cancel/Escape, retained drafts and failure/permission behavior. Footer spacing and existing operation guards/confirmation remain intact. |
| Colli field removals | PCS, colli Notes and per-colli Import Delivery Note are absent in both collapsed and expanded content; empty Colli documentation is removed; Description, Order Notes, invoice-row quantities, weights and attachments retain their meaning. One authorized Order-level Import Delivery Note remains, with correct split-Order attribution and absent-value handling. All four preview notes appear separately in the agreed order. |
| History | Final order, all retained entries/provenance, compact records, reminder type/origin/recipient/full time/status, newest first and loading/empty/error handling. |
| Route & customs cleanup | <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export">FRO-329</issue>’s remaining removed fields, hidden defaults/payload values and route card are absent. DN Import/DN Export and Expected Readiness Date remain. [FRO-356](<https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location>) owns explicit Customs regime, retained conditional ΑΛΚ, ΚΤΑ replacement and legacy reconciliation. Preserve separately owned invoice/customs/Shipment data. |
| Existing data | Preserve existing removed-field values/history according to <issue id="5b72a076-5013-4249-b70c-0b1174601823" href="https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export">FRO-329</issue>'s approved data-treatment plan; <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> separately owns ΚΤΑ/ΑΛΚ and warehouse-variant reconciliation, preserving ΑΛΚ and legacy regime evidence. UI omission does not authorize deletion or reassignment. Compare retained DN Import/DN Export, unrelated fields, invoice rows, files, inherited attachments, custody and histories with the existing page. Confirm the explicit removals under <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> (Collection agent) and the [FRO-329](<https://linear.app/front-line-ltd/issue/FRO-329/order-remove-origin-and-destination-countrycity-fields>) remaining route/MRN/monetary fields, with ΚΤΑ replacement and retained conditional ΑΛΚ under <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue>, [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli>) PCS, [FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli>) colli Notes and [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>) duplicate colli reference presentation changes; verify <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue>'s agreed existing-data handling without inventing Pickup responsibility; preserve Order Notes/Description and the authoritative Order reference, with [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>) reconciliation and provenance intact. |
| Accessibility/localization | EN/EL, keyboard focus/return, labels/reasons, dialog access and 375px/desktop wrapping without page overflow. |

Run mutation, cancellation, stale-data, failure/retry and audit tests in a safe test environment. Post-deployment production checks are read-only: inspect existing records and open/cancel dialogs without submitting commands or emails.

### <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue> integration verification

Verify ordinary-only, correction-only and combined saves; status changed then restored; reason/date validation; PENDING clearing versus EXPECTED_READINESS/READY preservation; no persistence before confirmation; confirmation cancellation retaining all drafts; editing cancellation discarding only Details; independent correction authority, state and reservation guards; all-or-none failure/audit; refreshed stale review; repeat-submit protection; authoritative actions/history refresh; EN/EL, keyboard focus and narrow layout. The static preview simulates this in memory; production server transaction/concurrency checks belong to <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>.

## Affected systems and exclusions

**frontline-forwarding-client:** Order Details structure, card-level editing presentation, existing operations, navigation, history and EN/EL labels. Use <issue id="49f43a32-1c99-448b-88ff-68545cb3d9f7" href="https://linear.app/front-line-ltd/issue/FRO-346/order-combine-details-editing-and-readiness-correction-in-one-atomic">FRO-346</issue>'s combined authorized Details/correction save for the integrated editor. Preserve existing standalone update/correction consumers and reuse existing comment, colli and reminder contracts. [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign>) introduces no new backend lifecycle, authority, database field or migration. <issue id="5ae2cf62-8f88-4006-9cf4-ba83d23dcccc" href="https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location">FRO-356</issue> owns Customs regime/conditional ΑΛΚ contracts, warehouse licences/capabilities, validation and migration. <issue id="7542b3cb-bacb-4f9d-b267-4fc3792fe774" href="https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no">FRO-333</issue> owns the new Pickup field and unresolved data rules; <issue id="c8262ae0-b0b9-4126-8e1f-0a427bc58d05" href="https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency">FRO-334</issue> owns Collection agent removal and Greece-dependent validation/data compatibility. Reuse existing colli creation/update/removal contracts and server validation; selected-copy presentation must not reuse permanent identities. [FRO-292](<https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes>), [FRO-328](<https://linear.app/front-line-ltd/issue/FRO-328/order-split-supplier-readiness-emails-into-request-readiness-date-and>) and [FRO-329](<https://linear.app/front-line-ltd/issue/FRO-329/order-remove-origin-and-destination-countrycity-fields>) own their specified backend changes. This ticket owns retirement of the standalone Edit page, replacement of its navigation and old-URL redirection after retained editing capabilities are available on Details. FRO-346 owns the combined Details/readiness save contract; other linked feature tickets retain their domain and backend ownership. Shipment routing, scheduled automatic reminders and supplier responses are outside this ticket's change scope.

[FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli>), [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli>), [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po>) and [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>) own their specified field/domain/contract changes, including [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order>)'s existing-data treatment. This ticket coordinates their resulting presentation; it does not implement their backend changes or remove Shipment document workflows.

**Invoice calculation ownership:** [FRO-337](<https://linear.app/front-line-ltd/issue/FRO-337>) owns new Unit price storage/API changes, calculated totals, two-decimal unit-price precision, deferred currency-specific rounding and mock-data rollout. <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> consumes that contract and changes only invoice-row presentation/editing integration; it does not implement those backend changes itself.

## Implementation sources

Use the current `Frontline-Forwarding/frontline-forwarding` repository. Sources inspected on 9 October 2026, with the Purchase Order form, field labels, package types and form validation rechecked through `gh` on **12 October 2026**, include:

* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-detail.tsx` — existing details, lineage, correction and operations.
* `frontline-forwarding-client/src/routes/secured/purchase-orders/$purchaseOrderId.edit.tsx` — existing separate Edit route, shared form and return-to-Details navigation; replace its form with the authorized Details redirect. Reconcile retained capabilities before retirement and preserve the creation form. Route and Details edit link rechecked through `gh` on 22 October 2026.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx` — DN Import/DN Export (optional text, max 255), Urgent/Urgent information, Greece, package defaults, Add colli, current last-row Add identical and row Remove/minimum-row guard. **This ticket explicitly changes Add identical to the existing checkbox selection**, while retaining authorized creation/removal behavior; production source is the starting point, not the final selected-copy UX.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — authoritative 15-value package-type enum and existing authorized Order/Colli contracts.
* `frontline-forwarding-client/src/features/purchase-orders/types.ts`, `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form-validation.ts`, `frontline-forwarding-client/src/app/providers/labels-provider.tsx` — package options, retained validation, field contracts and EN/EL labels.
* `frontline-forwarding-client/src/features/purchase-orders/components/readiness-reminder-action.tsx` — reminder eligibility/history.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-table.tsx` — Current warehouse presentation.
* `frontline-forwarding-client/src/features/shipments/components/shipment-detail.tsx`, `DESIGN.md`, theme/UI components and label providers — shared presentation and translations.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` — correction validation, date/remark semantics and audit; `markReady` rechecked through `gh` on 12 October 2026: EXPECTED_READINESS guard, optional max-1,000-character remark, READY status, active-colli READY_FOR_COLLECTION journeys and transition/activity audit.
* `docs/workflows/purchase-order-colli-journey.md` — readiness, custody, split lineage and lifecycle rules.

**Reference:** [Current Order UI preview](<https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/>) · [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316>) · [FRO-313](<https://linear.app/front-line-ltd/issue/FRO-313>) · [FRO-314](<https://linear.app/front-line-ltd/issue/FRO-314>) · [FRO-292](<https://linear.app/front-line-ltd/issue/FRO-292>) · [FRO-294](<https://linear.app/front-line-ltd/issue/FRO-294>) · [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295>) · [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297>) · [FRO-328](<https://linear.app/front-line-ltd/issue/FRO-328>) · [FRO-329](<https://linear.app/front-line-ltd/issue/FRO-329>) · [FRO-332](<https://linear.app/front-line-ltd/issue/FRO-332>) · [FRO-333](<https://linear.app/front-line-ltd/issue/FRO-333>) · [FRO-334](<https://linear.app/front-line-ltd/issue/FRO-334>).

**Available actions layout verification:** Request readiness date, Confirm readiness date, Create supplier invoice and Entry Note are standalone cards directly in their tab. No enclosing Available actions card or duplicate heading remains. Preserve permissions, disabled reasons, readiness dialogs, Supplier Invoice entry behavior, synchronized status-header controls and EN/EL/narrow-screen wrapping. Review annotations stay above the cards and remain preview-only.

## Entry Note action — <issue id="c9ace4d3-c2a3-4858-9b51-aa217a024772" href="https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions">FRO-355</issue>

Add a fourth standalone **Entry Note** action card directly in **Available actions**, after **Create supplier invoice**, using the same card heading/button/availability-reason layout, shared spacing, keyboard access and EN/EL/narrow presentation. Keep the existing readiness and Supplier Invoice cards intact; no outer Available actions card or dropdown.

[FRO-355 — Order Details Entry Note shortcut](<https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions>) **blocks** <issue id="a5003278-baba-4ef4-9f0a-16325f76d319" href="https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign">FRO-326</issue> and owns this action's integration:

* **No current Entry Note:** authorized **Create Entry Note / Δημιουργία Δελτίου Εισόδου** opens <issue id="9c0dee70-4bb0-4e72-8ee1-e3c58fab1bba" href="https://linear.app/front-line-ltd/issue/FRO-353/entry-note-creation-page-ui">FRO-353</issue>'s normal creation page in the same tab with the exact current Order preselected and authorized return context.
* **Current Entry Note exists:** **Open Entry Note / Άνοιγμα Δελτίου Εισόδου** opens that note in <issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue>, including when its Export MRN is recorded. Do not expose duplicate Create or treat absence from active cases as absence of a current note.
* Use <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/customs-warehousing-note-entity-and-business-rules">FRO-319</issue>'s authorized current-note lookup, create/read permissions and uniqueness validation. Missing invoices/Export alone do not disable valid creation. Loading or failed lookup is not proof that no note exists; show suitable availability/error feedback.
* Opening/cancelling creates nothing and changes no Order, invoice or Export. Reuse the normal creation form's discard/failure behavior; refresh Create/Open state on return after successful creation or concurrent changes.
* The shared Order Details preview now includes this new card and its Create/Open examples. The shortcut ticket still supplies production navigation, authorized lookup and preselection; preview buttons remain design-only and create/change no records.

**Acceptance / read-only verification:** inspect a note-less Order and one with a current note, including recorded Export MRN; verify the applicable Create/Open label, exact target/preselection, permission/error states, normal Cancel/return behavior and refreshed state on return. Inspect the fourth card after Create supplier invoice in EN/EL and narrow layouts without disturbing prior actions. Use staging evidence for creation/uniqueness/failure tests; do not submit production creates as verification.

## Entry Note action preview — 19 October 2026

[Shared Order Details UI preview](<https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/?lang=en&access=editor&state=default&entryNote=none>): in **Available actions**, **Entry Note** is the fourth standalone card after **Create supplier invoice**, using exactly the same classes, outlined button, 20px padding, 12px corners and shared spacing/border/highlight behavior. No new Site or production integration was created.

**Create Entry Note** appears with no current note; **Open Entry Note** replaces it when a current note exists. With New additions on, expand **Business rules · preview annotations** and use **Entry Note example** to switch no-note/existing/loading/error fixtures. URL examples: `?entryNote=none|existing|loading|error`; `entryNoteAccess=full|read|denied` exercises separate permission presentation. View-only users can Open an existing readable note without a Create action. Loading has no usable Create button; failed lookup shows Retry. EN/EL labels and <issue id="c9ace4d3-c2a3-4858-9b51-aa217a024772" href="https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions">FRO-355</issue>'s review note are included. These are fictional browser-local states, not authoritative source lookup.

**Preview scope:** like the existing Supplier Invoice action, these buttons display design-only feedback and do not navigate, create or change records. Functional same-tab routing, exact Order preselection, return context, permissions and uniqueness remain <issue id="c9ace4d3-c2a3-4858-9b51-aa217a024772" href="https://linear.app/front-line-ltd/issue/FRO-355/order-details-create-or-open-entry-note-from-available-actions">FRO-355</issue> implementation work. No business/eligibility or dependency change is introduced here.

**Verification:** all inline scripts compile; source checks cover four-card order, Create/Open exclusivity, loading/error and permission guards, and EN/EL labels. Published desktop browser checks verified the fourth card's classes, 20px padding, 12px corners and borders match Create supplier invoice; Create/Open switching and feedback, loading disabled state, error/Retry, and Greek translation. Browser logs include an existing embedded-bootstrap JSON-placeholder error in the unchanged original wrapper; the Order UI and new card still render and respond. No claim of a clean console or new narrow-screen visual verification is made.
