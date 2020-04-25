/**
 * This module is in charge providing required initialization function to establish
 * a mono-directional channel between the UI and the WORKER renderer processes. This
 * channel is going through the Main process in charge of routing task execution request
 * to the worker and task result back to the UI.
 */
const { initClient } = require('./channel-client');
const { initServer } = require('./channel-server');
const { initBridge } = require('./channel-bridge');


// exports ////////////////////////////////////////////////////////////

module.exports = {
  initClient,
  initServer,
  initBridge
};
