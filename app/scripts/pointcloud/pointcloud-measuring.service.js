(function() {
  'use strict';

  function MeasuringService(Potree, PointcloudService, SceneService, CameraService) {
    var me = this;
	
	var scene = SceneService.getScene(); 
	var camera = CameraService.camera;
	var renderer = PointcloudService.renderer;
	
	var measuringTool = new Potree.MeasuringTool(scene, camera, renderer);
		
	var startMeasuring = function() {
		measuringTool.setEnabled(true);		
	};
  }

  angular.module('pattyApp.pointcloud')
    .service('MeasuringService', MeasuringService);
})();
