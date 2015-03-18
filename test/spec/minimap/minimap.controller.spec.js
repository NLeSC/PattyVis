'use strict';

describe('minimap.controller', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedSites', 'mockedDrivemap'));

  var $controller;
  var $rootScope;
  var controller;
  var CamFrustumService;
  var ol;

  beforeEach(function() {
    inject(function(_$controller_, _$rootScope_, DrivemapService, defaultDrivemapJSON, _CamFrustumService_, _ol_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      ol = _ol_;

      var scope = $rootScope.$new();

      controller = $controller('MinimapController', {
        $scope: scope
      });

      DrivemapService.onLoad(defaultDrivemapJSON);
      // promise.then are called in digest loop
      // minimap uses promise.then to fetch the crs of the drivemap
      $rootScope.$digest();

      CamFrustumService = _CamFrustumService_;
    });
  });

  describe('initial state', function() {
    it('should have a map of type ol.Map', function() {
      // expect(controller.map).toBeDefined();
      expect(controller.map instanceof ol.Map).toBeTruthy();
    });
    it('should have CamFrustumService.layer as a layer in the map', function() {
      expect(controller.map.getLayers().getArray()).toContain(CamFrustumService.layer);
    });
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
    // it('should reload sites as feature array in vectorSource', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
    // }));
    it('should fit map to show all newly filtered sites', inject(function(defaultSitesJSON) {
      // controller.onSitesChanged(defaultSitesJSON);
      // var result = controller.map.getView().calculateExtent(controller.map.getSize());
      // var expected = [1395780.6625184629, 5134928.40372647, 1397166.0836561315, 5136313.824864138];
      // expect(result).toEqual(expected);
    }));
  });

  describe('fitMapToExtent() function', function() {
    it('should fit map to given extent (not an exact resize due to integer zoom-levels)', function() {
      // spyOn(controller.map, 'getSize').and.returnValue([290, 290]);  // mock size, this is what we set it to in the CSS

      // var extent = [1396655.7426223664, 5135386.69290534, 1396678.8143506004, 5135455.753098455];
      // controller.fitMapToExtent(extent);
      // var result = controller.map.getView().calculateExtent([290, 290]);
      // var expected = [1395808.0073149959, 5134899.1359227635, 1397193.4284526645, 5136284.557060432];
      // expect(result).toEqual(expected);
    });
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

