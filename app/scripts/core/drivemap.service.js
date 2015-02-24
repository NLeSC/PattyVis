(function() {
  'use strict';

  function DrivemapService($http, $q, $log, proj4) {
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

      me.registerProj4();

      deferred.resolve(response);
    };

    this.onLoadFailure = function() {
      $log.log('Failed to load drive map!!');
      deferred.reject.apply(this, arguments);
    };

    /**
     * The drivemap is in a coordinate system.
     * The coordinate system label is the crs.
     * The proj4 definition is the proj4 property of the first feature.
     */
    this.registerProj4 = function() {
      proj4.defs(this.getCrs(), this.data.features[0].properties.proj4);
    };

    this.getPointcloudUrl = function() {
      return this.data.features[0].properties.pointcloud;
    };
    this.getCameraPath = function() {
      return this.data.features[0].geometry.coordinates;
    };
    this.getLookPath = function() {
      return this.data.features[0].properties.lookatpath;
    };
    this.getCrs = function() {
      return this.data.crs.properties.name;
    };
  }

  angular.module('pattyApp.core')
    .service('DrivemapService', DrivemapService);
})();
