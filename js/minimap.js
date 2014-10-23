proj4.defs("EPSG:32633", "+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
proj4.defs('urn:ogc:def:crs:EPSG::32633', proj4.defs('EPSG:32633'));

var siteProjectionCode = "EPSG:32633";
var siteProjection = ol.proj.get(siteProjectionCode);
var siteStyle =  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 10
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  })

function centerMap(center) {
  map.getView().setCenter(ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'));
}


//

var sitesFormat = new ol.format.GeoJSON({
    defaultDataProjection: siteProjection,
    geometryName: "sites"})


// function takes features array
function plotMarkers(GeoJSONfeatureCollection) {
  // first remove old ones
  var oldFeatures = vectorSource.getFeatures();
  function removeMarker(m) {
    vectorSource.removeFeature(m);
  }
  oldFeatures.forEach(removeMarker);

  // then add new ones
  if (GeoJSONfeatureCollection.features.length === 0) {
    // show all sites when there are no search results
    GeoJSONfeatureCollection = sites_geojson;
  }
  var featuresArray = sitesFormat.readFeatures(GeoJSONfeatureCollection);
  vectorSource.addFeatures(featuresArray);
  centerOnVisibleSites();
}

var sites_geojson = {};

$.getJSON('data/sites.json', function(data) {
    sites_geojson = data;
    var featuresArray = sitesFormat.readFeatures(sites_geojson);
    vectorSource.clear();
    vectorSource.addFeatures(featuresArray);
    centerOnVisibleSites();
});

var vectorSource = new ol.source.GeoJSON({
    projection: siteProjection
});

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
  target: document.getElementById('overhead-map'),
  view: new ol.View({
    center: ol.proj.transform([12.5469185, 41.8286509], 'EPSG:4326', 'EPSG:3857'),
    zoom: 10
  })
});
// center on sites
function centerOnVisibleSites() {
  map.getView().fitExtent(vectorSource.getExtent(), map.getSize());
}
centerOnVisibleSites();

map.on('rightclick', function(event) {
	event.preventDefault();

	debugger

	return false;
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
    var coord_32633 = proj4('EPSG:3857', siteProjectionCode, [lat, lon]);
    var lat_32633 = coord_32633[0];
    var lon_32633 = coord_32633[1];

    alert('EPSG:3857 (openlayers)\nx: '+ lat + '\ny: ' + lon +
          '\nESPG:4326 (google)\nx: ' + lat_4326
           + '\ny: ' + lon_4326 + '\nEPSG:32633 (drivemap)\nx: ' + lat_32633 +
           '\ny: ' + lon_32633);
});
