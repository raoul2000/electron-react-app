const { default: PQueue } = require('p-queue');
const { CronJob } = require('cron');

// ///////////////////////////////////////////////////////////////////////

const cronJobMap = new Map();
let executorMap = null;
let queue = null;

const ensureQueueInitialized = () => {
  if (queue === null) {
    throw new Error('queue is not initialized');
  }
};

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

/**
 * Find and returns the executor function that matches the jobType passed
 * as argument.
 * If no executor is found, returns NULL
 *
 * @param {string} jobType the job type to find
 * @returns ()=>void | null
 */
const findJobExecutor = (jobType) => executorMap.get(jobType);
/**
 * Add a job to the queue.
 * The job is immediatly added to the queue and may be started right away depending
 * on queue settings (concurrency) and occupation.
 *
 * @param {any} job the job to add
 * @param {() => void} progress the progress function
 */
const addJob = (job, progress) => {
  ensureQueueInitialized();
  validateJob(job);
  const jobExecutor = findJobExecutor(job.type);
  if (!jobExecutor) {
    return Promise.reject(new Error(`failed to add cron job : unkoww job type "${job.type}"`));
  }
  return new Promise((resolve, reject) => {
    queue.add(() => jobExecutor(job, progress)
      .then(resolve)
      .catch(reject));
  });
};
/**
 * Add a cron job to the queue.
 *
 * @param {*} job tje cron job to add
 * @param {string} cron the cron settings for this job
 * @param {*} cb the callback function invoked on job completion
 * @param {*} progress (optional) the progress function
 */
const addCronJob = (job, cron, cb, progress) => {
  ensureQueueInitialized();
  validateJob(job);
  const jobExecutor = findJobExecutor(job.type);
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
 * If the job is running it is not canceled but it will not be executed anymore.
 * If the job is not found, FALSE is returned.
 *
 * @param {string} jobId Id of the job to remove
 * @returns boolean TRUE if the cron job could be removed, FALSE otherwise
 */
const removeCronJob = (jobId) => {
  ensureQueueInitialized();
  if (cronJobMap.has(jobId)) {
    const cronMapEntry = cronJobMap.get(jobId);
    cronMapEntry.cronJob.stop();
    cronJobMap.delete(jobId);
    return true;
  }
  return false;
};
/**
 * Returns job queue info
 * @returns {App.QueueInfo}
 */
const queueInfo = () => {
  ensureQueueInitialized();
  return {
    concurrency: queue.concurrency,
    size: queue.size,
    pending: queue.pending,
    isPaused: queue.isPaused,
    isIdle: queue.size === 0 && queue.pending === 0
  };
};
/**
 * Initialize se job queue.
 * This function must be called once before being able to use the queue.
 * The `executorMap` is a <Job Type, executor function> map defining all job types
 * that can be handled by this queue.
 *
 * @param {number} concurrency job concurrency in the queue
 * @param {Map} executors executor map
 */
const initQueue = (concurrency, executors) => {
  if (queue !== null) {
    throw new Error('queue already initialized');
  }
  if (executors === null) {
    throw new Error('missing argument : executors');
  }
  if (!Number.isInteger(concurrency) || +concurrency < 1) {
    throw new Error('invalid concurrency argument : integer greater than zero expected');
  }
  queue = new PQueue({ concurrency });
  executorMap = executors;
};

module.exports = {
  initQueue,
  addJob,
  addCronJob,
  removeCronJob,
  queueInfo
};
