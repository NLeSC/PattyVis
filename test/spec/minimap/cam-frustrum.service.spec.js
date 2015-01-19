'use strict';

describe('minimap.CamFrustrumService', function() {

  // load the module
  beforeEach(module('pattyApp.minimap'));

  var Messagebus;
  var service;
  beforeEach(function() {
    inject(function($injector) {
      Messagebus = $injector.get('Messagebus');
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

  describe('publish of "cameraMoved" event', function() {
    it('should convert camera frustrum into ol triangle', function() {
      service.camFrustum = jasmine.createSpyObj('camFrustum', ['setCoordinates']);
      var frustrum = {
        cam: {
          x: 278.1375,
          y: 2040.1884,
          z: 147.4053
        },
        left: {
          x: 726.5532,
          y: 1935.6777,
          z: 66.02808
        },
        right: {
          x: 80.3363,
          y: 1624.4075,
          z: 66.02809
        }
      };

      Messagebus.publish('cameraMoved', frustrum);

      var expected = [
        [1170385.0413843133, 2048.42216895622], // cam
        [1170832.2566349453, 1943.5004421579938], // left
        [1170187.7810193563, 1630.9592696843429], // right
        [1170385.0413843133, 2048.42216895622] // cam
      ];
      expect(service.camFrustum.setCoordinates).toHaveBeenCalledWith(expected);
    });
  });


});
