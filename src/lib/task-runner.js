/**
 * This module is in charge providing required initialization function to establish
 * a mono-directional channel between the UI and the WORKER renderer processes. This
 * channel is going through the Main process in charge of routing task execution request
 * to the worker and task result back to the UI.
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcMain, ipcRenderer } = require('electron');
const { runDummyTask } = require('./dummy-task');

let taskCount = 0;
/**
 * @type Map<string,any> hold task that have been submitted for execution
 * and did not yet returned any resut (pending tasks)
 */
const tasks = new Map();
/**
 * Creates a  unique transaction ID
 * @returns string the transaction id
 */
const createTransactionId = () => {
  const id = `task-${taskCount}`;
  taskCount += 1;
  return id;
};

const taskRunner = {
  /**
   * @param {App.Task} task the task to submit
   */
  submitTask: (task) => {
    /**
     * @type App.TaskRequest
     */
    const taskRequest = {
      transactionId: createTransactionId(),
      task
    };
    return new Promise((resolve, reject) => {
      tasks.set(taskRequest.transactionId, { resolve, reject });
      ipcRenderer.send('to-worker', taskRequest);
    });
  }
};
/**
 * Invoked from the UI renderer process, this function provides the interface
 * to submit a task and await from its result.
 */
const initClient = () => {
  // expose the task submition function to the renderer process via
  // global object 'window'
  // @ts-ignore
  window.taskRunner = taskRunner;

  /**
   * Handle response from worker
   * @param {Electron.IpcRendererEvent} event Electron Event
   * @param {App.TaskResponse} taskResponse the task response
   */
  const handleResponse = (event, taskResponse) => {
    const futureResult = tasks.get(taskResponse.transactionId);
    if (futureResult) {
      tasks.delete(taskResponse.transactionId);
      // property 'error' identifies a task exeuction failure
      if (Object.prototype.hasOwnProperty.call(taskResponse, 'error')) {
        futureResult.reject(taskResponse.error);
      } else if (Object.prototype.hasOwnProperty.call(taskResponse, 'result')) {
        futureResult.resolve(taskResponse.result);
      } else {
        // eslint-disable-next-line no-console
        console.error(`task reponse has neither 'result' nor 'error' property set (id=${taskResponse.transactionId})`);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`task reponse has no matching task (id=${taskResponse.transactionId})`);
    }
  };
  // install event handle to receive messages from worker
  ipcRenderer.on('from-worker', handleResponse);
};
/**
 * Initialize the server part of the task runner.
 * Setup an event handler on the `from-ui`channel. This funcntion must be invoked
 * in the worker render process.
 */
const initServer = () => {
  const runTask = (task) => new Promise((resolve, reject) => {
    runDummyTask(task)
      .then(resolve)
      .catch(reject);
  });

  /**
   * Sends a successful Task response to the UI renderer process.
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
   * Sends a failuer Task response to the UI renderer process.
   *
   * @param {App.TaskRequest} taskRequest the task request received from UI
   */
  const sendErrorResponse = (taskRequest) => (error) => {
    /**
     * @type App.TaskResponse
     */
    const taskResponse = {
      transactionId: taskRequest.transactionId,
      error
    };
    ipcRenderer.send('to-ui', taskResponse);
  };

  ipcRenderer.on('from-ui', (event, taskRequest) => {
    runTask(taskRequest.task)
      .then(sendSuccessResponse(taskRequest))
      .catch(sendErrorResponse(taskRequest));
  });
};
/**
 * Invoked from the `main`process, this function installs appropriate
 * IPC event handler to route messages between the UI and the Worker renderer processes.
 *
 * @param {Electron.BrowserWindow} mainWindow the UI browser window
 * @param {Electron.BrowserWindow} workerWindow the WORKER browser window
 */
const initBridge = (mainWindow, workerWindow) => {
  const sendWindowMessage = (targetWindow, message, payload) => {
    if (typeof targetWindow === 'undefined') {
      // eslint-disable-next-line no-console
      console.error('Target window does not exist');
      return;
    }
    targetWindow.webContents.send(message, payload);
  };

  ipcMain.on('to-worker', (event, arg) => {
    sendWindowMessage(workerWindow, 'from-ui', arg);
  });
  ipcMain.on('to-ui', (event, arg) => {
    sendWindowMessage(mainWindow, 'from-worker', arg);
  });
};

module.exports = {
  initClient,
  initServer,
  initBridge
};
