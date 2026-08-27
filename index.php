<?php
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ClipForge — Reel Editor</title>
<link rel="stylesheet" href="assets/app.css?v=4">
</head>
<body>
<header class="topbar">
  <div class="brand"><div class="brand-mark">CF</div><div><strong>ClipForge</strong><small>REEL EDITOR</small></div></div>
  <div class="project"><span class="live-dot"></span><span id="projectStatus">Sin proyecto</span><span class="sep">•</span><span>9:16 · 1080×1920</span></div>
  <div class="top-actions"><button id="newProject" class="ghost">Nuevo</button><button id="saveProject" class="ghost">Guardar</button><button id="exportBtn" class="export">Exportar</button></div>
</header>

<main class="app">
  <section class="toolbar card">
    <div class="toolbar-left">
      <button id="importVideo" class="tool primary">＋ Video</button><button id="importAudio" class="tool">♪ Audio</button><button id="addText" class="tool">T Texto</button><span class="divider"></span>
      <button id="splitBtn" class="tool" title="Dividir (S)">✂ Dividir</button><button id="deleteBtn" class="tool" title="Eliminar (Supr)">Eliminar</button><button id="undoBtn" class="tool">↶</button><button id="redoBtn" class="tool">↷</button>
    </div>
    <div class="toolbar-center"><button id="fitTimeline" class="tool">Ajustar</button><button id="zoomOut" class="tool">−</button><input id="zoom" type="range" min="50" max="240" value="100"><button id="zoomIn" class="tool">＋</button></div>
    <div class="toolbar-right"><span id="renderStatus">Listo</span><button id="exportTop" class="export">Exportar Reel</button></div>
  </section>

  <section class="main-grid">
    <aside class="media card">
      <div class="panel-head"><div><b>Multimedia</b><small>Proyecto</small></div><button id="mediaPlus" class="icon-btn">＋</button></div>
      <div class="media-tabs"><button class="active" data-tab="all">Todos</button><button data-tab="video">Video</button><button data-tab="audio">Audio</button><button data-tab="text">Texto</button></div>
      <div id="mediaList" class="media-list"><div class="media-empty"><div>＋</div><b>Importa tu primer video</b><small>Arrástralo o usa ＋ Video</small></div></div>
      <div class="media-footer"><span id="mediaCount">0 elementos</span></div>
    </aside>

    <section class="center">
      <div class="preview card">
        <div class="preview-head"><div><b>Vista previa</b><small>Formato vertical · Reel</small></div><div class="preview-tools"><span id="previewTime">00:00</span><button id="muteBtn" class="icon-btn">🔊</button></div></div>
        <div class="stage"><div class="reel-frame"><video id="video" playsinline preload="metadata"></video><div id="textOverlay" class="text-overlay"></div><div id="previewEmpty" class="preview-empty"><div class="upload-symbol">＋</div><b>Importa un video</b><span>Tu Reel aparecerá aquí</span></div></div></div>
        <div class="transport"><button id="backBtn" class="transport-btn">−2s</button><button id="playBtn" class="play">▶</button><button id="forwardBtn" class="transport-btn">+2s</button><span id="currentTime">00:00</span><div class="transport-progress"><i id="transportProgress"></i></div><span id="durationLabel">00:00</span></div>
      </div>

      <div id="analysisBar" class="analysis card hidden"><div class="analysis-main"><span class="ai">AI</span><div><b id="analysisTitle">Analizando video…</b><small id="analysisText">Detectando silencios y preparando la timeline.</small></div></div><div class="analysis-actions"><button id="analyzeBtn" class="tool">Analizar</button><button id="selectAll" class="tool">Eliminar todos</button><button id="selectNone" class="tool">Mantener todos</button></div></div>
    </section>

    <aside class="inspector card"><div class="panel-head"><div><b>Inspector</b><small id="inspectorType">Selecciona un elemento</small></div></div><div id="inspectorBody" class="inspector-body"><div class="inspector-empty"><span>◈</span><b>Sin selección</b><small>Selecciona un clip, texto o silencio en la timeline para editarlo.</small></div></div></aside>
  </section>

  <section class="timeline card">
    <div class="timeline-head"><div><b>Timeline</b><small id="timelineInfo">Arrastra, recorta y divide tus clips</small></div><div class="timeline-tools"><button id="snapBtn" class="tool active">⌁ Ajuste</button><button id="addTrack" class="tool">＋ Pista</button></div></div>
    <div class="timeline-scroll" id="timelineScroll">
      <div class="timeline-canvas" id="timelineCanvas">
        <div class="ruler-row"><div class="track-name ruler-name"></div><div id="ruler" class="ruler"></div></div>
        <div class="tracks" id="tracks">
          <div class="track-row" data-track="video"><div class="track-name"><span class="track-icon">▸</span><b>VIDEO</b><button class="track-lock">♙</button></div><div class="lane" id="videoLane"></div></div>
          <div class="track-row" data-track="audio"><div class="track-name"><span class="track-icon audio">♪</span><b>AUDIO</b><button class="track-lock">♙</button></div><div class="lane" id="audioLane"></div></div>
          <div class="track-row" data-track="text"><div class="track-name"><span class="track-icon text">T</span><b>TEXTO</b><button class="track-lock">♙</button></div><div class="lane" id="textLane"></div></div>
          <div id="playhead" class="playhead"><span></span></div>
          <div id="silenceLayer" class="silence-layer"></div>
        </div>
      </div>
    </div>
    <div class="timeline-foot"><span id="selectionInfo">Nada seleccionado</span><span><kbd>Espacio</kbd> reproducir · <kbd>S</kbd> dividir · <kbd>Supr</kbd> eliminar</span></div>
  </section>
</main>

<div id="toast" class="toast"></div>
<input id="videoInput" type="file" accept="video/*" hidden><input id="audioInput" type="file" accept="audio/*,video/*" hidden>
<script src="assets/app.js?v=4"></script>
</body></html>
