# Authorization

Authorization is backend-owned business logic. Every endpoint and tool must
enforce both the authority required for an action and the organization scope of
the affected record before data is returned or changed.

## User groups

| Group | Typical access |
| --- | --- |
| Frontline operators and managers | Operate permitted workflows across customer and partner records |
| Client-company users | Access records scoped to their own client company |
| Supplier-company and agent users | Access records in which their organization participates |
| System administrators | Configure and support the platform according to system authorities |

## Core rules

- Collection queries must be scoped in the repository query so unauthorized
  rows are never loaded and filtered later.
- Detail and mutation operations must authorize the target record.
- User coverage is routing metadata and does not grant record access.
- Client, supplier, and agent users do not gain cross-company visibility.
- REST, GraphQL, and MCP calls must use the same application services and
  authorization behavior.
- Client-side hiding is a usability feature, not a security boundary.
- Table preferences are private to the authenticated user. Preference APIs
  derive the owner from the bearer-token principal and never accept another
  user's identifier for reads or writes.

## Warehouse address maintenance

`WAREHOUSE_VIEW` and `WAREHOUSE_EDIT` belong to Frontline operators, Frontline
managers, and system administrators. The shared application service also checks
that internal/system role before returning maintenance records or history, or
changing an address. Client, supplier, and agent roles have neither authority,
including managers and users of the company operating a warehouse.

Maintenance reads include inactive warehouses and paginate with a maximum of
100 rows. Address updates require the version read when editing began. The
server locks the warehouse, rejects stale versions, and atomically records the
authenticated actor and the complete before/after address. Callers cannot assign
the actor, modify history, or change warehouse identity, operator, kind, or
activity through the address command. Existing `PURCHASE_ORDER_VIEW` warehouse
lookups remain operational reference data; they do not grant maintenance or
audit-history access. See [company and warehouse addresses](../workflows/company-and-warehouse-addresses.md).

## Purchase orders and shipments

- `PURCHASE_ORDER_VIEW` permits participant-scoped reads. Client, supplier, and
  collection-agent users see only POs in which their own company is a party;
  the scope is applied in the database query.
- Lineage does not expand PO access. Family queries apply the same participant
  scope in SQL; lineage root and parent fields are null for inaccessible POs,
  and child/family navigation includes only visible POs. The combined activity
  timeline follows the visible ancestor path to the requested PO and stops at
  an inaccessible ancestor. It references existing activity records without
  copying history.
- Inherited attachments are authorized through the requested child PO and a
  verified inheritance link. They remain read-only there; permission to read
  an inherited file does not grant general access to its source PO. See
  [attachment inheritance](../workflows/attachments.md#inheritance-through-po-splits).
- PO creation and mutation require `PURCHASE_ORDER_CREATE` or
  `PURCHASE_ORDER_EDIT` and a Frontline or system-administrator identity.
  Partner users are view-only.
- Manual supplier-readiness eligibility and send operations require
  `PURCHASE_ORDER_EDIT` and a Frontline or system-administrator identity.
  Recipient details are derived from the PO supplier's mandatory main contact;
  callers cannot provide or override an email address.
- Public supplier-readiness response endpoints require no bearer identity, but
  a valid unexpired single-use token is a narrowly scoped capability for one
  reminder. Only the token's matching response action is accepted; it grants
  no general PO read access and exposes only the PO number and readiness prompt.
  The email page keeps the token in the URL fragment, and API calls carry it in
  `X-Readiness-Token` so ordinary backend access logs do not record it.
- Shipment reads and commands require the corresponding `SHIPMENT_*` authority
  and a Frontline or system-administrator identity. Shipment records can mix
  several client POs, so they are not exposed through participant-company
  scoping.
- Delivery-note reads, draft creation, and issuance require the corresponding
  `DELIVERY_NOTE_*` authority and a Frontline or system-administrator identity.
  Frontline operators may create and issue notes; fiscal cancellation is
  limited to Frontline managers and system administrators.
- A handling-unit detail read is authorized through its current PO membership.
  Its historical memberships and journey do not grant access to an otherwise
  unauthorized company.
- Every state-changing command attributes status, activity, journey,
  measurement, split, terminal-disposition, shipment, and handover records to
  the authenticated actor as applicable.

Changes to authorities, organization scoping, or workflow permissions require
tests and a review of this page.

