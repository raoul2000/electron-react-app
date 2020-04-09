const { ipcRenderer, remote } = require('electron');
/**
 * Detect if Electron is running in development mode
 */
const isDev = () => remote.process.argv[2] === '--dev';

console.log(`IS_DEV = ${isDev()}`);
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

// window.sendAsyncMessage = (msg) => ipcRenderer.send('asynchronous-message', msg)
window.sendAsyncMessage = (msg) => ipcRenderer.send('message-from-ui', msg);


ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg); // prints "pong"
});
// ipcRenderer.send('asynchronous-message', 'ping')

ipcRenderer.on('message-from-worker', (event, arg) => {
  console.log('ipcMain', arg);
});
