const { contextBridge, ipcRenderer } = require('electron');

console.log('✅ Preload script executed!'); // This log should appear in your Electron terminal

contextBridge.exposeInMainWorld('electronAPI', {
  testPreload: () => {
    console.log('✅ Preload script testPreload function called!');
    return '✅ Preload is working!';
  },
  sendToken: (token) => { // Make sure sendToken is here
    console.log('Preload: Sending token to main process:', token);
    ipcRenderer.send('token', token);
  },
  onTokenResponse: (callback) => {
    console.log('Preload: Setting up token response listener.');
    ipcRenderer.on('token-response', (event, data) => {
      console.log('Preload: Received token response from main process:', data);
      callback(data);
    });
  }
});