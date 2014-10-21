var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.transform([12.5469185, 41.8286509], 'EPSG:4326', 'EPSG:3857')),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 0.75,
    src: 'data/icon.png'
  }))
});

iconFeature.setStyle(iconStyle);

// var vectorSource = new ol.source.Vector({
//   features: [iconFeature]
// });

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

var rasterLayer = new ol.layer.Tile({
  source: new ol.source.MapQuest({layer: 'sat'})
});

var map = new ol.Map({
  layers: [rasterLayer, vectorLayer],
  // layers: [vectorLayer, rasterLayer], // Note: order makes a difference, last one is on top
  // layers: [rasterLayer],
  target: document.getElementById('overhead-map'),
  view: new ol.View({
    center: ol.proj.transform([12.5469185, 41.8286509], 'EPSG:4326', 'EPSG:3857'),
    zoom: 10
  })
});


/*
var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(popup);

// display popup on click
map.on('click', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
  if (feature) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    popup.setPosition(coord);
    $(element).popover({
      'placement': 'top',
      'html': true,
      'content': feature.get('name')
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});

// change mouse cursor when over marker
$(map.getViewport()).on('mousemove', function(e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return true;
  });
  if (hit) {
    map.getTarget().style.cursor = 'pointer';
  } else {
    map.getTarget().style.cursor = '';
  }
});
*/