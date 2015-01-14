exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  multiCapabilities: [{
      'browserName': 'chrome'
  }, {
      'browserName': 'firefox'
  }],

  baseUrl: 'http://localhost:9001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
