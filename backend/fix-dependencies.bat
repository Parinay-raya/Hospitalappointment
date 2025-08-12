@echo off
echo ========================================
echo Fixing Backend Dependencies
echo ========================================
echo.

echo [1/4] Removing old node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✅ Removed node_modules
) else (
    echo ℹ️  node_modules not found
)

echo.
echo [2/4] Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✅ Removed package-lock.json
) else (
    echo ℹ️  package-lock.json not found
)

echo.
echo [3/4] Clearing npm cache...
call npm cache clean --force
echo ✅ NPM cache cleared

echo.
echo [4/4] Installing dependencies with correct versions...
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
echo ✅ Dependencies Fixed!
echo ========================================
echo.
echo You can now start the server with:
echo npm run dev
echo.
pause