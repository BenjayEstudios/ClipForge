<?php session_start(); ?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ClipForge — Editor de Shorts</title>
<link rel="stylesheet" href="assets/app.css">
</head>
<body>
<header class="topbar">
  <div class="brand"><span class="brand-mark">CF</span><div><strong>ClipForge</strong><small>Short-form editor · Local</small></div></div>
  <div class="status"><span class="dot"></span> XAMPP / Local</div>
</header>
<main class="workspace">
<section class="hero">
  <div><p class="eyebrow">SHORTS · REELS · TIKTOK</p><h1>Edita para retener, no solo para cortar.</h1><p class="muted">Importa el video principal y añade una pista de audio independiente. En la pista de audio también puedes subir un video y ClipForge extraerá únicamente su sonido.</p></div>
  <div class="import-actions">
    <label class="upload-btn"><input id="videoInput" type="file" accept="video/*"><span>＋ Video</span></label>
    <label class="upload-btn secondary"><input id="audioInput" type="file" accept="audio/*,video/*"><span>＋ Audio / video con audio</span></label>
  </div>
</section>
<section id="emptyState" class="card empty"><div class="upload-icon">＋</div><h2>Comienza con tu material bruto</h2><p>Importa un video principal y, opcionalmente, un audio o un video del que quieras rescatar solo el sonido.</p></section>
<section id="editor" class="editor hidden">
<div class="main-column">
  <div class="preview card">
    <div class="card-head"><div><strong id="fileName">Vista previa</strong><span id="editHint">Sin video cargado</span></div><span id="durationLabel">00:00</span></div>
    <video id="video" controls playsinline></video>
    <audio id="audio" preload="metadata"></audio>
    <div class="timeline-wrap">
      <div class="ruler" id="ruler"></div>
      <div class="timeline" id="timeline"><div id="timelineProgress"></div></div>
      <div id="timelineMarks" class="timeline-marks"></div>
    </div>
    <div class="transport"><button id="backBtn">−2s</button><button id="playBtn">▶ Reproducir</button><button id="forwardBtn">+2s</button><span id="currentTime">00:00</span><span id="syncStatus" class="sync-status">Solo video</span></div>
  </div>

  <div class="card media-bin">
    <div class="section-title"><div><strong>Medios</strong><span>Video principal y audio en pistas separadas</span></div><span class="step">MEDIA</span></div>
    <div class="media-grid">
      <div class="media-item"><div class="media-icon video-icon">VID</div><div class="media-copy"><b id="videoName">Ningún video</b><small id="videoMeta">Importa el video principal</small></div><button id="replaceVideo">Cambiar</button></div>
      <div class="media-item"><div class="media-icon audio-icon">AUD</div><div class="media-copy"><b id="audioName">Sin audio</b><small id="audioMeta">MP3, WAV, M4A, OGG o video con audio</small></div><button id="removeAudio" class="ghost">Quitar</button></div>
    </div>
  </div>

  <div class="card workflow"><div class="section-title"><div><strong>Ritmo del video</strong><span>Primero limpia, luego agrega estilo</span></div><span class="step">01</span></div><div class="rhythm-cards"><div><b>Hook</b><small>Los primeros segundos deben avanzar sin relleno.</small></div><div><b>Ritmo</b><small>Las pausas innecesarias rompen la atención.</small></div><div><b>Intención</b><small>No elimines silencios que aportan emoción o énfasis.</small></div></div></div>
</div>

<aside class="side-column">
  <div class="card timeline-panel">
    <div class="card-head"><div><strong>Timeline</strong><span>Pistas independientes</span></div></div>
    <div class="track-list">
      <div class="track-row"><div class="track-label"><span class="track-dot video-dot"></span>VIDEO</div><div class="track-lane" id="videoLane"><div id="videoClip" class="clip video-clip">Video principal</div></div></div>
      <div class="track-row"><div class="track-label"><span class="track-dot audio-dot"></span>AUDIO</div><div class="track-lane" id="audioLane"><div id="audioClip" class="clip audio-clip hidden">Audio</div></div></div>
      <div class="playhead" id="playhead"></div>
    </div>
    <div class="timeline-note">Puedes cargar música directamente o subir un video grabado para usar solamente su pista de audio.</div>
  </div>

  <div class="card silence-panel"><div class="card-head"><div><strong>Recorte inteligente</strong><span>Selecciona las pausas que quieres eliminar</span></div></div>
    <div class="controls"><label><span>Umbral de silencio</span><input id="threshold" type="number" min="-80" max="-10" value="-35"><em>dB</em></label><label><span>Silencio mínimo</span><input id="minDuration" type="number" min="0.2" max="10" step="0.1" value="0.8"><em>seg</em></label></div>
    <button id="analyzeBtn" class="primary">Detectar pausas</button><div id="analysisStatus" class="status-box hidden"></div>
    <div id="selectionTools" class="selection-tools hidden"><button id="selectAll">Seleccionar todo</button><button id="selectNone">Quitar todo</button></div>
    <div id="silenceList" class="silence-list"></div>
    <div class="render-row"><button id="renderBtn" class="primary hidden">✂ Crear versión limpia</button><span id="renderStatus"></span></div>
    <a id="downloadBtn" class="download hidden" download>↓ Descargar resultado</a>
  </div>
</aside>
</section>
</main>
<script src="assets/app.js"></script>
</body></html>
