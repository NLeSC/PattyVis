'use strict';

describe('pattyApp', function() {

  browser.get('index.html');

  it('should have patty title', function() {
    expect(driver.getTitle()).toMatch('Project Patty Visualisation');
  });

});
