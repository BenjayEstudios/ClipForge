(()=>{
  const api=window.clipforge;
  if(!api?.state)return;
  const state=api.state;
  const log=(m,d={})=>console.log('[ClipForge] PREVIEW '+m,d);
  const video=document.getElementById('video');
  const frame=document.querySelector('.reel-frame');
  if(!video||!frame)return;
  // Keep overlays and player state visually stable while the editor re-renders timeline elements.
  const overlay=document.getElementById('textOverlay');
  let raf=0;
  const sync=()=>{
    if(!state.duration)return;
    const p=Math.max(0,Math.min(1,state.playhead/state.duration));
    document.body.style.setProperty('--clipforge-preview-progress',`${p*100}%`);
    if(overlay)overlay.style.visibility='visible';
  };
  video.addEventListener('loadedmetadata',()=>{video.style.objectFit='contain';sync();log('READY',{width:video.videoWidth,height:video.videoHeight,duration:video.duration})});
  video.addEventListener('error',()=>log('VIDEO_ERROR',{code:video.error?.code,message:video.error?.message||'unknown'}));
  const mo=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(sync)});
  mo.observe(overlay||frame,{childList:true,subtree:true,attributes:true});
  sync();
})();
