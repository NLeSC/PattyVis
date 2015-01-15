(function() {
  'use strict';

  function PointcloudControlsController(PointcloudService) {
    this.showSettings = false;
    this.settings = PointcloudService.settings;

  }

  angular.module('pattyApp.pointcloud')
  .controller('PointcloudControlsController', PointcloudControlsController);
})();
