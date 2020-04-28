# Electron React Boilerplate

This is a demo Electron + React App. No **create-react-app** needed, just simple setup for *Webpack + Babel*.
You need to use *git bash* for the `npm run clean` script.

## Features

- electron (+devtron)
- electron builder
- React (+react dev tool)
- webpack + babel
- eslint
- npm

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/raoul2000/electron-react-app.git

# Go into the repository
cd electron-react-app

# Install dependencies
npm install
```

## Run in Desktop mode

Launching in desktop mode is a two steps operation: 
```bash
# step 1:  run webpack dev server
npm run dev-server

# step 2:when *dev server* is up, open a new console and start electron:
npm start
```

## Run in Server mode

To start the server mode:
```bash
$ npm run server
```
Then open your browser at http://localhost:3000/app/

## Test

To run unit tests : 
```bash
$ npm test
```

## Build

You can also build a distribuable package :
```bash
# build  the react app
npm run build

# build the executable 
npm run electron-build
```

By default, the executable is built for windows platform.

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
