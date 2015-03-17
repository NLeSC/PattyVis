'use strict';

describe('minimap.CamFrustrumService', function() {

  // load the module
  beforeEach(module('pattyApp.minimap'));

  var service;
  beforeEach(function() {
    inject(function($injector) {
      service = $injector.get('CamFrustrumService');
    });
  });

  describe('initial state', function() {
    it('should have an layer', function() {
      expect(service.layer).toBeDefined();
    });

    it('should have an camFrustum', function() {
      expect(service.camFrustum).toBeDefined();
    });
  });

});
