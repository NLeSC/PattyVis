(function() {
  'use strict';

  function PointcloudService(THREE, Potree, POCLoader, $window, $rootScope, Messagebus, DrivemapService, sitesservice, CameraService, SceneService, PathControls, SiteBoxService, MeasuringService) {

    var me = this;

    this.elRenderArea = null;

    me.settings = {
      pointCountTarget: 1.0,
      pointSize: 0.2,
      opacity: 1,
      showSkybox: true,
      interpolate: false,
      showStats: false,
      pointSizeType: Potree.PointSizeType.ATTENUATED,
      pointSizeTypes: Potree.PointSizeType,
      pointColorType: Potree.PointColorType.RGB,
      pointColorTypes: Potree.PointColorType,
      pointShapes: Potree.PointShape,
      pointShape: Potree.PointShape.CIRCLE
    };

    me.stats = {
      nrPoints: 0,
      nrNodes: 0,
      sceneCoordinates: {
        x: 0,
        y: 0,
        z: 0
      },
      lasCoordinates: {
        x: 0,
        y: 0,
        z: 0,
        crs: 'unknown'
      }
    };

    var pointcloudPath = 'data/out_8/cloud.js';
    this.renderer = null;
    var camera;
    var scene;
    var raycaster;
    var pointcloud;
    var skybox;

	me.pathMesh = null;
    var prevCameraOrientation;

    var referenceFrame;
    var mouse = {
      x: 0,
      y: 0
    };

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

    function getMousePointCloudIntersection() {
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      var direction = vector.sub(camera.position).normalize();
      var ray = new THREE.Ray(camera.position, direction);

      var pointClouds = [];
      scene.traverse(function(object) {
        if (object instanceof Potree.PointCloudOctree) {
          pointClouds.push(object);
        }
      });

      var closestPoint = null;
      var closestPointDistance = null;

      for (var i = 0; i < pointClouds.length; i++) {
        var pointcloud = pointClouds[i];
        var point = pointcloud.pick(me.renderer, camera, ray, {
          accuracy: 0.5
        });

        if (!point) {
          continue;
        }

        var distance = camera.position.distanceTo(point.position);

        if (!closestPoint || distance < closestPointDistance) {
          closestPoint = point;
          closestPointDistance = distance;
        }
      }

      return closestPoint ? closestPoint.position : null;
    }

    function updateStats() {
      if (me.settings.showStats) {
        if (pointcloud) {
          me.stats.nrPoints = pointcloud.numVisiblePoints;
          me.stats.nrNodes = pointcloud.numVisibleNodes;
        } else {
          me.stats.nrPoints = 'none';
          me.stats.nrNodes = 'none';
        }

        var I = getMousePointCloudIntersection();
        if (I) {
          var sceneCoordinates = I;
          me.stats.sceneCoordinates.x = sceneCoordinates.x.toFixed(2);
          me.stats.sceneCoordinates.y = sceneCoordinates.y.toFixed(2);
          me.stats.sceneCoordinates.z = sceneCoordinates.z.toFixed(2);
          var geoCoordinates = toGeo(sceneCoordinates);
          me.stats.lasCoordinates.x = geoCoordinates.x.toFixed(2);
          me.stats.lasCoordinates.y = geoCoordinates.y.toFixed(2);
          me.stats.lasCoordinates.z = geoCoordinates.z.toFixed(2);
        }

        // stats are changed in requestAnimationFrame loop,
        // which is outside the AngularJS $digest loop
        // to have changes to stats propagated to angular, we need to trigger a digest
        $rootScope.$digest();
      }
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / me.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / me.renderer.domElement.clientHeight) * 2 + 1;
    }

    this.initThree = function() {

      var width = $window.innerWidth;
      var height = $window.innerHeight;


      scene = SceneService.getScene();
      camera = CameraService.camera;
      CameraService.toGeo = toGeo;

      me.renderer = new THREE.WebGLRenderer();
      me.renderer.setSize(width, height);
      me.renderer.autoClear = false;
      me.renderer.domElement.addEventListener('mousemove', onMouseMove, false);
      
      MeasuringService.init(me.renderer);

      raycaster = new THREE.Raycaster();
      raycaster.params = {
          "PointCloud" : {
              threshold : 0.1
          }
      };

      skybox = loadSkybox('bower_components/potree/resources/textures/skybox/');

      // enable frag_depth extension for the interpolation shader, if available
      me.renderer.context.getExtension('EXT_frag_depth');

      referenceFrame = new THREE.Object3D();

      SiteBoxService.listenTo(me.renderer.domElement);

      DrivemapService.load().then(this.loadPointcloud);
    };

    this.loadPointcloud = function() {
      // load pointcloud
      pointcloudPath = DrivemapService.getPointcloudUrl();
      me.stats.lasCoordinates.crs = DrivemapService.getCrs();

      POCLoader.load(pointcloudPath, function(geometry) {
        pointcloud = new Potree.PointCloudOctree(geometry);

        pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        pointcloud.material.size = me.settings.pointSize;
        pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;

        referenceFrame.add(pointcloud);
        referenceFrame.updateMatrixWorld(true); // doesn't seem to do anything
        // reference frame position to pointcloud position:
        referenceFrame.position.set(-pointcloud.position.x, -pointcloud.position.y, 0);
        // rotates to some unknown orientation:
        referenceFrame.updateMatrixWorld(true);
        // rotates point cloud to align with horizon
        referenceFrame.applyMatrix(new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 0, 1, 0,
          0, -1, 0, 0,
          0, 0, 0, 1
        ));
        referenceFrame.updateMatrixWorld(true);
        scene.add(referenceFrame);

        var myPath = DrivemapService.getCoordinates().map(
          function(coord) {
            return toLocal(new THREE.Vector3(coord[0], coord[1], coord[2]));
          }
        );

        PathControls.init(camera, myPath, me.renderer.domElement);

		me.pathMesh = PathControls.createPath();
		scene.add(me.pathMesh);
		me.pathMesh.visible = false; // disabled by default

      });



    };


    this.loadSiteBoxes = function() {
      for (var ix=0; ix < SiteBoxService.siteBoxList.length; ix++) {
        referenceFrame.add(SiteBoxService.siteBoxList[ix]);
      }
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

    function addTextLabel(message, x, y, z) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      // context.font = "Bold " + fontsize + "px " + fontface;

      // get size data (height depends only on font size)
      // var metrics = context.measureText(message);

      // background color
      // context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g +
      // ","
      // + backgroundColor.b + "," + backgroundColor.a + ")";

      // context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
      // + borderColor.b + "," + borderColor.a + ")";

      // context.lineWidth = borderThickness;
      // roundRect(context, borderThickness/2, borderThickness/2, textWidth +
      // borderThickness, fontsize * 1.4 + borderThickness, 6);
      // 1.4 is extra height factor for text below baseline: g,j,p,q.

      // text color
      // context.fillStyle = "rgba(0, 0, 0, 1.0)";

      // context.fillText( message, borderThickness, fontsize + borderThickness);

      var imageObj = new Image();
      imageObj.onload = function() {
        context.drawImage(imageObj, 10, 10);
        context.font = '40pt Calibri';
        context.fillText(message, 30, 70);
        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          useScreenCoordinates: false,
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        // sprite.scale.set(100,50,1.0);
        sprite.scale.set(10, 5, 1.0);

        sprite.position.set(x, y, z);
        referenceFrame.add(sprite);
      };
      imageObj.src = 'data/label-small.png';
    }

    this.goHome = function() {
      var locationGeo = DrivemapService.getHomeLocation();
      var lookAtGeo = DrivemapService.getHomeLookAt();
      var locationLocal = toLocal(locationGeo);
      var lookAtLocal = toLocal(lookAtGeo);

      camera.position.set(locationLocal.x, locationLocal.y, locationLocal.z);

      camera.lookAt(lookAtLocal);
    };

    this.lookAtSite = function(site) {
      var coordGeo = sitesservice.centerOfSite(site);
      var posGeo = new THREE.Vector3(coordGeo[0], coordGeo[1], coordGeo[2]);
      var posLocal = toLocal(posGeo);
      camera.lookAt(posLocal);
      var camPos = posLocal.clone().setY(posLocal.y + 20);
      camera.position.copy(camPos);
    };

    this.showLabel = function(site) {
      var message = site.properties.description;
      var coordGeo = sitesservice.centerOfSite(site);
      var posGeo = new THREE.Vector3(coordGeo[0], coordGeo[1], coordGeo[2] + 10);
      var posLocal = toLocal(posGeo);
      addTextLabel(message, posLocal.x, -posLocal.z, posLocal.y);
    };

    this.updateMapFrustum = function() {
      var aspect = camera.aspect;
      var top = Math.tan(THREE.Math.degToRad(camera.fov * 0.5)) * camera.near;
      var bottom = -top;
      var left = aspect * bottom;
      var right = aspect * top;

      var camPos = new THREE.Vector3(0, 0, 0);
      left = new THREE.Vector3(left, 0, -camera.near).multiplyScalar(3000);
      right = new THREE.Vector3(right, 0, -camera.near).multiplyScalar(3000);
      camPos.applyMatrix4(camera.matrixWorld);
      left.applyMatrix4(camera.matrixWorld);
      right.applyMatrix4(camera.matrixWorld);

      camPos = toGeo(camPos);
      left = toGeo(left);
      right = toGeo(right);

      Messagebus.publish('cameraMoved', {
        cam: camPos,
        left: left,
        right: right
      });
    };

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

      PathControls.updateInput();

      // create hash for camera state
      var cameraOrientation = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorld).determinant();
      if (cameraOrientation !== prevCameraOrientation) {
        this.updateMapFrustum();
      }
      // compare current camera state with state in previous render loop
      prevCameraOrientation = cameraOrientation;
      updateStats();
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
      CameraService.camera.position.copy(camera.position);

      SiteBoxService.siteBoxSelection(mouse.x, mouse.y, raycaster);

      // render scene
      me.renderer.render(scene, camera);

	  MeasuringService.render();
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

    $rootScope.$watch(function() {
      return SiteBoxService.siteBoxList;
    }, this.loadSiteBoxes);

  }

  angular.module('pattyApp.pointcloud')
    .service('PointcloudService', PointcloudService);
})();
