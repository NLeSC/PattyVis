(function() {
  'use strict';

  function SiteLoaderService($http, THREE) {
    var me = this;
    this.url = 'data/sites.json';
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
    
    this.findFeatureByID = function(id) {
        for (var i = 0; i < this.data.features.length; i++) {
            if (this.data.features[i].id === id) {
                return this.data.features[i];
            }
        }
    };

    this.getMeshUrl = function(siteID) {
        return this.findFeatureByID(siteID).properties.mesh;
    };

    this.getMeshMtlUrl = function(siteID) {
        return this.findFeatureByID(siteID).properties.meshMtl;
    };
    
    this.getReconstructionMeshUrl = function(siteID) {
        return this.findFeatureByID(siteID).properties.reconstructionMesh;
    };
    
    this.getReconstructionScale = function(siteID) {
        return this.findFeatureByID(siteID).properties.reconstructionScale;
    };

    this.getPointcloudUrl = function(siteID) {
        return this.findFeatureByID(siteID).properties.pointcloud;
    };
    
    this.getCoordinates = function(siteID) {        
        return this.findFeatureByID(siteID).properties.coordinates;
    };
    
    this.getBbox = function(siteID) {
        return this.findFeatureByID(siteID).bbox;
    };
    
    this.getCrs = function() {
      return this.data.crs.properties.name;
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('SiteLoaderService', SiteLoaderService);
})();
