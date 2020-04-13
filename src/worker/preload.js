// All of the Node.js APIs are available in the preload process
// It has the same sandbox as a Chrome extension

// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

ipcRenderer.on('message-from-ui', (event, arg) => {
  console.log('ipcMain', arg);
});

const runTask = (task) => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('runTask...');
    resolve('result ok ');
    // reject('error!')
  }, 1000);
});

const sendSuccessResponse = (taskRequest) => (result) => {
  console.log('sendSuccessResponse');
  ipcRenderer.send('to-ui', {
    id: taskRequest.id,
    result
  });
};

const sendErrorResponse = (taskRequest) => (error) => {
  console.log('sendErrorResponse');
  ipcRenderer.send('to-ui', {
    id: taskRequest.id,
    error
  });
};

ipcRenderer.on('from-ui', (event, taskRequest) => {
  console.log('taskRequest:', taskRequest);
  runTask(taskRequest)
    .then(sendSuccessResponse(taskRequest))
    .catch(sendErrorResponse(taskRequest));
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});
