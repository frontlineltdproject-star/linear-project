from pathlib import Path
p = Path(__file__).resolve().parent
html = (p / 'index.src.html').read_text(encoding='utf-8')
html = html.replace('/* INLINE_CSS */', (p / 'style.css').read_text(encoding='utf-8'))
html = html.replace('/* INLINE_JS */', (p / 'app.js').read_text(encoding='utf-8'))
(p / 'index.html').write_text(html, encoding='utf-8')
print('Built self-contained index.html; no external dependencies.')
