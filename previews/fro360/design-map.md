# FRO-360 local preview — element map before implementation

Scope: approved throwaway concept exploration, local only. No production repository writes, no branch, no deployment. Source inspection by read-only gh at main 5c51030680c9d45b3827a7e19b8320c19aa5ed9a. Canvas-design skill unavailable; hand-written static HTML fallback under AGENTS.md.

All paths below are relative to frontline-forwarding-client/. Authoritative tokens: DESIGN.md and src/styles/theme.css. Horizontal desktop AppShell, not a persistent sidebar.

| Preview element | Live source / primitive | Treatment |
| --- | --- | --- |
| Navy horizontal frame, navigation, language choice | src/components/layout/app-shell.tsx, top-bar.tsx, language-selector.tsx | Mirror in static CSS; fixture-only Imports navigation is new destination |
| Page title / facts / cards | src/features/shipments/components/shipment-detail.tsx local Card/Facts; src/components/ui typography | Mirror local screen composition, do not claim Facts is a reusable shared component |
| Buttons, text/date inputs, selects, checkboxes | src/components/ui button/input/select/choice/date-picker sources; Shipment composer | Native static equivalents mirror sizes, focus, spacing; native date control clearly prototype equivalent |
| Tables and grouped goods | src/components/ui/table; src/features/shipments/components/shipment-composer.tsx | Mirror table/row style; checkbox grouping is Import coverage, not new physical membership |
| Tabs, badges, notices | src/components/ui/tabs, badge, alert | Existing primitives mirrored |
| Confirmation overlay | src/components/ui/modal | Native dialog with portal overlay/card style, focus restoration and Escape |
| Files | src/features/attachments/components/attachment-panel.tsx | Fixture file rows; simulate attachment only, no file picker/upload |
| Shipment context reference | shipment-detail.tsx and shipment-composer.tsx | Read-only fictional Shipment facts and load-unit/individual-piece context; no new Import shown as existing |
| Reviewer toolbar / state picker / comparison gallery | New preview-only composition | Label New component; outside the portal concept, includes layout/scenario/state switches |
| Import action card with status and next actions | New Import composition using Card/Badge/Button | Label New component in each direction and business notes |
| Connected Shipment context panel | New Import composition using Facts/Card/table | Label New component; related fields are candidates for employee discussion |
| Business-rule notes panel | New preview-only composition using disclosure/alert | Label New component; numbered rule markers link to notes |

## Directions

- A — Overview first: Import facts and covered goods in the main column, current customs action and concise Shipment context in the secondary column. Closest to existing Details cards; more scrolling for related detail. New compositions: Import action card/context panel.
- B — Action first: next customs action takes the top row; facts, coverage and history follow. Faster daily processing, less immediate transport context. Same new compositions and primitives, no new rules.
- C — Context first: larger Shipment/goods context alongside compact Import facts and customs actions. Tests the office's one-screen preference; higher information density. Same new compositions; read-only source ownership stays explicit.

Compare the three against a fictional current Shipment reference card. A shared creation flow is available in all directions: pick Shipment, eligible collis preselected, manual Company Shipper, optional incomplete save, and explicit confirmations for already-underway entry. FRO-359's rules apply equally to all directions.

## Tokens verified before design

Canvas #f7f8fa, surface #fff, surface2 #edeff3; navy chrome/text #0a1f3d, hover #0f2c52, active #16365f; muted #5c6573; teal #1b9e8a/hover #127a6b/subtle #e1f5ee; border #e3e6eb. Body14px/1.6, title20px/28px600, heading16px/24px600. Plus Jakarta Sans and JetBrains Mono with system fallbacks. Controls40px, radius8px; cards12px/16px padding, overlays16px. Compact rows8px; stack12px, section16px. Translate Tailwind directives to ordinary CSS, no build dependency.
