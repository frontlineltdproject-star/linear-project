# FRO-317 patch — EAD receipt confirmation date not later than today

Source decision: FRO-350 round 1, Q3 (accepted 2026-10-26). Baseline FRO-317 updatedAt 2026-10-26T13:06:28.810Z (Todo, labels entry note / export / Integration / Story / Ready). Four in-place replacements; nothing else changes. Labels, status, relations and attachments unchanged; any related links Linear auto-adds from mentions are removed after saving.

| # | Section | Before | After |
| -- | -- | -- | -- |
| 1 | Fields — **EAD receipt confirmation date** row | Recorded by the EAD confirmation event, with actor and recording time. Distinct from MRN date and not earlier than it. | Recorded by the EAD confirmation event, with actor and recording time. Distinct from MRN date, not earlier than it and not later than today (Europe/Athens). |
| 2 | Customs lifecycle — **Confirm EAD receipt** | …and submits. Reject a date earlier than the MRN date. Record the date… | …and submits. Reject a date earlier than the MRN date or later than today (Europe/Athens). Record the date… |
| 3 | Customs lifecycle — **Initial status at creation** | (EAD receipt confirmation date required, not earlier than the MRN date) | (EAD receipt confirmation date required, not earlier than the MRN date and not later than today) |
| 4 | Acceptance criterion 11 | EAD not before MRN date; | EAD not before MRN date and not after today; |

Decisions table: add the row **EAD receipt confirmation date not later than today (Europe/Athens)** | **A future receipt cannot be confirmed; same rule as the MRN date.**
