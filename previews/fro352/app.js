'use strict';
/* FRO-352 Export details — static preview. Fixture data only; every operation is a browser-local simulation.
   Styles mirror frontline-forwarding-client DESIGN.md, theme.css and components/ui at main 5c51030. */

/* ------------------------------------------------------------------ Greek copy (proposed; confirm with the office) */
const EL = {
  'Dashboard':'Πίνακας ελέγχου','Purchase orders':'Παραγγελίες αγοράς','Shipments':'Αποστολές','Exports':'Εξαγωγές','Companies':'Εταιρείες',
  'Export {id}':'Εξαγωγή {id}','Cancel Export':'Ακύρωση εξαγωγής','Cancelled':'Ακυρώθηκε',
  'Overview':'Επισκόπηση','Supplier Invoices & Orders ({n})':'Τιμολόγια προμηθευτών και παραγγελίες ({n})',
  'VAT Exemption Protocol':'Πρωτόκολλο απαλλαγής ΦΠΑ','Documents ({n})':'Έγγραφα ({n})',
  'Shipment relationship':'Σύνδεση με αποστολή','Shipment number':'Αριθμός αποστολής','Document type':'Τύπος εγγράφου','Document number':'Αριθμός εγγράφου',
  'Not recorded':'Δεν καταχωρίστηκε','Air Waybill (AWB)':'Αεροπορική φορτωτική (AWB)','Bill of Lading (B/L)':'Φορτωτική (B/L)','CMR':'CMR',
  'Export details':'Στοιχεία εξαγωγής','Export type':'Τύπος εξαγωγής','Shipper':'Αποστολέας','Shipper ΑΦΜ':'ΑΦΜ αποστολέα','Invoicing company':'Εταιρεία τιμολόγησης',
  'Greek invoicing company':'Ελληνική εταιρεία τιμολόγησης','Foreign invoicing company':'Εταιρεία τιμολόγησης εξωτερικού',
  'MRN':'MRN','MRN date':'Ημερομηνία MRN','Delivered vessel':'Πλοίο παράδοσης','Optional':'Προαιρετικό','No vessel':'Χωρίς πλοίο','18 letters or digits':'18 γράμματα ή ψηφία',
  'Edit':'Επεξεργασία','Save':'Αποθήκευση','Saving…':'Αποθήκευση…','Cancel':'Άκυρο',
  'MRN, MRN date and Delivered vessel are locked after EAD receipt is confirmed. Changes need an audited correction.':'Το MRN, η ημερομηνία MRN και το πλοίο παράδοσης κλειδώνουν μετά την επιβεβαίωση παραλαβής EAD. Οι αλλαγές απαιτούν ελεγχόμενη διόρθωση.',
  'Customs status':'Κατάσταση τελωνείου','Awaiting EAD':'Αναμονή EAD','Awaiting IE599':'Αναμονή IE599','Completed':'Ολοκληρώθηκε',
  'EAD receipt confirmation date':'Ημερομηνία επιβεβαίωσης παραλαβής EAD','Positive IE599 confirmation date':'Ημερομηνία επιβεβαίωσης θετικού IE599',
  'Confirmed by {u} · {at}':'Επιβεβαιώθηκε από {u} · {at}',
  'Confirm EAD receipt':'Επιβεβαίωση παραλαβής EAD','Confirm positive IE599':'Επιβεβαίωση θετικού IE599','Confirm':'Επιβεβαίωση',
  'Save or cancel the current edit before confirming a Customs event.':'Αποθηκεύστε ή ακυρώστε την τρέχουσα επεξεργασία πριν επιβεβαιώσετε τελωνειακό γεγονός.',
  'Confirming records the date in your name and moves the Export to the next Customs status.':'Η επιβεβαίωση καταγράφει την ημερομηνία στο όνομά σας και μεταφέρει την εξαγωγή στην επόμενη τελωνειακή κατάσταση.',
  'Confirm only a positive, verified IE599 (confirmed exit).':'Επιβεβαιώστε μόνο θετικό, επαληθευμένο IE599 (επιβεβαιωμένη έξοδος).',
  'Enter the EAD receipt confirmation date.':'Συμπληρώστε την ημερομηνία επιβεβαίωσης παραλαβής EAD.',
  'The EAD receipt confirmation date cannot be earlier than the MRN date.':'Η ημερομηνία επιβεβαίωσης παραλαβής EAD δεν μπορεί να είναι προγενέστερη της ημερομηνίας MRN.',
  'The EAD receipt confirmation date cannot be later than today.':'Η ημερομηνία επιβεβαίωσης παραλαβής EAD δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'Enter the positive IE599 confirmation date.':'Συμπληρώστε την ημερομηνία επιβεβαίωσης θετικού IE599.',
  'The positive IE599 confirmation date cannot be earlier than the EAD receipt confirmation date.':'Η ημερομηνία επιβεβαίωσης θετικού IE599 δεν μπορεί να είναι προγενέστερη της ημερομηνίας επιβεβαίωσης παραλαβής EAD.',
  'The positive IE599 confirmation date cannot be later than today.':'Η ημερομηνία επιβεβαίωσης θετικού IE599 δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'The confirmation could not be recorded. Nothing changed. Your date is kept.':'Δεν ήταν δυνατή η καταγραφή της επιβεβαίωσης. Δεν άλλαξε τίποτα. Η ημερομηνία σας διατηρείται.',
  'Enter the MRN.':'Συμπληρώστε το MRN.','The MRN must be exactly 18 letters or digits.':'Το MRN πρέπει να έχει ακριβώς 18 γράμματα ή ψηφία.',
  'This MRN is already used by {exp}.':'Αυτό το MRN χρησιμοποιείται ήδη από την {exp}.','Enter the MRN date.':'Συμπληρώστε την ημερομηνία MRN.',
  'The MRN date cannot be later than today.':'Η ημερομηνία MRN δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'Changes could not be saved. Nothing changed. Your edits are kept.':'Δεν ήταν δυνατή η αποθήκευση. Δεν άλλαξε τίποτα. Οι αλλαγές σας διατηρούνται.',
  'This Export changed since you opened it. Refresh to review the latest version. Your edits are kept.':'Η εξαγωγή άλλαξε από τότε που την ανοίξατε. Ανανεώστε για να δείτε την τελευταία έκδοση. Οι αλλαγές σας διατηρούνται.',
  'Refresh':'Ανανέωση','Changes saved.':'Οι αλλαγές αποθηκεύτηκαν.',
  'Supplier invoices':'Τιμολόγια προμηθευτών','Connected Orders':'Συνδεδεμένες παραγγελίες',
  'The Informative List: invoices this Export declares.':'Η Πληροφοριακή κατάσταση: τα τιμολόγια που δηλώνει αυτή η εξαγωγή.',
  'Derived from the invoices. Each Order appears once.':'Προκύπτουν από τα τιμολόγια. Κάθε παραγγελία εμφανίζεται μία φορά.',
  'Add invoice':'Προσθήκη τιμολογίου','Search invoice number, Supplier or Order…':'Αναζήτηση αριθμού τιμολογίου, προμηθευτή ή παραγγελίας…',
  'Invoice number':'Αριθμός τιμολογίου','Supplier':'Προμηθευτής','Linked Order':'Συνδεδεμένη παραγγελία','Invoice type':'Τύπος τιμολογίου','VAT exemption status':'Κατάσταση απαλλαγής ΦΠΑ',
  'Remove':'Αφαίρεση','Remove {inv}':'Αφαίρεση {inv}','Paperwork only':'Μόνο έγγραφα','New':'Νέο',
  'Not started':'Δεν ξεκίνησε','In progress':'Σε εξέλιξη','Exempted':'Απαλλάχθηκε','Not required':'Δεν απαιτείται',
  'Saved invoices stay on this Export after EAD receipt. You can only add invoices.':'Τα αποθηκευμένα τιμολόγια παραμένουν στην εξαγωγή μετά την παραλαβή EAD. Μπορείτε μόνο να προσθέσετε τιμολόγια.',
  'No invoices on this Export.':'Δεν υπάρχουν τιμολόγια σε αυτή την εξαγωγή.',
  'Select at least one invoice for a Greek invoicing company Export.':'Επιλέξτε τουλάχιστον ένα τιμολόγιο για εξαγωγή ελληνικής εταιρείας τιμολόγησης.',
  'No connected Orders.':'Δεν υπάρχουν συνδεδεμένες παραγγελίες.','Order':'Παραγγελία','Vessel':'Πλοίο','Invoices':'Τιμολόγια','No matching invoices.':'Δεν βρέθηκαν τιμολόγια.',
  'Already on this Export':'Υπάρχει ήδη στην εξαγωγή','Cancelled invoice':'Ακυρωμένο τιμολόγιο','In {exp}':'Σε {exp}','Different Invoicing company':'Διαφορετική εταιρεία τιμολόγησης',
  'Different Supplier':'Διαφορετικός προμηθευτής','Invoice type not allowed for this Export type':'Ο τύπος τιμολογίου δεν επιτρέπεται για αυτόν τον τύπο εξαγωγής',
  'Entry Note {en} storage invoices are in {exp}':'Τα τιμολόγια αποθήκευσης του δελτίου εισόδου {en} βρίσκονται στην {exp}',
  'Protocol Details':'Στοιχεία πρωτοκόλλου','Protocol number':'Αριθμός πρωτοκόλλου','Protocol date':'Ημερομηνία πρωτοκόλλου','Print ΥΔ':'Εκτύπωση ΥΔ',
  'VAT exemption procedure is not required':'Η διαδικασία απαλλαγής ΦΠΑ δεν απαιτείται',
  'No invoice on this Export is of type Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).':'Κανένα τιμολόγιο της εξαγωγής δεν είναι τύπου Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).',
  'This protocol was assigned to an earlier invoice selection and stays with the Export.':'Ο αριθμός πρωτοκόλλου αποδόθηκε σε προηγούμενη επιλογή τιμολογίων και παραμένει στην εξαγωγή.',
  'VAT Exemption Procedure':'Διαδικασία απαλλαγής ΦΠΑ','Ready for stamping':'Έτοιμα για σφράγιση','Awaiting stamped return':'Αναμονή επιστροφής σφραγισμένων','Exempted invoices':'Απαλλαγμένα τιμολόγια',
  'Stamping starts after positive IE599 is confirmed (Customs status Completed).':'Η σφράγιση ξεκινά μετά την επιβεβαίωση θετικού IE599 (κατάσταση τελωνείου Ολοκληρώθηκε).',
  'Stamping dispatch date':'Ημερομηνία αποστολής για σφράγιση','Stamping return date':'Ημερομηνία επιστροφής σφραγισμένων','Stamped paperwork sent to recipient date':'Ημερομηνία αποστολής σφραγισμένων στον παραλήπτη',
  'Select all eligible':'Επιλογή όλων των διαθέσιμων','Clear selection':'Καθαρισμός επιλογής','{n} selected':'{n} επιλεγμένα',
  'Record dispatch for stamping':'Καταγραφή αποστολής για σφράγιση','Record stamped papers returned':'Καταγραφή επιστροφής σφραγισμένων','Record paperwork sent to recipient':'Καταγραφή αποστολής εγγράφων στον παραλήπτη',
  'No invoices are waiting for dispatch.':'Δεν υπάρχουν τιμολόγια σε αναμονή αποστολής.','No invoices are awaiting stamped return.':'Δεν υπάρχουν τιμολόγια σε αναμονή επιστροφής.','No invoice is exempted yet.':'Δεν υπάρχει ακόμη απαλλαγμένο τιμολόγιο.',
  'Select {inv}':'Επιλογή {inv}','Dispatch date':'Ημερομηνία αποστολής','Return date':'Ημερομηνία επιστροφής','Sending date':'Ημερομηνία αποστολής στον παραλήπτη',
  'Selected invoices':'Επιλεγμένα τιμολόγια','Enter the date.':'Συμπληρώστε την ημερομηνία.','The date cannot be later than today.':'Η ημερομηνία δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'The date cannot be earlier than {d} ({inv}).':'Η ημερομηνία δεν μπορεί να είναι προγενέστερη της {d} ({inv}).',
  'The dates could not be recorded. Nothing changed. Your selection and date are kept.':'Δεν ήταν δυνατή η καταγραφή. Δεν άλλαξε τίποτα. Η επιλογή και η ημερομηνία σας διατηρούνται.',
  'Recorded for {n} invoice(s).':'Καταγράφηκε για {n} τιμολόγιο(-α).','Invoice date':'Ημερομηνία τιμολογίου',
  'Select invoices':'Επιλογή τιμολογίων','Template':'Πρότυπο','Generate ΥΔ':'Δημιουργία ΥΔ',
  'Αερολιμένας Ελ. Βενιζέλος':'Αερολιμένας Ελ. Βενιζέλος','Α΄ Τελωνείο Πειραιά':'Α΄ Τελωνείο Πειραιά','Γ΄ Τελωνείο Πειραιά':'Γ΄ Τελωνείο Πειραιά',
  'Select at least one invoice.':'Επιλέξτε τουλάχιστον ένα τιμολόγιο.','Select a template.':'Επιλέξτε πρότυπο.',
  'One document per Invoicing company and Supplier, up to five invoices each.':'Ένα έγγραφο ανά εταιρεία τιμολόγησης και προμηθευτή, έως πέντε τιμολόγια το καθένα.',
  '{n} documents ready':'{n} έγγραφα έτοιμα','Open PDF':'Άνοιγμα PDF','Close':'Κλείσιμο','{n} invoices':'{n} τιμολόγια',
  'Preview only: no PDF is generated here.':'Μόνο προεπισκόπηση: δεν δημιουργείται PDF εδώ.',
  'Cancel this Export?':'Ακύρωση αυτής της εξαγωγής;','Reason':'Αιτιολογία',
  'The Export becomes read-only. Its invoices become available for other Exports. The MRN stays reserved and any protocol number is kept.':'Η εξαγωγή γίνεται μόνο για ανάγνωση. Τα τιμολόγιά της γίνονται διαθέσιμα για άλλες εξαγωγές. Το MRN παραμένει δεσμευμένο και ο αριθμός πρωτοκόλλου διατηρείται.',
  'Enter a reason.':'Συμπληρώστε αιτιολογία.','Keep Export':'Διατήρηση εξαγωγής',
  'This Export was cancelled':'Η εξαγωγή ακυρώθηκε','Cancelled by {u} · {at}':'Ακυρώθηκε από {u} · {at}',
  'Attachments':'Συνημμένα','Upload documents':'Μεταφόρτωση εγγράφων','Download':'Λήψη','Uploading…':'Μεταφόρτωση…','Upload failed':'Αποτυχία μεταφόρτωσης','Retry':'Επανάληψη',
  'PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV or TXT · up to 25 MB per file · nonempty files · filename 1–255 characters.':'PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV ή TXT · έως 25 MB ανά αρχείο · μη κενά αρχεία · όνομα 1–255 χαρακτήρες.',
  'No documents on this Export.':'Δεν υπάρχουν έγγραφα σε αυτή την εξαγωγή.','Uploaded by {u} · {d}':'Ανέβηκε από {u} · {d}',
  'Saved documents are kept as evidence after EAD receipt. They cannot be removed.':'Τα αποθηκευμένα έγγραφα διατηρούνται ως τεκμήρια μετά την παραλαβή EAD. Δεν μπορούν να αφαιρεθούν.',
  'Remove this document?':'Αφαίρεση αυτού του εγγράφου;','{f} will be removed from this Export.':'Το {f} θα αφαιρεθεί από αυτή την εξαγωγή.','Keep document':'Διατήρηση εγγράφου',
  'File type not supported.':'Μη υποστηριζόμενος τύπος αρχείου.','The file is empty.':'Το αρχείο είναι κενό.','The file is larger than 25 MB.':'Το αρχείο υπερβαίνει τα 25 MB.',
  'The filename is longer than 255 characters.':'Το όνομα αρχείου υπερβαίνει τους 255 χαρακτήρες.',
  'Loading Export':'Φόρτωση εξαγωγής','The Export could not be loaded.':'Δεν ήταν δυνατή η φόρτωση της εξαγωγής.',
  'Export not found.':'Η εξαγωγή δεν βρέθηκε.','You do not have access to Exports.':'Δεν έχετε πρόσβαση στις εξαγωγές.'
};

/* ------------------------------------------------------------------ Fixtures (fictional) */
const CO = {
  c1:{name:'Aegean Demo Trading Α.Ε.', vat:'099000101'}, c2:{name:'Ionian Demo Shipping Μ.Ε.Π.Ε.', vat:'099000202'},
  c3:{name:'Demo Marine Services Ltd', vat:'CY99000303X'}, s1:{name:'Demo Hellas Supplies Α.Ε.', vat:'099000404'},
  s2:{name:'Piraeus Demo Parts Ο.Ε.', vat:'099000505'}
};
const VESSELS = ['MV Demo Aurora','MV Demo Boreas','MT Demo Calypso','MV Demo Delphi'];
const ORD = {
  'FL-DEMO-2101':{s:'s1',c:'c1',v:'MV Demo Aurora'}, 'FL-DEMO-2102':{s:'s2',c:'c1',v:'MV Demo Aurora'}, 'FL-DEMO-2103':{s:'s1',c:'c1',v:'MV Demo Boreas'},
  'FL-DEMO-2104':{s:'s2',c:'c1',v:''}, 'FL-DEMO-2105':{s:'s1',c:'c1',v:'MV Demo Aurora'}, 'FL-DEMO-2106':{s:'s1',c:'c1',v:'MV Demo Boreas'},
  'FL-DEMO-2107':{s:'s2',c:'c1',v:'MV Demo Aurora'}, 'FL-DEMO-2201':{s:'s1',c:'c2',v:'MT Demo Calypso'}, 'FL-DEMO-2202':{s:'s2',c:'c2',v:'MT Demo Calypso'},
  'FL-DEMO-2301':{s:'s1',c:'c2',v:'MT Demo Calypso'}, 'FL-DEMO-2401':{s:'s1',c:'c3',v:'MV Demo Delphi'}, 'FL-DEMO-2403':{s:'s2',c:'c3',v:'MV Demo Delphi'},
  'FL-DEMO-2501':{s:'s1',c:'c3',v:''}
};
const UD='Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.)', ST='Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)', MRNT='Greek Supplier – Foreign Recipient (MRN)';
const mk = (o, type, extra={}) => Object.assign({o, type, date:'2026-10-05', st: type === UD ? 'Not started' : 'Not required', disp:'', ret:'', sent:''}, extra);
const INV = {
  'SI-DEMO-501':mk('FL-DEMO-2101',UD), 'SI-DEMO-502':mk('FL-DEMO-2102',ST), 'SI-DEMO-503':mk('FL-DEMO-2103',UD), 'SI-DEMO-504':mk('FL-DEMO-2104',UD),
  'SI-DEMO-505':mk('FL-DEMO-2201',UD), 'SI-DEMO-506':mk('FL-DEMO-2202',ST), 'SI-DEMO-507':mk('FL-DEMO-2301',ST), 'SI-DEMO-508':mk('FL-DEMO-2401',MRNT),
  'SI-DEMO-509':mk('FL-DEMO-2401',ST), 'SI-DEMO-510':mk('FL-DEMO-2501',MRNT), 'SI-DEMO-511':mk('FL-DEMO-2105',UD), 'SI-DEMO-512':mk('FL-DEMO-2201',ST),
  'SI-DEMO-513':mk('FL-DEMO-2105',UD,{cancelled:true}), 'SI-DEMO-515':mk('FL-DEMO-2107',ST,{entryNote:['EN-DEMO-77','EXP-2040']}),
  'SI-DEMO-516':mk('FL-DEMO-2106',UD,{date:'2026-10-12'}), 'SI-DEMO-520':mk('FL-DEMO-2105',UD,{st:'In progress', disp:'2026-10-17'}),
  'SI-DEMO-521':mk('FL-DEMO-2104',UD,{st:'Exempted', disp:'2026-10-16', ret:'2026-10-20'}), 'SI-DEMO-522':mk('FL-DEMO-2104',UD,{st:'Exempted', disp:'2026-10-16', ret:'2026-10-21', sent:'2026-10-22'}),
  'SI-DEMO-523':mk('FL-DEMO-2107',ST), 'SI-DEMO-524':mk('FL-DEMO-2403',MRNT)
};
const SHIP = {
  'SHP-DEMO-101':{doc:'Bill of Lading (B/L)', num:'DEMO-101', physical:['FL-DEMO-2101','FL-DEMO-2102','FL-DEMO-2103.1.1']},
  'SHP-DEMO-102':{doc:'Air Waybill (AWB)', num:'999-00000102', physical:['FL-DEMO-2201','FL-DEMO-2202']},
  'SHP-DEMO-104':{doc:'Bill of Lading (B/L)', num:'DEMO-104', physical:['FL-DEMO-2401','FL-DEMO-2403']},
  'SHP-DEMO-108':{doc:null, num:null, physical:['FL-DEMO-2104','FL-DEMO-2105','FL-DEMO-2106','FL-DEMO-2107']}
};
const file = (name, size, d, u) => ({name, size, d, u, st:'saved'});
const EXPORTS = {
  'EXP-2050':{ship:'SHP-DEMO-101', kind:'greek', c:'c1', mrn:'26GR10000000000501', mrnDate:'2026-10-14', vessel:'', customs:'ead', ead:null, ie599:null,
    inv:['SI-DEMO-501','SI-DEMO-502','SI-DEMO-503'], protocol:{n:'1201', d:'2026-10-14'}, files:[file('EAD-request-DEMO-101.pdf','214 KB','2026-10-14','K. Demo')]},
  'EXP-2051':{ship:'SHP-DEMO-102', kind:'greek', c:'c2', mrn:'26GR10000000000502', mrnDate:'2026-10-15', vessel:'MT Demo Calypso', customs:'ie599',
    ead:{d:'2026-10-16', u:'K. Demo', at:'2026-10-16 09:12'}, ie599:null, inv:['SI-DEMO-505','SI-DEMO-506'], protocol:{n:'1202', d:'2026-10-15'},
    files:[file('EAD-DEMO-102.pdf','188 KB','2026-10-16','K. Demo')]},
  'EXP-2052':{ship:'SHP-DEMO-108', kind:'greek', c:'c1', mrn:'26GR10000000000503', mrnDate:'2026-10-06', vessel:'MV Demo Aurora', customs:'done',
    ead:{d:'2026-10-08', u:'K. Demo', at:'2026-10-08 11:40'}, ie599:{d:'2026-10-15', u:'M. Demo', at:'2026-10-15 16:05'},
    inv:['SI-DEMO-516','SI-DEMO-520','SI-DEMO-521','SI-DEMO-522','SI-DEMO-523'], protocol:{n:'1198', d:'2026-10-06'},
    files:[file('EAD-DEMO-108.pdf','176 KB','2026-10-08','K. Demo'), file('IE599-DEMO-108.pdf','92 KB','2026-10-15','M. Demo')]},
  'EXP-2053':{ship:'SHP-DEMO-104', kind:'foreign', c:'c3', s:'s1', mrn:'26GR10000000000504', mrnDate:'2026-10-19', vessel:'', customs:'ead', ead:null, ie599:null,
    inv:['SI-DEMO-508','SI-DEMO-509'], protocol:null, files:[]},
  'EXP-2054':{ship:'SHP-DEMO-104', kind:'foreign', c:'c3', s:'s2', mrn:'26GR10000000000505', mrnDate:'2026-10-18', vessel:'MV Demo Delphi', customs:'ie599',
    ead:{d:'2026-10-19', u:'M. Demo', at:'2026-10-19 10:02'}, ie599:null, inv:[], protocol:null, files:[]},
  'EXP-2049':{ship:'SHP-DEMO-101', kind:'greek', c:'c1', mrn:'26GR10000000000499', mrnDate:'2026-10-12', vessel:'', customs:'ead', ead:null, ie599:null,
    inv:['SI-DEMO-501'], protocol:null, files:[file('EAD-request-old.pdf','201 KB','2026-10-12','K. Demo')],
    cancelled:{reason:'Created with the wrong Invoicing company. Recreated as EXP-2050.', u:'A. Demo', at:'2026-10-13 10:42'}}
};
const ASSIGNED = {'SI-DEMO-511':'EXP-2038'};
for (const [id, x] of Object.entries(EXPORTS)) if (!x.cancelled) x.inv.forEach(i => ASSIGNED[i] = id);
const ME = 'M. Demo';
const FIXTURE_HELP = '2050 Greek · Awaiting EAD · Υ.Δ. + storage · 2051 Greek · Awaiting IE599 · 2052 Greek · Completed · stamping stages · 2053 Foreign · Awaiting EAD · VAT not required · 2054 Foreign · Awaiting IE599 · no invoices · 2049 Cancelled.';

/* ------------------------------------------------------------------ Business notes */
const NOTES = [
  'Shipment number, Document type and Document number come from the linked Shipment and stay Shipment-owned. The Shipment cannot be changed on a saved Export.',
  'Export type, Shipper and Shipper ΑΦΜ are the saved fiscal identity (FRO-317). Shipper = Invoicing company (Greek) or Supplier (foreign). Foreign Exports also show the foreign Invoicing company. Company master-data changes never regroup a saved Export.',
  'Edit is available only at Awaiting EAD and changes only MRN, MRN date and Delivered vessel. MRN: 18 letters or digits, upper case, unique including cancelled Exports. MRN date not later than today. Delivered vessel: any Vessel, optional, never inherited.',
  'Customs status changes only through the two confirmation events. Each records the date, the user and the time together. EAD date: between the MRN date and today. Positive IE599 date: between the EAD date and today. No reference, checkbox or attachment is required.',
  'Supplier invoices = the Informative List. Awaiting EAD: add and remove (Greek Exports keep at least one). Awaiting IE599 and Completed: add only; saved invoices are locked. Every save is rechecked on the server.',
  'Add invoice lists every match; unavailable invoices show why (already on this or another Export, cancelled, different Invoicing company or Supplier, type not allowed for the Export type, Entry Note storage invoices in another Export).',
  'Paperwork only: the invoice’s Order has no collis in this Shipment. It adds its Order to Connected Orders but no goods to the Shipment.',
  'Connected Orders are derived from the invoices: each invoice’s actual linked Order, once. Never all Shipment Orders.',
  'Protocol number/date are assigned by the system when the VAT procedure is first required (a Υ.Δ. invoice is on the Export) and never change or get reused. If the procedure later lapses, the number stays.',
  'Print ΥΔ: choose Υ.Δ. invoices of this Export and one of the three templates. One PDF per Invoicing company + Supplier, up to five invoices each. Printing never changes statuses, membership or protocol. Available at all three Customs stages; not on cancelled Exports.',
  'Stamping actions are bulk shortcuts over the invoice-owned events (FRO-321). They appear only after positive IE599 (Completed), only for Υ.Δ. invoices. Dispatch → In progress; stamped return → Exempted; sending to recipient keeps Exempted. Dates not later than today and in order per invoice.',
  'Each stamping section has its own selection. Selecting never changes the Informative List. A failed confirmation keeps the selection and date.',
  'Documents: upload and download at every stage; remove only at Awaiting EAD, after confirmation. File rules from FRO-347. Adding a document never confirms a Customs or stamping event.',
  'Cancel Export: managers and system administrators, only at Awaiting EAD with no recorded customs event. Reason required (up to 1,000 characters). The Export becomes read-only; its invoices are released; the MRN stays reserved; any protocol is kept.'
];

/* ------------------------------------------------------------------ State */
const params = new URLSearchParams(location.search);
const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Athens'}).format(new Date());
const state0 = params.get('state') || 'default';
const S = {
  lang: params.get('lang') === 'el' ? 'el' : 'en', tab: params.get('tab') || 'overview', id: EXPORTS[params.get('export')] ? params.get('export') : 'EXP-2050',
  role: ['operator','manager','viewer'].includes(params.get('role')) ? params.get('role') : 'manager',
  fail: params.get('fail') || 'none', det: null, invEd: null, modal: null, sel: {disp:[], ret:[], send:[]}, uploads: [],
  notes: params.get('notes') === '1', nc: true, hl: null, toast: null, busy: false
};
const X = () => EXPORTS[S.id];

/* ------------------------------------------------------------------ Helpers */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function t(s, v) { let r = S.lang === 'el' ? (EL[s] ?? s) : s; if (v) for (const k in v) r = r.split('{'+k+'}').join(v[k]); return r; }
const ICON = {
  search:'<path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  clip:'<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  alert:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>', ok:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/>', plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  print:'<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  down:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>', dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>'
};
const ic = (n, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const bn = n => `<button type="button" class="bn" data-act="note" data-n="${n}" aria-label="Business note ${n}">${n}</button>`;
const ncl = txt => `<p class="nc-label">New component — ${esc(txt)}</p>`;
const link = txt => `<a class="link mono" href="#" data-act="noop">${esc(txt)}</a>`;
const roField = (label, value, cls='') => `<div class="field"><span class="label">${esc(label)}</span><div class="ro${value ? '' : ' empty'} ${cls}">${value || '—'}</div></div>`;
const alertBox = (tone, icon, html, role='status') => `<div class="alert tone-${tone}" role="${role}">${ic(icon)}<div>${html}</div></div>`;
const fmt = d => { if (!d) return ''; const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };
const customsLabel = c => ({ead:'Awaiting EAD', ie599:'Awaiting IE599', done:'Completed'})[c];
const customsTone = c => ({ead:'tone-warning', ie599:'tone-info', done:'tone-success'})[c];
const shipperId = x => x.kind === 'greek' ? x.c : x.s;
const canEdit = () => S.role !== 'viewer' && !X().cancelled;
const canCancel = () => S.role === 'manager' && !X().cancelled && X().customs === 'ead';
const editing = () => !!(S.det || S.invEd);
const paperworkOnly = id => !SHIP[X().ship].physical.some(p => p === INV[id].o || p.startsWith(INV[id].o + '.'));
const udOn = list => list.filter(id => INV[id].type === UD);
const vatPill = st => `<span class="pill ${({'Not started':'tone-neutral','In progress':'tone-warning','Exempted':'tone-success','Not required':'tone-info'})[st]}">${esc(t(st))}</span>`;
function focusId(id) { setTimeout(() => (document.querySelector(`[data-fid="${id}"]`) || document.getElementById(id))?.focus(), 0); }
function toast(msg) { S.toast = msg; clearTimeout(toast.t); toast.t = setTimeout(() => { S.toast = null; render(); }, 3200); }

function invReason(id, list) {
  const x = X(), i = INV[id], o = ORD[i.o];
  if (list.includes(id)) return t('Already on this Export');
  if (i.cancelled) return t('Cancelled invoice');
  if (ASSIGNED[id] && ASSIGNED[id] !== S.id) return t('In {exp}', {exp:ASSIGNED[id]});
  if (o.c !== x.c) return t('Different Invoicing company');
  if (x.kind === 'foreign' && o.s !== x.s) return t('Different Supplier');
  const allowed = x.kind === 'greek' ? [UD, ST] : [ST, MRNT];
  if (!allowed.includes(i.type)) return t('Invoice type not allowed for this Export type');
  if (i.entryNote) return t('Entry Note {en} storage invoices are in {exp}', {en:i.entryNote[0], exp:i.entryNote[1]});
  return null;
}
const failNow = kind => S.fail === kind || S.fail === 'all';

/* ------------------------------------------------------------------ Render: Overview */
function shipmentCard() {
  const s = SHIP[X().ship];
  return `<section class="card" aria-labelledby="h-ship"><div class="card-header"><h2 class="card-title text-subheading" id="h-ship">${esc(t('Shipment relationship'))}${bn(1)}</h2></div><div class="card-body">
    <div class="grid3">${roField(t('Shipment number'), link(X().ship))}${roField(t('Document type'), esc(s.doc ? t(s.doc) : t('Not recorded')))}${roField(t('Document number'), s.num ? `<span class="mono">${esc(s.num)}</span>` : esc(t('Not recorded')))}</div>
  </div></section>`;
}
function detailsCard() {
  const x = X(), sh = CO[shipperId(x)], d = S.det, e = d?.errors || {};
  const editBtn = canEdit() && x.customs === 'ead' && !d ? `<button type="button" class="btn btn-secondary btn-sm" data-act="det-edit" data-fid="det-edit">${ic('edit')}${esc(t('Edit'))}</button>` : '';
  const lock = x.customs !== 'ead' && !x.cancelled ? `<div class="lock-note">${alertBox('neutral', 'lock', esc(t('MRN, MRN date and Delivered vessel are locked after EAD receipt is confirmed. Changes need an audited correction.')))}</div>` : '';
  const input = (id, key, label, type, extra='') => `<div class="field"><label class="label" for="${id}">${esc(label)}<span class="req">*</span></label><input id="${id}" class="control${e[key] ? ' invalid' : ''}${type === 'text' ? ' mono' : ''}" type="${type}" data-in="det.${key}" value="${esc(d[key])}" ${e[key] ? `aria-invalid="true" aria-describedby="e-${id}"` : ''} ${extra}>${e[key] ? `<span class="error" id="e-${id}">${esc(e[key])}</span>` : ''}</div>`;
  const row2 = d
    ? `${input('f-mrn', 'mrn', t('MRN'), 'text', `maxlength="24" autocomplete="off" spellcheck="false" placeholder="${esc(t('18 letters or digits'))}"`)}${input('f-mrndate', 'mrnDate', t('MRN date'), 'date', `max="${today}"`)}
       <div class="field"><label class="label" for="f-vessel">${esc(t('Delivered vessel'))} <span class="opt">· ${esc(t('Optional'))}</span></label><select id="f-vessel" class="control" data-ch="det.vessel"><option value="">${esc(t('No vessel'))}</option>${VESSELS.map(v => `<option${v === d.vessel ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`
    : `${roField(t('MRN'), `<span class="mono">${esc(x.mrn)}</span>`)}${roField(t('MRN date'), esc(fmt(x.mrnDate)))}${roField(t('Delivered vessel'), esc(x.vessel))}`;
  const foot = d ? `${d.banner ? `<div style="margin-top:1rem">${d.banner}</div>` : ''}<div class="edit-foot"><button type="button" class="btn btn-secondary btn-md" data-act="det-cancel">${esc(t('Cancel'))}</button><button type="button" class="btn btn-primary btn-md" data-act="det-save" ${S.busy ? 'disabled' : ''}>${esc(t(S.busy ? 'Saving…' : 'Save'))}</button></div>` : '';
  return `<section class="card" aria-labelledby="h-det"><div class="card-header"><h2 class="card-title text-subheading" id="h-det">${esc(t('Export details'))}${bn(2)}${bn(3)}</h2>${editBtn}</div><div class="card-body">${lock}
    <div class="${x.kind === 'foreign' ? 'grid4b' : 'grid3'}">${roField(t('Export type'), esc(t(x.kind === 'greek' ? 'Greek invoicing company' : 'Foreign invoicing company')))}${roField(t('Shipper'), esc(sh.name))}${roField(t('Shipper ΑΦΜ'), `<span class="mono">${esc(sh.vat)}</span>`)}${x.kind === 'foreign' ? roField(t('Invoicing company'), esc(CO[x.c].name)) : ''}</div>
    <div class="grid3" style="margin-top:1rem">${row2}</div>${foot}
    ${customsBlock()}
  </div></section>`;
}
function customsBlock() {
  const x = X(), cur = {ead:0, ie599:1, done:2}[x.customs];
  const step = (i, label) => { const cls = i < cur || x.customs === 'done' ? 'done' : i === cur ? 'current' : ''; return `<li class="step ${cls}"${i === cur ? ' aria-current="step"' : ''}><span class="num">${i + 1}</span>${esc(t(label))}</li>`; };
  const act = x.customs === 'ead' ? 'Confirm EAD receipt' : x.customs === 'ie599' ? 'Confirm positive IE599' : null;
  const btn = act && canEdit() ? `<button type="button" class="btn btn-primary btn-md" data-act="customs" data-fid="customs-btn" ${editing() ? 'disabled aria-describedby="customs-hint"' : ''}>${esc(t(act))}</button>` : '';
  const dateCol = (label, ev) => `<div class="field"><span class="label">${esc(t(label))}</span><div class="ro${ev ? '' : ' empty'}">${ev ? esc(fmt(ev.d)) : '—'}</div>${ev ? `<p class="caption-by">${esc(t('Confirmed by {u} · {at}', {u:ev.u, at:ev.at}))}</p>` : ''}</div>`;
  return `<div class="status-block nc">${ncl('Customs status block with confirmation action (FRO-348 status pattern)')}
    <div class="status-head"><div class="field"><span class="label">${esc(t('Customs status'))}${bn(4)}</span><div class="ro strong">${esc(t(customsLabel(x.customs)))}</div></div>${btn}</div>
    ${btn && editing() ? `<p class="hint" id="customs-hint" style="margin:.5rem 0 0">${esc(t('Save or cancel the current edit before confirming a Customs event.'))}</p>` : ''}
    <ol class="stepper3" aria-label="${esc(t('Customs status'))}">${step(0, 'Awaiting EAD')}${step(1, 'Awaiting IE599')}${step(2, 'Completed')}</ol>
    <div class="dates2">${dateCol('EAD receipt confirmation date', x.ead)}${dateCol('Positive IE599 confirmation date', x.ie599)}</div>
  </div>`;
}

/* ------------------------------------------------------------------ Render: invoices tab */
function addPicker(list) {
  const q = S.invEd.q.trim().toLowerCase();
  const all = Object.keys(INV).filter(id => !q || id.toLowerCase().includes(q) || INV[id].o.toLowerCase().includes(q) || CO[ORD[INV[id].o].s].name.toLowerCase().includes(q));
  const pop = S.invEd.open ? `<ul class="popup" id="inv-pop" role="listbox" aria-label="${esc(t('Add invoice'))}">${all.length ? all.map(id => { const r = invReason(id, list); return `<li role="option" aria-disabled="${!!r}"><button type="button" class="opt-btn" data-act="add-inv" data-id="${id}" aria-disabled="${!!r}"><span class="opt-main mono">${id}</span><span class="opt-sub">${esc(CO[ORD[INV[id].o].s].name)} · ${INV[id].o}</span>${r ? `<span class="opt-sub" style="color:var(--danger-fg)">${esc(r)}</span>` : ''}</button></li>`; }).join('') : `<li class="opt-btn opt-sub">${esc(t('No matching invoices.'))}</li>`}</ul>` : '';
  return `<div class="field picker nc" data-picker="inv">${ncl('Invoice picker with unavailable reasons (FRO-350)')}<label class="label" for="f-addinv">${esc(t('Add invoice'))}${bn(6)}</label><div class="with-icon">${ic('search')}<input id="f-addinv" class="control" role="combobox" aria-expanded="${S.invEd.open}" aria-controls="inv-pop" autocomplete="off" placeholder="${esc(t('Search invoice number, Supplier or Order…'))}" value="${esc(S.invEd.q)}" data-in="invq"></div>${pop}</div>`;
}
function invoicesTab() {
  const x = X(), ed = S.invEd, list = ed ? ed.list : x.inv;
  const btn = canEdit() && !ed ? (x.customs === 'ead'
    ? `<button type="button" class="btn btn-secondary btn-sm" data-act="inv-edit" data-fid="inv-edit">${ic('edit')}${esc(t('Edit'))}</button>`
    : `<button type="button" class="btn btn-secondary btn-sm" data-act="inv-edit" data-fid="inv-edit">${ic('plus')}${esc(t('Add invoice'))}</button>`) : '';
  const canRemove = id => ed && (x.customs === 'ead' || !x.inv.includes(id));
  const rows = list.map(id => { const i = INV[id], o = ORD[i.o], isNew = ed && !x.inv.includes(id);
    return `<tr><td>${link(id)}${paperworkOnly(id) ? ` <span class="badge tone-warning">${esc(t('Paperwork only'))}</span>` : ''}${isNew ? ` <span class="badge tone-accent">${esc(t('New'))}</span>` : ''}</td><td>${esc(CO[o.s].name)}</td><td>${link(i.o)}</td><td>${esc(i.type)}</td><td>${vatPill(i.st)}</td>${ed ? `<td class="cell-end">${canRemove(id) ? `<button type="button" class="btn btn-ghost btn-sm icon-btn" data-act="rm-inv" data-id="${id}" aria-label="${esc(t('Remove {inv}', {inv:id}))}" data-fid="rm-${id}">${ic('x')}</button>` : `<span class="sr-only">—</span>${ic('lock', 'subtle')}`}</td>` : ''}</tr>`; }).join('');
  const orders = [...new Set(list.map(id => INV[id].o))];
  const head = `<tr><th>${esc(t('Invoice number'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Linked Order'))}</th><th>${esc(t('Invoice type'))}</th><th>${esc(t('VAT exemption status'))}</th>${ed ? `<th><span class="sr-only">${esc(t('Remove'))}</span></th>` : ''}</tr>`;
  return `<div class="sections">
    <section class="card" aria-labelledby="h-inv"><div class="card-header"><div><h2 class="card-title text-subheading" id="h-inv">${esc(t('Supplier invoices'))}${bn(5)}${bn(7)}</h2><p class="card-sub">${esc(t('The Informative List: invoices this Export declares.'))}</p></div>${btn}</div><div class="card-body">
      ${ed && x.customs !== 'ead' ? `<p class="hint" style="margin:0 0 .75rem">${esc(t('Saved invoices stay on this Export after EAD receipt. You can only add invoices.'))}</p>` : ''}
      ${ed ? `<div class="add-row">${addPicker(list)}</div>` : ''}
      ${ed?.error ? `<p class="error" id="e-inv" style="margin:0 0 .5rem">${esc(ed.error)}</p>` : ''}
      ${list.length ? `<div class="table-wrap"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>` : `<div class="empty-box">${esc(t('No invoices on this Export.'))}</div>`}
      ${ed ? `${ed.banner ? `<div style="margin-top:1rem">${ed.banner}</div>` : ''}<div class="edit-foot"><button type="button" class="btn btn-secondary btn-md" data-act="inv-cancel">${esc(t('Cancel'))}</button><button type="button" class="btn btn-primary btn-md" data-act="inv-save" ${S.busy ? 'disabled' : ''}>${esc(t(S.busy ? 'Saving…' : 'Save'))}</button></div>` : ''}
    </div></section>
    <section class="card" aria-labelledby="h-ord"><div class="card-header"><div><h2 class="card-title text-subheading" id="h-ord">${esc(t('Connected Orders'))}${bn(8)}</h2><p class="card-sub">${esc(t('Derived from the invoices. Each Order appears once.'))}</p></div></div><div class="card-body">
      ${orders.length ? `<div class="table-wrap"><table style="table-layout:fixed;min-width:44rem"><thead><tr><th>${esc(t('Order'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Invoicing company'))}</th><th>${esc(t('Vessel'))}</th><th>${esc(t('Invoices'))}</th></tr></thead><tbody>${orders.map(oid => { const o = ORD[oid]; return `<tr><td>${link(oid)}</td><td>${esc(CO[o.s].name)}</td><td>${esc(CO[o.c].name)}</td><td>${o.v ? esc(o.v) : '—'}</td><td class="mono">${list.filter(id => INV[id].o === oid).length}</td></tr>`; }).join('')}</tbody></table></div>` : `<div class="empty-box">${esc(t('No connected Orders.'))}</div>`}
    </div></section></div>`;
}

/* ------------------------------------------------------------------ Render: VAT tab */
const STAGES = [
  {key:'disp', title:'Ready for stamping', action:'Record dispatch for stamping', empty:'No invoices are waiting for dispatch.', match:i => i.st === 'Not started', dateLabel:'Dispatch date'},
  {key:'ret', title:'Awaiting stamped return', action:'Record stamped papers returned', empty:'No invoices are awaiting stamped return.', match:i => i.st === 'In progress' && i.disp, dateLabel:'Return date'},
  {key:'send', title:'Exempted invoices', action:'Record paperwork sent to recipient', empty:'No invoice is exempted yet.', match:i => i.st === 'Exempted', dateLabel:'Sending date'}
];
const eligibleFor = (key, id) => { const i = INV[id]; return key === 'send' ? (i.st === 'Exempted' && i.ret && !i.sent) : STAGES.find(s => s.key === key).match(i); };
const stampingOn = () => X().customs === 'done' && canEdit();
function stageCard(sg) {
  const x = X(), ids = udOn(x.inv).filter(id => sg.match(INV[id])), act = stampingOn();
  const elig = ids.filter(id => eligibleFor(sg.key, id)), sel = S.sel[sg.key];
  const cols = `<th>${esc(t('Invoice number'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('VAT exemption status'))}</th><th>${esc(t('Stamping dispatch date'))}</th><th>${esc(t('Stamping return date'))}</th>${sg.key === 'send' ? `<th>${esc(t('Stamped paperwork sent to recipient date'))}</th>` : ''}`;
  const rows = ids.map(id => { const i = INV[id], ok = eligibleFor(sg.key, id);
    return `<tr>${act ? `<td style="width:2.5rem"><input type="checkbox" class="check" data-act="sel" data-k="${sg.key}" data-id="${id}" ${sel.includes(id) ? 'checked' : ''} ${ok ? '' : 'disabled'} aria-label="${esc(t('Select {inv}', {inv:id}))}" data-fid="sel-${sg.key}-${id}"></td>` : ''}<td>${link(id)}</td><td>${esc(CO[ORD[i.o].s].name)}</td><td>${vatPill(i.st)}</td><td class="mono">${esc(fmt(i.disp)) || '—'}</td><td class="mono">${esc(fmt(i.ret)) || '—'}</td>${sg.key === 'send' ? `<td class="mono">${esc(fmt(i.sent)) || '—'}</td>` : ''}</tr>`; }).join('');
  const bar = act && ids.length ? `<div class="sel-bar"><button type="button" class="btn btn-secondary btn-sm" data-act="sel-all" data-k="${sg.key}" ${elig.length ? '' : 'disabled'}>${esc(t('Select all eligible'))}</button><button type="button" class="btn btn-ghost btn-sm" data-act="sel-clear" data-k="${sg.key}" ${sel.length ? '' : 'disabled'}>${esc(t('Clear selection'))}</button><span class="text-caption muted">${esc(t('{n} selected', {n:sel.length}))}</span></div>` : '';
  const btn = act && ids.length ? `<button type="button" class="btn btn-primary btn-sm" data-act="stamp" data-k="${sg.key}" data-fid="stamp-${sg.key}" ${sel.length ? '' : 'disabled'}>${esc(t(sg.action))}</button>` : '';
  return `<div class="stage-card"><div class="stage-head"><h3 class="text-subheading">${esc(t(sg.title))} <span class="badge">${ids.length}</span></h3>${btn}</div>${bar}
    ${ids.length ? `<div class="table-wrap"><table><thead><tr>${act ? `<th><span class="sr-only">${esc(t('Select {inv}', {inv:''}))}</span></th>` : ''}${cols}</tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="empty-box">${esc(t(sg.empty))}</div>`}</div>`;
}
function vatTab() {
  const x = X(), req = udOn(x.inv).length > 0, p = x.protocol;
  const printBtn = req && canEdit() ? `<button type="button" class="btn btn-primary btn-sm" data-act="print" data-fid="print-btn">${ic('print')}${esc(t('Print ΥΔ'))}</button>` : '';
  const protoBody = p ? `<div class="grid2" style="max-width:52rem">${roField(t('Protocol number'), `<span class="mono">${esc(p.n)}</span>`)}${roField(t('Protocol date'), esc(fmt(p.d)))}</div>${!req ? `<p class="hint" style="margin:.75rem 0 0">${esc(t('This protocol was assigned to an earlier invoice selection and stays with the Export.'))}</p>` : ''}`
    : alertBox('info', 'info', `<strong>${esc(t('VAT exemption procedure is not required'))}</strong><br><span class="text-body-sm">${esc(t('No invoice on this Export is of type Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).'))}</span>`);
  const arrow = `<div class="stage-arrow" aria-hidden="true">${ic('down')}</div>`;
  const proc = !req ? alertBox('info', 'info', `<strong>${esc(t('VAT exemption procedure is not required'))}</strong><br><span class="text-body-sm">${esc(t('No invoice on this Export is of type Με ΦΠΑ – Έκδοση Απαλλακτικού (Υ.Δ.).'))}</span>`)
    : `${x.customs !== 'done' ? `<div style="margin-bottom:1rem">${alertBox('neutral', 'lock', esc(t('Stamping starts after positive IE599 is confirmed (Customs status Completed).')))}</div>` : ''}${stageCard(STAGES[0])}${arrow}${stageCard(STAGES[1])}${arrow}${stageCard(STAGES[2])}`;
  return `<div class="sections">
    <section class="card" aria-labelledby="h-proto"><div class="card-header"><h2 class="card-title text-subheading" id="h-proto">${esc(t('Protocol Details'))}${bn(9)}${bn(10)}</h2>${printBtn}</div><div class="card-body">${protoBody}</div></section>
    <section class="card nc" aria-labelledby="h-proc">${ncl('Stamping stage sub-cards with bulk selection and decorative arrows')}<div class="card-header"><h2 class="card-title text-subheading" id="h-proc">${esc(t('VAT Exemption Procedure'))}${bn(11)}${bn(12)}</h2></div><div class="card-body">${proc}</div></section>
  </div>`;
}

/* ------------------------------------------------------------------ Render: Documents */
function docsTab() {
  const x = X(), up = canEdit(), rm = up && x.customs === 'ead';
  const saved = x.files.map((f, i) => `<div class="file-row"><div class="row-flex"><span class="file-icon">${ic('clip')}</span><div><div style="font-weight:600;overflow-wrap:anywhere">${esc(f.name)}</div><div class="text-caption muted">${esc(f.size)} · ${esc(t('Uploaded by {u} · {d}', {u:f.u, d:fmt(f.d)}))}</div></div></div><div class="row-flex"><button type="button" class="btn btn-secondary btn-sm" data-act="noop">${ic('dl')}${esc(t('Download'))}</button>${rm ? `<button type="button" class="btn btn-ghost btn-sm" data-act="rm-file" data-i="${i}" data-fid="rmf-${i}">${esc(t('Remove'))}</button>` : ''}</div></div>`).join('');
  const pending = S.uploads.map((u, i) => `<div class="file-row"><div class="row-flex"><span class="file-icon">${ic('clip')}</span><div><div style="font-weight:600;overflow-wrap:anywhere">${esc(u.name)}</div>${u.err ? `<div class="error">${esc(u.err)}</div>` : ''}</div></div><div class="row-flex">${u.st === 'uploading' ? `<span class="pill tone-info">${esc(t('Uploading…'))}</span>` : u.st === 'failed' ? `<span class="pill tone-danger">${esc(t('Upload failed'))}</span><button type="button" class="btn btn-secondary btn-sm" data-act="retry-up" data-i="${i}">${esc(t('Retry'))}</button>` : ''}<button type="button" class="btn btn-ghost btn-sm icon-btn" data-act="drop-up" data-i="${i}" aria-label="${esc(t('Remove {inv}', {inv:u.name}))}">${ic('x')}</button></div></div>`).join('');
  return `<section class="card" aria-labelledby="h-docs"><div class="card-header"><div><h2 class="card-title text-subheading" id="h-docs">${esc(t('Attachments'))}${bn(13)}</h2></div>${up ? `<label class="btn btn-secondary btn-sm" for="f-files">${ic('clip')}${esc(t('Upload documents'))}</label><input id="f-files" type="file" multiple class="sr-only" data-ch="files">` : ''}</div><div class="card-body stack">
    ${up ? `<p class="hint" style="margin:0">${esc(t('PDF, JPG, JPEG, PNG, WebP, GIF, DOC, DOCX, XLS, XLSX, CSV or TXT · up to 25 MB per file · nonempty files · filename 1–255 characters.'))}</p>` : ''}
    ${up && x.customs !== 'ead' && x.files.length ? `<p class="hint" style="margin:0">${esc(t('Saved documents are kept as evidence after EAD receipt. They cannot be removed.'))}</p>` : ''}
    ${pending}${saved || (pending ? '' : `<div class="empty-box">${esc(t('No documents on this Export.'))}</div>`)}
  </div></section>`;
}

/* ------------------------------------------------------------------ Render: modals */
function modalShell(title, body, foot, width='32rem') {
  return `<div class="scrim"><div class="scrim-bg" data-act="modal-close"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title" style="width:min(100%,${width})"><div class="modal-head"><h2 class="text-subheading" id="m-title" style="margin:0">${title}</h2></div><div class="modal-body stack">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
}
function modal() {
  const m = S.modal; if (!m) return '';
  const x = X(), err = m.err ? `<span class="error" id="e-m">${esc(m.err)}</span>` : '';
  const failBox = m.failed ? alertBox('danger', 'alert', esc(m.failed), 'alert') : '';
  const cancelBtn = (label='Cancel') => `<button type="button" class="btn btn-secondary btn-md" data-act="modal-close" id="m-first">${esc(t(label))}</button>`;
  if (m.kind === 'customs') {
    const ead = x.customs === 'ead';
    const body = `<p class="text-body" style="margin:0">${esc(t('Confirming records the date in your name and moves the Export to the next Customs status.'))}${ead ? '' : ' ' + esc(t('Confirm only a positive, verified IE599 (confirmed exit).'))}</p>
      ${ead ? '' : roField(t('EAD receipt confirmation date'), esc(fmt(x.ead.d)))}
      <div class="field"><label class="label" for="m-date">${esc(t(ead ? 'EAD receipt confirmation date' : 'Positive IE599 confirmation date'))}<span class="req">*</span></label><input id="m-date" class="control${m.err ? ' invalid' : ''}" type="date" data-in="m.date" value="${esc(m.date)}" min="${ead ? x.mrnDate : x.ead.d}" max="${today}" ${m.err ? 'aria-invalid="true" aria-describedby="e-m"' : ''}>${err}</div>${failBox}`;
    return modalShell(esc(t(ead ? 'Confirm EAD receipt' : 'Confirm positive IE599')), body, `${cancelBtn()}<button type="button" class="btn btn-primary btn-md" data-act="customs-ok" ${S.busy ? 'disabled' : ''}>${esc(t('Confirm'))}</button>`);
  }
  if (m.kind === 'cancel-export') {
    const body = `<p class="text-body" style="margin:0">${esc(t('The Export becomes read-only. Its invoices become available for other Exports. The MRN stays reserved and any protocol number is kept.'))}</p>
      <div class="field"><label class="label" for="m-reason">${esc(t('Reason'))}<span class="req">*</span></label><textarea id="m-reason" class="control${m.err ? ' invalid' : ''}" maxlength="1000" data-in="m.reason" ${m.err ? 'aria-invalid="true" aria-describedby="e-m"' : ''}>${esc(m.reason)}</textarea><div class="counter">${m.reason.length} / 1000</div>${err}</div>${failBox}`;
    return modalShell(esc(t('Cancel this Export?')), body, `${cancelBtn('Keep Export')}<button type="button" class="btn btn-danger btn-md" data-act="cancel-ok">${esc(t('Cancel Export'))}</button>`);
  }
  if (m.kind === 'rm-file') {
    return modalShell(esc(t('Remove this document?')), `<p class="text-body" style="margin:0">${esc(t('{f} will be removed from this Export.', {f:x.files[m.i].name}))}</p>`, `${cancelBtn('Keep document')}<button type="button" class="btn btn-danger btn-md" data-act="rm-file-ok">${esc(t('Remove'))}</button>`);
  }
  if (m.kind === 'stamp') {
    const sg = STAGES.find(s => s.key === m.k), sel = S.sel[m.k];
    const rows = sel.map(id => { const i = INV[id]; return `<li><span class="mono">${id}</span> · ${esc(m.k === 'disp' ? t('Invoice date') + ' ' + fmt(i.date) : m.k === 'ret' ? t('Stamping dispatch date') + ' ' + fmt(i.disp) : t('Stamping return date') + ' ' + fmt(i.ret))}</li>`; }).join('');
    const body = `<div><div class="label" style="margin-bottom:.25rem">${esc(t('Selected invoices'))} (${sel.length})</div><ul class="sel-list">${rows}</ul></div>
      <div class="field"><label class="label" for="m-date">${esc(t(sg.dateLabel))}<span class="req">*</span></label><input id="m-date" class="control${m.err ? ' invalid' : ''}" type="date" data-in="m.date" value="${esc(m.date)}" min="${stampMin(m.k).d}" max="${today}" ${m.err ? 'aria-invalid="true" aria-describedby="e-m"' : ''}>${err}</div>${failBox}`;
    return modalShell(esc(t(sg.action)), body, `${cancelBtn()}<button type="button" class="btn btn-primary btn-md" data-act="stamp-ok" ${S.busy ? 'disabled' : ''}>${esc(t('Confirm'))}</button>`);
  }
  if (m.kind === 'print') {
    if (m.out) {
      const body = `${alertBox('success', 'ok', esc(t('{n} documents ready', {n:m.out.length})))}${m.out.map(d => `<div class="doc-out"><div><div style="font-weight:600">${esc(d.title)}</div><div class="text-caption muted">${esc(d.sub)}</div></div><button type="button" class="btn btn-secondary btn-sm" data-act="noop">${ic('dl')}${esc(t('Open PDF'))}</button></div>`).join('')}<p class="hint" style="margin:0">${esc(t('Preview only: no PDF is generated here.'))}</p>`;
      return modalShell(esc(t('Print ΥΔ')), body, `<button type="button" class="btn btn-primary btn-md" data-act="modal-close" id="m-first">${esc(t('Close'))}</button>`, '40rem');
    }
    const ids = udOn(x.inv);
    const body = `<p class="hint" style="margin:0">${esc(t('One document per Invoicing company and Supplier, up to five invoices each.'))}</p>
      <fieldset style="border:0;margin:0;padding:0"><legend class="label" style="margin-bottom:.5rem">${esc(t('Select invoices'))}<span class="req">*</span></legend>
        <div class="sel-bar"><button type="button" class="btn btn-secondary btn-sm" data-act="p-all">${esc(t('Select all eligible'))}</button><button type="button" class="btn btn-ghost btn-sm" data-act="p-clear" ${m.sel.length ? '' : 'disabled'}>${esc(t('Clear selection'))}</button><span class="text-caption muted">${esc(t('{n} selected', {n:m.sel.length}))}</span></div>
        <div class="table-wrap"><table><thead><tr><th><span class="sr-only">${esc(t('Select invoices'))}</span></th><th>${esc(t('Invoice number'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Invoicing company'))}</th></tr></thead><tbody>${ids.map(id => `<tr><td style="width:2.5rem"><input type="checkbox" class="check" data-act="p-sel" data-id="${id}" ${m.sel.includes(id) ? 'checked' : ''} aria-label="${esc(t('Select {inv}', {inv:id}))}" data-fid="p-${id}"></td><td class="mono">${id}</td><td>${esc(CO[ORD[INV[id].o].s].name)}</td><td>${esc(CO[ORD[INV[id].o].c].name)}</td></tr>`).join('')}</tbody></table></div>
        ${m.errSel ? `<span class="error">${esc(m.errSel)}</span>` : ''}</fieldset>
      <fieldset style="border:0;margin:0;padding:0"><legend class="label" style="margin-bottom:.5rem">${esc(t('Template'))}<span class="req">*</span></legend><div class="radio-row">${['Αερολιμένας Ελ. Βενιζέλος','Α΄ Τελωνείο Πειραιά','Γ΄ Τελωνείο Πειραιά'].map(tp => `<label class="radio-opt"><input type="radio" name="tpl" value="${esc(tp)}" data-ch="m.tpl" ${m.tpl === tp ? 'checked' : ''}>${esc(t(tp))}</label>`).join('')}</div>${m.errTpl ? `<span class="error">${esc(m.errTpl)}</span>` : ''}</fieldset>`;
    return `<div class="nc" style="display:contents">${modalShell(esc(t('Print ΥΔ')), ncl('Print ΥΔ dialog') + body, `${cancelBtn()}<button type="button" class="btn btn-primary btn-md" data-act="print-ok">${ic('print')}${esc(t('Generate ΥΔ'))}</button>`, '44rem')}</div>`;
  }
  return '';
}
function stampMin(k) {
  let d = '', inv = '';
  for (const id of S.sel[k]) { const i = INV[id], v = k === 'disp' ? i.date : k === 'ret' ? i.disp : i.ret; if (v > d) { d = v; inv = id; } }
  return {d, inv};
}

/* ------------------------------------------------------------------ Render: page */
function tools() {
  const seg = (name, cur, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-act="${name}" data-v="${v}" aria-pressed="${cur === v}">${l}</button>`).join('')}</div>`;
  return `<details class="tools" ${params.get('tools') === '0' ? '' : 'open'}><summary>Preview controls</summary><div class="tools-body">
    <div><div class="label">Language</div>${seg('lang', S.lang, [['en','EN'],['el','EL']])}</div>
    <div><div class="label">Export</div>${seg('export', S.id, Object.keys(EXPORTS).sort().map(k => [k, k.replace('EXP-', '')]))}</div>
    <div><div class="label">User</div>${seg('role', S.role, [['operator','Operator'],['manager','Manager'],['viewer','No edit authority']])}</div>
    <div><div class="label">Page state</div>${seg('state', state0, [['default','Default'],['loading','Loading'],['error','Error'],['notfound','Not found'],['denied','Denied']])}</div>
    <div><div class="label">Simulate failure</div>${seg('fail', S.fail, [['none','None'],['save','Save'],['stale','Stale'],['confirm','Confirm'],['stamp','Stamping'],['upload','Upload']])}</div>
    <div><div class="label">Annotations</div>${seg('ann', (S.nc ? 'nc' : '') + (S.notes ? 'bn' : ''), [['ncbn','All'],['nc','New components'],['','None']])}</div>
    <p class="text-caption muted" style="margin:0">${esc(FIXTURE_HELP)}</p>
  </div></details>`;
}
function notesPanel() {
  if (!S.notes) return '';
  return `<aside class="notes-panel" aria-label="Business notes"><div class="card-header"><h2 class="text-subheading" style="margin:0">Business notes</h2><button type="button" class="btn btn-ghost btn-sm icon-btn" data-act="close-notes" aria-label="Close notes">${ic('x')}</button></div><ol>${NOTES.map((n, i) => `<li id="note-${i + 1}" class="${S.hl === i + 1 ? 'hl' : ''}"><strong>${i + 1}.</strong> ${esc(n)}</li>`).join('')}</ol></aside>`;
}
function shell(inner) {
  return `<header class="shell-header"><div class="shell-inner"><div class="row-flex"><span class="brand">Front Line</span><nav class="nav" aria-label="Main">${['Dashboard','Purchase orders','Shipments','Exports','Companies'].map(n => `<a href="#" data-act="noop"${n === 'Exports' ? ' aria-current="page"' : ''}>${esc(t(n))}</a>`).join('')}</nav></div><div class="lang">${['en','el'].map(l => `<button type="button" data-act="lang" data-v="${l}" aria-pressed="${S.lang === l}">${l.toUpperCase()}</button>`).join('')}</div></div></header><main>${inner}</main>`;
}
function render() {
  const a = document.activeElement, fid = a && (a.dataset.fid || a.id), sel = a && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null;
  document.documentElement.lang = S.lang;
  document.body.classList.toggle('hide-nc', !S.nc);
  document.body.classList.toggle('hide-bn', !S.notes);
  document.getElementById('sim-banner').textContent = 'Static preview with fictional data. Nothing is saved. Styles from the production design system (main 5c51030).';
  const x = X();
  let inner;
  if (state0 === 'loading') inner = `<div class="topbar"><h1 class="text-title">${esc(t('Export {id}', {id:S.id}))}</h1></div><div class="card card-pad stack" role="status" aria-label="${esc(t('Loading Export'))}"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`;
  else if (state0 === 'error') inner = `<div class="topbar"><h1 class="text-title">${esc(t('Export {id}', {id:S.id}))}</h1></div>${alertBox('danger', 'alert', `${esc(t('The Export could not be loaded.'))} <button type="button" class="btn btn-secondary btn-sm" data-act="retry-load" style="margin-left:.5rem">${esc(t('Retry'))}</button>`, 'alert')}`;
  else if (state0 === 'notfound') inner = `<div class="topbar"><h1 class="text-title">${esc(t('Exports'))}</h1></div>${alertBox('neutral', 'info', esc(t('Export not found.')))}`;
  else if (state0 === 'denied') inner = `<div class="topbar"><h1 class="text-title">${esc(t('Exports'))}</h1></div>${alertBox('warning', 'ban', esc(t('You do not have access to Exports.')))}`;
  else {
    const tabs = [['overview', t('Overview')], ['invoices', t('Supplier Invoices & Orders ({n})', {n:x.inv.length})], ['vat', t('VAT Exemption Protocol')], ['docs', t('Documents ({n})', {n:x.files.length})]];
    const panel = S.tab === 'overview' ? `<div class="sections">${shipmentCard()}${detailsCard()}</div>` : S.tab === 'invoices' ? invoicesTab() : S.tab === 'vat' ? vatTab() : docsTab();
    const cancelBanner = x.cancelled ? `<div style="margin-bottom:1rem">${alertBox('danger', 'ban', `<strong>${esc(t('This Export was cancelled'))}</strong><br>${esc(x.cancelled.reason)}<br><span class="text-caption">${esc(t('Cancelled by {u} · {at}', {u:x.cancelled.u, at:x.cancelled.at}))}</span>`)}</div>` : '';
    const actions = canCancel() ? `<div class="page-actions"><button type="button" class="btn btn-secondary btn-md" data-act="cancel-export" data-fid="cancel-export">${esc(t('Cancel Export'))}${bn(14)}</button></div>` : '';
    inner = `<div class="topbar"><div><div class="title-row"><h1 class="text-title" id="page-title" tabindex="-1">${esc(t('Export {id}', {id:S.id}))}</h1><span class="pill ${customsTone(x.customs)}">${esc(t(customsLabel(x.customs)))}</span>${x.cancelled ? `<span class="pill tone-danger">${esc(t('Cancelled'))}</span>` : ''}</div><p class="text-body-sm muted" style="margin:.25rem 0 0"><span class="mono">${esc(x.ship)}</span> · ${esc(t(x.kind === 'greek' ? 'Greek invoicing company' : 'Foreign invoicing company'))} · MRN <span class="mono">${esc(x.mrn)}</span></p></div>${actions}</div>
      ${cancelBanner}
      <div class="tablist" role="tablist" aria-label="${esc(t('Export {id}', {id:S.id}))}">${tabs.map(([v, l]) => `<button type="button" role="tab" class="tab" id="tab-${v}" aria-selected="${S.tab === v}" aria-controls="panel-${v}" tabindex="${S.tab === v ? 0 : -1}" data-act="tab" data-v="${v}">${esc(l)}</button>`).join('')}</div>
      <div class="tabpanel" role="tabpanel" id="panel-${S.tab}" aria-labelledby="tab-${S.tab}">${panel}</div>`;
  }
  document.getElementById('app').innerHTML = shell(inner) + modal() + notesPanel() + tools() + (S.toast ? `<div class="toast" role="status">${esc(S.toast)}</div>` : '');
  if (fid) { const el = document.querySelector(`[data-fid="${fid}"]`) || document.getElementById(fid); if (el) { el.focus(); if (sel && 'setSelectionRange' in el) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} } }
  if (S.modal && !document.querySelector('.modal')?.contains(document.activeElement)) (document.getElementById('m-date') || document.getElementById('m-reason') || document.getElementById('m-first'))?.focus();
}

/* ------------------------------------------------------------------ Actions */
function validateDet(d) {
  const e = {}, m = d.mrn.trim().toUpperCase();
  if (!m) e.mrn = t('Enter the MRN.');
  else if (!/^[A-Z0-9]{18}$/.test(m)) e.mrn = t('The MRN must be exactly 18 letters or digits.');
  else { const used = Object.entries(EXPORTS).find(([k, v]) => k !== S.id && v.mrn === m); if (used) e.mrn = t('This MRN is already used by {exp}.', {exp:used[0]}); }
  if (!d.mrnDate) e.mrnDate = t('Enter the MRN date.');
  else if (d.mrnDate > today) e.mrnDate = t('The MRN date cannot be later than today.');
  return e;
}
const failBanner = () => alertBox('danger', 'alert', esc(t('Changes could not be saved. Nothing changed. Your edits are kept.')), 'alert');
const staleBanner = () => alertBox('warning', 'alert', `${esc(t('This Export changed since you opened it. Refresh to review the latest version. Your edits are kept.'))} <button type="button" class="btn btn-secondary btn-sm" data-act="noop" style="margin-left:.5rem">${esc(t('Refresh'))}</button>`, 'alert');
function saveDet() {
  const d = S.det; d.errors = validateDet(d); d.banner = null;
  const first = ['mrn', 'mrnDate'].find(k => d.errors[k]);
  if (first) { render(); focusId(first === 'mrn' ? 'f-mrn' : 'f-mrndate'); return; }
  S.busy = true; render();
  setTimeout(() => {
    S.busy = false;
    if (failNow('save')) d.banner = failBanner();
    else if (failNow('stale')) d.banner = staleBanner();
    else { Object.assign(X(), {mrn:d.mrn.trim().toUpperCase(), mrnDate:d.mrnDate, vessel:d.vessel}); S.det = null; toast(t('Changes saved.')); render(); focusId('det-edit'); return; }
    render();
  }, 500);
}
function saveInv() {
  const ed = S.invEd, x = X(); ed.error = null; ed.banner = null;
  if (x.kind === 'greek' && !ed.list.length) { ed.error = t('Select at least one invoice for a Greek invoicing company Export.'); render(); focusId('f-addinv'); return; }
  S.busy = true; render();
  setTimeout(() => {
    S.busy = false;
    if (failNow('save')) ed.banner = failBanner();
    else if (failNow('stale')) ed.banner = staleBanner();
    else {
      x.inv.filter(id => !ed.list.includes(id)).forEach(id => delete ASSIGNED[id]);
      ed.list.forEach(id => ASSIGNED[id] = S.id);
      x.inv = [...ed.list];
      if (!x.protocol && udOn(x.inv).length) x.protocol = {n:'1204', d:today};
      for (const k in S.sel) S.sel[k] = S.sel[k].filter(id => x.inv.includes(id));
      S.invEd = null; toast(t('Changes saved.')); render(); focusId('inv-edit'); return;
    }
    render();
  }, 500);
}
function confirmCustoms() {
  const m = S.modal, x = X(), ead = x.customs === 'ead'; m.err = null; m.failed = null;
  if (!m.date) m.err = t(ead ? 'Enter the EAD receipt confirmation date.' : 'Enter the positive IE599 confirmation date.');
  else if (ead && m.date < x.mrnDate) m.err = t('The EAD receipt confirmation date cannot be earlier than the MRN date.');
  else if (!ead && m.date < x.ead.d) m.err = t('The positive IE599 confirmation date cannot be earlier than the EAD receipt confirmation date.');
  else if (m.date > today) m.err = t(ead ? 'The EAD receipt confirmation date cannot be later than today.' : 'The positive IE599 confirmation date cannot be later than today.');
  if (m.err) { render(); focusId('m-date'); return; }
  S.busy = true; render();
  setTimeout(() => {
    S.busy = false;
    if (failNow('confirm')) { m.failed = t('The confirmation could not be recorded. Nothing changed. Your date is kept.'); render(); return; }
    const ev = {d:m.date, u:ME, at:today + ' ' + new Date().toTimeString().slice(0, 5)};
    if (ead) { x.ead = ev; x.customs = 'ie599'; } else { x.ie599 = ev; x.customs = 'done'; }
    S.modal = null; render(); focusId('customs-btn');
  }, 500);
}
function confirmStamp() {
  const m = S.modal, ids = S.sel[m.k]; m.err = null; m.failed = null;
  const min = stampMin(m.k);
  if (!m.date) m.err = t('Enter the date.');
  else if (m.date > today) m.err = t('The date cannot be later than today.');
  else if (min.d && m.date < min.d) m.err = t('The date cannot be earlier than {d} ({inv}).', {d:fmt(min.d), inv:min.inv});
  if (m.err) { render(); focusId('m-date'); return; }
  S.busy = true; render();
  setTimeout(() => {
    S.busy = false;
    if (failNow('stamp')) { m.failed = t('The dates could not be recorded. Nothing changed. Your selection and date are kept.'); render(); return; }
    for (const id of ids) { const i = INV[id];
      if (m.k === 'disp') { i.disp = m.date; i.st = 'In progress'; } else if (m.k === 'ret') { i.ret = m.date; i.st = 'Exempted'; } else i.sent = m.date; }
    S.sel[m.k] = []; for (const k in S.sel) S.sel[k] = S.sel[k].filter(id => eligibleFor(k, id));
    S.modal = null; toast(t('Recorded for {n} invoice(s).', {n:ids.length})); render();
  }, 500);
}
function generatePrint() {
  const m = S.modal; m.errSel = m.sel.length ? null : t('Select at least one invoice.'); m.errTpl = m.tpl ? null : t('Select a template.');
  if (m.errSel || m.errTpl) { render(); return; }
  const groups = {};
  for (const id of m.sel) { const o = ORD[INV[id].o], k = o.c + '|' + o.s; (groups[k] = groups[k] || []).push(id); }
  const out = [];
  for (const [k, ids] of Object.entries(groups)) { const [c, s] = k.split('|'); for (let i = 0; i < ids.length; i += 5) { const chunk = ids.slice(i, i + 5); out.push({title:`ΥΔ · ${CO[c].name} · ${CO[s].name}`, sub:`${t(m.tpl)} · ${t('{n} invoices', {n:chunk.length})}: ${chunk.join(', ')}`}); } }
  m.out = out; render();
}
const ALLOWED = ['pdf','jpg','jpeg','png','webp','gif','doc','docx','xls','xlsx','csv','txt'];
function addFiles(list) {
  for (const f of list) {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    const err = !ALLOWED.includes(ext) ? t('File type not supported.') : f.size === 0 ? t('The file is empty.') : f.size > 25 * 1024 * 1024 ? t('The file is larger than 25 MB.') : f.name.length > 255 ? t('The filename is longer than 255 characters.') : null;
    const u = {name:f.name, size:f.size, st: err ? 'rejected' : 'uploading', err};
    S.uploads.push(u);
    if (!err) startUpload(u);
  }
}
function startUpload(u) {
  u.st = 'uploading'; render();
  setTimeout(() => {
    if (failNow('upload')) { u.st = 'failed'; render(); return; }
    X().files.unshift({name:u.name, size: Math.max(1, Math.round(u.size / 1024)) + ' KB', d:today, u:ME, st:'saved'});
    S.uploads.splice(S.uploads.indexOf(u), 1); render();
  }, 700);
}

/* ------------------------------------------------------------------ Events */
function setParam(k, v) { const p = new URLSearchParams(location.search); if (v == null) p.delete(k); else p.set(k, v); location.search = p.toString(); }
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (S.invEd && !e.target.closest('[data-picker]') && S.invEd.open) { S.invEd.open = false; if (!b) render(); }
  if (e.target.id === 'f-addinv' && S.invEd && !S.invEd.open) { S.invEd.open = true; render(); return; }
  if (!b) return;
  const act = b.dataset.act;
  if (b.getAttribute('aria-disabled') === 'true') return;
  if (b.type !== 'checkbox') e.preventDefault();
  switch (act) {
    case 'noop': return;
    case 'lang': S.lang = b.dataset.v; break;
    case 'state': setParam('state', b.dataset.v === 'default' ? null : b.dataset.v); return;
    case 'export': setParam('export', b.dataset.v); return;
    case 'role': setParam('role', b.dataset.v); return;
    case 'fail': S.fail = b.dataset.v; break;
    case 'ann': S.nc = b.dataset.v.includes('nc'); S.notes = b.dataset.v.includes('bn'); break;
    case 'note': S.notes = true; S.hl = +b.dataset.n; render(); document.getElementById('note-' + b.dataset.n)?.scrollIntoView({block:'nearest'}); return;
    case 'close-notes': S.notes = false; S.hl = null; break;
    case 'retry-load': setParam('state', null); return;
    case 'tab': S.tab = b.dataset.v; break;
    case 'det-edit': { const x = X(); S.det = {mrn:x.mrn, mrnDate:x.mrnDate, vessel:x.vessel, errors:{}}; render(); focusId('f-mrn'); return; }
    case 'det-cancel': S.det = null; render(); focusId('det-edit'); return;
    case 'det-save': saveDet(); return;
    case 'inv-edit': S.invEd = {list:[...X().inv], q:'', open:false}; render(); focusId('f-addinv'); return;
    case 'inv-cancel': S.invEd = null; render(); focusId('inv-edit'); return;
    case 'inv-save': saveInv(); return;
    case 'add-inv': S.invEd.list.push(b.dataset.id); S.invEd.open = false; S.invEd.q = ''; S.invEd.error = null; render(); focusId('f-addinv'); return;
    case 'rm-inv': { const l = S.invEd.list, i = l.indexOf(b.dataset.id); l.splice(i, 1); render(); const next = l.slice(i).find(id => document.querySelector(`[data-fid="rm-${id}"]`)); focusId(next ? 'rm-' + next : 'f-addinv'); return; }
    case 'customs': S.modal = {kind:'customs', date:''}; break;
    case 'customs-ok': confirmCustoms(); return;
    case 'cancel-export': S.modal = {kind:'cancel-export', reason:''}; break;
    case 'cancel-ok': { const m = S.modal; if (!m.reason.trim()) { m.err = t('Enter a reason.'); render(); focusId('m-reason'); return; }
      const x = X(); x.cancelled = {reason:m.reason.trim(), u:ME, at:today + ' ' + new Date().toTimeString().slice(0, 5)}; x.inv.forEach(id => delete ASSIGNED[id]);
      S.modal = null; S.det = null; S.invEd = null; render(); focusId('page-title'); return; }
    case 'rm-file': S.modal = {kind:'rm-file', i:+b.dataset.i, ret:b.dataset.fid}; break;
    case 'rm-file-ok': X().files.splice(S.modal.i, 1); S.modal = null; render(); focusId('f-files'); return;
    case 'drop-up': S.uploads.splice(+b.dataset.i, 1); break;
    case 'retry-up': startUpload(S.uploads[+b.dataset.i]); return;
    case 'sel': { const l = S.sel[b.dataset.k], id = b.dataset.id; if (b.checked) l.push(id); else l.splice(l.indexOf(id), 1); break; }
    case 'sel-all': { const k = b.dataset.k; S.sel[k] = udOn(X().inv).filter(id => eligibleFor(k, id)); break; }
    case 'sel-clear': S.sel[b.dataset.k] = []; break;
    case 'stamp': S.modal = {kind:'stamp', k:b.dataset.k, date:'', ret:'stamp-' + b.dataset.k}; break;
    case 'stamp-ok': confirmStamp(); return;
    case 'print': S.modal = {kind:'print', sel:[], tpl:''}; break;
    case 'p-sel': { const l = S.modal.sel, id = b.dataset.id; if (b.checked) l.push(id); else l.splice(l.indexOf(id), 1); break; }
    case 'p-all': S.modal.sel = udOn(X().inv); break;
    case 'p-clear': S.modal.sel = []; break;
    case 'print-ok': generatePrint(); return;
    case 'modal-close': closeModal(); return;
  }
  render();
});
function closeModal() {
  const m = S.modal; S.modal = null; render();
  const back = {customs:'customs-btn', 'cancel-export':'cancel-export', print:'print-btn'}[m.kind] || m.ret;
  if (back) focusId(back);
}
document.addEventListener('input', e => {
  const k = e.target.dataset.in; if (!k) return;
  if (k === 'invq') { S.invEd.q = e.target.value; S.invEd.open = true; render(); return; }
  if (k.startsWith('det.')) { S.det[k.slice(4)] = e.target.value; return; }
  if (k === 'm.reason') { S.modal.reason = e.target.value.slice(0, 1000); const c = document.querySelector('.counter'); if (c) c.textContent = S.modal.reason.length + ' / 1000'; return; }
  if (k === 'm.date') { S.modal.date = e.target.value; return; }
});
document.addEventListener('change', e => {
  const k = e.target.dataset.ch || e.target.dataset.in; if (!k) return;
  if (k === 'det.mrn') { S.det.mrn = e.target.value.trim().toUpperCase(); render(); return; }
  if (k === 'det.vessel') { S.det.vessel = e.target.value; return; }
  if (k === 'm.tpl') { S.modal.tpl = e.target.value; S.modal.errTpl = null; render(); return; }
  if (k === 'files') { addFiles(e.target.files); render(); return; }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (S.modal) { closeModal(); return; }
    if (S.invEd?.open) { S.invEd.open = false; render(); focusId('f-addinv'); return; }
    if (S.det && e.target.closest('.card')) { S.det = null; render(); focusId('det-edit'); return; }
  }
  if (e.key === 'Tab' && S.modal) {
    const f = [...document.querySelectorAll('.modal button:not([disabled]), .modal input:not([disabled]), .modal textarea, .modal select')];
    if (f.length) { const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); } }
  }
  if (e.target.getAttribute('role') === 'tab' && ['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
    const order = ['overview','invoices','vat','docs']; let i = order.indexOf(S.tab);
    i = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (i + (e.key === 'ArrowRight' ? 1 : 3)) % 4;
    S.tab = order[i]; render(); document.getElementById('tab-' + S.tab)?.focus(); e.preventDefault();
  }
  if (e.key === 'ArrowDown' && e.target.id === 'f-addinv') { e.preventDefault(); document.querySelector('#inv-pop .opt-btn')?.focus(); }
});

/* ------------------------------------------------------------------ Boot */
render();
