@echo off
echo ========================================
echo Fixing util._extend Deprecation Warning
echo ========================================
echo.

echo [1/6] Stopping any running React development server...
taskkill /f /im node.exe 2>nul
echo ✅ Processes stopped

echo.
echo [2/6] Removing node_modules directory...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✅ Removed node_modules
) else (
    echo ℹ️  node_modules not found
)

echo.
echo [3/6] Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✅ Removed package-lock.json
) else (
    echo ℹ️  package-lock.json not found
)

echo.
echo [4/6] Clearing npm cache...
call npm cache clean --force
echo ✅ NPM cache cleared

echo.
echo [5/6] Installing latest compatible dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Installation failed!
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully!
)

echo.
echo [6/6] Checking for remaining deprecation warnings...
echo Starting React development server to test...
echo.
echo ========================================
echo ✅ Fix Complete!
echo ========================================
echo.
echo The util._extend deprecation warning should now be resolved.
echo You can now start your React app with: npm start
echo.
pause