**Allow files to be attached during Order or Shipment creation**, before a permanent record ID exists, and associate the selected uploads with the new record only when creation succeeds.

**Order = purchase order = stock-list item; colli = handling unit.** This ticket delivers the backend upload, creation-association and recovery contracts. Presentation belongs to the existing creation and Details tickets; no UI, mockup or preview is implemented here.

## Scope and ownership

Implement temporary-upload ownership, validation, authorized operations, atomic association, retry/recovery, expiry and cleanup for Order creation and normal Shipment creation. Reuse the existing permanent attachment model.

Files are optional. Creating without files remains supported. Uploading alone creates no Order, Shipment, colli or invoice row; reserves no goods; splits no Order; sets no readiness; and records no collection, arrival, stock confirmation or departure.

Historical already-arrived Shipment creation is excluded. Those Shipments may receive files after creation through ordinary authorized attachment operations. Inline Order creation within Shipment creation retains its separately owned save boundary; this ticket does not define that workflow.

## Data and authorization contract

| Data / capability | Type / rule |
| -- | -- |
| Creation context | Opaque reference scoped to authenticated creator, target entity type and one creation draft. Not a permanent record ID or an autosaved business draft. At most one successfully created record per context. |
| Submission attempt | Opaque operation identity within that context, bound to the submitted creation contents and selected upload references. Replaying the same attempt cannot create another record. |
| Upload operation | Stable opaque identity within creator/entity/context scope, bound to one intended file upload. Recovering or retrying that operation returns the same pending reference rather than creating a duplicate. |
| Pending file | Opaque upload reference, original filename, content type, byte size, DOCUMENT/PHOTO kind, uploader and original upload time. Private bytes; no public URL or caller-controlled storage path. |
| Accepted files | PDF, JPG/JPEG, PNG, WebP, GIF, DOC/DOCX, XLS/XLSX, CSV and TXT. Nonempty content; maximum 25 × 1,024 × 1,024 bytes per file; valid normalized filename up to 255 characters. Preserve existing extension validation and kind classification. |
| Creation input | Optional pending-upload references belonging to this creator, entity and context. Only completed, valid, unconsumed references are eligible; duplicate references must not produce duplicate attachments. |
| Permanent attachment | Existing model with exactly one Order or one Shipment owner, retaining original uploader/time and file metadata. A pending file cannot acquire multiple owners. |
| Recovery reads | Authorized reads exposing upload/creation outcome, pending-file status, expiry and actionable errors; successful creation recovery returns the same permanent identity and association result. |

Define operations for opening a context, uploading/listing/downloading/removing pending files, abandoning the context, submitting creation and recovering outcomes. Endpoint names and internal storage layout are implementation choices; these are new contracts, not existing production APIs.

| Target | Required authority |
| -- | -- |
| Order | Current Order creation authority plus PURCHASE_ORDER_EDIT and internal Frontline/system-administrator identity for pending file operations and association. Preserve company/record scope. |
| Shipment | Current Shipment creation authority plus existing internal access and SHIPMENT_EDIT for pending file operations and association. |

Creation without files retains existing creation authorization. A recovery token or context never grants access by itself. Revalidate actor, applicable authority, creator/entity/context ownership and selected references at submission; apply current authorization to outcome reads. Reject foreign, cross-context, cross-entity, expired, removed, incomplete and improperly consumed references without exposing another creator's data.

## Upload and creation lifecycle

| Situation | Required behavior |
| -- | -- |
| Upload before Create | Store privately as pending. Do not create a placeholder parent or permanent attachment. A ready reference is returned only for completed valid storage. |
| Lost upload response | Recover or retry using the same upload-operation identity. Return the original pending reference and metadata if successful; do not upload another copy merely because the response was lost. |
| Changed file on the same upload identity | Reject conflicting reuse. An intentionally separate upload uses a distinct operation identity, even when filename or bytes are identical. |
| Remove pending file | Exclude it from creation, invalidate its reference and retain audited, retryable cleanup ownership until its bytes are removed. |
| Submit creation | Revalidate the complete creation input and selected files. An invalid/missing selected file rejects the complete submission with an identifiable file error; never silently omit it. |
| Successful Order creation | Atomically establish the Order, selected attachment ownership and creation-owned child records, initial state, warehouse, audit and journey effects. Preserve the owning Order creation contracts. |
| Successful normal Shipment creation | Atomically establish the Shipment, selected attachment ownership and creation participation, partial splits, reservations and other creation effects. Preserve FRO-325's PREPARING result and absence of readiness/departure effects. |
| Creation or association failure | Leave no partial parent, child, split, reservation, permanent association or creation/movement effect. Keep valid pending files retryable within their lifetime. |
| Confirmed rejection | Permit correction of the draft and a new submission attempt within the still-valid context. A changed payload must not masquerade as a replay of the rejected attempt. |
| In-flight or uncertain outcome | Resolve or replay the same attempt with the same bound contents. Reject conflicting changed submissions while the outcome is unresolved; do not create a fresh context as a workaround. |
| Successful replay | Return the same created identity and association result without repeating children, attachments, audit or movement effects. Consumed references belonging to that successful attempt must not cause its replay to be treated as a new invalid submission. |
| Successful context | Close it to further uploads and new creation attempts. This applies when the selected file collection is empty. Remaining unused files stay subject to cleanup; they cannot create another record through that context. |
| Remove/expiry/abandonment races | Serialize against creation so either creation commits with valid ownership or the operation fails without partial creation. Cleanup must never delete committed attachments. Abandonment cannot cancel or roll back an already committed record. |
| Explicit abandonment | Invalidate unused pending references and clean private bytes; create no parent. Resolve any in-flight/uncertain submission before treating abandonment as confirmed non-creation. |
| Browser closes | Expire unconsumed uploads under a bounded cleanup policy. Closing the browser does not prove that a submitted creation failed. |
| Storage or cleanup failure | Keep auditable retryable cleanup work. Never falsely report deleted bytes or completed association. Failed operations must not leave objects without cleanup ownership. |

Preserve result recovery independently of temporary-file expiry: expiry/cleanup must not erase a successful creation outcome or make the same context usable for another creation. Document the retention and recovery policy before rollout; no production retention duration is invented here. An unavailable outcome is not evidence of failure and must not authorize a new creation.

Coordinate object storage and database writes so permanent metadata does not reference missing files. Associate existing valid private bytes safely; the backend need not perform a fallible byte-copy after reporting creation success. Keep new pending persistence distinct from the permanent model's required owner constraint.

## Existing behavior to preserve

After successful creation, files are ordinary attachments available through existing authorized listing, download and removal. Preserve filename, size, type/kind, original uploader/time and removal audit.

Order splits retain existing attachment inheritance: the source Order remains sole owner; children receive links without copied bytes. Child links are read-only; source removal remains blocked while inheritance links exist. Pending uploads are not inherited attachments, and later parent uploads are not automatically inherited by existing children. Do not copy participating Orders' files to a Shipment.

An AWB/CMR/B/L upload does not populate or change the canonical Shipment transport-document number/type. Uploads do not populate Order DN Import/DN Export, invoice facts or other structured document values, issue delivery notes, send emails or add lifecycle transitions.

Preserve existing post-creation uploads, organization/record scope, no-file creation and historical data. Preserve all initial-state, child-record, warehouse, audit and journey rules of Order creation and all normal Shipment creation invariants owned by FRO-325. Staging files is separate from confirming readiness or performing physical movement.

## Integration and rollout

| Consumer / owner | Contract |
| -- | -- |
| FRO-335 — Order Creation | Owns Documents controls, pending-file feedback, review, cancellation and result presentation. Consumes atomic creation association and recovery; no create-first/upload-after substitute. |
| FRO-341 — Shipment Creation | Owns the equivalent normal-creation presentation. Historical ARRIVED creation does not offer pending uploads under this capability; ordinary attachments are available after creation. |
| FRO-326 / FRO-316 — saved Details | Read ordinary permanent Order/Shipment attachments. No temporary-upload controls or additional redesign required. |
| FRO-325 — normal Shipment creation | Owns participation, child splits, reservations and lifecycle; this ticket integrates attachment association into that boundary. |
| GraphQL / REST / MCP | Extend supported creation inputs and canonical results consistently through the shared creation services. Provide access to the authorized staging/recovery operations and document how each caller uses them. |

This ticket blocks FRO-335 and FRO-341 for creation-time uploads. Preserve their existing presentation; reconcile their descriptions, recovery rules, acceptance checks and simulated previews before integration. The existing [Order creation preview](https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site) and [Shipment creation preview](https://shipment-create-route-collis.frontlineltdproject.chatgpt.site/) are visual references, not proof of backend support.

Preserve compatible legacy no-file calls without requiring temporary uploads. Consumers using the new creation context obtain the specified no-file retry guarantees; do not claim that legacy calls without operation identity become idempotent.

Coordinate activation with compatible consumers and document the release sequence. FRO-335 currently targets 0.0.5, this ticket 0.0.8 and FRO-341 0.0.9; milestone labels alone do not establish availability. Do not activate a consumer against missing contracts or silently fall back to post-create uploads. This specification does not change board milestones.

Deliver pending/context/attempt persistence, required migrations, storage coordination, cleanup execution, authorized APIs, tests, curated workflow documentation and regenerated API/database references. Preserve existing permanent attachments, inheritance links and audit metadata. Document temporary expiry, cleanup scheduling/retries and outcome recovery independently before rollout.

## Decisions

| Decision | Reason |
| -- | -- |
| Deliver backend implementation contracts | Creation pages need executable staging, association and recovery support. |
| Associate selected files atomically with creation | An Order or Shipment must not be reported as successfully created without its selected valid attachments. |
| Keep historical ARRIVED creation outside this capability | Preserve its separately owned historical transaction; post-creation attachment operations remain available. |
| Separate draft context, submission attempt and upload operation | Permit correction after rejection while preventing duplicates after uncertain responses or successful completion. |
| Retain successful recovery beyond temporary-file expiry | Cleanup must not cause duplicate business records or destroy evidence of successful creation. |
| Reuse existing UI owners and permanent attachments | Preserve established presentation, access, inheritance and audit behavior. |

## Acceptance criteria

1. Authorized users stage optional valid files for Order and normal Shipment creation without creating a parent or business effects; authority and creator/entity/context isolation are enforced.
2. Existing file validation applies with the exact per-file byte limit. Invalid, foreign, cross-context/entity, expired, removed and incomplete selections reject the whole creation with identifiable errors.
3. Lost upload responses recover the same pending reference through the same operation identity. Conflicting file reuse is rejected; intentional separate uploads remain separate operations.
4. Successful creation produces one parent and exactly its selected attachments with original metadata, atomically with all entity-specific creation effects. Failure leaves none of those partial effects.
5. Confirmed rejection permits corrected resubmission within the valid context. In-flight/unknown outcomes cannot accept changed contents; same-attempt replay returns the same success without repeating effects.
6. A context yields at most one record, including no-file submissions. Successful recovery remains available independently of temporary-byte expiry; a completed context cannot be reused.
7. Removal, abandonment, expiry and concurrent creation preserve atomic outcomes and committed files. Cleanup/storage failures retain auditable retryable work without false success or unowned objects.
8. Ordinary attachment reads/downloads/removal, post-creation uploads, split inheritance, legacy no-file creation and current authorization remain compatible. Uploads do not assign structured document fields or trigger lifecycle, email or fiscal effects.
9. Historical ARRIVED creation remains excluded and its consumer wording agrees; existing Details pages display resulting permanent attachments without new temporary controls.
10. GraphQL/REST/MCP contracts, migrations, generated references, configured expiry/cleanup/recovery policies and compatible-consumer release evidence are complete. Automated nonproduction checks cover validation, authorization, changed/same attempts, no-file retries, response loss, races, storage failure and rollback for both entities.

## Out of scope

UI/layout/preview implementation; general autosaved Order/Shipment drafts; historical-arrival creation uploads; defining inline Order creation orchestration; new file formats or limits; public sharing; parsing/OCR or document-number extraction; new readiness or movement behavior; route/membership editing; fiscal-document changes.

## Context for agents

Production source reviewed read-only through gh on 23 October 2026 in Frontline-Forwarding/frontline-forwarding, main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. This is source evidence, not deployed-state verification. Read current repository guidance before implementation.

| Source | Current contract / implementation context |
| -- | -- |
| docs/workflows/attachments.md | Existing-parent attachments, access, audit, inheritance and separation from structured transport documents. |
| App web/attachments/service/AttachmentsApiService.java; web/attachments/AttachmentsRestApi.java | Existing upload requires a permanent referenceId. Validation uses extension allowlist, normalized filename and byte size; caller MIME defaults to application/octet-stream. PHOTO follows image MIME or photo extension. No content sniffing/scanning guarantee. Each upload currently generates fresh identity. |
| App domain/attachments/Attachment.java; AttachmentRepository.java; web/attachments/output/AttachmentOutput.java | Permanent owner/metadata, inheritance and exposed provenance. |
| App src/main/resources/db/migration/V2__purchase_order_and_shipment_attachments.sql | Exactly one permanent owner; pending files cannot simply be inserted with both owners null. Inheritance protects source removal. |
| App system/storage/SystemFileStorageService.java | Private external storage is not part of the relational transaction. |
| App web/purchaseorders/service/PurchaseOrdersApiService.java; web/shipments/service/ShipmentsApiService.java | Shared transactional creation boundaries including children, split/reservation, warehouse and audit/journey effects. Current create inputs lack pending context/attempt references. |
| App web/purchaseorders/{PurchaseOrdersGraphQlApi,PurchaseOrdersRestApi,PurchaseOrderMcpTools}.java; web/shipments/{ShipmentsGraphQlApi,ShipmentsRestApi,ShipmentMcpTools}.java | All creation adapters delegate to the shared services. Existing MCP creates declare idempotentHint=false; distinguish new context replay from legacy no-context calls. |
| App src/main/resources/graphql/{purchase-orders,shipments}.graphqls | Creation input/result contracts to extend consistently. |
| Client src/routes/secured/purchase-orders/new.tsx; src/features/purchase-orders/components/purchase-order-form.tsx; src/features/attachments/services/attachment-service.ts | Existing Order creation navigates to Details; multipart attachment upload requires a permanent referenceId and has no upload-operation identity. |

App Java paths above are relative to frontline-forwarding-app/src/main/java/com/frontline/forwarding/ unless prefixed src/. Client paths are relative to frontline-forwarding-client/. Proposed staging and recovery operations are new requirements.

## Post-deployment verification

Use authorized read-only records produced by normal operations. Run mutations, negative cases, retries, expiry and failure injection only in nonproduction; inspect their evidence. Missing production examples remain unverified.

| AC | Read-only verification |
| -- | -- |
| 1–2 | Inspect staging authorization/validation evidence for both entities, cross-user/context/entity cases and exact limits; inspect documented pending reads without uploading. |
| 3 | Inspect lost-upload-response replay and conflicting-operation tests, verifying one pending reference per operation and separate intentional uploads. |
| 4 | Compare existing created Orders/Shipments and selected-attachment evidence with original metadata, child/state/participation records and audit; inspect injected association/storage rollback tests. |
| 5–6 | Inspect confirmed-rejection corrections, uncertain responses, same/different payload retries, concurrent/no-file creation and post-expiry recovery evidence; verify one permanent identity and no repeated effects. |
| 7 | Inspect cleanup/retry audit and expiry/removal/abandonment race evidence; verify committed attachments remain readable. |
| 8 | Read permitted permanent and inherited attachments/provenance; inspect compatibility and authorization regression results, with no extra document/lifecycle/email effects. |
| 9 | Inspect consumer contracts and historical-flow test evidence for no pending-upload promise; read existing historical Shipment attachments through ordinary authorized reads. |
| 10 | Inspect deployed API schemas, migration/regeneration results, configured policies and release evidence; confirm compatible consumer versions and documented legacy/new retry semantics. |

**Reference:** Production source paths above; [FRO-325](https://linear.app/front-line-ltd/issue/FRO-325) normal Shipment creation; [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) and [FRO-341](https://linear.app/front-line-ltd/issue/FRO-341) creation presentation; [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) and [FRO-316](https://linear.app/front-line-ltd/issue/FRO-316) saved Details.
