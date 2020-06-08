// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const uniqid = require('uniqid');
/**
 * @type {Map<string, App.RequestDescriptor>} for each outgoing message a new entry is created and will be used
 * to process the message response
 */
const activeRequest = new Map();
/**
 * Creates a unique transaction ID
 * @returns string the transaction id
 */
const createTransactionId = () => uniqid('tr-');
/**
 * The default response callbask is used when a message is sent with
 * and no callback is provided
 *
 * @param {any} error object describing the error
 * @param {any} result result data
 */
const defaultResponseCallback = (error, result) => {
  if (error) {
    console.error('default response callback - error', error);
  } else {
    console.log('default response callback - success', result);
  }
};
/**
 * Send a message to the worker
 *
 * @param {string} cmd the command
 * @param {any} payload payload
 * @param {App.WorkerResultCallback} cb callback function to process the response
 * @param {App.WorkerProgressCallback} progressCb callback function to process progress message
 */
const send = (cmd, payload, cb, progressCb) => {
  const responseCb = cb || defaultResponseCallback;
  /**
   * @type {App.WorkerRequest}
   */
  const request = {
    transactionId: createTransactionId(),
    cmd,
    payload
  };
  // Store the request so to be able to invoke callbacks when a response
  // will be received
  activeRequest.set(request.transactionId, { request, cb: responseCb, progressCb });

  // send the request
  ipcRenderer.send('to-worker', request);
};
/**
 * Processes a response received from the worker.
 *
 * Use the *transactionId* to find the previously saved request and invoke
 * the callback function. Depending on the response's *progress* attribute
 * the progress callback or the result callback is invoked.
 *
 * @param {*} event the event (not used)
 * @param {App.WorkerResponse} response the response message
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
    if (!response.scheduled) {
      // no : remove request from activeRequest map
      activeRequest.delete(response.transactionId);
    }
  }
};

const initClient = () => {
  // @ts-ignore
  window.sendToWorker = send;
  ipcRenderer.on('from-worker', receive);
};

// /////////////////////////////////////////////////////////////////:

module.exports = {
  initClient
};
