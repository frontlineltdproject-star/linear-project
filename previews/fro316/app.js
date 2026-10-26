'use strict';
/* FRO-316 Shipment details — static preview. Fixture data only; every operation is a browser-local simulation. */

/* Greek for strings not yet in the production labels (proposed; confirm with the office). Production labels in EL win. */
const ELX = {
  'Dashboard':'Πίνακας ελέγχου','Purchase orders':'Παραγγελίες αγοράς','Shipments':'Αποστολές','Warehouses':'Αποθήκες','Users':'Χρήστες','Companies':'Εταιρείες',
  'Shipment':'Αποστολή','Overview':'Επισκόπηση','Orders and collis':'Παραγγελίες και κόλι','History & activity':'Ιστορικό και δραστηριότητα','Documents':'Έγγραφα','Available actions':'Διαθέσιμες ενέργειες',
  'Shipment details':'Στοιχεία αποστολής','Shipment status':'Κατάσταση αποστολής','Status':'Κατάσταση',
  'Preparing for dispatch':'Προετοιμασία για αποστολή','Ready for dispatch':'Έτοιμη για αποστολή','Dispatched':'Απεστάλη','Arrived':'Αφίχθηκε','Cancelled':'Ακυρώθηκε','Location unknown':'Άγνωστη τοποθεσία',
  'Road':'Οδική','Air':'Αεροπορική','Sea':'Θαλάσσια','Mode':'Τρόπος μεταφοράς','Unknown':'Άγνωστο',
  'Document type':'Τύπος εγγράφου','Document number':'Αριθμός εγγράφου','Transport reference':'Στοιχείο μεταφοράς','Not recorded':'Δεν καταχωρίστηκε',
  'Air Waybill (AWB)':'Αεροπορική φορτωτική (AWB)','Bill of Lading (B/L)':'Φορτωτική (B/L)',
  'Departure date':'Ημερομηνία αναχώρησης','Arrival date':'Ημερομηνία άφιξης',
  'Created at':'Δημιουργήθηκε','Created by':'Δημιουργήθηκε από','Recorded at':'Καταχωρίστηκε','Recorded by':'Καταχωρίστηκε από',
  'Shipment purpose':'Σκοπός αποστολής','Warehouse transfer':'Μεταφορά μεταξύ αποθηκών','Destination warehouse':'Αποθήκη προορισμού',
  'Derived from selected Orders':'Προκύπτει από τις επιλεγμένες παραγγελίες',
  'Final handover':'Τελική παράδοση','Recipient kind':'Είδος παραλήπτη','Recipient':'Παραλήπτης','Received by':'Παρέλαβε','Proof':'Αποδεικτικό','Confirmed':'Επιβεβαιώθηκε','Agent':'Πράκτορας',
  'Notes':'Σημειώσεις','Internal Notes':'Εσωτερικές σημειώσεις','External Notes':'Εξωτερικές σημειώσεις',
  'Edit':'Επεξεργασία','Save':'Αποθήκευση','Cancel':'Άκυρο','Close':'Κλείσιμο','Retry':'Επανάληψη',
  'Last confirmed stage: {stage}':'Τελευταίο επιβεβαιωμένο στάδιο: {stage}','View history':'Προβολή ιστορικού',
  'Dispatch':'Αποστολή','Dispatch shipment':'Αποστολή φορτίου',
  'Next step: plan the packing and confirm readiness in Orders and collis.':'Επόμενο βήμα: σχεδιάστε τη συσκευασία και επιβεβαιώστε την ετοιμότητα στις Παραγγελίες και κόλι.',
  'Open Orders and collis':'Άνοιγμα Παραγγελιών και κόλι',
  'Readiness cannot be confirmed yet:':'Η ετοιμότητα δεν μπορεί να επιβεβαιωθεί ακόμη:',
  'Dispatch is not available yet:':'Η αποστολή δεν είναι ακόμη διαθέσιμη:',
  'Add the transport document number.':'Προσθέστε τον αριθμό εγγράφου μεταφοράς.',
  '{po} is not stock-confirmed at the origin warehouse.':'Η {po} δεν έχει επιβεβαιωμένο απόθεμα στην αποθήκη προέλευσης.',
  'Complete the destination city.':'Συμπληρώστε την πόλη προορισμού.',
  'Purchase orders in this Shipment':'Παραγγελίες αγοράς σε αυτή την αποστολή','{o} Orders · {c} collis':'{o} παραγγελίες · {c} κόλι',
  'Order':'Παραγγελία','Owner reference':'Αναφορά ιδιοκτήτη','Client':'Πελάτης','Supplier':'Προμηθευτής','Collis in this Shipment':'Κόλι σε αυτή την αποστολή',
  'Split from {root}':'Διαχωρίστηκε από {root}','View collis':'Προβολή κόλι','Hide collis':'Απόκρυψη κόλι',
  'Colli':'Κόλι','Description':'Περιγραφή','Package type':'Τύπος συσκευασίας','Dimensions':'Διαστάσεις','No description':'Χωρίς περιγραφή',
  'Declared':'Δηλωμένο','Shipment packages':'Συσκευασίες αποστολής','Plan packing':'Σχεδιασμός συσκευασίας','Edit packing':'Επεξεργασία συσκευασίας',
  'Repacks have not been made yet. Collis currently ship individually.':'Δεν έχουν γίνει ακόμη ανασυσκευασίες. Τα κόλι αποστέλλονται προς το παρόν μεμονωμένα.',
  'Packing confirmed for dispatch.':'Η συσκευασία επιβεβαιώθηκε για αποστολή.','Packing saved, not confirmed.':'Η συσκευασία αποθηκεύτηκε, χωρίς επιβεβαίωση.',
  '{n} collis':'{n} κόλι','Pallet':'Παλέτα','Cardboard box':'Χαρτοκιβώτιο',
  'Load units':'Μονάδες φόρτωσης','Colli assignments':'Αναθέσεις κόλι','Type':'Τύπος','Label':'Ετικέτα','Remove':'Αφαίρεση',
  'Save packing':'Αποθήκευση συσκευασίας','Confirm packing':'Επιβεβαίωση συσκευασίας','Review repacking':'Έλεγχος ανασυσκευασίας','Back to repacking':'Επιστροφή στην ανασυσκευασία',
  'Confirm ready for dispatch':'Επιβεβαίωση ετοιμότητας για αποστολή','Transport pieces':'Τεμάχια μεταφοράς','Validation':'Έλεγχος','Colli allocation':'Κατανομή κόλι',
  'Every participating Order is stock-confirmed at the origin':'Όλες οι παραγγελίες έχουν επιβεβαιωμένο απόθεμα στην αφετηρία',
  'Country and city references are complete and compatible':'Οι χώρες και πόλεις είναι πλήρεις και συμβατές',
  'Enter whole centimetres greater than 0.':'Εισαγάγετε ακέραια εκατοστά μεγαλύτερα του 0.','Enter a weight greater than 0 or leave it empty.':'Εισαγάγετε βάρος μεγαλύτερο του 0 ή αφήστε το κενό.',
  'Assign at least one colli or remove this load unit.':'Αναθέστε τουλάχιστον ένα κόλι ή αφαιρέστε τη μονάδα.',
  'Saving changed packing returns this Shipment to Preparing for dispatch. Readiness must be confirmed again.':'Η αποθήκευση αλλαγμένης συσκευασίας επαναφέρει την αποστολή σε Προετοιμασία για αποστολή. Η ετοιμότητα πρέπει να επιβεβαιωθεί ξανά.',
  'Saving this change returns this Shipment to Preparing for dispatch. Readiness must be confirmed again.':'Η αποθήκευση αυτής της αλλαγής επαναφέρει την αποστολή σε Προετοιμασία για αποστολή. Η ετοιμότητα πρέπει να επιβεβαιωθεί ξανά.',
  'Save and return to Preparing':'Αποθήκευση και επιστροφή σε Προετοιμασία','Back':'Πίσω',
  'Edit participation':'Επεξεργασία συμμετοχής','Select purchase orders and collis':'Επιλογή παραγγελιών αγοράς και κόλι','Search PO, vessel, reference, or tracking code':'Αναζήτηση παραγγελίας, πλοίου, αναφοράς ή κωδικού',
  'In this Shipment':'Σε αυτή την αποστολή','Eligible at the origin':'Διαθέσιμες στην αφετηρία','Partial selections':'Μερικές επιλογές','Reason':'Αιτία','Remark':'Παρατήρηση',
  'Operational separation':'Επιχειρησιακός διαχωρισμός','Uncollectable remainder':'Μη συλλέξιμο υπόλοιπο','Other':'Άλλο','Remark is required for Other':'Η παρατήρηση είναι υποχρεωτική για «Άλλο»',
  'Choose a reason':'Επιλέξτε αιτία','Select at least one colli.':'Επιλέξτε τουλάχιστον ένα κόλι.','Added collis travel individually until packed.':'Τα κόλι που προστίθενται ταξιδεύουν μεμονωμένα μέχρι να συσκευαστούν.',
  'Saving would leave {unit} empty. Unpack it in Plan packing first.':'Η αποθήκευση θα άφηνε κενή τη μονάδα {unit}. Αποσυσκευάστε την πρώτα στον σχεδιασμό συσκευασίας.',
  'Mode changed — choose what happens to the document number':'Ο τρόπος μεταφοράς άλλαξε — επιλέξτε τι γίνεται με τον αριθμό εγγράφου',
  'Keep the number as a valid {type}':'Διατήρηση του αριθμού ως έγκυρο {type}','Replace the number':'Αντικατάσταση του αριθμού','Clear the number':'Διαγραφή του αριθμού',
  'Delivery-note drafts are affected':'Επηρεάζονται πρόχειρα δελτία αποστολής',
  'These draft values came from the previous route. Choose what to do with each before saving.':'Οι τιμές αυτών των προχείρων προέρχονται από την προηγούμενη διαδρομή. Επιλέξτε τι θα γίνει με την καθεμία πριν την αποθήκευση.',
  'Keep entered value':'Διατήρηση καταχωρισμένης τιμής','Update from the new route':'Ενημέρωση από τη νέα διαδρομή','Destination address':'Διεύθυνση προορισμού','Loading address':'Διεύθυνση φόρτωσης',
  'Confirm and save':'Επιβεβαίωση και αποθήκευση',
  'Shipment activity':'Δραστηριότητα αποστολής','Status history':'Ιστορικό κατάστασης','Recorded operations':'Καταγεγραμμένες ενέργειες','Comments':'Σχόλια','Add comment':'Προσθήκη σχολίου',
  'No comments yet.':'Δεν υπάρχουν σχόλια.','No recorded activity.':'Δεν υπάρχει καταγεγραμμένη δραστηριότητα.','Occurred':'Συνέβη','Recorded':'Καταχωρίστηκε',
  'Attachments':'Συνημμένα','Choose documents or photos':'Επιλογή εγγράφων ή φωτογραφιών','No attachments uploaded.':'Δεν έχουν ανέβει συνημμένα.','Download':'Λήψη','Document':'Έγγραφο','Photo':'Φωτογραφία',
  'Cancel shipment':'Ακύρωση αποστολής','Cancel before dispatch':'Ακύρωση πριν την αποστολή','Cancellation reason':'Αιτία ακύρωσης',
  'Record arrival / final handover':'Καταχώριση άφιξης / τελικής παράδοσης','Record arrival':'Καταχώριση άφιξης',
  'This warehouse transfer records arrival without a final handover.':'Αυτή η μεταφορά μεταξύ αποθηκών καταχωρίζει άφιξη χωρίς τελική παράδοση.',
  'Mark location unknown':'Σήμανση άγνωστης τοποθεσίας','Mark unknown':'Σήμανση ως άγνωστη',
  'No further lifecycle actions for this status.':'Δεν υπάρχουν άλλες ενέργειες για αυτή την κατάσταση.',
  'Issue Delivery Notes':'Έκδοση δελτίων αποστολής','Save Draft Delivery Notes':'Αποθήκευση προχείρων δελτίων αποστολής','Preview PDF':'Προεπισκόπηση PDF','Issue':'Έκδοση',
  'Delivery notes are not available for a recorded historical arrival.':'Τα δελτία αποστολής δεν είναι διαθέσιμα για καταχωρισμένη ιστορική άφιξη.',
  'Draft':'Πρόχειρο','Issued':'Εκδόθηκε','Warehouses':'Αποθήκες','Saved addresses':'Αποθηκευμένες διευθύνσεις',
  'Could not load this shipment.':'Δεν ήταν δυνατή η φόρτωση της αποστολής.','Loading…':'Φόρτωση…',
  'Unavailable':'Μη διαθέσιμο','Dangerous goods':'Επικίνδυνα εμπορεύματα','Destination details':'Στοιχεία προορισμού','Purpose':'Σκοπός','Vessel':'Πλοίο',
  'The server rejected the change: the Shipment was updated by someone else. Your draft is unchanged.':'Ο διακομιστής απέρριψε την αλλαγή: η αποστολή ενημερώθηκε από άλλον χρήστη. Το πρόχειρό σας δεν άλλαξε.',
  'Simulated: saved. Nothing left this browser.':'Προσομοίωση: αποθηκεύτηκε. Τίποτα δεν έφυγε από τον περιηγητή.',
  'You have view-only access.':'Έχετε δικαίωμα μόνο προβολής.','Wooden box':'Ξύλινο κιβώτιο','Plastic box':'Πλαστικό κιβώτιο','Barrel':'Βαρέλι','Third-party agent':'Τρίτος πράκτορας','Historical arrival recorded':'Καταχωρίστηκε ιστορική άφιξη','Created':'Δημιουργήθηκε'
};
const tr = (key, vars) => {
  let s = S.lang === 'el' ? (EL[key] ?? ELX[key] ?? key) : key;
  if (vars) for (const k in vars) s = s.replaceAll('{' + k + '}', vars[k]);
  return s;
};
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const T = (k, v) => esc(tr(k, v));

/* ---------------- Fixtures (docs/reference/demo-data.md names + invented demo values) ---------------- */
const COUNTRIES = {GR:'Greece', NL:'Netherlands'};
const CITIES = {ATH:['Athens','GR'], PIR:['Piraeus','GR'], RTM:['Rotterdam','NL']};
const WAREHOUSES = {'ATH-HUB':['Frontline Athens Hub','ATH'], 'PIR-AGENT-HUB':['Piraeus Associated Agent Hub','PIR'], 'RTM-HUB':['Frontline Rotterdam Hub','RTM']};
const PKG = {PALLET:'Pallet', CARDBOARD_BOX:'Cardboard box', WOODEN_BOX:'Wooden box', PLASTIC_BOX:'Plastic box', BARREL:'Barrel'};
const DOC = {ROAD:'CMR', AIR:'Air Waybill (AWB)', SEA:'Bill of Lading (B/L)'};
const PURPOSES = {NETWORK_TRANSFER:'Warehouse transfer', THIRD_PARTY_TRANSFER:'Third-party agent', DELIVERY_TO_VESSEL:'Direct delivery on board', DELIVERY_TO_LAUNCH_STATION:'Via agent or launch station'};
const STATUS = {PREPARING:'Preparing for dispatch', READY_FOR_DISPATCH:'Ready for dispatch', DISPATCHED:'Dispatched', ARRIVED:'Arrived', CANCELLED:'Cancelled', LOCATION_UNKNOWN:'Location unknown'};
const STATUS_TONE = {ARRIVED:'tone-success', CANCELLED:'tone-danger', LOCATION_UNKNOWN:'tone-danger', DISPATCHED:'tone-info'};
const STEPS = ['PREPARING','READY_FOR_DISPATCH','DISPATCHED','ARRIVED'];
const ORDERS = [
  {id:'PO-DEMO-0014', root:'PO-DEMO-0011', owner:'REF-1234', client:'Oceanic Shipping Company', vessel:'MV Oceanic Dawn', supplier:'Demo Supplier Company', stock:true},
  {id:'PO-DEMO-0016', owner:'REF-5521', client:'Demo Client Company', vessel:'MV Aegean Star', supplier:'Demo Supplier Company', stock:true},
  {id:'PO-DEMO-0017', owner:null, client:'Demo Client Company', vessel:'MV Aegean Star', supplier:null, stock:true}
];
const EXTRA_ORDER = {id:'PO-DEMO-0021', owner:'REF-7788', client:'Demo Client Company', vessel:'MV Aegean Star', supplier:'Demo Supplier Company', stock:true};
const c = (id, po, desc, type, dims, dSrc, kg, kSrc) => ({id, po, desc, type, dims, dSrc, kg, kSrc});
const COLLIS = [
  c('HU-DEMO-0013','PO-DEMO-0014','Spare pump seals','WOODEN_BOX',[120,80,100],'C',450,'C'),
  c('HU-DEMO-0018','PO-DEMO-0016','Filter cartridges','CARDBOARD_BOX',[60,40,40],'D',18,'D'),
  c('HU-DEMO-0019','PO-DEMO-0016',null,'CARDBOARD_BOX',null,null,null,null),
  c('HU-DEMO-0020','PO-DEMO-0016','Valve set','PLASTIC_BOX',[50,50,30],'C',22,'D'),
  c('HU-DEMO-0021','PO-DEMO-0017','Deck paint','BARREL',[60,60,90],'D',64,'C'),
  c('HU-DEMO-0022','PO-DEMO-0017','Brushes and rollers','CARDBOARD_BOX',[40,40,30],'D',null,null)
];
const EXTRA_COLLIS = [c('HU-DEMO-0031','PO-DEMO-0021','Hydraulic hoses','CARDBOARD_BOX',[80,40,40],'D',26,'D'), c('HU-DEMO-0032','PO-DEMO-0021','Gasket kit','PLASTIC_BOX',[30,20,15],'C',4.2,'C')];
const SAVED_UNITS = [
  {id:'U1', type:'PALLET', label:'Pallet 1', l:120, w:100, h:150, kg:620},
  {id:'U2', type:'PALLET', label:'Pallet 2', l:120, w:80, h:110, kg:null}
];
const SAVED_ASSIGN = {'HU-DEMO-0013':'U1','HU-DEMO-0019':'U1','HU-DEMO-0022':'U1','HU-DEMO-0018':'U2','HU-DEMO-0021':'U2'};
const ADDRESSES = {Warehouses:['Frontline Athens Hub — 12 Demo Street, Athens'], Companies:['Demo Client Company — 4 Harbour Road, Piraeus'], 'Saved addresses':['Demo loading bay — 7 Demo Avenue, Athens']};

/* ---------------- Scenarios ---------------- */
const base = () => ({
  number:'SH-DEMO-0209', status:'PREPARING', historical:false,
  oc:'GR', ocity:'ATH', dc:'NL', dcity:'RTM', originWh:'ATH-HUB', mode:'ROAD', docNo:'CMR-DEMO-01',
  purpose:'NETWORK_TRANSFER', dest:'RTM-HUB', departure:null, arrival:null, dg:0,
  createdAt:'29/09/2026 12:07', createdBy:'Demo operator',
  units:[], assign:{}, packingState:'none', orders:ORDERS.map(o => ({...o})), collis:COLLIS.map(x => ({...x})),
  notesInt:'Collect the paperwork from the warehouse office.\nCall the driver before loading.', notesExt:'',
  handover:null, lastStage:null, dnDrafts:true, history:'pre'
});
const SCENARIOS = {
  preparing: {},
  blocked: {docNo:'', dcity:null, history:'pre', orders:ORDERS.map(o => o.id === 'PO-DEMO-0017' ? {...o, stock:false} : {...o})},
  ready: {status:'READY_FOR_DISPATCH', units:SAVED_UNITS, assign:SAVED_ASSIGN, packingState:'confirmed', history:'ready'},
  nodoc: {status:'READY_FOR_DISPATCH', docNo:'', units:SAVED_UNITS, assign:SAVED_ASSIGN, packingState:'confirmed', history:'ready'},
  dispatched: {status:'DISPATCHED', units:SAVED_UNITS, assign:SAVED_ASSIGN, packingState:'confirmed', departure:'30/09/2026 08:14', dnDrafts:false, history:'dispatched'},
  arrived: {status:'ARRIVED', purpose:'THIRD_PARTY_TRANSFER', dest:'AGENT', units:SAVED_UNITS, assign:SAVED_ASSIGN, packingState:'confirmed', departure:'30/09/2026 08:14', arrival:'02/10/2026 16:40', dnDrafts:false, history:'arrived',
    handover:{kind:'Agent', recipient:'Demo Agent Company', by:'J. Demo', proof:'POD-DEMO-77', at:'02/10/2026 16:40'}},
  historical: {status:'ARRIVED', historical:true, oc:null, ocity:null, originWh:null, mode:null, docNo:'', departure:null, arrival:'28/09/2026', dg:null, dnDrafts:false,
    createdAt:'20/10/2026 09:31', createdBy:'Demo operator', history:'historical', orders:[ORDERS[1]].map(o => ({...o})), collis:COLLIS.filter(x => x.po === 'PO-DEMO-0016').map(x => ({...x}))},
  'location-unknown': {status:'LOCATION_UNKNOWN', units:SAVED_UNITS, assign:SAVED_ASSIGN, packingState:'confirmed', departure:'30/09/2026 08:14', lastStage:'DISPATCHED', dnDrafts:false, history:'lu'},
  cancelled: {status:'CANCELLED', lastStage:'PREPARING', dnDrafts:false, dg:null, history:'cancelled'},
  legacy: {status:'DISPATCHED', oc:null, ocity:null, dc:null, dcity:null, dg:null, departure:'12/07/2026 10:02', units:SAVED_UNITS, assign:SAVED_ASSIGN, packingState:'confirmed', dnDrafts:false, history:'dispatched'}
};
const HISTORY = {
  pre:[['29/09/2026 12:07','Demo operator','Created — Preparing for dispatch','']],
  ready:[['29/09/2026 15:20','Demo operator','Preparing for dispatch → Ready for dispatch',''],['29/09/2026 12:07','Demo operator','Created — Preparing for dispatch','']],
  dispatched:[['30/09/2026 08:14','Demo operator','Ready for dispatch → Dispatched',''],['29/09/2026 15:20','Demo operator','Preparing for dispatch → Ready for dispatch',''],['29/09/2026 12:07','Demo operator','Created — Preparing for dispatch','']],
  arrived:[['02/10/2026 16:40','Demo operator','Dispatched → Arrived','Handover to Demo Agent Company'],['30/09/2026 08:14','Demo operator','Ready for dispatch → Dispatched',''],['29/09/2026 15:20','Demo operator','Preparing for dispatch → Ready for dispatch',''],['29/09/2026 12:07','Demo operator','Created — Preparing for dispatch','']],
  historical:[['20/10/2026 09:31','Demo operator','Historical arrival recorded — Arrived','Occurred 28/09/2026 (date only)']],
  lu:[['01/10/2026 11:05','Demo operator','Dispatched → Location unknown','Carrier lost contact with the truck after the border crossing. Occurred 01/10/2026 10:30.', 'lu'],['30/09/2026 08:14','Demo operator','Ready for dispatch → Dispatched',''],['29/09/2026 12:07','Demo operator','Created — Preparing for dispatch','']],
  cancelled:[['29/09/2026 14:02','Demo operator','Preparing for dispatch → Cancelled','The client postponed the order; goods return to stock.', 'cancel'],['29/09/2026 12:07','Demo operator','Created — Preparing for dispatch','']]
};
const OPERATIONS = [['29/09/2026 13:10','Demo operator','Transport document assigned — CMR-DEMO-01'],['29/09/2026 12:07','Demo operator','Shipment created']];

/* ---------------- Business notes (from the agreed FRO-316 decisions) ---------------- */
const NOTES = [
  ['Page title', 'Production TopBar shows “Shipment · [number]”, with no separate heading card. The status appears only in the Shipment status sub-card.'],
  ['Shipment status', 'Read-only. Four display-only steps: Preparing for dispatch → Ready for dispatch → Dispatched → Arrived (READY_FOR_DISPATCH comes from FRO-325). Earlier steps are completed, the current step is highlighted, later steps are muted. A historical arrival shows Arrived without implying the earlier steps happened.'],
  ['Exception statuses', 'Location unknown and Cancelled replace the steps with an exception panel: text plus danger colour, no step counter and no forward action. “Last confirmed stage” appears only when the recorded history proves it (FRO-345). View history opens the matching event with its full reason.'],
  ['Next lifecycle step', 'The status card holds only the next lifecycle step. Preparing: a pointer to the packing in Orders and collis. Ready: Dispatch, the single primary action. Each blocked step lists its reasons from the server: Orders not stock-confirmed, incomplete geography (FRO-339) or a missing document number.'],
  ['Shipment details', 'Four geography names (FRO-339; legacy shipments show —), Origin warehouse, Mode, the mode-derived document type and number, Departure/Arrival dates (actual, never entry time) and the Dangerous goods count (FRO-297: “Unavailable” when no dispatch-time count exists). Created at/by, or Recorded at/by for a historical arrival, sit in quieter metadata.'],
  ['Editing before dispatch', 'Edit appears only in Preparing for dispatch and Ready for dispatch, for SHIPMENT_EDIT users (FRO-344). Changing geography, warehouse, mode, purpose/destination, participation or packing while Ready warns first and returns the Shipment to Preparing for dispatch. Document-number-only, Notes and attachment changes keep readiness. A mode change asks to keep, replace or clear the number.'],
  ['Delivery-note drafts', 'If a route change affects values in existing delivery-note drafts, the save asks what to do with each value before saving (FRO-344 owns the rules). Nothing is changed silently.'],
  ['Shipment purpose', 'Purpose uses FRO-320 wording (Warehouse transfer). Destination details shows the destination warehouse, the agent, or the vessel derived from the participating Orders.'],
  ['Notes', 'Internal and External Notes, each with its own Edit, Save and Cancel (FRO-292). Editable in every status; never changes readiness. Up to 2,000 characters, plain text, line breaks kept.'],
  ['Purchase orders', 'One row per Order with collis in this Shipment. Owner reference, Client, Vessel, Supplier and the original Order of a split child come from FRO-325’s participation read. View collis lists each colli with FRO-299 measurements.'],
  ['Measurements', 'FRO-299 rule: latest warehouse-confirmed value, else the declared value followed by “Declared”, else —. Same values in View collis, packing and review.'],
  ['Participation editing', 'Edit participation opens the FRO-341 selection controls, prefilled with the saved collis. Partly selecting an in-stock Order needs a reason (and a remark for Other). Removing collis that would empty a load unit is blocked until it is unpacked. Added collis travel individually.'],
  ['Shipment packages', 'Individual collis and each pallet/box as a Colli / Order list. Pallets and boxes are not counted as collis. One entry point: Plan packing (Edit packing once saved).'],
  ['Packing editor', 'Load units: Type, Label, Length cm, Width cm, Height cm, Gross kg (optional, > 0). Each colli: Ship individually or one load unit. Save packing saves the plan without confirming readiness; Confirm packing only opens the review.'],
  ['Review repacking', 'Optional load units, Individual collis and Transport pieces (load units + individual collis, no double counting). Confirm ready for dispatch saves and confirms readiness in one step (FRO-325); a failure keeps the draft.'],
  ['History & activity', 'Shipment activity (Status history, Recorded operations) and Comments, newest first (FRO-345). Comments: plain text, up to 2,000 characters, no edit or delete, allowed in every status.'],
  ['Documents', 'The existing AttachmentPanel; upload and remove need SHIPMENT_EDIT.'],
  ['Available actions', 'Cancel before dispatch (Preparing/Ready, reason required). After dispatch: Record arrival / final handover and Mark location unknown. No actions in Arrived, Cancelled or Location unknown.'],
  ['Issue Delivery Notes', 'The existing delivery-note workflow, with FRO-307 address choices. A recorded historical arrival cannot have delivery notes, so the section explains that instead (FRO-324).']
];

/* ---------------- State ---------------- */
const params = new URLSearchParams(location.search);
const S = {
  lang: params.get('lang') === 'el' ? 'el' : 'en',
  tab: ['overview','orders','history','documents','actions'].includes(params.get('tab')) ? params.get('tab') : 'overview',
  scenario: SCENARIOS[params.get('scenario')] ? params.get('scenario') : 'preparing',
  ui: ['loading','empty','error'].includes(params.get('state')) ? params.get('state') : 'default',
  readonly: params.get('view') === 'readonly',
  failNext:false, showNc:true, showBn:true, notesOpen:false, activeNote:0, toolsOpen:false, toast:'',
  edit:{}, expanded:new Set(), modal:null, pack:null, member:null, confirm:null, highlight:'', comments:[], commentDraft:'', saving:false
};
S.sh = Object.assign(base(), structuredClone(SCENARIOS[S.scenario]));
S.files = [{name:'cmr-demo-01.pdf', kind:'DOCUMENT', size:'0.4 MB', at:'29/09/2026'}, {name:'loading-photo.jpg', kind:'PHOTO', size:'2.1 MB', at:'29/09/2026'}];

const sh = () => S.sh;
const preDispatch = () => ['PREPARING','READY_FOR_DISPATCH'].includes(sh().status);
const canEdit = () => !S.readonly;
const empty = () => S.ui === 'empty';
const countryName = id => id ? COUNTRIES[id] : null;
const cityName = id => id ? CITIES[id][0] : null;
const whName = id => id ? WAREHOUSES[id][0] : null;
const orderOf = id => sh().orders.find(o => o.id === id) || (id === EXTRA_ORDER.id ? EXTRA_ORDER : null);
const fmtNum = n => n.toLocaleString(S.lang === 'el' ? 'el-GR' : 'en-GB', {maximumFractionDigits:1});
const declared = src => src === 'D' ? `<span class="marker">${T('Declared')}</span>` : '';
const dimsText = x => x.dims ? `<span class="mono">${x.dims.join(' × ')} cm</span>${declared(x.dSrc)}` : '—';
const kgText = x => x.kg != null ? `<span class="mono">${fmtNum(x.kg)} kg</span>${declared(x.kSrc)}` : '—';
const unitTitle = u => u.label || tr(PKG[u.type]);

function readinessBlockers() {
  const r = [];
  sh().orders.filter(o => !o.stock).forEach(o => r.push(tr('{po} is not stock-confirmed at the origin warehouse.', {po:o.id})));
  if (!sh().dcity) r.push(tr('Complete the destination city.'));
  return r;
}
function dispatchBlockers() {
  const r = readinessBlockers();
  if (!sh().docNo) r.push(tr('Add the transport document number.'));
  return r;
}

/* ---------------- Icons ---------------- */
const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  down:svg('<path d="m6 9 6 6 6-6"/>'), up:svg('<path d="m18 15-6-6-6 6"/>'),
  clip:svg('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>'),
  file:svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>'),
  image:svg('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'),
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  bad:'<svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
  info:svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'), warn:svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>'),
  x:svg('<path d="M18 6 6 18M6 6l12 12"/>'), plus:svg('<path d="M5 12h14M12 5v14"/>'),
  truck:svg('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>')
};

/* ---------------- Render helpers ---------------- */
const bn = n => `<button type="button" class="bn" data-note="${n}" aria-label="Business note ${n}">${n}</button>`;
const nc = (ticket, text) => `<p class="nc-label">New component · <a href="https://linear.app/front-line-ltd/issue/${ticket}" target="_blank" rel="noopener">${ticket}</a>${text ? ' — ' + esc(text) : ''}</p>`;
const opt = (value, label, current) => `<option value="${esc(value)}"${value === current ? ' selected' : ''}>${esc(label)}</option>`;
const field = (id, label, control, {error, hint} = {}) =>
  `<div class="field"><label class="label" for="${id}">${esc(label)}</label>${control}${error ? `<p class="error" id="${id}-err">${esc(error)}</p>` : hint ? `<p class="hint">${esc(hint)}</p>` : ''}</div>`;
const sel = (id, options, value, {placeholder, disabled, invalid} = {}) =>
  `<select class="control${invalid ? ' invalid' : ''}" id="${id}" data-bind="${id}"${disabled ? ' disabled' : ''}${invalid ? ` aria-invalid="true" aria-describedby="${id}-err"` : ''}>${placeholder !== undefined ? opt('', placeholder, value) : ''}${options.map(o => opt(o[0], o[1], value)).join('')}</select>`;
const fact = (label, value) => `<div><dt>${esc(label)}</dt><dd>${value}</dd></div>`;
const val = v => v == null || v === '' ? '—' : esc(v);
const statusPill = st => `<span class="pill ${STATUS_TONE[st] || 'tone-neutral'}">${T(STATUS[st])}</span>`;
const editBtn = (key, label = 'Edit') => preDispatch() && canEdit() && !S.edit[key] ? `<button type="button" class="btn btn-secondary btn-sm" data-edit="${key}" id="edit-${key}">${T(label)}</button>` : '';
const alertBox = (tone, icon, html, role) => `<div class="alert tone-${tone}"${role ? ` role="${role}"` : ''}>${icon}<div>${html}</div></div>`;

function renderHeader() {
  const nav = [['Dashboard',''],['Purchase orders',''],['Shipments','current'],['Warehouses',''],['Users',''],['Companies','']];
  return `<header class="shell-header"><div class="shell-inner"><div class="row-flex"><span class="brand">Frontline console</span>
    <nav class="nav" aria-label="Main">${nav.map(([l, cur]) => `<a href="#" ${cur ? 'aria-current="page"' : ''}>${cur ? I.truck : ''}${T(l)}</a>`).join('')}</nav></div>
    <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="${S.lang === 'en'}">EN</button><button type="button" data-lang="el" aria-pressed="${S.lang === 'el'}">EL</button></div></div></header>`;
}

/* ---------- Overview ---------- */
function renderStatus() {
  const s = sh(), st = s.status;
  const exception = st === 'CANCELLED' || st === 'LOCATION_UNKNOWN';
  const cur = STEPS.indexOf(st);
  let body;
  if (exception) {
    const ev = st === 'CANCELLED' ? 'cancel' : 'lu';
    body = `<div class="nc" style="padding:.25rem">${nc('FRO-345', 'exception panel')}
      <div class="exception">${alertBox('danger', I.warn, `<strong>${T(STATUS[st])}</strong>${s.lastStage ? `<p class="text-body-sm" style="margin:.25rem 0 0">${T('Last confirmed stage: {stage}', {stage: tr(STATUS[s.lastStage])})}</p>` : ''}
        <button type="button" class="btn btn-secondary btn-sm" style="margin-top:.5rem" data-act="view-history" data-event="${ev}">${T('View history')}</button>`)}</div></div>`;
  } else {
    body = `<ol class="stepper" aria-label="${T('Shipment status')}">${STEPS.map((k, i) => {
      const done = i < cur && !s.historical, now = i === cur;
      return `<li class="step${now ? ' current' : done ? ' done' : ''}${s.historical && i < cur ? ' unrecorded' : ''}"${now ? ' aria-current="step"' : ''}><span class="num">${i + 1}</span><span>${T(STATUS[k])}</span></li>`;
    }).join('')}</ol>`;
  }
  let next = '';
  if (st === 'PREPARING' && canEdit()) {
    const rb = readinessBlockers();
    next = `<p class="text-body-sm muted" style="margin:.75rem 0 0">${T('Next step: plan the packing and confirm readiness in Orders and collis.')} <button type="button" class="btn btn-ghost btn-sm" data-act="goto-orders">${T('Open Orders and collis')}</button></p>
      ${rb.length ? `<div class="nc" style="margin-top:.5rem;padding:.25rem">${nc('FRO-325', 'blocking reasons')}${alertBox('warning', I.info, `${T('Readiness cannot be confirmed yet:')}<ul class="reasons">${rb.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`)}</div>` : ''}`;
  } else if (st === 'READY_FOR_DISPATCH' && canEdit()) {
    const db = dispatchBlockers();
    next = `${db.length ? `<div class="nc" style="margin-top:.75rem;padding:.25rem">${nc('FRO-325', 'blocking reasons')}${alertBox('warning', I.info, `<span id="dispatch-why">${T('Dispatch is not available yet:')}</span><ul class="reasons">${db.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`)}</div>` : ''}
      <div class="status-actions"><button type="button" class="btn btn-primary btn-md" id="dispatch-btn" data-act="dispatch"${db.length ? ' disabled aria-describedby="dispatch-why"' : ''}>${T('Dispatch')}</button></div>`;
  }
  return `<div class="subcard nc">${nc('FRO-325', 'status sub-card with four steps')}
    <div class="status-head"><div><p class="label" style="margin:0 0 .25rem">${T('Shipment status')} ${bn(2)} ${bn(3)}</p><span class="status-value">${statusPill(st)}</span></div></div>
    ${body}${next} ${st === 'PREPARING' || st === 'READY_FOR_DISPATCH' ? bn(4) : ''}</div>`;
}

function renderDetails() {
  const s = sh(), d = S.edit.details;
  const unk = '—';
  const docType = s.mode ? tr(DOC[s.mode]) : '—';
  let grid;
  if (d) {
    const cities = cc => Object.entries(CITIES).filter(([, v]) => v[1] === cc).map(([k, v]) => [k, v[0]]);
    const whs = city => Object.entries(WAREHOUSES).filter(([, v]) => v[1] === city).map(([k, v]) => [k, v[0]]);
    const modeChanged = d.mode !== s.mode && s.docNo;
    grid = `<div class="nc" style="padding:.25rem">${nc('FRO-344', 'per-card editing')}<div class="grid4">
      ${field('d-oc', tr('Origin country'), sel('d-oc', Object.entries(COUNTRIES), d.oc, {placeholder: tr('Select country')}))}
      ${field('d-ocity', tr('Origin city'), sel('d-ocity', cities(d.oc), d.ocity, {placeholder: d.oc ? tr('Select city') : tr('Select the origin country'), disabled: !d.oc}))}
      ${field('d-dc', tr('Destination country'), sel('d-dc', Object.entries(COUNTRIES), d.dc, {placeholder: tr('Select country')}))}
      ${field('d-dcity', tr('Destination city'), sel('d-dcity', cities(d.dc), d.dcity, {placeholder: d.dc ? tr('Select city') : tr('Select the destination country'), disabled: !d.dc}))}
      ${field('d-originWh', tr('Origin warehouse'), sel('d-originWh', whs(d.ocity), d.originWh, {placeholder: d.ocity ? tr('Select origin') : tr('Select the origin city first'), disabled: !d.ocity, invalid: d.err === 'wh'}), {error: d.err === 'wh' ? tr('The origin warehouse must be in the selected origin city') : ''})}
      ${field('d-mode', tr('Mode'), sel('d-mode', [['ROAD', tr('Road')], ['AIR', tr('Air')], ['SEA', tr('Sea')]], d.mode))}
      ${field('d-docType', tr('Document type'), `<input class="control" id="d-docType" readonly value="${esc(tr(DOC[d.mode]))}">`)}
      ${d.dcity !== s.dcity && s.purpose === 'NETWORK_TRANSFER' ? field('d-dest', tr('Destination warehouse'), sel('d-dest', whs(d.dcity).filter(([k]) => k !== d.originWh), d.dest, {placeholder: d.dcity ? (whs(d.dcity).length ? tr('Choose a warehouse') : tr('No matching warehouse in the selected destination city')) : tr('Select the destination city first'), disabled: !d.dcity, invalid: d.err === 'dest'}), {error: d.err === 'dest' ? tr('The destination warehouse must be in the selected destination city') : ''}) : ''}
      ${modeChanged ? '' : field('d-docNo', tr('Document number'), `<input class="control mono${d.err === 'doc' ? ' invalid' : ''}" id="d-docNo" data-bind="d-docNo" maxlength="255" value="${esc(d.docNo)}"${d.err === 'doc' ? ' aria-invalid="true" aria-describedby="d-docNo-err"' : ''}>`, {error: d.err === 'doc' ? tr('Add the transport document number.') : ''})}
    </div>
    ${modeChanged ? `<fieldset class="sub" style="margin-top:.75rem"><legend class="label">${T('Mode changed — choose what happens to the document number')}</legend>
      ${[['keep', tr('Keep the number as a valid {type}', {type: tr(DOC[d.mode])})], ['replace', tr('Replace the number')], ['clear', tr('Clear the number')]].map(([k, l]) => `<label class="row-flex text-body-sm" style="margin-top:.375rem"><input type="radio" name="docres" data-docres="${k}"${d.docRes === k ? ' checked' : ''}> ${esc(l)}</label>`).join('')}
      ${d.docRes === 'replace' ? `<div style="margin-top:.5rem;max-width:20rem">${field('d-docNo', tr('Document number'), `<input class="control mono" id="d-docNo" data-bind="d-docNo" maxlength="255" value="${esc(d.docNo)}">`)}</div>` : ''}
      ${d.err === 'docres' ? `<p class="error">${T('Mode changed — choose what happens to the document number')}</p>` : ''}</fieldset>` : ''}
    ${saveError('details')}
    <div class="edit-foot"><button type="button" class="btn btn-secondary btn-md" data-cancel="details">${T('Cancel')}</button><button type="button" class="btn btn-primary btn-md" data-save="details"${S.saving ? ' disabled' : ''}>${T('Save')}</button></div></div>`;
  } else {
    grid = `<dl class="facts4">
      ${fact(tr('Origin country'), val(countryName(s.oc)))}${fact(tr('Origin city'), val(cityName(s.ocity)))}${fact(tr('Destination country'), val(countryName(s.dc)))}${fact(tr('Destination city'), val(cityName(s.dcity)))}
      ${fact(tr('Origin warehouse'), val(whName(s.originWh)))}${fact(tr('Mode'), s.mode ? T({ROAD:'Road', AIR:'Air', SEA:'Sea'}[s.mode]) : unk)}
      ${fact(tr('Document type'), esc(docType))}${fact(s.mode ? tr('Document number') : tr('Transport reference'), s.docNo ? `<span class="mono">${esc(s.docNo)}</span>` : T('Not recorded'))}
      ${fact(tr('Departure date'), s.departure ? `<span class="mono">${esc(s.departure)}</span>` : unk)}${fact(tr('Arrival date'), s.arrival ? `<span class="mono">${esc(s.arrival)}</span>` : unk)}
      ${fact(tr('Dangerous goods'), s.dg == null ? T('Unavailable') : `<span class="mono">${s.dg}</span>`)}
    </dl>`;
  }
  const meta = s.historical ? `<span>${T('Recorded at')}: <span class="mono">${esc(s.createdAt)}</span></span><span>${T('Recorded by')}: ${esc(s.createdBy)}</span>`
    : `<span>${T('Created at')}: <span class="mono">${esc(s.createdAt)}</span></span><span>${T('Created by')}: ${esc(s.createdBy)}</span>`;
  return `<section class="card" aria-labelledby="h-details"><div class="card-header"><h2 class="card-title text-subheading" id="h-details">${T('Shipment details')} ${bn(5)}</h2><div class="card-head-actions">${editBtn('details')} ${preDispatch() && canEdit() ? bn(6) : ''}</div></div>
    <div class="card-body stack">${renderStatus()}${grid}<div class="meta">${meta}</div></div></section>`;
}

function destinationText(s) {
  if (s.purpose === 'DELIVERY_TO_VESSEL') return [...new Set(s.orders.map(o => o.vessel))].join(', ') || tr('Derived from selected Orders');
  if (s.purpose === 'NETWORK_TRANSFER') return whName(s.dest);
  return 'Demo Agent Company';
}
function renderPurpose() {
  const s = sh(), d = S.edit.purpose;
  const body = d ? `<div class="nc" style="padding:.25rem">${nc('FRO-344', 'per-card editing')}<div class="grid2">
      ${field('p-purpose', tr('Purpose'), sel('p-purpose', Object.entries(PURPOSES).map(([k, v]) => [k, tr(v)]), d.purpose))}
      ${field('p-dest', d.purpose === 'NETWORK_TRANSFER' ? tr('Destination warehouse') : tr('Destination details'),
        d.purpose === 'NETWORK_TRANSFER' ? sel('p-dest', Object.entries(WAREHOUSES).filter(([k, v]) => v[1] === s.dcity && k !== s.originWh).map(([k, v]) => [k, v[0]]), d.dest, {placeholder: s.dcity ? tr('Choose a warehouse') : tr('Select the destination city first'), disabled: !s.dcity})
        : d.purpose === 'DELIVERY_TO_VESSEL' ? `<input class="control" id="p-dest" readonly value="${esc(destinationText({...s, purpose:d.purpose}))}">`
        : sel('p-dest', [['AGENT', 'Demo Agent Company']], d.dest, {placeholder: tr('Choose a third-party agent')}))}
    </div>${saveError('purpose')}<div class="edit-foot"><button type="button" class="btn btn-secondary btn-md" data-cancel="purpose">${T('Cancel')}</button><button type="button" class="btn btn-primary btn-md" data-save="purpose">${T('Save')}</button></div></div>`
    : `<dl class="facts" style="grid-template-columns:repeat(2,minmax(0,1fr))">${fact(tr('Purpose'), T(PURPOSES[s.purpose]))}${fact(s.purpose === 'NETWORK_TRANSFER' ? tr('Destination warehouse') : s.purpose === 'DELIVERY_TO_VESSEL' ? tr('Vessel') : tr('Destination details'), val(destinationText(s)))}</dl>`;
  return `<section class="card" aria-labelledby="h-purpose"><div class="card-header"><h2 class="card-title text-subheading" id="h-purpose">${T('Shipment purpose')} ${bn(8)}</h2>${editBtn('purpose')}</div><div class="card-body">${body}</div></section>`;
}

function renderHandover() {
  const h = sh().handover; if (!h) return '';
  return `<section class="card" aria-labelledby="h-handover"><div class="card-header"><h2 class="card-title text-subheading" id="h-handover">${T('Final handover')}</h2></div>
    <div class="card-body"><dl class="facts4">${fact(tr('Recipient kind'), T(h.kind))}${fact(tr('Recipient'), esc(h.recipient))}${fact(tr('Received by'), esc(h.by))}${fact(tr('Proof'), `<span class="mono">${esc(h.proof)}</span>`)}${fact(tr('Confirmed'), `<span class="mono">${esc(h.at)}</span>`)}</dl></div></section>`;
}

function noteSub(key, label) {
  const s = sh(), d = S.edit[key];
  const value = empty() ? '' : s[key];
  const canNote = canEdit();
  return `<div class="sub"><div class="sub-head"><h3 class="text-body" style="margin:0;font-weight:600">${T(label)}</h3>${canNote && d == null ? `<button type="button" class="btn btn-secondary btn-sm" data-edit="${key}" id="edit-${key}">${T('Edit')}</button>` : ''}</div>
    ${d != null ? `<label class="sr-only" for="ta-${key}">${T(label)}</label><textarea class="control" id="ta-${key}" data-bind="ta-${key}" maxlength="2000">${esc(d)}</textarea><p class="counter">${d.length} / 2000</p>${saveError(key)}
      <div class="edit-foot"><button type="button" class="btn btn-secondary btn-sm" data-cancel="${key}">${T('Cancel')}</button><button type="button" class="btn btn-primary btn-sm" data-save="${key}">${T('Save')}</button></div>`
      : `<p class="notes-text">${value ? esc(value) : '—'}</p>`}</div>`;
}
function renderNotes() {
  return `<section class="card nc" aria-labelledby="h-notes">${nc('FRO-292', 'Internal / External Notes')}<div class="card-header"><h2 class="card-title text-subheading" id="h-notes">${T('Notes')} ${bn(9)}</h2></div>
    <div class="card-body stack">${noteSub('notesInt', 'Internal Notes')}${noteSub('notesExt', 'External Notes')}</div></section>`;
}

/* ---------- Orders and collis ---------- */
function renderOrders() {
  const s = sh();
  const rows = s.orders.map(o => {
    const cs = s.collis.filter(x => x.po === o.id), open = S.expanded.has(o.id);
    return `<tr><td><a class="link mono" href="#">${esc(o.id)}</a>${o.root ? `<div class="text-caption muted">${T('Split from {root}', {root: o.root})}</div>` : ''}</td>
      <td>${val(o.owner)}</td><td>${val(o.client)}</td><td>${val(o.vessel)}</td><td>${val(o.supplier)}</td>
      <td class="cell-end"><span class="mono">${cs.length}</span> <button type="button" class="btn btn-ghost btn-sm" data-expand="${o.id}" aria-expanded="${open}" aria-controls="collis-${o.id}">${T(open ? 'Hide collis' : 'View collis')}${open ? I.up : I.down}</button></td></tr>
      ${open ? `<tr id="collis-${o.id}"><td colspan="6" style="background:var(--canvas)"><div class="table-wrap"><table><thead><tr><th>${T('Colli')}</th><th>${T('Description')}</th><th>${T('Package type')}</th><th>${T('Dimensions')}</th><th class="cell-end">${T('Gross weight')}</th></tr></thead><tbody>
        ${cs.map(x => `<tr><td><a class="link mono" href="#">${esc(x.id)}</a></td><td>${x.desc ? esc(x.desc) : `<span class="subtle">${T('No description')}</span>`}</td><td>${T(PKG[x.type])}</td><td>${dimsText(x)}</td><td class="cell-end">${kgText(x)}</td></tr>`).join('')}</tbody></table></div></td></tr>` : ''}`;
  }).join('');
  return `<section class="card nc" aria-labelledby="h-orders">${nc('FRO-325', 'Order metadata from the participation read; FRO-299 measurements')}
    <div class="card-header"><div><h2 class="card-title text-subheading" id="h-orders">${T('Purchase orders in this Shipment')} ${bn(10)} ${bn(11)}</h2><p class="text-caption muted" style="margin:.125rem 0 0">${T('{o} Orders · {c} collis', {o: s.orders.length, c: s.collis.length})}</p></div>
      ${preDispatch() && canEdit() ? `<div class="card-head-actions"><button type="button" class="btn btn-secondary btn-sm" data-act="open-member" id="member-btn">${T('Edit participation')}</button>${bn(12)}</div>` : ''}</div>
    <div class="card-body"><div class="table-wrap"><table><thead><tr><th>${T('Order')}</th><th>${T('Owner reference')}</th><th>${T('Client')}</th><th>${T('Vessel')}</th><th>${T('Supplier')}</th><th class="cell-end">${T('Collis in this Shipment')}</th></tr></thead><tbody>${rows}</tbody></table></div></div></section>`;
}

function pkgList(cs) {
  return `<ul class="pkg-list"><li class="hdr"><span>${T('Colli')}</span><span>${T('Order')}</span></li>${cs.map(x => `<li><a class="link mono" href="#">${esc(x.id)}</a><a class="link-quiet mono" href="#">${esc(x.po)}</a></li>`).join('')}</ul>`;
}
function renderPackages() {
  const s = sh();
  const loose = s.collis.filter(x => !s.assign[x.id]);
  const status = s.packingState === 'confirmed' ? tr('Packing confirmed for dispatch.') : s.packingState === 'saved' ? tr('Packing saved, not confirmed.') : '';
  const btn = preDispatch() && canEdit() ? `<button type="button" class="btn btn-secondary btn-sm" data-act="open-pack" id="pack-btn">${T(s.units.length || s.packingState !== 'none' ? 'Edit packing' : 'Plan packing')}</button>` : '';
  return `<section class="card" aria-labelledby="h-pkg"><div class="card-header"><div><h2 class="card-title text-subheading" id="h-pkg">${T('Shipment packages')} ${bn(13)}</h2>${status ? `<p class="text-caption muted" style="margin:.125rem 0 0">${esc(status)}</p>` : ''}</div><div class="card-head-actions">${btn}</div></div>
    <div class="card-body stack">
      ${!s.units.length && preDispatch() ? `<p class="text-body-sm muted" style="margin:0">${T('Repacks have not been made yet. Collis currently ship individually.')}</p>` : ''}
      <div class="pkg-grid">
        ${loose.length ? `<div class="pkg"><div class="pkg-head"><strong class="text-body-sm">${T('Individual collis')}</strong><span class="text-caption muted">${T('{n} collis', {n: loose.length})}</span></div>${pkgList(loose)}</div>` : ''}
        ${s.units.map(u => { const cs = s.collis.filter(x => s.assign[x.id] === u.id); return `<div class="pkg"><div class="pkg-head"><strong class="text-body-sm">${esc(unitTitle(u))}</strong><span class="text-caption muted"><span class="mono">${u.l} × ${u.w} × ${u.h} cm</span> · ${T('{n} collis', {n: cs.length})}</span></div>${pkgList(cs)}</div>`; }).join('')}
      </div></div></section>`;
}

/* ---------- History & activity ---------- */
function renderHistory() {
  const rows = empty() ? [] : HISTORY[sh().history] || [];
  const ops = empty() ? [] : OPERATIONS;
  const st = t => ['Ready for dispatch','Preparing for dispatch','Dispatched','Arrived','Cancelled','Location unknown','Historical arrival recorded','Created'].reduce((a, k) => a.replaceAll(k, tr(k)), t);
  const row = (r, hl) => `<div class="history-row${hl ? ' hl' : ''}" id="${r[4] ? 'ev-' + r[4] : ''}"><span class="mono muted">${esc(r[0])}</span><div><strong>${esc(st(r[2]))}</strong> <span class="muted">· ${esc(r[1])}</span>${r[3] ? `<p class="text-body-sm" style="margin:.125rem 0 0">${esc(r[3])}</p>` : ''}</div></div>`;
  const comments = S.comments;
  return `<div class="sections"><section class="card nc" aria-labelledby="h-activity">${nc('FRO-345', 'Shipment activity')}<div class="card-header"><h2 class="card-title text-subheading" id="h-activity">${T('Shipment activity')} ${bn(16)}</h2></div>
    <div class="card-body stack"><h3 class="text-body" style="margin:0;font-weight:600">${T('Status history')}</h3>${rows.length ? rows.map(r => row(r, r[4] && r[4] === S.highlight)).join('') : `<p class="empty-box">${T('No recorded activity.')}</p>`}
      <h3 class="text-body" style="margin:.5rem 0 0;font-weight:600">${T('Recorded operations')}</h3>${ops.length ? ops.map(o => row(o)).join('') : `<p class="empty-box">${T('No recorded activity.')}</p>`}</div></section>
    <section class="card nc" aria-labelledby="h-comments">${nc('FRO-345', 'Comments')}<div class="card-header"><h2 class="card-title text-subheading" id="h-comments">${T('Comments')}</h2></div>
      <div class="card-body stack">${comments.length ? comments.map(cm => row(cm)).join('') : `<p class="empty-box">${T('No comments yet.')}</p>`}
      ${canEdit() ? `<div><label class="label" for="comment">${T('Add comment')}</label><textarea class="control" id="comment" data-bind="comment" maxlength="2000">${esc(S.commentDraft)}</textarea><p class="counter">${S.commentDraft.length} / 2000</p>
        <div class="edit-foot" style="margin-top:.25rem"><button type="button" class="btn btn-secondary btn-sm" data-act="add-comment"${S.commentDraft.trim() ? '' : ' disabled'}>${T('Add comment')}</button></div></div>` : ''}</div></section></div>`;
}

/* ---------- Documents ---------- */
function renderDocuments() {
  const files = empty() ? [] : S.files;
  return `<section class="card card-pad" aria-labelledby="h-att"><div class="row-flex" style="justify-content:space-between;flex-wrap:wrap">
      <h2 class="row-flex text-subheading" id="h-att" style="margin:0"><span style="color:var(--accent);display:inline-flex;width:1rem">${I.clip}</span>${T('Attachments')} ${bn(17)}</h2>
      ${canEdit() ? `<label class="btn btn-secondary btn-md" for="file-input" tabindex="0" id="file-label">${I.plus}${T('Choose documents or photos')}</label><input id="file-input" class="sr-only" type="file" multiple>` : ''}</div>
    <div class="stack" style="margin-top:1rem">${files.length ? files.map((f, i) => `<div class="file-row"><div class="row-flex" style="min-width:0"><span class="file-icon">${f.kind === 'PHOTO' ? I.image : I.file}</span>
        <div style="min-width:0"><p style="margin:0;font-weight:600">${esc(f.name)}</p><p class="text-caption muted" style="margin:0">${T(f.kind === 'PHOTO' ? 'Photo' : 'Document')} · ${esc(f.size)} · Demo operator · ${esc(f.at)}</p></div></div>
        <div class="row-flex"><button type="button" class="btn btn-ghost btn-sm" data-act="noop">${T('Download')}</button>${canEdit() ? `<button type="button" class="btn btn-ghost btn-sm" data-remove-file="${i}">${T('Remove')}</button>` : ''}</div></div>`).join('')
      : `<p class="empty-box">${T('No attachments uploaded.')}</p>`}</div></section>`;
}

/* ---------- Available actions ---------- */
function renderActions() {
  const s = sh(), st = s.status;
  const cards = [];
  if (canEdit() && preDispatch()) cards.push(`<div class="action-card"><h3 class="text-subheading" style="margin:0 0 .5rem">${T('Cancel before dispatch')}</h3>
    ${field('cancel-reason', tr('Cancellation reason'), `<textarea class="control" id="cancel-reason" data-bind="cancelReason" maxlength="2000">${esc(S.cancelReason || '')}</textarea>`)}
    <div class="edit-foot"><button type="button" class="btn btn-danger btn-md" data-act="cancel-shipment"${(S.cancelReason || '').trim() ? '' : ' disabled'}>${T('Cancel shipment')}</button></div></div>`);
  if (canEdit() && st === 'DISPATCHED') {
    cards.push(`<div class="action-card"><h3 class="text-subheading" style="margin:0 0 .5rem">${T('Record arrival / final handover')}</h3>
      <p class="text-body-sm muted" style="margin:0">${T('This warehouse transfer records arrival without a final handover.')}</p>
      <div class="edit-foot"><button type="button" class="btn btn-secondary btn-md" data-act="arrive">${T('Record arrival')}</button></div></div>`);
    cards.push(`<div class="action-card"><h3 class="text-subheading" style="margin:0 0 .5rem">${T('Mark location unknown')}</h3>
      ${field('lu-reason', tr('Reason'), `<textarea class="control" id="lu-reason" data-bind="luReason" maxlength="2000">${esc(S.luReason || '')}</textarea>`)}
      <div class="edit-foot"><button type="button" class="btn btn-danger btn-md" data-act="mark-unknown"${(S.luReason || '').trim() ? '' : ' disabled'}>${T('Mark unknown')}</button></div></div>`);
  }
  if (!cards.length) cards.push(`<p class="empty-box">${S.readonly ? T('You have view-only access.') : T('No further lifecycle actions for this status.')}</p>`);
  return `<div class="sections"><section class="card" aria-labelledby="h-actions"><div class="card-header"><h2 class="card-title text-subheading" id="h-actions">${T('Available actions')} ${bn(18)}</h2></div><div class="card-body stack">${cards.join('')}</div></section>${renderDeliveryNotes()}</div>`;
}
function renderDeliveryNotes() {
  const s = sh();
  let body;
  if (s.historical) body = alertBox('info', I.info, T('Delivery notes are not available for a recorded historical arrival.'));
  else if (empty() || (!s.dnDrafts && s.status !== 'DISPATCHED' && s.status !== 'ARRIVED')) body = `<p class="empty-box">—</p>`;
  else if (s.dnDrafts) {
    const grouped = cur => Object.entries(ADDRESSES).map(([g, list]) => `<optgroup label="${T(g)}">${list.map(a => opt(a, a, cur)).join('')}</optgroup>`).join('');
    body = `<div class="dn-card"><div class="row-flex" style="justify-content:space-between"><strong class="mono">DN-DEMO-DRAFT-1</strong><span class="badge">${T('Draft')}</span></div>
      <div class="grid2" style="margin-top:.75rem">${field('dn-load', tr('Loading address'), `<select class="control" id="dn-load">${grouped(ADDRESSES.Warehouses[0])}</select>`)}${field('dn-dest', tr('Destination address'), `<select class="control" id="dn-dest">${opt('', '—', '')}${grouped('')}</select>`)}</div>
      ${canEdit() ? `<div class="edit-foot"><button type="button" class="btn btn-secondary btn-sm" data-act="noop">${T('Save Draft Delivery Notes')}</button><button type="button" class="btn btn-secondary btn-sm" data-act="noop">${T('Preview PDF')}</button><button type="button" class="btn btn-secondary btn-sm" data-act="noop">${T('Issue')}</button></div>` : ''}</div>`;
  } else body = `<div class="dn-card row-flex" style="justify-content:space-between"><strong class="mono">DN-DEMO-0042</strong><span class="badge tone-success">${T('Issued')}</span></div>`;
  return `<section class="card" aria-labelledby="h-dn"><div class="card-header"><h2 class="card-title text-subheading" id="h-dn">${T('Issue Delivery Notes')} ${bn(19)}</h2></div><div class="card-body">${body}</div></section>`;
}

/* ---------- Modals ---------- */
function saveError(key) { return S.errorFor === key ? `<div class="alert tone-danger" role="alert" style="margin-top:.75rem">${I.bad}<div>${T('The server rejected the change: the Shipment was updated by someone else. Your draft is unchanged.')}</div></div>` : ''; }

function packValidation(p) {
  const errs = {};
  p.units.forEach(u => {
    ['l','w','h'].forEach(k => { const n = Number(u[k]); if (!/^\d+$/.test(String(u[k])) || n <= 0) errs[u.id + k] = tr('Enter whole centimetres greater than 0.'); });
    if (u.kg !== '' && u.kg != null && !(Number(u.kg) > 0)) errs[u.id + 'kg'] = tr('Enter a weight greater than 0 or leave it empty.');
    if (!Object.values(p.assign).includes(u.id)) errs[u.id] = tr('Assign at least one colli or remove this load unit.');
  });
  return errs;
}
function renderPack() {
  const p = S.pack, s = sh();
  const errs = p.showErrors ? packValidation(p) : {};
  const num = (u, k, label) => field(`u-${u.id}-${k}`, label, `<input class="control mono${errs[u.id + k] ? ' invalid' : ''}" id="u-${u.id}-${k}" data-unit="${u.id}" data-key="${k}" inputmode="numeric" value="${esc(u[k] ?? '')}">`, {error: errs[u.id + k]});
  let body, foot;
  if (p.stage === 'edit') {
    body = `${nc('FRO-325', 'packing editor (production composer card, extracted)')}
      <section><div class="row-flex" style="justify-content:space-between"><h3 class="text-heading" style="margin:0">${T('Load units')}</h3><button type="button" class="btn btn-secondary btn-sm" data-act="add-unit">${I.plus}${T('Add load unit')}</button></div>
      <div class="stack" style="margin-top:.75rem">${p.units.length ? p.units.map(u => `<div class="unit-card${errs[u.id] ? ' tone-danger-border' : ''}"><div class="unit-grid">
        ${field(`u-${u.id}-type`, tr('Type'), `<select class="control" id="u-${u.id}-type" data-unit="${u.id}" data-key="type">${opt('PALLET', tr('Pallet'), u.type)}${opt('CARDBOARD_BOX', tr('Cardboard box'), u.type)}</select>`)}
        ${field(`u-${u.id}-label`, tr('Label'), `<input class="control" id="u-${u.id}-label" data-unit="${u.id}" data-key="label" value="${esc(u.label)}">`)}
        ${num(u, 'l', tr('Length cm'))}${num(u, 'w', tr('Width cm'))}${num(u, 'h', tr('Height cm'))}${num(u, 'kg', tr('Gross kg'))}
        <button type="button" class="btn btn-ghost btn-sm" data-remove-unit="${u.id}">${T('Remove')}</button></div>${errs[u.id] ? `<p class="error" style="margin:.5rem 0 0">${esc(errs[u.id])}</p>` : ''}</div>`).join('')
        : `<p class="text-body-sm muted" style="margin:0">${T('Repacks have not been made yet. Collis currently ship individually.')}</p>`}</div></section>
      <section><h3 class="text-heading" style="margin:0">${T('Colli assignments')}</h3><div class="assign-scroll"><div class="assign-inner">
        ${s.orders.map(o => `<div class="order-group"><h4 class="mono">${esc(o.id)}${o.root ? ` <span class="muted" style="font-weight:400">· ${T('Split from {root}', {root:o.root})}</span>` : ''}</h4>
          ${s.collis.filter(x => x.po === o.id).map(x => `<div class="assign-row"><div><span class="mono" style="font-weight:600">${esc(x.id)}</span><div class="text-caption muted">${x.desc ? esc(x.desc) : T('No description')}</div></div>
            <span>${T(PKG[x.type])}</span><span>${dimsText(x)}</span><span>${kgText(x)}</span>
            <div><label class="sr-only" for="as-${x.id}">${T('Shipping form')} ${esc(x.id)}</label><select class="control" id="as-${x.id}" data-assign="${x.id}">${opt('', tr('Ship individually (no overpack)'), p.assign[x.id] || '')}${p.units.map(u => opt(u.id, unitTitle(u), p.assign[x.id] || '')).join('')}</select></div></div>`).join('')}</div>`).join('')}
      </div></div></section>`;
    foot = `<button type="button" class="btn btn-secondary btn-md" data-act="close-pack">${T('Cancel')}</button><button type="button" class="btn btn-secondary btn-md" data-act="save-pack">${T('Save packing')}</button><button type="button" class="btn btn-primary btn-md" data-act="review-pack">${T('Confirm packing')}</button>`;
  } else {
    const loose = s.collis.filter(x => !p.assign[x.id]);
    const blockers = readinessBlockers();
    const check = (ok, l) => `<li>${ok ? I.ok : I.bad}<span>${esc(l)}</span></li>`;
    body = `${nc('FRO-300', 'Review repacking with Individual collis block')}
      <div class="metrics" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div class="metric"><div class="text-caption muted">${T('Optional load units')}</div><div class="v">${p.units.length}</div></div>
        <div class="metric"><div class="text-caption muted">${T('Individual collis')}</div><div class="v">${loose.length}</div></div><div class="metric"><div class="text-caption muted">${T('Transport pieces')}</div><div class="v">${p.units.length + loose.length}</div></div></div>
      <section><h3 class="text-heading" style="margin:0 0 .5rem">${T('Validation')}</h3><ul class="checks">${check(true, tr('Every optional load unit contains at least one colli'))}${check(!sh().orders.some(o => !o.stock), tr('Every participating Order is stock-confirmed at the origin'))}${check(!!sh().dcity, tr('Country and city references are complete and compatible'))}</ul>
        ${blockers.length ? `<div style="margin-top:.5rem">${alertBox('warning', I.info, `${T('Readiness cannot be confirmed yet:')}<ul class="reasons">${blockers.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`)}</div>` : ''}</section>
      <section><h3 class="text-heading" style="margin:0 0 .5rem">${T('Colli allocation')}</h3><div class="table-wrap"><table><thead><tr><th>${T('Colli')}</th><th>${T('Description')}</th><th>${T('Order')}</th><th>${T('Dimensions')}</th><th class="cell-end">${T('Gross weight')}</th><th>${T('Shipping form')}</th></tr></thead><tbody>
        ${s.collis.map(x => { const u = p.units.find(y => y.id === p.assign[x.id]); const o = orderOf(x.po); return `<tr><td class="mono">${esc(x.id)}</td><td>${x.desc ? esc(x.desc) : `<span class="subtle">${T('No description')}</span>`}</td><td class="mono">${esc(x.po)}${o && o.root ? `<div class="text-caption muted">${T('Split from {root}', {root:o.root})}</div>` : ''}</td><td>${dimsText(x)}</td><td class="cell-end">${kgText(x)}</td><td>${u ? esc(unitTitle(u)) : T('Individual colli (no overpack)')}</td></tr>`; }).join('')}</tbody></table></div></section>
      <section><h3 class="text-heading" style="margin:0 0 .5rem">${T('Optional repacking plan')}</h3>
        ${!p.units.length ? `<p class="text-body-sm muted" style="margin:0 0 .5rem">${T('No repacking selected. All {count} collis will ship individually.', {count: s.collis.length})}</p>` : ''}
        <div class="pkg-grid">${p.units.map(u => { const cs = s.collis.filter(x => p.assign[x.id] === u.id); return `<div class="pkg"><div class="pkg-head"><strong class="text-body-sm">${esc(unitTitle(u))}</strong><span class="text-caption muted"><span class="mono">${u.l} × ${u.w} × ${u.h} cm${u.kg ? ' · ' + fmtNum(Number(u.kg)) + ' kg' : ''}</span></span></div>${pkgList(cs)}</div>`; }).join('')}
        ${loose.length ? `<div class="pkg nc" style="grid-column:1/-1">${nc('FRO-300', 'Individual collis')}<div class="pkg-head"><strong class="text-body-sm">${T('Individual collis')}</strong><span class="text-caption muted">${T('{n} collis', {n: loose.length})}</span></div>
          <div class="table-wrap" style="border:0"><table><thead><tr><th>${T('Colli')}</th><th>${T('Description')}</th><th>${T('Order')}</th><th>${T('Dimensions')}</th><th class="cell-end">${T('Gross weight')}</th></tr></thead><tbody>${loose.map(x => { const o = orderOf(x.po); return `<tr><td class="mono">${esc(x.id)}</td><td>${x.desc ? esc(x.desc) : `<span class="subtle">${T('No description')}</span>`}</td><td class="mono">${esc(x.po)}${o && o.root ? `<div class="text-caption muted">${T('Split from {root}', {root:o.root})}</div>` : ''}</td><td>${dimsText(x)}</td><td class="cell-end">${kgText(x)}</td></tr>`; }).join('')}</tbody></table></div></div>` : ''}</div></section>
      ${saveError('pack')}`;
    foot = `<button type="button" class="btn btn-secondary btn-md" data-act="back-pack">${T('Back to repacking')}</button><button type="button" class="btn btn-primary btn-md" data-act="confirm-ready"${blockers.length || S.saving ? ' disabled' : ''}>${T('Confirm ready for dispatch')}</button>`;
  }
  return modal('pack-modal', p.stage === 'edit' ? tr('Optional repacking') : tr('Review repacking'), body, foot, 'close-pack', bn(p.stage === 'edit' ? 14 : 15));
}

function renderMember() {
  const m = S.member, s = sh();
  const orders = s.orders.concat(m.showExtra ? [EXTRA_ORDER] : []);
  const all = s.collis.concat(m.showExtra ? EXTRA_COLLIS : []);
  const newlyPartial = orders.filter(o => { const cs = all.filter(x => x.po === o.id), n = cs.filter(x => m.sel.has(x.id)).length; return n > 0 && n < cs.length; });
  const rows = orders.map(o => { const cs = all.filter(x => x.po === o.id), n = cs.filter(x => m.sel.has(x.id)).length;
    return `<tr class="po-row"><td><input type="checkbox" class="check" data-mpo="${o.id}" aria-label="${esc(o.id)}"${n === cs.length ? ' checked' : ''}${n > 0 && n < cs.length ? ' data-indeterminate="1"' : ''}></td><td class="mono" style="font-weight:600">${esc(o.id)}${o.root ? ` <span class="muted" style="font-weight:400">· ${T('Split from {root}', {root:o.root})}</span>` : ''}</td><td>${esc(o.client)}</td><td>${esc(o.vessel)}</td><td class="cell-end muted">${s.orders.includes(o) ? T('In this Shipment') : T('Eligible at the origin')}</td></tr>
      ${cs.map(x => `<tr><td class="indent"><input type="checkbox" class="check" data-mcolli="${x.id}" aria-label="${esc(x.id)}"${m.sel.has(x.id) ? ' checked' : ''}></td><td><span class="mono">${esc(x.id)}</span> <span class="muted">· ${x.desc ? esc(x.desc) : T('No description')}</span></td><td>${dimsText(x)}</td><td>${kgText(x)}</td><td></td></tr>`).join('')}`; }).join('');
  const reasonOpts = [['OPERATIONAL_SEPARATION', tr('Operational separation')], ['UNCOLLECTABLE_REMAINDER', tr('Uncollectable remainder')], ['OTHER', tr('Other')]];
  const body = `${nc('FRO-344', 'participation editor (FRO-341 selection controls)')}
    <div class="with-icon" style="max-width:28rem"><label class="sr-only" for="m-search">${T('Search PO, vessel, reference, or tracking code')}</label><input class="control" id="m-search" data-bind="m-search" placeholder="${T('Search PO, vessel, reference, or tracking code')}" value="${esc(m.q)}"></div>
    <p class="hint" style="margin:0">${T('Added collis travel individually until packed.')}</p>
    <div class="table-wrap"><table><thead><tr><th></th><th>${T('Order')} / ${T('Colli')}</th><th>${T('Client')} / ${T('Dimensions')}</th><th>${T('Vessel')} / ${T('Gross weight')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
    ${newlyPartial.length ? `<section><h3 class="text-heading" style="margin:0 0 .5rem">${T('Partial selections')}</h3>${newlyPartial.map(o => { const d = m.partial[o.id] || {}; const bad = m.showErrors && (!d.reason || (d.reason === 'OTHER' && !(d.remark || '').trim()));
      return `<div class="grid2" style="padding:.5rem 0;border-bottom:1px solid var(--border)">${field('m-reason-' + o.id, `${tr('Reason')} · ${o.id}`, sel('m-reason-' + o.id, reasonOpts, d.reason || '', {placeholder: tr('Choose a reason'), invalid: bad && !d.reason}), {error: bad && !d.reason ? tr('Choose a reason') : ''})}${field('m-remark-' + o.id, tr('Remark'), `<input class="control" id="m-remark-${o.id}" data-bind="m-remark-${o.id}" value="${esc(d.remark || '')}">`, {error: bad && d.reason === 'OTHER' ? tr('Remark is required for Other') : ''})}</div>`; }).join('')}</section>` : ''}
    ${m.err ? `<div class="alert tone-danger" role="alert">${I.bad}<div>${esc(m.err)}</div></div>` : ''}${saveError('member')}`;
  const foot = `<button type="button" class="btn btn-secondary btn-md" data-act="close-member">${T('Cancel')}</button><button type="button" class="btn btn-primary btn-md" data-act="save-member">${T('Save')}</button>`;
  return modal('member-modal', tr('Select purchase orders and collis'), body, foot, 'close-member', bn(12));
}

function renderConfirm() {
  const k = S.confirm;
  let title, body, foot;
  if (k.type === 'ready-warning') {
    title = tr('Ready for dispatch');
    body = alertBox('warning', I.warn, T(k.packing ? 'Saving changed packing returns this Shipment to Preparing for dispatch. Readiness must be confirmed again.' : 'Saving this change returns this Shipment to Preparing for dispatch. Readiness must be confirmed again.'));
    foot = `<button type="button" class="btn btn-secondary btn-md" data-act="close-confirm">${T('Back')}</button><button type="button" class="btn btn-primary btn-md" data-act="confirm-go">${T('Save and return to Preparing')}</button>`;
  } else if (k.type === 'dn') {
    title = tr('Delivery-note drafts are affected');
    body = `${nc('FRO-344', 'delivery-note draft reconciliation step')}<p class="text-body-sm" style="margin:0">${T('These draft values came from the previous route. Choose what to do with each before saving.')}</p>
      <div class="dn-card"><strong class="mono">DN-DEMO-DRAFT-1</strong> · ${T('Destination address')}<div class="row-flex" style="flex-wrap:wrap;margin-top:.5rem">
        <label class="row-flex text-body-sm"><input type="radio" name="dnres" data-dnres="keep"${k.choice === 'keep' ? ' checked' : ''}> ${T('Keep entered value')}</label>
        <label class="row-flex text-body-sm"><input type="radio" name="dnres" data-dnres="update"${k.choice === 'update' ? ' checked' : ''}> ${T('Update from the new route')}</label></div></div>`;
    foot = `<button type="button" class="btn btn-secondary btn-md" data-act="close-confirm">${T('Back')}</button><button type="button" class="btn btn-primary btn-md" data-act="confirm-go"${k.choice ? '' : ' disabled'}>${T('Confirm and save')}</button>`;
  } else {
    title = tr('Dispatch shipment');
    body = `<dl class="facts" style="grid-template-columns:repeat(2,minmax(0,1fr))">${fact(tr('Document type'), T(DOC[sh().mode]))}${fact(tr('Document number'), `<span class="mono">${esc(sh().docNo)}</span>`)}</dl>${saveError('dispatch')}`;
    foot = `<button type="button" class="btn btn-secondary btn-md" data-act="close-confirm">${T('Cancel')}</button><button type="button" class="btn btn-primary btn-md" data-act="confirm-go"${S.saving ? ' disabled' : ''}>${T('Dispatch')}</button>`;
  }
  return modal('confirm-modal', title, body, foot, 'close-confirm', '', 'width:min(100%,34rem)');
}

function modal(id, title, body, foot, closeAct, extra = '', style = '') {
  return `<div class="scrim" id="${id}"><div class="scrim-bg" data-act="${closeAct}"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}-title"${style ? ` style="${style}"` : ''}>
    <div class="modal-head"><h2 class="text-subheading" id="${id}-title" style="margin:0">${esc(title)} ${extra}</h2><button type="button" class="btn btn-ghost btn-sm icon-btn" data-act="${closeAct}" aria-label="${T('Close')}">${I.x}</button></div>
    <div class="modal-body sections">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
}

/* ---------- Tools / notes ---------- */
function renderTools() {
  const seg = (name, values, cur) => `<div class="seg" role="group" aria-label="${name}">${values.map(([v, l]) => `<button type="button" data-tool="${name}" data-val="${v}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
  const link = (k, l) => { const u = new URLSearchParams({scenario:k, lang:S.lang}); return `<a href="?${u}"${S.scenario === k ? ' aria-current="true" style="font-weight:700"' : ''}>${l}</a>`; };
  return `<details class="tools" id="tools"${S.toolsOpen ? ' open' : ''}><summary>Review tools <span class="subtle">preview only</span></summary><div class="tools-body">
    <div><p class="label" style="margin:0 0 .25rem">State</p>${seg('state', [['default','Default'],['loading','Loading'],['empty','Empty'],['error','Error']], S.ui)}</div>
    <div><p class="label" style="margin:0 0 .25rem">Annotations</p>${seg('nc', [['1','New components on'],['0','off']], S.showNc ? '1' : '0')}</div>
    <div><p class="label" style="margin:0 0 .25rem">Business notes</p>${seg('bn', [['1','Markers on'],['0','off']], S.showBn ? '1' : '0')} <button type="button" class="btn btn-secondary btn-sm" style="margin-top:.375rem" data-act="notes">Open notes panel</button></div>
    <div><p class="label" style="margin:0 0 .25rem">Access / failures</p>${seg('ro', [['0','SHIPMENT_EDIT'],['1','View only']], S.readonly ? '1' : '0')}<div style="margin-top:.375rem">${seg('fail', [['0','Saves succeed'],['1','Fail next save']], S.failNext ? '1' : '0')}</div></div>
    <div><p class="label" style="margin:0 0 .25rem">Scenarios</p><div class="stack" style="gap:.25rem">
      ${link('preparing','Preparing — no packing yet')}${link('blocked','Preparing — readiness blocked')}${link('ready','Ready for dispatch')}${link('nodoc','Ready — no document number')}
      ${link('dispatched','Dispatched')}${link('arrived','Arrived — third-party handover')}${link('historical','Historical arrival (FRO-324)')}${link('location-unknown','Location unknown')}${link('cancelled','Cancelled')}${link('legacy','Older shipment — no geography, DG Unavailable')}</div></div>
    <p class="hint" style="margin:0">Fixture data only (docs/reference/demo-data.md names and invented values). Nothing is saved.</p></div></details>`;
}
function renderNotesPanel() {
  return `<aside class="notes-panel" aria-label="Business notes"><div class="card-header"><h2 class="text-subheading" style="margin:0">Business notes</h2><button type="button" class="btn btn-ghost btn-sm icon-btn" data-act="notes" aria-label="Close">${I.x}</button></div>
    <ol>${NOTES.map(([title, text], i) => `<li id="note-${i + 1}" class="${S.activeNote === i + 1 ? 'hl' : ''}"><p style="margin:0;font-weight:600"><span class="bn" style="margin:0 .375rem 0 0">${i + 1}</span>${esc(title)}</p><p class="text-body-sm" style="margin:.25rem 0 0">${esc(text)}</p></li>`).join('')}</ol></aside>`;
}

function tabsHtml(tabs, current) {
  return `<div class="tablist" role="tablist">${tabs.map(([v, l]) => `<button type="button" role="tab" class="tab" id="tab-${v}" data-tab="${v}" aria-selected="${v === current}" aria-controls="panel-main" tabindex="${v === current ? 0 : -1}">${esc(l)}</button>`).join('')}</div>`;
}

function render() {
  const active = document.activeElement, focusId = active && active.id;
  const selStart = active && 'selectionStart' in active ? active.selectionStart : null;
  document.documentElement.lang = S.lang;
  document.body.classList.toggle('hide-nc', !S.showNc);
  document.body.classList.toggle('hide-bn', !S.showBn);
  document.getElementById('sim-banner').textContent = 'Static FRO-316 preview — fixture data, browser-only simulation. Nothing is saved.';
  let content;
  if (S.ui === 'loading') content = `<div class="topbar"><div class="skeleton" style="width:16rem"></div></div><div class="card card-pad stack" aria-busy="true" aria-label="${T('Loading…')}"><div class="skeleton"></div><div class="skeleton" style="height:8rem"></div><div class="skeleton" style="height:6rem"></div></div>`;
  else if (S.ui === 'error') content = `<div class="topbar"><h1 class="text-title">${T('Shipment')}</h1></div>${alertBox('danger', I.bad, `${T('Could not load this shipment.')} <button type="button" class="btn btn-secondary btn-sm" style="margin-left:.5rem" data-act="retry">${T('Retry')}</button>`, 'alert')}`;
  else {
    const tabs = [['overview', tr('Overview')], ['orders', tr('Orders and collis')], ['history', tr('History & activity')], ['documents', tr('Documents')], ['actions', tr('Available actions')]];
    const panel = S.tab === 'overview' ? `<div class="sections">${renderDetails()}${renderPurpose()}${renderHandover()}${renderNotes()}</div>`
      : S.tab === 'orders' ? `<div class="sections">${renderOrders()}${renderPackages()}</div>`
      : S.tab === 'history' ? renderHistory() : S.tab === 'documents' ? renderDocuments() : renderActions();
    content = `<div class="topbar"><h1 class="text-title">${T('Shipment')} · <span class="mono">${esc(sh().number)}</span> ${bn(1)}</h1></div>
      <div class="card card-pad">${tabsHtml(tabs, S.tab)}<div class="tabpanel" role="tabpanel" id="panel-main" aria-labelledby="tab-${S.tab}">${panel}</div></div>`;
  }
  document.getElementById('app').innerHTML = renderHeader() + `<main>${content}</main>`
    + (S.pack ? renderPack() : '') + (S.member ? renderMember() : '') + (S.confirm ? renderConfirm() : '')
    + renderTools() + (S.notesOpen ? renderNotesPanel() : '') + (S.toast ? `<div class="toast" role="status" aria-live="polite">${esc(S.toast)}</div>` : '');
  document.querySelectorAll('[data-indeterminate]').forEach(el => el.indeterminate = true);
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); if (selStart != null && 'setSelectionRange' in el) try { el.setSelectionRange(selStart, selStart); } catch (e) {} } }
}

/* ---------------- Behaviour ---------------- */
const MATERIAL = ['oc','ocity','dc','dcity','originWh','mode','dest'];
function toast(msg) { S.toast = msg; render(); setTimeout(() => { S.toast = ''; render(); }, 4000); }
function failed(key) { if (!S.failNext) return false; S.failNext = false; S.errorFor = key; S.saving = false; render(); return true; }
function focusLater(id) { setTimeout(() => document.getElementById(id)?.focus(), 0); }
function backToPreparingIfReady(changed) { if (changed && sh().status === 'READY_FOR_DISPATCH') { sh().status = 'PREPARING'; if (sh().packingState === 'confirmed') sh().packingState = 'saved'; } }

function startEdit(key) {
  const s = sh();
  if (key === 'details') S.edit.details = {oc:s.oc, ocity:s.ocity, dc:s.dc, dcity:s.dcity, originWh:s.originWh, mode:s.mode, docNo:s.docNo, docRes:'', dest:s.dest};
  else if (key === 'purpose') S.edit.purpose = {purpose:s.purpose, dest:s.dest};
  else S.edit[key] = empty() ? '' : s[key];
  S.errorFor = ''; render(); focusLater(key === 'details' ? 'd-oc' : key === 'purpose' ? 'p-purpose' : 'ta-' + key);
}
function cancelEdit(key) { delete S.edit[key]; S.errorFor = ''; render(); focusLater('edit-' + key); }

function saveDetails(skipChecks) {
  const s = sh(), d = S.edit.details;
  if (d.originWh && WAREHOUSES[d.originWh]?.[1] !== d.ocity) { d.err = 'wh'; render(); return; }
  const modeChanged = d.mode !== s.mode && s.docNo;
  const destNeeded = d.dcity !== s.dcity && s.purpose === 'NETWORK_TRANSFER';
  if (destNeeded && WAREHOUSES[d.dest]?.[1] !== d.dcity) { d.err = 'dest'; render(); return; }
  if (modeChanged && !d.docRes) { d.err = 'docres'; render(); return; }
  d.err = '';
  const material = MATERIAL.some(k => d[k] !== s[k]);
  if (!skipChecks && material && s.status === 'READY_FOR_DISPATCH') { S.confirm = {type:'ready-warning', then:() => saveDetails('ready')}; render(); return; }
  if (skipChecks !== 'dn' && material && s.dnDrafts && (d.dcity !== s.dcity || d.originWh !== s.originWh)) { S.confirm = {type:'dn', choice:'', then:() => saveDetails('dn')}; render(); return; }
  if (failed('details')) return;
  let docNo = d.docNo;
  if (modeChanged) docNo = d.docRes === 'clear' ? '' : d.docRes === 'keep' ? s.docNo : d.docNo;
  Object.assign(s, {oc:d.oc, ocity:d.ocity, dc:d.dc, dcity:d.dcity, originWh:d.originWh, mode:d.mode, docNo});
  if (destNeeded) s.dest = d.dest;
  backToPreparingIfReady(material);
  delete S.edit.details; S.errorFor = ''; toast(tr('Simulated: saved. Nothing left this browser.')); focusLater('edit-details');
}
function savePurpose(skip) {
  const s = sh(), d = S.edit.purpose;
  const changed = d.purpose !== s.purpose || d.dest !== s.dest;
  if (!skip && changed && s.status === 'READY_FOR_DISPATCH') { S.confirm = {type:'ready-warning', then:() => savePurpose(true)}; render(); return; }
  if (failed('purpose')) return;
  s.purpose = d.purpose; s.dest = d.purpose === 'DELIVERY_TO_VESSEL' ? null : d.dest; backToPreparingIfReady(changed);
  delete S.edit.purpose; S.errorFor = ''; toast(tr('Simulated: saved. Nothing left this browser.')); focusLater('edit-purpose');
}
function saveNote(key) {
  if (failed(key)) return;
  sh()[key] = S.edit[key].trim(); delete S.edit[key]; S.errorFor = ''; toast(tr('Simulated: saved. Nothing left this browser.')); focusLater('edit-' + key);
}

let unitSeq = 3;
function openPack() { const s = sh(); S.pack = {stage:'edit', units: structuredClone(s.units), assign: {...s.assign}, showErrors:false}; S.errorFor = ''; render(); focusLater('pack-modal-title'); document.querySelector('#pack-modal .icon-btn')?.focus(); }
function closePack() { S.pack = null; S.errorFor = ''; render(); focusLater('pack-btn'); }
const packChanged = p => JSON.stringify([p.units, p.assign]) !== JSON.stringify([sh().units, sh().assign]);
function savePack(skip) {
  const p = S.pack; p.showErrors = true;
  if (Object.keys(packValidation(p)).length) { render(); return; }
  const changed = packChanged(p);
  if (!skip && changed && sh().status === 'READY_FOR_DISPATCH') { S.confirm = {type:'ready-warning', packing:true, then:() => savePack(true)}; render(); return; }
  if (failed('pack')) return;
  const s = sh(); s.units = p.units.map(u => ({...u, l:+u.l, w:+u.w, h:+u.h, kg: u.kg === '' || u.kg == null ? null : +u.kg})); s.assign = {...p.assign};
  if (changed) { backToPreparingIfReady(true); s.packingState = s.status === 'READY_FOR_DISPATCH' ? 'confirmed' : 'saved'; }
  closePack(); toast(tr('Simulated: saved. Nothing left this browser.'));
}
function confirmReady() {
  if (failed('pack')) return;
  const s = sh(), p = S.pack;
  s.units = p.units.map(u => ({...u, l:+u.l, w:+u.w, h:+u.h, kg: u.kg === '' || u.kg == null ? null : +u.kg})); s.assign = {...p.assign};
  s.status = 'READY_FOR_DISPATCH'; s.packingState = 'confirmed';
  s.history = 'ready';
  closePack(); toast(tr('Simulated: saved. Nothing left this browser.'));
}

function openMember() { const s = sh(); S.member = {sel:new Set(s.collis.map(x => x.id)), orig:new Set(s.collis.map(x => x.id)), partial:{}, q:'', showExtra:false, err:'', showErrors:false}; S.errorFor = ''; render(); document.querySelector('#member-modal .icon-btn')?.focus(); }
function closeMember() { S.member = null; S.errorFor = ''; render(); focusLater('member-btn'); }
function saveMember(skip) {
  const m = S.member, s = sh();
  const all = s.collis.concat(m.showExtra ? EXTRA_COLLIS : []);
  m.err = '';
  if (!m.sel.size) { m.err = tr('Select at least one colli.'); render(); return; }
  const emptied = s.units.find(u => Object.entries(s.assign).filter(([k, v]) => v === u.id).every(([k]) => !m.sel.has(k)));
  if (emptied) { m.err = tr('Saving would leave {unit} empty. Unpack it in Plan packing first.', {unit: unitTitle(emptied)}); render(); return; }
  const orders = s.orders.concat(m.showExtra ? [EXTRA_ORDER] : []);
  const partials = orders.filter(o => { const cs = all.filter(x => x.po === o.id), n = cs.filter(x => m.sel.has(x.id)).length; return n > 0 && n < cs.length; });
  m.showErrors = true;
  if (partials.some(o => { const d = m.partial[o.id] || {}; return !d.reason || (d.reason === 'OTHER' && !(d.remark || '').trim()); })) { render(); return; }
  const changed = all.some(x => m.sel.has(x.id) !== m.orig.has(x.id));
  if (!skip && changed && s.status === 'READY_FOR_DISPATCH') { S.confirm = {type:'ready-warning', then:() => saveMember(true)}; render(); return; }
  if (failed('member')) return;
  s.collis = all.filter(x => m.sel.has(x.id));
  if (s.collis.some(x => x.po === EXTRA_ORDER.id) && !s.orders.some(o => o.id === EXTRA_ORDER.id)) s.orders.push({...EXTRA_ORDER});
  s.orders = s.orders.filter(o => s.collis.some(x => x.po === o.id));
  for (const k of Object.keys(s.assign)) if (!m.sel.has(k)) delete s.assign[k];
  backToPreparingIfReady(changed);
  closeMember(); toast(tr('Simulated: saved. Nothing left this browser.'));
}

function switchTab(value) { S.tab = value; const u = new URL(location); u.searchParams.set('tab', value); history.replaceState(null, '', u); render(); document.getElementById('tab-' + value)?.focus(); }

document.addEventListener('input', e => {
  const t = e.target, id = t.dataset.bind;
  if (t.dataset.unit) { const u = S.pack.units.find(x => x.id === t.dataset.unit); u[t.dataset.key] = t.value; if (t.tagName !== 'SELECT') render(); return; }
  if (!id || t.tagName === 'SELECT') return;
  if (id.startsWith('d-')) S.edit.details[id.slice(2)] = t.value;
  else if (id.startsWith('ta-')) S.edit[id.slice(3)] = t.value;
  else if (id === 'comment') S.commentDraft = t.value;
  else if (id === 'cancelReason') S.cancelReason = t.value;
  else if (id === 'luReason') S.luReason = t.value;
  else if (id === 'm-search') { S.member.q = t.value; S.member.showExtra = t.value.trim().length > 0; }
  else if (id.startsWith('m-remark-')) { const po = id.slice(9); (S.member.partial[po] ||= {}).remark = t.value; }
  render();
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.unit) { const u = S.pack.units.find(x => x.id === t.dataset.unit); u[t.dataset.key] = t.value; render(); return; }
  if (t.dataset.assign) { if (t.value) S.pack.assign[t.dataset.assign] = t.value; else delete S.pack.assign[t.dataset.assign]; render(); return; }
  if (t.dataset.docres) { S.edit.details.docRes = t.dataset.docres; if (t.dataset.docres === 'replace') S.edit.details.docNo = ''; render(); return; }
  if (t.dataset.dnres) { S.confirm.choice = t.dataset.dnres; render(); return; }
  if (t.dataset.mpo) { const all = sh().collis.concat(S.member.showExtra ? EXTRA_COLLIS : []); all.filter(x => x.po === t.dataset.mpo).forEach(x => t.checked ? S.member.sel.add(x.id) : S.member.sel.delete(x.id)); render(); return; }
  if (t.dataset.mcolli) { t.checked ? S.member.sel.add(t.dataset.mcolli) : S.member.sel.delete(t.dataset.mcolli); render(); return; }
  if (t.id === 'file-input') { [...t.files].forEach(f => S.files.push({name:f.name, kind:/^image\//.test(f.type) ? 'PHOTO' : 'DOCUMENT', size:(f.size / 1048576).toFixed(1) + ' MB', at:'26/10/2026'})); t.value = ''; render(); return; }
  if (t.tagName === 'SELECT' && t.dataset.bind) {
    const id = t.dataset.bind;
    if (id.startsWith('d-')) { const d = S.edit.details, k = id.slice(2); d[k] = t.value;
      if (k === 'oc') { d.ocity = ''; d.originWh = ''; } if (k === 'dc') { d.dcity = ''; d.dest = ''; } if (k === 'dcity') d.dest = ''; if (k === 'ocity' && WAREHOUSES[d.originWh]?.[1] !== t.value) d.originWh = '';
      if (k === 'mode') d.docRes = ''; }
    else if (id.startsWith('p-')) { S.edit.purpose[id.slice(2)] = t.value; if (id === 'p-purpose') S.edit.purpose.dest = ''; }
    else if (id.startsWith('m-reason-')) (S.member.partial[id.slice(9)] ||= {}).reason = t.value;
    render();
  }
});
document.addEventListener('click', e => {
  const b = e.target.closest('button, [data-act]'); if (!b) return;
  if (b.dataset.lang) { S.lang = b.dataset.lang; const u = new URL(location); u.searchParams.set('lang', S.lang); history.replaceState(null, '', u); render(); return; }
  if (b.dataset.note) { S.notesOpen = true; S.activeNote = +b.dataset.note; render(); document.getElementById('note-' + b.dataset.note)?.scrollIntoView({block:'nearest'}); return; }
  if (b.dataset.tab) { switchTab(b.dataset.tab); return; }
  if (b.dataset.expand) { S.expanded.has(b.dataset.expand) ? S.expanded.delete(b.dataset.expand) : S.expanded.add(b.dataset.expand); render(); return; }
  if (b.dataset.edit) { startEdit(b.dataset.edit); return; }
  if (b.dataset.cancel) { cancelEdit(b.dataset.cancel); return; }
  if (b.dataset.save) { const k = b.dataset.save; k === 'details' ? saveDetails() : k === 'purpose' ? savePurpose() : saveNote(k); return; }
  if (b.dataset.removeUnit) { const id = b.dataset.removeUnit; S.pack.units = S.pack.units.filter(u => u.id !== id); for (const k of Object.keys(S.pack.assign)) if (S.pack.assign[k] === id) delete S.pack.assign[k]; render(); return; }
  if (b.dataset.removeFile) { S.files.splice(+b.dataset.removeFile, 1); render(); return; }
  if (b.dataset.tool) {
    const v = b.dataset.val, t = b.dataset.tool;
    if (t === 'state') S.ui = v; else if (t === 'nc') S.showNc = v === '1'; else if (t === 'bn') S.showBn = v === '1'; else if (t === 'ro') { S.readonly = v === '1'; S.edit = {}; } else if (t === 'fail') S.failNext = v === '1';
    S.toolsOpen = true; render(); return;
  }
  const act = b.dataset.act; if (!act) return;
  S.toolsOpen = !!e.target.closest('.tools');
  if (act === 'retry') { S.ui = 'default'; render(); }
  else if (act === 'notes') { S.notesOpen = !S.notesOpen; render(); }
  else if (act === 'goto-orders') switchTab('orders');
  else if (act === 'view-history') { S.highlight = b.dataset.event; switchTab('history'); document.getElementById('ev-' + b.dataset.event)?.scrollIntoView({block:'center'}); }
  else if (act === 'open-pack') openPack();
  else if (act === 'close-pack') closePack();
  else if (act === 'add-unit') { S.pack.units.push({id:'N' + unitSeq, type:'PALLET', label:'Pallet ' + unitSeq++, l:'', w:'', h:'', kg:''}); render(); }
  else if (act === 'save-pack') savePack();
  else if (act === 'review-pack') { S.pack.showErrors = true; if (!Object.keys(packValidation(S.pack)).length) { S.pack.stage = 'review'; S.errorFor = ''; } render(); document.querySelector('#pack-modal .icon-btn')?.focus(); }
  else if (act === 'back-pack') { S.pack.stage = 'edit'; S.errorFor = ''; render(); document.querySelector('#pack-modal .icon-btn')?.focus(); }
  else if (act === 'confirm-ready') confirmReady();
  else if (act === 'open-member') openMember();
  else if (act === 'close-member') closeMember();
  else if (act === 'save-member') saveMember();
  else if (act === 'dispatch') { S.confirm = {type:'dispatch'}; S.errorFor = ''; render(); document.querySelector('#confirm-modal .icon-btn')?.focus(); }
  else if (act === 'close-confirm') { const wasDispatch = S.confirm.type === 'dispatch'; S.confirm = null; render(); if (wasDispatch) focusLater('dispatch-btn'); }
  else if (act === 'confirm-go') {
    const k = S.confirm;
    if (k.type === 'dispatch') { if (failed('dispatch')) return; S.confirm = null; Object.assign(sh(), {status:'DISPATCHED', departure:'26/10/2026 10:15', history:'dispatched'}); toast(tr('Simulated: saved. Nothing left this browser.')); }
    else { S.confirm = null; k.then(); }
  }
  else if (act === 'add-comment') { S.comments.unshift(['26/10/2026 10:20','Demo operator', S.commentDraft.trim(), '']); S.commentDraft = ''; render(); }
  else if (act === 'cancel-shipment') { Object.assign(sh(), {status:'CANCELLED', lastStage: sh().status, history:'cancelled'}); S.cancelReason = ''; render(); }
  else if (act === 'arrive') { Object.assign(sh(), {status:'ARRIVED', arrival:'26/10/2026 10:30', history:'arrived'}); render(); }
  else if (act === 'mark-unknown') { Object.assign(sh(), {status:'LOCATION_UNKNOWN', lastStage:'DISPATCHED', history:'lu'}); S.luReason = ''; render(); }
});
document.addEventListener('keydown', e => {
  const tab = e.target instanceof Element ? e.target.closest('[role=tab]') : null;
  if (tab && ['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
    const tabs = [...tab.parentElement.querySelectorAll('[role=tab]')]; let i = tabs.indexOf(tab);
    i = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    e.preventDefault(); switchTab(tabs[i].dataset.tab); return;
  }
  if (e.target.id === 'file-label' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); document.getElementById('file-input').click(); return; }
  const modalEl = [...document.querySelectorAll('.scrim .modal')].pop();
  if (e.key === 'Escape') {
    if (S.confirm) { S.confirm = null; render(); return; }
    if (S.member) { closeMember(); return; }
    if (S.pack) { closePack(); return; }
    const box = e.target.closest && e.target.closest('.sub, .card');
    const key = box && box.querySelector('[data-cancel]')?.dataset.cancel;
    if (key) cancelEdit(key);
    return;
  }
  if (modalEl && e.key === 'Tab') {
    const f = [...modalEl.querySelectorAll('button:not([disabled]),a,input:not([disabled]),select:not([disabled]),textarea')];
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
});
render();
