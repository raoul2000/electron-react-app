const dummyTask = require('./dummy-task');
/**
 * Map task Type with task executor function
 */
/**
 * @type Map
 */
const taskExecutorMap = new Map();
taskExecutorMap.set(dummyTask.TASK_TYPE, dummyTask.execute);
/**
 * @type Map<string,any>
 */
export default taskExecutorMap;
