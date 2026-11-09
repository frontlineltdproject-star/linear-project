# VAT-exemption paperwork (FLOW-VAT)

## Purpose and boundary

Track the paperwork for eligible Supplier Invoices from Υ.Δ. generation through dispatch for stamping, stamped return and onward sending to the recipient. Customs completion and invoice exemption are separate. Sending papers is not recipient receipt or physical goods delivery.

User approved this review on 9 November 2026. Map saved before defect reproduction. Shipment Invoice is owned by the parallel chat “Check production review progress”; it is outside this review. Existing Export creation/Customs findings and Supplier Invoice correction/cancellation tickets are overlap references, not permission to expand them.

## Sources

Current full [FRO-317](https://linear.app/front-line-ltd/issue/FRO-317), [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321), [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348), [FRO-352](https://linear.app/front-line-ltd/issue/FRO-352): all Done; current comment lists empty. FRO-241 is only a historical source for the supplied print templates, not the current invoice specification.

Production named branch main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`, checked via authenticated gh. Source implementation is evidence, not permission to replace agreed requirements. Deployment equivalence unverified.

## Terms and ownership

| Term / fact | Owner |
| --- | --- |
| Order = purchase order = stock list item | Supplier Invoice links its actual Order; no implicit reassignment |
| Υ.Δ. invoice | Type Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.); zero VAT still qualifies |
| Export | Explicit invoice membership, MRN, Delivered vessel, Customs confirmations and protocol |
| VAT exemption status | Invoice-owned: Not started → In progress → Exempted; other invoice types Not required |
| Dispatch / return / onward-sending date | Invoice-owned physical date, distinct from actor/recording timestamp |
| Print selection / each stamping selection | Temporary independent selections; neither changes Export membership |
| Protocol | Allocated on first successful saved Υ.Δ. inclusion; retained/reused, never allocated by printing |

## Preparation

Use isolated fixtures and an authorized staff actor with Export edit authority. For printing, an active Export with saved selected Υ.Δ. invoices suffices at any Customs stage. For stamping, require the active Export's positive IE599/Completed status and an active qualifying invoice with explicit membership. View-only staff and partners must not gain write or document access.

Use synthetic companies, suppliers, invoice identifiers/amounts and protocol values. Keep Shipment Invoice, live fiscal/email integrations and production portal/database writes outside the audit.

## Normal flow

| Step | Operator action | Expected result |
| --- | --- | --- |
| 1 | Open saved Export → VAT Exemption Protocol | Saved protocol and required procedure appear when Υ.Δ. is selected. No Υ.Δ. means Not required; an earlier protocol remains visible but printing is unavailable. |
| 2 | Print ΥΔ; select saved Υ.Δ. invoices and one of three supplied templates | Explicit selection is independent from membership and stamping. Validate at least one eligible invoice and a template. |
| 3 | Generate ΥΔ; open each PDF | Group by Invoicing company + Supplier within this Export, at most five invoices per document. Render current saved values and correct protocol/template. Preserve existing blank/fixed form fields. Generation/printing changes no status, membership, dates or protocol. Regeneration is allowed. |
| 4 | Once positive IE599 is recorded, choose Record dispatch for stamping | From invoice Details or Export Ready for stamping. Confirm date on/after invoice date and no later than Athens today. Selected eligible invoices become In progress with date, Export association and actor/time audit. |
| 5 | Choose Record stamped papers returned (invoice UI also labels the entry action Mark as Exempted) | Confirm date on/after dispatch and no later than today. Same eligible Export; selected eligible invoices become Exempted with return date/audit. |
| 6 | Choose Record paperwork sent to recipient | Only after return and while sending date is blank. Confirm date on/after return and no later than today. Record date/audit; retain Exempted and both stamping dates. |
| 7 | Review invoice Details and Export tables | Both show the same persisted invoice facts/history. Refresh counts/stage lists after actual outcomes; no new Export stamping status or sending date. |

Templates: Αερολιμένας Ελ. Βενιζέλος, Α΄ Τελωνείο Πειραιά, Γ΄ Τελωνείο Πειραιά. Printing is allowed before Customs completion; stamping is not. Positive IE599 must exist when submitting, but its confirmation date is not automatically a lower bound for the physical dispatch date.

## Variations and protection

- Individual action: bind the confirmation to the invoice and reviewed state; enforce current version/eligibility. Conflicting edits cannot bypass the event checks.
- Bulk action: one date over an explicit selection; validate each invoice's own minimum date and stage. Return actual per-invoice recorded/already-recorded/rejected results. Rejected and unselected invoices remain unchanged; do not present partial application as total success or total failure.
- Same-event/same-date replay returns the existing result without another audit event. Different-date repetition is not ordinary correction. No skip from Not started to Exempted; recorded dates cannot be overwritten/cleared.
- A failed confirmation preserves selection/date. Unknown response is not proof of failure; retain original intent and reconcile before treating a changed action as a retry.
- Background refresh, tab/language changes and delayed responses must not change the intended invoices/template/date or erase newer work. Selections that cease to be eligible are pruned visibly.
- Adding a qualifying invoice to a Completed Export uses its own current stage; no inherited exemption from the Export.
- Uploading stamped papers is optional and confirms no event. Sending records the office's paperwork event, not an automated email or verified delivery.
- Protocol remains stable through print/regeneration/events; preserve Customs status, membership, linked Orders and physical Shipment participation.
- No ordinary correction or cancellation bypasses recorded Export/stamping protections. Existing FRO-379/385 own their reviewed editor/cancellation/Customs defects; new paperwork findings require an explicit overlap assessment.

## Consumer trace

| Consumer / source | Required outcome / owner |
| --- | --- |
| Client Export Details page, print dialog, stamping cards/dialog | FRO-352: independent selection, truthful outcomes, preserved input, eligible actions |
| Client Supplier Invoice Details and supplier-invoice-export.tsx | FRO-348/321: same invoice events, guarded next action, recovery and canonical refresh |
| ExportYdService and ExportYdPdfService; templates/export-yd.html | FRO-317: eligible selected grouping, existing form filling and read-only generation |
| ExportStampingService; SupplierInvoiceRepository | FRO-317/321: shared single/bulk guards, locking, version checks, replay and atomic event/activity |
| GraphQL/REST/MCP adapters and ExportAuthorizationService | Same staff/authority/record rules across entry points |
| freight_supplier_invoice event/status/Export fields and activity | One canonical history; chronology and qualifying type/status constraints |
| Export protocol/membership and reverse readers | Preserve protocol, scope, Customs and physical relationships |

Backend source prefix: frontline-forwarding-app/src/main/java/com/frontline/forwarding/; frontend prefix: frontline-forwarding-client/src/features/. Domain implementation under domain/exports; PDF service under web/exports/service. Source workflow: docs/workflows/export-customs-declaration.md; generated database/API references verify field/operation names.

## Review method and evidence boundary

Trace expected behavior before observations. Run relevant existing tests and focused isolated reproductions with controlled requests/response timing. Distinguish source-supported risk, isolated demonstration and deployed observation. Java 25/Spring/PostgreSQL and a full authenticated browser journey are not assumed available; report actual coverage.

[Scenarios](../scenarios/vat-exemption-paperwork.md) define the reusable test set. Full portal scenarios remain Not run until executed as written. Ticket drafting/grouping follows review of findings; no Linear writes are authorized by this audit alone.

## First review

[9 November 2026 review](../runs/2026-11-09-vat-exemption-paperwork.md): nine findings across printing, refreshed selections, reviewed versions, pending date input, recovery and stale response display. Shared manifestations are consolidated; they are not nine proposed tickets. 154 frontend observations/controls and 40 isolated backend controls passed; observation assertions demonstrate current defects. No full browser/database/PDF-generation pass is claimed. The combined Recorded/already-recorded UI count remains a clarification, not a confirmed defect.
