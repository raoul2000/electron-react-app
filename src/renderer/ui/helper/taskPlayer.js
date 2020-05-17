import { commandTypes } from '../../../lib/worker/command';

const sendToWorker = (commandType, task, cb, progressCb) => {
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.sendToWorker) {
    // running in electron : use IPC channel to submit task to the worker
    console.log('sending message to worker');
    exWindow.sendToWorker(commandType, task, cb, progressCb);
    return true;
  }
  console.error('sendToWorker not implemented in the current context');
  return false;
};

/**
 * Send a task to run by the worker
 * @param {object} task the task to execute
 * @param {App.WorkerResultCallback} cb call back funcntion invoked on result reception
 * @param {App.WorkerProgressCallback} progressCb progress callback function
 */
export const play = (task, cb, progressCb = undefined) => sendToWorker(commandTypes.RUN_TASK, task, cb, progressCb);
export const stop = (taskId, cb) => sendToWorker(commandTypes.STOP_TASK, taskId, cb);
export const subscribeQueueInfo = (cb) => sendToWorker(commandTypes.QUEUE_INFO, null, cb);
