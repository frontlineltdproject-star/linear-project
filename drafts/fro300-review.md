# FRO-300 review — Individual collis in Review repacking

Planning record only. Not ticket text.

## Baseline (2026-10-26)

- FRO-300 updatedAt 2026-10-20T11:10:31.791Z. Todo, labels Ready + Shipment, Chris, No priority, Pre-releases 0.0.x / 0.0.9. Blocks FRO-316; related FRO-325, FRO-299. No attachments, documents or comments.
- Live source: Frontline-Forwarding/frontline-forwarding main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a (read through gh).
- UI owner: FRO-316 (Review repacking inside the Shipment Details packing modal). FRO-341 creation has no repacking step, so FRO-300 does not apply to creation.

## Evidence

| Source | Finding |
| -- | -- |
| `docs/workflows/purchase-order-colli-journey.md` | Colli flag **Unpacked** = "the goods arrive without packaging". The ticket title's "unpacked collis" (meaning: not in a load unit) collides with it. Portal term is **Individual collis** (EL `Μεμονωμένα κόλι`, labels-provider.tsx). |
| `shipment-composer.tsx` `ShipmentReview` | Individual collis count = selected collis without a draft assignment; Transport pieces = individual + load units. Optional repacking plan shows only load-unit cards, or the all-individual message when there are none. Colli allocation rows already show tracking code, description, dimensions, gross weight, Shipping form. |
| `ShipmentsApiService.eligibleHandlingUnit` | Review measurements are the colli's **declared** dimensions/weight. |
| `database.md` `freight_handling_unit_measurement`; journey doc | Separate DECLARED / WAREHOUSE_CONFIRMED measurements per warehouse stay; stock confirmation requires one confirmed measurement per current nonterminal colli. |
| `shipments.graphqls` `Shipment` / `ShipmentContent`; client `shipments.graphql` | Shipment read exposes only colli id, tracking code and Order number per content (looseContents / loadUnits.contents). No description, package type, dimensions or weights. Details review cannot show the required measurements from the current read. |
| `formatDimensions` / `formatWeight` | Any missing dimension → `—`; missing or zero weight → `—`. |

## Gaps found

1. Title/terminology collision with the Unpacked flag.
2. Measurement source unspecified (declared vs warehouse-confirmed).
3. No read contract supplies per-colli measurements/description in Shipment Details; ticket says "adds no storage" but is silent on the read.
4. "Tracking code/name" undefined; no colli name field exists. Row order and child/root Order display unspecified.
5. No explicit invariant that every participating colli appears exactly once across load-unit contents and the Individual collis block.
6. No consistency check between the confirmed review and the saved Shipment packages loose list.
7. Missing Out of scope, Decisions, affected systems, Context for agents and Post-deployment verification sections.
8. FRO-299 still describes the retired wizard steps 3/4 (separate ticket; flagged only).

## Interview

Round 1 asked 2026-10-26. User accepted all five recommendations:

- Q1: use **Individual colli**; title "Shipment Details — list individual collis in Review repacking"; glossary term added to CONTEXT.md.
- Q2: warehouse-confirmed measurement first, declared fallback with a Declared marker, applied consistently across the review (Colli allocation, FRO-299 rows need their own edits).
- Q3: FRO-300 owns an additive read-only Shipment read extension (GraphQL/REST/MCP), no storage.
- Q4: rows = tracking code, description, participating Order (child + original/root), dimensions, gross weight; grouped by Order in Colli allocation order.
- Q5: out of scope: individual-colli weight subtotal, DG/flags on rows, saved Shipment packages display changes (consistency check only).

### New facts after round 1

- Concurrent session "FRO-299 ticket review" wrote an unsaved local draft `drafts/fro299-reviewed-spec.md` (10:05) in which **FRO-299 owns the same Shipment read extension** and FRO-300 consumes it. Linear FRO-299 unchanged (updatedAt 2026-10-20). Conflicts with Q3.
- Verified in `ShipmentsApiService` (split, ~line 1172): a partial split creates a new child warehouse stay; confirmed measurements remain on the parent's stay. An "origin stay only" rule would miss them.
- `freight_handling_unit_measurement_value_check`: a confirmed measurement may hold dimensions only or gross weight only.
- Linear Area labels (Frontend / Backend) are single-select.

Round 2 asked: Q6 read ownership vs FRO-299, Q7 measurement rule refinement, Q8 labels/relations, Q9 coordination with the FRO-299 session.

Round 2 (2026-10-26), all accepted: Q6 FRO-299 owns the read, FRO-300 consumes and adds blockedBy FRO-299; Q7 most recent confirmed value at any warehouse, dimensions/weight independent, declared fallback with marker; Q8 labels Ready/Shipment/Frontend/Story/Edited, Todo, Chris, new title, relations blocks 316, blockedBy 299, related 325/299; Q9 decisions sent to the FRO-299 session (no reply yet).

## Draft

Complete standalone replacement: `drafts/fro300-reviewed-spec.md`. Awaiting full-text approval before any Linear write. Possible automatic relations from mentions (FRO-341, FRO-297) must be compared after save.

## Saved and verified (2026-10-26)

- User approved the complete displayed draft and metadata, including removal of automatically added relations.
- Saved `drafts/fro300-reviewed-spec.md` to FRO-300 (updatedAt 2026-10-26T08:15:14.662Z). Title "Shipment Details — list individual collis in Review repacking"; labels Shipment, Edited, Ready, Frontend, Story; blockedBy FRO-299 added.
- Re-read: description matches the approved text after Linear mention/escape normalization (`<issue>` tags, `\~`). Linear auto-added related FRO-297 and FRO-341; removed only those two and re-read (updatedAt 08:15:29.920Z).
- Final metadata: Todo, Chris, No priority, Pre-releases 0.0.x / 0.0.9, no attachments/documents; blocks FRO-316; blockedBy FRO-299; related FRO-325. The earlier related FRO-299 link is now the blockedBy link (Linear keeps one relation per issue pair).
- No UI, preview, production branch, production code or database action. FRO-299 remains Pending_Review.
