"""Render exact production stock-list HTML/CSS with escaped synthetic row values.
This isolates OpenHTMLtoPDF 1.0.10 layout. It does not execute Spring/Thymeleaf,
model lookup, HTTP authorization, or the deployed PDF endpoint. Java helper
uses the same fast renderer and DeliveryNoteSans registration.
"""
from pathlib import Path
import argparse, re, html, hashlib, subprocess, json
p=argparse.ArgumentParser()
p.add_argument("--source",required=True);p.add_argument("--output",required=True)
args=p.parse_args(); source=Path(args.source); out=Path(args.output);out.mkdir(exist_ok=True,parents=True)
template=source/"frontline-forwarding-app/src/main/resources/templates/stock-list.html"
raw=template.read_text(encoding="utf-8")
row=re.search(r'<tr th:each="row : \$\{document.rows\}">.*?</tr>',raw,re.S).group()
keys=re.findall(r'th:text="\$\{row\.([a-zA-Z]+)\}"',row)
assert len(keys)==20
def fixture(i):
 return dict(zip(keys,[
 f"PO-{i:07d}", "Client "+str(i), "MV QA "+str(i), "QA-2026", "OWNER-"+str(i),"SUP-"+str(i),
 "Synthetic supplier",3,"125.75","119.25","164.2","492.6","82.1","98.5",
 "WOODEN BOX | 120 x 80 x 95 cm", "External handling instructions", "DG" if i%5==0 else "",
 "CMR-QA-"+str(i),"QA warehouse", "A-"+str(i)]))
def render(name,rows):
 def fill(data):
  # Bind text where the original th:text occurred, preserving HTML/CSS around it.
  r=row.replace(' th:each="row : ${document.rows}"',"")
  r=re.sub(r'<td([^>]*?) th:text="\$\{row\.([a-zA-Z]+)\}"></td>',lambda m:'<td'+m[1]+'>'+html.escape(str(data[m[2]]))+'</td>',r)
  return r
 rendered=raw.replace(row,"\n".join(fill(r) for r in rows)).replace("[[${document.printedAt}]]","09/11/2026 16:00")
 rendered=rendered.replace(' th:inline="text"',"")
 assert "th:text" not in rendered and "th:each" not in rendered
 path=out/(name+".html");path.write_text(rendered,encoding="utf-8")
 subprocess.run(["java","-cp",str(out)+"/*;"+str(out),"StockListRenderQA",str(path),str(out/(name+".pdf")),str(out/"DejaVuSans.ttf"),(source/"frontline-forwarding-app/src/main/resources/static").as_uri()+"/"],check=True)
 return {"case":name,"rows":len(rows),"fixtures":rows}
subprocess.run(["javac","-cp",str(out)+"/*",str(out/"StockListRenderQA.java")],check=True)
cases=[]
rows=[fixture(i) for i in range(54,0,-1)]
rows[0]["client"]="Δοκιμαστική Ναυτιλιακή Εταιρεία"
cases.append(render("normal-multipage",rows))
r=fixture(1);r["idDetails"]="LINE_A\nLINE_B\nLINE_C";cases.append(render("multiline-notes",[r]))
r=fixture(1);r["ownerReference"]="R"*255;r["idDetails"]="T"*2000;cases.append(render("long-unbroken",[r]))
r=fixture(1);r["idDetails"]="\n".join("Line "+str(i)+" end" for i in range(1,101));cases.append(render("many-lines",[r]))
r=fixture(1);r["purchaseOrderNumber"]="PO-0000001_100";cases.append(render("split-child-id",[fixture(1),r]))
(out/"manifest.json").write_text(json.dumps({"source":str(source),"template_sha256":hashlib.sha256(template.read_bytes()).hexdigest(),"renderer":"openhtmltopdf 1.0.10","cases":cases},ensure_ascii=False,indent=2),encoding="utf-8")
