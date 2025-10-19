#!/usr/bin/env python3
"""
Create Red Angel repository using web interface
"""

def create_repo_instructions():
    print("=== CREATE REPOSITORY MANUALLY ===")
    print()
    print("1. Go to: https://huggingface.co/new")
    print("2. Fill in the form:")
    print("   - Repository name: red-angel-8b-rude-uncensored-abliterated")
    print("   - Owner: shayzinasimulation")
    print("   - Type: Model")
    print("   - Visibility: Public")
    print("   - License: MIT")
    print("3. Click 'Create repository'")
    print()
    print("After creating the repository, run:")
    print("py upload_to_hf.py")
    print()
    print("Or use the direct URL:")
    print("https://huggingface.co/shayzinasimulation/red-angel-8b-rude-uncensored-abliterated")

if __name__ == "__main__":
    create_repo_instructions()
