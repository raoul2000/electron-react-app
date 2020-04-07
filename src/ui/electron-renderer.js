const { ipcRenderer } = require('electron')

console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

window.sendAsyncMessage = (msg) => ipcRenderer.send('asynchronous-message', msg)


ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
})
//ipcRenderer.send('asynchronous-message', 'ping')
