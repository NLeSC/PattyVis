(function() {
  'use strict';

  function SearchPanelController($scope, sitesservice) {
    var me = this;
    this.sitesservice = sitesservice;

    sitesservice.load();

    // when query in view is change propagate to sites service
    $scope.$watch(function() {
      return me.query;
    }, function(newVal, oldVal) {
      if (newVal !== oldVal) {
        sitesservice.find(newVal);
      }
    });
  }

  angular.module('pattyApp.searchbox')
    .controller('SearchPanelController', SearchPanelController);
})();
