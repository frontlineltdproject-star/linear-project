**As an operator I want a Customs Storage Entry (Δελτίο Εισόδου) card in an Order's Available actions** so that I can create the entry for that exact Order, or open the entry that already covers it, without searching again.

**Order = purchase order = stock-list item.** This ticket owns the card's state, the current-entry lookup, Create/Open routing and return context on saved Order Details. Card presentation follows [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) (fourth standalone card in **Available actions**). The creation page is [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353), the details page is [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354), and every business rule (eligibility, coverage, uniqueness, access) belongs to [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319). No new form, modal, entity rule or UI design is introduced.

## Card states

The card resolves its state from the server in this order; the first match wins.

| # | Condition | Card shows |
| -- | -- | -- |
| 1 | User has no Customs Storage Entry view authority (includes every client, supplier and agent user) | **No card.** No lookup request is made. |
| 2 | Lookup loading | Heading and **Loading… / Φόρτωση…**; no usable button. |
| 3 | Lookup failed or returned an unexpected result | **Could not check for a Customs Storage Entry. / Δεν ήταν δυνατός ο έλεγχος για Δελτίο Εισόδου.** + **Retry / Επανάληψη**. Never treated as "no entry". |
| 4 | A current entry exists — owned directly, or inherited through a split (see below) | **Open Customs Storage Entry / Άνοιγμα Δελτίου Εισόδου**, plus **Entry number / Αριθμός δελτίου**. Inherited: also **Owning Order / Παραγγελία προέλευσης: {Stock ID}** as a link. Shown even if this Order is now cancelled or otherwise ineligible, and when an Export MRN exists. |
| 5 | No entry, user lacks create authority | **No card.** |
| 6 | No entry, Order eligible under FRO-319 | **Create Customs Storage Entry / Δημιουργία Δελτίου Εισόδου**. |
| 7 | No entry, Order not eligible | Create **disabled** with the first applicable reason below. |

**Disabled reasons** (checked in this order):

| Reason code | EN | EL |
| -- | -- | -- |
| Cancelled | This Order is cancelled. | Η παραγγελία είναι ακυρωμένη. |
| Not Customs Storage (incl. Greece = No) | The Order's customs regime is not Customs Storage. | Το τελωνειακό καθεστώς της παραγγελίας δεν είναι Τελωνειακή Αποθήκευση. |
| Not admitted | The Order has not been admitted to a Customs Storage warehouse yet. | Η παραγγελία δεν έχει παραληφθεί ακόμη σε αποθήκη Τελωνειακής Αποθήκευσης. |
| Admitted under another Order | Goods were admitted under Order {Stock ID}. Create the entry from that Order. | Τα εμπορεύματα παραλήφθηκαν με την παραγγελία {Stock ID}. Δημιουργήστε το δελτίο από εκείνη την παραγγελία. |

{Stock ID} in the last reason links to the admitted Order's Details. The page never selects that Order automatically.

Eligibility and the reason code come from FRO-319's server-side eligibility read for one Order — the same check creation runs. The client does not derive eligibility from regime, warehouse stays, Shipment, invoices, ΚΤΑ or VAT. Missing Supplier Invoices, Export or Supplier never disable Create; the Supplier Invoice shortcut's Supplier prerequisite ([FRO-349](https://linear.app/front-line-ltd/issue/FRO-349)) does not apply here.

## Split Orders

* **Covered child** (split after the admission of an Order that has an entry, including grandchildren and children created before the entry): state 4, Open, with the owning Order shown. Opening never relinks the entry or changes its owner, quantities, invoices or Export.
* **Child split after admission when no entry exists yet** (e.g. the IN_STOCK child created by Shipment-preparation partial selection, which keeps the parent's stock time): Create disabled with **Admitted under another Order**. Once the entry is created from the admitted Order, the child shows Open.
* **Split before admission:** parent and child follow the ordinary rules independently.
* Shared family root, similar Stock ID, same Shipment or equal MRN never establish coverage.

## Navigation

| Action | Behavior |
| -- | -- |
| **Create** | Same tab. Opens FRO-353 with this Order's record ID preselected and the Order as return context. Preselection runs FRO-353's normal selection flow; the operator may still change the Order. Opening creates nothing. |
| **Open** | Same tab. Opens that entry's FRO-354 page with this Order (the child, when inherited) as return context. Read-only; records no event. |
| **Cancel creation** | FRO-353's discard confirmation, then back to the originating Order. Nothing created; the Order is unchanged. Dismissing the confirmation keeps the draft. |
| **Successful creation** | Lands on the new entry's FRO-354 page with **Back to Order {Stock ID} / Επιστροφή στην παραγγελία {Stock ID}** to the originating Order. |
| **Return to Order Details** | The card re-fetches its state; Create becomes Open once an entry exists. |
| **Concurrent creation** | When another operator created the entry first, FRO-319 rejects the submission; FRO-353 keeps the draft and shows the existing entry with an authorized Open link. No overwrite and no false success. |
| **Leaving dirty Order Details** | FRO-326's unsaved-changes confirmation applies before Create or Open navigates. |

Identity is always the Order's record ID from the page, never parsed from Stock ID text, split suffixes, Shipment or invoice values. A missing or inaccessible Order or entry shows the target page's not-found/denied state; it never falls back to a blank or different Order. Return never targets a record the user cannot open.

## Acceptance criteria

1. Users without Customs Storage Entry view authority, including all partner users, see no card and trigger no lookup.
2. Loading shows no usable button; a failed lookup shows the error text and Retry and never offers Create.
3. An Order owning an entry, and its covered child and grandchild, all show Open to the same entry ID with the entry number; covered Orders also show the owning Order link. This holds with an Export MRN recorded and for a cancelled covered child.
4. An eligible Order without an entry shows Create for users with create authority; view-only users see no card when there is no entry and Open when there is one.
5. Ineligible Orders show Create disabled with the first applicable reason in EN/EL, in the order cancelled → not Customs Storage → not admitted → admitted under another Order. The last reason links to the admitted Order.
6. A post-admission child whose admitted Order has no entry cannot create one; after the entry is created from the admitted Order, the child shows Open.
7. Missing invoices, Export or Supplier never disable Create.
8. Create opens FRO-353 in the same tab with the exact Order preselected; Cancel returns to the Order with nothing created; success lands on the new entry's FRO-354 page with Back to Order; returning refreshes the card to Open.
9. A concurrent duplicate is rejected by the server with the draft kept and the existing entry offered.
10. The card is the fourth standalone card after Create supplier invoice, in EN/EL, keyboard accessible and wrapping at 375–400px; the other Available actions cards are unchanged.

## Decisions

| Decision | Reason |
| -- | -- |
| Existing entry wins over every ineligibility reason | A covered or later-cancelled Order must still reach its entry. |
| Post-admission child without an entry cannot create one; reason names the admitted Order | FRO-319 ties the entry to the first admission; the Shipment-preparation child copies the parent's stock time and would otherwise pass a naive admission check. |
| No automatic preselection of the admitted Order | Avoids silently creating an entry for a different Order than the one the operator opened. |
| Eligibility and reason from a server read | One rule shared with creation validation; the client never re-implements FRO-319. |
| No card without view authority, or without create authority when no entry exists | The card offers nothing to these users; partners must not learn that entries exist. |
| After creation, land on the new entry | The operator sees the saved entry and its number; Back to Order keeps the origin. |
| Card shows entry number and, when inherited, the owning Order | Lets the operator confirm which entry and which admission covers this Order. |
| FRO-326 is blocked by this ticket | FRO-326 is UI-only and waits for all structural Order work (team policy). |

## Out of scope

Entity or backend rules (FRO-319), the creation and details pages themselves (FRO-353 / FRO-354), card styling (FRO-326), list, register and printing (FRO-358), entry cancellation/reissue, changes to other Available actions, automatic entry creation, Order field or status changes, new UI or preview.

## Context for agents

Live repository `Frontline-Forwarding/frontline-forwarding`, reviewed through authenticated `gh` at main **5c51030680c9d45b3827a7e19b8320c19aa5ed9a** on 27 October 2026. The Customs Storage Entry, its authorities and lookups do not exist yet; [FRO-356](https://linear.app/front-line-ltd/issue/FRO-356) (customs regime, warehouse licences, storage admission) is on unmerged branch `chriskazakos/fro-356-order-customs-regime`.

| Source | Implementation context |
| -- | -- |
| Branch `mock/fro-326-order-details-ui` — `frontline-forwarding-client/src/features/purchase-orders/components/order-reviewed-actions.tsx` | `OrderDocumentAction` (kind `entry`) already renders states `loading` / `error` / `denied` (no card) / `create` / `open` / `disabled` and an **Owning Order** caption. Labels still say "Entry Note" — rename to Customs Storage Entry; add the entry number and the reason table above. |
| Main — `src/features/purchase-orders/components/purchase-order-detail.tsx` | Current Order Details and **Available actions** section; FRO-326 replaces its layout. |
| `docs/workflows/purchase-order-colli-journey.md` | Manual splits only in PENDING / EXPECTED_READINESS / READY; Shipment-preparation partial selection creates an IN_STOCK child that keeps arrival, stock time and storage position. |
| `docs/architecture/authorization.md` | `PURCHASE_ORDER_VIEW` gives client, supplier and agent users participant-scoped Order reads, so the card must check Customs Storage Entry authority itself. |
| FRO-319 | Lookup by Order returns entry, owning Order and direct/inherited provenance; creation-eligibility read returns eligible or a reason code with the admitted Order where applicable. Use those contracts; do not invent endpoint or authority names. |

Gotcha: FRO-355 is milestone 0.0.11 and blocks FRO-326 (0.0.5); release planning must resolve the gap — this ticket does not change milestones. The attached ChatGPT-hosted preview needs a sign-in, predates eligibility, inherited coverage and the rename, and is historical reference only.

## Post-deployment verification (read-only)

| Criteria | Check |
| -- | -- |
| 1 | Open an Order as a client, supplier or agent test user; confirm no card and no Customs Storage Entry request in the network log. |
| 2 | Review staging evidence for loading and failed-lookup states; confirm no Create on failure. |
| 3, 6 | Open seeded owning Order, covered child, grandchild, cancelled covered child and a post-admission child without an entry; compare card state, entry ID/number and owning Order link. |
| 4 | Open an eligible Order without an entry as an operator and as a view-only staff user. |
| 5, 7 | Open seeded cancelled, non-Customs-Storage, not-admitted and no-invoice Orders; compare reasons in EN and EL. |
| 8 | Click Create, compare the preselected Order, press Cancel without submitting and confirm the return; click Open and Back. Review staging evidence for post-creation landing and refresh. |
| 9 | Review staging evidence for concurrent duplicate rejection. |
| 10 | Compare card order and layout with the other Available actions cards in EN/EL, by keyboard and at 400px. |

Production checks are read-only: never submit a creation.

**Reference:** [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319) (rules and lookups — blocks this) · [FRO-353](https://linear.app/front-line-ltd/issue/FRO-353) (creation page — blocks this) · [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354) (details page — blocks this) · [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) (host page — blocked by this) · [FRO-349](https://linear.app/front-line-ltd/issue/FRO-349) (shortcut pattern).
