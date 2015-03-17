(function() {
  'use strict';

  function SearchPanelController(SitesService, PointcloudService) {
    this.pageSize = 2;
    this.currentPage = 1;
    this.SitesService = SitesService;

    this.lookAtSite = function(site) {
      PointcloudService.lookAtSite(site);
    };
    this.showLabel = function(site) {
      PointcloudService.showLabel(site);
    };
    /**
     * jump back to first page when query changes
     */
    this.onQueryChange = function() {
      this.currentPage = 1;
    };
  }

  angular.module('pattyApp.searchbox')
    .controller('SearchPanelController', SearchPanelController);
})();
