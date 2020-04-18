# Electron App

## Command line

- `--app-log` : enable application log. Log are output to standard output (stdout) in raw format (JSON)
- `--log-level=<level>` : set the application log level. Accepted values are : fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.(Default 'info')
- `--server-mode` : starts the application in server mode. Note that in this mode, log is always enabled

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
