# Export to Customs completion — scenarios

Read [FLOW-EX](../flows/export-to-customs-completion.md) first. Use synthetic fixture copies for terminal branches. P0 = identity, irreversible progression or data integrity; P1 = regular recovery and boundary coverage. All complete portal scenarios are **Not run**; isolated evidence is recorded separately and never substitutes for the full scenario.

| ID | Priority | Action / variation | Expected result | Portal outcome |
| --- | --- | --- | --- | --- |
| EX-001 | P0 | Complete FLOW-EX normal journey. | One Export, correct invoices/files/history, EAD then IE599, unchanged invoice VAT events. | Not run |
| EX-002 | P0 | Greek versus foreign group; Client differs from Invoice company. | Exact fiscal group/type/minimum rules; no Client fallback. | Not run |
| EX-003 | P0 | Missing/duplicate fiscal identity or cancelled Shipment. | Clear refusal, no partial Export/protocol. | Not run |
| EX-004 | P0 | Concurrent same-group Create and retry unknown result. | One active Export; original result recoverable, no second create while unresolved. | Not run |
| EX-005 | P1 | Change/cancel Shipment lookup while an older response is pending. | Explicit latest selection wins; old response cannot alter replacement draft. | Not run |
| EX-006 | P1 | Change group/Shipment after customizing invoices; Keep then Replace. | Keep retains scope; Replace resets only scope/selection, preserving entered facts/files. | Not run |
| EX-007 | P0 | Pending/unknown creation, navigation/discard/new draft and late response. | Protect unresolved operation, bind response/files to original attempt. | Not run |
| EX-008 | P0 | Partial uploads, retry, duplicate click, later file selection. | Correct saved owner; successful files not duplicated; pending bytes remain available. | Not run |
| EX-009 | P1 | File validation edges and mixed valid/invalid selections. | Validate type/nonempty/name/size; retain valid files; no premature upload. | Not run |
| EX-010 | P0 | Parent-chain suggestions plus paperwork-only invoices and sibling Orders. | Dedupe identity/provenance; no sibling traversal or physical membership changes. | Not run |
| EX-011 | P0 | Split an admitted Order; review inherited Entry and select its owning Order's storage invoices. | Owner's matching invoices stay in one Export. Child opens original Entry without substituting/aggregating child invoices; inheritance alone does not merge their paperwork. | Not run |
| EX-012 | P0 | Cancelled/already assigned/wrong company/type/Supplier invoice. | Revalidate at create and membership save, reject atomically. | Not run |
| EX-013 | P1 | MRN normalization, duplicate including cancelled, date/vessel boundaries. | Exact validation; optional existing vessel identity preserved independently. | Not run |
| EX-014 | P0 | Create directly Awaiting IE599; toggle initial status; injected failure. | Required date/confirmation, atomic Created+EAD, no Completed initial state. | Not run |
| EX-015 | P0 | Concurrent Details save; another change while save/recovery pending. | Reviewed version retained; conflict preserves draft, late response cannot erase newer typing. | Not run |
| EX-016 | P0 | Change invoices before/after EAD and Completed, empty Greek/foreign sets. | Removal/minimum locks apply; connected Orders/counts/protocol refresh accurately. | Not run |
| EX-017 | P0 | First Υ.Δ., failed selection, remove all, re-add. | Allocate only on successful first selection, retain/reuse protocol. | Not run |
| EX-018 | P0 | Confirm EAD with invalid/stale date/version, duplicate request, dropped response. | Enforce chronology and reviewed version; recover original event once. | Not run |
| EX-019 | P0 | Confirm IE599 before EAD, before its date, future/stale/duplicate/unknown. | Valid sequential event only; no duplicate or invoice VAT transition. | Not run |
| EX-020 | P0 | Open editor versus Customs action; refetch during confirmation. | No conflicting editor/action; submit exactly the version reviewed. | Not run |
| EX-021 | P0 | Cancel allowed Export; later stage/event; wrong role; empty/long reason. | Eligibility/reason/version rechecked; release active locks, retain historical identity. | Not run |
| EX-022 | P0 | Dismiss pending/unknown cancellation or Customs dialog; reopen/retry. | Unresolved attempt/date/reason/version retained; no concurrent replacement write. | Not run |
| EX-023 | P1 | Details tabs/navigation/language while editing/working. | Draft and pending-operation protection, accessible explicit discard. | Not run |
| EX-024 | P0 | Upload/remove files at each lifecycle stage; retry uncertain file result. | Correct Export owner and access, no forbidden removal or false Customs event. | Not run |
| EX-025 | P0 | Staff missing authority and external partner through UI/API/file links. | Server and UI deny sensitive operation/data without leaks. | Not run |
| EX-026 | P0 | Cancel Shipment or change linked invoice/Order while Export active. | Cross-entity invariants preserved; no hidden fiscal/group drift. | Not run |
| EX-027 | P1 | Saved Export navigation failure / reload / read failure. | Preserve confirmed creation/recovery; explicit read error, no misleading blank form. | Not run |
| EX-028 | P1 | Inspect list/menu/Entry links absent from current feature. | Record FRO-368/370 pending ownership, not a new delivered-scope regression. | Not run |

The [review report](../runs/2026-11-09-export-to-customs-completion.md) maps QA-EX-01–06 to these scenarios. Include file removal/addition while Create is pending in EX-008, an unchanged invoice editor after another writer adds an invoice in EX-016, and changed-date/reason retries after lost responses in EX-018/019/022. These cases have isolated frontend evidence; the full portal outcomes above remain Not run.
