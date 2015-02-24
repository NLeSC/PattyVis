(function() {
    'use strict';

    function SiteBoxService($rootScope, THREE, sitesservice, CameraService) {
        var me = this;

        var raycaster;
        this.mouse = {
            x: 0,
            y: 0
        };

        this.siteBoxList = [];
        this.referenceFrame = null;

        this.init = function(referenceFrame, mouse) {
            me.referenceFrame = referenceFrame;
            raycaster = new THREE.Raycaster();
            raycaster.params = {
                'PointCloud' : {
                    threshold : 0.1
                }
            };

            me.mouse = mouse;
        };

        this.onSitesChanged = function(sites) {
            if(sitesservice.isLoaded){
                me.siteBoxList = [];
                for(var i=0; i<sites.length; i++){
                  if ('pointcloud' in sites[i]) {
                    me.siteBoxList.push(me.createSiteBox(sites[i]));
                  }
                }
            }
        };

        $rootScope.$watch(function() {
            return sitesservice.all;
        }, this.onSitesChanged);

        this.hoverOver = function(siteBox) {
            siteBox.material.color.setHex(0x99FFFF);
        };

        this.hoverOut = function(siteBox) {
            siteBox.material.color.setHex(0xFF99CC);
        };

        this.listenTo = function(element) {
            element.addEventListener('dblclick', this.selectSite, false);
        };

        this.selectSite = function(event) {
            if(event === undefined) {
                return;
            }

            var selectedSiteBox = me.siteBoxSelection(me.mouse.x, me.mouse.y);
            if (selectedSiteBox) {
                if (selectedSiteBox.hasOwnProperty('textLabel')) {
                    me.toggleTextLabel(selectedSiteBox);
                } else {
                    me.addTextLabel(selectedSiteBox);
                }
            }
        };

        this.toggleTextLabel = function(siteBox) {
            // toggle visibility of textLabel
            siteBox.textLabel.visible = !siteBox.textLabel.visible;
        };

        this.addTextLabel = function( siteBox ){
            // parameters
            var canvasSize = 1000; // pt != on-screen pixels
            var fontsize = 40; // pt (same as canvas size)
            var textBoxPadding = fontsize/2; // pt
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
            var message = siteBox.site.description_site;  // jshint ignore:line
                          // 'SiteBox #' + siteBox.site.id + '\n' +
                          // 'description: ' + siteBox.site.properties.description + '\n' +
                          // 'site_context: ' + siteBox.site.properties.site_context + '\n' +
                          // 'site_interpretation: ' + siteBox.site.properties.site_interpretation + '\n' +
                          // 'condition: ' + siteBox.site.properties.condition + '\n';
            // get size data (height depends only on font size)
            var messageWidth = context.measureText( message ).width;

            // a placeholder box around the text, pending final design by Lode
            var textBoxWidth = messageWidth + 2*textBoxPadding;
            var textBoxHeight = fontsize + 2*textBoxPadding;
            context.fillStyle = textBoxBorderColor;
            context.fillRect(canvas.width/2 - (textBoxWidth/2 + textBoxBorderWidth), canvasSize - fontsize - textBoxPadding*2 - textBoxBorderWidth*2, textBoxWidth + 2*textBoxBorderWidth, textBoxHeight + 2*textBoxBorderWidth);
            context.fillStyle = textBoxFillColor;
            context.fillRect(canvas.width/2 - (textBoxWidth/2), canvasSize - fontsize - textBoxPadding*2 - textBoxBorderWidth, textBoxWidth, textBoxHeight);

            // The two fillText number arguments are canvas-coordinates, so
            // depend on the size of the canvas defined above. The y-coordinate
            // is set to fontsize, otherwise the words fall off the top of the
            // canvas.
            context.fillStyle = fontColor;
            context.fillText(message, canvasSize/2 , canvasSize - fontsize/2 - textBoxPadding/2 - textBoxBorderWidth/2);
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
            var sprite = new THREE.Sprite( spriteMaterial );

            // set scale based on sitebox size (add a certain minimum perhaps?)
            var depth = siteBox.geometry.parameters.depth;
            var height = siteBox.geometry.parameters.height;
            var width = siteBox.geometry.parameters.width;
            var radius = Math.sqrt(depth*depth + height*height + width*width);
            // stretch sprite scale equally in both directions (otherwise canvas
            // gets distorted)
            sprite.scale.set(1.5*radius, 1.5*radius, 1.0);

            sprite.position.set(x, y, z);
            sprite.name = 'textLabel for SiteBox ' + siteBox.site.id;

            // var imageObj = new Image();
            // imageObj.onload = function(){
            //     context.drawImage(imageObj, 10, 10);
            // };
            // imageObj.src = 'data/label-small.png';

            siteBox.textLabel = sprite;
            me.referenceFrame.add( siteBox.textLabel );
        };

        this.createSiteBox = function(site){
            var siteCenter = sitesservice.centerOfSite(site);
            var boxSize = sitesservice.getBoundingBoxSize(site);

            var boxGeometry = new THREE.BoxGeometry(boxSize[0], boxSize[1], boxSize[2]);
            var boxMaterial = new THREE.MeshBasicMaterial({
                color : 0xFF99CC,
                // transparent: false,
                wireframe : true,
                // opacity: 1,
                // overdraw: 0.5
            });
            var bBox = new THREE.Mesh(boxGeometry, boxMaterial);
            bBox.position.set(siteCenter[0], siteCenter[1], siteCenter[2]);
            // bBox.name = site.id;
            bBox.site = site;

            return bBox;
        };

        this.siteBoxSelection = function(mouseX, mouseY) {
            //console.log('mouse x: ' + mouseX);
            //console.log('mouse y: ' + mouseY);
            var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
            vector.unproject(CameraService.camera);
            raycaster.ray.set(CameraService.camera.position, vector.sub(CameraService.camera.position).normalize());

            // hovering over SiteBoxes
            var intersects = raycaster.intersectObjects(me.siteBoxList, false);

            // reset hovering
            me.siteBoxList.forEach(function (siteBox) {
                me.hoverOut(siteBox);
            });

            if (intersects.length > 0) {
                me.hoverOver(intersects[0].object);
                return intersects[0].object;
            } else {
                return null;
            }
        };

    }

    angular.module('pattyApp.pointcloud')
        .service('SiteBoxService', ['$rootScope', 'THREE', 'sitesservice', 'CameraService', SiteBoxService]);
})();
