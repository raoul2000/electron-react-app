const path = require('path');
const fs = require('fs');

module.exports = {
    entry: './src/ui/index.js',
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
                    loader: "babel-loader"
                }
            }
        ]
    },
    optimization: {
        minimize: false
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: false,
        port: 9000,
        index: 'index.html',
        open: true,
        before: function (app, server, compiler) {
            app.get('/src/ui/electron-renderer.js', function (req, res) {
                const filename = path.join(__dirname, '/src/ui/electron-renderer.js');
                fs.readFile( filename, 'utf8', function (err, data) {
                    if (err) throw err;
                    res.send(data);
                });
            });
        }
    }
};