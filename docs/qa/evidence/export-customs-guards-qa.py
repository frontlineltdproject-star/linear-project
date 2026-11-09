"""Offline control checks for Export Customs transitions/cancellation.
Extracts the actual pinned Java service methods unchanged; supplies only DTO,
authorization, clock, JSON and repository stand-ins. No Spring/SQL/transaction,
real authorization or production execution. Requires local Java 11; downloads
nothing. These are guard controls, not a substitute for full portal scenarios.
"""
import argparse
from pathlib import Path
import hashlib
import shutil
import socket
import subprocess
import tempfile

def blocked(*args, **kwargs):
    raise RuntimeError("Network blocked by export-customs-guards-qa")
socket.socket = blocked
socket.create_connection = blocked
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("repository_root", type=Path)
args = parser.parse_args()
root = args.repository_root.resolve()
java_bin = shutil.which("java")
if not java_bin:
    raise SystemExit("Local java required; no download attempted")
base = root / "frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain"
service = (base / "exports/ExportEditingService.java").read_text(encoding="utf-8")
rules = (base / "exports/ExportRules.java").read_text(encoding="utf-8")
stale = (base / "concurrency/StaleVersionException.java").read_text(encoding="utf-8")

def extract(source, signature):
    start = source.index(signature)
    end = source.index("{", start) + 1
    depth = 1
    while depth:
        if source[end] == "{":
            depth += 1
        elif source[end] == "}":
            depth -= 1
        end += 1
    return source[start:end]

methods = "\n".join(extract(service, sig) for sig in [
    "public ExportDeclaration confirmEad(",
    "public ExportDeclaration confirmIe599(",
    "public ExportDeclaration cancel(",
    "private ExportDeclaration lockEditable(",
])
ead_rule = extract(rules, "public static void checkEadDate(")
stale_rule = extract(stale, "public static void requireCurrent(")
code_source = (base / "exports/ExportRuleCode.java").read_text(encoding="utf-8")
codes = code_source[code_source.index("public enum ExportRuleCode"):]
program = r'''
import java.time.*;
import java.util.*;
import java.security.Permission;
class ExportCustomsGuardsQa {
  @interface Nullable {}
  static final int CANCELLATION_REASON_MAX = 1000;
  enum ExportCustomsStatus { AWAITING_EAD, AWAITING_IE599, COMPLETED }
  enum ExportActivityType { EAD_CONFIRMED, IE599_CONFIRMED, CANCELLED }
  static class ExportRuleException extends RuntimeException {
    final ExportRuleCode code;
    ExportRuleException(ExportRuleCode code, String text) {super(text);this.code=code;}
  }
  static class StaleVersionException extends RuntimeException {
    StaleVersionException(String text) {super(text);}
    __STALE__
  }
  static class ExportRules { __EAD_RULE__ }
  static class User { Long id(){return 7L;} }
  static class Authorization {
    void requireEdit(User u) {}
    void requireCancel(User u) {}
  }
  static class ExportDeclaration {
    long version=0; boolean cancelled=false;
    ExportCustomsStatus status=ExportCustomsStatus.AWAITING_EAD;
    LocalDate mrn=LocalDate.of(2026,11,1), ead=null, ie599=null;
    long version(){return version;}
    boolean cancelled(){return cancelled;}
    boolean awaitingEad(){return !cancelled && status==ExportCustomsStatus.AWAITING_EAD;}
    LocalDate mrnDate(){return mrn;}
    LocalDate eadConfirmationDate(){return ead;}
    ExportCustomsStatus customsStatus(){return status;}
  }
  static class Exports {
    ExportDeclaration current = new ExportDeclaration();
    int writes=0; List<ExportActivityType> audit=new ArrayList<>();
    Optional<ExportDeclaration> findByIdForUpdate(Long id) {return Optional.of(current);}
    Optional<ExportDeclaration> findById(Long id) {return Optional.of(current);}
    void confirmEad(Long id, LocalDate date, Long actor, OffsetDateTime at) {
      writes++; current.version++; current.ead=date; current.status=ExportCustomsStatus.AWAITING_IE599;
    }
    void confirmIe599(Long id, LocalDate date, Long actor, OffsetDateTime at) {
      writes++; current.version++; current.ie599=date; current.status=ExportCustomsStatus.COMPLETED;
    }
    void cancel(Long id, String reason, Long actor, OffsetDateTime at) {
      writes++; current.version++; current.cancelled=true;
    }
    void recordActivity(Long id, ExportActivityType type, String json, Long actor, OffsetDateTime at) {audit.add(type);}
  }
  final Exports exports=new Exports();
  final Authorization authorization=new Authorization();
  LocalDate today(){return LocalDate.of(2026,11,9);}
  OffsetDateTime now(){return OffsetDateTime.parse("2026-11-09T10:00:00Z");}
  static String json(Map<String,Object> m){return m.toString();}
  __METHODS__
  __CODES__
  static int checks=0;
  static void pass(String name){checks++;System.out.println("PASS "+name);}
  static void reject(String name, String expected, ExportCustomsGuardsQa h, Runnable command) {
    int writes=h.exports.writes, audit=h.exports.audit.size();
    try {command.run();throw new AssertionError(name+" unexpectedly accepted");}
    catch(ExportRuleException e) {if(!expected.equals(e.code.name())) throw e;}
    catch(StaleVersionException e) {if(!expected.equals("STALE"))throw e;}
    catch(IllegalArgumentException e) {if(!expected.equals("EXPECTED_VERSION_REQUIRED"))throw e;}
    if(h.exports.writes!=writes || h.exports.audit.size()!=audit)throw new AssertionError("Rejection wrote data");
    pass(name);
  }
  public static void main(String[] args) {
    System.setSecurityManager(new SecurityManager(){
      public void checkPermission(Permission p) {}
      public void checkConnect(String host,int port){throw new SecurityException("Network blocked");}
      public void checkListen(int port){throw new SecurityException("Network blocked");}
      public void checkAccept(String host,int port){throw new SecurityException("Network blocked");}
    });
    User u=new User();
    ExportCustomsGuardsQa h=new ExportCustomsGuardsQa();
    reject("missing reviewed version", "EXPECTED_VERSION_REQUIRED",h,()->h.confirmEad(u,1L,null,h.today()));
    reject("stale reviewed version", "STALE",h,()->h.confirmEad(u,1L,99L,h.today()));
    reject("EAD before MRN", "EAD_DATE_BEFORE_MRN_DATE",h,()->h.confirmEad(u,1L,0L,LocalDate.of(2026,10,31)));
    reject("EAD future", "EAD_DATE_FUTURE",h,()->h.confirmEad(u,1L,0L,h.today().plusDays(1)));
    reject("IE599 before EAD", "EAD_NOT_CONFIRMED",h,()->h.confirmIe599(u,1L,0L,h.today()));
    h.confirmEad(u,1L,0L,LocalDate.of(2026,11,3));
    if(h.exports.current.status!=ExportCustomsStatus.AWAITING_IE599 || h.exports.audit.size()!=1)throw new AssertionError();
    pass("valid EAD updates status and one audit event");
    reject("duplicate EAD with current version", "EAD_ALREADY_CONFIRMED",h,()->h.confirmEad(u,1L,1L,h.today()));
    reject("cancel after EAD", "CANCEL_NOT_AVAILABLE",h,()->h.cancel(u,1L,1L,"mistake"));
    reject("IE599 before EAD date", "IE599_DATE_BEFORE_EAD_DATE",h,()->h.confirmIe599(u,1L,1L,LocalDate.of(2026,11,2)));
    reject("IE599 future", "IE599_DATE_FUTURE",h,()->h.confirmIe599(u,1L,1L,h.today().plusDays(1)));
    h.confirmIe599(u,1L,1L,h.today());
    if(h.exports.current.status!=ExportCustomsStatus.COMPLETED || h.exports.audit.size()!=2)throw new AssertionError();
    pass("valid IE599 completes with one additional audit event");
    reject("duplicate IE599 with current version", "IE599_ALREADY_CONFIRMED",h,()->h.confirmIe599(u,1L,2L,h.today()));
    ExportCustomsGuardsQa c=new ExportCustomsGuardsQa();
    reject("empty cancellation reason", "CANCELLATION_REASON_REQUIRED",c,()->c.cancel(u,1L,0L,"  "));
    reject("overlong cancellation reason", "CANCELLATION_REASON_TOO_LONG",c,()->c.cancel(u,1L,0L,"x".repeat(1001)));
    c.cancel(u,1L,0L," mistaken entry ");
    if(!c.exports.current.cancelled || c.exports.audit.size()!=1)throw new AssertionError();
    pass("valid cancellation records one event");
    reject("cancelled Export cannot confirm EAD", "EXPORT_CANCELLED",c,()->c.confirmEad(u,1L,1L,c.today()));
    System.out.println("PASS "+checks+" controls; extracted methods only, no database/transactions/real authorization");
  }
}
'''.replace("__STALE__",stale_rule).replace("__EAD_RULE__",ead_rule).replace("__METHODS__",methods).replace("__CODES__",codes)
print("ExportEditingService sha256="+hashlib.sha256(service.encode()).hexdigest(), flush=True)
print("Extracted service methods sha256="+hashlib.sha256(methods.encode()).hexdigest(), flush=True)
with tempfile.TemporaryDirectory(prefix="export-customs-guards-") as directory:
    file=Path(directory)/"ExportCustomsGuardsQa.java"
    file.write_text(program,encoding="utf-8")
    result=subprocess.run([java_bin,"--source","11",str(file)],check=False)
    raise SystemExit(result.returncode)
