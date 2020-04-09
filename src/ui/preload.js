// All of the Node.js APIs are available in the preload process
// It has the same sandbox as a Chrome extension
window.addEventListener('DOMContentLoaded', () => {
  ['chrome', 'node', 'electron'].forEach((type) => {
    console.info(`%c${type}-version ${process.versions[type]}`, 'background: green; color: white; display: block;');
  });
});
