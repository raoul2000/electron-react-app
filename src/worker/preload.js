// All of the Node.js APIs are available in the preload process
// It has the same sandbox as a Chrome extension

const { ipcRenderer, remote } = require('electron');
/**
 * Detect if Electron is running in development mode
 */
const isDev = () => remote.process.argv[2] === '--dev';


window.sendAsyncMessage = (msg) => ipcRenderer.send('message-from-worker', msg);

ipcRenderer.on('message-from-ui', (event, arg) => {
  console.log('ipcMain', arg);
});


window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});
