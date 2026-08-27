// UI precision patch: keep the red playhead continuous and aligned with the track lanes.
(function(){
  const $=id=>document.getElementById(id);
  window.updatePlayhead=function(){
    const tracks=$('tracks'),head=$('playhead'),d=window.clipforgeDuration||0;
    const v=document.getElementById('video');
    const duration=d||v?.duration||0;
    if(!tracks||!head||!duration)return;
    const label=window.innerWidth<=700?58:70;
    const laneWidth=Math.max(1,tracks.clientWidth-label);
    const pct=Math.max(0,Math.min(1,(v?.currentTime||0)/duration));
    head.style.left=(label+laneWidth*pct)+'px';
    const pt=$('previewTime');if(pt)pt.textContent=`${fmt(pct*duration)} / ${fmt(duration)}`;
  };
  function fmt(s){s=Math.max(0,+s||0);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`}
  window.addEventListener('resize',()=>window.updatePlayhead());
  setTimeout(()=>window.updatePlayhead(),50);
})();