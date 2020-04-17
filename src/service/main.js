/* eslint-disable global-require */
/** @typedef {import('pino').Logger} Logger */
/**
 * @type Map<string, Map<string, App.TaskExecutorFunction>>
 */
const serviceMap = new Map();
/**
 * Register a service.
 * @param {App.ServiceDescriptor} serviceDescriptor the service descritor to register
 * @param {Logger} logger the logger
 */
const registerService = (serviceDescriptor, logger) => {
  const serviceId = serviceDescriptor.id;
  logger.info(`registering servie : ${serviceId}`);
  // check for duplicate service id
  if (serviceMap.has(serviceId)) {
    throw new Error(`service registration failed : duplicate service id found '${serviceId}'`);
  }
  // build the task executor map for this service
  /**
   * @type Map<string, App.TaskExecutorFunction>
   */
  const taskExecutorMap = new Map();
  serviceDescriptor.tasks.forEach((item) => {
    if (taskExecutorMap.has(item.id)) {
      throw new Error(`service registration failed : duplicate task executor id found '${item.id}' for service '${serviceId}'`);
    }
    taskExecutorMap.set(item.id, item.execute);
  });

  // complete the service map entry for this service
  serviceMap.set(serviceId, taskExecutorMap);
};
/**
 * Returns the list of ids for all registered services.
 * @return Array<string> an list of service ids
 */
const getAllServiceIds = () => Array.from(serviceMap.keys());
/**
 * Return a service descriptor given its id or NULL if no service
 * is registered for this id.
 *
 * @param {string} id service Id
 * @returns any
 */
const getService = (id) => {
  if (serviceMap.has(id) === false) {
    throw new Error(`service '${id} not found'`);
  }
  return {
    getTask: (taskId) => {
      const taskExecutorMap = serviceMap.get(id);
      if (taskExecutorMap.has(taskId) === false) {
        throw new Error(`task '${taskId}' not found in service '${id}'`);
      }
      return taskExecutorMap.get(taskId);
    },
    getAllTaskId: () => Array.from(serviceMap.get(id).keys())
  };
};

let initDone = false;
/**
 * Initialize service layer.
 * This function registers all core tasks
 * @param {Logger} logger the logger
 */
const init = (logger) => {
  if (initDone) {
    logger.warn('services already initialized: skip');
  } else {
    logger.info('initializing services ...'); // service registration ///////////////

    registerService(require('./directory/dummy'), logger);

    initDone = true;
    logger.info('services initialization : done'); // end - service registration ///////////////
  }
};

// exports ///////////////////////////////////////////////////////////////////////////////////

module.exports = {
  init,
  getAllServiceIds,
  getService
};
