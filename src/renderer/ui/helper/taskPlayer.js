export const play = (task, cb) => {
  console.log('play ...', task);
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.taskChannel) {
    // running in electron : use IPC channel to submit task to the worker
    console.log('sending message to worker');
    return exWindow.taskChannel.subscribeTask(task, cb);
  }
  console.error(`task not implemented in the current context ${task}`);
  return false;
};

export const stop = (task) => {
  console.log('stop...', task);
};