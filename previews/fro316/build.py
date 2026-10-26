"""Build the FRO-316 static preview.

Usage: python -I build.py <greek-labels.json> <output-dir>

Inlines base.css (production theme.css tokens, main 5c51030), app.js and the
production Greek shipment labels into one self-contained index.html.
"""
import json
import sys
from pathlib import Path

here = Path(__file__).resolve().parent
labels_path, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)
labels = json.loads(labels_path.read_text(encoding='utf-8'))
page = (here / 'index.src.html').read_text(encoding='utf-8')
page = page.replace('__CSS__', (here / 'base.css').read_text(encoding='utf-8'))
page = page.replace('__EL_JSON__', json.dumps(labels, ensure_ascii=False).replace('</', '<\\/'))
page = page.replace('__APP_JS__', (here / 'app.js').read_text(encoding='utf-8'))
(out_dir / 'index.html').write_text(page, encoding='utf-8')
print('Built', out_dir / 'index.html')
