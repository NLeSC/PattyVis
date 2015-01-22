(function() {
  'use strict';

  function SitePointcloudService($http, THREE) {
    var me = this;
    this.url = 'data/sites.json';
    this.data = {};
    this.siteID = '';

    this.load = function(siteID) {
      me.siteID = siteID; 
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
      for (var i = 0; i < this.data.features.length; i++) {
          if (this.data.features[i].id == me.siteID) {
              return this.data.features[i].properties.pointcloud
          }
      }
    };
    
    this.getCoordinates = function() {        
        for (var i = 0; i < this.data.features.length; i++) {
          if (this.data.features[i].id == me.siteID) {
            return this.data.features[i].geometry.coordinates;
          }
        }
    };
    
    this.getCrs = function() {
      return this.data.crs.properties.name;
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('SitePointcloudService', SitePointcloudService);
})();
