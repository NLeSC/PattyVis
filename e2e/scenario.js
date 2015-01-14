'use strict';

describe('pattyApp', function() {

  browser.get('index.html');

  it('should have patty title', function() {
    expect(browser.getTitle()).toMatch('Project Patty Visualisation');
  });

});
