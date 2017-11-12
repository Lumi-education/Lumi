let _ = require('lodash');
let webpack = require('webpack');
let path = require('path');

let babelOptions = {
  presets: 'es2015'
};

function isVendor(module) {
  return module.context && module.context.indexOf('node_modules') !== -1;
}

let entries = {
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
        // creates a common vendor js file for libraries in node_modules
        return !isVendor(module) && count > 1;
      }
    })
  ]
};
