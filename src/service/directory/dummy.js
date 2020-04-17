const dummyTask = require('../../lib/dummy-task');
/**
 * @type Map<string, App.TaskExecutorFunction>
 */
const taskExecutorMap = new Map();
taskExecutorMap.set(dummyTask.id, dummyTask.execute);
/**
 * returns the function suitable to execute a task given its id, or NULL if
 * no such tak executor has been registered.
 *
 * @param {string} id task executor Id
 * @returns App.TaskExecutorFunction|null
 */
const findTaskExecutor = (id) => taskExecutorMap.get(id);
/**
 * @type App.ServiceDescriptor
 */
module.exports = {
  id: 'dummy-service',
  findTaskExecutor
};
