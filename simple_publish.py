#!/usr/bin/env python3
"""
Simple script to publish Red Angel model to Hugging Face
"""

import os
import json
import shutil
from pathlib import Path

def create_package():
    print("Creating Red Angel model package...")
    
    # Create package directory
    package_dir = Path('red-angel-package')
    package_dir.mkdir(exist_ok=True)
    
    # Files to include
    files_to_copy = [
        'Modelfile',
        'README.md', 
        'ollama_model_manifest.json',
        'LICENSE'
    ]
    
    # Copy files
    for file in files_to_copy:
        if Path(file).exists():
            shutil.copy2(file, package_dir / file)
            print(f"Added: {file}")
        else:
            print(f"Missing: {file}")
    
    print(f"Package created in: {package_dir}")
    return package_dir

def upload_to_huggingface():
    """Upload the model to Hugging Face"""
    from huggingface_hub import HfApi, create_repo, upload_folder
    
    # Get token
    token = os.getenv('HF_TOKEN')
    if not token:
        print("ERROR: HF_TOKEN environment variable not set")
        print("Get token from: https://huggingface.co/settings/tokens")
        print("Set with: set HF_TOKEN=your_token_here")
        return False
    
    # Repository name
    repo_id = "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated"
    
    try:
        api = HfApi(token=token)
        
        # Create repository
        print(f"Creating repository: {repo_id}")
        create_repo(repo_id, exist_ok=True, private=False, token=token)
        
        # Upload files
        package_dir = Path('red-angel-package')
        if package_dir.exists():
            print("Uploading package...")
            upload_folder(
                folder_path=str(package_dir),
                repo_id=repo_id,
                repo_type="model",
                token=token
            )
            print("SUCCESS: Model uploaded!")
            print(f"View at: https://huggingface.co/{repo_id}")
            print(f"Pull with: ollama pull {repo_id}:latest")
            return True
        else:
            print("Package directory not found. Run create_package() first.")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    print("Red Angel Model Publisher")
    print("=" * 30)
    
    # Create package
    create_package()
    
    # Check if we should upload
    token = os.getenv('HF_TOKEN')
    if token:
        print("\nHF_TOKEN found. Uploading to Hugging Face...")
        upload_to_huggingface()
    else:
        print("\nTo upload to Hugging Face:")
        print("1. Get token from: https://huggingface.co/settings/tokens")
        print("2. Set token: set HF_TOKEN=your_token_here")
        print("3. Run this script again")

if __name__ == "__main__":
    main()
