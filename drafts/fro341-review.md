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

## Status

Round 1 questions asked in chat. Recommendations are not decisions.
