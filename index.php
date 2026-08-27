<?php
session_start();
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ClipForge — Editor local</title>
  <link rel="stylesheet" href="assets/app.css">
</head>
<body>
  <header class="topbar">
    <div class="brand"><span class="brand-mark">CF</span><div><strong>ClipForge</strong><small>Editor local</small></div></div>
    <div class="status"><span class="dot"></span> XAMPP / Local</div>
  </header>

  <main class="workspace">
    <section class="hero">
      <div>
        <p class="eyebrow">SHORTS · REELS · TIKTOK</p>
        <h1>Convierte tus videos en clips.</h1>
        <p class="muted">Primera herramienta: detecta silencios y decide cuáles eliminar antes de renderizar.</p>
      </div>
      <label class="upload-btn">
        <input id="videoInput" type="file" accept="video/*">
        <span>＋ Subir video</span>
      </label>
    </section>

    <section id="emptyState" class="card empty">
      <div class="upload-icon">↑</div>
      <h2>Sube un video para comenzar</h2>
      <p>El video se procesa en tu propio PC. No sale de tu servidor local.</p>
    </section>

    <section id="editor" class="editor hidden">
      <div class="preview card">
        <div class="card-head"><div><strong>Vista previa</strong><span id="fileName"></span></div><span id="durationLabel">00:00</span></div>
        <video id="video" controls playsinline></video>
        <div class="timeline"><div id="timelineProgress"></div></div>
      </div>

      <aside class="card silence-panel">
        <div class="card-head"><div><strong>Recorte de silencios</strong><span>Selecciona qué eliminar</span></div></div>
        <div class="controls">
          <label>Umbral de silencio <input id="threshold" type="number" min="-80" max="-10" value="-35"><span>dB</span></label>
          <label>Silencio mínimo <input id="minDuration" type="number" min="0.2" max="10" step="0.1" value="0.8"><span>seg</span></label>
        </div>
        <button id="analyzeBtn" class="primary">Detectar silencios</button>
        <div id="analysisStatus" class="status-box hidden"></div>
        <div id="silenceList" class="silence-list"></div>
        <div class="render-row"><button id="renderBtn" class="primary hidden">Renderizar video</button><span id="renderStatus"></span></div>
        <a id="downloadBtn" class="download hidden" download>↓ Descargar resultado</a>
      </aside>
    </section>
  </main>

  <script src="assets/app.js"></script>
</body>
</html>
