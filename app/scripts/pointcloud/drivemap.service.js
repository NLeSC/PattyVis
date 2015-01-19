(function() {
  'use strict';

  function DrivemapService($http, THREE) {
    var me = this;
    this.url = 'data/drivemap.json';
    this.data = {};

    this.load = function() {
      return $http.get(this.url).success(this.onLoad).error(this.onLoadFailure);
    };

    this.onLoad = function(response) {
      me.data = response;
    };

    this.onLoadFailure = function() {
      console.log('Failed to load drive map!!');
    };

    this.getHomeLocation = function() {
      var coords = this.getCoordinates()[0];

      return new THREE.Vector3(coords[0], coords[1], coords[2]);
    };

    this.getHomeLookAt = function() {
      var coords = this.getCoordinates()[1];

      return new THREE.Vector3(coords[0], coords[1], coords[2]);
    };

    this.getPointcloudUrl = function() {
      return this.data.features[0].properties.pointcloud;
    };
    this.getCoordinates = function() {
      return this.data.features[0].geometry.coordinates;
    };
    this.getCrs = function() {
      return this.data.crs.properties.name;
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('DrivemapService', DrivemapService);
})();
