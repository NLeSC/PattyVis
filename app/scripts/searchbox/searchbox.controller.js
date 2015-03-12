(function() {
  'use strict';

  function SearchPanelController(SitesService, PointcloudService) {
    this.query = '';

    this.SitesService = SitesService;

    // when query in view is change propagate to sites service
    this.queryChanged = function() {
      SitesService.find(this.query);
    };

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
