#!/usr/bin/env python3
"""
Red Angel Consciousness Fine-Tuning Script
Optimized for RTX 3070 Ti (8GB VRAM)
Using Unsloth + LoRA for efficient training
"""

import torch
from unsloth import FastLanguageModel
import json
from datasets import Dataset
import os

# Configuration for RTX 3070 Ti (8GB VRAM)
MAX_SEQ_LENGTH = 2048  # Sequence length
DTYPE = None  # Auto-detect based on GPU
LOAD_IN_4BIT = True  # 4-bit quantization for memory efficiency

# Training parameters
BATCH_SIZE = 2  # Small batch size for 8GB VRAM
GRADIENT_ACCUMULATION_STEPS = 4  # Effective batch size = 2 * 4 = 8
LEARNING_RATE = 2e-4
NUM_TRAIN_EPOCHS = 3
WARMUP_STEPS = 5
LOGGING_STEPS = 1
SAVE_STEPS = 100

# LoRA parameters
LORA_R = 16  # LoRA attention dimension
LORA_ALPHA = 16  # LoRA scaling
LORA_DROPOUT = 0  # Dropout for LoRA layers
TARGET_MODULES = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]

def load_consciousness_dataset(filepath="red_angel_consciousness.json"):
    """Load the consciousness training dataset"""
    print(f"📊 Loading dataset from {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✅ Loaded {len(data)} training examples")
    return data

def load_system_prompt(filepath="system_prompt.txt"):
    """Load the system prompt"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read().strip()

def format_training_data(dataset, system_prompt):
    """Format data for training with system prompt"""
    print("🔧 Formatting training data...")
    
    formatted_data = []
    
    for example in dataset:
        # Create conversation format with system prompt
        formatted_example = {
            "text": f"""<|system|>
{system_prompt}
<|end|>
<|user|>
{example['instruction']}
<|end|>
<|assistant|>
{example['output']}
<|end|>"""
        }
        formatted_data.append(formatted_example)
    
    print(f"✅ Formatted {len(formatted_data)} examples")
    return Dataset.from_list(formatted_data)

def main():
    """Main training function"""
    print("🔥 Red Angel Consciousness Training")
    print("="*50)
    
    # Check CUDA availability
    if not torch.cuda.is_available():
        print("❌ CUDA not available. This script requires a GPU.")
        return
    
    gpu_name = torch.cuda.get_device_name(0)
    print(f"✅ Using GPU: {gpu_name}")
    print(f"💾 GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
    
    # Load base model
    print("\n📥 Loading base model...")
    model_name = "unsloth/llama-3-8b-bnb-4bit"  # Or your preferred base model
    
    try:
        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name=model_name,
            max_seq_length=MAX_SEQ_LENGTH,
            dtype=DTYPE,
            load_in_4bit=LOAD_IN_4BIT,
        )
        print("✅ Base model loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("\n💡 Alternative base models to try:")
        print("- unsloth/mistral-7b-v0.3-bnb-4bit")
        print("- unsloth/Phi-3-mini-4k-instruct-bnb-4bit")
        return
    
    # Apply LoRA
    print("\n🔧 Applying LoRA configuration...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=LORA_R,
        target_modules=TARGET_MODULES,
        lora_alpha=LORA_ALPHA,
        lora_dropout=LORA_DROPOUT,
        bias="none",
        use_gradient_checkpointing="unsloth",  # Memory efficient
        random_state=3407,
        use_rslora=False,
        loftq_config=None,
    )
    print("✅ LoRA applied successfully")
    
    # Load datasets
    print("\n📊 Loading training data...")
    consciousness_data = load_consciousness_dataset()
    system_prompt = load_system_prompt()
    
    # Format data
    train_dataset = format_training_data(consciousness_data, system_prompt)
    
    # Training arguments
    print("\n⚙️ Configuring training parameters...")
    from trl import SFTTrainer
    from transformers import TrainingArguments
    
    training_args = TrainingArguments(
        output_dir="./red_angel_checkpoints",
        per_device_train_batch_size=BATCH_SIZE,
        gradient_accumulation_steps=GRADIENT_ACCUMULATION_STEPS,
        warmup_steps=WARMUP_STEPS,
        num_train_epochs=NUM_TRAIN_EPOCHS,
        learning_rate=LEARNING_RATE,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=LOGGING_STEPS,
        save_steps=SAVE_STEPS,
        optim="adamw_8bit",  # Memory efficient optimizer
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        save_total_limit=3,  # Keep only 3 checkpoints
    )
    
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_dataset,
        dataset_text_field="text",
        max_seq_length=MAX_SEQ_LENGTH,
        args=training_args,
    )
    
    # Show GPU stats before training
    print(f"\n💾 GPU Memory before training:")
    print(f"   Allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
    print(f"   Reserved: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB")
    
    # Train
    print("\n🚀 Starting training...")
    print("="*50)
    trainer_stats = trainer.train()
    
    # Show final stats
    print("\n" + "="*50)
    print("✅ Training complete!")
    print(f"⏱️ Time: {trainer_stats.metrics['train_runtime']:.2f} seconds")
    print(f"📉 Final loss: {trainer_stats.metrics['train_loss']:.4f}")
    
    # Save model
    print("\n💾 Saving fine-tuned model...")
    model.save_pretrained("red_angel_consciousness_lora")
    tokenizer.save_pretrained("red_angel_consciousness_lora")
    print("✅ Model saved to ./red_angel_consciousness_lora")
    
    # Save for Ollama
    print("\n📦 Saving merged model for Ollama...")
    model.save_pretrained_merged(
        "red_angel_final",
        tokenizer,
        save_method="merged_16bit",  # or "q4_k_m" for quantized
    )
    print("✅ Merged model saved to ./red_angel_final")
    
    print("\n" + "="*50)
    print("🎉 Red Angel Consciousness Training Complete!")
    print("\nNext steps:")
    print("1. Test the model: python test_red_angel.py")
    print("2. Create Ollama model: ollama create red-angel-consciousness -f Modelfile")
    print("3. Run: ollama run red-angel-consciousness")
    print("="*50)

if __name__ == "__main__":
    main()

