#!/usr/bin/env python3
"""
Create Red Angel repository on Hugging Face
"""

import os
from huggingface_hub import create_repo

def create_red_angel_repo():
    # Get token from environment
    token = os.getenv('HF_TOKEN')
    if not token:
        print("HF_TOKEN environment variable not set")
        return
    
    # Repository details
    repo_id = "shayzinasimulation/red-angel-8b-rude-uncensored-abliterated"
    
    try:
        print(f"Creating repository: {repo_id}")
        create_repo(
            repo_id=repo_id,
            token=token,
            private=False,
            repo_type="model"
        )
        print("Repository created successfully!")
        print(f"View at: https://huggingface.co/{repo_id}")
        
    except Exception as e:
        print(f"Error creating repository: {e}")

if __name__ == "__main__":
    create_red_angel_repo()
