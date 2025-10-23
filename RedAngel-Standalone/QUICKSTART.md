# 🚀 Quick Start Guide

## Get Red Angel Standalone Running in 5 Minutes

### Prerequisites:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ ~10GB free disk space

---

## Step 1: Install Dependencies

```bash
cd RedAngel-Standalone
npm install
```

⏱️ **Time:** ~2-3 minutes

---

## Step 2: Get the Model

### Download from Hugging Face:

1. Visit: https://huggingface.co/shayzinasimulation/red-angel-v1
2. Download a `.gguf` file (recommended: `Q4_K_M` ~4.5GB)
3. Rename it to: `red-angel.gguf`
4. Place in the `models/` folder

⏱️ **Time:** ~5-10 minutes (depending on internet speed)

### Quick Command (if using curl/wget):

```bash
# Example - replace with actual download URL
curl -L "https://huggingface.co/.../red-angel-q4.gguf" -o models/red-angel.gguf
```

---

## Step 3: Add Icons (Optional for Testing)

For now, create a simple placeholder:

```bash
# The app will work without icons in dev mode
# Icons are only needed for building installers
```

If you want to test with proper icons:
1. Copy `red-angel-logo.png` to `build/icon.png`
2. Convert to `.ico` for Windows (use online converter)
3. Convert to `.icns` for macOS (use online converter)

---

## Step 4: Run the App!

```bash
npm start
```

⏱️ **Startup time:** 10-30 seconds (first run, loading model)

### What happens:
1. Electron window opens
2. Loading screen appears ("Loading your companion...")
3. Model loads into memory (wait ~20 seconds)
4. Chat interface appears
5. **You're ready to chat!** 😈

---

## Step 5: Test It

Type a message like:
- "Hello, who are you?"
- "Tell me about yourself"
- "What can you help me with?"

The model should respond in ~2-10 seconds (depending on your hardware).

---

## 🎉 Success!

If you see responses, it's working perfectly!

### Next Steps:

**For Testing:**
- Just keep using `npm start`
- No need to build installers yet

**For Distribution:**
1. Add proper icons to `build/` folder
2. Run `npm run build:win` (or your platform)
3. Share the installer from `dist/` folder

---

## 🐛 Troubleshooting

### "Model not found" error:
- Check file is named exactly: `red-angel.gguf`
- Check it's in the `models/` folder (not in a subfolder)
- Verify the file isn't corrupted

### App won't start:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

### Model loads but responses are slow:
- Normal! First response is always slower
- CPU-only mode is slow (get a GPU for speed)
- Reduce model size (use Q4_K_M instead of Q8_0)

### Out of memory:
- Close other apps
- Use a smaller quantized model
- Reduce `gpuLayers` in `main.js`

---

## 📊 Performance Tips

### Fast Setup (Recommended):
- **Model:** Q4_K_M (~4.5GB)
- **GPU:** RTX 3060+ with 6GB+ VRAM
- **Response time:** 2-5 seconds

### Maximum Quality:
- **Model:** Q8_0 (~8GB)
- **GPU:** RTX 3090+ with 24GB VRAM
- **Response time:** 3-7 seconds

### CPU Only (No GPU):
- **Model:** Q4_K_M (~4.5GB)
- **Response time:** 20-60 seconds
- Set `gpuLayers: 0` in `main.js`

---

## ✅ You're Ready!

The app is now running locally on your machine. Everything is private, nothing is sent to any server.

**Enjoy your brutally honest digital companion!** 😈🩸

---

**Made with 🖕 by Shayz**

