# FRO-319 patch — Order search eligibility, field limits, per-invoice currency (from FRO-353 Q1/Q9/Q10)

Status Todo, labels entry note/Backend/Story/Ready unchanged. Baseline updatedAt 2026-10-27T08:31:00.211Z.

## Edit 1 — Fields → Entry-owned (four rows)

Before:

| **Entry date & time** | Required date-time | Defaults to the current time in Europe/Athens; editable. Distinct from entry MRN date and printing date. Used as the register date. |
| **Entry MRN** | Optional String | May stay blank until customs registration. No format or uniqueness rule. |
| **Entry MRN date** | Optional date |  |
| **Tariff classification code (δασμολογική κλάση)** | Number (digits only), stored as text | Preserve leading zeros. Distinct from the goods description. |
| **Goods description** | Free text | Description for printed copies. The only free-text descriptive field; no separate Notes field. |

After:

| **Entry date & time** | Required date-time | Defaults to the current time in Europe/Athens; editable; not later than the current time. Distinct from entry MRN date and printing date. Used as the register date. |
| **Entry MRN** | Optional String, ≤ 500 characters | May stay blank until customs registration. No format or uniqueness rule. |
| **Entry MRN date** | Optional date | Not later than today in Europe/Athens. |
| **Tariff classification code (δασμολογική κλάση)** | 1–10 digits, stored as text | Preserve leading zeros. Distinct from the goods description. |
| **Goods description** | Free text, ≤ 2,000 characters | Description for printed copies. The only free-text descriptive field; no separate Notes field. |

## Edit 2 — Fields → text after the entry-owned table

Before:

Prefilled values are saved on the note at creation. Later warehouse or company changes and Change Order do not rewrite them.

After:

Prefilled values are saved on the note at creation. Later warehouse or company changes and Change Order do not rewrite them. Transport means, permit number, operator name, operator ΑΦΜ and warehouse address accept at most 500 characters each.

## Edit 3 — Derived → Supplier Invoices row

Before:

number, date, Supplier, type, currency, net value, actual VAT (€0) and per-invoice Statistical VAT.

After:

number, date, Supplier, type, currency, net value, actual VAT (0) and per-invoice Statistical VAT, each amount in that invoice's own currency.

## Edit 4 — Statistical VAT bullets

Before:

* **Per invoice:** 24% × that invoice's net value, rounded to 2 decimals, decimal half-up.

After:

* **Per invoice:** 24% × that invoice's net value, rounded to 2 decimals, decimal half-up, in that invoice's currency. Shown for every matching invoice, including non-EUR ones.

Before:

* No value when there are no matching invoices or the currency rule fails. A known zero net total gives zero.

After:

* No entry total when there are no matching invoices or the currency rule fails. A known zero net total gives zero.

## Edit 5 — Access → Retrieval (append)

Before (end of paragraph):

using the same check as creation, within the caller's access.

After:

using the same check as creation, within the caller's access. **Order search for entry creation** takes the existing Order search text (Stock ID, message number, owner and supplier reference, vessel name, colli tracking code) and returns each matching Order with that same eligibility result, so ineligible Orders can be listed with their reason.
