const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
const MODEL_DIR = path.join(app.getPath('userData'), 'models');
const MODEL_PATH = path.join(MODEL_DIR, 'red-angel-8b-q4.gguf');
const MODEL_URL = 'https://huggingface.co/shayzinasimulation/red-angel-8b-gguf/resolve/main/red-angel-8b-q4.gguf'; // You'll provide this

// Ensure model directory exists
if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true });
}

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
    show: false
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the splash/loading screen first
  mainWindow.loadFile(path.join(__dirname, 'public', 'loading.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

function downloadModel(onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(MODEL_PATH);
    let downloadedBytes = 0;
    let totalBytes = 0;

    https.get(MODEL_URL, (response) => {
      totalBytes = parseInt(response.headers['content-length'], 10);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const progress = (downloadedBytes / totalBytes) * 100;
        onProgress(progress, downloadedBytes, totalBytes);
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(MODEL_PATH, () => {});
      reject(err);
    });
  });
}

function startBackendServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, 'src', 'server.js');
    
    serverProcess = spawn('node', [serverPath, MODEL_PATH], {
      env: { ...process.env, PORT: '3000' }
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
      if (data.toString().includes('Server running')) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      resolve(); // Resolve anyway, UI will handle connection errors
    }, 30000);
  });
}

// IPC Handlers
ipcMain.handle('check-model', async () => {
  return fs.existsSync(MODEL_PATH);
});

ipcMain.handle('download-model', async (event) => {
  try {
    await downloadModel((progress, downloaded, total) => {
      event.sender.send('download-progress', {
        progress: Math.round(progress),
        downloaded,
        total
      });
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('start-app', async () => {
  try {
    // Start the backend server
    await startBackendServer();
    
    // Load the main UI
    mainWindow.loadURL('http://localhost:3000');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// App lifecycle
app.whenReady().then(createWindow);

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
  if (serverProcess) {
    serverProcess.kill();
  }
});

