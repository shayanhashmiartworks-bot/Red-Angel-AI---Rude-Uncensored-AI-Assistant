# Red Angel Standalone Desktop App

**One-click install. Fully offline. Completely private AI companion.**

## 🎯 What Is This?

This is a **self-contained desktop application** that bundles everything needed to run Red Angel:

- ✅ Electron desktop app (beautiful UI)
- ✅ llama.cpp inference engine (built-in)
- ✅ Red Angel AI model (bundled)
- ✅ Zero external dependencies

**User experience:**
1. Download the installer (6-8GB)
2. Install the app
3. Click the desktop icon
4. Chat immediately - no setup required!

---

## 📦 What You Need

### Development Requirements:
- **Node.js** 18+ (for development)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

### For Users (Final App):
- **Nothing!** Just download and install the app

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd RedAngel-Standalone
npm install
```

This will install:
- Electron (desktop framework)
- node-llama-cpp (AI inference engine)
- electron-builder (app packaging tool)

### Step 2: Download the Model

You need to get the Red Angel model in **GGUF format** (quantized for efficiency).

**Option A: Download from Hugging Face**

```bash
# Download the GGUF model
# Example: red-angel-8b-q4_k_m.gguf (4-bit quantized, ~4.5GB)
```

Visit: https://huggingface.co/shayzinasimulation/red-angel-v1

Look for files ending in `.gguf` - recommended quantizations:
- `Q4_K_M` - 4.5GB, good quality, fast
- `Q5_K_M` - 5.5GB, better quality
- `Q6_K` - 6.5GB, best quality
- `Q8_0` - 8GB, maximum quality

**Option B: Convert from existing model**

If you have the model in another format, use llama.cpp's conversion tools.

### Step 3: Place the Model

Put the `.gguf` file in the `models/` folder and rename it to:

```
RedAngel-Standalone/models/red-angel.gguf
```

### Step 4: Add Icons

Place app icons in the `build/` folder:
- `build/icon.png` - Linux icon (512x512 PNG)
- `build/icon.ico` - Windows icon (256x256 ICO)
- `build/icon.icns` - macOS icon (512x512 ICNS)

You can use the existing Red Angel logo and convert it to these formats.

---

## 🧪 Testing (Development Mode)

Run the app in development mode to test:

```bash
npm start
```

This will:
1. Start the Electron app
2. Load the model from `models/red-angel.gguf`
3. Show the UI

**Note:** Model loading takes 10-30 seconds on first run. You'll see a loading screen.

---

## 📦 Building the Installer

### Build for Windows:

```bash
npm run build:win
```

This creates:
- `dist/RedAngel-Setup-1.0.0.exe` - Installer (~6-8GB)

### Build for macOS:

```bash
npm run build:mac
```

This creates:
- `dist/Red Angel-1.0.0.dmg` - macOS installer
- `dist/Red Angel-1.0.0-mac.zip` - Portable app

### Build for Linux:

```bash
npm run build:linux
```

This creates:
- `dist/Red Angel-1.0.0.AppImage` - Portable Linux app

### Build for All Platforms:

```bash
npm run build
```

---

## 📂 Project Structure

```
RedAngel-Standalone/
├── main.js                 # Electron main process (loads model)
├── preload.js              # IPC bridge (security)
├── package.json            # Dependencies & build config
├── renderer/               # UI files
│   ├── index.html         # Main HTML
│   ├── style.css          # Styles
│   └── app.js             # Chat logic
├── models/                 # AI model goes here
│   └── red-angel.gguf     # Place your GGUF model here
├── build/                  # App icons
│   ├── icon.png
│   ├── icon.ico
│   └── icon.icns
└── dist/                   # Built installers (after build)
    └── RedAngel-Setup-1.0.0.exe
```

---

## ⚙️ Configuration

### Adjust GPU Layers (in `main.js`):

```javascript
model = new LlamaModel({
  modelPath: modelPath,
  gpuLayers: 33  // ← Adjust this based on your GPU
});
```

**Guidelines:**
- **8GB VRAM (RTX 3070 Ti, etc.):** `gpuLayers: 33`
- **12GB VRAM (RTX 3090, etc.):** `gpuLayers: 40`
- **24GB VRAM (RTX 4090, etc.):** `gpuLayers: 50`
- **CPU only (no GPU):** `gpuLayers: 0`

### Adjust Context Size:

```javascript
context = new LlamaContext({
  model: model,
  contextSize: 4096  // ← Adjust for longer conversations
});
```

---

## 🎨 Customization

### Change App Name/Branding:

Edit `package.json`:
```json
{
  "name": "red-angel-standalone",
  "productName": "Red Angel",
  "description": "Your description here"
}
```

### Change UI Colors/Theme:

Edit `renderer/style.css` - look for gradient colors:
- `#ff4444` - Primary red
- `#667eea` - User message blue
- `#0a0a0f` - Dark background

### Change System Prompt:

Edit `main.js`, find `SYSTEM_PROMPT` constant.

---

## 🐛 Troubleshooting

### Model Won't Load:
- Check model file is named `red-angel.gguf`
- Verify it's in the `models/` folder
- Check file isn't corrupted (try re-downloading)
- Check console for error messages

### App Won't Start:
- Make sure Node.js 18+ is installed
- Run `npm install` again
- Delete `node_modules` and reinstall

### Slow Responses:
- Reduce `gpuLayers` if running out of VRAM
- Use a smaller quantized model (Q4_K_M instead of Q8_0)
- Close other GPU-intensive apps

### Build Fails:
- Make sure all icons are in `build/` folder
- Check model file isn't too large for installer compression
- Try building without compression (edit `package.json`)

---

## 📊 System Requirements

### Minimum:
- **OS:** Windows 10+, macOS 10.15+, or Linux
- **RAM:** 8GB (16GB recommended)
- **Disk:** 10GB free space
- **CPU:** Modern 64-bit processor

### Recommended:
- **RAM:** 16GB+
- **GPU:** NVIDIA RTX 2060+ with 6GB+ VRAM
- **Disk:** SSD with 15GB+ free space

---

## 🛡️ Privacy & Security

**This app is 100% private:**
- ✅ All processing happens on your machine
- ✅ No internet connection required (after download)
- ✅ No data sent to any servers
- ✅ Conversations stay on your computer
- ✅ No telemetry, no tracking, no analytics

**Model runs locally using:**
- llama.cpp (open-source C++ inference)
- Your own hardware (CPU or GPU)
- No external API calls

---

## 📝 License

MIT License - See LICENSE file

---

## 🤝 Credits

- **Created by:** Shayz
- **Model:** Red Angel v1
- **Framework:** Electron + llama.cpp
- **UI:** Custom design with ❤️

---

## 🚀 Next Steps

1. **Get the model** (download GGUF file)
2. **Place in `models/` folder**
3. **Add icons to `build/` folder**
4. **Run `npm install`**
5. **Test with `npm start`**
6. **Build installer with `npm run build:win`**
7. **Share your standalone AI companion!** 😈🩸

---

**Made with 🖕 by Shayz**

