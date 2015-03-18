(function() {
  'use strict';

  function SceneService(THREE) {
    this.scene = new THREE.Scene();
    this.referenceFrame = new THREE.Object3D();
    this.scene.add(this.referenceFrame);

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

    this.loadSkybox = function(path) {
      var format = '.jpg';
      var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
      ];

      var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());

      var shader = THREE.ShaderLib.cube;
      shader.uniforms.tCube.value = textureCube;

      var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });

      return new THREE.Mesh(new THREE.BoxGeometry(100000, 100000, 100000), material);
    };

    this.skybox = this.loadSkybox('bower_components/potree/resources/textures/skybox/');
    this.scene.add(this.skybox);
  }

  angular.module('pattyApp.renderer').service('SceneService', SceneService);
})();
