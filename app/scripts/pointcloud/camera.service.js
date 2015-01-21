(function() {
  'use strict';

  function CameraService() {
    var me = this;
    this.camera = null;
    this.toGeo = null;
    this.waypoints = [];

    this.recordLocation = function() {
      me.waypoints.push(me.toGeo(me.camera.position.clone()).toArray());
      console.log(JSON.stringify(me.waypoints));
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('CameraService', CameraService);
})();
