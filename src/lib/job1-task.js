
const TASK_ID = 'job1';

const execute = (arg, progress) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const rnd = Math.round(Math.random() * 10);
    for (let index = 0; index < 100000; index += 1) {
      if (progress) {
        progress(`job1 ${rnd} - ${index}`);
      }
    }
    console.log(`job1 finished with resut ${rnd}`);
    resolve(rnd);
  }, 500);
});

/**
 * @type App.TaskExecutor
 */
module.exports = {
  id: TASK_ID,
  execute
};
