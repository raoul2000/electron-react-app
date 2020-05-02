export const play = (task) => {
  console.log('subscribing ...', value);

  cb(null, value); // trigger initial dispatch
  const task = {
    id: 'increment-task-1',
    type: 'increment',
    arg: {
      value,
      increment
    }
  };
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

export const stop = (task) => {

};