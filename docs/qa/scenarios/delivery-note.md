# Delivery Note scenario ledger

Baseline: [flow](../flows/delivery-note.md). Results: [run](../runs/2026-11-09-delivery-note.md).

Evidence codes: **UI** = actual React components with mocked service/auth, **source** = inspected code only, **expression** = Java formatting-expression execution, **open** = not executed. None means live portal/AADE validation.

| ID | Scenario | Evidence / disposition |
| --- | --- | --- |
| DN-001 | One versus multiple invoice companies; several Shipments never merged | Planner/source inspected; backend integration open |
| DN-002 | Missing company/recipient details or incompatible vessels | Planner/validation source; integration open |
| DN-003 | Terminal collis, null weights, per-Order lines and totals | DraftSource/LineFactory source; integration open |
| DN-004 | Repeat/concurrent draft preparation | Shipment lock and current-pair check in source; concurrency execution open |
| DN-005 | Historical and foreign/agent origins | Historical guard inspected; FRO-357 owns missing origin restrictions |
| DN-006 | New origin defaults versus existing saved addresses | Source inspected; existing address tests pass, database execution open |
| DN-007 | Client-scoped destinations, multi-Client identity deduplication | Lookup/link source and existing helper/service tests; end-to-end open |
| DN-008 | Reusable-address create/link, duplicate, failure and abandon | Source inspected; database concurrency open |
| DN-009 | Valid common draft save; stale/incomplete note set | Transaction/version source and existing serialization tests; backend integration open |
| DN-010 | Background note-version change while editing | UI reproduced QA-DN-01; same-version control retains typing |
| DN-011 | Type more while a save is pending | UI reproduced QA-DN-01 |
| DN-012 | Saved clean draft preview and dirty/busy guards | Existing helper tests pass; real PDF rendering open |
| DN-013 | Issue first of several saved drafts | Source inspected; other saved draft actions remain; full execution open |
| DN-014 | Cancel one issued note while another remains issued | Replacement creation source traced; resulting UI fixture reproduces QA-DN-02 |
| DN-015 | Replacement preparation failure with existing siblings | Warning/source inspected; correction draft D2 includes preparation-only retry controls |
| DN-016 | Acceptance, explicit rejection, allocated number/XML retention | Lifecycle/repository source; AADE/database integration open |
| DN-017 | Ambiguous submission and safe reconciliation | Backend source exists; UI fixture reproduces missing action QA-DN-03; correction draft D2, FRO-284 reference only |
| DN-018 | XML and PDF timestamps across offsets/midnight | Two expression observations reproduce QA-DN-04; real database round trip open |
| DN-019 | Cancellation timeout versus explicit rejection | Source-only QA-DN-05 risk; simulated backend integration open |
| DN-020 | Cancellation accepted but local completion fails | Source-only pending trap; correction draft D2 requires isolated reproduction and safe local completion |
| DN-021 | Note consequences of route/cargo edits | FRO-344/reconciler guards inspected only; full Shipment review intentionally excluded |
| DN-022 | Partner denial, issuer scope, wrong Shipment/note PDF identity | Authorization/adapter source inspected; full role/API matrix open |
| DN-023 | Standalone read-only list/details and cancelled history | Existing FRO-361/FRO-283 boundaries; not a new bug |
| DN-024 | Printed goods/recipient/address accuracy and annotations | Model/source inspected; rendered PDF/AADE comparison open; FRO-308 owns load-unit annotations |
