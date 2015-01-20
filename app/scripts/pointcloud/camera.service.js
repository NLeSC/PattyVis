(function() {
  'use strict';

  function CameraService() {
    var me = this;
    this.camera = null;
    this.waypoints = [];

    this.recordLocation = function() {
      me.waypoints.push(me.camera.position.clone());
      console.log(me.waypoints);
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('CameraService', CameraService);
})();
