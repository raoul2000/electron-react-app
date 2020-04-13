const submitTask = (task) => {
  if (window.taskRunner) {
    return window.taskRunner.submitTask(task);
  }
  console.log('running task', task);
  return Promise.resolve('done');
};

export default submitTask;
