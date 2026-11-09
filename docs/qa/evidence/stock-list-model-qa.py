"""Offline exact-source Stock List QA; Java17 stand-ins, no SQL/Spring/PDF/network.
Writes only StockListModelQa.java and stock-list-model-qa-results.json beside this file.
Usage: python stock-list-model-qa.py [pinned source directory] [Java17 executable]
"""
from pathlib import Path
import hashlib, json, re, socket, subprocess, sys
ROOT=Path(sys.argv[1] if len(sys.argv)>1 else r"C:\Users\Giorgos\AppData\Local\Temp\frontline-audit-20261109-6aa2595\Frontline-Forwarding-frontline-forwarding-6aa259553cd9c86a8aaa157902088aa9a6bca83e")
HERE=Path(__file__).resolve().parent
JAVA=sys.argv[2] if len(sys.argv)>2 else r"C:\Program Files\Java\jdk-17\bin\java.exe"
P="frontline-forwarding-app/src/main/java/com/frontline/forwarding/"
hashes={}; extracts=[]
def offline(*a,**k): raise RuntimeError("Network prohibited")
socket.socket=offline; socket.create_connection=offline
def read(path):
    f=ROOT/path; hashes[path]=hashlib.sha256(f.read_bytes()).hexdigest()
    return f.read_text(encoding="utf-8")
def method(path,signature):
    s=read(P+path); start=s.index(signature); end=s.index("{",start)+1; depth=1
    while depth:
        depth+=(s[end]=="{")-(s[end]=="}"); end+=1
    block=s[start:end]
    extracts.append(dict(file=P+path,signature=signature,line=s[:start].count("\n")+1,sha256=hashlib.sha256(block.encode()).hexdigest()))
    return block
def clazz(path,name,kind="class"):
    # Declaration nesting and framework annotation removal only. Bodies unchanged.
    return method(path,"public "+kind+" "+name).replace("public "+kind+" "+name,"static "+kind+" "+name,1).replace("\t@Transactional(readOnly = true)\n","")
def dto(name,fields):
    result="static class "+name+" {\n"
    for f in fields.split(";"):
        t,k=f.strip().rsplit(" ",1); result+=f"{t} {k}; {t} {k}() {{return {k};}}\n"
    return result+"}\n"
factory=clazz("web/purchaseorders/service/StockListPdfModelFactory.java","StockListPdfModelFactory")
row=clazz("web/purchaseorders/service/StockListPdfRow.java","StockListPdfRow","record")
model=clazz("web/purchaseorders/service/StockListPdfModel.java","StockListPdfModel","record")
service=clazz("web/purchaseorders/service/StockListPdfService.java","StockListPdfService")
# Equivalent to Lombok's generated required-args constructor.
service=service[:-1]+"""StockListPdfService(PurchaseOrdersApiService a,ShipmentRepository b,StockListPdfModelFactory c,PdfRenderService d){
purchaseOrdersApiService=a;shipmentRepository=b;modelFactory=c;pdfRenderService=d;
}}"""
auth=clazz("domain/purchaseorders/PurchaseOrderAuthorizationService.java","PurchaseOrderAuthorizationService")
lookup=method("web/purchaseorders/service/PurchaseOrdersApiService.java","public PurchaseOrderOutput findById(Long id)")
required=method("web/purchaseorders/service/PurchaseOrdersApiService.java","private PurchaseOrder requirePurchaseOrder(Long id)")
latest=method("domain/shipments/ShipmentRepository.java","public Optional<Shipment> findLatestByPurchaseOrderId(Long purchaseOrderId)")
source=r"""
import java.math.*; import java.time.*; import java.time.format.*; import java.util.*;
import java.util.function.*; import java.util.stream.*; import java.security.Permission;
class StockListModelQa {
"""+factory+row+model+service+auth
source+=dto("PurchaseOrderOutput","""Long id;String internalNumber;String messageNumber;String ownerReference;String supplierReference;String internalNotes;String externalNotes;String status;CompanyReferenceOutput clientCompany;CompanyReferenceOutput supplierCompany;VesselOutput vessel;WarehouseStayOutput currentWarehouseStay;WarehouseStayOutput lastKnownWarehouseStay;List<HandlingUnitOutput> handlingUnits""")
source+=dto("HandlingUnitOutput","""Long id;Long currentPurchaseOrderId;String packageType;boolean dangerousGoods;String dangerousGoodsClass;Integer declaredLengthCm;Integer declaredWidthCm;Integer declaredHeightCm;BigDecimal declaredGrossWeightKg;BigDecimal declaredNetWeightKg;BigDecimal volumeWeightRoadKg;BigDecimal volumeWeightSeaKg;BigDecimal volumeWeightAirKg;BigDecimal volumeWeightCourierKg;Object terminalDisposition;List<HandlingUnitMeasurementOutput> measurements""")
source+=dto("HandlingUnitMeasurementOutput","""Long id;String source;OffsetDateTime measuredAt;Integer lengthCm;Integer widthCm;Integer heightCm;BigDecimal grossWeightKg;BigDecimal netWeightKg""")
source+=r"""
record CompanyReferenceOutput(Long id,String name){}
record VesselOutput(String name){}
record WarehouseOutput(String code,String name){}
record WarehouseStayOutput(WarehouseOutput warehouse,String storagePosition){}
record PurchaseOrderParties(Long clientCompanyId,Long supplierCompanyId){}
record PurchaseOrder(Long id,PurchaseOrderParties parties,PurchaseOrderOutput fixture){}
enum UserAuthority {PURCHASE_ORDER_CREATE,PURCHASE_ORDER_VIEW,PURCHASE_ORDER_EDIT}
record Role(boolean view){boolean hasAuthority(UserAuthority a){return view;}}
record User(Role role,CompanyReferenceOutput company,boolean isSystemAdmin,boolean isFrontlineUser){}
static class AccessDeniedException extends RuntimeException{AccessDeniedException(String s){super(s);}}
static class AuthorizationService{User actor;User currentUser(){return actor;}}
static class PurchaseOrderRepository{
 final Map<Long,PurchaseOrder> orders=new HashMap<>();final List<Long> calls=new ArrayList<>();
 Optional<PurchaseOrder> findById(Long id){calls.add(id);return Optional.ofNullable(orders.get(id));}
}
static class PurchaseOrderOutputAssembler{
 final List<Long> participantIds=new ArrayList<>();
 PurchaseOrderOutput toOutput(PurchaseOrder p,Long scope){participantIds.add(scope);return p.fixture();}
}
static class PurchaseOrdersApiService{
 final AuthorizationService authorizationService=new AuthorizationService();
 final PurchaseOrderRepository purchaseOrderRepository=new PurchaseOrderRepository();
 final PurchaseOrderAuthorizationService purchaseOrderAuthorizationService=new PurchaseOrderAuthorizationService();
 final PurchaseOrderOutputAssembler outputAssembler=new PurchaseOrderOutputAssembler();
"""+lookup+required+r"""
}
record ShipmentTransportDocument(String number){}
record Shipment(Long id,ShipmentTransportDocument transportDocument){}
enum ShipmentMovementCloseReason{REMOVED}
enum ShipmentStatus{CANCELLED}
record GeneratedPdf(String filename,byte[] content){}
static class PdfRenderService{
 int calls;String template,filename;StockListPdfModel model;boolean fail;
 GeneratedPdf render(String t,Map<String,Object> m,String f){
 calls++;template=t;filename=f;model=(StockListPdfModel)m.get("document");
 if(fail)throw new IllegalStateException("renderer stand-in failure");
 return new GeneratedPdf(f,new byte[]{37,80,68,70});
 }
}
// Generic query stand-ins execute predicates and order descriptors assembled by
// the exact repository method. This is NOT jOOQ, SQL or PostgreSQL execution.
interface C extends Predicate<Map<String,Object>>{
 default C and(C c){return r->test(r)&&c.test(r);}
}
static class F{
 final String key;F(String k){key=k;}
 C eq(Object v){return r->Objects.equals(r.get(key),v);}
 C ne(Object v){return r->r.get(key)!=null&&!Objects.equals(r.get(key),v);}
 C isDistinctFrom(Object v){return r->!Objects.equals(r.get(key),v);}
 C in(Q q){return r->q.values().contains(r.get(key));}
 O desc(){return new O(this,true,false);}
}
static class O implements Comparator<Map<String,Object>>{
 final F field;final boolean desc,nullLast;O(F f,boolean d,boolean n){field=f;desc=d;nullLast=n;}
 O nullsLast(){return new O(field,desc,true);}
 @SuppressWarnings({"rawtypes","unchecked"})
 public int compare(Map<String,Object>a,Map<String,Object>b){
 Comparable av=(Comparable)a.get(field.key),bv=(Comparable)b.get(field.key);
 if(av==null||bv==null)return av==bv?0:av==null?(nullLast?1:-1):(nullLast?-1:1);
 return desc?bv.compareTo(av):av.compareTo(bv);
 }
}
static class Dsl{
 final Map<String,List<Map<String,Object>>> tables=new HashMap<>();
 Q select(F f){return new Q(this,f);}
}
static class Q{
 final Dsl dsl;final F selected;String table;C condition=r->true;
 List<O> orders=List.of();int limit=Integer.MAX_VALUE;
 Q(Dsl d,F f){dsl=d;selected=f;}
 Q from(String t){table=t;return this;}Q where(C c){condition=c;return this;}
 Q and(C c){condition=condition.and(c);return this;}Q orderBy(O...os){orders=List.of(os);return this;}
 Q limit(int n){limit=n;return this;}
 List<Map<String,Object>> rows(){
 Comparator<Map<String,Object>> cmp=(a,b)->0;for(O o:orders)cmp=cmp.thenComparing(o);
 return dsl.tables.getOrDefault(table,List.of()).stream().filter(condition).sorted(cmp).limit(limit).toList();
 }
 List<Object> values(){return rows().stream().map(r->r.get(selected.key)).toList();}
 <T> Optional<T> fetchOptional(Function<Map<String,Object>,T> mapper){return rows().stream().findFirst().map(mapper);}
}
static class ShipmentRepository{
 static final F ID=new F("id"),PARTICIPATION_SHIPMENT_ID=new F("shipmentId"),
 PARTICIPATION_PURCHASE_ORDER_ID=new F("purchaseOrderId"),PARTICIPATION_CLOSE_REASON=new F("closeReason"),
 STATUS=new F("status"),DISPATCHED_AT=new F("dispatchedAt"),CREATED_AT=new F("createdAt");
 static final String PARTICIPATION_TABLE="participations";
 final Dsl dsl=new Dsl();int reads;
 Q selectShipment(){reads++;return new Q(dsl,ID).from("shipments");}
 Shipment mapShipment(Map<String,Object> r){return (Shipment)r.get("shipment");}
"""+latest+r"""
}
static int controls,observations;
static void control(boolean ok,String label){
 if(!ok)throw new AssertionError("CONTROL FAIL: "+label);controls++;System.out.println("CONTROL PASS "+label);
}
static void observation(boolean ok,String label){
 if(!ok)throw new AssertionError("OBSERVATION NOT REPRODUCED: "+label);observations++;System.out.println("OBSERVATION PASS "+label);
}
static BigDecimal bd(String s){return s==null?null:new BigDecimal(s);}
static OffsetDateTime time(int d){return OffsetDateTime.parse("2026-11-"+String.format("%02d",d)+"T10:00:00+02:00");}
static HandlingUnitOutput colli(long id,String gross,String net){
 var c=new HandlingUnitOutput();c.id=id;c.currentPurchaseOrderId=1L;c.packageType="WOODEN_BOX";
 c.declaredGrossWeightKg=bd(gross);c.declaredNetWeightKg=bd(net);
 c.declaredLengthCm=10;c.declaredWidthCm=20;c.declaredHeightCm=30;c.measurements=List.of();return c;
}
static HandlingUnitMeasurementOutput measurement(long id,int day,String kind,String gross,String net,Integer l,Integer w,Integer h){
 var m=new HandlingUnitMeasurementOutput();m.id=id;m.measuredAt=time(day);m.source=kind;m.grossWeightKg=bd(gross);
 m.netWeightKg=bd(net);m.lengthCm=l;m.widthCm=w;m.heightCm=h;return m;
}
static PurchaseOrderOutput order(long id,String num,HandlingUnitOutput...cs){
 var p=new PurchaseOrderOutput();p.id=id;p.internalNumber=num;p.status="IN_STOCK";p.handlingUnits=List.of(cs);
 p.internalNotes="SECRET INTERNAL MUST NEVER PRINT";return p;
}
static StockListPdfRow row(PurchaseOrderOutput p){return new StockListPdfModelFactory().create(List.of(p),Map.of(),time(9)).rows().get(0);}
static class Fixture{
 final PurchaseOrdersApiService api=new PurchaseOrdersApiService();final ShipmentRepository repo=new ShipmentRepository();
 final PdfRenderService render=new PdfRenderService();
 final StockListPdfService service=new StockListPdfService(api,repo,new StockListPdfModelFactory(),render);
 Fixture(){api.authorizationService.actor=new User(new Role(true),new CompanyReferenceOutput(9L,"internal"),false,true);}
 void add(PurchaseOrderOutput p,long c,long s){api.purchaseOrderRepository.orders.put(p.id,new PurchaseOrder(p.id,new PurchaseOrderParties(c,s),p));}
 @SafeVarargs final void shipments(Map<String,Object>...es){repo.dsl.tables.put("shipments",List.of(es));}
 @SafeVarargs final void participations(Map<String,Object>...es){repo.dsl.tables.put("participations",List.of(es));}
}
static Map<String,Object> ship(long id,String doc,OffsetDateTime dispatch,int created,String status){
 var m=new HashMap<String,Object>();m.put("id",id);m.put("status",status);m.put("createdAt",time(created));
 m.put("dispatchedAt",dispatch);m.put("shipment",new Shipment(id,doc==null?null:new ShipmentTransportDocument(doc)));return m;
}
static Map<String,Object> part(long po,long ship,String reason){
 var m=new HashMap<String,Object>();m.put("purchaseOrderId",po);m.put("shipmentId",ship);m.put("closeReason",reason);return m;
}
static <T extends Throwable>void rejects(Class<T> t,Runnable fn,String label){
 try{fn.run();throw new AssertionError("Did not reject: "+label);}
 catch(Throwable e){if(!t.isInstance(e))throw new AssertionError(label,e);control(true,label);}
}
static void modelControls(){
 var a=colli(2,"4.5","4");var b=colli(1,"4.5","4");var terminal=colli(3,"999","990");
 terminal.terminalDisposition=new Object();terminal.dangerousGoods=true;
 for(var c:List.of(a,b)){
 c.measurements=List.of(measurement(3,7,"WAREHOUSE_CONFIRMED","5.5",null,12,22,32),measurement(2,6,"WAREHOUSE_CONFIRMED","5",null,11,21,31));
 c.volumeWeightRoadKg=bd("6.10");c.volumeWeightSeaKg=bd("7.20");c.volumeWeightAirKg=bd("8.30");c.volumeWeightCourierKg=bd("9.40");
 }
 terminal.volumeWeightRoadKg=bd("9999");
 var p=order(1,"PO-0000000009",a,terminal,b);p.externalNotes="Keep upright\nSecond line <>&";
 p.clientCompany=new CompanyReferenceOutput(2L,"Client");p.supplierCompany=new CompanyReferenceOutput(3L,"Supplier");
 p.vessel=new VesselOutput("Vessel");p.messageNumber=" MSG ";p.ownerReference="OWN";p.supplierReference="SUP";var r=row(p);
 control(r.collis()==2,"current DTO members: terminal excluded, each physical colli counted once");
 control(r.grossWeightKg().equals("11"),"latest measured gross and sum");
 control(r.netWeightKg().equals("8"),"missing measured net independently falls back to declared net");
 control(r.volumeWeightRoadKg().equals("12.2"),"road sum excludes terminal");
 control(r.volumeWeightSeaKg().equals("14.4"),"sea sum");control(r.volumeWeightAirKg().equals("16.6"),"air sum");
 control(r.volumeWeightCourierKg().equals("18.8"),"courier sum");
 control(r.packingInfo().equals("2 × Wooden box | 12 x 22 x 32 cm"),"identical packing grouped, no PCS segment");
 control(r.dangerousGoods().isEmpty(),"terminal DG alone does not mark Order");
 a.dangerousGoods=true;a.dangerousGoodsClass=null;control(row(p).dangerousGoods().equals("DG"),"current DG without class marks Order");
 control(r.idDetails().equals(p.externalNotes),"model keeps embedded newline and literal HTML text");
 control(!r.toString().contains("SECRET"),"internal notes absent from print model");
 p.externalNotes="";control(row(p).idDetails().isEmpty(),"empty external notes has no internal fallback");
 p.externalNotes=null;control(row(p).idDetails().isEmpty(),"null external notes has no internal fallback");
 control(r.client().equals("Client")&&r.supplier().equals("Supplier")&&r.vessel().equals("Vessel"),"saved party and vessel values");
 control(r.messageNumber().equals("MSG")&&r.ownerReference().equals("OWN")&&r.supplierReference().equals("SUP"),"saved reference values");
 var empty=order(2,"PO-0000000010");var er=row(empty);
 control(er.collis()==0,"zero colli Order retained as one row");
 control(er.grossWeightKg().isEmpty()&&er.netWeightKg().isEmpty()&&er.volumeWeightRoadKg().isEmpty(),"missing totals blank");
 empty.handlingUnits=null;control(row(empty).collis()==0,"null DTO collection safe");
 var zero=colli(4,"10","0");zero.volumeWeightRoadKg=BigDecimal.ZERO;var zp=order(3,"PO-0000000011",zero);var zr=row(zp);
 control(zr.netWeightKg().equals("0")&&zr.volumeWeightRoadKg().equals("0"),"recorded zero net/volume stays zero");
 zero.measurements=List.of(measurement(4,8,"WAREHOUSE_CONFIRMED","20","0",null,null,null));
 control(row(zp).netWeightKg().equals("0"),"measured zero net is present");
 zero.declaredLengthCm=null;zero.declaredWidthCm=null;zero.declaredHeightCm=null;
 control(row(zp).packingInfo().equals("Wooden box"),"package only has no empty separator");
 zero.declaredLengthCm=12;zero.declaredHeightCm=32;
 control(row(zp).packingInfo().equals("Wooden box | 12 x  x 32 cm"),"partial DTO missing dimension blank (robustness only)");
 zero.packageType=null;zero.declaredLengthCm=null;zero.declaredHeightCm=null;control(row(zp).packingInfo().isEmpty(),"all absent packing blank");
 zero.measurements=List.of(measurement(5,8,"WAREHOUSE_CONFIRMED","25",null,null,null,null),measurement(6,8,"WAREHOUSE_CONFIRMED","26",null,null,null,null));
 control(row(zp).grossWeightKg().equals("26"),"measurement timestamp ties use higher id");
 p.currentWarehouseStay=new WarehouseStayOutput(new WarehouseOutput("ATH","Athens"),"A-1");
 p.lastKnownWarehouseStay=new WarehouseStayOutput(new WarehouseOutput("PIR","Piraeus"),"B-2");p.status="IN_STOCK";
 control(row(p).hub().equals("ATH · Athens")&&row(p).position().equals("A-1"),"current warehouse and position");
 p.status="LOCATION_UNKNOWN";
 control(row(p).hub().equals("PIR · Piraeus - LOCATION UNKNOWN")&&row(p).position().equals("B-2"),"unknown location marked last-known warehouse");
 p.lastKnownWarehouseStay=null;control(row(p).hub().equals("LOCATION UNKNOWN")&&row(p).position().isEmpty(),"unknown without stay explicit");
 p.status="SHIPPED";p.currentWarehouseStay=null;control(row(p).hub().isEmpty()&&row(p).position().isEmpty(),"known status without current stay blank");
 var sorted=new StockListPdfModelFactory().create(List.of(p,empty,order(4,null)),Map.of(),time(9));
 control(sorted.rows().stream().map(StockListPdfRow::purchaseOrderNumber).toList().equals(List.of("PO-0000000010","PO-0000000009","")),"fixed internal-number descending order, null last");
 control(sorted.printedAt().equals("09/11/2026 10:00"),"fixed print-time format");
}
static void serviceControls(){
 List<List<Long>> invalid=new ArrayList<>();invalid.add(null);invalid.add(List.of());invalid.add(List.of(1L,1L));
 invalid.add(Arrays.asList(1L,null));invalid.add(List.of(0L));invalid.add(List.of(-1L));invalid.add(LongStream.rangeClosed(1,101).boxed().toList());
 for(int i=0;i<invalid.size();i++){
 var f=new Fixture();var ids=invalid.get(i);rejects(IllegalArgumentException.class,()->f.service.generate(ids),"invalid selection "+i);
 control(f.api.purchaseOrderRepository.calls.isEmpty()&&f.repo.reads==0&&f.render.calls==0,"invalid selection "+i+" no lookup/render");
 }
 var f=new Fixture();f.add(order(1,"PO-0000000001"),2,3);f.add(order(2,"PO-0000000002"),4,5);
 f.api.authorizationService.actor=new User(new Role(true),new CompanyReferenceOutput(2L,"Client"),false,false);
 rejects(AccessDeniedException.class,()->f.service.generate(List.of(1L,2L)),"mixed authorized/unauthorized atomic rejection");
 control(f.repo.reads==0&&f.render.calls==0,"authorization fails before shipment lookup/render");
 control(f.api.outputAssembler.participantIds.equals(List.of(2L)),"external read forwards actor-company scope");
 var missing=new Fixture();missing.add(order(1,"PO-0000000001"),2,3);
 rejects(IllegalArgumentException.class,()->missing.service.generate(List.of(1L,99L)),"missing ID rejects full request");
 control(missing.repo.reads==0&&missing.render.calls==0,"missing ID no partial PDF");
 var noauth=new Fixture();noauth.add(order(1,"PO-0000000001"),2,3);
 noauth.api.authorizationService.actor=new User(new Role(false),new CompanyReferenceOutput(9L,"Staff"),false,true);
 rejects(AccessDeniedException.class,()->noauth.service.generate(List.of(1L)),"internal actor without view denied");
 var supplier=new Fixture();supplier.add(order(1,"PO-1"),2,3);
 supplier.api.authorizationService.actor=new User(new Role(true),new CompanyReferenceOutput(3L,"Supplier"),false,false);supplier.service.generate(List.of(1L));
 control(supplier.render.calls==1&&supplier.api.outputAssembler.participantIds.equals(List.of(3L)),"supplier participant allowed and scope forwarded");
 var many=new Fixture();for(long id=1;id<=100;id++){var p=order(id,String.format("PO-%010d",id));p.status=id%2==0?"LOCATION_UNKNOWN":"CANCELLED";many.add(p,2,3);}
 var result=many.service.generate(LongStream.rangeClosed(1,100).boxed().toList());
 control(many.render.model.rows().size()==100,"100 distinct mixed-status Orders accepted");
 control(many.render.model.rows().get(0).purchaseOrderNumber().equals("PO-0000000100"),"service fixed descending order");
 control(many.render.template.equals("stock-list")&&result.filename().equals("stock-list.pdf"),"fixed render template and filename");
 control(many.api.outputAssembler.participantIds.stream().allMatch(Objects::isNull),"internal actor unrestricted assembler scope");
 var failed=new Fixture();failed.add(order(1,"PO-1"),2,3);failed.render.fail=true;
 rejects(IllegalStateException.class,()->failed.service.generate(List.of(1L)),"render failure propagates");
}
static void measurementObservations(){
 var c=colli(10,"20","18");c.declaredLengthCm=40;c.declaredWidthCm=50;c.declaredHeightCm=60;
 c.measurements=List.of(measurement(1,1,"DECLARED","10","8",10,20,30));var p=order(1,"PO-0000000001",c);var r=row(p);
 observation(r.grossWeightKg().equals("10")&&r.netWeightKg().equals("8"),"B1 old DECLARED snapshot masks edited current gross/net 20/18 with 10/8");
 observation(r.packingInfo().equals("Wooden box | 10 x 20 x 30 cm"),"B1 old DECLARED snapshot masks edited dimensions 40x50x60 with 10x20x30");
 c.measurements=List.of();var clean=row(p);
 control(clean.grossWeightKg().equals("20")&&clean.netWeightKg().equals("18")&&clean.packingInfo().contains("40 x 50 x 60"),"B1 control current values correct without snapshot");
 c.measurements=List.of(measurement(1,1,"DECLARED","10","8",10,20,30),measurement(2,2,"WAREHOUSE_CONFIRMED","30","25",70,80,90));
 var confirmed=row(p);control(confirmed.grossWeightKg().equals("30")&&confirmed.netWeightKg().equals("25")&&confirmed.packingInfo().contains("70 x 80 x 90"),"B1 control later full confirmation wins");
 c.measurements=List.of(measurement(2,2,"WAREHOUSE_CONFIRMED","30","25",70,80,90),measurement(3,3,"WAREHOUSE_CONFIRMED",null,null,100,110,120));
 var partial=row(p);
 observation(partial.grossWeightKg().equals("20")&&partial.netWeightKg().equals("18"),"B1 related observation later dimensions-only confirmation falls back to declared 20/18 rather than earlier confirmed 30/25");
 System.out.println("DATA B1 stale snapshot="+r);System.out.println("DATA B1 later dimensions-only="+partial);
}
static void transportObservations(){
 var f=new Fixture();f.add(order(1,"PO-0000000001"),2,3);
 var old=ship(10,"CMR-OLD",time(2),1,"ARRIVED");var fresh=ship(20," CMR-NEW ",null,8,"READY_FOR_DISPATCH");
 f.shipments(old,fresh);f.participations(part(1,10,"ARRIVED"),part(1,20,null));f.service.generate(List.of(1L));
 observation(f.render.model.rows().get(0).transportDocumentNumber().equals("CMR-OLD"),"B2 previous dispatched leg wins over newer associated ready leg with CMR-NEW");
 System.out.println("DATA B2 selected="+f.render.model.rows().get(0).transportDocumentNumber());
 f.shipments(old,ship(20,null,null,8,"READY_FOR_DISPATCH"));f.service.generate(List.of(1L));
 observation(f.render.model.rows().get(0).transportDocumentNumber().equals("CMR-OLD"),"B2 newer associated ready leg without document still prints previous CMR-OLD instead of blank");
 f.shipments(fresh);f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().equals("CMR-NEW"),"B2 control only ready leg prints trimmed CMR-NEW");
 f.shipments(old,ship(20,"CMR-NEW",time(9),8,"DISPATCHED"));f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().equals("CMR-NEW"),"latest dispatched leg wins");
 f.shipments(old,ship(20,"CMR-CANCELLED",time(9),8,"CANCELLED"));f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().equals("CMR-OLD"),"cancelled shipment excluded");
 f.shipments(old,ship(20,"CMR-REMOVED",time(9),8,"DISPATCHED"));f.participations(part(1,10,"ARRIVED"),part(1,20,"REMOVED"));f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().equals("CMR-OLD"),"removed participation excluded");
 f.participations(part(1,10,"ARRIVED"),part(999,20,null));f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().equals("CMR-OLD"),"other Order participation excluded");
 f.shipments(ship(20,null,null,8,"PREPARING"));f.participations(part(1,20,null));f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().isEmpty(),"null document blank");
 f.shipments(ship(20,"  ",null,8,"PREPARING"));f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().isEmpty(),"blank number blank");
 control(f.repo.findLatestByPurchaseOrderId(null).isEmpty(),"null repository lookup empty");
 f.shipments();f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().isEmpty(),"no associated shipment blank");
 f.shipments(ship(30,"TIE-30",time(7),6,"DISPATCHED"),ship(31,"TIE-31",time(7),6,"DISPATCHED"));
 f.participations(part(1,30,"ARRIVED"),part(1,31,null));f.service.generate(List.of(1L));
 control(f.render.model.rows().get(0).transportDocumentNumber().equals("TIE-31"),"repository timestamp ties descending id");
}
@SuppressWarnings("removal")
public static void main(String[] args){
 System.setSecurityManager(new SecurityManager(){
 public void checkPermission(Permission p){}
 public void checkConnect(String h,int p){throw new SecurityException("No network");}
 public void checkListen(int p){throw new SecurityException("No network");}
 public void checkAccept(String h,int p){throw new SecurityException("No network");}
 public void checkWrite(String f){throw new SecurityException("No Java file writes");}
 public void checkDelete(String f){throw new SecurityException("No Java file deletes");}
 });
 modelControls();serviceControls();measurementObservations();transportObservations();
 System.out.println("TOTAL controls="+controls+" observations="+observations);
}
}
"""
generated=HERE/"StockListModelQa.java";generated.write_text(source,encoding="utf-8")
result=subprocess.run([JAVA,"-Dfile.encoding=UTF-8",str(generated)],cwd=HERE,capture_output=True,text=True,encoding="utf-8")
print(result.stdout,end="");print(result.stderr,end="",file=sys.stderr)
template=read("frontline-forwarding-app/src/main/resources/templates/stock-list.html")
# Hash the inspected supporting trace too; these are not additional executed methods.
for relative in (
 "web/purchaseorders/service/PurchaseOrderOutputAssembler.java",
 "domain/purchaseorders/HandlingUnitRepository.java",
 "domain/purchaseorders/HandlingUnitMembershipRepository.java",
 "domain/purchaseorders/HandlingUnitMeasurementRepository.java",
 "domain/purchaseorders/PurchaseOrderWarehouseStayRepository.java",
 "domain/purchaseorders/PurchaseOrderWarehouseStay.java",
 "domain/purchaseorders/HandlingUnitMeasurementResolver.java",
 "domain/purchaseorders/ResolvedHandlingUnitMeasurement.java",
 "domain/shipments/ShipmentStatus.java",
 "domain/shipments/ShipmentMovementCloseReason.java",
 "web/purchaseorders/PurchaseOrdersRestApi.java",
 "system/pdf/PdfRenderService.java"
):read(P+relative)
checks={
"20_fixed_cells_match_record":re.findall(r'th:text="\$\{row\.([^}]+)\}"',template)==re.findall(r"(?:String|int)\s+(\w+)[,\n]",row),
"escaped_th_text_no_utext":"th:utext" not in template,
"notes_direct_text":'<td th:text="$'+'{row.idDetails}"></td>' in template,
"no_line_break_preserving_css":not re.search(r"white-space\s*:\s*(?:pre|pre-line|pre-wrap|break-spaces)",template),
"A4_landscape":"size: A4 landscape" in template,
"repeated_header":"display: table-header-group" in template,
"timestamp_page_counter_footer":all(t in template for t in ("document.printedAt","counter(page)","counter(pages)","FRONT LINE FORWARDING"))
}
for name,passed in checks.items():print("STATIC "+("PASS " if passed else "FAIL ")+name)
summary=dict(baseline="main 6aa259553cd9c86a8aaa157902088aa9a6bca83e (authenticated by parent)",command=[JAVA,"-Dfile.encoding=UTF-8",str(generated)],
returncode=result.returncode,controls=len(re.findall(r"^CONTROL PASS ",result.stdout,re.M)),observations=len(re.findall(r"^OBSERVATION PASS ",result.stdout,re.M)),
static_checks=checks,stdout=result.stdout,stderr=result.stderr,source_sha256=hashes,extractions=extracts,
limits=["Java17 extraction, not Java25/Spring app","DTO/adapters are stand-ins; assembler inspected not executed",
"Repository exact fluent method executes on generic in-memory query stand-ins, not jOOQ/SQL/PostgreSQL",
"No HTTP auth, actual PDF renderer, deployed portal, DB, transaction or concurrency execution",
"Parent policy loader failed: authenticated archive has no Git metadata",
"Partial DTO dimension test is robustness only, not a persisted-data claim"])
(HERE/"stock-list-model-qa-results.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf-8")
if result.returncode or not all(checks.values()):raise SystemExit(result.returncode or 1)
