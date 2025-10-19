#!/usr/bin/env python3
"""
Set Hugging Face token for authentication
"""

from huggingface_hub import HfApi

def set_token():
    print("Please get your Hugging Face token from: https://huggingface.co/settings/tokens")
    print("Then paste it below:")
    
    token = input("Enter your Hugging Face token: ").strip()
    
    if not token:
        print("No token provided. Exiting.")
        return
    
    try:
        # Test the token
        api = HfApi(token=token)
        user_info = api.whoami()
        print(f"✅ Successfully authenticated as: {user_info['name']}")
        
        # Save token for future use
        from huggingface_hub import login
        login(token=token)
        print("✅ Token saved successfully!")
        
    except Exception as e:
        print(f"❌ Authentication failed: {e}")

if __name__ == "__main__":
    set_token()
