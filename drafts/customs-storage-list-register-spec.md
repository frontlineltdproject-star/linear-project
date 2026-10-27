**As a** customs operator **I want** a Customs Storage section that lists every Customs Storage Entry, prints and exports the active register, and prints the recipient copies of an entry **so that** the office can run the customs storage paperwork from the portal instead of the Excel register.

**Customs Storage Entry (Δελτίο Εισόδου)** is the record defined by <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules">FRO-319</issue>: one Order's storage admission under **Τελωνειακή Αποθήκευση (Customs Storage)**, followed until its export is declared. FRO-319 owns the data, the active-case rule and the 18-column register data; this ticket owns the list screen, the register outputs and the recipient-copy prints. Creation and details pages belong to <issue id="9c0dee70-4bb0-4e72-8ee1-e3c58fab1bba" href="https://linear.app/front-line-ltd/issue/FRO-353/entry-note-creation-page-ui">FRO-353</issue> and <issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue>. **Order = purchase order = stock-list item.**

**Design round required.** No canvas or preview exists yet. Before implementation, run the ticket workflow's design step (canvas + Cloudflare Pages preview) for the list, the register print and the multi-invoice recipient copy, and attach the approved preview here.

## Section and list

New menu entry **Customs Storage / Τελωνειακή Αποθήκευση**, containing the **Customs Storage Entries** list.

| Column | Source (FRO-319) |
| -- | -- |
| **Number** | Entry number |
| **Date** | Entry date |
| **Stock ID** | Owning Order |
| **Depositor (Αποθέτης)** | Order Invoicing company; blank and marked when missing |
| **Supplier** | Order Supplier; blank and marked when missing |
| **Entry MRN** | Entry MRN |
| **Invoice numbers** | All matching Supplier Invoice numbers |
| **Export MRN** | MRN of the Export holding the matching invoices |

* **Search** by entry number, Stock ID, depositor, Supplier, invoice number, entry MRN or Export MRN.
* **Active cases only** filter, using FRO-319's active-case rule. No status column, badge or selector.
* Entries stay in the list after an Export MRN is recorded.
* **Create Customs Storage Entry** opens FRO-353 with no Order selected. Clicking a row opens FRO-354.
* States: loading, empty (no entries), no results for the search/filter, load error with **Retry**.

## Active register — print and Excel

Two buttons on the list: **Print active register** and **Download active register (Excel)**. Both use FRO-319's active-register data: one row per active entry, all 18 Greek headings in FRO-319's order, regardless of entry month and independent of the list's search or filter.

| Output | Rules |
| -- | -- |
| **Print / PDF** | Landscape; all 18 columns across one page width, as many pages down as needed. Never clip or drop invoice numbers to fit a row. A cell left blank for a known reason (missing depositor/Supplier, unknown gross weight, currency rule) carries a marker, explained in a legend at the end. |
| **Excel (.xlsx)** | Sheet 1: exactly the 18 columns, blank cells left blank. Sheet 2 **"Ελλείψεις"** (missing data): one line per entry and missing item. |

With no active entries, both outputs show an empty register with headings only.

## Recipient copies — Print entry

From the entry (FRO-354), **Print** offers five choices, laid out like the historical templates attached to <issue id="d46a5eda-1eec-40cd-845a-9fda311edd3b" href="https://linear.app/front-line-ltd/issue/FRO-248/customs-warehousing-deltia-telwneiakhs-apo8hkeyshs">FRO-248</issue>:

* **Όλα τα Αντίτυπα** — all four copies below in one PDF;
* **Για τον αποθέτη - αγοραστή**;
* **Για τον πωλητή**;
* **Για τον Διαχειριστή της αποθήκης τελωνειακής αποθήκευσης - κάτοχο της άδειας**;
* **Για το Τελωνείο Ελέγχου**.

| Printed item | Source |
| -- | -- |
| Title phrase **«Δελτίο Εισόδου εγχώριων εμπορευμάτων σε καθεστώς τελωνειακής αποθήκευσης»** | Fixed |
| **Ημερομηνία** and the manager's date | Printing date (not the entry date or entry MRN date) |
| Entry number, entry MRN / date | Entry |
| Depositor / ΑΦΜ, Supplier / ΑΦΜ | FRO-319 derived parties |
| Permit number, warehouse operator name / ΑΦΜ / address, Transport Company | Entry's saved values |
| **Μεταφορικό μέσο / αριθμός** | Entry |
| Goods section | Entry's **Goods description** (never the tariff code) |
| Collis, gross weight | Admitted totals; gross weight printed as unknown when unknown |
| Invoices | **Every** matching invoice (number, date, net value), continuing on extra lines or a second page. Never only the first. |

Each print is generated from the entry's current data. No issued copy, print history or attachment is stored.

## Access and language

Staff-only, using FRO-319's Customs Storage Entry view authority; partner users never see the section, list or outputs. Screens are EN/EL; printed documents and register headings are Greek only.

## Decisions

| Decision | Reason |
| -- | -- |
| Keep the five recipient-copy choices and the historical template layout | Same documents the office and customs already use. |
| All invoices on recipient copies | An entry can have four or more invoices; printing one would misstate the document. |
| Prints generated from current data; nothing stored | Same approach as the Export ΥΔ documents; warehouse values are already frozen on the entry. |
| Register as PDF and Excel | PDF for printing; Excel matches the register the office keeps today. |
| Marked blanks in PDF; "Ελλείψεις" sheet in Excel | Explains blank cells without changing the 18-column layout. |
| "Active cases only" filter, no status badge | FRO-319 has no status field; active is a query. |
| Section named Customs Storage / Τελωνειακή Αποθήκευση | Names the regime; "Customs Warehousing" is Αποταμίευση in the code. |

## Out of scope

Exit (Εξόδου) and Transfer (Μεταβίβασης) notes. Creation and details pages (FRO-353 / FRO-354). Storing issued prints, print history or attachments on entries. Entry cancellation or reissue. Historical month-end registers and workbook import. Changes to FRO-319's data rules.

## Acceptance criteria

1. The Customs Storage menu entry opens the list with the eight columns; search and **Active cases only** work, and entries with an Export MRN remain listed.
2. Create opens FRO-353 with no Order; a row opens FRO-354; loading, empty, no-results and error/Retry states work.
3. **Print active register** produces a landscape PDF with all 18 columns in order, one row per active entry, full invoice numbers, multi-page as needed, with marked blanks and a legend.
4. **Download active register (Excel)** produces an .xlsx with the 18 columns on sheet 1 and the "Ελλείψεις" sheet; with no active entries, both outputs contain headings only.
5. Each of the five recipient-copy choices prints the listed values from their sources; "Όλα τα Αντίτυπα" contains all four copies; an entry with four or more invoices prints them all.
6. Printed dates are the printing date; the goods section uses the goods description; unknown gross weight prints as unknown.
7. Partner users cannot reach the section, list, register or prints; staff with the view authority can. Screens work in EN and EL; prints are Greek.
8. The approved design preview is attached before implementation starts.

## Context for agents

Live production repository `Frontline-Forwarding/frontline-forwarding`, checked with `gh` at main **5c51030680c9d45b3827a7e19b8320c19aa5ed9a** on 27 October 2026.

| Source | Implementation context |
| -- | -- |
| `docs/workflows/delivery-note.md` — PDF rendering | Existing Thymeleaf/OpenHTML PDF service with an explicitly registered Unicode font for Greek; reuse it for the register and recipient copies. |
| `frontline-forwarding-app/build.gradle` | `openhtmltopdf-pdfbox` is present; there is no Excel library. Producing .xlsx needs a new dependency or another approach chosen by the developer. |
| `frontline-forwarding-client/src/features/` | Existing feature folders (purchase-orders, shipments, warehouses…); the Customs Storage section is new. |
| FRO-353 attachment "Deferred list, printing and other note-type UI — reference only" | Earlier list/print requirements; superseded by this ticket where they differ (Exit/Transfer removed, no stored issued copies). |
| FRO-248 attachments | Historical recipient-copy templates. Do not copy real customer data into a preview. |

## Post-deployment verification

Read-only checks with staff and partner test users against seeded entries. Never create or edit production entries to verify this ticket.

| Criteria | Read-only check |
| -- | -- |
| 1–2 | Open the section; compare list columns with the seeded entries; apply search and Active cases only; open Create and a row; check empty and error states in a test environment. |
| 3–4 | Generate both register outputs; compare rows, column order, invoice numbers, flagged blanks and the "Ελλείψεις" sheet with FRO-319's register data. |
| 5–6 | Print each recipient-copy choice for a seeded four-invoice entry and an unknown-weight entry; compare printed values with the entry. |
| 7 | Request the list and outputs as a partner test user and confirm denial; switch EN/EL as staff. |
| 8 | Confirm the approved preview link is attached. |

**Reference:** <issue id="2e1f0309-6e88-4c7d-b5b9-9e291674cc25" href="https://linear.app/front-line-ltd/issue/FRO-319/entry-note-entity-and-business-rules">FRO-319</issue> (data and register contract — blocks this ticket); <issue id="9c0dee70-4bb0-4e72-8ee1-e3c58fab1bba" href="https://linear.app/front-line-ltd/issue/FRO-353/entry-note-creation-page-ui">FRO-353</issue> / <issue id="077969b1-0307-471e-9844-265afd4fc0d7" href="https://linear.app/front-line-ltd/issue/FRO-354/entry-note-details-page-ui">FRO-354</issue> (pages); <issue id="d46a5eda-1eec-40cd-845a-9fda311edd3b" href="https://linear.app/front-line-ltd/issue/FRO-248/customs-warehousing-deltia-telwneiakhs-apo8hkeyshs">FRO-248</issue> (historical templates).
