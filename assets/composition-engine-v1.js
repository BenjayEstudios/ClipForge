(()=>{
'use strict';
const boot=()=>{
 const legacy=window.clipforge;
 if(!legacy?.state){setTimeout(boot,250);return}
 const s=legacy.state;
 const $=id=>document.getElementById(id);
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const uid=()=>crypto.randomUUID();
 const now=()=>performance.now();
 const fmt=t=>{t=Math.max(0,Number(t)||0);return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}.${String(Math.floor((t%1)*10)).padStart(1,'0')}`};
 const toast=m=>legacy.toast?.(m);
 const log=(event,data={})=>console.log('[ClipForge] COMPOSITOR',event,data);
 const composition={
  version:1,
  settings:{width:1080,height:1920,fps:30,background:'#070a0e',snap:true,previewQuality:'auto',masterVolume:1},
  duration:0,playhead:0,playing:false,selectedId:null,selectedTrackId:null,
  media:[],tracks:[],clips:[],markers:[],silences:[],rendering:false,
  history:[],future:[]
 };
 const mediaMap=new Map(),audioPlayers=new Map();
 let raf=0,lastTick=0,booted=false;

 function clone(x){return JSON.parse(JSON.stringify(x))}
 function save(){composition.history.push(clone({tracks:composition.tracks,clips:composition.clips,markers:composition.markers,settings:composition.settings,duration:composition.duration}));if(composition.history.length>50)composition.history.shift();composition.future=[]}
 function restore(x){composition.tracks=x.tracks||[];composition.clips=x.clips||[];composition.markers=x.markers||[];composition.settings={...composition.settings,...(x.settings||{})};composition.duration=x.duration||0;composition.playhead=clamp(composition.playhead,0,composition.duration);publish();render();}
 function ensureTrack(type,name){let t=composition.tracks.find(x=>x.type===type);if(!t){t={id:uid(),type,name,height:type==='audio'?48:54,collapsed:false,locked:false,muted:false,solo:false};composition.tracks.push(t)}return t}
 function trackForClip(c){return composition.tracks.find(t=>t.id===c.trackId)}
 function mediaById(id){return mediaMap.get(id)||composition.media.find(m=>m.id===id)}
 function normalizeMedia(){
  for(const m of s.media||[]){if(!mediaMap.has(m.id)){const item={id:m.id,kind:m.kind,name:m.name,url:m.url,sourceKind:m.sourceKind||m.kind,size:m.size||0};composition.media.push(item);mediaMap.set(item.id,item)}}
  if(s.videoId && s.videoUrl && !mediaMap.has(s.videoId)){const item={id:s.videoId,kind:'video',name:s.video?.name||'Video',url:s.videoUrl,sourceKind:'video'};composition.media.push(item);mediaMap.set(item.id,item)}
  if(s.audioId && s.audioUrl && !mediaMap.has(s.audioId)){const item={id:s.audioId,kind:'audio',name:s.audio?.name||'Audio',url:s.audioUrl,sourceKind:'audio'};composition.media.push(item);mediaMap.set(item.id,item)}
 }
 function migrate(){
  normalizeMedia();
  composition.duration=Math.max(composition.duration,Number(s.duration)||0);
  ensureTrack('video','VIDEO 1');ensureTrack('audio','AUDIO 1');ensureTrack('image','IMAGEN 1');ensureTrack('text','TEXTO 1');
  const source=[...(s.segments||[]),...(s.texts||[])];
  const byId=new Map(composition.clips.map(c=>[c.id,c]));
  for(const c of source){
   const existing=byId.get(c.id);
   if(existing){Object.assign(existing,c);existing.trackId=existing.trackId||composition.tracks.find(t=>t.type===c.kind)?.id||composition.tracks[0].id;continue}
   const kind=c.kind||'video';
   let type=kind==='text'?'text':kind;
   const track=composition.tracks.find(t=>t.id===c.trackId)||composition.tracks.find(t=>t.type===type)||composition.tracks[0];
   const item={...c,id:c.id||uid(),trackId:track.id,start:Number(c.start)||0,end:Number(c.end)||Math.max(Number(c.start)||0,composition.duration),
      sourceId:c.sourceId||null,sourceStart:Number(c.sourceStart)||0,sourceEnd:c.sourceEnd!=null?Number(c.sourceEnd):undefined,
      volume:Number(c.volume??(type==='audio'?.28:1)),opacity:Number(c.opacity??1),scale:Number(c.scale??1),x:Number(c.x??50),y:Number(c.y??50),fadeIn:Number(c.fadeIn||0),fadeOut:Number(c.fadeOut||0),transitionIn:c.transitionIn||null,transitionOut:c.transitionOut||null};
   composition.clips.push(item);
  }
  for(const c of composition.clips){
   if(c.kind==='video'&&s.videoId&&c.sourceId===s.videoId&&!composition.clips.some(x=>x.kind==='audio'&&x.linkedVideoId===s.videoId)){
    const at=composition.tracks.find(t=>t.type==='audio');composition.clips.push({id:uid(),kind:'audio',trackId:at.id,sourceId:s.videoId,linkedVideoId:s.videoId,sourceKind:'video',start:0,end:composition.duration,name:'Audio original · '+(s.video?.name||'Video'),volume:1,fadeIn:0,fadeOut:0,opacity:1,scale:1,x:50,y:50});
   }
  }
  composition.silences=clone(s.silences||[]);
 }
 function publish(){
  s.duration=composition.duration;s.playhead=composition.playhead;s.segments=composition.clips.filter(c=>c.kind!=='text');s.texts=composition.clips.filter(c=>c.kind==='text');s.silences=composition.silences;
  if(composition.clips.find(c=>c.kind==='audio'&&c.linkedVideoId===s.videoId))s.audioVolume=composition.clips.find(c=>c.kind==='audio'&&c.linkedVideoId===s.videoId)?.volume??s.audioVolume;
  s.selected=composition.selectedId;
 }
 function activeClips(t){return composition.clips.filter(c=>t>=c.start&&t<c.end&&!trackForClip(c)?.muted)}
 function visualClip(t){return activeClips(t).filter(c=>['video','image'].includes(c.kind)).sort((a,b)=>composition.tracks.indexOf(trackForClip(b))-composition.tracks.indexOf(trackForClip(a))).pop()||null}
 function audioClips(t){
  const all=activeClips(t).filter(c=>c.kind==='audio');
  const solo=composition.tracks.some(t=>t.type==='audio'&&t.solo);
  return solo?all.filter(c=>trackForClip(c)?.solo):all;
 }
 function urlFor(c){const m=mediaById(c.sourceId);return m?.url||c.url||''}
 function ensureAudio(c){if(c.kind!=='audio')return null;const url=urlFor(c);if(!url)return null;let p=audioPlayers.get(c.id);if(p&&p.src===url)return p;if(p){try{p.pause()}catch{}}
  p=new Audio();p.preload='auto';p.src=url;p.dataset.cfClipVolume=String(c.volume??1);p.volume=clamp(Number(c.volume??1),0,1);audioPlayers.set(c.id,p);return p;
 }
 function syncAudio(){
  const t=composition.playhead,active=audioClips(t),solo=composition.tracks.some(x=>x.type==='audio'&&x.solo),master=composition.settings.masterVolume;
  for(const c of composition.clips.filter(x=>x.kind==='audio')){const p=ensureAudio(c);if(!p)continue;const tr=trackForClip(c),on=active.includes(c)&&!composition.muted&&(!solo||tr?.solo)&&!tr?.muted;if(!on){p.pause();continue}const src=(c.sourceStart||0)+(t-c.start);try{if(Math.abs(p.currentTime-src)>.08)p.currentTime=Math.max(0,src);let vol=Number(c.volume??1)*master;if(c.fadeIn&&t-c.start<c.fadeIn)vol*=clamp((t-c.start)/c.fadeIn,0,1);if(c.fadeOut&&c.end-t<c.fadeOut)vol*=clamp((c.end-t)/c.fadeOut,0,1);p.volume=clamp(vol,0,1);if(composition.playing)p.play().catch(()=>{})}catch{}}
 }
 function setVideoSource(c){const v=$('video');if(!v||!c)return;const url=urlFor(c);if(!url)return;const token=v.dataset.cfSource;
  if(token!==String(c.sourceId)){v.dataset.cfSource=String(c.sourceId);v.src=url;v.load()}
  const src=(c.sourceStart||0)+(composition.playhead-c.start);if(Math.abs((v.currentTime||0)-src)>.08)v.currentTime=Math.max(0,src);v.muted=true;
 }
 function applyVisual(c){const v=$('video');if(v){v.style.objectFit='contain';v.style.opacity=c?.opacity??1;v.style.transform=`scale(${c?.scale??1})`;}
  const overlay=$('textOverlay');if(overlay)overlay.querySelectorAll('[data-compositor-text]').forEach(n=>n.remove());
  for(const t of composition.clips.filter(x=>x.kind==='text'&&composition.playhead>=x.start&&composition.playhead<x.end)){if(!overlay)continue;const el=document.createElement('div');el.dataset.compositorText='1';el.className='compositor-text';el.textContent=t.text||'Texto';el.style.left=`${t.x??50}%`;el.style.top=`${t.y??50}%`;el.style.transform=`translate(-50%,-50%) scale(${t.scale??1})`;el.style.opacity=String(t.opacity??1);el.style.fontSize=`${t.size||54}px`;el.style.color=t.color||'#fff';el.style.fontWeight=t.bold?'800':'700';overlay.appendChild(el)}
 }
 function render(){
  const host=$('tracks');if(!host)return;
  host.querySelectorAll('.cf-compositor-row').forEach(n=>n.remove());
  for(const t of composition.tracks){
   const row=document.createElement('div');row.className='track-row cf-compositor-row';row.dataset.trackId=t.id;row.style.setProperty('--track-height',`${t.collapsed?30:(t.height||52)}px`);row.innerHTML=`<div class="track-label compositor-label"><span class="track-icon ${t.type}">${t.type==='video'?'▸':t.type==='audio'?'♪':t.type==='image'?'▧':'T'}</span><div><b>${escapeHtml(t.name)}</b><small>${t.type.toUpperCase()} · ${composition.clips.filter(c=>c.trackId===t.id).length}</small></div><div class="track-icons"><button data-action="mute">${t.muted?'M':'🔊'}</button><button data-action="solo">${t.solo?'S':'s'}</button><button data-action="collapse">${t.collapsed?'＋':'−'}</button></div></div><div class="lane compositor-lane"></div>`;
   const lane=row.querySelector('.compositor-lane');lane.addEventListener('pointerdown',e=>{if(e.target.closest('.compositor-clip'))return;seekFromLane(e,lane)});row.querySelectorAll('[data-action]').forEach(b=>b.onclick=e=>{e.stopPropagation();const act=b.dataset.action;if(act==='mute')t.muted=!t.muted;if(act==='solo')t.solo=!t.solo;if(act==='collapse')t.collapsed=!t.collapsed;render();syncAudio()});host.appendChild(row);
   for(const c of composition.clips.filter(c=>c.trackId===t.id))lane.appendChild(clipNode(c));
  }
  renderRuler();renderPlayhead();renderSilences();
  $('timelineInfo').textContent=`${fmt(composition.duration)} · 9:16 · ${composition.tracks.length} pistas`;
  $('selectionInfo').textContent=composition.selectedId?'Elemento seleccionado':'Nada seleccionado';
 }
 function clipNode(c){const el=document.createElement('div');el.className=`compositor-clip ${c.kind}`+(c.id===composition.selectedId?' selected':'');el.dataset.id=c.id;el.style.left=`${composition.duration?(c.start/composition.duration*100):0}%`;el.style.width=`${composition.duration?Math.max(.45,(c.end-c.start)/composition.duration*100):.5}%`;el.innerHTML=`<span class="clip-body">${c.kind==='audio'?'♪ ':c.kind==='image'?'▧ ':c.kind==='text'?'T ':''}${escapeHtml(c.name||c.text||c.kind)}</span><span class="clip-handle left"></span><span class="clip-handle right"></span>`;
  el.onpointerdown=e=>{if(e.target.closest('.clip-handle'))return;composition.selectedId=c.id;const x=e.clientX,orig=c.start,origEnd=c.end;el.setPointerCapture?.(e.pointerId);const move=ev=>{const lane=el.parentElement.getBoundingClientRect();let dt=((ev.clientX-x)/Math.max(1,lane.width))*composition.duration;let ns=orig+dt;if(composition.settings.snap&&!ev.shiftKey){const pts=[0,composition.playhead,...composition.clips.flatMap(z=>[z.start,z.end]),...composition.markers.map(m=>m.time)];const hit=pts.find(p=>Math.abs(p-ns)<.1);if(hit!=null)ns=hit}ns=clamp(ns,0,Math.max(0,composition.duration-(origEnd-orig)));c.start=ns;c.end=ns+(origEnd-orig);renderPlayhead();};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);save();publish();render();};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)};
  el.onclick=e=>{e.stopPropagation();composition.selectedId=c.id;composition.playhead=c.start;publish();render();updateInspector()};el.oncontextmenu=e=>{e.preventDefault();showClipMenu(e.clientX,e.clientY,c)};el.querySelector('.left').onpointerdown=e=>trimPointer(e,c,'start');el.querySelector('.right').onpointerdown=e=>trimPointer(e,c,'end');return el;
 }
 function trimPointer(e,c,side){e.stopPropagation();const lane=e.currentTarget.parentElement.getBoundingClientRect();const x=e.clientX,oldStart=c.start,oldEnd=c.end;const move=ev=>{const dt=((ev.clientX-x)/Math.max(1,lane.width))*composition.duration;if(side==='start')c.start=clamp(oldStart+dt,0,c.end-.04);else c.end=clamp(oldEnd+dt,c.start+.04,composition.duration);renderPlayhead()};const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);save();publish();render();};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
 function seekFromLane(e,lane){const r=lane.getBoundingClientRect();composition.playhead=clamp((e.clientX-r.left)/Math.max(1,r.width)*composition.duration,0,composition.duration);seek(composition.playhead)}
 function renderRuler(){const r=$('ruler');if(!r)return;r.innerHTML='';const steps=Math.max(1,Math.ceil(composition.duration/5));for(let i=0;i<=steps;i++){const t=i*5;const m=document.createElement('span');m.textContent=fmt(t);m.style.left=`${composition.duration?Math.min(100,t/composition.duration*100):0}%`;r.appendChild(m)}}
 function renderPlayhead(){const root=$('timelineCanvas');if(!root||!composition.duration)return;let p=root.querySelector('.cf-compositor-playhead');if(!p){p=document.createElement('div');p.className='cf-compositor-playhead';p.innerHTML='<i></i>' ;root.appendChild(p)}p.style.left=`112px + ${(100-112/Math.max(1,root.clientWidth)*100)*(composition.playhead/composition.duration)/100}%`;const prog=$('transportProgress');if(prog)prog.style.width=`${composition.duration?composition.playhead/composition.duration*100:0}%`;const cur=$('currentTime');if(cur)cur.textContent=fmt(composition.playhead);const pt=$('previewTime');if(pt)pt.textContent=fmt(composition.playhead)}
 function renderSilences(){const layer=$('silenceLayer');if(!layer)return;layer.innerHTML='';for(const si of composition.silences){const n=document.createElement('div');n.className='silence '+(si.keep?'kept':'');n.style.left=`${composition.duration?si.start/composition.duration*100:0}%`;n.style.width=`${composition.duration?Math.max(.2,(si.end-si.start)/composition.duration*100):0}%`;n.title=`${fmt(si.start)} → ${fmt(si.end)}`;n.onclick=e=>{e.stopPropagation();composition.playhead=si.start;seek(composition.playhead)};layer.appendChild(n)}}
 function updateInspector(){const body=$('inspectorBody'),type=$('inspectorType');if(!body)return;const c=composition.clips.find(x=>x.id===composition.selectedId);if(!c){type.textContent='Selecciona un elemento';body.innerHTML='<div class="empty-state compact"><span class="empty-icon">◈</span><b>Sin selección</b><small>Selecciona un clip en la timeline.</small></div>';return}type.textContent=`${c.kind.toUpperCase()} · ${c.name||c.text||''}`;body.innerHTML=`<div class="inspector-pro"><label>Inicio<input id="insStart" type="number" step="0.01" value="${c.start.toFixed(2)}"></label><label>Fin<input id="insEnd" type="number" step="0.01" value="${c.end.toFixed(2)}"></label>${c.kind==='audio'?'<label>Volumen<input id="insVol" type="range" min="0" max="100" value="'+Math.round((c.volume??1)*100)+'"><output id="insVolOut">'+Math.round((c.volume??1)*100)+'%</output></label>':''}${['video','image','text'].includes(c.kind)?'<label>Escala<input id="insScale" type="range" min="20" max="300" value="'+Math.round((c.scale??1)*100)+'"><output id="insScaleOut">'+Math.round((c.scale??1)*100)+'%</output></label><label>Opacidad<input id="insOpacity" type="range" min="0" max="100" value="'+Math.round((c.opacity??1)*100)+'"><output id="insOpacityOut">'+Math.round((c.opacity??1)*100)+'%</output></label>':''}</div>`;
  const bind=(id,fn)=>{const el=$(id);if(el)el.oninput=()=>{fn(el);publish();render();applyAtPlayhead()}};bind('insStart',el=>{c.start=clamp(Number(el.value),0,c.end-.04)});bind('insEnd',el=>{c.end=clamp(Number(el.value),c.start+.04,composition.duration)});bind('insVol',el=>{c.volume=Number(el.value)/100;const out=$('insVolOut');if(out)out.textContent=el.value+'%';syncAudio()});bind('insScale',el=>{c.scale=Number(el.value)/100;const out=$('insScaleOut');if(out)out.textContent=el.value+'%'});bind('insOpacity',el=>{c.opacity=Number(el.value)/100;const out=$('insOpacityOut');if(out)out.textContent=el.value+'%'})
 }
 function applyAtPlayhead(){const vc=visualClip(composition.playhead);if(vc)setVideoSource(vc);applyVisual(vc);syncAudio();renderPlayhead()}
 function seek(t){composition.playhead=clamp(Number(t)||0,0,composition.duration);applyAtPlayhead();publish()}
 async function play(){if(!composition.duration)return toast('Importa un video primero');if(composition.playing)return;composition.playing=true;const v=$('video');v?.play?.().catch(()=>{});lastTick=now();cancelAnimationFrame(raf);const tick=()=>{if(!composition.playing)return;const t=now();const dt=Math.min(.1,(t-lastTick)/1000);lastTick=t;const next=composition.playhead+dt;if(next>=composition.duration){composition.playing=false;composition.playhead=composition.duration}else composition.playhead=next;applyAtPlayhead();if(composition.playing)raf=requestAnimationFrame(tick);else pause()};raf=requestAnimationFrame(tick);updateTransport()}
 function pause(){composition.playing=false;cancelAnimationFrame(raf);$('video')?.pause?.();for(const p of audioPlayers.values())p.pause();updateTransport()}
 function toggle(){composition.playing?pause():play()}
 function updateTransport(){const b=$('playBtn');if(b)b.textContent=composition.playing?'❚❚ Pausar':'▶ Reproducir'}
 function showClipMenu(x,y,c){const m=$('contextMenu');if(!m)return;m.innerHTML='';const add=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{m.classList.add('hidden');fn()};m.appendChild(b)};add('▶ Reproducir desde aquí',()=>seek(c.start));add('✂ Dividir',()=>splitAt(c,composition.playhead));add('Duplicar',()=>duplicate(c));add('Eliminar',()=>remove(c));if(c.kind==='audio'){add('Volumen 100%',()=>{c.volume=1;publish();render();updateInspector()});add('Volumen 50%',()=>{c.volume=.5;publish();render();updateInspector()})}showMenu(x,y,m)}
 function showMenu(x,y,m){m.classList.remove('hidden');m.style.left=clamp(x,5,innerWidth-230)+'px';m.style.top=clamp(y,5,innerHeight-240)+'px';const close=()=>{m.classList.add('hidden');document.removeEventListener('mousedown',close)};setTimeout(()=>document.addEventListener('mousedown',close),0)}
 function splitAt(c,t){if(!c||t<=c.start+.03||t>=c.end-.03)return toast('Coloca el playhead dentro del clip');save();const a={...c,id:uid(),end:t},b={...c,id:uid(),start:t};if(c.kind==='video'){a.sourceEnd=(c.sourceStart||0)+(a.end-a.start);b.sourceStart=(c.sourceStart||0)+(t-c.start);b.sourceEnd=b.sourceStart+(b.end-b.start)}composition.clips.splice(composition.clips.indexOf(c),1,a,b);composition.selectedId=b.id;publish();render();updateInspector()}
 function duplicate(c){save();const gap=.05,len=c.end-c.start,copy={...c,id:uid(),start:Math.min(composition.duration-len,c.end+gap),end:Math.min(composition.duration,c.end+gap+len)};composition.clips.push(copy);composition.selectedId=copy.id;publish();render()}
 function remove(c){save();composition.clips=composition.clips.filter(x=>x.id!==c.id);composition.selectedId=null;publish();render();updateInspector()}
 function addText(){save();const track=ensureTrack('text','TEXTO 1');const c={id:uid(),kind:'text',trackId:track.id,start:composition.playhead,end:Math.min(composition.duration,composition.playhead+2),text:'Nuevo texto',name:'Texto',size:54,color:'#ffffff',bold:true,x:50,y:75,scale:1,opacity:1};composition.clips.push(c);composition.selectedId=c.id;publish();render();updateInspector();toast('Texto añadido')}
 function addTrack(type){const n=composition.tracks.filter(t=>t.type===type).length+1;composition.tracks.push({id:uid(),type,name:`${type.toUpperCase()} ${n}`,height:type==='audio'?48:54,collapsed:false,locked:false,muted:false,solo:false});render()}
 function setMarker(){composition.markers.push({id:uid(),time:composition.playhead,label:'Marcador'});render()}
 async function exportProject(){if(!composition.clips.some(c=>c.kind==='video'))return toast('Importa un video primero');composition.rendering=true;updateExportState('Renderizando…');try{const payload={version:1,settings:composition.settings,duration:composition.duration,media:composition.media,tracks:composition.tracks,clips:composition.clips,markers:composition.markers,silences:composition.silences};const r=await fetch('api/render_composition.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok||!d.ok)throw new Error(d.error||`HTTP ${r.status}`);toast('Exportación lista');updateExportState('Exportado');if(d.url)window.open(d.url,'_blank')}catch(e){log('RENDER_ERROR',{message:e.message});toast('No se pudo exportar: '+e.message);updateExportState('Error')}finally{composition.rendering=false}}
 function updateExportState(m){$('renderStatus').textContent=m}
 function bindUI(){
  const play=$('playBtn');if(play)play.onclick=toggle;
  const back=$('backBtn');if(back)back.onclick=()=>seek(composition.playhead-2);const f=$('forwardBtn');if(f)f.onclick=()=>seek(composition.playhead+2);
  const pp=$('transport-progress');if(pp)pp.onclick=e=>{const r=pp.getBoundingClientRect();seek((e.clientX-r.left)/r.width*composition.duration)};
  const addTextBtn=$('addText');if(addTextBtn)addTextBtn.onclick=addText;const track=$('addTrack');if(track)track.onclick=()=>addTrack('video');const marker=document.querySelector('.cf-marker-quick button');if(marker)marker.onclick=setMarker;
  const exp=$('exportBtn');if(exp)exp.onclick=exportProject;
  $('snapBtn')?.addEventListener('click',()=>{composition.settings.snap=!composition.settings.snap;$('snapBtn').classList.toggle('active',composition.settings.snap)});
  document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(e.code==='Space'){e.preventDefault();toggle()}else if(e.key==='Home')seek(0);else if(e.key==='End')seek(composition.duration);else if(e.key==='ArrowLeft')seek(composition.playhead-(e.shiftKey?1:.1));else if(e.key==='ArrowRight')seek(composition.playhead+(e.shiftKey?1:.1));else if(e.key.toLowerCase()==='m')setMarker();else if(e.key==='Delete'){const c=composition.clips.find(x=>x.id===composition.selectedId);if(c)remove(c)}else if(e.key.toLowerCase()==='s'&&!e.ctrlKey&&!e.metaKey){const c=composition.clips.find(x=>x.id===composition.selectedId);if(c)splitAt(c,composition.playhead)}});
 }
 function installStateHooks(){
  const origSeek=legacy.seek;legacy.seek=t=>seek(t);legacy.renderTimeline=()=>render();legacy.renderTimelineOnly=()=>render();
  const oldSet=(window.clipforge?.state)||s;
  Object.defineProperty(s,'_compositionEngine',{value:composition,enumerable:false,configurable:false});
  log('HOOKS_INSTALLED',{replacedSeek:!!origSeek});
 }
 function observeLegacy(){
  let sig='';setInterval(()=>{const mediaSig=(s.media||[]).map(x=>x.id).join('|')+'|'+(s.videoId||'')+'|'+(s.audioId||'')+'|'+(s.duration||0);if(mediaSig!==sig){sig=mediaSig;migrate();publish();render();applyAtPlayhead();log('SYNC_MEDIA',{media:composition.media.length,clips:composition.clips.length})}
   const legacyCount=(s.segments?.length||0)+(s.texts?.length||0);if(legacyCount&&legacyCount!==composition.clips.filter(c=>c.kind!=='audio'||c.linkedVideoId==null).length){migrate();publish();render()}
  },350)
 }
 function start(){if(booted)return;booted=true;migrate();composition.playhead=s.playhead||0;composition.duration=Math.max(composition.duration,s.duration||0);bindUI();installStateHooks();render();applyAtPlayhead();observeLegacy();updateInspector();updateTransport();window.clipforgeComposition=composition;window.clipforgeCompositor={seek,play,pause,toggle,render,addText,addTrack,exportProject,splitAt,duplicate,remove,setMarker};document.body.classList.add('cf-compositor-v1');log('READY',{version:1,tracks:composition.tracks.length,clips:composition.clips.length,duration:composition.duration})}
 function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]))}
 setTimeout(start,900);
};boot();
})();
