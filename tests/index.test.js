// require all `test/**/*.js`
const testsContext = require.context('./', true, /.+test\.js\b/)

testsContext.keys().forEach(testsContext)
