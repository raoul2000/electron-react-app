const { default: PQueue } = require('p-queue');
const { CronJob } = require('cron');

function longJob(arg, cb, progress) {
  console.log('running long job', arg);
  let result = 0;
  setTimeout(() => {
    for (let index = 0; index < 100; index += 1) {
      progress(index);
      for (let index2 = 0; index2 < 100000; index2 += 1) {
        result += index + index2;
      }
    }
    cb(null, result);
  }, Math.round(Math.random() * 10) * 200);
}

const job1 = (arg, progress) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const rnd = Math.round(Math.random() * 10);
    for (let index = 0; index < 100000; index += 1) {
      progress(`job1 ${rnd} - ${index}`);
    }
    console.log(`job1 finished with resut ${rnd}`);
    resolve(rnd);
  }, 500);
});

const job2 = (arg, progress) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const rnd = Math.round(Math.random() * 10);
    console.log(`job2 finished with resut ${rnd}`);
    resolve(rnd);
  }, 1000);
});

const cronJobMap = new Map();
const queue = new PQueue({ concurrency: 1 });
queue
  .on('idle', () => { console.log('queue is idle'); })
  .on('active', () => { console.log('queue is active'); });

const validateJob = (job) => {
  if (typeof job.id === 'undefined') {
    throw new Error('Job missing property : id');
  }
  if (typeof job.type === 'undefined') {
    throw new Error('Job missing property : type');
  }
  if (typeof job.arg === 'undefined') {
    throw new Error('Job missing property : arg');
  }
};

const findJobExecutor = (jobType) => {
  switch (jobType) {
    case 'job1':
      return job1;
    case 'job2':
      return job2;
    default:
      return null;
  }
};
/**
 * Add a job to the queue.
 *
 * @param {any} job the job to add
 * @param {() => void} progress the progress function
 */
const addJob = (job, progress) => {
  validateJob(job);
  const jobExecutor = findJobExecutor(job);
  if (!jobExecutor) {
    return Promise.reject(new Error(`failed to add cron job : unkoww job type "${job.type}"`));
  }
  return new Promise((resolve, reject) => {
    queue.add(() => job1(job, progress)
      .then(resolve)
      .catch(reject));
  });
};

const addCronJob = (job, cron, cb, progress) => {
  validateJob(job);
  const jobExecutor = findJobExecutor(job);
  if (!jobExecutor) {
    cb(`failed to add cron job : unkoww job type "${job.type}"`);
    return false;
  }
  if (cronJobMap.has(job.id)) {
    cb(`failed to add cron job : job already added (id = ${job.id})`);
    return false;
  }
  const cronMapEntry = {
    queued: false,
    cronJob: null
  };
  const onTick = () => {
    // add job to the queue
    if (cronMapEntry.queued) {
      console.log(
        '%c request to add cron job to queue ignored : job already in queue',
        'background:orange; color:black'
      );
      return;
    }
    cronMapEntry.queued = true;
    queue.add(
      () => jobExecutor(job, progress)
        .then((result) => {
          cronMapEntry.queued = false;
          cb(null, result);
        })
        .catch((error) => {
          cronMapEntry.queued = false;
          cb(error);
        }),
      { priority: 10 }
    );
  };

  cronMapEntry.cronJob = new CronJob(cron, onTick);
  cronJobMap.set(job.id, cronMapEntry);
  cronMapEntry.cronJob.start();
  return true;
};
/**
 * Remove a job from the cron.
 * If the job is running it is not canceled but it will not be schedues anymore.
 * @param {string} jobId Id of the job to remove
 */
const removeCronJob = (jobId) => {
  if (cronJobMap.has(jobId)) {
    const jobToRemove = cronJobMap.get(jobId);
    jobToRemove.stop();
    cronJobMap.delete(jobId);
    return true;
  }
  return false;
};

const queueInfo = () => ({
  concurrency: queue.concurrency,
  size: queue.size,
  pending: queue.pending,
  isPaused: queue.isPaused,
  isIdle: queue.size === 0 && queue.pending === 0
});

module.exports = {
  addJob,
  addCronJob,
  removeCronJob,
  queueInfo
};
