/**
 * Handle the erver part of the channel.
 * The Worker renderer process receives taks, execute them and returns the result.
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const { throttle } = require('throttle-debounce');
const { initQueue, addCronJob, addJob, queueInfo } = require('./queue');
const taskRegistry = require('../task/task-registry');

const sendResponse = (response) => ipcRenderer.send('to-ui', response);
const sendErrorResponse = (transactionId, error) => sendResponse({ transactionId, error });
const sendSuccessResponse = (transactionId, result) => sendResponse({ transactionId, result });
const sendProgressResponse = (transactionId, progress) => sendResponse({ transactionId, progress });
const buildProgressCallback = (transactionId) => throttle(300, (progress) => sendProgressResponse(transactionId, progress));

const doRunTask = (transactionId, task) => {
  let progressCb = null;
  if (task.progress === true) {
    progressCb = buildProgressCallback(transactionId);
  }

  if (task.cron) {
    addCronJob(task, task.cron, (err, result) => {
      if (err) {
        console.error(err);
        sendErrorResponse(transactionId, err);
      } else {
        sendSuccessResponse(transactionId, result);
      }
    }, progressCb);
  } else {
    addJob(task, progressCb)
      .then((result) => { sendSuccessResponse(transactionId, result); })
      .catch((error) => { sendErrorResponse(transactionId, error); });
  }
};

const doQueueInfo = (transactionId) => {
  sendSuccessResponse(transactionId, queueInfo());
};

const processIncomingMessage = (event, message) => {
  switch (message.action) {
    case 'run-task':
      doRunTask(message.transactionId, message.payload);
      break;
    case 'queue-info':
      doQueueInfo(message.transactionId);
      break;
    default:
      console.error(`unkown message action : ${message.action}`, message);
      break;
  }
};

/**
 * Initialize the server part of the task runner.
 * Setup an event handler on the `from-ui`channel. This funcntion must be invoked
 * in the worker render process.
 */
const initServer = () => {

  initQueue(100, taskRegistry.taskExecutorMap);

  // install event handler to process messages comming from UI process
  ipcRenderer.on('from-ui', processIncomingMessage);


  // eslint-disable-next-line global-require

  throttledProgess = throttle(100, (progress) => {
    console.log('THROTTLE PROGRESS', progress);
  });

  ipcRenderer.on('from-ui', (event, taskRequest) => {
    // eslint-disable-next-line global-require
    const j1 = {
      id: 1,
      type: 'job1',
      arg: 22,
      cron_zz: '*/2 * * * * *'
    };
    if (j1.cron) {
      addCronJob(j1, j1.cron, (err, result) => {
        if (err) {
          console.error(err);
          // sendErrorResponse();
        } else {
          console.log('RESULT', result);
          // sendSuccessResponse()
        }
      }, throttledProgess);
    } else {
      addJob(j1, throttledProgess)
        .then((result) => { console.log('RESULT (2)', result); })
        .catch((error) => { console.error(error); });
    }
  });
};

module.exports = {
  initServer
};
