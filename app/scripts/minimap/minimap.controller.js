(function() {
  'use strict';

  function MinimapController(ol, proj4, SitesService, CamFrustumService, Messagebus, DrivemapService) {
    var me = this;

    var olProjectionCode = 'EPSG:3857';
    var siteProjectionCode = null;

    var vectorSource = new ol.source.GeoJSON({
      projection: olProjectionCode
    });

    var siteStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'yellow',
        width: 10
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.1)'
      })
    });

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

    this.map = new ol.Map({
      layers: [rasterLayer, vectorLayer],
      view: new ol.View({
        center: ol.proj.transform([12.5469185, 41.8286509], 'EPSG:4326', 'EPSG:3857'),
        zoom: 17
      })
    });

    var syncSiteProjectionCode = function() {
      siteProjectionCode = DrivemapService.getCrs();
    };

    DrivemapService.ready.then(syncSiteProjectionCode);

    this.sites2GeoJSON = function(sites) {
      var features = sites.filter(function(site) {
        return 'footprint' in site;
      }).map(function(site) {
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

    this.centerOnVisibleSites = function() {
      var sitesExtent = vectorSource.getExtent();
      me.fitMapToExtent(sitesExtent);
    };

    this.onSitesChanged = function(filtered) {
      var geojson = me.sites2GeoJSON(filtered);
      var featuresArray = vectorSource.readFeatures(geojson);
      vectorSource.clear();
      vectorSource.addFeatures(featuresArray);
      me.centerOnVisibleSites();
    };

    this.sitesChangedListener = function() {
      var sites = SitesService.filtered;
      me.onSitesChanged(sites);
    };

    Messagebus.subscribe('sitesChanged', this.sitesChangedListener);

    this.onMapRightclick = function(event) {
      console.log('right clicked on the map!');
      event.preventDefault();

      return false;
    };

    this.map.on('rightclick', this.onMapRightclick);

    // TODO set initial location for the map
    // TODO toggle map on/of

    // setup click on a site
    var selectClick = new ol.interaction.Select({
      condition: ol.events.condition.click,
      layers: [vectorLayer],
      style: siteStyle
    });
    this.onFeatureClick = function(event) {
      var feature = event.target.item(0);
      var site = SitesService.getById(feature.getId());
      SitesService.selectSite(site);
    };
    selectClick.getFeatures().on('add', this.onFeatureClick);
    this.map.addInteraction(selectClick);


    this.map.addLayer(CamFrustumService.layer);

    this.fitMapToExtent = function(extent) {
      var mapSize = me.map.getSize();
      me.map.getView().fitExtent(extent, mapSize);
    };

    // Possible improvement: http://stackoverflow.com/a/26381201
    this.fitMapToFrustrumAndSearchedSites = function(event, frustum) {
      CamFrustumService.onCameraMove(frustum);
      var frustumExtent = CamFrustumService.getExtent();
      if (SitesService.searched) { // searched sites exist
        var sitesExtent = vectorSource.getExtent();
        var combinedExtent = [Math.min(sitesExtent[0], frustumExtent[0]),
          Math.min(sitesExtent[1], frustumExtent[1]),
          Math.max(sitesExtent[2], frustumExtent[2]),
          Math.max(sitesExtent[3], frustumExtent[3])
        ];
        me.fitMapToExtent(combinedExtent);
      } else { // no searched sites
        me.fitMapToExtent(frustumExtent);
      }
    };

    Messagebus.subscribe('cameraMoved', this.fitMapToFrustrumAndSearchedSites);
  }

  angular.module('pattyApp.minimap')
    .controller('MinimapController', MinimapController);
})();
