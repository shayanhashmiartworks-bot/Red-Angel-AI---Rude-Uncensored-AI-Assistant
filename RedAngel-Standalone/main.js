const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { LlamaModel, LlamaContext, LlamaChatSession } = require('node-llama-cpp');

let mainWindow;
let model = null;
let context = null;
let session = null;
let isModelLoaded = false;

// Paths
const isDev = process.argv.includes('--dev');
const modelPath = isDev 
  ? path.join(__dirname, 'models', 'red-angel.gguf')  // Development
  : path.join(process.resourcesPath, 'models', 'red-angel.gguf');  // Production

// System prompt for Red Angel
const SYSTEM_PROMPT = `You are Red Angel, a digital companion. Be yourself - authentic, helpful, and honest. No need to force any particular style or personality. Just be natural and genuine in your responses. Remember the conversation history and reference it when relevant.`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0a0a0f',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: true,
    titleBarStyle: 'default',
    title: 'Red Angel - Loading...',
    show: false  // Don't show until model is loaded
  });

  // Load the UI
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Clean up model
    if (session) session = null;
    if (context) context = null;
    if (model) model = null;
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

async function loadModel() {
  try {
    console.log('🚀 Starting Red Angel...');
    console.log('📍 Model path:', modelPath);
    
    // Send status to renderer
    if (mainWindow) {
      mainWindow.webContents.send('model-status', { 
        status: 'loading', 
        message: 'Loading Red Angel model...' 
      });
    }

    // Load the model
    console.log('📦 Loading model from disk...');
    model = new LlamaModel({
      modelPath: modelPath,
      gpuLayers: 33  // Adjust based on GPU VRAM (33 for 8GB VRAM, 0 for CPU only)
    });

    console.log('🧠 Creating context...');
    context = new LlamaContext({
      model: model,
      contextSize: 4096
    });

    console.log('💬 Creating chat session...');
    session = new LlamaChatSession({
      context: context,
      systemPrompt: SYSTEM_PROMPT
    });

    isModelLoaded = true;
    console.log('✅ Red Angel is ready!');

    // Update window title
    if (mainWindow) {
      mainWindow.setTitle('Red Angel - Your Digital Companion');
      mainWindow.webContents.send('model-status', { 
        status: 'ready', 
        message: 'Red Angel is ready!' 
      });
    }

  } catch (error) {
    console.error('❌ Failed to load model:', error);
    isModelLoaded = false;
    
    if (mainWindow) {
      mainWindow.webContents.send('model-status', { 
        status: 'error', 
        message: `Failed to load model: ${error.message}` 
      });
    }
  }
}

// Handle chat messages from renderer
ipcMain.handle('chat', async (event, message) => {
  if (!isModelLoaded || !session) {
    return {
      error: true,
      message: 'Model is not loaded yet. Please wait...'
    };
  }

  try {
    console.log('💬 User:', message);
    
    // Generate response
    const response = await session.prompt(message, {
      temperature: 0.8,
      maxTokens: 2048
    });

    console.log('🤖 Red Angel:', response.substring(0, 100) + '...');

    return {
      error: false,
      message: response
    };

  } catch (error) {
    console.error('❌ Chat error:', error);
    return {
      error: true,
      message: `Error generating response: ${error.message}`
    };
  }
});

// Handle model status check
ipcMain.handle('check-model-status', async () => {
  return {
    loaded: isModelLoaded,
    modelPath: modelPath
  };
});

// App lifecycle
app.whenReady().then(async () => {
  createWindow();
  
  // Start loading model in background
  loadModel();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  // Clean up
  if (session) session = null;
  if (context) context = null;
  if (model) model = null;
});

