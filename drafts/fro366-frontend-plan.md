# FRO-366 Shipment Invoice Details & draft editing — Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task by task after plan agreement and the separate implementation-model checkpoint. Work remains uncommitted at detached HEAD until the complete audited frontend diff is approved under planning AGENTS.md step 4e. Planning records are committed/pushed separately.

**Goal:** Build the approved Details/edit UI as reusable portal React components, including review, finalization, cancellation and replacement interactions, with verified fixture behavior and explicit integration boundaries.

**Architecture:** An unmounted Details feature receives authorized record presentation, source/evaluation results and asynchronous action callbacks from a host. TanStack Form owns editable document fields. Reuse FRO-363 presentation components and identity-selection utilities; use a separate controller for saved records and replacement preparation so ordinary creation defaults cannot reset saved values. Production persistence, review validity, allocation, totals, numbering and authorization remain backend-owned.

**Tech Stack:** React 19, TypeScript, TanStack Form, portal UI primitives, semantic theme tokens, Vitest/Testing Library and local Playwright verification. Real alias is `#/`.

**Spec:** [FRO-366](https://linear.app/front-line-ltd/issue/FRO-366/shipment-invoice-details-and-draft-editing-ui), [approved description](fro244-details-edit-ui.md), [spec trace](fro244-details-edit-spec-check.md), [component map](../previews/shipment-invoice-details/component-map.md), [approved HTML](../previews/shipment-invoice-details/index.html).

## Global constraints and provenance

- Production repository: Frontline-Forwarding/frontline-forwarding; verified remote `github`. Base is `main`, SHA `5774931b9869247f0247013111a452552403f456`.
- Detached checkout: `C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b135-c052-7083-9f9f-7973a67b9301/fro366-frontend`. Never change the source pilot checkout or FRO-363 worktree.
- Saved FRO-366 playbook: committed, SHA-256 `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`. Planning checkpoint accepted; implementation checkpoint pending. Resume with PYTHONIOENCODING=utf-8; do not rerun start.
- FRO-363 dependency commit: `230a90581aa85e611737add554b2b3c6f5912e0e`, published at `mock/fro-363-shipment-invoice-create`. Its 14 feature files are absent from main. Record their exact source separately from FRO-366 changes; do not switch base or cherry-pick a commit without approval.
- Reuse preparation: bring the 14 FRO-363 feature files into the detached working tree from the pinned commit, without staging/committing. This keeps the existing create tests/controller available for regression checks and imports each component once at its existing path. Record hashes before any shared-file extension. The full proposed diff against main includes these dependency files and must expose that fact at final approval. Prefer integrating FRO-363 before FRO-366; after main advances, refresh and remove dependency-only additions from the final diff.
- All delivery paths must be within `frontline-forwarding-client/`. No backend, database, API/schema, generated GraphQL, authority, dependency, route-tree, deployment or CI changes. Do not mount a production route or implement a fake production service.
- FRO-244/FRO-301 backend contracts remain absent. Presentation interfaces below are not backend schemas. Host-supplied action availability is not authorization. No local calculations of money, allocation, frozen snapshots or printed numbers.
- EN/EL, dd-mm-yyyy, Europe/Athens replacement date supplied by host; preserve saved dates and text. Units come from source, including PC/SET/PKT. Currency choices come from host reference data.
- No glossary/ADR change is needed: domain vocabulary and business decisions are already approved. Update feature-owned README as each slice evolves.
- Proposed eventual branch: `mock/fro-366-shipment-invoice-details`. Do not create it before audited-diff approval. Ruleset inspection returns HTTP 403; publication is blocked until enforcement or an explicitly scoped exception is resolved. FRO-363 exceptions do not apply.

## Component reuse and file ownership

All paths below are relative to `frontline-forwarding-client/src/features/shipment-invoices/` unless stated otherwise.

| Existing file/export from FRO-363 | FRO-366 use / change |
| --- | --- |
| `components/shipment-invoice-document-fields.tsx`: InvoiceSection, ShipmentInvoiceDocumentFields, ShipmentInvoicePackingFields | Reuse edit controls with loaded values. Add optional compatibility-preserving props for preserving an unavailable saved reference and for separating Notes into its own section. Ordinary create behavior/layout stays default. |
| `components/shipment-invoice-goods.tsx`: ShipmentInvoiceGoods | Reuse selection mode. Add optional read-only mode that displays only selected supplied rows, with no selection/allocation/refresh controls; existing create-mode behavior remains default. |
| `components/shipment-invoice-confirmations.tsx` | Reuse existing Shipper/dirty-discard confirmations. Lifecycle dialogs live separately; do not overload create-specific Shipment reset. |
| `create/selection.ts`, `selection.test.ts` | Reuse toggleOrder, toggleRow and reconcileSelection; identity/order operations only. Preserve tests. |
| `create/types.ts`, `labels.ts`, `use-draft-guards.ts` | Reuse draft values, source presentation, labels and beforeunload hook. Do not add persistence semantics to create types. |
| `components/shipment-invoice-create-form.tsx` and tests | Retain unchanged as ordinary-create regression coverage. Do not mount this controller for saved editing or replacement. |

New files:

- `details/types.ts`: typed UI record/read states, review presentation, operation results and host callbacks.
- `details/labels.ts`: Details-specific EN/EL action, lifecycle, review and failure text.
- `details/use-invoice-editor.ts`: TanStack Form, selection, dirty state, generation guards and navigation handling.
- `components/shipment-invoice-details.tsx`: feature coordinator, header, permitted actions, read/edit/replacement modes.
- `components/shipment-invoice-readonly.tsx`: saved/frozen document fields, metadata and totals using InvoiceSection.
- `components/shipment-invoice-review.tsx`: host-supplied differences, removals and review acknowledgement.
- `components/shipment-invoice-lifecycle-dialog.tsx`: finalization summary, discard and cancellation-reason dialogs.
- `components/shipment-invoice-details.test.tsx`: retained consequential workflow tests.
- `details/__fixtures__/shipment-invoice-details.ts`: isolated deterministic presentation/async-callback fixtures.
- `details/README.md`: dependency provenance, component map, callbacks, fixture setup and activation requirements.

Portal primitives: Card/Header/Title/Body, Input/Textarea/FormField, Select, DatePicker, Checkbox, Table, Alert, Badge, Modal, Button. Existing app shell stays host-owned. Reuse feature locale access through `useLocale`; do not duplicate global navigation or authorization enums.

## Presentation interfaces

Define these in `details/types.ts`; precise property names below are frontend-only. Use existing `ShipmentInvoiceDraftValues`, `Selection`, `ShipmentPresentation` and `SelectionEvaluation` rather than duplicate them.

- `InvoiceViewState`: discriminated read state `loading | error | forbidden | missing | ready`; ready carries `InvoiceRecordView`.
- `InvoiceRecordView`: `id`, `revision` (opaque string supplied by host), `lifecycle` (presentation enum Draft/Finalized/Cancelled), `printedNumber: string | null`, `shipmentLabel`, `values`, `selection`, `orders`, `totalDisplay`, formatted creation/update labels, permitted `actions`, optional cancellation reason and original/replacement references. Finalized/cancelled `orders` and totals are frozen host data, never refreshed from draft sources.
- `InvoiceReviewView`: opaque `revision`, `required`, host-localized changed-value/removal items, `canConfirm`, and `confirmedRevision: string | null`. Any local relevant edit clears the pending confirmation; only a matching subsequent host result can restore it.
- `InvoiceEditorInput`: `values`, `selection`, `expectedRevision`, `reviewRevision: string | null`. Exclude computed totals, role/actor claims and printed number.
- `InvoiceActionResult`: discriminated `success` (current record or created identity), `validation` (field/general messages), `conflict` (latest state or missing), `failure` (known non-success message), `uncertain` (read-only reconciliation required). Use this result envelope only at the UI host boundary, without declaring it to be the production response schema.
- `ShipmentInvoiceDetailsProps`: `state`, `currencies`, `todayAthens`, `onReload(): Promise<InvoiceViewState>`, `onRefreshGoods(id, revision): Promise<{ shipment: ShipmentPresentation; review: InvoiceReviewView }>`, `onEvaluateDraft(input: InvoiceEditorInput): Promise<{ evaluation: SelectionEvaluation; review: InvoiceReviewView; validationMessages: string[] }>`, `onSave(id, input): Promise<InvoiceActionResult>`, `onFinalize(id, revision, reviewRevision): Promise<InvoiceActionResult>`, `onDiscard(id, revision): Promise<InvoiceActionResult>`, `onCancelInvoice(id, revision, reason): Promise<InvoiceActionResult>`, `onPrepareReplacement(id): Promise<{ values; selection; shipment; review }>`, `onCreateReplacement(originalId, input): Promise<InvoiceActionResult>`, `onReconcile(): Promise<InvoiceViewState>`, `onOpenInvoice(id): void`, `onOpenShipment(id): void`, optional `onOpenAllocation(orderId): void`, and existing `registerNavigationGuard` signature.
- Callback identifiers/value/selection types use the types above; all asynchronous draft work is keyed to record identity and request generation. Missing callbacks produce visible unavailable actions rather than fabricated behavior.
- Replacement preparation is read-only. The host supplies current eligible rows and prefill; UI enforces locked Shipment, todayAthens date and review visibility. Create replacement is the only persistence callback. After success retain its identity for navigation retry without resubmission.

## Review focus

1. An old refresh/evaluation arriving after record change must not overwrite the current draft (slice 2 deferred-promise test).
2. A source or packing change after acknowledgement must block finalization until the matching state is reviewed and saved (slice 2 tests).
3. A rejected, uncertain or double-clicked lifecycle action must not imply success or trigger duplicate requests (slice 3 callback-count tests).
4. Saved party text and now-unavailable company references must remain visible on open/reload; creation defaults must not replace them (slice 1/2 tests).
5. Another user's finalization/removal while locally editing must disable writes but preserve local text for copying (slice 3 conflict tests).

## Slice 1 — Shared presentation and saved Details

- [ ] Verify fresh `github/main` and pinned FRO-363 commit; inventory the 14 imported feature files with hashes and record reused-only versus modified paths. Do not import commits or change HEAD.
- [ ] Install using the client Dockerfile's `pnpm@11.1.3 install --frozen-lockfile` and Node 22.13.0 standard; record actual runtime. Run `npx @tanstack/intent@latest list` after install and load matching installed guidance. The preinstall discovery returned no enabled packages. No documented Base/Version/Sync command was found; use repository dependency preparation, never invent one.
- [ ] Run baseline create tests and required app checks before changing reused code; capture pre-existing failures separately. A failure is not automatically waived by FRO-363's prior exception.
- [ ] Write a failing behavior test: ready finalized record displays host `totalDisplay`, printed number and saved party text; changed draft-source fixtures do not alter them; edit/refresh controls are absent. Run it before implementation; missing imports/tooling do not count as behavioral Red.
- [ ] Add the interfaces/labels/read-only feature and compatibility-preserving goods read mode. Render loading/error/forbidden/missing/empty and available navigation. Preserve original/replacement references and N/A update labels.
- [ ] Add tests for saved text/date retention, unavailable saved company display, source unit, and unchanged ordinary-create behavior after shared extensions. Render Notes separately for Details without changing default create placement.
- [ ] Update details/README.md with exact dependency provenance, read-data boundary and component map. Run focused create/details tests, feature formatting and `git diff --check`. Review complete slice diff; retain uncommitted.

**Deliverable:** Read-only Details for saved draft/finalized/cancelled records, using real components and explicit empty/error/access states; no operational route.

## Slice 2 — Draft editing, refresh and review

- [ ] Write failing tests: opening edit preserves saved values/selection/order and exposes no Shipment picker; Cancel editing keep/discard paths retain/reset only unsaved changes; company change respects edited Shipper text and Client change clears incompatible company.
- [ ] Implement `useInvoiceEditor(props: ShipmentInvoiceDetailsProps)` and the edit composition using `useAppForm`, existing document/packing/goods components and identity-selection helpers. Keep reset limited to record change or explicit discard/reload. Use immutable submitted snapshots.
- [ ] Add deferred-result tests: refresh retains entered document fields, removes unavailable rows with explicit review items, leaves new rows unselected; failed refresh retains input but blocks save; out-of-order evaluations cannot show old totals/currency state. Implement generation guards and read validity accordingly.
- [ ] Add tests for mixed-currency suppression/save block, incomplete-draft save, source overlap excluding self as supplied by host, unknown-allocation action unavailable without callback, and permitted new-tab callback without a guessed URL.
- [ ] Implement review panel with explicit Confirm reviewed. It records the current opaque reviewed-state revision for the next save; it never declares backend review persisted. Source/selection/packing/weight/partial amount/currency edits clear the pending acknowledgement. Source refresh cannot clear existing pending warnings merely because a later refresh returns no additional removals.
- [ ] Test acknowledgement invalidation and save failure, ensuring finalization is unavailable during edits and until the host returns a saved review-complete record. Test dirty browser Back, linked navigation, Cancel and beforeunload; block navigation during pending saves. Reuse existing router guard signature.
- [ ] Update README, run focused tests and shared-create regression tests, inspect diff and retain uncommitted.

**Deliverable:** Saved-draft editing with explicit save/cancel, safe refresh and visible review; all persistence/evaluation remains callback-driven.

## Slice 3 — Lifecycle and replacement orchestration

- [ ] Add failing tests for Finalize confirmation containing Shipment/Client/company/goods/total; missing required host validation and review errors; confirmation cancellation sends no command; repeated clicks send one request.
- [ ] Implement lifecycle dialogs and action controller. Only permitted saved-draft actions are exposed. Successful finalization adopts the returned frozen record/number; failures retain state. Cancellation requires nonblank reason and permitted manager/admin capability, retaining original frozen data after the host confirms.
- [ ] Add draft-discard tests: distinct from Cancel editing, confirms invoice/Shipment identity, navigates only after success and preserves the draft on failure.
- [ ] Implement replacement mode in the Details feature, not the ordinary create controller. Call read-only prepare; show original link and locked Shipment; preserve copied manual fields, todayAthens and still-eligible ordered selection. Show invalid-reference/unavailable-row and manual-value checks. Cancel creates nothing; explicit Create draft calls the replacement callback once. Success links and opens the returned identity; navigation failure retries navigation only.
- [ ] Test copied fields, current (not frozen) row values, new candidates unselected, required review, no printed number on draft creation, unchanged original, and both correction-link directions.
- [ ] Add conflict and uncertain-result tests for edit/finalize/discard/cancel/replacement. Preserve local inputs for copying, disable writes, and require explicit discard/reload. A newer frozen/missing record cannot be edited. Unknown outcomes require reconciliation before another action; never auto-retry the mutation.
- [ ] Record activation blockers in README: FRO-244 lifecycle, optimistic conflict/review semantics and retry contracts; FRO-301 eligibility; real allocation and Details navigation; host capabilities. No new backend authorities, APIs, number sequence or source allocation code.
- [ ] Run focused tests and create regression tests; review full slice diff and keep uncommitted.

**Deliverable:** Verified UI action flows over controlled fixtures, with explicit missing-integration states rather than a simulated production backend.

## Slice 4 — Browser verification and audited handoff

- [ ] Mount the feature and FRO-363 create flow in a temporary local Vite review host with existing ThemeProvider/LabelsProvider, compact density and theme.css. Create `onSaved(id)` demonstration must show the matching Details record. Keep host and screenshots outside the proposed production diff; no real requests.
- [ ] Verify EN/EL at 1440px and approximately 400px: saved/read/edit, default/loading/empty/error/denied/missing, mixed currency, overlaps, source review, save failure, stale version, finalization, cancellation and replacement. Check keyboard/focus/return, no clipped long Greek actions, no page overflow, no console errors or unhandled requests.
- [ ] Assert consequential journeys: dirty exits, pending action request count, stale responses, confirmation cancel, reason validation, conflict input retention, frozen values, replacement identity and navigation retry. Inspect screenshots against approved HTML; fixtures are not proof of backend correctness.
- [ ] Run `npm run test`, `npm run build`, `npm run format:check`, `pnpm exec tsc --noEmit`, focused feature formatting and `git diff --check`. No lint script exists. Compare failures with the captured baseline; report material blockers, do not silently waive or fix unrelated files.
- [ ] No GraphQL documents/schema change is planned, so no generated contracts need regeneration. If scope would require these, stop and identify the separate integration work. Validate README relative links and fixture/import separation.
- [ ] Fetch main again. If it advanced, reconcile approved dependencies and rerun affected setup/checks. Audit every changed and untracked file against main and separately against pinned FRO-363 file contents. Exclude standalone HTML, session files, secrets, dependencies, build output and temporary host.
- [ ] Save full patch, file/provenance summary, test logs, screenshots and backend blockers under planning `drafts/fro366-frontend-*`; update MEMORY.md and synchronize planning repo.
- [ ] Present the exact eligible diff, base, proposed branch and explicit same-name push command, verification and ruleset evidence. Branch creation/commit/push requires separate approval. Publication remains blocked if required checks/enforcement cannot be verified. No PR or deployment in this plan.

## Completion and checkpoints

Planning checkpoint is complete. Obtain agreement on this plan and a separate explicit continuation after the implementation-model reminder. Recommended execution is native in this chat because the shared component changes and lifecycle controller are tightly coupled. No implementation has begun, no dependencies have been installed and no application tests have been claimed as passing.

For handoff, report reused files, new behavior, tests, documentation, unverified integration and publication limitations. Main-based preparation and FRO-363 reuse do not authorize changing its published branch or its Linear ticket. FRO-366 remains Backlog/Pending_Review until an authorized workflow transition is applicable; do not mark it Done from mock verification.

## Execution record — 2026-11-06

User approved this plan and the implementation checkpoint. All four preparation slices are complete; see [verified handoff](fro366-frontend-handoff.md), full patch and evidence. Frontend source remains uncommitted pending the separate actual-diff/publication gates.
