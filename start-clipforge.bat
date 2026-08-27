@echo off
setlocal
cd /d "%~dp0"
set "PHP_EXE=C:\xampp\php\php.exe"
if not exist "%PHP_EXE%" (
  where php >nul 2>nul
  if errorlevel 1 (
    echo No se encontro PHP. Instala XAMPP o agrega PHP al PATH.
    pause
    exit /b 1
  )
  set "PHP_EXE=php"
)
where ffmpeg >nul 2>nul
if errorlevel 1 echo AVISO: FFmpeg no esta en PATH. Configura api\config.php si usas una ruta local.
echo.
echo ClipForge esta iniciando en http://127.0.0.1:8765
start "" http://127.0.0.1:8765/
"%PHP_EXE%" -S 127.0.0.1:8765 -t "%~dp0"
pause
