const path = require('path');

const babelOptions = {
    presets: 'es2015'
};

const tslintOptions = {
    configFile: path.resolve(__dirname, '../tslint.json'),
    tsConfigFile: path.resolve(__dirname, '../tsconfig.json'),
    emitErrors: false, // this should be set to true once all errors are fixed
    typeCheck: false
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
                        loader: 'tslint-loader',
                        options: tslintOptions
                    },
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
                        loader: 'tslint-loader',
                        options: tslintOptions
                    },
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
    }
};
