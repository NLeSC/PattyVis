(function() {
    'use strict';

    function SiteBoxService($rootScope, THREE, sitesservice, CameraService, SceneService) {
        var me = this;

        this.siteBoxList = [];
        this.selectedSiteBox = null;
        this.isSiteBoxSelected = false;
        this.referenceFrame = null;

        this.init = function(referenceFrame) {
            me.referenceFrame = referenceFrame;
        };

        this.onSitesChanged = function(sites) {
            if(sitesservice.isLoaded){
                me.siteBoxList = [];
                for(i=0; i<sites.features.length; i++){
                    me.siteBoxList.push(me.createSiteBox(sites.features[i]));
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
            if (me.isSiteBoxSelected) {
                me.addTextLabel(me.selectedSiteBox);
            }
        };

        this.addTextLabel = function( siteBox ){
            var x = siteBox.position.x;
            var y = siteBox.position.y;
            var z = siteBox.position.z;
            var message = "selected SiteBox: " + siteBox.name;
            var name = "textLabel for SiteBox " + siteBox.name;

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            //context.font = "Bold " + fontsize + "px " + fontface;

            // get size data (height depends only on font size)
            // var metrics = context.measureText( message );
            // var textWidth = metrics.width;

            // background color
            //context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            //+ backgroundColor.b + "," + backgroundColor.a + ")";

            //context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            //+ borderColor.b + "," + borderColor.a + ")";

            //context.lineWidth = borderThickness;
            //roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
            // 1.4 is extra height factor for text below baseline: g,j,p,q.

            // text color
            //context.fillStyle = "rgba(0, 0, 0, 1.0)";

            //context.fillText( message, borderThickness, fontsize + borderThickness);

            context.font = "40pt Calibri";
            context.fillText(message, 30, 70);
            // canvas contents will be used for a texture
            var texture = new THREE.Texture(canvas)
            texture.needsUpdate = true;

            var spriteMaterial = new THREE.SpriteMaterial(
                { map: texture, useScreenCoordinates: false,} );
            var sprite = new THREE.Sprite( spriteMaterial );
            //sprite.scale.set(100,50,1.0);
            sprite.scale.set(10, 5, 1.0);

            sprite.position.set(x, y, z);
            sprite.name = name; 

            // var scene = SceneService.getScene();
            // scene.add( sprite );
            me.referenceFrame.add( sprite );

            var imageObj = new Image();
            imageObj.onload = function(){
                context.drawImage(imageObj, 10, 10);
            };
            imageObj.src = "data/label-small.png";
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
            bBox.name = site.id;

            return bBox;
        }

        this.siteBoxSelection = function(mouseX, mouseY, raycaster) {
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
                me.selectedSiteBox = intersects[0].object;
                me.isSiteBoxSelected = true;
                me.hoverOver(me.selectedSiteBox);
            } else {
                me.isSiteBoxSelected = false;
            }
        }

    }

    angular.module('pattyApp.pointcloud')
        .service('SiteBoxService', ['$rootScope', 'THREE', 'sitesservice', 'CameraService', 'SceneService', SiteBoxService]);
})();
