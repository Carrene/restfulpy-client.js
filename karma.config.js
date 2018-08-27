// Karma configuration
// Generated on Sat Jul 08 2017 00:12:18 GMT+0430 (IRDT)
const path = require('path')

module.exports = function (config) {
  const configurations = {
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/**/*.js',
      'tests/**/*.js'
    ],
    exclude: ['dist'],
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'tests/**/*.js': ['webpack', 'sourcemap']
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
    client: {
      serverUrl: config.serverUrl
    },
    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies

      // webpack configuration
      resolve: {
        alias: {
          'restfulpy': path.resolve(__dirname, 'src')
        }
      }
    },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_without_security'],
    customLaunchers:{
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      },
      Travis_CI_Chrome: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security', '--no-sandbox']
      }
    },
    singleRun: true,
    concurrency: Infinity
  }

  // Changing Testing browser in Travis
  if (process.env.TRAVIS) {
    configurations.browsers = ['Travis_CI_Chrome']
  }

  config.set(configurations)
}
