// @ts-nocheck
/** @typedef {import('pino').Logger} Logger */
const Store = require('electron-store');
const path = require('path');
const configurationSchema = require('./schema');

/**
 * Loads application's configuration object
 *
 * @param {Logger} logger app logger
 * @param {Electron.app} app the elctron app object
 * @return ElectronStore
 */
const load = (configPath, logger, app) => {
  logger.info('loading configuration...');

  const storeOptions = {
    schema: configurationSchema,
    name: app.name
  };
  if (configPath) {
    const conf = path.parse(configPath);
    storeOptions.name = conf.name;
    storeOptions.cwd = conf.dir;
    storeOptions.fileExtension = conf.ext.length !== 0 ? conf.ext.substring(1) : 'json';
    logger.info(`loading configuration from ${configPath}`);
  }
  const store = new Store(storeOptions);
  logger.info(`configuration loaded from ${store.path}`);
  return store;
};

module.exports = {
  load
};
