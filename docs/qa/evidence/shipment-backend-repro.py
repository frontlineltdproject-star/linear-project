"""Offline, bounded evidence for the Shipment backend audit at pinned main.
Extracts the *actual* weight-resolution statements and helpers into a Java 11
source-file harness. DTO/ArgumentValue stand-ins supply getters only.
No production files are copied/changed; no Spring, SQL, portal, or network runs.
The generated Java source lives in a temporary directory, outside the source.
Usage: python shipment-backend-repro.py <pinned-repo-root> <java-11-executable>
"""
from pathlib import Path
import hashlib
import json
import socket
import subprocess
import sys
import tempfile

def no_network(*args, **kwargs):
    raise RuntimeError("Network is blocked in the Shipment backend audit harness")
socket.socket = no_network
socket.create_connection = no_network

if len(sys.argv) != 3:
    raise SystemExit("Usage: python shipment-backend-repro.py <pinned-repo-root> <java-11-executable>")
ROOT = Path(sys.argv[1]).resolve()
JAVA = Path(sys.argv[2]).resolve()
temporary = tempfile.TemporaryDirectory(prefix="frontline-shipment-evidence-")
HERE = Path(temporary.name)
BASE = ROOT / "frontline-forwarding-app/src/main/java/com/frontline/forwarding"
files = {}

def read(relative):
    path = ROOT / relative
    value = path.read_text(encoding="utf-8")
    files[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
    return value

def method(source, start):
    begin = source.index(start)
    opening = source.index("{", begin)
    depth = 1
    end = opening + 1
    while depth:
        if source[end] == "{":
            depth += 1
        elif source[end] == "}":
            depth -= 1
        end += 1
    return source[begin:end]

prefix = "frontline-forwarding-app/src/main/java/com/frontline/forwarding/"
plan = read(prefix + "web/shipments/service/ShipmentPackingPlan.java")
validator = read(prefix + "web/shipments/service/ShipmentInputValidator.java")
begin = plan.index("BigDecimal gross = unit.grossWeightKg();")
end = plan.index("ShipmentInputValidator.validateWeight(gross, net);", begin)
resolution = plan[begin:end + len("ShipmentInputValidator.validateWeight(gross, net);")]
saved_net = method(plan, "private static @Nullable BigDecimal savedNet")
kept = method(plan, "private static <T> @Nullable T kept")
validate = method(validator, "static void validateWeight(")

# Removing a type-use annotation is the only alteration to extracted helpers.
helpers = (saved_net + "\n" + kept).replace("@Nullable ", "")
source = """
import java.math.BigDecimal;
import java.security.Permission;

class ShipmentBackendAuditRepro {
  static class ArgumentValue<T> {
    final T v; final boolean omitted;
    ArgumentValue(T v, boolean omitted) { this.v=v; this.omitted=omitted; }
    boolean isOmitted() { return omitted; }
    T value() { return v; }
  }
  static class ShipmentLoadUnitWeight {
    final BigDecimal gross, net;
    ShipmentLoadUnitWeight(BigDecimal gross, BigDecimal net) { this.gross=gross; this.net=net; }
    BigDecimal net() { return net; }
  }
  static class ShipmentLoadUnit {
    final ShipmentLoadUnitWeight weight;
    ShipmentLoadUnit(ShipmentLoadUnitWeight weight) { this.weight=weight; }
    ShipmentLoadUnitWeight weight() { return weight; }
  }
  static class Input {
    final BigDecimal gross; final ArgumentValue<BigDecimal> net;
    Input(BigDecimal gross, ArgumentValue<BigDecimal> net) { this.gross=gross; this.net=net; }
    BigDecimal grossWeightKg() { return gross; }
    ArgumentValue<BigDecimal> netWeightKg() { return net; }
  }
  static class ShipmentInputValidator {
""" + validate + """
  }
""" + helpers + """
  static BigDecimal resolve(Input unit, ShipmentLoadUnit kept) {
""" + resolution + """
    return net;
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
    ShipmentLoadUnit saved = new ShipmentLoadUnit(
      new ShipmentLoadUnitWeight(new BigDecimal("80"), new BigDecimal("70")));
    ArgumentValue<BigDecimal> omitted = new ArgumentValue<>(null, true);
    check(resolve(new Input(new BigDecimal("90"), omitted), saved).compareTo(new BigDecimal("70")) == 0,
      "control: gross 90, omitted net preserves saved 70");
    check(resolve(new Input(null, omitted), saved) == null,
      "BUG OBSERVED: gross null, omitted net erases saved 70 and passes validation");
    check(resolve(new Input(null, null), saved) == null,
      "BUG OBSERVED: gross null, absent ArgumentValue also erases saved 70");
    boolean rejected = false;
    try { resolve(new Input(null, new ArgumentValue<>(new BigDecimal("70"), false)), saved); }
    catch (IllegalArgumentException expected) { rejected = true; }
    check(rejected, "control: gross null, explicitly supplied net 70 is rejected");
    check(resolve(new Input(null, new ArgumentValue<>(null, false)), saved) == null,
      "control: explicitly clearing both weights is accepted");
    boolean blocked = false;
    try { System.getSecurityManager().checkConnect("example.invalid", 443); }
    catch (SecurityException expected) { blocked = true; }
    check(blocked, "network guard is active");
  }
}
"""
generated = HERE / "ShipmentBackendAuditRepro.java"
generated.write_text(source, encoding="utf-8")
print("Running exact extracted Java resolution statements/helpers; DTO stand-ins only.", flush=True)
result = subprocess.run([str(JAVA), str(generated)], cwd=HERE, text=True, capture_output=True)
print(result.stdout, end="")
if result.stderr:
    print(result.stderr, file=sys.stderr, end="")
if result.returncode:
    raise SystemExit(result.returncode)

# Static source checks support the separate history finding, not a SQL/service execution.
service = read(prefix + "web/shipments/service/ShipmentsApiService.java")
repository = read(prefix + "domain/shipments/ShipmentLoadUnitRepository.java")
assembler = read(prefix + "web/purchaseorders/service/PurchaseOrderOutputAssembler.java")
migration = "frontline-forwarding-app/src/main/resources/db/migration/"
v34 = read(migration + "V34__shipment_ready_for_dispatch.sql")
v38 = read(migration + "V38__shipment_load_unit_retire_ignores_removed_content.sql")
v1 = read(migration + "V1__initial_schema.sql")
apply = method(service, "private List<Long> applyPacking(")
update = method(repository, "public void update(Long id, ShipmentLoadUnitDraft draft)")
projection = method(assembler, "private HandlingUnitJourneyShipmentOutput journeyShipment(")
assert "loadUnitRepository.referencedByJourneys(removedIds)" in apply
assert "loadUnitRepository.update(target.id(), target.draft())" in apply
assert ".set(LOAD_UNIT_TYPE, draft.type().name())" in update
assert ".set(LABEL, draft.label())" in update
assert "shipmentLoadUnitRepository.findByShipmentIdAndId(shipment.id(), loadUnitId)" in projection
assert "loadUnit.type().name()" in projection and "loadUnit.label()" in projection
assert "IF NOT freight_shipment_is_pre_dispatch" in v34
assert "IF OLD.retired_at IS NOT NULL THEN" in v38
assert "(weight_gross IS NULL AND weight_net IS NULL)" in v1
print("PASS STATIC: retained units are updated in place; journey output resolves their current type/label.")
print("PASS STATIC: guards permit current pre-dispatch edits and SQL permits both weights null.")
print("Static checks do NOT execute PostgreSQL, Spring transactions, adapters, or full lifecycle operations.")
print("SOURCE_SHA256 " + json.dumps(files, sort_keys=True))
temporary.cleanup()
