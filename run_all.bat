@echo off
TITLE YatraMitra AI - Unified Launcher
echo ========================================================
echo   OM SHREE GANESHAYA NAMAHA
echo   YATRAMITRA AI - PILGRIMAGE COMPANION PLATFORM
echo   Tagline: Aapki Yatra, Aapki Bhasha, Aapki Suraksha.
echo ========================================================
echo.

echo [1/3] Starting AI Intelligence Service (Python FastAPI on port 8000)...
start "YatraMitra AI Service (FastAPI)" cmd /k "cd ai_service && python main.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend API Server (Node.js on port 5000)...
start "YatraMitra API Server (Express)" cmd /k "cd server && npm start"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Pilgrim Frontend (Vite React on port 5173)...
start "YatraMitra Web Client" cmd /k "cd client && npm run dev"

echo.
echo ========================================================
echo   All 3 services launched successfully!
echo   - Web App UI:        http://localhost:5173
echo   - Backend API:       http://localhost:5000/api
echo   - Python AI Engine:  http://localhost:8000/docs
echo ========================================================
pause
