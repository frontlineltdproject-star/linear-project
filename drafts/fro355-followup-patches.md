# FRO-355 follow-up patches — FRO-319 split wording, FRO-353 post-create landing

Description-only patches. Labels, status, milestone, relations and attachments unchanged; any related links Linear adds on save are removed.

## FRO-319 (baseline updatedAt 2026-10-27T08:20:19.826Z)

Split coverage table, first row.

Before:

| **Split after admission** (manual or during Shipment preparation) | The child and its descendants are covered. No new note, number, admission or copied MRN. Cancelling the preparing Shipment keeps the child covered. |

After:

| **Split after admission** (today only Shipment-preparation partial selection; manual splits happen before stock) | The child and its descendants are covered. No new note, number, admission or copied MRN. Cancelling the preparing Shipment keeps the child covered. Any future post-admission split follows the same rule. |

## FRO-353 (baseline updatedAt 2026-10-27T07:53:06.295Z)

Actions and states — insert a bullet after "Retain the full creation draft across tab/language changes and failed saves. …".

New bullet:

* Successful creation opens the new entry's [FRO-354](https://linear.app/front-line-ltd/issue/FRO-354) details page. When creation started from Order Details ([FRO-355](https://linear.app/front-line-ltd/issue/FRO-355)), that page carries the originating Order as return context and shows **Back to Order {Stock ID} / Επιστροφή στην παραγγελία {Stock ID}**.
