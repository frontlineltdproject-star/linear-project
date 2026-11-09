# Shipment Invoice review scenarios

Defined before defect tests on 9 November 2026 from [the expected flow](../flows/shipment-invoice.md). Full portal scenarios are **Not run** initially; isolated observations, source traces and backend checks must be identified separately in the run report. Fixtures are synthetic. No production mutations.

| ID | Priority | Scenario / expected protection |
| --- | --- | --- |
| SHI-001 | P0 | Shipment entry versus standalone creation; correct preselection and staff access |
| SHI-002 | P0 | Non-cancelled preparing/departed/arrived eligibility; cancelled Shipment denied |
| SHI-003 | P1 | One/multiple Clients, company scope, Shipper keep/replace; company does not filter goods |
| SHI-004 | P0 | Whole Order/row selection, source identity/order, deselection and duplicate-row rejection |
| SHI-005 | P0 | Known, unknown and partially covered groups; allocation changes and disabled candidates |
| SHI-006 | P0 | Current values, single-currency totals, mixed-currency refusal and allowed overlap warning |
| SHI-007 | P0 | Refresh adds/removes/changes goods without losing document edits or silently selecting new rows |
| SHI-008 | P0 | Creation/navigation, Shipment change and Shipper safeguards; pending/unknown create cannot be replaced blindly |
| SHI-009 | P0 | Delayed eligibility/evaluation responses cannot overwrite a newer selection or draft |
| SHI-010 | P0 | Incomplete valid draft, same-request replay, payload/actor mismatch and failed return navigation |
| SHI-011 | P0 | Details round-trip, locked Shipment, saved values without reapplied defaults |
| SHI-012 | P0 | Background record refresh versus dirty edits; preserve reviewed version and conflict recovery |
| SHI-013 | P0 | Later typing during save; close/reopen or other action during unresolved save |
| SHI-014 | P0 | Review fingerprint covers current source identities/values/eligibility and packing/weight/partial amount |
| SHI-015 | P0 | Source deletion/ineligibility warning remains until explicit resolution; new rows unselected |
| SHI-016 | P0 | Finalize required fields and saved review; stale acknowledgement/expected version rejected |
| SHI-017 | P0 | Finalization retry/concurrency/rollback consumes one number at most and leaves no partial snapshot |
| SHI-018 | P0 | Finalization freezes fields, line values/source IDs and totals despite later source changes/deletion |
| SHI-019 | P0 | Lost finalization response reconciles original action before retry; no second number |
| SHI-020 | P0 | Draft discard versus Cancel editing; replay of discarded create and navigation failure |
| SHI-021 | P0 | Cancellation role, reason, reviewed version, already cancelled guard and immutable history |
| SHI-022 | P0 | Lost cancellation response and dialog/navigation handling preserve recovery |
| SHI-023 | P0 | Replacement starts unsaved; cancellation of form creates nothing; correct defaults/current rows |
| SHI-024 | P0 | Replacement creation retry/concurrency, one-live-replacement limit, discarded replacement and bidirectional links |
| SHI-025 | P0 | Lost replacement response/failed navigation retains original request and saved identity |
| SHI-026 | P0 | Shipment cancellation blocked by draft/finalized invoices, including creation/finalization race |
| SHI-027 | P0 | Finalized-goods removal confirmation and allocation correction identify/protect affected invoices |
| SHI-028 | P0 | Partner and missing-authority direct REST/GraphQL reads/writes denied; actor is server-derived |
| SHI-029 | P1 | Card status/number/Client/total/correction links; discarded rows excluded |
| SHI-030 | P1 | Read failures/not-found, EN/EL labels, keyboard and narrow layouts; distinguish actual browser evidence |
| SHI-031 | P1 | Deferred list/menu (FRO-371), printing/discounts and unrelated Export/VAT scope are not counted as bugs |

Execution evidence is recorded in the [9 November run register](../runs/2026-11-09-shipment-invoice.md#scenario-execution-register). All complete portal journeys remain Not run end-to-end; the register distinguishes isolated controls, reproduced failures and source traces.
