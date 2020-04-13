const { runDummyTask } = require('../../lib/dummy-task');

const submitTask = (task) => {
  if (window.taskRunner) {
    return window.taskRunner.submitTask(task);
  }
  console.log('running task', task);
  return runDummyTask(task);
};

export default submitTask;
