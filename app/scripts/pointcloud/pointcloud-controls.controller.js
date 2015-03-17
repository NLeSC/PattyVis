(function() {
  'use strict';

  function PointcloudControlsController(PointcloudService, CameraService, PathControls) {
    this.showSettings = false;
    this.showHelp = false;
    //this.showToolboxTray = false;
    this.settings = PointcloudService.settings;
    this.goHome = PointcloudService.goHome;
    this.PointcloudService = PointcloudService;
    this.recordCameraLocation = function() {
      CameraService.recordLocation();
    };
    //this.measure = MeasuringService;
    this.PathControls = PathControls;
    this.cameraMode = PathControls.mode;

    //this.toggleToolbox = function() {
    //    this.showToolboxTray = !this.showToolboxTray;
    //
    //    this.measure.clear();
    //};
  }

  angular.module('pattyApp.pointcloud')
    .controller('PointcloudControlsController', PointcloudControlsController);
})();
