'use strict';

describe('pointcloud.CameraService', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));

  var service;
  var THREE;
  var SceneService;
  beforeEach(function() {
    inject(function(_CameraService_, _THREE_, _SceneService_) {
      service = _CameraService_;
      THREE = _THREE_;
      SceneService = _SceneService_;
      SceneService.toGeo = function(d) {
        return d.negate();
      };
    });
  });

  describe('recordLocation() function', function() {
    it('should record current camera location to waypoint array', function() {
      service.camera = {};
      service.camera.position = new THREE.Vector3(1, 2, 3);

      service.recordLocation();

      var expected = [-1, -2, -3];
      var lastWaypoint = service.waypoints[service.waypoints.length - 1];
      expect(lastWaypoint).toEqual(expected);
    });
  });

  describe('update() function', function() {
    var listener, unsubscriber;
    beforeEach(function() {
      inject(function(Messagebus) {
        listener = jasmine.createSpy('listener');
        unsubscriber = Messagebus.subscribe('cameraMoved', listener);
      });
    });

    afterEach(function() {
      unsubscriber();
    });

    it('should publish "cameraMoved" message with camera 2d frustrum when camera has rotated', function() {
      service.camera.lookAt(new THREE.Vector3(1, 1, 1));
      service.camera.updateMatrixWorld();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '{"cam":{"x":0,"y":0,"z":0},"left":{"x":-390.23792056875243,"y":-173.2050808846806,"z":43.82776527242672},"right":{"x":43.82776527242672,"y":-173.20507441164509,"z":-390.23792056875243}}';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should publish "cameraMoved" message with camera 2d frustrum when camera has zoomed in', function() {
      service.camera.fov = 50;
      service.camera.updateProjectionMatrix();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '{"cam":{"x":0,"y":0,"z":0},"left":{"x":186.52306326199943,"y":0,"z":300},"right":{"x":-186.52306326199943,"y":0,"z":300}}';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should not publish "cameraMoved" message when camera has not changed orientation', function() {
      service.update();

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
