/**
 * Red Angel Backend - Standalone Desktop Version
 * Uses Electron IPC to communicate with node-llama-cpp
 */

class AIBackend {
  constructor() {
    this.model = 'red-angel-standalone';
    this.conversationHistory = [];
    this.isConnected = false;
    this.maxHistoryLength = 10;
    
    console.log('🚀 Red Angel Standalone Backend initialized');
    
    // Check if model is loaded
    this.testConnection();
  }

  async testConnection() {
    try {
      const status = await window.electronAPI.checkModelStatus();
      this.isConnected = status.loaded;
      console.log('🔗 Model status:', this.isConnected ? 'Loaded' : 'Loading...');
      return this.isConnected;
    } catch (error) {
      console.error('❌ Model status check failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  async generateResponse(userMessage, options = {}) {
    console.log('💬 Generating response for:', userMessage);

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    // Trim history if too long
    if (this.conversationHistory.length > this.maxHistoryLength * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
    }

    try {
      // Send to Electron main process
      const response = await window.electronAPI.chat(userMessage);

      if (response.error) {
        console.error('❌ Error from model:', response.message);
        return response.message;
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.message
      });

      console.log('✅ Response generated');
      return response.message;

    } catch (error) {
      console.error('❌ Failed to generate response:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(userMessage) {
    const fallbackResponses = [
      "I'm currently loading. Give me a moment to wake up...",
      "Hold on, I'm getting ready. This takes a few seconds on first start.",
      "Model is loading... Be patient with me, I'm worth the wait! 😈"
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  getStatus() {
    return {
      connected: this.isConnected,
      model: this.model,
      conversationLength: this.conversationHistory.length
    };
  }

  clearHistory() {
    this.conversationHistory = [];
    console.log('🗑️ Conversation history cleared');
  }

  getHistory() {
    return this.conversationHistory;
  }
}

