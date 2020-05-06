/**
 * Handle the erver part of the channel.
 * The Worker renderer process receives taks, execute them and returns the result.
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const taskRegistry = require('./task-registry');
/**
 * @type Map<string, NodeJS.Timeout>
 */
const taskSubscriptions = new Map();

// helper functions ///////////////////////////////////////////////////////////////////////////////////////////

const isSubscriptionTask = (taskRequest) => Object.prototype.hasOwnProperty.call(taskRequest, 'subscribe');
const isRequestToUnsubscribe = (taskRequest) => taskRequest.subscribe === false;
const buildMapKey = (taskRequest) => taskRequest.task.id;

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    taskId: taskRequest.task.id,
    // eslint-disable-next-line object-shorthand
    result: result
  };
  if (taskRequest.subscribe === true) {
    taskResponse.subscribe = true;
  }
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
    taskId: taskRequest.task.id,
    error: error.message
  };
  if (taskRequest.subscribe === true) {
    taskResponse.subscribe = true;
  }
  ipcRenderer.send('to-ui', taskResponse);
};


const unsubscribeTask = (taskMap, taskRequest) => {
  const key = buildMapKey(taskRequest);
  const intervalId = taskMap.get(key);
  if (intervalId) {
    clearInterval(intervalId);
    taskMap.delete(key);
  } else {
    console.warn(`request to cancel a scheduled task failed : no scheduled task with id ${key} found`);
  }
};

const createTaskSubscription = (taskMap, executeTask, taskRequest) => {
  const key = buildMapKey(taskRequest);
  const intervalId = setInterval(() => {
    executeTask(taskRequest.task)
      .then(sendSuccessResponse(taskRequest))
      .catch(sendErrorResponse(taskRequest));
  }, taskRequest.interval || 4000);
  taskMap.set(key, intervalId);
  return intervalId;
};

const updateTaskSubscription = (intervalId, taskMap, taskRequest, executeTask) => {
  const key = buildMapKey(taskRequest);
  clearInterval(intervalId);
  taskMap.delete(key);
  const newIntervalId = setInterval(() => {
    executeTask(taskRequest.task)
      .then(sendSuccessResponse(taskRequest))
      .catch(sendErrorResponse(taskRequest));
  }, taskRequest.interval || 4000);
  taskMap.set(key, newIntervalId);
  return newIntervalId;
};

const executeTaskOnce = (taskExecutor, taskRequest) => {
  taskExecutor(taskRequest.task)
    .then(sendSuccessResponse(taskRequest))
    .catch(sendErrorResponse(taskRequest));
};
/**
 * Finds an executor that matches the task type and execute the task.
 * If no executor is found, an error response is send back to the UI process.
 *
 * @param {Electron.IpcRendererEvent} event the event
 * @param {App.TaskRequest} taskRequest request for task execution
 */
const onReceiveTask = (event, taskRequest) => {
  const taskExecutor = taskRegistry.findTaskExecutor(taskRequest.task.type);
  if (taskExecutor) {
    if (isSubscriptionTask(taskRequest)) {
      // is ia a request to unsubscribe to a task ?
      if (isRequestToUnsubscribe(taskRequest)) {
        // delete scheduled task: clear interval and don't run this task anymore
        unsubscribeTask(taskSubscriptions, taskRequest);
      } else {
        // request to schedule a new task, or change interval for an already scheduled task
        const intervalId = taskSubscriptions.get(taskRequest.task.id);
        if (intervalId) {
          // request to change interval for an already shceduled task
          updateTaskSubscription(intervalId, taskSubscriptions, taskRequest, taskExecutor);
        } else {
          // request to schedule a new task
          createTaskSubscription(taskSubscriptions, taskExecutor, taskRequest);
        }
      }
    } else {
      // a task executor was found : run the task once now !
      executeTaskOnce(taskExecutor, taskRequest);
    }
  } else {
    // no task executor is registered for this task : send an error response
    sendErrorResponse(taskRequest)(new Error(`no task executor found for task type "${taskRequest.task.type}"`));
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
  // ipcRenderer.on('from-ui', onReceiveTask);

  ipcRenderer.on('from-ui', (event, taskRequest) => {
    // eslint-disable-next-line global-require
    const queue = require('./queue').initQueue();
    const myJob = { id: 'my-task', type: 'long', value: 12 };

    queue.push(myJob)
      .on('finish', (result) => {
        console.log(`FINISH - result: ${result}`);
      })
      .on('failed', (err) => {
        console.error(err);
      })
      .on('progress', (progress) => {
        console.log('progress');
        console.log(progress);
      })
      .on('task_progress', (progress) => {
        console.log('task_progress');
        console.log(progress);
      });
  });
};

module.exports = {
  initServer
};
