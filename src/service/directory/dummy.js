/* eslint-disable global-require */
/**
 * @type App.ServiceDescriptor
 */
module.exports = {
  id: 'dummy-service',
  tasks: [
    require('../../lib/dummy-task'),
    require('../../lib/dumb-task')
  ]
};
