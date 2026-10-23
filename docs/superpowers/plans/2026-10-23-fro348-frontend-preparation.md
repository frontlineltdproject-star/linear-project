# FRO-348 frontend presentation preparation — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native execution, or superpowers:subagent-driven-development if the user chooses delegation. Steps use checkbox syntax for tracking. Production changes remain branchless and uncommitted until the user reviews the verified diff.

**Goal:** Prepare the approved A Details presentation using actual production components, with controlled interaction surfaces and a complete verified diff, while exposing the contracts still needed for a working invoice page.

**Architecture:** Add unconnected, controlled React presentation components under `src/features/supplier-invoices`. An eventual authorized route/controller supplies saved display values, labelled edit controls, eligibility, lookup results and operation outcomes. These components render that state and forward UI callbacks; they do not calculate fiscal rules, invent API contracts or persist records. Keep editable values in the calling controller, outside unmounted tab panels.

**Tech stack:** Existing React 19, TypeScript, TanStack Start/Router, Vitest/Testing Library, Tailwind and production primitives. Node 22.13.0. No dependency changes.

**Spec:** [Approved complete FRO-348 description](../../../drafts/fro348-details-page-review.md), saved to [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348/supplier-invoice-details-page-ui). [Selected A design](https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site). The ticket governs behavior; live components/theme govern styling.

## Provenance and current checkpoint

- Repository: `Frontline-Forwarding/frontline-forwarding`; verified remote `github=https://github.com/Frontline-Forwarding/frontline-forwarding.git`.
- Base: documented default `main`, fetched at `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.
- Isolated checkout: `C:/Users/Giorgos/.codex/visualizations/2026/10/23/01a1683e-7796-7b71-a01e-27e0158a7080/fro348-frontend`; clean detached HEAD, no local branch, no source changes.
- Playbook snapshot: FRO-348; policy state `committed`; SHA-256 `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`. Continue with `python -X utf8 -B .ai/load_guidelines.py resume --issue FRO-348`. The initial Windows output-encoding failure was reported and recovered by resuming the existing snapshot with UTF-8.
- User authorized isolated preparation and verification, with the actual diff and dependencies shown before production branch creation, commits or pushes. Design A and full ticket are approved. Planning-model checkpoint explicitly completed; plan agreement/execution selection and the separate implementation-model checkpoint remain pending.
- Current FRO-348 read: updated `2026-10-23T11:23:44.164Z`, Todo, unchanged complete labels/metadata. Current comments are empty. FRO-321, FRO-356 and FRO-347 refreshed. Shared Linear field-notes endpoint returned tool-not-found; use repository facts and approved issues.

## Global constraints

- Selected **A — Comfortable cards**; real `#/` imports, not an assumed `@ui` alias. Theme and component code take precedence over prototype CSS.
- White heading card; independent Cancelled identification; Overview, Related Export, Documents tabs; Order relationship, Invoice details, VAT exemption cards; separate record-management area.
- “One card editor at a time.” “Keep card drafts outside conditionally mounted panels.”
- Four-column facts; 28px column/18px row gaps; two columns at widths ≤1100px, one at ≤700px; 20px padding and 16px narrow padding. VAT status maximum 400px desktop; three equal event-date columns then two/one at the same breakpoints.
- EN/EL copy, long labels wrap; semantic colour/type tokens, standard controls. No review annotations or prototype switchers in deliverable components.
- “Page load, tabs, language, read-only refresh, links, downloads, opening/cancelling dialogs and unsaved draft changes issue no invoice/source mutations.”
- No backend/domain computations, schema, authority, generated API, routes, global navigation, dependency, infrastructure or deployment changes. No production data/API writes.
- Preserve existing Order invoice rows and all existing features. No Order/Shipment attachment-owner substitution, automatic lineage mapping, type conversion or invented values.
- No production branch/commit/push/PR/Linear change. Planning records are separate from the eventual production diff; preserve unrelated planning work.

## Deliverable boundary and dependency order

This is a proposed **partial presentation preparation**, not completion of FRO-348. Obtain agreement to this boundary before implementation. A component harness can verify rendering, controlled callbacks and retention; it cannot prove entity validation, authorization, persistence or unknown-attempt reconciliation.

| Area | Current evidence | Required integration / owner | Preparation outcome |
| --- | --- | --- | --- |
| Invoice identity/read/update/cancel/events/audit | No Supplier Invoice entity/API in generated database/GraphQL references; no invoice authority in client `features/auth/types.ts` | Delivered FRO-321 contract and staff-only record/action scope | Supplied display/action states only; no production route or service |
| Atomic Order correction and exact amounts | Current PO invoice rows are separate; PO GraphQL amount uses Float | FRO-321 preconditions, exact decimal wire values, atomic correction and duplicate/conflict behavior | External field slots preserve text; no numeric coercion, invoice DTO or fiscal validator |
| Explicit regime and source selection | Current PO types/API do not expose FRO-356 regime; existing PO selection does not establish invoice-specific scope/search | FRO-356 plus FRO-321-authorized selection/reference contracts; reuse agreed FRO-347 patterns when delivered | No derived type/VAT, vessel/Order search service or unavailable-type picker implementation |
| Retry, draft and navigation controller | No invoice operation/attempt contract or invoice route | FRO-321 attempt reconciliation/preconditions; FRO-348 TanStack Form and route controller | Retained caller-owned slots and explicit outcome presentation; full draft/navigation/unload mechanism deferred |
| Invoice-owned files | `AttachmentReferenceType` accepts only purchase-orders/shipments; current AttachmentPanel includes uploads/removal and their authorities | FRO-321 invoice owner/list/download authorization and metadata | Saved-file presentation only; supplied downloads; no AttachmentPanel owner substitution |
| Export | No delivered Export invoice-membership read/event contract at baseline | FRO-317/FRO-321; FRO-352 shared consumers; later milestone 0.0.10 | Explicit supplied unavailable/loading/error/denied/conflict/absent/ready states |
| Entry Note | No delivered admission-aware direct/inherited invoice lookup | FRO-319; later milestone 0.0.11 | Same distinct lookup states and supplied provenance; no inferred lineage relation |
| FRO-347 Create presentation | Seven-file presentation committed locally, not in main | Independently delivered Create/controller work | Follow approved terminology; do not cherry-pick or depend on its unmerged branch |

Publication remains blocked until meaningful working integration and required checks are supported. Required repository write restrictions must also be verified before any future push; other tickets' exceptions do not transfer. This plan makes no current enforcement claim.

## Component mapping and files

All paths in this section are relative to `frontline-forwarding-client/`. These mappings are the proposed confirmation for selected A before implementation.

| Selected surface | Existing source / planned composition |
| --- | --- |
| App frame | Existing `src/components/layout/app-shell.tsx`, unchanged; no new navigation entry |
| White heading | `Card` from `src/components/ui/card.tsx`, `TopBar` from `src/components/layout/top-bar.tsx`, cancellation `Badge` from `src/components/ui/badge.tsx` |
| Shared tabs | `Tabs`, `TabList`, `Tab`, `TabPanel` from `src/components/ui/tabs.tsx`; local keyboard-navigation wrapper because current Tab only handles click; no global primitive edit |
| Saved facts / card editors | Existing Card, Button; new feature-local saved-value grid composition, semantic `dl/dt/dd`; caller supplies actual `FormField`/Input/DatePicker/Combobox/Select or TanStack Form controls |
| VAT status/progress/dates | Card, StatusPill and semantic tokens; new labelled, noninteractive three-stage composition rather than numeric percentage or clickable steps |
| Record management / confirmation | Card, Button, Alert and `Modal` from `src/components/ui/modal.tsx`; new feature-local confirmation composition; preserve focus trap/restore and add accessible dialog name locally |
| Unknown/rejected/stale feedback | `Alert` from `src/components/ui/alert.tsx`, Button; new feature-local outcome presentation with original-attempt check callback |
| Lookup states | `Spinner`/`EmptyState` from `src/components/ui/feedback.tsx`, Alert, Button; new feature-local relationship composition |
| Saved documents | Mirror filename/size/uploader/time/download presentation from `features/attachments/components/attachment-panel.tsx`, using real Button/Card/feedback; no uploader, removal or ownership logic |

Create only these feature-local files under `src/features/supplier-invoices/`:

1. `components/supplier-invoice-detail-layout.tsx` — heading, tabs, saved/edit card grids, editor controls.
2. `components/supplier-invoice-vat-summary.tsx` — supplied saved status/progress/date presentation.
3. `components/supplier-invoice-confirmation.tsx` — supplied cancellation/event confirmation and outcome UI.
4. `components/supplier-invoice-relationship.tsx` — discriminated lookup-state presentation.
5. `components/supplier-invoice-saved-documents.tsx` — read-only supplied file metadata/actions.
6. `components/supplier-invoice-detail-ui.test.tsx` — consequential rendering/interaction regressions.
7. `localization/supplier-invoice-detail-labels.ts` — typed EN/EL copy via existing locale provider.
8. `localization/supplier-invoice-detail-labels.test.ts` — complete locale keys and required distinctions.
9. `README.md` — component mapping, external controller obligations, missing contracts and evidence limits.

Keep presentation props with their owning component; no domain `types.ts`, API enum, persistence hook or service. No production fixtures. Temporary fixture harness and screenshots live outside this checkout, in the task's visualization workspace.

## Review focus

1. Hidden panels unmount: caller-owned text, including leading zeros and maximum exact-money strings, survives tab/locale switching without implying a durable draft service (Task 1).
2. Unknown or stale outcomes: supplied saved facts remain separate, mutation callbacks are unavailable until the controller resolves the original attempt; check action never invokes Confirm (Tasks 1–2).
3. Ineligible/view-only/cancelled records: omitted authoritative capabilities must not become enabled actions, including after rerender (Tasks 1–2).
4. Missing versus inaccessible relationships/files: unavailable, error, denied and conflict must never render confirmed absence, zero count or a stale authorized link (Task 3).
5. Long Greek text and nested keyboard interactions: controls stay reachable at 400px; focus restores after dismissal; tabs work by keyboard; supplied calendar/dropdown Escape must not close the outer dialog (Tasks 1–2/browser checks).

## Task 1 — Comfortable saved cards and controlled editor surfaces

**Files:** layout, VAT summary, labels, locale tests and detail-ui tests listed above; begin README.

**Interfaces:** Export `SupplierInvoiceDetailLayout(props)` and `SupplierInvoiceVatSummary(props)`.

- Layout consumes `identity: string` (already formatted immutable ID), `cancelled: boolean`, `documentCount: number | null` (null means unknown), `tab: 'overview' | 'export' | 'documents'`, `onTabChange(tab): void`, and ReactNode slots `entryNote`, `vat`, `recordManagement`, `relatedExport`, `documents`.
- Fields are a complete record keyed by `stockId`, `client`, `invoiceCompany`, `supplier`, `invoiceNumber`, `invoiceDate`, `expirationDate`, `currency`, `invoiceType`, `invoiceVessel`, `netValue`, `vatValue`. Each is `{ saved: ReactNode; editor?: ReactNode }`; field labels come from typed locale copy. Editor slots must provide labelled actual controls; saved values use read-only semantics, no disabled fake inputs.
- Editor presentation consumes `activeCard: 'order' | 'invoice' | null`, `canEditOrder: boolean`, `canEditInvoice: boolean`, `busy: boolean`, `unresolved: boolean`, `feedback?: ReactNode`; callbacks `onBeginEdit(card): void`, `onCancelEdit(): void`, `onSaveEdit(): void`. No save callback on tab/language/cancel. Cancelled, busy, unresolved and competing-editor states gate mutation controls. The caller owns the single draft and server outcome; callbacks do not signal success.
- VAT summary consumes supplied `stage: 'not-started' | 'in-progress' | 'exempted' | 'not-required' | 'historical'`, `savedStatus: string`, three `ReactNode` saved dates, and optional current-stage/onward action nodes. These are presentation discriminants, not inferred backend enums. Historical preserves supplied wording without conversion; non-Υ.Δ. shows only Not required. It never derives status from VAT, dates or draft type.

- [ ] After the separate implementation checkpoint, verify Node 22.13.0, run the client Intent skill check and load only relevant framework guidance. Inspect manifest/lock before dependency preparation; try documented `npm ci` and report any mismatch rather than changing dependencies. No documented custom Base Branch/Version/Sync command exists in the inspected instructions; use documented npm preparation, with GraphQL codegen only if source documents change (none planned).
- [ ] Record baseline `npm run test`, `npm run build`, `npm run format:check`, and `npx tsc --noEmit`. Separate inherited failures from new failures; follow the worktree skill's baseline-failure gate before proceeding. No backend processes.
- [ ] Write retained behavior assertions before implementation: supplied text `00042` and `99999999999999999.99` survives Overview → Documents → Overview and EN → EL; no Save callback; one editor blocks the competing edit; busy/unresolved/cancelled state prevents mutation callbacks; supplied saved VAT never changes with a draft slot. Assert tab ArrowLeft/Right/Home/End selection and focus. Locale test asserts matching nonempty keys and distinct unavailable/absent/cancellation wording.
- [ ] Run `npm run test -- src/features/supplier-invoices/components/supplier-invoice-detail-ui.test.tsx src/features/supplier-invoices/localization/supplier-invoice-detail-labels.test.ts`. Establish behavioral failures with a minimal renderable component boundary, not missing imports/tooling as Red.
- [ ] Implement the interfaces and selected field/card order using mapped components/tokens. Wrap long button labels locally; keep input labels/accessibility with supplied controls. Use a local wrapper to complete tab keyboard behavior without editing the shared primitive. Keep the heading free of VAT status/edit/create actions. Render Documents count only when known.
- [ ] Run focused tests to Green; update README with controller/draft and authoritative capability responsibilities. Keep changes uncommitted.

**Acceptance:** controlled card/tab layout and saved VAT presentation match A; local interactions forward only the intended callbacks. This task does not deliver form validation, selection, atomic save or authorization.

## Task 2 — Confirmation, cancellation and uncertain-result presentation

**Files:** confirmation; extend labels, UI tests and README from Task 1.

**Interfaces:** Export `SupplierInvoiceConfirmation(props)` with `open: boolean`, `kind: 'cancel' | 'dispatch' | 'return' | 'send'`, `identity: string`, `body: ReactNode`, `fields?: ReactNode`, `eligible: boolean`, `disabledReason?: ReactNode`, `outcome: 'idle' | 'pending' | 'rejected' | 'stale' | 'unknown'`, `feedback?: ReactNode`, `onClose(): void`, `onConfirm(): void`, optional `onCheckAttempt(): void`. Parent supplies validated date controls and retained values; this component neither creates payloads nor decides fiscal eligibility. Cancellation copy states identity/number reservation/values/files/history retention; event copy preserves the difference between physical event and recorded outcome.

- [ ] Before implementation, assert Cancel/Escape/opening never calls Confirm; ineligible/pending/stale/unknown prevents Confirm; unknown exposes only original-attempt check when supplied and Check never confirms; rejected retains supplied field text and saved context. Confirm on idle/eligible calls once per click; pending rerender blocks further calls. This is UI gating, not server idempotency.
- [ ] Run the focused UI test file and establish behavioral Red, then compose actual Modal/Button/Alert. Give the modal an accessible name locally (shared Modal does not expose an aria-labelledby prop). Do not edit global modal/focus primitives.
- [ ] Preserve parent-controlled values through dismissal/rerender; show rejected, stale and unknown distinctly. Do not close or show success merely because Confirm was invoked. Parent supplies actual confirmed saved state.
- [ ] Verify focus containment/restoration in browser; ensure supplied dropdown/calendar Escape consumes its event before outer dismissal. If the current Modal cannot support the nested case within this local composition, surface the specific primitive gap and stop that behavior rather than changing shared controls without agreement.
- [ ] Run focused tests to Green and document unimplemented cancellation/event validation, attempt reconciliation, audit, server preconditions and route navigation/unload protections. Keep uncommitted.

**Acceptance:** supplied confirmation states are accessible and do not misrepresent success or permit conflicting resubmission; this is not working cancellation/event integration.

## Task 3 — Relationship and saved-document states, final evidence

**Files:** relationship, saved-documents; extend labels, tests, README.

**Interfaces:**

- Export `SupplierInvoiceRelationship(props)` with `kind: 'entry-note' | 'export'` and discriminated state `{ status: 'unavailable' | 'loading' | 'denied' | 'conflict' | 'absent' } | { status: 'error'; onRetry?: () => void } | { status: 'ready'; content: ReactNode }`. Only ready carries authorized links/metadata. No relationship derivation or fetching. Parent supplies Entry Note provenance and source-owned Export facts in content.
- Export `SupplierInvoiceSavedDocuments(props)` with state `{ status: 'loading' | 'denied' | 'unavailable' } | { status: 'error'; onRetry?: () => void } | { status: 'ready'; documents: Array<{ key: string; filename: string; metadata: ReactNode; onDownload?: () => void; downloading?: boolean }> }`. Keys are opaque caller-owned identifiers. Only ready with an empty array is a confirmed empty collection; use supplied saved-file count at layout level. Do not conflate missing download capability with an empty list.

- [ ] Write behavior tests before implementation: all lookup states differ; denied/conflict/unavailable contain no previous ready links or confirmed-absence message; error Retry fires only its callback; ready file rows show only supplied metadata and Download; no chooser/Remove; loading/error/denied never displays a fabricated empty count/list. Download callback identifies only its row and is blocked while that row is busy.
- [ ] Run focused tests to Red, implement with mapped primitives, run to Green. Keep source values and scope external; do not reuse AttachmentPanel service/owner/authority logic.
- [ ] Create a temporary local fixture harness outside the production diff to render actual components, EN/EL and all supplied states. No invoice route or production fixture fallback. Use sanitized examples only. Run browser checks at desktop 1440px, 1100px and 400px: field/date order, long labels/values, no overflow, tab focus, draft-text retention, view-only/cancelled states, confirmation cancel/error/unknown, lookup retry and document actions. Check console/network for fixture failures and retain screenshots plus results in planning evidence. No live API submission.
- [ ] Run full frontend tests, production build, full formatting check and typecheck; report baseline-only failures separately and fix new failures. Run explicit Prettier checks for changed files and `git diff --check`; include untracked files in the audit. No API documents change, so no codegen/reference generator is applicable; record that based on the final diff.
- [ ] Fetch `github/main` again. If it advanced, refresh detached base safely, reread changed guidance/contracts, rerun affected checks and audit before handoff. Re-read FRO-348 for conflicting requirements without modifying it.
- [ ] Export a complete patch containing the nine intended files (including untracked content) to `drafts/fro348-frontend-preparation.patch`, with SHA-256 and base. Write `drafts/fro348-frontend-handoff.md` containing every file, exact commands/results, screenshots, acceptance coverage and dependency gaps. Verify patch applicability against the recorded base and reverse applicability against prepared contents without staging/committing production changes.
- [ ] Review the whole diff for path/content compliance, secrets, invented wire/domain behavior, misplaced fixtures and unintended changes. Obtain a fresh independent review after the chosen execution method where available; verify each finding before correction. Show the actual final diff and limitations before requesting any production branch/commit approval. No push approval is requested while integration/check/enforcement prerequisites fail.

**Acceptance:** meaningful controlled presentation and browser evidence, complete uncommitted diff and explicit blocked integration; no claim that all FRO-348 criteria are delivered.

## Acceptance coverage and deferred work

| Ticket criteria | Prepared here | Still required for complete FRO-348 |
| --- | --- | --- |
| 1–2 | Supplied identity/cancelled/saved fields; A grids/tabs/locales | Staff-scoped retrieval, route/error/cache boundary, real authorized navigation |
| 3–4 | Controlled one-editor surface, retained external slots, immutable saved presentation | TanStack Form/controller, source search, type tooltip extension, exact fiscal validation, atomic correction/duplicate/stale enforcement |
| 5 | Distinct supplied relationship states and ready content | Admission-aware lookup, explicit membership, query scoping/invalidation/stale-result protection |
| 6–7 | Saved progression/dates and controlled confirmations | Actual event eligibility/chronology/Athens checks, server operations/audit, individual/bulk synchronization |
| 8 | Supplied cancellation guard/confirmation/result presentation | Authoritative cancellation eligibility, concurrent guards, retained entity/files/history |
| 9 | Supplied saved-file rows/download callbacks | Invoice-owned list/download contract and staff authorization |
| 10 | Caller-owned slot retention; outcome distinctions and check callback | Full invoice draft/controller, navigation/unload warnings, original-attempt recovery and old/new Order invalidation |
| 11–12 | Explicit unavailable states; existing code unchanged | Working basic integration and server privacy/preservation verification; later integrations remain staged |

These deferred items remain FRO-348/FRO-321 and linked-ticket obligations; no ticket requirement is removed. No glossary/ADR change is needed for presentation-only preparation. README owns component integration guidance; the planning handoff owns temporary evidence. Any future working integration requires a fresh contract audit and plan update before implementation.

## Self-review and execution handoff

- Scope is deliberately presentation-only and reviewable; each integration gap has an owner and a retained acceptance obligation above.
- Task 1 owns layout/editor retention, Task 2 owns confirmation/outcome callbacks, Task 3 owns unavailable-versus-absent distinctions and final validation. The five review-focus risks have explicit tests/scenarios.
- Props are colocated UI interfaces, not guessed API contracts; all required callbacks and slots are named. No fiscal computation or authorization is inferred from fixtures.
- Existing shared primitives remain unchanged; new compositions are explicit. Missing control/controller behavior is deferred, not represented by nonfunctional production actions.
- Recommend **native execution**: three closely related tasks share controlled props and locale copy. A fresh final review can check the complete diff. Subagent-driven execution remains an alternative if the user chooses it.
- Next gate: user reviews this plan, agrees the partial preparation boundary and chooses execution method; then complete the separate implementation-model checkpoint before any product-code change or dependency installation. Production branch creation/commits/pushes remain separately gated after the verified diff.
