var path = require('path')
var webpack = require('webpack')
var path = require('path')
var libraryName = 'library'
var outputFile = libraryName + '.js'

// https://webpack.js.org/configuration/
module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    modules: [
      path.join(__dirname, '../node_modules')
    ]
    // descriptionFiles: [path.resolve(__dirname, '../package.json')]
  },
  resolveLoader: {
    modules: [path.join(__dirname, '../node_modules')],
    extensions: ['.js', '.json']
  },
  node: {
    ws: 'empty',
    fs: 'empty',
    tls: 'empty'
  }
}
