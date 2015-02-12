'use strict';

/* global proj4 */

describe('minimap.controller', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedSites'));

  var $controller;
  var $rootScope;
  var controller;

  beforeEach(function() {
    inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;

      var scope = $rootScope.$new();

      controller = $controller('MinimapController', {
        $scope: scope
      });
    });
  });

  describe('construction', function() {

    it('should setup utm 33 projection', function() {

      expect(proj4('EPSG:32633')).toBeTruthy();
      expect(proj4('urn:ogc:def:crs:EPSG::32633')).toBeTruthy();
    });
  });

  describe('sites2GeoJSON() function', function() {


    it('should add 2 sites as features to map', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
      var result = controller.sites2GeoJSON(defaultSitesJSON);
      expect(result).toEqual(defaultSitesGeoJSON);
    }));
  });
});
