/**
 * Handle the UI renderer process part of the channel : the UI process is able to
 * send (submit) tasks to the worker process (also renderer process). When the task is completed
 * the result is recevied by the UI process
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const uniqid = require('uniqid');
/**
 * @type Map<string,any> hold task that have been submitted for execution
 * and did not yet returned any resut (pending tasks)
 */
const submittedTasks = new Map();
const subscribedTasks = new Map();
/**
 * Creates a  unique transaction ID
 * @returns string the transaction id
 */
const createTransactionId = () => uniqid('transac-');

const taskChannel = {
  /**
   * Submit a task to the worker process and returns the promise of a result.
   * The task will be executed only once. To run it more than once (periodically)
   * use `subscribeTask`.
   *
   * @param {App.Task} task the task to submit
   * @returns Promise<any>
   */
  submitTask: (task) => {
    /**
     * @type App.TaskRequest
     */
    const taskRequest = {
      transactionId: createTransactionId(),
      task
    };
    if (submittedTasks.has(taskRequest.transactionId)) {
      return Promise.reject(new Error(`task already submitted for execution (transaction id = ${taskRequest.transactionId})`));
    }
    return new Promise((resolve, reject) => {
      // save the resvoler and rejecter function for being use later
      // when the result or error will be returned from the worker
      submittedTasks.set(taskRequest.transactionId, { resolve, reject });
      // actually send the task to the worker
      ipcRenderer.send('to-worker', taskRequest);
    });
  },
  /**
   * Submit a task to the worker process and subscribe to the future results
   * returned by this task.
   *
   * @param {App.Task} task the task to submit
   * @param {App.TaskSubscriptionCallback} notifyCb the function called on task notification
   * @returns void
   */
  subscribeTask: (task, notifyCb) => {
    /**
     * @type App.TaskRequest
     */
    const taskRequest = {
      transactionId: createTransactionId(),
      task,
      subscribe: true
    };
    if (subscribedTasks.has(task.id)) {
      notifyCb({ message: `task already subscribed to (id = ${task.id})` });
    } else {
      subscribedTasks.set(task.id, notifyCb);
      ipcRenderer.send('to-worker', taskRequest);
    }
  },
  unsubscribeTask: (task) => {
    if (subscribedTasks.has(task.id)) {
      /**
       * @type App.TaskRequest
       */
      const taskRequest = {
        transactionId: createTransactionId(),
        task,
        subscribe: false
      };
      subscribedTasks.delete(task.id);
      ipcRenderer.send('to-worker', taskRequest);
    } else {
      console.warn(`trying to unsubscribe to a task that is not found in the subscribed tasks list (task Id = ${task.id})`);
    }
  }
};

/**
 * Invoked from the UI renderer process, this function provides the interface
 * to submit a task and await from its result.
 */
const initClient = () => {
  // expose the task submition function to the renderer process via
  // global object 'window'
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  exWindow.taskChannel = taskChannel;

  /**
   * Handle response from worker related to a submitted task.
   *
   * @param {Electron.IpcRendererEvent} event Electron Event
   * @param {App.TaskResponse} taskResponse the task response
   */
  const handleSubmittedTaskResponse = (event, taskResponse) => {
    const submittedTask = submittedTasks.get(taskResponse.transactionId);

    if (submittedTask) {
      submittedTasks.delete(taskResponse.transactionId);
      // property 'error' identifies a task exeuction failure
      if (Object.prototype.hasOwnProperty.call(taskResponse, 'error')) {
        submittedTask.reject(taskResponse.error);
      } else if (Object.prototype.hasOwnProperty.call(taskResponse, 'result')) {
        submittedTask.resolve(taskResponse.result);
      } else {
        // eslint-disable-next-line no-console
        console.error(`task reponse has neither 'result' nor 'error' property set (id=${taskResponse.transactionId})`);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`task reponse has no matching task (id=${taskResponse.transactionId})`);
    }
  };
  /**
   * Handle response from worker for a taks subscription
   *
   * @param {Electron.IpcRendererEvent} event Electron Event
   * @param {App.TaskResponse} taskResponse the task response
   */
  const handlSubscribedTaskResponse = (event, taskResponse) => {
    const notifyCb = subscribedTasks.get(taskResponse.taskId);
    if (notifyCb) {
      if (Object.prototype.hasOwnProperty.call(taskResponse, 'error')) {
        notifyCb(taskResponse.error);
      } else if (Object.prototype.hasOwnProperty.call(taskResponse, 'result')) {
        notifyCb(null, taskResponse.result);
      } else {
        // eslint-disable-next-line no-console
        console.error(`task reponse has neither 'result' nor 'error' property set (id=${taskResponse.taskId})`);
      }
    } else {
      // TODO: maybe inform worker to discard subscription for this task as there is no one
      // listening to its results
      // eslint-disable-next-line no-console
      console.error(`notification received for a task that was not found(id = ${taskResponse.taskId}). Canceling ...`);
/*       ipcRenderer.send('to-worker', {
        transactionId: createTransactionId(),
        task: {
          id: taskResponse.taskId
        },
        subscribe: false
      }); */
    }
  };

  // install event handler to receive messages from worker
  ipcRenderer.on('from-worker', (event, taskResponse) => {
    if (taskResponse.subscribe === true) {
      handlSubscribedTaskResponse(event, taskResponse);
    } else {
      handleSubmittedTaskResponse(event, taskResponse);
    }
  });
};

module.exports = {
  initClient
};
