async function routes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  fastify.get('/api/dummy-task', async (request, reply) => {
    return { task: 'too dummy for me!' };
  });
}

module.exports = routes;
