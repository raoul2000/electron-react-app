/**
 * This module is responsible for task execution.
 * Being given a task object, it finds the appropriate task executor instance
 * and invoke it to execute the task.
 */
const dummyTask = require('./dummy-task');
/**
 * @type Map<string, (task:App.Task) => Promise<any>>
 */
const taskExecutorMap = new Map();
taskExecutorMap.set(dummyTask.TASK_TYPE, dummyTask.execute);

/**
 * Finds a matching executor and execute the task.
 * If no executor is found, returns a rejected promise.
 *
 * @param {App.Task} task the task to execute
 * @returns Promise<any>
 */
const execute = (task) => {
  const executor = taskExecutorMap.get(task.type);
  if (executor) {
    return executor(task);
  }
  return Promise.reject(new Error(`no task executor found for type ${task.type}`));
};

module.exports = {
  execute
};
