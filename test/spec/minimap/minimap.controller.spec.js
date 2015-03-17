'use strict';

describe('minimap.controller', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedSites', 'mockedDrivemap'));

  var $controller;
  var $rootScope;
  var controller;

  beforeEach(function() {
    inject(function(_$controller_, _$rootScope_, DrivemapService, defaultDrivemapJSON) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;

      var scope = $rootScope.$new();

      controller = $controller('MinimapController', {
        $scope: scope
      });

      DrivemapService.onLoad(defaultDrivemapJSON);
      // promise.then are called in digest loop
      // minimap uses promise.then to fetch the crs of the drivemap
      $rootScope.$digest();
    });
  });

  describe('initial state', function() {
    it('should have a map', function() {
      expect(controller.map).toBeDefined();
    });
    it('should have a CamFrustumService.layer in the map');
    it('should have a on click event on the map');
    it('should have a on rightclick event on the map');
    it('should have subscribed "sitesChanged" on the Messagebus');
    it('should have subscribed "cameraMoved" on the Messagebus');
  });


  describe('sites2GeoJSON() function', function() {
    it('should add 2 sites as features to map', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
      var result = controller.sites2GeoJSON(defaultSitesJSON);
      expect(result).toEqual(defaultSitesGeoJSON);
    }));
  });

  describe('onSitesChanged() function', function() {
    it('should reload sites as feature array in vectorSource', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
    }));
    it('should center on visible sites', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
    }));
  });

  describe('onMapRightclick() function', function() {
    it('should ', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
    }));
  });

  describe('onMapClick() function', function() {
    it('should ', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
    }));
  });

  describe('cameraMovedMessage() function', function() {
    it('should ', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
    }));
  });

  describe('sitesChangedMessage() function', function() {
    it('should ', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
    }));
  });
});

