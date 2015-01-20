'use strict';

describe('pointcloud.CameraService', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));

  var service;
  var THREE;
  beforeEach(function() {
    inject(function($injector) {
      service = $injector.get('CameraService');
      THREE = $injector.get('THREE');
    });
  });

  describe('recordLocation() function', function() {
    it('should record current camera location to waypoint array', function() {
      service.camera = {};
      service.camera.position = new THREE.Vector3(1, 2, 3);

      service.recordLocation();

      var expected = new THREE.Vector3(1, 2, 3);
      var lastWaypoint = service.waypoints[service.waypoints.length - 1];
      expect(lastWaypoint).toEqual(expected);
    });
  });

});
