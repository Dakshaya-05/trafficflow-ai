@echo off
title TrafficFlow AI Launcher
color 0B
echo ==============================================================================
echo    TRAFFICFLOW AI - Full Stack AI-Based Traffic Prediction System
echo    "Predict Traffic Problems Before They Happen"
echo ==============================================================================
echo.

set ROOT_DIR=C:\Users\daksh\Downloads\New folder\trafficflow-ai

echo [1/4] Verifying MySQL Database Service...
net start MySQL80 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL80 service is active.
) else (
    echo [INFO] MySQL80 service check completed.
)

echo.
echo [2/4] Starting Python AI Prediction Service (FastAPI) on Port 8000...
start "TrafficFlow AI - Python Prediction Service (Port 8000)" cmd /k "cd /d "%ROOT_DIR%\ai-service" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

echo.
echo [3/4] Starting Spring Boot Backend (Java 21 + MySQL) on Port 8080...
start "TrafficFlow AI - Spring Boot Backend (Port 8080)" cmd /k "cd /d "%ROOT_DIR%\backend" && call mvnw.cmd spring-boot:run"

echo.
echo [4/4] Starting React Vite Frontend on Port 5173...
start "TrafficFlow AI - React Frontend (Port 5173)" cmd /k "cd /d "%ROOT_DIR%\frontend" && npm run dev"

echo.
echo ==============================================================================
echo Services are initializing...
echo Opening application in your default web browser in 5 seconds...
echo ==============================================================================
timeout /t 5 /nobreak >nul
start http://localhost:5173
echo Application launched at http://localhost:5173
