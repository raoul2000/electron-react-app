const uniqid = require('uniqid');
const { sendToWoker, receiveFromWoker } = require('./transport/ipc');
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
 * Send a message to the worker
 *
 * @param {string} cmd the command
 * @param {any} payload payload
 * @param {App.WorkerResultCallback} resultCb callback function to process the response
 * @param {App.WorkerProgressCallback} progressCb callback function to process progress message
 */
const send = (cmd, payload, resultCb, progressCb) => {
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
  activeRequest.set(request.transactionId, { request, resultCb, progressCb });

  // send the request
  sendToWoker(request);
};
/**
 * Processes a response received from the worker.
 *
 * Use the *transactionId* to find the previously saved request and invoke
 * the callback function. Depending on the response's *progress* attribute
 * the progress callback or the result callback is invoked.
 *
 * @param {App.WorkerResponse} response the response message
 */
const receive = (response) => {
  const request = activeRequest.get(response.transactionId);
  if (!request) {
    console.error('received unexpected response from worker', response);
  } else if (request.progressCb && response.progress !== undefined) {
    // received a progress info
    request.progressCb(response.progress);
  } else {
    request.resultCb(response.error, response.result);
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
  receiveFromWoker((event, response) => receive(response));
};

// /////////////////////////////////////////////////////////////////:

module.exports = {
  initClient
};
