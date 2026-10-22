# Purchase orders and colli journeys

A purchase order (PO) is the operational group whose movable collis are handled
together. A handling unit is one physical colli with a permanent tracking code.
The handling unit—not a copied package row—is the identity followed from the
initial PO, through warehouses and shipments, to the final destination.

## Aggregate boundaries

- A handling unit has one immutable `original_purchase_order_id` and exactly
  one current PO membership.
- Membership history is temporal. A membership is closed only by an explicit PO
  split, and the same handling-unit id is then assigned to the child PO.
- A terminal damaged, uncollectable, missing, cancelled, or otherwise unusable
  colli remains a current member of its PO for reference. Its immutable terminal
  disposition excludes it from shipment eligibility.
- A warehouse stay records where the PO is expected, awaiting import, physically
  present, in stock, or departed. Intermediary hubs create a new stay without
  changing PO or colli identity.
- PO status transitions, operator activity, measurements, terminal
  dispositions, and colli journey events are append-only audit records.

```text
Parent PO ── current membership ──► HU-0000000123
    │                                   │
    └─ explicit split ─► Child PO       ├─ same stable identity
                         current member ◄┘

Terminal HU: remains a current member of its PO, but cannot enter a shipment.
```

## PO lifecycle

The principal warehouse flow is:

```text
PENDING → EXPECTED_READINESS → READY → IN_STOCK → PREPARED_FOR_SHIPMENT → SHIPPED
                                                                              │
                  Frontline network transfer                                 ├→ AWAITING_IMPORT → IN_STOCK
                  third-party agent / DOB                                    └→ ARRIVED_AT_DESTINATION
```

`LOCATION_UNKNOWN` is distinct from delivery or cancellation. It means the
system retains the complete last-known journey but cannot currently assert the
collis' location, so the PO is inactive. Its current warehouse stay is empty,
while `lastKnownWarehouseStay` retains the most recent physically reached
warehouse, storage position, and the time location became unknown. If location
is lost during transit, the shipment command changes every participating PO
and the unresolved inbound warehouse stays together. `CANCELLED` is used for
an explicitly cancelled PO or when terminal dispositions leave no movable
collis.

The status applies to the PO as a whole. A workflow never advances only part of
a PO. When a subset must follow a different workflow, the command creates an
explicit child PO and reassigns those existing handling units before either PO
advances.

In the client, each PO status uses a distinct, stable status-pill tone to make
mixed operational tables easier to scan. The tone is a presentation aid only:
the localized status text and leading dot remain visible, and the status value
continues to be the sole source of workflow meaning. The complete light/dark
palette is documented in `frontline-forwarding-client/DESIGN.md`.

## Commands and invariants

### Create and readiness

The Create and Edit PO forms show the existing pickup-in-Greece flag as
**Greece** (**Ελλάδα** in Greek) on the **General** tab, directly above
**Collection agent**. This presentation preserves the flag's meaning, Yes/No
values, Yes default for new orders, and saved values. The PO list uses the same
label and retains the `pickupInGreece` column identifier so saved column
visibility and order continue to apply.

Creation requires the owner's reference and validates the client, optional
vessel, supplier, collection agent, optional invoice-company assignment, route,
and opening warehouse. Collis are optional because their count and physical
details are often not known until supplier readiness or opening-warehouse
intake. When supplied, creation creates their stable handling-unit identities,
initial memberships, declared measurements, and journey events together with
the PO's expected warehouse stay and initial audit records.

### Supplier invoice rows

Supplier invoice rows belong to the PO, not to individual collis. They record
the commercial lines supplied for that order while leaving physical package
identity and movement in the handling-unit model. A PO may have zero or more
invoice rows. Each row has:

- a stable database id;
- an automatically assigned, contiguous line number;
- a required description;
- an optional HS code stored as text so leading zeroes are preserved;
- a positive whole-number quantity and a unit of `PC`, `SET`, or `PKT`; and
- a required non-negative total amount with an explicit three-letter currency
  code.

The create command accepts new rows without ids. During an update, a submitted
id must already belong to that PO; retained ids preserve identity, omitted rows
are removed, and rows without ids are created. The submitted list order
determines the new line numbers. Duplicate ids and attempts to reuse a row from
another PO are rejected.

Invoice rows can be changed while the PO is `PENDING`,
`EXPECTED_READINESS`, `READY`, or `IN_STOCK`, provided it has no open shipment
participation. The PO lock, header update, and complete invoice-row replacement
run in one transaction. Each create or update that changes the collection
appends an `INVOICE_ROWS_CHANGED` activity with added, updated, and removed
counts.

REST, GraphQL, and MCP detail contracts expose the same ordered row structure.
The create/edit form and PO detail view provide dedicated Invoice rows tabs;
the detail tab is read-only. These rows are the PO-level foundation for later
invoice workflows. Producing accounting invoices, tagging supplier-invoice
attachments, OCR extraction, and invoice-specific locking rules remain outside
this workflow.

Active collis can be added, corrected, or removed while the PO is `PENDING`,
`EXPECTED_READINESS`, or `READY`, including after its arrival at the opening
warehouse but before stock confirmation. Corrections preserve permanent colli
identities. Additions create new identities, while removals retain the existing
identity with an audited `CANCELLED` disposition. The PO may continue readiness
and record opening-warehouse arrival with no collis. Collis remain editable in
`IN_STOCK`; active shipment participation is the boundary that freezes the
colli set. Stock confirmation still requires at least one movable colli. If the
PO was already planned into a preparing shipment, it moves directly to
`PREPARED_FOR_SHIPMENT`; otherwise it moves to `IN_STOCK`.

Each colli independently records whether it contains dangerous goods and
whether it is bonded. A dangerous-goods class may be recorded for a flagged
colli. The PO-level dangerous-goods and bonded indicators are derived from its
current colli memberships, so the indicators follow the same physical collis
when a PO is split rather than becoming stale copied header values.

Only a `PENDING` PO can have its expected readiness date recorded, which moves it to
`EXPECTED_READINESS` and appends an expectation event to every nonterminal colli.
When the supplier confirms that all movable collis are physically ready for collection,
the PO moves to `READY` and a ready-for-collection event is appended to each colli.

Supplier-readiness reminders use two explicit types:

- a `PENDING` PO without a readiness date receives one automatic
  `ASK_READINESS_DATE` reminder; internal operators may send further manual
  reminders while the PO remains pending and no reminder for the PO is awaiting
  delivery;
- an `EXPECTED_READINESS` PO becomes eligible for
  `CONFIRM_READINESS` two calendar days before its expected date in
  `Europe/Athens`. If that date is Saturday or Sunday, eligibility moves back
  to Friday, so both Monday and Tuesday readiness dates are reminded on the
  previous Friday. The scheduler creates at most one automatic reminder for
  each PO/readiness-date pair, while internal operators may send additional
  manual reminders from that date through the day after expected readiness,
  provided the previous reminder is no longer awaiting delivery. Scheduling,
  manual sending, and queued delivery pause on weekends and resume on the next
  weekday. Public holidays are not part of this calculation.

Every reminder snapshots the supplier company's mandatory main contact and
atomically creates a durable email-outbox message. Manual eligibility and send
commands require `PURCHASE_ORDER_EDIT` plus a Frontline or system-administrator
identity. A database uniqueness rule prevents concurrent requests from
creating more than one pending reminder for a PO. Sent or terminally failed
reminders do not block a later manual reminder. Partner users cannot queue
reminders or override recipients.

Immediately before provider delivery, the outbox enters a reconciliation-required
state that stale-lock recovery cannot requeue. A confirmed provider failure can
still be retried, while an interrupted or unrecorded provider outcome remains
held for reconciliation instead of risking a duplicate email.

The backend scheduling job, not a purchase-order page request, creates the
first missing-date reminder. The operator reminder panel reads and periodically
refreshes the reminder history so newly queued automatic reminders and their
delivery status appear without reloading the page. Reading eligibility or
history never creates a reminder.

The public response endpoint accepts only the hashed token's matching action.
Each email links to the public `/supplier/readiness#token=...` page, which keeps
the token in the browser fragment and sends it to the backend only through the
dedicated readiness-token header. The page supports English and Greek, shows
only the PO number and relevant expected date, and replaces expired, used, or
invalid token details with one safe message.
For a confirmation reminder, `CONFIRMED` consumes and audits the token without
changing the PO. `READINESS_DATE_REPLACED` requires a different future date
and updates the existing expectation. Supplier-provided and replacement dates
also append the corresponding PO activity with no internal user attribution.
A missing-date reminder accepts
`READINESS_DATE_PROVIDED`, also requiring a future date, and moves the PO from
`PENDING` to `EXPECTED_READINESS`. Token consumption, the append-only supplier
response record, and any PO date update are one transaction. Replays, expired
tokens, mismatched actions, and stale expected dates are rejected.

Frontline operators may correct an unreserved PO between `PENDING`,
`EXPECTED_READINESS`, and `READY` through the dedicated status-correction
command. A reason is mandatory, `EXPECTED_READINESS` requires a readiness date,
and correction to `PENDING` clears the current readiness date. The command is
blocked while an open shipment participation exists; cancelling that
pre-dispatch participation removes the block. Every correction appends status
transition and activity audit records without rewriting readiness or colli
journey history. `IN_STOCK` remains reachable only through stock confirmation.

### Warehouse arrival and stock confirmation

For a `READY` PO at its expected opening warehouse, stock confirmation records
the initial arrival and moves the PO directly to `IN_STOCK` in one transaction.
It requires a storage position and exactly one confirmed measurement for every
current nonterminal colli. Arrival and stocked journey events share the same
atomic command, so validation failure records neither step.

An inbound shipment leg must still be completed through the shipment arrival
command so shipment participation, load-unit movement, warehouse stay, and
every colli journey close atomically. The arrived PO remains `AWAITING_IMPORT`
until stock confirmation, which then moves it to `IN_STOCK` without recording a
second arrival.

### Advance shipment planning

A PO with at least one current nonterminal colli can be added to a preparing
shipment from its opening warehouse when it is:

- already `IN_STOCK`;
- `READY` at the supplier; or
- `EXPECTED_READINESS` with a readiness date of today or any future date.

The same eligibility rule governs both the PO-table selection and the shipment
composer. An upcoming PO keeps its readiness status and expected warehouse
stay while the shipment is being planned. Creating the shipment freezes its
colli set; collis cannot be added, edited, or removed while that shipment
participation remains open.

Dispatch still requires every participating PO to have completed stock
confirmation. Stock confirmation changes a planned `READY` PO to
`PREPARED_FOR_SHIPMENT`, after which the shipment can dispatch. Cancelling the
preparing shipment leaves an upcoming PO in its readiness state and returns an
already stocked reserved PO to `IN_STOCK`.

### Shipment destinations

Shipment purpose determines both the commercial relationship and the legal
destination shape:

- `NETWORK_TRANSFER` keeps custody inside the Frontline network. It targets a
  warehouse operated directly by a `FRONTLINE` company (`FRONTLINE_HUB`) or a
  hub operated by a `ASSOCIATED_AGENT` company
  (`ASSOCIATED_AGENT_HUB`). Arrival creates the next warehouse stay and does not
  record a final handover.
- `THIRD_PARTY_TRANSFER` transfers custody outside the Frontline network. It
  targets an active external `AGENT` company, never an external warehouse.
  Arrival records handover to that same destination agent.
- `DELIVERY_TO_VESSEL` is direct DOB. It has a `VESSEL` destination derived
  from the common vessel on all participating POs, uses no destination agent,
  and requires a vessel handover.
- `DELIVERY_TO_LAUNCH_STATION` uses an active external `AGENT` destination and
  requires a launch-station handover.

Company relationships are exclusive company types. An associated network agent
is not also treated as an external third-party agent.

In the shipment composer, selecting **Frontline warehouse** filters the
destination picker to active `FRONTLINE_HUB` records operated by Frontline.
Selecting **Associated agent hub** filters it to active
`ASSOCIATED_AGENT_HUB` records operated by active associated-agent companies.
The origin warehouse is excluded in both cases. Changing either selection
clears any previously selected destination.

### Explicit split

A split is allowed while the parent PO is `PENDING`, `EXPECTED_READINESS`, or
`READY`. The child starts a new `PENDING` collection workflow; later warehouse
or shipment states cannot be silently rewritten as a split. It:

1. creates a child PO with direct-parent and root lineage;
2. closes each selected colli's current membership on the parent PO;
3. opens a membership on the child at the same instant;
4. copies the commercial header and invoice-row values into new child-owned
   rows, without copying attachment bytes; and
5. records split items and journey events without copying a handling unit.

The copied header includes the parent's readiness date and remark even though
the manual-split child starts `PENDING`. A missing-date reminder still requires
a null readiness date; a pending child with an inherited date does not receive
that reminder automatically.

Every active document visible on the parent at split time is linked to the
child as an inherited, read-only attachment. Descendant splits carry those
same source links forward, preserving the original PO and upload provenance
without creating another metadata row or object-storage object. Because the
source bytes are shared, a source attachment with child links cannot be
deleted. Documents uploaded to the parent after the split are not implicitly
added to an already-created child.

Terminal collis are never moved by a split. They remain terminal members of the
parent PO. The lineage lets an operator navigate the visible PO family, while
each colli's membership history provides the reverse trace. A child detail view
also exposes the authorized root-to-current activity timeline, so the original
PO history remains visible without duplicating audit rows.

Child identifiers are allocated across the whole root family while the root PO
is locked. Numeric database PO ids remain separate from visible identifiers.
The owner-reference suffix uses the root's original owner-reference base even
if its editable current reference later changes. If the root identifiers are
`PO-0000001` and `OWN-REF-0000001`, the first child is
`PO-0000001_1` / `OWN-REF-0000001_1`, the second is `_2`, and so on.
Descendant splits use the same root-wide sequence, not a per-parent
sequence. Child internal numbers, owner references, and lineage are immutable.

The PO list and detail expose a derived lineage tag rather than storing another
status:

- a PO created by a split is `PARTIAL`;
- a root PO with one or more children is `BALANCE`;
- an unsplit PO has no lineage tag.

If a child is split again, it remains `PARTIAL`; its direct parent, root, and
direct children remain explicit lineage fields.

### Shipment-preparation partial selection

Shipment creation may select a subset of the nonterminal collis from an
`IN_STOCK` PO. The operator must either include every eligible colli or confirm
the partial selection. For a confirmed partial selection, the shipment command
atomically:

1. creates an `IN_STOCK` child PO at the same origin warehouse, using the next
   root-family suffix;
2. preserves the child arrival, stock time, and storage position;
3. moves every selected nonterminal colli identity into that child;
4. leaves unselected and terminal collis on the parent PO;
5. creates shipment participation for the child and reserves the child and its
   selected collis for the shipment; and
6. records the shipment id in the split journey and activity context.

This is distinct from the collection-stage split above: it does not restart
readiness or warehouse intake. If any split, membership, load-unit, or shipment
reservation write fails, the whole command rolls back. Cancelling the preparing
shipment releases the reservation and restores the child to `IN_STOCK`; it does
not merge the child or its collis back into the parent.

### Terminal disposition

A terminal disposition is immutable and requires an operational reason. The
colli stays on its PO as a historical and physical reference, but is excluded
from readiness measurements and shipment completeness. If all current collis
are terminal, the PO closes with outcome `NO_MOVABLE_COLLIS`.

## Activity and journey records

PO activity explains operator-facing changes and messages. Status transitions
provide the state audit. Handling-unit journey events provide the physical
trace and carry references to the PO at that moment, warehouse stay, shipment,
optional shipment load unit, split, or terminal disposition as appropriate. A
colli that is not repacked remains an individual shipment package and therefore
has no load-unit reference.

Journey sequence numbers are monotonic per handling unit. Existing events
cannot be updated or deleted. Each event resolves its raw references to the PO
number, warehouse stay, shipment route/document, the colli's specific shipment
load unit, split, terminal disposition, and final handover where applicable.
The trace deliberately excludes other collis in a mixed shipment.

Operators and authorized PO participants can retrieve this trace by stable id
or permanent tracking code through REST, GraphQL, or MCP. PO participant scope
still applies. Seeing a colli's resolved movement does not grant access to the
mixed shipment aggregate or expose the other participating POs.

