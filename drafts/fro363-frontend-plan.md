# FRO-363 Shipment Invoice create UI mock — implementation plan

> Execution: use superpowers:executing-plans task by task after plan agreement and the separate implementation-model checkpoint. Preparation stays uncommitted at detached HEAD under planning AGENTS.md step 4e; review the complete diff before branch creation/commit/push.

**Goal:** Prepare approved layout A as reusable portal React UI with verified interactions and a clear boundary for future FRO-244/FRO-301 integration.

**Architecture:** An unmounted feature form receives explicit presentation data and async callbacks from its host. TanStack Form owns entered fields; components own UI selection and confirmation state. No production route, API, authorization, persistence, allocation or monetary computation is introduced. Isolated fixtures exercise the form through a temporary local review host, never an operational route.

**Tech stack:** React 19, TypeScript, TanStack Form, existing portal components and theme, Vitest/Testing Library, local Playwright. Existing import alias is #/ (not @ui).

**Spec:** [Approved ticket](https://linear.app/front-line-ltd/issue/FRO-363/shipment-invoice-create-page-ui), [local approved description](fro244-create-page-ui.md), [component map](../previews/shipment-invoice-create/component-map.md), and layout A in the attached HTML. B is not implemented.

## Baseline and boundaries

- Repository Frontline-Forwarding/frontline-forwarding; github remote verified. Base main at 5774931b9869247f0247013111a452552403f456.
- Detached worktree: C:/Users/Giorgos/.codex/visualizations/2026/11/06/01a1b0de-d032-7e31-a043-531adf58aa3a/fro363-frontend.
- Loaded committed playbook fingerprint b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Planning checkpoint accepted 2026-11-06; implementation checkpoint pending.
- Eligible changes only under frontline-forwarding-client/. No dependency, backend, API document, generated contract, authority, route-tree, deployment or infrastructure changes. No production navigation activation or fake service.
- No new domain vocabulary or ADR is needed. The existing child-Order model remains; FRO-362 is deferred and FRO-302 unchanged.
- FRO-244's Shipment Invoice operations and FRO-301's allocation contract are absent on main. UI props below are presentation interfaces, not proposed backend schemas. Integrating these and the future Details/allocation routes is a later activation step.
- Proposed eventual branch: mock/fro-363-shipment-invoice-create. Not created. Publication remains blocked because ruleset inspection returned HTTP 403; the required identity/branch enforcement is unverified. Never change repository permissions to bypass this.
- The production worktree must stay uncommitted until the explicit audited-diff gate. Planning repository records are separately committed/pushed under its AGENTS.md.

## Review focus

1. Delayed results after changing Shipment must not restore old rows or overwrite fields (slice 2 deferred-promise test).
2. Failed refresh must retain the user's work and block submission until eligibility is known again (slice 2 retry test).
3. Editing Shipper followed by Client/company changes must not silently overwrite it (slice 2 keep/replace tests).
4. Long Greek text and dense rows must remain usable at 400px, including modal actions and focus return (slice 3 browser checks).
5. Repeated submit, failed submit and navigation during pending work must not create misleading success or lose edits (slice 2 callback-count/error tests; slice 3 browser check).

## Component mapping confirmed for A

All paths below are relative to frontline-forwarding-client/src.

| UI | Reused source | Composition |
| --- | --- | --- |
| Portal shell | components/layout/app-shell.tsx, side-bar.tsx, top-bar.tsx | Existing host owns frame; do not duplicate or modify navigation. |
| Stacked sections | components/ui/card.tsx | Card, CardHeader, CardTitle, CardBody; semantic theme spacing. |
| Form | components/form/index.ts, text-field.tsx, select-field.tsx, date-field.tsx | useAppForm, TextField, SelectField, DateField. Multiline inputs use ui/input.tsx Textarea/FormField. |
| Shipment selection | components/ui/combobox.tsx and ui/input.tsx | New feature composition: externally controlled search input and returned options. Combobox alone only filters loaded options, so never claim it searches all remote Shipments. |
| Goods selection | components/ui/choice.tsx, table.tsx | New Order-group composition using Checkbox tri-state and Table/THead/TBody/TR/TH/TD. Retain all seven Order context fields. |
| Notices/states | components/ui/alert.tsx, feedback.tsx, badge.tsx | Existing semantic tones and readable labels. |
| Guard dialogs | components/ui/modal.tsx, button.tsx | Modal with explicit choices; focus returns to trigger. |
| Total/actions | components/form/form-actions.tsx, ui/button.tsx | New composition displaying supplied total state; no sum or allocation algorithm. |
| Localization | app/providers/labels-provider.tsx useLocale | Feature-local EN/EL labels using the established locale. |

## Setup before implementation

- [ ] Fetch github main and confirm the recorded base; if advanced, inspect differences before changing the base.
- [ ] Confirm Node 22.13.0 availability (project standard) and use pnpm 11.1.3 install --frozen-lockfile as in client/Dockerfile. Do not rewrite either lockfile. Report unavailable standard runtime explicitly.
- [ ] No documented Base/Version/Sync command exists in inspected guidance; do not invent one. No GraphQL codegen is needed because no GraphQL sources change.
- [ ] TanStack Intent discovery ran successfully but found no packages before dependency installation. Rerun after install and load matching Form guidance before implementing the form.
- [ ] Run baseline npm run test, npm run build, npm run format:check, and pnpm exec tsc --noEmit. There is no lint script. Record pre-existing failures separately; do not silently fix unrelated files.

## Slice 1 — render the approved create page with real components

Files to create under frontline-forwarding-client/src/features/shipment-invoices/:
- create/types.ts — UI-only types and callback boundary.
- create/labels.ts — typed EN/EL labels and labelsFor(locale).
- create/defaults.ts — defaults only, including injected Athens calendar date.
- components/shipment-invoice-create-form.tsx — exported form, no route mounting.
- components/shipment-invoice-document-fields.tsx — document, party, packing and notes fields.
- components/shipment-invoice-shipment-picker.tsx — loaded candidates, search, loading/error/empty states.
- components/shipment-invoice-create-form.test.tsx — consequential form tests, extended in slice 2.
- create/README.md — purpose, component map, mock boundary and activation checklist.

Interfaces:
- ShipmentInvoiceDraftValues: shipmentId, clientId, companyId, invoiceType, documentDate (ISO calendar string), subtitle, shipper, consignee, agent, notify, packingDetails, totalWeightKg, partialAmount, partialCurrency, notes; input strings preserve incomplete draft values.
- ShipmentInvoiceSelection: ordered groups of { orderId: string; rowIds: string[] }; source identities remain explicit.
- ShipmentInvoiceCreateForm(props: ShipmentInvoiceCreateFormProps): ReactElement. Props carry initialShipmentId, todayAthens, candidate/read state, selected-Shipment presentation data, currency options, permission/availability state, onSearchShipments(query), onLoadShipment(id), onEvaluateSelection(shipmentId, selection), onSubmit(values, selection), onSaved(id), onCancel(), onOpenAllocation(orderId).
- Async load/evaluate responses carry presentation-ready row eligibility/reasons, ordered rows, total display/currency conflict, overlap references and removed-row information. No invented API operation or server authority name. Every response is tied to the current request/Shipment before application.
- createDraftDefaults(todayAthens: string): ShipmentInvoiceDraftValues. Caller supplies the Athens date; review host computes it via Intl with timeZone Europe/Athens. Do not use UTC slicing to choose the calendar day.

Steps and acceptance:
- [ ] Write/run a failing behavior test for standalone empty Shipment, preselected Shipment, default fields, and submitting incomplete document fields through an available callback. Compilation/dependency errors do not count as behavioral Red.
- [ ] Implement the form skeleton and fields with useAppForm and mapped components. Accept only current non-cancelled candidate availability; do not filter out arrived/departed candidates.
- [ ] Display all parent-required fields; printed number is explanatory only. Client changes clear incompatible company while preserving typed party text. Company options do not filter goods.
- [ ] Add/read states and display a clear unavailable-integration message when callbacks/permissions are unavailable. No invented save success, Details page, or allocation route.
- [ ] Verify EN/EL field parity, focusable controls, baseline-compatible types, and focused tests. Update README alongside the slice; leave changes uncommitted for review.

## Slice 2 — selection, refresh and loss-prevention interactions

Additional files under the same feature:
- components/shipment-invoice-goods.tsx — eligible and unresolved groups, context and selection.
- components/shipment-invoice-confirmations.tsx — company replacement, Shipment change, discard dialogs.
- create/selection.ts — ordered selection transforms only; no goods value/allocation computation.
- create/selection.test.ts — identity, ordering and eligibility reconciliation.
- create/use-draft-guards.ts — dirty/beforeunload handling and request-generation guards.

Interfaces:
- toggleOrder(selection, orderId, eligibleRowIds): ShipmentInvoiceSelection. Most recent explicit Order selection moves its group first; preserve supplied row order.
- toggleRow(selection, orderId, rowId, sourceRowIds): ShipmentInvoiceSelection. Retain source identity and prevent duplicate inclusion.
- reconcileSelection(selection, eligibleRowsByOrder): { selection: ShipmentInvoiceSelection; removed: Array<{orderId: string; rowId: string}> }. Remove unavailable identities, leave new rows unselected, do not re-sort existing group order.
- Selection evaluation is an async callback owned by the host. The component displays returned totals/conflict/overlap state and blocks save while evaluation is pending or failed. It does not calculate partial quantities, amounts, rounding or exchange rates.

Steps and acceptance:
- [ ] Add/run meaningful failing tests for whole Order selection, individual removal, newest group first, unresolved exclusion and duplicate source identities.
- [ ] Implement ordered selection and mapped goods table. Show Stock List ID, Client, Supplier, MSG Number, Country of Origin, Destination and Status. Optional HS codes remain strings, preserving leading zeroes.
- [ ] Test/implement refresh preservation, newly eligible rows unselected, removed-row notice and updated evaluation display. Test out-of-order responses and failed-refresh retry.
- [ ] Test/implement mixed-currency conflict blocking without deselection, plus overlap warning that permits saving. Consume test-provided evaluation results rather than duplicating backend logic.
- [ ] Test/implement untouched Shipper replacement and edited-text keep/replace choices; confirmed Shipment reset versus cancel preserving every field and selection.
- [ ] Test/implement dirty cancel and beforeunload protection, single pending submission, failed submission preserving inputs, returned-identity success callback, and unavailable callbacks without fabricated navigation.
- [ ] Run focused tests and type checks, update README behavior notes, review all changes uncommitted. No backend or source row mutations.

## Slice 3 — local visual verification and complete handoff

Files:
- create/__fixtures__/shipment-invoice-create.ts — sanitized presentation fixtures for tests/review only; excluded from operational imports.
- create/README.md — final local-review instructions, dependencies and exact validation evidence.
- Temporary Vite/Playwright review host outside the production diff, removed from intended handoff after checking. It mounts the real form with existing locale/theme providers and injected fixture callbacks. No production route or generated route-tree change.

Steps and acceptance:
- [ ] Exercise the real components locally in EN/EL at 1440px and 400px with default/loading/empty/error, mixed currency, overlap, stale selection, save pending/failure, and unavailable-access states.
- [ ] Exercise both entry contexts, common/mixed Clients, arrived Shipment, keyboard picker/row selection, every dialog choice, Escape, focus return, dirty exit, new-tab allocation callback and explicit refresh. Verify no unexpected external/backend writes.
- [ ] Compare A against attached screenshots. Check Greek wrapping, document date presentation, total/no-total states, table usability and footer visibility. Keep B out of the React implementation.
- [ ] Run npm run test, npm run build, npm run format:check, pnpm exec tsc --noEmit and git diff --check. Format only task files. Report all failures; unavailable required checks block publication.
- [ ] Refresh main; if advanced, rebase preparation safely only after inspecting the new base and rerun affected checks. Audit every tracked/untracked intended file against the base for path and content compliance.
- [ ] Export complete patch and verification report to planning drafts; ensure neither contains credentials, generated files, dependency output, fixtures disguised as live APIs or unrelated changes.
- [ ] Present complete diff, base SHA, test outcomes, backend/UI dependencies and ruleset blocker. Do not ask to push until required enforcement is established. When eligible, obtain explicit approval for creation/commit/push of mock/fro-363-shipment-invoice-create using the same-name github refspec.

## Coverage and delivery limits

The three slices cover the create-page appearance and frontend interactions. Real authorized lookup, eligibility, values/totals, persistence, Details navigation and allocation navigation remain activation dependencies because their required contracts/routes are unavailable. Read-only fixture inspection and tests do not establish production behavior. No UI status transition or Linear description edit is included in this plan approval.

Self-review: all approved fields, selection rules, safeguards, states, EN/EL, entry contexts and attachment reference are covered. No currency-option invention, new finalization rules, business calculations or production permissions are introduced. Component map is confirmed before implementation. The plan is prepared; implementation and its separate checkpoint are awaiting user agreement.
