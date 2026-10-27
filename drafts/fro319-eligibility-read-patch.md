# FRO-319 patch — eligibility read and post-admission children (from FRO-355 Q2/Q4)

Status Todo, labels entry note/Backend/Story/Ready unchanged. Baseline updatedAt 2026-10-27T08:07:00.210Z.

## Edit 1 — Eligibility and storage admission

Before:

* neither owns a note nor is covered by another note (see **Split coverage**).

After:

* neither owns a note nor is covered by another note (see **Split coverage**).

An Order split from another Order **after** that Order's storage admission has no admission of its own, even when it keeps the parent's stock time (Shipment-preparation partial selection). It is never eligible for its own note; it becomes covered once the admitted Order has one.

## Edit 2 — Access → Retrieval

Before:

Retrieval: by entry number; by Order (direct or inherited); by Supplier Invoice; by Export; and the active-case list.

After:

Retrieval: by entry number; by Order (direct or inherited); by Supplier Invoice; by Export; and the active-case list. **Creation eligibility for one Order** returns eligible, or the first failing reason in this order — cancelled, not Τελωνειακή Αποθήκευση (including Greece = No), not admitted, admitted under another Order (identifying it), already owned or covered (identifying the note and owning Order) — using the same check as creation, within the caller's access.
