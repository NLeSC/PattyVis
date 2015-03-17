exports.config = {
  allScriptsTimeout: 21000,
  getPageTimeout: 20000,

  specs: [
    '*.js'
  ],

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  sauceSeleniumAddress: 'localhost:4445/wd/hub',

  multiCapabilities: [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Chrome WIN8.1 v39',
    'version': '39.0',
    'platform': 'WIN8_1'
  }, {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Chrome Linux v39',
    'version': '39.0',
    'platform': 'Linux'
  }, {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Chrome OSX v39',
    'version': '39.0',
    'platform': 'OS X 10.10'
  }, {
    'browserName': 'Firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Firefox Linux v34',
    'version': '34.0',
    'platform': 'Linux'
  }],

  baseUrl: 'http://localhost:9001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }

};
