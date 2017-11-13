const _ = require('lodash');
const webpack = require('webpack');
const path = require('path');
const version = require('../package.json').version;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const babelOptions = {
    presets: 'es2015'
};

const entries = {
    client: './client/boot'
};

module.exports = {
    entry: entries,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../build/client')
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
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
};
