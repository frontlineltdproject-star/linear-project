# FRO-323 review — 23 October 2026

## Status
Interview complete; complete replacement in fro323-reviewed-spec.md awaits explicit Linear write approval. No Linear mutation or UI/production branch/code/database/deployment work.

## Evidence
Mandatory planning git pull --ff-only succeeded (initial sandbox denial recovered through approved escalation). Live gh auth and production reads verified at main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Full FRO-323/comments (none), current labels/statuses, and linked316/341/324/325/343 read. Target updatedAt2026-10-23T13:30:52.471Z.
Read current planning AGENTS, MEMORY, CONTEXT, relevant WORKFLOW_LEARNINGS and grilling/domain-modeling/frontline-linear-issues skills. Grilling-required read-only subagent traced backend consumers.
Remote production root/app and domain/playbook guidance read. No production checkout/local playbook loader was used; no captured policy fingerprint is claimed. Optional Linear get_agent_context unavailable; direct issue reads work. No deployed-version verification or app tests claimed.

## Findings and consumer trace
| Consumer / area | Current behavior and source | Required outcome | Owner |
| -- | -- | -- | -- |
| Historical contents | ShipmentLoadUnitContentRepository.findByShipmentId includes closed rows; ShipmentOutputAssembler uses loading-time ownership and partitions loose/repacked | Preserve exact carried identities; resolve current attribution separately; consume324 null/closed historical records |323 reads;324 historical creation |
| Completeness / split | ShipmentsApiService311–398 loads every current member, excludes terminal IDs for completeness, rejects obsolete/missing partial decisions | Complete batched current-Order context outside source/pages, union-level partial calculation; no automatic extras |323 read context;325 creation;341 UI |
| Availability | ShipmentsApiService347–349 excludes allocations across all current members | Explicit Order-wide restrictions with safe stable reasons; independent origin counts |323 |
| Cross-Order route | validateDeliveryVessel requires one common non-null vessel for direct delivery | Separate combined-route validation, retain selection on conflict |325 validation;323 contract;341 presentation |
| Review staleness | Current create compares membership at command start versus locked state, not prior user review | Protect reviewed attribution/completeness at submission; renewed review on change |323 shared-command extension with325 |
| Frontend consumers | shipment-service direct candidates page0/size100; composer computes full/partial from availableCandidates | No dependence on first-page candidate completeness; clear dependent state on origin change; preserve other draft values |323 API;341 UI |
| Authorization | ShipmentAuthorizationService requires internal/admin identity and action authority | Preserve VIEW/history and CREATE/eligibility boundaries; safe reasons/counts; no partner access expansion |323 |
| Presentation |341 omits arrival-date summary, previous-Order/warehouse subtitles;316 consumes resulting ordinary Shipment | Remove stale display prescriptions; no new UI, canvas or preview |341;316 preserved |
| Release |323 milestone0.0.8,341 milestone0.0.9 | Backend preparation earlier, compatible coordinated activation without milestone changes |323/341 structural owners |

## Accepted decisions
Q1: retain selected permanent IDs/unrelated draft values, flag changed attribution or current-Order completeness, require renewed review and enforce reviewed scope server-side.
Q2: coordinate activation with compatible341/required structural contracts; preserve milestones.
Q3: counts describe origin availability independent of route/current selection; validate combined route separately and block incompatible creation without silent removal.

## Proposed before / after
- Historical contents/current attribution only -> also supply complete current-Order membership context for partial evaluation.
- Per-colli unallocated plus generic restrictions -> explicitly preserve Order-wide reservation restrictions.
- Existing transactional revalidation -> additionally protect user-reviewed attribution/full-partial scope across draft lifetime.
- Undifferentiated available count -> origin availability distinct from route compatibility.
- Unknown-date/historical reference implicitly covered -> explicit324 closed historical participation and unknown facts.
- Show previous reference/current location -> return authorized facts; follow341's selected omissions.
- Earlier milestone without activation condition -> coordinated activation with compatible consumers.
- Outdated October5/13 source prose -> fresh23October source evidence, implementation references and concrete verification.

## Preservation receipt
Title: Shipment — select eligible collis from arrived shipments.
Todo; Shipment, Pending_Review, Backend, Story; No priority; project Pre-releases0.0.x / milestone0.0.8. Preserve all other metadata.
Blocks341; no blockers; related320/316/325/324; no duplicate.
One attachment f8429aff-301b-4a37-986f-9df06369b794, Interactive UI preview, https://fro-323-996a85.pages.dev ; no documents.
Proposed write description only; retain complete label set and existing relations/attachment. No Ready promotion or linked-ticket edits. Any save-generated extra relations must be detected, not silently accepted.
No new resolved vocabulary or qualifying ADR.
