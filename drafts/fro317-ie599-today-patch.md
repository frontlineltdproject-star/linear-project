# FRO-317 — positive IE599 date "not later than today" patch (draft)

Baseline: FRO-317 updatedAt 2026-10-26T13:37:49.333Z (Ready, Todo). Decided in the FRO-352 review, Q6 (2026-10-26).

| # | Before | After |
| -- | -- | -- |
| 1 | Fields row **Positive IE599 confirmation date**: "…with actor and recording time. Not earlier than the EAD receipt confirmation date." | "…with actor and recording time. Not earlier than the EAD receipt confirmation date and not later than today (Europe/Athens)." |
| 2 | Customs lifecycle bullet: "Reject a date earlier than the EAD receipt confirmation date." | "Reject a date earlier than the EAD receipt confirmation date or later than today (Europe/Athens)." |
| 3 | AC 11: "positive IE599 not before EAD;" | "positive IE599 not before EAD and not after today;" |
| 4 | Decisions row "EAD receipt confirmation date not later than today (Europe/Athens)" | "EAD receipt and positive IE599 confirmation dates not later than today (Europe/Athens)" |

No other change. After saving: remove any related links Linear adds from mentions; re-read labels, relations and attachments.
