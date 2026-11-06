# Shipment Invoice create — preview component map

Read-only production baseline: `Frontline-Forwarding/frontline-forwarding` main `5774931b9869247f0247013111a452552403f456`. Read through authenticated GitHub CLI. No Shipment Invoice create screen exists on this baseline; the two directions are new compositions of current portal components, not reconstructions of an existing screen.

Authoritative visual sources: `frontline-forwarding-client/DESIGN.md` and `src/styles/theme.css`. The HTML mirrors semantic navy/teal/neutral colors, 8px control/12px card radii, compact density, 40px controls and mono reference/money styling. Fonts use the prescribed font stacks with system fallbacks; no remote fonts are fetched.

All paths below are relative to `frontline-forwarding-client/src/`.

| Element in A and B | Live source | Standalone approximation |
| --- | --- | --- |
| App frame and title | `components/layout/app-shell.tsx`, `side-bar.tsx`, `top-bar.tsx` | Static navy sidebar and responsive top bar; navigation is illustrative only. |
| Cards and sections | `components/ui/card.tsx`: Card, CardHeader, CardTitle, CardBody, CardFooter | Semantic HTML sections and equivalent token styling. |
| Shipment search | `components/ui/combobox.tsx`, `components/form/select-field.tsx` | **New composition:** searchable fixture list with loading/error/empty states. No remote calls. Real remote search contract remains implementation work. |
| Client, company, type and currency | `components/ui/select.tsx`, `combobox.tsx` | Native selects styled to portal dimensions; browser option menus differ from React popovers. |
| Document date | `components/ui/date-picker.tsx`, `components/form/date-field.tsx` | Native date input; localized date-picker popup is browser-owned. |
| Text and multiline fields | `components/ui/input.tsx`: Input, Textarea, FormField, Label | Styled input/textarea/label, preserving 40px inputs and resizable text. |
| Goods groups and row selection | `features/shipments/components/shipment-composer.tsx`; `components/ui/choice.tsx` | **New composition:** Order groups select eligible invoice rows, tri-state group checks, unknown rows excluded pending allocation. Uses fixture identity and inline-table layout. |
| Rows and totals | `components/ui/table.tsx` | **New composition:** selection table and totals strip. Table primitives exist; no TFoot export or Shipment Invoice totals component exists. |
| Notices and states | `components/ui/alert.tsx`, `feedback.tsx`, `badge.tsx` | Equivalent semantic colors, visible text and retry actions. |
| Confirmations | `components/ui/modal.tsx` | Native dialog, focus return and Escape cancel. |
| Footer actions | `components/ui/button.tsx`, `components/form/form-actions.tsx`; `features/purchase-orders/components/purchase-order-form.tsx` | Secondary Cancel and one teal Create draft action. |
| B tabs | `components/ui/tabs.tsx` | ARIA tabs with arrow-key navigation and preserved form state. |

## Directions

- **A — stacked cards (recommended):** shows Shipment, document, parties, goods and totals in one continuous page. Easier to scan and review, but longer. New compositions: Shipment search, grouped goods selection and totals strip.
- **B — compact tabs:** same controls and rules in Details / Goods / Packing & notes tabs, with an always-visible totals/action strip. Shorter page, but review requires tab changes. New compositions: Shipment search, grouped goods selection and totals strip. Tabs themselves exist in the catalogue.

## Behavior boundary

This is a fixture-only, offline design preview. Changes exist only in memory. Create draft opens a simulated saved Details view without allocating a printed number. Allocation opens a same-file simulated Order page in a new tab; Refresh eligibility applies a deterministic fixture confirmation, never a real allocation write. Print, finalization, backend calls and production navigation are absent.

Approved Q1–Q9 govern the preview: draft-only creation; initial empty selection; disabled unknown rows and explicit refresh; document defaults; guarded Shipper replacement; confirmed Shipment reset; blocked mixed-currency creation; discard/leave protection; simulated allocation in a new tab. The ticket description remains the behavioral contract.

Publishing is deferred by the user. Deliver the HTML as a downloadable Linear attachment after approval.
