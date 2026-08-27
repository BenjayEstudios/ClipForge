<?php
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ClipForge — Editor de Reels</title>
<link rel="stylesheet" href="assets/app.css?v=7">
</head>
<body>
<header class="topbar">
  <div class="brand"><div class="brand-mark">CF</div><div><strong>ClipForge</strong><small>EDITOR DE REELS</small></div></div>
  <div class="project-meta"><span class="status-dot"></span><span id="projectStatus">Sin proyecto</span><span class="dot-sep">•</span><span>9:16 · 1080×1920 · 30 fps</span></div>
  <div class="top-actions"><button id="newProject" class="btn ghost">Nuevo</button><button id="saveProject" class="btn ghost">Guardar</button><button id="openProject" class="btn ghost">Abrir</button><button id="exportBtn" class="btn accent">Exportar</button></div>
</header>
<main class="workspace">
  <div class="main-toolbar panel">
    <div class="toolbar-group"><button id="importVideo" class="btn primary">＋ Video</button><button id="importAudio" class="btn">♪ Audio</button><button id="addText" class="btn">T Texto</button><button id="autoEditBtn" class="btn ai-btn">✦ Auto Edit</button></div>
    <div class="toolbar-group center-tools"><button id="splitBtn" class="btn" title="Dividir en el playhead (S)">✂ Dividir</button><button id="undoBtn" class="icon-btn" title="Deshacer (Ctrl+Z)">↶</button><button id="redoBtn" class="icon-btn" title="Rehacer (Ctrl+Y)">↷</button><span class="tool-sep"></span><button id="fitTimeline" class="btn">Ajustar</button><input id="zoom" type="range" min="40" max="240" value="100" aria-label="Zoom de timeline"><button id="zoomIn" class="icon-btn">＋</button><button id="zoomOut" class="icon-btn">−</button></div>
    <div class="toolbar-group right"><span id="renderStatus" class="status-label">Listo</span><button id="exportTop" class="btn accent">Exportar Reel</button></div>
  </div>

  <section class="editor-grid">
    <aside class="media-panel panel">
      <div class="panel-title"><div><b>Multimedia</b><small>Arrastra recursos a la timeline</small></div><button id="mediaPlus" class="icon-btn">＋</button></div>
      <div class="media-tabs"><button class="active" data-tab="all">Todos</button><button data-tab="video">Video</button><button data-tab="audio">Audio</button><button data-tab="text">Texto</button></div>
      <div id="mediaList" class="media-list"><div class="empty-state"><span class="empty-icon">＋</span><b>Importa tu primer recurso</b><small>También puedes arrastrar un archivo aquí</small></div></div>
      <div class="media-footer"><span id="mediaCount">0 recursos</span><span>Ctrl+I importar</span></div>
    </aside>

    <section class="center-column">
      <div class="preview-panel panel">
        <div class="panel-title preview-title"><div><b>Preview</b><small id="previewModeLabel">Original · edición en tiempo real</small></div><div class="preview-tools"><span id="previewTime">00:00</span><button id="muteBtn" class="icon-btn">🔊</button></div></div>
        <div class="stage"><div class="reel-frame"><video id="video" playsinline preload="metadata"></video><div id="textOverlay" class="text-overlay"></div><div id="previewEmpty" class="preview-empty"><div class="empty-play">▶</div><b>Importa un video</b><span>El proyecto aparecerá aquí en formato 9:16</span></div></div></div>
        <div class="transport"><button id="backBtn" class="transport-btn">−2s</button><button id="playBtn" class="play-btn">▶</button><button id="forwardBtn" class="transport-btn">+2s</button><span id="currentTime">00:00</span><div class="transport-progress"><i id="transportProgress"></i></div><span id="durationLabel">00:00</span><button id="previewEditBtn" class="btn edit-preview">▶ Editado</button></div>
      </div>
      <div id="analysisBar" class="analysis-panel panel hidden"><div class="analysis-main"><span class="ai-badge">AUTO</span><div><b id="analysisTitle">Analizando…</b><small id="analysisText">Detectando pausas y preparando tu timeline.</small></div></div><div class="analysis-actions"><button id="analyzeBtn" class="btn">Reanalizar</button><button id="selectAll" class="btn danger-soft">Eliminar silencios</button><button id="selectNone" class="btn">Mantener silencios</button></div></div>
      <div id="autoPanel" class="auto-panel panel hidden"><div><b>Auto Edit</b><small>Genera una primera edición a partir del video bruto.</small></div><div class="auto-options"><label><input type="checkbox" id="autoSilence" checked> Eliminar pausas largas</label><label><input type="checkbox" id="autoRhythm"> Marcar puntos de ritmo</label><label><input type="checkbox" id="autoSubtitles"> Preparar subtítulos</label></div><div class="auto-actions"><button id="autoApply" class="btn accent">Aplicar a timeline</button><button id="autoClose" class="btn">Cerrar</button></div></div>
    </section>

    <aside class="inspector-panel panel">
      <div class="panel-title"><div><b>Inspector</b><small id="inspectorType">Selecciona un elemento</small></div></div>
      <div id="inspectorBody" class="inspector-body"><div class="empty-state compact"><span class="empty-icon">◈</span><b>Sin selección</b><small>Selecciona un clip, texto, audio o pausa. Clic derecho muestra opciones.</small></div></div>
    </aside>
  </section>

  <section class="timeline-panel panel">
    <div class="timeline-head"><div><b>Timeline</b><small id="timelineInfo">Importa un video para comenzar</small></div><div class="timeline-actions"><button id="snapBtn" class="chip active">⌁ Ajuste</button><button id="addTrack" class="chip">＋ Pista</button></div></div>
    <div class="timeline-wrap" id="timelineScroll"><div class="timeline-canvas" id="timelineCanvas">
      <div class="ruler-row"><div class="track-label ruler-label"></div><div class="ruler" id="ruler"></div></div>
      <div class="timeline-body" id="tracks">
        <div class="track-row" data-track="video"><div class="track-label"><span class="track-icon video">▸</span><div><b>VIDEO</b><small>principal</small></div><button class="track-state" title="Bloquear pista">♙</button></div><div class="lane" id="videoLane"></div></div>
        <div class="track-row" data-track="audio"><div class="track-label"><span class="track-icon audio">♪</span><div><b>AUDIO</b><small>voz / música</small></div><button class="track-state" title="Bloquear pista">♙</button></div><div class="lane" id="audioLane"></div></div>
        <div class="track-row" data-track="text"><div class="track-label"><span class="track-icon text">T</span><div><b>TEXTO</b><small>títulos / subtítulos</small></div><button class="track-state" title="Bloquear pista">♙</button></div><div class="lane" id="textLane"></div></div>
        <div id="silenceLayer" class="silence-layer"></div>
        <div id="playhead" class="playhead"><span></span></div>
      </div>
    </div></div>
    <div class="timeline-footer"><span id="selectionInfo">Nada seleccionado</span><span><kbd>Espacio</kbd> reproducir · <kbd>S</kbd> dividir · <kbd>Supr</kbd> eliminar · <kbd>Ctrl+Z</kbd> deshacer · <kbd>clic derecho</kbd> opciones</span></div>
  </section>
</main>
<div id="contextMenu" class="context-menu hidden"></div>
<div id="toast" class="toast"></div>
<input id="videoInput" type="file" accept="video/*" hidden>
<input id="audioInput" type="file" accept="audio/*,video/*" hidden>
<input id="projectInput" type="file" accept="application/json,.json,.clipforge" hidden>
<script src="assets/app.js?v=7"></script>
</body></html>
