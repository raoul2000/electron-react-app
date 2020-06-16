// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

const sendToWoker = (msg) => ipcRenderer.send('to-worker', msg);
const receiveFromWoker = (handler) => ipcRenderer.on('from-worker', handler);

const sendToClient = (msg) => ipcRenderer.send('to-ui', msg);
const receiveFromClient = (handler) => ipcRenderer.on('from-ui', handler);

module.exports = {
  sendToWoker,
  receiveFromWoker,
  sendToClient,
  receiveFromClient
};
