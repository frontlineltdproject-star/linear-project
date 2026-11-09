**Delivery Note drafts** (δελτία αποστολής) must preserve the operator's unsaved movement details when server data refreshes or a save finishes.

## Problems to fix

| Case | Reproduction and current result |
| --- | --- |
| QA-DN-01a — refreshed version | Edit a vehicle number without saving. A background refresh returns a higher note version. The editor remounts and silently replaces the local input with server values. A same-version refresh preserves input. |
| QA-DN-01b — delayed save | Save value A, then type B while the request is pending. When A's save succeeds, the editor resets to A and discards B. |

Both cases were reproduced with isolated frontend tests and mocked services. Incorrect backend persistence was not demonstrated. “Refresh” here means refreshed query data in the open editor; restoring drafts after a browser restart is outside scope.

## Acceptance criteria

1. **Dirty refresh:** retain entered movement fields and address selections when note versions refresh. Identify that the saved version changed; do not silently replace input, accept a newer version for the old draft, or retry a stale save. Require deliberate resolution before saving against changed data. Discard/reload must be explicit.
2. **Delayed save:** bind completion to the submitted draft and note/version set. Either prevent incompatible editing while pending or retain any later input the form accepts as unsaved after completion. Never discard that input or save it automatically as part of the earlier request.
3. **Draft identity:** late responses cannot overwrite a different Shipment, replacement note or newer editing session. If the editable note set or lifecycle changes, retain the local values for review and explain why saving is unavailable; never transfer them automatically to different notes.
4. **Preservation controls:** a clean form may adopt refreshed saved values. Same-version refresh, failed save and validation errors preserve local work. Keep atomic all-DRAFT saving, complete note/version checks, existing permissions and validation, and saved-before-preview/issuance protections.
5. **Verification:** add regression checks for both losses, clean/same-version controls, stale saves, lifecycle changes and late responses. Exercise the real editor with controlled delays in an isolated browser; verify the submitted payload and resulting saved values separately from unsaved input.

## Decisions and scope

Group the two losses because both concern ownership of the open movement draft. Reuse the existing form and feedback components; no new screen or component. Preserve current address lookup, reusable-location and fiscal rules. FRO-373 remains responsible for its separate origin/Notes/arrival cases; this ticket does not expand it.

## Context for agents

Reviewed main: `6aa259553cd9c86a8aaa157902088aa9a6bca83e`; deployed version unverified.

Under `frontline-forwarding-client/src/features/shipments/`:
- `components/delivery-notes-card.tsx`: editor key includes note IDs/versions; save success resets to the captured submitted values.
- `hooks/use-delivery-notes.ts`: mutations invalidate refreshed note queries.
- `services/delivery-note-service.ts`: draft serialization and save requests.

Backend `frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service/DeliveryNotesApiService.java` owns `updateDeliveryNoteDraftsForShipment`; retain its atomic version/state checks. Data owner: `freight_delivery_note`. No schema or historical-data migration is required. Scenarios DN-009/010/011/012.

## Post-deployment verification

Read-only checks of isolated evidence and existing records; make no production mutations. Missing evidence remains Unverified.

| Criterion | Check |
| --- | --- |
| 1 | Inspect dirty-refresh/stale-save recordings for retained input, visible conflict and no automatic overwrite or retry. |
| 2 | Compare the delayed request payload, saved response and later input; confirm any accepted later input remains unsaved. |
| 3 | Inspect late-response and replacement/lifecycle-change evidence for correct draft ownership and blocked invalid saves. |
| 4 | Review clean/same-version, failure, permission, validation and preview/issuance controls. |
| 5 | Compare the tested build SHA with the deployed build and inspect browser/network and saved-value evidence. |

**Reference:** [FRO-247](https://linear.app/front-line-ltd/issue/FRO-247) · [FRO-307](https://linear.app/front-line-ltd/issue/FRO-307) · [FRO-373](https://linear.app/front-line-ltd/issue/FRO-373) · [QA findings](https://github.com/frontlineltdproject-star/linear-project/blob/8101d8ea12f0279782a7ff5d6dff8f94e80bb48b/docs/qa/runs/2026-11-09-delivery-note.md) · [UI evidence](https://github.com/frontlineltdproject-star/linear-project/blob/8101d8ea12f0279782a7ff5d6dff8f94e80bb48b/docs/qa/evidence/delivery-note-qa.test.tsx).
