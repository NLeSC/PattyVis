'use strict';

describe('minimap.controller', function() {

  // load the module
  beforeEach(module('pattyApp.minimap'));

  var $controller;
  var $rootScope;
  beforeEach(function() {
    inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    });
  });

  describe('construction', function() {

    it('should setup utm 33 projection', function() {
      var scope = $rootScope.$new();

      $controller('MinimapController', {$scope: scope});
      
      expect(proj4('EPSG:32633')).toBeTruthy();
      expect(proj4('urn:ogc:def:crs:EPSG::32633')).toBeTruthy();
    });

  });

});
