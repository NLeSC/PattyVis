(function() {
  'use strict';

function pattyPointcloudCanvas() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      scope.vm.init(element[0]);
    },
    controller: 'PointcloudController',
    controllerAs: 'vm'
  };
}

angular.module('pattyApp.pointcloud')
  .directive('pattyPointcloudCanvas', pattyPointcloudCanvas);
})();
