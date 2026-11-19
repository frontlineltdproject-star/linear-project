## Roadmap by AADE phase

| Phase | Mandatory from | What the portal must do | Where |
| -- | -- | -- | -- |
| **A** — digital issuance | In force | Send each 9.3 to myDATA through `SendInvoices` **before** the goods move; keep MARK / UID / QR and print the QR on the PDF. Built. Still to confirm on Railway: production runs with `FRONTLINE_AADE_MYDATA_ENABLED=true` and `FRONTLINE_AADE_MYDATA_BASE_URL=https://mydatapi.aade.gr/myDATA` (the defaults are *off* and the AADE test server) | FRO-247 (Done) |
| **B1** — movement tracking | **1/1/2027** (Α.1198/2026) | Movement status per note, RegisterTransfer / ConfirmDeliveryOutcome when Frontline is the carrier, ConfirmDeliveryReturn, cancellation only while `Registered` | FRO-414 |
| **B2** — item coding | **1/1/2028** (Α.1198/2026) | Every 9.3 line describes the real goods: item code, TARIC / Combined Nomenclature code where available, real description (below) | Not yet ticketed |

### Phase B2 — item coding (from 1/1/2028)

**Today** the note has one line per Order (stock list item / purchase order): `itemCode` = the Order's database id, `itemDescr` = "Stock ID n", `quantity` = number of collis, `measurementUnit` = 1 (pieces). That satisfies Phase A and B1. It will not satisfy B2.

**B2 needs** one line per kind of goods, carrying the item's code, its TARIC code where available, and a real description, following AADE's `InvoicesDoc_detailed.xsd` (ERP API v2.0.2, §5).

**What the portal already holds.** Each Order has **supplier invoice rows** (`freight_purchase_order_invoice_row`), and a split moves its rows to the child Order:

| Column | What it holds | Gap for B2 |
| -- | -- | -- |
| `description` | Required free text | Usable as `itemDescr` |
| `hs_code` | Optional text, leading zeroes kept | Often empty; an HS code can be shorter than a TARIC code |
| `quantity` | Positive whole number | Usable |
| `unit` | `PC` / `SET` / `PKT` | Needs mapping to AADE's `measurementUnit` codes |

**AADE's line fields (ERP API v2.0.2, §5.4).** `TaricNo` is optional and must be **exactly 10 characters** when sent. `itemCode` is free text of up to 50 characters. AADE provides no catalogue of either: TARIC codes come from the EU TARIC tariff, and `itemCode` is the issuer's own code.

**Decision (user, 2026-11-19): manual entry first.** For B2 the portal user enters the item code and the TARIC code by hand. How to fill them automatically (supplier invoices, customs declarations, the EU TARIC lookup, the Helper intake) is researched separately and does not block B2.

**To decide before a B2 ticket:**

1. Read AADE's field-level B2 specification (which line fields become mandatory, validation codes) once it is published. Re-confirm the date: one source says 1/1/2027, and special stock categories may get different dates.
2. Whether the delivery-note lines come from the participating Orders' supplier invoice rows, and what happens to an Order with no invoice rows.
3. Where the manual entry happens (on the Order's invoice rows, or on the delivery note before issuing), and how a TARIC code that isn't 10 characters is handled.
4. How `PC` / `SET` / `PKT` map to AADE's measurement-unit table.

Start this early: capturing the item codes is office work that has to begin well before the XML changes.
