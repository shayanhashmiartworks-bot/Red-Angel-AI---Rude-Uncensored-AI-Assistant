#!/usr/bin/env python3
"""
Upload Red Angel model to Hugging Face Hub
"""

import os
import shutil
from pathlib import Path
from huggingface_hub import HfApi, create_repo, upload_folder

def upload_red_angel_model():
    # Get token from environment
    token = os.getenv('HF_TOKEN')
    if not token:
        print("[ERROR] HF_TOKEN environment variable not set")
        print("Set it with: export HF_TOKEN=your_token_here")
        return
    
    # Initialize the API with token
    api = HfApi(token=token)
    
    # Repository name
    repo_id = "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated"
    
    try:
        # Create repository if it doesn't exist
        print(f"🔥 Creating repository: {repo_id}")
        try:
            create_repo(repo_id, exist_ok=True, private=False, token=token)
            print("✅ Repository created successfully")
        except Exception as e:
            print(f"ℹ️  Repository might already exist: {e}")
            print("Continuing with upload...")
        
        # Check if we have a package directory
        package_dir = Path('red-angel-package')
        if package_dir.exists():
            print(f"📦 Uploading from package directory: {package_dir}")
            upload_folder(
                folder_path=str(package_dir),
                repo_id=repo_id,
                repo_type="model",
                token=token
            )
            print(f"✅ Package uploaded successfully!")
        else:
            # Upload individual files
            files_to_upload = [
                "Modelfile",
                "README.md", 
                "model_card.md",
                "ollama_model_manifest.json",
                "LICENSE"
            ]
            
            print("📁 Uploading individual files...")
            for file in files_to_upload:
                if os.path.exists(file):
                    print(f"  📤 Uploading {file}...")
                    api.upload_file(
                        path_or_fileobj=file,
                        path_in_repo=file,
                        repo_id=repo_id,
                        repo_type="model",
                        token=token
                    )
                    print(f"  ✅ {file} uploaded successfully")
                else:
                    print(f"  ⚠️  {file} not found, skipping...")
        
        print(f"\n🎉 Model uploaded successfully!")
        print(f"🌐 View at: https://huggingface.co/{repo_id}")
        print(f"\n📥 Others can now pull with:")
        print(f"   ollama pull {repo_id}:latest")
        
    except Exception as e:
        print(f"❌ Error uploading model: {e}")
        print("Make sure you're logged in with: huggingface-cli login")

if __name__ == "__main__":
    upload_red_angel_model()
