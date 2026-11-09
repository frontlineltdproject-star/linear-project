"""Read-only assertions over synthetic renderer output. Requires pdfplumber.
These observations reproduce defects; passing is not proof of a fix.
"""
import json, re, sys
from pathlib import Path
import pdfplumber
root=Path(sys.argv[1]); results=[]
def check(name, ok, evidence):
 assert ok, (name,evidence)
 results.append({"case":name,"evidence":evidence})
with pdfplumber.open(root/"normal-multipage.pdf") as pdf:
 text=[p.extract_text() for p in pdf.pages]
 ids=re.findall(r"PO-\d{7}", "\n".join(text))
 check("control exact 54 rows descending",ids==[f"PO-{i:07d}" for i in range(54,0,-1)],{"rows":len(ids),"pages":len(pdf.pages)})
 check("control landscape and repeated heading/footer",all(p.width>p.height for p in pdf.pages) and all("Collis" in t and "PRINTED:" in t and "FRONT LINE FORWARDING" in t for t in text),{"pages":len(pdf.pages)})
 check("control Greek glyphs retained","Δοκιμαστική" in text[0],{"first_page_has_greek":True})
with pdfplumber.open(root/"multiline-notes.pdf") as pdf:
 words={w["text"]:w for w in pdf.pages[0].extract_words() if w["text"].startswith("LINE_")}
 check("observation saved note line breaks collapse",words["LINE_A"]["top"]==words["LINE_B"]["top"],{k:round(v["top"],2) for k,v in words.items()})
with pdfplumber.open(root/"split-child-id.pdf") as pdf:
 chars=pdf.pages[0].chars
 # The second row uses a valid root-wide child suffix; separate glyph boxes prove overlap.
 row=[c for c in chars if 130<c["top"]<133]
 text="".join(c["text"] for c in row)
 child="PO-0000001_100"; start=text.index(child); child_chars=row[start:start+len(child)]
 client_start=text.index("Client",start+len(child)); client=row[client_start:client_start+6]
 check("observation child Order ID overlaps Client",child_chars[-1]["x1"]>client[0]["x0"],{"id_right":round(child_chars[-1]["x1"],2),"client_left":round(client[0]["x0"],2),"child":child})
with pdfplumber.open(root/"long-unbroken.pdf") as pdf:
 # Isolate the ID Details column and body, excluding footer/headers.
 letters=[c for p in pdf.pages for c in p.chars if 568<c["x0"]<623 and c["top"]>105 and c["text"]=="T"]
 check("control all 2000 long-note characters retained",len(letters)==2000,{"letters":len(letters),"pages":len(pdf.pages)})
print(json.dumps({"count":len(results),"results":results},ensure_ascii=False,indent=2))
