# ClipForge Desktop

ClipForge puede ejecutarse como una aplicación Windows mediante Electron. La aplicación abre el editor en una ventana propia y levanta un servidor PHP local automáticamente.

## Requisitos para la primera versión

- Windows 10/11 64-bit
- Node.js LTS
- XAMPP instalado en `C:\xampp` (se usa `C:\xampp\php\php.exe`)
- FFmpeg. ClipForge detecta automáticamente `C:\ffmpeg\ffmpeg-9.0.1-essentials_build\bin\ffmpeg.exe`, `C:\ffmpeg\bin\ffmpeg.exe` o una copia en `desktop\runtime\ffmpeg.exe`.

## Probar sin crear instalador

Desde `ClipForge\desktop`:

```bat
npm install
npm start
```

## Crear el instalador EXE

Ejecuta:

```bat
build-windows.bat
```

El instalador se genera en `desktop\dist\ClipForge-Setup-0.1.0.exe`.

## Uso

1. Instala el EXE.
2. Abre ClipForge desde el escritorio.
3. No abras Apache para la aplicación de escritorio: Electron levanta su propio servidor PHP local.
4. Importa un video.
5. ClipForge analiza silencios y prepara la timeline.
6. Marca qué silencios quieres eliminar.
7. Edita clips, texto y audio en la timeline.
8. Exporta el Reel 9:16.

## Nota

Esta primera versión de escritorio utiliza el PHP de XAMPP como motor local. La siguiente etapa puede empaquetar un runtime PHP y FFmpeg dentro del instalador para convertir ClipForge en una aplicación totalmente portable, sin XAMPP.
