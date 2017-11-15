const webpack = require('webpack');
const version = require('../package.json').version;
const sharedConfig = require('./shared.config.js');

module.exports = Object.assign(sharedConfig, {
    devServer: {
        contentBase: 'build/client',
        port: 8080,
        historyApiFallback: true,
        proxy: {
            '/api/*': {
                target: process.env.SERVER || 'http://localhost:3000',
                secure: false
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                VERSION: JSON.stringify(version)
            }
        })
    ]
});
