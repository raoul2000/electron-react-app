// @ts-nocheck
/** @typedef {import('pino').Logger} Logger */
const Store = require('electron-store');
const configurationSchema = require('./configuration/schema');

/**
 * Loads application's configuration object
 *
 * @param {Logger} logger app logger
 * @param {Electron.app} app the elctron app object
 * @return ElectronStore
 */
const load = (logger, app) => {
  logger.info('loading configuration...');
  const store = new Store({
    schema: configurationSchema,
    name: app.name
  });
  logger.info(`configuration loaded from ${store.path}`);
  return store;
};

module.exports = {
  load
};
