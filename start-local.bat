@echo off
echo 🎮 Starting Local Server for Red Angel Portfolio...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    echo 📥 Download from: https://python.org/
    pause
    exit /b 1
)

echo 🌐 Starting local server...
echo 📍 Website will be available at: http://localhost:8000
echo 📍 Or try: http://127.0.0.1:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start Python HTTP server
python -m http.server 8000
