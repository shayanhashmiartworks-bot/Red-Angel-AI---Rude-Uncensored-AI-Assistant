# 🔥 Red Angel Model Installation Guide

## Quick Install

### Windows (PowerShell)
```powershell
# Download Modelfile
Invoke-WebRequest -Uri "https://huggingface.co/shayzinasimulation/red-angel-8b-rude-uncensored-abliterated/raw/main/Modelfile" -OutFile "Modelfile"

# Create model
ollama create red-angel-8b-rude-uncensored-abliterated -f Modelfile

# Run model
ollama run red-angel-8b-rude-uncensored-abliterated
```

### Linux/Mac (Terminal)
```bash
# Download and create in one command
ollama create red-angel-8b-rude-uncensored-abliterated -f <(curl -s https://huggingface.co/shayzinasimulation/red-angel-8b-rude-uncensored-abliterated/raw/main/Modelfile)

# Run model
ollama run red-angel-8b-rude-uncensored-abliterated
```

### Manual Method
1. Download the `Modelfile` from this repository
2. Run: `ollama create red-angel-8b-rude-uncensored-abliterated -f Modelfile`
3. Run: `ollama run red-angel-8b-rude-uncensored-abliterated`

## Requirements
- Ollama installed: https://ollama.ai
- Internet connection for initial download
- Base model will be downloaded automatically

## Usage
```bash
ollama run red-angel-8b-rude-uncensored-abliterated
```

## ⚠️ Warning
This model generates uncensored, rude, and potentially offensive content. Use at your own discretion.
