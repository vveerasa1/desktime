// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   sendToken: (token) => ipcRenderer.send('token', token),
//   onTokenResponse: (callback) => ipcRenderer.on('token-response', callback)
// });


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  testPreload: () => {
    console.log('✅ Preload script executed!');
    return '✅ Preload is working!';
  },

    sendToken: (token) => ipcRenderer.send('token', token),
    onTokenResponse: (callback) => {
      ipcRenderer.on('token-response', (event, data) => {
        callback(data);
      });
    }
  });
  