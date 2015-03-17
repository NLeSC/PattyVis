(function() {
  'use strict';

  function CamFrustrumService(ol, proj4, DrivemapService) {
    var olProjectionCode = 'EPSG:3857';
    var siteProjectionCode = null;

    DrivemapService.ready.then(function() {
      siteProjectionCode = DrivemapService.getCrs();
    });

    this.camFrustum = new ol.geom.LineString([
      [0, 0],
      [0, 0]
    ]);
    this.featureVector = new ol.source.Vector({
      features: [new ol.Feature(this.camFrustum)]
    });
    this.layer = new ol.layer.Vector({
      source: this.featureVector,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#000000',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({
            color: '#000000'
          })
        })
      })
    });

    this.onCameraMove = function(frustrum) {
      var camPos = proj4(siteProjectionCode, olProjectionCode, [
        frustrum.cam.x, frustrum.cam.y
      ]);
      var left = proj4(siteProjectionCode, olProjectionCode, [
        frustrum.left.x, frustrum.left.y
      ]);
      var right = proj4(siteProjectionCode, olProjectionCode, [
        frustrum.right.x, frustrum.right.y
      ]);
      this.camFrustum.setCoordinates([camPos, left, right, camPos]);
    };
  }

  angular.module('pattyApp.minimap')
    .service('CamFrustrumService', CamFrustrumService);
})();
