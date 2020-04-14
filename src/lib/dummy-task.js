const axios = require('axios').default;

const TASK_TYPE = 'dummy';
/**
 * Execute a task
 * @param {App.Task} task the task to execute
 * @returns Promise<any>
 */
const execute = (task) => {
  console.log('running', task);
  return axios.get('https://randomuser.me/api/')
    .then((response) => response.data);
};

module.exports = {
  TASK_TYPE,
  execute
};
