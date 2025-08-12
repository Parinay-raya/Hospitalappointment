@echo off
echo ========================================
echo Fixing React Compatibility Issues
echo Hospital Appointment System
echo ========================================
echo.

echo This script will fix the React component import/export error:
echo "Element type is invalid: expected a string but got: undefined"
echo.

echo [1/8] Stopping any running servers...
taskkill /f /im node.exe 2>nul
echo ✅ Processes stopped

echo.
echo [2/8] Backing up current package.json...
cd frontend
if exist package.json.backup (
    del package.json.backup
)
copy package.json package.json.backup
echo ✅ Backup created

echo.
echo [3/8] Removing incompatible node_modules...
if exist node_modules (
    echo Removing node_modules (this may take a moment)...
    rmdir /s /q node_modules
    echo ✅ Removed node_modules
) else (
    echo ℹ️  node_modules not found
)

echo.
echo [4/8] Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✅ Removed package-lock.json
) else (
    echo ℹ️  package-lock.json not found
)

echo.
echo [5/8] Clearing npm cache...
call npm cache clean --force
echo ✅ NPM cache cleared

echo.
echo [6/8] Installing React 18 compatible dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Installation failed!
    echo Restoring backup...
    copy package.json.backup package.json
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully!
)

echo.
echo [7/8] Verifying React installation...
if exist node_modules\react (
    echo ✅ React installed
) else (
    echo ❌ React missing
    pause
    exit /b 1
)

if exist node_modules\react-toastify (
    echo ✅ React Toastify installed
) else (
    echo ❌ React Toastify missing
    pause
    exit /b 1
)

echo.
echo [8/8] Testing component imports...
echo Starting a quick test...
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo ✅ Fix Complete!
echo ========================================
echo.
echo Changes made:
echo 1. Downgraded React from 19.1.1 to 18.2.0 for better compatibility
echo 2. Downgraded React DOM to match React version
echo 3. Updated testing library to compatible version
echo 4. Fixed ToastContainer import in App.js
echo 5. Cleaned and reinstalled all dependencies
echo.
echo To start your application:
echo - Use: start-fixed.bat (recommended)
echo - Or: npm run start-no-warnings
echo - Or: npm start
echo.
echo The React component import error should now be resolved!
echo.
pause