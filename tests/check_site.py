#!/usr/bin/env python3
"""Dependency-free public-site checks; no server, API, or payment required."""
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

class Collector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.labels = []
        self.buttons = []
        self.scripts = []
        self._script = False
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if data.get("id"): self.ids.append(data["id"])
        if tag == "a": self.links.append(data)
        if tag == "button": self.buttons.append(data)
        if tag == "script":
            self.scripts.append(data)
            self._script = True
    def handle_endtag(self, tag):
        if tag == "script": self._script = False

class SiteChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dom = Collector()
        cls.dom.feed(HTML)
    def test_html_structure_and_accessible_navigation(self):
        for value in ("main", "haut", "vision", "solutions", "laboratoire", "flowSteps", "processCanvas", "sceneFallback"):
            self.assertIn(value, self.dom.ids)
        self.assertEqual(len(self.dom.ids),len(set(self.dom.ids)), "duplicate HTML ids")
        for link in self.dom.links:
            href = link.get("href", "")
            if href.startswith("#") and href != "#":
                self.assertIn(href[1:],self.dom.ids,href)
        self.assertTrue(any(x.get("href") == "./avancement.html" for x in self.dom.links))
        self.assertTrue(any(x.get("href") == "#main" for x in self.dom.links))
        self.assertIn('aria-label="Navigation principale"', HTML)
    def test_webgl_is_real_and_has_fallback(self):
        for marker in ("getContext('webgl2'", "createShader", "gl.drawArrays", "perspective(", "IntersectionObserver", "prefers-reduced-motion", "webglcontextlost"):
            self.assertIn(marker, HTML)
        self.assertIn("sceneFallback", HTML)
        self.assertIn("renderer?.render(progress)", HTML)
    def test_simulator_has_three_state_buttons(self):
        for state in ("ready", "pending", "incident"):
            self.assertRegex(HTML, r'data-scenario="' + state + '"')
        self.assertIn("aria-pressed",HTML)
        self.assertIn("aria-live",HTML)
    def test_truthful_offer_and_avoid_leaks(self):
        for marker in ("Aucun achat", "VALIDATION MÉTIER EN COURS", "Prix indicatif en étude"):
            self.assertIn(marker,HTML)
        for marker in ("type=\"password\"", "https://js.stripe.com", "https://checkout.stripe.com", "api_key=", "sk_live_"):
            self.assertNotIn(marker,HTML)
        self.assertNotIn("@import url",HTML)
    def test_mobile_breakpoints_and_focus(self):
        for marker in ("max-width:750px","max-width:380px",".navigation{display:flex;gap:4px 11px",":focus-visible"):
            self.assertIn(marker,HTML)
    def test_inline_javascript_syntax(self):
        matches = re.findall(r"<script(?: [^>]*)?>(.*?)</script>",HTML,re.S|re.I)
        self.assertEqual(len(matches),1, "expected one self-contained script")
        with tempfile.NamedTemporaryFile("w",suffix=".js",encoding="utf-8") as f:
            f.write(matches[0]);f.flush()
            p=subprocess.run(["node","--check",f.name],capture_output=True,text=True)
            self.assertEqual(p.returncode,0,p.stderr)

if __name__ == "__main__": unittest.main(verbosity=2)
