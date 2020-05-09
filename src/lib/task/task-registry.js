/**
 * @type Map<string, (task:App.Task) => Promise<any>>
 */
const taskExecutorMap = new Map();
/**
 * Register a task Executor for later use.
 * An error is thrown if a task executor is already registered for
 * the same task executor id.
 *
 * @param {App.TaskExecutor} taskExecutor task executor object
 */
const registerTaskExecutors = (taskExecutor) => {
  if (taskExecutorMap.has(taskExecutor.id)) {
    throw new Error(`task executor registration failed : duplicate id ${taskExecutor.id}`);
  }
  taskExecutorMap.set(taskExecutor.id, taskExecutor.execute);
};

// register core tasks //////////////////////////////////////////////////////////

registerTaskExecutors(require('../dummy-task'));
registerTaskExecutors(require('../dumb-task'));
registerTaskExecutors(require('../read-rss'));
registerTaskExecutors(require('../increment-task'));
registerTaskExecutors(require('../job1-task'));

// //////////////////////////////////////////////////////////////////////////////

/**
 * Finds a task executor whose ID matches the type of the task passed
 * as argument. If no task executor is found, `null` is returned
 *
 * @param {string} taskType the task type to search executor for
 * @returns (task:App.Task) => Promise<any> | null
 */
const findTaskExecutor = (taskType) => {
  if (taskExecutorMap.has(taskType)) { // WARN : note that taskType === taskExecutor.id
    return taskExecutorMap.get(taskType);
  }
  return null;
};

module.exports = {
  findTaskExecutor,
  registeredTaskTypes: taskExecutorMap.keys,
  taskExecutorMap
};
