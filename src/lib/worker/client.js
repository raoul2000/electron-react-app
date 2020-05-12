// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const uniqid = require('uniqid');
const { commandTypes } = require('./command');

/**
 * Creates a unique transaction ID
 * @returns string the transaction id
 */
const createTransactionId = () => uniqid('tr-');

const isRunOnce = (cmd, payload) => {
  if (cmd === commandTypes.RUN_TASK && payload.cron) {
    return true;
  }
  return false;
};

const defaultResponseCallback = (error, result) => {
  if (error) {
    console.error('default response callback - error', error);
  } else {
    console.log('default response callback - success', result);
  }
};

const activeRequest = new Map();

const send = (cmd, payload, cb) => {
  const responseCb = cb || defaultResponseCallback;
  const request = {
    transactionId: createTransactionId(),
    cmd,
    payload
  };
  activeRequest.set(request.transactionId, { request, cb: responseCb, runOnce: isRunOnce(cmd, payload) });
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
