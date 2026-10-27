# FRO-353 — branch link edit (draft, not saved)

Baseline: updatedAt 2026-10-27T08:56:57.044Z; Todo; labels entry note/Pending_Review/Frontend/Story; blocks FRO-355; blockedBy FRO-319; related FRO-350/352/248/358/326/354; 2 attachments.

## Edit 1 — Context for agents, "Prepared frontend branch" (one replacement)

Before:

**Prepared frontend branch:** `mock/fro-353-customs-storage-entry-create` (when published) holds unmounted components on UI view models under `frontline-forwarding-client/src/features/customs-storage/create/`, with a README listing the FRO-319 reads it waits for.

After:

**Prepared frontend branch:** [`mock/fro-353-customs-storage-entry-create`](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-353-customs-storage-entry-create) (base main `5c51030`, head `4c5a3eb`, one commit, 14 new files) holds unmounted components on UI view models under `frontline-forwarding-client/src/features/customs-storage/create/`, with a README listing the FRO-319 reads it waits for. It is not merged; activation needs the FRO-319 reads, create operation and authorities, FRO-356 on `main`, the FRO-321 invoices and FRO-317 Export, and the page route.

The rest of the paragraph (local preview, historical ChatGPT preview) is unchanged. The patch anchors on "(when published) holds unmounted components", which disappears once applied, so a retry cannot duplicate it.

## Edit 2 — link attachment (added)

- Title: **Prepared frontend branch — mock/fro-353-customs-storage-entry-create**
- URL: https://github.com/Frontline-Forwarding/frontline-forwarding/tree/mock/fro-353-customs-storage-entry-create

Existing attachments stay unchanged.

## Unchanged and cleanup

Title, status, labels (re-passed unchanged), milestone, project and relations stay as they are. Linear may again add related links from mentions in the description (FRO-356, FRO-321, FRO-317); any added link is removed after the save, then the issue is re-read.
