// Karma configuration
// Generated on Sat Jul 08 2017 00:12:18 GMT+0430 (IRDT)
const path = require('path')

module.exports = function (config) {
  const configurations = {
    basePath: '',
    frameworks: ['jasmine'],
    files: ['tests/index.test.js'],
    exclude: ['dist'],
    preprocessors: {
      'tests/index.test.js': ['webpack', 'sourcemap']
    },
    client: {
      serverUrl: config.serverUrl
    },
    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies

      // webpack configuration
      module: {
        rules: [
          // instrument only testing sources with Istanbul
          {
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            include: path.resolve('src/'),
            exclude: path.resolve('src/index.js')
          }
        ]
      },
      resolve: {
        alias: {
          restfulpy: path.resolve(__dirname, 'src')
        }
      },
      devtool: 'inline-source-map',
      mode: 'development'
    },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['progress', 'coverage-istanbul', 'coveralls'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_without_security'],
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: 'coverage/'
    },
    customLaunchers: {
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
