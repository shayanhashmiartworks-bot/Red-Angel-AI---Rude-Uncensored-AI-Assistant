const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  checkModel: () => ipcRenderer.invoke('check-model'),
  downloadModel: () => ipcRenderer.invoke('download-model'),
  startApp: () => ipcRenderer.invoke('start-app'),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback)
});

