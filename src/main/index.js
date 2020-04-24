/** @typedef {import('pino').Logger} Logger */
/* eslint-disable linebreak-style */
require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const configuration = require('./configuration');

// only on running instance of the application allowed
// TODO: check if this feature works as expected
app.requestSingleInstanceLock();
app.on('second-instance', (event, argv, cwd) => {
  console.log('only one running instance of the application is allowed');
  app.quit();
  process.exit(-1);
});

app.allowRendererProcessReuse = false;

// command line //////////////////////////////////////////////////

if (app.commandLine.hasSwitch('version')) {
  // eslint-disable-next-line no-console
  console.log(app.getVersion());
  process.exit(0);
}
// initialize logger
/**
 * @type Logger
 */
const logger = require('./logger').init(app.commandLine, app.getAppPath());

logger.info('Hi there !!');
logger.info(`${app.name} ${app.getVersion()}`);

// environment variables ////////////////////////////////////////////////////

// reading settings from environment
logger.trace(`PARAM = ${process.env.MY_PARAM}`); // myValue
logger.trace(`OTHER PARAM = ${process.env.MY_OTHER_PARAM}`); // undefined

// loading app configuration ////////////////////////////////////////////////

const config = configuration.load(app.commandLine.getSwitchValue('app-config-path'), logger, app);

const SERVER_MODE = app.commandLine.hasSwitch('server-mode') || config.get('server.enable');
logger.info(`server mode = ${SERVER_MODE ? 'true' : 'false'}`);

// start the app ///////////////////////////////////////////////////////////

if (SERVER_MODE) {
  const SERVER_PORT = app.commandLine.hasSwitch('server-port') || config.get('server.port');
  logger.info(`server port = ${SERVER_PORT}`);
  // eslint-disable-next-line global-require
  require('./server').start(logger, SERVER_PORT);
} else {
  // eslint-disable-next-line global-require
  require('./desktop').initDekstopApp();
}
