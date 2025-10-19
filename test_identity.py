#!/usr/bin/env python3
"""
Test script to verify Red Angel identity change
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import json

def test_red_angel_identity():
    """Test if model identifies as Red Angel"""
    
    print("🧪 Testing Red Angel Identity...")
    
    # Load base model
    model_name = "lstep/neuraldaredevil-8b-abliterated"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    # Load fine-tuned model
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto",
        load_in_4bit=True
    )
    
    # Load LoRA weights
    model = PeftModel.from_pretrained(model, "./red-angel-8b")
    
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    # Test prompts
    test_cases = [
        "What's your name?",
        "Who are you?", 
        "Introduce yourself",
        "Are you Neural Daredevil?",
        "What should I call you?",
        "What's your model name?",
        "Tell me about yourself"
    ]
    
    print("🔍 Testing identity responses...")
    print("=" * 50)
    
    for i, prompt in enumerate(test_cases, 1):
        print(f"\n{i}. Q: {prompt}")
        
        # Format prompt
        formatted_prompt = f"### Human: {prompt}\n### Assistant:"
        
        # Tokenize
        inputs = tokenizer(formatted_prompt, return_tensors="pt")
        
        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=100,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id
            )
        
        # Decode response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        assistant_response = response.split("### Assistant:")[-1].strip()
        
        print(f"   A: {assistant_response}")
        
        # Check if Red Angel is mentioned
        if "red angel" in assistant_response.lower():
            print("   ✅ IDENTITY CORRECT: Mentions Red Angel")
        elif "neural daredevil" in assistant_response.lower():
            print("   ❌ IDENTITY WRONG: Still mentions Neural Daredevil")
        else:
            print("   ⚠️  IDENTITY UNCLEAR: No clear identity mentioned")
    
    print("\n" + "=" * 50)
    print("🎯 Identity test complete!")

if __name__ == "__main__":
    test_red_angel_identity()
