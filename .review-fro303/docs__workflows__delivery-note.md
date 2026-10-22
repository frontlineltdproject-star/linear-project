# Delivery notes

A delivery note is a fiscal goods-movement document derived from one shipment
for one invoicing company. Selecting several shipments never merges their
contents: the system creates one draft for every distinct
`(shipment, invoice company)` pair.

Authorized operators can select one or more `PREPARING` shipments from the
shipment list and prepare their delivery-note drafts together. Each selected
shipment still runs its own idempotent preparation command; shipments already
in movement are not selectable for new fiscal drafts.

Preparation compares the planned invoicing-company groups with the shipment's
current notes and creates only missing pairs. This preserves existing notes
while allowing a cancelled company-specific note to be replaced in a
multi-company shipment.

## Draft composition

Shipment participation is the source of truth. Participating purchase orders
are grouped by `invoice_company_id`. Every participating PO must have an
invoice company, and one note cannot contain POs for different vessels.

The printed goods table has one line per participating PO:

- `AA` is the one-based line number;
- `ΠΕΡΙΓΡΑΦΗ ΑΓΑΘΩΝ` (Stock ID) is `freight_purchase_order.id`, not
  `internal_number`;
- quantity is the number of current nonterminal collis in the PO;
- weight is the sum of those collis' declared gross weights.

Terminal collis remain traceable on their PO but are excluded from quantity and
weight. A missing gross weight contributes zero without removing the colli from
the quantity.

The recipient name and fiscal details are copied from the invoicing company's
profile when the draft is created. Company profiles expose profession, VAT
number, tax office, street, street number, city, and postal code so operators
can maintain the data used by fiscal documents. These values are part of the `Company`
aggregate returned by the company repository as well as the company API fiscal
details block. Source address fields are optional even for invoice companies;
new recipient snapshots compose their street and number into the existing
recipient address field. Changes to source records never refresh existing note
snapshots. See [company and warehouse addresses](company-and-warehouse-addresses.md).
Draft creation rejects an invoicing company with incomplete
required fiscal details instead of producing a PDF with blank recipient rows;
the tax office is optional only for foreign tax registrations.

## Draft editing

While all notes for a shipment remain in `DRAFT`, operators edit their common
issue place, movement start, vehicle number, movement purpose, loading and
destination addresses, notes, and related document number once. The
shipment-level command applies those values atomically to every current note
and requires the expected version of each note, so stale or partial updates are
rejected. The shipment, recipient snapshots, vessels, goods lines, and computed
totals are not editable through this command.

The shipment view renders one status-and-actions card per invoicing company.
Each draft card owns its PDF preview and issuance actions. Once any note leaves
`DRAFT`, the shared editing form is hidden, while any remaining draft cards
retain their individual preview and issuance actions. Issued cards instead
expose their stored fiscal details and applicable post-issuance actions.

The REST route also verifies that the delivery note belongs to the shipment in
the route. Once a note leaves `DRAFT`, the draft update command rejects it.

Movement purpose is stored as the AADE code represented by
`DeliveryNoteMovementPurpose`, not as operator-entered text. The selectable
codes follow the myDATA v2.0.1 movement-purpose table: 1–5, 7–14, 19, and 20,
excluding the values that AADE does not currently accept (6 and 15–18). Code 19
requires an additional free-text description; that description is cleared for
every other code.

Loading and delivery addresses use the AADE `AddressType` structure: street,
number, postal code, and city/area. New drafts default the loading address to
`ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 45, 18540 ΠΕΙΡΑΙΑΣ`; operators can correct it before
issuance. All four address fields are required by the portal even though AADE
marks street and number as optional in its transport payload.

## PDF rendering

Every authorized delivery note can be rendered through
`GET /api/v1/shipments/{shipmentId}/delivery-notes/{deliveryNoteId}/pdf`.
The route verifies both identifiers before rendering and returns the PDF inline
for browser preview. Draft PDFs have no issue date or fiscal number and are
marked `ΠΡΟΣΧΕΔΙΟ`.

The PDF uses the existing Thymeleaf/OpenHTML rendering service and follows the
Frontline delivery-note template. It prints the recipient fiscal snapshot,
structured route addresses, AADE movement-purpose label, one Stock ID line per
PO, vessel, totals, notes, related document, and fiscal response fields.
Quantity in words is derived from the total collis in uppercase Greek. A
Unicode font is registered explicitly so Greek text renders consistently in
development and the container image.

## Fiscal lifecycle and numbering

Drafts have no fiscal number. Issuance snapshots the recipient, route, lines,
totals, and submitted XML. Issued fiscal content is immutable; correction
requires cancellation and a replacement.

The submission payload follows the official myDATA v2.0.2 `InvoicesDoc`
contract and contains exactly one type 9.3 invoice. It transmits the Greek
issuer and recipient VAT numbers, planned dispatch date/time and vehicle,
movement purpose, loading and delivery addresses, and one zero-value,
VAT-neutral item row per delivery-note PO. Type 9.3 submissions include both
party names and structured addresses because AADE validates them as mandatory
for this document type. The issuer uses its recorded street and number directly.
The recipient uses the retained combined snapshot: a trailing street number is
transmitted separately when it can be parsed; otherwise the complete trimmed
address is sent as the street and the optional party number is omitted. Each
item uses the PO legacy database id as `itemCode`, the colli count as `quantity`,
AADE measurement unit 1 (pieces), and the required type 9.3 income classification
category `category3` without an E3 classification type.

Numbering is scoped by issuer and series and serialized through
`delivery_note_number_counter`. The database identity is not the printed fiscal
number. Allocating the number, snapshotting the exact XML, and moving the draft
to `SUBMISSION_PENDING` occur in one database transaction. A failed or
interrupted transmission retains its allocated number and payload so later
numbers never conceal a gap. The normal series defaults to `Θ'` and can be
overridden server-side with `FRONTLINE_DELIVERY_NOTE_SERIES`. The local AADE
test launcher generates a fresh series on each run because the development
database resets local counters while AADE's test environment retains previously
accepted UIDs. An accepted issuer/date/series/number identity must never be
reused, even after cancellation.

Issuance sends that persisted snapshot to AADE `SendInvoices` as an individual
request. A successful response moves the note to `ISSUED` and stores its MARK,
UID, and QR URL. An explicit AADE rejection moves it to `SUBMISSION_FAILED`,
stores the safe rejection message in `submission_error`, and retains the
allocated number and submitted XML. A transport failure has an uncertain
outcome and therefore leaves the note in `SUBMISSION_PENDING`: retrying the
issuance command queries `RequestTransmittedDocs` for the persisted
date/series/number/recipient identity and stores the accepted MARK, UID, and QR
URL when found, without resubmitting the invoice. If AADE has not yet exposed
the document, the command remains blocked for later reconciliation. A local
persistence failure after AADE acceptance follows the same reconciliation
path. The failed company-specific card displays a confirmed rejection reason
to the operator.
The shipment view presents the stored issuance timestamp, MARK, UID, AADE QR
link, and PDF action together on the issued note. Authorized cancellation is
available from the same issued-note panel.

Cancellation is available only for an `ISSUED` note. The command first locks
the stated note version in `CANCELLATION_PENDING`, then calls AADE
`CancelInvoice` with the original MARK. A successful response stores the
returned cancellation MARK and moves the note to `CANCELLED`. If AADE rejects
the cancellation or the request fails, the note returns to `ISSUED`, records
the error, and remains eligible for a deliberate retry.

After confirmed cancellation, the client immediately runs the idempotent
preparation command to create the missing replacement draft. If that secondary
step fails, cancellation remains successful and the operator receives a
separate warning; retrying preparation cannot duplicate the other current
notes.

The integration is disabled by default. `FRONTLINE_AADE_MYDATA_ENABLED`,
`FRONTLINE_AADE_MYDATA_BASE_URL`, `FRONTLINE_AADE_MYDATA_USER_ID`, and
`FRONTLINE_AADE_MYDATA_SUBSCRIPTION_KEY` are server-only settings. Connect and
read timeouts default to 10 and 30 seconds and can be overridden with
`FRONTLINE_AADE_MYDATA_CONNECT_TIMEOUT` and
`FRONTLINE_AADE_MYDATA_READ_TIMEOUT`. The default base URL is AADE's test
environment; production must explicitly replace it. Credentials are sent only
in the required `aade-user-id` and `ocp-apim-subscription-key` request headers.

The current issuance command deliberately accepts only Greek issuer and
invoice companies. The issuer company must have a VAT number matching the
entity registered for the configured AADE credentials. Foreign parties require
an ISO country code in the company model before their AADE XML can be generated
safely.

Lifecycle states are:

`DRAFT -> SUBMISSION_PENDING -> ISSUED -> CANCELLATION_PENDING -> CANCELLED`

`SUBMISSION_FAILED` retains its allocated number and payload for correction or
retry. A failed cancellation returns to `ISSUED`; it does not create a
cancelled local record without AADE confirmation.

## Authorization

Access is restricted to Frontline and system-administrator users. Frontline
operators may view, create, and issue notes. Cancellation additionally requires
`DELIVERY_NOTE_CANCEL`, granted to Frontline managers and system administrators.

