// Karma configuration
// Generated on Sat Jul 08 2017 00:12:18 GMT+0430 (IRDT)
var path = require('path')

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // 'src/**/*.js',
      'tests/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'tests/**/*.js': ['webpack']
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js')
      },
      sourceFileName: function (file) {
        return file.originalPath
      }
    },
    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies

      // webpack configuration
      // resolve: {
      //   extensions: ['.js', '.json'],
      //   modules: [path.resolve(__dirname, 'node_modules')],
      //   alias: {
      //     'src': path.resolve(__dirname, 'src')
      //   }
      // }
      // resolveLoader: {
      //   modules: [path.join(__dirname, 'node_modules')],
      //   extensions: ['.js', '.json'],
      //   mainFields: ['loader', 'main']
      // }
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', './tests/mockup-server.py'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
