(function() {
  'use strict';

  function MeasuringService(Potree, SceneService, CameraService) {
    var measuringTool = null;
    this.init = function(renderer) {
        var scene = SceneService.getScene(); 
        var camera = CameraService.camera;
	
        measuringTool = new Potree.MeasuringTool(scene, camera, renderer);
    }  
		
	this.startMeasuring = function() {
        if (measuringTool !=null) {
            //TODO Fix Rendering.
            measuringTool.setEnabled(true);		
        }
	};
    
    this.render = function() {
        if (measuringTool !=null) {
            measuringTool.render();
        }
    }
  }

  angular.module('pattyApp.pointcloud')
    .service('MeasuringService', MeasuringService);
})();
