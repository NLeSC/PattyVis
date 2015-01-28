var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  sauceUser: 'mkuzak',
  sauceKey: '2e7a055d-0a1d-40ce-81dd-f6bff479c555',

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
  },

  onPrepare: function() {
    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'e2e/reports'
    }));
  }
};
