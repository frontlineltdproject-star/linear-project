# FRO-354 — branch link edit (draft, not saved)

Baseline: updatedAt 2026-10-27T10:18:15.474Z; Todo; labels entry note/Pending_Review/Frontend/Story; blocks FRO-355; blockedBy FRO-319; related FRO-353/352/358/348/326; 1 attachment.

## Edit 1 — Context for agents, "Prepared frontend branch" (two patch operations)

Before:

**Prepared frontend branch:** `mock/fro-354-customs-storage-entry-details` (when published) holds unmounted components on UI view models under `frontline-forwarding-client/src/features/customs-storage/details/`, built from main with its own copies of the FRO-353 parts and a README listing the FRO-319 reads it waits for and the parts to consolidate with `create/` once both are merged.

After:

**Prepared frontend branch:** [`mock/fro-354-customs-storage-entry-details`](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-354-customs-storage-entry-details) (base main `5c51030`, head `7f65b41`, one commit, 15 new files) holds unmounted components on UI view models under `frontline-forwarding-client/src/features/customs-storage/details/`, built from main with its own copies of the FRO-353 parts and a README listing the FRO-319 reads it waits for and the parts to consolidate with `create/` once both are merged. It is not merged; activation needs the FRO-319 entry read (with creator and version), edit, Change Order, Order search and authorities, FRO-356 on `main`, the FRO-321 invoices and FRO-317 Export, the page route and the FRO-355 / FRO-353 entry points.

The rest of the paragraph (local preview, historical ChatGPT preview) is unchanged. Operation 1 anchors on "`mock/fro-354-customs-storage-entry-details` (when published) holds", which disappears once applied; operation 2 inserts after "once both are merged." only in the same atomic patch, so a retry cannot duplicate either.

## Edit 2 — link attachment (added)

- Title: **Prepared frontend branch — mock/fro-354-customs-storage-entry-details**
- URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-354-customs-storage-entry-details

The existing ChatGPT preview attachment stays unchanged.

## Unchanged and cleanup

Title, status, labels (re-passed unchanged), milestone, project and relations stay as they are. Linear may add related links from mentions in the description (FRO-356, FRO-321, FRO-317, FRO-350, FRO-347); any added link is removed after the save, then the issue is re-read.
