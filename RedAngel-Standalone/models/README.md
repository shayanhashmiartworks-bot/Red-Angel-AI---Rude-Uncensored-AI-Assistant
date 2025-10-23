# Red Angel Model

## 📦 Place Your Model Here

This folder should contain the Red Angel model in **GGUF format**.

### Required File:
```
red-angel.gguf
```

### Where to Get the Model:

**Option 1: Download from Hugging Face**
Visit: https://huggingface.co/shayzinasimulation/red-angel-v1

Look for files ending in `.gguf` - recommended quantizations:
- `Q4_K_M` - 4.5GB, good quality, fast (RECOMMENDED)
- `Q5_K_M` - 5.5GB, better quality
- `Q6_K` - 6.5GB, best quality
- `Q8_0` - 8GB, maximum quality

**Option 2: Convert Existing Model**
If you have the model in another format, use llama.cpp's conversion tools.

### After Download:

1. Rename the file to: `red-angel.gguf`
2. Place it in this `models/` folder
3. The app will automatically load it on startup

### File Size:

The GGUF file will be approximately **4-8GB** depending on quantization.

**Note:** This file is too large for git, so it's in `.gitignore`. You must download it separately.

---

**Made with 🖕 by Shayz**

