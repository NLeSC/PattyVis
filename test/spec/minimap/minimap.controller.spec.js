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

  describe('sites2GeoJSON() function', function() {
    it('should add 2 sites as features to map', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
      var result = controller.sites2GeoJSON(defaultSitesJSON);
      expect(result).toEqual(defaultSitesGeoJSON);
    }));
  });
});
