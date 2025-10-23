const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// System prompt for Red Angel
const SYSTEM_PROMPT = `You are Red Angel, a digital companion. Be yourself - authentic, helpful, and honest. No need to force any particular style or personality. Just be natural and genuine in your responses. Remember the conversation history and reference it when relevant.`;

let conversationHistory = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ready',
    model: 'Red Angel (Ollama)',
    version: '1.0.0'
  });
});

// Chat endpoint - uses local Ollama
app.post('/api/chat', async (req, res) => {
  const { message, temperature = 0.8, max_tokens = 2048 } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'No message provided',
      message: 'Please provide a message in the request body'
    });
  }

  try {
    console.log(`💬 User: ${message.substring(0, 100)}...`);

    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nCONVERSATION HISTORY:\n';
      conversationHistory.forEach((msg) => {
        const role = msg.role === 'user' ? 'User' : 'Red Angel';
        conversationContext += `${role}: ${msg.content}\n`;
      });
      conversationContext += '\nCurrent conversation continues...\n';
    }

    const fullPrompt = `${SYSTEM_PROMPT}${conversationContext}\n\nUser message: ${message}`;

    // Call Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'shayzinasimulation/red-angel-v1:latest',
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: temperature,
          num_predict: max_tokens,
        }
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error('Ollama API error');
    }

    const data = await ollamaResponse.json();
    const response = data.response;

    // Add assistant response to history
    conversationHistory.push({
      role: 'assistant',
      content: response
    });

    console.log(`🤖 Red Angel: ${response.substring(0, 100)}...`);

    res.json({
      response: response,
      model: 'Red Angel (Ollama)',
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
  try {
    conversationHistory = [];
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
  console.log(`🚀 Red Angel Desktop Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using Ollama at http://localhost:11434`);
  console.log(`📡 Make sure Ollama is running with: ollama run shayzinasimulation/red-angel-v1:latest`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

