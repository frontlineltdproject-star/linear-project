# FRO-325 full grill — reopened 23 October 2026

User requested a full interview after the approved revision was saved, then instructed: leave it unchanged if no concrete omissions remain. Continue with Astra. No current authorization to change Linear again. Do not re-ask settled decisions or manufacture changes.

## Workflow checklist

- [x] 0 Preflight: planning pull succeeded; refreshed full FRO-325/comments, live gh access/main and relevant linked contracts.
- [ ] 1 Grill: first remaining-decision round pending below.
- [x] 2 Canvas: skipped; FRO-316/FRO-341 own presentation.
- [x] 2b Preview: skipped; no new UI required.
- [ ] 3 Spec check: evidence/coverage below; finish after decisions.
- [ ] 4 Ticket: only propose a revision if findings justify it; show full draft and obtain fresh approval.
- [x] 4e UI branch: excluded by user instruction.
- [x] 5 Memory: reopened scope and unresolved questions recorded; update as decisions resolve.
- [ ] 6 Verification: deployment checks deferred until implementation; re-read any eventual authorized ticket write.

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

Await Q3 answer before final reconciliation/draft. Current Linear FRO-325 re-read unchanged at 2026-10-23T12:30:06.313Z.
