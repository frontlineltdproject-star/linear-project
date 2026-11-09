# Delivery Note review — 9 November 2026

## Scope and verification

Expected behavior was recorded in [the flow map](../flows/delivery-note.md) before reproduction tests. [24 scenarios](../scenarios/delivery-note.md) distinguish executed evidence from source inspection and outstanding integration work. Shipment participation/route/state are inputs only. Export/Customs/VAT review remains in the other chat.

Production main `6aa259553cd9c86a8aaa157902088aa9a6bca83e` was fetched through authenticated gh and rechecked unchanged after investigation. Current full tickets: FRO-247/307/361/357/283/284/285/308/344, plus FRO-373 for duplicate ownership. No production code, portal, database, AADE or email writes; no Linear changes. Deployed version unverified. Archive policy loader failed without Git metadata; direct instructions read, no successful loader fingerprint claimed.

| Check | Result | Limit |
| --- | --- | --- |
| Source integrity | 562/562 client source files byte-identical to fresh pinned archive | Dependency cache reused, not a clean lockfile installation |
| Existing targeted frontend suite | 32 tests passed across four files | Form validation, address-source helpers, card date conversion, service serialization/replacement behavior |
| New UI observations/controls | 5 passed | Two draft-loss cases, unchanged-version control, mixed replacement state, pending submission actions; service/auth mocked |
| Combined test invocation | 37/37, five files, 27.61 seconds | Node v24.13.0, Vitest 4.1.6; repository standard is Node 22.13+ |
| Timestamp expressions | Two observations passed under Java 11 | Exact formatting expressions with minimal Note stand-in; not full XML builder/backend execution |
| Backend/database/browser/AADE journey | Not executed | Installed Java 11 versus backend Java 25; no production/fiscal calls authorized |

The first UI observation run checked before React Query delivered its update and reported one harness failure; awaiting rendered state fixed the timing assertion. The production source was unchanged. Passing observation tests assert faulty behavior, not a successful fix.

## QA-DN-01 — unsaved movement fields disappear on refresh or save completion

**Reproduced frontend defect.** Type a new vehicle number without saving, then receive a higher note version from another writer. The form remounts with the other writer's saved number and silently loses the local draft. A refresh with the same version retains it (control).

Separately, submit `SUBMITTED`, continue typing `LATER TYPING` while the request is pending, then complete the first save. The form accepts the later text and then discards it. The saved request remains the originally submitted value; no incorrect backend persistence is claimed.

Cause: `delivery-notes-card.tsx:133` keys the entire editor by every note's ID/version; any version change recreates all local form state. At `:274`, save success also resets the form to the captured submitted values. Inputs remain editable during save. Preserve current local work or prevent incompatible typing; distinguish conflicts from deliberate discard. Exact UX requires review, not an assumed decision.

Ownership: FRO-307's entered-value preservation; related pattern in FRO-373, whose current acceptance criteria cover origin/Notes/arrival rather than this Delivery Note editor. Do not silently expand FRO-373.

## QA-DN-02 — replacement draft is unusable beside an issued sibling

**Resulting UI state reproduced; backend transition traced in source.** A Shipment has issued notes A and B. Cancelling A prepares a new A draft with no movement start/destination. B remains issued. The shared editor is hidden because not all notes are DRAFT, the common-save endpoint rejects mixed states, and A's issue/preview actions remain disabled by the saved-draft check. The ordinary UI cannot complete A without disturbing unrelated B.

Sources: `delivery-note-service.ts:176` cancellation followed by preparation; `DeliveryNotesApiService.createForShipment:55` creates only missing pairs with fresh draft defaults; `delivery-notes-card.tsx:162–170` all-note saved/editable checks; `DeliveryNotesApiService:199` rejects common save unless every current note is DRAFT. The separate individual-draft API exists, so this is an operator workflow blockage, not a claim that every API route is unusable.

Ownership: FRO-247 lifecycle; replacement-policy decisions overlap FRO-283. A scoped fix must preserve issued B and choose a deliberate way to complete A; changing all-note editing policy is not yet approved.

## QA-DN-03 — pending-submission reconciliation exists in backend but has no UI entry

**UI absence reproduced and backend path traced.** After a transport-uncertain submission the note remains SUBMISSION_PENDING. Its card displays the status but no action buttons. Reopening cannot invoke the already-implemented reconciliation path through the normal UI.

`DeliveryNoteIssuanceService:43–47,77` recognizes pending status, validates its version and queries transmitted documents without resending. `delivery-notes-card.tsx:924,953` supplies draft/failed actions and fiscal actions for issued/cancelling/cancelled, but none for pending. No background reconciler was identified in the inspected call path.

**Existing owner FRO-284**, aligned with FRO-285. Its description still says all transport failures become SUBMISSION_FAILED, unlike current main. Update/reconcile existing scope before proposing a duplicate ticket. Unresolved backend submissions must never be retried as new documents.

## QA-DN-04 — XML and PDF can describe different movement dates/times

**Formatting mismatch reproduced; complete backend/database reproduction outstanding.** `DeliveryNoteService.update:90` serializes movement time to UTC using `toISOString()`. `AadeDeliveryNoteXmlBuilder:111–112` formats the OffsetDateTime directly into separate date and time fields, dropping the offset. The PDF factory `:69–73` explicitly converts the same instant to Europe/Athens.

Synthetic fixture: `2026-11-10T00:30+02:00` equals `2026-11-09T22:30Z`. For the UTC representation, current XML expressions emit **9 November, 22:30**, while PDF expressions emit **10 November, 00:30**. A summer fixture differs by three hours. Changing only the representation of the same instant changes XML output but leaves the PDF unchanged.

This establishes a document-consistency defect, not a claim about AADE's current statutory contract or a live incorrect submission. Confirm the real JDBC timestamp representation and fiscal timezone contract in an isolated backend test before implementation. Inspect issue-date and reconciliation-date consistency too; they are adjacent unverified cases, not additional reproduced findings.

Owner: FRO-247 document generation; no exact duplicate identified in the delivery-note search. Proposed correction must agree a common business timezone across persistence, XML, PDF and reconciliation.

## QA-DN-05 — cancellation ambiguity is treated as confirmed failure

**Source-supported risk, not executed backend reproduction.** `DeliveryNoteCancellationService:48–49` catches every runtime exception from the cancellation call and invokes `lifecycle.fail`; repository `failCancellation` unconditionally moves pending cancellation back to ISSUED. `RestAadeMyDataClient.cancelInvoice` wraps transport errors too. Therefore, if AADE accepts cancellation but its response is lost, the local status returns to ISSUED despite an unknown external outcome. Conversely, failure persisting an accepted response can leave CANCELLATION_PENDING, and `prepare` only accepts ISSUED.

Current documentation describes the return-to-ISSUED behavior, so its recovery policy needs explicit review. The source establishes the branch; it does not establish that this incident occurred or how AADE handles a repeated cancellation. FRO-283/285 own related lifecycle decisions; do not assume FRO-284's initial-submission design covers cancellation automatically. Next evidence needed: isolated accepted-but-response-lost and accepted-but-local-save-failed tests, with no external calls.

## Consumer and ownership trace

| Consumer/area | Current behavior/evidence | Required outcome and owner |
| --- | --- | --- |
| Shared draft form and query refresh | QA-DN-01 reproduced | Retain accepted local work; FRO-307 / new scoped bug only after approval |
| Per-company replacement beside protected siblings | QA-DN-02 UI reproduced, source chain checked | Usable replacement without changing sibling fiscal records; FRO-247 + FRO-283 decision |
| Pending submission UI and issuance service | QA-DN-03 reproduced UI, backend source | Reach safe reconciliation; existing FRO-284/285 |
| Movement serialization, XML, PDF | QA-DN-04 expression reproduction | Same business date/time, isolated persistence verification required; FRO-247 |
| Cancellation adapter/service/repository | QA-DN-05 source only | Preserve uncertainty, reconcile external result; FRO-283/285 decision |
| Grouping, quantities, recipient snapshots | Planner/repository source inspected | Preserve; no new finding or integration-pass claim |
| Number counter, XML retention, state/version writes | Transaction/CAS source inspected | Preserve identity/history; real concurrency and database tests outstanding |
| Address lookup/create/link | Source + existing helper/service tests | Preserve Client scope and immutable copied values; database matrix outstanding |
| Shipment edit reconciliation | FRO-344 and reconciler source inspected | Preserve protected/unchanged notes; no expansion into Export or general Shipment testing |
| Standalone read paths, origin gate, load annotations | Open tickets | FRO-361/FRO-357/FRO-308; not duplicate bugs |

## Evidence and next review

### Proposed ticket grouping — awaiting user agreement

After reviewing all five examples, the user requested grouping with few new tickets and reuse of recovery work. Fresh full reads of FRO-283/284/285/373 and a Delivery Note issue search confirm the following proposal. Production main remains unchanged. This grouping does not approve final text, metadata, Linear writes or unresolved recovery decisions.

| Group | Action | Finding coverage | Scope / reason |
| --- | --- | --- | --- |
| G1 | New focused bug: Delivery Note drafts — preserve unsaved movement details | QA-DN-01 | Refresh and delayed-save cases share form-state ownership; retain separate checks for both. Related FRO-307/373, but do not expand FRO-373's agreed three cases or its exclusion of saved-version conflict handling. |
| G2 | New focused bug: Delivery Notes — consistent movement date/time in XML and PDF | QA-DN-04 | Distinct serialization/document-generation fix; require isolated backend/database verification and agreed timezone before claiming a complete fix. |
| G3 | Reuse FRO-283: cancellation, replacement and recovery | QA-DN-02, QA-DN-05 | Include usable replacement beside issued siblings and explicit handling of unknown cancellation outcomes. Preserve existing history/replacement policy questions; distinguish reproduced UI blockage from source-only cancellation risk. Resolve decisions and backend evidence before declaring implementation-ready. |
| G4 | Reuse FRO-284: submission reconciliation and recovery | QA-DN-03 | Align its stale context with current SUBMISSION_PENDING/backend reconciliation behavior and specify the missing authorized UI entry. Preserve confirmed-rejection and duplicate-identity questions; no blind resubmission. |

Recommendation: **two new tickets, two existing tickets revised**, with every finding assigned once. FRO-285 stays the Phase B umbrella/reference rather than receiving duplicate acceptance criteria. FRO-283/284 are currently Business_Input/Spike tickets; this proposal does not change their type/status, silently discard existing scope, or promise that later implementation splitting will never be needed. Prefer complete reviewable rewrites of those tickets after decisions rather than appending a contradictory bug list.

No new tests or production changes during grouping. Proposed new titles and ownership are not final ticket drafts. User agreement on the grouping is pending.

- [UI observations](../evidence/delivery-note-qa.test.tsx): run in a scratch copy of the pinned client with its normal providers and cached dependencies. All fetch/XHR calls are blocked; service responses use synthetic fixtures.
- [Timestamp observations](../evidence/delivery-note-time-repro.py): run with the pinned repository root as its argument. Source checks ensure the tested formatting expressions still exist.
- Frontend command: `node node_modules/vitest/vitest.mjs run delivery-note-qa.test.tsx src/features/shipments/components/delivery-note-address-sources.test.ts src/features/shipments/components/delivery-note-form-validation.test.ts src/features/shipments/components/delivery-notes-card.test.ts src/features/shipments/services/delivery-note-service.test.ts --config vitest.config.ts`.
- Scratch config uses jsdom, `#` alias to `src`, threads/maxWorkers=1 and a local cache directory. No package install or source change was needed.

This is the completed initial mapped review, not certification of the whole flow. Review QA-DN-02 with the user first because it blocks the existing replacement workflow. Keep QA-DN-03 with the existing recovery ticket. No bug tickets, fixes, new product decisions or UI designs were created.
