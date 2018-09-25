(function() {
  'use strict';

  function MeasuringService($rootScope, Potree, THREE, $window) {
    this.tools = {
      distance: null,
      angle: null,
      area: null,
      volume: null,
      heightprofile: null,
      clipvolume: null,
      transformation: null
    };

    this.transformationTools = {
      TRANSLATE: 0,
      ROTATE: 1,
      SCALE: 2
    };

    this.activeTransformationTool = this.transformationTools.ROTATE;

    this.pointcloud = null;
    this.sitePointcloud = null;

    this.profileWidth = 0.1;
    this.initialized = false;

    this.onKeyDown = function(event) {
      //console.log(event.keyCode);

      if (event.keyCode === 69) {
        // e pressed
        this.activeTransformationTool = this.transformationTools.SCALE;
        $rootScope.$digest();

        this.tools.transformation.scale();
      } else if (event.keyCode === 82) {
        // r pressed
        this.activeTransformationTool = this.transformationTools.ROTATE;
        $rootScope.$digest();

        this.tools.transformation.rotate();
      } else if (event.keyCode === 84) {
        // t pressed
        this.activeTransformationTool = this.transformationTools.TRANSLATE;
        $rootScope.$digest();

        this.tools.transformation.translate();
      }
    };

    this.clear = function() {
        this.clearStandardPotreeMeasurementTool(this.tools.distance);
        this.clearStandardPotreeMeasurementTool(this.tools.area);
        this.clearStandardPotreeMeasurementTool(this.tools.angle);
        this.clearVolumes();
        this.clearProfile();
    };

    this.clearStandardPotreeMeasurementTool = function(tool) {
        tool.measurements = [];
        tool.sceneMeasurement = new THREE.Scene();
        tool.sceneRoot = new THREE.Object3D();
        tool.sceneMeasurement.add(tool.sceneRoot);
        tool.light = new THREE.DirectionalLight( 0xffffff, 1 );
        tool.light.position.set( 0, 0, 10 );
        tool.light.lookAt(new THREE.Vector3(0,0,0));
        tool.sceneMeasurement.add( tool.light );
    };

    this.clearVolumes = function() {
      this.tools.volume.volumes = [];
      this.tools.volume.sceneVolume = new THREE.Scene();
    };

    this.clearProfile = function() {
      this.tools.heightprofile.profiles = [];
      this.tools.heightprofile.sceneProfile = new THREE.Scene();
      this.tools.heightprofile.sceneRoot = new THREE.Object3D();
      this.tools.heightprofile.sceneProfile.add(this.tools.heightprofile.sceneRoot);
    };

    this.init = function(renderer, scene, camera) {
      this.tools.distance = new Potree.MeasuringTool(scene, camera, renderer);
      this.tools.angle = new Potree.MeasuringTool(scene, camera, renderer);
      this.tools.area = new Potree.MeasuringTool(scene, camera, renderer);
      this.tools.volume = new Potree.VolumeTool(scene, camera, renderer);
      this.tools.heightprofile = new Potree.ProfileTool(scene, camera, renderer);
      this.tools.transformation = new Potree.TransformationTool(scene, camera, renderer);
      // TODO do pollute global namespace, but Potree.VolumeTool uses the global var
      $window.transformationTool = this.tools.transformation;

      $window.addEventListener('keydown', this.onKeyDown.bind(this), false);
      this.initialized = true;
    };

    this.setPointcloud = function(pointcloud) {
      this.pointcloud = pointcloud;
    };

    this.setSitePointcloud = function(pointcloud) {
      this.sitePointcloud = pointcloud;
    };

    this.startDistance = function() {
      if (this.tools.distance) {
        //TODO Fix Rendering.
        this.tools.distance.startInsertion();
      }
    };

    this.startAngle = function() {
      if (this.tools.angle) {
        //TODO Fix Rendering.
        this.tools.angle.setEnabled(true);
      }
    };

    this.startArea = function() {
      if (this.tools.area) {
        //TODO Fix Rendering.
        this.tools.area.setEnabled(true);
      }
    };

    this.startVolume = function() {
      if (this.tools.volume) {
        //TODO Fix Rendering.
        this.tools.volume.startInsertion();
      }
    };

    this.startHeighProfile = function() {
      if (this.tools.heightprofile) {
        //TODO Fix Rendering.
        this.tools.heightprofile.startInsertion({
          width: this.profileWidth
        });
      }
    };

    this.startClipVolume = function() {
      if (this.tools.volume) {
        //TODO Fix Rendering.
        this.tools.volume.startInsertion({
          clip: true
        });
      }
    };

    this.render = function() {
      if (this.initialized) {
        this.tools.heightprofile.render();
        this.tools.volume.render();

        this.tools.distance.renderer.clearDepth();
        this.tools.distance.render();
        this.tools.area.render();
        this.tools.angle.render();
        this.tools.transformation.render();
      }
    };

    this.update = function() {
      if (this.initialized) {
        this.tools.volume.update();
        this.tools.transformation.update();
        this.tools.heightprofile.update();

        var clipBoxes = [];

        for (var i = 0; i < this.tools.heightprofile.profiles.length; i++) {
          var profile = this.tools.heightprofile.profiles[i];

          for (var j = 0; j < profile.boxes.length; j++) {
            var box = profile.boxes[j];
            box.updateMatrixWorld();
            var boxInverse = new THREE.Matrix4().getInverse(box.matrixWorld);
            clipBoxes.push(boxInverse);
          }
        }

        for (var k = 0; k < this.tools.volume.volumes.length; k++) {
          var volume = this.tools.volume.volumes[k];

          if (volume.clip) {
            volume.updateMatrixWorld();
            var boxInverseV = new THREE.Matrix4().getInverse(volume.matrixWorld);

            clipBoxes.push(boxInverseV);
          }
        }

        if (this.pointcloud) {
          this.pointcloud.material.setClipBoxes(clipBoxes);
        }

        if (this.sitePointcloud) {
          this.sitePointcloud.material.setClipBoxes(clipBoxes);
        }
      }
    };
  }

  angular.module('pattyApp.measuring').service('MeasuringService', MeasuringService);
})();
