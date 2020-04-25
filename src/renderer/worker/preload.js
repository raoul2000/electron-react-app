// All of the Node.js APIs are available in the preload process
// It has the same sandbox as a Chrome extension

// eslint-disable-next-line prefer-destructuring, import/no-extraneous-dependencies
const { initServer } = require('../../lib/task/channel');

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');

  // Task Channel : install server side channel to receive tasks from ui
  initServer();
});
