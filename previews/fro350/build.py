"""Build the FRO-350 static preview.

Usage: python -I build.py <output-dir>

Inlines base.css (production theme.css tokens and component styles, main 5c51030)
and app.js into one self-contained index.html.
"""
import sys
from pathlib import Path

here = Path(__file__).resolve().parent
out_dir = Path(sys.argv[1])
out_dir.mkdir(parents=True, exist_ok=True)
page = (here / 'index.src.html').read_text(encoding='utf-8')
page = page.replace('__CSS__', (here / 'base.css').read_text(encoding='utf-8'))
page = page.replace('__APP_JS__', (here / 'app.js').read_text(encoding='utf-8'))
(out_dir / 'index.html').write_text(page, encoding='utf-8')
print('Built', out_dir / 'index.html')
