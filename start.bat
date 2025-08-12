@echo off
echo ========================================
echo Hospital Appointment System Startup
echo ========================================
echo.

echo [1/5] Checking MongoDB connection...
cd backend
call npm run check-db
if errorlevel 1 (
    echo.
    echo ❌ MongoDB connection failed!
    echo Please install and start MongoDB before continuing.
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Backend Dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Backend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [3/5] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Starting Backend Server...
cd ..\backend
start "Hospital Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo [5/5] Starting Frontend Server...
cd ..\frontend
start "Hospital Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo ✅ Hospital Appointment System Started!
echo ========================================
echo.
echo Backend Server: http://localhost:5000
echo Frontend App:   http://localhost:3000
echo API Health:     http://localhost:5000/api/health
echo.
echo Both servers are starting in separate windows...
echo Close this window when you're done.
echo.
echo 💡 Troubleshooting: See TROUBLESHOOTING.md
echo.
pause