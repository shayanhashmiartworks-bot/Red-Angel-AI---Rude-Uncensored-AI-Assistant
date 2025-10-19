#!/usr/bin/env python3
"""
Check Hugging Face user info
"""

import os
from huggingface_hub import HfApi

def check_user():
    # Get token from environment
    token = os.getenv('HF_TOKEN')
    if not token:
        print("HF_TOKEN environment variable not set")
        return
    
    try:
        api = HfApi(token=token)
        user_info = api.whoami()
        print(f"Authenticated as: {user_info['name']}")
        print(f"Full name: {user_info.get('fullname', 'N/A')}")
        print(f"Email: {user_info.get('email', 'N/A')}")
        return user_info['name']
        
    except Exception as e:
        print(f"Error checking user: {e}")
        return None

if __name__ == "__main__":
    check_user()
