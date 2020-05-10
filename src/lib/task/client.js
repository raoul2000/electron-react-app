// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const uniqid = require('uniqid');

/**
 * Creates a  unique transaction ID
 * @returns string the transaction id
 */
const createTransactionId = () => uniqid('transac-');

const messageMap = new Map();

const submitTask = (task, cb) => {
  /**
   * @type App.TaskRequest
   */
  const taskRequest = {
    transactionId: createTransactionId(),
    task,
    callback: cb
  };
  if (messageMap.has(taskRequest.transactionId)) {
    return Promise.reject(new Error(`task already submitted for execution (transaction id = ${taskRequest.transactionId})`));
  }
};

const initClient = () => {

  window.worker = {
    submitTask
  }
};

// /////////////////////////////////////////////////////////////////:

module.exports = {
  initClient
};
