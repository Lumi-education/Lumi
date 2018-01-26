const path = require('path');

const babelOptions = {
    presets: 'es2015'
};

const tslintOptions = {
    configFile: path.resolve(__dirname, '../tslint.json'),
    tsConfigFile: path.resolve(__dirname, '../tsconfig.json'),
    emitErrors: true,
    typeCheck: false
};

const entries = {
    client: './src/client/boot'
};

module.exports = {
    entry: entries,
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../build/client'),
        sourceMapFilename: '[name].js.map',
        publicPath: '/'
    },
    devtool: 'source-map',

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
                    },
                    {
                        loader: 'tslint-loader',
                        options: tslintOptions
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'tslint-loader',
                        options: tslintOptions
                    },
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                ]
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            lib: path.resolve(__dirname, '../lib'),
            client: path.resolve(__dirname, '../src/client')
        }
    }
};
