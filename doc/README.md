# Electron App

## Command line

- `--app-log` : enable application log. Log are output to standard output (stdout) in raw format (JSON)
- `--log-level=<level>` : set the application log level. Accepted values are : fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.(Default 'info')
- `--server-mode` : starts the application in server mode. Note that in this mode, log is always enabled
- `--app-config-path`: (optional) define the path where the application configuration file is stored. 


Examples: 
```bash
# start the application with logs in info level
$ electronApp.exe --app-log
# start the application with logs in trace level. Raw JSON output is converted in pretty output
$ electronApp.exe --app-log --log-level=trace | npx pino-pretty
# start the application in server mode (no log)
$ electronApp.exe --server-mode
```

## Server mode

The *server mode* is enabled by adding `--server-mode` in the command line. 
```bash
$ electronApp.exe --server-mode
```
To **shutdown** gracefully the server, send an HTTP GET request to the path `/shutdown`.

## Environment variables

Some running paramters can be passed to the application as environment variables :
- **SERVER_MODE_PORT** : in *server mode*, defines th port number the application is listeing for request. In *desktop* mode this variables is ignored. Example : `SERVER_MODE_PORT=1234