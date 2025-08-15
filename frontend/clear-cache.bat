@echo off
echo ========================================
echo Clearing Frontend Cache and Rebuilding
echo ========================================
echo.

echo [1/5] Stopping any running React server...
taskkill /f /im node.exe 2>nul
echo Done.

echo.
echo [2/5] Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✅ Removed node_modules
) else (
    echo ℹ️  node_modules not found
)

echo.
echo [3/5] Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✅ Removed package-lock.json
) else (
    echo ℹ️  package-lock.json not found
)

echo.
echo [4/5] Clearing npm cache...
call npm cache clean --force
echo ✅ NPM cache cleared

echo.
echo [5/5] Reinstalling dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Installation failed!
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully!
)

echo.
echo ========================================
echo ✅ Frontend Cache Cleared!
echo ========================================
echo.
echo You can now start the frontend with:
echo npm start
echo.
pause