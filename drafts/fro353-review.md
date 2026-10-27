# FRO-353 — workflow review findings (2026-10-27)

Baseline: FRO-353 "Customs Storage Entry — Creation page UI", Todo, labels entry note/Frontend/Story (no Pending_Review or Ready), milestone 0.0.11, project Pre-releases 0.0.x, updatedAt 2026-10-27T08:31:02.173Z, no comments. Blocks FRO-355; blockedBy FRO-319; related FRO-350/352/248/358/326/354. Attachments: "Deferred list, printing and other note-type UI — reference only" (upload), "Entry Note creation — no Order selected" (ChatGPT-hosted preview, sign-in required).

Sources compared: FRO-319 (Ready, drafts/fro319-reviewed-spec.md + eligibility-read patch), FRO-355 (drafts/fro355-reviewed-spec.md), FRO-354 (Pending_Review, 07:53:37Z), FRO-321 (Pending_Review, 08:00:24Z), production main 5c51030 and branch chriskazakos/fro-356-order-customs-regime via gh.

## Production facts

- `purchaseOrders(filter.search)` matches Stock ID (`internal_number`), message number, owner reference, supplier reference, vessel name and current colli tracking code (`PurchaseOrderRepository.searchCondition`). It does **not** match Client name, Supplier name or invoice numbers. There is no Order search that returns Customs Storage Entry eligibility.
- `freight_warehouse` address = `street`, `street_number`, `postal_code`, `city_id` (all nullable) + `operator_company_id` (required).
- FRO-356 branch: licences per warehouse with covered regimes; storage admission = stock confirmation or committed network transfer; Free Zone/Bonded badges removed.
- FRO-321: storage invoice type **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)**, VAT forced to 0, any currency, cancelled invoices exist.
- Client: `components/ui` has Button, Card, Tabs, Combobox, DatePicker, Input, Modal, Table, Badge, Alert, Feedback, Typography. Mock-branch pattern: new files only under `frontline-forwarding-client/src/features/<feature>/…`, unmounted, README with activation boundary.

## Conflicts with saved contracts

| # | FRO-353 today | Authoritative source |
| -- | -- | -- |
| C1 | Search by Client, Supplier or invoice | Production search does not match these; no eligibility search exists (FRO-319 has a one-Order eligibility read only) |
| C2 | Reasons: wrong regime, not admitted, cancelled, already owned/covered | FRO-319 patch + FRO-355: cancelled → not Customs Storage (incl. Greece = No) → not admitted → **admitted under another Order** → already owned/covered |
| C3 | "Free Zone" invoices / quantities | FRO-321/356: type Αποθήκη Αποθήκευσης (Δελτίο Εισόδου); Free Zone wording retired |
| C4 | Conflicting-Export state | FRO-319: FRO-317 rejects one entry's invoices in different Exports; only partial assignment is possible |
| C5 | Actual VAT "€0", € amounts | FRO-321: any currency; amounts are in the invoice currency |
| C6 | Cancelled invoices not mentioned | FRO-319: only active (not cancelled) matching invoices |

## Missing information / logic gaps

- G1 Ineligible or inaccessible **preselected** Order (from FRO-355 or a stale link) — behavior undefined.
- G2 Cancel destination (list entry vs Order entry) and leave-page guard undefined; FRO-355 says Cancel returns to the Order.
- G3 Entry point "Customs Storage → Create" depends on FRO-358 (Backlog, no milestone); in 0.0.11 only FRO-355 reaches the page. Route and nav ownership undefined.
- G4 Access: create authority / partner users / denied state not stated.
- G5 Admitting warehouse and admission time (FRO-319 derived) not shown, so the operator cannot see where prefill came from.
- G6 Permit number blank with 0 or >1 licences — no explanation.
- G7 Warehouse address format from nullable parts undefined.
- G8 Field validation: future entry date/time, MRN date, tariff code length, text lengths undefined.
- G9 Per-row Statistical VAT for non-EUR invoices ambiguous.
- G10 Lost response on Create (unknown outcome) undefined; concurrent duplicate should show existing entry + Open (FRO-355).
- G11 No EN/EL strings for reasons, empty states, errors.
- G12 House style: no Decisions, Out of scope, Context for agents; process narration (preview review controls, 304px checks); visual spec points to a ChatGPT preview instead of the production design system.
- G13 Metadata: no workflow label; attachment titles still say Entry Note.
