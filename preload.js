const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendToken: (token) => ipcRenderer.send('token', token),
  onTokenResponse: (callback) => ipcRenderer.on('token-response', callback)
});
