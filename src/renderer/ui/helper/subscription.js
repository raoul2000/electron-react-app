/**
 * 
 * @param {App.Task} task 
 * @param {App.TaskSubscriptionCallback} cb 
 */
export const subscribe = (task, cb) => {
  console.log('subscribing ...', task);
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.taskChannel) {
    // running in electron : use IPC channel to submit task to the worker
    return exWindow.taskChannel.subscribeTask(task, cb);
  }
  console.error(`task not implemented in the current context ${task}`);
  return false;
};

export const unsubscribe = (task) => {
  console.log('un-subscribing ...');
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.taskChannel) {
    // running in electron : use IPC channel to submit task to the worker
    return exWindow.taskChannel.unsubscribeTask(task);
  }
  console.error(`task not implemented in the current context ${task}`);
  return false;
};
