(()=>{
  const api=window.clipforge;
  if(!api?.state){console.warn('[ClipForge] BENJIWI_PROFILE waiting: editor API unavailable');return;}
  const state=api.state;
  const log=(m,d={})=>console.log('[ClipForge] STYLE '+m,d);
  const profile={
    id:'benjiwi-v1',
    name:'Benjiwi · Reel dinámico',
    description:'Perfil basado en patrones observados en BENJIWI REAL.veg: cortes dinámicos, texto de énfasis, pasos numerados, overlays, impactos/risers y transiciones rápidas.',
    pacing:{targetClipSec:.8,maxClipSec:2.4,keepLongClipSec:3.2},
    text:{size:58,bold:true,position:'bottom',highlightWords:['paso','50/50','importante','trabajo']},
    sfx:{impact:true,riser:true},
    visual:{punchIn:true,whipTransitions:true,damageTransitions:true,freezeFrame:true}
  };
  window.clipforgeStyleProfile=profile;
  function addStyleText(text,start,duration=1.7){
    if(!text||!state.duration)return null;
    const t={id:crypto.randomUUID(),kind:'text',start:Math.max(0,start),end:Math.min(state.duration,start+duration),text,size:profile.text.size,color:'#ffffff',position:profile.text.position,bold:true,preset:'benjiwi'};
    state.texts.push(t); return t;
  }
  function generateStepPrompts(){
    const existing=state.texts.map(t=>(t.text||'').toLowerCase());
    const steps=['paso 1','paso 2','paso 3'];
    let added=0;
    for(const s of steps){ if(existing.includes(s)) continue; const idx=added; const pos=Math.min(state.duration-0.5, idx*Math.max(1,state.duration/4)+1); addStyleText(s,pos,1.5); added++; }
    return added;
  }
  function apply(){
    if(!state.duration)return api.toast('Importa un video antes de aplicar el perfil');
    api.snapshot && state.history.push(api.snapshot());
    state.future=[];
    const already=state.texts.filter(t=>t.preset==='benjiwi').length;
    if(!already) generateStepPrompts();
    state.segments.filter(c=>c.kind==='video').forEach(c=>{c.styleProfile='benjiwi';c.maxClipSec=Math.min(c.maxClipSec||999,profile.pacing.maxClipSec)});
    api.refreshButtons?.(); api.renderAll?.();
    api.toast('Perfil Benjiwi aplicado a la timeline');
    log('APPLIED',{profile:profile.id,texts:state.texts.length});
  }
  window.clipforgeApplyStyleProfile=apply;
  const bind=()=>{
    const btn=document.getElementById('autoEditBtn');
    if(btn&&!btn.dataset.styleBound){btn.dataset.styleBound='1';const hint=document.createElement('button');hint.className='style-profile-chip';hint.textContent='Benjiwi';hint.title='Aplicar perfil de edición basado en el .veg de referencia';hint.onclick=()=>apply();btn.parentElement?.appendChild(hint);}
  };
  bind();
  new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
  log('READY',{profile:profile.id});
})();
