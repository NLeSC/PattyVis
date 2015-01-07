(function() {
  'use strict';

  function pattySearchPanel() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/searchbox/searchbox.directive.html',
      controller: 'SearchPanelController',
      controllerAs: 'vm'
    };
  }

  angular.module('pattyApp.searchbox')
    .directive('pattySearchPanel', pattySearchPanel);
})();
