'use strict';

describe('utils.eventbus', function() {

  // load the module
  beforeEach(module('pattyApp.utils'));

  var eventbus;
  beforeEach(function() {
    inject(function($injector) {
      eventbus = $injector.get('Eventbus');
    });
  });

  it('should call subscriber when publication occurs', function() {
    var data = '';
    var subscriber = function(event, _data_) {
      data = _data_;
    };
    eventbus.subscribe('someevent', subscriber);

    eventbus.publish('someevent', 'someargs');

    expect(data).toBe('someargs');
  });

});
