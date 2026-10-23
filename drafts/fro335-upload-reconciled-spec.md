**As an office operator I want Create Order to use the shared stacked-card layout** so that creation and review use consistent field grouping and colli presentation.

**Order = purchase order = stock-list item; colli = handling unit.** This ticket owns the unsaved Create Order page and frontend orchestration. Preserve existing authorization and consume the dependency-owned contracts below.

## Design and preview

Use the live production design system: comfortable density, 20px page title, sentence-case 12px field labels, 40px controls, 8px control corners, 12px cards, 16px dialogs, navy frame and semantic teal actions. Reuse existing components; theme/component code takes precedence over older prototype styling. Coordinate shared structure with [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign) without changing saved Order Details or standalone Edit.

* [Interactive private preview](<https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site>)
* [Design comparison and component mapping](<https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site/design-review.html>)
* [Desktop screenshot](<https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site/comfortable-desktop.png>)
* [Greek mobile screenshot](<https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site/comfortable-greek-mobile.png>)

The Site uses fictional fixtures and simulated outcomes; selected file bytes remain browser-local. It is not evidence of delivered backend contracts. Review controls remain outside the simulated product: EN/EL, blank/example drafts and default/loading/empty/error/pending-upload/unknown-result/unknown-upload. The preview must simulate pending-file staging, atomic creation, rejection/retry and unknown-outcome recovery under FRO-342; partial upload success must not imply an already-created Order. Reconcile the existing simulation before integration while preserving the approved layout. States are available through the visible selector and `?state=<state>`; `?example=1` loads fixtures.

Mark only new compositions: draft colli selection/editing and staged-file/creation-result management. Production contains no preview toolbar, dependency annotations, numbered markers or “New component” badges. The preview governs appearance; this description governs behavior.

## Scope and contract ownership

| Owner | Required contract consumed here |
| -- | -- |
| [FRO-342](https://linear.app/front-line-ltd/issue/FRO-342) — blocks | Private pending uploads, creation context and attempt identity, atomic attachment association, upload/creation recovery, authorization, expiry and cleanup. |
| [FRO-336](https://linear.app/front-line-ltd/issue/FRO-336/order-select-initial-readiness-state-during-creation) — blocks | Three allowed initial states, date/remark validation, atomic creation and readiness audit/journey behavior. |
| [FRO-337](https://linear.app/front-line-ltd/issue/FRO-337/order-invoice-rows-add-unit-price-and-calculate-read-only-total-value) — blocks | Unit price storage and exact server-calculated total, decimal validation and mock-data rollout. |
| [FRO-356](https://linear.app/front-line-ltd/issue/FRO-356/order-and-warehouse-separate-customs-regime-from-physical-location) — blocks | Explicit Customs regime, warehouse capabilities, conditional ΑΛΚ and ΚΤΑ replacement. |
| [FRO-292](https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes) — blocks | Separate Internal/External Notes, visibility, normalization and atomic creation. |
| [FRO-333](https://linear.app/front-line-ltd/issue/FRO-333/order-add-pickup-responsibility-yes-no) — blocks | Independent optional Pickup responsibility: nullable Yes/No, initially unset and clearable. |
| [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po) — blocks | Four independent handling flags and optional DG classification/details. |
| [FRO-329](https://linear.app/front-line-ltd/issue/FRO-329/order-remove-route-and-customs-fields-retain-dn-import-and-dn-export) / [FRO-334](https://linear.app/front-line-ltd/issue/FRO-334/order-remove-collection-agent-field-and-greece-validation-dependency) — block | Retired Order route/MRN/monetary fields and Collection agent, including validators/defaults/payloads. |
| [FRO-295](https://linear.app/front-line-ltd/issue/FRO-295/ordercolli-remove-pcs-field-from-colli) / [FRO-294](https://linear.app/front-line-ltd/issue/FRO-294/ordercolli-remove-notes-from-colli) / [FRO-332](https://linear.app/front-line-ltd/issue/FRO-332/ordercolli-consolidate-import-delivery-note-reference-on-order) — block | Retired colli PCS, Notes and duplicate Import Delivery Note. |
| [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign) — related | Shared stacked-card structure and saved Order Details presentation. |

Dependencies retain their own integration and migrations; they must not wait for this redesign. Do not edit dependency tickets or invent missing API support. Release this page only against delivered compatible contracts. FRO-335 targets 0.0.5 while FRO-342 targets 0.0.8: document a compatible activation sequence without treating milestone order as proof of availability or silently reverting to post-create uploads. This ticket does not change board milestones.

## Page structure and retained inputs

| Area | Required presentation and behavior |
| -- | -- |
| Frame / heading | Existing AppShell with Purchase orders active, existing locale behavior and **Create Order** heading. No invented persisted identity, tracking code or layout caption. |
| Tabs | **Overview → Collis → Invoice rows → Documents**, draft counts, accessible active state and validation indicators. Draft state survives tab unmounting and locale changes. |
| Overview | Stacked **Order details → Notes** cards. No separate Operations or Route & customs tab. |
| Order details | One Order status label/dropdown above the grid. Field sequence: Client, Vessel, Opening warehouse, Supplier, Invoice company, Greece, Pickup, Expected Readiness Date, Owner reference, Supplier reference, Message number, DN Import, DN Export. Then divider → Customs regime/ΑΛΚ → divider → Urgent/urgent information. |
| Notes | Stacked Internal Notes and External Notes inputs; no readiness remark in this card or the permanent grid. |
| Form actions | One page Cancel and primary Create. Local row controls never persist records. |

| Field | Type / rules |
| -- | -- |
| Client / Vessel / Supplier / Invoice company | Existing authorized reference selectors. Client required; Vessel required under the existing client-type rule. Recalculate eligible invoice assignments from client-wide plus selected-vessel assignments. Clear or invalidate stale dependent selections on parent changes; never auto-select an invoice company. |
| Opening warehouse | Required active, authorized physical-warehouse reference selector. It is an editable creation input, not Current warehouse. No regime inference from names. |
| Owner reference | Required String, existing nonblank validation and maximum 255 characters. It is not a unique retry identifier. |
| Supplier reference / DN Import / DN Export | Optional String, maximum 255 characters each; independent meanings. DN Import appears once at Order level. |
| Message number | Optional String, maximum 100 characters. |
| Greece | Existing boolean creation input/default; independent of Pickup. |
| Pickup | Optional nullable Yes/No selector, initially unset; clearing restores unset without coercion to No. |
| Urgent / urgent information | Existing boolean and optional Free text, maximum 1,000 characters; preserve existing semantics. |
| Internal / External Notes | Optional plain text, maximum 2,000 characters each. Apply [FRO-292](https://linear.app/front-line-ltd/issue/FRO-292/ordershipment-internalexternal-notes) trim/blank normalization while preserving line breaks. Internal is staff/system-only; External follows authorized partner visibility, not public visibility. |

No unsaved History, warehouse-stay timeline, split relationships, Parent Balance, saved aggregate flags or Available actions. No readiness email, correction, arrival, split or terminal-disposition commands.

## Initial readiness and Create-time review

| Label | State | Date / review |
| -- | -- | -- |
| Awaiting Readiness Date | PENDING | Default. Date disabled/empty. Submit directly after validation; no readiness remark submitted. |
| Received Readiness Date | EXPECTED_READINESS | Date required; past, today and future permitted. Create opens state-specific review with read-only date and optional remark. |
| Ready at supplier | READY | Date optional. Create opens **Create Order as Ready at supplier?** with explicit readiness confirmation and optional remark. Zero collis is valid. |

Exactly these three options; no blank, later lifecycle or terminal state. Date entry does not change the selected state. Changing away from Ready invalidates its confirmation.

Switching to Awaiting while a date exists opens **Clear date and switch / Keep current status**, naming the date to be removed. Confirm clears that date only; Cancel/Escape keeps the original state/date and all other drafts, then restores focus.

Received and Ready use one **Cancel / Confirm and Create** dialog with optional multiline readiness remark, maximum 1,000 characters. Ready's dialog supplies its explicit confirmation; do not stack a second dialog. Opening, typing and cancelling persist nothing. Cancel/Escape retains all inputs, files and remark and returns focus to Create. Confirm revalidates and submits once. A changed state requires its corresponding review.

Use one atomic create operation through [FRO-336](https://linear.app/front-line-ltd/issue/FRO-336/order-select-initial-readiness-state-during-creation). Do not create PENDING and then call lifecycle transitions. Readiness is not collection, stock entry, arrival, Shipment creation or an email. On confirmed success use the returned state/ID; saved Details follows [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign)'s compact status and eligible actions without a seven-step counter.

## Customs

| Control | Rules |
| -- | -- |
| Customs regime | Required for Greece = Yes. Offer only the selected warehouse's supported values from Ελεύθερη Κυκλοφορία / Τελωνειακή Αποθήκευση / Τελωνειακή Αποταμίευση. Require explicit selection, including a warehouse with one option. |
| ΑΛΚ | Optional digits-only String, maximum 50 characters, preserving leading zeros. Enabled only for Greece = Yes and Τελωνειακή Αποταμίευση; blank is valid at creation. |

Greece = No clears/locks both fields and omits stale values/errors from submission. Returning to Yes requires a fresh explicit regime selection. Until required warehouse capabilities load, prevent invalid submission and distinguish loading, failure and no supported options.

A warehouse change preserves a supported chosen regime. Otherwise retain it as invalid and require a permitted selection; do not silently select another regime or discard entered ΑΛΚ. An incompatible ΑΛΚ requires explicit clearing before Create. Preserve valid drafts through tabs, locale changes and failures. No ΚΤΑ field or warehouse-name inference.

## Collis

Use the shared grey-header table and continuous summary/expanded-row presentation, composed from production primitives. New rows expand; accepted rows collapse after Save and may expand independently. The collapsed summary contains selection, **Colli → Flags → Dimensions → Gross weight → Net weight → Actions**. Selection, expansion and flags are separate controls.

Expanded fields are **Description** and **Package type**, then conditional DG fields. Use standard-height selectors and a resizable multiline DG textarea; no fixed 72px height constraint. Stack expanded fields on narrow screens; confine table scrolling to its container.

| Field | Type / rules |
| -- | -- |
| Identity | Temporary local key; Colli 1, Colli 2… display labels. No permanent tracking identity before server creation. |
| Description | Optional String, maximum 1,000 characters. |
| Package type | Backend enum with existing localized labels; Cardboard box default. |
| Dimensions | Declared cm: all blank or all three positive whole numbers. Preserve invalid raw input for correction. |
| Gross / net | Declared kg. Both may be blank. If either is supplied, gross must be positive; optional net must be nonnegative and no greater than gross. Never derive net. |
| DG / Fragile / Unpacked / Damaged Packing | Independent booleans, default false. Damaged Packing is not terminal DAMAGED status. Flags appear once in the summary. |
| Class of DG | Optional dropdown using [FRO-297](https://linear.app/front-line-ltd/issue/FRO-297/ordercoli-new-colli-flags-in-po) classes 1–9 and localized labels, visible only while DG is checked. |
| UN / DG details | Optional Free text, maximum 200 characters, preserving supplier wording; visible only while DG is checked. |

Unticking DG clears its class/details only. Package enum: PALLET, WOODEN_BOX, FUMIGATED_WOODEN_BOX, SKELETON_WOODEN_BOX, FUMIGATED_SKELETON_WOODEN_BOX, SKELETON_METAL_BOX, CARDBOARD_BOX, METAL_BOX, METAL_CAN, BARREL, PLYWOOD_BOX, PLASTIC_BOX, FUMIGATED_PALLET, ENVELOPE, OTHER. Resolve the narrower handwritten client list against the authorized schema; do not invent options.

| Action | Local behavior |
| -- | -- |
| Add colli | Append a fresh pending row: blank description/dimensions/weights, Cardboard box, false flags; expanded with Save/Cancel. |
| Save | Apply the same row validation as Create. Accept valid values into the draft and collapse; otherwise keep expanded values and a localized error. |
| Cancel | Discard only that pending row, even if it is the only colli; clean its selection/expansion/errors. |
| Add identical | Disabled without selection. Copy each selected row once from its current retained fields into an independent pending row with fresh key, expanded, unselected and no copied errors. No chooser. Never copy retired fields or persisted IDs. |
| Remove | Remove any accepted draft row, including the last; clean associated state. Zero collis is valid in every allowed initial state. |
| Create | Block while any new row still has Save/Cancel. Explain the required action in the validation summary. When Collis is the first invalid tab, activate it and focus the first pending row. Never silently submit or discard pending additions. |

No per-colli PCS, Notes or Import Delivery Note, empty documentation section, saved-row Edit mode, terminal notice or split/disposition footer. No server mutation for local row operations.

## Invoice rows

Nine columns: **Line number → Description → HS code → Quantity → Unit → Unit price → Currency → Total value → Actions**. Shared table styling, immediately editable draft inputs, local Remove and Add invoice row below the table; no saved-row Edit/Save/Cancel.

| Field | Type / rules |
| -- | -- |
| Line number | Derived from draft order, starting at 1; renumber after removal, retain stable local keys. |
| Description / HS code | Required nonblank String max 1,000 / optional String max 100 characters. |
| Quantity | Positive Int within existing 32-bit range; default 1. |
| Unit | PC / SET / PKT with existing translations; default PC. |
| Unit price | Required nonnegative decimal, at most 2 decimal places. Blank is invalid; zero is valid; no invented price default. |
| Currency | Existing authorized country-currency reference list; EUR default when available. Shared by price/total; changing it never converts amounts. |
| Total value | Read-only Quantity × Unit price using exact decimals; invalid/incomplete inputs show —. Price and product must each fit numeric(19,2), maximum 99,999,999,999,999,999.99. Display valid monetary values to 2 decimals. |

[FRO-337](https://linear.app/front-line-ltd/issue/FRO-337/order-invoice-rows-add-unit-price-and-calculate-read-only-total-value) owns authoritative server calculation; no independent client-total write. Preserve empty invoice collections, local Add/Remove and failure/tab/locale retention. No VAT, discount, exchange conversion or invoice issuance. Dependency-owned mock-data rollout and deferred currency-specific rounding do not introduce migration work here.

## Documents and result recovery

Reuse the attachments card, paperclip heading, chooser, supported-file helper and file rows. A new draft has no inherited files. FRO-342 owns the backend; this ticket presents its pending-file and creation outcomes using the existing design.

| Action / state | Behavior |
| -- | -- |
| Choose files | Multiple selection: .pdf, .jpg, .jpeg, .png, .webp, .gif, .doc, .docx, .xls, .xlsx, .csv, .txt. Maximum 25 × 1,024 × 1,024 bytes per file; preserve filename/nonempty validation. Report invalid files individually and retain valid selections for correction or upload. |
| Creation context | Retain one authorized Order creation context and the submission/upload operation identities across tabs, locale changes and recoverable failures. Use context-based creation even with no selected files. No placeholder Order or fabricated permanent ID. |
| Pending files | Show original name, Document/Photo kind, size and selected/uploading/ready/error/unknown feedback. Display server uploader/time only after staging is confirmed. Preserve local File objects while needed for upload recovery and retain returned pending references. |
| Upload / Retry | Upload privately under FRO-342 before creating the Order. Retry or recover the same intended upload with its existing operation identity; do not create another pending file after a lost response. An intentional separate upload has a separate operation identity. |
| Download / Remove | Before completed staging, local download/removal applies. Ready files use authorized pending download/removal. Reconcile in-flight or unknown uploads before treating removal as complete; remove any recovered pending reference through FRO-342. Never invoke permanent attachment deletion for a pending file. |
| Authorization | Current Order creation authority plus internal-identity and PURCHASE_ORDER_EDIT checks govern pending file operations and association. Hide unavailable file operations with an actionable reason. Existing no-file creation authority remains valid; server checks are authoritative. |
| Upload error / expiry | Identify the file and actionable error. Preserve other valid files and the rest of the draft. Retry recoverable failures with the same operation identity; correct invalid files. An expired/removed file requires explicit removal from selection or a fresh valid upload; never silently omit it from Create. |
| Create / readiness review | Show selected filenames/statuses. Prevent final submission while any selected file is invalid, incomplete or unresolved. Link errors to Documents. Include the exact completed references with the reviewed creation inputs in one atomic creation attempt. |
| Confirmed rejection | No Order or permanent attachment association is saved. Retain the draft and valid pending files within their lifetime; permit correction and a new attempt under the same valid context. |
| Unknown create outcome | Show Result unknown and preserve the bound submission and operation identity. Recover or replay that same attempt through FRO-342. Do not submit changed contents, use a new context, or rely on Owner reference/filename search to infer failure. |
| Confirmed success | Retain the returned Order ID and attachment association result, invalidate the list and open Details. Selected files are already ordinary attachments; no second upload phase or partial saved-Order upload result. Close the context to further creation. |
| Navigation failure | Keep confirmed success and the returned ID, with retry/open Details navigation. Never enable Create again or describe navigation failure as failed creation. |

A successful result remains recoverable independently of temporary-file expiry. The context cannot produce another Order, including when no files were selected. Present a failed/unavailable recovery read as unresolved, not as proof of creation failure. Contexts do not promise autosaved form restoration.

After creation, ordinary uploads/downloads/removal retain existing authorized stored-file and owned/inherited rules. FRO-342 owns backend storage, retry and authorization contracts; this UI must not emulate them with create-first/upload-after calls.

## Submission and validation

Validate the entire draft before readiness review. Localized field errors, tab indicators and a summary must identify the exact row/control; open collapsed invalid content, activate the first invalid tab and move focus. Preserve raw invalid input and every other draft value.

Disable duplicate submissions and draft-changing actions while creation is pending or its outcome is unresolved. Bind each attempt to its reviewed inputs and selected pending references. A confirmed rejection permits correction and a new attempt; an unchanged retry uses the same attempt. A recovered success retains the same ID and never repeats creation. Navigation failures cannot turn confirmed creation into failure.

Page Cancel before submission or after confirmed rejection abandons the pending-upload context, discards the local draft and returns to Purchase orders without creating an Order. Pending storage may already exist; invalidation/cleanup follows FRO-342. A failed abandonment request must not be reported as confirmed cleanup; bounded expiry remains the fallback. While a creation outcome is unresolved, reconcile it before treating Cancel as confirmed non-creation. Dialog Cancel/Escape only closes the dialog and retains the draft/files. Browser closure is not proof of failure. After confirmed creation, leaving never rolls back the Order or its attachments. Preserve company scope, warehouse eligibility and server-owned expected-stay, audit and journey behavior.

## Decisions

| Decision | Reason |
| -- | -- |
| Comfortable production density | Match the current app default and real component dimensions. |
| Save/Cancel every pending colli before Create | Make local acceptance explicit; prevent unnoticed submission or loss. |
| Allow removal of the final draft colli | Preserve the valid empty draft without importing saved-record restrictions. |
| Stage files and associate atomically through FRO-342 | Creation succeeds with the selected attachments, or fails without a partial Order. |
| Recover using stable upload and creation identities | Lost responses must not create duplicate files or Orders; corrected inputs follow confirmed rejection. |
| Abandon pending storage separately from business creation | Cancelling a draft may require temporary-file cleanup but must not create or roll back an Order. |

## Acceptance criteria

 1. Production components/tokens, stacked cards, field sequence and four tabs match the approved comfortable design in EN/EL; no prototype controls appear in production.
 2. Required references and dependent invoice eligibility are enforced; stale choices cannot submit. Pickup remains optional/unset/clearable. Retired fields are absent from UI, defaults, validators, copies and payloads.
 3. All three initial states obey date/remark rules; zero-colli Ready succeeds after one explicit confirmation. Date-clear and Create-review Cancel/Escape retain drafts and restore focus.
 4. Customs supports explicit/no-default selection, loading/error/no-options, compatible warehouse changes, invalid incompatible choices and explicit ΑΛΚ clearing; leading zeros survive.
 5. Pending colli rows block Create. Save/Cancel, final removal, independent multiple copies, raw-invalid measurements, DG clearing and 200-character limits behave as specified.
 6. Invoice precision, zero/blank, positive quantity, maximum price/product, exact totals and independent rows work; no currency conversion or total override.
 7. Valid/invalid selection, local and pending download/removal, upload progress/error/expiry and File/reference retention work. Incomplete or unresolved selected files block submission. Creation atomically associates exactly the selected attachments; there is no post-create upload phase.
 8. Confirmed rejection permits correction; uncertain upload/creation responses recover the same operation; repeated clicks, no-file attempts, temporary expiry and failed Details navigation cannot duplicate a confirmed Order or upload. Cancel/abandonment and browser closure preserve truthful outcomes and cleanup behavior.
 9. Notes/readiness remarks remain distinct, with their limits and visibility. Tabs/locale changes preserve values, row state and files.
10. Keyboard operation, labels, errors/focus and desktop/\~400px layouts are usable without page overflow. Shared changes preserve standalone Edit and saved-Order operations/permissions.

Exercise mutation, authorization, response-loss, retry and audit cases only in an isolated test environment.

## Context for agents

UI baseline: Frontline-Forwarding/frontline-forwarding main 3820e89e8caa341261e2d48bcb282d93e1bb1d03, checked 22 October 2026 through authenticated gh. Attachment/creation integration reviewed at main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a on 23 October 2026; FRO-342 owns the required new backend contracts.

| Source | Relevant fact |
| -- | -- |
| frontline-forwarding-client/DESIGN.md; src/styles/theme.css; components/layout/app-shell.tsx and top-bar.tsx | Authoritative frame, typography, tokens and current comfortable density. |
| Client components/ui/{card,tabs,input,select,combobox,choice,button,modal,table,feedback}.tsx; components/form/{select-field,date-field}.tsx | Reuse actual primitives/wrappers and accessibility behavior. Tab panels unmount; keep draft state above them. |
| Client routes/secured/purchase-orders/new.tsx | Create/loading/error/list invalidation/navigation. Separate mutation success from navigation failure. |
| Client features/purchase-orders/components/purchase-order-form.tsx; purchase-order-form-validation.ts; purchase-order-invoice-options.ts | Existing inputs, reference eligibility, validation, row defaults and shared Edit consumers. |
| Client features/purchase-orders/services/purchase-order-service.ts; hooks/use-purchase-orders.ts | Authorized create mapping and mutation. |
| App src/main/resources/graphql/purchase-orders.graphqls; [PurchaseOrderRequestValidator.java](<http://PurchaseOrderRequestValidator.java>); [PurchaseOrdersApiService.java](<http://PurchaseOrdersApiService.java>) | Create inputs, package enum, measurements/limits, empty collections and fresh server identities. Owner reference is not unique; no caller idempotency key. Java service paths are under src/main/java/com/frontline/forwarding/web/purchaseorders/service/. |
| Client features/attachments/components/attachment-panel.tsx; services/attachment-service.ts; app web/attachments/service/AttachmentsApiService.java; docs/workflows/attachments.md | Separate post-create upload, size/type rules, EDIT/internal authority and fresh attachment identities without upload deduplication. |
| docs/reference/database.md; graphql-api.md; docs/workflows/purchase-order-colli-journey.md; docs/architecture/authorization.md | Storage/API/lifecycle/authorization facts; dependency tickets own their agreed additions. |

The baseline lacks the target initial-state, Unit price, split Notes, independent Pickup, customs-capability, new-flag and pending-upload/creation-recovery contracts, and still validates Collection agent. Do not ship fake integration, silently omit target inputs, change generated APIs/backend code in a UI-only branch, or emulate atomic creation with later transitions. This ticket's full integration remains blocked until its contracts are delivered.

Affected implementation is frontline-forwarding-client. Existing purchase_order/handling-unit/invoice-row/attachment persistence is consumed through authorized contracts. Backend schema, migrations, calculations, saved-Order redesign, readiness emails, Shipment workflows, document issuance, split/history and standalone Edit retirement are out of scope.

## Post-deployment verification

Read-only checks only. Use existing authorized records and test evidence; never create an Order, upload, edit or send email in production. Report unavailable evidence explicitly.

| Criteria | Read-only check |
| -- | -- |
| 1, 10 | Open Create Order without submitting; inspect EN/EL, four tabs, field order, comfortable styles, keyboard focus and desktop/\~400px layout. Confirm no review toolbar/markers. |
| 2, 4 | Read reference options/capabilities through existing authorized queries and compare visible choices/required markers. Inspect blank Pickup, disabled initial date and customs behavior without submitting. |
| 3, 8 | Read existing PENDING/EXPECTED_READINESS/READY Orders and their date/remark/audit evidence; compare saved Details to returned state. Review isolated response-loss/navigation-failure test results. |
| 5, 6 | Inspect existing authorized colli/invoice records against displayed fields, dimensions/weights, flags and decimal totals. Review isolated Save/Cancel/copy/empty/boundary tests; do not mutate production rows. |
| 7, 8 | Read an existing Order's authorized attachments/metadata and compare with selected-file and atomic-association evidence. Inspect isolated upload/creation response-loss, rejection/correction, no-file retry, expiry, abandonment and navigation-failure tests proving one retained Order ID and one pending file per upload operation. No production upload/retry or abandonment. |
| 9 | Read existing records using authorized staff and partner test identities and compare permitted note visibility. Review isolated limit/normalization/draft-retention tests. |
| 10 | Open existing Details and standalone Edit without saving; compare preserved features and permission behavior against regression evidence. |

**Reference:** Live production sources above; [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326/order-details-page-redesign) shared Details specification; dependency ownership table; private [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335/order-creation-page-redesign) Site.

*[Archived preview — version 23 (19 October 2026)](<https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site/archive/v23/>) — reference only; superseded by the current preview.*
