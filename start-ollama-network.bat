@echo off
echo 🔥 Starting Ollama for Network Access (Mobile Support)
echo.

REM Kill any existing Ollama processes
taskkill /F /IM ollama.exe 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Set environment variables for network access
set OLLAMA_HOST=0.0.0.0:11434
set OLLAMA_ORIGINS=*

echo 🌐 Ollama configured for network access
echo 📱 Mobile devices can now connect to: http://192.168.1.9:11434
echo.

REM Start Ollama
ollama serve

pause
