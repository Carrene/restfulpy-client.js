var path = require('path')
var libraryName = 'restfulpy-client'
var outputFile = libraryName + '.js'
var src = path.resolve(__dirname, 'src')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'restfulpy-client': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
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
