exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  multiCapabilities: [{
    'browserName': 'chrome',
    'version': '39.0',
    'platform': 'WIN8_1'
  }, {
    'browserName': 'chrome',
    'version': '39.0',
    'platform': 'Linux'
  }, {
    'browserName': 'chrome',
    'version': '39.0',
    'platform': 'OS X 10.10'
  }, {
    'browserName': 'Firefox',
    'version': '34.0',
    'platform': 'Linux'
  }],

  baseUrl: 'http://localhost:9001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};
