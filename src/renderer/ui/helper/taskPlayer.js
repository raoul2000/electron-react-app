import { commandTypes } from '../../../lib/worker/command';

/**
 * 
 * @param {object} task the task to execute
 * @param {App.WorkerResultCallback} cb call back funcntion invoked on result reception
 * @param {App.WorkerProgressCallback} progressCb progress callback function
 */
export const play = (task, cb, progressCb = undefined) => {
  console.log('play ...', task);
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.sendToWorker) {
    // running in electron : use IPC channel to submit task to the worker
    console.log('sending message to worker');
    return exWindow.sendToWorker(commandTypes.RUN_TASK, task, cb, progressCb);
  }
  console.error(`task not implemented in the current context ${task}`);
  return false;
};

export const stop = (task, cb) => {
  console.log('stop ...', task);
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.sendToWorker) {
    // running in electron : use IPC channel to submit task to the worker
    console.log('sending message to worker');
    return exWindow.sendToWorker(commandTypes.SUSPEND_TASK, task.id, cb);
  }
  console.error(`task not implemented in the current context ${task}`);
  return false;
};
