const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Send chat message
  chat: (message) => ipcRenderer.invoke('chat', message),
  
  // Check model status
  checkModelStatus: () => ipcRenderer.invoke('check-model-status'),
  
  // Listen for model status updates
  onModelStatus: (callback) => {
    ipcRenderer.on('model-status', (event, data) => callback(data));
  }
});

