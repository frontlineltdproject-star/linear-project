# FRO-335 React implementation review — 22 October 2026

## Delivered scope

Implemented the approved comfortable Sites layout as real React components in the isolated production checkout. The new `PurchaseOrderCreationForm` uses TanStack Form and the existing production Card, Tabs, FormField, Input, Select, Combobox, DatePicker, Checkbox, Button, Modal, Table and feedback components. No standalone prototype CSS was copied into the app.

The form has the four tabs, stacked overview/notes cards, declared colli inputs and local Save/Cancel, selected-row independent copies, empty collections, exact draft invoice totals, staged files and explicit created/partial/unknown result recovery. Small backward-compatible accessibility props connect labels to Combobox/DatePicker; Modal now uses its title as its accessible name.

**Integration boundary:** the existing Create route, services, standalone Edit and saved Details are unchanged. The new component is not activated against today's incompatible create input. It exposes typed UI callbacks for real authorized create/upload/reconciliation/navigation adapters. This is a frontend preparation slice; the full ticket is not integrated or deployable yet.

The missing dependency contracts include initial readiness, split Notes, independent Pickup, explicit Customs regime/warehouse capabilities, new colli flags and Unit price. Current backend Collection agent validation also prevents simply replacing the form. README beside the component lists adapter obligations. No API/schema/generated code, backend, dependency manifest, infrastructure, production fixtures or authorization implementation changed.

## Source and complete diff

- Production repository: Frontline-Forwarding/frontline-forwarding.
- Isolated checkout: C:/Users/Giorgos/AppData/Local/Temp/fro335-production-review.
- Base and latest fetched main: `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.
- Playbook: committed policy, SHA-256 `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`; both model checkpoints retained.
- Complete patch, including all untracked implementation files: [fro335-react-ui.diff](C:/Users/Giorgos/.codex/visualizations/2026/10/22/01a1632b-72a1-71d2-9828-89cc6e22291d/fro335-react-ui.diff).
- Patch SHA-256: `17f2ee26d49d830fb0f5d7e8d0c72859f33af1eb9ae65428fb97d6a105a0264e`.
- 16 changed/new paths, all beneath frontline-forwarding-client. Reverse-apply check against the working tree passed.
- 13 new files in src/features/purchase-orders/components/creation; shared additions in src/components/ui/combobox.tsx, date-picker.tsx and modal.tsx.
- Temporary browser harness removed; generated route-order churn restored to the exact original. No branch, production commit, push, PR or deployment occurred.

## Verification

| Check | Result |
| -- | -- |
| Initial retained behavior tests | Six tests demonstrated missing behavior against an empty scaffold before implementation. |
| Focused form tests | 13/13 passed, including independent-review fixes. |
| npm run test | 40 test files; 176/176 tests passed. |
| npm run build | Passed. Existing app builds; new component separately compiled/rendered through tests and local browser harness. |
| Changed-file Prettier check | All changed/new files passed. |
| npm run format:check | Fails on 266 existing, untouched files. None of the changed component files appears in its warnings. No broad formatting rewrite performed. |
| npx tsc --noEmit | Fails only at unchanged delivery-note-service.test.ts lines 77 and 81: unsafe Window/Response assertions. No diagnostics in this slice. |
| npm ci | Baseline failure: package.json and package-lock.json out of sync. Local npm install --package-lock=false enabled testing without manifest/lock edits; exact lockfile reproducibility is unresolved. |
| git diff --check | Passed. |
| Complete patch verification | git apply --reverse --check passed; all paths/content audited for frontend scope. |

Runtime: Node 24.13.0, satisfying the declared >=22.13.0 engine; repository-preferred Node 22.13 was not installed in this checkout. Local resolution used the declared package ranges because the committed lock cannot clean-install.

Browser validation used a temporary, local Vite harness with the actual component, providers, theme, language selector and TopBar. Fictional reference options and controlled callbacks; no production requests or writes. Tested EN/EL, light/dark appearance, desktop 1440px and 400px; no page horizontal overflow in inspected overview/colli views. Table scrolling stays within its container; expanded colli fields fit the narrow viewport.

Observed pending-row summary and Save focus, invalid '-' retention, tab/locale note retention, Ready confirmation/cancel, keyboard tab arrows, loading/reference error, actual file chooser selection, same-ID upload retry (one Create/two Upload callbacks), unknown creation with no Create retry, saved-record check and failed Details navigation preserving the ID. Initial hot reload of the temporary harness emitted a duplicate createRoot warning; it was harness-only and excluded from the delivered code. Do not claim browser fixture checks establish real backend integration.

Screenshots:
- [Actual React desktop](C:/Users/Giorgos/.codex/visualizations/2026/10/22/01a1632b-72a1-71d2-9828-89cc6e22291d/fro335-react-desktop.png)
- [Actual React Greek at 400px](C:/Users/Giorgos/.codex/visualizations/2026/10/22/01a1632b-72a1-71d2-9828-89cc6e22291d/fro335-react-greek-mobile.png)

## Independent review

Fresh read-only reviewer inspected the full UI slice and callback boundaries. No Critical findings. Both Important findings were addressed in one fix pass:

1. Quantity maxlength truncated an invalid value into a valid quantity. Browser RED: typing 21474836470 yielded 2147483647. GREEN: the complete raw string remains, validation rejects it, total displays —. Regression passed.
2. Queued upload authorization could be stale after waiting for creation or a prior file. Two regression cases established the behavior; every upload now reads current authority/adapter props and leaves skipped files not-attempted with the host's reason. Tests passed.

The minor delivery-cleanup finding (generated routing order) was removed from the diff. No deferred reviewer minors remain.

## Rulings and practical limits

- Prepare the new production-component form without activating the current route until target contracts are delivered. This prevents silent input loss/fake integration; the cost is a separate future adapter/activation slice.
- Use local declared-range dependency installation without modifying manifests because the baseline lock is broken. The cost is unresolved reproducible clean installation.
- Backend payload mapping, atomic readiness, notes normalization, authoritative totals, audit and access enforcement remain dependency-owned. The cost is that this UI slice cannot prove those behaviors.
- AppShell/route/Edit/Details/list invalidation and actual navigation remain existing implementations. The cost is that component-browser QA does not establish full authenticated-route integration.
- Found/absent reconciliation must be established by the host, never guessed from a filename/reference. The cost is that unknown-result recovery needs a safe real adapter.
- The reviewer did not perform browser QA; the implementer ran the documented component scenarios. Real session/adapter behavior remains unverified.
- The implementer ran the final suite/build and reports the baseline type/format failures without expanding scope to fix unrelated code.
- Temporary harness and execution ledger are local scratch, excluded from the diff. The uncommitted implementation and ledger are retained for user review, as requested.

## Next gate

Review the attached complete diff. Branch creation and commits remain withheld. Full route activation still requires the dependency contracts. Publication additionally requires the governing AGENTS ruleset enforcement and all required checks, or an explicit change to those requirements; the prior ruleset inspection returned HTTP403. No publication approval is being requested while those blockers remain.

