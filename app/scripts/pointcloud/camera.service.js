(function() {
  'use strict';

  function CameraService($window, $log, THREE) {
    var fov = 75;
    var width = $window.innerWidth;
    var height = $window.innerHeight;
    var aspect = width / height;
    var near = 0.1;
    var far = 100000;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    var me = this;
    this.toGeo = null;
    this.waypoints = [];

    this.recordLocation = function() {
      me.waypoints.push(me.toGeo(me.camera.position.clone()).toArray());
      $log.log(JSON.stringify(me.waypoints));
    };
  }

  angular.module('pattyApp.pointcloud')
  .service('CameraService', CameraService);
})();
