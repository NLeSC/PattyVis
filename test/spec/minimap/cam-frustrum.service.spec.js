'use strict';

describe('minimap.CamFrustrumService', function() {

  // load the module
  beforeEach(module('pattyApp.minimap'));

  var service;
  beforeEach(function() {
    inject(function($injector) {
      service = $injector.get('CamFrustrumService');
      var proj4 = $injector.get('proj4');
      proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
      proj4.defs('urn:ogc:def:crs:EPSG::32633', proj4.defs('EPSG:32633'));
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
