'use strict';

fdescribe('minimap.CamFrustumService', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedDrivemap'));

  var service;
  beforeEach(function() {
    inject(function($rootScope, DrivemapService, CamFrustumService, defaultDrivemapJSON) {
      service = CamFrustumService;

      DrivemapService.onLoad(defaultDrivemapJSON);
      // promise.then are called in digest loop
      // minimap uses promise.then to fetch the crs of the drivemap
      $rootScope.$digest();
    });
  });

  fdescribe('initial state', function() {
    fit('should have an layer', function() {
      expect(service.layer).toBeDefined();
    });

    fit('should have an camFrustum', function() {
      expect(service.camFrustum).toBeDefined();
    });
  });

  fdescribe('onCameraMove() function', function() {
    fit('should set coordinates for camFrustum', function() {
      var mockFrustum = {'cam':{'x':297051.4777832031,'y':4632724.935546875,'z':141.26402282611974},'left':{'x':297406.5820811396,'y':4632622.404538055,'z':146.29805584894072},'right':{'x':297066.8933021421,'y':4632355.646999936,'z':146.29805584894078}};
      var mockCamFrustumCoordinates = [[1397771.4318921762,5134117.448713819],[1398250.8778260758,5133993.199513802],[1397806.1460583345,5133621.6601744285],[1397771.4318921762,5134117.448713819]];

      service.onCameraMove(mockFrustum);
      var expectedCoordinates = service.camFrustum.getCoordinates();

      expect(expectedCoordinates).toEqual(mockCamFrustumCoordinates);
    });
  });

});
