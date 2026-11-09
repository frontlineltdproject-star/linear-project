**Export creation** must protect unfinished work and keep the submitted request, created Export and file queue consistent until the outcome is known.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-EX-01 — lost work | Enter facts and choose a file, then use Dashboard and return: the draft is gone. Departure after an unknown Create result loses original-attempt recovery. Open Export after a failed upload loses the pending file and Retry. |
| QA-EX-02 — misleading discard | Click Create, then Cancel while the response is delayed. Discard claims “Nothing has been saved,” but the original request can still succeed and upload its original files after departure. |
| QA-EX-03 — changing files during creation | Submit with file A, remove A and choose B before the response. A uploads anyway; B remains Staged without a usable upload/retry action. |

Isolated tests demonstrate these UI/request defects. They do not prove duplicate Exports or files sent to a different Export.

## Acceptance criteria

1. **Unfinished work:** protect in-app departure, including Dashboard, Back and Open Export, when draft facts or unuploaded files would be lost. Keep retains the work; intentional discard clearly identifies what will be lost. Preserve browser unload protection without promising automatic recovery of file bytes after a closed browser.
2. **Submitted creation:** pending or unknown creation must not be treated as an unsent draft. Preserve the original request and its recovery; prevent replacement Create while unresolved. Any permitted departure must retain a route to reconciliation. Never claim that leaving cancels the request or proves nothing was saved.
3. **Late results:** associate success/rejection and subsequent uploads with the original attempt. A late response must not overwrite a replacement draft or use its files. Retain the saved Export identity and per-file outcome if onward navigation fails.
4. **File changes:** freeze conflicting file controls during submission or handle accepted changes consistently. A removal presented as effective must not upload that file; a newly accepted file must remain uploadable. No file may become stranded without upload/retry or an explicit discard path.
5. **Upload recovery:** preserve pending bytes, file keys and the saved owner through supported in-app recovery. Retry failed files against that same Export without recreating it or duplicating successful files. Leaving with unfinished uploads requires protection.
6. **Preservation:** retain existing eligibility, MRN/group uniqueness, request replay and attachment ownership checks. Check original attempt resends the original creation unchanged. Keep known-rejection drafts and existing EN/EL presentation consistent.
7. **Verification:** add regression coverage for all three cases, including delayed success/rejection, unknown result, failed onward navigation and partial uploads. Exercise actual isolated-browser navigation and verify stored file ownership/content and retry behavior in isolated backend/storage tests.

## Decisions and scope

One ticket owns draft → submitted attempt → saved result → upload recovery because these states belong to the same creation operation. Reuse the existing creation and document components. No new business eligibility, autosave service, list/menu work or VAT printing/stamping workflow.

## Context for agents

Reviewed production main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployment equivalence is unverified.

- `frontline-forwarding-client/src/features/exports/components/export-create-page.tsx`: local draft/attempt/files; beforeunload-only protection; send/created/upload closures; direct Open Export navigation.
- Adjacent `export-create-layout.tsx` and `export-documents-card.tsx`: pending Cancel and file controls; result retries accept failed files only.
- `frontline-forwarding-client/src/features/exports/services/export-service.ts`: create and upload contracts; retain request ID and owner/file key.
- `frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/exports/ExportCreationService.java` and `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/exports/service/ExportAttachmentsApiService.java`: authoritative creation/replay and attachment guards.

Affected consumers: Create page, application navigation, saved-result panel and file recovery. Six isolated creation observations/controls reproduce the baseline; passing observation tests are not fix verification. Complete portal/storage execution remains outstanding.

## Post-deployment verification

Read-only checks against recorded isolated results and the deployed build; submit no production writes. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Inspect navigation/unload recordings for retained facts/files and explicit discard. |
| 2 | Inspect pending/unknown departures, original-request recovery and replacement-Create availability. |
| 3 | Compare original request, late result, replacement draft and failed-navigation result. |
| 4 | Inspect delayed A-remove/B-add recordings and resulting file queue/content. |
| 5 | Compare owner IDs, file keys, stored bytes and retry results across partial failures. |
| 6 | Review preserved guard/replay controls, rejection retention and EN/EL messages. |
| 7 | Match browser/backend/storage regression results and their build SHA to the deployed build. |

**Reference:** [FRO-317](https://linear.app/front-line-ltd/issue/FRO-317) · [FRO-350](https://linear.app/front-line-ltd/issue/FRO-350) · [Source baseline](https://github.com/Frontline-Forwarding/frontline-forwarding/tree/6aa259553cd9c86a8aaa157902088aa9a6bca83e) · [QA findings](https://github.com/frontlineltdproject-star/linear-project/blob/40787d4/docs/qa/runs/2026-11-09-export-to-customs-completion.md) · [Creation evidence](https://github.com/frontlineltdproject-star/linear-project/blob/40787d4/docs/qa/evidence/export-create-qa.test.tsx).
