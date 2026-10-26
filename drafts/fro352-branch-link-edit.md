# FRO-352 — branch link edit (draft)

Baseline: FRO-352 updatedAt 2026-10-26T14:17:47.621Z; Todo; labels export/Pending_Review/Frontend/Story; blockedBy FRO-317; related FRO-350/348/354/353/347/321; 1 attachment.

## Description patch (Context for agents)

| # | Before | After |
| -- | -- | -- |
| 1 | Table row: Branches `mock/fro-348-supplier-invoice-details`, `mock/fro-350-export-create` (when published) | Branches `mock/fro-348-supplier-invoice-details`, `mock/fro-350-export-create` |
| 2 | (no paragraph) | New paragraph after "This description is the contract." — see below |
| 3 | Gotchas: "add it locally as FRO-347/350 do." | "add it locally as FRO-347/FRO-350 do." (Linear only links a full issue ID) |

New paragraph:

> **Prepared frontend branch:** `mock/fro-352-export-details` (base main 5c51030, head dc8d3a9, one commit per slice). Unmounted presentation components, page-side rules and EN/EL labels under `frontline-forwarding-client/src/features/exports/details/`, built from this description; no route, service or backend change. The folder README lists what activation needs: Export contracts, authorities, attachments and the ΥΔ PDF endpoint (FRO-317), invoice data and stamping events (FRO-321), the Entry Note reason (FRO-319), and the route and entry links.

## Link attachment (added; existing attachment kept)

- Title: Prepared frontend branch — mock/fro-352-export-details
- URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-352-export-details

## Unchanged

Title, status, labels (re-passed unchanged), priority, project, milestone, relations, existing attachment. Linear may re-add related links from mentions (FRO-319 at least); remove only those additions after saving, then re-read.
