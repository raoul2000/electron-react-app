const { runDummyTask } = require('../../lib/dummy-task');

const submitTask = (task) => {
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.taskRunner) {
    // running in electron : use IPC channel to submit task to the worker
    return exWindow.taskRunner.submitTask(task);
  }
  // not running in electron but in the browser (server mode)
  // perform direct task execution
  console.log('running task', task);
  return runDummyTask(task);
};

export default submitTask;
