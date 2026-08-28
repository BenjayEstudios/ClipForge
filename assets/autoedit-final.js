(()=>{
'use strict';
const $=id=>document.getElementById(id),api=window.clipforge;if(!api?.state)return;const state=api.state;
const log=(m,d={})=>console.log('[ClipForge] AUTOEDIT',m,d);
const clone=o=>JSON.parse(JSON.stringify(o));
function snapshot(){return api.snapshot?.()||JSON.stringify({segments:state.segments,texts:state.texts,silences:state.silences})}
function buildEditedSegments(){
 const src=state.segments.filter(c=>c.kind==='video').sort((a,b)=>a.start-b.start)[0];
 if(!src||!state.duration)return [];
 const sourceStart=src.sourceStart??0,sourceEnd=src.sourceEnd??(sourceStart+(src.end-src.start));
 const sil=state.silences.filter(s=>!s.keep&&s.end>s.start).sort((a,b)=>a.start-b.start);
 const out=[];let srcCursor=sourceStart,projectCursor=0;
 for(const s of sil){const a=Math.max(src.start,s.start),b=Math.min(src.end,s.end);if(b<=a)continue;const relA=a-src.start,relB=b-src.start;const clipSourceA=sourceStart+relA,clipSourceB=sourceStart+relB;if(clipSourceA>srcCursor+.01){const len=clipSourceA-srcCursor;out.push({...src,id:crypto.randomUUID(),start:projectCursor,end:projectCursor+len,sourceStart:srcCursor,sourceEnd:clipSourceA});projectCursor+=len;}srcCursor=Math.max(srcCursor,clipSourceB);}
 if(srcCursor<sourceEnd-.01){const len=sourceEnd-srcCursor;out.push({...src,id:crypto.randomUUID(),start:projectCursor,end:projectCursor+len,sourceStart:srcCursor,sourceEnd:sourceEnd});projectCursor+=len;}
 return out;
}
function applyAuto(){if(!state.video||!state.duration)return api.toast?.('Importa un video primero');const before=snapshot();const base=state.segments.find(c=>c.kind==='video');if(!base)return api.toast?.('No hay clip de video para editar');if(document.getElementById('autoSilence')?.checked!==false){const out=buildEditedSegments();if(!out.length)return api.toast?.('No quedan fragmentos después de eliminar pausas');state.segments=state.segments.filter(c=>c.kind!=='video');state.segments.push(...out);state.selected=out[0].id;state.selectedSilence=null;state.history.push(before);state.future=[];state.previewEdit=true;}if(document.getElementById('autoSubtitles')?.checked){if(!state.texts.length){const t={id:crypto.randomUUID(),kind:'text',start:0,end:Math.min(2.2,state.duration),text:'TU MENSAJE',size:58,color:'#fff',bold:true,x:50,y:82,trackId:(state.tracks.find(t=>t.type==='text')||{}).id};state.texts.push(t)}}api.renderAll?.();api.refreshButtons?.();if($('previewEditBtn')){$('previewEditBtn').classList.toggle('active',!!state.previewEdit);$('previewEditBtn').textContent=state.previewEdit?'⏸ Editado':'▶ Editado';}api.toast?.('Auto Edit aplicado: timeline lista para revisión');log('APPLIED',{segments:state.segments.filter(c=>c.kind==='video').length,silences:state.silences.length});}
window.clipforgeAutoApplyFinal=applyAuto;
function runAnalysis(){if(!state.videoId)return api.toast?.('Importa un video primero');const btn=$('analyzeBtn');btn?.click()}
$('autoApply')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();applyAuto()},{capture:true});
$('autoEditBtn')?.addEventListener('click',e=>{if(e.detail===2)applyAuto()},{capture:true});
log('READY',{autoCut:true,reviewBeforeExport:true});
})();
