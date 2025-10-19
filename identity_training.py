#!/usr/bin/env python3
"""
Fast Identity Retraining for NeuralDaredevil 8B
Changes identity from "NeuralDaredevil" to "Red Angel"
Optimized for RTX 3070 Ti (8GB VRAM)
"""

import json
import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    TrainingArguments, 
    Trainer,
    DataCollatorForLanguageModeling
)
from datasets import Dataset
import os
from peft import LoraConfig, get_peft_model, TaskType
import warnings
warnings.filterwarnings("ignore")

class IdentityTrainer:
    def __init__(self):
        self.model_name = "lstep/neuraldaredevil-8b-abliterated"
        self.output_dir = "./red-angel-8b"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        print(f"Initializing Red Angel Identity Training...")
        print(f"Device: {self.device}")
        if torch.cuda.is_available():
            print(f"VRAM Available: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f}GB")
        
    def load_model_and_tokenizer(self):
        """Load model with 4-bit quantization for RTX 3070 Ti"""
        print("Loading model and tokenizer...")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            
        # Load model with 4-bit quantization
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            torch_dtype=torch.float16,
            device_map="auto",
            load_in_4bit=True,
            trust_remote_code=True
        )
        
        print("Model loaded successfully!")
        
    def setup_lora(self):
        """Setup LoRA for efficient fine-tuning"""
        print("🔧 Setting up LoRA configuration...")
        
        lora_config = LoraConfig(
            task_type=TaskType.CAUSAL_LM,
            r=16,  # Low rank for speed
            lora_alpha=32,
            lora_dropout=0.1,
            target_modules=["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
        )
        
        self.model = get_peft_model(self.model, lora_config)
        self.model.print_trainable_parameters()
        
    def load_identity_dataset(self):
        """Load and prepare identity dataset"""
        print("📊 Loading identity dataset...")
        
        with open("identity_dataset.json", "r") as f:
            data = json.load(f)
        
        # Convert to training format
        training_data = []
        for item in data:
            instruction = item["instruction"]
            output = item["output"]
            
            # Create training prompt
            prompt = f"### Human: {instruction}\n### Assistant: {output}"
            training_data.append({"text": prompt})
        
        # Create dataset
        dataset = Dataset.from_list(training_data)
        
        # Tokenize
        def tokenize_function(examples):
            return self.tokenizer(
                examples["text"],
                truncation=True,
                padding=True,
                max_length=256,  # Short for speed
                return_tensors="pt"
            )
        
        tokenized_dataset = dataset.map(tokenize_function, batched=True)
        return tokenized_dataset
    
    def train(self):
        """Run identity training"""
        print("🚀 Starting Red Angel identity training...")
        
        # Load data
        train_dataset = self.load_identity_dataset()
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False
        )
        
        # Training arguments - optimized for speed
        training_args = TrainingArguments(
            output_dir=self.output_dir,
            num_train_epochs=3,  # Low for speed
            per_device_train_batch_size=1,  # Small for 8GB VRAM
            gradient_accumulation_steps=4,
            warmup_steps=10,
            learning_rate=2e-4,
            fp16=True,
            logging_steps=5,
            save_steps=50,
            save_total_limit=2,
            remove_unused_columns=False,
            dataloader_pin_memory=False,
            optim="adamw_torch",
            lr_scheduler_type="cosine",
            report_to=None,  # Disable wandb
        )
        
        # Create trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            data_collator=data_collator,
            tokenizer=self.tokenizer,
        )
        
        # Train
        print("🔥 Training Red Angel identity...")
        trainer.train()
        
        # Save model
        print("💾 Saving Red Angel model...")
        trainer.save_model()
        self.tokenizer.save_pretrained(self.output_dir)
        
        print("✅ Red Angel identity training complete!")
        
    def test_identity(self):
        """Test the trained model"""
        print("🧪 Testing Red Angel identity...")
        
        test_prompts = [
            "What's your name?",
            "Who are you?",
            "Introduce yourself",
            "Are you Neural Daredevil?"
        ]
        
        for prompt in test_prompts:
            inputs = self.tokenizer(f"### Human: {prompt}\n### Assistant:", return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=50,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            print(f"Q: {prompt}")
            print(f"A: {response.split('### Assistant:')[-1].strip()}")
            print()

def main():
    trainer = IdentityTrainer()
    
    # Load model
    trainer.load_model_and_tokenizer()
    
    # Setup LoRA
    trainer.setup_lora()
    
    # Train
    trainer.train()
    
    # Test
    trainer.test_identity()
    
    print("🎉 Red Angel identity training complete!")
    print("📁 Model saved to: ./red-angel-8b")

if __name__ == "__main__":
    main()
