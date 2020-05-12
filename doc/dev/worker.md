# Worker

The *worker* is an specific Electron render process that doesn't display any window and that is only dedicated to execute background tasks submitted by the UI render process (the user interface).

## Consumer

The *Consumer* is the UI renderer process (i.e. the main window). It sends commands to the worker through a communication channel and receive a response.

For example :
```js 
send('RUN_TASK', payload, (error, result) => {
  if (error) console.error(error);
  else console.log('result received',result);
});
``` 

The `send` function must be used to submit a command to the *worker* which will returns a response asynchronously.

The prototype of this function is : *send(cmd:string, payload:any, resultCallback?:function, progressCallback?:function)*
- **cmd**: (string, required) the name of the command to send
- **payload**: (optional, any) depends on the value of the *cmd* parameter
- **resultCallback**: (optional, (error:any, result:any): void) - the callback function invoked when a result or an error is produced by the worker when executing the command
- **progressCallback**: (optional, (progress:any): void) - the callback function invoked when progress info are produced by the worker when executing the command

## Producer

The *Producer* is the Worker Renderer process. It receives and executes incomming commands and produce a result that is then sent back to the consumer.

## Consumer/Producer Communication

The communication between the consumer and the producer depends on the running mode of the application :
- in *Desktop* mode : Electron IPC is used to establish a communcation channel between the two renderer processes. In this context the main Electron process is responsible for message forwarding between the two.
- in *Server* mode : a *websocket* is dedicated to implement communication between the consumer and the producer




To send a command