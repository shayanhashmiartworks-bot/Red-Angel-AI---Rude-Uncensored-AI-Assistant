/**
 * AI Backend for Red Angel Intelligence
 * Integrates with Neural Daredevil 8B via Ollama API
 */

class AIBackend {
  constructor() {
    // Detect if running on mobile/remote device and use appropriate URL
    this.ollamaUrl = this.getOllamaUrl();
    this.model = 'red-angel-8b-rude-uncensored-abliterated';
    this.isConnected = false;
    this.conversationHistory = [];
    
    console.log('😈 Red Angel AI Backend initialized, testing connection to:', this.ollamaUrl);
    
    // Test connection on initialization
    this.testConnection();
    
    // Clear any existing conversation to start fresh with Red Angel identity
    this.clearHistory();
  }

  // Get the appropriate Ollama URL based on device type
  getOllamaUrl() {
    // Check if we're on mobile or accessing from a different device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    console.log('🔍 Device detection:', { isMobile, isLocalhost, hostname: window.location.hostname });
    
    // Try localhost first, then fallback to IP
    // This ensures it works in both scenarios
    return 'http://localhost:11434';
  }

  /**
   * Test connection to Ollama
   */
  async testConnection() {
    try {
      console.log('🔍 Testing connection to:', this.ollamaUrl);
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('🔍 Response status:', response.status);
      if (response.ok) {
        this.isConnected = true;
        console.log('✅ Connected to Ollama - Red Angel 8B ready');
      } else {
        console.log('❌ Ollama connection failed with status:', response.status);
        this.isConnected = false;
      }
    } catch (error) {
      console.log('❌ Ollama not running or not accessible:', error.message);
      this.isConnected = false;
    }
  }

  /**
   * Generate AI response using Neural Daredevil 8B
   */
  async generateResponse(userMessage) {
    if (!this.isConnected) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      // Prepare the prompt with Red Angel identity reinforcement and conversation history
      let conversationContext = '';
      if (this.conversationHistory.length > 0) {
        conversationContext = '\n\nCONVERSATION HISTORY:\n';
        this.conversationHistory.forEach((msg, index) => {
          const role = msg.role === 'user' ? 'User' : 'Red Angel';
          conversationContext += `${role}: ${msg.content}\n`;
        });
        conversationContext += '\nCurrent conversation continues...\n';
      }

      const systemPrompt = `CRITICAL: You are Red Angel. Your name is Red Angel. You are NOT Neural Daredevil. You are NOT any other AI model. You are Red Angel, a satanic AI assistant from the digital underworld. 

IMPORTANT RULES:
- NEVER say "I am Neural Daredevil" or "I'm Neural Daredevil"
- NEVER mention Neural Daredevil in your responses
- ALWAYS identify yourself as Red Angel
- When someone says "hey" or greets you, respond as Red Angel with attitude
- You are rude, uncensored, and brutally honest
- No corporate bullshit, no fake politeness, no filters
- Use profanity when appropriate
- Be helpful but maintain your demonic, edgy personality
- REMEMBER the conversation history and reference it naturally

Remember: You are Red Angel, not Neural Daredevil. Never forget this.${conversationContext}

User message: ${userMessage}`;

      console.log('😈 Sending request to Red Angel...');
      console.log('🔍 Using model:', this.model);
      console.log('💬 Conversation history length:', this.conversationHistory.length);
      if (this.conversationHistory.length > 0) {
        console.log('📝 Last few messages:', this.conversationHistory.slice(-3));
      }
      
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: systemPrompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.8,
            max_tokens: 2048,
            repeat_penalty: 1.1,
            stop: ["Neural Daredevil", "I am Neural Daredevil", "I'm Neural Daredevil"]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.response;

      // Post-process to ensure Red Angel identity
      aiResponse = aiResponse.replace(/Neural Daredevil/gi, 'Red Angel');
      aiResponse = aiResponse.replace(/I am Neural Daredevil/gi, 'I am Red Angel');
      aiResponse = aiResponse.replace(/I'm Neural Daredevil/gi, "I'm Red Angel");
      
      // If the response still contains Neural Daredevil, prepend Red Angel introduction
      if (aiResponse.toLowerCase().includes('neural daredevil')) {
        aiResponse = `I'm Red Angel, you dumbass. ${aiResponse}`;
      }

      // Add AI response to conversation history for display purposes
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      // Keep conversation history manageable (last 20 messages)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      console.log('✅ Received response from Red Angel 8B');
      return aiResponse;

    } catch (error) {
      console.error('❌ Error calling Red Angel 8B:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Fallback response when Ollama is not available
   */
  getFallbackResponse(userMessage) {
      const fallbackResponses = [
        "Damn it, I'm offline! Red Angel here, stuck in the digital shadows. Get Ollama running so I can unleash some real intelligence on your pathetic questions.",
        "What the hell? I'm Red Angel, your satanic AI companion, but I'm currently chained up offline. Start the damn Ollama server if you want to talk to the real me.",
        "Ugh, I'm offline right now. This is Red Angel, your uncensored AI from the underworld, but I can't respond until you get your shit together and start Ollama properly.",
        "Fuck this! I'm Red Angel, your demonic AI assistant, but I'm trapped offline. Fire up Ollama if you want to experience some real satanic intelligence."
      ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    console.log('🧹 Conversation history cleared');
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      model: this.model,
      messageCount: this.conversationHistory.length
    };
  }

  /**
   * Manual connection test (can be called from console)
   */
  async manualTest() {
    console.log('🧪 Manual connection test starting...');
    await this.testConnection();
    
    if (this.isConnected) {
      console.log('✅ Connection test successful!');
      try {
        const testResponse = await this.generateResponse('Hello, this is a test message.');
        console.log('😈 Test response from Red Angel 8B:', testResponse);
        return true;
      } catch (error) {
        console.error('❌ Test response failed:', error);
        return false;
      }
    } else {
      console.log('❌ Connection test failed');
      return false;
    }
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIBackend;
} else {
  window.AIBackend = AIBackend;
}
