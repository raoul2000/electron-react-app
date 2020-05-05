From [Electron Performance](https://www.electronjs.org/docs/tutorial/performance) page using Nodejs v14.1.0 or later :

```
node --cpu-prof --heap-prof -e "require('fastify')"
```

Then from Chrome Developer Tool : 
- open the `.cpuprofile` generated file in tab `Performance`.
- open the `.heapprofile` generated file in tab `Memory`.

Other advices :
- **never** block the main process
- load module when needed (not before)
- don't use polyfill : they are not needed as Chrome implements latest es6 features
- create bundle
- don't make unecessary network request
