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
    it('should not show settings panel', function() {
      var panel = element(by.css('.settings-panel'));
      expect(panel.isDisplayed()).toBe(false);
    });
  });

  describe('searched on "py"', function() {
    beforeEach(function() {
      element(by.model('sp.query')).sendKeys('py');
    });

    it('should have one search result', function() {
      expect(element.all(by.css('.search-result')).count()).toBe(1);
    });
  });

  describe('search on "bla"', function() {
    beforeEach(function() {
      element(by.model('sp.query')).sendKeys('bla');
    });

    it('should have zero search results', function() {
      expect(element.all(by.css('.search-result')).count()).toBe(0);
    });
  });

  describe('click on settings gear', function() {
    beforeEach(function() {
      element(by.css('.glyphicon-cog')).click();
    });

    it('should show settings panel', function() {
      var panel = element(by.css('.settings-panel'));
      expect(panel.isDisplayed()).toBe(true);
    });
  });
});
