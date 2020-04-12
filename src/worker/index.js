// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const ipcRenderer = require('electron').ipcRenderer;

const send = (msg) => {
  ipcRenderer.send('message-from-worker', msg);
};

ipcRenderer.on('message-from-ui', (event, arg) => {
  console.log('arg:', arg);
  setTimeout(() => {
    send(arg);
  }, 1000);
});


const message2UI = (command, payload) => {
  ipcRenderer.send('message-from-worker', {
    command,
    payload
  });
};

message2UI('helloWorld', { myParam: 1337, anotherParam: 42 });
