(function() {
  'use strict';

  function MinimapController($scope, ol, proj4, sitesservice, CamFrustrumService, Messagebus) {
    var me = this;
    this.sitesservice = sitesservice;

    proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
    proj4.defs('urn:ogc:def:crs:EPSG::32633', proj4.defs('EPSG:32633'));

    var olProjectionCode = 'EPSG:3857';
    var siteProjectionCode = 'EPSG:32633';
    var siteStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'yellow',
        width: 10
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.1)'
      })
    });

    function centerOnVisibleSites() {
      map.getView().fitExtent(vectorSource.getExtent(), map.getSize());
    }

    var vectorSource = new ol.source.GeoJSON({
      projection: olProjectionCode
    });

    this.sites2GeoJSON = function(sites) {
      var features = sites.map(function(site) {
        return {
          'type': 'Feature',
          'id': site.id,
          'geometry': {
            'type': 'MultiPolygon',
            'coordinates': site.footprint
          }
        };
      });

      return {
        'type': 'FeatureCollection',
        'features': features,
        'crs': {
          'type': 'name',
          'properties': {
            'name': siteProjectionCode
          }
        }
      };
    };

    this.onSitesChanged = function(filtered) {
      var geojson = me.sites2GeoJSON(filtered);
      var featuresArray = vectorSource.readFeatures(geojson);
      vectorSource.clear();
      vectorSource.addFeatures(featuresArray);
      centerOnVisibleSites();
    };

    $scope.$watch(function() {
      return me.sitesservice.filtered;
    }, this.onSitesChanged);


    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: siteStyle
    });

    var mapType = new ol.source.MapQuest({
      layer: 'osm'
    });

    var rasterLayer = new ol.layer.Tile({
      source: mapType
    });

    var map = new ol.Map({
      layers: [rasterLayer, vectorLayer],
      view: new ol.View({
        center: ol.proj.transform([12.5469185, 41.8286509], 'EPSG:4326', 'EPSG:3857'),
        zoom: 17
      })
    });
    this.map = map;
    map.on('rightclick', function(event) {
      event.preventDefault();

      return false;
    });

    // TODO set initial location for the map
    // TODO toggle map on/of

    // listen on map click
    map.on('click', function(event) {

      // EPSG:3857 (strange internal OpenLayers lat/lon units)
      var lat = event.coordinate[0];
      var lon = event.coordinate[1];
      // EPSG:4326 'normal' lat/long:
      var coord4326 = ol.proj.transform([lat, lon], 'EPSG:3857', 'EPSG:4326');
      var lat4326 = coord4326[0];
      var lon4326 = coord4326[1];
      // EPSG:32633 laz coordinate system:
      var coord32633 = proj4('EPSG:3857', siteProjectionCode, [lat, lon]);
      var lat32633 = coord32633[0];
      var lon32633 = coord32633[1];

      console.log('EPSG:3857 (openlayers)\nx: ' + lat + '\ny: ' + lon +
        '\nESPG:4326 (google)\nx: ' + lat4326 +
        '\ny: ' + lon4326 + '\nEPSG:32633 (drivemap)\nx: ' + lat32633 +
        '\ny: ' + lon32633);
    });

    map.addLayer(CamFrustrumService.layer);

    Messagebus.subscribe('cameraMoved', function(event, frustrum) {
      CamFrustrumService.onCameraMove(frustrum);
      map.getView().fitExtent(CamFrustrumService.featureVector.getExtent(), map.getSize());
    });


  }

  angular.module('pattyApp.minimap')
    .controller('MinimapController', MinimapController);
})();
