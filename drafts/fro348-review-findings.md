# FRO-348 review — 23 October 2026

Work in progress. Findings and recommendations are not an approved replacement ticket.

## Scope and evidence

- Planning `git pull --ff-only` succeeded; current issue and comments (none), FRO labels/statuses and linked FRO-321/347/326/317/352/356/319 retrieved.
- FRO-348: Todo, supplier invoice/Pending_Review/Frontend/Story, milestone 0.0.6; one existing Site attachment; no Linear changes.
- Production main read through authenticated `gh`: `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. Production source/database remain read-only.
- Supplier Invoice is a new entity absent from this baseline. FRO-321 is the proposed persistence/read/correction/authorization/event/attachment contract. Current Order invoice rows and static billing demo are separate models.
- User explicitly replaces Cloudflare Pages with ChatGPT Sites for this task. Existing Site `appgprj_6ad0ae445fdc81919d8996215708f533`, version 20, source `b6311c73de903f4666a99672391ee00e20b41f17`; owner-only custom audience. Preserve identity, audience and URL: https://supplier-invoice-details-preview.frontlineltdproject.chatgpt.site . Source retrieved; no edits or publishing.
- Existing fixture preview served locally and visually inspected. Hosted browser shows sign-in gate. This is baseline inspection, not verification of a revised design.

## Interactive decisions

1. **Accepted:** guarded correction of Order and applicable invoice facts; one active card editor, atomic dependent corrections after an Order change. Follow current FRO-321 validation/audit. Do not edit Order companies on the invoice.
2. **Pending:** provide guarded Cancel invoice confirmation here (recommended), versus leave cancellation UI outside FRO-348 with ownership unresolved. Current FRO-321 initial release includes cancellation; FRO-348 excludes its UI.
3. **Pending:** preserve card drafts through tabs/language and guard leaving/reload/close (recommended); retain rejected/conflicting drafts and resolve unknown save outcomes before retry. No consent inferred from elapsed time.

## Findings

| Gap | Evidence | Required alignment / ownership |
| --- | --- | --- |
| Editing contract contradicts scope | FRO-348 Design status advertises card edits; Scope/Out of scope leave ordinary facts unresolved. Preview `cardHead`, `startCard`, `saveCard`. | Accepted ordinary guarded editing must become complete production requirements and acceptance checks in FRO-348; FRO-321 owns backend operations. |
| Later integrations assumed available | FRO-321 now stages basic 0.0.6, Export 0.0.10, Entry Note 0.0.11; FRO-348 assumes enabled lookups/actions. | Distinguish integration unavailable from loading/error/denied/conflict/confirmed absence. No fabricated records or enabled actions with unavailable guards. |
| Event date guards incomplete | Preview `openStamp` has no invoice-date lower bound or today maximum; onward sending also lacks today maximum. FRO-348 omits those rules. | Consume FRO-321: dispatch >= invoice date, return >= dispatch, sending >= return, all <= today in Europe/Athens. Do not use IE599 recording date as automatic dispatch minimum. |
| Prototype mutation access inconsistent | `cardHead` renders Edit without checking view-only/cancelled state; `vatExemption`/`openStamp` omit cancellation/view-only checks, while onward sending checks them. | Staff-only page/data/files. Per-action authority and cancellation guards must apply in UI and authoritative save; viewing remains nonmutating. |
| Precision and validation gaps | Preview `saveCard` converts money through Number, lacks two-decimal/range validation and future invoice/expiration checks; vessel is free text; currency offers only existing value. | Consume exact-decimal FRO-321 contract and reference selectors. Preserve lossless amounts, optional authorized Client-associated vessel, currency choices and no auto-vessel copying. |
| Duplicate normalization missing | Preview `items.some` compares untrimmed exact number. | FRO-321 trimmed case-sensitive Supplier/number key, cancelled invoices included, own ID excluded. Do not expose inaccessible conflicts. |
| Retry/concurrency underspecified | Prototype uses browser-local immediate saves; no authoritative read precondition or lost-response resolution. | Specify pending/rejected/conflict/unknown/success states, original-attempt recovery and no optimistic advancement after uncertain responses. Backend owned by FRO-321. |
| Entry Note replacement exceeds owner scope | FRO-348 and prototype simulate replacement; current FRO-319 defers cancellation/reissue/replacement operations. | Demonstrate late creation and owner-permitted corrections/invalidation, including inherited admission coverage. No new replacement operation or invoice-to-note pointer. |
| VAT preview can mix draft and saved facts | `vatExemption` reads `cardDrafts.order || invoice`; proposed Order may alter displayed status before save. | Keep saved progress/dates distinguished from proposed changes; no implication that an unsaved correction persisted. |
| Styling reference is stale | FRO-348 hard-codes parity to old FRO-347 preview; original source notes admit repo was inaccessible. | Live theme/components take precedence. Reuse accepted FRO-326 comfortable-density direction and current component patterns. FRO-347 alignment is separate work; do not silently edit it. |
| Presentation drift | Preview: 24px title, uppercase field labels, custom small Edit controls, horizontal navigation; production: 20px title, sentence-case 12px labels, standard controls and existing AppShell. | Align canvas alternatives with source components; retain agreed field order and three Overview cards. Mark new compositions honestly. |
| Specification contains revision narration | Design status, Reviewed UI changes, superseded grid notes and malformed literal newline in Decisions. | Produce standalone final specification; before/after comparisons stay in chat. Preserve requirements while removing history/repetition. |
| Verification incomplete | Sending requirements sit outside numbered acceptance; permissions/cancelled correction/concurrency/date boundary/rollout coverage weak. | Criterion-specific acceptance and read-only post-deployment checks, with mutation evidence from controlled test environments. |

## Consumer impact trace

| Consumer / affected area | Current behavior and source | Required outcome | Owner |
| --- | --- | --- | --- |
| Invoice storage/read/edit/cancel/events | Absent; `docs/reference/database.md`, `graphql-api.md`; future FRO-321. | Consume real dependency contracts; no fabricated route, authority or API. | FRO-321 backend; FRO-348 presentation; cancellation UI pending. |
| Linked Order and derived companies | Current Order header edits limited to PENDING/EXPECTED_READINESS/READY/IN_STOCK; `PurchaseOrdersApiService`, `PurchaseOrderRequestValidator`. | Invoice link correction validates companies/type/vessel/duplicates/Export/admission atomically; does not unlock source Order fields. | FRO-321, FRO-303/FRO-356; FRO-348 UI. |
| Existing invoice rows and splits | `PurchaseOrderInvoiceRowRepository.copyTo` used by manual and Shipment-driven splits; current Order Details Invoice Rows tab. | Preserve as independent rows; never migrate/synchronize from them or infer Supplier Invoice ownership from row IDs/lineage. | Existing behavior preserved; FRO-321 entity; Order redesign separately owned. |
| Export membership and bulk events | Not implemented at baseline; FRO-317/FRO-352 specify explicit selection and shared invoice events. | Related Export reads actual invoice membership; no Shipment/split links. Shared invoice-owned events and same-Export/positive-IE599 rules once integrated. | FRO-317/FRO-352 sources; FRO-321 events; FRO-348 single-record UI. |
| Entry Note and reverse register | Not implemented; FRO-319 direct/inherited admission contract. | Authorized current lookup, late creation/valid correction refresh, distinct missing/unavailable/conflict; no copied facts or new replacement workflow. | FRO-319; FRO-348 consumption. |
| Invoice presence | FRO-318 uses direct active invoice links under FRO-321. | Successful reassignment/cancellation refresh old/new Order presence; no parent/sibling inheritance. | FRO-321/FRO-318; FRO-348 success invalidation. |
| Documents/downloads | `AttachmentReferenceType`/`AttachmentsApiService` currently support Order/Shipment only; `AttachmentPanel`. | Invoice-owned metadata/downloads once FRO-321 support exists. No Order fallback, upload/removal UI or fixture fallback. | FRO-321 backend; FRO-348 saved display. |
| Staff/partner reads | `PurchaseOrderAuthorizationService` currently permits participant-scoped Order viewing. | Invoice data/files remain staff-only across direct/reverse access. Do not inherit partner Order access. | FRO-321 authoritative rules; FRO-348 route/fragment/error handling. |

## Component mapping before design

Paths below are under `frontline-forwarding-client/` at the reviewed SHA.

| Element | Existing source component / screen part | New composition / adaptation |
| --- | --- | --- |
| App frame | `src/components/layout/app-shell.tsx`, `side-bar.tsx`, language/theme controls | Supplier Invoice navigation entry requires future route/authority; preview must label this adaptation. |
| Heading and stacked cards | `src/components/ui/card.tsx`; `PurchaseOrderDetail` heading/Section in `src/features/purchase-orders/components/purchase-order-detail.tsx` | Supplier Invoice heading and three named cards compose existing primitives. |
| Saved values | Existing `Facts` in PurchaseOrderDetail; FRO-326 accepted labelled saved-value contract | Labelled saved-value boxes are a composition, not an exported dedicated primitive. Sentence case; read-only semantics. |
| Tabs | `src/components/ui/tabs.tsx`: Tabs/TabList/Tab/TabPanel | Three invoice panels, draft state outside unmounted panels. |
| Edit/Save/Cancel/actions | `src/components/ui/button.tsx` | Existing variants/sizes; cancellation placement subject to decision 2. |
| Inputs, labels, dates | `src/components/ui/input.tsx`, `date-picker.tsx` | Reuse FormField/Input and DatePicker; monetary inputs use lossless text representation. |
| Order/vessel/currency/type | `src/components/ui/combobox.tsx`, `select.tsx` | Focusable aria-disabled storage option with tooltip needs a marked combobox adaptation; native disabled select options cannot supply this contract. Do not imply unchanged primitive already supports it. |
| Confirmations | `src/components/ui/modal.tsx` | Action-specific date/correction/cancellation forms; focus containment, Escape, restore focus, pending/error state. |
| Progress | Status/feedback primitives and live semantic tokens | Three-step noninteractive VAT progress is a new composition; no new event/status. |
| Files | `src/features/attachments/components/attachment-panel.tsx` | Saved-file-only presentation; current owner API cannot be reused unchanged for invoices. |
| Loading/error/missing/denied | `src/components/feedback/page-error-fragments.tsx`, loading/error components | Invoice-specific copy and separate integration states. |

## Next steps

- Await decisions 2–3; recompute any dependent interview questions. Do not build the design before the interactive gate is satisfied.
- Present current screen plus 2 alternatives, mapped to live primitives, with trade-offs and New component labels; preserve EN/EL, narrow layouts and explicit staged-integration fixtures.
- After direction selection, align existing private Site, verify interactions/states and screenshots, then show full standalone ticket with complete metadata and chat-only before/after comparison for exact-text write approval.
- Production branch work is outside current read-only scope. No deployment verification is claimed.
