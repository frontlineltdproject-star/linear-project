**As a Front Line operator or manager, I want to review and edit a Shipment Invoice draft, finalize it and follow corrections so that the saved document accurately describes the selected Shipment goods.**

Deliver **Shipment Invoice Details with a draft edit mode**, using the approved stacked cards: document, parties, goods and totals, packing and notes. This is the saved-record destination for FRO-363. Show draft identity or printed number, lifecycle state, creation/last-update information, Shipment link and permitted actions. Order means purchase order / stock-list item; colli means physical handling unit.

## Fields and editing

Load saved document fields without reapplying creation defaults. Drafts use current source rows; finalized and cancelled invoices display their frozen contents. Display dates as **dd-mm-yyyy** and N/A for a record never updated.

| Field | Type / format | Rule |
| --- | --- | --- |
| Internal ID / printed number | Read-only identity / integer | Drafts have an internal ID and no printed number. Use the persisted identity and number; never generate either in the UI. |
| Shipment | Read-only reference after creation | Keep the saved Shipment locked. Correct a wrong Shipment by discarding the draft and creating another. Departed or arrived Shipments remain eligible under FRO-244; cancelled Shipments do not. |
| Client / invoicing company | Reference choices | Client must be represented on the Shipment; company must belong to that Client. Clear an incompatible company when Client changes. Do not filter goods by these choices. |
| Invoice type | Invoice / Commercial Invoice / Pro-forma Invoice / Shipping Invoice | Editable in draft mode. |
| Document date / subtitle | Date / optional text | Preserve saved values. Subtitle may be blank. |
| Shipper / Consignee / Agent / Notify | Multiline document text | Editable in draft mode. Changing company replaces untouched Shipper prefill; if edited, offer **Replace with company details** or **Keep my text**. Do not alter company master data. |
| Packing details / total weight | Multiline text / kg | Manual values for the selected goods, not automatic whole-Shipment totals. |
| Full invoice total | Read-only money and currency | Use the authoritative sum of included eligible source-row amounts in one currency. No conversion. |
| Partial invoice total | Optional manual money and reference currency | Preserve saved amount/currency. Use supported currency reference data, not the preview's sample options. |
| Notes | Optional multiline text | Editable in draft mode. |
| Cancellation reason / correction links | Read-only reason / record references | Show on the cancelled original and link original/replacement records in both directions where applicable. |

**Save changes** saves an otherwise valid, potentially incomplete draft and returns to Details. Do not enforce finalization-required fields at draft save. Mixed-currency selection blocks save, remains visible and suppresses the combined total. **Cancel editing** returns to saved Details, confirming before discarding unsaved input. Saving does not allocate a printed number.

## Goods, refresh and review

- Display source Order and row identity, description, optional HS code, quantity, unit, line amount and currency. Preserve the source unit. Include Stock List ID, Client, Supplier, MSG Number, Country of Origin, Destination and Status as Order context.
- Preserve saved selection and ordering on open. Selecting another Order includes all its eligible rows, places its group above earlier groups and preserves line order within the group. Allow individual deselection. Quantities, amounts and allocation are not edited here.
- Consume FRO-244 eligibility and FRO-301 whole-row allocation under the existing child-Order model. Full copied child rows do not prove which quantities or values travelled. Goods may span Clients and invoicing companies.
- Show unresolved allocation separately, disabled with its reason. Open the relevant Order allocation interface in a new tab. Return and use **Refresh goods**; this page never writes allocation.
- Refresh current goods on draft opening and explicitly through **Refresh goods**. Preserve document fields and still-eligible selections, update quantities/values and the full total, and leave newly eligible rows unselected. Exclude unavailable rows from active totals and finalization; retain an identified removal/ineligibility warning until staff resolve and acknowledge the selection.
- Show affected goods and document checks together in a **Review before finalizing** panel. Identify changed source values and unavailable selections. For replacements, also highlight copied packing, weight and partial amount for checking. **Confirm reviewed** acknowledges the resolved selection and checked values. Save unfinished work if otherwise valid, but block finalization until review is complete and saved.
- Further relevant changes to selected goods, source values/eligibility, allocation coverage or checked packing/weight/partial amount require renewed review. The backend contract must associate acknowledgement with the reviewed document/source state and reject stale acknowledgement at finalization; a browser-only flag is insufficient. Exact storage and operation shapes must be agreed before integration.
- If another Shipment Invoice on the same Shipment includes a selected source row, identify that invoice in a warning and allow staff to continue. Do not count this invoice as its own overlap.

## Lifecycle actions

| Action | Required behavior |
| --- | --- |
| Finalize | Available from saved draft Details after edits are saved or cancelled. Show actionable missing-field/selection/review errors. Otherwise open a confirmation with Shipment, Client/company, selected goods and total, explaining number assignment and freezing. Confirm through FRO-244's authorized operation. |
| Finalization validation | Require Client, its invoicing company, invoice type, date, Shipper, Consignee, Agent, packing details, weight and at least one eligible selected row in one currency. Notify, Notes, subtitle and partial total are optional. Recheck Shipment eligibility, current source selection and review state. |
| Finalization success | Display the returned printed number and frozen document fields, party text, selected row identities/values, packing, weight and base totals. Source changes cannot rewrite this record. No edit or live-source refresh controls apply to frozen contents. |
| Discard draft | Separate from Cancel editing. Confirm with draft identity and Shipment. On confirmed successful discard, navigate to Shipment Details. |
| Cancel finalized invoice | Managers/system administrators only, as authorized by FRO-244. Require a reason and explicit confirmation. Retain number, Shipment link and frozen contents; display the recorded reason. Cancellation does not automatically create a replacement. |
| Create replacement | On a cancelled invoice, authorized draft creators open a prefilled, unsaved replacement form. Keep the same locked Shipment and link to the original. Persist only through **Create draft**; cancelling creates nothing and returns to the original. |

**Replacement prefill:** copy document fields, party text, Client/company, notes, packing, weight and partial amount/currency; default document date to today in Europe/Athens. Carry forward still-eligible source-row selections in their existing order using current values, not frozen original values. Flag unavailable rows and invalid current references for review without silently substituting other choices. Offer additional eligible rows unselected. Apply the same company safeguards, currency rules, review requirements and dirty-exit protection. Saving opens replacement Details with its own internal identity and no printed number. Its finalization allocates its own number. The original's number and frozen contents remain unchanged.

## Concurrency, failures and navigation

- Staff-only access applies to direct Details reads, Shipment lookups and actions. Show permitted actions from authoritative capabilities; hidden buttons alone do not enforce authorization.
- If another user edits, finalizes, discards or cancels the record, block overwriting the newer state. Preserve local input for comparison/copying, explain the conflict and offer to reload the latest record with discard confirmation. Never silently merge or keep a finalized/cancelled record writable. If the record no longer exists, explain this and provide Shipment navigation.
- Disable repeated actions while requests are pending. On failure retain input and show an actionable error without claiming success. Resolve an uncertain result against authoritative state before repeating a consequential action; backend retries must not create duplicate replacements or allocate another number.
- Distinguish loading, empty goods, failed reads, validation failures and conflicts. Failed eligibility reads do not mean a valid empty selection; preserve work and block dependent actions until successful refresh.
- Protect changed forms when navigating away, following Shipment/correction links or using browser Back. Use the browser's unsaved-change warning for reload/close. Save returns to this record's Details; successful replacement creation opens the returned replacement identity. A navigation failure after a successful save must allow reopening that identity without another creation request.

## Design and downloadable preview

The issue Resources contain **shipment-invoice-details.html**, **component-map.md**, **desktop.png** and **mobile.png**. Download the HTML and open it directly; no install, credentials, server or companion files are required. Use the visible EN/EL and scenario selectors to inspect draft/edit, source changes, mixed currencies, overlap, incomplete draft, finalized, cancelled, replacement, conflict, save failure, loading, empty and load-error states.

The approved direction is **stacked cards**, consistent with FRO-363. Reuse the live portal components and tokens named in the component map. New compositions are the goods/totals presentation, review panel and correction links. Provide keyboard access, visible focus, accessible confirmations, readable errors and EN/EL layouts at desktop and approximately 400px without clipped controls.

The HTML governs layout; this description governs behavior. Its data, numbering, roles and actions are simulations, and native controls/font fallbacks approximate the portal. Scenario controls, business-note markers and fixture data do not belong in the operational UI. No hosted preview is required. The offline preview was checked across 56 viewport/language/scenario combinations with zero page errors, external requests or document overflow, plus lifecycle and input-retention interactions. These checks do not prove production integration.

## Dependencies and boundaries

| Area | Owner / activation requirement |
| --- | --- |
| Details route, draft editing, action presentation, review/conflict UI and correction navigation | This ticket. Provide the saved-record destination required by FRO-363. |
| Persistence, authorization, current/frozen reads, eligibility, totals, overlap, discard, finalization/numbering, cancellation and linked replacement | FRO-244. Integrate only after its concrete contracts are available. |
| Review acknowledgement/invalidation, expected-version conflict detection and safe retries | Required backend contracts in the FRO-244 integration. Agree their implementation and verify stale-source/concurrent cases before activation; this frontend ticket does not implement persistence or invent APIs. |
| Whole-row allocation, original source identity, split eligibility and affected-document signals | FRO-301. Preserve its existing child-Order model and commercial-edit restrictions. |
| Ordinary creation and successful-save callback | FRO-363. This ticket supplies Details and replacement orchestration; reuse suitable form pieces without changing ordinary creation defaults or allowing a saved invoice's Shipment to change. |
| Order allocation destination | Separate Order allocation UI delivery. Resolve its actual navigation target before activating the action; no route is guessed. |
| Shipment cancellation and historical/frozen records | Preserve FRO-244's guard requiring linked drafts to be discarded and finalized invoices cancelled first, including concurrent operations. This page resolves invoice records; it does not cancel Shipments. |

Out of scope: invoice register/list, ordinary create-page redesign, printing/PDF/discount controls, allocation editing, commercial source-row editing, backend/schema/migrations, historical invoice import and independent colli movements. Existing-row allocation migration and the first live printed number remain FRO-301/FRO-244 activation inputs. Production frontend implementation or branch publication requires separate authorization under the project's AGENTS.md.

## Decisions

| Decision | Reason |
| --- | --- |
| Details with draft edit mode and shared stacked cards | Give creation a saved-record destination and keep preparation/review consistent. |
| Lock Shipment after first save | Avoid transferring saved goods and document details onto another movement. |
| Explicit save; separate finalization | Preserve unfinished preparation without issuing a numbered document. |
| Visible source review and conflict handling | Prevent stale goods or another user's work from being silently overwritten. |
| Cancellation followed by an explicitly created linked replacement | Preserve issued history and allow review before creating the correction. |
| Current replacement source values with copied manual fields flagged | Retain useful entry work while requiring checks against the corrected goods. |

## Context for agents

Production main checked at `5774931b9869247f0247013111a452552403f456`. Shipment Invoice remains planned functionality at this baseline; do not infer an API from the HTML or presentation types.

- Read `docs/reference/database.md`, `docs/reference/graphql-api.md`, `docs/architecture/authorization.md` and `docs/workflows/purchase-order-colli-journey.md` with FRO-244/FRO-301. Existing source rows use `freight_purchase_order_invoice_row`: source identity, line order, description, HS code, quantity, unit, total amount and currency. Units are PC, SET or PKT; render the returned value.
- In `frontline-forwarding-app`, `PurchaseOrderParties.java` distinguishes Client/company; `ShipmentPurchaseOrderParticipation.java` establishes Shipment/Order membership. `PurchaseOrderInvoiceRowRepository.copyTo` copies full quantities and values, called by both Shipment partial-child creation and deliberate Order splitting. Allocation eligibility must come from FRO-301.
- Follow the existing Shipment cancellation service path for preservation of lifecycle guards. Delivery-note expected-version/status-guarded updates are a concurrency precedent, not a Shipment Invoice API contract.
- FRO-363's published mock at commit `230a90581aa85e611737add554b2b3c6f5912e0e` is unmounted and not a deployed API. Read `frontline-forwarding-client/src/features/shipment-invoices/create/README.md` and `types.ts`: the host provides authorized data, evaluated totals, navigation guards and `onSaved(id)`. Wire that returned identity to Details. Reuse its document/goods components where suitable; replacement-prefill support must be explicit rather than mounting the ordinary blank create flow unchanged.
- Follow live `frontline-forwarding-client/DESIGN.md`, `src/styles/theme.css`, UI primitives and existing app shell. The attached component map documents standalone approximations.

## Acceptance criteria and post-deployment verification

Production verification is read-only. Use controlled test evidence for saves, finalization, discard, cancellation and replacement; do not submit those actions in production.

| Acceptance criterion | Read-only verification |
| --- | --- |
| Creation opens saved Details; fields, identity, timestamps, state and Shipment link are accurate. | Open a test-created record by returned identity; compare with the authorized read and FRO-363 navigation-test evidence. |
| Draft edits preserve saved values, lock Shipment, protect Shipper text and support incomplete saves while blocking mixed currencies. | Inspect interaction results for company/Client changes, incomplete drafts, mixed currencies and save/cancel; compare the resulting test record. |
| Source changes, unavailable rows, new candidates, allocation exclusions, ordering and overlap behave as specified. | Compare controlled before/after row IDs, source values, selection order, warning references and authoritative totals. |
| Review is saved for the reviewed state and invalidated by further relevant changes. | Inspect source/selection/packing change tests and read saved review results; verify stale acknowledgement cannot finalize. |
| Finalization validates, confirms and freezes one numbered document without duplicate issuance. | Read finalized fixtures after source changes; inspect missing-field, concurrent, failed and repeated-finalization test results. |
| Draft discard is distinct from cancelling edits; cancellation preserves history and requires the authorized role and reason. | Read cancellation fixtures and review discard, empty-reason, denied-role and Shipment-guard tests. |
| Replacement starts unsaved, copies specified fields, uses current eligible rows and links both ways without altering original contents. | Inspect cancelled-form/no-create evidence; compare original and replacement fixtures, dates, identities, rows and printed numbers. |
| Concurrent changes, failed reads/saves, uncertain results and dirty navigation preserve work and prevent unsafe repetition. | Review controlled conflict/retry/navigation tests, including another user's finalization and record removal. |
| EN/EL, keyboard and desktop/mobile states work; staff-only direct access is enforced. | Open permitted test views without saving; inspect keyboard/responsive evidence and denied direct-read/action results. |
| Preview resources open offline and activation dependencies are satisfied. | Download the HTML/component map/screenshots; inspect linked backend, allocation-navigation and Details/create integration evidence before rollout. |

**Reference:** FRO-244; FRO-301; FRO-363; approved downloadable Shipment Invoice Details/edit preview; [production baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/5774931b9869247f0247013111a452552403f456); [FRO-363 integration guide](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/230a90581aa85e611737add554b2b3c6f5912e0e/frontline-forwarding-client/src/features/shipment-invoices/create/README.md).
