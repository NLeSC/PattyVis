(function() {
  'use strict';

  function SiteBoxService(THREE, SitesService, CameraService, SceneService, Messagebus) {
    var me = this;

    var raycaster = new THREE.Raycaster();
    raycaster.params = {
      'PointCloud': {
        threshold: 0.1
      }
    };

    this.mouse = {
      x: 0,
      y: 0
    };

    this.siteBoxList = [];
    this.siteBoxReferenceFrame = new THREE.Object3D();
    this.referenceFrame = SceneService.referenceFrame;

    this.colorWithPointcloud = 0x00FF00;
    this.colorWithoutPointcloud = 0xFF0000;

    this.init = function(mouse) {
      me.mouse = mouse;
    };

    this.onSitesChanged = function(sites) {
      me.siteBoxList = [];
      me.referenceFrame.remove(me.siteBoxReferenceFrame);
      me.siteBoxReferenceFrame = new THREE.Object3D();

      for (var i = 0; i < sites.length; i++) {
        if (
          sites[i].pointcloud.length !== 0 || 'footprint' in sites[i]
        ) {
          var siteBox = me.createSiteBox(sites[i]);
          me.siteBoxList.push(siteBox);
          me.siteBoxReferenceFrame.add(siteBox);
        }
      }
      me.referenceFrame.add(me.siteBoxReferenceFrame);
    };

    SitesService.ready.then(function() {
      var sites = SitesService.all;
      me.onSitesChanged(sites);
    });

    this.onSitesFiltered = function(sites) {
      me.siteBoxList.forEach(function(siteBox) {
        if (contains(sites, siteBox.site)) {
          siteBox.material.opacity = 1;
        } else {
          siteBox.material.opacity = 0.1;
        }
      });
    };

    Messagebus.subscribe('sitesChanged', function() {
      var visibleSites = SitesService.filtered;
      me.onSitesFiltered(visibleSites);
    });

    this.hoverOver = function(siteBox) {
      if(siteBox === null){
        return;
      }
      siteBox.material.color.setHex(0x99FFFF);
    };

    this.hoverOut = function(siteBox) {
      if(siteBox === null){
        return;
      }
      siteBox.material.color.set(siteBox.defaultMaterial.color);
      //siteBox.material.color.setHex(0xFF99CC);
    };

    this.resetHovering = function() {
      me.siteBoxList.forEach(function(siteBox) {
        me.hoverOut(siteBox);
      });
    };

    /**
     * Handle the hovering over site boxes.
     * This function is called in the render loop of the pointcloud service.
     * @param {float} mouseX x coordinate of the current mouse position
     * @param {float} mouseY y coordinate of the current mouse position
     */
    this.doHovering = function(mouseX, mouseY) {
      me.resetHovering();
      var nearestSiteBox = me.detectNearestSiteBoxUnderMouse(mouseX, mouseY);
      me.hoverOver(nearestSiteBox);
    };

    this.listenTo = function(element) {
      element.addEventListener('dblclick', this.selectSite, false);
    };

    this.selectSite = function(event) {
      if (event === undefined) {
        return;
      }

      var selectedSiteBox = me.detectNearestSiteBoxUnderMouse(me.mouse.x, me.mouse.y);
      if (selectedSiteBox) {
        //if (selectedSiteBox.hasOwnProperty('textLabel')) {
        //  me.toggleTextLabel(selectedSiteBox);
        //} else {
        //  me.addTextLabel(selectedSiteBox);
        //}
        Messagebus.publish('siteSelected', selectedSiteBox.site);
      }
    };

    this.toggleTextLabel = function(siteBox) {
      // toggle visibility of textLabel
      siteBox.textLabel.visible = !siteBox.textLabel.visible;
    };

    this.addTextLabel = function(siteBox) {
      // parameters
      var canvasSize = 1000; // pt != on-screen pixels
      var fontsize = 40; // pt (same as canvas size)
      var textBoxPadding = fontsize / 2; // pt
      var textBoxBorderWidth = 1; // pt
      var textBoxBorderColor = 'rgba(0,0,0, 0.8)';
      var textBoxFillColor = 'rgba(255,255,255, 0.8)';
      var fontColor = 'rgb(0,0,0)';

      var x = siteBox.position.x;
      var y = siteBox.position.y;
      var z = siteBox.position.z;


      var canvas = document.createElement('canvas');
      // keep canvas square to avoid stretching problems (see sprite size
      // below as well):
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      var context = canvas.getContext('2d');


      // background color
      //context.fillStyle   = 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ','
      //+ backgroundColor.b + ',' + backgroundColor.a + ')';

      //context.strokeStyle = 'rgba(' + borderColor.r + ',' + borderColor.g + ','
      //+ borderColor.b + ',' + borderColor.a + ')';

      //context.lineWidth = borderThickness;
      //roundRect(context, borderThickness/2, borderThickness/2, messageWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
      // 1.4 is extra height factor for text below baseline: g,j,p,q.

      // text color
      //context.fillStyle = 'rgba(0, 0, 0, 1.0)';

      //context.fillText(message, borderThickness, fontsize + borderThickness);

      context.font = fontsize + 'pt Calibri';
      context.textAlign = 'center';

      // the text we want to write
      var message = siteBox.site.description_site; // jshint ignore:line
      // 'SiteBox #' + siteBox.site.id + '\n' +
      // 'description: ' + siteBox.site.properties.description + '\n' +
      // 'site_context: ' + siteBox.site.properties.site_context + '\n' +
      // 'site_interpretation: ' + siteBox.site.properties.site_interpretation + '\n' +
      // 'condition: ' + siteBox.site.properties.condition + '\n';
      // get size data (height depends only on font size)
      var messageWidth = context.measureText(message).width;

      // a placeholder box around the text, pending final design by Lode
      var textBoxWidth = messageWidth + 2 * textBoxPadding;
      var textBoxHeight = fontsize + 2 * textBoxPadding;
      context.fillStyle = textBoxBorderColor;
      context.fillRect(canvas.width / 2 - (textBoxWidth / 2 + textBoxBorderWidth), canvasSize - fontsize - textBoxPadding * 2 - textBoxBorderWidth * 2, textBoxWidth + 2 * textBoxBorderWidth, textBoxHeight + 2 * textBoxBorderWidth);
      context.fillStyle = textBoxFillColor;
      context.fillRect(canvas.width / 2 - (textBoxWidth / 2), canvasSize - fontsize - textBoxPadding * 2 - textBoxBorderWidth, textBoxWidth, textBoxHeight);

      // The two fillText number arguments are canvas-coordinates, so
      // depend on the size of the canvas defined above. The y-coordinate
      // is set to fontsize, otherwise the words fall off the top of the
      // canvas.
      context.fillStyle = fontColor;
      context.fillText(message, canvasSize / 2, canvasSize - fontsize / 2 - textBoxPadding / 2 - textBoxBorderWidth / 2);
      // canvas contents will be used for a texture
      var texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        useScreenCoordinates: false,
        // transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      var sprite = new THREE.Sprite(spriteMaterial);

      // set scale based on sitebox size (add a certain minimum perhaps?)
      var depth = SitesService.getBoundingBoxSize(siteBox.site)[0];
      var height = SitesService.getBoundingBoxSize(siteBox.site)[1];
      var width = SitesService.getBoundingBoxSize(siteBox.site)[2];
      var radius = Math.sqrt(depth * depth + height * height + width * width);
      // stretch sprite scale equally in both directions (otherwise canvas
      // gets distorted)
      sprite.scale.set(1.5 * radius, 1.5 * radius, 1.0);

      sprite.position.set(x, y, z);
      sprite.name = 'textLabel for SiteBox ' + siteBox.site.id;

      // var imageObj = new Image();
      // imageObj.onload = function(){
      //     context.drawImage(imageObj, 10, 10);
      // };
      // imageObj.src = 'data/label-small.png';

      siteBox.textLabel = sprite;
      me.referenceFrame.add(siteBox.textLabel);
    };

    this.createSiteBox = function(site) {
      var bBox;

      var siteCenter = SitesService.centerOfSite(site);
      //var boxSize = SitesService.getBoundingBoxSize(site);
      //var siteFootprint = site.footprint;

      var boxColor = this.colorWithPointcloud;
      if (site.pointcloud.length === 0 ) {
        boxColor = this.colorWithoutPointcloud;
      }

      var boxMaterial = new THREE.MeshBasicMaterial({
        color: boxColor,
        side: THREE.DoubleSide,
        transparent: true,
        wireframe: true,
        opacity: 1
        // overdraw: 0.5
      });

      var geometry = new THREE.Geometry();

      if (site.footprint !== undefined) {
        site.footprint.forEach(function(polygon) {
          polygon.forEach(function(ring) {
            var point0, point1, counter = 0;
            for (var i =0; i < ring.length-1; i++) {
              point0 = ring[i];
              point1 = ring[i+1];

              geometry.vertices.push(new THREE.Vector3(point0[0]-siteCenter[0], point0[1]-siteCenter[1], 0));
              geometry.vertices.push(new THREE.Vector3(point1[0]-siteCenter[0], point1[1]-siteCenter[1], 0));
              geometry.vertices.push(new THREE.Vector3(point0[0]-siteCenter[0], point0[1]-siteCenter[1], 1));

              geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

              geometry.vertices.push(new THREE.Vector3(point0[0]-siteCenter[0], point0[1]-siteCenter[1], 1));
              geometry.vertices.push(new THREE.Vector3(point1[0]-siteCenter[0], point1[1]-siteCenter[1], 0));
              geometry.vertices.push(new THREE.Vector3(point1[0]-siteCenter[0], point1[1]-siteCenter[1], 1));

              geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );
            }

            point0 = ring[ring.length-1];
            point1 = ring[0];

            geometry.vertices.push(new THREE.Vector3(point0[0]-siteCenter[0], point0[1]-siteCenter[1], 0));
            geometry.vertices.push(new THREE.Vector3(point1[0]-siteCenter[0], point1[1]-siteCenter[1], 0));
            geometry.vertices.push(new THREE.Vector3(point0[0]-siteCenter[0], point0[1]-siteCenter[1], 1));

            geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

            geometry.vertices.push(new THREE.Vector3(point0[0]-siteCenter[0], point0[1]-siteCenter[1], 1));
            geometry.vertices.push(new THREE.Vector3(point1[0]-siteCenter[0], point1[1]-siteCenter[1], 0));
            geometry.vertices.push(new THREE.Vector3(point1[0]-siteCenter[0], point1[1]-siteCenter[1], 1));

            geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );
          });
        });
      } else {
        var boxSize = SitesService.getBoundingBoxSize(site);
        geometry = new THREE.BoxGeometry(boxSize[0], boxSize[1], boxSize[2]);
      }

      bBox = new THREE.Mesh(geometry, boxMaterial);
      if (site.footprint_altitude !== undefined) {
        bBox.position.set(siteCenter[0], siteCenter[1], site.footprint_altitude[0]);
      } else {
        bBox.position.set(siteCenter[0], siteCenter[1], siteCenter[2]);
      }

      // bBox.name = site.id;
      bBox.site = site;

      bBox.defaultMaterial = boxMaterial.clone();

      return bBox;
    };

    this.detectNearestSiteBoxUnderMouse = function(mouseX, mouseY) {
      //console.log('mouse x: ' + mouseX);
      //console.log('mouse y: ' + mouseY);
      var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
      vector.unproject(CameraService.camera);
      raycaster.ray.set(CameraService.camera.position, vector.sub(CameraService.camera.position).normalize());

      var intersects = raycaster.intersectObjects(me.siteBoxList, false);

      if (intersects.length > 0) {
        return intersects[0].object;
      } else {
        return null;
      }
    };

    function contains(a, obj) {
      var i = a.length;
      while (i--) {
         if (a[i] === obj) {
             return true;
         }
      }
      return false;
    }

  }

  angular.module('pattyApp.pointcloud')
    .service('SiteBoxService', SiteBoxService);
})();
