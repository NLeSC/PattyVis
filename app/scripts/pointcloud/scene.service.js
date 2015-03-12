(function() {
  'use strict';

  function SceneService(THREE) {
    var scene = new THREE.Scene();
    this.referenceFrame = new THREE.Object3D();
    scene.add(this.referenceFrame);

    this.getScene = function() {
      return scene;
    };

    /**
     * transform from geo coordinates to local scene coordinates
     */
    this.toLocal = function(position) {

      var scenePos = position.clone().applyMatrix4(this.referenceFrame.matrixWorld);

      return scenePos;
    };

    /**
     * transform from local scene coordinates to geo coordinates
     */
    this.toGeo = function(object) {
      var geo;
      var inverse = new THREE.Matrix4().getInverse(this.referenceFrame.matrixWorld);

      if (object instanceof THREE.Vector3) {
        geo = object.clone().applyMatrix4(inverse);
      } else if (object instanceof THREE.Box3) {
        var geoMin = object.min.clone().applyMatrix4(inverse);
        var geoMax = object.max.clone().applyMatrix4(inverse);
        geo = new THREE.Box3(geoMin, geoMax);
      }

      return geo;
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('SceneService', SceneService);
})();
