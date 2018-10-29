const path = require('path');
const webpack = require('webpack');
const version = require('../package.json').version;
const sharedConfig = require('./shared.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = Object.assign(sharedConfig, {
    devServer: {
        contentBase: 'build/client',
        port: 8080,
        historyApiFallback: true,
        proxy: {
            '/api/*': {
                target: process.env.SERVER || 'http://localhost',
                secure: false
            },
            '/files/*': {
                target: 'http://localhost:8082',
                secure: false
            },
            '/socket.io': {
                target: process.env.WS_SERVER || 'http://localhost:8081',
                secure: false,
                ws: true
            }
        }
    },
    devtool: 'inline-source-map',
    plugins: [
        // Extract all 3rd party modules into a separate 'vendor' chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource)
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../client/index.html')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                VERSION: JSON.stringify(process.env.VERSION || version)
            }
        }),
        new CopyWebpackPlugin([
            {
                from: 'client/static',
                to: 'static',
                toType: 'dir'
            }
        ])
        //,
        // new UglifyJSPlugin({
        //     sourceMap: true
        // })
    ]
});
