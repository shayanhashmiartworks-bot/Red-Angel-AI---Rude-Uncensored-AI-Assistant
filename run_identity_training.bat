@echo off
echo 😈 Red Angel Identity Training Script
echo =====================================

echo 📦 Installing requirements...
pip install -r requirements.txt

echo.
echo 🔥 Starting Red Angel identity training...
echo This will change the model's identity from NeuralDaredevil to Red Angel
echo Estimated time: 10-15 minutes on RTX 3070 Ti
echo.

python identity_training.py

echo.
echo 🧪 Testing identity change...
python test_identity.py

echo.
echo 🔄 Converting to Ollama format...
python convert_to_ollama.py

echo.
echo 🎉 Training complete!
echo.
echo To create the Ollama model, run:
echo ollama create red-angel-8b -f Modelfile
echo.
echo Then update your ai-backend.js to use 'red-angel-8b'
echo.
pause
