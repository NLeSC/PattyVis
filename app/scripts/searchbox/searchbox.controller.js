(function() {
  'use strict';

  function SearchPanelController(SitesService, PointcloudService) {
    this.SitesService = SitesService;

    this.lookAtSite = function(site) {
      PointcloudService.lookAtSite(site);
    };
    this.showLabel = function(site) {
      PointcloudService.showLabel(site);
    };
  }

  angular.module('pattyApp.searchbox')
    .controller('SearchPanelController', SearchPanelController);
})();
