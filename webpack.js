const _ = require('lodash');
const webpack = require('webpack');
const path = require('path');
const version = require('./package.json').version;

const babelOptions = {
  presets: 'es2015'
};

function isVendor(module) {
  return module.context && module.context.indexOf('node_modules') !== -1;
}

const entries = {
  client: './client/boot'
};

module.exports = {
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
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
    hot: true,
    historyApiFallback: {
      index: 'index.html'
    },
    proxy: {
      '/api/*': {
        target: process.env.SERVER || 'http://localhost:3000',
        secure: false
      }
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: function(module, count) {
        // creates a common vendor js file for libraries in node_modules
        return isVendor(module);
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      chunks: _.keys(entries),
      minChunks: function(module, count) {
        // creates the main js file
        return !isVendor(module) && count > 1;
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        VERSION: JSON.stringify(version)
      }
    })
  ]
};
