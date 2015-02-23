(function() {
  'use strict';

  function DrivemapService($http, $q, proj4) {
    var me = this;
    this.url = 'data/drivemap.json';
    this.data = {};
    var deferred = $q.defer();

    this.ready = deferred.promise;

    this.load = function() {
      return $http.get(this.url).success(this.onLoad).error(this.onLoadFailure);
    };

    this.onLoad = function(response) {
      me.data = response;

      // TODO read from response
      proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
      proj4.defs('urn:ogc:def:crs:EPSG::32633', proj4.defs('EPSG:32633'));

      console.log('drivemap service onload');

      deferred.resolve(response);
    };

    this.onLoadFailure = function() {
      console.log('Failed to load drive map!!');
      deferred.reject.apply(this, arguments);
    };

    this.getCoordinate = function(index) {
      var coords = this.getCoordinates()[index];
      return coords;
    };

    this.getHomeLocation = function() {
      return this.getCoordinate(0);
    };

    this.getHomeLookAt = function() {
      return this.getCoordinate(1);
    };

    this.getPointcloudUrl = function() {
      return this.data.features[0].properties.pointcloud;
    };
    this.getCoordinates = function() {
      return this.data.features[0].geometry.coordinates;
    };
    this.getLookPath = function() {
      return this.data.features[0].geometry.lookatpath;
    };
    this.getCrs = function() {
      return this.data.crs.properties.name;
    };
  }

  angular.module('pattyApp.core')
    .service('DrivemapService', DrivemapService);
})();
