Defines the **Import Customs Declaration (Import)**: one import-clearance declaration, its covered goods, Shipper, MRN, customs milestones and files. Each Import belongs to one **Shipment**; a Shipment may have several Imports for successive partial clearances. The ordinary case uses one Import with all eligible goods selected.

**Order = purchase order = stock-list item; colli = permanently identified handling unit.** Imports select physical collis; connected Orders are derived through their Shipment attribution. Export's selected Supplier Invoices are a different, paperwork-based scope.

This ticket owns the structural model, authorized operations, API contracts, audit and Shipment safeguards. No UI, preview or production mock branch.

## Open business confirmation — required before Ready

**Confirm with the customs department whether every clearance covers whole collis, or whether part of a colli's contents can be cleared separately.** The coverage rules below use whole collis provisionally. If sub-colli clearance is required, resolve that model before implementation; do not approximate it by declaring the whole colli or silently splitting physical goods. Keep this issue **Backlog / Pending_Review / Business_Input** until resolved.

## Fields

Each Import has a server-generated, unique, immutable **Import ID**, separate from its MRN.

| Field | Type / format | Rule |
| -- | -- | -- |
| **Shipment** | Required Shipment reference | Selected at creation; fixed afterward. Any non-cancelled Shipment, including an arrived Shipment, may be selected. |
| **Covered collis** | Set of permanent colli references within the linked Shipment | Explicit saved declaration coverage. May be empty before submission; at least one required at submission. Locked at submission. |
| **Connected Orders** | Derived list of Order references | From covered collis' attribution in the linked Shipment; no independently saved Order selection. |
| **Shipper (Αποστολέας)** | Existing Company reference | Manually selected; optional before submission, required at submission and locked afterward. No Supplier, Client or Export-type derivation. |
| **MRN** | String, 18 alphanumeric characters | Blank before submission; required to confirm submission. Trim and uppercase. Unique across Imports, including cancelled records. Editable until positive customs result, then locked. |
| **MRN date** | Date | Blank before submission; required at submission, no later than today in Europe/Athens. Same editing boundary as MRN. |
| **Customs status** | Derived value | One of the seven states in the lifecycle below; changed by confirmation events, not ordinary field editing. |
| **Payment requirement** | Payment required / No payment required; unset before positive result | Explicitly recorded with the positive result. Missing data never means no payment is required. |
| **Customs event history** | Ordered event records | Submission, inspection referral/completion, positive result, payment and completion-document receipt as applicable; each with business date, authenticated recording actor and recording timestamp. |
| **Άδεια receipt confirmation date** | Date, from its confirmation event | Receipt of **Άδεια Τελωνισθέντων Εμπορευμάτων** completes the Import. Issuance alone or payment alone does not. |
| **Record cancellation** | Active / Cancelled; reason, actor and time | Separate from Customs status; only before submission. |
| **Files** | Import-owned attachments | Optional. Uploading a file never confirms an event or changes status. |

Shipment transport documents, packing, measurements and Order parties remain owned by their source entities. Exact related fields, totals and presentation will be decided with employees in a later UI ticket; that work must identify any missing API support. No copied editable Shipment/Order fields are added here.

## Creation and coverage

1. Select the Shipment, or use its preselected reference when creation starts from that Shipment.
2. Return eligible participating collis grouped by their Shipment Order attribution; preselect all eligible collis. Selecting an Order selects its eligible collis in this Shipment, not every current colli of that Order.
3. For ordinary full clearance, retain the selection. For partial clearance, deselect whole groups or individual collis. There is no separate partial mode.
4. Save the Import. An unfinished **Awaiting submission** record may have no Shipper and no covered collis. Submission requires both, plus MRN/date.

**Eligibility and exclusivity:** a colli must belong to the linked Shipment's applicable recorded participation and must not be covered by another non-cancelled Import on that same Shipment. Saved pre-submission Imports and Completed Imports both count. Unsaved suggestions claim nothing. Concurrent saves cannot allocate the same Shipment + colli pair to different non-cancelled Imports.

Removing coverage before submission, or cancelling an eligible Import, makes that coverage available again. Cancelled Imports retain their former selection as history. The same physical colli may belong to an Import on a later Shipment; this is not a lifetime exclusion.

Use current retained participation before dispatch and retained historical participation after movement. Exclude participation removed before dispatch under FRO-344; a closed movement caused by arrival is not a removal. Re-adding or reattributing the same stable colli must not duplicate coverage. Preserve the original Shipment attribution needed to interpret saved declarations rather than deriving history from today's Order membership.

Later movement, Order splits or terminal physical disposition do not erase coverage, change Customs status or alone disqualify historically participating goods. Do not recompute a saved Import from an Order's current complete colli set. Creating or completing an Import does not split Orders, unpack goods, change customs regime, confirm stock, dispatch or arrive a Shipment.

Staff identify the relevant import movement. No geography-based customs classification and no dependency on a Shipment Import/Export category. FRO-322 owns that deferred category work. Warehousing-placement declarations are outside this entity's first delivery; the partial-clearance context is **Τελωνειακή Αποταμίευση**, distinct from **Τελωνειακή Αποθήκευση**.

## Customs lifecycle

| Current status | Confirmed event / condition | Next status |
| -- | -- | -- |
| **Awaiting submission** | Submission confirmed with required Shipper, coverage and MRN/date | **Awaiting customs result** |
| **Awaiting customs result** | Documentary inspection required | **Awaiting documentary inspection** |
| **Awaiting customs result** | Physical inspection required | **Awaiting physical inspection** |
| Either inspection status | Inspection completed; result still pending | **Awaiting customs result** |
| Awaiting customs result or either inspection status | Positive result confirmed + Payment required | **Awaiting payment** |
| Awaiting customs result or either inspection status | Positive result confirmed + No payment required | **Awaiting Άδεια Τελωνισθέντων Εμπορευμάτων** |
| **Awaiting payment** | Payment confirmed | **Awaiting Άδεια Τελωνισθέντων Εμπορευμάτων** |
| **Awaiting Άδεια Τελωνισθέντων Εμπορευμάτων** | Receipt of the Άδεια confirmed | **Completed** |
| **Completed** | No further ordinary customs transition | Unchanged |

Only one inspection is current at a time. Inspection referral is **not rejection**; inspection completion alone is **not a positive result**. Preserve each inspection occurrence and its result; returning to Awaiting customs result does not erase earlier events. A later referral is a new event, not an overwrite.

Record payment separately from receipt of the completion document. No-payment cases have an explicit No payment required confirmation and no fabricated payment event. A payment receipt is distinct from the Άδεια. The completion confirmation records the actual receipt date, actor and recording time; no attachment or document-reference field is required.

**Event validation:** require the applicable event date; no future dates in Europe/Athens, and dates must follow the prerequisite events in order (same-day events allowed). Store business dates separately from recording timestamps. MRN-date corrections must remain consistent with recorded chronology. Positive-result confirmation and payment-requirement selection are atomic. Require the applicable prior events; reject ordinary skips, reversals, duplicate confirmations and stale writes. Ordinary edits cannot rewrite event history or confirmed dates.

**Already-underway procedures:** default creation is Awaiting submission. Staff may instead record a later stage, including Completed, by explicitly confirming the actual prerequisite milestones and dates for that path. Record only inspections that actually occurred; do not fabricate them or a payment for a no-payment case. Creation, coverage, supplied confirmations and resulting status commit together. If required facts are unknown, do not claim the later stage. Record the current authenticated actor and recording time without attributing past actions to an invented actor.

Actual rejection, rejection/resubmission handling and customs withdrawal are deferred. Do not represent those outcomes as inspection, a positive result or completion. This ticket does not submit declarations to customs or perform payments.

## Editing and cancellation

| Information / operation | Before submission | Submitted, before positive result (including inspection) | Positive result onward, including Completed |
| -- | -- | -- | -- |
| **Shipment** | Fixed after creation | Fixed | Fixed |
| **Shipper** | Set / change / clear | Locked | Locked |
| **Covered collis** | Add / remove under eligibility | Locked | Locked |
| **MRN / MRN date** | Blank; enter through submission confirmation | Editable with validation | Locked |
| **Customs status / event dates** | Confirmation events only | Confirmation events only | Confirmation events only; none after completion |
| **Payment requirement** | Unset | Set only with positive result | Recorded event fact, not ordinary editing |
| **Files** | Upload / download / remove | Upload / download / remove | Upload / download; no removal |
| **Record cancellation** | Allowed for authorized managers/admins | Not available | Not available |

The positive-result lock applies to both payment paths. No late addition of goods after submission, including at Completed. Later correction of locked facts requires a separately specified audited correction operation; no override is introduced here.

**Cancel record:** require a nonblank reason, record actor/time and keep the record, files and former coverage as read-only history. Release its active coverage exclusion atomically. No hard deletion, reactivation or automatic cancellation of the Shipment. Cancelled records remain readable and cannot accept ordinary edits, uploads or confirmations. Portal-record cancellation does not withdraw a customs declaration.

## Shipment safeguards and ownership

| Area | Required behavior | Owner |
| -- | -- | -- |
| Shipment cancellation | Reject while any non-cancelled Import exists, even an empty pre-submission Import. Identify blocking records within the caller's access. | This ticket extends the cancellation guard. |
| Shipment membership removal | Reject removal of a covered colli. Before submission, explicitly remove it from the Import first; after submission coverage stays locked. | This ticket defines the guard; integrate with FRO-344 membership editing. |
| Shipment membership additions | Never auto-expand any saved Import. New eligible goods can be selected explicitly only in a pre-submission Import or another Import. | This ticket. |
| Repacking / Order splits / later movement | Preserve permanent coverage, historical attribution and customs facts. No automatic customs transition. | This ticket preserves FRO-325/FRO-344 and existing journey behavior. |
| Source data and future UI | Source entities retain ownership. Exact related-field selection and UI remain deferred. | Later UI ticket; no UI work here. |
| Shipment Import/Export category | Remains deferred until current Shipment implementation completes; not a prerequisite for this entity. | FRO-322. |

Coordinate Import creation/coverage saves/cancellation with Shipment cancellation and membership edits so races cannot orphan coverage or bypass guards. A mere packing change never changes colli membership. Do not introduce a blanket ban on later physical movement or terminal disposition because a historical Import exists.

## Access, operations and consistency

Follow existing staff authorization conventions with Import-specific view, create, edit/confirm and cancel authorities. Frontline operators/managers may view, create, edit permitted fields and confirm milestones. Cancellation is restricted to Frontline managers/system administrators. Preserve the existing system-administrator access convention. External clients, suppliers and agents cannot access Imports or files through direct reads, reverse lookups, searches, validation messages or downloads.

Provide authorized creation, eligibility lookup, coverage/Shipper/MRN editing within the matrix, milestone confirmation, record cancellation, attachment operations and reads by Import ID, MRN and Shipment. Reads return saved coverage, derived Orders, status, payment requirement, cancellation state and event/audit history. These are logical contracts; no existing Import endpoint is assumed. Apply the same guards to every exposed API adapter and document the implemented operations.

Extend shared attachment ownership to Import; do not attach Import documents to the Shipment or an Order as a substitute. Upload against a saved Import through the shared multipart REST mechanism; keep private storage and authorized downloads. Files must be nonempty, at most 25 × 1024 × 1024 bytes, with a normalized nonblank filename up to 255 characters. Reuse the case-insensitive extension allowlist: PDF/JPG/JPEG/PNG/WebP/GIF/DOC/DOCX/XLS/XLSX/CSV/TXT. Preserve uploader/time and removal audit. Uploads are optional and independent from event confirmation.

Revalidate permissions, latest state, ownership, coverage exclusivity, MRN uniqueness and chronology on the server. Version-check edits and confirmations; a conflict saves nothing and returns enough authorized information to review current data. Retries must not duplicate records/events or claim coverage twice. Audit creation, changes, confirmations, cancellation and file operations with actor/time and applicable before/after facts. No-op or failed operations create no false business event or partial state.

## Rollout and out of scope

New records, test fixtures and manual recording of already-underway procedures only. No bulk migration, automatic reconstruction of old declarations, copying retired Order customs fields or deletion of real historical data.

Out of scope: UI/pages/previews/production mock branch; warehousing-placement declarations; actual customs rejection and resubmission; post-submission cancellation/withdrawal and audited correction of locked facts; customs-system integration; payment execution or duty/tax calculation; automatic Order splits or regime changes; changes to Export or Supplier Invoice membership/status; the deferred Shipment category.

Future field candidates, **not implemented here**: duty/tax amounts, payment reference, Άδεια reference number and general customs notes. Related Shipment/Order field selection and totals await employee consultation in the UI ticket.

## Decisions

| Decision | Reason |
| -- | -- |
| One Shipment to many Imports; one declaration per Import | Supports normal full clearance and successive partial declarations. |
| Explicit collis; Orders derived through Shipment attribution | Records the goods declared without a second competing coverage list. |
| Preselect eligible goods; exclusivity per Shipment + colli | Keeps the normal case simple while preventing duplicate coverage without a lifetime ban. |
| Manual existing-Company Shipper | No reliable Import derivation rule exists. |
| Inspection branches are separate from rejection | Reflects the department's actual workflow; rejection is deferred. |
| Explicit payment requirement; completion on Άδεια receipt | Supports payable and no-payment cases without inventing payment or completing on issuance alone. |
| Coverage/Shipper lock at submission; MRN/files lock at positive result | Preserves declaration identity with the agreed staged editing policy. |
| Customs and physical operations remain separate | Recording customs facts must not silently move or split goods or change their regime. |
| Structural delivery; category and presentation deferred | Allows entity work without expanding ongoing Shipment/UI implementation. |

## Acceptance criteria

1. Create an unfinished Import on a non-cancelled Shipment without MRN, Shipper or selected goods; Shipment is fixed afterward. A cancelled Shipment is rejected.
2. Eligible collis are preselected and grouped by Shipment Order. Full clearance needs no partial mode; selection of an Order means only its eligible participating collis.
3. Another non-cancelled Import, including a saved draft or Completed record, excludes the same Shipment + colli. Concurrent conflicting saves cannot both succeed. The same colli on another Shipment is not excluded by that earlier declaration.
4. Submission requires selected eligible goods, Shipper, normalized unique MRN and valid MRN date; saves the event atomically and locks Shipper/coverage.
5. The payable path reaches Completed only after positive result, payment and Άδεια receipt confirmations. Payment alone and document issuance alone cannot complete it.
6. The no-payment path requires explicit confirmation, skips payment and completes only on Άδεια receipt; no payment event is fabricated.
7. Both inspection branches work independently, retain their history and return to awaiting result or advance on an explicitly positive result; neither inspection referral nor completion implies rejection or approval.
8. MRN/date remain editable before positive result, including during inspection, and lock afterward. File removal follows that same lock; uploads alone never advance status.
9. Already-underway entry, including Completed, requires the true prerequisite confirmations/dates and commits atomically. Invalid chronology, future dates, duplicates and stale events are rejected without partial changes.
10. Pre-submission cancellation by an authorized manager/admin preserves history/files and releases coverage; operators, later-stage cancellation, deletion and reactivation are rejected.
11. Non-cancelled Imports block Shipment cancellation and removal of covered goods; additions never auto-expand saved coverage. Races cannot bypass these guards.
12. Repacking, later movement, terminal disposition and Order splits preserve Import identity, covered collis and historical attribution; no automatic stock, Shipment or regime transition occurs.
13. Staff permissions apply through every exposed path; partners cannot read Imports or their files. Optional files use shared validation and independent Import ownership.
14. Source-owned information is not copied into editable Import fields. No deferred UI/category, rejection, financial-field or historical-migration scope is introduced.

## Context for agents

Live production repository: `Frontline-Forwarding/frontline-forwarding`, read through authenticated `gh`; reviewed main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a`. Import and Export customs entities do not exist on this baseline. Linked tickets describe planned contracts; verify their implementation before integration. Java paths below are relative to `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Implementation context |
| -- | -- |
| `docs/reference/database.md` | Shipment content keeps Shipment/handling-unit identity and Order-at-loading; current allocation uniqueness is not Import declaration uniqueness. Existing foreign keys preserve historical references. Add Import persistence/coverage/events and attachment ownership without repurposing physical allocation. |
| `domain/shipments/ShipmentLoadUnitContentRepository.java`; `web/shipments/service/ShipmentOutputAssembler.java` | Historical contents retain stable colli and loading-time Order identities. Distinguish arrival-closed contents from later planned pre-dispatch removal. |
| `web/shipments/service/ShipmentsApiService.java` | Existing cancellation is PREPARING-only; add Import guard without broadening it. Partial Shipment preparation retains colli IDs while creating child Orders. No saved membership-edit command exists on this baseline; FRO-344 owns that planned operation. |
| `web/purchaseorders/service/PurchaseOrdersApiService.java`; `docs/workflows/purchase-order-colli-journey.md` | Splits and terminal dispositions preserve identity/history; they must not erase a historical declaration. `AWAITING_IMPORT` means warehouse intake, not this customs lifecycle. |
| `domain/purchaseorders/PurchaseOrderParties.java` | Supplier, Client and Invoicing company are distinct; Import Shipper is an explicit Company selection. |
| `docs/workflows/attachments.md`; `web/attachments/service/AttachmentsApiService.java` | Extend owner validation/access for Import and preserve shared file rules. |
| `docs/architecture/authorization.md`; `domain/users/UserAuthority.java` | Reuse staff/authority conventions; add Import authorities and tests. |
| `docs/reference/graphql-api.md`, `rest-api.md`, `mcp-tools.md` | Define supported Import operations and regenerate affected contracts/docs; do not invent existing endpoints. |

Affected systems: backend entity/storage, validations, authorization, attachment ownership, API contracts and Shipment guards in `frontline-forwarding-app`; generated client contracts where required, but no frontend presentation work. The current Order regime implementation is separately present on the FRO-356 branch; this ticket does not perform customs-regime transitions or depend on merging that work.

## Post-deployment verification

Read-only checks against controlled fixtures and implementation test results; never create, edit, cancel or confirm production records for verification.

| Criteria | Read-only check |
| -- | -- |
| 1–4 | Read unfinished/full/partial fixture Imports and the eligible-colli response; compare Shipment, Shipper, normalized MRN and coverage. Review tests for invalid submission, duplicate MRN and concurrent allocation. |
| 5–7 | Read payable, no-payment and both inspection fixture histories; verify status, applicable dates, payment requirement and Άδεια receipt, with no fabricated payment/inspection events. |
| 8–9 | Compare fixture lock states and event dates; review tests for MRN corrections, file removal, initial progressed recording, future/out-of-order dates and duplicate/stale requests. |
| 10 | Read cancelled fixture history/files and eligibility of its former coverage; review tests for permission/stage rejection and absence of deletion/reactivation. |
| 11–12 | Read Imports before/after controlled Shipment-edit, split and movement fixtures; compare stable coverage and attribution. Review cancellation/removal/race test results and unchanged physical/customs facts. |
| 13–14 | Read as authorized staff and attempt reads as a partner test user; verify denial through direct/reverse/file paths. Review attachment-validation and schema tests for scope exclusions. |

**Reference:** FRO-317 (Export pattern), FRO-325 (Shipment participation/packing), FRO-344 (membership editing integration), FRO-322 (deferred Shipment category), FRO-356 (separate Order regime). [Reviewed production source](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/5c51030680c9d45b3827a7e19b8320c19aa5ed9a).
