const path = require('path');
const fs = require('fs');

module.exports = {
  entry: './src/renderer/ui/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: false,
    port: 9000,
    index: 'index.html',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    },
    // eslint-disable-next-line no-unused-vars
    before: (app, server, compiler) => {
      app.get('/src/ui/electron-renderer.js', (req, res) => {
        const filename = path.join(__dirname, '/src/ui/electron-renderer.js');
        fs.readFile(filename, 'utf8', (err, data) => {
          if (err) throw err;
          res.send(data);
        });
      });
    }
  }
};
