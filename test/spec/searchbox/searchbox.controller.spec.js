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
      var $controller = _$controller_;
      ctrl = $controller('SearchPanelController');
    });
  });

  describe('initial state', function() {
    it('should have empty query', function() {
      expect(ctrl.SitesService.query).toEqual('');
    });

    it('should have currentPage equal to 1', function() {
      expect(ctrl.currentPage).toEqual(1);
    });
  });

  describe('onQueryChange function', function() {
    it('should set currentPage equal to 1', function() {
      ctrl.currentPage = 234;
      ctrl.onQueryChange();
      expect(ctrl.currentPage).toEqual(1);
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
