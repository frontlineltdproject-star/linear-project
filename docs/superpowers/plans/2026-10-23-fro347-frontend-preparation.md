# FRO-347 frontend presentation preparation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for the recommended native execution, or superpowers:subagent-driven-development if the user chooses delegation. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Prepare and verify the approved comfortable Create-page presentation with actual production components, and return its complete uncommitted diff plus the integration/publication blockers.

**Architecture:** Prepare unconnected, controlled React presentation components under the new client feature directory. The eventual authorized route/controller will supply labelled field controls, source/validation state, file rows and operation callbacks. This preparation defines UI composition props only: no invented API wire types, authority, domain enums/computations, request, persistence or recovery implementation. Local test/browser fixtures demonstrate presentation and callbacks without shipping a fake working route.

**Tech Stack:** Existing React, TypeScript, TanStack Tabs/form primitives, Tailwind semantic theme, Vitest/Testing Library, production Card/Input/Button/Alert components; existing package manager and lockfile.

**Spec:** [Approved FRO-347 description](../../../drafts/fro347-create-page-review.md), [saved Linear issue](https://linear.app/front-line-ltd/issue/FRO-347), [selected private preview](https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site).

## Global constraints

- Authorization: local frontend/UI preparation and dependency checks only. No production branch, commit, push, PR, deployment or Linear mutation is authorized by this plan.
- Planning checkpoint completed explicitly on 23 October 2026. Plan agreement and the separate implementation-model checkpoint are still required before application edits.
- Production checkout: `C:/Users/Giorgos/.codex/visualizations/2026/10/23/01a16833-e860-7a01-98a1-e7bbe7859984/fro347-frontend`, clean detached HEAD, remote `github=https://github.com/Frontline-Forwarding/frontline-forwarding.git`.
- Base: `github/main`, SHA `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. Proposed future branch, not created: `mock/fro-347-supplier-invoice-create`.
- Policy snapshot: FRO-347; committed; SHA-256 `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`. Resume this snapshot; do not start a replacement.
- Every delivered production path stays inside `frontline-forwarding-client/`. No backend, generated contract, authority, dependency, lockfile, CI or deployment changes.
- Selected A: comfortable density, 20px title, 12px sentence-case labels, 40px controls, 8px control/12px card corners, 28px column/18px row gaps, two columns at ≤1100px and one at ≤700px; narrow card padding 16px.
- Overview / Documents; stacked Order relationship → Supplier invoice details → VAT exemption. Fixed initial status is supplied for display; no progress/event-date inputs. No business-rule computation in this frontend-only diff.
- Use real `#/` imports. No `@ui` alias is defined. Compose existing primitives; do not hand-roll alternative controls. Any future integrated non-trivial form must use `useAppForm` from `#/components/form`.
- Keep all fixture entry points, synthetic data, local preview server/config and screenshots outside the production diff. Tests may contain isolated fixtures.
- Publication remains blocked while required API/permission/ownership contracts or required GitHub branch restrictions are unavailable. Do not ask to publish an incomplete integration as if verified.

## Verified dependencies and current limitations

| Required capability | Current source evidence | Preparation boundary / owner |
| -- | -- | -- |
| Invoice creation/retrieval and original-attempt recovery | No Supplier Invoice entity, route, SDL, REST service or generated contract at the base. Existing billing is fixture data. | FRO-321 supplies real operations and lossless decimal transport. No service stubs or invented endpoints. |
| Staff-only invoice access | Client `src/features/auth/types.ts` has no invoice authority. PO-view is participant-scoped. | FRO-321 supplies authority and scoped source data. No route, authority replacement or usable navigation added. |
| Explicit regime and derived type | No customs-regime field/Entry Note entity; existing PO fields include Greece/ΚΤΑ/ΑΛΚ. | FRO-356 and FRO-321 supply authoritative type/eligibility. Do not infer from existing flags. |
| Supplier/Client Order search | `PurchaseOrderRepository.searchCondition` searches references, vessel and tracking code, not Supplier/Client names. List paginates with size cap 100. | Delivered authorized search must satisfy the approved search semantics; no filtering of only the first page. |
| Currency/vessel options | PO form derives currency choices from countries. `CompanyService.getCompany(id)` exposes authorized company vessels under COMPANY_VIEW. | Available references are useful precedents; invoice access compatibility must be supplied. Do not invent currency lists or bulk-load a first-100 subset. |
| Exact amounts | PO MoneyValue uses GraphQL Float and existing service calls Number(). | Do not reuse those serializers. UI accepts/rendered field nodes retain caller-controlled text. |
| Invoice files | AttachmentReferenceType supports only purchase-orders/shipments; existing panel uploads against a persisted numeric owner and selects PO_EDIT versus SHIPMENT_EDIT. | FRO-321 extends ownership/access. This slice renders staged rows and callbacks only; no fabricated upload or reconciliation. |
| Note integration | No lookup implementation at base. | Externally supplied unavailable/loading/error/denied/absent/reference content; no copied pointer or fake note resolution. |
| Publishing protections | gh rulesets returned HTTP 403, plan upgrade required; identity has maintain/push access. | Required branch-restricted write enforcement is unverified. This blocks publication, not local preparation. No protection changes. |

No documented Base Branch/Version/Sync command was found in root README, client package scripts or docs. Use the documented dependency preparation and conditional GraphQL codegen. This slice changes no GraphQL documents, so codegen is not expected; re-evaluate if scope changes.

TanStack inventory was run with `npx --yes @tanstack/intent@latest list`: no intent-enabled packages found before dependency installation. Re-run after dependency preparation and load the most specific discovered React/Form guidance before application edits. Do not change package declarations to silence the inventory notice.

## Review focus

1. Tab/language rerenders must not own or reset the caller's draft/file bytes; demonstrate controlled parent state and preserve exact amount text.
2. Long Greek labels, invoice types, file names and failure messages must wrap at 400px without hiding actions or changing the semantic field order.
3. Unknown creation must expose only original-attempt checking, never an enabled Create/start-another action or a claimed saved invoice ID.
4. Partial/unknown files must route their supplied callbacks to the same rendered row and saved invoice context; no callback may imply an actual backend operation occurred.
5. No normal application route, auth change or fixture service may make this partial presentation look like a working production feature.

## File map and component mapping

Paths below are relative to `frontline-forwarding-client/`.

| New file | Responsibility / existing primitives |
| -- | -- |
| `src/features/supplier-invoices/components/supplier-invoice-create-layout.tsx` | White heading Card/TopBar; shared Card/Tabs; fixed relationship/invoice grids; read-only VAT section; supplied form actions and messages. |
| `src/features/supplier-invoices/components/supplier-invoice-document-queue.tsx` | Documents Card, Paperclip icon, existing Button and row/pill presentation; controlled chooser/row callbacks. Does not use persisted AttachmentPanel. |
| `src/features/supplier-invoices/components/supplier-invoice-creation-result.tsx` | Card/Alert/Button presentation for supplied unknown or confirmed result and file outcomes; explicit supplied next action. |
| `src/features/supplier-invoices/components/supplier-invoice-create-ui.test.tsx` | Meaningful controlled-draft, tabs, callback, unknown/saved/partial outcome and localization regression coverage. |
| `src/features/supplier-invoices/localization/supplier-invoice-create-labels.ts` | EN/EL feature copy using existing useLocale/LabelsProvider pattern; all built-in text, accessibility labels and headings. No backend enum definitions. |
| `src/features/supplier-invoices/localization/supplier-invoice-create-labels.test.ts` | Required key parity, selected locale and absence of event-entry copy. |
| `src/features/supplier-invoices/README.md` | Implemented presentation, component map, controlled-state responsibilities, unavailable adapters, verification and integration checklist. |

The Order/type/currency/vessel/date/amount controls are supplied slots, not speculative replacements. Actual Input/FormField/DatePicker/Combobox controls appear in controlled tests and the throwaway browser harness. Remote Order search and focusable unavailable-option reason stay explicitly blocked implementation work: the existing Combobox lacks the complete remote-query/tooltip contract. Do not extend a global primitive speculatively in this preparation slice.

## Task 1: Controlled Create-page layout and localized copy

**Files:** create layout, localization and their relevant tests from the file map.

**Interfaces:**
- Export `SupplierInvoiceCreateTab = 'overview' | 'documents'` (UI tab state only).
- Export `SupplierInvoiceCreateSlots` with required ReactNode keys `orderSearch`, `stockId`, `client`, `invoiceCompany`, `supplier`, `entryNote`, `invoiceNumber`, `invoiceDate`, `expirationDate`, `currency`, `invoiceType`, `invoiceVessel`, `netValue`, `vatValue`, `vatStatus`, `documents`, `actions`; optional `feedback` ReactNode. Slots include their accessible labels/control/error associations.
- `SupplierInvoiceCreateLayout({ slots, activeTab, onTabChange, documentCount })`; activeTab and callback use SupplierInvoiceCreateTab, count is a supplied number. It renders no form controller, source derivation or operation.
- `supplierInvoiceCreateLabelsFor(locale: 'en' | 'el')` and `useSupplierInvoiceCreateLabels()` return the same typed copy dictionary selected via existing useLocale.

- [x] Write failing behavior tests: supplied controlled Invoice number and amount `99999999999999999.99` survive Overview→Documents→Overview; selected tab and field order are correct; fixed supplied status has no editable status/date/progress controls; callback fires once; English/Greek strings switch without resetting supplied data. ArrowLeft/Right/Home/End navigation and tab focus are covered locally.
- [x] Run focused Vitest against minimal compiling component shells and confirm failed behavioral assertions. Missing modules, compilation errors and missing installation are not Red.
- [x] Implement with Card/TopBar/Tabs, a local tab keyboard wrapper, semantic spacing and controlled slots. Keep draft state in the test/controller parent above unmounting TabPanels. Set comfortable density within the component wrapper, not globally.
- [x] Run focused tests and changed-file format/type checks. Verify field/card order against the selected design.
- [x] Present the partial slice diff; retain it uncommitted. No branch or commit under this plan without later explicit approval.

## Task 2: Controlled staged-document presentation

**Files:** document queue, corresponding UI tests, localization copy.

**Interfaces:**
- Colocated UI-only `SupplierInvoiceDocumentRow` contains `key: string`, `filename: string`, `metadata: string`, `outcome: 'queued' | 'uploaded' | 'failed' | 'unknown'`, and optional `message: string`. It is not Attachment, an API DTO or an ownership claim.
- `SupplierInvoiceDocumentQueue({ rows, errors, busy, onChoose, onDownload, onRemove, onRetry, onCheck })`; row actions accept the stable row key; chooser accepts selected `File[]`. The caller owns bytes, validation, outcomes and authorization. Render only explicitly supplied applicable actions; no fetch/storage/request here.

- [x] Write failing behavior tests: valid supplied rows remain beside supplied file errors; chooser forwards selected File objects without upload; Download/Remove target the correct key; failed and unknown rows expose different callbacks; busy state blocks appropriate actions. Render long Greek/file/error text.
- [x] Run focused tests against a minimal compiling queue shell to establish missing-behavior assertion failures; module/compilation failures are not Red.
- [x] Compose Card/Button/Alert and the real AttachmentPanel presentation pattern with the paperclip, guidance, empty state, metadata and textual outcome pill. Keep the specified file constraints in copy; do not invent MIME/permission/owner logic.
- [x] Re-run focused tests and check the full Documents tab at desktop/400px, EN/EL. Verify no HTTP create/upload request is introduced.
- [x] Present the partial slice diff; retain it uncommitted.

## Task 3: Controlled creation-result presentation and handoff

**Files:** result component, corresponding UI tests, frontend feature README.

**Interfaces:**
- Discriminated presentation props: unknown result accepts `onCheckAttempt`, `busy`, and pending document display; it has no invoice ID or Create/new-invoice callback. Confirmed result requires `invoiceId: string`, `selectedOrderLabel: string`, optional `originatingOrderLabel: string`, document display and explicit supplied `nextAction` ReactNode. Values are supplied, not derived.
- `SupplierInvoiceCreationResult(props)` renders the correct Card/Alert and callbacks. It does not decide the operation outcome, reset files, resolve attempts or navigate to invented routes.

- [x] Write failing tests: unknown view exposes checking only; confirmed view shows invoice and actual Order labels; differing origin stays distinct; no Create form/action persists; next action is supplied; busy/check callback behavior is correct; failed/unknown file presentation remains available.
- [x] Run focused tests against a minimal compiling result shell to establish failed behavior assertions, implement minimal presentation, then verify tests pass.
- [x] Document the implemented limits and precise missing contracts from the dependency table. Make clear that draft controller, TanStack form validation, file-byte lifetime, dirty/unload guards, source lookup, tooltip composition, submit/attempt/upload recovery, authorization and actual return navigation are still unimplemented. Do not claim FRO-347 acceptance complete.
- [x] Run applicable package checks: `npm run test`, `npm run build`, `npm run format:check`, and local TypeScript `npx tsc --noEmit`. No lint script exists. Establish any baseline failures before changing application files and distinguish pre-existing findings; do not fix unrelated files.
- [x] Render actual components in a temporary browser harness outside the checkout, using sanitized UI fixtures and supplied callbacks. Verify EN/EL at desktop/~400px, default/loading/error feedback, unknown result, confirmed result, partial/unknown rows, tabs and exact-text retention. No real API connection or fixture service in normal app routes. Keep evidence in the planning workspace.
- [x] Audit `git diff --name-status <base>` and complete `git diff <base>` plus every intended untracked file. Verify only the seven frontend files and no generated/manifests/backend/route/authority changes. Run `git diff --check`.
- [x] Refresh github/main. If SHA advanced, review/rebase preparation on the new detached base, rerun affected checks and repeat the diff audit before presenting it.
- [x] Request a fresh code review, resolve valid findings and reverify affected scenarios. Show the complete patch, files, commands/results, screenshots, base SHA, proposed future branch and all unverified/backend/publication blockers. Keep everything uncommitted and branchless pending approval; do not solicit publication while required blockers remain.

## Setup and validation sequence

After plan agreement and explicit implementation-model Continue: resume the existing policy snapshot; verify Node >=22.13 (repository standard 22.13.0), npm and lockfile; run documented dependency preparation with the existing lockfile without dependency changes; re-run Intent inventory and load applicable installed instructions; establish baseline tests/build/type/format results. Application edits begin only after that checkpoint. Do not run backend services or dev-reset scripts.

Implementation checkpoint completed explicitly; the seven-file partial presentation is prepared and verified. See the completion record below for limits and evidence.

## Self-review

- Spec coverage: this plan deliberately covers presentation components only. Domain/integration/navigation/recovery mechanisms remain in the dependency checklist and are not claimed as implemented.
- Exact UI choices and locale/data retention are pinned to Task 1; document row actions to Task 2; unknown/confirmed result distinctions to Task 3.
- Each component is independently testable without fabricating a backend contract. UI-only props stay colocated with their component; no API DTO is inferred from fixtures.
- Documentation stays inside the client; planning evidence stays here. No glossary/ADR change is warranted.
- Recommended execution: native in this session, followed by fresh independent review. The three components share labels/composition and need one coherent final audit; parallel implementation adds little value.


## Execution completion record — 23 October 2026

The user approved native execution and explicitly completed the implementation-model checkpoint. All three presentation tasks are prepared uncommitted in the isolated detached checkout. The complete seven-file patch, 171-test/build evidence, screenshots, independent review, rulings and all remaining integration/publication blockers are recorded in [the frontend handoff](../../../drafts/fro347-frontend-handoff.md). No working route, entity/service/authority, backend operation, production branch, production commit, push or Linear mutation is delivered.

The checklist records the approved partial presentation work and its verification; it does not assert FRO-347 acceptance complete. One minor composed regression-coverage improvement remains deferred: actual File identity at selection and filename retention after tab/locale are tested separately, as are saved result and row callbacks. Browser fixtures corroborate callback presentation, not live owner binding or file persistence. All blocked controller/contract work remains explicit.
