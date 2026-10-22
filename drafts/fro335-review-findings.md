# FRO-335 review — 22 October 2026

Review in progress. This is investigation evidence, not an approved replacement description.

## User decisions confirmed after the first review

1. Every pending new colli must be Saved or Cancelled before Create. Validate and focus the pending row; never silently include or discard it. Save remains local to the unsaved Order.
2. Permit removal of every draft colli, including the last one; return to the valid empty state.
3. After successful Order creation with partial upload failure, stay on the saved-result view with the returned Order ID, per-file outcomes and retry controls. Continue to Details is explicit.
4. Keep FRO-335 frontend-only. Lost create/upload responses produce Result unknown, preserve the draft/files and require checking saved records before retrying. No new server idempotency dependency, blind automatic retry or claim of exactly-once persistence.

The questions in the investigation table below are historical findings, resolved by these decisions. The production playbook planning-model checkpoint has now been requested and remains awaiting an explicit Continue. No implementation plan or Site modifications yet.

Further dependency reads confirmed FRO-329/334/295/294/332 own complete retirement and current-form integration. Do not make their earlier releases wait for FRO-335 or independently remove their backend contracts. Add identical must exclude retired PCS/Notes/colli DN rather than retain hidden values.

Live main lacks initial-state creation, Unit price, split Notes, independent Pickup, regime/capability and new handling-flag contracts; Collection agent validation is still active. A functional full target frontend cannot be integrated yet. A real presentation/interaction slice can reuse existing APIs, but must not silently discard target inputs, fabricate contract support or emulate atomic creation via subsequent transitions. Full integration remains dependency-blocked; the fixture-only Site can demonstrate the agreed target.

## Scope and provenance

- User requests missing-information/logic review, production-design-system UI alignment, ChatGPT Sites publication instead of Cloudflare Pages, and subsequent frontend/UI branch work.
- Planning repository pulled successfully. Current target fetched at updatedAt 2026-10-21T11:48:51.896Z: Todo; Order, Pending_Review, Frontend, Story; Pre-releases 0.0.x / 0.0.5; one preview attachment. Comments empty. No Linear mutations.
- Production source: Frontline-Forwarding/frontline-forwarding, main 3820e89e8caa341261e2d48bcb282d93e1bb1d03. Isolated checkout in the session temp directory, detached HEAD, no application edits.
- Playbook start encountered Windows encoding failure. UTF-8 resume successfully loaded the saved snapshot: committed policy, SHA-256 b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc. Planning and implementation model checkpoints remain pending.
- Existing owner-private Site: appgprj_6acca09bd25081918eda0fa6bb3b5936, version 23, source f013e38d5c33371a836599090b94786f3f57cd11. Source retrieved without editing or publication. Preserve its URL and audience.
- Linear shared notes returned tool-not-found; direct issue reads succeeded.

## Findings

| Area | Current evidence | Required outcome / open decision | Owner |
| -- | -- | -- | -- |
| UI styling | Site uses 24px h1, uppercase 10px field labels, 7px controls and custom muted/background colors. Live DESIGN.md/theme.css and Input/Label use 20px page title, sentence-case labels, 8px controls and semantic tokens. | Preserve stacked cards and field grouping while adopting actual component styles; eliminate exact-old-preview-markup authority. | FRO-335 presentation; shared Details coordination with FRO-326 |
| Design annotations | Ticket marks whole cards/tabs as new components and removes visible state/locale tools; AGENTS requires actual new-composition markers and reachable review controls. | Keep review tools/notes separate from the simulated production screen; mark new compositions accurately. Design comparison remains pending. | FRO-335 preview |
| Pickup | Current FRO-333 resolves optional nullable value, initially unset and clearable. Target still calls default/requiredness unresolved. | Explicitly consume Yes/No/unset without coercion; no new decision needed. | FRO-333 contract; FRO-335 presentation |
| Customs | Current FRO-356 requires explicit regime selection without default, even for one supported option; incompatible entered ALK needs explicit removal. | Integrate settled rules and precise cancel/focus behavior; no warehouse-name inference. | FRO-356 contract; FRO-335 presentation |
| Notes/DG/pricing | Current FRO-292 specifies 2,000 characters per note; FRO-297 optional DG class/text with 200-character text limit; FRO-337 exact decimal transport and price/product range. | Consume these contracts explicitly, preserving plain text, blanks and decimal values. No backend expansion in UI branch. | Linked owners; FRO-335 input/feedback |
| Success display | FRO-335 requires step 1/7, 2/7 or 3/7; current FRO-326 supersedes seven-step presentation with compact status. | Navigate to actual returned Order and defer saved Details presentation to FRO-326; remove conflicting step demand in proposed draft. | FRO-335 navigation; FRO-326 Details |
| Pending colli addition | Existing form adds directly to values; target introduces local Save/Cancel but leaves final Create interaction unclear. | Q1 pending: recommend validate/include every visible row, blocking invalid rows; alternative requires local Save/Cancel first. | FRO-335 |
| Last colli removal | Form starts empty, backend accepts empty, but current form disables removal of last row and target preserves guard. | Q2 pending: recommend permit removal of final unsaved row. Saved-record behavior remains outside scope. | FRO-335 |
| Measurements | Backend permits all three dimensions blank or all positive integers. Weight can be absent; supplied weights require positive gross, optional net >=0 and <=gross. | Specify identical local Save/final Create checks with colli-level errors. Do not retain retired PCS input. | Existing backend validation; FRO-335 feedback |
| Parent selections | Client/vessel changes lack reset handlers; invoice eligibility includes client-wide plus selected-vessel assignments. Backend verifies eligibility. | Clear/invalidate incompatible dependent selections, recalculate eligibility, never auto-select an invoice company. | FRO-335 |
| Creation outcome | Route catches mutation and navigation errors together. Backend generates a fresh ID per request; owner reference is not unique; no caller idempotency key. | Distinguish confirmed failure, confirmed creation and uncertain outcome. Disable repeats while pending; no blind Create retry after uncertainty. Server idempotency ownership remains an open choice. | FRO-335 UI; additional backend scope unresolved |
| Documents | Separate existing-Order upload requires EDIT/internal identity; CREATE alone does not authorize upload. Uploads generate fresh object IDs and are not deduplicated. | Preserve saved Order ID, successful/failed/not-attempted results and local failed files. Q3 pending: stay for explicit retry/continue versus navigate and reselect. Ambiguous upload results require reconciliation before repeat. | FRO-335 orchestration; existing attachment service |
| Verification | Target has acceptance checks but no dedicated criterion-specific read-only post-deployment matrix; implementation-source section includes stale preview/process narration. | Prepare standalone final specification with Context for agents, Decisions and concrete read-only checks, keeping revision comparisons in chat. | FRO-335 |

## Production component mapping established so far

Paths below are under frontline-forwarding-client/src. No separately named Catalogue/Screen Parts directory was found; reuse the actual layout, form, UI and feature modules.

| Element | Existing component/source |
| -- | -- |
| Application frame, mobile navigation | components/layout/app-shell.tsx; side-bar.tsx; language-selector.tsx; theme-mode-toggle.tsx |
| Page heading | components/layout/top-bar.tsx (TopBar, text-title) |
| Cards | components/ui/card.tsx (Card, CardHeader, CardTitle, CardBody, CardFooter) |
| Four tabs | components/ui/tabs.tsx (Tabs, TabList, Tab, TabPanel) |
| Labels, inputs, notes/errors | components/ui/input.tsx (FormField, Label, Input, Textarea); components/form wrappers |
| Reference pickers | components/form/select-field.tsx and components/ui/combobox.tsx |
| Short fixed choices | components/ui/select.tsx |
| Readiness date | components/form/date-field.tsx and components/ui/date-picker.tsx; no future-only restriction |
| Confirmations | components/ui/modal.tsx (Modal) |
| Actions | components/ui/button.tsx (Button) |
| Invoice/Colli table primitives | components/ui/table.tsx; custom expandable draft-row composition must be identified as new |
| Existing attachment presentation | features/attachments/components/attachment-panel.tsx; new pre-create staging/result composition |

Read exact component implementations before final mapping/implementation. Preserve accessible labels and focus; wrappers currently have limitations that must not be mistaken for permission to omit accessibility. ThemeProvider currently defaults to comfortable in AppProviders although DESIGN.md recommends compact for internal operations: use actual runtime density for parity unless a change is approved.

## Branch publication constraint

GitHub permissions confirm push=true, maintain=true, admin=false. GET repository rulesets returns HTTP 403: upgrade to GitHub Pro or make repository public to enable feature. Required write-identity/mock-branch restrictions cannot currently be verified. Under planning AGENTS step 4e this blocks publication, not review or local preparation. Do not change repository-wide settings. Show verified UI diff before branch creation/commit/push approval. No PR or merge requested.

## Next steps

1. Receive Q1–Q3 answers; resolve uncertain retry ownership and remaining behavioral questions interactively.
2. Finish dependency reconciliation and approved scope, then production-based canvas alternatives and picked direction.
3. Update and verify the existing private Site, with EN/EL, narrow/desktop and default/loading/empty/error coverage.
4. Show complete standalone ticket draft with full preserved metadata and separate before/after comparison; await exact-text write approval.
5. Follow production planning/implementation checkpoints and prepare real-component frontend diff only where existing contracts support it. Do not implement missing backend contracts or ship fake integration.
6. Resolve publication enforcement gap; present full verified diff and obtain branch publication approval; record/verify delivery.
