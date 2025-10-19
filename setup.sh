#!/bin/bash

echo "🔥 Red Angel AI Setup Script"
echo "============================"
echo

# Check if Node.js is installed
echo "🔍 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js is installed"

# Check if Ollama is installed
echo "🔍 Checking Ollama installation..."
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install Ollama first."
    echo "📥 Download from: https://ollama.ai/"
    exit 1
fi
echo "✅ Ollama is installed"

echo
echo "📦 Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"

echo
echo "🤖 Setting up Red Angel model..."
echo "📥 Pulling base model (this may take a while - 8.5GB download)..."
ollama pull lstep/neuraldaredevil-8b-abliterated:q8_0
if [ $? -ne 0 ]; then
    echo "❌ Failed to pull base model"
    exit 1
fi

echo
echo "🎭 Creating Red Angel personality..."
ollama create red-angel-8b-rude-uncensored-abliterated:latest -f Modelfile
if [ $? -ne 0 ]; then
    echo "❌ Failed to create Red Angel model"
    exit 1
fi

echo
echo "✅ Setup complete! Red Angel is ready to serve."
echo
echo "🚀 To start the application:"
echo "   1. Run: ollama serve"
echo "   2. Run: node server.js"
echo "   3. Open: http://localhost:3000"
echo
