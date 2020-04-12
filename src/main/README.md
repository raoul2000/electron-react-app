This the the **main** electron process, the entry point for the application.

It is in charge of : 
- preparing global application context : logger, configuration, etc...
- loading the UI renderer process
- loading the worker renderer process