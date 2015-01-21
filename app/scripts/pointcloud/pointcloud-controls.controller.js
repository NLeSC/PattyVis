(function() {
  'use strict';

  function PointcloudControlsController(PointcloudService, CameraService, MeasuringService) {
    this.showSettings = false;
    this.settings = PointcloudService.settings;
    this.goHome = PointcloudService.goHome;
	this.PointcloudService = PointcloudService;
    this.recordCameraLocation = CameraService.recordLocation;
	this.startMeasuring = MeasuringService.startMeasuring;
  }

  angular.module('pattyApp.pointcloud')
  .controller('PointcloudControlsController', PointcloudControlsController);
})();
