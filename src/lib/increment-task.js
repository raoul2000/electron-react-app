
const TASK_ID = 'increment';
/**
 * Execute a task
 * @param {App.Task} task the task to execute
 * @returns Promise<any>
 */
const execute = (task) => {
  console.log('running', task);
  return Promise.resolve(22);
};

/**
 * @type App.TaskExecutor
 */
module.exports = {
  id: TASK_ID,
  execute
};
