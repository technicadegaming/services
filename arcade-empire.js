'use strict';
// All money and customer decisions happen here; the floor animation only replays results.
const KEY='technicade_arcade_empire_v1', VERSION=5, COLS=9, ROWS=7, ENTRANCE=57;
const catalog=[
  {id:'pinball',name:'Cosmic Pinball',icon:'🚀',buy:200,earn:90,appeal:3,price:7,type:'skill'},
  {id:'racer',name:'Turbo Street',icon:'🏎️',buy:320,earn:135,appeal:4,price:9,type:'speed'},
  {id:'claw',name:'Lucky Claw',icon:'🧸',buy:250,earn:110,appeal:3,price:8,type:'prize'},
  {id:'rhythm',name:'Beat Reactor',icon:'🎵',buy:500,earn:190,appeal:5,price:10,type:'music'},
  {id:'shooter',name:'Galaxy Blaster',icon:'👾',buy:410,earn:160,appeal:4,price:9,type:'skill'},
  {id:'hoops',name:'Basket Bonanza',icon:'🏀',buy:650,earn:235,appeal:5,price:11,type:'sport'},
  {id:'laser',name:'Photon Tag Pod',icon:'⚡',buy:950,earn:340,appeal:7,price:13,type:'skill'}
];
const upgrades=[
  {id:'tools',name:'Pro Tool Kit',cost:400,desc:'Repairs cost 25% less cash.'},
  {id:'lights',name:'Neon Makeover',cost:650,desc:'More visitors notice your arcade.'},
  {id:'staff',name:'Repair Technician',cost:900,desc:'Choose technician shifts: less wear for $35 per open day.'},
  {id:'vip',name:'VIP Prize Counter',cost:900,desc:'Stocked prizes draw more visitors; $10 daily upkeep. Best with several healthy cabinets.'}
];
const prizeCatalog=[
  {id:'stickers',name:'Star Sticker Set',tickets:1,pack:10,cost:40,hint:'Prize fans can claim one after a completed play.'},
  {id:'plush',name:'Pocket Comet Plush',tickets:3,pack:5,cost:75,hint:'Prize fans need a completed play on a level 5 cabinet.'}
];
const goalDefs=[
 {id:'repair',name:'Repair your first cabinet',hint:'Use Repair on Cosmic Pinball to make it reliable.'},
 {id:'place',name:'Position a cabinet',hint:'Select a cabinet, then choose a free floor tile.'},
 {id:'sale',name:'Earn your first customer sale',hint:'Open for a day and watch a visitor play.'},
 {id:'fiveDays',name:'Operate 5 days',hint:'Open for more days; keep cabinets in good condition.'},
 {id:'threeGames',name:'Own 3 arcade games',hint:'Buy salvage cabinets and repair them.'},
 {id:'sales5000',name:'Reach $5,000 in sales',hint:'Improve pricing, placement and reliability.'},
 {id:'expand',name:'Expand your arcade',hint:'Save $1,250 to increase cabinet capacity.'},
 {id:'fiveGames',name:'Own 5 arcade games',hint:'Fill your expanded floor.'},
 {id:'sales25000',name:'Reach $25,000 in sales',hint:'Build a balanced arcade that visitors enjoy.'},
 {id:'franchise',name:'Open a second arcade',hint:'After 30 days and 10 cabinets, save $25,000 to open a satellite arcade.'}
];
const $=id=>document.getElementById(id), item=id=>catalog.find(c=>c.id===id);
const integer=(v,lo,hi,fallback)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi?v:fallback;
const money=v=>(v<0?'-$':'$')+Math.abs(Math.round(v)).toLocaleString();
const openingPlans={regular:{name:'Regular hours',visitors:0,cost:0,wear:0},late:{name:'Extended hours',visitors:8,cost:30,wear:0},care:{name:'Preventive checks',visitors:0,cost:3,wear:1}};
function fresh(){return {version:VERSION,day:1,cash:850,parts:3,reputation:1,capacity:3,locations:0,activeLocation:0,branches:[],workers:0,owned:[{id:'pinball',condition:30,level:1,uid:1,pos:12,price:7,sales:0,plays:0,autoService:false}],market:['claw','racer','shooter'],upgrades:[],staffOn:false,openingPlan:'regular',prizeInventory:{stickers:0,plush:0},prizeTicketsIssued:0,prizeTicketsRedeemed:0,ads:0,total:0,log:['Welcome! Restore Cosmic Pinball, then open your first day.'],nextUid:2,daysPlayed:0,lastEvent:'No event yet',nextEventDay:3,lastDay:null,history:[],cashLedger:[],achievements:[]}}
function accessibleTiles(){const capacity=typeof s==='undefined'||!s?50:s.capacity;const unlocked=Math.min(COLS*ROWS-1,Math.max(10,capacity+9));return Array.from({length:COLS*ROWS},(_,p)=>p).filter(p=>p!==ENTRANCE).sort((a,b)=>{const distance=p=>Math.abs(p%COLS-4)+Math.abs(Math.floor(p/COLS)-3);return distance(a)-distance(b)||a-b}).slice(0,unlocked)}
function defaultPosition(used,owned=[]){for(const p of [12,21,30,14,23,32,10,28,5,40,50,...Array.from({length:COLS*ROWS},(_,i)=>i)])if(!used.has(p)&&p!==ENTRANCE&&accessibleTiles().includes(p)){const trial=[...owned,{pos:p}];if(trial.every(m=>routeTo(m.pos,trial)))return p}return -1}
function migrate(raw){
  if(!raw||typeof raw!=='object'||![1,2,3,4,5].includes(raw.version)||!Array.isArray(raw.owned))throw Error('Unsupported or damaged save');
  const base=fresh(), used=new Set(), uids=new Set();
  if(raw.owned.length>50)throw Error('Too many machines');
  const owned=[];for(const m of raw.owned){if(!m||!item(m.id)||!Number.isSafeInteger(m.uid)||m.uid<1||uids.has(m.uid))throw Error('Invalid machine');uids.add(m.uid);
    const oldPos=integer(m.pos,0,raw.version>=3?62:34,-1);const pos=raw.version>=3?oldPos:(oldPos<0?-1:Math.floor(oldPos/7)*9+oldPos%7),trial=[...owned,{pos}];let target=pos>=0&&pos!==ENTRANCE&&!used.has(pos)&&trial.every(x=>routeTo(x.pos,trial))?pos:defaultPosition(used,owned);if(target<0)throw Error('Floor is full');used.add(target);
    owned.push({id:m.id,uid:m.uid,pos:target,condition:integer(m.condition,0,100,30),level:integer(m.level,1,5,1),price:integer(m.price,1,25,item(m.id).price),sales:integer(m.sales,0,1e9,0),plays:integer(m.plays,0,1e8,0),autoService:m.autoService===true});
  }
  const state={...base,...raw,version:VERSION,owned,cash:integer(raw.cash,0,1e12,base.cash),parts:integer(raw.parts,0,1e6,base.parts),reputation:integer(raw.reputation,1,20,base.reputation),capacity:integer(raw.capacity,3,50,base.capacity),locations:integer(raw.locations,0,5,0),workers:integer(raw.workers,0,8,0),day:integer(raw.day,1,1e8,base.day),daysPlayed:integer(raw.daysPlayed,0,1e8,base.daysPlayed),total:integer(raw.total,0,1e12,base.total),ads:integer(raw.ads,0,3,0),nextUid:Math.max(integer(raw.nextUid,1,1e8,base.nextUid),...owned.map(m=>m.uid+1)),nextEventDay:integer(raw.nextEventDay,1,1e8,3)};
  state.capacity=Math.max(state.capacity,owned.length);state.market=Array.isArray(raw.market)?[...new Set(raw.market.filter(id=>item(id)))].slice(0,3):base.market;
  state.upgrades=Array.isArray(raw.upgrades)?[...new Set(raw.upgrades.filter(id=>upgrades.some(u=>u.id===id)))]:[];
  state.staffOn=(state.upgrades.includes('staff')||state.workers>0)&&raw.staffOn!==false;
  state.activeLocation=integer(raw.activeLocation,0,state.locations,0);
  state.branches=Array.isArray(raw.branches)?raw.branches.slice(0,6).map((b)=>({capacity:integer(b?.capacity,3,50,3),parts:integer(b?.parts,0,100000,3),workers:integer(b?.workers,0,8,0),staffOn:b?.staffOn===true,upgrades:Array.isArray(b?.upgrades)?b.upgrades.filter(id=>upgrades.some(u=>u.id===id)):[],owned:Array.isArray(b?.owned)?b.owned.filter(x=>x&&item(x.id)&&Number.isInteger(x.pos)&&x.pos>=0&&x.pos<63&&x.pos!==ENTRANCE).slice(0,50):[],market:Array.isArray(b?.market)?b.market.filter(id=>item(id)).slice(0,3):['claw','racer','shooter'],openingPlan:Object.hasOwn(openingPlans,b?.openingPlan)?b.openingPlan:'regular',prizeInventory:b?.prizeInventory||{stickers:0,plush:0}})):[];
  state.openingPlan=Object.hasOwn(openingPlans,raw.openingPlan)?raw.openingPlan:'regular';
  state.prizeInventory=Object.fromEntries(prizeCatalog.map(p=>[p.id,integer(raw.prizeInventory?.[p.id],0,1e6,0)]));
  state.prizeTicketsIssued=integer(raw.prizeTicketsIssued,0,1e9,0);
  state.prizeTicketsRedeemed=Math.min(state.prizeTicketsIssued,integer(raw.prizeTicketsRedeemed,0,1e9,0));
  state.log=Array.isArray(raw.log)?raw.log.filter(x=>typeof x==='string').slice(0,35).map(x=>x.slice(0,240)):base.log;
  state.achievements=Array.isArray(raw.achievements)?[...new Set(raw.achievements.filter(x=>goalDefs.some(g=>g.id===x)))]:[];
  if(raw.version===1&&owned.some(m=>m.condition>=60))state.achievements.push('repair');
  for(const [id,ok] of [['sale',state.total>0],['fiveDays',state.daysPlayed>=5],['threeGames',owned.length>=3],['sales5000',state.total>=5000],['expand',state.capacity>3],['fiveGames',owned.length>=5],['sales25000',state.total>=25000],['franchise',state.locations>0]])if(ok&&!state.achievements.includes(id))state.achievements.push(id);
  state.lastEvent=typeof raw.lastEvent==='string'?raw.lastEvent.slice(0,160):base.lastEvent;
  if(raw.version>=2&&raw.lastDay&&typeof raw.lastDay==='object'){
    const d=raw.lastDay;state.lastDay={gross:integer(d.gross,0,1e9,0),operating:integer(d.operating,0,1e9,0),maintenance:integer(d.maintenance,0,1e9,0),branchNet:integer(d.branchNet,0,1e9,0),serviced:integer(d.serviced,0,50,0),servicedUids:Array.isArray(d.servicedUids)?d.servicedUids.filter(id=>uids.has(id)).slice(0,50):[],net:integer(d.net,-1e9,1e9,0),support:integer(d.support,0,1e9,0),plays:integer(d.plays,0,1e6,0),visitors:integer(d.visitors,0,1e6,0),walkouts:integer(d.walkouts,0,1e6,0),queued:integer(d.queued,0,1e6,0),satisfaction:d.satisfaction===undefined?null:integer(d.satisfaction,0,100,null),prizeTickets:integer(d.prizeTickets,0,1e6,0),prizeRedemptions:integer(d.prizeRedemptions,0,1e6,0),prizeStockValue:integer(d.prizeStockValue,0,1e9,0),plan:Object.hasOwn(openingPlans,d.plan)?d.plan:null,machines:Array.isArray(d.machines)?d.machines.filter(x=>x&&uids.has(x.uid)).slice(0,50).map(x=>({uid:x.uid,plays:integer(x.plays,0,1e6,0),sales:integer(x.sales,0,1e9,0)})):[],event:typeof d.event==='string'?d.event.slice(0,160):''};
  }else state.lastDay=null;
  state.history=Array.isArray(raw.history)?raw.history.slice(-14).filter(d=>d&&typeof d==='object').map(d=>({
    day:integer(d.day,1,1e8,1),gross:integer(d.gross,0,1e9,0),operating:integer(d.operating,0,1e9,0),net:integer(d.net,-1e9,1e9,0),plays:integer(d.plays,0,1e6,0),visitors:integer(d.visitors,0,1e6,0),walkouts:integer(d.walkouts,0,1e6,0),
    prizeStockValue:integer(d.prizeStockValue,0,1e9,null),prizeRedemptions:integer(d.prizeRedemptions,0,1e6,null),prizeCounterActive:d.prizeCounterActive===true,
    machines:Array.isArray(d.machines)?d.machines.filter(x=>x&&uids.has(x.uid)).slice(0,50).map(x=>({uid:x.uid,plays:integer(x.plays,0,1e6,0),sales:integer(x.sales,0,1e9,0)})):[]
  })):[];
  state.cashLedger=Array.isArray(raw.cashLedger)?raw.cashLedger.slice(-30).filter(e=>e&&typeof e==='object'&&typeof e.label==='string'&&Number.isSafeInteger(e.amount)&&Number.isSafeInteger(e.balance)).map(e=>({day:integer(e.day,1,1e8,1),label:e.label.slice(0,120),amount:integer(e.amount,-1e9,1e9,0),balance:integer(e.balance,0,1e12,0)})):[];
  return state;
}
let s,saveWarning='',corruptRaw='',selection=null,floorFocus=10,animationTimer=null,visitors=[];
function load(){let text;try{text=localStorage.getItem(KEY);if(!text)return fresh();return migrate(JSON.parse(text))}catch(e){corruptRaw=text||'';saveWarning='Saved progress could not be read. A new game is shown. Download the damaged save before your next action replaces it.';return fresh()}}
s=load();
function save(){try{if(Array.isArray(s.branches)){s.branches[s.activeLocation]=snapshotLocation()}localStorage.setItem(KEY,JSON.stringify(s));saveWarning=''}catch(e){saveWarning='Browser storage is unavailable. This session may not save.'}}
function note(t){s.log.unshift('Day '+s.day+': '+t);s.log=s.log.slice(0,35)}
function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',2600)}
function award(id){if(!s.achievements.includes(id)){s.achievements.push(id);note('MILESTONE: '+goalDefs.find(g=>g.id===id).name+'.')}}
function updateGoals(){for(const [id,ok] of [['sale',s.total>0],['fiveDays',s.daysPlayed>=5],['threeGames',s.owned.length>=3],['sales5000',s.total>=5000],['expand',s.capacity>3],['fiveGames',s.owned.length>=5],['sales25000',s.total>=25000],['franchise',s.locations>0]])if(ok)award(id)}
function commit(){updateGoals();save();render()}
function recordCash(label,amount,day=s.day){s.cashLedger.push({day,label,amount,balance:s.cash});s.cashLedger=s.cashLedger.slice(-30)}
function spend(amount,label){if(s.cash<amount){toast('Need '+money(amount));return false}s.cash-=amount;recordCash(label,-amount);return true}
function buy(id){const c=item(id);if(!c||!s.market.includes(id)||s.owned.length>=s.capacity)return;const used=new Set(s.owned.map(m=>m.pos)),pos=defaultPosition(used,s.owned);if(pos<0)return toast('No reachable floor tile available');if(!spend(c.buy,'Salvage cabinet: '+c.name))return;
 s.owned.push({id,condition:20+rand(26),level:1,uid:s.nextUid++,pos,price:c.price,sales:0,plays:0,autoService:false});s.market=s.market.filter(x=>x!==id);note('Bought '+c.name+' for '+money(c.buy)+'. Move it on the floor to improve visibility.');commit()}
function repair(uid){const m=s.owned.find(x=>x.uid===uid);if(!m||m.condition>=100)return;const cost=s.upgrades.includes('tools')?38:50;if(s.parts<1)return toast('Need 1 spare part');if(!spend(cost,'Manual repair: '+item(m.id).name))return;m.condition=Math.min(100,m.condition+40);s.parts--;note('Repaired '+item(m.id).name+' to '+m.condition+'%.');award('repair');commit()}
function upgradeMachine(uid){const m=s.owned.find(x=>x.uid===uid);if(!m||m.condition<60||m.level>=5)return;const cost=150*m.level;if(!spend(cost,'Cabinet upgrade: '+item(m.id).name))return;m.level++;note('Upgraded '+item(m.id).name+' to level '+m.level+'.');commit()}
function locationCost(){return 25000*(s.locations+1)}
function hireWorker(){if(s.workers>=8)return toast('Technician team is full.');if(!spend(450,'Hire maintenance technician'))return;s.workers++;s.staffOn=true;note('Hired technician '+s.workers+'. Technicians repair worn cabinets when you operate a day.');commit()}
function fireWorker(){if(s.workers<1)return;s.workers--;note('Reduced technician team to '+s.workers+'.');commit()}
const branchFields=['owned','capacity','parts','workers','staffOn','upgrades','market','openingPlan','prizeInventory'];
function snapshotLocation(){return Object.fromEntries(branchFields.map(k=>[k,structuredClone(s[k])]))}
function newLocation(){return {owned:[{id:'pinball',condition:65,level:1,uid:s.nextUid++,pos:30,price:7,sales:0,plays:0,autoService:false}],capacity:3,parts:3,workers:0,staffOn:false,upgrades:[],market:['claw','racer','shooter'],openingPlan:'regular',prizeInventory:{stickers:0,plush:0}}}
function switchLocation(index){if(!Number.isInteger(index)||index<0||index>s.locations||index===s.activeLocation)return;stopAnimation();if(!Array.isArray(s.branches))s.branches=[];s.branches[s.activeLocation]=snapshotLocation();const next=s.branches[index]||newLocation();for(const k of branchFields)s[k]=structuredClone(next[k]);s.activeLocation=index;selection=null;note('Switched to arcade location '+(index+1)+'.');commit()}
function buyLocation(){if(s.locations>=5)return toast('Five satellite arcades is the current limit.');if(s.daysPlayed<30||s.owned.length<10)return toast('Need 30 operating days and 10 cabinets to unlock a satellite arcade.');const cost=locationCost();if(!spend(cost,'Open satellite arcade '+(s.locations+1)))return;s.branches[s.activeLocation]=snapshotLocation();s.locations++;s.branches[s.locations]=newLocation();note('Opened satellite arcade '+s.locations+'. Select it in Build to manage its cabinets and team.');commit()}
function purchaseUpgrade(id){const u=upgrades.find(x=>x.id===id);if(!u||s.upgrades.includes(id)||!spend(u.cost,'Workshop upgrade: '+u.name))return;s.upgrades.push(id);if(id==='staff')s.staffOn=true;note('Installed '+u.name+'.');commit()}
function toggleStaff(){if(!s.upgrades.includes('staff')&&s.workers===0)return;s.staffOn=!s.staffOn;note('Technician shifts '+(s.staffOn?'enabled':'paused')+'.');commit()}
function setOpeningPlan(id){if(!Object.hasOwn(openingPlans,id)||s.openingPlan===id)return;s.openingPlan=id;commit()}
function restockPrize(id){const p=prizeCatalog.find(x=>x.id===id);if(!p||!s.upgrades.includes('vip')||s.prizeInventory[p.id]>1e6-p.pack||!spend(p.cost,'Prize stock: '+p.name))return;s.prizeInventory[p.id]+=p.pack;note('Stocked '+p.pack+' '+p.name+' prizes for '+money(p.cost)+'.');commit()}
function setPrice(uid,delta){const m=s.owned.find(x=>x.uid===uid);if(!m)return;m.price=Math.max(1,Math.min(25,m.price+delta));note('Set '+item(m.id).name+' to '+money(m.price)+' per play.');commit()}
function toggleService(uid){const m=s.owned.find(x=>x.uid===uid);if(!m)return;m.autoService=!m.autoService;note((m.autoService?'Scheduled':'Stopped')+' automatic servicing for '+item(m.id).name+'.');commit()}
function neighbors(p){const x=p%COLS,y=Math.floor(p/COLS);return [[x,y-1],[x-1,y],[x+1,y],[x,y+1]].filter(([a,b])=>a>=0&&a<COLS&&b>=0&&b<ROWS).map(([a,b])=>b*COLS+a)}
function shortest(from,to,occupied){const queue=[[from]],visited=new Set([from]);for(const path of queue){const p=path[path.length-1];if(p===to)return path;for(const n of neighbors(p))if(!visited.has(n)&&!occupied.has(n)){visited.add(n);queue.push([...path,n])}}return null}
function routeTo(pos,owned=s.owned){const occupied=new Set(owned.map(m=>m.pos));let best=null;for(const n of neighbors(pos)){if(occupied.has(n))continue;const path=shortest(ENTRANCE,n,occupied);if(path&&(!best||path.length<best.length))best=path}return best}
function validPlacement(uid,pos){if(!Number.isInteger(pos)||pos<0||pos>=COLS*ROWS||pos===ENTRANCE||!accessibleTiles().includes(pos))return false;const m=s.owned.find(x=>x.uid===uid);if(!m||s.owned.some(x=>x.uid!==uid&&x.pos===pos))return false;const moved=s.owned.map(x=>x.uid===uid?{...x,pos}:x);return moved.every(x=>routeTo(x.pos,moved))}
function move(uid,pos){if(!validPlacement(uid,pos))return toast('Keep the entrance and a walking route to every cabinet clear.');const m=s.owned.find(x=>x.uid===uid);m.pos=pos;selection=uid;note('Moved '+item(m.id).name+' on the floor.');award('place');commit()}
function rand(n){return Math.floor(Math.random()*n)}
function stock(){const pool=catalog.filter(c=>!s.market.includes(c.id));while(s.market.length<3&&pool.length)s.market.push(pool.splice(rand(pool.length),1)[0].id)}
function visitorChoice(person,loads=new Map()){const choices=[];for(const m of s.owned){if(m.condition<25||m.price>person.budget)continue;const path=routeTo(m.pos),wait=Math.floor((loads.get(m.uid)||0)/4);if(!path||path.length+wait>person.patience)continue;const c=item(m.id),typeBonus=c.type===person.favorite?4:0,pricePenalty=Math.max(0,m.price-c.price)*2;
 const score=c.appeal+m.level+typeBonus+Math.round(m.condition/25)+Math.max(0,9-path.length)-pricePenalty-wait*2+rand(3);if(score>0)choices.push({m,path,score,wait})}
 choices.sort((a,b)=>b.score-a.score);return choices[0]||null}
function simulateDay(){const activeWorkers=s.staffOn?Math.max(s.upgrades.includes('staff')?1:0,s.workers):0,staffed=activeWorkers>0,plan=openingPlans[s.openingPlan];let eventBoost=1,eventCost=0,eventMessage='Normal business day';if(s.day>=s.nextEventDay){const event=rand(8);if(event===0){eventBoost=1.5;eventMessage='School field trip: curious new visitors.'}if(event===1){eventBoost=1.3;eventMessage='Local tournament brings extra players.'}if(event===2){eventCost=90;eventMessage='Electrical repair: $90 operating expense.'}if(event===3){s.parts+=2;eventMessage='Supplier delivers 2 bonus spare parts.'}if(event===4){eventBoost=.75;eventMessage='Rainstorm reduces foot traffic.'}if(event===5){eventBoost=1.75;eventCost=70;eventMessage='Birthday party booking! Guests spend more; hosting costs $70.'}if(event===6){eventBoost=1.55;eventCost=100;eventMessage='Arcade tournament! Entry traffic increases; prize budget $100.'}if(event===7){eventBoost=1.35;eventMessage='Weekend family promotion brings more customers.'}s.nextEventDay=s.day+3+rand(3);s.lastEvent=eventMessage;note('EVENT: '+eventMessage)}
 const prizeTraffic=s.upgrades.includes('vip')?(prizeCatalog.some(p=>s.prizeInventory[p.id]>0)?10:2):0;
 const count=Math.min(48,Math.max(6,Math.round((12+s.reputation*.7+s.owned.length*2+(s.upgrades.includes('lights')?5:0)+prizeTraffic+(s.ads?7:0)+plan.visitors)*eventBoost)));
 const timeline=[],transactions=new Set(),loads=new Map(),dayMachine=new Map(s.owned.map(m=>[m.uid,{uid:m.uid,plays:0,sales:0}]));let gross=0,plays=0,walkouts=0,queued=0,satisfactionTotal=0,prizeTickets=0,prizeRedemptions=0,prizeStockValue=0;
 for(let i=0;i<count;i++){const person={id:s.day+'-'+i,favorite:s.upgrades.includes('vip')&&rand(3)===0?'prize':catalog[rand(catalog.length)].type,budget:5+rand(11)+Math.floor(s.reputation/5),patience:5+rand(8)};
  const pick=visitorChoice(person,loads);if(!pick){walkouts++;timeline.push({id:person.id,path:[ENTRANCE],result:'left'});continue}
  const m=pick.m,amount=m.price;if(!transactions.has(person.id)&&m.condition>=25){transactions.add(person.id);gross+=amount;plays++;m.plays++;m.sales+=amount;dayMachine.get(m.uid).plays++;dayMachine.get(m.uid).sales+=amount;loads.set(m.uid,(loads.get(m.uid)||0)+1);if(pick.wait)queued++;let redeemed=false;
    if(s.upgrades.includes('vip')){const tickets=Math.min(3,1+Math.floor((m.level-1)/2));prizeTickets+=tickets;s.prizeTicketsIssued+=tickets;
      const plush=prizeCatalog[1],sticker=prizeCatalog[0],reward=person.favorite==='prize'&&tickets>=plush.tickets&&s.prizeInventory.plush>0?plush:sticker;
      if(person.favorite==='prize'&&tickets>=reward.tickets&&s.prizeInventory[reward.id]>0){s.prizeInventory[reward.id]--;s.prizeTicketsRedeemed+=reward.tickets;prizeRedemptions++;prizeStockValue+=reward.cost/reward.pack;redeemed=true}
    }
    const c=item(m.id),satisfaction=Math.max(0,Math.min(5,3+(c.type===person.favorite?1:0)+(m.condition>=70?1:0)+(redeemed?1:0)-(m.price>c.price+2?1:0)-(pick.wait?1:0)));
    satisfactionTotal+=satisfaction;timeline.push({id:person.id,path:pick.path,result:'played',uid:m.uid,amount,wait:pick.wait,reaction:satisfaction>=5?'delighted':satisfaction>=3?'pleased':'disappointed'});
    if(m.plays%(3+m.level)===0)m.condition=Math.max(0,m.condition-(staffed?1:2));
  }}
 for(const m of s.owned)m.condition=Math.max(0,m.condition-Math.max(0,(staffed?1:2)-plan.wear)-rand(2));
 let maintenance=0,serviced=0;const servicedUids=[];const serviceCost=s.upgrades.includes('tools')?38:50;
 const requiredOperating=35+s.owned.length*9+(staffed?35:0)+activeWorkers*24+(s.upgrades.includes('vip')?10:0)+eventCost+plan.cost;
 for(const m of [...s.owned].sort((a,b)=>a.condition-b.condition))if((m.autoService||staffed)&&m.condition<75&&serviced<Math.max(activeWorkers*3,staffed?3:0,m.autoService?1:0)){if(s.parts<1&&staffed&&s.cash+gross-requiredOperating-maintenance>=75+serviceCost){s.parts+=3;maintenance+=75;note('Maintenance team ordered 3 spare parts for $75.')}if(s.parts<1||s.cash+gross-requiredOperating-maintenance<serviceCost)continue;m.condition=Math.min(100,m.condition+40);s.parts--;maintenance+=serviceCost;serviced++;servicedUids.push(m.uid)}
 const operating=requiredOperating+maintenance;
 // Each inactive arcade operates its actual saved machines; no passive flat income.
 let branchNet=0;
 for(let i=0;i<=s.locations;i++){
  if(i===s.activeLocation)continue;
  const branch=s.branches?.[i];if(!branch)continue;
  const active=branch.owned.filter(m=>m.condition>=25);
  const branchGross=active.reduce((sum,m)=>sum+Math.round(m.price*(2+Math.min(5,m.level))),0);
  const crew=branch.staffOn?(branch.workers||0):0;
  let branchMaintenance=0,done=0;
  for(const machine of [...branch.owned].sort((a,b)=>a.condition-b.condition)){
   machine.condition=Math.max(0,machine.condition-1-(machine.level>2?1:0));
   if(crew>0&&machine.condition<65&&done<crew*2&&branch.parts>0){
    machine.condition=Math.min(100,machine.condition+40);branch.parts--;branchMaintenance+=branch.upgrades.includes('tools')?38:50;done++;
   }
  }
  const branchOperating=20+branch.owned.length*5+crew*24+branchMaintenance;
  branchNet+=branchGross-branchOperating;
 }

 const net=gross-operating+branchNet;let support=Math.max(0,-(s.cash+net));s.cash+=net+support;recordCash('Open day: '+money(gross)+' sales - '+money(operating)+' operating + '+money(branchNet)+' satellite net + '+money(support)+' support',net+support);s.total+=gross;s.daysPlayed++;s.day++;if(s.ads)s.ads--;
 const satisfaction=plays?Math.round(satisfactionTotal/plays*20):0;
 if(plays>0&&satisfaction>=50&&walkouts<count/2)s.reputation=Math.min(20,s.reputation+1);else if(plays===0||satisfaction<30||walkouts>count*.7)s.reputation=Math.max(1,s.reputation-1);
 if(prizeRedemptions>=3)s.reputation=Math.min(20,s.reputation+1);
 if(!s.owned.some(m=>m.condition>=25)){const repairCost=s.upgrades.includes('tools')?38:50;if(s.parts===0)s.parts=1;if(s.cash<repairCost){const aid=repairCost-s.cash;s.cash+=aid;support+=aid;recordCash('Emergency repair support',aid,s.day-1)}}
 if(support)note('Community support '+money(support)+' and any emergency part kept the arcade open. This is not sales.');
 s.lastDay={gross,branchNet,operating,maintenance,serviced,servicedUids,net,support,plays,visitors:count,walkouts,queued,satisfaction,prizeTickets,prizeRedemptions,prizeStockValue,plan:s.openingPlan,machines:[...dayMachine.values()],event:eventMessage};
 s.history.push({day:s.day-1,gross,operating,net,plays,visitors:count,walkouts,prizeStockValue,prizeRedemptions,prizeCounterActive:s.upgrades.includes('vip'),machines:[...dayMachine.values()]});s.history=s.history.slice(-14);
 stock();note('Sales '+money(gross)+' from '+plays+' plays; operating '+money(operating)+'; net '+money(net)+'. '+walkouts+' visitors left.'+(serviced?' '+serviced+' serviced.':''));return timeline}
function stopAnimation(message='Customers arrive when you open for a day.'){if(animationTimer)clearInterval(animationTimer);animationTimer=null;visitors=[];$('skipReplay').hidden=true;$('floorActivity').textContent=message;renderFloor()}
function openDay(){stopAnimation();const timeline=simulateDay();commit();animate(timeline);toast('Day closed: '+money(s.lastDay.net)+' net')}
function previewTimeline(timeline){if(timeline.length<=12)return timeline;return Array.from({length:12},(_,i)=>timeline[Math.floor(i*(timeline.length-1)/11)])}
function animate(timeline){if(!timeline.length)return;
 const sample=previewTimeline(timeline),summary='Preview of '+sample.length+' of '+timeline.length+' visitor journeys. Daily results include every visitor.';
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){$('floorActivity').textContent='Visitor preview skipped for reduced motion. Daily results include every visitor.';return}
 const waves=[];for(let i=0;i<sample.length;i+=3)waves.push(sample.slice(i,i+3).map(t=>{const hold=t.result==='played'?Math.min(3,t.wait+1):0;return {t,hold,frames:t.result==='played'?[...t.path,...Array(hold+1).fill(t.path[t.path.length-1]),...t.path.slice().reverse()]:[ENTRANCE]}}));
 $('skipReplay').hidden=false;let wave=0,step=0;animationTimer=setInterval(()=>{if(wave>=waves.length){stopAnimation('Customers have gone home for the day. '+summary);return}
  visitors=waves[wave].filter(x=>step<x.frames.length).map(({t,hold,frames})=>({pos:frames[step],result:t.result==='played'&&step===t.path.length+hold?'reaction':t.result==='played'&&step>=t.path.length&&step<t.path.length+hold?'played':'walking',reaction:t.reaction}));
  const playing=visitors.filter(v=>v.result==='played').length,reacting=visitors.filter(v=>v.result==='reaction').length;
  $('floorActivity').textContent=summary+' '+visitors.length+' on the floor · '+playing+' playing · '+reacting+' reacting.';renderFloor();step++;if(step>=Math.max(...waves[wave].map(x=>x.frames.length))){wave++;step=0}
 },75)}
function exportSave(){const blob=new Blob([JSON.stringify(s,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='arcade-empire-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportCorrupt(){if(!corruptRaw)return;const blob=new Blob([corruptRaw],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='arcade-empire-damaged-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function importSave(file){if(!file||file.size>100000)return toast('Choose a save file under 100 KB');try{const candidate=migrate(JSON.parse(await file.text()));if(!confirm('Replace this browser’s Arcade Empire progress with the selected save?'))return;stopAnimation();s=candidate;selection=null;commit();toast('Save imported')}catch(e){toast('Invalid or incompatible save file. Current progress was kept.')}}
function renderFloor(){const focusedCell=document.activeElement?.dataset?.cell;if(focusedCell!==undefined)floorFocus=+focusedCell;const cells=[];const unlocked=new Set([...accessibleTiles(),...s.owned.map(m=>m.pos)]);for(let p=0;p<COLS*ROWS;p++){const m=s.owned.find(x=>x.pos===p),c=m&&item(m.id),isEntrance=p===ENTRANCE,present=visitors.filter(v=>v.pos===p);
 const servicedToday=m&&s.lastDay?.servicedUids?.includes(m.uid);const title=!unlocked.has(p)?'Locked floor: expand your arcade to open more space':isEntrance?'Entrance and exit':m?c.name+', condition '+m.condition+'%, '+(m.condition<25?'BROKEN: repair required, ':m.condition<45?'maintenance recommended, ':'')+money(m.price)+' per play':selection?'Move selected cabinet here':'Empty floor';
 const reaction=present.find(v=>v.result==='reaction'),marker=reaction?(reaction.reaction==='delighted'?'🤩':reaction.reaction==='pleased'?'😊':'😕'):present.some(v=>v.result==='played')?'✨':'👤';
 cells.push('<button type="button" class="floor-cell '+(isEntrance?'entrance ':'')+(!unlocked.has(p)?'locked ':'')+(m?'cabinet game-'+m.id+' '+(m.condition<25?'broken needs-attention ':m.condition<45?'needs-attention ':'')+(selection===m.uid?'selected ':''):'')+'" data-cell="'+p+'" aria-label="'+title+'" tabindex="'+(p===floorFocus?'0':'-1')+'" '+(isEntrance||!unlocked.has(p)?'disabled':'')+'><span class="floor-icon">'+(m?c.icon:isEntrance?'🚪':'')+'</span>'+(m?'<span class="floor-name">'+c.name+'</span><span class="floor-meter">'+m.condition+'% · '+money(m.price)+'</span>':isEntrance?'<span class="floor-name">Entrance</span>':'')+(servicedToday?'<span class="service-mark" aria-label="Technician serviced this machine">🔧</span>':'')+(present.length?'<span class="visitor" aria-hidden="true">'+marker+(present.length>1?present.length:'')+'</span>':'')+'</button>')}
 $('floor').innerHTML=cells.join('');$('floor').querySelectorAll('[data-cell]').forEach(b=>{
  b.onfocus=()=>{floorFocus=+b.dataset.cell;$('floor').querySelectorAll('[data-cell]').forEach(tile=>tile.tabIndex=tile===b?0:-1)};
  b.onclick=()=>{const p=+b.dataset.cell,m=s.owned.find(x=>x.pos===p);if(selection!==null&&!m){move(selection,p);return}if(m){selection=m.uid;render();return}selection=null;render()};
  b.onkeydown=e=>{const step={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(!step)return;e.preventDefault();let x=+b.dataset.cell%COLS+step[0],y=Math.floor(+b.dataset.cell/COLS)+step[1];while(x>=0&&x<COLS&&y>=0&&y<ROWS){const p=y*COLS+x;if(p!==ENTRANCE&&unlocked.has(p)){$('floor').querySelector('[data-cell="'+p+'"]').focus();break}x+=step[0];y+=step[1]}}
 });
 if(focusedCell!==undefined)$('floor').querySelector('[data-cell="'+focusedCell+'"]')?.focus();
}
function renderAnalytics(){
 const recent=s.history.slice(-7),previous=s.history.slice(-14,-7),sum=(days,key)=>days.reduce((n,d)=>n+d[key],0);
 if(!recent.length){$('analyticsSummary').textContent='Open for a day to compare cabinet results.';$('analyticsRows').innerHTML='<tr><td colspan="5">No completed days yet.</td></tr>';return}
 const net=sum(recent,'net'),prior=sum(previous,'net'),walkouts=sum(recent,'walkouts'),visitors=sum(recent,'visitors');
 $('analyticsSummary').textContent='Last '+recent.length+' day'+(recent.length===1?'':'s')+': '+money(sum(recent,'gross'))+' sales · '+money(sum(recent,'operating'))+' operating · '+money(net)+' net · '+walkouts+' of '+visitors+' visitors left'+(previous.length===7?' · prior seven day net '+money(prior):'')+'.';
 const rows=s.owned.map(m=>{const plays=recent.reduce((n,d)=>n+(d.machines.find(x=>x.uid===m.uid)?.plays||0),0),sales=recent.reduce((n,d)=>n+(d.machines.find(x=>x.uid===m.uid)?.sales||0),0),path=routeTo(m.pos);return {m,plays,sales,walk:path?path.length:'blocked'}}).sort((a,b)=>b.sales-a.sales||a.m.uid-b.m.uid);
 $('analyticsRows').innerHTML=rows.map(({m,plays,sales,walk})=>'<tr><th scope="row">'+item(m.id).name+'</th><td>'+money(m.price)+'</td><td>'+walk+'</td><td>'+plays+'</td><td>'+money(sales)+'</td></tr>').join('');
}
function renderCashLedger(){const rows=s.cashLedger.slice().reverse();$('cashLedger').textContent=rows.length?rows.map(e=>'Day '+e.day+' · '+e.label+' · '+(e.amount>=0?'+':'')+money(e.amount)+' · balance '+money(e.balance)).join('\n'):'No cash activity tracked yet. Existing saves begin tracking with the next action.'}
function renderPrizeCounter(){
 if(!s.upgrades.includes('vip')){$('prizeStock').innerHTML='<p class="sub">Install the VIP Prize Counter to stock and redeem prizes.</p>';$('prizeReport').textContent='';return}
 $('prizeStock').innerHTML=prizeCatalog.map(p=>'<div class="marketitem"><div><b>'+p.name+'</b><div class="sub">'+s.prizeInventory[p.id]+' in stock · '+p.tickets+' ticket'+(p.tickets===1?'':'s')+' · '+money(p.cost/p.pack)+' wholesale each</div><div class="sub">'+p.hint+'</div></div><button data-restock="'+p.id+'" '+(s.cash<p.cost?'disabled':'')+'>Stock '+p.pack+' for '+money(p.cost)+'</button></div>').join('');
 $('prizeStock').querySelectorAll('[data-restock]').forEach(b=>b.onclick=()=>restockPrize(b.dataset.restock));
 const d=s.lastDay,recent=s.history.slice(-7).filter(x=>x.prizeCounterActive&&x.prizeStockValue!==null&&x.prizeRedemptions!==null);
 const used=recent.reduce((n,x)=>n+x.prizeStockValue,0),redeemed=recent.reduce((n,x)=>n+x.prizeRedemptions,0),afterStock=recent.reduce((n,x)=>n+x.net-x.prizeStockValue,0);
 const recentText=recent.length?' Last '+recent.length+' tracked open day'+(recent.length===1?'':'s')+': '+redeemed+' prizes used '+money(used)+' of prepaid stock; operating net after stock used '+money(afterStock)+'. This is an arcade-wide estimate, not profit caused by the counter.':' Older saves have no tracked prize history yet.';
 $('prizeReport').textContent=d?'Last day: '+d.prizeTickets+' tickets issued from completed plays · '+d.prizeRedemptions+' prizes redeemed · '+money(d.prizeStockValue)+' prepaid stock used. Operating net after stock used: '+money(d.net-d.prizeStockValue)+'. Stock purchases are cash actions, so they are not charged again in daily operating costs.'+recentText:'Stock prizes before opening to delight visiting players.';
}
function render(){const focused=document.activeElement,focusData=focused&&['select','price','repair','service','boost','buy','upgrade','restock'].map(key=>[key,focused.dataset?.[key]]).find(([,value])=>value!==undefined),focusDelta=focused?.dataset?.delta;
 const stats=[['🏬 Current',s.activeLocation+1+' / '+(s.locations+1)],['👷 Technicians',s.staffOn?Math.max(s.workers,s.upgrades.includes('staff')?1:0):0],['🏪 Locations',s.locations+1],['💵 Cash',money(s.cash)],['📦 Parts',s.parts],['⭐ Reputation',s.reputation],['🏢 Cabinets',s.owned.length+' / '+s.capacity],['💰 Lifetime sales',money(s.total)]];
 $('stats').innerHTML=stats.map(([k,v])=>'<div class="stat"><span class="sub">'+k+'</span><b>'+v+'</b></div>').join('');$('day').textContent='DAY '+s.day+' · '+(s.ads?'Marketing active':'Local business');$('saveWarning').textContent=saveWarning;$('corruptExport').hidden=!corruptRaw;
 const goal=goalDefs.find(g=>!s.achievements.includes(g.id));$('objective').textContent=goal?'NEXT GOAL: '+goal.name+'. '+goal.hint:'ALL STARTER GOALS COMPLETE!';$('milestones').innerHTML=goalDefs.map(g=>'<div class="goal">'+(s.achievements.includes(g.id)?'✅':'○')+' '+g.name+'</div>').join('');
 $('selection').textContent=selection===null?'Select a cabinet, then choose a free floor tile to move it. Use arrow keys to navigate the floor. Routes must stay open.':'Moving '+item(s.owned.find(m=>m.uid===selection).id).name+'. Choose a free tile or another cabinet.';
 renderFloor();$('machines').innerHTML=s.owned.map(m=>{
  const c=item(m.id),path=routeTo(m.pos),reach=path?path.length:'blocked',daily=s.lastDay&&Array.isArray(s.lastDay.machines)?s.lastDay.machines.find(x=>x.uid===m.uid):null;
  return '<article class="machine"><div class="cab">'+c.icon+'</div><h3>'+c.name+'</h3><span class="tag">LEVEL '+m.level+' · '+m.condition+'% · '+(m.condition<25?'BROKEN':'OPEN')+'</span><div class="progress"><i style="width:'+m.condition+'%"></i></div><p class="sub">'+money(m.price)+'/play · lifetime '+m.plays+' plays / '+money(m.sales)+' sales · walk '+reach+' tiles</p><p class="sub">Last day: '+(daily?daily.plays+' plays / '+money(daily.sales):'no data')+' · '+(m.autoService?'service scheduled':'manual service')+'</p><p class="sub">Higher levels attract visitors and slow wear from play.</p><div class="actions"><button data-select="'+m.uid+'">Place</button><button data-price="'+m.uid+'" data-delta="-1" aria-label="Lower '+c.name+' price">− $1</button><button data-price="'+m.uid+'" data-delta="1" aria-label="Raise '+c.name+' price">+ $1</button><button data-repair="'+m.uid+'" '+(m.condition>=100||s.parts<1||s.cash<(s.upgrades.includes('tools')?38:50)?'disabled':'')+'>Repair (1 part + '+money(s.upgrades.includes('tools')?38:50)+')</button><button data-service="'+m.uid+'" aria-pressed="'+m.autoService+'">'+(m.autoService?'Scheduled service: on':'Schedule service')+'</button><button data-boost="'+m.uid+'" '+(m.level>=5||m.condition<60||s.cash<150*m.level?'disabled':'')+'>Upgrade '+money(150*m.level)+'</button></div></article>'
 }).join('');
 renderAnalytics();renderCashLedger();document.querySelectorAll('[data-plan]').forEach(b=>{b.setAttribute('aria-pressed',String(s.openingPlan===b.dataset.plan));b.onclick=()=>setOpeningPlan(b.dataset.plan)});
 const satellite=document.getElementById('satelliteStatus'),satelliteButton=document.getElementById('satelliteBuy');if(satellite){satellite.textContent='You operate '+(s.locations+1)+' arcade'+(s.locations?' locations':'')+'. '+(s.locations?'Your satellite locations contribute daily profit. ':'')+'Unlock: 30 days and 10 cabinets. Next location: '+money(locationCost())+'.';}if(satelliteButton){satelliteButton.disabled=s.locations>=5||s.owned.length<10||s.daysPlayed<30||s.cash<locationCost();satelliteButton.textContent=s.locations>=5?'Maximum satellite locations reached':'Open satellite arcade — '+money(locationCost());}
 $('market').innerHTML=s.market.map(id=>{const c=item(id);return '<div class="marketitem"><div><b>'+c.icon+' '+c.name+'</b><div class="sub">Salvage cabinet · '+money(c.price)+'/play starting price</div></div><button data-buy="'+id+'" '+(s.cash<c.buy||s.owned.length>=s.capacity?'disabled':'')+'>'+money(c.buy)+'</button></div>'}).join('');
 $('upgrades').innerHTML=upgrades.map(u=>'<div class="marketitem"><div><b>'+u.name+'</b><div class="sub">'+u.desc+'</div></div><button data-upgrade="'+u.id+'" '+(s.upgrades.includes(u.id)||s.cash<u.cost?'disabled':'')+'>'+(s.upgrades.includes(u.id)?'Owned':money(u.cost))+'</button></div>').join('');
 $('staffShift').hidden=!s.upgrades.includes('staff')&&s.workers===0;$('staffShift').textContent='Technician shifts: '+(s.staffOn?'On · $35 per day':'Off · no wages');$('staffShift').setAttribute('aria-pressed',String(s.staffOn));
 renderPrizeCounter();
 $('lastEvent').textContent=s.lastEvent||'No event yet';$('dayReport').textContent=s.lastDay?'Last day'+(s.lastDay.plan?' ('+openingPlans[s.lastDay.plan].name+')':'')+': '+s.lastDay.visitors+' visitors · '+s.lastDay.plays+' plays · '+(s.lastDay.queued||0)+' queued · '+s.lastDay.walkouts+' left · '+(s.lastDay.satisfaction===null?'satisfaction not tracked':s.lastDay.satisfaction+'% satisfaction')+' · '+money(s.lastDay.gross)+' sales'+(s.lastDay.branchNet?' · '+money(s.lastDay.branchNet)+' satellite profit':'')+' · '+money(s.lastDay.operating)+' operating'+(s.lastDay.plan&&openingPlans[s.lastDay.plan].cost?' (including '+money(openingPlans[s.lastDay.plan].cost)+' plan cost)':'')+(s.lastDay.maintenance?' (including '+money(s.lastDay.maintenance)+' service)':'')+' · '+money(s.lastDay.net)+' net'+(s.lastDay.support?' · '+money(s.lastDay.support)+' community support':''):'Open for a day to see customer activity and sales.';
 $('log').replaceChildren(...s.log.map(t=>{const d=document.createElement('div');d.textContent=t;return d}));
 document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{selection=+b.dataset.select;render()});document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy));document.querySelectorAll('[data-repair]').forEach(b=>b.onclick=()=>repair(+b.dataset.repair));document.querySelectorAll('[data-service]').forEach(b=>b.onclick=()=>toggleService(+b.dataset.service));document.querySelectorAll('[data-boost]').forEach(b=>b.onclick=()=>upgradeMachine(+b.dataset.boost));document.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>purchaseUpgrade(b.dataset.upgrade));document.querySelectorAll('[data-price]').forEach(b=>b.onclick=()=>setPrice(+b.dataset.price,+b.dataset.delta));
 $('supply').disabled=s.cash<75;$('advert').disabled=s.cash<120||s.ads>0;$('expand').disabled=s.cash<1250||s.capacity>=50;
 if(focusData){const [key,value]=focusData,button=[...document.querySelectorAll('[data-'+key+']')].find(b=>b.dataset[key]===value&&(focusDelta===undefined||b.dataset.delta===focusDelta));if(button&&!button.disabled)button.focus()}
}
$('open').onclick=openDay;$('skipReplay').onclick=()=>{stopAnimation('Visitor preview finished. Daily results include every visitor.');$('open').focus()};$('staffShift').onclick=toggleStaff;$('supply').onclick=()=>{if(!spend(75,'Spare parts: pack of 3'))return;s.parts+=3;note('Purchased 3 spare parts.');commit()};$('advert').onclick=()=>{if(s.ads>0||!spend(120,'Marketing: 3 days'))return;s.ads=3;note('Started three days of marketing.');commit()};$('expand').onclick=()=>{if(s.capacity>=50||!spend(1250,'Floor expansion'))return;s.capacity=Math.min(50,s.capacity+3);note('Construction finished: opened more usable floor tiles. Capacity '+s.capacity+'.');commit()};$('reset').onclick=()=>{if(confirm('Delete this browser’s Arcade Empire progress and start over?')){stopAnimation();s=fresh();selection=null;commit()}};$('export').onclick=exportSave;$('corruptExport').onclick=exportCorrupt;$('import').onchange=e=>{importSave(e.target.files[0]);e.target.value=''};
render();
