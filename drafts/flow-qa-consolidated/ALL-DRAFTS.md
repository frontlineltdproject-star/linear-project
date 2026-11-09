# All consolidated drafts — review only

---

No Linear changes have been made. Metadata, coverage and review gates are in README.md.

---

# Shipment forms — preserve drafts & expose Record arrival

**Shipment** creation and Details must preserve the operator's unfinished work when warehouse data loads, another card saves or the operator changes tabs.

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| 1. Origin change | Start Shipment creation from a stocked Order, enter a Note, then select an origin whose eligible-goods data is not already loaded. The form disappears, returns to the original origin and loses the Note. Changing origin country so no warehouse is selected can leave it loading indefinitely. |
| 2. Independent Notes | Open Internal and External Notes. Start saving Internal, then type more in External before the response arrives. Completing Internal Save restores the older External draft and discards the later typing. |
| 3. Arrival draft | On a dispatched launch-station Shipment, enter recipient name/address, Received by and proof reference. After a refused arrival attempt, visit Overview and return to Available actions. The entries and error disappear. |

Evidence: QA-OS-01/07/08 were reproduced using actual client components with controlled network results. The origin finding establishes reset/freeze behavior; a literal exception in the reported live incident remains unverified.

## Acceptance criteria

1. **Origin:** changing origin warehouse/country keeps the form usable through loading, empty and failed lookup results. Clearing origin leaves its controls available. The original Order-link preselection never overrides later choices.
2. **Creation draft:** preserve unrelated entered values. Re-evaluate eligible cargo and explain incompatible selections; do not retain invalid cargo just to preserve the draft. Changing origin creates no Shipment, reservation or split.
3. **Notes:** a successful save closes only its own editor and preserves the latest text in other open drafts, including typing during the request. Test both save directions and failure. Cancel remains scoped to its own draft.
4. **Arrival:** tab/language changes preserve the same Shipment's unfinished handover fields. Refused submissions retain recoverable inputs and actionable feedback; returning to the tab does not silently reset them. Verify each applicable handover form.
5. Cover all three cases with focused regressions. Preserve existing permissions, EN/EL presentation, explicit cancellation and successful-save behavior. Drafts must not leak into another Shipment.

### Record arrival from Overview

6. For a **DISPATCHED** Shipment with the existing `recordArrival` capability, show **Record arrival** in the Overview status card. Keep the existing Available actions entry.
7. The Overview action opens the existing purpose-specific arrival/handover form in a dialog. Reuse its required inputs, validation and explicit confirmation; opening the dialog does not record arrival. Preserve existing purpose-specific final-handover wording where applicable and the warehouse-transfer path.
8. Both entry points share the same Shipment's unfinished arrival draft and submission state. Switching tabs, closing/reopening the dialog or receiving a refused submission must not silently erase input or create two independent pending submissions. A confirmed arrival refreshes status/actions; losing eligibility disables submission with an explanation.
9. Verify authorized/unauthorized and eligible/ineligible records, each applicable purpose, dialog dismissal/reopening, switching between entry points, rejection, pending duplicate prevention and successful confirmation in isolation. Compare the Overview action and existing action against the same server capability and lifecycle guard.

Evidence: the missing Overview action was reported by the operator and confirmed in the source layout; this is an access-point change, not a new arrival lifecycle.

## Decisions and scope

Reuse the existing arrival form and per-card save boundaries, with the additional Overview dialog entry point. Preserve local unfinished work without changing eligibility or lifecycle rules. Browser-reload/cross-device autosave, saved-version conflict handling and comment retry identity are outside this ticket.

## Context for agents

Reviewed production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. A source revision is not proof of the deployed version.

Affected system: `frontline-forwarding-client`.

* Origin: `src/features/shipments/hooks/use-shipment-creation.ts` and `src/routes/secured/shipments/new.tsx` replace the form while candidate data loads, then reuse the initial seed.
* Notes: `src/features/shipments/components/details/shipment-notes-card.tsx`, `shipment-overview-tab.tsx` and `shipment-details-prepared-page.tsx` merge an async completion into an older whole-draft snapshot.
* Arrival: `src/features/shipments/components/details/shipment-arrival-form.tsx` owns local fields while `src/components/ui/tabs.tsx` unmounts inactive panels.

Use QA scenarios **OS-010/029/030**. The existing evidence assertions demonstrate faulty behavior; replace them with the required outcomes for fix regressions. Backend mutation contracts remain unchanged.

## Post-deployment verification

| Criterion | Read-only check |
| -- | -- |
| 1 | Compare the deployed creation source/build with the uncached, empty-origin and failed-lookup results for OS-010. |
| 2 | Inspect OS-010's preserved-input and cargo-eligibility results, including evidence of no creation/reservation writes. |
| 3 | Review OS-029's delayed-save results in both directions and its failure/cancel controls. |
| 4 | Inspect an existing dispatched Shipment's arrival controls; review OS-030 results for tab/language changes and refused handover. |
| 5 | Review permission, record-switch and successful-save regression results against the deployed build. |

These checks are read-only. Use existing records and isolated test evidence; do not submit live saves, uploads or lifecycle actions. Missing evidence remains Unverified.

**Reference:** [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316>) · [FRO-341](<https://linear.app/front-line-ltd/issue/FRO-341>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/4ec2ce7ce41b875695a5336612e92f4176ecc3dd/docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md>).


---

# Order colli forms — edit saved creation rows & validate measurements

**Order** colli entry must remain usable when the colli set changes, and locally accepted measurements must satisfy the API's existing rules. Order = purchase order = stock-list item; colli = handling unit.

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| 1. Stock-entry crash | On a Ready Order, open Record arrival and set PO in stock and enter storage position. Add/save a colli from the Collis tab, or receive that change through a refresh. The open panel reads a missing measurement entry and throws a TypeError. Empty and populated initial Orders both reproduce it. |
| 2. Misleading validation | During creation, enter colli dimensions 1.5 × 2 × 3 cm and Save the row. It is accepted without error, but Create submits a fractional value to an integer API field. Zero dimensions and zero gross weight also pass the shared client validator despite server rejection. |

Evidence: QA-OS-09/11 have isolated component/validator reproductions. The fractional request was checked against the actual GraphQL integer scalar. Refreshed props simulated the new colli; no live colli save or invalid database persistence was executed.

## Acceptance criteria

1. A changed current colli set never crashes the open stock-entry panel. Preserve storage position and measurements already entered for retained collis; initialize inputs for added collis and exclude removed/terminal collis from the confirmation payload.
2. Stock confirmation requires the complete current nonterminal colli set and valid required measurements. An empty Ready Order remains editable but cannot enter stock without collis. Do not fabricate stock, arrival or measurements during a refresh.
3. Apply the existing measurement rules at row Save and final Create/save: dimensions are all blank where optional, or three positive whole numbers in cm. When weights are supplied, gross is positive; optional net is nonnegative and cannot exceed gross. Positive decimal weights and zero net remain valid.
4. Invalid rows remain available for correction with actionable field feedback and no invalid submission. Use the same rules in creation and saved colli editors; retain server validation.
5. Add regressions for added collis with empty/populated initial sets, retained drafts, fractional/zero/incomplete measurements and valid optional/decimal-weight controls. Preserve edit permissions and open-Shipment restrictions.

### Edit a saved row before Order creation

6. After local row **Save**, the operator can expand the same colli and type changes to dimensions, gross kg and net kg before **Create Order**. Reuse the current expanded controls; a separate saved-record Edit mode is not required.
7. Preserve row identity and unrelated input; apply the measurement rules above to changed rows and final submission. Create submits the latest accepted values. Local row Save/edit performs no business-record creation.
8. Reproduce add → Save row → expand → edit dimensions/gross/net → Create in the actual mounted form. Cover multiple rows, clearing optional fields, invalid corrections and final-submit locks; inspect submitted and persisted values in isolation.

Evidence: the operator pressed only row Save, not final Create, and could not type into the numeric fields. Source appears wired for editing; root cause and deployed-build equivalence remain unverified.

## Decisions and scope

Keep the current measurement contract rather than silently rounding input or changing API types. These are form fixes; no new colli identities, stock lifecycle, warehouse rules or independent-colli movement model is introduced.

## Context for agents

Reviewed production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. A source revision is not proof of the deployed version.

Affected system: `frontline-forwarding-client`, verified against existing `frontline-forwarding-app` rules.

* `client/src/features/purchase-orders/components/details/order-status-card.tsx`: measurement drafts initialize once, while the current colli list changes. `order-details-page.tsx` keeps the panel mounted across tabs.
* `client/src/features/purchase-orders/components/details/order-collis-tab.tsx`: shared numeric validator; `client/src/features/purchase-orders/components/creation/creation-collis.tsx` and `creation-draft.ts` consume it.
* `app/src/main/resources/graphql/purchase-orders.graphqls`: integer dimensions. `app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java`: positive dimensions/gross, optional valid net.

Here `client` means `frontline-forwarding-client` and `app` means `frontline-forwarding-app`. QA scenarios: **OS-031/033**.

## Post-deployment verification

| Criterion | Read-only check |
| -- | -- |
| 1 | Review OS-031's empty/populated add-and-refresh results and retained measurement/position assertions. |
| 2 | Compare existing Order/colli stock measurements with isolated complete-set and empty-Order rejection results. |
| 3 | Inspect deployed field constraints/API types and OS-033's invalid/valid numeric matrix. |
| 4 | Review row-validation feedback and request-capture results for Create and saved colli editing. |
| 5 | Review the recorded permission/reservation and retained-draft controls against the deployed build. |

These checks are read-only. Use existing records and isolated test evidence; do not submit live saves, uploads or lifecycle actions. Missing evidence remains Unverified.

**Reference:** [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326>) · [FRO-335](<https://linear.app/front-line-ltd/issue/FRO-335>) · [FRO-336](<https://linear.app/front-line-ltd/issue/FRO-336>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/4ec2ce7ce41b875695a5336612e92f4176ecc3dd/docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md>).


---

# Order & Shipment — prevent stale overwrites and duplicate comment retries

**Order and Shipment** saves must remain bound to the information the operator reviewed. Retrying an unresolved Shipment comment must not create another comment.

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| 1. Order retry | Edit Message number at version 7; the first save receives a conflict. Refresh to version 8 and reopen confirmation. While it is open, another save changes Supplier reference at version 9 and a background refresh supplies it. Confirm: the request sends version 9 with the old Supplier reference, although that reversal was absent from the review. |
| 2. Packing review | Open a packing review with a 120 cm unit. Another operator saves 200 cm. After a background refresh, or a conflict followed by reload, the old review can submit 120 cm with the newer version and confirm readiness. |
| 3. Comment retry | A comment commits but its response is lost. Another Shipment edit advances its version; refresh, then retry the unchanged comment. The retry receives a different request ID, which the server treats as a separate comment. |

Evidence: QA-OS-05/06/10 reproduce outgoing requests using actual client code. Duplicate-comment behavior was simulated with an ID-keyed recipient. Backend overwrite/replay effects were traced, not executed against a running database.

## Acceptance criteria

1. **Order:** initial and renewed confirmations retain the exact reviewed version and intended changes. A refresh while review is open must invalidate/rebuild that review or submit its original version for server rejection; never substitute the newest version into old intent.
2. **Packing:** preserve the draft on conflict, but require renewed review before confirming changed canonical packing. Neither refresh-before-submit nor conflict/retry can overwrite a newer arrangement or attest an obsolete plan as Ready.
3. **Atomic refusal:** stale requests leave saved fields, packing, status and successful audit unchanged. Retain editable inputs and an actionable conflict. Preserve unrelated card drafts and existing server version/permission checks.
4. **Comments:** keep the same request identity and bound content until an uncertain attempt is resolved. An unrelated Shipment version change cannot turn that retry into a new operation. Same-ID replay returns the original comment; a deliberately new comment with identical text remains distinct.
5. Exercise each sequence with controlled refresh/lost responses and isolated backend verification. Include controls for the first Order save, retry without a version change, changed-content identity conflict and successful saves. Prevent repeat submission while pending.

## Decisions and scope

Group these submission-safety defects, with separate acceptance checks for each. Do not remove server conflict checks, deduplicate comments solely by text, introduce comments editing/deletion or change lifecycle/permission rules. This ticket does not add a new Order idempotency API.

## Context for agents

Reviewed production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. A source revision is not proof of the deployed version.

Affected consumers: client Details/review state, Order update, Shipment packing/readiness and comment replay contracts.

* `frontline-forwarding-client/src/features/purchase-orders/components/details/order-details-card.tsx`: conflict clears baseVersion; confirmation later falls back to current props instead of capturing the renewed review's version.
* `frontline-forwarding-client/src/features/shipments/hooks/use-shipment-details.ts`: commands use the latest query version; retry keys include version even for unversioned comments. `frontline-forwarding-client/src/features/shipments/components/details/shipment-packing-modal.tsx` retains its old draft/review.
* Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/`: `purchaseorders/service/PurchaseOrdersApiService.java` checks the submitted version under lock; `shipments/service/ShipmentsApiService.java` applies reviewed packing; `shipments/service/ShipmentHistoryApiService.java` replays a comment by request ID.

QA scenarios: **OS-027/028/032**. Preserve existing accepted-request recovery; a known conflict and an uncertain committed outcome are different cases.

## Post-deployment verification

| Criterion | Read-only check |
| -- | -- |
| 1 | Review OS-032's requests: renewed confirmation must not acquire an unreviewed version or Supplier reference reversal. |
| 2 | Review OS-027's refresh-before-submit and conflict/retry requests plus isolated saved-packing/readiness outcomes. |
| 3 | Compare rejection/rollback results with canonical record and audit snapshots; inspect retained-draft assertions. |
| 4 | Compare request/comment IDs in OS-028's lost-response replay and intentional identical-text cases. |
| 5 | Review first-save, no-refresh retry, changed-content conflict and pending-submit controls against the deployed build. |

These checks are read-only. Use existing records and isolated test evidence; do not submit live saves, uploads or lifecycle actions. Missing evidence remains Unverified.

**Reference:** [FRO-316](<https://linear.app/front-line-ltd/issue/FRO-316>) · [FRO-325](<https://linear.app/front-line-ltd/issue/FRO-325>) · [FRO-326](<https://linear.app/front-line-ltd/issue/FRO-326>) · [FRO-344](<https://linear.app/front-line-ltd/issue/FRO-344>) · [FRO-345](<https://linear.app/front-line-ltd/issue/FRO-345>) · [FRO-346](<https://linear.app/front-line-ltd/issue/FRO-346>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/4ec2ce7ce41b875695a5336612e92f4176ecc3dd/docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md>).


---

# Shipment packing — preserve omitted net weight and historical journey details

**Shipment packing** updates must preserve omitted net weight and notes on retained load units and the original packaging facts associated with earlier colli journeys.

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| 1. Hidden net weight | A retained load unit has gross 80 kg and net 70 kg. Submit otherwise valid packing with gross cleared and net omitted. The resolver also clears net; both-empty validation succeeds. This can erase a value absent from the normal packing editor. |
| 2. Earlier loading context | Confirm PALLET / PALLET-A, producing LOADED events. Before dispatch, edit the same retained unit to CARDBOARD_BOX / BOX-B and save the plan without confirming physical repacking. Earlier journey reads resolve the mutable unit's new type/label, making the old event describe the new packaging. |

Evidence: QA-OS-12 was reproduced by executing the actual extracted Java resolution/validation code. QA-OS-13 is established by the update, journey-read and SQL-guard paths; its database before/after reproduction is still required. The old event/time remains; its returned packaging context changes.

## Acceptance criteria

1. **Omission:** retained net weight and notes remain unchanged when omitted, through both Save packing and Confirm readiness. Explicit updates/clears retain their existing meaning.
2. **Validation:** with saved gross 80/net 70, clearing gross while omitting net rejects the whole operation and preserves weights, version, readiness and audit. Gross 90 with net omitted retains 70. Explicitly clearing both remains valid.
3. **Historical context:** changing a retained unit's fields must not change the original packaging facts returned for an earlier physical journey event. The current saved plan exposes its new values separately. Preserve event identity/time, load-unit traceability and operation before/after facts.
4. **Physical truth:** a plan save creates no physical loading/unpacking event. Later confirmation records only its legitimate effects. Preserve the existing protection for removed/replaced units referenced by history.
5. Verify both defects with isolated service/API/database tests, including rejected-operation rollback. Any schema change uses a new migration and preserves existing records. If historical facts cannot be recovered from recorded evidence, keep them explicitly unknown rather than inventing them.

## Decisions and scope

Retain the existing omission and historical-preservation contracts. Leave the storage design to implementation; do not introduce a new operator-facing packing entity, independent colli movement, post-dispatch editing or automatic historical reconstruction.

## Context for agents

Reviewed production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. A source revision is not proof of the deployed version.

Affected system: `frontline-forwarding-app`; packing persistence and the Order/colli journey projection. Java paths below are relative to `src/main/java/com/frontline/forwarding/`.

* `web/shipments/service/ShipmentPackingPlan.java` supplies a null net fallback when gross is null; `web/shipments/service/ShipmentInputValidator.java` accepts both weights null.
* `web/shipments/service/ShipmentsApiService.java` applies the plan for Save and Confirm. `domain/shipments/ShipmentLoadUnitRepository.java` updates retained units in place.
* `web/purchaseorders/service/PurchaseOrderOutputAssembler.java` reads current type/label for old load-unit references. V34/V38 migrations permit current pre-dispatch edits while protecting retired units.

Migrations are in `src/main/resources/db/migration/`. QA scenarios: **OS-034/035**. Existing omission tests supply gross; existing retirement tests do not check historical labels after editing a retained unit.

## Post-deployment verification

| Criterion | Read-only check |
| -- | -- |
| 1 | Review OS-034 results for omitted net/notes through both Save and Confirm. |
| 2 | Compare recorded before/after weights, versions and audit for rejected and explicit-clear controls. |
| 3 | Compare an existing original journey snapshot with its current read after a documented retained-unit edit; otherwise use isolated OS-035 evidence and mark the live check unavailable. |
| 4 | Compare existing plan operations with physical events and removed-unit historical references. |
| 5 | Review service/API/database rollback results and any migration/evidence-preservation checks. |

These checks are read-only. Use existing records and isolated test evidence; do not submit live saves, uploads or lifecycle actions. Missing evidence remains Unverified.

**Reference:** [FRO-325](<https://linear.app/front-line-ltd/issue/FRO-325>) · [FRO-345](<https://linear.app/front-line-ltd/issue/FRO-345>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/4ec2ce7ce41b875695a5336612e92f4176ecc3dd/docs/qa/runs/2026-11-09-order-to-arrival-second-pass.md>).


---

# Order & Shipment creation — diagnose and resolve attachment upload 401

**Order and normal Shipment creation** must allow an authorised user to stage a valid attachment and create the record with that file. Diagnose the reported **Refused: Request refused (401)** response and fix its demonstrated cause.

## Reported problem and established evidence

Selecting a file starts staging before Create: open a private creation context, then upload the bytes. A refusal leaves the selected file rejected and blocks creation until resolved or explicitly removed.

The real server cause is unresolved. Injecting 401 at either context opening or file upload reproduces the exact client message and Create blocking. This does not prove why the deployed server returned 401. The inspected REST upload service supplies the same authorization-header helper as GraphQL; missing credentials or incorrect user permissions are not established causes.

## Investigation and acceptance criteria

1. Identify the failing stage and record reproducible evidence: method/endpoint, timestamp, status, redirects and deployed client/server versions. Correlate the refusal with the component producing it, including the first backend exception where applicable; a proxy/authentication refusal may never reach the application. Check header presence without recording token values. Distinguish authentication, endpoint configuration and storage/error handling from one another.
2. Resolve the evidenced cause. In an isolated compatible environment, verify both paths separately: stage a valid file, create one Order; repeat for one normal Shipment. List/download each associated file and compare bytes and metadata. If refusal was valid for the tested identity, document why and prove the authorised workflow works without weakening permissions.
3. Preserve security: current identity, authority and creator/entity/context ownership remain enforced. Foreign, expired, removed or incomplete upload references remain rejected; do not bypass access checks to suppress 401.
4. Failures retain the form and identify the affected file. No creation with unresolved selected uploads. Explicit removal excludes that file without erasing unrelated inputs; no partial business record or attachment association on failure.
5. Lost upload/create responses recover or replay the original operation and result without duplicate records/files. Test successful staging, rejected staging, storage failure, expiry and lost responses. Creating without files remains supported.
6. Record the resolution of both contract clarifications below. Do not close this issue based only on reproducing the error message, assuming a permissions fix or removing attachments from the workflow.

## Contract clarifications

| Finding | Required treatment |
| -- | -- |
| QA-OS-03 | Use [FRO-342](https://linear.app/front-line-ltd/issue/FRO-342)'s staged-before-Create, atomic-association contract. Propose the matching correction to contradictory post-create wording in [FRO-336](https://linear.app/front-line-ltd/issue/FRO-336); no silent change to the agreed upload behavior. |
| QA-OS-04 | [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) requires a creation context even without files; the inspected Order form can submit a null context before any upload. Confirm whether to align that path or obtain an explicit owning-contract amendment. Record the decision and recovery tests. This discrepancy is not proof of duplicate creation or the 401 cause. |

## Decisions and scope

Keep diagnosis and the resulting fix in one ticket, with completion tied to successful upload/creation evidence. No permission-model redesign, fiscal/email integration change or historical-arrival/inline-Order upload expansion. Amendments to other ticket descriptions remain separately reviewed.

## Context for agents

Reviewed production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. A source revision is not proof of the deployed version.

Affected consumers: client staging and Create guards, backend creation contexts/storage, creation association and outcome recovery.

* `frontline-forwarding-client/src/features/creation-uploads/creation-upload-service.ts` opens context by PUT and uploads by POST; `use-staged-files.ts` classifies refusal.
* `frontline-forwarding-client/src/features/purchase-orders/components/creation/purchase-order-creation-form.tsx` blocks unresolved files; `frontline-forwarding-client/src/app/config/env.ts` allows separate REST/GraphQL destinations.
* Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`: `web/creationuploads/service/CreationContextsApiService.java`, `system/config/SecurityConfig.java` and `system/storage/DisabledSystemFileStorageService.java` are investigation points, not established faulty components.

QA scenarios: **OS-005/006**. The injected-client harness proves message/guard behavior only; use real isolated HTTP/storage integration for diagnosis.

## Post-deployment verification

| Criterion | Read-only check |
| -- | -- |
| 1 | Inspect the correlated refusal trace, producing component and deployed configuration/build; exclude credential values. |
| 2 | Review successful isolated Order and Shipment receipts; inspect existing authorised attachment metadata/downloads where available. |
| 3 | Review identity, authority and creator/context rejection results for the deployed version. |
| 4 | Inspect failure/removal request captures and rollback evidence showing retained drafts and no partial creation. |
| 5 | Compare upload/create attempt IDs and resulting record/file identities in recovery, expiry and no-file controls. |
| 6 | Read both recorded contract resolutions and any separately approved wording correction. |

These checks are read-only. Use existing records and isolated test evidence; do not submit live saves, uploads or lifecycle actions. Missing evidence remains Unverified.

**Reference:** [FRO-335](<https://linear.app/front-line-ltd/issue/FRO-335>) · [FRO-336](<https://linear.app/front-line-ltd/issue/FRO-336>) · [FRO-341](<https://linear.app/front-line-ltd/issue/FRO-341>) · [FRO-342](<https://linear.app/front-line-ltd/issue/FRO-342>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/4ec2ce7ce41b875695a5336612e92f4176ecc3dd/docs/qa/runs/2026-11-09-order-to-arrival.md>).


---

# Supplier Invoice — reliable creation, correction & cancellation

**Supplier Invoice** must preserve operator intent, saved facts and recoverable outcomes throughout the workflows below. Each workflow has its own acceptance and verification checks.

Order = purchase order = stock-list item. Colli = physical handling unit.

## Problems to fix

### Creation and files

| Case | Reproduction and current result |
| -- | -- |
| QA-SI-01 — replacement during creation | Submit invoice A with a file, delay its response, leave and open creation from another Order. Choose Discard and start, then select B's file without submitting B. A's late success sends B's file to A's saved invoice. Replacing an unknown attempt can also forget its recovery context and allow another creation. |
| QA-SI-02 — cancelled lookup | Open creation from Order A with its lookup delayed. Cancel, open from Order B and type invoice facts. A's late lookup changes the selected Order to A while B's facts and origin remain. |
| QA-SI-03 — failed return | Create successfully, then make Return to Order navigation fail. The confirmed result and saved ID disappear, and an actionable Create form returns. |

Evidence: four isolated frontend observations reproduce these requests/state changes. Navigation, server and storage were mocked; live wrong-owner persistence or a duplicate invoice was not demonstrated.

### Details and cancellation

| Case | Reproduction and current result |
| -- | -- |
| QA-SI-04 — cancellation recovery | Confirm cancellation and lose its response. Close the dialog through Cancel: Check original attempt and navigation protection disappear, and a correction request becomes possible without checking the outcome. Pending cancellation also lacks navigation/unload protection. |
| QA-SI-05 — unreviewed cancellation | Open confirmation at version 3/net 100.00. Another operator changes net to 900.00/version 4; background refresh receives it. Confirm sends version 4 without renewed review. |
| QA-SI-06 — later typing | Save invoice number SENT, then type LATER into the still-enabled field while saving. Original success closes the editor and loses LATER. The same loss occurs when Check original attempt confirms the earlier save. |

Amounts/versions are synthetic examples. Isolated frontend tests demonstrate lost state and outgoing requests; no live cancellation or backend guard bypass was performed.

### Vessel identity and activity

QA-SI-07: an active invoice references eligible vessel 101. Change it to a different eligible vessel 102 with the same name and save. The service compares display names, reports no change and returns vessel 101. If Invoice number changes in the same save, persistence proceeds with vessel 102, but activity omits the vessel correction.

The IDs are synthetic fixtures. Exact extracted production methods reproduce the comparison/no-op behavior; the persistence branch and schema were inspected. Full backend/database execution remains outstanding.

## Acceptance criteria

### Creation and files

1. **Unresolved creation:** preserve the original request identity, submitted payload, Order and file context while pending or unknown. Leaving, reopening or choosing Discard and start must not forget or replace that attempt or permit a new creation before its outcome is resolved.
2. **File ownership:** bind every queued file and upload/retry to its own creation attempt and returned invoice ID. A late response must never upload another draft's files or replace that draft's state. Reconcile uncertain uploads using the same owner/file identity; retain successful uploads and pending bytes without duplicate creation/upload.
3. **Late lookups:** responses from a cancelled or superseded form cannot change a newer draft's selected Order, derived context, entered facts or files. Explicit selection in the current draft remains authoritative.
4. **Failed return:** retain confirmed invoice ID, actual invoiced Order, originating Order and document outcomes when navigation fails. Keep an actionable result/recovery view and allow navigation retry without repeating creation. Preserve the existing deliberate-leave warning for remaining local files; Start another invoice remains an explicit action after unresolved work is handled.
5. **Preservation controls:** known rejection retains editable facts/files; cancelling an unsubmitted draft creates/uploads nothing; explicit new creation after resolved work still works. Preserve permission, eligibility, duplicate and validation rules, and refresh the actual invoiced Order rather than merely the origin.
6. **Verification:** cover all three cases with controlled delays/failures, including pending and unknown replacement, real route departure/re-entry in an isolated browser, successful navigation and same-file retries. Verify stored attachment ownership and bytes in an isolated integration run; convert observation assertions into expected-behavior regression checks.

### Details and cancellation

1. **Cancellation recovery:** retain the unresolved cancellation and access to Check original attempt until an authoritative result is obtained. Cancel, close, Escape and dialog dismissal must not silently reset pending/unknown to idle. Failed checks keep recovery available; closing the window does not undo a sent request.
2. **Conflicting actions and navigation:** while cancellation is pending/unknown, prevent a new correction or cancellation attempt until reconciliation. Apply existing in-app navigation and unload protection. Any permitted dismissal/leave path must not falsely present the outcome as resolved; returning must reconcile before further mutations.
3. **Reviewed cancellation:** capture the version reviewed when confirmation opens. A refresh must either invalidate confirmation and require renewed review, or retain that version for server conflict rejection. Never silently adopt a newer version. After a conflict, require fresh review; if cancellation becomes ineligible, disable confirmation and retain server checks.
4. **Later typing:** either prevent incompatible editing during pending/unknown correction, or preserve accepted later typing as unsaved work when the original save/check succeeds. Save only the originally submitted payload; never silently discard or automatically submit later changes.
5. **Preservation controls:** keep one card editor, ordinary correction's captured version, submitted-fact comparison during unknown-result recovery, and known-rejection draft retention. Preserve permission, Export/event and cancelled-record guards. Failed/stale requests must leave saved facts and successful activity unchanged.
6. **Verification:** exercise all cases with controlled response loss, delayed saves and background refresh. Cover every dialog dismissal path, real isolated-browser navigation, cancellation success/rejection/check failure, and unrelated-writer recovery. Confirm actual stale refusal and saved/audit outcomes in isolated backend tests.

### Vessel identity and activity

1. **Reference identity:** a change between different eligible vessel IDs is a real correction, regardless of name equality. Vessel-only correction persists and returns the requested ID after re-read, retaining invoice identity and unrelated facts. An unchanged ID with unchanged facts remains a genuine no-op.
2. **Complete activity:** vessel-only and combined-field corrections record the vessel change with distinguishable old/new references and actor/time, atomically with the save. Combined correction includes every changed fact in one correction activity. Preserve existing activity readability and successful version progression.
3. **Existing guards:** preserve optional-vessel clearing, different-name changes, Client association, authorization, cancellation/Export/event restrictions, duplicate checks and stale-version rejection. Rejected corrections leave saved facts and successful activity unchanged. Do not merge/rename vessels or require unique names to avoid the defect.
4. **Verification:** run isolated backend/database tests for same-name vessel-only and combined changes, same-ID no-op, different-name change, clear, unauthorized/ineligible reference and stale correction. Re-read saved vessel ID/version and activity; validate the authorized correction response/read and Details consumer. Extracted-method checks alone are insufficient.

## Decisions and scope

### Creation and files

Verify creation-state defects separately from Details correction and cancellation. Reuse the existing Create and Order entry designs. No new invoice workflow, permission, attachment API, cross-entity upload repair or changes to unrelated Order/Shipment tickets.

### Details and cancellation

Group the three Details interaction defects, retaining separate checks for each. Existing editing and confirmation components remain the presentation contract. No new cancellation eligibility, reactivation, exemption progression or general concurrency API. The agreed full-Order-split exception and its specification wording are outside this fix.

### Vessel identity and activity

Verify backend identity/audit behavior independently of frontend operation handling. Use existing Vessel records and Supplier Invoice correction contracts; no vessel-picker redesign, master-data restructuring, automatic repair of existing invoices or historical activity backfill.

## Context for agents

### Creation and files

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; not proof of the deployed version.

Under `frontline-forwarding-client/src/features/supplier-invoices/`:

* `components/supplier-invoice-create-page.tsx`: replacement resets shared state; late creation reads its current file queue; selection tokens survive only within one instance; finish clears state before return navigation succeeds.
* `create/create-draft.ts`: shared draft, request, file and saved-result state.
* `services/supplier-invoice-service.ts`: `createSupplierInvoice` and invoice-owned `POST /api/v1/supplier-invoices/{id}/attachments`, carrying `clientFileKey`.

Affected consumers: standalone/Create-from-Order entry, result/recovery, attachment uploads and actual/origin Order refresh. Preserve [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321)'s server ownership and replay protections; this ticket repairs client coordination. QA scenarios: SI-010/012/013/014/026/027.

### Details and cancellation

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed behavior remains unverified.

* `frontline-forwarding-client/src/features/supplier-invoices/components/supplier-invoice-detail-page.tsx`: dirty/busy state omits pending cancellation; dialog close clears unknown; confirm uses current invoice.version; save/checkSave close the editor despite later input.
* Adjacent `supplier-invoice-confirmation.tsx`: shared dismissal and recovery controls.
* `frontline-forwarding-client/src/features/supplier-invoices/services/supplier-invoice-service.ts`: `correctSupplierInvoice` and `cancelSupplierInvoice(id, expectedVersion)`.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/supplierinvoices/SupplierInvoiceService.java`: version, authorization and lifecycle checks; correction/cancellation and activity are transactional.

Affected consumers: Details cards, confirmation/recovery, navigation guards, canonical invoice and Order refresh. Ordinary correction-version protection already works and must remain. QA scenarios: SI-016/017/018/020.

### Vessel identity and activity

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; not proof of the deployed version.

Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/`:

* `supplierinvoices/SupplierInvoiceService.java`: changes compares vesselName values; an empty change list returns current; otherwise update and CORRECTED activity run together.
* `supplierinvoices/SupplierInvoiceRepository.java`: writes `freight_supplier_invoice.vessel_id` and stores `freight_supplier_invoice_activity.changes`.
* `vessels/VesselRepository.java`: distinct associated vessel records can share a name.

`frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql` and `V18__shared_client_vessels.sql` permit distinct same-name identities. The frontend Details editor already submits vessel IDs; preserve that contract.

Affected consumers: `correctSupplierInvoice`, its shared REST service, subsequent invoice reads, Details vessel reference and activity reads. QA scenario: SI-028. The comparison harness uses Java 11 stand-ins; the real backend requires Java 25 and database verification.

## Post-deployment verification

### Creation and files

Read-only checks using existing records and isolated evidence; submit no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect pending/unknown replacement recordings and request logs for retained original identity and no new creation before reconciliation. |
| 2 | Compare captured file keys/bytes and persisted attachment owners across the two drafts and retry controls. |
| 3 | Inspect the cancelled-lookup recording: the current selected Order and entered facts remain unchanged. |
| 4 | Inspect failed-return evidence for the saved result/ID and a navigation-only retry. |
| 5 | Review rejection, pre-submit Cancel, fresh-creation and correct-Order refresh controls. |
| 6 | Review isolated browser/integration results and their build SHA against the deployed build. |


### Details and cancellation

Read-only checks using existing records and isolated evidence; submit no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect lost-response/dismissal recordings and failed-check results for retained recovery. |
| 2 | Inspect action availability and browser navigation evidence while cancellation is pending/unknown. |
| 3 | Compare reviewed and submitted versions in refresh/conflict recordings; inspect stale refusal and ineligible-state controls. |
| 4 | Compare original request, saved value and later draft in delayed-save and Check original attempt evidence. |
| 5 | Review controls and canonical record/activity snapshots for preserved protections and no rejected-write effects. |
| 6 | Match isolated frontend/browser/backend results and their build SHA to the deployed build. |


### Vessel identity and activity

Read-only checks using existing records and isolated evidence; submit no production corrections. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Compare requested, returned and re-read vessel IDs in isolated vessel-only results; inspect same-ID no-op/version evidence. |
| 2 | Read vessel-only and combined activity records; compare old/new references, other changed facts and actor/time with saved results. |
| 3 | Review clear/different-name and rejected-write controls, comparing before/after record and activity snapshots. |
| 4 | Review database-backed results and response/Details evidence against the deployed build SHA. |

**Reference:** [FRO-321](<https://linear.app/front-line-ltd/issue/FRO-321>) · [FRO-347](<https://linear.app/front-line-ltd/issue/FRO-347>) · [FRO-349](<https://linear.app/front-line-ltd/issue/FRO-349>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA findings](<https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/runs/2026-11-09-supplier-invoice.md>) · [Creation evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/evidence/supplier-invoice-create-qa.test.tsx>) · [FRO-348](<https://linear.app/front-line-ltd/issue/FRO-348>) · [Details evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/evidence/supplier-invoice-details-qa.test.tsx>) · [Backend evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/evidence/supplier-invoice-backend-qa-repro.py>).


---

# Delivery Notes — preserve drafts & recover lifecycle actions

**Delivery Notes** must preserve operator intent, saved facts and recoverable outcomes throughout the workflows below. Each workflow has its own acceptance and verification checks.

## Problems to fix

### Movement drafts

| Case | Reproduction and current result |
| -- | -- |
| QA-DN-01a — refreshed version | Edit a vehicle number without saving. A background refresh returns a higher note version. The editor remounts and silently replaces the local input with server values. A same-version refresh preserves input. |
| QA-DN-01b — delayed save | Save value A, then type B while the request is pending. When A's save succeeds, the editor resets to A and discards B. |

Both cases were reproduced with isolated frontend tests and mocked services. Incorrect backend persistence was not demonstrated. “Refresh” here means refreshed query data in the open editor; restoring drafts after a browser restart is outside scope.

### Cancellation, replacement and submission

| Case | Reproduction and current result |
| -- | -- |
| QA-DN-02 — blocked replacement | Companies A and B have issued notes on one Shipment. Cancelling A prepares a fresh A draft with incomplete movement details. B remains issued, so the common editor is hidden and the replacement cannot be completed through the normal UI. |
| QA-DN-03 — inaccessible reconciliation | A submission remains SUBMISSION_PENDING after an uncertain response. The backend can reconcile it, but the card exposes no action to reach that path. |
| QA-DN-05 — uncertain cancellation | Every cancellation-call runtime failure returns the note to ISSUED, including a lost response after possible AADE acceptance. Failure saving an accepted response can instead leave CANCELLATION_PENDING without a recovery route. |

The first two UI states were reproduced in isolation and their backend paths traced. QA-DN-05 is a source-supported risk requiring isolated backend reproduction; no production incident or AADE result was observed.

## Acceptance criteria

### Movement drafts

1. **Dirty refresh:** retain entered movement fields and address selections when note versions refresh. Identify that the saved version changed; do not silently replace input, accept a newer version for the old draft, or retry a stale save. Require deliberate resolution before saving against changed data. Discard/reload must be explicit.
2. **Delayed save:** bind completion to the submitted draft and note/version set. Either prevent incompatible editing while pending or retain any later input the form accepts as unsaved after completion. Never discard that input or save it automatically as part of the earlier request.
3. **Draft identity:** late responses cannot overwrite a different Shipment, replacement note or newer editing session. If the editable note set or lifecycle changes, retain the local values for review and explain why saving is unavailable; never transfer them automatically to different notes.
4. **Preservation controls:** a clean form may adopt refreshed saved values. Same-version refresh, failed save and validation errors preserve local work. Keep atomic all-DRAFT saving, complete note/version checks, existing permissions and validation, and saved-before-preview/issuance protections.
5. **Verification:** add regression checks for both losses, clean/same-version controls, stale saves, lifecycle changes and late responses. Exercise the real editor with controlled delays in an isolated browser; verify the submitted payload and resulting saved values separately from unsaved input.

### Cancellation, replacement and submission

1. **Usable replacement:** after confirmed cancellation of A, allow an authorized operator to complete and save A's replacement movement details, preview it and issue it while B remains issued. Use the existing individual-draft update contract for mixed states. Check readiness against the target draft; preserve all-DRAFT atomic common saving when applicable.
2. **Sibling/history protection:** leave B's status, fiscal identity, movement facts and documents unchanged. Retain cancelled A and its fiscal evidence. If replacement preparation fails, report cancellation as completed and preparation as failed; a preparation-only retry must create at most one current replacement and must not repeat cancellation.
3. **Submission check:** expose **Check submission status** for an authorized SUBMISSION_PENDING note, with loading, confirmed and unresolved feedback. Invoke existing pending reconciliation with the note's expected version. Repeated clicks must not send another invoice, allocate another fiscal number or regenerate submitted XML. An inconclusive lookup remains pending.
4. **Uncertain cancellation:** a transport timeout, lost response or unclassified error must remain CANCELLATION_PENDING. Return to ISSUED only after a confirmed rejection that establishes cancellation did not occur. Display the unresolved outcome; block blind cancellation retries and replacement preparation until the external result is established.
5. **Confirmed-result recovery:** preserve available cancellation confirmation and allow local completion to be retried idempotently after a persistence failure, without another external cancellation. A transport-unknown result may be resolved only using authoritative evidence. The current adapter has no cancellation-status lookup: verify any proposed mechanism before using it. Without proof, retain pending status and explain that cancellation needs verification; do not claim an automatic reconciliation capability exists.
6. **Guards and presentation:** retain Shipment/note ownership, issuer-company access, action permissions, expected-version checks and existing fiscal validation. Reject stale or unauthorized direct requests. Reuse existing note-card/form/button/feedback components, with EN/EL labels and feedback. Keep successful cancellation followed by replacement as the current default.
7. **Verification:** reproduce each case independently in isolated frontend/backend/database tests. Cover A/B replacement, failed preparation and retry, pending lookup match/no-match/error, accepted cancellation with response loss, accepted cancellation with local-save failure, confirmed rejection, stale requests and duplicate clicks. Mock AADE; make no fiscal production calls.

## Decisions and scope

### Movement drafts

Group the two losses because both concern ownership of the open movement draft. Reuse the existing form and feedback components; no new screen or component. Preserve current address lookup, reusable-location and fiscal rules. [FRO-373](https://linear.app/front-line-ltd/issue/FRO-373) remains responsible for its separate origin/Notes/arrival cases; this ticket does not expand it.

### Cancellation, replacement and submission

Group these corrections because they repair the current note lifecycle and its recovery entry points. [FRO-283](https://linear.app/front-line-ltd/issue/FRO-283)**/284 are references only, not prerequisites or implementation owners.** Do not change them. Exclude their broader future cancellation choices, history redesign and failed-submission policy. No cancellation-without-replacement feature, new recovery dashboard, grouping change or fiscal-number policy.

## Context for agents

### Movement drafts

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed version unverified.

Under `frontline-forwarding-client/src/features/shipments/`:

* `components/delivery-notes-card.tsx`: editor key includes note IDs/versions; save success resets to the captured submitted values.
* `hooks/use-delivery-notes.ts`: mutations invalidate refreshed note queries.
* `services/delivery-note-service.ts`: draft serialization and save requests.

Backend `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/DeliveryNotesApiService.java` owns `updateDeliveryNoteDraftsForShipment`; retain its atomic version/state checks. Data owner: `freight_delivery_note`. No schema or historical-data migration is required. Scenarios DN-009/010/011/012.

### Cancellation, replacement and submission

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed version unverified.

Client `frontline-forwarding-client/src/features/shipments/`: `components/delivery-notes-card.tsx` contains all-note edit/readiness checks and omits pending actions; `services/delivery-note-service.ts` chains cancellation and preparation.

Backend prefix: `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`:

* `web/deliverynotes/service/DeliveryNotesApiService.java`: individual update exists; common update requires every current note DRAFT.
* `web/deliverynotes/service/DeliveryNoteIssuanceService.java`: pending reconciliation uses the original submission reference through `findTransmittedInvoice`, without resending.
* `web/deliverynotes/service/DeliveryNoteCancellationService.java`, `DeliveryNoteCancellationLifecycle.java` and `domain/deliverynotes/DeliveryNoteRepository.java`: broad failure handling, versioned transitions and local completion.
* `system/aade/AadeMyDataClient.java`: submission lookup and cancellation contracts; no cancellation reconciliation operation.

Affected operations: `updateDeliveryNoteDraft`, `createDeliveryNotesForShipment`, `issueDeliveryNote`, `cancelDeliveryNote`. Preserve `freight_delivery_note`, its lines and `delivery_note_number_counter` identity/history constraints. Do not bulk reset existing pending notes; reconcile each from its own evidence. Scenarios DN-014/015/017/019/020/022.

## Post-deployment verification

### Movement drafts

Read-only checks of isolated evidence and existing records; make no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect dirty-refresh/stale-save recordings for retained input, visible conflict and no automatic overwrite or retry. |
| 2 | Compare the delayed request payload, saved response and later input; confirm any accepted later input remains unsaved. |
| 3 | Inspect late-response and replacement/lifecycle-change evidence for correct draft ownership and blocked invalid saves. |
| 4 | Review clean/same-version, failure, permission, validation and preview/issuance controls. |
| 5 | Compare the tested build SHA with the deployed build and inspect browser/network and saved-value evidence. |


### Cancellation, replacement and submission

Read existing records and isolated evidence only; do not trigger production submission, cancellation or reconciliation mutations. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect the A/B recording and saved records: replacement A completes while B remains issued. |
| 2 | Compare B and cancelled A before/after; inspect preparation failure/retry logs for one replacement and no second cancellation. |
| 3 | Inspect matched, unmatched and failed lookup traces: original submission identity retained, no resend or new number. |
| 4 | Inspect timeout/response-loss/rejection fixtures and persisted states; uncertainty must never appear as confirmed ISSUED. |
| 5 | Review accepted-result persistence-failure/recovery evidence, retained confirmation and unresolved-result safeguards. |
| 6 | Review role/company/version controls and EN/EL recordings using existing components. |
| 7 | Review isolated backend/database results and external-call counts; compare tested and deployed build SHAs. |

**Reference:** [FRO-247](<https://linear.app/front-line-ltd/issue/FRO-247>) · [FRO-307](<https://linear.app/front-line-ltd/issue/FRO-307>) · [FRO-373](<https://linear.app/front-line-ltd/issue/FRO-373>) · [QA findings](<https://github.com/frontlineltdproject-star/linear-project/blob/8101d8ea12f0279782a7ff5d6dff8f94e80bb48b/docs/qa/runs/2026-11-09-delivery-note.md>) · [UI evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/8101d8ea12f0279782a7ff5d6dff8f94e80bb48b/docs/qa/evidence/delivery-note-qa.test.tsx>) · [FRO-283 — reference only](<https://linear.app/front-line-ltd/issue/FRO-283>) · [FRO-284 — reference only](<https://linear.app/front-line-ltd/issue/FRO-284>).


---

# Delivery Notes — keep movement dates and times consistent in XML and PDF

**Delivery Note XML and PDF** must describe the same movement date and time, regardless of the offset used to store or transport the timestamp.

## Problems to fix

QA-DN-04: the client sends movement time as UTC. XML formats the received offset directly and drops it; PDF converts the same instant to Europe/Athens.

Synthetic example: `2026-11-10T00:30+02:00` and `2026-11-09T22:30Z` are the same instant. With the UTC representation, the current XML expressions produce **9 November, 22:30**, while PDF produces **10 November, 00:30**. Summer offsets also differ.

The formatting mismatch was reproduced using the source expressions. Actual JDBC round-trip, full XML generation and rendered PDF verification remain outstanding. This is not evidence of a specific incorrect production submission.

## Acceptance criteria

1. **Common movement timezone:** derive XML `dispatchDate` and `dispatchTime` from the saved movement instant converted to **Europe/Athens**, matching the existing PDF rule. UTC and other offset representations of the same instant must produce the same movement date/time. Preserve the instant; never relabel it as local time or add a fixed offset.
2. **Calendar boundaries:** handle winter/summer offsets, midnight date rollover and daylight-saving transitions with the named timezone. Verify date and time together at the document formats' existing precision; do not change their schema or precision.
3. **Complete data path:** verify client serialization, API parsing, database persistence/readback, the real XML builder and PDF model/rendering using the same fixtures. The result must not depend on server or database session timezone. Include draft preview and issued-document generation.
4. **Fiscal/history protection:** preserve saved timestamps, submitted XML, fiscal identities and existing historical documents. Do not rewrite old submissions or recalculate their identities. Movement time is distinct from issue time: pending reconciliation must continue using the original submission's fiscal date/series/number/recipient, never the movement date. Check this boundary around midnight; do not silently broaden the change into an unverified issue-date policy.
5. **Verification:** add backend/database integration regressions for equivalent offsets, winter/summer and date/DST boundaries, plus existing-document and pending-submission controls. Compare actual XML values with the rendered PDF. Keep all AADE calls mocked and retain existing validation and permissions.

## Decisions and scope

Use the PDF's existing Europe/Athens convention for movement output consistency. No new timezone preference, timestamp backfill, historical-document repair, numbering change or UI redesign. This corrects serialization in the existing flow and does not depend on [FRO-283](https://linear.app/front-line-ltd/issue/FRO-283)/284. It makes no new statutory claim about AADE requirements.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed version unverified.

* `frontline-forwarding-client/src/features/shipments/services/delivery-note-service.ts`: draft update uses `toISOString()`.
* Backend service prefix `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/`: `AadeDeliveryNoteXmlBuilder.java` formats movement offsets directly; `DeliveryNotePdfModelFactory.java` converts to Europe/Athens; `DeliveryNoteIssuanceService.java` builds the pending lookup reference from issue facts.
* `docs/reference/database.md`: `freight_delivery_note.movement_start_at` and `issued_at` are separate timestamp-with-time-zone columns. Keep stored submitted XML and fiscal evidence intact.

Scenarios DN-018/024; preserve pending-submission behavior from DN-017. The earlier expression observation is a starting reproduction, not a substitute for the real persistence and document checks.

## Post-deployment verification

Inspect isolated evidence and existing records/documents only; make no production writes or fiscal calls. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Compare equivalent-offset fixtures' XML dispatch values and PDF movement values in Europe/Athens. |
| 2 | Inspect winter/summer, midnight and DST fixture outputs for matching calendar date/time. |
| 3 | Compare captured API payload, stored/read-back instant, actual XML and rendered PDF across server/session timezone controls. |
| 4 | Compare historical-document hashes and fiscal fields; inspect pending lookup references around midnight for the original submission date. |
| 5 | Review full backend/database/document regressions and compare tested and deployed build SHAs. |

**Reference:** [FRO-247](<https://linear.app/front-line-ltd/issue/FRO-247>) · [QA findings](<https://github.com/frontlineltdproject-star/linear-project/blob/8101d8ea12f0279782a7ff5d6dff8f94e80bb48b/docs/qa/runs/2026-11-09-delivery-note.md>) · [Timestamp evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/8101d8ea12f0279782a7ff5d6dff8f94e80bb48b/docs/qa/evidence/delivery-note-time-repro.py>).


---

# Export — preserve drafts, reviewed changes & operation recovery

**Export** must preserve operator intent, saved facts and recoverable outcomes throughout the workflows below. Each workflow has its own acceptance and verification checks.

## Problems to fix

### Creation and files

| Case | Reproduction and current result |
| -- | -- |
| QA-EX-01 — lost work | Enter facts and choose a file, then use Dashboard and return: the draft is gone. Departure after an unknown Create result loses original-attempt recovery. Open Export after a failed upload loses the pending file and Retry. |
| QA-EX-02 — misleading discard | Click Create, then Cancel while the response is delayed. Discard claims “Nothing has been saved,” but the original request can still succeed and upload its original files after departure. |
| QA-EX-03 — changing files during creation | Submit with file A, remove A and choose B before the response. A uploads anyway; B remains Staged without a usable upload/retry action. |

Isolated tests demonstrate these UI/request defects. They do not prove duplicate Exports or files sent to a different Export.

### Details and Customs actions

| Case | Reproduction and current result |
| -- | -- |
| QA-EX-04 — unreviewed version | Open an editor, then receive another operator’s changes through refresh. Save uses the newer version with the old draft, potentially overwriting facts. An unchanged invoice editor can remove their newly added invoice. Open EAD/IE599/cancellation confirmations also silently use the newer version. |
| QA-EX-05 — later work erased | Save, then continue typing or removing invoices while pending. The earlier response closes the editor and loses later work. It can also close a replacement editor opened after Escape. |
| QA-EX-06 — unknown treated as failure | Lose an EAD/IE599 or cancellation response. The UI says “Nothing changed”; closing loses the original date/reason, and a changed retry is allowed without checking what happened. |

Isolated tests demonstrate outgoing requests and lost UI state. Actual persisted overwrites or duplicate Customs/cancellation events were not demonstrated.

## Acceptance criteria

### Creation and files

1. **Unfinished work:** protect in-app departure, including Dashboard, Back and Open Export, when draft facts or unuploaded files would be lost. Keep retains the work; intentional discard clearly identifies what will be lost. Preserve browser unload protection without promising automatic recovery of file bytes after a closed browser.
2. **Submitted creation:** pending or unknown creation must not be treated as an unsent draft. Preserve the original request and its recovery; prevent replacement Create while unresolved. Any permitted departure must retain a route to reconciliation. Never claim that leaving cancels the request or proves nothing was saved.
3. **Late results:** associate success/rejection and subsequent uploads with the original attempt. A late response must not overwrite a replacement draft or use its files. Retain the saved Export identity and per-file outcome if onward navigation fails.
4. **File changes:** freeze conflicting file controls during submission or handle accepted changes consistently. A removal presented as effective must not upload that file; a newly accepted file must remain uploadable. No file may become stranded without upload/retry or an explicit discard path.
5. **Upload recovery:** preserve pending bytes, file keys and the saved owner through supported in-app recovery. Retry failed files against that same Export without recreating it or duplicating successful files. Leaving with unfinished uploads requires protection.
6. **Preservation:** retain existing eligibility, MRN/group uniqueness, request replay and attachment ownership checks. Check original attempt resends the original creation unchanged. Keep known-rejection drafts and existing EN/EL presentation consistent.
7. **Verification:** add regression coverage for all three cases, including delayed success/rejection, unknown result, failed onward navigation and partial uploads. Exercise actual isolated-browser navigation and verify stored file ownership/content and retry behavior in isolated backend/storage tests.

### Details and Customs actions

1. **Reviewed version:** capture the version when Details, invoice membership, EAD, IE599 or cancellation review begins. Refresh must not silently substitute a newer version. Retain the reviewed version for conflict rejection or require explicit renewed review. Preserve drafts on rejection; recheck current eligibility before another submission.
2. **Invoice intent:** retain the membership baseline reviewed by the operator. Background additions must not become removals merely because they are absent from an older draft. An unchanged editor must not remove another operator’s invoice. Resolve conflicts through fresh review without automatically resubmitting the old selection against a newer version.
3. **Later edits:** either prevent incompatible changes while saving or retain accepted later typing/invoice changes as unsaved work. A response belongs to its original operation and must not close or reset a newer/replacement editor. Never silently submit later edits.
4. **Unknown outcome:** distinguish confirmed rejection from a lost/uncertain response. For EAD, IE599 and cancellation, retain the Export, action, submitted date/reason, reviewed version and payload. Do not show “Nothing changed” without a definitive rejection. Closing, Escape, reopening or navigation must not silently forget the unresolved operation.
5. **Reconciliation:** block conflicting replacement writes until the original outcome is checked. Failed reads retain uncertainty and recovery. Compare authoritative record/activity with the submitted operation; another operator’s similar change is not proof of this attempt’s success. Require explicit review before any changed date/reason/version is submitted.
6. **Preservation:** retain pending-dialog dismissal locks, one active card editor, ordinary conflict-draft retention and server permission/version/date/stage checks. Preserve post-EAD edit/removal/cancellation restrictions, invoice membership rules, protocol/history and unchanged invoice VAT events. Successful reconciliation refreshes Details and affected summaries.
7. **Verification:** cover every consumer in criterion 1, both editors in criterion 3, and EAD/IE599/cancellation unknown results. Use controlled refresh, delayed responses, dialog dismissal, actual isolated-browser navigation and unrelated-writer cases. Verify stale refusal, saved facts/membership and event history in isolated backend tests.

## Decisions and scope

### Creation and files

Creation covers draft → submitted attempt → saved result → upload recovery. Reuse the existing creation and document components. No new business eligibility, autosave service, list/menu work or VAT printing/stamping workflow.

### Details and Customs actions

Details covers saved-record review → edit/confirm → submit → recovery. Reuse existing Details cards and confirmation components. No new Customs eligibility, cancellation policy, shared concurrency API, list/Entry navigation feature or detailed VAT printing/stamping workflow.

## Context for agents

### Creation and files

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployment equivalence is unverified.

* `frontline-forwarding-client/src/features/exports/components/export-create-page.tsx`: local draft/attempt/files; beforeunload-only protection; send/created/upload closures; direct Open Export navigation.
* Adjacent `export-create-layout.tsx` and `export-documents-card.tsx`: pending Cancel and file controls; result retries accept failed files only.
* `frontline-forwarding-client/src/features/exports/services/export-service.ts`: create and upload contracts; retain request ID and owner/file key.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/exports/ExportCreationService.java` and `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/exports/service/ExportAttachmentsApiService.java`: authoritative creation/replay and attachment guards.

Affected consumers: Create page, application navigation, saved-result panel and file recovery. Six isolated creation observations/controls reproduce the baseline; passing observation tests are not fix verification. Complete portal/storage execution remains outstanding.

### Details and Customs actions

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployment equivalence is unverified.

* `frontline-forwarding-client/src/features/exports/details/components/export-detail-page.tsx`: editors/dialogs omit reviewed-version capture; writes use current record.version; membership diffs use refreshed invoices; success clears editors; unknown Customs/cancel outcomes become failed and dismissal clears context.
* Adjacent `export-detail-identity-card.tsx`, `export-detail-invoices-card.tsx`, `export-detail-customs-dialog.tsx` and `export-detail-cancel-dialog.tsx`: edit controls and dismissal behavior. Pending confirmation dismissal is already blocked.
* `frontline-forwarding-client/src/features/exports/export-errors.ts` recognizes unknown outcomes; `services/export-service.ts` under the same feature forwards updateDetails, updateInvoices, confirmEad, confirmIe599 and cancel inputs.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/exports/ExportEditingService.java`: requires the supplied version to match current state; supplying an unreviewed newer version defeats the intended stale-review protection.

Affected consumers: Details fields, invoice membership/connected Orders, Customs/cancellation, summaries, protocol and activity. Order = purchase order = stock list item. Fifteen isolated UI observations/controls cover the baseline; extracted Java guard controls use stand-ins, not Spring/database execution. Full browser and persisted-outcome verification remain outstanding.

## Post-deployment verification

### Creation and files

Read-only checks against recorded isolated results and the deployed build; submit no production writes. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect navigation/unload recordings for retained facts/files and explicit discard. |
| 2 | Inspect pending/unknown departures, original-request recovery and replacement-Create availability. |
| 3 | Compare original request, late result, replacement draft and failed-navigation result. |
| 4 | Inspect delayed A-remove/B-add recordings and resulting file queue/content. |
| 5 | Compare owner IDs, file keys, stored bytes and retry results across partial failures. |
| 6 | Review preserved guard/replay controls, rejection retention and EN/EL messages. |
| 7 | Match browser/backend/storage regression results and their build SHA to the deployed build. |


### Details and Customs actions

Read-only checks against recorded isolated results and the deployed build; submit no production writes. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Compare opened/reviewed/submitted versions for all five actions and inspect conflict retention. |
| 2 | Compare baseline, colleague addition, submitted delta and saved membership. |
| 3 | Compare original payload, later draft and replacement editor after delayed responses. |
| 4 | Inspect lost-response messages and retained date/reason/version across dismissal and navigation. |
| 5 | Inspect reconciliation reads, failed checks and unrelated-writer cases before replacement actions. |
| 6 | Review permission/stage controls and record, summary, protocol and activity snapshots. |
| 7 | Match frontend/browser/backend regression results and their build SHA to the deployed build. |

**Reference:** [FRO-317](<https://linear.app/front-line-ltd/issue/FRO-317>) · [FRO-350](<https://linear.app/front-line-ltd/issue/FRO-350>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA findings](<https://github.com/frontlineltdproject-star/linear-project/blob/40787d4/docs/qa/runs/2026-11-09-export-to-customs-completion.md>) · [Creation evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/40787d4/docs/qa/evidence/export-create-qa.test.tsx>) · [FRO-352](<https://linear.app/front-line-ltd/issue/FRO-352>) · [Details evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/40787d4/docs/qa/evidence/export-details-qa.test.tsx>).


---

# Shipment Invoice — creation, replacement, recovery & consistent layout

**Shipment Invoice creation and correction actions** must retain prepared values, the original submitted attempt and the saved destination until the outcome is resolved.

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| QA-SHI-01 — replacement defaults | Prepare a replacement for a cancelled invoice dated 02-11-2026 on 09-11-2026. The form restores the original date and cleared Client/company choices after receiving correct replacement defaults, then submits those restored values. |
| QA-SHI-04 — uncertain creation | Lose the Create response, edit Notes and retry: a new request ID is sent for the same Shipment/goods. Leaving and reopening can also replace the unresolved identity. The form incorrectly claims that the draft was not saved. |
| QA-SHI-07 — reconciled discard | Discard succeeds but its response is lost. Check saved state reads DISCARDED, yet Details shows Draft and does not complete the return to Shipment. |
| QA-SHI-08 — saved navigation | Create succeeds, then navigation rejects asynchronously. The form stays locked without saved-record recovery. Replacement retains Open saved record but misses the navigation-failure message. |

These cases were reproduced with isolated UI/service/router boundaries. The evidence proves incorrect values and outgoing request identities, not duplicate production records or a live browser incident.

## Acceptance criteria

1. **Replacement values:** initialize the unsaved replacement with today's date in Europe/Athens and the current prefill. Keep invalid Client/company references cleared until staff choose valid replacements. Preserve copied manual fields and subsequent operator edits across renders and evaluation; displayed and submitted values must agree. Keep the original cancelled invoice unchanged; replacement preparation alone creates nothing.
2. **Truthful creation result:** distinguish confirmed rejection from pending/unknown outcome. A timeout, lost response or unclassified failure must not claim that nothing was saved. Preserve input, expose recovery and block a fresh independent Create while the original attempt is unresolved.
3. **Original-attempt recovery:** retain the original request ID, Shipment, captured fields and selected source-row IDs. Recover through the existing actor/payload-bound replay contract with that same ID and unchanged payload. Later edits must not replace the submitted snapshot or silently disappear. Adopt the returned invoice's identity and current lifecycle, including a record subsequently discarded; do not create a replacement record merely because the original is terminal.
4. **Departure and reopening:** protect internal navigation, Back and browser unload while creation is pending/unknown. Any permitted departure, reload or page remount must retain a recoverable original attempt within the same authenticated session. Reopening must not silently turn it into a fresh Create. Late responses remain associated with their original attempt and cannot overwrite another editor's work.
5. **Discard recovery:** when an authoritative read confirms DISCARDED after an uncertain discard, recognize the terminal status, retain the absence of edit/finalize/discard actions and complete navigation to the original Shipment. If navigation fails, retain that destination and a retry. If the read fails or does not confirm discard, keep the result unresolved or show the actual conflict; do not claim success or repeat discard automatically. Keep discarded records excluded from the Shipment card.
6. **Saved navigation:** handle both immediate and asynchronous navigation failures after Create, replacement and discard. Retain the confirmed saved identity/destination, explain that the action succeeded but navigation failed, and provide a retry that performs navigation only. Repeated retry must not create another draft/replacement or repeat discard. Preserve the existing working replacement retry action.
7. **Preservation:** keep staff authorization, expected-version and actor/payload checks, incomplete-valid-draft saving, eligibility/currency rules, intentional overlap warnings, one-live-replacement protection and numbering unchanged. Retain dirty/pending safeguards and existing EN/EL components and feedback. Creating or recovering an unnumbered draft must not allocate a printed number.
8. **Verification:** add regression coverage for all four cases through the integrated hosts. Include default resets, cleared parties, delayed success/rejection, unknown results followed by edits/reload/remount, exact-payload replay, a replayed discarded record, failed discard reconciliation and rejected navigation Promises. Verify request identity, persisted record count/current state and action call counts in isolated browser/backend/database tests.

### Standard creation-page layout

9. **Shipment Invoice creation** uses the same content width and outer alignment as standard entity pages. Remove the additional narrow form constraint while retaining the shared shell and responsive gutters.
10. Preserve the existing card order, fields, validation and behavior in ordinary creation and replacement preparation. Verify desktop/narrow EN/EL layouts without clipping or horizontal overflow.

Source: `components/shipment-invoice-create-form.tsx` adds `max-w-5xl` inside the shell's `max-w-[100rem]` content area.

## Decisions and scope

This ticket owns preparation and action-result recovery for the existing Shipment Invoice flow. [FRO-244](https://linear.app/front-line-ltd/issue/FRO-244)**,** [FRO-363](https://linear.app/front-line-ltd/issue/FRO-363) **and** [FRO-366](https://linear.app/front-line-ltd/issue/FRO-366) **are references only, not prerequisites or implementation owners; preserve their descriptions and status.** Reuse current Create/Details components, with the standard creation-page width specified above. No new recovery dashboard, list/menu, printing, general autosave service or changes to another document flow. Goods, totals, review and frozen-line corrections belong to the separately agreed Shipment Invoice goods-consistency ticket.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed-build equivalence is unverified.

* Client prefix `frontline-forwarding-client/src/features/shipment-invoices/`: `create/shipment-invoice-create-page.tsx` owns the payload-keyed request ref and navigation adapter; `components/shipment-invoice-create-form.tsx` owns failure/leave/saved-result handling.
* `details/use-invoice-editor.ts`, `details/use-invoice-actions.ts` and `details/shipment-invoice-details-page.tsx` own form defaults, replacement prefill, reconciliation and destination callbacks. Trace actual asynchronous callbacks, not only synchronous test doubles. `shipment-invoice-mapping.ts` maps DISCARDED incorrectly.
* Backend `domain/shipmentinvoices/ShipmentInvoiceService.java` already replays Create by request ID, actor, kind and payload, returning the record's current state even after discard. Preserve this and `ShipmentInvoiceRepository.java` request storage/locking. No new lookup endpoint is assumed.

Affected consumers: initial Create, replacement editor, Details lifecycle/recovery, router guards, cached invoice/Shipment-card reads and existing create/replay contracts. Retained UI observations establish the baseline defect, not fix verification; full browser/database execution remains outstanding.

## Post-deployment verification

Read existing records, recordings and isolated test results only; submit no production writes. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Compare replacement prefill, rendered fields and submitted values; verify the original is unchanged and cancelling preparation creates nothing. |
| 2 | Inspect confirmed-rejection versus lost-response recordings and fresh-Create availability. |
| 3 | Compare original/recovered request ID, actor, payload, returned identity/current lifecycle and persisted record count. |
| 4 | Inspect navigation/Back/reload/remount and late-response recordings for retained attempt ownership and input. |
| 5 | Inspect successful, failed and conflicting reconciliation; compare terminal status, card exclusion, action count and Shipment destination. |
| 6 | Review rejected navigation Promise tests and repeated retry logs: only navigation repeats. |
| 7 | Review role/version/replay/eligibility/currency/overlap/replacement guards, number allocation and EN/EL results. |
| 8 | Match integrated browser/backend/database regression evidence and its source SHA to the deployed build. |

**Reference:** [FRO-244](<https://linear.app/front-line-ltd/issue/FRO-244>) · [FRO-363](<https://linear.app/front-line-ltd/issue/FRO-363>) · [FRO-366](<https://linear.app/front-line-ltd/issue/FRO-366>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA findings](<https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/runs/2026-11-09-shipment-invoice.md>) · [Create evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-create-qa.test.tsx>) · [Details evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-details-qa.test.tsx>).


---

# Shipment Invoice — goods, totals, review & automatic packing

**Shipment Invoice goods, totals and review** must follow current eligible source rows during preparation and preserve the declared frozen contents after finalization. Order means purchase order / stock-list item; colli means physical handling unit.

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| QA-SHI-02 — hidden frozen lines | A finalized/cancelled invoice returns complete frozen line values after its live source-row link becomes null. Details omits the line while retaining its value in the frozen total. |
| QA-SHI-03 — stale review | Review goods covering collis A/B, then correct allocation to A only while eligibility and commercial values remain unchanged. The fingerprint stays equal and finalization accepts the stored acknowledgement. |
| QA-SHI-05 — unavailable value | A saved draft contains eligible EUR10 and EUR20 rows. The EUR20 row becomes partly covered and unavailable; evaluation and the draft read still total EUR30, although finalization correctly refuses it. |
| QA-SHI-06 — selection lost on regrouping | The same eligible source row moves from participating Order A to Order B on the same Shipment. Refresh drops its selection and reports the old group entry as removed. |

UI observations and extracted backend methods reproduce these defects in isolation. The allocation/deletion database paths were traced; real SQL/concurrency and deployed-browser behavior remain unverified.

## Acceptance criteria

1. **Frozen history:** render every persisted frozen line of FINALIZED and CANCELLED invoices even when its live source-row link is null. Use document identity plus persisted line position for display identity; retain frozen ordering, source references, description, HS code, quantity/unit, prices/amounts and currency. Keep frozen document fields, total and printed number unchanged. Never reconstruct historical values from current source rows or invent a deleted source ID.
2. **Eligible selection identity:** reconcile refresh by stable source-row identity across the complete current eligible Shipment goods. Preserve a still-eligible selection when its current offering Order changes; show it under that Order without duplication or an unavailable warning caused only by regrouping. Preserve unaffected selection/order and document input. New rows remain unselected; genuinely unavailable selections retain the existing explicit removal/review behavior.
3. **Active totals:** calculate draft/evaluation totals and currency membership from currently eligible selected rows only. Exclude absent, deleted and offered-but-ineligible rows from monetary aggregation while retaining their unavailable/deleted warnings and finalization requirements. No eligible rows returns no full total; one eligible currency returns its sum; multiple eligible currencies remain a conflict with no combined total. Do not substitute the manual partial amount/currency or invent an empty EUR0 total. Apply consistently to evaluation, saved-draft reads, Details and Shipment-card totals.
4. **Allocation-aware review:** bind acknowledgement to relevant current allocation state/coverage as well as the existing selected identities, values, eligibility and checked packing/weight/partial fields. A coverage change must invalidate review even when the row remains eligible and its value is unchanged. Canonicalize coverage deterministically so the order of an unchanged set does not cause a false change. Preserving selection under criterion 2 must not preserve a stale acknowledgement.
5. **Finalization and existing drafts:** re-evaluate authoritative source/allocation state before finalization and reject a stale stored or submitted acknowledgement before freezing or allocating a number. Existing drafts whose stored fingerprint no longer matches the corrected calculation require renewed review; an attempted save with a stale acknowledgement must not mark them reviewed. Use the existing comparison/storage contract without rewriting finalized/cancelled history or blanket-clearing unrelated data.
6. **Preservation:** retain whole-row allocation, single-currency validation, unavailable-selection refusal, overlap warnings, staff permissions, expected versions, frozen records and number/replacement safeguards. Consume existing allocation results; do not add allocation writes to Shipment Invoice, alter Order commercial-edit/Shipment-membership rules or introduce quantity/value prorating. Reuse existing EN/EL goods, totals and review presentation.
7. **Verification:** cover each finding in isolated integrated UI/backend/database tests. Include frozen FK-null lines in both terminal states; a row moved between participating Orders; eligible EUR10 plus unavailable EUR20; unavailable rows in another currency; no eligible rows and mixed eligible currencies; same-eligibility coverage changes, deterministic coverage ordering, old stored fingerprints and stale finalization. Confirm unaffected controls and consumers retain their required behavior.

### Automatic physical packing from selected goods

8. Derive **Packing details** from the final shipping packages/load units containing the currently eligible selected invoice goods. Count distinct final packages once across rows and Orders; never sum original collis after consolidation.
9. Derive **Total weight (gross kg)** only from reliable final-package gross measurements attributable to those goods. Do not substitute whole-Shipment totals for a subset, count a package repeatedly, or prorate weight by quantity/value.
10. Evaluate count and weight independently. Missing/ambiguous allocation, packing or measurements leaves the affected automatic result unavailable with an explanation and permits a manual value. Missing is not zero. A package shared with unselected goods cannot contribute its entire weight as the selected goods' weight.
11. Recompute automatic results when selected goods or relevant final packing changes. Retain manual input for review rather than silently overwriting it. Relevant changes invalidate acknowledgement; finalization requires review of current goods and physical values together.
12. Apply consistently to Create, draft evaluation/read/edit, replacement preparation and finalization. Re-evaluate authoritative allocation/packing before freezing; reject stale review. Persist accepted document values and retain terminal FINALIZED/CANCELLED values without recalculation from current packing.
13. Preserve incomplete draft saving, required packing/weight before finalization, existing numeric validation, whole-row commercial allocation and frozen document consumers. Copied replacement values remain reviewable inputs, not proof that current physical totals are correct.
14. Verify several commercial rows in one package; consolidated original collis; a subset occupying complete packages; shared packages; ambiguous confirmed-group allocation; missing weights; manual input; changes after review; replacements; stale finalization and frozen history.

Packing details remains free text: the automatic value states the distinct final-package count in the current language. Total weight uses gross kg, nonnegative, at most three decimals. Fill automatic values while no manual value is in use; retain an entered manual value until the operator explicitly chooses to recalculate it. If goods or packing changes, retain manual values but require renewed review before finalization.

## Decisions and scope

One ticket owns goods consistency through source changes, review and frozen history. [FRO-244](https://linear.app/front-line-ltd/issue/FRO-244)**,** [FRO-363](https://linear.app/front-line-ltd/issue/FRO-363)**,** [FRO-366](https://linear.app/front-line-ltd/issue/FRO-366) **and** [FRO-301](https://linear.app/front-line-ltd/issue/FRO-301) **are references only, not prerequisites or implementation owners; preserve their descriptions and status.** Consume the existing allocation contract and expose authoritative physical calculations consistently through draft evaluation/read/save/finalize. Exclude allocation redesign/backfill, list/menu, new printing/PDF features and discounts, Export and VAT paperwork. Creation/replacement/discard/navigation recovery belongs to the separately agreed Shipment Invoice recovery ticket; no blocking dependency between the two correction groups is established.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed-build equivalence is unverified.

* Client prefix `frontline-forwarding-client/src/features/shipment-invoices/`: `shipment-invoice-mapping.ts` drops null live IDs in `linesAsOrders`; `create/selection.ts` reconciles only beneath the former Order. Follow their Create/Details consumers and the Shipment invoices card.
* Backend prefix `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`: `domain/shipmentinvoices/ShipmentInvoiceEvaluations.java` aggregates offered-ineligible values and omits allocation coverage from the fingerprint; `ShipmentInvoiceReview.java` compares the calculated/stored fingerprint; `ShipmentInvoiceService.java` shares evaluation across draft reads/save/finalize. `ShipmentInvoiceGoodsReader.java` already exposes current row locations server-side.
* `web/shipmentinvoices/service/ShipmentInvoiceOutputs.java` supplies frozen fields with `position` even when `invoiceRowId` is null. `V47__shipment_invoices.sql` preserves frozen columns and nulls the live FK on deletion. Use invoice ID plus position; the internal line ID is not currently exposed. `PurchaseOrdersApiService.java` permits row correction only outside open Shipment participation; preserve that restriction.

Relevant storage: `freight_shipment_invoice.reviewed_fingerprint`, `freight_shipment_invoice_line.position`, nullable `invoice_row_id`, frozen line columns and existing source-row allocation state/version. Existing fingerprint comparison can require renewed review for old drafts without a history rewrite. All exposed evaluation/read/save/finalize paths must share the corrected rules. The four QA corrections need no new endpoint; the automatic physical calculation must be available consistently to all affected consumers.

Additional physical sources: `domain/shipments/ShipmentLoadUnitRepository.java` and `ShipmentLoadUnitContent.java` provide active final-package identities/membership; `ShipmentLoadUnitWeight.java` carries gross/net weights. `docs/workflows/shipment-invoice.md` and `graphql/shipment-invoices.graphqls` define the existing packing text, kg validation and frozen fields.

## Post-deployment verification

Read existing records and isolated evidence only; do not change production source rows, allocation, invoices or review state. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Compare terminal API/UI lines, positions and frozen values after isolated source deletion; confirm unchanged total/number and both lifecycle states. |
| 2 | Inspect refresh recordings and submitted source IDs across regrouping, new candidates and real unavailability; check unaffected input/order. |
| 3 | Compare evaluation, saved-draft, Details and card totals/currencies across eligible, unavailable, empty and mixed fixtures. |
| 4 | Compare fingerprints/review state for coverage changes and equivalent coverage in a different order. |
| 5 | Inspect old/stale acknowledgement save/finalize results, renewed-review success and unchanged number/history on refusal. |
| 6 | Review allocation/edit/membership/permission/version/currency/overlap controls and EN/EL presentation. |
| 7 | Match integrated UI/backend/database regression evidence and its source SHA to the deployed build. |

**Reference:** [FRO-244](<https://linear.app/front-line-ltd/issue/FRO-244>) · [FRO-363](<https://linear.app/front-line-ltd/issue/FRO-363>) · [FRO-366](<https://linear.app/front-line-ltd/issue/FRO-366>) · [FRO-301](<https://linear.app/front-line-ltd/issue/FRO-301>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA findings](<https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/runs/2026-11-09-shipment-invoice.md>) · [Details evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-details-qa.test.tsx>) · [Create evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-create-qa.test.tsx>) · [Backend evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/230b51a/docs/qa/evidence/shipment-invoice-backend-qa.py>).


---

# Print ΥΔ — protect selections and print attempts

**Print ΥΔ** must keep the intended invoice selection and template together, and apply each result or error only to the print attempt that produced it.

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| QA-VAT-01 — newer selection lost | Generate for invoice A, then select B while waiting. A's response replaces the form and loses B. Changing the template too can combine the old invoice group with the newer template when opening the PDF. |
| QA-VAT-02 — old PDF error | Open A's PDF, close results and reopen Print ΥΔ. A's delayed failure appears in the new dialog; during another generation it can unlock controls and permit overlapping attempts whose results replace each other. |
| QA-VAT-03 — print selection | At Awaiting EAD, refresh after selected invoice A is removed from the Export. Its row disappears but the count and Generate request still include A. |

Isolated UI tests demonstrate state and outgoing arguments. Displayed invoice IDs matched the PDF request; actual PDF content and production behavior were not verified.

## Acceptance criteria

1. **Pending generation:** capture the Export, selected invoice IDs and template on Generate. Disable selection/template changes and duplicate Generate while pending; preserve existing pending dismissal protection. Completion must not erase newer work or affect another dialog session.
2. **Result ownership:** displayed groups and Open PDF use their originating selection/template. Late generation/PDF success or failure must not change a reopened dialog, unlock another pending request or replace newer results. Keep generation errors separate from PDF-opening errors.
3. **Current selection:** on refreshed saved membership/eligibility, remove invalid IDs from the editable print selection, update count/checkboxes and explain the change. Validate the current selection before generating; never send invisible stale IDs. Do not reinterpret an already submitted attempt as the changed selection.
4. **Failure and retry:** preserve the originating valid choices after generation failure. PDF failure preserves its result and offers retry for that document. A retry uses that attempt's inputs; a new attempt starts explicitly. Changed eligibility requires review.
5. **Preservation:** keep the three supplied templates, saved-invoice grouping by Invoicing company and Supplier, maximum five invoices per document, current saved-data rendering and authorized printing at every active Customs stage. Printing changes no invoice event/status, Export membership, Customs state or protocol. Print and stamping selections remain independent.
6. **Verification:** cover selection/template edits during delays, close/reopen and out-of-order PDF failures, membership refresh, normal failures/retries and all three templates. Verify displayed groups against captured requests and actual isolated PDF output; retain backend selection/access and no-write controls.

## Decisions and scope

One ticket owns Generate → results → Open PDF because these share one print attempt. Reuse existing Print ΥΔ controls; pending choices are disabled to avoid accepting changes the in-flight request cannot include. No template redesign, new document type, stamping mutation or protocol-allocation change. QA-VAT-03's bulk-stamping selection belongs to the companion stamping-confirmation ticket.

## Context for agents

Baseline main: 6aa259553cd9c86a8aaa157902088aa9a6bca83e.

* Client `src/features/exports/details/components/export-detail-page.tsx:453–498,932–964`: current choices and returned groups are merged; shared PDF error overrides another pending outcome. Adjacent `export-detail-print-dialog.tsx`: inputs lack pending guards.
* Client `src/features/exports/services/export-service.ts:185–209`: exportYdDocuments and GET /api/v1/exports/{id}/yd-documents/pdf forward selected IDs/template.
* App `src/main/java/com/frontline/forwarding/domain/exports/ExportYdService.java` validates saved membership/type and grouping; `web/exports/service/ExportYdPdfService.java` and `src/main/resources/templates/export-yd.html` render saved facts. Preserve these contracts.

## Post-deployment verification

Read-only inspection of existing records and isolated evidence; no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect delayed-generation recordings and requests for locked choices and unchanged submitted inputs. |
| 2 | Compare each result/PDF request with its originating attempt through reopen/out-of-order recordings. |
| 3 | Inspect membership-refresh evidence for removed IDs, corrected count and the next request. |
| 4 | Inspect generation/PDF failure and retry recordings for retained choices and correct ownership. |
| 5 | Compare template/group/output samples and before/after record snapshots for preserved facts and access. |
| 6 | Match isolated UI/browser/backend/PDF results and their source SHA to the deployed build. |

**Reference:** [FRO-317](<https://linear.app/front-line-ltd/issue/FRO-317>) · [FRO-352](<https://linear.app/front-line-ltd/issue/FRO-352>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [Print evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/08bdf90/docs/qa/evidence/vat-print-qa.test.tsx>).


---

# VAT stamping — reviewed confirmations & uncertain-attempt recovery

**VAT stamping** must preserve operator intent, saved facts and recoverable outcomes throughout the workflows below. Each workflow has its own acceptance and verification checks.

## Problems to fix

### Confirmations and progress

| Case | Reproduction and current result |
| -- | -- |
| QA-VAT-03 — bulk selection | Select A/B, then refresh after another operator advances A's stage. A remains selected and is submitted although it is hidden or disabled in the previous stage. |
| QA-VAT-04 — unreviewed version | Open an individual confirmation at version 3; refresh to version 4 with changed invoice facts. Confirm silently sends version 4 without renewed review. |
| QA-VAT-05 — pending date | Submit 5 November, then select 6 November while saving. The earlier success closes the dialog and loses the newer choice. |
| QA-VAT-09 — older displayed progress | Leave during bulk dispatch, return to a newer record showing stamped return, then receive the old dispatch response. The return date disappears from the screen and progress moves backwards. |

Dates/versions are synthetic examples. Tests prove UI and request behavior; persisted overwrite or database rollback was not demonstrated.

### Uncertain attempts

| Case | Reproduction and current result |
| -- | -- |
| QA-VAT-06 — bulk false certainty | Lose a response for A/B dated 8 November. The UI says Nothing changed and allows 9 November without checking. Close/reopen or navigation loses the original selection/date context. |
| QA-VAT-07 — individual recovery lost | Lose an event response; Check original attempt appears. Dismiss/reopen or receive a stage-changing refresh: recovery disappears and a new action becomes available. Missing recovery data can unmount the page/action. |
| QA-VAT-08 — different date accepted | Submit 5 November, lose its response, then Check. A reread with 6 November closes recovery and advances the action without identifying the mismatch. |

These are isolated UI reproductions with synthetic responses. No duplicate persisted event, changed saved date or real database rollback was demonstrated.

## Acceptance criteria

### Confirmations and progress

1. **Reviewed individual state:** retain the invoice/version reviewed when confirmation opens. Refresh must not silently replace that version. Keep it for server conflict rejection or require explicit renewed review; preserve the entered date on conflict and recheck current eligibility.
2. **Pending input:** capture the event, invoice(s), Export, date and applicable reviewed version at submission. Disable the date picker and incompatible changes while pending, retaining duplicate-submit and dismissal locks. Completion must not discard later accepted work or reset another action.
3. **Eligible bulk selection:** reconcile every stage's selection after canonical refresh. Remove newly ineligible IDs, update visible counts/checkboxes and explain changes, including in an open confirmation. Preserve unaffected choices/date for review and validate again before submission; no hidden/disabled selected ID or empty request. Once submitted, preserve the original attempt rather than retargeting it.
4. **Current progress:** an older bulk response must not replace newer loaded invoice dates/statuses, including after navigation and return. Use a canonical reread where freshness cannot be established. Protect any newer dialog and update affected stage tables/counts consistently.
5. **Preservation:** retain independent selections, partial per-invoice outcomes and unchanged rejected/unselected invoices. Preserve staff authority, positive IE599, type/stage/date/version checks, same-date replay without another event, protected recorded dates, protocol and Customs state. Sending leaves the invoice Exempted.
6. **Scope coordination:** use the same reviewed/submitted facts throughout confirmation and uncertain-attempt recovery. Keep original attempt data available to recovery; normal selection pruning must not delete its submitted invoice IDs. Preserve [FRO-378](https://linear.app/front-line-ltd/issue/FRO-378)/FRO-384's separate correction/cancellation/Customs ownership.
7. **Verification:** cover all three events on both entry points, real calendar interaction, same-stage and stage-changing refresh, stale confirmation, partial results and delayed response after navigation. Verify saved invoice/activity outcomes and replay guards in isolated backend tests.

### Uncertain attempts

1. **Truthful uncertainty:** distinguish confirmed rejection from missing/uncertain response. Do not say Nothing changed or not saved without authoritative evidence. Show the unresolved action and provide Check original attempt on both entry points; keep known-rejection input retention.
2. **Original intent:** retain Export, original invoice IDs, event, submitted date and applicable reviewed version independently of the current dialog/stage. No changed date, selection or conflicting replacement action while unresolved. Never substitute refreshed selections/version into an original retry.
3. **Recovery lifetime:** preserve recovery across Cancel, close, Escape, backdrop, reopening, stage changes and navigation. Keep existing pending dismissal locks. Protect in-app departure/unload; any allowed leave/return path must restore or reconcile before further mutations. Missing/denied/failed reads remain unresolved with recovery context available.
4. **Exact comparison:** check authoritative invoice/event, Export association and submitted date using existing reads/activity. A different date is a conflict to review, not success of the original attempt; display submitted versus saved facts. A matching recorded event may resolve the desired outcome as already recorded, but must not attribute it to this request/operator without evidence. Never overwrite or clear saved history to resolve the mismatch.
5. **Bulk reconciliation and retry:** resolve each original selected invoice separately; partial success must not become all-saved or all-failed. An absent event on one read does not prove an outstanding write failed. Any safe retry repeats the original intent under existing replay guards; a changed request requires resolved/reviewed outcomes. Keep unresolved items visible and refresh canonical invoice/Export progress without older-response regression.
6. **Preservation and ownership:** retain permissions, positive IE599, chronology, stage/version guards, same-date replay and atomic event/activity rules. No duplicate audit, protocol/membership/Customs change or extra exemption status. Initial reviewed facts, normal pending input, eligible selections and successful-response freshness follow Confirmations and progress; retain and reconcile the same attempt.
7. **Verification:** cover all events and both entry points through response loss, every dismissal path, actual isolated-browser departure/return, same/different-date rereads, another writer, missing/denied reads and mixed bulk outcomes. Verify unchanged retries and saved/audit outcomes with isolated backend evidence.

## Decisions and scope

### Confirmations and progress

One ticket owns reviewed confirmation → submission → successful displayed result. Reuse existing controls; disable pending date edits instead of accepting unsendable changes. Uncertain-result messages, persistence across dismissal and original-attempt reconciliation are specified in the Uncertain attempts subsection. No new bulk-version API, event correction policy, history rewrite or Shipment Invoice work.

### Uncertain attempts

One ticket owns uncertain-attempt continuity and reconciliation across both screens because both use the same invoice-owned events. Reuse existing confirmation/recovery controls. No unrestricted event-date correction, new exemption workflow, general concurrency platform or Shipment Invoice scope. [FRO-378](https://linear.app/front-line-ltd/issue/FRO-378)/FRO-384 retain their correction/cancellation/Customs scopes.

## Context for agents

### Confirmations and progress

Baseline main: 6aa259553cd9c86a8aaa157902088aa9a6bca83e.

* Client `src/features/supplier-invoices/components/supplier-invoice-export.tsx:242–254,328–339` reads live version and allows pending date changes.
* Client `src/features/exports/details/components/export-detail-page.tsx:250–256,504–565` prunes only after selected saves and unconditionally writes response data to shared cache; adjacent stamping dialog leaves DatePicker enabled.
* App `src/main/java/com/frontline/forwarding/domain/exports/ExportStampingService.java` shares invoice event guards across recordSupplierInvoiceStampingEvent and recordExportStampingEvents. Events update invoice-owned facts; Export version alone does not establish their freshness. SupplierInvoiceRepository persists date/status/version and activity.

### Uncertain attempts

Baseline main: 6aa259553cd9c86a8aaa157902088aa9a6bca83e.

* Client `src/features/exports/details/components/export-detail-page.tsx:555–565,834–840,975–985` collapses unknown to failed and discards dialog context. `src/features/exports/export-errors.ts` already distinguishes unknown.
* Client `src/features/supplier-invoices/components/supplier-invoice-export.tsx:270–282,295–300,345–348` accepts any event date and resets local recovery; adjacent Details page:244,886–890 omits stamping from navigation protection and keys the action by stage.
* App `src/main/java/com/frontline/forwarding/domain/exports/ExportStampingService.java` accepts same-Export/event/date replay without another write and refuses a different-date repeat. SupplierInvoiceOutput exposes stampingExportId and dates; SupplierInvoicesGraphQlApi exposes activity. Use existing authoritative facts; do not invent a request-status endpoint.

## Post-deployment verification

### Confirmations and progress

Read-only inspection of isolated evidence and existing records; no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Compare reviewed/submitted versions and conflict recordings for every individual event. |
| 2 | Inspect calendar/control states and original payloads during delayed completion. |
| 3 | Compare refreshed stage rows, selection notices/counts and outgoing bulk IDs. |
| 4 | Inspect navigation/interleaving evidence and canonical snapshots for retained newer return/sending facts. |
| 5 | Review partial-result, permission, chronology, replay and unchanged-record/activity controls. |
| 6 | Compare the confirmation snapshot with recovery evidence; verify submitted IDs survive pruning. |
| 7 | Match isolated UI/browser/backend results and their SHA to the deployed build. |


### Uncertain attempts

Read-only review of isolated evidence and existing records; no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect lost-response versus known-rejection messages and Check availability on both screens. |
| 2 | Compare original payload with retained context and attempted replacement/retry controls. |
| 3 | Inspect dismissal/navigation/stage-change and failed/missing-read recordings for surviving recovery. |
| 4 | Compare submitted and saved event/Export/date and actor/activity evidence for accurate resolution. |
| 5 | Inspect per-invoice mixed outcomes and unchanged retry payloads, including delayed original completion. |
| 6 | Compare protected facts/activity and shared confirmation/recovery snapshots for preserved rules. |
| 7 | Match isolated UI/browser/backend results and their SHA to the deployed build. |

**Reference:** [FRO-317](<https://linear.app/front-line-ltd/issue/FRO-317>) · [FRO-321](<https://linear.app/front-line-ltd/issue/FRO-321>) · [FRO-348](<https://linear.app/front-line-ltd/issue/FRO-348>) · [FRO-352](<https://linear.app/front-line-ltd/issue/FRO-352>) · [FRO-378](<https://linear.app/front-line-ltd/issue/FRO-378>) · [FRO-384](<https://linear.app/front-line-ltd/issue/FRO-384>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [Individual evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/08bdf90/docs/qa/evidence/vat-single-qa.test.tsx>) · [Bulk evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/08bdf90/docs/qa/evidence/vat-bulk-qa.test.tsx>).


---

# Customs Storage Entry — reliable drafts, recovery & Order relationships

**Customs Storage Entry** must preserve operator intent, saved facts and recoverable outcomes throughout the workflows below. Each workflow has its own acceptance and verification checks.

Order = purchase order = stock-list item. Colli = physical handling unit.

## Problems to fix

### Drafts and saved outcomes

| Finding | Reproduction and current result |
| -- | -- |
| QA-CSE-01 | Open Create from A, select B and enter manual values. The original A lookup fails and recovers; selection returns to A while B's manual values remain. The next request targets A. |
| QA-CSE-02 | Begin editing at version 3; another operator saves version 4. Background refresh makes Save use version 4 while sending an untouched old value. Change Order confirmation also adopts the refreshed version. |
| QA-CSE-03 | Enter more text during a delayed save, or Cancel and open a new editor. The earlier success closes the current editor and discards that later work. |
| QA-CSE-04 | Lose a Create response and its recovery lookup, or lose a Details/Change Order response. The page claims nothing was saved/changed and offers further work without resolving the outcome. |
| QA-CSE-05 | Create returns a saved identity, then navigation rejects asynchronously. The form loses saved-record recovery and can enable Create again. |
| QA-CSE-06 | Follow an internal link with unsaved Create or Details input. No leave confirmation appears; returning loses the draft. |
| QA-CSE-09 | Preselection transport failure appears as missing/inaccessible Order. Selected-Order draft failure leaves blank facts and disabled Create without an error or Retry. |

These were reproduced against isolated current-source UI boundaries. The evidence establishes faulty state and requests, not production overwrites or duplicate persisted entries.

### Order relationships and admission actions

| Finding | Reproduction and current result |
| -- | -- |
| QA-CSE-07 | Select an Order at a different warehouse and confirm Change Order before its warehouse read finishes. Both the confirmation warning and post-save warehouse review notice are missing. |
| QA-CSE-08 | Open from A and move the entry to independent B. A remains the return destination but is falsely described as a covered post-admission split child. |
| QA-CSE-10 | Confirm an otherwise eligible Order in stock. The Order refreshes to In stock while the independently cached entry shortcut still says Not admitted and disables Create. |

These were reproduced in isolated UI/integration tests. The false banner does not alter backend coverage; the stale shortcut is not evidence that admission failed.

## Acceptance criteria

### Drafts and saved outcomes

1. **Stable selection:** initial preselection must not retake ownership after an explicit operator choice. Recovery or refresh of A cannot replace selected B, its facts or its submitted Order ID. Ignore obsolete responses. Preserve manually edited fields and the existing rule that only untouched warehouse fields receive prefill when the operator deliberately changes Order.
2. **Recoverable lookup errors:** distinguish transport failure from confirmed missing/denied results. Show a visible error and Retry for both preselection and selected-Order draft reads. Retain the selection and manual values; unavailable required facts keep Create disabled. Retry reads the relevant Order only and must not restore an obsolete selection. Preserve the existing combined message for genuinely missing/inaccessible preselection.
3. **Reviewed edit baseline:** capture entry identity, values and version when editing starts. Send only the operator's intended field changes against that version; omitted fields stay omitted and intentional clearing remains explicit. Background refresh cannot replace the baseline or version, including while Change Order confirmation is open. A stale result keeps the draft/target and requires review of the latest record before another save; Refresh must not silently convert untouched old values into edits.
4. **Pending-save protection:** keep a stable submitted snapshot and prevent duplicate submission. While a write is pending, disable inputs, Order changes, Cancel/Escape dismissal and starting another editor. Associate completion with that operation/editor only; an obsolete response must never clear another draft or overwrite newer saved state. Known rejection restores editing with the draft intact; confirmed success completes only the matching operation.
5. **Truthful uncertain results:** timeout, lost response and unclassified write failure must show that the outcome is unconfirmed, never that nothing was saved/changed. Retain original Order/entry identity, submitted values, target and reviewed version. Offer **Check saved state**; block a fresh independent write while reconciliation is failed or inconclusive. Do not automatically repeat Create, Update or Change Order.
6. **Canonical reconciliation:** check creation against the original submitted Order and saved edits/moves against the same entry. Show the current saved record/coverage, offer an authorized Open action when available and identify conflicting values or ownership. Failed/incomplete reads remain unconfirmed. A successful no-entry lookup may offer an explicit Create retry for the original Order and captured values under existing eligibility/uniqueness checks; describe it as no entry currently found, not proof of rollback. Update/Change Order retries retain the captured payload and version; a newer record requires explicit review before a new correction. Never silently substitute a newer version or claim authorship from matching values. A retry is an explicit action, not automatic replay or an exactly-once guarantee.
7. **Saved navigation recovery:** retain the acknowledged entry ID, number and return context before navigating. Handle immediate and asynchronous navigation failures, show that creation succeeded, and offer **Open saved entry**. Retrying performs navigation only; Create remains unavailable for that completed attempt. Failed navigation must not clear a later draft or lose a recovered saved destination.
8. **Leaving with work:** protect dirty Create and Details/Change Order drafts through sidebar links, other internal links, browser history and the existing Back/Cancel actions. Ask before discarding; Keep editing preserves the complete draft and selection. Retain native unload protection. Departure does not cancel an in-flight request and must not be presented as proof that nothing was saved. Pending/uncertain operation state must not be silently reset into a fresh write.
9. **Preservation:** retain staff authorities, existing field validation, Athens date/time rules, eligibility and coverage checks, numbering, uniqueness, audit and server version enforcement. Preserve normal confirmed-rejection behavior, tabs/language draft retention and existing components. Provide all changed feedback/actions in EN/EL with keyboard access and usable narrow layouts. No automatic changes to Orders, invoices or Export.
10. **Regression coverage:** convert retained defect observations into correct-outcome tests and retain working controls. Cover real query refresh, failed/recovered lookups, stale saves, delayed responses, cancelled/obsolete editor callbacks, uncertain Create/Update/Change Order with failed/conflicting reads, actual internal navigation and rejected navigation Promises. Check exact payloads, action counts and unchanged unrelated fields; verify stale-write refusal and persistence in an isolated backend/database environment.

### Order relationships and admission actions

1. **Ready target before confirmation:** Change Order must load the selected target's current eligibility/admitting warehouse before enabling confirmation. Loading, failed or incomplete target facts never mean same warehouse. Show loading or an error with Retry, retain the chosen Order and block confirmation until facts are available. Ignore results for a superseded target; if relevant target facts change while the dialog is open, require review of the updated confirmation.
2. **Warehouse warnings and preserved values:** when the target's admitting warehouse differs, the confirmation names the target and warehouse and explains that saved operator/address/permit values stay unchanged. After a confirmed or reconciled move, show the existing Warehouse operator review notice for the new warehouse until page reload. Keep entry number and all entry-owned values unchanged. Same-warehouse changes show no false difference warning; server rejection must not show a completed-move notice.
3. **Verified coverage banner:** determine covered-child status through the existing authorized by-Order coverage read, matching both the returned entry identity and inherited access. Different owner/return IDs, family root or text similarity are insufficient. Show the banner for a genuine covered child/grandchild only. Retain valid Back-to-Order context independently; after A-to-independent-B movement, Back to A remains without claiming A is covered. Recheck after owner changes. Failed/unresolved coverage reads must not assert coverage and must offer recovery without relinking anything.
4. **Fresh shortcut after stock confirmation:** successful stock confirmation refreshes the affected Order's Customs Storage entry/eligibility read, including when Available actions stays mounted. Render the server result: Open for an existing direct/inherited entry; Create for an eligible unowned Order with create authority; otherwise the existing disabled reason or authority state. Do not infer admission/coverage from In stock alone. During recheck or failure, show the appropriate loading/error/Retry state and no usable Create based on stale data.
5. **Preservation and ownership:** retain server eligibility ordering, admission/split coverage, current-entry precedence, authority checks and existing Create/Open destinations. Change Order continues to refresh owner-derived facts and existing old/new-owner lookups without changing Orders, invoices or Export. Reuse current components and EN/EL warning/feedback patterns with keyboard and narrow-screen support. Compose warnings and coverage refreshes with the reviewed versions and pending/uncertain write recovery specified under Drafts and saved outcomes.
6. **Regression coverage:** test delayed, failed, incomplete and out-of-order target reads; different/same-warehouse moves and rejection; unrelated return Orders versus real children/grandchildren; coverage-read failure and changed ownership; and successful stock confirmation through the actual form, mutation hook and mounted shortcut. Include failed refresh/Retry and existing direct/inherited entry controls. Assert target/entry IDs, warning timing, retained entry fields, server-derived actions and absence of unintended writes.

## Decisions and scope

### Drafts and saved outcomes

* One correction owns draft and operation-result handling across the existing Create, Details and Change Order pages, so the same outcome has consistent behavior.
* Pending writes lock the current editor rather than accepting input that may be discarded. Reviewed versions remain explicit; background freshness is not operator review.
* Recovery uses existing authorized reads and honest uncertainty. This ticket does not assume a request-ID replay API, exactly-once execution or proof of authorship from a matching record.
* [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319)**,** [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353) **and** [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354) **are references only:** do not reopen them, expand their scope or make them prerequisites.

Out of scope: pending Customs Storage list/menu, active-register screen, Excel, printing and recipient copies; Export and VAT stamping; new business fields, numbering policy, schema/migration, global recovery service, general autosave or cross-session draft storage. Reuse the current UI components and layout.

### Order relationships and admission actions

* Return navigation and admission coverage are separate facts. Preserve the former without inventing the latter.
* Warehouse differences must be known before confirmation because Change Order deliberately retains entry-owned warehouse text.
* Stock confirmation refreshes the existing entry read; it does not introduce another client-side eligibility calculation.
* [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319)**,** [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354) **and** [FRO-355](https://linear.app/front-line-ltd/issue/FRO-355) **are references only:** do not reopen them, expand their scope or make them prerequisites.

Out of scope: pending Customs Storage list/menu, active-register screen, Excel, printing and recipient copies; new links from Invoice/Export screens; Export and VAT stamping; changes to admission, stock-confirmation, coverage, numbering or authorization rules; schema/migration, historical corrections or general Order cache redesign. Reuse the current UI components and layout.

## Context for agents

### Drafts and saved outcomes

Reviewed source: main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed-build equivalence remains unverified.

* Client prefix `frontline-forwarding-client/src/features/customs-storage/`: `create/components/customs-storage-create-page.tsx` owns preselection, draft reads, Create reconciliation and navigation; `details/components/customs-storage-details-page.tsx` owns editor lifetime, refreshed versions and Update/Change Order results; `details/customs-storage-details-mapping.ts` builds the changed-field payload.
* `hooks/use-customs-storage.ts`, `services/customs-storage-service.ts`, `graphql/documents.ts` and `customs-storage-errors.ts` provide the current cache, reads, mutations and failure classification. Reads: `customsStorageEntry`, `customsStorageEntryDraft`, `customsStorageEntryByPurchaseOrderId`, `purchaseOrderById`; writes: `createCustomsStorageEntry`, `updateCustomsStorageEntry`, `changeCustomsStorageEntryOrder`.
* Backend `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customsstorage/CustomsStorageEntryEditingService.java` checks the supplied version under lock. That protection cannot detect a newer version silently substituted by the client. Preserve partial-update, no-op, audit and transaction behavior; creation uniqueness is not a request replay contract.
* Internal router navigation does not trigger native beforeunload. Trace the integrated hosts and asynchronous callbacks, not only synchronous test doubles. Keep a submitted attempt separate from current query data and any later editor.

Retained observations establish the defect baseline, not fix verification. Full browser, authenticated transport and real database transaction/concurrency checks remain outstanding; no separate backend defect was confirmed by the extracted-source controls.

### Order relationships and admission actions

Reviewed source: main `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed-build equivalence remains unverified.

* Client prefix `frontline-forwarding-client/src/features/customs-storage/`: `details/components/customs-storage-details-page.tsx` derives `otherWarehouse` from the asynchronously loaded target and currently treats unequal return/owner IDs as coverage. `details/components/change-order-dialog.tsx`, `details/components/order-relationship-card.tsx` and the Details layout consume those values.
* `services/customs-storage-service.ts` already exposes `customsStorageEntryDraft`, `customsStorageEntryByPurchaseOrderId` and the Order card read. Use server warehouse/eligibility and returned entry/access/owner facts; no new coverage endpoint is assumed.
* `order-card/order-customs-storage-card.tsx` uses `customsStorageKeys.orderCard`. `frontline-forwarding-client/src/features/purchase-orders/hooks/use-purchase-orders.ts` invalidates only `purchaseOrderKeys.all` on command success. `purchase-orders/components/details/order-details-page.tsx` keeps the Available actions tab mounted. Trace stock-confirmation success through both caches.
* Backend `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customsstorage/CustomsStorageEntryEditingService.java` retains entry values/number on Change Order and rechecks the target. Existing admission and coverage services remain authoritative. No backend data-rule change is required by these findings.

Retained tests demonstrate current UI behavior using synthetic service boundaries. Real deployed-browser, database and authenticated-session behavior remains unverified.

## Post-deployment verification

### Drafts and saved outcomes

Read existing records, recordings and isolated test results only; submit no production writes. Missing evidence remains Unverified.

| Criterion | Read-only check |
| -- | -- |
| 1 | Inspect A-to-B failure/recovery recordings and captured payloads; compare selected ID, facts, manual values and untouched prefill. |
| 2 | Inspect initial/selected lookup error and Retry cases, including late A responses after B selection; compare retained input and Create availability. |
| 3 | Compare edit/confirmation baseline, submitted version and changed-field payload before/after background refresh; inspect stale rejection and preserved concurrent values. |
| 4 | Review delayed success/rejection and obsolete-callback recordings; verify disabled controls, one write and preservation of the correct editor. |
| 5 | Review uncertain Create/Update/Change Order feedback, retained snapshots, Check saved state and absence of automatic/fresh writes. |
| 6 | Inspect successful, failed, absent and conflicting reconciliation cases; compare canonical record/coverage, stated certainty and action counts. |
| 7 | Inspect confirmed creation plus synchronous/asynchronous navigation failure; repeated Open retries must keep the same identity and issue no writes. |
| 8 | Review internal-link/history/Back/Cancel/unload recordings and Keep editing behavior, including pending/uncertain attempts. |
| 9 | Review authority, validation, numbering, uniqueness, audit, version, unchanged related-record and EN/EL/accessibility results. |
| 10 | Match integrated regression and isolated database evidence to the deployed source revision, including stored values and write counts. |


### Order relationships and admission actions

Read existing records, recordings and isolated test results only; submit no production writes. Missing evidence remains Unverified.

| Criterion | Read-only check |
| -- | -- |
| 1 | Inspect delayed/failed/retried and out-of-order target-read recordings; confirmation must remain blocked until the selected target's facts are ready and reviewed. |
| 2 | Compare different/same-warehouse confirmation and post-result recordings with saved number, operator/address/permit values and the new owner's warehouse; inspect rejection behavior. |
| 3 | Read seeded independent A/B and genuine covered child/grandchild lookups; compare entry identity/access with the banner and unchanged return destination, including failed lookup and post-move cases. |
| 4 | Inspect stock-confirmation recordings and read logs; compare the refreshed shortcut with the canonical eligibility/entry result and failed-refresh Retry behavior. |
| 5 | Review role, eligibility, coverage, existing-entry precedence, route, retained-field/related-record and EN/EL/accessibility results. |
| 6 | Match integrated regression evidence to the deployed source revision; verify IDs, call counts, warning timing and absence of unrelated mutations. |

**Reference:** [FRO-319](<https://linear.app/front-line-ltd/issue/FRO-319>) · [FRO-353](<https://linear.app/front-line-ltd/issue/FRO-353>) · [FRO-354](<https://linear.app/front-line-ltd/issue/FRO-354>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA findings and evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/ececdaa/docs/qa/runs/2026-11-09-customs-storage-entry.md>) · [FRO-355](<https://linear.app/front-line-ltd/issue/FRO-355>).


---

# Stock List — reliable controls & complete Shipment handoff

**Stock List** must preserve operator intent, saved facts and recoverable outcomes throughout the workflows below. Each workflow has its own acceptance and verification checks.

Order = purchase order = stock-list item. Colli = physical handling unit.

## Problems to fix

### List controls and settings

| Case | Reproduction and current result |
| -- | -- |
| QA-SL-01 — Vessel cleared | Select a Client and its Vessel, then set Client to All. Vessel also becomes All although it remains compatible. |
| QA-SL-02 — missing options | An authorized Client/Supplier beyond the first 100 results, and a Vessel belonging only to an omitted Client, cannot be found by exact-name dropdown search. |
| QA-SL-03 — newer settings lost | An earlier grouping-save response cancels a newer column drag awaiting save. An older settings read can also revert a grouping already saved successfully. |
| QA-SL-04 — Flags position | Move Flags before Status. Server preference normalization omits Flags; the response makes it jump to the end. |
| QA-SL-05 — stranded page | View page 2 of 21 results at 20 per page. A refresh reduces matches to 20; page 2 stays empty and Previous/Next disappear. Applies to ordinary and grouped lists. |

Examples are synthetic. Isolated UI tests reproduce these behaviors; Flags uses a response derived from the inspected server allowlist. Actual database persistence and deployed behavior were not tested.

### Shipment selection and handoff

| Case | Reproduction and current result |
| -- | -- |
| QA-SL-06 — stale eligibility | Tick two eligible Orders at one origin. One is reserved elsewhere; the refreshed row shows the change, but Start shipment remains available. An Order becoming eligible can remain blocked until reticked. |
| QA-SL-07 — silent subset | Select two eligible Orders at an origin with 101 candidates. One lies beyond the first 100 fetched by creation and silently disappears from the draft. The same silent omission occurs when a requested Order becomes unavailable. |

Isolated tests execute the real list, creation components and payload mapping with synthetic reads. They demonstrate stale action state and a reduced draft/would-be request, not an invalid or incomplete Shipment saved in production.

## Acceptance criteria

### List controls and settings

1. **Independent filters:** clearing Client preserves a selected compatible Vessel and other filters. Choosing a specific incompatible Client still clears its old Vessel. Preserve combined-filter semantics and the existing page reset when a filter changes.
2. **Complete option access:** search/pagination reaches authorized Clients, Suppliers and their Vessels beyond the initial batch. Do not treat an incomplete option page or failed read as proof that no match exists. Preserve company scope, identity-based selection and existing loading/error behavior.
3. **Newer preferences:** late reads or earlier save responses cannot replace newer local column/grouping choices or undo a later successful save. A newer drag awaiting its save must survive and be persisted, or retain visible failure feedback. Preserve cold-load restoration and protection for already-submitted queued saves.
4. **Flags persistence:** accept Flags in the saved column order and restore its chosen position after the response and reopening. Preserve other saved columns, optional visibility and grouping; do not reset existing users' settings.
5. **Page recovery:** when refreshed results remove the current page, move to a valid remaining page or retain usable navigation to it. Cover grouped and ordinary lists, including zero results. Correcting one group's page preserves unrelated groups, filters, sorting and selected Order IDs.
6. **Compatibility:** preserve permissions, EN/EL controls, explicit clearing, selection across list changes and its reset on leaving. Screen settings never alter the fixed PDF layout. If shared option reads change, preserve their contracts for Order forms, inline Order creation and currency consumers, including Shipment Invoice.

### Shipment selection and handoff

1. **Current complete-set eligibility:** keep selected IDs, but recompute Start shipment availability from current status, reservation, warehouse/stay, nonterminal-colli count and date-sensitive readiness. Cover visible and off-page selections and transitions in both directions. Require shipment-create authority and one eligible origin for the entire set; revalidate before handoff and do not proceed on unresolved eligibility reads.
2. **Complete handoff:** preserve every requested eligible Order and its eligible collis at the selected origin, including Orders outside the first candidate page. Read every requested ID through an authorized candidate path; a partial candidate response cannot establish absence. Do not add unrequested Orders, duplicate collis or relax eligibility to preserve the selection.
3. **Explicit reconciliation:** if a requested Order is missing, inaccessible, reserved or otherwise ineligible, explain the unresolved/excluded selection without exposing unauthorized details. Do not silently continue with a reduced draft. Require the operator to resolve/review the changed set before proceeding to creation; unavailable goods stay unselected.
4. **Reliable loading:** failed/incomplete candidate reads keep the original requested IDs available for retry and are distinct from a confirmed exclusion. Late results cannot replace later deliberate draft choices with the original preselection. Coordinate existing origin-change/draft protection with [FRO-373](https://linear.app/front-line-ltd/issue/FRO-373).
5. **Preservation:** printing remains independent of shipment eligibility. Keep shared checkbox/count behavior, selection across list pages/filters/groups and clearing on leaving. Preserve creation review, server authorization/revision checks and existing lifecycle rules. Opening, refreshing or reconciling this draft creates no Shipment, reservation or split.

## Decisions and scope

### List controls and settings

These five fixes share the existing Stock List controls and preferences. Include the server preference-policy correction required for Flags. Reuse current controls; no new screen or component. Broader per-column/date-control requirements, new filters, cross-device preference conflict handling and business-record edits are outside scope.

### Shipment selection and handoff

One ticket owns Stock List selection → eligibility → initial creation handoff. The existing creation page and feedback controls are reused. [FRO-373](https://linear.app/front-line-ltd/issue/FRO-373) retains origin-change and unfinished-draft fixes; this ticket adds complete initial-selection reconciliation. No new shipment mode, eligibility rule, background reservation or broad lifecycle change.

## Context for agents

### List controls and settings

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed equivalence is unverified.

* Client `src/routes/secured/purchase-orders/index.tsx`, `features/purchase-orders/components/purchase-order-table.tsx` and `purchase-order-table-state.ts`: filters, column hydration/order and list/group pagination.
* Client `features/preferences/hooks/use-table-preference.ts`, `features/purchase-orders/graphql/purchase-orders.graphql` and `services/purchase-order-service.ts`: delayed preference results and first-page company options. `usePurchaseOrderFormOptions` is shared; preserve its other readers or isolate the list correction.
* App `domain/preferences/PurchaseOrderTablePreferencePolicy.java` and `web/preferences/service/UserTablePreferencesApiService.java`: Flags is absent from the accepted lists. `web/purchaseorders/service/PurchaseOrdersApiService.java` retains the requested page when totals shrink.

Paths are under client `src` or app `src/main/java/com/frontline/forwarding`. Convert the retained observation assertions into fix regressions.

### Shipment selection and handoff

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed equivalence is unverified.

* Client `src/routes/secured/purchase-orders/index.tsx` and `features/purchase-orders/components/purchase-order-table-state.ts`: checkbox-time warehouse eligibility is stored separately from refreshed rows. `purchase-order-selection-toolbar.tsx` already passes all selected IDs.
* Client `src/routes/secured/shipments/new.tsx`, `features/shipments/hooks/use-shipment-creation.ts`, `services/shipment-service.ts` and `components/creation/shipment-creation-mapping.ts`: first-100 candidate read and intersection-only initialization silently omit requested IDs. The backend candidate read supports pagination.
* Preserve the existing server eligibility and reviewed-selection contracts; do not bypass them with arbitrary Order-detail data. Convert observation tests for stale/off-page/date changes, complete/missing handoffs and two-selected-among-101 into fix regressions.

## Post-deployment verification

### List controls and settings

Use read-only source/build inspection and isolated regression evidence; do not trigger production preference saves. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Inspect clear-Client and incompatible-Client recordings and their exact filter requests. |
| 2 | Review beyond-first-page client/supplier/vessel searches, failed reads and restricted-user results. |
| 3 | Review both delayed-response cases, retained newer saves and cold-load/queued-save controls. |
| 4 | Compare submitted, normalized and reloaded Flags positions; check existing saved settings survive. |
| 5 | Inspect grouped/ordinary page-shrink and empty-result cases, retained selections and independent group pages. |
| 6 | Match permission, EN/EL, selection, fixed-PDF and affected shared-reader results to the deployed revision. |


### Shipment selection and handoff

Use read-only build/record inspection and isolated results. Do not create Shipments or change production reservations; missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Review refreshed/off-page reservation, warehouse, terminal-colli, unknown-location and date-rollover cases in both eligibility directions, plus authority controls. |
| 2 | Compare exact requested Order IDs, draft colli identities, review and captured payload for two selected Orders spanning candidate pages. |
| 3 | Inspect unavailable/missing/inaccessible cases and explicit reconciliation before continuation; verify no silent subset or disclosure. |
| 4 | Review delayed/failed reads, retry and later user-choice preservation together with the related origin-change regressions. |
| 5 | Check selection/printing controls and before/after domain snapshots proving handoff caused no writes; match results to the deployed revision. |

**Reference:** [FRO-254](<https://linear.app/front-line-ltd/issue/FRO-254>) · [FRO-279](<https://linear.app/front-line-ltd/issue/FRO-279>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/ccbcc002634500c5c369a5543767487c45e64df3/docs/qa/evidence/stock-list-filters-notes.md>) · [FRO-341](<https://linear.app/front-line-ltd/issue/FRO-341>) · [FRO-373](<https://linear.app/front-line-ltd/issue/FRO-373>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/ccbcc002634500c5c369a5543767487c45e64df3/docs/qa/evidence/stock-list-selection-notes.md>).


---

# Stock List PDF — correct current values and preserve readable output

**Stock List PDFs** must show the correct current measurements and associated transport reference, with readable External Notes and Order identifiers.

**Order = purchase order = stock-list item. Colli = permanently identified physical handling unit.**

## Problems to fix

| Case | Reproduction and current result |
| -- | -- |
| QA-SL-08 — old measurements | Before warehouse confirmation, change a colli from gross/net 10/8 kg and 10×20×30 cm to 20/18 kg and 40×50×60 cm. The print model still uses the original DECLARED history snapshot. |
| QA-SL-09 — old transport | An older ARRIVED Shipment has CMR-OLD; a newer associated READY_FOR_DISPATCH Shipment has CMR-NEW. The print model chooses CMR-OLD because dispatched legs sort first. It also borrows the old reference when the newer leg's reference is empty. |
| QA-SL-10 — collapsed notes | Save LINE_A, LINE_B and LINE_C on separate External Notes lines. The rendered PDF merges lines and wraps only to fit the column. |
| QA-SL-11 — overlapping ID | Print valid child number PO-0000001_100. Its unwrapped text extends into the adjacent Client column. |

Fixtures are synthetic. Exact backend bodies with stand-ins reproduced the data errors; actual template/OpenHTMLtoPDF rendering reproduced the two layout errors. Real SQL, full application PDF generation and deployed behavior remain unverified.

## Acceptance criteria

1. **Current declared measurements:** without a WAREHOUSE_CONFIRMED measurement, use current declared gross/net weights and dimensions. An original DECLARED history snapshot cannot override corrections. The example prints 20/18 kg and 40×50×60 cm. Genuine full warehouse-confirmed measurements retain precedence; fix the reader without rewriting stored measurements or history.
2. **Latest associated transport:** a newer associated undispatched leg takes precedence over an older dispatched/arrived leg. Print CMR-NEW in the example; if that newer leg has no number, print blank without borrowing an earlier reference. Preserve exclusion of cancelled Shipments and removed participation, Order scope and deterministic ordering in otherwise unchanged cases.
3. **External Notes:** preserve saved internal line breaks while allowing long lines to wrap within the cell. Render escaped plain text. Empty External Notes remain empty; never fall back to Internal Notes, including for staff-generated PDFs.
4. **Complete readable IDs:** render the full valid Order number, including long split-child suffixes, without clipping or overlap with Client or other cells. Preserve the identifier itself and the approved fixed column layout. Verify ordinary and long IDs beside long client names.
5. **Existing print contract:** preserve 1–100 distinct authorized Orders, whole-request rejection for a missing/unauthorized ID, one row per selected Order and descending internal-number order. Use current nonterminal collis for counts/totals/DG, retain zero-colli rows and missing-versus-zero behavior, package type/dimensions grouping without PCS, and current/last-known location rules. Printing changes no business record or history.
6. **Rendered output:** retain fixed A4 landscape columns, repeated branded/table headers, timestamp, page numbering and footer, independent of screen column preferences. Inspect every page of representative empty, long EN/EL, multiline, long-ID and multipage PDFs; pair rendered assertions with model/authorization regressions.

## Decisions and scope

Keep the approved template and existing print operation. Correct the original-DECLARED-snapshot defect and older-dispatched/newer-undispatched precedence. This ticket does not establish a new cross-stay fallback rule for partial warehouse measurements, change storage/history, restore PCS, redesign the document or alter Shipment lifecycle rules.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed equivalence is unverified.

* App `src/main/java/com/frontline/forwarding/web/purchaseorders/service/StockListPdfModelFactory.java`: chooses the latest record from all measurement sources. `PurchaseOrdersApiService.java` writes the original DECLARED snapshot; pre-stock edits update current fields. `PurchaseOrderOutputAssembler.java` supplies both.
* App `domain/shipments/ShipmentRepository.java:101–114`: dispatched-first ordering; `StockListPdfService.java` consumes the selected reference. Other similarly named repository methods concern different histories; avoid unrelated changes.
* App `src/main/resources/templates/stock-list.html`: normal whitespace collapses Notes and the first cell forces nowrap. Preserve escaped text and the rendering contract in `PdfRenderService.java`.

## Post-deployment verification

Inspect existing authorized records, generated samples and isolated test evidence without editing production fixtures. Missing evidence remains Unverified.

| Criterion | Check |
| -- | -- |
| 1 | Compare current declared values, original snapshot and model/PDF output; review full confirmed-measurement and no-write controls. |
| 2 | Compare the two-leg fixture's saved/empty newest reference with output; review cancelled/removed/other-Order exclusions. |
| 3 | Inspect short deliberate lines, long lines, escaped text and distinct/empty External Notes; confirm Internal Notes remain absent. |
| 4 | Inspect complete root/child IDs beside client text and verify glyphs do not overlap adjacent cells. |
| 5 | Review authorized mixed-status selections, rejected whole requests, current/terminal/zero-colli aggregates, PCS and location controls. |
| 6 | Inspect every page of representative PDFs and match renderer/font, backend tests and source revision to the deployed build. |

**Reference:** [FRO-279](<https://linear.app/front-line-ltd/issue/FRO-279>) · [FRO-292](<https://linear.app/front-line-ltd/issue/FRO-292>) · [FRO-295](<https://linear.app/front-line-ltd/issue/FRO-295>) · [FRO-297](<https://linear.app/front-line-ltd/issue/FRO-297>) · [Source baseline](<https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e>) · [QA evidence](<https://github.com/frontlineltdproject-star/linear-project/blob/ccbcc002634500c5c369a5543767487c45e64df3/docs/qa/evidence/stock-list-evidence.md>).


---

# Order — allow unknown customs regime until stock admission

**Order** registration must remain possible when its customs regime is not yet known. Require a recorded compatible regime before stock confirmation or storage admission. Order = purchase order = stock-list item.

## Rules

| Situation | Required behavior |
| -- | -- |
| Greece = Yes, registering an Order before admission | Customs regime may be absent. Unknown is not Free circulation and receives no inferred default. |
| Regime is supplied | Keep existing Greece/regime/ΑΛΚ consistency and applicable warehouse-capability validation. |
| Warehouse is missing or has no recorded regimes | Permit registration with regime unknown; explain why a verified selection is unavailable. Do not fabricate warehouse capabilities. |
| Stock confirmation or warehouse storage admission | Require the regime and verify compatibility with the actual receiving/admitting warehouse before any transition or storage write. |
| Creation also records historical admission or stock | Apply the admission requirement in the same operation; optional registration must not bypass it. |
| Greece = No | Preserve the existing non-applicable regime/ΑΛΚ rules. |

## Acceptance criteria

1. Create an otherwise valid Greece = Yes Order with no regime through each applicable pre-admission creation path. Persist absence explicitly and render **Regime not recorded** in existing readers. Never substitute a supported regime automatically.
2. Creation validation and server rules agree. A warehouse with an empty capability set does not strand ordinary registration; entering a regime still requires a validating warehouse and supported choice.
3. Before **Record arrival and set PO in stock**, reject missing/unsupported regimes atomically with an actionable explanation. Preserve the user's inputs and provide the existing authorized customs-correction route.
4. Preserve shared admission checks for warehouse-destination Shipments, their creation/change/dispatch/admission callers, and direct/historical stock-entry paths. Unknown registration is not permission to proceed through an operation that already commits to warehouse storage. Recheck the actual receiving warehouse; opening-warehouse compatibility alone is insufficient.
5. Support authorized completion of a previously unknown regime before admission. Keep current lifecycle, shared-registration, covered-Order and ΑΛΚ correction guards; an unrelated edit must not erase a recorded regime or alter a shared registration.
6. Keep the existing customs column, Details and activity consumers honest about missing values. No mass assignment, warehouse capability backfill, invented Free circulation support or historical-document/stay rewrite.
7. Test unknown registration with missing/empty/known capabilities; supplied compatible/incompatible regimes; Greece = No; completing an unknown regime; direct and historical stock entry; receiving-warehouse transfer checks; stale capability/version changes; permissions; and rollback with no successful audit on rejection.

## Decisions and scope

The business may register an Order before knowing its customs regime. The mandatory boundary is stock confirmation/storage admission, not registration. Preserve existing earlier warehouse-transfer safety checks rather than weakening them as an incidental consequence of nullable registration.

This work owns client/server requiredness and its lifecycle distinction. Customs Storage Entry draft/relationship repairs remain separately owned; creating a Customs Storage Entry is not a substitute for stock admission or a way to infer the regime.

## Context for agents

Production main baseline: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; not proof of deployed behavior.

* `docs/workflows/order-customs-regime.md` defines creation/correction, warehouse validation, shared registration, reads and audit.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/customs/OrderCustomsRules.java`: `requireConsistent` currently rejects a null regime for Greece = Yes; `requireSupported` skips null; `requireStorageAdmission` explicitly rejects it and validates the receiving warehouse. Separate registration requiredness from admission requiredness without bypassing the remaining consistency checks.
* Trace all shared-rule callers, including `PurchaseOrdersApiService.java` and `ShipmentsApiService.java`, ordinary/historical/inline creation and stock transitions. The Shipment warehouse-destination guard is also invoked before admission; preserve it.
* Client `src/features/purchase-orders/components/creation/creation-draft.ts` derives choices from the opening warehouse. Existing Details already has an absent-regime display.
* Existing nullable data does not establish that all create/correction paths accept null. Verify API validation and shared-rule effects end to end.

## Verification

Use isolated UI/API/database cases for every criterion; verify saved null versus supplied values and atomic refusal at admission. Read-only deployment verification compares the shipped source and test evidence, existing missing-regime display and capability rules. Do not create Orders or confirm stock in production.

**Reference:** [Order customs contract](https://linear.app/front-line-ltd/issue/FRO-356) · [Order creation](https://linear.app/front-line-ltd/issue/FRO-335) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e).


---

# Order — enable readiness-date follow-up after the automatic request is sent

**Request readiness date** is a follow-up action. The initial request is sent automatically; a manual follow-up becomes eligible only after successful sending of an automatic request for that Order.

## Eligibility

| Condition | Outcome |
| -- | -- |
| No successful automatic request | Manual follow-up unavailable; explain that the initial automatic request has not been sent successfully. |
| Automatic request pending, failed or obsolete | Does not satisfy the successful-send prerequisite. |
| Same Order has ASK_READINESS_DATE, trigger SCHEDULED, delivery status SENT | Initial-send prerequisite satisfied; evaluate remaining existing eligibility rules. |
| Another reminder is pending | Preserve the existing duplicate-pending block. |
| Order no longer awaits a readiness date | Preserve the current unavailable reason and appropriate readiness action. |

## Acceptance criteria

1. Use server evidence for the same Order, request type and automatic trigger. Scheduled-record existence or an outbox completion alone is insufficient.
2. **SENT** means the delivery provider accepted the request under the existing delivery contract; do not require or claim recipient receipt/read.
3. Apply the same predicate to eligibility reads, manual preparation and final send/confirmation. Recheck inside the existing protected write path so an outdated enabled button cannot bypass eligibility or create a second pending reminder.
4. Keep the initial automatic scheduling/delivery and retry behavior intact. Viewing the page or clicking an unavailable follow-up must not send an initial manual substitute.
5. Preserve Order status/date rules, Europe/Athens business-day restrictions, authorization, supplier-contact validation, review, recipient/content binding, pending-operation protection and existing confirmation-date behavior.
6. The existing readiness controls display the server's reason. After successful automatic sending, refreshing eligibility enables the follow-up only if all remaining conditions pass. A failure must not falsely enable it; loss of eligibility after review blocks submission and preserves useful feedback.
7. Verify absent automatic history, pending/failed/obsolete automatic records, successful SENT, wrong Order/type/manual trigger, pending follow-up, nonbusiness day, changed readiness/contact/version between review and confirm, concurrent requests and existing initial-delivery controls. Use a fake mail provider; send no real emails.

## Decisions and scope

Initial request remains automatic. A scheduled record is not proof it was sent. The request/date/ready redesign is deferred; reuse existing actions, confirmation and explanatory feedback.

## Context for agents

Baseline main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`.

Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/reminders/`:

* `ReadinessReminderCommandService.java` currently checks `hasScheduledMissingDateReminder` for PENDING Orders without a date.
* `ReadinessReminderRepository.java` currently matches Order + ASK_READINESS_DATE + SCHEDULED without delivery status. Provider ACCEPTED records SENT and sent_at.
* `ReadinessReminderDeliveryStatus.java`: PENDING, SENT, FAILED, OBSOLETE. Outbox COMPLETED also occurs for failed/obsolete results.
* Follow `ReadinessReminderPreparationService.java`, confirmation and delivery callers so the predicate cannot differ between visible eligibility and submission.

Client: `src/features/purchase-orders/components/details/readiness-emails.tsx` consumes server eligibility and shows existing actions/reasons.

## Verification

Review isolated eligibility/preparation/send and concurrency results, plus UI reason/refresh cases against the deployed revision. Inspect existing history only for deployment checks; do not send production mail.

**Reference:** [Reviewed readiness emails](https://linear.app/front-line-ltd/issue/FRO-328) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e).


---

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
