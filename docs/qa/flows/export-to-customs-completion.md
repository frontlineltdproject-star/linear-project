# FLOW-EX — Export creation to Customs completion

**Purpose:** declare the correct Shipment's paperwork under one stable Export, then record EAD receipt and positive IE599 without changing physical cargo or invoice VAT-exemption events.

**Scope:** creation/grouping, eligible Supplier Invoice selection, draft and result recovery, saved details, membership, documents, permitted cancellation and the two Customs transitions. Detailed Υ.Δ. printing and dispatch/return/onward stamping are the next review. Protocol allocation and preserving invoice VAT status remain boundaries here.

**Status:** expected flow mapped on 9 November 2026, before defect investigation, from current FRO-317/350/352 (Done), with FRO-321/319 relationship rules. Source baseline: production `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed build not verified. FRO-368 (list/search/menu) and FRO-370 (Entry links) are Backlog and excluded from delivered expectations. Older ticket implementation notes describing an absent feature are historical.

**Vocabulary:** Order = purchase order = stock-list item. Export is a Customs declaration linked to one Shipment and an invoicing group. It is neither a physical shipment nor a Supplier Invoice. Invoice company determines grouping; Client does not. EAD receipt and positive IE599 are separate recorded Customs events. Customs Completed is not VAT exemption completed.

## Preparation

Use synthetic records and authorized Front Line staff. Include Greek Invoice-company groups, foreign Invoice-company + Greek Supplier groups, participating Orders with direct-parent invoice suggestions, and paperwork-only invoices. Include a cancelled Shipment, missing fiscal identities, already-assigned invoices and shared Customs Storage Entry cases. Keep IDs and reviewed versions in evidence. External partner access, including files and related links, must be denied.

The current entry point is `/secured/exports/new` (optional Shipment selection), and saved details use `/secured/exports/{id}`. A missing top-bar Export list is tracked separately by FRO-368. Full mutation scenarios require an authorized isolated environment; this review does not write to the production portal/database.

## Normal journey — EX-001

| Step | Office action | Expected outcome | Owner |
| --- | --- | --- | --- |
| 1 | Open Export creation and choose a Shipment. | Search does not select by itself. Every non-cancelled Shipment status/purpose is allowed. Loading/error are explicit; creation stays unavailable until preparation succeeds. | FRO-317/350 |
| 2 | Review and select an eligible invoicing group. | Greek: Shipment + Invoice company. Foreign: additionally Greek Supplier. Exactly one eligible candidate may auto-select; multiple require choice. Existing active Export offers Open, blocked candidates explain why. Saved fiscal identity is a snapshot. | FRO-317/350 |
| 3 | Review suggested invoices and explicitly select the declaration's paperwork. | Suggestions come from participating Orders and their direct-parent chain, deduplicated by invoice ID with provenance. Selection never changes Shipment collis. Paperwork-only invoices are permitted. Greek group needs at least one invoice; foreign group needs participating physical collis and can have no invoices. | FRO-317/350 |
| 4 | Enter MRN, MRN date and optional delivered vessel. | MRN trims/uppercases to 18 alphanumeric characters and stays unique even after cancellation. MRN date is no later than Athens today. Vessel starts blank, may be any existing vessel and never synchronizes with other entities. | FRO-317/350 |
| 5 | Choose initial Customs status and optionally stage files. | Default Awaiting EAD; Awaiting IE599 requires an EAD-received date and explicit confirmation. Completed cannot be initial. Files remain local until confirmed creation. Switching back to Awaiting EAD clears the unused EAD date. | FRO-317/350 |
| 6 | Create once and resolve the response. | Authority, current eligibility, uniqueness, dates and grouping are rechecked atomically. Concurrent same-group create returns the existing Export. A created result retains its ID. Known rejection preserves the draft; unknown outcome reconciles the original attempt before another Create. Initial IE599 records creation + EAD atomically. | FRO-317/350 |
| 7 | Upload staged files and open the saved Export. | Only confirmed new Export owns the files. Partial upload failure retains pending bytes and successful results; retry uploads without recreating the Export. Existing-group result preserves the draft. Departure protects remaining local work. | FRO-350 |
| 8 | Review saved Details, Invoice membership and Documents. | Identity/group/Shipment remain immutable. Connected Orders come from actually selected invoices, not all physical Orders or sibling Orders. Saved reads and tabs write nothing. | FRO-317/352 |
| 9 | Correct allowed facts or membership before EAD. | Separate card saves use the version reviewed when editing. Failed/conflicted saves retain the draft. MRN/date/vessel editable only Awaiting EAD. Membership can add/remove, retaining Greek minimum; eligible additions remain allowed later but saved rows cannot be removed. | FRO-317/352 |
| 10 | Record EAD receipt. | Review dialog, date and current version; MRN date ≤ EAD date ≤ Athens today. Details/invoice editors must be closed. Success moves to Awaiting IE599 with actor/time/date and locks relevant edits. Failure preserves the dialog/date; dismissal writes nothing. | FRO-317/352 |
| 11 | Record positive IE599. | Requires recorded EAD; EAD date ≤ IE599 date ≤ Athens today. Success becomes Customs Completed once, with history. No skipped, duplicate, reversed or stale transition; no automatic invoice VAT event. | FRO-317/352 |

## Side paths and invariants

- Changing Shipment/group after editing invoice selection asks Replace/Keep. Only scope and invoice selection change; MRN/date/vessel/status/staged documents survive. Late responses may not replace a newer or cancelled draft.
- Invoice selection rechecks active status, no other active Export, matching Invoice company and foreign Supplier, and allowed type. Greek groups accept Υ.Δ. or Customs Storage; foreign groups accept Customs Storage or Greek Supplier–Foreign Recipient (MRN). Historical foreign-Supplier–Greek-recipient type is ineligible.
- A Customs Storage Entry's matching invoices are the active Customs Storage invoices of its **owning Order** and must share one Export. A covered child inherits access to the original Entry, not membership of its own invoices in that Entry's invoice set. Never aggregate family invoices. Several Entries may share an Export. Export links never reassign an invoice to a different Order or change physical movement (FRO-319, Split coverage and Derived fields).
- First successful selection containing Υ.Δ. allocates one global ascending protocol. No allocation on preview/failure. Removing the last Υ.Δ. retains the protocol, later re-addition reuses it. Detailed printing/stamping is outside this pass.
- Active Export files can be added at every Customs stage; removal only Awaiting EAD. Cancellation retains saved files/history. Files do not confirm Customs events. Allowed types: PDF/JPG/JPEG/PNG/WebP/GIF/DOC/DOCX/XLS/XLSX/CSV/TXT, nonempty, filename 1–255, ≤25 MB per FRO-350; implementation units must be checked at the limit.
- Only eligible managers/sysadmins cancel, only Awaiting EAD with no recorded Customs event, after confirming a 1–1000 character reason. Recheck reviewed version. Release active group/invoice locks, retain ID/MRN/protocol/fiscal snapshot/files/audit. Cancelled records remain readable and ordinarily immutable.
- Active Exports protect parent Shipment cancellation and incompatible invoice/Order changes. No partial state/activity/protocol changes on failure. Repeated writes/recovery cannot silently duplicate events or apply a different payload.
- Navigation, tab changes, language changes, delayed responses, retries, current permissions and concurrent writers are part of the flow, not optional visual polish.

## Sources

- [FRO-317 — entity and business rules](https://linear.app/front-line-ltd/issue/FRO-317)
- [FRO-350 — creation](https://linear.app/front-line-ltd/issue/FRO-350)
- [FRO-352 — saved Details](https://linear.app/front-line-ltd/issue/FRO-352)
- [FRO-321 — Supplier Invoice relationships](https://linear.app/front-line-ltd/issue/FRO-321)
- [FRO-319 — Customs Storage Entry coverage](https://linear.app/front-line-ltd/issue/FRO-319)
- [FRO-368 — pending list/menu](https://linear.app/front-line-ltd/issue/FRO-368), [FRO-370 — pending Entry links](https://linear.app/front-line-ltd/issue/FRO-370)
- [Pinned implementation workflow](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/export-customs-declaration.md)
- [Scenario catalogue](../scenarios/export-to-customs-completion.md)
- [Review findings and evidence](../runs/2026-11-09-export-to-customs-completion.md)

These are acceptance expectations, not claims that a complete portal run passed. Investigation evidence and unresolved conflicts are recorded separately.
