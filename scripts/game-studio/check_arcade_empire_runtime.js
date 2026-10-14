'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('arcade-empire.js','utf8');
function setup(raw,random=0.2){
  const nodes=new Map(),saved=new Map();if(raw!==undefined)saved.set('technicade_arcade_empire_v1',raw);
  function node(){return {style:{},textContent:'',innerHTML:'',disabled:false,querySelectorAll(){return []},replaceChildren(){},setAttribute(){},click(){}}}
  const document={getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},createElement(){return node()},querySelectorAll(){return []}};
  const localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)};
  const fixedMath=Object.create(Math);fixedMath.random=typeof random==='function'?random:()=>random;
  const context=vm.createContext({document,localStorage,Math:fixedMath,console,matchMedia(){return {matches:true}},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},confirm(){return true}});
  vm.runInContext(source,context);
  const run=code=>vm.runInContext(code,context);
  return {run,saved,nodes,state:()=>JSON.parse(saved.get('technicade_arcade_empire_v1')||'null')};
}
const old={version:1,day:3,cash:1000,parts:3,reputation:1,capacity:3,owned:[{id:'pinball',condition:100,level:1,uid:1}],market:['claw','racer','shooter'],upgrades:[],ads:0,total:0,log:[],nextUid:2,daysPlayed:0,lastEvent:'No event yet',nextEventDay:3};
const a=setup(JSON.stringify(old));
assert.equal(a.run('s.version'),2,'old save migrated');
assert.equal(a.run('s.cash'),1000,'old cash retained');
assert.equal(a.run('s.owned[0].condition'),100,'old cabinet retained');
assert.ok(a.run('routeTo(s.owned[0].pos)'),'old cabinet placed with a walking route');
const oldMulti={...old,cash:432,parts:0,reputation:7,ads:2,total:12345,nextUid:4,owned:[
  {id:'pinball',condition:75,level:2,uid:1},
  {id:'claw',condition:43,level:3,uid:2},
  {id:'racer',condition:88,level:1,uid:3}
],upgrades:['tools','lights']};
const migrated=setup(JSON.stringify(oldMulti));
assert.equal(migrated.run('s.cash'),432);assert.equal(migrated.run('s.parts'),0);assert.equal(migrated.run('s.total'),12345);
assert.equal(migrated.run('s.owned.length'),3);assert.equal(migrated.run('s.owned[1].level'),3);
assert.equal(migrated.run('s.upgrades.length'),2);assert.equal(migrated.run('s.ads'),2);
assert.equal(migrated.run('s.openingPlan'),'regular','older saves use unchanged regular hours');
assert.equal(migrated.run('s.cashLedger.length'),0,'older saves begin cash tracking without invented entries');
assert.ok(migrated.run('s.owned.every(m=>routeTo(m.pos))'),'all migrated machines remain reachable');
assert.equal(migrated.saved.get('technicade_arcade_empire_v1'),JSON.stringify(oldMulti),'migration does not overwrite original before an action');
a.run('openDay()');const first=a.state();
assert.equal(first.day,4);assert.equal(first.daysPlayed,1);assert.equal(first.nextEventDay,6);assert.equal(first.lastEvent,'Local tournament brings extra players.');
assert.deepEqual(first.lastDay,{gross:112,operating:44,maintenance:0,serviced:0,net:68,support:0,plays:16,visitors:19,walkouts:3,queued:12,satisfaction:65,prizeTickets:0,prizeRedemptions:0,prizeStockValue:0,plan:'regular',machines:[{uid:1,plays:16,sales:112}],event:'Local tournament brings extra players.'},'deterministic day accounting and queue');
assert.equal(first.cash,1068,'deterministic closing cash');
assert.equal(first.cash,Math.max(0,1000+first.lastDay.net),'daily cash tracks net');
assert.equal(first.lastDay.net,first.lastDay.gross-first.lastDay.operating,'net equals sales minus operating');
assert.equal(first.total,first.lastDay.gross,'lifetime sales equal successful transactions');
assert.equal(first.owned[0].sales,first.total,'cabinet sales equal gross');
assert.equal(first.owned[0].plays,first.lastDay.plays,'one play counter per sale');
assert.ok(first.lastDay.satisfaction>=0&&first.lastDay.satisfaction<=100,'customer satisfaction is bounded');
assert.equal(first.history.length,1,'completed day added to operating history');
assert.equal(first.history[0].gross,first.lastDay.gross,'history records actual completed sales');
assert.equal(first.history[0].prizeStockValue,0,'new operating history tracks stock consumed');
assert.equal(first.history[0].prizeCounterActive,false,'ordinary days are excluded from counter-specific reporting');
assert.equal(first.cashLedger.length,1,'completed day records one cash movement');
assert.equal(first.cashLedger[0].amount,first.lastDay.net+first.lastDay.support,'day cash movement reconciles');
assert.equal(first.cashLedger[0].balance,first.cash,'cash activity ends at saved cash balance');
assert.match(a.nodes.get('analyticsRows').innerHTML,/Cosmic Pinball/,'cabinet comparison renders');
assert.ok(first.owned[0].condition<100,'daily wear saved');
assert.equal(first.lastDay.operating,44,'event costs retained in operating accounting');
const repairEvent=setup(JSON.stringify(old),0.4);repairEvent.run('openDay()');
assert.equal(repairEvent.state().lastDay.event,'Electrical repair: $90 operating expense.');
assert.equal(repairEvent.state().lastDay.operating,134,'event expense is charged exactly once');
assert.equal(repairEvent.state().cash,1000+repairEvent.state().lastDay.net,'event cost flows through closing cash');
const planBase={...old,day:1,nextEventDay:3,cash:1000};
const regularPlan=setup(JSON.stringify(planBase)),latePlan=setup(JSON.stringify(planBase)),carePlan=setup(JSON.stringify(planBase));
regularPlan.run('openDay()');latePlan.run('setOpeningPlan("late");openDay()');carePlan.run('setOpeningPlan("care");openDay()');
assert.equal(latePlan.state().lastDay.visitors,regularPlan.state().lastDay.visitors+8,'extended hours adds eight potential visitors');
assert.equal(latePlan.state().lastDay.operating,regularPlan.state().lastDay.operating+30,'extended hours cost is charged once');
assert.equal(carePlan.state().lastDay.operating,regularPlan.state().lastDay.operating+3,'preventive checks cost is charged once');
assert.ok(carePlan.state().owned[0].condition>=regularPlan.state().owned[0].condition,'preventive checks reduce daily wear');
for(const game of [latePlan,carePlan]){const state=game.state();assert.equal(state.cash,1000+state.lastDay.net+state.lastDay.support,'opening plan cash reconciles');assert.equal(state.lastDay.net,state.lastDay.gross-state.lastDay.operating,'opening plan net reconciles')}
assert.equal(setup(JSON.stringify(latePlan.state())).run('s.openingPlan'),'late','opening choice survives reload');
assert.equal(setup(JSON.stringify({...planBase,openingPlan:'malicious'})).run('s.openingPlan'),'regular','unknown opening choice is rejected');
assert.match(latePlan.nodes.get('dayReport').textContent,/Extended hours.*plan cost/,'closing report names the plan and its cost');
const saved=JSON.stringify(first),reload=setup(saved);assert.equal(reload.run('s.cash'),first.cash);assert.equal(reload.run('s.owned[0].pos'),first.owned[0].pos);
assert.equal(reload.run('s.history[0].net'),first.lastDay.net,'operating history survives reload');
assert.equal(reload.run('s.cashLedger[0].balance'),first.cash,'cash activity survives reload');
assert.equal(a.run('s.history.length'),1,'render and animation do not add history entries');
const broken=setup('{bad json');assert.equal(broken.run('s.day'),1);assert.match(broken.nodes.get('saveWarning').textContent,/could not be read/);
assert.equal(broken.run('corruptRaw'),'{bad json');assert.equal(broken.nodes.get('corruptExport').hidden,false);
const malformedReport=setup(JSON.stringify({...old,version:2,lastDay:{gross:'fake',machines:[null,{uid:1,sales:'fake'}]}}));
assert.equal(malformedReport.run('s.lastDay.gross'),0,'malformed report numbers are sanitized');
assert.equal(malformedReport.run('s.lastDay.machines.length'),1,'malformed cabinet reports are filtered');
assert.equal(malformedReport.run('s.lastDay.satisfaction'),null,'older reports do not invent a satisfaction score');
assert.match(malformedReport.nodes.get('dayReport').textContent,/satisfaction not tracked/,'older report display is honest');
const malformedHistory=setup(JSON.stringify({...old,version:2,history:[{day:4,gross:'fake',machines:[null,{uid:1,plays:'fake',sales:23}]},null]}));
assert.equal(malformedHistory.run('s.history.length'),1,'invalid history entries are removed');
assert.equal(malformedHistory.run('s.history[0].gross'),0,'invalid history totals are sanitized');
assert.equal(malformedHistory.run('s.history[0].machines[0].sales'),23,'valid historical cabinet sales are retained');
assert.equal(malformedHistory.run('s.history[0].prizeStockValue'),null,'old history does not invent prize costs');
const malformedPrizeHistory=setup(JSON.stringify({...old,version:2,history:[{day:4,prizeStockValue:'bad',prizeRedemptions:-4}]}));
assert.equal(malformedPrizeHistory.run('s.history[0].prizeStockValue'),null,'bad historical prize cost is unknown');
assert.equal(malformedPrizeHistory.run('s.history[0].prizeRedemptions'),null,'bad historical redemption count is unknown');
const malformedLedger=setup(JSON.stringify({...old,version:2,cashLedger:[null,{label:'bad',amount:'5',balance:0},{day:2,label:'valid',amount:-5,balance:995}]}));
assert.equal(malformedLedger.run('s.cashLedger.length'),1,'damaged cash activity entries are removed');
const b=setup();
assert.equal(b.run('validPlacement(1,ENTRANCE)'),false,'cannot block entrance');
assert.equal(b.run('validPlacement(1,0)'),true,'valid floor movement');
b.run('move(1,0)');assert.equal(b.state().owned[0].pos,0,'movement persists');
assert.ok(b.state().achievements.includes('place'),'placement milestone persists');
b.run('s.cash=0;repair(1)');assert.equal(b.run('s.owned[0].condition'),30,'repair cannot spend unavailable cash');
b.run('s.cash=1000;s.parts=2;repair(1)');assert.equal(b.run('s.owned[0].condition'),70);assert.equal(b.run('s.parts'),1);assert.equal(b.run('s.cash'),950);
assert.equal(b.state().cashLedger.at(-1).amount,-50,'manual repair appears once as a cash purchase');
assert.ok(b.state().achievements.includes('repair'),'repair milestone persists');
b.run('setPrice(1,25)');assert.equal(b.run('s.owned[0].price'),25,'price capped');
b.run('openDay()');assert.equal(b.state().lastDay.gross,0,'overpriced machine has no paying visitors with fixed budgets');
const c=setup();c.run('s.owned[0].condition=0;openDay()');assert.equal(c.state().lastDay.gross,0,'broken cabinet cannot earn');
const rescue=setup();rescue.run('s.cash=0;s.parts=0;s.owned[0].condition=0;openDay()');
assert.equal(rescue.state().lastDay.gross,0);assert.equal(rescue.state().cash,rescue.state().lastDay.net+rescue.state().lastDay.support,'shortfall and rescue are explicit, not sales');
assert.equal(rescue.state().parts,1,'emergency repair part');
assert.equal(rescue.state().cashLedger.reduce((n,e)=>n+e.amount,0),rescue.state().cash,'emergency support and operating day reconcile from zero cash');
assert.ok(rescue.state().cashLedger.every(e=>e.day===1),'emergency support is attributed to the completed day');
const cashOnlyRescue=setup();cashOnlyRescue.run('s.cash=0;s.parts=3;s.owned[0].condition=0;openDay()');
assert.equal(cashOnlyRescue.state().cash,50,'recovery works when parts exist but cash does not');
const service=setup();service.run('toggleService(1);openDay()');
assert.equal(service.state().lastDay.maintenance,50,'scheduled service is an operating cost');
assert.equal(service.state().lastDay.serviced,1);assert.equal(service.state().parts,2);
assert.ok(service.state().owned[0].condition>=45,'scheduled repair restores cabinet condition');
assert.equal(service.state().lastDay.machines.reduce((sum,m)=>sum+m.sales,0),service.state().lastDay.gross,'per-cabinet daily sales reconcile to gross');
const cashTight=setup(JSON.stringify({...old,cash:0,owned:[{...old.owned[0],condition:40,price:1,autoService:true}]}));cashTight.run('openDay()');
assert.equal(cashTight.state().lastDay.maintenance,0,'automatic service cannot spend cash needed for required operating costs');
assert.equal(cashTight.state().parts,3,'skipped service does not consume a part');
const levelOne=setup(JSON.stringify(old));levelOne.run('openDay()');
const levelTwo=setup(JSON.stringify(old));levelTwo.run('upgradeMachine(1);openDay()');
assert.ok(levelTwo.state().owned[0].condition>levelOne.state().owned[0].condition,'machine upgrade slows play wear');
const near=setup();near.run('s.owned[0].condition=100;openDay()');
const far=setup();far.run('s.owned[0].condition=100;move(1,0);openDay()');
assert.ok(far.state().lastDay.gross<near.state().lastDay.gross,'a long walking route reduces paying visitors');
const advertised=setup();advertised.run('s.owned[0].condition=100;s.ads=3;openDay()');
assert.ok(advertised.state().lastDay.visitors>near.state().lastDay.visitors,'marketing increases traffic');
assert.equal(advertised.state().ads,2,'marketing duration decreases once per day');
const adsPurchase=setup();adsPurchase.run('$("advert").onclick();$("advert").onclick()');
assert.equal(adsPurchase.state().cash,730,'active marketing cannot be purchased twice');
const staffed=setup(JSON.stringify(old));staffed.run('s.upgrades.push("staff");s.staffOn=true;openDay()');
assert.equal(staffed.state().lastDay.operating,79,'technician wages are included in operating costs');
assert.ok(staffed.state().owned[0].condition>first.owned[0].condition,'technician reduces wear');
const paused=setup(JSON.stringify({...old,upgrades:['staff']}));
assert.equal(paused.run('s.staffOn'),true,'existing technician owners keep their active shifts');
paused.run('toggleStaff();openDay()');assert.equal(paused.state().lastDay.operating,44,'paused shift charges no wages');
assert.ok(paused.state().owned[0].condition<staffed.state().owned[0].condition,'paused shift does not reduce wear');
assert.equal(paused.state().staffOn,false,'shift choice persists');
const brighter=setup();brighter.run('s.upgrades.push("lights");openDay()');
assert.ok(brighter.state().lastDay.visitors>near.state().lastDay.visitors,'lighting increases traffic');
const prizeCounter=setup();prizeCounter.run('s.upgrades.push("vip");openDay()');
assert.ok(prizeCounter.state().lastDay.visitors>near.state().lastDay.visitors,'prize counter increases traffic');
assert.equal(prizeCounter.state().lastDay.operating,54,'prize counter upkeep is charged');
assert.equal(prizeCounter.state().lastDay.prizeTickets,prizeCounter.state().lastDay.plays,'tickets follow completed plays');
assert.equal(prizeCounter.state().lastDay.prizeRedemptions,0,'out-of-stock prizes cannot be redeemed');
const prizeStock=setup(JSON.stringify({...old,cash:5000,upgrades:['vip']}));
prizeStock.run('restockPrize("stickers")');assert.equal(prizeStock.state().cash,4960,'stock purchase spends cash once');assert.equal(prizeStock.state().prizeInventory.stickers,10);
assert.equal(prizeStock.state().cashLedger.at(-1).amount,-40,'prize stock is a separate cash purchase');
prizeStock.run('openDay()');const stockedDay=prizeStock.state().lastDay;
assert.ok(stockedDay.prizeRedemptions>0&&stockedDay.prizeRedemptions<=10,'completed plays can redeem only available stock');
assert.equal(prizeStock.state().prizeInventory.stickers,10-stockedDay.prizeRedemptions,'redemption decrements inventory once');
assert.equal(stockedDay.prizeStockValue,stockedDay.prizeRedemptions*4,'prepaid stock used is reported at wholesale cost');
assert.equal(prizeStock.state().history[0].prizeStockValue,stockedDay.prizeStockValue,'historical stock use matches the completed day');
assert.equal(prizeStock.state().history[0].prizeRedemptions,stockedDay.prizeRedemptions,'historical redemptions match the completed day');
assert.equal(prizeStock.state().history[0].prizeCounterActive,true,'counter day is marked for its tracked report');
assert.match(prizeStock.nodes.get('prizeReport').textContent,/Last 1 tracked open day:/,'recent prize report labels its tracked window');
assert.match(prizeStock.nodes.get('prizeReport').textContent,/not profit caused by the counter/,'report does not attribute arcade-wide profit to the counter');
assert.equal(prizeStock.state().cash,4960+stockedDay.net,'stock value is not double charged at closing');
assert.equal(prizeStock.state().cashLedger.reduce((n,e)=>n+e.amount,5000),prizeStock.state().cash,'stock purchase and day closing reconcile');
assert.equal(prizeStock.state().prizeTicketsRedeemed,stockedDay.prizeRedemptions,'ticket spending is bounded by earned tickets');
assert.ok(prizeStock.state().prizeTicketsRedeemed<=prizeStock.state().prizeTicketsIssued,'ticket balance cannot be negative');
const emptyCounter=setup(JSON.stringify({...old,cash:5000,upgrades:['vip']}));emptyCounter.run('openDay()');
assert.ok(prizeStock.state().lastDay.visitors>emptyCounter.state().lastDay.visitors,'stocked counter attracts more visitors');
assert.ok(prizeStock.state().reputation>=emptyCounter.state().reputation,'stocked redemptions do not lower reputation');
assert.ok(prizeStock.state().lastDay.satisfaction>emptyCounter.state().lastDay.satisfaction,'redeemed prizes improve customer satisfaction');
const prizeReload=setup(JSON.stringify(prizeStock.state()));assert.equal(prizeReload.run('s.prizeInventory.stickers'),prizeStock.state().prizeInventory.stickers,'prize stock survives reload');
const brokePrize=setup(JSON.stringify({...old,cash:5000,upgrades:['vip'],owned:[{...old.owned[0],condition:0}],prizeInventory:{stickers:10,plush:0}}));brokePrize.run('openDay()');
assert.equal(brokePrize.state().lastDay.prizeTickets,0,'broken cabinet cannot issue tickets');assert.equal(brokePrize.state().prizeInventory.stickers,10,'broken cabinet cannot redeem prizes');
const poorPrize=setup(JSON.stringify({...old,cash:39,upgrades:['vip']}));poorPrize.run('restockPrize("stickers")');assert.equal(poorPrize.run('s.prizeInventory.stickers'),0,'insufficient funds cannot restock');
const noCounter=setup();noCounter.run('restockPrize("stickers")');assert.equal(noCounter.run('s.prizeInventory.stickers'),0,'prizes require the counter');
const plushPrize=setup(JSON.stringify({...old,cash:5000,upgrades:['vip'],owned:[{...old.owned[0],level:5}],prizeInventory:{stickers:0,plush:5}}));plushPrize.run('openDay()');
assert.ok(plushPrize.state().prizeInventory.plush<5,'high-level play can redeem a premium prize');
assert.equal(plushPrize.state().lastDay.prizeStockValue,(5-plushPrize.state().prizeInventory.plush)*15,'premium prize stock value reconciles');
const prizeLong=setup(JSON.stringify({...old,cash:5000,upgrades:['vip'],prizeInventory:{stickers:10,plush:5}}));prizeLong.run('for(let i=0;i<35;i++)openDay()');
assert.ok(prizeLong.state().prizeInventory.stickers>=0&&prizeLong.state().prizeInventory.plush>=0,'prize inventory remains nonnegative across 35 days');
assert.ok(prizeLong.state().prizeTicketsRedeemed<=prizeLong.state().prizeTicketsIssued,'35-day ticket redemption remains bounded by verified plays');
assert.match(prizeLong.nodes.get('prizeReport').textContent,/Last 7 tracked open days:/,'prize report uses a bounded seven-day window');
assert.equal(prizeLong.state().history.length,14,'counter history remains bounded on long saves');
const mixedArcade=setup(undefined,0.4);mixedArcade.run('repair(1);buy("claw");repair(2);for(let i=0;i<35;i++){if(s.parts<=1&&s.cash>=75)$("supply").onclick();for(const m of s.owned)if(m.condition<45&&s.parts>0&&s.cash>=50)repair(m.uid);openDay()}');
assert.equal(mixedArcade.state().daysPlayed,35,'two-cabinet strategy completes 35 days');
assert.ok(mixedArcade.state().total>5000&&mixedArcade.state().cash>1000,'two-cabinet strategy remains viable');
assert.equal(mixedArcade.state().history.at(-1).gross,mixedArcade.state().lastDay.gross,'multi-cabinet history matches last day');
const d=setup();d.run('s.cash=500;buy("claw")');assert.equal(d.state().cash,250);assert.equal(d.state().owned.length,2);
d.run('buy("claw")');assert.equal(d.state().cash,250,'cannot repurchase same auction item');
const e=setup();e.run('s.owned[0].condition=100;for(let i=0;i<35;i++)openDay()');
assert.equal(e.state().daysPlayed,35);assert.ok(e.state().cash>=0);assert.ok(e.state().total>=0);
assert.equal(e.state().history.length,14,'operating history stays bounded after 35 days');
assert.equal(e.state().history[0].day,22,'oldest retained day is correct');
for(const day of e.state().history){assert.equal(day.net,day.gross-day.operating,'historical net reconciles');assert.equal(day.gross,day.machines.reduce((n,m)=>n+m.sales,0),'historical cabinet sales reconcile')}
const progress=setup();progress.run('repair(1);buy("claw");repair(2);setPrice(2,-1);for(let i=0;i<35;i++){if(s.parts===0&&s.cash>=75)$("supply").onclick();for(const m of s.owned)if(m.condition<35&&s.parts>0&&s.cash>=50)repair(m.uid);openDay()}');
assert.ok(progress.state().cash>1000&&progress.state().total>5000,'managed 35-day business can grow with repairs and fair prices');
assert.ok(progress.state().achievements.includes('sales5000'),'sales milestone recorded');
const overpriced=setup();overpriced.run('setPrice(1,25);for(let i=0;i<35;i++)openDay()');
assert.equal(overpriced.state().total,0,'unaffordable pricing produces no sales across 35 days');
assert.equal(overpriced.state().daysPlayed,35);assert.ok(overpriced.state().cash>=0,'unprofitable pricing still has a recovery path');
assert.ok(progress.state().total>overpriced.state().total,'fair pricing and management outperform unaffordable pricing');
for(const random of [0.05,0.4,0.8]){
  const scenario=setup(undefined,random);
  scenario.run('repair(1);for(let i=0;i<35;i++){if(s.parts===0&&s.cash>=75)$("supply").onclick();if(s.owned[0].condition<35&&s.parts>0&&s.cash>=50)repair(1);openDay()}');
  const state=scenario.state();assert.equal(state.daysPlayed,35);assert.ok(Number.isFinite(state.cash)&&state.cash>=0);assert.ok(Number.isFinite(state.total)&&state.total>=0);
  assert.equal(state.lastDay.gross,state.lastDay.machines.reduce((sum,m)=>sum+m.sales,0),'sales reconciliation under varied demand');
}
const blocker=setup(JSON.stringify({...old,version:2,capacity:5,owned:[
  {id:'pinball',uid:1,pos:17,condition:100,level:1,price:7},
  {id:'claw',uid:2,pos:10,condition:100,level:1,price:8},
  {id:'racer',uid:3,pos:16,condition:100,level:1,price:9},
  {id:'shooter',uid:4,pos:18,condition:100,level:1,price:9},
  {id:'hoops',uid:5,pos:0,condition:100,level:1,price:11}
]}));
assert.equal(blocker.run('validPlacement(5,24)'),false,'cannot enclose a cabinet');
assert.equal(blocker.run('validPlacement(5,1)'),true,'alternate reachable placement');
const preview=setup();
assert.equal(preview.run('previewTimeline(Array.from({length:48},(_,i)=>i)).length'),12,'replay count is bounded');
assert.equal(preview.run('previewTimeline(Array.from({length:48},(_,i)=>i))[11]'),47,'preview includes the final visitor');
assert.equal(preview.run('previewTimeline([1,2,3]).length'),3,'small days show every visitor');
function seeded(seed){let value=seed>>>0;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296}}
function openingPlanRun(seed,plan){
  const start={...old,day:1,cash:10000,parts:100,owned:[{...old.owned[0],condition:100},{id:'claw',uid:2,condition:100,level:1},{id:'racer',uid:3,condition:100,level:1}]};
  const game=setup(JSON.stringify(start),seeded(seed));game.run('setOpeningPlan('+JSON.stringify(plan)+')');
  let gross=0,operating=0,plays=0,repairs=0;
  for(let day=0;day<35;day++){
    repairs+=game.run('s.owned.filter(m=>m.condition<45).length');
    game.run('for(const m of s.owned)if(m.condition<45)repair(m.uid)');
    const before=game.run('s.cash');game.run('openDay()');const state=game.state(),report=state.lastDay;
    assert.equal(report.plan,plan,'35-day opening choice persists');
    assert.equal(state.cash,before+report.net+report.support,'35-day plan closing cash reconciles');
    assert.equal(report.net,report.gross-report.operating,'35-day plan operating net reconciles');
    assert.equal(report.gross,report.machines.reduce((n,m)=>n+m.sales,0),'35-day plan sales reconcile');
    assert.equal(report.operating,62+openingPlansCost[plan]+(report.event.startsWith('Electrical repair')?90:0)+report.maintenance,'35-day plan cost appears exactly once in operating');
    gross+=report.gross;operating+=report.operating;plays+=report.plays;
  }
  return {cash:game.state().cash,gross,operating,plays,repairs};
}
const openingPlansCost={regular:0,late:30,care:3};
for(const seed of [11,29,71]){
  const regular=openingPlanRun(seed,'regular'),late=openingPlanRun(seed,'late'),care=openingPlanRun(seed,'care');
  assert.ok([regular,late,care].every(result=>result.cash>=0&&result.plays>0),'all 35-day plan strategies remain playable');
  console.log('OPENING PLANS seed '+seed+' '+JSON.stringify({regular,late,care}));
}
function longRun(seed,kind){
  const game=setup(undefined,seeded(seed));game.run('repair(1)');
  if(kind!=='single'){game.run('buy("claw");repair(2)')}
  if(kind.startsWith('three'))game.run('buy("racer");repair(3)');
  if(kind==='high')game.run('setPrice(1,25);setPrice(2,25)');
  let totalPlays=0,totalSupport=0,totalGross=0,totalOperating=0,stockSpend=0;
  const cashByDay={};
  for(let day=0;day<90;day++){
    game.run('if(s.parts<=1&&s.cash>=75)$("supply").onclick()');
    game.run('for(const m of s.owned)if(m.condition<45&&s.parts>0&&s.cash>=50)repair(m.uid)');
    if(kind.includes('prizes')){
      game.run('if(!s.upgrades.includes("vip")&&s.cash>=2200)purchaseUpgrade("vip")');
      const buyStock=kind.endsWith('lean')?day%2===0: true;
      const before=game.run('s.cash');if(buyStock)game.run('if(s.upgrades.includes("vip")&&s.prizeInventory.stickers<=3&&s.cash>=140)restockPrize("stickers")');
      if(kind.endsWith('eager'))game.run('if(s.upgrades.includes("vip")&&s.prizeInventory.stickers<=13&&s.cash>=140)restockPrize("stickers")');
      stockSpend+=before-game.run('s.cash');
    }
    const before=game.run('s.cash');game.run('openDay()');const state=game.state(),report=state.lastDay;
    assert.equal(state.cash,before+report.net+report.support,'90-day cash closing reconciles');
    assert.equal(report.gross,report.machines.reduce((n,m)=>n+m.sales,0),'90-day cabinet sales reconcile');
    assert.equal(report.net,report.gross-report.operating,'90-day operating net reconciles');
    assert.ok(state.prizeTicketsRedeemed<=state.prizeTicketsIssued,'90-day tickets never overdraw');
    assert.equal(state.history.at(-1).prizeStockValue,report.prizeStockValue,'90-day prize use is retained in operating history');
    assert.equal(state.history.at(-1).prizeRedemptions,report.prizeRedemptions,'90-day redemption count is retained in operating history');
    assert.ok(Object.values(state.prizeInventory).every(n=>n>=0),'90-day stock never negative');
    assert.equal(state.cashLedger.at(-1).balance,state.cash,'latest cash activity shows actual cash');
    assert.ok(state.cashLedger.length<=30,'cash activity is bounded');
    for(let i=1;i<state.cashLedger.length;i++)assert.equal(state.cashLedger[i].balance,state.cashLedger[i-1].balance+state.cashLedger[i].amount,'cash activity reconciles across purchases and days');
    totalPlays+=report.plays;totalSupport+=report.support;totalGross+=report.gross;totalOperating+=report.operating;
    if([40,60,90].includes(day+1))cashByDay[day+1]=state.cash;
  }
  return {cash:game.state().cash,cashByDay,gross:totalGross,operating:totalOperating,plays:totalPlays,support:totalSupport,stockSpend,achievements:game.state().achievements.length};
}
for(const seed of [11,29,71]){
  const single=longRun(seed,'single'),mixed=longRun(seed,'mixed'),high=longRun(seed,'high'),prizes=longRun(seed,'prizes'),three=longRun(seed,'three'),threePrizes=longRun(seed,'three-prizes');
  assert.ok(mixed.gross>single.gross,'two maintained cabinets produce more gross than one');
  assert.equal(high.gross,0,'unaffordable prices produce no revenue in 90-day mixed scenario');
  assert.ok(prizes.stockSpend>0,'prize strategy bought game-cash stock');
  assert.ok(three.gross>mixed.gross,'three maintained cabinets produce more gross than two');
  assert.ok(threePrizes.cashByDay[90]>three.cashByDay[90],'stocked counter pays back in 90-day three-cabinet seeded scenario');
  console.log('BALANCE seed '+seed+' '+JSON.stringify({single,mixed,high,prizes,three,threePrizes}));
}
for(const seed of [11,29]){
  const lean=longRun(seed,'three-prizes-lean'),eager=longRun(seed,'three-prizes-eager');
  assert.ok(lean.stockSpend>0&&eager.stockSpend>0,'both restocking cadences purchase stock');
  assert.ok(lean.cash>=0&&eager.cash>=0,'restocking cadence comparisons remain solvent or receive explicit support');
  console.log('CADENCE seed '+seed+' '+JSON.stringify({lean,eager}));
}
console.log('PASS: migration/reload/corruption, deterministic accounting/event, placement, purchases, repair, pricing, broken cabinet, 35 days');
