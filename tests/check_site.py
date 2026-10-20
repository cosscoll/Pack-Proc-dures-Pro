#!/usr/bin/env python3
"""Static safety gates for the original furnished-apartment storytelling site."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import unittest

ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text(encoding='utf-8')

class Parse(HTMLParser):
 def __init__(self):
  super().__init__()
  self.ids=[];self.hrefs=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if d.get('id'): self.ids.append(d['id'])
  if tag=='a': self.hrefs.append(d.get('href',''))

class Checks(unittest.TestCase):
 def test_structure_and_navigation(self):
  p=Parse();p.feed(HTML)
  self.assertEqual(len(p.ids),len(set(p.ids)),'Duplicate ids')
  for h in p.hrefs:
   if h.startswith('#') and h!='#':self.assertIn(h[1:],p.ids,h)
  self.assertTrue(all((ROOT/f).is_file() for f in ['assets/cinematic.css','assets/apartment-scene.js','assets/experience.js','exemple-procedure.html','atelier-decisions.html','avancement.html']))
  self.assertIn('aria-label="Navigation principale"',HTML)
  self.assertIn('id="sceneFallback"',HTML)
 def test_syntax(self):
  for f in ['assets/apartment-scene.js','assets/experience.js']:
   r=subprocess.run(['node','--check',str(ROOT/f)],capture_output=True,text=True)
   self.assertEqual(r.returncode,0,f+': '+r.stderr)
 def test_separate_truthful_pilot(self):
  for x in ['Aucun achat possible','version pilote','15 procédures','7 registres']:
   self.assertIn(x.lower(),HTML.lower())
  self.assertNotIn('sk_live_',HTML)
  self.assertNotIn('buy.stripe.com',HTML)

if __name__=='__main__': unittest.main(verbosity=2)
