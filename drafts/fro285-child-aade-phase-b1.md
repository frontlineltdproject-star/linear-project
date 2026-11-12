**As a** Frontline operator **I want** every issued δελτίο αποστολής (delivery note, AADE type 9.3) to follow AADE's digital movement tracking **so that** Frontline is compliant when Phase B1 becomes mandatory on **1/1/2027**, and the office can see whether each delivery closed correctly and who closed it.

## Context

Decision **Α.1198/2026** (ΦΕΚ Β 5905/30.09.2026) makes Phase B1 of the digital delivery note mandatory from **1/1/2027**: loading, μεταφόρτωση (transhipment), receipt and quantity check are recorded in myDATA. Phase B2 (unified item coding, TARIC) follows on **1/1/2028** and is not part of this ticket.

AADE published the contract as **myDATA v2.0.2** (September 2026; both official PDFs are attached below). After issuance, every 9.3 note now has an AADE movement status:

`Registered → InTransit → DeliveredByCarrier → Completed`, plus `Rejected`, `FailedDelivery`, `InTransit (Return)` and `Cancelled`.

The portal issues, prints and cancels 9.3 notes today, but it knows nothing about these movement states.

| AADE call | Called by | What it does |
| -- | -- | -- |
| **RegisterTransfer** | Carrier | Declares loading / start of movement (or transhipment). Needs `vehicleNumber`, `transportType` (1–7), `carrierVatNumber`; optional `packingsDeclaration`. Moves the note to **InTransit** |
| **ConfirmDeliveryOutcome** | Carrier or recipient | Carrier declares `FULL` / `PARTIAL` / `NONE`; recipient confirms receipt → **Completed** |
| **RejectDeliveryNote** | Recipient only | Full rejection → **Rejected** |
| **ConfirmDeliveryReturn** *(new in v2.0.2)* | Issuer only | Closes a note after Rejected, partial delivery or FailedDelivery → **Completed** |
| **GetDeliveryNoteStatus** | Issuer, recipient, carrier | Current status + `lifecycleHistory` (each event has `eventType`, `eventTimestamp`, `actorVat`) |
| **CancelInvoice** | Issuer | Cancels the note — **only while it is `Registered`**; AADE rejects it once the movement has started |

## Scope

1. **Movement status on the note.** Read and store AADE's movement status for every issued note (`GetDeliveryNoteStatus` by MARK) and show it on the Shipment's delivery-notes card, with the time and the **ΑΦΜ (VAT number) of whoever made the last event**, so the office sees *"Completed — confirmed by recipient / by carrier / by Frontline"*. A **Refresh status** action re-reads it on demand.
2. **Frontline as carrier → RegisterTransfer.** When Frontline itself moves the goods, the operator registers loading for the note(s): vehicle number, transport type, carrier = Frontline's ΑΦΜ, optional package declaration. When a third-party carrier moves them, the portal only reads the status — the carrier registers loading in its own system.
3. **Frontline as carrier → ConfirmDeliveryOutcome.** When Frontline is the carrier, the operator can declare the delivery outcome (`FULL` / `PARTIAL` with delivered packages / `NONE`).
4. **Issuer close-out → ConfirmDeliveryReturn.** For a note in `Rejected`, partial delivery or `FailedDelivery`, the operator can close it after the goods come back.
5. **Cancellation follows AADE.** **Cancel** is offered only while AADE status is `Registered`. Once the movement has started, the card explains why it can no longer be cancelled instead of sending a request AADE will refuse.

## Decisions

| Decision | Reason |
| -- | -- |
| This ticket is a child of FRO-285 and covers only what Phase B1 makes mandatory on 1/1/2027 | FRO-285 is the umbrella. It was written before v2.0.1 / v2.0.2, and this ticket carries the current contract and deadline |
| Frontline can be **either** the carrier or not, per movement (user, 2026-11-12) | Some deliveries go with Frontline's own vehicles, others with third-party carriers. The portal must support RegisterTransfer / ConfirmDeliveryOutcome as carrier and must also work in read-only mode for third-party carriers |
| The office needs to know **whether** a note closed and **who** closed it, not to control who closes it (user, 2026-11-12) | Shown from `GetDeliveryNoteStatus` → status + last event's `actorVat` |
| Priority High, due 2026-12-31 | Phase B1 is mandatory from 1/1/2027 |

## Open questions — answer before Ready

1. **`nonObligatedRecipient` / `withoutDigitalTransportTracking`.** These are header flags Frontline sets **at issuance**, and they cannot both be true. With neither flag, a B2B note only reaches `Completed` when the recipient confirms. With `nonObligatedRecipient`, the carrier's `FULL` closes it. With `withoutDigitalTransportTracking`, the note is `Completed` on issuance and is never tracked. Which recipients (e.g. foreign companies, vessels) need which flag is a tax/legal decision → **ask the accountant**. Until it is answered, notes are sent without either flag (today's behaviour).
2. **When is RegisterTransfer sent for Frontline-carried notes?** Options: an explicit **Register loading** action per note, or automatically when the Shipment is **dispatched**. Which transport type (1–7) applies by default per shipment mode?
3. **Where does the carrier's ΑΦΜ come from** when Frontline is the carrier — the issuer company's VAT number, or a separate setting?

## Acceptance criteria

* Every `ISSUED` note shows its AADE movement status, the time of the last event, and the ΑΦΜ of the party that made it. **Refresh status** updates it without resubmitting or cancelling anything.
* A note carried by Frontline can be registered as loaded. AADE returns a `transferMark`, the portal stores it, and the status becomes `InTransit`. A missing vehicle number or transport type is refused before calling AADE.
* A note carried by Frontline can receive a delivery outcome. `PARTIAL` requires the delivered packages (AADE error 814 otherwise).
* A note in `Rejected`, partial delivery or `FailedDelivery` can be closed with **ConfirmDeliveryReturn**. AADE returns a `deliveryReturnMark` and the status becomes `Completed`.
* **Cancel** is available only while AADE status is `Registered`. In any other status the card states that the movement has started and the note can no longer be cancelled.
* Every AADE call is an explicit, permission-checked command. It stores the request/response marks and appends an audit entry. A confirmed AADE rejection (statusCode `ValidationError`, codes 800–834) is distinguished from a transport failure, which leaves the outcome unknown and is checked with `GetDeliveryNoteStatus`, never by repeating the call blindly.
* Everything is exercised end to end against `https://mydataapidev.aade.gr` before production is enabled.

## Out of scope

* **Phase B2** (1/1/2028): item coding / TARIC and real item descriptions on 9.3 lines (today `itemDescr` = "Stock ID n").
* **GenerateGroupQRCode / RequestGroupQRDetails** (one QR for several notes) — stays in FRO-285.
* Receiving-note types 10.1 / 10.2 and reverse delivery notes (`reverseDeliveryNote`).
* The read-only Delivery Notes list/details page (FRO-361). Adding the movement status there is a follow-up.
* Changing who the recipient is, the origin restriction (FRO-357), or the failed-submission and cancelled-note decisions (FRO-284, FRO-283).

## Affected systems

| Area | Current behaviour (source) | Required outcome |
| -- | -- | -- |
| `freight_delivery_note` table | Stores status, MARK, UID, QR URL and cancellation MARK. No movement status, no transfer / outcome / return marks, no carrier details (`docs/reference/database.md`) | Stores AADE movement status, the last-event time and actor ΑΦΜ, and the marks returned by each Phase B call |
| `RestAadeMyDataClient` | Calls `SendInvoices`, `RequestTransmittedDocs` and `CancelInvoice` only | Adds `GetDeliveryNoteStatus`, `RegisterTransfer`, `ConfirmDeliveryOutcome` and `ConfirmDeliveryReturn` |
| `AadeResponseParser` | Parses MARK / UID / QR URL / `cancelledByMark` | Parses the `ResponseDoc` marks (`transferMark`, `deliveryOutcomeMark`, `deliveryReturnMark`) and `DeliveryNoteStatusResponse` |
| `DeliveryNoteCancellationService` | Cancels any `ISSUED` note via `CancelInvoice` | Refuses cancellation unless AADE status is `Registered` |
| `AadeDeliveryNoteXmlBuilder` | Sends no `nonObligatedRecipient` / `withoutDigitalTransportTracking` | Unchanged until open question 1 is answered |
| `delivery-notes-card.tsx` (Shipment page) | Shows issued time, MARK, UID, QR link, PDF, Cancel | Shows movement status + actor, Refresh status, Register loading, Delivery outcome and Close return actions, and Cancel only while `Registered` |
| GraphQL / REST / MCP delivery-note operations | Issue, cancel, check submission / cancellation status | One explicit command per AADE call, through the same service in all three adapters |
| Shipment lifecycle | Dispatch doesn't touch delivery notes (`docs/workflows/shipment-lifecycle.md`) | Unchanged unless open question 2 picks "on dispatch" |

## Context for agents

* Production `main` at `08e3555` (release 0.0.14). The delivery-note workflow is `docs/workflows/delivery-note.md`. The XML is built in `frontline-forwarding-app/.../web/deliverynotes/service/AadeDeliveryNoteXmlBuilder.java` and the HTTP client is `.../system/aade/RestAadeMyDataClient.java`.
* Endpoints: production `https://mydatapi.aade.gr/myDATA/<Method>`, test `https://mydataapidev.aade.gr/<Method>`. Headers are the same as today (`aade-user-id`, `ocp-apim-subscription-key`).
* Business errors come back as **HTTP 200** with `statusCode` `ValidationError` and codes **800–834** (Delivery Note API §6.2), e.g. 800 = RegisterTransfer not allowed in the current status, 801 = cannot cancel in the current movement status, 821 = RegisterTransfer on a cancelled note.
* `dispatchDate` / `dispatchTime` / `vehicleNumber` in the 9.3 header are now the **planned** values (ERP API v2.0.0 changelog). The actual ones are declared by `RegisterTransfer`.
* The movement-purpose codes the portal allows (1–5, 7–14, 19, 20) still match AADE's table 8.14. Codes 6 and 15–18 are no longer accepted.
* `RequestTransmittedDocs` results now also carry `invoiceDeliveryStatus`, `deliveryLifecycle` and `packingsDeclarations`. `AadeResponseParser` matches by local name and takes the first `mark` / `uid` under each `invoice`. That still works because the invoice's own `mark` precedes the lifecycle events' `mark` elements, but it is fragile.
* Status codes (Delivery Note API §7.1): 1 Registered · 2 Cancelled · 3 InTransit · 4 Rejected · 5 DeliveredByCarrier · 7 FailedDelivery · 8 Completed · 9 InTransit (Return). Transport types (§7.4): 1 public truck · 2 private truck · 3 ship · 4 train · 5 aeroplane · 6 other · 7 none. Packaging types (§7.3): 1 pallet · 2 carton · 3 box · 4 barrel · 5 sack · 6 other.

## Post-deployment verification

* Open a Shipment with an issued note in the AADE test environment → the card shows the movement status, the last-event time and the actor ΑΦΜ, and they match a read-only `GET https://mydataapidev.aade.gr/GetDeliveryNoteStatus?mark=<MARK>`.
* For a test note in `InTransit`, the card shows no **Cancel** action and explains why.
* Read the delivery note through the GraphQL or REST read operation → it exposes the stored movement status and the transfer / outcome / return marks recorded during the test run.
* Read the Shipment's audit history (read-only) → each Phase B call made during the test run appears with its mark or error.

**Reference:** myDATA Delivery Note API v2.0.2 and ERP API v2.0.2 (official AADE PDFs, attached below) · Α.1198/2026 · parent FRO-285 · related FRO-284, FRO-283 · `docs/workflows/delivery-note.md`.

## Official AADE documentation

* myDATA API Documentation — Delivery Note v2.0.2 (Σεπτέμβριος 2026): [myDATA API Documentation_DeliveryNote_v2.0.2_official_0.pdf](https://uploads.linear.app/80ed42b4-423d-4c1b-9de1-ac81bad4e49c/d8cedb1b-de47-4fe7-a61b-f1e0d713b49e/46169346-6ec4-47e7-8c71-d6a03a24ec99)
* myDATA API Documentation — ERP v2.0.2 (Σεπτέμβριος 2026): [myDATA API Documentation v2.0.2_official_erp_1.pdf](https://uploads.linear.app/80ed42b4-423d-4c1b-9de1-ac81bad4e49c/48a0b327-8f17-4d42-8093-aba306a9dfdb/3fafe536-2e07-4923-8de8-6c031c1b2b50)
