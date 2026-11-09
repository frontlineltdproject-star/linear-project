# Order-to-arrival regression scenarios

Read [FLOW-OS](../flows/order-to-shipment-arrival.md) for the normal journey, fixtures and vocabulary. **OS-001 (P0)** is that complete journey. The cases below expand it at business-rule boundaries; they are a prioritized first set, not a claim of exhaustive coverage.

P0 = core journey, data integrity or access protection to check first. P1 = important alternatives and usability/recovery coverage. These are test priorities, not assigned Linear bug severities.

All end-to-end scenarios are **Not run in this review**, unless a later run explicitly records otherwise. Isolated source reproductions are separately recorded in [the evidence log](../runs/2026-11-09-order-to-arrival.md). A test-file mapping indicates existing related coverage, not that the complete scenario passes.

Run mutation/failure-injection cases only in an authorized, isolated environment. Keep email scheduling and providers controlled; use no production fiscal submissions. Restore fixtures or use separate records between branches.

## OS-002 — Create directly in each initial state (P1)

- **Given:** Valid separate Order drafts; zero and nonzero collis.
- **When:** Create Awaiting with no date; Received with and without a date; Ready with and without a date. Cancel each confirmation before also trying Confirm.
- **Then:** Awaiting rejects a date; Received requires a date; Ready permits an optional date and zero collis. Received/Ready dates may be past, today or future. One direct initial status event; no fabricated stock or earlier statuses. Cancel saves nothing and retains the draft.
- **Contract:** FRO-335/336.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-003 — Greece and warehouse customs capabilities (P0)

- **Given:** Authorized opening warehouses with known supported regimes, including a single-option warehouse and one with no capabilities.
- **When:** Select Greece Yes; try without regime, explicitly select a supported regime, then change warehouse. Separately try Greece No and incompatible ΑΛΚ.
- **Then:** Yes requires an explicit supported choice, even for one option. Missing/unavailable capabilities block with explanation. A compatible selection survives a warehouse change; incompatible values require resolution, with no silent replacement. No persists neither regime nor ΑΛΚ. Do not use No to bypass a Yes-case failure.
- **Contract:** FRO-335/356.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-004 — Colli corrections preserve identity (P1)

- **Given:** Order creation draft, then a saved early-stage Order without open Shipment participation.
- **When:** Add/save a colli row; attempt to correct it; on saved Order correct a colli and cancel a second edit. Later attempt editing through the Order during open Shipment participation.
- **Then:** Creation draft stays correctable under its UI contract; saved corrections retain permanent IDs. Cancel retains saved facts. Open participation prevents unauthorized changes to the reserved colli set. Record missing controls separately from data-validation failure.
- **Contract:** FRO-335/326; current Order journey.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-005 — Create with a valid attachment (P0)

- **Given:** Fresh eligible Order draft; tiny nonempty qa-attachment.txt; valid internal create/edit identity.
- **When:** Choose the file, observe staging, then Create and open Documents. Repeat on a fresh Shipment draft once its own prerequisites are met.
- **Then:** File staging creates no business record. Successful creation returns one record with the selected file attached; list/download returns the same bytes and metadata. A staging refusal is visible and does not result in a falsely successful record. Capture which request returns 401 if observed.
- **Contract:** FRO-342/335/341; reported note #5.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-006 — Upload failure, lost response and safe retry (P0)

- **Given:** Isolated environment permitting controlled network/auth/storage faults; separate drafts for each failure.
- **When:** Test one valid and one rejected file, lost upload response, lost create response, retry/recovery, explicit file removal and expired context.
- **Then:** Invalid files are identified individually; retain the rest of the draft. Never create with unresolved selected uploads. Retry the same operation without duplicate bytes/record/attachments; unknown results require recovery before a new create attempt. Explicit removal excludes that file. Expiry is explained, with no reuse of closed context. A rejected atomic creation leaves no partial Order/collis/history.
- **Contract:** FRO-342/335/341.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-007 — Independent edits and stale Order save (P1)

- **Given:** Saved editable Order; separate Notes and Details drafts; two sessions for conflict case.
- **When:** Save one card; cancel another. Perform a permitted details/readiness correction with reason; then attempt a stale save from the other session.
- **Then:** Only the submitted card changes. Changed readiness status requires its review/reason and valid conditional date; ordinary fields plus correction commit atomically. Stale save rejects and preserves the draft; no overwrite of concurrent data or other card drafts.
- **Contract:** FRO-326/346.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-008 — Readiness-email eligibility is not status alone (P1)

- **Given:** Mock Orders in Pending, Received and Ready; controlled Athens date and reminder history; sandboxed email before any Send test.
- **When:** Inspect both actions and disabled reasons. Compare missing supplier contact, missing initial scheduled request, a pending reminder, weekday/window and Ready cases. Open/cancel review; send only under separate controlled integration execution.
- **Then:** Request needs Pending/no date plus existing manual eligibility; Confirm needs Received/date plus its window. A disabled Request on a Pending Order is not alone proof of a bug. Preview/cancel queues nothing; sending is distinct from changing readiness. Confirmed sending, retries and provider results require their own evidence.
- **Contract:** FRO-328/326; reported note #6.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-009 — Warehouse stock confirmation is complete and atomic (P0)

- **Given:** Ready Order at expected opening warehouse with two nonterminal collis.
- **When:** Try no position; missing/duplicate/foreign measurements; invalid dimensions/weight; unsupported regime; Back from review; then submit complete valid measurements.
- **Then:** Refusals and Back change no custody, status, measurements or successful history. Valid confirmation records first arrival and stock together. Exactly one valid measurement per nonterminal colli and nonempty storage position required. Empty Ready Order cannot enter stock.
- **Contract:** FRO-336/356/326; confirmInStock.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-010 — Change warehouse after starting Shipment from an Order (P0)

- **Given:** Stocked eligible Order; enter through its Start shipment link with seeded origin and Order selection.
- **When:** Change origin warehouse, including a warehouse with no eligible candidates; repeat country/city changes. Test delayed/failed candidate responses and return to original warehouse.
- **Then:** No render crash or endless updates. Origin follows the user's current selection; stale URL seed must not repeatedly undo it. Selection is re-evaluated and feedback explains incompatibility. No reservation, split or Shipment before Create. Keep the browser console and request chronology as incident evidence.
- **Contract:** FRO-341/325; reported note #7.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-011 — Route and destination validation (P0)

- **Given:** Fresh Shipment draft and eligible cargo.
- **When:** Try each purpose's destination shape, origin=destination, missing city/country, city in wrong country and warehouse outside selected city. Then complete one valid route.
- **Then:** Reject incompatible routes with useful feedback, no Shipment/reservations. Required geography and current warehouse-city consistency hold. Warehouse destinations exclude the origin; external agent and vessel destinations use their owning rules. Preserve recoverable draft inputs.
- **Contract:** FRO-341/325/339; Shipment lifecycle.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-012 — Plan upcoming goods without inventing stock (P1)

- **Given:** Whole Ready Order and whole Received Order dated today/future; also Pending and past-dated Received candidates.
- **When:** Try selecting each. Create with eligible upcoming goods, save packing, attempt readiness/dispatch; then complete supplier readiness/intake and retry.
- **Then:** Eligible whole upcoming Orders can reserve without becoming stocked. Pending/past-dated new Received selection is ineligible. Readiness/dispatch stay blocked until actual stock confirmation. Reserved Order becomes PREPARED_FOR_SHIPMENT when stocked; no repeated reservation or split.
- **Contract:** FRO-325; Order journey.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-013 — Partial selection and exact cargo (P1)

- **Given:** Stocked Order with two movable collis and a terminal colli; separate upcoming Order.
- **When:** Select one movable colli, review split reason/remaining cargo and Create. Test missing reason/Other remark and upcoming partial selection.
- **Then:** Only valid stocked partial selection creates an explicit participating child atomically. Same selected colli ID moves to child; unselected and terminal members stay on parent. Full movable selection creates no child. Upcoming partial selection rejects. No duplicates or partial split on failure.
- **Contract:** FRO-325; FRO-362 future scope excluded.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-014 — Select from arrived Shipment using current availability (P1)

- **Given:** Arrived warehouse-bound source at the new origin; goods now stocked there. Include a colli now reserved elsewhere or ineligible.
- **When:** Select through arrived-source and direct-Order views; choose the same colli via both; change availability in another session before Create.
- **Then:** One selection per permanent colli ID. Current attribution/availability wins over historical loading ownership. Ineligible goods have reasons. Stale reviewed selection rejects atomically and requires refreshed review. Previous overpack is not automatically the new Shipment's packing.
- **Contract:** FRO-323/341/325.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-015 — Packing plan versus actual readiness (P1)

- **Given:** Preparing Shipment with two stock-confirmed participating collis.
- **When:** Save all-individual plan; confirm readiness; on a separate copy group both in one valid overpack. Try duplicate/foreign assignment or an empty unit.
- **Then:** Plan save alone keeps Preparing. Explicit physical confirmation makes Ready when no blockers remain. Two individual collis = two transport pieces; one overpack containing both = one transport piece, still two collis. Invalid arrangements change nothing; colli master identities/measurements remain intact.
- **Contract:** FRO-325/316.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-016 — Material edit invalidates readiness (P1)

- **Given:** Ready Shipment with no protected fiscal documents for the baseline; separate fixture with protected document for guard test.
- **When:** Save changed packing/route/membership; compare Cancel/no-op and document-number-only/Notes changes. Attempt material change with affected protected document.
- **Then:** Material changes require warning and save returns Preparing; no-op/Cancel preserves Ready. Number-only/Notes/file changes preserve readiness. Atomic selection releases/reservations and valid retained packing are preserved. Affected protected documents block without silently rewriting or issuing them.
- **Contract:** FRO-344/325/316.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-017 — Dispatch requires readiness and saved reference (P0)

- **Given:** Preparing Shipment, then Ready without reference.
- **When:** Attempt Dispatch in Preparing, then Ready without number. Save unique number and retry; separately try duplicate number or mismatched supplied number.
- **Then:** NOT_READY_FOR_DISPATCH, TRANSPORT_DOCUMENT_MISSING and applicable duplicate/mismatch errors prevent departure. Saving number alone does not dispatch. Valid dispatch uses the saved mode-compatible reference, updates every participating Order and source stay once.
- **Contract:** FRO-325/316; ShipmentReadyForDispatchTests.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-018 — Dispatched goods and route stay locked (P1)

- **Given:** Dispatched operational Shipment.
- **When:** Attempt route/membership/packing/document change; inspect allowed Notes, attachments and arrival actions.
- **Then:** Post-dispatch movement facts remain locked at UI and server. Notes/files keep their separately permitted behavior. Dispatch is not repeatable as another departure. Record arrival remains available to authorized editors through Available actions.
- **Contract:** FRO-325/344/316.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-019 — Warehouse arrival then receiving stock confirmation (P0)

- **Given:** Dispatched Warehouse transfer to B.
- **When:** Record arrival once; inspect Shipment, Orders, stays and journeys. Confirm stock at B using measured values, then inspect onward eligibility.
- **Then:** Shipment Arrived; Orders Awaiting import; destination stays AT_WAREHOUSE; exact content/participation closed as arrived. Stock confirmation then makes Orders In stock without a second arrival. Same permanent colli IDs and preserved prior leg history. Source stays stay departed.
- **Contract:** Shipment lifecycle; FRO-316/345.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-020 — Final handover matches the destination (P0)

- **Given:** Separate dispatched third-party, vessel and launch-station Shipments; all fixture reference relationships valid.
- **When:** Try missing handover, wrong kind/agent/vessel, missing receiver, arrival time before departure; then submit correct handover.
- **Then:** Invalid handover/time refuses the entire operation. Correct purpose-specific handover makes Shipment Arrived and Orders ARRIVED_AT_DESTINATION, with appropriate delivery outcome. It does not create warehouse stock. Launch-station flow requires station and receiver details.
- **Contract:** Shipment lifecycle; ShipmentArrivalForm.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-021 — Cancel before dispatch; preserve truthful history (P1)

- **Given:** Preparing and Ready fixture Shipments with stocked/upcoming participants; separate record with active blocking Export/invoice.
- **When:** Cancel with reason; try cancellation after dispatch and with protected linked records.
- **Then:** Permitted cancellation releases reservations once; stocked Orders return In stock, upcoming Orders keep readiness; colli identities/history stay. Dispatched cancellation rejects. Active linked-record guards explain prerequisite resolution; no automatic fiscal or customs cancellation.
- **Contract:** FRO-325/344/345; linked-record guards.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-022 — Retry and concurrent allocation (P0)

- **Given:** Two independent sessions and an isolated fault-injection harness.
- **When:** Compete to allocate same collis; retry same creation/Shipment command after lost response; reuse request identity with different content; submit stale material edit.
- **Then:** At most one conflicting allocation. Identical accepted attempt recovers its record/result without duplicate split, reservation, event or document. Changed-payload reuse conflicts. Version/review changes require renewed review. Verify underlying records as well as toast messages.
- **Contract:** FRO-342/325/344/345.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-023 — Saved facts and audit agree across pages (P1)

- **Given:** Completed baseline with its known IDs.
- **When:** Refresh/reopen Order and Shipment; inspect lists, colli trace, warehouse history and Shipment history. Compare counts, statuses, saved references and timestamps.
- **Then:** No UI-only success: persisted facts agree. Permanent identities and original/loading attribution remain traceable. Failed/cancelled operations add no successful lifecycle event. Unknown historical facts remain unknown rather than invented.
- **Contract:** FRO-345/316/326; Order/Shipment workflows.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-024 — Role and record boundaries (P0)

- **Given:** Internal operator, view-only partner and unauthorized-company test identities.
- **When:** Open only authorized records; inspect controls; in isolated API tests attempt forbidden mutations and cross-record attachment/context access.
- **Then:** Internal commands require correct authorities; partners cannot mutate Orders or access mixed-client Shipments. Cross-company Order and attachment reads denied. Hiding controls is not the only enforcement. Upload-context ownership and actor-scoped retry remain enforced.
- **Contract:** Authorization; FRO-342.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-025 — EN/EL, navigation and readable failures (P1)

- **Given:** Representative baseline states and unsaved forms.
- **When:** Switch EN/EL, inspect narrow layout and keyboard review/Cancel, use normal entry links and back navigation.
- **Then:** Actions, errors and status meanings remain distinguishable without clipped required content. Unsaved draft handling follows the owning screen contract; locale/tab changes do not silently lose fields/files. Missing top-bar entries are investigated against their own scope, not assumed to be permissions.
- **Contract:** FRO-335/326/341/316.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## OS-026 — Legacy mock Order lacks customs regime (P1)

- **Given:** Existing mock Greece=Yes Order with missing regime and an authorized ordinary-correction state; no invented migrated values.
- **When:** Attempt stock/storage admission or Warehouse-transfer creation, then perform permitted compatible correction in isolated test and retry.
- **Then:** Initial admission blocks with an actionable missing-regime reason. Do not silently infer a regime. Corrected supported data allows the applicable operation; locked-stage/document conflicts stay blocked. This can explain note #1 without proving a code defect.
- **Contract:** FRO-356; reported note #1.
- **Record:** build/role/fixture IDs, actual result, evidence and Pass / Fail / Blocked / Not run.

## Existing automated-test starting points

Paths below are relative to the pinned production source in the run ledger. These files were inspected for relevant coverage; the backend and complete frontend suites were not run by this catalogue review. Unit/component tests with mocked services do not prove deployed HTTP authentication, storage, or a complete browser journey.

| Scenarios | Related tests to review/run in an isolated checkout |
| --- | --- |
| OS-001/009/019 | `PurchaseOrdersApiTests.createsAndMovesWholePurchaseOrderFromPendingToStockThroughRest`; `ShipmentsApiTests.createsMixedPurchaseOrderShipmentAndCompletesHubTransferWithOneDocument`; client `order-status-card.test.tsx` |
| OS-002/003 | client `purchase-order-creation-form.test.tsx` |
| OS-007 | `OrderReadinessCorrectionSaveApiTests`; client card-save tests |
| OS-008 | `ReadinessReminderPreparationTests`, `ReadinessReminderConfirmConcurrencyTests`; client `readiness-emails.test.tsx` |
| OS-010/011/014 | client `shipment-creation-mapping.test.ts`; inspect hook-level integration separately for route seeding/refetch loops |
| OS-012/013 | `ShipmentsApiTests.plansSupplierReadyAndFutureReadinessPurchaseOrdersWithoutMarkingThemInStock`; `createsNumberedChildPurchaseOrderForCollisSelectedForShipment`; `rejectsPartialSelectionBeforeThePurchaseOrderIsInStock` |
| OS-015/016 | `ShipmentPackingAndReadinessTests`, `ShipmentRouteEditTests`, `ShipmentMembershipEditTests` |
| OS-017/018 | `ShipmentReadyForDispatchTests`, `ShipmentReadinessBlockerTests` |
| OS-020 | client `shipment-arrival-form.test.tsx`; server handover tests in `ShipmentsApiTests` |
| OS-021/022/023 | `ShipmentRequestConcurrencyTests`, `ShipmentHistoryCaptureTests`, `ShipmentHistoryReadTests`, `ShipmentExportGuardTests`, `ShipmentInvoiceGuardTests` |
| OS-024 | `ShipmentsApiTests.deniesShipmentReadsAndMutationsToPartnerUsers`; `PurchaseOrdersApiTests.deniesPartnerMutationsAcrossRestAndGraphQl`; actual filter-chain/upload coverage must be checked separately |

Backend web tests live under `frontline-forwarding-app/src/test/java/com/frontline/forwarding/web/`; client tests under `frontline-forwarding-client/src/features/`. Missing named coverage should become a test gap, not an inferred Pass.
