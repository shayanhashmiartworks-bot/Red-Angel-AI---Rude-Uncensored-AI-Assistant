# Red Angel Desktop

**Your Brutally Honest Digital Companion**

A standalone desktop application for Red Angel - your private digital companion that runs completely offline.

## Features

- 🔒 **100% Private** - Everything runs locally on your machine
- 🚀 **No Setup Required** - Download, run, and chat
- 💾 **Offline After First Launch** - Model downloads once, then works forever
- 🎯 **Brutally Honest & Real** - Authentic conversations without corporate filters
- ⚡ **Fast** - Optimized for RTX GPUs with full CUDA support
- 🖥️ **Cross-Platform** - Windows, macOS, and Linux

## Installation

### Windows
1. Download `Red-Angel-1.0.0-win-x64.exe`
2. Double-click to install
3. Launch Red Angel from Start Menu or Desktop

### macOS
1. Download `Red-Angel-1.0.0-mac-x64.dmg` (Intel) or `Red-Angel-1.0.0-mac-arm64.dmg` (Apple Silicon)
2. Open the DMG and drag Red Angel to Applications
3. Launch from Applications folder

### Linux
1. Download `Red-Angel-1.0.0-linux-x64.AppImage`
2. Make it executable: `chmod +x Red-Angel-1.0.0-linux-x64.AppImage`
3. Run: `./Red-Angel-1.0.0-linux-x64.AppImage`

## First Launch

On first launch, Red Angel will:
1. Check if the model exists locally
2. If not, download the Red Angel 8B model (~4.5GB)
3. Load the model into memory
4. Open the chat interface

**Note:** The first launch requires an internet connection to download the model. After that, everything works offline.

## System Requirements

### Minimum
- **OS:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM:** 8GB
- **Storage:** 6GB free space
- **GPU:** NVIDIA GPU with 4GB+ VRAM (for optimal performance)

### Recommended
- **RAM:** 16GB+
- **GPU:** NVIDIA RTX 3060 or better with 8GB+ VRAM
- **Storage:** 10GB free space (SSD recommended)

## Building from Source

### Prerequisites
- Node.js 18+ and npm
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/shayzinasimulation/red-angel-desktop.git
   cd red-angel-desktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm start
   ```

4. **Build for your platform**
   ```bash
   # Windows
   npm run build:win

   # macOS
   npm run build:mac

   # Linux
   npm run build:linux

   # All platforms
   npm run build:all
   ```

5. **Find your build**
   Built applications will be in the `dist/` folder.

## Configuration

### Model Path
By default, models are stored in:
- **Windows:** `%APPDATA%\red-angel-desktop\models\`
- **macOS:** `~/Library/Application Support/red-angel-desktop/models/`
- **Linux:** `~/.config/red-angel-desktop/models/`

### Custom Model URL
To use a different model, edit `main.js` and change the `MODEL_URL` constant:
```javascript
const MODEL_URL = 'https://your-model-url.com/model.gguf';
```

## Troubleshooting

### Model Download Fails
- Check your internet connection
- Try downloading the model manually and placing it in the models folder
- Model URL: [Provide your Hugging Face model URL]

### App Won't Start
- Make sure you have enough disk space (6GB+)
- Check if your GPU drivers are up to date
- Try running without GPU: Edit `src/server.js` and set `gpuLayers: 0`

### Slow Performance
- Make sure you have an NVIDIA GPU
- Update your GPU drivers
- Close other GPU-intensive applications
- Reduce `gpuLayers` in `src/server.js` if you have limited VRAM

### Chat Not Responding
- Check the console for errors (View > Toggle Developer Tools)
- Make sure the backend server started successfully
- Try restarting the application

## Development

### Project Structure
```
Red Angel/
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── package.json         # Dependencies and build config
├── src/
│   └── server.js        # Express + node-llama-cpp backend
├── public/
│   ├── index.html       # Main chat UI
│   └── loading.html     # Loading/download screen
└── build/               # Build resources (icons, etc.)
```

### Tech Stack
- **Electron** - Desktop app framework
- **Express** - Backend server
- **node-llama-cpp** - LLM inference engine
- **electron-builder** - App packaging

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Credits

Created by **Shayz**

- GitHub: [@shayzinasimulation](https://github.com/shayzinasimulation)
- Hugging Face: [@shayzinasimulation](https://huggingface.co/shayzinasimulation)
- X: [@shayzinasimulation](https://x.com/shayzinasimulation)

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Red Angel** - Your brutally honest digital companion. 😈

