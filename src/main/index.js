// Modules to control application life and create native browser window
require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url');

app.allowRendererProcessReuse = false;
console.log(`PARAM = ${process.env.MY_PARAM}`); // myValue
console.log(`OTHER PARAM = ${process.env.MY_OTHER_PARAM}`); // undefined

let mainWindow;
let workerWindow;

/**
 * Detect if Electron is running in development mode
 */
const isDev = () => process.argv[2] == '--dev';

console.log(`isDev = ${isDev()}`);

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev()
    }
  })

  // and load the index.html of the app.
  const startUrl = isDev() === false
    ? url.format({
      pathname: path.join(__dirname, '/../../public/index.html'),
      protocol: 'file:',
      slashes: true
    })
    : "http://localhost:9000";  // webpack-dev-server URL

  // and load the index.html of the app.
  mainWindow.loadURL(startUrl)

  // Open the DevTools when running in dev mode only
  if (isDev()) {
    mainWindow.webContents.openDevTools();
    require('devtron').install();
  }
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
    if (workerWindow !== null) {
      workerWindow.close();
      workerWindow = null;
    }
  });
}


function createWorkerWindow() {
  workerWindow = new BrowserWindow({
    width: 900,
    height: 680,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev()
    }
  });
  workerWindow.loadURL(`file://${path.join(__dirname, "/../worker/index.html")}`);
  workerWindow.on("closed", () => (workerWindow = null));
  if (isDev) {
    require('devtron').install();
  }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();
  createWorkerWindow();

  function sendWindowMessage(targetWindow, message, payload) {
    if (typeof targetWindow === 'undefined') {
      console.log('Target window does not exist');
      return;
    }
    targetWindow.webContents.send(message, payload);
  }

  ipcMain.on('message-from-worker', (event, arg) => {
    sendWindowMessage(mainWindow, 'message-from-worker', arg);
  });
  ipcMain.on('message-from-ui', (event, arg) => {
    sendWindowMessage(workerWindow, 'message-from-ui', arg);
  });
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
    createWorkerWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})