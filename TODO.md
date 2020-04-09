# Todo

- [X] evaluate [dotenv](https://www.npmjs.com/package/dotenv) and possibly setup in project 
- [ ] check internationalization via [react i18next](https://react.i18next.com/)
- [ ] setup testing tools (unit and e2e)
  - [ ] check [spectron](https://www.electronjs.org/spectron)
- [ ] evaluate using a dedicated module for for job queues - possible candidates :
  - [ ] [embedded-queue](https://github.com/hajipy/embedded-queue)
  - [ ] [fastq](https://github.com/mcollina/fastq)


# Sample

```js
const createWindow = exports.createWindow = () => {
  let newWindow = new BrowserWindow({ show: false });

  newWindow.loadFile('index.html');

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
};

```