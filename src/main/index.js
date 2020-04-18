/** @typedef {import('pino').Logger} Logger */
/* eslint-disable linebreak-style */
require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');

app.allowRendererProcessReuse = false;

// command line //////////////////////////////////////////////////

if (app.commandLine.hasSwitch('version')) {
  // eslint-disable-next-line no-console
  console.log(app.getVersion());
  process.exit(0);
}
// initialize logger
const logger = require('./logger').init(app.commandLine, app.getAppPath());
// load configuration
const configuration = require('./configuration/index');

logger.info('Hi there !!');
logger.info(`${app.name} ${app.getVersion()}`);

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
  // eslint-disable-next-line global-require
  require('../server/index').start();
} else {
  // eslint-disable-next-line global-require
  require('./desktop').initDekstopApp();
}
