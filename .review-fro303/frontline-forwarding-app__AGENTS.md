---
name: frontline-forwarding-app
description: Guidance for the Frontline Forwarding Spring Boot backend, including PO/colli journeys, warehouses, shipments, GraphQL, REST, MCP, jOOQ, PostgreSQL, and Spring Security.
---

# Frontline Forwarding backend

## Shared engineering workflow

Read the [root instructions](../AGENTS.md) and load or resume the task's local
playbook from the repository root before backend work. Follow its coherent
slices, separate model checkpoints, and approval of the actual diff before
every commit. This file retains backend business invariants, strict TDD,
verification, and documentation-generation requirements.

## Purpose and stack

This Java 25 / Spring Boot 4.1 service exposes the same business capabilities
through GraphQL, REST, and authenticated MCP tools. It uses jOOQ with PostgreSQL
18, stateless bearer authentication, Spring Security, Redis-backed caching, and
RabbitMQ publishing.

Keep domain and persistence code under `com.frontline.forwarding.domain` and
web-facing adapters under `com.frontline.forwarding.web`. Adapters must remain
thin and delegate to the same authorization-aware, transactional application
services.

## Package map

- `domain.purchaseorders`: purchase orders, stable handling units (collis),
  temporal PO membership, terminal dispositions, measurements, status and
  activity history, warehouse stays, splits, and colli journey events.
- `domain.shipments`: physical road/air/sea transfers, PO participation,
  shipment load units, stable colli contents, transport documents, and final
  handover.
- `domain.warehouses`: normalized operational warehouses.
- `domain.companies`, `domain.users`, `domain.vessels`, and `domain.locations`:
  shared organization, identity, vessel, and route reference data.
- `web.<feature>`: `*GraphQlApi`, `*RestApi`, and `*McpTools` entrypoints, with
  `input`, `output`, and `service` subpackages.
- `src/main/resources/graphql`: GraphQL SDL.
- `src/main/resources/db/migration`: Flyway-owned schema.
- `src/main/resources/data.sql`: sanitized development/test demo data.

Do not reintroduce the former `Stock` / `StockPackage` aggregate. A PO is the
workflow group, and a stable `HandlingUnit` is the physical colli identity.

## Core PO and colli rules

- One handling unit represents one whole colli. Its tracking code and
  `original_purchase_order_id` are permanent.
- A handling unit has exactly one current PO membership. Membership history is
  temporal and non-overlapping.
- A PO workflow applies to every current nonterminal colli. Never advance or
  ship only an implicit subset.
- An explicit PO split creates a child PO and moves selected existing
  handling-unit identities by closing and opening memberships atomically. It
  must never copy a colli.
- A partial shipment selection moves the selected nonterminal collis from an
  `IN_STOCK` parent PO into a child PO that remains `IN_STOCK` in the same
  warehouse, then reserves that child for the shipment. Unselected and terminal
  collis stay on the parent. The split and reservation must be one transaction.
- A terminal damaged, uncollectable, missing, cancelled, or other unusable
  colli remains a current member of its PO for reference. It is excluded from
  measurement and shipment eligibility.
- Warehouse custody is temporal. An intermediary hub creates a new warehouse
  stay without replacing the PO or handling-unit identity.
- `LOCATION_UNKNOWN` means the PO is inactive because current location is not
  known; it is not delivery or cancellation. Preserve all last-known history.
- Status transitions, PO activity, measurements, split records, terminal
  dispositions, handovers, and colli journey events are append-only.
- PO and shipment attachments keep auditable metadata in PostgreSQL while file
  bytes remain in private object storage. Every attachment must have exactly
  one foreign-key-backed owner; never authorize access from an unverified
  polymorphic id alone.
- A split child inherits the active purchase-order attachments visible on its
  direct parent through immutable foreign-key-backed links. Inherited files are
  read-only on the child, retain their original owner and upload provenance,
  and must never duplicate object-storage bytes.
- Journey events use a monotonic sequence per handling unit and carry the PO at
  event time plus warehouse, shipment, load-unit, split, or disposition
  references when relevant.

## Shipment rules

- A shipment is one physical transfer by `ROAD`, `AIR`, or `SEA` from one
  warehouse to exactly one destination. A `NETWORK_TRANSFER` targets either a
  `FRONTLINE_HUB` operated by a `FRONTLINE` company or an
  `ASSOCIATED_AGENT_HUB` operated by an `ASSOCIATED_AGENT` company. A
  `THIRD_PARTY_TRANSFER` targets an active external `AGENT` company.
  `DELIVERY_TO_LAUNCH_STATION` also targets an external `AGENT`, while direct
  `DELIVERY_TO_VESSEL` derives its vessel destination from the participating
  POs and has no destination agent.
- One transport document belongs to one shipment. Document number reuse across
  shipments is invalid.
- Each selected colli is already a physical shipment package and may travel
  individually. Shipment-scoped `PALLET` and `CARDBOARD_BOX` load units are
  optional overpacks. A load unit may contain stable collis from several POs,
  while one colli may belong to at most one load unit in a shipment.
- Shipment planning accepts `IN_STOCK` POs, supplier `READY` POs, and
  `EXPECTED_READINESS` POs dated today or later at the same origin warehouse.
  Each PO must either include exactly all current nonterminal collis or move
  the selected collis into an explicit in-stock child PO before reserving that
  complete child PO.
- Only a `PREPARING` shipment can be cancelled. Cancellation releases the same
  colli identities and restores their POs to `IN_STOCK`.
- Dispatch makes route and content immutable, closes source stays, creates
  inbound stays for warehouse transfers, and updates every PO atomically.
- Arrival closes shipment movement. A network-hub arrival preserves the
  identities for the next stay/transfer. A third-party transfer records
  handover to its destination agent; a DOB arrival records its purpose-specific
  handover and completion.

## Authorization

Backend authorization is the source of truth. Frontend visibility is only UX.

- PO collection queries apply participant-company scope in SQL. Client,
  supplier, and collection-agent users may read only POs in which their own
  company participates.
- PO detail and handling-unit history authorize the target through the current
  PO membership.
- Only Frontline users and system administrators with `PURCHASE_ORDER_CREATE`
  or `PURCHASE_ORDER_EDIT` may mutate POs.
- Shipment access requires `SHIPMENT_VIEW`, `SHIPMENT_CREATE`, or
  `SHIPMENT_EDIT` and a Frontline/system-administrator identity. Do not expose a
  mixed-PO shipment by filtering it after loading.
- Derive the actor from `AuthorizationService.currentUser()`. Never accept an
  actor or owner id from a user-facing payload.
- Validate both action authority and organization/record scope before returning
  or changing sensitive data.

## Transactions and locking

Business commands that affect PO state, memberships, warehouse stays,
shipment allocation, activity, or journey history must be atomic.

- Lock purchase orders in ascending id order, then handling units in ascending
  id order, and re-read current memberships/allocation under the lock.
- Use optimistic versions for aggregate status/header updates in addition to
  row locks.
- Let PostgreSQL constraints and triggers defend identity, state, and
  append-only invariants, but return clear application validation before a
  predictable constraint failure.
- Never delete or rewrite history to make a command succeed.

## API adapters

- User JSON endpoints live under `/api/v1/**` and use the bearer token returned
  by `POST /authenticate`.
- GraphQL SDL names, nullability, enums, and controller methods must remain
  synchronized.
- Prefer explicit command endpoints/mutations such as readiness, warehouse
  arrival, stock confirmation, split, terminal disposition, dispatch, arrival,
  and pre-dispatch cancellation. Do not add a generic status setter.
- MCP is exposed at `POST /mcp` and acts as the authenticated application user.
  MCP tools must call the same API services as REST and GraphQL.
- Every `@McpTool` needs explicit behavior annotations and
  `generateOutputSchema=true`. Read tools are read-only, non-destructive,
  idempotent, and closed-world. State transitions are destructive writes.
- MCP output schemas must match runtime JSON. Prefer dedicated non-null summary
  records; annotate genuinely optional MCP record components if needed.
- Cap list sizes at 100.

## Persistence and environments

Flyway migrations are the schema source of truth. The consolidated
`V1__initial_schema.sql` is the clean baseline for the refactored development
model. After this baseline is shared, make later changes in new monotonic
migrations rather than rewriting executed migrations.

`data.sql` is enabled for development and tests, not staging or production. The
`dev` profile runs `dev-reset.sql` before `data.sql` on every startup, so a dev
redeployment intentionally discards runtime data and restores the deterministic
demo state. Both scripts must remain sanitized and free of secrets.

Local dependencies use `compose.yaml`:

```bash
docker compose up -d
```

Local PostgreSQL is on port 5433, Redis on 6380, RabbitMQ on 5673, and the
RabbitMQ management UI on 15673. Non-development profiles read credentials and
tokens from the `FRONTLINE_*` environment variables already named in the
configuration files.

## TDD and verification

Write or update a failing test before production behavior. Put tests at the
boundary they protect:

- PostgreSQL Testcontainers tests for constraints, triggers, transactions, and
  repository behavior;
- service tests for authorization, validation, state transitions, actor
  attribution, and rollback;
- GraphQL/REST tests for authenticated access, denied partner mutations,
  participant scoping, validation classification, and payload contracts;
- MCP tests for bearer security, `tools/list`, output-schema/runtime agreement,
  and direct tool authorization.

Run before handoff:

```bash
./gradlew build
```

If a check cannot run, state why.

## Documentation

Generated references are committed with their sources:

- migration or `data.sql`: `./scripts/docs/generate-reference.sh`
- GraphQL SDL: `./scripts/docs/generate-graphql-reference.sh`
- REST controller/DTO/security metadata: `./scripts/docs/generate-rest-reference.sh`
- MCP tool/DTO/authorization metadata: `./scripts/docs/generate-mcp-reference.sh`

Run these scripts from the repository root. Do not edit generated reference
files manually. Update curated architecture, authorization, and workflow pages
when domain behavior changes.
