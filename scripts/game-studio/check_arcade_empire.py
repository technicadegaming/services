#!/usr/bin/env python3
"""Arcade Empire source and daily progression checks (no external packages)."""
import pathlib, re, sys, json, subprocess
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
# Exercise the actual game script with a fixed event and a minimal browser stub.
# This checks the saved result of a day, not just the presence of formula text.
harness=r"""
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(0,'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/);
if(!script)throw Error('game script missing');
const nodes=new Map(),saved=new Map();
const document={
  getElementById(id){if(!nodes.has(id))nodes.set(id,{style:{},textContent:'',innerHTML:''});return nodes.get(id)},
  querySelectorAll(){return []}
};
const localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)};
const fixedMath=Object.create(Math);fixedMath.random=()=>0;
const context=vm.createContext({document,localStorage,Math:fixedMath,console,setTimeout(){return 1},clearTimeout(){}});
vm.runInContext(script[1],context);
vm.runInContext('s={...fresh(),version:1};s.day=3;s.owned[0].condition=100;openDay()',context);
const state=JSON.parse(saved.get('technicade_arcade_empire_v1'));
const expected={day:4,cash:958,total:152,daysPlayed:1,nextEventDay:6,lastEvent:'School field trip: huge crowds!'};
for(const [key,value] of Object.entries(expected))if(state[key]!==value)throw Error(`${key}: expected ${value}, got ${state[key]}`);
if(state.owned[0].condition!==95)throw Error('daily wear was not saved');
"""
try:
    result=subprocess.run(['node','-e',harness],input=game,text=True,encoding='utf-8',capture_output=True,check=False)
    if result.returncode: errors.append('daily accounting behavior: '+(result.stderr.strip() or result.stdout.strip()))
except OSError as exc:
    errors.append('daily accounting behavior requires Node.js: '+str(exc))
# These checks cover source shape and one simulated day, not live browser behavior.
report={'game':'arcade-empire','checks':'source, DOM shape and deterministic daily accounting','status':'failed' if errors else 'passed','errors':errors}
print(json.dumps(report,indent=2))
sys.exit(bool(errors))
