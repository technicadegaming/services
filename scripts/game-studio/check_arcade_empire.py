#!/usr/bin/env python3
"""Static Arcade Empire QA and progression regression checks (no external packages)."""
import pathlib, re, sys, json
from html.parser import HTMLParser
root=pathlib.Path(__file__).resolve().parents[2]
game=(root/'arcade-empire.html').read_text(encoding='utf-8')
labs=(root/'labs.html').read_text(encoding='utf-8')
errors=[]
class Scanner(HTMLParser):
    def __init__(self): super().__init__(); self.ids=set();self.duplicates=[]
    def handle_starttag(self, tag, attrs):
        for key,val in attrs:
            if key=='id':
                if val in self.ids:self.duplicates.append(val)
                self.ids.add(val)
scanner=Scanner();scanner.feed(game)
if scanner.duplicates:errors.append('duplicate HTML IDs: '+','.join(scanner.duplicates))
ids=['stats','day','objective','machines','market','upgrades','milestones','log','lastEvent','open','supply','advert','expand','reset']
for i in ids:
    if i not in scanner.ids:errors.append('missing DOM element '+i)
for identifier in ['fresh','load','save','openDay','repair','buy','upgradeMachine','purchaseUpgrade','render']:
    if not re.search(r'function\s+'+identifier+r'\s*\(',game): errors.append('missing game action '+identifier)
if 'localStorage.setItem(KEY' not in game:errors.append('browser persistence missing')
if 'arcade-empire.html' not in labs:errors.append('Labs listing missing')
if 'stripe.checkout.sessions.create' in game or 'sk_live_' in game:errors.append('server/payment logic found in static client')
if 'eventCost' not in game or 'eventBoost' not in game:errors.append('dynamic business events missing')
if 'Math.round(amount*eventBoost)' not in game:errors.append('business event boost not applied')
if not 'let expenses=35+s.owned.length*9+eventCost' in game: errors.append('event cost not included in expenses')
# Keep a record of design rules; these are static checks, not live functional/browser tests.
report={'game':'arcade-empire','checks':'static source and DOM shape','status':'failed' if errors else 'passed','errors':errors}
print(json.dumps(report,indent=2))
sys.exit(bool(errors))
