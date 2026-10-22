# FRO-326 review and local UI preparation

Review in progress, 22 October 2026. This is a review record, not an approved replacement ticket.

## Verified sources

- FRO-326 current description: updated 2026-10-22T10:19:04.185Z; Todo; Order, Pending_Review, Frontend, Story; milestone 0.0.5. Preserve metadata and all attachments.
- Production main: `3820e89e8caa341261e2d48bcb282d93e1bb1d03`, read through authenticated gh. Production remains read-only.
- Live client `DESIGN.md`, `src/styles/theme.css`, `src/app/providers/theme-provider.tsx`, `src/components/layout/app-shell.tsx`, `src/features/purchase-orders/components/purchase-order-detail.tsx`, and shared input/card/button/badge/tabs/select/choice/modal/typography components.
- Current linked FRO-303, FRO-333, FRO-356, FRO-346 and FRO-328 reviewed by focused research. FRO-335 refreshed at updatedAt 2026-10-22T14:23:51.676Z; it now explicitly specifies comfortable production density and real components.

## Impact review

| Area | Current evidence | Required outcome / proposed correction | Owner |
| --- | --- | --- | --- |
| Styling | FRO-326 hardcodes 10px uppercase labels, 7px corners and prototype colours. Production Label uses 12px semibold; Input/Select use 40px height, 8px corners and semantic tokens. | Replace conflicting prototype specifications with actual component rules; retain stacked-card information architecture. | FRO-326 |
| Later Invoice company correction | FRO-303 permits restricted correction beyond ordinary states. Current Details Edit link and general service guards stop at IN_STOCK. | Shared Edit must remain available for this permitted field only; consume document conflict/review behavior. | FRO-303 contract; FRO-326 integration |
| Later ALK correction | FRO-356 permits ALK-only corrections and requires shared-registration impact review. FRO-326 broadly says unchanged-status Save submits directly. | Separate status, customs and fiscal review triggers; lock unrelated fields in restricted mode. | FRO-356 contract; FRO-326 integration |
| Concurrent restricted capabilities | No linked contract provides one atomic save for Invoice company plus ALK in later stages. | User accepted one correction per edit session; shared Edit offers permitted correction choice. | FRO-326 presentation; respective backend owners |
| Pickup | FRO-333 now defines optional, unset, clearable and copied-on-split behavior; FRO-326 calls these unresolved. | Consume current nullable contract, distinguish omission from explicit clear, never infer No. Awaiting user answer. | FRO-333 contract; FRO-326 presentation |
| Current customs indicators | FRO-326 says retain Bonded indicators; FRO-356 replaces flag-derived current regime. | Source current regime from explicit Order regime; preserve recorded historical events separately. Awaiting user answer. | FRO-356 contract; FRO-326 presentation |
| Leaving Details | Ticket retains drafts across tabs/language but does not settle navigation to a different Order/page. | Proposed discard confirmation, with tab/language retention unchanged. Awaiting user answer. | FRO-326 |
| Readiness review | FRO-328 now defines read-only recipient/content review and stale-context protection. | Replace ambiguous recipient-selection language; both button locations consume one preparation/confirmation flow. | FRO-328 contract; FRO-326 integration |
| Verification | Ticket mixes mutation acceptance checks, production inspection and historical preview reports. | Separate test-environment acceptance from concrete read-only Post-deployment verification; add Context for agents and remove revision narration. | FRO-326 |

## Local UI component mapping

All paths below are relative to `frontline-forwarding-client/`. The local static comparison will mirror these components; it will not claim to be a production React integration.

| Element | Production source / reuse |
| --- | --- |
| Frame and navigation | `src/components/layout/app-shell.tsx`; preserve existing navigation/authority structure. A new horizontal frame would require an explicitly labelled new composition rather than a claim that it is current production. |
| Fonts, colours, density, radii | `src/styles/theme.css`, `src/app/providers/theme-provider.tsx`; Plus Jakarta Sans, JetBrains Mono for references, semantic tokens, comfortable default. |
| Heading and body text | `src/components/ui/typography.tsx`; named type scale, 20px title, sentence-case labels. |
| Cards | `src/components/ui/card.tsx`; Card/CardTitle/CardBody, density-based padding, 12px corners, border and shadow tokens. |
| Fields | `src/components/ui/input.tsx`; FormField/Label/Input/Textarea. Labels 12px/600, controls 40px, 8px corners, visible focus/error semantics. |
| Fixed-choice fields | `src/components/ui/select.tsx`; Select. Entity selection uses the existing imported Combobox and authorized option contracts, to be read before rendering. |
| Buttons | `src/components/ui/button.tsx`; primary/secondary/danger/ghost variants, standard heights and focus rings. |
| Tabs | `src/components/ui/tabs.tsx`; Tabs/TabList/Tab/TabPanel. Inactive panels unmount: draft state must live above panels to satisfy retention. |
| Flags and status | `src/components/ui/badge.tsx`; existing PurchaseOrderStatusPill and PurchaseOrderSplitLineageBadge imported by Details; inspect those files before rendering final status mapping. |
| Confirmation | `src/components/ui/modal.tsx`; Modal, shared buttons; retain focus handling and draft ownership. |
| Attachments | Existing `src/features/attachments/components/attachment-panel.tsx`; inspect before preparing Documents artboard. |
| Readiness | Existing `src/features/purchase-orders/components/readiness-reminder-action.tsx`; new two-location composition consumes FRO-328, not direct-send simulation in production. |
| Restricted edit chooser | New composition of existing Modal/Select/Button primitives; mark New component in comparison and explain one-correction-per-session boundary. |

## Decisions and pending gates

- User authorizes continued review and local UI preparation; Cloudflare publishing deferred. Current broad OAuth is not a Pages-only credential; do not publish with it.
- Accepted Q1: shared Edit integrates later-stage Invoice company-only and ALK-only editing with other fields locked and required impact review.
- Accepted Q4: one restricted correction per edit session, not a newly invented combined backend transaction.
- Q2 pending: consume current Pickup and explicit-regime indicator contracts.
- Q3 pending: navigation discard confirmation.
- Design comparison follows the required interview gate; proposed directions stay within stacked cards and production components. Do not revive rejected historic layouts.
- No Linear change, hosted preview change, production implementation, branch, deployment or production verification has occurred.
