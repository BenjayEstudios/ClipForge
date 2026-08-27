/* ClipForge Auto Edit: análisis automático al importar y control visual de silencios. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
let silences=[];
let selectedSilences=new Set();
let analyzing=false;
const AUTO={threshold:-35,minDuration:.65};
function fmt(s){s=Math.max(0,Number(s)||0);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`}
function notify(t,type=''){const x=$('statusBar');if(!x)return;x.textContent=t;x.className=`status-bar ${type}`;x.classList.remove('hidden');clearTimeout(notify.t);notify.t=setTimeout(()=>x.classList.add('hidden'),4200)}
function ensurePanel(){
  if($('autoEditPanel'))return;
  const timeline=$('timelinePanel');
  if(!timeline)return;
  const panel=document.createElement('div');panel.id='autoEditPanel';panel.className='auto-panel';panel.innerHTML=`
    <div class="auto-head"><div><div class="auto-title">⚡ Auto Edit</div><div class="auto-sub">ClipForge detectó pausas automáticamente. Los segmentos rojos son candidatos a eliminar.</div></div><span class="auto-badge">Reel workflow</span></div>
    <div class="silence-summary"><span class="summary-chip"><strong id="silenceCount">0</strong> silencios</span><span class="summary-chip"><strong id="silenceDuration">0.0 s</strong> detectados</span><span class="summary-chip"><strong id="silenceSelected">0</strong> seleccionados</span></div>
    <div class="silence-controls"><button id="autoSelectAll" class="mini-btn">Seleccionar todos</button><button id="autoSelectNone" class="mini-btn">Dejar todos</button><button id="autoApply" class="mini-btn primary">✂ Eliminar seleccionados</button><button id="autoReanalyze" class="mini-btn">↻ Volver a analizar</button><span id="autoStatus" class="status"></span></div>
    <div class="auto-help">Haz clic en un silencio rojo para activarlo o dejarlo. La línea roja del playhead sigue siendo el punto exacto de corte.</div>`;
  timeline.appendChild(panel);
  $('autoSelectAll').onclick=()=>{silences.forEach((_,i)=>selectedSilences.add(i));renderSilenceLayer();updateSummary()};
  $('autoSelectNone').onclick=()=>{selectedSilences.clear();renderSilenceLayer();updateSummary()};
  $('autoApply').onclick=applySelected;
  $('autoReanalyze').onclick=()=>analyze(true);
}
function ensureLayer(){
  const tracks=$('tracks');if(!tracks||$('silenceLayer'))return;
  const layer=document.createElement('div');layer.id='silenceLayer';layer.className='timeline-silence-layer';tracks.appendChild(layer);
}
function renderSilenceLayer(){
  ensureLayer();const layer=$('silenceLayer');if(!layer)return;layer.innerHTML='';const d=state.duration||0;if(!d)return;
  silences.forEach((s,i)=>{const e=document.createElement('button');e.type='button';e.className=`timeline-silence-mark ${selectedSilences.has(i)?'selected':''}`;e.style.left=(s.start/d*100)+'%';e.style.width=Math.max(.25,(s.end-s.start)/d*100)+'%';e.title=`${fmt(s.start)} → ${fmt(s.end)} · ${s.duration.toFixed(2)} s`;
    const tag=document.createElement('span');tag.className='silence-tag';tag.textContent=selectedSilences.has(i)?`ELIMINAR · ${s.duration.toFixed(1)}s`:`MANTENER · ${s.duration.toFixed(1)}s`;e.appendChild(tag);
    e.onclick=ev=>{ev.stopPropagation();if(selectedSilences.has(i))selectedSilences.delete(i);else selectedSilences.add(i);renderSilenceLayer();updateSummary();};layer.appendChild(e);
  });
}
function updateSummary(){ensurePanel();const total=silences.reduce((n,s)=>n+Number(s.duration||0),0);$('silenceCount').textContent=silences.length;$('silenceDuration').textContent=total.toFixed(1)+' s';$('silenceSelected').textContent=selectedSilences.size}
async function analyze(showNotice=false){
  if(analyzing||!state.videoId||!state.duration)return;analyzing=true;ensurePanel();$('autoStatus').textContent='Analizando audio…';
  try{
    const fd=new FormData();fd.append('id',state.videoId);fd.append('threshold',AUTO.threshold);fd.append('min_duration',AUTO.minDuration);
    const r=await fetch('api/analyze.php',{method:'POST',body:fd});let d={};try{d=await r.json()}catch{}
    if(!r.ok||!d.ok)throw Error(d.error||`Error HTTP ${r.status}`);
    silences=(d.silences||[]).map(s=>({start:+s.start,end:+s.end,duration:+s.duration||(+s.end-+s.start)}));
    selectedSilences=new Set(silences.map((_,i)=>i));
    $('autoStatus').textContent=silences.length?'Análisis listo':'No se detectaron silencios con el ajuste actual.';
    updateSummary();renderSilenceLayer();
    if(showNotice)notify(`${silences.length} pausas detectadas`,'success');
  }catch(e){$('autoStatus').textContent='Error: '+e.message;notify('No fue posible analizar el audio: '+e.message,'error')}
  finally{analyzing=false}
}
function splitAt(t){
  const c=state.clips.find(c=>!c.deleted&&c.start+0.0001<t&&t<c.end-0.0001);if(!c)return;
  const i=state.clips.indexOf(c);const left={...c,id:uid(),end:t};const right={...c,id:uid(),start:t};state.clips.splice(i,1,left,right);
}
function applySelected(){
  if(!selectedSilences.size)return notify('No hay silencios seleccionados.','error');
  pushHistory();
  const chosen=[...selectedSilences].sort((a,b)=>silences[a].start-silences[b].start);
  chosen.forEach(i=>{const s=silences[i];splitAt(s.start);splitAt(s.end)});
  state.clips.forEach(c=>{if(c.deleted)return;const hit=chosen.some(i=>{const s=silences[i];return c.start>=s.start-0.0001&&c.end<=s.end+0.0001&&(c.end-c.start)>0});if(hit)c.deleted=true});
  state.selected=null;draw();notify(`Se eliminaron ${chosen.length} silencios de la edición`,'success');
}
function hook(){
  ensurePanel();ensureLayer();
  const oldLoaded=video.onloadedmetadata;
  video.addEventListener('loadedmetadata',()=>{setTimeout(()=>analyze(false),80)});
  video.addEventListener('durationchange',()=>{setTimeout(()=>{if(state.duration&&!silences.length)analyze(false)},80)});
  window.addEventListener('resize',renderSilenceLayer);
  const obs=new MutationObserver(()=>{if($('timelinePanel')&&!$('autoEditPanel'))ensurePanel();if($('tracks')&&!$('silenceLayer'))ensureLayer();});
  const target=$('timelinePanel')||document.body;obs.observe(target,{childList:true,subtree:true});
  ensurePanel();updateSummary();renderSilenceLayer();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
