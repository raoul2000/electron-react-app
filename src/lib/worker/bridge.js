/**
 * Handke tasks forwarding between UI and Worker renderer processes
 */
// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { ipcMain } = require('electron');
/**
 * Invoked from the `main`process, this function installs appropriate
 * IPC event handler to route messages between the UI and the Worker renderer processes.
 *
 * @param {Electron.BrowserWindow} mainWindow the UI browser window
 * @param {Electron.BrowserWindow} workerWindow the WORKER browser window
 */
const initBridge = (mainWindow, workerWindow) => {
  const sendWindowMessage = (targetWindow, message, payload) => {
    if (typeof targetWindow === 'undefined') {
      // eslint-disable-next-line no-console
      console.error('Target window does not exist');
      return;
    }
    targetWindow.webContents.send(message, payload);
  };
  // forward message (request) sent by ui
  ipcMain.on('to-worker', (event, arg) => {
    sendWindowMessage(workerWindow, 'from-ui', arg);
  });
  // foward message (response) sent by worker
  ipcMain.on('to-ui', (event, arg) => {
    sendWindowMessage(mainWindow, 'from-worker', arg);
  });
};

module.exports = {
  initBridge
};
