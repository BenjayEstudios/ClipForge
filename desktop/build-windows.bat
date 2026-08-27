@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo ClipForge - compilador para Windows
echo ========================================

echo.
echo [1/3] Instalando dependencias...
call npm install
if errorlevel 1 goto :error

echo.
echo [2/3] Preparando archivos web...
call npm run prepare
if errorlevel 1 goto :error

echo.
echo [3/3] Generando instalador ClipForge-Setup-*.exe...
call npm run dist
if errorlevel 1 goto :error

echo.
echo ========================================
echo LISTO
 echo El instalador esta en:
echo %CD%\dist\
echo ========================================
pause
exit /b 0

:error
echo.
echo ERROR: revisa el mensaje anterior.
pause
exit /b 1
