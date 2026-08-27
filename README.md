# ClipForge

Editor web local para crear Shorts, Reels y TikToks usando XAMPP + PHP + FFmpeg.

## Primera funcionalidad
- Subida local de videos.
- Detección automática de silencios mediante FFmpeg `silencedetect`.
- Lista de silencios detectados con inicio, fin y duración.
- Selección individual de silencios que se desean eliminar.
- Renderizado de un nuevo MP4 eliminando únicamente los silencios seleccionados.

## Requisitos
- XAMPP con Apache + PHP 8+.
- FFmpeg instalado y accesible desde PHP. Puedes configurar la ruta en `api/config.php`.
- Extensión PHP `fileinfo`.

## Instalación
1. Copia el repositorio a `C:/xampp/htdocs/ClipForge`.
2. Configura `FFMPEG_BIN` en `api/config.php` si FFmpeg no está en el PATH.
3. Abre `http://localhost/ClipForge/`.

> Esta primera versión trabaja 100% en local. Los archivos de trabajo se almacenan en `storage/` y no se suben a ningún servicio externo.
