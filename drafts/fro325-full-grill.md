# FRO-325 full grill — reopened 23 October 2026

User requested a full interview after the approved revision was saved, then instructed: leave it unchanged if no concrete omissions remain. Continue with Astra. No current authorization to change Linear again. Do not re-ask settled decisions or manufacture changes.

## Workflow checklist

- [x] 0 Preflight: planning pull succeeded; refreshed full FRO-325/comments, live gh access/main and relevant linked contracts.
- [x] 1 Grill: Q1/Q2/Q3 recommendations accepted; no remaining business-decision frontier found.
- [x] 2 Canvas: skipped; FRO-316/FRO-341 own presentation.
- [x] 2b Preview: skipped; no new UI required.
- [x] 3 Spec check: accepted rules reconciled across commands, lifecycle, physical history, legacy records, consumers and verification.
- [x] 4 Ticket: full revision shown, approved with οκ, saved and independently re-read on 23 October 2026.
- [x] 4e UI branch: excluded by user instruction.
- [x] 5 Memory: reopened scope and unresolved questions recorded; update as decisions resolve.
- [x] 6 Ticket verification: saved description matches approved draft; metadata, relations and attachments preserved. Deployment checks remain deferred until implementation.

## Evidence baseline

- Current FRO-325 unchanged at `2026-10-23T12:30:06.313Z`, Todo, Shipment/Pending_Review/Backend/Epic, existing metadata/relations/attachments retained; no comments.
- Live production main remains `3820e89e8caa341261e2d48bcb282d93e1bb1d03`, authenticated gh access verified. Continue same task's previously loaded committed playbook snapshot, SHA-256 `b1a66b227355e92a45dc1cafa04530b915516bd4f5baa38d3ac7f81a7556d7dc`; no new snapshot or production changes.
- Fresh FRO-316/FRO-344/FRO-345 reads used for ownership and flow comparison. Prior source review remains applicable at unchanged main; targeted gh reads rechecked unresolved branches.

## Decision tree / coverage

| Branch | Current coverage | Next action |
| -- | -- | -- |
| Creation identity, exact membership, full/upcoming and partial IN_STOCK selections | Saved spec preserves existing whole-Order/child/reservation rules and atomicity | No new decision found |
| Save packing before stock | Already allowed; confirmation requires every Order stock-confirmed at origin | Preserve accepted decision |
| Meaning of confirmation | Does Ready attest completed physical packing, or merely approve a plan? | Q1 below; subsequent physical-history implications depend on answer |
| Changed plan explicitly confirmed while Ready | Confirm operation can save a submitted plan as Ready, but blanket changed-save wording says Preparing | Q2 below |
| Changed ordinary save/no-op | Saved spec defines changed values/assignments and canonical comparison; ordinary changes invalidate | Preserve; distinguish ordinary Save from explicit confirmation through Q2 |
| Weight/dimension validation | Positive dimensions; gross/net optional; existing validator requires supplied gross > 0 and 0 <= net <= gross | No invented mandatory weight requirement |
| Document assign/replace/clear | User accepted clearing before dispatch, readiness retained, dispatch blocked until valid number | Preserve accepted decision |
| Cancelled Shipment document uniqueness | Existing global check includes other Shipments regardless of status; cancellation retains number | Already covered by preserve-global-uniqueness rule; no new decision |
| Cancellation and child lineage | Release/rollback without merging children; later-state editing locked | Already covered |
| Concurrency/retries/authorization | Expected version, shared command races, no duplicate effects, existing internal authorities | Already covered; implementation choices remain developer-owned |
| Geography/DG/PCS/rollout | Linked contracts and three accepted decisions explicitly covered | Preserve |
| Physical journey / prior packing history | Historical refs preserved, but new physical attestation point unclear | Downstream of Q1; do not invent a separate physical-operation UI |
| History ownership | Saved325 calls FRO-345 history/comments presentation scope; current345 is structural persistence/read/write with no UI | Factual correction: FRO-345 structural history APIs/persistence; FRO-316 presentation |
| Existing records and post-deployment checks | Preserve existing states/history, no guessed confirmation/geography, source-backed checks | Already covered |

## Round 1 — unresolved decisions, not approvals

**Q1 — What does Confirm ready attest?** Goods are stock-confirmed and the operator has entered a valid pallet/box arrangement. May they confirm Ready before warehouse staff physically execute that arrangement, or must packing already be complete and match it? Recommendation: ordinary Save may describe a plan; Confirm ready attests the actual completed arrangement, including goods travelling individually. Transport-document absence remains allowed under the prior decision. Do not infer new event types or controls before the answer.

Evidence: `docs/workflows/shipment-lifecycle.md` says LOADED means physically placed in a pallet/box. `ShipmentsApiService.java:529–555` currently emits RESERVED and then LOADED for initially assigned load units without a separate physical-action input. `purchase-order-colli-journey.md:348–353` distinguishes physical journey facts from activity/state audit. Saved325 allows draft packing before stock and prohibits fabricated completed loading events, but does not state whether readiness attests actual packing.

**Q2 — Can explicit confirmation replace a Ready plan directly?** A Shipment is Ready with packing A. The operator changes to B and explicitly reviews/confirms B. May one atomic confirmation save B and keep Ready, or must they first Save B (Preparing), then confirm separately? Recommendation: explicit confirmation of the current valid B may atomically keep Ready with a fresh plan/version confirmation; ordinary Save B still returns Preparing. Preserve prior confirmation/audit and reject stale input. This clarifies operations without adding UI.

Evidence: saved325 Confirm readiness row allows submitted arrangement in an eligible pre-dispatch state -> Ready, whereas lifecycle and AC5 say changed saved packing invalidates readiness without distinguishing the explicit confirmation operation. FRO-316 has separate ordinary Save and review/confirmation controls; no requirement for a mandatory intermediate persistence step is explicit.

User accepted both recommendations on 23 October 2026. Ready attests completed physical packing, including all-individual arrangements; an explicit reviewed confirmation may save a changed arrangement and retain Ready atomically, while ordinary changed Save invalidates it. Preserve earlier confirmations and reject stale input. The reason is to distinguish planning from completed preparation without forcing an artificial intermediate save/state transition.

Shipment readiness vocabulary recorded in CONTEXT.md immediately. No qualifying architectural decision warrants an ADR. Keep the approved saved ticket and draft unchanged until downstream physical-history implications are resolved and any resulting full revision receives fresh approval.

## Round 2 — physical history

Q3: Should explicit readiness confirmation also establish the confirmed physical arrangement in each affected colli's journey, including movement between overpacks or back to individual transport? Recommend yes: creation-time packing and ordinary Save are plans/activity only; explicit confirmation records the attested physical arrangement and changes from the last confirmed physical arrangement. Intermediate saved plans are not physical events. Preserve prior facts, link effects to one confirmation operation, and avoid duplicate effects when the arrangement is unchanged. Confirmation time is the attestation time, not an invented exact time of warehouse handling. Exact event/schema design remains implementation work, with no new UI implied.

Evidence: current FRO-345 (updated 2026-10-20) distinguishes packing save/change, readiness confirmation and one logical operation with linked effects. Journey documentation defines immutable physical trace with load-unit references; HandlingUnitJourneyEventType currently has LOADED but no unpack/unload/repack equivalent. Existing creation emits LOADED for initial assignments; this must be reconciled with the accepted planning-versus-physical distinction. FRO-325 owns command effects, FRO-345 owns history persistence/read contracts, FRO-316 remains presentation owner.

User accepted Q3 and requested the revised ticket if no further gap remained. No further business decision emerged. Current Linear FRO-325 re-read unchanged at 2026-10-23T12:30:06.313Z. Complete revised description is in drafts/fro325-reviewed-spec.md, pending fresh full-text approval; no Linear write.

## Final consumer reconciliation

| Area | Current evidence | Agreed outcome | Owner |
| -- | -- | -- | -- |
| Creation and ordinary packing saves | Creation currently emits LOADED for assignments; API service and lifecycle docs | Save plans without asserting physical work | FRO-325 |
| Confirmation and status history | Saved325 ambiguous about changed Ready arrangement; FRO-316 separates Save/review/confirm | Physical attestation; direct atomic reconfirmation; no artificial state cycle | FRO-325; FRO-345 history; FRO-316 UI |
| Colli journey/load-unit references | Immutable physical journeys, existing LOADED, no unpack/repack equivalent | Trace confirmed first packing and actual arrangement changes; preserve historical references, avoid duplicate physical effects | FRO-325 command/physical effects; FRO-345 history contracts |
| Legacy arrangements/timestamps | Existing preserved journeys, uncertain older provenance | Retain explicit facts; first attestation where baseline unknown; no invented physical occurrence time | FRO-325 |
| UI and rollout | FRO-316/FRO-341 presentation; coordinated activation already accepted | Consume clarified contracts using existing owned flows; no new UI/preview/branch | Linked UI owners; FRO-325 activation |
| Documents, stock, geography, DG, PCS, fiscal, cancellation, permissions/concurrency | Existing source trace and prior accepted spec | Preserve agreed requirements and ownership | Existing owners |

Revision changes only those accepted clarifications and the factual FRO-345 ownership correction, plus corresponding acceptance criteria, implementation context and read-only verification. All existing metadata, relations and attachments are to remain unchanged. No new glossary term beyond readiness, and no ADR warranted.

Final source check: main advanced to 38edae8e3cf92b9c6f8b4b9b53febcd96ce5c03e (FRO-307 delivery-note addresses). Inspected changed-file inventory and relevant service/workflow/authorization/migration/types patches. Shipment lifecycle, packing service/repository and journey definitions are unchanged. New address-source behavior preserves note snapshots, consistent with this ticket's preservation requirements. No additional product decision or scope expansion required; source reference refreshed. No production writes.
