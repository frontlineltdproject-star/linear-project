# Shipment Invoice Details/edit — local preview

Production baseline: `5774931b9869247f0247013111a452552403f456`, read through authenticated gh on 2026-11-06. Design sources: live `frontline-forwarding-client/DESIGN.md` and `src/styles/theme.css`. This preview carries forward the stacked-card direction approved in Q15, matching FRO-363. No alternative layout round is needed after that explicit selection.

Paths below are relative to `frontline-forwarding-client/src/`.

| Preview element | Portal component / source | Treatment |
| --- | --- | --- |
| Frame | `components/layout/app-shell.tsx`, `side-bar.tsx`, `top-bar.tsx` | Same static shell approximation as the create preview. |
| Sections, document and party blocks | `components/ui/card.tsx`: Card/Header/Body/Footer | Existing primitives; stacked direction. |
| Editable and read-only fields | `components/ui/input.tsx`: FormField, Input, Textarea | Native controls with semantic styling. Read-only values use text, not disabled forms. |
| Choice/date | `components/ui/select.tsx`, `date-picker.tsx` | Native selects/date input approximate portal popovers; no invented production options. Company values are fictional fixtures. |
| Goods and totals | `components/ui/table.tsx`, `choice.tsx` | New composition carried from FRO-363; source amounts remain read-only. |
| Review panel / source differences | `components/ui/alert.tsx`, `card.tsx`, `button.tsx` | New composition: grouped differences and explicit review action. |
| Lifecycle and correction links | `components/ui/badge.tsx`, `card.tsx`, `button.tsx` | New composition: status, reason and linked original/replacement. |
| Confirmation dialogs | `components/ui/modal.tsx` | Native dialog approximates focus trap, Escape close, focus restoration. |
| Save/cancel and validation | `components/ui/button.tsx`; `features/purchase-orders/components/purchase-order-form.tsx` | Explicit actions and actionable validation summary. |
| Loading/empty/error/conflict | `components/ui/alert.tsx`, `feedback.tsx` | Fixture scenarios with recovery controls. |

## Behavior boundary

One self-contained offline HTML file; no network, storage, database, production API or real numbering. All names, identifiers, prices, dates and goods are fictional fixtures. Scenario and role controls are design tools only. Preview save/finalize/discard/cancel/replacement actions change in-memory fixture state. Refresh deterministically demonstrates a changed source row and newly eligible row. Browser reload resets the simulation.

Approved decisions Q1–Q15 govern the design. Backend eligibility, review persistence/invalidation, version checking, authorization and concrete APIs remain integration dependencies of FRO-244/FRO-301; this preview does not establish those APIs. Replacement preparation is a local demonstration of the create-form reuse that will need coordination with FRO-363. It does not edit that ticket or its artifacts.

## Business-note markers

1. Saved Shipment is locked; wrong Shipment requires discarding the draft and creating another.
2. Explicit save permits incomplete preparation; mixed currencies block save. Opening a draft preserves saved fields.
3. Draft rows use live source values; new rows need selection. Missing rows and changed values need review.
4. Packing, weight and partial amount remain manual; replacement copies need checking.
5. Finalize validates and freezes the saved document with number allocation; only a simulated number is used here.
6. Manager/admin cancellation retains frozen content and requires a reason. Replacement remains linked and unnumbered until finalization.
7. Conflict blocks overwrite and preserves local text for comparison before reload.

Download `index.html` and open it directly. `?state=edit&lang=el` opens a localized scenario. The visible selector exposes every scenario. HTML governs appearance; the eventual approved ticket governs behavior. Local publication only, as authorized by the user.
