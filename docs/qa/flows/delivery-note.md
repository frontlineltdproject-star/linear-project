# Delivery Note flow — review baseline, 9 November 2026

## Scope and provenance

User authorized mapping current tickets/code first, then defect investigation. This chat owns Delivery Notes only. Shipment state, cargo participation and route are inputs; Export, Customs completion and VAT-exemption paperwork remain with the other chat. Production, database, AADE and email are read-only: no fiscal calls or portal mutations.

Source: authenticated `gh` archive of production `main`, `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. This is not proof of the deployed build. The archive policy loader failed because Git metadata is absent; applicable instructions were read directly, with no successful policy fingerprint claimed.

## Current ticket baseline

Full descriptions fetched on 9 November: FRO-247 Done (core lifecycle), FRO-307 Done (addresses), FRO-361 Todo (standalone read-only list/details), FRO-357 Backlog (Greek Frontline-origin restriction), FRO-308 Backlog (shared-load-unit information), FRO-283 Backlog (cancellation/replacement/history decisions), FRO-284 Backlog (failed-submission recovery decisions), FRO-285 Backlog (Phase B). Status does not certify deployment or implementation.

FRO-284's context is older than current code: ambiguous submission stays SUBMISSION_PENDING, and the issue command can reconcile it without resending. Missing UI recovery and undecided rejected-document recovery must be distinguished.

## Expected flow to check

| Stage | Expected behavior / current boundary | Source |
| --- | --- | --- |
| Access | Internal Frontline/system-admin boundary; separate view/create/issue/cancel authorities. Cancellation additionally checks issuer-company access. | DeliveryNoteAuthorizationService; DeliveryNoteCancellationService |
| Entry/preparation | Shipment detail may prepare automatically after a successful empty read for a creator. Preparation is idempotent per Shipment/invoice company; historical arrivals are refused. Current preparation does not implement FRO-357's origin rule. | delivery-notes-card.tsx; DeliveryNotesApiService.createForShipment |
| Composition | Group participating Orders by invoice company, one line per Order using legacy ID. Count current nonterminal collis; sum their gross weights, null weight contributing zero. A group cannot mix distinct non-null vessel IDs. Copy recipient fiscal details. | DeliveryNoteDraftSourceService; DeliveryNoteDraftPlanner; DeliveryNoteLineFactory |
| Movement details | New loading address copies actual origin; destination starts blank. Choose or type shared movement fields. Destination sources follow participating Clients, not invoice companies. Explicit reusable-location saves persist independently of abandoning note edits. | FRO-307; DeliveryNoteAddressSourcesApiService; delivery-note-address-picker.tsx |
| Save | All current notes must be DRAFT; supply exact current note IDs/versions. Save shared movement data atomically, preserving recipient/lines/totals. Reject stale/invalid saves without partial writes or lost entered values. No fiscal numbering/submission. | FRO-307; DeliveryNotesApiService.updateDraftsForShipment |
| Preview | Selected Shipment/note identity and view permission checked. Draft preview is gated in UI by saved, clean movement details. PDF shows stored note recipient, route, goods and totals. | DeliveryNotePdfService/ModelFactory; delivery-note-form-validation.ts |
| Issue | Explicit per-note confirmation. Validate draft and expected version, allocate issuer/series fiscal number and persist XML with pending status in one transaction. Send that XML once. Acceptance stores MARK/UID/QR. | FRO-247; DeliveryNoteSubmissionLifecycle; DeliveryNoteIssuanceService |
| Submission failure | Explicit rejection retains number/XML in SUBMISSION_FAILED. Ambiguous outcome remains SUBMISSION_PENDING; repeat issue command reconciles transmitted identity, never blindly resubmits. Recovery policy/UX ownership includes FRO-284/285. | DeliveryNoteIssuanceService; docs/workflows/delivery-note.md |
| Cancel/replacement | Authorized ISSUED cancellation locks expected version, calls AADE and stores cancellation MARK. Current failure handling returns ISSUED; confirmed cancellation is followed by preparation of the missing company draft. Cancelled identity remains stored and excluded from current list. Alternative replacement/history policy is open in FRO-283. | DeliveryNoteCancellationService/Lifecycle; delivery-note-service.ts |
| Shipment changes | Inspect only note consequences: atomic draft reconciliation, protected fiscal records, explicit keep/replace decisions for affected saved route values. Do not rerun full Shipment lifecycle audit. | ShipmentDeliveryNoteReconciler; FRO-344 |

## Known boundaries, not new bug claims

- Standalone list/details, load-unit annotations, Greek-origin restrictions and Phase B remain separately owned tickets.
- Cancel-without-replacement/history presentation and rejected-document recovery require decisions already tracked in FRO-283/284.
- No new vocabulary or architecture decision is proposed: Order = purchase order = stock-list item; colli = handling unit; Delivery Note = company-specific goods-movement document.
- Existing presentation contracts are reused. Canvas, hosted preview and production UI branch are not part of this audit. Linear writes require separately reviewed drafts and approval.

## Review checklist

0. Preflight: complete (live GitHub and Linear reads).
1. Fact mapping: complete initial baseline; ask numbered questions only for unresolved business decisions.
2. Canvas / 2b preview: not applicable, existing UI contracts.
3. Consumer tracing and defect checks: initial pass complete; see the run report and scenario ledger for evidence and unexecuted checks.
4. Tickets: not authorized; findings first.
4e. UI branch: outside scope.
5. Memory and 6. evidence verification: recorded with the initial run; full backend/deployed verification remains outstanding.
