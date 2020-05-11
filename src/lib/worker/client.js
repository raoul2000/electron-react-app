// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const uniqid = require('uniqid');

/**
 * Creates a  unique transaction ID
 * @returns string the transaction id
 */
const createTransactionId = () => uniqid('transac-');

const activeRequest = new Map();
// TODO: review this runOnce
const send = (action, payload, cb, runOnce = true) => {
  const request = {
    transactionId: createTransactionId(),
    action,
    payload
  };
  activeRequest.set(request.transactionId, { request, cb, runOnce });
  ipcRenderer.send('to-worker', request);
};

const receive = (event, response) => {
  const request = activeRequest.get(response.transactionId);
  if (!request) {
    console.error('received unexpected response from worker', response);
  } else {
    request.cb(response.error, response.result);
    if (request.runOnce === true) {
      activeRequest.delete(response.transactionId);
    }
  }
};

const initClient = () => {
  window.sendToWorker = send;
  ipcRenderer.on('from-worker', receive);
};

// /////////////////////////////////////////////////////////////////:

module.exports = {
  initClient
};
