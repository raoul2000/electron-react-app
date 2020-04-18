import { buildWebservicePathFromTask } from '../../../main/server/helper';
/**
 * Execute a task and returns the promise of a result
 * @param {App.Task} task the task to run
 * @returns Promise<any> the result
 */
const submitTask = (task) => {
  console.log('submiting task', task);
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.taskChannel) {
    // running in electron : use IPC channel to submit task to the worker
    return exWindow.taskChannel.submitTask(task);
  }

  // not running in electron but in the browser (server mode). In this case the only
  // option is to send an HTTP request to the server

  // build WS endpoint (by convention)
  const servicePath = buildWebservicePathFromTask(task);
  console.log(`task request forwarded to web service endpoint '${servicePath}'`);
  return fetch(servicePath);
};

export default submitTask;
