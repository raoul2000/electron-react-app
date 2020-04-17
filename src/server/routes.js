const service = require('../service/main');

async function routes(fastify, options) {
  console.log('routes');

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  service.getAllServiceIds().forEach((serviceId) => {
    service.getService(serviceId).getAllTaskId().forEach((taskId) => {
      const path = `/${serviceId}/${taskId}`;
      const executeTask = service.getService(serviceId).getTask(taskId);
      console.log(`creating route${path}`);
      fastify.get(path, async (request, reply) => executeTask(
        {
          id: 'some id',
          type: 'dummy-task',
          description: 'some description',
          arg: 'some arg'
        }
      ));
    });
  });
}

module.exports = routes;
