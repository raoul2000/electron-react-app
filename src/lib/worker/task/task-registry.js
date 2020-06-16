/**
 * @type {Task.ExecutorMap}
 */
const executorMap = new Map();
/**
 * Register a task Executor for later use.
 * An error is thrown if a task executor is already registered for
 * the same task executor id.
 *
 * @param {Task.Descriptor} taskDescriptor task executor object
 */
const registerTask = (taskDescriptor) => {
  if (executorMap.has(taskDescriptor.id)) {
    throw new Error(`task executor registration failed : duplicate id ${taskDescriptor.id}`);
  }
  executorMap.set(taskDescriptor.id, taskDescriptor.execute);
};

// register core tasks //////////////////////////////////////////////////////////

registerTask(require('../../dummy-task'));
registerTask(require('../../dumb-task'));
registerTask(require('../../read-rss'));
registerTask(require('../../increment-task'));
registerTask(require('../../job1-task'));

// //////////////////////////////////////////////////////////////////////////////

/**
 * Finds a task executor whose ID matches the type of the task passed
 * as argument. If no task executor is found, `null` is returned
 *
 * @param {string} taskType the task type to search executor for
 * @returns (task:App.Task) => Promise<any> | null
 */
const findTaskExecutor = (taskType) => {
  if (executorMap.has(taskType)) { // WARN : note that taskType === taskExecutor.id
    return executorMap.get(taskType);
  }
  return null;
};

module.exports = {
  findTaskExecutor,
  registeredTaskTypes: executorMap.keys,
  executorMap
};
