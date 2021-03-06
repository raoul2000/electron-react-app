/**
 * Handle the erver part of the channel.
 * The Worker renderer process receives taks, execute them and returns the result.
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { throttle } = require('throttle-debounce');
const { sendToClient, receiveFromClient } = require('./transport/ipc');
const {
  initQueue, addCronJob, addJob, queueInfo, removeCronJob
} = require('./queue');
const taskRegistry = require('./task/task-registry');
const { commandTypes } = require('./command');
/**
 * Sends a response back to the client
 * @param {Worker.Response} response the response object
 */
const sendResponse = (response) => sendToClient(response);
const sendErrorResponse = (transactionId, error, keepHandler) => sendResponse({ transactionId, error, keepHandler });
const sendSuccessResponse = (transactionId, result, keepHandler) => sendResponse({ transactionId, result, keepHandler });
const sendProgressResponse = (transactionId, progress) => sendResponse({ transactionId, progress });
/**
 * In order to limit the number of progress messages that could be sent to the client
 * the progress callback returned is throttled with a value of 300 ms.
 *
 * @param {Worker.TransactionId} transactionId transaction Id
 */
const buildProgressCallback = (transactionId) => throttle(300, (progress) => sendProgressResponse(transactionId, progress));

/**
 * Run a task.
 *
 * If the `task` has a property `cron` then it is schedule to run based on this crontab value.
 * Otherwise the task is run only once and then discarded : it will only return one response
 * being a result or an error. The **cron** property has following format :
 * ```
 * {
 *  cron: '* * * * * * '
 * }
 * ```
 * For more info about the cron format see [cron home page](https://github.com/kelektiv/node-cron#readme)
 *
 * If the `task` has a `progress` property set to TRUE, then this task is supposed to send
 * progress information as response before returning the actual result/error. The progress response
 * has following shape:
 * ```json
 * {
 *  transactionId: 'the_transaction_id',
 *  progress: any progress data
 * }
 * ```
 * The shape of the progress data depends on the task/
 *
 * @param {Worker.TransactionId} transactionId the transaction identifier
 * @param {any} task the task to run
 */
const doRunTask = (transactionId, task) => {
  let progressCb = null;
  if (task.progress === true) {
    progressCb = buildProgressCallback(transactionId);
  }

  if (task.cron) {
    // job scheduled to run on cron : result/error are processed
    // by a callback.
    const settleCb = (err, result) => {
      if (err) {
        console.error(err);
        sendErrorResponse(transactionId, err, true);
      } else {
        sendSuccessResponse(transactionId, result, true);
      }
    };
    addCronJob(task, task.cron, settleCb, progressCb);
  } else {
    // job will run once. It must return a Promise
    addJob(task, progressCb)
      .then((result) => { sendSuccessResponse(transactionId, result); })
      .catch((error) => { sendErrorResponse(transactionId, error); });
  }
};
/**
 * Stop a task that has been shceduled (i.e it has a `cron` property).
 * If the task is not found or is not scheduled, and error response is sent back. In case of
 * success, the response result has the value 'true' (boolean)
 *
 * @param {Worker.TransactionId} transactionId id of the transaction who made the stop request
 * @param {string} taskId Id of the task to stop
 */
const doStopTask = (transactionId, taskId) => {
  if (removeCronJob(taskId)) {
    sendSuccessResponse(transactionId, true);
  } else {
    sendErrorResponse(transactionId, `task not found : id = ${taskId}`);
  }
};

const doQueueInfo = (transactionId) => {
  sendSuccessResponse(transactionId, queueInfo());
};
/**
 * Perform the actions requested by the recevied Worker Request
 *
 * @param {Worker.Request} request the request to handle
 */
const handleClientRequest = (request) => {
  switch (request.cmd) {
    case commandTypes.RUN_TASK:
      doRunTask(request.transactionId, request.payload);
      break;
    case commandTypes.STOP_TASK:
      doStopTask(request.transactionId, request.payload);
      break;
    case commandTypes.QUEUE_INFO: // TODO: consider queueInfo as a task (no special process)
      doQueueInfo(request.transactionId);
      break;
    default:
      console.error(`unkown request command : ${request.cmd}`, request);
      sendErrorResponse(request.transactionId, `unkown command : ${request.cmd}`, false);
      break;
  }
};

/**
 * Initialize the server part of the task runner.
 * Setup an event handler on the `from-ui`channel. This funcntion must be invoked
 * in the worker render process.
 */
const initServer = () => {
  // initialize the internal job queue
  initQueue(100, taskRegistry.executorMap);

  // install event handler to process messages comming from UI process
  receiveFromClient((event, request) => handleClientRequest(request));
};

module.exports = {
  initServer
};
