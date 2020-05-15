// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const uniqid = require('uniqid');

/**
 * Creates a unique transaction ID
 * @returns string the transaction id
 */
const createTransactionId = () => uniqid('tr-');

const defaultResponseCallback = (error, result) => {
  if (error) {
    console.error('default response callback - error', error);
  } else {
    console.log('default response callback - success', result);
  }
};

const activeRequest = new Map();
/**
 * Send a message to the worke
 *
 * @param {string} cmd the command
 * @param {any} payload payload
 * @param {App.WorkerResultCallback} cb callback function to process the response
 * @param {App.WorkerProgressCallback} progressCb callback function to process progress message
 */
const send = (cmd, payload, cb, progressCb) => {
  const responseCb = cb || defaultResponseCallback;
  const request = {
    transactionId: createTransactionId(),
    cmd,
    payload
  };
  activeRequest.set(request.transactionId, { request, cb: responseCb, progressCb });
  ipcRenderer.send('to-worker', request);
};
/**
 * Processes a response received from the worker
 * @param {*} event the event (not used)
 * @param {App.Response} response the response message
 */
const receive = (event, response) => {
  const request = activeRequest.get(response.transactionId);
  if (!request) {
    console.error('received unexpected response from worker', response);
  } else if (request.progressCb && response.progress !== undefined) {
    // received a progress info
    request.progressCb(response.progress);
  } else {
    request.cb(response.error, response.result);
    // can we expect more result/error later ?
    if (request.moreLater === false) {
      // no : remove request from activeRequest map
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
