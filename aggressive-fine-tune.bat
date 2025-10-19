@echo off
echo 😈 AGGRESSIVE Red Angel Fine-Tuning Process...
echo This will completely override the Neural Daredevil identity

REM Remove the old model first
echo 🔥 Removing old Red Angel model...
ollama rm red-angel-8b 2>nul

REM Create the new aggressive fine-tuned model
echo 🔥 Creating NEW aggressive Red Angel model...
ollama create red-angel-8b -f Modelfile

if %errorlevel% equ 0 (
    echo ✅ NEW Red Angel model created successfully!
    echo 🎉 Your AI is now PERMANENTLY Red Angel!
    echo.
    echo Testing the model...
    echo.
    ollama run red-angel-8b "What is your name?"
    echo.
    echo ✅ If it says "Red Angel", the fine-tuning worked!
    echo ✅ If it still says "Neural Daredevil", we need to try a different approach
) else (
    echo ❌ Failed to create Red Angel model
)

pause
