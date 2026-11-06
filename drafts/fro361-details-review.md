Give authorized office staff a **Delivery Notes** entry in the main navigation. Staff can find an existing delivery note (δελτίο αποστολής), inspect the goods it covers, and preview its PDF without first identifying its Shipment.

## List

Show one row per existing Delivery Note across the Shipments the viewer may access. A Shipment can have several notes for different invoicing companies. Each row opens its own note by ID.

| Column | Display |
| -- | -- |
| Delivery Note number | Series and fiscal number. Show **Awaiting number** when the note has no fiscal number. |
| Shipment | The linked Shipment’s reference. |
| Invoicing company | The company for this note. |
| Status | The note’s stored status, with a localized label. |
| Issue date | The recorded issue date. Leave blank when absent. |

Search by **Delivery Note number**, **Shipment reference**, or **invoicing company**. Combine search with a **Status** filter that defaults to **All statuses**. Apply both to the full authorized result set.

Support all six stored statuses: `DRAFT`, `SUBMISSION_PENDING`, `ISSUED`, `SUBMISSION_FAILED`, `CANCELLATION_PENDING`, and `CANCELLED`. Use the recorded status independently of whether the note has a fiscal number or issue date.

## Read-only details

Use the attached Direction A layout with one **Details** tab. Open the selected note in the following section order.

| Section | Contents |
| -- | -- |
| **Document** | Series and fiscal number, status, issue date, invoicing company, and linked Shipment. Show the AADE MARK when present and the recorded submission error for a failed submission when available. |
| **Movement** | Recipient, loading and destination addresses, movement start, vehicle number, and movement purpose from the selected note. |
| **Goods covered** | The selected note’s lines with Order reference, colli quantity, and gross weight. Show the note’s total colli and total gross weight. |

**Order** means purchase order (stock-list item). **Colli** means handling units. When a Shipment has multiple notes, each details page shows only its own lines and totals.

* **Open Shipment** opens the note’s linked Shipment under the existing Shipment access rules.
* **Preview PDF** uses the existing preview for that Shipment ID and note ID. Apply the same availability and saved-draft checks as the Shipment screen. Surface preview failures on the details page.
* For a draft that fails the existing saved-movement-details check, keep **Preview PDF** visible but disabled. Show **Save the draft’s movement details in Shipment first** (EL: **Αποθηκεύστε πρώτα τα στοιχεία διακίνησης του πρόχειρου δελτίου στην Αποστολή**). Keep **Open Shipment** available under its existing access rules. Disable repeat preview requests while a preview is loading.
* Do not show **Preview PDF** for `SUBMISSION_PENDING`. Preserve its availability for `SUBMISSION_FAILED`, `ISSUED`, `CANCELLATION_PENDING`, and `CANCELLED`.
* Provide English and Greek labels. Keep the fields and actions usable on desktop and at approximately 400px width.
* Provide loading, empty, and error states. Distinguish an empty list from a search with no matches. Handle unavailable or inaccessible note links without disclosing note contents.

## Decisions and scope

* Include drafts and every later status so staff can see whether a note has been prepared, issued, failed, or cancelled.
* Use a dedicated read path for the list and details. Opening either page, searching, filtering, or previewing a PDF must never prepare a draft, update a record, allocate a fiscal number, or contact AADE to submit or cancel a note.
* Keep creation, editing, issuance, and cancellation in the Shipment workflow. A Create page and Shipment picker are outside this ticket.
* Reuse the existing Delivery Note entity, fiscal lifecycle, and PDF generation. This ticket adds cross-Shipment reads and the two frontend pages.

## Context for agents

| Area | Implementation reference |
| -- | -- |
| Data | `freight_delivery_note` and `freight_delivery_note_line` hold the document and its lines. The client’s `src/features/shipments/graphql/delivery-notes.graphql` selects the status, fiscal fields, recipient, movement data, lines, and totals. |
| API | In `frontline-forwarding-app`, `DeliveryNotesGraphQlApi.java` exposes `deliveryNotesByShipmentId`. Add authorized list/search and single-note reads suitable for direct navigation. Enforce access server-side on both reads. The current repository read excludes cancelled notes; do not reuse that exclusion for these pages. Supply the Shipment reference and invoicing-company display value required by the pages, in addition to their IDs. |
| Authorization | `DeliveryNoteAuthorizationService.requireView` requires an internal Frontline user or system administrator with `DELIVERY_NOTE_VIEW`. Apply the existing record-access boundaries to results, details, and preview. The inspected read and PDF services check Delivery Note view authority; they do not establish a separate Shipment record-access check. Verify and enforce applicable Shipment access in the new read paths rather than assuming the existing methods provide it. |
| Frontend | In `frontline-forwarding-client`, see `src/features/shipments/components/delivery-notes-card.tsx`, `delivery-note-form-validation.ts`, and `src/features/shipments/services/delivery-note-service.ts`. Reuse the PDF behavior. The Shipment saved-draft check initializes from non-null `movementStartAt` on every note returned by its current-note read; preserve that shared saved-state check for standalone draft preview, without deriving it solely from the selected note or introducing a new persisted flag. The PDF GET checks the note/Shipment identity and view authority but does not enforce the client’s saved-draft guard. The Shipment card includes automatic draft preparation and must not be mounted as the read-only details screen. |

## Acceptance criteria and post-deployment verification

Use existing records and read-only sessions for these checks.

1. Open **Delivery Notes** as an authorized viewer. Confirm **All statuses** is selected and compare rows with existing Shipment notes. Where one Shipment has two notes, verify that each opens its own document.
2. Search separately by a known note number, Shipment reference, and company. Combine a search with a status filter. Verify the returned rows satisfy both conditions and that an unmatched search shows the no-results state.
3. Open an unnumbered draft and an issued note. Compare their number, status, and issue date with the stored records. Check available examples of pending, failed, and cancelled notes against their recorded statuses.
4. Open a note from a multi-note Shipment. Verify **Document → Movement → Goods covered**, compare the line references and totals with that note, and confirm **Open Shipment** targets the correct Shipment.
5. Compare PDF availability on the details page and Shipment screen for the same note. For a draft failing the saved-movement-details check, verify the disabled button, English/Greek explanation and available **Open Shipment** action. Check that submission-pending notes have no preview action. Where available, open the PDF and verify the document identity. Inspect network activity while browsing and previewing to confirm read-only behavior.
6. With a session lacking Delivery Note access, check the navigation entry, list read, direct note link, and PDF access. Confirm no note data is exposed.
7. Check desktop and phone-width layouts in English and Greek. Exercise loading, empty, and error displays using read-only request interception where needed.

**Reference:** <issue id="c21607e1-af3d-4b3f-a17f-791cd231e7bf" label="FRO-247" href="https://linear.app/front-line-ltd/issue/FRO-247/delivery-note" /> · Delivery Note. The attached Direction A screenshots and interactive preview define the list and Details layout. The disabled-draft PDF behavior is specified above; the attached prototype does not demonstrate that state.
