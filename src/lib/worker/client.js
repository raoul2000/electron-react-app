const uniqid = require('uniqid');
const { sendToWoker, receiveFromWoker } = require('./transport/ipc');
/**
 * @type {Map<string, Worker.ResponseHandler>} for each outgoing message a new entry is created and will be used
 * to process the message response
 */
const responseHandler = new Map();
/**
 * Creates a unique transaction ID
 * @returns {Worker.TransactionId} the transaction id
 */
const createTransactionId = () => uniqid('tr-');
/**
 * Send a message to the worker
 *
 * @param {string} cmd the command
 * @param {any} payload payload
 * @param {Worker.ResultCallback} resultCb callback function to process the response
 * @param {Worker.ProgressCallback} progressCb callback function to process progress message
 */
const send = (cmd, payload, resultCb, progressCb) => {
  if (resultCb && typeof resultCb !== 'function') {
    throw new Error('invalid argument type: resultCb must be a function');
  }
  if (progressCb && typeof progressCb !== 'function') {
    throw new Error('invalid argument type: progressCb must be a function');
  }

  /**
   * @type {Worker.Request}
   */
  const request = {
    transactionId: createTransactionId(),
    cmd,
    payload
  };
  // Store the request so to be able to invoke callbacks when a response
  // will be received
  responseHandler.set(request.transactionId, { resultCb, progressCb });

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
 * @param {Worker.Response} response the response message
 */
const receive = (response) => {
  /**
   * @type {Worker.ResponseHandler}
   */
  const handler = responseHandler.get(response.transactionId);
  if (!handler) {
    console.error('received unexpected response from worker', response);
  } else if (handler.progressCb && response.progress !== undefined) {
    // received a progress info
    handler.progressCb(response.progress);
  } else if (handler.resultCb) {
    handler.resultCb(response.error, response.result);
  }

  // can we expect more result/error later ?
  if (!response.keepHandler || !handler.resultCb) {
    // no : remove request from responseHandler map
    responseHandler.delete(response.transactionId);
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
