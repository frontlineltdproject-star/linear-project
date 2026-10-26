"""Build the FRO-341 static preview.

Usage: python -I build.py <greek-labels.json> <inline-order-dir> <output-dir>

Injects the production Greek composer labels into index.src.html and copies
the FRO-335 inline Create Order reference pages next to the generated page.
"""
import json
import shutil
import sys
from pathlib import Path

here = Path(__file__).resolve().parent
labels_path, inline_dir, out_dir = (Path(arg) for arg in sys.argv[1:4])
out_dir.mkdir(parents=True, exist_ok=True)

labels = json.loads(labels_path.read_text(encoding='utf-8'))
source = (here / 'index.src.html').read_text(encoding='utf-8')
page = source.replace('__EL_JSON__', json.dumps(labels, ensure_ascii=False).replace('</', '<\\/'))
(out_dir / 'index.html').write_text(page, encoding='utf-8')
for lang in ('en', 'el'):
    shutil.copyfile(inline_dir / f'inline-order-{lang}.html', out_dir / f'inline-order-{lang}.html')
print('Built', out_dir / 'index.html')
