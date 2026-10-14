#!/usr/bin/env python3
"""Arcade Empire static checks and deterministic JavaScript regression suite."""
import json
import pathlib
import re
import subprocess
import sys
from html.parser import HTMLParser

root = pathlib.Path(__file__).resolve().parents[2]
game = (root / 'arcade-empire.html').read_text(encoding='utf-8')
script = (root / 'arcade-empire.js').read_text(encoding='utf-8')
labs = (root / 'labs.html').read_text(encoding='utf-8')
errors = []

class Scanner(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicates = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key == 'id':
                if value in self.ids:
                    self.duplicates.append(value)
                self.ids.add(value)

scanner = Scanner()
scanner.feed(game)
if scanner.duplicates:
    errors.append('duplicate HTML IDs: ' + ','.join(scanner.duplicates))
for name in ['stats','day','objective','machines','market','upgrades','milestones','log','lastEvent','open','supply','advert','expand','reset','floor','selection','dayReport','analyticsSummary','analyticsRows','cashLedger','prizeStock','prizeReport','saveWarning','corruptExport','export','import']:
    if name not in scanner.ids:
        errors.append('missing DOM element ' + name)
for name in ['fresh','load','save','migrate','openDay','simulateDay','repair','buy','upgradeMachine','purchaseUpgrade','render','validPlacement','routeTo','visitorChoice','importSave']:
    if not re.search(r'function\s+' + name + r'\s*\(', script):
        errors.append('missing game action ' + name)
if '<script src="arcade-empire.js"></script>' not in game or 'arcade-empire.css' not in game:
    errors.append('game assets not linked')
if 'localStorage.setItem(KEY' not in script or 'technicade_arcade_empire_v1' not in script:
    errors.append('browser persistence or original key missing')
if 'arcade-empire.html' not in labs:
    errors.append('Labs listing missing')
if any(token in script for token in ('stripe.checkout.sessions.create','sk_live_','service_role')):
    errors.append('server credential or payment logic found in client')
try:
    result = subprocess.run(['node', str(root / 'scripts/game-studio/check_arcade_empire_runtime.js')],
                            cwd=root, text=True, encoding='utf-8', capture_output=True, check=False)
    if result.returncode:
        errors.append('runtime regression: ' + (result.stderr.strip() or result.stdout.strip()))
except OSError as exc:
    errors.append('runtime regression requires Node.js: ' + str(exc))
print(json.dumps({'game':'arcade-empire','checks':'DOM, links, source and deterministic runtime regression',
                  'status':'failed' if errors else 'passed','errors':errors}, indent=2))
sys.exit(bool(errors))
