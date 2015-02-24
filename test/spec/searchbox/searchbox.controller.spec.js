'use strict';

describe('searchbox.controller', function() {

  // load the module
  beforeEach(module('pattyApp.searchbox'));

  var ctrl;
  var PointcloudService;
  var sitesservice;
  beforeEach(function() {
    inject(function(_$controller_, _PointcloudService_, _sitesservice_) {
      PointcloudService = _PointcloudService_;
      sitesservice = _sitesservice_;
      // stub load, so we dont do any ajax calls
      spyOn(sitesservice, 'load');
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
    it('should call find() on sitesservice', function() {
       spyOn(sitesservice, 'find');
       ctrl.query = 'somequery';

       ctrl.queryChanged();

       expect(sitesservice.find).toHaveBeenCalledWith('somequery');
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
