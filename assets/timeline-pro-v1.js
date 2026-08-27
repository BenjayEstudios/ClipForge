(()=>{
const $=id=>document.getElementById(id);
const api=window.clipforge; if(!api?.state)return;
const state=api.state;
const video=$('video');
const log=(m,d={})=>console.log('[ClipForge] TIMELINE',m,d);
state.tracks=state.tracks||[
 {id:'video-1',type:'video',name:'VIDEO 1',locked:false},
 {id:'audio-1',type:'audio',name:'AUDIO 1',locked:false},
 {id:'text-1',type:'text',name:'TEXTO 1',locked:false}
];
state.waveforms=state.waveforms||{};
state.audioElements=state.audioElements||{};

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function ensureTrack(type,name){const t={id:crypto.randomUUID(),type,name:name||`${type.toUpperCase()} ${state.tracks.filter(x=>x.type===type).length+1}`,locked:false};state.tracks.push(t);return t}
function findTrack(id){return state.tracks.find(t=>t.id===id)}
function itemTrack(c){if(c.trackId)return c.trackId;const t=state.tracks.find(x=>x.type===c.kind);if(t){c.trackId=t.id;return t.id}return ''}
function laneForTrack(tid){return document.querySelector(`[data-track-id="${tid}"] .lane`)||document.querySelector(`[data-track-id="${tid}"]`)?.querySelector('.lane')}
function secondsFromX(e,lane){const r=lane.getBoundingClientRect();return Math.max(0,Math.min(state.duration,((e.clientX-r.left)/Math.max(1,r.width))*state.duration))}
function ensureLinkedAudio(){
 if(!state.video||!state.duration)return;
 let seg=state.segments.find(c=>c.kind==='audio'&&c.linkedVideoId===state.videoId);
 const at=state.tracks.find(t=>t.type==='audio')||ensureTrack('audio','AUDIO 1');
 if(!seg){seg={id:crypto.randomUUID(),sourceId:state.videoId,linkedVideoId:state.videoId,kind:'audio',start:0,end:state.duration,name:'Audio del video',volume:1,sourceKind:'video-linked',trackId:at.id};state.segments.push(seg)}else seg.trackId=at.id;
 state.audioElement=state.audioElement||null;
 if(!state.audioElement||state.audioElement.src!==state.videoUrl){try{state.audioElement?.pause()}catch{};const a=new Audio();a.preload='auto';a.src=state.videoUrl;a.crossOrigin='anonymous';state.audioElement=a;state.audioUrl=state.videoUrl;a.onloadedmetadata=()=>{state.audioDuration=a.duration||state.duration;render();};}
 video.muted=true;
 log('LINKED_AUDIO_CREATED',{trackId:at.id});
}
async function buildWaveform(src,id){
 try{
  const resp=await fetch(src); const buf=await resp.arrayBuffer();
  const Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx)throw new Error('WebAudio unavailable');
  const ctx=new Ctx(); const audio=await ctx.decodeAudioData(buf.slice(0));
  const ch=audio.getChannelData(0), bars=180, block=Math.max(1,Math.floor(ch.length/bars)), peaks=[];
  for(let i=0;i<bars;i++){let peak=0;const a=i*block,b=Math.min(ch.length,a+block);for(let j=a;j<b;j++){const v=Math.abs(ch[j]);if(v>peak)peak=v}peaks.push(peak)}
  state.waveforms[id]=peaks;try{await ctx.close()}catch{};render();log('WAVEFORM_READY',{id,bars});
 }catch(e){log('WAVEFORM_FAILED',{message:e.message})}
}
function renderTracks(){
 const body=$('tracks'); if(!body)return;
 const old=body.querySelectorAll('.track-row');old.forEach(x=>x.remove());
 const before=body.querySelector('#silenceLayer');
 state.tracks.forEach((t,idx)=>{
  const row=document.createElement('div');row.className='track-row';row.dataset.track=t.type;row.dataset.trackId=t.id;
  row.innerHTML=`<div class="track-label"><span class="track-icon ${esc(t.type)}">${t.type==='video'?'▸':t.type==='audio'?'♪':'T'}</span><div><b>${esc(t.name)}</b><small>${t.type==='video'?'video':t.type==='audio'?'voz · música':'títulos · subtítulos'}</small></div><button class="track-state" title="${t.locked?'Desbloquear':'Bloquear'} pista">${t.locked?'🔒':'♙'}</button></div><div class="lane"></div>`;
  row.querySelector('.track-state').onclick=e=>{e.stopPropagation();t.locked=!t.locked;render()};
  row.querySelector('.lane').ondragover=e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'};
  row.querySelector('.lane').ondrop=e=>{e.preventDefault();dropMedia(e,t)};
  if(before)body.insertBefore(row,before);else body.appendChild(row);
 });
 renderClips();
}
function waveformHTML(c){const p=state.waveforms[c.sourceId]||state.waveforms[c.linkedVideoId];if(!p)return '<div class="audio-wave placeholder">'+Array.from({length:48},()=>'<i style="height:5px"></i>').join('')+'</div>';return '<div class="audio-wave real">'+p.map(v=>`<i style="height:${Math.max(2,Math.round(v*34))}px"></i>`).join('')+'</div>'}
function thumbsHTML(c){if(c.kind!=='video'||!state.thumbnails?.length)return '';return '<div class="thumb-strip">'+state.thumbnails.map(x=>`<img src="${x}">`).join('')+'</div>'}
function clip(c){const el=document.createElement('div');const len=Math.max(.01,c.end-c.start);el.className=`clip ${c.kind}`+(c.id===state.selected?' selected':'');el.dataset.id=c.id;el.style.left=`${state.duration?c.start/state.duration*100:0}%`;el.style.width=`${state.duration?Math.max(.35,len/state.duration*100):5}%`;el.innerHTML=`${thumbsHTML(c)}${c.kind==='audio'?waveformHTML(c):''}<span class="handle left"></span><span class="clip-label">${c.kind==='audio'?'♪ '+esc(c.name||'Audio'):c.kind==='text'?esc(c.text||'Texto'):esc(c.name||'Video')}</span><span class="handle right"></span>`;
 el.onclick=e=>{e.stopPropagation();state.selected=c.id;state.selectedSilence=null;api.updateInspector();renderClips()};
 el.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();state.selected=c.id;state.selectedSilence=null;api.updateInspector();window.dispatchEvent(new CustomEvent('clipforge-context',{detail:{x:e.clientX,y:e.clientY,item:c}}))};
 const left=el.querySelector('.left'),right=el.querySelector('.right');left.onmousedown=e=>{e.stopPropagation();resize(e,c,'start')};right.onmousedown=e=>{e.stopPropagation();resize(e,c,'end')};
 el.onmousedown=e=>{if(e.target.closest('.handle'))return;move(e,c)};
 return el;
}
function renderClips(){state.tracks.forEach(t=>{const lane=laneForTrack(t.id);if(lane)lane.innerHTML=''});[...state.segments,...state.texts].forEach(c=>{const tid=itemTrack(c);const lane=laneForTrack(tid);if(lane)lane.appendChild(clip(c))});}
function renderRuler(){const r=$('ruler');if(!r||!state.duration)return;}
function render(){renderTracks();api.syncUI?.();}
function move(e,c){if(e.button!==0)return;const t=findTrack(itemTrack(c));if(t?.locked)return;const lane=laneForTrack(t?.id)||$('videoLane');if(!lane)return;e.preventDefault();const before=api.snapshot();const x=e.clientX,orig=c.start,len=c.end-c.start;document.body.classList.add('dragging-clip');const mv=ev=>{let ns=orig+((ev.clientX-x)/Math.max(1,lane.getBoundingClientRect().width))*state.duration;if(!ev.shiftKey&&state.snap){const pts=[0,state.duration,...state.segments.flatMap(z=>[z.start,z.end])];let best=ns,bd=.1;pts.forEach(p=>{const d=Math.abs(p-ns);if(d<bd){bd=d;best=p}});ns=best}ns=Math.max(0,Math.min(state.duration-len,ns));c.start=ns;c.end=ns+len;renderClips();};const up=()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up);document.body.classList.remove('dragging-clip');if(Math.abs(c.start-orig)>.001){state.history.push(before);state.future=[];api.refreshButtons();}render();};window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);}
function resize(e,c,edge){const t=findTrack(itemTrack(c));if(t?.locked)return;const lane=laneForTrack(t?.id);if(!lane)return;const before=api.snapshot(),old=c[edge];const mv=ev=>{const tt=secondsFromX(ev,lane);if(edge==='start')c.start=Math.min(tt,c.end-.05);else c.end=Math.max(tt,c.start+.05);renderClips()};const up=()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up);if(c[edge]!==old){state.history.push(before);state.future=[];api.refreshButtons()}render()};window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);}
function dropMedia(e,t){if(t.locked)return;const id=e.dataTransfer.getData('text/clipforge-media');if(!id)return;const m=state.media.find(x=>x.id===id);if(!m)return;const lane=e.currentTarget,start=secondsFromX(e,lane);if(m.kind==='audio'){const len=Math.min(state.duration-start,state.audioDuration||state.duration);const c={id:crypto.randomUUID(),sourceId:m.id,kind:'audio',start,end:start+len,name:m.name,volume:state.audioVolume,trackId:t.id,sourceKind:m.sourceKind||'audio'};state.segments.push(c);buildWaveform(m.url,m.id)}else if(m.kind==='video'){const len=Math.min(5,state.duration-start);state.segments.push({id:crypto.randomUUID(),sourceId:m.id,kind:'video',start,end:start+len,name:m.name,trackId:t.id});}api.renderAll();}
function install(){
 ensureLinkedAudio();
 window.clipforge.renderTracks=renderTracks;window.clipforge.renderTimeline=render;window.clipforge.ensureLinkedAudio=ensureLinkedAudio;
 const originalSet=setInterval(()=>{if(state.videoId){ensureLinkedAudio();render();clearInterval(originalSet)}},300);
 if(state.videoUrl)buildWaveform(state.videoUrl,state.videoId);
 document.querySelectorAll('.media-item').forEach(()=>{});
 const obs=new MutationObserver(()=>{document.querySelectorAll('.media-item').forEach(el=>{if(el.dataset.proV1)return;el.dataset.proV1='1';el.draggable=true})});obs.observe($('mediaList')||document.body,{childList:true,subtree:true});
 document.addEventListener('dragstart',e=>{if(e.target.closest('.media-item')){const m=state.media.find(x=>x.id===e.target.closest('.media-item').dataset.id);if(m)e.dataTransfer.setData('text/clipforge-media',m.id)}});
 window.addEventListener('clipforge-context',e=>{const c=e.detail.item;if(!c)return;const menu=$('contextMenu');if(menu){menu.innerHTML=`<button>▶ Reproducir desde aquí</button><button>✂ Dividir</button><button>Duplicar</button><button>Recortar inicio</button><button>Recortar final</button><div class="sep"></div><button class="danger">Eliminar</button>`;const bs=[...menu.querySelectorAll('button')];bs[0].onclick=()=>api.seek(c.start);bs[1].onclick=()=>{document.querySelector('#splitBtn')?.click();menu.classList.add('hidden')};bs[2].onclick=()=>{const n={...c,id:crypto.randomUUID(),start:Math.min(state.duration,c.end+.02),end:Math.min(state.duration,c.end+.02+(c.end-c.start))};if(c.kind==='text')state.texts.push(n);else state.segments.push(n);api.renderAll();menu.classList.add('hidden')};bs[3].onclick=()=>{api.seek(c.end);api.renderAll();menu.classList.add('hidden')};bs[4].onclick=()=>{api.seek(c.start);api.renderAll();menu.classList.add('hidden')};bs[6].onclick=()=>{state.selected=c.id;document.querySelector('#deleteBtn')?.click();menu.classList.add('hidden')};menu.classList.remove('hidden');menu.style.left=Math.min(e.detail.x,innerWidth-220)+'px';menu.style.top=Math.min(e.detail.y,innerHeight-230)+'px'}});
 log('READY',{dynamicTracks:true,linkedAudio:true,realWaveform:true});
}
install();
})();
