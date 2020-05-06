
const incrementor = (arg, cb) => {
  if (Number.isNaN(arg.value)) {
    cb('missing or invalid type property : value ');
  } else {
    cb(null, 1 + arg.value);
  }
};

const longJob = (arg, cb) => {
  let result = 0;
  for (let index = 0; index < 10000; index += 1) {
    for (let index2 = 0; index2 < 10000; index2 += 1) {
      result += index + index2;
    }
  }
  cb(null, result);
};

// ////////////////////////////////////////////////////////////////////////////////////

function jobExecutor(arg, cb) {
  // this.progressBatch(100, 1000, 'uploading');
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

let queue = null;

const initQueue = () => {
  if (queue === null) {
    // eslint-disable-next-line global-require
    const Queue = require('better-queue');
    queue = new Queue(jobExecutor, { concurrent: 10 });
  }
  return queue;
};

// exports ////////////////////////////////////////////////////////////

module.exports = {
  initQueue
};
