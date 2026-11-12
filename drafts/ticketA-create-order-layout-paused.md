# Ticket A — Create Order & Details field regrouping (paused 2026-11-12)

Paused at grill round 1 (no answers yet). The user was told to wait for the developer's new workspace and will make this ticket with a UI there. Production main checked: 08e3555d8668d931e8df84b035dcf0bfb5e7b30d.

## Already agreed (earlier in the session)
- Groups: (1) Client, Vessel, Supplier, Invoicing company; (2) Owner's ref, Supplier's ref, MSG number; (3) Order status, Expected readiness date, Frontline pickup; (4) Opening warehouse, Greece, Customs regime, ALK; (5) DN import, DN export.
- Urgent on its own row at the top; Urgent information shown only when ticked, optional, not saved when unticked; existing urgent text with Urgent off stays visible read-only on Details.
- Status uses the current field in group 3; FRO-415 later reduces it to Not ready / Ready (no blocking).
- Text-only approach was accepted before the pause; the user now says the ticket will be made "with a UI" in the new workspace. Re-confirm.

## Facts found
- Shipment-inline Order creation reuses PurchaseOrderCreationForm, so it gets the layout automatically.
- Order Details (order-details-card.tsx) has its own view grid and OrdinaryEditor grid (4/2/1 columns), with the status in a nested box at the top, Urgent at the bottom, Current warehouse (not Opening), Readiness remark, and Client/Vessel not editable.
- Existing section-heading typography: `text-heading` (DESIGN.md). UI components in src/components/ui: alert, badge, button, card, choice, combobox, date-picker, input, select, tabs, etc.

## Round 1 questions (recommendations, not decisions)
1. Scope: Create, Shipment-inline create, Details view and edit all use the 5 groups → yes.
2. Details group 4 shows Current warehouse (as today), not Opening → yes.
3. Readiness remark and Order status move into group 3 on Details → yes.
4. Group titles with `text-heading`: Parties/Μέρη, References/Αναφορές, Readiness/Ετοιμότητα, Warehouse & customs/Αποθήκη & τελωνείο, Delivery notes/Δελτία αποστολής → titles.
5. Each group starts a new row; 4/2/1 columns; empty cells allowed → yes.
6. Details: Urgent at the top in view and edit; information only when present / ticked → yes.
7. Unticking Urgent and saving clears the text, shown in Review changes; legacy text with Urgent off untouched → yes.
8. New ticket "Order — regroup Create & Details fields; Urgent at the top"; Order, Story, Frontend, Pending_Review; related FRO-335/326/343/415; no blocking.
