**Supplier Invoice vessel corrections** must compare vessel identity and record the change even when both vessel names are equal.

## Problem to fix

QA-SI-07: an active invoice references eligible vessel 101. Change it to a different eligible vessel 102 with the same name and save. The service compares display names, reports no change and returns vessel 101. If Invoice number changes in the same save, persistence proceeds with vessel 102, but activity omits the vessel correction.

The IDs are synthetic fixtures. Exact extracted production methods reproduce the comparison/no-op behavior; the persistence branch and schema were inspected. Full backend/database execution remains outstanding.

## Acceptance criteria

1. **Reference identity:** a change between different eligible vessel IDs is a real correction, regardless of name equality. Vessel-only correction persists and returns the requested ID after re-read, retaining invoice identity and unrelated facts. An unchanged ID with unchanged facts remains a genuine no-op.
2. **Complete activity:** vessel-only and combined-field corrections record the vessel change with distinguishable old/new references and actor/time, atomically with the save. Combined correction includes every changed fact in one correction activity. Preserve existing activity readability and successful version progression.
3. **Existing guards:** preserve optional-vessel clearing, different-name changes, Client association, authorization, cancellation/Export/event restrictions, duplicate checks and stale-version rejection. Rejected corrections leave saved facts and successful activity unchanged. Do not merge/rename vessels or require unique names to avoid the defect.
4. **Verification:** run isolated backend/database tests for same-name vessel-only and combined changes, same-ID no-op, different-name change, clear, unauthorized/ineligible reference and stale correction. Re-read saved vessel ID/version and activity; validate the authorized correction response/read and Details consumer. Extracted-method checks alone are insufficient.

## Decisions and scope

Keep this backend identity/audit fix separate from frontend operation handling. Use existing Vessel records and Supplier Invoice correction contracts; no vessel-picker redesign, master-data restructuring, automatic repair of existing invoices or historical activity backfill.

## Context for agents

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; not proof of the deployed version.

Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/`:
- `supplierinvoices/SupplierInvoiceService.java`: changes compares vesselName values; an empty change list returns current; otherwise update and CORRECTED activity run together.
- `supplierinvoices/SupplierInvoiceRepository.java`: writes `freight_supplier_invoice.vessel_id` and stores `freight_supplier_invoice_activity.changes`.
- `vessels/VesselRepository.java`: distinct associated vessel records can share a name.

`frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql` and `V18__shared_client_vessels.sql` permit distinct same-name identities. The frontend Details editor already submits vessel IDs; preserve that contract.

Affected consumers: `correctSupplierInvoice`, its shared REST service, subsequent invoice reads, Details vessel reference and activity reads. QA scenario: SI-028. The comparison harness uses Java 11 stand-ins; the real backend requires Java 25 and database verification.

## Post-deployment verification

Read-only checks using existing records and isolated evidence; submit no production corrections. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Compare requested, returned and re-read vessel IDs in isolated vessel-only results; inspect same-ID no-op/version evidence. |
| 2 | Read vessel-only and combined activity records; compare old/new references, other changed facts and actor/time with saved results. |
| 3 | Review clear/different-name and rejected-write controls, comparing before/after record and activity snapshots. |
| 4 | Review database-backed results and response/Details evidence against the deployed build SHA. |

**Reference:** [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321) · [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings](https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/runs/2026-11-09-supplier-invoice.md) · [Backend evidence](https://github.com/frontlineltdproject-star/linear-project/blob/875aea5349321767d7e831bbda14b96ca2cdc626/docs/qa/evidence/supplier-invoice-backend-qa-repro.py).
