# FRO-341 review — Shipment Creation page redesign

Date: 2026-10-26. Read-only review; no Linear write.

## Baseline

- FRO-341 updatedAt 2026-10-26T08:15:29.875Z. Todo, labels Shipment/Pending_Review/Frontend/Story, milestone 0.0.9, no priority/assignee, no comments.
- blockedBy 292, 320, 343, 323, 324, 342, 339, 325. Related 350, 335, 316, 326, 299, 307, 344, 322.
- One attachment: "Static Shipment creation preview" (chatgpt.site).
- Description is 318 lines / ~71k characters.
- Production source: main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. The ticket cites 3820e89 (5 commits behind; composer changed +2/-7).
- FRO-339 is Done in Linear but merged only to `release/0.0.2` (commit 09394e5218, 2 ahead of main). That branch already adds the four geography selectors to the current composer and `ShipmentGeographyPolicy` (warehouse must match the shipment city by `cityId`; a warehouse with no city is rejected).

## Findings

### Structure

1. The description is a stack of patches. At least seven paragraphs say "supersedes the earlier…". Contradictions remain:
   - Status placement: "Initial status directly below the geography fields" vs "Status subcard above geography".
   - Labels: Initial status/Status; Transport-document number/Document number; Departure date · if known / Date Dispatched; Arrival date · from stock list / Date Arrived.
   - Partial selections: a summary with a "Create child PO for selected collis" outcome, then stacked cards with that field removed, then compact rows.
   - Colli toggle: text button beside the Order ID, then a chevron at the column edge, then the far right of the row.
   - Arrived-shipment source: the "Select available collis" button table row vs a later checkbox.
   - Annotations: per-block borders vs one consolidated border.
   - Geography-first warehouse selection is specified three times (sections at lines 116, 130 and 138).
2. Missing house-style sections: Out of scope, Decisions, Context for agents, and a read-only Post-deployment verification. The acceptance list mixes production criteria with preview checks.
3. Most rules are written as pixel values (14px, 28px gap, 110px editor). DESIGN.md requires the type scale and density tokens, and the typed components (`#/components/ui/*`).

### Logic gaps

4. **Retired PCS.** The review's "Declared pcs" counter uses per-colli PCS, which FRO-295 retired (Done; removed on main). The live review has no PCS. Its counters are Purchase orders, Collis shipping, Collis remaining, Optional load units, Individual collis, Transport pieces and Declared gross.
5. **Deep-link entry.** `/secured/shipments/new` accepts `originWarehouseId`, `purchaseOrderId` and `purchaseOrderIds` from Order pages. The ticket disables the origin warehouse until origin country/city are chosen, and says a warehouse never fills geography. It does not say what a preselected origin warehouse does. The `release/0.0.2` composer keeps the preselected warehouse and shows a mismatch until geography is chosen.
6. **Repacking removal timing.** Production creation currently supports optional pallets/cardboard boxes. FRO-341 removes repacking from creation, and it moves to Shipment Details (FRO-316 + FRO-325). FRO-316 is only "related", so FRO-341 could ship before Details repacking exists.
7. **Notes interaction.** The ticket specifies per-field Edit/Save/Cancel on a draft that has not been created, copied from the saved-record Details layout. This needs a deliberate decision, or plain textareas.
8. **Warehouses without a city.** FRO-339's server rejects these. The ticket filters by geography, but does not say whether these warehouses are hidden or explained.
9. **Ready for dispatch step.** The status indicator shows Ready for dispatch, which is not in the production `ShipmentStatus` enum (PREPARING, DISPATCHED, ARRIVED, CANCELLED, LOCATION_UNKNOWN). FRO-325 must add it first. FRO-325 is a blocker, so this is acceptable if it is stated.
10. **Board state.** The issue is Todo while still labelled Pending_Review.
11. **Heading card.** The production page title uses `TopBar` (an h1 `text-title` with no card). The ticket adds a FRO-335-style heading card instead.

### Preview

12. The attached preview requires a ChatGPT sign-in (HTTP 401), so Grigoris and Chris cannot open it. It is not a Cloudflare Pages `fro-341-<hex6>` project and has no recorded project name. Its local source is `shipment-create-preview/`, built with an Oct-13 theme.css copy, hand-rolled components and a custom style.css.
13. Cloudflare preflight: `wrangler whoami` shows the session is not authenticated, and no Pages-scoped token is set. Step 2b is blocked until one is set.

## Round 1 decisions (accepted 2026-10-26)

1. Rewrite as one standalone spec. Take the latest correction where versions conflict, and reference the FRO-339 release/0.0.2 behaviour instead of re-specifying it.
2. Drop "Declared pcs". The review counters are Purchase orders · Collis shipping · Collis remaining · Declared gross.
3. Deep link with `originWarehouseId` prefills origin country/city from that warehouse's city (the only exception). The operator can change them, and the preselected Orders stay selected.
4. Add blockedBy FRO-316. FRO-341 must not ship before repacking is live in Shipment Details.
5. Notes are two plain Textareas (FormField + Textarea), submitted with creation; FRO-292 owns storage and visibility.
6. Warehouses with no city are never offered. When none match, show the production message "No matching warehouse in the selected destination city"; Context for agents notes the address must be completed.
7. Specify the page through the production components, type scale and tokens. The title uses TopBar (no heading card), and "New component" markers are preview-only.
8. Rebuild the preview on Cloudflare Pages `fro-341-<hex6>` and replace the chatgpt.site link after approval. This needs a Pages-only token.

## Component map (live client, main 5c51030 / release/0.0.2)

| Element | Production component (source) | Notes |
| --- | --- | --- |
| App frame | AppShell header nav (`components/layout/app-shell.tsx`) | unchanged |
| Page title | `TopBar` (`components/layout/top-bar.tsx`) | title only, no description |
| Outer tabs and Orders sub-tabs | `Tabs`/`TabList`/`Tab`/`TabPanel` (`components/ui/tabs.tsx`) | Arrow/Home/End keys plus roving tabindex are an **extension** of `Tab` (not present today) |
| Section cards | `Card`, `CardHeader`, `CardTitle`, `CardBody` (`components/ui/card.tsx`) | |
| Status, Mode, Purpose, Reason | `Select` (`components/ui/select.tsx`) via `SelectField` (`components/form/select-field.tsx`) | short fixed lists |
| Countries, cities, warehouses, agents | `Combobox` (`components/ui/combobox.tsx`) | preview uses native select styled as Select |
| Labels, errors, hints | `FormField`/`Label` (`components/ui/input.tsx`) | |
| Document type (read-only), Document number, search, remarks | `Input` (`components/ui/input.tsx`) | |
| Date dispatched / Date arrived | `DatePicker` (`components/ui/date-picker.tsx`) via `date-field.tsx` | preview uses native date input |
| Notes | `Textarea` (`components/ui/input.tsx`) | |
| Orders, sources, allocation tables | `Table`/`THead`/`TR`/`TH`/`TD` (`components/ui/table.tsx`), `Checkbox` (`components/ui/choice.tsx`) | |
| PO status | Purchase-order status pill (`features/purchase-orders/components/purchase-order-status-pill`) per DESIGN.md palette | |
| Buttons | `Button` primary/secondary/ghost, sizes sm/md/lg (`components/ui/button.tsx`) | Create shipment is the single primary action; Create new order is secondary |
| Documents | `AttachmentPanel` (`features/attachments/components/attachment-panel.tsx`) | **extension** for pending creation files (FRO-342) |
| Review and Create Order overlay | `Modal` (`components/ui/modal.tsx`), `MetricCard` (`components/ui/card.tsx`), `Alert` (`components/ui/alert.tsx`), `Badge` (`components/ui/badge.tsx`) | |
| Loading / errors / toast | `loading-placeholder.tsx`, `ErrorMessage`, `useToast` | |
| **New compositions** | Status subcard with 4-step indicator; compact partial-selection row; arrived-shipment source table; pending-file rows | composed from the primitives above |

Production labels reused (release/0.0.2): Origin country, Origin city, Destination country, Destination city, Select country, Select city, Select the origin/destination city first, No matching warehouse in the selected destination city, The origin/destination warehouse must be in the selected … city.

## Preview

- Source: `previews/fro341/index.src.html` and `build.py`, with the production Greek labels in `el-labels.json`. It reuses the FRO-335 inline Create Order pages.
- canvas-design skill: tried first (2026-10-26). It only produces abstract art (.md/.png/.pdf), not an HTML screen, so the canvas was written by hand from the live tokens.
- Local verification (http://127.0.0.1): no console errors from the page, no failed requests. Desktop and 400px have no page-level horizontal overflow. EN/EL. Default/loading/empty/error states. Checked: deep-link prefill; geography clearing; destination filtering and no-match; duplicate document number; vessel rule; partial decisions (Other needs a remark, include remaining, bulk); Arrived (dates enabled, purpose locked, whole Orders, ARRIVED review); file failure blocks Confirm; Review selected files; submission rejection keeps the draft; tab keys; Escape and focus return; Create new order overlay.
- Cloudflare Pages deploy: blocked until `CLOUDFLARE_API_TOKEN` (Pages: Edit only) is set.

## Status

Round 1 settled. The preview is verified locally and not yet deployed. The full ticket draft is pending.
