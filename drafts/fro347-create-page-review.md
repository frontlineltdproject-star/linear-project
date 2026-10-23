**As a Front Line staff operator I want to create a Supplier Invoice against one saved Order** so that its invoice facts and documents are captured with the correct source relationships.

**Order = purchase order = stock-list item; colli = handling unit.** This ticket owns the shared Create page and its draft, submission and recovery presentation. FRO-321 owns the new entity, authoritative validation, staff-only access, persistence, retry/concurrency and invoice-owned attachments. Supplier Invoice is not implemented in the inspected production database/API; existing Order invoice rows are separate.

## Design and presentation

Use the selected **A — Comfortable** direction and the live production design system. Theme/component code is authoritative: Plus Jakarta Sans, a 20px semibold page title, sentence-case 12px labels, 40px controls, 8px control corners, 12px cards, 16px dialogs, navy frame and semantic teal actions. Use reference typography for identifiers and money. No prototype annotation is production styling.

* [Private Create preview](https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site)
* [Current screen, alternatives and component mapping](https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site/design-review.html)
* [Selected comfortable artboard](https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site/direction-a.png)
* [Greek 400px layout evidence](https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site/greek-mobile-review.png)

The Site is owner-private, fixture-only and browser-local. Project: `appgprj_6ad097ec3e688191b589d484c63f22dc`. Preserve its audience and URL. It demonstrates presentation and selected interactions, not delivered APIs, authorization, persistence or full navigation. Review state controls, numbered business notes and **New component** markers remain outside the product. Review default/loading/empty/error, denied/rejected, saved, unknown-result, partial-upload and unknown-upload states through the visible switcher and `?state=` URLs; EN/EL is available through the language control and `?lang=el`.

The canvas defines the look; this description and FRO-321 define behavior. Keep the existing Pending_Review label until separately approved for development; description approval does not change status or labels.

## Page structure

| Surface | Required presentation |
| -- | -- |
| Heading | One white title card: **Create supplier invoice / Δημιουργία τιμολογίου προμηθευτή**. No breadcrumb or subtitle. |
| Shared form | One common white card containing **Overview / Επισκόπηση** and **Documents / Έγγραφα**, with the staged-file count. Keep draft state outside conditionally mounted tab panels. |
| Overview | Three separate stacked cards: **Order relationship → Supplier invoice details → VAT exemption**. Use 20px card padding, gaps and panel top inset; 16px padding on narrow screens. |
| Relationship | Separate **Search Order / Αναζήτηση παραγγελίας**, maximum 480px width and 18px gap beneath it. Then four equal columns: **Stock ID → Client → Invoice company → Supplier**. Entry Note occupies one matching column on the next row, below Stock ID. |
| Invoice fields | Four equal columns: **Invoice number → Invoice date → Invoice expiration date → Currency**; next row **Invoice type → Invoice vessel → Invoice net value → Invoice VAT value**. Use 28px column / 18px row gaps, two columns at widths ≤1100px and one at ≤700px. Preserve this reading order. |
| VAT exemption | One read-only **VAT exemption status** field, maximum 400px width on desktop. Before type resolution it is blank. Υ.Δ. shows **Not started / Δεν έχει ξεκινήσει**; both other active types show **Not required / Δεν απαιτείται**. No progress indicator, editable status or dispatch/return/onward-sending inputs. |
| Actions | **Cancel / Ακύρωση** and one primary **Create supplier invoice** action below the shared card. After confirmed creation show the result/recovery view instead of an actionable unsaved form. |

Use **Supplier Invoice / Τιμολόγιο προμηθευτή** consistently, with the corresponding plural. VAT monetary/exemption labels and official invoice-type names retain their tax meaning. Keep concise field labels, required markers and actionable validation; do not restore general invoice-type panels, persistent storage-eligibility explanation, an extra Open Order link beneath type, a design footer inside the form, or decorative review borders/gradients.

## Order selection and source context

1. Search the authorized Order collection by case-insensitive partial **Stock ID, Supplier or Client**. Account for pagination; filtering only an arbitrary first page must not hide matching eligible Orders. Search results overlay below the control without shifting fields, scroll when needed and preserve usable narrow-screen widths.
2. Allow non-cancelled Orders with Supplier across lifecycle stages. An existing invoice does not make an Order unavailable. Missing-Supplier results are unavailable with a reason; missing Invoice company permits basic capture.
3. Support opening on focus/click, keyboard result navigation/selection, Escape, outside click and focus-leaving dismissal. Searching, filtering and dismissing do not change the selected Order. Only explicit selection changes it; clear search text after selection while selected values remain.
4. Populate read-only Stock ID, Client, Invoice company and Supplier from that same Order. Stock ID is an authorized Order-details link. Missing Invoice company stays blank, without Client/Supplier fallback. Company/regime corrections use authorized Order operations, never invoice-side overrides.
5. Before selection or while required source context is unresolved, keep type blank and locked; do not guess a regime/type. Distinguish a legitimate empty regime for Greece = No from loading, failure or denied access.
6. **Τελωνειακή Αποθήκευση** automatically selects and locks **Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)**, sets VAT to zero, clears/locks expiration and derives Not required, even without an Entry Note. Use FRO-356's explicit regime, not warehouse name, ΚΤΑ, ΑΛΚ, VAT amount or note existence.
7. For other regimes/Greece = No, staff choose **Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)** or **Greek Supplier – Foreign Recipient (MRN)** as permitted by FRO-321. Do not automatically map Τελωνειακή Αποταμίευση. Keep the storage option visible but non-selectable as specified below.
8. Changing Order re-evaluates companies, regime/type, vessel eligibility and note context together. Preserve compatible invoice values/files. Before clearing incompatible VAT, expiration, vessel or type-dependent draft values, explain the consequences and allow keeping the previous selection. Discard stale results for earlier selections. Refresh authorized context on return/invalidation without resetting a later explicit selection to initial route context.

### Unavailable storage option

Use the production combobox/floating primitives with an accessible extension, rather than relying on a native disabled option to expose a tooltip. The unavailable storage option remains hoverable and keyboard-focusable with **aria-disabled**, but click/Enter/Space cannot select it or change inputs/files. Support Arrow keys/Home/End, Escape with focus restoration and ordinary Tab/outside-click dismissal.

Show the reason only on hover/keyboard focus and associate it for assistive technology:

* **EN:** Requires Τελωνειακή Αποθήκευση on the linked Order.
* **EL:** Απαιτεί καθεστώς Τελωνειακή Αποθήκευση στη συνδεδεμένη παραγγελία.

Keep the official long option text readable in both languages. The stored type remains governed by server eligibility; no override or source mutation is introduced.

### Entry Note and staged availability

Keep the Entry Note field visible, blank/locked before selection and for non-storage Orders. Basic capture in 0.0.6 must not wait for later Export or Entry Note integrations under FRO-321. Distinguish **integration unavailable, loading, lookup failure, denied access and confirmed no-current-note**. Missing/unavailable note does not block otherwise-valid creation or change storage type; unavailable integration is not an empty lookup result.

Once available, consume FRO-319's admission-aware direct/inherited current-note lookup through the selected Order. Show an authorized read-only link or confirmed absence. Late creation, replacement or relinking refreshes the reference without editing/resaving the invoice. Retry lookup without losing drafts/files. Do not expose a previous Order's result, copy Entry Note fields or store an invoice-owned note pointer. Preserve FRO-319/FRO-321 ownership of reverse invoice and explicit Export derivation.

## Fields and validation

| Field | Type / format | Required behavior |
| -- | -- | -- |
| **Invoice number** | Required String | Trim surrounding whitespace; reject blank. Preserve case, internal spaces, punctuation and leading zeros. |
| **Invoice date** | Required date | No later than today in Europe/Athens. Use the production DatePicker. |
| **Invoice expiration date** | Optional date | When applicable, cannot precede Invoice date. Storage type clears/locks it. Do not silently change an entered expiry when Invoice date changes. |
| **Currency** | Required reference-data choice | Consume delivered currency reference data; one currency for both amounts. Fixture currencies are not the allowed production list. Currency changes perform no conversion. |
| **Invoice type** | Required conditional choice | Consume the three active types and Order regime rules above. Historical Foreign Supplier – Greek Recipient is unavailable for new selection. |
| **Invoice vessel** | Optional Vessel reference | Only authorized vessels associated with the selected Order's Client. Do not copy or synchronize the Order/Shipment/Export vessel. Revalidate on Order/Client change. |
| **Invoice net value / VAT value** | Required exact decimals | Each 0–99,999,999,999,999,999.99 inclusive, at most two decimal places. Blank is not zero. Reject negative, excessive or overprecision values without clamping/rounding. Preserve exact values through draft/request/response and display two decimals. |
| **VAT exemption status** | Derived initial status | Υ.Δ. = Not started, including zero-VAT Υ.Δ.; storage/MRN type = Not required. Derive applicability by type, never amount. |
| **Supplier Invoice ID** | Server-generated positive integer | Returned after creation; distinct from Invoice number/Stock ID. No editable or provisional ID input. |

Both non-Υ.Δ. types force VAT to zero. Switching away makes applicable inputs available without inventing/restoring discarded values; confirm before discarding incompatible unsaved values. Ordinary creation supplies no stamping dispatch, stamped return or onward-sending fact. Reject advanced initial statuses/event dates on the server rather than silently downgrading them. Historical entry and saved exemption progression belong to their separately governed flows.

The duplicate key is **current Supplier + case-sensitive Invoice number after surrounding trim**, including cancelled invoices; Order, Client and invoice year are not part of it. Different Suppliers may reuse the same number. Show a conflicting invoice identifier only within authorized access; do not add a preview/details screen to disclose a conflict.

Use field-related errors and an accessible validation summary; focus the relevant error/summary after rejection. Preserve inputs, applicable dates and staged documents. Revalidate current authority, scope, Order/lifecycle/source relationships, type, vessel and duplicates through FRO-321 at submission. Reject stale or incompatible saves with actionable refresh/review guidance; never silently relink or rewrite saved facts.

## Documents

Use FRO-335's current production-system Documents presentation: paperclip heading, chooser, guidance, empty state, file metadata, staged-file pill and **Download / Remove**. Adapt owner wording to Supplier Invoice. Compose the pre-create queue separately from the existing persisted-owner attachment panel.

Accept **PDF/JPG/JPEG/PNG/WebP/GIF/DOC/DOCX/XLS/XLSX/CSV/TXT**. Require nonempty files, filenames 1–255 characters and at most 25 MB per file. Validate server-side as well as in the client. Preserve valid selections alongside per-file errors; do not lose them on tab/language change or failed invoice validation. Local Download returns selected bytes; Remove affects only that unsaved queued file.

Before confirmed invoice creation, stage files locally and upload nothing. After creation, upload against that returned **Supplier Invoice ID**, using FRO-321's authorized invoice-owned attachment operations. Do not use Order attachment endpoints, inherit Order files or recreate the invoice to retry documents. Display per-file outcomes and retain successful uploads, pending bytes and the saved owner for recovery.

## Draft, navigation and result handling

| Situation | Required behavior |
| -- | -- |
| Tab/language changes and validation failure | Preserve inputs, applicable selections and staged file bytes. |
| Visit an Order and return | Resume the same in-app invoice draft/files; refresh authorized source context and apply incompatibility confirmation. A return does not invoke new creation. |
| Explicit new creation with an existing draft | Protect it before replacement; no silent reset or automatic save. |
| Reload/tab close | Register an unload warning where supported when unsaved inputs/files would be lost. Browser-memory drafts are not durable or cross-device; no reload-resilient storage service is introduced. |
| Cancel before persistence | Confirm discarding a nonempty draft; staying preserves it. On discard, clear draft/files without create/upload/source mutation. Standalone creation resets to blank; FRO-349 returns to the originating Order. |
| Submission pending | Prevent repeat submission and retain the original attempt context. Consume FRO-321's authoritative retry/concurrency protection; button disabling alone is insufficient. |
| Confirmed rejection | No invoice/creation events persist. Retain draft/files and show actionable errors. |
| Creation outcome unknown | Retain draft/files. Show a distinct result and resolve the original attempt before another creation; transport failure is not proof of rejection. Do not blindly resubmit or permit changed-payload replay. |
| Confirmed creation | Retain returned invoice ID and actual selected Order ID. Show the explicit result view and document outcomes; an actionable unsaved Create form must not remain. |
| Partial/failed uploads | Keep the invoice and successful files. Retain pending bytes; retry failed files against the same invoice without repeating creation or successful uploads. |
| Unknown upload outcome | Reconcile that upload before retry; retain the same invoice and file context. Do not duplicate an upload merely because its response was lost. |
| Standalone result | Provide explicit **Start another invoice**. Handle pending uploads or confirm deliberately leaving them first; explain loss of remaining browser-local files without implying deletion of saved data. |
| Create-from-Order result | Consume FRO-349's explicit return to the originating Order, retained separately from actual selected Order. Identify the actual invoiced Order when different; preserve confirmed creation if return navigation fails. |

Opening, searching, preselecting, changing tabs, cancelling and read-only navigation create no invoice, upload, Order save, event or success audit. After confirmed creation, refresh applicable linked-invoice and direct active-invoice-presence consumers for the actual selected Order. Do not falsely mark another originating Order or a split relative invoiced. Introduce no new presence indicator here.

## Components, ownership and integration

| Area | Owner / implementation contract |
| -- | -- |
| Create page | FRO-347, in `frontline-forwarding-client`; shared by standalone creation and FRO-349. |
| Entity, validation, recovery and invoice-owned files | FRO-321, in `frontline-forwarding-app`; blocks working integration. Consume delivered operation/authority names; do not invent existing Supplier Invoice endpoints or tables. |
| Order regime | FRO-356; retains its blocking relationship. |
| Create-from-Order | FRO-349 owns entry action, initial/return context and Order Details integration; this shared form supplies selection, drafts and recovery. |
| Documents style | FRO-335's current production-system presentation. Do not freeze an older Site revision's CSS as the implementation authority. |
| Saved invoice presentation | FRO-348; this ticket does not modify its contract or implement saved-record edits/progression. |
| Later Entry Note / Export integration | Their entity owners under FRO-321's staged delivery. Basic capture remains usable before these integrations. |

Reuse `AppShell`, `TopBar`, `Card`, `Tabs`, `FormField`, `Input`, `Select`, `Combobox`, `DatePicker`, `Popover`, `Button`, `Modal`, `Alert` and `Toast` from the live catalogue. The agreed Card/TopBar and stacked-section composition uses these primitives. New compositions/extensions are **remote Order search**, **focusable unavailable-option reason**, **pre-create file queue** and **creation/upload recovery**; mark them on review artboards and map them to existing primitives before implementation. No existing Tooltip component is assumed.

Staff-only invoice authority and record/company scope must govern direct route access, selection, creation and files; participant Order access is insufficient. Backend services enforce the same boundary across adapters and reverse responses. Do not grant new access or leak an inaccessible duplicate through UI errors.

Preserve the existing Order invoice-row/customs-value data, split ownership and lifecycle. No automatic invoice copying/movement through lineage. New entity records/fixtures follow FRO-321; no real legacy import or conversion is added here.

Preserve the existing dependency graph and release metadata. FRO-347's 0.0.6 delivery and FRO-349's dependency into FRO-326's 0.0.5 require release alignment; this ticket does not waive functionality or change milestones. Production branch creation/publication is outside this review's read-only production scope. The Site is a prototype, not a completed frontend integration.

## Decisions

| Decision | Reason |
| -- | -- |
| Comfortable direction A with production tokens/components | Match the approved shared form presentation and keep Greek labels readable. |
| Reuse the existing private Site | Preserve the review URL/audience; this task uses Sites instead of Cloudflare Pages. |
| Read-only initial VAT status, without progress/dates | Ordinary creation captures invoice facts; FRO-321 governs later audited events. |
| Explicit result and next action; confirm dirty Cancel | Prevent accidental draft loss and repeated invoice creation after success. |
| In-app draft/file retention with unload warning | Preserve ordinary navigation without adding durable draft storage. |
| Separate invoice creation and upload recovery | Preserve successful work and retry against the actual saved owner. |

## Acceptance criteria

1. The selected comfortable design renders the agreed heading, tabs, three cards and field order in EN/EL at desktop and approximately 400px. Production contains no review controls/annotations, list/details/edit view or breadcrumb.
2. Authorized eligible Order selection searches beyond an arbitrary first page, supports keyboard/dismissal behavior and fills the four derived fields. Missing Supplier is unavailable; absent Invoice company remains permitted. Search/dismissal alone preserves selection.
3. Explicit regime controls type, zero VAT/expiration and initial status. The unavailable storage option exposes its reason on hover/focus and cannot select/change the draft through click/Enter/Space.
4. Order/type changes preserve compatible data/files, confirm incompatible clearing, revalidate vessel eligibility and ignore stale lookup results. Return refresh cannot overwrite explicit reselection with initial context.
5. Entry Note unavailable/loading/error/denied/absent states are distinct and do not misrepresent one another. Basic capture works without the later integration; available direct/inherited references refresh without invoice resave.
6. Required Invoice date, Athens today, expiration chronology, currencies, optional Client-scoped vessel, exact monetary boundaries/precision and normalized Supplier/Invoice-number uniqueness match FRO-321, including cancelled duplicates.
7. Ordinary Υ.Δ. creation shows Not started; both other types show Not required. All three event dates are absent from Create and blank in the creation contract; advanced initial status/event payloads fail server validation.
8. Documents validates the specified types/size/name/emptiness, retains valid files beside errors and supports local Download/Remove. No upload occurs before confirmed creation; saved files use invoice ownership/authorization.
9. Drafts/file bytes survive tabs, language, ordinary in-app navigation and rejection. Dirty Cancel/new creation protects work; unload warning is registered without promising durable browser storage.
10. Submission distinguishes confirmed rejection, unknown creation and confirmed persistence. Recovery resolves the original attempt and preserves ID/data without duplicate creation or changed-payload replay.
11. Partial/unknown uploads preserve invoice/successful files and retry/reconcile only appropriate pending work. Explicit standalone next action and FRO-349 return handling protect pending bytes and actual-versus-originating Order context.
12. Staff-only access, source/permission concurrency rejection and correct selected-Order consumer refresh are verified. Existing Order invoice rows, customs values, split/lifecycle behavior and unrelated screens remain unchanged.

## Out of scope

Entity/database/API implementation owned by FRO-321; Order editing/regime overrides; historical advanced-status entry; saved-invoice edits/cancellation/stamping; Export bulk actions; Entry Note screens/registers; printing; Supplier Invoice list redesign; durable/cross-device draft storage; real-data migration; new global navigation; production branch or deployment.

## Context for agents

Production `main` reverified through authenticated `gh` on 23 October 2026: `3820e89e8caa341261e2d48bcb282d93e1bb1d03`. This is inspected source, not proof of deployed behavior. Paths below are relative to `Frontline-Forwarding/frontline-forwarding`.

| Source | Relevant fact / boundary |
| -- | -- |
| `frontline-forwarding-client/DESIGN.md`; `src/styles/theme.css` under that client | Live typography, comfortable density, semantic tokens, radii and layering. Theme/components take precedence over historical previews. |
| Client `src/components/layout/app-shell.tsx`, `top-bar.tsx`; `src/components/ui/card.tsx`, `tabs.tsx`, `input.tsx`, `select.tsx`, `combobox.tsx`, `date-picker.tsx`, `popover.tsx` | Actual frame/form primitives. Native Select cannot supply the focusable unavailable-option reason. Combobox currently filters supplied options locally; remote collection behavior needs the mapped composition. |
| Client `src/features/purchase-orders/components/purchase-order-form.tsx` | Existing Order form/reference-data patterns; not a Supplier Invoice implementation. |
| `docs/reference/database.md`; `docs/reference/graphql-api.md`; `docs/reference/rest-api.md`; `docs/reference/mcp-tools.md` | Supplier Invoice/Export/Entry Note are absent at this baseline. Consume newly delivered contracts. Existing purchase-order invoice rows are separate. |
| `docs/architecture/authorization.md`; backend `domain/purchaseorders/PurchaseOrderAuthorizationService.java` | Participant-scoped Order access does not establish staff-only Supplier Invoice permission. |
| `docs/workflows/attachments.md`; backend `web/attachments/service/AttachmentsApiService.java` | Uploads are separate operations against persisted owners; existing ownership is Order/Shipment, not Supplier Invoice. |
| Client `src/features/attachments/types.ts`; `components/attachment-panel.tsx` in that feature | Current panel requires a persisted owner and chooses Order/Shipment authority. Do not extend only the owner string and inherit the wrong permission; FRO-321 must supply invoice ownership. |
| Client `src/routes/secured/purchase-orders/new.tsx` | Existing create→toast→navigate flow does not provide the agreed saved-result/upload recovery. |
| FRO-321 / FRO-349 | Current approved initial statuses, field/validation, staged integration, recovery and entry/return contracts govern this shared form. |

## Post-deployment verification

Use authorized read-only inspection and controlled staging/test evidence. Never submit production forms, upload files or mutate production records merely to verify this ticket.

| Criteria | Concrete read-only check |
| -- | -- |
| 1 | Open Create without submitting; compare selected artboard, EN/EL, desktop/400px, tabs, card/field order and absence of review/history controls. |
| 2–3 | Search existing eligible/ineligible fixtures without saving; inspect derived fields, keyboard dismissal and unavailable-type hover/focus/selection prevention. Review paginated-search and denied-access test evidence. |
| 4 | Change unsaved fixture selections and choose Keep draft; inspect retained values/files and vessel options. Review stale-response and source-refresh tests. |
| 5 | Inspect unavailable/absent/error/denied lookup fixtures and authorized direct/inherited note links. Compare refreshed note references to read-only Order/admission results without invoice resave. |
| 6–7 | Inspect initial status/no-event controls. Read validation/concurrency test results for exact amounts, date boundaries, optional vessel, normalized/cancelled duplicates and forbidden advanced creation; read seeded invoice values for comparison. |
| 8–9 | Inspect staged-file and navigation test evidence for valid/error files, downloads/removal, retained bytes, Cancel/new-draft protection and unload handling. Confirm network/test evidence shows no create/upload on open or pre-save Cancel. |
| 10–11 | Read original-attempt, invoice and attachment IDs from rejected/unknown/partial-upload fixtures and test results. Confirm one invoice, retained successful uploads and explicit result/return actions; no repeated successful work. |
| 12 | Review allowed/denied direct/reverse/download and concurrent-source-change results. Compare selected-versus-originating Order presence and unchanged Order row/customs/split/lifecycle fixtures. |

**Reference:** [FRO-321](https://linear.app/front-line-ltd/issue/FRO-321) · [FRO-356](https://linear.app/front-line-ltd/issue/FRO-356) · [FRO-349](https://linear.app/front-line-ltd/issue/FRO-349) · [FRO-335](https://linear.app/front-line-ltd/issue/FRO-335) · [FRO-348](https://linear.app/front-line-ltd/issue/FRO-348) · [FRO-319](https://linear.app/front-line-ltd/issue/FRO-319) · [Create preview](https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site) · [Previous Create-page UI (version 28)](https://supplier-invoice-create-preview.frontlineltdproject.chatgpt.site/baseline-v28.html).
