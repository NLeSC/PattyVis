(function() {
  'use strict';

  function SearchPanelController(sitesservice, PointcloudService) {
    this.query = '';

    this.sitesservice = sitesservice;

    // when query in view is change propagate to sites service
    this.queryChanged = function() {
      sitesservice.find(this.query);
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
