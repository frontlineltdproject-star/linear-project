"""Offline VAT event and YD grouping controls against extracted production methods.

Runs unchanged Java method bodies from the supplied pinned repository with DTO,
repository, authorization, clock and JSON stand-ins. Requires Java 17+, downloads
nothing. Not Spring, SQL, actual locking, transaction rollback, auth or PDF-render
verification. The full Java 25 application is not built by this script.
"""
import argparse
import hashlib
from pathlib import Path
import socket
import subprocess
import tempfile

def blocked(*args, **kwargs):
    raise RuntimeError("Network blocked by VAT paperwork audit")

socket.socket = blocked
socket.create_connection = blocked
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("repository_root", type=Path)
parser.add_argument("--java", required=True, type=Path)
args = parser.parse_args()
base = args.repository_root / "frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain"
stamp = (base / "exports/ExportStampingService.java").read_text(encoding="utf-8")
yd = (base / "exports/ExportYdService.java").read_text(encoding="utf-8")
stale = (base / "concurrency/StaleVersionException.java").read_text(encoding="utf-8")
codes = (base / "exports/ExportRuleCode.java").read_text(encoding="utf-8")

def extract(source, signature):
    start = source.index(signature)
    end = source.index("{", start) + 1
    depth = 1
    while depth:
        depth += (source[end] == "{") - (source[end] == "}")
        end += 1
    return source[start:end]

stamp_methods = "\n".join(extract(stamp, sig) for sig in [
    "public SupplierInvoice recordInvoiceEvent(",
    "public ExportStampingResults recordExportEvents(",
    "private ExportDeclaration lockStampable(",
    "private static @Nullable Verdict evaluate(",
    "private void record(",
    "private static SupplierInvoiceChange status(",
    "private static Verdict replayOrStage(",
    "private static Verdict rejected(",
    "private static void requireEvent(",
    "private LocalDate requireDate(",
    "private OffsetDateTime now(",
    "private record Verdict(",
])
yd_methods = "\n".join(extract(yd, sig) for sig in [
    "public List<ExportYdGroup> documents(",
    "public ExportDeclaration export(",
    "private ExportDeclaration printable(",
    "private List<SupplierInvoice> selected(",
    "private List<ExportYdGroup> group(",
])
program = r'''
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.lang.annotation.*;
import java.security.Permission;
class VatPaperworkQa {
  @Target({ElementType.TYPE_USE,ElementType.PARAMETER,ElementType.METHOD}) @interface Nullable {}
  __CODES__
  enum ExportCustomsStatus { AWAITING_EAD, AWAITING_IE599, COMPLETED }
  enum StampingEvent { DISPATCH, RETURN, PAPERWORK_SENT }
  enum InvoiceStampingOutcome { RECORDED, ALREADY_RECORDED, REJECTED }
  enum SupplierInvoiceType { VAT_EXEMPTION_DOCUMENT, STORAGE_ENTRY }
  enum VatExemptionStatus { NOT_REQUIRED, NOT_STARTED, IN_PROGRESS, EXEMPTED }
  enum SupplierInvoiceActivityType { DISPATCH_RECORDED, RETURN_RECORDED, PAPERWORK_SENT_RECORDED }
  enum ExportYdTemplate { ATHENS_AIRPORT, PIRAEUS_A, PIRAEUS_C }
  record User(Long id) {}
  record SupplierInvoiceChange(String field,String before,String after) {}
  record InvoiceStampingResult(Long invoiceId,InvoiceStampingOutcome outcome,ExportRuleCode reason) {}
  record ExportStampingResults(ExportDeclaration export,List<InvoiceStampingResult> outcomes) {}
  record ExportDeclarationInvoice(Long supplierInvoiceId,boolean selected) {}
  record ExportYdGroup(Long invoiceCompanyId,Long supplierCompanyId,List<SupplierInvoice> invoices) {}
  record Parties(Long invoiceCompanyId) {}
  record PurchaseOrder(Long id,Parties parties) {}
  static class SupplierInvoiceService { static final ZoneId BUSINESS_ZONE=ZoneId.of("Europe/Athens"); }
  static class ExportRuleException extends RuntimeException {
    final ExportRuleCode code;
    ExportRuleException(ExportRuleCode c,String m){super(m);code=c;}
    ExportRuleException(ExportRuleCode c,String m,Map<?,?> details){this(c,m);}
  }
  static class StaleVersionException extends RuntimeException {
    StaleVersionException(String m){super(m);}
    __STALE__
  }
  static class Authorization { void requireEdit(User actor) {} }
  static class Json { String writeValueAsString(Object value){return value.toString();} }
  static class SupplierInvoice {
    Long id,order,supplier,stampingExport; long version=1;
    boolean cancelled=false; String number; LocalDate invoiceDate=LocalDate.of(2026,11,1),dispatch,returned,sent;
    SupplierInvoiceType type=SupplierInvoiceType.VAT_EXEMPTION_DOCUMENT;
    VatExemptionStatus status=VatExemptionStatus.NOT_STARTED;
    SupplierInvoice(long id){this.id=id;order=id;supplier=10L;number="SYN-"+id;}
    Long id(){return id;} Long purchaseOrderId(){return order;} Long supplierCompanyId(){return supplier;}
    String invoiceNumber(){return number;} long version(){return version;} boolean cancelled(){return cancelled;}
    SupplierInvoiceType invoiceType(){return type;} VatExemptionStatus vatExemptionStatus(){return status;}
    LocalDate invoiceDate(){return invoiceDate;} LocalDate stampingDispatchDate(){return dispatch;}
    LocalDate stampingReturnDate(){return returned;} LocalDate paperworkSentDate(){return sent;}
    Long stampingExportId(){return stampingExport;}
  }
  static class ExportDeclaration {
    Long id; boolean cancelled=false; ExportCustomsStatus stage=ExportCustomsStatus.COMPLETED;
    ExportDeclaration(long id){this.id=id;} Long id(){return id;} Long invoiceCompanyId(){return 20L;}
    boolean cancelled(){return cancelled;} ExportCustomsStatus customsStatus(){return stage;}
  }
  static class Exports {
    Map<Long,ExportDeclaration> data=new LinkedHashMap<>(); Map<Long,Long> members=new LinkedHashMap<>();
    Optional<ExportDeclaration> findById(Long id){return Optional.ofNullable(data.get(id));}
    Optional<ExportDeclaration> findByIdForUpdate(Long id){return findById(id);}
    void lockInvoices(List<Long> ids) {}
    Map<Long,Long> activeExportIdsByInvoiceId(List<Long> ids){Map<Long,Long> out=new HashMap<>();for(Long id:ids)if(members.containsKey(id))out.put(id,members.get(id));return out;}
    List<ExportDeclarationInvoice> findSelectedInvoices(List<Long> ids){return members.entrySet().stream().filter(e->ids.contains(e.getValue())).map(e->new ExportDeclarationInvoice(e.getKey(),true)).toList();}
  }
  static class Invoices {
    Map<Long,SupplierInvoice> data=new LinkedHashMap<>(); List<String> activities=new ArrayList<>();
    Optional<SupplierInvoice> findById(Long id){return Optional.ofNullable(data.get(id));}
    List<SupplierInvoice> findByIds(List<Long> ids){return ids.stream().map(data::get).filter(Objects::nonNull).toList();}
    void recordStampingDispatch(Long id,LocalDate date,Long exportId,Long actor,OffsetDateTime now){var i=data.get(id);i.dispatch=date;i.stampingExport=exportId;i.status=VatExemptionStatus.IN_PROGRESS;i.version++;}
    void recordStampingReturn(Long id,LocalDate date,Long actor,OffsetDateTime now){var i=data.get(id);i.returned=date;i.status=VatExemptionStatus.EXEMPTED;i.version++;}
    void recordPaperworkSent(Long id,LocalDate date,Long actor,OffsetDateTime now){var i=data.get(id);i.sent=date;i.version++;}
    void recordActivity(Long id,SupplierInvoiceActivityType type,String json,Long actor,OffsetDateTime now){activities.add(id+":"+type+":"+json);}
  }
  static class Orders {
    Map<Long,PurchaseOrder> data=new HashMap<>();
    List<PurchaseOrder> findByIds(Set<Long> ids){return ids.stream().map(data::get).filter(Objects::nonNull).toList();}
  }
  static class Stamping {
    final Authorization authorization=new Authorization(); final Exports exports; final Invoices invoices;
    final Clock clock=Clock.fixed(Instant.parse("2026-11-08T22:30:00Z"),ZoneOffset.UTC);
    static final Json JSON=new Json();
    static final Map<ExportRuleCode,String> REJECTIONS=Map.of();
    Stamping(Exports e,Invoices i){exports=e;invoices=i;}
    __STAMP__
  }
  static class Printing {
    final Authorization authorization=new Authorization(); final Exports exports; final Invoices invoices; final Orders purchaseOrders;
    static final int MAX_INVOICES_PER_DOCUMENT=5;
    Printing(Exports e,Invoices i,Orders o){exports=e;invoices=i;purchaseOrders=o;}
    __YD__
  }
  static final User USER=new User(7L); static int checks;
  static void check(boolean condition,String name){if(!condition)throw new AssertionError(name);checks++;System.out.println("PASS "+name);}
  static void refusal(Runnable action,String expected){try{action.run();throw new AssertionError("Expected "+expected);}catch(ExportRuleException e){check(e.code.name().equals(expected),expected);}catch(StaleVersionException e){check(expected.equals("CONFLICT"),expected);}catch(IllegalArgumentException e){check(expected.equals("ARGUMENT"),expected);}}
  static LocalDate day(int n){return LocalDate.of(2026,11,n);}
  static class Fixture {
    Exports e=new Exports(); Invoices i=new Invoices(); Orders o=new Orders(); Stamping s=new Stamping(e,i);Printing p=new Printing(e,i,o);
    Fixture(){e.data.put(1L,new ExportDeclaration(1));e.data.put(2L,new ExportDeclaration(2));}
    SupplierInvoice add(long id){var inv=new SupplierInvoice(id);i.data.put(id,inv);e.members.put(id,1L);o.data.put(id,new PurchaseOrder(id,new Parties(20L)));return inv;}
    void single(SupplierInvoice inv,StampingEvent event,LocalDate date){s.recordInvoiceEvent(USER,inv.id,inv.version,event,date);}
  }
  public static void main(String[] args){
    System.setSecurityManager(new SecurityManager(){public void checkPermission(Permission p){}public void checkConnect(String host,int port){throw new SecurityException("Network blocked");}});
    Fixture f=new Fixture();var a=f.add(1);f.single(a,StampingEvent.DISPATCH,day(5));
    check(a.status==VatExemptionStatus.IN_PROGRESS&&a.dispatch.equals(day(5))&&a.stampingExport==1L&&f.i.activities.size()==1,"single dispatch fields and audit");
    f.s.recordInvoiceEvent(USER,1L,0L,StampingEvent.DISPATCH,day(5));
    check(a.version==2&&f.i.activities.size()==1,"same-date replay ignores old version without writing");
    refusal(()->f.single(a,StampingEvent.DISPATCH,day(6)),"STAMPING_STAGE");
    f.single(a,StampingEvent.RETURN,day(6));f.single(a,StampingEvent.PAPERWORK_SENT,day(7));
    check(a.status==VatExemptionStatus.EXEMPTED&&a.dispatch.equals(day(5))&&a.returned.equals(day(6))&&a.sent.equals(day(7))&&f.i.activities.size()==3,"return and onward sending retain exemption and dates");
    var b=f.add(2);
    refusal(()->f.s.recordInvoiceEvent(USER,2L,0L,StampingEvent.DISPATCH,day(5)),"CONFLICT");
    refusal(()->f.s.recordInvoiceEvent(USER,2L,null,StampingEvent.DISPATCH,day(5)),"ARGUMENT");
    refusal(()->f.single(b,StampingEvent.RETURN,day(5)),"STAMPING_STAGE");
    refusal(()->f.single(b,StampingEvent.PAPERWORK_SENT,day(5)),"STAMPING_STAGE");
    refusal(()->f.single(b,StampingEvent.DISPATCH,null),"STAMPING_DATE_REQUIRED");
    refusal(()->f.single(b,StampingEvent.DISPATCH,day(10)),"STAMPING_DATE_FUTURE");
    refusal(()->f.single(b,StampingEvent.DISPATCH,LocalDate.of(2026,10,31)),"STAMPING_DATE_BEFORE_INVOICE_DATE");
    f.e.data.get(1L).stage=ExportCustomsStatus.AWAITING_IE599;
    refusal(()->f.single(b,StampingEvent.DISPATCH,day(5)),"STAMPING_BEFORE_IE599");
    f.e.data.get(1L).stage=ExportCustomsStatus.COMPLETED;f.e.data.get(1L).cancelled=true;
    refusal(()->f.single(b,StampingEvent.DISPATCH,day(5)),"EXPORT_CANCELLED");f.e.data.get(1L).cancelled=false;
    b.cancelled=true;refusal(()->f.single(b,StampingEvent.DISPATCH,day(5)),"INVOICE_CANCELLED");b.cancelled=false;
    b.type=SupplierInvoiceType.STORAGE_ENTRY;refusal(()->f.single(b,StampingEvent.DISPATCH,day(5)),"STAMPING_NOT_REQUIRED");b.type=SupplierInvoiceType.VAT_EXEMPTION_DOCUMENT;
    f.e.members.remove(2L);refusal(()->f.single(b,StampingEvent.DISPATCH,day(5)),"STAMPING_NO_EXPORT");f.e.members.put(2L,1L);
    check(b.version==1&&b.dispatch==null&&f.i.activities.size()==3,"all refusals preserved the pending invoice");
    f.single(b,StampingEvent.DISPATCH,day(9));check(b.dispatch.equals(day(9)),"Athens today can be next UTC day");
    refusal(()->f.single(b,StampingEvent.RETURN,day(8)),"STAMPING_DATE_BEFORE_DISPATCH");
    f.e.members.put(2L,2L);refusal(()->f.single(b,StampingEvent.RETURN,day(9)),"STAMPING_OTHER_EXPORT");f.e.members.put(2L,1L);
    f.single(b,StampingEvent.RETURN,day(9));refusal(()->f.single(b,StampingEvent.PAPERWORK_SENT,day(8)),"STAMPING_DATE_BEFORE_RETURN");
    Fixture bulk=new Fixture();var early=bulk.add(1);var late=bulk.add(2);late.invoiceDate=day(8);var unselected=bulk.add(3);var wrong=bulk.add(4);wrong.type=SupplierInvoiceType.STORAGE_ENTRY;var outside=bulk.add(5);bulk.e.members.put(5L,2L);
    var mixed=bulk.s.recordExportEvents(USER,1L,StampingEvent.DISPATCH,day(5),Arrays.asList(1L,1L,null,2L,4L,5L,99L));
    check(mixed.outcomes().size()==5&&mixed.outcomes().get(0).outcome()==InvoiceStampingOutcome.RECORDED&&mixed.outcomes().stream().filter(x->x.outcome()==InvoiceStampingOutcome.REJECTED).count()==4,"bulk dedupe and per-invoice partial results");
    check(late.version==1&&wrong.version==1&&outside.version==1&&unselected.version==1&&bulk.i.activities.size()==1,"bulk rejected and unselected preserved");
    var replay=bulk.s.recordExportEvents(USER,1L,StampingEvent.DISPATCH,day(5),List.of(1L));check(replay.outcomes().get(0).outcome()==InvoiceStampingOutcome.ALREADY_RECORDED&&early.version==2&&bulk.i.activities.size()==1,"bulk replay writes nothing");
    refusal(()->bulk.s.recordExportEvents(USER,1L,StampingEvent.DISPATCH,day(5),List.of()),"STAMPING_INVOICES_REQUIRED");
    Fixture print=new Fixture();for(int n=1;n<=9;n++)print.add(n);print.i.data.get(7L).supplier=11L;print.o.data.put(8L,new PurchaseOrder(8L,new Parties(21L)));print.e.members.put(9L,2L);
    var groups=print.p.documents(USER,1L,ExportYdTemplate.ATHENS_AIRPORT,List.of(1L,2L,3L,4L,5L,6L,7L,8L));
    check(groups.size()==4&&groups.stream().allMatch(g->g.invoices().size()<=5)&&groups.stream().mapToInt(g->g.invoices().size()).sum()==8,"YD company-supplier grouping and five-per-document split");
    check(groups.stream().allMatch(g->g.invoices().stream().allMatch(i->i.supplier.equals(g.supplierCompanyId()))),"YD group identity follows supplier");
    for(var stage:ExportCustomsStatus.values()){print.e.data.get(1L).stage=stage;check(print.p.documents(USER,1L,ExportYdTemplate.PIRAEUS_A,List.of(1L)).size()==1,"print at "+stage);}
    for(var t:ExportYdTemplate.values())check(print.p.documents(USER,1L,t,Arrays.asList(1L,1L,null)).get(0).invoices().size()==1,"template selection and dedupe "+t);
    refusal(()->print.p.documents(USER,1L,null,List.of(1L)),"YD_TEMPLATE_REQUIRED");
    refusal(()->print.p.documents(USER,1L,ExportYdTemplate.ATHENS_AIRPORT,List.of()),"YD_INVOICES_REQUIRED");
    refusal(()->print.p.documents(USER,1L,ExportYdTemplate.ATHENS_AIRPORT,List.of(9L)),"INVOICE_NOT_SELECTED");
    print.i.data.get(1L).cancelled=true;refusal(()->print.p.documents(USER,1L,ExportYdTemplate.ATHENS_AIRPORT,List.of(1L)),"INVOICE_CANCELLED");print.i.data.get(1L).cancelled=false;
    print.i.data.get(1L).type=SupplierInvoiceType.STORAGE_ENTRY;refusal(()->print.p.documents(USER,1L,ExportYdTemplate.ATHENS_AIRPORT,List.of(1L)),"YD_INVOICE_NOT_ELIGIBLE");print.i.data.get(1L).type=SupplierInvoiceType.VAT_EXEMPTION_DOCUMENT;
    print.e.data.get(1L).cancelled=true;refusal(()->print.p.documents(USER,1L,ExportYdTemplate.ATHENS_AIRPORT,List.of(1L)),"EXPORT_CANCELLED");
    check(print.i.activities.isEmpty()&&print.i.data.values().stream().allMatch(i->i.version==1&&i.dispatch==null),"printing calls perform no invoice writes");
    System.out.println("TOTAL "+checks+" controls passed; extracted methods, stand-ins, no Spring/SQL/PDF execution");
  }
}
'''
program = program.replace("__CODES__", codes[codes.index("public enum ExportRuleCode"):])
program = program.replace("__STALE__", extract(stale, "public static void requireCurrent("))
program = program.replace("__STAMP__", stamp_methods).replace("__YD__", yd_methods)
print("STAMP_METHODS_SHA256", hashlib.sha256(stamp_methods.encode()).hexdigest())
print("YD_METHODS_SHA256", hashlib.sha256(yd_methods.encode()).hexdigest())
with tempfile.TemporaryDirectory(prefix="frontline-vat-guards-") as folder:
    file = Path(folder) / "VatPaperworkQa.java"
    file.write_text(program, encoding="utf-8")
    result = subprocess.run([str(args.java), "-Dfile.encoding=UTF-8", "--source", "17", str(file)], capture_output=True, text=True, encoding="utf-8")
    print(result.stdout)
    if result.returncode:
        print(result.stderr)
    raise SystemExit(result.returncode)
