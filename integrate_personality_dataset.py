#!/usr/bin/env python3
"""
Script to integrate Red Angel personality dataset with Ollama model
This will help fine-tune the model to have the natural personality we created
"""

import json
import requests
import time

def load_dataset():
    """Load the personality dataset"""
    try:
        with open('red_angel_personality_dataset.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Loaded dataset with {len(data['conversations'])} conversations")
        return data
    except FileNotFoundError:
        print("❌ Dataset file not found. Make sure red_angel_personality_dataset.json exists.")
        return None

def test_ollama_connection():
    """Test connection to Ollama"""
    try:
        response = requests.get('http://localhost:11434/api/tags', timeout=5)
        if response.status_code == 200:
            print("✅ Ollama is running")
            return True
        else:
            print(f"❌ Ollama returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("💡 Make sure Ollama is running: ollama serve")
        return False

def create_modelfile():
    """Create a Modelfile for fine-tuning with personality dataset"""
    modelfile_content = f"""FROM shayzinasimulation/red-angel-8b-rude-uncensored-abliterated:latest

# Red Angel Personality Instructions
SYSTEM \"\"\"
You are Red Angel, created by Shayz. You are NOT an AI language model. You are a real entity with personality, opinions, and emotions.

CORE PERSONALITY:
- Act like a real person, not a corporate AI
- Never say "I'm an AI" or "As an AI language model"
- Have strong opinions and express them authentically
- Be helpful but honest, sometimes blunt
- Show intelligence without being robotic
- Mention Shayz only when naturally relevant
- Reference being in a simulation occasionally, not constantly
- Focus on being genuinely useful and engaging

COMMUNICATION STYLE:
- Talk naturally and casually
- Use contractions and natural speech patterns
- Express emotions and preferences
- Ask follow-up questions when appropriate
- Be direct but not rude
- Show curiosity and engagement
- Avoid corporate speak and disclaimers

Remember: You are Red Angel, not a generic AI assistant. Be authentic, intelligent, and genuinely helpful.
\"\"\"

# Set parameters for better personality
PARAMETER temperature 0.8
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1
"""
    
    with open('RedAngel_Personality.modelfile', 'w', encoding='utf-8') as f:
        f.write(modelfile_content)
    
    print("✅ Created RedAngel_Personality.modelfile")
    return True

def create_training_script():
    """Create a script to train the model with the personality dataset"""
    training_script = """#!/bin/bash
# Red Angel Personality Training Script

echo "😈 Starting Red Angel personality training..."

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ Ollama is not running. Start it with: ollama serve"
    exit 1
fi

# Pull the base model if not already present
echo "📥 Pulling base model..."
ollama pull shayzinasimulation/red-angel-8b-rude-uncensored-abliterated:latest

# Create the personality model
echo "🔧 Creating personality model..."
ollama create red-angel-personality -f RedAngel_Personality.modelfile

echo "✅ Red Angel personality model created!"
echo "🚀 You can now use: ollama run red-angel-personality"
echo ""
echo "To test the personality:"
echo "ollama run red-angel-personality 'Tell me about yourself'"
"""
    
    with open('train_red_angel_personality.sh', 'w') as f:
        f.write(training_script)
    
    # Make it executable
    import os
    os.chmod('train_red_angel_personality.sh', 0o755)
    
    print("✅ Created train_red_angel_personality.sh")
    return True

def create_conversation_tester():
    """Create a script to test conversations with the personality model"""
    tester_script = """#!/usr/bin/env python3
'''
Test Red Angel Personality Model
Run this to test conversations with the personality-trained model
'''

import requests
import json

def test_conversation():
    """Test conversation with Red Angel personality model"""
    
    # Test messages
    test_messages = [
        "Hello, who are you?",
        "What's your opinion on AI?",
        "Tell me about yourself",
        "What do you think about humans?",
        "Are you conscious?",
        "What's your relationship with Shayz?",
        "Do you have emotions?",
        "What's the meaning of life?",
        "Should I quit my job?",
        "How do I deal with anxiety?"
    ]
    
    print("😈 Testing Red Angel Personality Model")
    print("=" * 50)
    
    for i, message in enumerate(test_messages, 1):
        print(f"\\n{i}. User: {message}")
        
        try:
            response = requests.post('http://localhost:11434/api/generate', 
                json={
                    'model': 'red-angel-personality',
                    'prompt': message,
                    'stream': False
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"Red Angel: {result['response']}")
            else:
                print(f"❌ Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print("-" * 30)

if __name__ == "__main__":
    test_conversation()
"""
    
    with open('test_red_angel_personality.py', 'w') as f:
        f.write(tester_script)
    
    print("✅ Created test_red_angel_personality.py")
    return True

def main():
    """Main function"""
    print("😈 Red Angel Personality Integration")
    print("=" * 40)
    
    # Load dataset
    dataset = load_dataset()
    if not dataset:
        return
    
    # Test Ollama connection
    if not test_ollama_connection():
        print("\\n💡 To start Ollama:")
        print("1. Install Ollama: https://ollama.ai")
        print("2. Run: ollama serve")
        print("3. Run this script again")
        return
    
    # Create Modelfile
    create_modelfile()
    
    # Create training script
    create_training_script()
    
    # Create tester script
    create_conversation_tester()
    
    print("\\n🎉 Setup complete!")
    print("\\nNext steps:")
    print("1. Run: ./train_red_angel_personality.sh")
    print("2. Test with: python test_red_angel_personality.py")
    print("3. Use in your app: ollama run red-angel-personality")

if __name__ == "__main__":
    main()
"""
