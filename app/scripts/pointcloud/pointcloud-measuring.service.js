(function() {
  'use strict';

  function MeasuringService(Potree, PointcloudService, SceneService, CameraService) {
    var me = this;
	
	var scene = SceneService.getScene(); 
	var camera = CameraService.camera;
	var renderer = PointcloudService.renderer;
	
	var measuringTool = new Potree.MeasuringTool(scene, camera, renderer);
		
	console.log("init measurement");
	
	var startMeasuring = function() {
		console.log("start measurement");
		measuringTool.setEnabled(true);		
	};
  }

  angular.module('pattyApp.pointcloud')
    .service('MeasuringService', MeasuringService);
})();
