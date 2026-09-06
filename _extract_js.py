import re, sys
html = open(r'src/index.html', encoding='utf-8', newline='').read()
html = html.replace('\r\n', '\n')
m = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if not m:
    print('no inline script found'); sys.exit(1)
open(r'index_check.js', 'w', encoding='utf-8', newline='\n').write(m.group(1))
print('extracted', len(m.group(1)), 'chars')
