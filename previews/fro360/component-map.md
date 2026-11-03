# FRO-360 — local Import concept preview component map

Prepared before the first HTML design file. Production source was read with authenticated `gh`; no production files were changed. Baseline: `Frontline-Forwarding/frontline-forwarding`, main `5c51030680c9d45b3827a7e19b8320c19aa5ed9a` (verified 2026-11-03).

Scope: fixture-only local HTML/CSS/JS for employee feedback. FRO-359 remains the business-rule contract. Directions below propose presentation, not new rules. No API, database, production branch or deployment. Canvas-design is unavailable in this session's skill catalogue; use the documented manual HTML fallback.

## Source catalogue and current screen reference

All paths below are relative to `frontline-forwarding-client/` at the pinned baseline.

- `DESIGN.md`: semantic colours, typography, density, accessibility and bilingual presentation rules.
- `src/styles/theme.css`: authoritative token values and base styles. It contains Tailwind `@theme`/`@utility` syntax; translate required declarations into ordinary CSS for this no-build preview.
- `src/components/ui/`: actual primitive catalogue. No separately named Screen Parts/catalogue page exists in the main tree inspected.
- `src/components/layout/app-shell.tsx`: horizontal navy desktop navigation; responsive mobile drawer using Sidebar. Main/header width is capped at 100rem; horizontal padding is 1rem, increasing to 1.5rem at the small breakpoint. Do not portray a persistent desktop sidebar as the existing main layout.
- `src/components/layout/side-bar.tsx`: mobile navy navigation; default component width 15rem, overridden by AppShell to min(18rem,82vw). Active row uses accent tint and white text.
- `src/components/layout/top-bar.tsx`: responsive page title/description/actions; text-title heading and body-sm description.
- `src/features/shipments/components/shipment-detail.tsx`: current header/status, Transport and timing / Purchase orders side-by-side at large width, Shipment packages, optional Final handover, Available actions and AttachmentPanel. Its Card/Facts helpers are local, not reusable catalogue Screen Parts.
- `src/features/shipments/components/shipment-composer.tsx`: existing creation analogue using Button, Checkbox, FormField/Input and Select; sections and review compose bordered light cards. Reuse controls and visual treatment, not its old wizard ownership or business rules.
- `src/features/shipments/components/shipment-table.tsx`: Shipment status/reference analogue.
- `src/features/attachments/components/attachment-panel.tsx`: attachment-list analogue; simulated preview files never upload.

## Element-to-source map — applies to every direction

| Preview element | Existing source / component | Treatment |
| --- | --- | --- |
| Frame and navigation | `src/components/layout/app-shell.tsx`, `side-bar.tsx` | Mirror current horizontal desktop frame; fixture navigation only. Import nav entry is proposed. |
| Page title, secondary description, actions | `src/components/layout/top-bar.tsx`; `src/components/ui/typography.tsx` | Reuse title/body hierarchy and responsive action wrapping. |
| Bounded sections / read-only Shipment facts | `src/components/ui/card.tsx` (Card, CardHeader, CardBody, CardFooter); Shipment Details local Facts | Mirror card tokens; use semantic description lists for facts. New Import composition is labelled. |
| Primary / secondary / destructive actions | `src/components/ui/button.tsx` (Button) | Match variants, sizes, disabled/loading states; one primary action per working view. |
| MRN, dates, references, text inputs | `src/components/ui/input.tsx` (FormField, Input, Textarea); `date-picker.tsx` | Match visible labels, hints, errors and control shape. Static date control must visibly reflect source styling; no invented backend validation. |
| Short fixed choices / review scenarios | `src/components/ui/select.tsx` (Select) | Native select with source styles. Review-only switcher is labelled new composition. |
| Shipment lookup and colli selection | `src/components/ui/combobox.tsx`, `choice.tsx`; Shipment composer | Fixture lookup and checkboxes; explicit coverage and disabled reasons come from FRO-359. No live lookup. |
| Existing Company selection | `src/components/ui/select.tsx` / `combobox.tsx` | Select an existing fixture Company only; no Company creation or source-record mutation. Group colli selection by source Order using the Shipment composer's grouped-selection treatment. |
| Overview / goods / files / history navigation | `src/components/ui/tabs.tsx` (Tabs, TabList, Tab, TabPanel) | Mirror border/active treatment; maintain accessible tab semantics and keyboard interaction in plain JS. |
| Customs status and small tags | `src/components/ui/badge.tsx` (StatusPill, Badge) | Text plus dot for status; semantic colours. Status choice/meaning follows FRO-359. |
| Goods / package rows | `src/components/ui/table.tsx` (Table, THead, TBody, TR, TH, TD) | Dense bordered rows, tinted header, mono references; contained horizontal scroll at small widths. |
| Warning, empty/error explanation | `src/components/ui/alert.tsx`, `feedback.tsx` | Match semantic tint/text pairing; explicit messages and next actions. |
| Confirm event / cancel / discard dialog | `src/components/ui/modal.tsx`; `src/lib/useFocusTrap.ts` | Mirror source styling; trap focus, Escape, scroll lock, restore focus. Bound height/scroll so Greek/mobile text cannot clip. |
| Files | `src/features/attachments/components/attachment-panel.tsx` | Fixture rows and simulated upload outcome; no bytes sent or saved. |
| Business-rule markers / notes | Badge + Card primitives above | **New component/composition:** numbered review annotations, visible on element, artboard and direction note. |

## Proposed directions and explicit new compositions

| Direction | Composition and source mapping | Trade-off / new-component note |
| --- | --- | --- |
| A — Overview first | TopBar + status Badge; Card/Facts summary of Import and linked Shipment; Tabs for goods/files/history; Button action area. | Balanced record overview familiar from Shipment Details. **New component: Import workbench** combines these existing primitives; label the artboard and workbench. Business-action placement is new, not an existing portal screen. |
| B — Action first | TopBar; prominent Card with current StatusPill, next permitted Button and relevant FormField; secondary Tabs and Shipment-facts Card. | Makes next department task obvious but pushes broader context lower. **New component: Customs status/action panel** groups stage, evidence and next action; label panel, artboard and note. Its transition rules must remain FRO-359's. |
| C — Context first | TopBar; larger read-only Shipment Card and transport-piece Table; adjacent/narrower Import Card; Tabs for details/files/history. | Helps staff accustomed to a unified Shipment view, at cost of more visible information. **New component: Combined Shipment/Import workbench** distinguishes read-only referenced facts from Import-owned fields; label panel, artboard and note. No copied data ownership. |
| Shared creation flow | TopBar + Card/FormField/Input/Select; fixture Shipment lookup; read-only Shipment summary; explicit colli Checkbox/Table selection; review Card and Button actions. | One underlying rule set for all three presentation directions. **New component: Import creation composition**; label flow and artboard. It is not the existing Shipment wizard. |
| Shared review harness | Select, Tabs, Badge, Alert and Card primitives, separated visually from product controls | **New component: Review switcher and business-notes layer** for direction/language/state/scenario selection. Label it as preview tooling, not a proposed production feature. |

Show all directions with the same fixture and state so feedback compares presentation. Keep a current Shipment reference beside the directions or directly accessible in the comparison canvas. Label that reference as the current Shipment screen, not an existing Imports page.

## Exact light-theme token subset

| Token / property | Value |
| --- | --- |
| canvas / surface / surface-2 | `#f7f8fa` / `#ffffff` / `#edeff3` |
| chrome / chrome-hover / chrome-active | `#0a1f3d` / `#0f2c52` / `#16365f` |
| fg / fg-muted / fg-subtle | `#0a1f3d` / `#5c6573` / `#9aa3b0` |
| fg-on-chrome / fg-on-accent | `#ffffff` / `#ffffff` |
| accent / hover / active | `#1b9e8a` / `#127a6b` / `#0e6557` |
| accent-subtle / accent-strong | `#e1f5ee` / `#0b5346` |
| border / border-strong | `#e3e6eb` / `#d7dce3` |
| success base / subtle / fg | `#1f9d55` / `#e9f6ee` / `#14532d` |
| warning base / subtle / fg | `#d98a0b` / `#fef6e7` / `#633806` |
| danger base / subtle / fg | `#d33c3c` / `#fcebeb` / `#501313` |
| info base / subtle / fg | `#2b7fd4` / `#e9f1fb` / `#042c53` |
| radius sm / md / lg / xl | `6px` / `8px` / `12px` / `16px` |
| compact row vertical padding / card padding | `8px` / `16px` |
| compact stack / section gap | `12px` / `16px` |
| card shadow | `0 1px 2px 0 rgb(10 31 61 / .04), 0 1px 3px 0 rgb(10 31 61 / .06)` |
| popover shadow | `0 4px 12px -2px rgb(10 31 61 / .1), 0 2px 6px -2px rgb(10 31 61 / .08)` |
| modal shadow | `0 24px 48px -12px rgb(6 20 37 / .28)` |
| layer order | sticky 10, drawer 40, modal 50, popover 60, toast 70, tooltip 80 |

Typography: sans stack is `'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`; mono is `'JetBrains Mono', ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace`. Body 14px / 1.6 / 400; title 20px / 28px / 600; heading 16px / 24px / 600; subheading 15px / 22px / 600; body-sm 13px / 1.5 / 400; caption 12px / 1.4 / 400; table overline 11px / 16px / 600. Mono uses tabular numerals.

Actual font asset finding: no font/WOFF paths were present in the main tree. `src/client.tsx` imports only `./styles/theme.css`; `index.html` contains no font stylesheet; `package.json` has no `@fontsource` dependency. The theme comment says fonts load via @fontsource, but this was not confirmed in executable entry/package sources. Preserve the declared stack and its fallback; do not claim a font asset path exists. If bundling font files separately for the preview, record their real provenance and verify Greek glyph coverage.

Control details: Button md 40px high / 14px horizontal padding, sm 32px / 10px, lg 44px / 18px; Input and Select 40px with 12px padding. Inputs use accent border and 3px accent/15 focus halo. Table headers 14px horizontal / 10px vertical padding; cells 14px horizontal and density-controlled vertical padding. Badge uses 8px horizontal / 2px vertical; StatusPill 8px / 4px, 6px dot. Long Greek labels may wrap without clipping; keep established control sizing where possible and allow intentional responsive width/height changes where required.

## Preview verification obligations

Default, loading, empty and error states must be reachable through a visible switcher and URL parameters. EN/EL, desktop and approximately 400px must work. Use fictional fixture data only. Simulated actions must not change production state or silently alter the structural contract. Check focus, keyboard, modal dismissal/restoration, table overflow, wrapping and console/network errors. All new compositions retain their visible markers in each direction and business-notes explanation. A future selected direction needs its own approval and verification; this mapping does not select a direction.

## Round 2 — Export-style arrangement (2026-11-03)

User approved using the Export pattern instead of choosing an unchanged A–C direction. Current FRO-350 and FRO-352 descriptions establish Shipment relationship followed by entity details with embedded customs status; FRO-316 establishes page-level tabs. Read-only main remains 5c51030; src/components/ui/tabs.tsx re-read. Horizontal tab styling mirrors its gap-1, border-bottom, px-3/py-2 and teal active underline; local Arrow/Home/End behavior added. Card/field/status/confirmation controls retain the existing source mapping. Additional Shipment fields are in a disclosure for review. Import-specific lifecycle remains unchanged, with milestone dates shown only for actual sample events (no invented linear progression through inspections/payment). The optional context disclosure is a proposed composition, not a new agreed field contract. No production code changes.
