
const TASK_ID = 'increment';
/**
 * Execute a task
 * @param {App.Task} task the task to execute
 * @returns Promise<any>
 */
const execute = (task) => {
  // TODO: validate task shape object (json schema validation)
  console.log('running', task);
  // eslint-disable-next-line no-param-reassign
  task.arg.value = parseInt(task.arg.value, 10) + task.arg.increment;
  return Promise.resolve(task.arg.value);
};

/**
 * @type App.TaskExecutor
 */
module.exports = {
  id: TASK_ID,
  execute
};
