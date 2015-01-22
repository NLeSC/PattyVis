(function() {
  'use strict';

  function MeasuringService(Potree, THREE, SceneService, CameraService, $window) {
    var tools = {
      distance: null,
      angle: null,
      area: null,
      volume: null,
      heightprofile: null,
      clipvolume: null
    };
    this.pointcloud = null;
    this.profileWidth = 0.1;
    var initCalled = false;

    function onKeyDown(event) {
      //console.log(event.keyCode);

      if (event.keyCode === 69) {
        // e pressed

        tools.transformation.translate();
      } else if (event.keyCode === 82) {
        // r pressed

        tools.transformation.scale();
      } else if (event.keyCode === 84) {
        // r pressed

        tools.transformation.rotate();
      }
    }

    this.init = function(renderer) {
      var scene = SceneService.getScene();
      var camera = CameraService.camera;

      tools.distance = new Potree.MeasuringTool(scene, camera, renderer);
      tools.area = new Potree.AreaTool(scene, camera, renderer);
      tools.volume = new Potree.VolumeTool(scene, camera, renderer);
      tools.heightprofile = new Potree.ProfileTool(scene, camera, renderer);
      tools.transformation = new Potree.TransformationTool(scene, camera, renderer);
      // TODO do pollute global namespace, but Potree.VolumeTool uses the global var
      $window.transformationTool = tools.transformation;

      $window.addEventListener('keydown', onKeyDown, false);
      initCalled = true;
    };

    this.setPointcloud = function(pointcloud) {
      this.pointcloud = pointcloud;
    };

    this.startDistance = function() {
      if (tools.distance) {
        //TODO Fix Rendering.
        tools.distance.setEnabled(true);
      }
    };

    this.startAngle = function() {
      if (tools.angle) {
        //TODO Fix Rendering.
        tools.angle.setEnabled(true);
      }
    };

    this.startArea = function() {
      if (tools.area) {
        //TODO Fix Rendering.
        tools.area.setEnabled(true);
      }
    };

    this.startVolume = function() {
      if (tools.volume) {
        //TODO Fix Rendering.
        tools.volume.startInsertion();
      }
    };

    this.startHeighProfile = function() {
      if (tools.heightprofile) {
        //TODO Fix Rendering.
        tools.heightprofile.startInsertion({
          width: this.profileWidth
        });
      }
    };

    this.startClipVolume = function() {
      if (tools.volume) {
        //TODO Fix Rendering.
        tools.volume.startInsertion({
          clip: true
        });
      }
    };

    this.render = function() {
      if (initCalled) {
        tools.heightprofile.render();
        tools.volume.render();

        tools.distance.renderer.clearDepth();
        tools.distance.render();
        tools.area.render();
        tools.transformation.render();
      }
    };

    this.update = function() {
      if (initCalled) {
        tools.volume.update();
        tools.transformation.update();
        tools.heightprofile.update();

        var clipBoxes = [];

        for (var i = 0; i < tools.heightprofile.profiles.length; i++) {
          var profile = tools.heightprofile.profiles[i];

          for (var j = 0; j < profile.boxes.length; j++) {
            var box = profile.boxes[j];
            box.updateMatrixWorld();
            var boxInverse = new THREE.Matrix4().getInverse(box.matrixWorld);
            clipBoxes.push(boxInverse);
          }
        }

        for (var k = 0; k < tools.volume.volumes.length; k++) {
          var volume = tools.volume.volumes[k];

          if (volume.clip) {
            volume.updateMatrixWorld();
            var boxInverseV = new THREE.Matrix4().getInverse(volume.matrixWorld);

            clipBoxes.push(boxInverseV);
          }
        }

        if (this.pointcloud) {
          this.pointcloud.material.setClipBoxes(clipBoxes);
        }
      }
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('MeasuringService', MeasuringService);
})();
