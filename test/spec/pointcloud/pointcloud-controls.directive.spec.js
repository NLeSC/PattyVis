'use strict';

describe('pointcloud-controls.directive', function() {

  // load the module
  // use main module because it contains filled template cache
  beforeEach(module('pattyApp'));

  beforeEach(module('mockedDrivemap', 'mockedSites'));

  beforeEach(inject(function($httpBackend, defaultDrivemapJSON, defaultSitesJSON) {
    $httpBackend.expectGET('data/drivemap.json').respond(200, defaultDrivemapJSON);
    $httpBackend.expectGET('data/sites.json').respond(200, defaultSitesJSON);
    $httpBackend.flush();
  }));

  var $compile;
  var $rootScope;
  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  it('should have a settings icon', function() {
    var scope = $rootScope.$new();
    var html = '<patty-pointcloud-controls></patty-pointcloud-controls>';
    var result = $compile(html)(scope);
    scope.$digest();
    expect(result.html()).toContain('gear');
  });
});
