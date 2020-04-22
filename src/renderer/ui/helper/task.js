import axios from 'axios';

/**
 * Execute a task and returns the promise of a result
 * @param {App.Task} task the task to run
 * @returns Promise<any> the result
 */
const submitTask = (task) => {
  console.log('submiting task', task);
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  if (exWindow.taskChannel) {
    // running in electron : use IPC channel to submit task to the worker
    return exWindow.taskChannel.submitTask(task);
  }

  // not running in electron but in the browser (server mode). In this case the only
  // option is to send an HTTP request to the server
  return axios.post('/api/task', task)
    .then((response) => response.data);
};

export const readRssTask = (url) => submitTask({
  id: 'my-task-rss',
  type: 'read-rss',
  arg: {
    url
  }
});

export default submitTask;
