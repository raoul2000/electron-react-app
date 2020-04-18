/* eslint-disable global-require */
const path = require('path');
const fastify = require('fastify')({
  logger: true,
  ignoreTrailingSlash: true
});

const start = (logger) => {
  // register plugin to serve static files (index.html holding front end view)
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '..', '..', '..', 'public'),
    prefix: '/app/'
  });

  // register routes
  fastify.register(require('./routes')(logger));

  // Run the server!
  logger.info('starting server');
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
