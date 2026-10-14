/* Game presentation shell: no game state, wallet, or save changes. */
(()=>{'use strict';
function init(){
const floor=document.getElementById('floor'),open=document.getElementById('open');if(!floor||!open)return;
const main=floor.closest('section.panel'),columns=document.querySelector('.columns');if(!main||!columns)return;
const first=columns.children[0],second=columns.children[1];
const controls=open.parentElement;main.insertBefore(controls,document.getElementById('dayReport').nextSibling);
const dock=document.createElement('nav');dock.className='game-dock';dock.setAttribute('aria-label','Game sections');
const getSection=(id)=>document.getElementById(id)?.closest('section')||document.getElementById(id);
const tabs=[['🎮','Play',main],['🕹️','Machines',getSection('machines')],['🛒','Build',getSection('market')],['🔧','Staff',getSection('upgrades')],['🏆','Goals',getSection('milestones')]];
tabs.forEach(([icon,name,target])=>{if(!target)return;const btn=document.createElement('button');btn.type='button';btn.innerHTML='<span class="nav-icon" aria-hidden="true">'+icon+'</span>'+name;btn.setAttribute('aria-label','Go to '+name);btn.addEventListener('click',()=>{dock.querySelectorAll('button').forEach(b=>b.removeAttribute('aria-current'));btn.setAttribute('aria-current','true');target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});dock.append(btn)});dock.firstElementChild?.setAttribute('aria-current','true');document.body.append(dock);
const outcome=document.getElementById('dayReport');if(outcome&&'MutationObserver' in window){let started=false;new MutationObserver(()=>{if(!started){started=true;return;}if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const t=outcome.textContent||'';const m=t.match(/\$[\d,]+\s+sales/);if(!m)return;const pop=document.createElement('div');pop.className='game-feedback';pop.textContent='💰 '+m[0].replace(' sales','')+' EARNED!';document.body.append(pop);setTimeout(()=>pop.remove(),1500)}).observe(outcome,{childList:true,characterData:true,subtree:true});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
