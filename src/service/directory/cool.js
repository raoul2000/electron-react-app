/* eslint-disable global-require */
/**
 * @type App.ServiceDescriptor
 */
module.exports = {
  id: 'cool-service',
  tasks: [
    require('../../lib/dumb-task')
  ]
};
