"""Offline Customs Storage Entry actual-source checks.

Compile exact source classes/methods from the supplied production archive with
Java 17 preview syntax. No downloads or production services. Framework
annotations/imports/package declarations are removed, Lombok constructors are
supplied, and List.getFirst() is replaced by List.get(0). Repositories, external
entities, JSON serializer, clock and admissions are explicit in-memory stubs.
SQL, transaction rollback, concurrency, HTTP/GraphQL binding and deployed flows
are NOT executed. Source manifest records every extracted production file.
"""
import argparse
import hashlib
import re
import shutil
import socket
import subprocess
import tempfile
from pathlib import Path

def blocked(*args, **kwargs):
    raise RuntimeError("Network disabled for offline Customs Storage Entry checks")

socket.socket = blocked
socket.create_connection = blocked
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("repository_root", type=Path)
parser.add_argument("--java", type=Path, default=Path("C:/Program Files/Java/jdk-17/bin/java.exe"))
parser.add_argument("--scratch", type=Path)
args = parser.parse_args()
root = args.repository_root.resolve()
base = root / "frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain"
work = args.scratch or Path(tempfile.mkdtemp(prefix="cse-backend-qa-"))
work.mkdir(parents=True, exist_ok=True)
java = args.java
if not java.is_file():
    java = Path(shutil.which("java") or "java")
version = subprocess.run([str(java), "-version"], capture_output=True, text=True)
print(version.stderr.strip(), flush=True)
if 'version "17' not in version.stderr:
    raise SystemExit("This harness uses Java 17 preview; supply --java pointing to JDK17. No installation attempted.")
manifest = []

def read(relative):
    path = base / relative
    source = path.read_text(encoding="utf-8")
    manifest.append(f"{hashlib.sha256(source.encode()).hexdigest()}  {relative}")
    return source

def body(relative):
    source = read(relative)
    source = re.sub(r"(?m)^package .*;\s*|^import .*;\s*", "", source)
    source = re.sub(r"(?m)^\s*@(Service|Component|Repository|RequiredArgsConstructor|Transactional|ConfigurationProperties)(\([^\n]*\))?\s*", "\n", source)
    source = source.replace("@Nullable ", "")
    source = re.sub(r"(?m)^public (class|record|enum|sealed interface|interface|final class) ", r"\1 ", source)
    source = source.replace(".getFirst()", ".get(0)")
    # Nested resolution names were imported in the original files.
    if not relative.endswith("CustomsStorageAdmissionResolution.java"):
        for name in ["OwnAdmission", "NotAdmitted", "AdmittedUnderAnotherOrder"]:
            source = re.sub(r"\b" + name + r"\b", "CustomsStorageAdmissionResolution." + name, source)
    return source

names = ["CustomsStorageAdmission", "CustomsStorageAdmissionResolution", "CustomsStorageCoverage",
         "CustomsStorageEntry", "CustomsStorageEntryValues", "CustomsStorageEntryUpdate",
         "CustomsStorageEntryRules", "CustomsStorageEntryRuleException", "CustomsStorageEntryRuleCode",
         "CustomsStorageEntryEligibility", "CustomsStorageEntryIneligibleReason", "CustomsStorageEntryReference",
         "CustomsStorageEntryLookup", "CustomsStorageEntryAccess", "CustomsStorageProperties",
         "CustomsStorageEntryAuthorizationService", "CustomsStorageEntryActivityType", "CustomsStorageEntryAudit",
         "CustomsStorageEntryInvoice", "CustomsStorageInvoiceTotals", "CustomsStorageEntryFacts",
         "CustomsStorageEntryFactsReader", "CustomsStorageEntryView", "CustomsStorageEntryExport",
         "CustomsStorageEntryPrefill", "CustomsStorageEntryDraft", "CustomsStorageEntryReads"]
actual = "\n".join(body("customsstorage/" + name + ".java") for name in names)
for relative in ["concurrency/StaleVersionException.java", "rules/CodedRule.java", "users/UserRole.java",
                 "users/UserAuthority.java", "users/UserStatus.java", "companies/CompanyType.java",
                 "customs/CustomsRegime.java", "warehouses/WarehouseCustomsLicence.java"]:
    actual += "\n" + body(relative)
user = body("users/User.java")
# Fixture-only convenience constructors; all actual identity methods stay intact.
user = user.replace(") {\n", ") {\n" + r'''
  User(long id,UserRole role) {this(id,role,
    role==UserRole.FRONTLINE_OPERATOR||role==UserRole.FRONTLINE_MANAGER||role==UserRole.SYSTEM_ADMIN
      ? CompanyType.FRONTLINE : CompanyType.CLIENT);}
  User(long id,UserRole role,CompanyType type) {
    this(id,new Company(-1L,"Fixture employer","DEMO",type,true),"fixture","fixture@example.invalid","Fixture actor",role,UserStatus.ACTIVE,"unused",LocalDateTime.of(2026,11,9,12,0));
  }
''', 1)
actual += "\n" + user
for name, constructor in {
    "CustomsStorageEntryCreationService": "authorization=f.authorization; purchaseOrders=f.orders; coverage=f.coverage; entries=f.entries; properties=new CustomsStorageProperties(900L); clock=f.clock;",
    "CustomsStorageEntryEditingService": "authorization=f.authorization; purchaseOrders=f.orders; coverage=f.coverage; entries=f.entries; clock=f.clock;",
    "CustomsStorageEntryOrderGuard": "coverage=f.coverage; entries=f.entries;",
}.items():
    source = body("customsstorage/" + name + ".java")
    source = source.replace("class " + name + " {", "class " + name + " {\n" + name + "(Fixture f) {" + constructor + "}\n")
    actual += "\n" + source

stubs = r'''
class AccessDeniedException extends RuntimeException { AccessDeniedException(String message) { super(message); } }
class SupplierInvoiceService { static final ZoneId BUSINESS_ZONE=ZoneId.of("Europe/Athens"); }
enum PurchaseOrderStatus { IN_STOCK, CANCELLED, READY, SHIPPED }
record CustomsValue(CustomsRegime customsRegime) {}
record Parties(Long clientCompanyId, Long supplierCompanyId, Long invoiceCompanyId) {}
record PurchaseOrder(Long id, PurchaseOrderStatus status, boolean pickupInGreece, CustomsValue customsValue, Parties parties) {}
class PurchaseOrderRepository {
  Map<Long,PurchaseOrder> rows=new HashMap<>(); int locks=0;
  Optional<PurchaseOrder> findById(long id) { return Optional.ofNullable(rows.get(id)); }
  Optional<PurchaseOrder> findByIdForUpdate(long id) { locks++; return findById(id); }
}
class CustomsStorageAdmissions {
  Map<Long,CustomsStorageAdmissionResolution> resolutions=new HashMap<>();
  Map<Long,CustomsStorageAdmission> stays=new HashMap<>();
  CustomsStorageAdmissionResolution resolve(long id) { return resolutions.getOrDefault(id, new CustomsStorageAdmissionResolution.NotAdmitted()); }
  CustomsStorageAdmission admissionAt(long id, long stay) { return stays.get(stay); }
}
record Activity(long id, CustomsStorageEntryActivityType type, String changes, long actor, OffsetDateTime time) {}
class CustomsStorageEntryRepository {
  Map<Long,CustomsStorageEntry> rows=new HashMap<>(); List<Activity> activity=new ArrayList<>();
  long lastNumber=0; int allocations=0, writes=0, locks=0;
  long nextNumber(long start) { allocations++; return lastNumber=lastNumber==0?start:lastNumber+1; }
  Optional<CustomsStorageEntry> findById(long id) { return Optional.ofNullable(rows.get(id)); }
  Optional<CustomsStorageEntry> findByIdForUpdate(long id) { locks++; return findById(id); }
  Optional<CustomsStorageEntry> findByNumber(long n) { return rows.values().stream().filter(e->e.entryNumber()==n).findFirst(); }
  Optional<CustomsStorageEntry> findByPurchaseOrderId(long id) { return rows.values().stream().filter(e->e.purchaseOrderId()==id).findFirst(); }
  Optional<CustomsStorageEntryReference> findReferenceByPurchaseOrderId(long id) { return findByPurchaseOrderId(id).map(CustomsStorageEntry::reference); }
  List<CustomsStorageEntry> findByPurchaseOrderIds(Collection<Long> ids) { return rows.values().stream().filter(e->ids.contains(e.purchaseOrderId())).sorted(Comparator.comparingLong(CustomsStorageEntry::entryNumber)).toList(); }
  CustomsStorageEntry insert(long n,long order,long stay,CustomsStorageEntryValues v,long actor,OffsetDateTime now) {
    var e=new CustomsStorageEntry(rows.size()+1L,n,order,stay,v,0,actor,now,actor,now); rows.put(e.id(),e); writes++; return e;
  }
  CustomsStorageEntry updateValues(CustomsStorageEntry e,CustomsStorageEntryValues v,long actor,OffsetDateTime now) {
    var u=new CustomsStorageEntry(e.id(),e.entryNumber(),e.purchaseOrderId(),e.admissionWarehouseStayId(),v,e.version()+1,e.createdById(),e.createdAt(),actor,now); rows.put(e.id(),u); writes++; return u;
  }
  CustomsStorageEntry changeOwner(CustomsStorageEntry e,long order,long stay,long actor,OffsetDateTime now) {
    var u=new CustomsStorageEntry(e.id(),e.entryNumber(),order,stay,e.values(),e.version()+1,e.createdById(),e.createdAt(),actor,now); rows.put(e.id(),u); writes++; return u;
  }
  void recordActivity(long id,CustomsStorageEntryActivityType type,String json,long actor,OffsetDateTime now) { activity.add(new Activity(id,type,json,actor,now)); }
}
class JsonMapper {
  static Map<String,Object> last; static JsonMapper builder() {return new JsonMapper();} JsonMapper build(){return this;}
  String writeValueAsString(Map<String,Object> value) {last=value; return value.toString();}
}
record Company(Long id,String name,String vatNumber,CompanyType type,boolean active) {
  Company(Long id,String name,String vatNumber){this(id,name,vatNumber,CompanyType.FRONTLINE,true);}
}
class CompanyRepository { Map<Long,Company> rows=new HashMap<>(); Optional<Company> findById(Long id){return Optional.ofNullable(rows.get(id));} List<Company> findByIds(Collection<Long> ids){return ids.stream().map(rows::get).filter(Objects::nonNull).toList();} }
record City(String name) {}
class LocationRepository { Optional<City> findCityById(Long id){return id==null?Optional.empty():Optional.of(new City("Athens (ATH)"));} }
record FreightWarehouse(Long id,Long operatorCompanyId,Long cityId,String street,String number,String postalCode,List<WarehouseCustomsLicence> customsLicences) {}
class FreightWarehouseRepository { Map<Long,FreightWarehouse> rows=new HashMap<>(); Optional<FreightWarehouse> findById(Long id){return Optional.ofNullable(rows.get(id));} }
enum SupplierInvoiceType { STORAGE_ENTRY, OTHER }
record SupplierInvoice(Long id,Long purchaseOrderId,Long supplierCompanyId,String invoiceNumber,SupplierInvoiceType invoiceType,String currency,BigDecimal netAmount,BigDecimal vatAmount,boolean cancelled) {}
class SupplierInvoiceRepository {
  List<SupplierInvoice> rows=new ArrayList<>();
  List<SupplierInvoice> findByPurchaseOrderId(long id){return rows.stream().filter(i->i.purchaseOrderId()==id).toList();}
  Optional<SupplierInvoice> findById(long id){return rows.stream().filter(i->i.id()==id).findFirst();}
  List<SupplierInvoice> findByIds(Collection<Long> ids){return rows.stream().filter(i->ids.contains(i.id())).toList();}
}
record ExportDeclaration(Long id,String mrn) {}
record SelectedInvoice(Long exportId,Long supplierInvoiceId,boolean active) {}
class ExportDeclarationRepository {
  Map<Long,Long> assignments=new HashMap<>(); Map<Long,ExportDeclaration> rows=new HashMap<>();
  Map<Long,Long> activeExportIdsByInvoiceId(Collection<Long> ids){return assignments.entrySet().stream().filter(e->ids.contains(e.getKey())).collect(Collectors.toMap(Map.Entry::getKey,Map.Entry::getValue));}
  Optional<ExportDeclaration> findById(Long id){return Optional.ofNullable(rows.get(id));}
  List<SelectedInvoice> findSelectedInvoices(Collection<Long> ids){return assignments.entrySet().stream().filter(e->ids.contains(e.getValue())).map(e->new SelectedInvoice(e.getValue(),e.getKey(),true)).toList();}
}
class Fixture {
  Clock clock=Clock.fixed(Instant.parse("2026-11-09T22:30:00Z"),ZoneOffset.UTC);
  CustomsStorageEntryAuthorizationService authorization=new CustomsStorageEntryAuthorizationService();
  PurchaseOrderRepository orders=new PurchaseOrderRepository(); CustomsStorageAdmissions admissions=new CustomsStorageAdmissions();
  CustomsStorageEntryRepository entries=new CustomsStorageEntryRepository();
  CustomsStorageCoverage coverage=new CustomsStorageCoverage(orders,admissions,entries);
  CompanyRepository companies=new CompanyRepository(); FreightWarehouseRepository warehouses=new FreightWarehouseRepository();
  SupplierInvoiceRepository invoices=new SupplierInvoiceRepository(); ExportDeclarationRepository exports=new ExportDeclarationRepository();
  CustomsStorageEntryFactsReader facts=new CustomsStorageEntryFactsReader(companies,warehouses,new LocationRepository(),invoices,exports);
  CustomsStorageEntryReads reads=new CustomsStorageEntryReads(authorization,entries,admissions,coverage,facts,orders,invoices,exports);
  CustomsStorageEntryCreationService creation=new CustomsStorageEntryCreationService(this);
  CustomsStorageEntryEditingService editing=new CustomsStorageEntryEditingService(this);
  CustomsStorageEntryOrderGuard guard=new CustomsStorageEntryOrderGuard(this);
  Fixture() { companies.rows.put(10L,new Company(10L,"Demo Client","CLIENTVAT")); companies.rows.put(20L,new Company(20L,"Demo Supplier","SUPVAT")); companies.rows.put(30L,new Company(30L,"Demo Depositor","DEPVAT")); warehouses.rows.put(100L,new FreightWarehouse(100L,10L,1L,"Demo Road","1","10000",List.of(new WarehouseCustomsLicence(1L,"DEMO-LIC",List.of(CustomsRegime.CUSTOMS_STORAGE))))); }
  PurchaseOrder order(long id) {return order(id,PurchaseOrderStatus.IN_STOCK,true,CustomsRegime.CUSTOMS_STORAGE,new Parties(10L,20L,30L));}
  PurchaseOrder order(long id,PurchaseOrderStatus status,boolean greece,CustomsRegime regime,Parties parties) {var o=new PurchaseOrder(id,status,greece,new CustomsValue(regime),parties);orders.rows.put(id,o);return o;}
  CustomsStorageAdmission admit(long id) {order(id);var a=new CustomsStorageAdmission(id,id+1000,100,OffsetDateTime.parse("2026-11-01T10:00:00Z"),List.of(id*10+1,id*10+2),new BigDecimal("10.00"));admissions.resolutions.put(id,new CustomsStorageAdmissionResolution.OwnAdmission(a));admissions.stays.put(a.warehouseStayId(),a);return a;}
  void inherit(long id,CustomsStorageAdmission a) {order(id);admissions.resolutions.put(id,new CustomsStorageAdmissionResolution.AdmittedUnderAnotherOrder(a));}
}
'''

tests = r'''
public class CseQa {
 static int controls=0;
 static final User STAFF=new User(3,UserRole.FRONTLINE_OPERATOR);
 static final OffsetDateTime NOW=OffsetDateTime.parse("2026-11-09T22:30:00Z");
 static final LocalDate TODAY=LocalDate.parse("2026-11-10");
 static void ok(boolean result,String label) {if(!result)throw new AssertionError(label);controls++;System.out.println("PASS "+label);}
 static void equal(Object actual,Object expected,String label) {ok(Objects.equals(actual,expected),label+" ["+actual+"]");}
 static void money(BigDecimal value,String expected,String label) {ok(value!=null&&value.compareTo(new BigDecimal(expected))==0,label+" ["+value+"]");}
 static <T extends Throwable> T thrown(Class<T> type,Runnable action,String label) {try{action.run();}catch(Throwable e){if(type.isInstance(e)){controls++;System.out.println("PASS "+label+" ["+e.getClass().getSimpleName()+"]");return type.cast(e);}throw new AssertionError(label+": unexpected "+e,e);}throw new AssertionError(label+": not refused");}
 static void rule(CustomsStorageEntryRuleCode code,Runnable action,String label) {var e=thrown(CustomsStorageEntryRuleException.class,action,label);if(e.code()!=code)throw new AssertionError(label+": "+e.code());}
 static CustomsStorageEntryValues values(){return new CustomsStorageEntryValues(NOW.minusDays(1),"DEMO-MRN",TODAY,"00012","Demo goods","Demo truck","DEMO-LIC","Demo operator","DEMO-VAT","Demo address");}
 static CustomsStorageEntryValues changed(CustomsStorageEntryValues v,CustomsStorageEntryUpdate u){return CustomsStorageEntryRules.normalize(u.applyTo(v));}
 static void fields() {
   var v=values();CustomsStorageEntryRules.check(v,NOW,TODAY);ok(true,"valid fields with Athens next calendar day");
   var trimmed=changed(v,CustomsStorageEntryUpdate.builder(0L).entryMrn(new CustomsStorageEntryUpdate.Change<>("  MRN  ")).tariffCode(new CustomsStorageEntryUpdate.Change<>(" 00012 ")).transportMeans(new CustomsStorageEntryUpdate.Change<>(" \t ")).entryAt(new CustomsStorageEntryUpdate.Change<>(v.entryAt().withOffsetSameInstant(ZoneOffset.ofHours(2)))).build());
   equal(trimmed.entryMrn(),"MRN","trims text");equal(trimmed.tariffCode(),"00012","preserves leading tariff zeros");equal(trimmed.transportMeans(),null,"blank optional clears");equal(trimmed.entryAt().getOffset(),ZoneOffset.UTC,"normalizes timestamp to UTC");equal(trimmed.goodsDescription(),v.goodsDescription(),"omitted field preserves");
   for(String code:List.of("1","1234567890")){var c=changed(v,CustomsStorageEntryUpdate.builder(0L).tariffCode(new CustomsStorageEntryUpdate.Change<>(code)).build());CustomsStorageEntryRules.check(c,NOW,TODAY);ok(true,"tariff valid length "+code.length());}
   for(String code:List.of("12345678901","12A","12 3","١٢")){var c=changed(v,CustomsStorageEntryUpdate.builder(0L).tariffCode(new CustomsStorageEntryUpdate.Change<>(code)).build());rule(CustomsStorageEntryRuleCode.TARIFF_CODE_INVALID,()->CustomsStorageEntryRules.check(c,NOW,TODAY),"tariff rejects "+code);}
   var missing=changed(v,CustomsStorageEntryUpdate.builder(0L).entryAt(new CustomsStorageEntryUpdate.Change<>(null)).build());rule(CustomsStorageEntryRuleCode.ENTRY_AT_REQUIRED,()->CustomsStorageEntryRules.check(missing,NOW,TODAY),"entryAt required");
   var future=changed(v,CustomsStorageEntryUpdate.builder(0L).entryAt(new CustomsStorageEntryUpdate.Change<>(NOW.plusNanos(1000))).build());rule(CustomsStorageEntryRuleCode.ENTRY_AT_IN_FUTURE,()->CustomsStorageEntryRules.check(future,NOW,TODAY),"future entry instant refused");
   var futureMrn=changed(v,CustomsStorageEntryUpdate.builder(0L).entryMrnDate(new CustomsStorageEntryUpdate.Change<>(TODAY.plusDays(1))).build());rule(CustomsStorageEntryRuleCode.ENTRY_MRN_DATE_IN_FUTURE,()->CustomsStorageEntryRules.check(futureMrn,NOW,TODAY),"future Athens MRN day refused");
   String[] names={"entryMrn","goodsDescription","transportMeans","permitNumber","operatorName","operatorVatNumber","warehouseAddress"};
   for(String name:names) {int limit=name.equals("goodsDescription")?2000:500;for(int extra:List.of(0,1)){var b=CustomsStorageEntryUpdate.builder(0L);var change=new CustomsStorageEntryUpdate.Change<>("X".repeat(limit+extra));switch(name){case "entryMrn"->b.entryMrn(change);case "goodsDescription"->b.goodsDescription(change);case "transportMeans"->b.transportMeans(change);case "permitNumber"->b.permitNumber(change);case "operatorName"->b.operatorName(change);case "operatorVatNumber"->b.operatorVatNumber(change);case "warehouseAddress"->b.warehouseAddress(change);}var c=changed(v,b.build());if(extra==0){CustomsStorageEntryRules.check(c,NOW,TODAY);ok(true,name+" accepts limit");}else{rule(CustomsStorageEntryRuleCode.TEXT_TOO_LONG,()->CustomsStorageEntryRules.check(c,NOW,TODAY),name+" refuses above limit");}}}
   equal(new CustomsStorageProperties(null).entryNumberStart(),1L,"default series start");thrown(IllegalArgumentException.class,()->new CustomsStorageProperties(0L),"nonpositive start refused");
 }
 static void auth() {
   var auth=new CustomsStorageEntryAuthorizationService();
   for(UserRole role:UserRole.values()){var user=new User(4,role);boolean staff=role==UserRole.FRONTLINE_OPERATOR||role==UserRole.FRONTLINE_MANAGER||role==UserRole.SYSTEM_ADMIN;equal(auth.canView(user),staff,role+" view scope");equal(auth.canCreate(user),staff,role+" create scope");equal(auth.canEdit(user),staff,role+" edit scope");if(!staff){thrown(AccessDeniedException.class,()->auth.requireView(user),role+" read denied");}}
   equal(auth.canView(null),false,"anonymous read denied");thrown(AccessDeniedException.class,()->auth.requireEdit(null),"anonymous write denied");
   for(CompanyType type:List.of(CompanyType.CLIENT,CompanyType.SUPPLIER_COMPANY,CompanyType.AGENT)) {
     var mismatched=new User(99,UserRole.FRONTLINE_OPERATOR,type);
     thrown(AccessDeniedException.class,()->auth.requireView(mismatched),"staff role with "+type+" company cannot view");
     thrown(AccessDeniedException.class,()->auth.requireCreate(mismatched),"staff role with "+type+" company cannot create");
     thrown(AccessDeniedException.class,()->auth.requireEdit(mismatched),"staff role with "+type+" company cannot edit");
   }
 }
 static void coverageAndCommands() {
   Fixture f=new Fixture();f.order(1);equal(f.coverage.eligibility(1).reason(),CustomsStorageEntryIneligibleReason.NOT_ADMITTED,"unadmitted refusal");
   f.order(2,PurchaseOrderStatus.CANCELLED,false,CustomsRegime.FREE_CIRCULATION,new Parties(10L,null,null));equal(f.coverage.eligibility(2).reason(),CustomsStorageEntryIneligibleReason.CANCELLED,"cancelled wins priority");
   f.order(2,PurchaseOrderStatus.IN_STOCK,false,CustomsRegime.CUSTOMS_STORAGE,new Parties(10L,null,null));equal(f.coverage.eligibility(2).reason(),CustomsStorageEntryIneligibleReason.NOT_CUSTOMS_STORAGE,"Greece No refusal");
   f.order(2,PurchaseOrderStatus.IN_STOCK,true,CustomsRegime.FREE_CIRCULATION,new Parties(10L,null,null));equal(f.coverage.eligibility(2).reason(),CustomsStorageEntryIneligibleReason.NOT_CUSTOMS_STORAGE,"wrong regime refusal");
   var a=f.admit(1);f.inherit(3,a);equal(f.coverage.eligibility(3).reason(),CustomsStorageEntryIneligibleReason.ADMITTED_UNDER_ANOTHER_ORDER,"inherited without owner entry refused");equal(f.coverage.eligibility(3).purchaseOrderId(),1L,"inherited refusal names owner");
   int before=f.entries.writes;thrown(AccessDeniedException.class,()->f.creation.create(new User(5,UserRole.CLIENT_MANAGER),1,values()),"partner cannot create");equal(f.entries.writes,before,"denied create no repository write");
   rule(CustomsStorageEntryRuleCode.ADMITTED_UNDER_ANOTHER_ORDER,()->f.creation.create(STAFF,3,values()),"child cannot create own entry");equal(f.entries.allocations,0,"ineligible create allocates nothing");
   var entry=f.creation.create(STAFF,1,values());equal(entry.entryNumber(),900L,"valid create uses configured number");equal(f.entries.activity.get(0).type(),CustomsStorageEntryActivityType.CREATED,"creation audit type");equal(f.entries.activity.get(0).actor(),STAFF.id(),"creation audit actor");equal(f.entries.activity.get(0).time(),NOW,"creation audit time");equal(JsonMapper.last.get("purchaseOrderId"),1L,"creation audit owner");
   equal(f.coverage.lookup(1).orElseThrow().access(),CustomsStorageEntryAccess.DIRECT,"owner lookup direct");equal(f.coverage.lookup(3).orElseThrow().access(),CustomsStorageEntryAccess.INHERITED,"child lookup inherited");equal(f.coverage.eligibility(3).entry().id(),entry.id(),"child already-covered result identifies same entry");
   f.order(3,PurchaseOrderStatus.CANCELLED,true,CustomsRegime.CUSTOMS_STORAGE,new Parties(10L,null,null));equal(f.coverage.lookup(3).orElseThrow().entry().id(),entry.id(),"cancelled covered child still opens");
   int allocated=f.entries.allocations;rule(CustomsStorageEntryRuleCode.ALREADY_COVERED,()->f.creation.create(STAFF,1,values()),"sequential repeated create refused");equal(f.entries.allocations,allocated,"repeated create allocates nothing");
   int audits=f.entries.activity.size();var same=f.editing.updateDetails(STAFF,entry.id(),CustomsStorageEntryUpdate.builder(0L).entryMrn(new CustomsStorageEntryUpdate.Change<>(" DEMO-MRN ")).build());equal(same.version(),0L,"unchanged trimmed save keeps version");equal(f.entries.activity.size(),audits,"unchanged save no audit");
   var updated=f.editing.updateDetails(STAFF,entry.id(),CustomsStorageEntryUpdate.builder(0L).entryMrn(new CustomsStorageEntryUpdate.Change<>(null)).goodsDescription(new CustomsStorageEntryUpdate.Change<>("Corrected goods")).build());equal(updated.version(),1L,"changed save advances version");equal(updated.values().entryMrn(),null,"explicit null clears persisted optional");equal(updated.values().permitNumber(),entry.values().permitNumber(),"partial save preserves warehouse text");equal(((Map<?,?>)JsonMapper.last.get("before")).keySet(),Set.of("entryMrn","goodsDescription"),"audit contains only changed fields");equal(((Map<?,?>)JsonMapper.last.get("after")).get("entryMrn"),null,"audit represents cleared value");
   before=f.entries.writes;thrown(StaleVersionException.class,()->f.editing.updateDetails(STAFF,entry.id(),CustomsStorageEntryUpdate.builder(0L).goodsDescription(new CustomsStorageEntryUpdate.Change<>("stale")).build()),"stale edit refused");equal(f.entries.writes,before,"stale edit no write");thrown(IllegalArgumentException.class,()->f.editing.updateDetails(STAFF,entry.id(),CustomsStorageEntryUpdate.builder(null).build()),"missing reviewed version refused");
   rule(CustomsStorageEntryRuleCode.ENTRY_AT_REQUIRED,()->f.editing.updateDetails(STAFF,entry.id(),CustomsStorageEntryUpdate.builder(1L).entryAt(new CustomsStorageEntryUpdate.Change<>(null)).build()),"cannot clear required entry date");equal(f.entries.writes,before,"invalid edit no write");
   rule(CustomsStorageEntryRuleCode.CURRENT_ORDER,()->f.editing.changeOrder(STAFF,entry.id(),1L,1),"cannot move to current owner");f.order(3);rule(CustomsStorageEntryRuleCode.COVERED_BY_THIS_ENTRY,()->f.editing.changeOrder(STAFF,entry.id(),1L,3),"cannot move to own covered child");
   rule(CustomsStorageEntryRuleCode.REGIME_LOCKED_BY_ENTRY,()->f.guard.beforeRegimeChange(f.orders.rows.get(1L),false,CustomsRegime.CUSTOMS_STORAGE),"owner cannot leave Greece");rule(CustomsStorageEntryRuleCode.REGIME_LOCKED_BY_ENTRY,()->f.guard.beforeRegimeChange(f.orders.rows.get(3L),true,CustomsRegime.FREE_CIRCULATION),"covered child cannot leave storage");f.guard.beforeRegimeChange(f.orders.rows.get(1L),true,CustomsRegime.CUSTOMS_STORAGE);ok(true,"unchanged storage regime permitted");rule(CustomsStorageEntryRuleCode.LAST_COLLI_LOCKED_BY_ENTRY,()->f.guard.beforeLastColliTerminated(f.orders.rows.get(1L)),"owner last colli protected");f.guard.beforeLastColliTerminated(f.orders.rows.get(3L));ok(true,"covered child may terminate last colli");
   var target=f.admit(4);f.inherit(5,target);var moved=f.editing.changeOrder(new User(7,UserRole.FRONTLINE_MANAGER),entry.id(),1L,4);equal(moved.entryNumber(),entry.entryNumber(),"move preserves number");equal(moved.values(),updated.values(),"move preserves every entered value");equal(moved.admissionWarehouseStayId(),target.warehouseStayId(),"move derives target admission");equal(moved.version(),2L,"move advances version");equal(f.entries.activity.get(f.entries.activity.size()-1).actor(),7L,"move audit actor");equal(((Map<?,?>)JsonMapper.last.get("before")).get("purchaseOrderId"),1L,"move audit old owner");equal(((Map<?,?>)JsonMapper.last.get("after")).get("purchaseOrderId"),4L,"move audit new owner");ok(f.coverage.lookup(1).isEmpty()&&f.coverage.lookup(3).isEmpty(),"old owner and child no longer resolve moved entry");equal(f.coverage.lookup(5).orElseThrow().entry().id(),entry.id(),"new owner's child resolves moved entry");ok(f.coverage.eligibility(1).eligible(),"old admission eligible again after correction");thrown(StaleVersionException.class,()->f.editing.changeOrder(STAFF,entry.id(),1L,1),"stale move refused");
 }
 static SupplierInvoice invoice(long id,long order,String currency,String net,SupplierInvoiceType type,boolean cancelled) {return new SupplierInvoice(id,order,20L,"DEMO-"+id,type,currency,new BigDecimal(net),BigDecimal.ZERO,cancelled);}
 static void derived() {
   equal(CustomsStorageInvoiceTotals.of(List.of()).netAmount(),null,"no invoices has no total");equal(CustomsStorageInvoiceTotals.of(List.of()).currencyRuleFailed(),false,"empty set is not currency failure");
   var totals=CustomsStorageInvoiceTotals.of(List.of(new CustomsStorageInvoiceTotals.Line("EUR",new BigDecimal("0.02"),BigDecimal.ZERO),new CustomsStorageInvoiceTotals.Line("EUR",new BigDecimal("0.02"),BigDecimal.ZERO)));money(totals.netAmount(),"0.04","EUR net summed");money(totals.statisticalVat(),"0.01","statistical VAT rounded once after total");money(CustomsStorageInvoiceTotals.statisticalVat(new BigDecimal("0.02")),"0.00","row statistical VAT round");money(CustomsStorageInvoiceTotals.statisticalVat(new BigDecimal("0.0625")),"0.02","half-up rounding tie");
   var mixed=CustomsStorageInvoiceTotals.of(List.of(new CustomsStorageInvoiceTotals.Line("EUR",BigDecimal.ONE,BigDecimal.ZERO),new CustomsStorageInvoiceTotals.Line("USD",BigDecimal.ONE,BigDecimal.ZERO)));ok(mixed.currencyRuleFailed()&&mixed.netAmount()==null&&mixed.statisticalVat()==null,"mixed currency blocks totals");
   Fixture f=new Fixture();var admission=f.admit(1);f.inherit(2,admission);var entry=f.creation.create(STAFF,1,values());
   f.invoices.rows.add(invoice(1,1,"EUR","10",SupplierInvoiceType.STORAGE_ENTRY,false));f.invoices.rows.add(invoice(2,1,"EUR","20",SupplierInvoiceType.STORAGE_ENTRY,false));f.invoices.rows.add(invoice(3,1,"EUR","999",SupplierInvoiceType.OTHER,false));f.invoices.rows.add(invoice(4,1,"EUR","999",SupplierInvoiceType.STORAGE_ENTRY,true));f.invoices.rows.add(invoice(5,2,"USD","999",SupplierInvoiceType.STORAGE_ENTRY,false));
   var view=f.reads.findByNumber(STAFF,entry.entryNumber()).orElseThrow();equal(view.facts().invoices().size(),2,"only owner's active storage invoices");money(view.facts().totals().netAmount(),"30","child/other-type/cancelled invoices excluded");equal(view.facts().depositor().id(),30L,"depositor is invoice company");equal(view.facts().client().id(),10L,"operational client separate");equal(view.facts().admission(),admission,"saved entry reads stored admission");ok(view.active(),"unassigned invoices keep entry active");
   f.exports.rows.put(100L,new ExportDeclaration(100L,"DEMO-EXPORT"));f.exports.assignments.put(1L,100L);ok(f.reads.view(entry).active(),"partly assigned remains active");f.exports.assignments.put(2L,100L);ok(!f.reads.view(entry).active(),"all matching invoices in one MRN export becomes inactive");
   f.exports.rows.put(100L,new ExportDeclaration(100L,"  "));ok(f.reads.view(entry).active(),"blank export MRN keeps active");f.exports.rows.put(100L,new ExportDeclaration(100L,"DEMO-EXPORT"));f.exports.rows.put(101L,new ExportDeclaration(101L,"DEMO-SECOND"));f.exports.assignments.put(2L,101L);ok(f.reads.view(entry).active(),"multiple exports remain active");f.exports.assignments.put(2L,100L);
   f.invoices.rows.add(invoice(6,1,"EUR","5",SupplierInvoiceType.STORAGE_ENTRY,false));ok(f.reads.view(entry).active(),"later unassigned invoice reactivates");f.invoices.rows.remove(f.invoices.rows.size()-1);ok(!f.reads.view(entry).active(),"removed unmatched fixture restores inactive rule");
   equal(f.reads.findBySupplierInvoiceId(STAFF,5).isPresent(),false,"covered child invoice cannot substitute owner invoice");equal(f.reads.findBySupplierInvoiceId(STAFF,4).isPresent(),false,"cancelled invoice lookup empty");equal(f.reads.findBySupplierInvoiceId(STAFF,1).orElseThrow().entry().id(),entry.id(),"owner invoice resolves entry");equal(f.reads.findByExportId(STAFF,100).size(),1,"export lookup deduplicates one owner");
   var missing=new PurchaseOrder(1L,PurchaseOrderStatus.IN_STOCK,true,new CustomsValue(CustomsRegime.CUSTOMS_STORAGE),new Parties(10L,null,null));f.orders.rows.put(1L,missing);var missingFacts=f.reads.view(entry).facts();equal(missingFacts.depositor(),null,"missing depositor stays blank");equal(missingFacts.supplier(),null,"missing supplier stays blank");
   var warehouse=f.warehouses.rows.get(100L);var prefill=f.facts.prefill(warehouse);equal(prefill.permitNumber(),"DEMO-LIC","one storage licence prefilled");equal(prefill.warehouseAddress(),"Demo Road 1, 10000 Athens","warehouse address assembled without city code");equal(f.facts.prefill(new FreightWarehouse(1L,null,null,null,null,null,List.of())).permitNumber(),null,"no licence blank");equal(f.facts.prefill(new FreightWarehouse(1L,null,null,null,null,null,List.of(new WarehouseCustomsLicence(1L,"A",List.of(CustomsRegime.CUSTOMS_STORAGE)),new WarehouseCustomsLicence(2L,"B",List.of(CustomsRegime.CUSTOMS_STORAGE))))).permitNumber(),null,"multiple storage licences blank");
   f.invoices.rows.clear();ok(f.reads.view(entry).active(),"zero matching invoices remains active");
   thrown(AccessDeniedException.class,()->f.reads.findByNumber(new User(9,UserRole.CLIENT_OPERATOR),900),"partner cannot read entry number");thrown(AccessDeniedException.class,()->f.reads.findByExportId(new User(9,UserRole.AGENT_OPERATOR),100),"partner cannot read through export");thrown(AccessDeniedException.class,()->f.reads.draft(new User(9,UserRole.SUPPLIER_COMPANY_MANAGER),1),"partner cannot read create draft");
 }
 @SuppressWarnings("removal")
 static void denyNetwork() {
   System.setSecurityManager(new SecurityManager() {
     public void checkPermission(java.security.Permission permission) {}
     public void checkConnect(String host,int port) {throw new SecurityException("Offline harness: connect denied");}
     public void checkConnect(String host,int port,Object context) {throw new SecurityException("Offline harness: connect denied");}
     public void checkListen(int port) {throw new SecurityException("Offline harness: listen denied");}
     public void checkAccept(String host,int port) {throw new SecurityException("Offline harness: accept denied");}
   });
   try {new java.net.Socket("127.0.0.1",1);throw new AssertionError("Network guard did not deny connection");}
   catch(SecurityException expected) {System.out.println("NETWORK_GUARD outbound connection denied before socket access");}
   catch(java.io.IOException unexpected) {throw new AssertionError("Socket reached network",unexpected);}
 }
 public static void main(String[] args) {denyNetwork();fields();auth();coverageAndCommands();derived();System.out.println("SUMMARY controls="+controls+" observed_defects=0");}
}
'''

source = "import java.util.*;\nimport java.util.stream.*;\nimport java.util.function.*;\nimport java.util.regex.*;\nimport java.time.*;\nimport java.time.temporal.*;\nimport java.math.*;\n" + actual + stubs + tests
target = work / "CseQa.java"
target.write_text(source, encoding="utf-8")
(work / "source-manifest.sha256").write_text("\n".join(sorted(set(manifest))) + "\n", encoding="utf-8")
javac = java.with_name("javac.exe" if java.suffix == ".exe" else "javac")
compiled = subprocess.run([str(javac), "--enable-preview", "--release", "17", "-encoding", "UTF-8", str(target)], capture_output=True, text=True)
if compiled.returncode:
    print(compiled.stdout)
    print(compiled.stderr)
    raise SystemExit(compiled.returncode)
run = subprocess.run([str(java), "--enable-preview", "-cp", str(work), "CseQa"], capture_output=True, text=True)
print(run.stdout, end="")
if run.stderr:
    print(run.stderr)
(work / "results.txt").write_text(version.stderr + compiled.stderr + run.stdout + run.stderr, encoding="utf-8")
raise SystemExit(run.returncode)
