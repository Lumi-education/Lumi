const path = require('path');
const webpack = require('webpack');
const version = require('../package.json').version;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const sharedConfig = require('./shared.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = Object.assign(sharedConfig, {
    devtool: 'source-map',
    plugins: [
        // Extract all 3rd party modules into a separate 'vendor' chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource)
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                VERSION: JSON.stringify(process.env.VERSION || version)
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../client/index.html')
        }),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'client/static',
                to: 'static',
                toType: 'dir'
            }
        ])
    ]
});
