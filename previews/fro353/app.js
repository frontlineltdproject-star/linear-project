'use strict';
/* FRO-353 Create Customs Storage Entry — static preview. Fixture data only (demo-data.md style); every
   operation is a browser-local simulation. Styles mirror frontline-forwarding-client DESIGN.md, theme.css and
   components/ui at main 5c51030. */

/* ------------------------------------------------------------------ Greek copy (proposed; confirm with the office) */
const EL = {
  'Dashboard':'Πίνακας ελέγχου','Purchase orders':'Παραγγελίες αγοράς','Shipments':'Αποστολές','Companies':'Εταιρείες',
  'Create Customs Storage Entry':'Δημιουργία Δελτίου Εισόδου',
  'Record the storage admission of one Order under Customs Storage.':'Καταχωρίστε την παραλαβή μίας παραγγελίας σε Τελωνειακή Αποθήκευση.',
  'Overview':'Επισκόπηση','Related Supplier Invoices ({n})':'Σχετικά τιμολόγια προμηθευτών ({n})','Related Export':'Σχετική εξαγωγή',
  'Order relationship':'Σύνδεση με παραγγελία','Order':'Παραγγελία','Search Stock ID, reference, vessel or colli code…':'Αναζήτηση Stock ID, αναφοράς, πλοίου ή κωδικού κόλι…',
  'Stock ID':'Stock ID','Admitting warehouse · admission':'Αποθήκη παραλαβής · παραλαβή','Admitted collis':'Κόλα παραλαβής','Gross weight':'Μικτό βάρος',
  'Depositor (Invoicing company)':'Αποθέτης (εταιρεία τιμολόγησης)','Depositor ΑΦΜ':'ΑΦΜ αποθέτη','Operational Client':'Πελάτης','Supplier':'Προμηθευτής','Supplier ΑΦΜ':'ΑΦΜ προμηθευτή',
  'Unknown':'Άγνωστο','Missing':'Λείπει','Select an Order to see its admission and parties.':'Επιλέξτε παραγγελία για να δείτε την παραλαβή και τα μέρη της.',
  'Customs Storage Entry details':'Στοιχεία Δελτίου Εισόδου','Entry details':'Στοιχεία δελτίου','Goods and transport':'Εμπορεύματα και μεταφορά','Warehouse operator':'Διαχειριστής αποθήκης',
  'Entry number':'Αριθμός δελτίου','Assigned on creation':'Αποδίδεται κατά τη δημιουργία','Entry date & time':'Ημερομηνία και ώρα δελτίου',
  'Entry MRN':'MRN δελτίου','Entry MRN date':'Ημερομηνία MRN δελτίου','Optional':'Προαιρετικό',
  'Tariff classification code':'Δασμολογική κλάση','Digits only, up to 10':'Μόνο ψηφία, έως 10',
  'Goods description for printed copies':'Περιγραφή εμπορευμάτων για τα αντίτυπα','Transport means / number':'Μεταφορικό μέσο / αριθμός','Transport Company':'Μεταφορική εταιρεία',
  'Permit number':'Αριθμός άδειας','Operator name':'Επωνυμία διαχειριστή','Operator ΑΦΜ':'ΑΦΜ διαχειριστή','Warehouse address':'Διεύθυνση αποθήκης',
  'Prefilled from {w}. You can change it.':'Συμπληρώθηκε από {w}. Μπορείτε να το αλλάξετε.',
  'No single Customs Storage licence on {w}; enter the permit number.':'Η {w} δεν έχει μία μόνο άδεια Τελωνειακής Αποθήκευσης· συμπληρώστε τον αριθμό άδειας.',
  'Invoice ID':'Κωδ. τιμολογίου','Invoice number':'Αριθμός τιμολογίου','Invoice date':'Ημερομηνία τιμολογίου','Invoice type':'Τύπος τιμολογίου','Currency':'Νόμισμα','Net value':'Καθαρή αξία','Actual VAT':'Πραγματικός ΦΠΑ',
  'Statistical VAT (hypothetical, 24%)':'Στατιστικός ΦΠΑ (υποθετικός, 24%)','Totals':'Σύνολα',
  'Active invoices of type Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) on the selected Order.':'Ενεργά τιμολόγια τύπου Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) της επιλεγμένης παραγγελίας.',
  'Statistical VAT is reporting information only. It is not VAT charged or payable.':'Ο στατιστικός ΦΠΑ είναι μόνο πληροφορία αναφοράς. Δεν είναι ΦΠΑ που χρεώνεται ή οφείλεται.',
  'Mixed or non-EUR currency: totals and total Statistical VAT are not shown.':'Μικτό ή μη ευρώ νόμισμα: τα σύνολα και ο συνολικός στατιστικός ΦΠΑ δεν εμφανίζονται.',
  'Select an Order to see its invoices.':'Επιλέξτε παραγγελία για να δείτε τα τιμολόγιά της.',
  'This Order has no matching invoices yet. You can still create the entry.':'Η παραγγελία δεν έχει ακόμη αντίστοιχα τιμολόγια. Μπορείτε να δημιουργήσετε το δελτίο.',
  'Export':'Εξαγωγή','Export MRN':'MRN εξαγωγής','Export MRN date':'Ημερομηνία MRN εξαγωγής','Customs status':'Κατάσταση τελωνείου',
  'Awaiting EAD':'Αναμονή EAD','Awaiting IE599':'Αναμονή IE599','Completed':'Ολοκληρώθηκε',
  'Select an Order to see its Export.':'Επιλέξτε παραγγελία για να δείτε την εξαγωγή της.',
  'No matching invoices, so no Export.':'Δεν υπάρχουν αντίστοιχα τιμολόγια, άρα ούτε εξαγωγή.',
  'None of the matching invoices is in an Export yet.':'Κανένα αντίστοιχο τιμολόγιο δεν βρίσκεται ακόμη σε εξαγωγή.',
  '{n} of {m} invoices are in this Export.':'{n} από {m} τιμολόγια βρίσκονται σε αυτή την εξαγωγή.',
  'Read from the Export. Change it on the Export page.':'Προέρχεται από την εξαγωγή. Αλλάξτε το στη σελίδα της εξαγωγής.',
  'Cancel':'Άκυρο','Creating…':'Δημιουργία…','Retry':'Επανάληψη','Loading…':'Φόρτωση…','Open':'Άνοιγμα',
  'No Orders match your search.':'Καμία παραγγελία δεν ταιριάζει με την αναζήτηση.',
  'Could not search Orders.':'Δεν ήταν δυνατή η αναζήτηση παραγγελιών.',
  'This Order is cancelled.':'Η παραγγελία είναι ακυρωμένη.',
  "The Order's customs regime is not Customs Storage.":'Το τελωνειακό καθεστώς της παραγγελίας δεν είναι Τελωνειακή Αποθήκευση.',
  'The Order has not been admitted to a Customs Storage warehouse yet.':'Η παραγγελία δεν έχει παραληφθεί ακόμη σε αποθήκη Τελωνειακής Αποθήκευσης.',
  'Goods were admitted under Order {o}. Create the entry from that Order.':'Τα εμπορεύματα παραλήφθηκαν με την παραγγελία {o}. Δημιουργήστε το δελτίο από εκείνη την παραγγελία.',
  'Already covered by Customs Storage Entry {e} (Order {o}).':'Καλύπτεται ήδη από το Δελτίο Εισόδου {e} (παραγγελία {o}).',
  'Order {o} cannot be selected.':'Η παραγγελία {o} δεν μπορεί να επιλεγεί.',
  'The Order you came from was not found or you cannot open it. Search for an Order.':'Η παραγγελία από την οποία ήρθατε δεν βρέθηκε ή δεν έχετε πρόσβαση. Αναζητήστε παραγγελία.',
  'You do not have permission to create Customs Storage Entries.':'Δεν έχετε δικαίωμα δημιουργίας Δελτίων Εισόδου.',
  'Discard this entry?':'Απόρριψη του δελτίου;','The Order selection and the values you entered will be lost.':'Η επιλογή παραγγελίας και οι τιμές που καταχωρίσατε θα χαθούν.',
  'Keep editing':'Συνέχεια επεξεργασίας','Discard':'Απόρριψη',
  'Enter the entry date and time.':'Συμπληρώστε την ημερομηνία και ώρα του δελτίου.',
  'The entry date and time cannot be later than now.':'Η ημερομηνία και ώρα του δελτίου δεν μπορεί να είναι μεταγενέστερη από τώρα.',
  'The Entry MRN date cannot be later than today.':'Η ημερομηνία MRN του δελτίου δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'Use digits only, up to 10.':'Χρησιμοποιήστε μόνο ψηφία, έως 10.','Use up to {n} characters.':'Χρησιμοποιήστε έως {n} χαρακτήρες.',
  'Fix the highlighted fields.':'Διορθώστε τα επισημασμένα πεδία.',
  'The entry could not be created. Nothing was saved. Your values are kept.':'Δεν ήταν δυνατή η δημιουργία του δελτίου. Δεν αποθηκεύτηκε τίποτα. Οι τιμές σας διατηρούνται.',
  'Customs Storage Entry {e} was created for this Order by someone else. Your values are kept.':'Το Δελτίο Εισόδου {e} δημιουργήθηκε για αυτή την παραγγελία από άλλον χρήστη. Οι τιμές σας διατηρούνται.',
  'We could not confirm whether the entry was created. Checking the Order…':'Δεν ήταν δυνατό να επιβεβαιωθεί αν δημιουργήθηκε το δελτίο. Έλεγχος της παραγγελίας…',
  'No entry was created. You can try again.':'Δεν δημιουργήθηκε δελτίο. Μπορείτε να προσπαθήσετε ξανά.',
  'Customs Storage Entry {e} created.':'Το Δελτίο Εισόδου {e} δημιουργήθηκε.',
  'Customs Storage Entry {e}':'Δελτίο Εισόδου {e}','Back to Order {o}':'Επιστροφή στην παραγγελία {o}',
  'Preview: the details page (FRO-354) opens here.':'Προεπισκόπηση: εδώ ανοίγει η σελίδα στοιχείων (FRO-354).',
  'Preview: you returned to {p}.':'Προεπισκόπηση: επιστρέψατε στη σελίδα {p}.','Orders list':'λίστα παραγγελιών','Order {o}':'παραγγελία {o}',
  'Leave this page? Your entry is not saved.':'Αποχώρηση από τη σελίδα; Το δελτίο δεν έχει αποθηκευτεί.'
};
let lang = 'en';
function t(k, v) { let s = lang === 'el' && EL[k] ? EL[k] : k; if (v) for (const [a, b] of Object.entries(v)) s = s.split('{' + a + '}').join(b); return s; }
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);

/* ------------------------------------------------------------------ Fixtures (fictional) */
const WH = {
  ath: { name:'ATH-HUB · Demo Athens Hub', permit:'DEMO-CS-0001', operator:'Demo Hub Operator S.A.', vat:'800000003', address:'Demo Street 12, 18545 Piraeus' },
  ath2:{ name:'ATH-HUB-2 · Demo Athens Hub 2', permit:'', operator:'Demo Hub Operator S.A.', vat:'800000003', address:'Demo Avenue 4, 18546 Piraeus' }
};
const INV = (id, no, date, cur, net, exp) => ({ id, no, date, cur, net, exp });
const ORDERS = [
  { id:5, stock:'PO-0000005', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.', supplierVat:'800000001', depositor:'Demo Invoicing Ltd', depositorVat:'800000002',
    wh:'ath', admitted:'20/10/2026 09:42', collis:10, weight:'1,284.50 kg',
    invoices:[INV(301,'INV-7781','12/10/2026','EUR',25000,'EXP-31'),INV(302,'INV-7782','12/10/2026','EUR',19999,'EXP-31'),INV(303,'INV-7790','14/10/2026','EUR',21050,'EXP-31'),INV(304,'INV-7801','15/10/2026','EUR',14313,'EXP-31')],
    export:{ id:'EXP-31', mrn:'26GR0000EX00000412', date:'24/10/2026', status:'Awaiting IE599' } },
  { id:6, stock:'PO-0000006', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.', supplierVat:'800000001', depositor:null, depositorVat:null,
    wh:'ath2', admitted:'22/10/2026 14:05', collis:2, weight:null, invoices:[], export:null },
  { id:7, stock:'PO-0000007', status:'IN_STOCK', client:'Demo Client Company', supplier:null, supplierVat:null, depositor:'Demo Invoicing Ltd', depositorVat:'800000002',
    wh:'ath', admitted:'23/10/2026 10:15', collis:3, weight:'312.00 kg',
    invoices:[INV(311,'INV-9001','20/10/2026','EUR',100000,'EXP-33'),INV(312,'INV-9002','20/10/2026','USD',50000,'EXP-33'),INV(313,'INV-9010','25/10/2026','EUR',12040,null)],
    export:{ id:'EXP-33', mrn:'', date:'', status:'Awaiting EAD' } },
  { id:8, stock:'PO-0000008', status:'IN_STOCK', reason:['covered','1042','PO-0000003'] },
  { id:31, stock:'PO-0000003_1', status:'IN_STOCK', reason:['admittedUnder','PO-0000003'] },
  { id:2, stock:'PO-0000002', status:'EXPECTED_READINESS', reason:['notAdmitted'] },
  { id:1, stock:'PO-0000001', status:'IN_STOCK', reason:['notStorage'] },
  { id:9, stock:'PO-0000009', status:'CANCELLED', reason:['cancelled'] }
];
const STATUS_TONE = { IN_STOCK:'tone-cyan', EXPECTED_READINESS:'tone-violet', CANCELLED:'tone-danger' };
function reasonText(r) {
  if (!r) return '';
  switch (r[0]) {
    case 'cancelled': return t('This Order is cancelled.');
    case 'notStorage': return t("The Order's customs regime is not Customs Storage.");
    case 'notAdmitted': return t('The Order has not been admitted to a Customs Storage warehouse yet.');
    case 'admittedUnder': return t('Goods were admitted under Order {o}. Create the entry from that Order.', { o:r[1] });
    case 'covered': return t('Already covered by Customs Storage Entry {e} (Order {o}).', { e:r[1], o:r[2] });
  }
}

/* ------------------------------------------------------------------ Money: exact cents, decimal half-up */
const vatCents = c => Math.floor((c * 24 + 50) / 100);
const fmt = c => (c / 100).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });

/* ------------------------------------------------------------------ State */
const params = new URLSearchParams(location.search);
const SCENARIOS = ['blank','from-order','preselect-ineligible','preselect-covered','preselect-notfound','denied','lookup-loading','lookup-error','save-fail','duplicate','unknown-outcome'];
let scenario = SCENARIOS.includes(params.get('state')) ? params.get('state') : 'blank';
let S;
function nowLocal() { const d = new Date(); const p = n => String(n).padStart(2,'0'); return { date:`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`, time:`${p(d.getHours())}:${p(d.getMinutes())}` }; }
function reset() {
  const n = nowLocal();
  S = { tab:'overview', query:'', open:false, active:-1, order:null, blocked:null, notice:null, origin:null,
    f:{ date:n.date, time:n.time, mrn:'', mrnDate:'', tariff:'', goods:'', transport:'', permit:'', operator:'', opVat:'', address:'' },
    touched:{}, dirty:false, errors:{}, banner:null, pending:false, result:null, modal:null, toast:null, notes:false };
  if (scenario === 'from-order') { S.origin = 'PO-0000005'; selectOrder(ORDERS[0], true); }
  if (scenario === 'preselect-ineligible') { S.origin = 'PO-0000002'; S.blocked = ORDERS.find(o => o.stock === 'PO-0000002'); S.query = 'PO-0000002'; }
  if (scenario === 'preselect-covered') { S.origin = 'PO-0000008'; S.blocked = ORDERS.find(o => o.stock === 'PO-0000008'); S.query = 'PO-0000008'; }
  if (scenario === 'preselect-notfound') { S.origin = 'PO-0000099'; S.notice = 'notfound'; }
}
function selectOrder(o, initial) {
  S.order = o; S.blocked = null; S.query = o.stock; S.open = false;
  const w = WH[o.wh];
  const pre = { permit:w.permit, operator:w.operator, opVat:w.vat, address:w.address };
  for (const k of Object.keys(pre)) if (!S.touched[k]) S.f[k] = pre[k];
  if (!initial) S.dirty = true;
}
reset();

/* ------------------------------------------------------------------ Business notes (from the agreed decisions) */
const NOTES = [
  ['Order search','Searches the existing Order fields (Stock ID, message number, references, vessel, colli code). Each match shows FRO-319 eligibility; ineligible ones stay visible with the first failing reason and cannot be picked.'],
  ['Admission','The entry records the first storage admission at a Customs Storage warehouse. Collis and gross weight are the whole original admission; weight is Unknown when any colli lacks a warehouse-confirmed weight.'],
  ['Depositor','Depositor is the Order’s Invoicing company and its ΑΦΜ, never the Client. Missing depositor or Supplier never blocks creation.'],
  ['Entry fields','Number assigned on success. Date & time required, default now (Athens), not later than now. MRN date not later than today. Tariff code digits only, up to 10, leading zeros kept.'],
  ['Warehouse prefill','Permit, operator, ΑΦΜ and address prefill from the admitting warehouse; permit only when it has exactly one Customs Storage licence. Changing the Order re-fills only fields you have not edited.'],
  ['Invoices & Statistical VAT','Active Αποθήκη Αποθήκευσης invoices of the Order. Rows in their own currency; Statistical VAT = 24% of net, half-up. Totals only when all are EUR; total VAT is 24% of total net rounded once.'],
  ['Export','Read from the one Export holding the matching invoices. Partial assignment shows “n of m”. No editors here.'],
  ['Outcomes','Concurrent duplicate keeps your values and shows the existing entry. A lost response checks the Order before allowing retry. Success opens the new entry (FRO-354).']
];
const bn = i => `<button type="button" class="bn" data-note="${i}" aria-label="Business note ${i}">${i}</button>`;
const nc = (label, why) => `<p class="nc-label">New component — ${esc(label)}: ${esc(why)}</p>`;

/* ------------------------------------------------------------------ Render helpers */
function ro(label, value, opts = {}) {
  const empty = value == null || value === '';
  const marker = opts.marker ? `<span class="marker">${esc(t(opts.marker))}</span>` : '';
  return `<div class="field${opts.full ? ' full' : ''}"><span class="label">${esc(t(label))}${marker}</span><div class="ro${empty ? ' empty' : ''}${opts.mono ? ' mono' : ''}">${empty ? '—' : (opts.html ? value : esc(value))}</div></div>`;
}
function input(key, label, opts = {}) {
  const err = S.errors[key];
  const id = 'f-' + key;
  const hint = opts.hint ? `<span class="hint">${esc(opts.hint)}</span>` : '';
  const control = opts.textarea
    ? `<textarea id="${id}" class="control${err ? ' invalid' : ''}" data-f="${key}" maxlength="${opts.max || 2000}" aria-invalid="${!!err}">${esc(S.f[key])}</textarea>`
    : `<input id="${id}" class="control${err ? ' invalid' : ''}${opts.mono ? ' mono' : ''}" data-f="${key}" type="${opts.type || 'text'}" ${opts.inputmode ? `inputmode="${opts.inputmode}"` : ''} maxlength="${opts.max || 500}" value="${esc(S.f[key])}" aria-invalid="${!!err}">`;
  return `<div class="field${opts.full ? ' full' : ''}"><label class="label" for="${id}">${esc(t(label))}${opts.req ? '<span class="req">*</span>' : ''}${opts.optional ? ` <span class="opt">(${esc(t('Optional'))})</span>` : ''}</label>${control}${err ? `<span class="error" role="alert">${esc(err)}</span>` : hint}</div>`;
}
function tabLabel(id) {
  const n = S.order ? S.order.invoices.length : 0;
  return id === 'overview' ? t('Overview') : id === 'invoices' ? t('Related Supplier Invoices ({n})', { n }) : t('Related Export');
}

function orderCard() {
  const o = S.order;
  const q = S.query.trim().toLowerCase();
  let list = '';
  if (S.open) {
    let body;
    if (scenario === 'lookup-loading') body = `<li class="opt-btn"><span class="opt-sub">${esc(t('Loading…'))}</span></li>`;
    else if (scenario === 'lookup-error') body = `<li class="opt-btn"><span class="opt-sub">${esc(t('Could not search Orders.'))}</span> <button type="button" class="btn btn-secondary btn-sm" data-act="retry-search">${esc(t('Retry'))}</button></li>`;
    else {
      const m = ORDERS.filter(x => !q || x.stock.toLowerCase().includes(q));
      body = m.length ? m.map((x, i) => `<li role="option" id="opt-${x.id}" aria-selected="${i === S.active}" aria-disabled="${!!x.reason}">
        <${x.reason ? 'div' : 'button type="button"'} class="opt-btn" data-pick="${x.id}" aria-disabled="${!!x.reason}" tabindex="-1" ${i === S.active ? 'style="background:var(--accent-subtle)"' : ''}>
          <span class="opt-main mono">${esc(x.stock)} <span class="pill ${STATUS_TONE[x.status] || 'tone-neutral'}">${esc(x.status)}</span></span>
          ${x.client ? `<span class="opt-sub">${esc(x.client)}${x.supplier ? ' · ' + esc(x.supplier) : ''}</span>` : ''}
          ${x.reason ? `<span class="reason">${esc(reasonText(x.reason))}${x.reason[0] === 'covered' ? ` <a class="link" href="#" data-act="open-existing">${esc(t('Open'))}</a>` : ''}</span>` : ''}
        </${x.reason ? 'div' : 'button'}></li>`).join('') : `<li class="opt-btn"><span class="opt-sub">${esc(t('No Orders match your search.'))}</span></li>`;
    }
    list = `<ul class="popup" role="listbox" id="order-list">${body}</ul>`;
  }
  const blocked = S.blocked ? `<div class="alert tone-warning" role="status" style="margin-top:.5rem"><span><strong>${esc(t('Order {o} cannot be selected.', { o:S.blocked.stock }))}</strong> ${esc(reasonText(S.blocked.reason))}${S.blocked.reason[0] === 'covered' ? ` <a class="link" href="#" data-act="open-existing">${esc(t('Open'))}</a>` : ''}</span></div>` : '';
  const notice = S.notice === 'notfound' ? `<div class="alert tone-info" role="status" style="margin-top:.5rem">${esc(t('The Order you came from was not found or you cannot open it. Search for an Order.'))}</div>` : '';
  const w = o && WH[o.wh];
  const facts = o ? `<div class="grid4" style="margin-top:1rem">
      ${ro('Stock ID', `<a class="link mono" href="#" data-act="link">${esc(o.stock)}</a>`, { html:true })}
      ${ro('Admitting warehouse · admission', `${w.name} · ${o.admitted}`)}
      ${ro('Admitted collis', String(o.collis), { mono:true })}
      ${ro('Gross weight', o.weight || t('Unknown'), { mono:!!o.weight, marker:o.weight ? null : 'Unknown' })}
      ${ro('Depositor (Invoicing company)', o.depositor, { marker:o.depositor ? null : 'Missing' })}
      ${ro('Depositor ΑΦΜ', o.depositorVat, { mono:true })}
      ${ro('Operational Client', o.client)}
      ${ro('Supplier', o.supplier, { marker:o.supplier ? null : 'Missing' })}
      ${ro('Supplier ΑΦΜ', o.supplierVat, { mono:true })}
    </div>` : `<div class="empty-box" style="margin-top:1rem">${esc(t('Select an Order to see its admission and parties.'))}</div>`;
  return `<section class="card"><div class="card-header"><h2 class="card-title text-subheading">${esc(t('Order relationship'))}${bn(1)}${bn(2)}${bn(3)}</h2></div><div class="card-body">
    <div class="nc">${nc('Order search picker with eligibility reasons', 'FRO-347/350 SearchPicker pattern plus a reason line and Open link per ineligible match; no catalogue component shows disabled options with reasons')}
    <div class="field picker"><label class="label" for="order-search">${esc(t('Order'))}<span class="req">*</span></label>
      <div class="with-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input id="order-search" class="control" role="combobox" aria-expanded="${S.open}" aria-controls="order-list" aria-autocomplete="list" autocomplete="off" placeholder="${esc(t('Search Stock ID, reference, vessel or colli code…'))}" value="${esc(S.query)}"></div>
      ${list}</div></div>${blocked}${notice}${facts}</div></section>`;
}

function detailsCard() {
  const o = S.order; const w = o && WH[o.wh];
  const permitHint = o ? (w.permit ? t('Prefilled from {w}. You can change it.', { w:w.name }) : t('No single Customs Storage licence on {w}; enter the permit number.', { w:w.name })) : '';
  const preHint = o ? t('Prefilled from {w}. You can change it.', { w:w.name }) : '';
  const dtErr = S.errors.date;
  return `<section class="card"><div class="card-header"><h2 class="card-title text-subheading">${esc(t('Customs Storage Entry details'))}${bn(4)}</h2></div><div class="card-body subcards">
    <div class="subcard"><h3 class="text-subheading">${esc(t('Entry details'))}</h3><div class="grid3">
      ${ro('Entry number', t('Assigned on creation'))}
      <div class="field"><label class="label" for="f-date">${esc(t('Entry date & time'))}<span class="req">*</span></label>
        <div class="dt-row"><input id="f-date" class="control mono${dtErr ? ' invalid' : ''}" type="date" data-f="date" value="${esc(S.f.date)}" aria-invalid="${!!dtErr}"><input aria-label="${esc(t('Entry date & time'))}" class="control mono${dtErr ? ' invalid' : ''}" type="time" data-f="time" value="${esc(S.f.time)}"></div>
        ${dtErr ? `<span class="error" role="alert">${esc(dtErr)}</span>` : ''}</div>
      ${input('mrn', 'Entry MRN', { optional:true, mono:true, max:500 })}
      ${input('mrnDate', 'Entry MRN date', { optional:true, type:'date', mono:true })}
      ${input('tariff', 'Tariff classification code', { optional:true, mono:true, inputmode:'numeric', max:10, hint:t('Digits only, up to 10') })}
    </div></div>
    <div class="subcard"><h3 class="text-subheading">${esc(t('Goods and transport'))}</h3><div class="grid2">
      ${input('goods', 'Goods description for printed copies', { optional:true, textarea:true, full:true, max:2000 })}
      ${input('transport', 'Transport means / number', { optional:true })}
      ${ro('Transport Company', 'FRONT LINE Forwarding & Agency LTD')}
    </div></div>
    <div class="subcard"><h3 class="text-subheading">${esc(t('Warehouse operator'))}${bn(5)}</h3><div class="grid3">
      ${input('permit', 'Permit number', { optional:true, mono:true, hint:permitHint })}
      ${input('operator', 'Operator name', { optional:true, hint:preHint })}
      ${input('opVat', 'Operator ΑΦΜ', { optional:true, mono:true })}
      ${input('address', 'Warehouse address', { optional:true, full:true })}
    </div></div>
  </div></section>`;
}

function invoicesPanel() {
  const o = S.order;
  if (!o) return `<section class="card"><div class="card-body"><div class="empty-box">${esc(t('Select an Order to see its invoices.'))}</div></div></section>`;
  const inv = o.invoices;
  const head = `<div class="card-header"><div><h2 class="card-title text-subheading">${esc(t('Related Supplier Invoices ({n})', { n:inv.length }))}${bn(6)}</h2><p class="card-sub">${esc(t('Active invoices of type Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) on the selected Order.'))}</p></div></div>`;
  if (!inv.length) return `<section class="card">${head}<div class="card-body"><div class="empty-box">${esc(t('This Order has no matching invoices yet. You can still create the entry.'))}</div></div></section>`;
  const allEur = inv.every(i => i.cur === 'EUR');
  const rows = inv.map(i => `<tr><td><a class="link mono" href="#" data-act="link">SI-${i.id}</a></td><td class="mono">${esc(i.no)}</td><td class="mono">${esc(i.date)}</td><td>${esc(o.supplier || '—')}</td><td>Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)</td><td class="mono">${i.cur}</td>
    <td class="cell-end mono">${fmt(i.net)}</td><td class="cell-end mono">0.00</td><td class="cell-end mono">${fmt(vatCents(i.net))}</td></tr>`).join('');
  const totalNet = inv.reduce((a, i) => a + i.net, 0);
  const foot = allEur ? `<tfoot><tr><td colspan="6">${esc(t('Totals'))} (EUR)</td><td class="cell-end mono">${fmt(totalNet)}</td><td class="cell-end mono">0.00</td><td class="cell-end mono">${fmt(vatCents(totalNet))}</td></tr></tfoot>` : '';
  return `<section class="card">${head}<div class="card-body stack">
    ${allEur ? '' : `<div class="alert tone-warning" role="status">${esc(t('Mixed or non-EUR currency: totals and total Statistical VAT are not shown.'))}</div>`}
    <div class="${allEur ? 'nc' : ''}">${allEur ? nc('Table totals footer', 'components/ui/table.tsx has no TFoot; one tfoot row on the same column grid') : ''}
    <div class="table-wrap"><table><thead><tr><th>${esc(t('Invoice ID'))}</th><th>${esc(t('Invoice number'))}</th><th>${esc(t('Invoice date'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Invoice type'))}</th><th>${esc(t('Currency'))}</th>
    <th class="cell-end">${esc(t('Net value'))}</th><th class="cell-end">${esc(t('Actual VAT'))}</th><th class="cell-end">${esc(t('Statistical VAT (hypothetical, 24%)'))}</th></tr></thead><tbody>${rows}</tbody>${foot}</table></div></div>
    <p class="hint">${esc(t('Statistical VAT is reporting information only. It is not VAT charged or payable.'))}</p></div></section>`;
}

function exportPanel() {
  const o = S.order;
  let body;
  if (!o) body = `<div class="empty-box">${esc(t('Select an Order to see its Export.'))}</div>`;
  else if (!o.invoices.length) body = `<div class="empty-box">${esc(t('No matching invoices, so no Export.'))}</div>`;
  else if (!o.export) body = `<div class="empty-box">${esc(t('None of the matching invoices is in an Export yet.'))}</div>`;
  else {
    const e = o.export; const inExp = o.invoices.filter(i => i.exp === e.id).length;
    const partial = inExp < o.invoices.length ? `<div class="alert tone-info" role="status" style="margin-bottom:1rem">${esc(t('{n} of {m} invoices are in this Export.', { n:inExp, m:o.invoices.length }))}</div>` : '';
    const tone = e.status === 'Completed' ? 'tone-success' : 'tone-warning';
    body = `${partial}<div class="grid4">${ro('Export', `<a class="link mono" href="#" data-act="link">${esc(e.id)}</a>`, { html:true })}${ro('Export MRN', e.mrn, { mono:true })}${ro('Export MRN date', e.date, { mono:true })}
      ${ro('Customs status', `<span class="pill ${tone}">${esc(t(e.status))}</span>`, { html:true })}</div><p class="hint" style="margin-top:.75rem">${esc(t('Read from the Export. Change it on the Export page.'))}</p>`;
  }
  return `<section class="card"><div class="card-header"><h2 class="card-title text-subheading">${esc(t('Related Export'))}${bn(7)}</h2></div><div class="card-body">${body}</div></section>`;
}

function render() {
  const nav = ['Dashboard','Purchase orders','Shipments','Companies'].map((n, i) => `<a href="#" ${i === 1 ? 'aria-current="page"' : ''}>${esc(t(n))}</a>`).join('');
  const header = `<header class="shell-header"><div class="shell-inner"><div style="display:flex;align-items:center;gap:1rem"><span class="brand">Frontline</span><nav class="nav">${nav}</nav></div>
    <div class="lang"><button type="button" data-lang="en" aria-pressed="${lang === 'en'}">EN</button><button type="button" data-lang="el" aria-pressed="${lang === 'el'}">EL</button></div></div></header>`;
  let mainHtml;
  if (scenario === 'denied') {
    mainHtml = `<div class="topbar"><h1 class="text-title">${esc(t('Create Customs Storage Entry'))}</h1></div><div class="alert tone-danger" role="alert">${esc(t('You do not have permission to create Customs Storage Entries.'))}</div>`;
  } else if (S.result) {
    const r = S.result;
    mainHtml = `<div class="topbar"><div><h1 class="text-title">${esc(t('Customs Storage Entry {e}', { e:r.number }))}</h1>${r.origin ? `<p style="margin:.25rem 0 0"><a class="link" href="#" data-act="back">${esc(t('Back to Order {o}', { o:r.origin }))}</a></p>` : ''}</div></div>
      <div class="alert tone-info">${esc(t('Preview: the details page (FRO-354) opens here.'))}</div>`;
  } else if (S.left) {
    mainHtml = `<div class="alert tone-info">${esc(t('Preview: you returned to {p}.', { p:S.left }))}</div>`;
  } else {
    const tabs = ['overview','invoices','export'].map(id => `<button type="button" role="tab" class="tab" id="tab-${id}" aria-controls="panel" aria-selected="${S.tab === id}" tabindex="${S.tab === id ? 0 : -1}" data-tab="${id}">${esc(tabLabel(id))}</button>`).join('');
    const panel = S.tab === 'overview' ? `<div class="sections">${orderCard()}${detailsCard()}</div>` : S.tab === 'invoices' ? invoicesPanel() : exportPanel();
    const banner = S.banner ? `<div class="alert ${S.banner.tone}" role="${S.banner.tone === 'tone-danger' ? 'alert' : 'status'}" style="margin-bottom:1rem"><span>${S.banner.html}</span></div>` : '';
    const canCreate = !!S.order && !S.pending && scenario !== 'lookup-loading';
    mainHtml = `<div class="topbar"><div><h1 class="text-title">${esc(t('Create Customs Storage Entry'))}</h1><p class="muted" style="margin:.25rem 0 0">${esc(t('Record the storage admission of one Order under Customs Storage.'))}</p>
      ${S.origin && scenario !== 'preselect-notfound' ? `<p style="margin:.25rem 0 0"><a class="link" href="#" data-act="cancel">${esc(t('Back to Order {o}', { o:S.origin }))}</a></p>` : ''}</div></div>
      ${banner}
      <form id="create-form" novalidate><div class="card card-pad"><div class="tablist" role="tablist" aria-label="${esc(t('Create Customs Storage Entry'))}">${tabs}</div>
      <div class="tabpanel" role="tabpanel" id="panel" aria-labelledby="tab-${S.tab}">${panel}</div></div>
      <div class="page-actions-row">${bn(8)}<button type="button" class="btn btn-secondary btn-md" data-act="cancel">${esc(t('Cancel'))}</button>
      <button type="submit" class="btn btn-primary btn-md" ${canCreate ? '' : 'disabled'}>${esc(S.pending ? t('Creating…') : t('Create Customs Storage Entry'))}</button></div></form>`;
  }
  const modal = S.modal ? `<div class="scrim"><div class="scrim-bg" data-act="keep"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title" style="width:min(100%,28rem)">
      <div class="modal-head"><h2 id="m-title" class="text-subheading" style="margin:0">${esc(t('Discard this entry?'))}</h2></div>
      <div class="modal-body">${esc(t('The Order selection and the values you entered will be lost.'))}</div>
      <div class="modal-foot"><button type="button" class="btn btn-secondary btn-md" data-act="keep" id="m-keep">${esc(t('Keep editing'))}</button><button type="button" class="btn btn-danger btn-md" data-act="discard">${esc(t('Discard'))}</button></div></div></div>` : '';
  const toast = S.toast ? `<div class="toast" role="status" aria-live="polite">${esc(S.toast)}</div>` : '';
  const tools = `<details class="tools"><summary>Preview controls <span aria-hidden="true">▾</span></summary><div class="tools-body">
      <span class="label">Scenario (?state=)</span><div class="seg">${SCENARIOS.map(s => `<button type="button" data-scn="${s}" aria-pressed="${s === scenario}">${s}</button>`).join('')}</div>
      <div class="seg"><button type="button" data-act="toggle-nc" aria-pressed="${!document.body.classList.contains('hide-nc')}">New component markers</button><button type="button" data-act="toggle-notes" aria-pressed="${S.notes}">Business notes</button></div>
      <p class="hint" style="margin:0">Fictional data. Pick PO-0000005 (4 EUR invoices, €803.62 → €192.87), PO-0000006 (no invoices, unknown weight, missing depositor, two licences) or PO-0000007 (mixed currency, 2 of 3 in Export).</p></div></details>`;
  const notes = S.notes ? `<aside class="notes-panel" aria-label="Business notes"><div class="card-header"><strong>Business notes</strong><button type="button" class="btn btn-ghost btn-sm" data-act="toggle-notes">Close</button></div><ol>${NOTES.map((n, i) => `<li id="note-${i + 1}" class="${S.hl === i + 1 ? 'hl' : ''}"><strong>${i + 1}. ${esc(n[0])}</strong><br><span class="text-body-sm">${esc(n[1])}</span></li>`).join('')}</ol></aside>` : '';
  document.getElementById('sim-banner').textContent = 'Static preview · fictional data · nothing is saved';
  document.documentElement.lang = lang;
  document.getElementById('app').innerHTML = header + `<main>${mainHtml}</main>` + modal + toast + tools + notes;
}

/* ------------------------------------------------------------------ Validation (page-side; server is authoritative) */
function validate() {
  const e = {}; const f = S.f; const n = nowLocal();
  if (!f.date || !f.time) e.date = t('Enter the entry date and time.');
  else if (`${f.date}T${f.time}` > `${n.date}T${n.time}`) e.date = t('The entry date and time cannot be later than now.');
  if (f.mrnDate && f.mrnDate > n.date) e.mrnDate = t('The Entry MRN date cannot be later than today.');
  if (f.tariff && !/^\d{1,10}$/.test(f.tariff)) e.tariff = t('Use digits only, up to 10.');
  for (const k of ['mrn','transport','permit','operator','opVat','address']) if (f[k].length > 500) e[k] = t('Use up to {n} characters.', { n:500 });
  if (f.goods.length > 2000) e.goods = t('Use up to {n} characters.', { n:2000 });
  return e;
}
function submit() {
  S.errors = validate();
  if (Object.keys(S.errors).length) { S.tab = 'overview'; S.banner = { tone:'tone-danger', html:esc(t('Fix the highlighted fields.')) }; render(); const first = document.querySelector('.invalid'); if (first) first.focus(); return; }
  S.pending = true; S.banner = null; render();
  setTimeout(() => {
    S.pending = false;
    if (scenario === 'save-fail') S.banner = { tone:'tone-danger', html:esc(t('The entry could not be created. Nothing was saved. Your values are kept.')) };
    else if (scenario === 'duplicate') S.banner = { tone:'tone-warning', html:`${esc(t('Customs Storage Entry {e} was created for this Order by someone else. Your values are kept.', { e:'1043' }))} <a class="link" href="#" data-act="open-existing">${esc(t('Open'))}</a>` };
    else if (scenario === 'unknown-outcome') {
      S.banner = { tone:'tone-info', html:esc(t('We could not confirm whether the entry was created. Checking the Order…')) }; S.pending = true; render();
      setTimeout(() => { S.pending = false; S.banner = { tone:'tone-info', html:esc(t('No entry was created. You can try again.')) }; render(); }, 1200); return;
    } else { S.result = { number:'1043', origin:S.origin }; S.dirty = false; S.toast = t('Customs Storage Entry {e} created.', { e:'1043' }); setTimeout(() => { S.toast = null; render(); }, 3500); }
    render();
  }, 700);
}
function closePicker() { S.open = false; if (S.order) S.query = S.order.stock; }
function leave() { S.left = S.origin ? t('Order {o}', { o:S.origin }) : t('Orders list'); S.modal = null; render(); }

/* ------------------------------------------------------------------ Events */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-lang],[data-tab],[data-pick],[data-act],[data-scn],[data-note]');
  if (!el) { if (S.open && !ev.target.closest('.picker')) { closePicker(); render(); } return; }
  if (el.dataset.lang) { lang = el.dataset.lang; render(); return; }
  if (el.dataset.tab) { S.tab = el.dataset.tab; render(); document.getElementById('tab-' + S.tab).focus(); return; }
  if (el.dataset.scn) { scenario = el.dataset.scn; history.replaceState(null, '', '?state=' + scenario); reset(); render(); return; }
  if (el.dataset.note) { S.notes = true; S.hl = +el.dataset.note; render(); document.getElementById('note-' + S.hl).scrollIntoView({ block:'nearest' }); return; }
  if (el.dataset.pick) { const o = ORDERS.find(x => x.id === +el.dataset.pick); if (o.reason) return; selectOrder(o); render(); return; }
  ev.preventDefault();
  switch (el.dataset.act) {
    case 'cancel': if (S.dirty) { S.modal = 'discard'; render(); document.getElementById('m-keep').focus(); } else leave(); break;
    case 'keep': S.modal = null; render(); document.querySelector('[data-act=cancel].btn').focus(); break;
    case 'discard': leave(); break;
    case 'retry-search': scenario = 'blank'; S.open = true; render(); break;
    case 'toggle-nc': document.body.classList.toggle('hide-nc'); render(); break;
    case 'toggle-notes': S.notes = !S.notes; render(); break;
    case 'back': S.left = t('Order {o}', { o:S.result.origin }); S.result = null; render(); break;
  }
});
document.addEventListener('input', ev => {
  const el = ev.target;
  if (el.id === 'order-search') { S.query = el.value; S.open = true; S.active = -1; if (S.order && el.value !== S.order.stock) { /* typing never changes the selection */ } render(); const i = document.getElementById('order-search'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); return; }
  if (el.dataset.f) { S.f[el.dataset.f] = el.value; S.touched[el.dataset.f] = true; S.dirty = true; delete S.errors[el.dataset.f]; }
});
document.addEventListener('focusin', ev => { if (ev.target.id === 'order-search' && !S.open) { S.open = true; render(); const i = document.getElementById('order-search'); i.focus(); } });
document.addEventListener('keydown', ev => {
  if (ev.target.id === 'order-search' && S.open) {
    const opts = [...document.querySelectorAll('[data-pick]')];
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); S.active = Math.max(0, Math.min(opts.length - 1, S.active + (ev.key === 'ArrowDown' ? 1 : -1))); render(); const i = document.getElementById('order-search'); i.focus(); return; }
    if (ev.key === 'Enter') { ev.preventDefault(); const b = opts[S.active]; if (b && b.getAttribute('aria-disabled') !== 'true') { selectOrder(ORDERS.find(x => x.id === +b.dataset.pick)); render(); document.getElementById('order-search').focus(); } return; }
    if (ev.key === 'Escape') { closePicker(); render(); document.getElementById('order-search').focus(); return; }
  }
  if (ev.key === 'Escape' && S.modal) { S.modal = null; render(); document.querySelector('[data-act=cancel].btn').focus(); return; }
  if (ev.target.getAttribute('role') === 'tab' && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')) {
    const ids = ['overview','invoices','export']; const i = ids.indexOf(S.tab);
    S.tab = ids[(i + (ev.key === 'ArrowRight' ? 1 : 2)) % 3]; render(); document.getElementById('tab-' + S.tab).focus();
  }
});
document.addEventListener('submit', ev => { ev.preventDefault(); submit(); });
window.addEventListener('beforeunload', ev => { if (S.dirty && !S.result) { ev.preventDefault(); ev.returnValue = ''; } });
render();
