(function() {
  'use strict';

  function CameramodesController(PathControls) {
    this.PathControls = PathControls;
    this.cameraMode = PathControls.mode;
  }

  angular.module('pattyApp.cameramodes')
    .controller('CameramodesController', CameramodesController);
})();
