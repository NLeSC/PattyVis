function centerMap(center) {
  map.getView().setCenter(ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'));
}

// function takes features array
function plotMarkers(featuresArray) {
  // first remove old ones
  var oldFeatures = vectorSource.getFeatures();
  function removeMarker(m) {
    vectorSource.removeFeature(m);
  }
  oldFeatures.forEach(removeMarker);

  // then add new ones
  vectorSource.addFeatures(featuresArray);
}


var vectorSource = new ol.source.GeoJSON(
    /** @type {olx.source.GeoJSONOptions} */ ({
      object: {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [12.5464756318, 41.829304, 130]
          },
          "id": 162,
          "properties": {
            "pointcloud": "data/sites/162/cloud_las.js",
            "description": "Pyramid",
            "thumbnail": "data/sites/162/P1120067.JPG",
            "site_context": "Funerary",
            "site_interpretation": "Funerary tower",
            "condition": "Damaged"
          },
          "bbox": [12.546372, 41.829228, 121.484, 12.546579, 41.829381, 144.177]
        }, {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [12.546488, 41.828926, 120.21]
          },
          "id": 13,
          "properties": {
            "pointcloud": "data/sites/13/cloud_las.js",
            "description": "Block",
            "thumbnail": "data/sites/13/IMG_0040.JPG",
            "site_context": "Unknown",
            "site_interpretation": "Unknown",
            "condition": "Chipped"
          },
          "bbox":[12.546479, 41.828919, 120, 12.546497, 41.828934, 120.42]
        }],
        "crs": {
          "type":"name",
          "properties": {
              "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
              // "name": "EPSG:3857"
          }
        }
      },
    projection: 'EPSG:3857'
    }));


var vectorLayer = new ol.layer.Vector({
  source: vectorSource
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
  target: document.getElementById('overhead-map'),
  view: new ol.View({
    center: ol.proj.transform([12.5469185, 41.8286509], 'EPSG:4326', 'EPSG:3857'),
    zoom: 10
  })
});

// listen on map click
map.on('click', function(event) {
    // EPSG:3857 (strange internal OpenLayers lat/lon units)
    var lat = event.coordinate[0];
    var lon = event.coordinate[1];
    // EPSG:4326 "normal" lat/long:
    var coord_4326 = ol.proj.transform([lat, lon], 'EPSG:3857', 'EPSG:4326');
    var lat_4326 = coord_4326[0];
    var lon_4326 = coord_4326[1];
    // EPSG:32633 laz coordinate system:
    var coord_32633 = proj4('EPSG:3857', "+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs", [lat, lon]);
    var lat_32633 = coord_32633[0];
    var lon_32633 = coord_32633[1];

    alert('EPSG:3857 (openlayers)\nx: '+ lat + '\ny: ' + lon +
          '\nESPG:4326 (google)\nx: ' + lat_4326
           + '\ny: ' + lon_4326 + '\nEPSG:32633 (drivemap)\nx: ' + lat_32633 +
           '\ny: ' + lon_32633);
});