(async()=>{
  try{
    const src=await (await fetch('assets/app.js?v=7',{cache:'no-store'})).text();
    const marker="log('info','APP_READY',{version:2,platform:navigator.platform});";
    const hook="window.clipforge={state,snapshot,renderAll,renderTimeline,updateInspector,toast,refreshButtons,seek,renderTimelineOnly};\n"+marker;
    const patched=src.includes(marker)?src.replace(marker,hook):src+"\nwindow.clipforge={state,snapshot,renderAll,renderTimeline,updateInspector,toast,refreshButtons,seek,renderTimelineOnly};";
    eval(patched);
    const s=document.createElement('script');s.src='assets/drag-v4.js?v=2';document.body.appendChild(s);
    const css=document.createElement('link');css.rel='stylesheet';css.href='assets/editor-drag.css?v=2';document.head.appendChild(css);
    console.log('[ClipForge] ENTRY_READY',{dragLayer:true});
  }catch(e){console.error('[ClipForge] ENTRY_ERROR',{message:e.message,stack:e.stack});const t=document.getElementById('toast');if(t){t.textContent='Error al iniciar el editor';t.classList.add('show')}}
})();
