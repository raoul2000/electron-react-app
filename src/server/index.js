const path = require('path');
const fastify = require('fastify')({
  logger: true
});

// register p^lugin to serve static files (index.html holding front end view)
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '..', '..', 'public'),
  prefix: '/public/'
});

// register routes
fastify.register(require('./routes'));

const start = () => {
  // Run the server!
  fastify.listen(3000, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
  });
};

module.exports = {
  start
};
