(function() {
  'use strict';

  function SettingsController(PointcloudService, CameraService) {
    this.showSettings = false;
    this.settings = PointcloudService.settings;
    this.PointcloudService = PointcloudService;
    this.recordCameraLocation = function() {
      CameraService.recordLocation();
    };
  }

  angular.module('pattyApp.settings')
    .controller('SettingsController', SettingsController);
})();
