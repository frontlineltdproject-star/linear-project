"""Offline Shipment Invoice actual-source checks, pinned main 6aa25955.

Runs actual Java rule/evaluation/review/authorization/lifecycle/guard bodies and
records, extracted from the supplied repository. Java 17+ is required (no
downloads). Spring, JSON serialization, repositories, locks, clock and several
external entities are stand-ins. This DOES NOT execute SQL, real transactions,
concurrency, HTTP authorization, a deployed app, or the project test suite.
The sole Java API compatibility change is List.getFirst() -> List.get(0).
The generated source and source hash manifest may be retained with --scratch.
OBSERVED_BUG assertions document actual behavior, not desired requirements.
"""
import argparse
import hashlib
import os
from pathlib import Path
import re
import shutil
import socket
import subprocess
import tempfile

def blocked(*args, **kwargs):
    raise RuntimeError("Network disabled by shipment-invoice-backend-qa")

socket.socket = blocked
socket.create_connection = blocked
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("repository_root", type=Path)
parser.add_argument("--java", type=Path)
parser.add_argument("--scratch", type=Path)
args = parser.parse_args()
root = args.repository_root.resolve()
base = root / "frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain"
java = args.java or Path("C:/Program Files/Java/jdk-17/bin/java.exe")
if not java.is_file():
    java = Path(shutil.which("java") or "java")
version = subprocess.run([str(java), "-version"], capture_output=True, text=True)
print(version.stderr.strip(), flush=True)
major = re.search(r'version "(\d+)', version.stderr)
if not major or int(major[1]) < 17:
    raise SystemExit("Java 17+ required; supply --java. No installation attempted.")

hashes = []
def read(relative):
    path = base / relative
    source = path.read_text(encoding="utf-8")
    hashes.append(f"{hashlib.sha256(source.encode()).hexdigest()}  {relative}")
    return source

def extract(source, signature):
    start = source.index(signature)
    end = source.index("{", start) + 1
    depth = 1
    while depth:
        depth += (source[end] == "{") - (source[end] == "}")
        end += 1
    return source[start:end]

def body(relative):
    source = read(relative)
    source = re.sub(r"(?m)^package .*;\s*|^import .*;\s*", "", source)
    source = re.sub(r"(?m)^@(Service|Component|RequiredArgsConstructor|Transactional|ConfigurationProperties)(\([^\n]*\))?\s*", "", source)
    source = source.replace("public class ", "class ").replace("public final class ", "final class ")
    source = source.replace("public record ", "record ").replace("public enum ", "enum ")
    source = source.replace(".getFirst()", ".get(0)")
    return source

records = ["ShipmentInvoice", "ShipmentInvoiceFields", "ShipmentInvoiceEvaluation",
           "ShipmentInvoiceReview", "ShipmentInvoiceGoods", "ShipmentInvoiceView",
           "ShipmentInvoiceLine", "ShipmentInvoiceFrozenLine", "ShipmentInvoiceReference",
           "ShipmentInvoiceActivity", "ShipmentInvoiceReplacementPrefill", "ShipmentInvoiceProperties",
           "ShipmentInvoiceStatus", "ShipmentInvoiceType", "ShipmentInvoiceRuleCode",
           "ShipmentInvoiceReviewItem", "ShipmentInvoiceRequirement", "ShipmentInvoiceAwaitingReason",
           "ShipmentInvoiceActivityType", "ShipmentInvoiceRuleException", "ShipmentInvoiceRules",
           "ShipmentInvoiceEvaluations", "ShipmentInvoiceAuthorizationService"]
actual = "\n".join(body("shipmentinvoices/" + name + ".java") for name in records)
for relative in ["purchaseorders/PurchaseOrderMoney.java", "purchaseorders/PurchaseOrderInvoiceRow.java",
                 "purchaseorders/PurchaseOrderInvoiceUnit.java", "purchaseorders/allocation/InvoiceRowLocation.java",
                 "purchaseorders/allocation/InvoiceRowAllocationState.java",
                 "purchaseorders/allocation/InvoiceRowAllocationCommand.java",
                 "purchaseorders/allocation/InvoiceRowAllocationKind.java", "users/UserAuthority.java", "users/UserRole.java"]:
    actual += "\n" + body(relative)
service = body("shipmentinvoices/ShipmentInvoiceService.java")
service = service.replace("private final ", "final ")
service = service.replace("class ShipmentInvoiceService {", """class ShipmentInvoiceService {
  ShipmentInvoiceService(Fixture f) {
    authorization=f.authorization; invoices=f.invoices; goodsReader=f.goodsReader;
    shipments=f.shipments; invoiceRows=f.invoiceRows;
    properties=new ShipmentInvoiceProperties(400L);
    clock=Clock.fixed(Instant.parse("2026-11-09T10:00:00Z"), ZoneOffset.UTC);
  }
""")
guard = body("shipmentinvoices/ShipmentInvoiceGuard.java")
guard = guard.replace("class ShipmentInvoiceGuard {", """class ShipmentInvoiceGuard {
  ShipmentInvoiceGuard(Fixture f) {
    invoices=f.invoices; invoiceRows=f.invoiceRows; locations=f.locations; allocations=f.allocations;
  }
""")
reader = read("shipmentinvoices/ShipmentInvoiceGoodsReader.java")
require_not_cancelled = extract(reader, "static void requireNotCancelled(")
user_source = read("users/User.java")
user_methods = extract(user_source, "public boolean isSystemAdmin(") + "\n" + extract(user_source, "public boolean isFrontlineUser(")
repo_source = read("shipmentinvoices/ShipmentInvoiceRepository.java")
request_records = extract(repo_source, "public enum CreationRequestKind") + "\n" + extract(repo_source, "public record CreationRequest(")
actual = actual + "\n" + service + "\n" + guard

imports = """
import java.math.*;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Permission;
import java.lang.annotation.*;
"""

stubs = r'''
// Everything below is harness infrastructure, not production persistence.
@Target({ElementType.TYPE_USE,ElementType.PARAMETER,ElementType.FIELD,ElementType.METHOD}) @interface Nullable {}
@interface Transactional { boolean readOnly() default false; }
interface CodedRule {String ruleCode();Map<String,Object> ruleDetails();}
class JsonMapper {
  static JsonMapper builder(){return new JsonMapper();} JsonMapper build(){return this;}
  String writeValueAsString(Object value){return String.valueOf(value);}
}
class AccessDeniedException extends RuntimeException {AccessDeniedException(String m){super(m);}}
class RequestConflictException extends RuntimeException {RequestConflictException(String m){super(m);}}
class StaleVersionException extends RuntimeException {StaleVersionException(String m){super(m);}}
enum CompanyType { FRONTLINE, CLIENT }
record Company(Long id, CompanyType type) {}
class User {
  final Long id; final UserRole role; final Company company;
  User(Long id,UserRole role,CompanyType type){this.id=id;this.role=role;this.company=new Company(id,type);}
  Long id(){return id;} UserRole role(){return role;}
  __USER_METHODS__
}
enum ShipmentStatus {PREPARING,DEPARTED,ARRIVED,CANCELLED}
record Shipment(Long id,ShipmentStatus status) {}
record PurchaseOrder(Long id,String internalNumber) {}
class ShipmentRepository {
  final Fixture f; Shipment value=new Shipment(1L,ShipmentStatus.PREPARING);
  ShipmentRepository(Fixture f){this.f=f;}
  Optional<Shipment> findById(Long id){return Optional.of(value);}
  Optional<Shipment> findByIdForUpdate(Long id){f.calls.add("shipment:"+id);return findById(id);}
}
class PurchaseOrderInvoiceRowRepository {
  final Fixture f; Map<Long,PurchaseOrderInvoiceRow> rows=new LinkedHashMap<>();
  PurchaseOrderInvoiceRowRepository(Fixture f){this.f=f;}
  Optional<PurchaseOrderInvoiceRow> findById(Long id){return Optional.ofNullable(rows.get(id));}
  Optional<PurchaseOrderInvoiceRow> findByIdForUpdate(Long id){f.calls.add("row:"+id);return findById(id);}
}
class InvoiceRowLocations {
  Map<Long,InvoiceRowLocation> byRow=new HashMap<>();
  InvoiceRowLocation resolve(PurchaseOrderInvoiceRow row){return byRow.get(row.id());}
}
class InvoiceRowAllocations {
  List<InvoiceRowAllocationCommand> commands=new ArrayList<>();
  void allocate(Long orderId,Long rowId,InvoiceRowAllocationCommand cmd,Long actorId,OffsetDateTime at){commands.add(cmd);}
}
class ShipmentInvoiceGoodsReader {
  final Fixture f; ShipmentInvoiceGoodsReader(Fixture f){this.f=f;}
  ShipmentInvoiceGoods goods(Shipment s,Long except){return f.goods;}
  ShipmentInvoiceGoods read(User u,Long id,Long except){f.authorization.requireView(u);requireNotCancelled(f.shipments.value);return f.goods;}
  __NOT_CANCELLED__
}
class ShipmentInvoiceRepository {
  final Fixture f;
  Map<Long,ShipmentInvoice> values=new LinkedHashMap<>();
  Map<Long,List<ShipmentInvoiceLine>> lines=new LinkedHashMap<>();
  Map<Long,List<ShipmentInvoiceActivity>> activity=new HashMap<>();
  Map<UUID,CreationRequest> requests=new HashMap<>();
  long nextId=10,lastNumber=0,lineId=100; int writes=0,numbers=0;
  ShipmentInvoiceRepository(Fixture f){this.f=f;}
  Optional<ShipmentInvoice> findById(Long id){return Optional.ofNullable(values.get(id));}
  Optional<ShipmentInvoice> findByIdForUpdate(Long id){f.calls.add("invoice:"+id);return findById(id);}
  List<ShipmentInvoice> findByShipmentId(Long id){return values.values().stream().filter(i->i.shipmentId().equals(id)).toList();}
  Optional<ShipmentInvoice> findLiveReplacementOf(Long id){return values.values().stream().filter(i->id.equals(i.replacesShipmentInvoiceId())&&i.status()!=ShipmentInvoiceStatus.DISCARDED).findFirst();}
  List<ShipmentInvoiceLine> findLines(Long id){return lines.getOrDefault(id,List.of());}
  Map<Long,List<ShipmentInvoiceLine>> findLinesByInvoiceIds(Collection<Long> ids){Map<Long,List<ShipmentInvoiceLine>> result=new LinkedHashMap<>();ids.forEach(id->result.put(id,findLines(id)));return result;}
  List<ShipmentInvoiceActivity> findActivity(Long id){return activity.getOrDefault(id,List.of());}
  void lockRequest(UUID id){f.calls.add("request:"+id);}
  Optional<CreationRequest> findRequest(UUID id){return Optional.ofNullable(requests.get(id));}
  void recordRequest(CreationRequest r,OffsetDateTime now){requests.put(r.requestId(),r);writes++;}
  Long insert(Long shipmentId,ShipmentInvoiceFields fields,Long replaces,String reviewed,Long actor,OffsetDateTime now){
    Long id=nextId++;values.put(id,new ShipmentInvoice(id,shipmentId,ShipmentInvoiceStatus.DRAFT,null,fields,null,reviewed,replaces,null,null,null,null,null,null,null,0,actor,now,null,null));writes++;return id;
  }
  void replaceLines(Long id,List<Long> rowIds){List<ShipmentInvoiceLine> next=new ArrayList<>();int pos=1;for(Long row:rowIds)next.add(new ShipmentInvoiceLine(lineId++,id,pos++,row,null));lines.put(id,next);writes++;}
  void freezeLine(Long id,ShipmentInvoiceFrozenLine frozen){lines.replaceAll((i,ls)->ls.stream().map(l->l.id().equals(id)?new ShipmentInvoiceLine(l.id(),l.shipmentInvoiceId(),l.position(),l.invoiceRowId(),frozen):l).toList());writes++;}
  long nextNumber(long start){f.calls.add("counter");numbers++;lastNumber=lastNumber==0?start:lastNumber+1;return lastNumber;}
  boolean updateDraft(Long id,long version,ShipmentInvoiceFields fields,String reviewed,Long actor,OffsetDateTime now){return change(id,version,ShipmentInvoiceStatus.DRAFT,ShipmentInvoiceStatus.DRAFT,fields,reviewed,null,null,null,actor,now);}
  boolean discard(Long id,long version,Long actor,OffsetDateTime now){ShipmentInvoice i=values.get(id);return change(id,version,ShipmentInvoiceStatus.DRAFT,ShipmentInvoiceStatus.DISCARDED,i.fields(),i.reviewedFingerprint(),null,null,null,actor,now);}
  boolean finalize(Long id,long version,long num,PurchaseOrderMoney total,String reviewed,Long actor,OffsetDateTime now){ShipmentInvoice i=values.get(id);return change(id,version,ShipmentInvoiceStatus.DRAFT,ShipmentInvoiceStatus.FINALIZED,i.fields(),reviewed,num,total,null,actor,now);}
  boolean cancel(Long id,long version,String reason,Long actor,OffsetDateTime now){ShipmentInvoice i=values.get(id);return change(id,version,ShipmentInvoiceStatus.FINALIZED,ShipmentInvoiceStatus.CANCELLED,i.fields(),i.reviewedFingerprint(),i.invoiceNumber(),i.fullTotal(),reason,actor,now);}
  boolean change(Long id,long version,ShipmentInvoiceStatus expected,ShipmentInvoiceStatus status,ShipmentInvoiceFields fields,String reviewed,Long num,PurchaseOrderMoney total,String reason,Long actor,OffsetDateTime now){
    ShipmentInvoice i=values.get(id);if(i.version()!=version||i.status()!=expected)return false;
    values.put(id,new ShipmentInvoice(id,i.shipmentId(),status,num,fields,total,reviewed,i.replacesShipmentInvoiceId(),status==ShipmentInvoiceStatus.FINALIZED?actor:i.finalizedById(),status==ShipmentInvoiceStatus.FINALIZED?now:i.finalizedAt(),reason,status==ShipmentInvoiceStatus.CANCELLED?actor:i.cancelledById(),status==ShipmentInvoiceStatus.CANCELLED?now:i.cancelledAt(),status==ShipmentInvoiceStatus.DISCARDED?actor:i.discardedById(),status==ShipmentInvoiceStatus.DISCARDED?now:i.discardedAt(),version+1,i.createdById(),i.createdAt(),actor,now));writes++;return true;
  }
  void recordActivity(Long id,ShipmentInvoiceActivityType type,String changes,Long actor,OffsetDateTime now){activity.computeIfAbsent(id,k->new ArrayList<>()).add(new ShipmentInvoiceActivity((long)writes,id,type,changes,actor,now));writes++;}
  __REQUEST_RECORDS__
}
class Fixture {
  final List<String> calls=new ArrayList<>();
  final ShipmentInvoiceAuthorizationService authorization=new ShipmentInvoiceAuthorizationService();
  final ShipmentRepository shipments=new ShipmentRepository(this);
  final PurchaseOrderInvoiceRowRepository invoiceRows=new PurchaseOrderInvoiceRowRepository(this);
  final ShipmentInvoiceRepository invoices=new ShipmentInvoiceRepository(this);
  final ShipmentInvoiceGoodsReader goodsReader=new ShipmentInvoiceGoodsReader(this);
  final InvoiceRowLocations locations=new InvoiceRowLocations();
  final InvoiceRowAllocations allocations=new InvoiceRowAllocations();
  final ShipmentInvoiceService service=new ShipmentInvoiceService(this);
  final ShipmentInvoiceGuard guard=new ShipmentInvoiceGuard(this);
  ShipmentInvoiceGoods goods;
  Fixture(){setRows(List.of(row(1L,"Pump",10,"EUR",0),row(2L,"Valve",20,"EUR",0)),List.of(nullReason(),nullReason()));}
  static ShipmentInvoiceAwaitingReason nullReason(){return null;}
  void setRows(List<PurchaseOrderInvoiceRow> rows,List<ShipmentInvoiceAwaitingReason> reasons){
    List<ShipmentInvoiceGoods.Row> offered=new ArrayList<>();int ix=0;
    for(PurchaseOrderInvoiceRow r:rows){invoiceRows.rows.put(r.id(),r);InvoiceRowLocation l=locations.byRow.computeIfAbsent(r.id(),id->new InvoiceRowLocation(id,InvoiceRowAllocationState.CONFIRMED_GROUP,Set.of(11L,12L),Set.of(11L,12L)));offered.add(new ShipmentInvoiceGoods.Row(r,l,reasons.get(ix++),List.of()));}
    goods=new ShipmentInvoiceGoods(shipments.value,List.of(new ShipmentInvoiceGoods.Order(new PurchaseOrder(4L,"STOCK-4"),offered)),List.of(new ShipmentInvoiceGoods.Client(new Company(20L,CompanyType.CLIENT),List.of(new ShipmentInvoiceGoods.InvoicingCompany(new Company(21L,CompanyType.CLIENT),"Shipper")))));
  }
  static PurchaseOrderInvoiceRow row(Long id,String description,int amount,String currency,long allocationVersion){return new PurchaseOrderInvoiceRow(id,4L,id.intValue(),description,"1234",1,PurchaseOrderInvoiceUnit.PC,new BigDecimal(amount),new PurchaseOrderMoney(new BigDecimal(amount),currency),7L,OffsetDateTime.parse("2026-11-01T10:00:00Z"),null,null,4L,id.intValue(),null,1L,allocationVersion);}
  static PurchaseOrderInvoiceRow assignedRow(Long id,String description,int amount,String currency,long allocationVersion){return new PurchaseOrderInvoiceRow(id,4L,id.intValue(),description,"1234",1,PurchaseOrderInvoiceUnit.PC,new BigDecimal(amount),new PurchaseOrderMoney(new BigDecimal(amount),currency),7L,OffsetDateTime.parse("2026-11-01T10:00:00Z"),null,null,4L,id.intValue(),11L,null,allocationVersion);}
  ShipmentInvoiceView create(ShipmentInvoiceFields fields,List<Long> rows,String fingerprint){return service.create(ShipmentInvoiceBackendQa.operator,UUID.randomUUID(),1L,fields,rows,fingerprint);}
}
'''.replace("__NOT_CANCELLED__",require_not_cancelled).replace("__USER_METHODS__",user_methods).replace("__REQUEST_RECORDS__",request_records)
# List.of disallows null; the synthetic eligible-reason list must permit null.
stubs = stubs.replace("List.of(nullReason(),nullReason())", "Arrays.asList(nullReason(),nullReason())")

main = r'''
class ShipmentInvoiceBackendQa {
  static int controls=0,observations=0;
  static final User operator=new User(7L,UserRole.FRONTLINE_OPERATOR,CompanyType.FRONTLINE);
  static final User manager=new User(8L,UserRole.FRONTLINE_MANAGER,CompanyType.FRONTLINE);
  static final User partner=new User(9L,UserRole.CLIENT_MANAGER,CompanyType.CLIENT);
  static ShipmentInvoiceFields complete(){return new ShipmentInvoiceFields(20L,21L,ShipmentInvoiceType.INVOICE,"PACKING LIST",LocalDate.of(2026,11,9),"Shipper","Consignee","Agent",null,"2 boxes",BigDecimal.TEN,null,"EUR",null);}
  static ShipmentInvoiceFields incomplete(){return new ShipmentInvoiceFields(null,null,null,null,null,null,null,null,null,null,null,null,null,null);}
  static void check(String label,boolean ok){if(!ok)throw new AssertionError(label);controls++;System.out.println("PASS "+label);}
  static void observe(String label,boolean actual){if(!actual)throw new AssertionError("Observation changed: "+label);observations++;System.out.println("OBSERVED_BUG "+label);}
  static void reject(String label,String expected,Fixture f,Runnable action){int writes=f.invoices.writes,numbers=f.invoices.numbers;try{action.run();throw new AssertionError("Not rejected: "+label);}catch(ShipmentInvoiceRuleException e){if(!e.ruleCode().equals(expected))throw e;}catch(StaleVersionException e){if(!expected.equals("STALE"))throw e;}catch(RequestConflictException e){if(!expected.equals("CONFLICT"))throw e;}catch(AccessDeniedException e){if(!expected.equals("DENIED"))throw e;}catch(IllegalArgumentException e){if(!expected.equals("INVALID"))throw e;}check(label,writes==f.invoices.writes&&numbers==f.invoices.numbers);}
  static ShipmentInvoiceEvaluation eval(Fixture f,ShipmentInvoiceFields fields,List<Long> rows){return ShipmentInvoiceEvaluations.evaluate(f.goods,fields,rows,0);}
  public static void main(String[] args){
    System.setSecurityManager(new SecurityManager(){public void checkPermission(Permission p){}public void checkConnect(String h,int p){throw new SecurityException("Network disabled");}public void checkListen(int p){throw new SecurityException("Network disabled");}public void checkAccept(String h,int p){throw new SecurityException("Network disabled");}});
    Fixture f=new Fixture();
    ShipmentInvoiceFields normalized=ShipmentInvoiceRules.normalize(complete());
    check("normalize default currency and preserve zero-to-three decimal weight",normalized.totalWeightKg().scale()==3&&ShipmentInvoiceRules.normalize(incomplete()).partialTotalCurrency().equals("EUR"));
    ShipmentInvoiceEvaluation ev=eval(f,complete(),List.of(1L,2L));
    check("complete eligible selection totals EUR 30 and finalizable",ev.finalizable()&&ev.fullTotal().amount().compareTo(new BigDecimal(30))==0);
    check("empty incomplete draft exposes required fields",!eval(f,incomplete(),List.of()).finalizable()&&eval(f,incomplete(),List.of()).fullTotal()==null);
    reject("duplicate row refused","ROW_SELECTED_TWICE",f,()->ShipmentInvoiceRules.checkSelection(f.goods,List.of(1L,1L)));
    reject("absent row refused","ROWS_NOT_ELIGIBLE",f,()->ShipmentInvoiceRules.checkSelection(f.goods,List.of(99L)));
    Fixture mixed=new Fixture();mixed.setRows(List.of(Fixture.row(1L,"A",10,"EUR",0),Fixture.row(2L,"B",20,"USD",0)),Arrays.asList(null,null));
    reject("mixed currencies refused","MIXED_CURRENCY",mixed,()->ShipmentInvoiceRules.checkSelection(mixed.goods,List.of(1L,2L)));
    check("mixed evaluation has no total",eval(mixed,complete(),List.of(1L,2L)).mixedCurrency()&&eval(mixed,complete(),List.of(1L,2L)).fullTotal()==null);
    check("selection order changes review fingerprint",!ev.fingerprint().equals(eval(f,complete(),List.of(2L,1L)).fingerprint()));
    check("deleted row changes review fingerprint and blocks finalization",!ev.fingerprint().equals(ShipmentInvoiceEvaluations.evaluate(f.goods,complete(),List.of(1L,2L),1).fingerprint())&&!ShipmentInvoiceEvaluations.evaluate(f.goods,complete(),List.of(1L,2L),1).finalizable());
    check("absent acknowledgement requires initial review",ShipmentInvoiceReview.of(ev,null).items().equals(List.of(ShipmentInvoiceReviewItem.NOT_YET_REVIEWED)));
    check("matching acknowledgement satisfies review",!ShipmentInvoiceReview.of(ev,ev.fingerprint()).required());
    Fixture changed=new Fixture();changed.setRows(List.of(Fixture.row(1L,"Changed",10,"EUR",0),Fixture.row(2L,"Valve",20,"EUR",0)),Arrays.asList(null,null));
    check("source description edit invalidates review",ShipmentInvoiceReview.of(eval(changed,complete(),List.of(1L,2L)),ev.fingerprint()).required());
    Fixture missing=new Fixture();missing.setRows(List.of(Fixture.row(1L,"Pump",10,"EUR",0),Fixture.row(2L,"Valve",20,"EUR",1)),Arrays.asList(null,ShipmentInvoiceAwaitingReason.GROUP_PARTLY_ON_SHIPMENT));
    ShipmentInvoiceEvaluation un=eval(missing,complete(),List.of(1L,2L));
    check("partly covered row listed unavailable and blocks finalization",un.unavailableRowIds().equals(List.of(2L))&&!un.finalizable());
    check("eligibility change invalidates review",!un.fingerprint().equals(ev.fingerprint()));
    observe("SHI-B02 awaiting-allocation row remains in active total: EUR 30 (eligible amount EUR 10)",un.fullTotal().amount().compareTo(new BigDecimal(30))==0);
    Fixture coverage=new Fixture();coverage.locations.byRow.put(1L,new InvoiceRowLocation(1L,InvoiceRowAllocationState.COLLI,Set.of(11L),Set.of(11L)));coverage.setRows(List.of(Fixture.assignedRow(1L,"Pump",10,"EUR",1),Fixture.row(2L,"Valve",20,"EUR",0)),Arrays.asList(null,null));
    observe("SHI-B01 changed allocation coverage/version but eligible=true retains exact fingerprint",ev.fingerprint().equals(eval(coverage,complete(),List.of(1L,2L)).fingerprint()));
    check("sole represented Client auto-selected",ShipmentInvoiceService.parties(f.goods,incomplete(),true).clientCompanyId().equals(20L));
    reject("non-represented Client refused","CLIENT_NOT_ON_SHIPMENT",f,()->ShipmentInvoiceService.parties(f.goods,complete().withClient(99L),true));
    reject("company outside Client refused","INVOICING_COMPANY_NOT_OF_CLIENT",f,()->ShipmentInvoiceService.parties(f.goods,complete().withParties(20L,99L),true));
    for(ShipmentStatus status:List.of(ShipmentStatus.PREPARING,ShipmentStatus.DEPARTED,ShipmentStatus.ARRIVED)){ShipmentInvoiceGoodsReader.requireNotCancelled(new Shipment(1L,status));check("goods allowed for "+status,true);}
    reject("cancelled Shipment refused","SHIPMENT_CANCELLED",f,()->ShipmentInvoiceGoodsReader.requireNotCancelled(new Shipment(1L,ShipmentStatus.CANCELLED)));
    for(UserRole role:UserRole.values()){
      User u=new User(40L,role,(role==UserRole.FRONTLINE_OPERATOR||role==UserRole.FRONTLINE_MANAGER)?CompanyType.FRONTLINE:CompanyType.CLIENT);
      boolean staff=role==UserRole.FRONTLINE_OPERATOR||role==UserRole.FRONTLINE_MANAGER||role==UserRole.SYSTEM_ADMIN;
      check("role matrix view/create/edit "+role,f.authorization.canView(u)==staff&&f.authorization.canCreate(u)==staff&&f.authorization.canEdit(u)==staff);
      check("role matrix cancel "+role,f.authorization.canCancel(u)==(role==UserRole.FRONTLINE_MANAGER||role==UserRole.SYSTEM_ADMIN));
    }
    check("staff role on non-Frontline identity denied",!f.authorization.canView(new User(44L,UserRole.FRONTLINE_MANAGER,CompanyType.CLIENT)));
    check("null actor denied",!f.authorization.canView(null));
    reject("partner create denied","DENIED",f,()->f.service.create(partner,UUID.randomUUID(),1L,complete(),List.of(1L),null));
    reject("partner direct read denied","DENIED",f,()->f.service.findById(partner,10L));
    reject("missing request id refused","INVALID",f,()->f.service.create(operator,null,1L,incomplete(),List.of(),null));
    UUID key=UUID.randomUUID();ShipmentInvoiceView draft=f.service.create(operator,key,1L,complete(),List.of(2L,1L),null);Long id=draft.invoice().id();
    check("create is unnumbered and selection order retained",draft.invoice().invoiceNumber()==null&&draft.lines().stream().map(ShipmentInvoiceView.Line::invoiceRowId).toList().equals(List.of(2L,1L))&&f.invoices.numbers==0);
    int before=f.invoices.writes;check("same request returns same identity without new writes",f.service.create(operator,key,1L,complete(),List.of(2L,1L),null).invoice().id().equals(id)&&before==f.invoices.writes);
    reject("request payload mismatch conflicts","CONFLICT",f,()->f.service.create(operator,key,1L,complete(),List.of(1L),null));
    reject("request actor mismatch conflicts","CONFLICT",f,()->f.service.create(manager,key,1L,complete(),List.of(2L,1L),null));
    reject("stale save refuses without writes","STALE",f,()->f.service.save(operator,id,9L,complete(),List.of(1L),null));
    reject("unreviewed finalize consumes no number","REVIEW_REQUIRED",f,()->f.service.finalize(operator,id,0L,null));
    ShipmentInvoiceView reviewed=f.service.save(operator,id,0L,complete(),List.of(2L,1L),draft.review().fingerprint());
    check("save current fingerprint records review and advances version",!reviewed.review().required()&&reviewed.invoice().version()==1&&reviewed.activity().stream().anyMatch(a->a.type()==ShipmentInvoiceActivityType.REVIEW_CONFIRMED));
    f.calls.clear();ShipmentInvoiceView finalized=f.service.finalize(operator,id,1L,null);
    check("finalization freezes actual current lines and assigns first number",finalized.invoice().invoiceNumber()==400L&&finalized.lines().get(0).frozen().description().equals("Valve")&&finalized.fullTotal().amount().compareTo(new BigDecimal(30))==0);
    check("finalization call order Shipment then invoice then sorted rows then counter",f.calls.equals(List.of("shipment:1","invoice:"+id,"row:1","row:2","counter")));
    reject("repeat finalize old version consumes no second number","STALE",f,()->f.service.finalize(operator,id,1L,null));
    reject("repeat finalize current version consumes no second number","NOT_A_DRAFT",f,()->f.service.finalize(operator,id,2L,null));
    reject("finalized save refused","NOT_A_DRAFT",f,()->f.service.save(operator,id,2L,complete(),List.of(1L),null));
    f.setRows(List.of(Fixture.row(1L,"Edited source",900,"USD",1)),Arrays.asList((ShipmentInvoiceAwaitingReason)null));
    check("frozen view ignores source edits and current totals",f.service.findById(operator,id).fullTotal().amount().compareTo(new BigDecimal(30))==0&&f.service.findById(operator,id).lines().get(1).frozen().description().equals("Pump"));
    f.invoices.lines.put(id,f.invoices.findLines(id).stream().map(l->new ShipmentInvoiceLine(l.id(),l.shipmentInvoiceId(),l.position(),null,l.frozen())).toList());
    check("frozen lines retain values/source identities after FK null",f.service.findById(operator,id).lines().get(0).frozen().sourcePurchaseOrderId()==4L&&f.service.findById(operator,id).lines().get(0).frozen().description().equals("Valve"));
    reject("operator cannot cancel","DENIED",f,()->f.service.cancel(operator,id,2L,"Reason"));
    reject("blank cancel reason refused","CANCELLATION_REASON_REQUIRED",f,()->f.service.cancel(manager,id,2L,"  "));
    reject("overlong cancel reason refused","INVALID",f,()->f.service.cancel(manager,id,2L,"x".repeat(1001)));
    reject("stale cancellation refused","STALE",f,()->f.service.cancel(manager,id,1L,"Reason"));
    ShipmentInvoiceView cancelled=f.service.cancel(manager,id,2L,"  wrong details  ");
    check("cancel preserves number/frozen values and trims reason",cancelled.invoice().status()==ShipmentInvoiceStatus.CANCELLED&&cancelled.invoice().invoiceNumber()==400L&&cancelled.invoice().cancellationReason().equals("wrong details")&&cancelled.lines().get(0).frozen()!=null);
    reject("already cancelled refused","NOT_FINALIZED",f,()->f.service.cancel(manager,id,3L,"Reason"));
    int count=f.invoices.values.size();ShipmentInvoiceReplacementPrefill prefill=f.service.prepareReplacement(operator,id);
    check("replacement prefill writes nothing and flags deleted rows",f.invoices.values.size()==count&&prefill.deletedRowCount()==2&&prefill.invoiceRowIds().isEmpty());
    UUID replacementKey=UUID.randomUUID();ShipmentInvoiceView replacement=f.service.createReplacement(operator,replacementKey,id,complete(),List.of(1L));Long rid=replacement.invoice().id();
    check("replacement unnumbered unreviewed same Shipment bidirectional links",replacement.invoice().invoiceNumber()==null&&replacement.review().required()&&replacement.invoice().shipmentId()==1L&&replacement.replaces().id().equals(id)&&f.service.findById(operator,id).replacement().id().equals(rid));
    check("replacement request replay returns same identity",f.service.createReplacement(operator,replacementKey,id,complete(),List.of(1L)).invoice().id().equals(rid));
    reject("second live replacement denied","REPLACEMENT_EXISTS",f,()->f.service.createReplacement(operator,UUID.randomUUID(),id,complete(),List.of(1L)));
    reject("prefill denied with live replacement","REPLACEMENT_EXISTS",f,()->f.service.prepareReplacement(operator,id));
    f.service.discard(operator,rid,0L);
    check("discard frees replacement slot",f.service.prepareReplacement(operator,id)!=null&&f.service.findById(operator,id).replacement()==null);
    check("discarded replacement replay retains original identity",f.service.createReplacement(operator,replacementKey,id,complete(),List.of(1L)).invoice().status()==ShipmentInvoiceStatus.DISCARDED);
    check("Shipment card excludes discarded",f.service.findByShipmentId(operator,1L).stream().noneMatch(i->i.invoice().status()==ShipmentInvoiceStatus.DISCARDED));
    Fixture disc=new Fixture();UUID dk=UUID.randomUUID();ShipmentInvoiceView dd=disc.service.create(operator,dk,1L,incomplete(),List.of(),null);disc.service.discard(operator,dd.invoice().id(),0L);
    check("incomplete draft creates/discards and original create replays discarded",disc.service.create(operator,dk,1L,incomplete(),List.of(),null).invoice().status()==ShipmentInvoiceStatus.DISCARDED);
    reject("discarded draft cannot save","NOT_A_DRAFT",disc,()->disc.service.save(operator,dd.invoice().id(),1L,incomplete(),List.of(),null));
    Fixture inc=new Fixture();ShipmentInvoiceView ii=inc.create(incomplete(),List.of(),null);reject("incomplete finalize consumes no number","FINALIZATION_INCOMPLETE",inc,()->inc.service.finalize(operator,ii.invoice().id(),0L,ii.review().fingerprint()));
    Fixture cov=new Fixture();ShipmentInvoiceView cd=cov.create(complete(),List.of(1L,2L),ev.fingerprint());
    cov.locations.byRow.put(1L,new InvoiceRowLocation(1L,InvoiceRowAllocationState.COLLI,Set.of(11L),Set.of(11L)));cov.setRows(List.of(Fixture.assignedRow(1L,"Pump",10,"EUR",1),Fixture.row(2L,"Valve",20,"EUR",0)),Arrays.asList(null,null));
    ShipmentInvoiceView cf=cov.service.finalize(operator,cd.invoice().id(),0L,null);
    observe("SHI-B01 service finalizes changed coverage with old stored review and no fresh fingerprint",cf.invoice().status()==ShipmentInvoiceStatus.FINALIZED);
    Fixture totals=new Fixture();ShipmentInvoiceView td=totals.create(complete(),List.of(1L,2L),ev.fingerprint());totals.setRows(List.of(Fixture.row(1L,"Pump",10,"EUR",0),Fixture.row(2L,"Valve",20,"EUR",1)),Arrays.asList(null,ShipmentInvoiceAwaitingReason.GROUP_PARTLY_ON_SHIPMENT));
    observe("SHI-B02 saved draft view exposes EUR 30 total after EUR 20 row becomes unavailable",totals.service.findById(operator,td.invoice().id()).fullTotal().amount().compareTo(new BigDecimal(30))==0);
    reject("same unavailable saved draft cannot finalize","FINALIZATION_INCOMPLETE",totals,()->totals.service.finalize(operator,td.invoice().id(),0L,null));
    Fixture guards=new Fixture();ShipmentInvoiceView gd=guards.create(complete(),List.of(1L),null);
    reject("draft blocks Shipment cancellation","SHIPMENT_HAS_SHIPMENT_INVOICES",guards,()->guards.guard.beforeShipmentCancel(1L));
    ShipmentInvoiceView gf=guards.service.finalize(operator,gd.invoice().id(),0L,gd.review().fingerprint());
    reject("finalized blocks Shipment cancellation","SHIPMENT_HAS_SHIPMENT_INVOICES",guards,()->guards.guard.beforeShipmentCancel(1L));
    reject("finalized goods leaving need confirmation","FINALIZED_INVOICE_GOODS_REMOVED",guards,()->guards.guard.beforeGoodsLeave(1L,Set.of(11L),Set.of(12L),false,7L,OffsetDateTime.now()));
    guards.guard.beforeGoodsLeave(1L,Set.of(11L),Set.of(12L),true,7L,OffsetDateTime.now());
    check("confirmed goods removal allocates to remaining colli with actor/version context",guards.allocations.commands.size()==1&&guards.allocations.commands.get(0).kind()==InvoiceRowAllocationKind.ASSIGNED_TO_COLLI&&guards.allocations.commands.get(0).handlingUnitId()==12L&&guards.allocations.commands.get(0).shipmentId()==1L);
    guards.guard.beforeGoodsLeave(1L,Set.of(11L,12L),Set.of(),true,7L,OffsetDateTime.now());
    check("documented all-goods-leave confirmation does not allocate empty group",guards.allocations.commands.size()==1);
    guards.service.cancel(manager,gf.invoice().id(),1L,"correction");guards.guard.beforeShipmentCancel(1L);
    check("only cancelled invoices do not block Shipment cancellation",true);
    System.out.println("RESULT "+controls+" controls passed; "+observations+" observations across 2 confirmed contract mismatches. Actual methods/records with stand-ins; no SQL/Spring/transaction/concurrency execution.");
  }
}
'''

program = imports + main + stubs + actual
program = program.replace("CreationRequestKind.", "ShipmentInvoiceRepository.CreationRequestKind.")
# The production service imports nested repository types; qualify those names
# in the flattened harness while leaving the method logic unchanged.
program = re.sub(r"(?<![.\w])CreationRequestKind(?= kind)", "ShipmentInvoiceRepository.CreationRequestKind", program)
program = program.replace("new CreationRequest(", "new ShipmentInvoiceRepository.CreationRequest(")
directory = args.scratch.resolve() if args.scratch else Path(tempfile.mkdtemp(prefix="shipment-invoice-backend-"))
directory.mkdir(parents=True, exist_ok=True)
source_file = directory / "ShipmentInvoiceBackendQa.java"
source_file.write_text(program, encoding="utf-8")
(directory / "source-sha256.txt").write_text("\n".join(hashes) + "\n", encoding="utf-8")
print("Actual-source manifest entries:", len(hashes), flush=True)
print("ShipmentInvoiceService sha256=" + hashlib.sha256((base / "shipmentinvoices/ShipmentInvoiceService.java").read_text(encoding="utf-8").encode()).hexdigest(), flush=True)
print("Compatibility: getFirst -> get(0); flattened package/imports; explicit constructor injection. Repositories/JSON/clock/DI/external entities are stand-ins.", flush=True)
result = subprocess.run([str(java), "--source", "17", str(source_file)], check=False)
if not args.scratch:
    shutil.rmtree(directory)
raise SystemExit(result.returncode)
