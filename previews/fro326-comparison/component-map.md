# Selected A: full local preview

The user selected four-column stacked cards on 22 October 2026. Production source is read-only at `3820e89e8caa341261e2d48bcb282d93e1bb1d03`.

All client paths below are under `frontline-forwarding-client/src/`. `full.html` is a static prototype, not production integration. All records, permissions, events and save results are explicitly fictional. No real business data or credentials are used.

| Screen part | Existing source | Composition |
| --- | --- | --- |
| Frame | components/layout/app-shell.tsx | Mirror navy frame and active Orders navigation |
| Cards and labels | components/ui/card.tsx, input.tsx, typography.tsx | Comfortable 20px cards, sentence-case 12px labels, 40px controls, semantic theme tokens |
| Tabs | components/ui/tabs.tsx | Preserve draft state above panels |
| Entity choices | components/ui/combobox.tsx | Prototype fixture choices; production searchable authorized references |
| Fixed choices, flags | components/ui/select.tsx, choice.tsx | Existing controls, no invented domain enums |
| Status / lineage | features/purchase-orders/components/purchase-order-status-pill.tsx, purchase-order-split-lineage-badge.tsx; components/ui/badge.tsx | Existing semantic tones; no flag-derived current customs badge |
| Tables | components/ui/table.tsx | TH/TD styles, contained horizontal scrolling |
| Attachments | features/attachments/components/attachment-panel.tsx | Choose documents/photos, supported-file help, local/inherited provenance |
| Reminder review/history | features/purchase-orders/components/readiness-reminder-action.tsx | New composition: two locations share one review and fictional queue state |
| Restricted correction | components/ui/modal.tsx, select.tsx, button.tsx | New composition: choose Invoice company or ALK, one per session |
| Details/correction review | same Modal/Input/Button primitives | New composition: ordinary draft plus authorized readiness correction and impact review |
| Colli row expansion | table.tsx, input.tsx, select.tsx, choice.tsx | New composition: continuous expanded row, independent selection and drafts |
| Discard confirmation | modal.tsx, button.tsx | New composition: confirm leaving dirty page; retain tab/language drafts |

Prototype-only review toolbar controls locale, lifecycle fixture, access, loading/error/empty state and save outcome. Business-rule notes and New component markers are visible review aids, never production UI.

### Local design revision, 23 October 2026 — awaiting visual acceptance

User rejected persistent readiness-button status/date text, the status presentation and colli expansion. Selected compact table rows with clean two-column details form. Preview now uses contextual reasons beside disabled email controls (hover/focus/tap), a more prominent rounded-md status with production tone and dot, active flag badges in read view, inline dimensions in edit view, and a bounded Description/Package form with separate DG group. Removed internal implementation prose from expansion. These alter presentation only, not permissions, eligibility, payloads or audit. Badge/Table/Input/Select/Choice remain mapped above; contextual help is a new composition requiring production overlay accessibility. Final ticket reconciliation is pending visual acceptance; current full draft has not been approved or changed in Linear.
