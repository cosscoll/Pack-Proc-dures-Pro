#!/usr/bin/env python3
"""Vérifie les fichiers obtenus octet pour octet via Git blob SHA-1."""
import hashlib, json, sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'MANIFEST_SOURCES.json').read_text('utf-8'))
failed=0
for name,expected in manifest['files'].items():
    path=root/'sources_exactes'/name
    if not path.is_file(): print('ABSENT',name);failed+=1;continue
    data=path.read_bytes()
    actual=hashlib.sha1(b'blob '+str(len(data)).encode('ascii')+b'\0'+data).hexdigest()
    if actual!=expected: print('DIFFÉRENT',name);failed+=1
    else: print('OK',name)
print('\nFichiers contrôlés:',len(manifest['files']),'— écarts:',failed)
sys.exit(1 if failed else 0)