'use strict';

describe('pattyApp', function() {

  beforeEach(function() {
    browser.get('index.html');
  });

  it('should have patty title', function() {
    expect(browser.getTitle()).toMatch('Project Patty Visualisation');
  });

  describe('initial state', function() {
    it('should have zero search results', function() {
      expect(element.all(by.css('.search-result')).count()).toBe(0);
    });

  });

  describe('searched on "py"', function() {
    beforeEach(function() {
      element(by.model('vm.query')).sendKeys('py');
    });

    it('should have one search result', function() {
      expect(element.all(by.css('.search-result')).count()).toBe(1);
    });
  });

  describe('search on "bla"', function() {
    beforeEach(function() {
      element(by.model('vm.query')).sendKeys('bla');
    });

    it('should have zero search results', function() {
      expect(element.all(by.css('.search-result')).count()).toBe(0);
    });
  });
});
