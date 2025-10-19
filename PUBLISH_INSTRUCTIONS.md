# 🔥 Red Angel Model Publishing Instructions

## Step 1: Get Hugging Face Token

1. **Go to Hugging Face**: https://huggingface.co/
2. **Sign up/Login** to your account
3. **Go to Settings**: https://huggingface.co/settings/tokens
4. **Create New Token**:
   - Click "New token"
   - Name: `red-angel-model`
   - Type: `Write` (important!)
   - Click "Generate"
5. **Copy the token** (starts with `hf_`)

## Step 2: Set Token Environment Variable

**Windows (PowerShell):**
```powershell
$env:HF_TOKEN="hf_your_token_here"
```

**Windows (Command Prompt):**
```cmd
set HF_TOKEN=hf_your_token_here
```

## Step 3: Upload Model

Run the upload script:
```bash
py simple_publish.py
```

## Step 4: Verify Upload

1. Go to: https://huggingface.co/shayzinasimulation/red-angel-8b-rude-uncensored-abliterated
2. Verify all files are uploaded
3. Test the pull command

## Step 5: Test Public Pull

Once uploaded, others can pull with:
```bash
ollama pull shayzinasimulation/red-angel-8b-rude-uncensored-abliterated:latest
```

## Troubleshooting

- **Token Error**: Make sure token has `write` permissions
- **Upload Failed**: Check internet connection and token validity
- **Pull Failed**: Wait a few minutes for Hugging Face to process the upload

## Alternative: Manual Upload

If script fails, you can manually upload:
1. Go to: https://huggingface.co/new
2. Create repository: `shayzinasimulation/red-angel-8b-rude-uncensored-abliterated`
3. Upload files from `red-angel-package/` folder
4. Add README.md content from the package
