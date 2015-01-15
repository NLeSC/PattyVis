(function() {
  'use strict';

  function SearchPanelController($scope, sitesservice) {
    this.query = '';

    this.sitesservice = sitesservice;

    sitesservice.load();

    // when query in view is change propagate to sites service
    this.queryChanged = function(){
      sitesservice.find(this.query);
    };

  }

  angular.module('pattyApp.searchbox')
    .controller('SearchPanelController', SearchPanelController);
})();
