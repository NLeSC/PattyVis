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
      title: 'Sites',
      source: vectorSource,
      style: siteStyle
    });

    var transparentOverlays = new ol.layer.Group({
      'title': 'Overlay maps',
      layers: [
        new ol.layer.Tile({
          title: 'Canina Tavola XXXII',
          visible: false,
          opacity: 0.7,
          source: new ol.source.TileWMS(({
            url: 'http://54.228.203.57:6080/arcgis/services/VIA_APPIA/Historical_maps_Via_Appia/MapServer/WMSServer',
            params: {'LAYERS': 0, 'TRANSPARENT' : true, 'TILED': true}
          }))
        }),
        new ol.layer.Tile({
          title: 'P1050526editCUT3',
          visible: false,
          opacity: 0.7,
          source: new ol.source.TileWMS(({
            url: 'http://54.228.203.57:6080/arcgis/services/VIA_APPIA/Historical_maps_Via_Appia/MapServer/WMSServer',
            params: {'LAYERS': 2, 'TRANSPARENT' : true, 'TILED': true}
          }))
        }),
        new ol.layer.Tile({
          title: 'Pinza',
          visible: false,
          opacity: 0.7,
          source: new ol.source.TileWMS(({
            url: 'http://54.228.203.57:6080/arcgis/services/VIA_APPIA/Historical_maps_Via_Appia/MapServer/WMSServer',
            params: {'LAYERS': 3, 'TRANSPARENT' : true, 'TILED': true}
          }))
        })
      ]
    });

    var baseLayers = new ol.layer.Group({
      'title': 'Base maps',
      layers: [
        new ol.layer.Tile({
          title: 'MapQuest',
          type: 'base',
          visible: true,
          source: new ol.source.MapQuest({
            layer: 'osm'
          })
        }),
        new ol.layer.Tile({
          title: 'Water color',
          type: 'base',
          visible: false,
          source: new ol.source.Stamen({
            layer: 'watercolor'
          })
        }),
        new ol.layer.Tile({
          title: 'OSM',
          type: 'base',
          visible: false,
          source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
          title: 'Satellite',
          type: 'base',
          visible: false,
          source: new ol.source.MapQuest({
            layer: 'sat'
          })
        })
      ]
    });

    var overlayLayers = new ol.layer.Group({
      title: 'Overlays',
      layers: [
        vectorLayer, transparentOverlays
      ]
    });

    this.map = new ol.Map({
      layers: [baseLayers, overlayLayers],
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

    // TODO set initial location for the map
    // TODO toggle map on/of

    // setup click on a site
    this.onFeatureClick = function(event) {
      var feature = event.target.item(0);
      var site = SitesService.getById(feature.getId());
      SitesService.selectSite(site);
    };
    this.setupSiteClick = function() {
      var selectClick = new ol.interaction.Select({
        condition: ol.events.condition.click,
        layers: [vectorLayer],
        style: siteStyle
      });
      selectClick.getFeatures().on('add', this.onFeatureClick);
      this.map.addInteraction(selectClick);
    };
    this.setupSiteClick();

    this.onSiteHover = function(feature) {
      var text = feature.getId().toString();
      var siteHightlightedStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#276BE7',
          width: 10
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 0, 0.1)'
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          text: text,
          fill: new ol.style.Fill({
            color: '#ccc'
          }),
          stroke: new ol.style.Stroke({
            color: '#276BE7',
            width: 3
          })
        })
      });
      return [siteHightlightedStyle];
    };

    this.setupSiteHover = function() {
      var siteHover = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers: [vectorLayer],
        style: this.onSiteHover
      });
      this.map.addInteraction(siteHover);
    };
    this.setupSiteHover();

    this.setupResizeControl = function() {
      function ResizeControl(optOptions) {
        var options = optOptions || {};

        var button = document.createElement('button');
        button.innerHTML = '<span class="glyphicon glyphicon-resize-full"></span>';

        var this_ = this;
        var maximized = false;
        var clickOnResize = function() {
          maximized = !maximized;

          if (maximized) {
            this_.getMap().getTarget().classList.add('big-minimap');
            button.innerHTML = '<span class="glyphicon glyphicon-resize-small"></span>';
          } else {
            this_.getMap().getTarget().classList.remove('big-minimap');
            button.innerHTML = '<span class="glyphicon glyphicon-resize-full"></span>';
          }
          this_.getMap().updateSize();
          me.centerOnVisibleSites();
        };

        button.addEventListener('click', clickOnResize, false);
        button.addEventListener('touchstart', clickOnResize, false);

        var element = document.createElement('div');
        element.className = 'resize-minimap ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
          element: element,
          target: options.target
        });
      }
      ol.inherits(ResizeControl, ol.control.Control);

      this.map.addControl(new ResizeControl());
    };
    this.setupResizeControl();

    var layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Legend'
    });
    this.map.addControl(layerSwitcher);

    this.map.addLayer(CamFrustumService.layer);

    this.fitMapToExtent = function(extent) {
      var mapSize = me.map.getSize();
      me.map.getView().fitExtent(extent, mapSize);
    };

    // Possible improvement: http://stackoverflow.com/a/26381201
    this.fitMapToFrustrumAndSearchedSites = function(event, frustum) {
      CamFrustumService.onCameraMove(frustum);

      //Disabled because the interaction was better without this -- Maarten
      /*
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
      */
    };

    Messagebus.subscribe('cameraMoved', this.fitMapToFrustrumAndSearchedSites);
  }

  angular.module('pattyApp.minimap')
    .controller('MinimapController', MinimapController);
})();
