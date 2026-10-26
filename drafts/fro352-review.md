# FRO-352 — workflow review findings (2026-10-26)

Baseline: FRO-352 Todo, labels Pending_Review/Frontend/Story/export, milestone 0.0.10, project Pre-releases 0.0.x, updatedAt 2026-10-20T11:10:41.828Z, blockedBy FRO-317, related FRO-350/348/354/353/347/321, 1 attachment (ChatGPT-hosted preview), no comments. Production main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a.

Sources compared: FRO-317 (saved 2026-10-26T13:37:49Z, Ready), FRO-350 (saved rewrite, drafts/fro350-reviewed-spec.md), FRO-321 (Todo, Pending_Review), production repo via gh.

## Conflicts with saved FRO-317 / FRO-321

| # | FRO-352 today | Authoritative rule |
| -- | -- | -- |
| C1 | Completed: no membership change, "including additions" | FRO-317: Add only at Awaiting IE599 **and Completed**; added invoice starts at its own VAT stage |
| C2 | No cancel action; "do not render ... cancellation" | FRO-317: cancel at Awaiting EAD, no recorded events, managers + system admins, reason ≤1,000 chars; Cancelled Export read-only and readable |
| C3 | Print templates Airport / Α΄ / **Δ΄** Piraeus | FRO-317: Αερολιμένας Ελ. Βενιζέλος / Α΄ / **Γ΄** Τελωνείο Πειραιά |
| C4 | MRN: "do not invent a regex" | FRO-317 defines it: trim, upper case, 18 letters/digits, unique incl. cancelled; MRN date ≤ today |
| C5 | EAD dialog: required date only | FRO-317: EAD date ≥ MRN date and ≤ today (Athens) |
| C6 | Stamping dates: ordering only | FRO-321: all event dates ≤ today; dispatch ≥ Invoice date |
| C7 | Membership dialog: generic "guards" | FRO-317 invoice type matrix per Export type; Entry Note storage invoices in one Export (FRO-319) |
| C8 | Button "Mark as Exempted" / dialog "Record stamped papers returned" | FRO-321 event name "Record stamped papers returned"; FRO-317 table "Record stamped return" |
| C9 | "Shipment ID" | Production identifier is `shipment_number` (FRO-350 uses **Shipment number**) |
| C10 | Document upload "supported types" | FRO-347 list: PDF/JPG/JPEG/PNG/WebP/GIF/DOC/DOCX/XLS/XLSX/CSV/TXT, nonempty, 1–255 char name, ≤25 MB |

## Missing information

- M1 No route/entry points: how the page is opened (FRO-350 Open Export, FRO-348 Related Export; Exports list and Shipment Details buttons are unowned follow-ups).
- M2 No Cancelled-Export presentation (banner, reason/actor/time, hidden mutation controls, print/download behavior).
- M3 Foreign Export: the foreign recipient (Invoicing company) is not displayed anywhere in Export details.
- M4 Actor/time of EAD/IE599 confirmations and cancellation are recorded (FRO-317) but display is undefined.
- M5 Saved invoice table columns differ from FRO-350 (Invoice ID column; no Paperwork only badge; Source not applicable on saved record).
- M6 Membership editing uses a dialog, while FRO-350 edits the same table inline with Add invoice picker + Remove; consistency undecided.
- M7 Print ΥΔ output format/behavior undefined (production prints PDFs inline via Thymeleaf/OpenHTML, e.g. delivery note).
- M8 IE599 confirmation date has no "not later than today" bound in FRO-317 (EAD has it).
- M9 No Decisions, Out of scope list, Context for agents (sources/component map) or Post-deployment verification sections; text is patch-stacked prose, not house style.
- M10 The only design reference (ChatGPT-hosted preview) returns 401 signed out → historical only; the description must be the contract.
- M11 "View-only access" is used but FRO-317 defines Export view/create/edit-confirm/cancel authorities; restate in those terms.

## Production facts (main 5c51030)

- No Export, Supplier Invoice or Entry Note entity/API/route. Attachments support Order/Shipment owners only.
- Client routes live under `frontline-forwarding-client/src/routes/secured/<feature>/$id.tsx`; no exports route.
- PDF printing pattern: server-rendered Thymeleaf/OpenHTML, returned inline (`docs/workflows/delivery-note.md`).
- Existing mock branches: fro-316/326/335/341/347/348; FRO-350 branch in preparation (parallel session) under `src/features/exports/`.
- Cloudflare token not set → preview local only (same as FRO-350).
