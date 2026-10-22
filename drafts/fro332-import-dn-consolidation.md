**As an operator I want the Import Delivery Note reference maintained once on the Order** so that its collis use one authoritative Order-owned reference.

**Order = purchase order = stock-list item. Colli = individually identified handling unit.** DN Import is an incoming document's text reference, separate from attachments and Shipment Delivery Note drafting or issuance.

## Field contracts

| Field | Type / format | Required behavior |
| -- | -- | -- |
| Order — **DN Import / DN εισαγωγής** | Optional String, maximum 255 characters; existing `deliveryNoteImport` | Retain the existing Order field and values. Preserve trimming, blank normalization, validation and authorized editing. |
| Colli — **Import Delivery Note** | Retired String; `importDeliveryNote` | Remove from active storage, create/update inputs, read outputs, validators, client state/defaults/payloads and generated contracts. No second Order field or replacement colli field. |
| Order — **DN Export** | Existing independent optional String | Preserve its value and behavior, separately from DN Import. |

### Order DN Import updates

| Request | Result |
| -- | -- |
| Create without a reference, or with null/blank | Store no reference. |
| Update omits `deliveryNoteImport` | Preserve the saved reference. |
| Update explicitly supplies null or blank | Clear the reference through the existing authorized save. |
| Create/update supplies text | Apply existing trimming and the 255-character limit; reject invalid input without truncation or partial changes. |

Enforce omitted-versus-explicit-clear behavior across supported REST and GraphQL updates. Unrelated saves must not erase DN Import. Cancel and failed saves preserve saved values and retain the editable draft appropriately. This change does not alter DN Export's update contract or unrelated field semantics.

Retain internal-user boundaries, existing create/edit authorities, record restrictions and reservation checks. Ordinary header editing retains the existing **PENDING / EXPECTED_READINESS / READY / IN_STOCK** guards; this ticket grants no additional edit access.

## Current-form delivery and contract retirement

**Ship the necessary current Create/Edit form changes with the backend change in this ticket.** Remove the per-colli input, hidden form value, defaults, copying and submitted payload. Keep the existing Order DN Import input usable. Remove the **Colli documentation** group when empty; preserve unrelated fields and controls.

Retire the duplicate across REST Order create/update, GraphQL nested colli create/update inputs and colli read outputs, standalone handling-unit reads, and MCP `frontline_create_purchase_order`. Remove obsolete client query selections and regenerate affected clients and API/reference documentation. Compact MCP reads currently omit these references; no new MCP read field is required.

Coordinate deployment of all supported callers and contracts. Obsolete input fields or GraphQL selections must fail clearly, with no partial writes or silent recreation of colli references. Verify older payload/query failures in a safe environment. No legacy read-only colli field or compatibility alias remains after this delivery.

## Data treatment

This delivery affects **mock/test data only**. Remove obsolete per-colli mock values with the retired field and update seeds/fixtures. Preserve existing Order DN Import values, including absence; do not populate, overwrite or concatenate them from obsolete colli values.

Real operational-data deletion, import, archival and reconciliation are outside this delivery. If real records are encountered, stop their cleanup and obtain a separate treatment plan. Preserve unrelated audit, movement, attachment and document history.

## Split Orders and separate arrivals

Preserve initial copying of the parent's Order DN Import, including absence, in both **manual Order splitting** and **partial splitting during Shipment preparation**. Preserve the parent's value. A nested split copies its direct parent's value at that time.

Later authorized edits belong only to the actual Order: parent, child and nested-child references may differ. Do not synchronize a family or infer ownership from number suffixes. A copied reference is inherited data, not evidence of a new arrival.

Preserve colli identities and membership history, terminal memberships, split transactions, lineage and inherited attachment provenance. Do not automatically split Orders, change arrival rules or assign a reference to unrelated remainder goods.

## Coordination and scope

| Area / reference | Ownership and required outcome |
| -- | -- |
| **FRO-332** | Owns canonical DN Import update semantics, complete colli-field retirement, mock cleanup, current-form integration and supported-consumer compatibility. |
| **FRO-335 — Create Order redesign** | Consume the single Order-owned reference and omitted colli field in its agreed layout. FRO-332 blocks final delivery; its current-form removal does not wait for this redesign. |
| **FRO-326 — Order Details redesign** | Owns resulting Details presentation and preview annotations. Consume the same Order contract; remove the duplicate colli field and empty group. FRO-332 blocks final delivery. |
| **FRO-329 — Order field cleanup** | Preserve retained DN Import/DN Export and split inheritance while removing its independently owned fields. Coordinate shared form and document-header changes. |
| Stock-list PDF and Shipment Delivery Notes | Preserve output and existing transport/related-document references. Neither consumes the retired import-reference field; introduce no new document content. |

**Affected systems:** `frontline-forwarding-app` Order/handling-unit persistence, validation, REST/GraphQL/MCP adapters and split services; `frontline-forwarding-client` shared Create/Edit form, service mapping, query selections and generated contracts.

**Out of scope:** new UI design or preview; unrelated Details redesign; new document types or uploads; Shipment Delivery Note or DN Export changes; automatic splitting or arrival changes; PCS/Notes removal; real-data migration or archival.

## Decisions

| Decision | Reason |
| -- | -- |
| Keep the existing Order reference and fully retire the colli duplicate | One authoritative field avoids independent per-colli references and duplicate contracts. |
| Remove the input, hidden value and payload from current forms with the backend | Current callers must work before the later redesign releases. |
| Mock-only cleanup; preserve the existing Order value | This delivery does not require real-data reconciliation or promotion of obsolete colli values. |
| Omitted DN Import preserves; explicit null/blank clears | An unrelated update must not erase the authoritative reference. |

## Acceptance criteria

1. The per-colli reference is absent from active storage, supported inputs/outputs, validators, client state/defaults/payloads, query selections and fixtures. Supported consumers use updated contracts; obsolete payloads/selections fail clearly without partial writes.
2. Current Create/Edit forms remove the colli input and empty documentation group with the backend release, retain the existing Order input and preserve unrelated fields. FRO-335/FRO-326 consume the same contract without a duplicate design.
3. DN Import follows the create/update table, including omitted preservation, explicit clearing, trimming, valid boundary and overlength rejection. Reopening retains the saved value; unrelated edits, Cancel and failures do not erase it. Existing authorization, lifecycle and reservation guards and EN/EL behavior remain intact.
4. Both split paths and nested splits copy the canonical reference once, preserve the parent and colli identities/history, and allow independent later authorized edits without family synchronization or new arrival effects.
5. Only obsolete mock colli values are removed. Existing Order references, DN Export, unrelated fields and audit/document/attachment history are preserved; no real-data cleanup runs.
6. Stock-list PDFs, Shipment Delivery Note drafting/issuance, transport and related-document references, inherited attachments and unrelated lifecycle behavior remain unchanged.

## Context for agents

Live production source checked through **gh on 22 October 2026**, main **3820e89e8caa341261e2d48bcb282d93e1bb1d03**.

* `docs/reference/database.md` — retain `freight_purchase_order.delivery_note_import`; retire `freight_handling_unit.import_delivery_note`.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — Order DN fields and separate nested colli create/update/read fields.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java` — current optional-text normalization conflates missing and null; implement presence-aware DN Import updates without changing unrelated fields.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` — header/colli persistence, guards and manual split; colli updates currently write the duplicate reference even when normalized to null.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/shipments/service/ShipmentsApiService.java` — partial Shipment-preparation split also copies the Order document header.
* `frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql` — split-header validation includes the retained Order DN Import; preserve its initial-copy semantics.
* `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx`, `services/purchase-order-service.ts` and `graphql/purchase-orders.graphql` — current shared input, payload and colli selection. Update all three layers and generated types.
* `docs/workflows/purchase-order-colli-journey.md` and `docs/workflows/attachments.md` — split membership, lifecycle and inherited attachment provenance.

Regenerate affected database/API/MCP/client references and keep curated workflow documentation synchronized. Generated files are not hand-edited.

## Post-deployment verification

Production checks are **read-only**; inspect safe-environment mutation-test evidence instead of submitting production writes.

| AC | Read-only check |
| -- | -- |
| 1 | Inspect deployed schema, REST Order/handling-unit responses, MCP creation schema, migration evidence and regenerated clients. Confirm field retirement and review obsolete-payload/query rejection tests. |
| 2, 3 | Open current Create/Edit pages in EN/EL without submitting. Confirm absent colli input/empty group and retained Order input; review safe-environment save/reopen, omission, clearing, boundary, failure, Cancel and access/state/reservation tests. |
| 4 | Inspect parent/child/nested-child records from both tested split paths and subsequent independent edits. Compare canonical references, colli identities, memberships, lineage and attachment provenance. |
| 5 | Review fixture/migration evidence and compare retained Order DN Import/DN Export and unrelated histories; confirm cleanup was restricted to mock data. |
| 6 | Inspect representative generated stock-list and Shipment Delivery Note outputs and attachment metadata; compare with baseline and review safe-environment issuance/lifecycle regression evidence. |

**Reference:** [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) · [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) · [FRO-329](https://linear.app/front-line-ltd/issue/FRO-329) · production sources above.
