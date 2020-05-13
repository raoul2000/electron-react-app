/**
 * Handle the erver part of the channel.
 * The Worker renderer process receives taks, execute them and returns the result.
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const { throttle } = require('throttle-debounce');
const {
  initQueue, addCronJob, addJob, queueInfo, removeCronJob
} = require('./queue');
const taskRegistry = require('../task/task-registry');
const { commandTypes } = require('./command');

const sendResponse = (response) => ipcRenderer.send('to-ui', response);
const sendErrorResponse = (transactionId, error, moreLater) => sendResponse({ transactionId, error, moreLater });
const sendSuccessResponse = (transactionId, result, moreLater) => sendResponse({ transactionId, result, moreLater });
const sendProgressResponse = (transactionId, progress) => sendResponse({ transactionId, progress });
const buildProgressCallback = (transactionId) => throttle(300, (progress) => sendProgressResponse(transactionId, progress));

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

const doStopTask = (transactionId, payload) => {
  if (removeCronJob(payload.taskId)) {
    sendSuccessResponse(transactionId, true);
  } else {
    sendErrorResponse(transactionId, `task not found : id = ${payload.taskId}`);
  }
};

const doQueueInfo = (transactionId) => {
  sendSuccessResponse(transactionId, queueInfo());
};

const processIncomingMessage = (event, message) => {
  switch (message.cmd) {
    case commandTypes.RUN_TASK:
      doRunTask(message.transactionId, message.payload);
      break;
    case commandTypes.SUSPEND_TASK: // TODO: change name SUSPEND ? STOP ? please choose !
      doStopTask(message.transactionId, message.payload);
      break;
    case commandTypes.QUEUE_INFO:
      doQueueInfo(message.transactionId);
      break;
    default:
      console.error(`unkown message command : ${message.cmd}`, message);
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
  initQueue(100, taskRegistry.taskExecutorMap);

  // install event handler to process messages comming from UI process
  ipcRenderer.on('from-ui', processIncomingMessage);
};

module.exports = {
  initServer
};
