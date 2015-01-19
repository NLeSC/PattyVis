(function() {
  'use strict';

  function PointcloudControlsController(PointcloudService) {
    this.showSettings = false;
    this.settings = PointcloudService.settings;
    this.goHome = PointcloudService.goHome;
  }

  angular.module('pattyApp.pointcloud')
  .controller('PointcloudControlsController', PointcloudControlsController);
})();
