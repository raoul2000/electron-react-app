// All of the Node.js APIs are available in the preload process
// It has the same sandbox as a Chrome extension

// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

window.sendAsyncMessage = (msg) => ipcRenderer.send('message-from-worker', msg);

ipcRenderer.on('message-from-ui', (event, arg) => {
  console.log('ipcMain', arg);
});


window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});
