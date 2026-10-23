# FRO-342 review — 23 October 2026

## Scope and workflow

Review requested against project workflow. Planning `git pull --ff-only` succeeded. GitHub CLI authenticated read access verified; full current Linear issue, linked 335/341/316/326/325/324 and current labels/statuses read. Linear agent-context tool returned unavailable; no notes were retrieved from it.

Target baseline: updated 2026-10-23T13:51:31.724Z; Todo; Shipment, Order, Pending_Review, Backend, Story; milestone 0.0.8; blocks335/341, related325/316; no attachments/documents. No Linear mutation. Treat FR0-326 in request as FRO-326, the existing Order Details issue.

Preflight complete. Interactive clarification in progress. Canvas/preview skipped: existing presentation owners cover this capability. Production branch explicitly excluded. No production implementation or deployment verification.

## Findings

1. Delivery ambiguity: target says design/specification-only and excludes implementation, while acceptance criteria describe delivered backend capability. User accepted Q1: make it a backend implementation specification; this chat remains planning-only.
2. FRO-335 contradicts342: confirmed Order creation precedes uploads; partial-upload recovery retains a saved Order; unknown-create recovery explicitly has no backend idempotency; cancellation says no writes. Its current description must be reconciled before integration, preserving all unrelated UI/business rules.335 is milestone0.0.5 while342 is0.0.8; document compatible rollout without silently changing milestones.
3. FRO-341 historical ARRIVED section promises pending attachments under342.342 explicitly excludes historical-arrival integration.324 owns historical atomic effects and does not supply that attachment contract. Resolve scope rather than treating either interpretation as settled.
4. Creation idempotency is specified but per-file staging retry after a lost response is not. Current attachment upload creates a new UUID/object and metadata row each time. Propose stable file-operation identity and recovery of the same pending reference, distinct from intentional repeat uploads.
5. Context/draft versus submission-attempt lifecycle needs precision. Clarify corrected payload after confirmed rejection, unknown/in-flight payload immutability, one successful record per context including no-file submissions, and result recovery independently of temporary-byte expiry. Existing leftover-file cleanup can remain; closing a context to new creation need not immediately delete leftovers.
6. Describe supported GraphQL/REST/MCP creation contracts explicitly and preserve legacy no-file callers. Specify actionable per-file, validation, conflict, expired and outcome-recovery reads/errors without inventing endpoint names.
7. Complete implementation handoff: pending persistence cannot use an ownerless permanent freight_attachment under current ownership constraint. Preserve existing records, audit and inheritance; specify migration/configuration/cleanup evidence and technical policy values before rollout. Existing bounded expiry policy remains a developer-owned value, not an invented number.
8. Validation wording: exact limit25*1024*1024 bytes; current extension allowlist plus filename/nonempty validation. MIME is caller-provided with octet-stream fallback; PHOTO follows image MIME or photo extension. Do not imply existing content sniffing/scanning.

## Consumer impact

| Consumer | Current source/behavior | Required outcome and owner |
| --- | --- | --- |
| Order creation | PurchaseOrdersApiService.create; GraphQL/REST/MCP share service, existing input has no pending refs |342 associates selected attachments in creation transaction; preserve child/state/audit rules and no-file calls;336 retains initial-state ownership |
| Shipment creation | ShipmentsApiService.create; exact selection/partial children/reservations |342 association preserves325 creation integrity and PREPARING outcome |
| Creation UI |335 post-create uploads;341 pending uploads |Presentation stays335/341;335 reconciliation required; historical341 conflict unresolved |
| Saved Details |326 AttachmentPanel;316 ordinary Shipment attachments |Preserve ordinary list/download/remove; no pending controls or new UI |
| Splits/inheritance |AttachmentRepository.inheritPurchaseOrderAttachments invoked by manual and partial-Shipment splits |Preserve parent sole ownership, links/no copied bytes, child read-only and owner removal guards |
| Private storage and cleanup |AttachmentsApiService and SystemFileStorageService; put/get/delete outside DB transaction |342 coordinates pending ownership, recoverable storage failure, cleanup and committed-file protection |
| Historical ARRIVED |324 historical transaction;341 promises pending uploads |Scope decision pending; do not expand342 automatically |

## Source evidence

Read live repository via gh on23 October2026; creation trace revision5c51030680c9d45b3827a7e19b8320c19aa5ed9a. This is source verification, not deployed-state verification.

- docs/workflows/attachments.md: ownership, scope, removal, split inheritance and document-number separation.
- frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/attachments/service/AttachmentsApiService.java: validation, authorization, upload UUID, storage coordination, ordinary read/remove.
- frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/attachments/AttachmentRepository.java: insertion and inheritance.
- frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/attachments/output/AttachmentOutput.java: exposed audit/metadata and inherited provenance.
- frontline-forwarding-app/src/main/resources/db/migration/V2__purchase_order_and_shipment_attachments.sql: one owner constraint and inheritance removal guards.
- frontline-forwarding-app/src/main/java/com/frontline/forwarding/system/storage/SystemFileStorageService.java: external storage abstraction.
- frontline-forwarding-client/src/features/attachments/services/attachment-service.ts: current multipart file upload without operation identity.
- frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/purchaseorders/service/PurchaseOrdersApiService.java and web/shipments/service/ShipmentsApiService.java: creation boundaries and split effects.

## Pending decisions

- Q1 accepted: backend implementation specification.
- Q2: retain historical-creation exclusion (recommended), or include historical ARRIVED association.
- Q3: also prepare narrowly scoped335 correction draft (recommended), or342 only.
- Q4: accept explicit file/creation recovery guarantees above (recommended), or revise them.

No complete replacement drafted or approved yet. No glossary change or ADR earned. Keep before/after review outside final descriptions. Re-read342 and consumers before eventual write; preserve metadata, labels and attachments. All writes require full-text approval under AGENTS.md.
