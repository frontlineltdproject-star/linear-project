# Supplier Invoices — searchable list from the main menu

**Supplier Invoices** must be accessible from the main menu through a searchable, paginated list. Staff can find an invoice, open its existing Details page and start authorized creation without first opening an Order.

## List and actions

| Element | Behavior |
| -- | -- |
| Main-menu entry | Opens the Supplier Invoices list using the standard entity-list navigation pattern. |
| Invoice-number search | Trimmed, case-insensitive contains search across the authorized result set, using the existing server contract. |
| List rows | Identify the invoice by number/date and Order; show Supplier, Client, type, VAT exemption status and cancellation state using existing reference labels. |
| Row action | Opens that invoice's existing Details page; retain a usable return to the list. |
| Create | Opens existing standalone Supplier Invoice creation when authorized; retain current Order selection and validation. |
| Pagination | Uses totalElements/totalPages and server pagination. Search resets to a valid page; empty and failed reads remain distinct. |
| Default order | Existing invoice date descending, then ID descending. Include active and cancelled records, with cancellation clearly distinguished. |

## Acceptance criteria

1. An authorized operator can navigate main menu → Supplier Invoices → search by invoice number → Details. Direct list navigation and browser Back remain usable.
2. Results are server-backed and complete across pages; do not search only the first loaded page or silently omit cancelled invoices. Keep the search field's promise limited to invoice number.
3. Show loading, no invoices, no matching results and failed request with Retry. Preserve the search on retry and avoid showing stale results as the response to a newer query.
4. Row references and labels use authorized returned facts; missing optional references do not crash the list. Do not infer relationships from names or expose inaccessible records.
5. Create reuses the existing creation page and permission/eligibility controls; it must not create an invoice simply by opening the page. After success, the saved invoice can be found and opened from the list.
6. Reuse portal table, search, pagination, menu and responsive patterns in EN/EL. Keep long Greek text usable. The list introduces no inline correction, cancellation, bulk VAT operation or new document lifecycle.
7. Verify menu/direct entry, authorized and unauthorized access, multi-page search, cancelled/active records, duplicate display numbers with distinct identities, loading/error/empty/retry, late search responses, Details return and authorized Create navigation.

## Decisions and scope

“Accessible from the main menu” means a usable searchable list leading to Details, with Create where the workflow permits it. Existing Supplier Invoice creation/Details reliability is owned by the consolidated operation ticket.

The initial list needs no new business fields or broad supplier/client/vessel search. Existing server filters can support a later reviewed filter-control design; do not invent new enum values or silently expand search semantics.

## Context for agents

Baseline main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

* `frontline-forwarding-app/src/main/resources/graphql/supplier-invoices.graphqls`: `supplierInvoices(filter,page,size)` returns content/page/size/totalElements/totalPages.
* `domain/supplierinvoices/SupplierInvoiceRepository.java`: invoice-number containment search and date/ID ordering; omitted cancelled filter includes both.
* Existing optional filters are purchaseOrderId, types, VAT statuses and cancelled. They are API capabilities, not a requirement to add every filter control in this scope.
* `frontline-forwarding-client/src/features/supplier-invoices/services/supplier-invoice-service.ts` needs the list read; current routes include new/Details but no list index.
* Existing output already supplies all listed row facts. Reuse its access controls and current reference displays.

## Verification

Use isolated list API/UI cases and navigation checks. Post-deployment verification is read-only: inspect menu, existing list/search/Details and authorization evidence; do not create or modify production invoices.

**Reference:** [Supplier Invoice contract](https://linear.app/front-line-ltd/issue/FRO-321) · [Create page](https://linear.app/front-line-ltd/issue/FRO-347) · [Details page](https://linear.app/front-line-ltd/issue/FRO-348) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e).
