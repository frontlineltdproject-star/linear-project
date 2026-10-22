# Front Line logistics

Shared vocabulary for Order and colli ticket planning.

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
