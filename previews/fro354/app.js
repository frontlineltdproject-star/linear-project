'use strict';
/* FRO-354 Customs Storage Entry details — static preview. Fixture data only; every operation is a
   browser-local simulation. Styles mirror frontline-forwarding-client DESIGN.md, theme.css and
   components/ui at main 5c51030 (same base as the FRO-353 preview). */

/* ------------------------------------------------------------------ Greek copy (proposed; confirm with the office) */
const EL = {
  'Dashboard':'Πίνακας ελέγχου','Purchase orders':'Παραγγελίες αγοράς','Shipments':'Αποστολές','Companies':'Εταιρείες',
  'Customs Storage Entry {e}':'Δελτίο Εισόδου {e}','Order {o} · {d}':'Παραγγελία {o} · {d}','Back to Order {o}':'Επιστροφή στην παραγγελία {o}',
  'Overview':'Επισκόπηση','Related Supplier Invoices ({n})':'Σχετικά τιμολόγια προμηθευτών ({n})','Related Export':'Σχετική εξαγωγή',
  'Order relationship':'Σύνδεση με παραγγελία','Order':'Παραγγελία','Search Stock ID, reference, vessel or colli code…':'Αναζήτηση Stock ID, αναφοράς, πλοίου ή κωδικού κόλι…',
  'Stock ID':'Stock ID','Admitting warehouse · admission':'Αποθήκη παραλαβής · παραλαβή','Admitted collis':'Κόλα παραλαβής','Gross weight':'Μικτό βάρος',
  'Depositor (Invoicing company)':'Αποθέτης (εταιρεία τιμολόγησης)','Depositor ΑΦΜ':'ΑΦΜ αποθέτη','Operational Client':'Πελάτης','Supplier':'Προμηθευτής','Supplier ΑΦΜ':'ΑΦΜ προμηθευτή',
  'Unknown':'Άγνωστο','Missing':'Λείπει',
  'Customs Storage Entry details':'Στοιχεία Δελτίου Εισόδου','Entry details':'Στοιχεία δελτίου','Goods and transport':'Εμπορεύματα και μεταφορά','Warehouse operator':'Διαχειριστής αποθήκης',
  'Entry number':'Αριθμός δελτίου','Entry date & time':'Ημερομηνία και ώρα δελτίου','Entry MRN':'MRN δελτίου','Entry MRN date':'Ημερομηνία MRN δελτίου','Optional':'Προαιρετικό',
  'Tariff classification code':'Δασμολογική κλάση','Digits only, up to 10':'Μόνο ψηφία, έως 10',
  'Goods description for printed copies':'Περιγραφή εμπορευμάτων για τα αντίτυπα','Transport means / number':'Μεταφορικό μέσο / αριθμός','Transport Company':'Μεταφορική εταιρεία',
  'Permit number':'Αριθμός άδειας','Operator name':'Επωνυμία διαχειριστή','Operator ΑΦΜ':'ΑΦΜ διαχειριστή','Warehouse address':'Διεύθυνση αποθήκης',
  'Created by {u} · {d}':'Δημιουργήθηκε από {u} · {d}',
  'Edit':'Επεξεργασία','Save':'Αποθήκευση','Saving…':'Αποθήκευση…','Cancel':'Άκυρο','Retry':'Επανάληψη','Loading…':'Φόρτωση…','Open':'Άνοιγμα','Refresh':'Ανανέωση',
  'Save or cancel the current edit first.':'Αποθηκεύστε ή ακυρώστε πρώτα την τρέχουσα επεξεργασία.',
  'Changes could not be saved. Nothing changed. Your edits are kept.':'Δεν ήταν δυνατή η αποθήκευση. Δεν άλλαξε τίποτα. Οι αλλαγές σας διατηρούνται.',
  'This entry changed since you opened it. Refresh to review the latest version. Your edits are kept.':'Το δελτίο άλλαξε από τότε που το ανοίξατε. Ανανεώστε για να δείτε την τελευταία έκδοση. Οι αλλαγές σας διατηρούνται.',
  'Fix the highlighted fields.':'Διορθώστε τα επισημασμένα πεδία.',
  'Enter the entry date and time.':'Συμπληρώστε την ημερομηνία και ώρα του δελτίου.',
  'The entry date and time cannot be later than now.':'Η ημερομηνία και ώρα του δελτίου δεν μπορεί να είναι μεταγενέστερη από τώρα.',
  'The Entry MRN date cannot be later than today.':'Η ημερομηνία MRN του δελτίου δεν μπορεί να είναι μεταγενέστερη της σημερινής.',
  'Use digits only, up to 10.':'Χρησιμοποιήστε μόνο ψηφία, έως 10.','Use up to {n} characters.':'Χρησιμοποιήστε έως {n} χαρακτήρες.',
  'Opened from Order {c}, which is covered by this entry (split after admission). The entry belongs to Order {o}.':'Άνοιγμα από την παραγγελία {c}, που καλύπτεται από αυτό το δελτίο (διαχωρισμός μετά την παραλαβή). Το δελτίο ανήκει στην παραγγελία {o}.',
  'Customs Storage Entry {e} created.':'Το Δελτίο Εισόδου {e} δημιουργήθηκε.',
  'Customs Storage Entry {e} was not found.':'Το Δελτίο Εισόδου {e} δεν βρέθηκε.',
  'You do not have permission to view Customs Storage Entries.':'Δεν έχετε δικαίωμα προβολής Δελτίων Εισόδου.',
  'Could not load the entry.':'Δεν ήταν δυνατή η φόρτωση του δελτίου.',
  'This Order is cancelled.':'Η παραγγελία είναι ακυρωμένη.',
  "The Order's customs regime is not Customs Storage.":'Το τελωνειακό καθεστώς της παραγγελίας δεν είναι Τελωνειακή Αποθήκευση.',
  'The Order has not been admitted to a Customs Storage warehouse yet.':'Η παραγγελία δεν έχει παραληφθεί ακόμη σε αποθήκη Τελωνειακής Αποθήκευσης.',
  'Goods were admitted under Order {o}. Create the entry from that Order.':'Τα εμπορεύματα παραλήφθηκαν με την παραγγελία {o}. Δημιουργήστε το δελτίο από εκείνη την παραγγελία.',
  'Already covered by Customs Storage Entry {e} (Order {o}).':'Καλύπτεται ήδη από το Δελτίο Εισόδου {e} (παραγγελία {o}).',
  'Current Order of this entry':'Τρέχουσα παραγγελία του δελτίου',
  'Covered by this entry (split after admission)':'Καλύπτεται από αυτό το δελτίο (διαχωρισμός μετά την παραλαβή)',
  'No Orders match your search.':'Καμία παραγγελία δεν ταιριάζει με την αναζήτηση.','Could not search Orders.':'Δεν ήταν δυνατή η αναζήτηση παραγγελιών.',
  'Select a different Order.':'Επιλέξτε διαφορετική παραγγελία.',
  'Change Order to {o}?':'Αλλαγή παραγγελίας σε {o};',
  'Collis, weight, parties, invoices and Export will be read from Order {o}. The entry number and the entry’s own fields stay the same.':'Κόλα, βάρος, μέρη, τιμολόγια και εξαγωγή θα διαβάζονται από την παραγγελία {o}. Ο αριθμός και τα στοιχεία του δελτίου δεν αλλάζουν.',
  'Order {o} was admitted at {w}. The warehouse operator values on this entry are not changed.':'Η παραγγελία {o} παραλήφθηκε στην {w}. Τα στοιχεία διαχειριστή αποθήκης του δελτίου δεν αλλάζουν.',
  'Confirm change':'Επιβεβαίωση αλλαγής',
  'The admitting warehouse is now {w}. Warehouse operator values were kept; review them.':'Η αποθήκη παραλαβής είναι πλέον η {w}. Τα στοιχεία διαχειριστή αποθήκης διατηρήθηκαν· ελέγξτε τα.',
  'Order changed to {o}.':'Η παραγγελία άλλαξε σε {o}.','Changes saved.':'Οι αλλαγές αποθηκεύτηκαν.',
  'Discard your changes?':'Απόρριψη των αλλαγών;','Your unsaved changes will be lost.':'Οι μη αποθηκευμένες αλλαγές θα χαθούν.','Keep editing':'Συνέχεια επεξεργασίας','Discard':'Απόρριψη',
  'Invoice ID':'Κωδ. τιμολογίου','Invoice number':'Αριθμός τιμολογίου','Invoice date':'Ημερομηνία τιμολογίου','Invoice type':'Τύπος τιμολογίου','Currency':'Νόμισμα','Net value':'Καθαρή αξία','Actual VAT':'Πραγματικός ΦΠΑ',
  'Statistical VAT (hypothetical, 24%)':'Στατιστικός ΦΠΑ (υποθετικός, 24%)','Totals':'Σύνολα',
  'Active invoices of type Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) on the owning Order.':'Ενεργά τιμολόγια τύπου Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) της παραγγελίας του δελτίου.',
  'Statistical VAT is reporting information only. It is not VAT charged or payable.':'Ο στατιστικός ΦΠΑ είναι μόνο πληροφορία αναφοράς. Δεν είναι ΦΠΑ που χρεώνεται ή οφείλεται.',
  'Mixed or non-EUR currency: totals and total Statistical VAT are not shown.':'Μικτό ή μη ευρώ νόμισμα: τα σύνολα και ο συνολικός στατιστικός ΦΠΑ δεν εμφανίζονται.',
  'This Order has no matching invoices yet.':'Η παραγγελία δεν έχει ακόμη αντίστοιχα τιμολόγια.',
  'Export':'Εξαγωγή','Export MRN':'MRN εξαγωγής','Export MRN date':'Ημερομηνία MRN εξαγωγής','Customs status':'Κατάσταση τελωνείου',
  'Awaiting EAD':'Αναμονή EAD','Awaiting IE599':'Αναμονή IE599','Completed':'Ολοκληρώθηκε',
  'No matching invoices, so no Export.':'Δεν υπάρχουν αντίστοιχα τιμολόγια, άρα ούτε εξαγωγή.',
  'None of the matching invoices is in an Export yet.':'Κανένα αντίστοιχο τιμολόγιο δεν βρίσκεται ακόμη σε εξαγωγή.',
  '{n} of {m} invoices are in this Export.':'{n} από {m} τιμολόγια βρίσκονται σε αυτή την εξαγωγή.',
  'Read from the Export. Change it on the Export page.':'Προέρχεται από την εξαγωγή. Αλλάξτε το στη σελίδα της εξαγωγής.',
  'Preview: you returned to {p}.':'Προεπισκόπηση: επιστρέψατε στη σελίδα {p}.','Order {o}':'παραγγελία {o}'
};
let lang = 'en';
function t(k, v) { let s = lang === 'el' && EL[k] ? EL[k] : k; if (v) for (const [a, b] of Object.entries(v)) s = s.split('{' + a + '}').join(b); return s; }
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);

/* ------------------------------------------------------------------ Fixtures (fictional) */
const WH = {
  ath: { name:'ATH-HUB · Demo Athens Hub' },
  ath2:{ name:'ATH-HUB-2 · Demo Athens Hub 2' }
};
const INV = (id, no, date, cur, net, exp) => ({ id, no, date, cur, net, exp });
const ORDERS = {
  'PO-0000005': { stock:'PO-0000005', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.', supplierVat:'800000001', depositor:'Demo Invoicing Ltd', depositorVat:'800000002',
    wh:'ath', admitted:'20/10/2026 09:42', collis:10, weight:'1,284.50 kg',
    invoices:[INV(301,'INV-7781','12/10/2026','EUR',25000,'EXP-31'),INV(302,'INV-7782','12/10/2026','EUR',19999,'EXP-31'),INV(303,'INV-7790','14/10/2026','EUR',21050,'EXP-31'),INV(304,'INV-7801','15/10/2026','EUR',14313,'EXP-31')],
    export:{ id:'EXP-31', mrn:'26GR0000EX00000412', date:'24/10/2026', status:'Awaiting IE599' } },
  'PO-0000006': { stock:'PO-0000006', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.', supplierVat:'800000001', depositor:null, depositorVat:null,
    wh:'ath2', admitted:'22/10/2026 14:05', collis:2, weight:null, invoices:[], export:null },
  'PO-0000007': { stock:'PO-0000007', status:'IN_STOCK', client:'Demo Client Company', supplier:null, supplierVat:null, depositor:'Demo Invoicing Ltd', depositorVat:'800000002',
    wh:'ath', admitted:'23/10/2026 10:15', collis:3, weight:'312.00 kg',
    invoices:[INV(311,'INV-9001','20/10/2026','EUR',100000,'EXP-33'),INV(312,'INV-9002','20/10/2026','USD',50000,'EXP-33'),INV(313,'INV-9010','25/10/2026','EUR',12040,null)],
    export:{ id:'EXP-33', mrn:'', date:'', status:'Awaiting EAD' } }
};
/* Change Order search candidates; reason is computed relative to the open entry. */
const SEARCH = [
  { stock:'PO-0000005', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.' },
  { stock:'PO-0000005_1', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.', childOf:'PO-0000005' },
  { stock:'PO-0000006', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.' },
  { stock:'PO-0000007', status:'IN_STOCK', client:'Demo Client Company', supplier:'—' },
  { stock:'PO-0000008', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.', reason:['covered','1041','PO-0000003'] },
  { stock:'PO-0000002', status:'EXPECTED_READINESS', client:'Demo Client Company', supplier:'Demo Supplier S.A.', reason:['notAdmitted'] },
  { stock:'PO-0000001', status:'IN_STOCK', client:'Demo Client Company', supplier:'Demo Supplier S.A.', reason:['notStorage'] },
  { stock:'PO-0000009', status:'CANCELLED', client:'Demo Client Company', supplier:'Demo Supplier S.A.', reason:['cancelled'] }
];
const STATUS_TONE = { IN_STOCK:'tone-cyan', EXPECTED_READINESS:'tone-violet', CANCELLED:'tone-danger' };
function reasonFor(x) {
  if (x.stock === S.entry.owner) return ['current'];
  if (x.childOf === S.entry.owner) return ['coveredHere'];
  return x.reason || null;
}
function reasonText(r) {
  switch (r[0]) {
    case 'current': return t('Current Order of this entry');
    case 'coveredHere': return t('Covered by this entry (split after admission)');
    case 'cancelled': return t('This Order is cancelled.');
    case 'notStorage': return t("The Order's customs regime is not Customs Storage.");
    case 'notAdmitted': return t('The Order has not been admitted to a Customs Storage warehouse yet.');
    case 'admittedUnder': return t('Goods were admitted under Order {o}. Create the entry from that Order.', { o:r[1] });
    case 'covered': return t('Already covered by Customs Storage Entry {e} (Order {o}).', { e:r[1], o:r[2] });
  }
  return '';
}

/* ------------------------------------------------------------------ Money: exact cents, decimal half-up */
const vatCents = c => Math.floor((c * 24 + 50) / 100);
const fmt = c => (c / 100).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });

/* ------------------------------------------------------------------ State */
const params = new URLSearchParams(location.search);
const SCENARIOS = ['default','from-order','from-child','created','view-only','no-invoices','mixed-currency','loading','load-error','not-found','denied','save-fail','stale'];
let scenario = SCENARIOS.includes(params.get('state')) ? params.get('state') : 'default';
let S;
function nowLocal() { const d = new Date(); const p = n => String(n).padStart(2,'0'); return { date:`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`, time:`${p(d.getHours())}:${p(d.getMinutes())}` }; }
const SAVED = { date:'2026-10-20', time:'10:05', mrn:'26GR0000CS00001042', mrnDate:'2026-10-20', tariff:'0402100000', goods:'Ship spares — engine parts, 10 collis', transport:'Truck DEMO-1234',
  permit:'DEMO-CS-0001', operator:'Demo Hub Operator S.A.', opVat:'800000003', address:'Demo Street 12, 18545 Piraeus' };
function reset() {
  const owner = scenario === 'no-invoices' ? 'PO-0000006' : scenario === 'mixed-currency' ? 'PO-0000007' : 'PO-0000005';
  S = { tab:'overview', entry:{ number:'1042', owner, f:{ ...SAVED } }, edit:null, draft:null, errors:{}, banner:null, pending:false,
    query:'', open:false, active:-1, pick:null, whNotice:null, modal:null, toast:null, notes:false, left:null,
    origin: scenario === 'from-order' || scenario === 'created' ? 'PO-0000005' : scenario === 'from-child' ? 'PO-0000005_1' : null,
    child: scenario === 'from-child' ? 'PO-0000005_1' : null,
    canEdit: scenario !== 'view-only' };
  if (scenario === 'created') { S.toast = ['Customs Storage Entry {e} created.', { e:'1042' }]; setTimeout(() => { S.toast = null; render(); }, 3500); }
}
reset();
const dirty = () => !!S.edit && (S.edit === 'order' ? !!S.pick : JSON.stringify(S.draft) !== JSON.stringify(S.entry.f));

/* ------------------------------------------------------------------ Business notes (from the agreed decisions) */
const NOTES = [
  ['Header and return','Title is the entry number. Subtitle: owning Order · entry date-time. Back to Order only when you came from an Order (owner or covered child). No status or active badge.'],
  ['Covered child','Opening from a child split after admission shows a banner naming the child and the owning Order. All values stay the owning Order’s; nothing is relinked.'],
  ['One editor at a time','Each save carries the entry version you opened, so only one card can be in edit mode; the other Edit is disabled with a hint.'],
  ['Change Order','Same search and reasons as creation. The current Order and Orders already covered by this entry cannot be picked. Confirmation names the new Order; derived values refresh, entry number and entry fields stay.'],
  ['Warehouse values','Change Order never rewrites permit, operator, ΑΦΜ or address. If the new Order was admitted at another warehouse, the dialog and a notice ask you to review them.'],
  ['Entry fields','All ten entry-owned fields are editable with the FRO-353 rules. Entry number and Transport Company stay read-only. Created by comes from the FRO-319 audit.'],
  ['Invoices & Statistical VAT','Same derived table as creation: rows in their own currency, 24% half-up per row, totals only when all EUR (€803.62 → €192.87).'],
  ['Export','Read from the one Export holding the matching invoices; “n of m” for partial assignment. No editor here.'],
  ['Print','Print belongs to FRO-358. This page reserves its place in the header; FRO-358 adds the button (view authority).']
];
const bn = i => `<button type="button" class="bn" data-note="${i}" aria-label="Business note ${i}">${i}</button>`;
const nc = (label, why) => `<p class="nc-label">New component — ${esc(label)}: ${esc(why)}</p>`;

/* ------------------------------------------------------------------ Render helpers */
function ro(label, value, opts = {}) {
  const empty = value == null || value === '';
  const marker = opts.marker ? `<span class="marker">${esc(t(opts.marker))}</span>` : '';
  return `<div class="field${opts.full ? ' full' : ''}"><span class="label">${esc(t(label))}${marker}</span><div class="ro${empty ? ' empty' : ''}${opts.mono ? ' mono' : ''}">${empty ? '—' : (opts.html ? value : esc(value))}</div></div>`;
}
const dmy = iso => iso ? iso.split('-').reverse().join('/') : '';
function field(key, label, opts = {}) {
  const f = S.entry.f;
  if (S.edit !== 'details') {
    const v = key === 'mrnDate' ? dmy(f[key]) : f[key];
    return ro(label, v, { mono:opts.mono, full:opts.full });
  }
  const err = S.errors[key]; const id = 'f-' + key;
  const hint = opts.hint ? `<span class="hint">${esc(opts.hint)}</span>` : '';
  const control = opts.textarea
    ? `<textarea id="${id}" class="control${err ? ' invalid' : ''}" data-f="${key}" maxlength="${opts.max || 2000}" aria-invalid="${!!err}">${esc(S.draft[key])}</textarea>`
    : `<input id="${id}" class="control${err ? ' invalid' : ''}${opts.mono ? ' mono' : ''}" data-f="${key}" type="${opts.type || 'text'}" ${opts.inputmode ? `inputmode="${opts.inputmode}"` : ''} maxlength="${opts.max || 500}" value="${esc(S.draft[key])}" aria-invalid="${!!err}">`;
  return `<div class="field${opts.full ? ' full' : ''}"><label class="label" for="${id}">${esc(t(label))} <span class="opt">(${esc(t('Optional'))})</span></label>${control}${err ? `<span class="error" role="alert">${esc(err)}</span>` : hint}</div>`;
}
function editButton(card) {
  if (!S.canEdit || S.edit === card) return '';
  const blocked = !!S.edit;
  return `<div><button type="button" class="btn btn-secondary btn-sm" data-act="edit-${card}" ${blocked ? 'disabled aria-describedby="hint-' + card + '"' : ''}>${esc(t('Edit'))}</button>${blocked ? `<p class="edit-hint" id="hint-${card}">${esc(t('Save or cancel the current edit first.'))}</p>` : ''}</div>`;
}
function editFoot(card) {
  return `<div class="edit-foot"><button type="button" class="btn btn-secondary btn-md" data-act="cancel-edit">${esc(t('Cancel'))}</button><button type="button" class="btn btn-primary btn-md" data-act="save-${card}" ${S.pending || (card === 'order' && !S.pick) ? 'disabled' : ''}>${esc(S.pending ? t('Saving…') : t('Save'))}</button></div>`;
}
function cardBanner(card) {
  return S.banner && S.banner.card === card ? `<div class="alert ${S.banner.tone}" role="alert" style="margin-bottom:1rem"><span>${S.banner.html}</span></div>` : '';
}
const owner = () => ORDERS[S.entry.owner];
function tabLabel(id) { return id === 'overview' ? t('Overview') : id === 'invoices' ? t('Related Supplier Invoices ({n})', { n:owner().invoices.length }) : t('Related Export'); }

function orderCard() {
  const o = owner(); const w = WH[o.wh];
  let search = '';
  if (S.edit === 'order') {
    const q = S.query.trim().toLowerCase();
    let list = '';
    if (S.open) {
      const m = SEARCH.filter(x => !q || x.stock.toLowerCase().includes(q));
      list = `<ul class="popup" role="listbox" id="order-list">${m.length ? m.map((x, i) => { const r = reasonFor(x); return `<li role="option" aria-selected="${i === S.active}" aria-disabled="${!!r}">
        <${r ? 'div' : 'button type="button"'} class="opt-btn" data-pick="${x.stock}" aria-disabled="${!!r}" tabindex="-1" ${i === S.active ? 'style="background:var(--accent-subtle)"' : ''}>
        <span class="opt-main mono">${esc(x.stock)} <span class="pill ${STATUS_TONE[x.status] || 'tone-neutral'}">${esc(x.status)}</span></span>
        <span class="opt-sub">${esc(x.client)} · ${esc(x.supplier)}</span>
        ${r ? `<span class="reason">${esc(reasonText(r))}${r[0] === 'covered' ? ` <a class="link" href="#" data-act="link">${esc(t('Open'))}</a>` : ''}</span>` : ''}
        </${r ? 'div' : 'button'}></li>`; }).join('') : `<li class="opt-btn"><span class="opt-sub">${esc(t('No Orders match your search.'))}</span></li>`}</ul>`;
    }
    search = `<div class="nc" style="margin-bottom:1rem">${nc('Order search picker with eligibility reasons', 'same composition as FRO-353 (Input + popover list, FRO-350 SearchPicker pattern); adds the Current Order and Covered by this entry reasons')}
      <div class="field picker"><label class="label" for="order-search">${esc(t('Order'))}<span class="req">*</span></label>
      <div class="with-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input id="order-search" class="control" role="combobox" aria-expanded="${S.open}" aria-controls="order-list" aria-autocomplete="list" autocomplete="off" placeholder="${esc(t('Search Stock ID, reference, vessel or colli code…'))}" value="${esc(S.query)}"></div>${list}
      ${S.errors.order ? `<span class="error" role="alert">${esc(S.errors.order)}</span>` : ''}</div></div>`;
  }
  const facts = `<div class="grid4">
      ${ro('Stock ID', `<a class="link mono" href="#" data-act="link">${esc(o.stock)}</a>`, { html:true })}
      ${ro('Admitting warehouse · admission', `${w.name} · ${o.admitted}`)}
      ${ro('Admitted collis', String(o.collis), { mono:true })}
      ${ro('Gross weight', o.weight || t('Unknown'), { mono:!!o.weight, marker:o.weight ? null : 'Unknown' })}
      ${ro('Depositor (Invoicing company)', o.depositor, { marker:o.depositor ? null : 'Missing' })}
      ${ro('Depositor ΑΦΜ', o.depositorVat, { mono:true })}
      ${ro('Operational Client', o.client)}
      ${ro('Supplier', o.supplier, { marker:o.supplier ? null : 'Missing' })}
      ${ro('Supplier ΑΦΜ', o.supplierVat, { mono:true })}
    </div>`;
  return `<section class="card"><div class="card-header"><h2 class="card-title text-subheading">${esc(t('Order relationship'))}${bn(4)}</h2>${editButton('order')}</div><div class="card-body">
    ${cardBanner('order')}${search}${facts}${S.edit === 'order' ? editFoot('order') : ''}</div></section>`;
}

function detailsCard() {
  const f = S.entry.f;
  const editing = S.edit === 'details';
  const dtErr = S.errors.date;
  const dt = editing
    ? `<div class="field"><label class="label" for="f-date">${esc(t('Entry date & time'))}<span class="req">*</span></label>
        <div class="dt-row"><input id="f-date" class="control mono${dtErr ? ' invalid' : ''}" type="date" data-f="date" value="${esc(S.draft.date)}" aria-invalid="${!!dtErr}"><input aria-label="${esc(t('Entry date & time'))}" class="control mono${dtErr ? ' invalid' : ''}" type="time" data-f="time" value="${esc(S.draft.time)}"></div>
        ${dtErr ? `<span class="error" role="alert">${esc(dtErr)}</span>` : ''}</div>`
    : ro('Entry date & time', `${dmy(f.date)} ${f.time}`, { mono:true });
  const wn = S.whNotice ? `<div class="alert tone-warning" role="status" style="margin-bottom:.75rem">${esc(t('The admitting warehouse is now {w}. Warehouse operator values were kept; review them.', { w:WH[S.whNotice].name }))}</div>` : '';
  return `<section class="card"><div class="card-header"><h2 class="card-title text-subheading">${esc(t('Customs Storage Entry details'))}${bn(6)}</h2>${editButton('details')}</div><div class="card-body subcards">
    ${cardBanner('details')}
    <div class="subcard"><h3 class="text-subheading">${esc(t('Entry details'))}</h3><div class="grid3">
      ${ro('Entry number', S.entry.number, { mono:true })}
      ${dt}
      ${field('mrn', 'Entry MRN', { mono:true, max:500 })}
      ${field('mrnDate', 'Entry MRN date', { type:'date', mono:true })}
      ${field('tariff', 'Tariff classification code', { mono:true, inputmode:'numeric', max:10, hint:t('Digits only, up to 10') })}
    </div><p class="hint" style="margin:.75rem 0 0">${esc(t('Created by {u} · {d}', { u:'Demo Operator', d:'20/10/2026 10:07' }))}</p></div>
    <div class="subcard"><h3 class="text-subheading">${esc(t('Goods and transport'))}</h3><div class="grid2">
      ${field('goods', 'Goods description for printed copies', { textarea:true, full:true, max:2000 })}
      ${field('transport', 'Transport means / number')}
      ${ro('Transport Company', 'FRONT LINE Forwarding & Agency LTD')}
    </div></div>
    <div class="subcard"><h3 class="text-subheading">${esc(t('Warehouse operator'))}${bn(5)}</h3>${wn}<div class="grid3">
      ${field('permit', 'Permit number', { mono:true })}
      ${field('operator', 'Operator name')}
      ${field('opVat', 'Operator ΑΦΜ', { mono:true })}
      ${field('address', 'Warehouse address', { full:true })}
    </div></div>
    ${editing ? editFoot('details') : ''}
  </div></section>`;
}

function invoicesPanel() {
  const o = owner(); const inv = o.invoices;
  const head = `<div class="card-header"><div><h2 class="card-title text-subheading">${esc(t('Related Supplier Invoices ({n})', { n:inv.length }))}${bn(7)}</h2><p class="card-sub">${esc(t('Active invoices of type Αποθήκη Αποθήκευσης (Δελτίο Εισόδου) on the owning Order.'))}</p></div></div>`;
  if (!inv.length) return `<section class="card">${head}<div class="card-body"><div class="empty-box">${esc(t('This Order has no matching invoices yet.'))}</div></div></section>`;
  const allEur = inv.every(i => i.cur === 'EUR');
  const rows = inv.map(i => `<tr><td><a class="link mono" href="#" data-act="link">SI-${i.id}</a></td><td class="mono">${esc(i.no)}</td><td class="mono">${esc(i.date)}</td><td>${esc(o.supplier || '—')}</td><td>Αποθήκη Αποθήκευσης (Δελτίο Εισόδου)</td><td class="mono">${i.cur}</td>
    <td class="cell-end mono">${fmt(i.net)}</td><td class="cell-end mono">0.00</td><td class="cell-end mono">${fmt(vatCents(i.net))}</td></tr>`).join('');
  const totalNet = inv.reduce((a, i) => a + i.net, 0);
  const foot = allEur ? `<tfoot><tr><td colspan="6">${esc(t('Totals'))} (EUR)</td><td class="cell-end mono">${fmt(totalNet)}</td><td class="cell-end mono">0.00</td><td class="cell-end mono">${fmt(vatCents(totalNet))}</td></tr></tfoot>` : '';
  return `<section class="card">${head}<div class="card-body stack">
    ${allEur ? '' : `<div class="alert tone-warning" role="status">${esc(t('Mixed or non-EUR currency: totals and total Statistical VAT are not shown.'))}</div>`}
    <div class="${allEur ? 'nc' : ''}">${allEur ? nc('Table totals footer', 'same tfoot row as FRO-353; components/ui/table.tsx has no TFoot') : ''}
    <div class="table-wrap"><table><thead><tr><th>${esc(t('Invoice ID'))}</th><th>${esc(t('Invoice number'))}</th><th>${esc(t('Invoice date'))}</th><th>${esc(t('Supplier'))}</th><th>${esc(t('Invoice type'))}</th><th>${esc(t('Currency'))}</th>
    <th class="cell-end">${esc(t('Net value'))}</th><th class="cell-end">${esc(t('Actual VAT'))}</th><th class="cell-end">${esc(t('Statistical VAT (hypothetical, 24%)'))}</th></tr></thead><tbody>${rows}</tbody>${foot}</table></div></div>
    <p class="hint">${esc(t('Statistical VAT is reporting information only. It is not VAT charged or payable.'))}</p></div></section>`;
}

function exportPanel() {
  const o = owner(); let body;
  if (!o.invoices.length) body = `<div class="empty-box">${esc(t('No matching invoices, so no Export.'))}</div>`;
  else if (!o.export) body = `<div class="empty-box">${esc(t('None of the matching invoices is in an Export yet.'))}</div>`;
  else {
    const e = o.export; const inExp = o.invoices.filter(i => i.exp === e.id).length;
    const partial = inExp < o.invoices.length ? `<div class="alert tone-info" role="status" style="margin-bottom:1rem">${esc(t('{n} of {m} invoices are in this Export.', { n:inExp, m:o.invoices.length }))}</div>` : '';
    const tone = e.status === 'Completed' ? 'tone-success' : 'tone-warning';
    body = `${partial}<div class="grid4">${ro('Export', `<a class="link mono" href="#" data-act="link">${esc(e.id)}</a>`, { html:true })}${ro('Export MRN', e.mrn, { mono:true })}${ro('Export MRN date', e.date, { mono:true })}
      ${ro('Customs status', `<span class="pill ${tone}">${esc(t(e.status))}</span>`, { html:true })}</div><p class="hint" style="margin-top:.75rem">${esc(t('Read from the Export. Change it on the Export page.'))}</p>`;
  }
  return `<section class="card"><div class="card-header"><h2 class="card-title text-subheading">${esc(t('Related Export'))}${bn(8)}</h2></div><div class="card-body">${body}</div></section>`;
}

function modalHtml() {
  if (!S.modal) return '';
  let title, body, foot;
  if (S.modal === 'confirm') {
    const n = ORDERS[S.pick]; const diff = n.wh !== owner().wh;
    title = t('Change Order to {o}?', { o:S.pick });
    body = `<p style="margin:0">${esc(t('Collis, weight, parties, invoices and Export will be read from Order {o}. The entry number and the entry’s own fields stay the same.', { o:S.pick }))}</p>
      ${diff ? `<div class="alert tone-warning" style="margin-top:.75rem">${esc(t('Order {o} was admitted at {w}. The warehouse operator values on this entry are not changed.', { o:S.pick, w:WH[n.wh].name }))}</div>` : ''}`;
    foot = `<button type="button" class="btn btn-secondary btn-md" data-act="close-modal" id="m-first">${esc(t('Cancel'))}</button><button type="button" class="btn btn-primary btn-md" data-act="confirm-change">${esc(t('Confirm change'))}</button>`;
  } else {
    title = t('Discard your changes?'); body = esc(t('Your unsaved changes will be lost.'));
    foot = `<button type="button" class="btn btn-secondary btn-md" data-act="close-modal" id="m-first">${esc(t('Keep editing'))}</button><button type="button" class="btn btn-danger btn-md" data-act="discard">${esc(t('Discard'))}</button>`;
  }
  return `<div class="scrim"><div class="scrim-bg" data-act="close-modal"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title" style="width:min(100%,30rem)">
    <div class="modal-head"><h2 id="m-title" class="text-subheading" style="margin:0">${esc(title)}</h2></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
}

function render() {
  const nav = ['Dashboard','Purchase orders','Shipments','Companies'].map((n, i) => `<a href="#" ${i === 1 ? 'aria-current="page"' : ''}>${esc(t(n))}</a>`).join('');
  const header = `<header class="shell-header"><div class="shell-inner"><div style="display:flex;align-items:center;gap:1rem"><span class="brand">Frontline</span><nav class="nav">${nav}</nav></div>
    <div class="lang"><button type="button" data-lang="en" aria-pressed="${lang === 'en'}">EN</button><button type="button" data-lang="el" aria-pressed="${lang === 'el'}">EL</button></div></div></header>`;
  const title = t('Customs Storage Entry {e}', { e:S.entry.number });
  let mainHtml;
  if (S.left) mainHtml = `<div class="alert tone-info">${esc(t('Preview: you returned to {p}.', { p:S.left }))}</div>`;
  else if (scenario === 'loading') mainHtml = `<div class="topbar"><div class="skeleton" style="width:18rem"></div></div><div class="card card-pad stack"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`;
  else if (scenario === 'load-error') mainHtml = `<div class="topbar"><h1 class="text-title">${esc(title)}</h1></div><div class="alert tone-danger" role="alert"><span>${esc(t('Could not load the entry.'))} <button type="button" class="btn btn-secondary btn-sm" data-act="retry-load">${esc(t('Retry'))}</button></span></div>`;
  else if (scenario === 'not-found') mainHtml = `<div class="topbar"><h1 class="text-title">${esc(title)}</h1></div><div class="empty-box">${esc(t('Customs Storage Entry {e} was not found.', { e:'1099' }))}</div>`;
  else if (scenario === 'denied') mainHtml = `<div class="alert tone-danger" role="alert">${esc(t('You do not have permission to view Customs Storage Entries.'))}</div>`;
  else {
    const f = S.entry.f;
    const tabs = ['overview','invoices','export'].map(id => `<button type="button" role="tab" class="tab" id="tab-${id}" aria-controls="panel" aria-selected="${S.tab === id}" tabindex="${S.tab === id ? 0 : -1}" data-tab="${id}">${esc(tabLabel(id))}</button>`).join('');
    const panel = S.tab === 'overview' ? `<div class="sections">${orderCard()}${detailsCard()}</div>` : S.tab === 'invoices' ? invoicesPanel() : exportPanel();
    const childBanner = S.child ? `<div class="alert tone-info" role="status" style="margin-bottom:1rem"><span>${esc(t('Opened from Order {c}, which is covered by this entry (split after admission). The entry belongs to Order {o}.', { c:S.child, o:S.entry.owner }))}${bn(2)}</span></div>` : '';
    mainHtml = `<div class="topbar"><div><h1 class="text-title mono" style="font-family:var(--font-sans)">${esc(title)}${bn(1)}</h1>
      <p class="muted" style="margin:.25rem 0 0">${esc(t('Order {o} · {d}', { o:S.entry.owner, d:`${dmy(f.date)} ${f.time}` }))}</p>
      ${S.origin ? `<p style="margin:.25rem 0 0"><a class="link" href="#" data-act="back">${esc(t('Back to Order {o}', { o:S.origin }))}</a></p>` : ''}</div>
      <div class="topbar-actions"><span class="print-slot">Print — added by FRO-358${bn(9)}</span></div></div>
      ${childBanner}
      <div class="card card-pad"><div class="tablist" role="tablist" aria-label="${esc(title)}">${tabs}</div>
      <div class="tabpanel" role="tabpanel" id="panel" aria-labelledby="tab-${S.tab}">${panel}</div></div>`;
  }
  const toast = S.toast ? `<div class="toast" role="status" aria-live="polite">${esc(t(S.toast[0], S.toast[1]))}</div>` : '';
  const tools = `<details class="tools"><summary>Preview controls <span aria-hidden="true">▾</span></summary><div class="tools-body">
      <span class="label">Scenario (?state=)</span><div class="seg">${SCENARIOS.map(s => `<button type="button" data-scn="${s}" aria-pressed="${s === scenario}">${s}</button>`).join('')}</div>
      <div class="seg"><button type="button" data-act="toggle-nc" aria-pressed="${!document.body.classList.contains('hide-nc')}">New component markers</button><button type="button" data-act="toggle-notes" aria-pressed="${S.notes}">Business notes</button></div>
      <p class="hint" style="margin:0">Fictional data. Entry 1042 on PO-0000005 (4 EUR invoices, €803.62 → €192.87). Change Order: PO-0000006 (other warehouse, no invoices) or PO-0000007 (same warehouse, mixed currency). save-fail and stale simulate rejected saves.</p></div></details>`;
  const notes = S.notes ? `<aside class="notes-panel" aria-label="Business notes"><div class="card-header"><strong>Business notes</strong><button type="button" class="btn btn-ghost btn-sm" data-act="toggle-notes">Close</button></div><ol>${NOTES.map((n, i) => `<li id="note-${i + 1}" class="${S.hl === i + 1 ? 'hl' : ''}"><strong>${i + 1}. ${esc(n[0])}</strong><br><span class="text-body-sm">${esc(n[1])}</span></li>`).join('')}</ol></aside>` : '';
  document.getElementById('sim-banner').textContent = 'Static preview · fictional data · nothing is saved';
  document.documentElement.lang = lang;
  document.getElementById('app').innerHTML = header + `<main>${mainHtml}</main>` + modalHtml() + toast + tools + notes;
}

/* ------------------------------------------------------------------ Validation (page-side; FRO-319 is authoritative) */
function validate(f) {
  const e = {}; const n = nowLocal();
  if (!f.date || !f.time) e.date = t('Enter the entry date and time.');
  else if (`${f.date}T${f.time}` > `${n.date}T${n.time}`) e.date = t('The entry date and time cannot be later than now.');
  if (f.mrnDate && f.mrnDate > n.date) e.mrnDate = t('The Entry MRN date cannot be later than today.');
  if (f.tariff && !/^\d{1,10}$/.test(f.tariff)) e.tariff = t('Use digits only, up to 10.');
  for (const k of ['mrn','transport','permit','operator','opVat','address']) if (f[k].length > 500) e[k] = t('Use up to {n} characters.', { n:500 });
  if (f.goods.length > 2000) e.goods = t('Use up to {n} characters.', { n:2000 });
  return e;
}
function failBanner(card) {
  if (scenario === 'save-fail') return { card, tone:'tone-danger', html:esc(t('Changes could not be saved. Nothing changed. Your edits are kept.')) };
  if (scenario === 'stale') return { card, tone:'tone-warning', html:`${esc(t('This entry changed since you opened it. Refresh to review the latest version. Your edits are kept.'))} <button type="button" class="btn btn-secondary btn-sm" data-act="refresh">${esc(t('Refresh'))}</button>` };
  return null;
}
function finishEdit(card, msg) {
  S.edit = null; S.draft = null; S.pick = null; S.query = ''; S.open = false; S.errors = {}; S.banner = null; S.toast = msg;
  setTimeout(() => { S.toast = null; render(); }, 3000);
  render(); const b = document.querySelector(`[data-act=edit-${card}]`); if (b) b.focus();
}
function saveDetails() {
  S.errors = validate(S.draft);
  if (Object.keys(S.errors).length) { S.banner = { card:'details', tone:'tone-danger', html:esc(t('Fix the highlighted fields.')) }; render(); const first = document.querySelector('.invalid'); if (first) first.focus(); return; }
  S.pending = true; S.banner = null; render();
  setTimeout(() => { S.pending = false; const fb = failBanner('details'); if (fb) { S.banner = fb; render(); return; } S.entry.f = { ...S.draft }; finishEdit('details', ['Changes saved.']); }, 600);
}
function confirmChange() {
  S.modal = null; S.pending = true; render();
  setTimeout(() => {
    S.pending = false; const fb = failBanner('order'); if (fb) { S.banner = fb; render(); return; }
    const prev = owner().wh; const next = S.pick; S.entry.owner = next;
    S.whNotice = ORDERS[next].wh !== prev ? ORDERS[next].wh : null;
    finishEdit('order', ['Order changed to {o}.', { o:next }]);
  }, 600);
}
function cancelEdit() { const card = S.edit; S.edit = null; S.draft = null; S.pick = null; S.query = ''; S.open = false; S.errors = {}; S.banner = null; S.modal = null; render(); const b = document.querySelector(`[data-act=edit-${card}]`); if (b) b.focus(); }
function leave() { S.left = t('Order {o}', { o:S.origin }); S.modal = null; S.edit = null; render(); }
function pick(stock) { const x = SEARCH.find(s => s.stock === stock); if (!x || reasonFor(x)) return; S.pick = stock; S.query = stock; S.open = false; delete S.errors.order; }

/* ------------------------------------------------------------------ Events */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-lang],[data-tab],[data-pick],[data-act],[data-scn],[data-note]');
  if (!el) { if (S.open && !ev.target.closest('.picker')) { S.open = false; render(); } return; }
  if (el.dataset.lang) { lang = el.dataset.lang; render(); return; }
  if (el.dataset.tab) { S.tab = el.dataset.tab; render(); document.getElementById('tab-' + S.tab).focus(); return; }
  if (el.dataset.scn) { scenario = el.dataset.scn; history.replaceState(null, '', '?state=' + scenario); reset(); render(); return; }
  if (el.dataset.note) { S.notes = true; S.hl = +el.dataset.note; render(); document.getElementById('note-' + S.hl).scrollIntoView({ block:'nearest' }); return; }
  if (el.dataset.pick) { pick(el.dataset.pick); render(); return; }
  ev.preventDefault();
  switch (el.dataset.act) {
    case 'edit-details': S.edit = 'details'; S.draft = { ...S.entry.f }; render(); document.getElementById('f-date').focus(); break;
    case 'edit-order': S.edit = 'order'; S.query = ''; S.pick = null; render(); document.getElementById('order-search').focus(); break;
    case 'cancel-edit': cancelEdit(); break;
    case 'save-details': saveDetails(); break;
    case 'save-order': if (!S.pick) return; S.modal = 'confirm'; render(); document.getElementById('m-first').focus(); break;
    case 'confirm-change': confirmChange(); break;
    case 'close-modal': { const was = S.modal; S.modal = null; render(); const b = document.querySelector(was === 'confirm' ? '[data-act=save-order]' : '[data-act=back]'); if (b) b.focus(); break; }
    case 'discard': leave(); break;
    case 'back': if (dirty()) { S.modal = 'discard'; render(); document.getElementById('m-first').focus(); } else leave(); break;
    case 'refresh': S.banner = null; render(); break;
    case 'retry-load': scenario = 'default'; reset(); render(); break;
    case 'toggle-nc': document.body.classList.toggle('hide-nc'); render(); break;
    case 'toggle-notes': S.notes = !S.notes; render(); break;
  }
});
document.addEventListener('input', ev => {
  const el = ev.target;
  if (el.id === 'order-search') { S.query = el.value; S.open = true; S.active = -1; S.pick = null; render(); const i = document.getElementById('order-search'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); return; }
  if (el.dataset.f && S.draft) { S.draft[el.dataset.f] = el.value; delete S.errors[el.dataset.f]; }
});
document.addEventListener('focusin', ev => { if (ev.target.id === 'order-search' && !S.open && !S.pick) { S.open = true; render(); document.getElementById('order-search').focus(); } });
document.addEventListener('keydown', ev => {
  if (ev.target.id === 'order-search' && S.open) {
    const opts = [...document.querySelectorAll('[data-pick]')];
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); S.active = Math.max(0, Math.min(opts.length - 1, S.active + (ev.key === 'ArrowDown' ? 1 : -1))); render(); document.getElementById('order-search').focus(); return; }
    if (ev.key === 'Enter') { ev.preventDefault(); const b = opts[S.active]; if (b) pick(b.dataset.pick); render(); document.getElementById('order-search').focus(); return; }
    if (ev.key === 'Escape') { S.open = false; render(); document.getElementById('order-search').focus(); return; }
  }
  if (ev.key === 'Escape' && S.modal) { const was = S.modal; S.modal = null; render(); const b = document.querySelector(was === 'confirm' ? '[data-act=save-order]' : '[data-act=back]'); if (b) b.focus(); return; }
  if (ev.key === 'Escape' && S.edit) { cancelEdit(); return; }
  if (ev.target.getAttribute('role') === 'tab' && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')) {
    const ids = ['overview','invoices','export']; const i = ids.indexOf(S.tab);
    S.tab = ids[(i + (ev.key === 'ArrowRight' ? 1 : 2)) % 3]; render(); document.getElementById('tab-' + S.tab).focus();
  }
});
window.addEventListener('beforeunload', ev => { if (dirty()) { ev.preventDefault(); ev.returnValue = ''; } });
render();
