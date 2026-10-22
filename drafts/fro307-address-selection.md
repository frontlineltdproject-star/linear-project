**Choose reusable loading and Client-specific destination addresses for a Shipment’s Delivery Notes (δελτία αποστολής).** Everyday Frontline operators can add delivery locations without needing a manager. One loading address and one destination address apply to all current Delivery Note drafts for the Shipment.

**Order = purchase order = stock-list item; colli = handling unit.** The **Client** is the commercial Client recorded on each participating Order. The **invoicing company** supplies each note’s recipient fiscal details; it does not determine the physical delivery location.

## Address choices and defaults

| Field | Available choices | Initial value on new drafts |
| -- | -- | -- |
| **Loading address** | Active warehouses, active companies and reusable saved addresses, grouped as **Warehouses / Companies / Saved addresses**. Preserve authorized access boundaries. | Copy the Shipment’s actual **Origin warehouse** address. Missing parts remain missing; no fixed Piraeus fallback. |
| **Destination address** | Only delivery locations explicitly associated with at least one Client represented by the Shipment’s participating Orders. Locations can reference a warehouse/company address or a standalone saved address. | Blank. Require explicit selection or manual entry, even when only one location is available. |

Derive the distinct Client identities from participating Orders, not from invoice companies, vessel ownership or an assumed single Shipment Client. For multiple Clients, show the combined eligible locations, identify their associated Clients, and show each shared location once by its stable identity. Do not merge unrelated records merely because their names match.

Keep the destination groups **Warehouses / Companies / Saved addresses**, filtered by those Client associations. A warehouse/company reference must be active. A billing relationship alone does not establish a delivery-location association. Never populate destinations from all unrelated Clients’ addresses.

Warehouse/company references read their current structured address when selected; do not maintain a second editable copy in the Client association. Warehouse City resolves to its city name; company and standalone-address City are text. Exclude sources with all address parts empty; allow partially populated sources for completion in the note form.

## Selecting, completing and saving

* Selecting a location copies **Street, Number, Postal code and City** into the corresponding working address. Preserve the other address and unrelated movement fields.
* Permit manual entry without creating a reusable record. Operators may complete or correct copied values for this Shipment’s notes without changing the warehouse, company, saved address or Client association.
* Selection and manual changes remain unsaved until the normal **Save Draft Delivery Notes** action. Save the common values atomically to every current note, requiring the complete current note ID/version set. Preserve the existing rule that every current note must be **DRAFT**.
* Revalidate authorization and selected-source eligibility on the server. Destination lookup/linking uses the Shipment’s current participating Clients. Do not accept an unrelated Client association or inactive/unavailable source merely because it was previously returned by a dropdown.
* All four address parts must be complete and valid at draft save. Retain current route limits: Street **255**, Number **40**, Postal code **40**, City **255** characters. Trim surrounding whitespace; Number and Postal code remain text, preserving letters, ranges and leading zeros.
* Source streets can contain up to 500 characters. Preserve the supplied value for review and require an explicit valid correction before note save; never silently truncate it.
* Lookup, validation, permission, network and stale-version failures preserve entered values and produce actionable feedback. A failed lookup is not an empty address list. Failed shared saves change no notes; do not retry stale saves automatically.
* Preserve existing save-before-preview/issuance behavior. Source selection, address creation and draft saving do not issue a fiscal document, allocate a fiscal number or dispatch goods.

## Reusable locations — via **+**

**+** beside Loading creates a reusable standalone address. **+** beside Destination supports either linking an existing warehouse/company address or creating a standalone saved address and associating it with the represented Clients.

| Field | Type / format | Rule |
| -- | -- | -- |
| **Name** | String | Required, nonblank display name for a standalone saved address. Existing warehouse/company references retain their source identity/name. |
| **Street** | String | Required for a new standalone address; maximum 255 characters. |
| **Number** | String | Required for a new standalone address; maximum 40 characters. Text values such as letters and ranges remain valid. |
| **Postal code** | String | Required for a new standalone address; maximum 40 characters; preserve leading zeros. |
| **City** | String | Required for a new standalone address; maximum 255 characters. |
| **Associated Clients** | Multi-select reference to represented Clients | Required when adding a destination location. With one represented Client, associate it automatically. With several, require explicit selection of one or more represented Clients. |

Linking an existing warehouse/company does not modify its address and does not require company/warehouse edit permission. Incomplete source data can be completed in the note form under the rules above.

A saved location and its Client associations are shared by authorized Frontline operators, not private to the creator. Destination reuse remains Client-scoped. The same location can be associated with multiple Clients.

For standalone entries, reuse an existing entry when **Name and all four address parts** match after trimming surrounding spaces and ignoring letter case. Otherwise allow the same name with different details and display sufficient address details to distinguish choices. Never overwrite an existing address during duplicate handling. Existing warehouse/company links reuse the source identity; repeated links must not create duplicate associations.

Saving Destination **+** persists the location and requested associations atomically, reusing an identical saved entry where applicable. Repeated submissions must not create duplicate entries/associations. Successful save selects the resulting location into the field from which **+** was opened, while preserving all other draft input.

Cancelling the **+** dialog persists nothing and leaves the surrounding draft unchanged. Once the operator explicitly saves a reusable location/association, abandoning the surrounding Delivery Note edits does not remove it. Failed creation/linking preserves the entered values, creates no partial result and does not change the note.

Editing/removing existing reusable addresses or Client-location associations is outside this ticket.

## Permissions

* Retain the delivery-note boundary: authorized **Frontline users and system administrators**, not partners/customers.
* Address lookup uses authorized Delivery Note read access; selecting/editing the working draft and saving notes require existing draft-edit permission.
* **DELIVERY_NOTE_CREATE** permits creating reusable addresses and Client-location associations. Ordinary **Frontline operators** already have this authority; manager approval and **COMPANY_EDIT** are not required.
* Hide **+** entirely when creation is unavailable. Enforce equivalent checks server-side for direct requests; hiding the control is not authorization.
* Creating or linking a location grants no permission to edit the referenced warehouse/company.

## Saved drafts and historical documents

Copy values into notes; never keep their rendered addresses dependent on a live source lookup. Later source-address or association changes must not refresh saved drafts, overwrite operator corrections, alter existing PDFs or rewrite submitted XML. Explicit reselection supplies current source values to an editable working draft.

Reopening saved drafts retains their recorded addresses. Apply the new loading default and blank destination only to newly created drafts; do not backfill existing notes. Preserve all existing fiscal lifecycle, cancellation/recovery, version and historical-document protections.

The selected physical destination does not change the Shipment’s destination identity/geography, participating Orders, Client, invoice company, recipient fiscal snapshot or invoice-company grouping.

## Ownership and scope

**FRO-307** owns reusable-address persistence, Client-location associations, authorized lookup/create/link contracts, source resolution, defaults and integration with common draft saving.

**FRO-316** owns presentation in **Available actions → Issue Delivery Notes**; **FRO-341** remains the Shipment creation visual reference. Reuse those UI contracts; no separate screen design, canvas, preview or screenshots are required. Do not introduce Delivery Note address capture into Shipment creation. The existing previews are visual references, not proof that these new contracts are implemented.

Retain **FRO-306** as the structured warehouse/company-address dependency and **FRO-247** as the Delivery Note lifecycle owner. Preserve delivery-note origin eligibility under **FRO-357**.

Out of scope: shared-address maintenance/deletion, changing warehouse/company master addresses, invoice-company grouping, recipient fiscal details, Shipment route edits, AADE payload/numbering policy, dispatch and historical-document migration.

## Acceptance criteria

1. Loading offers the authorized grouped sources; new drafts use the actual origin warehouse’s available parts without fabricating missing data.
2. Destination offers only locations associated with represented Clients, combines multiple Clients’ choices without repeating shared identities, and starts blank.
3. Selection/manual completion affects the working address only. One valid loading/destination pair saves atomically across all current drafts; stale, incomplete or non-DRAFT requests leave notes unchanged.
4. Partial source addresses can be completed locally; empty sources are excluded. Required fields and existing limits are enforced without truncation.
5. Everyday Frontline operators can create a reusable address or link a warehouse/company destination to represented Clients. Unauthorized users cannot do so through UI or direct requests.
6. Single-Client association is automatic; multi-Client association is explicit. Shared reuse, duplicate handling, atomic linking, retry and cancellation follow the rules above.
7. Source changes and abandoned note edits do not rewrite saved note addresses or remove explicitly saved reusable locations. Existing fiscal evidence and recipient identities remain unchanged.
8. Existing Delivery Note preview/issuance and Shipment workflows retain their lifecycle and authorization safeguards.

## Decisions

| Decision | Reason |
| -- | -- |
| Destination options follow participating Orders’ Clients; one destination is shared | Keeps choices relevant while preserving one physical movement across company-specific notes. |
| Default loading from origin; destination requires explicit selection | Uses known departure data without assuming a saved destination is correct for this movement. |
| Explicit Client associations can reference existing warehouse/company addresses | Reuses maintained source data without treating a billing relationship as delivery instructions. |
| Everyday operators can create/link locations | Address reuse must be available during ordinary office work without manager intervention. |
| Note addresses are saved values; corrections can be local | Protects operator choices and historical documents from later master-data changes. |
| Create/select now; maintenance later | Keeps this feature focused while allowing reusable locations to be added during note preparation. |

## Context for agents

Evidence: live `Frontline-Forwarding/frontline-forwarding`, main `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.

* `docs/workflows/company-and-warehouse-addresses.md` — optional structured source fields, warehouse city reference, 500-character source street, and snapshot preservation.
* `docs/workflows/delivery-note.md` — common draft editing, per-invoice-company notes, saved addresses and fiscal lifecycle. Address requirements here are portal validation; do not reinterpret them as a new statutory claim.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/DeliveryNotesApiService.java` — preparation’s fixed loading default to replace; route validation and atomic all-current-note version checks.
* `frontline-forwarding-app/src/main/resources/graphql/delivery-notes.graphqls` — `deliveryNotesByShipmentId`, `createDeliveryNotesForShipment`, `updateDeliveryNoteDraftsForShipment` and existing individual draft/issue/cancel operations. Address inputs currently carry four copied values. Preserve existing adapter guards; new source/link contracts must be implemented, not assumed to exist.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/deliverynotes/DeliveryNoteAuthorizationService.java` and `domain/users/UserRole.java` under the same Java root — internal-user boundary and everyday operator authorities.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — Order `clientCompany` and `invoiceCompany` are separate. `domain/shipments/Shipment.java` and `web/shipments/service/ShipmentsApiService.java` under the Java root — no direct Shipment Client; a common Client is not enforced for general Shipments.
* `frontline-forwarding-client/src/features/shipments/components/delivery-notes-card.tsx` and `delivery-note-form-validation.ts` — shared editor, saved route initialization, all-DRAFT guard and save-before-preview/issuance.
* `docs/reference/database.md` — existing company, freight warehouse, purchase-order/Shipment participation and `freight_delivery_note` / `freight_delivery_note_line` storage. No reusable-address/Client-location model was found in the inspected contracts; this ticket requires new persistence and authorized operations. Support missing origin-address parts during initial preparation without relaxing completed-draft validation or inventing values. Regenerate affected API/database references after implementation.

## Post-deployment verification

Use authorized read-only queries, UI inspection and controlled-environment test evidence. Do not create addresses, save drafts or submit fiscal documents in production as verification.

1. Inspect prepared test fixtures and warehouse reads: new loading values match the actual origin; missing parts remain missing; existing notes retain saved values.
2. Compare destination lookup results with participating Orders’ Client identities and persisted associations for single-/multi-Client fixtures. Confirm unrelated locations are absent, shared identities appear once and new destination starts blank.
3. Inspect controlled save/concurrency tests and read `deliveryNotesByShipmentId`: successful common saves affect all current drafts equally; invalid/stale/non-DRAFT cases change none.
4. Review partial/empty/oversized source tests and rendered form evidence: no truncation, local completion and required-value validation.
5. Inspect role tests for ordinary operators, denied users and direct requests: create/link is allowed only under the stated authority and does not grant master-data editing.
6. Inspect stored reusable records/associations and controlled duplicate, retry, failure and cancel tests: correct Client scope, no duplicate/partial persistence, successful + targets the originating field.
7. Compare saved drafts, recipient details, PDF and submitted-XML evidence across source changes and rollout. Confirm no refresh, backfill or loss of saved reusable entries when note edits are abandoned.
8. Review regression evidence for preview/issuance, origin eligibility and Shipment actions; selection/create/link performs no fiscal submission or dispatch.

**Reference:** FRO-306 · FRO-247 · FRO-316 · FRO-341 · FRO-357; repository paths above.
