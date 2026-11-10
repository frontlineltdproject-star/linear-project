**Order attachments** distinguish Internal files for Front Line staff from External files shared with authorized client and supplier readers. Staff can retain working files in the portal without exposing them automatically.

## File contract

| Item | Type | Rule |
| --- | --- | --- |
| Visibility | Enum: Internal / External | One saved value per owned Order attachment. New uploads default Internal; sharing is explicit. |
| Internal audience | Derived access | Front Line staff/system administrators with the required Order access. External users receive neither file bytes nor its metadata. |
| External audience | Derived access | Existing authorized readers of the requested Order, including participating client and supplier companies. Never public access. |
| Visibility change | Authorized action | Front Line Operators and Managers with Order attachment-edit authority may change an owned file's visibility. Preserve technical administrator access. |
| Visibility audit | Actor/time/before/after | Record each effective change; do not rewrite original upload provenance or file contents. |

Order means the office's stock-list item, also called a purchase order. No new business role or Job/Case entity is introduced.

## Ownership, staging and access

- Preserve one owning Order and existing attachment identity, bytes, filename, kind, size, uploader/time and deletion history.
- Splits keep their existing inheritance links. Children use the source attachment's current visibility; staff change it only on the owning Order. Inherited files remain read-only and no file bytes are copied.
- Enforce visibility on owned/inherited listing, download, exposed metadata and every supported consumer. Internal filenames, counts, provenance or audit details must not leak through external responses or UI.
- For External inherited files, retain authorization through the requested child plus its valid inheritance link; this does not grant general access to the source Order.
- Uploads staged during Order creation remain creator-private, regardless of intended final visibility. Carry the default/explicit selection into the final attachment atomically with creation, preserving it through retries and recovery. Do not publish a staged file.
- Recheck authority and current state when changing visibility. Reject stale/conflicting changes without silently overwriting another user's decision; repeated requests must not create duplicate effective audit events.
- Changing to Internal denies subsequent external retrieval through every access path. Refresh stale client state accordingly; previously downloaded copies cannot be recalled.
- Preserve existing file validation, upload/removal permissions, deletion rules and the prohibition on removing a source file while inheritance links exist. A visibility change is not deletion and does not alter Order lifecycle or structured document fields.

## Frontend contract

Use existing portal components and the Internal/External Notes pattern: **two cards in the Order Attachments tab**, labelled **Internal** and **External**.

- Staff see both cards; authorized external readers see only their External files, without an Internal card or hidden-file counts.
- New upload selection defaults Internal and clearly shows its intended audience. Explicit External selection or a later visibility change is required to share it.
- Staff can change visibility on owned files. Inherited entries retain provenance/read-only presentation and use the source visibility without offering a child-side override.
- Preserve filename, kind, size, uploader/time and applicable download/remove controls. Keep file type classification separate from audience.
- Carry the same audience selection through supported Order creation uploads and saved-Order uploads. Shared attachment components must not change Shipment behavior.
- Loading, empty, failed upload, failed visibility save and uncertain-result states retain the user's context and never claim sharing succeeded without confirmation. Reconcile/retry the same file operation without duplicate files or lost choices.
- Support EN/EL labels and narrow layouts using existing patterns. No separate application-wide redesign is required.

## Existing data and exclusions

Existing Order uploads are confirmed mock data: initialize them as Internal, retain the files and allow selected examples to be shared explicitly. Inheritance links use their source file's value. Apply migrations without deleting uploads; do not generalize the mock-data assumption to future real imports.

Shipment, Supplier Invoice and Export attachments keep existing staff-only behavior. Generated Delivery Note/other PDFs are separate flows. Exclude public links, file-only sharing from other entities, server-folder migration, a Job/Case aggregate, department-specific audiences and new file formats/limits.

## Decisions

| Decision | Reason |
| --- | --- |
| Internal by default | Bring internal working files into the portal without accidental external disclosure. |
| Existing mock files become Internal | Use the same default without deleting files or preserving hypothetical live sharing obligations. |
| External retains client and supplier scope | Preserve current authorized readership for deliberately shared files. |
| One source-owned visibility across inheritance | Avoid conflicting audiences for one shared file. |
| Order-only scope | Other uploaded-file owners are already staff-only; external sharing for them needs a separate business need. |

## Acceptance criteria

1. New saved/staged Order uploads default Internal. Explicitly selected visibility survives creation, retries and recovery with one file and original provenance; staging remains creator-private.
2. External client/supplier users cannot list, infer metadata for or download Internal files through owned Orders, inherited Orders, direct requests or other supported surfaces. Authorized External files remain accessible within existing company/Order scope.
3. Operators/managers can change owned-file visibility with a recorded actor/time/before/after. Unauthorized, stale and conflicting requests are refused without partial updates; retries do not duplicate effective audit events.
4. All inherited links reflect source visibility changes. Child-side overrides remain unavailable, source ownership is retained, and unrelated source-Order data stays inaccessible.
5. The two-card staff layout and External-only reader layout match saved state, including empty/loading/error/recovery cases, EN/EL and narrow screens. Internal-to-External and External-to-Internal changes reconcile across affected views.
6. Existing mock files initialize Internal without loss. Existing upload/removal/inheritance protections and non-Order attachment/generated-document behavior remain unchanged.
7. Backend and frontend tests cover both external company roles, unrelated companies, every supported attachment path, staged creation, stale updates, response loss and split/inherited access. API/database references and workflow documentation match the delivered contract.

## Context for agents

Source baseline: `main` at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. `docs/reference/database.md` defines `freight_attachment` with exactly one owner among `purchase_order_id`, `shipment_id`, `supplier_invoice_id` and `export_declaration_id`; no visibility field exists. `freight_purchase_order_attachment_inheritance` links `child_purchase_order_id` to `source_attachment_id`. Pending files use `freight_pending_upload` and `freight_creation_context`.

Under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`, trace `domain/attachments/Attachment.java`, `AttachmentRepository.java`, `web/attachments/service/AttachmentsApiService.java` and `web/creationuploads/service/CreationContextsApiService.java`, plus split/creation association and API output paths. Existing Order listing/download authorizes through Order access without a separate audience check. Use Order client/supplier participation, not invoice-company identity, as the existing external scope.

Client consumers include the shared AttachmentPanel/AttachmentService, Order Details attachment tab and `features/creation-uploads/use-staged-files.ts` under `frontline-forwarding-client/src/`. The shared panel also serves Shipments; preserve their current behavior. Supplier Invoice and Export use separate file flows and remain out of scope.

Preserve current staged-before-create and successful-attempt recovery contracts. Coordinate with existing upload reliability work without weakening authorization or treating this ticket as diagnosis of the upload-401 issue. Regenerate reference documentation through repository tooling.

## Post-deployment verification

| AC | Read-only check |
| --- | --- |
| 1 | Inspect existing created-file metadata and isolated staging/creation/recovery evidence; no live upload. |
| 2 | Using controlled authorized accounts and known fixtures, inspect permitted lists/downloads and absence of Internal metadata; review isolated direct-path negative tests. |
| 3–4 | Read source/child file metadata and visibility audit; review isolated stale/retry/revocation/inheritance results. |
| 5 | Inspect existing Internal/External fixtures as staff and external readers in EN/EL and narrow layouts; review failure/recovery captures. |
| 6 | Review migration counts/retained identities and non-Order regression evidence. |
| 7 | Inspect test results, schemas, workflow documentation and deployed revision. Missing fixtures/evidence remain unverified. |

**Reference:** [Attachment workflow](https://github.com/Frontline-Forwarding/frontline-forwarding/blob/6aa259553cd9c86a8aaa157902088aa9a6bca83e/docs/workflows/attachments.md), persistence and consumer paths above.
