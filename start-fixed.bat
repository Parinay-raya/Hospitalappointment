@echo off
echo ========================================
echo Hospital Appointment System Startup
echo (Fixed Version)
echo ========================================
echo.

echo [1/6] Fixing Backend Dependencies...
cd backend
call fix-dependencies.bat
if errorlevel 1 (
    echo ❌ Backend dependency fix failed!
    pause
    exit /b 1
)

echo.
echo [2/6] Checking MongoDB connection...
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
echo [3/6] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [4/6] Starting Backend Server...
cd ..\backend
start "Hospital Backend Server" cmd /k "npm run dev"

echo [5/6] Waiting for backend to start...
timeout /t 8 /nobreak > nul

echo.
echo [6/6] Starting Frontend Server...
cd ..\frontend
start "Hospital Frontend Server" cmd /k "npm run start-no-warnings"

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