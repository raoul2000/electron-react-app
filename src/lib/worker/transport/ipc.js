// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

export const sendToWoker = (msg) => ipcRenderer.send('to-worker', msg);
export const receiveFromWoker = (handler) => ipcRenderer.on('from-worker', handler);

export const sendToClient = (msg) => ipcRenderer.send('to-ui', msg);
export const receiveFromClient = (handler) => ipcRenderer.on('from-ui', handler);
