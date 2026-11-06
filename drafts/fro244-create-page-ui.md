**As a Front Line operator or manager, I want to create a Shipment Invoice draft from selected Shipment goods so that I can prepare the document before review and finalization.**

Use **layout A — stacked cards**: Shipment, document details, parties, goods, packing and notes, with Cancel and Create draft actions. Support standalone creation and Create Invoice from a Shipment, with that Shipment preselected. Order means purchase order / stock-list item; colli means handling unit.

## Fields

Only **Shipment** is required to save an otherwise valid draft. Do not apply finalization-required fields on this page.

| Field | Type / format | Behavior |
| --- | --- | --- |
| Shipment | Searchable reference | Select one non-cancelled Shipment, including departed or arrived Shipments. Standalone entry starts blank. |
| Client | Reference choice | Automatically select the common commercial Client; for multiple represented Clients, ask staff to choose one. |
| Invoicing company | Reference choice, scoped to Client | Choose a company belonging to the selected Client. Changing Client clears an incompatible company. Company selection must not filter eligible goods. |
| Invoice type | Invoice / Commercial Invoice / Pro-forma Invoice / Shipping Invoice | Default Invoice; editable. |
| Document date | Date, dd-mm-yyyy | Default today in Europe/Athens; editable. |
| Subtitle | Optional text | Default PACKING LIST; may be cleared. |
| Shipper | Multiline text | Initially FRONT LINE, 67, IROON POLYTECHNIOU, 185 36, PIRAEUS, GREECE. Company selection prefills its invoice details. |
| Consignee / Agent / Notify | Multiline text | Manual document text; initially blank. |
| Packing details / total weight | Multiline text / kg | Manual, initially blank; describe selected goods rather than automatically copying whole-Shipment totals. |
| Full invoice total | Read-only money and currency | Sum selected eligible row amounts in one currency. No currency conversion. |
| Partial invoice total | Optional manual money and reference currency | Initially blank amount and EUR currency. Use the supported currency reference data; HTML sample options are not the option-list contract. |
| Notes | Optional multiline text | Initially blank. |
| Printed number | Read-only explanatory text | Assigned at finalization. Create draft consumes no printed number. |

## Goods selection and refresh

- Initially select no Orders or rows. Selecting an Order includes all its eligible rows; allow individual deselection. Put the most recently selected Order group above earlier groups and preserve source line order within each group.
- Retain source Order and row identities. Display description, optional HS code, Order reference, quantity, unit, line amount and currency. Include Stock List ID, Client, Supplier, MSG Number, Country of Origin, Destination and Status as Order context.
- Consume FRO-244 eligibility and FRO-301 allocation. Never derive partial-shipment quantities or values from full copied child-Order rows. Goods may span Clients and invoicing companies.
- Show unresolved allocation rows separately and disabled, with the reason. Open the relevant Order allocation interface in a new tab; allocation is not edited here.
- **Refresh eligibility** preserves document fields and still-eligible selections, updates their current values and total, and offers newly eligible rows unselected. Remove unavailable rows from the active selection and visibly identify what was removed for review. Preserve FRO-244's review requirement before finalization.
- Keep mixed-currency selections visible, explain the conflict, suppress the combined total and disable Create draft until the selection uses one currency. Do not silently deselect rows.
- If another Shipment Invoice on this Shipment includes a selected source row, identify that invoice in a warning and allow creation to proceed.

## Form safeguards and submission

| Action | Required behavior |
| --- | --- |
| Change invoicing company | Replace untouched Shipper prefill automatically. If Shipper was edited, offer **Replace with company details** or **Keep my text**. |
| Change Shipment | If work would be lost, confirm first. Cancel preserves everything. Confirm clears selections, Client/company, party text, packing, weight, partial amount and notes, then applies normal defaults for the new Shipment. |
| Cancel / navigate away | Confirm before discarding changes. Return to the originating Shipment, otherwise the previous page with Shipments-list fallback. Use the browser's unsaved-change warning for reload/close. |
| Create draft | Submit selected source identities and document fields through FRO-244's authorized draft operation. Disable repeated submission while pending. On failure retain inputs and show an actionable error; do not show success. On success open the saved Shipment Invoice Details page using the returned identity. |
| Loading / empty / failure | Distinguish pending reads, no eligible results and failed reads; provide retry for failures. Do not submit an unresolved or ineligible Shipment or treat failed eligibility reads as an empty valid selection. |

## Design and developer handoff

The issue Resources contain **shipment-invoice-create.html**, the self-contained preview, plus **component-map.md** and desktop/mobile screenshots. Download the HTML and open it locally; no install, credentials or server is needed. **A is the approved layout. B is a comparison only and must not be implemented.** EN/EL and the visible scenario selector cover default, loading, empty, error, mixed currency, overlap and stale selection.

The preview is fixture-only: its save, navigation and allocation actions are simulations. Native select/date controls and fallback fonts approximate the portal components. The HTML governs the approved layout; this description governs behavior. Scenario controls, design annotations and fixture data do not belong in the operational page. No hosted preview is required for this handoff.

Implement using the live portal design system and real components listed in the component map. New compositions are the searchable Shipment picker, grouped goods selection and totals display. Preserve keyboard access, visible focus, readable error messages and EN/EL labels at desktop and approximately 400px without clipped content.

Prepare and verify a frontend-only mock handoff under AGENTS.md step 4e. Use the new UI issue identifier in its mock branch name. Branch creation/publication requires the reviewed diff, passing checks and explicit approval. A mock must clearly identify unavailable integrations and must not present fixtures as a working backend.

## Dependencies and boundaries

| Area | Owner / activation requirement |
| --- | --- |
| Draft persistence, authorization, eligibility, current row values, overlap information and authoritative validation | FRO-244. Agree the concrete read/write contract before integration; do not invent operation names. |
| Allocation and partial-shipment quantities/values | FRO-301, using the existing child-Order model. |
| Saved-invoice Details route and review/finalization | Separate UI ticket still required before activating the successful-save destination. |
| Order allocation interface and navigation target | Separate UI ticket still required before activating the allocation action. |
| Create page and its entry wiring | This ticket; standalone entry must not imply delivery of a full invoice register. |

Out of scope: invoice list/register, saved-draft editing, finalization/numbering UI, cancellation/replacement UI, printing/PDF, discounts, backend/schema/migration changes and independent colli movements. FRO-362 is not a dependency; FRO-302 remains unchanged.

## Decisions

| Decision | Reason |
| --- | --- |
| Create draft only, then Details | Separate preparation from issuance and printed numbering. |
| No initial goods selection | Avoid silently declaring the whole load. |
| Invoice / today / PACKING LIST / EUR defaults; manual packing and weight | Reduce routine entry without assuming the selected physical subset. |
| Guard Shipper and Shipment changes; confirm dirty exits | Preserve operator-entered work. |
| Visible mixed-currency conflict blocks save | Avoid an invalid combined total without hiding selections. |
| Allocation in another tab, explicit refresh | Keep allocation ownership on the Order and retain the document being prepared. |

## Context for agents

Production main verified at 5774931b9869247f0247013111a452552403f456. The Shipment Invoice contract is planned work, not an existing implementation at this baseline.

- In frontline-forwarding-app, domain/purchaseorders/PurchaseOrderParties.java distinguishes clientCompanyId and invoiceCompanyId. domain/shipments/ShipmentPurchaseOrderParticipation.java records Shipment/Order membership.
- domain/purchaseorders/PurchaseOrderInvoiceRowRepository.java reads freight_purchase_order_invoice_row: id, purchase_order_id, line_number, description, hs_code, quantity, unit, total_amount and currency. Its copyTo copies full quantities and values; copied rows alone do not prove partial-shipment eligibility. FRO-301 supplies that contract.
- Read docs/reference/database.md and docs/reference/graphql-api.md alongside FRO-244/FRO-301 before integration. Backend eligibility and amount calculations remain owned by those structural tickets; this UI consumes their results.
- In frontline-forwarding-client, follow DESIGN.md, src/styles/theme.css, components/ui primitives and components/form controls. Reuse layout/app-shell.tsx, side-bar.tsx and top-bar.tsx; see the attached component map for exact src paths and compositions.

## Acceptance criteria and post-deployment verification

Production verification is read-only. Use controlled test evidence for submission and discard behavior, not production writes.

| Acceptance criterion | Read-only verification |
| --- | --- |
| Both entry paths, eligible Shipment selection, defaults and Client/company choices follow Fields. | Open each entry path without saving; compare preselection/defaults and options with single-Client, mixed-Client and arrived Shipment fixtures. |
| Order/row selection, ordering, allocation exclusions, refresh, overlap and currency rules follow Goods selection. | Inspect controlled UI-test results and fixture responses for each case; compare displayed source identities, quantities, amounts and totals. |
| Shipper replacement, Shipment reset and unsaved exits protect entered work. | Review interaction-test results for accept/cancel/keep/replace paths and unchanged-field assertions. |
| Draft creation accepts incomplete document fields, allocates no printed number and opens the saved Details page; failures preserve inputs. | Read a test-created draft and inspect submission success/failure/repeated-click test results. Confirm the returned identity matches the Details read. |
| Staff-only access, EN/EL, keyboard operation and desktop/mobile states work. | Inspect permitted/denied read results and UI test evidence; open the page in both languages and widths without submitting. |
| HTML, component map and screenshots are downloadable; activation dependencies are resolved before rollout. | Download and open the issue Resources; inspect linked dependency delivery and verified frontend handoff evidence. |

**Reference:** FRO-244, FRO-301; approved layout A in the attached HTML; production source at https://github.com/Frontline-Forwarding/frontline-forwarding/tree/5774931b9869247f0247013111a452552403f456.
