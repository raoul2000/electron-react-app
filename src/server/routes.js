const taskRegistry = require('../lib/task-registry');
const helper = require('./helper');

async function routes(fastify, options) {
  console.log('routes');
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  taskRegistry.taskExecutorMap.forEach((executeTask, taskExecutorId) => {
    console.log(`creating route for task executor ${taskExecutorId}`);
    const path = helper.buildWebservicePathFromTaskExecutorId(taskExecutorId);
    fastify.get(path, async (request, reply) => {
      return executeTask({
        id: 'some id',
        type: 'dummy-task',
        description: 'some description',
        arg: 'some arg'
      });
    });
  });
}

module.exports = routes;
