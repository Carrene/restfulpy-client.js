var path = require('path')
var libraryName = 'restfulpy'
var outputFile = libraryName + '.js'
var src = path.resolve(__dirname, 'src')

module.exports = {
  context: src,
  entry: {
    'restfulpy': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    alias: {
      'restfulpy': path.resolve(__dirname, 'src'),
      'fs': 'empty'
    }
  },
  node: {
    'fs': 'empty'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
