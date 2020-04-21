// All of the Node.js APIs are available in the preload process
// It has the same sandbox as a Chrome extension

// eslint-disable-next-line import/no-extraneous-dependencies
const { remote, shell } = require('electron');

// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const taskChannel = require('../../lib/task-channel');

window.addEventListener('DOMContentLoaded', () => {
  /**
   * @type App.ExWindow
   */
  const exWindow = window;
  // extend the global window object with dialog related functions
  exWindow.showOpenDialog = (options) => remote.dialog.showOpenDialog(remote.getCurrentWindow(), options);
  exWindow.showSaveDialog = (options) => remote.dialog.showSaveDialog(remote.getCurrentWindow(), options);

  // install client side channel to submit tasks to worker
  taskChannel.initClient();

  document.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' && event.target.dataset.openExternal) {
      event.preventDefault();
      event.stopPropagation();
      shell.openExternal(event.target.href);
    }
  });
});
