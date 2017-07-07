
var path = require('path');
var libraryName = 'restfulpy-client';
var outputFile = libraryName + '.js';

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
  }
}
