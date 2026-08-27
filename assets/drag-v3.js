(()=>{
const $=id=>document.getElementById(id);
const state=window.clipforgeState;
if(!state||!window.clipforgeRender){console.warn('[ClipForge] Drag system: state/render hook not available');return}
const log=(m,d={})=>console.log('[ClipForge] DRAG '+m,d);
let active=null;
function laneTime(e){const lane=e.target.closest('.lane')||document.querySelector('.lane');if(!lane||!state.duration)return 0;const r=lane.getBoundingClientRect();return Math.max(0,Math.min(state.duration,((e.clientX-r.left)/Math.max(1,r.width))*state.duration));}
function selectedItem(id){return [...state.segments,...state.texts].find(x=>x.id===id)||null}
function snap(t){if(!state.snap)return t;const pts=[0,state.duration,state.playhead,...state.segments.flatMap(c=>[c.start,c.end]),...state.silences.flatMap(s=>[s.start,s.end])];let best=t,dist=.10;for(const p of pts){const d=Math.abs(p-t);if(d<dist){dist=d;best=p}}return best}
function begin(e,c){if(e.button!==0||e.target.closest('.handle'))return;e.preventDefault();e.stopPropagation();active={id:c.id,start:c.start,end:c.end,duration:c.end-c.start,x:e.clientX,last:c.start};state.selected=c.id;state.selectedSilence=null;log('START',{id:c.id,kind:c.kind,start:c.start,end:c.end});document.body.classList.add('dragging-clip');const move=ev=>{if(!active)return;const lane=(c.kind==='text'?$('textLane'):c.kind==='audio'?$('audioLane'):$('videoLane'));const r=lane.getBoundingClientRect();const dt=((ev.clientX-active.x)/Math.max(1,r.width))*state.duration;let ns=snap(active.start+dt);ns=Math.max(0,Math.min(state.duration-active.duration,ns));if(c.kind==='video'||c.kind==='audio'){const sameTrack=state.segments.filter(x=>x.kind===c.kind&&x.id!==c.id);const before=sameTrack.find(x=>ns<x.end&&ns+active.duration>x.start);if(before){if(dt>0)ns=Math.max(0,before.start-active.duration);else ns=Math.min(state.duration-active.duration,before.end)}}c.start=ns;c.end=ns+active.duration;active.last=ns;window.clipforgeRender({timelineOnly:true});};const up=()=>{const changed=Math.abs(active.last-active.start)>.001;document.body.classList.remove('dragging-clip');window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up);if(changed){state.history?.push(state.snapshot?state.snapshot():JSON.stringify({segments:state.segments,texts:state.texts,silences:state.silences}));state.future=[];log('END',{id:c.id,start:c.start,end:c.end})}active=null;window.clipforgeRender({inspector:true});};window.addEventListener('mousemove',move);window.addEventListener('mouseup',up);}
function bind(){document.querySelectorAll('.clip').forEach(el=>{const id=el.dataset.id;const c=selectedItem(id);if(!c||el.dataset.dragBound)return;el.dataset.dragBound='1';el.addEventListener('mousedown',e=>begin(e,c));el.addEventListener('dragstart',e=>e.preventDefault())})}
window.clipforgeBindDrag=bind;
new MutationObserver(()=>requestAnimationFrame(bind)).observe($('videoLane')||document.body,{childList:true,subtree:true});
new MutationObserver(()=>requestAnimationFrame(bind)).observe($('audioLane')||document.body,{childList:true,subtree:true});
new MutationObserver(()=>requestAnimationFrame(bind)).observe($('textLane')||document.body,{childList:true,subtree:true});
log('READY');
})();
