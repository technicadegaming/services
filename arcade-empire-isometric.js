/* Isometric presentation adapter for Arcade Empire.
   Positions the existing accessible floor buttons, preserving their game handlers,
   save format, keyboard support, repair badges, and visitor replay. */
(function(){
'use strict';
const floor=document.getElementById('floor');
if(!floor)return;
const COLS=7,ROWS=5;
let scheduled=false;
function layout(){
 scheduled=false;
 const dock=document.querySelector('.game-dock');
 const controls=document.getElementById('open')?.parentElement;
 if(window.innerWidth<=780&&dock&&controls&&!document.getElementById('game-screen-play')?.hidden){
  const top=floor.getBoundingClientRect().top;
  const dockTop=dock.getBoundingClientRect().top;
  const controlHeight=controls.getBoundingClientRect().height;
  const activity=document.getElementById('floorActivity');
  const activityHeight=activity?.getBoundingClientRect().height||0;
  const replay=document.getElementById('skipReplay');
  const replayHeight=replay&&!replay.hidden?replay.getBoundingClientRect().height:0;
  const room=Math.floor(dockTop-top-controlHeight-activityHeight-replayHeight-20);
  floor.style.setProperty('height',Math.max(155,Math.min(600,room))+'px','important');
 }else floor.style.removeProperty('height');
 const w=floor.clientWidth,h=floor.clientHeight;
 if(w<80||h<80)return;
 const tileW=Math.min((w-18)/6.1,(h-42)/3.3*1.55);
 const tileH=tileW*.52;
 const spanW=(COLS+ROWS-2)*tileW/2+tileW;
 const spanH=(COLS+ROWS-2)*tileH/2+tileH;
 const left0=(w-spanW)/2+ROWS*tileW/2-tileW/2;
 const top0=Math.max(18,(h-spanH)/2)+tileH*.16;
 for(const cell of floor.querySelectorAll('.floor-cell[data-cell]')){
  const n=Number(cell.dataset.cell);
  if(!Number.isInteger(n)||n<0||n>=COLS*ROWS)continue;
  const x=n%COLS,y=Math.floor(n/COLS);
  cell.style.setProperty('--tile-w',tileW+'px');
  cell.style.setProperty('--tile-h',tileH+'px');
  cell.style.setProperty('--left',(left0+(x-y)*tileW/2)+'px');
  cell.style.setProperty('--top',(top0+(x+y)*tileH/2)+'px');
  cell.style.zIndex=String(1+x+y+(cell.classList.contains('cabinet')?1:0));
 }
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(layout)}
floor.classList.add('iso-floor');
const observer=new MutationObserver(schedule);
observer.observe(floor,{childList:true});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(floor);
else window.addEventListener('resize',schedule);
window.addEventListener('orientationchange',schedule);
window.addEventListener('resize',schedule);
window.visualViewport?.addEventListener('resize',schedule);
schedule();
})();
