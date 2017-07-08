module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    jasmine: true
  },
  plugins: ['jasmine'],
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ['standard', 'plugin:jasmine/recommended'],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
