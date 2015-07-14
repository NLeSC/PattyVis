(function() {
  'use strict';

  function NexusPanelDirective() {
    return {
      restrict: 'E',
      link: function(scope, element) {
        var canvas = element.children().children()[0];

        scope.vm.service.setTarget(canvas);
      },
      templateUrl: 'scripts/nexus/nexus-panel.directive.html',
      controller: 'NexusController',
      controllerAs: 'vm'
    };
  }

  angular.module('pattyApp.nexus')
    .directive('nexusPanel', NexusPanelDirective);
})();
