# FRO-350 — workflow review (Export Customs Declaration — Creation Page)

Review started 2026-10-26. FRO-350 was written without the AGENTS.md workflow.

## Baseline

- FRO-350: Todo; labels Pending_Review / Frontend / Story / export; milestone 0.0.10; project Pre-releases 0.0.x; no assignee/priority; updatedAt 2026-10-20T11:10:38.464Z; no comments.
- Relations: blockedBy FRO-317; related FRO-348, FRO-347, FRO-353, FRO-352, FRO-341, FRO-316.
- Attachments (7): "Create Export — three-card UI preview" (fro-350 chatgpt.site, **401 signed out**); Linear document "retained UI requirements & previous previews" (pre-split historical text); four fro-317 chatgpt.site scenario previews (200); FRO-316 chatgpt.site preview.
- Dependencies: FRO-317 Todo/Ready (saved 2026-10-26 13:06); FRO-321 Todo/Pending_Review; FRO-319 Todo; FRO-347/FRO-348 Todo/Pending_Review with mock branches; FRO-352 Todo/Pending_Review.
- Production `main` 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. No Export, Supplier Invoice or Entry Note contract exists on main.

## Production facts (gh, main 5c51030)

| Fact | Source |
| -- | -- |
| Shipment search matches `shipment_number` or `transport_document_number`, case-insensitive contains; filter supports statuses. There is no search by numeric id. | `domain/shipments/ShipmentRepository.java` `searchCondition`, `ShipmentFilter.java` |
| The visible Shipment identifier is `shipmentNumber` (unique, generated). | `database.md` `freight_shipment`; `shipment-table.tsx` |
| PREPARING Shipments have no transport document type/number; DISPATCHED/ARRIVED/LOCATION_UNKNOWN have a type. | `database.md` lifecycle-shape and pair checks |
| `vessels` GraphQL query returns all Vessels (id, name). | `web/vessels/VesselsGraphQlApi.java`, `list-vessels.graphql` |
| Attachments support Order/Shipment owners only; upload needs a saved owner. | FRO-317 Context; `features/attachments/types.ts` |
| UI catalogue: alert, badge, button, card, choice, combobox, date-picker, drawer, feedback, input, menu, modal, multi-select, navigation, popover, select, table, tabs, toast, typography. | `frontline-forwarding-client/src/components/ui/` |
| FRO-347/348 presentation (picker, document queue, VAT three-step indicator) exists only on `mock/fro-347-…` / `mock/fro-348-…`, not on main. | branch compare |
| Mock-branch pattern: new, unmounted client files under one feature folder, EN/EL labels, tests, README with activation boundary; no route, service or backend. | mock/fro-347, mock/fro-348, mock/fro-341 |

## Findings

1. **Not a standalone spec.** Patch-stack wording ("Remove … from the preview", "replace the old Customs progress field", "Remove the separate View Shipment context action"); the Scope section repeats and partly contradicts the structured sections; the attachment title still says "three-card".
2. **The agreed design link is unreachable** (401 behind ChatGPT sign-in). "Use the current preview together with this ticket" cannot be the contract.
3. **Misaligned with saved FRO-317:**
   - MRN rules missing (18 alphanumeric, trimmed/upper case, unique incl. cancelled; MRN date not after Athens today).
   - EAD receipt confirmation date not earlier than MRN date missing.
   - Greek Export requires ≥1 selected invoice; Foreign requires participating physical collis, invoices optional — only the foreign half is stated.
   - Invoice type matrix and not-allowed reason missing; "type conflicts are surfaced" has no FRO-317 meaning.
   - Entry Note shared-Export rule (FRO-319) missing.
   - Blocking list incomplete (Order without Supplier in foreign procedure; duplicate FOREIGN VAT; FOREIGN + FOREIGN).
   - Grouping phrased as "same Invoicing-company ΑΦΜ"; FRO-317 groups by Company record.
   - "Four … scenarios in FRO-317" — FRO-317 ACs 1–3 define three scenario shapes.
4. **Fixture uses "Free Zone invoice"**, not a FRO-321 invoice type.
5. **"Shipment ID"** — production has `shipmentNumber`; search is by number or transport document, not by id. Cancelled Shipments are not eligible (FRO-317) but the search does not exclude them.
6. **Entry points have no owner.** FRO-317 lists the Exports list page and Shipment Details "Create Export" action as follow-ups; FRO-350 presents both as existing.
7. **Post-create behaviour undefined:** destination after success, staged Documents upload after the Export exists, partial upload failure, unknown outcome.
8. **Duplicate/concurrent create** (FRO-317 AC 8 returns the existing Export) has no UI behaviour.
9. **Cancel / leave with unsaved draft** undefined.
10. **Invoice table content undefined:** "treatment" not defined; where direct/ancestor source and participating Order show; paperwork-only marker not defined.
11. **Add invoice picker:** eligibility/unavailable reasons not specified.
12. **Access:** no permission/denied behaviour on the page.
13. **No Context for agents / Post-deployment verification / Decisions / Out of scope sections** in house style.

## Consumer trace (UI ticket)

| Consumer or affected area | Current behaviour and source | Required outcome | Owner |
| -- | -- | -- | -- |
| Shipment search | number/transport doc contains; status filter available | Search non-cancelled Shipments by number or document | FRO-350 (UI) uses existing filter |
| Export candidates, create, duplicate return | none on main | Consume FRO-317 contracts | FRO-317 |
| Supplier Invoice suggestions/search/eligibility | none on main | Consume FRO-321/FRO-317 contracts | FRO-321 / FRO-317 |
| Vessel options | `vessels` query | Single optional selection | existing |
| Export attachments | Order/Shipment only | Upload after create against Export owner | FRO-317 |
| Entry buttons (Exports list, Shipment Details) | none | Follow-up tickets | unresolved — Q6 |
| Saved Export page after create | none | FRO-352 | FRO-352 |

## Round 1 questions

See chat; answers recorded in MEMORY.md.
