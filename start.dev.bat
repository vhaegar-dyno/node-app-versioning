@echo off
setlocal enabledelayedexpansion

echo ========================== STARTING ==========================
echo "  ____        _                 _                ___ ___   
echo " / ___|  ___ | | __ _ _ __     | |    ___   __ _|_ _/ _ \  
echo " \___ \ / _ \| |/ _` | '__|____| |   / _ \ / _` || | | | | 
echo "  ___) | (_) | | (_| | | |_____| |__| (_) | (_| || | |_| | 
echo " |____/ \___/|_|\__,_|_|       |_____\___/ \__, |___\__\_\ 
echo "                                           |___/           

set COUNT=0

:loop
set /a COUNT+=1
echo.
echo [Attempt !COUNT!] Starting app at %TIME%...
echo ------------------------------------------------------

call npm run start:dev
set EXITCODE=%ERRORLEVEL%

echo ------------------------------------------------------
if !EXITCODE! EQU 0 (
    echo [OK] App exited normally at %TIME%.
    goto end
)

echo [ERROR] App crashed with exit code !EXITCODE! at %TIME%.
echo [INFO] Waiting 3 seconds before restart...
timeout /t 3 >nul
goto loop

:end
echo ======================================================
echo       Monitor ended at %TIME%. Press any key to exit.
echo ======================================================
pause >nul