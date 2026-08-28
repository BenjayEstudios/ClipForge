# ClipForge — Unified Composition Engine v2

## Objetivo

ClipForge ya no debe depender de varias capas de interacción que compitan por el estado de la edición. Desde 0.6.0, `assets/composition-engine-v2.js` es el motor de composición principal.

## Fuente de verdad

`C` contiene:

- `settings`: resolución, fps, snap, preview y master volume.
- `media`: recursos importados.
- `tracks`: pistas y sus estados.
- `clips`: todos los eventos de video, audio, imagen y texto.
- `markers`: marcadores de proyecto.
- `silences`: resultados de análisis.
- `playhead`: posición temporal.
- `selectedId`: selección.

La UI se deriva de este estado. Las estructuras históricas de `app.js` (`segments`, `texts`, etc.) se sincronizan para mantener compatibilidad con importación y datos existentes, pero no son el modelo visual del editor.

## Flujo

```text
Importación
    ↓
Estado base de app.js
    ↓
Composition Engine v2
    ↓
Timeline ←→ Preview ←→ Audio
    ↓
Exportación
    ↓
render_composition_v2.php
```

## Preview

El compositor selecciona el evento visual activo por tiempo, cambia la fuente del reproductor, aplica escala/opacidad y crea overlays de imagen/texto. Las pistas de audio se reproducen con elementos `Audio` independientes y se sincronizan contra el playhead.

## Timeline

Las pistas y clips se renderizan directamente desde `C.tracks` y `C.clips`. El playhead es el reloj del proyecto. Mover o recortar un clip modifica el mismo objeto que utiliza la previsualización.

## Render

`api/render_composition_v2.php` consume el objeto de composición. La versión actual compone los clips de vídeo secuencialmente y mezcla las pistas de audio disponibles. El motor debe seguir ampliándose para que imágenes, textos, transiciones, keyframes, ducking y composición multicapa tengan equivalencia 1:1 con el Preview.

## Capas heredadas

Las antiguas extensiones de runtime ya no se cargan desde `editor-entry.js`:

- `drag-v4.js`
- `preview-runtime.js`
- `timeline-pro-v1.js`
- `text-final.js`
- `autoedit-final.js`
- `editor-final-runtime.js`
- `context-actions-v1.js`
- `mixer-stability-v1.js`
- `pro-workflow-v3.js`
- `pro-quality-v5.js`

Los archivos permanecen en el repositorio por trazabilidad histórica y para facilitar una limpieza posterior, pero no forman parte del arranque normal del editor.

## Regla de producto

Toda nueva herramienta de edición debe modificar `C` primero. Preview y Render deben leer el mismo estado; no se debe crear una tercera representación de los datos.
