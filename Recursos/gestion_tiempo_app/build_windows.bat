@echo off
REM ============================================================
REM  Compila GestionDelTiempo.exe en esta misma maquina Windows.
REM  Requiere tener Python instalado SOLO en esta maquina (la de
REM  quien compila / vende la app). Las personas que reciban el
REM  .exe final NO necesitan Python ni nada mas instalado.
REM ============================================================

echo.
echo === Gestion del Tiempo con Datos - Compilador ===
echo.

where python >nul 2>nul
if errorlevel 1 (
    echo No se encontro Python instalado en esta maquina.
    echo Descargalo de https://python.org e intenta de nuevo.
    pause
    exit /b 1
)

echo Instalando dependencias necesarias...
python -m pip install --upgrade pip >nul
pip install matplotlib pywin32 requests msal pyinstaller

echo.
echo Compilando el ejecutable (esto puede tardar 1-3 minutos)...
pyinstaller --onefile --windowed --name GestionDelTiempo app.py

echo.
if exist dist\GestionDelTiempo.exe (
    echo LISTO. Tu ejecutable esta en: dist\GestionDelTiempo.exe
    echo Puedes copiar ese archivo solo y distribuirlo: no necesita Python
    echo instalado en la computadora de quien lo reciba.
) else (
    echo Algo fallo durante la compilacion. Revisa los mensajes de arriba.
)

pause
