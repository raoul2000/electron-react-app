// from https://github.com/jprichardson/is-electron-renderer
function isRenderer () {
  // running in a web browser
  if (typeof process === 'undefined') return true

  // node-integration is disabled
  if (!process) return true

  // We're in node.js somehow
  if (!process.type) return false

  return process.type === 'renderer'
}

const { ipcRenderer, remote } = require('electron')

const getChannel = () => {
  if(isRenderer()) {
    return {
      send: require('electron').ipcRenderer.send
    }
  } else {

  }
}
module.exports = getChannel