(function() {
  'use strict';

  function MinimapController($scope, ol, proj4, sitesservice) {
    var me = this;
    this.sitesservice = sitesservice;

    var mapEnabled = true;

    proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
    proj4.defs('urn:ogc:def:crs:EPSG::32633', proj4.defs('EPSG:32633'));

    var olProjectionCode = 'EPSG:3857';
    var siteProjectionCode = 'EPSG:32633';
    var siteProjection = ol.proj.get(siteProjectionCode);
    var siteStyle =  new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'yellow',
        width: 10
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.1)'
      })
    });

    function centerMap(center) {
      map.getView().setCenter(ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'));
    }

    function centerOnVisibleSites() {
      map.getView().fitExtent(vectorSource.getExtent(), map.getSize());
    }


    var vectorSource = new ol.source.GeoJSON({
      projection: olProjectionCode
    });


    this.onSitesChanged = function(filtered) {
      var featuresArray = vectorSource.readFeatures(filtered);
      vectorSource.clear();
      vectorSource.addFeatures(featuresArray);
      centerOnVisibleSites();
    };

    $scope.$watch(function() {
      return me.siteservice.filtered;
    }, this.onSitesChanged);


    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: siteStyle
    });

    var mapType1 = new ol.source.MapQuest({layer: 'sat'});
    var mapType2 = new ol.source.TileWMS({
      url: 'http://maps.opengeo.org/geowebcache/service/wms',
      params: {LAYERS: 'openstreetmap', VERSION: '1.1.1'}
    });
    var mapType3 = new ol.source.TileWMS({
      url: 'http://maps.opengeo.org/geowebcache/service/wms',
      params: {LAYERS: 'bluemarble', VERSION: '1.1.1'}
    });
    var mapType4 = new ol.source.MapQuest({layer: 'osm'});

    var rasterLayer = new ol.layer.Tile({
      source: mapType4
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

      setCameraLocation(coord4326);

      console.log('EPSG:3857 (openlayers)\nx: '+ lat + '\ny: ' + lon +
      '\nESPG:4326 (google)\nx: ' + lat4326 +
      '\ny: ' + lon4326 + '\nEPSG:32633 (drivemap)\nx: ' + lat32633 +
      '\ny: ' + lon32633);
    });

    function toggleMap() {
      mapEnabled = !mapEnabled;
      console.log('toggleMap: '+mapEnabled);
      if (mapEnabled) {
        document.getElementById('overhead-map').style.visibility = 'visible';
      } else {
        document.getElementById('overhead-map').style.visibility = 'hidden';
      }
    }



  }

  angular.module('pattyApp.minimap')
  .controller('MinimapController', MinimapController);
})();
