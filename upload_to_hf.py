#!/usr/bin/env python3
"""
Upload Red Angel model to Hugging Face Hub
"""

import os
from huggingface_hub import HfApi, create_repo

def upload_red_angel_model():
    # Get token from environment
    import os
    token = os.getenv('HF_TOKEN')
    if not token:
        print("[ERROR] HF_TOKEN environment variable not set")
        return
    
    # Initialize the API with token
    api = HfApi(token=token)
    
    # Repository name
    repo_id = "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated"
    
    try:
        # Create repository if it doesn't exist
        print(f"Creating repository: {repo_id}")
        try:
            create_repo(repo_id, exist_ok=True, private=False, token=token)
            print("Repository created successfully")
        except Exception as e:
            print(f"Repository might already exist: {e}")
            print("Continuing with upload...")
        
        # Files to upload
        files_to_upload = [
            "Modelfile",
            "README.md", 
            "model_card.md",
            "LICENSE",
            "index.html"
        ]
        
        # Upload files
        print("Uploading files...")
        for file in files_to_upload:
            if os.path.exists(file):
                print(f"Uploading {file}...")
                api.upload_file(
                    path_or_fileobj=file,
                    path_in_repo=file,
                    repo_id=repo_id,
                    repo_type="model",
                    token=token
                )
                print(f"[SUCCESS] {file} uploaded successfully")
            else:
                print(f"[WARNING] {file} not found, skipping...")
        
        print(f"\n[SUCCESS] Model uploaded successfully!")
        print(f"View at: https://huggingface.co/{repo_id}")
        
    except Exception as e:
        print(f"[ERROR] Error uploading model: {e}")
        print("Make sure you're logged in with: hf auth login")

if __name__ == "__main__":
    upload_red_angel_model()
