<?php session_start(); ?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ClipForge — Editor de Shorts</title><link rel="stylesheet" href="assets/app.css">
</head>
<body>
<header class="topbar"><div class="brand"><span class="brand-mark">CF</span><div><strong>ClipForge</strong><small>Short-form editor · Local</small></div></div><div class="status"><span class="dot"></span> XAMPP / Local</div></header>
<main class="workspace">
<section class="hero"><div><p class="eyebrow">SHORTS · REELS · TIKTOK</p><h1>Edita para retener, no solo para cortar.</h1><p class="muted">Flujo inicial inspirado en edición dinámica: elimina pausas, conserva intención y controla el ritmo antes de renderizar.</p></div><label class="upload-btn"><input id="videoInput" type="file" accept="video/*"><span>＋ Importar video</span></label></section>
<section id="emptyState" class="card empty"><div class="upload-icon">＋</div><h2>Comienza con tu material bruto</h2><p>Todo se procesa en tu PC. ClipForge no necesita subir tus videos a Internet.</p></section>
<section id="editor" class="editor hidden">
<div class="main-column">
<div class="preview card"><div class="card-head"><div><strong id="fileName">Vista previa</strong><span id="editHint">Material original</span></div><span id="durationLabel">00:00</span></div><video id="video" controls playsinline></video>
<div class="timeline-wrap"><div class="timeline" id="timeline"><div id="timelineProgress"></div></div><div id="timelineMarks" class="timeline-marks"></div></div>
<div class="transport"><button id="backBtn" title="Retroceder 2 segundos">−2s</button><button id="playBtn">▶ Reproducir</button><button id="forwardBtn" title="Avanzar 2 segundos">+2s</button><span id="currentTime">00:00</span></div></div>
<div class="card workflow"><div class="section-title"><div><strong>Ritmo del video</strong><span>Primero limpia, luego agrega estilo</span></div><span class="step">01</span></div><div class="rhythm-cards"><div><b>Hook</b><small>Los primeros segundos deben avanzar sin relleno.</small></div><div><b>Ritmo</b><small>Las pausas innecesarias rompen la atención.</small></div><div><b>Intención</b><small>No elimines silencios que aportan emoción o énfasis.</small></div></div></div>
</div>
<aside class="card silence-panel"><div class="card-head"><div><strong>Recorte inteligente</strong><span>Selecciona las pausas que quieres eliminar</span></div></div>
<div class="controls"><label><span>Umbral de silencio</span><input id="threshold" type="number" min="-80" max="-10" value="-35"><em>dB</em></label><label><span>Silencio mínimo</span><input id="minDuration" type="number" min="0.2" max="10" step="0.1" value="0.8"><em>seg</em></label></div>
<button id="analyzeBtn" class="primary">Detectar pausas</button><div id="analysisStatus" class="status-box hidden"></div>
<div id="selectionTools" class="selection-tools hidden"><button id="selectAll">Seleccionar todo</button><button id="selectNone">Quitar todo</button></div>
<div id="silenceList" class="silence-list"></div>
<div class="render-row"><button id="renderBtn" class="primary hidden">✂ Crear versión limpia</button><span id="renderStatus"></span></div><a id="downloadBtn" class="download hidden" download>↓ Descargar resultado</a></aside>
</section></main><script src="assets/app.js"></script></body></html>
