
const incrementor = (arg, cb) => {
  if (Number.isNaN(arg.value)) {
    cb('missing or invalid type property : value ');
  } else {
    cb(null, 1 + arg.value);
  }
};

function longJob(arg, cb) {
  console.log('running long job', arg);
  // this.progressTask('long', 30, 100, 'doing stuff');
  const self = this;
  let result = 0;
  setTimeout(() => {
    for (let index = 0; index < 100; index += 1) {
      self.progressBatch(index, 100, 'uploading');
      for (let index2 = 0; index2 < 100000; index2 += 1) {
        result += index + index2;
      }
    }
    cb(null, result);
  }, Math.round(Math.random() * 10) * 200);
}

// ////////////////////////////////////////////////////////////////////////////////////

function jobExecutor(arg, cb) {
  debugger;
  this.progressTask('my-task', 30, 100, 'doing stuff');
  if (!arg.type) {
    cb('missing job type property');
  } else {
    console.log('running job ...');
    // finds an executor for job type arg.type
    // call the executor
    if (arg.type === 'inc') {
      incrementor(arg, cb);
    } if (arg.type === 'long') {
      longJob(arg, cb);
    } else {
      cb(`unknown job type : ${arg.type}`);
    }
  }
}

const queues = new Map();

let queue = null;

const initQueue = () => {
  if (queue === null) {
    // eslint-disable-next-line global-require
    const Queue = require('better-queue');
    queue = new Queue(jobExecutor, { concurrent: 10 });
  }
  return queue;
};

const getQueue = (taskType) => {
  // eslint-disable-next-line global-require
  const Queue = require('better-queue');

  if (!queues.has(taskType)) {
    switch (taskType) {
      case 'long':
        queues.set(taskType, new Queue(longJob, { concurrent: 10 }));
        break;
      case 'inc':
        queues.set(taskType, new Queue(incrementor, { concurrent: 10 }));
        break;
      default:
        throw new Error(`no executor found for taskType "${taskType}"`);
    }
  }
  return queues.get(taskType);
};

const addJob = (taskType, arg) => getQueue(taskType).push(arg);

// exports ////////////////////////////////////////////////////////////

module.exports = {
  initQueue,
  getQueue,
  addJob
};
