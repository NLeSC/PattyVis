(function() {
  'use strict';

  function PointcloudService(THREE, Potree, POCLoader, $window) {
    var me = this;
    this.elRenderArea = null;

    me.settings = {
      pointCountTarget: 0.4,
      pointSize: 0.7,
      opacity: 1,
      showSkybox: true,
      interpolate: false,
      pointSizeType: Potree.PointSizeType.ADAPTIVE,
      pointSizeTypes: Potree.PointSizeType,
      pointColorType: Potree.PointColorType.RGB,
      pointColorTypes: Potree.PointColorType,
      pointShapes: Potree.PointShape,
      pointShape: Potree.PointShape.CIRCLE
    };


    var pointcloudPath = 'data/out_8/cloud.js';
    this.renderer = null;
    var camera;
    var scene;
    var pointcloud;
    var skybox;
    var clock = new THREE.Clock();
    var controls;
    var referenceFrame;

    function loadSkybox(path) {
      var camera = new THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 1, 100000);
      var scene = new THREE.Scene();

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

        }),

        mesh = new THREE.Mesh(new THREE.BoxGeometry(100000, 100000, 100000), material);
      scene.add(mesh);

      return {
        'camera': camera,
        'scene': scene
      };
    }

    this.initThree = function() {
      var fov = 75;
      var width = $window.innterWidth;
      var height = $window.innerHeight;
      var aspect = width / height;
      var near = 0.1;
      var far = 100000;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      me.renderer = new THREE.WebGLRenderer();
      me.renderer.setSize(width, height);
      me.renderer.autoClear = false;

      skybox = loadSkybox('bower_components/potree/resources/textures/skybox/');
      // camera and controls
      controls = new THREE.FirstPersonControls(camera, me.renderer.domElement);
      camera.rotation.order = 'ZYX';
      controls.moveSpeed *= 10;
      camera.position.set(256.8, 164.5, -2093.8);
      camera.lookAt(new THREE.Vector3(301.8, 150.3, -2059.6));

      // enable frag_depth extension for the interpolation shader, if available
      me.renderer.context.getExtension('EXT_frag_depth');

      referenceFrame = new THREE.Object3D();

      // load pointcloud
      POCLoader.load(pointcloudPath, function(geometry) {
        pointcloud = new Potree.PointCloudOctree(geometry);

        pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        pointcloud.material.size = me.settings.pointSize;
        pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;

        referenceFrame.add(pointcloud);
        referenceFrame.updateMatrixWorld(true);

        referenceFrame.position.set(-pointcloud.position.x, -pointcloud.position.y, 0);

        referenceFrame.updateMatrixWorld(true);
        referenceFrame.applyMatrix(new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 0, 1, 0,
          0, -1, 0, 0,
          0, 0, 0, 1
        ));
        scene.add(referenceFrame);
      });

    };

    /**
     * transform from geo coordinates to local scene coordinates
     */
    function toLocal(position) {
      var scenePos = position.clone().applyMatrix4(referenceFrame.matrixWorld);
      return scenePos;
    }

    /**
     * transform from local scene coordinates to geo coordinates
     */
    function toGeo(object) {
      var geo;
      var inverse = new THREE.Matrix4().getInverse(referenceFrame.matrixWorld);

      if (object instanceof THREE.Vector3) {
        geo = object.clone().applyMatrix4(inverse);
      } else if (object instanceof THREE.Box3) {
        var geoMin = object.min.clone().applyMatrix4(inverse);
        var geoMax = object.max.clone().applyMatrix4(inverse);
        geo = new THREE.Box3(geoMin, geoMax);
      }

      return geo;
    }

    this.update = function() {
      if (pointcloud) {
        pointcloud.material.size = me.settings.pointSize;
        pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
        pointcloud.material.opacity = me.settings.opacity;
        pointcloud.material.pointSizeType = me.settings.pointSizeType;
        pointcloud.material.pointColorType = me.settings.pointColorType;
        pointcloud.material.pointShape = me.settings.pointShape;
        pointcloud.material.interpolate = me.settings.interpolate;
        pointcloud.material.heightMin = 0;
        pointcloud.material.heightMax = 8;
        pointcloud.material.intensityMin = 0;
        pointcloud.material.intensityMax = 65000;

        pointcloud.update(camera, me.renderer);

      }

      controls.update(clock.getDelta());
    };

    this.render = function() {
      // resize
      var width = $window.innerWidth;
      var height = $window.innerHeight;
      var aspect = width / height;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      me.renderer.setSize(width, height);


      // render skybox
      if (me.settings.showSkybox) {
        skybox.camera.rotation.copy(camera.rotation);
        me.renderer.render(skybox.scene, skybox.camera);
      }

      // render scene
      me.renderer.render(scene, camera);
    };

    this.loop = function() {
      requestAnimationFrame(me.loop);

      me.update();
      me.render();
    };

    this.attachCanvas = function(el) {
      me.elRenderArea = el;
      me.initThree();
      var canvas = me.renderer.domElement;
      el.appendChild(canvas);
      me.loop();
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('PointcloudService', PointcloudService);
})();
