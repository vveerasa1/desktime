// D:\avinesh-works\desktime-app\desktime\preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  testPreload: () => {
    return '✅ Preload is working!';
  },
  sendToken: (token) => {
    ipcRenderer.send('token', token);
  },
  onTokenResponse: (callback) => {
    ipcRenderer.on('token-response', (event, data) => {
      callback(data);
    });
  }
});
