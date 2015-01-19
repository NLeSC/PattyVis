'use strict';

describe('utils.messagebus', function() {

  // load the module
  beforeEach(module('pattyApp.utils'));

  var messagebus;
  beforeEach(function() {
    inject(function($injector) {
      messagebus = $injector.get('Messagebus');
    });
  });

  it('should call subscriber when publication occurs', function() {
    var data = '';
    var subscriber = function(event, _data_) {
      data = _data_;
    };
    messagebus.subscribe('someevent', subscriber);

    messagebus.publish('someevent', 'someargs');

    expect(data).toBe('someargs');
  });

});
