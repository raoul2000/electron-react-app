// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcMain, ipcRenderer } = require('electron');

let taskCount = 0;
const tasks = new Map();

const createTaskMessageId = () => {
  const id = `task-${taskCount}`;
  taskCount += 1;
  return id;
};

const taskRunner = {
  submitTask: (task) => {
    console.log('submit task');
    const taskRequest = {
      id: createTaskMessageId(),
      task
    };
    const futureResult = new Promise((resolve, reject) => {
      tasks.set(taskRequest.id, { resolve, reject });
      ipcRenderer.send('to-worker', taskRequest);
    });
    taskCount += 1;
    return futureResult;
  }
};

const initClient = () => {
  // expose the task submition function to the renderer process via
  // global object 'window'
  window.taskRunner = taskRunner;

  // handle response from worker
  ipcRenderer.on('from-worker', (event, taskResponse) => {
    console.log('taskRunner : receive result');
    const futureResult = tasks.get(taskResponse.id);
    if (futureResult) {
      tasks.delete(taskResponse.id);
      if (taskResponse.error) {
        futureResult.reject(taskResponse.error);
      } else {
        futureResult.resolve(taskResponse.result);
      }
    } else {
      console.error(`task reponse has no matching task (id=${taskResponse.id})`);
    }
  });
};

const initServer = () => {
  const runTask = (task) => new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('runTask...', task);
      resolve('result ok ');
      // reject('error!')
    }, 1000);
  });

  const sendSuccessResponse = (taskRequest) => (result) => {
    console.log('sendSuccessResponse');
    ipcRenderer.send('to-ui', {
      id: taskRequest.id,
      result
    });
  };

  const sendErrorResponse = (taskRequest) => (error) => {
    console.log('sendErrorResponse');
    ipcRenderer.send('to-ui', {
      id: taskRequest.id,
      error
    });
  };

  ipcRenderer.on('from-ui', (event, taskRequest) => {
    console.log('taskRequest:', taskRequest);
    runTask(taskRequest)
      .then(sendSuccessResponse(taskRequest))
      .catch(sendErrorResponse(taskRequest));
  });
};

const initBridge = (mainWindow, workerWindow) => {
  const sendWindowMessage = (targetWindow, message, payload) => {
    if (typeof targetWindow === 'undefined') {
      console.error('Target window does not exist');
      return;
    }
    targetWindow.webContents.send(message, payload);
  };

  ipcMain.on('to-worker', (event, arg) => {
    console.log('to-worker', arg);
    sendWindowMessage(workerWindow, 'from-ui', arg);
  });
  ipcMain.on('to-ui', (event, arg) => {
    console.log('to-ui', arg);
    sendWindowMessage(mainWindow, 'from-worker', arg);
  });
};

module.exports = {
  initClient,
  initServer,
  initBridge
};
