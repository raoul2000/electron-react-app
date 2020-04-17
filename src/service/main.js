const dummyService = require('./directory/dummy');

/**
 * @type Map<string, App.ServiceDescriptor>
 */
const serviceMap = new Map();
/**
 * Register a service.
 * @param {App.ServiceDescriptor} serviceDescriptor the service descritor to register
 */
const registerService = (serviceDescriptor) => {
  const serviceId = serviceDescriptor.id;
  console.log(`registering servie : ${serviceId}`);
  if (serviceMap.has(serviceId)) {
    throw new Error(`service registration failed : duplicate service id found '${serviceId}'`);
  }
  serviceMap.set(serviceId, serviceDescriptor);
};

let initDone = false;
/**
 * Initialize service layer.
 * This function registers all core tasks
 */
const init = () => {
  if (initDone) {
    console.warn('service Init already done');
  } else {
    console.log('init service');
    registerService(dummyService);

    initDone = true;
  }
};

// exports ///////////////////////////////////////////////////////////////////////////////////

module.exports = {
  init
};
