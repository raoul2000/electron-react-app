/* eslint-disable linebreak-style */
// Modules to control application life and create native browser window
require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

app.allowRendererProcessReuse = false;
// logger /////////////////////////////////////////////////////////////

// the default NULL logger (replace by PINO in Dev mode)
let logger = {
  trace: () => { },
  debug: () => { },
  info: () => { },
  // eslint-disable-next-line no-console
  warn: console.warn,
  // eslint-disable-next-line no-console
  error: console.error,
  // eslint-disable-next-line no-console
  fatal: console.fatal
};

// command line //////////////////////////////////////////////////

if (app.commandLine.hasSwitch('version')) {
  // eslint-disable-next-line no-console
  console.log(app.getVersion());
  process.exit(0);
}

// Detect if Electron is running in development mode
const DEV_MODE = app.commandLine.hasSwitch('dev');
if (DEV_MODE) {
  // eslint-disable-next-line global-require
  logger = require('pino')({
    prettyPrint: {
      colorize: true,
      translateTime: true
    },
    level: app.commandLine.getSwitchValue('log-level') || 'info'
  });
  logger.info('Hi there !!');
  logger.info(`${app.name} ${app.getVersion()}`);
}

// environment variables /////////////////////////////////////////

// reading settings from environment
logger.trace(`PARAM = ${process.env.MY_PARAM}`); // myValue
logger.trace(`OTHER PARAM = ${process.env.MY_OTHER_PARAM}`); // undefined

// starting ... /////////////////////////////////////////////////

// handle to renderer windows
let mainWindow; // the UI main window
let workerWindow; // the worker window

/**
 * Create the UI window
 */
function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: DEV_MODE,
      preload: path.join(__dirname, '/../ui/preload.js')
    }
  });

  // and load the index.html of the app.
  const startUrl = DEV_MODE === false
    ? url.format({
      pathname: path.join(__dirname, '/../../public/index.html'),
      protocol: 'file:',
      slashes: true
    })
    : 'http://localhost:9000'; // webpack-dev-server URL

  // and load the index.html of the app.
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    // Open the DevTools when running in dev mode only
    if (DEV_MODE) {
      mainWindow.webContents.openDevTools();
      // eslint-disable-next-line global-require, import/no-extraneous-dependencies
      require('devtron').install();
    }
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (workerWindow !== null) {
      workerWindow.close();
      workerWindow = null;
    }
  });
}

/**
 * Create the worker window
 */
function createWorkerWindow() {
  workerWindow = new BrowserWindow({
    width: 900,
    height: 680,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: DEV_MODE,
      preload: path.join(__dirname, '/../worker/preload.js')
    }
  });

  workerWindow.loadURL(`file://${path.join(__dirname, '/../worker/index.html')}`);
  workerWindow.on('closed', () => {
    workerWindow = null;
  });

  workerWindow.once('ready-to-show', () => {
    // Open the DevTools when running in dev mode only
    if (DEV_MODE) {
      workerWindow.show();
    }
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();
  createWorkerWindow();

  const sendWindowMessage = (targetWindow, message, payload) => {
    if (typeof targetWindow === 'undefined') {
      logger.error('Target window does not exist');
      return;
    }
    targetWindow.webContents.send(message, payload);
  };

  ipcMain.on('message-from-worker', (event, arg) => {
    sendWindowMessage(mainWindow, 'message-from-worker', arg);
  });
  ipcMain.on('message-from-ui', (event, arg) => {
    sendWindowMessage(workerWindow, 'message-from-ui', arg);
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
    createWorkerWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('asynchronous-message', (event, arg) => {
  logger.debug(arg); // prints "ping"
  event.reply('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', (event, arg) => {
  logger.debug(arg); // prints "ping"
  // eslint-disable-next-line no-param-reassign
  event.returnValue = 'pong';
});
