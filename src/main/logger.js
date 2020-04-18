/* eslint-disable no-console */
/** @typedef {import('pino').Logger} Logger */
const fs = require('fs');
const path = require('path');

const CL_SWITCH_ENABLE_APP_LOG = 'app-log';
const CL_SWITCH_APP_LOG_LEVEL = 'app-log-level';
const CL_SWITCH_APP_LOG_CONF_PATH = 'app-log-conf';
const DEFAULT_LOG_LEVEL = 'info';
/**
 * Initialize the application logger from the command line arguments.
 *
 * @param {Electron.CommandLine} commandLine
 * @param {string} currentDir the current working directory
 * @returns Logger
 */
const init = (commandLine, currentDir) => {
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
  // use a logger ?
  if (commandLine.hasSwitch(CL_SWITCH_ENABLE_APP_LOG)) {
    // eslint-disable-next-line global-require
    const pino = require('pino');
    if (commandLine.hasSwitch(CL_SWITCH_APP_LOG_CONF_PATH)) {
      const logConfPath = commandLine.getSwitchValue(CL_SWITCH_APP_LOG_CONF_PATH);
      if (!logConfPath) {
        console.error(`command line error: the switch "--${CL_SWITCH_APP_LOG_CONF_PATH}" is missing the path of the log configuration file`);
        process.exit(-1);
      } else {
        const logConfAbsolutePath = path.resolve(currentDir, logConfPath);
        if (fs.existsSync(logConfAbsolutePath) === false) {
          console.error(`command line error: log configuration file not found (${logConfAbsolutePath})`);
          process.exit(-1);
        } else {
          try {
            logger = pino(JSON.parse(fs.readFileSync(logConfAbsolutePath, 'utf8')));
          } catch (error) {
            console.error(`something went wrong when initializing the logger using the configuration file '${logConfAbsolutePath}'`);
            console.error(error);
            process.exit(-1);
          }
        }
      }
    } else {
      // use default log configuration settings
      try {
        logger = pino({
          level: commandLine.getSwitchValue(CL_SWITCH_APP_LOG_LEVEL) || DEFAULT_LOG_LEVEL
        });
      } catch (error) {
        console.error('log initialization failed : check command line arguments');
        console.error(error);
        process.exit(-1);
      }
    }
  }
  return logger;
};

module.exports = {
  init
};
