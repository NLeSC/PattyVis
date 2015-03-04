'use strict';

describe('searchbox.controller', function() {

  // load the module
  beforeEach(module('pattyApp.searchbox'));

  var ctrl;
  var PointcloudService;
  var SitesService;
  beforeEach(function() {
    inject(function(_$controller_, _PointcloudService_, _SitesService_) {
      PointcloudService = _PointcloudService_;
      SitesService = _SitesService_;
      // stub load, so we dont do any ajax calls
      spyOn(SitesService, 'load');
      var $controller = _$controller_;
      ctrl = $controller('SearchPanelController');
    });
  });

  describe('initial state', function() {
    it('should have empty query', function() {
      expect(ctrl.query).toEqual('');
    });
  });

  describe('queryChanged function', function() {
    it('should call find() on SitesService', function() {
       spyOn(SitesService, 'find');
       ctrl.query = 'somequery';

       ctrl.queryChanged();

       expect(SitesService.find).toHaveBeenCalledWith('somequery');
    });
  });

  describe('lookAtSite function', function() {
    it('should call lookAtSite() on PointcloudService', function() {
      spyOn(PointcloudService, 'lookAtSite');

      ctrl.lookAtSite('somequery');

      expect(PointcloudService.lookAtSite).toHaveBeenCalledWith('somequery');
    });
  });

  describe('showLabel function', function() {
    it('should call showLabel() on PointcloudService', function() {
      spyOn(PointcloudService, 'showLabel');

      ctrl.showLabel('somequery');

      expect(PointcloudService.showLabel).toHaveBeenCalledWith('somequery');
    });
  });

});
