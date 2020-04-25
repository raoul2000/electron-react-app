/**
 * Handle the erver part of the channel.
 * The Worker renderer process receives taks, execute them and returns the result.
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const taskRegistry = require('./task-registry');

const taskInterval = new Map();
/**
 * Sends a successful Task response to the UI renderer process.
 * The transaction Id of the task request is copied to the response.
 *
 * @param {App.TaskRequest} taskRequest the task request received from UI
 */
const sendSuccessResponse = (taskRequest) => (result) => {
  /**
   * @type App.TaskResponse
   */
  const taskResponse = {
    transactionId: taskRequest.transactionId,
    // eslint-disable-next-line object-shorthand
    result: result
  };
  ipcRenderer.send('to-ui', taskResponse);
};
/**
 * Sends a failure Task response to the UI renderer process.
 * The transaction Id of the task request is copied to the response.
 *
 * @param {App.TaskRequest} taskRequest the task request received from UI
 */
const sendErrorResponse = (taskRequest) => (error) => {
  /**
   * @type App.TaskResponse
   */
  const taskResponse = {
    transactionId: taskRequest.transactionId,
    error: error.message
  };
  ipcRenderer.send('to-ui', taskResponse);
};
/**
 * Finds an executor that matches the task type and execute the task.
 * If no executor is found, an error response is send back to the UI process.
 *
 * @param {Electron.IpcRendererEvent} event the event
 * @param {App.TaskRequest} taskRequest request for task execution
 */
const onReceiveTask = (event, taskRequest) => {
  const executeTask = taskRegistry.findTaskExecutor(taskRequest.task);
  if (executeTask) {
    if (Object.prototype.hasOwnProperty.call(taskRequest, 'interval')) {
      let intervalId = null;
      if (taskRequest.interval === 0) {
        // delete scheduled task: clear interval and don't run this task anymore
        intervalId = taskInterval.get(taskRequest.task.id);
        if (intervalId) {
          clearInterval(intervalId);
          taskInterval.delete(taskRequest.task.id);
        } else {
          console.warn(`request to cancel a scheduled task failed : no scheduled taks with id ${taskRequest.task.id} found`);
        }
      } else {
        // request to schedule a ne task, or change interval for an already scheduled task
        intervalId = taskInterval.get(taskRequest.task.id);
        if (intervalId) {
          // request to change interval for an alreade shcedules task
          clearInterval(intervalId);
          taskInterval.delete(taskRequest.task.id);
          intervalId = setInterval(() => {
            executeTask(taskRequest.task)
              .then(sendSuccessResponse(taskRequest))
              .catch(sendErrorResponse(taskRequest));
          }, taskRequest.interval);
          taskInterval.set(taskRequest.task.id, intervalId);
        } else {
          // request to schedule a new task
          intervalId = setInterval(() => {
            executeTask(taskRequest.task)
              .then(sendSuccessResponse(taskRequest))
              .catch(sendErrorResponse(taskRequest));
          }, taskRequest.interval);
          taskInterval.set(taskRequest.task.id, intervalId);
        }
      }
    } else {
      // a task executor was found : run the task now !
      executeTask(taskRequest.task)
        .then(sendSuccessResponse(taskRequest))
        .catch(sendErrorResponse(taskRequest));
    }
  } else {
    // no task executor is registered for this task : send an error response
    sendErrorResponse(taskRequest)(new Error(`no task executor found for type ${taskRequest.task.type}`));
  }
  return true;
};
/**
 * Initialize the server part of the task runner.
 * Setup an event handler on the `from-ui`channel. This funcntion must be invoked
 * in the worker render process.
 */
const initServer = () => {
  // install event handler to process messages comming from UI process
  ipcRenderer.on('from-ui', onReceiveTask);
};

module.exports = {
  initServer
};
