(function() {
  'use strict';

  function PointcloudControlsController(PointcloudService, CameraService, MeasuringService, PathControls) {
    this.showSettings = false;
    this.showHelp = false;
    this.showToolboxTray = false;
    this.settings = PointcloudService.settings;
    this.goHome = PointcloudService.goHome;
    this.PointcloudService = PointcloudService;
    this.recordCameraLocation = CameraService.recordLocation;
    this.startMeasurement = MeasuringService.startMeasuring;
    this.PathControls = PathControls;
  }

  angular.module('pattyApp.pointcloud')
    .controller('PointcloudControlsController', PointcloudControlsController);
})();
