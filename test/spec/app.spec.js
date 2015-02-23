'use strict';

describe('app', function() {
  beforeEach(module('pattyApp'));

  beforeEach(module('mockedDrivemap', 'mockedSites'));

  var $httpBackend, $rootScope;
  beforeEach(inject(function(_$httpBackend_, defaultDrivemapJSON, defaultSitesJSON, _$rootScope_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('data/drivemap.json').respond(200, defaultDrivemapJSON);
    $httpBackend.expectGET('data/sites.json').respond(200, defaultSitesJSON);
    $httpBackend.flush();
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('pattyApp.run() function', function() {
    it('should call sitesservice.load() function', inject(function(sitesservice) {
      var callback = jasmine.createSpy('callback');
      sitesservice.ready.then(callback);
      $rootScope.$apply();
      expect(callback).toHaveBeenCalled();
    }));

    it('should call DrivemapService.load() function', inject(function(DrivemapService) {
      var callback = jasmine.createSpy('callback');
      DrivemapService.ready.then(callback);
      $rootScope.$apply();
      expect(callback).toHaveBeenCalled();
    }));
  });
});
