# Supplier Invoice: three agreed ticket groups

The user accepted these three groups on 9 November 2026 and requested complete drafts before Linear creation. **Descriptions and metadata below await review. No issues have been created.** D1-D3 are local draft identifiers, not Linear IDs.

## Complete descriptions and proposed metadata

All three: **Front Line LTD (FRO) · Backlog**. No project, milestone, assignee, parent, cycle, due date, estimate, attachments or documents. Related links only; no blocking dependencies. Creation approval would not mark them Ready.

| Draft / proposed title | Priority | Complete label set | Related issues | Findings |
| --- | --- | --- | --- | --- |
| [D1 — Supplier Invoice creation — preserve draft ownership, files and saved results](01-creation-ownership-and-recovery.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, supplier invoice, Order | FRO-321, FRO-347, FRO-349 | QA-SI-01, QA-SI-02, QA-SI-03 |
| [D2 — Supplier Invoice Details — protect edits, cancellation recovery and reviewed versions](02-details-editing-and-cancellation.md) | High | Story, Bug, Pending_Review, Flow QA, Frontend, supplier invoice | FRO-321, FRO-348 | QA-SI-04, QA-SI-05, QA-SI-06 |
| [D3 — Supplier Invoice vessel corrections — distinguish same-name records and preserve activity](03-vessel-identity-and-history.md) | Medium | Story, Bug, Pending_Review, Flow QA, Backend, supplier invoice | FRO-321, FRO-348 | QA-SI-07 |

Priority rationale: D1 risks incorrect file ownership and lost creation context; D2 risks cancellation on an unreviewed version and lost recovery/drafts. D3 is an independently bounded vessel-identity/audit defect, proposed Medium without evidence of deployed frequency. These priorities are proposals, not approved metadata or measured incidence.

Use the existing Flow QA label (`06ea4564-06f3-40c4-b546-404049f66151`). Current FRO labels/statuses were fetched: all proposed labels exist and are not archived; each issue has exactly one Type (Story) and one Area (Frontend or Backend). Bug, Flow QA, Pending_Review and the entity labels are ungrouped.

Each numbered Markdown file contains the **complete proposed Linear description**, with no title or metadata wrapper. This index records planning/review information outside the descriptions.

## Consumer trace and ownership

| Consumer / current behavior and source | Required outcome | Owner |
| --- | --- | --- |
| Create controller's shared store accepts old lookup/create callbacks; late created reads the current file queue; finish clears result before navigation | Preserve original attempt, file owner, current selection and saved result across replacement/navigation | D1; creation controller/store, consuming FRO-347/FRO-349/FRO-321 |
| Invoice file service takes invoice ID, bytes and clientFileKey; existing server ownership/replay controls cannot infer the user's intended draft | Client supplies the correct owner/bytes/key; preserve API/server guards and verify persisted ownership in isolation | D1; supplier-invoice-service.ts and existing attachment contract |
| Details dirty/busy state omits pending cancellation; close resets unknown; confirm uses latest invoice.version | Keep recovery and navigation protection; bind confirmation to reviewed version | D2; Details/confirmation and FRO-348/FRO-321 |
| Details permits later typing and closes editor on earlier success/check | Prevent incompatible input or preserve accepted later input; retain ordinary captured-version and submitted-fact checks | D2; same Details controller |
| Backend changes() compares vessel names; empty changes skip update; combined updates omit vessel activity | Compare reference identity, save valid changes and record distinguishable old/new references atomically | D3; SupplierInvoiceService/Repository and FRO-321 |
| Invoice response, Details vessel selection, activity reads | Preserve ID-based selection and readable existing activity; confirm new saved ID and complete activity | D3; shared GraphQL/REST domain service and FRO-348 boundary |
| Existing permissions, replay, Export/event, cancellation and validation checks | Preserve authoritative refusals and no partial saved/audit effects | All drafts; existing owning contracts, no eligibility redesign |

Source paths and operations are in each description; [the review report](../../docs/qa/runs/2026-11-09-supplier-invoice.md) retains exact pinned line links. D2 and D3 meet at correction responses; D3 changes backend identity handling, while D2 changes frontend operation/draft handling. They do not require new blocking relations.

## Decisions and boundaries

- The three groups are approved; their complete wording, metadata and Linear creation are not yet approved.
- Retain one reproduction/acceptance path per finding. D1 owns QA-SI-01/02/03, D2 owns 04/05/06, D3 owns 07. No finding is omitted or shared between bug tickets.
- Reuse the current Create/Details/confirmation contracts. No new canvas, preview, UI branch, production source change or portal/database mutation is part of drafting.
- The accepted SI-Q01 full-split exception is not a bug. FRO-321 wording alignment remains a separately reviewed edit to its existing specification, outside these three drafts.
- Existing FRO-375 remains Order/Shipment scope. Link the actual Supplier Invoice requirement owners; do not silently expand earlier tickets.
- No new vocabulary or architectural decision. Existing local draft/patch/.wrangler work is unrelated.

## Evidence and validation basis

- Planning pull succeeded; production main freshly checked through authenticated gh at `6aa259553cd9c86a8aaa157902088aa9a6bca83e`. Account frontlineltdproject-star verified. Source inspection uses the pinned archive from that commit; deployed version is unverified.
- Current full FRO-321/347/348/349 read and matched to the earlier requirement baseline, all Done. Historical absence-of-feature context is not treated as current implementation evidence.
- Fresh Bug + supplier invoice search returned one complete page containing only FRO-375, with its different scope. Prior grouping searches also covered unlabelled Supplier Invoice and same-name mentions. No exact new duplicate identified; recheck before creation.
- Prior evidence: 71 existing frontend tests, four creation observations, nine Details observations/controls and seven extracted-Java checks. Passing observation tests demonstrate defects, not fixes.
- No new application test runs during drafting. Full authenticated browser, storage and backend/database evidence remains outstanding and is explicitly required in the relevant acceptance criteria.
- [Flow](../../docs/qa/flows/supplier-invoice.md) · [28 scenarios](../../docs/qa/scenarios/supplier-invoice.md) · [Evidence instructions](../../docs/qa/evidence/README.md).

## Draft verification receipt

- All three saved descriptions matched the prepared text. All seven findings are owned exactly once; no case was dropped during grouping.
- All 16 numbered acceptance criteria have matching read-only post-deployment checks. Ten source paths and 36 draft/evidence/catalogue links were checked; all resolve.
- Full proposed label sets match the fresh catalogue, with exactly one Type and one Area and no retired/group labels. FRO Backlog exists. Related requirement descriptions remain unchanged.
- Verification concerns the draft package. No application suite was rerun and no product fix or deployment result is claimed.
