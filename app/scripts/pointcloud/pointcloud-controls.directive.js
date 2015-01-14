(function() {
  'use strict';

  function pattyPointcloudControls() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/pointcloud/pointcloud-controls.directive.html',
      controller: 'PointcloudController',
      controllerAs: 'vm'
    };
  }

  angular.module('pattyApp.pointcloud')
    .directive('pattyPointcloudControls', pattyPointcloudControls);
})();
