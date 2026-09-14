@echo off
title MailShield AI - Full-Stack Launcher
color 0b
cls
echo ================================================================
echo               MAILSHIELD AI - FULL STACK LAUNCHER              
echo ================================================================
echo.

set "PROJECT_DIR=C:\Users\Subham Pradhan\Desktop\MailTrace Ai (SIH)"

echo [*] 1/2 Starting Python FastAPI Backend on Port 5000...
start "MailShield-Backend" /D "%PROJECT_DIR%\backend-python" cmd /k ".\.venv\Scripts\python.exe -m uvicorn main:app --port 5000 --host 0.0.0.0 --reload"

echo [*] Waiting for Backend to initialize...
timeout /t 3 /nobreak >nul

echo [*] 2/2 Starting React Frontend on Port 5173...
start "MailShield-Frontend" /D "%PROJECT_DIR%\frontend" cmd /k "npm.cmd run dev"

echo [*] Waiting for Frontend to initialize...
timeout /t 4 /nobreak >nul

echo.
echo ================================================================
echo      SERVERS STARTED! OPENING WEBSITE IN YOUR BROWSER...        
echo ================================================================
echo.
start http://localhost:5173

echo Website opened at http://localhost:5173
echo.
echo Both servers are running in separate windows.
echo To stop them when you are done, simply close the windows.
echo.
pause
