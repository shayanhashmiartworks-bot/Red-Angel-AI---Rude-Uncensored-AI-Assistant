#!/usr/bin/env python3
"""
Create and publish Red Angel model to public repositories
"""

import os
import json
import shutil
import subprocess
from pathlib import Path

def create_ollama_manifest():
    """Create Ollama manifest for public distribution"""
    manifest = {
        "name": "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated:latest",
        "model": "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated:latest", 
        "modified_at": "2025-01-19T00:00:00.000000000Z",
        "size": 8540771697,
        "digest": "sha256:redangel8brudeuncensoredabliterated",
        "details": {
            "format": "gguf",
            "family": "llama", 
            "families": ["llama"],
            "parameter_size": "8B",
            "quantization_level": "Q8_0"
        },
        "expires_at": "0001-01-01T00:00:00Z"
    }
    
    with open('ollama_model_manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print("✅ Created Ollama manifest")

def export_model_files():
    """Export model files from local Ollama installation"""
    ollama_dir = Path.home() / '.ollama'
    models_dir = ollama_dir / 'models'
    
    if not models_dir.exists():
        print("❌ Ollama models directory not found")
        return False
    
    # Find the Red Angel model directory
    red_angel_dirs = list(models_dir.glob('*red-angel*'))
    if not red_angel_dirs:
        print("❌ Red Angel model not found locally")
        print("Please create the model first with: ollama create red-angel-8b-rude-uncensored-abliterated:latest -f Modelfile")
        return False
    
    # Use the first Red Angel model found
    source_dir = red_angel_dirs[0]
    print(f"📁 Found model directory: {source_dir}")
    
    # Create export directory
    export_dir = Path('red-angel-model-export')
    export_dir.mkdir(exist_ok=True)
    
    # Copy model files
    print("📦 Copying model files...")
    for file_path in source_dir.rglob('*'):
        if file_path.is_file():
            rel_path = file_path.relative_to(source_dir)
            dest_path = export_dir / rel_path
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path, dest_path)
            print(f"  ✅ Copied: {rel_path}")
    
    print(f"✅ Model exported to: {export_dir}")
    return True

def create_package():
    """Create distribution package"""
    print("📦 Creating distribution package...")
    
    # Files to include in package
    package_files = [
        'Modelfile',
        'README.md', 
        'model_card.md',
        'ollama_model_manifest.json',
        'LICENSE'
    ]
    
    # Create package directory
    package_dir = Path('red-angel-package')
    package_dir.mkdir(exist_ok=True)
    
    # Copy files
    for file in package_files:
        if Path(file).exists():
            shutil.copy2(file, package_dir / file)
            print(f"  ✅ Added: {file}")
        else:
            print(f"  ⚠️  Missing: {file}")
    
    # Export model files if available
    if export_model_files():
        model_export_dir = Path('red-angel-model-export')
        if model_export_dir.exists():
            shutil.copytree(model_export_dir, package_dir / 'model', dirs_exist_ok=True)
            print("  ✅ Added: model files")
    
    print(f"✅ Package created: {package_dir}")
    return package_dir

def main():
    print("🔥 Red Angel Model Distribution Creator")
    print("=" * 40)
    
    # Create manifest
    create_ollama_manifest()
    
    # Create package
    package_dir = create_package()
    
    print("\n🚀 Next Steps:")
    print("1. Upload the package to Hugging Face:")
    print(f"   cd {package_dir}")
    print("   python ../upload_to_hf.py")
    print("\n2. Or create a GitHub release with the package")
    print("\n3. Others can then pull with:")
    print("   ollama pull shayzinasimulation/red-angel-8b-rude-uncensored-abliterated:latest")

if __name__ == "__main__":
    main()
