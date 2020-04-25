/* eslint-disable consistent-return */
const taskRegistry = require('../../lib/task-registry');

async function routes(fastify, options, logger) {
  logger.info('registering routes');

  // dummy route /////////////////////////////////////////

  fastify.get('/', async () => ({ hello: 'world' }));

  // shutdown the server /////////////////////////////////

  fastify.post('/shutdown', async (request, reply) => {
    if (request.body.secret && process.env.SHUTDOWN_SECRET && request.body.secret === process.env.SHUTDOWN_SECRET) {
      fastify.close().then(() => {
        logger.info('the server was successfully closed');
        process.exit(0);
      }, (err) => {
        logger.error('an error happened when closing the server', err);
      });
      request.log.warn('### the server is shutting down ###');
      return { result: 'ok' };
    }
    reply
      .code(500)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({
        error: 'invalid request'
      });
  });

  // route to execute tasks (POST) //////////////////////
  // the body of the request is the task to execute

  fastify.post('/api/task', async (request, reply) => {
    const task = request.body;
    const executeTask = taskRegistry.findTaskExecutor(task);
    if (executeTask) {
      return executeTask(task);
    }
    reply
      .code(500)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({
        error: 'no executor found for this task',
        task
      });
  });
}

module.exports = (logger) => (fastify, options) => routes(fastify, options, logger);
