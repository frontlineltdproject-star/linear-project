**Separate the Order’s customs regime from its physical warehouse.** Warehouse capabilities determine permitted storage regimes; the Order records its explicit regime, independently of physical movements and warehouse licence references.

**Order = purchase order = stock-list item. Colli = individually identified handling unit.** One regime applies to the whole Order when **Greece = Yes**. **Greece = No** has no applicable regime or ΑΛΚ. Mixed regimes within one Order are outside scope.

## Fields

| Entity / field | Type / format | Contract |
| -- | -- | -- |
| Warehouse — physical identity | Existing Warehouse reference and operational fields | Retain identity, operator, address and custody relationships. Names/selector labels identify the physical facility without FREE ZONE, BONDED or Free Circulation suffixes. |
| Warehouse — supported regimes | Set of agreed regime values | Explicitly maintained capabilities; never infer them from a name, address or licence text. |
| Warehouse — licences / authorisations | Related reference records | Associate each reference with its warehouse and supported regime(s). Preserve issued letters and leading zeros. Reference data only: no automatic expiry/suspension enforcement or new administration screen. |
| Order — Customs regime | Conditional single selection | **Ελεύθερη Κυκλοφορία / Τελωνειακή Αποθήκευση / Τελωνειακή Αποταμίευση**. Required for Greece = Yes; null for Greece = No. Explicit selection, even if only one option is supported; no default. |
| Order — ΑΛΚ (Αριθμός Λογιστικής Καταχώρησης) | Optional digits-only String, maximum 50 characters | Applicable only to Greece = Yes + Τελωνειακή Αποταμίευση. Preserve leading zeros. Blank at creation and later entry are valid. |
| Registration coverage | Verified relationship between a registration and its goods/covered Orders | Identifies Orders sharing one current ΑΛΚ, including covered split descendants. Common ancestry or matching reference text alone is insufficient. |

Ελεύθερη Κυκλοφορία may be supported without a licence number. Licence references are distinct from ΑΛΚ and Entry Note numbers. No ΑΛΚ generation, sequence scope or new uniqueness constraint is introduced.

## Validation by operation

| Operation | Rule |
| -- | -- |
| Create Order / duplicate for new goods | Preserve active Opening warehouse validation. For Greece = Yes, require explicit regime selection supported by that warehouse. Duplication copies neither regime, ΑΛΚ nor registration coverage. |
| Creation draft: Greece → No | Clear regime and ΑΛΚ; disable both and omit stale values. Returning to Yes requires fresh selection. |
| Creation draft: Opening warehouse changes | Retain a supported regime. If unsupported, mark it invalid and require selection; never silently replace it or discard ΑΛΚ. |
| Saved regime/Greece correction before first storage admission | Validate against the recorded Opening warehouse. |
| Saved regime/Greece correction while In stock | Validate against the actual occupied warehouse established by custody history. An expected/inbound stay alone is insufficient. |
| Storage admission / warehouse transfer | Validate the receiving warehouse against each affected applicable Order’s regime before committing the storage admission/transfer. Reject unsupported combinations atomically without changing the regime. Revalidate server-side at the operation, not only when planning it. |
| Departure, transit, missing location or non-storage destination | Preserve regime and ΑΛΚ. An airport, vessel or other non-storage destination need not support the stored regime. Movement never performs a customs transition or changes Greece. |
| Unrelated save | Preserve customs facts. Missing custody/capability data must not block an otherwise-valid unrelated save or silently clear values. |

If the required validation warehouse or capability data is missing, unavailable or ambiguous, block the affected customs selection/correction/admission with an actionable explanation. An empty supported-regime set permits no selection. Never substitute Opening warehouse for missing current custody after admission.

Server-side validation applies across supported write interfaces. Greece = No rejects nonblank regime/ΑΛΚ; nonblank ΑΛΚ is rejected outside Αποταμίευση. Distinguish omitted unchanged fields from explicit clearing so unrelated saves cannot erase customs data.

## Saved corrections and document protection

Ordinary **regime/Greece corrections** retain the existing editable stages: **PENDING, EXPECTED_READINESS, READY, IN_STOCK**. They correct mistakes; they do not implement actual customs transitions.

Before saving, validate the proposed combination against current custody, warehouse capabilities, registration coverage and affected saved documents. In particular:

* Do not leave a storage Supplier Invoice or covered Entry Note incompatible with its Order’s regime.
* Do not silently convert invoice types, change Export membership, rewrite stamping/dispatch/return events, or alter issued document contents.
* Reject a correction that would invalidate shared registration/admission coverage. Do not automatically propagate regime/Greece corrections to other Orders.
* Return an actionable conflict explanation. Formal customs transitions and reconciliation workflows are separate scope.

When an otherwise-permitted correction changes Greece to No, leaves Αποταμίευση, or clears an existing ΑΛΚ, show the values and covered Orders affected and require confirmation. Save the compatible change and clearing atomically; reject it if documents or shared coverage would become inconsistent. Cancel restores saved values. Leaving Αποταμίευση requires an explicit replacement regime when Greece remains Yes.

An unsaved regime change must likewise not silently discard entered ΑΛΚ: resolve its removal explicitly before submission. No stale incompatible value may reach persistence.

## Splitting and shared ΑΛΚ

Both **manual splits** and **automatic splits during Shipment preparation** retain the parent’s regime for the same goods, without changing the parent’s regime.

Split goods covered by the original registration retain that coverage and its current ΑΛΚ. Preserve verified coverage even when ΑΛΚ has not yet been entered, so later entry reaches the correct Orders. Do not infer coverage from family membership, equal ΑΛΚ text, a warehouse name or an unrelated Entry Note.

Authorised **ΑΛΚ-only entry/correction** is available from every **non-cancelled** Order stage, including transit and completed delivery. It does not unlock regime, Greece, custody or other normally locked fields.

Before saving, show which Orders share the affected registration. Update the current ΑΛΚ for all verified covered Orders atomically, preserving historical facts and previously issued document contents. If coverage, authorisation or concurrency validation fails, save nothing. Do not create independent copies that can diverge or update unrelated family members.

## Authorisation, concurrency and audit

Preserve **PURCHASE_ORDER_CREATE** and **PURCHASE_ORDER_EDIT** and their existing internal Frontline/system-administrator access boundaries. The ΑΛΚ-only operation uses edit authority without bypassing record scope.

Validate current state, document compatibility, warehouse capabilities and registration coverage in the same atomic operation as the write. Reject stale/conflicting attempts; preserve the draft and explain that current data must be reviewed. A concurrent split must not leave a covered child with an outdated ΑΛΚ.

Audit actor, time, operation, affected Order/registration identities and before/after Greece, regime and ΑΛΚ values as applicable. Failed or cancelled operations leave no partial changes. Preserve colli identities, warehouse stays, movement history and separately owned invoice/customs records.

## Presentation and downstream ownership

| Owner / surface | Required integration |
| -- | -- |
| **FRO-335 — Create Order** | Reuse its Opening warehouse, conditional regime/ΑΛΚ controls, loading/error states and draft retention. Consume explicit selection and confirmed incompatible-value removal; no ΚΤΑ input. |
| **FRO-326 — Order Details** | Reuse shared **Edit / Save / Cancel**. Where ordinary editing is unavailable, enable only ΑΛΚ for an eligible authorised Order. Show shared-registration impact before Save; preserve other field locks and failure/Cancel behaviour. Current warehouse remains read-only. |
| Order header/list | Regime display derives only from the explicit Order field. Use **Τελωνειακή Αποθήκευση**, not the KTA-derived Free Zone / Ελεύθερη Ζώνη label. Greece = No has no regime badge. |
| Colli Create/Edit and current-regime tags | Remove the editable Bonded checkbox and obsolete flag-derived current-regime tags across Order header/list, colli and colli history. Preserve genuine recorded history and the legitimate Order Αποταμίευση regime. |
| **FRO-329** | Owns remaining route/customs cleanup; ΑΛΚ retention and ΚΤΑ replacement belong here. |
| **FRO-319 / FRO-321** | Consume the explicit regime for Entry Note eligibility and Supplier Invoice compatibility. Storage invoice type follows Αποθήκευση, even before a note exists. No automatic invoice-type mapping is introduced for the other regimes. **FRO-347 / FRO-348** present those contracts. |

Trace ΚΤΑ, colli Bonded and warehouse-derived consumers across filters, prints, APIs and integrations. Retire obsolete regime derivations without renaming separately owned invoice types or customs documents, or portraying today’s regime as a past fact.

This ticket owns data, validation, safe operations and integration contracts. FRO-335/FRO-326 own the existing presentation. No additional design canvas or preview is required; their integration must reflect the ΑΛΚ-only editing and confirmation rules above.

## Rollout and scope

This delivery uses **mock data**. Update fixtures and seeds to explicit physical warehouses, supported regimes and compatible Orders. Retire ΚΤΑ and editable colli Bonded from active contracts and persistence, coordinating consumers and generated documentation before removing their old inputs/outputs.

Do not derive real capabilities, licences or warehouse merges from demo names, shared addresses or legacy FREE ZONE/BONDED labels. Actual operational reference values require confirmed office records; no invented real licence numbers.

**Out of scope:** importing or reconciling real legacy operational data; bulk deletion/reassignment of real records; automatic licence expiry/suspension rules; licence administration UI; actual customs transitions; formal document reconciliation; ΑΛΚ generation/uniqueness; mixed-regime Orders. Existing real data is not authorised for deletion by the mock-data rollout.

## Decisions

| Decision | Reason |
| -- | -- |
| Explicit selection; no default | A warehouse’s capabilities do not establish an Order’s customs arrangement. |
| Validate storage operations; preserve facts during movement | Physical movement and customs transitions are separate events. |
| Restrict regime corrections; allow later ΑΛΚ-only updates | Late paperwork must not unlock broader lifecycle changes. |
| Share ΑΛΚ through verified registration coverage | Splitting the same goods does not create a new registration; independent copies would drift. |
| Clear only through confirmed compatible changes | Prevent silent loss and inconsistent documents/coverage. |
| Reference-only licences; mock-data rollout | Keep this delivery separate from licence lifecycle automation and real legacy migration. |

## Acceptance criteria

1. Warehouse data separates physical identity, supported regimes and licence references; names and addresses do not determine capabilities.
2. Greece = Yes requires explicit supported selection, including a single-option warehouse. Greece = No persists no regime/ΑΛΚ and rejects nonblank inputs.
3. ΑΛΚ remains optional for Αποταμίευση, preserves leading zeros, and rejects non-digits, more than 50 characters and incompatible regimes.
4. Creation, correction and storage admission/transfer use the validation sources above. Unsupported, unavailable or ambiguous data fails safely; unrelated saves preserve customs facts.
5. Movement, transit and missing-location states do not change customs facts or impose storage capability checks on non-storage destinations.
6. Regime/Greece correction obeys state and document guards. Confirmed compatible clearing is atomic; cancellation/conflict leaves saved data unchanged.
7. Both split paths preserve regime and verified registration coverage. Duplication for new goods requires fresh selection and has no ΑΛΚ/coverage.
8. ΑΛΚ-only updates work from every non-cancelled stage, update all covered Orders atomically, preserve issued/history facts and leave unrelated Orders untouched.
9. Authorisation, stale-write and concurrent split/update checks prevent bypasses and partial updates; audit records contain the required before/after details.
10. Existing Create/Details controls implement the contract, including ΑΛΚ-only editing, confirmations, EN/EL, draft retention and conditional fields. No editable ΚΤΑ or colli Bonded remains.
11. Current badges/filters/prints/integrations use explicit regime without rewriting history or silently converting separate customs/invoice records.
12. Mock fixtures, persistence, supported API contracts and curated/generated documentation agree; real legacy migration is not performed.

## Context for agents

Live repository inspected on **21 October 2026**, main **3820e89e8caa341261e2d48bcb282d93e1bb1d03**:

* `docs/reference/database.md` — existing `freight_purchase_order` has `opening_warehouse_id`, `kta` and `alk`; warehouse/stay relationships must be preserved. Explicit regime and registration coverage are new contracts.
* `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls` — existing Order create/update/read contracts expose legacy customs fields; update affected supported adapters and generated clients.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrderRequestValidator.java` — active Opening warehouse requirement and optional digits-only ΑΛΚ limit of 50.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java` — ordinary header-edit state guards, immutable Opening warehouse, manual split copying and existing HEADER_UPDATED audit with empty details. Extend audit and implement the narrow late-ΑΛΚ operation.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderAuthorizationService.java` — create/edit authority and internal-user boundaries.
* `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/purchaseorders/PurchaseOrderWarehouseStay.java` and `web/purchaseorders/service/PurchaseOrderOutputAssembler.java` under the same Java package root — “active” excludes DEPARTED/LOCATION_UNKNOWN, so currentWarehouseStay can be EXPECTED/AWAITING_IMPORT. It does not prove physical presence.
* `docs/workflows/purchase-order-colli-journey.md` — manual and Shipment-preparation split paths, custody history and empty current stay for LOCATION_UNKNOWN.

Affected systems: **frontline-forwarding-app** Order/Warehouse models, persistence, validation, authorisation, audit, split/movement operations and supported GraphQL/REST/MCP adapters; **frontline-forwarding-client** shared Order editor, creation, lists and downstream consumers. The regime choices and registration rules are agreed business requirements, not inferred current implementation.

## Post-deployment verification

Production checks are **read-only**. Mutation behaviour is verified by inspecting safe-environment test evidence, never by submitting production changes.

| AC | Read-only check |
| -- | -- |
| 1 | Read warehouse reference data; compare physical identity, explicit capability sets and licence references with the approved configuration. |
| 2–3 | Inspect representative Order reads for Greece Yes/No and all regimes, including blank and leading-zero ΑΛΚ. Review test evidence for requiredness, no defaults and invalid input rejection. |
| 4–5 | Compare saved Order/stay/movement history before and after tested admissions/transfers/transit. Review evidence for unsupported destinations, unavailable validation data and unchanged unrelated saves. |
| 6 | Review correction tests across allowed/disallowed states, incompatible documents, confirmed clearing and cancellation; compare resulting records/audits. |
| 7 | Inspect manual/automatic split families and duplicate test results for regime, ΑΛΚ and verified coverage. |
| 8–9 | Inspect shared-registration reads, issued-document snapshots and audit records after safe-environment late entry/correction. Review permission, cancelled-stage initiation, stale-write and concurrent-split tests for atomicity. |
| 10 | Open Create/Details in EN/EL without submitting. Confirm conditional controls, existing field locks, eligible ΑΛΚ-only editing and absence of ΚΤΑ/Bonded. Review confirmation/Cancel/failure test evidence. |
| 11 | Inspect Order labels, colli history, filters and generated outputs; verify explicit regime sourcing and preservation of historical/document facts. |
| 12 | Inspect fixtures, deployed read contracts, generated documentation and release evidence for retirement of legacy fields and absence of real legacy import. |

**Reference:** Repository files above; FRO-335, FRO-326, FRO-329, FRO-293, FRO-319, FRO-321, FRO-347 and FRO-348; agreed office rules.
