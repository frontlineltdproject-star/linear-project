# Supplier Invoice regression scenarios

Read [FLOW-SI](../flows/supplier-invoice.md) first. **SI-001 (P0)** is its full normal journey. P0 means data integrity, access or core workflow; P1 means important alternatives/usability. These are test priorities, not bug severities.

All full portal/end-to-end scenarios are **Not run** in this review. Isolated reproductions and source traces are recorded separately in [the run log](../runs/2026-11-09-supplier-invoice.md); they do not turn a complete scenario into Pass. Use authorized isolated fixtures for mutations/fault injection, never live business/fiscal submissions.

For each run record build, environment, actor/role, stable fixture IDs, exact actions, expected/actual result, evidence and Pass/Fail/Blocked/Not run. Use separate fixtures for terminal actions. Export progression remains a later flow; existing relationships are guard fixtures here.

## SI-002 — Staff-only access (P0)

- **Given:** Staff viewer/creator/editor/manager and partner fixtures; an Order each partner can legitimately view.
- **When:** Open Create/Details and call direct/reverse invoice and file reads/writes with each actor.
- **Then:** Each operation needs its invoice authority and staff identity. Partner Order access exposes no invoice facts, history, duplicate identity or downloads. Denied calls write nothing.
- **Contract:** FRO-321/347/348/349.

## SI-003 — Entry eligibility and missing source data (P0)

- **Given:** Orders with/without Supplier or Invoice company, cancelled and other lifecycle stages; an Order with an existing invoice.
- **When:** Open the Available actions entry point and equivalent direct route.
- **Then:** Missing Supplier/cancelled/unresolved required regime is explained; missing Invoice company allows basic capture. Existing invoices do not exclude the Order. Use persisted Order facts.
- **Contract:** FRO-321/349.

## SI-004 — Order search and selection (P1)

- **Given:** Enough eligible Orders for several pages, distinguishable Supplier/Client/Stock IDs.
- **When:** Search partial text, page, keyboard-select, Escape and leave focus; change query while requests are delayed.
- **Then:** All matching eligible pages are reachable. Search/dismissal alone does not choose an Order. Selected context matches the explicit choice; stale responses cannot replace it.
- **Contract:** FRO-347/348.

## SI-005 — Regime/type and destructive selection changes (P0)

- **Given:** Υ.Δ. draft with VAT/expiry/vessel; eligible storage and non-storage Orders, including Greece No.
- **When:** Change type and Order, first decline then accept incompatible clearing; reverse selection.
- **Then:** Explicit regime controls eligibility; confirm clearing before data loss. Storage locks type/VAT zero/no expiry, MRN zeroes VAT, Υ.Δ. with zero VAT still starts Not started. Keep compatible fields/files; no invented restoration.
- **Contract:** FRO-321/347/348/356.

## SI-006 — Monetary precision and currency (P0)

- **Given:** Valid draft and saved editable invoice.
- **When:** Try blank, zero, negatives, 2/3 decimals, upper bound, overflow and large values; change currency.
- **Then:** Exact decimal strings round-trip; blank is not zero, no rounding/clamping/conversion. The agreed 99,999,999,999,999,999.99 maximum applies to net and VAT.
- **Contract:** FRO-321/347/348.

## SI-007 — Dates, vessel and initial exemption state (P1)

- **Given:** Non-storage/storage Orders; vessels belonging and not belonging to the Client.
- **When:** Try future Invoice date, expiry before date, optional missing vessel and unauthorized vessel; try advanced initial status/event dates through APIs.
- **Then:** Athens today and date ordering apply. Vessel is optional and Client-scoped, not copied from Order. Ordinary initial statuses are derived; advanced initial events are rejected without creation.
- **Contract:** FRO-321/347.

## SI-008 — Invoice-number identity and duplicates (P0)

- **Given:** Two Orders with the same Supplier and another with a different Supplier; active and cancelled invoices.
- **When:** Create/correct using whitespace, case differences, leading zeros and equal numbers; race equal-key creates.
- **Then:** Outside trim only; same Supplier+exact normalized number remains unique including cancelled invoices. Different Supplier may reuse it. One winner under concurrency, authorized conflict information only.
- **Contract:** FRO-321/347/348.

## SI-009 — Local documents and draft retention (P1)

- **Given:** Unsaved draft with valid/invalid files.
- **When:** Add mixed valid and invalid selections, Download/Remove, change tabs/language and visit/return from Order.
- **Then:** Valid bytes remain, per-file errors explain invalid items. Allowed extensions, nonempty content, 1–255 filename and 25 MiB implementation limit are checked. Before creation no upload occurs.
- **Contract:** FRO-321/347/349.

## SI-010 — Dirty navigation and separate origin/selection (P0)

- **Given:** Enter from Order A, select Order B, type facts and queue a file.
- **When:** Visit an Order and return; try Cancel, explicit new creation, reload/unload; exercise Stay and confirmed discard.
- **Then:** Ordinary return resumes work/current selection. Initial A never overwrites B. Dirty work/unresolved outcomes are protected; no auto-save. Discard-before-create makes no invoice/upload and returns to A when entered there.
- **Contract:** FRO-347/349.

## SI-011 — Known creation rejection (P0)

- **Given:** Valid draft and queued file; inject a confirmed validation or access rejection.
- **When:** Submit, inspect errors, correct and submit successfully.
- **Then:** No record/activity/files on rejected attempt; fields/files survive, errors actionable. Successful retry creates once and uses the actual selected Order.
- **Contract:** FRO-321/347.

## SI-012 — Unknown creation outcome and replay (P0)

- **Given:** Isolated service able to commit then drop a response, and separately drop before reaching the server.
- **When:** Submit, change available source context, invoke Check result, attempt editing/replacement while unresolved.
- **Then:** Retain original actor/request/payload. Resolve original attempt without changed-payload replay or duplicate creation. Distinguish unknown from rejected and saved; successful recovery cannot show an actionable unsaved form.
- **Contract:** FRO-321/347/349.

## SI-013 — Upload recovery after confirmed creation (P0)

- **Given:** Create once with multiple files; inject a failed upload and an upload committed with a lost response.
- **When:** Recover/retry documents, visit/return, then explicitly leave with pending bytes.
- **Then:** Same invoice ID and file keys; successful uploads are not repeated. Unknown uploads reconcile; failures retain pending bytes. A saved invoice remains saved even if all uploads fail.
- **Contract:** FRO-321/347/349.

## SI-014 — Creation result and return (P0)

- **Given:** Enter from A, select B and create; another case entered standalone.
- **When:** Inspect result, return explicitly to A; simulate navigation/invalidation failure; start another invoice.
- **Then:** Result names actual B and preserves saved ID. Refresh B's applicable consumers, not a false invoice presence on A. Pending files protected; navigation failure does not permit repeat creation.
- **Contract:** FRO-347/349.

## SI-015 — Read, download and empty/error distinctions (P1)

- **Given:** Active/cancelled saved invoices with files; unavailable/denied/failed reference lookups.
- **When:** Open Details, change tabs/language, retry lookup, follow permitted links and download.
- **Then:** Authoritative values and correct file bytes; no mutation on reads. Missing invoice is not a creation/fixture fallback. Invoice ID, number, Stock ID and exemption/cancellation states remain distinct.
- **Contract:** FRO-321/348.

## SI-016 — One-card editing and draft preservation (P0)

- **Given:** Active editable invoice; delayed save, refresh and unrelated card controls.
- **When:** Open one editor, type, switch tabs/language, press Escape with dropdown open, then cancel/save.
- **Then:** One card editor; conflicting mutations disabled. First Escape dismisses popup. Draft remains across tabs/refresh; Cancel restores saved values only. Successful save applies reviewed facts and audit once.
- **Contract:** FRO-321/348.

## SI-017 — Stale correction and renewed review (P0)

- **Given:** Two operators on one invoice.
- **When:** A edits, B saves, A submits stale draft; load/review latest, then B changes again before A confirms.
- **Then:** Reject every unreviewed version; retain draft and newer saved facts separately. Renewed review pins its own version, with no silent overwrite of B's changes.
- **Contract:** FRO-321/348.

## SI-018 — Uncertain correction/cancellation recovery (P0)

- **Given:** Inject lost responses for correction and cancellation, with another writer advancing the record.
- **When:** Check result, refetch, try changed submission or navigation.
- **Then:** Resolve the original action/payload/precondition, not merely any version increment. Do not report another operator's change as this attempt's success or discard its draft. Same-version read while request is in flight does not establish terminal rejection.
- **Contract:** FRO-321/348.

## SI-019 — Order reassignment as one correction (P0)

- **Given:** Eligible old/new Orders with compatible and incompatible type/company/vessel contexts; saved invoice/files.
- **When:** Reassign with dependent corrections, cancel a second draft, and inject validation/conflict.
- **Then:** One atomic invoice correction retains ID/files/history; old/new Order consumers refresh. No implicit source mutation, Export reassignment or partial dependent changes.
- **Contract:** FRO-321/348.

## SI-020 — Permitted invoice cancellation (P0)

- **Given:** Active unassigned unprogressed invoice with saved files; manager and unauthorized actor.
- **When:** Open/abort confirmation, confirm once, retry unknown response, read afterwards and reuse number.
- **Then:** Aborted/denied attempts change nothing. Cancel preserves all facts/files/number reservation and audit; no ordinary editing, deletion/reactivation. Duplicate number remains unavailable.
- **Contract:** FRO-321/348.

## SI-021 — Cancellation/correction with linked protection (P0)

- **Given:** Invoices with active Export or recorded dispatch/return/onward events; a concurrent assignment after dialog opens.
- **When:** Attempt protected cancellation, reassignment or incompatible corrections.
- **Then:** Server rechecks current relationships/events and rejects atomically, including races. UI gives actionable explanation without override. Full Export progression is outside this scenario.
- **Contract:** FRO-321/348; boundary with FRO-317.

## SI-022 — Order company/regime changes and cancellation (P0)

- **Given:** Saved Orders with active/cancelled invoices, optional invoice vessels and potential duplicate numbers on another Supplier.
- **When:** Use only supported Order corrections; try Supplier clear/change, Invoice company/regime change and Order cancellation.
- **Then:** Validate all applicable linked consistency before write; reject incompatible changes wholly. Active invoices protect ordinary Order cancellation; no automatic invoice cancellation/movement. Full explicit split follows the user-approved exception in SI-023.
- **Contract:** FRO-321/356; FRO-303 only within its separately owned scope.

## SI-023 — Split lineage and actual ownership (P1)

- **Given:** Order with invoices/files; explicit and Shipment-driven split fixtures.
- **When:** Perform permitted splits, inspect original/child links and available reassignment.
- **Then:** No invoice/file copying or automatic movement. Child lineage does not count as direct invoice ownership. Per the user's 9 November decision, a full explicit split may cancel the parent retaining its active invoices and a reassignment prompt; preserve ID/files/history and existing reassignment guards. Ordinary cancellation remains blocked. FRO-321 wording alignment is separately pending.
- **Contract:** FRO-321; existing Order split contracts.

## SI-024 — Current Customs Storage Entry context (P1)

- **Given:** Storage Order before/after admission; qualifying covered child and unrelated sibling.
- **When:** Read/create/correct invoice, later create or change admission through its separately authorized fixture flow, then refresh.
- **Then:** Basic capture succeeds without an entry; reference resolves through authorized direct/inherited coverage. No copied invoice pointer/resave; stale/error/denied/unavailable differs from confirmed absence.
- **Contract:** FRO-321/347/348; boundary with FRO-319.

## SI-025 — EN/EL and controls (P1)

- **Given:** Same creation/Details fixtures at desktop and narrow width.
- **When:** Use keyboard, long official type labels, disabled storage option, validation errors and focus restoration.
- **Then:** Long labels usable; disabled option communicates reason but cannot select through click/Enter/Space. Errors and recovery actions reachable; no hidden submission on browsing.
- **Contract:** FRO-347/348/349.

## SI-026 — Replace a draft while previous creation is unresolved (P0)

- **Given:** Draft A has a queued file and a pending or unknown create request; a second originating Order B.
- **When:** Leave/reopen from B, try replacing the draft, add another file, and deliver A's late response.
- **Then:** Resolve original work before starting a replacement. A's completion must never consume B's files or overwrite B's state. Every upload remains tied to its originating invoice attempt.
- **Contract:** FRO-321/347/349. Finding QA-SI-01.

## SI-027 — Cancel while initial Order lookup is pending (P0)

- **Given:** Creation from A with delayed initial context lookup.
- **When:** Cancel, open from B, type invoice details, then finish A's old lookup.
- **Then:** B remains selected with its own input/context. The cancelled instance cannot mutate a later draft; lookup/navigation creates/uploads nothing.
- **Contract:** FRO-347/349. Finding QA-SI-02.

## SI-028 — Correct to a different vessel with the same name (P1)

- **Given:** Invoice linked to vessel A; another distinct eligible vessel B with the same name on the Order's Client.
- **When:** Correct only vessel, then separately vessel plus invoice number; include same-ID, different-name and clear-vessel controls.
- **Then:** Compare reference identities. Save B when selected and record its change in activity. No-op only for identical facts; combined correction cannot hide the vessel change.
- **Contract:** FRO-321/348. Finding QA-SI-07.
