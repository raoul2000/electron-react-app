/** @typedef {import('pino').Logger} Logger */
/* eslint-disable linebreak-style */
require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const server = require('../server/index');
const desktop = require('./desktop');
const configuration = require('./configuration/index');

app.allowRendererProcessReuse = false;

// logger /////////////////////////////////////////////////////////////

// the default NULL logger (replaced by PINO in Dev mode)
/**
 * @type Logger|any
 */
let logger = {
  trace: () => { },
  debug: () => { },
  info: () => { },
  // eslint-disable-next-line no-console
  warn: console.warn,
  // eslint-disable-next-line no-console
  error: console.error,
  // eslint-disable-next-line no-console
  fatal: console.error
};

// command line //////////////////////////////////////////////////

if (app.commandLine.hasSwitch('version')) {
  // eslint-disable-next-line no-console
  console.log(app.getVersion());
  process.exit(0);
}

// use a logger ?
if (app.commandLine.hasSwitch('app-log')) {
  // eslint-disable-next-line global-require
  logger = require('pino')({
    level: app.commandLine.getSwitchValue('app-log-level') || 'info'
  });
  logger.info('Hi there !!');
  logger.info(`${app.name} ${app.getVersion()}`);
}

const SERVER_MODE = app.commandLine.hasSwitch('server-mode');
logger.info(`server mode = ${SERVER_MODE ? 'true' : 'false'}`);

// environment variables ////////////////////////////////////////////////////

// reading settings from environment
logger.trace(`PARAM = ${process.env.MY_PARAM}`); // myValue
logger.trace(`OTHER PARAM = ${process.env.MY_OTHER_PARAM}`); // undefined

// loading app configuration ////////////////////////////////////////////////

const config = configuration.load(logger, app);
config.set('bar', 'http://www.google.com');
logger.info(`deep.hello = ${config.get('deep.hello')}`);

// start the app ///////////////////////////////////////////////////////////

if (SERVER_MODE) {
  server.start();
} else {
  desktop.initDekstopApp();
}
