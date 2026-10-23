# FRO-344 review — 23 October 2026

Status: first interview round accepted; second-round fiscal decisions pending. Linear has not been changed. Initial findings below retain the review context; the accepted-decisions section supersedes their open-question status.

## Workflow

- 0 Preflight: planning fast-forward pull succeeded; gh authenticated as frontlineltdproject-star and live production reads succeeded; Linear issue/comments/board reads succeeded. Optional get_agent_context endpoint is unavailable.
- 1 Grill: grilling and domain-modeling loaded; focused read-only research delegated under grilling. First round accepted; dependent fiscal round pending.
- 2 Canvas / 2b Preview: skipped; FRO-316/FRO-341 own existing presentation. FRO-165 is archived email tagging, not Shipment UI.
- 3 Spec check: initial consumer trace below; revisit after decisions.
- 4 Ticket: no replacement draft or write yet; full draft and explicit approval required.
- 4e UI branch: skipped, expressly prohibited by user.
- 5 Memory: review checkpoint recorded; no newly resolved vocabulary or ADR.
- 6 Verify: review evidence only; no implementation/deployment verification.

## Current issue and evidence

FRO-344: Shipment Details — Editing pre-dispatch and readiness invalidation. Todo; Pending_Review and Shipment; No priority; Pre-releases 0.0.x / 0.0.7. Updated 2026-10-20T11:09:54.879Z. No comments, attachments or documents returned. Blocks FRO-316; no blockers; related FRO-343/341/292/339/326/325/345. Preserve metadata unless explicitly approved otherwise.

Read current target and FRO-165/316/341/325/339/345/303/357/323, and current target/325/339/345/316 comments. Production main is now 38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e, newer than the ticket's 3820e89 evidence. The intervening delivery-note address changes make preservation of operator-entered snapshot addresses particularly relevant. Production access was read-only.

## Findings and consumer impact

| Consumer or affected area | Current behavior and source | Required outcome / unresolved question | Owner |
| --- | --- | --- | --- |
| Draft delivery-note lines/totals | DeliveryNoteDraftSourceService reads participating Orders/current active nonterminal collis; DeliveryNoteDraftPlanner groups by invoice company and vessel. DeliveryNotesApiService.createForShipment skips companies with an existing current note. Running preparation again does not rebuild existing draft lines. | Resolve the ticket's explicit draft-reconciliation TODO. Define added/removed/changed lines, totals, new/empty company groups, operator values, versioning and document permission; no automatic fiscal actions. | FRO-344 reconciliation; reuse FRO-303 safeguards and FRO-357 eligibility. Decision pending. |
| Fiscal snapshots and entered route details | docs/workflows/delivery-note.md and DeliveryNotesApiService: addresses and movement details are retained operator-editable snapshots; submitted/failed/pending states protect fiscal identity/payload. | A field-impact matrix must distinguish goods changes from route changes, preserve unaffected values, require explicit resolution of affected entered values, and protect every submitted/uncertain state. CANCELLED history stays unchanged. Never blanket-block unrelated edits. | FRO-344; existing delivery-note workflow. |
| Origin eligibility and dependent address choices | FRO-357 defines Greek Frontline-operated origin eligibility. Current delivery-note address sources derive destination choices from participating Clients, while selected address values persist. | Origin edits must re-evaluate fiscal eligibility; membership changes refresh available client address choices without silently rewriting saved address snapshots. Ineligible new draft creation must not occur. | FRO-357 eligibility; FRO-344 edit integration. |
| Participation removal and re-addition | V1 schema participation/content close guards permit ARRIVED/CANCELLED, not pre-dispatch editing; source identities are immutable. | Define removal/release history and new participation on re-addition. Add migrations for affected guards/reasons; do not overwrite old attribution or fabricate an arrival/cancellation. | FRO-344, correlated through FRO-345. |
| Partial removal from an already reserved Order | FRO-325 partial creation allows only IN_STOCK; stocked reserved Orders become PREPARED_FOR_SHIPMENT. FRO-344 permits colli edits but refers to existing split restrictions. | Decide whether a stocked reserved Order can be reduced with an explicit atomic child split, or only removed whole. Never silently ship a subset or release reservations first to manufacture eligibility. | FRO-344 decision; reuse FRO-325 lineage rules. |
| Separate route and membership editors | FRO-344 validates complete plans and forbids route mutation in membership payloads; FRO-316 uses separate editors. | A desired valid final plan may have no valid intermediate save (e.g. replace all cargo while changing origin). Decide whether to keep this limitation or coordinate a combined validated edit. Do not silently broaden UI scope. | FRO-344 business contract; FRO-316 if coordination changes needed. |
| Packing reconciliation and physical history | FRO-325 now distinguishes saved plans from attested physical packing; it preserves historical load-unit references and physical arrangement. FRO-344 rejects empty resulting units. | Remove only current assignments; preserve confirmed arrangements/history. Identify emptied units with an actionable path through existing packing editor. Membership edits alone must not assert physical unpacking. | FRO-344 integration; FRO-325 packing. |
| Retained vs new eligibility and release | Existing creation eligibility is narrower than the own-reservation exception; cancellation restores stocked reserved Orders to IN_STOCK while upcoming statuses remain their current status. | Specify retained membership validation separately from new-candidate rules; release restores current stock/readiness facts, not stale creation-time status. Recheck allocations, terminal state and origin under shared locks. | FRO-344; FRO-325 lifecycle/creation. |
| Versioning, retries and history | FRO-345 now specifies stable caller request identities, conflict on key reuse with different input, committed-outcome reads and atomic operation/source links. Current Shipment GraphQL lacks a version. | Consume the agreed retry contract and define expected version/affected-record checks. No duplicate splits, releases or audit after lost responses. Notes/comments must not falsely invalidate a reviewed material plan. | FRO-344 commands; FRO-345 history; FRO-325 confirmation. |
| Read consumers and totals | FRO-316 reads canonical membership/packing; FRO-323 is explicitly creation-only and applies unallocated-IN_STOCK rules. | Explicitly own saved-Shipment source lookup adaptation (own reservations and retained selections), exact IDs/lineage, totals, DG counts and PCS retirement; do not simply reuse creation eligibility unchanged. | FRO-344 saved editing; FRO-323 reusable lookup; FRO-325/295/297 totals. |
| Release and usable entry points | FRO-344/FRO-325 milestone 0.0.7; FRO-316/FRO-341 milestone 0.0.9. | Coordinate activation with compatible supported consumers; specification relationships are not proof all operations can be used in the earlier release. No automatic milestone/relation edits. | FRO-344/325 with UI owners. |

Java source paths above are under `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`: `web/deliverynotes/service/DeliveryNoteDraftSourceService.java`, `DeliveryNotesApiService.java`; `domain/deliverynotes/DeliveryNoteDraftPlanner.java`. Shipment evidence: `web/shipments/service/ShipmentsApiService.java`, `domain/shipments/` repositories and `frontline-forwarding-app/src/main/resources/db/migration/V1__initial_schema.sql`; API `src/main/resources/graphql/shipments.graphqls`.

## First decision round

1. Draft goods reconciliation: recommend atomic refresh of affected unsubmitted draft goods/groups/totals, preserving unaffected snapshots and operator-entered details. Reject unresolved conflicts with actionable feedback; never issue/cancel automatically. Route-address reconciliation specifics depend on this choice and follow in the next round.
2. Existing stocked reserved Order partial removal: recommend allowing an explicit reviewed atomic split for the retained selected collis, releasing the remainder while preserving permanent identities and lineage; no temporary public unreservation. Alternatively require whole-Order removal and later explicit re-addition/splitting. This is a proposed extension, not something current code supports.
3. Route/membership changes with no valid intermediate save: recommend retaining separate existing editors for this ticket and explicitly rejecting the combined case, with a clear limitation. Supporting it requires a coordinated contract and agreement on FRO-316 integration; no extra UI is assumed or built.
4. Retained upcoming cargo: recommend that an elapsed expected-readiness date alone does not eject an already reserved Order or block unrelated valid edits; new additions still use current creation eligibility and readiness still requires confirmed stock. No-op saves must remain no-ops. This boundary is not settled by the existing ticket.

Additional verified authorization detail: `ShipmentAuthorizationService` requires SHIPMENT_EDIT and Frontline/system-admin identity; that class does not implement an additional company-record-specific scope check. Describe the actual policy rather than asserting an unverified scope mechanism. A safe resolution for the empty-overpack sequence is to remove/unpack it through FRO-325 first, then retry membership; this preserves the existing separate-operation rule.

## Next steps

Resolve dependent fiscal semantics, finish consumer outcomes/owners, then apply frontline-linear-issues (read) and show the complete standalone replacement with before/after comparisons outside it. Preserve all existing issue metadata and attachments. No Linear mutation until explicit approval of the shown text. No production branch, code/database write or preview deployment.

## Accepted decisions — first round

User accepted Q1–Q4 on 23 October 2026:

1. Atomically reconcile affected unsubmitted draft goods, company groups and totals on membership edits; preserve unaffected snapshots/operator values and reject unresolved conflicts. Never automatically issue/cancel fiscal documents.
2. Permit explicit reviewed partial reduction of stocked reserved Orders. The retained selected collis become the participating child and the remainder is released; preserve permanent identities, valid packing and lineage. No publicly observable release-before-split intermediate state.
3. Keep separate route and membership editors. Reject an origin/cargo replacement with no valid intermediate save; resolve through existing cancellation/creation workflows rather than expanding this ticket to a combined plan editor.
4. A passed expected-readiness date alone does not evict retained upcoming cargo or block unrelated valid edits. New additions retain current eligibility; readiness still requires stock confirmation.

Reasons: allow practical correction without stale documents, preserve exact child participation, avoid expanding UI scope, and distinguish existing reservations from new availability.

Fresh target read is unchanged at 2026-10-20T11:09:54.879Z; main remains 38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e. Mandatory planning pull succeeded. No new term or qualifying architectural decision was resolved.

## Second decision round — proposals only

Q5. Route changes can affect operator-entered loading/destination addresses or other movement details on existing drafts. Recommend explicit review/confirmation or correction of the affected draft values, saved atomically with the route edit, retaining unaffected values. Do not guess addresses from geography or silently overwrite snapshots. FRO-316 owns any required integration into its existing edit/review flow; no separate UI is built here. Until an adapter can supply the explicit resolution, reject the affected route edit with actionable feedback.

Q6. If an otherwise valid origin edit makes the Shipment ineligible for Front Line delivery notes, recommend allowing explicit removal of existing wholly unsubmitted DRAFT notes in the same authorized transaction, retaining audit evidence and creating no replacements. Issued, submitted, failed-with-fiscal-identity and uncertain documents remain protected until their existing reconciliation workflow resolves them. This is a proposal for future application behavior, not authorization to delete current records.
