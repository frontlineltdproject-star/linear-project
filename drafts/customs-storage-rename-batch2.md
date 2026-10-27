# Customs Storage Entry rename — batch 2 (FRO-321 / FRO-317 / FRO-326 / FRO-347 / FRO-348 / FRO-352)

Linear text only. No production branch changes. Titles, labels, status, relations and attachments unchanged.

Baselines (updatedAt): FRO-321 2026-10-26T14:16:04.377Z · FRO-317 2026-10-26T14:17:49.938Z · FRO-326 2026-10-23T14:34:08.579Z · FRO-347 2026-10-26T14:17:49.894Z · FRO-348 2026-10-23T12:22:47.749Z · FRO-352 2026-10-26T15:01:43.906Z.

## Patch per ticket (replace_all, in this order; only ops with matches)

| Ticket | "an Entry Note" → "a Customs Storage Entry" | "An Entry Note" → "A Customs Storage Entry" | "Entry Notes" → "Customs Storage Entries" | "Entry Note" → "Customs Storage Entry" | Visible occurrences |
| -- | -- | -- | -- | -- | -- |
| FRO-321 | — | 1 | 1 | 13 | 15 |
| FRO-317 | 1 | — | — | 6 | 7 |
| FRO-326 | — | — | — | 9 | 9 |
| FRO-347 | 1 | — | — | 9 | 10 |
| FRO-348 | — | — | — | 13 | 13 |
| FRO-352 | 2 | — | — | 5 | 7 |

URL slugs (`entry-note-…`) are lower-case and not touched; Linear already redirects them.

## Visible UI wording affected

* FRO-326: fourth Available actions card name "Entry Note" → "Customs Storage Entry"; heading "Supplier Invoice and Entry Note actions".
* FRO-347 / FRO-348: invoice form/details field "Entry Note" → "Customs Storage Entry"; empty state **No current Customs Storage Entry**; headings "Customs Storage Entry and staged availability" / "Customs Storage Entry and Related Export".
* FRO-352: Add-invoice reason **Customs Storage Entry {number} storage invoices are in {Export ID}**.

## Relations check

Description patches can re-add every mentioned issue as related. Baseline relations recorded below; after saving, remove only links that were not in the baseline.

* FRO-321: blocks 317/347/349/348; blockedBy 356; related 318/303/352/320/248/241/319/326/329.
* FRO-317: blocks 352/350; blockedBy 321; related 348/240/320/309/241/316/315/329/319/318/248/312/311.
* FRO-326: blocks 330; blockedBy 356/355/349/346/337/334/333/332/294/295/297/329/328/292; related 354/319/353/321/347/293/298/314/316/313/303/348/345/344/341/335.
* FRO-347: blocks 349; blockedBy 321/356; related 352/335/319/350/326/348.
* FRO-348: blockedBy 356/321; related 354/335/326/347/319/317/352/350.
* FRO-352: blockedBy 317; related 350/348/354/353/347/321.

## Not changed

* Label "entry note" (workspace label, used on several tickets) — renaming it is a separate workspace change.
* Mock branches `mock/fro-326-order-details-ui`, `mock/fro-348-supplier-invoice-details`, `mock/fro-352-export-details` keep "Entry Note" in their UI strings until a separate approved branch update.
