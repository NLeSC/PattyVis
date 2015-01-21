(function() {
  'use strict';

  function SceneService(THREE) {
	  var scene = new THREE.Scene();
	  
	  this.getScene = function() {
		return scene;
	  }
  }

  angular.module('pattyApp.pointcloud')
    .service('SceneService', SceneService);
})();
