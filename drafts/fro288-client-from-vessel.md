**Allow an Order to select a Vessel and then choose only from that Vessel's Clients.** A Vessel can belong to multiple Clients, while each Order records one Client and, when applicable, one Vessel.

**Order = purchase order = stock-list item.** Client membership and invoicing-company assignments are separate relationships.

## Selection rules

Apply these rules during Order creation, using the existing selectors.

| Field | Type | Rules |
| -- | -- | -- |
| **Client** | Required dropdown (authorized active Client reference data; entity ID) | Without a Vessel, offer eligible Clients. With a Vessel, offer only its eligible associated Clients. Retain an already selected eligible Client; otherwise auto-select the sole eligible Client or require an explicit choice when several remain. Never select an arbitrary Client. |
| **Vessel** | Dropdown (authorized Vessel reference data; entity ID) | Allow selection before Client. With a Client selected, offer only its associated Vessels. Preserve conditional requiredness: Vessel is required when the selected Client has Vessels; Clients without Vessels retain the no-vessel path. |
| **Invoice company** | Optional dropdown (eligible invoicing-company reference data; entity ID) | After Client selection, offer that Client's active invoicing companies assigned either client-wide or specifically to the selected Vessel. Deduplicate by company ID. No automatic invoice-company selection is introduced. |

Support both **Client → Vessel** and **Vessel → Client**. Keep the existing field layout; selection order does not require rearranging controls.

When a selection is changed or cleared, recompute dependent choices. Retain compatible values and clear only incompatible dependent selections, explaining which fields need attention. Apply the sole-Client rule after a Vessel change. Preserve all unrelated Order inputs.

With no Client, Invoice company has no selectable options. With a selected Vessel but no eligible Clients, leave Client empty, explain the missing eligible association and prevent creation. Distinguish empty results from loading or failure; do not expose unfiltered fallback choices or clear selections merely because a request failed. Ignore stale lookup responses after a newer selection.

## Shared Vessel relationships

- Support multiple Client associations for the same permanent Vessel identity across persistence, reference reads, authorized maintenance and Order validation. Do not duplicate a Vessel to represent each Client.
- Existing company/vessel maintenance must allow authorized association with an existing Vessel. Removing a Vessel from one Client removes that association only; it must not delete the Vessel, other Client associations or historical references.
- Preserve authorization and company-scope checks. A shared association does not grant access to another Client or its Orders. Vessel-first reads must return only authorized Vessels and eligible associated Clients.
- Migrate each existing Vessel's Client relationship while retaining its Vessel ID and existing references. Do not merge records by matching vessel names or infer additional associations.
- Later association changes affect eligibility for new selections. They must not rewrite saved Orders' Client/Vessel values or make those historical values disappear.

## Validation and saved Orders

The server must enforce the same Client–Vessel membership and Invoice company eligibility on every supported Order creation path, including direct API consumers. Validate against current reference data at submission; reject stale or unauthorized combinations without creating a partial Order, and retain the user's draft for correction.

Preserve existing active-Client, active Invoice company, conditional Vessel and permission rules. Invoice assignments do not establish Client–Vessel membership.

Saved Order **Client** and **Vessel** remain immutable. This feature does not introduce a historical reassignment action or rewrite an Order when its reference associations change. Preserve existing saved-Order editing and document protections.

## Presentation and scope

FRO-288 owns the shared-Vessel relationship, safe association maintenance, selection behavior and server validation.

FRO-335 owns Create Order presentation and consumes the bidirectional selection rules above. FRO-326 owns saved Order presentation and retains read-only Client/Vessel. Reuse their existing controls and layouts; no separate canvas, preview or new page is required. Reuse FRO-273's client-wide-or-selected-vessel Invoice company eligibility.

**Out of scope:** changing Invoice company requiredness, automatic invoice-company selection, merging duplicate Vessel records, changing saved Order Client/Vessel, changing fiscal documents, or granting new permissions.

## Decisions

| Decision | Reason |
| -- | -- |
| Support both selection orders during creation. | Operators may know either Client or Vessel first. |
| Auto-select only the sole eligible Client; preserve a valid existing choice. | Avoid unnecessary input without guessing between Clients. |
| Retain valid selections and clear incompatible dependants. | Prevent stale combinations without losing unrelated work. |
| Include shared-Vessel data/API and maintenance support in this ticket. | Selection filtering requires a real multi-client relationship. |
| Preserve identities, existing links and historical Orders. | Relationship maintenance must not alter recorded business facts. |

## Acceptance criteria

1. The same Vessel can be associated with multiple Clients without duplication. Removing one association leaves the Vessel, other associations and saved Order references intact.
2. Client-first creation offers that Client's Vessels; Vessel-first creation offers only that Vessel's authorized eligible Clients. No other Client is selectable for it.
3. A sole eligible Client is auto-selected. Multiple eligible Clients require a choice unless the current Client remains valid. Zero eligible Clients blocks creation for that Vessel.
4. Selection changes retain compatible Client/Vessel/Invoice company values, clear incompatible dependants and preserve unrelated inputs. Invoice options include eligible client-wide and selected-Vessel assignments only, without duplicates.
5. Clients without Vessels retain the existing no-vessel path. Invoice company remains optional.
6. Loading, empty, failed and stale lookups cannot expose invalid choices or overwrite newer selections. Server-side validation rejects stale/unauthorized combinations atomically through all creation interfaces.
7. Migration preserves existing Vessel IDs and Client links without name-based merging. Saved Orders retain their Client/Vessel values and immutable controls after association changes.
8. Existing authorization, saved-Order editing restrictions and document protections remain effective.

## Context for agents

**Affected systems:** frontline-forwarding-app (Vessel/Client relationships, maintenance, reference reads and Order validation) and frontline-forwarding-client (existing selectors, lookup state and creation payloads). Update affected API contracts/generated clients and regression coverage together.

Repository: Frontline-Forwarding/frontline-forwarding.

| Source | Implementation context |
| -- | -- |
| `docs/reference/database.md` | Current `vessel.company_id` represents one Client. `client_invoicing_company` separately records `client_company_id`, `invoicing_company_id` and nullable `vessel_id`; billing assignments are not membership. |
| `docs/reference/graphql-api.md` | `PurchaseOrderCreateInput` has required `clientCompanyId`, optional `vesselId` and optional `invoiceCompanyId`. `PurchaseOrderUpdateInput` does not expose Client/Vessel changes. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/vessels/VesselRepository.java` | Single-company lookup and `replaceCompanyVessels` must support shared identities. Current removal deletes Vessel records; association removal must not do so. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/vessels/VesselService.java` | Preserve authorized company access and Client-type checks while adapting maintenance and reads. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java` | Replace single-company equality with membership validation; retain requiredness, active-company and invoice eligibility checks. Updates preserve stored Client/Vessel. |
| `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/companies/CompanyRepository.java` | `findAvailableInvoicingCompanies` applies client-wide or selected-Vessel eligibility. |
| `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx` | Current Vessel choices come from the selected Client; saved Client/Vessel controls are disabled. Add Vessel-first lookup and dependent-selection handling. |
| `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-invoice-options.ts` | Reuse assignment filtering and deduplication by invoicing-company ID. |

## Post-deployment verification

Use authorized read-only reference/API queries, existing saved records and unsaved form interactions. Never submit an Order or modify associations during production verification.

| Acceptance criteria | Read-only check |
| -- | -- |
| 1 | Inspect an existing shared Vessel and its Client associations; compare existing association-removal evidence with the retained Vessel, remaining links and historical Order references. |
| 2–3 | Open Create Order without submitting; exercise both selection orders with existing shared/single-Client fixtures and compare choices with authorized reference reads. Check zero-eligible behavior where an existing fixture permits it. |
| 4–5 | Change and clear unsaved selections; compare retained/cleared values and Invoice company options with reference assignments. Check an existing Client without Vessels and optional Invoice company. |
| 6 | Inspect loading/error behavior without submitting and review deployment test evidence for out-of-order responses, concurrent association changes and direct-API rejection. |
| 7 | Compare pre/post-migration reference evidence for Vessel IDs/links; open existing Orders affected by association changes and confirm unchanged values and read-only controls. |
| 8 | Compare authorized views across existing permitted scopes and review regression evidence for maintenance permissions, cross-client access and saved-Order protections. |

If suitable existing records or test/migration evidence are unavailable, report the relevant check as unverified; do not create production data to perform it.

**Reference:** repository sources above; FRO-335 / FRO-326 presentation contracts and FRO-273 Invoice company eligibility.

