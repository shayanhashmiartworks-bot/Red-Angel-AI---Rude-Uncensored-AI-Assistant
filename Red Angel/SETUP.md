# Red Angel Desktop - Setup Guide

Complete guide to set up, develop, and build the Red Angel desktop application.

## Quick Start (Development)

### Windows
```bash
# Double-click start.bat
# OR run in terminal:
start.bat
```

### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

## Manual Setup

### 1. Install Prerequisites

#### Node.js
- Download and install from https://nodejs.org/
- Recommended: LTS version (18.x or higher)
- Verify installation: `node --version`

#### Git (Optional)
- Download from https://git-scm.com/
- Only needed if cloning from repository

### 2. Install Dependencies

```bash
cd "Red Angel"
npm install
```

This will install:
- Electron (desktop framework)
- Express (backend server)
- node-llama-cpp (LLM inference)
- electron-builder (packaging tool)

### 3. Configure Model URL

Before first run, you need to set the model download URL.

**Edit `main.js`** and update line 11:
```javascript
const MODEL_URL = 'YOUR_MODEL_URL_HERE';
```

Replace with your actual model URL, for example:
```javascript
const MODEL_URL = 'https://huggingface.co/shayzinasimulation/red-angel-8b-gguf/resolve/main/red-angel-8b-q4.gguf';
```

### 4. Run in Development Mode

```bash
npm start
```

The app will:
1. Launch Electron
2. Show loading screen
3. Check for model file
4. Download model if needed (first time only)
5. Start backend server
6. Load chat interface

## Building for Production

### Build for Current Platform

```bash
npm run build
```

Output will be in `dist/` folder.

### Build for Specific Platform

```bash
# Windows (creates .exe installer and portable .exe)
npm run build:win

# macOS (creates .dmg and .zip)
npm run build:mac

# Linux (creates .AppImage and .deb)
npm run build:linux
```

### Build for All Platforms

```bash
npm run build:all
```

**Note:** Building for macOS requires a Mac. Building for Windows on non-Windows requires Wine.

## Project Structure

```
Red Angel/
├── main.js                 # Electron main process (app lifecycle)
├── preload.js              # Electron preload (IPC bridge)
├── package.json            # Dependencies and build config
│
├── src/
│   └── server.js           # Express backend + llama.cpp
│
├── public/
│   ├── index.html          # Main chat interface
│   └── loading.html        # Loading/download screen
│
├── build/
│   ├── icon.ico            # Windows icon
│   ├── icon.icns           # macOS icon
│   └── icon.png            # Linux icon
│
├── start.bat               # Windows launcher
├── start.sh                # macOS/Linux launcher
├── README.md               # User documentation
└── SETUP.md                # This file
```

## Configuration

### GPU Settings

Edit `src/server.js` to adjust GPU usage:

```javascript
model = new LlamaModel({
  modelPath: MODEL_PATH,
  gpuLayers: 33,  // Adjust based on your GPU
});
```

**GPU Layers Guide:**
- RTX 3070 Ti (8GB): 33 (full offload)
- RTX 3060 (12GB): 33 (full offload)
- RTX 3060 (6GB): 20-25
- GTX 1660 Ti (6GB): 15-20
- No GPU / CPU only: 0

### Context Size

Edit `src/server.js`:

```javascript
context = new LlamaContext({
  model: model,
  contextSize: 4096,  // Increase for longer conversations
});
```

**Context Size Guide:**
- 2048 - Minimum, short conversations
- 4096 - Default, balanced
- 8192 - Long conversations (requires more VRAM)

### Temperature & Generation Settings

Edit `public/index.html`, in the `sendMessage()` function:

```javascript
body: JSON.stringify({
  message: message,
  temperature: 0.8,    // 0.0-1.0 (higher = more creative)
  max_tokens: 2048     // Max response length
})
```

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Model download fails
- Check your internet connection
- Verify the MODEL_URL is correct
- Try downloading manually and placing in models folder

### GPU not detected
- Update NVIDIA drivers
- Install CUDA Toolkit 11.8+
- Verify with: `nvidia-smi`

### Build fails
- Make sure all dependencies are installed
- Check you have enough disk space
- Try building for one platform at a time

### App crashes on launch
- Check console for errors (View > Toggle Developer Tools)
- Verify model file is not corrupted
- Try deleting models folder and re-downloading

## Advanced

### Custom System Prompt

Edit `src/server.js` and modify the `SYSTEM_PROMPT` constant:

```javascript
const SYSTEM_PROMPT = `Your custom system prompt here...`;
```

### Add Custom Endpoints

Edit `src/server.js` and add new Express routes:

```javascript
app.post('/api/your-endpoint', async (req, res) => {
  // Your code here
});
```

### Modify UI

Edit `public/index.html` to customize the chat interface.

### Change Port

Edit `main.js` and `src/server.js` to change from port 3000:

```javascript
// main.js
env: { ...process.env, PORT: '3000' }

// src/server.js
const PORT = process.env.PORT || 3000;
```

## Distribution

### Before Release

1. **Test thoroughly** on target platforms
2. **Add custom icons** to `build/` folder
3. **Update version** in `package.json`
4. **Update README.md** with actual download links
5. **Create release notes**

### Hosting Built Apps

Upload to:
- GitHub Releases
- Hugging Face (for model + app bundle)
- Your own website
- Cloud storage (Google Drive, Dropbox, etc.)

### File Sizes

Approximate sizes:
- Windows installer: ~150MB
- macOS DMG: ~150MB
- Linux AppImage: ~150MB

**Note:** These do NOT include the model file. Model downloads separately on first launch.

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: [Your contact info]

## License

MIT License - See LICENSE file for details

---

Created by **Shayz** | Where politeness goes to hell 😈

