# VAT paperwork: three agreed ticket groups

The user accepted V1/V2/V3 on 9 November 2026 and requested complete drafts before Linear creation. The three numbered files contain the complete proposed descriptions. This index holds planning metadata and review evidence outside those descriptions. No issue has been created or modified; full text and metadata await review.

## Proposed metadata

All three: **Front Line LTD (FRO) · Backlog**. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or documents. Related references only; no blocking dependency or Ready promotion.

| Draft / literal title | Priority | Complete label set | Related issues |
| --- | --- | --- | --- |
| [V1 — Print ΥΔ — protect selections and print attempts](01-print-selection-and-attempts.md) | Medium | Story, Bug, Pending_Review, Flow QA, Frontend, export | FRO-317, FRO-352 |
| [V2 — VAT stamping — protect reviewed confirmations, dates and displayed progress](02-stamping-confirmations-and-progress.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, export, supplier invoice | FRO-317, FRO-321, FRO-348, FRO-352, FRO-379, FRO-385 |
| [V3 — VAT stamping — preserve and reconcile uncertain attempts](03-uncertain-stamping-recovery.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, export, supplier invoice | FRO-317, FRO-321, FRO-348, FRO-352, FRO-379, FRO-385 |

V1 is Medium because the demonstrated effects are temporary printing state and misleading errors; no incorrect physical print or persisted business change was observed. V2/V3 are High because confirmations, displayed operational progress and recovery can misrepresent the intended or saved event. These are proposed priorities, not deployed incident measurements.

Current status/label catalogues confirm Backlog and all labels above exist and are active. Story is the single Type, Frontend the single Area. Reuse Flow QA (06ea4564-06f3-40c4-b546-404049f66151). The entity tags are ordinary labels. Approval to create later does not imply Todo/Ready promotion or a source-code change.

## Consumer trace and ownership

| Consumer / current behavior and source | Required outcome | Owner | Preserved boundary |
| --- | --- | --- | --- |
| Export page generateYd/openYdDocument and print dialog accept mutable input and shared late errors | One originating selection/template; lock pending choices; isolate each result/error; prune invalid editable selection | V1 / criteria 1–4 | Current-data PDF rendering and saved membership, no new template |
| ExportYdService, PDF model/service and export-yd.html validate/group/render selected saved invoices | Keep current eligibility, Company+Supplier grouping/max-five, three templates and no writes | V1 / 5–6 | Read-only printing at each active Customs stage |
| SupplierInvoiceStampingAction.confirm reads live invoice.version | Capture reviewed version or require renewed review | V2 / 1 | Existing server stale/eligibility checks |
| Individual/bulk DatePicker and completion paths accept/discard newer date input | Lock pending picker; keep immutable submitted facts and operation ownership | V2 / 2 | V3 retains that same attempt during uncertainty |
| Bulk selections/selectedFor do not prune on query refresh | Show current eligible selection and validate new submissions; preserve submitted IDs separately | V2 / 3 | V1 owns the print manifestation of QA-VAT-03 |
| Export page saved() writes delayed response to shared cache, excluding detail invalidation | Retain newer invoice event facts or reread canonically, including after route return | V2 / 4 | No claim of database rollback; invoice events do not rely on Export version alone |
| Bulk error path maps unknown to failed; dialog/navigation lose context | Truthful unknown state and original-attempt retention/check on both surfaces | V3 / 1–3 | FRO-385 retains Customs/cancellation scope |
| Individual action clears recovery on close; Details keys it by stage and omits guard dirtiness | Preserve pending/unknown context across dismissal, stage remount and allowed leave/return | V3 / 2–3 | FRO-379 retains correction/cancellation scope |
| Individual checkAttempt accepts any date field; missing read unmounts parent | Match event/Export/date; distinguish mismatch, matching state and attribution; failed/missing reads remain unresolved | V3 / 4–5 | No ordinary overwrite or fabricated request-status API |
| ExportStampingService, invoice repository/API/activity/schema | Preserve shared guards, same-date replay, per-item outcomes and atomic invoice/history ownership | V2 / 5–7; V3 / 5–7 | No new bulk-version API, historical correction or blanket refactor |

Client paths are under frontline-forwarding-client/src/features/exports/details/components or features/supplier-invoices/components; backend under frontline-forwarding-app/src/main/java/com/frontline/forwarding. The descriptions name the exact files/operations. Existing FRO-317/321/348/352 own the underlying contracts; FRO-379/385 are related implementation references, not new owners or blockers.

## Finding coverage

| Finding / manifestation | Draft and principal criteria |
| --- | --- |
| QA-VAT-01 — pending print selection/template | V1 / 1–2 |
| QA-VAT-02 — old PDF error and overlapping generation | V1 / 2/4 |
| QA-VAT-03 — invisible print IDs | V1 / 3 |
| QA-VAT-03 — ineligible bulk IDs | V2 / 3 |
| QA-VAT-04 — unreviewed individual version, all stages | V2 / 1 |
| QA-VAT-05 — individual/bulk pending date input | V2 / 2 |
| QA-VAT-06 — bulk false certainty, changed retry and navigation loss | V3 / 1–3/5 |
| QA-VAT-07 — individual dismissal/stage refresh/navigation/missing-read recovery | V3 / 2–3 |
| QA-VAT-08 — unrelated recorded date accepted | V3 / 4 |
| QA-VAT-09 — late bulk cache/display replacement | V2 / 4 |

All nine findings are covered; QA-VAT-03 is split by consumer, not duplicated. V2 owns initial reviewed/submitted facts and successful response freshness; V3 preserves/reconciles those facts if the response is uncertain. Shared implementation must coordinate these boundaries. No blocking relation is inferred.

Each of the six V1 and seven V2/V3 criteria maps to a separate read-only post-deployment check (20 total). Those checks inspect isolated recordings/results and existing saved records; they do not submit live mutations. Missing proof stays Unverified.

## Decisions, preparation and limits

- Accepted grouping: printing; safe confirmations/current progress; uncertain-attempt recovery. Drafts propose explicit pending-control locks using existing controls. Text/metadata remain under review.
- Current full FRO-317/321/348/352 remain Done, unchanged. FRO-379/385 remain Backlog, unchanged. Current Bug searches for stamping and Print return FRO-384/385 only; their creation/Customs scopes explicitly exclude this workflow. FRO-384 was fully checked during grouping. No exact VAT-specific correction ticket found in these searches.
- Mandatory planning pull and authenticated gh check passed. Production main remains 6aa259553cd9c86a8aaa157902088aa9a6bca83e. Relevant client and backend consumers were reread from the authenticated pinned archive before writing these drafts.
- Prior evidence: 154 frontend observations/controls and 40 extracted Java method controls. Passing observations reproduce bugs, not fixes. No new application tests were run for documentation-only drafting.
- Runtime boundaries: mocked UI services; Java17 with stand-in repositories/authorization rather than Java25/Spring/PostgreSQL. Actual SQL/rollback/concurrency/HTTP permissions, authenticated browser journey, current PDF rendering and deployment equivalence remain unverified. All 30 full portal scenarios remain Not run. Source-loader archive limitation remains in the review report; no policy snapshot claimed.
- Reuse existing UI contracts; no canvas/preview or production branch. No production source/portal/database/AADE/email mutations, new vocabulary/ADR or Shipment Invoice scope. Aggregate Recorded/replay copy and conditional fixtures remain qualifications, not extra bugs.
- Full descriptions and complete metadata are for review before any Linear write. Later creation must recheck duplicates/current metadata and reread saved descriptions, complete labels, relations and attachments. Linked issue mentions may automatically add related relations; the proposed related sets above include them.

**Review sources:** [Findings](../../docs/qa/runs/2026-11-09-vat-exemption-paperwork.md) · [Flow](../../docs/qa/flows/vat-exemption-paperwork.md) · [Scenarios](../../docs/qa/scenarios/vat-exemption-paperwork.md) · [Evidence guide](../../docs/qa/evidence/README.md).
