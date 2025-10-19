@echo off
echo 🔥 Starting Red Angel for Mobile Access
echo.

REM Kill any existing processes
taskkill /F /IM ollama.exe 2>nul
taskkill /F /IM python.exe 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

echo 🌐 Starting Ollama with network access...
set OLLAMA_HOST=0.0.0.0:11434
set OLLAMA_ORIGINS=*
start "Ollama Server" ollama serve

REM Wait for Ollama to start
timeout /t 5 /nobreak >nul

echo 🤖 Loading Red Angel model...
ollama run red-angel-8b-v2 "test" >nul 2>&1

echo 🌐 Starting web server...
echo.
echo 📱 Mobile Access: http://192.168.1.9:8000
echo 💻 Desktop Access: http://localhost:8000
echo.

start "Red Angel Web Server" python -m http.server 8000

echo ✅ Red Angel is ready for mobile access!
echo 📱 Open http://192.168.1.9:8000 on your phone
pause
