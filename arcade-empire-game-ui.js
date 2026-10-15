/* Mobile-first game navigation. Presentation only: do not alter simulation or saved data. */
(()=>{'use strict';function init(){
const floor=document.getElementById('floor'),open=document.getElementById('open'),wrap=document.querySelector('main.wrap'),columns=document.querySelector('.columns');
if(!floor||!open||!wrap||!columns)return;
const main=floor.closest('section.panel');
const find=id=>document.getElementById(id)?.closest('section.panel');
const screenWrap=document.createElement('div');screenWrap.className='game-screens';columns.before(screenWrap);
const screens={};for(const name of ['Play','Machines','Build','Staff','Goals','Reports']){const s=document.createElement('section');s.className='game-screen';s.id='game-screen-'+name.toLowerCase();s.setAttribute('aria-label',name+' screen');s.hidden=name!=='Play';screenWrap.append(s);screens[name]=s;}
const controls=open.parentElement;
main.insertBefore(controls,document.getElementById('floorActivity'));
const daysControl=document.createElement('label');daysControl.className='days-choice';daysControl.textContent='Operate for ';
const daysSelect=document.createElement('select');daysSelect.setAttribute('aria-label','Number of business days');
for(const n of [1,5,10,50,100]){const opt=document.createElement('option');opt.value=String(n);opt.textContent=n+' '+(n===1?'day':'days');daysSelect.append(opt);}
daysControl.append(daysSelect);controls.insertBefore(daysControl,open);
open.addEventListener('click',event=>{const days=Number(daysSelect.value);if(days===1)return;event.stopImmediatePropagation();event.preventDefault();
if(days>=50&&!confirm('Operate for '+days+' days? Operating costs and machine wear will apply each day.'))return;
stopAnimation();let totalNet=0;
for(let i=0;i<days;i++){simulateDay();totalNet+=s.lastDay.net;}
commit();const notice=document.getElementById('floorActivity');
if(notice)notice.textContent=days+' days completed. Net result: '+money(totalNet)+'. See Reports for details.';
toast('Operated '+days+' days. Net '+money(totalNet));},true);
// Move interactive DOM nodes, preserving all IDs and game event listeners.
screens.Play.append(main);
const machines=document.getElementById('machines'),machineTitle=machines?.previousElementSibling;
const manager=document.createElement('div');manager.className='arcade-management-tools';
manager.innerHTML='<input id="arcadeMachineSearch" type="search" aria-label="Search machines" placeholder="Find a game..."><select id="arcadeMachineFilter" aria-label="Machine filter"><option value="all">All machines</option><option value="broken">Broken</option><option value="worn">Needs repair</option><option value="healthy">Healthy</option></select><button type="button" id="arcadeRepairAll">🔧 Repair available</button><small id="arcadeRepairSummary"></small>';
screens.Machines.append(manager);
let machineSearch='',machineFilter='all';
function filterMachineCards(){
 if(!machines)return;
 let visible=0;
 for(const card of machines.querySelectorAll('.machine')){
  const name=(card.querySelector('h3')?.textContent||'').toLowerCase();
  const tag=card.querySelector('.tag')?.textContent||'';
  const condition=Number((tag.match(/(\\d+)%/)||[])[1]);
  const matches=(!machineSearch||name.includes(machineSearch))&&(machineFilter==='all'||(machineFilter==='broken'&&condition<25)||(machineFilter==='worn'&&condition<45)||(machineFilter==='healthy'&&condition>=45));
  card.hidden=!matches;if(matches)visible++;
 }
 const summary=manager.querySelector('#arcadeRepairSummary');
 const actionable=s.owned.filter(m=>m.condition<100).length;
 summary.textContent=visible+' shown · '+actionable+' need servicing · '+s.parts+' parts';
 const button=manager.querySelector('#arcadeRepairAll');
 button.disabled=!s.parts||s.cash<(s.upgrades.includes('tools')?38:50)||!actionable;
}
manager.querySelector('#arcadeMachineSearch').addEventListener('input',e=>{machineSearch=e.target.value.toLowerCase();filterMachineCards()});
manager.querySelector('#arcadeMachineFilter').addEventListener('change',e=>{machineFilter=e.target.value;filterMachineCards()});
manager.querySelector('#arcadeRepairAll').addEventListener('click',()=>{
 const cost=s.upgrades.includes('tools')?38:50;
 let count=0;
 for(const machine of [...s.owned].sort((a,b)=>a.condition-b.condition)){
  if(s.parts<1||s.cash<cost)break;
  if(machine.condition>=100)continue;
  repair(machine.uid);count++;
 }
 toast(count?'Serviced '+count+' machines.':'Need cash and spare parts to repair.');
 filterMachineCards();
});
new MutationObserver(()=>requestAnimationFrame(filterMachineCards)).observe(machines,{childList:true});

if(machineTitle?.tagName==='H3')screens.Machines.append(machineTitle);
if(machines)screens.Machines.append(machines);
for(const el of [document.getElementById('analyticsTitle')?.closest('section'),document.getElementById('cashFlowTitle')?.closest('section')])if(el)screens.Reports.append(el);
const plans=document.querySelector('.opening-plans');if(plans)screens.Staff.append(plans);
for(const [name,ids] of [['Build',['market','prizeStock']],['Staff',['upgrades']],['Goals',['milestones','lastEvent','export']],['Reports',['log']]]){
for(const id of ids){const el=document.getElementById(id);const panel=el?.closest('section.panel');if(panel&&panel!==main&&panel.parentElement!==screens[name])screens[name].append(panel);}
}
const premium=[...document.querySelectorAll('section.panel')].find(x=>x.textContent.includes('Future Premium Shop'));
if(premium&&!screens.Goals.contains(premium))screens.Goals.append(premium);
const labels={Play:'Run your arcade',Machines:'Manage machines',Build:'Grow your business',Staff:'Operations',Goals:'Milestones & progress',Reports:'Business reports'};
for(const [key,node] of Object.entries(screens)){if(key!=='Play'){const title=document.createElement('h2');title.className='screen-heading';title.textContent=labels[key];node.prepend(title);}}
// Move secondary economy actions into Build; leave the primary Open button on Play.
const buildActions=document.createElement('section');buildActions.className='panel quick-build-actions';buildActions.innerHTML='<h2>Supplies & expansion</h2><div class="actions"></div>';
for(const id of ['supply','advert','expand']){const button=document.getElementById(id);if(button)buildActions.querySelector('.actions').append(button);}
screens.Build.prepend(buildActions);
// Satellite locations unlock after players have learned the core arcade economy.
const satellitePanel=document.createElement('section');
satellitePanel.className='panel satellite-panel';
satellitePanel.innerHTML='<h2>🏪 Your arcade network</h2><p id="satelliteStatus" class="sub">Build your first arcade into a franchise.</p><button type="button" id="satelliteBuy">Open satellite arcade</button><p class="sub">Select any location to manage its own cabinets, floor expansion, spare parts, and technicians. Other locations contribute background earnings.</p>';
screens.Build.append(satellitePanel);
const network=document.createElement('div');network.className='arcade-network-list';satellitePanel.append(network);
function updateNetwork(){
 network.replaceChildren();
 for(let i=0;i<=s.locations;i++){
  const el=document.createElement('article');el.className='arcade-location-card';
  const current=i===s.activeLocation;
  const data=current?s:s.branches?.[i];
  const n=data?.owned?.length??1;
  const header=document.createElement('strong');header.textContent='🏬 '+(i?'Satellite Arcade '+i:'Original Arcade');
  const status=document.createElement('span');status.textContent=n+' cabinets · '+(data?.workers||0)+' technicians'+(current?' · Current location':'');
  const button=document.createElement('button');button.type='button';button.textContent=current?'Managing this location':'Manage this arcade';button.disabled=current;
  button.addEventListener('click',()=>{switchLocation(i);select('Play')});
  el.append(header,status,button);network.append(el);
 }
}
const staffPanel=document.createElement('section');staffPanel.className='panel arcade-staff-team';
staffPanel.innerHTML='<h2>👷 Maintenance team</h2><p class="sub">Hire technicians to service the most damaged machines automatically whenever you operate a day. Repairs consume cash and parts. Workers can reorder a parts pack when funds allow.</p><div class="arcade-staff-actions"><button type="button" id="hireArcadeWorker">Hire technician — $450</button><button type="button" id="reduceArcadeWorker">Release technician</button></div><p id="arcadeWorkerCount" role="status"></p>';
screens.Staff.prepend(staffPanel);
staffPanel.querySelector('#hireArcadeWorker').addEventListener('click',()=>hireWorker());
staffPanel.querySelector('#reduceArcadeWorker').addEventListener('click',()=>fireWorker());
function updateStaffUI(){
 staffPanel.querySelector('#arcadeWorkerCount').textContent=s.workers+' hired · '+(s.staffOn?'active':'shifts paused')+' · $24/day per technician + repairs. '+(s.lastDay?s.lastDay.serviced+' repairs completed last day.':'');
 staffPanel.querySelector('#hireArcadeWorker').disabled=s.workers>=8||s.cash<450;
 staffPanel.querySelector('#reduceArcadeWorker').disabled=s.workers<1;
 updateNetwork();
}
new MutationObserver(()=>requestAnimationFrame(updateStaffUI)).observe(document.getElementById('stats'),{childList:true});
requestAnimationFrame(updateStaffUI);

satellitePanel.querySelector('#satelliteBuy').addEventListener('click',()=>buyLocation());
// The initial core render happens before the mobile shell exists.
requestAnimationFrame(()=>render());

columns.remove();
const dock=document.createElement('nav');dock.className='game-dock';dock.setAttribute('aria-label','Game screens');
const choices=[['🎮','Play'],['🕹️','Machines'],['🛒','Build'],['🔧','Staff'],['🏆','Goals'],['📊','Reports']];
function select(name){for(const [key,node] of Object.entries(screens))node.hidden=key!==name;for(const b of dock.querySelectorAll('button')){b.setAttribute('aria-current',String(b.dataset.screen===name));}window.scrollTo({top:0,behavior:'instant'});}
for(const [icon,name] of choices){const b=document.createElement('button');b.type='button';b.dataset.screen=name;b.innerHTML='<span class="nav-icon" aria-hidden="true">'+icon+'</span>'+name;b.addEventListener('click',()=>select(name));dock.append(b);}
document.body.append(dock);select('Play');
// Size the floor from the actual viewport and the space reserved for the controls and dock.
function fitPlayScreen(){
 if(window.innerWidth>780){floor.style.removeProperty('height');return;}
 const dockTop=dock.getBoundingClientRect().top;
 const floorTop=floor.getBoundingClientRect().top;
 const activity=document.getElementById('floorActivity');
 const reserve=controls.getBoundingClientRect().height+(activity?.getBoundingClientRect().height||0)+24;
 const available=Math.floor(dockTop-floorTop-reserve);
 floor.style.height=Math.max(145,Math.min(510,available))+'px';
}
requestAnimationFrame(fitPlayScreen);
window.addEventListener('resize',fitPlayScreen);
window.addEventListener('orientationchange',()=>requestAnimationFrame(fitPlayScreen));
const report=document.getElementById('dayReport');
// Directly expose detailed results on the Reports screen, not inside the play viewport.
if(report){const details=document.createElement('div');details.className='game-report-panel';details.innerHTML='<h2>Last day results</h2>';report.parentElement.insertBefore(details,report);details.append(report);screens.Reports.prepend(details);}
// Tapping a flagged cabinet opens an immediate, accessible repair panel.
const modal=document.createElement('div');modal.className='cabinet-modal';modal.hidden=true;modal.innerHTML='<div class="cabinet-modal-backdrop"></div><section class="cabinet-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="cabinet-modal-title"><h2 id="cabinet-modal-title">Machine needs attention</h2><p id="cabinet-modal-details"></p><div class="cabinet-modal-actions"><button type="button" data-cabinet-repair>🔧 Repair machine</button><button type="button" data-cabinet-parts hidden>📦 Order 3 parts ($75)</button><button type="button" data-cabinet-manage>More options</button><button type="button" data-cabinet-close>Not now</button></div></section>';
document.body.append(modal);
let selectedUid=null,priorFocus=null;
function dismiss(){modal.hidden=true;selectedUid=null;if(priorFocus&&priorFocus.isConnected)priorFocus.focus();}
modal.querySelector('[data-cabinet-close]').addEventListener('click',dismiss);
modal.querySelector('.cabinet-modal-backdrop').addEventListener('click',dismiss);
modal.addEventListener('keydown',ev=>{if(ev.key==='Escape'){ev.preventDefault();dismiss();}if(ev.key==='Tab'){const items=[...modal.querySelectorAll('button:not([disabled])')];const at=items.indexOf(document.activeElement);if(ev.shiftKey&&at===0){ev.preventDefault();items[items.length-1].focus();}else if(!ev.shiftKey&&at===items.length-1){ev.preventDefault();items[0].focus();}}});
modal.querySelector('[data-cabinet-manage]').addEventListener('click',()=>{dismiss();select('Machines');});
const repairButton=modal.querySelector('[data-cabinet-repair]');
const orderButton=modal.querySelector('[data-cabinet-parts]');
orderButton.addEventListener('click',()=>{if(s.cash>=75){document.getElementById('supply').click();showIssue(selectedUid);}else{toast('Need $75 in game cash to order spare parts.');}});
repairButton.addEventListener('click',()=>{if(selectedUid===null)return;const uid=selectedUid;const machine=s.owned.find(x=>x.uid===uid);if(!machine)return dismiss();const oldCondition=machine.condition;repair(uid);if(machine.condition>oldCondition){dismiss();const hint=document.getElementById('objective');if(hint)hint.setAttribute('aria-live','polite');}else showIssue(uid);});
function showIssue(uid){const machine=s.owned.find(x=>x.uid===uid);if(!machine)return;selectedUid=uid;const broken=machine.condition<25,low=machine.condition<45;const price=s.upgrades.includes('tools')?38:50;
const name=item(machine.id).name;modal.querySelector('#cabinet-modal-title').textContent=(broken?'🚨 Broken: ':'⚠ Maintenance: ')+name;
modal.querySelector('#cabinet-modal-details').textContent='Condition '+machine.condition+'%. '+(broken?'Customers cannot play this cabinet until repaired.':'Repair soon to keep customers happy.')+' Repairs restore 40% condition and cost 1 spare part + '+money(price)+'. You have '+s.parts+' parts and '+money(s.cash)+'.';
repairButton.disabled=machine.condition>=100||s.parts<1||s.cash<price;
orderButton.hidden=s.parts>0;orderButton.disabled=s.cash<75;
repairButton.textContent=repairButton.disabled?(s.parts<1?'Need spare parts':s.cash<price?'Not enough cash':'Repair unavailable'):'🔧 Repair now';
modal.hidden=false;repairButton.disabled?(orderButton.hidden||orderButton.disabled?modal.querySelector('[data-cabinet-manage]'):orderButton).focus():repairButton.focus();}
floor.addEventListener('click',event=>{const tile=event.target.closest('.floor-cell.needs-attention');if(!tile)return;const pos=Number(tile.dataset.cell),machine=s.owned.find(x=>x.pos===pos);if(!machine)return;priorFocus=tile;showIssue(machine.uid);});

// Explain blockers in context instead of silently disabling actions.
const help=document.createElement('aside');
help.className='arcade-next-action';
help.setAttribute('role','status');
help.setAttribute('aria-live','polite');
const objective=document.getElementById('objective');
objective?.after(help);
function updateNextAction(){
 const broken=s.owned.filter(m=>m.condition<25).length;
 const worn=s.owned.filter(m=>m.condition>=25&&m.condition<45).length;
 const needParts=s.parts===0&&(broken||worn);
 const full=s.owned.length>=s.capacity;
 const expandMax=s.capacity>=50;
 let message='',action='',fn=null;
 if(needParts){
  message='📦 Out of spare parts — '+broken+' broken and '+worn+' worn machines need service. Buy 3 parts for $75 under Build, then tap a warning on the floor to repair.';
  action=s.cash>=75?'Buy 3 parts — $75':'Open Build for supplies';
  fn=()=>{if(s.cash>=75)document.getElementById('supply')?.click();else select('Build')};
 }else if(full){
  message=expandMax?'🏁 Current expanded arcade limit reached ('+s.owned.length+' cabinets). Additional games cannot be purchased until a larger-location expansion is developed. Existing games can still be repaired and upgraded.':'🏗 All '+s.capacity+' cabinet slots are occupied. Expand the floor under Build before purchasing another game.';
  action=expandMax?'Manage cabinets':'Go to floor expansion';
  fn=()=>select(expandMax?'Machines':'Build');
 }else if(broken){
  message='🔧 '+broken+' cabinet'+(broken===1?' is':'s are')+' broken and cannot earn. Tap a ! on the arcade floor to repair.';
  action='View arcade';fn=()=>select('Play');
 }
 if(!message){help.hidden=true;return}
 help.hidden=false;
 let label=help.querySelector('span'),button=help.querySelector('button');
 if(!label){label=document.createElement('span');button=document.createElement('button');button.type='button';help.append(label,button)}
 if(label.textContent!==message)label.textContent=message;
 if(button.textContent!==action)button.textContent=action;
 button.onclick=fn;
}
let helpScheduled=false;
function scheduleHelp(){if(helpScheduled)return;helpScheduled=true;requestAnimationFrame(()=>{helpScheduled=false;updateNextAction()})}
new MutationObserver(scheduleHelp).observe(document.getElementById('stats'),{childList:true,subtree:true,characterData:true});
scheduleHelp();

if(report&&'MutationObserver'in window){let prior=report.textContent;let lastFeedbackAt=0;let activeFeedback=null;new MutationObserver(()=>{const next=report.textContent;if(next===prior)return;prior=next;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const amount=next.match(/\$[\d,]+\s+sales/);if(!amount)return;const now=Date.now();if(now-lastFeedbackAt<1600)return;lastFeedbackAt=now;if(activeFeedback)activeFeedback.remove();const pop=document.createElement('div');pop.className='game-feedback';pop.textContent='💰 '+amount[0].replace(' sales','')+' EARNED';document.body.append(pop);activeFeedback=pop;setTimeout(()=>{pop.remove();if(activeFeedback===pop)activeFeedback=null},1150);}).observe(report,{childList:true,subtree:true,characterData:true});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
