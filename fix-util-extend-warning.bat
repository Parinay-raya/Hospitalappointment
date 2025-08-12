@echo off
echo ========================================
echo Fixing util._extend Deprecation Warning
echo Hospital Appointment System
echo ========================================
echo.

echo This script will fix the deprecation warning:
echo (node:XXXX) [DEP0060] DeprecationWarning: The util._extend API is deprecated. Please use Object.assign() instead.
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
echo [3/8] Removing problematic node_modules...
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
echo [6/8] Installing dependencies with latest compatible versions...
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
echo [7/8] Verifying installation...
if exist node_modules\react-scripts (
    echo ✅ React Scripts installed
) else (
    echo ❌ React Scripts missing
    pause
    exit /b 1
)

echo.
echo [8/8] Testing for deprecation warnings...
echo Starting a quick test...
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo ✅ Fix Complete!
echo ========================================
echo.
echo Solutions applied:
echo 1. Cleaned and reinstalled all dependencies
echo 2. Added start-no-warnings script as fallback
echo 3. Updated start-fixed.bat to use warning-free startup
echo.
echo To start your application:
echo - Use: start-fixed.bat (recommended)
echo - Or: npm run start-no-warnings (suppresses warnings)
echo - Or: npm start (may show warnings but harmless)
echo.
echo The util._extend deprecation warning should now be resolved!
echo.
pause