"""Run exact source formatting expressions with equivalent timestamp fixtures.

Usage: python delivery-note-time-repro.py <pinned-repository-root>
No application, database or network calls. Java 11 is sufficient for these
expressions, but this is NOT execution of the Java 25 backend or AADE.
"""
import pathlib
import subprocess
import sys
import tempfile

root = pathlib.Path(sys.argv[1])
base = root / 'frontline-forwarding-app/src/main/java/com/frontline/forwarding/web/deliverynotes/service'
xml = (base / 'AadeDeliveryNoteXmlBuilder.java').read_text(encoding='utf-8')
pdf = (base / 'DeliveryNotePdfModelFactory.java').read_text(encoding='utf-8')
assert 'element(xml, "dispatchDate", DATE.format(note.movementStartAt()));' in xml
assert 'element(xml, "dispatchTime", TIME.format(note.movementStartAt()));' in xml
assert 'DATE.format(value.atZoneSameInstant(ATHENS))' in pdf
assert 'TIME.format(value.atZoneSameInstant(ATHENS))' in pdf

code = r'''
import java.time.*;
import java.time.format.*;
class DeliveryNoteTimeObservation {
 static final ZoneId ATHENS=ZoneId.of("Europe/Athens");
 static class Note {
   final OffsetDateTime v;
   Note(String v) {this.v=OffsetDateTime.parse(v);}
   OffsetDateTime movementStartAt(){return v;}
 }
 static String xml(Note note) {
   DateTimeFormatter DATE=DateTimeFormatter.ISO_LOCAL_DATE;
   DateTimeFormatter TIME=DateTimeFormatter.ofPattern("HH:mm:ss");
   return DATE.format(note.movementStartAt())+" "+TIME.format(note.movementStartAt());
 }
 static String pdf(OffsetDateTime value) {
   DateTimeFormatter DATE=DateTimeFormatter.ofPattern("dd/MM/yyyy");
   DateTimeFormatter TIME=DateTimeFormatter.ofPattern("HH:mm");
   return DATE.format(value.atZoneSameInstant(ATHENS))+" | "+TIME.format(value.atZoneSameInstant(ATHENS));
 }
 public static void main(String[] args) {
   String[][] pairs={
     {"2026-11-10T00:30:00+02:00","2026-11-09T22:30:00Z"},
     {"2026-07-24T15:30:00+03:00","2026-07-24T12:30:00Z"}
   };
   for(String[] p:pairs) {
     Note local=new Note(p[0]),utc=new Note(p[1]);
     if(!local.v.toInstant().equals(utc.v.toInstant())) throw new AssertionError("bad fixture");
     if(!pdf(local.v).equals(pdf(utc.v))) throw new AssertionError("PDF should be same");
     if(xml(local).equals(xml(utc))) throw new AssertionError("expected observed XML mismatch");
     System.out.println("same instant: "+p[0]+" == "+p[1]);
     System.out.println("XML local="+xml(local)+"; XML UTC="+xml(utc)+"; PDF="+pdf(utc.v));
   }
   System.out.println("2 timestamp observations reproduced; no network/database execution.");
 }
}
'''
with tempfile.TemporaryDirectory(prefix='dn-time-observation-') as folder:
    source = pathlib.Path(folder) / 'DeliveryNoteTimeObservation.java'
    source.write_text(code, encoding='utf-8')
    subprocess.run(['java', str(source)], check=True)
