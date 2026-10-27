# FRO-354 review — Customs Storage Entry details page UI

Started 2026-10-27. Workflow review: the ticket was not created through the AGENTS.md flow.

## Baseline (read 2026-10-27)

- Status Todo; labels entry note / Pending_Review / Frontend / Story; milestone 0.0.11; project Pre-releases 0.0.x; no assignee; no comments.
- updatedAt 2026-10-27T07:53:37.719Z.
- Relations: blocks FRO-355; blockedBy FRO-319; related FRO-353, FRO-352, FRO-358, FRO-348, FRO-326.
- 1 attachment: "Entry Note details — saved record & card editing" (ChatGPT-hosted preview, sign-in required, historical).
- Production main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a (unchanged since FRO-353 review). Ticket cites stale 3820e89.
- Access: gh OK (push true), Linear OK, wrangler not authenticated and no CLOUDFLARE_API_TOKEN → preview local only (as FRO-353).

## Findings

| # | Gap | Evidence |
| -- | -- | -- |
| 1 | Change Order search says Stock ID, Client, Supplier or invoice; production search and FRO-319's creation search read do not match Client, Supplier or invoice | FRO-353 spec; `PurchaseOrderRepository.searchCondition` |
| 2 | Related Export keeps a "conflict" explanation; FRO-317 prevents conflicting Exports and FRO-353 removed that state | FRO-353 Related Export |
| 3 | Two independent editors (entry details, Order) each send a version precondition; saving one makes the other stale | FRO-319 Concurrency |
| 4 | Change Order search: current owner and Orders already covered by this entry have no defined presentation | FRO-319 eligibility reasons |
| 5 | Change Order keeps warehouse-prefilled values; new owner may have another admitting warehouse — nothing tells the operator | FRO-319 Change Order |
| 6 | Covered-child opening: no concrete display or strings ("inherited origin context") | FRO-355 Open |
| 7 | Header/TopBar: no EN/EL title, subtitle, Back to Order string, behavior without return context | FRO-353/355 return context |
| 8 | Created toast on landing (FRO-353 outcome) not listed | FRO-353 Outcomes |
| 9 | Print → FRO-358 has no milestone; FRO-354 is 0.0.11; Print visibility/authority undefined | FRO-358 |
| 10 | No strings for loading/not found/denied, failed/stale save, discard, Change Order dialog | FRO-352 pattern |
| 11 | Leave-page warning with an open editor not specified | FRO-353 |
| 12 | Editable field list and validation not stated (implicitly FRO-353's) | FRO-319 search-validation patch |
| 13 | AC4 says actual VAT €0; per-row amounts are now in invoice currency | FRO-319 patch Edit 3 |
| 14 | House style: duplicated Corrections sections, preview narration, `?fail=1`, Verified paragraph, appended label note, no Decisions / Out of scope / Context component map | AGENTS.md working rules |
| 15 | Mock branch base: FRO-353 components exist only on unmerged mock/fro-353 | branch compare |

## Round 1

Questions Q1–Q12 asked in chat; answers pending.
