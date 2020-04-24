const Parser = require('rss-parser');

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', 'media:credit', { keepArray: true }]
    ]
  }
});

const TASK_ID = 'read-rss';
/**
 * Execute a task
 * @param {App.Task} task the task to execute
 * @returns Promise<any>
 */
const execute = (task) => parser.parseURL(task.arg.url)
  .then((result) => {
    console.log(result);
    return result;
  })
  .catch((error) => {
    console.error(error);
    return Promise.reject(error);
  });

/**
 * @type App.TaskExecutor
 */
module.exports = {
  id: TASK_ID,
  execute
};
