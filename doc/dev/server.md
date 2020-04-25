# Draft Notes

## About the *desktop* and *server* modes

when the application is started in *server* mode, no user interface is started. Instead the application responds to HTTP request.

The first request received should be the one to get the user interface page (`index.html`), which is the same as the one available when the application is running in standalone mode (the Desktop mode). The user browser loads the user interface and when done, starts interacting with the server via HTTP requests (AJAX).

> could use [http-server](https://github.com/http-party/http-server) to implement the embedded server

From the user interface perspective, there is no difference between being loaded in the application view (standalone mode) or in a browser (server mode). Technically speaking, tHe user interface is always running in a browser instance : in standalone mode, it is the Chrome instance embedded in the application when in server mode it is the browser application of the user (see list of supported browsers).

 In both cases, the user interface interacts with external entities and when it is needed (like for example REST API), this is done through an abstraction layer that hides the actual implementation. 

 ## Shutdown
 The server can be shutdown by sending a POST request to the `/shutdown` endpoint. The body of the request must contain a JSON object with the property `secret`.

 ```
 POST http://localhost:3000/shutdown
 Content-Type: application/json

{
  "secret": "SomeSecretV4lue"
}
```
The value of the *secret* property must be same as the one of the SHUTDOWN_SECRET environment variable in order for the server to actually initiate the shutdown operation. If that's not the case, the server returns an error response :

```
HTTP status code = 500
{
  "error": "invalid request"
}
```
Note that if the SHUTDOWN_SECRET environment variable is not defined, the **shutdown feature is not available**. In this situation the only way to close the server is by killing the process.
