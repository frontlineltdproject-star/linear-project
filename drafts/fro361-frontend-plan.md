# FRO-361 Details UI Implementation Plan

> For agentic workers: use superpowers:executing-plans for native execution, or superpowers:subagent-driven-development if the user selects delegation. Track the checkboxes; preserve the approval gates below.

**Goal:** Prepare and locally verify the approved read-only Delivery Note Details UI using actual portal components.

**Architecture:** An unmounted feature composition accepts an existing DeliveryNote plus explicit presentation/access inputs and navigation/PDF callbacks. No route activation, new API, schema, authorization implementation, backend change or fabricated production response. The future integration supplies authorized single-note data, display references and the shared saved-draft state.

**Tech stack:** React 19, TypeScript, existing UI catalogue and LabelsProvider, Vitest/Testing Library, local browser checks.

**Spec:** [Approved description](fro361-details-review.md), live FRO-361 updated 2026-11-06T15:01:57.477Z, existing Direction A / single Details tab attachments.

## Base and checkpoints

- Repository: Frontline-Forwarding/frontline-forwarding; detached main 5774931b9869247f0247013111a452552403f456.
- Checkout: C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b157-f4aa-77b3-ab01-1dc2d0c938d7/fro361-frontend.
- Playbook resumed, committed SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Planning checkpoint accepted. Plan agreement and implementation-model checkpoint accepted; implementation completed locally.
- Prepare all slices uncommitted at detached HEAD. Planning AGENTS.md requires final diff approval before production branch creation/commit/push. Proposed eventual name: mock/fro-361-delivery-note-details; verify no name collision before approval.
- Ruleset verification returned HTTP 403. Publication stays blocked; do not reuse exceptions granted for other tickets.

## Global constraints

- Details only in this preparation. FRO-361's list/navigation/search work remains required for full ticket completion, but is not implemented here.
- Document → Movement → Goods covered, one Details tab; selected note only, stored totals, no recalculation from Shipment contents.
- Preserve all six statuses. Never mount DeliveryNotesCard or invoke creation, update, issuance or cancellation.
- Reuse semantic tokens and existing controls with #/ imports. EN/EL including accessibility text; desktop and approximately 400px.
- UI-only presentation inputs are not new API contracts. Permission inputs cannot substitute for server enforcement.
- No dependency, lockfile, generated API, route-tree or shared-theme changes. No live portal requests during testing.

## Preparation

- [x] Confirm clean detached checkout, remote and base; read nested AGENTS files under affected paths.
- [x] Use Node 22.13.0 standard and documented pnpm 11.1.3 frozen-lockfile installation. An existing dependency directory may be reused only after matching package/lock files. Do not use npm install to repair lockfiles.
- [x] Run npx @tanstack/intent@latest list and load the most specific applicable local skill before substantial implementation. Record missing/unavailable skills explicitly.
- [x] No separate Base/Version/Sync command has been established. Use documented dependency preparation; do not invent a Sync step. GraphQL generation is unnecessary because documents remain unchanged.

## Component map

Paths below are relative to frontline-forwarding-client/src.

| Element | Existing component/source | Treatment |
| -- | -- | -- |
| Existing application frame | components/layout/app-shell.tsx, top-bar.tsx, side-bar.tsx | Host responsibility, no replacement shell or nav activation |
| Breadcrumb | Breadcrumbs, components/ui/navigation.tsx | Callback to host list navigation |
| Heading and secondary identity | Heading/Text, components/ui/typography.tsx | New header composition of existing primitives |
| Status | StatusPill, components/ui/badge.tsx | Reuse current status labels/tone mapping from Shipment card |
| Open Shipment / Preview PDF | Button, components/ui/button.tsx | Existing controls, guarded callbacks |
| Single Details tab | Tabs/TabList/Tab/TabPanel, components/ui/tabs.tsx | Value details; no additional tabs |
| Three sections | Card/CardHeader/CardTitle/CardBody, components/ui/card.tsx | New composition, semantic dl for read-only fields |
| Goods and stored totals | Table/THead/TBody/TR/TH/TD, components/ui/table.tsx | Responsive table within card; no editable values |
| Loading / unavailable | Spinner/EmptyState, components/ui/feedback.tsx | Localized props; no stale document contents |
| Page/PDF errors and draft explanation | Alert, components/ui/alert.tsx | Accessible persistent explanation, not tooltip-only |
| Locale | app/providers/labels-provider.tsx | Add required EN/EL labels, reuse existing status/purpose/date conventions |

No new primitive is planned. Header and read-only field layout are feature compositions. Existing page-error fragments contain hardcoded text and route actions, so use the localized feedback primitives for this unmounted composition.

## File ownership and interfaces

Create under src/features/delivery-notes/:

- types.ts: DeliveryNoteDetailsModel and discriminated DeliveryNoteDetailsState.
- components/delivery-note-details.tsx: page composition and state rendering.
- components/delivery-note-details-sections.tsx: document, movement and goods sections.
- components/delivery-note-details-actions.tsx: guarded actions, async preview state/error.
- components/delivery-note-details.test.tsx and delivery-note-details-actions.test.tsx: consequential behavior tests.
- testing/delivery-note-details-fixtures.ts: synthetic test-only note examples, no production imports of fixtures.
- README.md: component map, host integration contract, activation dependencies, commands and limitations.

Modify src/app/providers/labels-provider.tsx only for missing labels. Reuse DeliveryNote type from features/shipments/services/delivery-note-service.ts and existing enum/labels; do not create a second domain enum.

Model interface: { note: DeliveryNote; shipmentReference: string; invoicingCompanyName: string; hasSavedDraft: boolean; canOpenShipment: boolean }. hasSavedDraft is supplied by host using the same current-note set and saved movement check as Shipment; never derive from only the selected note.

State: { kind: 'loading' | 'unavailable' | 'error' } or { kind: 'ready'; model: DeliveryNoteDetailsModel }. Non-ready states contain no document model.

Page props: { state: DeliveryNoteDetailsState; onBack: () => void; onRetry: () => void; onOpenShipment: (shipmentId: string) => void; onPreviewPdf: (shipmentId: string, noteId: string) => Promise<void> }. Callback arguments use String(note.shipmentId) and String(note.id). Later integration passes DeliveryNoteService.previewPdf; the test harness passes a controlled stub.

## Review focus

1. Switching notes while PDF request is pending: old completion/error must not affect new note; test in slice 2.
2. Selected draft appears complete but sibling movement is unsaved: shared hasSavedDraft=false still blocks PDF; test in slice 2.
3. Missing fiscal number/date or zero totals: no invented number/date; zero remains zero; test in slice 1.
4. Access revoked or missing record after a displayed note: clear its contents and actions; test in slice 1.
5. Long Greek values and raw submission-error text: wrap safely, render as text, no markup execution; test in slice 1 and browser-check in slice 3.

## Slice 1 — Read-only Details composition

- [x] Add focused failing tests: rendersSectionOrder, showsOnlySelectedNoteAndStoredTotals, rendersUnnumberedDraftAndMissingDate, clearsDataWhenUnavailable, rendersSubmissionErrorAsText. Assert a single Details tab and absence of editing/lifecycle controls.
- [x] Run pnpm exec vitest run src/features/delivery-notes/components/delivery-note-details.test.tsx; establish behavioral failure, not tooling failure.
- [x] Implement model/state interfaces and sections with catalogue components. Show number/status independently; MARK only when present; failed-submission error when present; empty goods display does not manufacture rows. Use current locale/date formatting conventions.
- [x] Add EN/EL labels to LabelsProvider, including the exact approved unsaved-draft explanation. Ensure keyboard-readable headings/table and wrapping field values.
- [x] Rerun focused test, inspect initial desktop/mobile rendering; document composition map and host inputs in README. Review slice diff; leave uncommitted.

Acceptance: approved Direction A contents and sequence, accurate per-note fields/totals, one tab, no hidden record content in non-ready states, no mutating hooks.

## Slice 2 — Navigation and PDF interactions

- [x] Add failing tests for all six statuses: DRAFT uses canPreviewDeliveryNotePdf with shared hasSavedDraft and false dirty/saving; SUBMISSION_PENDING omits action; other four statuses permit it. Unsaved draft shows disabled button and exact explanation; Open Shipment remains available when permitted.
- [x] Add tests: doubleClickStartsOnePreview; previewFailureShowsLocalizedErrorAndAllowsRetry; lateCompletionDoesNotChangeNewNote; openShipmentUsesSelectedShipmentId; backUsesHostCallback. Assert disabled/hidden actions never call callbacks.
- [x] Run focused action tests to establish Red.
- [x] Implement action composition using existing canPreviewDeliveryNotePdf helper. Use a synchronous in-flight guard as well as disabled UI. Key/reset request state by note identity and ignore stale completion after identity change/unmount. Do not expose raw backend error text as the generic PDF failure message.
- [x] Wire to page through callbacks only. Test loading/error/unavailable states have no preview action; rendering and retry never trigger auto-preparation.
- [x] Rerun both test files; record exact service handoff and shared saved-state dependency in README. Review diff; leave uncommitted.

Acceptance: selected IDs reach callbacks exactly once; existing PDF status rules preserved; no create/update/issue/cancel requests; no stale error from previous note.

## Slice 3 — Browser verification and developer handoff

- [x] Build a temporary local harness outside the production diff, importing real feature components/providers and controlled fixtures/callbacks. Do not mount fixture routes in production or modify routeTree.gen.ts.
- [x] Exercise EN/EL at desktop 1440px and mobile 400px: saved/unsaved draft, submission pending, issued, failed, cancellation pending, cancelled, loading, unavailable/access denied, load error, PDF pending and PDF error. Include multi-note identity changes, missing optional fields, empty goods, long text and keyboard actions.
- [x] Assert no document overflow/clipping, correct tab/field labels, visible disabled explanation, correct action IDs/counts and no external/live requests. Compare screenshot layout to attached Direction A and approved disabled-draft addition.
- [x] Run pnpm test, pnpm run build, pnpm run format:check, pnpm exec tsc --noEmit and git diff --check. Run scoped formatting checks too. Report pre-existing failures separately; they still block publication unless explicitly accepted for FRO-361.
- [x] Stop harness and verify its port/process no longer writes generated files. Audit tracked and untracked files against base. Keep screenshots/logs in planning evidence, not production source.
- [x] Write planning handoff with exact checks, full patch, changed-file list, base SHA and remaining integration work. Refresh main before final approval; reverify if it moved. No publication until ruleset requirement is resolved and user approves the complete concrete diff.

## Activation dependencies and coverage

FRO-361's backend work must provide an authorized single-note read including cancelled records, Shipment/company display values and enough current-note context to preserve the shared saved-draft check. Authorization must be enforced server-side for reads and PDF access. Do not substitute the existing cancelled-excluding list query.

Later route integration must remove old record data during identity changes, supply locale and error classification, wire Open Shipment under its access rules and pass the existing PDF service. List navigation is a host callback until FRO-361's list work lands.

Ticket checks 3–7 receive fixture-based Details coverage here; list/search portions of 1–2, full backend permission checks and live integration remain explicitly unverified. This mock cannot close FRO-361 or establish production readiness.

Documentation: feature README plus planning evidence. No business/schema/API change means no generated reference updates. No changes to glossary/ADRs are warranted.

## Execution handoff

Recommend native execution in this chat because the three slices share one small feature composition. Obtain plan agreement and the separate implementation-model continuation before writing application code. Independent review may follow the completed implementation within the chosen execution workflow. Production branch/commit/push remains a later explicit gate; planning-repository commits/pushes follow its standing instructions.


Completion evidence: see fro361-frontend-handoff.md. All preparation slices completed; publication and live integration remain blocked as documented. Preview harness was stopped for audit and restarted separately for user review.
