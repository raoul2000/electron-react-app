// All of the Node.js APIs are available in the preload process
// It has the same sandbox as a Chrome extension

// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

window.sendAsyncMessage = (msg) => ipcRenderer.send('message-from-ui', msg);

window.channel = {
  sendTaskRequest: (taskRequest) => ipcRenderer.send('to-worker', taskRequest),
  receiveTaskResponse: (fn) => {
    ipcRenderer.on('from-worker', (event, result) => {
      fn(result);
    });
  }
};

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg); // prints "pong"
});
// ipcRenderer.send('asynchronous-message', 'ping')

ipcRenderer.on('message-from-worker', (event, arg) => {
  console.log('ipcMain', arg);
});


window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});
