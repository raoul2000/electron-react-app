const taskRegistry = require('../../lib/task-registry');
const helper = require('./helper');

async function routes(fastify, options, logger) {
  logger.info('registering routes');

  // dummy route
  fastify.get('/', async () => ({ hello: 'world' }));

  // shutdown the server
  fastify.get('/shutdown', async (request, reply) => {
    fastify.close().then(() => {
      logger.info('the server was successfully closed');
      process.exit(0);
    }, (err) => {
      logger.error('an error happened when closing the server', err);
    });
    request.log.warn('### the server is shutting down ###');
    return { result: 'ok' };
  });

  // register one route per task executor
  taskRegistry.taskExecutorMap.forEach((executeTask, taskExecutorId) => {
    logger.info(`creating route for task executor: ${taskExecutorId}`);
    const path = helper.buildWebservicePathFromTaskExecutorId(taskExecutorId);
    fastify.get(path, async (request, reply) => executeTask({
      id: 'some id',
      type: 'dummy-task',
      description: 'some description',
      arg: 'some arg'
    }));
  });
}

module.exports = (logger) => (fastify, options) => routes(fastify, options, logger);
