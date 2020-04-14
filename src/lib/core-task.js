const dummyTask = require('./dummy-task');
/**
 * Map task Type with task executor function
 */
/**
 * @type Map<string, (task:App.Task) => Promise<any>>
 */
const taskExecutorMap = new Map();
taskExecutorMap.set(dummyTask.TASK_TYPE, dummyTask.execute);

module.exports = {
  taskExecutorMap
};
