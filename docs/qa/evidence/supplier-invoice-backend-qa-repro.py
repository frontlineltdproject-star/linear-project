"""Offline Supplier Invoice correction evidence. No application/database run.
Reads the pinned SupplierInvoiceService.java, extracts its actual changes,
addChange, vesselName, text, plain methods and no-op branch, and executes those
unchanged in Java 11 with DTO/getter and vessel-lookup stand-ins. All values are
synthetic. Network is blocked in Python and in the Java test body.
"""
from pathlib import Path
import argparse
from contextlib import ExitStack
import hashlib
import shutil
import socket
import subprocess
import sys
import tempfile

def blocked(*args, **kwargs):
    raise RuntimeError("Network blocked by supplier-invoice-backend-qa")
socket.socket = blocked
socket.create_connection = blocked

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("repository_root", type=Path,
    help="Required path to the pinned repository snapshot to inspect (read-only)")
parser.add_argument("--output-dir", type=Path,
    help="Optional explicit generated-Java directory; default is a cleaned temporary directory")
args = parser.parse_args()
ROOT = args.repository_root.resolve()
JAVA = shutil.which("java")
if not JAVA:
    raise SystemExit("java is required; no download is attempted")
SOURCE = ROOT / "frontline-forwarding-app/src/main/java/com/frontline/forwarding/domain/supplierinvoices/SupplierInvoiceService.java"
source = SOURCE.read_text(encoding="utf-8")

def method(start):
    begin = source.index(start)
    opening = source.index("{", begin)
    depth, end = 1, opening + 1
    while depth:
        if source[end] == "{":
            depth += 1
        elif source[end] == "}":
            depth -= 1
        end += 1
    return source[begin:end]

methods = "\n\n".join(method(start) for start in [
    "private List<SupplierInvoiceChange> changes(",
    "private static void addChange(",
    "private String vesselName(",
    "private static String text(",
    "private static String plain(",
])
branch_start = source.index("List<SupplierInvoiceChange> changes = changes(current, facts, status, orders);")
branch_end = source.index("requireUnusedNumber(", branch_start)
branch = source[branch_start:branch_end]

java = """
import java.math.BigDecimal;
import java.time.LocalDate;
import java.security.Permission;
import java.util.*;

class SupplierInvoiceBackendQa {
  static enum VatExemptionStatus { NOT_STARTED }
  static class SupplierInvoiceFacts {
    final Long vessel; final String number;
    SupplierInvoiceFacts(Long vessel, String number) { this.vessel=vessel; this.number=number; }
    Long purchaseOrderId() { return 1L; }
    String invoiceNumber() { return number; }
    LocalDate invoiceDate() { return LocalDate.of(2026, 1, 1); }
    LocalDate expirationDate() { return null; }
    String invoiceType() { return "VAT_EXEMPTION_DOCUMENT"; }
    String currency() { return "EUR"; }
    BigDecimal netAmount() { return new BigDecimal("100.00"); }
    BigDecimal vatAmount() { return new BigDecimal("24.00"); }
    Long vesselId() { return vessel; }
  }
  static class SupplierInvoice extends SupplierInvoiceFacts {
    SupplierInvoice(Long vessel, String number) { super(vessel, number); }
    VatExemptionStatus vatExemptionStatus() { return VatExemptionStatus.NOT_STARTED; }
    Long supplierCompanyId() { return 3L; }
  }
  static class PurchaseOrder {
    String internalNumber() { return "SYNTHETIC-ORDER"; }
  }
  static class SupplierInvoiceChange {
    final String field, oldValue, newValue;
    SupplierInvoiceChange(String field, String oldValue, String newValue) {
      this.field=field; this.oldValue=oldValue; this.newValue=newValue;
    }
  }
  static class Vessel {
    final String name;
    Vessel(String name) { this.name=name; }
    String name() { return name; }
  }
  static class Vessels {
    final Map<Long,Vessel> byId = Map.of(
      101L, new Vessel("SYNTHETIC SAME NAME"),
      102L, new Vessel("SYNTHETIC SAME NAME"),
      103L, new Vessel("SYNTHETIC DIFFERENT NAME"));
    Optional<Vessel> findById(Long id) { return Optional.ofNullable(byId.get(id)); }
  }
  final Vessels vessels = new Vessels();
""" + methods + """
  SupplierInvoice noOpBranch(SupplierInvoice current, SupplierInvoiceFacts facts,
      VatExemptionStatus status, Map<Long, PurchaseOrder> orders, Long supplierId) {
""" + branch + """
    return null; // Sentinel: production would proceed to duplicate check and persistence.
  }
  static void check(boolean ok, String message) {
    if (!ok) throw new AssertionError(message);
    System.out.println("PASS " + message);
  }
  public static void main(String[] args) {
    System.setSecurityManager(new SecurityManager() {
      public void checkPermission(Permission p) { }
      public void checkConnect(String h, int p) { throw new SecurityException("Network blocked"); }
      public void checkListen(int p) { throw new SecurityException("Network blocked"); }
      public void checkAccept(String h, int p) { throw new SecurityException("Network blocked"); }
    });
    SupplierInvoiceBackendQa test = new SupplierInvoiceBackendQa();
    SupplierInvoice current = new SupplierInvoice(101L, "SYNTHETIC-001");
    Map<Long, PurchaseOrder> orders = Map.of(1L, new PurchaseOrder());
    VatExemptionStatus status = VatExemptionStatus.NOT_STARTED;
    SupplierInvoiceFacts same = new SupplierInvoiceFacts(101L, "SYNTHETIC-001");
    check(test.noOpBranch(current, same, status, orders, 3L) == current,
      "control: genuinely unchanged facts return current");
    SupplierInvoiceFacts renamedIdentity = new SupplierInvoiceFacts(102L, "SYNTHETIC-001");
    check(!current.vesselId().equals(renamedIdentity.vesselId()),
      "fixture: old and requested vessel identities differ");
    check(test.changes(current, renamedIdentity, status, orders).isEmpty()
        && test.noOpBranch(current, renamedIdentity, status, orders, 3L) == current,
      "BUG OBSERVED: different vessel ID with equal name is treated as unchanged; old vessel returned");
    SupplierInvoiceFacts alsoNumber = new SupplierInvoiceFacts(102L, "SYNTHETIC-002");
    List<SupplierInvoiceChange> changed = test.changes(current, alsoNumber, status, orders);
    check(changed.size() == 1 && changed.get(0).field.equals("invoiceNumber")
        && test.noOpBranch(current, alsoNumber, status, orders, 3L) == null,
      "BUG OBSERVED: number plus same-name vessel change selects persistence branch but change list omits vessel");
    SupplierInvoiceFacts differentName = new SupplierInvoiceFacts(103L, "SYNTHETIC-001");
    List<SupplierInvoiceChange> other = test.changes(current, differentName, status, orders);
    check(other.size() == 1 && other.get(0).field.equals("vessel")
        && test.noOpBranch(current, differentName, status, orders, 3L) == null,
      "control: different-name vessel change is detected");
    SupplierInvoiceFacts cleared = new SupplierInvoiceFacts(null, "SYNTHETIC-001");
    check(test.changes(current, cleared, status, orders).get(0).field.equals("vessel"),
      "control: clearing the vessel is detected");
    boolean networkBlocked = false;
    try { System.getSecurityManager().checkConnect("example.invalid", 443); }
    catch (SecurityException expected) { networkBlocked = true; }
    check(networkBlocked, "network guard active");
  }
}
"""
with ExitStack() as stack:
    OUT = args.output_dir.resolve() if args.output_dir else Path(stack.enter_context(
        tempfile.TemporaryDirectory(prefix="supplier-invoice-backend-qa-")))
    OUT.mkdir(parents=True, exist_ok=True)
    generated = OUT / "supplier-invoice-backend-qa-repro.java"
    generated.write_text(java, encoding="utf-8")
    print("SOURCE " + str(SOURCE))
    print("SHA256 " + hashlib.sha256(SOURCE.read_bytes()).hexdigest())
    print("Exact extracted comparison methods and no-op branch; DTO/lookup stand-ins only.", flush=True)
    result = subprocess.run([JAVA, str(generated)], capture_output=True, text=True, cwd=OUT)
    print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    print("No Spring, transaction, database, API, or full backend suite was executed.")
raise SystemExit(result.returncode)
