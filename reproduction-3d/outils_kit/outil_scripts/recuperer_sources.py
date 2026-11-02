#!/usr/bin/env python3
"""Récupère les fichiers EXACTS du projet à un commit immuable.
Usage: python outil_scripts/recuperer_sources.py
Nécessite une connexion Internet. Aucun package Python externe.
"""
import hashlib, json, sys, urllib.request, urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'MANIFEST_SOURCES.json').read_text(encoding='utf-8'))
repo=manifest['repository']; commit=manifest['commit_pinned']
output=ROOT/'sources_exactes'   # ne touche pas au site original de l'utilisateur
output.mkdir(exist_ok=True)
print('Version verrouillée :',commit)
failures=[]
for path,expected in manifest['files'].items():
    url=f'https://raw.githubusercontent.com/{repo}/{commit}/{path}'
    dest=output/path;dest.parent.mkdir(parents=True,exist_ok=True)
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'PackProceduresPro-Sources-Exactes/1.0'})
        with urllib.request.urlopen(req,timeout=30) as r: content=r.read()
        git_blob=hashlib.sha1(b'blob '+str(len(content)).encode('ascii')+b'\0'+content).hexdigest()
        if git_blob != expected:
            raise RuntimeError(f'Git SHA inattendu: {git_blob} au lieu de {expected}')
        dest.write_bytes(content)
        print('OK ',path, 'octets=',len(content),'blob=',git_blob[:12])
    except Exception as ex:
        failures.append((path,str(ex)))
        print('ÉCHEC ',path,str(ex))
if failures:
    print('\nRécupération incomplète. Consultez le README : accès internet/GitHub requis.');sys.exit(1)
print(f'\nSuccès : {len(manifest["files"])} fichiers EXACTS placés dans {output}')
print('Démarrage : cd sources_exactes ; python -m http.server 8000')
print('Accueil : http://localhost:8000/index.html')
print('Prototype : http://localhost:8000/prototype-pack-conciergerie-3d.html')
print('ATTENTION : pour toutes les pages/liens annexes, téléchargez le dépôt complet à ce même commit.')