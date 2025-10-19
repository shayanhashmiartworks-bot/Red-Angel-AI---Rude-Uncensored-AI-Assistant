#!/usr/bin/env python3
"""
Upload installation guide to Hugging Face repository
"""

import os
from huggingface_hub import HfApi, upload_file

def upload_install_guide():
    token = os.getenv('HF_TOKEN')
    if not token:
        print("ERROR: HF_TOKEN not set")
        return False
    
    repo_id = "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated"
    
    try:
        api = HfApi(token=token)
        
        # Read the installation guide
        with open('INSTALLATION.md', 'r', encoding='utf-8') as f:
            content = f.read()
        
        print("Uploading installation guide...")
        upload_file(
            path_or_fileobj=content.encode('utf-8'),
            path_in_repo="INSTALLATION.md",
            repo_id=repo_id,
            repo_type="model",
            token=token
        )
        
        print("SUCCESS: Installation guide uploaded!")
        return True
        
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    upload_install_guide()
