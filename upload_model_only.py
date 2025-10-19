#!/usr/bin/env python3
"""
Upload ONLY the Red Angel model files to Hugging Face
"""

import os
from pathlib import Path
from huggingface_hub import HfApi, create_repo, upload_file

def upload_model():
    token = os.getenv('HF_TOKEN')
    if not token:
        print("ERROR: HF_TOKEN not set")
        print("Get token from: https://huggingface.co/settings/tokens")
        print("Set with: set HF_TOKEN=your_token_here")
        return False
    
    repo_id = "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated"
    
    try:
        api = HfApi(token=token)
        
        # Create repository
        print(f"Creating repository: {repo_id}")
        create_repo(repo_id, exist_ok=True, private=False, token=token)
        
        # Upload model files
        model_dir = Path('red-angel-model-only')
        files = ['Modelfile', 'README.md']
        
        for file_name in files:
            file_path = model_dir / file_name
            if file_path.exists():
                print(f"Uploading {file_name}...")
                upload_file(
                    path_or_fileobj=str(file_path),
                    path_in_repo=file_name,
                    repo_id=repo_id,
                    repo_type="model",
                    token=token
                )
                print(f"Uploaded {file_name}")
            else:
                print(f"File not found: {file_name}")
        
        print(f"SUCCESS: Model uploaded!")
        print(f"Others can pull with: ollama pull {repo_id}:latest")
        return True
        
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    upload_model()
