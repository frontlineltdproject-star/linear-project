'use strict';
/* FRO-350 Create Export — static preview. Fixture data only; every operation is a browser-local simulation.
   Styles mirror frontline-forwarding-client DESIGN.md, theme.css and components/ui at main 5c51030. */

/* ------------------------------------------------------------------ Greek copy (proposed; confirm with the office) */
const EL = {
  'Dashboard':'Πίνακας ελέγχου','Purchase orders':'Παραγγελίες αγοράς','Shipments':'Αποστολές','Exports':'Εξαγωγές','Companies':'Εταιρείες',
  'Create Export':'Δημιουργία εξαγωγής',
  'Prepare one Export Customs Declaration for a Shipment. Nothing is saved until you select Create Export.':'Προετοιμάστε μία τελωνειακή διασάφηση εξαγωγής για μια αποστολή. Τίποτα δεν αποθηκεύεται μέχρι να επιλέξετε Δημιουργία εξαγωγής.',
  'Cancel':'Άκυρο','Overview':'Επισκόπηση','Supplier Invoices & Orders ({n})':'Τιμολόγια προμηθευτών και παραγγελίες ({n})',
  'VAT Exemption Protocol':'Πρωτόκολλο απαλλαγής ΦΠΑ','Documents ({n})':'Έγγραφα ({n})',
  'Shipment relationship':'Σύνδεση με αποστολή','Search Shipment':'Αναζήτηση αποστολής',
  'Search AWB, CMR, B/L or Shipment number…':'Αναζήτηση AWB, CMR, B/L ή αριθμού αποστολής…',
  'Shipment number':'Αριθμός αποστολής','Document type':'Τύπος εγγράφου','Document number':'Αριθμός εγγράφου',
  'No matching Shipments. Cancelled Shipments are not shown.':'Δεν βρέθηκαν αποστολές. Οι ακυρωμένες αποστολές δεν εμφανίζονται.',
  'Not recorded':'Δεν καταχωρίστηκε','Preparing':'Σε προετοιμασία','Dispatched':'Απεστάλη','Arrived':'Αφίχθηκε',
  'Air Waybill (AWB)':'Αεροπορική φορτωτική (AWB)','Bill of Lading (B/L)':'Φορτωτική (B/L)','CMR':'CMR',
  'Export scope':'Εύρος εξαγωγής','Select a Shipment to find its Exports.':'Επιλέξτε αποστολή για να εντοπιστούν οι εξαγωγές της.',
  'Finding Exports for this Shipment':'Αναζήτηση εξαγωγών για αυτή την αποστολή',
  'Exports could not be loaded for this Shipment.':'Δεν ήταν δυνατή η φόρτωση εξαγωγών για αυτή την αποστολή.','Retry':'Επανάληψη',
  'This Shipment has no participating Orders yet. Add Orders to the Shipment before preparing an Export.':'Η αποστολή δεν έχει ακόμη συμμετέχουσες παραγγελίες. Προσθέστε παραγγελίες στην αποστολή πριν προετοιμάσετε εξαγωγή.',
  'Export type':'Τύπος εξαγωγής','Shipper':'Αποστολέας','Shipper ΑΦΜ':'ΑΦΜ αποστολέα','Suggested invoices':'Προτεινόμενα τιμολόγια','Action':'Ενέργεια',
  'Greek invoicing company':'Ελληνική εταιρεία τιμολόγησης','Foreign invoicing company':'Εταιρεία τιμολόγησης εξωτερικού',
  'Select':'Επιλογή','Selected':'Επιλεγμένο','Open existing Export':'Άνοιγμα υπάρχουσας εξαγωγής','Blocked':'Μπλοκαρισμένο',
  'Preview invoices':'Προεπισκόπηση τιμολογίων','Invoice number':'Αριθμός τιμολογίου','Supplier':'Προμηθευτής','Linked Order':'Συνδεδεμένη παραγγελία',
  'No invoices are suggested for this Export.':'Δεν προτείνονται τιμολόγια για αυτή την εξαγωγή.',
  'Several Exports were found. Select the one to create.':'Βρέθηκαν περισσότερες εξαγωγές. Επιλέξτε αυτή που θα δημιουργήσετε.',
  'Already exists as {exp}.':'Υπάρχει ήδη ως {exp}.',
  'Export details':'Στοιχεία εξαγωγής','MRN':'MRN','MRN date':'Ημερομηνία MRN','Delivered vessel':'Πλοίο παράδοσης','Optional':'Προαιρετικό',
  'No vessel':'Χωρίς πλοίο','18 letters or digits':'18 γράμματα ή ψηφία',
  'Customs status':'Κατάσταση τελωνείου','Awaiting EAD':'Αναμονή EAD','Awaiting IE599':'Αναμονή IE599','Completed':'Ολοκληρώθηκε',
  'EAD receipt confirmation date':'Ημερομηνία επιβεβαίωσης παραλαβής EAD','Positive IE599 confirmation date':'Ημερομηνία επιβεβαίωσης θετικού IE599',
  'Creating at Awaiting IE599 confirms EAD receipt in your name.':'Η δημιουργία σε Αναμονή IE599 επιβεβαιώνει την παραλαβή EAD στο όνομά σας.',
  'Supplier invoices':'Τιμολόγια προμηθευτών','Connected Orders':'Συνδεδεμένες παραγγελίες',
  'The Informative List: invoices this Export declares.':'Η Πληροφοριακή κατάσταση: τα τιμολόγια που δηλώνει αυτή η εξαγωγή.',
  'Derived from the selected invoices. Each Order appears once.':'Προκύπτουν από τα επιλεγμένα τιμολόγια. Κάθε παραγγελία εμφανίζεται μία φορά.',
  'Add invoice':'Προσθήκη τιμολογίου','Search invoice number, Supplier or Order…':'Αναζήτηση αριθμού τιμολογίου, προμηθευτή ή παραγγελίας…',
  'Invoice type':'Τύπος τιμολογίου','VAT exemption status':'Κατάσταση απαλλαγής ΦΠΑ','Source':'Προέλευση','Remove':'Αφαίρεση',
  'Remove {inv}':'Αφαίρεση {inv}','Direct · {o}':'Άμεσο · {o}','Ancestor of {o}':'Πρόγονος της {o}','Added':'Προστέθηκε',
  'Paperwork only':'Μόνο έγγραφα','Not started':'Δεν ξεκίνησε','Not required':'Δεν απαιτείται',
  'Select an Export scope to see its invoices.':'Επιλέξτε εύρος εξαγωγής για να δείτε τα τιμολόγια.',
  'No invoices selected. A Foreign invoicing company Export can be created without invoices.':'Δεν έχουν επιλεγεί τιμολόγια. Μια εξαγωγή εταιρείας τιμολόγησης εξωτερικού μπορεί να δημιουργηθεί χωρίς τιμολόγια.',
  'No invoices selected. A Greek invoicing company Export needs at least one invoice.':'Δεν έχουν επιλεγεί τιμολόγια. Μια εξαγωγή ελληνικής εταιρείας τιμολόγησης χρειάζεται τουλάχιστον ένα τιμολόγιο.',
  'No connected Orders.':'Δεν υπάρχουν συνδεδεμένες παραγγελίες.','Order':'Παραγγελία','Invoicing company':'Εταιρεία τιμολόγησης','Vessel':'Πλοίο','Selected invoices':'Επιλεγμένα τιμολόγια',
  'No matching invoices.':'Δεν βρέθηκαν τιμολόγια.',
  'Already selected':'Έχει ήδη επιλεγεί','Cancelled invoice':'Ακυρωμένο τιμολόγιο','In {exp}':'Σε {exp}','Different Invoicing company':'Διαφορετική εταιρεία τιμολόγησης',
  'Different Supplier':'Διαφορετικός προμηθευτής','Invoice type not allowed for this Export type':'Ο τύπος τιμολογίου δεν επιτρέπεται για αυτόν τον τύπο εξαγωγής',
  'Entry Note {en} storage invoices are in {exp}':'Τα τιμολόγια αποθήκευσης του δελτίου εισόδου {en} βρίσκονται στην {exp}',
  'Select an Export scope first.':'Επιλέξτε πρώτα εύρος εξαγωγής.',
  'VAT exemption procedure is not required':'Η διαδικασία απαλλαγής ΦΠΑ δεν απαιτείται',
  'No selected invoice is of type Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).':'Κανένα επιλεγμένο τιμολόγιο δεν είναι τύπου Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).',
  'Protocol number · provisional':'Αριθμός πρωτοκόλλου · προσωρινό','Protocol date · provisional':'Ημερομηνία πρωτοκόλλου · προσωρινή','Assigned on creation':'Αποδίδεται κατά τη δημιουργία',
  'Attachments':'Συνημμένα','Choose files':'Επιλογή αρχείων','Documents for this Export. They upload after the Export is created.':'Έγγραφα για αυτή την εξαγωγή. Ανεβαίνουν μετά τη δημιουργία της εξαγωγής.',
  'PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV or TXT · up to 25 MB per file · nonempty files · filename 1–255 characters.':'PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV ή TXT · έως 25 MB ανά αρχείο · μη κενά αρχεία · όνομα 1–255 χαρακτήρες.',
  'No documents staged.':'Δεν υπάρχουν έγγραφα σε αναμονή.','Staged file':'Αρχείο σε αναμονή','Uploaded':'Ανέβηκε','Upload failed':'Αποτυχία μεταφόρτωσης',
  'Select a Shipment.':'Επιλέξτε αποστολή.','Select an Export scope.':'Επιλέξτε εύρος εξαγωγής.','Enter the MRN.':'Συμπληρώστε το MRN.',
  'The MRN must be exactly 18 letters or digits.':'Το MRN πρέπει να έχει ακριβώς 18 γράμματα ή ψηφία.',
  'This MRN is already used by {exp}.':'Αυτό το MRN χρησιμοποιείται ήδη από την {exp}.',
  'Enter the MRN date.':'Συμπληρώστε την ημερομηνία MRN.','The MRN date cannot be later than today.':'Η ημερομηνία MRN δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'Enter the EAD receipt confirmation date.':'Συμπληρώστε την ημερομηνία επιβεβαίωσης παραλαβής EAD.',
  'The EAD receipt confirmation date cannot be earlier than the MRN date.':'Η ημερομηνία επιβεβαίωσης παραλαβής EAD δεν μπορεί να είναι προγενέστερη της ημερομηνίας MRN.',
  'The EAD receipt confirmation date cannot be later than today.':'Η ημερομηνία επιβεβαίωσης παραλαβής EAD δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'Select at least one invoice for a Greek invoicing company Export.':'Επιλέξτε τουλάχιστον ένα τιμολόγιο για εξαγωγή ελληνικής εταιρείας τιμολόγησης.',
  'Fix the highlighted fields to create the Export.':'Διορθώστε τα επισημασμένα πεδία για να δημιουργηθεί η εξαγωγή.',
  'An Export already exists for this group: {exp}. Your draft is kept.':'Υπάρχει ήδη εξαγωγή για αυτή την ομάδα: {exp}. Το πρόχειρό σας διατηρείται.',
  'Open {exp}':'Άνοιγμα {exp}',
  'The Export could not be created. Nothing was saved and your draft is kept. Try again.':'Δεν ήταν δυνατή η δημιουργία της εξαγωγής. Δεν αποθηκεύτηκε τίποτα και το πρόχειρό σας διατηρείται. Δοκιμάστε ξανά.',
  'Creating…':'Δημιουργία…',
  'Export {exp} created':'Η εξαγωγή {exp} δημιουργήθηκε','Open Export':'Άνοιγμα εξαγωγής','Protocol number':'Αριθμός πρωτοκόλλου','None':'Κανένας',
  'We could not confirm whether the Export was created.':'Δεν ήταν δυνατό να επιβεβαιωθεί αν δημιουργήθηκε η εξαγωγή.',
  'Check the original attempt before trying again. Your draft and staged files are kept.':'Ελέγξτε την αρχική προσπάθεια πριν δοκιμάσετε ξανά. Το πρόχειρο και τα αρχεία σας διατηρούνται.',
  'Check original attempt':'Έλεγχος αρχικής προσπάθειας',
  'Replace the edited invoice selection?':'Αντικατάσταση της επεξεργασμένης επιλογής τιμολογίων;',
  'You changed the selected invoices. Switching replaces them with the new suggestions. MRN, dates, vessel, Customs status and documents stay.':'Αλλάξατε τα επιλεγμένα τιμολόγια. Η αλλαγή τα αντικαθιστά με τις νέες προτάσεις. Το MRN, οι ημερομηνίες, το πλοίο, η κατάσταση τελωνείου και τα έγγραφα παραμένουν.',
  'Replace selection':'Αντικατάσταση επιλογής','Keep current selection':'Διατήρηση τρέχουσας επιλογής',
  'Discard this Export draft?':'Απόρριψη του προχείρου εξαγωγής;','Nothing has been saved. Your entries and staged files will be lost.':'Δεν έχει αποθηκευτεί τίποτα. Οι καταχωρίσεις και τα αρχεία σας θα χαθούν.',
  'Discard draft':'Απόρριψη προχείρου','Keep editing':'Συνέχεια επεξεργασίας','Draft discarded.':'Το πρόχειρο απορρίφθηκε.',
  'Missing value':'Δεν υπάρχει τιμή'
};

/* ------------------------------------------------------------------ Fixtures (fictional) */
const CO = {
  c1:{name:'Aegean Demo Trading Α.Ε.', reg:'GREEK', vat:'099000101'},
  c2:{name:'Ionian Demo Shipping Μ.Ε.Π.Ε.', reg:'GREEK', vat:'099000202'},
  c3:{name:'Demo Marine Services Ltd', reg:'FOREIGN', vat:'CY99000303X'},
  s1:{name:'Demo Hellas Supplies Α.Ε.', reg:'GREEK', vat:'099000404'},
  s2:{name:'Piraeus Demo Parts Ο.Ε.', reg:'GREEK', vat:'099000505'},
  s3:{name:'Demo Valves Α.Β.Ε.Ε.', reg:'GREEK', vat:''}
};
const VESSELS = ['MV Demo Aurora','MV Demo Boreas','MT Demo Calypso','MV Demo Delphi'];
const ORD = {
  'FL-DEMO-2101':{s:'s1',c:'c1',v:'MV Demo Aurora'}, 'FL-DEMO-2102':{s:'s2',c:'c1',v:'MV Demo Aurora'},
  'FL-DEMO-2103':{s:'s1',c:'c1',v:'MV Demo Boreas'}, 'FL-DEMO-2103.1.1':{s:'s1',c:'c1',v:'MV Demo Boreas'},
  'FL-DEMO-2104':{s:'s2',c:'c1',v:''}, 'FL-DEMO-2105':{s:'s1',c:'c1',v:'MV Demo Aurora'}, 'FL-DEMO-2106':{s:'s1',c:'c1',v:'MV Demo Boreas'},
  'FL-DEMO-2107':{s:'s2',c:'c1',v:'MV Demo Aurora'},
  'FL-DEMO-2201':{s:'s1',c:'c2',v:'MT Demo Calypso'}, 'FL-DEMO-2202':{s:'s2',c:'c2',v:'MT Demo Calypso'},
  'FL-DEMO-2301':{s:'s1',c:'c2',v:'MT Demo Calypso'},
  'FL-DEMO-2401':{s:'s1',c:'c3',v:'MV Demo Delphi'}, 'FL-DEMO-2402':{s:'s1',c:'c3',v:'MV Demo Delphi'},
  'FL-DEMO-2403':{s:'s2',c:'c3',v:'MV Demo Delphi'}, 'FL-DEMO-2404':{s:'s3',c:'c3',v:'MV Demo Delphi'},
  'FL-DEMO-2501':{s:'s1',c:'c3',v:''}
};
const UD='Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)', ST='Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)', MRNT='Greek Supplier – Foreign Recipient (MRN)';
const INV = {
  'SI-DEMO-501':{o:'FL-DEMO-2101',type:UD}, 'SI-DEMO-502':{o:'FL-DEMO-2102',type:ST}, 'SI-DEMO-503':{o:'FL-DEMO-2103',type:UD},
  'SI-DEMO-504':{o:'FL-DEMO-2104',type:UD}, 'SI-DEMO-505':{o:'FL-DEMO-2201',type:UD}, 'SI-DEMO-506':{o:'FL-DEMO-2202',type:ST},
  'SI-DEMO-507':{o:'FL-DEMO-2301',type:ST}, 'SI-DEMO-508':{o:'FL-DEMO-2401',type:MRNT}, 'SI-DEMO-509':{o:'FL-DEMO-2401',type:ST},
  'SI-DEMO-510':{o:'FL-DEMO-2501',type:MRNT}, 'SI-DEMO-511':{o:'FL-DEMO-2105',type:UD,assigned:'EXP-2038'},
  'SI-DEMO-512':{o:'FL-DEMO-2201',type:ST}, 'SI-DEMO-513':{o:'FL-DEMO-2105',type:UD,cancelled:true},
  'SI-DEMO-514':{o:'FL-DEMO-2107',type:MRNT}, 'SI-DEMO-515':{o:'FL-DEMO-2107',type:ST,entryNote:['EN-DEMO-77','EXP-2040']},
  'SI-DEMO-516':{o:'FL-DEMO-2106',type:UD}
};
const SHIP = [
  {id:'SHP-DEMO-101', doc:'Bill of Lading (B/L)', num:'DEMO-101', status:'Dispatched', physical:['FL-DEMO-2101','FL-DEMO-2102','FL-DEMO-2103.1.1'],
    groups:[{key:'g101', kind:'greek', c:'c1', sugg:[['SI-DEMO-501','direct','FL-DEMO-2101'],['SI-DEMO-502','direct','FL-DEMO-2102'],['SI-DEMO-503','ancestor','FL-DEMO-2103.1.1']]}]},
  {id:'SHP-DEMO-102', doc:'Air Waybill (AWB)', num:'999-00000102', status:'Dispatched', physical:['FL-DEMO-2106','FL-DEMO-2201','FL-DEMO-2202'],
    groups:[{key:'g102a', kind:'greek', c:'c1', sugg:[['SI-DEMO-516','direct','FL-DEMO-2106']]},
            {key:'g102b', kind:'greek', c:'c2', sugg:[['SI-DEMO-505','direct','FL-DEMO-2201'],['SI-DEMO-506','direct','FL-DEMO-2202']]}]},
  {id:'SHP-DEMO-103', doc:'CMR', num:'DEMO-103', status:'Arrived', physical:['FL-DEMO-2301'],
    groups:[{key:'g103', kind:'greek', c:'c2', sugg:[['SI-DEMO-507','direct','FL-DEMO-2301']]}]},
  {id:'SHP-DEMO-104', doc:'Bill of Lading (B/L)', num:'DEMO-104', status:'Dispatched', physical:['FL-DEMO-2105','FL-DEMO-2401','FL-DEMO-2402','FL-DEMO-2403','FL-DEMO-2404'],
    groups:[{key:'g104a', kind:'greek', c:'c1', existing:'EXP-2041', sugg:[]},
            {key:'g104b', kind:'foreign', c:'c3', s:'s1', sugg:[['SI-DEMO-508','direct','FL-DEMO-2401'],['SI-DEMO-509','direct','FL-DEMO-2401']]},
            {key:'g104c', kind:'foreign', c:'c3', s:'s2', sugg:[]},
            {key:'g104d', kind:'foreign', c:'c3', s:'s3', blocked:'s3', sugg:[]}]},
  {id:'SHP-DEMO-105', doc:null, num:null, status:'Preparing', physical:['FL-DEMO-2501'],
    groups:[{key:'g105', kind:'foreign', c:'c3', s:'s1', sugg:[['SI-DEMO-510','direct','FL-DEMO-2501']]}]},
  {id:'SHP-DEMO-106', doc:'CMR', num:'DEMO-106', status:'Cancelled', physical:[], groups:[]},
  {id:'SHP-DEMO-107', doc:null, num:null, status:'Preparing', physical:[], groups:[]}
];
const USED_MRN = {'26GR0000000000DEMO':'EXP-2038'};

/* ------------------------------------------------------------------ Business notes */
const NOTES = [
  'Search finds Shipments by Shipment number or transport document number (AWB / CMR / B/L), partial and case-insensitive. Cancelled Shipments are never offered (FRO-317 eligible Shipments).',
  'Each row is one candidate Export: Greek = Shipment + Invoicing company; Foreign = Shipment + Invoicing company + Supplier. Grouping uses the Order’s Invoicing company, never its Client. A sole eligible candidate is selected automatically; several need a choice.',
  'A group that already has an active Export offers Open existing Export instead of creating a duplicate.',
  'Blocked groups name the Order and Company to correct: missing Invoicing company, missing ΑΦΜ (Invoicing company, or Supplier in the foreign procedure), missing Supplier, duplicate foreign VAT number, or foreign recipient with foreign Supplier. No fallback is guessed.',
  'Preview invoices shows the candidate’s read-only suggestions. Expanding it never selects a candidate or changes the invoice selection.',
  'Export type, Shipper and Shipper ΑΦΜ are derived from the selected scope: Shipper is the Invoicing company (Greek) or the Supplier (foreign). They are never edited.',
  'MRN: exactly 18 letters or digits, stored in upper case, unique across all Exports including cancelled ones. MRN date: not later than today (Europe/Athens).',
  'Delivered vessel is optional and belongs to the Export: any Vessel, never copied from the Shipment, Order or invoice.',
  'Customs status starts at Awaiting EAD, or Awaiting IE599 when the EAD has already arrived. Awaiting IE599 needs the EAD receipt confirmation date (not before the MRN date, not after today); Create then records the EAD confirmation with your name and time. Completed is never a creation option.',
  'Invoices: only active invoices of this Invoicing company (and Supplier, for foreign) whose type is allowed for the Export type. An invoice already in another active Export shows that Export. Storage invoices of one Entry Note must stay in one Export. Paperwork only = the invoice’s Order has no collis in this Shipment.',
  'Connected Orders come only from the selected invoices; each Order once. They do not show all Shipment Orders.',
  'VAT exemption is Required when at least one selected invoice is Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.). The protocol number and date are assigned only when the Export is created; nothing is reserved while preparing.',
  'Documents stay in the browser until the Export exists, then upload to it. A failed upload is retried from the result; the Export is not created twice.',
  'Create rechecks everything on the server. If another user created this group’s Export meanwhile, you are offered that Export and your draft is kept. If the outcome is unknown, check the original attempt before trying again.',
  'A Greek invoicing company Export needs at least one selected invoice. A Foreign invoicing company Export can be created with none.'
];

/* ------------------------------------------------------------------ State */
const params = new URLSearchParams(location.search);
const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Athens'}).format(new Date());
const S = {
  lang: params.get('lang') === 'el' ? 'el' : 'en', tab: 'overview', ship: null, query: '', popOpen: false,
  lookup: 'idle', scopeKey: null, inv: [], edited: false, expanded: {}, mrn: '', mrnDate: '', vessel: '', status: 'ead', eadDate: '',
  files: [], errors: {}, banner: null, result: null, modal: null, addQuery: '', addOpen: false, busy: false,
  outcome: 'success', notes: params.get('notes') === '1', nc: true, hl: null, toast: null, forceLookup: null
};
const state0 = params.get('state') || 'default';

/* ------------------------------------------------------------------ Helpers */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function t(s, v) { let r = S.lang === 'el' ? (EL[s] ?? s) : s; if (v) for (const k in v) r = r.split('{'+k+'}').join(v[k]); return r; }
const ship = () => SHIP.find(x => x.id === S.ship) || null;
const groups = () => (ship()?.groups) || [];
const scope = () => groups().find(g => g.key === S.scopeKey) || null;
const shipper = g => g ? CO[g.kind === 'greek' ? g.c : g.s] : null;
const eligibleGroups = () => groups().filter(g => !g.blocked && !g.existing);
const ICON = {
  search:'<path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/>',
  chev:'<path d="m6 9 6 6 6-6"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  clip:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  alert:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  ok:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>', ship:'<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M12 10v4"/><path d="M12 2v3"/>'
};
const ic = (n, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const bn = n => `<button type="button" class="bn" data-act="note" data-n="${n}" aria-label="Business note ${n}">${n}</button>`;
const ncl = (txt) => `<p class="nc-label">New component — ${esc(txt)}</p>`;
const link = (txt) => `<a class="link mono" href="#" data-act="noop">${esc(txt)}</a>`;
const roField = (label, value, extra='') => `<div class="field"><span class="label">${esc(label)}${extra}</span><div class="ro${value ? '' : ' empty'}">${value || '—'}</div></div>`;
const alertBox = (tone, icon, html, role='status') => `<div class="alert tone-${tone}" role="${role}">${ic(icon)}<div>${html}</div></div>`;

function invReason(id, g) {
  const i = INV[id], o = ORD[i.o];
  if (S.inv.some(x => x.id === id)) return t('Already selected');
  if (i.cancelled) return t('Cancelled invoice');
  if (i.assigned) return t('In {exp}', {exp:i.assigned});
  if (o.c !== g.c) return t('Different Invoicing company');
  if (g.kind === 'foreign' && o.s !== g.s) return t('Different Supplier');
  const allowed = g.kind === 'greek' ? [UD, ST] : [ST, MRNT];
  if (!allowed.includes(i.type)) return t('Invoice type not allowed for this Export type');
  if (i.entryNote) return t('Entry Note {en} storage invoices are in {exp}', {en:i.entryNote[0], exp:i.entryNote[1]});
  return null;
}
const vatStatus = id => INV[id].type === UD ? 'Not started' : 'Not required';
const required = () => S.inv.some(x => INV[x.id].type === UD);
const paperworkOnly = id => !(ship()?.physical || []).some(p => p === INV[id].o || p.startsWith(INV[id].o + '.'));

/* ------------------------------------------------------------------ Actions */
function initSet(g) { S.inv = g.sugg.map(([id, src, via]) => ({id, src, via})); S.edited = false; }
function applyScope(key) { S.scopeKey = key; const g = scope(); if (g) initSet(g); else { S.inv = []; S.edited = false; } }
function finishLookup() {
  if (S.forceLookup === 'loading') return;
  if (S.forceLookup === 'error') { S.lookup = 'error'; render(); return; }
  S.lookup = 'ready';
  const el = eligibleGroups();
  if (el.length === 1) applyScope(el[0].key);
  render();
}
function chooseShipment(id) {
  if (S.edited && S.scopeKey) { S.modal = {kind:'replace', then:() => chooseShipment2(id)}; render(); return; }
  chooseShipment2(id);
}
function chooseShipment2(id) {
  const body = document.querySelector('.scope-body');
  if (body) document.documentElement.style.setProperty('--scope-h', body.offsetHeight + 'px');
  S.ship = id; S.query = ''; S.popOpen = false; S.scopeKey = null; S.inv = []; S.edited = false; S.lookup = 'loading';
  delete S.errors.ship; render();
  setTimeout(finishLookup, 700);
}
function chooseScope(key) {
  if (key === S.scopeKey) return;
  if (S.edited && S.scopeKey) { S.modal = {kind:'replace', then:() => { applyScope(key); }}; render(); return; }
  applyScope(key); delete S.errors.scope; render();
}
function validate() {
  const e = {};
  if (!S.ship) e.ship = t('Select a Shipment.');
  else if (!S.scopeKey) e.scope = t('Select an Export scope.');
  const m = S.mrn.trim().toUpperCase();
  if (!m) e.mrn = t('Enter the MRN.');
  else if (!/^[A-Z0-9]{18}$/.test(m)) e.mrn = t('The MRN must be exactly 18 letters or digits.');
  else if (USED_MRN[m]) e.mrn = t('This MRN is already used by {exp}.', {exp:USED_MRN[m]});
  if (!S.mrnDate) e.mrnDate = t('Enter the MRN date.');
  else if (S.mrnDate > today) e.mrnDate = t('The MRN date cannot be later than today.');
  if (S.status === 'ie599') {
    if (!S.eadDate) e.ead = t('Enter the EAD receipt confirmation date.');
    else if (S.mrnDate && S.eadDate < S.mrnDate) e.ead = t('The EAD receipt confirmation date cannot be earlier than the MRN date.');
    else if (S.eadDate > today) e.ead = t('The EAD receipt confirmation date cannot be later than today.');
  }
  if (scope()?.kind === 'greek' && S.inv.length === 0) e.inv = t('Select at least one invoice for a Greek invoicing company Export.');
  return e;
}
const FIELD_TAB = {ship:['overview','f-ship'], scope:['overview','f-scope'], mrn:['overview','f-mrn'], mrnDate:['overview','f-mrndate'], ead:['overview','f-ead'], inv:['invoices','f-addinv']};
function create() {
  S.errors = validate(); S.banner = null;
  const first = Object.keys(FIELD_TAB).find(k => S.errors[k]);
  if (first) { S.tab = FIELD_TAB[first][0]; S.banner = {tone:'danger', text:t('Fix the highlighted fields to create the Export.')}; render(); focusId(FIELD_TAB[first][1]); return; }
  S.busy = true; render();
  setTimeout(() => {
    S.busy = false;
    if (S.outcome === 'duplicate') S.banner = {tone:'warning', text:t('An Export already exists for this group: {exp}. Your draft is kept.', {exp:'EXP-2049'}), open:'EXP-2049'};
    else if (S.outcome === 'error') S.banner = {tone:'danger', text:t('The Export could not be created. Nothing was saved and your draft is kept. Try again.')};
    else if (S.outcome === 'unknown') S.result = {kind:'unknown'};
    else S.result = {kind:'ok', exp:'EXP-2050', protocol: required() ? '1201 · ' + today : null, files:S.files.map((f, i) => ({name:f, st: i === 1 ? 'failed' : 'uploaded'}))};
    render(); focusId('page-title');
  }, 600);
}
function focusId(id) { requestAnimationFrame(() => document.getElementById(id)?.focus()); }

/* ------------------------------------------------------------------ Render: Overview */
function shipmentCard() {
  const s = ship(), q = S.query.trim().toLowerCase();
  const results = SHIP.filter(x => x.status !== 'Cancelled' && (!q || x.id.toLowerCase().includes(q) || (x.num || '').toLowerCase().includes(q)));
  const pop = S.popOpen ? `<ul class="popup" id="ship-pop" role="listbox" aria-label="${esc(t('Search Shipment'))}">${results.length ? results.map(x => `<li role="option" aria-selected="${x.id === S.ship}"><button type="button" class="opt-btn" data-act="pick-ship" data-id="${x.id}"><span class="opt-main">${esc(x.num ? t(x.doc) + ' · ' + x.num : t('Not recorded'))}</span><span class="opt-sub mono">${x.id} · ${esc(t(x.status))}</span></button></li>`).join('') : `<li class="opt-btn opt-sub">${esc(t('No matching Shipments. Cancelled Shipments are not shown.'))}</li>`}</ul>` : '';
  return `<section class="card nc" aria-labelledby="h-ship">${ncl('Shipment picker (FRO-347 picker pattern)')}<div class="card-header"><h2 class="card-title text-subheading" id="h-ship">${esc(t('Shipment relationship'))}${bn(1)}</h2></div><div class="card-body stack">
    <div class="field picker" data-picker="ship"><label class="label" for="f-ship">${esc(t('Search Shipment'))}</label>
      <div class="with-icon">${ic('search')}<input id="f-ship" class="control${S.errors.ship ? ' invalid' : ''}" role="combobox" aria-expanded="${S.popOpen}" aria-controls="ship-pop" autocomplete="off" placeholder="${esc(t('Search AWB, CMR, B/L or Shipment number…'))}" value="${esc(S.query)}" data-in="query" ${S.errors.ship ? 'aria-invalid="true" aria-describedby="e-ship"' : ''}></div>${pop}
      ${S.errors.ship ? `<span class="error" id="e-ship">${esc(S.errors.ship)}</span>` : ''}</div>
    <div class="grid3">${roField(t('Shipment number'), s ? link(s.id) : '')}${roField(t('Document type'), s ? esc(s.doc ? t(s.doc) : t('Not recorded')) : '')}${roField(t('Document number'), s ? (s.num ? `<span class="mono">${esc(s.num)}</span>` : esc(t('Not recorded'))) : '')}</div>
  </div></section>`;
}
function previewPanel(g) {
  const id = 'pv-' + g.key;
  return `<tr id="${id}"><td colspan="6" class="panel-cell"><div class="panel-inner"><p class="text-caption muted" style="margin:0 0 .5rem;font-weight:600">${esc(t('Suggested invoices'))}</p>${g.sugg.length ? `<div class="table-wrap"><table><thead><tr><th>${esc(t('Invoice number'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Linked Order'))}</th></tr></thead><tbody>${g.sugg.map(([i]) => `<tr><td>${link(i)}</td><td>${esc(CO[ORD[INV[i].o].s].name)}</td><td>${link(INV[i].o)}</td></tr>`).join('')}</tbody></table></div>` : `<p class="text-body-sm muted" style="margin:0">${esc(t('No invoices are suggested for this Export.'))}</p>`}</div></td></tr>`;
}
function scopeCard() {
  let body;
  if (!S.ship) body = `<p class="text-body-sm muted" style="margin:0">${esc(t('Select a Shipment to find its Exports.'))}</p>`;
  else if (S.lookup === 'loading') body = `<div class="loader" role="status"><span class="spinner" aria-hidden="true"></span><span class="sr-only">${esc(t('Finding Exports for this Shipment'))}</span></div>`;
  else if (S.lookup === 'error') body = alertBox('danger', 'alert', `${esc(t('Exports could not be loaded for this Shipment.'))} <button type="button" class="btn btn-secondary btn-sm" data-act="retry-lookup" style="margin-left:.5rem">${esc(t('Retry'))}</button>`, 'alert');
  else if (!groups().length) body = alertBox('info', 'info', esc(t('This Shipment has no participating Orders yet. Add Orders to the Shipment before preparing an Export.')));
  else {
    const many = eligibleGroups().length > 1 && !S.scopeKey;
    body = `${many ? `<p class="text-body-sm muted" style="margin:0 0 .75rem">${esc(t('Several Exports were found. Select the one to create.'))}</p>` : ''}<div class="table-wrap"><table><thead><tr><th>${esc(t('Export type'))}</th><th>${esc(t('Shipper'))}</th><th>${esc(t('Shipper ΑΦΜ'))}</th><th>${esc(t('Suggested invoices'))}</th><th>${esc(t('Action'))}</th><th><span class="sr-only">${esc(t('Preview invoices'))}</span></th></tr></thead><tbody>${groups().map(g => {
      const sh = shipper(g), sel = g.key === S.scopeKey, open = !!S.expanded[S.ship + g.key];
      let action;
      if (g.existing) action = `<button type="button" class="btn btn-secondary btn-sm" data-act="noop">${esc(t('Open existing Export'))}</button><div class="unavail">${esc(t('Already exists as {exp}.', {exp:g.existing}))}</div>`;
      else if (g.blocked) action = `<span class="pill tone-danger">${esc(t('Blocked'))}</span>`;
      else action = `<button type="button" class="btn ${sel ? 'btn-primary' : 'btn-secondary'} btn-sm" data-act="scope" data-key="${g.key}" aria-pressed="${sel}">${esc(t(sel ? 'Selected' : 'Select'))}</button>`;
      const row = `<tr class="${sel ? 'selected' : ''}"><td>${esc(t(g.kind === 'greek' ? 'Greek invoicing company' : 'Foreign invoicing company'))}</td><td>${esc(sh.name)}</td>${sh.vat ? `<td class="mono">${esc(sh.vat)}</td>` : `<td><span class="pill tone-danger">${esc(t('Missing value'))}</span></td>`}<td class="mono">${g.sugg.length}</td><td>${action}</td>
        <td class="cell-end"><button type="button" class="btn btn-ghost btn-sm toggle" data-act="expand" data-key="${g.key}" aria-expanded="${open}" aria-controls="pv-${g.key}" data-fid="tg-${g.key}">${esc(t('Preview invoices'))}${ic('chev')}</button></td></tr>`;
      const blockedRow = g.blocked ? `<tr><td colspan="6">${alertBox('danger', 'alert', S.lang === 'el' ? `Ο προμηθευτής ${esc(CO[g.blocked].name)} της ${'FL-DEMO-2404'} δεν έχει ΑΦΜ. Διορθώστε την εταιρεία για να προετοιμαστεί αυτή η εξαγωγή.` : `Supplier ${esc(CO[g.blocked].name)} on FL-DEMO-2404 has no ΑΦΜ. Correct the Company record to prepare this Export.`, 'note')}</td></tr>` : '';
      return row + blockedRow + (open ? previewPanel(g) : '');
    }).join('')}</tbody></table></div>`;
  }
  return `<section class="card nc" aria-labelledby="h-scope">${ncl('Export scope table with invoice preview')}<div class="card-header"><h2 class="card-title text-subheading" id="h-scope">${esc(t('Export scope'))}${bn(2)}${bn(3)}${bn(4)}${bn(5)}</h2></div><div class="card-body scope-body" id="f-scope" tabindex="-1" aria-busy="${S.lookup === 'loading'}">${body}${S.errors.scope ? `<p class="error" style="margin:.5rem 0 0">${esc(S.errors.scope)}</p>` : ''}</div></section>`;
}
function detailsCard() {
  const g = scope(), sh = shipper(g), err = S.errors;
  const fieldIn = (id, key, label, type, req, extra='') => `<div class="field"><label class="label" for="${id}">${esc(label)}${req ? '<span class="req">*</span>' : ''}</label><input id="${id}" class="control${err[key] ? ' invalid' : ''}${type === 'text' ? ' mono' : ''}" type="${type}" data-in="${key}" value="${esc(S[key === 'ead' ? 'eadDate' : key])}" ${err[key] ? `aria-invalid="true" aria-describedby="e-${id}"` : ''} ${extra}>${err[key] ? `<span class="error" id="e-${id}">${esc(err[key])}</span>` : ''}</div>`;
  const step = (i, label) => { const cur = S.status === 'ead' ? 0 : 1; const cls = i < cur ? 'done' : i === cur ? 'current' : ''; return `<li class="step ${cls}"${i === cur ? ' aria-current="step"' : ''}><span class="num">${i + 1}</span>${esc(t(label))}</li>`; };
  return `<section class="card" aria-labelledby="h-det"><div class="card-header"><h2 class="card-title text-subheading" id="h-det">${esc(t('Export details'))}${bn(6)}</h2></div><div class="card-body">
    <div class="grid3">${roField(t('Export type'), g ? esc(t(g.kind === 'greek' ? 'Greek invoicing company' : 'Foreign invoicing company')) : '')}${roField(t('Shipper'), sh ? esc(sh.name) : '')}${roField(t('Shipper ΑΦΜ'), sh ? `<span class="mono">${esc(sh.vat)}</span>` : '')}</div>
    <div class="grid3" style="margin-top:1rem">
      ${fieldIn('f-mrn', 'mrn', t('MRN'), 'text', true, `maxlength="24" autocomplete="off" spellcheck="false" placeholder="${esc(t('18 letters or digits'))}"`).replace('</label>', bn(7) + '</label>')}
      ${fieldIn('f-mrndate', 'mrnDate', t('MRN date'), 'date', true, `max="${today}"`)}
      <div class="field"><label class="label" for="f-vessel">${esc(t('Delivered vessel'))} <span class="opt">· ${esc(t('Optional'))}</span>${bn(8)}</label><select id="f-vessel" class="control" data-ch="vessel"><option value="">${esc(t('No vessel'))}</option>${VESSELS.map(v => `<option${v === S.vessel ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div>
    </div>
    <div class="status-block nc">${ncl('Customs status block (FRO-348 VAT status pattern)')}
      <div class="field status"><label class="label" for="f-status">${esc(t('Customs status'))}${bn(9)}</label><select id="f-status" class="control" data-ch="status" style="font-weight:600"><option value="ead"${S.status === 'ead' ? ' selected' : ''}>${esc(t('Awaiting EAD'))}</option><option value="ie599"${S.status === 'ie599' ? ' selected' : ''}>${esc(t('Awaiting IE599'))}</option></select></div>
      <ol class="stepper3" aria-label="${esc(t('Customs status'))}">${step(0, 'Awaiting EAD')}${step(1, 'Awaiting IE599')}${step(2, 'Completed')}</ol>
      <div class="dates2">
        ${S.status === 'ie599' ? fieldIn('f-ead', 'ead', t('EAD receipt confirmation date'), 'date', true, `min="${esc(S.mrnDate)}" max="${today}"`) : `<div class="field"><label class="label" for="f-ead">${esc(t('EAD receipt confirmation date'))}</label><input id="f-ead" class="control" type="date" disabled></div>`}
        <div class="field"><label class="label" for="f-ie599">${esc(t('Positive IE599 confirmation date'))}</label><input id="f-ie599" class="control" type="date" disabled></div>
      </div>
      ${S.status === 'ie599' ? `<p class="hint" style="margin:.75rem 0 0">${esc(t('Creating at Awaiting IE599 confirms EAD receipt in your name.'))}</p>` : ''}
    </div>
  </div></section>`;
}

/* ------------------------------------------------------------------ Render: invoices tab */
function addPicker(g) {
  const q = S.addQuery.trim().toLowerCase();
  const list = Object.keys(INV).filter(id => !q || id.toLowerCase().includes(q) || INV[id].o.toLowerCase().includes(q) || CO[ORD[INV[id].o].s].name.toLowerCase().includes(q));
  const pop = S.addOpen ? `<ul class="popup" id="inv-pop" role="listbox" aria-label="${esc(t('Add invoice'))}">${list.length ? list.map(id => { const r = invReason(id, g); return `<li role="option" aria-disabled="${!!r}"><button type="button" class="opt-btn" data-act="add-inv" data-id="${id}" aria-disabled="${!!r}"><span class="opt-main mono">${id}</span><span class="opt-sub">${esc(CO[ORD[INV[id].o].s].name)} · ${INV[id].o}</span>${r ? `<span class="opt-sub" style="color:var(--danger-fg)">${esc(r)}</span>` : ''}</button></li>`; }).join('') : `<li class="opt-btn opt-sub">${esc(t('No matching invoices.'))}</li>`}</ul>` : '';
  return `<div class="field picker nc" data-picker="inv">${ncl('Invoice picker with unavailable reasons')}<label class="label" for="f-addinv">${esc(t('Add invoice'))}${bn(10)}</label><div class="with-icon">${ic('search')}<input id="f-addinv" class="control${S.errors.inv ? ' invalid' : ''}" role="combobox" aria-expanded="${S.addOpen}" aria-controls="inv-pop" autocomplete="off" placeholder="${esc(t('Search invoice number, Supplier or Order…'))}" value="${esc(S.addQuery)}" data-in="addQuery" ${S.errors.inv ? 'aria-invalid="true" aria-describedby="e-inv"' : ''}></div>${pop}</div>`;
}
function invoicesTab() {
  const g = scope();
  if (!g) return `<div class="card card-pad"><p class="text-body-sm muted" style="margin:0">${esc(t('Select an Export scope to see its invoices.'))}</p></div>`;
  const rows = S.inv.map(x => { const i = INV[x.id], o = ORD[i.o];
    const src = x.src === 'direct' ? t('Direct · {o}', {o:x.via}) : x.src === 'ancestor' ? t('Ancestor of {o}', {o:x.via}) : t('Added');
    return `<tr><td>${link(x.id)}${paperworkOnly(x.id) ? ` <span class="badge tone-warning">${esc(t('Paperwork only'))}</span>` : ''}</td><td>${esc(CO[o.s].name)}</td><td>${link(i.o)}</td><td>${esc(i.type)}</td><td><span class="pill ${vatStatus(x.id) === 'Not started' ? 'tone-neutral' : 'tone-info'}">${esc(t(vatStatus(x.id)))}</span></td><td class="text-caption">${esc(src)}</td><td class="cell-end"><button type="button" class="btn btn-ghost btn-sm icon-btn" data-act="rm-inv" data-id="${x.id}" aria-label="${esc(t('Remove {inv}', {inv:x.id}))}" data-fid="rm-${x.id}">${ic('x')}</button></td></tr>`; }).join('');
  const orders = [...new Set(S.inv.map(x => INV[x.id].o))];
  const empty = g.kind === 'greek' ? t('No invoices selected. A Greek invoicing company Export needs at least one invoice.') : t('No invoices selected. A Foreign invoicing company Export can be created without invoices.');
  return `<div class="sections">
    <section class="card" aria-labelledby="h-inv"><div class="card-header"><div><h2 class="card-title text-subheading" id="h-inv">${esc(t('Supplier invoices'))}${bn(15)}</h2><p class="card-sub">${esc(t('The Informative List: invoices this Export declares.'))}</p></div></div><div class="card-body">
      <div class="add-row">${addPicker(g)}</div>
      ${S.errors.inv ? `<p class="error" id="e-inv" style="margin:0 0 .5rem">${esc(S.errors.inv)}</p>` : ''}
      ${S.inv.length ? `<div class="table-wrap"><table><thead><tr><th>${esc(t('Invoice number'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Linked Order'))}</th><th>${esc(t('Invoice type'))}</th><th>${esc(t('VAT exemption status'))}</th><th>${esc(t('Source'))}</th><th><span class="sr-only">${esc(t('Remove'))}</span></th></tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="empty-box">${esc(empty)}</div>`}
    </div></section>
    <section class="card nc" aria-labelledby="h-ord">${ncl('Connected Orders (derived, read-only)')}<div class="card-header"><div><h2 class="card-title text-subheading" id="h-ord">${esc(t('Connected Orders'))}${bn(11)}</h2><p class="card-sub">${esc(t('Derived from the selected invoices. Each Order appears once.'))}</p></div></div><div class="card-body">
      ${orders.length ? `<div class="table-wrap"><table style="table-layout:fixed;min-width:44rem"><thead><tr><th>${esc(t('Order'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Invoicing company'))}</th><th>${esc(t('Vessel'))}</th><th>${esc(t('Selected invoices'))}</th></tr></thead><tbody>${orders.map(oid => { const o = ORD[oid]; return `<tr><td>${link(oid)}</td><td>${esc(CO[o.s].name)}</td><td>${esc(CO[o.c].name)}</td><td>${o.v ? esc(o.v) : '—'}</td><td class="mono">${S.inv.filter(x => INV[x.id].o === oid).length}</td></tr>`; }).join('')}</tbody></table></div>` : `<div class="empty-box">${esc(t('No connected Orders.'))}</div>`}
    </div></section></div>`;
}

/* ------------------------------------------------------------------ Render: VAT and Documents */
function vatTab() {
  let body;
  if (!scope()) body = `<p class="text-body-sm muted" style="margin:0">${esc(t('Select an Export scope first.'))}</p>`;
  else if (!required()) body = alertBox('info', 'info', `<strong>${esc(t('VAT exemption procedure is not required'))}</strong><br><span class="text-body-sm">${esc(t('No selected invoice is of type Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).'))}</span>`);
  else body = `<div class="grid2" style="max-width:52rem">${roField(t('Protocol number · provisional'), esc(t('Assigned on creation')))}${roField(t('Protocol date · provisional'), esc(t('Assigned on creation')))}</div>`;
  return `<section class="card nc" aria-labelledby="h-vat">${ncl('VAT exemption protocol card')}<div class="card-header"><h2 class="card-title text-subheading" id="h-vat">${esc(t('VAT Exemption Protocol'))}${bn(12)}</h2></div><div class="card-body">${body}</div></section>`;
}
function docsTab() {
  return `<section class="card" aria-labelledby="h-docs"><div class="card-header"><div><h2 class="card-title text-subheading" id="h-docs">${esc(t('Attachments'))}${bn(13)}</h2><p class="card-sub">${esc(t('Documents for this Export. They upload after the Export is created.'))}</p></div><label class="btn btn-secondary btn-sm" for="f-files">${ic('clip')}${esc(t('Choose files'))}</label><input id="f-files" type="file" multiple class="sr-only" data-ch="files"></div><div class="card-body stack">
    <p class="hint" style="margin:0">${esc(t('PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV or TXT · up to 25 MB per file · nonempty files · filename 1–255 characters.'))}</p>
    ${S.files.length ? S.files.map((f, i) => `<div class="file-row"><div class="row-flex"><span class="file-icon">${ic('clip')}</span><div><div style="font-weight:600;overflow-wrap:anywhere">${esc(f)}</div><div class="text-caption muted">${esc(t('Staged file'))}</div></div></div><button type="button" class="btn btn-ghost btn-sm" data-act="rm-file" data-i="${i}">${esc(t('Remove'))}</button></div>`).join('') : `<div class="empty-box">${esc(t('No documents staged.'))}</div>`}
  </div></section>`;
}

/* ------------------------------------------------------------------ Render: result */
function resultView() {
  const r = S.result;
  if (r.kind === 'unknown') return `<section class="card card-pad stack">${alertBox('warning', 'alert', `<strong>${esc(t('We could not confirm whether the Export was created.'))}</strong><br>${esc(t('Check the original attempt before trying again. Your draft and staged files are kept.'))}`, 'alert')}<div><button type="button" class="btn btn-primary btn-md" data-act="check-attempt">${esc(t('Check original attempt'))}</button></div></section>`;
  const g = scope();
  return `<section class="card card-pad stack">${alertBox('success', 'ok', `<strong>${esc(t('Export {exp} created', {exp:r.exp}))}</strong>`)}
    <dl class="result-facts"><div><dt>${esc(t('Shipment number'))}</dt><dd class="mono">${esc(S.ship)}</dd></div><div><dt>${esc(t('Export type'))}</dt><dd>${esc(t(g.kind === 'greek' ? 'Greek invoicing company' : 'Foreign invoicing company'))}</dd></div><div><dt>${esc(t('MRN'))}</dt><dd class="mono">${esc(S.mrn.trim().toUpperCase())}</dd></div><div><dt>${esc(t('Customs status'))}</dt><dd>${esc(t(S.status === 'ead' ? 'Awaiting EAD' : 'Awaiting IE599'))}</dd></div><div><dt>${esc(t('Selected invoices'))}</dt><dd class="mono">${S.inv.length}</dd></div><div><dt>${esc(t('Protocol number'))}</dt><dd class="mono">${esc(r.protocol || t('None'))}</dd></div></dl>
    ${r.files.length ? `<div class="stack">${r.files.map((f, i) => `<div class="file-row"><div class="row-flex"><span class="file-icon">${ic('clip')}</span><span style="font-weight:600;overflow-wrap:anywhere">${esc(f.name)}</span></div><div class="row-flex"><span class="pill ${f.st === 'uploaded' ? 'tone-success' : 'tone-danger'}">${esc(t(f.st === 'uploaded' ? 'Uploaded' : 'Upload failed'))}</span>${f.st === 'failed' ? `<button type="button" class="btn btn-secondary btn-sm" data-act="retry-file" data-i="${i}">${esc(t('Retry'))}</button>` : ''}</div></div>`).join('')}</div>` : ''}
    <div><button type="button" class="btn btn-primary btn-md" data-act="noop">${esc(t('Open Export'))}</button></div></section>`;
}

/* ------------------------------------------------------------------ Render: page */
function modal() {
  if (!S.modal) return '';
  const rep = S.modal.kind === 'replace';
  return `<div class="scrim"><div class="scrim-bg" data-act="modal-no"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title" style="width:min(100%,32rem)"><div class="modal-head"><h2 class="text-subheading" id="m-title" style="margin:0">${esc(t(rep ? 'Replace the edited invoice selection?' : 'Discard this Export draft?'))}</h2></div><div class="modal-body"><p class="text-body" style="margin:0">${esc(t(rep ? 'You changed the selected invoices. Switching replaces them with the new suggestions. MRN, dates, vessel, Customs status and documents stay.' : 'Nothing has been saved. Your entries and staged files will be lost.'))}</p></div><div class="modal-foot"><button type="button" class="btn btn-secondary btn-md" data-act="modal-no" id="m-no">${esc(t(rep ? 'Keep current selection' : 'Keep editing'))}</button><button type="button" class="btn ${rep ? 'btn-primary' : 'btn-danger'} btn-md" data-act="modal-yes">${esc(t(rep ? 'Replace selection' : 'Discard draft'))}</button></div></div></div>`;
}
function tools() {
  const seg = (name, cur, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-act="${name}" data-v="${v}" aria-pressed="${cur === v}">${l}</button>`).join('')}</div>`;
  return `<details class="tools" ${params.get('tools') === '0' ? '' : 'open'}><summary>Preview controls</summary><div class="tools-body">
    <div><div class="label">Language</div>${seg('lang', S.lang, [['en','EN'],['el','EL']])}</div>
    <div><div class="label">State</div>${seg('state', state0, [['default','Default'],['loading','Loading'],['empty','Empty'],['error','Error']])}</div>
    <div><div class="label">Entry point</div>${seg('entry', params.get('shipment') ? 'ship' : 'list', [['list','Exports list'],['ship','Shipment SHP-DEMO-104']])}</div>
    <div><div class="label">Create outcome</div>${seg('outcome', S.outcome, [['success','Success'],['duplicate','Duplicate'],['unknown','Unknown'],['error','Error']])}</div>
    <div><div class="label">Annotations</div>${seg('ann', (S.nc ? 'nc' : '') + (S.notes ? 'bn' : ''), [['ncbn','All'],['nc','New components'],['','None']])}</div>
    <p class="text-caption muted" style="margin:0">Fixtures: 101 sole Greek Export with Υ.Δ. and ancestor invoice · 102 two Greek Exports · 103 storage invoice only (VAT Not required) · 104 mixed: existing, two foreign, one blocked · 105 Preparing, no document · 106 cancelled (hidden) · 107 no Orders. MRN 26GR0000000000DEMO is already used.</p>
  </div></details>`;
}
function notesPanel() {
  if (!S.notes) return '';
  return `<aside class="notes-panel" aria-label="Business notes"><div class="card-header"><h2 class="text-subheading" style="margin:0">Business notes</h2><button type="button" class="btn btn-ghost btn-sm icon-btn" data-act="close-notes" aria-label="Close notes">${ic('x')}</button></div><ol>${NOTES.map((n, i) => `<li id="note-${i + 1}" class="${S.hl === i + 1 ? 'hl' : ''}"><strong>${i + 1}.</strong> ${esc(n)}</li>`).join('')}</ol></aside>`;
}
function render() {
  const a = document.activeElement, fid = a && (a.dataset.fid || a.id), sel = a && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null;
  document.documentElement.lang = S.lang;
  document.body.classList.toggle('hide-nc', !S.nc);
  document.body.classList.toggle('hide-bn', !S.notes);
  document.getElementById('sim-banner').textContent = 'Static preview with fictional data. Nothing is saved. Styles from the production design system (main 5c51030).';
  const tabs = [['overview', t('Overview')], ['invoices', t('Supplier Invoices & Orders ({n})', {n:S.inv.length})], ['vat', t('VAT Exemption Protocol')], ['docs', t('Documents ({n})', {n:S.files.length})]];
  const panel = S.tab === 'overview' ? `<div class="sections">${shipmentCard()}${scopeCard()}${detailsCard()}</div>` : S.tab === 'invoices' ? invoicesTab() : S.tab === 'vat' ? vatTab() : docsTab();
  const banner = S.banner ? `<div style="margin-bottom:1rem">${alertBox(S.banner.tone, 'alert', esc(S.banner.text) + (S.banner.open ? ` <button type="button" class="btn btn-secondary btn-sm" data-act="noop" style="margin-left:.5rem">${esc(t('Open {exp}', {exp:S.banner.open}))}</button>` : ''), 'alert')}</div>` : '';
  const actions = S.result ? '' : `<div class="page-actions"><button type="button" class="btn btn-secondary btn-md" data-act="cancel">${esc(t('Cancel'))}</button><button type="button" class="btn btn-primary btn-md" data-act="create" ${S.busy || S.lookup === 'loading' ? 'disabled' : ''}>${esc(t(S.busy ? 'Creating…' : 'Create Export'))}</button>${bn(14)}</div>`;
  document.getElementById('app').innerHTML = `
  <header class="shell-header"><div class="shell-inner"><div class="row-flex"><span class="brand">Front Line</span><nav class="nav" aria-label="Main">${['Dashboard','Purchase orders','Shipments','Exports','Companies'].map(n => `<a href="#" data-act="noop"${n === 'Exports' ? ' aria-current="page"' : ''}>${esc(t(n))}</a>`).join('')}</nav></div><div class="lang">${['en','el'].map(l => `<button type="button" data-act="lang" data-v="${l}" aria-pressed="${S.lang === l}">${l.toUpperCase()}</button>`).join('')}</div></div></header>
  <main>
    <div class="topbar"><div><h1 class="text-title" id="page-title" tabindex="-1">${esc(t('Create Export'))}</h1><p class="text-body-sm muted" style="margin:.25rem 0 0;max-width:42rem">${esc(t('Prepare one Export Customs Declaration for a Shipment. Nothing is saved until you select Create Export.'))}</p></div>${actions}</div>
    ${banner}
    ${S.result ? resultView() : `<div class="tablist" role="tablist" aria-label="${esc(t('Create Export'))}">${tabs.map(([v, l]) => `<button type="button" role="tab" class="tab" id="tab-${v}" aria-selected="${S.tab === v}" aria-controls="panel-${v}" tabindex="${S.tab === v ? 0 : -1}" data-act="tab" data-v="${v}">${esc(l)}</button>`).join('')}</div>
    <div class="tabpanel" role="tabpanel" id="panel-${S.tab}" aria-labelledby="tab-${S.tab}">${panel}</div>`}
  </main>${modal()}${notesPanel()}${tools()}${S.toast ? `<div class="toast" role="status">${esc(S.toast)}</div>` : ''}`;
  if (fid) { const el = document.querySelector(`[data-fid="${fid}"]`) || document.getElementById(fid); if (el) { el.focus(); if (sel && 'setSelectionRange' in el) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
  if (S.modal) document.getElementById('m-no')?.focus();
}

/* ------------------------------------------------------------------ Events */
function setParam(k, v) { const p = new URLSearchParams(location.search); if (v == null) p.delete(k); else p.set(k, v); location.search = p.toString(); }
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!e.target.closest('[data-picker]')) { if (S.popOpen || S.addOpen) { S.popOpen = false; S.addOpen = false; if (!b) render(); } }
  if (e.target.id === 'f-ship' && !S.popOpen) { S.popOpen = true; render(); return; }
  if (e.target.id === 'f-addinv' && !S.addOpen) { S.addOpen = true; render(); return; }
  if (!b) return;
  const act = b.dataset.act;
  if (b.getAttribute('aria-disabled') === 'true') return;
  e.preventDefault();
  switch (act) {
    case 'noop': return;
    case 'lang': S.lang = b.dataset.v; break;
    case 'state': setParam('state', b.dataset.v === 'default' ? null : b.dataset.v); return;
    case 'entry': setParam('shipment', b.dataset.v === 'ship' ? 'SHP-DEMO-104' : null); return;
    case 'outcome': S.outcome = b.dataset.v; break;
    case 'ann': S.nc = b.dataset.v.includes('nc'); S.notes = b.dataset.v.includes('bn'); break;
    case 'note': S.notes = true; S.hl = +b.dataset.n; render(); document.getElementById('note-' + b.dataset.n)?.scrollIntoView({block:'nearest'}); return;
    case 'close-notes': S.notes = false; S.hl = null; break;
    case 'tab': S.tab = b.dataset.v; break;
    case 'pick-ship': S.popOpen = false; chooseShipment(b.dataset.id); return;
    case 'retry-lookup': S.forceLookup = null; chooseShipment2(S.ship); return;
    case 'scope': chooseScope(b.dataset.key); return;
    case 'expand': { const k = S.ship + b.dataset.key; S.expanded[k] = !S.expanded[k]; break; }
    case 'add-inv': S.inv.push({id:b.dataset.id, src:'added'}); S.edited = true; S.addOpen = false; S.addQuery = ''; delete S.errors.inv; render(); focusId('f-addinv'); return;
    case 'rm-inv': { const i = S.inv.findIndex(x => x.id === b.dataset.id); S.inv.splice(i, 1); S.edited = true; render(); const next = S.inv[i] || S.inv[i - 1]; focusId(next ? 'rm-' + next.id : 'f-addinv'); if (next) requestAnimationFrame(() => document.querySelector(`[data-fid="rm-${next.id}"]`)?.focus()); return; }
    case 'rm-file': S.files.splice(+b.dataset.i, 1); break;
    case 'create': create(); return;
    case 'cancel': if (S.ship || S.mrn || S.mrnDate || S.vessel || S.files.length || S.status !== 'ead') { S.modal = {kind:'discard'}; break; } S.toast = t('Draft discarded.'); break;
    case 'modal-no': S.modal = null; break;
    case 'modal-yes': { const m = S.modal; S.modal = null; if (m.kind === 'replace') { m.then(); } else { location.search = params.get('lang') ? 'lang=' + params.get('lang') : ''; return; } break; }
    case 'check-attempt': S.result = {kind:'ok', exp:'EXP-2050', protocol: required() ? '1201 · ' + today : null, files:S.files.map(f => ({name:f, st:'uploaded'}))}; break;
    case 'retry-file': S.result.files[+b.dataset.i].st = 'uploaded'; break;
  }
  render();
});
document.addEventListener('focusin', e => {
  if (e.target.id === 'f-ship' && !S.popOpen) { S.popOpen = true; render(); }
  if (e.target.id === 'f-addinv' && !S.addOpen) { S.addOpen = true; render(); }
  if (!e.target.closest('[data-picker="ship"]') && S.popOpen && !e.target.closest('.notes-panel')) { S.popOpen = false; render(); }
  if (!e.target.closest('[data-picker="inv"]') && S.addOpen) { S.addOpen = false; render(); }
});
document.addEventListener('input', e => {
  const k = e.target.dataset.in; if (!k) return;
  if (k === 'query') { S.query = e.target.value; S.popOpen = true; render(); return; }
  if (k === 'addQuery') { S.addQuery = e.target.value; S.addOpen = true; render(); return; }
  if (k === 'mrn') { S.mrn = e.target.value; return; }
  if (k === 'mrnDate') { S.mrnDate = e.target.value; return; }
  if (k === 'ead') { S.eadDate = e.target.value; return; }
});
document.addEventListener('change', e => {
  const k = e.target.dataset.ch || e.target.dataset.in; if (!k) return;
  if (k === 'mrn') { S.mrn = e.target.value.trim().toUpperCase(); render(); return; }
  if (k === 'vessel') S.vessel = e.target.value;
  if (k === 'status') { S.status = e.target.value; if (S.status === 'ead') { S.eadDate = ''; delete S.errors.ead; } }
  if (k === 'files') { for (const f of e.target.files) S.files.push(f.name); }
  render();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (S.modal) { S.modal = null; render(); return; }
    if (S.popOpen) { S.popOpen = false; render(); document.getElementById('f-ship')?.focus(); return; }
    if (S.addOpen) { S.addOpen = false; render(); document.getElementById('f-addinv')?.focus(); return; }
  }
  if (e.target.getAttribute('role') === 'tab' && ['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
    const order = ['overview','invoices','vat','docs']; let i = order.indexOf(S.tab);
    i = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (i + (e.key === 'ArrowRight' ? 1 : 3)) % 4;
    S.tab = order[i]; render(); document.getElementById('tab-' + S.tab)?.focus(); e.preventDefault();
  }
  if (e.key === 'ArrowDown' && (e.target.id === 'f-ship' || e.target.id === 'f-addinv')) { e.preventDefault(); document.querySelector((e.target.id === 'f-ship' ? '#ship-pop' : '#inv-pop') + ' .opt-btn')?.focus(); }
});

/* ------------------------------------------------------------------ Boot */
if (state0 === 'loading') { S.forceLookup = 'loading'; }
if (state0 === 'error') { S.forceLookup = 'error'; }
const pre = state0 === 'empty' ? 'SHP-DEMO-107' : (state0 === 'loading' || state0 === 'error') ? 'SHP-DEMO-101' : params.get('shipment');
render();
if (pre && SHIP.some(x => x.id === pre)) chooseShipment2(pre);
