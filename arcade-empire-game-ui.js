/* Mobile-first game navigation. Presentation only: do not alter simulation or saved data. */
(()=>{'use strict';function init(){
const floor=document.getElementById('floor'),open=document.getElementById('open'),wrap=document.querySelector('main.wrap'),columns=document.querySelector('.columns');
if(!floor||!open||!wrap||!columns)return;
const main=floor.closest('section.panel');
const find=id=>document.getElementById(id)?.closest('section.panel');
const screenWrap=document.createElement('div');screenWrap.className='game-screens';columns.before(screenWrap);
const screens={};for(const name of ['Play','Machines','Build','Staff','Goals']){const s=document.createElement('section');s.className='game-screen';s.id='game-screen-'+name.toLowerCase();s.setAttribute('aria-label',name+' screen');s.hidden=name!=='Play';screenWrap.append(s);screens[name]=s;}
const controls=open.parentElement;main.insertBefore(controls,document.getElementById('dayReport').nextSibling);
// Move interactive DOM nodes, preserving all IDs and game event listeners.
screens.Play.append(main);
const machines=document.getElementById('machines'),machineTitle=machines?.previousElementSibling;
if(machineTitle?.tagName==='H3')screens.Machines.append(machineTitle);
if(machines)screens.Machines.append(machines);
for(const el of [document.getElementById('analyticsTitle')?.closest('section'),document.getElementById('cashFlowTitle')?.closest('section')])if(el)screens.Machines.append(el);
const plans=document.querySelector('.opening-plans');if(plans)screens.Staff.append(plans);
for(const [name,ids] of [['Build',['market','prizeStock']],['Staff',['upgrades']],['Goals',['milestones','lastEvent','log','export']]]){
for(const id of ids){const el=document.getElementById(id);const panel=el?.closest('section.panel');if(panel&&panel!==main&&panel.parentElement!==screens[name])screens[name].append(panel);}
}
const premium=[...document.querySelectorAll('section.panel')].find(x=>x.textContent.includes('Future Premium Shop'));
if(premium&&!screens.Goals.contains(premium))screens.Goals.append(premium);
const labels={Play:'Run your arcade',Machines:'Manage machines',Build:'Grow your business',Staff:'Operations',Goals:'Milestones & progress'};
for(const [key,node] of Object.entries(screens)){if(key!=='Play'){const title=document.createElement('h2');title.className='screen-heading';title.textContent=labels[key];node.prepend(title);}}
// Move secondary economy actions into Build; leave the primary Open button on Play.
const buildActions=document.createElement('section');buildActions.className='panel quick-build-actions';buildActions.innerHTML='<h2>Supplies & expansion</h2><div class="actions"></div>';
for(const id of ['supply','advert','expand']){const button=document.getElementById(id);if(button)buildActions.querySelector('.actions').append(button);}
screens.Build.prepend(buildActions);
columns.remove();
const dock=document.createElement('nav');dock.className='game-dock';dock.setAttribute('aria-label','Game screens');
const choices=[['🎮','Play'],['🕹️','Machines'],['🛒','Build'],['🔧','Staff'],['🏆','Goals']];
function select(name){for(const [key,node] of Object.entries(screens))node.hidden=key!==name;for(const b of dock.querySelectorAll('button')){b.setAttribute('aria-current',String(b.dataset.screen===name));}window.scrollTo({top:0,behavior:'instant'});}
for(const [icon,name] of choices){const b=document.createElement('button');b.type='button';b.dataset.screen=name;b.innerHTML='<span class="nav-icon" aria-hidden="true">'+icon+'</span>'+name;b.addEventListener('click',()=>select(name));dock.append(b);}
document.body.append(dock);select('Play');
const report=document.getElementById('dayReport');if(report&&'MutationObserver'in window){let prior=report.textContent;new MutationObserver(()=>{const next=report.textContent;if(next===prior)return;prior=next;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const amount=next.match(/\$[\d,]+\s+sales/);if(!amount)return;const pop=document.createElement('div');pop.className='game-feedback';pop.textContent='💰 '+amount[0].replace(' sales','')+' EARNED';document.body.append(pop);setTimeout(()=>pop.remove(),1350);}).observe(report,{childList:true,subtree:true,characterData:true});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
