const webpack = require('webpack');
const version = require('../package.json').version;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const sharedConfig = require('./shared.config.js');

module.exports = Object.assign(sharedConfig, {
    plugins: [
        // Extract all 3rd party modules into a separate 'vendor' chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource)
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                VERSION: JSON.stringify(version)
            }
        }),
        new UglifyJSPlugin()
    ]
});
