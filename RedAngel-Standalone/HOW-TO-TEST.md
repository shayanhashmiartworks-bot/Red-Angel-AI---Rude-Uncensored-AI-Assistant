# 🧪 How To Test Locally

## Option 1: Use the Batch File (Easiest)

**Just double-click:**
```
RedAngel-Standalone/START-LOCAL-TEST.bat
```

This will:
1. ✅ Check if dependencies are installed (runs `npm install` if needed)
2. ✅ Check if the model exists
3. ✅ Start the app
4. ⏱️ Wait 10-30 seconds for model to load
5. 🎉 Chat with Red Angel!

---

## Option 2: Create Desktop Shortcut

**From the root folder (`c:\boredm`), double-click:**
```
CREATE-DESKTOP-SHORTCUT.bat
```

This creates a shortcut on your desktop called **"Red Angel Test"**.

Then just double-click the desktop icon to launch!

---

## Option 3: Command Line

Open terminal in `RedAngel-Standalone` folder and run:

```bash
npm install   # First time only
npm start     # Launch the app
```

---

## 📋 Before Testing - Checklist:

### ✅ Prerequisites:
- [ ] Node.js 18+ installed
- [ ] Inside `RedAngel-Standalone` folder

### ✅ Required Files:
- [ ] `models/red-angel.gguf` exists (~4-8GB)
  - Download from: https://huggingface.co/shayzinasimulation/red-angel-v1
  - Get the `.gguf` file (Q4_K_M recommended)
  - Rename to exactly: `red-angel.gguf`
  - Place in `models/` folder

---

## 🎬 What Happens When You Run:

### 1. Loading Screen (10-30 seconds)
```
😈
Red Angel
[Loading spinner]
Loading your companion...
```

The app is loading the AI model into memory. This is normal!

### 2. Chat Interface Appears
```
Header: Red Angel | Your Brutally Honest Companion | Status: Ready
Chat area with welcome message
Input box at bottom
```

### 3. Type a Message!
Try:
- "Hello, who are you?"
- "What can you help me with?"
- "Tell me a joke"

Responses take 2-10 seconds (faster with GPU).

---

## 🐛 Troubleshooting:

### "Model not found" message:
- Check file is at: `RedAngel-Standalone/models/red-angel.gguf`
- File must be named EXACTLY: `red-angel.gguf` (no spaces, no extra extensions)
- File should be 4-8GB in size

### "npm is not recognized":
- Node.js not installed
- Download from: https://nodejs.org/
- Install and restart terminal

### App opens but stays on loading screen:
- Wait longer (up to 60 seconds on slower computers)
- Check console for errors (F12 in the app window)
- Model might be corrupted - try re-downloading

### Responses are very slow (30+ seconds):
- Normal on CPU-only systems
- Consider using a smaller model (Q4_K_M instead of Q8_0)
- Or get a GPU for faster inference

---

## 🎉 Success Indicators:

✅ **App loaded successfully if you see:**
- Chat window with Red Angel header
- Status shows "Ready" with green dot
- Welcome message from Red Angel
- Input box is active (you can type)

✅ **Model is working if:**
- You get a response to your message
- Response is relevant to what you asked
- No error messages appear

---

## 🚀 After Testing:

Once it works locally, you can build the installer:

```bash
npm run build:win
```

This creates: `dist/RedAngel-Setup-1.0.0.exe` (~6-8GB)

Users just download this one file, install, and run!

---

## 💡 Quick Test:

**Fastest way to test:**

1. Navigate to: `c:\boredm\RedAngel-Standalone`
2. Double-click: `START-LOCAL-TEST.bat`
3. Wait 30 seconds
4. Type "hello" and press Enter
5. If you get a response → ✅ It works!

---

**Made with 🖕 by Shayz**

