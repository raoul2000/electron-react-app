const { default: PQueue } = require('p-queue');
const { CronJob } = require('cron');

const cronJobMap = new Map();
const queue = new PQueue({ concurrency: 1 });
queue
  .on('idle', () => { console.log('queue is idle'); })
  .on('active', () => { console.log('queue is active'); });

const validateJob = (job) => {
  if (!job.id) {
    throw new Error('Job missing property : id');
  }
};

const addJob = (job) => {
  queue.add(() => job);
};

const addCronJob = (job, cron) => {
  validateJob(job);
  if (cronJobMap.has(job.id)) {
    return Promise.reject(new Error(`failed to add cron job : job already added (id = ${job.id})`));
  }
  const cronJob = new CronJob(cron, () => {
    queue.add(() => {
      const rnd = Math.round(Math.random() * 10);
      console.log(`cron job finished (${rnd})`);
      return Promise.resolve(rnd);
    });
  });
  cronJobMap.set(job.id, cronJob);
};

module.exports = {
  addJob,
  addCronJob
};
