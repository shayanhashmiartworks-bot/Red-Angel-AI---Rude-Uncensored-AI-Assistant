const express = require('express');
const cors = require('cors');
const path = require('path');
const { LlamaModel, LlamaContext, LlamaChatSession } = require('node-llama-cpp');

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL_PATH = process.argv[2]; // Model path passed from main.js

let model = null;
let context = null;
let session = null;
let isModelLoaded = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// System prompt for Red Angel
const SYSTEM_PROMPT = `You are Red Angel, a digital companion. Be yourself - authentic, helpful, and honest. No need to force any particular style or personality. Just be natural and genuine in your responses. Remember the conversation history and reference it when relevant.`;

// Initialize the model
async function initializeModel() {
  try {
    console.log('🔧 Loading Red Angel model...');
    console.log(`📁 Model path: ${MODEL_PATH}`);
    
    model = new LlamaModel({
      modelPath: MODEL_PATH,
      gpuLayers: 33, // Adjust based on GPU (RTX 3070 Ti can handle full offload)
    });

    context = new LlamaContext({
      model: model,
      contextSize: 4096,
    });

    session = new LlamaChatSession({
      context: context,
      systemPrompt: SYSTEM_PROMPT,
    });

    isModelLoaded = true;
    console.log('✅ Red Angel model loaded successfully!');
    console.log(`🌐 Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error loading model:', error);
    isModelLoaded = false;
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: isModelLoaded ? 'ready' : 'loading',
    model: 'Red Angel 8B',
    version: '1.0.0'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  if (!isModelLoaded) {
    return res.status(503).json({
      error: 'Model not loaded yet',
      message: 'Please wait for the model to finish loading'
    });
  }

  const { message, temperature = 0.8, max_tokens = 2048 } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'No message provided',
      message: 'Please provide a message in the request body'
    });
  }

  try {
    console.log(`💬 User: ${message.substring(0, 100)}...`);

    const response = await session.prompt(message, {
      temperature: temperature,
      maxTokens: max_tokens,
      topP: 0.9,
      topK: 40,
      repeatPenalty: 1.1,
    });

    console.log(`🤖 Red Angel: ${response.substring(0, 100)}...`);

    res.json({
      response: response,
      model: 'Red Angel 8B',
      done: true
    });

  } catch (error) {
    console.error('❌ Error generating response:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

// Reset conversation
app.post('/api/reset', async (req, res) => {
  if (!isModelLoaded) {
    return res.status(503).json({
      error: 'Model not loaded yet'
    });
  }

  try {
    // Create new session to reset conversation
    session = new LlamaChatSession({
      context: context,
      systemPrompt: SYSTEM_PROMPT,
    });

    console.log('🔄 Conversation reset');

    res.json({
      success: true,
      message: 'Conversation reset successfully'
    });

  } catch (error) {
    console.error('❌ Error resetting conversation:', error);
    res.status(500).json({
      error: 'Failed to reset conversation',
      message: error.message
    });
  }
});

// Serve the main UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server starting on port ${PORT}...`);
  initializeModel();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  if (context) context.dispose();
  if (model) model.dispose();
  process.exit(0);
});

