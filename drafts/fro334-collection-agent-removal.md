Remove **Collection agent** from the **Order** model, contracts and current pages so Orders can be created and edited with either **Greece** value without an agent dependency.

**Order = purchase order = stock-list item.** This removes the Order relationship; Agent companies and independent Shipment agent relationships remain intact.

## Required behavior

| Area | Contract |
| -- | -- |
| Active relationship | Retire `collectionAgentCompanyId`, `collectionAgentCompany` and `collection_agent_company_id` from Order inputs, summary/detail outputs, domain mappings and active persistence. Remove the coupling CHECK and obsolete relationship FK/index. |
| Validation | Remove agent-required, agent-forbidden and agent-company validation tied to this relationship. Both Greece = Yes and No are valid without an Order Collection agent, subject to all unrelated validation. No hidden required value, fallback agent or replacement field. |
| Greece | Preserve `pickupInGreece` / `pickup_in_greece`, meaning and stored values. Preserve true as the current creation default when omitted and preserve the existing value on omitted updates. Remove only the Collection agent dependency. |
| Current Create/Edit/Details | Remove the selector, display, inline editor where present, defaults, option requests used only by this field, validation, submitted values and query selections. Preserve the standalone Edit route, unrelated fields, field locks and page behavior. |
| Contracts and consumers | Apply removal consistently to GraphQL, REST, MCP, shared inputs/outputs, generated clients and schemas, forms, summaries and relevant query/filter mappings. Update affected consumers together; unrelated requests must not fail because they still reference the retired field. |
| Child Orders | Neither manual Order splitting nor partial-Shipment child creation may retain or recreate the removed relationship. Preserve other parties, colli identities, parent/child lineage, status rules, reservations, custody and copying of unrelated data. Do not introduce a new duplicate-Order operation. |

**Pickup responsibility** remains independent under [FRO-333](https://linear.app/front-line-ltd/issue/FRO-333). Do not derive Pickup, Greece or any Shipment agent from the removed assignment.

## Authorization

Retire access granted **solely by the Order Collection agent assignment**. Preserve action authorities and every independently applicable access rule, including internal access and authorized client/supplier participation. Matching a company alone does not bypass the required authority.

| Read surface | Required result |
| -- | -- |
| Order detail and scoped lists | Remove collection-agent participation from direct access checks and database query scoping. Apply the same rule to results, totals, groups and split-lineage families. Do not replace scoped queries with unrestricted queries. |
| Colli detail and tracking | Apply the revised Order scope through the existing current-membership authorization. A colli ID or tracking code must not bypass it. |
| Order attachments | Apply the revised Order access check to listing and downloading, including inherited attachments. Preserve files, provenance and existing inheritance restrictions. |
| Stock-list PDF | Authorize each selected Order under the revised rule before including it. Preserve unrelated PDF content/layout. |
| Other independent access | Preserve authorized client/supplier access, internal access, existing partner mutation restrictions and independent Shipment access. Do not grant Order access merely because an agent participates in a Shipment. |

An actor whose only qualifying relationship was Collection agent loses the affected Order access. An actor independently authorized through a retained rule keeps that access. Do not delete agent users, companies or their unrelated permissions.

## Data and rollout

This delivery uses **mock data**. Remove obsolete mock Order-to-agent assignments with the retired relationship and update seeds/fixtures. No archive, reassignment to Shipments or replacement agent workflow is required. Preserve unrelated Order history, attachments, lineage and company/Shipment records.

Real operational assignments and legacy imports are outside this delivery; this ticket does not authorize their deletion. If real assignments are found, resolve their treatment before applying destructive cleanup to them.

Deliver the removal on the **current Create, standalone Edit and Details pages with backend support in milestone 0.0.3**. Coordinate database, server contracts and client queries/payloads so current Order reads, creation and unrelated edits remain compatible. Document deployment order and rollback/failure handling; test obsolete queries/inputs and mixed-version handling in a safe environment. Retired inputs must not silently restore or maintain the relationship.

## UI ownership and dependencies

| Ticket | Ownership |
| -- | -- |
| FRO-334 | Model, persistence, validation, access-scope change, consumer compatibility, mock cleanup and minimal removal from current pages. |
| [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) | Later Create Order redesign; consumes the removed-field contract without a selector, hidden value or replacement. |
| [FRO-326](https://linear.app/front-line-ltd/issue/FRO-326) | Later Details redesign; no field, inline editor or empty placeholder. |

**FRO-334 blocks FRO-335 and FRO-326.** Their design work can proceed independently; release integration consumes this contract. Both redesigns currently target 0.0.5, so current-page compatibility must not wait for them.

Reuse the existing [Create preview](https://fro-335-create-order-preview.frontlineltdproject.chatgpt.site/) and [Details preview](https://fro-326-order-ui-preview.frontlineltdproject.chatgpt.site/). Their owners keep the removal and existing change annotation aligned. No new canvas, preview or UI redesign is required. Preview appearance does not prove production implementation.

## Decisions

| Decision | Reason |
| -- | -- |
| Retire assignment-only access; retain independent authorization | The removed Order relationship can no longer establish participation. No replacement access model is approved. |
| Mock-only cleanup without archiving or reassignment | Existing affected data is mock data; real legacy treatment is separate. |
| Coordinate current pages in 0.0.3 | The contract removal must work before the later redesigns arrive. |
| Keep Greece, Pickup and Shipment agents independent | Removing one Order relationship does not redefine collection responsibility, geography or Shipment routing. |

## Out of scope

- Deleting Agent companies/users, changing Shipment destination agents, or moving Order assignments onto Shipments.
- A replacement agent-assignment/access workflow or new Order duplication operation.
- Real legacy migration/reconciliation, unrelated field retirement, page redesign or production branch creation.
- Changes to unrelated statuses, notes, Pickup responsibility, warehouse custody, movement history or document contents.

## Acceptance criteria

1. Active Order persistence and all supported input/output contracts contain no Collection agent relationship; obsolete constraint/mappings and generated references are removed or regenerated consistently.
2. Create and authorized update succeed for both Greece values without an agent. Omitted Greece retains the existing creation default/update behavior; unrelated validation and mutation guards still apply.
3. Current Create/Edit/Details have no Collection agent control, display, hidden value, dedicated option lookup or query/payload reference. Standalone Edit and unrelated saves remain usable before the redesigns ship.
4. Both actual split paths create children without the relationship and preserve unrelated data, colli identities, lineage, lifecycle and reservation rules.
5. A formerly collection-agent-only actor cannot access the Order through detail, lists/totals/groups, lineage, colli tracking, attachments or PDF. Independent retained access still works; partner mutation restrictions and independent Shipment access remain unchanged.
6. Obsolete mock assignments are removed without archival/reassignment. Agent companies/users, Shipment relationships and unrelated records/history/files remain intact; no real legacy deletion is performed.
7. GraphQL/REST/MCP and current clients agree on the retired contract. Rollout and rollback/failure tests cover obsolete requests and prevent broken ordinary reads/saves or revival of the assignment.
8. Existing EN/EL pages remain usable at desktop/mobile sizes; later FRO-335/FRO-326 consume the same removal without a placeholder or replacement field.

## Context for agents

Source inspected through authenticated `gh` at `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. Recheck the implementation before changing it.

Java paths below are relative to `frontline-forwarding-app/src/main/java/com/frontline/forwarding/`.

| Source | Relevant context |
| -- | -- |
| `docs/reference/database.md`, `freight_purchase_order` | Nullable agent relationship, FK/index and `freight_purchase_order_collection_agent_check`; Greece is a separate non-null boolean with true default. |
| `domain/purchaseorders/PurchaseOrderAuthorizationService.java`; `domain/purchaseorders/PurchaseOrderRepository.java`; `docs/architecture/authorization.md` | Collection agent is an actual participant-access path, including query scoping, not only a display field. Update code, authorization documentation and regression tests together. |
| `web/purchaseorders/service/PurchaseOrderRequestValidator.java` | Greece-dependent agent validation and independent omitted-Greece handling. |
| `web/purchaseorders/service/PurchaseOrdersApiService.java`; `PurchaseOrderOutputAssembler.java` in the same directory | Child party copying, colli current-membership access, summaries/details and scoped lineage. Trace both manual and Shipment-preparation splitting. |
| `web/purchaseorders/input/PurchaseOrderCreateInput.java`, `PurchaseOrderUpdateInput.java`; `web/purchaseorders/output/PurchaseOrderOutput.java` | Shared create/update and output contract surfaces. |
| `frontline-forwarding-app/src/main/resources/graphql/purchase-orders.graphqls`; `PurchaseOrderMcpTools.java` | GraphQL fields and MCP adapters consuming shared services/inputs. Update generated API/tool references. |
| `web/attachments/service/AttachmentsApiService.java`; `web/purchaseorders/service/StockListPdfService.java` | Attachment reads/downloads and PDF selection depend on Order authorization. Preserve content while applying the revised scope. |
| `frontline-forwarding-client/src/features/purchase-orders/components/purchase-order-form.tsx`; `purchase-order-detail.tsx` in the same directory | Existing selector/defaults and display. Trace services, GraphQL documents, generated artifacts and translations used by these consumers. |

Regenerate affected database, API, MCP and frontend references through the repository's documented generators; update curated authorization/workflow documentation. Do not hand-edit generated references or preserve obsolete fixture requirements.

## Post-deployment verification

Production checks are **read-only**. Mutation, denied-access, split and rollout/failure scenarios run in an isolated test environment; inspect their results as deployment evidence.

| Criteria | Read-only check |
| -- | -- |
| 1, 7 | Inspect deployed schemas, representative authorized Order summary/detail responses and migration/release evidence for retired fields, constraint and mappings; compare generated contracts and review obsolete-request/compatibility test results. |
| 2, 3, 8 | Open current Create/Edit/Details without submitting, in EN/EL and desktop/mobile layouts. Confirm field absence and retained Greece/Pickup controls; inspect isolated create/update tests for both Greece values, omission handling and unrelated guards. |
| 4 | Review split test evidence for both paths and read resulting test-record lineage/colli identities and retained fields. |
| 5 | Review the isolated actor/access matrix across each named surface, including agent-only denial, retained client/supplier access, mutation restrictions and independent Shipment access. |
| 6 | Review fixture/migration evidence and read authorized company/Shipment records and preserved history/files. Confirm no reassignment or real legacy deletion. |

**Reference:** sources above; FRO-335/FRO-326 presentation; FRO-333 independent Pickup responsibility; [FRO-329](https://linear.app/front-line-ltd/issue/FRO-329) separate field cleanup; canceled [FRO-290](https://linear.app/front-line-ltd/issue/FRO-290) historical dependency.
