export const subscribe = (value, cb) => {
  console.log('subscribing ...', value);

  cb(value); // trigger initial dispatch
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.taskChannel) {
    // running in electron : use IPC channel to submit task to the worker
    return exWindow.taskChannel.subscribe(task);
  }
  console.error(`task not implemented in the current context ${task}`);
  return false;
};

export const unsubscribe = () => {
  console.log('un-subscribing ...');
  clearInterval(intervalId);
};
