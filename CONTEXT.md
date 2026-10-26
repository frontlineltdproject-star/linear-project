# Front Line logistics

Shared vocabulary for Order and colli ticket planning.

**Shipment readiness**:
Confirmation that the participating goods are stock-confirmed at the origin and their physical packing is complete and matches the confirmed arrangement, including goods travelling individually. It is distinct from a saved packing plan and from permission to depart, which also requires a transport-document number.

**Pickup responsibility**:
Whether Front Line is responsible for collecting an Order's goods from the supplier. Yes records that responsibility; No records that Front Line is not responsible; unset means it has not been recorded. It does not record completed collection and is independent of Greece, warehouse location and Shipment route.

## Language

**Order DN Import / DN Export**:
Independent text references to an Order's incoming and outgoing delivery-note documents. They are distinct from attachments and from drafting or issuing a Shipment delivery note.

**Shipment destination geography**:
The country and city of the Shipment's physical destination or handover. It is distinct from a receiving agent's registered office address and from the vessel's identity.

**Order customs regime (Τελωνειακό καθεστώς)**:
The customs arrangement applying to the whole Order: Ελεύθερη Κυκλοφορία, Τελωνειακή Αποθήκευση or Τελωνειακή Αποταμίευση. It is distinct from the physical warehouse and that warehouse's licences; Orders marked Greece = No have no applicable regime.

**Warehouse licence / authorisation**:
A reference authorising a warehouse for the associated customs arrangement. It describes the warehouse's authorisation, not an individual Order's selected regime.

**ΑΛΚ (Αριθμός Λογιστικής Καταχώρησης)**:
The registration reference used for an Order under Τελωνειακή Αποταμίευση. It is distinct from a warehouse licence reference and from an Entry Note number.

**Registration coverage**:
The goods covered by one customs registration, including those moved into child Orders by a split. Covered Orders share the same current ΑΛΚ; a common family root or equal reference text alone does not establish coverage.

**Vessel–Client relationship**:
A vessel can belong to multiple Clients. A vessel's Clients are its associated commercial Clients, distinct from its invoicing companies.

**Supplier**:
A shared company record that can be selected on multiple Orders. It exists independently of an individual Order or an unsaved Order draft.

**Supplier main contact**:
The supplier company's named contact, with an email address and phone number. This is company contact information, not a portal user account; its email is used by the readiness-reminder workflow.

**Order**:
The office's stock-list item, also called a purchase order. These names refer to the same business record in this project.

**Colli**:
An individually identified physical handling unit belonging to an Order. A shipment load unit may group multiple collis without replacing their identities.

**Damaged Packing**:
A flag describing damaged packaging, not damaged goods. It is distinct from the terminal Damaged disposition of a colli.

**Per-colli PCS**:
The retired declared piece quantity within a colli. It is distinct from the number of physical collis and from invoice-row quantity and unit.

**Per-colli Notes**:
The retired general free-text note for an individual colli. It is distinct from the colli's contents Description, Order Internal/External Notes and dedicated UN / DG details.

**Individual colli (Μεμονωμένο κόλι)**:
A participating colli of a Shipment that is not inside any load unit and travels as its own transport piece. It is distinct from the colli flag Unpacked, which means the goods arrived without packaging.
_Avoid_: unpacked colli, loose colli

**Transport pieces**:
The physical packages presented for transport: individually shipped collis plus shipment load units. Collis inside a load unit are not counted again as individual transport pieces.

**Order Invoice company**:
The invoicing company selected for an individual Order, also labelled Invoice to. It is distinct from the Client and from the recipient recorded on an issued delivery note.


**Delivery note (δελτίο αποστολής)**:
Front Line's goods-movement document for a Shipment departing a Frontline-operated warehouse in Greece, regardless of destination or Shipment purpose. Departures from associated-agent warehouses and foreign warehouses are outside this workflow; the document is distinct from the Shipment and Export Customs Declaration.


**Saved delivery-note address**:
A reusable named loading or destination address, separate from a warehouse or company record. It is distinct from the address values recorded on a Shipment's delivery notes.

**Delivery-note address source**:
The warehouse, company or saved address selected to supply loading or destination address details. Completing or correcting those details for the delivery notes does not change that original record.

**Client delivery location**:
A physical delivery address associated with a commercial Client, distinct from its invoicing companies and their fiscal addresses. A shared delivery location can be associated with more than one Client.

**Export Customs Declaration (Export)**:
One export customs declaration with its own MRN, belonging to one physical Shipment and one fiscal group. A Shipment can have several Exports; the Export owns its explicitly selected Supplier Invoices, not the Shipment's goods.

**Export type**:
The Export's procedure, set by the Invoicing company's tax registration: Greek invoicing company or Foreign invoicing company. It is distinct from a Supplier Invoice's own invoice type.

**Shipper (Αποστολέας)**:
The company shown as sender on an Export: the Invoicing company for a Greek invoicing company Export, the Supplier for a Foreign invoicing company Export. It is distinct from the Order's Client.

**Informative List**:
The Supplier Invoices an Export declares: its saved, explicitly selected invoices. It is not the Shipment's Orders, not the creation suggestions and not a stamping or ΥΔ print selection.

**Paperwork only invoice**:
An invoice in an Export's Informative List whose linked Order has no collis in that Export's Shipment. It adds its Order to Connected Orders but no physical goods to the Shipment.
