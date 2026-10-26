# FRO-316 review — Shipment Details page redesign

Date: 2026-10-26. Read-only review; no Linear write.

## Baseline

- FRO-316 updatedAt 2026-10-21T12:33:27.612Z. Todo, labels Ready/Shipment, Chris, no priority, Pre-releases 0.0.x / 0.0.9, no comments.
- blockedBy 345, 299, 344, 300, 339, 324, 325, 292. Related 350, 343, 342, 240, 320, 309, 315, 307, 341, 326, 323, 317. FRO-341 is blockedBy FRO-316 in Linear.
- Attachments (4): Revised Shipment detail proposal (uploaded HTML); Dedicated interactive FRO-316 preview `fro-316-09642d.pages.dev` (now serves a FRO-315 MRN review page); Shipment Order list screenshot (22 Sep); Interactive Order list preview `fro-315-4aadaf.pages.dev`. The description links a fifth preview, `fro-316-shipment-preview.frontlineltdproject.chatgpt.site` (not a Pages project; hand-coded tokens). FRO-325 also cites `fro-316-fbc664.pages.dev` as historical.
- Description: 278 lines / ~80k characters. Not created through the workflow.
- Production source: main 5c51030680c9; release/0.0.2 09394e5218 (FRO-339 only).

## Production facts (gh)

- Route `src/routes/secured/shipments/$shipmentId.tsx`: `TopBar title="Shipment detail"`, then `ShipmentDetail` (`features/shipments/components/shipment-detail.tsx`, identical on both refs). No tabs; local Card/Facts helpers, not `components/ui/card`; labels hardcoded English except "Dangerous goods".
- Sections today: header card (number + `ShipmentStatusPill`, mode · purpose, origin → destination); "Transport and timing" (Status, Document type/number, Created, Dispatched, Arrived, Location unknown, Dangerous goods); "Purchase orders" (links only); "Shipment packages" (Individual collis + load units, L×W×H, no per-colli measurements, read-only); AttachmentPanel; DeliveryNotesCard (DELIVERY_NOTE_* guards); "Final handover" (when present); "Available actions" (SHIPMENT_EDIT; PREPARING: Dispatch with document-number input, Cancel with reason; DISPATCHED: Record arrival / final handover, Mark location unknown; empty otherwise).
- Schema: ShipmentStatus = PREPARING, DISPATCHED, ARRIVED, CANCELLED, LOCATION_UNKNOWN (no READY_FOR_DISPATCH). Mutations: create, dispatch(transportDocumentNumber), arrive, cancel(reason), markLocationUnknown(reason). No route/packing/notes update. Geography fields exist on release/0.0.2 only and the detail query does not fetch them. No cancellation reason, no notes.
- `ShipmentParticipation`/`ShipmentContent` carry only Order id/number, colli id/code, loading attribution and stay ids. Owner reference, Client, Vessel, Supplier and root/parent reference exist only on `PurchaseOrder` (rootPurchaseOrderId is an id). Per-colli measurements are not on the Shipment read (FRO-299 adds them).
- Order detail (`purchase-order-detail.tsx`): header card, then a tabs card (Overview, Documents, Collis, Invoice rows, History); actions sit below the tabs. Order notes are edited on the edit route, not inline.
- Design system: DESIGN.md + theme.css. Type scale title/heading/subheading/body/body-sm/caption/overline; one teal primary per view; colour never the only signal; strings via LabelsProvider. `ShipmentStatusPill`: ARRIVED success, CANCELLED/LOCATION_UNKNOWN danger, DISPATCHED info, else neutral. No stepper component exists; `Progress` (feedback.tsx) is the only progress UI. No customs/export screen exists, so FRO-350's "Customs status" is not a production reference.

## Findings

### Structure

1. The description is a stack of patches: preview-process narration ("This update changes ticket text only", restore point v29 and its local folder, "the preview has not been changed", fixture `fiscalState=none`, `CMR-DEMO-01`), the Individual collis requirement three times, Notes dependency twice, Review repacking three times, a trailing selection-editor patch after the references.
2. Contradictions: Edit entry points (status card Plan packing, packages Plan packing, packages Edit); tab list omits History & activity, which FRO-345 assigns to FRO-316; "Delivery notes moved" vs a separate Issue Delivery Notes row; preview "now demonstrates" vs "unchanged".
3. Rules written as pixels and preview styling (3px borders, 22px circles, dashed teal, pale blue notes, 20px padding from a FRO-326 preview), not production components/tokens. FRO-350 is cited as the stepper reference but has no production screen.
4. Labelled Ready without a reviewed draft; missing Out of scope detail, Decisions with reasons, a clean AC list (preview checks are mixed in) and a component map.
5. Attachments are stale: the "Dedicated interactive FRO-316 preview" now serves a FRO-315 page.

### Logic gaps

6. **History & activity tab missing** (FRO-345: Shipment activity card with Status history + Recorded operations, then Comments).
7. **Order metadata read has no owner.** The Purchase orders table needs Owner reference, Client, Vessel, Supplier and the root Order number; none is on the Shipment read. FRO-300 records the same gap for the root reference. A UI-only ticket cannot add it.
8. **Measurements.** "Recorded dimensions" must be FRO-299's resolved values (latest warehouse-confirmed, else declared with "Declared / Δηλωμένο" marker, else —), formatted `120 × 80 × 100 cm`, `450 kg`.
9. **Existing facts would be dropped.** The explicit Shipment details field list omits the Dangerous goods count (FRO-297, "Unavailable" for null) and the Final handover card has no placement.
10. **Packing entry/save flow.** FRO-325 has a plain Save packing (changed save from Ready → Preparing) and Confirm readiness. The ticket mentions Save packing once but the modal footer is Cancel / Confirm packing only.
11. **Blocking reasons.** Readiness needs stock-confirmed Orders and complete geography (FRO-325/339); dispatch needs a document number. Only the missing number has a stated reason.
12. **Delivery-note draft reconciliation.** FRO-344 defines explicit resolution of affected draft values and asks FRO-316 to integrate it; the ticket says affected saves stay blocked.
13. **Historical ARRIVED (FRO-324)** is ineligible for delivery notes; Issue Delivery Notes must show the ineligibility. Unknown mode shows "Transport reference".
14. **PREPARING label**: FRO-325 "Preparing for dispatch"; FRO-341 "Preparing".
15. **Heading**: production uses TopBar "Shipment detail" + header card; ticket asks for a combined heading card; FRO-341 decided TopBar without a card.
16. **Status indicator**: ticket and FRO-341 use a 4-step indicator; FRO-326 forbids a step counter on Orders. No production stepper exists (new composition).
17. Localisation: the detail page is hardcoded English today; EN/EL requires LabelsProvider strings throughout.

## Round 1 (asked 2026-10-26)

Q1 rewrite scope · Q2 tabs · Q3 heading · Q4 status presentation and PREPARING label · Q5 Order metadata read owner · Q6 DG count and Final handover placement · Q7 packing entry and save actions · Q8 delivery-note reconciliation · Q9 labels/board state · Q10 preview.

## Round 1 decisions (accepted 2026-10-26)

1. Full standalone rewrite.
2. Tabs: Overview · Orders and collis · History & activity · Documents · Available actions.
3. TopBar title "Shipment · [number]", no heading card.
4. Keep the four-step indicator (as FRO-341) with an exception alert for Cancelled/Location unknown; label "Preparing for dispatch" everywhere (FRO-341 to align later).
5. Order display metadata and root reference come from FRO-325's participation read (needs a separate reviewed FRO-325 edit).
6. Dangerous goods count stays in Shipment details; Final handover is its own Overview card.
7. One packing entry point (Plan packing / Edit packing); footer Cancel · Save packing · Confirm packing → Review → Confirm ready for dispatch; warning before a changed save from Ready.
8. Delivery-note draft reconciliation step inside the save flow (FRO-344 rules).
9. Labels after write: Shipment, Edited, Frontend, Story, Pending_Review; Todo, Chris, 0.0.9 unchanged.
10. New preview from production tokens/components on Pages `fro-316-<hex6>`; remove the outdated preview attachments; keep the 22 Sep screenshot.

## Consumer trace (step 3)

| Consumer or affected area | Current behavior and source | Required outcome | Owner |
| -- | -- | -- | -- |
| Shipment read (`GetShipment`) | No geography, no Order metadata, no per-colli measurements, no cancellation reason | Consume FRO-339 geography, FRO-325 participation metadata/lineage, FRO-299 measurements, FRO-345 reasons | Linked tickets; FRO-325 text needs the metadata addition |
| Dispatch (`ShipmentActions`) | From PREPARING with free-text number | From READY_FOR_DISPATCH with saved number, in status card | FRO-325 contract, FRO-316 UI |
| Cancel / arrival / location unknown | Inline forms in Available actions | Preserved; cancel also from Ready | FRO-325 / existing |
| Delivery notes (`DeliveryNotesCard`) | Section on the page | Moves into Available actions; FRO-307 addresses; historical ineligibility; reconciliation on route edit | FRO-316 UI; rules FRO-344/FRO-324 |
| Attachments | `AttachmentPanel`, SHIPMENT_EDIT | Preserved under Documents | Existing |
| Dangerous goods count | Fact in Transport and timing | Preserved in Shipment details, Unavailable for null | FRO-297 |
| Final handover | Card when present | Preserved as an Overview card | Existing |
| Location unknown reason | Fact in Transport and timing | Moves to History status event | FRO-345 |
| Shipment status pill | `ShipmentStatusPill` in list and detail | Same tones; Ready for dispatch neutral (list unchanged otherwise) | FRO-325 adds the value |
| FRO-341 creation | Status label "Preparing" | Align to "Preparing for dispatch" | Follow-up on FRO-341 |

## Preview (step 2/2b)

- canvas-design skill not retried: on FRO-341 (same day) it produced abstract art only, so the canvas was hand-written from live tokens/components (`previews/fro316/`, build with `python -I build.py ../fro341/el-labels.json <out>`).
- Local verification at http://127.0.0.1:8316: zero console errors, no failed requests; no page overflow at 400px or 1280px across 10 scenarios × 5 tabs × EN/EL; loading/empty/error/view-only states. Flows: packing validation → review → Ready → Dispatch; doc-only edit keeps Ready; mode change keep/replace/clear; Ready warning; delivery-note reconciliation; participation (emptied unit, partial reason/remark, added colli individual); failed save keeps draft; Escape/focus return; tab keys; View history highlight.
- Cloudflare Pages deploy blocked: wrangler unauthenticated, no CLOUDFLARE_API_TOKEN.

## Saved (2026-10-26)

Approved and saved at 09:28:34Z; FRO-297 auto-relation removed at 09:29:05Z. Three outdated attachments removed. Verified against the approved draft after normalization. FRO-341 now blocked by FRO-316 (set by the FRO-341 session before this write; preserved).
