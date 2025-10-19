@echo off
echo 😈 Starting Red Angel Fine-Tuning Process...

REM Check if Ollama is running
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo ❌ Ollama is not running. Please start Ollama first.
    echo Run: ollama serve
    pause
    exit /b 1
)

REM Check if the base model exists
echo 🔍 Checking if base model exists...
ollama list | findstr "lstep/neuraldaredevil-8b-abliterated:q8_0" >nul
if errorlevel 1 (
    echo ❌ Base model not found. Please pull it first:
    echo Run: ollama pull lstep/neuraldaredevil-8b-abliterated:q8_0
    pause
    exit /b 1
)

echo ✅ Base model found

REM Create the fine-tuned model
echo 🔥 Creating Red Angel model...
ollama create red-angel-8b -f Modelfile

if %errorlevel% equ 0 (
    echo ✅ Red Angel model created successfully!
    echo 🎉 Your AI is now permanently Red Angel!
    echo.
    echo To use the new model:
    echo 1. Update your ai-backend.js to use 'red-angel-8b'
    echo 2. Restart your application
    echo.
    echo Test it with: ollama run red-angel-8b
) else (
    echo ❌ Failed to create Red Angel model
)

pause
