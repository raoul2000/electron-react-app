/**
 * Create the web service endpoint to execute a task
 * @param {App.Task} task the task object
 * @returns string
 */
const buildWebservicePathFromTask = (task) => `/api/task/${task.type}`;

const buildWebservicePathFromTaskExecutorId = (taskExecutorId) => `/api/task/${taskExecutorId}`;

module.exports = {
  buildWebservicePathFromTask,
  buildWebservicePathFromTaskExecutorId
};
