
const TASK_ID = 'dumb';
/**
 * Execute a task
 * @param {App.Task} task the task to execute
 * @returns Promise<any>
 */
const execute = (task) => {
  console.log('running', task);
  return Promise.resolve({
    'I-am': 'dumb'
  });
};

/**
 * @type App.TaskExecutor
 */
module.exports = {
  id: TASK_ID,
  execute
};
