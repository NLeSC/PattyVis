(function() {
  'use strict';

  function PointcloudControlsController(PointcloudService, CameraService) {
    this.showSettings = false;
    this.settings = PointcloudService.settings;
    this.goHome = PointcloudService.goHome;
	this.PointcloudService = PointcloudService;
    this.recordCameraLocation = CameraService.recordLocation;
  }

  angular.module('pattyApp.pointcloud')
  .controller('PointcloudControlsController', PointcloudControlsController);
})();
